/** A solid of revolution — the one shape this app's `Figure` system (plane
 *  vectors and curves under an orthographic camera) genuinely cannot show.
 *  A disk, a washer, a shell are all the same idea: a boundary curve swept
 *  around an axis. Nothing here knows about Three.js or React —
 *  `Solid3DView.tsx` does the drawing, this file only says what to draw.
 */

import { evaluateAt } from './expr'
import type { FigColor } from './figure'
import type { Loc } from '../content/types'

export interface Solid3D {
  /** Radius as a function of height, along the axis of revolution — written
   *  with `x` as the variable (same convention as a `Figure` curve's `f`),
   *  even where the source lesson calls that variable `y`. The one rule
   *  that keeps this geometrically honest: `outer`/`inner` must be the
   *  region's actual radius at each height, not just "the function from the
   *  lesson" — a shell-method region built from $y=f(x)$ still has to be
   *  re-expressed as radius-vs-height (usually an outer/inner pair) to
   *  become a real solid, exactly as `int-m6-s2-l2`'s own washer-in-$y$
   *  check already does; a bare, uninverted $f(x)$ reused as "radius at
   *  height x" silently draws a hollow zero-thickness shell instead of the
   *  actual solid whenever the region doesn't reach all the way to the axis.
   */
  outer: string
  /** Radius as a function of height, for a washer's inner wall — a solid
   *  with a hole down its length. Omit for a plain, solid disk. */
  inner?: string
  from: number
  to: number
  /** Display only — which of the source figure's axes this solid's height
   *  runs along. 'x' lays it on its side (height runs left-right, matching
   *  a disk/washer lesson's horizontal integration variable); 'y' stands it
   *  upright (a lathe's own natural orientation). Never changes what
   *  `outer`/`inner` mean — both are always radius-vs-height. */
  axis: 'x' | 'y'
  /** Degrees of the full revolution to actually draw. Less than 360 leaves
   *  a wedge open so the solid's interior — and a washer's hole — stays
   *  visible rather than hidden inside an opaque shell. Default 270. */
  sweep?: number
  color?: FigColor
  caption?: Loc
  height?: number
}

const SAMPLES = 48

/** Below this, two consecutive profile points count as "the same point" —
 *  a zero-length edge between them, harmless for the lathe's own side
 *  surface (a degenerate quad simply has no area) but not for a `cap`'s
 *  triangulation or for `computeVertexNormals` at that shared vertex,
 *  which can come out ill-defined right where two lengths of the outline
 *  happen to touch — a washer whose outer and inner radius agree at one
 *  end is exactly this on purpose (a knife-edge rim), not a mistake to
 *  fix in the formula, so the fix lives here instead: never hand the
 *  lathe two points for the one place they coincide. */
const COINCIDENT_EPS = 1e-9

const closeEnough = (a: [number, number], b: [number, number]): boolean =>
  Math.abs(a[0] - b[0]) < COINCIDENT_EPS && Math.abs(a[1] - b[1]) < COINCIDENT_EPS

/** Drop any point that is the same as the one right before it, so a rim
 *  where two walls happen to meet becomes one shared vertex instead of a
 *  zero-length edge. */
const dedupe = (points: [number, number][]): [number, number][] =>
  points.filter((p, i) => i === 0 || !closeEnough(p, points[i - 1]))

/** `(radius, height)` pairs tracing the solid's cross-section, in the order
 *  a lathe wants them: walk the outer wall from one end to the other, and —
 *  for a washer — back along the inner wall, so the path closes into a
 *  proper loop with both ends capped rather than left open. */
export function buildProfile(solid: Solid3D): [number, number][] {
  const { outer, inner, from, to } = solid
  const point = (fn: string, h: number): [number, number] => [Math.max(0, evaluateAt(fn, { x: h })), h]

  const outerPts: [number, number][] = []
  for (let i = 0; i <= SAMPLES; i++) {
    outerPts.push(point(outer, from + ((to - from) * i) / SAMPLES))
  }

  if (inner) {
    const innerPts: [number, number][] = []
    for (let i = SAMPLES; i >= 0; i--) {
      innerPts.push(point(inner, from + ((to - from) * i) / SAMPLES))
    }
    // Close the loop explicitly: a washer's path doesn't return to its own
    // start on its own (it ends at the inner wall's radius, not the outer's).
    return dedupe([...outerPts, ...innerPts, outerPts[0]])
  }

  // A solid disk: touch the axis at either end that doesn't already, so the
  // tip is a smooth closed point rather than an open rim.
  const profile = [...outerPts]
  if (profile[0][0] > 1e-9) profile.unshift([0, profile[0][1]])
  const last = profile[profile.length - 1]
  if (last[0] > 1e-9) profile.push([0, last[1]])
  return dedupe(profile)
}
