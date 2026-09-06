/** Real CPython in the browser, via Pyodide (WebAssembly).
 *
 *  Loaded lazily from the CDN the first time a learner runs anything, then kept
 *  for the rest of the session. Every run gets a fresh namespace so one exercise
 *  cannot leak variables into the next. */

import type { PyTest } from '../content/types'
import { BOOTSTRAP_PY } from './pythonModules'

const PYODIDE_VERSION = '0.26.4'
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

interface Pyodide {
  runPythonAsync(code: string, options?: { globals?: unknown }): Promise<unknown>
  setStdout(opts: { batched: (s: string) => void }): void
  setStderr(opts: { batched: (s: string) => void }): void
  setStdin(opts: { stdin: () => string | null; autoEOF?: boolean }): void
  globals: { get(name: string): any }
  loadPackage(names: string | string[]): Promise<unknown>
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<Pyodide>
  }
}

let pyodidePromise: Promise<Pyodide> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('failed to load Pyodide')))
      if (window.loadPyodide) resolve()
      return
    }
    const el = document.createElement('script')
    el.src = src
    el.onload = () => resolve()
    el.onerror = () => reject(new Error('failed to load Pyodide'))
    document.head.appendChild(el)
  })
}

export function isPythonReady(): boolean {
  return pyodidePromise !== null && ready
}

let ready = false

export function getPython(): Promise<Pyodide> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadScript(`${CDN}pyodide.js`)
      if (!window.loadPyodide) throw new Error('Pyodide loader missing')
      const py = await window.loadPyodide({ indexURL: CDN })
      // Lay down the course's own modules before anything can import them.
      await py.runPythonAsync(BOOTSTRAP_PY)
      ready = true
      return py
    })().catch((err) => {
      pyodidePromise = null
      throw err
    })
  }
  return pyodidePromise
}

/** Packages beyond the base Pyodide distribution, fetched only when a piece of
 *  code actually imports one — plain-Python exercises never pay for this.
 *
 *  Checked against the real package lock for the pinned Pyodide version:
 *  numpy, scipy, sympy and matplotlib all exist as loadable wheels here;
 *  pygame, tkinter, turtle, kivy, arcade, ursina, manim, vpython, streamlit
 *  and seaborn do not — there is no display, window system, or renderer for
 *  them to draw into inside a browser tab, and no amount of loadPackage
 *  fixes that. Those stay theory-only content; these four are the ones a
 *  lesson can actually run and check. */
const CATALOGUED_PACKAGES: { rx: RegExp; name: string }[] = [
  { rx: /\bimport\s+numpy\b|\bfrom\s+numpy\b/, name: 'numpy' },
  { rx: /\bimport\s+scipy\b|\bfrom\s+scipy\b/, name: 'scipy' },
  { rx: /\bimport\s+sympy\b|\bfrom\s+sympy\b/, name: 'sympy' },
  { rx: /\bimport\s+matplotlib\b|\bfrom\s+matplotlib\b/, name: 'matplotlib' },
]

const loadedPackages = new Set<string>()

/** Scans `text` for one of the imports above and loads it if not already
 *  loaded. Must be called with everything about to run — a learner's code
 *  alone is not enough, since a test's own `setup` or `assert` can import a
 *  package the learner's snippet never mentions. */
async function ensurePackages(py: Pyodide, text: string): Promise<void> {
  for (const { rx, name } of CATALOGUED_PACKAGES) {
    if (rx.test(text) && !loadedPackages.has(name)) {
      await py.loadPackage(name)
      loadedPackages.add(name)
    }
  }
}

export interface RunResult {
  stdout: string
  /** Present when the program raised. Already trimmed to the useful part. */
  error?: string
}

/** Shadow `input` so the prompt is not echoed into stdout.
 *  Without this, `input("Nilai: ")` would pollute the output a test compares
 *  against, and every exercise would have to guess the learner's prompt text. */
const PREAMBLE = `
import builtins as _nunada_b
def input(_prompt=""):
    return _nunada_b.input()
`

async function prepare(py: Pyodide, ns: unknown): Promise<void> {
  await py.runPythonAsync(PREAMBLE, { globals: ns })
}

/** Turn a Python traceback into the one or two lines a beginner can act on. */
export function friendlyError(raw: string): string {
  const lines = raw.trimEnd().split('\n')
  // Drop Pyodide's own frames; keep the learner's traceback tail.
  const keep = lines.filter((l) => !l.includes('/lib/python3') && !l.includes('pyodide'))
  const tail = keep.slice(-4).join('\n').trim()
  return tail || raw.trim()
}

/** Turn a textarea of input lines into the queue `input()` will read from.
 *  A trailing newline in the box is an artefact of typing, not an empty line. */
export function splitStdin(text: string): string[] {
  const lines = text.split('\n')
  if (lines.length && lines[lines.length - 1] === '') lines.pop()
  return lines
}

export async function runPython(code: string, stdin: string[] = []): Promise<RunResult> {
  const py = await getPython()
  let out = ''

  py.setStdout({ batched: (s) => { out += s + '\n' } })
  py.setStderr({ batched: (s) => { out += s + '\n' } })

  let queue = [...stdin]
  py.setStdin({ stdin: () => (queue.length ? queue.shift()! : null), autoEOF: true })

  const dict = py.globals.get('dict')
  const ns = dict()
  try {
    await ensurePackages(py, code)
    // Note: no PREAMBLE here — a free run should echo the prompt, like a terminal.
    await py.runPythonAsync(code, { globals: ns })
    return { stdout: out }
  } catch (err) {
    return { stdout: out, error: friendlyError(String((err as Error).message ?? err)) }
  } finally {
    queue = []
    ns.destroy?.()
    dict.destroy?.()
  }
}

export interface TestOutcome {
  test: PyTest
  passed: boolean
  stdout: string
  /** Why it failed, in plain terms. */
  detail?: string
}

/** Compare loosely enough that trailing spaces and a missing final newline
 *  never fail an otherwise-correct answer. */
function normalize(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n+$/, '')
}

export async function runTests(code: string, tests: PyTest[]): Promise<TestOutcome[]> {
  const py = await getPython()
  const outcomes: TestOutcome[] = []

  for (const test of tests) {
    let out = ''
    py.setStdout({ batched: (s) => { out += s + '\n' } })
    py.setStderr({ batched: (s) => { out += s + '\n' } })

    const queue = [...(test.stdin ?? [])]
    py.setStdin({ stdin: () => (queue.length ? queue.shift()! : null), autoEOF: true })

    const dict = py.globals.get('dict')
    const ns = dict()
    try {
      // Scanned together: a test's own setup or assert can import a package
      // the learner's code never mentions, e.g. building a numpy fixture for
      // them or checking the result with np.allclose.
      await ensurePackages(py, `${code}\n${test.setup ?? ''}\n${test.assert ?? ''}`)
      await prepare(py, ns)
      if (test.setup) await py.runPythonAsync(test.setup, { globals: ns })
      await py.runPythonAsync(code, { globals: ns })

      let passed = true
      let detail: string | undefined

      // The assert snippet runs first: a test may call the learner's function and
      // then compare what that call printed.
      if (test.assert) {
        try {
          await py.runPythonAsync(test.assert, { globals: ns })
        } catch (err) {
          passed = false
          detail = friendlyError(String((err as Error).message ?? err))
        }
      }

      if (passed && test.expectOutput !== undefined) {
        if (normalize(out) !== normalize(test.expectOutput)) {
          passed = false
          detail = undefined // the UI shows an output/expected diff instead
        }
      }

      if (passed && test.expectContains?.length) {
        const hay = out.toLowerCase()
        const missing = test.expectContains.filter((frag) => !hay.includes(frag.toLowerCase()))
        if (missing.length) {
          passed = false
          detail = `Output is missing: ${missing.join(', ')}`
        }
      }

      outcomes.push({ test, passed, stdout: out, detail })
    } catch (err) {
      outcomes.push({
        test,
        passed: false,
        stdout: out,
        detail: friendlyError(String((err as Error).message ?? err)),
      })
    } finally {
      ns.destroy?.()
      dict.destroy?.()
    }
  }

  return outcomes
}

/* ------------------------------------------------------- interactive run */

/** True in a browser tab that is cross-origin isolated — the only place
 *  `SharedArrayBuffer` (and therefore genuinely blocking `input()`, see
 *  ./pythonWorker.ts) exists at all. `main.tsx` arranges for that to be true
 *  everywhere this app is served, including GitHub Pages, via a
 *  service-worker shim — but a caller should still check this and fall back
 *  to the plain `runPython` + a pre-filled stdin box rather than hang
 *  forever waiting for a worker message that can never arrive. */
export const pythonInteractiveAvailable = typeof SharedArrayBuffer !== 'undefined'

const SAB_DATA_BYTES = 4096
// How long a run may go without producing output or asking for input before
// it's treated as a runaway loop and the worker is killed and replaced.
// Generous on purpose: this is a safety net, not a normal-case limit.
const WATCHDOG_MS = 15000

let interactiveWorker: Worker | null = null
let interactiveReady: Promise<void> | null = null
let nextRunId = 1

function getInteractiveWorker(): Worker {
  if (!interactiveWorker) {
    interactiveWorker = new Worker(new URL('./pythonWorker.ts', import.meta.url), { type: 'module' })
  }
  return interactiveWorker
}

function ensureInteractiveReady(): Promise<void> {
  const worker = getInteractiveWorker()
  if (!interactiveReady) {
    interactiveReady = new Promise<void>((resolve, reject) => {
      function onMessage(ev: MessageEvent) {
        const msg = ev.data ?? {}
        if (msg.type === 'ready') {
          worker.removeEventListener('message', onMessage)
          resolve()
        } else if (msg.type === 'load-failed') {
          worker.removeEventListener('message', onMessage)
          reject(new Error(msg.message))
        }
      }
      worker.addEventListener('message', onMessage)
      worker.postMessage({ type: 'load' })
    }).catch((err) => {
      interactiveReady = null
      throw err
    })
  }
  return interactiveReady
}

/** Kill a hung worker and forget it, so the next call spins up a fresh one —
 *  mirrors the same "terminate and respawn" recovery the user's other
 *  project (PyKelas) uses for exactly this failure mode. */
function restartInteractiveWorker(): void {
  interactiveWorker?.terminate()
  interactiveWorker = null
  interactiveReady = null
}

export interface InteractiveHandlers {
  /** A slice of the program's output, in the order it printed. */
  onChunk: (text: string) => void
  /** Called each time the program calls `input()`. Invoke `submit` with what
   *  the learner typed to let the program continue — it may be called again
   *  for the next `input()` call after that. */
  onWaitingForInput: (submit: (value: string) => void) => void
}

/** Run `code` with real, live `input()`: the program actually pauses at each
 *  call (via ./pythonWorker.ts's `Atomics.wait`) until `handlers` supplies a
 *  value, rather than reading from a queue prepared in advance. Requires
 *  `pythonInteractiveAvailable`. */
export function runPythonInteractive(code: string, handlers: InteractiveHandlers): Promise<RunResult> {
  const id = nextRunId++
  const sab = new SharedArrayBuffer(8 + SAB_DATA_BYTES)

  return ensureInteractiveReady().then(
    () =>
      new Promise<RunResult>((resolve) => {
        const worker = getInteractiveWorker()
        let watchdog: ReturnType<typeof setTimeout> | null = null
        let settled = false

        function clearWatchdog() {
          if (watchdog !== null) {
            clearTimeout(watchdog)
            watchdog = null
          }
        }

        function armWatchdog() {
          clearWatchdog()
          watchdog = setTimeout(() => {
            if (settled) return
            settled = true
            worker.removeEventListener('message', onMessage)
            restartInteractiveWorker()
            resolve({ stdout: '', error: 'This took too long and was stopped. Check for a loop that never ends.' })
          }, WATCHDOG_MS)
        }

        function onMessage(ev: MessageEvent) {
          const msg = ev.data ?? {}
          if (msg.id !== id || settled) return

          if (msg.type === 'chunk') {
            handlers.onChunk(msg.text)
            armWatchdog()
            return
          }

          if (msg.type === 'need-input') {
            clearWatchdog() // a human may take a long time to answer
            handlers.onWaitingForInput((value: string) => {
              const bytes = new TextEncoder().encode(value)
              const length = Math.min(bytes.length, SAB_DATA_BYTES)
              new Uint8Array(sab, 8, SAB_DATA_BYTES).set(bytes.subarray(0, length))
              const control = new Int32Array(sab, 0, 2)
              Atomics.store(control, 1, length)
              Atomics.store(control, 0, 1)
              Atomics.notify(control, 0, 1)
              armWatchdog()
            })
            return
          }

          if (msg.type === 'result') {
            settled = true
            clearWatchdog()
            worker.removeEventListener('message', onMessage)
            resolve({ stdout: msg.stdout, error: msg.error ? friendlyError(msg.error) : undefined })
          }
        }

        worker.addEventListener('message', onMessage)
        armWatchdog()
        worker.postMessage({ type: 'run', id, code, sab })
      }),
  )
}
