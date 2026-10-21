import { useState } from 'react'
import { useI18n } from '../../i18n'
import { EVT_CASES, boxBest, boxVolume, evtOutcome, extrema, type EvtCase, type ExtremaError } from '../../lib/extrema'
import { evalFloat, parseExpression, toTex } from '../../lib/chain'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'

const four = (x: number, sep: string): string => show(Number(x.toPrecision(5)), sep)

/** A typed number or a multiple of pi or e, such as "pi/2" or "e^2". */
export function numOf(s: string): number | null {
  try {
    const node = parseExpression(s)
    const v = evalFloat(node, NaN)
    return Number.isFinite(v) ? v : null
  } catch {
    return null
  }
}

export const aText = (a: number): string => {
  for (const k of [1, 2, 3, 4, 6]) {
    const n = (a * k) / Math.PI
    if (Math.abs(n - Math.round(n)) < 1e-9 && Math.round(n) !== 0) return `${Math.round(n) === 1 ? '' : Math.round(n)}pi${k === 1 ? '' : `/${k}`}`
  }
  if (Math.abs(a - Math.E ** 2) < 1e-9) return 'e^2'
  return String(Number(a.toPrecision(6)))
}

/* ------------------------------------------------ the closed interval method, on any function */

interface Preset {
  src: string
  a: number
  b: number
}
const PRESETS: Preset[] = [
  { src: 'x^2', a: -2, b: 1 },
  { src: '10*x*(2-ln(x))', a: 1, b: Math.E ** 2 },
  { src: 'x^(2/3)', a: -2, b: 3 },
  { src: '2*cos(x)+2*sin(x)', a: 0, b: 2 * Math.PI },
  { src: 'x^3', a: -1, b: 1 },
  { src: 'abs(x)', a: -1, b: 2 },
  { src: 'x*(10-2*x)*(16-2*x)', a: 0, b: 5 },
]

const ERR: Record<ExtremaError | 'bounds', { en: string; id: string }> = {
  syntax: { en: 'I could not read that function. Use x, numbers, + - * /, powers such as x^2 or x^(2/3), sqrt(…), sin(…), cos(…), e^x, ln(…) and abs(…), for example x^3-3*x.', id: 'Saya tidak dapat membaca fungsi itu. Pakai x, bilangan, + - * /, pangkat seperti x^2 atau x^(2/3), sqrt(…), sin(…), cos(…), e^x, ln(…), dan abs(…), misalnya x^3-3*x.' },
  big: { en: 'That function is too long. Try a shorter one.', id: 'Fungsi itu terlalu panjang. Coba yang lebih pendek.' },
  interval: { en: 'Type two numbers a < b for the ends of the interval, such as -2 and 1, or 0 and 2*pi.', id: 'Ketik dua bilangan a < b untuk ujung selang, seperti -2 dan 1, atau 0 dan 2*pi.' },
  bounds: { en: 'Type the ends a and b as numbers, such as -2, 3 or 2*pi.', id: 'Ketik ujung a dan b sebagai bilangan, seperti -2, 3, atau 2*pi.' },
  undefined: { en: 'The function is not defined at every point of [a, b], so the Extreme Value Theorem does not apply. Choose an interval inside its domain.', id: 'Fungsi tidak terdefinisi di setiap titik [a, b], sehingga Teorema Nilai Ekstrem tidak berlaku. Pilih selang di dalam domainnya.' },
  discontinuous: { en: 'The function has a break (a pole or a jump) inside [a, b], so the Extreme Value Theorem does not apply.', id: 'Fungsi memiliki putus (kutub atau lompatan) di dalam [a, b], sehingga Teorema Nilai Ekstrem tidak berlaku.' },
  constant: { en: 'The function is constant on [a, b]: every point is both a maximum and a minimum.', id: 'Fungsinya konstan pada [a, b]: setiap titik adalah maksimum sekaligus minimum.' },
}

export function ExtremeTool() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [src, setSrc] = useState(PRESETS[1].src)
  const [aStr, setAStr] = useState(aText(PRESETS[1].a))
  const [bStr, setBStr] = useState(aText(PRESETS[1].b))
  const dec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const a = numOf(aStr)
  const b = numOf(bStr)

  let body
  if (a === null || b === null) body = <p className="noline">{ERR.bounds[lang]}</p>
  else {
    const r = extrema(src, a, b)
    if (!r.ok) body = <p className="noline">{ERR[r.error][lang]}</p>
    else {
      const len = b - a
      const ys = r.candidates.map((c) => c.fx)
      let lo = Math.min(...ys)
      let hi = Math.max(...ys)
      for (let i = 0; i <= 200; i++) {
        const v = evalFloat(r.f, a + (len * i) / 200)
        if (Number.isFinite(v)) {
          lo = Math.min(lo, v)
          hi = Math.max(hi, v)
        }
      }
      const pad = (hi - lo) * 0.15 || 1
      const isMax = (x: number): boolean => r.max.at.some((m) => Math.abs(m - x) < 1e-9 * (1 + len))
      const isMin = (x: number): boolean => r.min.at.some((m) => Math.abs(m - x) < 1e-9 * (1 + len))
      const kindText = (k: string): string => (k === 'endpoint' ? tc(L('endpoint', 'ujung')) : k === 'zero' ? tc(L("f′ = 0", "f′ = 0")) : tc(L("f′ does not exist", "f′ tidak ada")))
      body = (
        <>
          <Plot
            xr={[a - len * 0.05, b + len * 0.05]}
            yr={[lo - pad, hi + pad]}
            curves={[{ f: (x) => (x >= a && x <= b ? evalFloat(r.f, x) : NaN), cls: 'tancurve' }]}
            vlines={r.candidates.filter((c) => c.kind !== 'endpoint').map((c) => ({ x: c.x, cls: 'tannorm' }))}
            dots={r.candidates.map((c) => ({ x: c.x, y: c.fx, cls: isMax(c.x) || isMin(c.x) ? 'tandot sec' : 'tandot', open: c.kind !== 'endpoint' && !isMax(c.x) && !isMin(c.x) }))}
            label={tc(L('The graph of the function on the interval, with its critical points and endpoints', 'Grafik fungsi pada selang, dengan titik kritis dan ujungnya'))}
          />
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
                {r.candidates.map((c, i) => (
                  <tr key={i} className={isMax(c.x) || isMin(c.x) ? 'hi' : ''}>
                    <td>{four(c.x, sep)}</td>
                    <td>{kindText(c.kind)}</td>
                    <td>{four(c.fx, sep)}</td>
                    <td>{isMax(c.x) ? tc(L('largest', 'terbesar')) : isMin(c.x) ? tc(L('smallest', 'terkecil')) : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={dec(`f(x)=${toTex(r.f)}`)} />
            </p>
            {toTex(r.df).length <= 45 && (
              <p>
                <Tex src={dec(`f'(x)=${toTex(r.df)}`)} />
              </p>
            )}
            <p className="okline">
              {tc(L('Absolute maximum', 'Maksimum mutlak'))} <b>{four(r.max.value, sep)}</b> {tc(L('at x =', 'di x ='))} {r.max.at.map((x) => four(x, sep)).join(', ')}; {tc(L('absolute minimum', 'minimum mutlak'))} <b>{four(r.min.value, sep)}</b> {tc(L('at x =', 'di x ='))} {r.min.at.map((x) => four(x, sep)).join(', ')}.
            </p>
            <p className="small">{tc(L('Step 1: the critical points are the rows that are not endpoints. Step 2: f is evaluated at every row. Step 3: the largest and the smallest value are marked.', 'Langkah 1: titik kritis adalah baris yang bukan ujung. Langkah 2: f dihitung di setiap baris. Langkah 3: nilai terbesar dan terkecil ditandai.'))}</p>
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="extremetool">
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          f(x) = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={src} aria-label="f(x)" onChange={(e) => setSrc(e.target.value)} />
        </label>
        <label className="lbl">
          a = <input style={{ width: '5em' }} value={aStr} aria-label="a" onChange={(e) => setAStr(e.target.value)} />
        </label>
        <label className="lbl">
          b = <input style={{ width: '5em' }} value={bStr} aria-label="b" onChange={(e) => setBStr(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {PRESETS.map((p) => (
          <button key={p.src + p.a} className="chip ghost" onClick={() => { setSrc(p.src); setAStr(aText(p.a)); setBStr(aText(p.b)) }}>
            {p.src.replace(/\*/g, '·')} [{aText(p.a).replace('pi', 'π')}, {aText(p.b).replace('pi', 'π')}]
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* ----------------------------------------- the six cases of the Extreme Value Theorem */

export function EvtCases() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('closed')
  const c: EvtCase = EVT_CASES.find((k) => k.id === id) ?? EVT_CASES[0]
  const o = evtOutcome(c)
  const inDomain = (x: number): boolean => (x > c.lo || (c.loClosed && x === c.lo)) && (x < c.hi || (c.hiClosed && x === c.hi))
  const f = (x: number): number => (inDomain(x) ? c.f(x) : NaN)
  const ends: { x: number; closed: boolean }[] = []
  if (Number.isFinite(c.lo)) ends.push({ x: c.lo, closed: c.loClosed })
  if (Number.isFinite(c.hi)) ends.push({ x: c.hi, closed: c.hiClosed })
  const dots = ends.map((e) => ({ x: e.x, y: c.f(e.x), open: !e.closed }))
  if (c.id === 'jump') dots.push({ x: 1, y: 0, open: false }, { x: 1, y: 1, open: true })
  const names: Record<string, { en: string; id: string }> = {
    closed: { en: 'closed, bounded, continuous', id: 'tertutup, terbatas, kontinu' },
    'half-open': { en: 'a missing end', id: 'satu ujung hilang' },
    open: { en: 'two missing ends', id: 'dua ujung hilang' },
    'whole-line': { en: 'not bounded', id: 'tidak terbatas' },
    exponential: { en: 'not bounded', id: 'tidak terbatas' },
    jump: { en: 'not continuous', id: 'tidak kontinu' },
  }
  const CHIP: Record<string, string> = {
    closed: 'x^2,[0,2]',
    'half-open': 'x^2,(0,2]',
    open: 'x^2,(0,2)',
    'whole-line': 'x^2,(-\\infty,\\infty)',
    exponential: 'e^x,(-\\infty,\\infty)',
    jump: '\\text{jump at }1',
  }
  const label = (k: 'max' | 'min'): string => {
    const e = o[k]
    if (!e.exists) return tc(L(k === 'max' ? 'no maximum' : 'no minimum', k === 'max' ? 'tidak ada maksimum' : 'tidak ada minimum'))
    return `${tc(L(k === 'max' ? 'maximum' : 'minimum', k === 'max' ? 'maksimum' : 'minimum'))} ${four(e.value, sep)} ${tc(L('at x =', 'di x ='))} ${e.at.slice(0, 2).map((x) => four(Math.abs(x) < 1e-6 ? 0 : x, sep)).join(' ' + tc(L('and', 'dan')) + ' ')}`
  }
  return (
    <Frame name="evtcases">
      <div className="chips">
        {EVT_CASES.map((k) => (
          <button key={k.id} className={`chip ${id === k.id ? 'on' : ''}`} onClick={() => setId(k.id)} aria-pressed={id === k.id}>
            <Tex src={CHIP[k.id] ?? k.tex} /> {tc(names[k.id] ?? names.closed)}
          </button>
        ))}
      </div>
      <p>
        <Tex src={c.tex} />
      </p>
      <Plot xr={c.xr} yr={c.yr} curves={[{ f, cls: 'tancurve' }]} dots={dots} label={tc(L('The graph of the function on its domain', 'Grafik fungsi pada domainnya'))} />
      <div className="wgtout" aria-live="polite">
        <p className={o.max.exists && o.min.exists ? 'okline' : 'noline'}>
          {label('max')}; {label('min')}.
        </p>
        <p className="small">{tc(c.note)}</p>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------- a box from a sheet of card */

export function BoxVolume() {
  const { tc } = useI18n()
  const sep = useSep()
  const [w, setW] = useState(10)
  const [l, setL] = useState(16)
  const [t, setT] = useState(0.4)
  const half = Math.min(w, l) / 2
  const xb = boxBest(w, l)
  const x = Math.min(half, Math.max(0, t * half))
  const v = boxVolume(w, l, x)
  const vb = boxVolume(w, l, xb)
  const sc = Math.min(300 / l, 160 / w)
  const ox = 20
  const oy = 24
  const sx = (u: number) => ox + u * sc
  const sy = (u: number) => oy + u * sc
  return (
    <Frame name="boxvolume">
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('sheet width', 'lebar karton'))} = <b>{show(w, sep)}</b>
          <input type="range" min={6} max={30} step={1} value={w} aria-label="w" onChange={(e) => setW(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('sheet length', 'panjang karton'))} = <b>{show(l, sep)}</b>
          <input type="range" min={6} max={40} step={1} value={l} aria-label="l" onChange={(e) => setL(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('side of the cut squares', 'sisi persegi yang dipotong'))} x = <b>{four(x, sep)}</b>
          <input type="range" min={0} max={1} step={0.005} value={t} aria-label="x" onChange={(e) => setT(Number(e.target.value))} />
        </label>
      </div>
      <svg viewBox="0 0 440 210" className="dersvg" role="img" aria-label={tc(L('A rectangular sheet with a square cut from each corner', 'Karton persegi panjang dengan sebuah persegi dipotong dari setiap sudut'))}>
        <rect x={0} y={0} width={440} height={210} className="tanframe" />
        <rect x={sx(0)} y={sy(0)} width={l * sc} height={w * sc} style={{ fill: 'var(--fig-a)', opacity: 0.25 }} />
        <rect x={sx(x)} y={sy(x)} width={(l - 2 * x) * sc} height={(w - 2 * x) * sc} style={{ fill: 'var(--fig-a)', opacity: 0.45 }} />
        {[[0, 0], [l - x, 0], [0, w - x], [l - x, w - x]].map(([cx, cy], i) => (
          <rect key={i} x={sx(cx)} y={sy(cy)} width={x * sc} height={x * sc} style={{ fill: 'var(--surface)' }} className="tannorm" />
        ))}
        <rect x={sx(0)} y={sy(0)} width={l * sc} height={w * sc} style={{ fill: 'none' }} className="tancurve" />
      </svg>
      <p className="small muted">{tc(L('The volume of the box against the side x of the cut squares', 'Volume kotak terhadap sisi x persegi yang dipotong'))}</p>
      <Plot
        xr={[0, half]}
        yr={[-vb * 0.05, vb * 1.15]}
        curves={[{ f: (u) => boxVolume(w, l, u), cls: 'tancurve' }]}
        vlines={[{ x: xb, cls: 'tannorm' }, { x, cls: 'tantan faint' }]}
        dots={[{ x: xb, y: vb, cls: 'tandot sec' }, { x, y: v }]}
        label={tc(L('The volume of the box as a function of x', 'Volume kotak sebagai fungsi x'))}
      />
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`V(x)=x(${w}-2x)(${l}-2x)`} />
        </p>
        <p>
          <Tex src={`V'(x)=12x^2-${4 * (w + l)}x+${w * l}=0`} />
        </p>
        <p className="okline">
          {tc(L('now', 'sekarang'))}: V({four(x, sep)}) = <b>{four(v, sep)}</b>. {tc(L('The largest volume is', 'Volume terbesar adalah'))} <b>{four(vb, sep)}</b> {tc(L('at x =', 'di x ='))} <b>{four(xb, sep)}</b>.
        </p>
        <p className="small">{tc(L('The ends x = 0 and x = half the short side give volume 0, so the closed interval method says the largest volume is at the one critical point inside.', 'Ujung x = 0 dan x = setengah sisi pendek memberi volume 0, sehingga metode selang tertutup menyatakan volume terbesar ada di satu titik kritis di dalam.'))}</p>
      </div>
    </Frame>
  )
}
