import { useState } from 'react'
import { useI18n } from '../../i18n'
import { ALGOS, GROWTH, log10Seconds, masterGrowth, masterTheorem, recurrenceValue, sizesFor, witness, type Algo } from '../../lib/bigo'
import { evalFloat } from '../../lib/chain'
import { parseFunction } from '../../lib/linearize'
import { Tex } from '../ui'
import { exprTex } from '../../lib/exprtex'
import { Frame, L, useSep } from './widgetKit'
import { Plot } from './DerivativeWidgets'
import { show } from './TangentWidgets'

const four = (x: number, sep: string): string => show(Number(x.toPrecision(5)), sep)

/** 10^l written plainly when it is small and in scientific notation when it is large. */
function pow10Text(l: number, sep: string): string {
  if (l < 6) return show(Math.round(10 ** l * 100) / 100, sep)
  const e = Math.floor(l)
  const m = 10 ** (l - e)
  return `${m.toFixed(2).replace('.', sep)} × 10^${e}`
}

const YEAR = 365.25 * 24 * 3600

/** A time given as log10 of the seconds, in the largest unit that keeps the number readable. */
function timeText(l: number, sep: string, tc: (v: { en: string; id: string }) => string): string {
  const units: [number, { en: string; id: string }][] = [
    [1e-9, L('ns', 'ns')],
    [1e-6, L('µs', 'µs')],
    [1e-3, L('ms', 'md')],
    [1, L('s', 'detik')],
    [60, L('min', 'menit')],
    [3600, L('hours', 'jam')],
    [86400, L('days', 'hari')],
    [YEAR, L('years', 'tahun')],
  ]
  if (l < -9) return `< 1 ${tc(units[0][1])}`
  if (l > 17.2 + 9) return tc(L('longer than the age of the universe', 'lebih lama daripada usia alam semesta')) + ` (10^${Math.round(l - Math.log10(YEAR))} ${tc(units[7][1])})`
  const s = 10 ** l
  let pick = units[0]
  for (const u of units) if (s >= u[0]) pick = u
  const v = s / pick[0]
  if (pick[0] === YEAR && v > 1.38e10) return `${pow10Text(Math.log10(v / 1.38e10), sep)} × ${tc(L('the age of the universe', 'usia alam semesta'))}`
  return `${v >= 1e6 ? pow10Text(Math.log10(v), sep) : four(v, sep)} ${tc(pick[1])}`
}

const GROWTH_NAME: Record<string, { en: string; id: string }> = {
  constant: { en: 'constant', id: 'konstan' },
  log: { en: 'logarithmic', id: 'logaritmik' },
  sqrt: { en: 'square root', id: 'akar kuadrat' },
  linear: { en: 'linear', id: 'linear' },
  nlogn: { en: 'linearithmic', id: 'linearitmik' },
  quadratic: { en: 'quadratic', id: 'kuadratik' },
  cubic: { en: 'cubic', id: 'kubik' },
  exp: { en: 'exponential', id: 'eksponensial' },
  factorial: { en: 'factorial', id: 'faktorial' },
}

/* ----------------------------------------------------------------------- the definition, with c and n0 */

interface WPreset {
  f: string
  g: string
  c: number
}
const W_PRESETS: WPreset[] = [
  { f: '3*x^2+5*x+7', g: 'x^2', c: 4 },
  { f: '100*x', g: 'x^2', c: 1 },
  { f: '2*x+10', g: 'x', c: 3 },
  { f: 'x^2', g: '2^x', c: 1 },
  { f: 'x*ln(x)', g: 'x^2', c: 1 },
  { f: 'x', g: 'ln(x)', c: 100 },
]

export function BigOWitness() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [fs, setF] = useState(W_PRESETS[0].f)
  const [gs, setG] = useState(W_PRESETS[0].g)
  const [cs, setC] = useState('4')
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const c = Number(cs.replace(',', '.'))
  const r = witness(fs, gs, c, 1000)
  let body
  if (!r.ok) {
    body = (
      <p className="noline">
        {r.error === 'constant'
          ? tc(L('Type a positive number for c.', 'Ketik bilangan positif untuk c.'))
          : r.error === 'undefined'
            ? tc(L('One of the functions is not defined at every whole number n ≥ 1.', 'Salah satu fungsi tidak terdefinisi di setiap bilangan bulat n ≥ 1.'))
            : tc(L('I could not read that function. Write n as x, for example 3*x^2+5*x+7, x*ln(x) or 2^x.', 'Saya tidak dapat membaca fungsi itu. Tulis n sebagai x, misalnya 3*x^2+5*x+7, x*ln(x), atau 2^x.'))}
      </p>
    )
  } else {
    const f = parseFunction(fs)
    const g = parseFunction(gs)
    if (typeof f === 'string' || typeof g === 'string') body = null
    else {
      const hi = r.n0 === null ? 40 : Math.min(80, Math.max(12, Math.ceil(r.n0 * 1.8)))
      const ys = [1, hi].flatMap((n) => [evalFloat(f, n), c * evalFloat(g, n)]).filter(Number.isFinite)
      const top = Math.min(Math.max(...ys, 1) * 1.1, Math.max(evalFloat(f, hi), c * evalFloat(g, hi)) * 1.1)
      body = (
        <>
          <Plot
            xr={[0, hi]}
            yr={[0, top]}
            curves={[{ f: (x) => evalFloat(f, x), cls: 'tancurve' }, { f: (x) => c * evalFloat(g, x), cls: 'tancurve sec' }]}
            vlines={r.n0 !== null && r.n0 <= hi ? [{ x: r.n0, cls: 'tannorm' }] : []}
            label={tc(L('f(n) in dark and c times g(n) in orange', 'f(n) berwarna gelap dan c kali g(n) berwarna oranye'))}
          />
          <div className="wgtout" aria-live="polite">
            {r.n0 !== null ? (
              <p className="okline">
                {tc(L('With c =', 'Dengan c ='))} <b>{four(c, sep)}</b>: f(n) ≤ c·g(n) {tc(L('for every n from', 'untuk setiap n dari'))} <b>n₀ = {r.n0}</b> {tc(L('to 1000.', 'sampai 1000.'))}
              </p>
            ) : (
              <p className="noline">
                {tc(L('With c =', 'Dengan c ='))} {four(c, sep)}: f(n) {'>'} c·g(n) {tc(L('still at n = 1000, so there is no threshold n₀ in this scan.', 'masih di n = 1000, sehingga tidak ada ambang n₀ pada pemindaian ini.'))}
              </p>
            )}
            <p className="small">
              f(1000) / g(1000) = <b>{r.endRatio >= 1e6 || (r.endRatio > 0 && r.endRatio < 1e-3) ? r.endRatio.toExponential(2).replace('.', sep) : four(r.endRatio, sep)}</b>.{' '}
              {tc(L('A scan up to 1000 is evidence, not a proof: the proof is algebra (or a limit). If the ratio keeps growing as n grows, f is not O(g) for any c.', 'Pemindaian sampai 1000 adalah bukti pendukung, bukan pembuktian: pembuktiannya adalah aljabar (atau limit). Jika rasio terus membesar ketika n membesar, f bukan O(g) untuk c mana pun.'))}
            </p>
          </div>
        </>
      )
    }
  }
  return (
    <Frame name="bigowitness">
      <div className="inrow">
        <label className="lbl" style={{ flex: '1 1 8em' }}>
          f(n) = <input style={{ flex: '1 1 6em', minWidth: 0, width: 'auto' }} value={fs} aria-label="f(n)" onChange={(e) => setF(e.target.value)} />
        </label>
        <label className="lbl" style={{ flex: '1 1 8em' }}>
          g(n) = <input style={{ flex: '1 1 6em', minWidth: 0, width: 'auto' }} value={gs} aria-label="g(n)" onChange={(e) => setG(e.target.value)} />
        </label>
        <label className="lbl">
          c = <input style={{ width: '4.5em' }} value={cs} aria-label="c" onChange={(e) => setC(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {W_PRESETS.map((p) => (
          <button
            key={p.f + p.g}
            className="chip ghost"
            onClick={() => {
              setF(p.f)
              setG(p.g)
              setC(String(p.c))
            }}
          >
            <Tex src={tdec(`${exprTex(p.f).replace(/\bx\b/g, 'n')}\\ \\text{vs}\\ ${exprTex(p.g).replace(/\bx\b/g, 'n')}`)} />
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}

/* ------------------------------------------------------------------------------ how fast they grow */

const RATES: { v: number; label: { en: string; id: string } }[] = [
  { v: 1e6, label: L('10⁶ steps a second (slow)', '10⁶ langkah per detik (lambat)') },
  { v: 1e9, label: L('10⁹ steps a second (a fast core)', '10⁹ langkah per detik (satu inti cepat)') },
  { v: 1e12, label: L('10¹² steps a second (a cluster)', '10¹² langkah per detik (sebuah klaster)') },
]
const BUDGETS: { s: number; label: { en: string; id: string } }[] = [
  { s: 1, label: L('1 second', '1 detik') },
  { s: 60, label: L('1 minute', '1 menit') },
  { s: 3600, label: L('1 hour', '1 jam') },
  { s: 86400, label: L('1 day', '1 hari') },
]

export function BigOGrowth() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [t, setT] = useState(2)
  const [ri, setRi] = useState(1)
  const [bi, setBi] = useState(0)
  const n = Math.max(1, Math.round(10 ** t))
  const rate = RATES[ri].v
  const budget = BUDGETS[bi].s * rate
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  return (
    <Frame name="bigogrowth">
      <label className="lbl slider">
        n = <b>{n.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</b>
        <input type="range" min={0} max={7} step={0.05} value={t} aria-label="n" onChange={(e) => setT(Number(e.target.value))} />
      </label>
      <div className="chips">
        {RATES.map((q, i) => (
          <button key={i} className={`chip ${ri === i ? 'on' : ''}`} onClick={() => setRi(i)} aria-pressed={ri === i}>
            {tc(q.label)}
          </button>
        ))}
      </div>
      <div className="chips">
        {BUDGETS.map((q, i) => (
          <button key={i} className={`chip ghost ${bi === i ? 'on' : ''}`} onClick={() => setBi(i)} aria-pressed={bi === i}>
            {tc(L('largest n in', 'n terbesar dalam'))} {tc(q.label)}
          </button>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th />
              <th>{tc(L('steps', 'langkah'))}</th>
              <th>{tc(L('time', 'waktu'))}</th>
              <th>{tc(L('largest n', 'n terbesar'))}</th>
            </tr>
          </thead>
          <tbody>
            {GROWTH.map((c) => {
              const l = c.log10(n)
              const m = c.maxN(budget)
              return (
                <tr key={c.id}>
                  <td>
                    <Tex src={tdec(c.tex)} /> <span className="small muted">{tc(GROWTH_NAME[c.id])}</span>
                  </td>
                  <td>{pow10Text(l, sep)}</td>
                  <td>{timeText(log10Seconds(c, n, rate), sep, tc)}</td>
                  <td>{m === Infinity ? tc(L('no limit', 'tanpa batas')) : pow10Text(Math.log10(m), sep)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="small">
          {tc(L('The last column is the largest input that finishes within the time you chose. Exponential and factorial algorithms stop at a few dozen; a constant or logarithmic one never runs out in practice.', 'Kolom terakhir adalah masukan terbesar yang selesai dalam waktu yang kamu pilih. Algoritma eksponensial dan faktorial berhenti pada beberapa puluh; yang konstan atau logaritmik hampir tidak pernah kehabisan dalam praktik.'))}
        </p>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------------- counting the steps */

const ALGO_NAME: Record<string, { en: string; id: string }> = {
  halving: { en: 'halve until 1', id: 'bagi dua sampai 1' },
  binary: { en: 'binary search', id: 'pencarian biner' },
  sqrt: { en: 'loop to √n', id: 'perulangan sampai √n' },
  linear: { en: 'linear search', id: 'pencarian linear' },
  merge: { en: 'merge sort', id: 'merge sort' },
  'insertion-best': { en: 'insertion sort, sorted input', id: 'insertion sort, masukan terurut' },
  insertion: { en: 'insertion sort, reversed input', id: 'insertion sort, masukan terbalik' },
  bubble: { en: 'bubble sort', id: 'bubble sort' },
  pairs: { en: 'all pairs', id: 'semua pasangan' },
  'fib-memo': { en: 'Fibonacci with a memo', id: 'Fibonacci dengan memo' },
  fib: { en: 'naive Fibonacci', id: 'Fibonacci naif' },
  subsets: { en: 'all subsets', id: 'semua himpunan bagian' },
}
const ALGO_CODE: Record<string, string> = {
  halving: 'while n > 1:\n    n //= 2\n    steps += 1',
  binary: 'lo, hi = 0, n - 1          # the target is larger than every element\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    lo = mid + 1\n    steps += 1',
  sqrt: 'i = 1\nwhile i * i <= n:\n    i += 1\n    steps += 1',
  linear: 'for x in a:                 # the target is not in the list\n    steps += 1             # one comparison each',
  merge: 'merge_sort(a)               # on the worst-case input\n# steps = comparisons made while merging',
  'insertion-best': 'insertion_sort(a)           # a is already sorted\n# steps = comparisons with the left neighbor',
  insertion: 'insertion_sort(a)           # a is in reverse order\n# steps = comparisons with the left neighbor',
  bubble: 'for i in range(n - 1):\n    for j in range(n - 1 - i):\n        steps += 1         # compare a[j] and a[j+1]',
  pairs: 'for i in range(n):\n    for j in range(i + 1, n):\n        steps += 1',
  'fib-memo': 'def fib(k):                 # a dictionary remembers values\n    steps += 1\n    ...',
  fib: 'def fib(k):\n    steps += 1\n    return k if k < 2 else fib(k-1) + fib(k-2)',
  subsets: 'def go(i):                  # take element i or leave it\n    if i == n: steps += 1; return\n    go(i + 1); go(i + 1)',
}

export function BigOCounter() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [id, setId] = useState('bubble')
  const a: Algo = ALGOS.find((q) => q.id === id) ?? ALGOS[0]
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const sizes = sizesFor(a)
  const counts = sizes.map((n) => a.steps(n))
  const gc = a.growth === 'fib' ? null : GROWTH.find((q) => q.id === a.growth)
  const lastRatio = counts.length >= 2 ? counts[counts.length - 1] / counts[counts.length - 2] : NaN
  const consecutive = a.growth === 'exp' || a.growth === 'fib'
  const xmax = sizes[sizes.length - 1]
  const ymax = Math.max(...counts, 1)
  const segs = counts.slice(1).map((v, i) => ({ x1: sizes[i], y1: counts[i], x2: sizes[i + 1], y2: v, cls: 'tansec' }))
  return (
    <Frame name="bigocounter">
      <div className="chips">
        {ALGOS.map((q) => (
          <button key={q.id} className={`chip ${id === q.id ? 'on' : ''}`} onClick={() => setId(q.id)} aria-pressed={id === q.id}>
            {tc(ALGO_NAME[q.id])}
          </button>
        ))}
      </div>
      <pre className="code" style={{ overflowX: 'auto', margin: '8px 0', whiteSpace: 'pre' }}>
        {ALGO_CODE[id]}
      </pre>
      <Plot
        xr={[0, xmax * 1.05]}
        yr={[0, ymax * 1.1]}
        segs={segs}
        dots={sizes.map((n, i) => ({ x: n, y: counts[i] }))}
        label={tc(L('The number of steps against the size n', 'Banyaknya langkah terhadap ukuran n'))}
      />
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>n</th>
              <th>{tc(L('steps', 'langkah'))}</th>
              <th>{consecutive ? tc(L('ratio to the previous', 'rasio ke sebelumnya')) : tc(L('ratio to n/2', 'rasio ke n/2'))}</th>
              {gc && (
                <th>
                  {tc(L('steps', 'langkah'))} / <Tex src={tdec(gc.tex)} />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sizes.map((n, i) => (
              <tr key={n}>
                <td>{n.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</td>
                <td>{counts[i].toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</td>
                <td>{i > 0 && counts[i - 1] > 0 ? four(counts[i] / counts[i - 1], sep) : '–'}</td>
                {gc && <td>{four(counts[i] / 10 ** gc.log10(n), sep)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="okline">
          {tc(L('Growth', 'Pertumbuhan'))}: {gc ? <Tex src={tdec(`O(${gc.tex})`)} /> : <Tex src="O(\varphi^{n})" />} ({tc(a.growth === 'fib' ? L('exponential', 'eksponensial') : GROWTH_NAME[a.growth])}). {tc(L('Last ratio', 'Rasio terakhir'))}: {four(lastRatio, sep)}.
        </p>
        <p className="small">
          {tc(
            consecutive
              ? L('Each step of n multiplies the work by a constant factor (2 for subsets, about 1.618 for the Fibonacci calls): that is exponential growth.', 'Setiap kenaikan n mengalikan kerja dengan faktor tetap (2 untuk himpunan bagian, sekitar 1,618 untuk panggilan Fibonacci): itulah pertumbuhan eksponensial.')
              : L('Doubling n multiplies a linear count by 2, a quadratic one by 4, adds a constant to a logarithmic one, and multiplies an n log n count by slightly more than 2.', 'Menggandakan n mengalikan hitungan linear dengan 2, yang kuadrat dengan 4, menambahkan konstanta pada yang logaritmik, dan mengalikan hitungan n log n dengan sedikit lebih dari 2.'),
          )}
        </p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------------------- recurrences */

interface RPreset {
  a: number
  b: number
  d: number
  name: { en: string; id: string }
}
const R_PRESETS: RPreset[] = [
  { a: 2, b: 2, d: 1, name: { en: 'merge sort', id: 'merge sort' } },
  { a: 1, b: 2, d: 0, name: { en: 'binary search', id: 'pencarian biner' } },
  { a: 3, b: 2, d: 1, name: { en: 'Karatsuba multiplication', id: 'perkalian Karatsuba' } },
  { a: 8, b: 2, d: 2, name: { en: 'matrix product, 8 blocks', id: 'perkalian matriks, 8 blok' } },
  { a: 7, b: 2, d: 2, name: { en: 'Strassen', id: 'Strassen' } },
  { a: 1, b: 2, d: 1, name: { en: 'halve, then work n', id: 'bagi dua, lalu kerja n' } },
  { a: 2, b: 2, d: 0, name: { en: 'two halves, constant work', id: 'dua bagian, kerja konstan' } },
]

export function BigORecurrence() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [as, setA] = useState('2')
  const [bs, setB] = useState('2')
  const [ds, setD] = useState('1')
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  const a = Number(as.replace(',', '.'))
  const b = Number(bs.replace(',', '.'))
  const d = Number(ds.replace(',', '.'))
  const valid = Number.isInteger(a) && a >= 1 && a <= 12 && Number.isInteger(b) && b >= 2 && b <= 8 && Number.isFinite(d) && d >= 0 && d <= 4
  let body
  if (!valid) body = <p className="noline">{tc(L('Use a whole number a from 1 to 12, a whole number b from 2 to 8 and d from 0 to 4.', 'Pakai bilangan bulat a dari 1 sampai 12, bilangan bulat b dari 2 sampai 8, dan d dari 0 sampai 4.'))}</p>
  else {
    const m = masterTheorem(a, b, d)
    const rows = Array.from({ length: 11 }, (_, k) => ({ k, n: b ** k, T: recurrenceValue(a, b, d, k), g: masterGrowth(a, b, d, k) }))
    const caseText =
      m.kind === 'balanced'
        ? L('d = log_b a: every level of the recursion tree does the same work, and there are log n levels.', 'd = log_b a: setiap tingkat pohon rekursi melakukan kerja yang sama, dan ada log n tingkat.')
        : m.kind === 'root'
          ? L('d > log_b a: the work at the top dominates, a geometric series that is dominated by its first term.', 'd > log_b a: kerja di puncak mendominasi, deret geometri yang didominasi suku pertamanya.')
          : L('d < log_b a: the leaves dominate: there are n^(log_b a) of them.', 'd < log_b a: daun-daunnya mendominasi: ada n^(log_b a) daun.')
    body = (
      <>
        <div style={{ overflowX: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>k</th>
                <th>n = {b}^k</th>
                <th>T(n)</th>
                <th>T(n) / {tc(L('predicted growth', 'pertumbuhan yang diramalkan'))}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k}>
                  <td>{r.k}</td>
                  <td>{r.n.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</td>
                  <td>{r.T >= 1e9 ? r.T.toExponential(3).replace('.', sep) : r.T.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')}</td>
                  <td>{r.g > 0 ? four(r.T / r.g, sep) : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wgtout" aria-live="polite">
          <p>
            <Tex src={tdec(`T(n)=${a === 1 ? '' : a}\\,T\\!\\left(\\dfrac{n}{${b}}\\right)+n^{${d}},\\qquad \\log_${b} ${a}=${four(m.logba, '.')}`)} />
          </p>
          <p className="okline">
            <Tex src={tdec(`T(n)=${m.tex}`)} />
          </p>
          <p className="small">{tc(caseText)}</p>
        </div>
      </>
    )
  }
  return (
    <Frame name="bigorecur">
      <div className="inrow">
        <label className="lbl">
          a = <input style={{ width: '3.5em' }} value={as} aria-label="a" onChange={(e) => setA(e.target.value)} />
        </label>
        <label className="lbl">
          b = <input style={{ width: '3.5em' }} value={bs} aria-label="b" onChange={(e) => setB(e.target.value)} />
        </label>
        <label className="lbl">
          d = <input style={{ width: '3.5em' }} value={ds} aria-label="d" onChange={(e) => setD(e.target.value)} />
        </label>
      </div>
      <div className="chips">
        {R_PRESETS.map((p) => (
          <button
            key={`${p.a}${p.b}${p.d}`}
            className="chip ghost"
            onClick={() => {
              setA(String(p.a))
              setB(String(p.b))
              setD(String(p.d))
            }}
          >
            {tc(p.name)}
          </button>
        ))}
      </div>
      {body}
    </Frame>
  )
}
