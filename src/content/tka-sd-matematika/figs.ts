/** Drawing helpers for the elementary-school course.
 *
 *  Every figure in this course is a picture first and a graph never: a number
 *  line, a row of fraction bars, a clock, a bar chart, a grid of unit squares,
 *  a box. They are all built from the same few `Figure` items, so the
 *  helpers here only do the arithmetic of laying them out — where the tick
 *  marks go, how wide each bar is, which way a clock hand points — and hand
 *  back a ready-to-spread piece of a `Figure`:
 *
 *    figure: { ...numberLine({ from: 0, to: 10, step: 1, marks: [{ at: 7 }] }), caption: { ... } }
 *
 *  Plane helpers return `{ aspect, xSpan, ySpan, axes: false, items }` with the
 *  spans chosen so that one unit is the same length across and up (a square
 *  looks square, a circle looks round). Solid helpers return a `dim: 3` piece.
 */

import type { FigColor, FigItem, Figure } from '../../lib/figure'

export type Pt = [number, number]
export type Pt3 = [number, number, number]
export type Piece = Pick<Figure, 'dim' | 'aspect' | 'xSpan' | 'ySpan' | 'axes' | 'items'>
export type Piece3 = Pick<Figure, 'dim' | 'range' | 'axes' | 'items' | 'view' | 'interactive'>

const SIZE = 460
const PAD = 26
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const rad = (deg: number) => (deg * Math.PI) / 180
/** Round away floating-point dust (0.30000000000000004) before it reaches a label. */
const tidy = (n: number) => Number(n.toFixed(6))

/* ---------------------------------------------------------------- frames */

/** The aspect ratio and spans that show `points` with the same scale across
 *  and up, with `pad` units of margin. */
export function fit(points: Pt[], pad = 0.6): Pick<Figure, 'aspect' | 'xSpan' | 'ySpan'> {
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const minx = Math.min(...xs)
  const maxx = Math.max(...xs)
  const miny = Math.min(...ys)
  const maxy = Math.max(...ys)
  const W = maxx - minx + 2 * pad
  const H = maxy - miny + 2 * pad
  const aspect = clamp(SIZE / (2 * PAD + ((SIZE - 2 * PAD) * H) / W), 0.5, 3)
  const HT = SIZE / aspect
  const s = Math.min((SIZE - 2 * PAD) / W, (HT - 2 * PAD) / H)
  const xr = (SIZE - 2 * PAD) / s
  const yr = (HT - 2 * PAD) / s
  const cx = (minx + maxx) / 2
  const cy = (miny + maxy) / 2
  return {
    aspect: tidy(aspect),
    xSpan: [tidy(cx - xr / 2), tidy(cx + xr / 2)],
    ySpan: [tidy(cy - yr / 2), tidy(cy + yr / 2)],
  }
}

/* ------------------------------------------------------------ primitives */

export const rectPts = (x: number, y: number, w: number, h: number): Pt[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
]

/** Points on an ellipse from angle `a0` to `a1` (degrees, counter-clockwise from the right). */
export function ellipsePts(cx: number, cy: number, rx: number, ry: number, a0 = 0, a1 = 360, n = 72): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = rad(a0 + ((a1 - a0) * i) / n)
    return [tidy(cx + rx * Math.cos(a)), tidy(cy + ry * Math.sin(a))] as Pt
  })
}

/** A pie slice: the centre, then the arc from `a0` to `a1` (degrees). */
export const sectorPts = (cx: number, cy: number, r: number, a0: number, a1: number): Pt[] => [
  [cx, cy],
  ...ellipsePts(cx, cy, r, r, a0, a1, Math.max(6, Math.round(Math.abs(a1 - a0) / 6))),
]

export const solid = (pts: Pt[], color: FigColor = 'a', label?: string): FigItem => ({ t: 'poly', pts, color, look: 'solid', label })
export const outline = (pts: Pt[], color: FigColor = 'muted', label?: string): FigItem => ({ t: 'poly', pts, color, look: 'outline', label })
export const line = (from: Pt, to: Pt, color: FigColor = 'muted', o: { dashed?: boolean; width?: number; label?: string } = {}): FigItem => ({
  t: 'seg',
  from,
  to,
  color,
  dashed: o.dashed,
  width: o.width,
  label: o.label,
})
export const txt = (x: number, y: number, text: string, size: 'sm' | 'md' | 'lg' = 'md', color: FigColor = 'muted', anchor: 'start' | 'middle' | 'end' = 'middle'): FigItem => ({
  t: 'text',
  at: [x, y],
  text,
  size,
  color,
  anchor,
})
const CYCLE: FigColor[] = ['a', 'b', 'c', 'result']

/* ----------------------------------------------------------- number line */

/** A number line with tick marks and numbers, and optionally marked points,
 *  arrows for jumps (adding and subtracting), and a shaded stretch.
 *  `fmt` turns a tick value into its label — use it for fractions or units. */
export function numberLine(o: {
  from: number
  to: number
  step: number
  /** Label every n-th tick (default 1). */
  labelEvery?: number
  fmt?: (v: number) => string
  marks?: { at: number; label?: string; color?: FigColor; open?: boolean }[]
  jumps?: { from: number; to: number; label?: string; color?: FigColor }[]
  shade?: [number, number]
}): Piece {
  const { from, to, step, labelEvery = 1, fmt = (v: number) => String(tidy(v)) } = o
  const n = Math.round((to - from) / step)
  const items: FigItem[] = []
  if (o.shade) items.push(line([o.shade[0], 0], [o.shade[1], 0], 'a', { width: 9 }))
  items.push(line([from, 0], [to, 0], 'muted', { width: 3 }))
  for (let i = 0; i <= n; i++) {
    const v = tidy(from + i * step)
    items.push(line([v, -0.3], [v, 0.3], 'muted', { width: 2 }))
    if (i % labelEvery === 0) items.push(txt(v, -1, fmt(v), 'md', 'muted'))
  }
  for (const j of o.jumps ?? []) {
    items.push({ t: 'vec', from: [j.from, 1.1], to: [j.to, 1.1], color: j.color ?? 'result' })
    if (j.label) items.push(txt((j.from + j.to) / 2, 1.75, j.label, 'md', j.color ?? 'result'))
  }
  for (const m of o.marks ?? []) items.push({ t: 'dot', x: m.at, y: 0, color: m.color ?? 'result', open: m.open, label: m.label })
  const pad = (to - from) * 0.06 + step * 0.4
  return { dim: 2, axes: false, aspect: 2.6, xSpan: [tidy(from - pad), tidy(to + pad)], ySpan: [-2.2, 2.4], items }
}

/* ------------------------------------------------------------- fractions */

/** Rows of bars, each cut into equal parts with the first `shaded` coloured.
 *  Stack several to compare fractions: same width, different cuts. */
export function fractionBars(rows: { parts: number; shaded: number; label?: string; color?: FigColor }[], o: { width?: number } = {}): Piece {
  const W = o.width ?? 10
  const items: FigItem[] = []
  const gap = 1.7
  rows.forEach((r, i) => {
    const y0 = (rows.length - 1 - i) * gap
    const w = W / r.parts
    for (let k = 0; k < r.parts; k++) {
      const cell = rectPts(k * w, y0, w, 1)
      items.push(k < r.shaded ? solid(cell, r.color ?? CYCLE[i % CYCLE.length]) : outline(cell))
    }
    if (r.label) items.push(txt(-0.4, y0 + 0.5, r.label, 'lg', 'muted', 'end'))
  })
  const top = (rows.length - 1) * gap + 1
  const left = rows.some((r) => r.label) ? -2.6 : 0
  return { dim: 2, axes: false, ...fit([[left, -0.2], [W + 0.2, top + 0.2]], 0.5), items }
}

/** Circles cut into equal slices, the first `shaded` coloured, side by side. */
export function fractionCircles(circles: { parts: number; shaded: number; label?: string; color?: FigColor }[]): Piece {
  const r = 1.3
  const items: FigItem[] = []
  circles.forEach((c, i) => {
    const cx = i * (2 * r + 1)
    for (let k = 0; k < c.parts; k++) {
      const a0 = 90 - (k * 360) / c.parts
      const a1 = 90 - ((k + 1) * 360) / c.parts
      const pts = c.parts === 1 ? ellipsePts(cx, 0, r, r) : sectorPts(cx, 0, r, a0, a1)
      items.push(k < c.shaded ? solid(pts, c.color ?? CYCLE[i % CYCLE.length]) : outline(pts))
    }
    if (c.label) items.push(txt(cx, -r - 0.6, c.label, 'lg'))
  })
  const right = (circles.length - 1) * (2 * r + 1) + r
  return { dim: 2, axes: false, ...fit([[-r, -r - (circles.some((c) => c.label) ? 1 : 0)], [right, r]], 0.4), items }
}

/* ----------------------------------------------------------------- clock */

/** An analogue clock face showing `h`:`m`. The short thick hand is the hour hand. */
export function clockFace(o: { h: number; m: number; hands?: boolean }): Piece {
  const R = 4
  const items: FigItem[] = [outline(ellipsePts(0, 0, R, R), 'muted')]
  for (let i = 0; i < 60; i++) {
    const a = rad(90 - i * 6)
    const long = i % 5 === 0
    const r0 = R - (long ? 0.35 : 0.15)
    items.push(line([r0 * Math.cos(a), r0 * Math.sin(a)], [R * Math.cos(a), R * Math.sin(a)], 'muted', { width: long ? 2 : 1 }))
  }
  for (let n = 1; n <= 12; n++) {
    const a = rad(90 - n * 30)
    items.push(txt(0.76 * R * Math.cos(a), 0.76 * R * Math.sin(a), String(n), 'lg', 'muted'))
  }
  if (o.hands !== false) {
    const minute = rad(90 - o.m * 6)
    const hour = rad(90 - (o.h % 12) * 30 - o.m * 0.5)
    items.push(line([0, 0], [0.5 * R * Math.cos(hour), 0.5 * R * Math.sin(hour)], 'b', { width: 6 }))
    items.push(line([0, 0], [0.74 * R * Math.cos(minute), 0.74 * R * Math.sin(minute)], 'a', { width: 3.5 }))
    items.push({ t: 'dot', x: 0, y: 0, color: 'muted' })
  }
  return { dim: 2, axes: false, aspect: 1, xSpan: [-4.6, 4.6], ySpan: [-4.6, 4.6], items }
}

/* ------------------------------------------------------------ data charts */

/** A vertical bar chart. `max` is the top of the scale and `step` the spacing
 *  of the guide lines. */
export function barChart(o: {
  bars: { label: string; value: number; color?: FigColor }[]
  max: number
  step: number
  /** Print the value above each bar (default true). Turn off when the value is the question. */
  showValues?: boolean
  title?: string
}): Piece {
  const H = 6
  const k = H / o.max
  const bw = 1
  const gap = 0.7
  const xEnd = o.bars.length * (bw + gap) + 0.4
  const items: FigItem[] = []
  for (let v = 0; v <= o.max + 1e-9; v += o.step) {
    const y = v * k
    if (v > 0) items.push(line([0, y], [xEnd, y], 'muted', { dashed: true }))
    items.push(txt(-0.25, y, String(tidy(v)), 'sm', 'muted', 'end'))
  }
  o.bars.forEach((b, i) => {
    const x = 0.5 + i * (bw + gap)
    items.push(solid(rectPts(x, 0, bw, b.value * k), b.color ?? CYCLE[i % CYCLE.length]))
    if (o.showValues !== false) items.push(txt(x + bw / 2, b.value * k + 0.35, String(tidy(b.value)), 'md', 'muted'))
    items.push(txt(x + bw / 2, -0.55, b.label, 'sm', 'muted'))
  })
  items.push(line([0, 0], [xEnd, 0], 'muted', { width: 2.5 }))
  items.push(line([0, 0], [0, H + 0.2], 'muted', { width: 2.5 }))
  if (o.title) items.push(txt(0, H + 0.9, o.title, 'md', 'muted', 'start'))
  return { dim: 2, axes: false, ...fit([[-1.2, -1.1], [xEnd + 0.3, H + (o.title ? 1.3 : 0.6)]], 0.3), items }
}

/** A pictogram: one row per category, one little square per `per` units
 *  (a half-width square for a half). Put the key in the caption or `key`. */
export function pictogram(o: { rows: { label: string; count: number; color?: FigColor }[]; key?: string }): Piece {
  const items: FigItem[] = []
  const rowGap = 1.4
  const n = o.rows.length
  let maxCount = 1
  o.rows.forEach((r, i) => {
    const y = (n - 1 - i) * rowGap
    items.push(txt(-0.3, y + 0.45, r.label, 'md', 'muted', 'end'))
    const whole = Math.floor(r.count)
    for (let j = 0; j < whole; j++) items.push(solid(rectPts(j * 1.15, y, 1, 0.9), r.color ?? CYCLE[i % CYCLE.length]))
    if (r.count - whole >= 0.5) items.push(solid(rectPts(whole * 1.15, y, 0.5, 0.9), r.color ?? CYCLE[i % CYCLE.length]))
    maxCount = Math.max(maxCount, Math.ceil(r.count))
  })
  const right = maxCount * 1.15
  if (o.key) items.push(txt(0, -0.9, o.key, 'md', 'muted', 'start'))
  return { dim: 2, axes: false, ...fit([[-3.2, o.key ? -1.3 : -0.2], [right, (n - 1) * rowGap + 1]], 0.4), items }
}

/* -------------------------------------------------------- grids and shapes */

/** A `cols` by `rows` grid of unit squares for counting area, with the first
 *  `shade` squares coloured (row by row from the bottom left). `dims` writes
 *  the side lengths along the bottom and left. */
export function gridRect(o: { cols: number; rows: number; shade?: number; dims?: [string, string]; color?: FigColor }): Piece {
  const items: FigItem[] = []
  let count = 0
  for (let r = 0; r < o.rows; r++) {
    for (let c = 0; c < o.cols; c++) {
      const cell = rectPts(c, r, 1, 1)
      items.push(count < (o.shade ?? 0) ? solid(cell, o.color ?? 'a') : outline(cell))
      count++
    }
  }
  if (o.dims) {
    items.push(txt(o.cols / 2, -0.7, o.dims[0], 'md'))
    items.push(txt(-0.5, o.rows / 2, o.dims[1], 'md', 'muted', 'end'))
  }
  return { dim: 2, axes: false, ...fit([[o.dims ? -2 : 0, o.dims ? -1.2 : 0], [o.cols, o.rows]], 0.5), items }
}

/** A polygon with its corners named and, optionally, its sides measured.
 *  `sides[i]` labels the side from `pts[i]` to `pts[i+1]`; `rights` lists the
 *  corners that get a square right-angle mark. Corners are given anticlockwise. */
export function shape(o: {
  pts: Pt[]
  names?: string
  sides?: (string | undefined)[]
  rights?: number[]
  color?: FigColor
  look?: 'solid' | 'outline' | undefined
  extra?: FigItem[]
  pad?: number
}): Piece {
  const n = o.pts.length
  const cx = o.pts.reduce((s, p) => s + p[0], 0) / n
  const cy = o.pts.reduce((s, p) => s + p[1], 0) / n
  const items: FigItem[] = [{ t: 'poly', pts: o.pts, color: o.color ?? 'a', look: o.look }]
  const out = (p: Pt, d: number): Pt => {
    const dx = p[0] - cx
    const dy = p[1] - cy
    const len = Math.hypot(dx, dy) || 1
    return [tidy(p[0] + (dx / len) * d), tidy(p[1] + (dy / len) * d)]
  }
  for (const i of o.rights ?? []) {
    items.push({ t: 'right', at: o.pts[i], from: o.pts[(i + n - 1) % n], to: o.pts[(i + 1) % n] })
  }
  if (o.names) {
    for (let i = 0; i < n; i++) {
      const q = out(o.pts[i], 0.55)
      items.push(txt(q[0], q[1], o.names[i] ?? '', 'lg', 'result'))
    }
  }
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  ;(o.sides ?? []).forEach((s, i) => {
    if (!s) return
    const m = mid(o.pts[i], o.pts[(i + 1) % n])
    const q = out(m, 0.5)
    items.push(txt(q[0], q[1], s, 'md', 'muted'))
  })
  items.push(...(o.extra ?? []))
  const all: Pt[] = [...o.pts, ...(o.extra ?? []).flatMap((e) => (e.t === 'text' ? [e.at as Pt] : []))]
  return { dim: 2, axes: false, ...fit(all, o.pad ?? 1.2), items }
}

/* --------------------------------------------------------------- 3-D solids */


/* The corner view every 3-D piece is drawn from (azimuth 38, elevation 22), as
 * the two screen axes. Used to centre a solid in its frame and to size the
 * frame so nothing is cut off. */
const AZ = rad(38)
const EL = rad(22)
const RIGHT: Pt3 = [-Math.sin(AZ), Math.cos(AZ), 0]
const UP: Pt3 = [-Math.cos(AZ) * Math.sin(EL), -Math.sin(AZ) * Math.sin(EL), Math.cos(EL)]
const dot3 = (a: Pt3, b: Pt3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/** How far to shift `corners` so their drawing is centred, and the `range` that fits it. */
export function frame3(corners: Pt3[]): { shift: Pt3; range: number } {
  const us = corners.map((c) => dot3(c, RIGHT))
  const ws = corners.map((c) => dot3(c, UP))
  const cu = (Math.max(...us) + Math.min(...us)) / 2
  const cw = (Math.max(...ws) + Math.min(...ws)) / 2
  const half = Math.max((Math.max(...us) - Math.min(...us)) / 2, (Math.max(...ws) - Math.min(...ws)) / 2)
  return {
    shift: [-(cu * RIGHT[0] + cw * UP[0]), -(cu * RIGHT[1] + cw * UP[1]), -(cu * RIGHT[2] + cw * UP[2])].map(tidy) as Pt3,
    range: tidy(half * 1.2),
  }
}

export const line3 = (a: Pt3, b: Pt3): FigItem => ({ t: 'seg', from: a, to: b, color: 'muted', width: 1 })

/** A box `l` long (x), `w` wide (y) and `h` high (z), drawn from the usual
 *  corner view with its three visible faces tinted. `grid` draws the unit
 *  squares on those faces, so unit cubes can be counted; `labels` writes a
 *  length beside each of the three visible edges. */
export function cuboid3d(o: { l: number; w: number; h: number; grid?: boolean; labels?: { l?: string; w?: string; h?: string } }): Piece3 {
  const { l, w, h } = o
  const x = l / 2
  const y = w / 2
  const z = h / 2
  const cs: Pt3[] = [-x, x].flatMap((a) => [-y, y].flatMap((b) => [-z, z].map((c) => [a, b, c] as Pt3)))
  const { shift, range } = frame3(cs)
  const S = (p: Pt3): Pt3 => [tidy(p[0] + shift[0]), tidy(p[1] + shift[1]), tidy(p[2] + shift[2])]
  const items: FigItem[] = []
  items.push({ t: 'poly', pts: [S([x, -y, -z]), S([x, y, -z]), S([x, y, z]), S([x, -y, z])], color: 'a' })
  items.push({ t: 'poly', pts: [S([-x, y, -z]), S([x, y, -z]), S([x, y, z]), S([-x, y, z])], color: 'b' })
  items.push({ t: 'poly', pts: [S([-x, -y, z]), S([x, -y, z]), S([x, y, z]), S([-x, y, z])], color: 'c' })
  if (o.grid) {
    for (let i = 1; i < l; i++) items.push(line3(S([-x + i, y, -z]), S([-x + i, y, z])), line3(S([-x + i, -y, z]), S([-x + i, y, z])))
    for (let j = 1; j < w; j++) items.push(line3(S([x, -y + j, -z]), S([x, -y + j, z])), line3(S([-x, -y + j, z]), S([x, -y + j, z])))
    for (let k = 1; k < h; k++) items.push(line3(S([x, -y, -z + k]), S([x, y, -z + k])), line3(S([-x, y, -z + k]), S([x, y, -z + k])))
  }
  for (const p of cs) {
    for (const q of cs) {
      const diff = [p[0] !== q[0], p[1] !== q[1], p[2] !== q[2]].filter(Boolean).length
      if (diff === 1 && p[0] + p[1] + p[2] < q[0] + q[1] + q[2]) items.push({ t: 'seg', from: S(p), to: S(q), color: 'muted', width: 2 })
    }
  }
  const gap = 0.6
  if (o.labels?.l) items.push({ t: 'text', at: S([0, y + gap, -z - gap]), text: o.labels.l, color: 'result', size: 'lg' })
  if (o.labels?.w) items.push({ t: 'text', at: S([x + gap, 0, -z - gap]), text: o.labels.w, color: 'result', size: 'lg' })
  if (o.labels?.h) items.push({ t: 'text', at: S([x + gap, y + gap, 0]), text: o.labels.h, color: 'result', size: 'lg' })
  return { dim: 3, axes: false, range, view: [38, 22], items }
}

/** Unit cubes stacked on a grid: `heights[row][col]` is how many cubes stand on
 *  that square (row 0 is the back-left edge of the drawing, column 0 the
 *  front-left). Drawn from the corner view with the top, left and right faces
 *  tinted differently so every cube can be counted. */
export function cubeStack3d(heights: number[][]): Piece3 {
  const R = heights.length
  const C = Math.max(...heights.map((r) => r.length))
  const maxH = Math.max(1, ...heights.flat())
  const at = (i: number, j: number) => heights[i]?.[j] ?? 0
  const box: Pt3[] = [0, C].flatMap((a) => [0, R].flatMap((b) => [0, maxH].map((c) => [a, b, c] as Pt3)))
  const { shift, range } = frame3(box)
  const P = (x: number, y: number, z: number): Pt3 => [tidy(x + shift[0]), tidy(y + shift[1]), tidy(z + shift[2])]
  const items: FigItem[] = []
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      const h = at(i, j)
      for (let k = 0; k < h; k++) {
        if (k === h - 1) items.push({ t: 'poly', pts: [P(j, i, k + 1), P(j + 1, i, k + 1), P(j + 1, i + 1, k + 1), P(j, i + 1, k + 1)], color: 'c', look: 'solid' })
        if (at(i, j + 1) <= k) items.push({ t: 'poly', pts: [P(j + 1, i, k), P(j + 1, i + 1, k), P(j + 1, i + 1, k + 1), P(j + 1, i, k + 1)], color: 'a', look: 'solid' })
        if (at(i + 1, j) <= k) items.push({ t: 'poly', pts: [P(j, i + 1, k), P(j + 1, i + 1, k), P(j + 1, i + 1, k + 1), P(j, i + 1, k + 1)], color: 'b', look: 'solid' })
      }
    }
  }
  return { dim: 3, axes: false, range, view: [38, 22], items }
}

/** The three plane views of the same stack, as three separate pieces:
 *  `front` is what you see looking at the left face of `cubeStack3d`'s drawing
 *  (columns left to right are the rows `heights[0]`, `heights[1]`, …), `side`
 *  is the right face (columns run from the last grid column back to the
 *  first), and `top` is the footprint, with the number of cubes written in
 *  each square when `numbers` is on. */
export function viewsOf(heights: number[][], o: { numbers?: boolean } = {}): { front: Piece; side: Piece; top: Piece } {
  const R = heights.length
  const C = Math.max(...heights.map((r) => r.length))
  const at = (i: number, j: number) => heights[i]?.[j] ?? 0
  const maxH = Math.max(1, ...heights.flat())
  const profile = (cols: number, heightOf: (c: number) => number): Piece => {
    const items: FigItem[] = []
    for (let c = 0; c < cols; c++) {
      for (let k = 0; k < maxH; k++) {
        const cell = rectPts(c, k, 1, 1)
        items.push(k < heightOf(c) ? solid(cell, 'a') : outline(cell, 'muted'))
      }
    }
    return { dim: 2, axes: false, ...fit([[0, 0], [cols, maxH]], 0.5), items }
  }
  const front = profile(R, (c) => Math.max(0, ...Array.from({ length: C }, (_, j) => at(c, j))))
  const side = profile(C, (c) => Math.max(0, ...Array.from({ length: R }, (_, i) => at(i, C - 1 - c))))
  const items: FigItem[] = []
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      const cell = rectPts(j, i, 1, 1)
      items.push(at(i, j) > 0 ? solid(cell, 'c') : outline(cell, 'muted'))
      if (o.numbers && at(i, j) > 0) items.push(txt(j + 0.5, i + 0.5, String(at(i, j)), 'lg', 'muted'))
    }
  }
  const top: Piece = { dim: 2, axes: false, ...fit([[0, 0], [C, R]], 0.5), items }
  return { front, side, top }
}

/** A protractor with a base ray along 0 degrees and a second ray at `deg`.
 *  Both scales are drawn (0 to 180 left to right, and 180 to 0), so reading
 *  the right one is part of the exercise. `hideValue` leaves the reading blank
 *  when the angle itself is the question. */
export function protractor(o: { deg: number; label?: string }): Piece {
  const R = 5
  const items: FigItem[] = [outline([...ellipsePts(0, 0, R, R, 0, 180, 90), [-R, 0]], 'muted'), line([-R - 0.4, 0], [R + 0.4, 0], 'muted', { width: 2 })]
  for (let d = 0; d <= 180; d += 10) {
    const a = rad(d)
    const long = d % 30 === 0
    items.push(line([(R - (long ? 0.55 : 0.3)) * Math.cos(a), (R - (long ? 0.55 : 0.3)) * Math.sin(a)], [R * Math.cos(a), R * Math.sin(a)], 'muted', { width: long ? 2 : 1 }))
    if (long) {
      items.push(txt((R - 0.95) * Math.cos(a), (R - 0.95) * Math.sin(a), String(d), 'sm', 'muted'))
      items.push(txt((R - 1.55) * Math.cos(a), (R - 1.55) * Math.sin(a), String(180 - d), 'sm', 'b'))
    }
  }
  const a = rad(o.deg)
  items.push(line([0, 0], [(R + 0.8) * Math.cos(a), (R + 0.8) * Math.sin(a)], 'a', { width: 3.5 }))
  items.push({ t: 'dot', x: 0, y: 0, color: 'a' })
  if (o.label) items.push(txt(1.6 * Math.cos(a / 2), 1.6 * Math.sin(a / 2), o.label, 'lg', 'result'))
  return { dim: 2, axes: false, ...fit([[-R - 0.5, -0.5], [R + 0.5, R + 1]], 0.4), items }
}
