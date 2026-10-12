/** Checks src/lib/diffrules.ts, the symbolic differentiator behind the "Differentiation Rules" article's widget.
 *
 *  Independent references, so nothing is checked against itself:
 *   1. Expressions that are rational functions: the derivative found by the rules is compared *exactly* at rational
 *      points with the derivative from derivative.ts, which works on reduced polynomial fractions by a different route.
 *   2. Every expression, including e^x, fractional, negative and π powers: the derivative is compared with central
 *      differences of the original function in floating point, and so is the result of every single step the widget
 *      shows (each step is the derivative of its own piece).
 *   3. Simplifying never changes a function; printing an expression and parsing it again gives the same function.
 *   4. Hand-worked derivatives from the chapter (powers, e^x, products, quotients) and the refusals (a base other than
 *      x, an exponent on e other than x, other functions).
 *   5. Higher derivatives of polynomials against repeated differentiation in tangent.ts, and d^n/dx^n x^n = n!.
 *
 *  Run: npm run check:diffrules   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dr-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/diffrules.ts')}'\nexport { derivative, evalPoly } from '${p('src/lib/tangent.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const D = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const eq = (got, want, what) => {
  checks++
  if (got !== want) fail(`${what}: got ${got}, want ${want}`)
}
const close = (got, want, what, tol = 1e-4) => {
  checks++
  const scale = Math.max(1, Math.abs(want))
  if (!(Math.abs(got - want) / scale < tol)) fail(`${what}: got ${got}, want ${want}`)
}
const B = BigInt
const R = (n, d = 1) => D.rat(B(n), B(d))
const txt = (r) => (r === null ? 'null' : `${r.n}/${r.d}`)
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const pick = (a) => a[rnd(0, a.length - 1)]
const central = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h)
const F = (n) => (x) => D.evalFloat(n, x)

/* ----------------------------------------- generators of random expressions */
const genRational = (depth) => {
  if (depth <= 0 || Math.random() < 0.25) {
    const c = Math.random()
    if (c < 0.3) return D.K(rnd(-4, 4), rnd(1, 3))
    if (c < 0.55) return D.X
    return D.pw(pick([-3, -2, -1, 2, 3, 4]))
  }
  const op = pick(['add', 'sub', 'mul', 'div', 'neg', 'mul', 'div'])
  if (op === 'neg') return D.neg(genRational(depth - 1))
  return D[op](genRational(depth - 1), genRational(depth - 1))
}
const genFloat = (depth) => {
  if (depth <= 0 || Math.random() < 0.25) {
    const c = Math.random()
    if (c < 0.15) return D.K(rnd(1, 5), rnd(1, 3))
    if (c < 0.25) return D.PI
    if (c < 0.4) return D.X
    if (c < 0.55) return D.EX
    if (c < 0.7) return D.TRIG(pick(['sin', 'cos', 'tan', 'cot', 'sec', 'csc']))
    if (c < 0.8) return D.pw(R(rnd(-6, 6), rnd(1, 4)))
    return D.pw(R(rnd(-2, 2), 1), R(rnd(-1, 1), 1))
  }
  const op = pick(['add', 'sub', 'mul', 'div', 'neg', 'mul'])
  if (op === 'neg') return D.neg(genFloat(depth - 1))
  return D[op](genFloat(depth - 1), genFloat(depth - 1))
}

/* ------------------------------------------------------------------ 1. by hand */
const val = (src, x) => D.evalFloat(D.parseExpression(src), x)
const dval = (src, x) => D.evalFloat(D.derive(D.parseExpression(src)).result, x)
close(val('3x^2', 2), 12, 'parse 3x^2')
close(val('x e^x', 1), Math.E, 'parse x e^x')
close(val('2xe^x', 1), 2 * Math.E, 'parse 2xe^x')
close(val('sqrt(x)', 4), 2, 'parse sqrt(x)')
close(val('x^(1/3)', 8), 2, 'parse x^(1/3)')
close(val('x^-2', 2), 0.25, 'parse x^-2')
close(val('x^(pi+1)', 2), 2 ** (Math.PI + 1), 'parse x^(pi+1)')
close(val('(x^2+1)(x-3)', 2), -5, 'parse a product')
close(val('(x^2-1)/(x^3+1)', 2), 3 / 9, 'parse a quotient')
close(val('-x^2', 2), -4, 'parse -x^2')
close(val('1/x', 4), 0.25, 'parse 1/x')
close(val('0.5x^2', 2), 2, 'parse 0.5x^2')
close(val('2*(x+1)', 2), 6, 'parse with *')
close(dval('x^3', 2), 12, 'd x^3')
close(dval('x^(2/3)', 8), (2 / 3) * 8 ** (-1 / 3), 'd x^(2/3)')
close(dval('x^4', 2), 32, 'd x^4')
close(dval('3x^2', 2), 12, 'd 3x^2')
close(dval('x^3-3x', 2), 9, 'd x^3 - 3x')
close(dval('e^x', 1), Math.E, 'd e^x')
close(dval('x^2 e^x', 1), 3 * Math.E, 'd x^2 e^x')
close(dval('(x^2+1)(x^3-3x)', 1), 5 - 6 - 3, 'product rule: 5x^4 - 6x^2 - 3 at 1')
close(dval('(x^2-1)/(x^3+1)', 2), (-16 + 12 + 4) / 81, 'quotient rule: (-x^4+3x^2+2x)/(x^3+1)^2 at 2')
close(dval('e^x/x', 2), (Math.exp(2) * 2 - Math.exp(2)) / 4, 'quotient with e^x')
close(dval('x^(pi)', 2), Math.PI * 2 ** (Math.PI - 1), 'd x^pi')
close(dval('x^(pi+1)', 2), (Math.PI + 1) * 2 ** Math.PI, 'd x^(pi+1)')
close(dval('(x-1)(x^2-2x)/x^4', 2), -1 / 4 + 6 / 8 - 6 / 16, 'Example 8 of the chapter')
eq(D.toTex(D.derive(D.parseExpression('x^3')).result), '3x^{2}', 'TeX of d x^3')
eq(D.toTex(D.derive(D.parseExpression('x^3-3x+5')).result), '3x^{2}-3', 'TeX of d x^3 - 3x + 5')
eq(D.toTex(D.derive(D.parseExpression('e^x')).result), 'e^{x}', 'TeX of d e^x')
eq(D.toTex(D.derive(D.parseExpression('5')).result), '0', 'a constant has derivative 0')
eq(D.toTex(D.derive(D.parseExpression('1/x')).result), '-\\frac{1}{x^{2}}', 'd 1/x')
eq(D.toTex(D.derive(D.parseExpression('x^(2/3)')).result), '\\frac{2}{3}x^{-\\frac{1}{3}}', 'TeX of d x^(2/3)')
eq(D.toTex(D.derive(D.parseExpression('x^(pi)')).result), '\\pi\\,x^{-1+\\pi}', 'TeX of d x^pi')

/* ------------------- 1b. rational functions: exact, against derivative.ts */
let exactChecked = 0
for (let i = 0; i < 6000; i++) {
  const f = genRational(3)
  const x = R(rnd(-6, 6), rnd(1, 3))
  const fv = D.evalExact(f, x)
  if (fv === null) continue
  const d = D.derive(f).result
  const ref = D.rationalDerivativeAt(f, x)
  const sv = D.evalExact(D.simp(f), x)
  if (sv !== null) eq(txt(sv), txt(fv), 'simplifying keeps the value')
  const dv = D.evalExact(d, x)
  if (ref === null || dv === null) continue
  exactChecked++
  eq(txt(dv), txt(ref), `derivative of ${D.toText(f)} at ${txt(x)}`)
}
eq(exactChecked > 1500, true, 'enough rational expressions were compared exactly')

/* ---- 2. every expression: central differences, and every single step */
let floatChecked = 0
let stepChecked = 0
for (let i = 0; i < 6000; i++) {
  const f = genFloat(3)
  const x = 0.4 + Math.random() * 2.6
  const fx = F(f)(x)
  if (!Number.isFinite(fx) || Math.abs(fx) > 1e5) continue
  const { result, steps } = D.derive(f)
  const dv = D.evalFloat(result, x)
  const cd = central(F(f), x)
  if (!Number.isFinite(dv) || !Number.isFinite(cd) || Math.abs(cd) > 1e5) continue
  floatChecked++
  close(dv, cd, `derivative of ${D.toText(f)} at ${x}`, 3e-4)
  eq(steps.length > 0, true, 'there is at least one step')
  for (const s of steps) {
    const sd = D.evalFloat(s.result, x)
    const sc = central(F(s.expr), x)
    if (!Number.isFinite(sd) || !Number.isFinite(sc) || Math.abs(sc) > 1e5) continue
    stepChecked++
    close(sd, sc, `step ${s.rule} on ${D.toText(s.expr)} at ${x}`, 3e-4)
  }
  // simplifying keeps the value, printing and parsing again gives the same function
  close(F(D.simp(f))(x), fx, `simplify ${D.toText(f)}`, 1e-9)
  let again
  try {
    again = D.parseExpression(D.toText(f), { trig: true })
  } catch (e) {
    fail(`could not read back ${D.toText(f)}: ${e.code ?? e.message}`)
    continue
  }
  close(F(again)(x), fx, `parse(toText) of ${D.toText(f)}`, 1e-9)
}
eq(floatChecked > 2500, true, 'enough expressions compared in floating point')
eq(stepChecked > 5000, true, 'enough steps compared')

/* ------------------------------------------------ trigonometric functions of x */
const tval = (src, x) => D.evalFloat(D.parseExpression(src, { trig: true }), x)
const tder = (src, x) => D.evalFloat(D.derive(D.parseExpression(src, { trig: true })).result, x)
close(tder('sin x', 1), Math.cos(1), 'd sin x')
close(tder('cos(x)', 1), -Math.sin(1), 'd cos x')
close(tder('tan x', 0.7), 1 / Math.cos(0.7) ** 2, 'd tan x')
close(tder('cot x', 0.7), -1 / Math.sin(0.7) ** 2, 'd cot x')
close(tder('sec x', 0.7), Math.sin(0.7) / Math.cos(0.7) ** 2, 'd sec x')
close(tder('csc x', 0.7), -Math.cos(0.7) / Math.sin(0.7) ** 2, 'd csc x')
close(tder('x^2 sin x', 1.3), 2 * 1.3 * Math.sin(1.3) + 1.3 ** 2 * Math.cos(1.3), 'd x^2 sin x')
close(tder('e^x sin x', 1.3), Math.exp(1.3) * (Math.sin(1.3) + Math.cos(1.3)), 'd e^x sin x')
close(tder('sin x / x', 1.3), (1.3 * Math.cos(1.3) - Math.sin(1.3)) / 1.3 ** 2, 'd sin x / x')
close(tder('sin x cos x', 0.9), Math.cos(0.9) ** 2 - Math.sin(0.9) ** 2, 'd sin x cos x')
close(tder('cos x/(1 - sin x)', 0.9), 1 / (1 - Math.sin(0.9)), 'd cos x/(1 - sin x)')
close(tder('sinx', 1), Math.cos(1), 'letters run together: sinx')
close(tval('xcosx', 2), 2 * Math.cos(2), 'letters run together: xcosx')
eq(D.toTex(D.derive(D.parseExpression('tan x', { trig: true })).result), '\\sec^{2}x', 'TeX of d tan x')
eq(D.toTex(D.derive(D.parseExpression('sec x', { trig: true })).result), '\\sec\\,x\\,\\tan\\,x', 'TeX of d sec x')
eq(D.toTex(D.derive(D.parseExpression('csc x', { trig: true })).result), '-\\csc\\,x\\,\\cot\\,x', 'TeX of d csc x')
eq(D.toTex(D.derive(D.parseExpression('cos x', { trig: true })).result), '-\\sin\\,x', 'TeX of d cos x')
for (const src of ['sin(2x)', 'sin(x)^2', 'sin(x+1)', 'sin x^2', 'cos(x', 'arcsin(x)', 'sin']) {
  let threw = false
  try {
    D.parseExpression(src, { trig: true })
  } catch {
    threw = true
  }
  eq(threw, true, `"${src}" is refused even with trigonometry on`)
}
let off = false
try {
  D.parseExpression('sin x')
} catch (e) {
  off = e.code === 'function'
}
eq(off, true, 'without the trig option sin x is still refused (the article on differentiation rules)')
// higher derivatives of sin and cos run in a cycle of four
for (const [src, cycle] of [['sin x', [Math.sin, Math.cos, (x) => -Math.sin(x), (x) => -Math.cos(x)]], ['cos x', [Math.cos, (x) => -Math.sin(x), (x) => -Math.cos(x), Math.sin]]]) {
  for (let n = 0; n <= 12; n++) {
    const x = 0.4 + 0.37 * n
    close(D.evalFloat(D.nth(D.parseExpression(src, { trig: true }), n), x), cycle[n % 4](x), `the ${n}-th derivative of ${src}`, 1e-9)
  }
}

/* ------------------------------------------------------------- 4. refusals */
for (const src of ['(x+1)^3', '2^x', 'e^(2x)', 'sin(x)', 'x^x', 'e', 'x^(x)', '(x^2+1)^2', 'sqrt(x+1)', '', 'x+', 'x y', '3 +* 4', 'ln(x)', 'e^x^2']) {
  let threw = false
  try {
    D.parseExpression(src)
  } catch {
    threw = true
  }
  eq(threw, true, `"${src}" is refused`)
}
for (const [src, code] of [['(x+1)^3', 'chain'], ['2^x', 'base'], ['e^(2x)', 'chain'], ['sin(x)', 'function'], ['x^x', 'exp']]) {
  let got = ''
  try {
    D.parseExpression(src)
  } catch (e) {
    got = e.code
  }
  eq(got, code, `the reason for refusing "${src}"`)
}

/* ------------------------------------------------------ 5. higher derivatives */
for (let i = 0; i < 1500; i++) {
  const deg = rnd(1, 6)
  let f = D.K(rnd(-5, 5), rnd(1, 2))
  for (let k = 1; k <= deg; k++) f = D.add(f, D.mul(D.K(rnd(-5, 5), rnd(1, 3)), k === 1 ? D.X : D.pw(k)))
  const x = R(rnd(-5, 5), rnd(1, 2))
  const poly = D.toRational(f).num
  let poly2 = poly
  for (let k = 1; k <= 4; k++) {
    poly2 = D.derivative(poly2)
    eq(txt(D.evalExact(D.nth(f, k), x)), txt(D.evalPoly(poly2, x)), `the ${k}-th derivative of a polynomial`)
  }
}
let fact = 1n
for (let n = 1n; n <= 9n; n++) {
  fact *= n
  const v = D.evalExact(D.nth(D.pw(Number(n)), Number(n)), R(3))
  eq(txt(v), `${fact}/1`, `the ${n}-th derivative of x^${n} is ${n}!`)
  eq(txt(D.evalExact(D.nth(D.pw(Number(n)), Number(n) + 1), R(3))), '0/1', `one more derivative of x^${n} is 0`)
}

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`diffrules check ok — ${checks} checks (rules vs the exact derivative of rational functions, central differences for every expression and every step, simplify and print/parse round trips, refusals, higher derivatives)`)
