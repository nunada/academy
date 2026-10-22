import { useState } from 'react'
import { useI18n } from '../../i18n'
import {
  PAIRS,
  PAIR_RELATION,
  UNITS,
  angleBetween,
  angleBetweenAcos,
  bearingFromMath,
  clockBetween,
  clockHands,
  clockTimes,
  classify,
  compassName,
  complement,
  diagonals,
  directedAngle,
  dms,
  explement,
  fromDegrees,
  inscribedAt,
  inscribedFormula,
  interiorSum,
  mathFromBearing,
  normalize,
  piFraction,
  regularExterior,
  regularInterior,
  regularPolygon,
  sectorOf,
  sidesFromInterior,
  supplement,
  tilesPlane,
  timeOfDay,
  toDegrees,
  transversalAngles,
  type AngleKind,
  type PairKind,
  type Unit,
  type Vec,
} from '../../lib/angles'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/** A number with up to `digits` significant digits and no trailing zeros, with the reader's decimal mark. */
function num(x: number, sep: string, digits = 8): string {
  if (!Number.isFinite(x)) return '–'
  if (x === 0) return '0'
  const s = Number(x.toPrecision(digits)).toString()
  return s.replace('.', sep)
}

const rad = (deg: number): number => (deg * Math.PI) / 180
const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))]
const f1 = (x: number): string => (Math.round(x * 10) / 10).toString()

/** A filled wedge from math angle a0 to a1 (counterclockwise) around (cx, cy). */
function wedge(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const sweep = a1 - a0
  const [x0, y0] = polar(cx, cy, r, a0)
  const [x1, y1] = polar(cx, cy, r, a1)
  return `M${f1(cx)},${f1(cy)}L${f1(x0)},${f1(y0)}A${r},${r} 0 ${Math.abs(sweep) > 180 ? 1 : 0} ${sweep > 0 ? 0 : 1} ${f1(x1)},${f1(y1)}Z`
}

const KIND_NAME: Record<AngleKind, { en: string; id: string }> = {
  zero: L('zero angle', 'sudut nol'),
  acute: L('acute angle (less than 90°)', 'sudut lancip (kurang dari 90°)'),
  right: L('right angle (90°)', 'sudut siku-siku (90°)'),
  obtuse: L('obtuse angle (between 90° and 180°)', 'sudut tumpul (antara 90° dan 180°)'),
  straight: L('straight angle (180°)', 'sudut lurus (180°)'),
  reflex: L('reflex angle (between 180° and 360°)', 'sudut refleks (antara 180° dan 360°)'),
  full: L('full angle (360°)', 'sudut penuh (360°)'),
  beyond: L('more than a full turn, or negative', 'lebih dari satu putaran penuh, atau negatif'),
}

/* ------------------------------------------------------------------------------------- units */

const UNIT_LABEL: Record<Unit, { en: string; id: string }> = {
  deg: L('degrees', 'derajat'),
  rad: L('radians', 'radian'),
  grad: L('gradians', 'gradian'),
  turn: L('turns', 'putaran'),
}
const PRESETS = [30, 45, 60, 90, 120, 180, 270, 360]

export function AngleConvert() {
  const { tc } = useI18n()
  const sep = useSep()
  const [text, setText] = useState('60')
  const [unit, setUnit] = useState<Unit>('deg')
  const value = Number(text.replace(',', '.'))
  const valid = text.trim() !== '' && Number.isFinite(value)
  const deg = valid ? toDegrees(value, unit) : 0
  const all = fromDegrees(deg)
  const pf = piFraction(Math.round(deg * 1e9) / 1e9)
  const d = dms(deg, 2)
  const shown = normalize(deg)
  const cx = 90
  const cy = 90
  const [ex, ey] = polar(cx, cy, 70, shown)
  return (
    <Frame name="angleconvert">
      <div className="inrow">
        <label className="lbl">
          {tc(L('angle', 'sudut'))} = <input style={{ width: '7em' }} value={text} aria-label={tc(L('angle', 'sudut'))} onChange={(e) => setText(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {UNITS.map((u) => (
          <button key={u} className={`chip ${unit === u ? 'on' : ''}`} onClick={() => setUnit(u)} aria-pressed={unit === u}>
            {tc(UNIT_LABEL[u])}
          </button>
        ))}
      </div>
      <div className="chips">
        {PRESETS.map((p) => (
          <button key={p} className="chip ghost" onClick={() => { setUnit('deg'); setText(String(p)) }}>
            {p}°
          </button>
        ))}
      </div>
      {valid ? (
        <>
          <svg viewBox="0 0 180 180" role="img" aria-label={tc(L('The angle drawn from the positive horizontal axis, counterclockwise', 'Sudut digambar dari sumbu mendatar positif, berlawanan arah jarum jam'))} style={{ width: '100%', maxWidth: 200, display: 'block', margin: '6px auto' }}>
            <circle cx={cx} cy={cy} r={70} fill="none" stroke="var(--border)" strokeWidth={1.5} />
            {shown > 0 && <path d={wedge(cx, cy, 36, 0, shown)} fill="color-mix(in srgb, var(--gold) 45%, transparent)" stroke="var(--gold)" strokeWidth={1.5} />}
            <line x1={cx} y1={cy} x2={cx + 70} y2={cy} stroke="var(--text)" strokeWidth={2} />
            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="var(--bad)" strokeWidth={2.5} />
            <circle cx={cx} cy={cy} r={3} fill="var(--text)" />
          </svg>
          <div style={{ overflowX: 'auto' }}>
            <table className="rtable">
              <tbody>
                <tr>
                  <td>{tc(UNIT_LABEL.deg)}</td>
                  <td>{num(all.deg, sep)}°</td>
                </tr>
                <tr>
                  <td>{tc(UNIT_LABEL.rad)}</td>
                  <td>
                    {num(all.rad, sep)}
                    {pf && pf.num !== 0 ? (
                      <>
                        {' = '}
                        <Tex src={pf.den === 1 ? (pf.num === 1 ? '\\pi' : `${pf.num}\\pi`) : `\\frac{${pf.num === 1 ? '' : pf.num}\\pi}{${pf.den}}`} />
                      </>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td>{tc(UNIT_LABEL.grad)}</td>
                  <td>{num(all.grad, sep)}</td>
                </tr>
                <tr>
                  <td>{tc(UNIT_LABEL.turn)}</td>
                  <td>{num(all.turn, sep)}</td>
                </tr>
                <tr>
                  <td>{tc(L('degrees, minutes, seconds', 'derajat, menit, detik'))}</td>
                  <td>
                    {d.sign < 0 ? '−' : ''}
                    {d.d}° {d.m}′ {num(d.s, sep, 6)}″
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="wgtout" aria-live="polite">
            <p className="okline">{tc(KIND_NAME[classify(deg)])}</p>
            {deg >= 0 && deg <= 360 && (
              <p className="small">
                {tc(L('Complement', 'Penyiku'))}: {deg <= 90 ? `${num(complement(deg), sep)}°` : tc(L('none (more than 90°)', 'tidak ada (lebih dari 90°)'))} · {tc(L('supplement', 'pelurus'))}: {deg <= 180 ? `${num(supplement(deg), sep)}°` : tc(L('none (more than 180°)', 'tidak ada (lebih dari 180°)'))} · {tc(L('explement', 'pelengkap penuh'))}: {num(explement(deg), sep)}°
              </p>
            )}
            {(deg < 0 || deg > 360) && (
              <p className="small">
                {tc(L('The same direction as', 'Arah yang sama dengan'))} {num(shown, sep)}°.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="noline">{tc(L('Type a number.', 'Ketik sebuah bilangan.'))}</p>
      )}
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------- transversal */

const PAIR_NAME: Record<PairKind, { en: string; id: string }> = {
  corresponding: L('corresponding', 'sehadap'),
  alternateInterior: L('alternate interior', 'dalam berseberangan'),
  alternateExterior: L('alternate exterior', 'luar berseberangan'),
  coInterior: L('co-interior (same side)', 'dalam sepihak'),
  coExterior: L('co-exterior (same side)', 'luar sepihak'),
  vertical: L('vertical', 'bertolak belakang'),
  linearPair: L('linear pair', 'berpelurus'),
}
const PAIR_COLORS = ['var(--bad)', 'var(--leaf)', 'var(--gold)', 'var(--coral)']

export function AngleTransversal() {
  const { tc } = useI18n()
  const sep = useSep()
  const [alpha, setAlpha] = useState(65)
  const [kind, setKind] = useState<PairKind>('corresponding')
  const a = transversalAngles(alpha)
  const cot = Math.cos(rad(alpha)) / Math.sin(rad(alpha))
  const P1: [number, number] = [180 + 45 * cot, 85]
  const P2: [number, number] = [180 - 45 * cot, 175]
  const origin = (k: number): [number, number] => (k <= 4 ? P1 : P2)
  // the angular range of each of the four angles at an intersection, as math angles
  const range = (k: number): [number, number] => {
    const i = ((k - 1) % 4) + 1
    return i === 1 ? [alpha, 180] : i === 2 ? [0, alpha] : i === 3 ? [180, 180 + alpha] : [180 + alpha, 360]
  }
  const pairs = PAIRS[kind]
  const colorOf = (k: number): string | null => {
    const idx = pairs.findIndex(([x, y]) => x === k || y === k)
    return idx < 0 ? null : PAIR_COLORS[idx % PAIR_COLORS.length]
  }
  const dx = Math.cos(rad(alpha))
  const dy = -Math.sin(rad(alpha))
  return (
    <Frame name="angletransversal">
      <label className="lbl slider">
        α = <b>{alpha}°</b>
        <input type="range" min={25} max={155} value={alpha} aria-label="α" onChange={(e) => setAlpha(Number(e.target.value))} />
      </label>
      <div className="chips">
        {(Object.keys(PAIRS) as PairKind[]).map((k) => (
          <button key={k} className={`chip ${kind === k ? 'on' : ''}`} onClick={() => setKind(k)} aria-pressed={kind === k}>
            {tc(PAIR_NAME[k])}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 360 260" role="img" aria-label={tc(L('Two parallel lines cut by a transversal, with the eight angles numbered', 'Dua garis sejajar dipotong sebuah garis lintang, dengan delapan sudut bernomor'))} style={{ width: '100%', maxWidth: 480, display: 'block', margin: '6px auto' }}>
        <line x1={0} y1={P1[1]} x2={360} y2={P1[1]} stroke="var(--text)" strokeWidth={2} />
        <line x1={0} y1={P2[1]} x2={360} y2={P2[1]} stroke="var(--text)" strokeWidth={2} />
        <line x1={P1[0] - dx * 110} y1={P1[1] - dy * 110} x2={P2[0] + dx * 110} y2={P2[1] + dy * 110} stroke="var(--brand)" strokeWidth={2.5} />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => {
          const [o0, o1] = origin(k)
          const [r0, r1] = range(k)
          const c = colorOf(k)
          const mid = (r0 + r1) / 2
          const [lx, ly] = polar(o0, o1, 38, mid)
          return (
            <g key={k}>
              {c && <path d={wedge(o0, o1, 28, r0, r1)} fill={`color-mix(in srgb, ${c} 40%, transparent)`} stroke={c} strokeWidth={1.5} />}
              <text x={lx} y={ly + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--text)">
                {k}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="okline">
          {tc(PAIR_NAME[kind])}: {tc(PAIR_RELATION[kind] === 'equal' ? L('the angles of each pair are equal', 'sudut-sudut setiap pasangan sama besar') : L('the angles of each pair add up to 180°', 'sudut-sudut setiap pasangan berjumlah 180°'))}
        </p>
        <p className="small">
          {pairs.map(([x, y]) => `∠${x} = ${num(a[x], sep)}° , ∠${y} = ${num(a[y], sep)}°`).join(' · ')}
        </p>
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------------------------- polygons */

export function AnglePolygon() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [n, setN] = useState(5)
  const [interior, setInterior] = useState('135')
  const P = regularPolygon(n, 78)
  const cx = 100
  const cy = 100
  const pts = P.map(([x, y]) => [cx + x, cy - y] as [number, number])
  const arcR = Math.max(9, 24 - n * 0.6)
  const arcAt = (k: number): string => {
    const p = pts[k]
    const q0 = pts[(k + n - 1) % n]
    const q1 = pts[(k + 1) % n]
    const norm = (q: [number, number]): [number, number] => {
      const l = Math.hypot(q[0] - p[0], q[1] - p[1])
      return [(q[0] - p[0]) / l, (q[1] - p[1]) / l]
    }
    const u = norm(q0)
    const v = norm(q1)
    const cross = u[0] * v[1] - u[1] * v[0]
    return `M${f1(p[0] + u[0] * arcR)},${f1(p[1] + u[1] * arcR)}A${arcR},${arcR} 0 0 ${cross > 0 ? 1 : 0} ${f1(p[0] + v[0] * arcR)},${f1(p[1] + v[1] * arcR)}`
  }
  const target = Number(interior.replace(',', '.'))
  const sides = Number.isFinite(target) ? sidesFromInterior(target) : null
  return (
    <Frame name="anglepolygon">
      <label className="lbl slider">
        n = <b>{n}</b> {tc(L('sides', 'sisi'))}
        <input type="range" min={3} max={20} value={n} aria-label="n" onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <svg viewBox="0 0 200 200" role="img" aria-label={tc(L('A regular polygon with its interior angles marked', 'Segi banyak beraturan dengan sudut dalamnya ditandai'))} style={{ width: '100%', maxWidth: 260, display: 'block', margin: '6px auto' }}>
        <polygon points={pts.map((q) => `${f1(q[0])},${f1(q[1])}`).join(' ')} fill="color-mix(in srgb, var(--brand) 14%, transparent)" stroke="var(--brand)" strokeWidth={2} />
        {pts.map((_, k) => (
          <path key={k} d={arcAt(k)} fill="none" stroke="var(--bad)" strokeWidth={2} />
        ))}
      </svg>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <tbody>
            <tr>
              <td>{tc(L('sum of the interior angles', 'jumlah sudut dalam'))} (n − 2) · 180°</td>
              <td>{interiorSum(n)}°</td>
            </tr>
            <tr>
              <td>{tc(L('each interior angle', 'tiap sudut dalam'))} (n − 2) · 180° / n</td>
              <td>{num(regularInterior(n), sep)}°</td>
            </tr>
            <tr>
              <td>{tc(L('each exterior angle', 'tiap sudut luar'))} 360° / n</td>
              <td>{num(regularExterior(n), sep)}°</td>
            </tr>
            <tr>
              <td>{tc(L('diagonals', 'diagonal'))} n(n − 3) / 2</td>
              <td>{diagonals(n)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className={tilesPlane(n) ? 'okline' : 'small'}>
          {tilesPlane(n)
            ? tc(L(`${num(regularInterior(n), sep)}° divides 360°, so copies of this polygon fit around a point: they tile the plane.`, `${num(regularInterior(n), sep)}° membagi 360°, sehingga salinan segi banyak ini muat mengelilingi satu titik: ia mengubin bidang.`))
            : tc(L(`${num(regularInterior(n), sep)}° does not divide 360°, so copies of this polygon leave a gap or overlap around a point.`, `${num(regularInterior(n), sep)}° tidak membagi 360°, sehingga salinan segi banyak ini menyisakan celah atau tumpang tindih di sekitar satu titik.`))}
        </p>
      </div>
      <div className="inrow">
        <label className="lbl">
          {tc(L('which regular polygon has the interior angle', 'segi banyak beraturan mana yang sudut dalamnya'))} <input style={{ width: '5em' }} value={interior} aria-label={tc(L('interior angle', 'sudut dalam'))} onChange={(e) => setInterior(e.target.value)} />°
        </label>
      </div>
      <p className={sides ? 'okline' : 'noline'} aria-live="polite">
        {sides ? tc(L(`n = 360 / (180 − ${interior}) = ${sides} sides.`, `n = 360 / (180 − ${interior}) = ${sides} sisi.`)) : tc(L('No regular polygon has that angle (360 / (180 − angle) must be a whole number of at least 3).', 'Tidak ada segi banyak beraturan dengan sudut itu (360 / (180 − sudut) harus bilangan bulat sedikitnya 3).'))}
      </p>
      <p className="small muted">{lang === 'id' ? 'Sudut luar adalah belokan di setiap titik sudut; seluruh belokan mengelilingi bangun adalah 360°.' : 'The exterior angle is the turn at each vertex; the turns all the way around add up to 360°.'}</p>
    </Frame>
  )
}

/* --------------------------------------------------------------------------------------- clock */

const pad = (x: number): string => String(x).padStart(2, '0')

function timeText(numSec: number, den: number): string {
  const t = timeOfDay(numSec, den)
  const whole = Math.floor(t.sNum / t.sDen)
  const rest = t.sNum - whole * t.sDen
  return `${t.h}:${pad(t.m)}:${pad(whole)}${rest === 0 ? '' : ` ${rest}/${t.sDen}`}`
}

export function AngleClock() {
  const { tc } = useI18n()
  const sep = useSep()
  const [h, setH] = useState(3)
  const [m, setM] = useState(0)
  const [s, setS] = useState(0)
  const [theta, setTheta] = useState(90)
  const hands = clockHands(h, m, s)
  const between = clockBetween(h, m, s)
  const cx = 100
  const cy = 100
  const at = (deg: number, r: number): [number, number] => polar(cx, cy, r, 90 - deg)
  const [hx, hy] = at(hands.hour, 50)
  const [mx, my] = at(hands.minute, 74)
  const [sx, sy] = at(s * 6, 80)
  // the wedge between the hands, the smaller way round: clockwise from the hour hand to the minute hand if that is at most half a turn
  const ahead = (((hands.minute - hands.hour) % 360) + 360) % 360
  const wedgeStart = ahead <= 180 ? 90 - hands.minute : 90 - hands.hour
  const times = clockTimes(theta)
  return (
    <Frame name="angleclock">
      <label className="lbl slider">
        {tc(L('hours', 'jam'))} <b>{h}</b>
        <input type="range" min={0} max={11} value={h} aria-label={tc(L('hours', 'jam'))} onChange={(e) => setH(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        {tc(L('minutes', 'menit'))} <b>{m}</b>
        <input type="range" min={0} max={59} value={m} aria-label={tc(L('minutes', 'menit'))} onChange={(e) => setM(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        {tc(L('seconds', 'detik'))} <b>{s}</b>
        <input type="range" min={0} max={59} value={s} aria-label={tc(L('seconds', 'detik'))} onChange={(e) => setS(Number(e.target.value))} />
      </label>
      <svg viewBox="0 0 200 200" role="img" aria-label={tc(L('A clock with the angle between the hands shaded', 'Jam dengan sudut di antara jarumnya diarsir'))} style={{ width: '100%', maxWidth: 260, display: 'block', margin: '6px auto' }}>
        <circle cx={cx} cy={cy} r={90} fill="var(--surface)" stroke="var(--text)" strokeWidth={2} />
        {Array.from({ length: 12 }, (_, i) => {
          const [x0, y0] = at(i * 30, 82)
          const [x1, y1] = at(i * 30, 90)
          const [tx, ty] = at(i * 30, 70)
          return (
            <g key={i}>
              <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--text)" strokeWidth={2} />
              <text x={tx} y={ty + 4} textAnchor="middle" fontSize={11} fill="var(--muted)">
                {i === 0 ? 12 : i}
              </text>
            </g>
          )
        })}
        {between > 0 && <path d={wedge(cx, cy, 30, wedgeStart, wedgeStart + between)} fill="color-mix(in srgb, var(--gold) 50%, transparent)" stroke="var(--gold)" strokeWidth={1.5} />}
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="var(--text)" strokeWidth={5} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={mx} y2={my} stroke="var(--brand)" strokeWidth={3.5} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={sx} y2={sy} stroke="var(--bad)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={4} fill="var(--text)" />
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="okline">
          {h === 0 ? 12 : h}:{pad(m)}:{pad(s)}: {tc(L('the angle between the hands is', 'sudut di antara kedua jarum adalah'))} <b>{num(between, sep)}°</b>
        </p>
        <p className="small">
          {tc(L('hour hand', 'jarum jam'))} {num(hands.hour, sep)}° · {tc(L('minute hand', 'jarum menit'))} {num(hands.minute, sep)}° ({tc(L('clockwise from 12', 'searah jarum jam dari 12'))}). {tc(L('The hour hand turns 0.5° a minute, the minute hand 6°.', 'Jarum jam berputar 0,5° per menit, jarum menit 6°.'))}
        </p>
      </div>
      <div className="chips">
        {[0, 30, 60, 90, 120, 150, 180].map((q) => (
          <button key={q} className={`chip ghost ${theta === q ? 'on' : ''}`} onClick={() => setTheta(q)} aria-pressed={theta === q}>
            {q}°
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="small">
          {tc(L(`In twelve hours the hands make ${theta}° ${times.length} times:`, `Dalam dua belas jam kedua jarum membentuk ${theta}° sebanyak ${times.length} kali:`))}
        </p>
        <p className="small" style={{ fontFamily: 'var(--mono)', lineHeight: 1.8 }}>
          {times.map((f, i) => (
            <button
              key={i}
              className="chip ghost"
              style={{ margin: 2, fontFamily: 'var(--mono)' }}
              onClick={() => {
                const t = timeOfDay(f.num, f.den)
                setH(t.h % 12)
                setM(t.m)
                setS(Math.min(59, Math.floor(t.sNum / t.sDen)))
              }}
            >
              {timeText(f.num, f.den)}
            </button>
          ))}
        </p>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------------------------- circle */

export function AngleCircle() {
  const { tc } = useI18n()
  const sep = useSep()
  const [central, setCentral] = useState(80)
  const [point, setPoint] = useState(220)
  const [rs, setRs] = useState('5')
  const r = Number(rs.replace(',', '.'))
  const cx = 110
  const cy = 110
  const R = 90
  const O: [number, number] = [cx, cy]
  const A = polar(cx, cy, R, 0)
  const B = polar(cx, cy, R, central)
  const P = polar(cx, cy, R, point)
  const degenerate = Math.min(Math.abs(point - central), Math.abs(point), Math.abs(point - 360)) < 1
  const measured = degenerate ? NaN : inscribedAt(central, point)
  const formula = degenerate ? NaN : inscribedFormula(central, point)
  const th = rad(central)
  const sec = Number.isFinite(r) && r > 0 ? sectorOf(r, th) : null
  return (
    <Frame name="anglecircle">
      <label className="lbl slider">
        {tc(L('central angle AOB', 'sudut pusat AOB'))} <b>{central}°</b>
        <input type="range" min={10} max={350} value={central} aria-label={tc(L('central angle', 'sudut pusat'))} onChange={(e) => setCentral(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        {tc(L('position of P', 'posisi P'))} <b>{point}°</b>
        <input type="range" min={1} max={359} value={point} aria-label={tc(L('position of P', 'posisi P'))} onChange={(e) => setPoint(Number(e.target.value))} />
      </label>
      <svg viewBox="0 0 220 220" role="img" aria-label={tc(L('A circle with a central angle and an angle at a point P of the circle', 'Lingkaran dengan sudut pusat dan sudut di titik P pada lingkaran'))} style={{ width: '100%', maxWidth: 300, display: 'block', margin: '6px auto' }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth={1.5} />
        <path d={wedge(cx, cy, 30, 0, central)} fill="color-mix(in srgb, var(--gold) 45%, transparent)" stroke="var(--gold)" strokeWidth={1.5} />
        <line x1={O[0]} y1={O[1]} x2={A[0]} y2={A[1]} stroke="var(--text)" strokeWidth={1.5} />
        <line x1={O[0]} y1={O[1]} x2={B[0]} y2={B[1]} stroke="var(--text)" strokeWidth={1.5} />
        <line x1={P[0]} y1={P[1]} x2={A[0]} y2={A[1]} stroke="var(--bad)" strokeWidth={2} />
        <line x1={P[0]} y1={P[1]} x2={B[0]} y2={B[1]} stroke="var(--bad)" strokeWidth={2} />
        {[
          ['O', O[0] - 10, O[1] + 14],
          ['A', A[0] + 6, A[1] + 4],
          ['B', B[0] + (B[0] > cx ? 6 : -14), B[1] + (B[1] > cy ? 14 : -6)],
          ['P', P[0] + (P[0] > cx ? 6 : -14), P[1] + (P[1] > cy ? 14 : -6)],
        ].map(([t, x, y]) => (
          <text key={String(t)} x={Number(x)} y={Number(y)} fontSize={12} fontWeight={700} fill="var(--text)">
            {t}
          </text>
        ))}
        {[O, A, B, P].map((q, i) => (
          <circle key={i} cx={q[0]} cy={q[1]} r={3} fill="var(--brand)" />
        ))}
      </svg>
      <div className="wgtout" aria-live="polite">
        {degenerate ? (
          <p className="noline">{tc(L('Move P away from A and B.', 'Geser P menjauh dari A dan B.'))}</p>
        ) : (
          <p className="okline">
            {tc(L('Angle APB measured from the coordinates', 'Sudut APB diukur dari koordinat'))}: <b>{num(measured, sep, 6)}°</b> · {tc(L('half the central angle, or 180° minus it', 'setengah sudut pusat, atau 180° dikurangi itu'))}: {num(formula, sep, 6)}° {Math.abs(measured - formula) < 1e-6 ? '✓' : '✗'}
          </p>
        )}
      </div>
      <div className="inrow">
        <label className="lbl">
          r = <input style={{ width: '4em' }} value={rs} aria-label="r" onChange={(e) => setRs(e.target.value)} />
        </label>
      </div>
      {sec ? (
        <div className="wgtout" aria-live="polite">
          <p className="small">
            {tc(L('The central angle in radians', 'Sudut pusat dalam radian'))}: <b>{num(th, sep)}</b> {tc(L('(the arc divided by the radius)', '(busur dibagi jari-jari)'))} · {tc(L('arc', 'busur'))} = rθ = {num(sec.arc, sep)} · {tc(L('sector area', 'luas juring'))} = ½r²θ = {num(sec.area, sep)} · {tc(L('chord AB', 'tali busur AB'))} = 2r sin(θ/2) = {num(sec.chord, sep)}
          </p>
        </div>
      ) : (
        <p className="noline">{tc(L('Type a positive radius.', 'Ketik jari-jari positif.'))}</p>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------------------------------- vectors */

const VEC_PRESETS: { label: { en: string; id: string }; v: [string, string, string, string] }[] = [
  { label: L('perpendicular', 'tegak lurus'), v: ['1', '0', '0', '2'] },
  { label: L('45°', '45°'), v: ['3', '0', '2', '2'] },
  { label: L('obtuse', 'tumpul'), v: ['2', '1', '-3', '1'] },
  { label: L('a tiny angle (1e-8 rad)', 'sudut sangat kecil (1e-8 rad)'), v: ['1', '0', '1', '1e-8'] },
  { label: L('almost straight', 'hampir lurus'), v: ['1', '0', '-1', '1e-8'] },
]

export function AngleVectors() {
  const { tc } = useI18n()
  const sep = useSep()
  const [mode, setMode] = useState<'vectors' | 'direction'>('vectors')
  const [vs, setVs] = useState<[string, string, string, string]>(['3', '0', '2', '2'])
  const [deg, setDeg] = useState(30)
  const [bearing, setBearing] = useState('45')
  const nums = vs.map((x) => Number(x.replace(',', '.')))
  const valid = nums.every(Number.isFinite) && (nums[0] !== 0 || nums[1] !== 0) && (nums[2] !== 0 || nums[3] !== 0)
  const a: Vec = [nums[0], nums[1]]
  const b: Vec = [nums[2], nums[3]]
  const at = valid ? (angleBetween(a, b) * 180) / Math.PI : NaN
  const ac = valid ? (angleBetweenAcos(a, b) * 180) / Math.PI : NaN
  const dir = valid ? (directedAngle(a, b) * 180) / Math.PI : NaN
  const b0 = Number(bearing.replace(',', '.'))
  return (
    <Frame name="anglevector">
      <div className="chips">
        <button className={`chip ${mode === 'vectors' ? 'on' : ''}`} onClick={() => setMode('vectors')} aria-pressed={mode === 'vectors'}>
          {tc(L('angle between two vectors', 'sudut antara dua vektor'))}
        </button>
        <button className={`chip ${mode === 'direction' ? 'on' : ''}`} onClick={() => setMode('direction')} aria-pressed={mode === 'direction'}>
          {tc(L('direction and compass bearing', 'arah dan bearing kompas'))}
        </button>
      </div>
      {mode === 'vectors' ? (
        <>
          <div className="inrow">
            {['x₁', 'y₁', 'x₂', 'y₂'].map((nm, i) => (
              <label key={nm} className="lbl">
                {nm} = <input style={{ width: '5em' }} value={vs[i]} aria-label={nm} onChange={(e) => setVs(vs.map((v, j) => (j === i ? e.target.value : v)) as [string, string, string, string])} />
              </label>
            ))}
          </div>
          <div className="chips">
            {VEC_PRESETS.map((p, i) => (
              <button key={i} className="chip ghost" onClick={() => setVs(p.v)}>
                {tc(p.label)}
              </button>
            ))}
          </div>
          {valid ? (
            <div className="wgtout" aria-live="polite">
              <p className="okline" style={{ overflowWrap: 'anywhere' }}>
                atan2(|a × b|, a · b) = <b>{(at).toPrecision(15).replace('.', sep)}°</b>
              </p>
              <p className={Math.abs(at - ac) > 1e-6 * Math.max(1, at) ? 'noline' : 'small'} style={{ overflowWrap: 'anywhere' }}>
                arccos(a · b / (|a||b|)) = {ac.toPrecision(15).replace('.', sep)}° {Math.abs(at - ac) > 1e-6 * Math.max(1, at) ? tc(L('← the arc cosine has lost the angle', '← arc kosinus kehilangan sudutnya')) : ''}
              </p>
              <p className="small">
                {tc(L('Directed angle from a to b', 'Sudut berarah dari a ke b'))}: {num(dir, sep, 12)}° · a · b = {num(a[0] * b[0] + a[1] * b[1], sep)} · a × b = {num(a[0] * b[1] - a[1] * b[0], sep)}
              </p>
            </div>
          ) : (
            <p className="noline">{tc(L('Type four numbers; neither vector may be zero.', 'Ketik empat bilangan; tidak boleh ada vektor nol.'))}</p>
          )}
        </>
      ) : (
        <>
          <label className="lbl slider">
            {tc(L('mathematical angle (counterclockwise from east)', 'sudut matematika (berlawanan arah jarum jam dari timur)'))} <b>{deg}°</b>
            <input type="range" min={0} max={359} value={deg} aria-label={tc(L('angle', 'sudut'))} onChange={(e) => setDeg(Number(e.target.value))} />
          </label>
          <div className="wgtout" aria-live="polite">
            <p className="okline">
              {tc(L('compass bearing (clockwise from north)', 'bearing kompas (searah jarum jam dari utara)'))}: <b>{num(bearingFromMath(deg), sep)}°</b> = {compassName(bearingFromMath(deg))}
            </p>
          </div>
          <div className="inrow">
            <label className="lbl">
              {tc(L('or a bearing', 'atau sebuah bearing'))} <input style={{ width: '5em' }} value={bearing} aria-label={tc(L('bearing', 'bearing'))} onChange={(e) => setBearing(e.target.value)} />°
            </label>
          </div>
          {Number.isFinite(b0) ? (
            <p className="small" aria-live="polite">
              {compassName(b0)} = {tc(L('mathematical angle', 'sudut matematika'))} {num(mathFromBearing(b0), sep)}°
            </p>
          ) : (
            <p className="noline">{tc(L('Type a number.', 'Ketik sebuah bilangan.'))}</p>
          )}
          <svg viewBox="0 0 200 200" role="img" aria-label={tc(L('A compass rose with the direction drawn', 'Mawar kompas dengan arah digambar'))} style={{ width: '100%', maxWidth: 220, display: 'block', margin: '6px auto' }}>
            <circle cx={100} cy={100} r={80} fill="none" stroke="var(--border)" strokeWidth={1.5} />
            {['N', 'E', 'S', 'W'].map((t, i) => {
              const [x, y] = polar(100, 100, 92, 90 - i * 90)
              return (
                <text key={t} x={x} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--text)">
                  {t}
                </text>
              )
            })}
            {(() => {
              const [x, y] = polar(100, 100, 70, deg)
              return <line x1={100} y1={100} x2={x} y2={y} stroke="var(--bad)" strokeWidth={3} strokeLinecap="round" />
            })()}
            <circle cx={100} cy={100} r={3} fill="var(--text)" />
          </svg>
        </>
      )}
    </Frame>
  )
}
