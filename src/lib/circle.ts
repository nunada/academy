/** Exact facts about circles, behind the widgets of the Circles article.
 *
 *  A circle is stored as its center and its *squared* radius, both fractions, so that
 *  everything that decides a question is exact: a point is inside, on or outside by
 *  comparing squared distances; a line is a miss, a tangent or a secant by comparing the
 *  squared distance from the center with r²; two circles meet according to a comparison
 *  that needs only (d² − r₁² − r₂²)² against 4r₁²r₂². The tangent points and the
 *  intersection points of a rational circle with a rational line are written as a
 *  rational point plus or minus a multiple of √(a rational number). Areas come out as a
 *  rational multiple of π (the area is r²π, and r² is a fraction). Degrees, arc lengths
 *  and the polygon bounds for π are floating point, produced for display and checked
 *  against exact or independent values with a tolerance. */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'
import { distSq, type Pt } from './quadrilateral'

export { rat, type Rat, type Pt }

const ZERO = rat(0n, 1n)
const two = rat(2n, 1n)
const four = rat(4n, 1n)
const sign = (r: Rat): number => (r.n > 0n ? 1 : r.n < 0n ? -1 : 0)
const cmp = (a: Rat, b: Rat): number => sign(ratSub(a, b))
const sq = (r: Rat): Rat => ratMul(r, r)
const num = (r: Rat): number => Number(r.n) / Number(r.d)

export interface Circle {
  c: Pt
  /** The squared radius r², a positive fraction. */
  r2: Rat
}

/* ------------------------------------------------------------- constructing */

/** The circle with this center and squared radius (null when r² is not positive). */
export const circle = (c: Pt, r2: Rat): Circle | null => (sign(r2) > 0 ? { c, r2 } : null)

/** The circle with this center through the point p. */
export const throughPoint = (c: Pt, p: Pt): Circle | null => circle(c, distSq(c, p))

/** The circle through three points (their circumcircle), or null when they are collinear. */
export function throughThree(A: Pt, B: Pt, C: Pt): Circle | null {
  const d = ratMul(two, ratSub(ratMul(ratSub(B.x, A.x), ratSub(C.y, A.y)), ratMul(ratSub(B.y, A.y), ratSub(C.x, A.x))))
  if (sign(d) === 0) return null
  const n = (p: Pt) => ratAdd(ratMul(p.x, p.x), ratMul(p.y, p.y))
  const a2 = n(A)
  const b2 = n(B)
  const c2 = n(C)
  const ux = ratDiv(ratAdd(ratAdd(ratMul(a2, ratSub(B.y, C.y)), ratMul(b2, ratSub(C.y, A.y))), ratMul(c2, ratSub(A.y, B.y))), d)
  const uy = ratDiv(ratAdd(ratAdd(ratMul(a2, ratSub(C.x, B.x)), ratMul(b2, ratSub(A.x, C.x))), ratMul(c2, ratSub(B.x, A.x))), d)
  const O = { x: ux, y: uy }
  return circle(O, distSq(O, A))
}

/** The circle x² + y² + Dx + Ey + F = 0: center (−D/2, −E/2), r² = D²/4 + E²/4 − F; null if r² is not positive. */
export function fromGeneral(D: Rat, E: Rat, F: Rat): Circle | null {
  const h = ratDiv(ratSub(ZERO, D), two)
  const k = ratDiv(ratSub(ZERO, E), two)
  return circle({ x: h, y: k }, ratSub(ratAdd(sq(h), sq(k)), F))
}

/** (D, E, F) of x² + y² + Dx + Ey + F = 0 for this circle. */
export function generalForm(c: Circle): { D: Rat; E: Rat; F: Rat } {
  return {
    D: ratMul(rat(-2n, 1n), c.c.x),
    E: ratMul(rat(-2n, 1n), c.c.y),
    F: ratSub(ratAdd(sq(c.c.x), sq(c.c.y)), c.r2),
  }
}

/* ----------------------------------------------------- a point and a circle */

/** The power of the point p: |pc|² − r². Negative inside, zero on the circle, and for an outside point
 *  the square of the length of a tangent segment. */
export const power = (c: Circle, p: Pt): Rat => ratSub(distSq(c.c, p), c.r2)

export type Position = 'inside' | 'on' | 'outside'
export const position = (c: Circle, p: Pt): Position => {
  const s = sign(power(c, p))
  return s < 0 ? 'inside' : s === 0 ? 'on' : 'outside'
}

/* ------------------------------------------------------- a line and a circle */

/** Where the line ax + by = k meets the circle. The meeting points (if any) are `foot ± s·(−b, a)` with s² = `sSq`:
 *  `foot` is the point of the line closest to the center (the midpoint of the chord, or the point of tangency). */
export interface LineMeet {
  kind: 'none' | 'tangent' | 'secant'
  foot: Pt
  /** The squared distance from the center to the line. */
  dSq: Rat
  sSq: Rat
}

export function lineMeets(c: Circle, a: Rat, b: Rat, k: Rat): LineMeet | null {
  const norm = ratAdd(sq(a), sq(b))
  if (sign(norm) === 0) return null
  const t = ratDiv(ratSub(ratAdd(ratMul(a, c.c.x), ratMul(b, c.c.y)), k), norm)
  const foot: Pt = { x: ratSub(c.c.x, ratMul(a, t)), y: ratSub(c.c.y, ratMul(b, t)) }
  const dSq = ratMul(sq(t), norm)
  const gap = ratSub(c.r2, dSq)
  const kind = sign(gap) < 0 ? 'none' : sign(gap) === 0 ? 'tangent' : 'secant'
  return { kind, foot, dSq, sSq: kind === 'none' ? ZERO : ratDiv(gap, norm) }
}

/** The tangent points from an outside point p: where the chord of contact meets the circle. */
export function tangentsFrom(c: Circle, p: Pt): LineMeet | null {
  if (sign(power(c, p)) <= 0) return null
  const a = ratSub(p.x, c.c.x)
  const b = ratSub(p.y, c.c.y)
  const k = ratAdd(ratAdd(c.r2, ratMul(a, c.c.x)), ratMul(b, c.c.y))
  return lineMeets(c, a, b, k)
}

/** The two meeting points as floating point, for drawing. */
export function meetingPoints(m: LineMeet, a: Rat, b: Rat): [number, number][] {
  if (m.kind === 'none') return []
  const fx = num(m.foot.x)
  const fy = num(m.foot.y)
  const s = Math.sqrt(num(m.sSq))
  return m.kind === 'tangent' ? [[fx, fy]] : [[fx - s * num(b), fy + s * num(a)], [fx + s * num(b), fy - s * num(a)]]
}

/* ------------------------------------------------------- two circles */

export type Relation = 'coincident' | 'separate' | 'external' | 'secant' | 'internal' | 'contained'

/** How two circles lie. With d the distance between centers: separate (d > r₁+r₂), externally tangent (d = r₁+r₂),
 *  crossing in two points, internally tangent (d = |r₁−r₂|), or one inside the other (d < |r₁−r₂|).
 *  Exact: with m = d² − r₁² − r₂², d² against (r₁ ± r₂)² is m against ±2r₁r₂, decided by squaring. */
export function relation(p: Circle, q: Circle): Relation {
  const d2 = distSq(p.c, q.c)
  const m = ratSub(ratSub(d2, p.r2), q.r2)
  if (sign(d2) === 0 && cmp(p.r2, q.r2) === 0) return 'coincident'
  const lhs = sq(m)
  const rhs = ratMul(four, ratMul(p.r2, q.r2)) // (2 r1 r2)²
  const c = cmp(lhs, rhs)
  // d² > (r1 + r2)² ⇔ m > 2r1r2 ⇔ m > 0 and m² > 4r1²r2²; d² < (r1 − r2)² ⇔ m < −2r1r2 ⇔ m < 0 and m² > 4r1²r2².
  if (c > 0) return sign(m) > 0 ? 'separate' : 'contained'
  if (c === 0) return sign(m) > 0 ? 'external' : 'internal'
  return 'secant'
}

/* ------------------------------------------------------- arcs and sectors */

export interface Sector {
  /** The central angle in degrees and in radians. */
  degrees: number
  radians: number
  /** Arc length, sector area, chord length and segment area for radius r. */
  arc: number
  sector: number
  chord: number
  segment: number
  /** The triangle formed by the two radii and the chord (signed: negative beyond a half turn). */
  triangle: number
}

/** The pieces of a circle of radius r cut by a central angle of θ degrees (0 ≤ θ ≤ 360). */
export function sectorOf(r: number, degrees: number): Sector {
  const radians = (degrees * Math.PI) / 180
  const triangle = (r * r * Math.sin(radians)) / 2
  return {
    degrees,
    radians,
    arc: r * radians,
    sector: (r * r * radians) / 2,
    chord: 2 * r * Math.sin(radians / 2),
    segment: (r * r * (radians - Math.sin(radians))) / 2,
    triangle,
  }
}

/* ------------------------------------------------- angles in a circle */

export interface InscribedAngles {
  /** The inscribed angle APB, in degrees. */
  inscribed: number
  /** The arc AB that does not contain P, in degrees: always twice the inscribed angle. */
  arc: number
  /** The central angle AOB (the smaller one, at most 180°). */
  central: number
}

const mod360 = (x: number): number => ((x % 360) + 360) % 360

/** Points A, B, P on a circle, given by their polar angles in degrees (all different). */
export function inscribedAngles(a: number, b: number, p: number): InscribedAngles {
  const ccw = mod360(b - a) // the arc from A to B going counterclockwise
  const pInside = mod360(p - a) < ccw
  const arc = pInside ? 360 - ccw : ccw
  return { inscribed: arc / 2, arc, central: Math.min(arc, 360 - arc) }
}

/* ------------------------------------------- Archimedes' bounds for π */

export interface PolygonBounds {
  /** The number of sides. */
  n: number
  /** π lies between n·sin(π/n) (the inscribed polygon) and n·tan(π/n) (the circumscribed polygon). */
  lower: number
  upper: number
}

/** The bounds from the regular polygons with 6·2^k sides, by Archimedes' doubling recurrences, which use only
 *  square roots and no trigonometry, and which are numerically stable. */
export function polygonBounds(k: number): PolygonBounds {
  let n = 6
  let s = 1 // side of the inscribed polygon in a unit circle
  let u = 1 / Math.sqrt(3) // tan(π/n)
  for (let i = 0; i < k; i++) {
    s = s / Math.sqrt(2 + Math.sqrt(4 - s * s))
    u = u / (1 + Math.sqrt(1 + u * u))
    n *= 2
  }
  return { n, lower: (n * s) / 2, upper: n * u }
}
