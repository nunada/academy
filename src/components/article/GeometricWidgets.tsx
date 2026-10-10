import { useState } from 'react'
import { useI18n } from '../../i18n'
import { parseRational } from '../../lib/realnum'
import { parseInteger } from '../../lib/integers'
import { ratMul, ratSub } from '../../lib/rationals'
import { analyse as arithmeticAnalyse } from '../../lib/sequences'
import { analyse, firstTerm, infiniteSum, partialSum, partialSums, ratioFromTwoTerms, ratPow, rat, terms, type Rat } from '../../lib/geometric'
import { Tex } from '../ui'
import { Frame, L } from './widgetKit'

/* ------------------------------------------------------------------ helpers */

const ratTex = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n < 0n ? '-' : ''}\\frac{${r.n < 0n ? -r.n : r.n}}{${r.d}}`)
const paren = (r: Rat): string => (r.n < 0n || r.d !== 1n ? `\\left(${ratTex(r)}\\right)` : ratTex(r))
const num = (r: Rat): number => Number(r.n) / Number(r.d)
const small = (r: Rat | null): r is Rat => r !== null && (r.n < 0n ? -r.n : r.n) <= 9999n && r.d <= 999n
const tooBig = (rs: Rat[]): boolean => rs.some((r) => r.n.toString().length > 22 || r.d.toString().length > 22)

const BAD = L('Type a whole number or a fraction such as 3, -1.5 or 2/3.', 'Ketik bilangan bulat atau pecahan seperti 3, -1,5, atau 2/3.')
const BIG = L('The numbers are too large to show here: try smaller values or fewer terms.', 'Bilangannya terlalu besar untuk ditampilkan di sini: coba nilai lebih kecil atau suku lebih sedikit.')

function Field({ label, value, set, width = '6em' }: { label: string; value: string; set: (s: string) => void; width?: string }) {
  return (
    <label className="lbl">
      {label} <input style={{ width }} value={value} aria-label={label} onChange={(e) => set(e.target.value)} />
    </label>
  )
}

/** a_1 r^(n-1) as TeX. */
const formulaTex = (a1: Rat, r: Rat): string => {
  if (a1.n === 1n && a1.d === 1n) return `${paren(r)}^{n-1}`
  return `${ratTex(a1)}\\cdot${paren(r)}^{n-1}`
}

/* ------------------------------------------------------------------- detector */

export function GeometricDetector() {
  const { tc, lang } = useI18n()
  const [text, setText] = useState('3 6 12 24 48')
  const tokens = text
    .split(lang === 'id' ? /[\s;]+/ : /[\s;,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
  const values = tokens.map((t) => parseRational(t))
  const ok = tokens.length >= 2 && tokens.length <= 14 && values.every(small)

  let body
  if (!ok) body = <p className="noline">{tc(L(`Type 2 to 14 numbers separated by ${lang === 'id' ? 'spaces' : 'spaces or commas'}, such as 3 6 12 24.`, 'Ketik 2 sampai 14 bilangan yang dipisahkan spasi, seperti 3 6 12 24.'))}</p>
  else {
    const vs = values as Rat[]
    const a = analyse(vs)
    const arith = arithmeticAnalyse(vs)
    if (a.hasZero)
      body = <p className="noline">{tc(L('A geometric sequence has no zero term: the ratio of a term to a zero term is undefined, and a zero would make every later term 0.', 'Barisan geometri tidak punya suku nol: rasio suatu suku terhadap suku nol tidak terdefinisi, dan suku nol membuat semua suku berikutnya 0.'))}</p>
    else {
      const nextTerms = a.r ? terms(ratMul(vs[vs.length - 1], a.r), a.r, 3) : []
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
                  <th>{tc(L('Ratios', 'Rasio'))}</th>
                  {a.ratios.map((v, i) => (
                    <td key={i} className={a.firstBreak !== null && i >= a.firstBreak ? 'grp1' : 'grp3'}>
                      <Tex src={ratTex(v)} />
                    </td>
                  ))}
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          {a.geometric ? (
            <>
              <p className="okline">{tc(L('Geometric: every term is the same multiple of the one before.', 'Geometri: setiap suku adalah kelipatan yang sama dari suku sebelumnya.'))}</p>
              <p>
                <Tex src={`r=${ratTex(a.r!)},\\quad a_n=${formulaTex(vs[0], a.r!)}`} />
              </p>
              {!tooBig(nextTerms) && (
                <p className="small muted">
                  {tc(L('Next terms', 'Suku berikutnya'))}: <Tex src={nextTerms.map(ratTex).join(',\\ ')} />
                </p>
              )}
            </>
          ) : (
            <>
              <p className="noline">
                {tc(L(`Not geometric: the ratios are not all equal (the first one that breaks the pattern is between terms ${a.firstBreak! + 2} and ${a.firstBreak! + 3}).`, `Bukan geometri: rasionya tidak semuanya sama (yang pertama menyimpang ada di antara suku ${a.firstBreak! + 2} dan ${a.firstBreak! + 3}).`))}
              </p>
              {arith.arithmetic && (
                <p className="small muted">
                  {tc(L('The differences are all equal, so this is an arithmetic sequence, with d = ', 'Selisihnya semuanya sama, sehingga ini barisan aritmetika, dengan d = '))}
                  <Tex src={ratTex(arith.d!)} />
                </p>
              )}
            </>
          )}
        </>
      )
    }
  }

  return (
    <Frame name="geodetect">
      <div className="inrow">
        <Field label={tc(L('Numbers', 'Bilangan'))} value={text} set={setText} width="18em" />
      </div>
      <div className="chips">
        {['3 6 12 24 48', '81 27 9 3', '5 -10 20 -40', '2 4 6 8', '1 4 9 16', '1 0.5 0.25 0.125'].map((p) => {
          const label = lang === 'id' ? p.replace(/(\d)\.(\d)/g, '$1,$2') : p
          return (
            <button key={p} className="chip ghost" onClick={() => setText(label)}>
              {label}
            </button>
          )
        })}
      </div>
      <div className="wgtout" aria-live="polite">
        {body}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------- explorer */

export function GeometricExplorer() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('3')
  const [sr, setSr] = useState('2')
  const [n, setN] = useState(8)
  const a1 = parseRational(sa)
  const r = parseRational(sr)

  let body
  if (!small(a1) || !small(r)) body = <p className="noline">{tc(BAD)}</p>
  else {
    const ts = terms(a1, r, n)
    if (tooBig(ts)) body = <p className="noline">{tc(BIG)}</p>
    else {
      const last = ts[n - 1]
      const shown = n <= 7 ? ts.map(ratTex).join(',\\ ') : `${ts.slice(0, 5).map(ratTex).join(',\\ ')},\\ \\ldots,\\ ${ratTex(last)}`
      const vals = ts.map(num)
      const maxAbs = Math.max(...vals.map(Math.abs)) || 1
      const hasNeg = vals.some((v) => v < 0)
      const W = 520
      const H = 190
      const mid = hasNeg ? H / 2 : H - 26
      const scale = (hasNeg ? H / 2 - 22 : H - 50) / maxAbs
      const bw = Math.min(30, (W - 60) / n - 4)
      const px = (i: number) => 44 + (i + 0.5) * ((W - 60) / n)
      body = (
        <>
          <p>
            <Tex src={shown} />
          </p>
          <p>
            <Tex src={`a_n=a_1r^{n-1}=${ratTex(a1)}\\cdot${paren(r)}^{n-1}`} />
          </p>
          <p className="small">
            <Tex src={`a_{${n}}=${ratTex(last)}`} />
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} className="nlsvg" role="img" aria-label={tc(L('Bars showing the size of each term', 'Batang yang menunjukkan ukuran tiap suku'))}>
            <line x1={36} x2={W - 10} y1={mid} y2={mid} className="nlaxis" />
            {vals.map((v, i) => (
              <rect key={i} x={px(i) - bw / 2} y={v >= 0 ? mid - v * scale : mid} width={bw} height={Math.max(Math.abs(v) * scale, 1)} className={v >= 0 ? 'geobar' : 'geobar neg'} />
            ))}
            <text x={px(0)} y={H - 6} textAnchor="middle" className="nllabel">
              1
            </text>
            <text x={px(n - 1)} y={H - 6} textAnchor="middle" className="nllabel">
              {n}
            </text>
          </svg>
          <p className="small muted">
            {r.n === 0n
              ? tc(L('With r = 0 every term after the first is 0, which is not a useful geometric sequence.', 'Dengan r = 0 setiap suku setelah yang pertama adalah 0, yang bukan barisan geometri yang berguna.'))
              : r.n < 0n
                ? tc(L('A negative ratio makes the terms alternate in sign.', 'Rasio negatif membuat tanda suku bergantian.'))
                : r.n === r.d
                  ? tc(L('With r = 1 every term is the same.', 'Dengan r = 1 setiap suku sama.'))
                  : r.n > r.d
                    ? tc(L('The ratio is bigger than 1, so the terms grow faster and faster: exponential growth.', 'Rasionya lebih dari 1, sehingga suku-sukunya tumbuh makin cepat: pertumbuhan eksponensial.'))
                    : tc(L('The ratio is between 0 and 1, so the terms shrink toward 0: exponential decay.', 'Rasionya antara 0 dan 1, sehingga suku-sukunya mengecil menuju 0: peluruhan eksponensial.'))}
          </p>
        </>
      )
    }
  }

  return (
    <Frame name="geoseq">
      <div className="inrow">
        <Field label="a₁" value={sa} set={setSa} />
        <Field label="r" value={sr} set={setSr} />
      </div>
      <label className="lbl slider">
        n = <b>{n}</b>
        <input type="range" min={1} max={16} value={n} aria-label="n" onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <div className="chips">
        {[['3', '2'], ['64', '1/2'], ['5', '-2'], ['1', '1.1'], ['10', '3/5']].map(([x, y]) => (
          <button
            key={x + y}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSr(y)
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

/* ------------------------------------------------------------------ two terms */

export function GeometricTwoTerms() {
  const { tc } = useI18n()
  const [sp, setSp] = useState('2')
  const [sx, setSx] = useState('6')
  const [sq, setSq] = useState('5')
  const [sy, setSy] = useState('48')
  const p = parseInteger(sp, 3)
  const q = parseInteger(sq, 3)
  const x = parseRational(sx)
  const y = parseRational(sy)

  let body
  if (p === null || q === null || p < 1n || q < 1n || !small(x) || !small(y)) body = <p className="noline">{tc(L('Positions must be positive whole numbers and the terms whole numbers or fractions.', 'Posisi harus bilangan bulat positif dan sukunya bilangan bulat atau pecahan.'))}</p>
  else if (p === q) body = <p className="noline">{tc(L('Use two different positions.', 'Pakai dua posisi berbeda.'))}</p>
  else if (x.n === 0n || y.n === 0n) body = <p className="noline">{tc(L('Both terms must be non-zero.', 'Kedua suku harus bukan nol.'))}</p>
  else {
    const res = ratioFromTwoTerms(p, x, q, y)
    const k = p < q ? q - p : p - q
    if (!res) body = <p className="noline">{tc(L('Use positions that are at most 64 apart.', 'Pakai posisi yang berjarak paling jauh 64.'))}</p>
    else if (res.kind === 'none')
      body = <p className="noline">{tc(L(`No real ratio fits: r^${k} would have to equal a negative number, and an even power is never negative.`, `Tidak ada rasio real yang cocok: r^${k} harus sama dengan bilangan negatif, dan pangkat genap tidak pernah negatif.`))}</p>
    else if (res.kind === 'irrational') {
      const approx = Math.pow(Math.abs(num(res.rho)), 1 / res.k)
      body = (
        <>
          <p>
            <Tex src={`r^{${k}}=\\frac{a_{${p < q ? q : p}}}{a_{${p < q ? p : q}}}=${ratTex(res.rho)}\\ \\Rightarrow\\ r=\\pm${k === 2n ? `\\sqrt{${ratTex(res.rho)}}` : `\\sqrt[${k}]{${ratTex(res.rho)}}`}`} />
          </p>
          <p className="small muted">
            {tc(L('The ratio is irrational, about ', 'Rasionya irasional, sekitar '))}
            {(Math.round(approx * 1e6) / 1e6).toString().replace('.', tc(L('.', ',')))}
            {tc(L(': the two terms do not come from a geometric sequence with a fraction as ratio.', ': kedua suku itu tidak berasal dari barisan geometri dengan rasio pecahan.'))}
          </p>
        </>
      )
    } else {
      body = (
        <>
          <p>
            <Tex src={`r^{${k}}=\\frac{a_{${p < q ? q : p}}}{a_{${p < q ? p : q}}}=\\frac{${ratTex(p < q ? y : x)}}{${paren(p < q ? x : y)}}=${ratTex(p < q ? ratioQuotient(y, x) : ratioQuotient(x, y))}`} />
          </p>
          {res.roots.map((root, i) => {
            const a1 = firstTerm(p, x, root)
            return (
              <p key={i} className={i === 0 ? 'bigcn' : 'small'}>
                <Tex src={`r=${ratTex(root)},\\quad a_1=${ratTex(a1)},\\quad a_n=${formulaTex(a1, root)}`} />
                {'  '}
                <span className="muted small">{terms(a1, root, 5).map((t) => ratTexPlain(t)).join(', ')}, …</span>
              </p>
            )
          })}
          {res.roots.length > 1 && <p className="small muted">{tc(L('An even number of steps between the terms allows a positive and a negative ratio: both sequences pass through the two given terms.', 'Banyak langkah yang genap di antara kedua suku memungkinkan rasio positif dan negatif: kedua barisan melewati dua suku yang diberikan.'))}</p>}
        </>
      )
    }
  }

  return (
    <Frame name="geotwo">
      <div className="inrow">
        <Field label={tc(L('position p', 'posisi p'))} value={sp} set={setSp} width="4em" />
        <Field label="a_p" value={sx} set={setSx} width="5em" />
        <Field label={tc(L('position q', 'posisi q'))} value={sq} set={setSq} width="4em" />
        <Field label="a_q" value={sy} set={setSy} width="5em" />
      </div>
      <div className="chips">
        {[['2', '6', '5', '48'], ['1', '3', '3', '12'], ['3', '4', '6', '4/27'], ['1', '2', '3', '18'], ['1', '5', '2', '-10']].map(([a, b, c, e]) => (
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

const ratioQuotient = (b: Rat, a: Rat): Rat => rat(b.n * a.d, b.d * a.n)
const ratTexPlain = (r: Rat): string => (r.d === 1n ? `${r.n}` : `${r.n}/${r.d}`)

/* ------------------------------------------------------------------------ sum */

export function GeometricSum() {
  const { tc } = useI18n()
  const [sa, setSa] = useState('3')
  const [sr, setSr] = useState('2')
  const [sn, setSn] = useState('10')
  const a1 = parseRational(sa)
  const r = parseRational(sr)
  const n = parseInteger(sn, 3)

  let body
  if (!small(a1) || !small(r) || n === null || n < 1n || n > 64n) body = <p className="noline">{tc(L('Give a first term, a ratio and a number of terms n from 1 to 64.', 'Beri suku pertama, rasio, dan banyak suku n dari 1 sampai 64.'))}</p>
  else {
    const N = Number(n)
    const total = partialSum(a1, r, n)
    const rn = ratPow(r, n)
    if (tooBig([total, rn])) body = <p className="noline">{tc(BIG)}</p>
    else {
      const unit = r.n === r.d
      const inf = infiniteSum(a1, r)
      const sums = partialSums(a1, r, Math.min(N, 12))
      const vals = sums.map(num)
      const limit = inf ? num(inf) : null
      const lo = Math.min(0, ...vals, ...(limit !== null ? [limit] : []))
      const hi = Math.max(0, ...vals, ...(limit !== null ? [limit] : []))
      const span = hi - lo || 1
      const W = 520
      const H = 170
      const px = (i: number) => 44 + (i / Math.max(sums.length - 1, 1)) * (W - 70)
      const py = (v: number) => H - 22 - ((v - lo) / span) * (H - 44)
      body = (
        <>
          {!unit && (
            <>
              <p className="small">
                <Tex src={`S_{${N}}=a_1+a_1r+\\cdots+a_1r^{${N - 1}}`} />
              </p>
              <p className="small">
                <Tex src={`rS_{${N}}=\\ \\ \\ \\ \\ \\,a_1r+\\cdots+a_1r^{${N - 1}}+a_1r^{${N}}`} />
              </p>
              <p className="small">
                <Tex src={`S_{${N}}-rS_{${N}}=a_1-a_1r^{${N}}\\ \\Rightarrow\\ S_{${N}}=\\frac{a_1\\left(1-r^{${N}}\\right)}{1-r}`} />
              </p>
            </>
          )}
          <p className="bigcn">
            <Tex src={unit ? `S_{${N}}=${N}\\cdot${ratTex(a1)}=${ratTex(total)}` : `S_{${N}}=\\frac{${ratTex(a1)}\\left(1-${paren(r)}^{${N}}\\right)}{1-${paren(r)}}=${ratTex(total)}`} />
          </p>
          {unit && <p className="small muted">{tc(L('With r = 1 the formula would divide by 0, but every term is a₁, so the sum is n·a₁.', 'Dengan r = 1 rumus akan membagi dengan 0, tetapi setiap suku adalah a₁, sehingga jumlahnya n·a₁.'))}</p>}
          <p className="small">
            {inf ? (
              <>
                {tc(L('Infinite series: |r| < 1, so it converges to', 'Deret tak hingga: |r| < 1, sehingga ia konvergen ke'))} <Tex src={`S_\\infty=\\frac{a_1}{1-r}=${ratTex(inf)}`} />
                {' · '}
                {tc(L('the gap after n terms is', 'selisih setelah n suku adalah'))} <Tex src={ratTex(ratSub(inf, total))} />
              </>
            ) : (
              tc(L('Infinite series: |r| ≥ 1, so the partial sums do not settle and the series diverges.', 'Deret tak hingga: |r| ≥ 1, sehingga jumlah parsialnya tidak menetap dan deretnya divergen.'))
            )}
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} className="nlsvg" role="img" aria-label={tc(L('The partial sums plotted one after another', 'Jumlah parsial yang diplot satu demi satu'))}>
            <line x1={36} x2={W - 10} y1={py(0)} y2={py(0)} className="nlaxis" />
            {limit !== null && <line x1={36} x2={W - 10} y1={py(limit)} y2={py(limit)} className="seqline" />}
            {vals.map((v, i) => (
              <circle key={i} cx={px(i)} cy={py(v)} r={3.6} className="nldot r" />
            ))}
            <text x={px(0)} y={H - 4} textAnchor="middle" className="nllabel">
              S₁
            </text>
            <text x={px(sums.length - 1)} y={H - 4} textAnchor="middle" className="nllabel">
              S{sums.length}
            </text>
          </svg>
        </>
      )
    }
  }

  return (
    <Frame name="geosum">
      <div className="inrow">
        <Field label="a₁" value={sa} set={setSa} />
        <Field label="r" value={sr} set={setSr} />
        <Field label="n" value={sn} set={setSn} width="4em" />
      </div>
      <div className="chips">
        {[['3', '2', '10'], ['1', '1/2', '10'], ['6', '2/3', '12'], ['1', '-1/2', '10'], ['1', '2', '64']].map(([x, y, z]) => (
          <button
            key={x + y + z}
            className="chip ghost"
            onClick={() => {
              setSa(x)
              setSr(y)
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

