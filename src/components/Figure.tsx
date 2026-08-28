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

import { useMemo, useRef, useState } from 'react'
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

export function FigureView({ figure }: { figure: Figure }) {
  const { tc } = useI18n()
  const dim = figure.dim
  const range = figure.range ?? 5
  const [vars, setVars] = useState<Record<string, Vec>>(() => ({ ...(figure.vars ?? {}) }))
  const [view, setView] = useState<[number, number]>(() => figure.view ?? [38, 22])
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef<{ name: string } | { az: number; el: number; x: number; y: number } | null>(null)

  const scale = (SIZE / 2 - PAD) / range
  const cx = SIZE / 2
  const cy = SIZE / 2

  const cam = useMemo(() => camera(view[0], view[1]), [view])

  /** Graph units to screen pixels, whichever dimension we are in. */
  const px = useMemo(() => {
    return (v: Vec): P => {
      const [x, y] = dim === 2 ? [v[0] ?? 0, v[1] ?? 0] : cam.to2d(v)
      return [cx + x * scale, cy - y * scale]
    }
  }, [dim, cam, scale, cx, cy])

  const at = (ref: VecRef): Vec => resolve(ref, vars, dim)
  const depthOf = (v: Vec): number => (dim === 2 ? 0 : cam.depth(v))
  /** Where an item starts when it does not say — and the right length, so
   *  that a plane figure never accidentally does arithmetic in space. */
  const origin: Vec = useMemo(() => Array.from({ length: dim }, () => 0), [dim])

  const reset = () => {
    setVars({ ...(figure.vars ?? {}) })
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
      const raw = [(sx - cx) / scale, (cy - sy) / scale]
      const next = raw.map((x) => {
        const clamped = Math.max(-range, Math.min(range, x))
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
    for (let i = -Math.floor(range); i <= Math.floor(range); i++) {
      axes.push(
        <line key={`gx${i}`} className="figgrid" x1={px([i, -range])[0]} y1={0} x2={px([i, -range])[0]} y2={SIZE} />,
      )
      axes.push(
        <line key={`gy${i}`} className="figgrid" x1={0} y1={px([0, i])[1]} x2={SIZE} y2={px([0, i])[1]} />,
      )
    }
    axes.push(<line key="ax" className="figaxis" x1={0} y1={cy} x2={SIZE} y2={cy} />)
    axes.push(<line key="ay" className="figaxis" x1={cx} y1={0} x2={cx} y2={SIZE} />)
    axes.push(
      <text key="lx" className="figaxislabel" x={SIZE - 10} y={cy - 7} textAnchor="end">
        x
      </text>,
      <text key="ly" className="figaxislabel" x={cx + 7} y={12}>
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
    }
  }

  /** Every label the figure carries, gathered so they can be drawn last.
   *  A label placed at the tail of an arrow is otherwise painted over by the
   *  arrow itself, and in space by whatever turns out to be in front. */
  const labels: { p: P; text: string; color: string }[] = []
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
  const draggable = Boolean(figure.interactive) && dim === 2

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
        {axes}
        {drawn.map(({ item, i }) => render(item, i))}
        {/* Labels last, so nothing is ever drawn over a name. */}
        {labels.map((l, i) => (
          <text className="figlabel" fill={l.color} key={`l${i}`} {...anchor(l.p)}>
            {l.text}
          </text>
        ))}
      </svg>

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
        {figure.interactive && (
          <>
            {' '}
            <span className="figtip">
              {tc(
                draggable
                  ? { en: 'Drag a circled head to move it.', id: 'Seret ujung berlingkaran untuk memindahkannya.' }
                  : { en: 'Drag the drawing to turn it.', id: 'Seret gambarnya untuk memutar.' },
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
