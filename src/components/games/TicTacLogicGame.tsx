import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useI18n } from '../../i18n'
import { ALL_PUZZLES, PUZZLE_IDS, TIER_LIST, type TtLevel, type TtTier } from '../../content/tictaclogic'
import { BLANK, O, X, analyze, deduce, nextMark, parseProgress, parsePuzzle, startMarks, type ConflictKind, type Mark, type Progress } from '../../lib/tictaclogic'

/* ------------------------------------------------------------------------------------------------ progress */

const PROGRESS_KEY = 'nunada.tictaclogic.v1'
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
  triple: ['Three of the same symbol are next to each other.', 'Tiga simbol yang sama berdampingan.'],
  over: ['A row or a column has more of one symbol than half of it.', 'Sebuah baris atau kolom punya satu simbol lebih dari separuhnya.'],
  same: ['Two rows, or two columns, are exactly the same.', 'Dua baris, atau dua kolom, persis sama.'],
}
const ORDER: ConflictKind[] = ['triple', 'over', 'same']

const MOVE_KEYS: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
const SYMBOL = (m: Mark): string => (m === X ? 'X' : m === O ? 'O' : '')

/* ------------------------------------------------------------------------------------------------ one puzzle */

function Board({ data, tier, index, hasNext, onExit, onNext, onSolved }: { data: TtLevel; tier: TtTier; index: number; hasNext: boolean; onExit: () => void; onNext: () => void; onSolved: () => void }) {
  const { lang, tc } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const puzzle = useMemo(() => parsePuzzle(data.id, data.rows, data.sol), [data])
  const { w, h, given } = puzzle
  const marks = useRef<Mark[]>(startMarks(puzzle))
  const history = useRef<Mark[][]>([])
  const [, setVersion] = useState(0)
  const bump = () => setVersion((v) => v + 1)
  const [cur, setCur] = useState(0)
  const [flash, setFlash] = useState<number | null>(null)
  const [note, setNote] = useState<{ n: number; text: string; info: boolean } | null>(null)
  const [cell, setCell] = useState(48)
  const wrapRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const paint = useRef<{ from: Mark; to: Mark } | null>(null)
  const said = useRef(0)
  const reported = useRef(false)
  const gap = w > 8 ? 3 : 4

  const analysis = analyze(puzzle, marks.current)
  const won = analysis.solved

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

  // the size of a cell: as large as the width of the page (and the height of the window) allows
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const fit = () => {
      const width = el.getBoundingClientRect().width
      if (width === 0) return
      const byW = (width - 16 - gap * (w - 1)) / w
      const byH = (Math.max(320, window.innerHeight - 300) - 16 - gap * (h - 1)) / h
      setCell(Math.max(26, Math.min(60, Math.floor(Math.min(byW, byH)))))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [w, h, gap])
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

  const edit = (changes: [number, Mark][]) => {
    marks.current = marks.current.map((m, i) => {
      const c = changes.find(([j]) => j === i)
      return c ? c[1] : m
    })
    setFlash(null)
    setNote(null)
    bump()
  }
  const remember = () => {
    history.current.push(marks.current.slice())
  }
  const press = (i: number) => {
    if (won || given[i] !== BLANK) return
    remember()
    const to = nextMark(marks.current[i])
    paint.current = { from: marks.current[i], to }
    edit([[i, to]])
  }
  const put = (i: number, m: Mark) => {
    if (won || given[i] !== BLANK || marks.current[i] === m) return
    remember()
    edit([[i, m]])
  }
  const cellAt = (e: { clientX: number; clientY: number }): number | null => {
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-i]')
    return el ? Number(el.getAttribute('data-i')) : null
  }
  const down = (e: ReactPointerEvent) => {
    const i = cellAt(e)
    if (i === null) return
    e.preventDefault()
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
    setCur(i)
    press(i)
  }
  const move = (e: ReactPointerEvent) => {
    const p = paint.current
    if (!p || won) return
    const i = cellAt(e)
    if (i === null || given[i] !== BLANK || marks.current[i] !== p.from) return
    edit([[i, p.to]])
  }
  const up = () => {
    paint.current = null
  }

  const doUndo = () => {
    const last = history.current.pop()
    if (!last) return
    marks.current = last
    reported.current = false
    setFlash(null)
    setNote(null)
    bump()
  }
  const doReset = () => {
    if (marks.current.some((m, i) => m !== given[i])) remember()
    marks.current = startMarks(puzzle)
    reported.current = false
    setFlash(null)
    setNote(null)
    bump()
    wrapRef.current?.focus({ preventScroll: true })
  }
  const doCheck = () => {
    if (won) return
    const a = analyze(puzzle, marks.current)
    const first = ORDER.find((k) => a.conflicts.some((c) => c.kind === k))
    if (first) say(t(...CONFLICT_TEXT[first]))
    else {
      const open = marks.current.filter((m) => m === BLANK).length
      say(t(`Nothing is wrong so far. ${open} ${open === 1 ? 'cell is' : 'cells are'} still empty.`, `Sejauh ini tidak ada yang salah. ${open} petak masih kosong.`), true)
    }
  }
  const doHint = () => {
    if (won) return
    const m = marks.current
    // a mark that is not right
    for (let i = 0; i < m.length; i++)
      if (given[i] === BLANK && m[i] !== BLANK && m[i] !== puzzle.solution[i]) {
        setFlash(i)
        setCur(i)
        say(t('This mark is not right.', 'Tanda ini belum benar.'), true)
        return
      }
    // a cell that the rules decide
    const d = deduce(puzzle, m)
    if (d.ok && d.cells.length > 0) {
      setFlash(d.cells[0].i)
      setCur(d.cells[0].i)
      say(t('The rules decide this cell. Look at its row and its column.', 'Aturan menentukan petak ini. Lihat baris dan kolomnya.'), true)
      return
    }
    const open = m.findIndex((v) => v === BLANK)
    if (open >= 0) {
      setFlash(open)
      setCur(open)
      say(t('Try this cell.', 'Coba petak ini.'), true)
    }
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const dir = MOVE_KEYS[e.key]
    if (dir) {
      e.preventDefault()
      const x = Math.max(0, Math.min(w - 1, (cur % w) + dir[0]))
      const y = Math.max(0, Math.min(h - 1, Math.floor(cur / w) + dir[1]))
      setCur(y * w + x)
      return
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      press(cur)
      paint.current = null
    } else if (e.key === 'x' || e.key === 'X') {
      e.preventDefault()
      put(cur, X)
    } else if (e.key === 'o' || e.key === 'O' || e.key === '0') {
      e.preventDefault()
      put(cur, O)
    } else if (e.key === 'Delete' || e.key === 'c' || e.key === 'C') {
      e.preventDefault()
      put(cur, BLANK)
    } else if (e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') {
      e.preventDefault()
      doUndo()
    } else if (e.key === 'r' || e.key === 'R') doReset()
    else if (e.key === 'h' || e.key === 'H') doHint()
  }

  // what is wrong: every conflict is a mistake that no later move can undo by itself, so they are shown as they happen
  const bad = new Set<number>()
  for (const c of analysis.conflicts) for (const i of c.cells) bad.add(i)

  const markName = (i: number): string => (given[i] !== BLANK ? t(`given ${SYMBOL(given[i])}`, `diberikan ${SYMBOL(given[i])}`) : marks.current[i] === BLANK ? t('empty', 'kosong') : SYMBOL(marks.current[i]))
  const announcement = `${t('Row', 'Baris')} ${Math.floor(cur / w) + 1}, ${t('column', 'kolom')} ${(cur % w) + 1}: ${markName(cur)}.`
  const style = { '--cols': w, '--cell': `${cell}px`, '--gap': `${gap}px` } as CSSProperties
  const empty = marks.current.filter((m) => m === BLANK).length

  return (
    <div className="ttplay">
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

      <p className="ttgoal small muted">
        {t('Fill every cell with X or O: no three of a kind in a row, as many X as O in every row and column, and no two rows or two columns the same.', 'Isi setiap petak dengan X atau O: tidak ada tiga yang sama berurutan, X dan O sama banyak di setiap baris dan kolom, dan tidak ada dua baris atau dua kolom yang sama.')}
      </p>

      <div className="ttboardbox" ref={boxRef}>
        <div
          className="ttboard"
          ref={wrapRef}
          tabIndex={0}
          role="application"
          aria-label={t(
            `The puzzle, ${w} columns by ${h} rows. Arrow keys move, Space or Enter changes a cell: X, O, empty. X and O put that symbol, C clears, Z undoes, H gives a hint.`,
            `Teka-teki, ${w} kolom kali ${h} baris. Tombol panah berpindah, Spasi atau Enter mengubah petak: X, O, kosong. X dan O menaruh simbol itu, C menghapus, Z membatalkan, H memberi petunjuk.`,
          )}
          style={style}
          onKeyDown={onKey}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          {Array.from({ length: w * h }, (_, i) => {
            const m = marks.current[i]
            const cls = ['ttc', given[i] !== BLANK ? 'ttgiven' : '', m === X ? 'x' : m === O ? 'o' : '', bad.has(i) ? 'bad' : '', i === cur ? 'cur' : '', flash === i ? 'flash' : '', won ? 'won' : ''].filter(Boolean).join(' ')
            return (
              <div key={i} data-i={i} className={cls} aria-hidden="true">
                {SYMBOL(m)}
              </div>
            )
          })}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement} {note?.text ?? ''}
      </p>
      <p className={`ttnote${note ? ` on${note.info ? ' info' : ''}` : ''}`} aria-hidden="true">
        {note?.text ?? ' '}
      </p>

      <div className="ttcontrols">
        <span className="small muted">{t(`Empty cells: ${empty}`, `Petak kosong: ${empty}`)}</span>
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
      <p className="small muted tthelp">{t('Press a cell to put an X, press again for an O, again to clear it. You can drag across cells. The cells in a lighter box are given and cannot be changed.', 'Tekan sebuah petak untuk menaruh X, tekan lagi untuk O, lagi untuk menghapus. Kamu bisa menggeser melintasi petak. Petak dalam kotak yang lebih terang sudah diberikan dan tidak bisa diubah.')}</p>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------ the game */

export default function TicTacLogicGame() {
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
      <section className="dmgame ttgame" ref={topRef} aria-label="Tic-Tac-Logic">
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
    <section className="dmgame ttgame" ref={topRef} aria-label="Tic-Tac-Logic">
      <p className="muted">
        {t(`${TIER_LIST.length} sizes, ${ALL_PUZZLES.length} puzzles.`, `${TIER_LIST.length} ukuran, ${ALL_PUZZLES.length} teka-teki.`)} {solvedCount > 0 ? t(`${solvedCount} solved.`, `${solvedCount} selesai.`) : ''}
      </p>
      {TIER_LIST.map((tier, ti) => {
        const done = tier.levels.filter((l) => progress[l.id]).length
        return (
          <div key={tier.id} className="tttier">
            <h2 className="dmh">
              {tc(tier.name)} <span className="small muted">{done}/{tier.levels.length}</span>
            </h2>
            <p className="small muted">{tc(tier.subtitle)}</p>
            <div className="ttlevels" role="group" aria-label={tc(tier.name)}>
              {tier.levels.map((l, li) => {
                const p = progress[l.id] === true
                return (
                  <button key={l.id} type="button" className={`ttlevel${p ? ' done' : ''}`} onClick={() => setStage({ k: 'play', tier: ti, index: li })} aria-label={`${li + 1}${p ? t(', solved', ', selesai') : ''}`}>
                    <b>{li + 1}</b>
                    <span className="ttlmark" aria-hidden="true">
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
