/** Checks src/lib/quadrilateral.ts, the engine behind the "Quadrilaterals"
 *  article's widgets (classifying four points, area, symmetry).
 *
 *  Three independent checks:
 *   1. Hand-written shapes: every school type, a dart, a bow-tie, a degenerate one.
 *   2. Similarity invariance: rotate (by a Pythagorean angle), scale and translate
 *      each shape with exact fractions; the type, the symmetry and the properties
 *      must not change, and the area must scale by the square of the factor.
 *   3. Random quadrilaterals: the shoelace area against two triangles for a convex
 *      shape, and the logical rules between the properties (a square is a rhombus
 *      and a rectangle, a parallelogram has equal opposite sides, and so on).
 *
 *  Run: npm run check:quadrilateral   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'quad-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(entry, `export * from '${path.join(ROOT, 'src/lib/quadrilateral.ts').replace(/\\/g, '/')}'\nexport { ratAdd, ratMul, ratSub } from '${path.join(ROOT, 'src/lib/rationals.ts').replace(/\\/g, '/')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const Q = await import('file://' + out.replace(/\\/g, '/'))

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
const R = (n, d = 1) => Q.rat(B(n), B(d))
const txt = (r) => `${r.n}/${r.d}`
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const P = (list) => list.map(([x, y]) => Q.pt(x, y))

/* ------------------------------------------------------------------ 1. shapes */
const SHAPES = {
  square: { pts: [[0, 0], [4, 0], [4, 4], [0, 4]], lines: 4, rot: 4, area: '16/1', names: 'parallelogram rectangle rhombus kite square' },
  rectangle: { pts: [[0, 0], [6, 0], [6, 4], [0, 4]], lines: 2, rot: 2, area: '24/1', names: 'parallelogram rectangle' },
  rhombus: { pts: [[4, 0], [8, 3], [4, 6], [0, 3]], lines: 2, rot: 2, area: '24/1', names: 'parallelogram rhombus kite' },
  parallelogram: { pts: [[0, 0], [6, 0], [8, 4], [2, 4]], lines: 0, rot: 2, area: '24/1', names: 'parallelogram' },
  kite: { pts: [[0, 0], [3, 2], [0, 7], [-3, 2]], lines: 1, rot: 1, area: '21/1', names: 'kite' },
  'isosceles-trapezoid': { pts: [[0, 0], [8, 0], [6, 4], [2, 4]], lines: 1, rot: 1, area: '24/1', names: 'trapezoid isosceles-trapezoid' },
  trapezoid: { pts: [[0, 0], [8, 0], [5, 4], [1, 4]], lines: 0, rot: 1, area: '24/1', names: 'trapezoid' },
}
for (const [name, s] of Object.entries(SHAPES)) {
  const r = Q.classify(P(s.pts))
  eq(r.shape, name, `${name}: shape`)
  eq(r.names.join(' '), s.names, `${name}: names`)
  eq(r.lines, s.lines, `${name}: lines of symmetry`)
  eq(r.rotation, s.rot, `${name}: rotation order`)
  eq(txt(r.area), s.area, `${name}: area`)
  eq(r.convex, true, `${name}: convex`)
}
const dart = Q.classify(P([[0, 0], [4, 2], [0, 4], [1, 2]]))
eq(dart.shape, 'dart', 'a concave kite is a dart')
eq(dart.convex, false, 'a dart is concave')
eq(txt(dart.area), '6/1', 'dart area')
eq(Q.classify(P([[0, 0], [6, 0], [4, 6], [3, 1]])).shape, 'concave', 'a concave quadrilateral')
eq(Q.classify(P([[0, 0], [4, 4], [4, 0], [0, 4]])).shape, 'crossed', 'a bow-tie')
eq(Q.classify(P([[0, 0], [1, 0], [2, 0], [3, 0]])).shape, 'degenerate', 'four collinear points')
eq(Q.classify(P([[0, 0], [4, 0], [8, 0], [4, 4]])).shape, 'degenerate', 'three collinear points make a triangle')
eq(Q.classify(P([[0, 0], [0, 0], [4, 0], [4, 4]])).shape, 'degenerate', 'a repeated point')
eq(Q.classify(P([[0, 0], [5, 1], [6, 5], [-1, 3]])).shape, 'convex', 'a generic convex quadrilateral')
eq(Q.classify(P([[0, 0], [5, 1], [6, 5], [-1, 3]])).lines, 0, 'a generic quadrilateral has no symmetry')
// The classifier does not depend on which vertex is named first, or the direction round.
const sq = SHAPES.parallelogram.pts
for (let k = 0; k < 4; k++) {
  const rot = [0, 1, 2, 3].map((i) => sq[(i + k) % 4])
  eq(Q.classify(P(rot)).shape, 'parallelogram', `starting at vertex ${k}`)
  eq(Q.classify(P(rot.slice().reverse())).shape, 'parallelogram', `reversed from vertex ${k}`)
}
eq(txt(Q.shoelaceTerms(P([[0, 0], [6, 0], [6, 4], [2, 6]])).sum), '52/1', 'shoelace sum of the lesson example')
eq(txt(Q.area(P([[0, 0], [6, 0], [6, 4], [2, 6]]))), '26/1', 'area of the lesson example')
eq(txt(Q.distSq(Q.pt(0, 0), Q.pt(9, 12))), '225/1', 'diagonal of a 9 by 12 rectangle squared')
const ang = Q.anglesDeg(P(SHAPES.square.pts)).map((a) => Math.round(a))
eq(ang.join(), '90,90,90,90', 'angles of a square')
const angp = Q.anglesDeg(P(SHAPES.parallelogram.pts)).map((a) => Math.round(a * 100) / 100)
eq(angp[0] + angp[1], 180, 'consecutive angles of a parallelogram add to 180')
eq(Math.round(Q.anglesDeg(P([[0, 0], [5, 1], [6, 5], [-1, 3]])).reduce((s, a) => s + a, 0)), 360, 'angles of a convex quadrilateral add to 360')
eq(Math.round(Q.anglesDeg(P([[0, 0], [4, 2], [0, 4], [1, 2]])).reduce((s, a) => s + a, 0)), 360, 'angles of a dart add to 360')

/* -------------------------------------------------------- 2. similarity invariance */
const ANGLES = [
  [R(1), R(0)],
  [R(3, 5), R(4, 5)],
  [R(5, 13), R(12, 13)],
  [R(8, 17), R(15, 17)],
  [R(0), R(1)],
  [R(-4, 5), R(3, 5)],
]
for (let i = 0; i < 1500; i++) {
  const [name, s] = Object.entries(SHAPES)[rnd(0, 6)]
  const [c, sn] = ANGLES[rnd(0, ANGLES.length - 1)]
  const k = R(rnd(1, 9), rnd(1, 6))
  const moved = Q.similarity(P(s.pts), c, sn, k, R(rnd(-20, 20), rnd(1, 4)), R(rnd(-20, 20), rnd(1, 4)))
  const r = Q.classify(moved)
  eq(r.shape, name, `${name} moved`)
  eq(r.lines, s.lines, `${name} moved: lines`)
  eq(r.rotation, s.rot, `${name} moved: rotation`)
  const want = Q.ratMul(Q.ratMul(k, k), Q.classify(P(s.pts)).area)
  eq(txt(r.area), txt(want), `${name} moved: area scales by k^2`)
}

/* ----------------------------------------------- 3. random quadrilaterals, rules */
const seen = {}
for (let i = 0; i < 20000; i++) {
  const pts = P([0, 1, 2, 3].map(() => [rnd(-4, 4), rnd(-4, 4)]))
  const r = Q.classify(pts)
  seen[r.shape] = (seen[r.shape] ?? 0) + 1
  if (r.shape === 'degenerate' || r.shape === 'crossed') continue
  const [A, Bp, C, D] = pts
  // The shoelace area of a simple polygon is the sum of the two triangles of a diagonal that lies inside it.
  const tri = (p, q, s) => {
    const cr = Q.ratSub(Q.ratMul(Q.ratSub(q.x, p.x), Q.ratSub(s.y, p.y)), Q.ratMul(Q.ratSub(q.y, p.y), Q.ratSub(s.x, p.x)))
    return R(cr.n < 0n ? -cr.n : cr.n, 2n * cr.d)
  }
  if (r.convex) eq(txt(r.area), txt(Q.ratAdd(tri(A, Bp, C), tri(A, C, D))), `area as two triangles ${A.x.n},${A.y.n}...`)
  else {
    // A concave quadrilateral has one inside diagonal: one of the two splittings gives the area.
    const s1 = Q.ratAdd(tri(A, Bp, C), tri(A, C, D))
    const s2 = Q.ratAdd(tri(A, Bp, D), tri(Bp, C, D))
    eq(txt(r.area) === txt(s1) || txt(r.area) === txt(s2), true, 'concave area is one of the two triangulations')
  }
  if (!r.convex) continue
  const has = (n) => r.names.includes(n)
  if (has('square')) eq(has('rectangle') && has('rhombus') && has('parallelogram') && has('kite'), true, 'a square is a rectangle, a rhombus, a parallelogram and a kite')
  if (has('rectangle')) eq(r.rightAngles === 4 && r.diagonalsEqual && r.diagonalsBisect && r.oppositeSidesEqual, true, 'rectangle properties')
  if (has('rhombus')) eq(r.allSidesEqual && r.diagonalsPerpendicular && r.diagonalsBisect, true, 'rhombus properties')
  if (has('parallelogram')) eq(r.parallelPairs === 2 && r.oppositeSidesEqual && r.diagonalsBisect, true, 'parallelogram properties')
  if (has('kite')) eq(r.diagonalsPerpendicular, true, 'a kite has perpendicular diagonals')
  if (r.parallelPairs === 2) eq(has('parallelogram'), true, 'two parallel pairs make a parallelogram')
  if (r.diagonalsBisect) eq(r.parallelPairs, 2, 'diagonals that bisect each other make a parallelogram')
  if (has('isosceles-trapezoid')) eq(r.parallelPairs === 1 && r.diagonalsEqual && r.lines === 1, true, 'isosceles trapezoid properties')
  if (r.rotation === 4) eq(r.shape, 'square', 'rotation of order 4 is a square')
  if (r.lines >= 1 && r.shape === 'convex') fail(`a symmetric shape is classified as plain convex: ${JSON.stringify(pts.map((p) => [txt(p.x), txt(p.y)]))}`)
}
for (const k of ['square', 'rectangle', 'rhombus', 'parallelogram', 'kite', 'isosceles-trapezoid', 'trapezoid', 'dart', 'concave', 'crossed', 'degenerate', 'convex']) eq((seen[k] ?? 0) > 0, true, `the random search met a ${k}`)

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`quadrilateral check ok — ${checks} checks (every type, similarity invariance, random shapes against triangle areas and logical rules)`)
