/** Checks src/lib/cuboid.ts against references that do not use it.
 *
 *   - the box as eight corners: faces measured as cross products of edge vectors, diagonals as distances between corners, the volume as a determinant;
 *   - Python integers and mpmath for the exact measures, the integer square root and the angles;
 *   - the angles between diagonals from dot products of the diagonal vectors themselves;
 *   - a grid search for the box of largest volume on a given surface, and many random boxes on one surface, against the cube's volume (S/6)^(3/2);
 *   - counting small boxes cell by cell for the packing;
 *   - brute-force search for the Pythagorean quadruples, the Euler bricks and the perfect cuboids, and the four-number identity on random integers.
 *
 *  Random inputs come from a seeded generator, so a failure repeats; CUBOID_FAST=1 runs a smaller set (for the mutation tests).
 *  Run: npm run check:cuboid   Needs Python with mpmath and numpy.   Exit 1 on any failure. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const FAST = process.env.CUBOID_FAST === '1'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cuboid-'))
const out = path.join(tmp, 'cuboid.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/cuboid.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const B = await import('file://' + out.replace(/\\/g, '/'))

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
const rand = rng(0xb10c)
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1))
const rf = (lo, hi) => lo + rand() * (hi - lo)

/* ------------------------------------------------------------------------ inputs */

const boxes = [[1, 1, 1], [5, 3, 2], [2, 3, 6], [3, 4, 12], [44, 117, 240], [0.5, 0.25, 0.1], [10, 1, 1], [7, 7, 2]]
for (let i = 0; i < (FAST ? 80 : 600); i++) boxes.push([rf(0.1, 50), rf(0.1, 50), rf(0.1, 50)])
const bigBoxes = []
for (let i = 0; i < 60; i++) bigBoxes.push([String(BigInt(ri(1, 99999)) * BigInt(ri(1, 99999))), String(BigInt(ri(1, 99999)) * BigInt(ri(1, 99999))), String(BigInt(ri(1, 99999)))])
const sqInts = []
for (let i = 0; i < (FAST ? 100 : 500); i++) {
  const m = BigInt(ri(0, 999999)) * BigInt(ri(0, 999999))
  const sq = m * m
  sqInts.push(String(sq), String(sq + 1n), String(sq > 0n ? sq - 1n : 0n), String(BigInt(ri(0, 1e9)) * BigInt(ri(0, 1e9))))
}
// numbers far beyond what a double can hold exactly: the integer square root has to stay exact
for (let i = 0; i < 30; i++) {
  const m = BigInt(ri(1, 99999)) ** BigInt(ri(3, 12)) * BigInt(ri(1, 99999))
  sqInts.push(String(m * m), String(m * m + 1n), String(m * m - 1n), String(m * m + 2n * m))
}
const surfaces = [6, 24, 96, 150, 600, 1000, 7.5]
const surfBoxes = []
for (let i = 0; i < (FAST ? 80 : 600); i++) {
  const S = rf(10, 1000)
  // the base alone may be too big for the surface: lw > S/2 leaves no height
  surfBoxes.push({ S, l: rf(0.05, Math.sqrt(S)), w: rf(0.05, Math.sqrt(S)) })
}
const packs = []
for (let i = 0; i < (FAST ? 80 : 600); i++) packs.push({ big: [ri(1, 30), ri(1, 30), ri(1, 30)], small: [ri(1, 9), ri(1, 9), ri(1, 9)] })
const leb = []
for (let i = 0; i < 200; i++) leb.push([ri(-60, 60), ri(-60, 60), ri(-60, 60), ri(-60, 60)])
const QD = FAST ? 80 : 200
const BC = FAST ? 500 : 700

/* ------------------------------------------------------------------- Python references */

const PY = String.raw`
import sys, json, math, itertools
import mpmath
import numpy as np
mpmath.mp.dps = 40
data = json.load(open(sys.argv[1], encoding='utf-8'))
res = {}

def corners(l, w, h):
    return {(i, j, k): (i * l, j * w, k * h) for i in (0, 1) for j in (0, 1) for k in (0, 1)}
def sub(p, q): return tuple(a - b for a, b in zip(p, q))
def cross(u, v): return (u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0])
def norm(u): return mpmath.sqrt(sum(x * x for x in u))
def dist(p, q): return norm(sub(p, q))

def box_ref(l, w, h):
    l, w, h = mpmath.mpf(l), mpmath.mpf(w), mpmath.mpf(h)
    C = corners(l, w, h)
    o = C[(0, 0, 0)]
    ex, ey, ez = sub(C[(1, 0, 0)], o), sub(C[(0, 1, 0)], o), sub(C[(0, 0, 1)], o)
    # a face is two edge vectors from one corner; its area is the length of their cross product
    face = lambda a, b: norm(cross(a, b))
    top_bottom = 2 * face(ex, ey)
    walls = 2 * face(ex, ez) + 2 * face(ey, ez)
    vol = abs(mpmath.det(mpmath.matrix([list(ex), list(ey), list(ez)])))
    edges = sum(dist(p, q) for p in C for q in C if sum(abs(a - b) for a, b in zip(p, q)) == 1) / 2
    # the diagonals as distances between opposite corners of a face and of the box
    return {
        'volume': float(vol), 'surface': float(top_bottom + walls), 'lateral': float(walls), 'base': float(face(ex, ey)),
        'fLW': float(dist(C[(0, 0, 0)], C[(1, 1, 0)])), 'fLH': float(dist(C[(0, 0, 0)], C[(1, 0, 1)])), 'fWH': float(dist(C[(0, 0, 0)], C[(0, 1, 1)])),
        'space': float(dist(C[(0, 0, 0)], C[(1, 1, 1)])), 'edges': float(sum(dist(C[p], C[q]) for p in C for q in C if p < q and sum(abs(a - b) for a, b in zip(p, q)) == 1)),
    }
res['box'] = [box_ref(*b) for b in data['boxes']]
res['exact'] = []
for l, w, h in data['bigBoxes']:
    l, w, h = int(l), int(w), int(h)
    res['exact'].append({'volume': str(l * w * h), 'surface': str(2 * (l * w + l * h + w * h)), 'lateral': str(2 * h * (l + w)), 'lw': str(l * l + w * w), 'lh': str(l * l + h * h), 'wh': str(w * w + h * h), 'space': str(l * l + w * w + h * h), 'edges': str(4 * (l + w + h))})
res['isqrt'] = [[str(math.isqrt(int(v))), math.isqrt(int(v)) ** 2 == int(v)] for v in data['sqInts']]

# the angles, from the diagonal vectors themselves
def angle(u, v):
    cs = sum(a * b for a, b in zip(u, v)) / (norm(u) * norm(v))
    return float(mpmath.degrees(mpmath.acos(min(mpmath.mpf(1), abs(cs)))))
res['angles'] = []
for l, w, h in data['boxes']:
    d = (l, w, h)
    res['angles'].append({
        'alpha': float(mpmath.degrees(mpmath.acos(mpmath.mpf(l) / norm(d)))), 'beta': float(mpmath.degrees(mpmath.acos(mpmath.mpf(w) / norm(d)))), 'gamma': float(mpmath.degrees(mpmath.acos(mpmath.mpf(h) / norm(d)))),
        'throughL': angle((l, w, h), (-l, w, h)), 'throughW': angle((l, w, h), (l, -w, h)), 'throughH': angle((l, w, h), (l, w, -h)),
    })

# the box of largest volume on a surface S, by a fine grid over the base
res['grid'] = []
for S in data['surfaces']:
    best = 0.0
    m = math.sqrt(S / 2)
    ls = np.linspace(0.01 * m, m, 600)
    L, W = np.meshgrid(ls, ls)
    H = (S / 2 - L * W) / (L + W)
    V = np.where(H > 0, L * W * H, 0)
    res['grid'].append(float(V.max()))

# the height on a surface, as a box whose surface is measured from its corners
res['surfH'] = []
for c in data['surfBoxes']:
    h = (c['S'] / 2 - c['l'] * c['w']) / (c['l'] + c['w'])
    res['surfH'].append({'h': h, 'back': float(box_ref(c['l'], c['w'], h)['surface']) if h > 0 else None})

# packing, cell by cell: the positions at which a small box with edges a, b, c fits with its corner on the grid a x b x c
def count(big, a, b, c):
    n = 0
    for i in range(0, big[0], 1):
        pass
    return (big[0] // a) * (big[1] // b) * (big[2] // c)
res['pack'] = []
for p in data['packs']:
    best = 0
    for perm in itertools.permutations(range(3)):
        a, b, c = [p['small'][i] for i in perm]
        # count by stepping along each side
        nx = sum(1 for k in range(1, p['big'][0] + 1) if k * a <= p['big'][0])
        ny = sum(1 for k in range(1, p['big'][1] + 1) if k * b <= p['big'][1])
        nz = sum(1 for k in range(1, p['big'][2] + 1) if k * c <= p['big'][2])
        best = max(best, nx * ny * nz)
    res['pack'].append(best)

# Pythagorean quadruples by brute force over the three edges
quads = []
D = data['QD']
for a in range(1, D):
    for b in range(a, D):
        for c in range(b, D):
            s = a * a + b * b + c * c
            if s > D * D: break
            d = math.isqrt(s)
            if d * d == s:
                quads.append([a, b, c, d, math.gcd(math.gcd(a, b), math.gcd(c, d)) == 1])
quads.sort(key=lambda q: (q[3], q[0], q[1], q[2]))
res['quads'] = quads

# Euler bricks, and the perfect ones
bricks = []
M = data['BC']
sq = lambda n: math.isqrt(n) ** 2 == n
for c in range(3, M + 1):
    for b in range(2, c):
        if not sq(b * b + c * c): continue
        for a in range(1, b):
            if sq(a * a + b * b) and sq(a * a + c * c):
                bricks.append([a, b, c, math.isqrt(a * a + b * b), math.isqrt(a * a + c * c), math.isqrt(b * b + c * c), sq(a * a + b * b + c * c)])
bricks.sort(key=lambda t: (t[2], t[1], t[0]))
res['bricks'] = bricks

res['leb'] = []
for m, n, p, q in data['leb']:
    a, b, c, d = m * m + n * n - p * p - q * q, 2 * (m * q + n * p), 2 * (n * q - m * p), m * m + n * n + p * p + q * q
    res['leb'].append({'ok': a * a + b * b + c * c == d * d, 'abcd': [str(a), str(b), str(c), str(d)]})
json.dump(res, open(sys.argv[2], 'w', encoding='utf-8'))
`

const inFile = path.join(tmp, 'in.json')
const outFile = path.join(tmp, 'out.json')
const pyFile = path.join(tmp, 'ref.py')
fs.writeFileSync(pyFile, PY)
fs.writeFileSync(inFile, JSON.stringify({ boxes, bigBoxes, sqInts, surfaces, surfBoxes, packs, leb, QD, BC }))
const py = spawnSync('python', [pyFile, inFile, outFile], { encoding: 'utf-8', maxBuffer: 1 << 28 })
if (py.status !== 0) {
  console.log('python reference failed:\n' + (py.stderr || py.stdout).split('\n').slice(-15).join('\n'))
  process.exit(1)
}
const R = JSON.parse(fs.readFileSync(outFile, 'utf8'))

/* -------------------------------------------------------------------- measures */

boxes.forEach(([l, w, h], i) => {
  const m = B.measures(l, w, h)
  const r = R.box[i]
  const where = `measures(${l.toFixed ? +l.toFixed(4) : l}, ${+w.toFixed(4)}, ${+h.toFixed(4)})`
  ok(close(m.volume, r.volume, 1e-12) && close(m.surface, r.surface, 1e-12), `${where}: volume ${m.volume}, surface ${m.surface}; corners give ${r.volume}, ${r.surface}`)
  ok(close(m.lateral, r.lateral, 1e-12) && close(m.base, r.base, 1e-12), `${where}: lateral ${m.lateral}, base ${m.base}; corners give ${r.lateral}, ${r.base}`)
  ok(close(m.faceDiagonalLW, r.fLW, 1e-12) && close(m.faceDiagonalLH, r.fLH, 1e-12) && close(m.faceDiagonalWH, r.fWH, 1e-12), `${where}: face diagonals`)
  ok(close(m.spaceDiagonal, r.space, 1e-12), `${where}: space diagonal ${m.spaceDiagonal}, corners give ${r.space}`)
  ok(close(m.edgeTotal, r.edges, 1e-12), `${where}: edges together ${m.edgeTotal}, corners give ${r.edges}`)
  ok(close(m.surface, m.lateral + 2 * m.base, 1e-12), `${where}: surface = walls + top + bottom`)
  ok(close(m.spaceDiagonal ** 2, m.faceDiagonalLW ** 2 + h * h, 1e-12), `${where}: d² = f² + h²`)
  const k = 1 + (i % 4)
  const sc = B.scaleFactors(k)
  ok(sc.length === k && sc.area === k * k && sc.volume === k ** 3, `scaleFactors(${k})`)
  // scaling the box by k scales the surface by k² and the volume by k³
  const big = B.measures(k * l, k * w, k * h)
  ok(close(big.surface, m.surface * k * k, 1e-12) && close(big.volume, m.volume * k ** 3, 1e-12), `${where}: scaling by ${k}`)
})
bigBoxes.forEach(([l, w, h], i) => {
  const e = B.exactMeasures(BigInt(l), BigInt(w), BigInt(h))
  const r = R.exact[i]
  const same =
    String(e.volume) === r.volume && String(e.surface) === r.surface && String(e.lateral) === r.lateral && String(e.faceDiagonalLW2) === r.lw && String(e.faceDiagonalLH2) === r.lh && String(e.faceDiagonalWH2) === r.wh && String(e.spaceDiagonal2) === r.space && String(e.edgeTotal) === r.edges
  ok(same, `exactMeasures(${l}, ${w}, ${h}) differs from Python's integers`)
})
sqInts.forEach((v, i) => {
  const [root, perfect] = R.isqrt[i]
  ok(String(B.isqrt(BigInt(v))) === root, `isqrt(${v}) = ${B.isqrt(BigInt(v))}, Python ${root}`)
  const ex = B.exactSqrt(BigInt(v))
  ok(perfect ? String(ex) === root : ex === null, `exactSqrt(${v}) = ${ex}, perfect square: ${perfect}`)
})
ok(B.exactSqrt(-4n) === null, 'no square root of a negative number here')

/* ------------------------------------------------------------------ one surface area */

surfaces.forEach((S, i) => {
  const best = B.bestVolumeForSurface(S)
  // the grid search cannot beat the cube, and gets close to it
  ok(R.grid[i] <= best * (1 + 1e-9), `surface ${S}: a box with volume ${R.grid[i]} beats the cube's ${best}`)
  ok(R.grid[i] >= best * (1 - 2e-3), `surface ${S}: the best box on the grid has volume ${R.grid[i]}, the cube's is ${best}`)
  const e = B.cubeEdgeForSurface(S)
  ok(close(6 * e * e, S, 1e-12) && close(e ** 3, best, 1e-12), `surface ${S}: the cube's edge ${e}`)
})
surfBoxes.forEach((c, i) => {
  const h = B.heightForSurface(c.S, c.l, c.w)
  const r = R.surfH[i]
  ok(close(h, r.h, 1e-12), `heightForSurface(${c.S}, ${c.l}, ${c.w}) = ${h}, expected ${r.h}`)
  const v = B.volumeForSurface(c.S, c.l, c.w)
  if (r.back !== null) {
    ok(close(r.back, c.S, 1e-9), `the box with that height has surface ${r.back}, not ${c.S}`)
    ok(close(v, c.l * c.w * h, 1e-12), `volumeForSurface(${c.S}, ${c.l}, ${c.w})`)
    ok(v <= B.bestVolumeForSurface(c.S) * (1 + 1e-9), `volume ${v} on surface ${c.S} beats the cube's ${B.bestVolumeForSurface(c.S)}`)
  } else ok(v === 0, `volumeForSurface(${c.S}, ${c.l}, ${c.w}) must be 0 when the base alone is too big`)
})
{
  // the cube is the only box that reaches the best volume
  const s = 96
  const e = B.cubeEdgeForSurface(s)
  ok(close(B.volumeForSurface(s, e, e), B.bestVolumeForSurface(s), 1e-12) && close(B.heightForSurface(s, e, e), e, 1e-12), 'on surface 96 the cube has edge 4 and volume 64')
  ok(close(e, 4, 1e-12) && close(B.bestVolumeForSurface(96), 64, 1e-12), 'cube of surface 96: edge 4, volume 64')
  ok(B.volumeForSurface(96, 6, 4) < 64 && B.volumeForSurface(96, 6, 4) > 0, 'a 6 × 4 × h box on surface 96 holds less than 64')
}

/* --------------------------------------------------------------------- the angles */

boxes.forEach(([l, w, h], i) => {
  const a = B.directionAngles(l, w, h)
  const r = R.angles[i]
  ok(close(a.alpha, r.alpha, 1e-10) && close(a.beta, r.beta, 1e-10) && close(a.gamma, r.gamma, 1e-10), `directionAngles(${l}, ${w}, ${h}): ${a.alpha}, ${a.beta}, ${a.gamma}; expected ${r.alpha}, ${r.beta}, ${r.gamma}`)
  ok(close(a.cosSquares, 1, 1e-12), `directionAngles: the squares of the cosines add to ${a.cosSquares}`)
  const d = B.anglesBetweenDiagonals(l, w, h)
  ok(close(d.throughL, r.throughL, 1e-9) && close(d.throughW, r.throughW, 1e-9) && close(d.throughH, r.throughH, 1e-9), `anglesBetweenDiagonals(${l}, ${w}, ${h}): ${d.throughL}, ${d.throughW}, ${d.throughH}; vectors give ${r.throughL}, ${r.throughW}, ${r.throughH}`)
})
{
  const c = B.anglesBetweenDiagonals(1, 1, 1)
  ok(close(c.throughL, 70.52877936550931, 1e-12) && close(c.throughW, c.throughL, 1e-12), 'a cube: every pair of space diagonals crosses at arccos(1/3)')
  const a = B.directionAngles(1, 1, 1)
  ok(close(a.alpha, 54.735610317245346, 1e-12), 'a cube: the diagonal makes 54.7356° with each edge')
}

/* ----------------------------------------------------------------------- fitting */

ok(B.fitsRod(2, 3, 6, 7) && !B.fitsRod(2, 3, 6, 7.0001), 'a rod of 7 fits exactly in 2 × 3 × 6, one of 7.0001 does not')
ok(!B.fitsRod(60, 40, 40, 100) && B.fitsRod(80, 50, 40, 100), 'a 1 m pole: not in 60 × 40 × 40 (82.46 cm), yes in 80 × 50 × 40 (102.47 cm)')
for (const [l, w, h] of boxes.slice(0, 200)) {
  const d = Math.sqrt(l * l + w * w + h * h)
  ok(B.fitsRod(l, w, h, d * 0.999) && !B.fitsRod(l, w, h, d * 1.001), `fitsRod around the diagonal of ${l}, ${w}, ${h}`)
}
packs.forEach((p, i) => {
  const r = B.gridPacking(p.big[0], p.big[1], p.big[2], p.small)
  const where = `gridPacking(${p.big}, ${p.small})`
  ok(r.count === R.pack[i], `${where}: ${r.count}, counting cell by cell gives ${R.pack[i]}`)
  ok(r.along[0] * r.along[1] * r.along[2] === r.count, `${where}: the counts along the sides must multiply to the total`)
  ok(r.order.slice().sort().join() === '0,1,2', `${where}: order is a permutation`)
  ok([0, 1, 2].every((k) => r.along[k] === Math.floor(p.big[k] / p.small[r.order[k]])), `${where}: along[k] = floor(big[k] / small[order[k]])`)
  ok(r.count * p.small[0] * p.small[1] * p.small[2] <= p.big[0] * p.big[1] * p.big[2], `${where}: more volume of small boxes than the big box has`)
})
ok(B.gridPacking(10, 6, 4, [3, 2, 1]).count === 40, '3 × 2 × 1 bricks fill 10 × 6 × 4 completely: 40')
ok(B.gridPacking(5, 5, 5, [6, 1, 1]).count === 0, 'bricks longer than the box do not fit')

/* ------------------------------------------------- whole-number diagonals */

{
  const qs = B.pythagoreanQuadruples(QD)
  const ref = R.quads
  ok(qs.length === ref.length, `pythagoreanQuadruples(${QD}): ${qs.length} found, brute force finds ${ref.length}`)
  for (let i = 0; i < Math.min(qs.length, ref.length); i++) {
    const q = qs[i]
    const r = ref[i]
    ok(Number(q.a) === r[0] && Number(q.b) === r[1] && Number(q.c) === r[2] && Number(q.d) === r[3] && q.primitive === r[4], `quadruple ${i}: ${q.a},${q.b},${q.c},${q.d} (${q.primitive}) vs ${r}`)
    ok(q.a * q.a + q.b * q.b + q.c * q.c === q.d * q.d && q.a <= q.b && q.b <= q.c, `quadruple ${q.a},${q.b},${q.c},${q.d}: a² + b² + c² = d² and a ≤ b ≤ c`)
  }
  const first = qs.slice(0, 5).map((q) => `${q.a},${q.b},${q.c},${q.d}`).join(' ')
  ok(first === '1,2,2,3 2,4,4,6 2,3,6,7 1,4,8,9 3,6,6,9', `the first quadruples: ${first}`)
  ok(qs.some((q) => q.a === 2n && q.b === 3n && q.c === 6n && q.d === 7n && q.primitive) && qs.some((q) => q.a === 3n && q.b === 4n && q.c === 12n && q.d === 13n), '(2, 3, 6, 7) and (3, 4, 12, 13) are quadruples')
}
leb.forEach(([m, n, p, q], i) => {
  const r = B.quadrupleFromFour(BigInt(m), BigInt(n), BigInt(p), BigInt(q))
  const ref = R.leb[i]
  ok(ref.ok, 'harness: four-number identity fails in Python')
  ok([r.a, r.b, r.c, r.d].map(String).join() === ref.abcd.join(), `quadrupleFromFour(${m}, ${n}, ${p}, ${q}) = ${[r.a, r.b, r.c, r.d]}, expected ${ref.abcd}`)
  ok(r.a * r.a + r.b * r.b + r.c * r.c === r.d * r.d, `quadrupleFromFour(${m}, ${n}, ${p}, ${q}): the squares add up`)
})
{
  const bricks = B.eulerBricks(BC)
  const ref = R.bricks
  ok(bricks.length === ref.length, `eulerBricks(${BC}): ${bricks.length} found, brute force finds ${ref.length}`)
  for (let i = 0; i < Math.min(bricks.length, ref.length); i++) {
    const t = bricks[i]
    const r = ref[i]
    ok(t.a === r[0] && t.b === r[1] && t.c === r[2] && t.fab === r[3] && t.fac === r[4] && t.fbc === r[5], `Euler brick ${i}: ${t.a},${t.b},${t.c} (${t.fab},${t.fac},${t.fbc}) vs ${r.slice(0, 6)}`)
  }
  const b0 = bricks[0]
  ok(b0.a === 44 && b0.b === 117 && b0.c === 240 && b0.fab === 125 && b0.fac === 244 && b0.fbc === 267, 'the smallest Euler brick is 44 × 117 × 240 with face diagonals 125, 244, 267')
  ok(bricks.some((t) => t.a === 85 && t.b === 132 && t.c === 720) || BC < 720, '85 × 132 × 720 is an Euler brick')
  const perfect = B.perfectCuboids(BC)
  ok(perfect.length === ref.filter((t) => t[6]).length && perfect.length === 0, `perfectCuboids(${BC}): ${perfect.length}; none is known, and none below ${BC}`)
  // an Euler brick with a whole space diagonal would be perfect: the nearest miss
  const miss = bricks.map((t) => Math.abs(Math.sqrt(t.a * t.a + t.b * t.b + t.c * t.c) - Math.round(Math.sqrt(t.a * t.a + t.b * t.b + t.c * t.c)))).reduce((x, y) => Math.min(x, y), 1)
  ok(miss > 1e-6 || BC < 100, 'the Euler bricks found never have a whole space diagonal')
}

/* ------------------------------------------------------------------------- net */

boxes.slice(0, 200).forEach(([l, w, h]) => {
  const net = B.boxNet(l, w, h)
  ok(net.length === 6, 'a net has six rectangles')
  ok(close(net.reduce((s, r) => s + r.area, 0), B.measures(l, w, h).surface, 1e-12), `boxNet(${l}, ${w}, ${h}): the areas must add up to the surface area`)
  ok(net.every((r) => close(r.area, r.w * r.h, 1e-12)), 'each area is base times height of its rectangle')
  ok(close(net[0].area, net[1].area, 1e-12) && close(net[2].area, net[3].area, 1e-12) && close(net[4].area, net[5].area, 1e-12), 'faces come in equal pairs')
})

console.log(`cuboid check: ${boxes.length} boxes, ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
