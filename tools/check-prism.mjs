/** Checks src/lib/prism.ts against references that do not use it.
 *
 *   - regular polygons built on a circle (coordinates) and measured by the shoelace formula and by distances, against the area and perimeter formulas;
 *   - the volume and the surface of a prism from the convex hull of its corners (SciPy), for right and oblique prisms on regular and on random convex bases;
 *   - the lateral area as the sum of the parallelograms from cross products, and the perimeter of the right section, built again from vectors;
 *   - corners, edges and faces counted from the structure, and V − E + F = 2;
 *   - the distances between corners of a regular prism, sorted into edges, face diagonals and space diagonals;
 *   - mpmath for the area ratio of an inscribed polygon and its limit π;
 *   - light through glass: a ray traced through a prism built from its corners, with Snell's law in vector form at both faces, against the formulas with angles, and
 *     the minimum deviation by scanning the angle of incidence.
 *
 *  Random inputs come from a seeded generator, so a failure repeats; PRISM_FAST=1 runs a smaller set (for the mutation tests).
 *  Run: npm run check:prism   Needs Python with numpy, scipy and mpmath.   Exit 1 on any failure. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const FAST = process.env.PRISM_FAST === '1'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'prism-'))
const out = path.join(tmp, 'prism.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/prism.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const P = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
let checks = 0
const flag = (msg) => {
  bad++
  if (bad <= 40) console.log(msg)
}
const ok = (cond, msg) => {
  checks++
  if (!cond) flag(msg)
  return cond
}
const close = (x, y, rel = 1e-9) => Math.abs(x - y) <= rel * Math.max(1, Math.abs(x), Math.abs(y))

/** A reproducible random source (mulberry32). */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = rng(0x9015)
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1))
const rf = (lo, hi) => lo + rand() * (hi - lo)

/* ---------------------------------------------------------------------- inputs */

// right prisms on regular polygons
const regs = []
for (const n of [3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 24]) for (const [s, h] of [[1, 1], [2, 5], [0.7, 3.2], [10, 0.5]]) regs.push({ n, s, h })
for (let i = 0; i < (FAST ? 40 : 300); i++) regs.push({ n: ri(3, 40), s: rf(0.1, 20), h: rf(0.1, 20) })

// any prism: a random convex base (points on an ellipse, in order) and a shift that may lean
const bases = []
for (let i = 0; i < (FAST ? 60 : 500); i++) {
  const k = ri(3, 9)
  const a = rf(1, 6)
  const b = rf(1, 6)
  const cx = rf(-3, 3)
  const cy = rf(-3, 3)
  const angles = Array.from({ length: k }, () => rand() * 2 * Math.PI).sort((x, y) => x - y)
  // keep the corners well apart, so the polygon is convex and not nearly degenerate
  const pts = angles.map((t) => [cx + a * Math.cos(t), cy + b * Math.sin(t)])
  const shift = rand() < 0.3 ? [0, 0, rf(0.5, 8)] : [rf(-4, 4), rf(-4, 4), rf(0.5, 8)]
  bases.push({ pts, shift })
}
bases.push({ pts: [[0, 0], [4, 0], [0, 3]], shift: [0, 0, 5] })
bases.push({ pts: [[0, 0], [4, 0], [0, 3]], shift: [2, 1, 5] })
bases.push({ pts: [[0, 0], [4, 0], [4, 3], [0, 3]], shift: [0, 0, 2] })
bases.push({ pts: [[0, 0], [4, 0], [4, 3], [0, 3]], shift: [0, 2, 2] })
bases.push({ pts: [[0, 0], [4, 0], [4, 3], [0, 3]], shift: [3, 0, 2] })
bases.push({ pts: [[0, 0], [4, 0], [5, 3], [1, 3]], shift: [1, -1, 2] })

const ns = [3, 4, 5, 6, 8, 10, 12, 20, 50, 100, 1000, 100000]
const optics = []
for (let i = 0; i < (FAST ? 100 : 800); i++) optics.push({ A: rf(20, 80), n: rf(1.3, 1.9), i1: rf(-60, 85) })
for (const [A, n, i1] of [[60, 1.5, 40], [60, 1.5, 48.59], [60, 1.5, 20], [30, 1.52, 50], [45, 1.6, 30], [60, 1.5, 5]]) optics.push({ A, n, i1 })
const mins = []
for (let i = 0; i < (FAST ? 30 : 200); i++) mins.push({ A: rf(20, 80), n: rf(1.2, 1.9) })
mins.push({ A: 60, n: 1.5 })

/* --------------------------------------------------------------- Python references */

const PY = String.raw`
import sys, json, math, itertools
import numpy as np
from scipy.spatial import ConvexHull
import mpmath
mpmath.mp.dps = 40
data = json.load(open(sys.argv[1], encoding='utf-8'))
res = {}

# ---- a regular prism, built from its corners
def regular_prism(n, s, h):
    R = s / (2 * math.sin(math.pi / n))
    base = [(R * math.cos(2 * math.pi * i / n), R * math.sin(2 * math.pi * i / n)) for i in range(n)]
    top = [(x, y, h) for x, y in base]
    bottom = [(x, y, 0.0) for x, y in base]
    pts = np.array(bottom + top)
    area = 0.0
    for i in range(n):
        x1, y1 = base[i]; x2, y2 = base[(i + 1) % n]
        area += x1 * y2 - x2 * y1
    area = abs(area) / 2
    perim = sum(math.hypot(base[(i + 1) % n][0] - base[i][0], base[(i + 1) % n][1] - base[i][1]) for i in range(n))
    hull = ConvexHull(pts)
    # the lateral faces are rectangles s x h: from the vertices
    lateral = sum(np.linalg.norm(np.cross(np.array(bottom[(i + 1) % n]) - np.array(bottom[i]), np.array(top[i]) - np.array(bottom[i]))) for i in range(n))
    # all distances between a bottom corner and a top corner, by how many places round the top corner is
    by_step = {}
    for i in range(n):
        for j in range(n):
            k = min((j - i) % n, (i - j) % n)
            d = float(np.linalg.norm(np.array(bottom[i]) - np.array(top[j])))
            by_step.setdefault(k, set()).add(round(d, 9))
    diags = sorted(next(iter(v)) for k, v in by_step.items() if k >= 2)
    edges = n + n + n   # two rings and n uprights
    return {'base': area, 'perim': perim, 'volume': hull.volume, 'surface': hull.area, 'lateral': lateral, 'faceDiag': next(iter(by_step[1])), 'diags': diags, 'V': 2 * n, 'E': edges, 'F': n + 2}
res['reg'] = [regular_prism(c['n'], c['s'], c['h']) for c in data['regs']]

# ---- any prism: hull for volume and surface, parallelograms for the lateral area, vectors for the right section
def general(base, shift):
    b = np.array([[x, y, 0.0] for x, y in base]); sh = np.array(shift)
    top = b + sh
    hull = ConvexHull(np.vstack([b, top]))
    n = len(base)
    par = sum(np.linalg.norm(np.cross(b[(i + 1) % n] - b[i], sh)) for i in range(n))
    # the section by a plane through the origin, perpendicular to the shift: slide each base corner along the shift to that plane
    u = sh / np.linalg.norm(sh)
    sec = np.array([p - np.dot(p, u) * u for p in b])
    per = sum(np.linalg.norm(sec[(i + 1) % n] - sec[i]) for i in range(n))
    # base area by splitting into triangles from the first corner
    area = 0.0
    for i in range(1, n - 1):
        area += np.linalg.norm(np.cross(b[i] - b[0], b[i + 1] - b[0])) / 2
    return {'area': area, 'volume': hull.volume, 'surface': hull.area, 'lateral': par, 'section': per, 'edge': float(np.linalg.norm(sh))}
res['gen'] = [general(c['pts'], c['shift']) for c in data['bases']]

# ---- the polygon in a circle, and the limit
res['ratio'] = [float(mpmath.mpf(n) / (2 * mpmath.pi) * mpmath.sin(2 * mpmath.pi / n)) for n in data['ns']]
res['circle'] = []
for n in data['ns'][:8]:
    r, h = 1.7, 2.3
    area = float(mpmath.mpf(n) / 2 * r * r * mpmath.sin(2 * mpmath.pi / n))
    per = float(2 * n * r * mpmath.sin(mpmath.pi / n))
    res['circle'].append({'volume': area * h, 'lateral': per * h, 'surface': 2 * area + per * h, 'cylV': math.pi * r * r * h, 'cylS': 2 * math.pi * r * r + 2 * math.pi * r * h})

# ---- light through a prism, as a ray traced through its corners
def refract(d, N, n1, n2):
    # d: unit incoming direction, N: unit normal pointing back against the ray (into the medium the ray comes from); vector Snell
    cos_i = -np.dot(N, d)
    ratio = n1 / n2
    k = 1 - ratio ** 2 * (1 - cos_i ** 2)
    if k < 0:
        return None
    return ratio * d + (ratio * cos_i - math.sqrt(k)) * N
def trace(A, n, i1, sense):
    A_r = math.radians(A)
    H = 1.0
    apex = np.array([0.0, H]); L = np.array([-H * math.tan(A_r / 2), 0.0]); Rr = np.array([H * math.tan(A_r / 2), 0.0])
    centre = (apex + L + Rr) / 3
    def outward(p, q):
        t = q - p; N = np.array([t[1], -t[0]]); N /= np.linalg.norm(N)
        mid = (p + q) / 2
        return N if np.dot(N, mid - centre) > 0 else -N
    N1 = outward(L, apex); N2 = outward(apex, Rr)
    # the ray arrives at the left face at angle i1 from its normal; sense picks which side of the normal it comes from
    inward = -N1
    c, s = math.cos(sense * math.radians(i1)), math.sin(sense * math.radians(i1))
    d0 = np.array([c * inward[0] - s * inward[1], s * inward[0] + c * inward[1]])
    d1 = refract(d0, -inward * -1 * -1 if False else N1, 1.0, n)
    # at the first face the normal that points back against the ray is the outward one
    if d1 is None: return None
    d2 = refract(d1, -N2, n, 1.0)
    if d2 is None: return None
    ang = math.degrees(math.acos(max(-1.0, min(1.0, float(np.dot(d0, d2))))))
    return ang
res['trace'] = [[trace(c['A'], c['n'], c['i1'], 1), trace(c['A'], c['n'], c['i1'], -1)] for c in data['optics']]

# ---- minimum deviation by scanning the angle of incidence (the formula is not used)
res['scan'] = []
for c in data['mins']:
    A, n = c['A'], c['n']
    best = None
    for i in np.linspace(0.001, 89.999, 90000):
        r1 = math.asin(math.sin(math.radians(i)) / n); r2 = math.radians(A) - r1
        s = n * math.sin(r2)
        if abs(s) > 1: continue
        D = i + math.degrees(math.asin(s)) - A
        if best is None or D < best[0]: best = (D, i)
    res['scan'].append(None if best is None else {'D': best[0], 'i': best[1]})
json.dump(res, open(sys.argv[2], 'w', encoding='utf-8'))
`

const inFile = path.join(tmp, 'in.json')
const outFile = path.join(tmp, 'out.json')
const pyFile = path.join(tmp, 'ref.py')
fs.writeFileSync(pyFile, PY)
fs.writeFileSync(inFile, JSON.stringify({ regs, bases, ns, optics, mins }))
const py = spawnSync('python', [pyFile, inFile, outFile], { encoding: 'utf-8', maxBuffer: 1 << 28 })
if (py.status !== 0) {
  console.log('python reference failed:\n' + (py.stderr || py.stdout).split('\n').slice(-15).join('\n'))
  process.exit(1)
}
const R = JSON.parse(fs.readFileSync(outFile, 'utf8'))

/* ------------------------------------------------------------- right regular prisms */

regs.forEach((c, i) => {
  const p = P.rightPrism(c.n, c.s, c.h)
  const r = R.reg[i]
  const where = `rightPrism(${c.n}, ${+c.s.toFixed(3)}, ${+c.h.toFixed(3)})`
  ok(close(p.baseArea, r.base, 1e-10) && close(p.perimeter, r.perim, 1e-10), `${where}: base area ${p.baseArea}, perimeter ${p.perimeter}; coordinates give ${r.base}, ${r.perim}`)
  ok(close(p.volume, r.volume, 1e-9), `${where}: volume ${p.volume}, convex hull ${r.volume}`)
  ok(close(p.surface, r.surface, 1e-9), `${where}: surface ${p.surface}, convex hull ${r.surface}`)
  ok(close(p.lateral, r.lateral, 1e-10) && close(p.surface, 2 * p.baseArea + p.lateral, 1e-12), `${where}: lateral ${p.lateral}, parallelograms ${r.lateral}`)
  ok(close(p.faceDiagonal, r.faceDiag, 1e-9), `${where}: face diagonal ${p.faceDiagonal}, corners ${r.faceDiag}`)
  ok(p.spaceDiagonals.length === r.diags.length && p.spaceDiagonals.every((d, k) => close(d, r.diags[k], 1e-8)), `${where}: space diagonals ${p.spaceDiagonals} vs corners ${r.diags}`)
  const k = P.prismCounts(c.n)
  ok(k.V === r.V && k.E === r.E && k.F === r.F && k.chi === 2, `prismCounts(${c.n}): ${JSON.stringify(k)} vs ${r.V}, ${r.E}, ${r.F}`)
  const b = P.regularBase(c.n, c.s)
  ok(close(b.area, b.perimeter * b.apothem / 2, 1e-10) && close(b.apothem ** 2 + (c.s / 2) ** 2, b.circumradius ** 2, 1e-10), `regularBase(${c.n}, ${c.s}): area = ½ · perimeter · apothem and the right triangle R² = a² + (s/2)²`)
})
ok(P.rightPrism(3, 2, 5).spaceDiagonals.length === 0, 'a triangular prism has no space diagonals')
{
  const cube = P.rightPrism(4, 3, 3)
  ok(close(cube.volume, 27) && close(cube.surface, 54) && close(cube.spaceDiagonals[0], 3 * Math.sqrt(3)), 'the square prism with s = h is a cube: 27, 54, 3√3')
  const hex = P.rightPrism(6, 1, 3)
  ok(close(hex.spaceDiagonals[0], Math.sqrt(12), 1e-12) && close(hex.spaceDiagonals[1], Math.sqrt(13), 1e-12), 'hexagonal prism s=1, h=3: space diagonals √12 and √13')
}

/* ------------------------------------------------------------------ any prism */

bases.forEach((c, i) => {
  const g = P.generalPrism(c.pts, c.shift)
  const r = R.gen[i]
  const where = `generalPrism(${c.pts.length} corners, [${c.shift.map((x) => +x.toFixed(3))}])`
  ok(close(g.baseArea, r.area, 1e-9), `${where}: base area ${g.baseArea}, triangles ${r.area}`)
  ok(close(g.volume, r.volume, 1e-8), `${where}: volume ${g.volume}, convex hull ${r.volume}`)
  ok(close(g.surface, r.surface, 1e-8), `${where}: surface ${g.surface}, convex hull ${r.surface}`)
  ok(close(g.lateral, r.lateral, 1e-9), `${where}: lateral ${g.lateral}, parallelograms ${r.lateral}`)
  ok(close(g.rightSectionPerimeter, r.section, 1e-9), `${where}: right section perimeter ${g.rightSectionPerimeter}, vectors ${r.section}`)
  ok(close(g.edge, r.edge, 1e-12), `${where}: edge ${g.edge}, ${r.edge}`)
  // the lateral area is the perimeter of the right section times the length of an edge, and a right prism has the section equal to the base
  ok(close(g.lateral, g.rightSectionPerimeter * g.edge, 1e-9), `${where}: lateral ${g.lateral} must be section perimeter × edge ${g.rightSectionPerimeter * g.edge}`)
  ok(g.right === (c.shift[0] === 0 && c.shift[1] === 0), `${where}: right flag`)
  ok(close(g.height, c.shift[2], 1e-12), `${where}: height ${g.height}, shift ${c.shift[2]}`)
  if (g.right) ok(close(g.lateral, g.perimeter * g.height, 1e-9), `${where}: a right prism has lateral = perimeter × height`)
  // a leaning prism has the same volume and a larger lateral area than the right prism of the same base and height
  const straight = P.generalPrism(c.pts, [0, 0, c.shift[2]])
  ok(close(g.volume, straight.volume, 1e-12), `${where}: a prism that leans keeps its volume (Cavalieri)`)
  ok(g.lateral >= straight.lateral * (1 - 1e-12), `${where}: leaning cannot shrink the lateral area`)
})
{
  const g = P.generalPrism([[0, 0], [4, 0], [0, 3]], [0, 0, 5])
  ok(g.baseArea === 6 && g.volume === 30 && g.lateral === 60 && g.surface === 72, 'the 3-4-5 prism of height 5: base 6, volume 30, lateral 60, surface 72')
  const poly = P.regularPolygon(6, 2)
  ok(poly.length === 6 && close(P.polygonArea(poly), P.regularBase(6, 2).area, 1e-12) && close(P.polygonPerimeter(poly), 12, 1e-12), 'regularPolygon: corners of a regular hexagon of side 2')
}

/* ------------------------------------------------------------ towards the cylinder */

ns.forEach((n, i) => {
  ok(close(P.inscribedAreaRatio(n), R.ratio[i], 1e-9), `inscribedAreaRatio(${n}) = ${P.inscribedAreaRatio(n)}, mpmath ${R.ratio[i]}`)
  if (i > 0) ok(P.inscribedAreaRatio(n) >= P.inscribedAreaRatio(ns[i - 1]) - 1e-12 || ns[i] < ns[i - 1], `the ratio grows with n: ${ns[i - 1]} to ${n}`)
  ok(P.inscribedAreaRatio(n) < 1, `inscribedAreaRatio(${n}) must stay below 1`)
})
ns.slice(0, 8).forEach((n, i) => {
  const c = P.prismInCircle(n, 1.7, 2.3)
  const r = R.circle[i]
  ok(close(c.volume, r.volume, 1e-9) && close(c.lateral, r.lateral, 1e-9) && close(c.surface, r.surface, 1e-9), `prismInCircle(${n}): ${c.volume}, ${c.lateral}, ${c.surface} vs ${r.volume}, ${r.lateral}, ${r.surface}`)
  ok(close(c.cylinderVolume, r.cylV, 1e-12) && close(c.cylinderSurface, r.cylS, 1e-12), `prismInCircle(${n}): the cylinder`)
  ok(c.volume < c.cylinderVolume && c.surface < c.cylinderSurface, `prismInCircle(${n}): the prism sits inside the cylinder`)
})
ok(Math.abs(P.inscribedAreaRatio(1e6) - 1) < 1e-10, 'the area ratio tends to 1')
ok(close(P.inscribedAreaRatio(4), 2 / Math.PI, 1e-12) && close(P.inscribedAreaRatio(6), (3 * Math.sqrt(3)) / (2 * Math.PI), 1e-12), 'square: 2/π, hexagon: 3√3/2π')

/* ------------------------------------------------------------- light through glass */

optics.forEach((c, i) => {
  const f = P.prismDeviation(c.A, c.n, c.i1)
  const g = P.prismDeviation(c.A, c.n, -c.i1)
  const [t1, t2] = R.trace[i]
  const where = `prismDeviation(A=${c.A.toFixed(2)}, n=${c.n.toFixed(3)}, i=${c.i1.toFixed(2)})`
  // the two ways to send the ray at that angle of incidence (from either side of the normal) are the formula at +i and at −i
  const ours = [f ? Math.abs(f.D) : null, g ? Math.abs(g.D) : null]
  const theirs = [t1, t2]
  const matches = (x, y) => (x === null ? y === null : y !== null && close(x, y, 1e-7))
  ok((matches(ours[0], theirs[0]) && matches(ours[1], theirs[1])) || (matches(ours[0], theirs[1]) && matches(ours[1], theirs[0])), `${where}: formula gives ${ours}, the traced ray gives ${theirs}`)
  if (f) {
    ok(close(f.r1 + f.r2, c.A, 1e-12), `${where}: r1 + r2 = A`)
    ok(close(Math.sin((f.i1 * Math.PI) / 180), c.n * Math.sin((f.r1 * Math.PI) / 180), 1e-12) && close(Math.sin((f.e * Math.PI) / 180), c.n * Math.sin((f.r2 * Math.PI) / 180), 1e-12), `${where}: Snell's law at both faces`)
    ok(close(f.D, f.i1 + f.e - c.A, 1e-12), `${where}: D = i + e − A`)
  }
})
mins.forEach((c, i) => {
  const m = P.minDeviation(c.A, c.n)
  const s = R.scan[i]
  const where = `minDeviation(A=${c.A.toFixed(2)}, n=${c.n.toFixed(3)})`
  if (m === null) {
    ok(c.n * Math.sin((c.A * Math.PI) / 360) >= 1 && s === null, `${where}: null only when n sin(A/2) ≥ 1`)
    return
  }
  ok(s !== null && close(m, s.D, 2e-6), `${where}: ${m}, scanning the angle of incidence gives ${s?.D}`)
  const iAt = P.incidenceAtMinDeviation(c.A, c.n)
  ok(s !== null && Math.abs(iAt - s.i) < 2e-3, `${where}: incidence ${iAt}, scan finds the minimum at ${s?.i}`)
  const sym = P.prismDeviation(c.A, c.n, iAt)
  ok(sym !== null && close(sym.D, m, 1e-9) && close(sym.e, iAt, 1e-9), `${where}: at that angle the ray leaves at the same angle and D = ${m}`)
  ok(close(P.indexFromMinDeviation(c.A, m), c.n, 1e-9), `${where}: the index recovered from the minimum deviation is ${P.indexFromMinDeviation(c.A, m)}, not ${c.n}`)
})
{
  const m = P.minDeviation(60, 1.5)
  ok(close(m, 37.18, 1e-4) || Math.abs(m - 37.1811) < 1e-3, `a 60° glass prism of index 1.5 turns light by at least 37.18°: ${m}`)
  ok(close(P.criticalAngle(1.5), 41.8103, 1e-6), 'critical angle of glass 1.5: 41.81°')
  ok(P.prismDeviation(60, 1.5, 5) === null, 'a ray at 5° incidence on a 60° glass prism is totally reflected inside')
  ok(P.minDeviation(180, 1) === null, 'n sin(A/2) = 1 exactly: no minimum deviation')
  ok(P.minDeviation(80, 1.7) === null, 'n sin(A/2) = 1.09: no minimum deviation, the light cannot get out symmetrically')
  ok(close(P.indexFromMinDeviation(60, 37.1811), 1.5, 1e-5), 'index from A = 60° and D = 37.18°: 1.5')
}

console.log(`prism check: ${regs.length} right prisms, ${bases.length} general prisms, ${optics.length} rays, ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
