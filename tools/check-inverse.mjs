/** Checks src/lib/inverse.ts, the numbers behind the "Derivatives of Inverse Functions and Logarithms" article's widgets.
 *
 *  References that never use the formula under test:
 *   1. For every function of the list the numerical inverse really undoes f, and the slope of the inverse found by a
 *      central difference of that numerical inverse equals 1/f′(a) at the corresponding point (a, b = f(a)). f′ itself is
 *      checked against a central difference of f, so no derivative formula is trusted.
 *   2. The chapter's examples: f(x) = x², (f⁻¹)′(4) = 1/4; f(x) = x³ − 2, (f⁻¹)′(6) = 1/12; the line ½x + 1 and its
 *      inverse 2x − 2 have reciprocal slopes; the graphs are mirror images in y = x.
 *   3. The derivative of ln by its definition: (ln(x + h) − ln x)/h tends to 1/x, both sides, with error of order h;
 *      ln is the inverse of exp; d/dx a^x = a^x ln a from the limit (a^h − 1)/h.
 *   4. The number e as a limit, (1 + h)^(1/h) → e with an error under h, and ln(1 + h)/h → 1.
 *   5. The tangent line of ln x through the origin touches at x = e and has slope 1/e (Example 4 of the chapter).
 *
 *  Run: npm run check:inverse   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/inverse.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const I = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const close = (got, want, what, tol = 1e-6) => {
  checks++
  const scale = Math.max(1, Math.abs(want))
  if (!(Math.abs(got - want) / scale < tol)) fail(`${what}: got ${got}, want ${want}`)
}
const ok = (cond, what) => {
  checks++
  if (!cond) fail(what)
}
const central = (f, x, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h)

/* ------------------------------------------------ 1. every function of the list */
for (const g of I.INVERSES) {
  const [lo, hi] = g.xr
  const inv = (b) => I.inverse(g.f, b, lo, hi)
  let tested = 0
  for (let i = 0; i < 300; i++) {
    const a = lo + (0.03 + Math.random() * 0.94) * (hi - lo)
    const b = g.f(a)
    // f is increasing with a derivative that never vanishes
    close(g.d(a), central(g.f, a), `${g.id}: f′ at ${a} against a central difference`, 1e-5)
    ok(g.d(a) > 0, `${g.id}: f′ is positive at ${a}`)
    // the inverse undoes f both ways
    close(inv(b), a, `${g.id}: f⁻¹(f(a)) = a at ${a}`, 1e-9)
    close(g.f(inv(b)), b, `${g.id}: f(f⁻¹(b)) = b at ${b}`, 1e-9)
    // the slope of the inverse, by a difference quotient of the numerical inverse, is 1/f′(a)
    const h = 1e-5 * Math.max(1, Math.abs(b))
    {
      const cd = (inv(b + h) - inv(b - h)) / (2 * h)
      if (Number.isFinite(cd)) {
        tested++
        close(cd, 1 / g.d(a), `${g.id}: (f⁻¹)′(${b}) = 1/f′(${a})`, 1e-5)
        close(I.inverseSlope(g, b), 1 / g.d(a), `${g.id}: inverseSlope at ${b}`, 1e-8)
      }
    }
  }
  ok(tested > 200, `${g.id}: enough points`)
  // outside the range there is no inverse
  ok(Number.isNaN(inv(g.f(hi) + 1)), `${g.id}: no inverse above the range`)
  ok(Number.isNaN(inv(g.f(lo) - 1)), `${g.id}: no inverse below the range`)
}

/* -------------------------------------------------------- 2. the chapter's examples */
const by = (id) => I.INVERSES.find((g) => g.id === id)
close(I.inverseSlope(by('square'), 4), 0.25, 'Example 1: f(x) = x², (f⁻¹)′(4) = 1/4')
close(I.inverseSlope(by('cube'), 6), 1 / 12, 'Example 2: f(x) = x³ − 2, (f⁻¹)′(6) = 1/12')
close(I.inverse(by('cube').f, 6, 0.2, 2.2), 2, 'and f⁻¹(6) = 2')
close(by('half').d(0), 0.5, 'the line ½x + 1 has slope 1/2')
close(I.inverseSlope(by('half'), 3), 2, 'and its inverse 2x − 2 has slope 2, the reciprocal')
// the graphs are mirror images in y = x: if (a, b) is on f then (b, a) is on f⁻¹
for (const g of I.INVERSES) {
  const a = (g.xr[0] + g.xr[1]) / 2
  const b = g.f(a)
  close(I.inverse(g.f, b, g.xr[0], g.xr[1]), a, `${g.id}: (b, a) is on the graph of the inverse`, 1e-9)
}
// where f′ is 0 the inverse has a vertical tangent: f(x) = x³ near 0
{
  const f = (x) => x ** 3
  const slopes = [1e-1, 1e-2, 1e-3].map((b) => (I.inverse(f, b + 1e-9, -1, 1) - I.inverse(f, b - 1e-9, -1, 1)) / 2e-9)
  ok(slopes[0] < slopes[1] && slopes[1] < slopes[2], 'the slope of the cube root grows without bound towards 0')
}

/* ---------------------------------------------------- 3. ln and exp from their definitions */
for (let i = 0; i < 400; i++) {
  const x = 0.2 + Math.random() * 6
  for (const h of [1e-3, 1e-4, 1e-5]) {
    const q = (Math.log(x + h) - Math.log(x)) / h
    ok(Math.abs(q - 1 / x) <= h / (x * x) + 1e-9, `the quotient of ln at ${x} is within h/x² of 1/x (h = ${h})`)
    const qm = (Math.log(x) - Math.log(x - h)) / h
    ok(Math.abs(qm - 1 / x) <= h / (x * x) * 1.01 + 1e-9, `and from the left`)
  }
  close(Math.exp(Math.log(x)), x, 'exp(ln x) = x', 1e-12)
  close(Math.log(Math.exp(x)), x, 'ln(exp x) = x', 1e-12)
  // the derivative of ln by the rule for inverses applied to exp: 1/exp(ln x) = 1/x
  close(1 / Math.exp(Math.log(x)), 1 / x, 'Theorem 3 applied to exp gives 1/x', 1e-12)
}
for (let i = 0; i < 300; i++) {
  const a = 0.3 + Math.random() * 7
  close(I.expSlopeAtZero(a, 1e-7), Math.log(a), `(a^h − 1)/h tends to ln a for a = ${a}`, 1e-6)
  const x = (Math.random() - 0.5) * 4
  close(central((t) => a ** t, x), a ** x * Math.log(a), `d/dx ${a}^x = ${a}^x ln ${a} at ${x}`, 1e-6)
  const t = 0.4 + Math.random() * 5
  close(central((u) => Math.log(u) / Math.log(a), t), 1 / (t * Math.log(a)), `d/dx log_${a} x = 1/(x ln ${a}) at ${t}`, 1e-5)
}

/* --------------------------------------------------------- 4. the number e as a limit */
for (const h of [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6]) {
  ok(Math.abs(I.eLimit(h) - Math.E) < 1.5 * h * Math.E / 2 + 1e-9 && Math.abs(I.eLimit(h) - Math.E) > 0, `(1 + ${h})^(1/${h}) is within h of e`)
  ok(Math.abs(I.eLimit(-h) - Math.E) < 1.5 * h * Math.E / 2 + 1e-9, `and from the left`)
  ok(Math.abs(I.lnLimit(h) - 1) < h, `ln(1 + h)/h is within h of 1 (h = ${h})`)
}
// the error shrinks tenfold with each step
{
  const errs = [1e-2, 1e-3, 1e-4, 1e-5].map((h) => Math.abs(I.eLimit(h) - Math.E))
  ok(errs[0] > 5 * errs[1] && errs[1] > 5 * errs[2] && errs[2] > 5 * errs[3], 'the error of the limit shrinks about tenfold per step')
}
// the number e is the base with ln e = 1: the slope of e^x at the y-axis is 1
close(I.expSlopeAtZero(Math.E, 1e-7), 1, 'the slope of e^x at the y-axis is 1', 1e-6)

/* ---------------------------------------------------------- 5. the tangent through the origin */
{
  // the tangent to y = ln x at x = a passes through the origin when ln a = a · (1/a) = 1, so a = e
  const f = (a) => Math.log(a) - 1
  let lo = 1
  let hi = 5
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2
    if (f(m) < 0) lo = m
    else hi = m
  }
  close(lo, Math.E, 'Example 4: the point of tangency is x = e')
  close(1 / lo, 1 / Math.E, 'and the slope is 1/e')
}

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`inverse check ok — ${checks} checks (the derivative rule for inverses against differences of numerical inverses, the chapter's examples, ln and a^x from their definitions, the limits for e and ln a)`)
