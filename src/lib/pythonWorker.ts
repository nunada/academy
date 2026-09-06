/** Runs Pyodide inside a Worker, so a learner's `input()` call can genuinely
 *  block this thread — via `Atomics.wait()` on a `SharedArrayBuffer` — while
 *  they type an answer, without freezing the tab. That is the only way to
 *  pause a synchronous CPython call mid-execution; it is also why this needs
 *  a worker at all rather than just running on the main thread like the rest
 *  of `./python.ts`.
 *
 *  Used only by the interactive "Run" path (`runPythonInteractive` in
 *  `./python.ts`). Every graded Check, and the free-run fallback for a
 *  browser that isn't cross-origin isolated, still go through the existing
 *  main-thread engine in `./python.ts`, completely unchanged — this file
 *  intentionally duplicates a small amount of Pyodide-loading boilerplate
 *  from there rather than sharing it, since a Pyodide instance cannot cross
 *  the worker boundary.
 *
 *  Message protocol (all via postMessage):
 *    in  { type: 'load' }
 *    out { type: 'ready' } | { type: 'load-failed', message }
 *    in  { type: 'run', id, code, sab }
 *    out { type: 'chunk', id, text }         - zero or more, as print() runs
 *    out { type: 'need-input', id }          - zero or more, one per input()
 *    out { type: 'result', id, stdout, error? }
 *
 *  Shape of the SharedArrayBuffer `sab` (8 + SAB_DATA_BYTES bytes), mirroring
 *  the same technique in the user's other project, PyKelas:
 *    Int32Array(sab, 0, 2): [0] status (0 = worker waiting, 1 = data ready),
 *                           [1] byte length of the value the main thread wrote.
 *    Uint8Array(sab, 8, SAB_DATA_BYTES): the UTF-8 bytes of what was typed. */

import { BOOTSTRAP_PY } from './pythonModules'

// Must match PYODIDE_VERSION in ./python.ts — two separate files, no build
// step shares the constant between a worker and the main thread.
const PYODIDE_VERSION = '0.26.4'
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

const SAB_DATA_BYTES = 4096
// A human may take a long time to answer; this must not be mistaken for a
// runaway program. The JS-side watchdog in python.ts covers the real hang case.
const INPUT_WAIT_TIMEOUT_MS = 15 * 60 * 1000

interface Pyodide {
  runPythonAsync(code: string, options?: { globals?: unknown }): Promise<unknown>
  globals: { set(name: string, value: unknown): void; get(name: string): any }
  loadPackage(names: string | string[]): Promise<unknown>
}

/** Packages beyond the base Pyodide distribution — kept in sync with the
 *  identical table in ./python.ts. A learner's `input()`-using code can just
 *  as easily `import numpy` as a graded one. */
const CATALOGUED_PACKAGES: { rx: RegExp; name: string }[] = [
  { rx: /\bimport\s+numpy\b|\bfrom\s+numpy\b/, name: 'numpy' },
  { rx: /\bimport\s+scipy\b|\bfrom\s+scipy\b/, name: 'scipy' },
  { rx: /\bimport\s+sympy\b|\bfrom\s+sympy\b/, name: 'sympy' },
  { rx: /\bimport\s+matplotlib\b|\bfrom\s+matplotlib\b/, name: 'matplotlib' },
]
const loadedPackages = new Set<string>()

async function ensurePackages(py: Pyodide, text: string): Promise<void> {
  for (const { rx, name } of CATALOGUED_PACKAGES) {
    if (rx.test(text) && !loadedPackages.has(name)) {
      await py.loadPackage(name)
      loadedPackages.add(name)
    }
  }
}

/** The Python-side harness, installed once. `input()` is replaced with a
 *  version that writes its prompt straight to the (intercepted) stdout, then
 *  blocks on `_nunada_request_input()` — a JS bridge function bound below —
 *  for the value itself. */
const HARNESS_PY = `
import sys, io, builtins

class _Board(io.StringIO):
    def write(self, s):
        if s:
            _nunada_chunk(s)
        return super().write(s)

def _nunada_run(src):
    board = _Board()

    def _input(prompt=""):
        if prompt:
            board.write(str(prompt))
        value = _nunada_request_input()
        if value is None:
            raise TimeoutError("Timed out waiting for input.")
        return value

    input_orig = builtins.input
    stdout_orig, stderr_orig = sys.stdout, sys.stderr
    builtins.input = _input
    sys.stdout = board
    sys.stderr = board
    error = None
    try:
        exec(compile(src, "<program>", "exec"), {"__name__": "__main__"})
    except SystemExit:
        pass
    except BaseException as e:
        error = f"{type(e).__name__}: {e}"
    finally:
        builtins.input = input_orig
        sys.stdout = stdout_orig
        sys.stderr = stderr_orig
    return board.getvalue(), error
`

let pyodide: Pyodide | null = null
let loading: Promise<Pyodide> | null = null

// State for whichever 'run' is currently in flight. Safe as plain module
// state: Python execution here is synchronous, so there is never more than
// one run actually executing at a time.
let currentId: number | null = null
let currentSab: SharedArrayBuffer | null = null

function sendChunk(text: string): void {
  if (currentId !== null) postMessage({ type: 'chunk', id: currentId, text })
}

/** Bound onto Python as `_nunada_request_input`. Blocks this worker thread
 *  for real via Atomics — the whole reason this file is a worker. */
function requestInput(): string | null {
  if (!currentSab) return null
  const control = new Int32Array(currentSab, 0, 2)

  Atomics.store(control, 0, 0)
  postMessage({ type: 'need-input', id: currentId })

  const outcome = Atomics.wait(control, 0, 0, INPUT_WAIT_TIMEOUT_MS)
  if (outcome === 'timed-out') return null

  const length = Atomics.load(control, 1)
  const bytes = new Uint8Array(currentSab, 8, SAB_DATA_BYTES)
  return new TextDecoder().decode(bytes.slice(0, length))
}

async function load(): Promise<Pyodide> {
  if (pyodide) return pyodide
  if (!loading) {
    loading = (async () => {
      // The .mjs build (not the classic .js one ./python.ts loads on the main
      // thread) because this file is a module worker — needed so `import`
      // above works unbundled in dev; Vite bundles it to a classic script for
      // the production build regardless, but the source has to work both ways.
      const { loadPyodide } = await import(/* @vite-ignore */ `${CDN}pyodide.mjs`)
      const py = await loadPyodide({ indexURL: CDN })
      py.globals.set('_nunada_chunk', sendChunk)
      py.globals.set('_nunada_request_input', requestInput)
      await py.runPythonAsync(BOOTSTRAP_PY)
      await py.runPythonAsync(HARNESS_PY)
      pyodide = py
      return py
    })().catch((err) => {
      loading = null
      throw err
    })
  }
  return loading
}

self.onmessage = async (ev: MessageEvent) => {
  const msg = ev.data ?? {}

  if (msg.type === 'load') {
    try {
      await load()
      postMessage({ type: 'ready' })
    } catch (err) {
      postMessage({ type: 'load-failed', message: String((err as Error).message ?? err) })
    }
    return
  }

  if (msg.type === 'run') {
    currentId = msg.id
    currentSab = msg.sab ?? null
    try {
      const py = await load()
      await ensurePackages(py, msg.code)
      const run = py.globals.get('_nunada_run')
      const raw = await run(msg.code)
      const [stdout, error] = raw.toJs()
      raw.destroy?.()
      run.destroy?.()
      postMessage({ type: 'result', id: msg.id, stdout, error: error ?? undefined })
    } catch (err) {
      postMessage({ type: 'result', id: msg.id, stdout: '', error: String((err as Error).message ?? err) })
    } finally {
      currentId = null
      currentSab = null
    }
  }
}
