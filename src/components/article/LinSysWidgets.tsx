import { useState, type ReactNode } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import {
  ONE,
  Q,
  absR,
  clip,
  cond1,
  cramer,
  eqTex,
  isZero,
  nearParallel,
  parseEquation,
  ratPlain,
  ratTex,
  satisfies,
  solve,
  solveByElimination,
  solveBySubstitution,
  solveFloat,
  toNumber,
  type Eq,
  type Outcome,
  type ParseError,
  type Rat,
  type System,
  type Unknown,
} from '../../lib/linsys'
import { ratDiv, ratMul, ratSub, roundedDecimal } from '../../lib/rationals'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { frame } from './SineLawWidgets'

const ERRORS: Record<ParseError, Loc> = {
  empty: L('Type an equation, such as 2x + 3y = 7.', 'Ketik sebuah persamaan, misalnya 2x + 3y = 7.'),
  noequals: L('An equation needs exactly one “=” sign.', 'Persamaan memerlukan tepat satu tanda “=”.'),
  syntax: L('I could not read that. Write terms like 3x, -y or 5, joined by + and −; a fraction beside a letter needs brackets, as in (1/2)x.', 'Saya tidak bisa membacanya. Tulis suku seperti 3x, -y, atau 5, dihubungkan + dan −; pecahan di samping huruf perlu kurung, seperti (1/2)x.'),
  letters: L('Only the unknowns x and y are allowed.', 'Hanya bilangan tak diketahui x dan y yang boleh dipakai.'),
  big: L('That number has too many digits (at most 9).', 'Bilangan itu terlalu panjang (paling banyak 9 angka).'),
}

/** A typed equation: its box, and what it says when it cannot be read. */
function EqBox({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  const { tc } = useI18n()
  const p = parseEquation(value)
  return (
    <div>
      <label className="lbl">
        {label}{' '}
        <input style={{ width: '12em' }} value={value} aria-label={label} aria-invalid={!p.ok} spellCheck={false} autoComplete="off" onChange={(e) => set(e.target.value)} />
      </label>
      {!p.ok && <p className="badline small">{tc(ERRORS[p.error])}</p>}
    </div>
  )
}

/** Both boxes read: the system, or null when either is unreadable. */
const read = (t1: string, t2: string): System | null => {
  const a = parseEquation(t1)
  const b = parseEquation(t2)
  return a.ok && b.ok ? { e1: a.eq, e2: b.eq } : null
}

interface Preset {
  name: Loc
  e1: string
  e2: string
}
const PRESETS: Preset[] = [
  { name: L('one point', 'satu titik'), e1: 'x + y = 10', e2: 'x - y = 2' },
  { name: L('not whole numbers', 'bukan bilangan bulat'), e1: '2x + 3y = 7', e2: 'x - 4y = 1' },
  { name: L('one is vertical', 'satu garis tegak'), e1: 'x = 3', e2: 'x + y = 5' },
  { name: L('parallel', 'sejajar'), e1: '2x + 3y = 6', e2: '4x + 6y = 18' },
  { name: L('the same line', 'garis yang sama'), e1: 'x + 2y = 4', e2: '3x + 6y = 12' },
]

function PresetChips({ t1, t2, set }: { t1: string; t2: string; set: (a: string, b: string) => void }) {
  const { tc } = useI18n()
  return (
    <div className="chips">
      {PRESETS.map((p, i) => {
        const on = t1 === p.e1 && t2 === p.e2
        return (
          <button key={i} className={`chip ghost ${on ? 'on' : ''}`} onClick={() => set(p.e1, p.e2)} aria-pressed={on}>
            {tc(p.name)}
          </button>
        )
      })}
    </div>
  )
}

/** A fraction, wrapped in brackets when it would be misread beside a sign or a dot. */
const par = (r: Rat): string => (r.n < 0n || r.d !== 1n ? `\\left(${ratTex(r)}\\right)` : ratTex(r))

/* ------------------------------------------------------------------------------ the graph */

/** A step for the tick marks that gives about six to ten numbers across the picture. */
function niceStep(range: number): number {
  const raw = range / 4
  const pow = 10 ** Math.floor(Math.log10(raw))
  const m = raw / pow
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * pow
}

export function LinSysGraph() {
  const { tc } = useI18n()
  const [t1, setT1] = useState(PRESETS[0].e1)
  const [t2, setT2] = useState(PRESETS[0].e2)
  const s = read(t1, t2)
  const sol = s ? solve(s) : null
  const cr = s ? cramer(s) : null

  // the window: wide enough for the crossing point when there is one
  let R = 8
  if (sol?.kind === 'unique') {
    const far = Math.max(Math.abs(toNumber(sol.x)), Math.abs(toNumber(sol.y)))
    if (Number.isFinite(far)) R = Math.max(6, Math.ceil((far * 1.35) / 2) * 2)
  }
  const W = 340
  const f = frame(-R, R, -R, R, W, W, 24)
  const step = niceStep(R)
  const ticks: number[] = []
  for (let v = -Math.floor(R / step) * step; v <= R + 1e-9; v += step) if (Math.abs(v) > 1e-9) ticks.push(Number(v.toPrecision(12)))
  const seg1 = s ? clip(s.e1, -R, R, -R, R) : null
  const seg2 = s ? clip(s.e2, -R, R, -R, R) : null
  const draw = (seg: ReturnType<typeof clip>, color: string, dash?: string, width = 3) =>
    seg && <line x1={f.X(seg[0][0])} y1={f.Y(seg[0][1])} x2={f.X(seg[1][0])} y2={f.Y(seg[1][1])} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} />
  const label = s
    ? `${tc(L('Two lines', 'Dua garis'))}: ${tc(L('first', 'pertama'))} ${t1}; ${tc(L('second', 'kedua'))} ${t2}. ${
        sol?.kind === 'unique' ? `${tc(L('They cross at', 'Keduanya berpotongan di'))} (${ratPlain(sol.x)}, ${ratPlain(sol.y)}).` : sol?.kind === 'line' ? tc(L('They are the same line.', 'Keduanya garis yang sama.')) : tc(L('They never meet.', 'Keduanya tidak pernah bertemu.'))
      }`
    : tc(L('Two lines', 'Dua garis'))
  return (
    <Frame name="lsgraph">
      <PresetChips t1={t1} t2={t2} set={(a, b) => (setT1(a), setT2(b))} />
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 12 }}>
        <EqBox label="1)" value={t1} set={setT1} />
        <EqBox label="2)" value={t2} set={setT2} />
      </div>
      <svg viewBox={`0 0 ${W} ${W}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: 380, display: 'block', margin: '6px auto' }}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={f.X(v)} y1={f.Y(-R)} x2={f.X(v)} y2={f.Y(R)} stroke="var(--border)" strokeWidth={0.8} />
            <line x1={f.X(-R)} y1={f.Y(v)} x2={f.X(R)} y2={f.Y(v)} stroke="var(--border)" strokeWidth={0.8} />
            <text x={f.X(v)} y={f.Y(0) + 12} fontSize={9} textAnchor="middle" fill="var(--muted)">
              {v}
            </text>
            <text x={f.X(0) - 4} y={f.Y(v) + 3} fontSize={9} textAnchor="end" fill="var(--muted)">
              {v}
            </text>
          </g>
        ))}
        <line x1={f.X(-R)} y1={f.Y(0)} x2={f.X(R)} y2={f.Y(0)} stroke="var(--text)" strokeWidth={1.2} />
        <line x1={f.X(0)} y1={f.Y(-R)} x2={f.X(0)} y2={f.Y(R)} stroke="var(--text)" strokeWidth={1.2} />
        <text x={f.X(R) - 4} y={f.Y(0) - 5} fontSize={11} fontStyle="italic" textAnchor="end" fill="var(--text)">
          x
        </text>
        <text x={f.X(0) + 6} y={f.Y(R) + 10} fontSize={11} fontStyle="italic" fill="var(--text)">
          y
        </text>
        {sol?.kind === 'line' ? (
          <>
            {draw(seg1, 'var(--coral)', undefined, 6)}
            {draw(seg2, 'var(--gold)', '6 6', 3)}
          </>
        ) : (
          <>
            {draw(seg1, 'var(--coral)')}
            {draw(seg2, 'var(--gold)')}
          </>
        )}
        {sol?.kind === 'unique' && (
          <>
            <circle cx={f.X(toNumber(sol.x))} cy={f.Y(toNumber(sol.y))} r={5} fill="var(--brand)" stroke="var(--surface)" strokeWidth={1.5} />
            <text x={f.X(toNumber(sol.x)) + 8} y={f.Y(toNumber(sol.y)) - 8} fontSize={11} fontWeight={700} fill="var(--text)" style={{ paintOrder: 'stroke', stroke: 'var(--surface)', strokeWidth: 3 }}>
              ({ratPlain(sol.x)}, {ratPlain(sol.y)})
            </text>
          </>
        )}
      </svg>
      <div className="wgtout" aria-live="polite">
        {!s || !sol ? (
          <p className="small muted">{tc(L('Fix the equation marked above to see the lines.', 'Perbaiki persamaan yang ditandai di atas untuk melihat garisnya.'))}</p>
        ) : (
          <>
            <p className={sol.kind === 'unique' ? 'okline' : 'warnline'} style={{ overflowWrap: 'anywhere' }}>
              {sol.kind === 'unique' &&
                tc(L(`The lines cross at one point, so there is exactly one solution: x = ${ratPlain(sol.x)}, y = ${ratPlain(sol.y)}.`, `Kedua garis berpotongan di satu titik, jadi ada tepat satu penyelesaian: x = ${ratPlain(sol.x)}, y = ${ratPlain(sol.y)}.`))}
              {sol.kind === 'none' && tc(L('The lines never meet (or an equation says 0 = a nonzero number), so there is no solution.', 'Kedua garis tidak pernah bertemu (atau sebuah persamaan berbunyi 0 = bilangan bukan nol), jadi tidak ada penyelesaian.'))}
              {sol.kind === 'line' && tc(L('Both equations describe the same line, so every point of it is a solution: infinitely many.', 'Kedua persamaan menggambarkan garis yang sama, jadi setiap titik pada garis itu adalah penyelesaian: tak terhingga banyaknya.'))}
              {sol.kind === 'plane' && tc(L('Both equations say 0 = 0: every point is a solution.', 'Kedua persamaan berbunyi 0 = 0: setiap titik adalah penyelesaian.'))}
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="rtable">
                <tbody>
                  <tr>
                    <td>
                      <Tex src="D=a_1b_2-a_2b_1" />
                    </td>
                    <td>
                      <b>{ratPlain(ratSub(ratMul(s.e1.a, s.e2.b), ratMul(s.e2.a, s.e1.b)))}</b>
                      {cr ? '' : ` — ${tc(L('zero: the lines have the same direction', 'nol: kedua garis searah'))}`}
                    </td>
                  </tr>
                  {cr && (
                    <>
                      <tr>
                        <td>
                          <Tex src="x=\frac{c_1b_2-c_2b_1}{D}" />
                        </td>
                        <td>
                          <b>
                            {ratPlain(cr.Dx)} / {ratPlain(cr.D)} = {ratPlain(cr.x)}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Tex src="y=\frac{a_1c_2-a_2c_1}{D}" />
                        </td>
                        <td>
                          <b>
                            {ratPlain(cr.Dy)} / {ratPlain(cr.D)} = {ratPlain(cr.y)}
                          </b>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------- the steps */

type Method = 'elim' | 'sub' | 'cramer'
const STEP_PRESETS: Preset[] = [
  { name: L('x + y = 10, x − y = 2', 'x + y = 10, x − y = 2'), e1: 'x + y = 10', e2: 'x - y = 2' },
  { name: L('3x + 2y = 16, x − y = 2', '3x + 2y = 16, x − y = 2'), e1: '3x + 2y = 16', e2: 'x - y = 2' },
  { name: L('2x + 3y = 12, 3x − 2y = 5', '2x + 3y = 12, 3x − 2y = 5'), e1: '2x + 3y = 12', e2: '3x - 2y = 5' },
  { name: L('decimals', 'desimal'), e1: '0.5x + y = 3', e2: 'x - 2y = 2' },
  { name: L('the same line', 'garis yang sama'), e1: '2x + 4y = 10', e2: 'x + 2y = 5' },
  { name: L('no solution', 'tanpa penyelesaian'), e1: '2x + 4y = 10', e2: 'x + 2y = 7' },
]

/** One numbered step: the words, and under them the equations. */
function Step({ children, math }: { n: number; children: ReactNode; math?: string[] }) {
  return (
    <li style={{ marginBottom: 8 }}>
      <span>{children}</span>
      {math?.map((m, i) => (
        <div key={i} style={{ overflowX: 'auto', padding: '2px 0' }}>
          <Tex src={m} />
        </div>
      ))}
    </li>
  )
}

/** An equation with the answer put in for x and y, as the check: `2\cdot3+3\cdot2=12`. */
function plug(e: Eq, x: Rat, y: Rat): string {
  const parts: string[] = []
  if (!isZero(e.a)) parts.push(`${par(e.a)}\\cdot${par(x)}`)
  if (!isZero(e.b)) parts.push(`${parts.length ? '+' : ''}${par(e.b)}\\cdot${par(y)}`)
  return `${parts.join('') || '0'}=${ratTex(e.c)}`
}

/** `isolate = k0 + k1·other`, without the zero terms. */
function exprTex(k0: Rat, k1: Rat, v: string): string {
  const parts: string[] = []
  if (!isZero(k0)) parts.push(ratTex(k0))
  if (!isZero(k1)) {
    const mag = absR(k1)
    const body = mag.n === 1n && mag.d === 1n ? v : mag.d === 1n ? `${mag.n}${v}` : `\\frac{${mag.n}}{${mag.d}}${v}`
    parts.push(parts.length ? ` ${k1.n < 0n ? '-' : '+'} ${body}` : k1.n < 0n ? `-${body}` : body)
  }
  return parts.length ? parts.join('') : '0'
}

function outcomeTex(o: Outcome, v: string): string {
  if (o.kind === 'value') return `${v}=${ratTex(o.value)}`
  if (o.kind === 'identity') return '0=0'
  return `0=${ratTex(o.c)}`
}

export function LinSysSteps() {
  const { tc } = useI18n()
  const [t1, setT1] = useState(STEP_PRESETS[2].e1)
  const [t2, setT2] = useState(STEP_PRESETS[2].e2)
  const [method, setMethod] = useState<Method>('elim')
  const [gone, setGone] = useState<Unknown | 'auto'>('auto')
  const s = read(t1, t2)
  const sol = s ? solve(s) : null
  const noUnknown = s ? [s.e1.a, s.e1.b, s.e2.a, s.e2.b].every(isZero) : false

  const verdict = (o: Outcome, v: string): ReactNode => {
    if (o.kind === 'value') return null
    return (
      <p className={o.kind === 'identity' ? 'warnline' : 'badline'}>
        {o.kind === 'identity'
          ? tc(L(`Everything cancelled to 0 = 0, which is always true: the two equations say the same thing, and every point of the line is a solution (infinitely many).`, `Semuanya habis menjadi 0 = 0, yang selalu benar: kedua persamaan berkata sama, dan setiap titik pada garis adalah penyelesaian (tak terhingga banyaknya).`))
          : tc(L(`The ${v} is gone and what is left is 0 = ${ratPlain(o.c)}, which is never true: the lines are parallel and there is no solution.`, `${v} habis dan yang tersisa adalah 0 = ${ratPlain(o.c)}, yang tak pernah benar: kedua garis sejajar dan tidak ada penyelesaian.`))}
      </p>
    )
  }

  const check = (): ReactNode =>
    s && sol?.kind === 'unique' ? (
      <Step n={99} math={[plug(s.e1, sol.x, sol.y), plug(s.e2, sol.x, sol.y)]}>
        {tc(L('Check in both original equations:', 'Periksa di kedua persamaan semula:'))}{' '}
        <b>{satisfies(s.e1, sol.x, sol.y) && satisfies(s.e2, sol.x, sol.y) ? '✓ ✓' : '✗'}</b>
      </Step>
    ) : null

  const steps = (): ReactNode => {
    if (!s || !sol) return null
    if (noUnknown) return <p className="small muted">{tc(L('Neither equation has an x or a y.', 'Tak satu pun persamaan memuat x atau y.'))}</p>
    if (method === 'cramer') {
      const c = cramer(s)
      return (
        <ol className="steps" style={{ paddingLeft: 20 }}>
          <Step n={1} math={[`D=a_1b_2-a_2b_1=${par(s.e1.a)}\\cdot${par(s.e2.b)}-${par(s.e2.a)}\\cdot${par(s.e1.b)}=${c ? ratTex(c.D) : '0'}`]}>
            {tc(L('The determinant of the coefficients:', 'Determinan koefisiennya:'))}
          </Step>
          {c ? (
            <>
              <Step n={2} math={[`D_x=c_1b_2-c_2b_1=${par(s.e1.c)}\\cdot${par(s.e2.b)}-${par(s.e2.c)}\\cdot${par(s.e1.b)}=${ratTex(c.Dx)}`, `D_y=a_1c_2-a_2c_1=${par(s.e1.a)}\\cdot${par(s.e2.c)}-${par(s.e2.a)}\\cdot${par(s.e1.c)}=${ratTex(c.Dy)}`]}>
                {tc(L('D ≠ 0, so there is exactly one solution. Replace a column by the right-hand sides:', 'D ≠ 0, jadi ada tepat satu penyelesaian. Ganti satu kolom dengan ruas kanan:'))}
              </Step>
              <Step n={3} math={[`x=\\frac{D_x}{D}=${ratTex(c.x)}\\qquad y=\\frac{D_y}{D}=${ratTex(c.y)}`]}>{tc(L('Divide:', 'Bagi:'))}</Step>
              {check()}
            </>
          ) : (
            <Step n={2}>
              {tc(L('D = 0: the lines have the same direction, so Cramer’s rule cannot divide. They are either the same line or parallel: use elimination to tell which.', 'D = 0: kedua garis searah, jadi aturan Cramer tidak bisa membagi. Keduanya garis yang sama atau sejajar: pakai eliminasi untuk membedakannya.'))}
            </Step>
          )}
        </ol>
      )
    }
    if (method === 'sub') {
      const t = solveBySubstitution(s)
      if (!t) return null
      const p = t.plan
      const src = p.from === 1 ? s.e1 : s.e2
      const dst = p.from === 1 ? s.e2 : s.e1
      const v = p.isolate
      return (
        <ol className="steps" style={{ paddingLeft: 20 }}>
          <Step n={1} math={[`${eqTex(src)}\\ \\to\\ ${v}=${exprTex(p.k0, p.k1, p.other)}`]}>
            {tc(L(`Solve equation ${p.from} for ${v} (it has the easiest coefficient):`, `Selesaikan persamaan ${p.from} untuk ${v} (koefisiennya paling mudah):`))}
          </Step>
          <Step
            n={2}
            math={[
              eqTex(dst),
              `${par(v === 'x' ? dst.a : dst.b)}\\left(${exprTex(p.k0, p.k1, p.other)}\\right)+${par(v === 'x' ? dst.b : dst.a)}${p.other}=${ratTex(dst.c)}`,
              `${p.result.coef.n === 0n ? '0' : `${ratTex(p.result.coef)}${p.other}`}=${ratTex(p.result.rhs)}`,
            ]}
          >
            {tc(L(`Put that in for ${v} in equation ${p.from === 1 ? 2 : 1} and simplify:`, `Masukkan itu sebagai ${v} ke persamaan ${p.from === 1 ? 2 : 1} dan sederhanakan:`))}
          </Step>
          {t.outcome.kind === 'value' ? (
            <>
              <Step n={3} math={[outcomeTex(t.outcome, p.other)]}>{tc(L(`Solve for ${p.other}:`, `Selesaikan untuk ${p.other}:`))}</Step>
              <Step n={4} math={[`${v}=${exprTex(p.k0, p.k1, p.other).replace(new RegExp(p.other, 'g'), `\\left(${ratTex(t.outcome.value)}\\right)`)}=${ratTex(t.isolated ?? ONE)}`]}>
                {tc(L(`Go back for ${v}:`, `Kembali untuk ${v}:`))}
              </Step>
              {check()}
            </>
          ) : (
            <>
              <Step n={3} math={[outcomeTex(t.outcome, p.other)]}>{tc(L(`The ${p.other} cancelled:`, `${p.other} habis:`))}</Step>
              {verdict(t.outcome, p.other)}
            </>
          )}
        </ol>
      )
    }
    const t = solveByElimination(s, gone === 'auto' ? undefined : gone)
    if (!t) {
      return <p className="small muted">{tc(L(`${gone === 'auto' ? 'There is nothing to eliminate' : gone} is in neither equation.`, `${gone === 'auto' ? 'Tidak ada yang bisa dieliminasi' : gone} tidak ada di kedua persamaan.`))}</p>
    }
    const p = t.plan
    const g = p.gone
    const cleared = !(p.clear[0].n === 1n && p.clear[1].n === 1n)
    const rows: ReactNode[] = []
    let n = 0
    if (cleared)
      rows.push(
        <Step key="c" n={++n} math={[eqTex(p.whole.e1), eqTex(p.whole.e2)]}>
          {tc(L(`Clear the fractions and decimals: multiply equation 1 by ${p.clear[0].n} and equation 2 by ${p.clear[1].n}.`, `Hilangkan pecahan dan desimal: kalikan persamaan 1 dengan ${p.clear[0].n} dan persamaan 2 dengan ${p.clear[1].n}.`))}
        </Step>,
      )
    rows.push(
      <Step key="m" n={++n} math={[eqTex(p.scaled[0]), eqTex(p.scaled[1])]}>
        {p.k1.n === 0n || p.k2.n === 0n
          ? tc(L(`${g} is already missing from one equation: keep that one.`, `${g} sudah tidak ada di salah satu persamaan: pakai yang itu.`))
          : tc(L(`Make the ${g}-coefficients the same size: multiply equation 1 by ${p.k1.n} and equation 2 by ${p.k2.n}.`, `Samakan ukuran koefisien ${g}: kalikan persamaan 1 dengan ${p.k1.n} dan persamaan 2 dengan ${p.k2.n}.`))}
      </Step>,
    )
    if (p.k1.n !== 0n && p.k2.n !== 0n)
      rows.push(
        <Step key="a" n={++n} math={[eqTex(p.result)]}>
          {p.op === 'add' ? tc(L('The coefficients are opposite: add the equations.', 'Koefisiennya berlawanan: jumlahkan kedua persamaan.')) : tc(L('The coefficients are equal: subtract the second equation from the first.', 'Koefisiennya sama: kurangkan persamaan kedua dari yang pertama.'))}
        </Step>,
      )
    if (t.outcome.kind === 'value') {
      rows.push(
        <Step key="v" n={++n} math={[outcomeTex(t.outcome, t.left)]}>
          {tc(L(`Solve for ${t.left}:`, `Selesaikan untuk ${t.left}:`))}
        </Step>,
      )
      if (t.back) {
        const e = t.back.eq === 1 ? s.e1 : s.e2
        const sub = g === 'x' ? `${par(e.a)}x+${par(e.b)}\\left(${ratTex(t.back.value)}\\right)=${ratTex(e.c)}` : `${par(e.a)}\\left(${ratTex(t.back.value)}\\right)+${par(e.b)}y=${ratTex(e.c)}`
        rows.push(
          <Step key="b" n={++n} math={[sub, `${g}=${ratTex(t.back.other)}`]}>
            {tc(L(`Put ${t.left} = ${ratPlain(t.back.value)} into equation ${t.back.eq} and solve for ${g}:`, `Masukkan ${t.left} = ${ratPlain(t.back.value)} ke persamaan ${t.back.eq} dan selesaikan untuk ${g}:`))}
          </Step>,
        )
      }
      const c = check()
      if (c) rows.push(<span key="k">{c}</span>)
    } else {
      rows.push(
        <Step key="v" n={++n} math={[outcomeTex(t.outcome, t.left)]}>
          {tc(L('What is left:', 'Yang tersisa:'))}
        </Step>,
      )
    }
    return (
      <>
        <ol className="steps" style={{ paddingLeft: 20 }}>
          {rows}
        </ol>
        {verdict(t.outcome, t.left)}
      </>
    )
  }

  return (
    <Frame name="lselim">
      <div className="chips">
        {STEP_PRESETS.map((p, i) => {
          const on = t1 === p.e1 && t2 === p.e2
          return (
            <button
              key={i}
              className={`chip ghost ${on ? 'on' : ''}`}
              onClick={() => {
                setT1(p.e1)
                setT2(p.e2)
              }}
              aria-pressed={on}
            >
              {tc(p.name)}
            </button>
          )
        })}
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 12 }}>
        <EqBox label="1)" value={t1} set={setT1} />
        <EqBox label="2)" value={t2} set={setT2} />
      </div>
      <div className="chips" role="group" aria-label={tc(L('Method', 'Metode'))}>
        {(
          [
            ['elim', L('elimination', 'eliminasi')],
            ['sub', L('substitution', 'substitusi')],
            ['cramer', L('Cramer’s rule', 'aturan Cramer')],
          ] as [Method, Loc][]
        ).map(([m, name]) => (
          <button key={m} className={`chip ${method === m ? 'on' : ''}`} onClick={() => setMethod(m)} aria-pressed={method === m}>
            {tc(name)}
          </button>
        ))}
        {method === 'elim' && (
          <>
            <span className="small muted" style={{ alignSelf: 'center' }}>
              {tc(L('eliminate', 'eliminasi'))}
            </span>
            {(['auto', 'x', 'y'] as const).map((v) => (
              <button key={v} className={`chip ghost ${gone === v ? 'on' : ''}`} onClick={() => setGone(v)} aria-pressed={gone === v}>
                {v === 'auto' ? tc(L('easiest', 'termudah')) : v}
              </button>
            ))}
          </>
        )}
      </div>
      <div className="wgtout" aria-live="polite">
        {s ? steps() : <p className="small muted">{tc(L('Fix the equation marked above to see the steps.', 'Perbaiki persamaan yang ditandai di atas untuk melihat langkahnya.'))}</p>}
        {s && sol && <p className="small muted">{tc(L('Whatever the method, the answer is the same: ', 'Apa pun metodenya, jawabannya sama: '))}{sol.kind === 'unique' ? `x = ${ratPlain(sol.x)}, y = ${ratPlain(sol.y)}` : sol.kind === 'none' ? tc(L('no solution', 'tidak ada penyelesaian')) : tc(L('infinitely many solutions', 'tak terhingga penyelesaian'))}.</p>}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------- almost parallel lines */

/** An angle in degrees: with two decimals when it is not tiny, in scientific notation when it is. */
function angleText(x: number, sep: string): string {
  return (x >= 0.01 ? x.toFixed(2) : x.toExponential(2)).replace('.', sep)
}

export function LinSysIll() {
  const { tc } = useI18n()
  const sep = useSep()
  const [k, setK] = useState(6)
  const [m, setM] = useState(9)
  const eps = ratDiv(ONE, Q(10n ** BigInt(k)))
  const delta = ratDiv(ONE, Q(10n ** BigInt(m)))
  const np = nearParallel(eps, delta)
  const epsD = 10 ** -k
  const deltaD = 10 ** -m
  const f = solveFloat(1, 1, 2, 1, 1 + epsD, 2 + deltaD)
  const f0 = solveFloat(1, 1, 2, 1, 1 + epsD, 2)
  const cond = cond1(1, 1, 1, 1 + epsD)
  const d = (r: Rat, places = 12): string => roundedDecimal(r, places).replace('.', sep)
  const num = (x: number): string => (Number.isFinite(x) ? Number(x.toPrecision(12)).toString().replace('.', sep) : tc(L('not a number', 'bukan bilangan')))
  const lost = f.D === 0
  return (
    <Frame name="lsill">
      <label className="lbl slider">
        <Tex src="\varepsilon" /> = 10<sup>−{k}</sup>
        <input type="range" min={1} max={17} step={1} value={k} aria-label="epsilon" onChange={(e) => setK(Number(e.target.value))} />
      </label>
      <label className="lbl slider">
        <Tex src="\delta" /> = 10<sup>−{m}</sup>
        <input type="range" min={2} max={14} step={1} value={m} aria-label="delta" onChange={(e) => setM(Number(e.target.value))} />
      </label>
      <p className="small" style={{ overflowX: 'auto' }}>
        <Tex src={`\\begin{cases} x+y=2 \\\\ x+(1+\\varepsilon)\\,y=2+\\delta \\end{cases}`} />
      </p>
      <div className="wgtout" aria-live="polite">
        {np && (
          <div style={{ overflowX: 'auto' }}>
            <table className="rtable">
              <thead>
                <tr>
                  <th />
                  <th>{tc(L('δ = 0 (the right-hand side as given)', 'δ = 0 (ruas kanan apa adanya)'))}</th>
                  <th>{tc(L('δ as set: the right-hand side nudged', 'δ seperti diatur: ruas kanan digeser sedikit'))}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{tc(L('exact y', 'y eksak'))}</td>
                  <td>0</td>
                  <td>
                    <b>{d(np.exact.y)}</b>
                  </td>
                </tr>
                <tr>
                  <td>{tc(L('exact x', 'x eksak'))}</td>
                  <td>2</td>
                  <td>
                    <b>{d(np.exact.x)}</b>
                  </td>
                </tr>
                <tr>
                  <td>{tc(L('double precision', 'presisi ganda'))}</td>
                  <td>{lost ? '–' : `(${num(f0.x)}; ${num(f0.y)})`}</td>
                  <td>
                    <b>{lost ? tc(L('D = 0: the computer cannot tell the lines apart', 'D = 0: komputer tak dapat membedakan kedua garis')) : `(${num(f.x)}; ${num(f.y)})`}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          {tc(L(`The lines meet at an angle of just ${np ? angleText(np.angle, sep) : '–'}°. Nudging one right-hand side by δ = 10^−${m} moves the answer by δ/ε = ${np ? d(np.moved, 3) : '–'}, which is 1/ε = 10^${k} times the nudge.`, `Kedua garis berpotongan dengan sudut hanya ${np ? angleText(np.angle, sep) : '–'}°. Menggeser satu ruas kanan sebesar δ = 10^−${m} memindahkan jawabannya sebesar δ/ε = ${np ? d(np.moved, 3) : '–'}, yaitu 1/ε = 10^${k} kali geseran itu.`))}
        </p>
        <p className="small muted">
          {tc(L('Amplification (the condition number of the coefficients):', 'Faktor pembesaran (bilangan kondisi koefisien):'))} <b>{Number.isFinite(cond) ? cond.toExponential(2).replace('.', sep) : '∞'}</b>
        </p>
        {lost && (
          <p className="badline">
            {tc(L(`In double precision 1 + ε is exactly 1 when ε is below about 10⁻¹⁶, so both equations look identical and D = 0. Exact fractions do not lose it.`, `Dalam presisi ganda 1 + ε tepat 1 bila ε di bawah sekitar 10⁻¹⁶, sehingga kedua persamaan tampak sama dan D = 0. Pecahan eksak tidak kehilangannya.`))}
          </p>
        )}
      </div>
    </Frame>
  )
}
