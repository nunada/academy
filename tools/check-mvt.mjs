/** Checks src/lib/mvt.ts, the numbers behind the "The Mean Value Theorem" article.
 *
 *  References that do not use the code under test:
 *   1. The textbook's exercises 1 to 8 and 57, 58 with the value of c worked out by hand (closed forms), Example 2
 *      (x² on [0, 2], c = 1), Example 3 (176 m in 8 s, 22 m/s = 79.2 km/h) and the exercises that are arithmetic on rates
 *      (51 to 54).
 *   2. Functions written twice, as text and as JavaScript with a hand-written derivative: the points c found by the
 *      engine against a scan of a million-point grid for the sign changes of f′ − slope, and the proof's auxiliary function
 *      h(x) = f(x) − f(a) − slope·(x − a), which is 0 at a and at b and has h′(c) = 0 exactly at those points.
 *   3. The hypotheses: functions that satisfy them (the theorem then always gives a point), the textbook's functions that do
 *      not (a corner, a cusp, a pole), and the refusals.
 *   4. Rolle's Theorem, case by case, against a scan of the derivative of the JavaScript function; f(a) = f(b) makes the
 *      slope 0.
 *   5. Between two zeros of a polynomial there is a zero of its derivative (Exercise 17), against exact roots, and
 *      Example 1: x³ + 3x + 1 has exactly one real root.
 *   6. Corollaries 1 and 2: the families y = g(x) + C against the chain-rule differentiator, Example 4, free fall, and
 *      Exercise 31.
 *   7. The inequalities of the exercises (63, 65, 66, 70): |cos x − 1| ≤ |x|, |sin b − sin a| ≤ |b − a|, and the slope of any
 *      secant lies between the smallest and the largest value of f′.
 *
 *  Run: npm run check:mvt   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mvt-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(
  entry,
  `export * from '${p('src/lib/mvt.ts')}'
export { derive, evalFloat } from '${p('src/lib/chain.ts')}'
export { parseFunction } from '${p('src/lib/linearize.ts')}'
export { evalPoly, degree } from '${p('src/lib/tangent.ts')}'
export { rat } from '${p('src/lib/realnum.ts')}'
export { realRoots, rootPoint, toNumber } from '${p('src/lib/rates.ts')}'`,
)
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
const run = (src, a, b) => {
  const r = M.mvt(src, a, b)
  if (!r.ok) throw new Error(`${src} on [${a}, ${b}]: ${r.error}`)
  return r
}
const has = (list, x, tol = 1e-6) => list.some((v) => Math.abs(v - x) < tol)
const same = (list, want, what, tol = 1e-6) => {
  ok(list.length === want.length && want.every((w) => has(list, w, tol)), `${what}: got [${list.map((v) => v.toFixed(6))}], want [${want.map((v) => v.toFixed(6))}]`)
}

/* ------------------------------------------------- 1: the textbook, with c worked out by hand */
{
  // Example 2: x² on [0, 2]
  const e2 = run('x^2', 0, 2)
  close(e2.slope, 2, 'Example 2: the slope of the secant')
  same(e2.points, [1], 'Example 2: c = 1')
  ok(e2.hypotheses, 'Example 2: both hypotheses hold')
  // Exercise 1: x² + 2x − 1 on [0, 1]: slope 3, 2c + 2 = 3, c = 1/2
  const x1 = run('x^2+2*x-1', 0, 1)
  close(x1.slope, 3, 'Exercise 1: slope')
  same(x1.points, [0.5], 'Exercise 1: c = 1/2')
  // Exercise 2: x^(2/3) on [0, 1]: slope 1, (2/3) c^(−1/3) = 1, c = 8/27
  const x2 = run('x^(2/3)', 0, 1)
  close(x2.slope, 1, 'Exercise 2: slope')
  same(x2.points, [8 / 27], 'Exercise 2: c = 8/27')
  ok(x2.hypotheses, 'Exercise 2: the cusp is at 0, an endpoint, so f is differentiable inside')
  // Exercise 3: x + 1/x on [1/2, 2]: slope 0, 1 − 1/c² = 0, c = 1
  const x3 = run('x+1/x', 0.5, 2)
  close(x3.slope, 0, 'Exercise 3: slope')
  same(x3.points, [1], 'Exercise 3: c = 1')
  ok(x3.rolle, 'Exercise 3: f(1/2) = f(2), so this is Rolle’s case')
  // Exercise 4: √(x − 1) on [1, 3]: slope √2/2, 1/(2√(c−1)) = √2/2, c = 3/2
  const x4 = run('sqrt(x-1)', 1, 3)
  close(x4.slope, Math.SQRT1_2, 'Exercise 4: slope')
  same(x4.points, [1.5], 'Exercise 4: c = 3/2')
  // Exercise 5: arcsin on [−1, 1]: slope π/2, 1/√(1−c²) = π/2, c = ±√(1 − 4/π²)
  const x5 = run('arcsin(x)', -1, 1)
  close(x5.slope, PI / 2, 'Exercise 5: slope π/2')
  same(x5.points, [-Math.sqrt(1 - 4 / (PI * PI)), Math.sqrt(1 - 4 / (PI * PI))], 'Exercise 5: c = ±√(1 − 4/π²)', 1e-5)
  // Exercise 6: ln(x − 1) on [2, 4]: slope ln 3 / 2, 1/(c − 1) = ln 3 / 2, c = 1 + 2/ln 3
  const x6 = run('ln(x-1)', 2, 4)
  close(x6.slope, Math.log(3) / 2, 'Exercise 6: slope')
  same(x6.points, [1 + 2 / Math.log(3)], 'Exercise 6: c = 1 + 2/ln 3')
  // Exercise 7: x³ − x² on [−1, 2]: slope 2, 3c² − 2c = 2, c = (1 ± √7)/3, both inside
  const x7 = run('x^3-x^2', -1, 2)
  close(x7.slope, 2, 'Exercise 7: slope')
  same(x7.points, [(1 - Math.sqrt(7)) / 3, (1 + Math.sqrt(7)) / 3], 'Exercise 7: two values of c')
  // Figure 4.16: √(1 − x²) on [−1, 1]: not differentiable at ±1, yet the theorem applies; c = 0
  const f16 = run('sqrt(1-x^2)', -1, 1)
  ok(f16.hypotheses, 'Figure 4.16: the hypotheses hold')
  same(f16.points, [0], 'Figure 4.16: c = 0')
  ok(f16.rolle, 'Figure 4.16: f(−1) = f(1) = 0')
  // Example 3: a car that goes 176 m in 8 s from rest: s = 2.75 t², v = 5.5 t, average 22 m/s, at t = 4
  const car = run('2.75*x^2', 0, 8)
  close(car.slope, 22, 'Example 3: the average velocity 22 m/s')
  same(car.points, [4], 'Example 3: at t = 4 s the velocity is 22 m/s')
  close(22 * 3.6, 79.2, 'Example 3: 22 m/s = 79.2 km/h')
  close(176 / 8, 22, 'Example 3: 176 m in 8 s')
  // Exercises 51 to 54: rates from averages
  close(119 / 14, 8.5, 'Exercise 51: from −19 °C to 100 °C in 14 s is 8.5 °C/s')
  ok(230 / 2 > 100, 'Exercise 52: 230 km in 2 hours averages 115 km/h, above 100')
  ok(184 / 24 > 7.5, 'Exercise 53: 184 sea miles in 24 hours is 7.67 knots, above 7.5')
  ok(42 / 2.2 > 18, 'Exercise 54: 42 km in 2.2 hours is 19.09 km/h, above 18')
  // Exercises 57 and 58: the geometric mean for 1/x, the arithmetic mean for x²
  for (let i = 0; i < 200; i++) {
    const a = rnd(0.2, 5)
    const b = a + rnd(0.3, 6)
    same(run('1/x', a, b).points, [Math.sqrt(a * b)], `Exercise 57 on [${a.toFixed(3)}, ${b.toFixed(3)}]: c = √(ab)`)
    same(run('x^2', a, b).points, [(a + b) / 2], `Exercise 58 on [${a.toFixed(3)}, ${b.toFixed(3)}]: c = (a+b)/2`)
  }
  // Exercise 74: a quadratic has exactly one such point, the midpoint, on every interval
  for (let i = 0; i < 100; i++) {
    const pp = rnd(-5, 5) || 1
    const q = rnd(-5, 5)
    const r = rnd(-5, 5)
    const a = rnd(-4, 3)
    const b = a + rnd(0.2, 5)
    const e = run(`(${pp})*x^2+(${q})*x+(${r})`, a, b)
    ok(e.points.length === 1 && Math.abs(e.points[0] - (a + b) / 2) < 1e-6, 'Exercise 74: exactly one c, the midpoint')
  }
}

/* ------------------------------------- 2: random functions, against a scan and the proof's function h */
{
  const FAMILY = [
    { src: (u, v) => `(${u})*x^2+(${v})*x`, f: (x, u, v) => u * x * x + v * x, d: (x, u, v) => 2 * u * x + v, pos: false },
    { src: (u, v) => `(${u})*x^3-(${v})*x`, f: (x, u, v) => u * x ** 3 - v * x, d: (x, u, v) => 3 * u * x * x - v, pos: false },
    { src: (u) => `sin((${u})*x)`, f: (x, u) => Math.sin(u * x), d: (x, u) => u * Math.cos(u * x), pos: false },
    { src: (u) => `e^((${u})*x)`, f: (x, u) => Math.exp(u * x), d: (x, u) => u * Math.exp(u * x), pos: false },
    { src: (u, v) => `x+(${u})*cos((${v})*x)`, f: (x, u, v) => x + u * Math.cos(v * x), d: (x, u, v) => 1 - u * v * Math.sin(v * x), pos: false },
    { src: () => 'ln(x)', f: (x) => Math.log(x), d: (x) => 1 / x, pos: true },
    { src: () => 'sqrt(x)', f: (x) => Math.sqrt(x), d: (x) => 0.5 / Math.sqrt(x), pos: true },
    { src: () => 'x+1/x', f: (x) => x + 1 / x, d: (x) => 1 - 1 / (x * x), pos: true },
    { src: () => 'arctan(x)', f: (x) => Math.atan(x), d: (x) => 1 / (1 + x * x), pos: false },
  ]
  let scanned = 0
  for (let t = 0; t < 600; t++) {
    const fam = FAMILY[t % FAMILY.length]
    const u = rnd(0.3, 2.5) * (Math.random() < 0.5 ? -1 : 1)
    const v = rnd(0.3, 2.5) * (Math.random() < 0.5 ? -1 : 1)
    const a = fam.pos ? rnd(0.2, 3) : rnd(-3, 2)
    const b = a + rnd(0.4, 4)
    const e = run(fam.src(u, v), a, b)
    const slope = (fam.f(b, u, v) - fam.f(a, u, v)) / (b - a)
    close(e.slope, slope, `${fam.src(u, v)}: the slope of the secant`, 1e-9)
    ok(e.hypotheses, `${fam.src(u, v)} on [${a.toFixed(3)}, ${b.toFixed(3)}] satisfies the hypotheses`)
    ok(e.points.length >= 1, `${fam.src(u, v)} on [${a.toFixed(3)}, ${b.toFixed(3)}]: the theorem promises a point, got none`)
    // the points are where f′ equals the slope, by the hand-written derivative
    for (const c of e.points) {
      ok(c > a && c < b, 'c is inside (a, b)')
      ok(Math.abs(fam.d(c, u, v) - slope) < 1e-5 * (1 + Math.abs(slope)), `f′(c) = slope at c = ${c} for ${fam.src(u, v)}`)
      // the proof: h(x) = f(x) − f(a) − slope (x − a) has h′(c) = 0
      const h = (x) => fam.f(x, u, v) - fam.f(a, u, v) - slope * (x - a)
      const step = 1e-6
      ok(Math.abs((h(c + step) - h(c - step)) / (2 * step)) < 1e-4 * (1 + Math.abs(slope)), 'h′(c) = 0')
    }
    // the proof: h(a) = h(b) = 0
    const h0 = fam.f(a, u, v) - fam.f(a, u, v) - slope * 0
    const h1 = fam.f(b, u, v) - fam.f(a, u, v) - slope * (b - a)
    ok(Math.abs(h0) < 1e-12 && Math.abs(h1) < 1e-9 * (1 + Math.abs(slope * (b - a))), 'h(a) = h(b) = 0')
    // a scan for every place where f′ − slope changes sign
    const K = 200000
    // (a grid point can fall exactly on a zero, so the sign carried along is the last one that was not 0)
    let prev = Math.sign(fam.d(a, u, v) - slope)
    let count = 0
    const found = []
    for (let k = 1; k <= K; k++) {
      const x = a + ((b - a) * k) / K
      const cur = Math.sign(fam.d(x, u, v) - slope)
      if (cur !== 0) {
        if (prev !== 0 && cur !== prev) {
          count++
          found.push(x)
        }
        prev = cur
      }
    }
    scanned++
    ok(e.points.length === count, `${fam.src(u, v)} on [${a.toFixed(3)}, ${b.toFixed(3)}]: ${e.points.length} points found, the scan sees ${count}`)
    for (const x of found) ok(has(e.points, x, 2 * (b - a) / K + 1e-6), `the scan's point ${x} is among the engine's`)
  }
  ok(scanned === 600, 'six hundred random functions scanned')
}

/* ------------------------------------------------------------------ 3: the hypotheses */
{
  const corner = run('abs(x)', -1, 2)
  ok(!corner.differentiable && corner.kinks.length === 1 && Math.abs(corner.kinks[0]) < 1e-6, '|x| on [−1, 2]: a corner at 0')
  ok(corner.continuous && !corner.hypotheses, '|x| on [−1, 2]: continuous but not differentiable inside')
  close(corner.slope, 1 / 3, '|x| on [−1, 2]: slope 1/3')
  ok(corner.points.length === 0, '|x| on [−1, 2]: no point has the slope 1/3, so the conclusion fails with the hypotheses')
  const cusp = run('x^(2/3)', -1, 8)
  ok(!cusp.differentiable && cusp.kinks.length === 1 && Math.abs(cusp.kinks[0]) < 1e-6, 'Exercise 9: x^(2/3) on [−1, 8] has a cusp at 0')
  ok(cusp.points.length === 0, 'Exercise 9: slope 1/3 gives x = 8, an endpoint, not inside (−1, 8)')
  // Exercise 10: x^(4/5) on [0, 1] satisfies the hypotheses (the vertical tangent is at the endpoint)
  ok(run('x^(4/5)', 0, 1).hypotheses, 'Exercise 10: x^(4/5) on [0, 1]')
  // Exercise 11: √(x(1 − x)) on [0, 1]
  ok(run('sqrt(x*(1-x))', 0, 1).hypotheses, 'Exercise 11: √(x(1 − x)) on [0, 1]')
  const cuberoot = run('x^(1/3)', -1, 1)
  ok(!cuberoot.differentiable && cuberoot.kinks.length === 1 && Math.abs(cuberoot.kinks[0]) < 1e-6, '∛x on [−1, 1]: a vertical tangent at 0')
  const pole = run('1/x', -1, 2)
  ok(!pole.continuous && pole.breaks.some((x) => Math.abs(x) < 0.01) && !pole.hypotheses, '1/x on [−1, 2]: a pole at 0')
  const hole = run('ln(x^2-1)', -2, 2)
  ok(!hole.continuous && hole.breaks.length >= 1 && !hole.hypotheses, 'ln(x² − 1) on [−2, 2] is not defined between −1 and 1')
  const tangent = run('tan(x)', 0, 2)
  ok(!tangent.continuous && tangent.breaks.some((x) => Math.abs(x - PI / 2) < 0.01), 'tan x on [0, 2]: a pole at π/2')
  for (const [src, a, b] of [['x^2', -1, 3], ['e^x', 0, 1], ['sin(x)', 0, 3], ['ln(x)', 1, 5], ['x^3-3*x', -2, 2], ['arctan(x)', -3, 3]])
    ok(run(src, a, b).hypotheses, `${src} on [${a}, ${b}] satisfies both hypotheses`)
  for (const [src, a, b, why] of [['x^2', 2, 1, 'interval'], ['x^2', 1, 1, 'interval'], ['x^+', 0, 1, 'syntax'], ['ln(x)', 0, 1, 'undefined'], ['sqrt(x)', -1, 1, 'undefined']]) {
    const r = M.mvt(src, a, b)
    ok(!r.ok && r.error === why, `${src} on [${a}, ${b}] is refused as ${why}`)
  }
}

/* ------------------------------------------------------------- 4: Rolle's Theorem, case by case */
{
  const byId = (id) => M.ROLLE_CASES.find((c) => c.id === id)
  for (const c of M.ROLLE_CASES) {
    ok(Math.abs(c.f(c.a) - c.f(c.b)) < 1e-12, `${c.id}: f(a) = f(b)`)
    // stationary points of the JavaScript function by a scan of central differences, away from the places where it breaks
    const K = 400000
    const h = (c.b - c.a) / K / 4
    const gaps = c.gaps ?? []
    const bad = (x) => gaps.some((g) => Math.abs(x - g) < 3 * h) || (c.breaks === 'corner' && Math.abs(x) < 3 * h) || (c.breaks === 'cusp' && Math.abs(x) < 3 * h)
    let prev = null
    const sign = []
    for (let k = 1; k < K; k++) {
      const x = c.a + ((c.b - c.a) * k) / K
      if (bad(x)) {
        prev = null
        continue
      }
      // a central difference of a function that is exactly 0 there can come out as noise around 0: call that 0
      const raw = (c.f(x + h) - c.f(x - h)) / (2 * h)
      const d = Math.abs(raw) < 1e-6 ? 0 : raw
      if (d !== 0) {
        if (prev !== null && prev.d !== 0 && Math.sign(prev.d) !== Math.sign(d)) sign.push(x)
        prev = { x, d }
      }
    }
    same(sign, c.horizontal, `${c.id}: the horizontal tangents by a scan`, 2e-3)
    for (const x of c.horizontal) ok(Math.abs((c.f(x + 1e-6) - c.f(x - 1e-6)) / 2e-6) < 1e-5, `${c.id}: f′ = 0 at ${x}`)
    ok((c.horizontal.length > 0) === (c.breaks === 'none'), `${c.id}: a horizontal tangent exists exactly when the hypotheses hold`)
  }
  // the broken hypotheses are really broken
  for (const id of ['endpoint', 'interior']) {
    const c = byId(id)
    const g = c.gaps[0]
    ok(Math.abs(c.f(g - 1e-9) - c.f(g)) > 0.4 || Math.abs(c.f(g + 1e-9) - c.f(g)) > 0.4, `${id}: the graph jumps at ${g}`)
    ok(Math.abs((c.f(0.3 + 1e-6) - c.f(0.3 - 1e-6)) / 2e-6 - 1) < 1e-6, `${id}: the slope is 1 where it is differentiable`)
  }
  ok(Math.abs(byId('corner').f(-1e-9) - byId('corner').f(1e-9)) < 1e-8, 'the corner: continuous at 0')
  ok(Math.abs((byId('corner').f(1e-3) - byId('corner').f(0)) / 1e-3 - 1) < 1e-9 && Math.abs((byId('corner').f(-1e-3) - byId('corner').f(0)) / -1e-3 + 1) < 1e-9, 'the corner: one-sided slopes 1 and −1')
  const cusp = byId('cusp')
  ok((cusp.f(1e-12) - cusp.f(0)) / 1e-12 > 1e3 && (cusp.f(1e-15) - cusp.f(0)) / 1e-15 > 1e4, 'the cusp: the difference quotient blows up at 0')
  // the same cases through the engine, where the text can say them
  same(run('x^2-2*x', 0, 2).points, [1], 'Rolle: x² − 2x, c = 1')
  ok(run('x^2-2*x', 0, 2).rolle, 'Rolle: the secant is horizontal')
  same(run('sin(x)', 0, 3 * PI).points, byId('three').horizontal, 'Rolle: sin x on [0, 3π] has three points')
  ok(!run('abs(x)', -1, 1).hypotheses && run('abs(x)', -1, 1).points.length === 0, 'Rolle: |x| has no horizontal tangent')
  ok(!run('x^(2/3)', -1, 1).hypotheses && run('x^(2/3)', -1, 1).points.length === 0, 'Rolle: x^(2/3) has no horizontal tangent')
}

/* ----------------------------------- 5: between two zeros of a polynomial, a zero of its derivative */
{
  const toNum = M.toNumber
  const ev = (poly, x) => poly.reduceRight((acc, c) => acc * x + toNum(c), 0)
  // Example 1: x³ + 3x + 1 has exactly one real root, between −1 and 0
  const p1 = [M.rat(1n, 1n), M.rat(3n, 1n), M.rat(0n, 1n), M.rat(1n, 1n)]
  const roots1 = M.realRoots(p1, M.rat(-100n, 1n), M.rat(100n, 1n))
  ok(roots1.length === 1, 'Example 1: exactly one real root')
  const r1 = toNum(M.rootPoint(roots1[0]))
  ok(r1 > -1 && r1 < 0 && Math.abs(r1 ** 3 + 3 * r1 + 1) < 1e-9, 'Example 1: the root is between −1 and 0')
  close(r1 ** 3 + 3 * r1 + 1, 0, 'Example 1: f(root) = 0', 1e-9)
  ok(-1 + -3 + 1 === -3 && 0 + 0 + 1 === 1, 'Example 1: f(−1) = −3 and f(0) = 1')
  ok(Math.min(...Array.from({ length: 2001 }, (_, i) => 3 * ((i - 1000) / 100) ** 2 + 3)) >= 3, 'Example 1: f′ = 3x² + 3 is always positive')
  // Exercises 17: x² − 4, x² + 8x + 15, 3x(x−1)(x+... ) as products of linear factors
  for (const roots of [[-2, 2], [-5, -3], [-1, 0, 4], [-3, 0, 2, 5]]) {
    const r = M.rolleRoots(roots)
    ok(r.critical.length === roots.length - 1, `roots ${roots}: f′ has n − 1 real zeros`)
    ok(r.between.every((b) => b.length === 1), `roots ${roots}: exactly one zero of f′ in each gap`)
  }
  // random integer roots: the expansion vanishes exactly at the roots, and f′ has one zero in every gap
  for (let t = 0; t < 400; t++) {
    const n = 2 + Math.floor(Math.random() * 5)
    const set = new Set()
    while (set.size < n) set.add(Math.floor(rnd(-9, 10)))
    const roots = [...set]
    const r = M.rolleRoots(roots)
    ok(r.roots.length === n, 'distinct roots kept')
    for (const x of r.roots) ok(M.evalPoly(r.poly, M.rat(BigInt(x), 1n)).n === 0n, `f(${x}) = 0 exactly`)
    ok(M.degree(r.poly) === n, 'the degree is the number of roots')
    ok(r.critical.length === n - 1, `roots ${roots}: ${r.critical.length} zeros of f′, want ${n - 1}`)
    r.between.forEach((b, i) => ok(b.length === 1 && b[0] > r.roots[i] && b[0] < r.roots[i + 1], `roots ${roots}: one zero of f′ between ${r.roots[i]} and ${r.roots[i + 1]}`))
    for (const c of r.critical) {
      const h = 1e-6
      const slope = (ev(r.poly, c + h) - ev(r.poly, c - h)) / (2 * h)
      ok(Math.abs(slope) < 1e-3 * (1 + Math.abs(ev(r.poly, c))), `f′(${c}) = 0`)
    }
    // the scan on the same polynomial: a sign change of f′ between every two roots
    for (let i = 0; i + 1 < r.roots.length; i++) {
      const lo = r.roots[i]
      const hi = r.roots[i + 1]
      let changes = 0
      let prev = Math.sign(ev(r.dpoly, lo + 1e-9))
      for (let k = 1; k <= 4000; k++) {
        const cur = Math.sign(ev(r.dpoly, lo + ((hi - lo) * k) / 4000 - (k === 4000 ? 1e-9 : 0)))
        if (cur !== 0) {
          if (prev !== 0 && cur !== prev) changes++
          prev = cur
        }
      }
      ok(changes === 1, `roots ${roots}: the scan sees one sign change of f′ between ${lo} and ${hi}`)
    }
  }
  // Exercise 20: a cubic has at most three real roots; Exercises 21 and 22: exactly one zero in an interval
  for (let t = 0; t < 300; t++) {
    const cs = [rnd(-9, 9), rnd(-9, 9), rnd(-9, 9), rnd(0.5, 5)].map((v) => M.rat(BigInt(Math.round(v * 8)), 8n))
    ok(M.realRoots(cs, M.rat(-1000n, 1n), M.rat(1000n, 1n)).length <= 3, 'Exercise 20: at most three real roots')
  }
  const f21 = (x) => x ** 4 + 3 * x + 1
  ok(f21(-2) > 0 && f21(-1) < 0, 'Exercise 21: a sign change on [−2, −1]')
  ok(Array.from({ length: 1001 }, (_, i) => -2 + i / 1000).every((x) => 4 * x ** 3 + 3 < 0), 'Exercise 21: f′ < 0 on the interval, so exactly one zero')
}

/* ------------------------------------------------- 6: Corollaries 1 and 2, families y = g(x) + C */
{
  for (const a of M.ANTIDERIVATIVES) {
    const g = M.parseFunction(a.gSrc)
    const d = M.parseFunction(a.dSrc)
    ok(typeof g !== 'string' && typeof d !== 'string', `${a.id}: both texts parse`)
    const dg = M.derive(g).result
    for (let i = 0; i <= 200; i++) {
      const x = a.xr[0] + ((a.xr[1] - a.xr[0]) * i) / 200
      close(M.evalFloat(dg, x), M.evalFloat(d, x), `${a.id}: the derivative of ${a.gSrc} is ${a.dSrc} at ${x}`, 1e-9)
      close(M.evalFloat(g, x), a.g(x), `${a.id}: the text and the function agree at ${x}`, 1e-9)
      const h = 1e-6
      close((a.g(x + h) - a.g(x - h)) / (2 * h), M.evalFloat(d, x), `${a.id}: central difference at ${x}`, 1e-5)
    }
    // Corollary 2: g + C has the same derivative for every C, and the C through (x0, y0) is y0 − g(x0)
    for (const C of [-3, -0.5, 0, 1, 4.25]) {
      for (const x of [a.xr[0] + 0.1, 0, a.xr[1] - 0.1]) {
        const h = 1e-6
        close(((a.g(x + h) + C) - (a.g(x - h) + C)) / (2 * h), a.g(x + h) === a.g(x - h) ? 0 : (a.g(x + h) - a.g(x - h)) / (2 * h), `${a.id}: adding ${C} keeps the derivative`, 1e-9)
      }
    }
    const C = M.constantFor(a.g, a.x0, a.y0)
    close(a.g(a.x0) + C, a.y0, `${a.id}: the graph passes through (x0, y0)`)
  }
  const by = (id) => M.ANTIDERIVATIVES.find((a) => a.id === id)
  close(M.constantFor(by('sin').g, 0, 2), 3, 'Example 4: f(x) = −cos x + 3')
  close(M.constantFor(by('fall-v').g, 0, 0), 0, 'free fall: v(t) = 9.8 t')
  close(M.constantFor(by('fall-s').g, 0, 0), 0, 'free fall: s(t) = 4.9 t²')
  // Exercise 31: f′(x) = 2x, so f = x² + C
  const sq = by('twox').g
  close(sq(2) + M.constantFor(sq, 0, 0), 4, 'Exercise 31a: f(2) = 4')
  close(sq(2) + M.constantFor(sq, 1, 0), 3, 'Exercise 31b: f(2) = 3')
  close(sq(2) + M.constantFor(sq, -2, 3), 3, 'Exercise 31c: f(2) = 3')
  // Exercise 39: f′(x) = 2x − 1 through (0, 0): x² − x; Exercise 40: g′ = 1/x² + 2x through (−1, 1): −1/x + x² + 1
  const g40 = (x) => -1 / x + x * x
  close(g40(-1) + M.constantFor(g40, -1, 1), 1, 'Exercise 40: through (−1, 1)')
  close(g40(-1) + M.constantFor(g40, -1, 1) - (g40(2) + M.constantFor(g40, -1, 1)), g40(-1) - g40(2), 'Exercise 40: the shift does not change differences')
  // Corollary 1, in the proof's shape: f(x₂) − f(x₁) = f′(c)(x₂ − x₁) for some c, so f′ = 0 gives equal values
  for (let t = 0; t < 200; t++) {
    const x1 = rnd(-3, 3)
    const x2 = x1 + rnd(0.1, 3)
    const e = run('x^3-3*x', x1, x2)
    ok(e.points.length >= 1 && e.points.every((c) => Math.abs((c * c - 1) * 3 - e.slope) < 1e-5 * (1 + Math.abs(e.slope))), 'the proof of Corollary 1: f(x₂) − f(x₁) = f′(c)(x₂ − x₁)')
  }
}

/* ----------------------------------------------------------------- 7: the inequalities */
{
  for (let i = 0; i < 20000; i++) {
    const x = rnd(-20, 20)
    ok(Math.abs(Math.cos(x) - 1) <= Math.abs(x) + 1e-12, 'Exercise 65: |cos x − 1| ≤ |x|')
    const a = rnd(-20, 20)
    const b = rnd(-20, 20)
    ok(Math.abs(Math.sin(b) - Math.sin(a)) <= Math.abs(b - a) + 1e-12, 'Exercise 66: |sin b − sin a| ≤ |b − a|')
  }
  // Exercise 63: |f′| ≤ 1 on [1, 4] gives −3 ≤ f(4) − f(1) ≤ 3; Exercise 70: min f′ ≤ slope ≤ max f′
  for (let t = 0; t < 300; t++) {
    const u = rnd(0.3, 2.5)
    const a = rnd(-3, 2)
    const b = a + rnd(0.4, 4)
    const e = run(`sin((${u})*x)`, a, b)
    let lo = Infinity
    let hi = -Infinity
    for (let k = 0; k <= 4000; k++) {
      const d = u * Math.cos(u * (a + ((b - a) * k) / 4000))
      lo = Math.min(lo, d)
      hi = Math.max(hi, d)
    }
    ok(e.slope >= lo - 1e-9 && e.slope <= hi + 1e-9, 'Exercise 70: the slope of the secant is between min f′ and max f′')
    ok(Math.abs(Math.sin(u * b) - Math.sin(u * a)) <= u * (b - a) + 1e-12, 'a Lipschitz bound from |f′| ≤ u')
  }
  // Exercise 71 in the form of this article: f′(x) = 1/(1 + x²) on [0, 1], f(0) = 0: 1/2 ≤ f′ ≤ 1, so 1/2 ≤ f(1) ≤ 1 (it is π/4)
  ok(Math.atan(1) >= 0.5 && Math.atan(1) <= 1 && Math.abs(Math.atan(1) - PI / 4) < 1e-15, 'arctan(1) = π/4 lies between 1/2 and 1')
}

console.log(`mvt check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
