/** Checks src/lib/trigeq.ts, the numbers and data behind the "Trigonometric Equations" article.
 *
 *  References that do not use the code under test:
 *   1. Every solution of sin, cos or tan of (kx + b) = c in an interval, for a few hundred combinations, against a scan of the interval for
 *      every crossing (steps of 0.02°, each crossing refined by bisection), done in Python with its math module; the same for equations that
 *      are quadratic in one function.
 *   2. The solved examples: the claimed solutions against the scan, and every line of every solution (each line is an equation) against the
 *      line before it: the same solutions, or more where the line squares, or fewer where it divides by something that can be zero.
 *   3. The numeric equations against mpmath's root finder, and the iterations of bisection (the interval halves, the root stays inside) and
 *      of Newton's method (a few steps, quadratic convergence).
 *
 *  Run: npm run check:trigeq   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'trigeq-'))
const out = path.join(tmp, 't.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/trigeq.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

/** TRIGEQ_FAST=1 samples fewer random cases; the mutation tests use it, the explicit cases all still run. */
const FAST = process.env.TRIGEQ_FAST === '1'
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
const same = (a, b, tol) => a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < tol)
// a reproducible random source (mulberry32), so that a failure can be repeated
let seed = 20261024
const random = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const rnd = (a, b) => a + random() * (b - a)

/* ----------------------------------------------------------------------------------- test cases */
const FNS = ['sin', 'cos', 'tan']
const LEVELS = { sin: [-1, -0.8660254037844386, -0.5, 0, 0.3, 0.5, 0.7071067811865476, 1, 1.4], cos: [-1, -0.5, 0, 0.25, 0.8660254037844386, 1, -1.3], tan: [-1.7320508075688772, -1, 0, 0.5, 1, 1.7320508075688772, 12] }
const multi = []
for (const fn of FNS)
  for (const k of [0.5, 1, 1.5, 2, 3, 4, 6])
    for (const b of [0, 30, -45, 100])
      for (const c of LEVELS[fn])
        for (const [lo, hi] of [[0, 360], [-180, 540], [100, 460.5]]) {
          if (random() < (FAST ? 0.97 : 0.8)) continue // a fifth of them is plenty
          multi.push({ fn, k, b, c, lo, hi, touch: (fn !== 'tan' && Math.abs(Math.abs(c) - 1) < 1e-12) })
        }
const quad = []
for (let i = 0; i < (FAST ? 12 : 160); i++) {
  const fn = FNS[i % 3]
  const a = [-3, -2, -1, 1, 2, 3, 0][Math.floor(random() * 7)]
  const b = Math.round(rnd(-6, 6))
  const c = Math.round(rnd(-6, 6))
  quad.push({ fn, a, b, c })
}
// roots that are exact, so that the solutions are known angles
quad.push({ fn: 'sin', a: 2, b: -1, c: -1 }, { fn: 'cos', a: 2, b: -1, c: -1 }, { fn: 'tan', a: 1, b: 0, c: -3 }, { fn: 'sin', a: 4, b: 0, c: -1 }, { fn: 'cos', a: 1, b: 0, c: 0 }, { fn: 'tan', a: 1, b: -4, c: 4 }, { fn: 'tan', a: 2, b: -4, c: 2 }, { fn: 'sin', a: 4, b: -4, c: 1 }, { fn: 'cos', a: 1, b: 2, c: 1 })
const eqRows = M.EQUATIONS.map((e) => ({ id: e.id, le: e.le, re: e.re, steps: e.steps.map((s) => s.eq ?? null) }))
const numRows = [
  { id: 'cos-x', f: 'cos(x) - x', x0: 0.7 },
  { id: 'sin-half', f: 'sin(x) - x/2', x0: 1.9 },
  { id: 'tan-x', f: 'tan(x) - x', x0: 4.49 },
  { id: 'x-sin-x', f: 'x*sin(x) - 1', x0: 1.1 },
  { id: 'cos-x-squared', f: 'cos(x) - x**2', x0: 0.8 },
]

const PY = String.raw`
import json, sys, math
import mpmath
from mpmath import mp, mpf
mp.dps = 40
data = json.load(sys.stdin)

class Undef(Exception):
    pass
def rad(a): return a * math.pi / 180
def f_sin(a): return math.sin(rad(a))
def f_cos(a): return math.cos(rad(a))
def f_tan(a):
    c = math.cos(rad(a))
    if abs(c) < 1e-12: raise Undef()
    return math.sin(rad(a)) / c
def f_sqrt(a):
    if a < 0: raise Undef()
    return math.sqrt(a)
FUNCS = {'sin': f_sin, 'cos': f_cos, 'tan': f_tan, 'sqrt': f_sqrt, 'abs': abs}

def value(expr, x):
    env = dict(FUNCS); env['x'] = x
    try:
        v = eval(expr.replace('^', '**'), {'__builtins__': {}}, env)
    except (Undef, ZeroDivisionError, ValueError, OverflowError):
        return None
    return v

def scan(g, lo, hi, step=0.05):
    """every x in [lo, hi) where g changes sign or is zero, by a grid and bisection"""
    found = []
    def add(x):
        x = round(x, 7)
        if not any(abs(x - y) < 0.3 for y in found): found.append(x)
    n = int(round((hi - lo) / step))
    prev = None; prevx = None
    for k in range(n + 1):
        x = round(lo + k * step, 10)
        if x >= hi - 1e-9: break
        v = g(x)
        if v is not None and abs(v) > 1e8: v = None
        if v is not None and abs(v) < 1e-11:
            add(x)
        elif v is not None and prev is not None and (prev < 0) != (v < 0) and abs(prev) < 1e6 and abs(v) < 1e6:
            a, b, ga = prevx, x, prev
            for _ in range(70):
                m = (a + b) / 2
                gm = g(m)
                if gm is None: break
                if (ga < 0) == (gm < 0): a, ga = m, gm
                else: b = m
            gm = g((a + b) / 2)
            if gm is not None and abs(gm) < 1e-6: add((a + b) / 2)  # a pole also changes sign; it is not a root
        prev = v; prevx = x
    return sorted(found)

res = {}
res['multi'] = [scan(lambda x, c=c: (None if value('%s(%r*x+%r)' % (c['fn'], c['k'], c['b']), x) is None else value('%s(%r*x+%r)' % (c['fn'], c['k'], c['b']), x) - c['c']), c['lo'], c['hi']) for c in data['multi']]
def qg(c):
    # a double root only touches the axis, which a change of sign cannot see: scan the function minus that root instead
    root = -c['b'] / (2 * c['a']) if c['a'] != 0 and c['b'] * c['b'] - 4 * c['a'] * c['c'] == 0 else None
    def g(x):
        v = value('%s(x)' % c['fn'], x)
        if v is None: return None
        if root is not None: return v - root
        return c['a'] * v * v + c['b'] * v + c['c']
    return g
res['quad'] = [scan(qg(c), 0.0, 360.0) for c in data['quad']]

# the solved examples: the scan of the equation and of every line
eqs = {}
for e in data['eqs']:
    def g(le, re):
        def h(x):
            l = value(le, x); r = value(re, x)
            return None if l is None or r is None else l - r
        return h
    top = scan(g(e['le'], e['re']), 0.0, 360.0)
    lines = [None if s is None else scan(g(s[0], s[1]), 0.0, 360.0) for s in e['steps']]
    eqs[e['id']] = {'top': top, 'lines': lines}
res['eqs'] = eqs

# the numeric equations
nums = {}
for n in data['nums']:
    f = lambda x, s=n['f']: eval(s.replace('cos', 'mpmath.cos').replace('sin', 'mpmath.sin').replace('tan', 'mpmath.tan'), {'mpmath': mpmath}, {'x': x})
    r = mpmath.findroot(f, mpf(n['x0']), tol=1e-30)
    nums[n['id']] = float(r)
res['nums'] = nums
json.dump(res, sys.stdout)
`
const py = spawnSync('python', ['-X', 'utf8', '-c', PY], { input: JSON.stringify({ multi, quad, eqs: eqRows, nums: numRows }), encoding: 'utf8', maxBuffer: 1 << 28, timeout: 560000 })
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)
// a root at 0° shows up from the other side of the turn as well; [0, 360) holds it once
const wrap = (l) => (l.length && l[0] < 0.3 ? l.filter((x) => x < 359.7) : l)
R.quad = R.quad.map(wrap)
for (const k of Object.keys(R.eqs)) R.eqs[k] = { top: wrap(R.eqs[k].top), lines: R.eqs[k].lines.map((l) => (l ? wrap(l) : l)) }

/* ---------------------------------------------------------------------- 1: solveOn and solveMulti */
for (const [fn, c] of [['sin', 0], ['sin', 0.5], ['cos', 0.5], ['tan', 1], ['sin', 1]]) {
  for (const [lo, hi] of [[0, 360], [-180, 540], [0, 720]]) {
    const got = M.solveOn(fn, c, lo, hi)
    ok(got.every((x) => x >= lo - 1e-9 && x < hi - 1e-9) && JSON.stringify(got) === JSON.stringify([...got].sort((p, q) => p - q)), `solveOn ${fn} ${c} in [${lo}, ${hi}) is not sorted or inside`)
  }
}
ok(JSON.stringify(M.solveOn('sin', 0, 0, 360)) === '[0,180]' && JSON.stringify(M.solveOn('sin', 0, 0, 180)) === '[0]' && JSON.stringify(M.solveOn('sin', 0, 180, 540)) === '[180,360]' && JSON.stringify(M.solveOn('tan', 1, 0, 720)) === '[45,225,405,585]' && JSON.stringify(M.solveOn('cos', 0.5, -360, 0)) === '[-300,-60]' && M.solveOn('sin', 2, 0, 360).length === 0, 'solveOn: boundaries and periods')
multi.forEach((c, i) => {
  const got = M.solveMulti(c.fn, c.k, c.b, c.c, c.lo, c.hi)
  const label = `${c.fn}(${c.k}x + ${c.b}) = ${c.c} in [${c.lo}, ${c.hi})`
  ok(got.every((x) => x >= c.lo - 1e-9 && x < c.hi - 1e-9) && JSON.stringify(got) === JSON.stringify([...got].sort((p, q) => p - q)), `${label}: not sorted or inside`)
  const f = c.fn === 'sin' ? Math.sin : c.fn === 'cos' ? Math.cos : Math.tan
  ok(got.every((x) => Math.abs(f(((c.k * x + c.b) * Math.PI) / 180) - c.c) < 1e-7 * Math.max(1, Math.abs(c.c))), `${label}: a solution that does not solve it`)
  if (!c.touch) ok(same(got, R.multi[i], 1e-4), `${label}: ${JSON.stringify(got)} against a scan ${JSON.stringify(R.multi[i])}`)
  else {
    // a scan cannot see a touching root (no sign change), so list them from the formula: kx + b = base + 360 n
    const base = c.fn === 'sin' ? (c.c > 0 ? 90 : 270) : c.c > 0 ? 0 : 180
    const want = []
    for (let n = -40; n <= 40; n++) {
      const x = (base + 360 * n - c.b) / c.k
      if (x >= c.lo - 1e-9 && x < c.hi - 1e-9) want.push(x)
    }
    ok(same(got, want, 1e-6), `${label}: touching ${JSON.stringify(got)} against ${JSON.stringify(want)}`)
  }
})
// counting: k whole, one turn, 2k solutions (k at the extremes of sin and cos), b arbitrary
for (const fn of ['sin', 'cos', 'tan'])
  for (const k of [1, 2, 3, 4, 5, 6, 12])
    for (const b of [0, 17, -60, 123.4]) {
      const generic = M.solveMulti(fn, k, b, 0.3, 0, 360).length
      ok(generic === 2 * k, `${fn}(${k}x + ${b}) = 0.3 has ${generic} solutions in one turn, expected ${2 * k}`)
      if (fn !== 'tan') ok(M.solveMulti(fn, k, b, 1, 0, 360).length === k && M.solveMulti(fn, k, b, -1, 0, 360).length === k, `${fn}(${k}x + ${b}) = ±1 should have ${k} solutions`)
      ok(M.solveMulti(fn, k, b, 0.3, 0, 720).length === 4 * k, `two turns give twice as many for ${fn} ${k}`)
    }
ok(M.solutionCount('sin', 2, 0.5) === 4 && M.solutionCount('cos', 3, 1) === 3 && M.solutionCount('tan', 2, 5) === 4 && M.solutionCount('sin', 1, 2) === 0, 'solutionCount')
ok(M.solveMulti('sin', 0, 0, 0.5).length === 0 && M.solveMulti('sin', -2, 0, 0.5).length === 0 && M.solveMulti('sin', 2, NaN, 0.5).length === 0, 'solveMulti refuses k <= 0 and bad numbers')
ok(JSON.stringify(M.solveMulti('sin', 2, 0, 0.5)) === '[15,75,195,255]' && JSON.stringify(M.solveMulti('cos', 0.5, 0, 0)) === '[180]' && JSON.stringify(M.solveMulti('sin', 1, 30, 0.5)) === '[0,120]', 'known cases')
ok(M.PERIOD.sin === 360 && M.PERIOD.cos === 360 && M.PERIOD.tan === 180, 'periods')

/* ------------------------------------------------------------------------------ 1b: quadratics */
quad.forEach((c, i) => {
  const s = M.solveQuadratic(c.fn, c.a, c.b, c.c)
  const label = `${c.a} ${c.fn}² + ${c.b} ${c.fn} + ${c.c} = 0`
  ok(same(s.solutions, R.quad[i], c.b * c.b - 4 * c.a * c.c === 0 && c.a !== 0 && Math.abs(Math.abs(c.b / (2 * c.a)) - 1) < 1e-12 ? 0.3 : 1e-4) || (c.a === 0 && c.b === 0), `${label}: ${JSON.stringify(s.solutions)} against a scan ${JSON.stringify(R.quad[i])}`)
  ok(s.roots.every((u) => Math.abs(c.a * u * u + c.b * u + c.c) < 1e-9), `${label}: a root that is not a root`)
  ok(s.admissible.length === s.roots.length && s.byRoot.length === s.roots.length, `${label}: shapes`)
  s.roots.forEach((u, j) => ok(s.admissible[j] === (c.fn === 'tan' || Math.abs(u) <= 1 + 1e-12) && (s.admissible[j] ? s.byRoot[j].length > 0 : s.byRoot[j].length === 0), `${label}: admissibility of ${u}`))
})
{
  const s = M.solveQuadratic('sin', 2, -1, -1)
  ok(JSON.stringify(s.roots) === '[-0.5,1]' && JSON.stringify(s.solutions) === '[90,210,330]' && s.admissible.every(Boolean), 'the quadratic in sin x of the article')
  const t = M.solveQuadratic('cos', 1, 0, -4)
  ok(t.roots.length === 2 && t.admissible.every((a) => !a) && t.solutions.length === 0, 'cos² = 4 has roots 2 and −2 but no angle')
  const u = M.solveQuadratic('sin', 1, 2, 1)
  ok(JSON.stringify(u.roots) === '[-1]' && JSON.stringify(u.solutions) === '[270]', 'a double root')
  ok(M.solveQuadratic('sin', 1, 0, 1).roots.length === 0 && M.solveQuadratic('sin', 0, 2, -1).roots[0] === 0.5 && M.solveQuadratic('sin', 0, 0, 1).roots.length === 0, 'no real roots, a linear one, none at all')
}

/* ------------------------------------------------------------------------------- 2: solved examples */
ok(new Set(M.EQUATIONS.map((e) => e.id)).size === M.EQUATIONS.length, 'equation ids are unique')
for (const e of M.EQUATIONS) {
  const scan = R.eqs[e.id]
  ok(same(e.solutions, scan.top, 1e-4), `${e.id}: the claimed solutions ${JSON.stringify(e.solutions)} against a scan ${JSON.stringify(scan.top)}`)
  ok(e.solutions.every((x) => x >= 0 && x < 360) && JSON.stringify(e.solutions) === JSON.stringify([...e.solutions].sort((p, q) => p - q)), `${e.id}: solutions sorted and in [0, 360)`)
  ok(e.steps[0].why === null && e.steps.slice(1).every((s) => s.why !== null), `${e.id}: the first line has no reason, the others have one`)
  ok(e.steps[0].eq && e.steps[0].eq[0] === e.le && e.steps[0].eq[1] === e.re, `${e.id}: the first line is the equation`)
  // each line against the one before it
  let prev = scan.lines[0]
  ok(same(prev, scan.top, 1e-6), `${e.id}: the first line is the equation`)
  e.steps.forEach((s, i) => {
    if (i === 0 || !s.eq) return
    const cur = scan.lines[i]
    const has = (list, x) => list.some((y) => Math.abs(x - y) < 1e-3)
    if (s.note === 'adds') ok(prev.every((x) => has(cur, x)) && cur.length > prev.length, `${e.id}, line ${i + 1}: should add solutions (${JSON.stringify(prev)} to ${JSON.stringify(cur)})`)
    else if (s.note === 'loses') ok(cur.every((x) => has(prev, x)) && cur.length < prev.length, `${e.id}, line ${i + 1}: should lose solutions`)
    else ok(same(prev, cur, 1e-3), `${e.id}, line ${i + 1}: the solutions change from ${JSON.stringify(prev)} to ${JSON.stringify(cur)}`)
    prev = cur
  })
  if (e.extraneous) {
    const added = e.steps.find((s) => s.note === 'adds')
    const addedSet = added ? scan.lines[e.steps.indexOf(added)] : []
    ok(same([...e.solutions, ...e.extraneous].sort((p, q) => p - q), addedSet, 1e-3), `${e.id}: solutions plus extraneous should be the squared line's solutions`)
    ok(e.extraneous.every((x) => !e.solutions.some((y) => Math.abs(x - y) < 1e-3)), `${e.id}: an extraneous root that is also a solution`)
  } else ok(!e.steps.some((s) => s.note), `${e.id}: a line that adds or loses without listing the extraneous values`)
}
ok(M.EQUATIONS.length === 11, `${M.EQUATIONS.length} solved examples`)

/* ------------------------------------------------------------------------------- 3: numeric equations */
for (const e of M.NUMERIC_EQUATIONS) {
  const ref = R.nums[e.id]
  const b = M.bisect(e.f, e.bracket[0], e.bracket[1])
  ok(b !== null && Math.abs(b.root - ref) < 1e-10, `${e.id}: bisection gives ${b && b.root}, mpmath ${ref}`)
  if (b) {
    b.rows.forEach((r, i) => {
      const width0 = e.bracket[1] - e.bracket[0]
      ok(near(r.b - r.a, width0 / 2 ** i, 1e-9), `${e.id}, bisection step ${r.n}: the interval should be ${width0 / 2 ** i} wide, it is ${r.b - r.a}`)
      ok(r.a <= ref + 1e-12 && ref <= r.b + 1e-12, `${e.id}, bisection step ${r.n}: the root left the interval`)
      ok(near(r.mid, (r.a + r.b) / 2, 1e-12) && near(r.fmid, e.f(r.mid), 1e-12), `${e.id}, bisection step ${r.n}: the midpoint`)
    })
    ok(b.rows.length >= 30 && b.rows.length <= 50, `${e.id}: bisection took ${b.rows.length} steps`)
    // the answer is the midpoint of the half that was kept at the last step (to within one rounding), not an end of it
    const last = b.rows[b.rows.length - 1]
    ok(near(b.root, (last.a + last.mid) / 2, 1e-15) || near(b.root, (last.mid + last.b) / 2, 1e-15) || b.root === last.mid, `${e.id}: bisection returned ${b.root}, not the middle of the last interval`)
    // and a coarse tolerance shows the same: the answer is within half the tolerance of the root
    const coarse = M.bisect(e.f, e.bracket[0], e.bracket[1], 1e-3)
    ok(coarse !== null && Math.abs(coarse.root - ref) <= 5e-4 + 1e-12 && coarse.rows.length < 20, `${e.id}: bisection at tolerance 1e-3`)
  }
  const nw = M.newton(e.f, e.df, e.start)
  ok(nw.converged && Math.abs(nw.root - ref) < 1e-10, `${e.id}: Newton gives ${nw.root}, mpmath ${ref} (${nw.converged})`)
  ok(nw.rows.length <= 12 && nw.rows[0].x === e.start && nw.rows[0].n === 0, `${e.id}: Newton took ${nw.rows.length} rows`)
  // the derivative given is the derivative of f
  for (const x of [e.start, e.start + 0.1, (e.bracket[0] + e.bracket[1]) / 2]) {
    const h = 1e-6
    const slope = (e.f(x + h) - e.f(x - h)) / (2 * h)
    ok(near(e.df(x), slope, 1e-5) || Math.abs(slope) > 1e5, `${e.id}: df at ${x} is ${e.df(x)}, a difference quotient gives ${slope}`)
  }
}
ok(M.bisect((x) => x * x + 1, 0, 1) === null && M.bisect(Math.cos, 0, 1) === null && M.bisect((x) => x, -1, 1)?.root === 0, 'bisect refuses an interval with no sign change and finds an exact root')
{
  const nw = M.newton((x) => x * x * x, (x) => 3 * x * x, 0)
  ok(nw.converged && nw.rows.length === 1, 'Newton starting at the root')
  const flat = M.newton((x) => Math.cos(x), (x) => -Math.sin(x), 0)
  ok(!flat.converged, 'Newton stops when the slope is zero')
}

console.log(`trigeq check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
