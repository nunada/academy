import { useState } from 'react'
import { useI18n } from '../../i18n'
import { expand, factorize } from '../../lib/realnum'
import {
  gcd,
  mixed,
  overCommon,
  parseFrac,
  rat,
  ratAdd,
  ratCmp,
  ratDiv,
  ratMul,
  ratSub,
  roundedDecimal,
  termInfo,
  type Frac,
  type Rat,
} from '../../lib/rationals'
import { Tex } from '../ui'
import { Frame, L, useSep } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const BAD = L('Type a fraction such as 3/4 or -7/2, or a whole number (up to 15 digits).', 'Ketik pecahan seperti 3/4 atau -7/2, atau bilangan bulat (sampai 15 angka).')
const ZERO = L('A denominator cannot be 0: dividing by zero is undefined.', 'Penyebut tidak boleh 0: pembagian dengan nol tidak terdefinisi.')

/** `\frac{n}{d}` with the sign inside the numerator, or the bare integer. */
const fr = (n: bigint, d: bigint): string => (d === 1n ? `${n}` : `\\frac{${n}}{${d}}`)
/** A fraction in lowest terms with the minus sign out in front, as it is usually written. */
const frNeat = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
const wrapNeg = (neg: boolean, t: string): string => (neg ? `\\left(${t}\\right)` : t)
const bracket = (n: bigint, d: bigint): string => (n < 0n ? `\\left(${fr(n, d)}\\right)` : fr(n, d))
const mixedTex = (r: Rat): string | null => {
  if (r.d === 1n) return null
  const m = mixed(r)
  if (m.whole === 0n) return null
  return `${m.negative ? '-' : ''}${m.whole}\\frac{${m.rem}}{${m.d}}`
}

/** The decimal of r as TeX: its digits, with a bar over the repeating block, or
 *  an ellipsis when the block is too long to find in `limit` digits. */
function decimalTex(r: Rat, sep: string, limit = 60): string {
  const e = expand(r.n, r.d, limit)
  const point = sep === ',' ? '{,}' : '.'
  const neg = e.negative ? '-' : ''
  if (e.terminating) return `${neg}${e.whole}${e.pre ? point + e.pre : ''}`
  if (e.truncated) return `${neg}${e.whole}${point}${e.pre}\\ldots`
  return `${neg}${e.whole}${point}${e.pre}\\overline{${e.rep}}`
}

/** r as a percentage: exact when it ends, otherwise rounded to two places. */
function percentOf(r: Rat): { text: string; exact: boolean } {
  const p = ratMul(r, rat(100n, 1n))
  const e = expand(p.n, p.d, 20)
  if (e.terminating) return { text: `${e.negative ? '-' : ''}${e.whole}${e.pre ? '.' + e.pre : ''}`, exact: true }
  return { text: roundedDecimal(p, 2), exact: false }
}

function FracInput({ label, value, set, width = '8em' }: { label: string; value: string; set: (s: string) => void; width?: string }) {
  return (
    <label className="lbl">
      {label} <input style={{ width }} value={value} aria-label={label} onChange={(e) => set(e.target.value)} />
    </label>
  )
}

/** A fraction's value as a position on a line, for drawing only: the exact work
 *  is all in BigInt, and a double is plenty for a pixel. */
const asNumber = (r: Rat): number => Number(r.n) / Number(r.d)

/* ----------------------------------------------------------- equivalent bars */

export function FractionBars() {
  const { tc } = useI18n()
  const [n0, setN] = useState(3)
  const [d, setD] = useState(4)
  const [k, setK] = useState(3)
  const n = Math.min(n0, d)
  const W = 460
  const bar = (parts: number, shaded: number, cls: string, y: number) => {
    const w = W / parts
    return (
      <g>
        {Array.from({ length: parts }, (_, i) => (
          <rect key={i} x={10 + i * w} y={y} width={w} height={34} className={`fbpart ${i < shaded ? cls : 'off'}`} />
        ))}
      </g>
    )
  }
  const g = Number(gcd(BigInt(n), BigInt(d)))
  const slider = (name: string, v: number, min: number, max: number, set: (x: number) => void) => (
    <label className="lbl slider">
      {name} = <b>{v}</b>
      <input type="range" min={min} max={max} value={v} aria-label={name} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )

  return (
    <Frame name="fracbars">
      <div className="amctl">
        {slider(tc(L('numerator', 'pembilang')), n, 0, d, setN)}
        {slider(tc(L('denominator', 'penyebut')), d, 1, 12, setD)}
        {slider(tc(L('multiplier k', 'pengali k')), k, 1, 6, setK)}
      </div>
      <svg viewBox={`0 0 ${W + 20} 100`} className="fbsvg" role="img" aria-label={tc(L('Two bars of the same length with the same part shaded', 'Dua batang sama panjang dengan bagian yang sama diarsir'))}>
        {bar(d, n, 'a', 8)}
        {bar(k * d, k * n, 'b', 54)}
      </svg>
      <div className="wgtout" aria-live="polite">
        <p>
          <Tex src={`\\frac{${n}}{${d}}=\\frac{${k}\\cdot${n}}{${k}\\cdot${d}}=\\frac{${k * n}}{${k * d}}`} />
        </p>
        <p className="small muted">
          {tc(L('Cutting every part into k equal pieces changes the numbers but not the amount shaded, so multiplying the top and the bottom by the same k gives an equivalent fraction.', 'Memotong setiap bagian menjadi k potong yang sama mengubah bilangannya tetapi tidak banyaknya yang diarsir, sehingga mengalikan pembilang dan penyebut dengan k yang sama menghasilkan pecahan senilai.'))}{' '}
          {g > 1 && n > 0
            ? tc(L(`The top bar is not in lowest terms: ${n} and ${d} share the factor ${g}.`, `Batang atas belum paling sederhana: ${n} dan ${d} berfaktor sama ${g}.`))
            : tc(L('The top bar is in lowest terms.', 'Batang atas sudah paling sederhana.'))}
        </p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------ simplify */

export function SimplifyFraction() {
  const { tc } = useI18n()
  const sep = useSep()
  const [s, setS] = useState('84/126')
  const f = parseFrac(s)

  let body
  if (f === null) body = <p className="noline">{tc(BAD)}</p>
  else if (f === 'zero') body = <p className="noline">{tc(ZERO)}</p>
  else {
    const g = gcd(f.n, f.d)
    const r = f.n === 0n ? rat(0n, 1n) : rat(f.n, f.d)
    const already = f.n !== 0n && g === 1n
    const mx = mixedTex(r)
    const pf = f.n !== 0n && f.d <= 10n ** 12n && (f.n < 0n ? -f.n : f.n) <= 10n ** 12n ? [factorize(f.n < 0n ? -f.n : f.n), factorize(f.d)] : null
    const ptex = (x: [bigint, number][]) => (x.length ? x.map(([p, k]) => (k > 1 ? `${p}^{${k}}` : `${p}`)).join('\\cdot ') : '1')
    body = (
      <>
        <p className="bigcn">
          <Tex src={`${fr(f.n, f.d)}=${frNeat(r)}`} />
        </p>
        {f.n === 0n ? (
          <p className="small muted">{tc(L('Zero over any non-zero number is 0.', 'Nol dibagi bilangan bukan nol mana pun adalah 0.'))}</p>
        ) : already ? (
          <p className="small muted">{tc(L('The top and the bottom share no factor except 1, so this is already in lowest terms.', 'Pembilang dan penyebut tidak punya faktor sama selain 1, sehingga ini sudah paling sederhana.'))}</p>
        ) : (
          <>
            <p className="small">
              <Tex src={`\\gcd(${f.n < 0n ? -f.n : f.n},${f.d})=${g}`} />
              {' → '}
              <Tex src={`\\frac{${f.n}\\div${g}}{${f.d}\\div${g}}=${frNeat(r)}`} />
            </p>
            {pf && (
              <p className="small muted">
                <Tex src={`${f.n < 0n ? -f.n : f.n}=${ptex(pf[0])},\\quad ${f.d}=${ptex(pf[1])}`} />
              </p>
            )}
          </>
        )}
        <p className="small">
          {mx && (
            <>
              {tc(L('As a mixed number', 'Sebagai bilangan campuran'))}: <Tex src={mx} /> ·{' '}
            </>
          )}
          {tc(L('As a decimal', 'Sebagai desimal'))}: <Tex src={decimalTex(r, sep, 30)} />
        </p>
      </>
    )
  }

  return (
    <Frame name="simplify">
      <div className="inrow">
        <FracInput label={tc(L('Fraction', 'Pecahan'))} value={s} set={setS} width="11em" />
      </div>
      <div className="chips">
        {['84/126', '18/24', '-6/8', '7/-21', '17/5', '5/9', '0/4'].map((p) => (
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

/* ------------------------------------------------------------------- compare */

const LO_VIEW = -6
const HI_VIEW = 6

export function CompareFractions() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('3/5')
  const [sc, setSc] = useState('5/8')
  const a = parseFrac(sa)
  const c = parseFrac(sc)

  let body
  if (a === null || c === null) body = <p className="noline">{tc(BAD)}</p>
  else if (a === 'zero' || c === 'zero') body = <p className="noline">{tc(ZERO)}</p>
  else {
    const ra = rat(a.n, a.d)
    const rc = rat(c.n, c.d)
    const cmp = ratCmp(ra, rc)
    const sym = cmp < 0 ? '<' : cmp > 0 ? '>' : '='
    const left = a.n * c.d
    const right = c.n * a.d
    const mid = ratMul(ratAdd(ra, rc), rat(1n, 2n))
    const xa = asNumber(ra)
    const xc = asNumber(rc)
    const inView = [xa, xc, asNumber(mid)].every((x) => x >= LO_VIEW && x <= HI_VIEW)
    const lo = Math.floor(Math.min(0, xa, xc))
    const hi = Math.ceil(Math.max(1, xa, xc))
    const span = hi - lo
    const px = (v: number) => 20 + ((v - lo) / span) * 480
    body = (
      <>
        <p className="bigcn">
          <Tex src={`${fr(a.n, a.d)}\\;${sym}\\;${fr(c.n, c.d)}`} />
        </p>
        <p className="small">
          {tc(L('Cross-multiply (both denominators are positive):', 'Kalikan silang (kedua penyebut positif):'))} <Tex src={`${a.n}\\cdot${c.d}=${left}`} />, <Tex src={`${c.n}\\cdot${a.d}=${right}`} />
          {' → '}
          {left < right ? tc(L('the left product is smaller, so the left fraction is smaller.', 'hasil kali kiri lebih kecil, sehingga pecahan kiri lebih kecil.')) : left > right ? tc(L('the left product is larger, so the left fraction is larger.', 'hasil kali kiri lebih besar, sehingga pecahan kiri lebih besar.')) : tc(L('the products are equal, so the fractions are equivalent.', 'hasil kalinya sama, sehingga pecahannya senilai.'))}
        </p>
        {inView && (
          <svg viewBox="0 0 520 74" className="nlsvg" role="img" aria-label={tc(L('The two fractions on a number line', 'Kedua pecahan pada garis bilangan'))}>
            <line x1={14} x2={506} y1={30} y2={30} className="nlaxis" />
            {Array.from({ length: span + 1 }, (_, i) => lo + i).map((v) => (
              <g key={v}>
                <line x1={px(v)} x2={px(v)} y1={24} y2={36} className="nltick" />
                <text x={px(v)} y={52} textAnchor="middle" className="nllabel">
                  {v < 0 ? `−${-v}` : v}
                </text>
              </g>
            ))}
            <circle cx={px(xa)} cy={30} r={5.5} className="nldot a" />
            <circle cx={px(xc)} cy={30} r={5.5} className="nldot r" />
            <circle cx={px(asNumber(mid))} cy={30} r={3.5} className="nldot zero" />
            <text x={px(xa)} y={16} textAnchor="middle" className="nllabel">
              {tc(L('left', 'kiri'))}
            </text>
            <text x={px(xc)} y={cmp === 0 ? 68 : 16} textAnchor="middle" className="nllabel">
              {tc(L('right', 'kanan'))}
            </text>
          </svg>
        )}
        {cmp !== 0 && (
          <p className="small muted">
            {tc(L('A fraction strictly between them (their average, the gray dot):', 'Pecahan di antara keduanya (rata-ratanya, titik abu-abu):'))} <Tex src={frNeat(mid)} />
          </p>
        )}
      </>
    )
  }

  return (
    <Frame name="ratcompare">
      <div className="inrow">
        <FracInput label={tc(L('Left', 'Kiri'))} value={sa} set={setSa} />
        <FracInput label={tc(L('Right', 'Kanan'))} value={sc} set={setSc} />
      </div>
      <div className="chips">
        {[['3/5', '5/8'], ['1/3', '1/4'], ['-1/2', '-2/3'], ['2/4', '3/6'], ['7/10', '9/13']].map(([x, y]) => (
          <button
            key={x + y}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSc(y)
            }}
          >
            {x}, {y}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------- operations */

type Op = '+' | '-' | '*' | '/'
const OPS: [Op, string, string][] = [
  ['+', '+', '+'],
  ['-', '−', '-'],
  ['*', '×', '\\cdot '],
  ['/', '÷', '\\div '],
]

export function FractionCalculator() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('2/3')
  const [sc, setSc] = useState('3/4')
  const [op, setOp] = useState<Op>('+')
  const a = parseFrac(sa)
  const c = parseFrac(sc)
  const sym = OPS.find((o) => o[0] === op)![2]

  let body
  if (a === null || c === null) body = <p className="noline">{tc(BAD)}</p>
  else if (a === 'zero' || c === 'zero') body = <p className="noline">{tc(ZERO)}</p>
  else if (op === '/' && c.n === 0n) body = <p className="noline">{tc(L('Dividing by the fraction 0 is not allowed: 0 has no reciprocal.', 'Membagi dengan pecahan 0 tidak diperbolehkan: 0 tidak punya kebalikan.'))}</p>
  else {
    const ra = rat(a.n, a.d)
    const rc = rat(c.n, c.d)
    const result = op === '+' ? ratAdd(ra, rc) : op === '-' ? ratSub(ra, rc) : op === '*' ? ratMul(ra, rc) : ratDiv(ra, rc)
    const lines: string[] = []
    const head = `${bracket(a.n, a.d)}${sym}${bracket(c.n, c.d)}`
    if (op === '+' || op === '-') {
      const o = overCommon(a, c)
      if (a.d === c.d) {
        lines.push(`${head}=\\frac{${a.n}${op === '+' ? '+' : '-'}${c.n < 0n ? `(${c.n})` : c.n}}{${a.d}}=\\frac{${op === '+' ? a.n + c.n : a.n - c.n}}{${a.d}}`)
      } else {
        lines.push(`${head}=\\frac{${a.n}\\cdot${o.fa}}{${a.d}\\cdot${o.fa}}${sym}${wrapNeg(c.n < 0n, `\\frac{${c.n}\\cdot${o.fc}}{${c.d}\\cdot${o.fc}}`)}=\\frac{${o.na}}{${o.l}}${sym}${wrapNeg(o.nc < 0n, `\\frac{${o.nc}}{${o.l}}`)}`)
        lines.push(`=\\frac{${o.na}${op === '+' ? '+' : '-'}${o.nc < 0n ? `(${o.nc})` : o.nc}}{${o.l}}=\\frac{${op === '+' ? o.na + o.nc : o.na - o.nc}}{${o.l}}`)
      }
    } else if (op === '*') {
      lines.push(`${head}=\\frac{${a.n}\\cdot${c.n < 0n ? `(${c.n})` : c.n}}{${a.d}\\cdot${c.d}}=\\frac{${a.n * c.n}}{${a.d * c.d}}`)
    } else {
      // Dividing: flip the second fraction, keeping its sign on the top.
      const fn = c.n < 0n ? -c.d : c.d
      const fd = c.n < 0n ? -c.n : c.n
      lines.push(`${head}=${bracket(a.n, a.d)}\\cdot${bracket(fn, fd)}=\\frac{${a.n}\\cdot${fn < 0n ? `(${fn})` : fn}}{${a.d}\\cdot${fd}}=\\frac{${a.n * fn}}{${a.d * fd}}`)
    }
    const mx = mixedTex(result)
    const ti = termInfo(result)
    const exactDec = result.d === 1n || (ti.terminates && ti.pre <= 4)
    body = (
      <>
        {lines.map((l, i) => (
          <p key={i}>
            <Tex src={l} />
          </p>
        ))}
        <p className="bigcn">
          <Tex src={`${head}=${frNeat(result)}`} />
        </p>
        <p className="small muted">
          {tc(L('Simplified to lowest terms', 'Disederhanakan ke bentuk paling sederhana'))}
          {mx && (
            <>
              {' · '}
              {tc(L('mixed number', 'bilangan campuran'))}: <Tex src={mx} />
            </>
          )}
          {' · '}
          {tc(L('decimal', 'desimal'))}: {roundedDecimal(result, 4).replace('.', tc(L('.', ',')))}
          {exactDec ? '' : ' ≈'}
        </p>
        {op === '+' || op === '-' ? (
          <p className="small muted">{tc(L('Add or subtract only when the denominators match: rewrite both over the least common multiple of the denominators, then combine the tops.', 'Jumlahkan atau kurangkan hanya bila penyebutnya sama: tulis keduanya di atas kelipatan persekutuan terkecil penyebutnya, lalu gabungkan pembilangnya.'))}</p>
        ) : op === '*' ? (
          <p className="small muted">{tc(L('Multiply the tops and multiply the bottoms; no common denominator is needed.', 'Kalikan pembilangnya dan kalikan penyebutnya; tidak perlu penyebut sama.'))}</p>
        ) : (
          <p className="small muted">{tc(L('Dividing by a fraction is multiplying by its reciprocal: flip the second fraction.', 'Membagi dengan pecahan sama dengan mengalikan dengan kebalikannya: balik pecahan kedua.'))}</p>
        )}
      </>
    )
  }

  return (
    <Frame name="ratops">
      <div className="inrow">
        <FracInput label="a" value={sa} set={setSa} />
        <FracInput label="b" value={sc} set={setSc} />
      </div>
      <div className="chips">
        {OPS.map(([id, symbol]) => (
          <button key={id} className={`chip${op === id ? ' on' : ''}`} onClick={() => setOp(id)} aria-label={symbol}>
            a {symbol} b
          </button>
        ))}
        {[['2/3', '3/4'], ['1/2', '-1/3'], ['5/6', '5/9'], ['3/4', '9/10']].map(([x, y]) => (
          <button
            key={x + y}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSc(y)
            }}
          >
            {x}, {y}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------ fraction → decimal */

export function FractionToDecimal() {
  const { tc } = useI18n()
  const sep = useSep()
  const [s, setS] = useState('5/12')
  const f: Frac | 'zero' | null = parseFrac(s, 9)

  let body
  if (f === null) body = <p className="noline">{tc(L('Type a fraction such as 5/12 (up to 9 digits in each part).', 'Ketik pecahan seperti 5/12 (sampai 9 angka pada tiap bagian).'))}</p>
  else if (f === 'zero') body = <p className="noline">{tc(ZERO)}</p>
  else {
    const r = rat(f.n, f.d)
    const e = expand(r.n, r.d, 60)
    const t = termInfo(r)
    const decTex = decimalTex(r, sep)
    const pct = percentOf(r)
    const primes = factorize(r.d)
    const ptex = primes.length ? primes.map(([p, k]) => (k > 1 ? `${p}^{${k}}` : `${p}`)).join('\\cdot ') : '1'
    body = (
      <>
        <p className="bigcn">
          <Tex src={`${frNeat(r)}=${decTex}`} />
        </p>
        <p className="small">
          {r.d === 1n
            ? tc(L('It is a whole number, so there are no decimal places.', 'Ia bilangan bulat, sehingga tidak ada tempat desimal.'))
            : t.terminates
            ? tc(L(`It terminates: the reduced denominator ${r.d} has no prime factors except 2 and 5, so the decimal terminates after ${t.pre} digit${t.pre === 1 ? '' : 's'}.`, `Desimalnya berakhir: penyebut ${r.d} yang sudah disederhanakan tidak punya faktor prima selain 2 dan 5, sehingga desimal berakhir setelah ${t.pre} angka.`))
            : tc(L(`It eventually repeats periodically: the reduced denominator has a prime factor other than 2 and 5. ${t.pre ? `${t.pre} digit${t.pre === 1 ? '' : 's'} come first, then ` : ''}a block of ${t.period ?? e.rep.length} digit${(t.period ?? e.rep.length) === 1 ? '' : 's'} repeats without end.`, `Desimalnya akhirnya berulang secara periodik: penyebut yang sudah disederhanakan punya faktor prima selain 2 dan 5. ${t.pre ? `${t.pre} angka muncul lebih dulu, lalu ` : ''}blok ${t.period ?? e.rep.length} angka berulang tanpa akhir.`))}{' '}
          <Tex src={`${r.d}=${ptex}`} />
        </p>
        <p className="small">
          {tc(L('As a percentage', 'Sebagai persen'))}: {pct.text.replace('.', tc(L('.', ',')))}%{pct.exact ? '' : ' ≈'}
        </p>
        {e.truncated && <p className="small muted">{tc(L('The block is longer than this tool shows.', 'Bloknya lebih panjang daripada yang ditampilkan alat ini.'))}</p>}
      </>
    )
  }

  return (
    <Frame name="ratdecimal">
      <div className="inrow">
        <FracInput label={tc(L('Fraction', 'Pecahan'))} value={s} set={setS} width="11em" />
      </div>
      <div className="chips">
        {['5/12', '3/8', '1/7', '1/6', '7/20', '22/7', '1/97'].map((p) => (
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

