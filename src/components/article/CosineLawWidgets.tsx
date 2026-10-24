import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { angleNaive, angleStable, correction, kindOfAngle, sideRange, thirdSide, trip, type AngleKind } from '../../lib/cosinelaw'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { arc, frame } from './SineLawWidgets'

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
/** An angle in degrees: with decimals normally, in scientific notation when it is tiny but not zero. */
function angleText(x: number, sep: string): string {
  if (x === 0) return '0°'
  if (Math.abs(x) < 1e-3) return `${x.toExponential(4).replace('.', sep)}°`
  return `${fmt(x, sep, 4)}°`
}
const parse = (s: string): number => (s.trim() === '' ? NaN : Number(s.trim().replace(',', '.')))
const RAD = Math.PI / 180
type P = [number, number]

const KIND_NAME: Record<AngleKind, Loc> = { acute: L('acute', 'lancip'), right: L('a right angle', 'siku-siku'), obtuse: L('obtuse', 'tumpul') }

/* -------------------------------------------------------------------------------- the hinge */

const HINGE_PRESETS: { name: Loc; C: number }[] = [
  { name: L('almost closed', 'hampir menutup'), C: 10 },
  { name: L('acute', 'lancip'), C: 60 },
  { name: L('right angle: Pythagoras', 'siku-siku: Pythagoras'), C: 90 },
  { name: L('obtuse', 'tumpul'), C: 120 },
  { name: L('almost flat', 'hampir lurus'), C: 170 },
]

export function CosineLawHinge() {
  const { tc } = useI18n()
  const sep = useSep()
  const [a, setA] = useState(5)
  const [b, setB] = useState(4)
  const [C, setC] = useState(60)
  const c = thirdSide(a, b, C)
  const corr = correction(a, b, C)
  const [lo, hi] = sideRange(a, b)
  const kind = kindOfAngle(a, b, c)
  const B: P = [a, 0]
  const A: P = [b * Math.cos(C * RAD), b * Math.sin(C * RAD)]
  const f = frame(Math.min(0, A[0]) - 0.6, Math.max(a, A[0]) + 0.6, -0.9, Math.max(b, A[1]) + 0.6, 340, 250)
  const pt = (q: P): string => `${f.X(q[0]).toFixed(1)},${f.Y(q[1]).toFixed(1)}`
  const label = `${tc(L('Two sides', 'Dua sisi'))} ${short(a, sep, 1)} ${tc(L('and', 'dan'))} ${short(b, sep, 1)} ${tc(L('with the angle', 'dengan sudut'))} ${C}° ${tc(L('between them: the third side is', 'di antaranya: sisi ketiga adalah'))} ${fmt(c, sep, 3)}.`
  return (
    <Frame name="lchinge">
      <div className="chips">
        {HINGE_PRESETS.map((p) => (
          <button key={p.C} className={`chip ghost ${C === p.C ? 'on' : ''}`} onClick={() => setC(p.C)} aria-pressed={C === p.C}>
            {tc(p.name)}
          </button>
        ))}
      </div>
      <label className="lbl slider">
        a = <b>{short(a, sep, 1)}</b>
        <input type="range" min={2} max={10} step={0.5} value={a} aria-label="a" onChange={(e) => setA(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        b = <b>{short(b, sep, 1)}</b>
        <input type="range" min={2} max={10} step={0.5} value={b} aria-label="b" onChange={(e) => setB(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        C = <b>{C}°</b>
        <input type="range" min={1} max={179} step={1} value={C} aria-label="C" onChange={(e) => setC(Number(e.target.value))} />
      </label>
      <svg viewBox={`0 0 ${f.W} ${f.H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 420, display: 'block', margin: '6px auto' }}>
        <polygon points={`${pt([0, 0])} ${pt(B)} ${pt(A)}`} fill="var(--brand)" fillOpacity={0.12} />
        <line x1={f.X(0)} y1={f.Y(0)} x2={f.X(B[0])} y2={f.Y(B[1])} stroke="var(--coral)" strokeWidth={3} strokeLinecap="round" />
        <line x1={f.X(0)} y1={f.Y(0)} x2={f.X(A[0])} y2={f.Y(A[1])} stroke="var(--gold)" strokeWidth={3} strokeLinecap="round" />
        <line x1={f.X(A[0])} y1={f.Y(A[1])} x2={f.X(B[0])} y2={f.Y(B[1])} stroke="var(--brand)" strokeWidth={3} strokeLinecap="round" />
        <path d={arc(f.X(0), f.Y(0), 26, 0, C)} fill="none" stroke="var(--text)" strokeWidth={1.6} />
        {Math.abs(C - 90) < 0.5 && <path d={`M${f.X(0) + 14},${f.Y(0)}v-14h-14`} fill="none" stroke="var(--text)" strokeWidth={1.4} />}
        <circle cx={f.X(0)} cy={f.Y(0)} r={3.5} fill="var(--text)" />
        <circle cx={f.X(B[0])} cy={f.Y(B[1])} r={3.5} fill="var(--text)" />
        <circle cx={f.X(A[0])} cy={f.Y(A[1])} r={3.5} fill="var(--text)" />
        <text x={f.X(0) - 4} y={f.Y(0) + 16} fontSize={12} fontWeight={700} textAnchor="end" fill="var(--text)">
          C
        </text>
        <text x={f.X(B[0]) + 5} y={f.Y(B[1]) + 16} fontSize={12} fontWeight={700} fill="var(--text)">
          B
        </text>
        <text x={f.X(A[0]) + 6} y={f.Y(A[1]) - 6} fontSize={12} fontWeight={700} fill="var(--text)">
          A
        </text>
        <text x={f.X(B[0] / 2)} y={f.Y(0) + 16} fontSize={11} textAnchor="middle" fill="var(--coral)" fontStyle="italic">
          a
        </text>
        <text x={f.X(A[0] / 2) - 8} y={f.Y(A[1] / 2) - 4} fontSize={11} textAnchor="end" fill="var(--gold)" fontStyle="italic">
          b
        </text>
        <text x={f.X((A[0] + B[0]) / 2) + 8} y={f.Y((A[1] + B[1]) / 2)} fontSize={11} fill="var(--brand)" fontStyle="italic">
          c
        </text>
      </svg>
      <div className="wgtout" aria-live="polite">
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <tbody>
              <tr>
                <td>a² + b²</td>
                <td>
                  {fmt(a * a, sep, 2)} + {fmt(b * b, sep, 2)} = <b>{fmt(a * a + b * b, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>−2ab cos C</td>
                <td>
                  −2 · {short(a, sep, 1)} · {short(b, sep, 1)} · cos {C}° = <b>{fmt(corr, sep, 3)}</b>
                </td>
              </tr>
              <tr>
                <td>c² = a² + b² − 2ab cos C</td>
                <td>
                  <b>{fmt(c * c, sep, 3)}</b>, c = <b>{fmt(c, sep, 4)}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          {tc(L(`C is ${KIND_NAME[kind].en}: the correction is ${corr < -1e-9 ? 'negative, so c is shorter than the hypotenuse √(a² + b²)' : corr > 1e-9 ? 'positive, so c is longer than the hypotenuse √(a² + b²)' : 'zero, so this is Pythagoras'}.`, `C ${KIND_NAME[kind].id}: koreksinya ${corr < -1e-9 ? 'negatif, jadi c lebih pendek daripada sisi miring √(a² + b²)' : corr > 1e-9 ? 'positif, jadi c lebih panjang daripada sisi miring √(a² + b²)' : 'nol, jadi ini Pythagoras'}.`))}
        </p>
        <p className="small muted">
          {tc(L('However you turn the hinge, c stays between', 'Bagaimanapun engselnya diputar, c tetap di antara'))} |a − b| = {fmt(lo, sep, 1)} {tc(L('and', 'dan'))} a + b = {fmt(hi, sep, 1)}: {tc(L('the triangle inequality, which the law implies because cos C is between −1 and 1.', 'ketaksamaan segitiga, yang tersirat dalam aturan itu karena cos C berada di antara −1 dan 1.'))}
        </p>
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------------- three sides to angles */

const SSS_PRESETS: { name: Loc; a: string; b: string; c: string }[] = [
  { name: L('7, 8, 9', '7, 8, 9'), a: '7', b: '8', c: '9' },
  { name: L('5, 7, 10 (obtuse)', '5, 7, 10 (tumpul)'), a: '5', b: '7', c: '10' },
  { name: L('3, 4, 5', '3, 4, 5'), a: '3', b: '4', c: '5' },
  { name: L('equilateral', 'sama sisi'), a: '6', b: '6', c: '6' },
  { name: L('very thin', 'sangat tipis'), a: '100000000', b: '100000000', c: '1' },
]

export function CosineLawAngles() {
  const { tc } = useI18n()
  const sep = useSep()
  const [ta, setTa] = useState('5')
  const [tb, setTb] = useState('7')
  const [tcx, setTc] = useState('10')
  const a = parse(ta)
  const b = parse(tb)
  const c = parse(tcx)
  const valid = a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a
  const rows = valid
    ? [
        { name: 'A', n: angleNaive(b, c, a), s: angleStable(b, c, a), kind: kindOfAngle(b, c, a) },
        { name: 'B', n: angleNaive(a, c, b), s: angleStable(a, c, b), kind: kindOfAngle(a, c, b) },
        { name: 'C', n: angleNaive(a, b, c), s: angleStable(a, b, c), kind: kindOfAngle(a, b, c) },
      ]
    : []
  const lost = rows.some((r) => Math.abs(r.n - r.s) > 1e-6 * Math.max(1e-300, Math.abs(r.s)))
  const biggest = valid ? (a >= b && a >= c ? 'A' : b >= c ? 'B' : 'C') : ''
  const input = (value: string, set: (v: string) => void, name: string) => (
    <label className="lbl">
      {name} = <input style={{ width: '9em' }} value={value} inputMode="decimal" aria-label={name} onChange={(e) => set(e.target.value)} />
    </label>
  )
  return (
    <Frame name="lcsss">
      <div className="chips">
        {SSS_PRESETS.map((p, i) => (
          <button
            key={i}
            className={`chip ghost ${ta === p.a && tb === p.b && tcx === p.c ? 'on' : ''}`}
            onClick={() => {
              setTa(p.a)
              setTb(p.b)
              setTc(p.c)
            }}
            aria-pressed={ta === p.a && tb === p.b && tcx === p.c}
          >
            {tc(p.name)}
          </button>
        ))}
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 8 }}>
        {input(ta, setTa, 'a')}
        {input(tb, setTb, 'b')}
        {input(tcx, setTc, 'c')}
      </div>
      <div className="wgtout" aria-live="polite">
        {!valid ? (
          <p className="badline">{tc(L('These three lengths cannot be the sides of a triangle: each must be shorter than the sum of the other two.', 'Ketiga panjang ini tak dapat menjadi sisi segitiga: tiap panjang harus lebih pendek daripada jumlah dua lainnya.'))}</p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="rtable">
                <thead>
                  <tr>
                    <th>{tc(L('angle', 'sudut'))}</th>
                    <th>
                      <Tex src="\arccos\frac{b^2+c^2-a^2}{2bc}" />
                    </th>
                    <th>{tc(L('half-angle form', 'bentuk setengah sudut'))}</th>
                    <th>{tc(L('kind', 'jenis'))}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.name} style={r.name === biggest ? { fontWeight: 700 } : undefined}>
                      <td>{r.name}</td>
                      <td>{angleText(r.n, sep)}</td>
                      <td>{angleText(r.s, sep)}</td>
                      <td>{tc(KIND_NAME[r.kind])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="small">
              {tc(L('The largest angle is opposite the longest side', 'Sudut terbesar berada di depan sisi terpanjang'))} ({biggest}): {tc(L('find it first, because it is the only one that can be obtuse.', 'cari lebih dulu, karena hanya ia yang dapat tumpul.'))} {tc(L('Sum of the angles', 'Jumlah sudut'))}: {fmt(rows.reduce((s, r) => s + r.s, 0), sep, 6)}°.
            </p>
            {lost ? (
              <p className="badline">{tc(L('The plain arccosine form has lost digits here: the cosine of a tiny angle rounds to 1, and the angle comes out as 0 or as a number with few correct digits. The half-angle form keeps them.', 'Bentuk arkus kosinus biasa kehilangan digit di sini: kosinus sudut yang sangat kecil dibulatkan menjadi 1, dan sudutnya keluar sebagai 0 atau bilangan dengan sedikit digit benar. Bentuk setengah sudut menjaganya.'))}</p>
            ) : (
              <p className="small muted">{tc(L('Both forms agree to six digits. Try the very thin triangle.', 'Kedua bentuk sama sampai enam digit. Coba segitiga sangat tipis.'))}</p>
            )}
          </>
        )}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------- a journey */

const bearing = (x: number): string => `${String(Math.round(x) % 360).padStart(3, '0')}°`
const TRIP_PRESETS: { name: Loc; d1: number; b1: number; d2: number; b2: number }[] = [
  { name: L('east, then north', 'ke timur, lalu ke utara'), d1: 30, b1: 90, d2: 40, b2: 0 },
  { name: L('a long bend', 'tikungan lebar'), d1: 120, b1: 60, d2: 90, b2: 120 },
  { name: L('a sharp turn back', 'berbalik tajam'), d1: 100, b1: 40, d2: 70, b2: 190 },
  { name: L('across north', 'melewati utara'), d1: 50, b1: 350, d2: 60, b2: 20 },
]

export function CosineLawTrip() {
  const { tc } = useI18n()
  const sep = useSep()
  const [d1, setD1] = useState(120)
  const [b1, setB1] = useState(60)
  const [d2, setD2] = useState(90)
  const [b2, setB2] = useState(120)
  const t = trip(d1, b1, d2, b2)
  const P1: P = [d1 * Math.sin(b1 * RAD), d1 * Math.cos(b1 * RAD)]
  const P2: P = [P1[0] + d2 * Math.sin(b2 * RAD), P1[1] + d2 * Math.cos(b2 * RAD)]
  const xs = [0, P1[0], P2[0]]
  const ys = [0, P1[1], P2[1]]
  const f = frame(Math.min(...xs) - 12, Math.max(...xs) + 12, Math.min(...ys) - 12, Math.max(...ys) + 22, 340, 270)
  const label = t ? `${tc(L('A ship sails', 'Sebuah kapal berlayar'))} ${d1} km ${tc(L('on bearing', 'pada arah'))} ${bearing(b1)} ${tc(L('and then', 'lalu'))} ${d2} km ${tc(L('on bearing', 'pada arah'))} ${bearing(b2)}. ${tc(L('It is', 'Ia berada'))} ${fmt(t.distance, sep, 1)} km ${tc(L('from the start, on bearing', 'dari awal, pada arah'))} ${bearing(t.direct)}.` : ''
  return (
    <Frame name="lctrip">
      <div className="chips">
        {TRIP_PRESETS.map((p, i) => (
          <button
            key={i}
            className="chip ghost"
            onClick={() => {
              setD1(p.d1)
              setB1(p.b1)
              setD2(p.d2)
              setB2(p.b2)
            }}
          >
            {tc(p.name)}
          </button>
        ))}
      </div>
      <label className="lbl slider">
        d₁ = <b>{d1} km</b>
        <input type="range" min={10} max={200} step={5} value={d1} aria-label="d1" onChange={(e) => setD1(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        {tc(L('bearing', 'arah'))} 1 = <b>{bearing(b1)}</b>
        <input type="range" min={0} max={359} step={1} value={b1} aria-label={tc(L('first bearing', 'arah pertama'))} onChange={(e) => setB1(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        d₂ = <b>{d2} km</b>
        <input type="range" min={10} max={200} step={5} value={d2} aria-label="d2" onChange={(e) => setD2(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        {tc(L('bearing', 'arah'))} 2 = <b>{bearing(b2)}</b>
        <input type="range" min={0} max={359} step={1} value={b2} aria-label={tc(L('second bearing', 'arah kedua'))} onChange={(e) => setB2(Number(e.target.value))} />
      </label>
      {t && (
        <svg viewBox={`0 0 ${f.W} ${f.H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 440, display: 'block', margin: '6px auto' }}>
          <polygon points={`${f.X(0)},${f.Y(0)} ${f.X(P1[0])},${f.Y(P1[1])} ${f.X(P2[0])},${f.Y(P2[1])}`} fill="var(--brand)" fillOpacity={0.1} />
          <line x1={f.X(0)} y1={f.Y(0)} x2={f.X(P2[0])} y2={f.Y(P2[1])} stroke="var(--bad)" strokeWidth={2} strokeDasharray="6 4" />
          <line x1={f.X(0)} y1={f.Y(0)} x2={f.X(P1[0])} y2={f.Y(P1[1])} stroke="var(--brand)" strokeWidth={3} strokeLinecap="round" />
          <line x1={f.X(P1[0])} y1={f.Y(P1[1])} x2={f.X(P2[0])} y2={f.Y(P2[1])} stroke="var(--coral)" strokeWidth={3} strokeLinecap="round" />
          <circle cx={f.X(0)} cy={f.Y(0)} r={4} fill="var(--text)" />
          <circle cx={f.X(P1[0])} cy={f.Y(P1[1])} r={3.5} fill="var(--text)" />
          <circle cx={f.X(P2[0])} cy={f.Y(P2[1])} r={4.5} fill="var(--bad)" />
          <text x={f.X(0) + 6} y={f.Y(0) + 14} fontSize={11} fontWeight={700} fill="var(--text)">
            {tc(L('start', 'awal'))}
          </text>
          <text x={f.X(P1[0]) + 6} y={f.Y(P1[1]) - 6} fontSize={11} fontWeight={700} fill="var(--text)">
            {tc(L('turn', 'belok'))}
          </text>
          <text x={f.X(P2[0]) + 6} y={f.Y(P2[1]) - 6} fontSize={11} fontWeight={700} fill="var(--bad)">
            {tc(L('end', 'akhir'))}
          </text>
          <g transform={`translate(${f.W - 26},34)`}>
            <line x1={0} y1={14} x2={0} y2={-14} stroke="var(--muted)" strokeWidth={1.6} />
            <polygon points="0,-18 -4,-9 4,-9" fill="var(--muted)" />
            <text x={0} y={30} fontSize={11} textAnchor="middle" fill="var(--muted)">
              N
            </text>
          </g>
        </svg>
      )}
      <div className="wgtout" aria-live="polite">
        {t ? (
          <>
            <p className="small" style={{ overflowWrap: 'anywhere' }}>
              {tc(L('The course turns', 'Haluan berbelok'))} {short(t.turn, sep, 0)}° {tc(L('at the end of the first leg, so the angle of the triangle there is', 'di ujung leg pertama, sehingga sudut segitiga di sana adalah'))} γ = 180° − {short(t.turn, sep, 0)}° = {short(t.inside, sep, 0)}°.
            </p>
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              <Tex src="s^2=d_1^2+d_2^2-2\,d_1d_2\cos\gamma" />
              {' → '}
              <b>
                {tc(L('distance', 'jarak'))} = {fmt(t.distance, sep, 2)} km
              </b>
              , {tc(L('bearing of the end', 'arah akhir'))} <b>{bearing(t.direct)}</b>, {tc(L('bearing back', 'arah pulang'))} <b>{bearing(t.back)}</b>.
            </p>
            <p className="small muted">{tc(L('The angle at the start comes from the law of cosines on the three sides; adding it to (or subtracting it from) the first bearing gives the bearing of the end.', 'Sudut di awal berasal dari aturan kosinus pada ketiga sisi; menambahkannya pada (atau mengurangkannya dari) arah pertama memberi arah akhir.'))}</p>
          </>
        ) : (
          <p className="warnline">{tc(L('Both legs need a positive length.', 'Kedua leg memerlukan panjang yang positif.'))}</p>
        )}
      </div>
    </Frame>
  )
}
