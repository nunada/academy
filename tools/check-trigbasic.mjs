/** Checks src/lib/trigbasic.ts, the numbers behind the "Basic Trigonometry" article.
 *
 *  References that do not use the code under test:
 *   1. Python's mpmath (60 digits) for sin and cos of every whole degree from −720° to 720°, which the degree functions must match to 2.3e-16,
 *      with the exact cases (sin 30° = 0.5, cos 90° = 0 with no sign, tan 90° undefined) checked to be exactly right.
 *   2. mpmath again for the exact values of every multiple of 15°: the coefficients of (one + r2√2 + r3√3 + r6√6)/den must reproduce the true
 *      value to 55 digits, and the TeX of all 21 table entries is compared with the textbook spelling.
 *   3. Right triangles: random givens of all six kinds, compared with Python's math module for the angle kinds and measured back with atan2 and
 *      Pythagoras for all of them; every triangle must be recoverable from any other pair of its measurements.
 *   4. The unit circle: the quadrant, the reference angle (as min(n mod 180, 180 − n mod 180)) and the signs, against mpmath, for every degree.
 *   5. The equations sin x = c, cos x = c and tan x = c: a scan of [0°, 360°) for every crossing of the level, found by bisection.
 *   6. Waves: the sampled maximum, minimum, period and level crossings of random waves.
 *   7. Identities: SymPy's simplifier for each, and a counterexample for each false one.
 *
 *  Run: npm run check:trigbasic   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'trigbasic-'))
const out = path.join(tmp, 't.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/trigbasic.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const M = await import(pathToFileURL(out).href)

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
const rnd = (a, b) => a + Math.random() * (b - a)
const rndInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1))

/* ------------------------------------------------------------------------------------ test data */
const DEGS = Array.from({ length: 1441 }, (_, i) => i - 720)
const exactCases = []
for (let d = -360; d <= 720; d += 15) for (const fn of ['sin', 'cos', 'tan']) {
  const e = M.exactValue(fn, d)
  if (e && e !== 'undefined') exactCases.push({ fn, d, sign: e.sign, den: e.den, one: e.one, r2: e.r2, r3: e.r3, r6: e.r6 })
}
const rightCases = []
for (let i = 0; i < 300; i++) {
  const A = rnd(0.5, 89.5)
  const len = rnd(0.5, 50)
  rightCases.push({ A, len })
}
const identityIds = M.IDENTITIES.map((i) => i.id)
const identitySamples = []
for (let i = 0; i < 60; i++) identitySamples.push([rnd(-720, 720), rnd(-720, 720)])

const PY = String.raw`
import json, sys, math
from mpmath import mp, mpf, sin, cos, tan, pi, sqrt
from sympy import symbols, sin as ssin, cos as scos, tan as stan, pi as spi, Integer, simplify, expand_trig, N
mp.dps = 60
data = json.load(sys.stdin)
res = {}

deg = lambda d: mpf(d) * pi / 180
res['sc'] = {str(d): [float(sin(deg(d))), float(cos(deg(d)))] for d in data['degs']}

# the exact vectors against the true values, to 55 digits
bad = []
for c in data['exact']:
    v = c['sign'] * (c['one'] + c['r2'] * sqrt(2) + c['r3'] * sqrt(3) + c['r6'] * sqrt(6)) / c['den']
    f = {'sin': sin, 'cos': cos, 'tan': tan}[c['fn']]
    true = f(deg(c['d']))
    if abs(v - true) > mpf(10) ** -55:
        bad.append([c['fn'], c['d'], float(v), float(true)])
res['exact_bad'] = bad

# right triangles from an angle, computed by math
res['right'] = [[math.sin(math.radians(c['A'])) * c['len'], math.cos(math.radians(c['A'])) * c['len'], math.tan(math.radians(c['A'])) * c['len']] for c in data['right']]

# the identities: the simplifier says zero or not
x, y = symbols('x y')
S = {
 'pythagorean': (ssin(x)**2 + scos(x)**2, Integer(1)),
 'tangent': (stan(x), ssin(x) / scos(x)),
 'cofunction': (ssin(spi / 2 - x), scos(x)),
 'supplement': (ssin(spi - x), ssin(x)),
 'negative-sine': (ssin(-x), -ssin(x)),
 'negative-cosine': (scos(-x), scos(x)),
 'double-sine': (ssin(2 * x), 2 * ssin(x) * scos(x)),
 'double-cosine': (scos(2 * x), scos(x)**2 - ssin(x)**2),
 'sum-sine': (ssin(x + y), ssin(x) * scos(y) + scos(x) * ssin(y)),
 'sum-cosine': (scos(x + y), scos(x) * scos(y) - ssin(x) * ssin(y)),
 'secant': (1 + stan(x)**2, 1 / scos(x)**2),
 'wrong-sum-sine': (ssin(x + y), ssin(x) + ssin(y)),
 'wrong-double-sine': (ssin(2 * x), 2 * ssin(x)),
 'wrong-pythagorean': (ssin(x) + scos(x), Integer(1)),
 'wrong-double-cosine': (scos(2 * x), 2 * scos(x)),
 'wrong-sum-tangent': (stan(x + y), stan(x) + stan(y)),
 'wrong-half': (ssin(x / 2), ssin(x) / 2),
}
res['ident'] = {k: bool(simplify(expand_trig(l - r)) == 0) for k, (l, r) in S.items()}
# numeric values of both sides at the samples, in radians
import sympy
vals = {}
for k, (l, r) in S.items():
    row = []
    for a, b in data['samples']:
        sub = {x: sympy.Float(a * math.pi / 180, 30), y: sympy.Float(b * math.pi / 180, 30)}
        try:
            lv = complex(N(l.subs(sub), 20)); rv = complex(N(r.subs(sub), 20))
            row.append([lv.real, rv.real])
        except Exception:
            row.append(None)
    vals[k] = row
res['vals'] = vals
json.dump(res, sys.stdout)
`
const py = spawnSync('python', ['-X', 'utf8', '-c', PY], {
  input: JSON.stringify({ degs: DEGS, exact: exactCases, right: rightCases, samples: identitySamples }),
  encoding: 'utf8',
  maxBuffer: 1 << 28,
  timeout: 560000,
})
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)

/* -------------------------------------------------------------------- 1: sin, cos and tan of every degree */
for (const d of DEGS) {
  const [s, c] = R.sc[String(d)]
  ok(Math.abs(M.sinDeg(d) - s) <= 2.3e-16, `sin ${d}°: ${M.sinDeg(d)} against ${s}`)
  ok(Math.abs(M.cosDeg(d) - c) <= 2.3e-16, `cos ${d}°: ${M.cosDeg(d)} against ${c}`)
  const n = (((d % 360) + 360) % 360)
  if (n % 180 === 90) ok(Number.isNaN(M.tanDeg(d)), `tan ${d}° should be undefined`)
  else ok(Math.abs(M.tanDeg(d) - s / c) <= 1e-12 * Math.max(1, Math.abs(s / c)) || Math.abs(M.tanDeg(d)) < 1e-15, `tan ${d}°: ${M.tanDeg(d)} against ${s / c}`)
  // exact zeros carry no sign
  if (n % 180 === 0) ok(Object.is(M.sinDeg(d), 0), `sin ${d}° should be exactly +0, got ${M.sinDeg(d)}`)
  if (n % 180 === 0) ok(Object.is(M.tanDeg(d), 0), `tan ${d}° should be exactly +0, got ${M.tanDeg(d)}`)
  if (n % 180 === 90) ok(Object.is(M.cosDeg(d), 0), `cos ${d}° should be exactly +0, got ${M.cosDeg(d)}`)
}
ok(M.sinDeg(30) === 0.5 && M.cosDeg(60) === 0.5 && M.sinDeg(90) === 1 && M.cosDeg(0) === 1 && M.sinDeg(-90) === -1 && M.cosDeg(180) === -1, 'exact values at the well-known angles')
ok(M.sinDeg(45) === Math.SQRT1_2 && M.cosDeg(45) === Math.SQRT1_2 && M.tanDeg(45) === 1, '45° is exact')
ok(near(M.tanDeg(60), Math.sqrt(3), 1e-15) && near(M.tanDeg(30), 1 / Math.sqrt(3), 1e-15), 'tan 60° and tan 30°')
ok(Math.sin(Math.PI) !== 0 && M.sinDeg(180) === 0, 'the degree function fixes the radian rounding error')
ok(M.normalize(-30) === 330 && M.normalize(725) === 5 && M.normalize(360) === 0 && M.normalize(-360) === 0 && M.normalize(0) === 0, 'normalize')
ok(near(M.toRad(180), Math.PI, 1e-15) && near(M.toDeg(Math.PI / 2), 90, 1e-15), 'degrees and radians')
for (const d of [0, 30, 45, 60, 90, 120, 135, 150, 180, 225, 300, 337.5, -45, 725.5]) {
  const six = M.sixValues(d)
  const s = Math.sin((d * Math.PI) / 180)
  const c = Math.cos((d * Math.PI) / 180)
  ok(near(six.sin, s, 1e-12) && near(six.cos, c, 1e-12), `six values of ${d}°: sin and cos`)
  ok(Math.abs(c) < 1e-12 ? Number.isNaN(six.tan) && Number.isNaN(six.sec) : near(six.tan, s / c, 1e-9) && near(six.sec, 1 / c, 1e-9), `six values of ${d}°: tan and sec`)
  ok(Math.abs(s) < 1e-12 ? Number.isNaN(six.csc) && Number.isNaN(six.cot) : near(six.csc, 1 / s, 1e-9) && near(six.cot, c / s, 1e-9), `six values of ${d}°: csc and cot`)
}

/* ------------------------------------------------------------------------------- 2: exact values */
ok(R.exact_bad.length === 0, `exact values off by more than 1e-55: ${JSON.stringify(R.exact_bad.slice(0, 3))}`)
const TEX = {
  sin: ['0', '\\frac{\\sqrt6-\\sqrt2}{4}', '\\frac{1}{2}', '\\frac{\\sqrt2}{2}', '\\frac{\\sqrt3}{2}', '\\frac{\\sqrt6+\\sqrt2}{4}', '1'],
  cos: ['1', '\\frac{\\sqrt6+\\sqrt2}{4}', '\\frac{\\sqrt3}{2}', '\\frac{\\sqrt2}{2}', '\\frac{1}{2}', '\\frac{\\sqrt6-\\sqrt2}{4}', '0'],
  tan: ['0', '2-\\sqrt3', '\\frac{\\sqrt3}{3}', '1', '\\sqrt3', '2+\\sqrt3', null],
}
for (const fn of ['sin', 'cos', 'tan']) {
  TEX[fn].forEach((tex, k) => {
    const e = M.exactValue(fn, 15 * k)
    if (tex === null) ok(e === 'undefined', `${fn} ${15 * k}° should be undefined`)
    else ok(e && e !== 'undefined' && M.exactTex(e) === tex, `${fn} ${15 * k}° TeX is ${e && e !== 'undefined' ? M.exactTex(e) : e}, expected ${tex}`)
  })
}
// signs in the other quadrants
const tex = (fn, d) => {
  const e = M.exactValue(fn, d)
  return e === 'undefined' || e === null ? e : M.exactTex(e)
}
ok(tex('sin', 120) === '\\frac{\\sqrt3}{2}' && tex('cos', 120) === '-\\frac{1}{2}' && tex('tan', 120) === '-\\sqrt3', 'second quadrant signs')
ok(tex('sin', 210) === '-\\frac{1}{2}' && tex('cos', 210) === '-\\frac{\\sqrt3}{2}' && tex('tan', 210) === '\\frac{\\sqrt3}{3}', 'third quadrant signs')
ok(tex('sin', 330) === '-\\frac{1}{2}' && tex('cos', 330) === '\\frac{\\sqrt3}{2}' && tex('tan', 330) === '-\\frac{\\sqrt3}{3}', 'fourth quadrant signs')
ok(tex('sin', 195) === '-\\frac{\\sqrt6-\\sqrt2}{4}' && tex('tan', 285) === '-(2+\\sqrt3)' && tex('tan', 345) === '-(2-\\sqrt3)', 'negative values with several terms')
ok(tex('sin', 180) === '0' && tex('tan', 180) === '0' && tex('tan', 270) === 'undefined' && tex('cos', 270) === '0' && tex('tan', 90) === 'undefined', 'values on the axes carry no sign and tan 90° is undefined')
ok(tex('sin', -30) === '-\\frac{1}{2}' && tex('cos', -30) === '\\frac{\\sqrt3}{2}' && tex('cos', 390) === '\\frac{\\sqrt3}{2}', 'negative angles and angles above 360°')
ok(M.exactValue('sin', 20) === null && M.exactValue('sin', 7.5) === null && M.exactValue('cos', 1) === null, 'no exact value for angles that are not multiples of 15°')
for (const d of [15, 45, 105, 195, 255]) ok(near(M.exactNumber(M.exactValue('sin', d)), Math.sin((d * Math.PI) / 180), 1e-14), `exactNumber of sin ${d}°`)

/* ------------------------------------------------------------------------------ 3: right triangles */
const kindsFrom = (t) => [
  { kind: 'angleHyp', angle: t.A, hyp: t.hyp },
  { kind: 'angleOpp', angle: t.A, opp: t.opp },
  { kind: 'angleAdj', angle: t.A, adj: t.adj },
  { kind: 'oppHyp', opp: t.opp, hyp: t.hyp },
  { kind: 'adjHyp', adj: t.adj, hyp: t.hyp },
  { kind: 'oppAdj', opp: t.opp, adj: t.adj },
]
rightCases.forEach((c, i) => {
  const [opp, adj, tanTimes] = R.right[i]
  const hyp = c.len
  const t = M.solveRight({ kind: 'angleHyp', angle: c.A, hyp })
  ok(near(t.opp, opp, 1e-12) && near(t.adj, adj, 1e-12) && near(t.hyp, hyp, 1e-12), `angleHyp ${c.A}°, ${hyp}: ${JSON.stringify(t)} against ${opp}, ${adj}`)
  // measured back
  ok(near(t.opp * t.opp + t.adj * t.adj, t.hyp * t.hyp, 1e-12), 'Pythagoras on a solved triangle')
  ok(near((Math.atan2(t.opp, t.adj) * 180) / Math.PI, c.A, 1e-12) && near(t.A + t.B, 90, 1e-12), 'angle measured with atan2')
  ok(t.opp < t.hyp && t.adj < t.hyp, 'the hypotenuse is the longest side')
  // every other pair of measurements gives the same triangle back
  for (const g of kindsFrom(t)) {
    const u = M.solveRight(g)
    ok(u && near(u.A, t.A, 1e-9) && near(u.opp, t.opp, 1e-9) && near(u.adj, t.adj, 1e-9) && near(u.hyp, t.hyp, 1e-9), `${g.kind} from ${JSON.stringify(t)} gives ${JSON.stringify(u)}`)
  }
  // angle and adjacent: tan
  const v = M.solveRight({ kind: 'angleAdj', angle: c.A, adj: adj })
  ok(near(v.opp, opp * 0 + adj * Math.tan((c.A * Math.PI) / 180), 1e-12) && near(tanTimes, v.opp * (c.len / adj), 1e-9), 'angleAdj against tan')
  // the ratios
  const r = M.ratiosOf(t)
  const s = Math.sin((c.A * Math.PI) / 180)
  const co = Math.cos((c.A * Math.PI) / 180)
  ok(near(r.sin, s, 1e-12) && near(r.cos, co, 1e-12) && near(r.tan, s / co, 1e-12) && near(r.csc, 1 / s, 1e-12) && near(r.sec, 1 / co, 1e-12) && near(r.cot, co / s, 1e-12), 'ratios of a solved triangle')
  const o = M.otherAngle(t)
  ok(near(o.A, t.B, 1e-12) && o.opp === t.adj && o.adj === t.opp && near(M.ratiosOf(o).sin, r.cos, 1e-12) && near(M.ratiosOf(o).tan, 1 / r.tan, 1e-12), 'the other acute angle: sin and cos swap')
})
// the 3-4-5 and 30-60-90 triangles
{
  const t = M.solveRight({ kind: 'oppAdj', opp: 3, adj: 4 })
  ok(t.hyp === 5 && near(t.A, 36.86989764584402, 1e-12), '3-4-5')
  const u = M.solveRight({ kind: 'angleHyp', angle: 30, hyp: 10 })
  ok(u.opp === 5 && near(u.adj, 5 * Math.sqrt(3), 1e-14) && u.B === 60, '30-60-90 with hypotenuse 10')
  const w = M.solveRight({ kind: 'angleOpp', angle: 45, opp: 7 })
  ok(near(w.adj, 7, 1e-14) && near(w.hyp, 7 * Math.SQRT2, 1e-14), '45-45-90')
}
for (const bad of [
  { kind: 'angleHyp', angle: 0, hyp: 5 },
  { kind: 'angleHyp', angle: 90, hyp: 5 },
  { kind: 'angleHyp', angle: -10, hyp: 5 },
  { kind: 'angleHyp', angle: 30, hyp: 0 },
  { kind: 'angleOpp', angle: NaN, opp: 5 },
  { kind: 'angleAdj', angle: 30, adj: -2 },
  { kind: 'oppHyp', opp: 5, hyp: 5 },
  { kind: 'oppHyp', opp: 6, hyp: 5 },
  { kind: 'adjHyp', adj: 5, hyp: 4 },
  { kind: 'adjHyp', adj: 0, hyp: 4 },
  { kind: 'oppAdj', opp: 0, adj: 4 },
  { kind: 'oppAdj', opp: 3, adj: Infinity },
]) ok(M.solveRight(bad) === null, `${JSON.stringify(bad)} cannot make a right triangle`)

/* ------------------------------------------------------------------------------- 4: the unit circle */
for (const d of DEGS) {
  const n = ((d % 360) + 360) % 360
  const info = M.circleInfo(d)
  const [s, c] = R.sc[String(d)]
  const sgn = (v) => (Math.abs(v) < 1e-12 ? 0 : Math.sign(v))
  ok(info.deg === n, `circleInfo(${d}).deg`)
  ok(info.quadrant === (n % 90 === 0 ? 0 : Math.floor(n / 90) + 1), `quadrant of ${d}°: ${info.quadrant}`)
  const m = n % 180
  ok(info.ref === Math.min(m, 180 - m), `reference angle of ${d}°: ${info.ref}`)
  ok(info.sinSign === sgn(s) && info.cosSign === sgn(c), `signs of sin and cos at ${d}°`)
  if (n % 180 === 90) ok(Number.isNaN(info.tanSign), `tan sign at ${d}° is undefined`)
  else ok(info.tanSign === sgn(s) * sgn(c), `tan sign at ${d}°`)
  // the point on the circle
  ok(near(M.sinDeg(d) ** 2 + M.cosDeg(d) ** 2, 1, 1e-15), `sin² + cos² at ${d}°`)
}

/* ----------------------------------------------------------------------- 5: the basic equations */
const f = { sin: (x) => Math.sin((x * Math.PI) / 180), cos: (x) => Math.cos((x * Math.PI) / 180), tan: (x) => Math.tan((x * Math.PI) / 180) }
/** every x in [0, 360) with f(x) = c, by scanning for a change of sign of f − c and then bisecting, and by looking for touching points */
function scan(fn, c) {
  const found = []
  const step = 0.01
  const g = (x) => f[fn](x) - c
  for (let k = 0; k < 36000; k++) {
    const a = k * step
    const b = a + step
    const ga = g(a)
    const gb = g(b)
    if (fn === 'tan' && (Math.abs(ga) > 1e6 || Math.abs(gb) > 1e6 || ga * gb < 0 && Math.abs(ga - gb) > 1e3)) continue
    if (ga === 0) {
      if (!found.some((y) => Math.abs(y - a) < 0.02)) found.push(a)
      continue
    }
    if ((ga < 0) !== (gb < 0)) {
      let lo = a
      let hi = b
      for (let i = 0; i < 80; i++) {
        const mid = (lo + hi) / 2
        if ((g(lo) < 0) === (g(mid) < 0)) lo = mid
        else hi = mid
      }
      const x = Math.round(((lo + hi) / 2) * 1e6) / 1e6
      if (!found.some((y) => Math.abs(y - x) < 0.02)) found.push(x)
    }
  }
  return found.sort((p, q) => p - q)
}
const levels = {
  sin: [-1, -Math.sqrt(3) / 2, -Math.SQRT1_2, -0.5, -0.1, 0, 0.3, 0.5, Math.SQRT1_2, Math.sqrt(3) / 2, 0.99, 1, 1.5, -2],
  cos: [-1, -Math.sqrt(3) / 2, -Math.SQRT1_2, -0.5, 0, 0.1, 0.5, Math.SQRT1_2, Math.sqrt(3) / 2, 0.999, 1, 2, -1.2],
  tan: [-Math.sqrt(3), -1, -1 / Math.sqrt(3), -0.2, 0, 0.7, 1 / Math.sqrt(3), 1, Math.sqrt(3), 5, -40, 1000],
}
for (const fn of ['sin', 'cos', 'tan']) {
  for (const c of [...levels[fn], ...Array.from({ length: 6 }, () => rnd(fn === 'tan' ? -20 : -1, fn === 'tan' ? 20 : 1))]) {
    const got = M.solveBasic(fn, c)
    let want = scan(fn, c)
    // a touching level (±1) has a double root that a change of sign misses: add it by hand
    if (fn === 'sin' && c === 1) want = [90]
    if (fn === 'sin' && c === -1) want = [270]
    if (fn === 'cos' && c === 1) want = [0]
    if (fn === 'cos' && c === -1) want = [180]
    ok(got.length === want.length && got.every((x, i) => Math.abs(x - want[i]) < 1e-3), `${fn} x = ${c}: ${JSON.stringify(got)} against a scan ${JSON.stringify(want)}`)
    ok(got.every((x) => x >= 0 && x < 360 && near(f[fn](x), c, 1e-7)), `${fn} x = ${c}: a solution that does not solve it`)
    ok(JSON.stringify(got) === JSON.stringify([...got].sort((p, q) => p - q)), 'solutions in increasing order')
  }
}
ok(JSON.stringify(M.solveBasic('sin', 0.5)) === JSON.stringify([30, 150]) && JSON.stringify(M.solveBasic('cos', 0.5)) === JSON.stringify([60, 300]) && JSON.stringify(M.solveBasic('tan', 1)) === JSON.stringify([45, 225]), 'the textbook equations')
ok(JSON.stringify(M.solveBasic('sin', -1e-13)) === '[0,180]' && JSON.stringify(M.solveBasic('tan', -1e-13)) === '[0,180]', 'a level just below 0 rounds to the solution 0, not 360')
ok(JSON.stringify(M.solveBasic('cos', 1)) === '[0]' && JSON.stringify(M.solveBasic('sin', 0)) === '[0,180]' && JSON.stringify(M.solveBasic('sin', -1)) === '[270]' && M.solveBasic('sin', 1.0000001).length === 0 && M.solveBasic('cos', NaN).length === 0, 'edges: touching levels and levels out of range')

/* -------------------------------------------------------------------------------------- 6: waves */
for (let i = 0; i < 200; i++) {
  const w = { fn: Math.random() < 0.5 ? 'sin' : 'cos', a: rnd(0.3, 4) * (Math.random() < 0.3 ? -1 : 1), b: [0.25, 0.5, 1, 1.5, 2, 3, 4][rndInt(0, 6)], c: rnd(-180, 180), d: rnd(-3, 3) }
  const info = M.waveInfo(w)
  const g = M.waveAt
  const period = 360 / w.b
  ok(near(info.period, period, 1e-12) && near(info.amplitude, Math.abs(w.a), 1e-12) && info.phaseShift === w.c && info.midline === w.d, `wave info ${JSON.stringify(w)}`)
  let mx = -Infinity
  let mn = Infinity
  for (let k = 0; k <= 7200; k++) {
    const x = (k * 2 * period) / 7200 - period
    const y = w.a * f[w.fn](w.b * (x - w.c)) + w.d
    mx = Math.max(mx, y)
    mn = Math.min(mn, y)
    if (k % 600 === 0) ok(near(g(w, x), y, 1e-12), `waveAt ${JSON.stringify(w)} at ${x}`)
  }
  ok(Math.abs(mx - info.max) < 1e-5 * Math.max(1, Math.abs(w.a)) && Math.abs(mn - info.min) < 1e-5 * Math.max(1, Math.abs(w.a)), `wave extremes ${JSON.stringify(w)}: ${mn}..${mx} against ${info.min}..${info.max}`)
  for (const x of [-100, 0, 33, 270]) ok(near(g(w, x + period), g(w, x), 1e-9), `period of ${JSON.stringify(w)}`)
  // crossings of a level, over three periods
  for (const level of [w.d, w.d + 0.5 * w.a, w.d - 0.9 * w.a, info.max, info.min, info.max + 1]) {
    const x0 = -period
    const x1 = 2 * period
    const got = M.waveLevel(w, level, x0, x1)
    ok(got.every((x) => x >= x0 - 1e-9 && x <= x1 + 1e-9 && Math.abs(g(w, x) - level) < 1e-7), `waveLevel gives a wrong x for ${JSON.stringify(w)} at ${level}`)
    // count sign changes of g - level on a fine grid
    let count = 0
    const n = 30000
    let prev = g(w, x0) - level
    for (let k = 1; k <= n; k++) {
      const cur = g(w, x0 + ((x1 - x0) * k) / n) - level
      if (prev === 0 || (prev < 0) !== (cur < 0)) count++
      prev = cur
    }
    const touching = Math.abs(level - info.max) < 1e-9 || Math.abs(level - info.min) < 1e-9
    if (!touching) ok(got.length === count, `waveLevel count for ${JSON.stringify(w)} at ${level}: ${got.length} against a scan ${count}`)
    else ok(got.length >= 3 && got.length <= 6, `waveLevel at an extreme of ${JSON.stringify(w)}: ${got.length} points`)
    ok(JSON.stringify(got) === JSON.stringify([...got].sort((p, q) => p - q)), 'waveLevel in increasing order')
  }
}
ok(M.waveLevel({ fn: 'sin', a: 1, b: 1, c: 0, d: 0 }, 2, 0, 720).length === 0, 'a level above the wave')
ok(JSON.stringify(M.waveLevel({ fn: 'sin', a: 2, b: 1, c: 0, d: 0 }, 0, 0, 360)) === '[0,180,360]', 'zeros of 2 sin x over one turn, ends included')
ok(M.waveInfo({ fn: 'cos', a: -3, b: 2, c: 10, d: 1 }).max === 4 && M.waveInfo({ fn: 'cos', a: -3, b: 2, c: 10, d: 1 }).min === -2 && M.waveInfo({ fn: 'cos', a: -3, b: 2, c: 10, d: 1 }).period === 180, 'info of a reflected wave')

/* ----------------------------------------------------------------------------------- 7: identities */
ok(JSON.stringify([...identityIds].sort()) === JSON.stringify(Object.keys(R.ident).sort()), `identity ids: ${identityIds.join(', ')}`)
ok(new Set(identityIds).size === identityIds.length, 'identity ids are unique')
const HAND = {
  pythagorean: ['\\sin^2 x+\\cos^2 x', '1'],
  tangent: ['\\tan x', '\\frac{\\sin x}{\\cos x}'],
  'double-sine': ['\\sin 2x', '2\\sin x\\cos x'],
  'sum-sine': ['\\sin(x+y)', '\\sin x\\cos y+\\cos x\\sin y'],
  'wrong-sum-sine': ['\\sin(x+y)', '\\sin x+\\sin y'],
  'wrong-double-sine': ['\\sin 2x', '2\\sin x'],
}
for (const [id, [l, r]] of Object.entries(HAND)) {
  const it = M.IDENTITIES.find((i) => i.id === id)
  ok(it.lhs === l && it.rhs === r, `TeX of ${id}`)
}
let trues = 0
let falses = 0
for (const it of M.IDENTITIES) {
  ok(it.holds === R.ident[it.id], `${it.id}: SymPy says the simplifier ${R.ident[it.id] ? 'finds' : 'does not find'} zero, the engine says holds = ${it.holds}`)
  it.holds ? trues++ : falses++
  // both sides against SymPy's numbers
  identitySamples.forEach(([x, y], i) => {
    const pv = R.vals[it.id][i]
    const [l, r] = it.eval(x, y)
    if (pv === null) return
    const bothFinite = Number.isFinite(l) && Number.isFinite(r)
    if (!bothFinite) return
    const tol = 1e-9 * Math.max(1, Math.abs(pv[0]), Math.abs(pv[1]))
    ok(Math.abs(l - pv[0]) < tol && Math.abs(r - pv[1]) < tol, `${it.id} at ${x}°, ${y}°: ${l}, ${r} against SymPy ${pv}`)
  })
  const agree = M.agreeingAngles(it, 25)
  if (it.holds) ok(agree.length === 360, `${it.id} holds but the sides differ at ${360 - agree.length} whole degrees`)
  else ok(agree.length < 360 && M.agreeingAngles(it, 70).length < 360, `${it.id} is false but no counterexample was found`)
  for (let t = 0; t < 40; t++) {
    const x = rnd(-720, 720)
    const y = rnd(-720, 720)
    const a = M.agrees(it, x, y)
    if (it.holds) ok(a, `${it.id} should agree at ${x}°, ${y}°`)
  }
}
ok(trues === 11 && falses === 6, `${trues} true and ${falses} false identities`)
// the false ones happen to agree at a few angles: the widget has to warn about it
ok(M.agreeingAngles(M.IDENTITIES.find((i) => i.id === 'wrong-double-sine')).join() === '0,180', 'sin 2x = 2 sin x happens to hold at 0° and 180° only')
ok(M.agreeingAngles(M.IDENTITIES.find((i) => i.id === 'wrong-pythagorean')).join() === '0,90', 'sin x + cos x = 1 happens to hold at 0° and 90° only')
ok(M.agrees(M.IDENTITIES.find((i) => i.id === 'tangent'), 90, 0) && !M.agrees(M.IDENTITIES.find((i) => i.id === 'wrong-half'), 90, 0), 'both sides undefined count as agreeing, and a real difference does not')

console.log(`trigbasic check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
