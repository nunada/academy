import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useI18n } from '../../i18n'
import {
  AWAY_GRACE_S,
  CELLS,
  CONFIRM_SECONDS,
  FACTORS,
  MAX_LEVEL,
  SIZE,
  TIME_DEFAULT,
  TIME_MAX,
  TIME_MIN,
  claim,
  clampTime,
  coin,
  countOf,
  decide,
  decideFirst,
  makeRng,
  newGame,
  openCells,
  other,
  resultOf,
  setPawn,
  symbol,
  timeUp,
  wouldWin,
  type Color,
  type Game,
  type Op,
  type Refusal,
  type Rng,
} from '../../lib/rumah'
import { NAME_MAX, cleanName, parseRoomCode, type NetEvent, type Session, type Snapshot } from '../../lib/rumahnet'
import { hostRoom, joinRoom, onlineAvailable } from '../../lib/rumahrealtime'
import { randomId } from '../../lib/dominorealtime'
import InviteCard from './InviteCard'

/* ------------------------------------------------------------------------------------------------ settings */

type Mode = 'solo' | 'duo' | 'online'
interface Settings {
  mode: Mode
  name: string
  name2: string
  level: number
  /** the "already memorised" mode: no help with the result */
  hafalan: boolean
  timeOn: boolean
  seconds: number
}
const FRESH: Settings = { mode: 'solo', name: '', name2: '', level: 0, hafalan: true, timeOn: false, seconds: TIME_DEFAULT }
const key = (op: Op, what: string) => `nunada.rumah.${op}.${what}`
function readSettings(op: Op): Settings {
  try {
    const v = JSON.parse(localStorage.getItem(key(op, 'v1')) ?? 'null') as Partial<Settings> | null
    if (!v || typeof v !== 'object') return FRESH
    return {
      mode: v.mode === 'solo' || v.mode === 'duo' || v.mode === 'online' ? v.mode : FRESH.mode,
      name: typeof v.name === 'string' ? cleanName(v.name, '') : '',
      name2: typeof v.name2 === 'string' ? cleanName(v.name2, '') : '',
      level: typeof v.level === 'number' && Number.isInteger(v.level) && v.level >= 0 && v.level <= MAX_LEVEL ? v.level : FRESH.level,
      hafalan: typeof v.hafalan === 'boolean' ? v.hafalan : FRESH.hafalan,
      timeOn: typeof v.timeOn === 'boolean' ? v.timeOn : FRESH.timeOn,
      seconds: typeof v.seconds === 'number' ? clampTime(v.seconds) : FRESH.seconds,
    }
  } catch {
    return FRESH
  }
}
function writeSettings(op: Op, s: Settings) {
  try {
    localStorage.setItem(key(op, 'v1'), JSON.stringify(s))
  } catch {
    /* a private window: the game works the same without remembered settings */
  }
}
/** The highest computer level that is open: winning a level opens the next one. */
function readUnlocked(op: Op): number {
  try {
    const v = Number(localStorage.getItem(key(op, 'unlocked')))
    return Number.isInteger(v) && v >= 0 && v <= MAX_LEVEL ? v : 0
  } catch {
    return 0
  }
}
function writeUnlocked(op: Op, level: number) {
  try {
    localStorage.setItem(key(op, 'unlocked'), String(level))
  } catch {
    /* ignore */
  }
}
/** The seat a guest had in a room is remembered in this tab, so that a player who left or lost the page can come back to it. */
function seatFor(op: Op, code: string): string | undefined {
  try {
    const v = JSON.parse(sessionStorage.getItem(key(op, 'seat')) ?? 'null') as { code?: unknown; id?: unknown } | null
    return v && v.code === code && typeof v.id === 'string' && /^[a-z0-9]{10}$/.test(v.id) ? v.id : undefined
  } catch {
    return undefined
  }
}
const rememberedRoom = (op: Op): string | null => {
  try {
    const v = JSON.parse(sessionStorage.getItem(key(op, 'seat')) ?? 'null') as { code?: unknown } | null
    return v && typeof v.code === 'string' ? v.code : null
  } catch {
    return null
  }
}
function rememberSeat(op: Op, code: string | null, id?: string): void {
  try {
    if (code && id) sessionStorage.setItem(key(op, 'seat'), JSON.stringify({ code, id }))
    else sessionStorage.removeItem(key(op, 'seat'))
  } catch {
    /* without it the player comes back as a new player, which is only possible in the lobby */
  }
}
const freshSeed = () => Math.floor(Math.random() * 2 ** 31)

type T = (en: string, id: string) => string

/* ------------------------------------------------------------------------------------------------ words */

const LEVEL_TEXT: { name: [string, string]; about: [string, string] }[] = [
  {
    name: ['Taught by the AI', 'Diajari AI'],
    about: ['The computer moves at random and the help with the result is always shown, whatever you chose. A good level for learning the rules.', 'Komputer bergerak acak dan bantuan hasilnya selalu ditampilkan, apa pun pilihanmu. Cocok untuk belajar aturan main.'],
  },
  {
    name: ['Random moves', 'Gerakan acak'],
    about: ['The computer still moves at random, but the help now follows your own setting (hidden at first), so it is harder even though the opponent is just as weak.', 'Komputer tetap bergerak acak, tetapi bantuan kini mengikuti pengaturanmu sendiri (awalnya disembunyikan), jadi lebih sulit walau lawannya sama lemahnya.'],
  },
  {
    name: ['Defending', 'Bertahan'],
    about: ['The computer moves at random, but it always takes a win that is free, and always blocks you when you are about to win.', 'Komputer bergerak acak, tetapi selalu mengambil kemenangan gratis dan selalu memblokir saat kamu hampir menang.'],
  },
  {
    name: ['Mixed', 'Campuran'],
    about: ['It always wins and blocks as level 2 does, and half of the time it also avoids leaving a pawn number that gives you a win.', 'Selalu menang dan memblokir seperti Level 2, dan separuh waktu ia juga menghindari meninggalkan angka pion yang menguntungkanmu.'],
  },
  {
    name: ['Careful', 'Terhitung'],
    about: ['As level 3, and now it ALWAYS avoids leaving a pawn number that gives you a win, not only half of the time.', 'Seperti Level 3, dan kini ia SELALU menghindari meninggalkan angka pion yang menguntungkanmu, tidak lagi separuh waktu.'],
  },
  {
    name: ['Genius', 'Genius'],
    about: ['As careful as level 4, but at every safe move it builds threats of its own instead of choosing at random. It tries never to give you a chance to win.', 'Sama waspadanya dengan Level 4, tetapi di setiap langkah aman ia membangun ancamannya sendiri, bukan memilih asal. Ia berusaha tidak pernah memberimu kesempatan menang.'],
  },
]

const colorName = (c: Color, t: T) => (c === 'blue' ? t('Blue', 'Biru') : t('Yellow', 'Kuning'))
const markOf = (c: Color) => (c === 'blue' ? '●' : '◆')

function refusalText(why: Refusal, t: T): string {
  switch (why) {
    case 'same':
      return t('Pick a different number: a pawn must move.', 'Pilih angka lain: pion wajib berpindah.')
    case 'moved':
      return t('Your pawn has moved already. Now pick a cell of the board.', 'Pionmu sudah pindah. Sekarang pilih petak di papan.')
    case 'not-moved':
      return t('Move your pawn to another number first, then pick the cell.', 'Pindahkan dulu pionmu ke angka lain, baru pilih petaknya.')
    case 'taken':
      return t('That cell is already taken. Pick another one.', 'Petak itu sudah terisi. Pilih petak lain.')
    case 'turn':
      return t('It is not your turn yet.', 'Belum giliranmu.')
    case 'not-set':
      return t('Place both pawns first.', 'Tempatkan kedua pion dulu.')
    default:
      return t('That did not work. Try again.', 'Itu tidak bisa. Coba lagi.')
  }
}

function lineWord(line: number[], t: T): string {
  if (line.length < 2) return ''
  const d = line[1] - line[0]
  return d === 1 ? t('across', 'mendatar') : d === SIZE ? t('down', 'menurun') : t('diagonally', 'miring')
}

function eventText(e: NetEvent, name: (c: Color) => string, t: T, op: Op): string {
  switch (e.k) {
    case 'pawn':
      return e.start
        ? t(`${name(e.c)} put the ${colorName(e.pawn, t).toLowerCase()} pawn on ${e.n}.`, `${name(e.c)} menaruh pion ${colorName(e.pawn, t).toLowerCase()} di ${e.n}.`)
        : t(`${name(e.c)} moved the pawn to ${e.n}.`, `${name(e.c)} memindahkan pion ke ${e.n}.`)
    case 'claim':
      return t(`${name(e.c)} took a ${e.v}.`, `${name(e.c)} mengambil petak ${e.v}.`)
    case 'pass':
      return t(`Every ${e.v} is already taken, so the turn of ${name(e.c)} passes.`, `Semua petak ${e.v} sudah terisi, jadi giliran ${name(e.c)} dilewati.`)
    case 'wrong':
      return t(`${name(e.c)} picked a cell that does not hold the ${op === 'times' ? 'product' : 'sum'}.`, `${name(e.c)} memilih petak yang bukan hasil ${op === 'times' ? 'kali' : 'jumlah'}.`)
    case 'line':
      return t(`${name(e.c)} made four in a row!`, `${name(e.c)} membuat 4 bidak sejajar!`)
    case 'full':
      return t('The board is full.', 'Papan sudah penuh.')
    case 'time':
      return t(`${name(e.c)} ran out of time.`, `Waktu ${name(e.c)} habis.`)
    case 'missed':
      return t(`${name(e.c)} did not come back before the turn was lost.`, `${name(e.c)} tidak kembali sebelum gilirannya terlewat.`)
    case 'away':
      return t(`${name(e.c)} stepped away, and can still come back until the turn is missed.`, `${name(e.c)} keluar dulu. Ia masih bisa kembali selama gilirannya belum terlewat.`)
    case 'back':
      return t(`${name(e.c)} is back.`, `${name(e.c)} kembali.`)
  }
}

/* ------------------------------------------------------------------------------------------------ small hooks */

/** Re-render about every `ms` while `on`, for countdowns. */
function useNow(on: boolean, ms = 250): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!on) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), ms)
    return () => window.clearInterval(id)
  }, [on, ms])
  return now
}

/** What a countdown that was `left` ms when it was `at` shows now. */
const remaining = (left: number | null, at: number, now: number, running: boolean): number | null => (left === null ? null : running ? Math.max(0, left - (now - at)) : left)

/* ------------------------------------------------------------------------------------------------ the table */

interface TimerInfo {
  /** seconds a turn may take, null for no limit */
  limit: number | null
  /** ms left at `at` */
  left: number | null
  held: boolean
  at: number
}
interface TableProps {
  op: Op
  game: Game
  names: Record<Color, string>
  /** the colours this screen plays for: one in a game against the computer or online, both on one screen */
  mine: Color[]
  /** the computer is thinking */
  thinking?: boolean
  away?: Record<Color, boolean>
  /** ms left before the player who is away loses their turn, at `timer.at` */
  awayLeft?: number | null
  timer: TimerInfo
  /** what happened: a new array (with a new `ver`) per step */
  ver: number
  events: NetEvent[]
  refusal?: { n: number; why: Refusal } | null
  waiting?: boolean
  /** show the help with the result at first */
  help: boolean
  /** the help is always on (level 0) */
  helpLocked?: boolean
  onPawn: (n: number) => void
  onClaim: (i: number) => void
  onHold: (on: boolean) => void
  /** what to show under the result of a finished game */
  after?: ReactNode
  /** who the celebration is for: the winner, if this screen's player is the winner */
  celebrate: boolean
}

function Table({ op, game, names, mine, thinking, away, awayLeft, timer, ver, events, refusal, waiting, help, helpLocked, onPawn, onClaim, onHold, after, celebrate }: TableProps) {
  const { lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const [showHelp, setShowHelp] = useState(help)
  const [pending, setPending] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(CONFIRM_SECONDS)
  const [note, setNote] = useState<{ n: number; text: string } | null>(null)
  const [hideN, setHideN] = useState(0)
  const [log, setLog] = useState<{ key: number; text: string }[]>([])
  const lastVer = useRef(-1)
  const resultRef = useRef<HTMLDivElement>(null)
  const over = game.status === 'over'
  const my = mine.includes(game.current)
  const canAct = !over && my && !thinking && !waiting
  const helping = helpLocked || showHelp
  const value = resultOf(game)
  const open = useMemo(() => new Set(game.moved && value !== null ? openCells(game) : []), [game, value])
  const nameOf = useCallback((c: Color) => names[c], [names])
  const sym = symbol(op)

  // the story of the game, the last few lines
  useEffect(() => {
    if (ver === lastVer.current) return
    lastVer.current = ver
    const lines = events.map((e) => eventText(e, nameOf, t, op))
    if (lines.length) setLog((prev) => [...prev, ...lines.map((text, i) => ({ key: ver * 10 + i, text }))].slice(-4))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ver])

  // a note of this screen (the same number, a cell already taken) goes after a few seconds
  const say = useCallback((text: string) => setNote((x) => ({ n: (x?.n ?? 0) + 1, text })), [])
  useEffect(() => {
    if (!note) return
    const n = note.n
    const id = window.setTimeout(() => setHideN(n), 4000)
    return () => window.clearTimeout(id)
  }, [note])
  const refusalSeen = useRef(0)
  useEffect(() => {
    if (refusal && refusal.n !== refusalSeen.current) {
      refusalSeen.current = refusal.n
      say(refusalText(refusal.why, t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refusal])

  // the five seconds to undo a click on the board
  useEffect(() => {
    if (pending === null) return
    if (!canAct && !over) {
      // the turn moved away from under the click (the referee ended it)
      setPending(null)
      return
    }
    if (secondsLeft <= 0) {
      const i = pending
      setPending(null)
      onClaim(i)
      return
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, secondsLeft])
  useEffect(() => {
    if (over && pending !== null) setPending(null)
  }, [over, pending])

  // the result is next to the board: bring it into view when the game ends
  useEffect(() => {
    if (over) resultRef.current?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [over])

  const ticking = timer.left !== null || (awayLeft ?? null) !== null
  const now = useNow(!over && ticking)
  const left = remaining(timer.left, timer.at, now, !timer.held)
  const awayMs = remaining(awayLeft ?? null, timer.at, now, true)

  const pawnClick = (n: number) => {
    if (!canAct || pending !== null) return
    if (game.moved) {
      say(refusalText('moved', t))
      return
    }
    if (!game.placing && game.pawn[game.current] === n) {
      say(refusalText('same', t))
      return
    }
    onPawn(n)
  }
  const cellClick = (i: number) => {
    if (!canAct || pending !== null) return
    if (game.placing || value === null) {
      say(refusalText('not-set', t))
      return
    }
    if (!game.moved) {
      say(refusalText('not-moved', t))
      return
    }
    if (game.board[i].owner !== null) {
      say(refusalText('taken', t))
      return
    }
    setSecondsLeft(CONFIRM_SECONDS)
    setPending(i)
    onHold(true)
  }
  const undo = () => {
    setPending(null)
    onHold(false)
  }
  const keep = () => {
    if (pending === null) return
    const i = pending
    setPending(null)
    onClaim(i)
  }

  const cur = game.current
  const status = over
    ? ''
    : thinking
      ? t('The computer is thinking…', 'Komputer sedang berpikir…')
      : !my
        ? t(`Waiting for ${names[cur]}…`, `Menunggu ${names[cur]}…`)
        : game.placing
          ? game.pending.blue === null
            ? t(`${names[cur]}, you start: put the ${colorName('blue', t).toLowerCase()} pawn on a number below.`, `${names[cur]}, kamu mulai: taruh pion ${colorName('blue', t).toLowerCase()} pada sebuah angka di bawah.`)
            : t(`Now put the ${colorName('gold', t).toLowerCase()} pawn on a number.`, `Sekarang taruh pion ${colorName('gold', t).toLowerCase()} pada sebuah angka.`)
          : !game.moved
            ? t(`${names[cur]}: move the ${colorName(cur, t).toLowerCase()} pawn to another number.`, `${names[cur]}: pindahkan pion ${colorName(cur, t).toLowerCase()} ke angka lain.`)
            : pending !== null
              ? t('Are you sure about this cell?', 'Yakin dengan petak ini?')
              : t(`Now pick a cell of the board that holds ${helping ? 'the result' : `${game.pawn.blue} ${sym} ${game.pawn.gold}`}.`, `Sekarang pilih petak di papan yang berisi hasil ${helping ? 'itu' : `${game.pawn.blue} ${sym} ${game.pawn.gold}`}.`)

  const opponentAway = away && mine.length === 1 && away[other(mine[0])]
  const curAway = away && !over && away[cur]
  const winnerName = game.winner ? names[game.winner] : ''
  const loser = game.winner ? other(game.winner) : null
  const loserName = loser ? names[loser] : ''
  const headline = !over ? '' : game.winner === null ? t('A draw!', 'Seri!') : celebrate ? t('You win!', 'Kamu menang!') : t(`${winnerName} wins!`, `${winnerName} menang!`)
  const cause = !over
    ? ''
    : game.why === 'line'
      ? t(`Four in a row, ${lineWord(game.line, t)}.`, `4 bidak sejajar, ${lineWord(game.line, t)}.`)
      : game.why === 'full'
        ? t('The board is full and nobody made four in a row.', 'Papan penuh dan tidak ada yang membuat 4 sejajar.')
        : game.why === 'wrong-cell'
          ? t(`${loserName} picked a cell that does not hold the ${op === 'times' ? 'product' : 'sum'} of the pawns and did not undo it in ${CONFIRM_SECONDS} seconds.`, `${loserName} memilih petak yang bukan hasil ${op === 'times' ? 'kali' : 'jumlah'} kedua pion dan tidak membatalkannya dalam ${CONFIRM_SECONDS} detik.`)
          : game.why === 'time'
            ? t(`The time of ${loserName} ran out.`, `Waktu ${loserName} habis.`)
            : t(`${loserName} did not come back before the turn was lost.`, `${loserName} tidak kembali sebelum gilirannya terlewat.`)

  const noteShown = note && note.n !== hideN ? note.text : null
  const cellLabel = (i: number) => {
    const c = game.board[i]
    const row = Math.floor(i / SIZE) + 1
    const col = (i % SIZE) + 1
    const state = c.owner ? t(`taken by ${colorName(c.owner, t)}`, `diambil ${colorName(c.owner, t)}`) : t('free', 'kosong')
    return t(`Row ${row}, column ${col}: ${c.value}, ${state}`, `Baris ${row}, kolom ${col}: ${c.value}, ${state}`)
  }
  const strip = (c: Color) => (game.placing ? game.pending[c] : game.pawn[c])

  return (
    <div className={`rhtable${over ? ' rhover' : ''}`}>
      <ul className="rhscore" aria-label={t('Players', 'Pemain')}>
        {(['blue', 'gold'] as Color[]).map((c) => (
          <li key={c} className={`rhplayer ${c}${!over && c === cur ? ' turn' : ''}${away?.[c] ? ' away' : ''}`} aria-current={!over && c === cur ? 'true' : undefined}>
            <span className={`rhmark ${c}`} aria-hidden="true">
              {markOf(c)}
            </span>
            <span className="rhname">
              {names[c]}
              <span className="small muted"> ({colorName(c, t)})</span>
            </span>
            <span className="rhcount">
              <b>{countOf(game, c)}</b> {t('cells', 'petak')}
            </span>
            {away?.[c] && <span className="pill">{t('away', 'keluar dulu')}</span>}
            {!over && c === cur && !away?.[c] && <span className="pill brand">{t('Turn', 'Giliran')}</span>}
          </li>
        ))}
      </ul>

      {over && (
        <div className={`dmresult${celebrate ? ' win' : ''}`} ref={resultRef}>
          {celebrate && (
            <span className="dmconfetti" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <i key={i} style={{ left: `${4 + i * 7}%`, animationDelay: `${(i % 5) * 0.18}s` }} />
              ))}
            </span>
          )}
          <h3>
            {celebrate ? '🎉 ' : ''}
            {headline}
          </h3>
          <p>{cause}</p>
          {after}
        </div>
      )}

      {!over && left !== null && timer.limit !== null && (
        <div className={`rhtimer${left < 10000 ? ' low' : ''}${timer.held ? ' held' : ''}`} role="timer" aria-label={t('Time left for this turn', 'Sisa waktu giliran ini')}>
          <span className="rhtimerfill" style={{ width: `${Math.min(100, (left / (timer.limit * 1000)) * 100)}%` }} />
          <span className="rhtimertext">
            {Math.ceil(left / 1000)} {t('s', 'dtk')}
          </span>
        </div>
      )}
      {!over && opponentAway && !curAway && <p className="dmnotice warn">{t('Your opponent stepped away. They can still come back as long as they have not missed their turn: go on playing.', 'Lawan sedang keluar. Ia masih bisa kembali selama belum melewatkan gilirannya: silakan lanjut main.')}</p>}
      {!over && curAway && awayMs !== null && (
        <p className="dmnotice warn" role="status">
          {t(`${names[cur]} is away and it is their turn. Waiting for them to come back: ${Math.ceil(awayMs / 1000)} s (at most ${AWAY_GRACE_S} s).`, `${names[cur]} sedang keluar dan sekarang gilirannya. Menunggu ia kembali: ${Math.ceil(awayMs / 1000)} dtk (paling lama ${AWAY_GRACE_S} dtk).`)}
        </p>
      )}

      <p className={`rhstatus${canAct ? ' mine' : ''}`} aria-live="polite">
        {status}
      </p>

      <div className="rhstripbox">
        <p className="rhlabel">
          {op === 'times' ? t('Factor strip: pick the number for the pawn (1 to 9)', 'Papan faktor: pilih angka untuk pion (1 sampai 9)') : t('Number strip: pick the number for the pawn (1 to 9)', 'Papan angka: pilih angka untuk pion (1 sampai 9)')}
        </p>
        <div className="rhstrip" role="group" aria-label={t('Numbers for the pawns', 'Angka untuk pion')}>
          {Array.from({ length: FACTORS }, (_, k) => k + 1).map((n) => {
            // the pawn moves once a turn: the place it left, and every other place, is shut until the turn is over
            const movable = canAct && pending === null && !game.moved && (game.placing || game.pawn[cur] !== n)
            return (
              <button
                key={n}
                type="button"
                className={`rhpawn${movable ? ' movable' : ''}`}
                disabled={!movable}
                onClick={() => pawnClick(n)}
                aria-label={`${n}${strip('blue') === n ? `, ${t('blue pawn', 'pion biru')}` : ''}${strip('gold') === n ? `, ${t('yellow pawn', 'pion kuning')}` : ''}`}
              >
                <span className="rhpawnn">{n}</span>
                <span className="rhpawnm" aria-hidden="true">
                  {strip('blue') === n && <span className="rhmark blue">●</span>}
                  {strip('gold') === n && <span className="rhmark gold">◆</span>}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="rhsum" aria-live="polite">
        {value !== null && game.pawn.blue !== null && game.pawn.gold !== null ? (
          <>
            <span className="rhmark blue" aria-hidden="true">●</span> {t('Blue', 'Biru')} ({game.pawn.blue}) {sym} <span className="rhmark gold" aria-hidden="true">◆</span> {t('Yellow', 'Kuning')} ({game.pawn.gold}) = <b>{helping ? value : '?'}</b>
          </>
        ) : (
          t('Put both pawns on a number to begin', 'Tempatkan kedua pion untuk memulai')
        )}
      </p>

      {pending !== null && (
        <div className="rhconfirm" role="group" aria-label={t('Confirm the cell', 'Konfirmasi petak')}>
          <p>
            <b>{t('Are you sure about this cell?', 'Yakin dengan petak ini?')}</b>{' '}
            <span className="small muted">{t(`It goes on by itself in ${secondsLeft} s. A cell that is not the result loses the game.`, `Lanjut otomatis dalam ${secondsLeft} dtk. Petak yang bukan hasilnya membuatmu kalah.`)}</span>
          </p>
          <div className="chips">
            <button type="button" className="btn" onClick={keep}>
              {t('Sure', 'Yakin')}
            </button>
            <button type="button" className="btn ghost" onClick={undo}>
              {t('Undo', 'Undo')}
            </button>
          </div>
        </div>
      )}

      <div className="rhboard" role="group" aria-label={op === 'times' ? t('The board of products', 'Papan hasil kali') : t('The board of sums', 'Papan hasil jumlah')}>
        {game.board.map((c, i) => {
          const free = c.owner === null
          const hint = helping && canAct && open.has(i) && pending === null
          const winCell = over && game.winner && game.line.includes(i)
          return (
            <button
              key={i}
              type="button"
              className={`rhcell${c.owner ? ` own ${c.owner}` : ''}${hint ? ' hint' : ''}${pending === i ? ` pending ${cur}` : ''}${winCell ? ' winc' : ''}${i === (CELLS - 1) / 2 ? ' mid' : ''}`}
              disabled={!free || !canAct || pending !== null}
              aria-label={cellLabel(i)}
              onClick={() => cellClick(i)}
            >
              <span>{c.value}</span>
              {c.owner && (
                <span className={`rhmark ${c.owner}`} aria-hidden="true">
                  {markOf(c.owner)}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="rhfoot">
        {!helpLocked && (
          <label className="dmhelp">
            <input type="checkbox" checked={showHelp} onChange={(e) => setShowHelp(e.target.checked)} /> {t(`Show the ${op === 'times' ? 'product' : 'sum'} and the cells that hold it (a help)`, `Tampilkan hasil ${op === 'times' ? 'kali' : 'jumlah'} dan petak yang berisinya (bantuan)`)}
          </label>
        )}
        {helpLocked && <p className="small muted">{t('At this level the help with the result is always on.', 'Di level ini bantuan hasil selalu menyala.')}</p>}
        <div className="dmlog" aria-live="polite" role="log">
          {noteShown && <p className="dmrefusal">{noteShown}</p>}
          {log.map((l, i) => (
            <p key={l.key} className={i === log.length - 1 ? 'last' : ''}>
              {l.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------ one screen: against the computer, or two players */

interface Play {
  mode: 'solo' | 'duo'
  names: Record<Color, string>
  level: number
  hafalan: boolean
  timeLimit: number | null
}

/** A game on this screen: against the computer (blue is the player, yellow the computer) or two players taking turns. */
function Local({ op, play, onExit, onAgain, onNext }: { op: Op; play: Play; onExit: () => void; onAgain: () => void; onNext: (() => void) | null }) {
  const { lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const solo = play.mode === 'solo'
  const rng = useRef<Rng>(makeRng(freshSeed()))
  const [g, setG] = useState<Game>(() => {
    const seed = freshSeed()
    rng.current = makeRng(seed ^ 0x9e3779b9)
    return newGame(op, coin(makeRng(seed)), seed)
  })
  const gRef = useRef(g)
  const [ver, setVer] = useState(1)
  const [events, setEvents] = useState<NetEvent[]>([])
  // the turn clock
  const [timer, setTimer] = useState<TimerInfo>({ limit: play.timeLimit, left: play.timeLimit === null ? null : play.timeLimit * 1000, held: false, at: Date.now() })
  const endsAt = useRef<number | null>(null)
  const heldLeft = useRef<number | null>(null)
  const timerTurn = useRef(-1)
  const plan = useRef<{ cell: number | null; first: { blue: number; gold: number } | null }>({ cell: null, first: null })
  const unlocked = useRef(readUnlocked(op))

  const apply = useCallback((r: ReturnType<typeof setPawn>) => {
    if (!r.ok) return
    gRef.current = r.g
    setG(r.g)
    setEvents(r.events)
    setVer((v) => v + 1)
  }, [])

  // a new turn starts a new clock; it runs for the player, and in a game for two for both players
  useEffect(() => {
    if (g.status !== 'play') {
      endsAt.current = null
      return
    }
    if (g.turn === timerTurn.current) return
    timerTurn.current = g.turn
    heldLeft.current = null
    const counts = play.timeLimit !== null && (!solo || g.current === 'blue')
    endsAt.current = counts ? Date.now() + (play.timeLimit as number) * 1000 : null
    setTimer({ limit: play.timeLimit, left: counts ? (play.timeLimit as number) * 1000 : null, held: false, at: Date.now() })
  }, [g, play.timeLimit, solo])
  useEffect(() => {
    if (play.timeLimit === null || g.status !== 'play') return
    const id = window.setInterval(() => {
      if (endsAt.current !== null && heldLeft.current === null && Date.now() >= endsAt.current) {
        endsAt.current = null
        apply(timeUp(gRef.current))
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [play.timeLimit, g.status, apply])
  const hold = useCallback((on: boolean) => {
    if (endsAt.current === null) return
    if (on && heldLeft.current === null) {
      heldLeft.current = Math.max(0, endsAt.current - Date.now())
      setTimer((x) => ({ ...x, left: heldLeft.current, held: true, at: Date.now() }))
    } else if (!on && heldLeft.current !== null) {
      endsAt.current = Date.now() + heldLeft.current
      const left = heldLeft.current
      heldLeft.current = null
      setTimer((x) => ({ ...x, left, held: false, at: Date.now() }))
    }
  }, [])
  const release = () => {
    if (heldLeft.current !== null) {
      endsAt.current = Date.now() + heldLeft.current
      heldLeft.current = null
    }
  }

  // the computer plays after a short pause, so that the player can follow
  useEffect(() => {
    if (!solo || g.status !== 'play' || g.current !== 'gold') return
    let wait = 900
    let step: () => void
    if (g.placing) {
      if (g.pending.blue === null) {
        plan.current.first = decideFirst(rng.current)
        step = () => apply(setPawn(gRef.current, (plan.current.first as { blue: number }).blue))
      } else step = () => apply(setPawn(gRef.current, (plan.current.first as { gold: number }).gold))
      wait = 800
    } else if (!g.moved) {
      step = () => {
        const d = decide(gRef.current, 'gold', play.level, rng.current)
        plan.current.cell = d ? d.cell : null
        if (d) apply(setPawn(gRef.current, d.n))
      }
    } else {
      wait = 700
      step = () => {
        const cur = gRef.current
        const cells = openCells(cur)
        let cell = plan.current.cell
        if (cell === null || !cells.includes(cell)) cell = cells.find((i) => wouldWin(cur, i, 'gold')) ?? cells[Math.floor(rng.current() * cells.length)]
        plan.current.cell = null
        apply(claim(cur, cell))
      }
    }
    const id = window.setTimeout(step, wait)
    return () => window.clearTimeout(id)
  }, [g, solo, play.level, apply])

  // winning a level opens the next one
  useEffect(() => {
    if (solo && g.status === 'over' && g.winner === 'blue' && play.level < MAX_LEVEL && unlocked.current < play.level + 1) {
      unlocked.current = play.level + 1
      writeUnlocked(op, play.level + 1)
    }
  }, [g.status, g.winner, solo, play.level, op])

  const mine: Color[] = solo ? ['blue'] : ['blue', 'gold']
  const lvl = LEVEL_TEXT[play.level]
  return (
    <div>
      <div className="dmbar">
        {solo ? <span className="pill brand">{t(`Level ${play.level}`, `Level ${play.level}`)} · {lvl.name[lang === 'id' ? 1 : 0]}</span> : <span className="pill brand">{t('Two players', '2 Pemain')}</span>}
        {play.timeLimit !== null && <span className="pill">{t(`${play.timeLimit} s a turn`, `${play.timeLimit} dtk per giliran`)}</span>}
        <button type="button" className="btn ghost sm" onClick={onExit}>
          {t('Menu', 'Menu')}
        </button>
      </div>
      <Table
        op={op}
        game={g}
        names={play.names}
        mine={mine}
        thinking={solo && g.status === 'play' && g.current === 'gold'}
        timer={timer}
        ver={ver}
        events={events}
        help={!play.hafalan || (solo && play.level === 0)}
        helpLocked={solo && play.level === 0}
        onPawn={(n) => {
          release()
          const r = setPawn(gRef.current, n)
          apply(r)
        }}
        onClaim={(i) => {
          release()
          apply(claim(gRef.current, i))
        }}
        onHold={hold}
        celebrate={g.winner !== null && (solo ? g.winner === 'blue' : true)}
        after={
          <div className="chips">
            {solo && g.winner === 'blue' && play.level < MAX_LEVEL && onNext ? (
              <button type="button" className="btn" onClick={onNext}>
                {t('Next level', 'Level berikutnya')}
              </button>
            ) : null}
            <button type="button" className={solo && g.winner === 'blue' && onNext ? 'btn ghost' : 'btn'} onClick={onAgain}>
              {solo && g.winner === 'blue' ? t('Play this level again', 'Ulangi level ini') : t('Play again', 'Main lagi')}
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

/* ------------------------------------------------------------------------------------------------ online */

function useSession(session: Session) {
  const view = useSyncExternalStore(
    (fn) => session.subscribe(fn),
    () => session.view(),
  )
  return view
}

function Room({ op, code, session, hafalan, onExit }: { op: Op; code: string; session: Session; hafalan: boolean; onExit: () => void }) {
  const { lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const view = useSession(session)
  const host = session.isHost ? (session as unknown as import('../../lib/rumahnet').HostSession) : null
  const [copied, setCopied] = useState(false)
  const [seconds, setSeconds] = useState(TIME_DEFAULT)

  useEffect(() => {
    const bye = () => session.leave()
    window.addEventListener('pagehide', bye)
    return () => {
      window.removeEventListener('pagehide', bye)
      session.leave()
    }
  }, [session])

  const snap: Snapshot | null = view.snap

  const link = view.link
  const problem =
    link === 'notfound'
      ? t('No room with that code answered. Check the code, and that the host is still there.', 'Tidak ada ruangan dengan kode itu yang menjawab. Periksa kodenya, dan apakah tuan rumahnya masih ada.')
      : link === 'full'
        ? t('The room already has two players.', 'Ruangan itu sudah berisi dua pemain.')
        : link === 'started'
          ? t('The game in that room has already started.', 'Permainan di ruangan itu sudah dimulai.')
          : link === 'out'
            ? t('You are no longer in this room.', 'Kamu tidak lagi ada di ruangan ini.')
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
  if (!snap) return <p className="dmnotice" role="status">{t('Connecting to the room…', 'Menyambung ke ruangan…')}</p>

  const names: Record<Color, string> = { blue: snap.seats.blue.name, gold: snap.seats.gold ? snap.seats.gold.name : '…' }
  const shareLink = `${window.location.origin}${window.location.pathname}?room=${code}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* the link is shown anyway */
    }
  }

  if (snap.phase === 'lobby') {
    const ready = Boolean(snap.seats.gold) && !snap.seats.gold?.away
    return (
      <div className="dmlobby">
        <div className="dmcode">
          <span className="small muted">{t('Room code', 'Kode ruangan')}</span>
          <b aria-label={code.split('').join(' ')}>{code}</b>
          <button type="button" className="btn ghost sm" onClick={copy}>
            {copied ? t('Copied', 'Tersalin') : t('Copy the link', 'Salin link')}
          </button>
        </div>
        <p className="small muted">{host ? t('Your friend joins with this code or this link. Two players.', 'Temanmu bergabung dengan kode atau link ini. Dua pemain.') : t('You are in. Waiting for the host to start.', 'Kamu sudah masuk. Menunggu tuan rumah memulai.')}</p>
        <ul className="rhscore lobby">
          {(['blue', 'gold'] as Color[]).map((c) => (
            <li key={c} className={`rhplayer ${c}`}>
              <span className={`rhmark ${c}`} aria-hidden="true">{markOf(c)}</span>
              <span className="rhname">
                {snap.seats[c] ? snap.seats[c]?.name : t('Waiting for a player…', 'Menunggu pemain…')}
                {snap.seats[c] && c === view.me ? ` (${t('you', 'kamu')})` : ''}
              </span>
              {c === 'blue' && <span className="pill brand">{t('Host', 'Tuan rumah')}</span>}
            </li>
          ))}
        </ul>
        {host ? (
          <>
            <div className="rhopts">
              <label className="dmhelp">
                <input
                  type="checkbox"
                  checked={snap.timeLimit !== null}
                  onChange={(e) => host.configure(e.target.checked ? (snap.timeLimit ?? seconds) : null)}
                />{' '}
                {t('Time limit per turn', 'Batas waktu per giliran')}
              </label>
              {snap.timeLimit !== null && (
                <label className="small">
                  <input
                    type="number"
                    className="rhsecs"
                    min={TIME_MIN}
                    max={TIME_MAX}
                    value={snap.timeLimit ?? seconds}
                    onChange={(e) => {
                      const s = clampTime(Number(e.target.value))
                      setSeconds(s)
                      host.configure(s)
                    }}
                  />{' '}
                  {t('seconds', 'detik')}
                </label>
              )}
            </div>
            <div className="chips">
              <button type="button" className="btn" disabled={!ready} onClick={() => host.start()}>
                {t('Start the game', 'Mulai permainan')}
              </button>
              {!ready && <span className="small muted">{t('Wait for your friend to join.', 'Tunggu temanmu bergabung.')}</span>}
            </div>
          </>
        ) : (
          snap.timeLimit !== null && <p className="small muted">{t(`Time limit: ${snap.timeLimit} seconds a turn.`, `Batas waktu: ${snap.timeLimit} detik per giliran.`)}</p>
        )}
        <button type="button" className="btn ghost sm" onClick={onExit}>
          {t('Leave the room', 'Keluar dari ruangan')}
        </button>
      </div>
    )
  }

  const game = snap.game as Game
  const me = view.me
  const away: Record<Color, boolean> = { blue: snap.seats.blue.away, gold: Boolean(snap.seats.gold?.away) }
  return (
    <div>
      <div className="dmbar">
        <span className="pill brand">{t(`Room ${code}`, `Ruangan ${code}`)}</span>
        {snap.timeLimit !== null && <span className="pill">{t(`${snap.timeLimit} s a turn`, `${snap.timeLimit} dtk per giliran`)}</span>}
        <button type="button" className="btn ghost sm" onClick={onExit}>
          {t('Leave', 'Keluar')}
        </button>
        {!host && snap.phase === 'play' && <span className="small muted">{t(`Left by accident? Join again with code ${code} before you miss your turn.`, `Keluar tidak sengaja? Gabung lagi dengan kode ${code} sebelum gilirannya terlewat.`)}</span>}
      </div>
      {link === 'lost' && (
        <p className="dmnotice warn" role="alert">
          {t('The connection to the host is lost. Waiting for it to come back…', 'Sambungan ke tuan rumah terputus. Menunggu sambungan kembali…')}
        </p>
      )}
      <Table
        op={op}
        game={game}
        names={names}
        mine={[me]}
        away={away}
        awayLeft={snap.awayLeft}
        waiting={view.waiting}
        refusal={view.refusal}
        timer={{ limit: snap.timeLimit, left: snap.left, held: snap.held, at: view.at }}
        ver={snap.ver}
        events={snap.events}
        help={!hafalan}
        onPawn={(n) => session.act({ t: 'pawn', n })}
        onClaim={(i) => session.act({ t: 'claim', i })}
        onHold={(on) => session.hold(on)}
        celebrate={game.winner === me}
        after={
          host ? (
            <div className="chips">
              <button type="button" className="btn" onClick={() => host.again()}>
                {t('Play again with the same player', 'Main lagi dengan pemain yang sama')}
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

/* ------------------------------------------------------------------------------------------------ the game */

type Stage = { k: 'menu' } | { k: 'local'; play: Play; n: number } | { k: 'room'; code: string; session: Session }

export default function RumahGame({ op }: { op: Op }) {
  const { lang } = useI18n()
  const t: T = (en, id) => (lang === 'id' ? id : en)
  const [cfg, setCfg] = useState<Settings>(() => readSettings(op))
  const [stage, setStage] = useState<Stage>({ k: 'menu' })
  const [unlocked, setUnlocked] = useState(() => readUnlocked(op))
  const [code, setCode] = useState(() => {
    try {
      return parseRoomCode(new URLSearchParams(window.location.search).get('room') ?? '') ?? ''
    } catch {
      return ''
    }
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resume, setResume] = useState<string | null>(() => rememberedRoom(op))
  const online = onlineAvailable()
  // a link with a room code in it (an invitation) opens a screen with nothing but the room, a name and one button
  const [invited, setInvited] = useState(() => online && code !== '')

  // a link with ?room=CODE opens the online tab
  useEffect(() => {
    if (code && cfg.mode !== 'online') setCfg((c) => ({ ...c, mode: 'online' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (stage.k === 'menu') setUnlocked(readUnlocked(op))
    // a game that has begun is brought to the top of the window, where the board and what is beside it fit the screen
    else document.querySelector('.rhgame')?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [stage.k, op])

  const update = (patch: Partial<Settings>) =>
    setCfg((c) => {
      const next = { ...c, ...patch }
      writeSettings(op, next)
      return next
    })
  const timeLimit = cfg.timeOn ? clampTime(cfg.seconds) : null
  const myName = () => cleanName(cfg.name, lang === 'id' ? 'Pemain' : 'Player')
  const startLocal = (level: number) => {
    const names: Record<Color, string> =
      cfg.mode === 'solo'
        ? { blue: cleanName(cfg.name, t('You', 'Kamu')), gold: `${t('Computer', 'Komputer')} (${t('Level', 'Level')} ${level})` }
        : { blue: cleanName(cfg.name, t('Blue player', 'Pemain Biru')), gold: cleanName(cfg.name2, t('Yellow player', 'Pemain Kuning')) }
    if (names.blue === names.gold) names.gold = `${names.gold} 2`
    setStage((s) => ({ k: 'local', n: (s.k === 'local' ? s.n : 0) + 1, play: { mode: cfg.mode === 'duo' ? 'duo' : 'solo', names, level, hafalan: cfg.hafalan, timeLimit } }))
  }
  const make = async () => {
    setBusy(true)
    setError('')
    try {
      const { code: c, session } = await hostRoom(op, myName(), timeLimit)
      rememberSeat(op, null)
      setStage({ k: 'room', code: c, session })
    } catch {
      setError(t('Could not reach the game server. Check your connection and try again.', 'Tidak bisa tersambung ke server permainan. Periksa koneksimu dan coba lagi.'))
    } finally {
      setBusy(false)
    }
  }
  const join = async (typed = code) => {
    setBusy(true)
    setError('')
    try {
      const parsed = parseRoomCode(typed)
      const joined = await joinRoom(op, typed, myName(), (parsed && seatFor(op, parsed)) || randomId())
      if (!joined) setError(t('A room code has 4 letters and digits, like K7QF.', 'Kode ruangan terdiri dari 4 huruf dan angka, seperti K7QF.'))
      else {
        rememberSeat(op, joined.code, joined.session.id)
        setResume(joined.code)
        setInvited(false)
        setStage({ k: 'room', code: joined.code, session: joined.session })
      }
    } catch {
      setError(t('Could not reach the game server. Check your connection and try again.', 'Tidak bisa tersambung ke server permainan. Periksa koneksimu dan coba lagi.'))
    } finally {
      setBusy(false)
    }
  }

  const aria = t(op === 'times' ? 'Multiplication House' : 'Addition House', op === 'times' ? 'Rumah Perkalian' : 'Rumah Penjumlahan')
  if (stage.k === 'local') {
    const lv = stage.play.level
    return (
      <section className="dmgame rhgame" aria-label={aria}>
        <Local
          key={stage.n}
          op={op}
          play={stage.play}
          onExit={() => setStage({ k: 'menu' })}
          onAgain={() => startLocal(lv)}
          onNext={lv < MAX_LEVEL ? () => startLocal(lv + 1) : null}
        />
      </section>
    )
  }
  if (stage.k === 'room') {
    return (
      <section className="dmgame rhgame" aria-label={aria}>
        <Room
          op={op}
          code={stage.code}
          session={stage.session}
          hafalan={cfg.hafalan}
          onExit={() => {
            if (stage.session.isHost) rememberSeat(op, null)
            else setResume(rememberedRoom(op))
            setStage({ k: 'menu' })
          }}
        />
      </section>
    )
  }

  if (invited) {
    return (
      <section className="dmgame rhgame" aria-label={aria}>
        <InviteCard
          lang={lang}
          game={aria}
          code={code}
          name={cfg.name}
          placeholder={t('Your name', 'Namamu')}
          how={t('When it is your turn, move your pawn to another number, work out the result, and tap a cell of the board that holds it.', 'Saat giliranmu, pindahkan pionmu ke angka lain, hitung hasilnya, lalu ketuk petak di papan yang berisi hasil itu.')}
          busy={busy}
          error={error}
          onName={(name) => update({ name })}
          onJoin={() => void join()}
          onMore={() => setInvited(false)}
        />
      </section>
    )
  }

  const sel = Math.min(cfg.level, unlocked)
  return (
    <section className="dmgame rhgame" aria-label={aria}>
      <h2 className="dmh">{t('Start a game', 'Mulai permainan')}</h2>
      <div className="chips" role="tablist" aria-label={t('How to play', 'Cara bermain')}>
        {([
          ['solo', t('Against the computer', 'Lawan komputer')],
          ['duo', t('Two players', '2 Pemain')],
          ['online', t('Online', 'Online')],
        ] as [Mode, string][]).map(([m, label]) => (
          <button key={m} type="button" role="tab" aria-selected={cfg.mode === m} className={`chip${cfg.mode === m ? ' on' : ''}`} onClick={() => update({ mode: m })}>
            {label}
          </button>
        ))}
      </div>

      <div className="dmways">
        <div className="dmway">
          {cfg.mode === 'duo' ? (
            <>
              <label className="dmfield">
                <span className="small muted">{t('Blue player', 'Pemain Biru')} ●</span>
                <input type="text" value={cfg.name} maxLength={NAME_MAX} placeholder={t('Blue player', 'Pemain Biru')} onChange={(e) => update({ name: e.target.value })} />
              </label>
              <label className="dmfield">
                <span className="small muted">{t('Yellow player', 'Pemain Kuning')} ◆</span>
                <input type="text" value={cfg.name2} maxLength={NAME_MAX} placeholder={t('Yellow player', 'Pemain Kuning')} onChange={(e) => update({ name2: e.target.value })} />
              </label>
            </>
          ) : (
            <label className="dmfield">
              <span className="small muted">{t('Your name', 'Namamu')}</span>
              <input type="text" value={cfg.name} maxLength={NAME_MAX} placeholder={cfg.mode === 'solo' ? t('You', 'Kamu') : t('Player', 'Pemain')} autoComplete="nickname" onChange={(e) => update({ name: e.target.value })} />
            </label>
          )}

          {cfg.mode === 'solo' && (
            <>
              <p className="small muted">
                {t('Highest level open', 'Level tertinggi yang terbuka')}: <b>{t('Level', 'Level')} {unlocked}</b>
              </p>
              <div className="rhlevels" role="group" aria-label={t('Level of the computer', 'Level komputer')}>
                {LEVEL_TEXT.map((lv, i) => (
                  <button key={i} type="button" className={`chip${sel === i ? ' on' : ''}`} aria-pressed={sel === i} disabled={i > unlocked} onClick={() => update({ level: i })}>
                    <b>{i}</b> {i > unlocked ? '🔒' : lv.name[lang === 'id' ? 1 : 0]}
                  </button>
                ))}
              </div>
              <p className="small muted">{LEVEL_TEXT[sel].about[lang === 'id' ? 1 : 0]}</p>
              <p className="small muted">{t('Win a level to open the next one. A level you have opened can be played again whenever you like.', 'Menang di satu level membuka level berikutnya. Level yang sudah terbuka boleh dimainkan ulang kapan saja.')}</p>
            </>
          )}

          {cfg.mode === 'online' && (
            <>
              {!online ? (
                <p className="small muted">{t('Online play needs the website’s game server, which this copy does not have. Playing against the computer works everywhere.', 'Main online memerlukan server permainan situs ini, yang tidak ada di salinan ini. Melawan komputer bisa di mana saja.')}</p>
              ) : (
                <>
                  {resume && (
                    <div className="dmnotice">
                      <p>{t(`You are still in room ${resume}.`, `Kamu masih berada di ruangan ${resume}.`)}</p>
                      <div className="chips">
                        <button type="button" className="btn sm" disabled={busy} onClick={() => join(resume)}>
                          {t('Go back to the room', 'Kembali ke ruangan')}
                        </button>
                        <button
                          type="button"
                          className="btn ghost sm"
                          onClick={() => {
                            rememberSeat(op, null)
                            setResume(null)
                          }}
                        >
                          {t('Forget the room', 'Lupakan ruangan')}
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="chips">
                    <button type="button" className="btn" disabled={busy} onClick={make}>
                      {t('Make a room', 'Buat ruangan')}
                    </button>
                  </div>
                  <label className="dmfield">
                    <span className="small muted">{t('Or join with a code', 'Atau gabung dengan kode')}</span>
                    <span className="dmjoin">
                      <input type="text" value={code} maxLength={4} placeholder="K7QF" autoComplete="off" onChange={(e) => setCode(e.target.value.toUpperCase())} />
                      <button type="button" className="btn soft" disabled={busy || !code} onClick={() => join()}>
                        {t('Join', 'Gabung')}
                      </button>
                    </span>
                  </label>
                  {busy && <p role="status" className="small muted">{t('Connecting…', 'Menyambung…')}</p>}
                  {error && <p role="alert" className="dmerror">{error}</p>}
                  <p className="small muted">{t('Only the name you type is shared with the other player. Nothing is saved on a server.', 'Hanya nama yang kamu ketik yang dibagikan ke pemain lain. Tidak ada yang disimpan di server.')}</p>
                </>
              )}
            </>
          )}
        </div>

        <div className="dmway">
          <h2 className="dmh">{t('Options', 'Pilihan')}</h2>
          <label className="dmhelp">
            <input type="checkbox" checked={cfg.hafalan} onChange={(e) => update({ hafalan: e.target.checked })} /> {t('Memorised mode', 'Mode sudah hafal')} <span className="muted">({t(`hide the help with the ${op === 'times' ? 'product' : 'sum'}`, `sembunyikan bantuan hasil ${op === 'times' ? 'kali' : 'jumlah'}`)})</span>
          </label>
          <label className="dmhelp">
            <input type="checkbox" checked={cfg.timeOn} onChange={(e) => update({ timeOn: e.target.checked })} /> {t('Time limit per turn', 'Batas waktu per giliran')}
          </label>
          {cfg.timeOn && (
            <label className="small">
              <input type="number" className="rhsecs" min={TIME_MIN} max={TIME_MAX} value={cfg.seconds} onChange={(e) => update({ seconds: Number(e.target.value) })} onBlur={() => update({ seconds: clampTime(cfg.seconds) })} /> {t('seconds', 'detik')}
            </label>
          )}
          {cfg.mode === 'online' && <p className="small muted">{t('The host can still change the time limit in the room.', 'Tuan rumah masih bisa mengubah batas waktu di ruangan.')}</p>}
          {cfg.mode !== 'online' && (
            <div className="chips" style={{ marginTop: 12 }}>
              <button type="button" className="btn" onClick={() => startLocal(sel)}>
                {t('Start the game', 'Mulai permainan')}
              </button>
            </div>
          )}
          {cfg.mode !== 'online' && <p className="small muted">{t('A coin toss decides who starts.', 'Lemparan koin menentukan siapa yang mulai.')}</p>}
        </div>
      </div>
    </section>
  )
}

