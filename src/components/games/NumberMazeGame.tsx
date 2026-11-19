import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useI18n } from '../../i18n'
import { ALL_LEVELS, CHAPTERS, LEVEL_IDS, type MazeChapter, type MazeLevel } from '../../content/numbermaze'
import {
  KEY_IDS,
  createGame,
  describeCondition,
  describeOp,
  formatCondition,
  formatOp,
  keysInHand,
  isSpent,
  move,
  parseLevel,
  parseProgress,
  reset,
  solve,
  starsFor,
  tileAt,
  undo,
  type Blocked,
  type Dir,
  type Game,
  type KeyId,
  type Level,
  type Progress,
  type Tile,
} from '../../lib/numbermaze'

/* ------------------------------------------------------------------------------------------------ progress */

const PROGRESS_KEY = 'nunada.numbermaze.v1'
const readProgress = (): Progress => {
  try {
    return parseProgress(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? 'null'), LEVEL_IDS)
  } catch {
    return {}
  }
}
const writeProgress = (p: Progress) => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))
  } catch {
    /* a private window: the game works the same without saved progress */
  }
}

type T = (en: string, id: string) => string

/* ------------------------------------------------------------------------------------------------ words */

const GLYPH: Record<Dir, string> = { up: '▲', down: '▼', left: '◀', right: '▶' }
const DIR_NAME: Record<Dir, [string, string]> = { up: ['up', 'atas'], down: ['down', 'bawah'], left: ['left', 'kiri'], right: ['right', 'kanan'] }
const KEY_NAME: Record<KeyId, [string, string]> = { 1: ['yellow', 'kuning'], 2: ['blue', 'biru'], 3: ['purple', 'ungu'], 4: ['green', 'hijau'] }

function blockedText(b: Blocked, t: T, lang: string): string {
  switch (b.reason) {
    case 'wall':
      return t('A wall.', 'Tembok.')
    case 'oneway':
      return t(`From this arrow tile you can only go ${DIR_NAME[b.dir][0]}.`, `Dari petak panah ini kamu hanya boleh ke ${DIR_NAME[b.dir][1]}.`)
    case 'locked':
      return b.exit ? t(`The exit needs ${describeCondition(b.condition, lang)}.`, `Pintu keluar butuh ${describeCondition(b.condition, lang)}.`) : t(`The gate is locked: it needs ${describeCondition(b.condition, lang)}.`, `Gerbang terkunci: butuh ${describeCondition(b.condition, lang)}.`)
    case 'no-key':
      return t(`This lock needs a ${KEY_NAME[b.key][0]} key.`, `Gembok ini butuh kunci ${KEY_NAME[b.key][1]}.`)
    case 'not-divisible':
      return t('The division does not come out even.', 'Pembagian tidak habis.')
    case 'not-exact':
      return t('The result is not a whole number.', 'Hasilnya bukan bilangan bulat.')
    case 'undefined':
      return t('That operation is not defined for this value.', 'Operasi ini tidak terdefinisi untuk nilai itu.')
    case 'out-of-range':
      return t('The result is out of range.', 'Hasilnya di luar jangkauan.')
    case 'limit':
      return b.high ? t(`A value above ${b.limit} is not allowed in this level.`, `Nilai di atas ${b.limit} tidak diperbolehkan di level ini.`) : t(`A value below ${b.limit} is not allowed in this level.`, `Nilai di bawah ${b.limit} tidak diperbolehkan di level ini.`)
    case 'finished':
      return t('The level is finished.', 'Level sudah selesai.')
  }
}

/** What a tile looks like (a class and a label) and what it is, in words, for a screen reader. */
function tileView(tile: Tile, lang: string, t: T): { cls: string; text: string; sr: string } {
  switch (tile.kind) {
    case 'wall':
      return { cls: 'wall', text: '', sr: t('wall', 'tembok') }
    case 'floor':
      return { cls: 'floor', text: '', sr: t('empty floor', 'lantai kosong') }
    case 'start':
      return { cls: 'start', text: '', sr: t('the start', 'titik awal') }
    case 'op':
      return {
        cls: tile.once ? 'op once' : 'op',
        text: formatOp(tile.op),
        sr: `${t('operator', 'operator')}: ${describeOp(tile.op, lang)}${tile.once ? t(', used up once', ', habis sekali pakai') : t(', never runs out', ', tidak pernah habis')}`,
      }
    case 'gate':
      return { cls: 'gate', text: formatCondition(tile.condition, lang), sr: t(`gate: needs ${describeCondition(tile.condition, lang)}`, `gerbang: butuh ${describeCondition(tile.condition, lang)}`) }
    case 'goal':
      return { cls: 'goal', text: tile.condition ? `🏁\n${formatCondition(tile.condition, lang)}` : '🏁', sr: tile.condition ? t(`exit: needs ${describeCondition(tile.condition, lang)}`, `pintu keluar: butuh ${describeCondition(tile.condition, lang)}`) : t('the exit', 'pintu keluar') }
    case 'oneway':
      return { cls: 'oneway', text: GLYPH[tile.dir], sr: t(`one-way tile, only ${DIR_NAME[tile.dir][0]} to leave`, `petak satu arah, keluar hanya ke ${DIR_NAME[tile.dir][1]}`) }
    case 'key':
      return { cls: `key k${tile.key}`, text: `🔑${tile.key}`, sr: t(`${KEY_NAME[tile.key][0]} key`, `kunci ${KEY_NAME[tile.key][1]}`) }
    case 'lock':
      return { cls: `lock k${tile.key}`, text: `🔒${tile.key}`, sr: t(`${KEY_NAME[tile.key][0]} lock`, `gembok ${KEY_NAME[tile.key][1]}`) }
  }
}

const goalText = (level: Level, lang: string, t: T): string => {
  for (const row of level.tiles)
    for (const tile of row) if (tile.kind === 'goal') return tile.condition ? t(`Leave with a value that is ${describeCondition(tile.condition, lang)}`, `Keluar dengan nilai ${describeCondition(tile.condition, lang)}`) : t('Reach the exit', 'Capai pintu keluar')
  return ''
}

const Stars = ({ n, t }: { n: number; t: T }) => (
  <span className="nmstars" role="img" aria-label={t(`${n} of 3 stars`, `${n} dari 3 bintang`)}>
    {[1, 2, 3].map((i) => (
      <span key={i} className={i <= n ? 'on' : ''} aria-hidden="true">
        ★
      </span>
    ))}
  </span>
)

/* ------------------------------------------------------------------------------------------------ one level */

const KEYS: Record<string, Dir> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' }
const SWIPE = 22

function Maze({ data, chapter, index, hasNext, onExit, onNext, onSolved }: { data: MazeLevel; chapter: MazeChapter; index: number; hasNext: boolean; onExit: () => void; onNext: () => void; onSolved: (moves: number, stars: 1 | 2 | 3) => void }) {
  const { lang, tc } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const level = useMemo(() => parseLevel(data), [data])
  const game = useRef<Game>(createGame(level))
  const [, setVersion] = useState(0)
  const bump = () => setVersion((v) => v + 1)
  const [note, setNote] = useState<{ n: number; text: string; info: boolean } | null>(null)
  const [hintDir, setHintDir] = useState<Dir | null>(null)
  const [hinted, setHinted] = useState(false)
  const [idea, setIdea] = useState(false)
  const [cell, setCell] = useState(48)
  const wrapRef = useRef<HTMLDivElement>(null)
  const boardBox = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const said = useRef(0)
  const g = game.current
  const gap = level.width > 9 ? 4 : 6

  const say = useCallback((text: string, info = false) => {
    said.current += 1
    setNote({ n: said.current, text, info })
  }, [])
  useEffect(() => {
    if (!note) return
    const n = note.n
    const id = window.setTimeout(() => setNote((x) => (x && x.n === n ? null : x)), 4500)
    return () => window.clearTimeout(id)
  }, [note])

  // the size of a tile: as large as the width of the page (and the height of the window) allows
  useEffect(() => {
    const el = boardBox.current
    if (!el) return
    const fit = () => {
      const w = el.getBoundingClientRect().width
      if (w === 0) return
      const byW = (w - gap * (level.width - 1)) / level.width
      const byH = (Math.max(320, window.innerHeight - 330) - gap * (level.height - 1)) / level.height
      setCell(Math.max(26, Math.min(64, Math.floor(Math.min(byW, byH)))))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [level.width, level.height, gap])
  useEffect(() => {
    wrapRef.current?.focus({ preventScroll: true })
  }, [level])

  const go = (dir: Dir) => {
    setHintDir(null)
    const r = move(g, dir)
    if (!r.ok) {
      if (r.blocked.reason !== 'finished') say(blockedText(r.blocked, t, lang))
      bump()
      return
    }
    setNote(null)
    bump()
    if (r.won) {
      const stars = starsFor(g.moves, data.par, hinted)
      onSolved(g.moves, stars)
    }
  }
  const doUndo = () => {
    setHintDir(null)
    if (undo(g)) setNote(null)
    bump()
  }
  const doReset = () => {
    reset(g)
    setHintDir(null)
    setHinted(false)
    setNote(null)
    bump()
    wrapRef.current?.focus({ preventScroll: true })
  }
  const showWay = () => {
    const r = solve(level, { pos: g.pos, value: g.value, used: g.used }, 300_000)
    if (r.solved) {
      setHinted(true)
      setHintDir(r.path[0])
      say(t(`Next step: ${DIR_NAME[r.path[0]][0]}. From here the exit is ${r.path.length} ${r.path.length === 1 ? 'step' : 'steps'} away at best.`, `Langkah berikutnya: ${DIR_NAME[r.path[0]][1]}. Dari sini pintu keluar paling cepat ${r.path.length} langkah lagi.`), true)
    } else if (r.exhausted) say(t('That is too far to see from here.', 'Itu terlalu jauh untuk dilihat dari sini.'), true)
    else say(t('There is no way to the exit from here any more. Undo some steps, or start again.', 'Tidak ada jalan lagi ke pintu keluar dari sini. Batalkan beberapa langkah, atau mulai lagi.'))
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const dir = KEYS[e.key]
    if (dir) {
      e.preventDefault()
      go(dir)
    } else if (e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') {
      e.preventDefault()
      doUndo()
    } else if (e.key === 'r' || e.key === 'R') doReset()
  }
  const down = (e: ReactPointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY }
  }
  const up = (e: ReactPointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE) return
    go(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
  }

  useEffect(() => {
    if (g.won) resultRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  })

  const stars = g.won ? starsFor(g.moves, data.par, hinted) : null
  const here = tileAt(level, g.pos.x, g.pos.y)
  const hand = KEY_IDS.filter((k) => keysInHand(level, g.used, k) > 0)
  const announcement = `${t('Value', 'Nilai')} ${g.value}. ${t('Step', 'Langkah')} ${g.moves}. ${t('Row', 'Baris')} ${g.pos.y + 1}, ${t('column', 'kolom')} ${g.pos.x + 1}: ${tileView(here, lang, t).sr}.`
  const style = { '--cols': level.width, '--cell': `${cell}px`, '--gap': `${gap}px` } as CSSProperties
  const solved = g.won

  return (
    <div className="nmplay">
      <div className="dmbar">
        <button type="button" className="btn ghost sm" onClick={onExit}>
          {t('All levels', 'Semua level')}
        </button>
        <span className="pill brand">
          {tc(chapter.name)} · {index + 1}
        </span>
      </div>
      <h3 className="nmname">{tc(data.name)}</h3>

      {solved && stars && (
        <div className="dmresult win" ref={resultRef}>
          <span className="dmconfetti" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ left: `${4 + i * 7}%`, animationDelay: `${(i % 5) * 0.18}s` }} />
            ))}
          </span>
          <h3>🎉 {t('Solved!', 'Selesai!')}</h3>
          <p>
            <Stars n={stars} t={t} />{' '}
            {t(`${g.moves} steps; the shortest way is ${data.par}.`, `${g.moves} langkah; yang tercepat ${data.par}.`)}
            {hinted && stars < 3 ? ' ' + t('(Showing the way keeps it from three stars.)', '(Melihat jalan membuatnya tidak bisa tiga bintang.)') : ''}
          </p>
          <div className="chips">
            {hasNext ? (
              <button type="button" className="btn" onClick={onNext}>
                {t('Next level', 'Level berikutnya')}
              </button>
            ) : null}
            <button type="button" className={hasNext ? 'btn ghost' : 'btn'} onClick={doReset}>
              {t('Play it again', 'Main lagi')}
            </button>
            <button type="button" className="btn ghost" onClick={onExit}>
              {t('All levels', 'Semua level')}
            </button>
          </div>
        </div>
      )}

      <div className="nminfo">
        <div className="nmvalue" aria-hidden="true">
          <span className="small muted">{t('Your value', 'Nilaimu')}</span>
          <b>{g.value}</b>
        </div>
        <div className="nmcount">
          <span>
            {t('Steps', 'Langkah')} <b>{g.moves}</b>
          </span>
          <span className="muted">
            {t('shortest', 'tercepat')} {data.par}
          </span>
        </div>
        <div className="nmhand" aria-label={t('Keys in hand', 'Kunci di tangan')}>
          {hand.map((k) => (
            <span key={k} className={`nmkey k${k}`}>
              🔑{k}
            </span>
          ))}
        </div>
      </div>
      <p className="nmgoal">{goalText(level, lang, t)}</p>

      <div className="nmboardbox" ref={boardBox}>
        <div
          className="nmboard"
          ref={wrapRef}
          tabIndex={0}
          role="application"
          aria-label={t(`The maze, ${level.width} columns by ${level.height} rows. Use the arrow keys, or the buttons below.`, `Labirin, ${level.width} kolom kali ${level.height} baris. Pakai tombol panah, atau tombol di bawah.`)}
          style={style}
          onKeyDown={onKey}
          onPointerDown={down}
          onPointerUp={up}
          onPointerCancel={() => (swipe.current = null)}
        >
          {level.tiles.map((row, y) =>
            row.map((tile, x) => {
              const v = tileView(tile, lang, t)
              const spent = (tile.kind === 'op' && tile.once && isSpent(g.used, tile.index)) || (tile.kind === 'key' && isSpent(g.used, tile.index)) || (tile.kind === 'lock' && isSpent(g.used, tile.index))
              return (
                <div key={`${x},${y}`} className={`nmt ${v.cls}${spent ? ' spent' : ''}${v.text.length > 5 ? ' long' : ''}`} aria-hidden="true">
                  {spent ? '' : v.text.split('\n').map((line, i) => (i === 0 ? line : [<br key={i} />, line]))}
                </div>
              )
            }),
          )}
          <div className={`nmp${solved ? ' won' : ''}`} style={{ transform: `translate(${g.pos.x * (cell + gap)}px, ${g.pos.y * (cell + gap)}px)` }} aria-hidden="true">
            {g.value}
          </div>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement} {note?.text ?? ''}
      </p>
      <p className={`nmnote${note ? ` on${note.info ? ' info' : ''}` : ''}`} aria-hidden="true">
        {note?.text ?? ' '}
      </p>

      <div className="nmcontrols">
        <div className="nmdpad" role="group" aria-label={t('Move', 'Gerak')}>
          {(['up', 'left', 'down', 'right'] as Dir[]).map((d) => (
            <button key={d} type="button" className={`nmd ${d}${hintDir === d ? ' hint' : ''}`} onClick={() => go(d)} aria-label={t(DIR_NAME[d][0], DIR_NAME[d][1])} disabled={solved}>
              {GLYPH[d]}
            </button>
          ))}
        </div>
        <div className="chips">
          <button type="button" className="btn soft sm" onClick={doUndo} disabled={g.history.length === 0}>
            {t('Undo', 'Undo')} <span className="small muted">Z</span>
          </button>
          <button type="button" className="btn soft sm" onClick={doReset}>
            {t('Restart', 'Ulang')} <span className="small muted">R</span>
          </button>
          <button type="button" className="btn soft sm" onClick={() => setIdea((v) => !v)} aria-pressed={idea}>
            {t('Idea', 'Ide')}
          </button>
          <button type="button" className="btn soft sm" onClick={showWay} disabled={solved}>
            {t('Show next step', 'Lihat langkah berikutnya')}
          </button>
        </div>
      </div>
      {idea && <p className="dmnotice nmidea">{tc(data.hint)}</p>}
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------ the game */

export default function NumberMazeGame() {
  const { tc, lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const [progress, setProgress] = useState<Progress>(readProgress)
  const [stage, setStage] = useState<{ k: 'menu' } | { k: 'play'; chapter: number; index: number }>({ k: 'menu' })
  const topRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (stage.k === 'play') topRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [stage])

  const solvedCount = LEVEL_IDS.filter((id) => progress[id]).length
  const solved = (levelId: string): boolean => Boolean(progress[levelId])

  if (stage.k === 'play') {
    const chapter = CHAPTERS[stage.chapter]
    const data = chapter.levels[stage.index]
    const hasNext = stage.index + 1 < chapter.levels.length
    return (
      <section className="dmgame nmgame" ref={topRef} aria-label={t('Number Maze', 'Labirin Angka')}>
        <Maze
          key={data.id}
          data={data}
          chapter={chapter}
          index={stage.index}
          hasNext={hasNext}
          onExit={() => setStage({ k: 'menu' })}
          onNext={() => setStage({ k: 'play', chapter: stage.chapter, index: stage.index + 1 })}
          onSolved={(moves, stars) =>
            setProgress((p) => {
              const before = p[data.id]
              const next: Progress = { ...p, [data.id]: { best: before ? Math.min(before.best, moves) : moves, stars: (before ? Math.max(before.stars, stars) : stars) as 1 | 2 | 3 } }
              writeProgress(next)
              return next
            })
          }
        />
      </section>
    )
  }

  return (
    <section className="dmgame nmgame" ref={topRef} aria-label={t('Number Maze', 'Labirin Angka')}>
      <p className="muted">
        {t(`${CHAPTERS.length} chapters, ${ALL_LEVELS.length} levels.`, `${CHAPTERS.length} bab, ${ALL_LEVELS.length} level.`)} {solvedCount > 0 ? t(`${solvedCount} solved.`, `${solvedCount} selesai.`) : ''}
      </p>
      {CHAPTERS.map((chapter, ci) => {
        const done = chapter.levels.filter((l) => solved(l.id)).length
        return (
          <div key={chapter.id} className="nmchapter">
            <h2 className="dmh">
              {tc(chapter.name)} <span className="small muted">{done}/{chapter.levels.length}</span>
              {chapter.draft && <span className="pill"> {t('more levels coming', 'level lain menyusul')}</span>}
            </h2>
            <p className="small muted">{tc(chapter.subtitle)}</p>
            <div className="nmlevels" role="group" aria-label={tc(chapter.name)}>
              {chapter.levels.map((l, li) => {
                const open = li === 0 || solved(chapter.levels[li - 1].id) || solved(l.id)
                const p = progress[l.id]
                return (
                  <button key={l.id} type="button" className={`nmlevel${p ? ' done' : ''}`} disabled={!open} onClick={() => setStage({ k: 'play', chapter: ci, index: li })} aria-label={`${li + 1}. ${tc(l.name)}${p ? `, ${t(`${p.stars} stars`, `${p.stars} bintang`)}` : open ? '' : t(', locked', ', terkunci')}`} title={tc(l.name)}>
                    <b>{open ? li + 1 : '🔒'}</b>
                    <span className="nmlstars" aria-hidden="true">
                      {p ? '★'.repeat(p.stars) + '☆'.repeat(3 - p.stars) : ' '}
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
