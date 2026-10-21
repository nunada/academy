/** The C++ programs in the articles.
 *
 *  Every article that shows code also shows a C++ program, and the program ends with a comment
 *  `/* output: ... *​/` holding what it prints. This runs each program in JSCPP, the same interpreter the C++
 *  course uses, and compares what it prints with that comment, so the output shown to a reader is the output the
 *  program really gives.
 *
 *  Two limits to know about. JSCPP is an interpreter for a subset of C++, so the programs keep to what it
 *  understands (no std::string, no vector, no references, no struct) and use only printf or `cout` for whole
 *  numbers; it is not a compiler, and it gets a few things wrong that a real one gets right (integer division of
 *  negative numbers, 64-bit integers, NaN). The programs avoid those, and the checker refuses the spellings of
 *  the C++ the interpreter lacks. Printing a double through plain `cout` is
 *  the one to watch by eye: JSCPP prints 17 digits where a real stream prints 6, so the programs use printf with
 *  a precision for every number that is not a whole value.
 *
 *  Run: npm run check:articlecpp   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import JSCPP from 'JSCPP'

const DIR = 'src/content/articles'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'acpp-'))
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.ts') && !f.endsWith('.meta.ts') && !['index.ts', 'types.ts', 'covers.ts', 'widgets.ts', 'tags.ts'].includes(f))

const problems = []
let programs = 0
let lines = 0

const normalize = (s) =>
  s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n+$/, '')

for (const f of files) {
  const id = f.replace(/\.ts$/, '')
  const out = path.join(tmp, f + '.mjs')
  await build({ entryPoints: [path.join(DIR, f)], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
  const { body } = await import(pathToFileURL(out).href)
  const blocks = []
  for (const s of body.sections) for (const b of s.blocks) if (b.kind === 'code') blocks.push(b)
  const cpp = blocks.filter((b) => b.lang === 'cpp')
  if (blocks.length > 0 && cpp.length === 0) problems.push(`${id}: shows code but has no C++ program`)
  for (const b of cpp) {
    programs++
    const m = /\/\* output:\n([\s\S]*?)\n\*\/\s*$/.exec(b.code)
    if (!m) {
      problems.push(`${id}: a C++ program must end with a /* output: ... */ comment`)
      continue
    }
    const want = normalize(m[1])
    const code = b.code
    // what the interpreter does not have: struct, vector, string and references
    const bare = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
    if (/\bstruct\b|\bvector\b|\bstring\b|\b(?:int|double|char|bool)\s*&\s*\w+/.test(bare)) problems.push(`${id}: uses a feature the interpreter does not have (struct, vector, string or a reference)`)
    // JSCPP drops a space that follows "," or ")" inside a printf format, so the output it shows would not be the output
    // of a real compiler: write such a string without that space
    for (const [, lit] of bare.matchAll(/printf\s*\(\s*("(?:[^"\\]|\\.)*")/g)) if (/[,)]\s/.test(lit)) problems.push(`${id}: the string ${lit} has a space after "," or ")", which the interpreter drops`)
    let got = ''
    try {
      JSCPP.run(code.replace(/\/\* output:[\s\S]*$/, '') + '\n', '', { stdio: { write: (s) => (got += s) }, maxTimeout: 8000 })
    } catch (e) {
      problems.push(`${id}: the program does not run: ${String(e.message ?? e).slice(0, 120)}`)
      continue
    }
    const have = normalize(got)
    lines += want.split('\n').length
    if (have !== want) {
      problems.push(`${id}: the output comment differs from what the program prints\n--- comment\n${want}\n--- program\n${have}`)
    }
  }
}
fs.rmSync(tmp, { recursive: true, force: true })

if (problems.length) {
  for (const p of problems) console.log(p)
  console.log(`\n${problems.length} problem(s)`)
  process.exit(1)
}
console.log(`article C++ check ok — ${programs} programs ran in JSCPP and printed exactly the output shown (${lines} lines)`)
