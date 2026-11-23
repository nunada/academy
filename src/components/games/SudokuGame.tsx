import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useI18n } from '../../i18n'
import * as plain from '../../content/sudoku'
import * as sums from '../../content/sumsudoku'
import type { SdLevel, SdTier } from '../../content/sudoku'
import { analyze, candidatesOf, deduce, digitOfKey, parseProgress, parsePuzzle, startMarks, unitsOf, type ConflictKind, type Digit, type Progress, type Puzzle, type Why } from '../../lib/sudoku'

/** One component for both games: Sudoku (digits given) and Sum Sudoku (cages with sums). */
type Kind = 'sudoku' | 'sum'

const BOOK = { sudoku: plain, sum: sums }
const NAME: Record<Kind, string> = { sudoku: 'Sudoku', sum: 'Sum Sudoku' }

/* ------------------------------------------------------------------------------------------------ progress */

const progressKey = (kind: Kind): string => (kind === 'sum' ? 'nunada.sumsudoku.v1' : 'nunada.sudoku.v1')
const readProgress = (kind: Kind): Progress => {
  try {
    return parseProgress(JSON.parse(localStorage.getItem(progressKey(kind)) ?? 'null'), BOOK[kind].PUZZLE_IDS)
  } catch {
    return {}
  }
}
const writeProgress = (kind: Kind, p: Progress) => {
  try {
    localStorage.setItem(progressKey(kind), JSON.stringify(Object.keys(p)))
  } catch {
    /* a private window: the game works the same without saved progress */
  }
}

type T = (en: string, id: string) => string

/* ------------------------------------------------------------------------------------------------ words */

const CONFLICT_TEXT: Record<ConflictKind, [string, string]> = {
  row: ['A digit is there twice in a row.', 'Ada angka yang muncul dua kali dalam satu baris.'],
  col: ['A digit is there twice in a column.', 'Ada angka yang muncul dua kali dalam satu kolom.'],
  box: ['A digit is there twice in a box.', 'Ada angka yang muncul dua kali dalam satu kotak.'],
  'cage-dup': ['A digit is there twice in a cage.', 'Ada angka yang muncul dua kali dalam satu kandang.'],
  'cage-sum': ['A cage cannot add up to its number any more.', 'Sebuah kandang tidak mungkin lagi berjumlah sesuai angkanya.'],
}
const ORDER: ConflictKind[] = ['row', 'col', 'box', 'cage-dup', 'cage-sum']

const WHY_TEXT: Record<Why, [string, string]> = {
  'last-candidate': ['Only one digit can go in this cell: look at the digits in its row, its column and its box.', 'Hanya satu angka yang bisa masuk petak ini: lihat angka di baris, kolom, dan kotaknya.'],
  'only-place': ['A digit has only this place left in its row, its column or its box.', 'Ada angka yang hanya punya tempat ini di baris, kolom, atau kotaknya.'],
  cage: ['The numbers of the cages leave only one digit for this cell.', 'Angka-angka kandang hanya menyisakan satu angka untuk petak ini.'],
  chain: ['The rules decide this cell, but it takes a few steps to see it.', 'Aturan menentukan petak ini, tetapi butuh beberapa langkah untuk melihatnya.'],
}

const MOVE_KEYS: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }

interface Snap {
  marks: Digit[]
  notes: number[]
}

/* ------------------------------------------------------------------------------------------------ one puzzle */

function Board({ kind, data, tier, index, hasNext, onExit, onNext, onSolved }: { kind: Kind; data: SdLevel; tier: SdTier; index: number; hasNext: boolean; onExit: () => void; onNext: () => void; onSolved: () => void }) {
  const { lang, tc } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const puzzle: Puzzle = useMemo(() => parsePuzzle(data.id, { rows: data.rows, sol: data.sol, cages: data.cages }), [data])
  const { n, br, bc, given } = puzzle
  const units = useMemo(() => unitsOf(puzzle), [puzzle])
  const peers = useMemo(() => {
    const out: Set<number>[] = Array.from({ length: n * n }, () => new Set<number>())
    for (const u of units) for (const i of u) for (const j of u) if (i !== j) out[i].add(j)
    return out
  }, [units, n])
  const cageOf = useMemo(() => {
    const out = new Int16Array(n * n).fill(-1)
    puzzle.cages?.forEach((c, k) => c.cells.forEach((i) => (out[i] = k)))
    return out
  }, [puzzle, n])

  const marks = useRef<Digit[]>(startMarks(puzzle))
  const notes = useRef<number[]>(new Array(n * n).fill(0))
  const history = useRef<Snap[]>([])
  const [, setVersion] = useState(0)
  const bump = () => setVersion((v) => v + 1)
  const [cur, setCur] = useState(0)
  const [noteMode, setNoteMode] = useState(false)
  const [flash, setFlash] = useState<number | null>(null)
  const [note, setNote] = useState<{ n: number; text: string; info: boolean } | null>(null)
  const [cell, setCell] = useState(44)
  const wrapRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const said = useRef(0)
  const reported = useRef(false)

  const analysis = analyze(puzzle, marks.current)
  const won = analysis.solved

  const say = (text: string, info = false) => {
    said.current += 1
    setNote({ n: said.current, text, info })
  }
  useEffect(() => {
    if (!note) return
    const k = note.n
    const id = window.setTimeout(() => setNote((x) => (x && x.n === k ? null : x)), 6000)
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
      const byW = (width - 12) / n
      const byH = (Math.max(320, window.innerHeight - 330) - 12) / n
      setCell(Math.max(28, Math.min(58, Math.floor(Math.min(byW, byH)))))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [n])
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

  const remember = () => {
    history.current.push({ marks: marks.current.slice(), notes: notes.current.slice() })
  }
  const after = () => {
    setFlash(null)
    setNote(null)
    bump()
  }
  /** put a digit in a cell (0 clears it); in note mode a digit is a note, which is turned on or off */
  const put = (i: number, d: Digit) => {
    if (won || given[i] !== 0) return
    if (noteMode && d !== 0) {
      if (marks.current[i] !== 0) return
      remember()
      notes.current = notes.current.map((m, j) => (j === i ? m ^ (1 << (d - 1)) : m))
      after()
      return
    }
    if (d === 0 && marks.current[i] === 0 && notes.current[i] === 0) return
    if (d !== 0 && marks.current[i] === d) d = 0
    remember()
    if (d === 0 && marks.current[i] === 0) notes.current = notes.current.map((m, j) => (j === i ? 0 : m))
    else {
      marks.current = marks.current.map((m, j) => (j === i ? d : m))
      if (d !== 0) {
        const bitD = 1 << (d - 1)
        // the digit is taken out of the notes of the cells that see it
        notes.current = notes.current.map((m, j) => (j === i ? 0 : peers[i].has(j) ? m & ~bitD : m))
      }
    }
    after()
  }
  const cellAt = (e: { clientX: number; clientY: number }): number | null => {
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-i]')
    return el ? Number(el.getAttribute('data-i')) : null
  }
  const down = (e: ReactPointerEvent) => {
    const i = cellAt(e)
    if (i === null) return
    e.preventDefault()
    setCur(i)
    wrapRef.current?.focus({ preventScroll: true })
  }

  const doUndo = () => {
    const last = history.current.pop()
    if (!last) return
    marks.current = last.marks
    notes.current = last.notes
    reported.current = false
    after()
  }
  const doReset = () => {
    if (marks.current.some((m, i) => m !== given[i]) || notes.current.some((m) => m !== 0)) remember()
    marks.current = startMarks(puzzle)
    notes.current = new Array(n * n).fill(0)
    reported.current = false
    after()
    wrapRef.current?.focus({ preventScroll: true })
  }
  const doFill = () => {
    if (won) return
    remember()
    const c = candidatesOf(puzzle, marks.current)
    notes.current = c.map((m, i) => (marks.current[i] === 0 ? m : 0))
    after()
  }
  const doCheck = () => {
    if (won) return
    const a = analyze(puzzle, marks.current)
    const first = ORDER.find((k) => a.conflicts.some((c) => c.kind === k))
    if (first) say(t(...CONFLICT_TEXT[first]))
    else {
      const open = marks.current.filter((m) => m === 0).length
      say(t(`Nothing is wrong so far. ${open} ${open === 1 ? 'cell is' : 'cells are'} still empty.`, `Sejauh ini tidak ada yang salah. ${open} petak masih kosong.`), true)
    }
  }
  const doHint = () => {
    if (won) return
    const m = marks.current
    // a digit that is not right
    for (let i = 0; i < m.length; i++)
      if (given[i] === 0 && m[i] !== 0 && m[i] !== puzzle.solution[i]) {
        setFlash(i)
        setCur(i)
        say(t('This digit is not right.', 'Angka ini belum benar.'), true)
        return
      }
    const d = deduce(puzzle, m)
    if (d.ok && d.cells.length > 0) {
      // the one nearest to the cell that is selected
      const at = (i: number) => Math.abs(Math.floor(i / n) - Math.floor(cur / n)) + Math.abs((i % n) - (cur % n))
      const pick = d.cells.slice().sort((a, b) => at(a.i) - at(b.i) || a.i - b.i)[0]
      setFlash(pick.i)
      setCur(pick.i)
      say(t(...WHY_TEXT[pick.why]), true)
      return
    }
    if (d.ok && d.fewest !== null) {
      setFlash(d.fewest)
      setCur(d.fewest)
      say(t('Nothing is forced by a single rule. Few digits fit here: try them one at a time and follow what each one forces.', 'Tidak ada yang dipaksa oleh satu aturan saja. Hanya sedikit angka yang cocok di sini: coba satu per satu dan ikuti akibat masing-masing.'), true)
    }
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const dir = MOVE_KEYS[e.key]
    if (dir) {
      e.preventDefault()
      const x = Math.max(0, Math.min(n - 1, (cur % n) + dir[0]))
      const y = Math.max(0, Math.min(n - 1, Math.floor(cur / n) + dir[1]))
      setCur(y * n + x)
      return
    }
    const d = digitOfKey(e.key, n)
    if (d !== null) {
      e.preventDefault()
      put(cur, d)
    } else if (e.key === 'Delete' || e.key === 'Backspace' || e.key === '0') {
      e.preventDefault()
      put(cur, 0)
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault()
      setNoteMode((v) => !v)
    } else if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault()
      doUndo()
    } else if (e.key === 'r' || e.key === 'R') doReset()
    else if (e.key === 'h' || e.key === 'H') doHint()
    else if (e.key === 'c' || e.key === 'C') doCheck()
    else if (e.key === 'f' || e.key === 'F') doFill()
  }

  // what is wrong: shown as it happens
  const bad = new Set<number>()
  const badCage = new Set<number>()
  for (const c of analysis.conflicts) {
    if (c.kind === 'cage-sum') {
      badCage.add(cageOf[c.cells[0]])
      for (const i of c.cells) if (marks.current[i] !== 0) bad.add(i)
    } else for (const i of c.cells) bad.add(i)
  }

  const here = marks.current[cur]
  const counts = new Array(n + 1).fill(0)
  for (const m of marks.current) counts[m]++

  const cellName = (i: number): string => {
    const g = given[i] !== 0 ? t(`given ${given[i]}`, `diberikan ${given[i]}`) : marks.current[i] === 0 ? t('empty', 'kosong') : String(marks.current[i])
    const cg = puzzle.cages && cageOf[i] >= 0 ? t(`, cage sum ${puzzle.cages[cageOf[i]].sum}`, `, jumlah kandang ${puzzle.cages[cageOf[i]].sum}`) : ''
    return g + cg
  }
  const announcement = `${t('Row', 'Baris')} ${Math.floor(cur / n) + 1}, ${t('column', 'kolom')} ${(cur % n) + 1}: ${cellName(cur)}.`
  const style = { '--n': n, '--cell': `${cell}px` } as CSSProperties
  const empty = marks.current.filter((m) => m === 0).length
  const noteCols = n === 4 ? 2 : 3

  return (
    <div className="sdplay">
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

      <p className="sdgoal small muted">
        {kind === 'sum'
          ? t(`Fill every cell with a digit from 1 to ${n}: no digit twice in a row, a column or a ${bc}×${br} box. The digits in a dashed cage are all different and add up to the small number in its corner.`, `Isi setiap petak dengan angka 1 sampai ${n}: tidak ada angka kembar dalam satu baris, kolom, atau kotak ${bc}×${br}. Angka dalam kandang bergaris putus-putus semuanya berbeda dan berjumlah angka kecil di pojoknya.`)
          : t(`Fill every cell with a digit from 1 to ${n}: no digit twice in a row, a column or a ${bc}×${br} box.`, `Isi setiap petak dengan angka 1 sampai ${n}: tidak ada angka kembar dalam satu baris, kolom, atau kotak ${bc}×${br}.`)}
      </p>

      <div className="sdboardbox" ref={boxRef}>
        <div
          className={`sdboard${noteMode ? ' notemode' : ''}`}
          ref={wrapRef}
          tabIndex={0}
          role="application"
          aria-label={t(
            `The puzzle, ${n} by ${n}. Arrow keys move, a digit key puts that digit, Delete clears, N switches notes on or off, C checks, H gives a hint, Z undoes.`,
            `Teka-teki, ${n} kali ${n}. Tombol panah berpindah, tombol angka menaruh angka itu, Delete menghapus, N menyalakan atau mematikan catatan, C memeriksa, H memberi petunjuk, Z membatalkan.`,
          )}
          style={style}
          onKeyDown={onKey}
          onPointerDown={down}
        >
          {Array.from({ length: n * n }, (_, i) => {
            const r = Math.floor(i / n)
            const c = i % n
            const m = marks.current[i]
            const k = cageOf[i]
            // a cage of one cell is a digit that is given: it is shown as a digit, not as a cage
            const cage = k >= 0 && puzzle.cages && puzzle.cages[k].cells.length > 1 ? puzzle.cages[k] : null
            const seesCur = i !== cur && peers[cur].has(i)
            const cls = [
              'sdc',
              (c + 1) % bc === 0 && c < n - 1 ? 'bright' : '',
              (r + 1) % br === 0 && r < n - 1 ? 'bbot' : '',
              given[i] !== 0 ? 'sdgiven' : '',
              bad.has(i) ? 'bad' : '',
              i === cur ? 'cur' : seesCur ? 'peer' : '',
              here !== 0 && m === here && i !== cur ? 'same' : '',
              flash === i ? 'flash' : '',
              won ? 'won' : '',
            ]
              .filter(Boolean)
              .join(' ')
            const same = (j: number) => cage !== null && cageOf[j] === k
            const sides = cage
              ? ['t', 'r', 'b', 'l']
                  .filter((s) => (s === 't' ? r === 0 || !same(i - n) : s === 'b' ? r === n - 1 || !same(i + n) : s === 'l' ? c === 0 || !same(i - 1) : c === n - 1 || !same(i + 1)))
                  .join(' ')
              : ''
            return (
              <div key={i} data-i={i} className={cls} aria-hidden="true">
                {cage ? <i className={`sdcg ${sides}`} /> : null}
                {cage && cage.cells[0] === i ? <b className={`sdsum${badCage.has(k) ? ' bad' : ''}`}>{cage.sum}</b> : null}
                {m !== 0 ? (
                  <span className="sdv">{m}</span>
                ) : notes.current[i] !== 0 ? (
                  <span className={`sdnotes${cage ? ' low' : ''}`} style={{ gridTemplateColumns: `repeat(${noteCols}, 1fr)` }}>
                    {Array.from({ length: n }, (_, d) => (
                      <em key={d}>{notes.current[i] & (1 << d) ? d + 1 : ''}</em>
                    ))}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement} {note?.text ?? ''}
      </p>
      <p className={`sdnote${note ? ` on${note.info ? ' info' : ''}` : ''}`} aria-hidden="true">
        {note?.text ?? ' '}
      </p>

      <div className="sdpad" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} role="group" aria-label={t('Digits', 'Angka')}>
        {Array.from({ length: n }, (_, k) => (
          <button key={k} type="button" className={`sdkey${counts[k + 1] >= n ? ' used' : ''}${noteMode ? ' notes' : ''}`} onClick={() => put(cur, k + 1)} disabled={won} aria-label={`${k + 1}${noteMode ? t(' as a note', ' sebagai catatan') : ''}`}>
            {k + 1}
          </button>
        ))}
      </div>
      <div className="sdcontrols">
        <div className="chips">
          <button type="button" className={`btn soft sm${noteMode ? ' on' : ''}`} onClick={() => setNoteMode((v) => !v)} aria-pressed={noteMode}>
            {t('Notes', 'Catatan')} <span className="small muted">N</span>
          </button>
          <button type="button" className="btn soft sm" onClick={() => put(cur, 0)} disabled={won}>
            {t('Erase', 'Hapus')}
          </button>
          <button type="button" className="btn soft sm" onClick={doFill} disabled={won}>
            {t('Fill notes', 'Isi catatan')} <span className="small muted">F</span>
          </button>
        </div>
        <div className="chips">
          <button type="button" className="btn soft sm" onClick={doUndo} disabled={history.current.length === 0}>
            {t('Undo', 'Undo')} <span className="small muted">Z</span>
          </button>
          <button type="button" className="btn soft sm" onClick={doReset}>
            {t('Restart', 'Ulang')} <span className="small muted">R</span>
          </button>
          <button type="button" className="btn soft sm" onClick={doCheck} disabled={won}>
            {t('Check', 'Periksa')} <span className="small muted">C</span>
          </button>
          <button type="button" className="btn soft sm" onClick={doHint} disabled={won}>
            {t('Hint', 'Petunjuk')} <span className="small muted">H</span>
          </button>
        </div>
      </div>
      <p className="small muted sdhelp">
        <span>{t(`Empty cells: ${empty}`, `Petak kosong: ${empty}`)}. </span>
        {t(
          'Tap a cell, then a digit. With Notes on, a digit is written small, as a candidate. The shaded cells are given and cannot be changed.',
          'Ketuk sebuah petak, lalu sebuah angka. Saat Catatan menyala, angka ditulis kecil, sebagai calon. Petak yang diarsir sudah diberikan dan tidak bisa diubah.',
        )}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------ the game */

export function SudokuGame({ kind = 'sudoku' }: { kind?: Kind }) {
  const { tc, lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const book = BOOK[kind]
  const [progress, setProgress] = useState<Progress>(() => readProgress(kind))
  const [stage, setStage] = useState<{ k: 'menu' } | { k: 'play'; tier: number; index: number }>({ k: 'menu' })
  const topRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (stage.k === 'play') topRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [stage])

  const solvedCount = book.PUZZLE_IDS.filter((id) => progress[id]).length

  if (stage.k === 'play') {
    const tier = book.TIER_LIST[stage.tier]
    const data = tier.levels[stage.index]
    const hasNext = stage.index + 1 < tier.levels.length
    return (
      <section className="dmgame sdgame" ref={topRef} aria-label={NAME[kind]}>
        <Board
          key={data.id}
          kind={kind}
          data={data}
          tier={tier}
          index={stage.index}
          hasNext={hasNext}
          onExit={() => setStage({ k: 'menu' })}
          onNext={() => setStage({ k: 'play', tier: stage.tier, index: stage.index + 1 })}
          onSolved={() =>
            setProgress((p) => {
              const next: Progress = { ...p, [data.id]: true }
              writeProgress(kind, next)
              return next
            })
          }
        />
      </section>
    )
  }

  return (
    <section className="dmgame sdgame" ref={topRef} aria-label={NAME[kind]}>
      <p className="muted">
        {t(`${book.TIER_LIST.length} sizes, ${book.ALL_PUZZLES.length} puzzles.`, `${book.TIER_LIST.length} ukuran, ${book.ALL_PUZZLES.length} teka-teki.`)} {solvedCount > 0 ? t(`${solvedCount} solved.`, `${solvedCount} selesai.`) : ''}
      </p>
      {book.TIER_LIST.map((tier, ti) => {
        const done = tier.levels.filter((l) => progress[l.id]).length
        return (
          <div key={tier.id} className="sdtier">
            <h2 className="dmh">
              {tc(tier.name)} <span className="small muted">{done}/{tier.levels.length}</span>
            </h2>
            <p className="small muted">{tc(tier.subtitle)}</p>
            <div className="sdlevels" role="group" aria-label={tc(tier.name)}>
              {tier.levels.map((l, li) => {
                const p = progress[l.id] === true
                return (
                  <button key={l.id} type="button" className={`sdlevel${p ? ' done' : ''}`} onClick={() => setStage({ k: 'play', tier: ti, index: li })} aria-label={`${li + 1}${p ? t(', solved', ', selesai') : ''}`}>
                    <b>{li + 1}</b>
                    <span className="sdlmark" aria-hidden="true">
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

export const SumSudokuGame = () => <SudokuGame kind="sum" />
export default SudokuGame
