/** Checks src/lib/linearize.ts, the numbers behind the "Linearization and Differentials" article's widgets.
 *
 *  References that do not use the code under test:
 *   1. The values printed in the textbook (Examples 1 to 9, and the table of √(1 + x) ≈ 1 + x/2).
 *   2. Functions written twice, as text and as JavaScript with their derivatives written by hand: the linearization has
 *      the right value and slope at the center, and its error is ½ f″(a) (x − a)² to leading order, so error / (x − a)
 *      goes to 0 as x goes to a.
 *   3. The linearization is the best linear approximation: every other line through (a, f(a)) leaves an error whose
 *      ratio to x − a tends to f′(a) − m, not 0.
 *   4. Differentials against actual changes: Δf = f′(a) dx + ε dx with ε → 0, and ε ≈ ½ f″(a) dx.
 *   5. The percentage rule for y = c xⁿ against exact powers, with the textbook's exercises.
 *   6. The linearization of a sum, a product and a composition against the sum, product and chain rules.
 *   7. The refusals: a bad function, a center outside the domain, a center where the derivative does not exist.
 *
 *  Run: npm run check:linearize   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lin-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/linearize.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const close = (got, want, what, tol = 1e-9) => {
  checks++
  const scale = Math.max(1, Math.abs(want))
  if (!(Math.abs(got - want) / scale < tol)) fail(`${what}: got ${got}, want ${want}`)
}
const ok = (cond, what) => {
  checks++
  if (!cond) fail(what)
}
const rnd = (a, b) => a + Math.random() * (b - a)
const PI = Math.PI
const lin = (src, a) => {
  const r = M.linearize(src, a)
  if (!r.ok) throw new Error(`${src} at ${a}: ${r.error}`)
  return r
}

/* ------------------------------------------------------- 1: the textbook's values */
{
  const L0 = lin('sqrt(1+x)', 0)
  close(L0.slope, 0.5, 'Example 1: slope')
  close(L0.intercept, 1, 'Example 1: intercept')
  for (const [x, approx, truth] of [
    [0.005, 1.0025, 1.002497],
    [0.05, 1.025, 1.024695],
    [0.2, 1.1, 1.095445],
  ]) {
    close(L0.line(x), approx, `Example 1: L(${x})`, 1e-12)
    close(L0.value(x), truth, `Example 1: √(1 + ${x})`, 1e-6)
    ok(Math.abs(L0.line(x) - L0.value(x)) < (x === 0.005 ? 1e-5 : x === 0.05 ? 1e-3 : 1e-2), `Example 1: the error at ${x} is below the printed bound`)
  }
  close(L0.line(2), 2, 'Example 1: x = 2 gives 2 for √3, which is not accurate to one decimal place')
  const L3 = lin('sqrt(1+x)', 3)
  close(L3.slope, 0.25, 'Example 2: slope')
  close(L3.intercept, 1.25, 'Example 2: intercept 5/4')
  close(L3.line(3.2), 2.05, 'Example 2: L(3.2)', 1e-12)
  close(L3.value(3.2), 2.04939, 'Example 2: √4.2', 1e-5)
  ok(Math.abs(L3.line(3.2) - L3.value(3.2)) < 1e-3, 'Example 2: the error is below one thousandth')
  ok(Math.abs(L0.line(3.2) - L0.value(3.2)) / L0.value(3.2) > 0.25, 'Example 2: the first linearization is off by more than 25% at 3.2')
  const Lc = lin('cos(x)', PI / 2)
  close(Lc.slope, -1, 'Example 3: slope −1')
  close(Lc.intercept, PI / 2, 'Example 3: intercept π/2')
  const Lr = lin('x^(1/3)', 8)
  close(Lr.slope, 1 / 12, 'Example 7a: slope 1/12')
  close(Lr.line(7.97), 1.9975, 'Example 7a: 1.9975', 1e-12)
  close(Lr.value(7.97), 1.997497, 'Example 7a: the true value', 1e-6)
  const Ls = lin('sin(x)', PI / 6)
  close(Ls.line(PI / 6 + 0.01), 0.5 + (Math.sqrt(3) / 2) * 0.01, 'Example 7b: the estimate')
  close(Ls.line(PI / 6 + 0.01), 0.5087, 'Example 7b: 0.5087 as printed', 1e-4)
  close(Ls.value(PI / 6 + 0.01), 0.508635, 'Example 7b: the true value', 1e-6)
  // Example 6: a circle's radius from 10 to 10.1
  const La = lin('x^2', 10)
  close(La.da * 0.1, 2, 'Example 6: dA / π = 2 (dA = 2π)')
  close(M.differentialStep(La, 10, 0.1).delta, 2.01, 'Example 6: ΔA / π = 2.01')
  close(M.differentialStep(La, 10, 0.1).error, 0.01, 'Example 6: the error is 0.01π')
  close(M.differentialStep(La, 10, 0.1).epsilon, 0.1, 'Example 6: ε = 0.1')
  // Example 4: dy = (5x⁴ + 37x⁶) dx? the book's y = x⁵ + 37x, so dy = (5x⁴ + 37) dx = 8.4 at x = 1, dx = 0.2
  close(lin('x^5+37x', 1).da * 0.2, 8.4, 'Example 4: dy = 8.4')
  // Example 8: s = 4.9 t², ds = 9.8 t dt
  close(lin('4.9 x^2', 2).da * 0.1, 1.96, 'Example 8: ds = 1.96 m at t = 2')
  close(lin('4.9 x^2', 5).da * 0.1, 4.9, 'Example 8: ds = 4.9 m at t = 5')
  // exercise 6: the common linearizations at 0
  const at0 = { 'sin(x)': [1, 0], 'cos(x)': [0, 1], 'tan(x)': [1, 0], 'e^x': [1, 1], 'ln(1+x)': [1, 0] }
  for (const [src, [m, c]] of Object.entries(at0)) {
    const l = lin(src, 0)
    close(l.slope, m, `${src} at 0: slope`)
    close(l.intercept, c, `${src} at 0: intercept`)
  }
  // exercise 15 and 16: (1 + x)^k ≈ 1 + kx
  for (const k of [-6, 2, 1 / 3, 0.5, -1, 4]) {
    const l = lin(`(1+x)^(${k < 0 ? '-' : ''}${Math.abs(k) === 1 / 3 ? '1/3' : Math.abs(k)})`, 0)
    close(l.slope, k, `(1 + x)^${k}: slope k`)
    close(l.intercept, 1, `(1 + x)^${k}: intercept 1`)
  }
  // exercise 17: 1.0002^50 ≈ 1.01 and ∛1.009 ≈ 1.003
  close(1 + 50 * 0.0002, 1.01, '1.0002^50 ≈ 1.01')
  close(Math.pow(1.0002, 50), 1.010049, '1.0002^50 exactly', 1e-6)
  close(1 + 0.009 / 3, 1.003, '∛1.009 ≈ 1.003')
  // Example 9: m = m0 / sqrt(1 − v²/c²) ≈ m0 (1 + v²/(2c²)) for v ≪ c
  for (let i = 0; i < 100; i++) {
    const r = rnd(0.001, 0.1)
    const exactMass = 1 / Math.sqrt(1 - r * r)
    close(1 + (r * r) / 2, exactMass, 'Example 9: the relativistic mass', 4 * r ** 4)
  }
}

/* -------- 2: functions written twice, the error of a linearization is ½ f″(a) (x − a)² */
const FUNCS = [
  { s: 'sqrt(1+x)', f: (x) => Math.sqrt(1 + x), d: (x) => 0.5 / Math.sqrt(1 + x), d2: (x) => -0.25 * (1 + x) ** -1.5, lo: -0.5, hi: 6 },
  { s: 'cos(x)', f: Math.cos, d: (x) => -Math.sin(x), d2: (x) => -Math.cos(x), lo: -3, hi: 3 },
  { s: 'sin(x)', f: Math.sin, d: Math.cos, d2: (x) => -Math.sin(x), lo: -3, hi: 3 },
  { s: 'e^x', f: Math.exp, d: Math.exp, d2: Math.exp, lo: -2, hi: 2 },
  { s: 'ln(1+x)', f: (x) => Math.log(1 + x), d: (x) => 1 / (1 + x), d2: (x) => -1 / (1 + x) ** 2, lo: -0.5, hi: 5 },
  { s: 'x^(1/3)', f: Math.cbrt, d: (x) => 1 / (3 * Math.cbrt(x) ** 2), d2: (x) => -2 / (9 * Math.cbrt(x) ** 5), lo: 0.5, hi: 20 },
  { s: '1/x', f: (x) => 1 / x, d: (x) => -1 / (x * x), d2: (x) => 2 / x ** 3, lo: 0.4, hi: 4 },
  { s: 'tan(x)', f: Math.tan, d: (x) => 1 / Math.cos(x) ** 2, d2: (x) => (2 * Math.sin(x)) / Math.cos(x) ** 3, lo: -1.2, hi: 1.2 },
  { s: 'arctan(x)', f: Math.atan, d: (x) => 1 / (1 + x * x), d2: (x) => (-2 * x) / (1 + x * x) ** 2, lo: -3, hi: 3 },
  { s: 'x^3-2x', f: (x) => x ** 3 - 2 * x, d: (x) => 3 * x * x - 2, d2: (x) => 6 * x, lo: -3, hi: 3 },
  { s: 'x e^x', f: (x) => x * Math.exp(x), d: (x) => (1 + x) * Math.exp(x), d2: (x) => (2 + x) * Math.exp(x), lo: -2, hi: 2 },
]
for (const F of FUNCS) {
  for (let i = 0; i < 80; i++) {
    const a = rnd(F.lo, F.hi)
    const l = lin(F.s, a)
    close(l.fa, F.f(a), `${F.s}: f(a)`, 1e-12)
    close(l.da, F.d(a), `${F.s}: f′(a)`, 1e-9)
    close(l.line(a), F.f(a), `${F.s}: L(a) = f(a)`, 1e-12)
    close(l.slope * a + l.intercept, F.f(a), `${F.s}: m a + c = f(a)`, 1e-9)
    const h = 1e-3 * Math.max(0.3, Math.min(1, Math.abs(a) * 0.3 + 0.3))
    for (const sign of [1, -1]) {
      const x = a + sign * h
      const E = l.value(x) - l.line(x)
      const lead = 0.5 * F.d2(a) * h * h
      if (Math.abs(lead) > 1e-9) close(E, lead, `${F.s}: the error at a ${sign > 0 ? '+' : '−'} ${h.toPrecision(2)} is ½ f″(a) h²`, 0.05)
    }
    // the error divided by x − a goes to 0
    const e1 = Math.abs(l.value(a + 1e-2) - l.line(a + 1e-2)) / 1e-2
    const e2 = Math.abs(l.value(a + 1e-4) - l.line(a + 1e-4)) / 1e-4
    ok(e2 <= e1 + 1e-7, `${F.s}: error / (x − a) shrinks with x − a`)
  }
}

/* ------------------ 3: the linearization is the best linear approximation (Exercise 66) */
for (const F of FUNCS) {
  for (let i = 0; i < 40; i++) {
    const a = rnd(F.lo, F.hi)
    const l = lin(F.s, a)
    const m = F.d(a) + (Math.random() < 0.5 ? -1 : 1) * rnd(0.2, 3)
    const h = 1e-6
    // g(x) = f(a) + m (x − a): its error over x − a does not go to 0
    const ratio = (F.f(a + h) - (F.f(a) + m * h)) / h
    close(ratio, F.d(a) - m, `${F.s}: another slope leaves f′(a) − m`, 1e-4)
    ok(Math.abs(ratio) > 0.1, `${F.s}: the other line's error is not negligible`)
    const own = (l.value(a + h) - l.line(a + h)) / h
    ok(Math.abs(own) < 1e-3 * Math.max(1, Math.abs(F.d2(a))), `${F.s}: the linearization's error is negligible`)
  }
}

/* -------------------------------------------------- 4: differentials against real changes */
for (const F of FUNCS) {
  for (let i = 0; i < 60; i++) {
    const a = rnd(F.lo, F.hi)
    const l = lin(F.s, a)
    for (const dx of [1e-1, 1e-2, 1e-3, 1e-4]) {
      const sgn = Math.random() < 0.5 ? 1 : -1
      const d = sgn * dx * Math.max(0.2, Math.min(1, Math.abs(a) * 0.3))
      if (a + d < F.lo - 0.4 || a + d > F.hi + 0.4) continue
      const s = M.differentialStep(l, a, d)
      close(s.delta, F.f(a + d) - F.f(a), `${F.s}: Δf`, 1e-9)
      close(s.dy, F.d(a) * d, `${F.s}: df = f′(a) dx`, 1e-9)
      close(s.error, s.delta - s.dy, `${F.s}: Δf − df`, 1e-9)
      close(s.delta, s.dy + s.epsilon * d, `${F.s}: Δf = f′ dx + ε dx`, 1e-9)
      const lead = 0.5 * F.d2(a) * d
      if (dx <= 1e-3 && Math.abs(lead) > 1e-7) close(s.epsilon, lead, `${F.s}: ε ≈ ½ f″(a) dx`, 0.06)
      ok(Math.abs(s.epsilon) <= 10 * (Math.abs(F.d2(a)) + 1) * Math.abs(d), `${F.s}: ε is of the order of dx, so it goes to 0 with dx`)
    }
  }
}

/* --------------------------------------------------- 5: percentages for y = c xⁿ */
for (const n of [1, 2, 3, 4, -0.5, 0.5, -1, -2]) {
  for (let i = 0; i < 100; i++) {
    const pct = rnd(-5, 5)
    const r = M.percentChange(n, pct)
    close(r.estimate, n * pct, `n = ${n}: the estimate is n p`)
    let power = 1
    if (Number.isInteger(n) && n > 0) for (let k = 0; k < n; k++) power *= 1 + pct / 100
    else power = Math.exp(n * Math.log(1 + pct / 100))
    close(r.exact, (power - 1) * 100, `n = ${n}: the exact change at ${pct.toFixed(2)}%`, 1e-9)
    ok(Math.abs(r.estimate - r.exact) <= 0.5 * Math.abs(n * (n - 1)) * (pct / 100) ** 2 * 100 * 1.3 + 1e-9 || Math.abs(pct) < 0.2, `n = ${n}: the estimate is within the second-order term`)
    // small errors: the ratio of the two tends to 1
    const tiny = M.percentChange(n, 1e-4 * (Math.random() < 0.5 ? 1 : -1))
    close(tiny.exact / tiny.estimate, 1, `n = ${n}: the estimate is right for tiny errors`, 1e-3)
  }
}
{
  // the textbook's exercises
  close(M.percentChange(1, 2).estimate, 2, 'Exercise 55a: 2% in the radius is 2% in the circumference')
  close(M.percentChange(2, 2).estimate, 4, 'Exercise 55b: 2% in the radius is 4% in the area')
  close(M.percentChange(2, 0.5).estimate, 1, 'Exercise 56a: 0.5% in the edge is 1% in the surface area')
  close(M.percentChange(3, 0.5).estimate, 1.5, 'Exercise 56b: 0.5% in the edge is 1.5% in the volume')
  close(M.percentChange(3, 1).estimate, 3, 'Exercise 59: 1% in the diameter is 3% in the volume')
  close(M.tolerance(3, 1), 1 / 3, 'Exercise 57: 1% in the volume needs 1/3 % in h')
  close(M.tolerance(3, 3), 1, 'Exercise 60: 3% in the volume allows 1% in the diameter')
  close(M.tolerance(-0.5, 1), 2, 'a falling power: 1% in the period allows 2% in g')
  for (const n of [1, 2, 3, 4, -0.5, -1, -2]) close(M.percentChange(n, M.tolerance(n, 1)).estimate, n > 0 ? 1 : -1, `n = ${n}: the tolerance gives back the 1% (with the sign of n)`)
  close(M.tolerance(2, 1), 0.5, 'Exercise 58a: 1% in the volume allows 0.5% in the diameter')
  close(M.percentChange(4, 10).estimate, 40, 'Exercise 63: 10% in the radius, 40% in the flow by the estimate')
  close(M.percentChange(4, 10).exact, 46.41, 'Exercise 63: and 46.41% exactly', 1e-4)
  close(M.percentChange(-0.5, 1).estimate, -0.5, 'Exercise 64: 1% more g makes the period 0.5% shorter')
  ok(M.POWERS.every((q) => Number.isFinite(q.n) && q.n !== 0), 'every power has an exponent')
}

/* ----------------------------------- 6: sums, products and compositions of linearizations */
for (let i = 0; i < 200; i++) {
  const a = rnd(0.2, 3)
  const f = lin('sqrt(1+x)', a)
  const g = lin('sin(x)', a)
  const sum = lin('(sqrt(1+x))+(sin(x))', a)
  const prod = lin('(sqrt(1+x))*(sin(x))', a)
  const comp = lin('sin(sqrt(1+x))', a)
  close(sum.slope, f.slope + g.slope, 'the linearization of a sum adds the slopes', 1e-9)
  close(sum.intercept, f.intercept + g.intercept, 'the linearization of a sum adds the intercepts', 1e-9)
  close(prod.slope, f.slope * g.fa + f.fa * g.slope, 'the slope of a product is f′g + fg′', 1e-9)
  close(comp.slope, Math.cos(f.fa) * f.slope, 'the slope of a composition is the chain rule', 1e-9)
  // a linearization of a linearization is itself
  const again = (x) => f.fa + f.da * (x - a)
  close(again(a + 0.3), f.line(a + 0.3), 'the line is the line', 1e-12)
}

/* ------------------------------------------------------------ the gap over a window */
for (let i = 0; i < 100; i++) {
  const h = rnd(0.02, 0.8)
  const l = lin('sqrt(1+x)', 0)
  // √(1+x) is concave: the gap 1 + x/2 − √(1+x) is largest at the end of the window that is farther from 0, i.e. at −h
  const atEnds = Math.max(1 - h / 2 - Math.sqrt(1 - h), 1 + h / 2 - Math.sqrt(1 + h))
  close(M.maxGap(l, 0, h), atEnds, `the largest gap over [−${h.toFixed(2)}, ${h.toFixed(2)}]`, 1e-6)
  ok(M.maxGap(l, 0, h / 10) < M.maxGap(l, 0, h) / 50, 'zooming in 10× shrinks the gap by about 100×')
}

/* ------------------------------------------------------------------------ 7: the refusals */
const refuse = (src, a, code, what) => {
  const r = M.linearize(src, a)
  checks++
  if (r.ok || r.error !== code) fail(`${what}: wanted ${code}, got ${r.ok ? 'a linearization' : r.error}`)
}
refuse('sqrt(1+', 0, 'syntax', 'a broken function')
refuse('ln(x)', -1, 'undefined', 'a center outside the domain')
refuse('sqrt(x)', -4, 'undefined', 'the square root of a negative number')
refuse('x^(1/3)', 0, 'nodiff', 'the cube root at 0 has a vertical tangent line')
refuse('abs(x)', 0, 'nodiff', 'the absolute value has a corner at 0')
refuse('1/x', 0, 'undefined', 'the reciprocal at 0')
ok(M.linearize('x'.repeat(1) + '+x'.repeat(80), 0).ok === false, 'a very long function is refused')
ok(M.LIN_PRESETS.every((q) => M.linearize(q.src, q.a).ok), 'every preset has a linearization at its center')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`linearize check ok — ${checks} checks (the textbook's values, eleven functions written twice for the ½ f″ error, the best-linear-approximation property, differentials against real changes, percentage rules against exact powers, sums, products and compositions, the refusals)`)
