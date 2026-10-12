/** Exact arithmetic for the "Tangent Lines and the Derivative at a Point" article's widgets.
 *
 *  A polynomial has rational coefficients (BigInt fractions), so every difference quotient, every
 *  slope and every tangent line comes out as an exact fraction, with no rounding to blur a limit.
 *  The slope of the tangent at a is found two independent ways, as a limit of difference quotients
 *  (Taylor shift: f(a + h) − f(a) = h·Q(h), and the slope is Q(0)) and by the power rule, and the
 *  check script makes them agree. A tangent line also has an algebraic signature that does not use
 *  limits at all: f(x) minus the line has a *double* root at a. That is what lets the page say
 *  "the tangent at a is the only line through the point whose gap to the curve vanishes to second
 *  order" and the checker test it. Functions that are not polynomials (a corner, a cusp, a vertical
 *  tangent) are handled by pieces and by exact secant slopes at h = ±1/k³. */

import { factorize, rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'
import { parsePoly, variables, monoParts, AlgebraError } from './algebra'

export { rat, type Rat }

/** Coefficients, lowest power first: `c[k]` multiplies x^k. No trailing zeros; `[]` is zero. */
export type Poly = Rat[]

const ZERO = rat(0n, 1n)
const ONE = rat(1n, 1n)
const isZero = (r: Rat): boolean => r.n === 0n
const neg = (r: Rat): Rat => rat(-r.n, r.d)
const MAX_DEGREE = 8

/* ------------------------------------------------------------------ polynomials */

const trim = (p: Poly): Poly => {
  const q = p.slice()
  while (q.length && isZero(q[q.length - 1])) q.pop()
  return q
}

export const degree = (p: Poly): number => trim(p).length - 1

export function polyAdd(a: Poly, b: Poly): Poly {
  const out: Poly = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) out.push(ratAdd(a[i] ?? ZERO, b[i] ?? ZERO))
  return trim(out)
}

export const polyScale = (a: Poly, k: Rat): Poly => trim(a.map((c) => ratMul(c, k)))
export const polySub = (a: Poly, b: Poly): Poly => polyAdd(a, polyScale(b, rat(-1n, 1n)))

export function polyMul(a: Poly, b: Poly): Poly {
  if (!a.length || !b.length) return []
  const out: Poly = Array.from({ length: a.length + b.length - 1 }, () => ZERO)
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] = ratAdd(out[i + j], ratMul(x, y)))))
  return trim(out)
}

/** Horner's rule. */
export function evalPoly(p: Poly, x: Rat): Rat {
  let acc = ZERO
  for (let i = p.length - 1; i >= 0; i--) acc = ratAdd(ratMul(acc, x), p[i])
  return acc
}

/** The power rule, c·x^k ↦ k·c·x^(k−1). */
export const derivative = (p: Poly): Poly => trim(p.slice(1).map((c, i) => ratMul(c, rat(BigInt(i + 1), 1n))))

/** Read a polynomial in x typed by a person, such as `x^3 - 3x`, `(x-1)(x+2)` or `1/2 x^2 + 4`.
 *  Throws AlgebraError for a syntax problem, a letter other than x, or a degree above 8. */
export function parsePolynomialInX(src: string): Poly {
  const alg = parsePoly(src)
  const letters = variables(alg)
  if (letters.some((l) => l !== 'x')) throw new AlgebraError('multi', letters.join(''))
  const out: Poly = []
  for (const [mono, coef] of alg) {
    const k = mono === '' ? 0 : monoParts(mono)[0][1]
    if (k > MAX_DEGREE) throw new AlgebraError('big')
    while (out.length <= k) out.push(ZERO)
    out[k] = coef
  }
  return trim(out)
}

/** A polynomial as TeX, highest power first (`x^{3}-3x`); `0` for the zero polynomial. */
export function polyTex(p: Poly, v = 'x'): string {
  const q = trim(p)
  if (!q.length) return '0'
  let s = ''
  for (let k = q.length - 1; k >= 0; k--) {
    const c = q[k]
    if (isZero(c)) continue
    const mag = rat(c.n < 0n ? -c.n : c.n, c.d)
    const one = mag.n === 1n && mag.d === 1n
    const body = mag.d === 1n ? `${mag.n}` : `\\frac{${mag.n}}{${mag.d}}`
    const pow = k === 0 ? '' : k === 1 ? v : `${v}^{${k}}`
    const term = k === 0 ? body : one ? pow : `${body}${pow}`
    s += s === '' ? (c.n < 0n ? '-' : '') + term : (c.n < 0n ? '-' : '+') + term
  }
  return s
}

/* ------------------------------------------------------- the slope as a limit */

/** The Taylor shift: the coefficients of g(h) = p(a + h), by repeated synthetic division by (x − a). */
export function shift(p: Poly, a: Rat): Poly {
  const out: Poly = []
  let cur = trim(p)
  while (cur.length) {
    const { q, rem } = divLinear(cur, a)
    out.push(rem)
    cur = q
  }
  return trim(out)
}

/** The difference quotient (f(a + h) − f(a)) / h, straight from the definition. */
export function diffQuotient(p: Poly, a: Rat, h: Rat): Rat {
  if (isZero(h)) throw new Error('h must not be 0')
  return ratDiv(ratSub(evalPoly(p, ratAdd(a, h)), evalPoly(p, a)), h)
}

/** Q(h) with f(a + h) − f(a) = h·Q(h): the difference quotient as a polynomial in h. */
export function quotientPoly(p: Poly, a: Rat): Poly {
  return trim(shift(p, a).slice(1))
}

/** The slope of the tangent at a: Q(0), the value the difference quotients settle on. */
export function slopeAt(p: Poly, a: Rat): Rat {
  return quotientPoly(p, a)[0] ?? ZERO
}

/** Slopes of the secants through (a, f(a)) and (a + h, f(a + h)) for each h. */
export const secantSlopes = (p: Poly, a: Rat, hs: Rat[]): Rat[] => hs.map((h) => diffQuotient(p, a, h))

/* ------------------------------------------------------ tangent and normal lines */

export interface Line {
  /** y = m·x + b. */
  m: Rat
  b: Rat
}

export interface Tangent extends Line {
  a: Rat
  fa: Rat
}

export function tangentAt(p: Poly, a: Rat): Tangent {
  const fa = evalPoly(p, a)
  const m = slopeAt(p, a)
  return { a, fa, m, b: ratSub(fa, ratMul(m, a)) }
}

/** The normal: the line through (a, f(a)) at right angles to the tangent. Vertical when the tangent is horizontal. */
export function normalAt(p: Poly, a: Rat): Line | { vertical: Rat } {
  const t = tangentAt(p, a)
  if (isZero(t.m)) return { vertical: a }
  const m = ratDiv(rat(-1n, 1n), t.m)
  return { m, b: ratSub(t.fa, ratMul(m, a)) }
}

export const lineAsPoly = (l: Line): Poly => trim([l.b, l.m])

/** Divide by (x − r): quotient and remainder (the remainder is p(r)). */
export function divLinear(p: Poly, r: Rat): { q: Poly; rem: Rat } {
  const n = p.length
  if (n === 0) return { q: [], rem: ZERO }
  const q: Poly = new Array(n - 1).fill(ZERO)
  let carry = ZERO
  for (let i = n - 1; i >= 0; i--) {
    const v = ratAdd(p[i], ratMul(carry, r))
    if (i === 0) return { q: trim(q), rem: v }
    q[i - 1] = v
    carry = v
  }
  return { q: trim(q), rem: ZERO }
}

/** How many times (x − r) divides p; 0 when r is not a root. */
export function multiplicityAt(p: Poly, r: Rat): number {
  let cur = trim(p)
  if (!cur.length) return Infinity
  let m = 0
  for (;;) {
    const { q, rem } = divLinear(cur, r)
    if (!isZero(rem)) return m
    cur = q
    m++
  }
}

/* ---------------------------------------------------------------- rational roots */

const toIntegers = (p: Poly): bigint[] => {
  const q = trim(p)
  let lcm = 1n
  for (const c of q) lcm = (lcm / gcdBig(lcm, c.d)) * c.d
  return q.map((c) => (c.n * lcm) / c.d)
}
const gcdBig = (a: bigint, b: bigint): bigint => {
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b
  while (b) [a, b] = [b, a % b]
  return a
}
const divisors = (n: bigint): bigint[] => {
  let ds: bigint[] = [1n]
  for (const [p, e] of factorize(n < 0n ? -n : n)) {
    const next: bigint[] = []
    let pk = 1n
    for (let k = 0; k <= e; k++) {
      for (const d of ds) next.push(d * pk)
      pk *= p
    }
    ds = next
  }
  return ds
}

const SEARCH_LIMIT = 10n ** 12n

/** Every rational root of p, distinct and in increasing order, by the rational root theorem; null when the
 *  numbers are too large to factor quickly. */
export function rationalRoots(p: Poly): Rat[] | null {
  let ints = toIntegers(p)
  if (!ints.length) return []
  const roots: Rat[] = []
  while (ints.length > 1 && ints[0] === 0n) {
    ints = ints.slice(1)
    if (!roots.some((r) => isZero(r))) roots.push(ZERO)
  }
  if (ints.length <= 1) return roots
  const a0 = ints[0] < 0n ? -ints[0] : ints[0]
  const an = ints[ints.length - 1] < 0n ? -ints[ints.length - 1] : ints[ints.length - 1]
  if (a0 > SEARCH_LIMIT || an > SEARCH_LIMIT) return null
  const rp: Poly = ints.map((n) => rat(n, 1n))
  const seen = new Set<string>()
  for (const pn of divisors(a0))
    for (const qd of divisors(an))
      for (const sign of [1n, -1n]) {
        const r = rat(sign * pn, qd)
        const key = `${r.n}/${r.d}`
        if (seen.has(key)) continue
        seen.add(key)
        if (isZero(evalPoly(rp, r))) roots.push(r)
      }
  return roots.sort((x, y) => (x.n * y.d < y.n * x.d ? -1 : x.n * y.d > y.n * x.d ? 1 : 0))
}

/* ------------------------------------------------ the tangent against the curve */

export interface Crossings {
  /** How many times x = a is a root of f(x) − tangent(x): always at least 2, and exactly 2 unless a is an inflection point. */
  multiplicity: number
  /** What is left of f(x) − tangent(x) after taking out (x − a) that many times. */
  rest: Poly
  /** The other places the tangent meets the curve, when they are rational (null if too big to search). */
  others: Rat[] | null
  /** The tangent crosses the curve at a when the multiplicity is odd, and stays on one side when it is even. */
  crosses: boolean
}

export function tangentCrossings(p: Poly, a: Rat): Crossings {
  const t = tangentAt(p, a)
  let g = polySub(p, lineAsPoly(t))
  const multiplicity = multiplicityAt(g, a)
  for (let i = 0; i < multiplicity && isFinite(multiplicity); i++) g = divLinear(g, a).q
  const roots = rationalRoots(g)
  const others = roots === null ? null : roots.filter((r) => r.n * a.d !== a.n * r.d)
  return { multiplicity, rest: g, others, crosses: multiplicity % 2 === 1 }
}

export interface ThroughPoint {
  /** The point of tangency. */
  a: Rat
  line: Tangent
}

/** The tangents to y = f(x) that pass through a given point (x0, y0): the values of a with
 *  f(a) + f'(a)·(x0 − a) = y0. `rational` lists those that are rational; `degree` is the degree of the
 *  equation in a, so a quadratic that gives fewer than 2 rational answers has irrational (or no real) ones. */
export function tangentsThrough(p: Poly, x0: Rat, y0: Rat): { rational: ThroughPoint[] | null; degree: number; equation: Poly } {
  const fa = trim(p)
  const dfa = derivative(fa)
  const equation = polySub(polyAdd(fa, polyMul(dfa, trim([x0, rat(-1n, 1n)]))), trim([y0]))
  const roots = rationalRoots(equation)
  return {
    rational: roots === null ? null : roots.map((a) => ({ a, line: tangentAt(fa, a) })),
    degree: degree(equation),
    equation,
  }
}

/* ------------------------------------------------------------- pieces: corners */

/** A function made of two polynomial pieces: `left` for x < c and `right` for x ≥ c. */
export interface Piecewise {
  c: Rat
  left: Poly
  right: Poly
}

export type Verdict = 'differentiable' | 'corner' | 'jump'

export interface PieceReport {
  /** f(c) is the value of the right piece. */
  value: Rat
  leftLimit: Rat
  continuous: boolean
  /** The one-sided slopes exist only when the function is continuous at c. */
  leftSlope: Rat | null
  rightSlope: Rat | null
  verdict: Verdict
}

export function classifyAt(pw: Piecewise): PieceReport {
  const value = evalPoly(pw.right, pw.c)
  const leftLimit = evalPoly(pw.left, pw.c)
  const continuous = value.n * leftLimit.d === leftLimit.n * value.d
  if (!continuous) return { value, leftLimit, continuous, leftSlope: null, rightSlope: null, verdict: 'jump' }
  const leftSlope = evalPoly(derivative(pw.left), pw.c)
  const rightSlope = evalPoly(derivative(pw.right), pw.c)
  const same = leftSlope.n * rightSlope.d === rightSlope.n * leftSlope.d
  return { value, leftLimit, continuous, leftSlope, rightSlope, verdict: same ? 'differentiable' : 'corner' }
}

export function pieceValue(pw: Piecewise, x: Rat): Rat {
  return x.n * pw.c.d < pw.c.n * x.d ? evalPoly(pw.left, x) : evalPoly(pw.right, x)
}

/** The difference quotients of a piecewise function at c, from the definition, for each h (negative h reads the left piece). */
export const pieceQuotients = (pw: Piecewise, hs: Rat[]): Rat[] =>
  hs.map((h) => ratDiv(ratSub(pieceValue(pw, ratAdd(pw.c, h)), pieceValue(pw, pw.c)), h))

/* -------------------------------------------- roots at 0: vertical tangent and cusp */

/** Difference quotients of f(x) = x^(1/3) at 0 for h = ±1/k³, exactly: (±1/k)/(±1/k³) = k². Both sides climb without bound,
 *  which is a vertical tangent. */
export function cubeRootQuotient(k: bigint): Rat {
  return rat(k * k, 1n) // numerator and denominator have the same sign, on either side
}

/** Difference quotients of f(x) = x^(2/3) at 0 for h = ±1/k³: (1/k²)/(±1/k³) = ±k. The two sides run off in opposite
 *  directions, which is a cusp. */
export function cuspQuotient(k: bigint, side: 1 | -1): Rat {
  return rat(side === 1 ? k : -k, 1n)
}

export { ONE as ratOne, ZERO as ratZero, neg as ratNeg }
