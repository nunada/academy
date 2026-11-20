import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useI18n } from '../../i18n'
import { ALL_PUZZLES, PUZZLE_IDS, TIER_LIST, type NkLevel, type NkTier } from '../../content/nurikabe'
import { BLANK, DOT, SEA, analyze, deduce, emptyMarks, nextMark, parseProgress, parsePuzzle, type ConflictKind, type Mark, type Progress } from '../../lib/nurikabe'

/* ------------------------------------------------------------------------------------------------ progress */

const PROGRESS_KEY = 'nunada.nurikabe.v1'
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
  pool: ['A block of sea 2×2 is not allowed.', 'Blok laut 2×2 tidak boleh ada.'],
  'too-big': ['An island has more cells than its number.', 'Sebuah pulau punya lebih banyak petak daripada angkanya.'],
  'two-clues': ['Two numbers are joined in one island.', 'Dua angka tergabung dalam satu pulau.'],
  'too-small': ['An island cannot reach its number any more: there is not enough room.', 'Sebuah pulau tidak bisa mencapai angkanya lagi: tempatnya tidak cukup.'],
  'no-clue': ['A dot belongs to no number any more.', 'Sebuah titik tidak termasuk ke angka mana pun lagi.'],
  split: ['The sea is cut into pieces that cannot be joined.', 'Laut terpotong menjadi bagian-bagian yang tidak bisa disambung.'],
}
/** shown while playing, without pressing Check: the mistakes that no later move can undo by itself */
const LIVE: ConflictKind[] = ['pool', 'too-big', 'two-clues']
const ORDER: ConflictKind[] = ['pool', 'two-clues', 'too-big', 'too-small', 'no-clue', 'split']

const MOVE_KEYS: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }

/* ------------------------------------------------------------------------------------------------ one puzzle */

function Board({ data, tier, index, hasNext, onExit, onNext, onSolved }: { data: NkLevel; tier: NkTier; index: number; hasNext: boolean; onExit: () => void; onNext: () => void; onSolved: () => void }) {
  const { lang, tc } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const puzzle = useMemo(() => parsePuzzle(data.id, data.rows, data.sea), [data])
  const { w, h, clue } = puzzle
  const marks = useRef<Mark[]>(emptyMarks(puzzle))
  const history = useRef<Mark[][]>([])
  const [, setVersion] = useState(0)
  const bump = () => setVersion((v) => v + 1)
  const [cur, setCur] = useState(0)
  const [checked, setChecked] = useState(false)
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
      setCell(Math.max(28, Math.min(64, Math.floor(Math.min(byW, byH)))))
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
    setChecked(false)
    setFlash(null)
    setNote(null)
    bump()
  }
  const remember = () => {
    history.current.push(marks.current.slice())
  }
  const press = (i: number) => {
    if (won || clue[i] > 0) return
    remember()
    const to = nextMark(marks.current[i])
    paint.current = { from: marks.current[i], to }
    edit([[i, to]])
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
    if (i === null || clue[i] > 0 || marks.current[i] !== p.from) return
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
    setChecked(false)
    setFlash(null)
    setNote(null)
    bump()
  }
  const doReset = () => {
    if (marks.current.some((m) => m !== BLANK)) remember()
    marks.current = emptyMarks(puzzle)
    reported.current = false
    setChecked(false)
    setFlash(null)
    setNote(null)
    bump()
    wrapRef.current?.focus({ preventScroll: true })
  }
  const doCheck = () => {
    if (won) return
    setChecked(true)
    const a = analyze(puzzle, marks.current)
    const first = ORDER.find((k) => a.conflicts.some((c) => c.kind === k))
    if (first) say(t(...CONFLICT_TEXT[first]))
    else say(t('Nothing is wrong so far. Keep going.', 'Sejauh ini tidak ada yang salah. Teruskan.'), true)
  }
  const doHint = () => {
    if (won) return
    const m = marks.current
    // a mark that is not right
    for (let i = 0; i < m.length; i++)
      if (clue[i] === 0 && m[i] !== BLANK && (m[i] === SEA) !== puzzle.solution[i]) {
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
      say(t('The rules decide this cell. Look at what is around it.', 'Aturan menentukan petak ini. Lihat apa yang ada di sekitarnya.'), true)
      return
    }
    const open = m.findIndex((v, i) => v === BLANK && clue[i] === 0)
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
    } else if ((e.key === 'b' || e.key === 'B' || e.key === 'x' || e.key === 'X') && !won && clue[cur] === 0) {
      e.preventDefault()
      remember()
      edit([[cur, SEA]])
    } else if ((e.key === '.' || e.key === 'l' || e.key === 'L') && !won && clue[cur] === 0) {
      e.preventDefault()
      remember()
      edit([[cur, DOT]])
    } else if ((e.key === 'Delete' || e.key === 'c' || e.key === 'C') && !won && clue[cur] === 0) {
      e.preventDefault()
      remember()
      edit([[cur, BLANK]])
    } else if (e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') {
      e.preventDefault()
      doUndo()
    } else if (e.key === 'r' || e.key === 'R') doReset()
    else if (e.key === 'h' || e.key === 'H') doHint()
  }

  // what is marked wrong: always the mistakes that no later move can undo by itself, and everything after Check
  const bad = new Set<number>()
  for (const c of analysis.conflicts) if (checked || LIVE.includes(c.kind)) for (const i of c.cells) bad.add(i)

  const markName = (i: number): string => (clue[i] > 0 ? t(`number ${clue[i]}`, `angka ${clue[i]}`) : marks.current[i] === SEA ? t('sea', 'laut') : marks.current[i] === DOT ? t('land, dotted', 'darat, bertitik') : t('empty', 'kosong'))
  const announcement = `${t('Row', 'Baris')} ${Math.floor(cur / w) + 1}, ${t('column', 'kolom')} ${(cur % w) + 1}: ${markName(cur)}.`
  const style = { '--cols': w, '--cell': `${cell}px`, '--gap': `${gap}px` } as CSSProperties
  const seaCount = marks.current.filter((m, i) => m === SEA && clue[i] === 0).length

  return (
    <div className="nkplay">
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

      <p className="nkgoal small muted">
        {t('Shade the sea so that every island has one number and that many cells, the sea is one piece, and no 2×2 block is all sea.', 'Warnai laut sehingga tiap pulau punya satu angka dan sebanyak itu petaknya, laut satu bagian, dan tidak ada blok 2×2 yang semuanya laut.')}
      </p>

      <div className="nkboardbox" ref={boxRef}>
        <div
          className="nkboard"
          ref={wrapRef}
          tabIndex={0}
          role="application"
          aria-label={t(
            `The puzzle, ${w} columns by ${h} rows. Arrow keys move, Space or Enter changes a cell: sea, dot, empty. Z undoes, H gives a hint.`,
            `Teka-teki, ${w} kolom kali ${h} baris. Tombol panah berpindah, Spasi atau Enter mengubah petak: laut, titik, kosong. Z membatalkan, H memberi petunjuk.`,
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
            const cls = ['nkc', clue[i] > 0 ? 'clue' : m === SEA ? 'sea' : m === DOT ? 'dot' : '', bad.has(i) ? 'bad' : '', i === cur ? 'cur' : '', flash === i ? 'flash' : '', won ? 'won' : ''].filter(Boolean).join(' ')
            return (
              <div key={i} data-i={i} className={cls} aria-hidden="true">
                {clue[i] > 0 ? clue[i] : ''}
              </div>
            )
          })}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement} {note?.text ?? ''}
      </p>
      <p className={`nknote${note ? ` on${note.info ? ' info' : ''}` : ''}`} aria-hidden="true">
        {note?.text ?? ' '}
      </p>

      <div className="nkcontrols">
        <span className="small muted">{t(`Sea: ${seaCount}`, `Laut: ${seaCount}`)}</span>
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
      <p className="small muted nkhelp">{t('Press a cell to shade it as sea, press again for a dot (this one is land), again to clear it. You can drag across cells.', 'Tekan sebuah petak untuk mewarnainya sebagai laut, tekan lagi untuk titik (ini daratan), lagi untuk menghapus. Kamu bisa menggeser melintasi petak.')}</p>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------ the game */

export default function NurikabeGame() {
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
      <section className="dmgame nkgame" ref={topRef} aria-label="Nurikabe">
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
    <section className="dmgame nkgame" ref={topRef} aria-label="Nurikabe">
      <p className="muted">
        {t(`${TIER_LIST.length} sizes, ${ALL_PUZZLES.length} puzzles.`, `${TIER_LIST.length} ukuran, ${ALL_PUZZLES.length} teka-teki.`)} {solvedCount > 0 ? t(`${solvedCount} solved.`, `${solvedCount} selesai.`) : ''}
      </p>
      {TIER_LIST.map((tier, ti) => {
        const done = tier.levels.filter((l) => progress[l.id]).length
        return (
          <div key={tier.id} className="nktier">
            <h2 className="dmh">
              {tc(tier.name)} <span className="small muted">{done}/{tier.levels.length}</span>
            </h2>
            <p className="small muted">{tc(tier.subtitle)}</p>
            <div className="nklevels" role="group" aria-label={tc(tier.name)}>
              {tier.levels.map((l, li) => {
                const p = progress[l.id] === true
                return (
                  <button key={l.id} type="button" className={`nklevel${p ? ' done' : ''}`} onClick={() => setStage({ k: 'play', tier: ti, index: li })} aria-label={`${li + 1}${p ? t(', solved', ', selesai') : ''}`}>
                    <b>{li + 1}</b>
                    <span className="nklmark" aria-hidden="true">
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
