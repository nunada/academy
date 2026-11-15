/** A scene in space, written as data: a beam that bends, a channel with water in it, a road that climbs.
 *
 *  The plane figures (`figure.ts`) are vectors and graphs under an orthographic camera, and `solid3d.ts` is one solid of revolution. A lesson about
 *  structures needs neither: it needs *things*, boxes and cylinders and swept sections, lit and turned by hand, whose sizes follow a slider. This file
 *  describes such a scene and works it down to triangles. Nothing here knows about Three.js or React: `Scene3DView.tsx` does the drawing, so everything
 *  below is plain arithmetic that a script can check (tools/check-scene3d.mjs measures the volume of every solid it builds).
 *
 *   - coordinates are the engineer's: x to the right, y going back, z up;
 *   - every number may be an expression in the scene's sliders (`'l/2'`, `'-w*x^2'`), read by `expr.ts`, so the names are lowercase;
 *   - a solid is always a closed surface with its triangles facing out, which is what lets its volume be measured;
 *   - `readouts` are numbers worked out from the sliders and printed under the picture. */

import { evaluateAt } from './expr'
import type { FigColor, FigParam } from './figure'
import type { Loc } from '../content/types'

/** The figure roles, and a few materials that look the same in the light and the dark theme. */
export type SceneColor = FigColor | 'water' | 'wood' | 'concrete' | 'steel' | 'earth' | 'road' | 'grass'

/** A number, or an expression in the sliders. */
export type Num = number | string
export type Pt = [Num, Num, Num]
export type V3 = [number, number, number]

interface Look {
  color?: SceneColor
  /** 1 (the default) is solid; water and a log that has to be seen through are about 0.4. */
  opacity?: number
}

export type SceneItem =
  /** A box with its faces along the axes, between two opposite corners. */
  | ({ t: 'box'; from: Pt; to: Pt } & Look)
  /** A cylinder between two points; with `r2`, a cone or a tapered post. */
  | ({ t: 'cyl'; from: Pt; to: Pt; r: Num; r2?: Num } & Look)
  /** A convex polygon drawn in one of the coordinate planes and pushed along the third axis: the cross-section of a channel, a wedge under a beam.
   *  `plane: 'yz'` is pushed along x from `from` to `to`, `'xz'` along y, `'xy'` along z. */
  | ({ t: 'extrude'; plane: 'yz' | 'xz' | 'xy'; pts: [Num, Num][]; from: Num; to: Num } & Look)
  /** A rectangular section carried along a curve: the top face follows `z` (and the centerline `y`), both expressions in `x`, and the section is
   *  `width` across and `depth` down. A bent beam, a road. */
  | ({ t: 'sweep'; x: [Num, Num]; y?: string; z: string; width: Num; depth: Num; n?: number } & Look)
  /** A block whose top and bottom are rectangles of different sizes, one above the other: a pond with sloping banks, the water in it. `a` and `b`
   *  are the sizes along x and along y, at the bottom and at the top. */
  | ({ t: 'frustum'; z: [Num, Num]; a: [Num, Num]; b: [Num, Num]; center?: [Num, Num] } & Look)
  /** A line through points. */
  | { t: 'line'; pts: Pt[]; color?: SceneColor; dashed?: boolean }
  /** The path of `(x(t), y(t), z(t))`, expressions in `t`. */
  | { t: 'curve'; x: string; y: string; z: string; from: Num; to: Num; n?: number; color?: SceneColor; dashed?: boolean }
  /** An arrow from one point to another. */
  | { t: 'arrow'; from: Pt; to: Pt; color?: SceneColor }
  /** A row of `n` arrows along x, each from height `from` to height `to` (expressions in `x`): a load spread along a beam. */
  | { t: 'arrows'; x: [Num, Num]; n: number; y?: Num; from: string; to: string; color?: SceneColor }
  /** A ball that marks a point. */
  | { t: 'dot'; at: Pt; r?: Num; color?: SceneColor }
  /** A short piece of text at a point: a letter, a number, a symbol. The same in both languages unless given as a pair. */
  | { t: 'label'; at: Pt; text: string | Loc }

export interface SceneReadout {
  label: Loc
  /** An expression in the sliders. */
  value: string
  /** Decimal places, 2 by default. */
  dp?: number
  unit?: string | Loc
}

export interface Scene3D {
  params?: FigParam[]
  items: SceneItem[]
  readouts?: SceneReadout[]
  caption?: Loc
  /** Pixels; 360 by default. */
  height?: number
  /** Where the camera starts: degrees round the vertical axis (0 looks along +y, from the front) and degrees above the ground. */
  view?: [number, number]
}

/* ------------------------------------------------------------------------------- what is drawn */

export interface Mesh {
  /** x, y, z of every corner, one after another. */
  positions: number[]
  /** Three corner numbers per triangle, counter-clockwise seen from outside. */
  indices: number[]
  color: SceneColor
  opacity: number
  /** Smooth-shaded (a cylinder) or faceted (a box). */
  smooth: boolean
}
export interface Polyline {
  points: V3[]
  color: SceneColor
  dashed: boolean
}
export interface Ball {
  at: V3
  r: number
  color: SceneColor
}
export interface Tag {
  at: V3
  text: string
}
export interface Resolved {
  meshes: Mesh[]
  lines: Polyline[]
  balls: Ball[]
  tags: Tag[]
  /** The box that holds everything, for placing the camera. */
  min: V3
  max: V3
}

/** The sliders' starting values. */
export const startValues = (scene: Scene3D): Record<string, number> => Object.fromEntries((scene.params ?? []).map((p) => [p.name, p.value]))

/** A number or an expression, at the given slider values (and any extra names, such as the `x` of a sweep). */
export const num = (v: Num, vars: Record<string, number>): number => (typeof v === 'number' ? v : evaluateAt(v, vars))
const pt = (p: Pt, vars: Record<string, number>): V3 => [num(p[0], vars), num(p[1], vars), num(p[2], vars)]

/** The value of a readout. */
export const readoutValue = (r: SceneReadout, vars: Record<string, number>): number => evaluateAt(r.value, vars)

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (k: number, a: V3): V3 => [k * a[0], k * a[1], k * a[2]]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const len = (a: V3): number => Math.sqrt(dot(a, a))

/** The volume inside a closed mesh whose triangles face out (the divergence theorem, one tetrahedron per triangle). */
export function meshVolume(m: Mesh): number {
  let v = 0
  for (let i = 0; i < m.indices.length; i += 3) {
    const p = (k: number): V3 => [m.positions[3 * m.indices[i + k]], m.positions[3 * m.indices[i + k] + 1], m.positions[3 * m.indices[i + k] + 2]]
    v += dot(p(0), cross(p(1), p(2))) / 6
  }
  return v
}

/** A mesh builder: corners are added once and triangles name them. */
class Builder {
  positions: number[] = []
  indices: number[] = []
  v(p: V3): number {
    this.positions.push(p[0], p[1], p[2])
    return this.positions.length / 3 - 1
  }
  tri(a: number, b: number, c: number) {
    this.indices.push(a, b, c)
  }
  /** A four-sided face a, b, c, d going round counter-clockwise seen from outside. */
  quad(a: number, b: number, c: number, d: number) {
    this.tri(a, b, c)
    this.tri(a, c, d)
  }
  mesh(look: Look, fallback: SceneColor, smooth: boolean): Mesh {
    const m: Mesh = { positions: this.positions, indices: this.indices, color: look.color ?? fallback, opacity: look.opacity ?? 1, smooth }
    // a builder is free to go round either way: the solid is turned inside out here if it came out negative
    if (meshVolume(m) < 0) for (let i = 0; i < m.indices.length; i += 3) [m.indices[i + 1], m.indices[i + 2]] = [m.indices[i + 2], m.indices[i + 1]]
    return m
  }
}

/** Two rings of the same number of corners joined by a band, and closed at both ends: every solid here is one of these. */
function loft(rings: V3[][], look: Look, fallback: SceneColor, smooth: boolean): Mesh {
  const b = new Builder()
  const n = rings[0].length
  const ids = rings.map((ring) => ring.map((p) => b.v(p)))
  for (let k = 0; k + 1 < rings.length; k++) for (let i = 0; i < n; i++) b.quad(ids[k][i], ids[k][(i + 1) % n], ids[k + 1][(i + 1) % n], ids[k + 1][i])
  // the two ends, as fans about their own centers (the rings are convex)
  const cap = (ring: V3[], flip: boolean) => {
    const c = b.v(mul(1 / n, ring.reduce((s, p) => add(s, p), [0, 0, 0] as V3)))
    const own = ring.map((p) => b.v(p))
    for (let i = 0; i < n; i++) flip ? b.tri(c, own[(i + 1) % n], own[i]) : b.tri(c, own[i], own[(i + 1) % n])
  }
  cap(rings[0], true)
  cap(rings[rings.length - 1], false)
  return b.mesh(look, fallback, smooth)
}

const SEGMENTS = 32

/** A unit vector at right angles to `a`, and the third that completes the frame. */
function frame(a: V3): [V3, V3] {
  const pick: V3 = Math.abs(a[2]) < 0.9 * len(a) ? [0, 0, 1] : [1, 0, 0]
  const u = cross(a, pick)
  const un = mul(1 / (len(u) || 1), u)
  const w = cross(a, un)
  return [un, mul(1 / (len(w) || 1), w)]
}

function cylinder(from: V3, to: V3, r1: number, r2: number, look: Look, fallback: SceneColor, segments = SEGMENTS): Mesh {
  const [u, w] = frame(sub(to, from))
  const ring = (c: V3, r: number): V3[] =>
    Array.from({ length: segments }, (_, i) => {
      const t = (2 * Math.PI * i) / segments
      return add(c, add(mul(r * Math.cos(t), u), mul(r * Math.sin(t), w)))
    })
  return loft([ring(from, r1), ring(to, r2)], look, fallback, true)
}

/** An arrow: a thin shaft and a cone, sized from the scene. */
function arrow(from: V3, to: V3, color: SceneColor, size: number): Mesh[] {
  const d = sub(to, from)
  const l = len(d)
  if (!(l > 0)) return []
  const head = Math.min(l * 0.45, size * 0.06)
  const neck = add(from, mul((l - head) / l, d))
  return [cylinder(from, neck, size * 0.008, size * 0.008, { color }, color, 10), cylinder(neck, to, size * 0.022, 0, { color }, color, 14)]
}

/** Work a scene down to triangles, lines, balls and labels at the given slider values. `lang` picks the text of a two-language label. */
export function resolveScene(scene: Scene3D, values: Record<string, number>, lang: 'en' | 'id' = 'en'): Resolved {
  const meshes: Mesh[] = []
  const lines: Polyline[] = []
  const balls: Ball[] = []
  const tags: Tag[] = []
  const pending: (() => void)[] = []
  /** Lines that only exist to make room for the arrows, and are not drawn. */
  const ghost = new Set<number>()

  for (const it of scene.items) {
    switch (it.t) {
      case 'box': {
        const a = pt(it.from, values)
        const c = pt(it.to, values)
        const lo: V3 = [Math.min(a[0], c[0]), Math.min(a[1], c[1]), Math.min(a[2], c[2])]
        const hi: V3 = [Math.max(a[0], c[0]), Math.max(a[1], c[1]), Math.max(a[2], c[2])]
        const ring = (z: number): V3[] => [[lo[0], lo[1], z], [hi[0], lo[1], z], [hi[0], hi[1], z], [lo[0], hi[1], z]]
        meshes.push(loft([ring(lo[2]), ring(hi[2])], it, 'a', false))
        break
      }
      case 'cyl':
        meshes.push(cylinder(pt(it.from, values), pt(it.to, values), num(it.r, values), it.r2 === undefined ? num(it.r, values) : num(it.r2, values), it, 'a'))
        break
      case 'extrude': {
        const poly = it.pts.map(([p, q]) => [num(p, values), num(q, values)] as [number, number])
        const f = num(it.from, values)
        const t = num(it.to, values)
        const place = (p: number, q: number, s: number): V3 => (it.plane === 'yz' ? [s, p, q] : it.plane === 'xz' ? [p, s, q] : [p, q, s])
        meshes.push(loft([poly.map(([p, q]) => place(p, q, f)), poly.map(([p, q]) => place(p, q, t))], it, 'a', false))
        break
      }
      case 'sweep': {
        const x0 = num(it.x[0], values)
        const x1 = num(it.x[1], values)
        const n = it.n ?? 48
        const w = num(it.width, values) / 2
        const d = num(it.depth, values)
        const rings: V3[][] = []
        for (let i = 0; i <= n; i++) {
          const x = x0 + ((x1 - x0) * i) / n
          const vars = { ...values, x }
          const y = it.y ? evaluateAt(it.y, vars) : 0
          const z = evaluateAt(it.z, vars)
          rings.push([[x, y - w, z - d], [x, y + w, z - d], [x, y + w, z], [x, y - w, z]])
        }
        meshes.push(loft(rings, it, 'a', false))
        break
      }
      case 'frustum': {
        const z0 = num(it.z[0], values)
        const z1 = num(it.z[1], values)
        const cx = it.center ? num(it.center[0], values) : 0
        const cy = it.center ? num(it.center[1], values) : 0
        const ring = (a: number, b: number, z: number): V3[] => [[cx - a / 2, cy - b / 2, z], [cx + a / 2, cy - b / 2, z], [cx + a / 2, cy + b / 2, z], [cx - a / 2, cy + b / 2, z]]
        meshes.push(loft([ring(num(it.a[0], values), num(it.b[0], values), z0), ring(num(it.a[1], values), num(it.b[1], values), z1)], it, 'a', false))
        break
      }
      case 'line':
        lines.push({ points: it.pts.map((p) => pt(p, values)), color: it.color ?? 'muted', dashed: Boolean(it.dashed) })
        break
      case 'curve': {
        const f = num(it.from, values)
        const t1 = num(it.to, values)
        const n = it.n ?? 64
        const points: V3[] = []
        for (let i = 0; i <= n; i++) {
          const t = f + ((t1 - f) * i) / n
          const vars = { ...values, t }
          points.push([evaluateAt(it.x, vars), evaluateAt(it.y, vars), evaluateAt(it.z, vars)])
        }
        lines.push({ points, color: it.color ?? 'result', dashed: Boolean(it.dashed) })
        break
      }
      case 'arrow': {
        const a = pt(it.from, values)
        const b = pt(it.to, values)
        // arrows are sized from the whole scene, so they are made once its size is known
        pending.push(() => meshes.push(...arrow(a, b, it.color ?? 'b', size())))
        break
      }
      case 'arrows': {
        const x0 = num(it.x[0], values)
        const x1 = num(it.x[1], values)
        const y = it.y === undefined ? 0 : num(it.y, values)
        const ends: [V3, V3][] = []
        for (let i = 0; i < it.n; i++) {
          const x = it.n === 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (it.n - 1)
          const vars = { ...values, x }
          ends.push([[x, y, evaluateAt(it.from, vars)], [x, y, evaluateAt(it.to, vars)]])
        }
        pending.push(() => {
          for (const [a, b] of ends) meshes.push(...arrow(a, b, it.color ?? 'b', size()))
        })
        // the bounds must already hold the arrows' ends
        lines.push({ points: ends.flatMap(([a, b]) => [a, b]), color: 'muted', dashed: false })
        ghost.add(lines.length - 1)
        break
      }
      case 'dot':
        balls.push({ at: pt(it.at, values), r: it.r === undefined ? -1 : num(it.r, values), color: it.color ?? 'result' })
        break
      case 'label':
        tags.push({ at: pt(it.at, values), text: typeof it.text === 'string' ? it.text : it.text[lang] })
        break
    }
  }

  // the box around everything that has a place
  const min: V3 = [Infinity, Infinity, Infinity]
  const max: V3 = [-Infinity, -Infinity, -Infinity]
  const grow = (p: V3) => {
    for (let k = 0; k < 3; k++) {
      if (Number.isFinite(p[k])) {
        min[k] = Math.min(min[k], p[k])
        max[k] = Math.max(max[k], p[k])
      }
    }
  }
  for (const m of meshes) for (let i = 0; i < m.positions.length; i += 3) grow([m.positions[i], m.positions[i + 1], m.positions[i + 2]])
  for (const l of lines) l.points.forEach(grow)
  balls.forEach((b) => grow(b.at))
  tags.forEach((t) => grow(t.at))
  for (let k = 0; k < 3; k++) {
    if (!Number.isFinite(min[k])) {
      min[k] = 0
      max[k] = 1
    }
  }
  function size(): number {
    return len(sub(max, min)) || 1
  }
  pending.forEach((f) => f())
  const s = size()
  for (const b of balls) if (b.r < 0) b.r = s * 0.018
  return { meshes, lines: lines.filter((_, i) => !ghost.has(i)), balls, tags, min, max }
}

/** A number as it is printed under a scene: `dp` places, the reader's decimal mark, no minus zero. */
export function showNumber(x: number, dp = 2, lang: 'en' | 'id' = 'en'): string {
  if (!Number.isFinite(x)) return '–'
  const r = Math.abs(x) < 0.5 * 10 ** -dp ? 0 : x
  const s = r.toFixed(dp)
  return lang === 'id' ? s.replace('.', ',') : s
}
