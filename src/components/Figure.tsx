/** Drawing a `Figure`.
 *
 *  One renderer for both dimensions, because they differ in exactly one place:
 *  how a vector becomes a pair of screen coordinates. Everything after that —
 *  arrowheads, arcs, shaded parallelograms, labels, the numbers underneath —
 *  is the same code working on points it has already been handed.
 *
 *  Interactivity is deliberately narrow. In the plane you drag the head of a
 *  vector, because the question a plane figure asks is "what happens to the
 *  sum when I move this". In space you turn the scene, because the question a
 *  space figure asks is "where is this actually pointing" — and dragging a
 *  head in a flat projection of space is a guess about depth, not an answer.
 */

import { useId, useMemo, useRef, useState } from 'react'
import {
  camera,
  resolve,
  resolveNum,
  show,
  sub,
  unit as unitOf,
  type FigColor,
  type FigItem,
  type Figure,
  type Vec,
  type VecRef,
} from '../lib/figure'
import { evaluateAt } from '../lib/expr'
import { useI18n } from '../i18n'
import { Rich } from './ui'

type P = [number, number]

const SIZE = 460
const PAD = 26

const stroke = (c: FigColor = 'a') => `var(--fig-${c})`

/** Where a label sits relative to the point it names: a little way out along
 *  the direction it came in on, so two arrows from the origin do not collide. */
function labelAt(from: P, to: P, gap = 13): P {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const d = Math.hypot(dx, dy) || 1
  return [to[0] + (dx / d) * gap, to[1] + (dy / d) * gap]
}

/** Beside the middle of a segment rather than past its end. An arrow that
 *  starts somewhere other than the origin usually ends on a named point, and
 *  a label past its head lands on that point's own name. */
function labelBeside(from: P, to: P, gap = 14): P {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const d = Math.hypot(dx, dy) || 1
  return [(from[0] + to[0]) / 2 - (dy / d) * gap, (from[1] + to[1]) / 2 + (dx / d) * gap]
}

/** A figure label, set the way mathematics is written: a variable is italic,
 *  everything that is not a variable is upright.
 *
 *  The rule is the ordinary one. A single letter is a variable (`x`, `a`,
 *  `θ`). A run of capitals is a name made of points, so still variables
 *  (`AB`, `PQR`). A lower-case run of two letters or more is a function name
 *  or an ordinary word (`sin`, `ln`, `proj`, `puncak`) and stays upright — as
 *  do digits, operators and brackets. So `tan x` gets exactly one italic
 *  letter, which is the whole point of doing this at all. */
function LabelText({ text }: { text: string }) {
  const parts: { s: string; italic: boolean }[] = []
  const letters = /[A-Za-z]+|[Ͱ-Ͽ]/g
  let last = 0
  for (let m = letters.exec(text); m; m = letters.exec(text)) {
    if (m.index > last) parts.push({ s: text.slice(last, m.index), italic: false })
    const word = m[0]
    const greek = /^[Ͱ-Ͽ]$/.test(word)
    parts.push({ s: word, italic: greek || word.length === 1 || word === word.toUpperCase() })
    last = m.index + word.length
  }
  if (last < text.length) parts.push({ s: text.slice(last), italic: false })

  return (
    <>
      {parts.map((p, i) =>
        p.italic ? (
          <tspan className="var" key={i}>
            {p.s}
          </tspan>
        ) : (
          <tspan key={i}>{p.s}</tspan>
        ),
      )}
    </>
  )
}

function Arrow({ from, to, color, dashed }: { from: P; to: P; color?: FigColor; dashed?: boolean }) {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const d = Math.hypot(dx, dy)
  if (d < 1) return null
  const ux = dx / d
  const uy = dy / d
  const head = Math.min(11, d * 0.4)
  const bx = to[0] - ux * head
  const by = to[1] - uy * head
  const wing = head * 0.42
  return (
    <g stroke={stroke(color)} fill={stroke(color)}>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={bx}
        y2={by}
        strokeWidth={2}
        strokeDasharray={dashed ? '5 4' : undefined}
        strokeLinecap="round"
      />
      <polygon
        points={`${to[0]},${to[1]} ${bx - uy * wing},${by + ux * wing} ${bx + uy * wing},${by - ux * wing}`}
        stroke="none"
      />
    </g>
  )
}

/** An arc from one direction to another, sampled in the figure's own space so
 *  that the same code draws it in the plane and in a projection of space. */
function arcPoints(u: Vec, v: Vec, radius: number, dim: number): Vec[] {
  const a = unitOf(u)
  const b = unitOf(v)
  const steps = 18
  const out: Vec[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // Straight interpolation, then re-normalised: near enough to a great-circle
    // arc at these radii, and it never blows up when the two are opposite.
    const mixed = a.map((x, k) => x * (1 - t) + (b[k] ?? 0) * t)
    const n = Math.hypot(...mixed) || 1
    out.push(mixed.map((x) => (x / n) * radius).slice(0, dim))
  }
  return out
}

/** A grid step that lands on round numbers and gives roughly eight lines. */
function niceStep(span: number): number {
  const rough = span / 8
  const mag = Math.pow(10, Math.floor(Math.log10(rough)))
  for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= rough) return m * mag
  return 10 * mag
}

/** Round off the floating-point dust a step of 0.1 leaves on a tick label. */
const tickText = (v: number, step: number): string => {
  const dp = Math.max(0, -Math.floor(Math.log10(step)))
  return v.toFixed(dp)
}

export function FigureView({ figure }: { figure: Figure }) {
  const { tc } = useI18n()
  const dim = figure.dim
  const range = figure.range ?? 5
  const [vars, setVars] = useState<Record<string, Vec>>(() => ({ ...(figure.vars ?? {}) }))
  const [params, setParams] = useState<Record<string, number>>(() =>
    Object.fromEntries((figure.params ?? []).map((p) => [p.name, p.value])),
  )
  const [view, setView] = useState<[number, number]>(() => figure.view ?? [38, 22])
  const svgRef = useRef<SVGSVGElement>(null)
  // Curves are clipped to the grid rather than to the whole drawing, so a
  // steep one leaves through the frame instead of running past the ticks.
  const clipId = useId()
  const dragging = useRef<{ name: string } | { az: number; el: number; x: number; y: number } | null>(null)

  const scale = (SIZE / 2 - PAD) / range
  const cx = SIZE / 2
  const cy = SIZE / 2

  // A vector figure keeps one scale on both axes so a right angle looks like
  // one; a graph is free to stretch y, and usually has to.
  const xSpan: [number, number] = figure.xSpan ?? [-range, range]
  const ySpan: [number, number] = figure.ySpan ?? [-range, range]
  const kx = (SIZE - 2 * PAD) / (xSpan[1] - xSpan[0])
  const ky = (SIZE - 2 * PAD) / (ySpan[1] - ySpan[0])

  const cam = useMemo(() => camera(view[0], view[1]), [view])

  /** Graph units to screen pixels, whichever dimension we are in. */
  const px = useMemo(() => {
    return (v: Vec): P => {
      if (dim === 3) {
        const [u, w] = cam.to2d(v)
        return [cx + u * scale, cy - w * scale]
      }
      return [PAD + ((v[0] ?? 0) - xSpan[0]) * kx, SIZE - PAD - ((v[1] ?? 0) - ySpan[0]) * ky]
    }
  }, [dim, cam, scale, cx, cy, kx, ky, xSpan[0], ySpan[0]])

  /** A number an item gave as either a literal or an expression in the
   *  sliders. Everything a graph draws goes through here. */
  const num = (v: number | string): number =>
    typeof v === 'number' ? v : evaluateAt(v, params)

  const at = (ref: VecRef): Vec => resolve(ref, vars, dim)
  const depthOf = (v: Vec): number => (dim === 2 ? 0 : cam.depth(v))
  /** Where an item starts when it does not say — and the right length, so
   *  that a plane figure never accidentally does arithmetic in space. */
  const origin: Vec = useMemo(() => Array.from({ length: dim }, () => 0), [dim])

  const reset = () => {
    setVars({ ...(figure.vars ?? {}) })
    setParams(Object.fromEntries((figure.params ?? []).map((p) => [p.name, p.value])))
    setView(figure.view ?? [38, 22])
  }

  /* ------------------------------------------------------------- dragging */

  function pointerPos(e: React.PointerEvent): P {
    const box = svgRef.current?.getBoundingClientRect()
    if (!box) return [0, 0]
    // The SVG is drawn at SIZE and scaled by CSS, so undo that first.
    const k = SIZE / box.width
    return [(e.clientX - box.left) * k, (e.clientY - box.top) * k]
  }

  function startRotate(e: React.PointerEvent) {
    if (!figure.interactive || dim !== 3) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = { az: view[0], el: view[1], x: e.clientX, y: e.clientY }
  }

  function move(e: React.PointerEvent) {
    const d = dragging.current
    if (!d) return
    if ('name' in d) {
      const [sx, sy] = pointerPos(e)
      const snap = figure.snap ?? 0.5
      const raw: [number, number] = [xSpan[0] + (sx - PAD) / kx, ySpan[0] + (SIZE - PAD - sy) / ky]
      const next = raw.map((v, i) => {
        const [lo, hi] = i === 0 ? xSpan : ySpan
        const clamped = Math.max(lo, Math.min(hi, v))
        return snap > 0 ? Math.round(clamped / snap) * snap : clamped
      })
      setVars((prev) => ({ ...prev, [d.name]: next }))
    } else {
      setView([d.az - (e.clientX - d.x) * 0.5, Math.max(-85, Math.min(85, d.el + (e.clientY - d.y) * 0.5))])
    }
  }

  const end = () => {
    dragging.current = null
  }

  /* -------------------------------------------------------------- drawing */

  const axes: React.ReactNode[] = []
  if (dim === 2) {
    const stepX = niceStep(xSpan[1] - xSpan[0])
    const stepY = niceStep(ySpan[1] - ySpan[0])
    // Where the axes actually sit: on the origin when it is in view, and
    // otherwise pinned to the edge, so a graph of e^x still has an x axis.
    const axisY = Math.max(PAD, Math.min(SIZE - PAD, px([0, 0])[1]))
    const axisX = Math.max(PAD, Math.min(SIZE - PAD, px([0, 0])[0]))

    for (let v = Math.ceil(xSpan[0] / stepX) * stepX; v <= xSpan[1] + 1e-9; v += stepX) {
      const x = px([v, 0])[0]
      axes.push(<line key={`gx${v}`} className="figgrid" x1={x} y1={PAD} x2={x} y2={SIZE - PAD} />)
      if (figure.ticks && Math.abs(v) > 1e-9) {
        axes.push(
          <text key={`tx${v}`} className="figtick" x={x} y={axisY + 15} textAnchor="middle">
            {tickText(v, stepX)}
          </text>,
        )
      }
    }
    for (let v = Math.ceil(ySpan[0] / stepY) * stepY; v <= ySpan[1] + 1e-9; v += stepY) {
      const y = px([0, v])[1]
      axes.push(<line key={`gy${v}`} className="figgrid" x1={PAD} y1={y} x2={SIZE - PAD} y2={y} />)
      if (figure.ticks && Math.abs(v) > 1e-9) {
        axes.push(
          <text key={`ty${v}`} className="figtick" x={axisX - 6} y={y + 4} textAnchor="end">
            {tickText(v, stepY)}
          </text>,
        )
      }
    }

    axes.push(<line key="ax" className="figaxis" x1={PAD} y1={axisY} x2={SIZE - PAD} y2={axisY} />)
    axes.push(<line key="ay" className="figaxis" x1={axisX} y1={PAD} x2={axisX} y2={SIZE - PAD} />)
    axes.push(
      <text key="lx" className="figaxislabel" x={SIZE - PAD + 2} y={axisY - 7} textAnchor="end">
        x
      </text>,
      <text key="ly" className="figaxislabel" x={axisX + 7} y={PAD - 6}>
        y
      </text>,
    )
  } else {
    const ends: [Vec, string][] = [
      [[range, 0, 0], 'x'],
      [[0, range, 0], 'y'],
      [[0, 0, range], 'z'],
    ]
    for (const [v, name] of ends) {
      const tip = px(v)
      const back = px(v.map((c) => -c))
      axes.push(<line key={`a${name}`} className="figaxis" x1={back[0]} y1={back[1]} x2={tip[0]} y2={tip[1]} />)
      axes.push(
        <text key={`t${name}`} className="figaxislabel" x={tip[0]} y={tip[1]} dx={5} dy={4}>
          {name}
        </text>,
      )
    }
  }

  /** Each item, with the depth it should be painted at. */
  const drawn = figure.items.map((item, i) => ({ i, item, z: itemDepth(item) }))
  if (dim === 3) drawn.sort((p, q) => p.z - q.z)

  function itemDepth(item: FigItem): number {
    switch (item.t) {
      case 'vec':
      case 'seg':
        return (depthOf(at(item.from ?? origin)) + depthOf(at(item.to))) / 2
      case 'point':
        return depthOf(at(item.at))
      case 'poly':
        return item.pts.reduce((s, p) => s + depthOf(at(p)), 0) / (item.pts.length || 1)
      case 'angle':
      case 'right':
        return depthOf(at(item.at ?? origin))
      case 'box':
        return -Infinity // edges belong behind whatever is inside the box
      default:
        return 0 // graph items are plane-only, so depth never comes up
    }
  }

  /** The graph of one expression, as a list of unbroken runs. A run ends
   *  where the function does — at a pole, at the edge of its domain, or where
   *  it leaves the picture — so an asymptote is a gap rather than a near
   *  vertical line joining +infinity to -infinity. */
  function sample(f: string, from: number, to: number): P[][] {
    const steps = 480
    const height = ySpan[1] - ySpan[0]
    const segments: P[][] = []
    let run: P[] = []
    let prev: number | null = null

    const flush = () => {
      if (run.length > 1) segments.push(run)
      run = []
    }

    for (let i = 0; i <= steps; i++) {
      const x = from + ((to - from) * i) / steps
      const y = evaluateAt(f, { ...params, x })
      if (!Number.isFinite(y)) {
        flush()
        prev = null
        continue
      }
      if (prev !== null && Math.abs(y - prev) > height * 1.5) flush()
      // Clamped, not dropped: a curve leaving the top should be drawn going
      // there, and only the part past the edge is thrown away.
      run.push(px([x, Math.max(ySpan[0] - height, Math.min(ySpan[1] + height, y))]))
      prev = y
    }
    flush()
    return segments
  }

  /** Every label the figure carries, gathered so they can be drawn last.
   *  A label placed at the tail of an arrow is otherwise painted over by the
   *  arrow itself, and in space by whatever turns out to be in front. */
  const labels: { p: P; text: string; color: string }[] = []
  /** Curves plotted together tend to leave the frame through the same corner,
   *  so each one's name is set a little further back along it than the last. */
  let curvesSoFar = 0
  const label = (p: P, text: string | undefined, color: string) => {
    if (text) labels.push({ p, text, color })
  }

  function render(item: FigItem, key: number): React.ReactNode {
    switch (item.t) {
      case 'vec': {
        const from = px(at(item.from ?? origin))
        const to = px(at(item.to))
        const handle = figure.interactive && dim === 2 && item.drag
        label(
          item.from === undefined
            ? // A draggable head wears a circle, so its label stands clear of it.
              labelAt(from, to, handle ? 23 : 15)
            : labelBeside(from, to),
          item.label,
          stroke(item.color),
        )
        return (
          <g key={key}>
            <Arrow from={from} to={to} color={item.color} dashed={item.dashed} />
            {handle && (
              <circle
                className="fighandle"
                cx={to[0]}
                cy={to[1]}
                r={11}
                stroke={stroke(item.color)}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId)
                  dragging.current = { name: item.drag as string }
                }}
              />
            )}
          </g>
        )
      }
      case 'seg': {
        const from = px(at(item.from))
        const to = px(at(item.to))
        label(labelBeside(from, to, 12), item.label, stroke(item.color ?? 'muted'))
        return (
          <line
            key={key}
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke={stroke(item.color ?? 'muted')}
            strokeWidth={1.6}
            strokeDasharray={item.dashed ? '5 4' : undefined}
          />
        )
      }
      case 'point': {
        const p = px(at(item.at))
        label([p[0] + 11, p[1] - 10], item.label, stroke(item.color ?? 'result'))
        return <circle key={key} cx={p[0]} cy={p[1]} r={4} fill={stroke(item.color ?? 'result')} />
      }
      case 'poly': {
        const pts = item.pts.map((p) => px(at(p)))
        label(
          [
            pts.reduce((s, p) => s + p[0], 0) / pts.length,
            pts.reduce((s, p) => s + p[1], 0) / pts.length,
          ],
          item.label,
          stroke(item.color ?? 'result'),
        )
        return (
          <polygon
            key={key}
            className="figface"
            points={pts.map((p) => `${p[0]},${p[1]}`).join(' ')}
            fill={stroke(item.color ?? 'result')}
            stroke={stroke(item.color ?? 'result')}
          />
        )
      }
      case 'angle': {
        const vertex = at(item.at ?? origin)
        const u = sub(at(item.from), vertex)
        const v = sub(at(item.to), vertex)
        const r = Math.min(1.1, range * 0.25)
        const pts = arcPoints(u, v, r, dim).map((p) => px(p.map((x, i) => x + (vertex[i] ?? 0))))
        if (pts.length === 0) return null
        const mid = pts[Math.floor(pts.length / 2)]
        label(labelAt(px(vertex), mid, 12), item.label, 'var(--fig-result)')
        return <polyline key={key} className="figarc" points={pts.map((p) => `${p[0]},${p[1]}`).join(' ')} />
      }
      case 'right': {
        const vertex = at(item.at ?? origin)
        const s = Math.min(0.5, range * 0.11)
        const u = unitOf(sub(at(item.from), vertex)).map((x) => x * s)
        const v = unitOf(sub(at(item.to), vertex)).map((x) => x * s)
        const corners = [
          vertex,
          vertex.map((x, i) => x + (u[i] ?? 0)),
          vertex.map((x, i) => x + (u[i] ?? 0) + (v[i] ?? 0)),
          vertex.map((x, i) => x + (v[i] ?? 0)),
        ]
        return (
          <polygon
            key={key}
            className="figright"
            points={corners.map((c) => px(c)).map((p) => `${p[0]},${p[1]}`).join(' ')}
          />
        )
      }
      case 'curve': {
        const from = item.from ?? xSpan[0]
        const to = item.to ?? xSpan[1]
        const runs = sample(item.f, from, to)
        const last = runs[runs.length - 1]
        if (last && item.label) {
          // Along the last run rather than at its very end, and a little
          // further back for each curve already named.
          const along = 0.84 - 0.16 * (curvesSoFar % 3)
          const p = last[Math.floor((last.length - 1) * along)]
          label([p[0] + 4, p[1] - 12], item.label, stroke(item.color))
        }
        curvesSoFar++
        return (
          <g key={key} clipPath={`url(#${clipId})`}>
            {runs.map((run, n) => (
              <polyline
                key={n}
                className="figcurve"
                points={run.map((p) => `${p[0]},${p[1]}`).join(' ')}
                stroke={stroke(item.color)}
                strokeDasharray={item.dashed ? '6 4' : undefined}
              />
            ))}
          </g>
        )
      }
      case 'hline': {
        const y = num(item.y)
        if (!Number.isFinite(y) || y < ySpan[0] || y > ySpan[1]) return null
        const p = px([0, y])[1]
        label([SIZE - PAD - 14, p - 8], item.label, stroke(item.color ?? 'muted'))
        return (
          <line
            key={key}
            className="figrule"
            clipPath={`url(#${clipId})`}
            x1={PAD}
            y1={p}
            x2={SIZE - PAD}
            y2={p}
            stroke={stroke(item.color ?? 'muted')}
            strokeDasharray={item.dashed === false ? undefined : '6 4'}
          />
        )
      }
      case 'vline': {
        const x = num(item.x)
        if (!Number.isFinite(x) || x < xSpan[0] || x > xSpan[1]) return null
        const p = px([x, 0])[0]
        label([p + 12, PAD + 14], item.label, stroke(item.color ?? 'muted'))
        return (
          <line
            key={key}
            className="figrule"
            clipPath={`url(#${clipId})`}
            x1={p}
            y1={PAD}
            x2={p}
            y2={SIZE - PAD}
            stroke={stroke(item.color ?? 'muted')}
            strokeDasharray={item.dashed === false ? undefined : '6 4'}
          />
        )
      }
      case 'dot': {
        const x = num(item.x)
        const y = num(item.y)
        if (!Number.isFinite(x) || !Number.isFinite(y)) return null
        const p = px([x, y])
        label([p[0] + 11, p[1] - 10], item.label, stroke(item.color ?? 'result'))
        return (
          <circle
            key={key}
            cx={p[0]}
            cy={p[1]}
            r={5}
            // A hollow dot is the notation for an endpoint that is not
            // included — the whole point of a piecewise definition.
            fill={item.open ? 'var(--surface-2)' : stroke(item.color ?? 'result')}
            stroke={stroke(item.color ?? 'result')}
            strokeWidth={2}
          />
        )
      }
      case 'box': {
        const a = at(item.a)
        const b = at(item.b)
        const c = at(item.c)
        const corner = (i: number, j: number, k: number): Vec =>
          [0, 1, 2].map((n) => i * (a[n] ?? 0) + j * (b[n] ?? 0) + k * (c[n] ?? 0))
        const edges: [Vec, Vec][] = []
        for (const [i, j, k] of [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [1, 1, 0],
          [1, 0, 1],
          [0, 1, 1],
        ] as [number, number, number][]) {
          for (const step of [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ] as [number, number, number][]) {
            const to: [number, number, number] = [i + step[0], j + step[1], k + step[2]]
            if (to[0] > 1 || to[1] > 1 || to[2] > 1) continue
            edges.push([corner(i, j, k), corner(...to)])
          }
        }
        return (
          <g key={key}>
            {edges.map(([p, q], n) => {
              const s = px(p)
              const t = px(q)
              return <line key={n} className="figedge" x1={s[0]} y1={s[1]} x2={t[0]} y2={t[1]} />
            })}
          </g>
        )
      }
    }
  }

  /** Keep a label inside the drawing rather than half off the edge. */
  function anchor(p: P): { x: number; y: number; textAnchor: 'start' | 'middle' | 'end' } {
    const near = 60
    return {
      x: Math.max(10, Math.min(SIZE - 10, p[0])),
      y: Math.max(14, Math.min(SIZE - 6, p[1])),
      textAnchor: p[0] < near ? 'start' : p[0] > SIZE - near ? 'end' : 'middle',
    }
  }

  const rotatable = Boolean(figure.interactive) && dim === 3
  const draggable =
    Boolean(figure.interactive) && dim === 2 && figure.items.some((i) => i.t === 'vec' && i.drag)
  const sliders = figure.params ?? []

  return (
    <figure className="fig">
      <svg
        ref={svgRef}
        className={rotatable ? 'figsvg grab' : 'figsvg'}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        // The drawing is square, so it is sized by its side rather than by a
        // height cap — a cap would letterbox it inside a much wider box.
        style={{ width: `min(100%, ${figure.height ?? 380}px)` }}
        role="img"
        aria-label={figure.caption ? tc(figure.caption) : undefined}
        onPointerDown={startRotate}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD} y={PAD} width={SIZE - 2 * PAD} height={SIZE - 2 * PAD} />
          </clipPath>
        </defs>
        {axes}
        {drawn.map(({ item, i }) => render(item, i))}
        {/* Labels last, so nothing is ever drawn over a name. */}
        {labels.map((l, i) => (
          <text className="figlabel" fill={l.color} key={`l${i}`} {...anchor(l.p)}>
            <LabelText text={l.text} />
          </text>
        ))}
      </svg>

      {sliders.length > 0 && (
        <div className="figsliders">
          {sliders.map((p) => (
            <label className="figslider" key={p.name}>
              <span>
                <i>{p.label ?? p.name}</i> = {show(params[p.name] ?? p.value, 2)}
              </span>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step ?? 0.1}
                value={params[p.name] ?? p.value}
                onChange={(e) => setParams((prev) => ({ ...prev, [p.name]: Number(e.target.value) }))}
              />
            </label>
          ))}
        </div>
      )}

      {figure.readouts && figure.readouts.length > 0 && (
        <div className="figreadout">
          {figure.readouts.map((r, i) => (
            <span key={i}>
              <i>{r.label}</i>
              {r.v !== undefined
                ? ` (${resolve(r.v, vars, dim).slice(0, dim).map((x) => show(x, r.dp ?? 2)).join(', ')})`
                : r.n !== undefined
                  ? ` ${show(resolveNum(r.n, vars, dim), r.dp ?? 2)}`
                  : ''}
            </span>
          ))}
        </div>
      )}

      <figcaption>
        {figure.caption && <Rich text={tc(figure.caption)} />}
        {(figure.interactive || sliders.length > 0) && (
          <>
            {' '}
            <span className="figtip">
              {tc(
                draggable
                  ? { en: 'Drag a circled head to move it.', id: 'Seret ujung berlingkaran untuk memindahkannya.' }
                  : rotatable
                    ? { en: 'Drag the drawing to turn it.', id: 'Seret gambarnya untuk memutar.' }
                    : { en: 'Move the sliders.', id: 'Geser penggesernya.' },
              )}
            </span>{' '}
            <button className="btn ghost sm" onClick={reset}>
              {tc({ en: 'Reset', id: 'Setel ulang' })}
            </button>
          </>
        )}
      </figcaption>
    </figure>
  )
}
