/** Exact facts about a triangle, behind the widgets of the Triangles article.
 *
 *  Everything that decides what a triangle *is* works on squared side lengths and
 *  coordinates held as fractions: equal sides are equal squares, a right angle is
 *  c² = a² + b², the area comes from the shoelace sum or from Heron's formula
 *  without a square root, and the centroid, circumcenter and orthocenter of a
 *  triangle with rational vertices are rational points. Degrees, the incenter and
 *  the solutions of the law of sines and cosines are floating point, produced for
 *  display, and are checked against the exact values with a tolerance. */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'
import { squareFreeParts } from './irrational'
import { area as polygonArea, distSq, type Pt } from './quadrilateral'

export { rat, type Rat, type Pt }

const ZERO = rat(0n, 1n)
const isZero = (r: Rat): boolean => r.n === 0n
const cmp = (a: Rat, b: Rat): number => {
  const d = a.n * b.d - b.n * a.d
  return d > 0n ? 1 : d < 0n ? -1 : 0
}
const num = (r: Rat): number => Number(r.n) / Number(r.d)
const two = rat(2n, 1n)
const four = rat(4n, 1n)
const sixteen = rat(16n, 1n)

/* --------------------------------------------------------------- square roots */

/** √r written as (k)√m with m squarefree: for r = n/d, √r = √(nd)/d. A rational r gives m = 1. */
export function sqrtParts(r: Rat): { k: Rat; m: bigint } {
  if (r.n === 0n) return { k: ZERO, m: 1n }
  const { k, m } = squareFreeParts(r.n * r.d)
  return { k: ratDiv(rat(k, 1n), rat(r.d, 1n)), m }
}

/* ------------------------------------------------------------ from the sides */

export type BySides = 'equilateral' | 'isosceles' | 'scalene'
export type ByAngles = 'acute' | 'right' | 'obtuse'
export interface Kinds {
  sides: BySides
  angles: ByAngles
}

/** 16·K² for a triangle whose squared sides are p, q, r: 4pq − (p + q − r)². It is positive exactly
 *  when the three lengths make a triangle, and it is symmetric in p, q, r. */
export function sixteenAreaSq(p: Rat, q: Rat, r: Rat): Rat {
  const t = ratSub(ratAdd(p, q), r)
  return ratSub(ratMul(four, ratMul(p, q)), ratMul(t, t))
}

/** Heron's formula without the square root: K² = s(s − a)(s − b)(s − c), for the sides a, b, c themselves. */
export function heronAreaSq(a: Rat, b: Rat, c: Rat): Rat {
  const s = ratDiv(ratAdd(ratAdd(a, b), c), two)
  return ratMul(ratMul(s, ratSub(s, a)), ratMul(ratSub(s, b), ratSub(s, c)))
}

/** Do three positive lengths satisfy the strict triangle inequality? */
export const isTriangle = (a: Rat, b: Rat, c: Rat): boolean =>
  cmp(a, ZERO) > 0 && cmp(b, ZERO) > 0 && cmp(c, ZERO) > 0 && cmp(ratAdd(a, b), c) > 0 && cmp(ratAdd(a, c), b) > 0 && cmp(ratAdd(b, c), a) > 0

/** Classify from the three squared sides, in any order; null when they do not make a triangle. */
export function classifySquares(p: Rat, q: Rat, r: Rat): Kinds | null {
  if (cmp(p, ZERO) <= 0 || cmp(q, ZERO) <= 0 || cmp(r, ZERO) <= 0) return null
  if (cmp(sixteenAreaSq(p, q, r), ZERO) <= 0) return null
  const same = (cmp(p, q) === 0 ? 1 : 0) + (cmp(q, r) === 0 ? 1 : 0) + (cmp(p, r) === 0 ? 1 : 0)
  const sides: BySides = same === 3 ? 'equilateral' : same === 1 ? 'isosceles' : 'scalene'
  const [x, y, z] = [p, q, r].sort(cmp)
  const c = cmp(z, ratAdd(x, y))
  return { sides, angles: c === 0 ? 'right' : c > 0 ? 'obtuse' : 'acute' }
}

export interface SideReport {
  a: Rat
  b: Rat
  c: Rat
  kinds: Kinds
  perimeter: Rat
  /** The semiperimeter. */
  s: Rat
  /** K², the square of the area. The area itself is √(K²), see `sqrtParts`. */
  areaSq: Rat
  /** The squares of the inradius and the circumradius: r² = K²/s², R² = (abc)²/(16K²). */
  inradiusSq: Rat
  circumradiusSq: Rat
  /** Interior angles opposite a, b, c in degrees (floating point, for display). */
  angles: [number, number, number]
}

/** Degrees of the angle opposite the side whose square is r, between sides whose squares are p and q. */
export function angleDeg(p: Rat, q: Rat, r: Rat): number {
  const cos = num(ratSub(ratAdd(p, q), r)) / (2 * Math.sqrt(num(p) * num(q)))
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI
}

/** Everything about the triangle with sides a, b, c, or null when they do not make one. */
export function fromSides(a: Rat, b: Rat, c: Rat): SideReport | null {
  if (!isTriangle(a, b, c)) return null
  const A = ratMul(a, a)
  const B = ratMul(b, b)
  const C = ratMul(c, c)
  const kinds = classifySquares(A, B, C)
  if (!kinds) return null
  const s = ratDiv(ratAdd(ratAdd(a, b), c), two)
  const areaSq = ratDiv(sixteenAreaSq(A, B, C), sixteen)
  const abc = ratMul(ratMul(a, b), c)
  return {
    a,
    b,
    c,
    kinds,
    perimeter: ratAdd(ratAdd(a, b), c),
    s,
    areaSq,
    inradiusSq: ratDiv(areaSq, ratMul(s, s)),
    circumradiusSq: ratDiv(ratMul(abc, abc), ratMul(sixteen, areaSq)),
    angles: [angleDeg(B, C, A), angleDeg(A, C, B), angleDeg(A, B, C)],
  }
}

/* ---------------------------------------------------------- from the vertices */

export interface PointReport {
  /** Squares of the sides BC, CA, AB, opposite A, B, C. */
  sideSq: [Rat, Rat, Rat]
  kinds: Kinds
  area: Rat
  centroid: Pt
  circumcenter: Pt
  orthocenter: Pt
  circumradiusSq: Rat
  /** The incenter and the inradius, floating point (an incenter is rational only for special triangles). */
  incenter: [number, number]
  inradius: number
  angles: [number, number, number]
}

const sub = (p: Pt, q: Pt): Pt => ({ x: ratSub(p.x, q.x), y: ratSub(p.y, q.y) })
const cross = (u: Pt, v: Pt): Rat => ratSub(ratMul(u.x, v.y), ratMul(u.y, v.x))
const norm2 = (p: Pt): Rat => ratAdd(ratMul(p.x, p.x), ratMul(p.y, p.y))

/** Classify and locate the triangle ABC, or null when the three points are collinear or repeated. */
export function fromPoints(A: Pt, B: Pt, C: Pt): PointReport | null {
  const d = ratMul(two, cross(sub(B, A), sub(C, A)))
  if (isZero(d)) return null
  const sideSq: [Rat, Rat, Rat] = [distSq(B, C), distSq(C, A), distSq(A, B)]
  const kinds = classifySquares(sideSq[0], sideSq[1], sideSq[2])
  if (!kinds) return null
  const a2 = norm2(A)
  const b2 = norm2(B)
  const c2 = norm2(C)
  const ux = ratDiv(ratAdd(ratAdd(ratMul(a2, ratSub(B.y, C.y)), ratMul(b2, ratSub(C.y, A.y))), ratMul(c2, ratSub(A.y, B.y))), d)
  const uy = ratDiv(ratAdd(ratAdd(ratMul(a2, ratSub(C.x, B.x)), ratMul(b2, ratSub(A.x, C.x))), ratMul(c2, ratSub(B.x, A.x))), d)
  const O: Pt = { x: ux, y: uy }
  const three = rat(3n, 1n)
  const G: Pt = { x: ratDiv(ratAdd(ratAdd(A.x, B.x), C.x), three), y: ratDiv(ratAdd(ratAdd(A.y, B.y), C.y), three) }
  // The centroid is two thirds of the way from the orthocenter to the circumcenter: H = 3G - 2O.
  const H: Pt = { x: ratSub(ratMul(three, G.x), ratMul(two, O.x)), y: ratSub(ratMul(three, G.y), ratMul(two, O.y)) }
  const area = polygonArea([A, B, C])
  const [la, lb, lc] = sideSq.map((q) => Math.sqrt(num(q)))
  const per = la + lb + lc
  const f = (r: Rat) => num(r)
  return {
    sideSq,
    kinds,
    area,
    centroid: G,
    circumcenter: O,
    orthocenter: H,
    circumradiusSq: distSq(O, A),
    incenter: [(la * f(A.x) + lb * f(B.x) + lc * f(C.x)) / per, (la * f(A.y) + lb * f(B.y) + lc * f(C.y)) / per],
    inradius: (2 * f(area)) / per,
    angles: [angleDeg(sideSq[1], sideSq[2], sideSq[0]), angleDeg(sideSq[0], sideSq[2], sideSq[1]), angleDeg(sideSq[0], sideSq[1], sideSq[2])],
  }
}

/** Translate, rotate by the angle with cosine c and sine s (rational), and scale: a similarity. */
export function similarity(pts: Pt[], c: Rat, s: Rat, k: Rat, dx: Rat, dy: Rat): Pt[] {
  return pts.map((p) => ({
    x: ratAdd(ratMul(k, ratSub(ratMul(c, p.x), ratMul(s, p.y))), dx),
    y: ratAdd(ratMul(k, ratAdd(ratMul(s, p.x), ratMul(c, p.y))), dy),
  }))
}

/* --------------------------------------------------------- Pythagorean triples */

/** Euclid's formula: for m > n > 0 the triple (m² − n², 2mn, m² + n²) is right-angled; it is primitive
 *  when m and n are coprime and of opposite parity. */
export function euclidTriple(m: bigint, n: bigint): [bigint, bigint, bigint] {
  return [m * m - n * n, 2n * m * n, m * m + n * n]
}

/* ------------------------------------------------- the law of sines and cosines */

/** A solved triangle: the sides a, b, c and the opposite angles A, B, C in degrees. */
export interface Solved {
  a: number
  b: number
  c: number
  A: number
  B: number
  C: number
}

const RAD = Math.PI / 180
const DEG = 180 / Math.PI
const acosDeg = (x: number): number => Math.acos(Math.max(-1, Math.min(1, x))) * DEG

/** Three sides (law of cosines); null if they break the triangle inequality. */
export function solveSSS(a: number, b: number, c: number): Solved | null {
  if (!(a > 0 && b > 0 && c > 0) || a + b <= c || a + c <= b || b + c <= a) return null
  const A = acosDeg((b * b + c * c - a * a) / (2 * b * c))
  const B = acosDeg((a * a + c * c - b * b) / (2 * a * c))
  return { a, b, c, A, B, C: 180 - A - B }
}

/** Two sides and the angle C between them (law of cosines for the third side, then SSS). */
export function solveSAS(a: number, C: number, b: number): Solved | null {
  if (!(a > 0 && b > 0 && C > 0 && C < 180)) return null
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * RAD))
  const s = solveSSS(a, b, c)
  return s ? { ...s, C } : null
}

/** Two angles and the side c between them (the third angle is what is left of 180°, then the law of sines). */
export function solveASA(A: number, c: number, B: number): Solved | null {
  const C = 180 - A - B
  if (!(A > 0 && B > 0 && C > 0 && c > 0)) return null
  const k = c / Math.sin(C * RAD)
  return { a: k * Math.sin(A * RAD), b: k * Math.sin(B * RAD), c, A, B, C }
}

/** Two angles and the side a opposite the first one. */
export function solveAAS(A: number, B: number, a: number): Solved | null {
  const C = 180 - A - B
  if (!(A > 0 && B > 0 && C > 0 && a > 0)) return null
  const k = a / Math.sin(A * RAD)
  return { a, b: k * Math.sin(B * RAD), c: k * Math.sin(C * RAD), A, B, C }
}

/** Two sides a, b and the angle A opposite a: none, one or two triangles (the ambiguous case). */
export function solveSSA(a: number, b: number, A: number): Solved[] {
  if (!(a > 0 && b > 0 && A > 0 && A < 180)) return []
  const sinB = (b * Math.sin(A * RAD)) / a
  const eps = 1e-12
  if (sinB > 1 + eps) return []
  const out: Solved[] = []
  const B1 = Math.asin(Math.min(1, sinB)) * DEG
  const tryB = (B: number) => {
    const C = 180 - A - B
    if (C > 1e-9) out.push({ a, b, c: (a * Math.sin(C * RAD)) / Math.sin(A * RAD), A, B, C })
  }
  tryB(B1)
  if (Math.abs(sinB - 1) > eps && Math.abs(B1 - (180 - B1)) > 1e-9) tryB(180 - B1)
  return out
}
