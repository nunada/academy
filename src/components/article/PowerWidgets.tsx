import { useState, type ReactNode } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { parseRational, rat, ratText, type Rat } from '../../lib/realnum'
import {
  fromScientific,
  ratPow,
  rationaliseConjugate,
  rationaliseSimple,
  simplifyRoot,
  toScientific,
} from '../../lib/powers'
import { Tex } from '../ui'
import { Frame, L, dec, useSep } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const mul = (a: Rat, b: Rat): Rat => rat(a.n * b.n, a.d * b.d)
const div = (a: Rat, b: Rat): Rat | null => (b.n === 0n ? null : rat(a.n * b.d, a.d * b.n))

/** A fraction as TeX: `-\frac{3}{4}`, or just `5`. */
function ratTex(r: Rat): string {
  const neg = r.n < 0n
  const n = neg ? -r.n : r.n
  return r.d === 1n ? `${r.n}` : `${neg ? '-' : ''}\\frac{${n}}{${r.d}}`
}

/** A base ready to carry an exponent: negatives and fractions get brackets. */
function baseTex(r: Rat): string {
  if (r.d === 1n) return r.n < 0n ? `(${r.n})` : `${r.n}`
  return `\\left(${ratTex(r)}\\right)`
}

/** A small rational the reader may type: an integer or fraction, kept small so
 *  the exact results stay readable. */
function small(text: string): Rat | null {
  const r = parseRational(text)
  if (!r) return null
  const lim = 99n
  return (r.n < 0n ? -r.n : r.n) <= lim && r.d <= lim ? r : null
}

const smallInt = (text: string, lo: number, hi: number): number | null => {
  if (!/^-?\d{1,3}$/.test(text.trim())) return null
  const v = Number(text)
  return v >= lo && v <= hi ? v : null
}

/** `√` with an index when there is one: `\sqrt[3]{54}`; plain `\sqrt{72}` for squares. */
const rootTex = (index: number, radicand: bigint | string): string => (index === 2 ? `\\sqrt{${radicand}}` : `\\sqrt[${index}]{${radicand}}`)

/** `6\sqrt{2}`, `\sqrt{2}`, or just `6`: a coefficient with a root, in simplest form. */
function surdTex(coef: bigint, index: number, rad: bigint): string {
  if (rad === 1n) return `${coef}`
  return `${coef === 1n ? '' : coef}${rootTex(index, rad)}`
}

/* -------------------------------------------------------------------- laws */

interface LawResult {
  left: string
  right: string
  lv: Rat | null
  rv: Rat | null
}

const LAWS: { id: string; name: Loc; needsB: boolean; needsM: boolean; rule: string }[] = [
  { id: 'product', name: L('Product', 'Perkalian'), needsB: false, needsM: true, rule: String.raw`a^m\cdot a^n=a^{m+n}` },
  { id: 'quotient', name: L('Quotient', 'Pembagian'), needsB: false, needsM: true, rule: String.raw`\frac{a^m}{a^n}=a^{m-n}` },
  { id: 'power', name: L('Power of a power', 'Pangkat dari pangkat'), needsB: false, needsM: true, rule: String.raw`(a^m)^n=a^{mn}` },
  { id: 'prod', name: L('Power of a product', 'Pangkat dari perkalian'), needsB: true, needsM: false, rule: String.raw`(ab)^n=a^nb^n` },
  { id: 'quot', name: L('Power of a quotient', 'Pangkat dari pembagian'), needsB: true, needsM: false, rule: String.raw`\left(\frac{a}{b}\right)^n=\frac{a^n}{b^n}` },
]

function evaluate(law: string, A: Rat, B: Rat, m: number, n: number): LawResult | null {
  const a = baseTex(A)
  const b = baseTex(B)
  const p = (r: Rat | null, e: number) => (r === null ? null : ratPow(r, e))
  switch (law) {
    case 'product':
      return {
        left: `${a}^{${m}}\\cdot ${a}^{${n}}`,
        right: `${a}^{${m + n}}`,
        lv: (() => {
          const x = ratPow(A, m)
          const y = ratPow(A, n)
          return x && y ? mul(x, y) : null
        })(),
        rv: ratPow(A, m + n),
      }
    case 'quotient':
      return {
        left: `\\frac{${a}^{${m}}}{${a}^{${n}}}`,
        right: `${a}^{${m - n}}`,
        lv: (() => {
          const x = ratPow(A, m)
          const y = ratPow(A, n)
          return x && y ? div(x, y) : null
        })(),
        rv: ratPow(A, m - n),
      }
    case 'power':
      return { left: `\\left(${a}^{${m}}\\right)^{${n}}`, right: `${a}^{${m * n}}`, lv: p(ratPow(A, m), n), rv: ratPow(A, m * n) }
    case 'prod':
      return {
        left: `\\left(${a}\\cdot ${b}\\right)^{${n}}`,
        right: `${a}^{${n}}\\cdot ${b}^{${n}}`,
        lv: ratPow(mul(A, B), n),
        rv: (() => {
          const x = ratPow(A, n)
          const y = ratPow(B, n)
          return x && y ? mul(x, y) : null
        })(),
      }
    default: {
      const q = div(A, B)
      return {
        left: `\\left(\\frac{${ratTex(A)}}{${ratTex(B)}}\\right)^{${n}}`,
        right: `\\frac{${a}^{${n}}}{${b}^{${n}}}`,
        lv: q ? ratPow(q, n) : null,
        rv: (() => {
          const x = ratPow(A, n)
          const y = ratPow(B, n)
          return x && y ? div(x, y) : null
        })(),
      }
    }
  }
}

export function ExponentLaws() {
  const { tc } = useI18n()
  const [law, setLaw] = useState('product')
  const [aT, setA] = useState('2')
  const [bT, setB] = useState('3')
  const [mT, setM] = useState('3')
  const [nT, setN] = useState('4')
  const def = LAWS.find((l) => l.id === law)!

  const A = small(aT)
  const B = small(bT)
  const m = smallInt(mT, -6, 6)
  const n = smallInt(nT, -6, 6)
  const ready = A && n !== null && (!def.needsM || m !== null) && (!def.needsB || B)
  const r = ready ? evaluate(law, A!, B ?? A!, m ?? 0, n!) : null
  const equal = r && r.lv && r.rv && ratText(r.lv) === ratText(r.rv)
  const show = (v: Rat | null) => (v === null ? tc(L('undefined', 'tidak terdefinisi')) : null)

  const random = () => {
    const pick = (lo: number, hi: number) => String(lo + Math.floor(Math.random() * (hi - lo + 1)))
    setA(pick(2, 5))
    setB(pick(2, 6))
    setM(pick(-3, 5))
    setN(pick(-3, 5))
  }

  return (
    <Frame name="explaws">
      <div className="chips" role="group">
        {LAWS.map((l) => (
          <button key={l.id} className={law === l.id ? 'chip on' : 'chip'} onClick={() => setLaw(l.id)}>
            {tc(l.name)}
          </button>
        ))}
      </div>
      <p className="lawrule">
        <Tex src={def.rule} />
      </p>
      <div className="inrow">
        <label className="lbl">
          a <input aria-label="a" value={aT} onChange={(e) => setA(e.target.value)} />
        </label>
        {def.needsB && (
          <label className="lbl">
            b <input aria-label="b" value={bT} onChange={(e) => setB(e.target.value)} />
          </label>
        )}
        {def.needsM && (
          <label className="lbl">
            m <input aria-label="m" value={mT} onChange={(e) => setM(e.target.value)} />
          </label>
        )}
        <label className="lbl">
          n <input aria-label="n" value={nT} onChange={(e) => setN(e.target.value)} />
        </label>
        <button className="chip" onClick={random}>
          🎲 {tc(L('Try others', 'Coba yang lain'))}
        </button>
      </div>
      <div className="wgtout" aria-live="polite">
        {r === null ? (
          <p className="muted">
            {tc(
              L(
                'Use whole numbers or fractions up to 99 for a and b, and whole numbers from −6 to 6 for m and n.',
                'Pakai bilangan bulat atau pecahan sampai 99 untuk a dan b, dan bilangan bulat dari −6 sampai 6 untuk m dan n.',
              ),
            )}
          </p>
        ) : (
          <>
            <p>
              <Tex src={`${r.left}=${r.lv ? ratTex(r.lv) : '\\text{?}'}`} />
              {show(r.lv) && <span className="noline"> {show(r.lv)}</span>}
            </p>
            <p>
              <Tex src={`${r.right}=${r.rv ? ratTex(r.rv) : '\\text{?}'}`} />
              {show(r.rv) && <span className="noline"> {show(r.rv)}</span>}
            </p>
            <p className={equal ? 'okline' : 'noline'}>
              <b>{equal ? tc(L('Both sides are exactly equal.', 'Kedua ruas persis sama.')) : tc(L('The rule needs a non-zero base here, so one side is undefined.', 'Aturan ini butuh basis tak nol di sini, sehingga salah satu ruas tidak terdefinisi.'))}</b>
            </p>
          </>
        )}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------ pattern */

export function ExponentPattern() {
  const { tc } = useI18n()
  const [bT, setB] = useState('2')
  const B = small(bT)
  const valid = B && B.n !== 0n
  const rows = valid ? [5, 4, 3, 2, 1, 0, -1, -2, -3, -4].map((k) => ({ k, v: ratPow(B!, k)! })) : []

  return (
    <Frame name="exppattern">
      <div className="inrow">
        <label className="lbl">
          {tc(L('base', 'basis'))} <input aria-label={tc(L('base', 'basis'))} value={bT} onChange={(e) => setB(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {['2', '3', '5', '10', '1/2'].map((p) => (
          <button key={p} className={bT === p ? 'chip on' : 'chip'} onClick={() => setB(p)}>
            {p}
          </button>
        ))}
      </div>
      {!valid ? (
        <p className="muted">{tc(L('Type a non-zero whole number or fraction.', 'Ketik bilangan bulat atau pecahan yang bukan nol.'))}</p>
      ) : (
        <div className="patgrid">
          {rows.map((row, i) => (
            <div key={row.k} className={row.k === 0 ? 'patrow zero' : 'patrow'}>
              <span className="patexp">
                <Tex src={`${baseTex(B!)}^{${row.k}}`} />
              </span>
              <span className="pateq">=</span>
              <span className="patval">
                <Tex src={ratTex(row.v)} />
              </span>
              {i < rows.length - 1 && (
                <span className="patstep">
                  ↓ {tc(L('divide by', 'bagi dengan'))} <Tex src={ratTex(B!)} />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="muted small">
        {tc(
          L(
            'Each step down divides by the base. Carrying on past 1 gives the only values that keep the laws working: a⁰ = 1, then 1/a, 1/a², …',
            'Setiap langkah ke bawah membagi dengan basis. Melanjutkan melewati 1 memberi satu-satunya nilai yang menjaga hukum-hukum tetap berlaku: a⁰ = 1, lalu 1/a, 1/a², …',
          ),
        )}
      </p>
    </Frame>
  )
}

/* ----------------------------------------------------------------- simplify */

const SIMPLE_N = ['72', '50', '200', '16', '48', '1000']

export function SimplifyRoot() {
  const { tc } = useI18n()
  const sep = useSep()
  const [nT, setN] = useState('72')
  const [k, setK] = useState(2)
  const digits = nT.replace(/[\s.,]/g, '')
  const valid = /^[1-9]\d{0,11}$/.test(digits)
  const n = valid ? BigInt(digits) : 1n
  const r = valid ? simplifyRoot(n, k) : null
  const factorTex = r ? (r.factors.length ? r.factors.map(([p, e]) => (e > 1 ? `${p}^{${e}}` : `${p}`)).join('\\cdot ') : '1') : ''
  const approx = valid ? dec(Number(n) ** (1 / k) === Math.round(Number(n) ** (1 / k)) ? String(Math.round(Number(n) ** (1 / k))) : (Number(n) ** (1 / k)).toPrecision(10), sep) : ''

  return (
    <Frame name="simplifyroot">
      <div className="inrow">
        <label className="lbl">
          {tc(L('number', 'bilangan'))} <input style={{ width: '10em' }} inputMode="numeric" value={nT} onChange={(e) => setN(e.target.value)} aria-label={tc(L('number', 'bilangan'))} />
        </label>
      </div>
      <div className="chips">
        {SIMPLE_N.map((p) => (
          <button key={p} className={digits === p ? 'chip on' : 'chip'} onClick={() => setN(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="chips" role="group" aria-label={tc(L('Index of the root', 'Indeks akar'))}>
        {[2, 3, 4, 5].map((i) => (
          <button key={i} className={k === i ? 'chip on' : 'chip'} onClick={() => setK(i)}>
            {i === 2 ? tc(L('square root', 'akar kuadrat')) : i === 3 ? tc(L('cube root', 'akar pangkat tiga')) : `${tc(L('root of index', 'akar berindeks'))} ${i}`}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {r === null ? (
          <p className="muted">{tc(L('Type a whole number from 1 to 999,999,999,999.', 'Ketik bilangan bulat dari 1 sampai 999.999.999.999.'))}</p>
        ) : (
          <>
            <ul className="steps">
              <li>
                <Tex src={`${n}=${factorTex}`} />
              </li>
              <li>
                {tc(L(`Take out every group of ${k} equal primes:`, `Keluarkan setiap kelompok berisi ${k} bilangan prima yang sama:`))}{' '}
                <Tex src={`${rootTex(k, n)}=${rootTex(k, factorTex)}`} />
              </li>
              <li>
                <Tex src={`${rootTex(k, n)}=${surdTex(r.out, k, r.inside)}`} />
                {r.inside === 1n ? (
                  <span className="okline"> — {tc(L('a perfect power: the root is a whole number', 'pangkat sempurna: akarnya bilangan bulat'))}</span>
                ) : null}
              </li>
            </ul>
            <p className="small muted">≈ {approx}</p>
          </>
        )}
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------- rationalise */

/** `rational + irrational·√rad` as TeX, in the order a person writes it. */
function twoTermTex(rational: Rat, irrational: Rat, rad: bigint): string {
  const parts: string[] = []
  if (rational.n !== 0n) parts.push(ratTex(rational))
  if (irrational.n !== 0n) {
    const neg = irrational.n < 0n
    const nn = neg ? -irrational.n : irrational.n
    const coefTex = irrational.d === 1n ? (nn === 1n ? '' : `${nn}`) : `\\frac{${nn}}{${irrational.d}}`
    const term = `${coefTex}\\sqrt{${rad}}`
    parts.push(parts.length ? `${neg ? '-' : '+'}${term}` : `${neg ? '-' : ''}${term}`)
  }
  return parts.length ? parts.join('') : '0'
}

export function Rationalise() {
  const { tc } = useI18n()
  const sep = useSep()
  const [mode, setMode] = useState<'simple' | 'conj'>('simple')
  const [aT, setA] = useState('6')
  const [bT, setB] = useState('3')
  const [pT, setP] = useState('1')
  const [qT, setQ] = useState('2')
  const [sign, setSign] = useState<1 | -1>(1)

  const a = smallInt(aT, -99, 99)
  const b = smallInt(bT, 1, 999)
  const p = smallInt(pT, -99, 99)
  const q = smallInt(qT, 1, 999)
  const signChar = sign === 1 ? '+' : '-'

  let body: ReactNode
  if (mode === 'simple') {
    if (a === null || a === 0 || b === null) body = <p className="muted">{tc(L('Type a non-zero whole number a and a positive whole number b.', 'Ketik bilangan bulat a yang bukan nol dan bilangan bulat positif b.'))}</p>
    else {
      const s = rationaliseSimple(BigInt(a), BigInt(b))
      const approx = a / Math.sqrt(b)
      body = (
        <>
          <ul className="steps">
            <li>
              <Tex src={`\\frac{${a}}{\\sqrt{${b}}}=\\frac{${a}\\cdot\\sqrt{${b}}}{\\sqrt{${b}}\\cdot\\sqrt{${b}}}=\\frac{${a}\\sqrt{${b}}}{${b}}`} />
            </li>
            <li>
              {tc(L('Simplify the root and cancel:', 'Sederhanakan akarnya dan sederhanakan pecahannya:'))}{' '}
              <Tex src={`\\frac{${a}}{\\sqrt{${b}}}=${s.rad === 1n ? ratTex(s.coef) : twoTermTex(rat(0n, 1n), s.coef, s.rad)}`} />
            </li>
          </ul>
          <p className="small muted">≈ {dec(approx.toPrecision(10), sep)}</p>
        </>
      )
    }
  } else if (a === null || a === 0 || p === null || q === null) {
    body = <p className="muted">{tc(L('Type a non-zero whole number a, a whole number p and a positive whole number q.', 'Ketik bilangan bulat a yang bukan nol, bilangan bulat p, dan bilangan bulat positif q.'))}</p>
  } else {
    const r = rationaliseConjugate(BigInt(a), BigInt(p), sign, BigInt(q))
    const denomApprox = p + sign * Math.sqrt(q)
    body =
      r === null ? (
        <p className="noline">{tc(L('The denominator is 0, so the expression is undefined.', 'Penyebutnya 0, sehingga ekspresinya tidak terdefinisi.'))}</p>
      ) : (
        <>
          <ul className="steps">
            <li>
              {tc(L('Multiply top and bottom by the conjugate:', 'Kalikan pembilang dan penyebut dengan bentuk sekawannya:'))}{' '}
              <Tex src={`\\frac{${a}}{${p}${signChar}\\sqrt{${q}}}\\cdot\\frac{${p}${sign === 1 ? '-' : '+'}\\sqrt{${q}}}{${p}${sign === 1 ? '-' : '+'}\\sqrt{${q}}}`} />
            </li>
            <li>
              {tc(L('The bottom becomes a difference of squares:', 'Penyebutnya menjadi selisih kuadrat:'))}{' '}
              <Tex src={`(${p})^2-\\left(\\sqrt{${q}}\\right)^2=${p * p}-${q}=${r.denominator}`} />
            </li>
            <li>
              <Tex src={`=${twoTermTex(r.rational, r.irrational, r.rad)}`} />
              {r.rad === 1n && <span className="okline"> — {tc(L('q is a perfect square, so the answer is rational', 'q adalah kuadrat sempurna, jadi jawabannya rasional'))}</span>}
            </li>
          </ul>
          <p className="small muted">
            ≈ {dec((a / denomApprox).toPrecision(10), sep)}
          </p>
        </>
      )
  }

  return (
    <Frame name="rationalise">
      <div className="chips" role="group">
        <button className={mode === 'simple' ? 'chip on' : 'chip'} onClick={() => setMode('simple')}>
          <Tex src={String.raw`\frac{a}{\sqrt{b}}`} />
        </button>
        <button className={mode === 'conj' ? 'chip on' : 'chip'} onClick={() => setMode('conj')}>
          <Tex src={String.raw`\frac{a}{p\pm\sqrt{q}}`} />
        </button>
      </div>
      <div className="inrow">
        <label className="lbl">
          a <input aria-label="a" value={aT} onChange={(e) => setA(e.target.value)} />
        </label>
        {mode === 'simple' ? (
          <label className="lbl">
            b <input aria-label="b" value={bT} onChange={(e) => setB(e.target.value)} />
          </label>
        ) : (
          <>
            <label className="lbl">
              p <input aria-label="p" value={pT} onChange={(e) => setP(e.target.value)} />
            </label>
            <button className="chip" onClick={() => setSign(sign === 1 ? -1 : 1)} aria-label={tc(L('Switch plus and minus', 'Ganti plus dan minus'))}>
              {sign === 1 ? '+' : '−'}
            </button>
            <label className="lbl">
              q <input aria-label="q" value={qT} onChange={(e) => setQ(e.target.value)} />
            </label>
          </>
        )}
      </div>
      <div className="chips">
        {(mode === 'simple'
          ? [
              ['6', '3'],
              ['1', '2'],
              ['10', '5'],
              ['4', '8'],
            ]
          : [
              ['1', '1', '2'],
              ['3', '2', '5'],
              ['4', '3', '7'],
            ]
        ).map((c) => (
          <button
            key={c.join(',')}
            className="chip"
            onClick={() => {
              setA(c[0])
              if (mode === 'simple') setB(c[1])
              else (setP(c[1]), setQ(c[2]))
            }}
          >
            {mode === 'simple' ? `${c[0]}/√${c[1]}` : `${c[0]}/(${c[1]}${signChar}√${c[2]})`}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------- radical <-> power */

export function RootExponent() {
  const { tc } = useI18n()
  const sep = useSep()
  const [aT, setA] = useState('8')
  const [mT, setM] = useState('2')
  const [n, setN] = useState(3)
  const a = /^[1-9]\d{0,5}$/.test(aT.trim()) ? BigInt(aT.trim()) : null
  const m = smallInt(mT, -9, 9)

  let body: ReactNode
  if (a === null || m === null || m === 0) {
    body = <p className="muted">{tc(L('Type a positive whole number a (up to 6 digits) and a non-zero whole number m from −9 to 9.', 'Ketik bilangan bulat positif a (sampai 6 angka) dan bilangan bulat m bukan nol dari −9 sampai 9.'))}</p>
  } else {
    let g = BigInt(Math.abs(m))
    let h = BigInt(n)
    while (h) [g, h] = [h, g % h]
    const m1 = m / Number(g)
    const n1 = n / Number(g)
    const first = n1 === 1 ? null : simplifyRoot(a, n1)
    // (out·ⁿ√inside)^|m1| = out^|m1| · ⁿ√(inside^|m1|), and that may simplify again.
    const second = first ? simplifyRoot(first.inside ** BigInt(Math.abs(m1)), n1) : null
    const coef = first && second ? first.out ** BigInt(Math.abs(m1)) * second.out : null
    const approx = Number(a) ** (m / n)
    const reduced = g > 1n ? ` = ${a}^{\\frac{${m1}}{${n1}}}` : ''
    const exact =
      n1 === 1
        ? ratText(ratPow(rat(a, 1n), m1)!)
        : first && second && coef !== null
          ? m1 > 0
            ? surdTex(coef, n1, second.inside)
            : second.inside === 1n
              ? `\\frac{1}{${coef}}`
              : `\\frac{1}{${surdTex(coef, n1, second.inside)}}`
          : ''
    body = (
      <>
        <ul className="steps">
          <li>
            <Tex src={`${a}^{\\frac{${m}}{${n}}}${reduced}`} />
          </li>
          <li>
            <Tex src={`=${rootTex(n, `${a}^{${m}}`)}=\\left(${rootTex(n, a)}\\right)^{${m}}`} />
          </li>
          <li>
            <Tex src={`=${exact.includes('\\') || /^-?\d+$/.test(exact) ? exact : `\\frac{${exact.split('/')[0]}}{${exact.split('/')[1]}}`}`} />
          </li>
        </ul>
        <p className="small muted">≈ {dec(approx.toPrecision(10), sep)}</p>
      </>
    )
  }

  return (
    <Frame name="rootexp">
      <div className="inrow">
        <label className="lbl">
          a <input aria-label="a" inputMode="numeric" value={aT} onChange={(e) => setA(e.target.value)} />
        </label>
        <label className="lbl">
          m <input aria-label="m" inputMode="numeric" value={mT} onChange={(e) => setM(e.target.value)} />
        </label>
      </div>
      <div className="chips" role="group" aria-label={tc(L('Index n', 'Indeks n'))}>
        {[2, 3, 4, 5, 6].map((i) => (
          <button key={i} className={n === i ? 'chip on' : 'chip'} onClick={() => setN(i)}>
            n = {i}
          </button>
        ))}
      </div>
      <div className="chips">
        {[
          ['8', '2', 3],
          ['16', '3', 4],
          ['27', '-2', 3],
          ['4', '3', 2],
          ['72', '1', 2],
        ].map(([x, y, z]) => (
          <button
            key={`${x}${y}${z}`}
            className="chip"
            onClick={() => {
              setA(String(x))
              setM(String(y))
              setN(Number(z))
            }}
          >
            {x}^({y}/{z})
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------- scientific notation */

const SCI_PRESETS = ['299792458', '0.00045', '149597870700', '0.000000001']

export function ScientificNotation() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [mode, setMode] = useState<'to' | 'from'>('to')
  const [text, setText] = useState('299792458')
  const [mant, setMant] = useState('3.5')
  const [expT, setExpT] = useState('4')

  const sci = mode === 'to' ? toScientific(text) : null
  const e = smallInt(expT, -40, 40)
  const plain = mode === 'from' && e !== null ? fromScientific(mant, e) : null
  const mantTex = (s: string) => (sep === ',' ? s.replace('.', '{,}') : s)
  const spoken = (s: string) => {
    const [i, f] = s.replace('-', '').split('.')
    const g = lang === 'id' ? '.' : ','
    return `${s.startsWith('-') ? '−' : ''}${i.replace(/\B(?=(\d{3})+(?!\d))/g, g)}${f ? sep + f : ''}`
  }

  return (
    <Frame name="scinot">
      <div className="chips" role="group">
        <button className={mode === 'to' ? 'chip on' : 'chip'} onClick={() => setMode('to')}>
          {tc(L('Number → scientific', 'Bilangan → ilmiah'))}
        </button>
        <button className={mode === 'from' ? 'chip on' : 'chip'} onClick={() => setMode('from')}>
          {tc(L('Scientific → number', 'Ilmiah → bilangan'))}
        </button>
      </div>
      {mode === 'to' ? (
        <>
          <div className="inrow">
            <input style={{ width: '14em' }} inputMode="decimal" value={text} aria-label={tc(L('A number', 'Sebuah bilangan'))} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="chips">
            {SCI_PRESETS.map((p) => (
              <button key={p} className={text === p ? 'chip on' : 'chip'} onClick={() => setText(p)}>
                {p}
              </button>
            ))}
          </div>
          <div className="wgtout" aria-live="polite">
            {sci === null ? (
              <p className="muted">{tc(L('Type a non-zero decimal number.', 'Ketik bilangan desimal yang bukan nol.'))}</p>
            ) : (
              <>
                <p className="bigcn">
                  <Tex src={`${sci.negative ? '-' : ''}${mantTex(sci.mantissa)}\\times10^{${sci.exponent}}`} />
                </p>
                <p className="small">
                  {sci.exponent === 0
                    ? tc(L('The decimal point does not move.', 'Koma desimal tidak berpindah.'))
                    : sci.exponent > 0
                      ? tc(L(`Move the decimal point ${sci.exponent} place(s) to the left, so the exponent is positive.`, `Geser koma desimal ${sci.exponent} tempat ke kiri, sehingga eksponennya positif.`))
                      : tc(L(`Move the decimal point ${-sci.exponent} place(s) to the right, so the exponent is negative.`, `Geser koma desimal ${-sci.exponent} tempat ke kanan, sehingga eksponennya negatif.`))}
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="inrow">
            <input style={{ width: '9em' }} inputMode="decimal" value={mant} aria-label={tc(L('Mantissa', 'Mantisa'))} onChange={(e) => setMant(e.target.value)} />
            <span className="slash">× 10</span>
            <input style={{ width: '5em' }} inputMode="numeric" value={expT} aria-label={tc(L('Exponent', 'Eksponen'))} onChange={(e) => setExpT(e.target.value)} />
          </div>
          <div className="wgtout" aria-live="polite">
            {plain === null ? (
              <p className="muted">{tc(L('Type a number for the first box and a whole exponent from −40 to 40.', 'Ketik bilangan di kotak pertama dan eksponen bulat dari −40 sampai 40.'))}</p>
            ) : (
              <p className="bigcn">{spoken(plain)}</p>
            )}
          </div>
        </>
      )}
    </Frame>
  )
}
