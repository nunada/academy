/** Checks src/lib/cube.ts against references that do not use it.
 *
 *   - folding: every set of six squares is folded in 3D coordinates, each square turned 90° about the edge it shares with the one before it, and accepted when the
 *     six squares end up as the six faces of a unit cube and every pair of neighbours still shares its edge; the cube rolling in `foldNet` has to agree on every
 *     case, including which squares end up opposite each other (squares whose corners are all different);
 *   - counting: 35 hexominoes and 11 nets, 6 + 3 + 1 + 1 by type, found again in Python with its own canonical form;
 *   - cross-sections: the area against Cavalieri's formula in mpmath, the number of sides against the number of faces the plane crosses (with exact fractions), a prism
 *     (a plane parallel to an edge) against a rectangle clipped by hand, and known shapes (triangle, hexagon, rectangle, square);
 *   - the cube's numbers against mpmath and Python integers, the corners, edges and faces against the definition, the rotation group against rotation matrices,
 *     cube roots against mpmath and integer search, sums of cubes against addition.
 *
 *  Random inputs come from a seeded generator, so a failure repeats; CUBE_FAST=1 runs a smaller set (for the mutation tests).
 *  Run: npm run check:cube   Needs Python with mpmath.   Exit 1 on any failure. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const FAST = process.env.CUBE_FAST === '1'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cube-'))
const out = path.join(tmp, 'cube.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/cube.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const C = await import('file://' + out.replace(/\\/g, '/'))

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
const rand = rng(0xc0be5)
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1))
const rf = (lo, hi) => lo + rand() * (hi - lo)

/* ------------------------------------------------------------------ the fold cases */

const turn = ([r, c]) => [c, -r]
const flip = ([r, c]) => [r, -c]
/** The same shape turned, flipped and moved somewhere else on the grid. */
function placed(cells) {
  let cur = cells
  for (let k = ri(0, 3); k > 0; k--) cur = cur.map(turn)
  if (rand() < 0.5) cur = cur.map(flip)
  const dr = ri(-3, 3)
  const dc = ri(-3, 3)
  return cur.map(([r, c]) => [r + dr, c + dc])
}
const hexes = C.hexominoes()
const foldCases = []
for (const h of hexes) {
  foldCases.push(h)
  for (let i = 0; i < (FAST ? 3 : 12); i++) foldCases.push(placed(h))
}
// six squares at random on a 5 x 5 board: usually not even joined, sometimes a loop or a 2 x 2 block
for (let i = 0; i < (FAST ? 400 : 4000); i++) {
  const s = new Set()
  while (s.size < 6) s.add(`${ri(0, 4)},${ri(0, 4)}`)
  foldCases.push([...s].map((k) => k.split(',').map(Number)))
}
// shapes grown from a square one neighbour at a time: always joined
for (let i = 0; i < (FAST ? 300 : 3000); i++) {
  const cells = [[2, 2]]
  const have = new Set(['2,2'])
  while (cells.length < 6) {
    const [r, c] = cells[ri(0, cells.length - 1)]
    const [dr, dc] = [[0, 1], [0, -1], [1, 0], [-1, 0]][ri(0, 3)]
    const k = `${r + dr},${c + dc}`
    if (!have.has(k)) {
      have.add(k)
      cells.push([r + dr, c + dc])
    }
  }
  foldCases.push(cells)
}

/* ------------------------------------------------------------------- the sections */

const secCases = []
for (let i = 0; i < (FAST ? 300 : 3000); i++) {
  const n = [rf(0.2, 3), rf(0.2, 3), rf(0.2, 3)]
  secCases.push({ n, t: rf(0.001, n[0] + n[1] + n[2] - 0.001) * 0.999 })
}
// whole-number normals and rational heights: the sides are counted exactly
const sideCases = []
for (let i = 0; i < (FAST ? 300 : 3000); i++) {
  const n = [ri(1, 6), ri(1, 6), ri(1, 6)]
  const sum = n[0] + n[1] + n[2]
  // a height between corners, avoiding every corner's height n.v exactly
  const den = 97
  let k
  do k = ri(1, sum * den - 1)
  while (vertexHeights(n).some((h) => h * den === k))
  sideCases.push({ n, num: k, den })
}
function vertexHeights(n) {
  const hs = []
  for (let s = 0; s < 8; s++) hs.push((s & 1 ? n[0] : 0) + (s & 2 ? n[1] : 0) + (s & 4 ? n[2] : 0))
  return hs
}
// a plane parallel to the z axis: n3 = 0, the section is a rectangle 1 high
const prismCases = []
for (let i = 0; i < (FAST ? 100 : 1000); i++) {
  const n = [rf(0.1, 3), rf(0.1, 3)]
  prismCases.push({ n, t: rf(0.001, n[0] + n[1] - 0.001) })
}

/* ------------------------------------------------------------------- misc inputs */

const edgesA = [0.5, 1, 2, 3, 7, 10, 12.5, 100, 0.001]
for (let i = 0; i < (FAST ? 20 : 100); i++) edgesA.push(rf(0.01, 1000))
const bigEdges = []
for (let i = 0; i < 60; i++) bigEdges.push(String(BigInt(ri(1, 999999)) * BigInt(ri(1, 999999)) * BigInt(ri(1, 999999))))
const cbrtIn = [2, 3, 5, 10, 27, 0.001, 1e6, 123456.789, 1e-9]
const cubeInts = []
for (let i = 0; i < (FAST ? 100 : 600); i++) {
  const m = BigInt(ri(0, 99999)) * BigInt(ri(0, 99999))
  const c = m ** 3n
  cubeInts.push(String(c), String(c + 1n), String(c > 0n ? c - 1n : 0n), String(BigInt(ri(0, 1e9))))
}

const PY = String.raw`
import sys, json, math
from fractions import Fraction
import mpmath
mpmath.mp.dps = 40

data = json.load(open(sys.argv[1], encoding='utf-8'))
res = {}

# ----------------------------------------------------------------- folding in 3D
def mat_mul(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]
def mat_vec(A, v):
    return [sum(A[i][k] * v[k] for k in range(3)) for i in range(3)]
I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
def Ry(s):  # quarter turn about the y axis, s = +1 or -1
    return [[0, 0, s], [0, 1, 0], [-s, 0, 0]]
def Rx(s):
    return [[1, 0, 0], [0, 0, -s], [0, s, 0]]

def fold(cells):
    cells = [tuple(c) for c in cells]
    cs = set(cells)
    if len(cs) != 6:
        return {'ok': False}
    # each cell (r, c) is the flat square with corners (c, r), (c+1, r), (c+1, r+1), (c, r+1); a transform is (M, t) with T(p) = M p + t
    T = {cells[0]: (I3, [0, 0, 0])}
    queue = [cells[0]]
    while queue:
        cur = queue.pop(0)
        M, t = T[cur]
        r, c = cur
        for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            nb = (r + dr, c + dc)
            if nb not in cs or nb in T:
                continue
            # fold the neighbour up, about the edge it shares with this square, in this square's own flat frame
            if dc == 1:
                R, a = Ry(-1), [c + 1, 0, 0]
            elif dc == -1:
                R, a = Ry(1), [c, 0, 0]
            elif dr == 1:
                R, a = Rx(1), [0, r + 1, 0]
            else:
                R, a = Rx(-1), [0, r, 0]
            Ra = mat_vec(R, a)
            shift = [a[i] - Ra[i] for i in range(3)]   # p' = R p + (a - R a)
            M2 = mat_mul(M, R)
            t2 = [x + y for x, y in zip(mat_vec(M, shift), t)]
            T[nb] = (M2, t2)
            queue.append(nb)
    if len(T) != 6:
        return {'ok': False}
    def corners(cell):
        r, c = cell
        M, t = T[cell]
        return [tuple(x + y for x, y in zip(mat_vec(M, [cc, rr, 0]), t)) for cc, rr in ((c, r), (c + 1, r), (c + 1, r + 1), (c, r + 1))]
    # every pair of neighbours has to share the two corners of its common edge, tree edge or not (a 2 x 2 block fails here)
    for (r, c) in cells:
        for dr, dc in ((0, 1), (1, 0)):
            nb = (r + dr, c + dc)
            if nb in cs:
                shared = set(corners((r, c))) & set(corners(nb))
                if len(shared) != 2:
                    return {'ok': False}
    squares = {c: frozenset(corners(c)) for c in cells}
    if len(set(squares.values())) != 6:
        return {'ok': False}
    pts = set().union(*squares.values())
    mins = [min(p[i] for p in pts) for i in range(3)]
    maxs = [max(p[i] for p in pts) for i in range(3)]
    if any(maxs[i] - mins[i] != 1 for i in range(3)) or len(pts) != 8:
        return {'ok': False}
    idx = {c: i for i, c in enumerate(cells)}
    opp = sorted([sorted([idx[a], idx[b]]) for a in cells for b in cells if idx[a] < idx[b] and not (squares[a] & squares[b])])
    return {'ok': True, 'opp': opp}

res['fold'] = [fold(c) for c in data['fold']]

# ------------------------------------------------------- free hexominoes, from scratch
def symmetries(cells):
    out = []
    cur = list(cells)
    for f in range(2):
        for k in range(4):
            cur = [(c, -r) for r, c in cur]
            r0 = min(r for r, c in cur); c0 = min(c for r, c in cur)
            out.append(tuple(sorted((r - r0, c - c0) for r, c in cur)))
        cur = [(r, -c) for r, c in cur]
    return out
def canon(cells):
    return min(symmetries(cells))
shapes = {canon([(0, 0)])}
for size in range(1, 6):
    nxt = set()
    for s in shapes:
        have = set(s)
        for r, c in s:
            for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                n = (r + dr, c + dc)
                if n not in have:
                    nxt.add(canon(list(s) + [n]))
    shapes = nxt
res['hexCount'] = len(shapes)
res['hexCanon'] = sorted(json.dumps(s) for s in shapes)
res['jsCanon'] = sorted(json.dumps(canon([tuple(c) for c in cells])) for cells in data['hexes'])
res['netCount'] = sum(1 for s in shapes if fold(list(s))['ok'])

# ---------------------------------------------------------------- cross-sections
def pos(x):
    return x if x > 0 else mpmath.mpf(0)
def cavalieri(n, t):
    n = [mpmath.mpf(x) for x in n]; t = mpmath.mpf(t)
    s = mpmath.mpf(0)
    for mask in range(8):
        shift = sum(n[i] for i in range(3) if mask >> i & 1)
        x = pos(t - shift)
        s += (-1) ** bin(mask).count('1') * x * x
    return mpmath.sqrt(sum(v * v for v in n)) * s / (2 * n[0] * n[1] * n[2])
res['areas'] = [float(cavalieri(c['n'], c['t'])) for c in data['sec']]

def faces_crossed(n, num, den):
    t = Fraction(num, den)
    d = {}
    for mask in range(8):
        d[mask] = sum(n[i] * (mask >> i & 1) for i in range(3)) - t
    cnt = 0
    for axis in range(3):
        for v in (0, 1):
            vals = [d[m] for m in range(8) if (m >> axis & 1) == v]
            if min(vals) < 0 < max(vals):
                cnt += 1
    return cnt
res['sides'] = [faces_crossed(c['n'], c['num'], c['den']) for c in data['sides']]

def clipped_length(n1, n2, t):
    # the length of the line n1 x + n2 y = t inside the unit square, by clipping its parametric form against the square's four sides
    n1 = mpmath.mpf(n1); n2 = mpmath.mpf(n2); t = mpmath.mpf(t)
    n = mpmath.sqrt(n1 * n1 + n2 * n2)
    p0 = (n1 * t / (n * n), n2 * t / (n * n))
    d = (-n2 / n, n1 / n)
    lo, hi = mpmath.mpf('-1e9'), mpmath.mpf('1e9')
    for k in range(2):
        if abs(d[k]) < mpmath.mpf('1e-30'):
            if p0[k] < 0 or p0[k] > 1:
                return mpmath.mpf(0)
            continue
        a, b = (0 - p0[k]) / d[k], (1 - p0[k]) / d[k]
        if a > b:
            a, b = b, a
        lo, hi = max(lo, a), min(hi, b)
    return max(hi - lo, mpmath.mpf(0))
res['prism'] = [float(clipped_length(c['n'][0], c['n'][1], c['t']) * 1) for c in data['prism']]

# ------------------------------------------------------------ measures and the rest
def meas(a):
    a = mpmath.mpf(a)
    return {
        'surface': float(6 * a * a), 'volume': float(a ** 3), 'face': float(a * mpmath.sqrt(2)), 'space': float(a * mpmath.sqrt(3)),
        'in': float(a / 2), 'mid': float(a / mpmath.sqrt(2)), 'circ': float(a * mpmath.sqrt(3) / 2),
    }
res['meas'] = [meas(a) for a in data['edges']]
res['exact'] = [{'surface': str(6 * int(a) ** 2), 'volume': str(int(a) ** 3), 'f2': str(2 * int(a) ** 2), 's2': str(3 * int(a) ** 2)} for a in data['bigEdges']]
res['consts'] = {
    'insphere': float(mpmath.pi / 6), 'circum': float(mpmath.pi * mpmath.sqrt(3) / 2),
    'diagAngle': float(mpmath.degrees(mpmath.acos(mpmath.mpf(1) / 3))), 'faceAngle': float(mpmath.degrees(mpmath.atan(1 / mpmath.sqrt(2)))),
}
res['cbrt'] = [float(mpmath.cbrt(mpmath.mpf(v))) for v in data['cbrtIn']]

def iroot(n):
    lo, hi = 0, 1
    while hi ** 3 < n:
        hi *= 2
    while lo < hi:
        mid = (lo + hi) // 2
        if mid ** 3 < n:
            lo = mid + 1
        else:
            hi = mid
    return str(lo) if lo ** 3 == n else None
res['iroot'] = [iroot(int(v)) for v in data['cubeInts']]
res['sumcubes'] = [str(sum(k ** 3 for k in range(1, n + 1))) for n in data['sumN']]

# dice: the 24 turns from rotation matrices acting on the face normals, then labelings up to turning
import itertools
def rot90(axis, s):
    c, sn = 0, s
    if axis == 0: return ((1, 0, 0), (0, c, -sn), (0, sn, c))
    if axis == 1: return ((c, 0, sn), (0, 1, 0), (-sn, 0, c))
    return ((c, -sn, 0), (sn, c, 0), (0, 0, 1))
def mm(A, B):
    return tuple(tuple(sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)) for i in range(3))
group = {((1, 0, 0), (0, 1, 0), (0, 0, 1))}
frontier = list(group)
while frontier:
    g = frontier.pop()
    for ax in range(3):
        h = mm(rot90(ax, 1), g)
        if h not in group:
            group.add(h); frontier.append(h)
normals = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)]
def act(g, v):
    return tuple(sum(g[i][k] * v[k] for k in range(3)) for i in range(3))
perms = []
for g in group:
    perms.append([normals.index(act(g, v)) for v in normals])
classes = set(); sevens = set()
for lab in itertools.permutations(range(1, 7)):
    form = min(tuple(lab[p[i]] for i in range(6)) for p in perms)
    classes.add(form)
    if lab[0] + lab[1] == 7 and lab[2] + lab[3] == 7 and lab[4] + lab[5] == 7:
        sevens.add(form)
res['dice'] = {'turns': len(group), 'all': len(classes), 'seven': len(sevens)}
f = math.factorial
res['rubik'] = str(f(8) * 3 ** 7 * f(12) * 2 ** 11 // 2)
json.dump(res, open(sys.argv[2], 'w', encoding='utf-8'))
`

const inFile = path.join(tmp, 'in.json')
const outFile = path.join(tmp, 'out.json')
const pyFile = path.join(tmp, 'ref.py')
fs.writeFileSync(pyFile, PY)
const sumN = []
for (let i = 0; i < 40; i++) sumN.push(ri(0, 300))
fs.writeFileSync(
  inFile,
  JSON.stringify({ fold: foldCases, hexes: hexes, sec: secCases, sides: sideCases, prism: prismCases, edges: edgesA, bigEdges, cbrtIn, cubeInts, sumN }),
)
const py = spawnSync('python', [pyFile, inFile, outFile], { encoding: 'utf-8', maxBuffer: 1 << 28 })
if (py.status !== 0) {
  console.log('python reference failed:\n' + (py.stderr || py.stdout).split('\n').slice(-15).join('\n'))
  process.exit(1)
}
const R = JSON.parse(fs.readFileSync(outFile, 'utf8'))

/* -------------------------------------------------------------------- folding */

const cellKey = (c) => `${c[0]},${c[1]}`
const OPP = new Map([[0, 1], [1, 0], [2, 3], [3, 2], [4, 5], [5, 4]])
let foldOk = 0
foldCases.forEach((cells, i) => {
  const mine = C.foldNet(cells)
  const ref = R.fold[i]
  const where = `foldNet(${cells.map(cellKey).join(' ')})`
  if (!ok(mine.ok === ref.ok, `${where}: ${mine.ok ? 'folds' : 'does not fold (' + mine.reason + ')'}, but folding in 3D says ${ref.ok ? 'it folds' : 'it does not'}`)) return
  if (!mine.ok) return
  foldOk++
  // the pairs of squares that end up opposite each other
  const uniq = [...new Map(cells.map((c) => [cellKey(c), c])).values()]
  const opp = []
  for (let a = 0; a < uniq.length; a++)
    for (let b = a + 1; b < uniq.length; b++) if (OPP.get(mine.face.get(cellKey(uniq[a]))) === mine.face.get(cellKey(uniq[b]))) opp.push([a, b])
  ok(JSON.stringify(opp) === JSON.stringify(ref.opp), `${where}: opposite squares ${JSON.stringify(opp)}, folding in 3D gives ${JSON.stringify(ref.opp)}`)
  ok(new Set(mine.face.values()).size === 6, `${where}: the six squares must land on six different faces`)
})
ok(foldOk > 0, 'no net found among the cases')
// not six squares at all
ok(C.foldNet([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]).reason === 'count', 'five squares: reason must be "count"')
ok(C.foldNet([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]]).reason === 'count', 'seven squares: reason must be "count"')
ok(C.foldNet([[0, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]).reason === 'count', 'a repeated square is one square')
ok(C.foldNet([[0, 0], [0, 1], [0, 2], [3, 0], [3, 1], [3, 2]]).reason === 'disconnected', 'two separate rows: reason must be "disconnected"')
ok(C.foldNet([[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]]).reason === 'loop', 'a 2 x 3 block: reason must be "loop"')
const longRow = C.foldNet([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]])
ok(!longRow.ok && longRow.reason === 'overlap', 'a row of six: the first and fifth squares land on the same face')

/* ------------------------------------------------------------------- counting */

ok(hexes.length === 35 && R.hexCount === 35, `hexominoes: ${hexes.length}, Python ${R.hexCount}; there are 35`)
ok(JSON.stringify(R.hexCanon) === JSON.stringify(R.jsCanon), 'the hexominoes found are not the same shapes as Python finds')
ok(R.netCount === 11, `nets by folding in 3D: ${R.netCount}, expected 11`)
const nets = C.cubeNets()
ok(nets.length === 11, `cubeNets: ${nets.length}, expected 11`)
const byType = {}
for (const n of nets) byType[n.type] = (byType[n.type] ?? 0) + 1
ok(JSON.stringify(byType) === JSON.stringify({ '4-1-1': 6, '3-2-1': 3, '2-2-2': 1, '3-3': 1 }), `nets by type: ${JSON.stringify(byType)}`)
ok(nets.map((n) => n.type).join() === [...nets.map((n) => n.type)].sort((a, b) => ['4-1-1', '3-2-1', '2-2-2', '3-3'].indexOf(a) - ['4-1-1', '3-2-1', '2-2-2', '3-3'].indexOf(b)).join(), 'nets must be listed by type')
ok(C.cellsFromRows(['#.#', '.#.']).length === 3 && C.cellsFromRows(['X#']).length === 2, 'cellsFromRows')

/* ---------------------------------------------------------------- cross-sections */

secCases.forEach(({ n, t }, i) => {
  const s = C.crossSection(n, t)
  const where = `crossSection([${n.map((x) => x.toFixed(3))}], ${t.toFixed(4)})`
  ok(close(s.area, R.areas[i], 1e-8), `${where}: area ${s.area}, Cavalieri's formula ${R.areas[i]}`)
  ok(close(C.sectionAreaFormula(n, t), R.areas[i], 1e-8), `${where}: sectionAreaFormula ${C.sectionAreaFormula(n, t)}, mpmath ${R.areas[i]}`)
  // every corner lies on the plane and in the cube, and the area scales with the square of the edge
  for (const p of s.points) {
    ok(Math.abs(n[0] * p[0] + n[1] * p[1] + n[2] * p[2] - t) < 1e-8 * (1 + t), `${where}: a corner is not on the plane`)
    ok(p.every((x) => x >= -1e-9 && x <= 1 + 1e-9), `${where}: a corner is outside the cube`)
  }
  if (i % 7 === 0) {
    const a = rf(0.5, 20)
    const big = C.crossSection(n, t * a, a)
    ok(close(big.area, s.area * a * a, 1e-8), `${where}: area for edge ${a} should be ${s.area * a * a}, is ${big.area}`)
  }
})
sideCases.forEach(({ n, num, den }, i) => {
  const t = num / den
  const s = C.crossSection(n, t)
  ok(s.sides === R.sides[i], `crossSection([${n}], ${num}/${den}): ${s.sides} sides, the plane crosses ${R.sides[i]} faces`)
})
prismCases.forEach(({ n, t }, i) => {
  const s = C.crossSection([n[0], n[1], 0], t)
  ok(close(s.area, R.prism[i], 1e-8), `prism section [${n.map((x) => x.toFixed(3))}, 0] at ${t.toFixed(4)}: area ${s.area}, rectangle ${R.prism[i]}`)
})
// laid flat, the corners keep every distance between them
for (const { n, t } of secCases.slice(0, 200)) {
  const s = C.crossSection(n, t)
  const flat = C.flatten(s.points, n)
  for (let i = 0; i < flat.length; i++)
    for (let j = i + 1; j < flat.length; j++) {
      const d3 = Math.hypot(s.points[i][0] - s.points[j][0], s.points[i][1] - s.points[j][1], s.points[i][2] - s.points[j][2])
      ok(close(Math.hypot(flat[i][0] - flat[j][0], flat[i][1] - flat[j][1]), d3, 1e-9), `flatten: distance between corners ${i} and ${j} changed`)
    }
}
// shapes that are known
const sq3 = Math.sqrt(3)
for (const [t, kind, area] of [[0.5, 'equilateral triangle', (sq3 / 2) * 0.25], [1.5, 'regular hexagon', (3 * sq3) / 4], [2.5, 'equilateral triangle', (sq3 / 2) * 0.25]]) {
  const s = C.crossSection([1, 1, 1], t)
  ok(C.polygonKind(s) === kind, `plane x+y+z=${t}: kind ${C.polygonKind(s)}, expected ${kind}`)
  ok(close(s.area, area), `plane x+y+z=${t}: area ${s.area}, expected ${area}`)
}
ok(C.polygonKind(C.crossSection([1, 1, 1], 1.2)) === 'hexagon', 'plane x+y+z=1.2 cuts a hexagon that is not regular')
ok(C.crossSection([1, 1, 1], 1.2).sides === 6, 'plane x+y+z=1.2: six sides')
ok(C.polygonKind(C.crossSection([0, 0, 1], 0.5)) === 'square', 'a plane parallel to a face cuts a square')
ok(close(C.crossSection([0, 0, 1], 0.5, 3).area, 9), 'a face-parallel section of the edge-3 cube has area 9')
ok(C.polygonKind(C.crossSection([1, 1, 0], 0.5)) === 'rectangle', 'a plane parallel to an edge cuts a rectangle')
ok(C.polygonKind(C.crossSection([1, 1, 0], 1 / Math.SQRT2)) === 'square', 'the rectangle through x+y=1/√2 is a square')
ok(close(C.crossSection([1, 1, 0], 1).area, Math.SQRT2), 'the plane x+y=1 through two opposite edges cuts a rectangle of area √2')
ok(C.polygonKind(C.crossSection([1, 1, 1], 0)) === 'point', 'x+y+z=0 touches the cube at one corner')
ok(C.crossSection([1, 1, 1], 4) .sides === 0, 'x+y+z=4 misses the cube')
ok(C.crossSection([0, 0, 0], 1) === null, 'the zero vector is no plane')
ok(C.polygonKind(C.crossSection([1, 0, 0], 0)) === 'square', 'the plane of a face is a square')
const par = C.crossSection([1, 2, 0], 1.0)
ok(C.polygonKind(par) === 'rectangle', 'a plane parallel to the z axis at a slant cuts a rectangle')
const tri = C.crossSection([1, 2, 3], 0.5)
ok(C.polygonKind(tri) === 'scalene triangle', 'a corner of the cube cut off by x+2y+3z=0.5 is a scalene triangle')
// the regular hexagon has the six midpoints of edges as corners
const hexSec = C.crossSection([1, 1, 1], 1.5)
const mids = [[1, 0.5, 0], [1, 0, 0.5], [0.5, 1, 0], [0, 1, 0.5], [0.5, 0, 1], [0, 0.5, 1]]
ok(mids.every((m) => hexSec.points.some((p) => Math.hypot(p[0] - m[0], p[1] - m[1], p[2] - m[2]) < 1e-9)), 'the regular hexagon must have the six edge midpoints as corners')

/* ----------------------------------------------------------------- the numbers */

edgesA.forEach((a, i) => {
  const m = C.measures(a)
  const r = R.meas[i]
  const where = `measures(${a})`
  ok(close(m.surface, r.surface, 1e-12) && close(m.volume, r.volume, 1e-12), `${where}: surface ${m.surface} volume ${m.volume}, expected ${r.surface}, ${r.volume}`)
  ok(close(m.faceDiagonal, r.face, 1e-12) && close(m.spaceDiagonal, r.space, 1e-12), `${where}: diagonals ${m.faceDiagonal}, ${m.spaceDiagonal}, expected ${r.face}, ${r.space}`)
  ok(close(m.inRadius, r.in, 1e-12) && close(m.midRadius, r.mid, 1e-12) && close(m.circumRadius, r.circ, 1e-12), `${where}: radii ${m.inRadius}, ${m.midRadius}, ${m.circumRadius}, expected ${r.in}, ${r.mid}, ${r.circ}`)
  ok(close(m.faceArea * 6, m.surface, 1e-12), `${where}: surface is six faces`)
  // the diagonals from the corners themselves
  const vs = C.vertices().map((c) => c.map((x) => x * a))
  ok(close(Math.hypot(vs[7][0] - vs[0][0], vs[7][1] - vs[0][1], vs[7][2] - vs[0][2]), m.spaceDiagonal, 1e-12), `${where}: space diagonal from corners 0 and 7`)
  ok(close(Math.hypot(vs[3][0] - vs[0][0], vs[3][1] - vs[0][1], vs[3][2] - vs[0][2]), m.faceDiagonal, 1e-12), `${where}: face diagonal from corners 0 and 3`)
  const k = 1 + (i % 5)
  const s = C.scaleFactors(k)
  ok(s.length === k && s.area === k * k && s.volume === k * k * k, `scaleFactors(${k})`)
})
bigEdges.forEach((a, i) => {
  const e = C.exactMeasures(BigInt(a))
  const r = R.exact[i]
  ok(String(e.surface) === r.surface && String(e.volume) === r.volume && String(e.faceDiagonalSquared) === r.f2 && String(e.spaceDiagonalSquared) === r.s2, `exactMeasures(${a}) differs from Python's integers`)
})
ok(close(C.INSPHERE_FRACTION, R.consts.insphere, 1e-14) && close(C.CIRCUMSPHERE_RATIO, R.consts.circum, 1e-14), 'sphere fractions')
ok(close(C.ANGLE_BETWEEN_SPACE_DIAGONALS, R.consts.diagAngle, 1e-12) && close(C.ANGLE_DIAGONAL_TO_FACE, R.consts.faceAngle, 1e-12), 'diagonal angles')
// the space diagonals really meet at that angle: corners 0-7 and 1-6
{
  const d1 = [1, 1, 1]
  const d2 = [-1, 1, 1]
  ok(close((Math.acos((d1[0] * d2[0] + d1[1] * d2[1] + d1[2] * d2[2]) / 3) * 180) / Math.PI, C.ANGLE_BETWEEN_SPACE_DIAGONALS, 1e-12), 'angle between the diagonals of corners 0-7 and 1-6')
}

/* ------------------------------------------------------------ the corners and so on */

{
  const vs = C.vertices()
  ok(vs.length === 8 && new Set(vs.map((v) => v.join())).size === 8, '8 different corners')
  ok(vs.every((v) => v.every((x) => x === 0 || x === 1)), 'corner coordinates are 0 or 1')
  const es = C.edges()
  ok(es.length === 12, `${es.length} edges`)
  ok(es.every(([i, j]) => Math.hypot(vs[i][0] - vs[j][0], vs[i][1] - vs[j][1], vs[i][2] - vs[j][2]) === 1), 'every edge has length 1')
  const fs_ = C.faces()
  ok(fs_.length === 6, `${fs_.length} faces`)
  const edgeSet = new Set(es.map((e) => e.join()))
  for (const f of fs_) {
    ok(f.length === 4 && new Set(f).size === 4, 'a face has four different corners')
    ok([0, 1, 2].some((ax) => f.every((i) => vs[i][ax] === vs[f[0]][ax])), 'a face has one coordinate fixed')
    for (let k = 0; k < 4; k++) {
      const a = Math.min(f[k], f[(k + 1) % 4])
      const b = Math.max(f[k], f[(k + 1) % 4])
      ok(edgeSet.has(`${a},${b}`), `the corners of face ${f} in order: ${a}-${b} is not an edge`)
    }
  }
  // each edge belongs to exactly two faces, each corner to three
  for (const [i, j] of es) ok(fs_.filter((f) => f.includes(i) && f.includes(j)).length === 2, `edge ${i}-${j} must be in two faces`)
  for (let i = 0; i < 8; i++) ok(fs_.filter((f) => f.includes(i)).length === 3 && es.filter((e) => e.includes(i)).length === 3, `corner ${i} must meet three faces and three edges`)
  const e = C.euler()
  ok(e.V === 8 && e.E === 12 && e.F === 6 && e.chi === 2, 'Euler: 8 - 12 + 6 = 2')
  for (let v = 0; v < 8; v++) ok(JSON.stringify(C.distancesFromVertex(v)) === JSON.stringify({ 1: 3, 2: 3, 3: 1 }), `distances from corner ${v}`)
  const g = C.grayWalk()
  ok(new Set(g).size === 8, 'the walk visits every corner once')
  for (let k = 0; k < 8; k++) ok(es.some(([a, b]) => (a === g[k] && b === g[(k + 1) % 8]) || (b === g[k] && a === g[(k + 1) % 8])), `walk step ${k}: ${g[k]} to ${g[(k + 1) % 8]} is not along an edge`)
}

/* ---------------------------------------------------------- cube numbers, dice */

cbrtIn.forEach((v, i) => {
  const x = C.cbrtNewton(v, Math.max(1, v > 1 ? v / 3 : 1), 80)
  ok(close(x[x.length - 1], R.cbrt[i], 1e-12), `cbrtNewton(${v}): ${x[x.length - 1]}, mpmath ${R.cbrt[i]}`)
  const err = x.map((y) => Math.abs(y - R.cbrt[i]))
  ok(err[err.length - 1] <= err[0] + 1e-300, `cbrtNewton(${v}): the error must not grow overall`)
})
{
  const it = C.cbrtNewton(2, 1, 5)
  ok(it.length === 6 && close(it[1], 4 / 3) && close(it[2], 91 / 72, 1e-12), `cbrtNewton(2, 1): 1, 4/3, 91/72 expected, got ${it.slice(0, 3)}`)
  ok(Math.abs(it[5] - Math.cbrt(2)) < 1e-14, 'five steps of Newton from 1 give ∛2 to 14 digits')
}
cubeInts.forEach((v, i) => {
  const mine = C.exactCubeRoot(BigInt(v))
  ok((mine === null ? null : String(mine)) === R.iroot[i], `exactCubeRoot(${v}): ${mine}, Python ${R.iroot[i]}`)
})
ok(C.exactCubeRoot(-8n) === null, 'no cube root for a negative number here')
sumN.forEach((n, i) => ok(String(C.sumOfCubes(BigInt(n))) === R.sumcubes[i], `sumOfCubes(${n})`))
for (let i = 0; i < 100; i++) {
  const a = rf(0.1, 9)
  const b = rf(0.1, 9)
  const pieces = C.binomialCubePieces(a, b)
  ok(pieces.reduce((s, p) => s + p.count, 0) === 8, 'a binomial cube breaks into 8 pieces')
  ok(close(pieces.reduce((s, p) => s + p.count * p.volume, 0), (a + b) ** 3, 1e-12), `binomialCubePieces(${a}, ${b}): the pieces must add up to (a + b)³`)
}
{
  const rots = C.rotations()
  ok(rots.length === 24 && new Set(rots.map((r) => r.join())).size === 24, `rotations: ${rots.length}, expected 24 different`)
  ok(rots.every((r) => new Set(r).size === 6), 'a turn is a permutation of the six faces')
  ok(rots.every((r) => [[0, 1], [2, 3], [4, 5]].every(([a, b]) => OPP.get(r[a]) === r[b])), 'a turn keeps opposite faces opposite')
  const d = C.distinctDice()
  ok(d.all === R.dice.all && d.oppositeSeven === R.dice.seven, `distinctDice ${JSON.stringify(d)}, rotation matrices give ${JSON.stringify(R.dice)}`)
  ok(R.dice.turns === 24 && d.all === 30 && d.oppositeSeven === 2, 'there are 30 dice, 2 of them with opposite faces adding to 7')
  ok(String(C.rubikPositions()) === R.rubik && R.rubik === '43252003274489856000', `rubikPositions ${C.rubikPositions()}, expected 43252003274489856000`)
}

console.log(`cube check: ${foldCases.length} fold cases (${foldOk} fold), ${secCases.length + sideCases.length + prismCases.length} sections, ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
