import { useId, useMemo, useState, type ReactNode } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { cosDeg, sinDeg } from '../../lib/trigbasic'
import {
  DATASETS,
  FACTS,
  GFNS,
  asymptotes,
  beats,
  curveSegments,
  extrema,
  fitSinusoid,
  fnValue,
  fromExtremes,
  graphAt,
  keyPoints,
  periodOf,
  radTex,
  radText,
  rangeOf,
  setTex,
  sumPeriod,
  type GFn,
  type Graph,
} from '../../lib/triggraph'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/** A number with `digits` decimals and the reader's decimal mark; `–` where it is undefined. */
function fmt(x: number, sep: string, digits = 4): string {
  if (!Number.isFinite(x)) return '–'
  return (Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits).replace('.', sep)
}
/** The same without trailing zeros. */
function short(x: number, sep: string, digits = 4): string {
  if (!Number.isFinite(x)) return '–'
  return Number((Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits)).toString().replace('.', sep)
}
/** A number inside TeX: a decimal comma has to be protected from the space TeX puts after a comma. */
const texNum = (x: number, sep: string, digits = 4): string => short(x, '.', digits).replace('.', sep === ',' ? '{,}' : '.')
const parse = (s: string): number => (s.trim() === '' ? NaN : Number(s.trim().replace(',', '.')))

type Unit = 'deg' | 'rad'
const FN_NAME: Record<GFn, string> = { sin: '\\sin', cos: '\\cos', tan: '\\tan', cot: '\\cot', sec: '\\sec', csc: '\\csc' }
const BASE_OF: Partial<Record<GFn, GFn>> = { csc: 'sin', sec: 'cos', cot: 'tan' }

/* ------------------------------------------------------------------------------- the plot frame */

interface PlotProps {
  x0: number
  x1: number
  y0: number
  y1: number
  xticks: { v: number; t: string }[]
  yticks: number[]
  label: string
  children: (X: (x: number) => number, Y: (y: number) => number) => ReactNode
  H?: number
}

/** An SVG with axes, a light grid, labelled ticks and a clip, drawing whatever `children` says in graph coordinates. */
function Plot({ x0, x1, y0, y1, xticks, yticks, label, children, H = 210 }: PlotProps) {
  const clip = useId()
  const W = 340
  const pl = 28
  const pr = 10
  const pt = 8
  const pb = 20
  const X = (x: number): number => pl + ((x - x0) / (x1 - x0)) * (W - pl - pr)
  const Y = (y: number): number => pt + ((y1 - y) / (y1 - y0)) * (H - pt - pb)
  const axisY = y0 < 0 && y1 > 0 ? Y(0) : H - pb
  const axisX = x0 < 0 && x1 > 0 ? X(0) : pl
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 480, display: 'block', margin: '6px auto' }}>
      <defs>
        <clipPath id={clip}>
          <rect x={pl} y={pt} width={W - pl - pr} height={H - pt - pb} />
        </clipPath>
      </defs>
      {yticks.map((v) => (
        <g key={`y${v}`}>
          <line x1={pl} y1={Y(v)} x2={W - pr} y2={Y(v)} stroke="var(--border)" strokeWidth={0.7} />
          <text x={pl - 4} y={Y(v) + 3} fontSize={9} textAnchor="end" fill="var(--muted)">
            {v}
          </text>
        </g>
      ))}
      {xticks.map((t) => (
        <g key={`x${t.v}`}>
          <line x1={X(t.v)} y1={pt} x2={X(t.v)} y2={H - pb} stroke="var(--border)" strokeWidth={0.7} />
          <text x={X(t.v)} y={H - 6} fontSize={9} textAnchor="middle" fill="var(--muted)">
            {t.t}
          </text>
        </g>
      ))}
      <line x1={pl} y1={axisY} x2={W - pr} y2={axisY} stroke="var(--muted)" strokeWidth={1.2} />
      <line x1={axisX} y1={pt} x2={axisX} y2={H - pb} stroke="var(--muted)" strokeWidth={1.2} />
      <g clipPath={`url(#${clip})`}>{children(X, Y)}</g>
    </svg>
  )
}

/** A curve as SVG path data, one `M…L…` run per piece. */
function pathOf(segs: [number, number][][], X: (x: number) => number, Y: (y: number) => number): string {
  return segs.map((s) => s.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join('')).join('')
}

const degTicks = (x0: number, x1: number, step: number, unit: Unit): { v: number; t: string }[] => {
  const out: { v: number; t: string }[] = []
  for (let v = Math.ceil(x0 / step) * step; v <= x1 + 1e-9; v += step) out.push({ v, t: unit === 'rad' ? radText(v) || `${v}°` : `${v}°` })
  return out
}
const integerTicks = (lo: number, hi: number): number[] => {
  const out: number[] = []
  const step = hi - lo > 12 ? 2 : 1
  for (let v = Math.ceil(lo); v <= hi; v += step) out.push(v)
  return out
}

const UnitChips = ({ unit, setUnit }: { unit: Unit; setUnit: (u: Unit) => void }) => {
  const { tc } = useI18n()
  return (
    <div className="chips">
      <button className={`chip ghost ${unit === 'deg' ? 'on' : ''}`} onClick={() => setUnit('deg')} aria-pressed={unit === 'deg'}>
        {tc(L('degrees', 'derajat'))}
      </button>
      <button className={`chip ghost ${unit === 'rad' ? 'on' : ''}`} onClick={() => setUnit('rad')} aria-pressed={unit === 'rad'}>
        {tc(L('radians', 'radian'))}
      </button>
    </div>
  )
}

/** An angle (degrees) as TeX in the reader's unit: `30^\circ` or `\frac{\pi}{6}`, falling back to degrees when it is not a nice fraction of π. */
const angleTex = (deg: number, unit: Unit, sep: string): string => {
  if (unit === 'rad') {
    const r = radTex(deg)
    if (r) return r
  }
  return `${texNum(deg, sep)}^\\circ`
}

/* ---------------------------------------------------------------------- the six graphs */

export function TrigGraphSix() {
  const { tc } = useI18n()
  const sep = useSep()
  const [fn, setFn] = useState<GFn>('tan')
  const [unit, setUnit] = useState<Unit>('deg')
  const [x, setX] = useState(60)
  const g: Graph = { fn, a: 1, b: 1, c: 0, d: 0 }
  const f = FACTS[fn]
  const x0 = -180
  const x1 = 540
  const ymax = fn === 'sin' || fn === 'cos' ? 1.5 : 3
  const segs = useMemo(() => curveSegments(g, x0, x1, 1080, ymax * 3), [fn, ymax])
  const base = BASE_OF[fn]
  const baseSegs = useMemo(() => (base ? curveSegments({ fn: base, a: 1, b: 1, c: 0, d: 0 }, x0, x1, 720, ymax * 3) : []), [base, ymax])
  const poles = asymptotes(g, x0, x1)
  const v = fnValue(fn, x)
  const defined = Number.isFinite(v)
  const name = FN_NAME[fn]
  const domain = f.poles ? `x\\ne ${setTex(f.poles, unit)}` : null
  const rangeTex = f.range === 'band' ? '-1\\le y\\le1' : f.range === 'outside' ? 'y\\le-1\\ \\text{or}\\ y\\ge1' : null
  const parityTex = f.parity === 'even' ? `${name}(-x)=${name}\\,x` : `${name}(-x)=-${name}\\,x`
  const label = `${tc(L('The graph of', 'Grafik'))} ${fn} x ${tc(L('from −180° to 540°', 'dari −180° sampai 540°'))}. ${tc(L('Period', 'Periode'))} ${f.period}°. ${f.poles ? tc(L('Vertical asymptotes where the function is undefined.', 'Asimtot tegak di tempat fungsi tak terdefinisi.')) : tc(L('No asymptotes.', 'Tanpa asimtot.'))} ${fn}(${x}°) = ${defined ? fmt(v, sep, 3) : tc(L('undefined', 'tak terdefinisi'))}`
  const none = tc(L('none', 'tidak ada'))
  return (
    <Frame name="gfsix">
      <div className="chips">
        {GFNS.map((q) => (
          <button key={q} className={`chip ${fn === q ? 'on' : ''}`} onClick={() => setFn(q)} aria-pressed={fn === q}>
            <Tex src={`y=${FN_NAME[q]}\\,x`} />
          </button>
        ))}
      </div>
      <UnitChips unit={unit} setUnit={setUnit} />
      <label className="lbl slider">
        x = <b>{unit === 'rad' ? radText(x) || `${x}°` : `${x}°`}</b>
        <input type="range" min={x0} max={x1} step={5} value={x} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
      </label>
      <Plot x0={x0} x1={x1} y0={-ymax} y1={ymax} xticks={degTicks(x0, x1, 90, unit)} yticks={integerTicks(-ymax, ymax)} label={label}>
        {(X, Y) => (
          <>
            {baseSegs.length > 0 && <path d={pathOf(baseSegs, X, Y)} fill="none" stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="4 3" />}
            {poles.map((p) => (
              <line key={p} x1={X(p)} y1={Y(-ymax)} x2={X(p)} y2={Y(ymax)} stroke="var(--coral)" strokeWidth={1.2} strokeDasharray="5 4" />
            ))}
            <path d={pathOf(segs, X, Y)} fill="none" stroke="var(--brand)" strokeWidth={2.4} />
            <line x1={X(x)} y1={Y(-ymax)} x2={X(x)} y2={Y(ymax)} stroke="var(--text)" strokeWidth={0.8} strokeDasharray="2 3" />
            {defined && Math.abs(v) <= ymax * 3 && <circle cx={X(x)} cy={Y(v)} r={4.5} fill="var(--bad)" />}
          </>
        )}
      </Plot>
      <div className="wgtout" aria-live="polite">
        <p className="okline">
          <Tex src={`${name}\\left(${angleTex(x, unit, sep)}\\right)`} /> = {defined ? fmt(v, sep, 4) : tc(L('undefined: a vertical asymptote', 'tak terdefinisi: sebuah asimtot tegak'))}
        </p>
        {base && (
          <p className="small muted">
            {tc(
              fn === 'cot'
                ? L('The dashed curve is tan x. Since cot x = 1 / tan x, the cotangent is undefined where tan x is 0, and 0 where tan x is undefined.', 'Kurva putus-putus adalah tan x. Karena cot x = 1 / tan x, kotangen tak terdefinisi di tempat tan x bernilai 0, dan bernilai 0 di tempat tan x tak terdefinisi.')
                : L(`The dashed curve is ${base} x. Since ${fn} x = 1 / ${base} x, it is undefined where ${base} x is 0, and its tips touch 1 and −1 where ${base} x does.`, `Kurva putus-putus adalah ${base} x. Karena ${fn} x = 1 / ${base} x, ia tak terdefinisi di tempat ${base} x bernilai 0, dan ujungnya menyentuh 1 dan −1 di tempat ${base} x menyentuhnya.`),
            )}
          </p>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <tbody>
              <tr>
                <th scope="row">{tc(L('period', 'periode'))}</th>
                <td>
                  <Tex src={angleTex(f.period, unit, sep)} />
                </td>
              </tr>
              <tr>
                <th scope="row">{tc(L('domain', 'daerah asal'))}</th>
                <td>{domain ? <Tex src={domain} /> : tc(L('all real numbers', 'semua bilangan real'))}</td>
              </tr>
              <tr>
                <th scope="row">{tc(L('range', 'daerah hasil'))}</th>
                <td>{rangeTex ? <Tex src={rangeTex} /> : tc(L('all real numbers', 'semua bilangan real'))}</td>
              </tr>
              <tr>
                <th scope="row">{tc(f.parity === 'even' ? L('symmetry', 'simetri') : L('symmetry', 'simetri'))}</th>
                <td>
                  {tc(f.parity === 'even' ? L('even: mirror image in the y-axis', 'genap: bayangan cermin terhadap sumbu-y') : L('odd: unchanged by a half turn about the origin', 'ganjil: tidak berubah oleh setengah putaran terhadap titik asal'))}, <Tex src={parityTex} />
                </td>
              </tr>
              <tr>
                <th scope="row">{tc(L('zeros', 'nol'))}</th>
                <td>{f.zeros ? <Tex src={`x=${setTex(f.zeros, unit)}`} /> : none}</td>
              </tr>
              <tr>
                <th scope="row">{tc(L('asymptotes', 'asimtot'))}</th>
                <td>{f.poles ? <Tex src={`x=${setTex(f.poles, unit)}`} /> : none}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------- a, b, c and d for any function */

const A_VALUES = [-3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 3]
const B_VALUES = [-2, -1, 0.5, 1, 1.5, 2, 3, 4]

/** TeX for y = a·f(b(x − c)) + d (shape 'shift') or y = a·f(bx − B) + d (shape 'bx'). */
function equationTex(g: Graph, shape: 'shift' | 'bx', unit: Unit, sep: string): string {
  const { fn, a, b, c, d } = g
  const aTex = a === 1 ? '' : a === -1 ? '-' : texNum(a, sep)
  const bTex = b === 1 ? '' : b === -1 ? '-' : texNum(b, sep)
  const signed = (deg: number): string => (deg > 0 ? `-${angleTex(deg, unit, sep)}` : `+${angleTex(-deg, unit, sep)}`)
  let inner: string
  if (shape === 'bx') {
    inner = `${bTex}x${b * c === 0 ? '' : signed(b * c)}`
  } else if (c === 0) {
    inner = `${bTex}x`
  } else {
    inner = bTex === '' ? `x${signed(c)}` : `${bTex}\\left(x${signed(c)}\\right)`
  }
  const dTex = d === 0 ? '' : d > 0 ? `+${texNum(d, sep)}` : `-${texNum(-d, sep)}`
  return `y=${aTex}${FN_NAME[fn]}\\left(${inner}\\right)${dTex}`
}

export function TrigGraphTransform() {
  const { tc } = useI18n()
  const sep = useSep()
  const [fn, setFn] = useState<GFn>('tan')
  const [unit, setUnit] = useState<Unit>('deg')
  const [ai, setAi] = useState(6)
  const [bi, setBi] = useState(3)
  const [c, setC] = useState(0)
  const [d, setD] = useState(0)
  const [shape, setShape] = useState<'shift' | 'bx'>('shift')
  const g: Graph = { fn, a: A_VALUES[ai], b: B_VALUES[bi], c, d }
  const parent: Graph = { fn, a: 1, b: 1, c: 0, d: 0 }
  const x0 = -180
  const x1 = 540
  const wave = fn === 'sin' || fn === 'cos'
  const ymax = wave ? Math.max(2, Math.abs(d) + Math.abs(g.a) + 0.5) : 6
  const segs = useMemo(() => curveSegments(g, x0, x1, 1080, ymax * 3), [fn, ai, bi, c, d, ymax])
  const parentSegs = useMemo(() => curveSegments(parent, x0, x1, 720, ymax * 3), [fn, ymax])
  const poles = asymptotes(g, x0, x1)
  const kps = keyPoints(g, x0, x1).filter((p) => Math.abs(p.y) <= ymax)
  const period = periodOf(g)
  const rg = rangeOf(g)
  const ex = extrema(g, c, c + period + 1e-6)
  const oneCycle = keyPoints(g, c - 1e-7, c + period - 1e-7)
  const label = `${tc(L('The graph of', 'Grafik'))} ${fn} ${tc(L('with', 'dengan'))} a = ${short(g.a, sep, 2)}, b = ${short(g.b, sep, 2)}, c = ${c}°, d = ${short(d, sep, 2)}, ${tc(L('compared with the parent', 'dibandingkan dengan fungsi induk'))} ${fn} x. ${tc(L('Period', 'Periode'))} ${short(period, sep, 3)}°.`
  const cStep = unit === 'rad' ? 15 : 5
  return (
    <Frame name="gftrans">
      <div className="chips">
        {GFNS.map((q) => (
          <button key={q} className={`chip ${fn === q ? 'on' : ''}`} onClick={() => setFn(q)} aria-pressed={fn === q}>
            <Tex src={FN_NAME[q]} />
          </button>
        ))}
      </div>
      <UnitChips unit={unit} setUnit={setUnit} />
      <label className="lbl slider">
        a = <b>{short(g.a, sep, 2)}</b>
        <input type="range" min={0} max={A_VALUES.length - 1} step={1} value={ai} aria-label="a" onChange={(e) => setAi(Number(e.target.value))} />
      </label>
      <div className="chips">
        {B_VALUES.map((q, i) => (
          <button key={q} className={`chip ghost ${bi === i ? 'on' : ''}`} onClick={() => setBi(i)} aria-pressed={bi === i}>
            <Tex src={`b=${texNum(q, sep)}`} />
          </button>
        ))}
      </div>
      <label className="lbl slider">
        c = <b>{unit === 'rad' ? radText(c) || `${c}°` : `${c}°`}</b>
        <input type="range" min={-180} max={180} step={cStep} value={c} aria-label="c" onChange={(e) => setC(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        d = <b>{short(d, sep, 2)}</b>
        <input type="range" min={-2} max={2} step={0.5} value={d} aria-label="d" onChange={(e) => setD(Number(e.target.value))} />
      </label>
      <div className="chips">
        <button className={`chip ghost ${shape === 'shift' ? 'on' : ''}`} onClick={() => setShape('shift')} aria-pressed={shape === 'shift'}>
          <Tex src="y=a\,f\left(b(x-c)\right)+d" />
        </button>
        <button className={`chip ghost ${shape === 'bx' ? 'on' : ''}`} onClick={() => setShape('bx')} aria-pressed={shape === 'bx'}>
          <Tex src="y=a\,f(bx-B)+d" />
        </button>
      </div>
      <Plot x0={x0} x1={x1} y0={-ymax} y1={ymax} xticks={degTicks(x0, x1, 90, unit)} yticks={integerTicks(-ymax, ymax)} label={label}>
        {(X, Y) => (
          <>
            <path d={pathOf(parentSegs, X, Y)} fill="none" stroke="var(--muted)" strokeWidth={1.3} strokeDasharray="4 3" />
            {d !== 0 && <line x1={X(x0)} y1={Y(d)} x2={X(x1)} y2={Y(d)} stroke="var(--gold)" strokeWidth={1.2} strokeDasharray="6 4" />}
            {poles.map((p) => (
              <line key={p} x1={X(p)} y1={Y(-ymax)} x2={X(p)} y2={Y(ymax)} stroke="var(--coral)" strokeWidth={1.2} strokeDasharray="5 4" />
            ))}
            <path d={pathOf(segs, X, Y)} fill="none" stroke="var(--brand)" strokeWidth={2.4} />
            {kps.map((p, i) => (
              <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={3.4} fill="var(--bad)" />
            ))}
          </>
        )}
      </Plot>
      <div className="wgtout" aria-live="polite">
        <p className="small">
          <Tex src={equationTex(g, shape, unit, sep)} />
          {shape === 'bx' && <span className="small muted"> {tc(L('here the shift is B ÷ b, not B', 'di sini pergeserannya B ÷ b, bukan B'))}</span>}
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <tbody>
              <tr>
                <th scope="row">{tc(L('period', 'periode'))}</th>
                <td>
                  <Tex src={angleTex(period, unit, sep)} />
                </td>
              </tr>
              <tr>
                <th scope="row">{tc(L('shift', 'pergeseran'))}</th>
                <td>
                  {c === 0 ? tc(L('none', 'tidak ada')) : `${tc(c > 0 ? L('right', 'ke kanan') : L('left', 'ke kiri'))} `}
                  {c !== 0 && <Tex src={angleTex(Math.abs(c), unit, sep)} />}
                </td>
              </tr>
              <tr>
                <th scope="row">{tc(wave ? L('midline, amplitude', 'garis tengah, amplitudo') : L('centre line', 'garis tengah'))}</th>
                <td>
                  y = {short(d, sep, 2)}
                  {wave ? `, ${tc(L('amplitude', 'amplitudo'))} ${short(Math.abs(g.a), sep, 2)}` : fn === 'tan' || fn === 'cot' ? `, ${tc(L('no amplitude: a stretches the graph', 'tanpa amplitudo: a meregangkan grafik'))}` : `, ${tc(L('tips at', 'ujung di'))} y = ${short(d - Math.abs(g.a), sep, 2)} ${tc(L('and', 'dan'))} ${short(d + Math.abs(g.a), sep, 2)}`}
                </td>
              </tr>
              <tr>
                <th scope="row">{tc(L('range', 'daerah hasil'))}</th>
                <td>
                  {rg.kind === 'all' ? tc(L('all real numbers', 'semua bilangan real')) : rg.kind === 'band' ? <Tex src={`${texNum(rg.lo, sep)}\\le y\\le ${texNum(rg.hi, sep)}`} /> : <Tex src={`y\\le ${texNum(rg.lo, sep)}\\ \\text{or}\\ y\\ge ${texNum(rg.hi, sep)}`} />}
                </td>
              </tr>
              {poles.length > 0 && (
                <tr>
                  <th scope="row">{tc(L('asymptotes', 'asimtot'))}</th>
                  <td>
                    <Tex src={`x=${poles.slice(0, 3).map((p) => angleTex(p, unit, sep)).join(',\\ ')}\\ \\ldots`} />
                  </td>
                </tr>
              )}
              <tr>
                <th scope="row">{tc(L('points to plot in one period', 'titik yang digambar dalam satu periode'))}</th>
                <td style={{ overflowWrap: 'anywhere' }}>{oneCycle.map((p) => `(${short(p.x, sep, 2)}°, ${short(p.y, sep, 2)})`).join('  ')}</td>
              </tr>
              {ex.length > 0 && (
                <tr>
                  <th scope="row">{tc(wave ? L('highest and lowest', 'tertinggi dan terendah') : L('tips of the U-shapes', 'ujung bentuk U'))}</th>
                  <td style={{ overflowWrap: 'anywhere' }}>{ex.slice(0, 2).map((p) => `${tc(p.kind === 'max' ? L('max', 'maks') : L('min', 'min'))} (${short(p.x, sep, 2)}°, ${short(p.y, sep, 2)})`).join('  ')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------------ reading an equation */

interface ReadPreset {
  id: string
  name: Loc
  max: string
  min: string
  xMax: string
  xNext: string
  next: 'max' | 'min'
  mode: 'angle' | 'time'
}
const READ_PRESETS: ReadPreset[] = [
  { id: 'tide', name: L('a tide (hours, metres)', 'pasang surut (jam, meter)'), max: '2.9', min: '0.7', xMax: '3', xNext: '15.4', next: 'max', mode: 'time' },
  { id: 'mains', name: L('PLN mains voltage (ms, volts)', 'tegangan listrik PLN (ms, volt)'), max: '311.1', min: '-311.1', xMax: '5', xNext: '15', next: 'min', mode: 'time' },
  { id: 'wave', name: L('a wave drawn on degrees', 'gelombang pada sumbu derajat'), max: '3', min: '-1', xMax: '30', xNext: '150', next: 'max', mode: 'angle' },
]

export function TrigGraphRead() {
  const { tc } = useI18n()
  const sep = useSep()
  const [p, setP] = useState(READ_PRESETS[0])
  const [max, setMax] = useState(p.max)
  const [min, setMin] = useState(p.min)
  const [xMax, setXMax] = useState(p.xMax)
  const [xNext, setXNext] = useState(p.xNext)
  const [next, setNext] = useState<'max' | 'min'>(p.next)
  const [mode, setMode] = useState<'angle' | 'time'>(p.mode)
  const nums = { max: parse(max), min: parse(min), xMax: parse(xMax), xNext: parse(xNext) }
  const valid = Object.values(nums).every(Number.isFinite)
  const sine = valid ? fromExtremes({ ...nums, next }, 'sin') : null
  const cosine = valid ? fromExtremes({ ...nums, next }, 'cos') : null
  const choose = (q: ReadPreset): void => {
    setP(q)
    setMax(q.max)
    setMin(q.min)
    setXMax(q.xMax)
    setXNext(q.xNext)
    setNext(q.next)
    setMode(q.mode)
  }
  // the equation: in angle mode the argument is b(x − c) in degrees, in time mode it is 2π/P (x − c)
  const eq = (g: Graph, fn: 'sin' | 'cos'): string => {
    const P = 360 / g.b
    const factor = mode === 'angle' ? (g.b === 1 ? '' : texNum(g.b, sep)) : `\\frac{2\\pi}{${texNum(P, sep)}}`
    const shifted = g.c === 0 ? 'x' : g.c > 0 ? `x-${texNum(g.c, sep)}` : `x+${texNum(-g.c, sep)}`
    const arg = g.c === 0 ? `${factor}x` : factor === '' ? shifted : `${factor}\\left(${shifted}\\right)`
    const dTex = g.d === 0 ? '' : g.d > 0 ? `+${texNum(g.d, sep)}` : `-${texNum(-g.d, sep)}`
    return `y=${texNum(g.a, sep)}${FN_NAME[fn]}\\left(${arg}\\right)${dTex}`
  }
  const period = sine ? 360 / sine.b : 1
  const x0 = sine ? nums.xMax - period : 0
  const x1 = sine ? nums.xMax + 2 * period : 1
  const pad = sine ? sine.a * 0.4 : 1
  const y0 = sine ? nums.min - pad : -1
  const y1 = sine ? nums.max + pad : 1
  const segs: [number, number][][] = sine ? [Array.from({ length: 361 }, (_, i): [number, number] => [x0 + ((x1 - x0) * i) / 360, graphAt(sine, x0 + ((x1 - x0) * i) / 360)])] : []
  const label = sine ? `${tc(L('A wave with highest value', 'Gelombang dengan nilai tertinggi'))} ${nums.max}, ${tc(L('lowest', 'terendah'))} ${nums.min}, ${tc(L('period', 'periode'))} ${short(period, sep, 3)}` : tc(L('No wave: check the numbers', 'Tak ada gelombang: periksa bilangannya'))
  return (
    <Frame name="gfread">
      <div className="chips">
        {READ_PRESETS.map((q) => (
          <button key={q.id} className={`chip ghost ${p.id === q.id ? 'on' : ''}`} onClick={() => choose(q)} aria-pressed={p.id === q.id}>
            {tc(q.name)}
          </button>
        ))}
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 8 }}>
        <label className="lbl">
          {tc(L('highest value', 'nilai tertinggi'))} <input style={{ width: '5.5em' }} value={max} inputMode="decimal" aria-label={tc(L('highest value', 'nilai tertinggi'))} onChange={(e) => setMax(e.target.value)} />
        </label>
        <label className="lbl">
          {tc(L('lowest value', 'nilai terendah'))} <input style={{ width: '5.5em' }} value={min} inputMode="decimal" aria-label={tc(L('lowest value', 'nilai terendah'))} onChange={(e) => setMin(e.target.value)} />
        </label>
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 8 }}>
        <label className="lbl">
          {tc(L('x of a maximum', 'x sebuah maksimum'))} <input style={{ width: '5.5em' }} value={xMax} inputMode="decimal" aria-label={tc(L('x of a maximum', 'x sebuah maksimum'))} onChange={(e) => setXMax(e.target.value)} />
        </label>
        <label className="lbl">
          {tc(L(next === 'max' ? 'x of the next maximum' : 'x of the next minimum', next === 'max' ? 'x maksimum berikutnya' : 'x minimum berikutnya'))}{' '}
          <input style={{ width: '5.5em' }} value={xNext} inputMode="decimal" aria-label={tc(L('x of the next extreme', 'x ekstrem berikutnya'))} onChange={(e) => setXNext(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        <button className={`chip ghost ${next === 'max' ? 'on' : ''}`} onClick={() => setNext('max')} aria-pressed={next === 'max'}>
          {tc(L('next maximum', 'maksimum berikutnya'))}
        </button>
        <button className={`chip ghost ${next === 'min' ? 'on' : ''}`} onClick={() => setNext('min')} aria-pressed={next === 'min'}>
          {tc(L('next minimum', 'minimum berikutnya'))}
        </button>
        <button className={`chip ghost ${mode === 'angle' ? 'on' : ''}`} onClick={() => setMode('angle')} aria-pressed={mode === 'angle'}>
          {tc(L('x is an angle in degrees', 'x adalah sudut dalam derajat'))}
        </button>
        <button className={`chip ghost ${mode === 'time' ? 'on' : ''}`} onClick={() => setMode('time')} aria-pressed={mode === 'time'}>
          {tc(L('x is a time (radians)', 'x adalah waktu (radian)'))}
        </button>
      </div>
      {sine && cosine ? (
        <>
          <Plot x0={x0} x1={x1} y0={y0} y1={y1} xticks={[nums.xMax, nums.xMax + period / 2, nums.xMax + period].map((v) => ({ v, t: short(v, sep, 2) }))} yticks={[nums.min, sine.d, nums.max].map((v) => Number(v.toFixed(2)))} label={label}>
            {(X, Y) => (
              <>
                <line x1={X(x0)} y1={Y(sine.d)} x2={X(x1)} y2={Y(sine.d)} stroke="var(--gold)" strokeWidth={1.2} strokeDasharray="6 4" />
                <line x1={X(x0)} y1={Y(nums.max)} x2={X(x1)} y2={Y(nums.max)} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={X(x0)} y1={Y(nums.min)} x2={X(x1)} y2={Y(nums.min)} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
                <path d={pathOf(segs, X, Y)} fill="none" stroke="var(--brand)" strokeWidth={2.4} />
                <circle cx={X(nums.xMax)} cy={Y(nums.max)} r={4.5} fill="var(--bad)" />
                <circle cx={X(nums.xNext)} cy={Y(next === 'max' ? nums.max : nums.min)} r={4.5} fill="var(--bad)" />
              </>
            )}
          </Plot>
          <div className="wgtout" aria-live="polite">
            <p className="small">
              {tc(L('amplitude', 'amplitudo'))} a = (max − min) / 2 = <b>{short(sine.a, sep, 4)}</b>, {tc(L('midline', 'garis tengah'))} d = (max + min) / 2 = <b>{short(sine.d, sep, 4)}</b>, {tc(L('period', 'periode'))} P = <b>{short(period, sep, 4)}</b>
              {mode === 'angle' ? (
                <>
                  , b = 360° / P = <b>{short(sine.b, sep, 4)}</b>
                </>
              ) : (
                <>
                  , {tc(L('frequency', 'frekuensi'))} 1 / P = <b>{short(1 / period, sep, 4)}</b>
                </>
              )}
            </p>
            <p className="okline">
              <Tex src={eq(cosine, 'cos')} />
            </p>
            <p className="okline">
              <Tex src={eq(sine, 'sin')} />
            </p>
            <p className="small muted">{tc(L('A cosine has its maximum where its argument is 0, so c is the x of the maximum; a sine has it a quarter of a period later, so c is a quarter of a period earlier.', 'Kosinus mencapai maksimum ketika argumennya 0, jadi c adalah x maksimum itu; sinus mencapainya seperempat periode kemudian, jadi c seperempat periode lebih awal.'))}</p>
          </div>
        </>
      ) : (
        <p className="warnline">{tc(L('Enter numbers with the highest value above the lowest, and two different values of x.', 'Isikan bilangan dengan nilai tertinggi di atas yang terendah, dan dua nilai x yang berbeda.'))}</p>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------------------ adding two waves */

const FREQS: { b: number; tex: string }[] = [
  { b: 1, tex: '1' },
  { b: 2, tex: '2' },
  { b: 3, tex: '3' },
  { b: 4, tex: '4' },
  { b: 5, tex: '5' },
  { b: 6, tex: '6' },
  { b: 10, tex: '10' },
  { b: 11, tex: '11' },
  { b: 1.5, tex: '1.5' },
  { b: 2.5, tex: '2.5' },
  { b: Math.SQRT2, tex: '\\sqrt2' },
]

export function TrigGraphSum() {
  const { tc } = useI18n()
  const sep = useSep()
  const [i1, setI1] = useState(1)
  const [i2, setI2] = useState(2)
  const [amp1, setAmp1] = useState(1)
  const [amp2, setAmp2] = useState(1)
  const [phi, setPhi] = useState(0)
  const b1 = FREQS[i1].b
  const b2 = FREQS[i2].b
  const w1 = (x: number): number => amp1 * sinDeg(b1 * x)
  const w2 = (x: number): number => amp2 * sinDeg(b2 * x + phi)
  const x0 = 0
  const x1 = 720
  const n = 1440
  const pts = useMemo(() => Array.from({ length: n + 1 }, (_, i) => (x1 * i) / n), [])
  const sum = pts.map((x) => w1(x) + w2(x))
  const ymax = amp1 + amp2 + 0.3
  const path = (f: (x: number) => number): ((X: (x: number) => number, Y: (y: number) => number) => string) => (X, Y) => pts.map((x, i) => `${i === 0 ? 'M' : 'L'}${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`).join('')
  const period = sumPeriod(b1, b2)
  const same = b1 === b2
  const bt = beats(b1, b2)
  const peak = Math.max(...sum.map(Math.abs))
  // two equal-frequency waves with a phase difference make one wave: R² = A² + B² + 2AB cos φ
  const R = Math.sqrt(amp1 * amp1 + amp2 * amp2 + 2 * amp1 * amp2 * cosDeg(phi))
  const label = `${tc(L('The sum of two sine waves with', 'Jumlah dua gelombang sinus dengan'))} ${short(b1, sep, 3)} ${tc(L('and', 'dan'))} ${short(b2, sep, 3)} ${tc(L('cycles per 360°', 'siklus per 360°'))}. ${period === null ? tc(L('It never repeats.', 'Tidak pernah berulang.')) : `${tc(L('Period', 'Periode'))} ${short(period, sep, 4)}°`}`
  return (
    <Frame name="gfsum">
      <div className="chips">
        {FREQS.map((q, i) => (
          <button key={`a${i}`} className={`chip ghost ${i1 === i ? 'on' : ''}`} onClick={() => setI1(i)} aria-pressed={i1 === i}>
            <Tex src={`b_1=${q.tex}`} />
          </button>
        ))}
      </div>
      <div className="chips">
        {FREQS.map((q, i) => (
          <button key={`b${i}`} className={`chip ghost ${i2 === i ? 'on' : ''}`} onClick={() => setI2(i)} aria-pressed={i2 === i}>
            <Tex src={`b_2=${q.tex}`} />
          </button>
        ))}
      </div>
      <label className="lbl slider">
        A₁ = <b>{short(amp1, sep, 2)}</b>
        <input type="range" min={0.5} max={2} step={0.5} value={amp1} aria-label="A1" onChange={(e) => setAmp1(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        A₂ = <b>{short(amp2, sep, 2)}</b>
        <input type="range" min={0.5} max={2} step={0.5} value={amp2} aria-label="A2" onChange={(e) => setAmp2(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        φ = <b>{phi}°</b>
        <input type="range" min={0} max={345} step={15} value={phi} aria-label="phi" onChange={(e) => setPhi(Number(e.target.value))} />
      </label>
      <Plot x0={x0} x1={x1} y0={-ymax} y1={ymax} xticks={degTicks(x0, x1, 90, 'deg')} yticks={integerTicks(-ymax, ymax)} label={label}>
        {(X, Y) => (
          <>
            <path d={path(w1)(X, Y)} fill="none" stroke="var(--coral)" strokeWidth={1.3} />
            <path d={path(w2)(X, Y)} fill="none" stroke="var(--muted)" strokeWidth={1.3} strokeDasharray="4 3" />
            <path d={path((x) => w1(x) + w2(x))(X, Y)} fill="none" stroke="var(--brand)" strokeWidth={2.4} />
          </>
        )}
      </Plot>
      <div className="wgtout" aria-live="polite">
        <p className="small">
          <Tex src={`y=${short(amp1, '.', 2)}\\sin\\left(${texNum(b1, sep)}x\\right)+${short(amp2, '.', 2)}\\sin\\left(${texNum(b2, sep)}x${phi === 0 ? '' : `+${phi}^\\circ`}\\right)`} />
        </p>
        {same ? (
          <p className="okline">
            {tc(L('Same frequency: the sum is one wave, of amplitude', 'Frekuensi sama: jumlahnya satu gelombang, dengan amplitudo'))} R = √(A₁² + A₂² + 2A₁A₂ cos φ) = {fmt(R, sep, 4)}
            {', '}
            {tc(L('and its period is the same', 'dan periodenya sama'))}: {short(360 / b1, sep, 4)}°.
          </p>
        ) : period === null ? (
          <p className="badline">{tc(L('The ratio b₁ : b₂ is not a ratio of whole numbers, so the sum never repeats: no period exists.', 'Perbandingan b₁ : b₂ bukan perbandingan bilangan bulat, sehingga jumlahnya tak pernah berulang: tak ada periode.'))}</p>
        ) : (
          <p className="okline">
            {tc(L('The sum repeats every', 'Jumlahnya berulang setiap'))} {short(period, sep, 4)}° {tc(L('(the waves have periods', '(periode kedua gelombang'))} {short(360 / b1, sep, 3)}° {tc(L('and', 'dan'))} {short(360 / b2, sep, 3)}°{tc(L('; it is the first moment both are back at the start together)', '; itulah saat pertama keduanya kembali ke awal bersamaan)'))}.
          </p>
        )}
        {bt && Math.abs(b1 - b2) < Math.min(b1, b2) / 2 && (
          <p className="small">
            {tc(L('The two waves drift in and out of step every', 'Kedua gelombang bergeser masuk dan keluar dari keselarasan setiap'))} {short(bt.beatPeriod, sep, 3)}°: {tc(L('the beat period, 360° ÷ |b₁ − b₂|. The largest value of the sum here is', 'periode layangan, 360° ÷ |b₁ − b₂|. Nilai terbesar jumlahnya di sini adalah'))} {fmt(peak, sep, 3)}.
          </p>
        )}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------------ fitting a wave to data */

const DATA_NAME: Record<string, { name: Loc; x: Loc; y: string }> = {
  temperature: { name: L('monthly mean temperature (illustrative)', 'suhu rata-rata bulanan (ilustrasi)'), x: L('month', 'bulan'), y: '°C' },
  daylight: { name: L('hours of daylight each month (illustrative)', 'jam siang tiap bulan (ilustrasi)'), x: L('month', 'bulan'), y: 'h' },
  tide: { name: L('tide height hour by hour (illustrative)', 'tinggi pasang surut tiap jam (ilustrasi)'), x: L('hour', 'jam'), y: 'm' },
}

export function TrigGraphFit() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('temperature')
  const ds = DATASETS.find((q) => q.id === id)!
  const [text, setText] = useState(String(ds.period))
  const period = parse(text)
  const pts = ds.xs.map((x, i): [number, number] => [x, ds.ys[i]])
  const fit = useMemo(() => (Number.isFinite(period) && period > 0 ? fitSinusoid(pts, period) : null), [id, period])
  const best = useMemo(() => {
    let bestP = ds.period
    let bestR = -Infinity
    for (let k = 0.4; k <= 2.0001; k += 0.005) {
      const f = fitSinusoid(pts, ds.period * k)
      if (f && f.r2 > bestR) {
        bestR = f.r2
        bestP = ds.period * k
      }
    }
    return Number(bestP.toFixed(2))
  }, [id])
  const names = DATA_NAME[id]
  const x0 = Math.min(...ds.xs) - 0.5
  const x1 = Math.max(...ds.xs) + 0.5
  const lo = Math.min(...ds.ys)
  const hi = Math.max(...ds.ys)
  const pad = (hi - lo) * 0.18 + 0.2
  const curve = fit ? Array.from({ length: 241 }, (_, i): [number, number] => [x0 + ((x1 - x0) * i) / 240, graphAt(fit.graph, x0 + ((x1 - x0) * i) / 240)]) : []
  const label = `${tc(names.name)}: ${ds.xs.length} ${tc(L('measurements', 'pengukuran'))}. ${fit ? `${tc(L('The best wave of period', 'Gelombang terbaik berperiode'))} ${short(period, sep, 3)} ${tc(L('has amplitude', 'memiliki amplitudo'))} ${short(fit.graph.a, sep, 3)}, ${tc(L('and explains', 'dan menjelaskan'))} ${fmt(fit.r2 * 100, sep, 1)}% ${tc(L('of the variation', 'variasi'))}` : tc(L('No fit: check the period', 'Tak ada hasil: periksa periodenya'))}`
  return (
    <Frame name="gffit">
      <div className="chips">
        {DATASETS.map((q) => (
          <button
            key={q.id}
            className={`chip ghost ${id === q.id ? 'on' : ''}`}
            onClick={() => {
              setId(q.id)
              setText(String(q.period))
            }}
            aria-pressed={id === q.id}
          >
            {tc(DATA_NAME[q.id].name)}
          </button>
        ))}
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 8 }}>
        <label className="lbl">
          {tc(L('period P', 'periode P'))} ({tc(names.x)}) <input style={{ width: '5.5em' }} value={text} inputMode="decimal" aria-label={tc(L('period', 'periode'))} onChange={(e) => setText(e.target.value)} />
        </label>
        <button className="btn soft" onClick={() => setText(String(best))}>
          {tc(L('find the best period', 'cari periode terbaik'))}
        </button>
      </div>
      <Plot x0={x0} x1={x1} y0={lo - pad} y1={hi + pad} xticks={ds.xs.filter((_, i) => i % 2 === 0).map((v) => ({ v, t: String(v) }))} yticks={integerTicks(Math.ceil(lo - pad), Math.floor(hi + pad))} label={label}>
        {(X, Y) => (
          <>
            {fit && (
              <>
                {pts.map(([x, y], i) => (
                  <line key={`r${i}`} x1={X(x)} y1={Y(y)} x2={X(x)} y2={Y(graphAt(fit.graph, x))} stroke="var(--coral)" strokeWidth={1.2} />
                ))}
                <path d={pathOf([curve], X, Y)} fill="none" stroke="var(--brand)" strokeWidth={2.4} />
              </>
            )}
            {pts.map(([x, y], i) => (
              <circle key={i} cx={X(x)} cy={Y(y)} r={3.8} fill="var(--bad)" />
            ))}
          </>
        )}
      </Plot>
      <div className="wgtout" aria-live="polite">
        {fit ? (
          <>
            <p className="okline">
              <Tex src={`y=${texNum(fit.graph.a, sep, 3)}\\sin\\left(\\frac{2\\pi}{${texNum(period, sep, 3)}}\\left(x-${texNum(fit.graph.c, sep, 3)}\\right)\\right)+${texNum(fit.graph.d, sep, 3)}`} />
            </p>
            <p className="small">
              {tc(L('amplitude', 'amplitudo'))} <b>{fmt(fit.graph.a, sep, 3)}</b> {names.y}, {tc(L('mean level', 'tingkat rata-rata'))} <b>{fmt(fit.graph.d, sep, 3)}</b> {names.y}, {tc(L('highest at', 'tertinggi pada'))} x ≈ <b>{fmt((fit.graph.c + period / 4) % period, sep, 2)}</b> ({tc(names.x)}), R² = <b>{fmt(fit.r2, sep, 4)}</b>, {tc(L('typical error', 'galat tipikal'))} <b>{fmt(fit.rmse, sep, 3)}</b> {names.y}.
            </p>
            <p className="small muted">{tc(L('The red segments are the errors, the distances from each measurement to the wave. R² is the share of the variation in the measurements that the wave explains: 1 would be a perfect fit.', 'Ruas merah adalah galatnya, jarak dari tiap pengukuran ke gelombang. R² adalah bagian variasi pengukuran yang dijelaskan gelombang: 1 berarti cocok sempurna.'))}</p>
          </>
        ) : (
          <p className="warnline">{tc(L('Type a positive period.', 'Ketik periode yang positif.'))}</p>
        )}
      </div>
    </Frame>
  )
}
