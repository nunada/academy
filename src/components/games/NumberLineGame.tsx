import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { Tex } from '../ui'
import { texSpeech } from '../../lib/texspeech'
import { fishTex } from '../../lib/fishgame'
import {
  LEVELS,
  REVEAL_AFTER,
  ROUNDS,
  advance,
  check,
  equalsTex,
  isLabelled,
  judge,
  markTex,
  newGame,
  nudge,
  placeOf,
  reveal,
  roundOf,
  setMark,
  stars,
  tickTex,
  type Game,
  type Level,
} from '../../lib/numberline'

const L = (en: string, id: string): Loc => ({ en, id })

const LEVEL_INFO: Record<Level, { name: Loc; about: Loc }> = {
  1: { name: L('Integers', 'Bilangan bulat'), about: L('Count the ticks from a labelled number. Left of 0 is negative.', 'Hitung tandanya dari bilangan yang diberi label. Di kiri 0 bilangannya negatif.') },
  2: { name: L('Fractions and decimals', 'Pecahan dan desimal'), about: L('The ticks cut each unit into equal parts: count how many parts a unit has.', 'Tanda-tanda membagi setiap satuan menjadi bagian yang sama: hitung berapa bagian dalam satu satuan.') },
  3: { name: L('Below zero', 'Di bawah nol'), about: L('Some numbers are negative, and some repeat: a third is a tick only when the unit is cut in three.', 'Ada bilangan yang negatif, dan ada yang berulang: sepertiga adalah satu tanda hanya bila satuan dibagi tiga.') },
  4: { name: L('Zoom in', 'Perbesar'), about: L('Only the two ends have labels. The ticks cut the stretch between them into equal parts.', 'Hanya kedua ujung yang diberi label. Tanda-tandanya membagi jarak di antaranya menjadi bagian yang sama.') },
  5: { name: L('Roots, π and e', 'Akar, π, dan e'), about: L('There is no tick for these numbers. Estimate: √n is between the integers whose squares are just below and just above n.', 'Bilangan-bilangan ini tidak punya tanda. Perkirakan: √n terletak di antara bilangan bulat yang kuadratnya tepat di bawah dan di atas n.') },
}

interface Best {
  stars: number
  mistakes: number
}
const bestKey = (level: Level) => `nunada.numberline.best.${level}`
function readBest(level: Level): Best | null {
  try {
    const v = JSON.parse(localStorage.getItem(bestKey(level)) ?? 'null') as Partial<Best> | null
    return v && Number.isInteger(v.stars) && Number.isInteger(v.mistakes) && (v.stars as number) >= 1 && (v.stars as number) <= 3 ? (v as Best) : null
  } catch {
    return null
  }
}
const better = (a: Best, b: Best | null): boolean => !b || a.stars > b.stars || (a.stars === b.stars && a.mistakes < b.mistakes)
function writeBest(level: Level, b: Best) {
  try {
    localStorage.setItem(bestKey(level), JSON.stringify(b))
  } catch {
    /* a private window: the game works the same without a saved best */
  }
}

const freshSeed = () => Math.floor(Math.random() * 2 ** 31)

export default function NumberLineGame() {
  const { lang, tc } = useI18n()
  const [game, setGame] = useState<Game>(() => newGame(1, freshSeed()))
  const [best, setBest] = useState<Best | null>(() => readBest(1))
  const [newBest, setNewBest] = useState(false)
  const fieldRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const dragging = useRef(false)
  const saved = useRef(false)

  const round = roundOf(game)
  const line = round.line
  const done = game.phase === 'done'
  const settled = game.phase === 'right' || game.phase === 'shown'
  const earned = stars(game.mistakes)
  const speak = (tex: string) => texSpeech(tex, lang)

  const start = useCallback((level: Level) => {
    setGame(newGame(level, freshSeed()))
    setBest(readBest(level))
    setNewBest(false)
    saved.current = false
  }, [])

  // the end: keep the best
  useEffect(() => {
    if (!done || saved.current) return
    saved.current = true
    const result: Best = { stars: earned, mistakes: game.mistakes }
    const before = readBest(game.level)
    if (better(result, before)) {
      writeBest(game.level, result)
      setBest(result)
      setNewBest(Boolean(before))
    }
  }, [done, earned, game.level, game.mistakes])

  // a settled round hands the focus to "next", a new round hands it back to the line (only if the player was in the game)
  useEffect(() => {
    if (settled) nextRef.current?.focus({ preventScroll: true })
  }, [settled, game.index])
  const lastIndex = useRef(0)
  useEffect(() => {
    if (game.index !== lastIndex.current && game.phase === 'play' && game.index > 0) fieldRef.current?.focus({ preventScroll: true })
    lastIndex.current = game.index
  }, [game.index, game.phase])

  const fractionOf = (clientX: number): number => {
    const r = trackRef.current?.getBoundingClientRect()
    if (!r || r.width === 0) return 0
    return (clientX - r.left) / r.width
  }
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (settled || done) return
    dragging.current = true
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* a pointer that cannot be captured still moves the marker on each event */
    }
    setGame((g) => setMark(g, fractionOf(e.clientX)))
    fieldRef.current?.focus({ preventScroll: true })
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    setGame((g) => setMark(g, fractionOf(e.clientX)))
  }
  const onUp = () => {
    dragging.current = false
  }
  const doCheck = () => setGame((g) => check(g))
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (done) return
    if (settled) {
      if (e.key === 'Enter') {
        e.preventDefault()
        setGame((g) => advance(g))
      }
      return
    }
    const big = line.snap ? 5 : 10
    const moves: Record<string, () => void> = {
      ArrowLeft: () => setGame((g) => nudge(g, -1)),
      ArrowDown: () => setGame((g) => nudge(g, -1)),
      ArrowRight: () => setGame((g) => nudge(g, 1)),
      ArrowUp: () => setGame((g) => nudge(g, 1)),
      PageDown: () => setGame((g) => nudge(g, -big)),
      PageUp: () => setGame((g) => nudge(g, big)),
      Home: () => setGame((g) => setMark(g, 0)),
      End: () => setGame((g) => setMark(g, 1)),
      Enter: doCheck,
      ' ': doCheck,
    }
    const act = moves[e.key]
    if (act) {
      e.preventDefault()
      act()
    }
  }

  const placed = game.mark !== null
  const miss = game.phase === 'wrong' && placed ? judge(round, game.mark as number) : null
  const targetTex = fishTex(round.spec, lang)
  const markPct = placed ? placeOf(line, game.mark as number) * 100 : 0
  const atPct = round.at * 100

  const valueText = placed
    ? line.snap
      ? speak(markTex(round, game.mark as number, lang))
      : `${tc(L('about', 'sekitar'))} ${speak(markTex(round, game.mark as number, lang).replace('\\approx ', ''))}`
    : tc(L('not placed yet', 'belum diletakkan'))
  const lineName = `${tc(L('Number line from', 'Garis bilangan dari'))} ${speak(tickTex(line, 0, lang))} ${tc(L('to', 'sampai'))} ${speak(tickTex(line, line.n, lang))}`

  const status = (() => {
    if (game.phase === 'right') return `${tc(L('Right.', 'Tepat.'))} ${speak(equalsTex(round, lang))}`
    if (game.phase === 'shown') return `${tc(L('It goes here:', 'Tempatnya di sini:'))} ${speak(equalsTex(round, lang))}`
    if (miss) {
      const dir = miss.side > 0 ? tc(L('to the right of', 'di kanan')) : tc(L('to the left of', 'di kiri'))
      return `${tc(L('Not there. Your marker is at', 'Belum tepat. Penandamu di'))} ${speak(markTex(round, game.mark as number, lang).replace('\\approx ', ''))}, ${dir} ${tc(L('the number.', 'bilangan itu.'))}`
    }
    return ''
  })()

  const positions = Array.from({ length: line.n + 1 }, (_, i) => i)
  const pipLabel = (r: string | undefined, i: number) =>
    `${tc(L('Number', 'Bilangan'))} ${i + 1}: ${r === 'first' ? tc(L('right at once', 'langsung tepat')) : r === 'retry' ? tc(L('right after a miss', 'tepat setelah salah')) : r === 'shown' ? tc(L('shown', 'diperlihatkan')) : i === game.index && !done ? tc(L('now', 'sekarang')) : tc(L('to come', 'menyusul'))}`

  return (
    <section className="nlgame" aria-label={tc(L('Number Line', 'Garis Bilangan'))}>
      <div className="chips" role="group" aria-label={tc(L('Level', 'Tingkat'))}>
        {LEVELS.map((lv) => (
          <button key={lv} type="button" className={`chip ${game.level === lv ? 'on' : ''}`} aria-pressed={game.level === lv} onClick={() => start(lv)}>
            {lv} · {tc(LEVEL_INFO[lv].name)}
          </button>
        ))}
        <button type="button" className="btn ghost sm" onClick={() => start(game.level)}>
          {tc(L('New game', 'Permainan baru'))}
        </button>
      </div>
      <p className="small muted nlabout">{tc(LEVEL_INFO[game.level].about)}</p>

      <div className="rmhud">
        <span className="pill brand">
          {tc(L('Number', 'Bilangan'))} {Math.min(game.index + 1, ROUNDS)}/{ROUNDS}
        </span>
        <span className={`pill ${game.mistakes > 0 ? 'warn' : ''}`}>
          {tc(L('Mistakes', 'Kesalahan'))} {game.mistakes}
        </span>
        {best && (
          <span className="pill good" title={tc(L('Your best at this level', 'Terbaikmu pada tingkat ini'))}>
            {tc(L('Best', 'Terbaik'))} {'★'.repeat(best.stars)} · {best.mistakes}
          </span>
        )}
      </div>

      <ol className="nlpips" aria-label={tc(L('Progress', 'Kemajuan'))}>
        {Array.from({ length: ROUNDS }, (_, i) => (
          <li key={i} className={`nlpip ${game.results[i] ?? (i === game.index && !done ? 'now' : '')}`} aria-label={pipLabel(game.results[i], i)} />
        ))}
      </ol>

      {!done && (
        <>
          <div className="nltarget card" aria-live="polite">
            <span className="small muted">{tc(L('Put this number on the line', 'Letakkan bilangan ini pada garis'))}</span>
            <span className="nlnum" role="img" aria-label={speak(targetTex)}>
              <Tex src={targetTex} />
            </span>
          </div>

          <div
            ref={fieldRef}
            className={`nlfield${settled ? ' settled' : ''}${line.snap ? '' : ' free'}`}
            role="slider"
            tabIndex={0}
            aria-label={lineName}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={line.snap ? line.n : 100}
            aria-valuenow={placed ? (line.snap ? (game.mark as number) : Math.round((game.mark as number) * 100)) : 0}
            aria-valuetext={valueText}
            aria-describedby="nl-help"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
          >
            <div className="nltrack" ref={trackRef}>
              <div className="nlaxis" />
              {positions.map((i) => (
                <span key={i} className={`nltick${isLabelled(line, i) ? ' big' : ''}`} style={{ left: `${(i / line.n) * 100}%` }} />
              ))}
              {positions
                .filter((i) => isLabelled(line, i))
                .map((i) => (
                  <span key={`l${i}`} className="nllabel" style={{ left: `${(i / line.n) * 100}%` }}>
                    <Tex src={tickTex(line, i, lang)} />
                  </span>
                ))}
              {settled && <span className="nlpin target" style={{ left: `${atPct}%` }} aria-hidden="true" />}
              {placed && (
                <span className={`nlpin mark${game.phase === 'right' ? ' ok' : ''}${miss ? ' bad' : ''}${game.phase === 'shown' ? ' off' : ''}`} style={{ left: `${markPct}%` } as CSSProperties} aria-hidden="true" />
              )}
            </div>
          </div>
          <p id="nl-help" className="small muted nlhelp">
            {placed
              ? line.snap
                ? tc(L('Drag, or press the arrow keys, to move the marker one tick at a time.', 'Seret, atau tekan tombol panah, untuk menggeser penanda satu tanda sekali.'))
                : tc(L('Drag, or press the arrow keys (Page Up and Down for bigger steps), to move the marker. Within about 3% of the line counts.', 'Seret, atau tekan tombol panah (Page Up dan Down untuk langkah besar), untuk menggeser penanda. Dalam kira-kira 3% panjang garis dianggap tepat.'))
              : tc(L('Tap the line where the number goes.', 'Ketuk garis di tempat bilangan itu berada.'))}
          </p>

          <div className="row nlbuttons">
            <button type="button" className="btn ghost sm" onClick={() => setGame((g) => nudge(g, -1))} disabled={settled} aria-label={tc(L('Move the marker one step left', 'Geser penanda satu langkah ke kiri'))}>
              ◀
            </button>
            <button type="button" className="btn ghost sm" onClick={() => setGame((g) => nudge(g, 1))} disabled={settled} aria-label={tc(L('Move the marker one step right', 'Geser penanda satu langkah ke kanan'))}>
              ▶
            </button>
            {!settled && (
              <button type="button" className="btn" onClick={doCheck} disabled={!placed}>
                {tc(L('Check', 'Periksa'))}
              </button>
            )}
            {game.phase === 'wrong' && game.tries >= REVEAL_AFTER && (
              <button type="button" className="btn ghost sm" onClick={() => setGame((g) => reveal(g))}>
                {tc(L('Show me where it goes', 'Tunjukkan tempatnya'))}
              </button>
            )}
            {settled && (
              <button type="button" className="btn" ref={nextRef} onClick={() => setGame((g) => advance(g))}>
                {game.index + 1 >= ROUNDS ? tc(L('Finish', 'Selesai')) : tc(L('Next number', 'Bilangan berikutnya'))} →
              </button>
            )}
          </div>

          <div className="sr-only" role="status" aria-live="polite">
            {status}
          </div>
          <div className="nlfeedback" aria-hidden="true">
            {game.phase === 'right' && (
              <p className="nlok">
                <b>{tc(L('Right!', 'Tepat!'))}</b> <Tex src={equalsTex(round, lang)} />
              </p>
            )}
            {game.phase === 'shown' && (
              <p className="nlshown">
                <b>{tc(L('It goes here:', 'Tempatnya di sini:'))}</b> <Tex src={equalsTex(round, lang)} />
              </p>
            )}
            {miss && (
              <p className="nlbad">
                {tc(L('Not there. Your marker is at', 'Belum tepat. Penandamu di'))} <Tex src={markTex(round, game.mark as number, lang)} />,{' '}
                {miss.side > 0 ? tc(L('to the right of the number: move left.', 'di kanan bilangan itu: geser ke kiri.')) : tc(L('to the left of the number: move right.', 'di kiri bilangan itu: geser ke kanan.'))}
              </p>
            )}
          </div>
        </>
      )}

      {done && (
        <div className="rmresult card" role="status">
          <h3 style={{ marginTop: 0 }}>
            <span aria-label={`${earned} ${tc(L('stars', 'bintang'))}`}>
              {'★'.repeat(earned)}
              <span className="muted">{'☆'.repeat(3 - earned)}</span>
            </span>{' '}
            {tc(L('All numbers placed!', 'Semua bilangan sudah diletakkan!'))}
          </h3>
          <p className="muted">
            {game.results.filter((r) => r === 'first').length}/{ROUNDS} {tc(L('right at once', 'langsung tepat'))} · {game.mistakes} {tc(L('mistakes', 'kesalahan'))}
            {newBest ? ` · ${tc(L('a new best!', 'rekor baru!'))}` : ''}
          </p>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn" onClick={() => start(game.level)}>
              {tc(L('Play again', 'Main lagi'))}
            </button>
            {game.level < 5 && (
              <button type="button" className="btn soft" onClick={() => start((game.level + 1) as Level)}>
                {tc(L('Next level', 'Tingkat berikutnya'))}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
