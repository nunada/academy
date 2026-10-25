/** Checks src/lib/linsys.ts against references that do not use it.
 *
 *   - Python `fractions`: an exact Gauss-Jordan elimination written separately, for the type of every system and its solution or its line;
 *   - SymPy: `linsolve` for the same, `Matrix.det` for D, Dx and Dy, `parse_expr` for the typed equations, and a condition number from the matrix itself;
 *   - brute force: every integer point of a grid tried against both equations, for small whole-number systems;
 *   - geometry: two points on each line and the cross product of the directions, for "parallel";
 *   - the steps: every elimination and substitution is checked as a chain of true consequences (each solution of the system satisfies each new equation),
 *     with the minimal whole multipliers, and its end agrees with the solver.
 *
 *  Random inputs come from a seeded generator, so a failure repeats; LINSYS_FAST=1 runs a smaller set (for the mutation tests).
 *  Run: npm run check:linsys   Needs Python with sympy.   Exit 1 on any failure. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const FAST = process.env.LINSYS_FAST === '1'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'linsys-'))
const out = path.join(tmp, 'linsys.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/linsys.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const L = await import('file://' + out.replace(/\\/g, '/'))

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
const rand = rng(0x51a5e7)
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1))
const pick = (xs) => xs[ri(0, xs.length - 1)]

const fstr = (r) => (r.d === 1n ? r.n.toString() : `${r.n}/${r.d}`)
const sysStr = (s) => [s.e1.a, s.e1.b, s.e1.c, s.e2.a, s.e2.b, s.e2.c].map(fstr)

// the checker's own exact arithmetic on BigInt fractions, so that it does not lean on the code it is checking
const rg = (a, b) => {
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b
  while (b) [a, b] = [b, a % b]
  return a
}
const rn = (n, d) => {
  if (d < 0n) [n, d] = [-n, -d]
  const g = rg(n, d) || 1n
  return { n: n / g, d: d / g }
}
const radd = (a, b) => rn(a.n * b.d + b.n * a.d, a.d * b.d)
const rsub = (a, b) => rn(a.n * b.d - b.n * a.d, a.d * b.d)
const rmul = (a, b) => rn(a.n * b.n, a.d * b.d)
const rdiv = (a, b) => rn(a.n * b.d, a.d * b.n)
const rz = (a) => a.n === 0n
const req = (a, b) => a.n === b.n && a.d === b.d
const rabs = (a) => (a.n < 0n ? { n: -a.n, d: a.d } : a)
const rsgn = (a) => (a.n > 0n ? 1 : a.n < 0n ? -1 : 0)
const sat = (e, x, y) => req(radd(rmul(e.a, x), rmul(e.b, y)), e.c)
const show = (s) => `${L.eqText(s.e1)} ; ${L.eqText(s.e2)}`

/* ------------------------------------------------------------------ the inputs */

const coefInt = () => (rand() < 0.15 ? 0 : ri(-9, 9))
const systems = []
const N_RANDOM = FAST ? 500 : 5000
for (let i = 0; i < N_RANDOM; i++) {
  systems.push(L.system(coefInt(), coefInt(), ri(-30, 30), coefInt(), coefInt(), ri(-30, 30)))
}
// the special families, on purpose: parallel, coincident, one equation a multiple of the other, equations with no unknown
for (let i = 0; i < (FAST ? 80 : 600); i++) {
  const a = ri(-7, 7)
  const b = ri(-7, 7)
  const c = ri(-20, 20)
  const k = pick([-3, -2, -1, 2, 3, 5])
  systems.push(L.system(a, b, c, k * a, k * b, k * c)) // the same line
  systems.push(L.system(a, b, c, k * a, k * b, k * c + pick([-2, -1, 1, 2, 7]))) // parallel
  systems.push(L.system(a, b, c, a, b, c + pick([1, 2, 3]))) // same left side, different right
}
for (const d of [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 5, 1, 1, 2],
  [0, 0, 0, 2, 3, 6],
  [1, 2, 3, 0, 0, 0],
  [0, 0, 5, 0, 0, 5],
  [0, 3, 6, 0, 2, 4],
  [0, 3, 6, 0, 2, 5],
  [4, 0, 8, 0, 5, 10],
  [1, 1, 10, 1, -1, 2], // the article's worked example: (6, 4)
  [2, 3, 12, 3, -1, 7],
  [3, 2, 16, 1, -1, 2],
  [2, 4, 10, 1, 2, 5],
  [2, 4, 10, 1, 2, 7],
]) systems.push(L.system(...d))
// fractions as coefficients
const randQ = () => L.Q(ri(-9, 9), pick([1, 1, 2, 3, 4, 5, 6, 7, 10]))
for (let i = 0; i < (FAST ? 80 : 800); i++) {
  systems.push({ e1: { a: randQ(), b: randQ(), c: randQ() }, e2: { a: randQ(), b: randQ(), c: randQ() } })
}
// big whole numbers: no overflow, nothing lost
for (let i = 0; i < (FAST ? 20 : 200); i++) {
  const big = () => BigInt(ri(-999999, 999999)) * BigInt(ri(1, 999999))
  systems.push({ e1: { a: L.Q(big()), b: L.Q(big()), c: L.Q(big()) }, e2: { a: L.Q(big()), b: L.Q(big()), c: L.Q(big()) } })
}

/* --------------------------------------------------------------- typed equations */

const sp = () => pick(['', ' ', '  '])
const numFor = (r) => {
  // a coefficient as typed: whole, decimal when it is one, fraction otherwise
  if (r.d === 1n) return r.n < 0n ? (-r.n).toString() : r.n.toString()
  const m = r.n < 0n ? -r.n : r.n
  // decimal when the denominator is 2, 4, 5, 10, 20, 25, 50, 100
  if ([2n, 4n, 5n, 10n, 20n, 25n, 50n, 100n].includes(r.d) && rand() < 0.6) {
    const digits = r.d === 2n || r.d === 5n || r.d === 10n ? 1 : 2
    const v = (Number(m) / Number(r.d)).toFixed(digits)
    return rand() < 0.3 ? v.replace('.', ',') : v
  }
  return `${m}/${r.d}`
}
function typed(e) {
  // the equation a·x + b·y = c written some random way (terms in either order, unknowns on the right, signs spelled differently), and its expected normal form
  const terms = []
  const push = (k, v) => {
    if (rz(k)) return
    const mag = numFor(rabs(k))
    const body = mag === '1' ? v : /\//.test(mag) ? `(${mag})${v}` : `${mag}${rand() < 0.2 ? '*' : ''}${v}`
    terms.push({ neg: k.n < 0n, body })
  }
  push(e.a, 'x')
  push(e.b, 'y')
  if (rand() < 0.5) terms.reverse()
  const minus = () => pick(['-', '−', '–'])
  let lhs = terms.map((t, i) => (i === 0 ? (t.neg ? minus() : '') : `${sp()}${t.neg ? minus() : '+'}${sp()}`) + t.body).join('')
  if (lhs === '') lhs = '0'
  const cText = (e.c.n < 0n ? minus() : '') + numFor(rabs(e.c))
  const cc = /\//.test(cText) && !/^[-−–]?\d+\/\d+$/.test(cText) ? cText : cText
  return `${lhs}${sp()}=${sp()}${cc}`
}
const eqs = []
for (let i = 0; i < (FAST ? 150 : 1500); i++) {
  const e = { a: i % 7 === 0 ? L.ZERO : randQ(), b: i % 11 === 0 ? L.ZERO : randQ(), c: i % 5 === 0 ? L.ZERO : randQ() }
  eqs.push({ e, src: typed(e) })
}
// moved terms: unknowns and numbers on both sides
const moved = []
for (let i = 0; i < (FAST ? 60 : 400); i++) {
  const p = ri(-8, 8)
  const q = ri(-8, 8)
  const r = ri(-8, 8)
  const t = ri(-8, 8)
  const u = ri(-8, 8)
  const v = ri(-8, 8)
  const term = (k, v_) => (k === 0 ? '' : `${k < 0 ? '-' : '+'}${Math.abs(k)}${v_}`)
  const left = `${term(p, 'x')}${term(q, 'y')}${term(r, '')}` || '0'
  const right = `${term(t, 'x')}${term(u, 'y')}${term(v, '')}` || '0'
  moved.push({ src: `${left.replace(/^\+/, '')}=${right.replace(/^\+/, '')}`, want: { a: p - t, b: q - u, c: v - r } })
}

const BAD_INPUT = [
  ['', 'empty'],
  ['   ', 'empty'],
  ['x+y', 'noequals'],
  ['x==1', 'noequals'],
  ['x=1=2', 'noequals'],
  ['=', 'empty'],
  ['2x+3y=', 'empty'],
  ['=5', 'empty'],
  ['2x 3y = 4', 'syntax'],
  ['2x+=3', 'syntax'],
  ['x/2 = 1', 'syntax'],
  ['2(x+y)=4', 'syntax'],
  ['z = 1', 'letters'],
  ['2x + 3z = 4', 'letters'],
  ['(1/0)x = 1', 'syntax'],
  ['1234567890x = 1', 'big'],
  ['x = 1.1234567890', 'big'],
  ['x + y = 3/', 'syntax'],
]

/* ------------------------------------------------------- the Python references */

const near = []
for (let i = 0; i < (FAST ? 40 : 300); i++) near.push([L.Q(ri(-50, 50) || 1, pick([1, 10, 100, 1000, 1000000])), L.Q(ri(-30, 30), pick([1, 10, 1000, 1000000]))])
// a negative eps below −1 turns the second line the other way, where the angle between the lines has to be folded back to at most 90 degrees
for (const [e, d] of [[L.Q(-3), L.Q(1, 5)], [L.Q(-41, 10), L.Q(-9, 10)], [L.Q(-7, 5), L.Q(3)], [L.Q(-1, 3), L.Q(1, 7)]]) near.push([e, d])
const conds = []
for (let i = 0; i < (FAST ? 60 : 500); i++) conds.push([ri(-9, 9), ri(-9, 9), ri(-9, 9), ri(-9, 9)])

const PY = String.raw`
import sys, json, re
from fractions import Fraction
import sympy
from sympy import symbols, Matrix, linsolve, S, Rational, Poly
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

data = json.load(open(sys.argv[1], encoding='utf-8'))
x, y = symbols('x y')
F = lambda s: Fraction(s)
res = {}

def rref(rows):
    rows = [r[:] for r in rows]
    piv = 0
    for col in range(2):
        r = next((i for i in range(piv, 2) if rows[i][col] != 0), None)
        if r is None:
            continue
        rows[piv], rows[r] = rows[r], rows[piv]
        rows[piv] = [v / rows[piv][col] for v in rows[piv]]
        for i in range(2):
            if i != piv and rows[i][col] != 0:
                f = rows[i][col]
                rows[i] = [a - f * b for a, b in zip(rows[i], rows[piv])]
        piv += 1
    return rows, piv

def own(sy):
    a1, b1, c1, a2, b2, c2 = [F(v) for v in sy]
    rows, rank = rref([[a1, b1, c1], [a2, b2, c2]])
    if any(r[0] == 0 and r[1] == 0 and r[2] != 0 for r in rows):
        return {'kind': 'none'}
    if rank == 0:
        return {'kind': 'plane'}
    if rank == 1:
        r = rows[0]
        return {'kind': 'line', 'row': [str(r[0]), str(r[1]), str(r[2])]}
    return {'kind': 'unique', 'x': str(rows[0][2]), 'y': str(rows[1][2])}

def sym_kind(sy, deep):
    a1, b1, c1, a2, b2, c2 = [Rational(v.numerator, v.denominator) for v in [F(t) for t in sy]]
    M = Matrix([[a1, b1], [a2, b2]])
    out = {'D': str(M.det())}
    out['Dx'] = str(Matrix([[c1, b1], [c2, b2]]).det())
    out['Dy'] = str(Matrix([[a1, c1], [a2, c2]]).det())
    if deep:
        sol = linsolve([a1 * x + b1 * y - c1, a2 * x + b2 * y - c2], (x, y))
        if sol == S.EmptySet:
            out['kind'] = 'none'
        else:
            t = list(sol)[0]
            free = set().union(*[e.free_symbols for e in t])
            if len(free) == 0:
                out['kind'] = 'unique'
                out['x'] = str(t[0])
                out['y'] = str(t[1])
            elif len(free) == 1:
                out['kind'] = 'line'
            else:
                out['kind'] = 'plane'
    return out

def geo_parallel(sy):
    # two points on each line and the cross product of the directions; None when an equation is not a line
    a1, b1, c1, a2, b2, c2 = [F(v) for v in sy]
    def dirn(a, b):
        return (-b, a)
    if (a1 == 0 and b1 == 0) or (a2 == 0 and b2 == 0):
        return None
    d1 = dirn(a1, b1)
    d2 = dirn(a2, b2)
    return d1[0] * d2[1] - d1[1] * d2[0] == 0

res['own'] = [own(s) for s in data['systems']]
res['sym'] = [sym_kind(s, i % data['deepEvery'] == 0) for i, s in enumerate(data['systems'])]
res['par'] = [geo_parallel(s) for s in data['systems']]

def dec(s):
    return re.sub(r'(\d+)\.(\d+)', lambda m: '(%d/%d)' % (int(m.group(1) + m.group(2)), 10 ** len(m.group(2))), s)

T = standard_transformations + (implicit_multiplication_application,)
def parse(src):
    s = src.replace('−', '-').replace('–', '-').replace(',', '.').replace(' ', '')
    l, r = s.split('=')
    e = parse_expr(dec(l), transformations=T, local_dict={'x': x, 'y': y}) - parse_expr(dec(r), transformations=T, local_dict={'x': x, 'y': y})
    p = Poly(e, x, y)
    return [str(p.coeff_monomial(x)), str(p.coeff_monomial(y)), str(-p.coeff_monomial(1))]
res['parse'] = [parse(s) for s in data['parses']]

def near(eps, delta):
    eps = F(eps); delta = F(delta)
    # x + y = 2 ; x + (1+eps) y = 2 + delta
    rows, rank = rref([[Fraction(1), Fraction(1), Fraction(2)], [Fraction(1), 1 + eps, 2 + delta]])
    xs, ys = rows[0][2], rows[1][2]
    # the angle between the lines from the direction vectors, in radians
    import math
    d1 = (-1.0, 1.0)
    d2 = (-float(1 + eps), 1.0)
    ang = abs(math.atan2(d1[0] * d2[1] - d1[1] * d2[0], d1[0] * d2[0] + d1[1] * d2[1]))
    deg = math.degrees(ang)
    return {'x': str(xs), 'y': str(ys), 'angle': min(deg, 180 - deg)}
res['near'] = [near(e, d) for e, d in data['near']]

import numpy as np
res['cond'] = [None if (a * d - b * c) == 0 else float(np.linalg.cond(np.array([[a, b], [c, d]], dtype=float), 1)) for a, b, c, d in data['conds']]
json.dump(res, open(sys.argv[2], 'w', encoding='utf-8'))
`

const inFile = path.join(tmp, 'in.json')
const outFile = path.join(tmp, 'out.json')
const pyFile = path.join(tmp, 'ref.py')
fs.writeFileSync(pyFile, PY)
const parses = [...eqs.map((x) => x.src), ...moved.map((m) => m.src)]
fs.writeFileSync(
  inFile,
  JSON.stringify({
    systems: systems.map(sysStr),
    deepEvery: FAST ? 4 : 6,
    parses,
    near: near.map(([e, d]) => [fstr(e), fstr(d)]),
    conds: conds,
  }),
)
const py = spawnSync('python', [pyFile, inFile, outFile], { encoding: 'utf8', maxBuffer: 1 << 28 })
if (py.status !== 0) {
  console.log('python reference failed:\n' + (py.stderr || py.stdout).split('\n').slice(-15).join('\n'))
  process.exit(1)
}
const R = JSON.parse(fs.readFileSync(outFile, 'utf8'))

/* ---------------------------------------------------------------- the solver */

const norm = (a, b, c) => {
  // a line a·x + b·y = c scaled so its first nonzero coefficient is 1
  const k = !rz(a) ? a : b
  return [rdiv(a, k), rdiv(b, k), rdiv(c, k)].map(fstr).join(' ')
}
const frac = (t) => {
  const [n, d] = t.split('/')
  return L.Q(BigInt(n), BigInt(d ?? 1))
}
const pointsOnLine = (a, b, c) => {
  // a few exact points on the line a·x + b·y = c (a, b not both zero)
  const pts = []
  for (const t of [0, 1, -2, 3]) {
    const T = L.Q(t)
    if (!rz(b)) pts.push([T, rdiv(rsub(c, rmul(a, T)), b)])
    else pts.push([rdiv(c, a), T])
  }
  return pts
}

systems.forEach((s, i) => {
  const sol = L.solve(s)
  const own = R.own[i]
  const sym = R.sym[i]
  const where = `solve(${show(s)})`
  if (!ok(sol.kind === own.kind, `${where}: kind ${sol.kind}, exact elimination says ${own.kind}`)) return
  if (sym.kind) ok(sol.kind === sym.kind, `${where}: kind ${sol.kind}, SymPy says ${sym.kind}`)
  if (sol.kind === 'unique') {
    ok(fstr(sol.x) === own.x && fstr(sol.y) === own.y, `${where}: (${fstr(sol.x)}, ${fstr(sol.y)}) but exact elimination gives (${own.x}, ${own.y})`)
    if (sym.kind) ok(sym.x === own.x && sym.y === own.y, `${where}: SymPy and Fractions disagree: harness problem`)
    ok(sat(s.e1, sol.x, sol.y) && sat(s.e2, sol.x, sol.y), `${where}: the answer does not satisfy both equations`)
  }
  if (sol.kind === 'line') ok(norm(sol.a, sol.b, sol.c) === own.row.map(String).join(' ').replace(/ /g, ' ') || norm(sol.a, sol.b, sol.c) === own.row.join(' '), `${where}: line ${norm(sol.a, sol.b, sol.c)} but exact elimination gives ${own.row.join(' ')}`)
  if (sol.kind === 'line') for (const [x, y] of pointsOnLine(sol.a, sol.b, sol.c)) ok(sat(s.e1, x, y) && sat(s.e2, x, y), `${where}: a point of the reported line does not satisfy both equations`)
  // D, Dx, Dy against SymPy's determinants, and parallel against the cross product of the directions
  const D = L.det(s)
  ok(fstr(D) === sym.D, `${where}: D = ${fstr(D)}, SymPy ${sym.D}`)
  const cr = L.cramer(s)
  ok((cr === null) === rz(D), `${where}: cramer is null exactly when D = 0`)
  if (cr) {
    ok(fstr(cr.Dx) === sym.Dx && fstr(cr.Dy) === sym.Dy, `${where}: Dx, Dy = ${fstr(cr.Dx)}, ${fstr(cr.Dy)}; SymPy ${sym.Dx}, ${sym.Dy}`)
    ok(fstr(cr.x) === own.x && fstr(cr.y) === own.y, `${where}: Cramer gives a different point`)
  }
  if (R.par[i] !== null) ok((sol.kind !== 'unique') === R.par[i], `${where}: parallel by cross product is ${R.par[i]}, but the solution is ${sol.kind}`)
  // brute force over a grid of integer points, for whole-number systems
  const whole = [s.e1.a, s.e1.b, s.e1.c, s.e2.a, s.e2.b, s.e2.c].every((r) => r.d === 1n && r.n >= -50n && r.n <= 50n)
  if (whole) {
    const [a1, b1, c1, a2, b2, c2] = [s.e1.a, s.e1.b, s.e1.c, s.e2.a, s.e2.b, s.e2.c].map((r) => Number(r.n))
    let found = 0
    let first = null
    for (let x = -30; x <= 30; x++)
      for (let y = -30; y <= 30; y++)
        if (a1 * x + b1 * y === c1 && a2 * x + b2 * y === c2) {
          found++
          first ??= [x, y]
        }
    if (sol.kind === 'none') ok(found === 0, `${where}: said no solution but (${first}) works`)
    if (sol.kind === 'plane') ok(found === 61 * 61, `${where}: said every point but the grid disagrees`)
    if (sol.kind === 'unique') {
      const isInt = sol.x.d === 1n && sol.y.d === 1n && Math.abs(Number(sol.x.n)) <= 30 && Math.abs(Number(sol.y.n)) <= 30
      ok(found === (isInt ? 1 : 0), `${where}: unique answer ${fstr(sol.x)}, ${fstr(sol.y)} but the grid finds ${found} integer points`)
    }
    if (sol.kind === 'line') {
      let line = 0
      const { a, b, c } = sol
      for (let x = -30; x <= 30; x++) for (let y = -30; y <= 30; y++) if (sat({ a, b, c }, L.Q(x), L.Q(y))) line++
      ok(found === line, `${where}: grid points on the common line ${line}, on both equations ${found}`)
    }
  }
})

/* ------------------------------------------------------------ the steps */

const points = (s, sol) => {
  // true points of the system, for testing consequences: the solution, or a few points of the line, or of the plane
  if (sol.kind === 'unique') return [[sol.x, sol.y]]
  if (sol.kind === 'line') return pointsOnLine(sol.a, sol.b, sol.c)
  if (sol.kind === 'plane') return [[L.Q(0), L.Q(0)], [L.Q(1), L.Q(-2)], [L.Q(3), L.Q(5)]]
  return []
}
const wholeEq = (e) => [e.a, e.b, e.c].every((r) => r.d === 1n)
const sameSol = (u, v) =>
  u.kind === v.kind && (u.kind !== 'unique' || (req(u.x, v.x) && req(u.y, v.y))) && (u.kind !== 'line' || norm(u.a, u.b, u.c) === norm(v.a, v.b, v.c))

for (const s of systems) {
  const sol = L.solve(s)
  const where = show(s)
  const pts = points(s, sol)
  // elimination of each unknown
  for (const v of ['x', 'y']) {
    const p = L.eliminationPlan(s, v)
    const absent = rz(v === 'x' ? s.e1.a : s.e1.b) && rz(v === 'x' ? s.e2.a : s.e2.b)
    ok((p === null) === absent, `eliminate ${v} in ${where}: plan is null exactly when the unknown is in neither equation`)
    if (!p) continue
    ok(wholeEq(p.whole.e1) && wholeEq(p.whole.e2), `eliminate ${v} in ${where}: step 0 must leave whole-number equations`)
    const lcmDen = (e) => [e.a, e.b, e.c].reduce((l, r) => (l / rg(l, r.d)) * r.d, 1n)
    ok(p.clear[0].n === lcmDen(s.e1) && p.clear[0].d === 1n && p.clear[1].n === lcmDen(s.e2) && p.clear[1].d === 1n, `eliminate ${v} in ${where}: step 0 multipliers ${fstr(p.clear[0])}, ${fstr(p.clear[1])} are not the least common multiples of the denominators`)
    ok(rz(v === 'x' ? p.result.a : p.result.b), `eliminate ${v} in ${where}: ${v} is still in ${L.eqText(p.result)}`)
    ok(p.k1.d === 1n && p.k2.d === 1n && p.k1.n >= 0n && p.k2.n >= 0n, `eliminate ${v} in ${where}: multipliers must be whole and not negative`)
    if (p.k1.n > 0n && p.k2.n > 0n) {
      ok(rg(p.k1.n, p.k2.n) === 1n, `eliminate ${v} in ${where}: multipliers ${p.k1.n}, ${p.k2.n} are not the smallest`)
      const c1 = v === 'x' ? p.whole.e1.a : p.whole.e1.b
      const c2 = v === 'x' ? p.whole.e2.a : p.whole.e2.b
      ok(p.op === (rsgn(c1) === rsgn(c2) ? 'sub' : 'add'), `eliminate ${v} in ${where}: ${p.op} with coefficients ${fstr(c1)}, ${fstr(c2)}`)
      ok(req(rabs(rmul(c1, p.k1)), rabs(rmul(c2, p.k2))), `eliminate ${v} in ${where}: scaled coefficients do not have equal size`)
    }
    for (const [x, y] of pts) ok(sat(p.result, x, y) && sat(p.scaled[0], x, y) && sat(p.scaled[1], x, y) && sat(p.whole.e1, x, y), `eliminate ${v} in ${where}: a true point does not satisfy the new equations`)
    const t = L.solveByElimination(s, v)
    ok(t && sameSol(t.solution, sol), `eliminate ${v} in ${where}: the trace ends at ${t?.solution.kind}, solve says ${sol.kind}`)
    if (t && t.outcome.kind === 'contradiction') ok(sol.kind === 'none', `eliminate ${v} in ${where}: a contradiction but the system has solutions`)
    if (t && t.outcome.kind === 'identity') ok(sol.kind !== 'none' && sol.kind !== 'unique', `eliminate ${v} in ${where}: 0 = 0 but the system is ${sol.kind}`)
    if (t && t.back) ok(sat(s.e1, ...(v === 'x' ? [t.back.other, t.back.value] : [t.back.value, t.back.other])), `eliminate ${v} in ${where}: the back-substituted point does not satisfy equation 1`)
  }
  const t = L.solveByElimination(s)
  if (L.easiestToEliminate(s) === null) ok(t === null, `${where}: no unknown to eliminate, yet a trace`)
  else ok(t && sameSol(t.solution, sol), `${where}: default elimination ends at ${t?.solution.kind}, solve says ${sol.kind}`)

  // substitution
  const u = L.solveBySubstitution(s)
  const none = [s.e1.a, s.e1.b, s.e2.a, s.e2.b].every(rz)
  if (none) {
    ok(u === null, `${where}: no unknowns anywhere, yet a substitution`)
    continue
  }
  if (!ok(u !== null, `${where}: no substitution found`)) continue
  ok(sameSol(u.solution, sol), `${where}: substitution ends at ${u.solution.kind}, solve says ${sol.kind}`)
  const src = u.plan.from === 1 ? s.e1 : s.e2
  // the isolating equation really holds: isolate = k0 + k1·other along the source equation
  for (const w of [0, 1, -3, 7]) {
    const W = L.Q(w)
    const val = radd(u.plan.k0, rmul(u.plan.k1, W))
    const [px, py2] = u.plan.isolate === 'x' ? [val, W] : [W, val]
    ok(sat(src, px, py2), `${where}: isolate ${u.plan.isolate} = ${fstr(u.plan.k0)} + ${fstr(u.plan.k1)}·${u.plan.other} fails the source equation at ${u.plan.other} = ${w}`)
  }
  if (u.outcome.kind === 'value') {
    ok(sol.kind === 'unique', `${where}: substitution found a value, but the system is ${sol.kind}`)
    ok(req(rmul(u.plan.result.coef, u.outcome.value), u.plan.result.rhs), `${where}: the one-unknown equation is not satisfied by its own value`)
  } else if (u.outcome.kind === 'contradiction') ok(sol.kind === 'none', `${where}: substitution contradiction but ${sol.kind}`)
  else ok(sol.kind === 'line' || sol.kind === 'plane', `${where}: substitution identity but ${sol.kind}`)
}

/* ----------------------------------------------------------- typed equations */

eqs.forEach(({ e, src }, i) => {
  const r = L.parseEquation(src)
  const ref = R.parse[i]
  if (!ok(r.ok, `parse "${src}": rejected (${r.error})`)) return
  ok([fstr(r.eq.a), fstr(r.eq.b), fstr(r.eq.c)].join(' ') === ref.join(' '), `parse "${src}": ${eqText0(r.eq)} but SymPy reads ${ref.join(' ')}`)
  ok(req(r.eq.a, e.a) && req(r.eq.b, e.b) && req(r.eq.c, e.c), `parse "${src}": expected ${L.eqText(e)}, got ${L.eqText(r.eq)}`)
  // writing it back and reading again must give the same equation
  const back = L.parseEquation(L.eqText(r.eq))
  ok(back.ok && req(back.eq.a, r.eq.a) && req(back.eq.b, r.eq.b) && req(back.eq.c, r.eq.c), `eqText round trip of ${L.eqText(r.eq)}`)
})
function eqText0(e) {
  return `${fstr(e.a)} ${fstr(e.b)} ${fstr(e.c)}`
}
moved.forEach((m, i) => {
  const r = L.parseEquation(m.src)
  const ref = R.parse[eqs.length + i]
  if (!ok(r.ok, `parse "${m.src}": rejected (${r.error})`)) return
  ok(r.eq.a.n === BigInt(m.want.a) && r.eq.a.d === 1n && r.eq.b.n === BigInt(m.want.b) && r.eq.c.n === BigInt(m.want.c), `parse "${m.src}": ${eqText0(r.eq)}, expected ${m.want.a} ${m.want.b} ${m.want.c}`)
  ok([fstr(r.eq.a), fstr(r.eq.b), fstr(r.eq.c)].join(' ') === ref.join(' '), `parse "${m.src}": ${eqText0(r.eq)} but SymPy reads ${ref.join(' ')}`)
})
for (const [src, want] of BAD_INPUT) {
  const r = L.parseEquation(src)
  ok(!r.ok && r.error === want, `parse "${src}": expected error ${want}, got ${r.ok ? 'an equation' : r.error}`)
}

/* ------------------------------------------------------------------ the picture */

for (let i = 0; i < (FAST ? 300 : 3000); i++) {
  const xmin = ri(-12, -1)
  const xmax = ri(1, 12)
  const ymin = ri(-12, -1)
  const ymax = ri(1, 12)
  const x0 = xmin + rand() * (xmax - xmin)
  const y0 = ymin + rand() * (ymax - ymin)
  const a = ri(-6, 6)
  const b = ri(-6, 6)
  if (a === 0 && b === 0) continue
  // a line through a point inside the window has to be found, and its ends lie on the line and on the window's edge
  const c = a * x0 + b * y0
  const e = { a: L.Q(a), b: L.Q(b), c: L.Q(BigInt(Math.round(c * 1e6)), 1000000n) }
  const cNum = Math.round(c * 1e6) / 1e6
  const seg = L.clip(e, xmin, xmax, ymin, ymax)
  if (!ok(seg !== null, `clip a=${a} b=${b} c=${cNum} in [${xmin},${xmax}]x[${ymin},${ymax}]: a line through the window was not found`)) continue
  for (const [x, y] of seg) {
    ok(Math.abs(a * x + b * y - cNum) < 1e-6 * Math.max(1, Math.abs(a) + Math.abs(b)), `clip: end (${x}, ${y}) is not on ${a}x + ${b}y = ${cNum}`)
    ok(x >= xmin - 1e-9 && x <= xmax + 1e-9 && y >= ymin - 1e-9 && y <= ymax + 1e-9, `clip: end (${x}, ${y}) is outside the window`)
    ok(Math.abs(x - xmin) < 1e-6 || Math.abs(x - xmax) < 1e-6 || Math.abs(y - ymin) < 1e-6 || Math.abs(y - ymax) < 1e-6, `clip: end (${x}, ${y}) is not on the window's edge`)
  }
  // far from the window: nothing
  const away = L.clip({ a: L.Q(1), b: L.Q(0), c: L.Q(xmax + 5) }, xmin, xmax, ymin, ymax)
  ok(away === null, 'clip: a vertical line outside the window should give null')
}
ok(L.clip(L.eq(0, 0, 3), -5, 5, -5, 5) === null, 'clip: 0 = 3 is no line')

/* ---------------------------------------------------- doubles and conditioning */

for (let i = 0; i < conds.length; i++) {
  const [a1, b1, a2, b2] = conds[i]
  const got = L.cond1(a1, b1, a2, b2)
  const ref = R.cond[i]
  if (ref === null) ok(got === Infinity, `cond1(${a1},${b1},${a2},${b2}): singular matrix must give Infinity`)
  else ok(Math.abs(got - ref) <= 1e-9 * ref, `cond1(${a1},${b1},${a2},${b2}) = ${got}, numpy ${ref}`)
}
for (let i = 0; i < (FAST ? 100 : 1000); i++) {
  const [a1, b1, c1, a2, b2, c2] = [ri(-9, 9), ri(-9, 9), ri(-30, 30), ri(-9, 9), ri(-9, 9), ri(-30, 30)]
  const s = L.system(a1, b1, c1, a2, b2, c2)
  const f = L.solveFloat(a1, b1, c1, a2, b2, c2)
  const sol = L.solve(s)
  if (sol.kind === 'unique') ok(Math.abs(f.x - L.toNumber(sol.x)) < 1e-9 && Math.abs(f.y - L.toNumber(sol.y)) < 1e-9, `solveFloat(${show(s)}): (${f.x}, ${f.y}) vs exact (${fstr(sol.x)}, ${fstr(sol.y)})`)
  else ok(f.D === 0, `solveFloat(${show(s)}): D should be exactly 0 for whole numbers when the system is ${sol.kind}`)
}
near.forEach(([eps, delta], i) => {
  const r = L.nearParallel(eps, delta)
  const ref = R.near[i]
  const where = `nearParallel(${fstr(eps)}, ${fstr(delta)})`
  if (!ok(r !== null, `${where}: null`)) return
  ok(fstr(r.exact.x) === ref.x && fstr(r.exact.y) === ref.y, `${where}: (${fstr(r.exact.x)}, ${fstr(r.exact.y)}) vs exact (${ref.x}, ${ref.y})`)
  ok(Math.abs(r.angle - ref.angle) <= 1e-9 * Math.max(1, ref.angle), `${where}: angle ${r.angle}, reference ${ref.angle}`)
  // the amplification is exactly 1/|eps|
  if (!rz(delta)) ok(req(r.amplification, rdiv(L.ONE, rabs(eps))), `${where}: amplification ${fstr(r.amplification)} is not 1/|eps|`)
})
ok(L.nearParallel(L.ZERO, L.Q(1)) === null, 'nearParallel with eps = 0 is the same line twice: null')

console.log(`linsys check: ${systems.length} systems, ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
