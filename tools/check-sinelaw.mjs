/** Checks src/lib/sinelaw.ts, the numbers behind the "Law of Sines" article, and the solvers of src/lib/triangle.ts that it uses.
 *
 *  References that do not use the code under test:
 *   1. Triangles built from coordinates and measured with distances and atan2 (sides, angles), the circumradius from the circumcenter (the
 *      perpendicular bisectors), the area from the shoelace formula and from Heron's formula: a / sin A, b / sin B, c / sin C must all equal 2R,
 *      the three areas ½ab·sin C must agree, and AAS, ASA and SSA must return the measured triangle.
 *   2. The ambiguous case counted by sliding a point along a ray and counting where its distance to C crosses a: the number of triangles and
 *      their positions against `ssaPoints`, `ssaKind` and `solveSSA`.
 *   3. The survey by intersecting two lines (a 2 × 2 determinant), and the worst error by trying the four combinations of the errors.
 *
 *  Run: npm run check:sinelaw   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sinelaw-'))
const out = path.join(tmp, 't.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/sinelaw.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

const FAST = process.env.SINELAW_FAST === '1'
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

let seed = 20261024
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const between = (a, b) => a + rnd() * (b - a)

/* ------------------------------------------------------------------------------------ the cases */
const triangles = []
while (triangles.length < (FAST ? 60 : 400)) {
  const P = [0, 1, 2].map(() => [Math.round(between(-10, 10) * 1000) / 1000, Math.round(between(-10, 10) * 1000) / 1000])
  const area2 = Math.abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1]))
  if (area2 > 2) triangles.push(P)
}
// the sides of a few famous triangles as coordinates: right (3, 4, 5), equilateral, a very flat one
triangles.push([[0, 0], [4, 0], [0, 3]], [[0, 0], [2, 0], [1, Math.sqrt(3)]], [[0, 0], [10, 0], [5, 0.05]], [[0, 0], [1, 0], [-5, 0.3]])

const ssa = []
for (const b of [3, 5, 8])
  for (const A of [15, 30, 45, 60, 89, 90, 91, 100, 150])
    for (let a = 0.25; a <= 14; a += FAST ? 1.25 : 0.25) ssa.push({ a, b, A })
// the boundaries: a = b sin A, a = b, and a just either side
for (const b of [3, 5, 8])
  for (const A of [20, 30, 45, 60, 80]) {
    const h = b * Math.sin((A * Math.PI) / 180)
    for (const a of [h, h * 1.0001, h * 0.9999, b, b * 1.0001, b * 0.9999]) ssa.push({ a, b, A })
  }

const surveys = []
for (let i = 0; i < (FAST ? 40 : 300); i++) {
  const alpha = between(15, 100)
  const beta = between(15, 100)
  if (alpha + beta < 175) surveys.push({ L: Math.round(between(5, 200)), alpha, beta, d: pick([0.25, 0.5, 1, 2]) })
}
function pick(list) {
  return list[Math.floor(rnd() * list.length)]
}
surveys.push({ L: 100, alpha: 45, beta: 45, d: 1 }, { L: 100, alpha: 80, beta: 85, d: 1 }, { L: 50, alpha: 30, beta: 120, d: 1 }, { L: 80, alpha: 10, beta: 12, d: 1 })

const PY = String.raw`
import json, sys, math
data = json.load(sys.stdin)
res = {}

def dist(p, q): return math.hypot(p[0] - q[0], p[1] - q[1])
def angle_at(p, q, r):
    """the angle at p between the directions to q and to r, by atan2"""
    a1 = math.atan2(q[1] - p[1], q[0] - p[0]); a2 = math.atan2(r[1] - p[1], r[0] - p[0])
    d = abs(a1 - a2)
    if d > math.pi: d = 2 * math.pi - d
    return math.degrees(d)
def circumcenter(A, B, C):
    ax, ay = A; bx, by = B; cx, cy = C
    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d
    uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d
    return (ux, uy)

tri = []
for A, B, C in data['triangles']:
    a = dist(B, C); b = dist(A, C); c = dist(A, B)
    s = (a + b + c) / 2
    heron = math.sqrt(max(0.0, s * (s - a) * (s - b) * (s - c)))
    shoelace = abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2
    O = circumcenter(A, B, C)
    tri.append({'a': a, 'b': b, 'c': c, 'A': angle_at(A, B, C), 'B': angle_at(B, A, C), 'C': angle_at(C, A, B), 'R': dist(O, A), 'R2': dist(O, B), 'R3': dist(O, C), 'heron': heron, 'shoelace': shoelace})
res['tri'] = tri

# the ambiguous case: slide B along the ray from A and count where its distance to C crosses a
cases = []
for s in data['ssa']:
    a, b, A = s['a'], s['b'], s['A']
    C = (b * math.cos(math.radians(A)), b * math.sin(math.radians(A)))
    top = 2 * (a + b) + 1
    n = data['n']
    step = top / n
    xs = []
    prev = None
    fmin = None; xmin = None
    for i in range(1, n + 1):
        x = i * step
        f = math.hypot(x - C[0], C[1]) - a
        if prev is not None and (prev < 0) != (f < 0):
            # refine by bisection
            lo, hi = x - step, x
            flo = math.hypot(lo - C[0], C[1]) - a
            for _ in range(60):
                mid = (lo + hi) / 2
                fm = math.hypot(mid - C[0], C[1]) - a
                if (flo < 0) == (fm < 0): lo, flo = mid, fm
                else: hi = mid
            xs.append((lo + hi) / 2)
        if fmin is None or abs(f) < abs(fmin): fmin = f; xmin = x
        prev = f
    cases.append({'xs': xs, 'h': C[1], 'bc': C[0]})
res['ssa'] = cases

# the survey: P = (0, 0), Q = (L, 0); P + t (cos al, sin al) = Q + s (-cos be, sin be)
def intersect(L, al, be):
    ca, sa = math.cos(math.radians(al)), math.sin(math.radians(al))
    cb, sb = math.cos(math.radians(be)), math.sin(math.radians(be))
    # t ca + s cb = L ; t sa - s sb = 0
    det = ca * (-sb) - cb * sa
    t = (L * (-sb) - 0 * cb) / det
    s = (ca * 0 - sa * L) / det
    return t, s, t * sa
sv = []
for q in data['surveys']:
    L, al, be, d = q['L'], q['alpha'], q['beta'], q['d']
    t, s, h = intersect(L, al, be)
    worst = 0.0
    for da in (-d, d):
        for db in (-d, d):
            if al + da + be + db >= 180 or al + da <= 0 or be + db <= 0: worst = float('inf'); continue
            _, _, h2 = intersect(L, al + da, be + db)
            worst = max(worst, abs(h2 - h) / h)
    sv.append({'fromP': t, 'fromQ': s, 'h': h, 'worst': worst})
res['survey'] = sv
json.dump(res, sys.stdout)
`

const py = spawnSync('python', ['-X', 'utf8', '-c', PY], { input: JSON.stringify({ triangles, ssa, surveys, n: FAST ? 30000 : 120000 }), encoding: 'utf8', maxBuffer: 1 << 28, timeout: 590000 })
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)

/* ------------------------------------------------------------------ 1: measured triangles */
triangles.forEach((P, i) => {
  const r = R.tri[i]
  const L = `triangle ${i} (${r.a.toFixed(3)}, ${r.b.toFixed(3)}, ${r.c.toFixed(3)})`
  ok(near(r.R, r.R2, 1e-9) && near(r.R, r.R3, 1e-9), `${L}: the circumcenter is not equally far from the vertices`)
  const full = { a: r.a, b: r.b, c: r.c, A: r.A, B: r.B, C: r.C }
  // the law of sines: the three ratios are 2R, measured from the circumcenter
  const rat = M.ratios(full)
  ok(rat.every((q) => near(q, 2 * r.R, 1e-7)), `${L}: ratios ${rat} against 2R = ${2 * r.R}`)
  ok(near(M.circumradius(full), r.R, 1e-7), `${L}: circumradius ${M.circumradius(full)} against ${r.R}`)
  const areas = M.areaThreeWays(full)
  ok(areas.every((q) => near(q, r.shoelace, 1e-7) && near(q, r.heron, 1e-6)), `${L}: areas ${areas} against shoelace ${r.shoelace} and Heron ${r.heron}`)
  // the solvers return the measured triangle
  const same = (t, what) => ok(t && ['a', 'b', 'c', 'A', 'B', 'C'].every((k) => near(t[k], full[k], 1e-7)), `${L}: ${what} gave ${JSON.stringify(t)}`)
  same(M.solveAAS(r.A, r.B, r.a), 'AAS')
  same(M.solveASA(r.A, r.c, r.B), 'ASA')
  same(M.solveSSS(r.a, r.b, r.c), 'SSS')
  same(M.solveSAS(r.a, r.C, r.b), 'SAS')
  const sols = M.solveSSA(r.a, r.b, r.A)
  ok(sols.some((t) => near(t.B, r.B, 1e-6) && near(t.c, r.c, 1e-6) && near(t.C, r.C, 1e-6)), `${L}: SSA lost the measured triangle`)
  ok(sols.every((t) => near(t.A + t.B + t.C, 180, 1e-9)), `${L}: SSA angles do not add up to 180°`)
  // the placement: the distances between the placed vertices are the sides
  const pl = M.place(full)
  const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1])
  ok(near(d(pl.A, pl.B), r.c, 1e-9) && near(d(pl.A, pl.C), r.b, 1e-9) && near(d(pl.B, pl.C), r.a, 1e-7), `${L}: place() distances`)
  ok(pl.C[1] > 0, `${L}: place() puts C above the x-axis`)
})

/* ------------------------------------------------------------------------- 2: the ambiguous case */
const boundaryNear = (a, h, b) => Math.abs(a - h) < 1e-3 * Math.max(1, h) || Math.abs(a - b) < 1e-3 * Math.max(1, b)
ssa.forEach((s, i) => {
  const r = R.ssa[i]
  const L = `SSA a=${s.a}, b=${s.b}, A=${s.A}`
  const info = M.ssaKind(s.a, s.b, s.A)
  const pts = M.ssaPoints(s.a, s.b, s.A)
  const sol = M.solveSSA(s.a, s.b, s.A)
  ok(near(info.h, r.h, 1e-9), `${L}: the height ${info.h} against ${r.h}`)
  if (!boundaryNear(s.a, r.h, s.b)) {
    // away from the knife edges the sliding point counts the triangles
    ok(info.count === r.xs.length, `${L}: ssaKind says ${info.count} (${info.kind}), the scan found ${r.xs.length}`)
    ok(pts.length === r.xs.length && pts.every((x, j) => Math.abs(x - r.xs[j]) < 1e-3), `${L}: positions ${JSON.stringify(pts)} against the scan ${JSON.stringify(r.xs)}`)
    ok(sol.length === r.xs.length, `${L}: solveSSA found ${sol.length}, the scan ${r.xs.length}`)
    ok(sol.every((t, j) => Math.abs(t.c - pts[j]) < 1e-6 * Math.max(1, t.c) || pts.some((x) => Math.abs(t.c - x) < 1e-6 * Math.max(1, x))), `${L}: solveSSA sides ${sol.map((t) => t.c)} against ${pts}`)
  } else {
    // on a knife edge: counts must agree among the three methods used, and the kind must match the rule
    ok(info.count === pts.length && pts.length === sol.length, `${L} (edge): ${info.count}, ${pts.length}, ${sol.length}`)
  }
  // the kind agrees with the rule for the count
  if (s.A < 90) ok((info.kind === 'none-short') === (info.count === 0) && (info.kind === 'two') === (info.count === 2), `${L}: kind ${info.kind} with count ${info.count}`)
  else ok((info.kind === 'one-obtuse') === (info.count === 1) && (info.kind === 'none-obtuse') === (info.count === 0), `${L}: obtuse kind ${info.kind} with count ${info.count}`)
  // every triangle found is a triangle: it has the given a, b and A
  pts.forEach((x) => {
    const C = [s.b * Math.cos((s.A * Math.PI) / 180), s.b * Math.sin((s.A * Math.PI) / 180)]
    ok(near(Math.hypot(x - C[0], C[1]), s.a, 1e-8), `${L}: the point x = ${x} is not at distance a from C`)
  })
})
// the rule in words, at some exact values
{
  const k = (a, b, A) => M.ssaKind(a, b, A).kind
  ok(k(3, 5, 30) === 'two' && k(2, 5, 30) === 'none-short' && k(2.5, 5, 30) === 'right' && k(5, 5, 30) === 'one-long' && k(7, 5, 30) === 'one-long', 'the rule for an acute A')
  ok(k(7, 5, 120) === 'one-obtuse' && k(5, 5, 120) === 'none-obtuse' && k(3, 5, 120) === 'none-obtuse' && k(7, 5, 90) === 'one-obtuse' && k(5, 5, 90) === 'none-obtuse', 'the rule for a right or obtuse A')
  ok(M.solveSSA(3, 5, 30).length === 2 && Math.abs(M.solveSSA(3, 5, 30)[0].c - 2.67) < 0.01 && Math.abs(M.solveSSA(3, 5, 30)[1].c - 5.99) < 0.01 || Math.abs(M.solveSSA(3, 5, 30)[0].c - 5.99) < 0.01, 'the example of the article: a = 3, b = 5, A = 30° has c = 5.99 and c = 2.67')
}
// the two angles of one sine
for (const x of [0, 0.25, 0.5, 5 / 6, 1]) {
  const an = M.anglesWithSine(x)
  ok(an.every((v) => near(Math.sin((v * Math.PI) / 180), x, 1e-12)) && an.length === (x === 1 ? 1 : 2) && an.every((v) => v >= 0 && v <= 180), `anglesWithSine(${x}) = ${an}`)
  // the two angles of one sine are supplementary: 180° apart from mirror image
  if (an.length === 2) ok(near(an[0] + an[1], 180, 1e-12) && an[0] !== an[1], `anglesWithSine(${x}) = ${an}: the two angles should add up to 180°`)
}
ok(M.anglesWithSine(1.2).length === 0 && M.anglesWithSine(-0.1).length === 0, 'no angle has a sine beyond 1 or below 0 in a triangle')

/* ------------------------------------------------------------------------------ 3: the survey */
surveys.forEach((q, i) => {
  const r = R.survey[i]
  const s = M.survey(q.L, q.alpha, q.beta)
  const L = `survey L=${q.L}, alpha=${q.alpha.toFixed(2)}, beta=${q.beta.toFixed(2)}`
  ok(s !== null && near(s.fromP, r.fromP, 1e-8) && near(s.fromQ, r.fromQ, 1e-8) && near(s.h, r.h, 1e-8), `${L}: ${JSON.stringify(s)} against ${JSON.stringify(r)}`)
  ok(s !== null && near(s.gamma, 180 - q.alpha - q.beta, 1e-12), `${L}: the angle at the target`)
  const w = M.surveyWorstError(q.L, q.alpha, q.beta, q.d)
  ok(w !== null && (w === r.worst || near(w, r.worst, 1e-8)), `${L}, d=${q.d}: worst error ${w} against ${r.worst}`)
})
ok(M.survey(10, 100, 90) === null && M.survey(0, 40, 40) === null && M.survey(10, -5, 40) === null && M.survey(10, 90, 90) === null, 'a survey needs angles that leave something at the target')
{
  // a longer baseline relative to the width, and angles nearer 90° at the target, make the answer steadier
  const flat = M.surveyWorstError(100, 85, 85, 1)
  const good = M.surveyWorstError(100, 50, 50, 1)
  ok(flat > good, `nearly parallel lines of sight (${flat}) should be less steady than a wide angle (${good})`)
}

console.log(`sinelaw check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
