/** Drawing helpers for the junior-high course.
 *
 *  Everything the elementary course draws is re-exported from here, so a
 *  module imports one place. What is added are the pictures junior high needs
 *  and elementary school does not: round solids, nets, a relation drawn as
 *  arrows between two sets, pie and line charts, two parallel lines cut by a
 *  transversal, and the three squares of Pythagoras' theorem.
 *
 *  Plane helpers return `{ dim: 2, aspect, xSpan, ySpan, axes: false, items }`;
 *  solid helpers return a `dim: 3` piece. Spread them into `figure`.
 */

import type { FigColor, FigItem } from '../../lib/figure'
import { ellipsePts, fit, frame3, line, outline, rectPts, sectorPts, solid, txt } from '../tka-sd-matematika/figs'
import type { Piece, Piece3, Pt, Pt3 } from '../tka-sd-matematika/figs'

export * from '../tka-sd-matematika/figs'

const tidy = (n: number) => Number(n.toFixed(6))
const rad = (d: number) => (d * Math.PI) / 180
const CYCLE: FigColor[] = ['a', 'b', 'c', 'result']

/** A circle or an arc of one, as a plane curve. `from`/`to` are in degrees. */
export function arc(cx: number, cy: number, rx: number, ry: number, from = 0, to = 360, color: FigColor = 'a', dashed = false): FigItem {
  return { t: 'param', x: `${cx}+${rx}*cos(t)`, y: `${cy}+${ry}*sin(t)`, from: tidy(rad(from)), to: tidy(rad(to)), color, dashed }
}

/* ------------------------------------------------------------ round solids */

/** A can seen from slightly above. `labels.r` / `labels.h` write the radius and height. */
export function cylinder2d(o: { r: number; h: number; labels?: { r?: string; h?: string } }): Piece {
  const { r, h } = o
  const ry = r * 0.3
  const items: FigItem[] = [
    arc(0, h, r, ry, 0, 360, 'a'),
    arc(0, 0, r, ry, 180, 360, 'a'),
    arc(0, 0, r, ry, 0, 180, 'a', true),
    line([-r, 0], [-r, h], 'a', { width: 2.2 }),
    line([r, 0], [r, h], 'a', { width: 2.2 }),
  ]
  if (o.labels?.r) {
    items.push(line([0, h], [r, h], 'result', { dashed: true }))
    items.push(txt(r / 2, h + ry * 0.2 + 0.45, o.labels.r, 'md', 'result'))
  }
  if (o.labels?.h) {
    items.push(line([r, 0], [r, h], 'result', { dashed: true }))
    items.push(txt(r + 0.6, h / 2, o.labels.h, 'md', 'result', 'start'))
  }
  return { dim: 2, axes: false, ...fit([[-r, -ry], [r + 1.6, h + ry + 0.6]], 0.5), items }
}

/** A cone seen from slightly above; `labels` may name radius, height and slant height `s`. */
export function cone2d(o: { r: number; h: number; labels?: { r?: string; h?: string; s?: string } }): Piece {
  const { r, h } = o
  const ry = r * 0.3
  const items: FigItem[] = [
    arc(0, 0, r, ry, 180, 360, 'a'),
    arc(0, 0, r, ry, 0, 180, 'a', true),
    line([-r, 0], [0, h], 'a', { width: 2.2 }),
    line([r, 0], [0, h], 'a', { width: 2.2 }),
  ]
  if (o.labels?.h) {
    items.push(line([0, 0], [0, h], 'result', { dashed: true }))
    items.push(txt(0.25, h / 2, o.labels.h, 'md', 'result', 'start'))
  }
  if (o.labels?.r) {
    items.push(line([0, 0], [r, 0], 'result', { dashed: true }))
    items.push(txt(r / 2, -0.45, o.labels.r, 'md', 'result'))
  }
  if (o.labels?.s) items.push(txt(r / 2 + 0.55, h / 2 + 0.2, o.labels.s, 'md', 'result', 'start'))
  return { dim: 2, axes: false, ...fit([[-r, -ry - 0.5], [r + 1, h + 0.3]], 0.5), items }
}

/** A sphere: a circle and its equator, with an optional radius. */
export function sphere2d(o: { r: number; label?: string }): Piece {
  const { r } = o
  const items: FigItem[] = [arc(0, 0, r, r, 0, 360, 'a'), arc(0, 0, r, r * 0.3, 180, 360, 'a'), arc(0, 0, r, r * 0.3, 0, 180, 'a', true)]
  if (o.label) {
    items.push(line([0, 0], [r, 0], 'result', { dashed: true }))
    items.push({ t: 'dot', x: 0, y: 0, color: 'result' })
    items.push(txt(r / 2, 0.45, o.label, 'md', 'result'))
  }
  return { dim: 2, axes: false, ...fit([[-r, -r], [r, r]], 0.5), items }
}

/** A circle with optional radius, diameter and a shaded sector (`sector` in degrees, from 0). */
export function circle2d(o: { r: number; radius?: string; diameter?: string; sector?: number; color?: FigColor }): Piece {
  const { r } = o
  const items: FigItem[] = []
  if (o.sector) items.push(solid(sectorPts(0, 0, r, 0, o.sector), o.color ?? 'a'))
  items.push(outline(ellipsePts(0, 0, r, r), 'muted'))
  items.push({ t: 'dot', x: 0, y: 0, color: 'muted' })
  if (o.radius) {
    const a = rad(o.sector ? o.sector / 2 : 35)
    items.push(line([0, 0], [r * Math.cos(a), r * Math.sin(a)], 'result', { width: 2.4 }))
    items.push(txt(0.55 * r * Math.cos(a) - 0.25, 0.55 * r * Math.sin(a) + 0.35, o.radius, 'md', 'result'))
  }
  if (o.diameter) {
    items.push(line([-r, 0], [r, 0], 'b', { width: 2.4 }))
    items.push(txt(0, -0.45, o.diameter, 'md', 'b'))
  }
  return { dim: 2, axes: false, ...fit([[-r, -r], [r, r]], 0.5), items }
}

/** A prism (or, with `apex`, a pyramid) on the given base polygon (anticlockwise, in the
 *  xy-plane), `h` high, from the corner view. */
export function prism3d(o: { base: Pt[]; h: number; apex?: boolean; label?: string }): Piece3 {
  const n = o.base.length
  const cx = o.base.reduce((s, p) => s + p[0], 0) / n
  const cy = o.base.reduce((s, p) => s + p[1], 0) / n
  const b = o.base.map((p) => [p[0] - cx, p[1] - cy] as Pt)
  const z0 = -o.h / 2
  const z1 = o.h / 2
  const bottom0: Pt3[] = b.map((p) => [p[0], p[1], z0])
  const top0: Pt3[] = o.apex ? [[0, 0, z1]] : b.map((p) => [p[0], p[1], z1])
  const { shift, range } = frame3([...bottom0, ...top0])
  const S = (p: Pt3): Pt3 => [tidy(p[0] + shift[0]), tidy(p[1] + shift[1]), tidy(p[2] + shift[2])]
  const bottom = bottom0.map(S)
  const top = top0.map(S)
  const items: FigItem[] = [{ t: 'poly', pts: bottom, color: 'muted' }]
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    items.push({ t: 'poly', pts: o.apex ? [bottom[i], bottom[j], top[0]] : [bottom[i], bottom[j], top[j], top[i]], color: CYCLE[i % 3] })
  }
  if (!o.apex) items.push({ t: 'poly', pts: top, color: 'c' })
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    items.push({ t: 'seg', from: bottom[i], to: bottom[j], color: 'muted', width: 2 })
    if (o.apex) items.push({ t: 'seg', from: bottom[i], to: top[0], color: 'muted', width: 2 })
    else {
      items.push({ t: 'seg', from: top[i], to: top[j], color: 'muted', width: 2 })
      items.push({ t: 'seg', from: bottom[i], to: top[i], color: 'muted', width: 2 })
    }
  }
  if (o.label) items.push({ t: 'text', at: S([0, 0, z1 + 0.6]), text: o.label, color: 'result', size: 'lg' })
  return { dim: 3, axes: false, range, view: [38, 22], items }
}

/* ------------------------------------------------------------------- nets */

const label = (x: number, y: number, s: string) => txt(x, y, s, 'md', 'muted')

/** The cross-shaped net of a box `l` × `w` × `h`, every face named. */
export function boxNet(o: { l: number; w: number; h: number; names?: boolean }): Piece {
  const { l, w, h } = o
  const items: FigItem[] = []
  const face = (x: number, y: number, fw: number, fh: number, name: string, c: FigColor) => {
    items.push(solid(rectPts(x, y, fw, fh), c))
    if (o.names !== false) items.push(label(x + fw / 2, y + fh / 2, name))
  }
  face(h, 0, l, w, 'alas', 'a')
  face(h, w, l, h, 'depan', 'b')
  face(h, w + h, l, w, 'atas', 'a')
  face(h, 2 * w + h, l, h, 'belakang', 'b')
  face(0, w, h, h, 'kiri', 'c')
  face(h + l, w, h, h, 'kanan', 'c')
  return { dim: 2, axes: false, ...fit([[0, 0], [l + 2 * h, 2 * w + 2 * h]], 0.5), items }
}

/** The net of a square pyramid: a square and four triangles. */
export function pyramidNet(o: { side: number; slant: number }): Piece {
  const { side: a, slant: s } = o
  const items: FigItem[] = [solid(rectPts(0, 0, a, a), 'a')]
  items.push(solid([[0, a], [a, a], [a / 2, a + s]], 'b'))
  items.push(solid([[0, 0], [a, 0], [a / 2, -s]], 'b'))
  items.push(solid([[0, 0], [0, a], [-s, a / 2]], 'c'))
  items.push(solid([[a, 0], [a, a], [a + s, a / 2]], 'c'))
  return { dim: 2, axes: false, ...fit([[-s, -s], [a + s, a + s]], 0.5), items }
}

/** The net of a triangular prism: three rectangles in a row and two triangles. */
export function triPrismNet(o: { a: number; b: number; c: number; h: number }): Piece {
  const { a, b, c, h } = o
  const items: FigItem[] = [solid(rectPts(0, 0, a, h), 'a'), solid(rectPts(a, 0, b, h), 'b'), solid(rectPts(a + b, 0, c, h), 'a')]
  // Triangles hang from the middle rectangle, on its width `b`: the side next to
  // rectangle `a` has length `a`, the other has length `c`.
  const x = (a * a + b * b - c * c) / (2 * b)
  const y = Math.sqrt(Math.max(0, a * a - x * x))
  items.push(solid([[a, 0], [a + b, 0], [a + x, -y]], 'c'))
  items.push(solid([[a, h], [a + b, h], [a + x, h + y]], 'c'))
  return { dim: 2, axes: false, ...fit([[0, -y - 0.2], [a + b + c, h + y + 0.2]], 0.5), items }
}

/** The net of a cylinder: a rectangle (length 2πr, as `side`) with a circle at each end. */
export function cylinderNet(o: { r: number; h: number; width?: string; height?: string }): Piece {
  const { r, h } = o
  const w = 2 * Math.PI * r
  const items: FigItem[] = [solid(rectPts(0, 0, w, h), 'b')]
  items.push(solid(ellipsePts(w / 2, h + r, r, r), 'a'))
  items.push(solid(ellipsePts(w / 2, -r, r, r), 'a'))
  if (o.width) items.push(txt(w / 2, h / 2 + 0.1, o.width, 'md', 'muted'))
  if (o.height) items.push(txt(w + 0.3, h / 2, o.height, 'md', 'muted', 'start'))
  return { dim: 2, axes: false, ...fit([[0, -2 * r], [w + 1.5, h + 2 * r]], 0.5), items }
}

/** The net of a cone: a sector (slant height `s`, arc length 2πr) and a circle. */
export function coneNet(o: { r: number; s: number }): Piece {
  const { r, s } = o
  const sweep = (360 * r) / s
  const items: FigItem[] = [solid(sectorPts(0, 0, s, 90 - sweep / 2, 90 + sweep / 2), 'b')]
  items.push(solid(ellipsePts(0, -s - r * 0.2, r, r), 'a'))
  return { dim: 2, axes: false, ...fit([[-s, -s - 2.2 * r], [s, s]], 0.5), items }
}

/* ---------------------------------------------------------------- relations */

/** A relation drawn as arrows from a left set to a right set. `pairs` are
 *  `[leftIndex, rightIndex]`. */
export function arrowDiagram(o: { domain: string[]; codomain: string[]; pairs: [number, number][]; titles?: [string, string] }): Piece {
  const rows = Math.max(o.domain.length, o.codomain.length)
  const gap = 1.3
  const H = (rows - 1) * gap
  const items: FigItem[] = []
  const yOf = (n: number, count: number) => H / 2 + ((count - 1) / 2 - n) * gap
  items.push(outline(ellipsePts(0, H / 2, 1.3, H / 2 + 1), 'a'))
  items.push(outline(ellipsePts(6, H / 2, 1.3, H / 2 + 1), 'b'))
  o.domain.forEach((d, i) => items.push(txt(0, yOf(i, o.domain.length), d, 'lg', 'muted')))
  o.codomain.forEach((d, i) => items.push(txt(6, yOf(i, o.codomain.length), d, 'lg', 'muted')))
  for (const [i, j] of o.pairs) {
    items.push({ t: 'vec', from: [0.75, yOf(i, o.domain.length)], to: [5.25, yOf(j, o.codomain.length)], color: 'result' })
  }
  if (o.titles) {
    items.push(txt(0, H + 1.6, o.titles[0], 'md', 'a'))
    items.push(txt(6, H + 1.6, o.titles[1], 'md', 'b'))
  }
  return { dim: 2, axes: false, ...fit([[-1.4, -1.1], [7.4, H + (o.titles ? 2 : 1.1)]], 0.3), items }
}

/* ------------------------------------------------------------------- charts */

/** A pie chart. Each slice's label sits outside it with its value. Slices should sum to the whole. */
export function pieChart(o: { slices: { label: string; value: number; color?: FigColor }[]; unit?: string }): Piece {
  const R = 3
  const total = o.slices.reduce((s, x) => s + x.value, 0)
  const items: FigItem[] = []
  let a = 90
  o.slices.forEach((s, i) => {
    const sweep = (360 * s.value) / total
    const pts = o.slices.length === 1 ? ellipsePts(0, 0, R, R) : sectorPts(0, 0, R, a, a - sweep)
    items.push(solid(pts, s.color ?? CYCLE[i % CYCLE.length]))
    const mid = rad(a - sweep / 2)
    items.push(txt(1.28 * R * Math.cos(mid), 1.28 * R * Math.sin(mid), `${s.label} ${s.value}${o.unit ?? ''}`, 'md', 'muted'))
    a -= sweep
  })
  return { dim: 2, axes: false, ...fit([[-1.9 * R, -1.45 * R], [1.9 * R, 1.45 * R]], 0.2), items }
}

/** A line chart: points joined in order, with guide lines and the values written at the points. */
export function lineChart(o: { points: { label: string; value: number }[]; max: number; step: number; showValues?: boolean; title?: string; color?: FigColor }): Piece {
  const H = 6
  const k = H / o.max
  const dx = 1.6
  const xEnd = (o.points.length - 1) * dx + 1
  const items: FigItem[] = []
  for (let v = 0; v <= o.max + 1e-9; v += o.step) {
    if (v > 0) items.push(line([0, v * k], [xEnd + 0.5, v * k], 'muted', { dashed: true }))
    items.push(txt(-0.25, v * k, String(tidy(v)), 'sm', 'muted', 'end'))
  }
  const pts: Pt[] = o.points.map((p, i) => [0.8 + i * dx, p.value * k])
  for (let i = 0; i + 1 < pts.length; i++) items.push(line(pts[i], pts[i + 1], o.color ?? 'a', { width: 3 }))
  pts.forEach((p, i) => {
    items.push({ t: 'dot', x: p[0], y: p[1], color: o.color ?? 'a' })
    if (o.showValues !== false) items.push(txt(p[0], p[1] + 0.5, String(o.points[i].value), 'md', 'muted'))
    items.push(txt(p[0], -0.55, o.points[i].label, 'sm', 'muted'))
  })
  items.push(line([0, 0], [xEnd + 0.5, 0], 'muted', { width: 2.5 }), line([0, 0], [0, H + 0.2], 'muted', { width: 2.5 }))
  if (o.title) items.push(txt(0, H + 0.9, o.title, 'md', 'muted', 'start'))
  return { dim: 2, axes: false, ...fit([[-1.2, -1.1], [xEnd + 0.8, H + (o.title ? 1.3 : 0.6)]], 0.3), items }
}

/* ---------------------------------------------------------------- geometry */

/** Two parallel lines cut by a transversal at `deg` degrees to the lines. The eight
 *  angles are numbered 1–4 around the upper intersection (top-right, top-left,
 *  bottom-left, bottom-right) and 5–8 around the lower one in the same order.
 *  `labels[i]` writes a name or value inside angle i+1 (use `undefined` to skip). */
export function parallelLines(o: { deg: number; labels?: (string | undefined)[]; parallel?: boolean }): Piece {
  const th = rad(o.deg)
  const y1 = 1.4
  const y2 = -1.4
  const x1 = y1 / Math.tan(th)
  const x2 = y2 / Math.tan(th)
  const items: FigItem[] = [
    line([-5, y1], [5, y1], 'a', { width: 2.4 }),
    line([-5, y2], [5, y2], 'a', { width: 2.4 }),
    line([x2 - 2.2 * Math.cos(th), y2 - 2.2 * Math.sin(th)], [x1 + 2.2 * Math.cos(th), y1 + 2.2 * Math.sin(th)], 'b', { width: 2.4 }),
  ]
  const dirs = (vx: number, vy: number): [number, number][] => [
    [vx + 1, vy], // right
    [vx + Math.cos(th), vy + Math.sin(th)], // up the transversal
    [vx - 1, vy], // left
    [vx - Math.cos(th), vy - Math.sin(th)], // down the transversal
  ]
  const spots: [number, number][] = [[x1, y1], [x2, y2]]
  spots.forEach(([vx, vy], k) => {
    const d = dirs(vx, vy)
    // 1: right→up, 2: up→left, 3: left→down, 4: down→right
    const pairs: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0]]
    pairs.forEach(([p, q], n) => {
      // Only the angles that are named get an arc: four arcs round one point
      // would join up into a circle and mark nothing.
      const name = o.labels?.[k * 4 + n]
      if (name) items.push({ t: 'angle', at: [vx, vy], from: d[p], to: d[q], label: name })
    })
  })
  if (o.parallel !== false) {
    // The little arrowheads that say "these two lines are parallel".
    for (const y of [y1, y2]) {
      items.push({ t: 'seg', from: [-4.3, y + 0.28], to: [-3.95, y], color: 'a', width: 2 })
      items.push({ t: 'seg', from: [-4.3, y - 0.28], to: [-3.95, y], color: 'a', width: 2 })
    }
  }
  return { dim: 2, axes: false, ...fit([[-5, -3.6], [5, 3.6]], 0.2), items }
}

/** A right triangle with legs `a` (horizontal) and `b` (vertical) and a square on each of the three
 *  sides — the picture of Pythagoras' theorem. `names` writes a label in each square (leg a, leg b, hypotenuse). */
export function pythagorasSquares(o: { a: number; b: number; names?: [string, string, string]; side?: [string, string, string] }): Piece {
  const { a, b } = o
  const items: FigItem[] = [
    solid([[0, 0], [a, 0], [a, -a], [0, -a]], 'a'),
    solid([[0, 0], [0, b], [-b, b], [-b, 0]], 'b'),
    solid([[a, 0], [0, b], [b, b + a], [a + b, a]], 'c'),
    { t: 'poly', pts: [[0, 0], [a, 0], [0, b]], color: 'muted', look: 'outline' },
    { t: 'right', at: [0, 0], from: [a, 0], to: [0, b] },
  ]
  if (o.names) {
    items.push(txt(a / 2, -a / 2, o.names[0], 'lg', 'muted'))
    items.push(txt(-b / 2, b / 2, o.names[1], 'lg', 'muted'))
    items.push(txt((a + b) / 2, (a + b) / 2, o.names[2], 'lg', 'muted'))
  }
  if (o.side) {
    items.push(txt(a / 2, 0.45, o.side[0], 'md', 'result'))
    items.push(txt(-0.5, b / 2, o.side[1], 'md', 'result', 'end'))
  }
  return { dim: 2, axes: false, ...fit([[-b, -a], [a + b, a + b]], 0.5), items }
}
