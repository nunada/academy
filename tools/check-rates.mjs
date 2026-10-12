/** Checks src/lib/rates.ts, the engine behind the "The Derivative as a Rate of Change" article's widgets.
 *
 *  Independent references, so nothing is checked against itself:
 *   1. Real roots (Sturm sequence and bisection) against polynomials built from chosen rational roots and ±√k, and
 *      against sign changes found by scanning a fine grid.
 *   2. Motion along a line: velocity against the slope computed from the definition (tangent.ts), the direction of every
 *      interval and whether it speeds up against exact values at sample points, the turning points against sign changes
 *      of v, and the total distance against a fine polyline.
 *   3. A body thrown straight up, in closed form: top at v0/g, height v0²/2g, landing at 2v0/g, landing velocity −v0.
 *   4. Marginal cost against the true next-unit cost: their gap is exactly the higher Taylor terms of the cost function.
 *   5. The geometric rates (area and volume against radius, diameter, side) against central differences.
 *
 *  Run: npm run check:rates   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rt-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(
  entry,
  `export * from '${p('src/lib/rates.ts')}'\nexport { derivative, evalPoly, polyMul, polyAdd, polySub, slopeAt, shift } from '${p('src/lib/tangent.ts')}'\nexport { ratAdd, ratMul, ratSub, ratDiv } from '${p('src/lib/rationals.ts')}'`,
)
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
const B = BigInt
const R = (n, d = 1) => D.rat(B(n), B(d))
const txt = (r) => (r === null ? 'null' : `${r.n}/${r.d}`)
const num = (r) => Number(r.n) / Number(r.d)
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const same = (a, b) => a.n === b.n && a.d === b.d
const P = (...cs) => cs.map((c) => (Array.isArray(c) ? R(c[0], c[1]) : R(c)))
const lin = (r) => [D.ratSub(R(0), r), R(1)] // x - r
/** A polynomial as a fast floating-point function, for scans only (every verdict above is exact). */
const fl = (poly) => {
  const cs = poly.map(num)
  return (x) => cs.reduceRight((acc, c) => acc * x + c, 0)
}

/* ------------------------------------------------------------------ 1. roots */
for (let i = 0; i < 1500; i++) {
  const k = rnd(1, 4)
  const roots = []
  while (roots.length < k) {
    const r = R(rnd(-16, 16), rnd(1, 3))
    if (!roots.some((q) => same(q, r))) roots.push(r)
  }
  let poly = [R(rnd(1, 4))]
  for (const r of roots) poly = D.polyMul(poly, lin(r))
  const irrational = pickIrr()
  if (irrational) poly = D.polyMul(poly, [R(-irrational), R(0), R(1)])
  // a repeated factor changes nothing about the set of roots
  if (Math.random() < 0.3) poly = D.polyMul(poly, lin(roots[0]))
  const lo = R(rnd(-12, 0), rnd(1, 2))
  const hi = R(rnd(1, 12), rnd(1, 2))
  const found = D.realRoots(poly, lo, hi)
  const wantRational = roots.filter((r) => num(r) >= num(lo) && num(r) <= num(hi))
  const wantIrr = irrational ? [-Math.sqrt(irrational), Math.sqrt(irrational)].filter((v) => v >= num(lo) && v <= num(hi)) : []
  eq(found.length, wantRational.length + wantIrr.length, `number of roots of a product in [${txt(lo)}, ${txt(hi)}]`)
  for (const r of wantRational) eq(found.some((f) => f.exact && same(f.exact, r)), true, `rational root ${txt(r)} found exactly`)
  for (const v of wantIrr) eq(found.some((f) => !f.exact && Math.abs(num(D.rootPoint(f)) - v) < 1e-10), true, `irrational root ${v} isolated`)
}
function pickIrr() {
  const c = Math.random()
  if (c < 0.4) return 0
  return [2, 3, 5, 6, 7, 8, 10][rnd(0, 6)]
}
eq(D.realRoots(P(1, 0, 1), R(-5), R(5)).length, 0, 'x² + 1 has no real root')
eq(D.realRoots(P(-2, 0, 1), R(-5), R(5)).length, 2, 'x² − 2 has two')
eq(D.realRoots(P(-2, 0, 1), R(0), R(5)).length, 1, 'and one of them is positive')
eq(txt(D.realRoots(P(0, 0, 1), R(-1), R(1))[0].exact), '0/1', 'x² has the double root 0, listed once')
eq(D.realRoots(P(3), R(-5), R(5)).length, 0, 'a constant has no root')

// random small polynomials: every reported root brackets a sign change of the square-free part, and a grid scan agrees
let scanChecked = 0
for (let i = 0; i < 600; i++) {
  const deg = rnd(2, 5)
  const poly = Array.from({ length: deg + 1 }, () => R(rnd(-6, 6), rnd(1, 3)))
  if (poly[deg].n === 0n) poly[deg] = R(1)
  const q = D.squareFree(poly)
  const found = D.realRoots(poly, R(-10), R(10))
  for (const r of found) {
    if (r.exact) eq(D.evalPoly(poly, r.exact).n, 0n, 'an exact root is a root')
    else eq(num(D.evalPoly(q, r.lo)) * num(D.evalPoly(q, r.hi)) <= 0, true, 'an isolating interval holds a sign change')
  }
  // grid scan of the square-free part
  let changes = 0
  let prev = 0
  const N = 4000
  const fq = fl(q)
  const gaps = found.map((f) => num(D.rootPoint(f)))
  let closest = Infinity
  for (let a = 0; a < gaps.length; a++) for (let b = a + 1; b < gaps.length; b++) closest = Math.min(closest, Math.abs(gaps[a] - gaps[b]))
  for (let k = 0; k <= N; k++) {
    const x = -10 + (20 * k) / N
    const v = fq(x)
    const s = v > 0 ? 1 : v < 0 ? -1 : 0
    if (s !== 0 && prev !== 0 && s !== prev) changes++
    if (s !== 0) prev = s
  }
  if (closest > 0.02) {
    scanChecked++
    eq(changes, found.length, `grid sign changes equal the roots found for ${poly.map(txt).join(',')}`)
  }
}
eq(scanChecked > 300, true, 'enough polynomials were scanned')

/* ------------------------------------------------------------ 2. motion on a line */
for (let i = 0; i < 200; i++) {
  const deg = rnd(2, 4)
  const s = Array.from({ length: deg + 1 }, () => R(rnd(-6, 6), rnd(1, 2)))
  if (s[deg].n === 0n) s[deg] = R(1)
  const m = D.motionOf(s)
  const t0 = R(rnd(-3, 0))
  const t1 = R(rnd(1, 6))
  const rep = D.analyzeMotion(m, t0, t1)
  // velocity is the slope from the definition, acceleration its slope
  const tt = R(rnd(-5, 5), rnd(1, 3))
  eq(txt(D.evalPoly(m.v, tt)), txt(D.slopeAt(s, tt)), 'v is the derivative of s')
  eq(txt(D.evalPoly(m.a, tt)), txt(D.slopeAt(m.v, tt)), 'a is the derivative of v')
  eq(txt(D.evalPoly(m.j, tt)), txt(D.slopeAt(m.a, tt)), 'j is the derivative of a')
  eq(txt(rep.displacement), txt(D.ratSub(D.evalPoly(s, t1), D.evalPoly(s, t0))), 'displacement')
  eq(txt(rep.averageVelocity), txt(D.ratDiv(rep.displacement, D.ratSub(t1, t0))), 'average velocity')
  // the segments cover the interval in order
  eq(txt(rep.segments[0].from), txt(t0), 'the first segment starts at t0')
  eq(txt(rep.segments[rep.segments.length - 1].to), txt(t1), 'the last segment ends at t1')
  for (let k = 0; k + 1 < rep.segments.length; k++) eq(txt(rep.segments[k].to), txt(rep.segments[k + 1].from), 'segments are contiguous')
  // direction and pace at sample points, in exact arithmetic
  for (let k = 0; k < 40; k++) {
    const x = D.ratAdd(t0, D.ratMul(D.ratSub(t1, t0), R(rnd(1, 999), 1000)))
    const seg = rep.segments.find((sg) => num(sg.from) <= num(x) && num(x) <= num(sg.to))
    if (!seg) {
      fail('a sample point is in no segment')
      continue
    }
    const nearBreak = rep.segments.some((sg) => Math.abs(num(sg.from) - num(x)) < 1e-6 || Math.abs(num(sg.to) - num(x)) < 1e-6)
    if (nearBreak) continue
    const v = num(D.evalPoly(m.v, x))
    const a = num(D.evalPoly(m.a, x))
    eq(seg.vSign, v > 0 ? 1 : v < 0 ? -1 : 0, 'sign of v in its segment')
    eq(seg.aSign, a > 0 ? 1 : a < 0 ? -1 : 0, 'sign of a in its segment')
    const h = R(1, 1000000)
    const faster = Math.abs(num(D.evalPoly(m.v, D.ratAdd(x, h)))) - Math.abs(num(D.evalPoly(m.v, D.ratSub(x, h))))
    if (Math.abs(faster) > 1e-9) eq(seg.pace, faster > 0 ? 'up' : 'down', `pace in a segment (v = ${v}, a = ${a})`)
  }
  // turning points against sign changes of v on a fine grid
  let changes = 0
  let prev = 0
  const N = 3000
  const fv = fl(m.v)
  const fs_ = fl(s)
  for (let k = 0; k <= N; k++) {
    const x = num(t0) + ((num(t1) - num(t0)) * k) / N
    const v = fv(x)
    const sgn = v > 0 ? 1 : v < 0 ? -1 : 0
    if (sgn !== 0 && prev !== 0 && sgn !== prev) changes++
    if (sgn !== 0) prev = sgn
  }
  const vroots = D.realRoots(m.v, t0, t1).map((r) => num(D.rootPoint(r)))
  let tight = false
  for (let a = 0; a < vroots.length; a++) for (let b = a + 1; b < vroots.length; b++) if (Math.abs(vroots[a] - vroots[b]) < 0.02) tight = true
  if (!tight) eq(rep.turns.length, changes, 'turning points equal sign changes of v')
  // total distance against a fine polyline
  let poly = 0
  let last = fs_(num(t0))
  const M = 20000
  for (let k = 1; k <= M; k++) {
    const x = num(t0) + ((num(t1) - num(t0)) * k) / M
    const y = fs_(x)
    poly += Math.abs(y - last)
    last = y
  }
  eq(Math.abs(poly - rep.distance) <= 1e-3 * Math.max(1, poly), true, `total distance ${rep.distance} vs polyline ${poly}`)
  eq(rep.distance + 1e-9 >= Math.abs(num(rep.displacement)), true, 'distance is at least the size of the displacement')
}

/* --------------------------------------------------------- 3. thrown upward */
for (let i = 0; i < 800; i++) {
  const v0 = R(rnd(1, 80), rnd(1, 4))
  const g = R(rnd(1, 30), rnd(1, 3))
  const th = D.throwUp(v0, g)
  const m = D.motionOf(th.s)
  eq(txt(D.evalPoly(m.v, th.top)), '0/1', 'the velocity is zero at the top')
  eq(txt(D.evalPoly(th.s, th.top)), txt(th.height), 'the height at the top')
  eq(txt(D.evalPoly(th.s, th.landing)), '0/1', 'it is back at the ground')
  eq(txt(D.evalPoly(m.v, th.landing)), txt(D.ratSub(R(0), v0)), 'it lands at the speed it left with, downward')
  eq(txt(D.evalPoly(m.a, R(1, 3))), txt(D.ratSub(R(0), g)), 'the acceleration is −g')
  eq(txt(th.landing), txt(D.ratMul(R(2), th.top)), 'the way down takes as long as the way up')
  const rep = D.analyzeMotion(m, R(0), th.landing)
  eq(rep.turns.length, 1, 'one turn')
  eq(Math.abs(num(rep.turns[0]) - num(th.top)) < 1e-9, true, 'the turn is the top')
  eq(Math.abs(rep.distance - 2 * num(th.height)) < 1e-6 * Math.max(1, rep.distance), true, 'up and down is twice the height')
  eq(txt(rep.displacement), '0/1', 'the displacement over the whole flight is zero')
}
// the chapter's rock: 49 m/s with g = 9.8
{
  const th = D.throwUp(R(49), R(98, 10))
  eq(txt(th.top), '5/1', 'rock: top at 5 s')
  eq(txt(th.height), '245/2', 'rock: 122.5 m')
  eq(txt(th.landing), '10/1', 'rock: lands at 10 s')
  const m = D.motionOf(th.s)
  eq(txt(D.evalPoly(th.s, R(2))), '392/5', 'rock: 78.4 m after 2 s')
  eq(txt(D.evalPoly(th.s, R(8))), '392/5', 'rock: 78.4 m after 8 s')
  eq(txt(D.evalPoly(m.v, R(2))), '147/5', 'rock: 29.4 m/s up')
  eq(txt(D.evalPoly(m.v, R(8))), '-147/5', 'rock: 29.4 m/s down')
}

/* ------------------------------------------------------------ 4. marginals */
for (let i = 0; i < 3000; i++) {
  const deg = rnd(1, 4)
  const c = Array.from({ length: deg + 1 }, () => R(rnd(-9, 9), rnd(1, 3)))
  if (c[deg].n === 0n) c[deg] = R(1)
  const x = R(rnd(-5, 20), rnd(1, 2))
  const mg = D.marginalAt(c, x)
  const g = D.shift(c, x) // c(x + h) = g0 + g1 h + g2 h² + …
  let tail = R(0)
  for (let k = 2; k < g.length; k++) tail = D.ratAdd(tail, g[k])
  eq(txt(D.ratSub(mg.next, mg.marginal)), txt(tail), 'next unit minus marginal is the sum of the higher Taylor terms')
  eq(txt(mg.marginal), txt(D.slopeAt(c, x)), 'marginal cost is the slope')
  if (x.n !== 0n) eq(txt(mg.average), txt(D.ratDiv(D.evalPoly(c, x), x)), 'average cost')
  else eq(mg.average, null, 'no average cost at 0')
}
// the chapter's radiators
{
  const c = P(0, 15, -6, 1)
  const r = P(0, 12, -3, 1)
  const mc = D.marginalAt(c, R(10))
  eq(txt(mc.marginal), '195/1', 'radiators: marginal cost 195')
  eq(txt(mc.next), '220/1', 'radiators: the 11th costs 220')
  eq(txt(D.marginalAt(r, R(10)).marginal), '252/1', 'radiators: marginal revenue 252')
  eq(txt(D.marginalAt(r, R(10)).next), '280/1', 'radiators: the 11th brings 280')
  eq(txt(D.ratSub(D.marginalAt(r, R(10)).marginal, mc.marginal)), '57/1', 'radiators: estimated profit 57')
}
for (let i = 0; i < 1500; i++) {
  const c = Array.from({ length: rnd(2, 4) }, () => R(rnd(-6, 6), rnd(1, 2)))
  const r = Array.from({ length: rnd(2, 4) }, () => R(rnd(-6, 6), rnd(1, 2)))
  const roots = D.breakEvenMarginal(c, r)
  if (!roots) continue
  const profit = D.profitOf(c, r)
  for (const x of roots) eq(txt(D.evalPoly(D.derivative(r), x)), txt(D.evalPoly(D.derivative(c), x)), 'marginal revenue equals marginal cost')
  for (const x of roots) eq(txt(D.evalPoly(D.derivative(profit), x)), '0/1', 'marginal profit is zero there')
}

/* ------------------------------------------------------------ 5. geometry */
for (const g of D.GEO) {
  for (let k = 0; k < 300; k++) {
    const x = 0.2 + Math.random() * 9
    const h = 1e-6
    const central = (g.f(x + h) - g.f(x - h)) / (2 * h)
    eq(Math.abs(central - g.df(x)) / Math.max(1, Math.abs(g.df(x))) < 1e-6, true, `${g.id}: derivative at ${x}`)
  }
}
const geo = (id) => D.GEO.find((g) => g.id === id)
for (const r of [0.5, 1, 2, 3.7]) {
  eq(Math.abs(geo('circle-r').df(r) - 2 * Math.PI * r) < 1e-12, true, 'dA/dr is the circumference')
  eq(Math.abs(geo('sphere-r').df(r) - 4 * Math.PI * r * r) < 1e-12, true, 'dV/dr is the surface area')
  eq(Math.abs(geo('cube').df(r) - 3 * r * r) < 1e-12, true, 'dV/da of a cube')
  eq(Math.abs(geo('circle-d').df(2 * r) * 2 - geo('circle-r').df(r)) < 1e-9, true, 'dA/dr = 2 dA/dD at D = 2r')
}

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`rates check ok — ${checks} checks (Sturm roots against built roots and grid scans, motion classification in exact arithmetic, total distance against a fine polyline, throws in closed form, marginal cost against the next unit, geometric rates against central differences)`)
