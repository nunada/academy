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

/** Most fields are a plain value, shared by both languages. A `{ en, id }`
 *  shape is a genuinely different program per language — walk both. */
function bothLangs(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v) && 'en' in v && 'id' in v
    ? [['en', v.en], ['id', v.id]]
    : [[null, v]]
}

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

/** A starter is meant to fail — this is the "starter fails at least one
 *  test" half of the bilingual-content discipline, mirrored from the Python
 *  course's verification harnesses. Skipped where a program has no `main`
 *  yet (nothing to run at all is a trivial, uninteresting fail). */
function checkStarterFails(where, starter, tests) {
  if (!starter.includes('int main')) return
  for (const test of tests) {
    const res = run(starter, (test.stdin ?? []).join('\n'))
    const passed =
      !res.error &&
      (test.expectOutput === undefined || normalize(res.stdout) === normalize(test.expectOutput)) &&
      (!test.expectContains?.length || test.expectContains.every((f) => res.stdout.toLowerCase().includes(f.toLowerCase())))
    if (!passed) return
  }
  fail(`${where}: starter passes every test — it should fail at least one`)
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
        if (step.kind === 'concept' && step.output !== undefined) {
          for (const [lang, code] of bothLangs(step.code)) {
            const output = bothLangs(step.output).find(([l2]) => l2 === lang)?.[1] ?? bothLangs(step.output)[0][1]
            if (typeof code !== 'string' || !code.includes('int main') || code.includes('cin')) continue
            programsChecked++
            const res = run(code, '')
            const tag = lang ? `[${lang}] ` : ''
            if (res.error) {
              fail(`${tag}${l.id}/${step.id} (concept): raised\n    ${res.error}`)
            } else if (normalize(res.stdout) !== normalize(output)) {
              fail(`${tag}${l.id}/${step.id} (concept): got ${JSON.stringify(res.stdout)}, want ${JSON.stringify(output)}`)
            }
          }
        }
        if (step.kind === 'cpp') {
          for (const [lang, solution] of bothLangs(step.solution)) {
            const tests = bothLangs(step.tests).find(([l2]) => l2 === lang)?.[1] ?? bothLangs(step.tests)[0][1]
            const starter = bothLangs(step.starter).find(([l2]) => l2 === lang)?.[1] ?? bothLangs(step.starter)[0][1]
            const tag = lang ? `[${lang}] ` : ''
            programsChecked++
            checkTests(`${tag}${l.id}/${step.id}`, solution, tests)
            checkStarterFails(`${tag}${l.id}/${step.id}`, starter, tests)
          }
        }
      }
    }
    if (s.project.runtime === 'cpp') {
      for (const [lang, solution] of bothLangs(s.project.solution)) {
        const tests = bothLangs(s.project.tests).find(([l2]) => l2 === lang)?.[1] ?? bothLangs(s.project.tests)[0][1]
        const starter = bothLangs(s.project.starter).find(([l2]) => l2 === lang)?.[1] ?? bothLangs(s.project.starter)[0][1]
        const tag = lang ? `[${lang}] ` : ''
        programsChecked++
        checkTests(`${tag}${s.project.id} (project)`, solution, tests)
        checkStarterFails(`${tag}${s.project.id} (project)`, starter, tests)
      }
    }
  }
}

if (problems.length) {
  console.error('cpp check failed:\n' + problems.map((p) => '  · ' + p).join('\n'))
  process.exit(1)
}

console.log(`cpp check ok — ${programsChecked} programs, ${testsChecked} tests, all ran and matched`)
