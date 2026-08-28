/** The drawings that go with the mathematics lessons.
 *
 *  A figure is written as data, not as SVG: a handful of named vectors, and a
 *  list of things to draw in terms of them. That indirection is the whole
 *  point. When a reader drags the head of `a`, everything the figure said was
 *  built from `a` — the sum, the projection, the shaded parallelogram, the
 *  angle arc, the numbers underneath — is recomputed from the same description
 *  that drew it in the first place. A figure authored as literal coordinates
 *  could only ever be a picture; this one is the statement itself.
 *
 *  Nothing here knows about SVG or React. `Figure.tsx` does the drawing.
 */

import type { Loc } from '../content/types'

/** Two or three numbers. The figure's `dim` says which. */
export type Vec = number[]

/** Roles rather than colours, so the palette stays in the stylesheet. */
export type FigColor = 'a' | 'b' | 'c' | 'result' | 'muted'

/** A vector, either given outright or worked out from the named ones. */
export type VecRef =
  | Vec
  | { of: string }
  | { sum: VecRef[] }
  | { diff: [VecRef, VecRef] }
  | { scale: number; v: VecRef }
  | { cross: [VecRef, VecRef] }
  | { unit: VecRef }
  /** The orthogonal projection of the first onto the second. */
  | { proj: [VecRef, VecRef] }

/** A number worked out from the vectors, for the readouts under a drawing. */
export type NumRef =
  | { norm: VecRef }
  | { dot: [VecRef, VecRef] }
  /** In degrees, which is what the course works in. */
  | { angle: [VecRef, VecRef] }
  /** Area of the parallelogram, and of the triangle, on two vectors. */
  | { area: [VecRef, VecRef] }
  | { tri: [VecRef, VecRef] }
  | { volume: [VecRef, VecRef, VecRef] }

export type FigItem =
  /** An arrow. `drag` names the variable its head edits, which is what makes
   *  a figure interactive — only a vector drawn straight from a variable can
   *  carry it. */
  | {
      t: 'vec'
      from?: VecRef
      to: VecRef
      label?: string
      color?: FigColor
      dashed?: boolean
      drag?: string
    }
  /** A plain line, for construction: a height, an edge, a projection drop. */
  | { t: 'seg'; from: VecRef; to: VecRef; label?: string; color?: FigColor; dashed?: boolean }
  | { t: 'point'; at: VecRef; label?: string; color?: FigColor }
  /** A filled outline — a parallelogram, a triangle, a patch of a plane. */
  | { t: 'poly'; pts: VecRef[]; label?: string; color?: FigColor }
  /** An arc between two directions, drawn at `at` (the origin by default). */
  | { t: 'angle'; at?: VecRef; from: VecRef; to: VecRef; label?: string }
  /** The square that marks a right angle. */
  | { t: 'right'; at?: VecRef; from: VecRef; to: VecRef }
  /** The twelve edges of the box on three vectors, for a volume. */
  | { t: 'box'; a: VecRef; b: VecRef; c: VecRef }

export interface Readout {
  label: string
  /** Exactly one of these. A vector reads as components, a number as a number. */
  v?: VecRef
  n?: NumRef
  /** Decimal places for a number. Whole-number answers usually want 0. */
  dp?: number
}

export interface Figure {
  dim: 2 | 3
  /** The vectors everything else is written in terms of. */
  vars?: Record<string, Vec>
  /** Half the width of the visible region, in graph units. */
  range?: number
  items: FigItem[]
  readouts?: Readout[]
  caption?: Loc
  /** Drag a head to move it in 2D, drag anywhere to turn the scene in 3D. */
  interactive?: boolean
  /** Starting camera for a 3D figure: azimuth and elevation, in degrees. */
  view?: [number, number]
  height?: number
  /** Snap a dragged head to this grid. 0 lets it move freely. */
  snap?: number
}

/* ------------------------------------------------------------ arithmetic */

export const add = (u: Vec, v: Vec): Vec => u.map((x, i) => x + (v[i] ?? 0))
export const sub = (u: Vec, v: Vec): Vec => u.map((x, i) => x - (v[i] ?? 0))
export const mul = (k: number, v: Vec): Vec => v.map((x) => k * x)
export const dot = (u: Vec, v: Vec): number => u.reduce((s, x, i) => s + x * (v[i] ?? 0), 0)
export const norm = (v: Vec): number => Math.sqrt(dot(v, v))

/** Only defined in space. A 2-vector is read as lying in the z = 0 plane, so
 *  that the cross product of two plane vectors comes out along z — which is
 *  exactly the area figure the plane lessons want. */
export function cross(u: Vec, v: Vec): Vec {
  const [a1, a2, a3 = 0] = u
  const [b1, b2, b3 = 0] = v
  return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1]
}

export const unit = (v: Vec): Vec => {
  const n = norm(v)
  return n === 0 ? v.map(() => 0) : mul(1 / n, v)
}

export const project = (u: Vec, onto: Vec): Vec => {
  const d = dot(onto, onto)
  return d === 0 ? onto.map(() => 0) : mul(dot(u, onto) / d, onto)
}

/** The angle between two vectors, in degrees. */
export function angleBetween(u: Vec, v: Vec): number {
  const d = norm(u) * norm(v)
  if (d === 0) return 0
  return (Math.acos(Math.max(-1, Math.min(1, dot(u, v) / d))) * 180) / Math.PI
}

const zero = (dim: number): Vec => Array.from({ length: dim }, () => 0)

/* -------------------------------------------------------------- resolving */

/** Work a `VecRef` down to numbers, given the figure's current variables.
 *  An unknown name resolves to the zero vector rather than throwing: a figure
 *  with a typo in it should still draw the rest of itself. */
export function resolve(ref: VecRef, vars: Record<string, Vec>, dim: number): Vec {
  if (Array.isArray(ref)) return ref
  if ('of' in ref) return vars[ref.of] ?? zero(dim)
  if ('sum' in ref) return ref.sum.reduce<Vec>((acc, r) => add(acc, resolve(r, vars, dim)), zero(dim))
  if ('diff' in ref) return sub(resolve(ref.diff[0], vars, dim), resolve(ref.diff[1], vars, dim))
  if ('scale' in ref) return mul(ref.scale, resolve(ref.v, vars, dim))
  if ('cross' in ref) return cross(resolve(ref.cross[0], vars, dim), resolve(ref.cross[1], vars, dim))
  if ('unit' in ref) return unit(resolve(ref.unit, vars, dim))
  return project(resolve(ref.proj[0], vars, dim), resolve(ref.proj[1], vars, dim))
}

export function resolveNum(ref: NumRef, vars: Record<string, Vec>, dim: number): number {
  const r = (x: VecRef) => resolve(x, vars, dim)
  if ('norm' in ref) return norm(r(ref.norm))
  if ('dot' in ref) return dot(r(ref.dot[0]), r(ref.dot[1]))
  if ('angle' in ref) return angleBetween(r(ref.angle[0]), r(ref.angle[1]))
  if ('area' in ref) return norm(cross(r(ref.area[0]), r(ref.area[1])))
  if ('tri' in ref) return norm(cross(r(ref.tri[0]), r(ref.tri[1]))) / 2
  return Math.abs(dot(r(ref.volume[0]), cross(r(ref.volume[1]), r(ref.volume[2]))))
}

/* ------------------------------------------------------------ projection */

/** An orthographic camera, given as an azimuth and an elevation in degrees.
 *  `right` and `up` are the screen axes; `depth` is how near the camera a
 *  point is, which is all the painter's algorithm needs. */
export function camera(azimuth: number, elevation: number) {
  const t = (azimuth * Math.PI) / 180
  const p = (elevation * Math.PI) / 180
  const right: Vec = [-Math.sin(t), Math.cos(t), 0]
  const up: Vec = [-Math.cos(t) * Math.sin(p), -Math.sin(t) * Math.sin(p), Math.cos(p)]
  const towards: Vec = [Math.cos(t) * Math.cos(p), Math.sin(t) * Math.cos(p), Math.sin(p)]
  return {
    /** Screen coordinates, y still pointing up — the renderer flips it. */
    to2d: (v: Vec): [number, number] => {
      const w: Vec = [v[0] ?? 0, v[1] ?? 0, v[2] ?? 0]
      return [dot(w, right), dot(w, up)]
    },
    depth: (v: Vec): number => dot([v[0] ?? 0, v[1] ?? 0, v[2] ?? 0], towards),
  }
}

/** A number as it should appear under a drawing: no trailing zeros where the
 *  answer is whole, and no `-0`. */
export function show(n: number, dp = 2): string {
  const r = Math.abs(n) < 5e-9 ? 0 : n
  const s = r.toFixed(dp)
  return (dp > 0 ? s.replace(/\.?0+$/, '') : s) || '0'
}
