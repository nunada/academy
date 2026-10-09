/** Checks src/lib/algebra.ts, the engine behind the "Algebraic Expressions"
 *  article's widgets (expand and combine, evaluate, factor).
 *
 *  Three independent checks:
 *   1. Hand-written answers: known expansions, known factorisations, known failures.
 *   2. Random expressions evaluated two ways: the engine expands them exactly and
 *      evaluates the polynomial; `expr.ts` (a separate evaluator, in floating point)
 *      evaluates the original text. They must agree at several random points.
 *   3. Factoring: every factorisation must expand back to the input exactly, and
 *      polynomials built as products of known linear factors must be recovered.
 *
 *  Run: npm run check:algebra   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'algebra-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
fs.writeFileSync(
  entry,
  `export * from '${q('src/lib/algebra.ts')}'\nexport { rat, parseRational } from '${q('src/lib/realnum.ts')}'\nexport { evaluate } from '${q('src/lib/expr.ts')}'`,
)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const A = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const text = (s) => A.polyText(A.parsePoly(s))

/* ------------------------------------------------------------------ 1. known */
const EXPAND = [
  ['3x+2x', '5x'],
  ['5x^2+3x-2x^2+7x-4', '3x^2 + 10x - 4'],
  ['(x+2)(x-3)', 'x^2 - x - 6'],
  ['(x+4)(x-2)', 'x^2 + 2x - 8'],
  ['(x+3)^2', 'x^2 + 6x + 9'],
  ['(x-3)^2', 'x^2 - 6x + 9'],
  ['(2x+3)^2', '4x^2 + 12x + 9'],
  ['(x+5)(x-5)', 'x^2 - 25'],
  ['3(x+2)', '3x + 6'],
  ['-(x-2)', '-x + 2'],
  ['2x(3x-4)', '6x^2 - 8x'],
  ['(a+b)^2', 'a^2 + 2ab + b^2'],
  ['(a-b)(a+b)', 'a^2 - b^2'],
  ['2xy+3yx', '5xy'],
  ['x/2+x/3', '(5/6)x'],
  ['0.5x+0.25x', '(3/4)x'],
  ['(x+1)^3', 'x^3 + 3x^2 + 3x + 1'],
  ['x-x', '0'],
  ['2(x+1)-2x', '2'],
  ['(x+y)(x-y)+y^2', 'x^2'],
  ['x²-1', 'x^2 - 1'],
  ['3a2b', null], // a number after a letter is refused, not guessed
]
for (const [src, want] of EXPAND) {
  checks++
  try {
    const got = text(src)
    if (got !== want) fail(`${src} → ${got}; want ${want}`)
  } catch (e) {
    if (want !== null) fail(`${src} threw ${e.code ?? e.message}; want ${want}`)
  }
}
const REFUSED = [
  ['', 'empty'],
  ['3$x', 'char'],
  ['1/x', 'division'],
  ['x^-1', 'exponent'],
  ['x^2.5', 'exponent'],
  ['x^13', 'exponent'],
  ['(x+1', 'syntax'],
  ['2 3', 'syntax'],
  ['x+', 'syntax'],
  ['abcd', 'multi'],
]
for (const [src, code] of REFUSED) {
  checks++
  try {
    A.parsePoly(src)
    fail(`${JSON.stringify(src)} should be refused with ${code}`)
  } catch (e) {
    if (e.code !== code) fail(`${JSON.stringify(src)} refused with ${e.code}; want ${code}`)
  }
}

const FACTOR = [
  ['x^2-5x+6', '\\left(x-3\\right)\\left(x-2\\right)'.replace('x-3', 'x-3')],
  ['x^2+7x+12', '\\left(x+3\\right)\\left(x+4\\right)'],
  ['x^2-25', '\\left(x-5\\right)\\left(x+5\\right)'],
  ['4x^2-9', '\\left(2x-3\\right)\\left(2x+3\\right)'],
  ['x^2+6x+9', '\\left(x+3\\right)^{2}'],
  ['2x^2+7x+3', '\\left(x+3\\right)\\left(2x+1\\right)'],
  ['6x^2+9x', '3x\\left(2x+3\\right)'],
  ['x^3-x', 'x\\left(x-1\\right)\\left(x+1\\right)'],
  ['-x^2+4', '-\\left(x-2\\right)\\left(x+2\\right)'],
  ['3x^2-12', '3\\left(x-2\\right)\\left(x+2\\right)'],
  ['x^2-x-6', '\\left(x-3\\right)\\left(x+2\\right)'],
  ['5x', '5x'],
  ['7', '7'],
]
// Which order a pair of factors prints in is a convention (smaller root first);
// compare as sets of brackets so the check is about the mathematics.
const norm = (s) => {
  const rest = s.replace(/\\left\(([^)]*)\\right\)(\^\{2\})?/g, '§$1$2§')
  const brackets = [...rest.matchAll(/§([^§]*)§/g)].map((m) => m[1]).sort()
  return rest.replace(/§[^§]*§/g, '') + '|' + brackets.join('|')
}
for (const [src, want] of FACTOR) {
  checks++
  const f = A.factorPoly(A.parsePoly(src))
  if (!f) {
    fail(`factor(${src}) returned null`)
    continue
  }
  if (norm(f.tex) !== norm(want)) fail(`factor(${src}) = ${f.tex}; want ${want}`)
  if (!A.equal(f.product, A.parsePoly(src))) fail(`factor(${src}): the factors do not multiply back (${f.tex})`)
}
const IRREDUCIBLE = ['x^2+1', 'x^2+x+1', 'x^2-2', '2x^2+3x+3']
for (const src of IRREDUCIBLE) {
  checks++
  const f = A.factorPoly(A.parsePoly(src))
  if (!f || f.note !== 'irreducible') fail(`factor(${src}) should be reported irreducible`)
  else if (!A.equal(f.product, A.parsePoly(src))) fail(`factor(${src}): product mismatch`)
}
checks += 3
if (A.factorPoly(A.parsePoly('x/2+1')) !== null) fail('fractional coefficients should be declined')
if (A.factorPoly(A.parsePoly('x+y')) !== null) fail('two variables should be declined')
if (A.factorPoly(A.parsePoly('x-x')) !== null) fail('the zero polynomial should be declined')

// Shape.
const SHAPE = [
  ['5', 'monomial', 0],
  ['3x^2y', 'monomial', 3],
  ['x+1', 'binomial', 1],
  ['x^2-x-6', 'trinomial', 2],
  ['x^3+x^2+x+1', 'polynomial', 3],
  ['x-x', 'zero', 0],
]
for (const [src, kind, deg] of SHAPE) {
  checks++
  const p = A.parsePoly(src)
  if (A.kindOf(p) !== kind || A.degree(p) !== deg) fail(`${src}: kind ${A.kindOf(p)} degree ${A.degree(p)}; want ${kind} ${deg}`)
}
// Terms are listed as written, not combined.
const TERMS = [
  ['3x^2-5x+7', 3],
  ['3x+5x-2', 3],
  ['-x+2y-4', 3],
  ['2x(3+y)', 'throws'],
]
for (const [src, n] of TERMS) {
  checks++
  try {
    const t = A.termsOf(src)
    if (n === 'throws') fail(`termsOf(${src}) should refuse a bracketed product`)
    else if (t.length !== n) fail(`termsOf(${src}) gave ${t.length} terms; want ${n}`)
  } catch (e) {
    if (n !== 'throws') fail(`termsOf(${src}) threw ${e.code}`)
  }
}

/* ------------------------------------------------- 2. random, two evaluators */
let seed = 4242
const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1))
const letters = ['x', 'y', 'z']
// A power is a base with at most one exponent: a^b^c is ambiguous and refused.
function genBase(depth) {
  const r = rand()
  if (depth <= 0 || r < 0.6) return rand() < 0.5 ? String(ri(0, 9)) : letters[ri(0, 2)]
  return `(${genExpr(depth - 1)})`
}
function genAtom(depth) {
  const base = genBase(depth)
  return rand() < 0.4 ? `${base}^${ri(0, 3)}` : base
}
function genTerm(depth) {
  let s = genAtom(depth)
  const n = ri(0, 2)
  for (let i = 0; i < n; i++) s += `*${genAtom(depth)}`
  return rand() < 0.3 ? `-${s}` : s
}
function genExpr(depth) {
  let s = genTerm(depth)
  const n = ri(0, 3)
  for (let i = 0; i < n; i++) s += `${rand() < 0.5 ? '+' : '-'}${genTerm(depth)}`
  return s
}
for (let i = 0; i < 6000; i++) {
  const src = genExpr(2)
  let p
  try {
    p = A.parsePoly(src)
  } catch (e) {
    if (e.code === 'big') continue
    fail(`random ${src} threw ${e.code}`)
    continue
  }
  for (let j = 0; j < 3; j++) {
    const vals = { x: ri(-5, 5), y: ri(-5, 5), z: ri(-5, 5) }
    const exact = A.evalPoly(p, { x: A.rat(BigInt(vals.x), 1n), y: A.rat(BigInt(vals.y), 1n), z: A.rat(BigInt(vals.z), 1n) })
    // expr.ts has no 0^0 problem to avoid here: its power is plain.
    const float = A.evaluate(src, { vars: vals })
    checks++
    if (exact === null || float === null) {
      if (float !== null || exact === null) continue
    }
    const e = Number(exact.n) / Number(exact.d)
    if (Math.abs(e - float) > 1e-6 * Math.max(1, Math.abs(float))) fail(`random ${src} at ${JSON.stringify(vals)}: engine ${e}, evaluator ${float}`)
  }
}

/* -------------------------------------------------------------- 3. factoring */
const R = (n) => A.constant(A.rat(BigInt(n), 1n))
const X = A.variable('x')
const linear = (d, n) => A.sub(A.mul(R(d), X), R(n)) // d·x − n
for (let i = 0; i < 4000; i++) {
  const d1 = ri(1, 4)
  const d2 = ri(1, 4)
  const n1 = ri(-9, 9)
  const n2 = ri(-9, 9)
  const k = ri(1, 6) * (rand() < 0.3 ? -1 : 1)
  const withX = rand() < 0.25 ? A.pow(X, ri(1, 2)) : R(1)
  const poly = A.mul(A.mul(R(k), withX), A.mul(linear(d1, n1), linear(d2, n2)))
  checks++
  const f = A.factorPoly(poly)
  if (!f) {
    fail(`factor returned null for ${A.polyText(poly)}`)
    continue
  }
  if (!A.equal(f.product, poly)) fail(`factor(${A.polyText(poly)}) = ${f.tex} does not multiply back`)
  // A product of linear factors must be recovered completely: no "irreducible"
  // verdict, and no leftover quadratic.
  if (f.note !== null) fail(`factor(${A.polyText(poly)}) stopped (${f.note}) although it is a product of linear factors`)
}
// Random quadratics: whatever the verdict, it must be honest.
for (let i = 0; i < 4000; i++) {
  const a = ri(1, 6) * (rand() < 0.3 ? -1 : 1)
  const b = ri(-12, 12)
  const c = ri(-12, 12)
  const poly = A.parsePoly(`${a}x^2+(${b})x+(${c})`)
  checks++
  const f = A.factorPoly(poly)
  if (!f) continue
  if (!A.equal(f.product, poly)) fail(`factor(${A.polyText(poly)}) = ${f.tex} does not multiply back`)
  const D = b * b - 4 * a * c
  const square = D >= 0 && Number.isInteger(Math.sqrt(D))
  if (a !== 0 && (f.note === 'irreducible') === square) fail(`factor(${A.polyText(poly)}): verdict ${f.note} but D = ${D}`)
}

if (bad) {
  console.error(`\n${bad} problem(s)`)
  process.exit(1)
}
console.log(`algebra check ok — ${checks} checks (known answers, two evaluators over random expressions, factorisations expanded back)`)
