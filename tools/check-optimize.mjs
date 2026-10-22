/** Checks src/lib/optimize.ts and src/lib/optproblems.ts, the numbers behind the "Applied Optimization" article.
 *
 *  References that do not use the code under test:
 *   1. The fifteen textbook problems of the gallery, each solved in closed form by SymPy (the values are written into this
 *      file), and the things each problem asks for, worked out by hand from the best x.
 *   2. A brute-force scan of a million points of every objective: nothing on the scan beats the answer, and where the answer
 *      is an interior critical point, f″ has the sign the second derivative test needs.
 *   3. The open ends: an objective that grows without bound at both ends, one that levels off, and one whose best value is only
 *      approached.
 *   4. Closed forms for random parameters: the box cut from a sheet, the can of a given volume in its three versions (closed,
 *      open top, with waste), the rectangle on a river fence, the rectangle in a semicircle, and the delivery schedule with the
 *      Wilson lot size formula.
 *   5. Snell's law for the path of light, against a ternary search of the travel time and against the straight line of a mirror.
 *   6. Marginal revenue = marginal cost for the textbook's cost curve at random prices, against a scan of the profit.
 *   7. The refusals.
 *
 *  Run: npm run check:optimize   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'opt-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/optimize.ts')}'
export * from '${p('src/lib/optproblems.ts')}'
export { boxBest, boxVolume } from '${p('src/lib/extrema.ts')}'`)
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
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * (1 + Math.abs(b))
const rnd = (a, b) => a + Math.random() * (b - a)
const PI = Math.PI

/** A problem object for a function of one variable, for tests of random parameters. */
const prob = (f, a, b, want, extra = {}) => ({ id: 'x', f, want, a, b, openA: false, openB: false, win: [a, b], ask: () => [], exact: { x: 0, value: 0 }, ...extra })

/* ------------------------------------------------------- 1 and 2: the fifteen problems against SymPy */
const SYMPY = {
  box: [2, 128],
  can: [5.41926070139289, 553.5810445932085],
  semicircle: [1.4142135623730951, 4],
  river: [200, 80000],
  pea: [12, 72],
  poster: [12.5, 1012.5],
  conesphere: [4, 33.51032163829113],
  cylsphere: [11.547005383792515, 2418.3991523122904],
  beam: [17.320508075688775, 10392.304845413264],
  wallbeam: [2.7144176165949068, 9.582298953840144],
  lights: [4, 0.75],
  recip: [1, 2],
  jane: [0.8728715609439696, 2.116515138991168],
  tour: [67, 2978],
  conesheet: [0.816496580927726, 0.40306652538538174],
}
ok(M.PROBLEMS.length === 15, 'fifteen problems')
for (const q of M.PROBLEMS) {
  const [sx, sv] = SYMPY[q.id]
  ok(near(q.exact.x, sx, 1e-9) && near(q.exact.value, sv, 1e-9), `${q.id}: the exact answer written in the problem matches SymPy`)
  const r = M.solveProblem(q)
  ok(r.ok, `${q.id}: solved`)
  if (!r.ok) continue
  ok(near(r.best.x, sx, 1e-6) && near(r.best.fx, sv, 1e-8), `${q.id}: best ${r.best.x}, ${r.best.fx}; SymPy ${sx}, ${sv}`)
  ok(r.attained, `${q.id}: the best value is attained`)
  ok(r.best.at === 'critical', `${q.id}: the best point is a critical point`)
  ok(q.want === 'max' ? r.second < 0 : r.second > 0, `${q.id}: f″ has the sign of a ${q.want} (${r.second})`)
  // a scan of the domain that the problem allows: nothing is better than the answer
  const lo = q.openA ? q.win[0] : q.a
  const hi = q.openB ? q.win[1] : q.b
  const g = M.objective(q.f)
  const K = 200000
  let worst = true
  for (let i = 0; i <= K; i++) {
    const v = g(lo + ((hi - lo) * i) / K)
    if (Number.isFinite(v) && (q.want === 'max' ? v > r.best.fx + 1e-9 * (1 + Math.abs(r.best.fx)) : v < r.best.fx - 1e-9 * (1 + Math.abs(r.best.fx)))) worst = false
  }
  ok(worst, `${q.id}: nothing on the scan beats the answer`)
  // the closed ends have a row with a value; the open ends a row with a limit
  const first = r.rows[0]
  const last = r.rows[r.rows.length - 1]
  ok(q.openA ? first.fx === null && first.limit : first.fx !== null, `${q.id}: the first row`)
  ok(q.openB ? last.fx === null && last.limit : last.fx !== null, `${q.id}: the last row`)
  ok(r.rows.filter((w) => w.kind === 'critical').length >= 1, `${q.id}: at least one critical row`)
  // the answers asked for come from the best x
  const asks = q.ask(r.best.x, r.best.fx)
  ok(asks.length >= 2 && asks.every((a) => Number.isFinite(a.value)), `${q.id}: the answers are numbers`)
}

/** The things each problem asks for, worked out by hand. */
{
  const get = (id) => {
    const q = M.PROBLEMS.find((k) => k.id === id)
    const r = M.solveProblem(q)
    return q.ask(r.best.x, r.best.fx).map((a) => a.value)
  }
  let a = get('box')
  ok(near(a[0], 2) && near(a[1], 128), 'box: x = 2, V = 128')
  a = get('can')
  ok(near(a[1], 2 * a[0], 1e-6) && near(a[2], 553.5810445932085, 1e-8), 'can: h = 2r, A = 553.58')
  a = get('semicircle')
  ok(near(a[0], 2 * Math.SQRT2) && near(a[1], Math.SQRT2) && near(a[2], 4), 'semicircle: length 2√2, height √2, area 4')
  a = get('river')
  ok(near(a[0], 200) && near(a[1], 400) && near(a[2], 80000), 'river: 200 by 400, area 80000')
  a = get('pea')
  ok(near(a[0], 12) && near(a[1], 18) && near(a[2], 72), 'pea patch: 12 by 18, fence 72')
  a = get('poster')
  ok(near(a[0], 12.5) && near(a[1], 25) && near(a[2], 22.5) && near(a[3], 45) && near(a[4], 22.5 * 45), 'poster: 22.5 by 45, paper 1012.5')
  a = get('conesphere')
  ok(near(a[0], 4) && near(a[1], Math.sqrt(8)) && near(a[2], (32 * PI) / 3), 'cone in a sphere: h = 4, r = 2√2, V = 32π/3')
  a = get('cylsphere')
  ok(near(a[0], (20 * Math.sqrt(3)) / 3) && near(a[1], Math.sqrt(200 / 3)) && near(a[2], (4000 * Math.sqrt(3) * PI) / 9), 'cylinder in a sphere: h = 20/√3, r = √(200/3)')
  a = get('beam')
  ok(near(a[0], 10 * Math.sqrt(3)) && near(a[1], Math.sqrt(600)) && near(a[2], 6000 * Math.sqrt(3)), 'beam: w = 10√3, d = √600')
  a = get('wallbeam')
  ok(near(a[0], Math.cbrt(20)) && near(a[2], 9.582298953840144, 1e-8) && near(a[1], (2 * (a[0] + 5)) / a[0]), 'beam over the wall: 20^(1/3) m from the wall, 9.58 m long')
  a = get('lights')
  ok(near(a[0], 4) && near(a[1], 2) && near(a[2], 0.75), 'lamps: 4 m from the stronger one, I = 3/4')
  a = get('jane')
  ok(near(a[0], 4 / Math.sqrt(21)) && near(a[1], 6 - 4 / Math.sqrt(21)) && near(a[2], Math.sqrt(21) / 5 + 6 / 5), 'Jane: lands 4/√21 km from the nearest point')
  a = get('tour')
  ok(near(a[0], 67) && near(a[1], 166) && near(a[2], 2978), 'tour: 67 people, fare 166, profit 2978')
  a = get('conesheet')
  ok(near(a[0], Math.sqrt(2 / 3)) && near(a[1], Math.sqrt(1 / 3)) && near(a[3], (2 * Math.sqrt(3) * PI) / 27) && near(a[2], 360 * (1 - Math.sqrt(2 / 3))), 'cone from a disk: r = √(2/3), h = 1/√3')
}

/* ---------------------------------------------------------------- 3: open ends and endpoint answers */
{
  // grows without bound at both ends: the table says so
  const can = M.solveProblem(M.PROBLEMS.find((k) => k.id === 'can'))
  ok(can.rows[0].limit.kind === 'inf' && can.rows[can.rows.length - 1].limit.kind === 'inf', 'can: A → ∞ at both ends of r > 0')
  const wall = M.solveProblem(M.PROBLEMS.find((k) => k.id === 'wallbeam'))
  ok(wall.rows[0].limit.kind === 'inf' && wall.rows[wall.rows.length - 1].limit.kind === 'inf', 'beam over the wall: L → ∞ at both ends')
  const lights = M.solveProblem(M.PROBLEMS.find((k) => k.id === 'lights'))
  ok(lights.rows[0].limit.kind === 'inf' && lights.rows[lights.rows.length - 1].limit.kind === 'inf', 'lamps: I → ∞ at both ends of (0, 6)')
  // x e^(-x) on x > 0: a maximum 1/e at x = 1, and the function levels off to 0
  const xe = M.solveProblem(prob('x*e^(-x)', 0, Infinity, 'max', { openA: true, openB: true, win: [0.01, 30] }))
  ok(xe.ok && near(xe.best.x, 1) && near(xe.best.fx, 1 / Math.E) && xe.attained, 'x e^(−x): maximum 1/e at 1, attained')
  ok(xe.rows[xe.rows.length - 1].limit.kind === 'finite' && Math.abs(xe.rows[xe.rows.length - 1].limit.value) < 1e-6, 'x e^(−x) → 0 at ∞')
  ok(xe.rows[0].limit.kind === 'finite' && Math.abs(xe.rows[0].limit.value) < 1e-1, 'x e^(−x) → 0 at 0⁺')
  // the same function asked for a minimum: the critical point is a maximum and the infimum 0 is only approached
  const xmin = M.solveProblem(prob('x*e^(-x)', 0, Infinity, 'min', { openA: true, openB: true, win: [0.01, 30] }))
  ok(xmin.ok && xmin.attained === false, 'x e^(−x) minimized on x > 0: the infimum 0 is never reached')
  // an endpoint answer: x³ − 3x on [−2, 3] has its maximum 18 at the end
  const cub = M.solveProblem(prob('x^3-3*x', -2, 3, 'max'))
  ok(cub.ok && near(cub.best.x, 3) && near(cub.best.fx, 18) && cub.best.at === 'endpoint' && Number.isNaN(cub.second), 'x³ − 3x on [−2, 3]: maximum 18 at the endpoint 3')
  // no candidate at all: a decreasing function on an open interval
  ok(M.solveProblem(prob('e^(-x)', 0, Infinity, 'min', { openA: true, openB: true, win: [0.01, 30] })).ok === false, 'e^(−x) on x > 0 has no critical point and no closed end: nothing to report')
}

/* ------------------------------------------------------ 4: closed forms for random parameters */
for (let t = 0; t < 200; t++) {
  // a box from a W by L sheet
  const W = rnd(6, 30)
  const Lg = rnd(6, 40)
  const box = M.solveProblem(prob(`x*(${W}-2*x)*(${Lg}-2*x)`, 0, Math.min(W, Lg) / 2, 'max'))
  ok(box.ok && near(box.best.x, M.boxBest(W, Lg), 1e-6) && near(box.best.fx, M.boxVolume(W, Lg, M.boxBest(W, Lg)), 1e-8), 'box from a random sheet')
  // a fence along a river with W metres of wire
  const wire = rnd(100, 2000)
  const fence = M.solveProblem(prob(`x*(${wire}-2*x)`, 0, wire / 2, 'max'))
  ok(fence.ok && near(fence.best.x, wire / 4, 1e-6) && near(fence.best.fx, (wire * wire) / 8, 1e-8), 'fence along a river: x = W/4, area W²/8')
  // a rectangle in a semicircle of radius R
  // a radius with exact binary digits, so that the grid of the search lands exactly on the end of the domain
  const R = Math.round(rnd(2, 40)) / 4
  const semi = M.solveProblem(prob(`2*x*sqrt((${R}-x)*(${R}+x))`, 0, R, 'max'))
  ok(semi.ok && near(semi.best.x, R / Math.SQRT2, 1e-6) && near(semi.best.fx, R * R, 1e-8), `rectangle in a semicircle, R = ${R}: ${semi.ok ? semi.best.x + ' ' + semi.best.fx : 'refused'}`)
  // the can: closed form against the engine and against a scan
  const V = rnd(100, 3000)
  for (const mode of ['closed', 'open', 'waste']) {
    const cb = M.canBest(mode, V)
    const ratio = mode === 'closed' ? 2 : mode === 'open' ? 1 : 8 / PI
    ok(near(cb.h / cb.r, ratio, 1e-9), `can (${mode}): h/r = ${ratio}`)
    const f = mode === 'closed' ? `2*pi*x^2+${2 * V}/x` : mode === 'open' ? `pi*x^2+${2 * V}/x` : `8*x^2+${2 * V}/x`
    const eng = M.solveProblem(prob(f, 0, Infinity, 'min', { openA: true, openB: true, win: [cb.r / 8, cb.r * 8] }))
    ok(eng.ok && near(eng.best.x, cb.r, 1e-6) && near(eng.best.fx, cb.area, 1e-8), `can (${mode}): the engine finds the closed form`)
    let lo = Infinity
    for (let i = 1; i <= 4000; i++) lo = Math.min(lo, M.canArea(mode, V, (cb.r * 4 * i) / 4000))
    ok(lo >= cb.area - 1e-9 * cb.area, `can (${mode}): nothing on the scan beats the closed form`)
    // the volume is respected: pi r² h = V
    ok(near(PI * cb.r * cb.r * cb.h, V, 1e-9), `can (${mode}): the volume`)
  }
  // the delivery schedule and the Wilson lot size
  const Kd = rnd(50, 9000)
  const dd = rnd(1, 20)
  const hh = rnd(1, 30)
  const best = M.deliveryBest(Kd, dd, hh)
  ok(near(best.days, Math.sqrt((2 * Kd) / (hh * dd)), 1e-12), 'delivery: x = √(2K/(h d))')
  ok(near(Kd / best.days, (hh * dd * best.days) / 2, 1e-9), 'delivery: at the best cycle the delivery cost per day equals the storage cost per day')
  let lowest = Infinity
  for (let i = 1; i <= 5000; i++) lowest = Math.min(lowest, M.deliveryCost(Kd, dd, hh, (best.days * 3 * i) / 5000))
  ok(lowest >= best.cost - 1e-9 * best.cost, 'delivery: nothing on the scan beats the best cycle')
  const eng = M.solveProblem(prob(`${Kd}/x+${(hh * dd) / 2}*x`, 0, Infinity, 'min', { openA: true, openB: true, win: [best.days / 8, best.days * 8] }))
  ok(eng.ok && near(eng.best.x, best.days, 1e-6) && near(eng.best.fx, best.cost, 1e-8), 'delivery: the engine finds the cycle')
  // Wilson: A(q) = k m / q + c m + h q / 2 is minimal at q = √(2 k m / h)
  const k = rnd(5, 100)
  const m = rnd(5, 200)
  const c = rnd(1, 50)
  const h = rnd(0.1, 5)
  const wil = M.solveProblem(prob(`${k * m}/x+${c * m}+${h / 2}*x`, 0, Infinity, 'min', { openA: true, openB: true, win: [Math.sqrt((2 * k * m) / h) / 8, Math.sqrt((2 * k * m) / h) * 8] }))
  ok(wil.ok && near(wil.best.x, Math.sqrt((2 * k * m) / h), 1e-6), 'Wilson lot size: q = √(2km/h)')
}
ok(near(M.deliveryBest(5000, 5, 10).days, Math.sqrt(200)) && near(M.deliveryBest(5000, 5, 10).cost, 500 * Math.SQRT2, 1e-9) && near(M.deliveryBest(5000, 5, 10).units, 5 * Math.sqrt(200)), 'the cabinetmaker: 14.14 days, 70.7 units, $707.11')
ok(Math.round(M.deliveryCost(5000, 5, 10, 14) * 100) / 100 === 707.14 && Math.round(M.deliveryCost(5000, 5, 10, 15) * 100) / 100 === 708.33, 'whole days: 14 days cost 707.14, 15 days cost 708.33')

/* ---------------------------------------------------------------------------- 5: the path of light */
for (let t = 0; t < 300; t++) {
  const s = { a: rnd(0.5, 10), b: rnd(0.5, 10), d: rnd(1, 20), c1: rnd(0.5, 3), c2: rnd(0.5, 3) }
  const r = M.snellBest(s)
  ok(r.x > 0 && r.x < s.d, 'the best landing point is between the feet')
  ok(near(Math.sin(r.theta1) / s.c1, Math.sin(r.theta2) / s.c2, 1e-9), "Snell's law: sin θ₁ / c₁ = sin θ₂ / c₂")
  // a ternary search of the time (the time is convex in x)
  let lo = 0
  let hi = s.d
  for (let i = 0; i < 200; i++) {
    const m1 = lo + (hi - lo) / 3
    const m2 = hi - (hi - lo) / 3
    if (M.snellTime(s, m1) < M.snellTime(s, m2)) hi = m2
    else lo = m1
  }
  ok(near(r.x, (lo + hi) / 2, 1e-6), `the ternary search finds the same point (${r.x} against ${(lo + hi) / 2})`)
  ok(near(r.t, M.snellTime(s, (lo + hi) / 2), 1e-9), 'the same least time')
  // a mirror: the same speed on both sides, and the path through the reflection of B is a straight line
  const mirror = { a: s.a, b: s.b, d: s.d, c1: s.c1, c2: s.c1 }
  const mr = M.snellBest(mirror)
  ok(near(mr.x, (s.a * s.d) / (s.a + s.b), 1e-9), 'a mirror: P is where the straight line to the image of B crosses it')
  ok(near(mr.theta1, mr.theta2, 1e-9), 'a mirror: the angle of incidence equals the angle of reflection')
}
{
  // the speeds that make straight lines: equal speeds with B below the surface also give the straight line
  const s = { a: 3, b: 4, d: 7, c1: 1, c2: 1 }
  ok(near(M.snellBest(s).x, 3, 1e-9) && near(M.snellBest(s).t, Math.sqrt(49 + 49), 1e-9), 'equal speeds: the straight line from A to B')
}

/* ------------------------------------------------------------ 6: marginal revenue and marginal cost */
for (let t = 0; t < 400; t++) {
  const price = rnd(3.05, 14)
  const info = M.profitInfo(price)
  ok(info.peak !== null && info.loss !== null, 'a price above 3 gives two points where marginal cost equals it')
  ok(near(M.marginalCost(info.peak), price, 1e-9) && near(M.marginalCost(info.loss), price, 1e-9), "marginal cost equals marginal revenue (the price) there")
  // a scan of the profit on 0 ≤ x ≤ 5
  let bestx = 0
  let bestp = M.profitAt(price, 0)
  for (let i = 0; i <= 50000; i++) {
    const x = (5 * i) / 50000
    const v = M.profitAt(price, x)
    if (v > bestp) {
      bestp = v
      bestx = x
    }
  }
  ok(near(info.best.profit, bestp, 1e-6) || info.best.profit >= bestp - 1e-9, `the best profit ${info.best.profit} against the scan ${bestp}`)
  ok(Math.abs(info.best.x - bestx) < 2e-3 || near(info.best.profit, bestp, 1e-9), `the best level ${info.best.x} against the scan ${bestx}`)
  // the second derivative of the profit is −c″(x) = −(6x − 12): negative at the peak, positive at the loss
  ok(-(6 * info.peak - 12) < 0 && -(6 * info.loss - 12) > 0, 'profit is concave at the peak and convex at the loss')
  for (const be of info.breakEven) ok(near(price * be, M.costOf(be), 1e-9), 'break-even: revenue equals cost')
  ok((info.breakEven.length === 2) === (price > 6), 'two break-even points exactly when the price is above 6')
  ok((info.best.profit > 1e-12) === (price > 6), 'a profit is possible exactly when the price is above 6')
}
{
  const info = M.profitInfo(9)
  ok(near(info.peak, 2 + Math.SQRT2) && near(info.loss, 2 - Math.SQRT2), 'textbook: x = 2 ± √2 at price 9')
  ok(near(info.best.x, 2 + Math.SQRT2, 1e-9) && near(info.breakEven[0], 3 - Math.sqrt(3), 1e-9) && near(info.breakEven[1], 3 + Math.sqrt(3), 1e-9), 'textbook: best level 3.414, break-even 1.268 and 4.732')
  const low = M.profitInfo(2.5)
  ok(low.peak === null && low.loss === null && low.best.x === 0 && low.best.profit === 0, 'a price below the least marginal cost 3: no stationary point, produce nothing')
}

/* ------------------------------------------------------------------------------------- 7: refusals */
{
  ok(M.solveProblem(prob('x^+', 0, 1, 'max')).ok === false, 'a bad objective is refused')
  ok(M.solveProblem(prob('x', 1, 0, 'max')).ok === false, 'a bad interval is refused')
}

console.log(`optimize check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
