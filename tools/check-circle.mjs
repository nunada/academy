/** Checks src/lib/circle.ts, the engine behind the "Circles" article's widgets.
 *
 *  Independent references, so nothing is checked against itself:
 *   1. Hand-written circles: the general form, a point and a circle, a line in all three cases,
 *      the tangents from (13, 0) to the circle of radius 5 (length 12, the 5-12-13 triangle).
 *   2. Exact geometry on rational points of a circle (the parametrization
 *      ((1 − t²)/(1 + t²), 2t/(1 + t²)) gives them all): Thales' theorem, the circle through three of
 *      its points, the power of a point (the intersecting chords and secants theorem), a line through
 *      two points meeting the circle exactly there, and the tangent at a point.
 *   3. The tangents from an outside point against floating-point geometry.
 *   4. How two circles lie, against integer comparisons of d² with (r₁ ± r₂)².
 *   5. Sector identities, the inscribed angle theorem against vector angles, and Archimedes'
 *      polygon bounds against direct trigonometry and the known 96-gon values.
 *
 *  Run: npm run check:circle   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'circ-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(
  entry,
  `export * from '${p('src/lib/circle.ts')}'\nexport { ratAdd, ratMul, ratSub, ratDiv } from '${p('src/lib/rationals.ts')}'\nexport { pt, distSq } from '${p('src/lib/quadrilateral.ts')}'`,
)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const C = await import('file://' + out.replace(/\\/g, '/'))

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
const close = (got, want, what, tol = 1e-9) => {
  checks++
  if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) fail(`${what}: got ${got}, want ${want}`)
}
const B = BigInt
const R = (n, d = 1) => C.rat(B(n), B(d))
const txt = (r) => `${r.n}/${r.d}`
const num = (r) => Number(r.n) / Number(r.d)
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const PT = (x, y, d = 1) => ({ x: R(x, d), y: R(y, d) })
const add = (a, b) => C.ratAdd(a, b)
const sub = (a, b) => C.ratSub(a, b)
const mul = (a, b) => C.ratMul(a, b)
const dv = (a, b) => C.ratDiv(a, b)
const dotp = (u, v) => add(mul(u.x, v.x), mul(u.y, v.y))
const vec = (a, b) => ({ x: sub(b.x, a.x), y: sub(b.y, a.y) })
const crs = (u, v) => sub(mul(u.x, v.y), mul(u.y, v.x))
const ptxt = (q) => `${txt(q.x)},${txt(q.y)}`

/* ------------------------------------------------------------------ 1. by hand */
const c1 = C.circle(PT(3, -2), R(25))
const g = C.generalForm(c1)
eq(`${txt(g.D)} ${txt(g.E)} ${txt(g.F)}`, '-6/1 4/1 -12/1', 'general form of (x-3)^2+(y+2)^2=25')
const back = C.fromGeneral(g.D, g.E, g.F)
eq(`${ptxt(back.c)} ${txt(back.r2)}`, '3/1,-2/1 25/1', 'general form back to center and radius')
eq(C.fromGeneral(R(0), R(0), R(1)), null, 'x^2 + y^2 + 1 = 0 is empty')
eq(C.fromGeneral(R(0), R(0), R(0)), null, 'x^2 + y^2 = 0 is a single point')
eq(C.circle(PT(0, 0), R(0)), null, 'radius zero')
eq(C.position(c1, PT(0, 0)), 'inside', '(0,0) is inside')
eq(C.position(c1, PT(8, -2)), 'on', '(8,-2) is on the circle')
eq(C.position(c1, PT(9, 5)), 'outside', '(9,5) is outside')
eq(txt(C.power(c1, PT(0, 0))), '-12/1', 'power of (0,0)')
eq(txt(C.power(c1, PT(9, 5))), '60/1', 'power of (9,5)')
const c3 = C.throughThree(PT(0, 0), PT(6, 0), PT(0, 8))
eq(`${ptxt(c3.c)} ${txt(c3.r2)}`, '3/1,4/1 25/1', 'circle through (0,0), (6,0), (0,8)')
eq(C.throughThree(PT(0, 0), PT(1, 1), PT(2, 2)), null, 'collinear points have no circle')
const o = C.circle(PT(0, 0), R(25))
const sec = C.lineMeets(o, R(0), R(1), R(3))
eq(`${sec.kind} ${ptxt(sec.foot)} ${txt(sec.dSq)} ${txt(sec.sSq)}`, 'secant 0/1,3/1 9/1 16/1', 'the line y = 3 cuts the circle of radius 5')
const tan = C.lineMeets(o, R(1), R(0), R(5))
eq(`${tan.kind} ${ptxt(tan.foot)} ${txt(tan.sSq)}`, 'tangent 5/1,0/1 0/1', 'the line x = 5 touches it')
eq(C.lineMeets(o, R(1), R(0), R(6)).kind, 'none', 'the line x = 6 misses it')
eq(C.lineMeets(o, R(0), R(0), R(1)), null, 'a = b = 0 is not a line')
const tg = C.tangentsFrom(o, PT(13, 0))
eq(`${tg.kind} ${ptxt(tg.foot)} ${txt(tg.sSq)}`, 'secant 25/13,0/1 3600/28561', 'tangents from (13, 0): chord of contact')
eq(txt(C.power(o, PT(13, 0))), '144/1', 'the tangent length from (13, 0) is 12')
eq(C.tangentsFrom(o, PT(3, 0)), null, 'no tangents from an inside point')
eq(C.tangentsFrom(o, PT(5, 0)), null, 'a point on the circle is not "outside"')
// Relations of two circles of radii 3 and 5.
const rel = (d, r1 = 3, r2 = 5) => C.relation(C.circle(PT(0, 0), R(r1 * r1)), C.circle(PT(d, 0), R(r2 * r2)))
eq(rel(9), 'separate', 'd = 9')
eq(rel(8), 'external', 'd = 8')
eq(rel(5), 'secant', 'd = 5')
eq(rel(2), 'internal', 'd = 2')
eq(rel(1), 'contained', 'd = 1')
eq(rel(0), 'contained', 'concentric')
eq(rel(0, 4, 4), 'coincident', 'the same circle')
// Sectors.
const s90 = C.sectorOf(10, 90)
close(s90.arc, 5 * Math.PI, 'quarter arc')
close(s90.sector, 25 * Math.PI, 'quarter sector')
close(s90.chord, 10 * Math.SQRT2, 'quarter chord')
close(s90.segment, 25 * Math.PI - 50, 'quarter segment')
close(C.sectorOf(1, 360).sector, Math.PI, 'full circle sector is pi r^2')
close(C.sectorOf(1, 180).arc, Math.PI, 'half circle arc is pi r')
// Archimedes.
const h96 = C.polygonBounds(4)
eq(h96.n, 96, '96-gon')
close(h96.lower, 3.1410319508905096, '96-gon lower bound')
close(h96.upper, 3.1427145996453136, '96-gon upper bound')
eq(C.polygonBounds(0).lower, 3, 'hexagon lower bound is 3')
close(C.polygonBounds(0).upper, 2 * Math.sqrt(3), 'hexagon upper bound is 2 sqrt 3')

/* ------------------------------- 2. exact geometry on rational points of a circle */
// A rational point on the circle with center (h, k) and radius r from the parameter t = a/b.
const onCircle = (cc, r, a, b) => {
  const t = R(a, b)
  const t2 = mul(t, t)
  const den = add(R(1), t2)
  return {
    x: add(cc.x, mul(r, dv(sub(R(1), t2), den))),
    y: add(cc.y, mul(r, dv(mul(R(2), t), den))),
  }
}
const randT = () => [rnd(-9, 9), rnd(1, 9)]
for (let i = 0; i < 6000; i++) {
  const center = PT(rnd(-9, 9), rnd(-9, 9), rnd(1, 4))
  const r = R(rnd(1, 9), rnd(1, 4))
  const circ = C.circle(center, mul(r, r))
  const pts = [0, 1, 2, 3].map(() => onCircle(center, r, ...randT()))
  const [A, Bp, Cp, D] = pts
  for (const q of pts) eq(C.position(circ, q), 'on', 'a parametrized point lies on the circle')
  const same = (u, v) => txt(u.x) === txt(v.x) && txt(u.y) === txt(v.y)
  // The circle through three of its points is the circle.
  if (!same(A, Bp) && !same(A, Cp) && !same(Bp, Cp)) {
    const t3 = C.throughThree(A, Bp, Cp)
    if (t3) {
      eq(ptxt(t3.c), ptxt(center), 'circle through three points: center')
      eq(txt(t3.r2), txt(circ.r2), 'circle through three points: radius squared')
    }
  }
  // Thales: an angle in a semicircle is a right angle (exact dot product).
  const A2 = { x: sub(mul(R(2), center.x), A.x), y: sub(mul(R(2), center.y), A.y) } // the antipode of A
  if (!same(Bp, A) && !same(Bp, A2)) eq(txt(dotp(vec(Bp, A), vec(Bp, A2))), '0/1', 'Thales: the angle in a semicircle is 90 degrees')
  // The tangent at A: the line through A perpendicular to the radius touches the circle exactly at A.
  const a = sub(A.x, center.x)
  const b = sub(A.y, center.y)
  const tl = C.lineMeets(circ, a, b, add(mul(a, A.x), mul(b, A.y)))
  eq(tl.kind, 'tangent', 'tangent at a point')
  eq(ptxt(tl.foot), ptxt(A), 'tangent at a point: foot')
  // A line through two circle points meets the circle exactly there.
  if (!same(A, Bp)) {
    const la = sub(A.y, Bp.y)
    const lb = sub(Bp.x, A.x)
    const lk = add(mul(la, A.x), mul(lb, A.y))
    const m = C.lineMeets(circ, la, lb, lk)
    eq(m.kind, 'secant', 'line through two circle points is a secant')
    // A - foot is parallel to (-b, a) and has squared length s²(a² + b²).
    const dA = vec(m.foot, A)
    eq(txt(crs(dA, { x: sub(R(0), lb), y: la })), '0/1', 'chord point is foot plus a multiple of (-b, a)')
    eq(txt(dotp(dA, dA)), txt(mul(m.sSq, add(mul(la, la), mul(lb, lb)))), 'chord point: squared distance from the foot')
    const dB = vec(m.foot, Bp)
    eq(txt(dotp(dB, dB)), txt(dotp(dA, dA)), 'the foot is the midpoint of the chord (equal halves)')
    // The distance from the center to the chord: r² = d² + (half chord)².
    eq(txt(add(m.dSq, dv(dotp(vec(A, Bp), vec(A, Bp)), R(4)))), txt(circ.r2), 'half the chord and the distance to the center: Pythagoras')
  }
  // Power of a point: chords AB and CD (or their extensions) meet at P; PA·PB = PC·PD = |power|.
  const ab = vec(A, Bp)
  const cd = vec(Cp, D)
  const den = crs(ab, cd)
  if (den.n !== 0n && !same(A, Bp) && !same(Cp, D)) {
    const t = dv(crs(vec(A, Cp), cd), den)
    const P = { x: add(A.x, mul(t, ab.x)), y: add(A.y, mul(t, ab.y)) }
    const sq2 = (u, v) => dotp(vec(u, v), vec(u, v))
    const pw = C.power(circ, P)
    eq(txt(mul(sq2(P, A), sq2(P, Bp))), txt(mul(pw, pw)), 'power of a point: PA²·PB² = power²')
    eq(txt(mul(sq2(P, Cp), sq2(P, D))), txt(mul(pw, pw)), 'power of a point: PC²·PD² = power²')
  }
}

/* ---------------------------------------- 3. tangents from an outside point */
for (let i = 0; i < 3000; i++) {
  const center = PT(rnd(-9, 9), rnd(-9, 9))
  const r = rnd(1, 9)
  const circ = C.circle(center, R(r * r))
  const P = PT(rnd(-20, 20), rnd(-20, 20))
  const m = C.tangentsFrom(circ, P)
  const outside = C.position(circ, P) === 'outside'
  eq(m !== null, outside, 'tangents exist exactly from outside points')
  if (!m) continue
  eq(m.kind, 'secant', 'two tangent points')
  const a = sub(P.x, center.x)
  const b = sub(P.y, center.y)
  const tps = C.meetingPoints(m, a, b)
  eq(tps.length, 2, 'two tangent points drawn')
  const tl2 = num(C.power(circ, P))
  for (const [x, y] of tps) {
    close(Math.hypot(x - num(center.x), y - num(center.y)) ** 2, r * r, 'tangent point lies on the circle', 1e-9)
    // (T - C) is perpendicular to (T - P): the tangent line is perpendicular to the radius.
    close((x - num(center.x)) * (x - num(P.x)) + (y - num(center.y)) * (y - num(P.y)), 0, 'radius is perpendicular to the tangent', 1e-9)
    close((x - num(P.x)) ** 2 + (y - num(P.y)) ** 2, tl2, 'tangent length squared is the power', 1e-9)
  }
}

/* --------------------------------------------- 4. two circles against integers */
const seenRel = {}
for (let i = 0; i < 40000; i++) {
  const x1 = rnd(-6, 6)
  const y1 = rnd(-6, 6)
  const x2 = rnd(-6, 6)
  const y2 = rnd(-6, 6)
  const r1 = rnd(1, 9)
  const r2 = rnd(1, 9)
  const d2 = (x1 - x2) ** 2 + (y1 - y2) ** 2
  let want
  if (d2 === 0 && r1 === r2) want = 'coincident'
  else if (d2 > (r1 + r2) ** 2) want = 'separate'
  else if (d2 === (r1 + r2) ** 2) want = 'external'
  else if (d2 < (r1 - r2) ** 2) want = 'contained'
  else if (d2 === (r1 - r2) ** 2) want = 'internal'
  else want = 'secant'
  seenRel[want] = (seenRel[want] ?? 0) + 1
  eq(C.relation(C.circle(PT(x1, y1), R(r1 * r1)), C.circle(PT(x2, y2), R(r2 * r2))), want, `circles ${x1},${y1},${r1} and ${x2},${y2},${r2}`)
  // The relation is symmetric.
  eq(C.relation(C.circle(PT(x2, y2), R(r2 * r2)), C.circle(PT(x1, y1), R(r1 * r1))), want, 'relation is symmetric')
}
for (const k of ['coincident', 'separate', 'external', 'secant', 'internal', 'contained']) eq((seenRel[k] ?? 0) > 0, true, `the random search met ${k}`)

/* ----------------------------------------------- 5. angles, sectors, π */
for (let i = 0; i < 20000; i++) {
  const r = 0.5 + Math.random() * 20
  const deg = Math.random() * 360
  const s = C.sectorOf(r, deg)
  close(s.sector, (s.arc * r) / 2, 'sector = arc · r / 2', 1e-12)
  close(s.sector, (deg / 360) * Math.PI * r * r, 'sector = fraction of the disk', 1e-12)
  close(s.segment, s.sector - s.triangle, 'segment = sector − triangle', 1e-12)
  close(s.chord, 2 * r * Math.sin((deg * Math.PI) / 360), 'chord length', 1e-12)
  if (deg < 180) close(s.chord ** 2, 2 * r * r * (1 - Math.cos(s.radians)), 'law of cosines for the chord', 1e-9)
  // Inscribed angle theorem against the angle at P computed from vectors.
  const a = Math.random() * 360
  const b = Math.random() * 360
  const pp = Math.random() * 360
  const ia = C.inscribedAngles(a, b, pp)
  const pos = (t) => [Math.cos((t * Math.PI) / 180), Math.sin((t * Math.PI) / 180)]
  const [A, Bq, Pq] = [pos(a), pos(b), pos(pp)]
  const u = [A[0] - Pq[0], A[1] - Pq[1]]
  const v = [Bq[0] - Pq[0], Bq[1] - Pq[1]]
  const ang = (Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))))) * 180) / Math.PI
  close(ia.inscribed, ang, 'inscribed angle against vectors', 1e-6)
  close(ia.arc, 2 * ia.inscribed, 'intercepted arc is twice the inscribed angle', 1e-12)
  const oa = Math.acos(Math.max(-1, Math.min(1, A[0] * Bq[0] + A[1] * Bq[1]))) * 180 / Math.PI
  close(ia.central, oa, 'central angle against vectors', 1e-6)
  // Cyclic quadrilateral: A, P, B, Q with P and Q on opposite sides of AB have opposite angles summing to 180°.
  const q = Math.random() * 360
  const ip = C.inscribedAngles(a, b, pp).inscribed
  const iq = C.inscribedAngles(a, b, q).inscribed
  const ccw = (((b - a) % 360) + 360) % 360
  const inP = ((((pp - a) % 360) + 360) % 360) < ccw
  const inQ = ((((q - a) % 360) + 360) % 360) < ccw
  if (inP !== inQ) close(ip + iq, 180, 'cyclic quadrilateral: opposite angles add to 180', 1e-9)
  else close(ip, iq, 'angles in the same segment are equal', 1e-9)
}
// Thales as a special case: A and B opposite, any P gives 90 degrees.
for (let i = 0; i < 2000; i++) {
  const a = Math.random() * 360
  const pp = Math.random() * 360
  const ia = C.inscribedAngles(a, a + 180, pp)
  if (Math.abs((((pp - a) % 360) + 360) % 360 - 180) > 1e-6 && Math.abs((((pp - a) % 360) + 360) % 360) > 1e-6) close(ia.inscribed, 90, 'Thales: semicircle', 1e-9)
}
for (let k = 0; k <= 18; k++) {
  const b = C.polygonBounds(k)
  const nn = 6 * 2 ** k
  eq(b.n, nn, `polygon sides k=${k}`)
  close(b.lower, nn * Math.sin(Math.PI / nn), `lower bound k=${k}`, 1e-11)
  close(b.upper, nn * Math.tan(Math.PI / nn), `upper bound k=${k}`, 1e-9)
  if (k <= 12) eq(b.lower < Math.PI && Math.PI < b.upper, true, `pi is between the bounds k=${k}`)
  if (k > 0) {
    const prev = C.polygonBounds(k - 1)
    if (k <= 12) eq(b.lower > prev.lower && b.upper < prev.upper, true, `the bounds tighten k=${k}`)
  }
}
close(C.polygonBounds(10).upper - C.polygonBounds(10).lower, 0, 'the 6144-gon pins pi down to about 1e-6', 1e-5)

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`circle check ok — ${checks} checks (rational circle geometry: Thales, three points, tangents, chords, power of a point; two circles against integers; sectors; inscribed angles; Archimedes' bounds)`)
