/** TypeScript in the browser: the real compiler, giving real type errors.
 *
 *  A TypeScript course that only ran the code would be a JavaScript course with
 *  extra punctuation — the whole subject is what the compiler refuses. So this
 *  loads `typescript` itself and asks it for diagnostics.
 *
 *  It is 3.4 MB minified (0.97 MB over the wire), which is why both the compiler
 *  and the lib text are behind `await import(...)`: nothing here reaches the main
 *  bundle, and a learner who never opens the TypeScript course never pays.
 *
 *  Two kinds of check follow from that:
 *
 *    - a **type** check compiles the learner's code with a `probe` appended —
 *      a value handed to their type — and asks whether the compiler accepted it.
 *      Handing a type a value is the only way to find out what it really says.
 *    - a **behaviour** check runs the emitted JavaScript in the sandboxed frame
 *      the web courses already use, with the same helpers.
 *
 *  Before any of them run, the learner's code is compiled on its own. If that
 *  does not type-check, every test fails with the compiler's own words — there
 *  is no sense asking what a type accepts while the type is still broken. It
 *  also makes `expectError` honest: the source is known clean, so an error can
 *  only have come from the probe.
 */

import type { TsTest } from '../content/types'
import { runWebTests, type WebOutcome } from './web'

/** The single virtual file everything is compiled as. */
const MAIN = 'main.ts'
/** Separates the learner's code from the probe, so a diagnostic can be blamed
 *  on the right half. It is a comment, so it never changes what compiles. */
const MARKER = '//---- probe ----'

export interface TsDiagnostic {
  code: number
  message: string
  /** 1-based, counted in the learner's own code. */
  line: number
  /** The error is in the appended probe, not in what the learner wrote. */
  inProbe: boolean
}

export interface TsCompile {
  /** The emitted JavaScript. TypeScript emits even when types are wrong. */
  js: string
  diagnostics: TsDiagnostic[]
}

/* ------------------------------------------------------------ the compiler */

type Ts = typeof import('typescript')

let enginePromise: Promise<{ ts: Ts; libs: Record<string, string> }> | null = null

/** Parsed lib files, kept for the session. See getSourceFile below. */
const libCache = new Map<string, import('typescript').SourceFile>()

/** Loads the compiler and the lib text once, then keeps them for the session. */
export function getTsEngine(): Promise<{ ts: Ts; libs: Record<string, string> }> {
  if (!enginePromise) {
    enginePromise = Promise.all([import('typescript'), import('./tsLib')])
      .then(([tsMod, libMod]) => ({
        // The CommonJS build reaches us with its exports on `default`.
        ts: ((tsMod as unknown as { default?: Ts }).default ?? tsMod) as Ts,
        libs: libMod.LIBS,
      }))
      .catch((err: unknown) => {
        enginePromise = null
        throw err
      })
  }
  return enginePromise
}

/** Strict on purpose. A TypeScript course taught without `strict` teaches the
 *  half of the language that does not catch anything. */
function options(ts: Ts) {
  return {
    target: ts.ScriptTarget.ES2020,
    // Not a module: the content is scripts, and the frame runs them as scripts.
    module: ts.ModuleKind.None,
    strict: true,
    skipLibCheck: true,
    // Emit anyway, so a behaviour check can still run past a type error.
    noEmitOnError: false,
    lib: ['lib.es2020.d.ts', 'lib.console.d.ts'],
  }
}

export async function compileTs(source: string, probe?: string): Promise<TsCompile> {
  const { ts, libs } = await getTsEngine()

  const text = probe === undefined ? source : `${source}\n${MARKER}\n${probe}\n`
  // 0-based index of the marker line: everything after it belongs to the probe.
  const markerLine = probe === undefined ? Infinity : source.split('\n').length

  const files: Record<string, string> = { ...libs, [MAIN]: text }
  let js = ''

  const host: import('typescript').CompilerHost = {
    getSourceFile: (name, langVersion) => {
      // Parsing 425 KB of lib on every check costs 48 ms; keeping the parsed
      // files costs 3 ms. Only MAIN changes between compiles, so only MAIN is
      // reparsed. A project with eight probes feels the difference.
      const hit = libCache.get(name)
      if (hit) return hit
      if (files[name] === undefined) return undefined
      const sf = ts.createSourceFile(name, files[name], langVersion, true)
      if (name !== MAIN) libCache.set(name, sf)
      return sf
    },
    writeFile: (name, contents) => {
      if (name.endsWith('.js')) js = contents
    },
    getDefaultLibFileName: () => 'lib.es2020.d.ts',
    fileExists: (name) => files[name] !== undefined,
    readFile: (name) => files[name],
    getCurrentDirectory: () => '',
    getCanonicalFileName: (f) => f,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
  }

  const program = ts.createProgram([MAIN], options(ts), host)
  program.emit()

  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter((d) => d.file?.fileName === MAIN)
    .map((d) => {
      const line = d.file!.getLineAndCharacterOfPosition(d.start ?? 0).line
      return {
        code: d.code,
        message: ts.flattenDiagnosticMessageText(d.messageText, ' '),
        line: line + 1,
        inProbe: line > markerLine,
      }
    })

  return { js, diagnostics }
}

/** One line a learner can act on, from a diagnostic. */
export const describe = (d: TsDiagnostic): string =>
  d.inProbe ? `TS${d.code}: ${d.message}` : `Line ${d.line} — TS${d.code}: ${d.message}`

/* ---------------------------------------------------------------- checking */

export interface TsOutcome {
  test: TsTest
  passed: boolean
  detail?: string
}

export async function runTsTests(source: string, tests: TsTest[]): Promise<TsOutcome[]> {
  // The learner's own code first. Nothing below is meaningful until it compiles.
  const base = await compileTs(source)
  if (base.diagnostics.length > 0) {
    const detail = base.diagnostics.slice(0, 3).map(describe).join('\n')
    return tests.map((test) => ({ test, passed: false, detail }))
  }

  // Behaviour checks share one page, in order, exactly like a `web` exercise —
  // so they go to the frame together rather than one run each.
  const behaviour = tests.filter((t) => t.check !== undefined)
  let webOutcomes: WebOutcome[] = []
  if (behaviour.length > 0) {
    webOutcomes = await runWebTests(
      base.js,
      behaviour.map((t) => ({ name: t.name, check: t.check! })),
      undefined,
      true,
    )
  }

  const outcomes: TsOutcome[] = []
  let nextBehaviour = 0

  for (const test of tests) {
    if (test.check !== undefined) {
      const w = webOutcomes[nextBehaviour++]
      outcomes.push({ test, passed: w?.passed ?? false, detail: w?.detail })
      continue
    }

    const { diagnostics } = await compileTs(source, test.probe)
    const inProbe = diagnostics.filter((d) => d.inProbe)

    if (test.expectError) {
      const matching = test.errorCode ? inProbe.filter((d) => d.code === test.errorCode) : inProbe
      if (matching.length > 0) {
        outcomes.push({ test, passed: true })
      } else if (inProbe.length > 0) {
        outcomes.push({
          test,
          passed: false,
          detail: `TypeScript rejected it, but not with TS${test.errorCode}: ${inProbe.map(describe).join('\n')}`,
        })
      } else {
        outcomes.push({
          test,
          passed: false,
          detail: 'TypeScript accepted a value it should have rejected — the type is still too loose.',
        })
      }
      continue
    }

    // expectOk, and the default when a test says neither.
    outcomes.push(
      diagnostics.length === 0
        ? { test, passed: true }
        : { test, passed: false, detail: diagnostics.slice(0, 3).map(describe).join('\n') },
    )
  }

  return outcomes
}
