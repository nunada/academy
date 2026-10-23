import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import {
  IDENTITIES,
  agreeingAngles,
  agrees,
  circleInfo,
  cosDeg,
  exactTex,
  exactValue,
  otherAngle,
  ratiosOf,
  sinDeg,
  sixValues,
  solveBasic,
  solveRight,
  tanDeg,
  toRad,
  waveAt,
  waveInfo,
  waveLevel,
  type BasicFn,
  type Identity,
  type RightGiven,
  type RightTriangle,
  type Wave,
} from '../../lib/trigbasic'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/** A number with `digits` decimals and the reader's decimal mark; `–` where it is undefined. */
function fmt(x: number, sep: string, digits = 4): string {
  if (!Number.isFinite(x)) return '–'
  const s = (Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits)
  return s.replace('.', sep)
}
/** The same without trailing zeros. */
function short(x: number, sep: string, digits = 4): string {
  if (!Number.isFinite(x)) return '–'
  return Number((Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits)).toString().replace('.', sep)
}
const parse = (s: string): number => (s.trim() === '' ? NaN : Number(s.trim().replace(',', '.')))

/** An arc around (cx, cy) from math angle a0 to a1 (degrees, counterclockwise, a1 > a0), in screen coordinates. */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number): string => `${(cx + r * Math.cos(toRad(a))).toFixed(2)},${(cy - r * Math.sin(toRad(a))).toFixed(2)}`
  return `M${p(a0)}A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${p(a1)}`
}

/* ------------------------------------------------------------------------------ the triangle */

/** A right triangle, drawn with A at the left, the right angle at C and B above C, with the sides named from the angle we look from. */
function RightFigure({ t, from, scale, label }: { t: RightTriangle; from: 'A' | 'B'; scale: number; label: string }) {
  const { tc } = useI18n()
  const sep = useSep()
  // t is seen from A: opp is the vertical leg BC, adj the horizontal leg AC
  const x0 = 28
  const y0 = 232
  const w = t.adj * scale
  const h = t.opp * scale
  const A = [x0, y0]
  const C = [x0 + w, y0]
  const B = [x0 + w, y0 - h]
  const seen = from === 'A' ? t : otherAngle(t)
  const nameHyp = tc(L('hypotenuse', 'sisi miring'))
  const nameOpp = tc(L('opposite', 'sisi depan'))
  const nameAdj = tc(L('adjacent', 'sisi samping'))
  // the horizontal leg is the adjacent one when looking from A and the opposite one when looking from B
  const horizontal = from === 'A' ? nameAdj : nameOpp
  const vertical = from === 'A' ? nameOpp : nameAdj
  const r = Math.min(34, Math.max(14, Math.min(w, h) * 0.35))
  const arc = from === 'A' ? arcPath(A[0], A[1], r, 0, t.A) : arcPath(B[0], B[1], r, t.A - 180, -90)
  const letter = from === 'A' ? 'A' : 'B'
  const at = from === 'A' ? [A[0] + r + 8, A[1] - 6] : [B[0] - r - 22, B[1] + r + 4]
  const sq = Math.min(14, w / 3, h / 3)
  return (
    <svg viewBox="0 0 320 260" role="img" aria-label={label} style={{ width: '100%', maxWidth: 380, display: 'block', margin: '6px auto' }}>
      <polygon points={`${A.join(',')} ${C.join(',')} ${B.join(',')}`} fill="color-mix(in srgb, var(--gold) 14%, transparent)" stroke="var(--text)" strokeWidth={2.2} strokeLinejoin="round" />
      <path d={arc} fill="none" stroke="var(--bad)" strokeWidth={2.4} />
      <text x={at[0]} y={at[1]} fontSize={14} fontWeight={700} fill="var(--bad)">
        {letter}
      </text>
      <rect x={C[0] - sq} y={C[1] - sq} width={sq} height={sq} fill="none" stroke="var(--text)" strokeWidth={1.4} />
      <text x={(A[0] + C[0]) / 2} y={C[1] + 18} fontSize={13} textAnchor="middle" fill="var(--text)">
        {horizontal} {short(from === 'A' ? seen.adj : seen.opp, sep, 3)}
      </text>
      <text x={C[0] + 8} y={(B[1] + C[1]) / 2} fontSize={13} fill="var(--text)">
        {vertical} {short(from === 'A' ? seen.opp : seen.adj, sep, 3)}
      </text>
      <text x={(A[0] + B[0]) / 2 - 8} y={(A[1] + B[1]) / 2 - 8} fontSize={13} textAnchor="end" fill="var(--text)">
        {nameHyp} {short(t.hyp, sep, 3)}
      </text>
      <text x={C[0] + 8} y={C[1] + 18} fontSize={13} fontWeight={700} fill="var(--text)">
        C
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------------------- the ratios */

export function TrigRatio() {
  const { tc } = useI18n()
  const sep = useSep()
  const [angle, setAngle] = useState(35)
  const [hyp, setHyp] = useState(8)
  const [from, setFrom] = useState<'A' | 'B'>('A')
  const t = solveRight({ kind: 'angleHyp', angle, hyp }) as RightTriangle
  const seen = from === 'A' ? t : otherAngle(t)
  const r = ratiosOf(seen)
  const theta = seen.A
  const rows: [string, string, number, number, number, string][] = [
    ['\\sin', 'opposite / hypotenuse', seen.opp, seen.hyp, r.sin, 'sin'],
    ['\\cos', 'adjacent / hypotenuse', seen.adj, seen.hyp, r.cos, 'cos'],
    ['\\tan', 'opposite / adjacent', seen.opp, seen.adj, r.tan, 'tan'],
    ['\\csc', 'hypotenuse / opposite', seen.hyp, seen.opp, r.csc, 'csc'],
    ['\\sec', 'hypotenuse / adjacent', seen.hyp, seen.adj, r.sec, 'sec'],
    ['\\cot', 'adjacent / opposite', seen.adj, seen.opp, r.cot, 'cot'],
  ]
  const FORMULA_ID: Record<string, string> = {
    'opposite / hypotenuse': 'depan / miring',
    'adjacent / hypotenuse': 'samping / miring',
    'opposite / adjacent': 'depan / samping',
    'hypotenuse / opposite': 'miring / depan',
    'hypotenuse / adjacent': 'miring / samping',
    'adjacent / opposite': 'samping / depan',
  }
  const six = sixValues(theta)
  const label = `${tc(L('A right triangle with hypotenuse', 'Segitiga siku-siku dengan sisi miring'))} ${short(t.hyp, sep, 2)}, ${tc(L('angle A', 'sudut A'))} ${short(t.A, sep, 2)}°, ${tc(L('angle B', 'sudut B'))} ${short(t.B, sep, 2)}°. ${tc(L('Seen from angle', 'Dilihat dari sudut'))} ${from}: ${tc(L('opposite', 'sisi depan'))} ${short(seen.opp, sep, 3)}, ${tc(L('adjacent', 'sisi samping'))} ${short(seen.adj, sep, 3)}.`
  return (
    <Frame name="trigratio">
      <label className="lbl slider">
        {tc(L('angle A', 'sudut A'))} = <b>{angle}°</b>
        <input type="range" min={5} max={85} step={1} value={angle} aria-label={tc(L('angle A in degrees', 'sudut A dalam derajat'))} onChange={(e) => setAngle(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        {tc(L('hypotenuse', 'sisi miring'))} = <b>{hyp}</b>
        <input type="range" min={1} max={12} step={1} value={hyp} aria-label={tc(L('length of the hypotenuse', 'panjang sisi miring'))} onChange={(e) => setHyp(Number(e.target.value))} />
      </label>
      <div className="chips">
        {(['A', 'B'] as const).map((q) => (
          <button key={q} className={`chip ${from === q ? 'on' : ''}`} onClick={() => setFrom(q)} aria-pressed={from === q}>
            {tc(L(`look from angle ${q}`, `lihat dari sudut ${q}`))}
          </button>
        ))}
      </div>
      <RightFigure t={t} from={from} scale={18} label={label} />
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>{tc(L('ratio', 'perbandingan'))}</th>
              <th>{tc(L('sides', 'sisi'))}</th>
              <th>{tc(L('from the triangle', 'dari segitiga'))}</th>
              <th>{tc(L('from the angle', 'dari sudut'))}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([fn, sides, top, bottom, value, key]) => (
              <tr key={key}>
                <td>
                  <Tex src={`${fn}\\,${from === 'A' ? 'A' : 'B'}`} />
                </td>
                <td>{tc(L(sides, FORMULA_ID[sides]))}</td>
                <td>
                  {short(top, sep, 3)} / {short(bottom, sep, 3)} = {fmt(value, sep, 4)}
                </td>
                <td>{fmt(six[key as keyof typeof six], sep, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small">
        {tc(L('Change the hypotenuse: the sides grow, the ratios stay the same, because the triangles are similar. Look from the other angle: opposite and adjacent swap, so sine and cosine swap.', 'Ubah sisi miring: sisi-sisinya membesar, perbandingannya tetap, karena segitiganya sebangun. Lihat dari sudut yang lain: sisi depan dan samping bertukar, jadi sinus dan kosinus bertukar.'))}
      </p>
    </Frame>
  )
}

/* ------------------------------------------------------------------------- solve a right triangle */

interface Kind {
  id: RightGiven['kind']
  label: Loc
  f1: Loc
  f2: Loc
  how: Loc
}
const KINDS: Kind[] = [
  { id: 'angleHyp', label: L('angle + hypotenuse', 'sudut + sisi miring'), f1: L('angle A (°)', 'sudut A (°)'), f2: L('hypotenuse', 'sisi miring'), how: L('opposite = hypotenuse × sin A, adjacent = hypotenuse × cos A', 'depan = sisi miring × sin A, samping = sisi miring × cos A') },
  { id: 'angleOpp', label: L('angle + opposite', 'sudut + sisi depan'), f1: L('angle A (°)', 'sudut A (°)'), f2: L('opposite', 'sisi depan'), how: L('hypotenuse = opposite ÷ sin A, adjacent = opposite ÷ tan A', 'sisi miring = depan ÷ sin A, samping = depan ÷ tan A') },
  { id: 'angleAdj', label: L('angle + adjacent', 'sudut + sisi samping'), f1: L('angle A (°)', 'sudut A (°)'), f2: L('adjacent', 'sisi samping'), how: L('hypotenuse = adjacent ÷ cos A, opposite = adjacent × tan A', 'sisi miring = samping ÷ cos A, depan = samping × tan A') },
  { id: 'oppHyp', label: L('opposite + hypotenuse', 'sisi depan + sisi miring'), f1: L('opposite', 'sisi depan'), f2: L('hypotenuse', 'sisi miring'), how: L('adjacent from Pythagoras, A = arcsin(opposite ÷ hypotenuse)', 'samping dari Pythagoras, A = arcsin(depan ÷ sisi miring)') },
  { id: 'adjHyp', label: L('adjacent + hypotenuse', 'sisi samping + sisi miring'), f1: L('adjacent', 'sisi samping'), f2: L('hypotenuse', 'sisi miring'), how: L('opposite from Pythagoras, A = arccos(adjacent ÷ hypotenuse)', 'depan dari Pythagoras, A = arccos(samping ÷ sisi miring)') },
  { id: 'oppAdj', label: L('opposite + adjacent', 'sisi depan + sisi samping'), f1: L('opposite', 'sisi depan'), f2: L('adjacent', 'sisi samping'), how: L('hypotenuse from Pythagoras, A = arctan(opposite ÷ adjacent)', 'sisi miring dari Pythagoras, A = arctan(depan ÷ samping)') },
]
const SCENARIOS: { kind: RightGiven['kind']; v1: string; v2: string; text: Loc }[] = [
  { kind: 'angleAdj', v1: '35', v2: '40', text: L('You stand 40 m from the foot of a tower and see its top at an angle of elevation of 35°. How tall is the tower above your eye?', 'Anda berdiri 40 m dari kaki sebuah menara dan melihat puncaknya dengan sudut elevasi 35°. Berapa tinggi menara di atas mata Anda?') },
  { kind: 'angleHyp', v1: '70', v2: '5', text: L('A 5 m ladder leans against a wall at 70° to the ground. How high does it reach, and how far is its foot from the wall?', 'Sebuah tangga 5 m bersandar pada dinding dengan sudut 70° terhadap tanah. Seberapa tinggi ia mencapai, dan seberapa jauh kakinya dari dinding?') },
  { kind: 'oppHyp', v1: '1', v2: '6', text: L('A ramp 6 m long rises 1 m. What angle does it make with the ground?', 'Sebuah landasan miring sepanjang 6 m naik 1 m. Berapa sudutnya terhadap tanah?') },
  { kind: 'oppAdj', v1: '8', v2: '100', text: L('A road climbs 8 m over a horizontal distance of 100 m. What is its angle of slope?', 'Sebuah jalan naik 8 m pada jarak mendatar 100 m. Berapa sudut kemiringannya?') },
  { kind: 'angleAdj', v1: '50', v2: '3', text: L('The shadow of a pole is 3 m long when the sun is 50° above the horizon. How tall is the pole?', 'Bayangan sebuah tiang sepanjang 3 m ketika matahari 50° di atas cakrawala. Berapa tinggi tiang itu?') },
]

export function TrigRight() {
  const { tc } = useI18n()
  const sep = useSep()
  const [kind, setKind] = useState<RightGiven['kind']>('angleAdj')
  const [v1, setV1] = useState('35')
  const [v2, setV2] = useState('40')
  const [scenario, setScenario] = useState<number | null>(0)
  const k = KINDS.find((q) => q.id === kind) as Kind
  const a = parse(v1)
  const b = parse(v2)
  const given = (kind === 'angleHyp' ? { kind, angle: a, hyp: b } : kind === 'angleOpp' ? { kind, angle: a, opp: b } : kind === 'angleAdj' ? { kind, angle: a, adj: b } : kind === 'oppHyp' ? { kind, opp: a, hyp: b } : kind === 'adjHyp' ? { kind, adj: a, hyp: b } : { kind, opp: a, adj: b }) as RightGiven
  const t = solveRight(given)
  const label = t ? `${tc(L('Right triangle', 'Segitiga siku-siku'))}: ${tc(L('angle A', 'sudut A'))} ${short(t.A, sep, 3)}°, ${tc(L('opposite', 'sisi depan'))} ${short(t.opp, sep, 3)}, ${tc(L('adjacent', 'sisi samping'))} ${short(t.adj, sep, 3)}, ${tc(L('hypotenuse', 'sisi miring'))} ${short(t.hyp, sep, 3)}` : ''
  return (
    <Frame name="trigright">
      <div className="chips">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            className={`chip ghost ${scenario === i ? 'on' : ''}`}
            onClick={() => {
              setKind(s.kind)
              setV1(s.v1)
              setV2(s.v2)
              setScenario(i)
            }}
            aria-pressed={scenario === i}
          >
            {tc(L(['tower', 'ladder', 'ramp', 'road', 'shadow'][i], ['menara', 'tangga', 'landasan', 'jalan', 'bayangan'][i]))}
          </button>
        ))}
      </div>
      {scenario !== null && <p className="small">{tc(SCENARIOS[scenario].text)}</p>}
      <div className="chips">
        {KINDS.map((q) => (
          <button
            key={q.id}
            className={`chip ${kind === q.id ? 'on' : ''}`}
            onClick={() => {
              setKind(q.id)
              setScenario(null)
            }}
            aria-pressed={kind === q.id}
          >
            {tc(q.label)}
          </button>
        ))}
      </div>
      <div className="inrow">
        <label className="lbl">
          {tc(k.f1)} = <input style={{ width: '6em' }} value={v1} inputMode="decimal" aria-label={tc(k.f1)} onChange={(e) => (setV1(e.target.value), setScenario(null))} />
        </label>
        <label className="lbl">
          {tc(k.f2)} = <input style={{ width: '6em' }} value={v2} inputMode="decimal" aria-label={tc(k.f2)} onChange={(e) => (setV2(e.target.value), setScenario(null))} />
        </label>
      </div>
      {t ? (
        <>
          <RightFigure t={t} from="A" scale={Math.min(18, 200 / Math.max(t.adj, t.opp))} label={label} />
          <div className="wgtout" aria-live="polite">
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              {tc(L('angle A', 'sudut A'))} = {fmt(t.A, sep, 3)}° · {tc(L('angle B', 'sudut B'))} = {fmt(t.B, sep, 3)}° · {tc(L('opposite', 'sisi depan'))} = {fmt(t.opp, sep, 3)} · {tc(L('adjacent', 'sisi samping'))} = {fmt(t.adj, sep, 3)} · {tc(L('hypotenuse', 'sisi miring'))} = {fmt(t.hyp, sep, 3)}
            </p>
            <p className="small">{tc(k.how)}.</p>
            <p className="small">
              {tc(L('Check', 'Periksa'))}: {fmt(t.opp * t.opp, sep, 3)} + {fmt(t.adj * t.adj, sep, 3)} = {fmt(t.opp * t.opp + t.adj * t.adj, sep, 3)} = {tc(L('hypotenuse', 'sisi miring'))}² = {fmt(t.hyp * t.hyp, sep, 3)}.
            </p>
          </div>
        </>
      ) : (
        <p className="warnline">{tc(L('These numbers cannot make a right triangle: an angle must be between 0° and 90°, lengths must be positive, and the hypotenuse must be longer than each leg.', 'Bilangan ini tidak dapat membentuk segitiga siku-siku: sudut harus di antara 0° dan 90°, panjang harus positif, dan sisi miring harus lebih panjang daripada tiap sisi tegak.'))}</p>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------------------------ the unit circle */

const CIRCLE_PRESETS = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360]
const QUADRANT_NAME = ['on an axis', 'quadrant I', 'quadrant II', 'quadrant III', 'quadrant IV']
const QUADRANT_NAME_ID = ['pada sumbu', 'kuadran I', 'kuadran II', 'kuadran III', 'kuadran IV']
const signText = (s: number): string => (Number.isNaN(s) ? '?' : s > 0 ? '+' : s < 0 ? '−' : '0')

export function TrigCircle() {
  const { tc } = useI18n()
  const sep = useSep()
  const [deg, setDeg] = useState(150)
  const info = circleInfo(deg)
  const six = sixValues(deg)
  const s = sinDeg(deg)
  const c = cosDeg(deg)
  const R = 80
  const cx = 130
  const cy = 112
  const px = cx + R * c
  const py = cy - R * s
  // the sweep from 0° to the angle, in the direction of the turn
  const sweep = deg >= 0 ? Math.min(deg, 359.9) : Math.max(deg, -359.9)
  const exact = (fn: 'sin' | 'cos' | 'tan') => {
    const e = exactValue(fn, Math.round(deg))
    if (Number.isInteger(deg) && e !== null) return e === 'undefined' ? null : exactTex(e)
    return null
  }
  const label = `${tc(L('The angle', 'Sudut'))} ${short(deg, sep, 2)}°: ${tc(L('the point', 'titik'))} (${fmt(c, sep, 4)}; ${fmt(s, sep, 4)}) ${tc(L('on the unit circle', 'pada lingkaran satuan'))}, ${tc(L(QUADRANT_NAME[info.quadrant], QUADRANT_NAME_ID[info.quadrant]))}, ${tc(L('reference angle', 'sudut acuan'))} ${short(info.ref, sep, 2)}°`
  const values: ['sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot', string][] = [
    ['sin', '\\sin'],
    ['cos', '\\cos'],
    ['tan', '\\tan'],
    ['csc', '\\csc'],
    ['sec', '\\sec'],
    ['cot', '\\cot'],
  ]
  return (
    <Frame name="trigcircle">
      <label className="lbl slider">
        {tc(L('angle', 'sudut'))} = <b>{short(deg, sep, 1)}°</b>
        <input type="range" min={-360} max={720} step={1} value={Math.round(deg)} aria-label={tc(L('angle in degrees', 'sudut dalam derajat'))} onChange={(e) => setDeg(Number(e.target.value))} />
      </label>
      <div className="chips">
        {CIRCLE_PRESETS.map((p) => (
          <button key={p} className={`chip ghost ${deg === p ? 'on' : ''}`} onClick={() => setDeg(p)} aria-pressed={deg === p}>
            {p}°
          </button>
        ))}
      </div>
      <svg viewBox="0 0 260 224" role="img" aria-label={label} style={{ width: '100%', maxWidth: 380, display: 'block', margin: '6px auto' }}>
        <line x1={12} y1={cy} x2={248} y2={cy} stroke="var(--muted)" strokeWidth={1} />
        <line x1={cx} y1={8} x2={cx} y2={216} stroke="var(--muted)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth={1.6} />
        {info.quadrant !== 0 && <path d={`M${cx},${cy}L${px.toFixed(2)},${py.toFixed(2)}L${px.toFixed(2)},${cy}Z`} fill="color-mix(in srgb, var(--gold) 28%, transparent)" stroke="none" />}
        <path d={arcPath(cx, cy, 22, 0, Math.abs(sweep) < 0.05 ? 0.05 : sweep > 0 ? sweep : 0)} fill="none" stroke="var(--bad)" strokeWidth={2.2} opacity={sweep >= 0 ? 1 : 0} />
        {sweep < 0 && <path d={arcPath(cx, cy, 22, sweep, 0)} fill="none" stroke="var(--bad)" strokeWidth={2.2} />}
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--text)" strokeWidth={2.4} />
        <line x1={px} y1={py} x2={px} y2={cy} stroke="var(--coral)" strokeWidth={2.6} />
        <line x1={cx} y1={cy} x2={px} y2={cy} stroke="var(--brand)" strokeWidth={2.6} />
        <circle cx={px} cy={py} r={4.5} fill="var(--text)" />
        <text x={8} y={16} fontSize={12} fontWeight={700} fill="var(--text)">
          (cos; sin) = ({fmt(c, sep, 3)}; {fmt(s, sep, 3)})
        </text>
        <text x={244} y={cy - 5} fontSize={11} textAnchor="end" fill="var(--muted)">
          x
        </text>
        <text x={cx + 5} y={16} fontSize={11} fill="var(--muted)">
          y
        </text>
        <text x={(cx + px) / 2} y={cy + (s >= 0 ? 14 : -6)} fontSize={11} textAnchor="middle" fill="var(--brand)">
          cos
        </text>
        <text x={px + (c >= 0 ? 6 : -6)} y={(cy + py) / 2 + 4} fontSize={11} textAnchor={c >= 0 ? 'start' : 'end'} fill="var(--coral)">
          sin
        </text>
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          {short(deg, sep, 2)}° ≡ {short(info.deg, sep, 2)}° · {tc(L(QUADRANT_NAME[info.quadrant], QUADRANT_NAME_ID[info.quadrant]))} · {tc(L('reference angle', 'sudut acuan'))} {short(info.ref, sep, 2)}°
        </p>
        <p className="small">
          {tc(L('signs', 'tanda'))}: sin {signText(info.sinSign)}, cos {signText(info.cosSign)}, tan {Number.isNaN(info.tanSign) ? tc(L('undefined', 'tak terdefinisi')) : signText(info.tanSign)}
        </p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>{tc(L('function', 'fungsi'))}</th>
              <th>{tc(L('exact', 'eksak'))}</th>
              <th>{tc(L('decimal', 'desimal'))}</th>
            </tr>
          </thead>
          <tbody>
            {values.map(([key, texFn]) => {
              const ex = key === 'sin' || key === 'cos' || key === 'tan' ? exact(key) : null
              return (
                <tr key={key}>
                  <td>
                    <Tex src={`${texFn}\\,${short(deg, '.', 2)}^\\circ`} />
                  </td>
                  <td>{ex !== null ? <Tex src={ex} /> : '–'}</td>
                  <td>{Number.isNaN(six[key]) ? tc(L('undefined', 'tak terdefinisi')) : fmt(six[key], sep, 5)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------------------- equations */

const EXACT_LEVELS: { c: number; tex: string }[] = [
  { c: -1, tex: '-1' },
  { c: -Math.sqrt(3) / 2, tex: '-\\frac{\\sqrt3}{2}' },
  { c: -Math.SQRT1_2, tex: '-\\frac{\\sqrt2}{2}' },
  { c: -0.5, tex: '-\\frac12' },
  { c: 0, tex: '0' },
  { c: 0.5, tex: '\\frac12' },
  { c: Math.SQRT1_2, tex: '\\frac{\\sqrt2}{2}' },
  { c: Math.sqrt(3) / 2, tex: '\\frac{\\sqrt3}{2}' },
  { c: 1, tex: '1' },
]
const TAN_LEVELS: { c: number; tex: string }[] = [
  { c: -Math.sqrt(3), tex: '-\\sqrt3' },
  { c: -1, tex: '-1' },
  { c: -1 / Math.sqrt(3), tex: '-\\frac{\\sqrt3}{3}' },
  { c: 0, tex: '0' },
  { c: 1 / Math.sqrt(3), tex: '\\frac{\\sqrt3}{3}' },
  { c: 1, tex: '1' },
  { c: Math.sqrt(3), tex: '\\sqrt3' },
]
const FNS: Record<BasicFn, (d: number) => number> = { sin: sinDeg, cos: cosDeg, tan: tanDeg }

export function TrigEquation() {
  const { tc } = useI18n()
  const sep = useSep()
  const [fn, setFn] = useState<BasicFn>('sin')
  const [text, setText] = useState('0.5')
  const [pick, setPick] = useState<number | null>(5)
  const levels = fn === 'tan' ? TAN_LEVELS : EXACT_LEVELS
  const c = pick !== null && pick < levels.length ? levels[pick].c : parse(text)
  const valid = Number.isFinite(c)
  const sols = useMemo(() => (valid ? solveBasic(fn, c) : []), [fn, c, valid])
  const principal = fn === 'sin' ? (Math.asin(c) * 180) / Math.PI : fn === 'cos' ? (Math.acos(c) * 180) / Math.PI : (Math.atan(c) * 180) / Math.PI
  const alphaText = short(Math.round(principal * 1e6) / 1e6, '.', 6)
  const general =
    fn === 'sin'
      ? `x=${alphaText}^\\circ+360^\\circ k \\quad\\text{or}\\quad x=${short(Math.round((180 - principal) * 1e6) / 1e6, '.', 6)}^\\circ+360^\\circ k`
      : fn === 'cos'
        ? `x=\\pm${alphaText}^\\circ+360^\\circ k`
        : `x=${alphaText}^\\circ+180^\\circ k`
  // the graph over one turn
  const W = 330
  const H = 170
  const ymax = fn === 'tan' ? 3 : 1.5
  const X = (x: number): number => 14 + (x / 360) * (W - 28)
  const Y = (y: number): number => H / 2 - (y / ymax) * (H / 2 - 10)
  let d = ''
  let pen = false
  for (let k = 0; k <= 360; k++) {
    const y = FNS[fn](k)
    if (!Number.isFinite(y) || Math.abs(y) > ymax) {
      pen = false
      continue
    }
    d += `${pen ? 'L' : 'M'}${X(k).toFixed(1)},${Y(y).toFixed(1)}`
    pen = true
  }
  const label = `${tc(L('The graph of', 'Grafik'))} ${fn} x ${tc(L('from 0° to 360° and the level', 'dari 0° sampai 360° dan tingkat'))} ${fmt(c, sep, 4)}. ${sols.length ? `${tc(L('Solutions', 'Penyelesaian'))}: ${sols.map((v) => `${short(v, sep, 4)}°`).join(', ')}` : tc(L('No solution', 'Tidak ada penyelesaian'))}`
  return (
    <Frame name="trigequation">
      <div className="chips">
        {(['sin', 'cos', 'tan'] as const).map((q) => (
          <button
            key={q}
            className={`chip ${fn === q ? 'on' : ''}`}
            onClick={() => {
              setFn(q)
              setPick(q === 'tan' ? 5 : 5)
            }}
            aria-pressed={fn === q}
          >
            <Tex src={`\\${q}\\,x=c`} />
          </button>
        ))}
      </div>
      <div className="chips">
        {levels.map((l, i) => (
          <button key={i} className={`chip ghost ${pick === i ? 'on' : ''}`} onClick={() => setPick(i)} aria-pressed={pick === i}>
            <Tex src={`c=${l.tex}`} />
          </button>
        ))}
      </div>
      <div className="inrow">
        <label className="lbl">
          c = <input style={{ width: '6em' }} value={pick !== null && pick < levels.length ? short(levels[pick].c, sep, 4) : text} inputMode="decimal" aria-label="c" onChange={(e) => (setText(e.target.value), setPick(null))} />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 440, display: 'block', margin: '6px auto' }}>
        <line x1={14} y1={Y(0)} x2={W - 14} y2={Y(0)} stroke="var(--muted)" strokeWidth={1} />
        {[0, 90, 180, 270, 360].map((v) => (
          <g key={v}>
            <line x1={X(v)} y1={Y(0) - 4} x2={X(v)} y2={Y(0) + 4} stroke="var(--muted)" strokeWidth={1} />
            <text x={X(v)} y={H - 4} fontSize={10} textAnchor="middle" fill="var(--muted)">
              {v}°
            </text>
          </g>
        ))}
        <path d={d} fill="none" stroke="var(--brand)" strokeWidth={2.4} />
        {valid && Math.abs(c) <= ymax && <line x1={14} y1={Y(c)} x2={W - 14} y2={Y(c)} stroke="var(--coral)" strokeWidth={1.6} strokeDasharray="6 4" />}
        {sols.map((v) => (
          <g key={v}>
            <circle cx={X(v)} cy={Y(c)} r={4.5} fill="var(--bad)" />
            <text x={X(v)} y={Y(c) - 8} fontSize={10} fontWeight={700} textAnchor="middle" fill="var(--text)">
              {short(v, sep, 2)}°
            </text>
          </g>
        ))}
      </svg>
      <div className="wgtout" aria-live="polite">
        {!valid ? (
          <p className="warnline">{tc(L('Type a number for c.', 'Ketik sebuah bilangan untuk c.'))}</p>
        ) : sols.length === 0 ? (
          <p className="badline">{tc(L(`No solution: ${fn} never goes beyond −1 and 1.`, `Tidak ada penyelesaian: ${fn} tidak pernah melewati −1 dan 1.`))}</p>
        ) : (
          <>
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              {tc(L('Between 0° and 360°', 'Di antara 0° dan 360°'))}: x = {sols.map((v) => `${short(v, sep, 4)}°`).join(' ' + tc(L('and', 'dan')) + ' ')}
            </p>
            <p className="small">{tc(L('All solutions, with k any whole number:', 'Semua penyelesaian, dengan k bilangan bulat apa saja:'))}</p>
            <Tex src={general} display />
          </>
        )}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------- the waves */

const VALUES_A = [-3, -2, -1, -0.5, 0.5, 1, 1.5, 2, 3]
const VALUES_B = [0.5, 1, 1.5, 2, 3, 4]

export function TrigWave() {
  const { tc } = useI18n()
  const sep = useSep()
  const [fn, setFn] = useState<'sin' | 'cos'>('sin')
  const [ai, setAi] = useState(5)
  const [bi, setBi] = useState(1)
  const [c, setC] = useState(0)
  const [d, setD] = useState(0)
  const w: Wave = { fn, a: VALUES_A[ai], b: VALUES_B[bi], c, d }
  const info = waveInfo(w)
  const zeros = waveLevel(w, 0, 0, 720)
  const W = 340
  const H = 200
  const ext = Math.max(Math.abs(info.max), Math.abs(info.min), 1.5) + 0.4
  const X0 = -180
  const X1 = 540
  const X = (x: number): number => 14 + ((x - X0) / (X1 - X0)) * (W - 28)
  const Y = (y: number): number => H / 2 - (y / ext) * (H / 2 - 10)
  const path = (f: (x: number) => number, step = 2): string => {
    let s = ''
    for (let x = X0; x <= X1; x += step) s += `${x === X0 ? 'M' : 'L'}${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`
    return s
  }
  const fnTex = fn === 'sin' ? '\\sin' : '\\cos'
  const num = (v: number): string => short(v, '.', 2)
  const inner = c === 0 ? `${w.b === 1 ? '' : num(w.b)}x` : `${w.b === 1 ? '' : num(w.b)}\\left(x${c > 0 ? `-${c}^\\circ` : `+${-c}^\\circ`}\\right)`
  const formula = `y=${w.a === 1 ? '' : w.a === -1 ? '-' : num(w.a)}${fnTex}\\left(${inner}\\right)${d === 0 ? '' : d > 0 ? `+${num(d)}` : `-${num(-d)}`}`
  const label = `${tc(L('Graph of a', 'Grafik gelombang'))} ${fn}: ${tc(L('amplitude', 'amplitudo'))} ${num(info.amplitude)}, ${tc(L('period', 'periode'))} ${num(info.period)}°, ${tc(L('phase shift', 'pergeseran fase'))} ${num(c)}°, ${tc(L('midline', 'garis tengah'))} ${num(d)}, ${tc(L('maximum', 'maksimum'))} ${num(info.max)}, ${tc(L('minimum', 'minimum'))} ${num(info.min)}`
  return (
    <Frame name="trigwave">
      <div className="chips">
        {(['sin', 'cos'] as const).map((q) => (
          <button key={q} className={`chip ${fn === q ? 'on' : ''}`} onClick={() => setFn(q)} aria-pressed={fn === q}>
            <Tex src={`y=\\${q}\\,x`} />
          </button>
        ))}
      </div>
      <label className="lbl slider">
        a = <b>{short(w.a, sep, 1)}</b> ({tc(L('stretch and flip', 'regang dan balik'))})
        <input type="range" min={0} max={VALUES_A.length - 1} step={1} value={ai} aria-label="a" aria-valuetext={String(w.a)} onChange={(e) => setAi(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        b = <b>{short(w.b, sep, 1)}</b> ({tc(L('squeeze', 'rapatkan'))})
        <input type="range" min={0} max={VALUES_B.length - 1} step={1} value={bi} aria-label="b" aria-valuetext={String(w.b)} onChange={(e) => setBi(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        c = <b>{c}°</b> ({tc(L('shift right', 'geser ke kanan'))})
        <input type="range" min={-180} max={180} step={15} value={c} aria-label="c" onChange={(e) => setC(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        d = <b>{short(d, sep, 1)}</b> ({tc(L('shift up', 'geser ke atas'))})
        <input type="range" min={-3} max={3} step={0.5} value={d} aria-label="d" onChange={(e) => setD(Number(e.target.value))} />
      </label>
      <Tex src={formula} display />
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 480, display: 'block', margin: '6px auto' }}>
        <line x1={14} y1={Y(0)} x2={W - 14} y2={Y(0)} stroke="var(--muted)" strokeWidth={1} />
        <line x1={X(0)} y1={8} x2={X(0)} y2={H - 8} stroke="var(--muted)" strokeWidth={1} />
        {[-180, 0, 180, 360, 540].map((v) => (
          <text key={v} x={X(v)} y={H - 2} fontSize={9} textAnchor="middle" fill="var(--muted)">
            {v}°
          </text>
        ))}
        <path d={path((x) => (fn === 'sin' ? sinDeg(x) : cosDeg(x)))} fill="none" stroke="var(--muted)" strokeWidth={1.4} strokeDasharray="4 4" />
        <line x1={14} y1={Y(info.midline)} x2={W - 14} y2={Y(info.midline)} stroke="var(--gold)" strokeWidth={1.2} strokeDasharray="3 3" />
        <path d={path((x) => waveAt(w, x))} fill="none" stroke="var(--brand)" strokeWidth={2.6} />
        {zeros.map((z) => (
          <circle key={z} cx={X(z)} cy={Y(0)} r={3.2} fill="var(--bad)" />
        ))}
      </svg>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <tbody>
            <tr>
              <td>{tc(L('amplitude', 'amplitudo'))} |a|</td>
              <td>{short(info.amplitude, sep, 2)}</td>
              <td>{tc(L('period', 'periode'))} 360° / b</td>
              <td>{short(info.period, sep, 2)}°</td>
            </tr>
            <tr>
              <td>{tc(L('phase shift', 'pergeseran fase'))} c</td>
              <td>{c}°</td>
              <td>{tc(L('midline', 'garis tengah'))} y = d</td>
              <td>{short(d, sep, 2)}</td>
            </tr>
            <tr>
              <td>{tc(L('maximum', 'maksimum'))}</td>
              <td>{short(info.max, sep, 2)}</td>
              <td>{tc(L('minimum', 'minimum'))}</td>
              <td>{short(info.min, sep, 2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="small">
        {tc(L('Red dots: where the wave crosses y = 0 between 0° and 720°', 'Titik merah: tempat gelombang memotong y = 0 antara 0° dan 720°'))}: {zeros.length ? zeros.slice(0, 12).map((z) => `${short(z, sep, 2)}°`).join(', ') + (zeros.length > 12 ? ' …' : '') : tc(L('none (the wave never reaches 0)', 'tidak ada (gelombang tidak pernah mencapai 0)'))}. {tc(L('The grey dashed curve is the plain graph for comparison.', 'Kurva abu-abu putus-putus adalah grafik dasar sebagai pembanding.'))}
      </p>
    </Frame>
  )
}

/* ------------------------------------------------------------------------------- identities */

export function TrigIdentity() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('pythagorean')
  const [x, setX] = useState(37)
  const [y, setY] = useState(25)
  const it = IDENTITIES.find((q) => q.id === id) as Identity
  const [lhs, rhs] = it.eval(x, y)
  const here = agrees(it, x, y)
  const all = useMemo(() => agreeingAngles(it, y), [it, y])
  const firstFail = useMemo(() => {
    for (let a = 1; a < 360; a++) if (!agrees(it, a, y)) return a
    return null
  }, [it, y])
  const show = (v: number): string => (Number.isNaN(v) ? tc(L('undefined', 'tak terdefinisi')) : fmt(v, sep, 8))
  return (
    <Frame name="trigidentity">
      <div className="chips">
        {IDENTITIES.map((q) => (
          <button key={q.id} className={`chip ${id === q.id ? 'on' : ''}`} onClick={() => setId(q.id)} aria-pressed={id === q.id}>
            <Tex src={`${q.lhs}=${q.rhs}`} />
          </button>
        ))}
      </div>
      <label className="lbl slider">
        x = <b>{x}°</b>
        <input type="range" min={0} max={359} step={1} value={x} aria-label="x" onChange={(e) => setX(Number(e.target.value))} />
      </label>
      {it.uses === 'xy' && (
        <label className="lbl slider">
          y = <b>{y}°</b>
          <input type="range" min={0} max={359} step={1} value={y} aria-label="y" onChange={(e) => setY(Number(e.target.value))} />
        </label>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <tbody>
            <tr>
              <td>
                <Tex src={it.lhs} />
              </td>
              <td>{show(lhs)}</td>
            </tr>
            <tr>
              <td>
                <Tex src={it.rhs} />
              </td>
              <td>{show(rhs)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className={here ? 'okline' : 'badline'}>{here ? tc(L(`At x = ${x}° the two sides are equal.`, `Pada x = ${x}° kedua ruas sama.`)) : tc(L(`At x = ${x}° the two sides are different.`, `Pada x = ${x}° kedua ruas berbeda.`))}</p>
        <p className="small">
          {tc(L(`Over the 360 whole degrees 0° to 359° the sides are equal at ${all.length} of them`, `Pada 360 derajat bulat 0° sampai 359° kedua ruas sama pada ${all.length} di antaranya`))}
          {it.holds ? '. ' : `: ${all.slice(0, 6).map((a) => `${a}°`).join(', ')}${all.length > 6 ? ' …' : ''}. `}
          {it.holds
            ? tc(L('It is an identity: it holds for every angle where both sides are defined (SymPy confirms it symbolically).', 'Ini identitas: berlaku untuk setiap sudut yang kedua ruasnya terdefinisi (SymPy mengonfirmasinya secara simbolik).'))
            : tc(L(`It is NOT an identity. A counterexample: x = ${firstFail}°. It is true only at a few angles, which is why one lucky test proves nothing.`, `Ini BUKAN identitas. Contoh penyangkal: x = ${firstFail}°. Ia benar hanya pada beberapa sudut, itulah sebabnya satu uji yang kebetulan cocok tidak membuktikan apa-apa.`))}
        </p>
      </div>
    </Frame>
  )
}
