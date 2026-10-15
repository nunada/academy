import { useState } from 'react'
import { useI18n } from '../../i18n'
import { INVTRIGS, bestDistance, maxViewAngle, refTriangle, viewAngle, viewAngleSlope } from '../../lib/invtrig'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'

/** A number for a formula: the reader's decimal mark and an ASCII minus. */
const tx = (x: number, sep: string): string => show(x, sep).replace('−', '-')
const deg = (r: number): number => (r * 180) / Math.PI

/* ------------------------------------------- a graph, its slope, and the slope's graph */

export function InverseTrigSlope() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState<string>('arcsin')
  const g = INVTRIGS.find((k) => k.id === id) ?? INVTRIGS[0]
  const [x0, x1] = g.xr
  const [x, setX] = useState(0.5)
  const xv = Math.min(x1, Math.max(x0, x))
  const fv = g.f(xv)
  const dv = g.d(xv)
  const defined = Number.isFinite(fv) && Number.isFinite(dv)
  const L1 = (x1 - x0) / 12
  const showTan = defined && Math.abs(dv) < 12
  return (
    <Frame name="invtrigslope">
      <div className="chips">
        {INVTRIGS.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            <Tex src={`y=${k.tex}`} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          x = <b>{show(xv, sep)}</b>
          <input type="range" min={x0} max={x1} step={(x1 - x0) / 400} value={xv} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
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
        label={tc(L('The graph of an inverse trigonometric function with a tangent line', 'Grafik fungsi trigonometri invers dengan garis singgung'))}
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
        dots={Number.isFinite(dv) && Math.abs(dv) < 1e3 ? [{ x: xv, y: dv, cls: 'tandot sec' }] : []}
        label={tc(L('The graph of the derivative', 'Grafik turunannya'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={g.dtex} />
        </p>
        <p className="small">
          {tc(L('Domain', 'Domain'))}: {g.domain[lang]} · {tc(L('range', 'jangkauan'))}: {g.range[lang]}
        </p>
        <p className={defined ? 'okline' : 'noline'}>
          {defined
            ? `${tc(L('at this x:', 'di x ini:'))} ${show(fv, sep)} (${show(deg(fv), sep)}°)${tc(L(', slope', ', gradien'))} ${show(dv, sep)}`
            : tc(L('The function is not defined at this x, or has a vertical tangent line here.', 'Fungsi tidak terdefinisi di x ini, atau memiliki garis singgung tegak di sini.'))}
        </p>
        <p className="small">{g.note[lang]}</p>
      </div>
    </Frame>
  )
}

/* --------------------------------------------------------------- the reference triangle */

type TriId = 'arcsin' | 'arctan' | 'arcsec'

export function ReferenceTriangle() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState<TriId>('arcsin')
  const range: Record<TriId, [number, number, number]> = { arcsin: [0.05, 0.95, 0.6], arctan: [0.05, 5, 0.75], arcsec: [1.05, 5, 1.25] }
  const [lo, hi] = range[id]
  const [x, setX] = useState(0.6)
  const xv = Math.min(hi, Math.max(lo, x))
  const t = refTriangle(id, xv)
  // draw with the longest side 280 wide at most
  const long = Math.max(t.adj, t.opp)
  const k = 240 / long
  const ax = 30
  const ay = 250
  const bx = ax + t.adj * k
  const cy = ay - t.opp * k
  const names: Record<TriId, { tex: string; dtex: string }> = {
    arcsin: { tex: '\\arcsin x', dtex: `\\frac{1}{\\cos\\theta}=\\frac{1}{\\sqrt{1-x^2}}=\\frac{1}{${tx(t.adj, sep)}}=${tx(1 / t.adj, sep)}` },
    arctan: { tex: '\\arctan x', dtex: `\\frac{1}{\\sec^2\\theta}=\\frac{1}{1+x^2}=\\frac{1}{${tx(t.hyp * t.hyp, sep)}}=${tx(1 / (t.hyp * t.hyp), sep)}` },
    arcsec: { tex: '\\arcsec x', dtex: `\\frac{1}{\\sec\\theta\\tan\\theta}=\\frac{1}{x\\sqrt{x^2-1}}=\\frac{1}{${tx(t.hyp * t.opp, sep)}}=${tx(1 / (t.hyp * t.opp), sep)}` },
  }
  const defn: Record<TriId, string> = {
    arcsin: `\\sin\\theta=x=\\frac{\\text{opposite}}{\\text{hypotenuse}}`,
    arctan: `\\tan\\theta=x=\\frac{\\text{opposite}}{\\text{adjacent}}`,
    arcsec: `\\sec\\theta=x=\\frac{\\text{hypotenuse}}{\\text{adjacent}}`,
  }
  return (
    <Frame name="reftriangle">
      <div className="chips">
        {(['arcsin', 'arctan', 'arcsec'] as TriId[]).map((k) => (
          <button
            key={k}
            className={`chip ${id === k ? 'on' : ''}`}
            onClick={() => {
              setId(k)
              setX(range[k][2])
            }}
            aria-pressed={id === k}
          >
            <Tex src={`\\theta=${names[k].tex}`} />
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          x = <b>{show(xv, sep)}</b>
          <input type="range" min={lo} max={hi} step={0.01} value={xv} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
        </label>
      </div>
      <svg viewBox="0 0 330 290" className="dersvg" style={{ maxWidth: 330 }} role="img" aria-label={tc(L('The right triangle that has the angle θ = arcsin x, arctan x or arcsec x', 'Segitiga siku-siku yang memiliki sudut θ = arcsin x, arctan x, atau arcsec x'))}>
        <rect x={0} y={0} width={330} height={290} className="tanframe" />
        <polygon points={`${ax},${ay} ${bx},${ay} ${bx},${cy}`} className="pythsqb" />
        <rect x={bx - 12} y={ay - 12} width={12} height={12} className="tanframe" fill="none" />
        <path d={`M${ax + 34},${ay} A34,34 0 0 0 ${ax + 34 * Math.cos(t.theta)},${ay - 34 * Math.sin(t.theta)}`} className="tancurve sec" fill="none" />
        <text x={ax + 44} y={ay - 8} className="tanlabel">θ</text>
        <text x={(ax + bx) / 2} y={ay + 20} className="tanlabel" textAnchor="middle">{tc(L('adjacent', 'samping'))} {show(t.adj, sep)}</text>
        <text x={bx + 6} y={(ay + cy) / 2} className="tanlabel" textAnchor="start" style={{ writingMode: 'vertical-rl' }}>{tc(L('opposite', 'depan'))} {show(t.opp, sep)}</text>
        <text x={(ax + bx) / 2 - 6} y={(ay + cy) / 2 - 10} className="tanlabel" textAnchor="end">{tc(L('hypotenuse', 'sisi miring'))} {show(t.hyp, sep)}</text>
      </svg>
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`\\theta=${names[id].tex}=${tx(t.theta, sep)}\\ \\text{rad}\\ (${tx(deg(t.theta), sep)}^\\circ),\\qquad ${defn[id]}`} />
        </p>
        <p className="okline">
          <Tex src={`\\frac{d}{dx}${names[id].tex}=${names[id].dtex}`} />
        </p>
        <p className="small">{tc(L('The third side comes from Pythagoras, and the derivative from the triangle: it is the reciprocal of the derivative of the trigonometric function, written in x. Negative x gives the mirror image.', 'Sisi ketiga berasal dari Pythagoras, dan turunannya dari segitiga: ia kebalikan turunan fungsi trigonometri, ditulis dalam x. x negatif memberi bayangan cerminnya.'))}</p>
      </div>
    </Frame>
  )
}

/* --------------------------------------------------------------- the viewing angle */

export function ViewingAngle() {
  const { tc } = useI18n()
  const sep = useSep()
  const [p, setP] = useState(1)
  const [q, setQ] = useState(3)
  const [x, setX] = useState(6)
  const qv = Math.max(q, p + 0.5)
  const best = bestDistance(p, qv)
  const top = maxViewAngle(p, qv)
  const a = viewAngle(p, qv, x)
  const s = viewAngleSlope(p, qv, x)
  const yMax = Math.ceil(deg(top) / 10) * 10 + 10
  return (
    <Frame name="viewangle">
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('lower edge', 'tepi bawah'))} p = <b>{show(p, sep)}</b> m
          <input type="range" min={0.5} max={4} step={0.5} value={p} aria-label="p" onChange={(e) => setP(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('upper edge', 'tepi atas'))} q = <b>{show(qv, sep)}</b> m
          <input type="range" min={1} max={9} step={0.5} value={qv} aria-label="q" onChange={(e) => setQ(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          x = <b>{show(x, sep)}</b> m
          <input type="range" min={0.3} max={14} step={0.1} value={x} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
        </label>
      </div>
      <Plot
        xr={[0, 14]}
        yr={[0, yMax]}
        curves={[{ f: (t) => deg(viewAngle(p, qv, t)), cls: 'tancurve' }]}
        vlines={[
          { x: best, cls: 'tannorm' },
          { x, cls: 'tantan faint' },
        ]}
        dots={[{ x, y: deg(a) }, { x: best, y: deg(top), cls: 'tandot sec' }]}
        label={tc(L('The viewing angle in degrees against the distance from the wall', 'Sudut pandang dalam derajat terhadap jarak dari dinding'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`\\theta(x)=\\arctan\\frac{${show(qv, sep)}}{x}-\\arctan\\frac{${show(p, sep)}}{x}`.replace(/−/g, '-')} />
        </p>
        <p className="okline">
          {tc(L('at this distance', 'pada jarak ini'))}: θ = <b>{show(deg(a), sep)}°</b>, <Tex src={`\\theta'(x)=-\\frac{${show(qv, sep)}}{x^2+${show(qv * qv, sep)}}+\\frac{${show(p, sep)}}{x^2+${show(p * p, sep)}}=${tx(s, sep)}`.replace(/−/g, '-')} /> {tc(L('rad per metre', 'rad per meter'))}
          {Math.abs(s) < 0.002 ? ` — ${tc(L('the top of the curve', 'puncak kurva'))}` : s > 0 ? ` — ${tc(L('step back: the angle is still growing', 'mundurlah: sudutnya masih membesar'))}` : ` — ${tc(L('step closer: the angle is shrinking as you move away', 'mendekatlah: sudutnya mengecil saat kamu menjauh'))}`}
        </p>
        <p className="small">
          {tc(L('The slope is zero at', 'Gradiennya nol di'))} <Tex src={`x=\\sqrt{pq}=${tx(best, sep)}`} /> {tc(L('metres, where the angle is largest:', 'meter, tempat sudutnya terbesar:'))} <b>{show(deg(top), sep)}°</b>.
        </p>
      </div>
    </Frame>
  )
}
