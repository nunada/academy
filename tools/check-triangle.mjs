/** Checks src/lib/triangle.ts, the engine behind the "Triangles" article's widgets.
 *
 *  Independent references, so nothing is checked against itself:
 *   1. Hand-written triangles (3-4-5, 13-14-15 with area 84, a right triangle's centers).
 *   2. The triangle inequality, enumerated over every triple of small whole numbers, and the
 *      acute/right/obtuse test against floating-point angles from the law of cosines.
 *   3. Heron's formula against 16K² = 4pq − (p+q−r)² and against the shoelace area of real points.
 *   4. Exact geometry of the centers: the circumcenter is equidistant from the vertices, the
 *      orthocenter lies on every altitude, and the Euler line O, G, H is a line with OG:GH = 1:2.
 *   5. Similarity invariance with rational rotations: kinds are kept, areas scale by k².
 *   6. Pythagorean triples by Euclid's formula against brute force.
 *   7. The law of sines and cosines solvers round-trip, and the ambiguous SSA case against the
 *      positive roots of the quadratic it comes from.
 *
 *  Run: npm run check:triangle   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tri-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(
  entry,
  `export * from '${p('src/lib/triangle.ts')}'\nexport { ratAdd, ratMul, ratSub, ratDiv } from '${p('src/lib/rationals.ts')}'\nexport { gcd } from '${p('src/lib/realnum.ts')}'\nexport { pt, area as polygonArea } from '${p('src/lib/quadrilateral.ts')}'`,
)
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
const close = (got, want, what, tol = 1e-9) => {
  checks++
  if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) fail(`${what}: got ${got}, want ${want}`)
}
const B = BigInt
const R = (n, d = 1) => T.rat(B(n), B(d))
const txt = (r) => `${r.n}/${r.d}`
const num = (r) => Number(r.n) / Number(r.d)
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const P = (x, y) => T.pt(x, y)
const dot = (u, v) => T.ratAdd(T.ratMul(u.x, v.x), T.ratMul(u.y, v.y))
const sub = (a, b) => ({ x: T.ratSub(a.x, b.x), y: T.ratSub(a.y, b.y) })
const crs = (u, v) => T.ratSub(T.ratMul(u.x, v.y), T.ratMul(u.y, v.x))

/* ------------------------------------------------------------------ 1. by hand */
const kinds = (a, b, c) => {
  const r = T.fromSides(R(a), R(b), R(c))
  return r ? `${r.kinds.sides} ${r.kinds.angles}` : 'none'
}
eq(kinds(3, 4, 5), 'scalene right', '3-4-5')
eq(kinds(6, 8, 10), 'scalene right', '6-8-10')
eq(kinds(5, 5, 5), 'equilateral acute', '5-5-5')
eq(kinds(5, 5, 6), 'isosceles acute', '5-5-6')
eq(kinds(5, 5, 8), 'isosceles obtuse', '5-5-8')
eq(kinds(2, 3, 4), 'scalene obtuse', '2-3-4')
eq(kinds(1, 1, 2), 'none', '1-1-2 is flat')
eq(kinds(1, 2, 3), 'none', '1-2-3 is flat')
eq(kinds(1, 2, 4), 'none', '1-2-4 breaks the inequality')
eq(kinds(7, 7, 7), 'equilateral acute', '7-7-7')
eq(T.fromSides(R(5), R(5), R(5)).kinds.sides, 'equilateral', 'equilateral')
const t13 = T.fromSides(R(13), R(14), R(15))
eq(txt(t13.areaSq), '7056/1', '13-14-15: K squared')
eq(txt(t13.s), '21/1', '13-14-15: semiperimeter')
eq(txt(t13.inradiusSq), '16/1', '13-14-15: inradius is 4')
eq(txt(t13.circumradiusSq), '4225/64', '13-14-15: circumradius is 65/8')
eq(txt(T.fromSides(R(1, 2), R(1, 2), R(1, 2)).areaSq), '3/256', 'equilateral with side 1/2: K squared is 3/256')
const rt = T.fromPoints(P(0, 0), P(6, 0), P(0, 8))
eq(rt.kinds.angles, 'right', 'right triangle by points')
eq(`${txt(rt.circumcenter.x)},${txt(rt.circumcenter.y)}`, '3/1,4/1', 'right triangle: circumcenter is the hypotenuse midpoint')
eq(`${txt(rt.orthocenter.x)},${txt(rt.orthocenter.y)}`, '0/1,0/1', 'right triangle: orthocenter is the right-angle vertex')
eq(`${txt(rt.centroid.x)},${txt(rt.centroid.y)}`, '2/1,8/3', 'right triangle: centroid')
eq(txt(rt.area), '24/1', 'right triangle: area')
eq(txt(rt.circumradiusSq), '25/1', 'right triangle: circumradius is 5')
close(rt.inradius, 2, 'right triangle: inradius (6 + 8 - 10) / 2')
close(rt.incenter[0], 2, 'right triangle: incenter x')
close(rt.incenter[1], 2, 'right triangle: incenter y')
eq(T.fromPoints(P(0, 0), P(1, 1), P(2, 2)), null, 'collinear points')
eq(T.fromPoints(P(0, 0), P(0, 0), P(2, 2)), null, 'repeated point')
const sq3 = T.sqrtParts(R(12))
eq(`${txt(sq3.k)} ${sq3.m}`, '2/1 3', 'sqrt 12 = 2 sqrt 3')
const sq4 = T.sqrtParts(R(3, 4))
eq(`${txt(sq4.k)} ${sq4.m}`, '1/2 3', 'sqrt(3/4) = (1/2) sqrt 3')
const sq5 = T.sqrtParts(R(2, 9))
eq(`${txt(sq5.k)} ${sq5.m}`, '1/3 2', 'sqrt(2/9) = (1/3) sqrt 2')

/* --------------------------------------- 2. the triangle inequality, enumerated */
for (let a = 1; a <= 14; a++)
  for (let b = 1; b <= 14; b++)
    for (let c = 1; c <= 14; c++) {
      const r = T.fromSides(R(a), R(b), R(c))
      const xs = [a, b, c].sort((x, y) => x - y)
      const ok = xs[0] + xs[1] > xs[2]
      eq(r !== null, ok, `triangle inequality ${a},${b},${c}`)
      if (!r) continue
      // The exact kind against floating-point angles from the law of cosines.
      const maxAngle = Math.max(...r.angles)
      const exactRight = xs[0] ** 2 + xs[1] ** 2 === xs[2] ** 2
      if (exactRight) close(maxAngle, 90, `right angle ${a},${b},${c}`)
      else eq(r.kinds.angles === 'obtuse', maxAngle > 90, `obtuse ${a},${b},${c}`)
      close(r.angles[0] + r.angles[1] + r.angles[2], 180, `angle sum ${a},${b},${c}`)
      const equal = (a === b ? 1 : 0) + (b === c ? 1 : 0) + (a === c ? 1 : 0)
      eq(r.kinds.sides, equal === 3 ? 'equilateral' : equal === 1 ? 'isosceles' : 'scalene', `sides ${a},${b},${c}`)
      // Heron against the squares-only form.
      eq(txt(r.areaSq), txt(T.ratDiv(T.sixteenAreaSq(R(a * a), R(b * b), R(c * c)), R(16))), `K squared ${a},${b},${c}`)
      eq(txt(r.areaSq), txt(T.heronAreaSq(R(a), R(b), R(c))), `Heron ${a},${b},${c}`)
      // r s = K and abc = 4 R K, in floating point.
      const K = Math.sqrt(num(r.areaSq))
      close(Math.sqrt(num(r.inradiusSq)) * num(r.s), K, `r s = K ${a},${b},${c}`)
      close((a * b * c) / (4 * K), Math.sqrt(num(r.circumradiusSq)), `R = abc/4K ${a},${b},${c}`)
    }

/* --------------------------------------------- 3 and 4. real points, exact centers */
let seenKinds = {}
for (let i = 0; i < 20000; i++) {
  const A = P(rnd(-9, 9), rnd(-9, 9))
  const Bp = P(rnd(-9, 9), rnd(-9, 9))
  const C = P(rnd(-9, 9), rnd(-9, 9))
  const r = T.fromPoints(A, Bp, C)
  const collinear = crs(sub(Bp, A), sub(C, A)).n === 0n
  eq(r === null, collinear, 'collinear points have no triangle')
  if (!r) continue
  seenKinds[`${r.kinds.sides} ${r.kinds.angles}`] = true
  // Area: shoelace against half the cross product, against 16K² of the squared sides.
  const cr = crs(sub(Bp, A), sub(C, A))
  eq(txt(r.area), txt(T.ratDiv({ n: cr.n < 0n ? -cr.n : cr.n, d: cr.d }, R(2))), 'area is half the cross product')
  eq(txt(T.ratMul(r.area, r.area)), txt(T.ratDiv(T.sixteenAreaSq(...r.sideSq), R(16))), 'K squared from the points and from the squared sides')
  // The circumcenter is equidistant from the three vertices.
  const O = r.circumcenter
  const d2 = (X) => T.ratAdd(T.ratMul(T.ratSub(O.x, X.x), T.ratSub(O.x, X.x)), T.ratMul(T.ratSub(O.y, X.y), T.ratSub(O.y, X.y)))
  eq(txt(d2(A)), txt(d2(Bp)), 'circumcenter: OA = OB')
  eq(txt(d2(A)), txt(d2(C)), 'circumcenter: OA = OC')
  eq(txt(d2(A)), txt(r.circumradiusSq), 'circumradius squared')
  // The orthocenter lies on the altitudes: AH is perpendicular to BC, and so on.
  const H = r.orthocenter
  eq(dot(sub(H, A), sub(Bp, C)).n, 0n, 'orthocenter: AH is perpendicular to BC')
  eq(dot(sub(H, Bp), sub(C, A)).n, 0n, 'orthocenter: BH is perpendicular to CA')
  eq(dot(sub(H, C), sub(A, Bp)).n, 0n, 'orthocenter: CH is perpendicular to AB')
  // The centroid is the mean of the vertices and splits O to H in the ratio 1 : 2 (the Euler line).
  const G = r.centroid
  eq(txt(T.ratMul(R(3), G.x)), txt(T.ratAdd(T.ratAdd(A.x, Bp.x), C.x)), 'centroid x')
  eq(txt(T.ratMul(R(3), G.y)), txt(T.ratAdd(T.ratAdd(A.y, Bp.y), C.y)), 'centroid y')
  eq(crs(sub(G, O), sub(H, O)).n, 0n, 'Euler line: O, G, H are collinear')
  eq(txt(T.ratMul(R(3), sub(G, O).x)), txt(sub(H, O).x), 'Euler line: OH = 3 OG (x)')
  eq(txt(T.ratMul(R(3), sub(G, O).y)), txt(sub(H, O).y), 'Euler line: OH = 3 OG (y)')
  // The incenter is the same distance from all three side lines, and that distance is the inradius.
  const [ix, iy] = r.incenter
  const distLine = (P1, P2) => {
    const dx = num(P2.x) - num(P1.x)
    const dy = num(P2.y) - num(P1.y)
    return Math.abs(dx * (num(P1.y) - iy) - dy * (num(P1.x) - ix)) / Math.hypot(dx, dy)
  }
  close(distLine(A, Bp), r.inradius, 'incenter to AB', 1e-8)
  close(distLine(Bp, C), r.inradius, 'incenter to BC', 1e-8)
  close(distLine(C, A), r.inradius, 'incenter to CA', 1e-8)
  close(r.angles[0] + r.angles[1] + r.angles[2], 180, 'angle sum of points', 1e-9)
  // Kinds against floating point angles, away from exact ties.
  const mx = Math.max(...r.angles)
  if (r.kinds.angles === 'right') close(mx, 90, 'right angle from points', 1e-8)
  else eq(r.kinds.angles === 'obtuse', mx > 90, 'obtuse from points')
}
for (const k of ['scalene right', 'isosceles right', 'scalene acute', 'scalene obtuse', 'isosceles acute', 'isosceles obtuse', 'equilateral acute']) {
  // Equilateral cannot occur on integer lattice points; the others should.
  if (k !== 'equilateral acute') eq(!!seenKinds[k], true, `the random search met a ${k}`)
}
eq(!!seenKinds['equilateral acute'], false, 'no equilateral triangle has all its vertices on integer points')

/* ------------------------------------------------ 5. similarity invariance */
const ANGLES = [
  [R(1), R(0)],
  [R(3, 5), R(4, 5)],
  [R(5, 13), R(12, 13)],
  [R(8, 17), R(15, 17)],
  [R(0), R(1)],
  [R(-4, 5), R(3, 5)],
]
for (let i = 0; i < 3000; i++) {
  const base = [P(rnd(-9, 9), rnd(-9, 9)), P(rnd(-9, 9), rnd(-9, 9)), P(rnd(-9, 9), rnd(-9, 9))]
  const r0 = T.fromPoints(...base)
  if (!r0) continue
  const [c, s] = ANGLES[rnd(0, ANGLES.length - 1)]
  const k = R(rnd(1, 9), rnd(1, 6))
  const moved = T.similarity(base, c, s, k, R(rnd(-20, 20), rnd(1, 4)), R(rnd(-20, 20), rnd(1, 4)))
  const r1 = T.fromPoints(...moved)
  eq(`${r1.kinds.sides} ${r1.kinds.angles}`, `${r0.kinds.sides} ${r0.kinds.angles}`, 'kinds survive a similarity')
  eq(txt(r1.area), txt(T.ratMul(T.ratMul(k, k), r0.area)), 'area scales by k squared')
  eq(txt(r1.circumradiusSq), txt(T.ratMul(T.ratMul(k, k), r0.circumradiusSq)), 'circumradius squared scales by k squared')
  close(r1.angles[0], r0.angles[0], 'angles survive a similarity', 1e-7)
}

/* ------------------------------------------------ 6. Pythagorean triples */
const euclid = new Set()
for (let m = 2n; m <= 60n; m++)
  for (let n = 1n; n < m; n++) {
    const [a, b, c] = T.euclidTriple(m, n)
    eq(a * a + b * b, c * c, `Euclid triple m=${m} n=${n}`)
    const r = T.fromSides(T.rat(a, 1n), T.rat(b, 1n), T.rat(c, 1n))
    eq(r.kinds.angles, 'right', `Euclid triple is right-angled m=${m} n=${n}`)
    if (T.gcd(m, n) === 1n && (m - n) % 2n === 1n) {
      eq(T.gcd(T.gcd(a, b), c), 1n, `primitive m=${m} n=${n}`)
      const [x, y] = a < b ? [a, b] : [b, a]
      if (c <= 150n) euclid.add(`${x},${y},${c}`)
    }
  }
const brute = new Set()
for (let a = 1; a <= 150; a++)
  for (let b = a; b <= 150; b++) {
    const c = Math.round(Math.sqrt(a * a + b * b))
    if (c <= 150 && c * c === a * a + b * b && T.gcd(T.gcd(B(a), B(b)), B(c)) === 1n) brute.add(`${a},${b},${c}`)
  }
eq([...euclid].sort().join(';'), [...brute].sort().join(';'), 'primitive triples up to 150: Euclid against brute force')
eq(euclid.size > 20, true, 'a fair number of primitive triples were compared')

/* -------------------------------------- 7. the law of sines and cosines */
const near = (x, y, tol = 1e-8) => Math.abs(x - y) <= tol * Math.max(1, Math.abs(y))
const sameSolved = (s, t, what) => {
  for (const k of ['a', 'b', 'c', 'A', 'B', 'C']) close(s[k], t[k], `${what}: ${k}`, 1e-8)
}
const sinr = (d) => Math.sin((d * Math.PI) / 180)
const cosr = (d) => Math.cos((d * Math.PI) / 180)
for (let i = 0; i < 20000; i++) {
  const a = 0.5 + Math.random() * 20
  const b = 0.5 + Math.random() * 20
  const c = Math.abs(a - b) + 0.05 + Math.random() * (a + b - Math.abs(a - b) - 0.1)
  const truth = T.solveSSS(a, b, c)
  if (!truth) {
    fail(`SSS rejected a real triangle ${a} ${b} ${c}`)
    continue
  }
  close(truth.A + truth.B + truth.C, 180, 'SSS: angle sum')
  // Law of sines and law of cosines hold for the solved triangle.
  close(a / sinr(truth.A), b / sinr(truth.B), 'law of sines a/b', 1e-8)
  close(b / sinr(truth.B), c / sinr(truth.C), 'law of sines b/c', 1e-8)
  close(c * c, a * a + b * b - 2 * a * b * cosr(truth.C), 'law of cosines', 1e-8)
  sameSolved(T.solveSAS(a, truth.C, b), truth, 'SAS')
  sameSolved(T.solveASA(truth.A, c, truth.B), truth, 'ASA')
  sameSolved(T.solveAAS(truth.A, truth.B, a), truth, 'AAS')
  // SSA: every triangle with sides a, b and angle A opposite a is among the solutions.
  const sols = T.solveSSA(a, b, truth.A)
  // Independent count: the positive roots of c^2 - 2 b c cos A + b^2 - a^2 = 0.
  const cosA = cosr(truth.A)
  const disc = (b * cosA) ** 2 - (b * b - a * a)
  const roots = []
  if (disc >= -1e-12) {
    const sq = Math.sqrt(Math.max(0, disc))
    for (const rt of [b * cosA - sq, b * cosA + sq]) if (rt > 1e-9 && !roots.some((x) => near(x, rt, 1e-7))) roots.push(rt)
  }
  eq(sols.length, roots.length, `SSA solution count for a=${a} b=${b} A=${truth.A}`)
  eq(sols.some((s) => near(s.c, c, 1e-7)), true, 'SSA includes the true triangle')
  for (const s of sols) {
    close(s.A + s.B + s.C, 180, 'SSA: angle sum')
    close(s.a / sinr(s.A), s.b / sinr(s.B), 'SSA: law of sines', 1e-7)
    eq(roots.some((x) => near(x, s.c, 1e-6)), true, 'SSA solution is a root of the quadratic')
  }
}
// A few deliberate SSA cases.
eq(T.solveSSA(3, 5, 30).length, 2, 'a = 3, b = 5, A = 30: two triangles')
eq(T.solveSSA(2.5, 5, 30).length, 1, 'a = 2.5, b = 5, A = 30: exactly one (right) triangle')
eq(T.solveSSA(2, 5, 30).length, 0, 'a = 2, b = 5, A = 30: none')
eq(T.solveSSA(7, 5, 30).length, 1, 'a = 7, b = 5, A = 30: one triangle')
eq(T.solveSSA(5, 5, 100).length, 0, 'an isosceles obtuse base angle is impossible')
eq(T.solveSSS(1, 2, 3), null, 'SSS flat triangle')
eq(T.solveASA(100, 5, 80), null, 'ASA with two angles adding to 180')
eq(T.solveSAS(3, 180, 4), null, 'SAS with a straight angle')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`triangle check ok — ${checks} checks (hand answers, the triangle inequality, Heron against shoelace, exact centers and the Euler line, similarity, Euclid triples against brute force, law of sines and cosines)`)
