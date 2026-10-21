/** Checks src/lib/extrema.ts, the numbers behind the "Extreme Values of Functions on Closed Intervals" article.
 *
 *  References that do not use the code under test:
 *   1. The textbook's examples (Examples 1 to 4) and exercises (the box, the peak current, the height of a body).
 *   2. Functions written twice, as text and as JavaScript: the absolute extremes found by comparing critical points and
 *      endpoints against a brute-force scan of a million points on the same interval, on random intervals.
 *   3. The First Derivative Theorem: every interior local extremum the scan finds sits at a critical point, and every
 *      critical point reported as a zero really has a derivative of zero (a central difference on the JavaScript).
 *   4. The warnings: x³ and ∛x have critical points at 0 without an extreme value there.
 *   5. The cases of the Extreme Value Theorem, by sampling, with a point or a band just inside every open end.
 *   6. The box cut from a sheet: the formula for its critical point against a difference quotient, and against a scan.
 *   7. The refusals: a bad function, a bad interval, a function not defined or not continuous on the interval.
 *
 *  Run: npm run check:extrema   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ext-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/extrema.ts')}'`)
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
const ext = (src, a, b) => {
  const r = M.extrema(src, a, b)
  if (!r.ok) throw new Error(`${src} on [${a}, ${b}]: ${r.error}`)
  return r
}
const has = (list, x, tol = 1e-6) => list.some((v) => Math.abs(v - x) < tol)

/* ------------------------------------------------------- 1: the textbook's examples */
{
  // Example 1: y = x² on four domains
  const byId = (id) => M.EVT_CASES.find((c) => c.id === id)
  const o = (id) => M.evtOutcome(byId(id))
  ok(o('closed').max.exists && has(o('closed').max.at, 2, 1e-3) && Math.abs(o('closed').max.value - 4) < 1e-9, 'Example 1b: the maximum 4 at x = 2')
  ok(o('closed').min.exists && has(o('closed').min.at, 0, 1e-9), 'Example 1b: the minimum 0 at x = 0')
  ok(o('half-open').max.exists && Math.abs(o('half-open').max.value - 4) < 1e-9, 'Example 1c: the maximum 4 at x = 2')
  ok(!o('half-open').min.exists, 'Example 1c: no minimum on (0, 2]')
  ok(!o('open').max.exists && !o('open').min.exists, 'Example 1d: no extremes on (0, 2)')
  ok(!o('whole-line').max.exists && o('whole-line').min.exists && has(o('whole-line').min.at, 0, 1e-9), 'Example 1a: only the minimum 0 at x = 0')
  ok(!o('exponential').max.exists && !o('exponential').min.exists, 'the exponential function has no extremes on the whole line')
  ok(!o('jump').max.exists, 'the function with a jump has no maximum on [0, 1]')
  ok(o('jump').min.exists && Math.abs(o('jump').min.value) < 1e-12 && has(o('jump').min.at, 0, 1e-9) && has(o('jump').min.at, 1, 1e-9), 'the jump function takes its minimum 0 at x = 0 and at x = 1')

  // Example 2: x² on [−2, 1]
  const e2 = ext('x^2', -2, 1)
  close(e2.max.value, 4, 'Example 2: maximum')
  ok(e2.max.at.length === 1 && has(e2.max.at, -2), 'Example 2: at x = −2')
  close(e2.min.value, 0, 'Example 2: minimum')
  ok(has(e2.min.at, 0), 'Example 2: at x = 0')
  ok(e2.candidates.length === 3 && e2.candidates[1].kind === 'zero', 'Example 2: the only critical point is 0')

  // Example 3: 10x(2 − ln x) on [1, e²]
  const e3 = ext('10*x*(2-ln(x))', 1, Math.E ** 2)
  close(e3.max.value, 10 * Math.E, 'Example 3: maximum 10e')
  ok(has(e3.max.at, Math.E, 1e-6), 'Example 3: at x = e')
  close(e3.min.value, 0, 'Example 3: minimum 0', 1e-9)
  ok(has(e3.min.at, Math.E ** 2, 1e-9), 'Example 3: at x = e²')
  close(e3.candidates[0].fx, 20, 'Example 3: f(1) = 20')
  close(e3.max.value, 27.18281828, 'Example 3: 10e ≈ 27.2', 1e-8)

  // Example 4: x^(2/3) on [−2, 3]
  const e4 = ext('x^(2/3)', -2, 3)
  close(e4.max.value, Math.cbrt(9), 'Example 4: maximum ∛9')
  ok(has(e4.max.at, 3), 'Example 4: at x = 3')
  close(e4.min.value, 0, 'Example 4: minimum 0')
  ok(has(e4.min.at, 0, 1e-6), 'Example 4: at x = 0, a cusp')
  ok(e4.candidates.some((c) => c.kind === 'undefined' && Math.abs(c.x) < 1e-6), 'Example 4: the critical point 0 is one where f′ does not exist')
  close(e4.candidates[0].fx, Math.cbrt(4), 'Example 4: f(−2) = ∛4')

  // Exercise 70: the peak current i = 2 cos t + 2 sin t
  const e70 = ext('2*cos(x)+2*sin(x)', 0, 2 * PI)
  close(e70.max.value, 2 * Math.SQRT2, 'Exercise 70: the peak current 2√2')
  ok(has(e70.max.at, PI / 4, 1e-6) && has(e70.min.at, (5 * PI) / 4, 1e-6), 'Exercise 70: at t = π/4 and 5π/4')
  close(e70.min.value, -2 * Math.SQRT2, 'Exercise 70: the smallest value')
  // Exercise 69: the height of a body, s = −4.9 t² + v0 t + s0, largest at t = v0 / g
  const v0 = 20
  const s0 = 5
  const e69 = ext(`-4.9*x^2+${v0}*x+${s0}`, 0, 5)
  close(e69.max.value, s0 + v0 ** 2 / (2 * 9.8), 'Exercise 69: the maximum height s0 + v0²/(2g)')
  ok(has(e69.max.at, v0 / 9.8, 1e-6), 'Exercise 69: at t = v0 / g')
  // Exercise 57: f(x) = (x − 2)^(2/3) has its only local extreme at 2, where f′ does not exist
  const e57 = ext('(x-2)^(2/3)', 0, 5)
  ok(e57.candidates.some((c) => c.kind === 'undefined' && Math.abs(c.x - 2) < 1e-6) && has(e57.min.at, 2, 1e-6), 'Exercise 57: the minimum at 2, a critical point where f′ does not exist')
  // Exercise 63: |x| has an absolute minimum at 0 although it is not differentiable there
  const e63 = ext('abs(x)', -1, 2)
  close(e63.min.value, 0, 'Exercise 63: the minimum 0')
  ok(has(e63.min.at, 0, 1e-6) && e63.candidates.some((c) => c.kind === 'undefined'), 'Exercise 63: at 0, where there is no derivative')
  close(e63.max.value, 2, 'Exercise 63: the maximum 2 at an endpoint')
}

/* ------------------------------------------------------------------------ the box */
{
  close(M.boxVolume(10, 16, 2), 144, 'Exercise 67: V(2) = 144')
  close(M.boxBest(10, 16), 2, 'Exercise 67: the critical point is 2')
  const e = ext('x*(10-2*x)*(16-2*x)', 0, 5)
  close(e.max.value, 144, 'Exercise 67: the maximum volume 144 by the closed interval method')
  ok(has(e.max.at, 2, 1e-6), 'Exercise 67: at x = 2')
  close(e.min.value, 0, 'Exercise 67: the minimum 0 at both ends')
  ok(has(e.min.at, 0) && has(e.min.at, 5), 'Exercise 67: at x = 0 and x = 5')
  for (let i = 0; i < 400; i++) {
    const w = rnd(4, 40)
    const l = rnd(4, 40)
    const xb = M.boxBest(w, l)
    ok(xb > 0 && xb < Math.min(w, l) / 2, 'the critical point lies between 0 and half the short side')
    const h = 1e-6
    const slope = (M.boxVolume(w, l, xb + h) - M.boxVolume(w, l, xb - h)) / (2 * h)
    ok(Math.abs(slope) < 1e-4 * (1 + w * l), `V′ = 0 at the critical point (${w.toFixed(1)} by ${l.toFixed(1)})`)
    let best = -1
    for (let k = 1; k < 2000; k++) best = Math.max(best, M.boxVolume(w, l, (k / 2000) * (Math.min(w, l) / 2)))
    ok(M.boxVolume(w, l, xb) >= best - 1e-9, 'no sampled cut gives a bigger box')
    close(M.boxVolume(w, l, xb), best, 'the best sample is close to the maximum', 1e-4)
  }
}

/* ----------------------------------- 2 and 3: functions written twice and a brute-force scan */
const FUNCS = [
  { s: 'x^2', f: (x) => x * x, d: (x) => 2 * x, lo: -5, hi: 5 },
  { s: 'x^3-3*x', f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, lo: -3, hi: 3 },
  { s: 'x^4-4*x^3+10', f: (x) => x ** 4 - 4 * x ** 3 + 10, d: (x) => 4 * x ** 3 - 12 * x * x, lo: -2, hi: 5 },
  { s: 'sin(x)+cos(x)', f: (x) => Math.sin(x) + Math.cos(x), d: (x) => Math.cos(x) - Math.sin(x), lo: -4, hi: 6 },
  { s: 'x*e^x', f: (x) => x * Math.exp(x), d: (x) => (1 + x) * Math.exp(x), lo: -4, hi: 2 },
  { s: 'x^(2/3)', f: (x) => Math.cbrt(x) ** 2, d: null, lo: -4, hi: 5 },
  { s: 'abs(x-1)', f: (x) => Math.abs(x - 1), d: null, lo: -3, hi: 4 },
  { s: '10*x*(2-ln(x))', f: (x) => 10 * x * (2 - Math.log(x)), d: (x) => 10 * (1 - Math.log(x)), lo: 0.3, hi: 15 },
  { s: 'x/(1+x^2)', f: (x) => x / (1 + x * x), d: (x) => (1 - x * x) / (1 + x * x) ** 2, lo: -6, hi: 6 },
  { s: 'x^2*(x-2)^2', f: (x) => x * x * (x - 2) ** 2, d: (x) => 4 * x ** 3 - 12 * x * x + 8 * x, lo: -2, hi: 4 },
  { s: 'cos(2*x)+2*cos(x)', f: (x) => Math.cos(2 * x) + 2 * Math.cos(x), d: (x) => -2 * Math.sin(2 * x) - 2 * Math.sin(x), lo: -4, hi: 4 },
]
const SCAN = 1000000
for (const F of FUNCS) {
  for (let t = 0; t < 12; t++) {
    const a = rnd(F.lo, F.hi - 1)
    const b = rnd(a + 0.5, F.hi)
    const r = M.extrema(F.s, a, b)
    ok(r.ok, `${F.s} on [${a.toFixed(2)}, ${b.toFixed(2)}] has extremes (${r.ok ? '' : r.error})`)
    if (!r.ok) continue
    // a brute-force scan
    const len = b - a
    let hi = -Infinity
    let lo = Infinity
    const prev = [F.f(a), F.f(a + len / SCAN)]
    const locals = []
    for (let i = 0; i <= SCAN; i++) {
      const x = a + (len * i) / SCAN
      const v = F.f(x)
      if (v > hi) hi = v
      if (v < lo) lo = v
      if (i >= 1 && i < SCAN) {
        const before = F.f(a + (len * (i - 1)) / SCAN)
        const after = F.f(a + (len * (i + 1)) / SCAN)
        if ((v > before && v >= after) || (v < before && v <= after)) locals.push(x)
      }
    }
    void prev
    const tol = 2e-3 * (1 + Math.abs(hi) + Math.abs(lo))
    ok(r.max.value >= hi - 1e-9, `${F.s}: the maximum found is not below any scanned value`)
    ok(r.max.value <= hi + tol, `${F.s}: the maximum found (${r.max.value}) is close to the scan (${hi})`)
    ok(r.min.value <= lo + 1e-9, `${F.s}: the minimum found is not above any scanned value`)
    ok(r.min.value >= lo - tol, `${F.s}: the minimum found (${r.min.value}) is close to the scan (${lo})`)
    // the values at the places reported are the values of the function
    for (const c of r.candidates) close(c.fx, F.f(c.x), `${F.s}: the value at a candidate`, 1e-9)
    ok(r.candidates[0].x === a && r.candidates[r.candidates.length - 1].x === b, `${F.s}: the endpoints are candidates`)
    // First Derivative Theorem: every interior local extreme of the scan is at a critical point
    const critical = r.candidates.filter((c) => c.kind !== 'endpoint').map((c) => c.x)
    for (const x of locals) {
      if (x < a + 2e-5 * len || x > b - 2e-5 * len) continue
      ok(critical.some((c) => Math.abs(c - x) < 1e-4 * len + 1e-6), `${F.s}: the local extreme near ${x.toFixed(4)} is a critical point`)
    }
    // ...and a critical point reported as a zero has a zero derivative
    if (F.d)
      for (const c of r.candidates.filter((q) => q.kind === 'zero')) {
        const h = 1e-6
        const slope = (F.f(c.x + h) - F.f(c.x - h)) / (2 * h)
        ok(Math.abs(slope) < 1e-5 * (1 + Math.abs(F.d(c.x + 1)) + Math.abs(F.d(c.x - 1))), `${F.s}: f′ is 0 at a zero (${c.x})`)
        close(F.d(c.x), 0, `${F.s}: the hand-written derivative is 0 there`, 1e-6)
      }
  }
}

/* --------------------------------------------- 4: critical points without an extreme value */
{
  const c1 = ext('x^3', -1, 1)
  ok(c1.candidates.some((c) => c.kind === 'zero' && Math.abs(c.x) < 1e-6), 'x³: 0 is a critical point')
  ok(!has(c1.max.at, 0, 1e-3) && !has(c1.min.at, 0, 1e-3), 'x³: but not an extreme value')
  close(c1.max.value, 1, 'x³ on [−1, 1]: the maximum is at the endpoint')
  const c2 = ext('x^(1/3)', -1, 1)
  ok(c2.candidates.some((c) => c.kind === 'undefined' && Math.abs(c.x) < 1e-6), '∛x: 0 is a critical point where f′ does not exist')
  ok(!has(c2.max.at, 0, 1e-3) && !has(c2.min.at, 0, 1e-3), '∛x: but not an extreme value')
}

{
  // a steep but smooth function is not a cusp: atan(1000 x) has no critical point at all
  const steep = ext('arctan(1000*x)', -1, 1)
  ok(steep.candidates.length === 2, 'arctan(1000 x): no critical point, only the two endpoints')
  // a jump in f' is a corner: |x² − 1| has two, at ±1, and a local maximum at 0
  const corner = ext('abs(x^2-1)', -2, 2)
  ok(corner.candidates.filter((c) => c.kind === 'undefined').length === 2, 'two corners, two critical points where f′ does not exist')
  ok(corner.candidates.filter((c) => c.kind === 'zero').length === 1, 'and one where f′ is 0')
  close(corner.min.value, 0, 'the minimum 0')
  ok(has(corner.min.at, 1) && has(corner.min.at, -1), 'taken at both corners')
  close(corner.max.value, 3, 'the maximum 3')
  ok(has(corner.max.at, 2) && has(corner.max.at, -2), 'taken at both ends')
}

/* ---------------------------------------------------- 5: random polynomials, exact roots */
for (let t = 0; t < 300; t++) {
  // f = (x − r1)(x − r2)(x − r3) on an interval: the critical points are roots of a quadratic
  const r1 = rnd(-3, 0)
  const r2 = rnd(0, 3)
  const r3 = rnd(-3, 3)
  const src = `(x-(${r1}))*(x-(${r2}))*(x-(${r3}))`
  const f = (x) => (x - r1) * (x - r2) * (x - r3)
  const a = -4
  const b = 4
  const r = ext(src, a, b)
  const s = r1 + r2 + r3
  const q = r1 * r2 + r1 * r3 + r2 * r3
  const disc = s * s - 3 * q                          // f′(x) = 3x² − 2 s x + q
  const roots = [(s - Math.sqrt(disc)) / 3, (s + Math.sqrt(disc)) / 3].filter((x) => x > a && x < b)
  const zeros = r.candidates.filter((c) => c.kind === 'zero').map((c) => c.x)
  ok(zeros.length === roots.length && roots.every((x) => has(zeros, x, 1e-6)), 'a cubic: the critical points are the roots of the quadratic f′')
  const values = [f(a), f(b), ...roots.map(f)]
  close(r.max.value, Math.max(...values), 'a cubic: the maximum is the largest of the candidates', 1e-9)
  close(r.min.value, Math.min(...values), 'a cubic: the minimum is the smallest of the candidates', 1e-9)
}

/* ------------------------------------------------------------------- the refusals */
const refuse = (src, a, b, code, what) => {
  const r = M.extrema(src, a, b)
  checks++
  if (r.ok || r.error !== code) fail(`${what}: wanted ${code}, got ${r.ok ? 'a result' : r.error}`)
}
refuse('x^2+', 0, 1, 'syntax', 'a broken function')
refuse('x^2', 2, 1, 'interval', 'a reversed interval')
refuse('x^2', 1, 1, 'interval', 'an empty interval')
refuse('ln(x)', -1, 1, 'undefined', 'a function not defined on the interval')
refuse('1/x', -1, 2, 'discontinuous', 'a pole inside the interval')
refuse('tan(x)', 0, 2, 'discontinuous', 'tan has a pole at π/2')
refuse('1/x^2', -1, 2, 'discontinuous', 'a pole with no sign change')
refuse('5', 0, 1, 'constant', 'a constant function')
ok(M.extrema('1/x', 1, 3).ok, '1/x is fine where it is continuous')
ok(M.EVT_CASES.length === 6, 'the six cases of the Extreme Value Theorem')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`extrema check ok — ${checks} checks (the textbook's examples and exercises, eleven functions against a scan of a million points, the First Derivative Theorem, critical points without an extreme, random cubics against the roots of the quadratic, the box, the six cases of the Extreme Value Theorem, the refusals)`)
