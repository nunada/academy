/** Exact arithmetic for the "The Derivative as a Rate of Change" article's widgets.
 *
 *  Motion along a line: a polynomial position s(t) with rational coefficients gives velocity v = s', acceleration
 *  a = v' and jerk j = a'. When does the body turn round, when does it speed up, how far does it really travel? The
 *  answers hang on the real roots of v and a, which are often irrational, so the roots are isolated with a Sturm
 *  sequence in exact fractions and then narrowed by bisection (the isolating interval is exact; the decimal shown is
 *  its midpoint). Every classification of an interval is made at a rational point inside it, in exact arithmetic.
 *
 *  Marginal analysis: the marginal cost c'(x) against the true cost of one more unit c(x + 1) − c(x), and where marginal
 *  revenue equals marginal cost.
 *
 *  Geometry: the formulas A = πr², V = 4/3·πr³ and their derivatives, which are the circumference and the surface
 *  area, in floating point (the checker compares them with central differences). */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'
import { degree, derivative, evalPoly, polySub, rationalRoots, type Poly } from './tangent'
import { polyDivmod, polyGcd } from './derivative'

export { rat, type Rat, type Poly }

const ZERO = rat(0n, 1n)
const ONE = rat(1n, 1n)
const isZero = (r: Rat): boolean => r.n === 0n
const cmp = (a: Rat, b: Rat): number => (a.n * b.d < b.n * a.d ? -1 : a.n * b.d > b.n * a.d ? 1 : 0)
const sign = (r: Rat): -1 | 0 | 1 => (r.n < 0n ? -1 : r.n > 0n ? 1 : 0)
const half = (r: Rat): Rat => rat(r.n, r.d * 2n)
const mid = (a: Rat, b: Rat): Rat => half(ratAdd(a, b))
const neg = (p: Poly): Poly => polySub([], p)
export const toNumber = (r: Rat): number => Number(r.n) / Number(r.d)

/* ------------------------------------------------------------------ real roots */

/** p divided by gcd(p, p'): the same roots, each simple. */
export function squareFree(p: Poly): Poly {
  if (degree(p) < 1) return p
  const g = polyGcd(p, derivative(p))
  return degree(g) < 1 ? p : polyDivmod(p, g).q
}

/** The Sturm chain p, p', −rem(p, p'), … of a polynomial. */
export function sturmChain(p: Poly): Poly[] {
  const chain: Poly[] = [p, derivative(p)]
  for (;;) {
    const a = chain[chain.length - 2]
    const b = chain[chain.length - 1]
    if (b.length === 0) break
    const r = polyDivmod(a, b).r
    if (r.length === 0) break
    chain.push(neg(r))
  }
  return chain[1].length === 0 ? [p] : chain
}

/** Sign changes along the chain at x, ignoring zeros. */
export function signChanges(chain: Poly[], x: Rat): number {
  let prev = 0
  let n = 0
  for (const q of chain) {
    const s = sign(evalPoly(q, x))
    if (s === 0) continue
    if (prev !== 0 && s !== prev) n++
    prev = s
  }
  return n
}

export interface RootAt {
  /** The root lies in [lo, hi]; when `exact` is set it is that rational number. */
  lo: Rat
  hi: Rat
  exact: Rat | null
}

const TOL = rat(1n, 10n ** 12n)

/** Every real root of p in [lo, hi], distinct, in increasing order. Rational roots are exact; the others are
 *  isolated to an interval of width under 10⁻¹². */
export function realRoots(p: Poly, lo: Rat, hi: Rat): RootAt[] {
  if (degree(p) < 1) return []
  const out: RootAt[] = []
  let q = squareFree(p)
  const rational = rationalRoots(q)
  if (rational) {
    for (const r of rational) {
      if (cmp(r, lo) >= 0 && cmp(r, hi) <= 0) out.push({ lo: r, hi: r, exact: r })
      q = polyDivmod(q, [rat(-r.n, r.d), ONE]).q
    }
  }
  if (degree(q) >= 1) {
    const chain = sturmChain(q)
    const go = (a: Rat, b: Rat, depth: number): void => {
      const count = signChanges(chain, a) - signChanges(chain, b)
      if (count <= 0) return
      if (count === 1 && cmp(ratSub(b, a), TOL) < 0) {
        out.push({ lo: a, hi: b, exact: null })
        return
      }
      if (depth > 80) {
        out.push({ lo: a, hi: b, exact: null })
        return
      }
      const m = mid(a, b)
      if (isZero(evalPoly(q, m))) {
        out.push({ lo: m, hi: m, exact: m })
        go(a, ratSub(m, rat(1n, 10n ** 30n)), depth + 1)
        go(ratAdd(m, rat(1n, 10n ** 30n)), b, depth + 1)
        return
      }
      go(a, m, depth + 1)
      go(m, b, depth + 1)
    }
    // the endpoints may be roots of q only if they are rational, which were removed above
    go(lo, hi, 0)
  }
  return out.sort((x, y) => cmp(mid(x.lo, x.hi), mid(y.lo, y.hi)))
}

/** A point of an isolating interval, as a fraction. */
export const rootPoint = (r: RootAt): Rat => r.exact ?? mid(r.lo, r.hi)

/* ----------------------------------------------------------- motion along a line */

export interface Motion {
  s: Poly
  v: Poly
  a: Poly
  j: Poly
}

export function motionOf(s: Poly): Motion {
  const v = derivative(s)
  const a = derivative(v)
  return { s, v, a, j: derivative(a) }
}

export type Direction = 'forward' | 'backward' | 'still'
export type Pace = 'up' | 'down' | 'steady'

export interface Segment {
  from: Rat
  to: Rat
  vSign: -1 | 0 | 1
  aSign: -1 | 0 | 1
  direction: Direction
  /** Speeding up when v and a have the same sign, slowing down when they have opposite signs. */
  pace: Pace
}

export interface MotionReport {
  /** Instants of the interval where v = 0 or a = 0, as isolating intervals. */
  breaks: { at: Rat; kind: 'v' | 'a' | 'both' }[]
  segments: Segment[]
  /** The body reverses direction at these instants (v changes sign). */
  turns: Rat[]
  displacement: Rat
  averageVelocity: Rat
  /** Total distance travelled, the sum of |Δs| between the turns, as a decimal. */
  distance: number
}

export function analyzeMotion(m: Motion, t0: Rat, t1: Rat): MotionReport {
  const vRoots = realRoots(m.v, t0, t1)
  const aRoots = realRoots(m.a, t0, t1)
  const pts: { at: Rat; kind: 'v' | 'a' | 'both' }[] = []
  for (const r of vRoots) pts.push({ at: rootPoint(r), kind: 'v' })
  for (const r of aRoots) {
    const at = rootPoint(r)
    const same = pts.find((p) => p.kind === 'v' && cmp(ratSub(p.at, at), rat(1n, 10n ** 9n)) < 0 && cmp(ratSub(at, p.at), rat(1n, 10n ** 9n)) < 0)
    if (same) same.kind = 'both'
    else pts.push({ at, kind: 'a' })
  }
  const inside = pts.filter((p) => cmp(p.at, t0) > 0 && cmp(p.at, t1) < 0).sort((x, y) => cmp(x.at, y.at))
  const cuts = [t0, ...inside.map((p) => p.at), t1]
  const segments: Segment[] = []
  for (let i = 0; i + 1 < cuts.length; i++) {
    if (cmp(cuts[i], cuts[i + 1]) >= 0) continue
    const m1 = mid(cuts[i], cuts[i + 1])
    const vs = sign(evalPoly(m.v, m1))
    const as = sign(evalPoly(m.a, m1))
    segments.push({
      from: cuts[i],
      to: cuts[i + 1],
      vSign: vs,
      aSign: as,
      direction: vs > 0 ? 'forward' : vs < 0 ? 'backward' : 'still',
      pace: vs === 0 || as === 0 ? 'steady' : vs === as ? 'up' : 'down',
    })
  }
  const turns: Rat[] = []
  for (let i = 0; i + 1 < segments.length; i++) {
    const a = segments[i].vSign
    const b = segments[i + 1].vSign
    if (a !== 0 && b !== 0 && a !== b) turns.push(segments[i].to)
  }
  // total distance: add |Δs| between t0, the turns and t1
  const stops = [t0, ...turns, t1]
  let distance = 0
  for (let i = 0; i + 1 < stops.length; i++) distance += Math.abs(toNumber(ratSub(evalPoly(m.s, stops[i + 1]), evalPoly(m.s, stops[i]))))
  const displacement = ratSub(evalPoly(m.s, t1), evalPoly(m.s, t0))
  return {
    breaks: inside,
    segments,
    turns,
    displacement,
    averageVelocity: ratDiv(displacement, ratSub(t1, t0)),
    distance,
  }
}

/* ----------------------------------------------------------- free fall and throws */

/** A body thrown straight up at speed v0 under gravity g: s = v0·t − ½gt². Everything is exact. */
export function throwUp(v0: Rat, g: Rat): { top: Rat; height: Rat; landing: Rat; s: Poly } {
  const top = ratDiv(v0, g)
  const height = ratDiv(ratMul(v0, v0), ratMul(rat(2n, 1n), g))
  const landing = ratDiv(ratMul(rat(2n, 1n), v0), g)
  return { top, height, landing, s: [ZERO, v0, rat(-g.n, g.d * 2n)] }
}

/* ------------------------------------------------------------ marginal analysis */

export interface Marginal {
  /** c'(x), the marginal cost. */
  marginal: Rat
  /** c(x + 1) − c(x), the true cost of one more unit. */
  next: Rat
  /** c(x) / x, the average cost, when x is not 0. */
  average: Rat | null
}

export function marginalAt(c: Poly, x: Rat): Marginal {
  return {
    marginal: evalPoly(derivative(c), x),
    next: ratSub(evalPoly(c, ratAdd(x, ONE)), evalPoly(c, x)),
    average: isZero(x) ? null : ratDiv(evalPoly(c, x), x),
  }
}

/** Where marginal revenue equals marginal cost: the rational roots of r' − c' (null if too large to search). */
export function breakEvenMarginal(c: Poly, r: Poly): Rat[] | null {
  return rationalRoots(polySub(derivative(r), derivative(c)))
}

export const profitOf = (c: Poly, r: Poly): Poly => polySub(r, c)

/* ---------------------------------------------------------------------- geometry */

export interface GeoDef {
  id: string
  name: { en: string; id: string }
  /** The variable and its meaning. */
  x: { en: string; id: string }
  f: (x: number) => number
  df: (x: number) => number
  /** What the derivative turns out to be. */
  derivativeNote: { en: string; id: string }
  tex: string
  dtex: string
  x0: number
}

export const GEO: GeoDef[] = [
  {
    id: 'circle-r',
    name: { en: 'area of a circle with respect to its radius', id: 'luas lingkaran terhadap jari-jarinya' },
    x: { en: 'radius r', id: 'jari-jari r' },
    f: (r) => Math.PI * r * r,
    df: (r) => 2 * Math.PI * r,
    derivativeNote: { en: 'The rate is the circumference: a circle grows by a thin ring as long as its edge.', id: 'Lajunya adalah keliling: lingkaran bertambah luas sebagai cincin tipis sepanjang tepinya.' },
    tex: 'A=\\pi r^2',
    dtex: '\\frac{dA}{dr}=2\\pi r',
    x0: 3,
  },
  {
    id: 'circle-d',
    name: { en: 'area of a circle with respect to its diameter', id: 'luas lingkaran terhadap diameternya' },
    x: { en: 'diameter D', id: 'diameter D' },
    f: (d) => (Math.PI * d * d) / 4,
    df: (d) => (Math.PI * d) / 2,
    derivativeNote: { en: 'With the diameter as the variable the rate is half as large for the same circle: the unit of change is different.', id: 'Dengan diameter sebagai peubah, lajunya separuh untuk lingkaran yang sama: satuan perubahannya berbeda.' },
    tex: 'A=\\frac{\\pi D^2}{4}',
    dtex: '\\frac{dA}{dD}=\\frac{\\pi D}{2}',
    x0: 10,
  },
  {
    id: 'sphere-r',
    name: { en: 'volume of a sphere with respect to its radius', id: 'volume bola terhadap jari-jarinya' },
    x: { en: 'radius r', id: 'jari-jari r' },
    f: (r) => (4 / 3) * Math.PI * r ** 3,
    df: (r) => 4 * Math.PI * r * r,
    derivativeNote: { en: 'The rate is the surface area: a sphere grows by a thin shell.', id: 'Lajunya adalah luas permukaan: bola bertambah volume sebagai kulit tipis.' },
    tex: 'V=\\frac43\\pi r^3',
    dtex: '\\frac{dV}{dr}=4\\pi r^2',
    x0: 2,
  },
  {
    id: 'cube',
    name: { en: 'volume of a cube with respect to its side', id: 'volume kubus terhadap rusuknya' },
    x: { en: 'side a', id: 'rusuk a' },
    f: (a) => a ** 3,
    df: (a) => 3 * a * a,
    derivativeNote: { en: 'The rate is the area of three faces: a cube grows by a layer on each of three faces.', id: 'Lajunya adalah luas tiga sisi: kubus bertambah dengan satu lapis pada tiga sisinya.' },
    tex: 'V=a^3',
    dtex: '\\frac{dV}{da}=3a^2',
    x0: 4,
  },
  {
    id: 'square',
    name: { en: 'area of a square with respect to its side', id: 'luas persegi terhadap sisinya' },
    x: { en: 'side a', id: 'sisi a' },
    f: (a) => a * a,
    df: (a) => 2 * a,
    derivativeNote: { en: 'The rate is half the perimeter: a square grows by a strip along two of its sides.', id: 'Lajunya adalah setengah keliling: persegi bertambah dengan pita di sepanjang dua sisinya.' },
    tex: 'A=a^2',
    dtex: '\\frac{dA}{da}=2a',
    x0: 5,
  },
]

