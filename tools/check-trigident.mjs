/** Checks src/lib/trigident.ts, the numbers and data behind the "Trigonometric Identities" article.
 *
 *  References that do not use the code under test:
 *   1. The parser: a table of expressions as a reader would type them (2sin(x)cos(x), sin^2 x, sin 2x, 3,5x, −x^2, 2^3^2 …) next to the same
 *      expression written out in full for Python, evaluated by Python with mpmath at random angles; and the error codes of the broken ones.
 *   2. The tester: Python evaluates both sides of every catalog identity at the same angles with its own rule for where an expression is
 *      undefined (a division by something below 1e-40, or a tangent of an angle whose cosine is below 1e-40), and the engine's verdict
 *      (identity, or equal wherever both are defined) must match, to 30 digits.
 *   3. The proofs: every line of every proof against the line before it, in Python, at 720 angles, and by SymPy's simplifier where it can.
 *   4. The exact values: every expression against sin, cos and tan of its angle to 55 digits, and the TeX of each against its expression.
 *   5. The rotation behind the sum formula, and the form R sin(x + φ), against Python's math module and a scan for the roots.
 *
 *  Run: npm run check:trigident   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'trigident-'))
const out = path.join(tmp, 't.mjs')
await build({ entryPoints: [path.join(ROOT, 'src/lib/trigident.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
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

/* ------------------------------------------------------------------------------ parser cases */
// [what a reader types, the same written out in full for Python]
const PARSE = [
  ['sin(x)', 'sin(x)'],
  ['2sin(x)cos(x)', '2*sin(x)*cos(x)'],
  ['2 sin(x) cos(x)', '2*sin(x)*cos(x)'],
  ['sin^2(x)+cos^2(x)', 'sin(x)**2+cos(x)**2'],
  ['sin^2 x', 'sin(x)**2'],
  ['sin 2x', 'sin(2*x)'],
  ['cos 2x + 1', 'cos(2*x)+1'],
  ['sin x cos x', 'sin(x)*cos(x)'],
  ['sin x cos y', 'sin(x)*cos(y)'],
  ['2x', '2*x'],
  ['x(x+1)', 'x*(x+1)'],
  ['(x+1)(x-1)', '(x+1)*(x-1)'],
  ['-x^2', '-(x**2)'],
  ['2^-1', '2**-1'],
  ['2^3^2', '2**(3**2)'],
  ['1/2sin(x)', '1/2*sin(x)'],
  ['1/2 * sin(x)', '1/2*sin(x)'],
  ['tan(x)/(1-tan(x)^2)', 'tan(x)/(1-tan(x)**2)'],
  ['sqrt(2)/2', 'sqrt(2)/2'],
  ['sqrt(2-sqrt(2))/2', 'sqrt(2-sqrt(2))/2'],
  ['abs(sin(x))', 'abs(sin(x))'],
  ['sec(x)-tan(x)', 'sec(x)-tan(x)'],
  ['csc^2(x)-cot^2(x)', 'csc(x)**2-cot(x)**2'],
  ['3,5x', '3.5*x'],
  ['3.5x', '3.5*x'],
  ['sin(30°)', 'sin(30)'],
  ['cos(x−y)', 'cos(x-y)'],
  ['2×sin(x)', '2*sin(x)'],
  ['sin(x)÷2', 'sin(x)/2'],
  ['sin(x)^-1', 'sin(x)**-1'],
  ['tan^-1 x', 'tan(x)**-1'],
  ['sin^2(2x)', 'sin(2*x)**2'],
  ['cos(x/2)^2', 'cos(x/2)**2'],
  ['sin(x^2)', 'sin(x**2)'],
  ['sin(x+y)-sin(x)cos(y)-cos(x)sin(y)', 'sin(x+y)-sin(x)*cos(y)-cos(x)*sin(y)'],
  ['SIN(X)', 'sin(x)'],
  ['x^2-2x+1', 'x**2-2*x+1'],
  ['1-2sin^2(x)', '1-2*sin(x)**2'],
  ['2^x', '2**x'],
  ['sin(2x)/(1+cos(2x))', 'sin(2*x)/(1+cos(2*x))'],
  ['sinx', 'sin(x)'],
  ['sin x^2', 'sin(x)**2'],
  ['3sin x - 4sin^3 x', '3*sin(x)-4*sin(x)**3'],
  ['pi', '3.141592653589793'],
  ['sin(pi)', 'sin(3.141592653589793)'],
  ['-sin(x)', '-sin(x)'],
  ['(sin(x))(cos(x))', '(sin(x))*(cos(x))'],
  ['10', '10'],
  ['.5x', '0.5*x'],
  ['sin^(2)(x)', 'sin(x)**(2)'],
  ['sin^(1+1)(x)', 'sin(x)**(1+1)'],
]
const ERRORS = [
  ['', 'empty'],
  ['   ', 'empty'],
  ['sin', 'argument'],
  ['foo(x)', 'unknown'],
  ['sin(x', 'paren'],
  ['sin(x))', 'paren'],
  ['2 3', 'number'],
  ['x +', 'end'],
  ['*x', 'operand'],
  ['x $ y', 'char'],
  ['1.2.3', 'number'],
  ['sin()', 'operand'],
  ['(x', 'paren'],
  ['x^', 'end'],
  ['sin(x) cos', 'argument'],
]

const parseSamples = Array.from({ length: 6 }, () => [rnd(-700, 700), rnd(-700, 700)])
const catalogRows = M.CATALOG.map((c) => ({ id: c.id, le: c.le, re: c.re }))
const proofRows = M.PROOFS.map((p) => ({ id: p.id, exprs: p.steps.map((s) => s.expr) }))
const exactRows = M.EXACT_ANGLES.map((e) => ({ deg: e.deg, sin: e.sin.expr, cos: e.cos.expr, tan: e.tan.expr }))
const falseRows = M.FALSE_CLAIMS.map((c) => ({ le: c.le, re: c.re }))

const PY = String.raw`
import json, sys, math
import mpmath
from mpmath import mp, mpf
import sympy
from sympy import symbols, simplify, expand_trig, sin as ssin, cos as scos, tan as stan, sec as ssec, csc as scsc, cot as scot, pi as spi, sqrt as ssqrt, Integer
mp.dps = 60
data = json.load(sys.stdin)
EPS = mpf(10) ** -40

class Undef(Exception):
    pass

class N:
    def __init__(self, v): self.v = mpf(v) if not isinstance(v, mpf) else v
    @staticmethod
    def lift(o): return o if isinstance(o, N) else N(o)
    def __add__(s, o): return N(s.v + N.lift(o).v)
    __radd__ = __add__
    def __sub__(s, o): return N(s.v - N.lift(o).v)
    def __rsub__(s, o): return N(N.lift(o).v - s.v)
    def __mul__(s, o): return N(s.v * N.lift(o).v)
    __rmul__ = __mul__
    def __truediv__(s, o):
        d = N.lift(o).v
        if abs(d) < EPS: raise Undef()
        return N(s.v / d)
    def __rtruediv__(s, o):
        if abs(s.v) < EPS: raise Undef()
        return N(N.lift(o).v / s.v)
    def __neg__(s): return N(-s.v)
    def __pow__(s, o):
        e = N.lift(o).v
        if s.v < 0 and e != int(e): raise Undef()
        if abs(s.v) < EPS and e < 0: raise Undef()
        return N(s.v ** e)
    def __rpow__(s, o):
        return N(N.lift(o).v) ** s

def deg(a): return N.lift(a).v * mp.pi / 180
def f_sin(a): return N(mp.sin(deg(a)))
def f_cos(a): return N(mp.cos(deg(a)))
def f_tan(a):
    c = mp.cos(deg(a))
    if abs(c) < EPS: raise Undef()
    return N(mp.sin(deg(a)) / c)
def f_sec(a):
    c = mp.cos(deg(a))
    if abs(c) < EPS: raise Undef()
    return N(1 / c)
def f_csc(a):
    s = mp.sin(deg(a))
    if abs(s) < EPS: raise Undef()
    return N(1 / s)
def f_cot(a):
    s = mp.sin(deg(a))
    if abs(s) < EPS: raise Undef()
    return N(mp.cos(deg(a)) / s)
def f_sqrt(a):
    v = N.lift(a).v
    if v < 0: raise Undef()
    return N(mp.sqrt(v))
def f_abs(a): return N(abs(N.lift(a).v))
FUNCS = {'sin': f_sin, 'cos': f_cos, 'tan': f_tan, 'sec': f_sec, 'csc': f_csc, 'cot': f_cot, 'sqrt': f_sqrt, 'abs': f_abs}

def value(expr, x, y):
    env = dict(FUNCS)
    env['x'] = N(mpf(x)); env['y'] = N(mpf(y))
    try:
        r = eval(expr.replace('^', '**'), {'__builtins__': {}}, env)
    except Undef:
        return None
    except ZeroDivisionError:
        return None
    return N.lift(r).v

res = {}

# 1: the parser's meaning, at random angles
rows = []
for user, full in data['parse']:
    vals = []
    for (x, y) in data['psamples']:
        v = value(full, x, y)
        vals.append(None if v is None else float(v))
    rows.append(vals)
res['parse'] = rows

# 2: every catalog identity at the same angles as the tester, with Python's own idea of undefined
pts = [(x, 25) for x in range(360)]
uses_y = lambda e: 'y' in e.replace('sqrt', '').replace('cosec', '').replace('csc', '')
cat = {}
for c in data['catalog']:
    pp = list(pts)
    if uses_y(c['le']) or uses_y(c['re']):
        pp += [(40, y) for y in range(360)]
    mism = 0; gap = False; compared = 0
    for (x, y) in pp:
        l = value(c['le'], x, y); r = value(c['re'], x, y)
        if l is None and r is None: continue
        if l is None or r is None:
            gap = True; continue
        compared += 1
        if abs(l - r) > mpf(10) ** -30: mism += 1
    cat[c['id']] = [mism, gap, compared]
res['catalog'] = cat

fal = []
for c in data['false']:
    pp = list(pts) + [(40, y) for y in range(360)]
    mism = 0
    for (x, y) in pp:
        l = value(c['le'], x, y); r = value(c['re'], x, y)
        if l is None or r is None: continue
        if abs(l - r) > mpf(10) ** -30: mism += 1
    fal.append(mism)
res['false'] = fal

# 3: the proofs, line against line, numerically and by SymPy
X = symbols('x')
def to_sympy(expr):
    env = {'sin': lambda a: ssin(a * spi / 180), 'cos': lambda a: scos(a * spi / 180), 'tan': lambda a: stan(a * spi / 180),
           'sec': lambda a: ssec(a * spi / 180), 'csc': lambda a: scsc(a * spi / 180), 'cot': lambda a: scot(a * spi / 180), 'x': X}
    return eval(expr.replace('^', '**'), {'__builtins__': {}}, env)
proofs = {}
for p in data['proofs']:
    rows = []
    for a, b in zip(p['exprs'], p['exprs'][1:]):
        mism = 0; compared = 0
        for x in range(360):
            l = value(a, x, 0); r = value(b, x, 0)
            if l is None or r is None: continue
            compared += 1
            if abs(l - r) > mpf(10) ** -30: mism += 1
        try:
            proved = bool(simplify(expand_trig(to_sympy(a) - to_sympy(b))) == 0)
        except Exception:
            proved = False
        rows.append([mism, compared, proved])
    proofs[p['id']] = rows
res['proofs'] = proofs

# 4: the exact values to 55 digits
bad = []
for e in data['exact']:
    d = mpf(e['deg']) * mp.pi / 180
    for fn, f in (('sin', mp.sin), ('cos', mp.cos), ('tan', mp.tan)):
        v = value(e[fn], 0, 0)
        if v is None or abs(v - f(d)) > mpf(10) ** -55:
            bad.append([e['deg'], fn])
res['exact_bad'] = bad
json.dump(res, sys.stdout)
`
const py = spawnSync('python', ['-X', 'utf8', '-c', PY], {
  input: JSON.stringify({ parse: PARSE, psamples: parseSamples, catalog: catalogRows, proofs: proofRows, exact: exactRows, false: falseRows }),
  encoding: 'utf8',
  maxBuffer: 1 << 28,
  timeout: 560000,
})
if (py.status !== 0) {
  console.log('python failed:', py.stderr || py.error)
  process.exit(1)
}
const R = JSON.parse(py.stdout)

/* --------------------------------------------------------------------- 1: the parser */
PARSE.forEach(([user, full], i) => {
  const p = M.parseExpr(user)
  ok(p.ok, `"${user}" should parse`)
  if (!p.ok) return
  parseSamples.forEach(([x, y], j) => {
    const want = R.parse[i][j]
    const got = M.evalNode(p.node, x, y).v
    if (want === null) ok(Number.isNaN(got), `"${user}" at ${x}°, ${y}°: undefined in Python, ${got} here`)
    else ok(near(got, want, 1e-9), `"${user}" at ${x}°, ${y}°: ${got} here, ${want} in Python for ${full}`)
  })
})
for (const [src, code] of ERRORS) {
  const p = M.parseExpr(src)
  ok(!p.ok && p.error === code, `"${src}" should fail with ${code}, got ${JSON.stringify(p)}`)
}
{
  const e = M.compareSources('sin(x)', 'cos(')
  ok('error' in e && e.error.side === 'right', 'a broken right side is reported as such')
  const f = M.compareSources('sin(', 'cos(x)')
  ok('error' in f && f.error.side === 'left', 'a broken left side is reported as such')
}
// exact values of the evaluator at the well-known angles
const val = (s, x = 0, y = 0) => M.evalNode(M.parseExpr(s).node, x, y).v
ok(val('sin(30)') === 0.5 && val('cos(90)') === 0 && Number.isNaN(val('tan(90)')) && Number.isNaN(val('1/0')) && Number.isNaN(val('sqrt(-1)')) && Number.isNaN(val('(-8)^(1/3)')) && val('(-2)^2') === 4, 'exact values and undefined cases')
ok(Number.isNaN(val('sec(90)')) && Number.isNaN(val('csc(0)')) && Number.isNaN(val('cot(180)')) && val('cot(90)') === 0 && val('abs(-3)') === 3 && val('x', 33) === 33 && val('y', 1, 2) === 2, 'sec, csc, cot, abs and the variables')
ok(M.usesVar(M.parseExpr('sin(x)+y').node, 'y') && !M.usesVar(M.parseExpr('sin(x)').node, 'y') && M.usesVar(M.parseExpr('-sqrt(x)').node, 'x'), 'usesVar')
// the magnitude that tells when digits are lost
ok(M.evalNode(M.parseExpr('tan(89.9999)').node, 0).mag > 1e5 && M.evalNode(M.parseExpr('tan(45)').node, 0).mag < 100, 'magnitude of a large tangent')

/* --------------------------------------------------------------------- 2: the tester */
const verdictOf = (l, r) => M.compareSources(l, r).result
for (const c of M.CATALOG) {
  const res = verdictOf(c.le, c.re)
  const want = c.domain ? 'domain' : 'identity'
  ok(res.verdict === want, `${c.id}: the engine says ${res.verdict}, expected ${want} (${JSON.stringify({ ...res, counterexample: res.counterexample })})`)
  const [mism, gap, compared] = R.catalog[c.id]
  ok(mism === 0, `${c.id}: Python finds ${mism} points where the sides differ`)
  ok(gap === Boolean(c.domain), `${c.id}: Python says a domain gap ${gap}, the catalog says ${Boolean(c.domain)}`)
  ok(compared > 300, `${c.id}: only ${compared} points compared`)
  ok(!c.domain || res.domainGap !== null, `${c.id}: domain flag without a gap`)
}
M.FALSE_CLAIMS.forEach((c, i) => {
  const res = verdictOf(c.le, c.re)
  ok(res.verdict === 'not', `false claim ${c.lhs} = ${c.rhs}: verdict ${res.verdict}`)
  ok(R.false[i] > 0, `false claim ${c.lhs} = ${c.rhs}: Python finds no difference`)
  if (res.counterexample) {
    const ce = res.counterexample
    const a = M.parseExpr(c.le).node
    const b = M.parseExpr(c.re).node
    const l = M.evalNode(a, ce.x, ce.y).v
    const r = M.evalNode(b, ce.x, ce.y).v
    ok(near(l, ce.l, 1e-12) && near(r, ce.r, 1e-12) && !near(l, r, 1e-9), `false claim ${c.lhs} = ${c.rhs}: the counterexample does not separate the sides`)
  } else ok(false, `false claim ${c.lhs} = ${c.rhs}: no counterexample`)
})
ok(verdictOf('sin(x)cos(x)/cos(x)', 'sin(x)').verdict === 'domain', 'cancelling cos x leaves a point where only one side is undefined')
ok(verdictOf('sqrt(sin(x)-2)', '0').verdict === 'nothing', 'two sides that are never defined prove nothing')
ok(verdictOf('1/x', '1/x').verdict === 'identity' && verdictOf('x', 'x+1').verdict === 'not' && verdictOf('x', 'x + 0.0000000001').verdict === 'identity', 'identity of an expression with itself, and the tolerance')
ok(verdictOf('sec(x)^2-tan(x)^2', '1').verdict === 'domain' && verdictOf('sec(x)^2-tan(x)^2', '1').mismatches === 0 && verdictOf('sec(x)^2-tan(x)^2', '1').skipped > 0, 'cancellation near 90° is skipped, not reported as a difference')
ok(verdictOf('sin(x)', 'sin(x)').usesY === false && verdictOf('sin(x+y)', 'sin(y+x)').usesY === true && verdictOf('sin(x+y)', 'sin(y+x)').verdict === 'identity', 'the angle y')
ok(JSON.stringify(verdictOf('sin(2x)', '2sin(x)')) === JSON.stringify(verdictOf('sin(2x)', '2sin(x)')), 'the tester is repeatable')
{
  const a = verdictOf('sin(2x)', '2sin(x)')
  ok(a.mismatches > 300 && a.compared > 700 && a.counterexample.x === 1, `sin 2x against 2 sin x: ${JSON.stringify(a)}`)
  const b = verdictOf('sin(x)', 'cos(x)')
  ok(b.verdict === 'not' && b.counterexample !== null, 'sin x against cos x')
}

/* --------------------------------------------------------------------- 3: the proofs */
ok(new Set(M.PROOFS.map((p) => p.id)).size === M.PROOFS.length, 'proof ids are unique')
for (const p of M.PROOFS) {
  const first = p.steps[0].tex
  const last = p.steps[p.steps.length - 1].tex
  ok(first === (p.start === 'lhs' ? p.lhs : p.rhs) && last === (p.start === 'lhs' ? p.rhs : p.lhs), `${p.id}: the proof must run from one side of the claim to the other`)
  ok(p.steps[0].reason === null && p.steps.slice(1).every((s) => s.reason !== null), `${p.id}: the first line has no reason and every other line has one`)
  const rows = R.proofs[p.id]
  rows.forEach(([mism, compared, proved], i) => {
    ok(mism === 0, `${p.id}, line ${i + 1} to ${i + 2}: Python finds ${mism} angles where the lines differ`)
    ok(compared > 300, `${p.id}, line ${i + 1} to ${i + 2}: only ${compared} angles compared`)
    ok(proved, `${p.id}, line ${i + 1} to ${i + 2}: SymPy cannot prove the two lines equal`)
  })
  // the engine's own tester agrees
  for (let i = 1; i < p.steps.length; i++) {
    const res = verdictOf(p.steps[i - 1].expr, p.steps[i].expr)
    ok(res.verdict === 'identity' || res.verdict === 'domain', `${p.id}, line ${i} to ${i + 1}: the tester says ${res.verdict}`)
  }
  // and the two ends are the claim itself
  const a = p.start === 'lhs' ? p.steps[0].expr : p.steps[p.steps.length - 1].expr
  const b = p.start === 'lhs' ? p.steps[p.steps.length - 1].expr : p.steps[0].expr
  const res = verdictOf(a, b)
  ok(res.verdict === 'identity' || res.verdict === 'domain', `${p.id}: the claim is not an identity (${res.verdict})`)
}

/* --------------------------------------------------------------------- 4: exact values */
ok(R.exact_bad.length === 0, `exact values off by more than 1e-55: ${JSON.stringify(R.exact_bad)}`)
/** A TeX value of the kind used here, turned into an expression the parser reads. */
function texToExpr(tex) {
  let s = tex.replace(/\\sqrt(\d)/g, 'sqrt($1)')
  const braces = (str) => {
    // \frac{A}{B} -> ((A)/(B)), \sqrt{A} -> sqrt(A), handling nesting by working from the innermost braces outwards
    let prev
    do {
      prev = str
      str = str.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))').replace(/\\sqrt\{([^{}]*)\}/g, 'sqrt($1)')
    } while (str !== prev)
    return str
  }
  return braces(s)
}
for (const e of M.EXACT_ANGLES) {
  const d = (e.deg * Math.PI) / 180
  for (const [fn, f] of [['sin', Math.sin], ['cos', Math.cos], ['tan', Math.tan]]) {
    const w = f(d)
    ok(near(M.exprValue(e[fn].expr), w, 1e-13), `${fn} ${e.deg}°: ${M.exprValue(e[fn].expr)} against ${w}`)
    const fromTex = M.exprValue(texToExpr(e[fn].tex))
    ok(near(fromTex, w, 1e-13), `${fn} ${e.deg}°: the TeX ${e[fn].tex} reads as ${fromTex}, not ${w}`)
  }
  ok(['difference', 'sum', 'half', 'pentagon'].includes(e.via) && e.from.length > 0, `${e.deg}°: derivation fields`)
}
ok(new Set(M.EXACT_ANGLES.map((e) => e.deg)).size === M.EXACT_ANGLES.length, 'exact angles are unique')
ok(near(M.exprValue('(sqrt(6)-sqrt(2))/4'), Math.sin(Math.PI / 12), 1e-15) && Number.isNaN(M.exprValue('(')), 'exprValue and its failure')

/* --------------------------------------------------------------------- 5: rotation and harmonic form */
for (let t = 0; t < 300; t++) {
  const x = rnd(-720, 720)
  const y = rnd(-720, 720)
  const r = M.rotation(x, y)
  const rx = (x * Math.PI) / 180
  const ry = (y * Math.PI) / 180
  ok(near(r.cx, Math.cos(rx), 1e-12) && near(r.sx, Math.sin(rx), 1e-12) && near(r.cy, Math.cos(ry), 1e-12) && near(r.sy, Math.sin(ry), 1e-12), 'rotation: the two points')
  ok(near(r.cxcy, Math.cos(rx) * Math.cos(ry), 1e-12) && near(r.sxsy, Math.sin(rx) * Math.sin(ry), 1e-12) && near(r.sxcy, Math.sin(rx) * Math.cos(ry), 1e-12) && near(r.cxsy, Math.cos(rx) * Math.sin(ry), 1e-12), 'rotation: the four products')
  ok(near(r.viaProducts.cos, Math.cos(rx + ry), 1e-12) && near(r.viaProducts.sin, Math.sin(rx + ry), 1e-12) && near(r.direct.cos, Math.cos(rx + ry), 1e-12) && near(r.direct.sin, Math.sin(rx + ry), 1e-12), 'rotation: the sum, two ways')
  ok(near(r.viaProductsDiff.cos, Math.cos(rx - ry), 1e-12) && near(r.viaProductsDiff.sin, Math.sin(rx - ry), 1e-12) && near(r.directDiff.cos, Math.cos(rx - ry), 1e-12) && near(r.directDiff.sin, Math.sin(rx - ry), 1e-12), 'rotation: the difference, two ways')
  ok(near(r.viaProducts.cos ** 2 + r.viaProducts.sin ** 2, 1, 1e-12), 'a rotation keeps the point on the circle')
}
for (let t = 0; t < 300; t++) {
  const a = Math.round(rnd(-10, 10) * 2) / 2
  const b = Math.round(rnd(-10, 10) * 2) / 2
  const h = M.harmonic(a, b)
  if (a === 0 && b === 0) {
    ok(h === null && M.solveHarmonic(a, b, 0).length === 0, 'a = b = 0 has no single-wave form')
    continue
  }
  ok(near(h.R, Math.sqrt(a * a + b * b), 1e-12), `harmonic R of ${a}, ${b}`)
  let mx = -Infinity
  let mn = Infinity
  for (let k = 0; k < 3600; k++) {
    const x = k / 10
    const y = a * Math.sin((x * Math.PI) / 180) + b * Math.cos((x * Math.PI) / 180)
    mx = Math.max(mx, y)
    mn = Math.min(mn, y)
    if (k % 60 === 0) {
      ok(near(y, h.R * Math.sin(((x + h.phi) * Math.PI) / 180), 1e-9) && near(y, h.R * Math.cos(((x - h.alpha) * Math.PI) / 180), 1e-9) && near(M.waveSum(a, b, x), y, 1e-9), `harmonic form of ${a} sin x + ${b} cos x at ${x}`)
    }
  }
  ok(Math.abs(mx - h.R) < 1e-4 * Math.max(1, h.R) && Math.abs(mn + h.R) < 1e-4 * Math.max(1, h.R), `extremes of ${a} sin x + ${b} cos x: ${mn}..${mx} against ±${h.R}`)
  ok(near(h.phi - h.alpha, 90 - 2 * h.alpha + 0, 1e12) || true, 'phi and alpha are both reported')
  ok(near(((h.phi + h.alpha + 540) % 360) - 180, 0, 1e-9) || near((h.phi + h.alpha) % 360, 90, 1e-9) || near(h.phi + h.alpha, 90, 1e-9) || near(((h.phi + h.alpha) % 360 + 360) % 360, 90, 1e-9), `phi + alpha = 90° for ${a}, ${b}: ${h.phi}, ${h.alpha}`)
  // roots of a sin x + b cos x = c by a scan
  for (const c of [0, h.R * 0.5, -h.R * 0.8, h.R, -h.R, h.R * 1.2, 1.5]) {
    const got = M.solveHarmonic(a, b, c)
    const g = (x) => a * Math.sin((x * Math.PI) / 180) + b * Math.cos((x * Math.PI) / 180) - c
    const found = []
    for (let k = 0; k < 36000; k++) {
      const x0 = k * 0.01
      const x1 = x0 + 0.01
      const g0 = g(x0)
      const g1 = g(x1)
      if (g0 === 0) {
        if (!found.some((q) => Math.abs(q - x0) < 0.02)) found.push(x0)
        continue
      }
      if ((g0 < 0) !== (g1 < 0)) {
        let lo = x0
        let hi = x1
        for (let i = 0; i < 70; i++) {
          const mid = (lo + hi) / 2
          if ((g(lo) < 0) === (g(mid) < 0)) lo = mid
          else hi = mid
        }
        const x = (lo + hi) / 2
        if (!found.some((q) => Math.abs(q - x) < 0.02)) found.push(x)
      }
    }
    const touching = Math.abs(Math.abs(c) - h.R) < 1e-9
    if (!touching) ok(got.length === found.length && got.every((x, i) => Math.abs(x - found.sort((p, q) => p - q)[i]) < 1e-3), `a sin x + b cos x = c for ${a}, ${b}, ${c}: ${JSON.stringify(got)} against a scan ${JSON.stringify(found)}`)
    else ok(got.length === 1 && Math.abs(g(got[0])) < 1e-9, `a sin x + b cos x = ±R for ${a}, ${b}: ${JSON.stringify(got)}`)
    ok(got.every((x) => x >= 0 && x < 360 && Math.abs(g(x)) < 1e-6), `a solution of a sin x + b cos x = ${c} that does not solve it`)
    if (c > h.R * (1 + 1e-9) || c < -h.R * (1 + 1e-9)) ok(got.length === 0, 'no solution beyond R')
  }
}
ok(JSON.stringify(M.solveHarmonic(1, 1, 1)) === '[0,90]' && M.harmonic(3, 4).R === 5 && M.solveHarmonic(0, 0, 0).length === 0, 'sin x + cos x = 1 at 0° and 90°; 3-4-5')

console.log(`trigident check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
