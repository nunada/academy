/** Checks src/lib/cosinelaw.ts, the numbers behind the "Law of Cosines" article, and the SAS and SSS solvers of src/lib/triangle.ts.
 *
 *  References that do not use the code under test:
 *   1. Triangles built from coordinates and measured with distances and atan2: the third side from two sides and the angle between them, the angles
 *      from the three sides (by the arccosine and by the half-angle form), the median from the midpoint of a side, the area from the shoelace formula,
 *      and acute, right or obtuse from the exact squares of the sides (as fractions).
 *   2. Thin triangles (two long sides, a tiny third) with the angle from an arccosine at 60 digits (mpmath): the half-angle form must keep its
 *      digits, and the plain arccosine form must visibly lose them, which is the point of the section of the article.
 *   3. Two forces added as vectors, and a journey added up in east and north: the distance, the bearing of the end and the bearing back.
 *
 *  Run: npm run check:cosinelaw   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cosinelaw-'))
const out = path.join(tmp, 't.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/cosinelaw.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

const FAST = process.env.COSINELAW_FAST === '1'
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
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b))
const circ = (a, b) => Math.abs(((a - b + 540) % 360) - 180) // the distance between two bearings, round the circle

let seed = 20261029
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const between = (a, b) => a + rnd() * (b - a)
const pick = (l) => l[Math.floor(rnd() * l.length)]

/* ------------------------------------------------------------------------------------- the cases */
const triangles = []
while (triangles.length < (FAST ? 80 : 500)) {
  const P = [0, 1, 2].map(() => [Math.round(between(-12, 12) * 100) / 100, Math.round(between(-12, 12) * 100) / 100])
  const area2 = Math.abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1]))
  if (area2 > 1) triangles.push(P)
}
// right triangles, exactly: the vertex C at the origin, the sides along perpendicular directions with integer coordinates
for (const [u, v] of [[[3, 0], [0, 4]], [[5, 12], [-12, 5]], [[2, 1], [-1, 2]], [[8, 6], [-3, 4]], [[1, 1], [-1, 1]], [[7, 0], [0, 24]]]) triangles.push([u, v, [0, 0]])
// a few that are acute or obtuse by a hair
triangles.push([[0, 0], [10, 0], [0.01, 3]], [[0, 0], [10, 0], [-0.01, 3]])

const thin = []
for (const k of [2, 3, 4, 5, 6, 7, 8]) for (const c of [1, 0.5, 0.01]) thin.push({ a: 10 ** k, b: 10 ** k, c })
thin.push({ a: 1000, b: 999.9999, c: 0.0002 }, { a: 1e6, b: 1e6 + 0.5, c: 1 }, { a: 5, b: 5, c: 9.99999999 }, { a: 1, b: 1, c: 1.999999999 })

const forces = []
for (let i = 0; i < (FAST ? 40 : 200); i++) forces.push({ F1: Math.round(between(1, 100) * 10) / 10, F2: Math.round(between(1, 100) * 10) / 10, theta: pick([0, 30, 60, 90, 120, 150, 180, Math.round(between(1, 179))]) })

const trips = []
for (let i = 0; i < (FAST ? 80 : 400); i++) trips.push({ d1: Math.round(between(1, 200) * 10) / 10, b1: Math.round(between(0, 359)), d2: Math.round(between(1, 200) * 10) / 10, b2: Math.round(between(0, 359)) })
for (const b of [0, 45, 90, 180, 270, 350, 10]) for (const b2 of [0, 45, 90, 180, 270, 350, 10]) trips.push({ d1: 30, b1: b, d2: 40, b2 })
trips.push({ d1: 10, b1: 0, d2: 10, b2: 180 }, { d1: 10, b1: 90, d2: 25, b2: 270 }, { d1: 25, b1: 90, d2: 10, b2: 270 }, { d1: 10, b1: 350, d2: 10, b2: 10 })

const PY = String.raw`
import json, sys, math
from fractions import Fraction
import mpmath
from mpmath import mp, mpf
data = json.load(sys.stdin)
res = {}
def dist(p, q): return math.hypot(p[0] - q[0], p[1] - q[1])
def angle_at(p, q, r):
    a1 = math.atan2(q[1] - p[1], q[0] - p[0]); a2 = math.atan2(r[1] - p[1], r[0] - p[0])
    d = abs(a1 - a2)
    if d > math.pi: d = 2 * math.pi - d
    return math.degrees(d)

tri = []
for A, B, C in data['triangles']:
    a = dist(B, C); b = dist(A, C); c = dist(A, B)
    fr = lambda p, q: (Fraction(str(p[0])) - Fraction(str(q[0])))**2 + (Fraction(str(p[1])) - Fraction(str(q[1])))**2
    a2, b2, c2 = fr(B, C), fr(A, C), fr(A, B)
    big = max(a2, b2, c2); others = a2 + b2 + c2 - big
    kinds = {}
    for name, x2, y2, z2 in (('A', b2, c2, a2), ('B', a2, c2, b2), ('C', a2, b2, c2)):
        kinds[name] = 'right' if z2 == x2 + y2 else ('acute' if z2 < x2 + y2 else 'obtuse')
    midC = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)
    tri.append({'a': a, 'b': b, 'c': c, 'A': angle_at(A, B, C), 'B': angle_at(B, A, C), 'C': angle_at(C, A, B),
                'mc': dist(C, midC), 'area': abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2, 'kinds': kinds})
res['tri'] = tri

mp.dps = 60
res['thin'] = [float(mpmath.degrees(mpmath.acos((mpf(t['a'])**2 + mpf(t['b'])**2 - mpf(t['c'])**2) / (2 * mpf(t['a']) * mpf(t['b']))))) for t in data['thin']]
res['thinExact'] = [str(mpmath.degrees(mpmath.acos((mpf(t['a'])**2 + mpf(t['b'])**2 - mpf(t['c'])**2) / (2 * mpf(t['a']) * mpf(t['b']))))) for t in data['thin']]

fo = []
for f in data['forces']:
    th = math.radians(f['theta'])
    x = f['F1'] + f['F2'] * math.cos(th); y = f['F2'] * math.sin(th)
    fo.append({'size': math.hypot(x, y), 'dir': math.degrees(math.atan2(y, x))})
res['forces'] = fo

tr = []
for t in data['trips']:
    e1 = t['d1'] * math.sin(math.radians(t['b1'])); n1 = t['d1'] * math.cos(math.radians(t['b1']))
    e2 = t['d2'] * math.sin(math.radians(t['b2'])); n2 = t['d2'] * math.cos(math.radians(t['b2']))
    E = e1 + e2; N = n1 + n2
    d = math.hypot(E, N)
    tr.append({'d': d, 'direct': math.degrees(math.atan2(E, N)) % 360 if d > 1e-9 else None})
res['trips'] = tr
json.dump(res, sys.stdout)
`

const py = spawnSync('python', ['-X', 'utf8', '-c', PY], { input: JSON.stringify({ triangles, thin, forces, trips }), encoding: 'utf8', maxBuffer: 1 << 28, timeout: 590000 })
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)

/* ------------------------------------------------------------------- 1: measured triangles */
triangles.forEach((P, i) => {
  const r = R.tri[i]
  const L = `triangle ${i} (${r.a.toFixed(3)}, ${r.b.toFixed(3)}, ${r.c.toFixed(3)})`
  // the third side from the two others and the angle between them (each of the three sides in turn)
  ok(near(M.thirdSide(r.a, r.b, r.C), r.c, 1e-9) && near(M.thirdSide(r.b, r.c, r.A), r.a, 1e-9) && near(M.thirdSide(r.a, r.c, r.B), r.b, 1e-9), `${L}: the third side`)
  // the angles from the three sides, both forms
  for (const [x, y, z, ang] of [[r.b, r.c, r.a, r.A], [r.a, r.c, r.b, r.B], [r.a, r.b, r.c, r.C]]) {
    ok(near(M.angleStable(x, y, z), ang, 1e-8), `${L}: angleStable ${M.angleStable(x, y, z)} against ${ang}`)
    ok(Math.abs(M.angleNaive(x, y, z) - ang) < 1e-5, `${L}: angleNaive ${M.angleNaive(x, y, z)} against ${ang}`)
  }
  ok(near(M.angleStable(r.a, r.b, r.c) + M.angleStable(r.b, r.c, r.a) + M.angleStable(r.a, r.c, r.b), 180, 1e-9), `${L}: the angles add up to 180°`)
  // the kind of angle, from the exact squares
  for (const [x, y, z, k] of [[r.b, r.c, r.a, 'A'], [r.a, r.c, r.b, 'B'], [r.a, r.b, r.c, 'C']]) ok(M.kindOfAngle(x, y, z) === r.kinds[k], `${L}: angle ${k} is ${r.kinds[k]}, kindOfAngle says ${M.kindOfAngle(x, y, z)}`)
  // the median to the midpoint of AB
  ok(near(M.median(r.a, r.b, r.c), r.mc, 1e-9), `${L}: median ${M.median(r.a, r.b, r.c)} against ${r.mc}`)
  // the area through the cosine, and the solvers of the cases
  ok(near(M.areaViaCosine(r.a, r.b, r.c), r.area, 1e-7), `${L}: area ${M.areaViaCosine(r.a, r.b, r.c)} against ${r.area}`)
  const sas = M.solveSAS(r.a, r.C, r.b)
  ok(sas && near(sas.c, r.c, 1e-8) && near(sas.A, r.A, 1e-6) && near(sas.B, r.B, 1e-6), `${L}: solveSAS ${JSON.stringify(sas)}`)
  const sss = M.solveSSS(r.a, r.b, r.c)
  ok(sss && near(sss.A, r.A, 1e-6) && near(sss.B, r.B, 1e-6) && near(sss.C, r.C, 1e-6), `${L}: solveSSS ${JSON.stringify(sss)}`)
  // the range of the third side: |a − b| < c < a + b, and the law implies it
  const [lo, hi] = M.sideRange(r.a, r.b)
  ok(r.c > lo - 1e-9 && r.c < hi + 1e-9 && near(lo, Math.abs(r.a - r.b)) && near(hi, r.a + r.b), `${L}: sideRange`)
  // the correction term has the sign of the kind
  const corr = M.correction(r.a, r.b, r.C)
  ok((r.kinds.C === 'acute' && corr < 0) || (r.kinds.C === 'obtuse' && corr > 0) || (r.kinds.C === 'right' && Math.abs(corr) < 1e-6 * r.a * r.b), `${L}: the correction ${corr} for a ${r.kinds.C} angle`)
  ok(near(r.a * r.a + r.b * r.b + corr, r.c * r.c, 1e-9), `${L}: c² = a² + b² + correction`)
})
// the sweep of C: the third side runs from |a − b| to a + b
for (const [a, b] of [[3, 4], [5, 5], [2, 9]]) {
  let prev = -Infinity
  for (let C = 0.5; C < 180; C += 0.5) {
    const c = M.thirdSide(a, b, C)
    ok(c > prev - 1e-12 && c >= Math.abs(a - b) - 1e-9 && c <= a + b + 1e-9, `thirdSide(${a}, ${b}, ${C}) = ${c} is out of order or range`)
    prev = c
  }
  ok(near(M.thirdSide(a, b, 90), Math.hypot(a, b), 1e-12) && near(M.thirdSide(a, b, 60) ** 2, a * a + b * b - a * b, 1e-9) && near(M.thirdSide(a, b, 120) ** 2, a * a + b * b + a * b, 1e-9), `thirdSide(${a}, ${b}): 60°, 90°, 120°`)
}

/* ----------------------------------------------------------------------------- 2: thin triangles */
thin.forEach((t, i) => {
  const ref = R.thin[i]
  const stable = M.angleStable(t.a, t.b, t.c)
  const naive = M.angleNaive(t.a, t.b, t.c)
  const L = `thin triangle a=${t.a}, b=${t.b}, c=${t.c}`
  ok(Math.abs(stable - ref) <= 1e-9 * Math.abs(ref), `${L}: angleStable ${stable} against ${ref}`)
  if (t.a === t.b && t.a >= 1e8 && t.c <= 1) ok(Math.abs(naive - ref) > 1e-3 * Math.abs(ref), `${L}: the plain arccosine should have lost the angle: ${naive} against ${ref}`)
})
ok(M.angleNaive(1e8, 1e8, 1) === 0 && M.angleStable(1e8, 1e8, 1) > 5.7e-7 && M.angleStable(1e8, 1e8, 1) < 5.8e-7, 'the angle of the thin triangle 1e8, 1e8, 1: plain arccosine gives 0, the half-angle form 5.73e-7 degrees')
ok(M.angleStable(1, 2, 3) === 180 && near(M.angleStable(3, 4, 5), 90, 1e-12) && near(M.angleStable(1, 1, 1), 60, 1e-12), 'a flat triangle, a right one and an equilateral one')

/* --------------------------------------------------------------------------- 3: forces and trips */
forces.forEach((f, i) => {
  const r = R.forces[i]
  const m = M.resultant(f.F1, f.F2, f.theta)
  ok(near(m.size, r.size, 1e-9) && circ(m.direction, r.dir) < 1e-7, `forces ${JSON.stringify(f)}: ${JSON.stringify(m)} against ${JSON.stringify(r)}`)
  // the resultant in a triangle: its square is a² + b² − 2ab cos(180° − theta)
  ok(near(m.size, M.thirdSide(f.F1, f.F2, 180 - f.theta), 1e-9), `forces ${JSON.stringify(f)}: the triangle's angle is 180° − theta`)
})
ok(near(M.resultant(30, 40, 60).size, Math.sqrt(3700), 1e-12) && near(M.resultant(30, 40, 90).size, 50, 1e-12) && near(M.resultant(30, 40, 0).size, 70, 1e-12) && near(M.resultant(30, 40, 180).size, 10, 1e-12), 'resultants: 60° (√3700), 90° (50), 0° (70), 180° (10)')
trips.forEach((t, i) => {
  const r = R.trips[i]
  const m = M.trip(t.d1, t.b1, t.d2, t.b2)
  const L = `trip ${JSON.stringify(t)}`
  ok(m !== null && near(m.distance, r.d, 1e-8), `${L}: distance ${m && m.distance} against ${r.d}`)
  if (m && r.direct !== null && r.d > 1e-6) {
    ok(circ(m.direct, r.direct) < 1e-5, `${L}: bearing ${m.direct} against ${r.direct}`)
    ok(circ(m.back, r.direct + 180) < 1e-5 && m.direct >= 0 && m.direct < 360 && m.back >= 0 && m.back < 360, `${L}: bearing back ${m.back}`)
  }
  ok(m !== null && near(m.turn + m.inside, 180, 1e-12), `${L}: the turn and the angle inside the triangle add up to 180°`)
})
ok(M.trip(0, 0, 5, 5) === null && M.trip(5, 0, -1, 5) === null, 'a trip needs two legs')

console.log(`cosinelaw check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
