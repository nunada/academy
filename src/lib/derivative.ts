/** Exact arithmetic for the "The Derivative as a Function" article's widgets.
 *
 *  Three exact tools, all in BigInt fractions so that a limit never hides behind rounding:
 *   1. Rational functions N(x)/D(x) with rational coefficients: the derivative function (reduced), the
 *      difference quotient at a point, and where the function and its derivative are undefined.
 *   2. The difference quotient of a polynomial as a polynomial in h whose coefficients are polynomials in x,
 *      (f(x + h) − f(x)) / h = Q₀(x) + Q₁(x)·h + …, so the derivative function is Q₀ read off by the
 *      binomial theorem, with no differentiation rule used.
 *   3. Graphs made of line segments: the derivative is a step function, undefined at a corner, and the graph can be
 *      rebuilt from the steps.
 *  The floating-point graphs the page draws (`GRAPHS`) carry their derivative formulas here too, so the checker
 *  can compare each one with central differences. */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'
import {
  degree,
  derivative,
  evalPoly,
  parsePolynomialInX,
  polyMul,
  polySub,
  rationalRoots,
  type Poly,
} from './tangent'
import { AlgebraError } from './algebra'

export { rat, type Rat, type Poly }

const ZERO = rat(0n, 1n)
const ONE = rat(1n, 1n)
const isZero = (r: Rat): boolean => r.n === 0n

/* ------------------------------------------------------------ polynomial division */

const trim = (p: Poly): Poly => {
  const q = p.slice()
  while (q.length && isZero(q[q.length - 1])) q.pop()
  return q
}

/** Quotient and remainder of a divided by b (b not zero). */
export function polyDivmod(a: Poly, b: Poly): { q: Poly; r: Poly } {
  const B = trim(b)
  if (!B.length) throw new Error('division by the zero polynomial')
  let r = trim(a)
  const q: Poly = new Array(Math.max(0, r.length - B.length + 1)).fill(ZERO)
  const lead = B[B.length - 1]
  while (r.length >= B.length) {
    const k = r.length - B.length
    const c = ratDiv(r[r.length - 1], lead)
    q[k] = c
    r = trim(polySub(r, shiftUp(B, k).map((x) => ratMul(x, c))))
  }
  return { q: trim(q), r }
}

const shiftUp = (p: Poly, k: number): Poly => [...new Array(k).fill(ZERO), ...p]

/** The monic greatest common divisor of two polynomials (the zero polynomial if both are zero). */
export function polyGcd(a: Poly, b: Poly): Poly {
  let x = trim(a)
  let y = trim(b)
  while (y.length) {
    const { r } = polyDivmod(x, y)
    x = y
    y = r
  }
  if (!x.length) return []
  const lead = x[x.length - 1]
  return x.map((c) => ratDiv(c, lead))
}

/* ------------------------------------------------------------ rational functions */

export interface RationalFn {
  num: Poly
  den: Poly
}

/** A single factor: a parenthesized group or a product with no `+`, `-` or `/` outside parentheses (a leading sign aside). */
function isSingleFactor(s: string): boolean {
  let depth = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '(') depth++
    else if (c === ')') depth--
    else if (depth === 0 && (c === '/' || ((c === '+' || c === '-') && i > 0 && s[i - 1] !== '^'))) return false
  }
  return depth === 0
}

/** Read `x^2 - 3x`, `1/x`, `x/(x-1)` or `(x^2+1)/(x-2)`: a polynomial, or one quotient of two factors. Throws AlgebraError. */
export function parseFunction(src: string): RationalFn {
  const s = src.replace(/\s+/g, '')
  try {
    return { num: parsePolynomialInX(s), den: [ONE] }
  } catch (e) {
    if (!(e instanceof AlgebraError)) throw e
    if (e.code !== 'division' && e.code !== 'syntax') throw e
  }
  let depth = 0
  const slashes: number[] = []
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++
    else if (s[i] === ')') depth--
    else if (s[i] === '/' && depth === 0) slashes.push(i)
  }
  if (slashes.length !== 1) throw new AlgebraError('syntax')
  const left = s.slice(0, slashes[0])
  const right = s.slice(slashes[0] + 1)
  if (!left || !right || !isSingleFactor(left) || !isSingleFactor(right)) throw new AlgebraError('syntax')
  const num = parsePolynomialInX(left)
  const den = parsePolynomialInX(right)
  if (!den.length) throw new AlgebraError('division')
  return { num, den }
}

export const isPolynomial = (f: RationalFn): boolean => degree(f.den) === 0

/** f(x), or null where the denominator is zero. */
export function evalFn(f: RationalFn, x: Rat): Rat | null {
  const d = evalPoly(f.den, x)
  return isZero(d) ? null : ratDiv(evalPoly(f.num, x), d)
}

/** (f(x + h) − f(x)) / h straight from the definition, or null if f is undefined at x or at x + h. */
export function diffQuotientFn(f: RationalFn, x: Rat, h: Rat): Rat | null {
  if (isZero(h)) throw new Error('h must not be 0')
  const a = evalFn(f, x)
  const b = evalFn(f, ratAdd(x, h))
  return a === null || b === null ? null : ratDiv(ratSub(b, a), h)
}

/** The same fraction in lowest terms, with a monic denominator when it can be arranged. */
export function reduceFn(f: RationalFn): RationalFn {
  const num = trim(f.num)
  const den = trim(f.den)
  if (!num.length) return { num: [], den: [ONE] }
  const g = polyGcd(num, den)
  let n = num
  let d = den
  if (g.length > 1) {
    n = polyDivmod(num, g).q
    d = polyDivmod(den, g).q
  }
  const lead = d[d.length - 1]
  return { num: n.map((c) => ratDiv(c, lead)), den: d.map((c) => ratDiv(c, lead)) }
}

/** The derivative function (N'D − ND') / D², reduced. */
export function derivativeFn(f: RationalFn): RationalFn {
  const n = trim(f.num)
  const d = trim(f.den)
  const top = polySub(polyMul(derivative(n), d), polyMul(n, derivative(d)))
  return reduceFn({ num: top, den: polyMul(d, d) })
}

/** Rational values of x where the original denominator vanishes (null if too large to search), and how many
 *  roots of the denominator are not rational (at least this many more may exist). */
export function excludedPoints(f: RationalFn): { rational: Rat[] | null } {
  if (degree(f.den) <= 0) return { rational: [] }
  return { rational: rationalRoots(f.den) }
}

/* -------------------------------------- the difference quotient as a polynomial in h */

const binom = (n: number, k: number): bigint => {
  let r = 1n
  for (let i = 1; i <= k; i++) r = (r * BigInt(n - k + i)) / BigInt(i)
  return r
}

/** For a polynomial p, the polynomials Q_k(x) in (p(x + h) − p(x)) / h = Σ Q_k(x) h^k, by the binomial theorem:
 *  the coefficient c_n x^n contributes c_n·C(n, k + 1)·x^(n − k − 1) to Q_k. Q_0 is the derivative function. */
export function quotientInXandH(p: Poly): Poly[] {
  const q = trim(p)
  const out: Poly[] = []
  for (let k = 0; k + 1 < q.length; k++) {
    const row: Poly = new Array(q.length - k - 1).fill(ZERO)
    for (let n = k + 1; n < q.length; n++) row[n - k - 1] = ratAdd(row[n - k - 1], ratMul(q[n], rat(binom(n, k + 1), 1n)))
    out.push(trim(row))
  }
  return out
}

/** Evaluate Σ Q_k(x) h^k. */
export function evalQuotient(qs: Poly[], x: Rat, h: Rat): Rat {
  let acc = ZERO
  let hk = ONE
  for (const qk of qs) {
    acc = ratAdd(acc, ratMul(evalPoly(qk, x), hk))
    hk = ratMul(hk, h)
  }
  return acc
}

/* ------------------------------------------------------ graphs made of segments */

export interface Pt {
  x: Rat
  y: Rat
}
export interface Piece {
  from: Rat
  to: Rat
  slope: Rat
}

/** A polyline needs at least two points with strictly increasing x. Returns an error code or null. */
export function polylineProblem(pts: Pt[]): 'few' | 'order' | null {
  if (pts.length < 2) return 'few'
  for (let i = 1; i < pts.length; i++) if (pts[i].x.n * pts[i - 1].x.d <= pts[i - 1].x.n * pts[i].x.d) return 'order'
  return null
}

export function pieces(pts: Pt[]): Piece[] {
  const out: Piece[] = []
  for (let i = 1; i < pts.length; i++)
    out.push({ from: pts[i - 1].x, to: pts[i].x, slope: ratDiv(ratSub(pts[i].y, pts[i - 1].y), ratSub(pts[i].x, pts[i - 1].x)) })
  return out
}

export interface StepReport {
  pieces: Piece[]
  /** Interior vertices where the two slopes differ: f' does not exist there. */
  corners: { x: Rat; left: Rat; right: Rat }[]
  /** Interior vertices where the slopes agree, so the vertex is not a corner at all. */
  smooth: Rat[]
}

export function stepDerivative(pts: Pt[]): StepReport {
  const ps = pieces(pts)
  const corners: StepReport['corners'] = []
  const smooth: Rat[] = []
  for (let i = 1; i < ps.length; i++) {
    const l = ps[i - 1].slope
    const r = ps[i].slope
    if (l.n * r.d === r.n * l.d) smooth.push(ps[i].from)
    else corners.push({ x: ps[i].from, left: l, right: r })
  }
  return { pieces: ps, corners, smooth }
}

/** f(x) on [first x, last x], else null. */
export function polylineValue(pts: Pt[], x: Rat): Rat | null {
  const cmp = (a: Rat, b: Rat) => (a.n * b.d < b.n * a.d ? -1 : a.n * b.d > b.n * a.d ? 1 : 0)
  if (cmp(x, pts[0].x) < 0 || cmp(x, pts[pts.length - 1].x) > 0) return null
  for (let i = 1; i < pts.length; i++)
    if (cmp(x, pts[i].x) <= 0) {
      const a = pts[i - 1]
      const b = pts[i]
      return ratAdd(a.y, ratMul(ratDiv(ratSub(b.y, a.y), ratSub(b.x, a.x)), ratSub(x, a.x)))
    }
  return null
}

/** Rebuild a polyline from a starting point and a list of steps: slope `slope` up to x = `to`. */
export function fromSteps(start: Pt, steps: { to: Rat; slope: Rat }[]): Pt[] {
  const out: Pt[] = [start]
  let cur = start
  for (const s of steps) {
    const next = { x: s.to, y: ratAdd(cur.y, ratMul(s.slope, ratSub(s.to, cur.x))) }
    out.push(next)
    cur = next
  }
  return out
}

/* ---------------------------------------- graphs drawn in floating point */

export interface GraphDef {
  id: string
  tex: string
  f: (x: number) => number
  /** The derivative function, where it exists. */
  d: (x: number) => number
  /** Points of the window where f' does not exist. */
  holes: number[]
  xr: [number, number]
  fy: [number, number]
  dy: [number, number]
  /** Where f itself is defined, when that is a smaller set than the window. */
  domain?: [number, number]
  /** What the derivative graph looks like, for the reader. */
  note: { en: string; id: string }
}

export const GRAPHS: GraphDef[] = [
  {
    id: 'sq',
    tex: 'x^2',
    f: (x) => x * x,
    d: (x) => 2 * x,
    holes: [],
    xr: [-3, 3],
    fy: [-1, 9],
    dy: [-6, 6],
    note: { en: 'The slope is negative to the left of the vertex, zero at the vertex and positive to the right: f′ is a straight line through the origin.', id: 'Gradiennya negatif di kiri puncak, nol di puncak, dan positif di kanan: f′ adalah garis lurus melalui titik asal.' },
  },
  {
    id: 'cubic',
    tex: 'x^3-3x',
    f: (x) => x ** 3 - 3 * x,
    d: (x) => 3 * x * x - 3,
    holes: [],
    xr: [-2.5, 2.5],
    fy: [-5, 5],
    dy: [-4, 14],
    note: { en: 'f′ is zero at the top and the bottom of the graph of f (x = −1 and x = 1), and f′ is lowest, at −3, at x = 0, where the graph of f falls most steeply.', id: 'f′ bernilai nol di puncak dan dasar grafik f (x = −1 dan x = 1), dan f′ terendah, yaitu −3, di x = 0, tempat grafik f turun paling curam.' },
  },
  {
    id: 'recip',
    tex: '\\frac1x',
    f: (x) => 1 / x,
    d: (x) => -1 / (x * x),
    holes: [0],
    xr: [-3, 3],
    fy: [-5, 5],
    dy: [-9, 1],
    note: { en: 'f′(x) = −1/x² is negative everywhere it exists: both branches of 1/x fall. It is steep near 0, flat far away, and not defined at 0, where f is not defined either.', id: 'f′(x) = −1/x² negatif di mana pun ia ada: kedua cabang 1/x menurun. Ia curam di dekat 0, landai di tempat yang jauh, dan tidak terdefinisi di 0, tempat f juga tidak terdefinisi.' },
  },
  {
    id: 'sqrt',
    tex: '\\sqrt{x}',
    f: Math.sqrt,
    d: (x) => 0.5 / Math.sqrt(x),
    holes: [0],
    xr: [-1, 5],
    fy: [-1, 3],
    dy: [-1, 4],
    domain: [0, Infinity],
    note: { en: 'f′(x) = 1/(2√x) climbs without bound as x → 0⁺. The function √x is defined at 0 but its derivative is not: the domain of f′ is smaller than the domain of f.', id: 'f′(x) = 1/(2√x) naik tanpa batas saat x → 0⁺. Fungsi √x terdefinisi di 0 tetapi turunannya tidak: daerah asal f′ lebih kecil daripada daerah asal f.' },
  },
  {
    id: 'abs',
    tex: '|x|',
    f: Math.abs,
    d: (x) => Math.sign(x),
    holes: [0],
    xr: [-3, 3],
    fy: [-1, 4],
    dy: [-2, 2],
    note: { en: 'f′ is −1 on the left of 0 and +1 on the right: two flat pieces and no value at 0, because the graph of |x| has a corner there.', id: 'f′ bernilai −1 di kiri 0 dan +1 di kanan: dua potongan mendatar dan tidak ada nilai di 0, karena grafik |x| memiliki sudut tajam di sana.' },
  },
  {
    id: 'xabs',
    tex: 'x|x|',
    f: (x) => x * Math.abs(x),
    d: (x) => 2 * Math.abs(x),
    holes: [],
    xr: [-2, 2],
    fy: [-4, 4],
    dy: [-1, 5],
    note: { en: 'f′(x) = 2|x| has a corner of its own at 0, yet f′(0) = 0 exists: x|x| is smooth, and its derivative function is the one with the corner.', id: 'f′(x) = 2|x| memiliki sudut tajam sendiri di 0, tetapi f′(0) = 0 ada: x|x| mulus, dan fungsi turunannyalah yang bersudut tajam.' },
  },
  {
    id: 'sin',
    tex: '\\sin x',
    f: Math.sin,
    d: Math.cos,
    holes: [],
    xr: [-6.5, 6.5],
    fy: [-1.6, 1.6],
    dy: [-1.6, 1.6],
    note: { en: 'f′ is zero at every peak and valley of sin x, and its graph is the same wave shifted a quarter period to the left: the derivative of sin x is cos x.', id: 'f′ bernilai nol di setiap puncak dan lembah sin x, dan grafiknya adalah gelombang yang sama yang digeser seperempat periode ke kiri: turunan sin x adalah cos x.' },
  },
  {
    id: 'cbrt',
    tex: 'x^{1/3}',
    f: Math.cbrt,
    d: (x) => (1 / 3) * Math.abs(x) ** (-2 / 3),
    holes: [0],
    xr: [-3, 3],
    fy: [-2, 2],
    dy: [-0.5, 3],
    note: { en: 'f′ is positive on both sides of 0 and blows up to +∞ as x → 0: a vertical tangent, so no derivative at 0 even though the graph is continuous.', id: 'f′ positif di kedua sisi 0 dan membesar ke +∞ saat x → 0: garis singgung tegak, sehingga tidak ada turunan di 0 meskipun grafiknya kontinu.' },
  },
  {
    id: 'wild',
    tex: 'x^2\\sin\\frac1x',
    f: (x) => (x === 0 ? 0 : x * x * Math.sin(1 / x)),
    d: (x) => (x === 0 ? 0 : 2 * x * Math.sin(1 / x) - Math.cos(1 / x)),
    holes: [],
    xr: [-0.5, 0.5],
    fy: [-0.3, 0.3],
    dy: [-1.6, 1.6],
    note: { en: 'f is differentiable everywhere, with f′(0) = 0, but f′(x) = 2x sin(1/x) − cos(1/x) keeps swinging between about −1 and 1 near 0: a derivative function need not be continuous.', id: 'f terdiferensialkan di mana-mana, dengan f′(0) = 0, tetapi f′(x) = 2x sin(1/x) − cos(1/x) terus berayun di antara sekitar −1 dan 1 di dekat 0: fungsi turunan tidak harus kontinu.' },
  },
]
