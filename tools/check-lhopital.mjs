/** Checks src/lib/lhopital.ts, the numbers behind the "Indeterminate Forms and l'Hôpital's Rule" article.
 *
 *  References that do not use the code under test:
 *   1. Forty-six quotients and fourteen powers whose limits were computed by SymPy's `limit`, a separate program (the values are
 *      written into this file), among them the textbook's examples and exercises.
 *   2. The textbook's own cases as the article presents them (LIMIT_CASES and FORM_CASES), each with the value worked out by
 *      hand, and the steps the rule takes: 0/0 or ∞/∞ at every round but the last.
 *   3. The cases where the rule gives nothing: a quotient that is not indeterminate (the rule must not be applied), a cycle,
 *      and a quotient of derivatives with no limit.
 *   4. Limits that are known in closed form for random parameters: (e^(px) − e^(qx))/x → p − q, sin(px)/sin(qx) → p/q,
 *      (1 − cos px)/x² → p²/2, ln(1 + px)/x → p, (p x² + q x)/(r x² + s) → p/r, ln(x^p + 1)/ln x → p, x^p ln x → 0,
 *      (1 + px)^(1/x) → e^p, (1 + p/x)^x → e^p.
 *   5. Cauchy's Mean Value Theorem against a scan of the two derivatives written by hand, and its hypothesis.
 *   6. The refusals.
 *
 *  Run: npm run check:lhopital   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lh-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/lhopital.ts')}'
export * from '${p('src/lib/lhopitalshow.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const ok = (cond, what) => {
  checks++
  if (!cond) fail(what)
}
const rnd = (a, b) => a + Math.random() * (b - a)
const PI = Math.PI
const parsePoint = (a) => (a === 'inf' ? Infinity : a === '-inf' ? -Infinity : Number(a))
const sideOf = (d) => (d === '+' ? 'plus' : d === '-' ? 'minus' : 'both')

/** Does a result equal an expected value: a number, 'inf', '-inf' or 'dne'? */
function matches(r, want, tol = 1e-5) {
  if (!r) return false
  if (want === 'inf') return r.kind === 'inf' && r.sign > 0
  if (want === '-inf') return r.kind === 'inf' && r.sign < 0
  if (want === 'dne') return r.kind === 'dne'
  return r.kind === 'finite' && Math.abs(r.value - want) <= tol * (1 + Math.abs(want))
}
const show = (r) => (!r ? 'none' : r.kind === 'finite' ? String(r.value) : r.kind === 'inf' ? (r.sign > 0 ? 'inf' : '-inf') : 'dne')
/** What the rule gives, or the direct reading when it could not. */
const answer = (r) => (r.status === 'cycle' || r.status === 'many' || r.status === 'inconclusive' ? r.direct : r.result)

// Limits computed by SymPy: [numerator, denominator or base, exponent for the powers, point, side, value]. Written here so the checker needs no Python.
const SYMPY = {
  ratio: [
  ["3*x-sin(x)", "x", 0, "+-", 2.0],
  ["sqrt(1+x)-1", "x", 0, "+-", 0.5],
  ["sqrt(1+x)-1-x/2", "x^2", 0, "+-", -0.125],
  ["x-sin(x)", "x^3", 0, "+-", 0.16666666666666666],
  ["1-cos(x)", "x+x^2", 0, "+-", 0.0],
  ["sin(x)", "x^2", 0, "+", "inf"],
  ["sin(x)", "x^2", 0, "-", "-inf"],
  ["sin(x)", "x^2", 0, "+-", "inf"],
  ["x^2-4", "x-2", 2, "+-", 4.0],
  ["x^2-25", "x+5", -5, "+-", -10.0],
  ["x^3-1", "x-1", 1, "+-", 3.0],
  ["sin(x^2)", "x", 0, "+-", 0.0],
  ["sin(5*x)", "2*x", 0, "+-", 2.5],
  ["8*x^2", "cos(x)-1", 0, "+-", -16.0],
  ["sin(x)-x", "x^3", 0, "+-", -0.16666666666666666],
  ["tan(x)-1", "x-pi/4", 0.7853981633974483, "+-", 2.0],
  ["1-sin(x)", "1+cos(2*x)", 1.5707963267948966, "+-", 0.25],
  ["e^x-1-x", "x^2", 0, "+-", 0.5],
  ["e^x-1-x-x^2/2", "x^3", 0, "+-", 0.16666666666666666],
  ["tan(x)-x", "x^3", 0, "+-", 0.3333333333333333],
  ["x-sin(x)", "x-tan(x)", 0, "+-", -0.5],
  ["arctan(x)-x", "x^3", 0, "+-", -0.3333333333333333],
  ["1-cos(x)", "x^2", 0, "+-", 0.5],
  ["e^x-e^(-x)", "sin(x)", 0, "+-", 2.0],
  ["ln(x)", "x-1", 1, "+-", 1.0],
  ["ln(1+x)", "x", 0, "+-", 1.0],
  ["sin(x)-x*cos(x)", "x^3", 0, "+-", 0.3333333333333333],
  ["ln(x)", "1/x", 0, "+", 0.0],
  ["sin(x)-x", "x*sin(x)", 0, "+-", 0.0],
  ["x-1-ln(x)", "ln(x)*(x-1)", 1, "+", 0.5],
  ["x^2*sin(1/x)", "sin(x)", 0, "+", 0.0],
  ["5*x^2-3*x", "7*x^2+1", "inf", "+", 0.7142857142857143],
  ["ln(x)", "2*sqrt(x)", "inf", "+", 0.0],
  ["e^x", "x^2", "inf", "+", "inf"],
  ["ln(x)^2", "x", "inf", "+", 0.0],
  ["x", "e^x", "inf", "+", 0.0],
  ["x^3", "e^x", "inf", "+", 0.0],
  ["ln(x^2+1)", "ln(x)", "inf", "+", 2.0],
  ["e^x+x", "e^x-x", "inf", "+", 1.0],
  ["sin(1/x)", "1/x", "inf", "+", 1.0],
  ["sqrt(9*x+1)", "sqrt(x)+1", "inf", "+", 3.0],
  ["sqrt(x^2+1)", "x", "inf", "+", 1.0],
  ["x+sin(x)", "x", "inf", "+", 1.0],
  ["sec(x)", "1+tan(x)", 1.5707963267948966, "-", 1.0],
  ["ln(x)", "x", "inf", "+", 0.0],
  ["x^2", "e^x", "inf", "+", 0.0],
  ],
  power: [
  ["1+x", "1/x", 0, "+", 2.718281828459045],
  ["1+1/x", "x", "inf", "+", 2.718281828459045],
  ["x", "1/x", "inf", "+", 1.0],
  ["x", "x", 0, "+", 1.0],
  ["sin(x)", "x", 0, "+", 1.0],
  ["x", "1/(x-1)", 1, "+", 2.718281828459045],
  ["cos(x)", "1/x^2", 0, "+", 0.6065306597126334],
  ["1+2/x", "x", "inf", "+", 7.38905609893065],
  ["1+sin(x)", "1/x", 0, "+", 2.718281828459045],
  ["1/x", "sin(x)", 0, "+", 1.0],
  ["x", "sin(x)", 0, "+", 1.0],
  ["1+x^2", "1/x^2", 0, "+", 2.718281828459045],
  ["2^x+3^x", "1/x", "inf", "+", 3.0],
  ["x", "1/ln(x)", "inf", "+", 2.718281828459045],
  ],
}

/* ------------------------------------------------ 1: limits computed by SymPy */
for (const [num, den, a, d, want] of SYMPY.ratio) {
  const w = num === 'sin(x)' && den === 'x^2' && d === '+-' ? 'dne' : want // SymPy's two-sided limit takes the right-hand one
  const r = M.lhopital(num, den, parsePoint(a), sideOf(d))
  ok(r.ok, `${num} / ${den}: runs`)
  if (r.ok) ok(matches(answer(r), w), `${num} / ${den} at ${a} (${d}): got ${show(answer(r))} (${r.status}), SymPy says ${w}`)
}
for (const [f, g, a, d, want] of SYMPY.power) {
  const r = M.powerLimit(f, g, parsePoint(a), sideOf(d))
  ok(r.ok, `(${f})^(${g}): runs`)
  if (r.ok) ok(matches(r.result, want), `(${f})^(${g}) at ${a} (${d}): got ${show(r.result)} (${r.form}), SymPy says ${want}`)
}

/* ------------------------------------- 2: the textbook's cases as the article shows them */
{
  const E = Math.E
  const want = { ex1a: 2, ex1b: 0.5, ex1c: -0.125, ex1d: 1 / 6, ex2: 0, ex3a: 'inf', ex3b: '-inf', ex4a: 1, ex4b: 0, ex4c: 'inf', poly: 5 / 7, ex5a: 1, ex5b: 0, ex6: 0, 'ln-slope': 1, cycle: 3, inconclusive: 1 }
  for (const c of M.LIMIT_CASES) {
    const r = M.lhopital(c.num, c.den, c.a, c.side)
    ok(r.ok, `${c.id}: runs`)
    if (r.ok) ok(matches(answer(r), want[c.id]), `${c.id}: got ${show(answer(r))} (${r.status}), want ${want[c.id]}`)
  }
  const wf = { 'x-ln-x': 0, 'x-sin': 1, difference: 0, 'difference-log': 0.5, 'one-inf': E, 'one-inf-far': E, 'inf-zero': 1, 'zero-zero': 1, 'zero-zero-sin': 1, 'one-inf-slope': E }
  for (const c of M.FORM_CASES) {
    if (c.pow) {
      const r = M.powerLimit(c.pow.f, c.pow.g, c.a, c.side)
      ok(r.ok && matches(r.result, wf[c.id]), `${c.id}: got ${r.ok ? show(r.result) : r.error}, want ${wf[c.id]}`)
    } else {
      const r = M.lhopital(c.num, c.den, c.a, c.side)
      ok(r.ok && matches(answer(r), wf[c.id]), `${c.id}: got ${r.ok ? show(answer(r)) : r.error}, want ${wf[c.id]}`)
    }
  }
  // the steps: the rule is applied while the quotient is 0/0 or ∞/∞, and stops at the first one that is not
  const forms = (n, d, a, side = 'both') => M.lhopital(n, d, a, side).steps.map((s) => s.form).join(' ')
  ok(forms('3*x-sin(x)', 'x', 0) === '0/0 determinate', 'Example 1a: one round')
  ok(forms('sqrt(1+x)-1-x/2', 'x^2', 0) === '0/0 0/0 determinate', 'Example 1c: two rounds')
  ok(forms('x-sin(x)', 'x^3', 0) === '0/0 0/0 0/0 determinate', 'Example 1d: three rounds')
  ok(forms('1-cos(x)', 'x+x^2', 0) === '0/0 determinate', 'Example 2: one round, then sin x/(1 + 2x) is not indeterminate')
  ok(forms('5*x^2-3*x', '7*x^2+1', Infinity) === 'inf/inf inf/inf determinate', 'the leading coefficients: two rounds')
  ok(forms('e^x', 'x^2', Infinity) === 'inf/inf inf/inf determinate', 'Example 4c: two rounds')
  ok(forms('ln(x)', 'ln(sin(x))', 0, 'plus') === 'inf/inf 0/0 determinate', 'ln x / ln sin x: ∞/∞, then 0/0, then 1')
  const e2 = M.lhopital('1-cos(x)', 'x+x^2', 0)
  ok(e2.steps.length === 2 && e2.result.kind === 'finite' && Math.abs(e2.result.value) < 1e-9, 'Example 2: the answer is 0, not 1/2')
  ok(!matches(e2.result, 0.5), 'Example 2: applying the rule a second time (to sin x/(1 + 2x)) would give 1/2, which is wrong')
  // a quotient that is not indeterminate is not touched
  const nd = M.lhopital('x^2+1', 'x+1', 2)
  ok(nd.ok && nd.status === 'notindeterminate' && nd.steps.length === 1 && matches(nd.result, 5 / 3), 'a determinate quotient: the value is 5/3 and the rule is not used')
  const z = M.lhopital('x', 'x+1', 0)
  ok(z.ok && z.status === 'notindeterminate' && matches(z.result, 0), '0/1 is 0, not indeterminate')
  ok(matches(M.lhopital('1', 'x', 0, 'plus').result, 'inf'), '1/x from the right is +∞')
  ok(matches(M.lhopital('1', 'x', 0, 'minus').result, '-inf'), '1/x from the left is −∞')
  ok(matches(M.lhopital('1', 'x', 0, 'both').result, 'dne'), '1/x from both sides has no limit')
  ok(matches(M.lhopital('1', 'x^2', 0, 'both').result, 'inf'), '1/x² from both sides is +∞')
  // cycles and no limit for the quotient of derivatives
  ok(M.lhopital('sqrt(9*x+1)', 'sqrt(x)+1', Infinity).status === 'cycle', 'Exercise 69: the rule cycles')
  ok(M.lhopital('sqrt(x^2+1)', 'x', Infinity).status === 'cycle', 'sqrt(x²+1)/x: the rule cycles')
  ok(M.lhopital('x+sin(x)', 'x', Infinity).status === 'inconclusive', '(x + sin x)/x: the quotient of derivatives has no limit')
  ok(matches(M.lhopital('x+sin(x)', 'x', Infinity).direct, 1), '(x + sin x)/x → 1, found without the rule')
  ok(matches(M.lhopital('sqrt(9*x+1)', 'sqrt(x)+1', Infinity).direct, 3), 'Exercise 69 → 3, found without the rule')
  const rr = M.lhopital('x^2*sin(1/x)', 'sin(x)', 0, 'plus')
  ok(rr.status === 'inconclusive' && matches(rr.direct, 0), 'x² sin(1/x) / sin x: the derivatives have no limit, the quotient → 0')
}

/* -------------------------------------------- 4: random limits known in closed form */
{
  for (let t = 0; t < 300; t++) {
    const pp = Math.round(rnd(1, 6) * 4) / 4
    const q = Math.round(rnd(0.5, 5) * 4) / 4 * (Math.random() < 0.5 ? 1 : -1)
    let r = M.lhopital(`e^(${pp}*x)-e^(${q}*x)`, 'x', 0)
    ok(r.ok && matches(answer(r), pp - q), `(e^(${pp}x) − e^(${q}x))/x → ${pp - q}: got ${r.ok ? show(answer(r)) : r.error}`)
    r = M.lhopital(`sin(${pp}*x)`, `sin(${Math.abs(q)}*x)`, 0)
    ok(r.ok && matches(answer(r), pp / Math.abs(q)), `sin(${pp}x)/sin(${Math.abs(q)}x) → ${pp / Math.abs(q)}: got ${r.ok ? show(answer(r)) : r.error}`)
    r = M.lhopital(`1-cos(${pp}*x)`, 'x^2', 0)
    ok(r.ok && matches(answer(r), (pp * pp) / 2), `(1 − cos ${pp}x)/x² → ${(pp * pp) / 2}`)
    r = M.lhopital(`ln(1+${pp}*x)`, 'x', 0)
    ok(r.ok && matches(answer(r), pp), `ln(1 + ${pp}x)/x → ${pp}`)
    const rr = Math.round(rnd(1, 5) * 4) / 4
    const ss = Math.round(rnd(1, 8))
    r = M.lhopital(`${pp}*x^2+${Math.abs(q)}*x`, `${rr}*x^2+${ss}`, Infinity)
    ok(r.ok && matches(answer(r), pp / rr), `(${pp}x² + ${Math.abs(q)}x)/(${rr}x² + ${ss}) → ${pp / rr}`)
    r = M.lhopital(`ln(x^${pp}+1)`, 'ln(x)', Infinity)
    ok(r.ok && matches(answer(r), pp, 1e-4), `ln(x^${pp} + 1)/ln x → ${pp}: got ${r.ok ? show(answer(r)) : r.error}`)
    r = M.lhopital('ln(x)', `x^(-${pp})`, 0, 'plus')
    ok(r.ok && matches(answer(r), 0, 1e-3), `x^${pp} ln x → 0: got ${r.ok ? show(answer(r)) : r.error}`)
    r = M.lhopital(`x^${pp}`, 'e^x', Infinity)
    ok(r.ok && matches(answer(r), 0, 1e-3), `x^${pp}/e^x → 0`)
    let pw = M.powerLimit(`1+${pp}*x`, '1/x', 0, 'plus')
    ok(pw.ok && matches(pw.result, Math.exp(pp)), `(1 + ${pp}x)^(1/x) → e^${pp}: got ${pw.ok ? show(pw.result) : pw.error}`)
    pw = M.powerLimit(`1+${pp}/x`, 'x', Infinity)
    ok(pw.ok && matches(pw.result, Math.exp(pp)), `(1 + ${pp}/x)^x → e^${pp}`)
  }
}

/* ------------------------------------------------------------- 5: Cauchy's Mean Value Theorem */
{
  const c1 = M.cauchy('x^3', 'x^2', 0, 2)
  ok(c1.ok && Math.abs(c1.slope - 2) < 1e-12 && c1.points.length === 1 && Math.abs(c1.points[0] - 4 / 3) < 1e-6, 'x³ and x² on [0, 2]: slope 2 and c = 4/3')
  const c2 = M.cauchy('sin(x)', 'cos(x)', 0, PI / 2)
  ok(c2.ok && Math.abs(c2.slope + 1) < 1e-12 && c2.points.length === 1 && Math.abs(c2.points[0] - PI / 4) < 1e-6, 'sin and cos on [0, π/2]: slope −1 and c = π/4')
  const c3 = M.cauchy('x^2+3*x', 'x', 1, 4)
  ok(c3.ok && c3.points.length === 1 && Math.abs(c3.points[0] - 2.5) < 1e-6, 'g(x) = x is the Mean Value Theorem: c = 5/2 for x² + 3x on [1, 4]')
  ok(M.cauchy('x^2', 'x^2', -1, 1).ok === false || M.cauchy('x^2', 'x^2', -1, 1).gPrimeNonzero === false, 'g′ = 2x vanishes inside (−1, 1): the hypothesis fails')
  const c4 = M.cauchy('x', 'x^2', -1, 1)
  ok(c4.ok && c4.gPrimeNonzero === false, 'g(x) = x² on [−1, 1]: g′ is zero at 0')
  // random pairs: f polynomial, g = e^(kx) + x with g′ > 0
  for (let t = 0; t < 300; t++) {
    const u = rnd(-3, 3)
    const v = rnd(-3, 3)
    const w = rnd(-2, 2)
    const k = rnd(0.2, 1.5)
    const a = rnd(-2, 1)
    const b = a + rnd(0.5, 3)
    const f = (x) => u * x ** 3 + v * x * x + w * x
    const df = (x) => 3 * u * x * x + 2 * v * x + w
    const g = (x) => Math.exp(k * x) + x
    const dg = (x) => k * Math.exp(k * x) + 1
    const r = M.cauchy(`(${u})*x^3+(${v})*x^2+(${w})*x`, `e^((${k})*x)+x`, a, b)
    ok(r.ok && r.gPrimeNonzero, 'g′ > 0: the hypothesis holds')
    if (!r.ok) continue
    const m = (f(b) - f(a)) / (g(b) - g(a))
    ok(Math.abs(r.slope - m) < 1e-9 * (1 + Math.abs(m)), 'Cauchy: the secant slope')
    // independent scan for the sign changes of f′ − m g′
    const K = 100000
    let prev = Math.sign(df(a) - m * dg(a))
    let count = 0
    for (let i = 1; i <= K; i++) {
      const x = a + ((b - a) * i) / K
      const s = Math.sign(df(x) - m * dg(x))
      if (s !== 0) {
        if (prev !== 0 && s !== prev) count++
        prev = s
      }
    }
    ok(r.points.length === count, `Cauchy: ${r.points.length} points found, the scan sees ${count}`)
    ok(r.points.length >= 1, 'Cauchy: the theorem promises at least one point')
    for (const c of r.points) ok(c > a && c < b && Math.abs(df(c) / dg(c) - m) < 1e-6 * (1 + Math.abs(m)), `Cauchy: f′(c)/g′(c) = ${m} at c = ${c}`)
  }
}

/* ------------------------------------------------------- showing limits, and the cases that fail */
{
  const BS = String.fromCharCode(92)
  const T = (s) => s.replaceAll('~', BS)
  for (const [x, want] of [[0.5, '~frac{1}{2}'], [-0.125, '-~frac{1}{8}'], [1 / 6, '~frac{1}{6}'], [3, '3'], [2.5, '~frac{5}{2}'], [Math.E, 'e'], [1 / Math.E, 'e^{-1}'], [Math.E ** 2, 'e^{2}'], [Math.exp(-0.5), 'e^{-~frac{1}{2}}'], [Math.PI / 2, '~frac{~pi}{2}'], [Math.PI, '~pi'], [Math.SQRT2, '~sqrt{2}'], [0, '0'], [Infinity, '~infty'], [-Infinity, '-~infty'], [0.7142857142857143, '~frac{5}{7}']]) {
    const got = M.niceTex(x)
    ok(got === T(want), `niceTex(${x}): got ${got}, want ${T(want)}`)
  }
  ok(M.niceTex(0.123456789123).startsWith('0.12345'), 'a number with no simple form is a decimal')
  const wantFail = { determinate: [5 / 3, 'notindeterminate'], ex2: [0, 'done'], inconclusive: [1, 'inconclusive'], cycle: [3, 'cycle'], oscillates: [0, 'inconclusive'], ex3a: ['inf', 'done'], ex3b: ['-inf', 'done'] }
  for (const c of M.FAIL_CASES) {
    const r = M.lhopital(c.num, c.den, c.a, c.side)
    const [v, st] = wantFail[c.id]
    ok(r.ok && r.status === st && matches(answer(r), v), `${c.id}: status ${r.ok ? r.status : r.error}, answer ${r.ok ? show(answer(r)) : ''}`)
  }
  // applying the rule where it must not be applied really gives the wrong number
  const det = M.lhopital('x^2+1', 'x+1', 2)
  ok(det.status === 'notindeterminate' && !matches(det.result, 4), '(x² + 1)/(x + 1): the rule would give 4, the limit is 5/3')
}

/* ------------------------------------------------------------------------ 6: refusals */
{
  ok(M.lhopital('x^+', 'x', 0).ok === false, 'a bad numerator is refused')
  ok(M.lhopital('x', 'x^+', 0).ok === false, 'a bad denominator is refused')
  ok(M.lhopital('x', 'x', NaN).ok === false, 'a bad point is refused')
  ok(M.powerLimit('x^+', 'x', 0).ok === false, 'a bad base is refused')
  ok(M.cauchy('x', 'x', 2, 1).ok === false, 'a bad interval is refused')
  ok(M.cauchy('x^+', 'x', 0, 1).ok === false, 'a bad function is refused')
}

console.log(`lhopital check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
