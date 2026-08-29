/** The C++ course has no browser to run the interpreter in — JSCPP is a real
 *  npm package, so this runs it in Node instead and checks every program the
 *  course claims works: a `concept` step's worked example against its printed
 *  `output`, and a `cpp` step's or project's `solution` against its own tests.
 *
 *  A wrong `output` or a `solution` that fails its own test is worse than a
 *  typo — it means the "worked example" a learner is meant to trust, or the
 *  answer the "show solution" button hands them, is not actually correct.
 *
 *  Run: npm run check:cpp
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'
import JSCPP from 'JSCPP'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nunada-cpp-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')

const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(entry, `export { modules } from '${q('src/content/cpp/index.ts')}'\n`)
const bundle = path.join(tmp, 'bundle.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: bundle, logLevel: 'error' })
const { modules } = await import('file://' + bundle)
fs.rmSync(tmp, { recursive: true, force: true })

const problems = []
const fail = (m) => problems.push(m)

/** Same rule the app uses to compare output: trailing spaces and a missing
 *  final newline never fail an otherwise-correct answer. */
function normalize(s) {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n+$/, '')
}

function run(code, input) {
  let out = ''
  try {
    JSCPP.run(code, input, { stdio: { write: (s) => { out += s } }, maxTimeout: 4000 })
    return { stdout: out }
  } catch (err) {
    return { stdout: out, error: String(err.message ?? err) }
  }
}

let programsChecked = 0
let testsChecked = 0

function checkTests(where, code, tests) {
  for (const test of tests) {
    testsChecked++
    const res = run(code, (test.stdin ?? []).join('\n'))
    if (res.error) {
      fail(`${where} — test "${test.name.en}": raised\n    ${res.error}`)
      continue
    }
    if (test.expectOutput !== undefined) {
      if (normalize(res.stdout) !== normalize(test.expectOutput)) {
        fail(
          `${where} — test "${test.name.en}": got ${JSON.stringify(res.stdout)}, want ${JSON.stringify(test.expectOutput)}`,
        )
      }
    }
    if (test.expectContains?.length) {
      const hay = res.stdout.toLowerCase()
      const missing = test.expectContains.filter((f) => !hay.includes(f.toLowerCase()))
      if (missing.length) fail(`${where} — test "${test.name.en}": missing ${missing.join(', ')} in ${JSON.stringify(res.stdout)}`)
    }
  }
}

for (const m of modules) {
  for (const s of m.submodules) {
    for (const l of s.lessons) {
      for (const step of l.steps) {
        // A snippet with no int main is a fragment shown for reading, not a
        // program meant to run — often deliberately broken, to show what an
        // error looks like. A snippet reading cin needs input the `concept`
        // step has no field to carry — its `output` is an illustrative
        // transcript, not a literal capture, the same way the Python course's
        // input() examples are. Only a complete, input-free program is
        // checked here.
        if (
          step.kind === 'concept' &&
          step.code?.includes('int main') &&
          !step.code.includes('cin') &&
          step.output !== undefined
        ) {
          programsChecked++
          const res = run(step.code, '')
          if (res.error) {
            fail(`${l.id}/${step.id} (concept): raised\n    ${res.error}`)
          } else if (normalize(res.stdout) !== normalize(step.output)) {
            fail(`${l.id}/${step.id} (concept): got ${JSON.stringify(res.stdout)}, want ${JSON.stringify(step.output)}`)
          }
        }
        if (step.kind === 'cpp') {
          programsChecked++
          checkTests(`${l.id}/${step.id}`, step.solution, step.tests)
        }
      }
    }
    if (s.project.runtime === 'cpp') {
      programsChecked++
      checkTests(`${s.project.id} (project)`, s.project.solution, s.project.tests)
    }
  }
}

if (problems.length) {
  console.error('cpp check failed:\n' + problems.map((p) => '  · ' + p).join('\n'))
  process.exit(1)
}

console.log(`cpp check ok — ${programsChecked} programs, ${testsChecked} tests, all ran and matched`)
