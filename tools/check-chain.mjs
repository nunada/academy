/** Checks src/lib/chain.ts, the symbolic differentiator behind the "Chain Rule" article's widgets.
 *
 *  Independent references, so nothing is checked against itself:
 *   1. Rational expressions with composite parts such as (3x² + 1)² or 1 / (x − 1)³: the derivative found by the chain
 *      rule is compared *exactly* at rational points with the derivative from derivative.ts (reduced polynomial fractions).
 *   2. Powers with fractional exponents of a rational function: the derivative is raised to the power that clears the
 *      exponent, and the result is compared exactly with the one from derivative.ts.
 *   3. Forward-mode automatic differentiation with dual numbers, a second algorithm that applies the chain rule to numbers
 *      instead of symbols, written here and not in the library.
 *   4. Central differences in floating point for every expression and for every single step the widget shows.
 *   5. Simplifying never changes a function, simplifying twice changes nothing more, printing and parsing again gives the
 *      same function.
 *   6. The chain rule itself, f(g(x))' = f'(g(x)) g'(x), for every pair of an outside and an inside function the widget
 *      offers, and the second-derivative form f''(g)(g')² + f'(g) g''.
 *   7. Hand-worked derivatives from the chapter and the refusals (a variable exponent, other functions, a trigonometric
 *      function with an unbracketed argument).
 *   8. The numbers in the oscillation widgets: the slope of sin(kx), the piston's velocity, acceleration and jerk, the
 *      Fairbanks temperature curve.
 *
 *  Run: npm run check:chain   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'chain-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/chain.ts')}'`)
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
  // a central difference loses digits where the slope is in the thousands
  if (!(Math.abs(got - want) / scale < (scale > 1000 ? Math.max(tol, 2e-3) : tol))) fail(`${what}: got ${got}, want ${want}`)
}
const B = BigInt
const R = (n, d = 1) => D.rat(B(n), B(d))
const txt = (r) => (r === null ? 'null' : `${r.n}/${r.d}`)
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const pick = (a) => a[rnd(0, a.length - 1)]
const central = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h)
const F = (n) => (x) => D.evalFloat(n, x)
const P = (src) => D.parseExpression(src)
const tex = (src) => D.toTex(D.derive(P(src)).result)
const dval = (src, x) => D.evalFloat(D.derive(P(src)).result, x)

/* ---------------------------------------- forward-mode automatic differentiation */
const dual = (n, x) => {
  switch (n.t) {
    case 'num':
      return [Number(n.v.n) / Number(n.v.d), 0]
    case 'pi':
      return [Math.PI, 0]
    case 'x':
      return [x, 1]
    case 'neg': {
      const [v, d] = dual(n.a, x)
      return [-v, -d]
    }
    case 'add': {
      const [av, ad] = dual(n.a, x)
      const [bv, bd] = dual(n.b, x)
      return [av + bv, ad + bd]
    }
    case 'sub': {
      const [av, ad] = dual(n.a, x)
      const [bv, bd] = dual(n.b, x)
      return [av - bv, ad - bd]
    }
    case 'mul': {
      const [av, ad] = dual(n.a, x)
      const [bv, bd] = dual(n.b, x)
      return [av * bv, ad * bv + av * bd]
    }
    case 'div': {
      const [av, ad] = dual(n.a, x)
      const [bv, bd] = dual(n.b, x)
      return [av / bv, (ad * bv - av * bd) / (bv * bv)]
    }
    case 'pow': {
      const [v, d] = dual(n.a, x)
      const e = Number(n.n.n) / Number(n.n.d)
      return [v ** e, e * v ** (e - 1) * d]
    }
    case 'exp': {
      const [v, d] = dual(n.a, x)
      return [Math.exp(v), Math.exp(v) * d]
    }
    case 'ln': {
      const [v, d] = dual(n.a, x)
      return [Math.log(v), d / v]
    }
    case 'gpow': {
      const [av, ad] = dual(n.a, x)
      const [bv, bd] = dual(n.b, x)
      const val = av ** bv
      return [val, val * (bd * Math.log(av) + (bv * ad) / av)]
    }
    case 'fn': {
      const [v, d] = dual(n.a, x)
      const s = Math.sin(v)
      const c = Math.cos(v)
      if (n.f === 'sin') return [s, c * d]
      if (n.f === 'cos') return [c, -s * d]
      if (n.f === 'tan') return [s / c, d / (c * c)]
      if (n.f === 'cot') return [c / s, -d / (s * s)]
      if (n.f === 'sec') return [1 / c, (d * s) / (c * c)]
      return [1 / s, (-d * c) / (s * s)]
    }
  }
}

/** False when any part of the expression is huge or undefined at x: floating point cannot judge those cases. */
const tame = (n, x) => {
  const v = D.evalFloat(n, x)
  if (!Number.isFinite(v) || Math.abs(v) > 60) return false
  switch (n.t) {
    case 'num':
    case 'pi':
    case 'x':
      return true
    case 'neg':
    case 'pow':
    case 'exp':
    case 'fn':
    case 'ln':
      return tame(n.a, x)
    default:
      return tame(n.a, x) && tame(n.b, x)
  }
}

/* ----------------------------------------- generators of random expressions */
const genRational = (depth) => {
  if (depth <= 0 || Math.random() < 0.2) {
    const c = Math.random()
    if (c < 0.3) return D.K(rnd(-4, 4), rnd(1, 3))
    return D.X
  }
  const op = pick(['add', 'sub', 'mul', 'div', 'neg', 'pow', 'pow', 'pow'])
  if (op === 'neg') return D.neg(genRational(depth - 1))
  if (op === 'pow') return D.pw(genRational(depth - 1), pick([-3, -2, 2, 3, 4]))
  return D[op](genRational(depth - 1), genRational(depth - 1))
}
const genFloat = (depth) => {
  if (depth <= 0 || Math.random() < 0.2) {
    const c = Math.random()
    if (c < 0.2) return D.K(rnd(1, 5), rnd(1, 3))
    if (c < 0.3) return D.PI
    return D.X
  }
  const op = pick(['add', 'sub', 'mul', 'div', 'neg', 'pow', 'exp', 'fn', 'fn', 'exp', 'pow'])
  if (op === 'neg') return D.neg(genFloat(depth - 1))
  if (op === 'pow') return D.pw(genFloat(depth - 1), R(rnd(-5, 5), rnd(1, 3)))
  if (op === 'exp') return D.ex(genFloat(depth - 1))
  if (op === 'fn') return D.fn(pick(D.FN_NAMES), genFloat(depth - 1))
  return D[op](genFloat(depth - 1), genFloat(depth - 1))
}

/* ------------------------------------------------------------------ 7a. by hand */
const val = (src, x) => D.evalFloat(P(src), x)
close(val('3x^2', 2), 12, 'parse 3x^2')
close(val('sin(2x)', 1), Math.sin(2), 'parse sin(2x)')
close(val('sin(x)^2', 1), Math.sin(1) ** 2, 'parse sin(x)^2')
close(val('sin^2(x)', 1), Math.sin(1) ** 2, 'parse sin^2(x)')
close(val('e^(2x)', 1), Math.exp(2), 'parse e^(2x)')
close(val('e^-x', 1), Math.exp(-1), 'parse e^-x')
close(val('e^x sin x', 1), Math.E * Math.sin(1), 'parse e^x sin x')
close(val('(3x^2+1)^2', 1), 16, 'parse (3x^2+1)^2')
close(val('sqrt(3x+1)', 5), 4, 'parse sqrt(3x+1)')
close(val('x^(1/3)', 8), 2, 'parse x^(1/3)')
close(val('x^-2', 2), 0.25, 'parse x^-2')
close(val('1/(3x-2)', 1), 1, 'parse 1/(3x-2)')
close(val('tan(5 - sin(2x))', 0), Math.tan(5), 'parse a nested composition')
close(val('2(x+1)', 2), 6, 'parse 2(x+1)')
close(val('0,5x', 4), 2, 'a decimal comma')
close(val('sin(pi x)', 0.5), 1, 'parse sin(pi x)')
// the examples of the chapter
close(dval('(3x^2+1)^2', 1), 48, 'Example 1: (3x^2+1)^2 has derivative 36x^3+12x')
close(dval('cos(x^2+1)', 1.2), -2 * 1.2 * Math.sin(1.2 ** 2 + 1), 'Example 2: velocity of x = cos(t^2+1)')
close(dval('sin(x^2+e^x)', 0.7), Math.cos(0.49 + Math.exp(0.7)) * (1.4 + Math.exp(0.7)), 'Example 3')
close(dval('e^(cos x)', 0.7), -Math.exp(Math.cos(0.7)) * Math.sin(0.7), 'Example 4')
close(dval('tan(5 - sin(2x))', 0.4), -Math.cos(0.8) * 2 / Math.cos(5 - Math.sin(0.8)) ** 2, 'Example 5')
close(dval('(5x^3-x^4)^7', 1), 7 * 4 ** 6 * 11, 'Example 6a')
close(dval('1/(3x-2)', 2), -3 / 16, 'Example 6b')
close(dval('sin^5(x)', 0.8), 5 * Math.sin(0.8) ** 4 * Math.cos(0.8), 'Example 6c')
close(dval('e^(sqrt(3x+1))', 1), (3 * Math.exp(2)) / 4, 'Example 6d')
close(dval('sqrt(x^2)', 3), 1, 'Example 7: |x| for x > 0')
close(dval('sqrt(x^2)', -3), -1, 'Example 7: |x| for x < 0')
close(dval('(1-2x)^(-3)', 0.2), 6 / 0.6 ** 4, 'Example 10: slope of 1/(1-2x)^3')
close(dval('sin(pi x / 180)', 30), (Math.PI / 180) * Math.cos(Math.PI / 6), 'Example 9: sin of x degrees')
close(dval('sin(2x)', 1), 2 * Math.cos(2), 'd sin 2x')
close(dval('cos(3x)', 1), -3 * Math.sin(3), 'd cos 3x')
close(dval('tan(4x)', 0.1), 4 / Math.cos(0.4) ** 2, 'd tan 4x')
close(dval('e^(2x)', 1), 2 * Math.exp(2), 'd e^2x')
close(dval('e^(x^2)', 1), 2 * Math.E, 'd e^(x^2)')
close(dval('sec(x^2)', 0.5), 2 * 0.5 * (1 / Math.cos(0.25)) * Math.tan(0.25), 'd sec(x^2)')
close(dval('x sin(2x)', 1), Math.sin(2) + 2 * Math.cos(2), 'product with a composite')
eq(tex('(3x^2+1)^2'), '12x\\left(3x^{2}+1\\right)', 'TeX of Example 1')
eq(tex('sin(2x)'), '2\\cos\\left(2x\\right)', 'TeX of d sin 2x')
eq(tex('cos(x^2+1)'), '-2x\\sin\\left(x^{2}+1\\right)', 'TeX of Example 2')
eq(tex('e^(2x)'), '2e^{2x}', 'TeX of d e^2x')
eq(tex('e^(x^2)'), '2xe^{x^{2}}', 'TeX of d e^(x^2)')
eq(tex('1/(3x-2)'), '-\\frac{3}{\\left(3x-2\\right)^{2}}', 'TeX of Example 6b')
eq(tex('sqrt(3x+1)'), '\\frac{3}{2\\sqrt{3x+1}}', 'TeX of d sqrt(3x+1)')
eq(tex('sin(x)'), '\\cos x', 'a plain trigonometric function is not a chain')
eq(tex('x^3'), '3x^{2}', 'a plain power is not a chain')
eq(tex('5'), '0', 'a constant has derivative 0')
eq(tex('sin(5)'), '0', 'a constant inside has derivative 0')

/* --------------------------------- 1. rational: exact, against derivative.ts */
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
eq(exactChecked > 1200, true, 'enough rational expressions were compared exactly')

/* ---- 2. fractional powers of a rational function: the derivative to the power q is exact */
let fracChecked = 0
for (let i = 0; i < 1500; i++) {
  const g = genRational(2)
  const q = pick([2, 2, 3, 4])
  const m = pick([-5, -3, -2, -1, 1, 2, 3, 5])
  const f = D.pw(g, R(m, q))
  const x = R(rnd(-6, 6), rnd(1, 3))
  const gv = D.evalExact(g, x)
  const gd = D.rationalDerivativeAt(g, x)
  if (gv === null || gd === null || gv.n === 0n) continue
  const d = D.derive(f).result
  const powered = D.evalExact(D.simp(D.pw(d, q)), x)
  if (powered === null) continue
  // (f')^q = (m/q)^q g^(m − q) (g')^q
  const mulR = (a, b) => R(a.n * b.n, a.d * b.d)
  const powR = (r, k) => {
    let acc = R(1)
    for (let j = 0; j < Math.abs(k); j++) acc = mulR(acc, r)
    return k >= 0 ? acc : R(acc.d, acc.n)
  }
  const want = mulR(mulR(powR(R(m, q), q), powR(gv, m - q)), powR(gd, q))
  fracChecked++
  eq(txt(powered), txt(want), `(f')^${q} for ${D.toText(f)} at ${txt(x)}`)
}
eq(fracChecked > 400, true, 'enough fractional powers were compared exactly')

/* ---- 3 and 4. every expression: dual numbers, central differences, every step */
let floatChecked = 0
let stepChecked = 0
for (let i = 0; i < 7000; i++) {
  const f = genFloat(3)
  const x = 0.4 + Math.random() * 2.6
  const fx = F(f)(x)
  if (!Number.isFinite(fx) || Math.abs(fx) > 1e4 || !tame(f, x)) continue
  const { result, steps } = D.derive(f)
  const dv = D.evalFloat(result, x)
  const [dualV, dualD] = dual(f, x)
  const cd = central(F(f), x)
  if (!Number.isFinite(dv) || !Number.isFinite(cd) || !Number.isFinite(dualD) || Math.abs(cd) > 1e4) continue
  floatChecked++
  close(dualV, fx, `dual value of ${D.toText(f)}`, 1e-9)
  close(dv, dualD, `derivative of ${D.toText(f)} at ${x} against dual numbers`, 1e-7)
  close(dv, cd, `derivative of ${D.toText(f)} at ${x} against central differences`, 3e-4)
  eq(steps.length > 0, true, 'there is at least one step')
  for (const s of steps) {
    const sd = D.evalFloat(s.result, x)
    const sc = central(F(s.expr), x)
    if (!Number.isFinite(sd) || !Number.isFinite(sc) || Math.abs(sc) > 1e4) continue
    stepChecked++
    close(sd, sc, `step ${s.rule} on ${D.toText(s.expr)} at ${x}`, 3e-4)
    if (s.rule === 'chain') {
      // the outside function with the inside put back is the expression, and the step's result is f'(g) · g'
      const inside = D.evalFloat(s.inner, x)
      close(D.evalFloat(D.subst(s.outer, s.inner), x), D.evalFloat(s.expr, x), 'outside ∘ inside is the expression', 1e-9)
      const outerPrime = D.evalFloat(s.outerD, inside)
      const [, innerPrime] = dual(s.inner, x)
      if (Number.isFinite(outerPrime) && Number.isFinite(innerPrime)) close(sd, outerPrime * innerPrime, `chain step ${D.toText(s.expr)}: f'(g) g'`, 1e-7)
    }
  }
  // simplifying keeps the value and changes nothing the second time; printing and parsing again gives the same function
  close(F(D.simp(f))(x), fx, `simplify ${D.toText(f)}`, 1e-9)
  eq(D.toText(D.simp(D.simp(f))), D.toText(D.simp(f)), `simplifying twice: ${D.toText(f)}`)
  let again
  try {
    again = P(D.toText(f))
  } catch (e) {
    fail(`could not read back ${D.toText(f)}: ${e.code ?? e.message}`)
    continue
  }
  close(F(again)(x), fx, `parse(toText) of ${D.toText(f)}`, 1e-9)
}
eq(floatChecked > 2500, true, 'enough expressions compared')
eq(stepChecked > 6000, true, 'enough steps compared')

/* ------------------------------------------------ 6. the chain rule itself */
const OUTER = ['x^3', 'sin(x)', 'e^x', 'sqrt(x)', 'tan(x)', 'cos(x)', '1/x', 'x^(-2)', 'sec(x)', 'x^5']
const INNER = ['2x', 'x^2+1', '3x-1', 'x^2', 'cos(x)', 'e^x', '5-2x', '1/x', 'x^3-x', 'sin(x)+2']
let pairs = 0
for (const o of OUTER) {
  for (const i of INNER) {
    const outer = P(o)
    const inner = P(i)
    const comp = D.subst(outer, inner)
    for (let k = 0; k < 12; k++) {
      const x = 0.3 + Math.random() * 1.6
      const u = D.evalFloat(inner, x)
      const fu = D.evalFloat(comp, x)
      if (!Number.isFinite(u) || !Number.isFinite(fu) || Math.abs(fu) > 1e4) continue
      const fPrime = D.evalFloat(D.derive(outer).result, u)
      const gPrime = D.evalFloat(D.derive(inner).result, x)
      if (!Number.isFinite(fPrime) || !Number.isFinite(gPrime)) continue
      pairs++
      const whole = D.evalFloat(D.derive(comp).result, x)
      close(whole, fPrime * gPrime, `(${o}) ∘ (${i}) at ${x}: f'(g) g'`, 1e-7)
      close(central(F(comp), x), fPrime * gPrime, `(${o}) ∘ (${i}) at ${x}: central difference`, 3e-4)
      // the second derivative of a composite: f''(g)(g')² + f'(g) g''
      const f2 = D.evalFloat(D.nth(outer, 2), u)
      const g2 = D.evalFloat(D.nth(inner, 2), x)
      const second = D.evalFloat(D.nth(comp, 2), x)
      if (Number.isFinite(f2) && Number.isFinite(g2) && Number.isFinite(second) && Math.abs(second) < 1e5) close(second, f2 * gPrime * gPrime + fPrime * g2, `(${o}) ∘ (${i}) at ${x}: second derivative`, 1e-6)
    }
  }
}
eq(pairs > 800, true, 'enough outside/inside pairs')
// the gear train: y = u/2 and u = 3x
close(dval('(3x)/2', 5), 1.5, 'gears: dy/dx = (1/2)(3)')
// absolute value as sqrt(x^2) is not differentiable at 0, and the composite of two nondifferentiable things can be
close(D.evalFloat(D.derive(P('sqrt(x^2)')).result, 2), 1, '|x| has derivative 1 at 2')

/* ------------------------------------------------------------ 7b. refusals */
for (const src of ['2^x', 'x^x', 'x^(x)', 'e^', 'e', 'ln(x)', 'sin 2x', 'sin x^2', 'sin(2x', '', 'x+', 'x y', '3 +* 4', 'arcsin(x)', 'sin', 'sqrt x', '(x+1)^(sin(x))', 'abs(x)']) {
  let threw = false
  try {
    P(src)
  } catch {
    threw = true
  }
  eq(threw, true, `"${src}" is refused`)
}
for (const [src, code] of [['2^x', 'varexp'], ['x^x', 'varexp'], ['sin 2x', 'paren'], ['sin x^2', 'paren'], ['ln(x)', 'function'], ['sqrt x', 'paren']]) {
  let got = ''
  try {
    P(src)
  } catch (e) {
    got = e.code
  }
  eq(got, code, `the reason for refusing "${src}"`)
}
for (const src of ['sin x', 'sin(x)', 'sin x cos x', 'e^x', 'e^(x)', 'x e^-x', 'sqrt(x)', '2^3', '(x+1)^(1/2)', 'sin^2 x', 'cos(2 pi x)']) {
  let ok = true
  try {
    P(src)
  } catch {
    ok = false
  }
  eq(ok, true, `"${src}" is accepted`)
}

/* ------------------------------------------------------ the oscillation widgets */
for (let i = 0; i < 500; i++) {
  const A = 0.5 + Math.random() * 9
  const k = 0.1 + Math.random() * 6
  const x = Math.random() * 20
  const f = (t) => D.sinKx(A, k, t)
  close(central(f, x), D.sinKxSlope(A, k, x), 'the slope of A sin(kx) is A k cos(kx)', 1e-4)
  // the greatest slope is A k, reached where cos(kx) = 1
  let m = 0
  for (let j = 0; j <= 4000; j++) m = Math.max(m, Math.abs(D.sinKxSlope(A, k, (j / 4000) * ((2 * Math.PI) / k))))
  close(m, A * k, 'the greatest slope of A sin(kx) is A k', 1e-4)
  const b = 0.2 + Math.random() * 4
  const pis = D.pistonRates(A, b)
  const w = 2 * Math.PI * b
  close(pis.v, A * w, 'piston: greatest velocity A (2 pi b)', 1e-12)
  close(pis.a, A * w * w, 'piston: greatest acceleration A (2 pi b)^2', 1e-12)
  close(pis.j, A * w * w * w, 'piston: greatest jerk A (2 pi b)^3', 1e-12)
  const two = D.pistonRates(A, 2 * b)
  close(two.v / pis.v, 2, 'doubling the frequency doubles the velocity', 1e-12)
  close(two.a / pis.a, 4, 'doubling the frequency quadruples the acceleration', 1e-12)
  close(two.j / pis.j, 8, 'doubling the frequency multiplies the jerk by 8', 1e-12)
  // and they are the real extremes of s = A cos(2 pi b t) and its derivatives
  const s = (t) => A * Math.cos(w * t)
  const v = (t) => central(s, t, 1e-6)
  close(Math.abs(v(0.25 / b)), A * w, 'piston velocity at its extreme, by central difference', 1e-4)
}
for (let day = 0; day <= 365; day += 5) {
  const slope = D.fairbanksSlope(day)
  close(slope, central(D.fairbanks, day, 1e-4), `Fairbanks slope on day ${day}`, 1e-5)
}
close(D.fairbanksSlope(101), (40 * Math.PI) / 365, 'the temperature rises fastest on day 101')
close(D.fairbanks(101), -4, 'and it is -4 degrees then')
let fastest = 0
let fastestDay = 0
for (let d = 0; d <= 365; d += 0.01) {
  if (D.fairbanksSlope(d) > fastest) {
    fastest = D.fairbanksSlope(d)
    fastestDay = d
  }
}
close(fastestDay, 101, 'the fastest rise on the scan', 1e-3)
close(fastest, (40 * Math.PI) / 365, 'its rate on the scan', 1e-4)

/* --------------------------------- logarithms and general powers (the option log: true) */
const PL = (src) => D.parseExpression(src, { log: true })
const lval = (src, x) => D.evalFloat(PL(src), x)
const lder = (src, x) => D.evalFloat(D.derive(PL(src)).result, x)
const ltex = (src) => D.toTex(D.derive(PL(src)).result)
close(lval('ln(x)', Math.E), 1, 'ln e = 1')
close(lval('log(x)', 1000), 3, 'log is base 10')
close(lval('2^x', 5), 32, 'parse 2^x')
close(lval('x^x', 3), 27, 'parse x^x')
close(lval('x^pi', 2), 2 ** Math.PI, 'parse x^pi')
close(lval('x^(1/2)', 9), 3, 'a rational exponent is still an ordinary power')
close(lval('ln^2(x)', Math.E), 1, 'parse ln^2(x)')
close(lval('x^-x', 2), 0.25, 'parse x^-x')
close(lder('ln(x)', 2), 0.5, 'd ln x = 1/x')
close(lder('ln(2x)', 3), 1 / 3, 'd ln 2x = 1/x')
close(lder('ln(x^2+3)', 2), 4 / 7, 'd ln(x^2 + 3) = 2x/(x^2 + 3)')
close(lder('ln(x)^3', Math.E), 3 / Math.E, 'd (ln x)^3 = 3 (ln x)^2/x')
close(lder('log(x)', 10), 1 / (10 * Math.LN10), 'd log10 x = 1/(x ln 10)')
close(lder('2^x', 1), 2 * Math.LN2, 'd 2^x = 2^x ln 2')
close(lder('3^(sin x)', 0.9), 3 ** Math.sin(0.9) * Math.log(3) * Math.cos(0.9), 'd 3^(sin x)')
close(lder('x^x', 2), 4 * (Math.log(2) + 1), 'd x^x = x^x (ln x + 1)')
close(lder('x^(sin x)', 1.3), 1.3 ** Math.sin(1.3) * (Math.cos(1.3) * Math.log(1.3) + Math.sin(1.3) / 1.3), 'd x^(sin x)')
close(lder('x^pi', 2), Math.PI * 2 ** (Math.PI - 1), 'the general power rule: d x^pi = pi x^(pi - 1)')
close(lder('(x^2+1)^x', 1), 2 * (Math.log(2) + 1), 'd (x^2 + 1)^x')
// the example of logarithmic differentiation
close(lder('x^2 (x+1)^3/(x-2)', 3), (9 * 64) / 1 * (2 / 3 + 3 / 4 - 1), 'logarithmic differentiation of x^2 (x+1)^3/(x-2)')
eq(ltex('ln(x)'), '\\frac{1}{x}', 'TeX of d ln x')
eq(ltex('ln(x^2+3)'), '\\frac{2x}{x^{2}+3}', 'TeX of d ln(x^2 + 3)')
eq(ltex('2^x'), '2^{x}\\ln 2', 'TeX of d 2^x')
eq(ltex('x^x'), '\\left(\\ln x+1\\right)x^{x}', 'TeX of d x^x')
eq(ltex('x^pi'), '\\pi\\,x^{\\pi-1}', 'TeX of d x^pi')
for (const src of ['ln', 'ln(', 'x^', 'log 2x', 'ln xy']) {
  let threw = false
  try {
    PL(src)
  } catch {
    threw = true
  }
  eq(threw, true, `"${src}" is refused with logarithms on`)
}
for (const src of ['ln(x)', 'ln x', 'ln(x)', '2^x', 'x^x', 'e^x ln x', 'x ln x', '(ln x)^2', 'x^(1/x)']) {
  let ok = true
  try {
    PL(src)
  } catch {
    ok = false
  }
  eq(ok, true, `"${src}" is accepted with logarithms on`)
}
// and with the option off the earlier behaviour is kept
for (const [src, code] of [['2^x', 'varexp'], ['x^x', 'varexp'], ['ln(x)', 'function'], ['log(x)', 'function']]) {
  let got = ''
  try {
    P(src)
  } catch (e) {
    got = e.code
  }
  eq(got, code, `without logarithms "${src}" is still refused for the reason ${code}`)
}
// random expressions with logarithms and general powers: dual numbers, central differences, every step
const genLog = (depth) => {
  if (depth <= 0 || Math.random() < 0.2) {
    const c = Math.random()
    return c < 0.25 ? D.K(rnd(2, 5), rnd(1, 2)) : D.X
  }
  const op = pick(['add', 'sub', 'mul', 'div', 'ln', 'ln', 'gp', 'gp', 'exp', 'fn', 'pow'])
  if (op === 'ln') return D.ln(genLog(depth - 1))
  if (op === 'gp') return D.gp(genLog(depth - 1), genLog(depth - 1))
  if (op === 'exp') return D.ex(genLog(depth - 1))
  if (op === 'fn') return D.fn(pick(D.FN_NAMES), genLog(depth - 1))
  if (op === 'pow') return D.pw(genLog(depth - 1), R(rnd(-3, 3), rnd(1, 2)))
  return D[op](genLog(depth - 1), genLog(depth - 1))
}
let logChecked = 0
let logSteps = 0
for (let i = 0; i < 6000; i++) {
  const f = genLog(3)
  const x = 0.5 + Math.random() * 2.5
  const fx = F(f)(x)
  if (!Number.isFinite(fx) || Math.abs(fx) > 1e4 || !tame(f, x)) continue
  const { result, steps } = D.derive(f)
  const dv = D.evalFloat(result, x)
  const [dualV, dualD] = dual(f, x)
  const cd = central(F(f), x)
  if (!Number.isFinite(dv) || !Number.isFinite(cd) || !Number.isFinite(dualD) || Math.abs(cd) > 1e4) continue
  logChecked++
  close(dualV, fx, `dual value of ${D.toText(f)}`, 1e-9)
  close(dv, dualD, `derivative of ${D.toText(f)} at ${x} against dual numbers`, 1e-7)
  close(dv, cd, `derivative of ${D.toText(f)} at ${x} against central differences`, 3e-4)
  for (const s of steps) {
    const sd = D.evalFloat(s.result, x)
    const sc = central(F(s.expr), x)
    if (!Number.isFinite(sd) || !Number.isFinite(sc) || Math.abs(sc) > 1e4) continue
    logSteps++
    close(sd, sc, `step ${s.rule} on ${D.toText(s.expr)} at ${x}`, 3e-4)
    if (s.rule === 'logdiff' && Number.isFinite(Math.log(D.evalFloat(s.expr, x)))) {
      // ln y = b ln a: the step carries that form, and it has the same value as ln of the expression
      close(D.evalFloat(s.lnForm, x), Math.log(D.evalFloat(s.expr, x)), 'ln y = b ln a', 1e-9)
    }
  }
  close(F(D.simp(f))(x), fx, `simplify ${D.toText(f)}`, 1e-9)
  eq(D.toText(D.simp(D.simp(f))), D.toText(D.simp(f)), `simplifying twice: ${D.toText(f)}`)
  let again
  try {
    again = PL(D.toText(f))
  } catch (e) {
    if (e.code === 'big') continue // a constant such as (5 + 3)^3 read back as a whole-number exponent above the limit
    fail(`could not read back ${D.toText(f)}: ${e.code ?? e.message}`)
    continue
  }
  close(F(again)(x), fx, `parse(toText) of ${D.toText(f)}`, 1e-9)
}
eq(logChecked > 1500, true, 'enough expressions with logarithms were compared')
// logarithmic differentiation: y' = y · d/dx (ln of y split by the laws of logarithms), for products, quotients and powers
let splitChecked = 0
for (let i = 0; i < 3000; i++) {
  const f = genLog(3)
  const x = 0.5 + Math.random() * 2.5
  const fx = F(f)(x)
  if (!Number.isFinite(fx) || Math.abs(fx) > 1e3 || Math.abs(fx) < 1e-6 || !tame(f, x)) continue
  const split = D.lnSplit(f)
  const dl = D.evalFloat(D.derive(split).result, x)
  const direct = D.evalFloat(D.derive(f).result, x)
  if (!Number.isFinite(dl) || !Number.isFinite(direct)) continue
  splitChecked++
  close(fx * dl, direct, `y · (ln y split)' for ${D.toText(f)} at ${x}`, 1e-7)
}
eq(splitChecked > 800, true, 'enough logarithmic differentiations compared')

eq(logSteps > 3000, true, 'enough steps with logarithms were compared')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`chain check ok — ${checks} checks (the chain rule vs exact rational derivatives, exact fractional powers, dual numbers, central differences for every expression and every step, every outside/inside pair and the second-derivative form, round trips, refusals, the oscillation numbers)`)
