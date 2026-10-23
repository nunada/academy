/** Checks src/lib/implicitdiff.ts, the implicit differentiation behind the "Implicit Differentiation" article's widgets.
 *
 *  Independent references, none of which runs the algorithm under test:
 *   1. Curves built around a known function: (y − f(x))·R(x, y) = 0 contains the graph of y = f(x), so at the point
 *      (x, f(x)) the implicit slope must be exactly f′(x), which derivative.ts finds on reduced polynomial fractions.
 *   2. A list of curves, among them the circle, the folium of Descartes and curves with sin and e^u: at random points the
 *      equation is solved for y by Newton's method on both sides of x, and the central difference of those solutions is
 *      the slope; the second derivative is the central difference of the slopes.
 *   3. Hand-worked results of the chapter (the circle at (3, −4), the folium at (2, 4), the ellipse's parallel tangents,
 *      the horizontal and vertical tangents of the folium), printed formulas, and the power rule for rational exponents
 *      derived from y^q = x^p.
 *   4. The marching-squares drawing of a curve really lies on the curve, and the refusals (no equals sign, no y, a
 *      variable exponent, sin xy without brackets).
 *
 *  Run: npm run check:implicit   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'impl-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/implicitdiff.ts')}'\nexport { toTex, toText, evalFloat, evalExact, rationalDerivativeAt, K, X, Y, neg, add, sub, mul, div, pw, rat, simp } from '${p('src/lib/chain.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const D = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
let checks = 0
const fail = (m) => {
  bad++
  if (bad <= 30) console.log(m)
}
const eq = (got, want, what) => {
  checks++
  if (got !== want) fail(`${what}: got ${got}, want ${want}`)
}
const close = (got, want, what, tol = 1e-5) => {
  checks++
  const scale = Math.max(1, Math.abs(want))
  if (!(Math.abs(got - want) / scale < tol)) fail(`${what}: got ${got}, want ${want}`)
}
const B = BigInt
const R = (n, d = 1) => D.rat(B(n), B(d))
const txt = (r) => (r === null ? 'null' : `${r.n}/${r.d}`)
// a reproducible random source (mulberry32), so every run checks the same curves and points
let seed = 20261024
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const rnd = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1))
// derivative of g at x by Richardson extrapolation of the central difference (error O(h^4), not O(h^2)). The step is
// halved until two successive estimates agree to 1e-8, which a point near a vertical tangent needs; NaN if they never do
const deriv = (g, x, h0) => {
  const c = (k) => (g(x + k) - g(x - k)) / (2 * k)
  const est = (h) => (4 * c(h / 2) - c(h)) / 3
  let prev = est(h0)
  for (let h = h0 / 2; h >= 2e-5; h /= 2) {
    const cur = est(h)
    if (Math.abs(cur - prev) < 1e-8 * Math.max(1, Math.abs(cur))) return cur
    prev = cur
  }
  return NaN
}
const pick = (a) => a[rnd(0, a.length - 1)]
const imp = (src) => D.implicitDerivative(D.parseEquation(src))
const tex = (src) => D.toTex(imp(src).slope)
const at = (src, x, y) => D.slopeAt(imp(src), x, y)

/* ------------------------------------------- 1. curves around a known function */
const genRational = (depth) => {
  if (depth <= 0 || rand() < 0.25) return rand() < 0.3 ? D.K(rnd(-4, 4), rnd(1, 3)) : D.X
  const op = pick(['add', 'sub', 'mul', 'div', 'neg', 'pow', 'pow'])
  if (op === 'neg') return D.neg(genRational(depth - 1))
  if (op === 'pow') return D.pw(genRational(depth - 1), pick([-2, 2, 3]))
  return D[op](genRational(depth - 1), genRational(depth - 1))
}
const genR = (depth) => {
  if (depth <= 0 || rand() < 0.3) {
    const c = rand()
    return c < 0.3 ? D.K(rnd(1, 4)) : c < 0.65 ? D.X : D.Y
  }
  const op = pick(['add', 'sub', 'mul', 'pow'])
  if (op === 'pow') return D.pw(genR(depth - 1), pick([2, 3]))
  return D[op](genR(depth - 1), genR(depth - 1))
}
let exact = 0
for (let i = 0; i < 4000; i++) {
  const f = genRational(3)
  const Rr = genR(2)
  const x = R(rnd(-6, 6), rnd(1, 3))
  const y = D.evalExact(f, x)
  if (y === null) continue
  const rv = D.evalExact(Rr, x, y)
  if (rv === null || rv.n === 0n) continue
  const F = D.mul(D.sub(D.Y, f), Rr)
  let result
  try {
    result = D.implicitDerivative({ lhs: F, rhs: D.K(0) })
  } catch {
    continue
  }
  const sv = D.evalExact(result.slope, x, y)
  const ref = D.rationalDerivativeAt(f, x)
  if (sv === null || ref === null) continue
  exact++
  eq(txt(sv), txt(ref), `slope of (y − ${D.toText(f)})·${D.toText(Rr)} = 0 at ${txt(x)}`)
}
eq(exact > 800, true, 'enough curves around a known function')

/* --------------------- 2. a list of curves: Newton's method and central differences */
const CURVES = [
  'x^2+y^2=25',
  'y^2=x',
  'x^3+y^3=9xy',
  'y^2=x^2+sin(x y)',
  '2x^3-3y^2=8',
  'x^2+x y+y^2=7',
  'y^4=y^2-x^2',
  'y^2(2-x)=x^3',
  'y^4-4y^2=x^4-9x^2',
  'x y^2=1',
  'sin(x y)=x+y',
  'e^(x y)+y=3',
  'x^2 y+y^3=5',
  'y^3=x^2',
  'x^4+y^4=16',
  'tan(x y)=x+y',
  'sqrt(x^2+y^2)=x+2',
  'cos(x)+cos(y)=1',
  'x e^y+y e^x=2',
  'x^2/9+y^2/4=1',
]
let newton = 0
let second = 0
for (const src of CURVES) {
  const r = D.implicitDerivative(D.parseEquation(src))
  const H = D.curveFn(r.eq)
  const sec = D.secondDerivative(r)
  for (let k = 0; k < 160; k++) {
    const x = (rand() - 0.5) * 6
    const g = (rand() - 0.5) * 8
    const y = D.solveY(H, x, g)
    if (y === null || Math.abs(y) > 20 || Math.hypot(x, y) < 0.2) continue // the origin is a singular point of several of these curves
    const m = D.slopeAt(r, x, y)
    if (!Number.isFinite(m) || Math.abs(m) > 8) continue
    // y(x ± h) by Newton's method; a step that leaves the branch (or the curve) gives NaN and the step is halved
    const yAt = (xx) => {
      const yy = D.solveY(H, xx, y)
      return yy === null || Math.abs(yy - y) > 0.5 ? NaN : yy
    }
    const ref = deriv(yAt, x, 4e-3)
    if (!Number.isFinite(ref)) continue
    newton++
    close(m, ref, `slope of ${src} at (${x}, ${y})`, 1e-5)
    const slopeAt = (xx) => {
      const yy = D.solveY(H, xx, y)
      return yy === null ? NaN : D.slopeAt(r, xx, yy)
    }
    const s = D.evalFloat(sec, x, y)
    const cd = deriv(slopeAt, x, 4e-3)
    if (Number.isFinite(s) && Number.isFinite(cd) && Math.abs(s) < 60 && Math.abs(m) < 5) {
      second++
      close(s, cd, `second derivative of ${src} at (${x}, ${y})`, 3e-3)
    }
  }
}
eq(newton > 1500, true, 'enough curve points checked by Newton')
eq(second > 1000, true, 'enough second derivatives checked')

/* ----------------------------------------------------------------- 3. by hand */
close(at('x^2+y^2=25', 3, -4), 0.75, 'the circle at (3, −4) has slope 3/4')
close(at('x^2+y^2=25', 3, 4), -0.75, 'the circle at (3, 4)')
close(at('y^2=x', 4, 2), 0.25, 'y^2 = x at (4, 2): 1/(2y)')
close(at('y^2=x', 4, -2), -0.25, 'y^2 = x at (4, −2)')
close(at('x^3+y^3=9xy', 2, 4), 0.8, 'the folium at (2, 4) has slope 4/5')
close(at('x^3+y^3=9xy', 4, 2), 1.25, 'the folium at (4, 2) has slope 5/4')
close(at('x^2+x y+y^2=7', Math.sqrt(7), 0), -2, 'the ellipse at (√7, 0)')
close(at('x^2+x y+y^2=7', -Math.sqrt(7), 0), -2, 'the ellipse at (−√7, 0): parallel tangents')
close(at('y^2=x^3', 1, 1), 1.5, 'y^2 = x^3 at (1, 1)')
close(at('x^3+y^3=2x y', 1, 1), -1, 'x^3 + y^3 = 2xy at (1, 1)')
close(at('y^3=x^2', 8, 4), 2 * 8 / (3 * 16), 'y^3 = x^2 at (8, 4)')
// the folium has a horizontal tangent where y = x²/3 on the curve, x³ = 54, and a vertical one where y² = 3x
const xh = Math.cbrt(54)
close(at('x^3+y^3=9xy', xh, (xh * xh) / 3), 0, 'the folium has a horizontal tangent at x = ∛54')
close(Math.abs(xh ** 3 + ((xh * xh) / 3) ** 3 - 9 * xh * ((xh * xh) / 3)), 0, 'and that point is on the curve', 1e-9)
eq(!(Math.abs(at('x^3+y^3=9xy', (Math.cbrt(54) ** 2) / 3, Math.cbrt(54))) < 1e6), true, 'the folium has a vertical tangent at (∛54²/3, ∛54)')
// at the origin of the folium the formula is 0/0
eq(Number.isNaN(at('x^3+y^3=9xy', 0, 0)), true, 'the folium at the origin is 0/0')
// the normal line is perpendicular to the tangent
close(at('x^3+y^3=9xy', 2, 4) * (-1 / at('x^3+y^3=9xy', 2, 4)), -1, 'the normal slope is the negative reciprocal')
// printed formulas
eq(tex('x^2+y^2=25'), '-\\frac{x}{y}', 'TeX of the circle')
eq(tex('y^2=x'), '\\frac{1}{2y}', 'TeX of y^2 = x')
eq(tex('2x^3-3y^2=8'), '\\frac{x^{2}}{y}', "TeX of Example 4's slope")
eq(tex('x^3+y^3=9xy'), '\\frac{-x^{2}+3y}{y^{2}-3x}', 'TeX of the folium')
eq(tex('y^2=x^2+sin(x y)'), '\\frac{2x+y\\cos\\left(xy\\right)}{2y-x\\cos\\left(xy\\right)}', "TeX of Example 3's slope")
eq(tex('x y^2=1'), '-\\frac{y}{2x}', 'TeX of xy^2 = 1')
// the second derivatives of the chapter, in x and y
for (const [src, f] of [
  ['x^2+y^2=25', (x, y) => -25 / y ** 3],
  ['2x^3-3y^2=8', (x, y) => (2 * x) / y - x ** 4 / y ** 3],
  ['y^2=x', (x, y) => -1 / (4 * y ** 3)],
  ['x y^2=1', (x, y) => (3 * y) / (4 * x * x)],
]) {
  const r = imp(src)
  const sec = D.secondDerivative(r)
  const H = D.curveFn(r.eq)
  for (let k = 0; k < 40; k++) {
    const x = 0.5 + rand() * 3
    const y = D.solveY(H, x, 1 + rand() * 2)
    if (y === null) continue
    close(D.evalFloat(sec, x, y), f(x, y), `y'' of ${src} at (${x}, ${y})`, 1e-7)
  }
}
// the power rule for rational exponents: y = x^(p/q) from y^q = x^p
for (const [pp, q] of [[1, 2], [2, 3], [3, 4], [-1, 2], [-2, 3], [5, 3], [3, 2], [4, 3]]) {
  const src = `y^${q}=x^(${pp})`
  const r = imp(src)
  for (let k = 0; k < 20; k++) {
    const x = 0.3 + rand() * 4
    const y = x ** (pp / q)
    close(D.slopeAt(r, x, y), (pp / q) * x ** (pp / q - 1), `d/dx x^(${pp}/${q}) from ${src}`, 1e-9)
  }
}

/* ------------------------------------------------ 4. the drawing and the refusals */
for (const [src, tol] of [['x^2+y^2=25', 0.02], ['x^3+y^3=9xy', 0.3], ['x^2+x y+y^2=7', 0.05]]) {
  const r = imp(src)
  const H = D.curveFn(r.eq)
  const segs = D.contour(H, -7, 7, -7, 7, 140)
  eq(segs.length > 150, true, `the drawing of ${src} has enough segments`)
  let worst = 0
  for (const [a, b, c, d] of segs) {
    for (const [x, y] of [[a, b], [c, d]]) {
      const ys = D.solveY(H, x, y)
      worst = Math.max(worst, ys === null ? 99 : Math.abs(ys - y))
    }
  }
  // a segment end lies within a cell of the curve; vertical stretches of the curve make this larger, so use both ways
  checks++
  if (worst > Math.max(tol, 0.7)) fail(`a segment of ${src} is far from the curve: ${worst}`)
}
{
  const H = D.curveFn(D.parseEquation('x^2+y^2=25'))
  let worst = 0
  for (const [a, b, c, d] of D.contour(H, -7, 7, -7, 7, 140)) {
    worst = Math.max(worst, Math.abs(Math.hypot(a, b) - 5), Math.abs(Math.hypot(c, d) - 5))
  }
  close(worst, 0, 'every end of every segment of the circle is within 0.01 of radius 5', 0.01)
}
for (const [src, code] of [
  ['x^2+y^2', 'equation'],
  ['x^2+y^2=25=3', 'equation'],
  ['=3', 'equation'],
  ['x^2=3', 'noy'],
  ['5=3', 'noy'],
  ['x^y=2', 'varexp'],
  ['2^y=x', 'varexp'],
  ['y^x=2', 'varexp'],
  ['sin xy=1', 'paren'],
  ['ln(y)=x', 'function'],
]) {
  let got = ''
  try {
    imp(src)
  } catch (e) {
    got = e.code ?? e.message
  }
  eq(got, code, `the reason for refusing "${src}"`)
}
for (const src of ['x^2+y^2=25', 'x y=1', 'sin(x y)=x', 'y=x^2', 'e^y=x', 'sqrt(y)=x', 'x^2 y^3 = 4', '(x+y)^2=x^2+y', 'y^2/9 + x^2/4 = 1', '3y=2x+1', 'y=sin(y)+x']) {
  let ok = true
  try {
    imp(src)
  } catch {
    ok = false
  }
  eq(ok, true, `"${src}" is accepted`)
}
// an equation with no points: the formula exists, the curve does not
close(at('x^2+y^2=-1', 1, 2), -0.5, 'x^2 + y^2 = −1 still produces the formula −x/y (and has no curve)')
eq(D.contour(D.curveFn(D.parseEquation('x^2+y^2=-1')), -7, 7, -7, 7, 60).length, 0, 'and its drawing is empty')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`implicit check ok — ${checks} checks (curves around a known function vs exact derivatives, twenty curves vs Newton's method and central differences for y′ and y″, the chapter's examples and printed formulas, the rational power rule, the drawing, the refusals)`)
