/** Checks src/lib/trig.ts, the numbers and drawings behind the "Derivatives of Trigonometric Functions" article.
 *
 *  Reference values never come from Math.sin or Math.cos where it matters: sine and cosine are summed from their Taylor
 *  series in exact fractions (sinRat, cosRat), and the difference quotients are built from those exact values.
 *   1. The angle sum formulas hold between the exact series values.
 *   2. (sin(x + h) − sin x) / h lies within h of cos x, and (cos(x + h) − cos x) / h within h of −sin x, for rational x and
 *      h = 10⁻ᵏ; the gap shrinks tenfold with each k, which is what a limit does.
 *   3. The two limits: cos h < sin h / h < 1 (the squeeze), |sin h / h − 1| ≤ h²/6 and (1 − cos h)/h ≤ h/2; in degrees the
 *      first limit is π/180.
 *   4. The six drawn derivative formulas against central differences, and the identities sec² = 1 + tan², csc² = 1 + cot².
 *   5. A weight on a spring: a = −s, v² + s² = A², jerk = −v.
 *
 *  Run: npm run check:trig   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'trig-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/trig.ts')}'\nexport { ratAdd, ratMul, ratSub, ratDiv } from '${p('src/lib/rationals.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const T = await import('file://' + out.replace(/\\/g, '/'))

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
const ok = (cond, what) => {
  checks++
  if (!cond) fail(what)
}
const B = BigInt
const R = (n, d = 1) => T.rat(B(n), B(d))
const num = (r) => {
  // a ratio of big integers as a double, without overflowing
  const sh = Math.max(0, r.n.toString().length - 300, r.d.toString().length - 300)
  const s = 10n ** B(sh)
  return Number(r.n / s) / Number(r.d / s)
}
const abs = (r) => (r.n < 0n ? R(-r.n, r.d) : r)
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const le = (a, b) => a.n * b.d <= b.n * a.d
const lt = (a, b) => a.n * b.d < b.n * a.d

/* --------------------------------- 1. angle sum formulas, in exact fractions */
const TINY = R(1, 10n ** 20n)
// the series are summed to 40 terms: for |x| up to 6 the error is below 6^81/81!, far under 10^-20
for (let i = 0; i < 25; i++) {
  const x = R(rnd(-30, 30), 10)
  const y = R(rnd(-30, 30), 10)
  const s = T.sinRat(T.ratAdd(x, y), 40)
  const sum = T.ratAdd(T.ratMul(T.sinRat(x, 40), T.cosRat(y, 40)), T.ratMul(T.cosRat(x, 40), T.sinRat(y, 40)))
  ok(le(abs(T.ratSub(s, sum)), TINY), `sin(x + y) = sin x cos y + cos x sin y for x = ${x.n}/${x.d}, y = ${y.n}/${y.d}`)
  const c = T.cosRat(T.ratAdd(x, y), 40)
  const dif = T.ratSub(T.ratMul(T.cosRat(x, 40), T.cosRat(y, 40)), T.ratMul(T.sinRat(x, 40), T.sinRat(y, 40)))
  ok(le(abs(T.ratSub(c, dif)), TINY), 'cos(x + y) = cos x cos y − sin x sin y')
  const one = T.ratAdd(T.ratMul(T.sinRat(x, 40), T.sinRat(x, 40)), T.ratMul(T.cosRat(x, 40), T.cosRat(x, 40)))
  ok(le(abs(T.ratSub(one, R(1))), TINY), 'sin² x + cos² x = 1')
}
// a few values known by heart
ok(le(abs(T.sinRat(R(0))), TINY) && le(abs(T.ratSub(T.cosRat(R(0)), R(1))), TINY), 'sin 0 = 0 and cos 0 = 1')
ok(Math.abs(num(T.sinRat(R(1))) - 0.8414709848078965) < 1e-15, 'sin 1')
ok(Math.abs(num(T.cosRat(R(1))) - 0.5403023058681398) < 1e-15, 'cos 1')

/* ------------------ 2. difference quotients land on cos and −sin, with order h */
for (let i = 0; i < 30; i++) {
  const x = R(rnd(-60, 60), 10)
  let lastS = null
  let lastC = null
  for (const k of [2, 3, 4, 5, 6]) {
    const h = R(1, 10 ** k)
    const xh = T.ratAdd(x, h)
    const dqS = T.ratDiv(T.ratSub(T.sinRat(xh, 40), T.sinRat(x, 40)), h)
    const dqC = T.ratDiv(T.ratSub(T.cosRat(xh, 40), T.cosRat(x, 40)), h)
    const eS = abs(T.ratSub(dqS, T.cosRat(x, 40)))
    const eC = abs(T.ratSub(dqC, T.ratSub(R(0), T.sinRat(x, 40))))
    ok(le(eS, h), `the quotient of sin is within h of cos at x = ${x.n}/${x.d}, h = 1e-${k}`)
    ok(le(eC, h), `the quotient of cos is within h of −sin at x = ${x.n}/${x.d}, h = 1e-${k}`)
    // the gap is about h/2 times the other function, so it shrinks tenfold per step
    if (lastS && num(lastS) > 1e-12 && num(eS) > 1e-12) ok(num(eS) < num(lastS) / 5, `the gap shrinks with h (sin, k = ${k})`)
    if (lastC && num(lastC) > 1e-12 && num(eC) > 1e-12) ok(num(eC) < num(lastC) / 5, `the gap shrinks with h (cos, k = ${k})`)
    lastS = eS
    lastC = eC
  }
}

/* ------------------------------------------------------------ 3. the limits */
for (let i = 0; i < 150; i++) {
  const h = R(rnd(1, 1500), 1000) // 0.001 .. 1.5
  const s = T.sinRat(h, 40)
  const c = T.cosRat(h, 40)
  const q = T.ratDiv(s, h)
  ok(lt(c, q) && lt(q, R(1)), `the squeeze cos h < sin h / h < 1 at h = ${h.n}/${h.d}`)
  ok(le(abs(T.ratSub(q, R(1))), T.ratDiv(T.ratMul(h, h), R(6))), 'sin h / h is within h²/6 of 1')
  const oc = T.ratDiv(T.ratSub(R(1), c), h)
  ok(le(oc, T.ratDiv(h, R(2))) && le(R(0), oc), '0 ≤ (1 − cos h) / h ≤ h/2')
}
for (const h of [1, 0.5, 0.1, 0.01, 0.001]) {
  for (const s of [1, -1]) {
    const v = s * h
    ok(Math.abs(T.sinOverH(v) - 1) <= (v * v) / 6 + 1e-12, `sinOverH(${v})`)
    ok(Math.abs(T.cosMinusOneOverH(v)) <= h / 2 + 1e-12, `cosMinusOneOverH(${v})`)
  }
}
ok(Math.abs(T.sinDegOverH(0.001) - Math.PI / 180) < 1e-9, 'in degrees sin(h°)/h tends to π/180')
ok(Math.abs(T.sinDegOverH(-0.001) - Math.PI / 180) < 1e-9, 'from the left too')
ok(Math.abs(T.cosDegMinusOneOverH(0.001)) < 1e-4, 'in degrees (cos(h°) − 1)/h still tends to 0')

/* ---------------------------------------------------- 4. the drawn formulas */
for (const g of T.TRIGS) {
  let tested = 0
  for (let i = 0; i < 400; i++) {
    const [a, b] = g.xr
    const x = a + Math.random() * (b - a)
    if (g.pole?.(x)) continue
    const f = g.f(x)
    if (!Number.isFinite(f) || Math.abs(f) > 30) continue
    const h = 1e-6
    const cd = (g.f(x + h) - g.f(x - h)) / (2 * h)
    ok(Math.abs(cd - g.d(x)) / Math.max(1, Math.abs(g.d(x))) < 1e-4, `${g.id}: derivative at ${x}: ${g.d(x)} vs ${cd}`)
    tested++
  }
  ok(tested > 100, `${g.id}: enough sample points`)
}
const by = (id) => T.TRIGS.find((g) => g.id === id)
for (let i = 0; i < 400; i++) {
  const x = 0.1 + Math.random() * 1.3
  ok(Math.abs(by('tan').d(x) - (1 + by('tan').f(x) ** 2)) < 1e-9, 'sec² = 1 + tan²')
  ok(Math.abs(by('cot').d(x) + (1 + by('cot').f(x) ** 2)) < 1e-9, 'csc² = 1 + cot²')
  ok(by('tan').d(x) >= 1 - 1e-12, 'the slope of tan is at least 1')
  ok(by('cot').d(x) <= -1 + 1e-12, 'the slope of cot is at most −1')
  ok(Math.abs(by('sec').d(x) - by('sec').f(x) * by('tan').f(x)) < 1e-9, 'sec′ = sec tan')
  ok(Math.abs(by('csc').d(x) + by('csc').f(x) * by('cot').f(x)) < 1e-9, 'csc′ = −csc cot')
}
// the chapter's two quotient examples
for (const x of [0.3, 0.9, 1.2]) {
  ok(Math.abs((Math.cos(x) * Math.cos(x) + Math.sin(x) * Math.sin(x)) / Math.cos(x) ** 2 - 1 / Math.cos(x) ** 2) < 1e-12, 'tan′ by the quotient rule is sec²')
}

/* ------------------------------------------------------------ 5. the spring */
for (let i = 0; i < 1000; i++) {
  const A = 0.5 + Math.random() * 9
  const t = Math.random() * 20
  const m = T.spring(A, t)
  ok(Math.abs(m.a + m.s) < 1e-9, 'a = −s (Hooke)')
  ok(Math.abs(m.v * m.v + m.s * m.s - A * A) < 1e-9, 'v² + s² = A²')
  ok(Math.abs(m.j + m.v) < 1e-9, 'jerk = −v')
  const h = 1e-6
  const sp = T.spring(A, t + h)
  const sm = T.spring(A, t - h)
  ok(Math.abs((sp.s - sm.s) / (2 * h) - m.v) < 1e-5, 'v is the derivative of s')
  ok(Math.abs((sp.v - sm.v) / (2 * h) - m.a) < 1e-5, 'a is the derivative of v')
  ok(Math.abs((sp.a - sm.a) / (2 * h) - m.j) < 1e-5, 'j is the derivative of a')
}
eq(T.spring(5, 0).s, 5, 'released from rest at s = 5')
eq(T.spring(5, 0).v, -0, 'with no velocity')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`trig check ok — ${checks} checks (angle sums and the quotient of sine and cosine from exact Taylor series, the squeeze and the two limits, degrees giving π/180, the six derivative formulas against central differences, the spring)`)
