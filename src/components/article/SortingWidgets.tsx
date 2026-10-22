import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import { STABLE, SORT_ALGOS, binarySearch, bisectRoot, isqrtSteps, makeInput, sortTrace, type Pattern, type SearchMode, type SortAlgo } from '../../lib/sorting'
import { Tex } from '../ui'
import { exprTex } from '../../lib/exprtex'
import { Frame, L, useSep } from './widgetKit'

/** Up to fifteen decimals, without trailing zeros: bisection brackets differ in the late digits. */
const long = (x: number, sep: string): string => x.toFixed(15).replace(/0+$/, '').replace(/\.$/, '').replace('.', sep)

/** Whole numbers with the reader's thousands separator. */
const grp = (n: number, lang: string): string => n.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')

/* ------------------------------------------------------------------------------ binary search */

const MODES: { id: SearchMode; label: { en: string; id: string } }[] = [
  { id: 'find', label: L('find x', 'cari x') },
  { id: 'lower', label: L('first index with a[i] ≥ x', 'indeks pertama dengan a[i] ≥ x') },
  { id: 'upper', label: L('first index with a[i] > x', 'indeks pertama dengan a[i] > x') },
]

const B_PRESETS: { list: string; x: string; mode: SearchMode }[] = [
  { list: '2, 3, 5, 7, 7, 7, 11, 13, 17, 19, 23, 29', x: '19', mode: 'find' },
  { list: '2, 3, 5, 7, 7, 7, 11, 13, 17, 19, 23, 29', x: '7', mode: 'lower' },
  { list: '2, 3, 5, 7, 7, 7, 11, 13, 17, 19, 23, 29', x: '7', mode: 'upper' },
  { list: '2, 3, 5, 7, 7, 7, 11, 13, 17, 19, 23, 29', x: '8', mode: 'find' },
  { list: '1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31', x: '31', mode: 'find' },
]

export function BinarySearchViz() {
  const { tc } = useI18n()
  const [ltext, setL] = useState(B_PRESETS[0].list)
  const [xtext, setX] = useState(B_PRESETS[0].x)
  const [mode, setMode] = useState<SearchMode>('find')
  const [k, setK] = useState(0)
  const tokens = ltext.split(/[\s,;]+/).filter(Boolean)
  const x = Number(xtext)
  const bad = tokens.length === 0 || tokens.length > 60 || tokens.some((t) => !/^-?\d{1,4}$/.test(t)) || !/^-?\d{1,4}$/.test(xtext.trim())
  const a = bad ? [] : tokens.map(Number).sort((p, q) => p - q)
  const run = bad ? { steps: [], index: -1 } : binarySearch(a, x, mode)
  const K = run.steps.length
  const pos = Math.min(k, K)
  const atEnd = pos === K
  const st = atEnd ? null : run.steps[pos]
  const reset = (): void => setK(0)
  const bounded = mode !== 'find'
  const needBound = Math.floor(Math.log2(Math.max(1, a.length))) + 1

  let sentence = ''
  if (st) {
    const v = a[st.mid]
    if (mode === 'find') {
      sentence =
        st.cmp === 'equal'
          ? tc(L(`a[${st.mid}] = ${v} equals x: found at index ${st.mid}.`, `a[${st.mid}] = ${v} sama dengan x: ditemukan di indeks ${st.mid}.`))
          : st.cmp === 'less'
            ? tc(L(`a[${st.mid}] = ${v} is less than x = ${x}, so x can only be to the right: lo = ${st.mid + 1}.`, `a[${st.mid}] = ${v} kurang dari x = ${x}, sehingga x hanya bisa di kanan: lo = ${st.mid + 1}.`))
            : tc(L(`a[${st.mid}] = ${v} is greater than x = ${x}, so x can only be to the left: hi = ${st.mid - 1}.`, `a[${st.mid}] = ${v} lebih dari x = ${x}, sehingga x hanya bisa di kiri: hi = ${st.mid - 1}.`))
    } else {
      const right = mode === 'lower' ? v < x : v <= x
      const rel = mode === 'lower' ? '<' : '≤'
      sentence = right
        ? tc(L(`a[${st.mid}] = ${v} ${rel} x = ${x} is true, so the answer is to the right of mid: lo = ${st.mid + 1}.`, `a[${st.mid}] = ${v} ${rel} x = ${x} benar, sehingga jawabannya di kanan mid: lo = ${st.mid + 1}.`))
        : tc(L(`a[${st.mid}] = ${v} ${rel} x = ${x} is false, so mid could be the answer, and nothing beyond it: hi = ${st.mid}.`, `a[${st.mid}] = ${v} ${rel} x = ${x} salah, sehingga mid bisa jadi jawabannya, dan tak ada yang di sebelah kanannya: hi = ${st.mid}.`))
    }
  }

  return (
    <Frame name="bsearch">
      <div className="inrow">
        <label className="lbl" style={{ flex: '2 1 12em' }}>
          a = <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={ltext} aria-label={tc(L('the list', 'daftar'))} onChange={(e) => { setL(e.target.value); reset() }} />
        </label>
        <label className="lbl">
          x = <input style={{ width: '4.5em' }} value={xtext} aria-label="x" onChange={(e) => { setX(e.target.value); reset() }} />
        </label>
      </div>
      <div className="chips">
        {MODES.map((m) => (
          <button key={m.id} className={`chip ${mode === m.id ? 'on' : ''}`} onClick={() => { setMode(m.id); reset() }} aria-pressed={mode === m.id}>
            {tc(m.label)}
          </button>
        ))}
      </div>
      <div className="chips">
        {B_PRESETS.map((p, i) => (
          <button key={i} className="chip ghost" onClick={() => { setL(p.list); setX(p.x); setMode(p.mode); reset() }}>
            {p.list.split(',').length} {tc(L('numbers', 'bilangan'))}, x = {p.x}, {tc(MODES.find((m) => m.id === p.mode)!.label)}
          </button>
        ))}
      </div>
      {bad ? (
        <p className="noline">{tc(L('Type 1 to 60 whole numbers (up to four digits) separated by commas or spaces, and a whole number x. The list is sorted for you.', 'Ketik 1 sampai 60 bilangan bulat (sampai empat angka) yang dipisah koma atau spasi, dan bilangan bulat x. Daftar diurutkan untukmu.'))}</p>
      ) : (
        <>
          <div className="bsrow" role="img" aria-label={tc(L('The sorted list with the interval that is still open', 'Daftar terurut dengan selang yang masih terbuka'))}>
            {a.map((v, i) => {
              const inside = st ? (bounded ? i >= st.lo && i < st.hi : i >= st.lo && i <= st.hi) : false
              const isMid = st !== null && st.mid === i
              const res = atEnd && mode === 'find' && run.index === i
              const ins = atEnd && bounded && run.index === i
              const insEnd = atEnd && bounded && run.index === a.length && i === a.length - 1
              const tags: string[] = []
              if (st && inside && i === st.lo) tags.push('lo')
              if (isMid) tags.push('mid')
              if (st && !bounded && i === st.hi) tags.push('hi')
              if (st && bounded && i === st.hi - 1) tags.push('hi−1')
              return (
                <div key={i} className={`bscell ${st && !inside ? 'out' : ''} ${isMid ? 'mid' : ''} ${res ? 'res' : ''} ${ins ? 'ins' : ''} ${insEnd ? 'insend' : ''}`}>
                  {v}
                  <small>{i}</small>
                  <em>{tags.join(' ') || ' '}</em>
                </div>
              )
            })}
          </div>
          <div className="inrow">
            <button className="btn soft" onClick={() => setK(Math.max(0, pos - 1))} disabled={pos === 0}>
              ◀
            </button>
            <button className="btn soft" onClick={() => setK(Math.min(K, pos + 1))} disabled={atEnd}>
              {tc(L('Next look', 'Lihat berikutnya'))} ▶
            </button>
            <button className="btn ghost" onClick={() => setK(K)} disabled={atEnd}>
              {tc(L('Run to the end', 'Jalankan sampai selesai'))}
            </button>
            <span className="small muted">
              {tc(L('look', 'lihat'))} {Math.min(pos + 1, K)} / {K}
            </span>
          </div>
          <div className="wgtout" aria-live="polite">
            {st ? (
              <p>
                lo = {st.lo}, hi = {st.hi}, mid = {st.mid}. {sentence}
              </p>
            ) : mode === 'find' ? (
              run.index >= 0 ? (
                <p className="okline">
                  {tc(L(`Found: a[${run.index}] = ${x}, after ${K} look${K === 1 ? '' : 's'}.`, `Ditemukan: a[${run.index}] = ${x}, setelah ${K} kali melihat.`))}
                </p>
              ) : (
                <p className="noline">
                  {tc(L(`Not found: the open interval became empty after ${K} look${K === 1 ? '' : 's'}, so ${x} is not in the list.`, `Tidak ditemukan: selang terbuka menjadi kosong setelah ${K} kali melihat, jadi ${x} tidak ada dalam daftar.`))}
                </p>
              )
            ) : (
              <p className="okline">
                {tc(L(`Answer: index ${run.index}`, `Jawaban: indeks ${run.index}`))}
                {run.index === a.length ? tc(L(' (past the end: every number qualifies as "before x").', ' (melewati ujung: semua bilangan termasuk "sebelum x").')) : ` (a[${run.index}] = ${a[run.index]})`}
                {tc(L(`. Inserting x at this index keeps the list sorted; after ${K} look${K === 1 ? '' : 's'}.`, `. Menyisipkan x di indeks ini menjaga daftar tetap terurut; setelah ${K} kali melihat.`))}
              </p>
            )}
            <p className="small">
              {tc(L(`n = ${a.length}: at most ${needBound} looks for "find", and ${K} were used. A linear scan could need ${a.length}.`, `n = ${a.length}: paling banyak ${needBound} kali melihat untuk "cari x", dan terpakai ${K}. Pemindaian linear bisa butuh ${a.length}.`))}
            </p>
          </div>
        </>
      )}
    </Frame>
  )
}

/* ---------------------------------------------------------------------------------- sorting */

const ALGO_NAME: Record<SortAlgo, { en: string; id: string }> = {
  selection: L('selection sort', 'selection sort'),
  insertion: L('insertion sort', 'insertion sort'),
  bubble: L('bubble sort', 'bubble sort'),
  merge: L('merge sort', 'merge sort'),
  quick: L('quicksort', 'quicksort'),
  heap: L('heapsort', 'heapsort'),
}
const ALGO_IDEA: Record<SortAlgo, { en: string; id: string }> = {
  selection: L('Find the smallest of the rest and swap it to the front. Always n(n − 1)/2 comparisons, but at most n − 1 swaps.', 'Cari yang terkecil dari sisanya dan tukar ke depan. Selalu n(n − 1)/2 perbandingan, tetapi paling banyak n − 1 pertukaran.'),
  insertion: L('Take the next number and slide it left past every larger neighbor, like sorting cards in the hand. Fast when the input is nearly sorted.', 'Ambil bilangan berikutnya dan geser ke kiri melewati setiap tetangga yang lebih besar, seperti mengurutkan kartu di tangan. Cepat bila masukan hampir terurut.'),
  bubble: L('Swap neighbors that are out of order, pass after pass; the largest number "bubbles" to the end of each pass. It stops after a pass with no swap.', 'Tukar tetangga yang salah urutan, putaran demi putaran; bilangan terbesar "menggelembung" ke ujung tiap putaran. Berhenti setelah putaran tanpa pertukaran.'),
  merge: L('Sort the left half, sort the right half, then merge the two sorted halves. About n log₂ n comparisons whatever the input.', 'Urutkan separuh kiri, urutkan separuh kanan, lalu gabungkan kedua separuh terurut itu. Sekitar n log₂ n perbandingan apa pun masukannya.'),
  quick: L('Pick the last number as the pivot, put smaller numbers before it and the rest after it, then sort both sides. Fast on average, quadratic on sorted input with this pivot.', 'Pilih bilangan terakhir sebagai pivot, taruh yang lebih kecil sebelumnya dan sisanya sesudahnya, lalu urutkan kedua sisi. Cepat rata-rata, kuadratik pada masukan terurut dengan pivot ini.'),
  heap: L('Build a max-heap, then swap the largest to the end and repair the heap, n − 1 times. About 2n log₂ n comparisons whatever the input.', 'Bangun max-heap, lalu tukar yang terbesar ke ujung dan perbaiki heap, n − 1 kali. Sekitar 2n log₂ n perbandingan apa pun masukannya.'),
}
const PATTERNS: { id: Pattern; label: { en: string; id: string } }[] = [
  { id: 'random', label: L('random', 'acak') },
  { id: 'sorted', label: L('already sorted', 'sudah terurut') },
  { id: 'reversed', label: L('reversed', 'terbalik') },
  { id: 'few', label: L('only 3 distinct values', 'hanya 3 nilai berbeda') },
  { id: 'nearly', label: L('nearly sorted', 'hampir terurut') },
]

export function SortViz() {
  const { tc, lang } = useI18n()
  const [algo, setAlgo] = useState<SortAlgo>('quick')
  const [pattern, setPattern] = useState<Pattern>('random')
  const [n, setN] = useState(16)
  const [seed, setSeed] = useState(3)
  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(false)
  const run = useMemo(() => sortTrace(algo, makeInput(pattern, n, seed)), [algo, pattern, n, seed])
  const last = run.frames.length - 1
  const stride = Math.max(1, Math.ceil(last / 100))
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setPos((p) => {
        if (p >= last) {
          setPlaying(false)
          return p
        }
        return Math.min(last, p + stride)
      })
    }, 50)
    return () => clearInterval(id)
  }, [playing, last, stride])
  const reset = (): void => {
    setPos(0)
    setPlaying(false)
  }
  const f = run.frames[Math.min(pos, last)]
  const top = Math.max(...f.arr, 1)
  const what = f.cmp.length ? tc(L(`comparing positions ${f.cmp[0]} and ${f.cmp[1]}`, `membandingkan posisi ${f.cmp[0]} dan ${f.cmp[1]}`)) : f.mv.length ? tc(L(`moving ${f.mv.length === 1 ? 'position ' + f.mv[0] : 'positions ' + f.mv.join(' and ')}`, `memindahkan ${f.mv.length === 1 ? 'posisi ' + f.mv[0] : 'posisi ' + f.mv.join(' dan ')}`)) : pos === 0 ? tc(L('the start', 'awal')) : tc(L('done', 'selesai'))
  return (
    <Frame name="sortviz">
      <div className="chips">
        {SORT_ALGOS.map((q) => (
          <button key={q} className={`chip ${algo === q ? 'on' : ''}`} onClick={() => { setAlgo(q); reset() }} aria-pressed={algo === q}>
            {tc(ALGO_NAME[q])}
          </button>
        ))}
      </div>
      <div className="chips">
        {PATTERNS.map((q) => (
          <button key={q.id} className={`chip ghost ${pattern === q.id ? 'on' : ''}`} onClick={() => { setPattern(q.id); reset() }} aria-pressed={pattern === q.id}>
            {tc(q.label)}
          </button>
        ))}
        {pattern === 'random' && (
          <button className="chip ghost" onClick={() => { setSeed(seed + 1); reset() }}>
            {tc(L('another random input', 'masukan acak lain'))}
          </button>
        )}
      </div>
      <label className="lbl slider">
        n = <b>{n}</b>
        <input type="range" min={4} max={40} value={n} aria-label="n" onChange={(e) => { setN(Number(e.target.value)); reset() }} />
      </label>
      <div className="sortbars" role="img" aria-label={tc(L('Bars: the height is the number', 'Batang: tinggi adalah bilangannya'))}>
        {f.arr.map((v, i) => (
          <i key={i} className={f.mv.includes(i) ? 'mv' : f.cmp.includes(i) ? 'cmp' : f.done.includes(i) ? 'done' : ''} style={{ height: `${(v / top) * 100}%` }} />
        ))}
      </div>
      <div className="inrow">
        <button className="btn soft" onClick={() => { if (pos >= last) setPos(0); setPlaying(!playing) }}>
          {playing ? tc(L('Pause', 'Jeda')) : tc(L('Play', 'Putar'))}
        </button>
        <button className="btn ghost" onClick={() => { setPlaying(false); setPos(Math.max(0, pos - 1)) }} disabled={pos === 0}>
          ◀
        </button>
        <button className="btn ghost" onClick={() => { setPlaying(false); setPos(Math.min(last, pos + 1)) }} disabled={pos >= last}>
          ▶
        </button>
        <button className="btn ghost" onClick={reset}>
          {tc(L('Restart', 'Ulangi'))}
        </button>
      </div>
      <label className="lbl slider">
        {tc(L('event', 'kejadian'))} <b>{Math.min(pos, last)}</b> / {last}
        <input type="range" min={0} max={last} value={Math.min(pos, last)} aria-label={tc(L('event', 'kejadian'))} onChange={(e) => { setPlaying(false); setPos(Number(e.target.value)) }} />
      </label>
      <div className="wgtout" aria-live="polite">
        <p>
          {tc(L('Now', 'Sekarang'))}: {what}. <span className="small muted">{tc(L('Gold: compared. Red: moved. Green: in its final place.', 'Emas: dibandingkan. Merah: dipindah. Hijau: sudah di tempat akhirnya.'))}</span>
        </p>
        <p className="okline">
          {tc(ALGO_NAME[algo])}, n = {n}: {grp(run.comparisons, lang)} {tc(L('comparisons', 'perbandingan'))}, {grp(run.moves, lang)} {tc(algo === 'insertion' ? L('shifts', 'geseran') : algo === 'merge' ? L('writes', 'penulisan') : L('swaps', 'pertukaran'))}; {tc(STABLE[algo] ? L('stable', 'stabil') : L('not stable', 'tidak stabil'))}.
        </p>
        <p className="small">{tc(ALGO_IDEA[algo])}</p>
      </div>
    </Frame>
  )
}

/* --------------------------------------------------------------------------- the race */

const SIZES = [16, 64, 256, 1024]

export function SortRace() {
  const { tc, lang } = useI18n()
  const [pattern, setPattern] = useState<Pattern>('random')
  const [n, setN] = useState(256)
  const [seed, setSeed] = useState(7)
  const rows = useMemo(() => {
    const input = makeInput(pattern, n, seed)
    return SORT_ALGOS.map((q) => ({ algo: q, r: sortTrace(q, input, undefined, false) }))
  }, [pattern, n, seed])
  const minC = Math.min(...rows.map((q) => q.r.comparisons))
  const nlg = n * Math.log2(n)
  let harmonic = 0
  for (let i = 1; i <= n; i++) harmonic += 1 / i
  const quickAvg = 2 * (n + 1) * harmonic - 4 * n
  return (
    <Frame name="sortrace">
      <div className="chips">
        {PATTERNS.map((q) => (
          <button key={q.id} className={`chip ${pattern === q.id ? 'on' : ''}`} onClick={() => setPattern(q.id)} aria-pressed={pattern === q.id}>
            {tc(q.label)}
          </button>
        ))}
        {pattern === 'random' && (
          <button className="chip ghost" onClick={() => setSeed(seed + 1)}>
            {tc(L('another random input', 'masukan acak lain'))}
          </button>
        )}
      </div>
      <div className="chips">
        {SIZES.map((s) => (
          <button key={s} className={`chip ghost ${n === s ? 'on' : ''}`} onClick={() => setN(s)} aria-pressed={n === s}>
            n = {grp(s, lang)}
          </button>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th />
              <th>{tc(L('comparisons', 'perbandingan'))}</th>
              <th>{tc(L('moves', 'perpindahan'))}</th>
              <th>{tc(L('stable', 'stabil'))}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ algo, r }) => (
              <tr key={algo} className={r.comparisons === minC ? 'hi' : ''}>
                <td>{tc(ALGO_NAME[algo])}</td>
                <td>{grp(r.comparisons, lang)}</td>
                <td>{grp(r.moves, lang)}</td>
                <td>{STABLE[algo] ? '✓' : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="small">
          {tc(L('For comparison', 'Sebagai pembanding'))}: n log₂ n = {grp(Math.round(nlg), lang)}, n²/2 = {grp(Math.round((n * n) / 2), lang)}, n − 1 = {grp(n - 1, lang)}. {tc(L('The highlighted row has the fewest comparisons. Moves count swaps (selection, bubble, quick, heap), shifts (insertion) or writes into the merged array (merge), so compare moves only within one algorithm.', 'Baris yang disorot punya perbandingan paling sedikit. Perpindahan menghitung pertukaran (selection, bubble, quick, heap), geseran (insertion), atau penulisan ke larik gabungan (merge), jadi bandingkan perpindahan hanya dalam satu algoritma.'))}
        </p>
        <p className="small">
          {pattern === 'sorted' || pattern === 'reversed'
            ? tc(L(`Quicksort with the last element as the pivot makes n(n − 1)/2 = ${grp((n * (n - 1)) / 2, lang)} comparisons here: the pivot is always the smallest or the largest.`, `Quicksort dengan elemen terakhir sebagai pivot membuat n(n − 1)/2 = ${grp((n * (n - 1)) / 2, lang)} perbandingan di sini: pivotnya selalu yang terkecil atau terbesar.`))
            : pattern === 'nearly'
              ? tc(L('Insertion sort pays one comparison per number plus one per inversion, so a nearly sorted input costs it about n; quicksort with the last element as pivot is still close to quadratic.', 'Insertion sort membayar satu perbandingan per bilangan ditambah satu per inversi, sehingga masukan hampir terurut hanya memerlukan sekitar n; quicksort dengan elemen terakhir sebagai pivot tetap mendekati kuadratik.'))
              : pattern === 'few'
                ? tc(L('With few distinct values, many numbers are equal: the Lomuto partition used here puts equal numbers on one side, so quicksort degrades toward a quadratic count - this is why real libraries use a three-way partition.', 'Dengan sedikit nilai berbeda, banyak bilangan sama: partisi Lomuto di sini menaruh bilangan sama di satu sisi, sehingga quicksort memburuk ke arah hitungan kuadratik - karena itu pustaka sungguhan memakai partisi tiga arah.'))
                : tc(L(`On random input, quicksort averages 2(n + 1)Hₙ − 4n ≈ ${grp(Math.round(quickAvg), lang)} comparisons (this input is one sample), a little more than merge sort.`, `Pada masukan acak, quicksort rata-rata 2(n + 1)Hₙ − 4n ≈ ${grp(Math.round(quickAvg), lang)} perbandingan (masukan ini hanya satu contoh), sedikit lebih banyak daripada merge sort.`))}
        </p>
      </div>
    </Frame>
  )
}

/* ------------------------------------------------------------------------ search the answer */

const F_PRESETS: { f: string; a: number; b: number }[] = [
  { f: 'x^2-2', a: 1, b: 2 },
  { f: 'x^3-x-1', a: 1, b: 2 },
  { f: 'cos(x)-x', a: 0, b: 1 },
  { f: 'exp(x)-3', a: 0, b: 2 },
  { f: 'x*ln(x)-2', a: 1, b: 3 },
]
const I_PRESETS = [10, 99, 1000, 123456789, 999999999999]

export function BisectAnswer() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [kind, setKind] = useState<'root' | 'isqrt'>('root')
  const [fs, setF] = useState(F_PRESETS[0].f)
  const [as, setA] = useState('1')
  const [bs, setB] = useState('2')
  const [count, setCount] = useState(20)
  const [ns, setNs] = useState('123456789')
  const tdec = (s: string): string => (lang === 'id' ? s.replace(/(\d)\.(\d)/g, '$1{,}$2') : s)
  let body
  if (kind === 'root') {
    const a = Number(as.replace(',', '.'))
    const b = Number(bs.replace(',', '.'))
    const rows = Number.isFinite(a) && Number.isFinite(b) ? bisectRoot(fs, a, b, count) : null
    body = rows ? (
      <>
        <div style={{ overflowX: 'auto', maxHeight: '18em', overflowY: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>k</th>
                <th>lo</th>
                <th>hi</th>
                <th>mid</th>
                <th>f(mid)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} className={r.k === rows.length ? 'hi' : ''}>
                  <td>{r.k}</td>
                  <td>{long(r.lo, sep)}</td>
                  <td>{long(r.hi, sep)}</td>
                  <td>{long(r.mid, sep)}</td>
                  <td>{r.value.toExponential(2).replace('.', sep)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wgtout" aria-live="polite">
          <p className="okline">
            {tc(L(`After ${rows.length} halving${rows.length === 1 ? '' : 's'} the root is inside an interval of width ${((b - a) / 2 ** rows.length).toExponential(2).replace('.', sep)}: about ${long(rows[rows.length - 1].mid, sep)}.`, `Setelah ${rows.length} kali pembagian dua, akar berada dalam selang selebar ${((b - a) / 2 ** rows.length).toExponential(2).replace('.', sep)}: sekitar ${long(rows[rows.length - 1].mid, sep)}.`))}
          </p>
          <p className="small">
            {tc(L('Every halving gains log₁₀ 2 ≈ 0.30 of a decimal digit, whatever the function: that is slow next to Newton\'s method, but it cannot fail once f changes sign on the interval.', 'Setiap pembagian dua menambah log₁₀ 2 ≈ 0,30 angka desimal, apa pun fungsinya: itu lambat dibandingkan metode Newton, tetapi tidak bisa gagal selama f berganti tanda pada selang itu.'))}
          </p>
        </div>
      </>
    ) : (
      <p className="noline">{tc(L('I need a formula in x I can read (for example x^2-2 or cos(x)-x) and an interval a < b where f is defined and has opposite signs at the two ends.', 'Saya butuh rumus dalam x yang bisa saya baca (misalnya x^2-2 atau cos(x)-x) dan selang a < b di mana f terdefinisi dan bertanda berlawanan di kedua ujungnya.'))}</p>
    )
  } else {
    const valid = /^\d{1,12}$/.test(ns.trim())
    const N = valid ? Number(ns) : 0
    const r = valid ? isqrtSteps(N) : null
    const big = (v: number): string => (v > 1e15 ? v.toExponential(3).replace('.', sep) : grp(v, lang))
    body = r ? (
      <>
        <div style={{ overflowX: 'auto', maxHeight: '18em', overflowY: 'auto' }}>
          <table className="rtable">
            <thead>
              <tr>
                <th>k</th>
                <th>lo</th>
                <th>hi</th>
                <th>mid</th>
                <th>mid²</th>
                <th>mid² ≤ N</th>
              </tr>
            </thead>
            <tbody>
              {r.rows.map((q) => (
                <tr key={q.k}>
                  <td>{q.k}</td>
                  <td>{grp(q.lo, lang)}</td>
                  <td>{grp(q.hi, lang)}</td>
                  <td>{grp(q.mid, lang)}</td>
                  <td>{big(q.value)}</td>
                  <td>{q.value <= N ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wgtout" aria-live="polite">
          <p className="okline">
            ⌊√{grp(N, lang)}⌋ = <b>{grp(r.root, lang)}</b>. {tc(L(`${r.rows.length} test${r.rows.length === 1 ? '' : 's'}, against ${grp(r.root, lang)} for counting up one by one.`, `${r.rows.length} pengujian, dibandingkan ${grp(r.root, lang)} bila menghitung naik satu per satu.`))}
          </p>
          <p className="small">
            {tc(L('The predicate "mid² ≤ N" is true for small mid and false for large mid, so the answer is the last true. That monotone shape is all binary search needs.', 'Predikat "mid² ≤ N" benar untuk mid kecil dan salah untuk mid besar, jadi jawabannya adalah yang benar terakhir. Bentuk monoton itu satu-satunya yang dibutuhkan pencarian biner.'))}
          </p>
        </div>
      </>
    ) : (
      <p className="noline">{tc(L('Type a whole number N from 0 to 999 999 999 999.', 'Ketik bilangan bulat N dari 0 sampai 999 999 999 999.'))}</p>
    )
  }
  return (
    <Frame name="bisectanswer">
      <div className="chips">
        <button className={`chip ${kind === 'root' ? 'on' : ''}`} onClick={() => setKind('root')} aria-pressed={kind === 'root'}>
          {tc(L('a root of f(x) = 0', 'akar dari f(x) = 0'))}
        </button>
        <button className={`chip ${kind === 'isqrt' ? 'on' : ''}`} onClick={() => setKind('isqrt')} aria-pressed={kind === 'isqrt'}>
          {tc(L('integer square root', 'akar kuadrat bulat'))}
        </button>
      </div>
      {kind === 'root' ? (
        <>
          <div className="inrow">
            <label className="lbl" style={{ flex: '1 1 8em' }}>
              f(x) = <input style={{ flex: '1 1 6em', minWidth: 0, width: 'auto' }} value={fs} aria-label="f(x)" onChange={(e) => setF(e.target.value)} />
            </label>
            <label className="lbl">
              a = <input style={{ width: '4em' }} value={as} aria-label="a" onChange={(e) => setA(e.target.value)} />
            </label>
            <label className="lbl">
              b = <input style={{ width: '4em' }} value={bs} aria-label="b" onChange={(e) => setB(e.target.value)} />
            </label>
          </div>
          <div className="chips">
            {F_PRESETS.map((p) => (
              <button key={p.f} className="chip ghost" onClick={() => { setF(p.f); setA(String(p.a)); setB(String(p.b)) }}>
                <Tex src={tdec(`${exprTex(p.f)}=0`)} />
              </button>
            ))}
          </div>
          <label className="lbl slider">
            {tc(L('halvings', 'pembagian dua'))} <b>{count}</b>
            <input type="range" min={1} max={50} value={count} aria-label={tc(L('halvings', 'pembagian dua'))} onChange={(e) => setCount(Number(e.target.value))} />
          </label>
        </>
      ) : (
        <>
          <div className="inrow">
            <label className="lbl">
              N = <input style={{ width: '10em' }} value={ns} aria-label="N" onChange={(e) => setNs(e.target.value)} />
            </label>
          </div>
          <div className="chips">
            {I_PRESETS.map((v) => (
              <button key={v} className="chip ghost" onClick={() => setNs(String(v))}>
                N = {grp(v, lang)}
              </button>
            ))}
          </div>
        </>
      )}
      {body}
    </Frame>
  )
}
