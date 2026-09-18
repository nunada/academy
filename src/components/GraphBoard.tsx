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
import { evaluateAt, MATH_FUNCS } from '../lib/expr'
import { freeVariables, substitute, traceImplicit } from '../lib/implicit'
import { toLatex } from '../lib/toLatex'
import { useI18n } from '../i18n'
import type { Loc } from '../content/types'
import { Tex } from './ui'

const SIZE = 460
const PAD = 26
const COLORS: FigColor[] = ['a', 'b', 'c', 'result', 'muted']
const MAX_ROWS = 6
const DEFAULT_SPAN: [number, number] = [-10, 10]
const STORE_KEY = 'nunada.playground.graph.v1'
const PARAM_DEFAULT = 1
const PARAM_RANGE: [number, number] = [-10, 10]
const KNOWN_FUNCS = new Set(Object.keys(MATH_FUNCS))
// Same short list MathBoard's own palette offers — the characters a keyboard
// makes awkward, not a second alphabet — plus quick trig buttons and `=`,
// since a row can be a plain function or an implicit equation like a circle.
const KEYS = ['x', '=', '√', 'π', '^', '/', '(', ')', 'sin(', 'cos(', 'tan(']

interface Template {
  id: string
  label: Loc
  rows: { expr: string; color: FigColor }[]
  params: Record<string, number>
}

/** The common parent-function families, each written with the letters a
 *  precalculus course already uses for them (`a`/`h`/`k` for a transformed
 *  shape, `m`/`b` for a line, `r` for a radius) — so a slider's name is
 *  never a surprise to anyone who has met the family before. Picking one
 *  replaces every row, the same way choosing a template does everywhere
 *  else in the Playground. */
const TEMPLATES: Template[] = [
  { id: 'line', label: { en: 'Line', id: 'Garis' }, rows: [{ expr: 'm*x+b', color: 'a' }], params: { m: 1, b: 0 } },
  {
    id: 'parabola',
    label: { en: 'Parabola', id: 'Parabola' },
    rows: [{ expr: 'a*(x-h)^2+k', color: 'a' }],
    params: { a: 1, h: 2, k: -3 },
  },
  {
    id: 'circle',
    label: { en: 'Circle', id: 'Lingkaran' },
    rows: [{ expr: '(x-a)^2+(y-b)^2=r^2', color: 'a' }],
    params: { a: 0, b: 0, r: 3 },
  },
  {
    id: 'ellipse',
    label: { en: 'Ellipse', id: 'Elips' },
    rows: [{ expr: '(x-h)^2/a^2+(y-k)^2/b^2=1', color: 'a' }],
    params: { a: 4, b: 2, h: 0, k: 0 },
  },
  {
    id: 'sine',
    label: { en: 'Sine wave', id: 'Gelombang sinus' },
    rows: [{ expr: 'a*sin(b*(x-h))+k', color: 'a' }],
    params: { a: 1, b: 1, h: 0, k: 0 },
  },
  {
    id: 'abs',
    label: { en: 'Absolute value', id: 'Nilai mutlak' },
    rows: [{ expr: 'a*abs(x-h)+k', color: 'a' }],
    params: { a: 1, h: 0, k: 0 },
  },
]

/** A row is an implicit equation the moment it has an `=` — everything
 *  before is `lhs`, everything after is `rhs`, and the curve drawn is
 *  wherever they're equal (see `traceImplicit`). No `=` at all means the
 *  ordinary `y = f(x)` a `curve` item already knows how to draw. */
function splitEquation(expr: string): { lhs: string; rhs: string } | null {
  const at = expr.indexOf('=')
  if (at < 0) return null
  return { lhs: expr.slice(0, at), rhs: expr.slice(at + 1) }
}

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
  params?: Record<string, number>
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
  const { t, tc } = useI18n()
  const saved = useMemo(load, [])

  const [rows, setRows] = useState<Row[]>(
    () => saved?.rows.map((r) => ({ ...r, id: freshId() })) ?? [{ id: freshId(), expr: 'x^2', color: 'a', on: true }],
  )
  const [xSpan, setXSpan] = useState<[number, number]>(saved?.xSpan ?? DEFAULT_SPAN)
  const [ySpan, setYSpan] = useState<[number, number]>(saved?.ySpan ?? DEFAULT_SPAN)
  const [paramValues, setParamValues] = useState<Record<string, number>>(saved?.params ?? {})
  const [hoverX, setHoverX] = useState<number | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  // Which row a keyboard-button press lands in. Unlike `focusedId` (used only
  // to hide the invalid-expression hint while typing), this must NOT clear on
  // blur — clicking a button steals focus from the input, so the last row the
  // learner was actually in has to be remembered rather than asked for.
  const [activeId, setActiveId] = useState<string | null>(null)
  const inputs = useRef<Record<string, HTMLInputElement | null>>({})
  const caret = useRef<{ id: string; at: number } | null>(null)

  useEffect(() => {
    const want = caret.current
    if (!want) return
    caret.current = null
    const el = inputs.current[want.id]
    if (!el) return
    el.focus()
    el.setSelectionRange(want.at, want.at)
  })

  useEffect(() => {
    try {
      const toSave: Saved = { rows: rows.map(({ expr, color, on }) => ({ expr, color, on })), xSpan, ySpan, params: paramValues }
      localStorage.setItem(STORE_KEY, JSON.stringify(toSave))
    } catch {
      // A full or blocked store is not a reason to stop working.
    }
  }, [rows, xSpan, ySpan, paramValues])

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

  const applyTemplate = (tpl: Template) => {
    setRows(tpl.rows.map((r) => ({ ...r, id: freshId(), on: true })))
    setParamValues(tpl.params)
    setXSpan(DEFAULT_SPAN)
    setYSpan(DEFAULT_SPAN)
  }

  /** Insert at the caret of the last-active row, not at the end — fixing the
   *  middle of an expression shouldn't send the symbol somewhere else. */
  function insert(sym: string) {
    const id = activeId ?? rows[0]?.id
    if (!id) return
    const row = rows.find((r) => r.id === id)
    if (!row) return
    const el = inputs.current[id]
    const at = el?.selectionStart ?? row.expr.length
    const to = el?.selectionEnd ?? at
    caret.current = { id, at: at + sym.length }
    setExpr(id, row.expr.slice(0, at) + sym + row.expr.slice(to))
  }

  // Every free identifier across every row, in the order first seen — each
  // one gets a slider. `x`/`y` are always excluded (see `implicit.ts`).
  const usedParams: string[] = []
  for (const row of rows) {
    const eq = splitEquation(row.expr)
    const names = eq ? [...freeVariables(eq.lhs, KNOWN_FUNCS), ...freeVariables(eq.rhs, KNOWN_FUNCS)] : freeVariables(row.expr, KNOWN_FUNCS)
    for (const n of names) if (!usedParams.includes(n)) usedParams.push(n)
  }
  const paramsForEval = Object.fromEntries(usedParams.map((n) => [n, paramValues[n] ?? PARAM_DEFAULT]))

  const items: FigItem[] = []
  for (const row of rows) {
    if (!row.on || row.expr.trim() === '') continue
    const eq = splitEquation(row.expr)
    if (eq) {
      const lhs = substitute(eq.lhs, paramsForEval)
      const rhs = substitute(eq.rhs, paramsForEval)
      for (const [from, to] of traceImplicit(lhs, rhs, xSpan, ySpan)) items.push({ t: 'seg', from, to, color: row.color })
    } else {
      const f = substitute(row.expr, paramsForEval)
      items.push({ t: 'curve', f, color: row.color })
      if (hoverX !== null) {
        const y = evaluateAt(f, { x: hoverX })
        if (Number.isFinite(y)) items.push({ t: 'dot', x: hoverX, y, color: row.color })
      }
    }
  }

  const figure = { dim: 2 as const, xSpan, ySpan, ticks: true, items }

  return (
    <div className="card graphboard">
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="small muted">{t('templates')}:</span>
        {TEMPLATES.map((tpl) => (
          <button className="btn ghost sm" key={tpl.id} onClick={() => applyTemplate(tpl)}>
            {tc(tpl.label)}
          </button>
        ))}
      </div>

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
          {tc({
            en: 'Drag to pan. Scroll to zoom. An equation with = draws a circle, an ellipse, anything implicit.',
            id: 'Seret untuk menggeser. Gulir untuk memperbesar. Persamaan dengan = menggambar lingkaran, elips, atau bentuk implisit lainnya.',
          })}
        </span>
      </div>

      {usedParams.length > 0 && (
        <div className="figsliders">
          {usedParams.map((name) => (
            <label className="figslider" key={name}>
              <span>
                <i>{name}</i> = {(paramValues[name] ?? PARAM_DEFAULT).toFixed(2).replace(/\.?0+$/, '') || '0'}
              </span>
              <input
                type="range"
                min={PARAM_RANGE[0]}
                max={PARAM_RANGE[1]}
                step={0.1}
                value={paramValues[name] ?? PARAM_DEFAULT}
                onChange={(e) => setParamValues((p) => ({ ...p, [name]: Number(e.target.value) }))}
              />
            </label>
          ))}
        </div>
      )}

      <div className="graphrows">
        {rows.map((row) => {
          const eq = splitEquation(row.expr)
          const latex = eq
            ? (() => {
                const l = toLatex(eq.lhs, KNOWN_FUNCS)
                const r = toLatex(eq.rhs, KNOWN_FUNCS)
                return l !== null && r !== null ? `${l} = ${r}` : null
              })()
            : (() => {
                const f = toLatex(row.expr, KNOWN_FUNCS)
                return f !== null ? `y = ${f}` : null
              })()
          return (
            <div className="graphrow" key={row.id}>
              <div className="graphrowline">
                <span className="graphswatch" style={{ background: `var(--fig-${row.color})` }} />
                <input
                  ref={(el) => {
                    inputs.current[row.id] = el
                  }}
                  className="graphinput"
                  type="text"
                  value={row.expr}
                  placeholder="sin(x)  or  x^2+y^2=9"
                  spellCheck={false}
                  onChange={(e) => setExpr(row.id, e.target.value)}
                  onFocus={() => {
                    setFocusedId(row.id)
                    setActiveId(row.id)
                  }}
                  onBlur={() => setFocusedId((id) => (id === row.id ? null : id))}
                />
                <button className="btn ghost sm" onClick={() => removeRow(row.id)} aria-label={tc({ en: 'Remove', id: 'Hapus' })}>
                  ✕
                </button>
              </div>
              {latex !== null ? (
                <div className="graphpreview">
                  <Tex src={latex} />
                </div>
              ) : (
                row.expr.trim() !== '' &&
                focusedId !== row.id && (
                  <span className="small muted">{tc({ en: 'Check this expression.', id: 'Periksa ekspresi ini.' })}</span>
                )
              )}
            </div>
          )
        })}
      </div>

      <button className="btn ghost sm" onClick={addRow} disabled={rows.length >= MAX_ROWS}>
        + {tc({ en: 'Add function', id: 'Tambah fungsi' })}
      </button>

      <div className="mathkeys">
        {KEYS.map((k) => (
          <button
            type="button"
            key={k}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => insert(k)}
            aria-label={tc({ en: `insert ${k}`, id: `sisipkan ${k}` })}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}
