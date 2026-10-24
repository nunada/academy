/** The law of sines: the numbers and data behind the "Law of Sines" article's widgets.
 *
 *  A triangle has sides a, b, c and opposite angles A, B, C (degrees), and the law says a / sin A = b / sin B = c / sin C = 2R, where R is the
 *  radius of the circle through the three vertices. The solvers for the given-three-measurements cases are in `triangle.ts`; this file adds
 *  what the article needs beyond them:
 *
 *   - `circumradius`, `areaThreeWays`, and `ratios`: the common value of the law, the circle, and the area ½ab·sin C written three ways;
 *   - `ssaKind` and `ssaPoints`: the whole decision tree of the ambiguous case (two sides and an angle opposite one of them), and the
 *     positions of the unknown vertex found *geometrically*, as the places where a circle of radius a meets a ray, with no law of sines in it;
 *   - `place`: coordinates for drawing a triangle;
 *   - `survey` and `surveyWorstError`: the distance to a point across a river from a baseline and two angles, and how much an error of a degree in
 *     the readings can change it.
 *
 *  The checker (tools/check-sinelaw.mjs) tests all of it against references that do not use it: triangles built from coordinates and measured
 *  with atan2 and distances, the circumcenter from the perpendicular bisectors, the area from Heron's formula, the ambiguous case counted
 *  by intersecting a circle with a ray, and the survey by intersecting two lines. */

import { solveAAS, solveASA, solveSSA, solveSSS, solveSAS, type Solved } from './triangle'

export { solveAAS, solveASA, solveSSA, solveSSS, solveSAS, type Solved }

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

/** a / sin A, b / sin B and c / sin C: all equal, and all equal to the diameter of the circle through the vertices. */
export const ratios = (t: Solved): [number, number, number] => [t.a / Math.sin(t.A * RAD), t.b / Math.sin(t.B * RAD), t.c / Math.sin(t.C * RAD)]

/** The radius R of the circle through the three vertices: a / (2 sin A). */
export const circumradius = (t: Solved): number => t.a / (2 * Math.sin(t.A * RAD))

/** The area ½ · (two sides) · sin (the angle between them), once for each pair. */
export const areaThreeWays = (t: Solved): [number, number, number] => [0.5 * t.b * t.c * Math.sin(t.A * RAD), 0.5 * t.a * t.c * Math.sin(t.B * RAD), 0.5 * t.a * t.b * Math.sin(t.C * RAD)]

/** The vertices with A at the origin, B on the positive x-axis and C above it. */
export function place(t: Solved): { A: [number, number]; B: [number, number]; C: [number, number] } {
  return { A: [0, 0], B: [t.c, 0], C: [t.b * Math.cos(t.A * RAD), t.b * Math.sin(t.A * RAD)] }
}

export type SsaKind = 'none-short' | 'right' | 'two' | 'one-long' | 'one-obtuse' | 'none-obtuse'

export interface SsaInfo {
  kind: SsaKind
  /** how many triangles have these measurements */
  count: 0 | 1 | 2
  /** the height b·sin A of C above the line through A and B: a must reach at least this far */
  h: number
}

/** The ambiguous case for the sides a, b and the angle A opposite a: how many triangles, and why. */
export function ssaKind(a: number, b: number, A: number): SsaInfo {
  const h = b * Math.sin(A * RAD)
  const eq = (x: number, y: number): boolean => Math.abs(x - y) <= 1e-12 * Math.max(1, Math.abs(x), Math.abs(y))
  if (A < 90 - 1e-12) {
    if (eq(a, h)) return { kind: 'right', count: 1, h }
    if (a < h) return { kind: 'none-short', count: 0, h }
    if (a < b && !eq(a, b)) return { kind: 'two', count: 2, h }
    return { kind: 'one-long', count: 1, h }
  }
  // a right or obtuse angle: only the longer side opposite it works
  return a > b && !eq(a, b) ? { kind: 'one-obtuse', count: 1, h } : { kind: 'none-obtuse', count: 0, h }
}

/** The positions x of the vertex B on the ray from A (A at the origin, C at distance b and angle A), found as the points of the ray at distance a from C:
 *  (x − b cos A)² + (b sin A)² = a². No law of sines is used; the number of such x > 0 is the number of triangles. */
export function ssaPoints(a: number, b: number, A: number): number[] {
  const bc = b * Math.cos(A * RAD)
  const h = b * Math.sin(A * RAD)
  const disc = a * a - h * h
  // a circle that touches the ray (a = h to rounding) meets it once; the tolerance matches the one of `ssaKind`
  const tol = 1e-11 * Math.max(1, a * a)
  if (disc < -tol) return []
  const r = disc <= tol ? 0 : Math.sqrt(disc)
  const out: number[] = []
  for (const x of r === 0 ? [bc] : [bc - r, bc + r]) if (x > 1e-9 * Math.max(1, b)) out.push(x)
  return out.sort((p, q) => p - q)
}

export interface Survey {
  /** the angle at the target between the two lines of sight */
  gamma: number
  /** the distance from each end of the baseline to the target */
  fromP: number
  fromQ: number
  /** the perpendicular distance from the target to the baseline: the width of the river */
  h: number
}

/** Two observers P and Q a distance L apart see a target T on the far side; alpha and beta are the angles between the baseline PQ and the lines of sight
 *  PT and QT. The angle at T is 180° − alpha − beta and the law of sines gives the rest. */
export function survey(L: number, alpha: number, beta: number): Survey | null {
  const gamma = 180 - alpha - beta
  if (!(L > 0 && alpha > 0 && beta > 0 && gamma > 0)) return null
  const k = L / Math.sin(gamma * RAD)
  const fromP = k * Math.sin(beta * RAD)
  const fromQ = k * Math.sin(alpha * RAD)
  return { gamma, fromP, fromQ, h: fromP * Math.sin(alpha * RAD) }
}

/** The largest change of h, as a fraction of h, when each angle may be read wrongly by up to `dDeg` degrees (all four combinations of signs). */
export function surveyWorstError(L: number, alpha: number, beta: number, dDeg: number): number | null {
  const s = survey(L, alpha, beta)
  if (!s) return null
  let worst = 0
  for (const da of [-dDeg, dDeg])
    for (const db of [-dDeg, dDeg]) {
      const t = survey(L, alpha + da, beta + db)
      if (t) worst = Math.max(worst, Math.abs(t.h - s.h) / s.h)
      else worst = Infinity
    }
  return worst
}

/** The angle in degrees whose sine is x, as the two angles between 0° and 180° that share it (one if x = 1). */
export const anglesWithSine = (x: number): number[] => {
  if (x < 0 || x > 1 + 1e-12) return []
  const a = Math.asin(Math.min(1, x)) * DEG
  return Math.abs(a - (180 - a)) < 1e-9 ? [a] : [a, 180 - a]
}
