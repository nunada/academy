/** A Desmos-lite graphing board: type y = f(x), see it plotted, drag to
 *  pan, scroll to zoom. Built entirely on what already exists — `FigureView`
 *  redraws from fresh `items`/`xSpan`/`ySpan` every render, and `evaluateAt`
 *  never throws — so this file owns only the things neither of those already
 *  do: the function list, and turning pointer/wheel gestures into a viewport.
 *
 *  `Figure.tsx` keeps its own SVG size (460) and padding (26) private; both
 *  are duplicated here since the pan/zoom math has to agree with them.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { FigureView } from './Figure'
import type { FigColor, FigItem } from '../lib/figure'
import { evaluateAt } from '../lib/expr'
import { useI18n } from '../i18n'

const SIZE = 460
const PAD = 26
const COLORS: FigColor[] = ['a', 'b', 'c', 'result', 'muted']
const MAX_ROWS = 6
const DEFAULT_SPAN: [number, number] = [-10, 10]
const STORE_KEY = 'nunada.playground.graph.v1'

interface Row {
  id: string
  expr: string
  color: FigColor
  on: boolean
}

interface Saved {
  rows: { expr: string; color: FigColor; on: boolean }[]
  xSpan: [number, number]
  ySpan: [number, number]
}

let nextId = 1
const freshId = () => String(nextId++)

function load(): Saved | null {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as Saved) : null
  } catch {
    return null
  }
}

export function GraphBoard() {
  const { tc } = useI18n()
  const saved = useMemo(load, [])

  const [rows, setRows] = useState<Row[]>(
    () => saved?.rows.map((r) => ({ ...r, id: freshId() })) ?? [{ id: freshId(), expr: 'x^2', color: 'a', on: true }],
  )
  const [xSpan, setXSpan] = useState<[number, number]>(saved?.xSpan ?? DEFAULT_SPAN)
  const [ySpan, setYSpan] = useState<[number, number]>(saved?.ySpan ?? DEFAULT_SPAN)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const toSave: Saved = { rows: rows.map(({ expr, color, on }) => ({ expr, color, on })), xSpan, ySpan }
      localStorage.setItem(STORE_KEY, JSON.stringify(toSave))
    } catch {
      // A full or blocked store is not a reason to stop working.
    }
  }, [rows, xSpan, ySpan])

  const mountRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; xSpan: [number, number]; ySpan: [number, number] } | null>(null)

  const kx = (SIZE - 2 * PAD) / (xSpan[1] - xSpan[0])
  const ky = (SIZE - 2 * PAD) / (ySpan[1] - ySpan[0])

  function toDataDelta(dxPx: number, dyPx: number): [number, number] {
    const box = mountRef.current?.getBoundingClientRect()
    const k = box && box.width > 0 ? SIZE / box.width : 1
    return [(dxPx * k) / kx, (dyPx * k) / ky]
  }

  function pointerToData(clientX: number, clientY: number): [number, number] {
    const box = mountRef.current?.getBoundingClientRect()
    if (!box || box.width === 0) return [0, 0]
    const k = SIZE / box.width
    const sx = (clientX - box.left) * k
    const sy = (clientY - box.top) * k
    return [xSpan[0] + (sx - PAD) / kx, ySpan[0] + (SIZE - PAD - sy) / ky]
  }

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, xSpan, ySpan }
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current
    if (d) {
      const [dx, dy] = toDataDelta(e.clientX - d.x, e.clientY - d.y)
      setXSpan([d.xSpan[0] - dx, d.xSpan[1] - dx])
      setYSpan([d.ySpan[0] + dy, d.ySpan[1] + dy])
    } else {
      const [x] = pointerToData(e.clientX, e.clientY)
      setHoverX(x)
    }
  }

  function endDrag() {
    drag.current = null
  }

  // A non-passive listener, so zooming the board doesn't also scroll the page.
  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const box = el.getBoundingClientRect()
      if (box.width === 0) return
      const k = SIZE / box.width
      const sx = (e.clientX - box.left) * k
      const sy = (e.clientY - box.top) * k
      const x0 = xSpan[0] + (sx - PAD) / kx
      const y0 = ySpan[0] + (SIZE - PAD - sy) / ky
      const factor = e.deltaY > 0 ? 1 / 0.9 : 0.9
      const width = (xSpan[1] - xSpan[0]) * factor
      const height = (ySpan[1] - ySpan[0]) * factor
      if (width < 0.5 || width > 2000 || height < 0.5 || height > 2000) return
      setXSpan([x0 - (x0 - xSpan[0]) * factor, x0 + (xSpan[1] - x0) * factor])
      setYSpan([y0 - (y0 - ySpan[0]) * factor, y0 + (ySpan[1] - y0) * factor])
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [xSpan, ySpan, kx, ky])

  const resetView = () => {
    setXSpan(DEFAULT_SPAN)
    setYSpan(DEFAULT_SPAN)
  }

  const addRow = () => {
    if (rows.length >= MAX_ROWS) return
    setRows((rs) => [...rs, { id: freshId(), expr: '', color: COLORS[rs.length % COLORS.length], on: true }])
  }
  const removeRow = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id))
  const setExpr = (id: string, expr: string) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, expr } : r)))

  const items: FigItem[] = []
  const midX = (xSpan[0] + xSpan[1]) / 2
  const invalid = new Set<string>()
  for (const row of rows) {
    if (!row.on || row.expr.trim() === '') continue
    items.push({ t: 'curve', f: row.expr, color: row.color })
    if (!Number.isFinite(evaluateAt(row.expr, { x: midX }))) invalid.add(row.id)
    if (hoverX !== null) {
      const y = evaluateAt(row.expr, { x: hoverX })
      if (Number.isFinite(y)) items.push({ t: 'dot', x: hoverX, y, color: row.color })
    }
  }

  const figure = { dim: 2 as const, xSpan, ySpan, ticks: true, items }

  return (
    <div className="card graphboard">
      <div
        ref={mountRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => setHoverX(null)}
        style={{ cursor: 'grab', touchAction: 'none' }}
      >
        <FigureView figure={figure} />
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn ghost sm" onClick={resetView}>
          {tc({ en: 'Reset view', id: 'Setel ulang tampilan' })}
        </button>
        <span className="small muted">
          {tc({ en: 'Drag to pan. Scroll to zoom.', id: 'Seret untuk menggeser. Gulir untuk memperbesar.' })}
        </span>
      </div>

      <div className="graphrows">
        {rows.map((row) => (
          <div className="graphrow" key={row.id}>
            <span className="graphswatch" style={{ background: `var(--fig-${row.color})` }} />
            <input
              className="graphinput"
              type="text"
              value={row.expr}
              placeholder="sin(x)"
              spellCheck={false}
              onChange={(e) => setExpr(row.id, e.target.value)}
              onFocus={() => setFocusedId(row.id)}
              onBlur={() => setFocusedId((id) => (id === row.id ? null : id))}
            />
            <button className="btn ghost sm" onClick={() => removeRow(row.id)} aria-label={tc({ en: 'Remove', id: 'Hapus' })}>
              ✕
            </button>
            {invalid.has(row.id) && focusedId !== row.id && (
              <span className="small muted">{tc({ en: 'Check this expression.', id: 'Periksa ekspresi ini.' })}</span>
            )}
          </div>
        ))}
      </div>

      <button className="btn ghost sm" onClick={addRow} disabled={rows.length >= MAX_ROWS}>
        + {tc({ en: 'Add function', id: 'Tambah fungsi' })}
      </button>
    </div>
  )
}
