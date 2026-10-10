/** Exact classification of a quadrilateral from the coordinates of its four
 *  vertices, behind the widgets of the Quadrilaterals article.
 *
 *  Every test that decides what a shape *is* uses fractions only: parallel is a
 *  zero cross product, perpendicular a zero dot product, equal sides equal
 *  squared lengths, and the area is the shoelace sum. Degrees and decimal
 *  perimeters are produced afterwards, for display, and are never compared. */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'

export { rat, type Rat }

export interface Pt {
  x: Rat
  y: Rat
}

const ZERO = rat(0n, 1n)
const isZero = (r: Rat): boolean => r.n === 0n
const eq = (a: Rat, b: Rat): boolean => a.n === b.n && a.d === b.d
const sign = (r: Rat): number => (r.n > 0n ? 1 : r.n < 0n ? -1 : 0)
const half = rat(1n, 2n)

export const pt = (x: bigint | number, y: bigint | number, d = 1n): Pt => ({ x: rat(BigInt(x), d), y: rat(BigInt(y), d) })

const sub = (p: Pt, q: Pt): Pt => ({ x: ratSub(p.x, q.x), y: ratSub(p.y, q.y) })
const add = (p: Pt, q: Pt): Pt => ({ x: ratAdd(p.x, q.x), y: ratAdd(p.y, q.y) })
const cross = (u: Pt, v: Pt): Rat => ratSub(ratMul(u.x, v.y), ratMul(u.y, v.x))
const dot = (u: Pt, v: Pt): Rat => ratAdd(ratMul(u.x, v.x), ratMul(u.y, v.y))
const lenSq = (u: Pt): Rat => dot(u, u)
const samePt = (p: Pt, q: Pt): boolean => eq(p.x, q.x) && eq(p.y, q.y)

/** Squared length of the segment from p to q. */
export const distSq = (p: Pt, q: Pt): Rat => lenSq(sub(p, q))

/** The shoelace terms x_i y_{i+1} - x_{i+1} y_i, one per edge, and their sum. */
export function shoelaceTerms(pts: Pt[]): { terms: Rat[]; sum: Rat } {
  const terms: Rat[] = []
  let sum = ZERO
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    const q = pts[(i + 1) % pts.length]
    const t = ratSub(ratMul(p.x, q.y), ratMul(q.x, p.y))
    terms.push(t)
    sum = ratAdd(sum, t)
  }
  return { terms, sum }
}

/** Area of the polygon with these vertices in order: half the absolute shoelace sum.
 *  Only a true area when the polygon does not cross itself. */
export function area(pts: Pt[]): Rat {
  const { sum } = shoelaceTerms(pts)
  return ratMul(half, sum.n < 0n ? rat(-sum.n, sum.d) : sum)
}

/** Do the segments p1p2 and p3p4 cross at a point strictly inside both? */
function properlyCross(p1: Pt, p2: Pt, p3: Pt, p4: Pt): boolean {
  const d1 = sign(cross(sub(p4, p3), sub(p1, p3)))
  const d2 = sign(cross(sub(p4, p3), sub(p2, p3)))
  const d3 = sign(cross(sub(p2, p1), sub(p3, p1)))
  const d4 = sign(cross(sub(p2, p1), sub(p4, p1)))
  return d1 * d2 < 0 && d3 * d4 < 0
}

export type Shape = 'square' | 'rectangle' | 'rhombus' | 'parallelogram' | 'kite' | 'isosceles-trapezoid' | 'trapezoid' | 'dart' | 'convex' | 'concave' | 'crossed' | 'degenerate'

export interface Report {
  shape: Shape
  /** Every school name that applies to the shape (a square is also a rectangle, a rhombus, ...). */
  names: Shape[]
  convex: boolean
  area: Rat
  sideSq: Rat[]
  diagSq: [Rat, Rat]
  /** How many pairs of opposite sides are parallel: 0, 1 or 2. */
  parallelPairs: number
  rightAngles: number
  oppositeSidesEqual: boolean
  allSidesEqual: boolean
  diagonalsEqual: boolean
  diagonalsPerpendicular: boolean
  diagonalsBisect: boolean
  /** Lines of symmetry and the order of rotational symmetry (1 means none), for a convex shape. */
  lines: number
  rotation: number
}

/** Reflect p in the line through a and b (a different from b). */
function reflect(p: Pt, a: Pt, b: Pt): Pt {
  const d = sub(b, a)
  const t = ratDiv(dot(sub(p, a), d), lenSq(d))
  const foot = add(a, { x: ratMul(d.x, t), y: ratMul(d.y, t) })
  return { x: ratSub(ratMul(rat(2n, 1n), foot.x), p.x), y: ratSub(ratMul(rat(2n, 1n), foot.y), p.y) }
}

const sameSet = (a: Pt[], b: Pt[]): boolean => a.every((p) => b.some((q) => samePt(p, q)))

/** Classify the quadrilateral ABCD (vertices in order round the shape). */
export function classify(pts: [Pt, Pt, Pt, Pt]): Report {
  const [A, B, C, D] = pts
  const ab = sub(B, A)
  const bc = sub(C, B)
  const cd = sub(D, C)
  const da = sub(A, D)
  const ac = sub(C, A)
  const bd = sub(D, B)
  const sideSq = [lenSq(ab), lenSq(bc), lenSq(cd), lenSq(da)]
  const diagSq: [Rat, Rat] = [lenSq(ac), lenSq(bd)]
  const ar = area(pts)

  const turns = [cross(ab, bc), cross(bc, cd), cross(cd, da), cross(da, ab)].map(sign)
  const base: Omit<Report, 'shape' | 'names'> = {
    convex: false,
    area: ar,
    sideSq,
    diagSq,
    parallelPairs: 0,
    rightAngles: 0,
    oppositeSidesEqual: false,
    allSidesEqual: false,
    diagonalsEqual: false,
    diagonalsPerpendicular: false,
    diagonalsBisect: false,
    lines: 0,
    rotation: 1,
  }

  const coincident = pts.some((p, i) => samePt(p, pts[(i + 1) % 4])) || samePt(A, C) || samePt(B, D)
  if (coincident || turns.some((t) => t === 0)) return { ...base, shape: 'degenerate', names: ['degenerate'] }
  // A bow-tie can have shoelace sum 0, so the crossing test comes before the zero-area test.
  if (properlyCross(A, B, C, D) || properlyCross(B, C, D, A)) return { ...base, shape: 'crossed', names: ['crossed'] }
  if (isZero(ar)) return { ...base, shape: 'degenerate', names: ['degenerate'] }

  const convex = turns.every((t) => t === turns[0] && t !== 0)
  const parAB = isZero(cross(ab, cd)) // AB parallel to CD
  const parBC = isZero(cross(bc, da)) // BC parallel to DA
  const parallelPairs = (parAB ? 1 : 0) + (parBC ? 1 : 0)
  const rightAngles = [dot(ab, bc), dot(bc, cd), dot(cd, da), dot(da, ab)].filter(isZero).length
  const oppositeSidesEqual = eq(sideSq[0], sideSq[2]) && eq(sideSq[1], sideSq[3])
  const allSidesEqual = oppositeSidesEqual && eq(sideSq[0], sideSq[1])
  const diagonalsEqual = eq(diagSq[0], diagSq[1])
  const diagonalsPerpendicular = isZero(dot(ac, bd))
  const diagonalsBisect = samePt(add(A, C), add(B, D))
  const kitePairs = (eq(sideSq[0], sideSq[3]) && eq(sideSq[1], sideSq[2])) || (eq(sideSq[0], sideSq[1]) && eq(sideSq[2], sideSq[3]))

  // Symmetry of a convex shape: the axes of a quadrilateral run through two vertices or through the
  // midpoints of two opposite sides; a reflection that maps the vertices to themselves is a symmetry.
  let lines = 0
  let rotation = 1
  if (convex) {
    const mid = (p: Pt, q: Pt): Pt => ({ x: ratMul(half, ratAdd(p.x, q.x)), y: ratMul(half, ratAdd(p.y, q.y)) })
    const axes: [Pt, Pt][] = [
      [A, C],
      [B, D],
      [mid(A, B), mid(C, D)],
      [mid(B, C), mid(D, A)],
    ]
    for (const [p, q] of axes) if (!samePt(p, q) && sameSet(pts.map((v) => reflect(v, p, q)), pts)) lines++
    if (diagonalsBisect) {
      rotation = 2
      const O = { x: ratMul(half, ratAdd(A.x, C.x)), y: ratMul(half, ratAdd(A.y, C.y)) }
      const v = sub(A, O)
      const turned: Pt = { x: ratSub(ZERO, v.y), y: v.x }
      if (samePt(add(O, turned), B) || samePt(add(O, turned), D)) rotation = 4
    }
  }

  const parallelogram = parAB && parBC
  const names: Shape[] = []
  let shape: Shape
  if (!convex) {
    shape = kitePairs ? 'dart' : 'concave'
    names.push(shape)
  } else if (parallelogram) {
    const rect = rightAngles === 4
    const rhomb = allSidesEqual
    shape = rect && rhomb ? 'square' : rect ? 'rectangle' : rhomb ? 'rhombus' : 'parallelogram'
    names.push('parallelogram')
    if (rect) names.push('rectangle')
    if (rhomb) names.push('rhombus', 'kite')
    if (rect && rhomb) names.push('square')
  } else if (kitePairs) {
    shape = 'kite'
    names.push('kite')
  } else if (parallelPairs === 1) {
    // The legs are the two sides that are not parallel; a trapezoid is isosceles when they are equal
    // and the diagonals agree.
    const legsEqual = parAB ? eq(sideSq[1], sideSq[3]) : eq(sideSq[0], sideSq[2])
    shape = legsEqual && diagonalsEqual ? 'isosceles-trapezoid' : 'trapezoid'
    names.push('trapezoid')
    if (shape === 'isosceles-trapezoid') names.push('isosceles-trapezoid')
  } else {
    shape = 'convex'
    names.push('convex')
  }
  // A kite that is also a rhombus is listed above; a plain kite is a kite only.
  return { ...base, shape, names, convex, parallelPairs, rightAngles, oppositeSidesEqual, allSidesEqual, diagonalsEqual, diagonalsPerpendicular, diagonalsBisect, lines, rotation }
}

/** Interior angles in degrees at A, B, C, D, for display only (floating point). */
export function anglesDeg(pts: [Pt, Pt, Pt, Pt]): number[] {
  const f = (r: Rat) => Number(r.n) / Number(r.d)
  const orient = sign(shoelaceTerms(pts).sum) || 1
  return pts.map((p, i) => {
    const prev = pts[(i + 3) % 4]
    const next = pts[(i + 1) % 4]
    const u = sub(prev, p)
    const v = sub(next, p)
    // Angle swept from the edge to the previous vertex round to the edge to the next vertex.
    const a = Math.atan2(orient * f(cross(v, u)), f(dot(v, u)))
    const deg = (a * 180) / Math.PI
    return deg < 0 ? deg + 360 : deg
  })
}

/** Translate, rotate by the angle with cosine c and sine s (rational), and scale: a similarity. */
export function similarity(pts: Pt[], c: Rat, s: Rat, k: Rat, dx: Rat, dy: Rat): Pt[] {
  return pts.map((p) => ({
    x: ratAdd(ratMul(k, ratSub(ratMul(c, p.x), ratMul(s, p.y))), dx),
    y: ratAdd(ratMul(k, ratAdd(ratMul(s, p.x), ratMul(c, p.y))), dy),
  }))
}
