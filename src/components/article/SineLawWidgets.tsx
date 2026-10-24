import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { areaThreeWays, circumradius, place, ratios, solveAAS, solveSSA, ssaKind, ssaPoints, survey, surveyWorstError, type SsaKind } from '../../lib/sinelaw'
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

const RAD = Math.PI / 180
type P = [number, number]

/** The map from graph coordinates to the picture: one scale on both axes, the y-axis pointing up, with a margin. */
export function frame(minX: number, maxX: number, minY: number, maxY: number, W = 340, H = 250, pad = 22) {
  const sx = (W - 2 * pad) / (maxX - minX || 1)
  const sy = (H - 2 * pad) / (maxY - minY || 1)
  const s = Math.min(sx, sy)
  const ox = pad + (W - 2 * pad - s * (maxX - minX)) / 2
  const oy = pad + (H - 2 * pad - s * (maxY - minY)) / 2
  return { W, H, s, X: (x: number): number => ox + (x - minX) * s, Y: (y: number): number => H - oy - (y - minY) * s }
}

/** An angle arc at (cx, cy) in picture coordinates from direction a0 to a1 (degrees, counterclockwise on the page). */
export function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number): string => `${(cx + r * Math.cos(a * RAD)).toFixed(1)},${(cy - r * Math.sin(a * RAD)).toFixed(1)}`
  return `M${p(a0)}A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${p(a1)}`
}

/* ------------------------------------------------------------------ the ratio and the circle */

const RATIO_PRESETS: { name: Loc; A: number; B: number }[] = [
  { name: L('right isosceles', 'siku-siku sama kaki'), A: 45, B: 45 },
  { name: L('equilateral', 'sama sisi'), A: 60, B: 60 },
  { name: L('obtuse', 'tumpul'), A: 25, B: 30 },
  { name: L('flat', 'pipih'), A: 8, B: 160 },
]

export function SineLawRatio() {
  const { tc } = useI18n()
  const sep = useSep()
  const [A, setA] = useState(40)
  const [B, setB] = useState(65)
  const [a, setA2] = useState(12)
  const t = solveAAS(A, B, a)
  const label = t
    ? `${tc(L('A triangle with angles', 'Segitiga dengan sudut'))} ${A}°, ${B}° ${tc(L('and', 'dan'))} ${short(t.C, sep, 2)}°, ${tc(L('sides', 'sisi'))} ${short(t.a, sep, 2)}, ${short(t.b, sep, 2)}, ${short(t.c, sep, 2)}. ${tc(L('Each side divided by the sine of its opposite angle is', 'Tiap sisi dibagi sinus sudut di depannya sama dengan'))} ${short(ratios(t)[0], sep, 3)}, ${tc(L('the diameter of the circle through the vertices', 'diameter lingkaran yang melalui titik-titik sudut'))}.`
    : tc(L('No triangle: the two angles add up to 180° or more.', 'Tak ada segitiga: kedua sudut berjumlah 180° atau lebih.'))
  let svg: JSX.Element | null = null
  if (t) {
    const pl = place(t)
    const R = circumradius(t)
    const Ox = t.c / 2
    const Oy = (pl.C[0] ** 2 + pl.C[1] ** 2 - t.c * pl.C[0]) / (2 * pl.C[1])
    const Bp: P = [2 * Ox - pl.B[0], 2 * Oy - pl.B[1]] // the point opposite B on the circle
    const f = frame(Math.min(Ox - R, 0), Math.max(Ox + R, t.c), Oy - R, Oy + R)
    const pt = (q: P): string => `${f.X(q[0]).toFixed(1)},${f.Y(q[1]).toFixed(1)}`
    const mid = (p: P, q: P, off: number, ref: P): P => {
      const mx = (p[0] + q[0]) / 2
      const my = (p[1] + q[1]) / 2
      const dx = mx - ref[0]
      const dy = my - ref[1]
      const n = Math.hypot(dx, dy) || 1
      return [mx + (dx / n) * off, my + (dy / n) * off]
    }
    const centroid: P = [(pl.A[0] + pl.B[0] + pl.C[0]) / 3, (pl.A[1] + pl.B[1] + pl.C[1]) / 3]
    const off = 12 / f.s
    const vl = (q: P, text: string): JSX.Element => {
      const dx = q[0] - centroid[0]
      const dy = q[1] - centroid[1]
      const n = Math.hypot(dx, dy) || 1
      return (
        <text x={f.X(q[0] + (dx / n) * off)} y={f.Y(q[1] + (dy / n) * off) + 4} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--text)">
          {text}
        </text>
      )
    }
    const sl = (p: P, q: P, text: string): JSX.Element => {
      const m = mid(p, q, 11 / f.s, centroid)
      return (
        <text x={f.X(m[0])} y={f.Y(m[1]) + 4} fontSize={11} textAnchor="middle" fill="var(--muted)" fontStyle="italic">
          {text}
        </text>
      )
    }
    svg = (
      <svg viewBox={`0 0 ${f.W} ${f.H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 400, display: 'block', margin: '6px auto' }}>
        <circle cx={f.X(Ox)} cy={f.Y(Oy)} r={R * f.s} fill="none" stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="5 4" />
        <polygon points={`${pt(pl.A)} ${pt(pl.B)} ${pt(pl.C)}`} fill="var(--brand)" fillOpacity={0.14} stroke="var(--brand)" strokeWidth={2.2} strokeLinejoin="round" />
        <line x1={f.X(pl.B[0])} y1={f.Y(pl.B[1])} x2={f.X(Bp[0])} y2={f.Y(Bp[1])} stroke="var(--coral)" strokeWidth={1.4} strokeDasharray="4 3" />
        <line x1={f.X(pl.C[0])} y1={f.Y(pl.C[1])} x2={f.X(Bp[0])} y2={f.Y(Bp[1])} stroke="var(--coral)" strokeWidth={1.4} strokeDasharray="4 3" />
        <circle cx={f.X(Ox)} cy={f.Y(Oy)} r={2.5} fill="var(--coral)" />
        <circle cx={f.X(Bp[0])} cy={f.Y(Bp[1])} r={3} fill="var(--coral)" />
        <text x={f.X(Bp[0]) + 8} y={f.Y(Bp[1]) - 6} fontSize={11} fill="var(--coral)">
          B′
        </text>
        {vl(pl.A, 'A')}
        {vl(pl.B, 'B')}
        {vl(pl.C, 'C')}
        {sl(pl.B, pl.C, 'a')}
        {sl(pl.A, pl.C, 'b')}
        {sl(pl.A, pl.B, 'c')}
      </svg>
    )
  }
  const r = t ? ratios(t) : null
  const areas = t ? areaThreeWays(t) : null
  return (
    <Frame name="lsratio">
      <div className="chips">
        {RATIO_PRESETS.map((p, i) => (
          <button
            key={i}
            className={`chip ghost ${p.A === A && p.B === B ? 'on' : ''}`}
            onClick={() => {
              setA(p.A)
              setB(p.B)
            }}
            aria-pressed={p.A === A && p.B === B}
          >
            {tc(p.name)}
          </button>
        ))}
      </div>
      <label className="lbl slider">
        A = <b>{A}°</b>
        <input type="range" min={5} max={170} step={1} value={A} aria-label="A" onChange={(e) => setA(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        B = <b>{B}°</b>
        <input type="range" min={5} max={170} step={1} value={B} aria-label="B" onChange={(e) => setB(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        a = <b>{short(a, sep, 1)}</b>
        <input type="range" min={2} max={20} step={0.5} value={a} aria-label="a" onChange={(e) => setA2(Number(e.target.value))} />
      </label>
      {svg}
      <div className="wgtout" aria-live="polite">
        {t && r && areas ? (
          <>
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              C = 180° − {A}° − {B}° = {short(t.C, sep, 2)}°
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="rtable">
                <tbody>
                  <tr>
                    <td>a / sin A</td>
                    <td>
                      {short(t.a, sep, 3)} / sin {A}° = <b>{fmt(r[0], sep, 4)}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>b / sin B</td>
                    <td>
                      {short(t.b, sep, 3)} / sin {B}° = <b>{fmt(r[1], sep, 4)}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>c / sin C</td>
                    <td>
                      {short(t.c, sep, 3)} / sin {short(t.C, sep, 2)}° = <b>{fmt(r[2], sep, 4)}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>2R</td>
                    <td>
                      2 × {fmt(circumradius(t), sep, 4)} = <b>{fmt(2 * circumradius(t), sep, 4)}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>{tc(L('area', 'luas'))}</td>
                    <td>
                      ½bc sin A = {fmt(areas[0], sep, 3)}, ½ac sin B = {fmt(areas[1], sep, 3)}, ½ab sin C = {fmt(areas[2], sep, 3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="small muted">{tc(L('The dashed circle goes through all three vertices, and the dashed right-angled triangle B C B′ (the angle at C is a right angle, because B B′ is a diameter) shows why the common value is the diameter: a = 2R sin A.', 'Lingkaran putus-putus melalui ketiga titik sudut, dan segitiga siku-siku putus-putus B C B′ (sudut di C siku-siku, karena B B′ adalah diameter) menunjukkan mengapa nilai bersamanya adalah diameter: a = 2R sin A.'))}</p>
          </>
        ) : (
          <p className="badline">{tc(L('No triangle: two angles of a triangle add up to less than 180°.', 'Tak ada segitiga: dua sudut segitiga berjumlah kurang dari 180°.'))}</p>
        )}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------------- the ambiguous case */

const KIND_TEXT: Record<SsaKind, Loc> = {
  'none-short': L('a is shorter than the height h = b sin A, so the circle of radius a around C never reaches the ray: no triangle.', 'a lebih pendek daripada tinggi h = b sin A, sehingga lingkaran berjari-jari a di sekitar C tak pernah mencapai sinar: tidak ada segitiga.'),
  right: L('a is exactly the height: the circle just touches the ray, once, at a right angle: one right triangle.', 'a tepat sama dengan tinggi: lingkaran hanya menyentuh sinar, sekali, pada sudut siku-siku: satu segitiga siku-siku.'),
  two: L('a is longer than the height but shorter than b: the circle cuts the ray twice: two triangles.', 'a lebih panjang daripada tinggi tetapi lebih pendek daripada b: lingkaran memotong sinar dua kali: dua segitiga.'),
  'one-long': L('a is at least b: the second place where the circle meets the line lies behind A, which is not on the ray: one triangle.', 'a paling sedikit b: tempat kedua lingkaran bertemu garis berada di belakang A, yang tidak ada pada sinar: satu segitiga.'),
  'one-obtuse': L('A is a right or obtuse angle and a is longer than b: the circle meets the ray once: one triangle.', 'A siku-siku atau tumpul dan a lebih panjang daripada b: lingkaran memotong sinar sekali: satu segitiga.'),
  'none-obtuse': L('A is a right or obtuse angle and a is not longer than b: the side opposite the largest angle would be too short: no triangle.', 'A siku-siku atau tumpul dan a tidak lebih panjang daripada b: sisi di depan sudut terbesar akan terlalu pendek: tidak ada segitiga.'),
}
const AMBIG_PRESETS: { name: Loc; A: number; b: number; a: number }[] = [
  { name: L('no triangle', 'tanpa segitiga'), A: 30, b: 5, a: 2 },
  { name: L('one right triangle', 'satu segitiga siku-siku'), A: 30, b: 5, a: 2.5 },
  { name: L('two triangles', 'dua segitiga'), A: 30, b: 5, a: 3 },
  { name: L('one, a longer than b', 'satu, a lebih panjang dari b'), A: 30, b: 5, a: 6 },
  { name: L('obtuse A, one', 'A tumpul, satu'), A: 120, b: 5, a: 9 },
  { name: L('obtuse A, none', 'A tumpul, tanpa'), A: 120, b: 5, a: 4 },
]

export function SineLawAmbiguous() {
  const { tc } = useI18n()
  const sep = useSep()
  const [A, setA] = useState(30)
  const [b, setB] = useState(5)
  const [a, setA2] = useState(3)
  const info = useMemo(() => ssaKind(a, b, A), [a, b, A])
  const pts = useMemo(() => ssaPoints(a, b, A), [a, b, A])
  const sols = useMemo(() => solveSSA(a, b, A), [a, b, A])
  const C: P = [b * Math.cos(A * RAD), b * Math.sin(A * RAD)]
  const xs = [0, C[0] - a, C[0] + a, ...pts, b]
  const f = frame(Math.min(...xs) - 0.3, Math.max(...xs) + 0.3, Math.min(0, C[1] - a) - 0.3, C[1] + a + 0.3, 340, 270)
  const label = `${tc(L('The ambiguous case with A =', 'Kasus ambigu dengan A ='))} ${A}°, b = ${short(b, sep, 1)}, a = ${short(a, sep, 1)}. ${tc(KIND_TEXT[info.kind])}`
  const colors = ['var(--brand)', 'var(--coral)']
  return (
    <Frame name="lsambig">
      <div className="chips">
        {AMBIG_PRESETS.map((p, i) => (
          <button
            key={i}
            className={`chip ghost ${p.A === A && p.b === b && p.a === a ? 'on' : ''}`}
            onClick={() => {
              setA(p.A)
              setB(p.b)
              setA2(p.a)
            }}
            aria-pressed={p.A === A && p.b === b && p.a === a}
          >
            {tc(p.name)}
          </button>
        ))}
      </div>
      <label className="lbl slider">
        A = <b>{A}°</b>
        <input type="range" min={10} max={150} step={1} value={A} aria-label="A" onChange={(e) => setA(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        b = <b>{short(b, sep, 1)}</b>
        <input type="range" min={2} max={8} step={0.5} value={b} aria-label="b" onChange={(e) => setB(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        a = <b>{short(a, sep, 1)}</b>
        <input type="range" min={0.5} max={12} step={0.1} value={a} aria-label="a" onChange={(e) => setA2(Number(e.target.value))} />
      </label>
      <svg viewBox={`0 0 ${f.W} ${f.H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 440, display: 'block', margin: '6px auto' }}>
        <circle cx={f.X(C[0])} cy={f.Y(C[1])} r={a * f.s} fill="none" stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="5 4" />
        <line x1={f.X(Math.min(...xs) - 0.3)} y1={f.Y(0)} x2={f.X(Math.max(...xs) + 0.3)} y2={f.Y(0)} stroke="var(--muted)" strokeWidth={1.4} />
        <line x1={f.X(C[0])} y1={f.Y(C[1])} x2={f.X(C[0])} y2={f.Y(0)} stroke="var(--gold)" strokeWidth={1.2} strokeDasharray="3 3" />
        {[...pts].reverse().map((x, i) => (
          <polygon key={x} points={`${f.X(0)},${f.Y(0)} ${f.X(x)},${f.Y(0)} ${f.X(C[0])},${f.Y(C[1])}`} fill={colors[(pts.length - 1 - i) % 2]} fillOpacity={0.14} stroke={colors[(pts.length - 1 - i) % 2]} strokeWidth={2} strokeLinejoin="round" />
        ))}
        <line x1={f.X(0)} y1={f.Y(0)} x2={f.X(C[0])} y2={f.Y(C[1])} stroke="var(--text)" strokeWidth={1.8} />
        <path d={arc(f.X(0), f.Y(0), 22, 0, A)} fill="none" stroke="var(--gold)" strokeWidth={1.8} />
        {pts.map((x, i) => (
          <g key={`p${x}`}>
            <circle cx={f.X(x)} cy={f.Y(0)} r={4.2} fill={colors[i % 2]} />
            <text x={f.X(x)} y={f.Y(0) + 16} fontSize={11} fontWeight={700} textAnchor="middle" fill={colors[i % 2]}>
              B{pts.length > 1 ? (i === 0 ? '₁' : '₂') : ''}
            </text>
          </g>
        ))}
        <circle cx={f.X(0)} cy={f.Y(0)} r={3} fill="var(--text)" />
        <circle cx={f.X(C[0])} cy={f.Y(C[1])} r={3.5} fill="var(--text)" />
        <text x={f.X(0) - 4} y={f.Y(0) + 16} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--text)">
          A
        </text>
        <text x={f.X(C[0]) + 6} y={f.Y(C[1]) - 6} fontSize={11} fontWeight={700} fill="var(--text)">
          C
        </text>
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className={info.count === 0 ? 'badline' : 'okline'}>
          {tc(KIND_TEXT[info.kind])} ({info.count} {tc(info.count === 1 ? L('triangle', 'segitiga') : L('triangles', 'segitiga'))})
        </p>
        <p className="small muted">
          h = b sin A = {fmt(info.h, sep, 3)}; b = {short(b, sep, 1)}; a = {short(a, sep, 1)}
        </p>
        {sols.map((t, i) => (
          <p key={i} className="small" style={{ overflowWrap: 'anywhere' }}>
            <b>{sols.length > 1 ? `${tc(L('Triangle', 'Segitiga'))} ${i + 1}` : tc(L('Triangle', 'Segitiga'))}:</b> B = {fmt(t.B, sep, 2)}°, C = {fmt(t.C, sep, 2)}°, c = {fmt(t.c, sep, 3)}
          </p>
        ))}
        {sols.length === 2 && (
          <p className="small muted">
            {tc(L('The two angles B add up to 180°: the law of sines gives only sin B, and sin B has two answers between 0° and 180°.', 'Kedua sudut B berjumlah 180°: aturan sinus hanya memberi sin B, dan sin B memiliki dua jawaban di antara 0° dan 180°.'))}
          </p>
        )}
      </div>
    </Frame>
  )
}

/* --------------------------------------------------------------------------------- the survey */

export function SineLawSurvey() {
  const { tc } = useI18n()
  const sep = useSep()
  const [Lb, setL] = useState(100)
  const [alpha, setAlpha] = useState(60)
  const [beta, setBeta] = useState(70)
  const [d, setD] = useState(1)
  const s = survey(Lb, alpha, beta)
  const worst = surveyWorstError(Lb, alpha, beta, d)
  const label = s
    ? `${tc(L(`Two observers ${Lb} m apart see a tree on the far bank at angles ${alpha}° and ${beta}° from the baseline. The river is ${short(s.h, sep, 1)} m wide.`, `Dua pengamat yang berjarak ${Lb} m melihat pohon di seberang pada sudut ${alpha}° dan ${beta}° dari garis dasar. Lebar sungai ${short(s.h, sep, 1)} m.`))}`
    : tc(L('The lines of sight do not meet.', 'Garis pandang tidak bertemu.'))
  let svg: JSX.Element | null = null
  if (s) {
    const T: P = [s.fromP * Math.cos(alpha * RAD), s.fromP * Math.sin(alpha * RAD)]
    // the corners of the cloud of positions that the errors allow
    const cloud: P[] = []
    for (const da of [-d, d])
      for (const db of [-d, d]) {
        const q = survey(Lb, alpha + da, beta + db)
        if (q) cloud.push([q.fromP * Math.cos((alpha + da) * RAD), q.fromP * Math.sin((alpha + da) * RAD)])
      }
    const xs = [0, Lb, T[0], ...cloud.map((q) => q[0])]
    const ys = [0, T[1], ...cloud.map((q) => q[1])]
    const f = frame(Math.min(...xs) - 6, Math.max(...xs) + 6, -Math.max(...ys) * 0.12, Math.max(...ys) + Math.max(...ys) * 0.1, 340, 270)
    const foot: P = [T[0], 0]
    svg = (
      <svg viewBox={`0 0 ${f.W} ${f.H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 440, display: 'block', margin: '6px auto' }}>
        <rect x={0} y={f.Y(T[1] + 0.0)} width={f.W} height={f.Y(0) - f.Y(T[1])} fill="var(--brand)" fillOpacity={0.07} />
        <line x1={f.X(0)} y1={f.Y(0)} x2={f.X(Lb)} y2={f.Y(0)} stroke="var(--text)" strokeWidth={2.4} />
        <line x1={f.X(0)} y1={f.Y(0)} x2={f.X(T[0])} y2={f.Y(T[1])} stroke="var(--brand)" strokeWidth={1.8} />
        <line x1={f.X(Lb)} y1={f.Y(0)} x2={f.X(T[0])} y2={f.Y(T[1])} stroke="var(--brand)" strokeWidth={1.8} />
        <line x1={f.X(T[0])} y1={f.Y(T[1])} x2={f.X(foot[0])} y2={f.Y(foot[1])} stroke="var(--gold)" strokeWidth={1.6} strokeDasharray="5 4" />
        <path d={arc(f.X(0), f.Y(0), 26, 0, alpha)} fill="none" stroke="var(--gold)" strokeWidth={1.6} />
        <path d={arc(f.X(Lb), f.Y(0), 26, 180 - beta, 180)} fill="none" stroke="var(--gold)" strokeWidth={1.6} />
        {cloud.map((q, i) => (
          <circle key={i} cx={f.X(q[0])} cy={f.Y(q[1])} r={3} fill="none" stroke="var(--bad)" strokeWidth={1.4} />
        ))}
        <circle cx={f.X(T[0])} cy={f.Y(T[1])} r={4.5} fill="var(--bad)" />
        <circle cx={f.X(0)} cy={f.Y(0)} r={3.5} fill="var(--text)" />
        <circle cx={f.X(Lb)} cy={f.Y(0)} r={3.5} fill="var(--text)" />
        {[
          ['P', f.X(0) - 4, f.Y(0) + 16, 'end'],
          ['Q', f.X(Lb) + 4, f.Y(0) + 16, 'start'],
          ['T', f.X(T[0]) + 8, f.Y(T[1]) - 6, 'start'],
          ['α', f.X(0) + 32, f.Y(0) - 6, 'start'],
          ['β', f.X(Lb) - 32, f.Y(0) - 6, 'end'],
          ['h', f.X(T[0]) + 6, (f.Y(T[1]) + f.Y(0)) / 2, 'start'],
          ['L', (f.X(0) + f.X(Lb)) / 2, f.Y(0) + 16, 'middle'],
        ].map(([t, x, y, anchor]) => (
          <text key={String(t)} x={Number(x)} y={Number(y)} fontSize={11} fontWeight={700} textAnchor={anchor as 'start' | 'middle' | 'end'} fill="var(--text)">
            {t}
          </text>
        ))}
      </svg>
    )
  }
  const weak = s !== null && (s.gamma < 25 || s.gamma > 155)
  return (
    <Frame name="lssurvey">
      <label className="lbl slider">
        L = <b>{Lb} m</b>
        <input type="range" min={20} max={200} step={10} value={Lb} aria-label="L" onChange={(e) => setL(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        α = <b>{alpha}°</b>
        <input type="range" min={10} max={120} step={1} value={alpha} aria-label="alpha" onChange={(e) => setAlpha(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        β = <b>{beta}°</b>
        <input type="range" min={10} max={120} step={1} value={beta} aria-label="beta" onChange={(e) => setBeta(Number(e.target.value))} />
      </label>
      <div className="chips">
        {[0.5, 1, 2].map((q) => (
          <button key={q} className={`chip ghost ${d === q ? 'on' : ''}`} onClick={() => setD(q)} aria-pressed={d === q}>
            <Tex src={`\\pm${String(q).replace('.', sep === ',' ? '{,}' : '.')}^\\circ`} />
          </button>
        ))}
      </div>
      {svg}
      <div className="wgtout" aria-live="polite">
        {s && worst !== null ? (
          <>
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              {tc(L('Angle at T', 'Sudut di T'))}: {short(s.gamma, sep, 1)}°. PT = {fmt(s.fromP, sep, 2)} m, QT = {fmt(s.fromQ, sep, 2)} m. <b>{tc(L('Width of the river', 'Lebar sungai'))} h = {fmt(s.h, sep, 2)} m.</b>
            </p>
            <p className={weak || worst > 0.1 ? 'badline' : 'small'} style={{ overflowWrap: 'anywhere' }}>
              {tc(L(`If each angle may be off by ${short(d, sep, 1)}°, h can be wrong by as much as ${fmt(worst * 100, sep, 1)}%: between ${fmt(s.h * (1 - worst), sep, 1)} m and ${fmt(s.h * (1 + worst), sep, 1)} m (the red circles are the positions that the errors allow).`, `Bila tiap sudut boleh meleset ${short(d, sep, 1)}°, h dapat salah sampai ${fmt(worst * 100, sep, 1)}%: antara ${fmt(s.h * (1 - worst), sep, 1)} m dan ${fmt(s.h * (1 + worst), sep, 1)} m (lingkaran merah adalah posisi yang diizinkan galat itu).`))}
            </p>
            <p className="small muted">
              {tc(weak ? L('Weak geometry: the two lines of sight meet at a very small or very large angle, so a small error in an angle moves T a long way. Move the observers so that the lines of sight cross at close to a right angle.', 'Geometri lemah: kedua garis pandang bertemu pada sudut yang sangat kecil atau sangat besar, sehingga galat kecil pada sebuah sudut menggeser T jauh. Pindahkan pengamat agar garis pandang berpotongan mendekati sudut siku-siku.') : L('A good survey: the lines of sight cross at a healthy angle.', 'Pengukuran yang baik: garis pandang berpotongan pada sudut yang sehat.'))}
            </p>
          </>
        ) : (
          <p className="badline">{tc(L('The two lines of sight do not meet: the angles α and β must add up to less than 180°.', 'Kedua garis pandang tidak bertemu: sudut α dan β harus berjumlah kurang dari 180°.'))}</p>
        )}
      </div>
    </Frame>
  )
}
