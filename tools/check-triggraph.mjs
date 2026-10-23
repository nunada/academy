/** Checks src/lib/triggraph.ts, the numbers and data behind the "Graphs of Trigonometric Functions" article.
 *
 *  References that do not use the code under test:
 *   1. The six functions at a few dozen angles per graph against mpmath, to 30 digits (undefined where mpmath's cosine or sine is zero to 1e-12).
 *   2. For a few hundred graphs y = a·f(b(x − c)) + d: a dense sample of the window gives the asymptotes (a jump of sign between two huge values),
 *      the zeros and other levels (a change of sign, refined by bisection), the local maxima and minima (refined by ternary search), the range, and
 *      the smallest period by brute force; the library's lists are compared with them.
 *   3. The table of the six parent functions (period, parity, zeros, asymptotes, range) against the same kind of scan, and its TeX against strings
 *      built independently in Python.
 *   4. The equation read off a maximum and a minimum is compared with the original wave at many x; the period of a sum of two waves with a brute-force
 *      search; the beat identity at many x; the least-squares fit with mpmath's solver at 30 digits.
 *
 *  Run: npm run check:triggraph   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'triggraph-'))
const out = path.join(tmp, 't.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/triggraph.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

const FAST = process.env.TRIGGRAPH_FAST === '1'
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

// a reproducible random source
let seed = 20261026
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const pick = (list) => list[Math.floor(rnd() * list.length)]
const label = (g) => `${g.a}·${g.fn}(${g.b}(x − ${g.c})) + ${g.d}`

/* ----------------------------------------------------------------------------------- the cases */
const FNS = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot']
const A = [-3, -2, -1, -0.5, 0.5, 1, 2, 3]
const B = [-2, -1, 0.5, 1, 1.5, 2, 3, 4]
const C = [-90, -30, 0, 17, 45, 100, 200]
const D = [-2, 0, 1, 2.5]
const graphs = FNS.map((fn) => ({ fn, a: 1, b: 1, c: 0, d: 0 }))
for (let i = 0; i < (FAST ? 24 : 150); i++) graphs.push({ fn: FNS[i % 6], a: pick(A), b: pick(B), c: pick(C), d: pick(D) })
// the ones that touch a level: |d| = |a| for a wave, and the tips of a secant
graphs.push({ fn: 'sin', a: 2, b: 1, c: 0, d: -2 }, { fn: 'cos', a: 1, b: 2, c: 30, d: 1 }, { fn: 'sec', a: 1, b: 1, c: 0, d: 1 }, { fn: 'csc', a: -2, b: 0.5, c: 17, d: 2 })
const cases = graphs.map((g) => {
  const period = M.periodOf(g)
  const lo = -100
  const hi = lo + 3 * period
  const xs = [lo + 0.37, lo + 1.01, 0, 7.77, 30, 45, 60, 90, 120, 135, 180, 225, 270, 315, 360, -45, -90, -180, 400.25, 1000.5].map((x) => x)
  const levels = [0, g.d, g.d + 0.5 * g.a, g.d - 0.5 * g.a, g.d + 2 * g.a, g.d + g.a, g.d - g.a]
  return { g, lo, hi, xs, levels, step: period / (FAST ? 4000 : 20000) }
})

const PY = String.raw`
import json, sys, math
from fractions import Fraction
import mpmath
from mpmath import mp, mpf
mp.dps = 30
data = json.load(sys.stdin)

def rad(u): return u * math.pi / 180
def F(fn, u):
    s = math.sin(rad(u)); c = math.cos(rad(u))
    if fn == 'sin': return s
    if fn == 'cos': return c
    if fn == 'tan': return None if abs(c) < 1e-12 else s / c
    if fn == 'cot': return None if abs(s) < 1e-12 else c / s
    if fn == 'sec': return None if abs(c) < 1e-12 else 1 / c
    if fn == 'csc': return None if abs(s) < 1e-12 else 1 / s
def val(g, x):
    f = F(g['fn'], g['b'] * (x - g['c']))
    return None if f is None else g['a'] * f + g['d']
def mpval(g, x):
    u = mpf(g['b']) * (mpf(x) - mpf(g['c']))
    s = mpmath.sin(mpmath.pi * u / 180); c = mpmath.cos(mpmath.pi * u / 180)
    fn = g['fn']
    try:
        if fn == 'sin': f = s
        elif fn == 'cos': f = c
        elif fn == 'tan': f = None if abs(c) < mpf('1e-12') else s / c
        elif fn == 'cot': f = None if abs(s) < mpf('1e-12') else c / s
        elif fn == 'sec': f = None if abs(c) < mpf('1e-12') else 1 / c
        else: f = None if abs(s) < mpf('1e-12') else 1 / s
    except ZeroDivisionError:
        f = None
    return None if f is None else float(mpf(g['a']) * f + mpf(g['d']))

def bisect_sign(fun, a, b, n=60):
    fa = fun(a)
    for _ in range(n):
        m = (a + b) / 2
        fm = fun(m)
        if fm is None: return m
        if (fa < 0) == (fm < 0): a, fa = m, fm
        else: b = m
    return (a + b) / 2

def dedupe(lst, tol):
    out = []
    for x in sorted(lst):
        if not out or x - out[-1] > tol: out.append(x)
    return out

res = {'cases': [], 'facts': {}}
for case in data['cases']:
    g = case['g']; lo = case['lo']; hi = case['hi']; step = case['step']
    n = int(round((hi - lo) / step))
    xs = [lo + i * step for i in range(n + 1)]
    ys = [val(g, x) for x in xs]
    r = {}
    r['values'] = [mpval(g, x) for x in case['xs']]
    # asymptotes: a jump of sign between two huge values
    poles = []
    for i in range(n):
        y0, y1 = ys[i], ys[i + 1]
        if y0 is None or y1 is None:
            poles.append(xs[i] if y0 is None else xs[i + 1]); continue
        if abs(y0) > 25 and abs(y1) > 25 and (y0 - g['d']) * (y1 - g['d']) < 0:
            poles.append(bisect_sign(lambda x: (None if val(g, x) is None else val(g, x) - g['d']), xs[i], xs[i + 1]))
    r['poles'] = dedupe(poles, 0.02)
    # levels: a change of sign, away from the poles
    lv = {}
    for L in case['levels']:
        roots = []
        for i in range(n):
            y0, y1 = ys[i], ys[i + 1]
            if y0 is None or y1 is None: continue
            if abs(y0) > 25 and abs(y1) > 25 and (y0 - g['d']) * (y1 - g['d']) < 0: continue
            if abs(y0 - L) < 1e-12: roots.append(xs[i]); continue
            if (y0 - L) * (y1 - L) < 0:
                roots.append(bisect_sign(lambda x: (None if val(g, x) is None else val(g, x) - L), xs[i], xs[i + 1]))
        lv[repr(L)] = dedupe(roots, 0.005)
    r['levels'] = lv
    # local maxima and minima of the samples, refined by ternary search
    ext = []
    for i in range(1, n):
        y0, y1, y2 = ys[i - 1], ys[i], ys[i + 1]
        if y0 is None or y1 is None or y2 is None: continue
        if abs(y1) > 100: continue
        kind = None
        if y1 > y0 and y1 >= y2: kind = 'max'
        elif y1 < y0 and y1 <= y2: kind = 'min'
        if kind is None: continue
        a, b = xs[i - 1], xs[i + 1]
        sgn = 1 if kind == 'max' else -1
        for _ in range(80):
            m1 = a + (b - a) / 3; m2 = b - (b - a) / 3
            v1, v2 = val(g, m1), val(g, m2)
            if v1 is None or v2 is None: break
            if sgn * v1 < sgn * v2: a = m1
            else: b = m2
        x = (a + b) / 2
        ext.append([x, val(g, x), kind])
    # merge duplicates of a flat top
    merged = []
    for e in ext:
        if merged and abs(e[0] - merged[-1][0]) < 0.01 and e[2] == merged[-1][2]: continue
        merged.append(e)
    r['extrema'] = merged
    # the range
    fin = [y for y in ys if y is not None]
    r['ymin'] = min(fin); r['ymax'] = max(fin)
    above = [y for y in fin if y > g['d']]; below = [y for y in fin if y < g['d']]
    r['highmin'] = min(above) if above else None
    r['lowmax'] = max(below) if below else None
    # the smallest period, by brute force
    tests = [lo + 1.37 * j + 0.11 for j in range(40)]
    period = None
    p = 0.25
    while p <= 800.001:
        good = True
        for x in tests:
            y0, y1 = val(g, x), val(g, x + p)
            if y0 is None or y1 is None:
                continue
            if abs(y0) > 1e3 or abs(y1) > 1e3:
                continue
            if abs(y0 - y1) > 1e-7: good = False; break
        if good: period = p; break
        p += 0.25
    r['period'] = period
    res['cases'].append(r)

# ---------------------------------------------------------------------- the six parents
def parent(fn): return {'fn': fn, 'a': 1, 'b': 1, 'c': 0, 'd': 0}
for fn in ['sin', 'cos', 'tan', 'csc', 'sec', 'cot']:
    g = parent(fn)
    lo, hi, step = -360.0, 720.0, 0.01
    n = int(round((hi - lo) / step))
    xs = [lo + i * step for i in range(n + 1)]
    ys = [val(g, x) for x in xs]
    zs = []; ps = []
    for i in range(n):
        y0, y1 = ys[i], ys[i + 1]
        if y0 is None or y1 is None:
            ps.append(xs[i] if y0 is None else xs[i + 1]); continue
        if abs(y0) > 25 and abs(y1) > 25 and y0 * y1 < 0:
            ps.append(bisect_sign(lambda x: val(g, x), xs[i], xs[i + 1])); continue
        if abs(y0) < 1e-12: zs.append(xs[i]); continue
        if y0 * y1 < 0: zs.append(bisect_sign(lambda x: val(g, x), xs[i], xs[i + 1]))
    zs = dedupe(zs, 0.01); ps = dedupe(ps, 0.02)
    # parity at a few angles
    even = all(abs(val(g, x) - val(g, -x)) < 1e-9 for x in [10, 25, 33.3, 71, 100, 200] if val(g, x) is not None and val(g, -x) is not None)
    odd = all(abs(val(g, x) + val(g, -x)) < 1e-9 for x in [10, 25, 33.3, 71, 100, 200] if val(g, x) is not None and val(g, -x) is not None)
    fin = [y for y in ys if y is not None]
    res['facts'][fn] = {'zeros': zs, 'poles': ps, 'even': even, 'odd': odd, 'min': min(fin), 'max': max(fin), 'inner': min(abs(y) for y in fin)}

# --------------------------------------------------------------------------------- tex
def rad_tex(deg):
    f = Fraction(str(deg)) / 180
    if f == 0: return '0'
    if f.denominator > 12: return ''
    sign = '-' if f < 0 else ''
    f = abs(f); n = f.numerator; q = f.denominator
    num = '' if n == 1 else str(n)
    if q == 1: return sign + num + r'\pi'
    return sign + r'\frac{' + num + r'\pi}{' + str(q) + '}'
def rad_text(deg):
    f = Fraction(str(deg)) / 180
    if f == 0: return '0'
    if f.denominator > 12: return ''
    sign = '-' if f < 0 else ''
    f = abs(f); n = f.numerator; q = f.denominator
    num = '' if n == 1 else str(n)
    return sign + num + 'π' if q == 1 else sign + num + 'π/' + str(q)
res['radtex'] = {str(d): rad_tex(d) for d in data['radtex']}
res['radtext'] = {str(d): rad_text(d) for d in data['radtex']}
def num(x):
    return str(float(('%.6f' % x))).rstrip('0').rstrip('.') if '.' in ('%.6f' % x) else str(x)
def set_tex(first, step, unit):
    if unit == 'rad':
        s = rad_tex(step); f = rad_tex(first)
        return s + r'\,n' if first == 0 else f + '+' + s + r'\,n'
    s = str(int(step)) + r'^\circ'
    return s + r'\,n' if first == 0 else str(int(first)) + r'^\circ+' + s + r'\,n'
res['settex'] = {k: [set_tex(v[0], v[1], u) for u in ['deg', 'rad']] for k, v in data['sets'].items()}

# --------------------------------------------------------------------- reading a wave
reads = []
for w in data['waves']:
    g = w['g']; lo = w['lo']; step = 0.005
    P = 360 / g['b']
    n = int(3 * P / step)
    xs = [lo + i * step for i in range(n + 1)]
    ys = [val(g, x) for x in xs]
    mx = []; mn = []
    for i in range(1, n):
        if ys[i] > ys[i - 1] and ys[i] >= ys[i + 1]: mx.append(xs[i])
        if ys[i] < ys[i - 1] and ys[i] <= ys[i + 1]: mn.append(xs[i])
    reads.append({'max': max(ys), 'min': min(ys), 'maxes': mx, 'mins': mn})
res['reads'] = reads

# ---------------------------------------------------------------- sums of two waves
sums = []
for s in data['sums']:
    b1, b2 = s['b1'], s['b2']
    f = lambda x: math.sin(rad(b1 * x)) + math.sin(rad(b2 * x))
    tests = [0.37 + 1.91 * j for j in range(30)]
    best = None
    p = 0.25
    while p <= s['limit']:
        if all(abs(f(x + p) - f(x)) < 1e-6 for x in tests): best = p; break
        p += 0.25
    e = abs(b1 - b2) / 2; carrier = (b1 + b2) / 2
    ident = max(abs(f(x) - 2 * math.cos(rad(e * x)) * math.sin(rad(carrier * x))) for x in tests)
    sums.append({'period': best, 'ident': ident})
res['sums'] = sums

# ------------------------------------------------------------ least squares in mpmath, 30 digits
fits = []
for fcase in data['fits']:
    b = 360 / fcase['period']
    rows = []
    for x in fcase['xs']:
        u = mpmath.pi * mpf(b) * mpf(x) / 180
        rows.append([mpmath.sin(u), mpmath.cos(u), mpf(1)])
    Amat = mpmath.matrix(rows)
    yv = mpmath.matrix([mpf(y) for y in fcase['ys']])
    try:
        sol = mpmath.lu_solve(Amat, yv)
    except Exception:
        fits.append(None); continue
    A_, B_, D_ = [float(sol[i]) for i in range(3)]
    ys = fcase['ys']; mean = sum(ys) / len(ys)
    fitted = Amat * sol
    ssres = float(sum((yv[i] - fitted[i]) ** 2 for i in range(len(ys))))
    sstot = sum((y - mean) ** 2 for y in ys)
    fits.append({'A': A_, 'B': B_, 'D': D_, 'ssres': ssres, 'sstot': sstot})
res['fits'] = fits
json.dump(res, sys.stdout)
`

const radtex = []
for (let d = -720; d <= 720; d += 7.5) radtex.push(d)
radtex.push(50, 10, 22.5, 112.5, 1, 360, -360)
const sets = {}
for (const fn of FNS) {
  const f = M.FACTS[fn]
  if (f.zeros) sets[fn + ':zeros'] = [f.zeros.first, f.zeros.step]
  if (f.poles) sets[fn + ':poles'] = [f.poles.first, f.poles.step]
}
// waves for reading: sin and cos with b > 0, any a, c, d
const waves = []
for (let i = 0; i < (FAST ? 12 : 40); i++) {
  const fn = i % 2 ? 'cos' : 'sin'
  const g = { fn, a: pick(A), b: pick([0.5, 1, 1.5, 2, 3, 4]), c: pick(C), d: pick(D) }
  waves.push({ g, lo: -50 })
}
const sums = []
const sumPairs = [[1, 2], [2, 3], [3, 4], [1, 1.5], [0.5, 1.5], [1.2, 1.8], [0.3, 0.5], [2, 5], [1, Math.SQRT2], [1, Math.PI / 3], [4, 6], [1, 1.001]]
for (const [b1, b2] of sumPairs) sums.push({ b1, b2, limit: Number.isInteger(b1) && Number.isInteger(b2) ? 800 : 4000 })
// least squares: measurements with noise from a seeded source, and exact ones
const fits = []
const fitCases = []
const noise = () => (rnd() - 0.5) * 0.8
for (const [a, c, d, period] of [[3, 2, 10, 12], [2.5, 7, 0, 12.4], [1, 0, 5, 24], [-4, 3, 1, 12], [0.5, 1, -2, 8]]) {
  for (const sigma of [0, 1]) {
    const xs = []
    const ys = []
    for (let i = 0; i < 24; i++) {
      const x = i * (period / 24) * 1.7 + 0.3
      const xr = Math.round(x * 1e6) / 1e6
      xs.push(xr)
      ys.push(M.graphAt({ fn: 'sin', a, b: 360 / period, c, d }, xr) + sigma * noise())
    }
    fitCases.push({ xs, ys, period, truth: { fn: 'sin', a, b: 360 / period, c, d }, sigma })
  }
}
for (const ds of M.DATASETS) fitCases.push({ xs: ds.xs, ys: ds.ys, period: ds.period, truth: null, sigma: 1 })
fitCases.push({ xs: [1, 2, 3, 4, 5, 6], ys: [2, 2, 2, 2, 2, 2], period: 12, truth: null, sigma: 0 }) // a flat line: amplitude 0

const py = spawnSync('python', ['-X', 'utf8', '-c', PY], {
  input: JSON.stringify({ cases, radtex, sets, waves, sums, fits: fitCases.map((f) => ({ xs: f.xs, ys: f.ys, period: f.period })) }),
  encoding: 'utf8',
  maxBuffer: 1 << 28,
  timeout: 580000,
})
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)

/** Lists agree where they are not within `edge` of the ends of the window. */
const sameSet = (mine, ref, tol, lo, hi, edge = 0.05) => {
  const inside = (x) => x > lo + edge && x < hi - edge
  const a = mine.filter(inside)
  const b = ref.filter(inside)
  return a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) < tol)
}

/* ----------------------------------------------------------------------- 1 and 2: the graphs */
cases.forEach((cs, i) => {
  const { g, lo, hi } = cs
  const r = R.cases[i]
  const L = label(g)
  // values against mpmath
  cs.xs.forEach((x, j) => {
    const mine = M.graphAt(g, x)
    const ref = r.values[j]
    if (ref === null) ok(Number.isNaN(mine), `${L}: undefined at x = ${x}, got ${mine}`)
    else ok(Number.isFinite(mine) && Math.abs(mine - ref) <= 1e-8 * Math.max(1, Math.abs(ref)), `${L}: at x = ${x} got ${mine}, mpmath ${ref}`)
  })
  // the period
  ok(r.period !== null && near(M.periodOf(g), r.period, 1e-9), `${L}: period ${M.periodOf(g)}, brute force ${r.period}`)
  // the asymptotes
  const poles = M.asymptotes(g, lo, hi)
  ok(sameSet(poles, r.poles, 1e-5, lo, hi), `${L}: asymptotes ${JSON.stringify(poles.slice(0, 6))}, scan ${JSON.stringify(r.poles.slice(0, 6))}`)
  ok(g.fn === 'sin' || g.fn === 'cos' ? poles.length === 0 : poles.length > 0, `${L}: asymptotes exist only for tan, cot, sec, csc`)
  // the levels
  cs.levels.forEach((level) => {
    const mine = M.levelSet(g, level, lo, hi)
    const k = (level - g.d) / g.a
    ok(mine.every((x) => !Number.isFinite(M.graphAt(g, x)) || Math.abs(M.graphAt(g, x) - level) < 1e-7), `${L}: a point of the level ${level} that is not on it`)
    const touching = (g.fn === 'sin' || g.fn === 'cos' || g.fn === 'sec' || g.fn === 'csc') && Math.abs(Math.abs(k) - 1) < 1e-12
    if (!touching) ok(sameSet(mine, r.levels[String(level)], 1e-5, lo, hi), `${L}: level ${level}: ${JSON.stringify(mine.slice(0, 5))}, scan ${JSON.stringify(r.levels[String(level)].slice(0, 5))}`)
  })
  // the extrema
  const ex = M.extrema(g, lo, hi)
  const refEx = r.extrema
  const exIn = ex.filter((e) => e.x > lo + 0.05 && e.x < hi - 0.05)
  const refIn = refEx.filter((e) => e[0] > lo + 0.05 && e[0] < hi - 0.05)
  ok(exIn.length === refIn.length && exIn.every((e, j) => Math.abs(e.x - refIn[j][0]) < 3e-3 && Math.abs(e.y - refIn[j][1]) < 1e-7 && e.kind === refIn[j][2]), `${L}: extrema ${JSON.stringify(exIn.slice(0, 3))}, scan ${JSON.stringify(refIn.slice(0, 3))}`)
  // the range
  const rg = M.rangeOf(g)
  const m = Math.abs(g.a)
  if (g.fn === 'sin' || g.fn === 'cos') ok(rg.kind === 'band' && near(rg.lo, r.ymin, 1e-6) && near(rg.hi, r.ymax, 1e-6) && near(rg.lo, g.d - m) && near(rg.hi, g.d + m), `${L}: range ${JSON.stringify(rg)}, sample ${r.ymin} to ${r.ymax}`)
  else if (g.fn === 'tan' || g.fn === 'cot') ok(rg.kind === 'all' && r.ymax > 100 && r.ymin < -100, `${L}: range of a tangent or cotangent is all reals`)
  else ok(rg.kind === 'outside' && near(rg.lo, g.d - m) && near(rg.hi, g.d + m) && near(rg.hi, r.highmin, 1e-6) && near(rg.lo, r.lowmax, 1e-6), `${L}: range ${JSON.stringify(rg)}, nearest values ${r.lowmax} and ${r.highmin}`)
  // key points: on the graph, spaced as expected
  const kp = M.keyPoints(g, lo, hi)
  ok(kp.length > 0 && kp.every((p) => near(p.y, M.graphAt(g, p.x), 1e-7)), `${L}: a key point not on the graph`)
  const per = { sin: 4, cos: 4, tan: 3, cot: 3, sec: 2, csc: 2 }[g.fn]
  const expectCount = (per * (hi - lo)) / M.periodOf(g)
  ok(Math.abs(kp.length - expectCount) <= 1.5, `${L}: ${kp.length} key points over three periods, expected ${expectCount}`)
  if (g.fn === 'sin' || g.fn === 'cos') {
    ok(kp.every((p, j) => j === 0 || near(p.x - kp[j - 1].x, M.periodOf(g) / 4, 1e-8)), `${L}: quarter points are not a quarter of a period apart`)
    // each peak and trough of the scan is a key point
    ok(refIn.every((e) => kp.some((p) => Math.abs(p.x - e[0]) < 3e-3)), `${L}: a peak or trough is missing from the key points`)
    // the y values of the key points cycle through the midline, a peak, the midline and a trough
    const ys = kp.map((p) => p.y)
    ok(ys.every((y) => near(y, g.d, 1e-7) || near(y, g.d + m, 1e-7) || near(y, g.d - m, 1e-7)), `${L}: key points are at the midline or the extremes`)
  }
  // the curve in pieces: nothing crosses an asymptote
  const cap = 6
  const segs = M.curveSegments(g, lo, hi, 800, cap)
  ok(segs.every((s) => s.every(([x, y]) => near(y, M.graphAt(g, x), 1e-9) && Math.abs(y) <= cap + 1e-9)), `${L}: a point of the curve off the graph or beyond the cap`)
  ok(segs.every((s) => !poles.some((p) => p > s[0][0] + 1e-9 && p < s[s.length - 1][0] - 1e-9)), `${L}: a piece of the curve crosses an asymptote`)
  if (g.fn === 'sin' || g.fn === 'cos') ok(rg.kind === 'band' && (rg.hi - rg.lo > 2 * cap ? true : segs.length === 1), `${L}: a wave in one piece`)
  // a coarse curve with no cap: consecutive samples on the two sides of an asymptote are both finite, and the pen must still be lifted
  const coarse = M.curveSegments(g, lo, hi, 97)
  ok(coarse.every((sg) => !poles.some((p) => p > sg[0][0] + 1e-9 && p < sg[sg.length - 1][0] - 1e-9)), `${L}: a coarse piece of the curve crosses an asymptote`)
  if (poles.length > 2) ok(coarse.length >= poles.length - 1, `${L}: ${coarse.length} coarse pieces for ${poles.length} asymptotes`)
})

/* --------------------------------------------------------------------- 3: the parent functions */
for (const fn of FNS) {
  const f = M.FACTS[fn]
  const r = R.facts[fn]
  const inW = (x) => x >= -359.9 && x < 719.9
  const expand = (s, lo = -360, hi = 720) => {
    const out = []
    for (let n = -20; n <= 20; n++) {
      const x = s.first + s.step * n
      if (x >= lo && x < hi) out.push(x)
    }
    return out
  }
  ok(M.periodOf({ fn, a: 1, b: 1, c: 0, d: 0 }) === f.period, `${fn}: the table's period`)
  ok((f.parity === 'even') === r.even && (f.parity === 'odd') === r.odd, `${fn}: parity ${f.parity}, scan even ${r.even} odd ${r.odd}`)
  ok(sameSet(f.zeros ? expand(f.zeros) : [], r.zeros.filter(inW), 1e-5, -360, 720), `${fn}: the table's zeros ${JSON.stringify(f.zeros)}, scan ${JSON.stringify(r.zeros.slice(0, 5))}`)
  ok(sameSet(f.poles ? expand(f.poles) : [], r.poles.filter(inW), 1e-4, -360, 720), `${fn}: the table's asymptotes ${JSON.stringify(f.poles)}, scan ${JSON.stringify(r.poles.slice(0, 5))}`)
  if (f.range === 'band') ok(near(r.max, 1, 1e-9) && near(r.min, -1, 1e-9), `${fn}: band range`)
  if (f.range === 'outside') ok(r.inner >= 1 - 1e-9 && r.inner < 1 + 1e-6, `${fn}: |f| ≥ 1 and reaches 1`)
  if (f.range === 'all') ok(r.max > 1e3 && r.min < -1e3, `${fn}: unbounded both ways`)
  ok(fn === 'tan' || fn === 'cot' ? f.range === 'all' : fn === 'sin' || fn === 'cos' ? f.range === 'band' : f.range === 'outside', `${fn}: range kind`)
  ok(M.rangeOf({ fn, a: 1, b: 1, c: 0, d: 0 }).kind === f.range, `${fn}: rangeOf agrees with the table`)
}
// tex strings
for (const [d, ref] of Object.entries(R.radtex)) ok(M.radTex(Number(d)) === ref, `radTex(${d}) = ${JSON.stringify(M.radTex(Number(d)))}, expected ${JSON.stringify(ref)}`)
for (const [d, ref] of Object.entries(R.radtext)) ok(M.radText(Number(d)) === ref, `radText(${d}) = ${JSON.stringify(M.radText(Number(d)))}, expected ${JSON.stringify(ref)}`)
for (const [k, [deg, rad]] of Object.entries(R.settex)) {
  const [fn, which] = k.split(':')
  const s = M.FACTS[fn][which]
  ok(M.setTex(s, 'deg') === deg && M.setTex(s, 'rad') === rad, `${k}: setTex ${M.setTex(s, 'deg')} | ${M.setTex(s, 'rad')}, expected ${deg} | ${rad}`)
}

/* ------------------------------------------------------------------ 4: reading, sums and fits */
waves.forEach((w, i) => {
  const r = R.reads[i]
  const g = w.g
  const period = M.periodOf(g)
  // take a maximum from the scan and the next maximum or minimum
  const xMax = r.maxes.find((x) => x > w.lo + 1)
  const nextMax = r.maxes.find((x) => x > xMax + period / 2)
  const nextMin = r.mins.find((x) => x > xMax)
  for (const fn of ['sin', 'cos']) {
    for (const [next, xNext] of [['max', nextMax], ['min', nextMin]]) {
      const rd = M.fromExtremes({ max: r.max, min: r.min, xMax, xNext, next }, fn)
      ok(rd !== null, `${label(g)}: reading returned null`)
      if (!rd) continue
      let worst = 0
      for (let j = 0; j < 80; j++) {
        const x = -200 + j * 7.31
        worst = Math.max(worst, Math.abs(M.graphAt(rd, x) - M.graphAt(g, x)))
      }
      ok(worst < 2e-2, `${label(g)}: read as ${fn} the wave differs by ${worst}`)
      ok(near(rd.a, Math.abs(g.a), 1e-4) && near(rd.d, g.d, 1e-4) && near(rd.b, g.b, 1e-3), `${label(g)}: read a=${rd.a} b=${rd.b} d=${rd.d}`)
    }
  }
})
ok(M.fromExtremes({ max: 1, min: 1, xMax: 0, xNext: 10, next: 'max' }, 'sin') === null && M.fromExtremes({ max: 2, min: 0, xMax: 3, xNext: 3, next: 'min' }, 'cos') === null, 'reading refuses a flat wave and a zero period')
{
  const g = M.fromGeneral('sin', 2, 3, 90, 1)
  ok(g.c === 30 && g.b === 3 && near(M.graphAt(g, 50), 2 * Math.sin((3 * 50 - 90) * Math.PI / 180) + 1, 1e-12), 'bx − B is b(x − B/b)')
}
sums.forEach((s, i) => {
  const r = R.sums[i]
  const mine = M.sumPeriod(s.b1, s.b2)
  const rational = mine !== null
  if (rational && mine > s.limit) return
  if (rational) ok(r.period !== null && near(mine, r.period, 1e-9), `sumPeriod(${s.b1}, ${s.b2}) = ${mine}, brute force ${r.period}`)
  else ok(r.period === null, `sumPeriod(${s.b1}, ${s.b2}) is null but brute force found ${r.period}`)
  if (s.b1 !== s.b2) {
    const b = M.beats(s.b1, s.b2)
    ok(b && near(b.carrier, (s.b1 + s.b2) / 2) && near(b.envelope, Math.abs(s.b1 - s.b2) / 2) && near(b.beatPeriod, 360 / Math.abs(s.b1 - s.b2)), `beats(${s.b1}, ${s.b2})`)
    ok(r.ident < 1e-9, `the beat identity fails by ${r.ident}`)
  }
})
ok(M.beats(2, 2) === null && M.sumPeriod(1, Math.SQRT2) === null && M.sumPeriod(0, 1) === null && M.sumPeriod(2, 3) === 360 && M.sumPeriod(4, 6) === 180, 'sums: equal frequencies, irrational, zero, and two known periods')
fitCases.forEach((fc, i) => {
  const ref = R.fits[i]
  const mine = M.fitSinusoid(fc.xs.map((x, j) => [x, fc.ys[j]]), fc.period)
  const name = `fit ${i} (period ${fc.period}, sigma ${fc.sigma})`
  if (ref === null) return ok(mine === null, `${name}: should be null`)
  ok(mine !== null, `${name}: returned null`)
  if (!mine) return
  ok(near(mine.A, ref.A, 1e-8) && near(mine.B, ref.B, 1e-8) && near(mine.D, ref.D, 1e-8), `${name}: A,B,D = ${mine.A}, ${mine.B}, ${mine.D}; QR ${ref.A}, ${ref.B}, ${ref.D}`)
  const r2 = ref.sstot < 1e-12 ? (ref.ssres < 1e-12 ? 1 : 0) : 1 - ref.ssres / ref.sstot
  ok(near(mine.r2, r2, 1e-8) && near(mine.rmse, Math.sqrt(ref.ssres / fc.xs.length), 1e-7), `${name}: r2 ${mine.r2} vs ${r2}, rmse ${mine.rmse}`)
  // the same wave as a·sin(b(x − c)) + d, with a ≥ 0 and 0 ≤ c < period
  const g = mine.graph
  ok(g.a >= 0 && g.c >= 0 && g.c < fc.period + 1e-9 && near(g.b, 360 / fc.period), `${name}: graph form ${JSON.stringify(g)}`)
  let worst = 0
  fc.xs.forEach((x) => {
    const asAB = mine.A * Math.sin((360 / fc.period) * x * Math.PI / 180) + mine.B * Math.cos((360 / fc.period) * x * Math.PI / 180) + mine.D
    worst = Math.max(worst, Math.abs(asAB - M.graphAt(g, x)))
  })
  ok(worst < 1e-9, `${name}: the two forms differ by ${worst}`)
  if (fc.truth && fc.sigma === 0) {
    let w2 = 0
    for (let x = -3; x < 40; x += 0.77) w2 = Math.max(w2, Math.abs(M.graphAt(g, x) - M.graphAt(fc.truth, x)))
    ok(w2 < 1e-8 && near(mine.r2, 1, 1e-9), `${name}: exact data should give the exact wave, off by ${w2}`)
  }
})
ok(M.fitSinusoid([[1, 2], [2, 3]], 12) === null && M.fitSinusoid([[1, 1], [1, 2], [1, 3], [1, 4]], 12) === null && M.fitSinusoid([[1, 1], [2, 2], [3, 3]], 0) === null, 'fit refuses too few points, one x and a zero period')
// data sets: the fits the article quotes
for (const ds of M.DATASETS) {
  const f = M.fitSinusoid(ds.xs.map((x, j) => [x, ds.ys[j]]), ds.period)
  ok(f !== null && f.r2 > 0.9, `dataset ${ds.id}: a wave of period ${ds.period} fits it, r2 = ${f && f.r2}`)
  const worse = M.fitSinusoid(ds.xs.map((x, j) => [x, ds.ys[j]]), ds.period * 0.6)
  ok(worse !== null && worse.r2 < f.r2, `dataset ${ds.id}: the wrong period fits worse`)
}

console.log(`triggraph check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
