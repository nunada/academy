import { useState } from 'react'
import { useI18n } from '../../i18n'
import { parseRational } from '../../lib/realnum'
import { parseInteger } from '../../lib/integers'
import { ratAdd, ratMul, ratSub } from '../../lib/rationals'
import { analyse, fromTwoTerms, geometricRatio, linearForm, nthTerm, partialSum, rat, sumFirstLast, terms, type Rat } from '../../lib/sequences'
import { Tex } from '../ui'
import { Frame, L } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const ratTex = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
const paren = (r: Rat): string => (r.n < 0n ? `\\left(${ratTex(r)}\\right)` : ratTex(r))
const num = (r: Rat): number => Number(r.n) / Number(r.d)
const small = (r: Rat | null): r is Rat => r !== null && (r.n < 0n ? -r.n : r.n) <= 999999n && r.d <= 9999n
const isOne = (r: Rat) => r.n === 1n && r.d === 1n
const isZero = (r: Rat) => r.n === 0n

/** dn + c as TeX, dropping what is 0 or 1. */
function linTex(slope: Rat, intercept: Rat): string {
  let out = ''
  if (!isZero(slope)) out += isOne(slope) ? 'n' : slope.n === -1n && slope.d === 1n ? '-n' : `${ratTex(slope)}n`
  if (!isZero(intercept)) {
    const neg = intercept.n < 0n
    const mag = neg ? rat(-intercept.n, intercept.d) : intercept
    out += out ? `${neg ? '-' : '+'}${ratTex(mag)}` : ratTex(intercept)
  }
  return out || '0'
}

const BAD = L('Type a whole number or a fraction such as 3, -1.5 or 2/3.', 'Ketik bilangan bulat atau pecahan seperti 3, -1,5, atau 2/3.')

function Field({ label, value, set, width = '6em' }: { label: string; value: string; set: (s: string) => void; width?: string }) {
  return (
    <label className="lbl">
      {label} <input style={{ width }} value={value} aria-label={label} onChange={(e) => set(e.target.value)} />
    </label>
  )
}

/* -------------------------------------------------------------------- explorer */

export function SequenceExplorer() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('3')
  const [sd, setSd] = useState('4')
  const [n, setN] = useState(10)
  const a1 = parseRational(sa)
  const d = parseRational(sd)

  let body
  if (!small(a1) || !small(d)) body = <p className="noline">{tc(BAD)}</p>
  else {
    const ts = terms(a1, d, n)
    const last = ts[n - 1]
    const lf = linearForm(a1, d)
    const shown = n <= 8 ? ts.map(ratTex).join(',\\ ') : `${ts.slice(0, 6).map(ratTex).join(',\\ ')},\\ \\ldots,\\ ${ratTex(last)}`
    const sum = partialSum(a1, d, BigInt(n))
    const vals = ts.map(num)
    const lo = Math.min(0, ...vals)
    const hi = Math.max(0, ...vals)
    const span = hi - lo || 1
    const W = 520
    const H = 190
    const px = (k: number) => 44 + ((k - 1) / Math.max(n - 1, 1)) * (W - 70)
    const py = (v: number) => H - 24 - ((v - lo) / span) * (H - 48)
    body = (
      <>
        <p>
          <Tex src={`${shown}`} />
        </p>
        <p>
          <Tex src={`a_n=a_1+(n-1)d=${ratTex(a1)}+(n-1)\\cdot${paren(d)}=${linTex(lf.slope, lf.intercept)}`} />
        </p>
        <p>
          <Tex src={`S_{${n}}=\\frac{${n}}{2}\\left(a_1+a_{${n}}\\right)=\\frac{${n}}{2}\\left(${ratTex(a1)}+${paren(last)}\\right)=${ratTex(sum)}`} />
        </p>
        <svg viewBox={`0 0 ${W} ${H}`} className="nlsvg" role="img" aria-label={tc(L('The terms plotted against their position: points on a straight line', 'Suku-suku diplot terhadap posisinya: titik-titik pada garis lurus'))}>
          <line x1={36} x2={W - 10} y1={py(0)} y2={py(0)} className="nlaxis" />
          <line x1={36} x2={36} y1={10} y2={H - 14} className="nltick" />
          <line x1={px(1)} y1={py(vals[0])} x2={px(n)} y2={py(vals[n - 1])} className="seqline" />
          {vals.map((v, i) => (
            <circle key={i} cx={px(i + 1)} cy={py(v)} r={3.6} className="nldot a" />
          ))}
          <text x={px(1)} y={H - 6} textAnchor="middle" className="nllabel">
            1
          </text>
          <text x={px(n)} y={H - 6} textAnchor="middle" className="nllabel">
            {n}
          </text>
          <text x={30} y={py(hi) + 4} textAnchor="end" className="nllabel">
            {Math.round(hi * 100) / 100}
          </text>
          {lo < 0 && (
            <text x={30} y={py(lo) + 4} textAnchor="end" className="nllabel">
              {Math.round(lo * 100) / 100}
            </text>
          )}
        </svg>
        <p className="small muted">
          {isZero(d)
            ? tc(L('The difference is 0, so every term is the same: a constant sequence.', 'Bedanya 0, sehingga setiap suku sama: barisan konstan.'))
            : d.n > 0n
              ? tc(L('The difference is positive, so the terms increase. The points lie on a straight line with slope d.', 'Bedanya positif, sehingga suku-sukunya naik. Titik-titiknya terletak pada garis lurus berkemiringan d.'))
              : tc(L('The difference is negative, so the terms decrease. The points lie on a straight line with slope d.', 'Bedanya negatif, sehingga suku-sukunya turun. Titik-titiknya terletak pada garis lurus berkemiringan d.'))}
        </p>
      </>
    )
  }

  return (
    <Frame name="arithseq">
      <div className="inrow">
        <Field label="a₁" value={sa} set={setSa} />
        <Field label="d" value={sd} set={setSd} />
      </div>
      <label className="lbl slider">
        n = <b>{n}</b>
        <input type="range" min={1} max={20} value={n} aria-label="n" onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <div className="chips">
        {[['3', '4'], ['10', '-3'], ['1/2', '1/2'], ['7', '0'], ['-5', '2.5']].map(([x, y]) => (
          <button
            key={x + y}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSd(y)
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

/* -------------------------------------------------------------------- detector */

export function SequenceDetector() {
  const { tc, lang } = useI18n()
  const [text, setText] = useState('3 7 11 15 19')
  // In Indonesian a comma is a decimal comma, so the numbers are separated by spaces or semicolons there.
  const tokens = text
    .split(lang === 'id' ? /[\s;]+/ : /[\s;,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
  const values = tokens.map((t) => parseRational(t))
  const ok = tokens.length >= 2 && tokens.length <= 20 && values.every(small)

  let body
  if (!ok) body = <p className="noline">{tc(L(`Type 2 to 20 numbers separated by ${lang === 'id' ? 'spaces' : 'spaces or commas'}, such as 3 7 11 15.`, 'Ketik 2 sampai 20 bilangan yang dipisahkan spasi, seperti 3 7 11 15.'))}</p>
  else {
    const vs = values as Rat[]
    const a = analyse(vs)
    const second = analyse(a.diffs)
    const ratio = geometricRatio(vs)
    body = (
      <>
        <div className="gridwrap">
          <table className="rtable">
            <tbody>
              <tr>
                <th>{tc(L('Terms', 'Suku'))}</th>
                {vs.map((v, i) => (
                  <td key={i}>
                    <Tex src={ratTex(v)} />
                  </td>
                ))}
              </tr>
              <tr>
                <th>{tc(L('Differences', 'Selisih'))}</th>
                {a.diffs.map((v, i) => (
                  <td key={i} className={a.firstBreak !== null && i >= a.firstBreak ? 'grp1' : 'grp3'}>
                    <Tex src={ratTex(v)} />
                  </td>
                ))}
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        {a.arithmetic ? (
          <>
            <p className="okline">{tc(L('Arithmetic: every difference is the same.', 'Aritmetika: setiap selisih sama.'))}</p>
            <p>
              <Tex src={`d=${ratTex(a.d!)},\\quad a_n=${ratTex(vs[0])}+(n-1)\\cdot${paren(a.d!)}=${linTex(a.d!, ratSub(vs[0], a.d!))}`} />
            </p>
            <p className="small muted">
              {tc(L('Next terms', 'Suku berikutnya'))}: <Tex src={terms(ratAdd(vs[vs.length - 1], a.d!), a.d!, 3).map(ratTex).join(',\\ ')} />
              {' · '}
              {tc(L('Sum of these terms', 'Jumlah suku-suku ini'))}: <Tex src={ratTex(sumFirstLast(vs[0], vs[vs.length - 1], BigInt(vs.length)))} />
            </p>
          </>
        ) : (
          <>
            <p className="noline">
              {tc(L(`Not arithmetic: the differences are not all equal (the first one that breaks the pattern is between terms ${a.firstBreak! + 2} and ${a.firstBreak! + 3}).`, `Bukan aritmetika: selisihnya tidak semuanya sama (yang pertama menyimpang ada di antara suku ${a.firstBreak! + 2} dan ${a.firstBreak! + 3}).`))}
            </p>
            <p className="small muted">
              {ratio
                ? tc(L('Every term is the same multiple of the one before: this looks like a geometric sequence, with common ratio ', 'Setiap suku adalah kelipatan yang sama dari suku sebelumnya: ini tampak seperti barisan geometri, dengan rasio '))
                : second.arithmetic
                  ? tc(L('The differences themselves form an arithmetic sequence, so the terms follow a quadratic pattern.', 'Selisihnya sendiri membentuk barisan aritmetika, sehingga suku-sukunya mengikuti pola kuadrat.'))
                  : tc(L('No simple pattern of differences or ratios was found.', 'Tidak ditemukan pola selisih atau rasio yang sederhana.'))}
              {ratio && <Tex src={ratTex(ratio)} />}
            </p>
          </>
        )}
      </>
    )
  }

  return (
    <Frame name="arithdetect">
      <div className="inrow">
        <Field label={tc(L('Numbers', 'Bilangan'))} value={text} set={setText} width="18em" />
      </div>
      <div className="chips">
        {['3 7 11 15 19', '20 17 14 11', '2 4 8 16', '1 4 9 16 25', '0.5 1 1.5 2', '5 5 5 5'].map((p) => (
          <button key={p} className="chip ghost" onClick={() => setText(lang === 'id' ? p.replace(/(\d)\.(\d)/g, '$1,$2') : p)}>
            {lang === 'id' ? p.replace(/(\d)\.(\d)/g, '$1,$2') : p}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* --------------------------------------------------------------- Gauss pairing */

export function GaussPairing() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('2')
  const [sd, setSd] = useState('3')
  const [sn, setSn] = useState('10')
  const a1 = parseRational(sa)
  const d = parseRational(sd)
  const n = parseInteger(sn, 3)

  let body
  if (!small(a1) || !small(d) || n === null || n < 1n || n > 16n) body = <p className="noline">{tc(L('Give a first term, a difference and a number of terms n from 1 to 16.', 'Beri suku pertama, beda, dan banyak suku n dari 1 sampai 16.'))}</p>
  else {
    const N = Number(n)
    const ts = terms(a1, d, N)
    const pair = ratAdd(ts[0], ts[N - 1])
    const total = partialSum(a1, d, n)
    body = (
      <>
        <div className="gridwrap">
          <table className="rtable">
            <thead>
              <tr>
                <th>k</th>
                <th>
                  <Tex src="a_k" />
                </th>
                <th>
                  <Tex src={`a_{${N}+1-k}`} />
                </th>
                <th>{tc(L('Sum of the pair', 'Jumlah pasangan'))}</th>
              </tr>
            </thead>
            <tbody>
              {ts.map((t, k) => (
                <tr key={k}>
                  <td>{k + 1}</td>
                  <td>
                    <Tex src={ratTex(t)} />
                  </td>
                  <td>
                    <Tex src={ratTex(ts[N - 1 - k])} />
                  </td>
                  <td className="grp3">
                    <Tex src={ratTex(ratAdd(t, ts[N - 1 - k]))} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <Tex src={`2S_{${N}}=${N}\\cdot${paren(pair)}=${ratTex(ratMul(rat(n, 1n), pair))}\\quad\\Rightarrow\\quad S_{${N}}=${ratTex(total)}`} />
        </p>
        <p className="small muted">{tc(L('Writing the terms forwards and backwards, every column adds to the same number, the first term plus the last. Adding both rows gives the sum twice.', 'Menuliskan suku-suku maju dan mundur, setiap kolom berjumlah sama, yaitu suku pertama ditambah suku terakhir. Menjumlahkan kedua baris memberi jumlah dua kali.'))}</p>
      </>
    )
  }

  return (
    <Frame name="gauss">
      <div className="inrow">
        <Field label="a₁" value={sa} set={setSa} />
        <Field label="d" value={sd} set={setSd} />
        <Field label="n" value={sn} set={setSn} width="4em" />
      </div>
      <div className="chips">
        {[['1', '1', '10'], ['1', '2', '8'], ['2', '3', '10'], ['10', '-2', '9']].map(([x, y, z]) => (
          <button
            key={x + y + z}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSd(y)
              setSn(z)
            }}
          >
            {x}, {y}, {z}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------ two terms */

export function TwoTerms() {
  const { tc } = useI18n()
  const [sp, setSp] = useState('3')
  const [sx, setSx] = useState('11')
  const [sq, setSq] = useState('7')
  const [sy, setSy] = useState('23')
  const [sn, setSn] = useState('20')
  const p = parseInteger(sp, 4)
  const q = parseInteger(sq, 4)
  const x = parseRational(sx)
  const y = parseRational(sy)
  const n = parseInteger(sn, 6)

  let body
  if (p === null || q === null || p < 1n || q < 1n || !small(x) || !small(y)) body = <p className="noline">{tc(L('Positions must be positive whole numbers and the terms whole numbers or fractions.', 'Posisi harus bilangan bulat positif dan sukunya bilangan bulat atau pecahan.'))}</p>
  else if (p === q) body = <p className="noline">{tc(L('Use two different positions: one term cannot give both a₁ and d.', 'Pakai dua posisi berbeda: satu suku tidak dapat memberi a₁ dan d sekaligus.'))}</p>
  else {
    const f = fromTwoTerms(p, x, q, y)!
    const lf = linearForm(f.a1, f.d)
    const step = ratSub(y, x)
    body = (
      <>
        <p>
          <Tex src={`d=\\frac{a_{${q}}-a_{${p}}}{${q}-${p}}=\\frac{${ratTex(y)}-${paren(x)}}{${q - p}}=\\frac{${ratTex(step)}}{${q - p}}=${ratTex(f.d)}`} />
        </p>
        <p>
          <Tex src={`a_1=a_{${p}}-(${p}-1)d=${ratTex(x)}-${p - 1n}\\cdot${paren(f.d)}=${ratTex(f.a1)}`} />
        </p>
        <p className="bigcn">
          <Tex src={`a_n=${linTex(lf.slope, lf.intercept)}`} />
        </p>
        <p className="small">{terms(f.a1, f.d, 6).map((t) => num(t)).join(', ').replace(/\./g, tc(L('.', ',')))}, …</p>
        {n !== null && n >= 1n && (
          <p className="small">
            <Tex src={`a_{${n}}=${ratTex(nthTerm(f.a1, f.d, n))},\\qquad S_{${n}}=${ratTex(partialSum(f.a1, f.d, n))}`} />
          </p>
        )}
      </>
    )
  }

  return (
    <Frame name="twoterms">
      <div className="inrow">
        <Field label={tc(L('position p', 'posisi p'))} value={sp} set={setSp} width="4em" />
        <Field label={tc(L('a_p', 'a_p'))} value={sx} set={setSx} width="5em" />
        <Field label={tc(L('position q', 'posisi q'))} value={sq} set={setSq} width="4em" />
        <Field label={tc(L('a_q', 'a_q'))} value={sy} set={setSy} width="5em" />
        <Field label="n" value={sn} set={setSn} width="4em" />
      </div>
      <div className="chips">
        {[['3', '11', '7', '23'], ['4', '17', '9', '42'], ['2', '10', '6', '-2'], ['1', '1/2', '5', '5/2']].map(([a, b, c, e]) => (
          <button
            key={a + b + c + e}
            className="chip ghost"
            onClick={() => {
              setSp(a)
              setSx(b)
              setSq(c)
              setSy(e)
            }}
          >
            a{a}={b}, a{c}={e}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}
