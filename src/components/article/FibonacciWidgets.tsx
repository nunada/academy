import { useState } from 'react'
import { useI18n } from '../../i18n'
import { binetDouble, correctDecimals, fib, fibDoubling, fibMod, gcdIdentity, identityRows, loopAdds, memoCalls, naiveCalls, pisano, ratioDigits, representations, residues, zeckendorf } from '../../lib/fibonacci'
import { Tex } from '../ui'
import { Frame, L, groupNumber, useSep } from './widgetKit'

/** A BigInt written in full when it is short and as m × 10^e when it is long. */
function bigText(v: bigint, lang: 'en' | 'id', sep: string): string {
  const s = v.toString()
  if (s.length <= 15) return groupNumber(v, lang)
  return `${s[0]}${sep}${s.slice(1, 4)} × 10^${s.length - 1}`
}

const dots = (s: string, sep: string): string => (sep === ',' ? s.replace('.', ',') : s)

/* -------------------------------------------------------------------------- the numbers and their ratios */

export function FibExplore() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [n, setN] = useState(12)
  const f = fib(n)
  const rows = Array.from({ length: Math.min(6, n) }, (_, i) => n - i).filter((k) => k >= 1)
  const bin = binetDouble(n)
  const binOk = BigInt(bin) === f
  const digits = f.toString().length
  const first = Array.from({ length: 21 }, (_, i) => fib(i).toString())
  return (
    <Frame name="fibexplore">
      <label className="lbl slider">
        n = <b>{n}</b>
        <input type="range" min={1} max={120} value={n} aria-label="n" onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <div className="wgtout" aria-live="polite">
        <p className="okline">
          F<sub>{n}</sub> = <b style={{ overflowWrap: 'anywhere' }}>{groupNumber(f, lang)}</b>
        </p>
        <p className="small">
          {tc(L(`${digits} digit${digits === 1 ? '' : 's'}; about ${dots((n * 0.20898764).toFixed(1), sep)} expected from n·log₁₀φ.`, `${digits} angka; sekitar ${dots((n * 0.20898764).toFixed(1), sep)} diharapkan dari n·log₁₀φ.`))}
        </p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>k</th>
              <th>F(k)</th>
              <th>F(k+1) / F(k)</th>
              <th>{tc(L('decimals of φ right', 'desimal φ benar'))}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k} className={k === n ? 'hi' : ''}>
                <td>{k}</td>
                <td>{bigText(fib(k), lang, sep)}</td>
                <td>{dots(ratioDigits(k, 12), sep)}</td>
                <td>{correctDecimals(k, 40)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className={binOk ? 'okline' : 'noline'}>
          {tc(L('Binet in doubles, round(φⁿ/√5):', 'Binet dalam double, round(φⁿ/√5):'))} <b style={{ overflowWrap: 'anywhere' }}>{groupNumber(BigInt(bin), lang)}</b> {binOk ? '✓' : `✗ ${tc(L('not F', 'bukan F'))}(${n})`}
        </p>
        <p className="small">
          {tc(L('The ratio of neighbors approaches φ = 1.6180339887…, gaining about 0.42 of a decimal per step (twice log₁₀φ), and the formula in floating point goes wrong at n = 71.', 'Perbandingan tetangga mendekati φ = 1,6180339887…, bertambah sekitar 0,42 desimal per langkah (dua kali log₁₀φ), dan rumus dalam titik mengambang mulai salah pada n = 71.'))}
        </p>
        <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
          F(0…20): {first.join(', ')}
        </p>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------------------- four ways to compute */

export function FibCompute() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [t, setT] = useState(1.7)
  const n = Math.max(1, Math.round(10 ** t))
  const d = fibDoubling(n)
  const s = d.f.toString()
  const calls = naiveCalls(n)
  const seconds = Number(calls) / 1e9
  const YEAR = 365.25 * 24 * 3600
  const naiveTime =
    seconds < 1e-6
      ? '< 1 µs'
      : seconds < 1
        ? `${dots((seconds * 1e3).toPrecision(3), sep)} ms`
        : seconds < 120
          ? `${dots(seconds.toPrecision(3), sep)} ${tc(L('s', 'detik'))}`
          : seconds < 86400 * 2
            ? `${dots((seconds / 3600).toPrecision(3), sep)} ${tc(L('hours', 'jam'))}`
            : seconds < YEAR * 1e3
              ? `${dots((seconds / YEAR).toPrecision(3), sep)} ${tc(L('years', 'tahun'))}`
              : `${dots((seconds / YEAR / 10 ** Math.floor(Math.log10(seconds / YEAR))).toPrecision(2), sep)} × 10^${Math.floor(Math.log10(seconds / YEAR))} ${tc(L('years', 'tahun'))}`
  const loopAgrees = n <= 3000 ? fib(n) === d.f : true
  return (
    <Frame name="fibcompute">
      <label className="lbl slider">
        n = <b>{groupNumber(n, lang)}</b>
        <input type="range" min={0} max={5} step={0.05} value={t} aria-label="n" onChange={(e) => setT(Number(e.target.value))} />
      </label>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>{tc(L('method', 'cara'))}</th>
              <th>{tc(L('steps', 'langkah'))}</th>
              <th>{tc(L('growth', 'pertumbuhan'))}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{tc(L('plain recursion', 'rekursi biasa'))}</td>
              <td>
                {bigText(calls, lang, sep)} {tc(L('calls', 'panggilan'))}
                <br />
                <span className="small muted">≈ {naiveTime} @ 10⁹/s</span>
              </td>
              <td>
                <Tex src="2F_{n+1}-1\approx\varphi^{n}" />
              </td>
            </tr>
            <tr>
              <td>{tc(L('recursion with a memo', 'rekursi dengan memo'))}</td>
              <td>
                {groupNumber(memoCalls(n), lang)} {tc(L('calls', 'panggilan'))}
              </td>
              <td>
                <Tex src="2n-1" />
              </td>
            </tr>
            <tr>
              <td>{tc(L('loop', 'perulangan'))}</td>
              <td>
                {groupNumber(loopAdds(n), lang)} {tc(L('additions', 'penjumlahan'))}
              </td>
              <td>
                <Tex src="n-1" />
              </td>
            </tr>
            <tr className="hi">
              <td>{tc(L('fast doubling', 'penggandaan cepat'))}</td>
              <td>
                {d.steps} {tc(L('steps', 'langkah'))}, {d.mults} {tc(L('multiplications', 'perkalian'))}
              </td>
              <td>
                <Tex src="3\lceil\log_2 n\rceil" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          F({groupNumber(n, lang)}) {tc(L('has', 'memiliki'))} <b>{groupNumber(s.length, lang)}</b> {tc(L('digits', 'angka'))} ({groupNumber(d.f.toString(2).length, lang)} bits) {n <= 3000 ? (loopAgrees ? '✓' : '✗') : ''}
          <br />
          {s.length <= 40 ? s : `${s.slice(0, 15)}…${s.slice(-15)}`}
        </p>
        <p className="small">
          {tc(L('Fast doubling needs a handful of big multiplications where the loop needs n big additions; with numbers this long the cost of one operation grows too, so the counts are a lower bound on the real work.', 'Penggandaan cepat hanya memerlukan segelintir perkalian bilangan besar, sementara perulangan memerlukan n penjumlahan bilangan besar; pada bilangan sepanjang ini biaya satu operasi juga bertambah, sehingga hitungan itu hanya batas bawah kerja sebenarnya.'))}
        </p>
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------------------------- the identities */

const ID_TEX: Record<string, string> = {
  sum: 'F_1+F_2+\\cdots+F_n=F_{n+2}-1',
  squares: 'F_1^2+F_2^2+\\cdots+F_n^2=F_nF_{n+1}',
  odd: 'F_1+F_3+\\cdots+F_{2n-1}=F_{2n}',
  even: 'F_2+F_4+\\cdots+F_{2n}=F_{2n+1}-1',
  cassini: 'F_{n-1}F_{n+1}-F_n^2=(-1)^n',
  double: 'F_{2n}=F_n\\,(2F_{n+1}-F_n)',
  double1: 'F_{2n+1}=F_n^2+F_{n+1}^2',
}

export function FibIdentities() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [n, setN] = useState(8)
  const [ms, setM] = useState('12')
  const [ns, setNs] = useState('18')
  const rows = identityRows(n)
  const gm = /^\d{1,3}$/.test(ms.trim()) && Number(ms) >= 1 ? Number(ms) : 0
  const gn = /^\d{1,3}$/.test(ns.trim()) && Number(ns) >= 1 ? Number(ns) : 0
  const g = gm && gn ? gcdIdentity(gm, gn) : null
  return (
    <Frame name="fibidentity">
      <label className="lbl slider">
        n = <b>{n}</b>
        <input type="range" min={1} max={40} value={n} aria-label="n" onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>{tc(L('identity', 'identitas'))}</th>
              <th>{tc(L('left side', 'ruas kiri'))}</th>
              <th>{tc(L('right side', 'ruas kanan'))}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <Tex src={ID_TEX[r.id]} />
                </td>
                <td>{bigText(r.left, lang, sep)}</td>
                <td>{bigText(r.right, lang, sep)}</td>
                <td>{r.left === r.right ? '✓' : '✗'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="small">{tc(L('The left side is built the long way (by adding or multiplying out), the right side by the short formula.', 'Ruas kiri disusun dengan cara panjang (menjumlahkan atau mengalikan), ruas kanan dengan rumus ringkas.'))}</p>
      </div>
      <div className="inrow">
        <label className="lbl">
          m = <input style={{ width: '4em' }} value={ms} aria-label="m" onChange={(e) => setM(e.target.value)} />
        </label>
        <label className="lbl">
          n = <input style={{ width: '4em' }} value={ns} aria-label="n" onChange={(e) => setNs(e.target.value)} />
        </label>
      </div>
      <div className="wgtout" aria-live="polite">
        {g ? (
          <p className="okline" style={{ overflowWrap: 'anywhere' }}>
            gcd(F({gm}), F({gn})) = gcd({groupNumber(fib(gm), lang)}, {groupNumber(fib(gn), lang)}) = <b>{groupNumber(g.gcdOfValues, lang)}</b> = F({g.g}) = F(gcd({gm}, {gn})) {g.gcdOfValues === g.valueOfGcd ? '✓' : '✗'}
          </p>
        ) : (
          <p className="noline">{tc(L('Type whole numbers m and n from 1 to 999.', 'Ketik bilangan bulat m dan n dari 1 sampai 999.'))}</p>
        )}
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------------------------ Zeckendorf */

export function FibZeckendorf() {
  const { tc, lang } = useI18n()
  const [ns, setNs] = useState('100')
  const valid = /^\d{1,15}$/.test(ns.trim()) && BigInt(ns.trim()) >= 1n
  const N = valid ? BigInt(ns.trim()) : 1n
  const ks = zeckendorf(N)
  const top = ks[0]
  const bits = Array.from({ length: top - 1 }, (_, i) => (ks.includes(top - i) ? '1' : '0')).join('')
  const total = N <= 1000000n ? representations(Number(N)) : null
  const small = Array.from({ length: 20 }, (_, i) => BigInt(i + 1))
  return (
    <Frame name="fibzeck">
      <div className="inrow">
        <label className="lbl">
          N = <input style={{ width: '10em' }} value={ns} aria-label="N" onChange={(e) => setNs(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {[4, 12, 100, 1000, 2026].map((v) => (
          <button key={v} className="chip ghost" onClick={() => setNs(String(v))}>
            N = {v}
          </button>
        ))}
      </div>
      {valid ? (
        <div className="wgtout" aria-live="polite">
          <p className="okline" style={{ overflowWrap: 'anywhere' }}>
            {groupNumber(N, lang)} = {ks.map((k) => groupNumber(fib(k), lang)).join(' + ')}
          </p>
          <p className="small" style={{ overflowWrap: 'anywhere' }}>
            = {ks.map((k) => `F(${k})`).join(' + ')}
          </p>
          <p className="small" style={{ overflowWrap: 'anywhere' }}>
            {tc(L('Fibonacci digits', 'angka Fibonacci'))} (F({top}) … F(2)): <b style={{ fontFamily: 'var(--mono)' }}>{bits}</b>
            <br />
            {tc(L('binary', 'biner'))}: <b style={{ fontFamily: 'var(--mono)' }}>{N.toString(2)}</b>
          </p>
          <p className="small">
            {total !== null
              ? tc(L(`${groupNumber(total, lang)} way${total === 1 ? '' : 's'} to write ${groupNumber(N, lang)} as a sum of different Fibonacci numbers; exactly one has no two neighbors in the list (the one above).`, `${groupNumber(total, lang)} cara menulis ${groupNumber(N, lang)} sebagai jumlah bilangan Fibonacci yang berbeda; tepat satu yang tidak memuat dua tetangga dalam barisan (yang di atas).`))
              : tc(L('Greedy: take the largest Fibonacci number that fits, then repeat on the rest.', 'Rakus: ambil bilangan Fibonacci terbesar yang muat, lalu ulangi pada sisanya.'))}
          </p>
        </div>
      ) : (
        <p className="noline">{tc(L('Type a whole number N from 1 to 999 999 999 999 999.', 'Ketik bilangan bulat N dari 1 sampai 999 999 999 999 999.'))}</p>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>N</th>
              <th>{tc(L('Zeckendorf sum', 'jumlah Zeckendorf'))}</th>
              <th>{tc(L('Fibonacci digits', 'angka Fibonacci'))}</th>
            </tr>
          </thead>
          <tbody>
            {small.map((v) => {
              const z = zeckendorf(v)
              return (
                <tr key={String(v)} className={v === N ? 'hi' : ''}>
                  <td>{String(v)}</td>
                  <td>{z.map((k) => String(fib(k))).join(' + ')}</td>
                  <td style={{ fontFamily: 'var(--mono)' }}>{Array.from({ length: z[0] - 1 }, (_, i) => (z.includes(z[0] - i) ? '1' : '0')).join('')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------- Pisano periods */

export function FibPisano() {
  const { tc, lang } = useI18n()
  const [ms, setM] = useState('10')
  const [ns, setNs] = useState('1000000000000000000')
  const validM = /^\d{1,4}$/.test(ms.trim()) && Number(ms) >= 1
  const m = validM ? Number(ms) : 1
  const p = pisano(m)
  const res = residues(m, Math.min(p + 6, 90))
  const validN = /^\d{1,30}$/.test(ns.trim())
  const N = validN ? BigInt(ns.trim()) : 0n
  const direct = fibMod(N, BigInt(m))
  const reduced = fibMod(N % BigInt(p), BigInt(m))
  return (
    <Frame name="fibpisano">
      <div className="inrow">
        <label className="lbl">
          m = <input style={{ width: '5em' }} value={ms} aria-label="m" onChange={(e) => setM(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {[2, 3, 5, 7, 10, 11, 100, 1000].map((v) => (
          <button key={v} className="chip ghost" onClick={() => setM(String(v))}>
            m = {v}
          </button>
        ))}
      </div>
      {validM ? (
        <>
          <div className="wgtout" aria-live="polite">
            <p className="okline">
              {tc(L(`F(n) mod ${m} repeats with period`, `F(n) mod ${m} berulang dengan periode`))} <b>π({m}) = {groupNumber(p, lang)}</b>
            </p>
          </div>
          <p className="small" style={{ fontFamily: 'var(--mono)', overflowWrap: 'anywhere', lineHeight: 1.7 }}>
            {res.map((v, i) => (
              <span key={i} style={i === p ? { borderLeft: '3px solid var(--bad)', paddingLeft: 4, marginLeft: 2 } : undefined}>
                {v}{' '}
              </span>
            ))}
            {p + 6 > 90 ? '…' : ''}
          </p>
          <p className="small muted">{tc(L('The red bar marks where the sequence starts again with 0, 1, 1, …', 'Garis merah menandai tempat barisan mulai lagi dengan 0, 1, 1, …'))}</p>
        </>
      ) : (
        <p className="noline">{tc(L('Type a whole number m from 1 to 9999.', 'Ketik bilangan bulat m dari 1 sampai 9999.'))}</p>
      )}
      <div className="inrow">
        <label className="lbl" style={{ flex: '1 1 10em' }}>
          n = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={ns} aria-label="n" onChange={(e) => setNs(e.target.value)} />
        </label>
      </div>
      {validN && validM ? (
        <div className="wgtout" aria-live="polite">
          <p className="okline" style={{ overflowWrap: 'anywhere' }}>
            F({ns.trim()}) mod {m} = <b>{String(direct)}</b> {direct === reduced ? '✓' : '✗'}
          </p>
          <p className="small" style={{ overflowWrap: 'anywhere' }}>
            {tc(L(`Shortcut: n mod π(${m}) = ${String(N % BigInt(p))}, and F(${String(N % BigInt(p))}) mod ${m} = ${String(reduced)}.`, `Pintasan: n mod π(${m}) = ${String(N % BigInt(p))}, dan F(${String(N % BigInt(p))}) mod ${m} = ${String(reduced)}.`))}
          </p>
        </div>
      ) : (
        <p className="noline">{tc(L('Type a whole number n of at most 30 digits.', 'Ketik bilangan bulat n paling banyak 30 angka.'))}</p>
      )}
    </Frame>
  )
}
