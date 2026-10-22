import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import {
  CANCEL_CASES,
  FMTS,
  agreeDigits,
  allNonNegative,
  bias,
  bitStrings,
  decode,
  emin,
  encode,
  exactDecimal,
  hexOf,
  nextDown,
  nextUp,
  sumExact,
  sumKahan,
  sumNaive,
  ulp,
  ulpDistance,
  type Fields,
  type Fmt,
  type Precision,
} from '../../lib/floatbits'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'
import { show } from './TangentWidgets'
import { numOf } from './ExtremeWidgets'

/** A typed number: a decimal, a fraction such as 1/3, a power such as 2^53, or inf, -inf, nan and -0. */
function parseNumber(s: string): number | null {
  const t = s.trim().toLowerCase().replace(',', '.').replace('∞', 'inf')
  if (t === 'nan') return NaN
  if (t === 'inf' || t === '+inf') return Infinity
  if (t === '-inf') return -Infinity
  if (t === '-0' || t === '-0.0') return -0
  if (/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/.test(t)) return Number(t)
  return numOf(t)
}

const four = (x: number, sep: string): string => show(Number(x.toPrecision(6)), sep)

/** The exact error of a stored number against a decimal literal the reader typed, as TeX-free text: the absolute and the relative error. */
function decimalError(stored: number, typed: string): { abs: number; rel: number; absText: string } | null {
  const m = /^([+-]?)(\d*)\.?(\d*)(?:e([+-]?\d+))?$/i.exec(typed.trim().replace(',', '.'))
  if (!m || (m[2] === '' && m[3] === '') || !Number.isFinite(stored)) return null
  const tSign = m[1] === '-' ? -1n : 1n
  const tDigits = BigInt((m[2] + m[3]) || '0')
  const tExp = Number(m[4] ?? 0) - m[3].length
  const ex = exactDecimal(Math.abs(stored))
  const dot = ex.indexOf('.')
  const sFrac = dot < 0 ? 0 : ex.length - dot - 1
  const sDigits = BigInt(ex.replace('.', ''))
  const sSign = stored < 0 || Object.is(stored, -0) ? -1n : 1n
  const E = Math.min(tExp, -sFrac)
  const sScaled = sSign * sDigits * 10n ** BigInt(-sFrac - E)
  const tScaled = tSign * tDigits * 10n ** BigInt(tExp - E)
  const diff = sScaled - tScaled
  if (diff === 0n || tScaled === 0n) return null
  const absDiff = diff < 0n ? -diff : diff
  const sci = absDiff.toString()
  const exp10 = sci.length - 1 + E
  const absText = `${diff < 0n ? '−' : '+'}${sci[0]}.${sci.slice(1, 4).padEnd(3, '0')} × 10^${exp10}`
  const tAbs = tScaled < 0n ? -tScaled : tScaled
  const rel = Number((absDiff * 10n ** 40n) / tAbs) / 1e40
  return { abs: Number(diff < 0n ? -1 : 1), rel, absText }
}
const sci = (x: number, sep: string): string => (x === 0 ? '0' : x.toExponential(3).replace('.', sep).replace('e', ' × 10^').replace('^+', '^'))

/* ---------------------------------------------------------------------- the bits of a number */

const FORMATS: { key: keyof typeof FMTS; label: string }[] = [
  { key: 'half', label: 'float16' },
  { key: 'bfloat16', label: 'bfloat16' },
  { key: 'single', label: 'float32' },
  { key: 'double', label: 'float64' },
]

const BIT_PRESETS = ['0.1', '1', '-2.5', '1/3', '2^53', '16777217', '1e-310', '1e39', 'inf', 'NaN', '-0']

const KIND_TEXT: Record<string, { en: string; id: string }> = {
  normal: { en: 'a normal number', id: 'bilangan normal' },
  subnormal: { en: 'a subnormal number (exponent field 0)', id: 'bilangan subnormal (bidang eksponen 0)' },
  zero: { en: 'zero', id: 'nol' },
  inf: { en: 'infinity', id: 'tak hingga' },
  nan: { en: 'NaN, not a number', id: 'NaN, bukan bilangan' },
}

export function FloatBits() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [text, setText] = useState('0.1')
  const [fk, setFk] = useState<keyof typeof FMTS>('double')
  const f: Fmt = FMTS[fk]
  const x = parseNumber(text)
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  let body
  if (x === null) body = <p className="noline">{tc(L('Type a number such as 0.1, 1/3, 2^53 or 1e-310, or inf, NaN or -0.', 'Ketik bilangan seperti 0,1, 1/3, 2^53, atau 1e-310, atau inf, NaN, atau -0.'))}</p>
  else {
    const p: Fields = encode(x, f)
    const stored = decode(p, f)
    const bits = bitStrings(p, f)
    const finite = Number.isFinite(stored)
    const up = nextUp(p, f)
    const down = nextDown(p, f)
    const dErr = finite ? decimalError(stored, text) : null
    const isDecimal = /^[+-]?(\d+[.,]?\d*|[.,]\d+)(e[+-]?\d+)?$/i.test(text.trim())
    const err = finite && Number.isFinite(x) ? stored - x : NaN
    const digitsOf = (v: number): string => (fk === 'double' ? v.toPrecision(17) : fk === 'single' ? v.toPrecision(9) : v.toPrecision(5))
    const unbiased = p.exp - bias(f)
    const formula =
      p.kind === 'normal'
        ? `(-1)^{${p.sign}}\\times(1.${p.man.toString(2).padStart(f.man, '0').slice(0, 12)}${f.man > 12 ? '\\ldots' : ''})_2\\times2^{${unbiased}}`
        : p.kind === 'subnormal'
          ? `(-1)^{${p.sign}}\\times(0.${p.man.toString(2).padStart(f.man, '0').slice(0, 12)}${f.man > 12 ? '\\ldots' : ''})_2\\times2^{${emin(f)}}`
          : ''
    body = (
      <>
        <div className="fpgroup">
          <b>{tc(L('sign (1 bit)', 'tanda (1 bit)'))}</b> <span className="fpbit s">{bits.sign}</span>
        </div>
        <div className="fpgroup">
          <b>{tc(L(`exponent (${f.exp} bits)`, `eksponen (${f.exp} bit)`))}</b> <span className="fpbit e">{bits.exp}</span>
          {p.kind === 'normal' && <span className="small muted"> = {p.exp} − {bias(f)} = {unbiased}</span>}
        </div>
        <div className="fpgroup">
          <b>{tc(L(`fraction (${f.man} bits)`, `pecahan (${f.man} bit)`))}</b> <span className="fpbit m">{bits.man}</span>
        </div>
        <div className="wgtout" aria-live="polite">
          <p>
            {tc(L('hexadecimal', 'heksadesimal'))} <code className="inline">0x{hexOf(p, f)}</code> · {tc(KIND_TEXT[p.kind])}
          </p>
          {formula && (
            <p>
              <Tex src={tdec(formula)} />
            </p>
          )}
          {finite && (
            <>
              <p className="okline">
                {tc(L('stored value', 'nilai yang tersimpan'))}: <span className="mono">{stored === 0 || (Math.abs(stored) > 1e-12 && Math.abs(stored) < 1e21) ? exactDecimal(stored).replace('.', sep) : `${stored.toExponential(17).replace('.', sep)} (${tc(L('its exact decimal expansion is much longer', 'ekspansi desimal tepatnya jauh lebih panjang'))})`}</span>
              </p>
              {dErr ? (
                <p>
                  {tc(L('error against the decimal you typed', 'galat terhadap desimal yang kamu ketik'))}: {dErr.absText.replace('.', sep).replace('^', '^')} ({tc(L('relative', 'relatif'))} {sci(dErr.rel, sep)})
                </p>
              ) : Number.isFinite(err) && err !== 0 ? (
                <p>
                  {tc(L('error against the nearest double to what you typed', 'galat terhadap double terdekat dari yang kamu ketik'))}: {sci(err, sep)} ({tc(L('relative', 'relatif'))} {sci(Math.abs(err / x), sep)})
                </p>
              ) : isDecimal ? (
                <p className="small muted">{tc(L('The number is stored exactly in this format.', 'Bilangan ini tersimpan tepat dalam format ini.'))}</p>
              ) : (
                <p className="small muted">{tc(L('This is the double nearest to what you typed.', 'Ini adalah double terdekat dari yang kamu ketik.'))}</p>
              )}
              <p className="small">
                {tc(L('gap to the next number (ulp)', 'jarak ke bilangan berikutnya (ulp)'))}: <b>{sci(ulp(stored, f), sep)}</b> · {tc(L('below', 'di bawah'))}: <span className="mono">{digitsOf(decode(down, f)).replace('.', sep)}</span> · {tc(L('above', 'di atas'))}: <span className="mono">{digitsOf(decode(up, f)).replace('.', sep)}</span>
              </p>
            </>
          )}
        </div>
      </>
    )
  }
  return (
    <Frame name="fpbits">
      <div className="inrow">
        <label className="lbl" style={{ width: '100%' }}>
          {tc(L('number', 'bilangan'))} = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={text} aria-label={tc(L('number', 'bilangan'))} onChange={(e) => setText(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {FORMATS.map((q) => (
          <button key={q.key} className={`chip ${fk === q.key ? 'on' : ''}`} onClick={() => setFk(q.key)} aria-pressed={fk === q.key}>
            {q.label}
          </button>
        ))}
      </div>
      <div className="chips">
        {BIT_PRESETS.map((p) => (
          <button key={p} className="chip ghost" onClick={() => setText(p)}>
            {p}
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* ------------------------------------------------------------------ all the numbers of a tiny format */

export function FloatToy() {
  const { tc } = useI18n()
  const sep = useSep()
  const [eb, setEb] = useState(3)
  const [mb, setMb] = useState(2)
  const [cap, setCap] = useState(2)
  const [pick, setPick] = useState(9)
  const f: Fmt = { name: 'toy', exp: eb, man: mb }
  const all = useMemo(() => allNonNegative(f), [eb, mb])
  const e0 = emin(f)
  const capExp = Math.min(Math.max(cap, e0), bias(f) + 1)
  const limit = 2 ** capExp
  const visible = all.filter((q) => q.value <= limit)
  const sel = all[Math.min(pick, all.length - 1)]
  const nextV = all[Math.min(pick, all.length - 1) + 1]
  const W = 440
  const px = (v: number): number => 14 + (v / limit) * (W - 28)
  const bitsSel = bitStrings(sel.fields, f)
  const binades: { k: number; gap: number; count: number }[] = []
  for (let k = e0; k <= bias(f); k++) binades.push({ k, gap: 2 ** (k - mb), count: 2 ** mb })
  return (
    <Frame name="fptoy">
      <div className="amctl">
        <label className="lbl slider">
          {tc(L('exponent bits', 'bit eksponen'))} = <b>{eb}</b>
          <input type="range" min={2} max={4} step={1} value={eb} aria-label="exponent bits" onChange={(e) => (setEb(Number(e.target.value)), setPick(1), setCap(2))} />
        </label>
        <label className="lbl slider">
          {tc(L('fraction bits', 'bit pecahan'))} = <b>{mb}</b>
          <input type="range" min={1} max={4} step={1} value={mb} aria-label="fraction bits" onChange={(e) => (setMb(Number(e.target.value)), setPick(1))} />
        </label>
        <label className="lbl slider">
          {tc(L('show the numbers up to', 'tampilkan bilangan sampai'))} 2^<b>{capExp}</b> = <b>{four(limit, sep)}</b>
          <input type="range" min={e0} max={bias(f) + 1} step={1} value={capExp} aria-label="cap" onChange={(e) => setCap(Number(e.target.value))} />
        </label>
        <label className="lbl slider">
          {tc(L('number', 'bilangan'))} #<b>{Math.min(pick, all.length - 1)}</b> / {all.length - 1}
          <input type="range" min={0} max={all.length - 1} step={1} value={Math.min(pick, all.length - 1)} aria-label="number" onChange={(e) => setPick(Number(e.target.value))} />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} 80`} className="dersvg" role="img" aria-label={tc(L('The non-negative numbers of the format on a line: crowded near zero and wider apart with each power of two', 'Bilangan tak negatif dalam format ini pada satu garis: rapat di dekat nol dan makin renggang di setiap pangkat dua'))}>
        <rect x={0} y={0} width={W} height={80} className="tanframe" />
        <line x1={10} x2={W - 10} y1={46} y2={46} className="tanaxis" />
        {Array.from({ length: capExp - e0 + 1 }, (_, i) => e0 + i).map((k) => (
          <g key={k}>
            <line x1={px(2 ** k)} x2={px(2 ** k)} y1={38} y2={54} className="tannorm" />
            <text x={px(2 ** k)} y={70} className="tanlabel" textAnchor="middle">
              {four(2 ** k, sep)}
            </text>
          </g>
        ))}
        {visible.map((q, i) => {
          const isSel = q.value === sel.value
          const binade = q.fields.kind === 'subnormal' || q.fields.kind === 'zero' ? -1 : q.fields.exp
          return <circle key={i} cx={px(q.value)} cy={isSel ? 24 : 36} r={isSel ? 5.5 : 3.2} className={`tandot${binade < 0 ? ' open' : binade % 2 === 0 ? '' : ' sec'}`} />
        })}
      </svg>
      <p className="small muted">{tc(L('Open circles are zero and the subnormal numbers; the colour changes at every power of two.', 'Lingkaran kosong adalah nol dan bilangan subnormal; warnanya berganti di setiap pangkat dua.'))}</p>
      <div className="fpgroup">
        <span className="fpbit s">{bitsSel.sign}</span> <span className="fpbit e">{bitsSel.exp}</span> <span className="fpbit m">{bitsSel.man}</span>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="okline">
          {tc(L('this number', 'bilangan ini'))}: <b>{four(sel.value, sep)}</b>
          {nextV ? ` · ${tc(L('gap to the next', 'jarak ke berikutnya'))}: ${four(nextV.value - sel.value, sep)}` : ''}
        </p>
        <p className="small">
          {tc(L(`${all.length} non-negative numbers; largest ${four(all[all.length - 1].value, sep)}; smallest normal ${four(2 ** e0, sep)}; smallest subnormal ${four(2 ** (e0 - mb), sep)}. The exponent field with all ones is kept for infinity and NaN.`, `${all.length} bilangan tak negatif; terbesar ${four(all[all.length - 1].value, sep)}; normal terkecil ${four(2 ** e0, sep)}; subnormal terkecil ${four(2 ** (e0 - mb), sep)}. Bidang eksponen berisi satu semua disediakan untuk tak hingga dan NaN.`))}
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>{tc(L('from', 'dari'))}</th>
                <th>{tc(L('numbers', 'bilangan'))}</th>
                <th>{tc(L('gap', 'jarak'))}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>{2 ** mb} ({tc(L('subnormal', 'subnormal'))})</td>
                <td>{four(2 ** (e0 - mb), sep)}</td>
              </tr>
              {binades.map((b) => (
                <tr key={b.k}>
                  <td>{four(2 ** b.k, sep)}</td>
                  <td>{b.count}</td>
                  <td>{four(b.gap, sep)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Frame>
  )
}

/* --------------------------------------------------------------------------------- sums */

const SUM_VALUES = ['0.1', '0.01', '1/3', '0.7', '1e-8']
const SUM_COUNTS = [10, 100, 1000, 10000, 100000, 1000000]

export function FloatSum() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [mode, setMode] = useState<'repeat' | 'absorb'>('repeat')
  const [vText, setV] = useState('0.1')
  const [ci, setCi] = useState(2)
  const [prec, setPrec] = useState<Precision>('double')
  const v = parseNumber(vText)
  const n = SUM_COUNTS[ci]
  const result = useMemo(() => {
    const x = mode === 'repeat' ? v : 1
    if (x === null || !Number.isFinite(x)) return null
    const xs = mode === 'repeat' ? new Array<number>(n).fill(x) : [2 ** 53, ...new Array<number>(n).fill(1)]
    const exact = sumExact(xs)
    return { naive: sumNaive(xs, prec), kahan: sumKahan(xs, prec), exact }
  }, [mode, v, n, prec])
  const sumUlp = (got: number, want: number): string => {
    const d = prec === 'double' ? ulpDistance(got, want) : null
    return d === null ? '–' : String(d)
  }
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  return (
    <Frame name="fpsum">
      <div className="chips">
        <button className={`chip ${mode === 'repeat' ? 'on' : ''}`} onClick={() => setMode('repeat')} aria-pressed={mode === 'repeat'}>
          {tc(L('add a value n times', 'jumlahkan satu nilai n kali'))}
        </button>
        <button className={`chip ${mode === 'absorb' ? 'on' : ''}`} onClick={() => setMode('absorb')} aria-pressed={mode === 'absorb'}>
          {tc(L('2^53 plus n ones', '2^53 ditambah n satu'))}
        </button>
        <button className={`chip ${prec === 'double' ? 'on' : ''}`} onClick={() => setPrec('double')} aria-pressed={prec === 'double'}>
          float64
        </button>
        <button className={`chip ${prec === 'single' ? 'on' : ''}`} onClick={() => setPrec('single')} aria-pressed={prec === 'single'}>
          float32
        </button>
      </div>
      {mode === 'repeat' && (
        <div className="chips">
          {SUM_VALUES.map((p) => (
            <button key={p} className={`chip ghost ${vText === p ? 'on' : ''}`} onClick={() => setV(p)}>
              {p}
            </button>
          ))}
        </div>
      )}
      <label className="lbl slider">
        n = <b>{n.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</b>
        <input type="range" min={0} max={SUM_COUNTS.length - 1} step={1} value={ci} aria-label="n" onChange={(e) => setCi(Number(e.target.value))} />
      </label>
      {result === null ? (
        <p className="noline">{tc(L('Type a finite number to add.', 'Ketik bilangan terhingga untuk dijumlahkan.'))}</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table className="rtable">
              <thead>
                <tr>
                  <th />
                  <th>{tc(L('sum', 'jumlah'))}</th>
                  <th>{tc(L('error', 'galat'))}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{tc(L('one at a time', 'satu per satu'))}</td>
                  <td className="mono">{result.naive.toPrecision(prec === 'double' ? 17 : 9).replace('.', sep)}</td>
                  <td>{sci(result.naive - result.exact, sep)}{prec === 'double' ? ` (${sumUlp(result.naive, result.exact)} ulp)` : ''}</td>
                </tr>
                <tr>
                  <td>{tc(L('Kahan', 'Kahan'))}</td>
                  <td className="mono">{result.kahan.toPrecision(prec === 'double' ? 17 : 9).replace('.', sep)}</td>
                  <td>{sci(result.kahan - result.exact, sep)}{prec === 'double' ? ` (${sumUlp(result.kahan, result.exact)} ulp)` : ''}</td>
                </tr>
                <tr>
                  <td>{tc(L('exact, rounded once', 'tepat, dibulatkan sekali'))}</td>
                  <td className="mono">{result.exact.toPrecision(17).replace('.', sep)}</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="wgtout" aria-live="polite">
            <p>
              <Tex src={tdec(mode === 'repeat' ? `\\sum_{i=1}^{n}x` : `2^{53}+\\sum_{i=1}^{n}1`)} />
            </p>
            <p className="small">
              {mode === 'absorb'
                ? tc(L('From 2^53 the gap between doubles is 2, so adding 1 to 2^53 changes nothing: the ones are absorbed one by one, while Kahan’s second number collects them. In float32 the same happens from 2^24.', 'Mulai dari 2^53 jarak antar double adalah 2, sehingga menambah 1 pada 2^53 tidak mengubah apa pun: satu-satu terserap, sedangkan bilangan kedua Kahan mengumpulkannya. Pada float32 hal yang sama terjadi mulai 2^24.'))
                : tc(L('Each addition rounds, and the rounding errors do not cancel: the error of the sum grows with n. Kahan’s compensated sum keeps the lost part and stays within an ulp or two of the exact answer. The exact row is added as integers and rounded once. (The error columns for float32 are against the exact sum of the float64 values.)', 'Setiap penjumlahan membulatkan, dan galat pembulatan tidak saling menghapus: galat jumlah tumbuh bersama n. Jumlah Kahan menyimpan bagian yang hilang dan tetap dalam satu atau dua ulp dari jawaban tepat. Baris tepat dijumlahkan sebagai bilangan bulat dan dibulatkan sekali. (Kolom galat untuk float32 terhadap jumlah tepat nilai float64.)'))}
            </p>
          </div>
        </>
      )}
    </Frame>
  )
}

/* ---------------------------------------------------------------------------- cancellation */

const CANCEL_TEX: Record<string, { naive: string; stable: string; name: { en: string; id: string } }> = {
  cosine: { naive: '\\dfrac{1-\\cos x}{x^2}', stable: '\\dfrac{2\\sin^2(x/2)}{x^2}', name: { en: 'cosine', id: 'kosinus' } },
  exp: { naive: '\\dfrac{e^x-1}{x}', stable: '\\dfrac{\\text{expm1}(x)}{x}', name: { en: 'exponential', id: 'eksponensial' } },
  sqrt: { naive: '\\sqrt{x^2+1}-x', stable: '\\dfrac{1}{\\sqrt{x^2+1}+x}', name: { en: 'square root', id: 'akar kuadrat' } },
  root: { naive: '\\dfrac{b-\\sqrt{b^2-4}}{2}', stable: '\\dfrac{2}{b+\\sqrt{b^2-4}}', name: { en: 'a root of a quadratic', id: 'akar persamaan kuadrat' } },
}

export function FloatCancel() {
  const { tc } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('cosine')
  const [t, setT] = useState(0.7)
  const c = CANCEL_CASES.find((q) => q.id === id) ?? CANCEL_CASES[0]
  const k = c.lo + t * (c.hi - c.lo)
  const x = 10 ** (Math.round(k * 4) / 4)
  const naive = c.naive(x)
  const stable = c.stable(x)
  const want = c.series(x)
  const dn = agreeDigits(naive, want)
  const ds = agreeDigits(stable, want)
  const tex = CANCEL_TEX[id]
  return (
    <Frame name="fpcancel">
      <div className="chips">
        {CANCEL_CASES.map((q) => (
          <button key={q.id} className={`chip ${id === q.id ? 'on' : ''}`} onClick={() => setId(q.id)} aria-pressed={id === q.id}>
            {tc(CANCEL_TEX[q.id].name)}
          </button>
        ))}
      </div>
      <label className="lbl slider">
        {id === 'root' ? 'b' : 'x'} = <b>{x.toExponential(2).replace('.', sep).replace('e', ' × 10^').replace('^+', '^')}</b>
        <input type="range" min={0} max={1} step={0.01} value={t} aria-label="x" onChange={(e) => setT(Number(e.target.value))} />
      </label>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th />
              <th>{tc(L('value', 'nilai'))}</th>
              <th>{tc(L('correct digits', 'angka benar'))}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Tex src={tex.naive} />
              </td>
              <td className="mono">{naive.toPrecision(17).replace('.', sep)}</td>
              <td className={dn < 8 ? 'wrongcell' : ''}>{four(dn, sep)}</td>
            </tr>
            <tr>
              <td>
                <Tex src={tex.stable} />
              </td>
              <td className="mono">{stable.toPrecision(17).replace('.', sep)}</td>
              <td>{four(ds, sep)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className={dn < 8 ? 'noline' : 'okline'}>
          {dn < 1 ? tc(L('The naive form has lost every digit: it subtracts two numbers that are equal to 16 places.', 'Bentuk naif kehilangan semua angka: ia mengurangkan dua bilangan yang sama sampai 16 tempat.')) : dn < 8 ? tc(L('The naive form keeps only a few correct digits: the subtraction cancels the leading ones.', 'Bentuk naif hanya menyisakan beberapa angka benar: pengurangan menghapus angka-angka terdepan.')) : tc(L('Here the cancellation is mild, and both forms are good. Move x toward the end of the slider.', 'Di sini pembatalannya ringan, dan kedua bentuk baik. Geser x ke ujung penggeser.'))}
        </p>
        <p className="small">{tc(L('The true value comes from a series of the function. Both forms are the same function: they differ only in the order of the arithmetic.', 'Nilai sebenarnya berasal dari deret fungsi itu. Kedua bentuk adalah fungsi yang sama: bedanya hanya urutan hitungannya.'))}</p>
      </div>
    </Frame>
  )
}

