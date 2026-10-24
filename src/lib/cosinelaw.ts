/** The law of cosines: the numbers and data behind the "Law of Cosines" article's widgets.
 *
 *  A triangle has sides a, b, c and opposite angles A, B, C (degrees); the law says c² = a² + b² − 2ab·cos C, where C is the angle between a and b.
 *  The solvers for the cases are in `triangle.ts`; this file adds what the article needs beyond them:
 *
 *   - `thirdSide`, `correction` and `sideRange`: the side from two sides and the angle between them, the term that turns Pythagoras into the law,
 *     and the shortest and longest the third side can be (the triangle inequality, which the law implies);
 *   - `angleNaive` and `angleStable`: an angle from three sides by the arccosine, and by the half-angle form that does not lose a thin triangle's angle;
 *   - `kindOfAngle`: acute, right or obtuse from the squares of the sides alone;
 *   - `median`, `resultant` and `trip`: the length of a median, the sum of two forces at an angle, and a journey of two legs on bearings;
 *   - `areaViaCosine`: the area through sin C = √(1 − cos² C), which is Heron's formula in disguise.
 *
 *  The checker (tools/check-cosinelaw.mjs) tests all of it against references that do not use it: triangles built from coordinates and measured with
 *  distances and atan2, high-precision arccosines (mpmath, 50 digits) for the thin triangles, exact fractions for the squares, the median from the
 *  midpoint of a side, forces added as vectors, a journey added up in east and north, and the area from the shoelace formula. */

import { solveSAS, solveSSS, type Solved } from './triangle'

export { solveSAS, solveSSS, type Solved }

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

/** The side c opposite the angle C (degrees) between the sides a and b: c² = a² + b² − 2ab cos C. */
export const thirdSide = (a: number, b: number, C: number): number => Math.sqrt(Math.max(0, a * a + b * b - 2 * a * b * Math.cos(C * RAD)))

/** The term −2ab·cos C: zero at a right angle, negative for an acute angle (c is shorter than the hypotenuse of the same legs), positive for an obtuse one. */
export const correction = (a: number, b: number, C: number): number => -2 * a * b * Math.cos(C * RAD)

/** The shortest and the longest c can be for the sides a and b, when C runs from 0° to 180°: |a − b| and a + b. */
export const sideRange = (a: number, b: number): [number, number] => [Math.abs(a - b), a + b]

/** The angle opposite c, from the three sides, by the arccosine of (a² + b² − c²) / 2ab. The ratio is clamped into [−1, 1] first, as a program must. */
export function angleNaive(a: number, b: number, c: number): number {
  const x = (a * a + b * b - c * c) / (2 * a * b)
  return Math.acos(Math.max(-1, Math.min(1, x))) * DEG
}

/** The same angle by the half-angle form, tan(C/2) = √((s − a)(s − b) / (s(s − c))) with s the half-perimeter, which keeps its digits when the angle is tiny (with s − a and s − b computed as (c ± (b − a)) / 2). */
export function angleStable(a: number, b: number, c: number): number {
  // s − a and s − b are written as (c ± (b − a)) / 2: the difference b − a of two close long sides is exact, so a tiny c is not lost in s − a
  const u = (c + (b - a)) / 2
  const v = (c - (b - a)) / 2
  const s = (a + b + c) / 2
  const sc = (a + b - c) / 2 // s − c
  if (sc <= 0) return 180 // c = a + b: the triangle is flat and the angle is a straight one
  return 2 * Math.atan(Math.sqrt(Math.max(0, u * v) / (s * sc))) * DEG
}

export type AngleKind = 'acute' | 'right' | 'obtuse'

/** What the angle C opposite the side c is, from the squares alone: c² < a² + b² (acute), equal (right), greater (obtuse). */
export function kindOfAngle(a: number, b: number, c: number): AngleKind {
  const lhs = c * c
  const rhs = a * a + b * b
  if (Math.abs(lhs - rhs) <= 1e-12 * Math.max(lhs, rhs)) return 'right'
  return lhs < rhs ? 'acute' : 'obtuse'
}

/** The length of the median from the vertex C to the midpoint of c: ½ √(2a² + 2b² − c²), which follows from the law of cosines. */
export const median = (a: number, b: number, c: number): number => 0.5 * Math.sqrt(Math.max(0, 2 * a * a + 2 * b * b - c * c))

export interface Resultant {
  /** the size of the sum of two forces F1 and F2 whose directions make the angle theta */
  size: number
  /** its direction, as the angle in degrees from F1 towards F2 */
  direction: number
}

/** F1 + F2 for forces at the angle theta between their directions: R² = F1² + F2² + 2·F1·F2·cos theta (a plus, because the triangle's angle is 180° − theta). */
export function resultant(F1: number, F2: number, theta: number): Resultant {
  const size = Math.sqrt(Math.max(0, F1 * F1 + F2 * F2 + 2 * F1 * F2 * Math.cos(theta * RAD)))
  return { size, direction: Math.atan2(F2 * Math.sin(theta * RAD), F1 + F2 * Math.cos(theta * RAD)) * DEG }
}

export interface Trip {
  /** the straight-line distance from the start to the end */
  distance: number
  /** the bearing (degrees clockwise from north, 0 to 360) of the end as seen from the start, and of the start as seen from the end */
  direct: number
  back: number
  /** how far the course turns at the end of the first leg, in degrees, and the angle of the triangle there */
  turn: number
  inside: number
}

const mod360 = (x: number): number => ((x % 360) + 360) % 360

/** A journey of d1 on the bearing b1 and then d2 on the bearing b2: the distance by the law of cosines (the triangle's angle at the turn is 180° minus the
 *  turn of the course), and the bearing of the end by the angle at the start, again by the law of cosines. */
export function trip(d1: number, b1: number, d2: number, b2: number): Trip | null {
  if (!(d1 > 0 && d2 > 0)) return null
  const turnSigned = ((b2 - b1 + 540) % 360) - 180 // from −180 to 180, positive when the course turns to the right
  const turn = Math.abs(turnSigned)
  const inside = 180 - turn
  const distance = thirdSide(d1, d2, inside)
  if (distance < 1e-12) return { distance: 0, direct: mod360(b1 + 180), back: mod360(b1), turn, inside }
  // the angle at the start between the first leg and the straight line, by the law of cosines on the three sides
  const atStart = angleStable(d1, distance, d2)
  const direct = mod360(b1 + (turnSigned >= 0 ? atStart : -atStart))
  return { distance, direct, back: mod360(direct + 180), turn, inside }
}

/** The area ½ab·sin C with sin C taken from the law of cosines, √(1 − cos² C): 16 K² = 4a²b² − (a² + b² − c²)², which is Heron's formula. */
export function areaViaCosine(a: number, b: number, c: number): number {
  const cosC = (a * a + b * b - c * c) / (2 * a * b)
  return 0.5 * a * b * Math.sqrt(Math.max(0, 1 - cosC * cosC))
}
