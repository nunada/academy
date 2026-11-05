import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { Tex } from '../ui'
import { texSpeech } from '../../lib/texspeech'
import { PAIRS, approx, evalSpec, isDone, isShown, newGame, pick, settle, stars, texOf, type GameState, type Level, type Mode } from '../../lib/realcards'

const L = (en: string, id: string): Loc => ({ en, id })

const LEVELS: { id: Level; name: Loc; cols: [number, number] }[] = [
  { id: 1, name: L('Easy', 'Mudah'), cols: [4, 3] },
  { id: 2, name: L('Medium', 'Sedang'), cols: [4, 4] },
  { id: 3, name: L('Hard', 'Sulit'), cols: [5, 4] },
]
const MODES: { id: Mode; name: Loc; hint: Loc }[] = [
  { id: 'open', name: L('Open cards', 'Kartu terbuka'), hint: L('all cards face up', 'semua kartu terbuka') },
  { id: 'memory', name: L('Memory', 'Memori'), hint: L('cards face down', 'kartu tertutup') },
]

interface Best {
  stars: number
  moves: number
  seconds: number
}
const bestKey = (level: Level, mode: Mode) => `nunada.realmatch.best.${level}.${mode}`
function readBest(level: Level, mode: Mode): Best | null {
  try {
    const raw = localStorage.getItem(bestKey(level, mode))
    return raw ? (JSON.parse(raw) as Best) : null
  } catch {
    return null
  }
}
/** A better game has more stars, then fewer moves, then less time. */
const better = (a: Best, b: Best | null): boolean => !b || a.stars > b.stars || (a.stars === b.stars && (a.moves < b.moves || (a.moves === b.moves && a.seconds < b.seconds)))
function writeBest(level: Level, mode: Mode, b: Best) {
  try {
    localStorage.setItem(bestKey(level, mode), JSON.stringify(b))
  } catch {
    /* a private window: the game works the same without a saved best */
  }
}

const freshSeed = () => Math.floor(Math.random() * 2 ** 31)
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/** The pair's own color: the hue steps round the wheel by the golden angle, so ten pairs stay apart. */
const hueOf = (pair: number) => Math.round((pair * 137.5) % 360)

export default function RealMatchGame() {
  const { lang, tc } = useI18n()
  const [level, setLevel] = useState<Level>(1)
  const [mode, setMode] = useState<Mode>('open')
  const [game, setGame] = useState<GameState>(() => newGame(1, 'open', freshSeed()))
  const [secs, setSecs] = useState(0)
  const [running, setRunning] = useState(false)
  const [note, setNote] = useState('')
  const [best, setBest] = useState<Best | null>(() => readBest(1, 'open'))
  const [newBest, setNewBest] = useState(false)
  const saved = useRef(false)

  const done = isDone(game)
  const pairs = PAIRS[game.level]
  const earned = stars(game.mistakes, pairs, game.mode)

  const start = useCallback((lv: Level, md: Mode) => {
    setLevel(lv)
    setMode(md)
    setGame(newGame(lv, md, freshSeed()))
    setSecs(0)
    setRunning(false)
    setNote('')
    setBest(readBest(lv, md))
    setNewBest(false)
    saved.current = false
  }, [])

  // the clock runs from the first card turned to the last pair found
  useEffect(() => {
    if (!running || done) return
    const id = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running, done])

  // a wrong pair is left on show for a moment, then turned back
  useEffect(() => {
    if (!game.miss) return
    const id = setTimeout(() => setGame((g) => settle(g)), 1200)
    return () => clearTimeout(id)
  }, [game.miss, game.faceUp])

  // the end: stop the clock, keep the best
  useEffect(() => {
    if (!done || saved.current) return
    saved.current = true
    setRunning(false)
    const result: Best = { stars: earned, moves: game.moves, seconds: secs }
    const before = readBest(game.level, game.mode)
    if (better(result, before)) {
      writeBest(game.level, game.mode, result)
      setBest(result)
      setNewBest(Boolean(before))
    }
  }, [done, earned, game.level, game.mode, game.moves, secs])

  const speak = (i: number) => texSpeech(texOf(game.cards[i].spec, lang), lang)

  const onPick = (i: number) => {
    if (done) return
    if (!running) setRunning(true)
    const next = pick(game, i)
    if (next.found.length > game.found.length) {
      const [a, b] = next.found[next.found.length - 1]
      setNote(`${tc(L('Match', 'Cocok'))}: ${texSpeech(texOf(next.cards[a].spec, lang), lang)} = ${texSpeech(texOf(next.cards[b].spec, lang), lang)}`)
    } else if (next.miss) {
      setNote(tc(L('These two are not the same number.', 'Kedua kartu ini bukan bilangan yang sama.')))
    } else {
      setNote('')
    }
    setGame(next)
  }

  const cfg = LEVELS.find((l) => l.id === game.level)!
  const boardStyle = { '--cw': cfg.cols[0], '--cn': cfg.cols[1] } as CSSProperties
  const levelName = tc(cfg.name)

  return (
    <section className="rmgame" aria-label={tc(L('Real Number Match', 'Pasangkan Bilangan Real'))}>
      <div className="rmcontrols">
        <div className="chips" role="group" aria-label={tc(L('Level', 'Tingkat'))}>
          {LEVELS.map((l) => (
            <button key={l.id} type="button" className={`chip ${level === l.id ? 'on' : ''}`} aria-pressed={level === l.id} onClick={() => start(l.id, mode)}>
              {tc(l.name)} · {PAIRS[l.id]} {tc(L('pairs', 'pasang'))}
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label={tc(L('Mode', 'Mode'))}>
          {MODES.map((m) => (
            <button key={m.id} type="button" className={`chip ${mode === m.id ? 'on' : ''}`} aria-pressed={mode === m.id} onClick={() => start(level, m.id)} title={tc(m.hint)}>
              {tc(m.name)}
            </button>
          ))}
          <button type="button" className="btn ghost sm" onClick={() => start(level, mode)}>
            {tc(L('New game', 'Permainan baru'))}
          </button>
        </div>
      </div>

      <div className="rmhud">
        <span className="pill brand">
          {tc(L('Pairs', 'Pasangan'))} {game.found.length}/{pairs}
        </span>
        <span className="pill">
          {tc(L('Moves', 'Langkah'))} {game.moves}
        </span>
        <span className={`pill ${game.mistakes > 0 ? 'warn' : ''}`}>
          {tc(L('Mistakes', 'Kesalahan'))} {game.mistakes}
        </span>
        <span className="pill">⏱ {clock(secs)}</span>
        {best && (
          <span className="pill good" title={tc(L('Your best at this level and mode', 'Terbaikmu pada tingkat dan mode ini'))}>
            {tc(L('Best', 'Terbaik'))} {'★'.repeat(best.stars)} · {best.moves} · {clock(best.seconds)}
          </span>
        )}
      </div>

      <div className="rmboard" style={boardStyle} role="group" aria-label={`${levelName}, ${pairs} ${tc(L('pairs', 'pasang'))}`}>
        {game.cards.map((c, i) => {
          const shown = isShown(game, i)
          const found = game.matched[i]
          const up = game.faceUp.includes(i)
          const pairIdx = found ? game.found.findIndex(([a, b]) => a === i || b === i) : -1
          // a long form (0.142857 with its bar, √7·√7) is set smaller on a phone, where four cards share the row
          const long = texOf(c.spec, 'en').length >= 17
          const cls = ['rmcard', found ? 'found' : '', up && !game.miss ? 'sel' : '', up && game.miss ? 'miss' : '', shown ? '' : 'back', long ? 'long' : ''].filter(Boolean).join(' ')
          const label = shown ? `${speak(i)}${found ? `, ${tc(L('matched', 'sudah cocok'))}` : ''}` : `${tc(L('Card', 'Kartu'))} ${i + 1}, ${tc(L('face down', 'tertutup'))}`
          return (
            <button
              key={c.id}
              type="button"
              className={cls}
              style={found ? ({ '--h': hueOf(pairIdx) } as CSSProperties) : undefined}
              aria-label={label}
              aria-pressed={up && !game.miss}
              aria-disabled={found || done}
              onClick={() => (found ? undefined : onPick(i))}
            >
              {shown ? <Tex src={texOf(c.spec, lang)} /> : <span aria-hidden="true">?</span>}
            </button>
          )
        })}
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {note}
      </div>
      <p className={`rmnote small ${game.miss ? 'bad' : ''}`} aria-hidden="true">
        {game.miss ? tc(L('Not the same number. Look again.', 'Bukan bilangan yang sama. Perhatikan lagi.')) : game.found.length === 0 && game.faceUp.length === 0 ? tc(L('Tap a card, then the card that shows the same number.', 'Ketuk sebuah kartu, lalu kartu yang menunjukkan bilangan yang sama.')) : ' '}
      </p>

      {done && (
        <div className="rmresult card" role="status">
          <h3 style={{ marginTop: 0 }}>
            <span aria-label={`${earned} ${tc(L('stars', 'bintang'))}`}>
              {'★'.repeat(earned)}
              <span className="muted">{'☆'.repeat(3 - earned)}</span>
            </span>{' '}
            {tc(L('All pairs found!', 'Semua pasangan ditemukan!'))}
          </h3>
          <p className="muted">
            {game.moves} {tc(L('moves', 'langkah'))} · {game.mistakes} {tc(L('mistakes', 'kesalahan'))} · {clock(secs)}
            {newBest ? ` · ${tc(L('a new best!', 'rekor baru!'))}` : ''}
          </p>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn" onClick={() => start(level, mode)}>
              {tc(L('Play again', 'Main lagi'))}
            </button>
            {level < 3 && (
              <button type="button" className="btn soft" onClick={() => start((level + 1) as Level, mode)}>
                {tc(L('Next level', 'Tingkat berikutnya'))}
              </button>
            )}
          </div>
        </div>
      )}

      {game.found.length > 0 && (
        <div className="rmfound">
          <h3>{tc(L('Pairs found', 'Pasangan yang ditemukan'))}</h3>
          <ul>
            {game.found.map(([a, b], k) => {
              const irrational = evalSpec(game.cards[a].spec).m !== 1n
              const value = approx(game.cards[a].spec, 4)
              return (
                <li key={k} style={{ '--h': hueOf(k) } as CSSProperties}>
                  <Tex src={texOf(game.cards[a].spec, lang)} /> = <Tex src={texOf(game.cards[b].spec, lang)} />
                  {irrational && <span className="muted"> ≈ {lang === 'id' ? value.replace('.', ',') : value}</span>}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
