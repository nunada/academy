import { useId, useState } from 'react'
import { useI18n } from '../../i18n'
import { parseRational } from '../../lib/realnum'
import { ratMul, ratSub } from '../../lib/rationals'
import {
  cubeRootQuotient,
  cuspQuotient,
  degree,
  normalAt,
  parsePolynomialInX,
  pieceQuotients,
  polyTex,
  quotientPoly,
  rat,
  tangentAt,
  tangentCrossings,
  tangentsThrough,
  type Piecewise,
  type Poly,
  type Rat,
} from '../../lib/tangent'
import { AlgebraError } from '../../lib/algebra'
import { Tex } from '../ui'
import { Frame, L, dec, useSep } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

export const num = (r: Rat): number => Number(r.n) / Number(r.d)
export const rt = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
/** `v - r` written so that a negative r reads `v + |r|`. */
const minus = (v: string, r: Rat): string => (r.n === 0n ? v : r.n < 0n ? `${v}+${rt(rat(-r.n, r.d))}` : `${v}-${rt(r)}`)
export const small = (r: Rat | null): r is Rat => r !== null && (r.n < 0n ? -r.n : r.n) <= 99999n && r.d <= 999n

/** A number for a table: up to six significant digits, with the reader's decimal mark. */
export function show(x: number, sep: string): string {
  if (Number.isNaN(x)) return '–'
  if (!Number.isFinite(x)) return x > 0 ? '+∞' : '−∞'
  if (Math.abs(x) < 1e-12) return '0'
  if (Math.abs(x) >= 1e7 || Math.abs(x) < 1e-5) {
    const [mant, exp] = x.toExponential(3).split('e')
    const sup = String(Number(exp)).replace(/[-0-9]/g, (c) => ('-⁰¹²³⁴⁵⁶⁷⁸⁹'[c === '-' ? 0 : Number(c) + 1]))
    return dec(`${String(parseFloat(mant)).replace('-', '−')} × 10${sup.replace('-', '⁻')}`, sep)
  }
  return dec(String(parseFloat(x.toPrecision(6))).replace('-', '−'), sep)
}

const hasLetterOtherThanX = (e: unknown): boolean => e instanceof AlgebraError && e.code === 'multi'

/** A polynomial as a JavaScript function, for drawing only (every printed number comes from the exact engine). */
const polyFn = (p: Poly) => {
  const cs = p.map(num)
  return (x: number): number => {
    let acc = 0
    for (let i = cs.length - 1; i >= 0; i--) acc = acc * x + cs[i]
    return acc
  }
}

/* -------------------------------------------------------------- the drawing */

interface Curve {
  f: (x: number) => number
  cls: string
}
interface GraphProps {
  xr: [number, number]
  yr: [number, number]
  curves: Curve[]
  lines?: { m: number; b: number; cls: string }[]
  vlines?: { x: number; cls: string }[]
  dots?: { x: number; y: number; cls?: string; label?: string; open?: boolean }[]
  label: string
}

/** A plain graph on a square window: axes where they fall inside, curves cut where they break or leave the picture. */
function Graph({ xr, yr, curves, lines = [], vlines = [], dots = [], label }: GraphProps) {
  const id = useId().replace(/:/g, '')
  const S = 360
  const [x0, x1] = xr
  const [y0, y1] = yr
  const px = (x: number) => ((x - x0) / (x1 - x0)) * S
  const py = (y: number) => S - ((y - y0) / (y1 - y0)) * S
  const N = 360
  const paths = curves.map((c) => {
    let d = ''
    let pen = false
    let prev = NaN
    for (let i = 0; i <= N; i++) {
      const x = x0 + ((x1 - x0) * i) / N
      const y = c.f(x)
      if (!Number.isFinite(y) || Math.abs(y) > 1e7) {
        pen = false
        prev = NaN
        continue
      }
      if (pen && Math.abs(y - prev) > 0.8 * (y1 - y0)) pen = false
      d += `${pen ? 'L' : 'M'}${px(x).toFixed(1)},${py(y).toFixed(1)}`
      pen = true
      prev = y
    }
    return { d, cls: c.cls }
  })
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="tansvg" role="img" aria-label={label}>
      <defs>
        <clipPath id={`clip${id}`}>
          <rect x={0} y={0} width={S} height={S} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={S} height={S} className="tanframe" />
      <g clipPath={`url(#clip${id})`}>
        {y0 < 0 && y1 > 0 && <line x1={0} x2={S} y1={py(0)} y2={py(0)} className="tanaxis" />}
        {x0 < 0 && x1 > 0 && <line y1={0} y2={S} x1={px(0)} x2={px(0)} className="tanaxis" />}
        {lines.map((l, i) => (
          <line key={`l${i}`} x1={px(x0)} y1={py(l.m * x0 + l.b)} x2={px(x1)} y2={py(l.m * x1 + l.b)} className={l.cls} />
        ))}
        {vlines.map((v, i) => (
          <line key={`v${i}`} x1={px(v.x)} x2={px(v.x)} y1={0} y2={S} className={v.cls} />
        ))}
        {paths.map((p, i) => (
          <path key={`p${i}`} d={p.d} className={p.cls} />
        ))}
        {dots.map((d, i) => (
          <g key={`d${i}`}>
            <circle cx={px(d.x)} cy={py(d.y)} r={4.5} className={`${d.cls ?? 'tandot'}${d.open ? ' open' : ''}`} />
            {d.label && (
              <text x={px(d.x) + 8} y={py(d.y) - 8} className="tanlabel">
                {d.label}
              </text>
            )}
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------------------- functions to explore */

interface Fn {
  id: string
  tex: string
  f: (x: number) => number
  d: (x: number) => number
  lo: number
  hi: number
  a: number
}

const FNS: Fn[] = [
  { id: 'sq', tex: 'x^2', f: (x) => x * x, d: (x) => 2 * x, lo: -3, hi: 3, a: 1 },
  { id: 'cubic', tex: 'x^3-3x', f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, lo: -2.5, hi: 2.5, a: 0.5 },
  { id: 'sqrt', tex: '\\sqrt{x}', f: Math.sqrt, d: (x) => 0.5 / Math.sqrt(x), lo: 0.25, hi: 4, a: 1 },
  { id: 'recip', tex: '\\frac1x', f: (x) => 1 / x, d: (x) => -1 / (x * x), lo: 0.5, hi: 4, a: 1 },
  { id: 'sin', tex: '\\sin x', f: Math.sin, d: Math.cos, lo: -3, hi: 3, a: 1 },
]

function FnChips({ id, pick }: { id: string; pick: (f: Fn) => void }) {
  return (
    <div className="chips">
      {FNS.map((fn) => (
        <button key={fn.id} className={`chip ${id === fn.id ? 'on' : ''}`} onClick={() => pick(fn)} aria-pressed={id === fn.id}>
          <Tex src={`f(x)=${fn.tex}`} />
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------- zooming in on a curve */

export function TangentZoom() {
  const { tc } = useI18n()
  const sep = useSep()
  const [fn, setFn] = useState<Fn>(FNS[0])
  const [a, setA] = useState(FNS[0].a)
  const [z, setZ] = useState(0)
  const w = 4 * 0.5 ** z
  const fa = fn.f(a)
  const m = fn.d(a)
  const edge = (s: number) => Math.abs(fn.f(a + s * w) - (fa + m * s * w))
  const gaps = [edge(1), edge(-1)].filter(Number.isFinite)
  const gap = gaps.length ? Math.max(...gaps) : NaN

  return (
    <Frame name="tanzoom">
      <FnChips
        id={fn.id}
        pick={(f) => {
          setFn(f)
          setA(f.a)
        }}
      />
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('point a', 'titik a'))} = <b>{show(a, sep)}</b>
          <input type="range" min={fn.lo} max={fn.hi} step={0.05} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('zoom', 'perbesaran'))} = <b>×{show(2 ** z, sep)}</b>
          <input type="range" min={0} max={8} step={0.5} value={z} aria-label={tc(L('zoom', 'perbesaran'))} onChange={(e) => setZ(Number(e.target.value))} />
        </label>
      </div>
      <Graph
        xr={[a - w, a + w]}
        yr={[fa - w, fa + w]}
        curves={[{ f: fn.f, cls: 'tancurve' }]}
        lines={[{ m, b: fa - m * a, cls: 'tantan wide' }]}
        dots={[{ x: a, y: fa }]}
        label={tc(L('The graph of the function and its tangent line near the chosen point', 'Grafik fungsi dan garis singgungnya di sekitar titik yang dipilih'))}
      />
      <p className="small muted">
        {tc(L('The window shows x from', 'Jendela menampilkan x dari'))} {show(a - w, sep)} {tc(L('to', 'sampai'))} {show(a + w, sep)}.
      </p>
      <p>
        <Tex src={`f(${show(a, sep).replace('−', '-')})\\approx ${show(fa, sep).replace('−', '-')},\\qquad f'(a)\\approx ${show(m, sep).replace('−', '-')}`} />
      </p>
      <p className="okline">
        {tc(L('Largest gap between the curve and the tangent line in this window:', 'Selisih terbesar antara kurva dan garis singgung di jendela ini:'))} <b>{show(gap, sep)}</b>
        {Number.isFinite(gap) && (
          <>
            {' '}
            = {show(gap / w, sep)} × {tc(L('the window\'s half-height', 'setengah tinggi jendela'))}
          </>
        )}
      </p>
    </Frame>
  )
}

/* --------------------------------------- from a secant to the tangent */

const HS = [2, 1, 0.5, 0.25, 0.1, 0.01, 0.001, 0.0001]

export function TangentSecant() {
  const { tc } = useI18n()
  const sep = useSep()
  const [fn, setFn] = useState<Fn>(FNS[0])
  const [a, setA] = useState(FNS[0].a)
  const [i, setI] = useState(1)
  const [side, setSide] = useState<1 | -1>(1)
  const h = side * HS[i]
  const fa = fn.f(a)
  const fq = fn.f(a + h)
  const ok = Number.isFinite(fq)
  const slope = ok ? (fq - fa) / h : NaN
  const m = fn.d(a)
  // a square window that always holds both points
  const cy = ok ? (fa + fq) / 2 : fa
  const w = Math.max(2.5, Math.abs(h) + 0.8, ok ? Math.abs(fq - fa) / 2 + 0.8 : 0)
  const cx = ok ? a + h / 2 : a
  const q = (hh: number) => (fn.f(a + hh) - fa) / hh

  return (
    <Frame name="tansecant">
      <FnChips
        id={fn.id}
        pick={(f) => {
          setFn(f)
          setA(f.a)
        }}
      />
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('point a', 'titik a'))} = <b>{show(a, sep)}</b>
          <input type="range" min={fn.lo} max={fn.hi} step={0.05} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          |h| = <b>{show(HS[i], sep)}</b>
          <input type="range" min={0} max={HS.length - 1} step={1} value={i} aria-label="|h|" onChange={(e) => setI(Number(e.target.value))} />
        </label>
      </div>
      <div className="chips">
        <button className={`chip ${side === 1 ? 'on' : ''}`} onClick={() => setSide(1)} aria-pressed={side === 1}>
          {tc(L('h > 0 (to the right)', 'h > 0 (ke kanan)'))}
        </button>
        <button className={`chip ${side === -1 ? 'on' : ''}`} onClick={() => setSide(-1)} aria-pressed={side === -1}>
          {tc(L('h < 0 (to the left)', 'h < 0 (ke kiri)'))}
        </button>
      </div>
      <Graph
        xr={[cx - w, cx + w]}
        yr={[cy - w, cy + w]}
        curves={[{ f: fn.f, cls: 'tancurve' }]}
        lines={[
          { m, b: fa - m * a, cls: 'tantan faint' },
          ...(ok ? [{ m: slope, b: fa - slope * a, cls: 'tansec' }] : []),
        ]}
        dots={[
          { x: a, y: fa, label: 'P' },
          ...(ok ? [{ x: a + h, y: fq, cls: 'tandot sec', label: 'Q' }] : []),
        ]}
        label={tc(L('A secant line through two points of the graph, and the tangent line at the first', 'Garis potong melalui dua titik pada grafik, dan garis singgung di titik pertama'))}
      />
      <div className="wgtout" aria-live="polite">
        {ok ? (
          <p>
            <Tex src={`\\frac{f(a+h)-f(a)}{h}=\\frac{${show(fq, sep).replace('−', '-')}-(${show(fa, sep).replace('−', '-')})}{${show(h, sep).replace('−', '-')}}\\approx ${show(slope, sep).replace('−', '-')}`} />
          </p>
        ) : (
          <p className="noline">{tc(L('The point a + h is outside the domain of this function. Choose the other side or another point.', 'Titik a + h berada di luar daerah asal fungsi ini. Pilih sisi lain atau titik lain.'))}</p>
        )}
        <p className="okline">
          {tc(L('Slope of the tangent at a:', 'Gradien garis singgung di a:'))} <b>{show(m, sep)}</b>
        </p>
      </div>
      <div className="gridwrap">
        <table className="rtable">
          <thead>
            <tr>
              <th>|h|</th>
              <th>{tc(L('secant slope, h > 0', 'gradien garis potong, h > 0'))}</th>
              <th>{tc(L('secant slope, h < 0', 'gradien garis potong, h < 0'))}</th>
            </tr>
          </thead>
          <tbody>
            {HS.map((hh, k) => (
              <tr key={hh} className={k === i ? 'hi' : ''}>
                <td>{show(hh, sep)}</td>
                <td>{show(q(hh), sep)}</td>
                <td>{show(q(-hh), sep)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  )
}

/* ---------------------------------------------- the exact tangent calculator */

type Mode = 'at' | 'through'

const AT_PRESETS: [string, string][] = [
  ['x^2', '1'],
  ['x^3 - 3x', '1'],
  ['x^3 - 3x', '0'],
  ['(x-1)(x+2)', '0'],
  ['x^2/2 + 4', '6'],
]
const THROUGH_PRESETS: [string, string, string][] = [
  ['x^2', '1', '-3'],
  ['x^2', '0', '1'],
  ['x^3', '2', '0'],
]

/** A square window that holds all the given points with some room to spare. */
function fit(xs: number[], ys: number[]): { xr: [number, number]; yr: [number, number] } {
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const half = Math.max(3, Math.max(maxX - minX, maxY - minY) / 2 + 1.5)
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  return { xr: [cx - half, cx + half], yr: [cy - half, cy + half] }
}

export function TangentLineTool() {
  const { tc } = useI18n()
  const [mode, setMode] = useState<Mode>('at')
  const [fx, setFx] = useState('x^3 - 3x')
  const [ax, setAx] = useState('1')
  const [x0s, setX0s] = useState('1')
  const [y0s, setY0s] = useState('-3')

  let poly: Poly | null = null
  let polyError: 'syntax' | 'letter' | null = null
  if (fx.length > 60) polyError = 'syntax'
  else
    try {
      poly = parsePolynomialInX(fx)
    } catch (e) {
      polyError = hasLetterOtherThanX(e) ? 'letter' : 'syntax'
    }
  const a = parseRational(ax)
  const x0 = parseRational(x0s)
  const y0 = parseRational(y0s)

  let body
  if (!poly) {
    body = (
      <p className="noline">
        {polyError === 'letter'
          ? tc(L('Use only the letter x.', 'Gunakan hanya huruf x.'))
          : tc(L('Type a polynomial in x with a degree of at most 8, such as x^3 - 3x or (x-1)(x+2).', 'Ketik polinomial dalam x dengan derajat paling tinggi 8, seperti x^3 - 3x atau (x-1)(x+2).'))}
      </p>
    )
  } else if (mode === 'at') {
    if (!small(a)) body = <p className="noline">{tc(L('Type the point a as a whole number, a fraction or a decimal, such as 2, -1/2 or 0.75.', 'Ketik titik a sebagai bilangan bulat, pecahan, atau desimal, seperti 2, -1/2, atau 0,75.'))}</p>
    else {
      const A = a as Rat
      const p = poly
      const t = tangentAt(p, A)
      const Q = quotientPoly(p, A)
      const nm = normalAt(p, A)
      const cr = tangentCrossings(p, A)
      const f = polyFn(p)
      const an = num(A)
      const fan = num(t.fa)
      const win = fit([an - 4, an + 4], [fan - 4, fan + 4])
      const others = (cr.others ?? []).map((r) => ({ x: num(r), y: f(num(r)), cls: 'tandot sec' }))
      body = (
        <>
          <Graph
            xr={win.xr}
            yr={win.yr}
            curves={[{ f, cls: 'tancurve' }]}
            lines={[{ m: num(t.m), b: num(t.b), cls: 'tantan' }, ...('m' in nm ? [{ m: num(nm.m), b: num(nm.b), cls: 'tannorm' }] : [])]}
            vlines={'vertical' in nm ? [{ x: num(nm.vertical), cls: 'tannorm' }] : []}
            dots={[{ x: an, y: fan, label: 'P' }, ...others]}
            label={tc(L('The graph, its tangent line (solid) and its normal line (dashed) at the chosen point', 'Grafik, garis singgung (utuh) dan garis normal (putus-putus) di titik yang dipilih'))}
          />
          <p>
            <Tex src={`f(x)=${polyTex(p)},\\qquad f(${rt(A)})=${rt(t.fa)}`} />
          </p>
          <p>
            <Tex src={`\\frac{f(${rt(A)}+h)-f(${rt(A)})}{h}=${polyTex(Q, 'h')}`} />
          </p>
          <p className="okline">
            {tc(L('As h → 0 the right side settles on', 'Saat h → 0 ruas kanan menuju'))} <Tex src={`f'(${rt(A)})=${rt(t.m)}`} />
          </p>
          <p>
            {tc(L('Tangent line:', 'Garis singgung:'))} <Tex src={`${minus('y', t.fa)}=${rt(t.m)}\\left(${minus('x', A)}\\right)`} />
            {', '}
            {tc(L('that is', 'yaitu'))} <Tex src={`y=${polyTex([t.b, t.m])}`} />
          </p>
          <p>
            {tc(L('Normal line:', 'Garis normal:'))}{' '}
            {'vertical' in nm ? <Tex src={`x=${rt(nm.vertical)}`} /> : <Tex src={`y=${polyTex([nm.b, nm.m])}`} />}
            {'vertical' in nm && <span className="small muted"> ({tc(L('the tangent is horizontal', 'garis singgungnya mendatar'))})</span>}
          </p>
          <p className="small">
            {!Number.isFinite(cr.multiplicity)
              ? tc(L('The graph is itself a straight line, so it is its own tangent everywhere.', 'Grafiknya sendiri garis lurus, sehingga ia menjadi garis singgungnya di mana-mana.'))
              : cr.multiplicity >= 3
                ? tc(L('Here the tangent line crosses the curve at the point of tangency (an inflection point): the gap between them has a root of multiplicity ', 'Di sini garis singgung memotong kurva di titik singgung (titik belok): selisih keduanya memiliki akar dengan kelipatan ')) + cr.multiplicity + '.'
                : tc(L('The tangent line stays on one side of the curve near the point (a double root of the gap). ', 'Garis singgung tetap berada di satu sisi kurva di dekat titik itu (akar ganda dari selisih). '))}{' '}
            {Number.isFinite(cr.multiplicity) &&
              (degree(cr.rest) === 0
                ? tc(L('It meets the curve nowhere else.', 'Ia tidak bertemu kurva di tempat lain.'))
                : cr.others === null
                  ? tc(L('The numbers are too large to search for other meeting points.', 'Bilangannya terlalu besar untuk mencari titik temu lain.'))
                  : cr.others.length > 0
                    ? tc(L('It meets the curve again at x = ', 'Ia bertemu kurva lagi di x = ')) + cr.others.map((r) => (r.d === 1n ? `${r.n}` : `${r.n}/${r.d}`)).join(', ') + (cr.others.length < degree(cr.rest) ? tc(L(' (and possibly at irrational values of x).', ' (dan mungkin di nilai x irasional).')) : '.')
                    : tc(L('Any other meeting point has an irrational x.', 'Titik temu lain, jika ada, memiliki x irasional.')))}
          </p>
        </>
      )
    }
  } else if (!small(x0) || !small(y0)) {
    body = <p className="noline">{tc(L('Type the coordinates of the point as numbers, such as 1 and -3.', 'Ketik koordinat titik sebagai bilangan, seperti 1 dan -3.'))}</p>
  } else {
    const X0 = x0 as Rat
    const Y0 = y0 as Rat
    const p = poly
    const res = tangentsThrough(p, X0, Y0)
    const f = polyFn(p)
    const tps = res.rational ?? []
    const win = fit([num(X0), ...tps.map((t) => num(t.a))], [num(Y0), ...tps.map((t) => num(t.line.fa))])
    let note
    if (res.equation.length === 0) note = tc(L('The graph is a line through the point, so it is its own tangent there.', 'Grafiknya garis yang melalui titik itu, sehingga ia menjadi garis singgungnya di sana.'))
    else if (res.rational === null) note = tc(L('The numbers are too large to search.', 'Bilangannya terlalu besar untuk dicari.'))
    else if (res.degree === 2) {
      const c0 = res.equation[0] ?? rat(0n, 1n)
      const c1 = res.equation[1] ?? rat(0n, 1n)
      const c2 = res.equation[2]
      const disc = ratSub(ratMul(c1, c1), ratMul(rat(4n, 1n), ratMul(c2, c0)))
      note =
        disc.n < 0n
          ? tc(L('The equation for the point of tangency has no real solution: no tangent to this graph passes through the point (it lies inside the curve).', 'Persamaan untuk titik singgung tidak memiliki penyelesaian real: tidak ada garis singgung grafik ini yang melalui titik itu (titik terletak di dalam kurva).'))
          : disc.n === 0n
            ? tc(L('One tangent passes through the point: the point is on the curve.', 'Satu garis singgung melalui titik itu: titik tersebut ada pada kurva.'))
            : tc(L('Two tangents pass through the point.', 'Dua garis singgung melalui titik itu.'))
    } else note = tc(L('Tangents with a rational point of tangency are listed; others, if any, have an irrational one.', 'Garis singgung dengan titik singgung rasional didaftar; yang lain, jika ada, bertitik singgung irasional.'))
    body = (
      <>
        <Graph
          xr={win.xr}
          yr={win.yr}
          curves={[{ f, cls: 'tancurve' }]}
          lines={tps.map((t) => ({ m: num(t.line.m), b: num(t.line.b), cls: 'tantan' }))}
          dots={[{ x: num(X0), y: num(Y0), cls: 'tandot sec', label: 'P' }, ...tps.map((t) => ({ x: num(t.a), y: num(t.line.fa) }))]}
          label={tc(L('The graph and the tangent lines that pass through the chosen point', 'Grafik dan garis-garis singgung yang melalui titik yang dipilih'))}
        />
        <p>
          <Tex src={`f(a)+f'(a)\\left(${rt(X0)}-a\\right)=${rt(Y0)}\\ \\Leftrightarrow\\ ${polyTex(res.equation, 'a')}=0`} />
        </p>
        {tps.map((t) => (
          <p key={`${t.a.n}/${t.a.d}`} className="okline">
            {tc(L('touching at', 'menyinggung di'))} <Tex src={`x=${rt(t.a)}`} />: <Tex src={`y=${polyTex([t.line.b, t.line.m])}`} />
          </p>
        ))}
        <p className="small">{note}</p>
      </>
    )
  }

  const typeFx = (
    <label className="lbl">
      f(x) = <input style={{ width: '12em' }} value={fx} aria-label="f(x)" onChange={(e) => setFx(e.target.value)} />
    </label>
  )

  return (
    <Frame name="tanline">
      <div className="chips">
        <button className={`chip ${mode === 'at' ? 'on' : ''}`} onClick={() => setMode('at')} aria-pressed={mode === 'at'}>
          {tc(L('tangent at a point of the graph', 'garis singgung di titik pada grafik'))}
        </button>
        <button className={`chip ${mode === 'through' ? 'on' : ''}`} onClick={() => setMode('through')} aria-pressed={mode === 'through'}>
          {tc(L('tangents through an outside point', 'garis singgung melalui titik di luar'))}
        </button>
      </div>
      {mode === 'at' ? (
        <div className="inrow">
          {typeFx}
          <label className="lbl">
            a = <input style={{ width: '5em' }} value={ax} aria-label="a" onChange={(e) => setAx(e.target.value)} />
          </label>
        </div>
      ) : (
        <div className="inrow">
          {typeFx}
          <label className="lbl">
            x₀ = <input style={{ width: '4.5em' }} value={x0s} aria-label="x0" onChange={(e) => setX0s(e.target.value)} />
          </label>
          <label className="lbl">
            y₀ = <input style={{ width: '4.5em' }} value={y0s} aria-label="y0" onChange={(e) => setY0s(e.target.value)} />
          </label>
        </div>
      )}
      <div className="chips">
        {mode === 'at'
          ? AT_PRESETS.map(([f, aa]) => (
              <button
                key={f + aa}
                className="chip ghost"
                onClick={() => {
                  setFx(f)
                  setAx(aa)
                }}
              >
                {f}, a = {aa}
              </button>
            ))
          : THROUGH_PRESETS.map(([f, xx, yy]) => (
              <button
                key={f + xx + yy}
                className="chip ghost"
                onClick={() => {
                  setFx(f)
                  setX0s(xx)
                  setY0s(yy)
                }}
              >
                {f}, ({xx}, {yy})
              </button>
            ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
      <p className="small muted">{tc(L('Every number here is an exact fraction; the picture is drawn from the same formulas.', 'Setiap bilangan di sini adalah pecahan eksak; gambarnya dibuat dari rumus yang sama.'))}</p>
    </Frame>
  )
}

/* ------------------------------------------- where the derivative does not exist */

interface Case {
  id: string
  name: { en: string; id: string }
  tex: string
  f: (x: number) => number
  /** The center of the window in y: f(0). */
  y: number
  w0: number
  /** Difference quotients for the positive h in the table, from the right and from the left, as numbers. */
  hs: number[]
  right: (i: number) => number
  left: (i: number) => number
  verdict: { en: string; id: string }
  kind: 'ok' | 'bad'
}

const exactPieces = (pw: Piecewise, hs: number[]) => {
  const rs = hs.map((h) => rat(BigInt(Math.round(h * 1e6)), 1000000n))
  const r = pieceQuotients(pw, rs).map(num)
  const l = pieceQuotients(pw, rs.map((h) => rat(-h.n, h.d))).map(num)
  return { r, l }
}

const KS = [10, 100, 1000, 10000]
const PH = KS.map((k) => 1 / k)
const absPw: Piecewise = { c: rat(0n, 1n), left: [rat(0n, 1n), rat(-1n, 1n)], right: [rat(0n, 1n), rat(1n, 1n)] }
const smoothPw: Piecewise = { c: rat(0n, 1n), left: [rat(0n, 1n), rat(0n, 1n), rat(-1n, 1n)], right: [rat(0n, 1n), rat(0n, 1n), rat(1n, 1n)] }
const stepPw: Piecewise = { c: rat(0n, 1n), left: [], right: [rat(1n, 1n)] }
const KC = [2n, 5n, 10n, 20n, 50n]
const CH = KC.map((k) => 1 / Number(k * k * k))

const CASES: Case[] = (() => {
  const a = exactPieces(absPw, PH)
  const s = exactPieces(smoothPw, PH)
  const st = exactPieces(stepPw, PH)
  const cbrt = Math.cbrt
  return [
    {
      id: 'abs',
      name: { en: 'a corner', id: 'sudut tajam' },
      tex: '|x|',
      f: Math.abs,
      y: 0,
      w0: 2,
      hs: PH,
      right: (i) => a.r[i],
      left: (i) => a.l[i],
      verdict: {
        en: 'The slopes from the left tend to −1 and from the right to +1. They disagree, so there is no tangent line at 0: the graph has a corner there, however far you zoom in.',
        id: 'Gradien dari kiri menuju −1 dan dari kanan menuju +1. Keduanya berbeda, sehingga tidak ada garis singgung di 0: grafiknya memiliki sudut tajam di sana, sebesar apa pun perbesarannya.',
      },
      kind: 'bad',
    },
    {
      id: 'smooth',
      name: { en: 'a smooth look-alike', id: 'mirip sudut tetapi mulus' },
      tex: 'x|x|',
      f: (x) => x * Math.abs(x),
      y: 0,
      w0: 2,
      hs: PH,
      right: (i) => s.r[i],
      left: (i) => s.l[i],
      verdict: {
        en: 'Both sets of slopes tend to 0, so the derivative at 0 exists and equals 0: a horizontal tangent that crosses the curve. A graph can bend in the middle and still be smooth.',
        id: 'Kedua himpunan gradien menuju 0, sehingga turunan di 0 ada dan sama dengan 0: garis singgung mendatar yang memotong kurva. Grafik dapat melengkung di tengah dan tetap mulus.',
      },
      kind: 'ok',
    },
    {
      id: 'step',
      name: { en: 'a jump', id: 'lompatan' },
      tex: '0\\text{ for }x<0,\\ 1\\text{ for }x\\ge0',
      f: (x) => (x < 0 ? 0 : 1),
      y: 1,
      w0: 2,
      hs: PH,
      right: (i) => st.r[i],
      left: (i) => st.l[i],
      verdict: {
        en: 'The function jumps at 0, so it is not even continuous there. From the left the slopes grow without bound (the gap of 1 is divided by a smaller and smaller h) and from the right they are 0. A function must be continuous at a point to have a derivative there.',
        id: 'Fungsi melompat di 0, sehingga ia bahkan tidak kontinu di sana. Dari kiri gradien membesar tanpa batas (selisih 1 dibagi h yang makin kecil) dan dari kanan bernilai 0. Fungsi harus kontinu di suatu titik agar memiliki turunan di sana.',
      },
      kind: 'bad',
    },
    {
      id: 'cbrt',
      name: { en: 'a vertical tangent', id: 'garis singgung tegak' },
      tex: 'x^{1/3}',
      f: cbrt,
      y: 0,
      w0: 2,
      hs: CH,
      right: (i) => num(cubeRootQuotient(KC[i])),
      left: (i) => num(cubeRootQuotient(KC[i])),
      verdict: {
        en: 'The slopes from both sides grow without bound, +∞. The tangent line is the vertical line x = 0, whose slope is not a number, so the derivative does not exist (the function is continuous there).',
        id: 'Gradien dari kedua sisi membesar tanpa batas, +∞. Garis singgungnya garis tegak x = 0, yang gradiennya bukan bilangan, sehingga turunan tidak ada (fungsinya kontinu di sana).',
      },
      kind: 'bad',
    },
    {
      id: 'cusp',
      name: { en: 'a cusp', id: 'cusp (ujung runcing)' },
      tex: 'x^{2/3}',
      f: (x) => cbrt(x) ** 2,
      y: 0,
      w0: 2,
      hs: CH,
      right: (i) => num(cuspQuotient(KC[i], 1)),
      left: (i) => num(cuspQuotient(KC[i], -1)),
      verdict: {
        en: 'The slopes from the right grow to +∞ and from the left to −∞: two vertical directions that point opposite ways. The graph has a sharp point (a cusp) at 0 and no derivative there.',
        id: 'Gradien dari kanan membesar ke +∞ dan dari kiri ke −∞: dua arah tegak yang berlawanan. Grafiknya memiliki ujung runcing (cusp) di 0 dan tidak memiliki turunan di sana.',
      },
      kind: 'bad',
    },
    {
      id: 'wild',
      name: { en: 'endless wiggling', id: 'osilasi tanpa henti' },
      tex: 'x\\sin\\frac1x',
      f: (x) => (x === 0 ? 0 : x * Math.sin(1 / x)),
      y: 0,
      w0: 0.5,
      hs: PH,
      right: (i) => Math.sin(1 / PH[i]),
      left: (i) => Math.sin(1 / -PH[i]),
      verdict: {
        en: 'The function is continuous at 0 (it is squeezed between y = x and y = −x), but the slope of a secant is sin(1/h), which keeps swinging between −1 and 1 as h shrinks and settles on no number. There is no derivative at 0.',
        id: 'Fungsi ini kontinu di 0 (terjepit di antara y = x dan y = −x), tetapi gradien garis potong adalah sin(1/h), yang terus berayun di antara −1 dan 1 saat h mengecil dan tidak menuju bilangan mana pun. Tidak ada turunan di 0.',
      },
      kind: 'bad',
    },
  ]
})()

export function TangentNoDerivative() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('abs')
  const [z, setZ] = useState(0)
  const c = CASES.find((k) => k.id === id) ?? CASES[0]
  const w = c.w0 * 0.1 ** (z / 2)
  return (
    <Frame name="tannodiff">
      <div className="chips">
        {CASES.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => { setId(k.id); setZ(0) }} aria-pressed={id === k.id}>
            {k.name[lang]}
          </button>
        ))}
      </div>
      <p>
        <Tex src={`f(x)=${c.tex}\\quad\\text{${tc(L('at', 'di'))}}\\ x=0`} />
      </p>
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('zoom', 'perbesaran'))} = <b>×{show(w === 0 ? 1 : c.w0 / w, sep)}</b>
          <input type="range" min={0} max={6} step={0.5} value={z} aria-label={tc(L('zoom', 'perbesaran'))} onChange={(e) => setZ(Number(e.target.value))} />
        </label>
      </div>
      <Graph
        xr={[-w, w]}
        yr={[c.y - w, c.y + w]}
        curves={[{ f: c.f, cls: 'tancurve' }]}
        dots={[{ x: 0, y: c.y, open: false }]}
        label={tc(L('The graph of the function near x = 0', 'Grafik fungsi di dekat x = 0'))}
      />
      <div className="gridwrap">
        <table className="rtable">
          <thead>
            <tr>
              <th>|h|</th>
              <th>{tc(L('slope from the left', 'gradien dari kiri'))}</th>
              <th>{tc(L('slope from the right', 'gradien dari kanan'))}</th>
            </tr>
          </thead>
          <tbody>
            {c.hs.map((h, i) => (
              <tr key={h}>
                <td>{show(h, sep)}</td>
                <td>{show(c.left(i), sep)}</td>
                <td>{show(c.right(i), sep)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={c.kind === 'ok' ? 'okline' : 'noline'} aria-live="polite">
        {c.verdict[lang]}
      </p>
    </Frame>
  )
}

