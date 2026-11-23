import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useI18n } from '../../i18n'
import { ALL_PUZZLES, PUZZLE_IDS, TIER_LIST, type HsLevel, type HsTier } from '../../content/hashi'
import { analyze, canBuild, deduce, degrees, emptyBridges, nextCount, parseProgress, parsePuzzle, type ConflictKind, type Progress } from '../../lib/hashi'

/* ------------------------------------------------------------------------------------------------ progress */

const PROGRESS_KEY = 'nunada.hashi.v1'
const readProgress = (): Progress => {
  try {
    return parseProgress(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? 'null'), PUZZLE_IDS)
  } catch {
    return {}
  }
}
const writeProgress = (p: Progress) => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(Object.keys(p)))
  } catch {
    /* a private window: the game works the same without saved progress */
  }
}

type T = (en: string, id: string) => string

/* ------------------------------------------------------------------------------------------------ words */

const CONFLICT_TEXT: Record<ConflictKind, [string, string]> = {
  'too-many': ['An island has more bridges than its number.', 'Sebuah pulau punya lebih banyak jembatan daripada angkanya.'],
  cross: ['Two bridges cross each other.', 'Dua jembatan saling bersilang.'],
  split: ['A group of islands is complete but cut off from the rest: every island has to be joined.', 'Sekelompok pulau sudah lengkap tetapi terpisah dari yang lain: semua pulau harus tersambung.'],
}
/** shown while playing, without pressing Check */
const LIVE: ConflictKind[] = ['too-many', 'cross', 'split']
const ORDER: ConflictKind[] = ['cross', 'too-many', 'split']

const DIRS: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }

/** the size of a cell in the drawing, in its own units (the drawing is scaled to the page) */
const U = 40
const R = 15

/* ------------------------------------------------------------------------------------------------ one puzzle */

function Board({ data, tier, index, hasNext, onExit, onNext, onSolved }: { data: HsLevel; tier: HsTier; index: number; hasNext: boolean; onExit: () => void; onNext: () => void; onSolved: () => void }) {
  const { lang, tc } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const puzzle = useMemo(() => parsePuzzle(data.id, data.rows, data.links), [data])
  const { w, h, islands, edges } = puzzle
  const bridges = useRef<number[]>(emptyBridges(puzzle))
  const history = useRef<number[][]>([])
  const [, setVersion] = useState(0)
  const bump = () => setVersion((v) => v + 1)
  const [cur, setCur] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [flash, setFlash] = useState<number | null>(null)
  const [note, setNote] = useState<{ n: number; text: string; info: boolean } | null>(null)
  const wrapRef = useRef<SVGSVGElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const said = useRef(0)
  const reported = useRef(false)

  const analysis = analyze(puzzle, bridges.current)
  const won = analysis.solved
  const deg = degrees(puzzle, bridges.current)

  const say = (text: string, info = false) => {
    said.current += 1
    setNote({ n: said.current, text, info })
  }
  useEffect(() => {
    if (!note) return
    const n = note.n
    const id = window.setTimeout(() => setNote((x) => (x && x.n === n ? null : x)), 5000)
    return () => window.clearTimeout(id)
  }, [note])
  useEffect(() => {
    if (flash === null) return
    const id = window.setTimeout(() => setFlash(null), 3500)
    return () => window.clearTimeout(id)
  }, [flash])
  useEffect(() => {
    wrapRef.current?.focus({ preventScroll: true })
  }, [data.id])
  useEffect(() => {
    if (won && !reported.current) {
      reported.current = true
      onSolved()
    }
    if (won) resultRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  })

  const settle = () => {
    setChecked(false)
    setFlash(null)
    setNote(null)
    bump()
  }
  const cycle = (e: number) => {
    if (won) return
    const before = bridges.current[e]
    if (before === 0 && !canBuild(puzzle, bridges.current, e)) {
      say(t('A bridge cannot cross another bridge.', 'Jembatan tidak boleh bersilang dengan jembatan lain.'))
      return
    }
    history.current.push(bridges.current.slice())
    bridges.current = bridges.current.map((v, i) => (i === e ? nextCount(v) : v))
    settle()
  }
  const tapIsland = (i: number) => {
    setCur(i)
    if (won) return
    if (picked === null || picked === i) {
      setPicked(picked === i ? null : i)
      return
    }
    const e = edges.findIndex((f) => (f.a === picked && f.b === i) || (f.a === i && f.b === picked))
    if (e >= 0) {
      cycle(e)
      setPicked(null)
    } else {
      setPicked(i)
      say(t('These two islands do not see each other along a row or a column.', 'Dua pulau ini tidak saling melihat sepanjang baris atau kolom.'))
    }
  }
  const down = (ev: ReactPointerEvent<SVGSVGElement>) => {
    const target = ev.target as Element
    const hit = target.closest('[data-e]')
    if (hit) {
      ev.preventDefault()
      cycle(Number(hit.getAttribute('data-e')))
      return
    }
    const isl = target.closest('[data-i]')
    if (isl) {
      ev.preventDefault()
      tapIsland(Number(isl.getAttribute('data-i')))
    }
  }

  const doUndo = () => {
    const last = history.current.pop()
    if (!last) return
    bridges.current = last
    reported.current = false
    settle()
  }
  const doReset = () => {
    if (bridges.current.some((v) => v > 0)) history.current.push(bridges.current.slice())
    bridges.current = emptyBridges(puzzle)
    reported.current = false
    setPicked(null)
    settle()
    wrapRef.current?.focus({ preventScroll: true })
  }
  const doCheck = () => {
    if (won) return
    setChecked(true)
    const a = analyze(puzzle, bridges.current)
    const first = ORDER.find((k) => a.conflicts.some((c) => c.kind === k))
    if (first) say(t(...CONFLICT_TEXT[first]))
    else {
      const open = deg.filter((d, i) => d < islands[i].n).length
      say(t(`Nothing is wrong so far. ${open} ${open === 1 ? 'island still needs' : 'islands still need'} bridges.`, `Sejauh ini tidak ada yang salah. ${open} pulau masih butuh jembatan.`), true)
    }
  }
  const showEdge = (e: number, text: string) => {
    setFlash(e)
    setCur(edges[e].a)
    say(text, true)
  }
  const doHint = () => {
    if (won) return
    const b = bridges.current
    // a bridge that is not right: more bridges than the answer has there
    for (let e = 0; e < b.length; e++)
      if (b[e] > puzzle.solution[e]) {
        showEdge(e, t('This bridge is not right.', 'Jembatan ini belum benar.'))
        return
      }
    // a bridge that the rules decide
    const d = deduce(puzzle, b)
    if (d.ok && d.forced.length > 0) {
      showEdge(d.forced[0].e, t('The rules decide this bridge. Look at the numbers around it.', 'Aturan menentukan jembatan ini. Lihat angka-angka di sekitarnya.'))
      return
    }
    const open = b.findIndex((v, e) => v < puzzle.solution[e])
    if (open >= 0) showEdge(open, t('Try a bridge here.', 'Coba jembatan di sini.'))
  }

  /** the island nearest to `from` in a direction (the others in that direction that are far to the side count for less) */
  const neighborIsland = (from: number, dx: number, dy: number): number | null => {
    const a = islands[from]
    let best: number | null = null
    let bestScore = Infinity
    islands.forEach((o, j) => {
      if (j === from) return
      const along = (o.x - a.x) * dx + (o.y - a.y) * dy
      const side = Math.abs((o.x - a.x) * dy) + Math.abs((o.y - a.y) * dx)
      if (along <= 0) return
      const score = along + 2.5 * side
      if (score < bestScore) (bestScore = score), (best = j)
    })
    return best
  }
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const dir = DIRS[e.key]
    if (dir) {
      e.preventDefault()
      if (e.shiftKey) {
        // a bridge from this island toward that direction
        const a = islands[cur]
        const k = puzzle.incident[cur].find((f) => {
          const o = islands[edges[f].a === cur ? edges[f].b : edges[f].a]
          return Math.sign(o.x - a.x) === dir[0] && Math.sign(o.y - a.y) === dir[1]
        })
        if (k !== undefined) cycle(k)
        else say(t('No island in that direction sees this one.', 'Tidak ada pulau di arah itu yang terlihat dari sini.'))
        return
      }
      const j = neighborIsland(cur, dir[0], dir[1])
      if (j !== null) setCur(j)
      return
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      tapIsland(cur)
    } else if (e.key === 'Escape') setPicked(null)
    else if (e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') {
      e.preventDefault()
      doUndo()
    } else if (e.key === 'r' || e.key === 'R') doReset()
    else if (e.key === 'h' || e.key === 'H') doHint()
  }

  // what is wrong: always the mistakes that no later move can undo by itself, and everything after Check
  const badIslands = new Set<number>()
  const badEdges = new Set<number>()
  for (const c of analysis.conflicts)
    if (checked || LIVE.includes(c.kind)) for (const x of c.items) (c.kind === 'cross' ? badEdges : badIslands).add(x)

  const done = deg.filter((d, i) => d === islands[i].n).length
  const here = islands[cur]
  const announcement = `${t('Island', 'Pulau')} ${t('row', 'baris')} ${here.y + 1}, ${t('column', 'kolom')} ${here.x + 1}: ${t('number', 'angka')} ${here.n}, ${t('bridges', 'jembatan')} ${deg[cur]}.`
  const cx = (x: number) => x * U + U / 2

  return (
    <div className="hsplay">
      <div className="dmbar">
        <button type="button" className="btn ghost sm" onClick={onExit}>
          {t('All puzzles', 'Semua teka-teki')}
        </button>
        <span className="pill brand">
          {tc(tier.name)} · {index + 1}
        </span>
      </div>

      {won && (
        <div className="dmresult win" ref={resultRef}>
          <span className="dmconfetti" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ left: `${4 + i * 7}%`, animationDelay: `${(i % 5) * 0.18}s` }} />
            ))}
          </span>
          <h3>🎉 {t('Solved!', 'Selesai!')}</h3>
          <div className="chips">
            {hasNext ? (
              <button type="button" className="btn" onClick={onNext}>
                {t('Next puzzle', 'Teka-teki berikutnya')}
              </button>
            ) : null}
            <button type="button" className={hasNext ? 'btn ghost' : 'btn'} onClick={doReset}>
              {t('Play it again', 'Main lagi')}
            </button>
            <button type="button" className="btn ghost" onClick={onExit}>
              {t('All puzzles', 'Semua teka-teki')}
            </button>
          </div>
        </div>
      )}

      <p className="hsgoal small muted">
        {t('Join the islands with bridges so that every island has as many bridges as its number, bridges do not cross, and all the islands are one network.', 'Sambungkan pulau dengan jembatan sehingga tiap pulau punya jembatan sebanyak angkanya, jembatan tidak bersilang, dan semua pulau menjadi satu jaringan.')}
      </p>

      <div className="hsboardbox">
        <svg
          className="hsboard"
          ref={wrapRef}
          viewBox={`0 0 ${w * U} ${h * U}`}
          style={{ maxWidth: `${w * 56}px` }}
          tabIndex={0}
          role="application"
          aria-label={t(
            `The map, ${w} columns by ${h} rows, ${islands.length} islands. Arrow keys move to the next island, Space picks an island, and a second Space on another island in line with it builds a bridge. Shift and an arrow builds a bridge in that direction. Z undoes, H gives a hint.`,
            `Peta, ${w} kolom kali ${h} baris, ${islands.length} pulau. Tombol panah berpindah ke pulau berikutnya, Spasi memilih sebuah pulau, dan Spasi kedua di pulau lain yang sebaris membangun jembatan. Shift dan panah membangun jembatan ke arah itu. Z membatalkan, H memberi petunjuk.`,
          )}
          onKeyDown={onKey}
          onPointerDown={down}
        >
          {/* the grid, as dots */}
          {Array.from({ length: w * h }, (_, i) => (
            <circle key={i} className="hsdot" cx={cx(i % w)} cy={cx(Math.floor(i / w))} r={1.6} />
          ))}
          {/* the places where a bridge can go: wide, invisible, pressable */}
          {edges.map((e, k) => {
            if (e.cells.length === 0) return null
            const a = islands[e.a]
            const b = islands[e.b]
            const blocked = bridges.current[k] === 0 && !canBuild(puzzle, bridges.current, k)
            const x1 = cx(a.x) + (e.horizontal ? R : -13)
            const y1 = cx(a.y) + (e.horizontal ? -13 : R)
            const x2 = cx(b.x) + (e.horizontal ? -R : 13)
            const y2 = cx(b.y) + (e.horizontal ? 13 : -R)
            return <rect key={`h${k}`} data-e={k} className={`hshit${blocked ? ' blocked' : ''}${flash === k ? ' flash' : ''}`} x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx={6} />
          })}
          {/* the bridges */}
          {edges.map((e, k) => {
            const n = bridges.current[k]
            if (n === 0) return null
            const a = islands[e.a]
            const b = islands[e.b]
            const offs = n === 1 ? [0] : [-4, 4]
            return offs.map((o) => (
              <line
                key={`b${k}${o}`}
                className={`hsbridge${badEdges.has(k) ? ' bad' : ''}`}
                x1={cx(a.x) + (e.horizontal ? R : o)}
                y1={cx(a.y) + (e.horizontal ? o : R)}
                x2={cx(b.x) - (e.horizontal ? R : -o)}
                y2={cx(b.y) - (e.horizontal ? -o : R)}
              />
            ))
          })}
          {/* the islands */}
          {islands.map((is, i) => (
            <g key={`i${i}`} data-i={i} className={`hsi${deg[i] === is.n ? ' full' : ''}${badIslands.has(i) ? ' bad' : ''}${i === cur ? ' cur' : ''}${picked === i ? ' picked' : ''}`}>
              <circle cx={cx(is.x)} cy={cx(is.y)} r={R} />
              <text x={cx(is.x)} y={cx(is.y) + 7} textAnchor="middle">
                {is.n}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement} {note?.text ?? ''}
      </p>
      <p className={`hsnote${note ? ` on${note.info ? ' info' : ''}` : ''}`} aria-hidden="true">
        {note?.text ?? ' '}
      </p>

      <div className="hscontrols">
        <span className="small muted">{t(`Islands complete: ${done}/${islands.length}`, `Pulau lengkap: ${done}/${islands.length}`)}</span>
        <div className="chips">
          <button type="button" className="btn soft sm" onClick={doUndo} disabled={history.current.length === 0}>
            {t('Undo', 'Undo')} <span className="small muted">Z</span>
          </button>
          <button type="button" className="btn soft sm" onClick={doReset}>
            {t('Restart', 'Ulang')} <span className="small muted">R</span>
          </button>
          <button type="button" className="btn soft sm" onClick={doCheck} disabled={won}>
            {t('Check', 'Periksa')}
          </button>
          <button type="button" className="btn soft sm" onClick={doHint} disabled={won}>
            {t('Hint', 'Petunjuk')} <span className="small muted">H</span>
          </button>
        </div>
      </div>
      <p className="small muted hshelp">{t('Press the space between two islands to build a bridge: once for a single bridge, twice for a double one, a third time to remove it. Or press one island and then the other.', 'Tekan ruang di antara dua pulau untuk membangun jembatan: sekali untuk jembatan tunggal, dua kali untuk jembatan ganda, tiga kali untuk menghapusnya. Atau tekan sebuah pulau lalu pulau yang lain.')}</p>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------ the game */

export default function HashiGame() {
  const { tc, lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const [progress, setProgress] = useState<Progress>(readProgress)
  const [stage, setStage] = useState<{ k: 'menu' } | { k: 'play'; tier: number; index: number }>({ k: 'menu' })
  const topRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (stage.k === 'play') topRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [stage])

  const solvedCount = PUZZLE_IDS.filter((id) => progress[id]).length

  if (stage.k === 'play') {
    const tier = TIER_LIST[stage.tier]
    const data = tier.levels[stage.index]
    const hasNext = stage.index + 1 < tier.levels.length
    return (
      <section className="dmgame hsgame" ref={topRef} aria-label="Hashi">
        <Board
          key={data.id}
          data={data}
          tier={tier}
          index={stage.index}
          hasNext={hasNext}
          onExit={() => setStage({ k: 'menu' })}
          onNext={() => setStage({ k: 'play', tier: stage.tier, index: stage.index + 1 })}
          onSolved={() =>
            setProgress((p) => {
              const next: Progress = { ...p, [data.id]: true }
              writeProgress(next)
              return next
            })
          }
        />
      </section>
    )
  }

  return (
    <section className="dmgame hsgame" ref={topRef} aria-label="Hashi">
      <p className="muted">
        {t(`${TIER_LIST.length} sizes, ${ALL_PUZZLES.length} puzzles.`, `${TIER_LIST.length} ukuran, ${ALL_PUZZLES.length} teka-teki.`)} {solvedCount > 0 ? t(`${solvedCount} solved.`, `${solvedCount} selesai.`) : ''}
      </p>
      {TIER_LIST.map((tier, ti) => {
        const done = tier.levels.filter((l) => progress[l.id]).length
        return (
          <div key={tier.id} className="hstier">
            <h2 className="dmh">
              {tc(tier.name)} <span className="small muted">{done}/{tier.levels.length}</span>
            </h2>
            <p className="small muted">{tc(tier.subtitle)}</p>
            <div className="hslevels" role="group" aria-label={tc(tier.name)}>
              {tier.levels.map((l, li) => {
                const p = progress[l.id] === true
                return (
                  <button key={l.id} type="button" className={`hslevel${p ? ' done' : ''}`} onClick={() => setStage({ k: 'play', tier: ti, index: li })} aria-label={`${li + 1}${p ? t(', solved', ', selesai') : ''}`}>
                    <b>{li + 1}</b>
                    <span className="hslmark" aria-hidden="true">
                      {p ? '✓' : ' '}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      <p className="small muted">{t('Your progress is kept in this browser.', 'Progresmu disimpan di browser ini.')}</p>
    </section>
  )
}
