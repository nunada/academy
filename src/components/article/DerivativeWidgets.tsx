import { useId, useState } from 'react'
import { useI18n } from '../../i18n'
import { parseRational } from '../../lib/realnum'
import { AlgebraError } from '../../lib/algebra'
import {
  GRAPHS,
  derivativeFn,
  diffQuotientFn,
  evalFn,
  excludedPoints,
  fromSteps,
  isPolynomial,
  parseFunction,
  polylineProblem,
  quotientInXandH,
  stepDerivative,
  type Poly,
  type Pt,
  type Rat,
  type RationalFn,
} from '../../lib/derivative'
import { polyTex } from '../../lib/tangent'
import { Tex } from '../ui'
import { exprTex } from '../../lib/exprtex'
import { Frame, L, dec, useSep } from './widgetKit'
import { num, rt, show, small } from './TangentWidgets'

/* ------------------------------------------------------------------ the drawing */

interface PlotProps {
  xr: [number, number]
  yr: [number, number]
  curves?: { f: (x: number) => number; cls: string }[]
  segs?: { x1: number; y1: number; x2: number; y2: number; cls: string }[]
  vlines?: { x: number; cls: string }[]
  dots?: { x: number; y: number; cls?: string; open?: boolean; label?: string }[]
  label: string
}

const PW = 440
const PH = 210

/** A plain graph, wider than tall: axes where they fall, curves cut where they break or run off the picture. */
export function Plot({ xr, yr, curves = [], segs = [], vlines = [], dots = [], label }: PlotProps) {
  const id = useId().replace(/:/g, '')
  const [x0, x1] = xr
  const [y0, y1] = yr
  const px = (x: number) => ((x - x0) / (x1 - x0)) * PW
  const py = (y: number) => PH - ((y - y0) / (y1 - y0)) * PH
  const N = 420
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
    <svg viewBox={`0 0 ${PW} ${PH}`} className="dersvg" role="img" aria-label={label}>
      <defs>
        <clipPath id={`clip${id}`}>
          <rect x={0} y={0} width={PW} height={PH} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={PW} height={PH} className="tanframe" />
      <g clipPath={`url(#clip${id})`}>
        {y0 < 0 && y1 > 0 && <line x1={0} x2={PW} y1={py(0)} y2={py(0)} className="tanaxis" />}
        {x0 < 0 && x1 > 0 && <line y1={0} y2={PH} x1={px(0)} x2={px(0)} className="tanaxis" />}
        {vlines.map((v, i) => (
          <line key={`v${i}`} x1={px(v.x)} x2={px(v.x)} y1={0} y2={PH} className={v.cls} />
        ))}
        {segs.map((s, i) => (
          <line key={`s${i}`} x1={px(s.x1)} y1={py(s.y1)} x2={px(s.x2)} y2={py(s.y2)} className={s.cls} />
        ))}
        {paths.map((p, i) => (
          <path key={`p${i}`} d={p.d} className={p.cls} />
        ))}
        {dots.map((d, i) => (
          <g key={`d${i}`}>
            <circle cx={px(d.x)} cy={py(d.y)} r={4.5} className={`${d.cls ?? 'tandot'}${d.open ? ' open' : ''}`} />
            {d.label && (
              <text x={px(d.x) + 7} y={py(d.y) - 7} className="tanlabel">
                {d.label}
              </text>
            )}
          </g>
        ))}
      </g>
    </svg>
  )
}

const paddedRange = (lo: number, hi: number, pad = 0.15): [number, number] => {
  const span = hi - lo || 2
  return [lo - span * pad, hi + span * pad]
}

/* ----------------------------------- the graph of f and the graph of its derivative */

export function DerivativeGraph() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('cubic')
  const g = GRAPHS.find((k) => k.id === id) ?? GRAPHS[0]
  const [x, setX] = useState(0.5)
  const [x0, x1] = g.xr
  const span = x1 - x0
  const xv = Math.min(x1, Math.max(x0, x))
  const hole = g.holes.find((h) => Math.abs(h - xv) < span / 200)
  const outside = g.domain !== undefined && (xv < g.domain[0] || xv > g.domain[1])
  const fv = outside ? NaN : g.f(xv)
  const dv = hole !== undefined || outside ? NaN : g.d(xv)
  const L1 = span / 7
  const drawTangent = Number.isFinite(dv) && Number.isFinite(fv) && Math.abs(dv) < 1e6
  const eps = span / 400
  const holeDots = g.holes.flatMap((h) =>
    [h - eps, h + eps]
      .filter((t) => !(g.domain && (t < g.domain[0] || t > g.domain[1])))
      .map((t) => ({ x: h, y: g.d(t), cls: 'tandot', open: true }))
      .filter((d) => Number.isFinite(d.y) && d.y >= g.dy[0] && d.y <= g.dy[1]),
  )
  const sign = !Number.isFinite(dv)
    ? tc(L('f has no derivative at this point.', 'f tidak memiliki turunan di titik ini.'))
    : Math.abs(dv) < 1e-9
      ? tc(L('f′(x) = 0: the tangent is horizontal.', 'f′(x) = 0: garis singgungnya mendatar.'))
      : dv > 0
        ? tc(L('f′(x) > 0: f is rising here.', 'f′(x) > 0: f naik di sini.'))
        : tc(L('f′(x) < 0: f is falling here.', 'f′(x) < 0: f turun di sini.'))

  return (
    <Frame name="derivgraph">
      <div className="chips">
        {GRAPHS.map((k) => (
          <button
            key={k.id}
            className={`chip ${id === k.id ? 'on' : ''}`}
            onClick={() => {
              setId(k.id)
              setX(k.id === 'cubic' ? 0.5 : (k.xr[0] + k.xr[1]) / 2 + (k.xr[1] - k.xr[0]) / 6)
            }}
            aria-pressed={id === k.id}
          >
            <Tex src={`f(x)=${k.tex}`} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          x = <b>{show(xv, sep)}</b>
          <input type="range" min={x0} max={x1} step={span / 300} value={xv} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
        </label>
      </div>
      <p className="small muted">{tc(L('Graph of f, with its tangent line at x', 'Grafik f, dengan garis singgungnya di x'))}</p>
      <Plot
        xr={g.xr}
        yr={g.fy}
        curves={[{ f: (t) => (g.domain && (t < g.domain[0] || t > g.domain[1]) ? NaN : g.f(t)), cls: 'tancurve' }]}
        segs={drawTangent ? [{ x1: xv - L1, y1: fv - dv * L1, x2: xv + L1, y2: fv + dv * L1, cls: 'tantan' }] : []}
        vlines={[{ x: xv, cls: 'tannorm' }]}
        dots={Number.isFinite(fv) ? [{ x: xv, y: fv }] : []}
        label={tc(L('The graph of the function with a tangent line', 'Grafik fungsi dengan sebuah garis singgung'))}
      />
      <p className="small muted">{tc(L('Graph of f′: the height at x is the slope of f at x (bold up to x)', 'Grafik f′: tinggi di x adalah gradien f di x (tebal sampai x)'))}</p>
      <Plot
        xr={g.xr}
        yr={g.dy}
        curves={[
          { f: (t) => (g.domain && (t < g.domain[0] || t > g.domain[1]) ? NaN : g.d(t)), cls: 'tancurve faint' },
          { f: (t) => (t <= xv && !(g.domain && t < g.domain[0]) ? g.d(t) : NaN), cls: 'tancurve' },
        ]}
        vlines={[{ x: xv, cls: 'tannorm' }]}
        dots={[...holeDots, ...(Number.isFinite(dv) ? [{ x: xv, y: dv, cls: 'tandot sec' }] : [])]}
        label={tc(L('The graph of the derivative function', 'Grafik fungsi turunan'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`f(${show(xv, sep).replace('−', '-')})\\approx ${Number.isFinite(fv) ? show(fv, sep).replace('−', '-') : '\\text{?}'},\\qquad f'(x)\\approx ${Number.isFinite(dv) ? show(dv, sep).replace('−', '-') : '\\text{?}'}`} />
        </p>
        <p className={Number.isFinite(dv) ? 'okline' : 'noline'}>{sign}</p>
        <p className="small">{g.note[lang]}</p>
      </div>
    </Frame>
  )
}

/* ----------------------------- the derivative function from the definition, exact */

const DEF_PRESETS = ['x^2', 'x^3', 'x^3 - 3x', '1/x', 'x/(x-1)', '(x^2+1)/(x-2)', '1/(x^2+1)']

/** Σ Q_k(x) h^k as TeX. */
function quotientTex(qs: Poly[]): string {
  let s = ''
  qs.forEach((q, k) => {
    const body = polyTex(q)
    const terms = q.filter((c) => c.n !== 0n).length
    const hk = k === 0 ? '' : k === 1 ? 'h' : `h^{${k}}`
    let t: string
    if (k === 0) t = body
    else if (q.length === 1 && q[0].n === 1n && q[0].d === 1n) t = hk
    else if (terms === 1) t = `${body}${hk}`
    else t = `\\left(${body}\\right)${hk}`
    s += s === '' ? t : t.startsWith('-') ? t : `+${t}`
  })
  return s || '0'
}

const fracTex = (f: RationalFn): string => (f.den.length === 1 && f.den[0].n === 1n && f.den[0].d === 1n ? polyTex(f.num) : `\\frac{${polyTex(f.num)}}{${polyTex(f.den)}}`)

const floatFn = (f: RationalFn) => {
  const n = f.num.map(num)
  const d = f.den.map(num)
  const ev = (cs: number[], x: number) => cs.reduceRight((a, c) => a * x + c, 0)
  return (x: number) => ev(n, x) / ev(d, x)
}

export function DerivativeFromDefinition() {
  const { tc } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState('x^3')
  const [xs, setXs] = useState('2')

  let f: RationalFn | null = null
  let err: 'syntax' | 'letter' | null = null
  if (src.length > 50) err = 'syntax'
  else
    try {
      f = parseFunction(src)
    } catch (e) {
      err = e instanceof AlgebraError && e.code === 'multi' ? 'letter' : 'syntax'
    }
  const x0 = parseRational(xs)

  let body
  if (!f) {
    body = (
      <p className="noline">
        {err === 'letter'
          ? tc(L('Use only the letter x.', 'Gunakan hanya huruf x.'))
          : tc(L('Type a polynomial such as x^3 - 3x, or one quotient of two factors such as 1/x, x/(x-1) or (x^2+1)/(x-2).', 'Ketik polinomial seperti x^3 - 3x, atau satu hasil bagi dua faktor seperti 1/x, x/(x-1), atau (x^2+1)/(x-2).'))}
      </p>
    )
  } else {
    const F = f
    const d = derivativeFn(F)
    const poly = isPolynomial(F)
    const excl = excludedPoints(F)
    const qs = poly ? quotientInXandH(F.num) : []
    const fx = floatFn(F)
    const dx = floatFn(d)
    const centre = small(x0) ? num(x0) : 0
    const win: [number, number] = [centre - 4, centre + 4]
    const sample = (g: (x: number) => number): [number, number] => {
      const ys: number[] = []
      for (let i = 0; i <= 160; i++) {
        const y = g(win[0] + ((win[1] - win[0]) * i) / 160)
        if (Number.isFinite(y) && Math.abs(y) < 200) ys.push(y)
      }
      if (!ys.length) return [-5, 5]
      ys.sort((a, b) => a - b)
      const lo = ys[Math.floor(ys.length * 0.06)]
      const hi = ys[Math.floor(ys.length * 0.94)]
      return paddedRange(Math.min(lo, 0), Math.max(hi, 0), 0.2)
    }
    const hs = [1, 0.1, 0.01, 0.001]
    const vx = small(x0) ? (x0 as Rat) : null
    const fv = vx ? evalFn(F, vx) : null
    const dv = vx ? evalFn(d, vx) : null
    const hr = (h: number) => rtFromNumber(h)
    body = (
      <>
        <p>
          <Tex src={`f(x)=${fracTex(F)}`} />
        </p>
        {poly && qs.length > 0 ? (
          <>
            <p>
              <Tex src={`\\frac{f(x+h)-f(x)}{h}=${quotientTex(qs)}`} />
            </p>
            <p className="okline">
              {tc(L('As h → 0 every term with h disappears, and what is left is', 'Saat h → 0 setiap suku yang memuat h hilang, dan yang tersisa adalah'))} <Tex src={`f'(x)=${polyTex(qs[0])}`} />
            </p>
          </>
        ) : poly ? (
          <p className="okline">
            <Tex src="f'(x)=0" /> ({tc(L('a constant does not change', 'konstanta tidak berubah'))})
          </p>
        ) : (
          <>
            <p className="okline">
              <Tex src={`f'(x)=${fracTex(d)}`} />
            </p>
            <p className="small muted">
              {tc(L('Found with the rule for quotients and then reduced; the table below checks it against the difference quotients, which is what the definition is.', 'Dicari dengan aturan hasil bagi lalu disederhanakan; tabel di bawah mencocokkannya dengan hasil bagi selisih, yaitu apa yang dimaksud definisi.'))}
            </p>
          </>
        )}
        {!poly && (
          <p className="small">
            {excl.rational && excl.rational.length > 0
              ? tc(L('Neither f nor f′ is defined at x = ', 'Baik f maupun f′ tidak terdefinisi di x = ')) + excl.rational.map((r) => (r.d === 1n ? `${r.n}` : `${r.n}/${r.d}`)).join(', ') + '.'
              : tc(L('Neither f nor f′ is defined where the denominator is 0.', 'Baik f maupun f′ tidak terdefinisi di tempat penyebutnya 0.'))}
          </p>
        )}
        <Plot xr={win} yr={sample(fx)} curves={[{ f: fx, cls: 'tancurve' }]} vlines={vx ? [{ x: num(vx), cls: 'tannorm' }] : []} dots={vx && fv ? [{ x: num(vx), y: num(fv) }] : []} label={tc(L('The graph of f', 'Grafik f'))} />
        <Plot xr={win} yr={sample(dx)} curves={[{ f: dx, cls: 'tancurve sec' }]} vlines={vx ? [{ x: num(vx), cls: 'tannorm' }] : []} dots={vx && dv ? [{ x: num(vx), y: num(dv), cls: 'tandot sec' }] : []} label={tc(L('The graph of f′', 'Grafik f′'))} />
        {!vx ? (
          <p className="noline">{tc(L('Type the point x₀ as a number, such as 2, -1/2 or 0.75.', 'Ketik titik x₀ sebagai bilangan, seperti 2, -1/2, atau 0,75.'))}</p>
        ) : !fv || !dv ? (
          <p className="noline">{tc(L('f is not defined at this point, so there is nothing to differentiate there.', 'f tidak terdefinisi di titik ini, sehingga tidak ada yang dapat diturunkan di sana.'))}</p>
        ) : (
          <>
            <p>
              <Tex src={`f(${rt(vx)})=${rt(fv)},\\qquad f'(${rt(vx)})=${rt(dv)}`} />
            </p>
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
                  {hs.map((h) => {
                    const a = diffQuotientFn(F, vx, hr(h))
                    const b = diffQuotientFn(F, vx, hr(-h))
                    return (
                      <tr key={h}>
                        <td>{show(h, sep)}</td>
                        <td>{a ? show(num(a), sep) : '–'}</td>
                        <td>{b ? show(num(b), sep) : '–'}</td>
                      </tr>
                    )
                  })}
                  <tr className="hi">
                    <td>→ 0</td>
                    <td colSpan={2}>
                      f′({rt(vx).replace(/\\frac\{(-?\d+)\}\{(\d+)\}/, '$1/$2')}) = {dec(String(parseFloat(num(dv).toPrecision(8))), sep)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </>
    )
  }

  return (
    <Frame name="derivdef">
      <div className="inrow">
        <label className="lbl">
          f(x) = <input style={{ width: '12em' }} value={src} aria-label="f(x)" onChange={(e) => setSrc(e.target.value)} />
        </label>
        <label className="lbl">
          x₀ = <input style={{ width: '5em' }} value={xs} aria-label="x0" onChange={(e) => setXs(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {DEF_PRESETS.map((p) => (
          <button key={p} className="chip ghost" onClick={() => setSrc(p)}>
            <Tex src={exprTex(p)} />
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/** 0.1, 0.01 and friends as exact fractions (the h of the table). */
function rtFromNumber(h: number): Rat {
  const neg = h < 0
  const k = Math.round(-Math.log10(Math.abs(h)))
  const den = 10n ** BigInt(Math.max(0, k))
  const n = BigInt(Math.round(Math.abs(h) * 10 ** Math.max(0, k)))
  const g = gcdBig(n, den)
  return { n: neg ? -n / g : n / g, d: den / g }
}
const gcdBig = (a: bigint, b: bigint): bigint => (b === 0n ? (a < 0n ? -a : a) : gcdBig(b, a % b))

/* ------------------------------------------- a graph made of line segments */

type StepMode = 'graph' | 'steps'

const POLY_PRESETS = ['(0,0) (2,4) (5,4) (7,0) (9,2)', '(0,0) (1,1) (3,3) (4,1)', '(-3,2) (-1,-2) (1,-2) (3,2)']
const STEP_PRESETS = ['2:3 4:0 6:-1 8:2', '1:2 3:-1/2 5:1']

const PAIR = /\(\s*([^,()\s]+)\s*,\s*([^,()\s]+)\s*\)/g
const STEP = /([^\s:]+):([^\s:]+)/g

function readPoints(s: string): Pt[] | null {
  const out: Pt[] = []
  for (const m of s.matchAll(PAIR)) {
    const x = parseRational(m[1])
    const y = parseRational(m[2])
    if (!small(x) || !small(y)) return null
    out.push({ x, y })
  }
  return out.length >= 1 && out.length <= 12 ? out : null
}

export function DerivativeSteps() {
  const { tc } = useI18n()
  const [mode, setMode] = useState<StepMode>('graph')
  const [pts, setPts] = useState(POLY_PRESETS[0])
  const [startS, setStartS] = useState('0,0')
  const [stepS, setStepS] = useState(STEP_PRESETS[0])

  let vertices: Pt[] | null = null
  let problem: string | null = null
  if (mode === 'graph') {
    vertices = readPoints(pts)
    if (!vertices) problem = tc(L('Type 2 to 12 points as (x,y) pairs, such as (0,0) (2,4) (5,4).', 'Ketik 2 sampai 12 titik sebagai pasangan (x,y), seperti (0,0) (2,4) (5,4).'))
  } else {
    const st = startS.split(',').map((q) => parseRational(q))
    const steps: { to: Rat; slope: Rat }[] = []
    let ok = st.length === 2 && small(st[0]) && small(st[1])
    for (const m of stepS.matchAll(STEP)) {
      const to = parseRational(m[1])
      const slope = parseRational(m[2])
      if (!small(to) || !small(slope)) ok = false
      else steps.push({ to, slope })
    }
    if (ok && steps.length >= 1 && steps.length <= 11) vertices = fromSteps({ x: st[0] as Rat, y: st[1] as Rat }, steps)
    else problem = tc(L('Type the start as x,y and 1 to 11 steps as end:slope pairs, such as 2:3 4:0 6:-1.', 'Ketik titik awal sebagai x,y dan 1 sampai 11 langkah sebagai pasangan akhir:gradien, seperti 2:3 4:0 6:-1.'))
  }
  const bad = vertices ? polylineProblem(vertices) : null
  if (vertices && bad) {
    problem = bad === 'few' ? tc(L('A graph needs at least two points.', 'Sebuah grafik memerlukan sedikitnya dua titik.')) : tc(L('The x-values must increase from left to right.', 'Nilai x harus bertambah dari kiri ke kanan.'))
    vertices = null
  }

  let body
  if (!vertices) body = <p className="noline">{problem}</p>
  else {
    const rep = stepDerivative(vertices)
    const xsN = vertices.map((v) => num(v.x))
    const ysN = vertices.map((v) => num(v.y))
    const slopes = rep.pieces.map((p) => num(p.slope))
    const xr = paddedRange(Math.min(...xsN), Math.max(...xsN), 0.08)
    const yrF = paddedRange(Math.min(...ysN), Math.max(...ysN), 0.15)
    const yrD = paddedRange(Math.min(...slopes, 0), Math.max(...slopes, 0), 0.25)
    const segsF = rep.pieces.map((p, i) => ({ x1: num(p.from), y1: ysN[i], x2: num(p.to), y2: ysN[i + 1], cls: 'tancurve' }))
    const segsD = rep.pieces.map((p) => ({ x1: num(p.from), y1: num(p.slope), x2: num(p.to), y2: num(p.slope), cls: 'tancurve sec' }))
    const dotsD = [
      ...rep.corners.flatMap((c) => [
        { x: num(c.x), y: num(c.left), cls: 'tandot', open: true },
        { x: num(c.x), y: num(c.right), cls: 'tandot', open: true },
      ]),
      { x: xsN[0], y: slopes[0], cls: 'tandot sec' },
      { x: xsN[xsN.length - 1], y: slopes[slopes.length - 1], cls: 'tandot sec' },
    ]
    const first = rep.pieces[0]
    const last = rep.pieces[rep.pieces.length - 1]
    body = (
      <>
        <p className="small muted">{tc(L('The graph of f', 'Grafik f'))}</p>
        <Plot xr={xr} yr={yrF} segs={segsF} dots={vertices.map((v) => ({ x: num(v.x), y: num(v.y) }))} label={tc(L('A graph made of line segments', 'Grafik yang tersusun dari ruas garis'))} />
        <p className="small muted">{tc(L('The graph of f′: one step for each segment', 'Grafik f′: satu anak tangga untuk setiap ruas'))}</p>
        <Plot xr={xr} yr={yrD} segs={segsD} dots={dotsD} label={tc(L('The derivative of the graph, a step function', 'Turunan grafik itu, sebuah fungsi tangga'))} />
        <ul className="small">
          {rep.pieces.map((p) => (
            <li key={`${p.from.n}/${p.from.d}`}>
              <Tex src={`${rt(p.from)}<x<${rt(p.to)}:\\ f'(x)=${rt(p.slope)}`} />
            </li>
          ))}
        </ul>
        {rep.corners.map((c) => (
          <p key={`c${c.x.n}/${c.x.d}`} className="noline">
            <Tex src={`x=${rt(c.x)}`} />: {tc(L('f′ does not exist (a corner): the slope is', 'f′ tidak ada (sudut tajam): gradiennya'))} <Tex src={rt(c.left)} /> {tc(L('on the left and', 'di kiri dan'))} <Tex src={rt(c.right)} /> {tc(L('on the right.', 'di kanan.'))}
          </p>
        ))}
        {rep.smooth.length > 0 && (
          <p className="okline">
            {tc(L('Not a corner (the two slopes agree): x = ', 'Bukan sudut tajam (kedua gradien sama): x = '))}
            {rep.smooth.map((r) => (r.d === 1n ? `${r.n}` : `${r.n}/${r.d}`)).join(', ')}
          </p>
        )}
        <p className="small muted">
          {tc(L('At the two ends only a one-sided derivative exists: the slope', 'Di kedua ujung hanya ada turunan sepihak: gradien'))} <Tex src={rt(first.slope)} /> {tc(L('at the left end and', 'di ujung kiri dan'))} <Tex src={rt(last.slope)} /> {tc(L('at the right end.', 'di ujung kanan.'))}
        </p>
      </>
    )
  }

  return (
    <Frame name="derivsteps">
      <div className="chips">
        <button className={`chip ${mode === 'graph' ? 'on' : ''}`} onClick={() => setMode('graph')} aria-pressed={mode === 'graph'}>
          {tc(L('from the graph to f′', 'dari grafik ke f′'))}
        </button>
        <button className={`chip ${mode === 'steps' ? 'on' : ''}`} onClick={() => setMode('steps')} aria-pressed={mode === 'steps'}>
          {tc(L('from f′ back to the graph', 'dari f′ kembali ke grafik'))}
        </button>
      </div>
      {mode === 'graph' ? (
        <>
          <div className="inrow">
            <label className="lbl">
              {tc(L('points', 'titik'))} <input style={{ width: '22em', maxWidth: '100%' }} value={pts} aria-label={tc(L('points', 'titik'))} onChange={(e) => setPts(e.target.value)} />
            </label>
          </div>
          <div className="chips">
            {POLY_PRESETS.map((p) => (
              <button key={p} className="chip ghost" onClick={() => setPts(p)}>
                {p}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="inrow">
            <label className="lbl">
              {tc(L('start (x,y)', 'awal (x,y)'))} <input style={{ width: '5em' }} value={startS} aria-label={tc(L('start', 'awal'))} onChange={(e) => setStartS(e.target.value)} />
            </label>
            <label className="lbl">
              {tc(L('steps end:slope', 'langkah akhir:gradien'))} <input style={{ width: '14em' }} value={stepS} aria-label={tc(L('steps', 'langkah'))} onChange={(e) => setStepS(e.target.value)} />
            </label>
          </div>
          <div className="chips">
            {STEP_PRESETS.map((p) => (
              <button key={p} className="chip ghost" onClick={() => { setStartS('0,0'); setStepS(p) }}>
                {p}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

