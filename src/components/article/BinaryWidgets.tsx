import { useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { factorize, parseRational } from '../../lib/realnum'
import {
  addColumns,
  asciiLabel,
  bitLength,
  bitwise,
  divisionSteps,
  expandBase,
  fromTwos,
  fromUnsigned,
  group,
  maxUnsigned,
  mulPartials,
  parseBase,
  placeTerms,
  subColumns,
  toBase,
  type BitOp,
} from '../../lib/binary'
import { Tex } from '../ui'
import { Frame, L, groupNumber, useSep } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const BASE_NAME: Record<number, Loc> = {
  2: L('binary', 'biner'),
  8: L('octal', 'oktal'),
  10: L('decimal', 'desimal'),
  16: L('hexadecimal', 'heksadesimal'),
}

function TextInput({ label, value, set, width = '12em' }: { label: string; value: string; set: (s: string) => void; width?: string }) {
  return (
    <label className="lbl">
      {label} <input style={{ width }} value={value} aria-label={label} spellCheck={false} onChange={(e) => set(e.target.value)} />
    </label>
  )
}

/* -------------------------------------------------------------- base converter */

export function BaseConverter() {
  const { tc, lang } = useI18n()
  const [text, setText] = useState('1011010')
  const [base, setBase] = useState(2)
  const v = parseBase(text, base, 40)

  let body
  if (v === null) body = <p className="noline">{tc(L(`Type a whole number in ${tc(BASE_NAME[base])} (digits ${base === 16 ? '0 to 9 and a to f' : `0 to ${base - 1}`}).`, `Ketik bilangan bulat dalam ${tc(BASE_NAME[base])} (angka ${base === 16 ? '0 sampai 9 dan a sampai f' : `0 sampai ${base - 1}`}).`))}</p>
  else if (v < 0n) body = <p className="noline">{tc(L('Use a non-negative whole number here; negative numbers are the subject of two’s complement, below.', 'Pakai bilangan bulat tidak negatif di sini; bilangan negatif adalah pokok bahasan komplemen dua, di bawah.'))}</p>
  else {
    const bin = toBase(v, 2)
    const ladder = divisionSteps(v, 2)
    const terms = placeTerms(bin, 2).filter((t) => t.digit === 1)
    body = (
      <>
        <div className="gridwrap">
          <table className="rtable">
            <tbody>
              <tr>
                <th>{tc(BASE_NAME[2])}</th>
                <td className="mono">{group(bin, 4)}</td>
              </tr>
              <tr>
                <th>{tc(BASE_NAME[8])}</th>
                <td className="mono">{toBase(v, 8)}</td>
              </tr>
              <tr>
                <th>{tc(BASE_NAME[10])}</th>
                <td className="mono">{groupNumber(v, lang)}</td>
              </tr>
              <tr>
                <th>{tc(BASE_NAME[16])}</th>
                <td className="mono">{toBase(v, 16).toUpperCase()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small">
          {tc(L('Number of bits', 'Banyak bit'))}: <b>{bitLength(v)}</b>
          {v > 0n && (
            <>
              {' · '}
              {tc(L('Sum of the powers of 2', 'Jumlah pangkat 2'))}: <Tex src={`${terms.map((t) => `2^{${t.power}}`).join('+')}=${v}`} />
            </>
          )}
        </p>
        {ladder.length <= 20 && v > 0n && (
          <div className="gridwrap">
            <table className="rtable">
              <thead>
                <tr>
                  <th>{tc(L('Divide by 2', 'Bagi 2'))}</th>
                  <th>{tc(L('Quotient', 'Hasil bagi'))}</th>
                  <th>{tc(L('Remainder (a bit)', 'Sisa (satu bit)'))}</th>
                </tr>
              </thead>
              <tbody>
                {ladder.map((r, i) => (
                  <tr key={i}>
                    <td>{r.n.toString()} ÷ 2</td>
                    <td>{r.q.toString()}</td>
                    <td>
                      <b>{r.r}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="small muted">
          {tc(L('Read the remainders from the bottom up to get the binary digits. To go the other way, add the powers of 2 under every 1.', 'Baca sisa dari bawah ke atas untuk mendapat angka biner. Untuk arah sebaliknya, jumlahkan pangkat 2 di bawah setiap angka 1.'))}
        </p>
      </>
    )
  }

  return (
    <Frame name="baseconv">
      <div className="inrow">
        <TextInput label={tc(L('Number', 'Bilangan'))} value={text} set={setText} />
      </div>
      <div className="chips">
        {[2, 8, 10, 16].map((b) => (
          <button
            key={b}
            className={`chip${base === b ? ' on' : ''}`}
            onClick={() => {
              const cur = parseBase(text, base, 40)
              setBase(b)
              if (cur !== null && cur >= 0n) setText(toBase(cur, b))
            }}
          >
            {tc(L('in', 'dalam'))} {tc(BASE_NAME[b])}
          </button>
        ))}
        {[['1011010', 2], ['255', 10], ['ff', 16], ['100', 10], ['777', 8]].map(([t, b]) => (
          <button
            key={`${t}${b}`}
            className="chip ghost"
            onClick={() => {
              setBase(b as number)
              setText(t as string)
            }}
          >
            {t} ({b})
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------ binary arithmetic */

type Arith = '+' | '-' | '*'

export function BinaryArithmetic() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('1011')
  const [sb, setSb] = useState('110')
  const [op, setOp] = useState<Arith>('+')
  const a = /^[01]{1,16}$/.test(sa.trim()) ? sa.trim() : null
  const b = /^[01]{1,16}$/.test(sb.trim()) ? sb.trim() : null

  let body
  if (!a || !b) body = <p className="noline">{tc(L('Type binary numbers: only 0 and 1, up to 16 digits.', 'Ketik bilangan biner: hanya 0 dan 1, sampai 16 angka.'))}</p>
  else {
    const x = fromUnsigned(a)
    const y = fromUnsigned(b)
    const spaced = (s: string) => s.split('').join(' ')
    const lines: string[] = []
    let note = ''
    let result = ''
    let decimal = ''
    if (op === '+') {
      const c = addColumns(a, b)
      const carry = c.carries.split('').map((d) => (d === '1' ? '1' : ' '))
      lines.push(`carry  ${carry.join(' ')}`, `       ${spaced(c.a)}`, `     + ${spaced(c.b)}`, `       ${'-'.repeat(c.width * 2 - 1)}`, `       ${spaced(c.result)}`)
      result = c.result.replace(/^0+(?=.)/, '')
      decimal = `${x} + ${y} = ${x + y}`
      note = tc(L('Add each column; 1 + 1 = 10, so write 0 and carry 1 to the next column on the left.', 'Jumlahkan tiap kolom; 1 + 1 = 10, jadi tulis 0 dan bawa 1 ke kolom berikutnya di kiri.'))
    } else if (op === '-') {
      const swap = x < y
      const [hi, lo] = swap ? [b, a] : [a, b]
      const c = subColumns(hi, lo)
      const borrow = c.carries.split('').map((d) => (d === '1' ? '1' : ' '))
      lines.push(`borrow ${borrow.join(' ')}`, `       ${spaced(c.a)}`, `     − ${spaced(c.b)}`, `       ${'-'.repeat(c.width * 2 - 1)}`, `       ${spaced(c.result)}`)
      result = (swap ? '-' : '') + c.result.replace(/^0+(?=.)/, '')
      decimal = `${x} − ${y} = ${x - y}`
      note = swap
        ? tc(L('a is smaller than b, so the working shows b − a; the answer is its negative.', 'a lebih kecil dari b, sehingga langkah di atas menunjukkan b − a; jawabannya adalah negatifnya.'))
        : tc(L('When a column cannot take its digit away, borrow 1 from the column on the left, which is worth 2 here.', 'Bila sebuah kolom tidak dapat dikurangi, pinjam 1 dari kolom di kiri, yang bernilai 2 di sini.'))
    } else {
      const parts = mulPartials(a, b)
      const total = toBase(x * y, 2)
      const w = Math.max(total.length, a.length + b.length) + 1
      lines.push(`       ${spaced(a.padStart(w, ' '))}`, `     × ${spaced(b.padStart(w, ' '))}`, `       ${'-'.repeat(w * 2 - 1)}`)
      for (const p of parts) lines.push(`       ${spaced(p.text.padStart(w, ' '))}`)
      lines.push(`       ${'-'.repeat(w * 2 - 1)}`, `       ${spaced(total.padStart(w, ' '))}`)
      result = total
      decimal = `${x} × ${y} = ${x * y}`
      note = tc(L('Each 1 in the lower number gives a copy of the upper number shifted left by its place; each 0 gives 0. Then add the copies.', 'Setiap angka 1 pada bilangan bawah memberi salinan bilangan atas yang digeser ke kiri sesuai tempatnya; setiap angka 0 memberi 0. Lalu jumlahkan salinannya.'))
    }
    body = (
      <>
        <pre className="code binpre" aria-label={tc(L('Column working', 'Langkah per kolom'))}>{lines.join('\n')}</pre>
        <p className="bigcn">
          <span className="mono">
            {a} {op === '+' ? '+' : op === '-' ? '−' : '×'} {b} = {result}
          </span>
        </p>
        <p className="small">{decimal}</p>
        <p className="small muted">{note}</p>
      </>
    )
  }

  return (
    <Frame name="binarith">
      <div className="inrow">
        <TextInput label="a" value={sa} set={setSa} width="10em" />
        <TextInput label="b" value={sb} set={setSb} width="10em" />
      </div>
      <div className="chips">
        {([['+', '+'], ['-', '−'], ['*', '×']] as [Arith, string][]).map(([id, sym]) => (
          <button key={id} className={`chip${op === id ? ' on' : ''}`} onClick={() => setOp(id)} aria-label={sym}>
            a {sym} b
          </button>
        ))}
        {[['1011', '110'], ['1111', '1'], ['101', '11'], ['10000', '1']].map(([x, y]) => (
          <button
            key={x + y}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSb(y)
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

/* ------------------------------------------------------------------ bit editor */

export function BitEditor() {
  const { tc } = useI18n()
  const [width, setWidth] = useState(8)
  const [value, setValue] = useState(65n)
  const mask = maxUnsigned(width)
  const v = value & mask
  const bits = toBase(v, 2).padStart(width, '0')
  const signed = fromTwos(bits)
  const ascii = width === 8 ? asciiLabel(Number(v)) : null

  const toggle = (i: number) => setValue(v ^ (1n << BigInt(width - 1 - i)))
  const act = (f: (x: bigint) => bigint) => setValue(f(v) & mask)

  return (
    <Frame name="bitedit">
      <div className="chips">
        {[8, 16].map((w) => (
          <button key={w} className={`chip${width === w ? ' on' : ''}`} onClick={() => setWidth(w)}>
            {w} {tc(L('bits', 'bit'))}
          </button>
        ))}
      </div>
      <div className="bitrow" role="group" aria-label={tc(L('The bits, most significant first', 'Bit-bitnya, yang paling bermakna lebih dulu'))}>
        {bits.split('').map((d, i) => (
          <button key={i} className={`bit${d === '1' ? ' on' : ''}`} onClick={() => toggle(i)} aria-pressed={d === '1'} aria-label={`2^${width - 1 - i}`}>
            <span className="bitw">{(1n << BigInt(width - 1 - i)).toString()}</span>
            <span className="bitv">{d}</span>
          </button>
        ))}
      </div>
      <div className="chips">
        <button className="chip" onClick={() => act((x) => x + 1n)}>
          +1
        </button>
        <button className="chip" onClick={() => act((x) => x - 1n + (1n << BigInt(width)))}>
          −1
        </button>
        <button className="chip" onClick={() => act((x) => mask ^ x)}>
          NOT
        </button>
        <button className="chip" onClick={() => act((x) => x << 1n)}>
          ×2 (&lt;&lt; 1)
        </button>
        <button className="chip" onClick={() => act((x) => x >> 1n)}>
          ÷2 (&gt;&gt; 1)
        </button>
        <button className="chip ghost" onClick={() => setValue(0n)}>
          {tc(L('Clear', 'Kosongkan'))}
        </button>
        <button className="chip ghost" onClick={() => setValue(mask)}>
          {tc(L('All ones', 'Semua satu'))}
        </button>
      </div>
      <div className="wgtout" aria-live="polite">
        <div className="gridwrap">
          <table className="rtable">
            <tbody>
              <tr>
                <th>{tc(L('Unsigned', 'Tanpa tanda'))}</th>
                <td className="mono">{v.toString()}</td>
              </tr>
              <tr>
                <th>{tc(L('Signed (two’s complement)', 'Bertanda (komplemen dua)'))}</th>
                <td className="mono">{signed.toString()}</td>
              </tr>
              <tr>
                <th>{tc(L('Hexadecimal', 'Heksadesimal'))}</th>
                <td className="mono">{toBase(v, 16).toUpperCase().padStart(width / 4, '0')}</td>
              </tr>
              <tr>
                <th>{tc(L('Octal', 'Oktal'))}</th>
                <td className="mono">{toBase(v, 8)}</td>
              </tr>
              {ascii && (
                <tr>
                  <th>ASCII</th>
                  <td className="mono">{ascii.printable ? `“${ascii.text}”` : ascii.text}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="small muted">
          {tc(L('Click a bit to flip it. The leftmost bit counts as −2^(n−1) in the signed reading, which is why 10000000 is −128 and 11111111 is −1.', 'Klik sebuah bit untuk membaliknya. Bit paling kiri bernilai −2^(n−1) pada pembacaan bertanda, itulah sebabnya 10000000 adalah −128 dan 11111111 adalah −1.'))}
        </p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------ bitwise operators */

const OPS: { id: BitOp; label: string; sym: string }[] = [
  { id: 'and', label: 'AND', sym: '&' },
  { id: 'or', label: 'OR', sym: '|' },
  { id: 'xor', label: 'XOR', sym: '^' },
  { id: 'not', label: 'NOT a', sym: '~' },
  { id: 'shl', label: 'a << b', sym: '<<' },
  { id: 'shr', label: 'a >> b', sym: '>>' },
]

export function BitwiseOperations() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('172')
  const [sb, setSb] = useState('202')
  const [op, setOp] = useState<BitOp>('and')
  const na = parseBase(sa, 10, 3)
  const nb = parseBase(sb, 10, 3)
  const ok = na !== null && nb !== null && na >= 0n && na <= 255n && nb >= 0n && nb <= 255n
  const shift = op === 'shl' || op === 'shr'
  const bits8 = (n: bigint) => toBase(n, 2).padStart(8, '0')

  let body
  if (!ok) body = <p className="noline">{tc(L('Type whole numbers from 0 to 255 (one byte).', 'Ketik bilangan bulat dari 0 sampai 255 (satu byte).'))}</p>
  else if (shift && nb > 8n) body = <p className="noline">{tc(L('For a shift, b is how many places to shift: use 0 to 8.', 'Untuk geseran, b adalah banyak tempat yang digeser: pakai 0 sampai 8.'))}</p>
  else {
    const r = bitwise(op, na, nb, 8)
    const sym = OPS.find((o) => o.id === op)!.sym
    body = (
      <>
        <pre className="code binpre">
          {[
            `  a   ${group(bits8(na), 4)}   (${na})`,
            op === 'not' ? '' : `  b   ${shift ? `shift by ${nb}` : `${group(bits8(nb), 4)}   (${nb})`}`,
            `      ${'-'.repeat(9)}`,
            `  ${op === 'not' ? '~a ' : shift ? 'res' : `a ${sym} b`.padEnd(3)} ${group(bits8(r), 4)}   (${r})`,
          ]
            .filter(Boolean)
            .join('\n')}
        </pre>
        <p className="small muted">
          {op === 'and' && tc(L('AND keeps a 1 only where both numbers have a 1: it is how a mask picks out bits.', 'AND mempertahankan angka 1 hanya di tempat kedua bilangan punya 1: begitulah topeng (mask) memilih bit.'))}
          {op === 'or' && tc(L('OR gives a 1 where either number has a 1: it switches bits on.', 'OR memberi 1 di tempat salah satu bilangan punya 1: ia menyalakan bit.'))}
          {op === 'xor' && tc(L('XOR gives a 1 where the bits differ: it flips bits, and x XOR x is always 0.', 'XOR memberi 1 di tempat bitnya berbeda: ia membalik bit, dan x XOR x selalu 0.'))}
          {op === 'not' && tc(L('NOT flips every bit of a byte, so ~a = 255 − a.', 'NOT membalik setiap bit dalam satu byte, sehingga ~a = 255 − a.'))}
          {op === 'shl' && tc(L('Shifting left by b places multiplies by 2^b; bits pushed past the eighth place are lost.', 'Menggeser ke kiri sebanyak b tempat mengalikan dengan 2^b; bit yang melewati tempat kedelapan hilang.'))}
          {op === 'shr' && tc(L('Shifting right by b places divides by 2^b and drops the remainder.', 'Menggeser ke kanan sebanyak b tempat membagi dengan 2^b dan membuang sisanya.'))}
        </p>
      </>
    )
  }

  return (
    <Frame name="bitops">
      <div className="inrow">
        <TextInput label="a" value={sa} set={setSa} width="6em" />
        <TextInput label={shift ? tc(L('b (places)', 'b (tempat)')) : 'b'} value={sb} set={setSb} width="6em" />
      </div>
      <div className="chips">
        {OPS.map((o) => (
          <button key={o.id} className={`chip${op === o.id ? ' on' : ''}`} onClick={() => setOp(o.id)}>
            {o.label}
          </button>
        ))}
        {[['172', '202'], ['255', '15'], ['5', '3'], ['1', '7']].map(([x, y]) => (
          <button
            key={x + y}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSb(y)
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

/* ---------------------------------------------------------- fractions in binary */

export function BinaryFraction() {
  const { tc } = useI18n()
  const sep = useSep()
  const [s, setS] = useState('0.1')
  const [base, setBase] = useState(2)
  const r = parseRational(s)
  const point = sep === ',' ? '{,}' : '.'

  let body
  if (!r || (r.n < 0n ? -r.n : r.n) > 10n ** 9n || r.d > 10n ** 9n) body = <p className="noline">{tc(L('Type a number such as 0.1, 3/8 or 5.75 (up to 9 digits).', 'Ketik bilangan seperti 0,1, 3/8, atau 5,75 (sampai 9 angka).'))}</p>
  else {
    const e = expandBase(r, base, 60)
    const neg = e.negative ? '-' : ''
    const tex = e.terminating
      ? `${neg}${e.whole}${e.pre ? point + e.pre : ''}`
      : e.truncated
        ? `${neg}${e.whole}${point}${e.pre}\\ldots`
        : `${neg}${e.whole}${point}${e.pre}\\overline{${e.rep}}`
    const primes = factorize(r.d)
    const ptex = primes.length ? primes.map(([p, k]) => (k > 1 ? `${p}^{${k}}` : `${p}`)).join('\\cdot ') : '1'
    // The first few steps of long multiplication, on the fractional part.
    const steps: { rem: bigint; digit: string }[] = []
    {
      const n = r.n < 0n ? -r.n : r.n
      let rem = n % r.d
      for (let i = 0; i < 6 && rem !== 0n; i++) {
        const t = rem * BigInt(base)
        steps.push({ rem, digit: toBase(t / r.d, base) })
        rem = t % r.d
      }
    }
    const frac = r.d === 1n
    body = (
      <>
        <p className="bigcn">
          <Tex src={`${r.d === 1n ? r.n : r.n < 0n ? `-\\frac{${-r.n}}{${r.d}}` : `\\frac{${r.n}}{${r.d}}`}=${tex}_{${base}}`} />
        </p>
        {!frac && (
          <>
            <p className="small">
              {e.terminating
                ? tc(L(`It terminates: every prime factor of the denominator divides ${base}.`, `Ia berakhir: setiap faktor prima penyebut membagi ${base}.`))
                : tc(L(`It eventually repeats periodically: the denominator has a prime factor that does not divide ${base}.`, `Ia akhirnya berulang secara periodik: penyebut punya faktor prima yang tidak membagi ${base}.`))}{' '}
              <Tex src={`${r.d}=${ptex}`} />
            </p>
            {steps.length > 0 && (
              <div className="gridwrap">
                <table className="rtable">
                  <thead>
                    <tr>
                      <th>{tc(L('Fraction left', 'Pecahan sisa'))}</th>
                      <th>× {base}</th>
                      <th>{tc(L('Digit', 'Angka'))}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {steps.map((st, i) => (
                      <tr key={i}>
                        <td>
                          <Tex src={`\\frac{${st.rem}}{${r.d}}`} />
                        </td>
                        <td>
                          <Tex src={`\\frac{${st.rem * BigInt(base)}}{${r.d}}`} />
                        </td>
                        <td>
                          <b>{st.digit}</b>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {base === 2 && !e.terminating && (
          <p className="small muted">{tc(L('A computer keeps only a fixed number of these binary digits, so it stores the nearest value it can: that is the reason 0.1 + 0.2 is not exactly 0.3.', 'Komputer hanya menyimpan sejumlah tetap angka biner ini, sehingga menyimpan nilai terdekat yang dapat disimpan: itulah sebabnya 0,1 + 0,2 tidak persis 0,3.'))}</p>
        )}
        {base === 2 && e.terminating && !frac && (
          <p className="small muted">{tc(L('A fraction whose denominator is a power of 2 is stored exactly.', 'Pecahan yang penyebutnya pangkat 2 disimpan secara eksak.'))}</p>
        )}
      </>
    )
  }

  return (
    <Frame name="binfrac">
      <div className="inrow">
        <TextInput label={tc(L('Number', 'Bilangan'))} value={s} set={setS} width="10em" />
      </div>
      <div className="chips">
        {[2, 8, 16].map((b) => (
          <button key={b} className={`chip${base === b ? ' on' : ''}`} onClick={() => setBase(b)}>
            {tc(L('in', 'dalam'))} {tc(BASE_NAME[b])}
          </button>
        ))}
        {['0.1', '0.5', '0.75', '1/3', '3/8', '5.75', '0.2'].map((p) => (
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

