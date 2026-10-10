/** Drawing helpers for the senior-high course.
 *
 *  Everything the junior-high course draws is re-exported from here, so a
 *  module imports one place. What is added are the pictures senior high needs
 *  and junior high does not: a coordinate plane with equal scales, a labeled
 *  cube or box whose corners can be joined by distances and diagonals, and a
 *  right triangle named for the trigonometric ratios.
 */

import type { FigColor, FigItem, Figure } from '../../lib/figure'
import type { Loc } from '../types'
import { fit, frame3, txt } from '../tka-smp-matematika/figs'
import type { Piece, Piece3, Pt, Pt3 } from '../tka-smp-matematika/figs'

export * from '../tka-smp-matematika/figs'

/** A bilingual string: English first, then Indonesian. */
export const L = (en: string, id: string): Loc => ({ en, id })

const tidy = (n: number) => Number(n.toFixed(6))
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/* ------------------------------------------------------- coordinate plane */

/** A coordinate plane with the numbers on the axes. A square plane by default
 *  (`span` units each way); give `x` and `y` for a different window. The
 *  drawing keeps one unit the same length across and up, so a right angle
 *  looks like one and a circle looks round. */
export function plane(items: FigItem[], o: { span?: number; x?: [number, number]; y?: [number, number] } = {}): Figure {
  const x = o.x ?? [-(o.span ?? 6), o.span ?? 6]
  const y = o.y ?? [-(o.span ?? 6), o.span ?? 6]
  return {
    dim: 2,
    xSpan: x,
    ySpan: y,
    aspect: tidy(clamp((x[1] - x[0]) / (y[1] - y[0]), 0.5, 3)),
    ticks: true,
    items,
  }
}

/** A named point on a coordinate plane. */
export const dot = (p: Pt, label?: string, color: FigColor = 'a'): FigItem => ({ t: 'dot', x: p[0], y: p[1], color, label })

/* ------------------------------------------------------ cube and cuboid */

/** The eight corners of a box ABCD.EFGH: A, B, C, D on the floor (counterclockwise
 *  seen from above) and E, F, G, H directly above them. */
export const CUBE_NAMES = 'ABCDEFGH'

export function cornerOf(name: string, l: number, w: number, h: number): Pt3 {
  const table: Record<string, Pt3> = {
    A: [0, 0, 0],
    B: [l, 0, 0],
    C: [l, w, 0],
    D: [0, w, 0],
    E: [0, 0, h],
    F: [l, 0, h],
    G: [l, w, h],
    H: [0, w, h],
  }
  return table[name]
}

/** A box `l` × `w` × `h` (a cube when all three are equal), drawn from the
 *  corner view with its corners named A–H. The three edges that meet at the far
 *  corner A are dashed, because they are hidden behind the box.
 *
 *  `segs` draws extra lines between two named points (a corner such as `'A'`, or
 *  a name given in `pts`); `pts` adds extra named points such as a midpoint. */
export function box3d(o: {
  l: number
  w?: number
  h?: number
  names?: boolean
  pts?: Record<string, Pt3>
  segs?: { from: string; to: string; color?: FigColor; dashed?: boolean; width?: number }[]
  marks?: string[]
  edgeLabels?: { from: string; to: string; text: string }[]
}): Piece3 {
  const { l } = o
  const w = o.w ?? l
  const h = o.h ?? l
  const mid: Pt3 = [l / 2, w / 2, h / 2]
  const corners = Array.from(CUBE_NAMES).map((n) => cornerOf(n, l, w, h))
  const { shift, range } = frame3(corners.map((c) => [c[0] - mid[0], c[1] - mid[1], c[2] - mid[2]] as Pt3))
  const S = (p: Pt3): Pt3 => [tidy(p[0] - mid[0] + shift[0]), tidy(p[1] - mid[1] + shift[1]), tidy(p[2] - mid[2] + shift[2])]
  const at = (name: string): Pt3 => o.pts?.[name] ?? cornerOf(name, l, w, h)
  const P = (n: string) => S(at(n))
  const items: FigItem[] = []
  items.push({ t: 'poly', pts: [P('B'), P('C'), P('G'), P('F')], color: 'a' })
  items.push({ t: 'poly', pts: [P('D'), P('C'), P('G'), P('H')], color: 'b' })
  items.push({ t: 'poly', pts: [P('E'), P('F'), P('G'), P('H')], color: 'c' })
  const edges: [string, string][] = [
    ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
    ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'E'],
    ['A', 'E'], ['B', 'F'], ['C', 'G'], ['D', 'H'],
  ]
  const hidden = new Set(['AB', 'DA', 'AE'])
  for (const [a, b] of edges) {
    const key = a + b
    items.push({ t: 'seg', from: P(a), to: P(b), color: 'muted', width: 2, dashed: hidden.has(key) || hidden.has(b + a) })
  }
  for (const s of o.segs ?? []) items.push({ t: 'seg', from: P(s.from), to: P(s.to), color: s.color ?? 'result', width: s.width ?? 3, dashed: s.dashed })
  const gap = Math.max(l, w, h) * 0.13
  if (o.names !== false) {
    Array.from(CUBE_NAMES).forEach((n, i) => {
      const c = corners[i]
      const out: Pt3 = [c[0] > mid[0] ? gap : -gap, c[1] > mid[1] ? gap : -gap, c[2] > mid[2] ? gap : -gap]
      items.push({ t: 'text', at: S([c[0] + out[0], c[1] + out[1], c[2] + out[2]]), text: n, color: 'muted', size: 'lg' })
    })
  }
  for (const [name, p] of Object.entries(o.pts ?? {})) {
    items.push({ t: 'point', at: S(p), color: 'result' })
    items.push({ t: 'text', at: S([p[0] + gap * 0.6, p[1] + gap * 0.6, p[2] + gap * 0.6]), text: name, color: 'result', size: 'lg' })
  }
  for (const n of o.marks ?? []) items.push({ t: 'point', at: P(n), color: 'result' })
  for (const e of o.edgeLabels ?? []) {
    const a = at(e.from)
    const b = at(e.to)
    items.push({ t: 'text', at: S([(a[0] + b[0]) / 2 + gap, (a[1] + b[1]) / 2 + gap, (a[2] + b[2]) / 2 + gap * 0.4]), text: e.text, color: 'result', size: 'md' })
  }
  return { dim: 3, axes: false, range: tidy(range * 1.18), view: [38, 22], items }
}

/* ------------------------------------------------------ right triangles */

/** A right triangle with the right angle at the bottom-left, legs `a` (across)
 *  and `b` (up). Names go on the corners, the acute angle at the bottom-right is
 *  marked, and each side may be labeled. */
export function rightTriangle(o: {
  a: number
  b: number
  corners?: [string, string, string]
  sides?: { across?: string; up?: string; slant?: string }
  angle?: string
  extra?: FigItem[]
}): Piece {
  const { a, b } = o
  const items: FigItem[] = [
    { t: 'poly', pts: [[0, 0], [a, 0], [0, b]], color: 'a', look: 'solid' },
    { t: 'right', at: [0, 0], from: [a, 0], to: [0, b] },
  ]
  const cs = o.corners
  if (cs) {
    items.push(txt(-0.45, -0.45, cs[0], 'lg', 'muted'))
    items.push(txt(a + 0.45, -0.45, cs[1], 'lg', 'muted'))
    items.push(txt(-0.45, b + 0.4, cs[2], 'lg', 'muted'))
  }
  if (o.angle) items.push({ t: 'angle', at: [a, 0], from: [0, 0], to: [0, b], label: o.angle })
  if (o.sides?.across) items.push(txt(a / 2, -0.55, o.sides.across, 'md', 'muted'))
  if (o.sides?.up) items.push(txt(-0.5, b / 2, o.sides.up, 'md', 'muted', 'end'))
  if (o.sides?.slant) items.push(txt(a / 2 + 0.45, b / 2 + 0.35, o.sides.slant, 'md', 'muted', 'start'))
  items.push(...(o.extra ?? []))
  return { dim: 2, axes: false, ...fit([[-1.2, -1.1], [a + 1.2, b + 1.1]], 0.3), items }
}

