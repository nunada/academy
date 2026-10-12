import { useState } from 'react'
import { useI18n } from '../../i18n'
import { TRIGS, cosDegMinusOneOverH, cosMinusOneOverH, sinDegOverH, sinOverH, spring } from '../../lib/trig'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'

/* --------------------------------------- a trigonometric graph and its slopes */

export function TrigSlope() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState<string>('sin')
  const g = TRIGS.find((k) => k.id === id) ?? TRIGS[0]
  const [x, setX] = useState(0.9)
  const [x0, x1] = g.xr
  const span = x1 - x0
  const xv = Math.min(x1, Math.max(x0, x))
  const pole = g.pole?.(xv) ?? false
  const fv = pole ? NaN : g.f(xv)
  const dv = pole ? NaN : g.d(xv)
  const L1 = span / 12
  const showTan = Number.isFinite(dv) && Math.abs(dv) < 20 && Math.abs(fv) < 50
  return (
    <Frame name="trigslope">
      <div className="chips">
        {TRIGS.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            <Tex src={`y=${k.tex}`} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          x = <b>{show(xv, sep)}</b> {tc(L('radians', 'radian'))}
          <input type="range" min={x0} max={x1} step={span / 400} value={xv} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
        </label>
      </div>
      <p className="small muted">{tc(L('Graph of the function, with its tangent line at x', 'Grafik fungsi, dengan garis singgungnya di x'))}</p>
      <Plot
        xr={g.xr}
        yr={g.fy}
        curves={[{ f: g.f, cls: 'tancurve' }]}
        segs={showTan ? [{ x1: xv - L1, y1: fv - dv * L1, x2: xv + L1, y2: fv + dv * L1, cls: 'tantan' }] : []}
        vlines={[{ x: xv, cls: 'tannorm' }]}
        dots={Number.isFinite(fv) ? [{ x: xv, y: fv }] : []}
        label={tc(L('The graph of a trigonometric function with a tangent line', 'Grafik fungsi trigonometri dengan garis singgung'))}
      />
      <p className="small muted">{tc(L('Graph of its derivative: the height at x is the slope above (bold up to x)', 'Grafik turunannya: tinggi di x adalah gradien di atas (tebal sampai x)'))}</p>
      <Plot
        xr={g.xr}
        yr={g.dy}
        curves={[
          { f: g.d, cls: 'tancurve faint' },
          { f: (t) => (t <= xv ? g.d(t) : NaN), cls: 'tancurve sec' },
        ]}
        vlines={[{ x: xv, cls: 'tannorm' }]}
        dots={Number.isFinite(dv) ? [{ x: xv, y: dv, cls: 'tandot sec' }] : []}
        label={tc(L('The graph of the derivative', 'Grafik turunannya'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={g.dtex} />
        </p>
        <p className={Number.isFinite(dv) ? 'okline' : 'noline'}>
          {Number.isFinite(dv)
            ? `${tc(L('at this x:', 'di x ini:'))} ${show(fv, sep)}${tc(L(', slope', ', gradien'))} ${show(dv, sep)}`
            : tc(L('The function is not defined here (a vertical asymptote).', 'Fungsi tidak terdefinisi di sini (asimtot tegak).'))}
        </p>
        <p className="small">{g.note[lang]}</p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------- the two limits behind sine and cosine */

export function SineLimit() {
  const { tc } = useI18n()
  const sep = useSep()
  const [h, setH] = useState(0.8)
  const [deg, setDeg] = useState(false)
  const R = 120
  const cx = 44
  const cy = 176
  const P: [number, number] = [cx + R * Math.cos(h), cy - R * Math.sin(h)]
  const tanTop = Math.min(R * Math.tan(h), 160)
  const arc = `M${cx + R},${cy}A${R},${R} 0 0 0 ${P[0].toFixed(1)},${P[1].toFixed(1)}`
  const hs = [1, 0.5, 0.1, 0.01, 0.001]
  const f1 = deg ? sinDegOverH : sinOverH
  const f2 = deg ? cosDegMinusOneOverH : cosMinusOneOverH
  return (
    <Frame name="limitsin">
      <div className="chips">
        <button className={`chip ${!deg ? 'on' : ''}`} onClick={() => setDeg(false)} aria-pressed={!deg}>
          {tc(L('h in radians', 'h dalam radian'))}
        </button>
        <button className={`chip ${deg ? 'on' : ''}`} onClick={() => setDeg(true)} aria-pressed={deg}>
          {tc(L('h in degrees', 'h dalam derajat'))}
        </button>
      </div>
      <div className="amctl">
        <label className="lbl slider">
          h = <b>{show(h, sep)}</b> {tc(L('radians', 'radian'))}
          <input type="range" min={0.05} max={1.5} step={0.01} value={h} aria-label="h" onChange={(e) => setH(Number(e.target.value))} />
        </label>
      </div>
      <svg viewBox="0 0 300 200" className="dersvg" role="img" aria-label={tc(L('A unit circle with the angle h, its arc, sin h and tan h', 'Lingkaran satuan dengan sudut h, busurnya, sin h, dan tan h'))}>
        <rect x={0} y={0} width={300} height={200} className="tanframe" />
        <line x1={10} y1={cy} x2={290} y2={cy} className="tanaxis" />
        <path d={`M${cx},${cy}L${cx + R},${cy}${arc.replace(`M${cx + R},${cy}`, '')}Z`} className="pythsqa" />
        <line x1={cx + R} y1={cy} x2={cx + R} y2={cy - tanTop} className="tannorm" />
        <line x1={cx} y1={cy} x2={cx + R} y2={cy - tanTop} className="tannorm" />
        <path d={arc} className="tancurve sec" />
        <line x1={P[0]} y1={cy} x2={P[0]} y2={P[1]} className="tantan" />
        <line x1={cx} y1={cy} x2={P[0]} y2={P[1]} className="tancurve" />
        <circle cx={P[0]} cy={P[1]} r={4.5} className="tandot" />
        <text x={cx + R + 8} y={cy - tanTop / 2} className="tanlabel">tan h</text>
        <text x={P[0] + 8} y={(cy + P[1]) / 2} className="tanlabel">sin h</text>
        <text x={cx + 30} y={cy - 8} className="tanlabel">h</text>
      </svg>
      <p>
        <Tex src={`\\sin h=${show(Math.sin(h), sep)}\\ <\\ h=${show(h, sep)}\\ <\\ \\tan h=${show(Math.tan(h), sep)}`} />
      </p>
      <div className="gridwrap">
        <table className="rtable">
          <thead>
            <tr>
              <th>h</th>
              <th>{deg ? 'sin(h°) / h' : 'sin h / h'}</th>
              <th>{deg ? '(cos(h°) − 1) / h' : '(cos h − 1) / h'}</th>
            </tr>
          </thead>
          <tbody>
            {hs.flatMap((v) => [v, -v]).map((v) => (
              <tr key={v}>
                <td>{show(v, sep)}</td>
                <td>{show(f1(v), sep)}</td>
                <td>{show(f2(v), sep)}</td>
              </tr>
            ))}
            <tr className="hi">
              <td>→ 0</td>
              <td>{deg ? '→ π/180 ≈ 0.017453' : '→ 1'}</td>
              <td>→ 0</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={deg ? 'noline' : 'okline'} aria-live="polite">
        {deg
          ? tc(L('In degrees the first limit is π/180, about 0.01745, not 1: every derivative of sine and cosine would pick up that factor. Calculus uses radians so that the factor is 1.', 'Dalam derajat limit pertama adalah π/180, sekitar 0,01745, bukan 1: setiap turunan sinus dan kosinus akan mendapat faktor itu. Kalkulus memakai radian agar faktornya 1.'))
          : tc(L('In radians sin h / h tends to 1 and (cos h − 1) / h tends to 0, from both sides of 0.', 'Dalam radian sin h / h menuju 1 dan (cos h − 1) / h menuju 0, dari kedua sisi 0.'))}
      </p>
    </Frame>
  )
}

/* -------------------------------------------------- a weight on a spring */

export function SpringMotion() {
  const { tc } = useI18n()
  const sep = useSep()
  const [A, setA] = useState(5)
  const [t, setT] = useState(0)
  const m = spring(A, t)
  const scale = 10
  const restY = 112
  const weightY = restY + m.s * scale
  // a zigzag from the ceiling to the top of the weight
  const top = 16
  const coils = 10
  const zig: string[] = [`${60},${top}`]
  for (let i = 1; i <= coils; i++) zig.push(`${60 + (i % 2 ? 16 : -16)},${(top + ((weightY - 14 - top) * i) / (coils + 1)).toFixed(1)}`)
  zig.push(`60,${(weightY - 14).toFixed(1)}`)
  const T = 2 * Math.PI
  return (
    <Frame name="springmotion">
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('amplitude', 'amplitudo'))} A = <b>{show(A, sep)}</b>
          <input type="range" min={1} max={8} step={0.5} value={A} aria-label="A" onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          t = <b>{show(t, sep)}</b> s
          <input type="range" min={0} max={T} step={0.02} value={t} aria-label="t" onChange={(e) => setT(Number(e.target.value))} />
        </label>
      </div>
      <div className="inrow" style={{ alignItems: 'flex-start' }}>
        <svg viewBox="0 0 120 210" className="dersvg" style={{ maxWidth: 130, margin: 0 }} role="img" aria-label={tc(L('A weight hanging from a spring', 'Beban yang tergantung pada pegas'))}>
          <rect x={0} y={0} width={120} height={210} className="tanframe" />
          <line x1={20} y1={top} x2={100} y2={top} className="tanaxis" />
          <polyline points={zig.join(' ')} className="tancurve faint" style={{ opacity: 0.8 }} fill="none" />
          <line x1={14} y1={restY} x2={106} y2={restY} className="tannorm" />
          <rect x={44} y={weightY - 14} width={32} height={28} rx={4} className="pythsqb" />
          <text x={108} y={restY - 4} className="tanlabel" textAnchor="end">s = 0</text>
        </svg>
        <div style={{ flex: 1, minWidth: '14em' }}>
          <p>
            <Tex src={`s=${show(A, sep)}\\cos t=${show(m.s, sep).replace('−', '-')}`} />
          </p>
          <p>
            <Tex src={`v=-${show(A, sep)}\\sin t=${show(m.v, sep).replace('−', '-')}`} />
          </p>
          <p>
            <Tex src={`a=-${show(A, sep)}\\cos t=${show(m.a, sep).replace('−', '-')}=-s`} />
          </p>
          <p className="okline">
            {tc(L('speed', 'laju'))} |v| = <b>{show(Math.abs(m.v), sep)}</b>{' '}
            {Math.abs(m.v) < 0.05 * A ? tc(L('(the weight turns round)', '(beban berbalik arah)')) : Math.abs(m.s) < 0.05 * A ? tc(L('(the rest position: greatest speed)', '(posisi diam: laju terbesar)')) : ''}
          </p>
        </div>
      </div>
      <Plot
        xr={[0, T]}
        yr={[-A * 1.25, A * 1.25]}
        curves={[
          { f: (u) => A * Math.cos(u), cls: 'tancurve' },
          { f: (u) => -A * Math.sin(u), cls: 'tancurve sec' },
        ]}
        vlines={[{ x: t, cls: 'tannorm' }]}
        dots={[
          { x: t, y: m.s },
          { x: t, y: m.v, cls: 'tandot sec' },
        ]}
        label={tc(L('The position (green) and the velocity (orange) of the weight', 'Posisi (hijau) dan kecepatan (jingga) beban'))}
      />
      <p className="small muted">{tc(L('Period 2π, amplitude A: the acceleration is always the negative of the displacement (Hooke’s law).', 'Periode 2π, amplitudo A: percepatan selalu negatif dari simpangan (hukum Hooke).'))}</p>
    </Frame>
  )
}
