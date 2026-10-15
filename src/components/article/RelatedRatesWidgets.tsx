import { useState } from 'react'
import { useI18n } from '../../i18n'
import { RR_PRESETS, fmtRate, quantities, solveRates, type RRError, type RRInput } from '../../lib/relatedrates'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'

const tx = (x: number, sep: string): string => show(x, sep).replace('−', '-')

/* ------------------------------------------------ the five steps, on any equation */

const ERR: Record<RRError, { en: string; id: string }> = {
  syntax: { en: 'I could not read that equation. Use letters for the quantities (V, r, x, theta), numbers, + - * / ^, brackets and sin, cos, tan, cot, sec, csc, sqrt, pi, for example V = (4/3) pi r^3.', id: 'Saya tidak dapat membaca persamaan itu. Pakai huruf untuk besaran (V, r, x, theta), bilangan, + - * / ^, kurung, dan sin, cos, tan, cot, sec, csc, sqrt, pi, misalnya V = (4/3) pi r^3.' },
  equation: { en: 'Write one equation with exactly one = sign, such as s^2 = x^2 + y^2.', id: 'Tulis satu persamaan dengan tepat satu tanda =, seperti s^2 = x^2 + y^2.' },
  novars: { en: 'There is no changing quantity in it. Use letters such as x or r.', id: 'Tidak ada besaran yang berubah di dalamnya. Pakai huruf seperti x atau r.' },
  toomany: { en: 'Use at most six quantities.', id: 'Pakai paling banyak enam besaran.' },
  case: { en: 'A capital letter and the same small letter would be read as one quantity. Give them different letters.', id: 'Huruf kapital dan huruf kecil yang sama akan dibaca sebagai satu besaran. Beri huruf yang berbeda.' },
  unknown: { en: 'Choose a quantity that appears in the equation.', id: 'Pilih besaran yang muncul dalam persamaan.' },
  value: { en: 'is not a number. Use numbers such as 1.8, -3, 1/2 or pi/4.', id: 'bukan bilangan. Pakai bilangan seperti 1.8, -3, 1/2, atau pi/4.' },
  unknownrate: { en: 'The rate you are looking for has to be left empty.', id: 'Laju yang dicari harus dikosongkan.' },
  missing: { en: 'has no value. Fill in every value except one, which the equation can give.', id: 'belum punya nilai. Isi semua nilai kecuali satu, yang dapat dihitung dari persamaan.' },
  noroot: { en: 'No value fits the equation together with the other values.', id: 'Tidak ada nilai yang cocok dengan persamaan bersama nilai lainnya.' },
  inconsistent: { en: 'These values do not satisfy the equation: the two sides differ. Check them, or leave one value empty to have it worked out.', id: 'Nilai-nilai ini tidak memenuhi persamaan: kedua ruas berbeda. Periksa kembali, atau kosongkan satu nilai agar dihitung.' },
  singular: { en: 'At this moment the equation does not decide this rate: it multiplies zero in the related rates equation.', id: 'Pada saat ini persamaan tidak menentukan laju ini: ia dikalikan nol dalam persamaan laju terkait.' },
}

export function RatesTool() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const first = RR_PRESETS[0]
  /** The decimal mark of the reader in a typed number: 7.5 or 7,5. */
  const mark = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1,$2') : s)
  const marks = (r: Record<string, string>): Record<string, string> => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, mark(v)]))
  const [preset, setPreset] = useState<string | null>(first.id)
  const [equation, setEquation] = useState(mark(first.input.equation))
  const [values, setValues] = useState<Record<string, string>>(marks(first.input.values))
  const [rates, setRates] = useState<Record<string, string>>(marks(first.input.rates))
  const [find, setFind] = useState(first.input.find)

  const pick = (id: string) => {
    const p = RR_PRESETS.find((q) => q.id === id)
    if (!p) return
    setPreset(id)
    setEquation(mark(p.input.equation))
    setValues(marks(p.input.values))
    setRates(marks(p.input.rates))
    setFind(p.input.find)
  }
  const edit = () => setPreset(null)
  const dotTex = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)

  const qs = quantities(equation)
  const target = qs.includes(find) ? find : (qs[0] ?? '')
  const input: RRInput = { equation, values, rates: { ...rates, [target]: '' }, find: target }
  const p = RR_PRESETS.find((q) => q.id === preset)
  if (p) input.guess = p.input.guess
  const res = qs.length > 0 ? solveRates(input) : null
  const symbol = (q: string) => (q.length > 1 ? `\\${q}` : q)

  let body
  if (!res) {
    body = <p className="noline">{ERR.novars[lang]}</p>
  } else if (!res.ok) {
    const detail = res.detail ?? ''
    const isRate = res.error === 'value' && detail.length > 1 && detail.startsWith('d') && qs.includes(detail.slice(1))
    body = (
      <p className="noline">
        {res.error === 'value' && (
          <>
            {isRate ? `${tc(L('The rate of', 'Laju'))} ` : ''}
            <b>{isRate ? detail.slice(1) : detail}</b>{' '}
          </>
        )}
        {res.error === 'missing' && (
          <>
            <b>{detail.split(',').join(', ')}</b>{' '}
          </>
        )}
        {ERR[res.error][lang]}
      </p>
    )
  } else {
    const ratio = res.rate
    const id = lang === 'id'
    const ans = fmtRate(ratio, id)
      .replace('−', '-')
      .replace(/e([+-]?\d+)/, '\\times 10^{$1}')
      .replace(',', '{,}')
    const unit = p ? p.unit : { en: 'units per unit of time', id: 'satuan per satuan waktu' }
    const mag = fmtRate(Math.abs(ratio), id)
    body = (
      <ol className="small steps">
        <li>
          <b>{tc(L('The equation between the quantities', 'Persamaan antarbesaran'))}:</b> <Tex src={dotTex(res.eqTex)} />
        </li>
        <li>
          <b>{tc(L('Differentiate both sides with respect to t', 'Turunkan kedua ruas terhadap t'))}:</b> <Tex src={dotTex(res.relTex)} />
        </li>
        <li>
          <b>{tc(L('Put in the numbers of this moment', 'Masukkan bilangan pada saat ini'))}:</b> <Tex src={dotTex(res.subTex)} />
          {res.worked && (
            <>
              {' '}
              <span className="muted">
                ({tc(L('the value of', 'nilai'))} <Tex src={symbol(res.worked)} /> {tc(L('was worked out from the equation:', 'dihitung dari persamaan:'))} <Tex src={`${symbol(res.worked)}=${tx(res.used[res.worked], sep)}`} />)
              </span>
            </>
          )}
        </li>
        <li>
          <b>{tc(L('Solve for the unknown rate', 'Selesaikan untuk laju yang dicari'))}:</b> <Tex src={`${res.findTex}\\approx ${ans}`} />
        </li>
        <li className="okline">
          {ratio === 0
            ? tc(L(`${target} is not changing at this moment.`, `${target} tidak berubah pada saat ini.`))
            : ratio < 0
              ? tc(L(`${target} is decreasing at this moment, at ${mag} ${unit.en}.`, `${target} berkurang pada saat ini, dengan laju ${mag} ${unit.id}.`))
              : tc(L(`${target} is increasing at this moment, at ${mag} ${unit.en}.`, `${target} bertambah pada saat ini, dengan laju ${mag} ${unit.id}.`))}
          {p?.book !== undefined && p.source.startsWith('Thomas, Example') && (
            <>
              {' '}
              <span className="muted">{tc(L(`The book gives ${fmtRate(p.book, false)}.`, `Buku memberi ${fmtRate(p.book, true)}.`))}</span>
            </>
          )}
        </li>
      </ol>
    )
  }

  return (
    <Frame name="ratestool">
      <div className="chips">
        {RR_PRESETS.map((q) => (
          <button key={q.id} className={`chip ${preset === q.id ? 'on' : ''}`} onClick={() => pick(q.id)} aria-pressed={preset === q.id}>
            {tc(q.title)}
          </button>
        ))}
      </div>
      {p && (
        <p className="small muted">
          {tc(p.story)} ({p.source})
        </p>
      )}
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          {tc(L('equation', 'persamaan'))} <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={equation} aria-label={tc(L('equation', 'persamaan'))} onChange={(e) => { setEquation(e.target.value); edit() }} />
        </label>
      </div>
      {qs.length > 0 && qs.length <= 6 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>{tc(L('quantity', 'besaran'))}</th>
                <th>{tc(L('value now', 'nilai saat ini'))}</th>
                <th>{tc(L('rate of change', 'laju perubahan'))}</th>
                <th>{tc(L('find', 'cari'))}</th>
              </tr>
            </thead>
            <tbody>
              {qs.map((q) => (
                <tr key={q} className={q === target ? 'hi' : ''}>
                  <td>
                    <Tex src={symbol(q)} />
                  </td>
                  <td>
                    <input style={{ width: '5.5em' }} value={values[q] ?? ''} aria-label={`${q} ${tc(L('value now', 'nilai saat ini'))}`} placeholder={tc(L('work out', 'hitung'))} onChange={(e) => { setValues({ ...values, [q]: e.target.value }); edit() }} />
                  </td>
                  <td>
                    {q === target ? (
                      <span className="muted">?</span>
                    ) : (
                      <input style={{ width: '5.5em' }} value={rates[q] ?? ''} aria-label={`${tc(L('rate of', 'laju'))} ${q}`} placeholder="0" onChange={(e) => { setRates({ ...rates, [q]: e.target.value }); edit() }} />
                    )}
                  </td>
                  <td>
                    <input type="radio" name="rr-find" checked={q === target} aria-label={`${tc(L('find the rate of', 'cari laju'))} ${q}`} onChange={() => { setFind(q); edit() }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------ a ladder sliding down a wall */

export function Ladder() {
  const { tc } = useI18n()
  const sep = useSep()
  const [len, setLen] = useState(5)
  const [x, setX] = useState(3)
  const [v, setV] = useState(2)
  const xv = Math.min(x, len - 0.05)
  const y = Math.sqrt(len * len - xv * xv)
  const rate = -(xv / y) * v
  // the same by a short step in time, from the geometry alone
  const dt = 1e-4
  const at = (t: number) => Math.sqrt(Math.max(0, len * len - (xv + v * t) ** 2))
  const cd = (at(dt) - at(-dt)) / (2 * dt)
  const s = 150 / len
  const fx = 46 + xv * s
  const ty = 186 - y * s
  const crossing = len / Math.SQRT2
  const dx = (t: number) => (t < len - 1e-9 ? -(t / Math.sqrt(len * len - t * t)) * v : NaN)
  const yMin = -Math.max(6, 4 * v)
  return (
    <Frame name="ladder">
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('ladder length', 'panjang tangga'))} = <b>{show(len, sep)}</b> m
          <input type="range" min={3} max={8} step={0.5} value={len} aria-label="L" onChange={(e) => setLen(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('foot of the ladder', 'kaki tangga'))} x = <b>{show(xv, sep)}</b> m
          <input type="range" min={0.2} max={len - 0.05} step={0.05} value={xv} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('foot speed', 'kecepatan kaki'))} dx/dt = <b>{show(v, sep)}</b> {tc(L('m/s', 'm/detik'))}
          <input type="range" min={0.5} max={4} step={0.5} value={v} aria-label="dx/dt" onChange={(e) => setV(Number(e.target.value))} />
        </label>
      </div>
      <svg viewBox="0 0 440 210" className="dersvg" role="img" aria-label={tc(L('A ladder leaning on a wall with its foot being pulled away', 'Tangga bersandar pada dinding dengan kakinya ditarik menjauh'))}>
        <rect x={0} y={0} width={440} height={210} className="tanframe" />
        <line x1={46} y1={10} x2={46} y2={186} className="tanaxis" style={{ strokeWidth: 3 }} />
        <line x1={46} y1={186} x2={430} y2={186} className="tanaxis" style={{ strokeWidth: 3 }} />
        <line x1={46} y1={ty} x2={fx} y2={186} className="tantan wide" style={{ opacity: 1, stroke: 'var(--fig-a)' }} />
        <line x1={46} y1={186} x2={fx} y2={186} className="tantan" style={{ stroke: 'var(--fig-b)', strokeWidth: 3 }} />
        <line x1={46} y1={ty} x2={46} y2={186} className="tantan" style={{ stroke: 'var(--fig-result)', strokeWidth: 3 }} />
        <circle cx={fx} cy={186} r={4.5} className="tandot sec" />
        <circle cx={46} cy={ty} r={4.5} className="tandot" />
        <text x={(46 + fx) / 2} y={203} textAnchor="middle" className="tanlabel">
          x = {show(xv, sep)} m
        </text>
        <text x={52} y={(ty + 186) / 2} className="tanlabel">
          y = {show(y, sep)} m
        </text>
        <text x={fx + 8} y={176} className="tanlabel" style={{ fill: 'var(--fig-b)' }}>
          →
        </text>
      </svg>
      <p className="small muted">{tc(L('The speed of the top of the ladder against the position of the foot (negative: moving down)', 'Kecepatan ujung atas tangga terhadap posisi kaki (negatif: bergerak turun)'))}</p>
      <Plot
        xr={[0, len]}
        yr={[yMin, 0.5]}
        curves={[{ f: dx, cls: 'tancurve' }]}
        vlines={[{ x: crossing, cls: 'tannorm' }, { x: xv, cls: 'tantan faint' }]}
        dots={Number.isFinite(rate) && rate > yMin ? [{ x: xv, y: rate }] : []}
        label={tc(L('The speed of the top of the ladder against the foot position', 'Kecepatan ujung atas tangga terhadap posisi kaki'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`x^2+y^2=${tx(len * len, sep)}\\;\\Rightarrow\\;2x\\frac{dx}{dt}+2y\\frac{dy}{dt}=0`} />
        </p>
        <p>
          <Tex src={`\\frac{dy}{dt}=-\\frac{x}{y}\\frac{dx}{dt}=-\\frac{${tx(xv, sep)}}{${tx(y, sep)}}\\cdot ${tx(v, sep)}=${tx(rate, sep)}`} />
        </p>
        <p className="okline">
          {tc(L('The top slides down at', 'Ujung atas meluncur turun dengan'))} <b>{show(Math.abs(rate), sep)}</b> {tc(L('m/s', 'm/detik'))}, {tc(L('a short step in time gives', 'langkah waktu yang pendek memberi'))} {show(Number(Math.abs(cd).toPrecision(4)), sep)} {tc(L('m/s', 'm/detik'))}.
        </p>
        <p className="small">
          {xv < crossing - 0.005
            ? tc(L('The foot is still moving faster than the top.', 'Kaki masih bergerak lebih cepat daripada ujung atas.'))
            : tc(L('The top is now moving faster than the foot, and the speed grows without bound as the foot nears the full length of the ladder.', 'Ujung atas kini bergerak lebih cepat daripada kaki, dan kecepatannya membesar tanpa batas saat kaki mendekati panjang penuh tangga.'))}{' '}
          {tc(L(`The two speeds are equal at x = L/√2 = ${show(Number(crossing.toPrecision(3)), sep)} m (dashed line).`, `Kedua kecepatan sama besar di x = L/√2 = ${show(Number(crossing.toPrecision(3)), sep)} m (garis putus-putus).`))}
        </p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------- water filling a conical tank */

const TANK_H = 3
const TANK_R = 1.5

export function ConeFill() {
  const { tc } = useI18n()
  const sep = useSep()
  const [q, setQ] = useState(0.25)
  const [y, setY] = useState(1.8)
  // V = (1/3) π x² y with x = y/2, so V = π y³ / 12 and dV/dt = (π y² / 4) dy/dt
  const rate = (4 * q) / (Math.PI * y * y)
  const tNow = (Math.PI * y ** 3) / (12 * q)
  const tFull = (Math.PI * TANK_H ** 3) / (12 * q)
  const level = (t: number) => (t >= 0 ? Math.cbrt((12 * q * t) / Math.PI) : NaN)
  const w = TANK_R / TANK_H
  const sc = 56
  const cx = 130
  const baseY = 196
  const px = (r: number) => cx + r * sc
  const py = (h: number) => baseY - h * sc
  const span = tFull / 3
  const a = Math.max(0, tNow - span / 2)
  const b = Math.min(tFull, tNow + span / 2)
  return (
    <Frame name="conefill">
      <div className="amctl">
        <label className="lbl slider">
          dV/dt = <b>{show(q, sep)}</b> {tc(L('m³/min', 'm³/menit'))}
          <input type="range" min={0.05} max={1} step={0.05} value={q} aria-label="dV/dt" onChange={(e) => setQ(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('depth', 'kedalaman'))} y = <b>{show(y, sep)}</b> m
          <input type="range" min={0.2} max={TANK_H} step={0.05} value={y} aria-label="y" onChange={(e) => setY(Number(e.target.value))} />
        </label>
      </div>
      <svg viewBox="0 0 440 210" className="dersvg" role="img" aria-label={tc(L('A conical tank, point down, partly filled with water', 'Tangki kerucut dengan ujung di bawah, terisi sebagian air'))}>
        <rect x={0} y={0} width={440} height={210} className="tanframe" />
        <polygon points={`${px(0)},${py(0)} ${px(-w * y)},${py(y)} ${px(w * y)},${py(y)}`} style={{ fill: 'var(--fig-a)', opacity: 0.45 }} />
        <polyline points={`${px(-TANK_R)},${py(TANK_H)} ${px(0)},${py(0)} ${px(TANK_R)},${py(TANK_H)}`} className="tancurve" style={{ strokeWidth: 3 }} />
        <line x1={px(-TANK_R)} y1={py(TANK_H)} x2={px(TANK_R)} y2={py(TANK_H)} className="tanaxis" style={{ strokeWidth: 2 }} />
        <line x1={px(-w * y)} y1={py(y)} x2={px(w * y)} y2={py(y)} className="tantan" style={{ strokeWidth: 3 }} />
        <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(y)} className="tannorm" />
        <text x={px(w * y) + 8} y={py(y) - 4} className="tanlabel">
          x = {show(y / 2, sep)} m
        </text>
        <text x={px(0) + 6} y={py(y / 2)} className="tanlabel">
          y
        </text>
        <text x={px(TANK_R) + 8} y={py(TANK_H) + 4} className="tanlabel">
          3 m
        </text>
        <text x={px(-TANK_R)} y={py(TANK_H) - 8} className="tanlabel">
          1.5 m
        </text>
      </svg>
      <p className="small muted">{tc(L('The depth of the water against time, with the tangent line at this depth', 'Kedalaman air terhadap waktu, dengan garis singgung pada kedalaman ini'))}</p>
      <Plot
        xr={[0, tFull]}
        yr={[0, 3.4]}
        curves={[{ f: level, cls: 'tancurve' }]}
        segs={[{ x1: a, y1: y - rate * (tNow - a), x2: b, y2: y + rate * (b - tNow), cls: 'tantan' }]}
        vlines={[{ x: tNow, cls: 'tannorm' }]}
        dots={[{ x: tNow, y }]}
        label={tc(L('The depth of the water against time', 'Kedalaman air terhadap waktu'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`V=\\frac13\\pi x^2y=\\frac{\\pi y^3}{12}\\;\\Rightarrow\\;\\frac{dV}{dt}=\\frac{\\pi y^2}{4}\\frac{dy}{dt}`} />
        </p>
        <p>
          <Tex src={`\\frac{dy}{dt}=\\frac{4}{\\pi y^2}\\frac{dV}{dt}=\\frac{4\\cdot ${tx(q, sep)}}{\\pi\\cdot ${tx(y, sep)}^2}\\approx ${tx(Number(rate.toPrecision(4)), sep)}`} />
        </p>
        <p className="okline">
          {tc(L('The level is rising at', 'Permukaan air naik dengan laju'))} <b>{show(Number(rate.toPrecision(4)), sep)}</b> m/{tc(L('min', 'menit'))}, {tc(L('after', 'setelah'))} {show(Number(tNow.toPrecision(3)), sep)} {tc(L('minutes', 'menit'))}.
        </p>
        <p className="small">{tc(L('The same flow of water raises the level more and more slowly, because the surface keeps getting wider: the rate falls like 1/y².', 'Aliran air yang sama menaikkan permukaan makin lambat, karena permukaannya terus melebar: lajunya turun seperti 1/y².'))}</p>
      </div>
    </Frame>
  )
}
