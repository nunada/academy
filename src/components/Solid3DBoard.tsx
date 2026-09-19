/** A solid-of-revolution board for the Playground: type a radius r(x) (and,
 *  optionally, an inner radius for a washer), pick where it starts and ends
 *  and how it sits, and see the actual lathe `Solid3DView` already draws for
 *  the Integral course — same camera, same reveal slider, same cap fix.
 *
 *  Unlike `GraphBoard`, this can't just rebuild its view on every keystroke:
 *  `Solid3DView` owns a real WebGL scene and tears the whole thing down and
 *  rebuilds it whenever the `solid` prop it's given changes identity, which
 *  is fine for a lesson's fixed shape but would mean losing your camera
 *  angle mid-word if a fresh object went out on every character typed here.
 *  So the text fields update instantly, and the `Solid3D` actually handed to
 *  the viewer only follows a short debounce later — and only once the
 *  fields describe something renderable, so a mid-edit typo never blanks
 *  the shape that was working a moment ago.
 */

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { Solid3D } from '../lib/solid3d'
import type { FigColor } from '../lib/figure'
import { evaluateAt, MATH_FUNCS } from '../lib/expr'
import { toLatex } from '../lib/toLatex'
import { useI18n } from '../i18n'
import type { Loc } from '../content/types'
import { Tex } from './ui'

// Three.js is heavy and only this one board (and a handful of lessons) use
// it — load it only when this mode is actually open.
const Solid3DView = lazy(() => import('./Solid3DView').then((m) => ({ default: m.Solid3DView })))

const STORE_KEY = 'nunada.playground.solid3d.v1'
const DEBOUNCE_MS = 350
const COLORS: FigColor[] = ['a', 'b', 'c', 'result', 'muted']
const KNOWN_FUNCS = new Set(Object.keys(MATH_FUNCS))

interface SolidTemplate {
  id: string
  label: Loc
  outer: string
  inner?: string
  from: number
  to: number
  axis: 'x' | 'y'
  sweep?: number
  color: FigColor
}

const TEMPLATES: SolidTemplate[] = [
  { id: 'cone', label: { en: 'Cone', id: 'Kerucut' }, outer: 'x', from: 0, to: 3, axis: 'x', color: 'a' },
  { id: 'cylinder', label: { en: 'Cylinder', id: 'Tabung' }, outer: '3', from: 0, to: 5, axis: 'x', color: 'b' },
  { id: 'sphere', label: { en: 'Sphere', id: 'Bola' }, outer: 'sqrt(9-x^2)', from: -3, to: 3, axis: 'x', sweep: 300, color: 'c' },
  { id: 'paraboloid', label: { en: 'Paraboloid', id: 'Paraboloid' }, outer: 'sqrt(x)', from: 0, to: 4, axis: 'x', color: 'a' },
  { id: 'tube', label: { en: 'Tube', id: 'Pipa' }, outer: '3', inner: '2', from: 0, to: 5, axis: 'x', color: 'result' },
  { id: 'vase', label: { en: 'Vase', id: 'Vas' }, outer: '2+sin(x)', from: 0, to: 6.28, axis: 'y', color: 'muted' },
]

const DEFAULT_TEMPLATE = TEMPLATES[0]

interface Draft {
  outer: string
  inner: string
  from: string
  to: string
  axis: 'x' | 'y'
  color: FigColor
}

function load(): Draft | null {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch {
    return null
  }
}

/** True only if `fn` evaluates to a real number across the whole span —
 *  sampled rather than checked once, since a formula can be finite at one
 *  end and blow up (division by zero, a negative under a square root) at
 *  the other. */
function finiteAcross(fn: string, from: number, to: number): boolean {
  if (fn.trim() === '') return false
  for (let i = 0; i <= 12; i++) {
    const x = from + ((to - from) * i) / 12
    if (!Number.isFinite(evaluateAt(fn, { x }))) return false
  }
  return true
}

/** Builds a real `Solid3D` only once the draft actually describes one —
 *  `null` otherwise, so the caller can simply leave the last good shape on
 *  screen instead of tearing the scene down over a half-typed formula. */
function tryBuild(d: Draft): Solid3D | null {
  const from = Number(d.from)
  const to = Number(d.to)
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return null
  if (!finiteAcross(d.outer, from, to)) return null
  if (d.inner.trim() !== '' && !finiteAcross(d.inner, from, to)) return null
  return { outer: d.outer, inner: d.inner.trim() || undefined, from, to, axis: d.axis, color: d.color }
}

export function Solid3DBoard() {
  const { t, tc } = useI18n()
  const saved = load()
  const initial: Draft = saved ?? {
    outer: DEFAULT_TEMPLATE.outer,
    inner: DEFAULT_TEMPLATE.inner ?? '',
    from: String(DEFAULT_TEMPLATE.from),
    to: String(DEFAULT_TEMPLATE.to),
    axis: DEFAULT_TEMPLATE.axis,
    color: DEFAULT_TEMPLATE.color,
  }

  const [outer, setOuter] = useState(initial.outer)
  const [inner, setInner] = useState(initial.inner)
  const [fromText, setFromText] = useState(initial.from)
  const [toText, setToText] = useState(initial.to)
  const [axis, setAxis] = useState<'x' | 'y'>(initial.axis)
  const [color, setColor] = useState<FigColor>(initial.color)

  const [solid, setSolid] = useState<Solid3D | null>(() => tryBuild(initial) ?? { ...DEFAULT_TEMPLATE, inner: DEFAULT_TEMPLATE.inner })
  // Bumped only by `applyTemplate`, and passed to `Solid3DView` as a `key` —
  // that component reads its starting reveal angle (`solid.sweep ?? 270`)
  // into a `useState` initializer, which React only runs on a component's
  // very first render. A prop change alone (every ordinary edit here) is
  // meant to leave whatever reveal angle the learner already dragged to
  // alone, but a template is a genuinely new shape, and a sphere that opens
  // at a cone's leftover 100° looks broken rather than merely un-reset — so
  // that one action forces an actual remount instead.
  const [mountKey, setMountKey] = useState(0)

  const firstRun = useRef(true)
  const skipNextCommit = useRef(false)

  useEffect(() => {
    try {
      const draft: Draft = { outer, inner, from: fromText, to: toText, axis, color }
      localStorage.setItem(STORE_KEY, JSON.stringify(draft))
    } catch {
      // A full or blocked store is not a reason to stop working.
    }
  }, [outer, inner, fromText, toText, axis, color])

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (skipNextCommit.current) {
      skipNextCommit.current = false
      return
    }
    const id = setTimeout(() => {
      const next = tryBuild({ outer, inner, from: fromText, to: toText, axis, color })
      if (next) setSolid(next)
    }, DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [outer, inner, fromText, toText, axis, color])

  function applyTemplate(tpl: SolidTemplate) {
    skipNextCommit.current = true
    setOuter(tpl.outer)
    setInner(tpl.inner ?? '')
    setFromText(String(tpl.from))
    setToText(String(tpl.to))
    setAxis(tpl.axis)
    setColor(tpl.color)
    setSolid({ outer: tpl.outer, inner: tpl.inner, from: tpl.from, to: tpl.to, axis: tpl.axis, sweep: tpl.sweep, color: tpl.color })
    setMountKey((k) => k + 1)
  }

  const from = Number(fromText)
  const to = Number(toText)
  const boundsValid = Number.isFinite(from) && Number.isFinite(to) && to > from
  const outerValid = boundsValid && finiteAcross(outer, from, to)
  const innerValid = inner.trim() === '' || (boundsValid && finiteAcross(inner, from, to))

  const hint = !boundsValid
    ? tc({ en: '"To" must be greater than "From".', id: '"Sampai" harus lebih besar dari "Dari".' })
    : !outerValid
      ? tc({ en: 'Check the outer radius.', id: 'Periksa jari-jari luarnya.' })
      : !innerValid
        ? tc({ en: 'Check the inner radius.', id: 'Periksa jari-jari dalamnya.' })
        : null

  const outerLatex = toLatex(outer, KNOWN_FUNCS)
  const innerLatex = inner.trim() === '' ? null : toLatex(inner, KNOWN_FUNCS)

  return (
    <div className="card solidboard">
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="small muted">{t('templates')}:</span>
        {TEMPLATES.map((tpl) => (
          <button className="btn ghost sm" key={tpl.id} onClick={() => applyTemplate(tpl)}>
            {tc(tpl.label)}
          </button>
        ))}
      </div>

      {solid ? (
        <Suspense fallback={<div className="fig3d" style={{ height: 380 }} />}>
          <Solid3DView key={mountKey} solid={solid} />
        </Suspense>
      ) : (
        <div className="fig3d" style={{ height: 380, display: 'grid', placeItems: 'center' }}>
          <p className="small muted" style={{ margin: 0, padding: '0 24px', textAlign: 'center' }}>
            {tc({ en: 'Fill in a radius and a range to see the solid.', id: 'Isi jari-jari dan rentangnya untuk melihat bendanya.' })}
          </p>
        </div>
      )}

      <div className="solidfields">
        <label className="field">
          <span>{tc({ en: 'Outer radius r(x)', id: 'Jari-jari luar r(x)' })}</span>
          <input
            className="graphinput"
            type="text"
            value={outer}
            placeholder="sqrt(x)"
            spellCheck={false}
            onChange={(e) => setOuter(e.target.value)}
          />
          {outerLatex !== null && (
            <div className="graphpreview">
              <Tex src={outerLatex} />
            </div>
          )}
        </label>

        <label className="field">
          <span>{tc({ en: 'Inner radius (optional — leave blank for a solid shape)', id: 'Jari-jari dalam (opsional — kosongkan untuk benda pejal)' })}</span>
          <input
            className="graphinput"
            type="text"
            value={inner}
            placeholder={tc({ en: 'e.g. 2, for a hole down the middle', id: 'mis. 2, untuk lubang di tengahnya' })}
            spellCheck={false}
            onChange={(e) => setInner(e.target.value)}
          />
          {innerLatex !== null && (
            <div className="graphpreview">
              <Tex src={innerLatex} />
            </div>
          )}
        </label>

        <div className="row" style={{ gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>{tc({ en: 'From x =', id: 'Dari x =' })}</span>
            <input className="mathbox" type="text" value={fromText} onChange={(e) => setFromText(e.target.value)} />
          </label>
          <label className="field" style={{ marginBottom: 0 }}>
            <span>{tc({ en: 'To x =', id: 'Sampai x =' })}</span>
            <input className="mathbox" type="text" value={toText} onChange={(e) => setToText(e.target.value)} />
          </label>

          <div>
            <span className="small muted" style={{ display: 'block', marginBottom: 5 }}>
              {tc({ en: 'Orientation', id: 'Arah' })}
            </span>
            <div className="row" style={{ gap: 6 }}>
              <button className={axis === 'x' ? 'btn sm' : 'btn ghost sm'} onClick={() => setAxis('x')}>
                ↔ {tc({ en: 'Flat', id: 'Rebah' })}
              </button>
              <button className={axis === 'y' ? 'btn sm' : 'btn ghost sm'} onClick={() => setAxis('y')}>
                ↕ {tc({ en: 'Upright', id: 'Berdiri' })}
              </button>
            </div>
          </div>

          <div>
            <span className="small muted" style={{ display: 'block', marginBottom: 5 }}>
              {tc({ en: 'Color', id: 'Warna' })}
            </span>
            <div className="row" style={{ gap: 6 }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  className="colorswatch"
                  aria-label={c}
                  style={{ background: `var(--fig-${c})`, borderColor: c === color ? 'var(--brand)' : 'transparent' }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>

        {hint && (
          <p className="small muted" style={{ marginTop: 4 }}>
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}
