import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { gcd, parseRational } from '../../lib/realnum'
import { ratAdd, ratMul } from '../../lib/rationals'
import { sqrtParts } from '../../lib/triangle'
import { circle, inscribedAngles, lineMeets, polygonBounds, power, position, rat, relation, sectorOf, tangentsFrom, type Circle, type LineMeet, type Pt, type Rat, type Relation } from '../../lib/circle'
import { Tex } from '../ui'
import { Frame, L, dec, useSep } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const num = (r: Rat): number => Number(r.n) / Number(r.d)
const ratTex = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
const small = (r: Rat | null): r is Rat => r !== null && (r.n < 0n ? -r.n : r.n) <= 9999n && r.d <= 99n
const f = (x: number, places: number, sep: string): string => dec((Math.round(x * 10 ** places) / 10 ** places).toString(), sep)

/** A coordinate `base + sign·coef·√m`, written exactly. */
function surdTex(base: Rat, coef: Rat, m: bigint, sign: 1 | -1): string {
  const c = sign === 1 ? coef : { n: -coef.n, d: coef.d }
  if (c.n === 0n) return ratTex(base)
  if (m === 1n) return ratTex(ratAdd(base, c))
  const mag = c.n < 0n ? { n: -c.n, d: c.d } : c
  const root = mag.n === 1n && mag.d === 1n ? `\\sqrt{${m}}` : `${ratTex(mag)}\\sqrt{${m}}`
  const b = base.n === 0n ? '' : ratTex(base)
  return `${b}${c.n < 0n ? '-' : b ? '+' : ''}${root}`
}

/** √r written as k√m, as a TeX string. */
function rootTex(r: Rat): string {
  const { k, m } = sqrtParts(r)
  if (k.n === 0n) return '0'
  if (m === 1n) return ratTex(k)
  return k.n === 1n && k.d === 1n ? `\\sqrt{${m}}` : `${ratTex(k)}\\sqrt{${m}}`
}

function Field({ label, value, set, width = '5em' }: { label: string; value: string; set: (s: string) => void; width?: string }) {
  return (
    <label className="lbl">
      {label} <input style={{ width }} value={value} aria-label={label} onChange={(e) => set(e.target.value)} />
    </label>
  )
}

/** A plane drawing of circles, lines, segments and dots, scaled to fit. */
interface Plane {
  circles?: { cx: number; cy: number; r: number; cls?: string }[]
  lines?: { foot: [number, number]; dir: [number, number]; cls?: string }[]
  segs?: { from: [number, number]; to: [number, number]; cls?: string }[]
  dots?: { x: number; y: number; label?: string; cls?: string }[]
}

function PlaneSvg({ plane, label }: { plane: Plane; label: string }) {
  const xs: number[] = []
  const ys: number[] = []
  for (const c of plane.circles ?? []) xs.push(c.cx - c.r, c.cx + c.r), ys.push(c.cy - c.r, c.cy + c.r)
  for (const d of plane.dots ?? []) xs.push(d.x), ys.push(d.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const wx = Math.max(...xs) - minX || 1
  const wy = Math.max(...ys) - minY || 1
  const W = 340
  const H = 280
  const pad = 22
  const sc = Math.min((W - 2 * pad) / wx, (H - 2 * pad) / wy)
  const px = (x: number) => (W - wx * sc) / 2 + (x - minX) * sc
  const py = (y: number) => H - ((H - wy * sc) / 2 + (y - minY) * sc)
  const reach = Math.max(wx, wy) * 3
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="quadsvg circsvg" role="img" aria-label={label}>
      {(plane.circles ?? []).map((c, i) => (
        <circle key={i} cx={px(c.cx)} cy={py(c.cy)} r={c.r * sc} className={c.cls ?? 'quadfill'} />
      ))}
      {(plane.lines ?? []).map((l, i) => (
        <line key={i} x1={px(l.foot[0] - l.dir[0] * reach)} y1={py(l.foot[1] - l.dir[1] * reach)} x2={px(l.foot[0] + l.dir[0] * reach)} y2={py(l.foot[1] + l.dir[1] * reach)} className={l.cls ?? 'quaddiag'} />
      ))}
      {(plane.segs ?? []).map((s, i) => (
        <line key={i} x1={px(s.from[0])} y1={py(s.from[1])} x2={px(s.to[0])} y2={py(s.to[1])} className={s.cls ?? 'quaddiag'} />
      ))}
      {(plane.dots ?? []).map((d, i) => (
        <g key={i}>
          <circle cx={px(d.x)} cy={py(d.y)} r={3.5} className={d.cls ?? 'quaddot'} />
          {d.label && (
            <text x={px(d.x) + 8} y={py(d.y) - 7} className="quadlabel">
              {d.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------- circumference, area, sector */

type Given = 'radius' | 'diameter' | 'circumference' | 'area'
const GIVENS: { id: Given; label: Loc }[] = [
  { id: 'radius', label: L('radius r', 'jari-jari r') },
  { id: 'diameter', label: L('diameter d', 'diameter d') },
  { id: 'circumference', label: L('circumference C', 'keliling K') },
  { id: 'area', label: L('area A', 'luas L') },
]

export function CircleCalc() {
  const { tc } = useI18n()
  const sep = useSep()
  const [given, setGiven] = useState<Given>('radius')
  const [text, setText] = useState('7')
  const [theta, setTheta] = useState(60)
  const v = parseRational(text)
  const plain = parseFloat(text.replace(',', '.'))
  const exactGiven = given === 'radius' || given === 'diameter'
  const valid = exactGiven ? small(v) && v!.n > 0n : Number.isFinite(plain) && plain > 0 && plain < 1e6

  let body
  if (!valid) body = <p className="noline">{tc(L('Type a positive number or a fraction such as 7, 2.5 or 7/2.', 'Ketik bilangan atau pecahan positif seperti 7, 2,5, atau 7/2.'))}</p>
  else {
    const x = exactGiven ? num(v!) : plain
    const r = given === 'radius' ? x : given === 'diameter' ? x / 2 : given === 'circumference' ? x / (2 * Math.PI) : Math.sqrt(x / Math.PI)
    const exact = given === 'radius' ? v : given === 'diameter' ? rat(v!.n, v!.d * 2n) : null
    const s = sectorOf(r, theta)
    const T = BigInt(theta)
    const g = gcd(T, 360n) || 1n
    const frac = theta === 0 ? '0' : 360n / g === 1n ? '1' : `\\frac{${T / g}}{${360n / g}}`
    const g2 = gcd(T, 180n) || 1n
    const [pp, qq] = [T / g2, 180n / g2]
    const radFrac = theta === 0 ? '0' : pp === 1n && qq === 1n ? '\\pi' : pp === 1n ? `\\frac{\\pi}{${qq}}` : qq === 1n ? `${pp}\\pi` : `\\frac{${pp}\\pi}{${qq}}`
    const R = 120
    const cx = 150
    const cy = 135
    const rad = (theta * Math.PI) / 180
    const sx = cx + R
    const sy = cy
    const ex = cx + R * Math.cos(rad)
    const ey = cy - R * Math.sin(rad)
    const large = theta > 180 ? 1 : 0
    body = (
      <>
        <div className="gridwrap">
          <table className="rtable">
            <tbody>
              <tr>
                <th>{tc(L('radius r', 'jari-jari r'))}</th>
                <td>
                  {exact ? <Tex src={ratTex(exact)} /> : null} {exact ? '= ' : ''}
                  {f(r, 4, sep)}
                </td>
              </tr>
              <tr>
                <th>{tc(L('diameter d = 2r', 'diameter d = 2r'))}</th>
                <td>{f(2 * r, 4, sep)}</td>
              </tr>
              <tr>
                <th>{tc(L('circumference C = 2πr', 'keliling K = 2πr'))}</th>
                <td>
                  {exact ? <Tex src={`${ratTex(ratMul(rat(2n, 1n), exact))}\\pi`} /> : null} {exact ? '≈ ' : ''}
                  {f(2 * Math.PI * r, 4, sep)}
                </td>
              </tr>
              <tr>
                <th>{tc(L('area A = πr²', 'luas L = πr²'))}</th>
                <td>
                  {exact ? <Tex src={`${ratTex(ratMul(exact, exact))}\\pi`} /> : null} {exact ? '≈ ' : ''}
                  {f(Math.PI * r * r, 4, sep)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <svg viewBox="0 0 300 270" className="quadsvg circsvg" role="img" aria-label={tc(L('A circle with a sector, its chord and its segment', 'Lingkaran dengan juring, tali busur, dan tembereng'))}>
          <circle cx={cx} cy={cy} r={R} className="circbase" />
          {theta > 0 && theta < 360 && (
            <>
              <path d={`M${cx} ${cy} L${sx} ${sy} A${R} ${R} 0 ${large} 0 ${ex.toFixed(2)} ${ey.toFixed(2)} Z`} className="circsector" />
              <path d={`M${sx} ${sy} A${R} ${R} 0 ${large} 0 ${ex.toFixed(2)} ${ey.toFixed(2)} Z`} className="circsegment" />
              <line x1={sx} y1={sy} x2={ex} y2={ey} className="quaddiag" />
            </>
          )}
          {theta === 360 && <circle cx={cx} cy={cy} r={R} className="circsector" />}
          <circle cx={cx} cy={cy} r={3} className="quaddot" />
        </svg>
        <p className="small muted">
          {tc(L('Central angle', 'Sudut pusat'))} θ = <b>{theta}°</b> = <Tex src={`${radFrac}`} /> {tc(L('radians', 'radian'))} · {tc(L('fraction of the circle', 'bagian dari lingkaran'))} <Tex src={frac} />
        </p>
        <ul className="steps">
          <li>
            {tc(L('Arc length', 'Panjang busur'))} = rθ = <b>{f(s.arc, 4, sep)}</b>
          </li>
          <li>
            {tc(L('Sector area', 'Luas juring'))} = ½r²θ = <b>{f(s.sector, 4, sep)}</b>
          </li>
          <li>
            {tc(L('Chord length', 'Panjang tali busur'))} = 2r sin(θ/2) = <b>{f(s.chord, 4, sep)}</b>
          </li>
          <li>
            {tc(L('Segment area', 'Luas tembereng'))} = ½r²(θ − sin θ) = <b>{f(s.segment, 4, sep)}</b>
          </li>
        </ul>
      </>
    )
  }

  return (
    <Frame name="circlecalc">
      <div className="chips">
        {GIVENS.map((x) => (
          <button key={x.id} className={`chip ${x.id === given ? 'on' : ''}`} onClick={() => setGiven(x.id)} aria-pressed={x.id === given}>
            {tc(x.label)}
          </button>
        ))}
      </div>
      <div className="inrow">
        <Field label={tc(GIVENS.find((g) => g.id === given)!.label)} value={text} set={setText} width="7em" />
        <label className="lbl slider">
          θ = <b>{theta}°</b>
          <input type="range" min={0} max={360} value={theta} aria-label="θ" onChange={(e) => setTheta(Number(e.target.value))} />
        </label>
      </div>
      <div className="chips">
        {[30, 45, 60, 90, 120, 180, 270].map((a) => (
          <button key={a} className="chip ghost" onClick={() => setTheta(a)}>
            {a}°
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------ angles in a circle */

export function CircleAngles() {
  const { tc } = useI18n()
  const sep = useSep()
  const [a, setA] = useState(210)
  const [b, setB] = useState(330)
  const [p, setP] = useState(90)
  const [q, setQ] = useState(270)
  const pos = (t: number): [number, number] => [Math.cos((t * Math.PI) / 180), Math.sin((t * Math.PI) / 180)]
  const distinct = new Set([a, b, p, q]).size === 4
  const ip = distinct ? inscribedAngles(a, b, p) : null
  const iq = distinct ? inscribedAngles(a, b, q) : null
  const diameter = (((b - a) % 360) + 360) % 360 === 180
  const sameSide = ip && iq ? Math.abs(ip.arc - iq.arc) < 1e-9 : false
  const sliders: [string, number, (n: number) => void][] = [['A', a, setA], ['B', b, setB], ['P', p, setP], ['Q', q, setQ]]
  const A = pos(a)
  const B = pos(b)
  const P = pos(p)
  const Q = pos(q)

  return (
    <Frame name="circangle">
      <div className="amctl">
        {sliders.map(([name, val, set]) => (
          <label key={name} className="lbl slider">
            {name} = <b>{val}°</b>
            <input type="range" min={0} max={359} value={val} aria-label={name} onChange={(e) => set(Number(e.target.value))} />
          </label>
        ))}
      </div>
      <PlaneSvg
        label={tc(L('A circle with the points A, B, P and Q on it', 'Lingkaran dengan titik A, B, P, dan Q di atasnya'))}
        plane={{
          circles: [{ cx: 0, cy: 0, r: 1, cls: 'circbase' }],
          segs: [
            { from: [0, 0], to: A, cls: 'circradius' },
            { from: [0, 0], to: B, cls: 'circradius' },
            { from: A, to: P, cls: 'circchord' },
            { from: P, to: B, cls: 'circchord' },
            { from: A, to: Q, cls: 'circchord2' },
            { from: Q, to: B, cls: 'circchord2' },
          ],
          dots: [
            { x: 0, y: 0, label: 'O' },
            { x: A[0], y: A[1], label: 'A' },
            { x: B[0], y: B[1], label: 'B' },
            { x: P[0], y: P[1], label: 'P' },
            { x: Q[0], y: Q[1], label: 'Q' },
          ],
        }}
      />
      <div className="wgtout" aria-live="polite">
        {!ip || !iq ? (
          <p className="noline">{tc(L('Move the sliders so that the four points are different.', 'Geser penggeser agar keempat titik berbeda.'))}</p>
        ) : (
          <>
            <ul className="steps">
              <li>
                {tc(L('Central angle', 'Sudut pusat'))} ∠AOB = <b>{f(ip.central, 1, sep)}°</b>
              </li>
              <li>
                {tc(L('Inscribed angle', 'Sudut keliling'))} ∠APB = <b>{f(ip.inscribed, 1, sep)}°</b> · ∠AQB = <b>{f(iq.inscribed, 1, sep)}°</b>
              </li>
              <li>
                {tc(L('Arc AB not containing P', 'Busur AB yang tidak memuat P'))} = {f(ip.arc, 1, sep)}° = 2 · ∠APB
              </li>
            </ul>
            <p className="okline">
              {diameter
                ? tc(L('AB is a diameter, so every inscribed angle on it is 90° (Thales).', 'AB adalah diameter, sehingga setiap sudut keliling di atasnya 90° (Thales).'))
                : sameSide
                  ? tc(L('P and Q are on the same side of AB, so ∠APB = ∠AQB: angles in the same segment are equal.', 'P dan Q berada pada sisi AB yang sama, sehingga ∠APB = ∠AQB: sudut keliling pada busur yang sama sama besar.'))
                  : tc(L(`P and Q are on opposite sides of AB, so APBQ is a cyclic quadrilateral: ∠APB + ∠AQB = ${f(ip.inscribed + iq.inscribed, 1, sep)}°.`, `P dan Q berada pada sisi AB yang berlawanan, sehingga APBQ adalah segiempat tali busur: ∠APB + ∠AQB = ${f(ip.inscribed + iq.inscribed, 1, sep)}°.`))}
            </p>
          </>
        )}
      </div>
    </Frame>
  )
}

/* ------------------------------------------- a line, a point, two circles */

type RelMode = 'line' | 'point' | 'circles'
const REL_MODES: { id: RelMode; label: Loc }[] = [
  { id: 'line', label: L('circle and line', 'lingkaran dan garis') },
  { id: 'point', label: L('circle and point', 'lingkaran dan titik') },
  { id: 'circles', label: L('two circles', 'dua lingkaran') },
]

const RELATION_TEXT: Record<Relation, Loc> = {
  coincident: L('the same circle', 'lingkaran yang sama'),
  separate: L('apart: they do not meet and neither is inside the other', 'saling lepas: tidak bertemu dan tidak ada yang berada di dalam lainnya'),
  external: L('touching from outside: exactly one common point', 'bersinggungan di luar: tepat satu titik persekutuan'),
  secant: L('crossing: two common points', 'berpotongan: dua titik persekutuan'),
  internal: L('touching from inside: exactly one common point', 'bersinggungan di dalam: tepat satu titik persekutuan'),
  contained: L('one lies inside the other, without touching', 'yang satu berada di dalam yang lain, tanpa bersentuhan'),
}

export function CircleRelations() {
  const { tc } = useI18n()
  const sep = useSep()
  const [mode, setMode] = useState<RelMode>('line')
  const [circ, setCirc] = useState(['0', '0', '5'])
  const [line, setLine] = useState(['0', '1', '3'])
  const [pnt, setPnt] = useState(['13', '0'])
  const [circ2, setCirc2] = useState(['8', '0', '3'])
  const p1 = (a: string[]) => a.map((s) => parseRational(s))
  const cs = p1(circ)
  const ls = p1(line)
  const ps = p1(pnt)
  const c2s = p1(circ2)
  const mk = (v: (Rat | null)[]): Circle | null => (v.every(small) && v[2]!.n > 0n ? circle({ x: v[0]!, y: v[1]! }, ratMul(v[2]!, v[2]!)) : null)
  const c1 = mk(cs)

  let body
  if (!c1) body = <p className="noline">{tc(L('Type the center and a positive radius: numbers or fractions such as 3, -1.5 or 7/2.', 'Ketik pusat dan jari-jari positif: bilangan atau pecahan seperti 3, -1,5, atau 7/2.'))}</p>
  else if (mode === 'line') {
    if (!ls.every(small) || (ls[0]!.n === 0n && ls[1]!.n === 0n)) body = <p className="noline">{tc(L('Type a line ax + by = c with a and b not both 0.', 'Ketik garis ax + by = c dengan a dan b tidak keduanya 0.'))}</p>
    else {
      const [a, b, k] = ls as [Rat, Rat, Rat]
      const m: LineMeet = lineMeets(c1, a, b, k)!
      const norm = ratAdd(ratMul(a, a), ratMul(b, b))
      const len = Math.sqrt(num(norm))
      const dir: [number, number] = [-num(b) / len, num(a) / len]
      const r = Math.sqrt(num(c1.r2))
      const { k: sk, m: sm } = sqrtParts(m.sSq)
      const pts: [string, string][] =
        m.kind === 'secant'
          ? [
              [surdTex(m.foot.x, ratMul(sk, { n: -b.n, d: b.d }), sm, 1), surdTex(m.foot.y, ratMul(sk, a), sm, 1)],
              [surdTex(m.foot.x, ratMul(sk, { n: -b.n, d: b.d }), sm, -1), surdTex(m.foot.y, ratMul(sk, a), sm, -1)],
            ]
          : m.kind === 'tangent'
            ? [[ratTex(m.foot.x), ratTex(m.foot.y)]]
            : []
      const fl: [number, number][] =
        m.kind === 'secant'
          ? [[num(m.foot.x) + Math.sqrt(num(m.sSq)) * -num(b), num(m.foot.y) + Math.sqrt(num(m.sSq)) * num(a)], [num(m.foot.x) - Math.sqrt(num(m.sSq)) * -num(b), num(m.foot.y) - Math.sqrt(num(m.sSq)) * num(a)]]
          : m.kind === 'tangent'
            ? [[num(m.foot.x), num(m.foot.y)]]
            : []
      body = (
        <>
          <PlaneSvg
            label={tc(L('A circle and a line', 'Lingkaran dan garis'))}
            plane={{
              circles: [{ cx: num(c1.c.x), cy: num(c1.c.y), r, cls: 'quadfill' }],
              lines: [{ foot: [num(m.foot.x), num(m.foot.y)], dir }],
              dots: [{ x: num(c1.c.x), y: num(c1.c.y), label: 'O' }, ...fl.map(([x, y], i) => ({ x, y, label: 'PQ'[i], cls: 'tridot' }))],
            }}
          />
          <p className={m.kind === 'none' ? 'noline' : 'okline'}>
            {m.kind === 'none' ? tc(L('The line misses the circle.', 'Garis tidak memotong lingkaran.')) : m.kind === 'tangent' ? tc(L('The line is a tangent: it touches the circle at one point.', 'Garis adalah garis singgung: ia menyentuh lingkaran di satu titik.')) : tc(L('The line is a secant: it cuts the circle at two points.', 'Garis adalah garis potong: ia memotong lingkaran di dua titik.'))}
          </p>
          <p className="small">
            <Tex src={`d^2=${ratTex(m.dSq)}\\ ${m.kind === 'none' ? '>' : m.kind === 'tangent' ? '=' : '<'}\\ r^2=${ratTex(c1.r2)}`} /> ({tc(L('d is the distance from the center to the line', 'd adalah jarak dari pusat ke garis'))})
          </p>
          {pts.map(([x, y], i) => (
            <p key={i}>
              {'PQ'[i]} = <Tex src={`\\left(${x},\\ ${y}\\right)`} />
            </p>
          ))}
        </>
      )
    }
  } else if (mode === 'point') {
    if (!ps.every(small)) body = <p className="noline">{tc(L('Type the point as two numbers or fractions.', 'Ketik titik sebagai dua bilangan atau pecahan.'))}</p>
    else {
      const P: Pt = { x: ps[0]!, y: ps[1]! }
      const pos = position(c1, P)
      const pw = power(c1, P)
      const t = pos === 'outside' ? tangentsFrom(c1, P) : null
      const r = Math.sqrt(num(c1.r2))
      let tpts: [number, number][] = []
      if (t) {
        const aa = { n: P.x.n * c1.c.x.d - c1.c.x.n * P.x.d, d: P.x.d * c1.c.x.d }
        const bb = { n: P.y.n * c1.c.y.d - c1.c.y.n * P.y.d, d: P.y.d * c1.c.y.d }
        const s = Math.sqrt(num(t.sSq))
        tpts = [[num(t.foot.x) - s * num(bb), num(t.foot.y) + s * num(aa)], [num(t.foot.x) + s * num(bb), num(t.foot.y) - s * num(aa)]]
      }
      const tangentTex = t ? tangentPointTex(c1, P, t) : []
      body = (
        <>
          <PlaneSvg
            label={tc(L('A circle and a point', 'Lingkaran dan titik'))}
            plane={{
              circles: [{ cx: num(c1.c.x), cy: num(c1.c.y), r, cls: 'quadfill' }],
              segs: tpts.flatMap(([x, y]) => [{ from: [num(P.x), num(P.y)] as [number, number], to: [x, y] as [number, number] }]),
              dots: [{ x: num(c1.c.x), y: num(c1.c.y), label: 'O' }, { x: num(P.x), y: num(P.y), label: 'P', cls: 'tridot' }, ...tpts.map(([x, y], i) => ({ x, y, label: 'TU'[i], cls: 'tridot' }))],
            }}
          />
          <p className="okline">
            {pos === 'inside' ? tc(L('P is inside the circle.', 'P berada di dalam lingkaran.')) : pos === 'on' ? tc(L('P is on the circle.', 'P berada pada lingkaran.')) : tc(L('P is outside the circle.', 'P berada di luar lingkaran.'))}
          </p>
          <p className="small">
            {tc(L('Power of P', 'Kuasa titik P'))}: <Tex src={`|PO|^2-r^2=${ratTex(pw)}`} />
            {pos === 'outside' && (
              <>
                {' '}
                · {tc(L('tangent length', 'panjang garis singgung'))} = <Tex src={rootTex(pw)} /> ≈ {f(Math.sqrt(num(pw)), 4, sep)}
              </>
            )}
          </p>
          {tangentTex.map(([x, y], i) => (
            <p key={i}>
              {'TU'[i]} = <Tex src={`\\left(${x},\\ ${y}\\right)`} />
            </p>
          ))}
        </>
      )
    }
  } else {
    const c2 = mk(c2s)
    if (!c2) body = <p className="noline">{tc(L('Type the second circle: center and a positive radius.', 'Ketik lingkaran kedua: pusat dan jari-jari positif.'))}</p>
    else {
      const rel = relation(c1, c2)
      const d = Math.hypot(num(c1.c.x) - num(c2.c.x), num(c1.c.y) - num(c2.c.y))
      const r1 = Math.sqrt(num(c1.r2))
      const r2 = Math.sqrt(num(c2.r2))
      body = (
        <>
          <PlaneSvg
            label={tc(L('Two circles', 'Dua lingkaran'))}
            plane={{
              circles: [
                { cx: num(c1.c.x), cy: num(c1.c.y), r: r1, cls: 'quadfill' },
                { cx: num(c2.c.x), cy: num(c2.c.y), r: r2, cls: 'circsecond' },
              ],
              dots: [{ x: num(c1.c.x), y: num(c1.c.y), label: 'O₁' }, { x: num(c2.c.x), y: num(c2.c.y), label: 'O₂' }],
            }}
          />
          <p className="okline">{tc(RELATION_TEXT[rel])}</p>
          <p className="small">
            d ≈ {f(d, 3, sep)} · r₁ + r₂ = {f(r1 + r2, 3, sep)} · |r₁ − r₂| = {f(Math.abs(r1 - r2), 3, sep)}
          </p>
        </>
      )
    }
  }

  const cf = (i: number, vals: string[], set: (v: string[]) => void) => (s: string) => set(vals.map((x, j) => (j === i ? s : x)))
  return (
    <Frame name="circlerel">
      <div className="chips">
        {REL_MODES.map((x) => (
          <button key={x.id} className={`chip ${x.id === mode ? 'on' : ''}`} onClick={() => setMode(x.id)} aria-pressed={x.id === mode}>
            {tc(x.label)}
          </button>
        ))}
      </div>
      <div className="inrow">
        <b>{tc(L('Circle', 'Lingkaran'))}</b>
        <Field label="h" value={circ[0]} set={cf(0, circ, setCirc)} width="4em" />
        <Field label="k" value={circ[1]} set={cf(1, circ, setCirc)} width="4em" />
        <Field label="r" value={circ[2]} set={cf(2, circ, setCirc)} width="4em" />
      </div>
      {mode === 'line' && (
        <>
          <div className="inrow">
            <b>{tc(L('Line', 'Garis'))}</b>
            <Field label="a" value={line[0]} set={cf(0, line, setLine)} width="4em" />
            <Field label="b" value={line[1]} set={cf(1, line, setLine)} width="4em" />
            <Field label="c" value={line[2]} set={cf(2, line, setLine)} width="4em" />
            <span className="small muted">ax + by = c</span>
          </div>
          <div className="chips">
            {[[['0', '0', '5'], ['0', '1', '3']], [['0', '0', '5'], ['1', '0', '5']], [['0', '0', '5'], ['1', '1', '8']], [['2', '1', '5'], ['1', '-1', '1']]].map(([cc, ll], i) => (
              <button
                key={i}
                className="chip ghost"
                onClick={() => {
                  setCirc(cc)
                  setLine(ll)
                }}
              >
                {[tc(L('cuts', 'memotong')), tc(L('tangent', 'menyinggung')), tc(L('misses', 'tidak memotong')), tc(L('surds', 'bentuk akar'))][i]}
              </button>
            ))}
          </div>
        </>
      )}
      {mode === 'point' && (
        <div className="inrow">
          <b>{tc(L('Point P', 'Titik P'))}</b>
          <Field label="x" value={pnt[0]} set={cf(0, pnt, setPnt)} width="4em" />
          <Field label="y" value={pnt[1]} set={cf(1, pnt, setPnt)} width="4em" />
          <button className="chip ghost" onClick={() => { setCirc(['0', '0', '5']); setPnt(['13', '0']) }}>13, 0</button>
          <button className="chip ghost" onClick={() => setPnt(['3', '0'])}>3, 0</button>
          <button className="chip ghost" onClick={() => setPnt(['3', '4'])}>3, 4</button>
        </div>
      )}
      {mode === 'circles' && (
        <>
          <div className="inrow">
            <b>{tc(L('Circle 2', 'Lingkaran 2'))}</b>
            <Field label="h" value={circ2[0]} set={cf(0, circ2, setCirc2)} width="4em" />
            <Field label="k" value={circ2[1]} set={cf(1, circ2, setCirc2)} width="4em" />
            <Field label="r" value={circ2[2]} set={cf(2, circ2, setCirc2)} width="4em" />
          </div>
          <div className="chips">
            {[['9', '0', '3'], ['8', '0', '3'], ['6', '0', '3'], ['2', '0', '3'], ['1', '0', '3']].map((c2, i) => (
              <button
                key={i}
                className="chip ghost"
                onClick={() => {
                  setCirc(['0', '0', '5'])
                  setCirc2(c2)
                }}
              >
                {[tc(L('apart', 'lepas')), tc(L('outside tangent', 'singgung luar')), tc(L('crossing', 'berpotongan')), tc(L('inside tangent', 'singgung dalam')), tc(L('inside', 'di dalam'))][i]}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/** The two tangent points from an outside point, as TeX coordinates. */
function tangentPointTex(c: Circle, P: Pt, t: LineMeet): [string, string][] {
  const a = { n: P.x.n * c.c.x.d - c.c.x.n * P.x.d, d: P.x.d * c.c.x.d }
  const b = { n: P.y.n * c.c.y.d - c.c.y.n * P.y.d, d: P.y.d * c.c.y.d }
  const { k, m } = sqrtParts(t.sSq)
  return ([1, -1] as const).map((sg) => [surdTex(t.foot.x, ratMul(k, { n: -b.n, d: b.d }), m, sg), surdTex(t.foot.y, ratMul(k, a), m, sg)])
}

/* ----------------------------------------------------- Archimedes and π */

export function PiBounds() {
  const { tc } = useI18n()
  const sep = useSep()
  const [k, setK] = useState(4)
  const b = polygonBounds(k)
  const exact = Math.PI.toFixed(10)
  const lo = b.lower.toFixed(10)
  const hi = b.upper.toFixed(10)
  const agree = (s: string) => {
    let i = 0
    while (i < s.length && s[i] === exact[i]) i++
    return Math.max(0, i - 2)
  }
  const digits = Math.min(agree(lo), agree(hi))
  const R = 110
  const cx = 150
  const cy = 125
  const poly = (radius: number, rot: number) =>
    Array.from({ length: b.n }, (_, i) => {
      const t = rot + (2 * Math.PI * i) / b.n
      return `${(cx + radius * Math.cos(t)).toFixed(1)},${(cy - radius * Math.sin(t)).toFixed(1)}`
    }).join(' ')

  return (
    <Frame name="pibound">
      <label className="lbl slider">
        {tc(L('Sides', 'Sisi'))} n = <b>{b.n}</b>
        <input type="range" min={0} max={12} value={k} aria-label="n" onChange={(e) => setK(Number(e.target.value))} />
      </label>
      <div className="chips">
        {[0, 1, 2, 3, 4, 6, 9].map((kk) => (
          <button key={kk} className="chip ghost" onClick={() => setK(kk)}>
            {6 * 2 ** kk}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 300 250" className="quadsvg circsvg" role="img" aria-label={tc(L('A circle between an inscribed and a circumscribed polygon', 'Lingkaran di antara segibanyak dalam dan luar'))}>
        {b.n <= 96 && <polygon points={poly(R / Math.cos(Math.PI / b.n), Math.PI / b.n)} className="circpolyout" />}
        <circle cx={cx} cy={cy} r={R} className="circbase" />
        {b.n <= 96 && <polygon points={poly(R, 0)} className="circpolyin" />}
      </svg>
      <div className="gridwrap">
        <table className="rtable">
          <tbody>
            <tr>
              <th>{tc(L('Inscribed polygon', 'Segibanyak dalam'))}</th>
              <td>
                n·sin(π/n) = <b>{dec(lo, sep)}</b>
              </td>
            </tr>
            <tr>
              <th>π</th>
              <td>{dec(exact, sep)}…</td>
            </tr>
            <tr>
              <th>{tc(L('Circumscribed polygon', 'Segibanyak luar'))}</th>
              <td>
                n·tan(π/n) = <b>{dec(hi, sep)}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="okline">
        {digits === 0
          ? tc(L('π is trapped between the two numbers, but not even one decimal place is settled yet.', 'π terperangkap di antara kedua bilangan itu, tetapi belum satu angka desimal pun yang pasti.'))
          : tc(L(`π is trapped between the two numbers: at least ${digits} decimal places are already settled.`, `π terperangkap di antara kedua bilangan itu: sekurang-kurangnya ${digits} angka desimal sudah pasti.`))}
      </p>
      {b.n === 96 && <p className="small muted">{tc(L('This is Archimedes\' 96-gon (about 250 BCE): he proved 3 10/71 < π < 3 1/7.', 'Inilah segi-96 Archimedes (sekitar 250 SM): ia membuktikan 3 10/71 < π < 3 1/7.'))}</p>}
    </Frame>
  )
}
