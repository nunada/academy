import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import type { WidgetName } from '../../content/articles/types'
import { MATH_FUNCS, evaluate } from '../../lib/expr'
import {
  expand,
  fromRepeating,
  parseRational,
  ratCmp,
  ratMid,
  ratText,
  sqrt2Digits,
  type Rat,
} from '../../lib/realnum'
import { Tex } from '../ui'
import { Frame, L, dec, useSep } from './widgetKit'
import { ChineseConvert, ChineseGrouping, ChineseRead, ChineseRods } from './ChineseWidgets'
import { GeometricDetector, GeometricExplorer, GeometricSum, GeometricTwoTerms } from './GeometricWidgets'
import { GaussPairing, SequenceDetector, SequenceExplorer, TwoTerms } from './SequenceWidgets'
import { BaseConverter, BinaryArithmetic, BinaryFraction, BitEditor, BitwiseOperations } from './BinaryWidgets'
import { Convergents, RootChecker, SurdCalculator } from './IrrationalWidgets'
import { CompareFractions, FractionBars, FractionCalculator, FractionToDecimal, SimplifyFraction } from './RationalWidgets'
import { DivisibilityRules, DivisionWithRemainder, GcdLcm, IntegerNumberLine, IntegerOperations, PrimeFactoriser } from './IntegerWidgets'
import { AreaModel, EvaluateExpression, ExpandSimplify, ExpressionAnatomy, FactorWidget } from './AlgebraWidgets'
import { ExponentLaws, ExponentPattern, Rationalise, RootExponent, ScientificNotation, SimplifyRoot } from './PowerWidgets'

/* ------------------------------------------------------------------ sets */

type Zone = 'N' | 'W' | 'Z' | 'Q' | 'I'

/** Every set a number in this zone belongs to. */
const MEMBER_OF: Record<Zone, string[]> = {
  N: ['N', 'W', 'Z', 'Q', 'R'],
  W: ['W', 'Z', 'Q', 'R'],
  Z: ['Z', 'Q', 'R'],
  Q: ['Q', 'R'],
  I: ['I', 'R'],
}

const SET_NAMES: { id: string; sym: string; name: Loc }[] = [
  { id: 'N', sym: 'ℕ', name: L('natural', 'asli') },
  { id: 'W', sym: 'W', name: L('whole', 'cacah') },
  { id: 'Z', sym: 'ℤ', name: L('integers', 'bulat') },
  { id: 'Q', sym: 'ℚ', name: L('rational', 'rasional') },
  { id: 'I', sym: 'ℝ∖ℚ', name: L('irrational', 'irasional') },
  { id: 'R', sym: 'ℝ', name: L('real', 'real') },
]

interface Sample {
  label: Loc
  zone: Zone
  why: Loc
}

const SAMPLES: Sample[] = [
  { label: L('7', '7'), zone: 'N', why: L('7 is a counting number: 1, 2, 3, …', '7 adalah bilangan hitung: 1, 2, 3, …') },
  { label: L('√9', '√9'), zone: 'N', why: L('√9 = 3, so it is a natural number in disguise.', '√9 = 3, jadi ia adalah bilangan asli yang menyamar.') },
  { label: L('0', '0'), zone: 'W', why: L('0 is a whole number, but not a natural one: the natural numbers start at 1.', '0 adalah bilangan cacah, tetapi bukan bilangan asli: bilangan asli dimulai dari 1.') },
  { label: L('−4', '−4'), zone: 'Z', why: L('−4 is an integer with a sign; it is not a whole number.', '−4 adalah bilangan bulat bertanda; ia bukan bilangan cacah.') },
  { label: L('2/3', '2/3'), zone: 'Q', why: L('A ratio of two integers that is not itself an integer: rational.', 'Perbandingan dua bilangan bulat yang bukan bilangan bulat: rasional.') },
  { label: L('0.75', '0,75'), zone: 'Q', why: L('0.75 = 3/4, a decimal that ends, so it is rational.', '0,75 = 3/4, desimal yang berhenti, jadi ia rasional.') },
  { label: L('0.333…', '0,333…'), zone: 'Q', why: L('A repeating decimal equals a fraction: 0.333… = 1/3.', 'Desimal berulang sama dengan sebuah pecahan: 0,333… = 1/3.') },
  { label: L('√2', '√2'), zone: 'I', why: L('√2 cannot be written as a fraction of integers: it is irrational.', '√2 tidak dapat ditulis sebagai pecahan bilangan bulat: ia irasional.') },
  { label: L('π', 'π'), zone: 'I', why: L('π is irrational (proved by Lambert in 1761).', 'π adalah bilangan irasional (dibuktikan oleh Lambert pada 1761).') },
  { label: L('e', 'e'), zone: 'I', why: L('Euler’s number e is irrational (proved by Euler in 1737).', 'Bilangan Euler e adalah irasional (dibuktikan oleh Euler pada 1737).') },
]

/** Each box leaves a 20px ring below its inner neighbour, where its own name
 *  sits, so a label never lands under a marker. */
const BOX: Record<string, { x: number; y: number; w: number; h: number }> = {
  R: { x: 6, y: 6, w: 588, h: 268 },
  Q: { x: 20, y: 30, w: 384, h: 220 },
  Z: { x: 32, y: 52, w: 274, h: 174 },
  W: { x: 44, y: 72, w: 204, h: 134 },
  N: { x: 100, y: 90, w: 108, h: 100 },
}

/** Where a zone's markers go: a column of three, then another column. */
const ANCHOR: Record<Zone, { x: number }> = {
  N: { x: 154 },
  W: { x: 72 },
  Z: { x: 277 },
  Q: { x: 354 },
  I: { x: 462 },
}

/** Marker rows. Three fit between the labels at the top and the bottom. */
const ROWS = [112, 146, 180]

function SetsWidget() {
  const { tc } = useI18n()
  const [picked, setPicked] = useState<number[]>([])
  const last = picked.length ? SAMPLES[picked[picked.length - 1]] : null

  const place = (index: number) => {
    const s = SAMPLES[index]
    const inZone = picked.filter((p) => SAMPLES[p].zone === s.zone)
    const k = inZone.indexOf(index)
    const a = ANCHOR[s.zone]
    return { x: a.x + Math.floor(k / 3) * 92, y: ROWS[k % 3] }
  }

  return (
    <Frame name="sets">
      <svg viewBox="0 0 600 280" className="setsvg" role="img" aria-label={tc(L('Nested number sets', 'Himpunan bilangan bersarang'))}>
        {(['R', 'Q', 'Z', 'W', 'N'] as const).map((id, i) => {
          const b = BOX[id]
          const nm = SET_NAMES.find((s) => s.id === id)!
          return (
            <g key={id}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={18} className={`setbox s${i}`} />
              <text x={b.x + 12} y={b.y + b.h - 6} className="setlabel">
                {nm.sym} {tc(nm.name)}
              </text>
            </g>
          )
        })}
        <text x={420} y={56} className="setlabel">
          ℝ∖ℚ {tc(SET_NAMES[4].name)}
        </text>
        {picked.map((p) => {
          const { x, y } = place(p)
          const label = tc(SAMPLES[p].label)
          // A pill as wide as its text, so "0.333…" is not cut off by a circle.
          const w = Math.max(34, label.length * 8.5 + 16)
          return (
            <g key={p} className={p === picked[picked.length - 1] ? 'mark on' : 'mark'}>
              <rect x={x - w / 2} y={y - 15} width={w} height={30} rx={15} />
              <text x={x} y={y + 5} textAnchor="middle">
                {label}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="chips" role="group" aria-label={tc(L('Numbers to place', 'Bilangan untuk ditempatkan'))}>
        {SAMPLES.map((s, i) => (
          <button
            key={i}
            className={picked.includes(i) ? 'chip on' : 'chip'}
            onClick={() => setPicked((p) => (p.includes(i) ? p : [...p, i]))}
          >
            {tc(s.label)}
          </button>
        ))}
        {picked.length > 0 && (
          <button className="chip ghost" onClick={() => setPicked([])}>
            {tc(L('Reset', 'Ulangi'))}
          </button>
        )}
      </div>

      <div className="wgtout" aria-live="polite">
        {last ? (
          <>
            <p>
              <b>{tc(last.label)}</b> — {tc(last.why)}
            </p>
            <p className="memberrow">
              {SET_NAMES.map((s) => (
                <span key={s.id} className={MEMBER_OF[last.zone].includes(s.id) ? 'mem yes' : 'mem no'}>
                  {s.sym} {MEMBER_OF[last.zone].includes(s.id) ? '✓' : '✗'}
                </span>
              ))}
            </p>
          </>
        ) : (
          <p className="muted">{tc(L('Tap a number above to place it.', 'Ketuk sebuah bilangan di atas untuk menempatkannya.'))}</p>
        )}
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------- classify */

const CHOICES: { zone: Zone; sym: string; name: Loc }[] = [
  { zone: 'N', sym: 'ℕ', name: L('natural', 'asli') },
  { zone: 'W', sym: 'W', name: L('whole', 'cacah') },
  { zone: 'Z', sym: 'ℤ', name: L('integer', 'bulat') },
  { zone: 'Q', sym: 'ℚ', name: L('rational', 'rasional') },
  { zone: 'I', sym: 'ℝ∖ℚ', name: L('irrational', 'irasional') },
]

const ITEMS: Sample[] = [
  { label: L('7', '7'), zone: 'N', why: L('7 is a counting number, so ℕ is the smallest set that holds it.', '7 adalah bilangan hitung, jadi ℕ adalah himpunan terkecil yang memuatnya.') },
  { label: L('√16', '√16'), zone: 'N', why: L('√16 = 4, a counting number. A root sign does not make a number irrational.', '√16 = 4, sebuah bilangan hitung. Tanda akar tidak otomatis membuat bilangan irasional.') },
  { label: L('0', '0'), zone: 'W', why: L('0 is whole but not natural.', '0 adalah bilangan cacah tetapi bukan bilangan asli.') },
  { label: L('−5', '−5'), zone: 'Z', why: L('A negative whole amount: an integer, but not a whole number.', 'Bilangan bulat negatif: termasuk bilangan bulat, tetapi bukan bilangan cacah.') },
  { label: L('0.252525… (25 repeats)', '0,252525… (25 berulang)'), zone: 'Q', why: L('It repeats, so it is a fraction: 25/99.', 'Desimalnya berulang, jadi ia sebuah pecahan: 25/99.') },
  { label: L('22/7', '22/7'), zone: 'Q', why: L('A fraction of two integers is rational, even though it is only close to π.', 'Pecahan dua bilangan bulat adalah rasional, meskipun hanya mendekati π.') },
  { label: L('1.4142', '1,4142'), zone: 'Q', why: L('It ends, so it is 14142/10000. √2 only begins 1.4142…', 'Desimalnya berhenti, jadi ia 14142/10000. √2 hanya diawali 1,4142…') },
  { label: L('√7', '√7'), zone: 'I', why: L('7 is not a perfect square, so √7 is irrational.', '7 bukan kuadrat sempurna, jadi √7 irasional.') },
  { label: L('π', 'π'), zone: 'I', why: L('π is irrational: its decimals never end and never repeat.', 'π irasional: desimalnya tidak berhenti dan tidak berulang.') },
  { label: L('0.1010010001… (one more 0 each time)', '0,1010010001… (nol bertambah satu tiap kali)'), zone: 'I', why: L('The pattern never repeats a block, so it is not a fraction: irrational.', 'Polanya tidak pernah mengulang sekelompok angka, jadi bukan pecahan: irasional.') },
]

function ClassifyWidget() {
  const { tc } = useI18n()
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<(Zone | null)[]>(() => ITEMS.map(() => null))
  const done = i >= ITEMS.length
  const score = answers.filter((a, k) => a === ITEMS[k].zone).length

  if (done) {
    return (
      <Frame name="classify">
        <div className="wgtout">
          <p>
            <b>
              {score} / {ITEMS.length}
            </b>{' '}
            {tc(L('correct.', 'benar.'))}{' '}
            {tc(
              score === ITEMS.length
                ? L('Every number in its place.', 'Semua bilangan di tempatnya.')
                : L('Look again at the ones with an explanation you did not expect.', 'Lihat lagi bilangan yang penjelasannya tidak kamu duga.'),
            )}
          </p>
          <button
            className="btn ghost sm"
            onClick={() => {
              setI(0)
              setAnswers(ITEMS.map(() => null))
            }}
          >
            {tc(L('Play again', 'Main lagi'))}
          </button>
        </div>
      </Frame>
    )
  }

  const item = ITEMS[i]
  const given = answers[i]
  return (
    <Frame name="classify">
      <p className="muted small">
        {i + 1} / {ITEMS.length} · {tc(L('Choose the smallest set that holds the number.', 'Pilih himpunan terkecil yang memuat bilangan itu.'))}
      </p>
      <div className="bignum">{tc(item.label)}</div>
      <div className="chips" role="group">
        {CHOICES.map((c) => {
          const state = given === null ? '' : c.zone === item.zone ? ' right' : c.zone === given ? ' wrong' : ''
          return (
            <button
              key={c.zone}
              className={`chip${state}`}
              disabled={given !== null}
              onClick={() => setAnswers((a) => a.map((v, k) => (k === i ? c.zone : v)))}
            >
              {c.sym} {tc(c.name)}
            </button>
          )
        })}
      </div>
      {given !== null && (
        <div className={given === item.zone ? 'verdict ok' : 'verdict no'} aria-live="polite">
          <b>{given === item.zone ? tc(L('Correct!', 'Benar!')) : tc(L('Not quite.', 'Belum tepat.'))}</b> {tc(item.why)}
          <div style={{ marginTop: 8 }}>
            <button className="btn sm" onClick={() => setI(i + 1)}>
              {i + 1 === ITEMS.length ? tc(L('See score', 'Lihat skor')) : tc(L('Next →', 'Lanjut →'))}
            </button>
          </div>
        </div>
      )}
    </Frame>
  )
}

/* --------------------------------------------------------------- decimal */

const PRESETS_DEC: [string, string][] = [
  ['1', '8'],
  ['1', '3'],
  ['1', '7'],
  ['3', '11'],
  ['5', '12'],
  ['22', '7'],
]

function DecimalWidget() {
  const { tc } = useI18n()
  const sep = useSep()
  const [num, setNum] = useState('5')
  const [den, setDen] = useState('12')

  const n = /^-?\d{1,5}$/.test(num.trim()) ? BigInt(num.trim()) : null
  const d = /^\d{1,5}$/.test(den.trim()) ? BigInt(den.trim()) : null
  const ex = n !== null && d !== null && d > 0n ? expand(n, d) : null

  const tail = ex ? (ex.rep ? (ex.pre + ex.rep.repeat(40)).slice(0, 36) : ex.pre) : ''

  return (
    <Frame name="decimal">
      <div className="inrow">
        <input aria-label={tc(L('Numerator', 'Pembilang'))} inputMode="numeric" value={num} onChange={(e) => setNum(e.target.value)} />
        <span className="slash">/</span>
        <input aria-label={tc(L('Denominator', 'Penyebut'))} inputMode="numeric" value={den} onChange={(e) => setDen(e.target.value)} />
      </div>
      <div className="chips">
        {PRESETS_DEC.map(([a, b]) => (
          <button key={a + b} className="chip" onClick={() => (setNum(a), setDen(b))}>
            {a}/{b}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {ex === null ? (
          <p className="muted">{tc(L('Enter a whole number over a positive whole number (up to 5 digits).', 'Masukkan bilangan bulat di atas bilangan bulat positif (maksimal 5 angka).'))}</p>
        ) : (
          <>
            <p className="bigdec">
              {ex.negative ? '−' : ''}
              {ex.whole}
              {(ex.pre || ex.rep) && sep}
              {ex.pre}
              {ex.rep && <span className="over">{ex.rep}</span>}
            </p>
            <p>
              {ex.terminating ? (
                <b>{tc(L('The decimal ends.', 'Desimalnya berhenti.'))}</b>
              ) : (
                <b>
                  {tc(L('The decimal repeats', 'Desimalnya berulang'))}
                  {ex.truncated ? '…' : ` — ${tc(L('block length', 'panjang kelompok angka'))} ${ex.rep.length}${ex.pre ? `, ${tc(L('after', 'setelah'))} ${ex.pre.length} ${tc(L('digit(s)', 'angka'))}` : ''}.`}
                </b>
              )}
            </p>
            {!ex.terminating && <p className="muted small">{dec(`${ex.negative ? '-' : ''}${ex.whole}.${tail}`, sep)}…</p>}
            <p className="small">
              {tc(L('Lowest terms', 'Bentuk paling sederhana'))}: <Tex src={`\\frac{${ex.reduced.n}}{${ex.reduced.d}}`} />;{' '}
              {tc(L('denominator', 'penyebut'))} <Tex src={`${ex.reduced.d}${ex.primes.length ? '=' + ex.primes.map(([p, e]) => (e > 1 ? `${p}^{${e}}` : `${p}`)).join('\\times ') : ''}`} />
            </p>
            <p className="small">
              {ex.primes.every(([p]) => p === 2n || p === 5n)
                ? tc(L('Only the primes 2 and 5 appear, so the decimal ends.', 'Hanya bilangan prima 2 dan 5 yang muncul, jadi desimalnya berhenti.'))
                : tc(L('A prime other than 2 and 5 appears, so the decimal cannot end: it repeats.', 'Ada bilangan prima selain 2 dan 5, jadi desimalnya tidak bisa berhenti: ia berulang.'))}
            </p>
          </>
        )}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------- repeat */

const PRESETS_REP: [string, string, string][] = [
  ['0', '', '3'],
  ['0', '41', '6'],
  ['1', '', '27'],
  ['0', '', '9'],
  ['0', '', '142857'],
]

function RepeatWidget() {
  const { tc } = useI18n()
  const sep = useSep()
  const [whole, setWhole] = useState('0')
  const [pre, setPre] = useState('41')
  const [rep, setRep] = useState('6')

  const digits = (s: string) => /^\d*$/.test(s)
  const ok = digits(whole) && digits(pre) && digits(rep) && whole.length > 0 && whole.length <= 6 && pre.length <= 8 && rep.length <= 8
  const res = ok ? fromRepeating(whole.replace(/^0+(?=\d)/, ''), pre, rep) : null
  const shown = (s: string) => dec(s, sep)

  return (
    <Frame name="repeat">
      <div className="inrow">
        <input aria-label={tc(L('Whole part', 'Bagian bulat'))} inputMode="numeric" value={whole} onChange={(e) => setWhole(e.target.value)} />
        <span className="slash">{sep}</span>
        <input aria-label={tc(L('Digits that do not repeat', 'Angka yang tidak berulang'))} inputMode="numeric" value={pre} onChange={(e) => setPre(e.target.value)} placeholder={tc(L('fixed', 'tetap'))} />
        <span className="slash">(</span>
        <input aria-label={tc(L('Digits that repeat', 'Angka yang berulang'))} inputMode="numeric" value={rep} onChange={(e) => setRep(e.target.value)} placeholder={tc(L('repeats', 'berulang'))} />
        <span className="slash">)</span>
      </div>
      <div className="chips">
        {PRESETS_REP.map(([w, p, r]) => (
          <button key={w + p + r} className="chip" onClick={() => (setWhole(w), setPre(p), setRep(r))}>
            {shown(`${w}.${p}`)}
            <span className="over">{r}</span>
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {res === null ? (
          <p className="muted">{tc(L('Use digits only: a whole part, then the fixed digits, then the repeating digits.', 'Gunakan angka saja: bagian bulat, lalu angka tetap, lalu angka yang berulang.'))}</p>
        ) : res.m === 0 ? (
          <p>
            <Tex src={`x=${whole}.${pre || '0'}=\\frac{${res.lo}}{${10n ** BigInt(res.k)}}=\\frac{${res.value.n}}{${res.value.d}}`} />
          </p>
        ) : (
          <>
            <p className="small muted">
              {tc(L('Shift the point past the fixed digits, then past one repeating block, and subtract so the endless tails cancel.', 'Geser koma melewati angka tetap, lalu melewati satu kelompok angka yang berulang, kemudian kurangkan agar ekor tak berhingga saling meniadakan.'))}
            </p>
            <ul className="steps">
              <li>
                <Tex src={`10^{${res.k}}x=${res.lo}.\\overline{${rep}}`} />
              </li>
              <li>
                <Tex src={`10^{${res.k + res.m}}x=${res.hi}.\\overline{${rep}}`} />
              </li>
              <li>
                <Tex src={`(10^{${res.k + res.m}}-10^{${res.k}})\\,x=${res.hi}-${res.lo}\\;\\Rightarrow\\;${10n ** BigInt(res.k) * (10n ** BigInt(res.m) - 1n)}\\,x=${res.hi - res.lo}`} />
              </li>
              <li>
                <Tex src={`x=\\frac{${res.hi - res.lo}}{${10n ** BigInt(res.k) * (10n ** BigInt(res.m) - 1n)}}=\\frac{${res.value.n}}{${res.value.d}}`} />
              </li>
            </ul>
            {/^9+$/.test(rep) && pre === '' && <p className="small"><b>{tc(L('Yes: 0.999… really equals 1.', 'Ya: 0,999… memang sama dengan 1.'))}</b></p>}
          </>
        )}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------- sqrt2 */

/** `v / 10^k` written out: v = 14142, k = 4 gives "1.4142". */
function scaled(v: bigint, k: number): string {
  const s = v.toString().padStart(k + 1, '0')
  return k === 0 ? s : `${s.slice(0, -k)}.${s.slice(-k)}`
}

function Sqrt2Widget() {
  const { tc } = useI18n()
  const sep = useSep()
  const MAX = 10
  const [k, setK] = useState(0) // decimals found so far
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null)

  const s = BigInt(sqrt2Digits(k))
  const next = BigInt(sqrt2Digits(k + 1)) % 10n

  function pick(d: number) {
    const cand = s * 10n + BigInt(d)
    const sq = scaled(cand * cand, 2 * (k + 1))
    if (BigInt(d) === next) {
      setK(k + 1)
      const up = cand + 1n
      setNote({
        ok: true,
        text: `${scaled(cand, k + 1)}² = ${sq} < 2 < ${scaled(up * up, 2 * (k + 1))} = ${scaled(up, k + 1)}²`,
      })
    } else if (BigInt(d) > next) {
      setNote({ ok: false, text: tc(L(`${scaled(cand, k + 1)}² = ${sq} is more than 2: the digit is too big.`, `${scaled(cand, k + 1)}² = ${sq} lebih dari 2: angkanya terlalu besar.`)) })
    } else {
      setNote({ ok: false, text: tc(L(`${scaled(cand, k + 1)}² = ${sq} is less than 2, but a bigger digit still stays under 2: too small.`, `${scaled(cand, k + 1)}² = ${sq} kurang dari 2, tetapi angka yang lebih besar masih di bawah 2: terlalu kecil.`)) })
    }
  }

  return (
    <Frame name="sqrt2">
      <p className="bigdec">
        √2 ≈ {dec(scaled(s, k), sep)}
        {k < MAX ? '…' : ''}
      </p>
      {k < MAX ? (
        <>
          <p className="muted small">{tc(L('Pick the next digit: the largest one whose square is still at most 2.', 'Pilih angka berikutnya: yang terbesar dengan kuadrat yang masih tidak lebih dari 2.'))}</p>
          <div className="chips digits">
            {Array.from({ length: 10 }, (_, d) => (
              <button key={d} className="chip" onClick={() => pick(d)}>
                {d}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>
          <b>{tc(L(`${MAX} decimals and still going.`, `${MAX} desimal dan masih berlanjut.`))}</b>{' '}
          {tc(L('The digits of √2 never end and never fall into a repeating block. That is what irrational means.', 'Angka-angka √2 tidak pernah berhenti dan tidak memiliki pola angka yang berulang secara periodik. Itulah arti irasional.'))}
        </p>
      )}
      <div className="wgtout" aria-live="polite">
        {note && <p className={note.ok ? 'okline' : 'noline'}>{dec(note.text, sep)}</p>}
      </div>
      {k > 0 && (
        <button className="btn ghost sm" onClick={() => (setK(0), setNote(null))}>
          {tc(L('Start over', 'Mulai lagi'))}
        </button>
      )}
    </Frame>
  )
}

/* --------------------------------------------------------------- density */

function DensityWidget() {
  const { tc } = useI18n()
  const sep = useSep()
  const [aText, setA] = useState('1/3')
  const [bText, setB] = useState('1/2')
  const [count, setCount] = useState(3)

  const a = parseRational(aText)
  const b = parseRational(bText)
  const [lo, hi]: (Rat | null)[] = a && b ? (ratCmp(a, b) <= 0 ? [a, b] : [b, a]) : [null, null]
  const valid = lo && hi && ratCmp(lo, hi) < 0

  const mids = useMemo(() => {
    if (!valid) return [] as Rat[]
    const out: Rat[] = []
    let left = lo
    for (let i = 0; i < count; i++) {
      const m = ratMid(left, hi)
      out.push(m)
      left = m
    }
    return out
  }, [valid, lo, hi, count])

  const toNum = (r: Rat) => Number(r.n) / Number(r.d)
  const irr = valid ? toNum(lo) + (toNum(hi) - toNum(lo)) / Math.SQRT2 : NaN

  const width = 560
  const pos = (r: Rat) => 20 + ((toNum(r) - toNum(lo!)) / (toNum(hi!) - toNum(lo!))) * (width - 40)

  return (
    <Frame name="density">
      <div className="inrow">
        <input aria-label={tc(L('First number', 'Bilangan pertama'))} value={aText} onChange={(e) => setA(e.target.value)} />
        <span className="slash">&lt;</span>
        <input aria-label={tc(L('Second number', 'Bilangan kedua'))} value={bText} onChange={(e) => setB(e.target.value)} />
      </div>
      <p className="muted small">{tc(L('Type whole numbers, decimals or fractions such as 1/3.', 'Ketik bilangan bulat, desimal, atau pecahan seperti 1/3.'))}</p>
      {valid ? (
        <>
          <svg viewBox={`0 0 ${width} 70`} className="densvg" role="img" aria-label={tc(L('Midpoints on a number line', 'Titik-titik tengah pada garis bilangan'))}>
            <line x1={20} y1={36} x2={width - 20} y2={36} className="nline" />
            {[lo!, ...mids, hi!].map((r, i, arr) => (
              <g key={i} className={i === 0 || i === arr.length - 1 ? 'dp end' : 'dp'}>
                <circle cx={pos(r)} cy={36} r={i === 0 || i === arr.length - 1 ? 6 : 4} />
              </g>
            ))}
          </svg>
          <ul className="steps">
            {mids.map((m, i) => (
              <li key={i}>
                <b>m{i + 1}</b> = {ratText(m)} ≈ {dec(toNum(m).toPrecision(8).replace(/\.?0+$/, ''), sep)}
              </li>
            ))}
          </ul>
          <div className="row" style={{ gap: 8 }}>
            {count < 12 && (
              <button className="btn sm" onClick={() => setCount(count + 1)}>
                {tc(L('Add another midpoint', 'Tambah titik tengah lagi'))}
              </button>
            )}
            <button className="btn ghost sm" onClick={() => setCount(3)}>
              {tc(L('Reset', 'Ulangi'))}
            </button>
          </div>
          <p className="small" style={{ marginTop: 10 }}>
            {tc(L('An irrational number fits between them too: ', 'Bilangan irasional juga muat di antara keduanya: '))}
            <Tex src="a+\frac{b-a}{\sqrt2}" /> ≈ {dec(irr.toPrecision(8), sep)}
          </p>
        </>
      ) : (
        <p className="muted">{tc(L('Choose two different numbers.', 'Pilih dua bilangan yang berbeda.'))}</p>
      )}
    </Frame>
  )
}

/* -------------------------------------------------------------- interval */

function IntervalWidget() {
  const { tc } = useI18n()
  const sep = useSep()
  const [a, setA] = useState('-1')
  const [b, setB] = useState('3')
  const [lc, setLc] = useState(true)
  const [rc, setRc] = useState(false)
  const [negInf, setNegInf] = useState(false)
  const [posInf, setPosInf] = useState(false)

  const av = Number(a.replace(',', '.'))
  const bv = Number(b.replace(',', '.'))
  const okA = negInf || (a.trim() !== '' && Number.isFinite(av))
  const okB = posInf || (b.trim() !== '' && Number.isFinite(bv))
  const fmt = (v: number) => dec(String(v), sep).replace('-', '−')

  if (!okA || !okB) {
    return (
      <Frame name="interval">
        <IntervalInputs {...{ a, b, setA, setB, lc, rc, setLc, setRc, negInf, posInf, setNegInf, setPosInf }} />
        <p className="muted">{tc(L('Type a number for each finite end.', 'Ketik angka untuk tiap ujung yang berhingga.'))}</p>
      </Frame>
    )
  }

  const empty = !negInf && !posInf && (av > bv || (av === bv && !(lc && rc)))
  const left = negInf ? '(' : lc ? '[' : '('
  const right = posInf ? ')' : rc ? ']' : ')'
  const notation = empty ? '∅' : `${left}${negInf ? '−∞' : fmt(av)}, ${posInf ? '+∞' : fmt(bv)}${right}`
  const lo = negInf ? '' : `${fmt(av)} ${lc ? '≤' : '<'} `
  const hi = posInf ? '' : ` ${rc ? '≤' : '<'} ${fmt(bv)}`
  const builder =
    empty ? '∅' : `{ x ∈ ℝ | ${lo || ''}x${hi || ''} }`

  // The number line is drawn between the two ends, with room either side.
  const lowV = negInf ? (posInf ? -3 : bv - 4) : av
  const highV = posInf ? (negInf ? 3 : av + 4) : bv
  const span = Math.max(highV - lowV, 1)
  const min = lowV - span * 0.35
  const max = highV + span * 0.35
  const W = 560
  const X = (v: number) => 20 + ((v - min) / (max - min)) * (W - 40)

  return (
    <Frame name="interval">
      <IntervalInputs {...{ a, b, setA, setB, lc, rc, setLc, setRc, negInf, posInf, setNegInf, setPosInf }} />
      <div className="wgtout" aria-live="polite">
        <p>
          <b>{tc(L('Interval', 'Interval'))}:</b> <span className="mono">{notation}</span>
        </p>
        <p>
          <b>{tc(L('Set-builder', 'Pembentuk himpunan'))}:</b> <span className="mono">{builder}</span>
        </p>
      </div>
      <svg viewBox={`0 0 ${W} 70`} className="densvg" role="img" aria-label={tc(L('The interval on a number line', 'Interval pada garis bilangan'))}>
        <line x1={20} y1={40} x2={W - 20} y2={40} className="nline" />
        {!empty && <line x1={negInf ? 20 : X(av)} y1={40} x2={posInf ? W - 20 : X(bv)} y2={40} className="ivline" />}
        {!empty && !negInf && <circle cx={X(av)} cy={40} r={7} className={lc ? 'ivdot closed' : 'ivdot open'} />}
        {!empty && !posInf && <circle cx={X(bv)} cy={40} r={7} className={rc ? 'ivdot closed' : 'ivdot open'} />}
        {!empty && negInf && <text x={22} y={26} className="ivarrow">◀</text>}
        {!empty && posInf && <text x={W - 34} y={26} className="ivarrow">▶</text>}
      </svg>
    </Frame>
  )
}

function IntervalInputs(p: {
  a: string
  b: string
  setA: (s: string) => void
  setB: (s: string) => void
  lc: boolean
  rc: boolean
  setLc: (v: boolean) => void
  setRc: (v: boolean) => void
  negInf: boolean
  posInf: boolean
  setNegInf: (v: boolean) => void
  setPosInf: (v: boolean) => void
}) {
  const { tc } = useI18n()
  return (
    <div className="ivform">
      <div className="ivend">
        <input aria-label={tc(L('Left end', 'Ujung kiri'))} value={p.a} disabled={p.negInf} onChange={(e) => p.setA(e.target.value)} />
        <label className="check">
          <input type="checkbox" checked={p.lc} disabled={p.negInf} onChange={(e) => p.setLc(e.target.checked)} /> {tc(L('included', 'termasuk'))}
        </label>
        <label className="check">
          <input type="checkbox" checked={p.negInf} onChange={(e) => p.setNegInf(e.target.checked)} /> −∞
        </label>
      </div>
      <div className="ivend">
        <input aria-label={tc(L('Right end', 'Ujung kanan'))} value={p.b} disabled={p.posInf} onChange={(e) => p.setB(e.target.value)} />
        <label className="check">
          <input type="checkbox" checked={p.rc} disabled={p.posInf} onChange={(e) => p.setRc(e.target.checked)} /> {tc(L('included', 'termasuk'))}
        </label>
        <label className="check">
          <input type="checkbox" checked={p.posInf} onChange={(e) => p.setPosInf(e.target.checked)} /> +∞
        </label>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- floats */

const PRESETS_FLOAT: [string, string][] = [
  ['0.1 + 0.2', '0.3'],
  ['0.1 * 3', '0.3'],
  ['sqrt(2)^2', '2'],
  ['1/3 * 3', '1'],
  ['0.5 + 0.25', '0.75'],
  ['2^53 + 1', '2^53'],
]

function FloatsWidget() {
  const { tc } = useI18n()
  const [aText, setA] = useState('0.1 + 0.2')
  const [bText, setB] = useState('0.3')

  const calc = (s: string) => evaluate(s, { funcs: MATH_FUNCS })
  const a = calc(aText)
  const b = calc(bText)
  const both = a !== null && b !== null

  return (
    <Frame name="floats">
      <div className="inrow">
        <input aria-label={tc(L('Expression A', 'Ekspresi A'))} value={aText} onChange={(e) => setA(e.target.value)} />
        <span className="slash">=?</span>
        <input aria-label={tc(L('Expression B', 'Ekspresi B'))} value={bText} onChange={(e) => setB(e.target.value)} />
      </div>
      <div className="chips">
        {PRESETS_FLOAT.map(([x, y]) => (
          <button key={x} className="chip" onClick={() => (setA(x), setB(y))}>
            {x} = {y}
          </button>
        ))}
      </div>
      <p className="muted small">{tc(L('Use + − * / ^, brackets, and sqrt( ). Decimals use a point.', 'Pakai + − * / ^, tanda kurung, dan sqrt( ). Desimal memakai titik.'))}</p>
      <div className="wgtout" aria-live="polite">
        {!both ? (
          <p className="muted">{tc(L('Type two expressions I can calculate.', 'Ketik dua ekspresi yang bisa kuhitung.'))}</p>
        ) : (
          <>
            <table className="rtable">
              <thead>
                <tr>
                  <th />
                  <th>A</th>
                  <th>B</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{tc(L('17 significant digits', '17 angka signifikan'))}</td>
                  <td className="mono">{a.toPrecision(17)}</td>
                  <td className="mono">{b.toPrecision(17)}</td>
                </tr>
                <tr>
                  <td>{tc(L('Exact value stored', 'Nilai persis yang tersimpan'))}</td>
                  <td className="mono">{Math.abs(a) < 1e15 ? a.toFixed(30) : a.toString()}</td>
                  <td className="mono">{Math.abs(b) < 1e15 ? b.toFixed(30) : b.toString()}</td>
                </tr>
              </tbody>
            </table>
            <p>
              <code className="inline">A == B</code> → <b className={a === b ? 'okline' : 'noline'}>{a === b ? 'True' : 'False'}</b>
              {' · '}
              <code className="inline">|A − B|</code> = <span className="mono">{Math.abs(a - b).toExponential(3)}</span>
              {' · '}
              <code className="inline">|A − B| &lt; 1e-9</code> → <b className={Math.abs(a - b) < 1e-9 ? 'okline' : 'noline'}>{Math.abs(a - b) < 1e-9 ? 'True' : 'False'}</b>
            </p>
          </>
        )}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------- export */

export function ArticleWidget({ name }: { name: WidgetName }) {
  switch (name) {
    case 'sets':
      return <SetsWidget />
    case 'classify':
      return <ClassifyWidget />
    case 'decimal':
      return <DecimalWidget />
    case 'repeat':
      return <RepeatWidget />
    case 'sqrt2':
      return <Sqrt2Widget />
    case 'density':
      return <DensityWidget />
    case 'interval':
      return <IntervalWidget />
    case 'floats':
      return <FloatsWidget />
    case 'cnconvert':
      return <ChineseConvert />
    case 'cnread':
      return <ChineseRead />
    case 'grouping':
      return <ChineseGrouping />
    case 'rods':
      return <ChineseRods />
    case 'explaws':
      return <ExponentLaws />
    case 'exppattern':
      return <ExponentPattern />
    case 'simplifyroot':
      return <SimplifyRoot />
    case 'rationalise':
      return <Rationalise />
    case 'rootexp':
      return <RootExponent />
    case 'scinot':
      return <ScientificNotation />
    case 'terms':
      return <ExpressionAnatomy />
    case 'expand':
      return <ExpandSimplify />
    case 'evalexpr':
      return <EvaluateExpression />
    case 'areamodel':
      return <AreaModel />
    case 'factor':
      return <FactorWidget />
    case 'intline':
      return <IntegerNumberLine />
    case 'intops':
      return <IntegerOperations />
    case 'divmod':
      return <DivisionWithRemainder />
    case 'divrules':
      return <DivisibilityRules />
    case 'primefactor':
      return <PrimeFactoriser />
    case 'gcdlcm':
      return <GcdLcm />
    case 'fracbars':
      return <FractionBars />
    case 'simplify':
      return <SimplifyFraction />
    case 'ratcompare':
      return <CompareFractions />
    case 'ratops':
      return <FractionCalculator />
    case 'ratdecimal':
      return <FractionToDecimal />
    case 'rootcheck':
      return <RootChecker />
    case 'surdcalc':
      return <SurdCalculator />
    case 'convergents':
      return <Convergents />
    case 'baseconv':
      return <BaseConverter />
    case 'binarith':
      return <BinaryArithmetic />
    case 'bitedit':
      return <BitEditor />
    case 'bitops':
      return <BitwiseOperations />
    case 'binfrac':
      return <BinaryFraction />
    case 'arithseq':
      return <SequenceExplorer />
    case 'arithdetect':
      return <SequenceDetector />
    case 'gauss':
      return <GaussPairing />
    case 'twoterms':
      return <TwoTerms />
    case 'geodetect':
      return <GeometricDetector />
    case 'geoseq':
      return <GeometricExplorer />
    case 'geotwo':
      return <GeometricTwoTerms />
    case 'geosum':
      return <GeometricSum />
  }
}

