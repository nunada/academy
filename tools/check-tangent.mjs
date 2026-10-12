/** Checks src/lib/tangent.ts, the engine behind the "Tangent Lines and the Derivative at a Point" article's widgets.
 *
 *  Independent references, so nothing is checked against itself:
 *   1. Hand-worked answers: x² at 1, x³ − 3x at 1 and at 0, 1/2·x² + 4, tangents through an outside point.
 *   2. The slope as a limit against the power rule: the Taylor shift, the difference quotient written as a
 *      polynomial in h, and the direct quotient (f(a + h) − f(a)) / h must be the same exact fraction.
 *   3. The algebraic signature of a tangent, with no limits at all: f(x) minus the line has a double root at a,
 *      and for every other slope through the point the root is only simple. The sign pattern on both sides of a
 *      follows the multiplicity (crossing when it is odd).
 *   4. Where the tangent meets the curve again, and the tangents through an outside point, against a brute-force
 *      search over a grid of fractions.
 *   5. Rational roots against polynomials built from chosen roots, and against a grid search.
 *   6. Corners, jumps and smooth joins of two polynomial pieces against exact one-sided difference quotients.
 *   7. The cube root and the two-thirds power at 0 against floating-point secant slopes.
 *   8. Reading a typed polynomial, and printing one as TeX.
 *
 *  Run: npm run check:tangent   Exit 1 on any disagreement. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tan-'))
const out = path.join(tmp, 'a.mjs')
const entry = path.join(tmp, 'entry.ts')
const p = (f) => path.join(ROOT, f).replace(/\\/g, '/')
fs.writeFileSync(entry, `export * from '${p('src/lib/tangent.ts')}'\nexport { ratAdd, ratMul, ratSub, ratDiv } from '${p('src/lib/rationals.ts')}'`)
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const T = await import('file://' + out.replace(/\\/g, '/'))

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
const R = (n, d = 1) => T.rat(B(n), B(d))
const txt = (r) => `${r.n}/${r.d}`
const ptxt = (poly) => poly.map(txt).join(',')
const same = (a, b) => a.n === b.n && a.d === b.d
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1))
const randRat = (span = 6, den = 4) => R(rnd(-span, span), rnd(1, den))
const randPoly = (maxDeg = 5) => {
  const d = rnd(1, maxDeg)
  const q = Array.from({ length: d + 1 }, () => randRat())
  if (q[d].n === 0n) q[d] = R(1)
  return T.polyAdd(q, []) // trimmed copy
}
const P = (...cs) => cs.map((c) => (Array.isArray(c) ? R(c[0], c[1]) : R(c)))
const num = (r) => Number(r.n) / Number(r.d)

/* ------------------------------------------------------------------ 1. by hand */
const sq = P(0, 0, 1) // x²
eq(txt(T.slopeAt(sq, R(1))), '2/1', 'slope of x² at 1')
eq(txt(T.slopeAt(sq, R(-3))), '-6/1', 'slope of x² at -3')
eq(txt(T.slopeAt(sq, R(1, 2))), '1/1', 'slope of x² at 1/2')
const t1 = T.tangentAt(sq, R(1))
eq(txt(t1.m) + ' ' + txt(t1.b), '2/1 -1/1', 'tangent of x² at 1 is y = 2x - 1')
eq(txt(T.diffQuotient(sq, R(1), R(1))), '3/1', 'secant slope of x² from 1 to 2')
eq(txt(T.diffQuotient(sq, R(1), R(1, 10))), '21/10', 'secant slope of x² from 1 to 1.1')
eq(txt(T.diffQuotient(sq, R(1), R(1, 100))), '201/100', 'secant slope of x² from 1 to 1.01')
eq(txt(T.diffQuotient(sq, R(1), R(-1, 100))), '199/100', 'secant slope of x² from 0.99 to 1')
const cub = P(0, -3, 0, 1) // x³ − 3x
eq(txt(T.slopeAt(cub, R(1))), '0/1', 'x³ − 3x has a horizontal tangent at 1')
const t2 = T.tangentAt(cub, R(1))
eq(txt(t2.b), '-2/1', 'tangent of x³ − 3x at 1 is y = -2')
const cr = T.tangentCrossings(cub, R(1))
eq(cr.multiplicity, 2, 'double root at 1')
eq(cr.others.map(txt).join(';'), '-2/1', 'the horizontal tangent at 1 meets the cubic again at -2')
eq(cr.crosses, false, 'the tangent at 1 stays on one side near 1')
const cr0 = T.tangentCrossings(cub, R(0))
eq(cr0.multiplicity, 3, 'x³ − 3x at its inflection point 0: tangent y = -3x, and the difference is x³')
eq(cr0.crosses, true, 'the tangent at an inflection point crosses the curve')
eq(txt(T.tangentAt(cub, R(0)).m), '-3/1', 'slope at 0')
eq(cr0.others.length, 0, 'no other rational meeting point at 0')
const cr2 = T.tangentCrossings(sq, R(5))
eq(cr2.multiplicity, 2, 'a parabola tangent touches only once')
eq(cr2.others.length, 0, 'a parabola tangent has no other meeting point')
const nrm = T.normalAt(sq, R(1))
eq(txt(nrm.m) + ' ' + txt(nrm.b), '-1/2 3/2', 'normal of x² at 1 is y = -x/2 + 3/2')
eq('vertical' in T.normalAt(sq, R(0)), true, 'the normal at the vertex of a parabola is vertical')
eq(txt(T.normalAt(sq, R(0)).vertical), '0/1', 'it is the line x = 0')
const thr = T.tangentsThrough(sq, R(1), R(-3))
eq(thr.rational.map((t) => txt(t.a)).join(';'), '-1/1;3/1', 'from (1, -3) two tangents to y = x², touching at -1 and 3')
eq(thr.rational.map((t) => txt(t.line.m) + '/' + txt(t.line.b)).join(';'), '-2/1/-1/1;6/1/-9/1', 'their lines y = -2x - 1 and y = 6x - 9')
eq(T.tangentsThrough(sq, R(0), R(1)).rational.length, 0, 'from (0, 1), above the vertex, no tangent to y = x²')
eq(T.tangentsThrough(sq, R(0), R(1)).degree, 2, 'a quadratic equation')
eq(T.tangentsThrough(sq, R(2), R(4)).rational.map((t) => txt(t.a)).join(';'), '2/1', 'from a point on the parabola the only tangent is the one there')
eq(ptxt(T.derivative(P(4, 0, [1, 2]))), '0/1,1/1', 'derivative of x²/2 + 4 is x')
eq(txt(T.slopeAt(P(4, 0, [1, 2]), R(6))), '6/1', 'slope of x²/2 + 4 at 6')

/* ------------------------------------ 2. the slope as a limit vs the power rule */
for (let i = 0; i < 4000; i++) {
  const poly = randPoly()
  const a = randRat()
  const h = randRat(5, 7)
  const m = T.slopeAt(poly, a)
  eq(txt(m), txt(T.evalPoly(T.derivative(poly), a)), 'limit slope equals the power rule')
  // the Taylor shift reproduces p(a + h)
  eq(txt(T.evalPoly(T.shift(poly, a), h)), txt(T.evalPoly(poly, T.ratAdd(a, h))), 'p(a + h) from the shift')
  if (h.n !== 0n) {
    const direct = T.diffQuotient(poly, a, h)
    eq(txt(T.evalPoly(T.quotientPoly(poly, a), h)), txt(direct), 'Q(h) is the difference quotient')
    // the quotient approaches the slope as h shrinks: |Q(h) - m| <= |h| * (sum of |coefficients of Q| above the first)
    const Q = T.quotientPoly(poly, a)
    let bound = 0
    for (let k = 1; k < Q.length; k++) bound += Math.abs(num(Q[k]))
    for (const e of [1, 2, 3, 4, 5]) {
      const hh = R(1, 10 ** e)
      const gap = Math.abs(num(T.diffQuotient(poly, a, hh)) - num(m))
      eq(gap <= Number(hh.n) / Number(hh.d) * bound + 1e-9, true, `the difference quotient is within |h|*C of the slope (h = 10^-${e})`)
    }
  }
}

/* --------------------- 3. the tangent is the line whose gap has a double root */
for (let i = 0; i < 4000; i++) {
  const poly = randPoly()
  const a = randRat()
  const t = T.tangentAt(poly, a)
  const line = T.lineAsPoly(t)
  const gap = T.polySub(poly, line)
  eq(txt(T.evalPoly(line, a)), txt(t.fa), 'the tangent passes through the point')
  eq(txt(T.evalPoly(poly, a)), txt(t.fa), 'fa is f(a)')
  const first = T.divLinear(gap, a)
  eq(first.rem.n, 0n, 'gap vanishes at a')
  const second = T.divLinear(first.q, a)
  eq(second.rem.n, 0n, 'gap vanishes to second order at a')
  eq(T.multiplicityAt(gap, a) >= 2, true, 'multiplicity at least 2')
  // any other slope through the point gives a simple root only
  for (let k = 0; k < 4; k++) {
    const s = randRat(8, 5)
    if (same(s, t.m)) continue
    const other = T.polySub(poly, T.lineAsPoly({ m: s, b: T.ratSub(t.fa, T.ratMul(s, a)) }))
    eq(T.multiplicityAt(other, a), 1, 'a wrong slope gives a simple root')
  }
  // crossing or not, from the signs a little to each side
  const c = T.tangentCrossings(poly, a)
  const eps = R(1, 10 ** 9)
  const left = T.evalPoly(gap, T.ratSub(a, eps))
  const right = T.evalPoly(gap, T.ratAdd(a, eps))
  if (gap.length) {
    const opposite = left.n * right.n < 0n
    eq(opposite, c.crosses, `sign change at a matches the parity of the multiplicity (${c.multiplicity})`)
  }
  // the normal
  const nm = T.normalAt(poly, a)
  if ('vertical' in nm) eq(t.m.n, 0n, 'vertical normal only for a horizontal tangent')
  else {
    eq(txt(T.ratMul(nm.m, t.m)), '-1/1', 'slopes of tangent and normal multiply to -1')
    eq(txt(T.evalPoly(T.lineAsPoly(nm), a)), txt(t.fa), 'the normal passes through the point')
  }
  // the other meeting points, against a grid of fractions
  if (c.others && gap.length) {
    for (const r of c.others) eq(txt(T.evalPoly(poly, r)), txt(T.evalPoly(line, r)), 'the tangent meets the curve at each listed point')
    const found = new Set(c.others.map(txt))
    for (let n = -30; n <= 30; n++)
      for (let d = 1; d <= 4; d++) {
        const r = R(n, d)
        if (same(r, a)) continue
        if (same(T.evalPoly(poly, r), T.evalPoly(line, r))) eq(found.has(txt(r)), true, `grid point ${txt(r)} on the tangent is listed`)
      }
  }
}

/* ------------------------------------------- 4. tangents through an outside point */
for (let i = 0; i < 1500; i++) {
  const poly = randPoly(3)
  const x0 = randRat(5, 3)
  const y0 = randRat(8, 3)
  const res = T.tangentsThrough(poly, x0, y0)
  if (!res.rational || !res.equation.length) continue // a line is its own tangent everywhere
  for (const tp of res.rational) {
    eq(txt(T.evalPoly(T.lineAsPoly(tp.line), x0)), txt(y0), 'the tangent passes through the outside point')
    eq(txt(tp.line.m), txt(T.slopeAt(poly, tp.a)), 'its slope is the slope at the point of tangency')
  }
  const found = new Set(res.rational.map((t) => txt(t.a)))
  for (let n = -24; n <= 24; n++)
    for (let d = 1; d <= 3; d++) {
      const a = R(n, d)
      const line = T.tangentAt(poly, a)
      if (same(T.evalPoly(T.lineAsPoly(line), x0), y0)) eq(found.has(txt(a)), true, `tangent at grid point ${txt(a)} through the point is listed`)
    }
}

/* ---------------------------------------------------------- 5. rational roots */
for (let i = 0; i < 3000; i++) {
  const k = rnd(1, 4)
  const chosen = Array.from({ length: k }, () => randRat(7, 4))
  let poly = [R(rnd(1, 5), rnd(1, 3))]
  for (const r of chosen) poly = T.polyMul(poly, [T.ratSub(R(0), r), R(1)])
  const roots = T.rationalRoots(poly)
  const set = new Set(roots.map(txt))
  for (const r of chosen) eq(set.has(txt(r)), true, `chosen root ${txt(r)} is found`)
  eq(roots.length, new Set(chosen.map(txt)).size, 'exactly the distinct chosen roots')
  for (const r of roots) eq(T.evalPoly(poly, r).n, 0n, 'every reported root is a root')
}
eq(ptxt(T.rationalRoots(P(1, 0, 1)) ?? []), '', 'x² + 1 has no rational root')
eq(T.rationalRoots(P(-2, 0, 1)).length, 0, 'x² - 2 has no rational root')
eq(T.rationalRoots(P(0, 0, 1)).map(txt).join(';'), '0/1', 'x² has the root 0')
eq(T.rationalRoots([]).length, 0, 'the zero polynomial')

/* ------------------------------------------- 6. pieces: corners, jumps, smooth */
const piece = (c, left, right) => ({ c: R(c), left, right })
const abs = piece(0, P(0, -1), P(0, 1))
const rep = T.classifyAt(abs)
eq(rep.verdict, 'corner', '|x| has a corner at 0')
eq(txt(rep.leftSlope) + ' ' + txt(rep.rightSlope), '-1/1 1/1', '|x| one-sided slopes')
eq(rep.continuous, true, '|x| is continuous')
const step = piece(0, P(0), P(1))
eq(T.classifyAt(step).verdict, 'jump', 'a step is a jump')
eq(T.classifyAt(step).leftSlope, null, 'a jump has no one-sided slopes')
const smooth = piece(1, P(0, 0, 1), P(-1, 2)) // x² then 2x − 1
eq(T.classifyAt(smooth).verdict, 'differentiable', 'x² joined to its tangent at 1 is smooth')
const kink = piece(1, P(0, 0, 1), P(0, 1)) // x² then x
eq(T.classifyAt(kink).verdict, 'corner', 'x² then x has a corner at 1')
eq(txt(T.classifyAt(kink).leftSlope) + ' ' + txt(T.classifyAt(kink).rightSlope), '2/1 1/1', 'x² then x one-sided slopes')
for (let i = 0; i < 2500; i++) {
  const c = randRat(4, 3)
  const left = randPoly(3)
  let right = randPoly(3)
  const mode = rnd(0, 2)
  if (mode >= 1) {
    // make it continuous by shifting the right piece
    right = T.polyAdd(right, [T.ratSub(T.evalPoly(left, c), T.evalPoly(right, c))])
  }
  if (mode === 2) {
    // make it smooth: add a multiple of (x - c)^... so the slopes agree too (right += s·(x - c) with s the slope gap)
    const gapSlope = T.ratSub(T.evalPoly(T.derivative(left), c), T.evalPoly(T.derivative(right), c))
    right = T.polyAdd(right, T.polyMul([gapSlope], [T.ratSub(R(0), c), R(1)]))
  }
  const pw = { c, left, right }
  const rep = T.classifyAt(pw)
  // exact quotients at h = ±1/10^k
  const eps = [1, 2, 3, 4, 5, 6].map((e) => R(1, 10 ** e))
  const hsR = eps
  const hsL = eps.map((h) => T.ratSub(R(0), h))
  const qR = T.pieceQuotients(pw, hsR)
  const qL = T.pieceQuotients(pw, hsL)
  const gap = T.ratSub(T.evalPoly(left, c), T.evalPoly(right, c))
  if (gap.n !== 0n) {
    eq(rep.verdict, 'jump', 'discontinuous pieces are a jump')
    // h * quotient is f(c + h) - f(c), which tends to the jump, so the left quotient is huge
    eq(Math.abs(num(qL[5])) > 1e5 * Math.abs(num(gap)) * 0.4, true, 'the left quotient blows up across a jump')
  } else {
    // continuous: the left quotients come from the left piece's quotient polynomial, and tend to its slope
    const Ql = T.quotientPoly(left, c)
    const Qr = T.quotientPoly(right, c)
    hsL.forEach((h, k) => eq(txt(qL[k]), txt(T.evalPoly(Ql, h)), 'left quotient from the left piece'))
    hsR.forEach((h, k) => eq(txt(qR[k]), txt(T.evalPoly(Qr, h)), 'right quotient from the right piece'))
    eq(txt(rep.leftSlope), txt(Ql[0] ?? R(0)), 'left slope is Q(0)')
    eq(txt(rep.rightSlope), txt(Qr[0] ?? R(0)), 'right slope is Q(0)')
    const diffs = Math.abs(num(qL[5]) - num(rep.leftSlope))
    const diffr = Math.abs(num(qR[5]) - num(rep.rightSlope))
    eq(diffs < 1e-2 && diffr < 1e-2, true, 'one-sided quotients settle on the one-sided slopes')
    eq(rep.verdict, same(rep.leftSlope, rep.rightSlope) ? 'differentiable' : 'corner', 'verdict follows the one-sided slopes')
    if (mode === 2) eq(rep.verdict, 'differentiable', 'a constructed smooth join is differentiable')
  }
}

/* --------------------------- 7. cube root and the 2/3 power at 0, in floating point */
for (let k = 1; k <= 200; k++) {
  const h = 1 / k ** 3
  for (const side of [1, -1]) {
    const sh = side * h
    const cbrtQuotient = Math.cbrt(sh) / sh
    eq(Math.abs(cbrtQuotient / num(T.cubeRootQuotient(B(k))) - 1) < 1e-9, true, `cube root secant slope, k = ${k}`)
    const cuspQuot = Math.cbrt(sh) ** 2 / sh
    eq(Math.abs(cuspQuot / num(T.cuspQuotient(B(k), side)) - 1) < 1e-9, true, `x^(2/3) secant slope, k = ${k}, side ${side}`)
  }
  eq(T.cubeRootQuotient(B(k + 1)).n > T.cubeRootQuotient(B(k)).n, true, 'the cube-root quotients grow without bound')
  eq(T.cuspQuotient(B(k), 1).n > 0n && T.cuspQuotient(B(k), -1).n < 0n, true, 'the cusp quotients have opposite signs')
}

/* --------------------------------------------- 8. reading and printing a polynomial */
eq(ptxt(T.parsePolynomialInX('x^3 - 3x')), '0/1,-3/1,0/1,1/1', 'parse x^3 - 3x')
eq(ptxt(T.parsePolynomialInX('(x-1)(x+2)')), '-2/1,1/1,1/1', 'parse (x-1)(x+2)')
eq(ptxt(T.parsePolynomialInX('x^2/2 + 4')), '4/1,0/1,1/2', 'parse x^2/2 + 4')
eq(ptxt(T.parsePolynomialInX('7')), '7/1', 'parse a constant')
eq(ptxt(T.parsePolynomialInX('0')), '', 'parse zero')
for (const src of ['x^9', 'x + y', '2x^', '']) {
  let threw = false
  try {
    T.parsePolynomialInX(src)
  } catch {
    threw = true
  }
  eq(threw, true, `"${src}" is refused`)
}
eq(T.polyTex(T.parsePolynomialInX('x^3 - 3x')), 'x^{3}-3x', 'TeX of x³ - 3x')
eq(T.polyTex(P(-1, 2)), '2x-1', 'TeX of 2x - 1')
eq(T.polyTex(P(0, 0, [-1, 2], 1)), 'x^{3}-\\frac{1}{2}x^{2}', 'TeX with a fraction')
eq(T.polyTex([]), '0', 'TeX of zero')
eq(T.polyTex(P(5)), '5', 'TeX of a constant')

if (bad) {
  console.log(`\n${bad} disagreement(s)`)
  process.exit(1)
}
console.log(`tangent check ok — ${checks} checks (slope as a limit vs the power rule, the double-root signature of a tangent, meeting points and outside tangents against a grid, rational roots, corners and jumps, cube-root and cusp quotients)`)
