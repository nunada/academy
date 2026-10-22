import { useMemo, useState } from 'react'
import { useI18n } from '../../i18n'
import { applyMove, discAtMove, frameStewart, hanoiGraph, moveCount, solveFrom, stateAfter, topDisc } from '../../lib/hanoi'
import { Frame, L, groupNumber, useSep } from './widgetKit'

const PEG = ['A', 'B', 'C']
const DISC_COLORS = ['var(--coral)', 'var(--sun)', 'var(--leaf)', 'var(--fig-b, #3b7fb0)', 'var(--gold)', 'var(--bad)', 'var(--muted)', 'var(--brand)']

/** The discs on each peg as an SVG: peg columns at x = 50, 150, 250. */
function Tower({ state, n, label, onPeg, selected }: { state: number[]; n: number; label: string; onPeg?: (p: number) => void; selected?: number | null }) {
  const H = 22
  const base = 20 + n * H + 14
  const pegs: number[][] = [[], [], []]
  for (let k = n - 1; k >= 0; k--) pegs[state[k]].push(k) // bottom (largest) first
  const widthOf = (k: number) => 22 + (k * (86 - 22)) / Math.max(1, n - 1)
  return (
    <svg viewBox={`0 0 300 ${base + 18}`} className="hanoi" role="img" aria-label={label} style={{ width: '100%', maxWidth: 440, display: 'block', margin: '8px auto' }}>
      <rect x={4} y={base} width={292} height={6} rx={3} fill="var(--border)" />
      {[0, 1, 2].map((p) => {
        const cx = 50 + p * 100
        return (
          <g key={p} onClick={onPeg ? () => onPeg(p) : undefined} style={onPeg ? { cursor: 'pointer' } : undefined}>
            <rect x={cx - 48} y={4} width={96} height={base + 14} fill={selected === p ? 'color-mix(in srgb, var(--gold) 22%, transparent)' : 'transparent'} rx={8} />
            <rect x={cx - 3} y={14} width={6} height={base - 14} rx={3} fill="var(--muted)" />
            {pegs[p].map((k, i) => {
              const w = widthOf(k)
              return <rect key={k} x={cx - w / 2} y={base - (i + 1) * H} width={w} height={H - 3} rx={5} fill={DISC_COLORS[k % DISC_COLORS.length]} stroke="var(--text)" strokeWidth={1} />
            })}
            <text x={cx} y={base + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--text)">
              {PEG[p]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* -------------------------------------------------------------------------------------- the puzzle */

export function HanoiPlay() {
  const { tc, lang } = useI18n()
  const [n, setN] = useState(3)
  const [state, setState] = useState<number[]>([0, 0, 0])
  const [moves, setMoves] = useState(0)
  const [from, setFrom] = useState<number | null>(null)
  const [msg, setMsg] = useState<{ en: string; id: string } | null>(null)
  const reset = (k: number): void => {
    setN(k)
    setState(new Array(k).fill(0))
    setMoves(0)
    setFrom(null)
    setMsg(null)
  }
  const solved = state.every((p) => p === 2)
  const rest = solveFrom(state, 2)
  const min = Number(moveCount(n))
  const tryMove = (a: number, b: number): void => {
    const next = applyMove(state, a, b)
    if (!next) {
      setMsg(topDisc(state, a) === -1 ? L('That peg is empty.', 'Tiang itu kosong.') : L('A bigger disc may not go on a smaller one.', 'Cakram yang lebih besar tidak boleh di atas yang lebih kecil.'))
      return
    }
    setState(next)
    setMoves(moves + 1)
    setMsg(null)
  }
  const onPeg = (p: number): void => {
    if (solved) return
    if (from === null) {
      if (topDisc(state, p) === -1) {
        setMsg(L('That peg is empty.', 'Tiang itu kosong.'))
        return
      }
      setFrom(p)
      setMsg(null)
    } else if (from === p) setFrom(null)
    else {
      tryMove(from, p)
      setFrom(null)
    }
  }
  const hint = rest[0]
  return (
    <Frame name="hanoiplay">
      <div className="chips">
        {[3, 4, 5, 6, 7].map((k) => (
          <button key={k} className={`chip ${n === k ? 'on' : ''}`} onClick={() => reset(k)} aria-pressed={n === k}>
            {k} {tc(L('discs', 'cakram'))}
          </button>
        ))}
      </div>
      <Tower state={state} n={n} label={tc(L('The three pegs A, B and C and their discs', 'Tiga tiang A, B, dan C dan cakramnya'))} onPeg={onPeg} selected={from} />
      <div className="inrow">
        {[0, 1, 2].map((p) => (
          <button key={p} className={`btn ${from === p ? '' : 'soft'}`} onClick={() => onPeg(p)} aria-pressed={from === p} disabled={solved}>
            {from === null ? tc(L('take from', 'ambil dari')) : from === p ? tc(L('cancel', 'batal')) : tc(L('put on', 'taruh di'))} {PEG[p]}
          </button>
        ))}
      </div>
      <div className="inrow">
        <button className="btn ghost" onClick={() => hint && (tryMove(hint.from, hint.to), setFrom(null))} disabled={solved}>
          {tc(L('Make the best move', 'Lakukan langkah terbaik'))}
        </button>
        <button className="btn ghost" onClick={() => reset(n)}>
          {tc(L('Start again', 'Mulai lagi'))}
        </button>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className={solved ? 'okline' : ''}>
          {tc(L('Moves', 'Langkah'))}: <b>{moves}</b> · {tc(L('best possible', 'terbaik'))}: {groupNumber(min, lang)} · {solved ? tc(L('done!', 'selesai!')) : `${tc(L('still to go at best', 'sisa paling sedikit'))}: ${rest.length}`}
        </p>
        {!solved && hint && (
          <p className="small">
            {tc(L('Best next move: the disc on', 'Langkah terbaik berikutnya: cakram di'))} {PEG[hint.from]} → {PEG[hint.to]}
            {from !== null ? ` (${tc(L('you took from', 'kamu mengambil dari'))} ${PEG[from]})` : ''}
          </p>
        )}
        {msg && <p className="noline">{tc(msg)}</p>}
        {solved && (
          <p className="small">
            {moves === min ? tc(L('That is the best possible: the shortest solution is unique.', 'Itu yang terbaik: solusi terpendeknya tunggal.')) : tc(L(`You used ${moves - min} more than the best possible. Try again with the recursive idea: move the top n − 1 discs out of the way first.`, `Kamu memakai ${moves - min} lebih banyak daripada yang terbaik. Coba lagi dengan gagasan rekursif: pindahkan n − 1 cakram teratas lebih dulu.`))}
          </p>
        )}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------------------------- the time it takes */

const RATES: { v: number; label: { en: string; id: string } }[] = [
  { v: 1, label: L('1 move a second', '1 langkah per detik') },
  { v: 1e3, label: L('1000 moves a second', '1000 langkah per detik') },
  { v: 1e9, label: L('10⁹ moves a second', '10⁹ langkah per detik') },
]
const YEAR = 365.25 * 24 * 3600

export function HanoiTime() {
  const { tc, lang } = useI18n()
  const sep = useSep()
  const [n, setN] = useState(64)
  const [ri, setRi] = useState(0)
  const moves = moveCount(n)
  const s = Number(moves) / RATES[ri].v
  const fixed = (x: number): string => x.toPrecision(3).replace('.', sep)
  const sci = (x: number): string => {
    const e = Math.floor(Math.log10(x))
    return `${(x / 10 ** e).toFixed(2).replace('.', sep)} × 10^${e}`
  }
  const timeText =
    s < 1e-3
      ? `< 1 ms`
      : s < 1
        ? `${fixed(s * 1000)} ms`
        : s < 120
          ? `${fixed(s)} ${tc(L('s', 'detik'))}`
          : s < 7200
            ? `${fixed(s / 60)} ${tc(L('minutes', 'menit'))}`
            : s < 172800
              ? `${fixed(s / 3600)} ${tc(L('hours', 'jam'))}`
              : s < 86400 * 400
                ? `${fixed(s / 86400)} ${tc(L('days', 'hari'))}`
                : s < YEAR * 1e5
                  ? `${fixed(s / YEAR)} ${tc(L('years', 'tahun'))}`
                  : `${sci(s / YEAR)} ${tc(L('years', 'tahun'))}`
  const universe = s / YEAR / 13.8e9
  const movesText = moves.toString().length > 15 ? `${moves.toString()[0]}${sep}${moves.toString().slice(1, 4)} × 10^${moves.toString().length - 1}` : groupNumber(moves, lang)
  const discRows = Array.from({ length: Math.min(n, 8) }, (_, k) => ({ k, count: 1n << BigInt(n - 1 - k) }))
  return (
    <Frame name="hanoitime">
      <label className="lbl slider">
        n = <b>{n}</b> {tc(L('discs', 'cakram'))}
        <input type="range" min={1} max={64} value={n} aria-label="n" onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <div className="chips">
        {RATES.map((q, i) => (
          <button key={i} className={`chip ghost ${ri === i ? 'on' : ''}`} onClick={() => setRi(i)} aria-pressed={ri === i}>
            {tc(q.label)}
          </button>
        ))}
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          2^{n} − 1 = <b>{movesText}</b> {tc(L('moves', 'langkah'))}
        </p>
        <p>
          {tc(L('Time at', 'Waktu pada'))} {tc(RATES[ri].label)}: <b>{timeText}</b>
          {universe >= 0.01 ? ` (${universe >= 10 ? fixed(universe) : fixed(universe)} ${tc(L('× the age of the universe', '× usia alam semesta'))})` : ''}
        </p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>{tc(L('disc', 'cakram'))}</th>
              <th>{tc(L('moves of that disc', 'langkah cakram itu'))}</th>
            </tr>
          </thead>
          <tbody>
            {discRows.map((r) => (
              <tr key={r.k}>
                <td>
                  {r.k + 1} {r.k === 0 ? tc(L('(smallest)', '(terkecil)')) : r.k === n - 1 ? tc(L('(largest)', '(terbesar)')) : ''}
                </td>
                <td>{r.count.toString().length > 15 ? `2^${n - 1 - r.k}` : groupNumber(r.count, lang)}</td>
              </tr>
            ))}
            {n > 8 && (
              <tr>
                <td>…</td>
                <td>…</td>
              </tr>
            )}
            {n > 8 && (
              <tr>
                <td>
                  {n} {tc(L('(largest)', '(terbesar)'))}
                </td>
                <td>1</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="small">{tc(L('Disc number k (counting the smallest as 1) moves 2^(n − k) times: the smallest moves every other move, and the largest moves exactly once, in the middle of the solution.', 'Cakram nomor k (terkecil dihitung 1) bergerak 2^(n − k) kali: yang terkecil bergerak setiap dua langkah, dan yang terbesar bergerak tepat sekali, di tengah solusi.'))}</p>
      </div>
    </Frame>
  )
}

/* -------------------------------------------------------------------------------- a position by number */

function describePeg(discs: number[], tc: (v: { en: string; id: string }) => string): string {
  if (discs.length === 0) return tc(L('empty', 'kosong'))
  const sorted = discs.slice().sort((a, b) => b - a)
  const shown = sorted.slice(0, 7).map((k) => k + 1)
  return `${shown.join(', ')}${sorted.length > 7 ? ` … (${sorted.length} ${tc(L('discs', 'cakram'))})` : ''}`
}

export function HanoiState() {
  const { tc, lang } = useI18n()
  const [n, setN] = useState(5)
  const [ms, setMs] = useState('13')
  const total = moveCount(n)
  const valid = /^\d{1,20}$/.test(ms.trim()) && BigInt(ms.trim()) <= total
  const m = valid ? BigInt(ms.trim()) : 0n
  const state = stateAfter(n, m)
  const pegs: number[][] = [[], [], []]
  state.forEach((p, k) => pegs[p].push(k))
  const gray = m ^ (m >> 1n)
  const moved = m >= 1n ? discAtMove(m) : null
  const setM = (v: bigint): void => setMs((v < 0n ? 0n : v > total ? total : v).toString())
  return (
    <Frame name="hanoistate">
      <label className="lbl slider">
        n = <b>{n}</b> {tc(L('discs', 'cakram'))}
        <input
          type="range"
          min={1}
          max={64}
          value={n}
          aria-label="n"
          onChange={(e) => {
            const k = Number(e.target.value)
            setN(k)
            if (valid && BigInt(ms.trim()) > moveCount(k)) setMs(moveCount(k).toString())
          }}
        />
      </label>
      <div className="inrow">
        <label className="lbl" style={{ flex: '1 1 10em' }}>
          {tc(L('after move', 'setelah langkah'))} <input style={{ flex: '1 1 8em', minWidth: 0, width: 'auto' }} value={ms} aria-label="m" onChange={(e) => setMs(e.target.value)} />
        </label>
      </div>
      <div className="inrow">
        <button className="btn soft" onClick={() => setM(m - 1n)} disabled={!valid || m === 0n}>
          ◀
        </button>
        <button className="btn soft" onClick={() => setM(m + 1n)} disabled={!valid || m === total}>
          ▶
        </button>
        <button className="btn ghost" onClick={() => setM(0n)}>
          {tc(L('start', 'awal'))}
        </button>
        <button className="btn ghost" onClick={() => setM(1n << BigInt(n - 1))}>
          {tc(L('the middle move', 'langkah tengah'))}
        </button>
        <button className="btn ghost" onClick={() => setM(total)}>
          {tc(L('end', 'akhir'))}
        </button>
      </div>
      {valid ? (
        <>
          {n <= 8 && <Tower state={state} n={n} label={tc(L('The position after the chosen move', 'Posisi setelah langkah yang dipilih'))} />}
          <div className="wgtout" aria-live="polite">
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              {tc(L('Move', 'Langkah'))} {groupNumber(m, lang)} {tc(L('of', 'dari'))} {groupNumber(total, lang)}
              {moved !== null ? `: ${tc(L('disc', 'cakram'))} ${moved + 1}` : ''}
            </p>
            <p className="small" style={{ overflowWrap: 'anywhere' }}>
              A: {describePeg(pegs[0], tc)}
              <br />
              B: {describePeg(pegs[1], tc)}
              <br />
              C: {describePeg(pegs[2], tc)}
            </p>
            <p className="small" style={{ overflowWrap: 'anywhere', fontFamily: 'var(--mono)' }}>
              m = {m.toString(2)}₂ · {tc(L('Gray code', 'kode Gray'))} {gray.toString(2)}
            </p>
            <p className="small">
              {tc(L('The disc moved at move m is the number of trailing zeros of m, plus one: 1, 2, 1, 3, 1, 2, 1, 4, … The position is computed from n and m directly, without making the earlier moves.', 'Cakram yang dipindah pada langkah m adalah banyaknya nol di ujung kanan m, ditambah satu: 1, 2, 1, 3, 1, 2, 1, 4, … Posisinya dihitung langsung dari n dan m, tanpa melakukan langkah sebelumnya.'))}
            </p>
          </div>
        </>
      ) : (
        <p className="noline">{tc(L(`Type a whole number from 0 to 2^${n} − 1.`, `Ketik bilangan bulat dari 0 sampai 2^${n} − 1.`))}</p>
      )}
    </Frame>
  )
}

/* ------------------------------------------------------------------------------ the graph of positions */

export function HanoiGraphView() {
  const { tc, lang } = useI18n()
  const [n, setN] = useState(3)
  const [sel, setSel] = useState<number | null>(null)
  const g = useMemo(() => hanoiGraph(n), [n])
  const W = 340
  const Hh = (W * Math.sqrt(3)) / 2
  const px = (x: number): number => 10 + x * (W - 20)
  const py = (y: number): number => 10 + y * (W - 20)
  const pathSet = new Set<string>()
  g.path.forEach((v, i) => {
    if (i > 0) pathSet.add(`${Math.min(v, g.path[i - 1])},${Math.max(v, g.path[i - 1])}`)
  })
  const decode = (v: number): number[] => {
    const s: number[] = []
    for (let k = 0; k < n; k++) {
      s.push(v % 3)
      v = Math.floor(v / 3)
    }
    return s
  }
  const selState = sel === null ? null : decode(sel)
  const dist = selState ? [0, 1, 2].map((t) => solveFrom(selState, t).length) : null
  const pegs: number[][] = [[], [], []]
  if (selState) selState.forEach((p, k) => pegs[p].push(k))
  const r = n <= 3 ? 4 : n === 4 ? 3 : 2.2
  return (
    <Frame name="hanoigraph">
      <div className="chips">
        {[1, 2, 3, 4, 5].map((k) => (
          <button key={k} className={`chip ${n === k ? 'on' : ''}`} onClick={() => { setN(k); setSel(null) }} aria-pressed={n === k}>
            {k} {tc(L('discs', 'cakram'))} · {3 ** k} {tc(L('positions', 'posisi'))}
          </button>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${Hh + 20}`} role="img" aria-label={tc(L('The graph of all positions: a Sierpiński triangle', 'Graf semua posisi: segitiga Sierpiński'))} style={{ width: '100%', maxWidth: 480, display: 'block', margin: '8px auto' }}>
        {g.edges.map(([a, b], i) => (
          <line key={i} x1={px(g.points[a][0])} y1={py(g.points[a][1])} x2={px(g.points[b][0])} y2={py(g.points[b][1])} stroke={pathSet.has(`${a},${b}`) ? 'var(--bad)' : 'var(--muted)'} strokeWidth={pathSet.has(`${a},${b}`) ? 3 : 1} opacity={pathSet.has(`${a},${b}`) ? 1 : 0.6} />
        ))}
        {g.points.map((p, v) => (
          <circle key={v} cx={px(p[0])} cy={py(p[1])} r={sel === v ? r + 2.5 : r} fill={sel === v ? 'var(--gold)' : 'var(--brand)'} stroke="var(--surface)" strokeWidth={1} onClick={() => setSel(v)} style={{ cursor: 'pointer' }} />
        ))}
        <text x={px(0.5)} y={py(0) - 1} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--text)">
          A
        </text>
        <text x={px(0) - 2} y={py(0.866) + 12} textAnchor="start" fontSize={11} fontWeight={700} fill="var(--text)">
          B
        </text>
        <text x={px(1) + 2} y={py(0.866) + 12} textAnchor="end" fontSize={11} fontWeight={700} fill="var(--text)">
          C
        </text>
      </svg>
      <div className="wgtout" aria-live="polite">
        <p className="small">{tc(L(`Each dot is a position, each line a legal move. The red line is the best solution from "everything on A" (top corner) to "everything on C" (bottom right corner): ${2 ** n - 1} moves along the edge, and no other path is as short. Click a dot to see it.`, `Setiap titik adalah posisi, setiap garis langkah yang sah. Garis merah adalah solusi terbaik dari "semua di A" (sudut atas) ke "semua di C" (sudut kanan bawah): ${2 ** n - 1} langkah menyusuri tepi, dan tidak ada jalur lain sependek itu. Klik sebuah titik untuk melihatnya.`))}</p>
        {selState && dist && (
          <>
            <p className="okline" style={{ overflowWrap: 'anywhere' }}>
              A: {describePeg(pegs[0], tc)} · B: {describePeg(pegs[1], tc)} · C: {describePeg(pegs[2], tc)}
            </p>
            <p className="small">
              {tc(L('Fewest moves to put everything on A, B or C', 'Langkah paling sedikit untuk menaruh semuanya di A, B, atau C'))}: {dist.map((d) => groupNumber(d, lang)).join(', ')}
            </p>
          </>
        )}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------------------------------- more pegs */

export function HanoiPegs() {
  const { tc, lang } = useI18n()
  const [pegs, setPegs] = useState(4)
  const [n, setN] = useState(10)
  const f = frameStewart(n, pegs)
  const three = moveCount(n)
  const ratio = Number(three) / Number(f.moves)
  const ratioText = ratio >= 1e4 ? `10^${Math.floor(Math.log10(ratio))}` : ratio.toPrecision(3).replace(/\.0+$/, '')
  const rows = Array.from({ length: 16 }, (_, i) => i + 1)
  const big = (v: bigint): string => groupNumber(v, lang)
  return (
    <Frame name="hanoipegs">
      <div className="chips">
        {[3, 4, 5, 6].map((p) => (
          <button key={p} className={`chip ${pegs === p ? 'on' : ''}`} onClick={() => setPegs(p)} aria-pressed={pegs === p}>
            {p} {tc(L('pegs', 'tiang'))}
          </button>
        ))}
      </div>
      <label className="lbl slider">
        n = <b>{n}</b> {tc(L('discs', 'cakram'))}
        <input type="range" min={1} max={64} value={n} aria-label="n" onChange={(e) => setN(Number(e.target.value))} />
      </label>
      <div className="wgtout" aria-live="polite">
        <p className="okline" style={{ overflowWrap: 'anywhere' }}>
          {n} {tc(L('discs on', 'cakram pada'))} {pegs} {tc(L('pegs', 'tiang'))}: <b>{big(f.moves)}</b> {tc(L('moves', 'langkah'))}
          {pegs > 3 && n > 1 ? ` (${tc(L('first move the top', 'pertama pindahkan'))} ${f.split} ${tc(L('discs to a spare peg', 'cakram teratas ke tiang cadangan'))})` : ''}
        </p>
        <p className="small" style={{ overflowWrap: 'anywhere' }}>
          {tc(L('With three pegs it would take', 'Dengan tiga tiang memerlukan'))} {big(three)}
          {pegs > 3 ? `, ${tc(L('that is', 'yaitu'))} ${ratioText}× ${tc(L('as many', 'lebih banyak'))}` : ''}.
        </p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="rtable">
          <thead>
            <tr>
              <th>n</th>
              {[3, 4, 5, 6].map((p) => (
                <th key={p}>
                  {p} {tc(L('pegs', 'tiang'))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((k) => (
              <tr key={k} className={k === n ? 'hi' : ''}>
                <td>{k}</td>
                {[3, 4, 5, 6].map((p) => (
                  <td key={p} style={p === pegs ? { fontWeight: 700 } : undefined}>
                    {big(frameStewart(k, p).moves)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="wgtout" aria-live="polite">
        <p className="small">{tc(L('These are the Frame–Stewart numbers: the best known solutions, proved optimal for four pegs (Bousch, 2014) and conjectured optimal for more.', 'Ini adalah bilangan Frame–Stewart: solusi terbaik yang diketahui, terbukti optimal untuk empat tiang (Bousch, 2014) dan diduga optimal untuk lebih banyak.'))}</p>
      </div>
    </Frame>
  )
}
