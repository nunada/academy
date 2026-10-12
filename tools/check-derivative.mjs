/** Checks src/lib/derivative.ts, the engine behind the "The Derivative as a Function" article's widgets.
 *
 *  Independent references, so nothing is checked against itself:
 *   1. Hand-worked derivative functions: x², x³, 1/x, x/(x − 1), (x² + 1)/(x − 2), 1/(x² + 1).
 *   2. For polynomials, the difference quotient written as a polynomial in h with coefficients in x (the binomial theorem)
 *      against the quotient computed straight from the definition, and its h⁰ part against the derivative.
 *   3. For rational functions, the reduced derivative against the difference quotient at h = 10⁻ᵏ: the gap must shrink in
 *      proportion to h (a factor of about 10 for every step), which only happens at the true derivative.
 *   4. Polynomial division and gcd (a·b / b has no remainder, gcd of a product with a known factor).
 *   5. Polylines: slopes against difference quotients inside a piece, corners against one-sided quotients, and the round
 *      trip from a graph to its step function and back.
 *   6. The floating-point graphs the page draws: each derivative formula against central differences.
 *   7. Reading a typed function.
 *
 *  Run: npm run check:derivative   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'der-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(
  entry,
  `export * from '${p('src/lib/derivative.ts')}'\nexport { evalPoly, derivative, polyMul, polyAdd, polySub, polyTex } from '${p('src/lib/tangent.ts')}'\nexport { ratAdd, ratMul, ratSub, ratDiv } from '${p('src/lib/rationals.ts')}'`,
)
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
const B = BigInt
const R = (n, d = 1) => D.rat(B(n), B(d))
const txt = (r) => (r === null ? 'null' : `${r.n}/${r.d}`)
const ptxt = (poly) => poly.map(txt).join(',')
const num = (r) => Number(r.n) / Number(r.d)
const same = (a, b) => a.n === b.n && a.d === b.d
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const randRat = (span = 5, den = 3) => R(rnd(-span, span), rnd(1, den))
const P = (...cs) => cs.map((c) => (Array.isArray(c) ? R(c[0], c[1]) : R(c)))
const randPoly = (maxDeg = 4) => {
  const d = rnd(0, maxDeg)
  const q = Array.from({ length: d + 1 }, () => randRat())
  if (q[d].n === 0n) q[d] = R(1)
  return D.polyAdd(q, [])
}
const fnText = (f) => `${ptxt(f.num)} / ${ptxt(f.den)}`

/* ------------------------------------------------------------------ 1. by hand */
const dr = (src) => D.derivativeFn(D.parseFunction(src))
let d = dr('x^2')
eq(fnText(d), '0/1,2/1 / 1/1', 'derivative of x² is 2x')
d = dr('x^3')
eq(fnText(d), '0/1,0/1,3/1 / 1/1', 'derivative of x³ is 3x²')
d = dr('1/x')
eq(fnText(d), '-1/1 / 0/1,0/1,1/1', 'derivative of 1/x is -1/x²')
d = dr('x/(x-1)')
eq(fnText(d), '-1/1 / 1/1,-2/1,1/1', 'derivative of x/(x-1) is -1/(x-1)²')
d = dr('1/(x^2+1)')
eq(fnText(d), '0/1,-2/1 / 1/1,0/1,2/1,0/1,1/1', 'derivative of 1/(x²+1) is -2x/(x²+1)²')
d = dr('(x^2-1)/(x-1)')
eq(fnText(d), '1/1 / 1/1', 'a removable factor reduces away: (x²-1)/(x-1) has derivative 1 once reduced')
eq(txt(D.evalFn(D.parseFunction('x/(x-1)'), R(3))), '3/2', 'f(3) for x/(x-1)')
eq(txt(D.evalFn(D.parseFunction('x/(x-1)'), R(1))), 'null', 'x/(x-1) is undefined at 1')
eq(txt(D.evalFn(dr('x/(x-1)'), R(3))), '-1/4', "f'(3) = -1/4 for x/(x-1)")
eq(ptxt(D.excludedPoints(D.parseFunction('x/(x-1)')).rational), '1/1', 'excluded point 1')
eq(ptxt(D.excludedPoints(D.parseFunction('1/(x^2+1)')).rational), '', 'no real excluded point of 1/(x²+1)')

/* -------- 2. the difference quotient as a polynomial in h, for polynomials */
for (let i = 0; i < 3000; i++) {
  const poly = randPoly()
  const f = { num: poly, den: [R(1)] }
  const qs = D.quotientInXandH(poly)
  const x = randRat()
  const h = randRat(4, 6)
  if (h.n !== 0n) eq(txt(D.evalQuotient(qs, x, h)), txt(D.diffQuotientFn(f, x, h)), 'Σ Q_k(x) h^k is the difference quotient')
  const q0 = qs[0] ?? []
  eq(ptxt(q0), ptxt(D.derivative(poly)), 'the h⁰ part is the derivative function')
  eq(txt(D.evalQuotient(qs, x, R(0))), txt(D.evalPoly(D.derivative(poly), x)), 'h = 0 gives f′(x)')
}

/* ---- 3. rational functions: the gap to the difference quotient shrinks like h */
let ratioChecked = 0
for (let i = 0; i < 2500; i++) {
  const num_ = randPoly(3)
  let den_ = randPoly(2)
  if (den_.length === 0 || (den_.length === 1 && den_[0].n === 0n)) den_ = [R(1)]
  const f = { num: num_, den: den_ }
  const df = D.derivativeFn(f)
  const x = randRat(4, 2)
  const fx = D.evalFn(f, x)
  if (fx === null) continue
  // keep away from the poles: skip if some small h hits one
  const gap = (k) => {
    const h = R(1, 10 ** k)
    const q = D.diffQuotientFn(f, x, h)
    const fp = D.evalFn(df, x)
    if (q === null || fp === null) return null
    return Math.abs(num(q) - num(fp))
  }
  const g3 = gap(3)
  const g5 = gap(5)
  const g7 = gap(7)
  if (g3 === null || g5 === null || g7 === null) continue
  // a true derivative: the gap at h = 1e-5 is about 1/100 of the gap at 1e-3 (when the gap is not already tiny)
  if (g3 > 1e-6) {
    ratioChecked++
    eq(g5 < g3 / 20 && g7 < g5 / 20, true, `gap shrinks like h at x = ${txt(x)} for ${fnText(f)}: ${g3}, ${g5}, ${g7}`)
  }
  // a wrong "derivative" (the numerator derivative alone, or the function itself) does not have that property unless it coincides
  const wrong = D.derivative(num_)
  if (degree_(den_) > 0) {
    const wv = D.evalPoly(wrong, x)
    const dv = D.evalFn(df, x)
    if (dv !== null && !same(wv, dv)) {
      const q = D.diffQuotientFn(f, x, R(1, 10 ** 7))
      if (q !== null) eq(Math.abs(num(q) - num(wv)) > 1e-6, true, 'a wrong derivative is not approached by the quotients')
    }
  }
}
function degree_(poly) {
  return poly.length - 1
}
eq(ratioChecked > 300, true, 'enough rational functions were tested')

/* ------------------------------------------------ 4. polynomial division and gcd */
for (let i = 0; i < 2000; i++) {
  const a = randPoly(3)
  const b = randPoly(3)
  if (b.length === 0) continue
  const prod = D.polyMul(a, b)
  const { q, r } = D.polyDivmod(prod, b)
  eq(r.length, 0, 'a product divided by a factor leaves no remainder')
  eq(ptxt(q), ptxt(a), 'and the quotient is the other factor')
  const { q: q2, r: r2 } = D.polyDivmod(a, b)
  eq(ptxt(D.polyAdd(D.polyMul(q2, b), r2)), ptxt(a), 'a = q·b + r')
  eq(r2.length < b.length || b.length === 1, true, 'the remainder is shorter than the divisor')
  const common = randPoly(2)
  if (common.length) {
    const g = D.polyGcd(D.polyMul(a, common), D.polyMul(b, common))
    // gcd is a multiple of the common factor (up to a constant)
    eq(D.polyDivmod(g, common.map((c) => D.ratDiv(c, common[common.length - 1]))).r.length, 0, 'the gcd contains the common factor')
  }
}

/* --------------------------------------------------------------- 5. polylines */
const pt = (x, y) => ({ x: R(x), y: R(y) })
const zig = [pt(0, 0), pt(2, 4), pt(5, 4), pt(7, 0), pt(9, 2)]
const rep = D.stepDerivative(zig)
eq(rep.pieces.map((q) => txt(q.slope)).join(';'), '2/1;0/1;-2/1;1/1', 'slopes of a zigzag')
eq(rep.corners.map((c) => txt(c.x)).join(';'), '2/1;5/1;7/1', 'every vertex is a corner')
eq(rep.smooth.length, 0, 'none is smooth')
const flat = [pt(0, 0), pt(1, 1), pt(3, 3), pt(4, 1)]
eq(D.stepDerivative(flat).smooth.map(txt).join(';'), '1/1', 'a vertex between collinear pieces is smooth')
eq(D.stepDerivative(flat).corners.map((c) => txt(c.x)).join(';'), '3/1', 'the only corner is at 3')
eq(D.polylineProblem([pt(0, 0)]), 'few', 'one point is not a graph')
eq(D.polylineProblem([pt(0, 0), pt(0, 1)]), 'order', 'a vertical piece is not allowed')
eq(D.polylineProblem([pt(1, 0), pt(0, 1)]), 'order', 'x must increase')
eq(D.polylineProblem(zig), null, 'the zigzag is fine')
eq(txt(D.polylineValue(zig, R(1))), '2/1', 'value at 1')
eq(txt(D.polylineValue(zig, R(6))), '2/1', 'value at 6')
eq(txt(D.polylineValue(zig, R(10))), 'null', 'outside the domain')
for (let i = 0; i < 2500; i++) {
  const n = rnd(2, 6)
  let x = rnd(-6, 0)
  const pts = []
  for (let k = 0; k < n; k++) {
    pts.push({ x: R(x, rnd(1, 2)), y: randRat(8, 2) })
    x += rnd(1, 3)
  }
  // x values with different denominators could break the order; keep only valid ones
  if (D.polylineProblem(pts)) continue
  const report = D.stepDerivative(pts)
  // inside each piece the difference quotient is the slope
  report.pieces.forEach((pc) => {
    const mid = D.ratMul(D.ratAdd(pc.from, pc.to), R(1, 2))
    const hh = D.ratMul(D.ratSub(pc.to, pc.from), R(1, 8))
    const q1 = D.ratDiv(D.ratSub(D.polylineValue(pts, D.ratAdd(mid, hh)), D.polylineValue(pts, mid)), hh)
    eq(txt(q1), txt(pc.slope), 'a difference quotient inside a piece is its slope')
  })
  // at a vertex: one-sided quotients
  for (let k = 1; k + 1 < pts.length; k++) {
    const v = pts[k]
    const hl = D.ratMul(D.ratSub(pts[k].x, pts[k - 1].x), R(-1, 3))
    const hr = D.ratMul(D.ratSub(pts[k + 1].x, pts[k].x), R(1, 3))
    const ql = D.ratDiv(D.ratSub(D.polylineValue(pts, D.ratAdd(v.x, hl)), v.y), hl)
    const qr = D.ratDiv(D.ratSub(D.polylineValue(pts, D.ratAdd(v.x, hr)), v.y), hr)
    const corner = !same(ql, qr)
    eq(report.corners.some((c) => same(c.x, v.x)), corner, 'a vertex is listed as a corner exactly when the one-sided quotients differ')
    eq(report.smooth.some((c) => same(c, v.x)), !corner, 'and as smooth otherwise')
  }
  // the round trip
  const steps = report.pieces.map((pc) => ({ to: pc.to, slope: pc.slope }))
  const again = D.fromSteps(pts[0], steps)
  eq(again.length, pts.length, 'the rebuilt graph has the same number of vertices')
  again.forEach((q, k) => eq(same(q.x, pts[k].x) && same(q.y, pts[k].y), true, 'the graph is rebuilt from its steps'))
}

/* ------------------------------------------ 6. the floating-point graphs */
for (const g of D.GRAPHS) {
  let tested = 0
  for (let i = 0; i < 400; i++) {
    const [a, b] = g.xr
    const x = a + Math.random() * (b - a)
    if (g.holes.some((h) => Math.abs(x - h) < 0.05)) continue
    if (g.domain && (x < g.domain[0] || x > g.domain[1])) continue
    if (g.id === 'wild' && Math.abs(x) < 0.08) continue
    if (g.id === 'recip' || g.id === 'sqrt' || g.id === 'cbrt') if (Math.abs(x) < 0.15) continue
    const h = 1e-6
    const central = (g.f(x + h) - g.f(x - h)) / (2 * h)
    const scale = Math.max(1, Math.abs(g.d(x)))
    eq(Math.abs(central - g.d(x)) / scale < 1e-4, true, `${g.id}: derivative formula at x = ${x}: ${g.d(x)} vs ${central}`)
    tested++
  }
  eq(tested > 100, true, `${g.id}: enough sample points`)
  eq(g.holes.every((h) => h >= g.xr[0] && h <= g.xr[1]), true, `${g.id}: holes are inside the window`)
}
// x sin(1/x)-type derivative at 0 for the wild graph really is 0: the quotient is h sin(1/h)
for (const k of [1, 2, 3, 4, 5, 6]) {
  const h = 10 ** -k
  const q = (D.GRAPHS.find((g) => g.id === 'wild').f(h) - 0) / h
  eq(Math.abs(q) <= h * 1.0000001, true, 'the difference quotient of x² sin(1/x) at 0 is at most h in size')
}

/* ------------------------------------------------------ 7. reading a typed function */
eq(fnText(D.parseFunction('x^3 - 3x')), '0/1,-3/1,0/1,1/1 / 1/1', 'a polynomial')
eq(fnText(D.parseFunction('x^2/2 + 4')), '4/1,0/1,1/2 / 1/1', 'a polynomial with a fraction coefficient')
eq(fnText(D.parseFunction('1/x')), '1/1 / 0/1,1/1', '1/x')
eq(fnText(D.parseFunction('x/(x-1)')), '0/1,1/1 / -1/1,1/1', 'x/(x-1)')
eq(fnText(D.parseFunction('(x^2+1)/(x-2)')), '1/1,0/1,1/1 / -2/1,1/1', '(x²+1)/(x-2)')
eq(fnText(D.parseFunction('2x/(x+3)')), '0/1,2/1 / 3/1,1/1', '2x/(x+3)')
for (const src of ['x/0', '1/(x-1)+3', '1+x/(x-1)', 'x/y', '1/x/x', '', 'x^9']) {
  let threw = false
  try {
    D.parseFunction(src)
  } catch {
    threw = true
  }
  eq(threw, true, `"${src}" is refused`)
}

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`derivative check ok — ${checks} checks (difference quotient as a polynomial in h, reduced derivative functions and the order of the gap, division and gcd, step functions and corners of polylines with a round trip, derivative formulas of the drawn graphs)`)
