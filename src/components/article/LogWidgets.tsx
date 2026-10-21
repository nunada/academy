import { useId, useState } from 'react'
import { useI18n } from '../../i18n'
import { INVERSES, eLimit, expSlopeAtZero, inverse, lnLimit } from '../../lib/inverse'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { show } from './TangentWidgets'

/** A number for a formula: the reader's decimal mark and an ASCII minus. */
const tx = (x: number, sep: string): string => show(x, sep).replace('−', '-')

/* ----------------------------------------------- a square picture of a function and its inverse */

const SIDE = 400

interface SquareProps {
  lo: number
  hi: number
  curves: { f: (x: number) => number; cls: string }[]
  lines: { x: number; y: number; m: number; cls: string }[]
  dots: { x: number; y: number; cls?: string }[]
  label: string
}

/** Both axes use the same scale, which is what makes a reflection in y = x look like one. */
function SquareGraph({ lo, hi, curves, lines, dots, label }: SquareProps) {
  const id = useId().replace(/:/g, '')
  const px = (x: number) => ((x - lo) / (hi - lo)) * SIDE
  const py = (y: number) => SIDE - ((y - lo) / (hi - lo)) * SIDE
  const paths = curves.map((c) => {
    let d = ''
    let pen = false
    for (let i = 0; i <= 300; i++) {
      const x = lo + ((hi - lo) * i) / 300
      const y = c.f(x)
      if (!Number.isFinite(y) || y < lo - (hi - lo) || y > hi + (hi - lo)) {
        pen = false
        continue
      }
      d += `${pen ? 'L' : 'M'}${px(x).toFixed(1)},${py(y).toFixed(1)}`
      pen = true
    }
    return { d, cls: c.cls }
  })
  const span = (hi - lo) * 3
  return (
    <svg viewBox={`0 0 ${SIDE} ${SIDE}`} className="dersvg" style={{ maxWidth: 400 }} role="img" aria-label={label}>
      <defs>
        <clipPath id={`clip${id}`}>
          <rect x={0} y={0} width={SIDE} height={SIDE} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={SIDE} height={SIDE} className="tanframe" />
      <g clipPath={`url(#clip${id})`}>
        {lo < 0 && hi > 0 && <line x1={0} x2={SIDE} y1={py(0)} y2={py(0)} className="tanaxis" />}
        {lo < 0 && hi > 0 && <line y1={0} y2={SIDE} x1={px(0)} x2={px(0)} className="tanaxis" />}
        <line x1={px(lo)} y1={py(lo)} x2={px(hi)} y2={py(hi)} className="tannorm" />
        {paths.map((c, i) => (
          <path key={i} d={c.d} className={c.cls} fill="none" />
        ))}
        {lines.map((l, i) => {
          const n = Math.hypot(1, l.m)
          return <line key={i} x1={px(l.x - span / n)} y1={py(l.y - (span * l.m) / n)} x2={px(l.x + span / n)} y2={py(l.y + (span * l.m) / n)} className={l.cls} />
        })}
        {dots.map((d, i) => (
          <circle key={i} cx={px(d.x)} cy={py(d.y)} r={5} className={d.cls ?? 'tandot'} />
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------ the slopes of a function and its inverse */

export function InverseSlope() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('cube')
  const g = INVERSES.find((k) => k.id === id) ?? INVERSES[0]
  const [t, setT] = useState(0.5)
  const [x0, x1] = g.xr
  const a = x0 + t * (x1 - x0)
  const b = g.f(a)
  const da = g.d(a)
  const inv = (v: number) => inverse(g.f, v, x0, x1)
  const lo = Math.max(-6, Math.min(x0, g.f(x0)) - 0.4)
  const hi = Math.min(6, Math.max(x1, g.f(x1)) + 0.4)
  const h = 1e-5
  const cd = (inv(b + h) - inv(b - h)) / (2 * h)
  return (
    <Frame name="inverseslope">
      <div className="chips">
        {INVERSES.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            <Tex src={`f(x)=${k.tex}`} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          a = <b>{show(a, sep)}</b>
          <input type="range" min={0} max={1} step={0.005} value={t} aria-label="a" onChange={(e) => setT(Number(e.target.value))} />
        </label>
      </div>
      <SquareGraph
        lo={lo}
        hi={hi}
        curves={[
          { f: g.f, cls: 'tancurve' },
          { f: inv, cls: 'tancurve sec' },
        ]}
        lines={[
          { x: a, y: b, m: da, cls: 'tantan' },
          { x: b, y: a, m: 1 / da, cls: 'tancurve sec' },
        ]}
        dots={[
          { x: a, y: b },
          { x: b, y: a, cls: 'tandot sec' },
        ]}
        label={tc(L('The graph of a function (green) and of its inverse (orange), mirror images in the line y = x, with the tangent lines at corresponding points', 'Grafik suatu fungsi (hijau) dan inversnya (jingga), bayangan cermin dalam garis y = x, dengan garis singgung di titik-titik yang bersesuaian'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`f(${tx(a, sep)})=${tx(b, sep)},\\qquad f'(${tx(a, sep)})=${tx(da, sep)}`} />
        </p>
        <p className="okline">
          <Tex src={`\\left(f^{-1}\\right)'(${tx(b, sep)})=\\frac{1}{f'(f^{-1}(${tx(b, sep)}))}=\\frac{1}{f'(${tx(a, sep)})}=${tx(1 / da, sep)}`} />
        </p>
        <p className="small">
          {tc(L('A check: a difference quotient of the inverse, found by solving f(x) = b numerically, gives', 'Pemeriksaan: hasil bagi selisih dari invers, yang dicari dengan menyelesaikan f(x) = b secara numerik, memberi'))} {Number.isFinite(cd) ? tx(cd, sep) : '–'}.
        </p>
        <p className="small muted">{tc(L('The two tangent lines are mirror images of each other in y = x, so their slopes are reciprocals. The slope is read at a on the function and at b = f(a) on the inverse.', 'Kedua garis singgung adalah bayangan cermin satu sama lain dalam y = x, sehingga gradiennya saling berkebalikan. Gradiennya dibaca di a pada fungsi dan di b = f(a) pada invers.'))}</p>
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------- the limits that define e and ln a */

export function LogLimits() {
  const { tc } = useI18n()
  const sep = useSep()
  const [a, setA] = useState(2)
  const hs = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6]
  const hLabel = (h: number) => `10${'⁻' + String(Math.round(-Math.log10(h))).replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)])}`
  return (
    <Frame name="loglimits">
      <div className="amctl">
        <label className="lbl slider">
          a = <b>{show(a, sep)}</b>
          <input type="range" min={1.1} max={10} step={0.1} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
        </label>
      </div>
      <div className="chips">
        {[2, 3, 10].map((b) => (
          <button key={b} className="chip ghost" onClick={() => setA(b)}>
            <Tex src={`a=${b}`} />
          </button>
        ))}
        <button className="chip ghost" onClick={() => setA(Math.E)}>
          <Tex src="a=e" />
        </button>
      </div>
      <table className="small" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', paddingRight: '1em' }}>h</th>
            <th style={{ paddingRight: '1em' }}>
              <Tex src="(1+h)^{1/h}" />
            </th>
            <th style={{ paddingRight: '1em' }}>
              <Tex src="\frac{\ln(1+h)}{h}" />
            </th>
            <th>
              <Tex src="\frac{a^h-1}{h}" />
            </th>
          </tr>
        </thead>
        <tbody>
          {hs.map((h) => (
            <tr key={h}>
              <td style={{ paddingRight: '1em' }}>{hLabel(h)}</td>
              <td style={{ paddingRight: '1em' }}>{show(eLimit(h), sep)}</td>
              <td style={{ paddingRight: '1em' }}>{show(lnLimit(h), sep)}</td>
              <td>{show(expSlopeAtZero(a, h), sep)}</td>
            </tr>
          ))}
          <tr>
            <td style={{ paddingRight: '1em' }}>
              <b>{tc(L('limit', 'limit'))}</b>
            </td>
            <td style={{ paddingRight: '1em' }}>
              <b>e = {show(Math.E, sep)}</b>
            </td>
            <td style={{ paddingRight: '1em' }}>
              <b>1</b>
            </td>
            <td>
              <b>ln a = {show(Math.log(a), sep)}</b>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="wgtout" aria-live="polite">
        <p className="small">{tc(L('The last column is the slope of a^x where its graph crosses the y-axis, and it tends to ln a. For a = e it is 1, which is why e^x is its own derivative. The middle column is the difference quotient of ln at 1, and the first column is e raised to that quotient.', 'Kolom terakhir adalah gradien a^x di tempat grafiknya memotong sumbu-y, dan ia menuju ln a. Untuk a = e nilainya 1, itulah sebabnya e^x turunannya sendiri. Kolom tengah adalah hasil bagi selisih ln di 1, dan kolom pertama adalah e dipangkatkan hasil bagi itu.'))}</p>
      </div>
    </Frame>
  )
}
