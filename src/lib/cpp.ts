/** An educational subset of C++, interpreted in JavaScript by JSCPP.
 *
 *  Unlike Pyodide this is not a real compiler — JSCPP is a hand-written
 *  interpreter for the core of the language: primitive types, arrays, pointers,
 *  control flow and functions. It has no `std::string`, no `std::vector`, and
 *  no references (`int &x` fails to parse), which is why every exercise in this
 *  course sticks to C-style char arrays and pointers instead of the STL. What it
 *  gets right matters more than what it lacks: integer division truncates,
 *  `cout` drops trailing zeros the way a real stream does, and signed overflow
 *  is a checked error rather than silently wrapping.
 *
 *  It runs synchronously on the main thread — there is no WebAssembly sandbox
 *  to hop into — so `maxTimeout` is what stands between a learner's stray
 *  `while (true)` and a frozen tab. */

import type { CppTest } from '../content/types'

const MAX_MS = 4000

interface JSCPPStatic {
  run(code: string, input: string, config?: { stdio?: { write?: (s: string) => void }; maxTimeout?: number }): number
}

let jscppPromise: Promise<JSCPPStatic> | null = null

function getJSCPP(): Promise<JSCPPStatic> {
  if (!jscppPromise) {
    jscppPromise = import('JSCPP').then((m) => m.default).catch((err) => {
      jscppPromise = null
      throw err
    })
  }
  return jscppPromise
}

export interface RunResult {
  stdout: string
  /** Present when the program failed to parse or raised at runtime. */
  error?: string
}

/** JSCPP's parse failures print "line N (column M): <context>", then an ASCII
 *  arrow under the bad token. The arrow points at nothing once the source is
 *  flattened onto one line for display, so it is the one thing dropped. */
export function friendlyError(raw: string): string {
  const body = raw.replace(/^ERROR: Parsing Failure:\s*/, '')
  const kept = body.split('\n').filter((l) => !/^[\s\-^]*$/.test(l))
  return kept.join('\n').trim() || raw.trim()
}

async function runOnce(code: string, input: string): Promise<RunResult> {
  const JSCPP = await getJSCPP()
  let out = ''
  try {
    JSCPP.run(code, input, { stdio: { write: (s) => { out += s } }, maxTimeout: MAX_MS })
    return { stdout: out }
  } catch (err) {
    return { stdout: out, error: friendlyError(String((err as Error).message ?? err)) }
  }
}

export async function runCpp(code: string, stdin: string[] = []): Promise<RunResult> {
  return runOnce(code, stdin.join('\n'))
}

/** Compare loosely enough that trailing spaces and a missing final newline
 *  never fail an otherwise-correct answer — the same rule `lib/python.ts` uses. */
function normalize(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n+$/, '')
}

export interface TestOutcome {
  test: CppTest
  passed: boolean
  stdout: string
  /** Why it failed, in plain terms. Left unset for an output mismatch — the
   *  UI shows an output/expected diff instead. */
  detail?: string
}

export async function runCppTests(code: string, tests: CppTest[]): Promise<TestOutcome[]> {
  const outcomes: TestOutcome[] = []

  for (const test of tests) {
    const res = await runOnce(code, (test.stdin ?? []).join('\n'))

    if (res.error) {
      outcomes.push({ test, passed: false, stdout: res.stdout, detail: res.error })
      continue
    }

    if (test.expectOutput !== undefined) {
      outcomes.push({ test, passed: normalize(res.stdout) === normalize(test.expectOutput), stdout: res.stdout })
      continue
    }

    if (test.expectContains?.length) {
      const hay = res.stdout.toLowerCase()
      const missing = test.expectContains.filter((frag) => !hay.includes(frag.toLowerCase()))
      outcomes.push({
        test,
        passed: missing.length === 0,
        stdout: res.stdout,
        detail: missing.length ? `Output is missing: ${missing.join(', ')}` : undefined,
      })
      continue
    }

    outcomes.push({ test, passed: true, stdout: res.stdout })
  }

  return outcomes
}
