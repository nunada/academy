import { useMemo, useState, type ReactElement } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import {
  CORNER_NAMES,
  CUBE_POSITIONS,
  EDGE_NAMES,
  FACES,
  POSITION_ROWS,
  SOLVED,
  algText,
  applyAlg,
  applyMove,
  cycles,
  facelets,
  flipEdge,
  grouped,
  invariants,
  invertAlg,
  isSolved,
  orderOf,
  parseAlg,
  positionCount,
  power,
  scramble,
  stateOf,
  swapCorners,
  swapEdges,
  twistCorner,
  yearsFor,
  type Cube,
  type Face,
  type Move,
  type PositionRow,
} from '../../lib/rubik'
import { Tex } from '../ui'
import { Frame, L } from './widgetKit'

/** The colors of the six faces. A real cube looks the same in the light and the dark theme, so these are not theme tokens. */
const COLOR: Record<string, string> = { U: '#f4f4ee', R: '#d4412b', F: '#2f9e55', D: '#f2c230', L: '#ef8a2c', B: '#2c6fc4' }
const TEXT_ON: Record<string, string> = { U: '#2b2b2b', R: '#fff', F: '#fff', D: '#2b2b2b', L: '#2b2b2b', B: '#fff' }

/** Where each face goes in the net: U above F, then L F R B across, D below F. Columns and rows of 3 squares. */
const NET_AT: Record<Face, [number, number]> = { U: [1, 0], L: [0, 1], F: [1, 1], R: [2, 1], B: [3, 1], D: [1, 2] }
const FACE_START: Record<Face, number> = { U: 0, R: 9, F: 18, D: 27, L: 36, B: 45 }

/** The 54 squares of a cube as a net, with the face letter on each center. */
function Net({ cube, label, max = 360 }: { cube: Cube; label: string; max?: number }) {
  const f = facelets(cube)
  const s = 20
  const faceW = 3 * s + 4
  const rects: ReactElement[] = []
  for (const face of FACES) {
    const [fx, fy] = NET_AT[face]
    for (let k = 0; k < 9; k++) {
      const r = Math.floor(k / 3)
      const c = k % 3
      const ch = f[FACE_START[face] + k]
      const x = fx * faceW + c * s + 2
      const y = fy * faceW + r * s + 2
      rects.push(
        <g key={face + k}>
          <rect x={x} y={y} width={s - 1.5} height={s - 1.5} rx={3} fill={COLOR[ch]} stroke="var(--text)" strokeOpacity={0.45} strokeWidth={0.8} />
          {k === 4 && (
            <text x={x + (s - 1.5) / 2} y={y + (s - 1.5) / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT_ON[ch]}>
              {face}
            </text>
          )}
        </g>,
      )
    }
  }
  const W = 4 * faceW
  const H = 3 * faceW
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', maxWidth: max, display: 'block', margin: '8px auto' }}>
      {rects}
    </svg>
  )
}

/** The squares in words, one line per face, for a screen reader: a letter is the face whose color is on that square. */
const faceWords = (cube: Cube): string => {
  const f = facelets(cube)
  return FACES.map((face) => `${face}: ${f.slice(FACE_START[face], FACE_START[face] + 9)}`).join('; ')
}

const freshSeed = () => Math.floor(Math.random() * 2 ** 31)

/* ------------------------------------------------------------------------------- play */

const TURN_LABEL: ['', "'", '2'] = ['', "'", '2']

export function RubikPlay() {
  const { tc } = useI18n()
  const [start, setStart] = useState<Cube>(SOLVED)
  const [scr, setScr] = useState<Move[]>([])
  const [moves, setMoves] = useState<Move[]>([])
  const cube = useMemo(() => applyAlg(start, moves), [start, moves])
  const solved = isSolved(cube)
  // the way back from here: the scramble and every move since, undone from the last
  const back = invertAlg([...scr, ...moves])
  const turn = (face: Face, kind: 0 | 1 | 2) => setMoves((m) => [...m, { face, turns: kind === 0 ? 1 : kind === 1 ? 3 : 2 }])
  const doScramble = () => {
    const sc = scramble(freshSeed(), 25)
    setScr(sc)
    setStart(applyAlg(SOLVED, sc))
    setMoves([])
  }
  const reset = () => {
    setScr([])
    setStart(SOLVED)
    setMoves([])
  }
  return (
    <Frame name="rbplay">
      <Net cube={cube} label={tc(L('The cube as a net of 54 colored squares', 'Kubus sebagai jaring dari 54 persegi berwarna'))} />
      <div className="sr-only" role="status" aria-live="polite">
        {solved ? tc(L('The cube is solved.', 'Kubus sudah terpecahkan.')) : tc(L('The cube is not solved.', 'Kubus belum terpecahkan.'))} {faceWords(cube)}
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {FACES.map((f) => (
          <span key={f} style={{ display: 'inline-flex', gap: 4 }}>
            {([0, 1, 2] as const).map((k) => (
              <button key={k} className="chip ghost" style={{ minWidth: 40 }} onClick={() => turn(f, k)} aria-label={`${tc(L('Turn', 'Putar'))} ${f}${TURN_LABEL[k]}`}>
                {f}
                {TURN_LABEL[k]}
              </button>
            ))}
          </span>
        ))}
      </div>
      <div className="chips" style={{ justifyContent: 'center' }}>
        <button className="btn sm" onClick={doScramble}>
          {tc(L('Scramble', 'Acak'))}
        </button>
        <button className="btn ghost sm" onClick={reset}>
          {tc(L('Reset', 'Reset'))}
        </button>
        <button className="btn ghost sm" onClick={() => setMoves((m) => m.slice(0, -1))} disabled={moves.length === 0}>
          {tc(L('Undo', 'Urungkan'))}
        </button>
        <button className="btn ghost sm" onClick={() => setMoves((m) => [...m, ...back])} disabled={solved}
          title={tc(L('Apply the way back: the same moves backwards, each undone', 'Terapkan jalan kembali: gerakan yang sama mundur, masing-masing dibalik'))}
        >
          {tc(L('Apply the way back', 'Terapkan jalan kembali'))}
        </button>
      </div>
      <div className="wgtout">
        <p className={solved ? 'okline' : 'small muted'}>
          {solved ? tc(L('Solved.', 'Terpecahkan.')) : tc(L('Not solved.', 'Belum terpecahkan.'))} {tc(L('Moves since the start:', 'Gerakan sejak awal:'))} {moves.length}
          {scr.length ? ` · ${tc(L('scramble', 'acakan'))}: ${algText(scr)}` : ''}
        </p>
        {moves.length > 0 && (
          <p className="small" style={{ overflowWrap: 'anywhere' }}>
            {tc(L('Your moves:', 'Gerakanmu:'))} <b>{algText(moves)}</b>
          </p>
        )}
        {!solved && (scr.length > 0 || moves.length > 0) && (
          <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
            {tc(L('A way back (every move undone, last first):', 'Jalan kembali (setiap gerakan dibalik, yang terakhir dulu):'))} {algText(back)}
          </p>
        )}
      </div>
    </Frame>
  )
}

/* ----------------------------------------------------------------------- the count */

const ROW_TEXT: Record<PositionRow['id'], { text: Loc; tex: string }> = {
  cornerPerm: { text: L('the 8 corner pieces can be arranged in 8! ways', '8 keping sudut dapat disusun dalam 8! cara'), tex: '\\times 8!' },
  cornerTwist: { text: L('each corner piece can sit in 3 twists', 'setiap keping sudut dapat berada dalam 3 putaran'), tex: '\\times 3^8' },
  cornerLast: { text: L('but the twists always add up to a multiple of 3, so the last corner has no choice', 'tetapi putaran selalu berjumlah kelipatan 3, sehingga sudut terakhir tidak punya pilihan'), tex: '\\div 3' },
  edgePerm: { text: L('the 12 edge pieces can be arranged in 12! ways', '12 keping rusuk dapat disusun dalam 12! cara'), tex: '\\times 12!' },
  edgeFlip: { text: L('each edge piece can be flipped or not', 'setiap keping rusuk dapat dibalik atau tidak'), tex: '\\times 2^{12}' },
  edgeLast: { text: L('but the flips always add up to an even number, so the last edge has no choice', 'tetapi pembalikan selalu berjumlah genap, sehingga rusuk terakhir tidak punya pilihan'), tex: '\\div 2' },
  parity: { text: L('and the corners and the edges are always shuffled by permutations of the same parity: half of the arrangements are out of reach', 'dan sudut serta rusuk selalu diacak oleh permutasi yang paritasnya sama: separuh susunan tak terjangkau'), tex: '\\div 2' },
}

/** 4.3 × 10^19 from the digits of a number. */
function scientific(n: bigint, sep: string): string {
  const s = n.toString()
  if (s.length < 4) return s
  const lead = `${s[0]}${sep}${s.slice(1, 3)}`
  return `${lead} × 10^${s.length - 1}`
}

export function RubikCount() {
  const { tc, lang } = useI18n()
  const sep = lang === 'id' ? '.' : ','
  const dsep = lang === 'id' ? ',' : '.'
  const all = POSITION_ROWS.map((r) => r.id)
  const [on, setOn] = useState<Set<PositionRow['id']>>(new Set(all))
  const toggle = (id: PositionRow['id']) => {
    const next = new Set(on)
    if (next.has(id)) {
      next.delete(id)
      // a row that depends on this one goes with it
      for (const r of POSITION_ROWS) if (r.needs.includes(id)) next.delete(r.id)
    } else next.add(id)
    setOn(next)
  }
  const count = positionCount(on)
  const ratio = count > 0n ? count / CUBE_POSITIONS : 0n
  const exact = count % CUBE_POSITIONS === 0n
  const years = yearsFor(count, 1)
  const scaled = (x: number, unit: Loc): string => `${x < 10 ? x.toFixed(2).replace('.', dsep) : x < 100 ? x.toFixed(1).replace('.', dsep) : Math.round(x).toString()} ${tc(unit)}`
  const yearsText =
    years >= 1e12 ? scaled(years / 1e12, L('trillion', 'triliun')) : years >= 1e9 ? scaled(years / 1e9, L('billion', 'miliar')) : years >= 1e6 ? scaled(years / 1e6, L('million', 'juta')) : years >= 1 ? Math.round(years).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US') : '< 1'
  const presets: { name: Loc; rows: PositionRow['id'][] }[] = [
    { name: L('the real cube', 'kubus yang sebenarnya'), rows: all },
    { name: L('take it apart and rebuild it', 'bongkar dan rakit ulang'), rows: ['cornerPerm', 'cornerTwist', 'edgePerm', 'edgeFlip'] },
    { name: L('only the corners', 'hanya sudut'), rows: ['cornerPerm', 'cornerTwist', 'cornerLast'] },
    { name: L('only the edges', 'hanya rusuk'), rows: ['edgePerm', 'edgeFlip', 'edgeLast'] },
  ]
  return (
    <Frame name="rbcount">
      <div className="chips">
        {presets.map((p, i) => {
          const set = new Set(p.rows)
          const isOn = set.size === on.size && p.rows.every((r) => on.has(r))
          return (
            <button key={i} className={`chip ghost ${isOn ? 'on' : ''}`} aria-pressed={isOn} onClick={() => setOn(set)}>
              {tc(p.name)}
            </button>
          )
        })}
      </div>
      <ul className="clean" style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
        {POSITION_ROWS.map((r) => {
          const enabled = r.needs.every((n) => on.has(n))
          const t = ROW_TEXT[r.id]
          return (
            <li key={r.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '4px 0', opacity: enabled ? 1 : 0.5 }}>
              <input type="checkbox" id={`rbc-${r.id}`} checked={on.has(r.id)} disabled={!enabled} onChange={() => toggle(r.id)} style={{ marginTop: 5 }} />
              <label htmlFor={`rbc-${r.id}`} style={{ flex: 1 }}>
                {tc(t.text)} <Tex src={t.tex} />
              </label>
            </li>
          )
        })}
      </ul>
      <div className="wgtout" aria-live="polite">
        <p style={{ overflowWrap: 'anywhere', fontSize: '1.05rem' }}>
          <b>{grouped(count, sep)}</b> <span className="muted">≈ {scientific(count, dsep)}</span>
        </p>
        <p className="small" style={{ overflowWrap: 'anywhere' }}>
          {count === CUBE_POSITIONS
            ? tc(L('This is the number of positions of the real cube.', 'Ini banyaknya posisi kubus yang sebenarnya.'))
            : exact && ratio > 0n
              ? tc(L(`This is ${ratio.toString()} times the number of positions of the real cube.`, `Ini ${ratio.toString()} kali banyaknya posisi kubus yang sebenarnya.`))
              : tc(L('This is not the number of positions of the real cube.', 'Ini bukan banyaknya posisi kubus yang sebenarnya.'))}
        </p>
        <p className="small muted" style={{ overflowWrap: 'anywhere' }}>
          {tc(L('Looking at one position a second, it would take', 'Memandang satu posisi per detik, diperlukan'))} {yearsText} {tc(L('years.', 'tahun.'))}
        </p>
      </div>
    </Frame>
  )
}

/* ---------------------------------------------------------------------- the order */

const ORDER_PRESETS: { name: string; alg: string }[] = [
  { name: 'R U', alg: 'R U' },
  { name: "R U R' U'", alg: "R U R' U'" },
  { name: 'F2', alg: 'F2' },
  { name: 'R L', alg: 'R L' },
  { name: "R U2 D' B D'", alg: "R U2 D' B D'" },
  { name: 'Sune', alg: "R U R' U R U2 R'" },
  { name: 'T-perm', alg: "R U R' U' R' F R2 U' R' U' R U R' F'" },
]

export function RubikOrder() {
  const { tc } = useI18n()
  const [src, setSrc] = useState('R U')
  const [k, setK] = useState(1)
  const parsed = parseAlg(src)
  const info = useMemo(() => {
    if (!parsed.ok) return null
    const st = stateOf(parsed.moves)
    const cy = cycles(st)
    return { st, order: orderOf(st), corners: cy.corners.filter((c) => c.length > 1 || c.twist !== 0), edges: cy.edges.filter((c) => c.length > 1 || c.twist !== 0) }
  }, [src]) // eslint-disable-line react-hooks/exhaustive-deps
  const order = info?.order ?? 1
  const kk = Math.min(Math.max(0, k), order)
  const shown = info ? power(info.st, kk) : SOLVED
  const orders = info ? [...info.corners, ...info.edges].map((c) => c.order) : []
  const distinct = [...new Set(orders)].sort((a, b) => a - b)
  const names = (places: number[], list: string[]) => places.map((p) => list[p]).join(' → ')
  return (
    <Frame name="rborder">
      <div className="chips">
        {ORDER_PRESETS.map((p) => (
          <button
            key={p.alg}
            className={`chip ghost ${src === p.alg ? 'on' : ''}`}
            aria-pressed={src === p.alg}
            onClick={() => {
              setSrc(p.alg)
              setK(1)
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
      <label className="lbl" style={{ display: 'block' }}>
        {tc(L('Moves', 'Gerakan'))}{' '}
        <input
          style={{ width: '100%', maxWidth: 420 }}
          value={src}
          onChange={(e) => {
            setSrc(e.target.value)
            setK(1)
          }}
          aria-label={tc(L('A sequence of moves, such as R U R\' U\'', 'Urutan gerakan, seperti R U R\' U\''))}
          spellCheck={false}
          autoCapitalize="characters"
        />
      </label>
      {!parsed.ok || !info ? (
        <p className="badline">
          {parsed.ok
            ? ''
            : tc(L(`“${parsed.text}” is not a move. Use U, D, L, R, F, B, with ' for the inverse and 2 for a half turn, up to 200 moves.`, `“${parsed.text}” bukan gerakan. Pakai U, D, L, R, F, B, dengan ' untuk kebalikan dan 2 untuk setengah putaran, sampai 200 gerakan.`))}
        </p>
      ) : (
        <>
          <Net cube={shown} max={300} label={tc(L('The cube after the sequence has been repeated', 'Kubus setelah urutan diulang'))} />
          <div className="inrow" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            <button className="btn ghost sm" onClick={() => setK(Math.max(0, kk - 1))} disabled={kk === 0} aria-label={tc(L('One repeat fewer', 'Kurangi satu pengulangan'))}>
              −
            </button>
            <input type="range" min={0} max={order} value={kk} onChange={(e) => setK(Number(e.target.value))} aria-label={tc(L('Number of repeats', 'Banyak pengulangan'))} style={{ flex: '1 1 160px', maxWidth: 320 }} />
            <button className="btn ghost sm" onClick={() => setK(Math.min(order, kk + 1))} disabled={kk === order} aria-label={tc(L('One repeat more', 'Tambah satu pengulangan'))}>
              +
            </button>
          </div>
          <div className="wgtout" aria-live="polite">
            <p className={kk === order && order > 0 ? 'okline' : 'small'}>
              {tc(L('Repeated', 'Diulang'))} {kk} {kk === 1 ? tc(L('time', 'kali')) : tc(L('times', 'kali'))}
              {kk === order ? ` — ${tc(L('back to the solved cube', 'kembali ke kubus yang terpecahkan'))}` : kk === 0 ? ` — ${tc(L('the solved cube', 'kubus yang terpecahkan'))}` : ''}
            </p>
            <p style={{ overflowWrap: 'anywhere' }}>
              <b>{tc(L('Order', 'Orde'))}</b> = {order}
              {distinct.length > 1 && (
                <>
                  {' '}
                  = <Tex src={`\\operatorname{lcm}(${distinct.join(', ')})`} />
                </>
              )}
            </p>
            {order === 1 ? (
              <p className="small muted">{tc(L('The sequence changes nothing, so it already counts as repeated enough: its order is 1.', 'Urutan ini tidak mengubah apa pun, sehingga ordenya 1.'))}</p>
            ) : (
              <>
                <p className="small muted">
                  {tc(L('Each cycle of pieces needs its own number of repeats to come round: its length, and three times as many (corners) or twice as many (edges) when the pieces come back twisted. The order is the least common multiple.', 'Setiap siklus keping memerlukan banyak pengulangannya sendiri untuk kembali: panjangnya, dan tiga kali (sudut) atau dua kali (rusuk) bila kepingnya kembali terputar. Ordenya adalah kelipatan persekutuan terkecil.'))}
                </p>
                <ul className="small" style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                  {info.corners.map((c, i) => (
                    <li key={'c' + i} style={{ overflowWrap: 'anywhere' }}>
                      {tc(L('corners', 'sudut'))} {names(c.places, CORNER_NAMES)}: {tc(L('length', 'panjang'))} {c.length}
                      {c.twist ? `, ${tc(L('twisted', 'terputar'))}` : ''} → {c.order}
                    </li>
                  ))}
                  {info.edges.map((c, i) => (
                    <li key={'e' + i} style={{ overflowWrap: 'anywhere' }}>
                      {tc(L('edges', 'rusuk'))} {names(c.places, EDGE_NAMES)}: {tc(L('length', 'panjang'))} {c.length}
                      {c.twist ? `, ${tc(L('flipped', 'terbalik'))}` : ''} → {c.order}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}
    </Frame>
  )
}

/* ---------------------------------------------------------------------- what can be reached */

export function RubikParity() {
  const { tc } = useI18n()
  const [cube, setCube] = useState<Cube>(SOLVED)
  const [tw, setTw] = useState(0)
  const [fl, setFl] = useState(0)
  const [ca, setCa] = useState(0)
  const [cb, setCb] = useState(1)
  const [ea, setEa] = useState(0)
  const [eb, setEb] = useState(1)
  const v = invariants(cube)
  const select = (value: number, set: (n: number) => void, names: string[], label: string) => (
    <select value={value} onChange={(e) => set(Number(e.target.value))} aria-label={label}>
      {names.map((n, i) => (
        <option key={n} value={i}>
          {n}
        </option>
      ))}
    </select>
  )
  const mark = (okay: boolean) => (okay ? '✓' : '✗')
  const turn = (f: Face) => setCube((c) => applyMove(c, { face: f, turns: 1 }))
  return (
    <Frame name="rbparity">
      <Net cube={cube} max={300} label={tc(L('The cube as a net of 54 colored squares', 'Kubus sebagai jaring dari 54 persegi berwarna'))} />
      <p className="small muted" style={{ marginBottom: 4 }}>
        {tc(L('Turn a face, as you can on a real cube:', 'Putar sebuah sisi, seperti pada kubus sungguhan:'))}
      </p>
      <div className="chips">
        {FACES.map((f) => (
          <button key={f} className="chip ghost" onClick={() => turn(f)}>
            {f}
          </button>
        ))}
      </div>
      <p className="small muted" style={{ marginBottom: 4 }}>
        {tc(L('Or take the cube apart and put it back wrongly:', 'Atau bongkar kubus dan pasang kembali secara keliru:'))}
      </p>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <button className="chip ghost" onClick={() => setCube((c) => twistCorner(c, tw))}>
          {tc(L('twist corner', 'putar sudut'))}
        </button>
        {select(tw, setTw, CORNER_NAMES, tc(L('Corner place', 'Tempat sudut')))}
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <button className="chip ghost" onClick={() => setCube((c) => flipEdge(c, fl))}>
          {tc(L('flip edge', 'balik rusuk'))}
        </button>
        {select(fl, setFl, EDGE_NAMES, tc(L('Edge place', 'Tempat rusuk')))}
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <button className="chip ghost" onClick={() => ca !== cb && setCube((c) => swapCorners(c, ca, cb))} disabled={ca === cb}>
          {tc(L('swap corners', 'tukar sudut'))}
        </button>
        {select(ca, setCa, CORNER_NAMES, tc(L('First corner place', 'Tempat sudut pertama')))} {select(cb, setCb, CORNER_NAMES, tc(L('Second corner place', 'Tempat sudut kedua')))}
      </div>
      <div className="inrow" style={{ flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <button className="chip ghost" onClick={() => ea !== eb && setCube((c) => swapEdges(c, ea, eb))} disabled={ea === eb}>
          {tc(L('swap edges', 'tukar rusuk'))}
        </button>
        {select(ea, setEa, EDGE_NAMES, tc(L('First edge place', 'Tempat rusuk pertama')))} {select(eb, setEb, EDGE_NAMES, tc(L('Second edge place', 'Tempat rusuk kedua')))}
      </div>
      <div className="chips">
        <button className="btn ghost sm" onClick={() => setCube(SOLVED)}>
          {tc(L('Reset', 'Reset'))}
        </button>
      </div>
      <div className="wgtout" aria-live="polite">
        <ul className="small" style={{ listStyle: 'none', padding: 0, margin: '4px 0' }}>
          <li className={v.twistOk ? 'okline' : 'badline'}>
            {mark(v.twistOk)} {tc(L('corner twists add up to', 'putaran sudut berjumlah'))} {v.twist} {tc(L('(mod 3); it must be 0', '(mod 3); harus 0'))}
          </li>
          <li className={v.flipOk ? 'okline' : 'badline'}>
            {mark(v.flipOk)} {tc(L('edge flips add up to', 'pembalikan rusuk berjumlah'))} {v.flip} {tc(L('(mod 2); it must be 0', '(mod 2); harus 0'))}
          </li>
          <li className={v.parityOk ? 'okline' : 'badline'}>
            {mark(v.parityOk)} {tc(L('the corners are shuffled by an', 'sudut diacak oleh permutasi'))} {v.cornerParity ? tc(L('odd', 'ganjil')) : tc(L('even', 'genap'))} {tc(L('permutation, the edges by an', ', rusuk oleh permutasi'))} {v.edgeParity ? tc(L('odd', 'ganjil')) : tc(L('even', 'genap'))}{' '}
            {tc(L('one; they must match', '; keduanya harus sama'))}
          </li>
        </ul>
        <p className={v.reachable ? 'okline' : 'badline'}>
          {v.reachable
            ? isSolved(cube)
              ? tc(L('Solved. Turning the faces keeps all three conditions true.', 'Terpecahkan. Memutar sisi menjaga ketiga syarat tetap benar.'))
              : tc(L('Some sequence of turns solves this position.', 'Ada urutan putaran yang memecahkan posisi ini.'))
            : tc(L('No sequence of turns can solve this position: it can only be reached by taking the cube apart.', 'Tak ada urutan putaran yang dapat memecahkan posisi ini: ia hanya dapat dicapai dengan membongkar kubus.'))}
        </p>
      </div>
    </Frame>
  )
}

