import { useState } from 'react'
import { useI18n } from '../../i18n'
import {
  canArea,
  canBest,
  canHeight,
  costOf,
  deliveryBest,
  deliveryCost,
  marginalCost,
  profitAt,
  profitInfo,
  snellBest,
  snellTime,
  solveProblem,
  type CanMode,
  type EndBeh,
  type Row,
} from '../../lib/optimize'
import { PROBLEMS } from '../../lib/optproblems'
import { evalFloat } from '../../lib/chain'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'

const four = (x: number, sep: string): string => show(Number(x.toPrecision(5)), sep)

/** TeX with the decimal mark of the Indonesian pages. */
const useTexDec = (): ((s: string) => string) => {
  const { lang } = useI18n()
  return (s) => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
}

/* ------------------------------------------------------- the gallery of textbook problems */

const limitText = (b: EndBeh | undefined, sep: string): string => {
  if (!b) return ''
  if (b.kind === 'inf') return '+∞'
  if (b.kind === 'ninf') return '−∞'
  return four(b.value, sep)
}

export function OptProblems() {
  const { tc } = useI18n()
  const sep = useSep()
  const tdec = useTexDec()
  const [id, setId] = useState('box')
  const q = PROBLEMS.find((k) => k.id === id) ?? PROBLEMS[0]
  const r = solveProblem(q)
  const intervalTex = tdec(q.domainTex)
  const kindText = (w: Row): string => {
    if (w.kind === 'critical') return tc(L("f′ = 0", "f′ = 0"))
    return w.fx === null ? tc(L('open end: not in the domain', 'ujung terbuka: bukan bagian domain')) : tc(L('endpoint', 'ujung'))
  }
  let body = null
  if (r.ok) {
    const best = r.best
    const asks = q.ask(best.x, best.fx)
    const openEnds = r.rows.filter((w) => w.limit)
    const wide = openEnds.length > 0
    const word = q.want === 'max' ? tc(L('largest', 'terbesar')) : tc(L('smallest', 'terkecil'))
    body = (
      <>
        <Plot
          xr={r.xr}
          yr={r.yr}
          curves={[{ f: (x) => evalFloat(r.f, x), cls: 'tancurve' }]}
          vlines={[{ x: best.x, cls: 'tannorm' }]}
          dots={[
            ...r.rows.filter((w) => w.fx !== null && w.kind !== 'critical').map((w) => ({ x: w.x, y: w.fx as number })),
            { x: best.x, y: best.fx, cls: 'tandot sec' },
          ]}
          label={tc(L('The graph of the objective on its domain, with the best point marked', 'Grafik fungsi tujuan pada domainnya, dengan titik terbaik ditandai'))}
        />
        {wide && <p className="small muted">{tc(L('The picture shows a window of the domain; the open ends are described in the table.', 'Gambar menampilkan sebagian domain; ujung yang terbuka dijelaskan di tabel.'))}</p>}
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>x</th>
                <th>{tc(L('why a candidate', 'mengapa kandidat'))}</th>
                <th>f(x)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {r.rows.map((w, i) => (
                <tr key={i} className={w.kind === 'critical' && Math.abs(w.x - best.x) < 1e-9 * (1 + Math.abs(best.x)) ? 'hi' : w.fx !== null && w.kind !== 'critical' && Math.abs(w.x - best.x) < 1e-12 ? 'hi' : ''}>
                  <td>{w.limit ? `${w.x === Infinity ? '+∞' : four(w.x, sep)}${w.x === Infinity ? '' : w.kind === 'start' ? '⁺' : '⁻'}` : four(w.x, sep)}</td>
                  <td>{kindText(w)}</td>
                  <td>{w.limit ? `→ ${limitText(w.limit, sep)}` : four(w.fx as number, sep)}</td>
                  <td>{w.fx !== null && Math.abs(w.x - best.x) < 1e-9 * (1 + Math.abs(best.x)) ? word : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wgtout" aria-live="polite">
          {best.at === 'critical' && (
            <p className="small">
              <Tex src={tdec(`f''(${four(best.x, '.')})=${four(r.second, '.')}${r.second > 0 ? '>0' : '<0'}`)} />{' '}
              {r.second > 0 ? tc(L('concave up: a local minimum', 'cekung ke atas: minimum lokal')) : tc(L('concave down: a local maximum', 'cekung ke bawah: maksimum lokal'))}
              {wide && q.want === 'min' ? ' · ' + tc(L('and f grows without bound at the open ends, so it is the absolute minimum', 'dan f membesar tanpa batas di ujung terbuka, jadi ini minimum mutlak')) : ''}
            </p>
          )}
          <p className="okline">
            {asks.map((a, i) => (
              <span key={i}>
                {i > 0 ? ' · ' : ''}
                {tc(a.label)} = <b>{four(a.value, sep)}</b>
                {a.unit ? ' ' + tc(a.unit) : ''}
              </span>
            ))}
            .
          </p>
        </div>
      </>
    )
  }
  return (
    <Frame name="optproblems">
      <div className="chips">
        {PROBLEMS.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            {tc(k.name)}
          </button>
        ))}
      </div>
      <p>{tc(q.statement)}</p>
      <ol className="lhsteps">
        <li>
          <Tex src="x" /> = {tc(q.variable)}
        </li>
        {q.lines.map((ln, i) => (
          <li key={i}>
            <Tex src={tdec(ln)} />
          </li>
        ))}
        <li>
          <Tex src={intervalTex} />
        </li>
      </ol>
      {body}
    </Frame>
  )
}

/* -------------------------------------------------------------------- the can of a given volume */

const CAN_MODES: { id: CanMode; name: { en: string; id: string } }[] = [
  { id: 'closed', name: { en: 'closed can', id: 'kaleng tertutup' } },
  { id: 'open', name: { en: 'open top', id: 'tanpa tutup' } },
  { id: 'waste', name: { en: 'with waste', id: 'dengan sisa potongan' } },
]

export function CanDesigner() {
  const { tc } = useI18n()
  const sep = useSep()
  const tdec = useTexDec()
  const [mode, setMode] = useState<CanMode>('closed')
  const [V, setV] = useState(1000)
  const [t, setT] = useState(0.25)
  const b = canBest(mode, V)
  const r = b.r * 3 ** (2 * t - 1)
  const h = canHeight(V, r)
  const area = canArea(mode, V, r)
  const lo = b.r / 3
  const hi = b.r * 3
  const aTex = mode === 'closed' ? `A(r)=2\\pi r^2+\\dfrac{${2 * V}}{r}` : mode === 'open' ? `A(r)=\\pi r^2+\\dfrac{${2 * V}}{r}` : `A(r)=8r^2+\\dfrac{${2 * V}}{r}`
  const sc = Math.min(130 / h, 170 / (2 * r))
  const cx = 220
  const cy = 110
  const rx = r * sc
  const ry = Math.max(4, rx * 0.22)
  const hh = h * sc
  const top = cy - hh / 2
  const bottom = cy + hh / 2
  const ratioTxt = mode === 'closed' ? 'h=2r' : mode === 'open' ? 'h=r' : `\\dfrac{h}{r}=\\dfrac{8}{\\pi}\\approx 2.55`
  const note =
    mode === 'closed'
      ? L('Two circular ends and a wall: the best can is as tall as it is wide.', 'Dua tutup lingkaran dan satu dinding: kaleng terbaik setinggi lebarnya.')
      : mode === 'open'
        ? L('With no lid the ends cost half as much, so the best can is shorter: its height equals its radius.', 'Tanpa tutup, biaya bagian ujung separuhnya, sehingga kaleng terbaik lebih pendek: tingginya sama dengan jari-jarinya.')
        : L('The top and bottom are cut from squares of side 2r, so the ends cost 8r², and the best can is taller and thinner: h/r = 8/π.', 'Tutup dan alas dipotong dari persegi bersisi 2r, sehingga biayanya 8r², dan kaleng terbaik lebih tinggi dan lebih ramping: h/r = 8/π.')
  return (
    <Frame name="optcan">
      <div className="chips">
        {CAN_MODES.map((m) => (
          <button key={m.id} className={`chip ${mode === m.id ? 'on' : ''}`} onClick={() => setMode(m.id)} aria-pressed={mode === m.id}>
            {tc(m.name)}
          </button>
        ))}
      </div>
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('volume', 'volume'))} V = <b>{four(V, sep)}</b> cm³
          <input type="range" min={250} max={2000} step={50} value={V} aria-label="V" onChange={(e) => setV(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('radius', 'jari-jari'))} r = <b>{four(r, sep)}</b> cm
          <input type="range" min={0} max={1} step={0.005} value={t} aria-label="r" onChange={(e) => setT(Number(e.target.value))} />
        </label>
      </div>
      <svg viewBox="0 0 440 220" className="dersvg" role="img" aria-label={tc(L('A cylinder of the chosen radius and the height that holds the volume', 'Sebuah tabung berjari-jari terpilih dan tinggi yang memuat volume itu'))}>
        <rect x={0} y={0} width={440} height={220} className="tanframe" />
        <path d={`M${cx - rx},${top} L${cx - rx},${bottom} A${rx},${ry} 0 0 0 ${cx + rx},${bottom} L${cx + rx},${top}`} style={{ fill: 'var(--fig-a)', opacity: 0.25 }} className="tancurve" />
        <ellipse cx={cx} cy={top} rx={rx} ry={ry} style={{ fill: mode === 'open' ? 'var(--surface)' : 'var(--fig-a)', opacity: mode === 'open' ? 1 : 0.45 }} className="tancurve" />
      </svg>
      <Plot
        xr={[lo, hi]}
        yr={[b.area * 0.85, b.area * 2.2]}
        curves={[{ f: (x) => canArea(mode, V, x), cls: 'tancurve' }]}
        vlines={[{ x: b.r, cls: 'tannorm' }, { x: r, cls: 'tantan faint' }]}
        dots={[{ x: b.r, y: b.area, cls: 'tandot sec' }, { x: r, y: Math.min(area, b.area * 2.2) }]}
        label={tc(L('The metal used as a function of the radius', 'Logam yang terpakai sebagai fungsi jari-jari'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={tdec(aTex)} />
        </p>
        <p>
          {tc(L('this can', 'kaleng ini'))}: r = <b>{four(r, sep)}</b>, h = <b>{four(h, sep)}</b>, A = <b>{four(area, sep)}</b> cm². {area > b.area * 1.0005 ? tc(L('That is', 'Itu')) + ' ' + four(((area - b.area) / b.area) * 100, sep) + '% ' + tc(L('more metal than the best can.', 'lebih banyak logam daripada kaleng terbaik.')) : ''}
        </p>
        <p className="okline">
          {tc(L('best can', 'kaleng terbaik'))}: r = <b>{four(b.r, sep)}</b> cm, h = <b>{four(b.h, sep)}</b> cm, A = <b>{four(b.area, sep)}</b> cm²; <Tex src={tdec(ratioTxt)} />
        </p>
        <p className="small">{tc(note)}</p>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------- the quickest path of light */

export function LightPath() {
  const { tc } = useI18n()
  const sep = useSep()
  const tdec = useTexDec()
  const [mirror, setMirror] = useState(false)
  const [a, setA] = useState(3)
  const [bb, setBb] = useState(4)
  const [d, setD] = useState(8)
  const [c1, setC1] = useState(2)
  const [c2, setC2] = useState(1)
  const [t, setT] = useState(0.2)
  const s = { a, b: bb, d, c1, c2: mirror ? c1 : c2 }
  const best = snellBest(s)
  const x = t * d
  const time = snellTime(s, x)
  const sc = Math.min(360 / d, 95 / Math.max(a, bb))
  const x0 = 40
  const y0 = 110
  const px = (u: number) => x0 + u * sc
  const py = (v: number) => y0 + v * sc // v is measured downward
  const A = { x: px(0), y: py(-a) }
  const B = { x: px(d), y: py(mirror ? -bb : bb) }
  const P = (u: number) => ({ x: px(u), y: y0 })
  const sin1 = Math.sin(best.theta1)
  const sin2 = Math.sin(best.theta2)
  const deg = (v: number) => (v * 180) / Math.PI
  const lo = 0
  const hi = d
  const ys = [snellTime(s, 0), snellTime(s, d), best.t]
  return (
    <Frame name="snell">
      <div className="chips">
        <button className={`chip ${!mirror ? 'on' : ''}`} onClick={() => setMirror(false)} aria-pressed={!mirror}>
          {tc(L('refraction (two media)', 'pembiasan (dua medium)'))}
        </button>
        <button className={`chip ${mirror ? 'on' : ''}`} onClick={() => setMirror(true)} aria-pressed={mirror}>
          {tc(L('reflection (mirror)', 'pemantulan (cermin)'))}
        </button>
      </div>
      <div className="amctl">
        <label className="lbl slider">
          a = <b>{four(a, sep)}</b>
          <input type="range" min={1} max={8} step={0.5} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          b = <b>{four(bb, sep)}</b>
          <input type="range" min={1} max={8} step={0.5} value={bb} aria-label="b" onChange={(e) => setBb(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          d = <b>{four(d, sep)}</b>
          <input type="range" min={2} max={12} step={0.5} value={d} aria-label="d" onChange={(e) => setD(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          c₁ = <b>{four(c1, sep)}</b>
          <input type="range" min={0.5} max={3} step={0.1} value={c1} aria-label="c1" onChange={(e) => setC1(Number(e.target.value))} />
        </label>
        {!mirror && (
          <label className="lbl slider">
            c₂ = <b>{four(c2, sep)}</b>
            <input type="range" min={0.5} max={3} step={0.1} value={c2} aria-label="c2" onChange={(e) => setC2(Number(e.target.value))} />
          </label>
        )}
        <label className="lbl slider">
          x = <b>{four(x, sep)}</b>
          <input type="range" min={0} max={1} step={0.002} value={t} aria-label="x" onChange={(e) => setT(Number(e.target.value))} />
        </label>
      </div>
      <svg viewBox="0 0 440 230" className="dersvg" role="img" aria-label={tc(L('A ray from A to B through a point on the surface, and the quickest ray', 'Sinar dari A ke B melalui sebuah titik di permukaan, dan sinar tercepat'))}>
        <rect x={0} y={0} width={440} height={230} className="tanframe" />
        {!mirror && <rect x={0} y={y0} width={440} height={230 - y0} style={{ fill: 'var(--fig-a)', opacity: 0.12 }} />}
        <line x1={0} x2={440} y1={y0} y2={y0} className="tanaxis" />
        <line x1={P(best.x).x} x2={P(best.x).x} y1={y0 - 80} y2={y0 + (mirror ? 0 : 80)} className="tantan faint" />
        <line x1={A.x} y1={A.y} x2={P(x).x} y2={y0} className="tansec" />
        <line x1={P(x).x} y1={y0} x2={B.x} y2={B.y} className="tansec" />
        <line x1={A.x} y1={A.y} x2={P(best.x).x} y2={y0} className="tantan" />
        <line x1={P(best.x).x} y1={y0} x2={B.x} y2={B.y} className="tantan" />
        <circle cx={A.x} cy={A.y} r={5} className="tandot" />
        <circle cx={B.x} cy={B.y} r={5} className="tandot" />
        <circle cx={P(x).x} cy={y0} r={4.5} className="tandot" />
        <circle cx={P(best.x).x} cy={y0} r={4.5} className="tandot sec" />
        <text x={A.x + 8} y={A.y - 6} className="tanlabel">A</text>
        <text x={B.x - 14} y={B.y + (mirror ? -8 : 16)} className="tanlabel">B</text>
      </svg>
      <p className="small muted">{tc(L('The travel time against x', 'Waktu tempuh terhadap x'))}</p>
      <Plot
        xr={[lo, hi]}
        yr={[Math.min(...ys) - 0.3 * (Math.max(...ys) - Math.min(...ys)) - 0.05, Math.max(...ys) + 0.1 * (Math.max(...ys) - Math.min(...ys))]}
        curves={[{ f: (u) => snellTime(s, u), cls: 'tancurve' }]}
        vlines={[{ x: best.x, cls: 'tannorm' }, { x, cls: 'tantan faint' }]}
        dots={[{ x: best.x, y: best.t, cls: 'tandot sec' }, { x, y: time }]}
        label={tc(L('The travel time as a function of x', 'Waktu tempuh sebagai fungsi x'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={tdec(`t(x)=\\dfrac{\\sqrt{${four(a * a, '.')}+x^2}}{${four(c1, '.')}}+\\dfrac{\\sqrt{${four(bb * bb, '.')}+(${four(d, '.')}-x)^2}}{${four(s.c2, '.')}}`)} />
        </p>
        <p>
          {tc(L('your path', 'jalurmu'))}: t({four(x, sep)}) = <b>{four(time, sep)}</b>
        </p>
        <p className="okline">
          {tc(L('quickest path', 'jalur tercepat'))}: x = <b>{four(best.x, sep)}</b>, t = <b>{four(best.t, sep)}</b>, θ₁ = <b>{four(deg(best.theta1), sep)}°</b>, θ₂ = <b>{four(deg(best.theta2), sep)}°</b>
        </p>
        <p>
          <Tex src={tdec(`\\dfrac{\\sin\\theta_1}{c_1}=\\dfrac{${four(sin1, '.')}}{${four(c1, '.')}}=${four(sin1 / c1, '.')}`)} />
        </p>
        <p>
          <Tex src={tdec(`\\dfrac{\\sin\\theta_2}{c_2}=\\dfrac{${four(sin2, '.')}}{${four(s.c2, '.')}}=${four(sin2 / s.c2, '.')}`)} />
        </p>
        <p className="small">
          {mirror
            ? tc(L('One medium: the quickest path has equal angles of incidence and reflection.', 'Satu medium: jalur tercepat memiliki sudut datang sama dengan sudut pantul.'))
            : tc(L('At the best point dt/dx = 0, which is exactly Snell’s law: sin θ₁ / c₁ = sin θ₂ / c₂.', 'Di titik terbaik dt/dx = 0, yaitu tepat hukum Snell: sin θ₁ / c₁ = sin θ₂ / c₂.'))}
        </p>
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------- marginal revenue and marginal cost */

export function ProfitTool() {
  const { tc } = useI18n()
  const sep = useSep()
  const tdec = useTexDec()
  const [price, setPrice] = useState(9)
  const [lvl, setLvl] = useState(1.5)
  const info = profitInfo(price)
  const mc = marginalCost(lvl)
  const pr = profitAt(price, lvl)
  const yTop = Math.max(price * 5, costOf(5)) * 1.1
  const pTop = Math.max(info.best.profit, 1) * 1.3
  return (
    <Frame name="profittool">
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('price (marginal revenue)', 'harga (pendapatan marjinal)'))} = <b>{four(price, sep)}</b>
          <input type="range" min={2} max={14} step={0.1} value={price} aria-label="price" onChange={(e) => setPrice(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          x = <b>{four(lvl, sep)}</b> {tc(L('million players', 'juta pemutar'))}
          <input type="range" min={0} max={5} step={0.01} value={lvl} aria-label="x" onChange={(e) => setLvl(Number(e.target.value))} />
        </label>
      </div>
      <p className="small muted">{tc(L('Revenue (orange) and cost (dark), in millions of dollars', 'Pendapatan (oranye) dan biaya (gelap), dalam miliaran rupiah'))}</p>
      <Plot
        xr={[0, 5]}
        yr={[-yTop * 0.05, yTop]}
        curves={[{ f: costOf, cls: 'tancurve' }, { f: (u) => price * u, cls: 'tancurve sec' }]}
        vlines={info.peak !== null && info.peak <= 5 ? [{ x: info.peak, cls: 'tannorm' }, { x: lvl, cls: 'tantan faint' }] : [{ x: lvl, cls: 'tantan faint' }]}
        dots={[
          ...info.breakEven.filter((x) => x <= 5).map((x) => ({ x, y: price * x })),
          { x: lvl, y: costOf(lvl) },
          { x: lvl, y: price * lvl, cls: 'tandot sec' },
        ]}
        label={tc(L('The revenue and the cost as functions of the number produced', 'Pendapatan dan biaya sebagai fungsi banyaknya produksi'))}
      />
      <p className="small muted">{tc(L('The profit p(x) = r(x) − c(x)', 'Laba p(x) = r(x) − c(x)'))}</p>
      <Plot
        xr={[0, 5]}
        yr={[Math.min(-2, profitAt(price, 2 - Math.sqrt(Math.max(price - 3, 0) / 3)) * 1.3, profitAt(price, 0)), pTop]}
        curves={[{ f: (u) => profitAt(price, u), cls: 'tancurve' }]}
        vlines={info.peak !== null && info.peak <= 5 ? [{ x: info.peak, cls: 'tannorm' }] : []}
        dots={[
          ...(info.peak !== null && info.peak <= 5 ? [{ x: info.peak, y: profitAt(price, info.peak), cls: 'tandot sec' }] : []),
          ...(info.loss !== null ? [{ x: info.loss, y: profitAt(price, info.loss), open: true }] : []),
          { x: lvl, y: pr },
        ]}
        label={tc(L('The profit as a function of the number produced', 'Laba sebagai fungsi banyaknya produksi'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={tdec(`r'(x)=${four(price, '.')},\\qquad c'(x)=3x^2-12x+15`)} />
        </p>
        <p>
          x = {four(lvl, sep)}: c′(x) = <b>{four(mc, sep)}</b> {mc < price ? '<' : mc > price ? '>' : '='} r′(x) = {four(price, sep)}; p(x) = <b>{four(pr, sep)}</b>. {mc < price ? tc(L('Another player adds more revenue than cost: produce more.', 'Satu pemutar lagi menambah pendapatan lebih besar daripada biaya: produksi lebih banyak.')) : mc > price ? tc(L('Another player costs more than it brings in: produce less.', 'Satu pemutar lagi menambah biaya lebih besar daripada pendapatan: produksi lebih sedikit.')) : tc(L('Marginal cost equals marginal revenue.', 'Biaya marjinal sama dengan pendapatan marjinal.'))}
        </p>
        {info.peak === null ? (
          <p className="noline">{tc(L('The marginal cost never goes below 3, so a price of 3 or less never rises above it: c′(x) = r′(x) has no solution that matters, the profit only falls, and the best plan is to produce nothing.', 'Biaya marjinal tidak pernah di bawah 3, sehingga harga 3 atau kurang tidak pernah melampauinya: c′(x) = r′(x) tidak punya penyelesaian yang berarti, laba hanya turun, dan rencana terbaik adalah tidak memproduksi.'))}</p>
        ) : (
          <p className="okline">
            c′(x) = r′(x) {tc(L('at', 'di'))} x = <b>{four(info.peak, sep)}</b> {tc(L('(a maximum, p″ < 0) and at', '(maksimum, p″ < 0) dan di'))} x = <b>{four(info.loss as number, sep)}</b> {tc(L('(a maximum loss, p″ > 0)', '(rugi terbesar, p″ > 0)'))}.
          </p>
        )}
        <p className="small">
          {tc(L('Best plan on 0 ≤ x ≤ 5', 'Rencana terbaik pada 0 ≤ x ≤ 5'))}: x = <b>{four(info.best.x, sep)}</b>, p = <b>{four(info.best.profit, sep)}</b>.{' '}
          {info.breakEven.length === 2
            ? tc(L('Break-even at', 'Titik impas di')) + ' x = ' + info.breakEven.map((v) => four(v, sep)).join(' ' + tc(L('and', 'dan')) + ' ') + (info.breakEven[1] > 5 ? ' ' + tc(L('(the second is beyond the range shown)', '(yang kedua di luar rentang yang ditampilkan)')) : '') + '.'
            : tc(L('Revenue never covers the cost, so there is no break-even point.', 'Pendapatan tidak pernah menutup biaya, sehingga tidak ada titik impas.'))}
        </p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------- the delivery schedule */

export function DeliveryTool() {
  const { tc } = useI18n()
  const sep = useSep()
  const tdec = useTexDec()
  const [K, setK] = useState(5000)
  const [d, setD] = useState(5)
  const [h, setH] = useState(10)
  const [x, setX] = useState(7)
  const best = deliveryBest(K, d, h)
  const cost = deliveryCost(K, d, h, x)
  const fl = Math.max(1, Math.floor(best.days))
  const ce = Math.ceil(best.days)
  const hi = best.cost * 3
  return (
    <Frame name="deliverytool">
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('cost of one delivery', 'biaya satu pengiriman'))} = <b>{four(K, sep)}</b>
          <input type="range" min={1000} max={10000} step={500} value={K} aria-label="K" onChange={(e) => setK(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('units used per day', 'satuan terpakai per hari'))} = <b>{four(d, sep)}</b>
          <input type="range" min={1} max={10} step={1} value={d} aria-label="d" onChange={(e) => setD(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('storage per unit per day', 'penyimpanan per satuan per hari'))} = <b>{four(h, sep)}</b>
          <input type="range" min={2} max={30} step={1} value={h} aria-label="h" onChange={(e) => setH(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          x = <b>{four(x, sep)}</b> {tc(L('days between deliveries', 'hari antar pengiriman'))}
          <input type="range" min={1} max={40} step={0.5} value={x} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
        </label>
      </div>
      <Plot
        xr={[0.5, 40]}
        yr={[0, hi]}
        curves={[
          { f: (u) => K / u, cls: 'tancurve faint' },
          { f: (u) => (h * d * u) / 2, cls: 'tancurve faint' },
          { f: (u) => deliveryCost(K, d, h, u), cls: 'tancurve' },
        ]}
        vlines={[{ x: best.days, cls: 'tannorm' }, { x, cls: 'tantan faint' }]}
        dots={[{ x: best.days, y: best.cost, cls: 'tandot sec' }, { x, y: Math.min(cost, hi) }]}
        label={tc(L('The average daily cost: delivery part, storage part and their sum', 'Biaya harian rata-rata: bagian pengiriman, bagian penyimpanan, dan jumlahnya'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={tdec(`c(x)=\\dfrac{${four(K, '.')}}{x}+${four((h * d) / 2, '.')}\\,x`)} />
        </p>
        <p>
          c({four(x, sep)}) = <b>{four(cost, sep)}</b>
        </p>
        <p className="okline">
          {tc(L('best cycle', 'siklus terbaik'))}: x = <Tex src={tdec(`\\sqrt{\\dfrac{2K}{hd}}`)} /> = <b>{four(best.days, sep)}</b> {tc(L('days', 'hari'))}, {tc(L('order', 'pesan'))} <b>{four(best.units, sep)}</b> {tc(L('units', 'satuan'))}, c = <b>{four(best.cost, sep)}</b>
        </p>
        <p className="small">
          {tc(L('At the best cycle the delivery cost per day and the storage cost per day are equal:', 'Pada siklus terbaik biaya pengiriman per hari dan biaya penyimpanan per hari sama besar:'))} {four(K / best.days, sep)} = {four(((h * d) / 2) * best.days, sep)}.{' '}
          {tc(L('Whole days', 'Hari bulat'))}: {fl} → {four(deliveryCost(K, d, h, fl), sep)}, {ce} → {four(deliveryCost(K, d, h, ce), sep)}.
        </p>
      </div>
    </Frame>
  )
}

