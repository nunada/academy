/** Real CPython in the browser, via Pyodide (WebAssembly).
 *
 *  Loaded lazily from the CDN the first time a learner runs anything, then kept
 *  for the rest of the session. Every run gets a fresh namespace so one exercise
 *  cannot leak variables into the next. */

import type { PyTest } from '../content/types'

const PYODIDE_VERSION = '0.26.4'
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

interface Pyodide {
  runPythonAsync(code: string, options?: { globals?: unknown }): Promise<unknown>
  setStdout(opts: { batched: (s: string) => void }): void
  setStderr(opts: { batched: (s: string) => void }): void
  setStdin(opts: { stdin: () => string | null; autoEOF?: boolean }): void
  globals: { get(name: string): any }
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
      ready = true
      return py
    })().catch((err) => {
      pyodidePromise = null
      throw err
    })
  }
  return pyodidePromise
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
function friendlyError(raw: string): string {
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
      await prepare(py, ns)
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
