import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { anglesBetweenDiagonals, bestVolumeForSurface, cubeEdgeForSurface, directionAngles, exactSqrt, fitsRod, heightForSurface, measures } from '../../lib/cuboid'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/** A number with `digits` decimals and the reader's decimal mark. */
function fmt(x: number, sep: string, digits = 2): string {
  if (!Number.isFinite(x)) return '–'
  return (Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits).replace('.', sep)
}
/** The same without trailing zeros. */
function short(x: number, sep: string, digits = 2): string {
  if (!Number.isFinite(x)) return '–'
  return Number((Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits)).toString().replace('.', sep)
}
const parse = (s: string): number => (s.trim() === '' ? NaN : Number(s.trim().replace(',', '.')))

/** The oblique picture of a box l × w × h in a square of `size` pixels: x to the right, z up, y going back and up to the right. */
const K = 0.4
function boxView(l: number, w: number, h: number, size = 240, pad = 18) {
  const W = l + K * w
  const H = h + 0.8 * K * w
  const s = (size - 2 * pad) / Math.max(W, H, 1e-9)
  const ox = pad + ((size - 2 * pad) - W * s) / 2
  const oy = size - pad - ((size - 2 * pad) - H * s) / 2
  return {
    P: (x: number, y: number, z: number): [number, number] => [ox + (x + K * y) * s, oy - (z + 0.8 * K * y) * s],
  }
}

type V3 = [number, number, number]
const CORNERS: V3[] = Array.from({ length: 8 }, (_, i) => [i & 1, (i >> 1) & 1, (i >> 2) & 1])
/** The twelve edges as pairs of corner indices, and whether the edge is hidden behind the box (it meets the corner at the back, left and bottom). */
const EDGES: { a: number; b: number; hidden: boolean }[] = (() => {
  const out: { a: number; b: number; hidden: boolean }[] = []
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++) {
      const diff = i ^ j
      if (diff === 1 || diff === 2 || diff === 4) out.push({ a: i, b: j, hidden: i === 2 || j === 2 })
    }
  return out
})()

function BoxPicture({ l, w, h, label, diagonals = true }: { l: number; w: number; h: number; label: string; diagonals?: boolean }) {
  const { P } = boxView(l, w, h)
  const pt = (c: V3): [number, number] => P(c[0] * l, c[1] * w, c[2] * h)
  const line = (a: V3, b: V3, stroke: string, width: number, dash?: string, key?: string) => {
    const [x1, y1] = pt(a)
    const [x2, y2] = pt(b)
    return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" />
  }
  const front = [CORNERS[0], CORNERS[1], CORNERS[5], CORNERS[4]].map((c) => pt(c).map((v) => v.toFixed(1)).join(',')).join(' ')
  return (
    <svg viewBox="0 0 240 240" role="img" aria-label={label} style={{ width: '100%', maxWidth: 280, display: 'block', margin: '6px auto' }}>
      <polygon points={front} fill="var(--brand)" fillOpacity={0.12} />
      {EDGES.map((e, i) => line(CORNERS[e.a], CORNERS[e.b], 'var(--text)', e.hidden ? 1 : 2, e.hidden ? '4 4' : undefined, `e${i}`))}
      {diagonals && line(CORNERS[0], CORNERS[3], 'var(--coral)', 3, undefined, 'fd')}
      {diagonals && line(CORNERS[0], CORNERS[7], 'var(--gold)', 3, undefined, 'sd')}
    </svg>
  )
}

/* ----------------------------------------------------------------------- measurements */

export function BoxMeasure() {
  const { tc } = useI18n()
  const sep = useSep()
  const [l, setL] = useState(5)
  const [w, setW] = useState(3)
  const [h, setH] = useState(2)
  const m = measures(l, w, h)
  const a = directionAngles(l, w, h)
  const cube = l === w && w === h
  const slider = (name: string, v: number, set: (x: number) => void) => (
    <label className="lbl slider">
      {name} = <b>{short(v, sep)}</b>
      <input type="range" min={1} max={12} step={0.5} value={v} aria-label={name} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )
  const label = `${tc(L('A box', 'Sebuah balok'))} ${short(l, sep)} × ${short(w, sep)} × ${short(h, sep)}: ${tc(L('volume', 'volume'))} ${fmt(m.volume, sep, 2)}, ${tc(L('surface', 'luas permukaan'))} ${fmt(m.surface, sep, 2)}`
  return (
    <Frame name="bxmeasure">
      {slider(tc(L('length l', 'panjang p')), l, setL)}
      {slider(tc(L('width w', 'lebar l')), w, setW)}
      {slider(tc(L('height h', 'tinggi t')), h, setH)}
      <BoxPicture l={l} w={w} h={h} label={label} />
      <div className="wgtout" aria-live="polite">
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <tbody>
              <tr>
                <td>{tc(L('volume', 'volume'))}</td>
                <td>
                  <Tex src="lwh" /> = <b>{fmt(m.volume, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('surface area, six faces', 'luas permukaan, enam sisi'))}</td>
                <td>
                  <Tex src="2(lw+lh+wh)" /> = <b>{fmt(m.surface, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('lateral area, the four walls', 'luas selimut, empat dinding'))}</td>
                <td>
                  <Tex src="2h(l+w)" /> = <b>{fmt(m.lateral, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--coral)' }}>{tc(L('diagonals of the three kinds of face', 'diagonal ketiga jenis sisi'))}</td>
                <td>
                  <b>{fmt(m.faceDiagonalLW, sep, 3)}</b> · <b>{fmt(m.faceDiagonalLH, sep, 3)}</b> · <b>{fmt(m.faceDiagonalWH, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--gold)' }}>{tc(L('space diagonal', 'diagonal ruang'))}</td>
                <td>
                  <Tex src="\sqrt{l^2+w^2+h^2}" /> = <b>{fmt(m.spaceDiagonal, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('the diagonal makes with l, w, h', 'diagonal membentuk dengan l, w, t'))}</td>
                <td>
                  <b>{fmt(a.alpha, sep, 1)}°</b> · <b>{fmt(a.beta, sep, 1)}°</b> · <b>{fmt(a.gamma, sep, 1)}°</b>
                </td>
              </tr>
              <tr>
                <td>{tc(L('all twelve edges end to end', 'kedua belas rusuk disambung'))}</td>
                <td>
                  <Tex src="4(l+w+h)" /> = <b>{fmt(m.edgeTotal, sep, 2)}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {cube && <p className="okline">{tc(L('All three edges are equal: this box is a cube.', 'Ketiga rusuk sama: balok ini adalah kubus.'))}</p>}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------- one surface area */

const SAME_PRESETS: { name: Loc; l: number; w: number }[] = [
  { name: L('long and thin', 'panjang dan tipis'), l: 9, w: 3 },
  { name: L('flat', 'pipih'), l: 8, w: 5 },
  { name: L('nearly a cube', 'hampir kubus'), l: 5, w: 4.5 },
]

export function BoxSameSurface() {
  const { tc } = useI18n()
  const sep = useSep()
  const [S, setS] = useState(96)
  const [l, setL] = useState(6)
  const [w, setW] = useState(4)
  const best = bestVolumeForSurface(S)
  const edge = cubeEdgeForSurface(S)
  const h = heightForSurface(S, l, w)
  const valid = h > 0
  const v = valid ? l * w * h : 0
  const label = valid ? `${tc(L('A box', 'Sebuah balok'))} ${short(l, sep)} × ${short(w, sep)} × ${short(h, sep)}: ${tc(L('volume', 'volume'))} ${fmt(v, sep, 2)}` : tc(L('No box: the base alone is too large', 'Tidak ada balok: alasnya saja terlalu besar'))
  return (
    <Frame name="bxsame">
      <div className="chips">
        {SAME_PRESETS.map((p, i) => (
          <button
            key={i}
            className={`chip ghost ${l === p.l && w === p.w ? 'on' : ''}`}
            onClick={() => {
              setL(p.l)
              setW(p.w)
            }}
            aria-pressed={l === p.l && w === p.w}
          >
            {tc(p.name)}
          </button>
        ))}
        <button
          className="chip ghost"
          onClick={() => {
            setL(Math.round(edge * 100) / 100)
            setW(Math.round(edge * 100) / 100)
          }}
        >
          {tc(L('make it a cube', 'jadikan kubus'))}
        </button>
      </div>
      <label className="lbl slider">
        {tc(L('surface area S', 'luas permukaan S'))} = <b>{S}</b>
        <input type="range" min={24} max={300} step={6} value={S} aria-label="S" onChange={(e) => setS(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        l = <b>{short(l, sep)}</b>
        <input type="range" min={0.5} max={14} step={0.25} value={l} aria-label="l" onChange={(e) => setL(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        w = <b>{short(w, sep)}</b>
        <input type="range" min={0.5} max={14} step={0.25} value={w} aria-label="w" onChange={(e) => setW(Number(e.target.value))} />
      </label>
      {valid && <BoxPicture l={l} w={w} h={h} label={label} diagonals={false} />}
      <div className="wgtout" aria-live="polite">
        {valid ? (
          <>
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              {tc(L('The height that keeps the surface at', 'Tinggi yang menjaga luas permukaan tetap'))} {S} {tc(L('is', 'adalah'))} <Tex src="h=\frac{S/2-lw}{l+w}" /> = <b>{fmt(h, sep, 3)}</b>. {tc(L('Volume', 'Volume'))} = <b>{fmt(v, sep, 3)}</b>.
            </p>
            <div style={{ height: 14, background: 'var(--surface-2)', borderRadius: 7, overflow: 'hidden' }} role="img" aria-label={`${fmt((v / best) * 100, sep, 1)}%`}>
              <div style={{ width: `${Math.min(100, (v / best) * 100)}%`, height: '100%', background: v >= best * 0.9999 ? 'var(--good)' : 'var(--gold)' }} />
            </div>
            <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
              {tc(L('The cube with this surface has edge', 'Kubus dengan luas permukaan ini memiliki rusuk'))} {fmt(edge, sep, 3)} {tc(L('and volume', 'dan volume'))} {fmt(best, sep, 3)}: {tc(L('this box holds', 'balok ini memuat'))} <b>{fmt((v / best) * 100, sep, 1)}%</b> {tc(L('of that. No box on this surface holds more.', 'dari itu. Tak ada balok dengan luas permukaan ini yang memuat lebih banyak.'))}
            </p>
          </>
        ) : (
          <p className="badline">{tc(L('There is no such box: the base l × w alone is already more than half the surface, so the height would be zero or negative.', 'Tidak ada balok seperti itu: alas l × w saja sudah lebih dari setengah luas permukaan, sehingga tingginya nol atau negatif.'))}</p>
        )}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------- does it fit */

const FIT_PRESETS: { name: Loc; l: string; w: string; h: string; r: string }[] = [
  { name: L('a 1 m pole in a small box', 'tiang 1 m di kotak kecil'), l: '60', w: '40', h: '40', r: '100' },
  { name: L('a 1 m pole in a larger box', 'tiang 1 m di kotak lebih besar'), l: '80', w: '50', h: '40', r: '100' },
  { name: L('2 × 3 × 6 and a rod of 7', '2 × 3 × 6 dan batang 7'), l: '2', w: '3', h: '6', r: '7' },
  { name: L('the Euler brick', 'bata Euler'), l: '44', w: '117', h: '240', r: '270' },
]

export function BoxFit() {
  const { tc } = useI18n()
  const sep = useSep()
  const [tl, setTl] = useState('60')
  const [tw, setTw] = useState('40')
  const [th, setTh] = useState('40')
  const [tr, setTr] = useState('100')
  const l = parse(tl)
  const w = parse(tw)
  const h = parse(th)
  const r = parse(tr)
  const valid = l > 0 && w > 0 && h > 0 && r > 0
  const m = valid ? measures(l, w, h) : null
  const fits = valid && fitsRod(l, w, h, r)
  const longestFace = m ? Math.max(m.faceDiagonalLW, m.faceDiagonalLH, m.faceDiagonalWH) : 0
  const whole = [l, w, h].every((x) => Number.isInteger(x) && x > 0 && x < 1e6)
  const sq = (a: number, b: number): string => {
    const s = exactSqrt(BigInt(a * a + b * b))
    return s === null ? '' : s.toString()
  }
  const faceWhole = whole ? [sq(l, w), sq(l, h), sq(w, h)] : []
  const spaceWhole = whole ? exactSqrt(BigInt(l * l + w * w + h * h)) : null
  const diag = valid ? anglesBetweenDiagonals(l, w, h) : null
  const input = (value: string, set: (v: string) => void, name: string) => (
    <label className="lbl">
      {name} = <input style={{ width: '6em' }} value={value} inputMode="decimal" aria-label={name} onChange={(e) => set(e.target.value)} />
    </label>
  )
  return (
    <Frame name="bxfit">
      <div className="chips">
        {FIT_PRESETS.map((p, i) => {
          const on = tl === p.l && tw === p.w && th === p.h && tr === p.r
          return (
            <button
              key={i}
              className={`chip ghost ${on ? 'on' : ''}`}
              onClick={() => {
                setTl(p.l)
                setTw(p.w)
                setTh(p.h)
                setTr(p.r)
              }}
              aria-pressed={on}
            >
              {tc(p.name)}
            </button>
          )
        })}
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 8 }}>
        {input(tl, setTl, 'l')}
        {input(tw, setTw, 'w')}
        {input(th, setTh, 'h')}
        {input(tr, setTr, tc(L('rod', 'batang')))}
      </div>
      <div className="wgtout" aria-live="polite">
        {!valid || !m ? (
          <p className="badline">{tc(L('Type four positive numbers: the three edges of the box and the length of the rod.', 'Ketik empat bilangan positif: ketiga rusuk balok dan panjang batang.'))}</p>
        ) : (
          <>
            <p className={fits ? 'okline' : 'badline'} style={{ overflowWrap: 'anywhere' }}>
              {fits
                ? tc(L(`The rod fits: its length ${short(r, sep)} is not more than the space diagonal ${fmt(m.spaceDiagonal, sep, 3)}.`, `Batang itu muat: panjangnya ${short(r, sep)} tidak lebih dari diagonal ruang ${fmt(m.spaceDiagonal, sep, 3)}.`))
                : tc(L(`The rod does not fit: ${short(r, sep)} is more than the space diagonal ${fmt(m.spaceDiagonal, sep, 3)}, the longest straight line inside the box.`, `Batang itu tidak muat: ${short(r, sep)} lebih dari diagonal ruang ${fmt(m.spaceDiagonal, sep, 3)}, garis lurus terpanjang di dalam balok.`))}
            </p>
            <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
              {tc(L('Space diagonal', 'Diagonal ruang'))} <Tex src="\sqrt{l^2+w^2+h^2}" /> = {fmt(m.spaceDiagonal, sep, 3)}.{' '}
              {r > longestFace && fits ? tc(L('It is longer than every face diagonal, so the rod has to lean across the inside of the box, from one corner towards the opposite one.', 'Ia lebih panjang daripada setiap diagonal sisi, sehingga batang harus miring melintasi bagian dalam balok, dari satu sudut ke arah sudut yang berhadapan.')) : ''}
            </p>
            {whole && (
              <p className="small" style={{ overflowWrap: 'anywhere' }}>
                {tc(L('Face diagonals:', 'Diagonal sisi:'))} {faceWhole.map((s, i) => (s ? s : '√' + [l * l + w * w, l * l + h * h, w * w + h * h][i])).join(' · ')}.{' '}
                {faceWhole.every(Boolean) ? tc(L('All three are whole numbers: an Euler brick.', 'Ketiganya bilangan bulat: sebuah bata Euler.')) : ''}{' '}
                {spaceWhole !== null ? tc(L(`The space diagonal is the whole number ${spaceWhole}: a Pythagorean quadruple.`, `Diagonal ruangnya bilangan bulat ${spaceWhole}: sebuah kuadrupel Pythagoras.`)) : tc(L(`The space diagonal squared is ${l * l + w * w + h * h}, not a perfect square.`, `Kuadrat diagonal ruangnya ${l * l + w * w + h * h}, bukan kuadrat sempurna.`))}
              </p>
            )}
            {diag && (
              <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
                {tc(L('Two space diagonals cross at', 'Dua diagonal ruang berpotongan pada'))} {fmt(diag.throughL, sep, 1)}°, {fmt(diag.throughW, sep, 1)}° {tc(L('or', 'atau'))} {fmt(diag.throughH, sep, 1)}°, {tc(L('depending on the pair.', 'tergantung pasangannya.'))}
              </p>
            )}
          </>
        )}
      </div>
    </Frame>
  )
}
