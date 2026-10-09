import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import { parseRational, rat, type Rat } from '../../lib/realnum'
import { parseInteger } from '../../lib/integers'
import { ratSub, roundedDecimal } from '../../lib/rationals'
import {
  ROOT_LIMIT,
  constantScaled,
  continuedFraction,
  makeSurd,
  rootClass,
  rootDigits,
  sci,
  surdAdd,
  surdApprox,
  surdDiv,
  surdIsRational,
  surdMul,
  surdSub,
  type Constant,
  type Surd,
} from '../../lib/irrational'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const rootTex = (k: number, radicand: string): string => (k === 2 ? `\\sqrt{${radicand}}` : `\\sqrt[${k}]{${radicand}}`)
const ptex = (primes: [bigint, number][]): string => primes.map(([p, e]) => (e > 1 ? `${p}^{${e}}` : `${p}`)).join('\\cdot ')
const ratTex = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
const absRat = (r: Rat): Rat => (r.n < 0n ? rat(-r.n, r.d) : r)

/** a + b√m as TeX, with the coefficient of the root dropped when it is 1. */
function surdTex(s: Surd): string {
  if (s.b.n === 0n) return ratTex(s.a)
  const root = `\\sqrt{${s.m}}`
  const mag = absRat(s.b)
  const bTerm = `${mag.n === 1n && mag.d === 1n ? '' : ratTex(mag)}${root}`
  if (s.a.n === 0n) return `${s.b.n < 0n ? '-' : ''}${bTerm}`
  return `${ratTex(s.a)}${s.b.n < 0n ? '-' : '+'}${bTerm}`
}

function NumberInput({ label, value, set, width = '6em' }: { label: string; value: string; set: (s: string) => void; width?: string }) {
  return (
    <label className="lbl">
      {label} <input style={{ width }} value={value} aria-label={label} onChange={(e) => set(e.target.value)} />
    </label>
  )
}

/* ---------------------------------------------------------------- root check */

export function RootChecker() {
  const { tc } = useI18n()
  const sep = useSep()
  const [s, setS] = useState('72')
  const [k, setK] = useState(2)
  const n = parseInteger(s, 13)

  let body
  if (n === null) body = <p className="noline">{tc(L('Type a positive whole number (up to 12 digits).', 'Ketik bilangan bulat positif (sampai 12 angka).'))}</p>
  else if (n < 1n) body = <p className="noline">{tc(L('Type a positive whole number: the root of a negative number is not real for an even index.', 'Ketik bilangan bulat positif: akar bilangan negatif tidak real untuk indeks genap.'))}</p>
  else if (n > ROOT_LIMIT) body = <p className="noline">{tc(L('This tool factorises numbers up to 10^12.', 'Alat ini memfaktorkan bilangan sampai 10^12.'))}</p>
  else {
    const c = rootClass(n, k)
    const digits = rootDigits(n, k, 30).replace('.', sep === ',' ? '{,}' : '.')
    const blockers = c.primes.filter(([, e]) => e % k !== 0)
    const result = c.rational
      ? `${rootTex(k, `${n}`)}=${c.outside}`
      : `${rootTex(k, `${n}`)}=${c.outside === 1n ? '' : c.outside}${rootTex(k, `${c.inside}`)}`
    body = (
      <>
        <p className="bigcn">
          <Tex src={result} />
        </p>
        {n !== 1n && (
          <p className="small">
            <Tex src={`${n}=${ptex(c.primes)}`} />
          </p>
        )}
        {c.primes.length > 0 && (
          <div className="gridwrap">
            <table className="rtable">
              <thead>
                <tr>
                  <th>{tc(L('Prime', 'Prima'))}</th>
                  <th>{tc(L('Exponent', 'Eksponen'))}</th>
                  <th>{tc(L(`Groups of ${k}`, `Kelompok ${k}`))}</th>
                  <th>{tc(L('Left over', 'Sisa'))}</th>
                </tr>
              </thead>
              <tbody>
                {c.primes.map(([p, e]) => (
                  <tr key={p.toString()} className={e % k === 0 ? 'grp3' : ''}>
                    <td>{p.toString()}</td>
                    <td>{e}</td>
                    <td>{Math.floor(e / k)}</td>
                    <td>{e % k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="small">
          {c.rational
            ? tc(L(`Every exponent is a multiple of ${k}, so the root is the whole number ${c.outside}: rational.`, `Setiap eksponen adalah kelipatan ${k}, sehingga akarnya bilangan bulat ${c.outside}: rasional.`))
            : tc(L(`${blockers.length > 1 ? 'The exponents' : 'The exponent'} of ${blockers.map(([p]) => p).join(', ')} ${blockers.length > 1 ? 'are not multiples' : 'is not a multiple'} of ${k}, so the root is irrational: it is never a whole number and never a fraction.`, `Eksponen ${blockers.map(([p]) => p).join(', ')} bukan kelipatan ${k}, sehingga akarnya irasional: ia tidak pernah bilangan bulat dan tidak pernah pecahan.`))}
        </p>
        <p className="small muted">
          {tc(L('First 30 decimals', '30 desimal pertama'))}: <Tex src={`${digits}${c.rational ? '' : '\\ldots'}`} />
        </p>
      </>
    )
  }

  return (
    <Frame name="rootcheck">
      <div className="inrow">
        <NumberInput label="n" value={s} set={setS} width="10em" />
      </div>
      <div className="chips">
        {[2, 3, 4, 5].map((i) => (
          <button key={i} className={`chip${k === i ? ' on' : ''}`} onClick={() => setK(i)}>
            {tc(L('root index', 'indeks akar'))} {i}
          </button>
        ))}
        {['72', '49', '2', '1000000', '54', '999999999999'].map((p) => (
          <button key={p} className="chip ghost" onClick={() => setS(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------- surds */

type Op = '+' | '-' | '*' | '/'
const OPS: [Op, string][] = [
  ['+', '+'],
  ['-', '−'],
  ['*', '×'],
  ['/', '÷'],
]
const PRESETS: { label: string; m: string; a: string; b: string; c: string; d: string; op: Op }[] = [
  { label: '√2 + (−√2)', m: '2', a: '0', b: '1', c: '0', d: '-1', op: '+' },
  { label: '√2 × √2', m: '2', a: '0', b: '1', c: '0', d: '1', op: '*' },
  { label: '(1+√2)(1−√2)', m: '2', a: '1', b: '1', c: '1', d: '-1', op: '*' },
  { label: '(1+√2) ÷ (1−√2)', m: '2', a: '1', b: '1', c: '1', d: '-1', op: '/' },
  { label: '1 + √2', m: '2', a: '1', b: '1', c: '0', d: '0', op: '+' },
  { label: '(½+½√5)²', m: '5', a: '1/2', b: '1/2', c: '1/2', d: '1/2', op: '*' },
]

export function SurdCalculator() {
  const { tc, lang } = useI18n()
  const [sm, setSm] = useState('2')
  const [sa, setSa] = useState('1')
  const [sb, setSb] = useState('1')
  const [sc, setSc] = useState('1')
  const [sd, setSd] = useState('-1')
  const [op, setOp] = useState<Op>('*')
  const m = parseInteger(sm, 6)
  const a = parseRational(sa)
  const b = parseRational(sb)
  const c = parseRational(sc)
  const d = parseRational(sd)
  const small = (r: Rat | null) => r !== null && (r.n < 0n ? -r.n : r.n) <= 99999n && r.d <= 999n

  let body
  if (m === null || m < 2n) body = <p className="noline">{tc(L('Type a whole number m of 2 or more for the root √m.', 'Ketik bilangan bulat m minimal 2 untuk akar √m.'))}</p>
  else if (!a || !b || !c || !d || ![a, b, c, d].every(small)) body = <p className="noline">{tc(L('Each coefficient must be a whole number or a simple fraction such as 1/2.', 'Setiap koefisien harus berupa bilangan bulat atau pecahan sederhana seperti 1/2.'))}</p>
  else {
    const x = makeSurd(m, a, b)
    const y = makeSurd(m, c, d)
    const fold = x.m === 1n
    let result: Surd | null = null
    let err: string | null = null
    if (!fold) {
      if (op === '/' && y.a.n === 0n && y.b.n === 0n) err = tc(L('Division by zero is undefined.', 'Pembagian dengan nol tidak terdefinisi.'))
      else result = op === '+' ? surdAdd(x, y) : op === '-' ? surdSub(x, y) : op === '*' ? surdMul(x, y) : surdDiv(x, y)
    }
    const sym = op === '+' ? '+' : op === '-' ? '-' : op === '*' ? '\\cdot ' : '\\div '
    const wrap = (s: Surd) => (s.b.n === 0n ? surdTex(s) : `\\left(${surdTex(s)}\\right)`)
    const places = lang === 'id' ? ',' : '.'
    if (fold) {
      body = <p className="muted">{tc(L(`√${m} is a whole number (it is a perfect square after taking out squares), so every number here is rational. Choose an m that is not a perfect square.`, `√${m} adalah bilangan bulat (ia kuadrat sempurna setelah faktor kuadrat dikeluarkan), sehingga semua bilangan di sini rasional. Pilih m yang bukan kuadrat sempurna.`))}</p>
    } else if (err || !result) {
      body = <p className="noline">{err}</p>
    } else {
      const rational = surdIsRational(result)
      body = (
        <>
          <p className="bigcn">
            <Tex src={`${wrap(x)}${sym}${wrap(y)}=${surdTex(result)}`} />
          </p>
          <p className={rational ? 'okline' : 'small'}>
            {rational
              ? tc(L('The result is rational: the √ part has cancelled completely, although the numbers that were combined are irrational.', 'Hasilnya rasional: bagian √ habis seluruhnya, padahal bilangan yang digabungkan irasional.'))
              : tc(L('The result still contains √ with a non-zero coefficient, so it is irrational.', 'Hasilnya masih memuat √ dengan koefisien bukan nol, sehingga irasional.'))}
          </p>
          <p className="small muted">
            {tc(L('Value', 'Nilai'))} ≈ {surdApprox(result, 12).replace('.', places)}
            {' · '}
            {tc(L(`A number a + b√${x.m} with rational a and b is rational exactly when b = 0.`, `Bilangan a + b√${x.m} dengan a dan b rasional adalah rasional tepat bila b = 0.`))}
          </p>
        </>
      )
    }
  }

  const load = (p: (typeof PRESETS)[number]) => {
    setSm(p.m)
    setSa(p.a)
    setSb(p.b)
    setSc(p.c)
    setSd(p.d)
    setOp(p.op)
  }

  return (
    <Frame name="surdcalc">
      <div className="inrow">
        <NumberInput label="m" value={sm} set={setSm} width="4.5em" />
        <NumberInput label="a" value={sa} set={setSa} />
        <NumberInput label="b" value={sb} set={setSb} />
        <NumberInput label="c" value={sc} set={setSc} />
        <NumberInput label="d" value={sd} set={setSd} />
      </div>
      <p className="muted small">
        <Tex src={`(a+b\\sqrt{m})\\;\\square\\;(c+d\\sqrt{m})`} />
      </p>
      <div className="chips">
        {OPS.map(([id, symbol]) => (
          <button key={id} className={`chip${op === id ? ' on' : ''}`} onClick={() => setOp(id)} aria-label={symbol}>
            {symbol}
          </button>
        ))}
        {PRESETS.map((p) => (
          <button key={p.label} className="chip ghost" onClick={() => load(p)}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------- convergents */

const CONSTANTS: { id: Constant; label: string; tex: string }[] = [
  { id: 'pi', label: 'π', tex: '\\pi' },
  { id: 'e', label: 'e', tex: 'e' },
  { id: 'sqrt2', label: '√2', tex: '\\sqrt{2}' },
  { id: 'phi', label: 'φ', tex: '\\varphi' },
]
const PRECISION = 90
const cache = new Map<Constant, Rat>()
const valueOf = (id: Constant): Rat => {
  let v = cache.get(id)
  if (!v) {
    v = rat(constantScaled(id, PRECISION), 10n ** BigInt(PRECISION))
    cache.set(id, v)
  }
  return v
}

export function Convergents() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState<Constant>('pi')
  const [terms, setTerms] = useState(6)
  const x = valueOf(id)
  const rows = useMemo(() => continuedFraction(x, 14), [x])
  const shown = rows.slice(0, terms)
  const meta = CONSTANTS.find((c) => c.id === id)!
  const point = sep === ',' ? '{,}' : '.'
  const cfTex = `[${rows
    .slice(0, Math.min(terms + 3, 14))
    .map((r, i) => (i === 1 ? `;\\,${r.quotient}` : i > 1 ? `,\\,${r.quotient}` : `${r.quotient}`))
    .join('')},\\ldots]`

  return (
    <Frame name="convergents">
      <div className="chips">
        {CONSTANTS.map((c) => (
          <button key={c.id} className={`chip${id === c.id ? ' on' : ''}`} onClick={() => setId(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <label className="lbl slider">
        {tc(L('terms', 'suku'))} = <b>{terms}</b>
        <input type="range" min={1} max={12} value={terms} aria-label={tc(L('terms', 'suku'))} onChange={(e) => setTerms(Number(e.target.value))} />
      </label>
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`${meta.tex}=${cfTex}`} />
        </p>
        <div className="gridwrap">
          <table className="rtable">
            <thead>
              <tr>
                <th>k</th>
                <th>{tc(L('Quotient', 'Hasil bagi'))}</th>
                <th>{tc(L('Fraction', 'Pecahan'))}</th>
                <th>{tc(L('Decimal', 'Desimal'))}</th>
                <th>{tc(L('Error', 'Galat'))}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r, i) => {
                const err = sci(absRat(ratSub(x, rat(r.p, r.q))), 3)
                const dec = roundedDecimal(rat(r.p, r.q), 10).replace('.', sep)
                return (
                  <tr key={i}>
                    <td>{i}</td>
                    <td>{r.quotient.toString()}</td>
                    <td>
                      <Tex src={r.q === 1n ? `${r.p}` : `\\frac{${r.p}}{${r.q}}`} />
                    </td>
                    <td>{dec}</td>
                    <td>
                      <Tex src={err.mantissa === '0' ? '0' : `${err.mantissa.replace('.', point)}\\times10^{${err.exp}}`} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="small muted">
          {tc(L('Each fraction is the best approximation with a denominator that small, and the error keeps shrinking but never reaches 0: if it did, the number would be rational.', 'Setiap pecahan adalah hampiran terbaik dengan penyebut sekecil itu, dan galatnya terus mengecil tetapi tidak pernah mencapai 0: jika mencapai 0, bilangan itu rasional.'))}
        </p>
      </div>
    </Frame>
  )
}
