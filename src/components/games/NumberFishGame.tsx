import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import { Bar, Tex } from '../ui'
import { texSpeech } from '../../lib/texspeech'
import { LIVES, TIERS, WORLD, createWorld, fishTex, starsOf, step, type Fish, type FishSpec, type GameEvent, type Input, type Level, type World } from '../../lib/fishgame'

const L = (en: string, id: string): Loc => ({ en, id })

const LEVELS: { id: Level; name: Loc; blurb: Loc }[] = [
  { id: 1, name: L('Easy', 'Mudah'), blurb: L('fractions, decimals, percents', 'pecahan, desimal, persen') },
  { id: 2, name: L('Medium', 'Sedang'), blurb: L('plus negatives, repeating decimals, powers', 'ditambah negatif, desimal berulang, pangkat') },
  { id: 3, name: L('Hard', 'Sulit'), blurb: L('plus roots, π and e', 'ditambah akar, π, dan e') },
]

interface Best {
  score: number
  stars: number
}
const bestKey = (level: Level) => `nunada.numberfish.best.${level}`
function readBest(level: Level): Best | null {
  try {
    const raw = localStorage.getItem(bestKey(level))
    return raw ? (JSON.parse(raw) as Best) : null
  } catch {
    return null
  }
}
function writeBest(level: Level, b: Best) {
  try {
    localStorage.setItem(bestKey(level), JSON.stringify(b))
  } catch {
    /* a private window: the game works the same without a saved best */
  }
}

const freshSeed = () => Math.floor(Math.random() * 2 ** 31)
type Phase = 'ready' | 'play' | 'paused' | 'won' | 'lost'

/** A fish: a pastel body, a tail and an eye, with the number on it. The body is drawn facing right and flipped (the number is not) for a fish swimming left. */
function FishBody({ hue, left }: { hue: number; left: boolean }) {
  return (
    <svg className="fishbody" viewBox="0 0 120 64" preserveAspectRatio="none" aria-hidden="true" style={left ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M8 32 L30 12 Q34 32 30 52 Z" fill={`hsl(${hue} 55% 62%)`} stroke="rgba(20,50,45,.55)" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="68" cy="32" rx="50" ry="26" fill={`hsl(${hue} 70% 82%)`} stroke="rgba(20,50,45,.55)" strokeWidth="2" />
      <circle cx="102" cy="26" r="4.5" fill="#173a33" />
      <circle cx="103.5" cy="24.5" r="1.4" fill="#fff" />
    </svg>
  )
}

export default function NumberFishGame() {
  const { lang, tc } = useI18n()
  const [level, setLevel] = useState<Level>(1)
  const [slow, setSlow] = useState(false)
  const [phase, setPhase] = useState<Phase>('ready')
  const [, setTick] = useState(0)
  const [toast, setToast] = useState<{ a: FishSpec; b: FishSpec; rel: '>' | '<' | '=' } | null>(null)
  const [note, setNote] = useState('')
  const [best, setBest] = useState<Best | null>(() => readBest(1))
  const [newBest, setNewBest] = useState(false)

  const world = useRef<World>(createWorld(1, freshSeed()))
  const stage = useRef<HTMLDivElement>(null)
  const playerEl = useRef<HTMLDivElement | null>(null)
  const fishEls = useRef(new Map<number, HTMLElement>())
  const keys = useRef(new Set<string>())
  const target = useRef<{ x: number; y: number } | null>(null)
  const scale = useRef(1)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()
  const lastFace = useRef<1 | -1>(1)

  const rerender = () => setTick((n) => n + 1)

  const begin = useCallback(
    (lv: Level, speedSlow: boolean) => {
      world.current = createWorld(lv, freshSeed(), speedSlow ? 0.6 : 1)
      fishEls.current.clear()
      keys.current.clear()
      target.current = null
      lastFace.current = 1
      setLevel(lv)
      setBest(readBest(lv))
      setNewBest(false)
      setToast(null)
      setNote('')
      setPhase('play')
      rerender()
      stage.current?.focus({ preventScroll: true })
    },
    [],
  )

  const toReady = (lv: Level) => {
    world.current = createWorld(lv, freshSeed(), slow ? 0.6 : 1)
    fishEls.current.clear()
    setLevel(lv)
    setBest(readBest(lv))
    setToast(null)
    setNote('')
    setPhase('ready')
    rerender()
  }

  // the stage is a fixed pond of 640 × 400 units, scaled to the width it has
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const fit = () => {
      scale.current = el.clientWidth / WORLD.W
      el.style.setProperty('--s', String(scale.current))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const paint = () => {
    const w = world.current
    const pe = playerEl.current
    if (pe) {
      pe.style.transform = `translate(${w.player.x}px, ${w.player.y}px) translate(-50%, -50%)`
      pe.classList.toggle('safe', w.player.safe > 0)
      if (w.player.face !== lastFace.current) {
        lastFace.current = w.player.face
        pe.dataset.face = w.player.face === 1 ? 'right' : 'left'
      }
    }
    for (const f of w.fish) {
      const el = fishEls.current.get(f.id)
      if (el) el.style.transform = `translate(${f.x}px, ${f.y}px) translate(-50%, -50%)`
    }
  }

  const say = (a: FishSpec, b: FishSpec, rel: '>' | '<' | '=') => {
    setToast({ a, b, rel })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2400)
    const words = rel === '>' ? tc(L('is greater than', 'lebih besar dari')) : rel === '<' ? tc(L('is less than', 'lebih kecil dari')) : tc(L('equals', 'sama dengan'))
    setNote(`${texSpeech(fishTex(a, lang), lang)} ${words} ${texSpeech(fishTex(b, lang), lang)}`)
  }

  const handle = (events: GameEvent[]) => {
    let changed = false
    for (const e of events) {
      if (e.type === 'spawn' || e.type === 'leave') changed = true
      else if (e.type === 'eat') {
        changed = true
        say(e.player, e.fish.spec, '>')
      } else if (e.type === 'hurt') {
        changed = true
        say(e.player, e.fish.spec, '<')
      } else if (e.type === 'bump') say(e.player, e.fish.spec, '=')
      else if (e.type === 'grow') {
        changed = true
        setNote(tc(L('Your fish grew: its number is now ', 'Ikanmu bertumbuh: bilangannya kini ')) + texSpeech(fishTex(e.spec, lang), lang))
      } else if (e.type === 'won' || e.type === 'lost') {
        changed = true
        const w = world.current
        const stars = e.type === 'won' ? starsOf(w.lives) : 0
        const before = readBest(w.level)
        if (!before || w.score > before.score) {
          writeBest(w.level, { score: w.score, stars: Math.max(stars, before?.stars ?? 0) })
          setBest({ score: w.score, stars: Math.max(stars, before?.stars ?? 0) })
          setNewBest(Boolean(before))
        } else if (stars > before.stars) {
          writeBest(w.level, { score: before.score, stars })
          setBest({ score: before.score, stars })
        }
        setPhase(e.type)
      }
    }
    if (changed) rerender()
  }

  // the clock of the game
  useEffect(() => {
    if (phase !== 'play') return
    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      const k = keys.current
      const input: Input = {
        kx: (k.has('ArrowRight') || k.has('d') ? 1 : 0) - (k.has('ArrowLeft') || k.has('a') ? 1 : 0),
        ky: (k.has('ArrowDown') || k.has('s') ? 1 : 0) - (k.has('ArrowUp') || k.has('w') ? 1 : 0),
        tx: target.current?.x,
        ty: target.current?.y,
      }
      const events = step(world.current, dt, input)
      paint()
      if (events.length) handle(events)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // a tab nobody is looking at is a paused game
  useEffect(() => {
    const onHide = () => document.hidden && setPhase((p) => (p === 'play' ? 'paused' : p))
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [])
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const aim = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = stage.current!.getBoundingClientRect()
    target.current = { x: (e.clientX - rect.left) / scale.current, y: (e.clientY - rect.top) / scale.current }
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) e.preventDefault()
    if (key === ' ' || key === 'p' || key === 'Escape') {
      if (phase === 'play') setPhase('paused')
      else if (phase === 'paused') setPhase('play')
      return
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) {
      keys.current.add(key)
      // the keys take over from the pointer until it moves again
      target.current = null
    }
  }
  const onKeyUp = (e: ReactKeyboardEvent<HTMLDivElement>) => keys.current.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key)

  const w = world.current
  const tiers = TIERS[level]
  const hue = (f: Fish) => (f.id * 47) % 360
  const playerW = 92 + w.player.tier * 7
  const stars = w.status === 'won' ? starsOf(w.lives) : 0

  return (
    <section className="fishgame" aria-label={tc(L('Number Fish', 'Ikan Bilangan'))}>
      <div className="chips" role="group" aria-label={tc(L('Level', 'Tingkat'))}>
        {LEVELS.map((l) => (
          <button key={l.id} type="button" className={`chip ${level === l.id ? 'on' : ''}`} aria-pressed={level === l.id} onClick={() => toReady(l.id)} title={tc(l.blurb)}>
            {tc(l.name)}
          </button>
        ))}
        <button type="button" className={`chip ghost ${slow ? 'on' : ''}`} aria-pressed={slow} onClick={() => setSlow(!slow)} title={tc(L('The other fish swim slower: more time to read', 'Ikan lain berenang lebih lambat: lebih banyak waktu untuk membaca'))}>
          {tc(L('Slow fish', 'Ikan lambat'))}
        </button>
        {(phase === 'play' || phase === 'paused') && (
          <button type="button" className="btn ghost sm" onClick={() => setPhase(phase === 'play' ? 'paused' : 'play')}>
            {phase === 'play' ? tc(L('Pause', 'Jeda')) : tc(L('Resume', 'Lanjut'))}
          </button>
        )}
      </div>

      <div className="fishhud">
        <span className="pill" aria-label={`${w.lives} ${tc(L('lives', 'nyawa'))}`}>
          {'❤️'.repeat(w.lives)}
          {'🤍'.repeat(LIVES - w.lives)}
        </span>
        <span className="pill brand">
          {tc(L('Score', 'Skor'))} {w.score}
        </span>
        <span className="pill">
          {tc(L('Size', 'Ukuran'))} {w.player.tier + 1}/{tiers.count}
        </span>
        <span className="fishgrow" aria-hidden="true">
          <Bar percent={Math.round((w.eatenInTier / w.need) * 100)} />
        </span>
        {best && (
          <span className="pill good" title={tc(L('Your best score at this level', 'Skor terbaikmu pada tingkat ini'))}>
            {tc(L('Best', 'Terbaik'))} {best.score}
          </span>
        )}
      </div>

      <div
        ref={stage}
        className="fishstage"
        tabIndex={0}
        role="group"
        aria-label={tc(L('The pond. Swim with the mouse, a finger or the arrow keys, and eat the fish with the smaller number.', 'Kolam. Berenanglah dengan tetikus, jari, atau tombol panah, dan makan ikan yang bilangannya lebih kecil.'))}
        onPointerMove={aim}
        onPointerDown={aim}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => keys.current.clear()}
      >
        <div className="fishworld" style={{ width: WORLD.W, height: WORLD.H } as CSSProperties}>
          <div className="bubbles" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} style={{ left: `${8 + i * 11}%`, animationDelay: `${(i * 0.9) % 6}s`, animationDuration: `${7 + (i % 4)}s` }} />
            ))}
          </div>

          {w.fish.map((f) => (
            <div
              key={f.id}
              className="fish"
              ref={(el) => {
                if (el) {
                  fishEls.current.set(f.id, el)
                  el.style.transform = `translate(${f.x}px, ${f.y}px) translate(-50%, -50%)`
                } else fishEls.current.delete(f.id)
              }}
              style={{ width: f.w, height: f.w * 0.53 }}
            >
              <FishBody hue={hue(f)} left={f.vx < 0} />
              <span className="fishnum">
                <Tex src={fishTex(f.spec, lang)} />
              </span>
            </div>
          ))}

          <div
            ref={(el) => {
              playerEl.current = el
              if (el) el.style.transform = `translate(${w.player.x}px, ${w.player.y}px) translate(-50%, -50%)`
            }}
            className="fish player"
            data-face={w.player.face === 1 ? 'right' : 'left'}
            style={{ width: playerW, height: playerW * 0.53 }}
          >
            <FishBody hue={45} left={false} />
            <span className="fishnum">
              <Tex src={fishTex(w.player.spec, lang)} />
            </span>
          </div>
        </div>

        {toast && (
          <div className={`fishtoast ${toast.rel === '>' ? 'good' : toast.rel === '<' ? 'bad' : ''}`} aria-hidden="true">
            <Tex src={fishTex(toast.a, lang)} /> <b>{toast.rel}</b> <Tex src={fishTex(toast.b, lang)} />
          </div>
        )}

        {phase !== 'play' && (
          <div className="fishveil">
            {phase === 'ready' && (
              <div className="fishcard">
                <h3>{tc(L('Number Fish', 'Ikan Bilangan'))}</h3>
                <button type="button" className="btn" onClick={() => begin(level, slow)} style={{ marginBottom: 10 }}>
                  {tc(L('Start', 'Mulai'))}
                </button>
                <ul>
                  <li>{tc(L('Swim with the mouse, a finger, or the arrow keys or W A S D.', 'Berenanglah dengan tetikus, jari, atau tombol panah atau W A S D.'))}</li>
                  <li>{tc(L('Your fish eats a fish with a smaller number than its own.', 'Ikanmu memakan ikan yang bilangannya lebih kecil daripada miliknya.'))}</li>
                  <li>{tc(L('A fish with a larger number eats you: you lose a life.', 'Ikan yang bilangannya lebih besar memakanmu: kamu kehilangan satu nyawa.'))}</li>
                  <li className="more">{tc(L('Equal numbers, written in another way, leave each other alone.', 'Bilangan yang sama, ditulis dengan cara lain, saling membiarkan.'))}</li>
                  <li className="more">{tc(L(`Eat ${tiers.need} fish to grow into a larger number. Reach the largest one to win.`, `Makan ${tiers.need} ikan untuk tumbuh menjadi bilangan yang lebih besar. Capai yang terbesar untuk menang.`))}</li>
                </ul>
              </div>
            )}
            {phase === 'paused' && (
              <div className="fishcard">
                <h3>{tc(L('Paused', 'Jeda'))}</h3>
                <div className="row" style={{ gap: 8, justifyContent: 'center' }}>
                  <button type="button" className="btn" onClick={() => setPhase('play')}>
                    {tc(L('Resume', 'Lanjut'))}
                  </button>
                  <button type="button" className="btn ghost" onClick={() => begin(level, slow)}>
                    {tc(L('Start over', 'Mulai ulang'))}
                  </button>
                </div>
              </div>
            )}
            {(phase === 'won' || phase === 'lost') && (
              <div className="fishcard" role="status">
                <h3>
                  {phase === 'won' ? (
                    <>
                      <span aria-label={`${stars} ${tc(L('stars', 'bintang'))}`}>
                        {'★'.repeat(stars)}
                        <span className="muted">{'☆'.repeat(3 - stars)}</span>
                      </span>{' '}
                      {tc(L('You are the biggest fish!', 'Kamu ikan terbesar!'))}
                    </>
                  ) : (
                    tc(L('You were eaten.', 'Kamu dimakan.'))
                  )}
                </h3>
                <p className="muted">
                  {tc(L('Score', 'Skor'))} {w.score} · {w.eaten} {tc(L('fish eaten', 'ikan dimakan'))}
                  {newBest ? ` · ${tc(L('a new best!', 'rekor baru!'))}` : ''}
                </p>
                <div className="row" style={{ gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button type="button" className="btn" onClick={() => begin(level, slow)}>
                    {tc(L('Play again', 'Main lagi'))}
                  </button>
                  {phase === 'won' && level < 3 && (
                    <button type="button" className="btn soft" onClick={() => begin((level + 1) as Level, slow)}>
                      {tc(L('Next level', 'Tingkat berikutnya'))}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {note}
      </div>
      <p className="small muted" style={{ marginTop: 8 }}>
        {tc(L('Space or P pauses. The eaten fish and the fish that ate you are shown as a comparison at the top of the pond.', 'Spasi atau P menjeda. Ikan yang kamu makan dan ikan yang memakanmu ditunjukkan sebagai perbandingan di bagian atas kolam.'))}
      </p>
    </section>
  )
}
