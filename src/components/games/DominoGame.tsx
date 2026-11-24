import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useI18n } from '../../i18n'
import { Rich, Tex } from '../ui'
import { texSpeech } from '../../lib/texspeech'
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  MODES,
  act,
  choose,
  endsOf,
  isLevel,
  isModeId,
  makeRng,
  modeInfo,
  newGame,
  localTex,
  viewOf,
  worthTex,
  type Action,
  type End,
  type Game,
  type GameEvent,
  type Half,
  type Level,
  type ModeId,
  type Refusal,
  type Strength,
  type Tile,
} from '../../lib/domino'
import { NAME_MAX, cleanName, parseRoomCode, snapshotOf, type HostSession, type NetEvent, type Session, type Snapshot } from '../../lib/dominonet'
import { hostRoom, joinRoom, onlineAvailable, randomId } from '../../lib/dominorealtime'
import InviteCard from './InviteCard'

/* ------------------------------------------------------------------------------------------------ settings */

interface Settings {
  name: string
  mode: ModeId
  level: Level
  strength: Strength
}
const SETTINGS_KEY = 'nunada.domino.v1'
const isStrength = (s: unknown): s is Strength => s === 'easy' || s === 'medium' || s === 'hard'
function readSettings(): Settings {
  const fresh: Settings = { name: '', mode: 'natural', level: 1, strength: 'medium' }
  try {
    const v = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null') as Partial<Settings> | null
    if (!v || typeof v !== 'object') return fresh
    return {
      name: typeof v.name === 'string' ? cleanName(v.name, '') : '',
      mode: isModeId(v.mode) ? v.mode : fresh.mode,
      level: isLevel(v.level) ? v.level : fresh.level,
      strength: isStrength(v.strength) ? v.strength : fresh.strength,
    }
  } catch {
    return fresh
  }
}
function writeSettings(s: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
  } catch {
    /* a private window: the game works the same without remembered settings */
  }
}
/** The seat a player had in a room is remembered in this tab, so that a player who left or lost the page can rejoin the same seat (until the turn comes to it). */
const SEAT_KEY = 'nunada.domino.seat'
function seatFor(code: string): string | undefined {
  try {
    const v = JSON.parse(sessionStorage.getItem(SEAT_KEY) ?? 'null') as { code?: unknown; id?: unknown } | null
    return v && v.code === code && typeof v.id === 'string' && /^[a-z0-9]{10}$/.test(v.id) ? v.id : undefined
  } catch {
    return undefined
  }
}
function rememberSeat(code: string, id: string): void {
  try {
    sessionStorage.setItem(SEAT_KEY, JSON.stringify({ code, id }))
  } catch {
    /* without it the player comes back as a new player, which is only possible in the lobby */
  }
}
const freshSeed = () => Math.floor(Math.random() * 2 ** 31)
const guestName = (lang: string) => `${lang === 'id' ? 'Pemain' : 'Player'} ${100 + Math.floor(Math.random() * 900)}`

/* ------------------------------------------------------------------------------------------------ pieces */

/** How much of a half is seen: the TeX without its braces, a command counting as one sign, so that `\frac{1}{4}+\frac{1}{4}` counts as 7 and not as 23. A fraction
 *  stacks its numbers, so its commands are not counted at all (5). */
const seenLength = (src: string, stacked: boolean): number => src.replace(/\\[a-zA-Z]+|\\./g, stacked ? '' : 'x').replace(/[{}\s]/g, '').length

/** One half of a tile: the calculation. Every half is set at the same size, a fraction, a decimal, a percent or a plain number alike; only a long one is set smaller
 *  so that it fits. */
const HalfView = memo(function HalfView({ half, end }: { half: Half; end?: 'left' | 'right' }) {
  const { lang } = useI18n()
  const frac = half.tex.includes('\\frac')
  const long = seenLength(half.tex, frac) > (frac ? 9 : 12)
  return (
    <span className={`dmhalf${frac ? ' fr' : ''}${long ? ' long' : ''}${end ? ` end-${end}` : ''}`}>
      <Tex src={localTex(half.tex, lang)} />
    </span>
  )
})

const LEVEL_NAME: Record<Level, [string, string]> = { 1: ['Easy', 'Mudah'], 2: ['Medium', 'Sedang'], 3: ['Hard', 'Sulit'] }
const STRENGTHS: Strength[] = ['easy', 'medium', 'hard']
const STRENGTH_NAME: Record<Strength, [string, string]> = { easy: ['Easy', 'Mudah'], medium: ['Medium', 'Sedang'], hard: ['Hard', 'Sulit'] }

type T = (en: string, id: string) => string

/** " (you)" after the player's own name, unless the name already says it (against the computer the player is called "You"). */
const mark = (name: string, mine: boolean, t: T): string => (mine && name.toLowerCase() !== t('you', 'kamu') ? ` (${t('you', 'kamu')})` : '')

function refusalText(why: Refusal, t: T): string {
  switch (why) {
    case 'has-move':
      return t('One of your tiles still fits. Work out the end again.', 'Masih ada kartumu yang cocok. Hitung lagi ujungnya.')
    case 'draw-first':
      return t('Draw a tile from the pile first.', 'Ambil kartu dari tumpukan dulu.')
    case 'empty-boneyard':
      return t('The pile is empty.', 'Tumpukannya sudah habis.')
    case 'turn':
      return t('It is not your turn yet.', 'Belum giliranmu.')
    default:
      return t('That did not work. Try again.', 'Itu tidak bisa. Coba lagi.')
  }
}

/** What happened, in words. `name` turns a player id into a name. */
function eventText(e: NetEvent, name: (id: string) => string, me: string, t: T): string {
  const who = (id: string) => (id === me ? t('You', 'Kamu') : name(id))
  const side = (end: End) => (end === 'left' ? t('the left end', 'ujung kiri') : t('the right end', 'ujung kanan'))
  switch (e.k) {
    case 'play':
      return e.start ? t(`${who(e.id)} started the chain.`, `${who(e.id)} memulai rantai.`) : t(`${who(e.id)} put a tile at ${side(e.end)}.`, `${who(e.id)} memasang kartu di ${side(e.end)}.`)
    case 'miss':
      return e.id === me
        ? t(`Not equal: that tile does not match ${side(e.end)}.${e.penalty ? ` You draw ${e.penalty} ${e.penalty === 1 ? 'tile' : 'tiles'}.` : ''}`, `Belum sama: nilai kartu itu tidak sama dengan ${side(e.end)}.${e.penalty ? ` Kamu mengambil ${e.penalty} kartu.` : ''}`)
        : t(`${who(e.id)} miscalculated${e.penalty ? ` and draws ${e.penalty} ${e.penalty === 1 ? 'tile' : 'tiles'}` : ''}.`, `${who(e.id)} salah hitung${e.penalty ? ` dan mengambil ${e.penalty} kartu` : ''}.`)
    case 'draw':
      return t(`${who(e.id)} drew a tile.`, `${who(e.id)} mengambil kartu.`)
    case 'pass':
      return t(`${who(e.id)} passed.`, `${who(e.id)} melewati giliran.`)
    case 'out':
      return t(`${who(e.id)} played the last tile!`, `${who(e.id)} menghabiskan kartu!`)
    case 'blocked':
      return t('Nobody can move: the game is blocked.', 'Tidak ada yang bisa jalan: permainan buntu.')
    case 'left':
      return t(`${who(e.id)} was away when the turn came, and is out of the game.`, `${who(e.id)} tidak ada saat gilirannya tiba, jadi keluar dari permainan.`)
    case 'away':
      return t(`${who(e.id)} stepped away, and can still rejoin until the turn reaches that seat.`, `${who(e.id)} keluar dulu. Ia masih bisa masuk lagi sebelum gilirannya tiba.`)
    case 'back':
      return t(`${who(e.id)} is back.`, `${who(e.id)} kembali.`)
    case 'last':
      return t('Only one player is left.', 'Tinggal satu pemain.')
  }
}

/* ------------------------------------------------------------------------------------------------ the table */

interface TableProps {
  snap: Snapshot
  hand: Tile[]
  me: string
  /** an action is on its way to the referee */
  waiting?: boolean
  refusal?: { n: number; why: Refusal } | null
  /** a line for the computer's turn */
  thinking?: boolean
  onAct: (a: Action) => void
  /** what to show under the result of a finished game */
  after?: ReactNode
}

function Table({ snap, hand, me, waiting, refusal, thinking, onAct: send, after }: TableProps) {
  const { lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const speak = (tex: string) => texSpeech(localTex(tex, lang), lang)
  const [sel, setSel] = useState<number | null>(null)
  const [showValue, setShowValue] = useState(false)
  const [log, setLog] = useState<{ key: number; text: string }[]>([])
  const chainRef = useRef<HTMLDivElement>(null)
  const lastVer = useRef(-1)
  const lastEnd = useRef<End>('right')
  // a refusal ("one of your tiles still fits") is a passing remark: it goes after a few seconds, or as soon as the player does something else
  const [hideN, setHideN] = useState(0)
  const resultRef = useRef<HTMLDivElement>(null)
  const onAct = (a: Action) => {
    if (refusal) setHideN(refusal.n)
    send(a)
  }

  const nameOf = useCallback((id: string) => snap.players.find((p) => p.id === id)?.name ?? '?', [snap.players])
  const myTurn = snap.phase === 'play' && snap.turn === me
  const over = snap.phase === 'over'
  const ends = endsOf(snap.chain)
  const empty = snap.chain.length === 0
  const mode = snap.mode

  // the story of the game, the last few lines
  useEffect(() => {
    if (snap.ver === lastVer.current) return
    lastVer.current = snap.ver
    const lines = snap.events.map((e) => eventText(e, nameOf, me, t))
    for (const e of snap.events) if (e.k === 'play') lastEnd.current = e.end
    if (lines.length) setLog((prev) => [...prev, ...lines.map((text, i) => ({ key: snap.ver * 10 + i, text }))].slice(-4))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap.ver])

  useEffect(() => {
    if (!refusal) return
    const n = refusal.n
    const timer = window.setTimeout(() => setHideN(n), 4000)
    return () => window.clearTimeout(timer)
  }, [refusal])
  useEffect(() => {
    if (sel !== null && refusal) setHideN(refusal.n)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel])

  // the result is next to the board: bring it into view when the game ends
  useEffect(() => {
    if (over) resultRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [over])

  // a tile that is no longer in the hand cannot stay selected
  useEffect(() => {
    if (sel !== null && !hand.some((h) => h.id === sel)) setSel(null)
  }, [hand, sel])

  // the chain scrolls to where the last tile went
  useEffect(() => {
    const el = chainRef.current
    if (!el) return
    el.scrollTo({ left: lastEnd.current === 'left' ? 0 : el.scrollWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [snap.chain.length])

  const place = (end: End) => {
    if (sel === null || !myTurn || waiting) return
    const tile = sel
    setSel(null)
    onAct({ t: 'play', tile, end })
  }
  const canAct = myTurn && !waiting
  const tileLabel = (tile: Tile) => `${speak(tile.a.tex)} ${t('and', 'dan')} ${speak(tile.b.tex)}`

  const endPanel = (end: End) => {
    const half = ends[end]
    const label = end === 'left' ? t('Left end', 'Ujung kiri') : t('Right end', 'Ujung kanan')
    const arrow = end === 'left' ? '◀' : '▶'
    const armed = canAct && sel !== null
    return (
      <button
        type="button"
        key={end}
        className={`dmend ${end}${armed ? ' armed' : ''}`}
        disabled={!armed}
        onClick={() => place(end)}
        aria-label={`${label}: ${half ? speak(half.tex) : t('empty', 'kosong')}.${armed ? ` ${t('Put the selected tile here', 'Pasang kartu yang dipilih di sini')}.` : ''}`}
      >
        <span className="dmendlabel">
          {end === 'left' ? `${arrow} ${label}` : `${label} ${arrow}`}
        </span>
        <span className="dmendval">{half ? <Tex src={localTex(half.tex, lang)} /> : '–'}</span>
        {showValue && half && (
          <span className="dmendans">
            = <Tex src={localTex(worthTex(mode, half.v), lang)} />
          </span>
        )}
        {armed && <span className="dmendgo">{t('Put it here', 'Pasang di sini')}</span>}
      </button>
    )
  }

  const status = over
    ? ''
    : myTurn
      ? empty
        ? t('Your turn: pick any tile to start the chain.', 'Giliranmu: pilih kartu mana saja untuk memulai rantai.')
        : sel === null
          ? t('Your turn: pick a tile whose half has the same value as an end.', 'Giliranmu: pilih kartu yang salah satu sisinya bernilai sama dengan sebuah ujung.')
          : t('Now pick the end to put it on.', 'Sekarang pilih ujung tempat memasangnya.')
      : thinking
        ? t('The computer is thinking…', 'Komputer sedang berpikir…')
        : snap.turn
          ? t(`Waiting for ${nameOf(snap.turn)}…`, `Menunggu ${nameOf(snap.turn)}…`)
          : ''
  const mine = snap.ranks?.find((r) => r.id === me)
  const headline = !over
    ? ''
    : mine && mine.rank === 1
      ? snap.ranks && snap.ranks.filter((r) => r.rank === 1).length > 1
        ? t('A tie for first place!', 'Seri di tempat pertama!')
        : t('You win!', 'Kamu menang!')
      : t('The game is over.', 'Permainan selesai.')

  return (
    <div className="dmtable">
      <ul className="dmplayers" aria-label={t('Players', 'Pemain')}>
        {snap.players.map((p) => (
          <li key={p.id} className={`dmplayer${p.id === snap.turn ? ' turn' : ''}${p.gone ? ' gone' : ''}${p.away ? ' away' : ''}${p.id === me ? ' me' : ''}`} aria-current={p.id === snap.turn ? 'true' : undefined}>
            <span className="dmname">
              {p.name}
              {mark(p.name, p.id === me, t)}
            </span>
            <span className="dmcount">
              {p.gone ? t('out', 'keluar') : p.away ? t('away', 'keluar dulu') : `${p.count} ${t(p.count === 1 ? 'tile' : 'tiles', 'kartu')}`}
            </span>
            {p.id === snap.turn && <span className="pill brand">{t('Turn', 'Giliran')}</span>}
          </li>
        ))}
        <li className="dmpile">
          <span className="dmname">{t('Pile', 'Tumpukan')}</span>
          <span className="dmcount">{snap.boneyard}</span>
        </li>
      </ul>

      {over && snap.ranks && (
        <div className={`dmresult${mine && mine.rank === 1 ? ' win' : ''}`} ref={resultRef}>
          {mine && mine.rank === 1 && (
            <span className="dmconfetti" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <i key={i} style={{ left: `${4 + i * 7}%`, animationDelay: `${(i % 5) * 0.18}s` }} />
              ))}
            </span>
          )}
          <h3>{mine && mine.rank === 1 ? '🎉 ' : ''}{headline}</h3>
          <ol className="dmranks">
            {[...snap.ranks]
              .sort((a, b) => a.rank - b.rank)
              .map((r) => {
                const p = snap.players.find((x) => x.id === r.id)
                return (
                  <li key={r.id} className={r.rank === 1 ? 'first' : ''}>
                    <span className="dmrank">{r.rank}</span>
                    <span className="dmname">
                      {p?.name ?? '?'}
                      {mark(p?.name ?? '', r.id === me, t)}
                    </span>
                    <span className="dmcount">{p?.gone ? t('left', 'keluar') : `${r.count} ${t(r.count === 1 ? 'tile left' : 'tiles left', 'kartu tersisa')}`}</span>
                  </li>
                )
              })}
          </ol>
          {after}
        </div>
      )}

      <div className="dmchainwrap">
        <div className="dmchain" ref={chainRef} role="list" aria-label={t('The chain of tiles, left to right', 'Rantai kartu, dari kiri ke kanan')}>
          {empty && <span className="dmempty muted">{t('No tiles yet.', 'Belum ada kartu.')}</span>}
          {snap.chain.map((c, i) => {
            const l = c.flip ? c.tile.b : c.tile.a
            const r = c.flip ? c.tile.a : c.tile.b
            const first = i === 0
            const last = i === snap.chain.length - 1
            return (
              <div key={c.tile.id} role="listitem" className={`dmtile h${first ? ' first' : ''}${last ? ' last' : ''}`} aria-label={`${first ? `${t('left end', 'ujung kiri')}, ` : ''}${speak(l.tex)} ${t('and', 'dan')} ${speak(r.tex)}${last ? `, ${t('right end', 'ujung kanan')}` : ''}`}>
                {first && <span className="dmflag left" aria-hidden="true">◀ {t('left', 'kiri')}</span>}
                {last && <span className="dmflag right" aria-hidden="true">{t('right', 'kanan')} ▶</span>}
                <HalfView half={l} end={first ? 'left' : undefined} />
                <HalfView half={r} end={last ? 'right' : undefined} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="dmends" role="group" aria-label={t('The two ends of the chain', 'Kedua ujung rantai')}>
        {empty ? (
          <button type="button" className={`dmstart${canAct && sel !== null ? ' armed' : ''}`} disabled={!(canAct && sel !== null)} onClick={() => place('right')}>
            {canAct && sel !== null ? t('Start the chain with this tile', 'Mulai rantai dengan kartu ini') : t('The chain is empty: no ends yet', 'Rantai masih kosong: belum ada ujung')}
          </button>
        ) : (
          <>
            {endPanel('left')}
            {endPanel('right')}
          </>
        )}
      </div>
      {!empty && (
        <label className="dmhelp">
          <input type="checkbox" checked={showValue} onChange={(e) => setShowValue(e.target.checked)} /> {t('Show the value of each end (a help)', 'Tampilkan nilai tiap ujung (bantuan)')}
        </label>
      )}

      {!over && <p className={`dmstatus${myTurn ? ' mine' : ''}`}>{status}</p>}
      {/* the passing remark about the last action ("one of your tiles still fits") stays beside the status; the story of the game is under the hand */}
      <div className="dmnote" aria-live="polite" role="status">
        {refusal && refusal.why !== 'over' && refusal.n !== hideN && <p className="dmrefusal" key={`r${refusal.n}`}>{refusalText(refusal.why, t)}</p>}
      </div>
      {!over && (
        <>
          <div className="dmhandhead">
            <b>{t('Your tiles', 'Kartumu')}</b>
            <span className="dmactions">
              {snap.boneyard > 0 ? (
                <button type="button" className="btn soft sm" disabled={!canAct} onClick={() => onAct({ t: 'draw' })}>
                  {t('Draw a tile', 'Ambil kartu')} ({snap.boneyard})
                </button>
              ) : (
                <button type="button" className="btn soft sm" disabled={!canAct} onClick={() => onAct({ t: 'pass' })}>
                  {t('Pass', 'Lewati')}
                </button>
              )}
            </span>
          </div>
        </>
      )}
      <div className="dmhand" role="group" aria-label={t('Your tiles', 'Kartumu')}>
        {hand.map((tile) => (
          <button
            key={tile.id}
            type="button"
            className={`dmtile v${sel === tile.id ? ' sel' : ''}`}
            aria-pressed={sel === tile.id}
            aria-label={tileLabel(tile)}
            disabled={over}
            onClick={() => setSel((s) => (s === tile.id ? null : tile.id))}
          >
            <HalfView half={tile.a} />
            <HalfView half={tile.b} />
          </button>
        ))}
        {hand.length === 0 && !over && <span className="muted small">{t('No tiles left.', 'Tidak ada kartu lagi.')}</span>}
      </div>

      <div className="dmlog" aria-live="polite" role="log" aria-label={t('What has happened', 'Riwayat permainan')}>
        {log.map((l, i) => (
          <p key={l.key} className={i === log.length - 1 ? 'last' : ''}>
            {l.text}
          </p>
        ))}
      </div>


    </div>
  )
}

/* ------------------------------------------------------------------------------------------------ against the computer */

function Solo({ cfg, onExit }: { cfg: Settings; onExit: () => void }) {
  const { lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const [seed, setSeed] = useState(freshSeed)
  const [g, setG] = useState<Game>(() => newGame(cfg.mode, cfg.level, 2, seed))
  const gRef = useRef(g)
  const [ver, setVer] = useState(1)
  const [events, setEvents] = useState<GameEvent[]>([])
  const [refusal, setRefusal] = useState<{ n: number; why: Refusal } | null>(null)
  const rng = useRef(makeRng(seed ^ 0x9e3779b9))

  const apply = useCallback((p: number, a: Action) => {
    const r = act(gRef.current, p, a)
    if (!r.ok) {
      setRefusal((x) => ({ n: (x?.n ?? 0) + 1, why: r.reason }))
      return
    }
    gRef.current = r.g
    setG(r.g)
    setEvents(r.events)
    setRefusal(null)
    setVer((v) => v + 1)
  }, [])

  // the computer plays after a short pause, so that the player can follow
  useEffect(() => {
    if (g.status !== 'play' || g.turn !== 1) return
    const wait = ver === 1 ? 700 : 950
    const timer = window.setTimeout(() => apply(1, choose(viewOf(gRef.current, 1), cfg.strength, rng.current)), wait)
    return () => window.clearTimeout(timer)
  }, [g, ver, apply, cfg.strength])

  const again = () => {
    const s = freshSeed()
    setSeed(s)
    const ng = newGame(cfg.mode, cfg.level, 2, s)
    gRef.current = ng
    rng.current = makeRng(s ^ 0x9e3779b9)
    setG(ng)
    setEvents([])
    setRefusal(null)
    setVer(1)
  }

  const names = [t('You', 'Kamu'), t('Computer', 'Komputer')]
  const snap = useMemo(
    () => snapshotOf({ ver, phase: g.status === 'over' ? 'over' : 'play', host: 'you', mode: cfg.mode, level: cfg.level, ids: ['you', 'cpu'], names, game: g, events }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [g, ver, events, cfg.mode, cfg.level, lang],
  )
  return (
    <div>
      <div className="dmbar">
        <span className="pill brand">{lang === 'id' ? modeInfo(cfg.mode).name.id : modeInfo(cfg.mode).name.en}</span>
        <span className="pill">{t('Level', 'Tingkat')} {cfg.level}</span>
        <span className="pill">{t('Computer', 'Komputer')}: {STRENGTH_NAME[cfg.strength][lang === 'id' ? 1 : 0]}</span>
        <button type="button" className="btn ghost sm" onClick={onExit}>
          {t('Menu', 'Menu')}
        </button>
      </div>
      <Table
        snap={snap}
        hand={g.hands[0]}
        me="you"
        refusal={refusal}
        thinking={g.status === 'play' && g.turn === 1}
        onAct={(a) => apply(0, a)}
        after={
          <div className="chips">
            <button type="button" className="btn" onClick={again}>
              {t('Play again', 'Main lagi')}
            </button>
            <button type="button" className="btn ghost" onClick={onExit}>
              {t('Back to the menu', 'Kembali ke menu')}
            </button>
          </div>
        }
      />
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------ a room */

function ModePicker({ mode, level, onChange, disabled }: { mode: ModeId; level: Level; onChange: (m: ModeId, l: Level) => void; disabled?: boolean }) {
  const { lang, tc } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  return (
    <div className="dmpicker">
      <div className="dmmodes" role="group" aria-label={t('Kind of calculation', 'Jenis hitungan')}>
        {MODES.map((m) => (
          <button key={m.id} type="button" className={`dmmode${mode === m.id ? ' on' : ''}`} aria-pressed={mode === m.id} disabled={disabled} onClick={() => onChange(m.id, level)}>
            <span className="dmmodename">{tc(m.name)}</span>
            <span className="dmmodeex">
              <Tex src={localTex(m.example[0], lang)} /> <span aria-hidden="true">=</span> <Tex src={localTex(m.example[1], lang)} />
            </span>
          </button>
        ))}
      </div>
      <p className="small muted dmmodeabout">
        <Rich text={`${tc(modeInfo(mode).about)} ${tc(modeInfo(mode).range)}.`} />
      </p>
      <div className="chips" role="group" aria-label={t('Level of the calculations', 'Tingkat soal')}>
        <span className="small muted">{t('Level', 'Tingkat')}</span>
        {([1, 2, 3] as Level[]).map((lv) => (
          <button key={lv} type="button" className={`chip${level === lv ? ' on' : ''}`} aria-pressed={level === lv} disabled={disabled} onClick={() => onChange(mode, lv)}>
            {lv} · {LEVEL_NAME[lv][lang === 'id' ? 1 : 0]}
          </button>
        ))}
      </div>
    </div>
  )
}

function Room({ code, session, onExit }: { code: string; session: Session; onExit: () => void }) {
  const { lang, tc } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const view = useSyncExternalStore(session.subscribe.bind(session), () => session.view())
  const [copied, setCopied] = useState(false)
  const host = session.isHost ? (session as HostSession) : null

  useEffect(() => {
    const bye = () => session.leave()
    window.addEventListener('pagehide', bye)
    return () => {
      window.removeEventListener('pagehide', bye)
      session.leave()
    }
  }, [session])

  const snap = view.snap
  const link = view.link
  const problem =
    link === 'notfound'
      ? t('No room with that code answered. Check the code, and that the host is still there.', 'Tidak ada ruangan dengan kode itu yang menjawab. Periksa kodenya, dan apakah tuan rumahnya masih ada.')
      : link === 'full'
        ? t(`The room is full (${MAX_PLAYERS} players).`, `Ruangannya penuh (${MAX_PLAYERS} pemain).`)
        : link === 'started'
          ? t('The game in that room has already started.', 'Permainan di ruangan itu sudah dimulai.')
          : link === 'out'
            ? t('You were away when your turn came, so you are out of this game.', 'Giliranmu tiba saat kamu tidak ada, jadi kamu keluar dari permainan ini.')
            : link === 'closed'
              ? t('The host left, so the room is closed.', 'Tuan rumah keluar, jadi ruangan ditutup.')
              : ''
  if (problem) {
    return (
      <div className="dmnotice" role="alert">
        <p>{problem}</p>
        <button type="button" className="btn" onClick={onExit}>
          {t('Back to the menu', 'Kembali ke menu')}
        </button>
      </div>
    )
  }
  if (!snap) {
    return (
      <p className="dmnotice" role="status">
        {t('Connecting to the room…', 'Menyambung ke ruangan…')}
      </p>
    )
  }

  const shareLink = `${window.location.origin}${window.location.pathname}?room=${code}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* no clipboard: the code is on the screen */
    }
  }

  if (snap.phase === 'lobby') {
    const canStart = host?.canStart() ?? false
    return (
      <div className="dmlobby">
        <div className="dmcode">
          <span className="small muted">{t('Room code', 'Kode ruangan')}</span>
          <b aria-label={code.split('').join(' ')}>{code}</b>
          <button type="button" className="btn ghost sm" onClick={copy}>
            {copied ? t('Link copied', 'Link disalin') : t('Copy the link', 'Salin link')}
          </button>
        </div>
        {host ? (
          <p className="small muted">{t(`Friends join with this code or this link. ${MIN_PLAYERS} to ${MAX_PLAYERS} players.`, `Teman bergabung dengan kode atau link ini. ${MIN_PLAYERS} sampai ${MAX_PLAYERS} pemain.`)}</p>
        ) : (
          <p className="dmnotice" role="status">
            <b>{t('You are in!', 'Kamu sudah masuk!')}</b> {t('Wait here: the host will start the game, and it begins by itself on this screen.', 'Tunggu di sini: tuan rumah akan memulai permainan, dan permainan langsung muncul di layar ini.')}
          </p>
        )}
        <h3>
          {t('Players', 'Pemain')} ({snap.players.length}/{MAX_PLAYERS})
        </h3>
        <ul className="dmplayers lobby">
          {snap.players.map((p) => (
            <li key={p.id} className={`dmplayer${p.id === view.me ? ' me' : ''}`}>
              <span className="dmname">
                {p.name}
                {mark(p.name, p.id === view.me, t)}
              </span>
              {p.id === snap.host && <span className="pill brand">{t('Host', 'Tuan rumah')}</span>}
            </li>
          ))}
        </ul>
        {host ? (
          <>
            <ModePicker mode={snap.mode} level={snap.level} onChange={(m, l) => host.configure(m, l)} />
            <div className="chips">
              <button type="button" className="btn" disabled={!canStart} onClick={() => host.start()}>
                {t('Start the game', 'Mulai permainan')}
              </button>
              {!canStart && <span className="small muted">{t('Wait for at least one more player.', 'Tunggu sedikitnya satu pemain lagi.')}</span>}
            </div>
          </>
        ) : (
          <p>
            {t('You will play:', 'Yang akan dimainkan:')} <b>{tc(modeInfo(snap.mode).name)}</b> · {t('Level', 'Tingkat')} {snap.level}.
          </p>
        )}
        <button type="button" className="btn ghost sm" onClick={onExit}>
          {t('Leave the room', 'Keluar dari ruangan')}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="dmbar">
        <span className="pill brand">{tc(modeInfo(snap.mode).name)}</span>
        <span className="pill">
          {t('Room', 'Ruangan')} {code}
        </span>
        <button type="button" className="btn ghost sm" onClick={onExit}>
          {t('Leave', 'Keluar')}
        </button>
        {!host && snap.phase === 'play' && <span className="small muted">{t(`Left by accident? Join again with code ${code} before your turn comes.`, `Keluar tidak sengaja? Gabung lagi dengan kode ${code} sebelum gilirannya tiba.`)}</span>}
      </div>
      {link === 'lost' && (
        <p className="dmnotice warn" role="alert">
          {t('The connection to the host is lost. Waiting for it to come back…', 'Sambungan ke tuan rumah terputus. Menunggu sambungan kembali…')}
        </p>
      )}
      <Table
        snap={snap}
        hand={view.hand}
        me={view.me}
        waiting={view.waiting}
        refusal={view.refusal}
        onAct={(a) => session.act(a)}
        after={
          host ? (
            <div className="chips">
              <button type="button" className="btn" onClick={() => host.again()}>
                {t('Play again with the same players', 'Main lagi dengan pemain yang sama')}
              </button>
              <button type="button" className="btn ghost" onClick={onExit}>
                {t('Close the room', 'Tutup ruangan')}
              </button>
            </div>
          ) : (
            <div className="chips">
              <span className="small muted">{t('Waiting for the host to start another game…', 'Menunggu tuan rumah memulai permainan lagi…')}</span>
              <button type="button" className="btn ghost sm" onClick={onExit}>
                {t('Leave', 'Keluar')}
              </button>
            </div>
          )
        }
      />
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------ the menu */

type Stage = { k: 'menu' } | { k: 'solo'; cfg: Settings } | { k: 'room'; code: string; session: Session }

export default function DominoGame() {
  const { lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const [stage, setStage] = useState<Stage>({ k: 'menu' })
  const [cfg, setCfg] = useState<Settings>(readSettings)
  const [code, setCode] = useState(() => {
    try {
      return (new URLSearchParams(window.location.search).get('room') ?? '').slice(0, 8).toUpperCase()
    } catch {
      return ''
    }
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const online = onlineAvailable()
  // a link with a room code in it (an invitation) opens a screen with nothing but the room, a name and one button; the rest of the menu is a small link away
  const [invited, setInvited] = useState(() => online && parseRoomCode(code) !== null)

  const update = (patch: Partial<Settings>) =>
    setCfg((c) => {
      const next = { ...c, ...patch }
      writeSettings(next)
      return next
    })
  const myName = () => cleanName(cfg.name, guestName(lang))

  const make = async () => {
    setBusy(true)
    setError('')
    try {
      const { code: c, session } = await hostRoom(myName(), cfg.mode, cfg.level)
      setStage({ k: 'room', code: c, session })
    } catch {
      setError(t('Could not reach the game server. Check your connection and try again.', 'Tidak bisa tersambung ke server permainan. Periksa koneksimu dan coba lagi.'))
    } finally {
      setBusy(false)
    }
  }
  const join = async () => {
    setBusy(true)
    setError('')
    try {
      const parsed = parseRoomCode(code)
      const joined = await joinRoom(code, myName(), (parsed && seatFor(parsed)) || randomId())
      if (joined) {
        rememberSeat(joined.code, joined.session.me)
        setInvited(false)
      }
      if (!joined) setError(t('A room code has 4 letters and digits, like K7QF.', 'Kode ruangan terdiri dari 4 huruf dan angka, seperti K7QF.'))
      else setStage({ k: 'room', code: joined.code, session: joined.session })
    } catch {
      setError(t('Could not reach the game server. Check your connection and try again.', 'Tidak bisa tersambung ke server permainan. Periksa koneksimu dan coba lagi.'))
    } finally {
      setBusy(false)
    }
  }

  if (stage.k === 'solo') return <section className="dmgame" aria-label={t('Math Domino', 'Domino Matematika')}><Solo cfg={stage.cfg} onExit={() => setStage({ k: 'menu' })} /></section>
  if (stage.k === 'room') return <section className="dmgame" aria-label={t('Math Domino', 'Domino Matematika')}><Room code={stage.code} session={stage.session} onExit={() => setStage({ k: 'menu' })} /></section>

  if (invited) {
    return (
      <section className="dmgame" aria-label={t('Math Domino', 'Domino Matematika')}>
        <InviteCard
          lang={lang}
          game={t('Math Domino', 'Domino Matematika')}
          code={parseRoomCode(code) as string}
          name={cfg.name}
          placeholder={t('Your name', 'Namamu')}
          how={t('When it is your turn, tap one of your tiles, then tap the end of the chain where it goes.', 'Saat giliranmu, ketuk salah satu kartumu, lalu ketuk ujung rantai tempat memasangnya.')}
          busy={busy}
          error={error}
          onName={(name) => update({ name })}
          onJoin={() => void join()}
          onMore={() => setInvited(false)}
        />
      </section>
    )
  }

  return (
    <section className="dmgame" aria-label={t('Math Domino', 'Domino Matematika')}>
      <h2 className="dmh">{t('1. Choose the calculations', '1. Pilih jenis hitungan')}</h2>
      <ModePicker mode={cfg.mode} level={cfg.level} onChange={(mode, level) => update({ mode, level })} />

      <div className="dmways">
        <div className="dmway">
          <h2 className="dmh">{t('2a. Play against the computer', '2a. Lawan komputer')}</h2>
          <div className="chips" role="group" aria-label={t('How strong the computer is', 'Seberapa kuat komputernya')}>
            <span className="small muted">{t('Computer', 'Komputer')}</span>
            {STRENGTHS.map((s) => (
              <button key={s} type="button" className={`chip${cfg.strength === s ? ' on' : ''}`} aria-pressed={cfg.strength === s} onClick={() => update({ strength: s })}>
                {STRENGTH_NAME[s][lang === 'id' ? 1 : 0]}
              </button>
            ))}
          </div>
          <button type="button" className="btn" onClick={() => setStage({ k: 'solo', cfg })}>
            {t('Play', 'Main')}
          </button>
        </div>

        <div className="dmway">
          <h2 className="dmh">{t(`2b. Play online, ${MIN_PLAYERS} to ${MAX_PLAYERS} players`, `2b. Main online, ${MIN_PLAYERS} sampai ${MAX_PLAYERS} pemain`)}</h2>
          {online ? (
            <>
              <label className="dmfield">
                <span className="small muted">{t('Your name', 'Namamu')}</span>
                <input type="text" value={cfg.name} maxLength={NAME_MAX} placeholder={t('Player', 'Pemain')} autoComplete="nickname" onChange={(e) => update({ name: e.target.value })} />
              </label>
              <div className="chips">
                <button type="button" className="btn" disabled={busy} onClick={make}>
                  {t('Make a room', 'Buat ruangan')}
                </button>
              </div>
              <label className="dmfield">
                <span className="small muted">{t('Or join with a code', 'Atau gabung dengan kode')}</span>
                <span className="dmjoin">
                  <input type="text" value={code} maxLength={8} placeholder="K7QF" inputMode="text" autoCapitalize="characters" autoComplete="off" spellCheck={false} onChange={(e) => setCode(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && code && !busy && join()} />
                  <button type="button" className="btn soft" disabled={busy || !code} onClick={join}>
                    {t('Join', 'Gabung')}
                  </button>
                </span>
              </label>
              <p className="small muted">{t('Only the name you type is shared with the other players. Nothing is saved on a server.', 'Hanya nama yang kamu ketik yang dibagikan ke pemain lain. Tidak ada yang disimpan di server.')}</p>
            </>
          ) : (
            <p className="small muted">{t('Online play needs the website’s game server, which this copy does not have. Playing against the computer works everywhere.', 'Main online memerlukan server permainan situs ini, yang tidak ada di salinan ini. Melawan komputer bisa di mana saja.')}</p>
          )}
          {busy && <p role="status" className="small muted">{t('Connecting…', 'Menyambung…')}</p>}
          {error && <p role="alert" className="dmerror">{error}</p>}
        </div>
      </div>
    </section>
  )
}
