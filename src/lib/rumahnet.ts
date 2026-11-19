/** The Houses (Multiplication House, Addition House) over the network: two players in a room.
 *
 *  Nothing here knows about the web. A `Bus` carries a small message to the other player in the room (the real one is a Supabase Realtime channel,
 *  `rumahrealtime.ts`; the checker uses a fake one with a fake clock), so a whole game can be played by a script.
 *
 *  The player who made the room is the *host*, the blue player, and the host's browser is the referee: it owns the game (`rumah.ts`), takes the other player's
 *  actions, refuses the ones the rules refuse, keeps the clock of the turn, and tells the other player what the table looks like now (a `Snapshot`). Nothing in a
 *  game is hidden, so a snapshot is the whole game.
 *
 *  Leaving and coming back: a player who says goodbye, or is not heard from for `ABSENT_MS`, has only stepped away. The game goes on. When the turn comes to a
 *  player who is away, `AWAY_GRACE_S` seconds start (or the time limit of a turn, if that is shorter); if the player is back in time the game goes on, if not
 *  the turn is missed and the other player wins. A player comes back with the same id (the tab remembers it for the room code) or with the next ping. If the host
 *  leaves, the room is closed, because the host is the referee. */

import {
  AWAY_GRACE_S,
  CELLS,
  COLORS,
  FACTORS,
  TIME_MAX,
  TIME_MIN,
  WHYS,
  claim,
  coin,
  isColor,
  isOp,
  makeRng,
  newGame,
  other,
  setPawn,
  timeUp,
  type Color,
  type Game,
  type GameEvent,
  type Op,
  type Refusal,
  type Result,
} from './rumah'
import { NAME_MAX, cleanName, newRoomCode, parseRoomCode, realClock, type Clock } from './dominonet'

export { NAME_MAX, cleanName, newRoomCode, parseRoomCode, realClock }
export type { Clock }

/** the host's clock ticks this often: the turn clock and the away clock are checked at every tick */
export const TICK_MS = 1000
/** a beat (the host says it is there, and which version of the table it holds) is sent every this many ticks */
export const BEAT_TICKS = 3
export const PING_MS = 3000
/** A player not heard from for this long has stepped away. */
export const ABSENT_MS = 13000
/** A host not heard from for this long has gone. */
export const LOST_MS = 13000
/** A player who gets no answer to the first hello for this long has the wrong code. */
export const JOIN_MS = 6000
/** the clock of a turn stands still while a player looks at a click (the confirm window); never for longer than this */
export const HOLD_MS = 8000

/* ----------------------------------------------------------------------------------------------- messages */

export type NetEvent = GameEvent | { k: 'away'; c: Color } | { k: 'back'; c: Color }

export interface Seat {
  id: string
  name: string
  /** stepped away and not back yet */
  away: boolean
}
export interface Snapshot {
  ver: number
  phase: 'lobby' | 'play' | 'over'
  host: string
  op: Op
  /** seconds a turn may take, or null for no limit */
  timeLimit: number | null
  seats: { blue: Seat; gold: Seat | null }
  game: Game | null
  /** milliseconds left of this turn at the moment of the snapshot (null: no limit, or no game being played) */
  left: number | null
  /** the clock of the turn stands still (a player is looking at a click) */
  held: boolean
  /** milliseconds left before the player who is away loses the turn they are missing (null: nobody is away on their turn) */
  awayLeft: number | null
  /** what happened in the step that made this snapshot */
  events: NetEvent[]
}

export type RAction = { t: 'pawn'; n: number } | { t: 'claim'; i: number }
export type DenyReason = 'full' | 'started'
export type Msg =
  | { t: 'hello'; id: string; name: string }
  | { t: 'ping'; id: string }
  | { t: 'act'; id: string; a: RAction; n: number }
  | { t: 'hold'; id: string; on: boolean }
  | { t: 'bye'; id: string }
  | { t: 'probe' }
  | { t: 'snap'; s: Snapshot }
  | { t: 'beat'; host: string; ver: number }
  | { t: 'deny'; to: string; why: DenyReason }
  | { t: 'refuse'; to: string; why: Refusal; n: number }
  | { t: 'closed'; host: string }

export interface Bus {
  send(msg: Msg): void
  onMessage(fn: (msg: Msg) => void): () => void
  close(): void
}

/* ----------------------------------------------------------------------------------------------- what is accepted from the network */

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)
const isInt = (x: unknown, lo: number, hi: number): x is number => typeof x === 'number' && Number.isInteger(x) && x >= lo && x <= hi
const isStr = (x: unknown, max: number): x is string => typeof x === 'string' && x.length >= 1 && x.length <= max
const isId = (x: unknown): x is string => isStr(x, 24) && /^[A-Za-z0-9_-]+$/.test(x as string)
const colorOrNull = (x: unknown): Color | null | undefined => (x === null ? null : isColor(x) ? x : undefined)
const pawnOrNull = (x: unknown): number | null | undefined => (x === null ? null : isInt(x, 1, FACTORS) ? x : undefined)

function parseEvent(x: unknown): NetEvent | null {
  if (!isObj(x)) return null
  switch (x.k) {
    case 'pawn':
      return isColor(x.c) && isColor(x.pawn) && isInt(x.n, 1, FACTORS) && typeof x.start === 'boolean' ? { k: 'pawn', c: x.c, pawn: x.pawn, n: x.n, start: x.start } : null
    case 'claim':
      return isColor(x.c) && isInt(x.i, 0, CELLS - 1) && isInt(x.v, 1, 81) ? { k: 'claim', c: x.c, i: x.i, v: x.v } : null
    case 'wrong':
      return isColor(x.c) && isInt(x.i, 0, CELLS - 1) && isInt(x.v, 1, 81) ? { k: 'wrong', c: x.c, i: x.i, v: x.v } : null
    case 'pass':
      return isColor(x.c) && isInt(x.v, 1, 81) ? { k: 'pass', c: x.c, v: x.v } : null
    case 'line':
    case 'time':
    case 'missed':
    case 'away':
    case 'back':
      return isColor(x.c) ? { k: x.k, c: x.c } : null
    case 'full':
      return { k: 'full' }
    default:
      return null
  }
}
function parseGame(x: unknown): Game | null {
  if (!isObj(x) || !isOp(x.op) || !isColor(x.first) || !isColor(x.current)) return null
  if (!Array.isArray(x.board) || x.board.length !== CELLS) return null
  const board: Game['board'] = []
  for (const c of x.board) {
    const owner = isObj(c) ? colorOrNull(c.owner) : undefined
    if (!isObj(c) || !isInt(c.value, 1, 81) || owner === undefined) return null
    board.push({ value: c.value, owner })
  }
  if (!isObj(x.pawn) || !isObj(x.pending)) return null
  const pawn = { blue: pawnOrNull(x.pawn.blue), gold: pawnOrNull(x.pawn.gold) }
  const pending = { blue: pawnOrNull(x.pending.blue), gold: pawnOrNull(x.pending.gold) }
  if (pawn.blue === undefined || pawn.gold === undefined || pending.blue === undefined || pending.gold === undefined) return null
  const winner = colorOrNull(x.winner)
  if (x.status !== 'play' && x.status !== 'over') return null
  if (winner === undefined || typeof x.placing !== 'boolean' || typeof x.moved !== 'boolean' || !isInt(x.turn, 0, 1e6)) return null
  const why = x.why === null ? null : WHYS.find((w) => w === x.why)
  if (why === undefined) return null
  if (!Array.isArray(x.line) || x.line.length > CELLS || !x.line.every((i) => isInt(i, 0, CELLS - 1))) return null
  return {
    op: x.op,
    board,
    pawn: { blue: pawn.blue, gold: pawn.gold },
    first: x.first,
    current: x.current,
    status: x.status,
    winner,
    line: x.line as number[],
    placing: x.placing,
    pending: { blue: pending.blue, gold: pending.gold },
    moved: x.moved,
    why,
    turn: x.turn,
  }
}
function parseSeat(x: unknown): Seat | null {
  return isObj(x) && isId(x.id) && isStr(x.name, NAME_MAX * 2) && typeof x.away === 'boolean' ? { id: x.id, name: x.name, away: x.away } : null
}
export function parseSnapshot(x: unknown): Snapshot | null {
  if (!isObj(x) || !isInt(x.ver, 0, 1e9) || !isId(x.host) || !isOp(x.op)) return null
  if (x.phase !== 'lobby' && x.phase !== 'play' && x.phase !== 'over') return null
  if (!isObj(x.seats)) return null
  const blue = parseSeat(x.seats.blue)
  const gold = x.seats.gold === null ? null : parseSeat(x.seats.gold)
  if (!blue || (x.seats.gold !== null && !gold)) return null
  const game = x.game === null ? null : parseGame(x.game)
  if (x.game !== null && !game) return null
  if (x.timeLimit !== null && !isInt(x.timeLimit, TIME_MIN, TIME_MAX)) return null
  if (x.left !== null && !isInt(x.left, 0, TIME_MAX * 1000)) return null
  if (x.awayLeft !== null && !isInt(x.awayLeft, 0, 1e6)) return null
  if (typeof x.held !== 'boolean' || !Array.isArray(x.events) || x.events.length > 8) return null
  const events: NetEvent[] = []
  for (const e of x.events) {
    const p = parseEvent(e)
    if (!p) return null
    events.push(p)
  }
  return { ver: x.ver, phase: x.phase, host: x.host, op: x.op, timeLimit: x.timeLimit as number | null, seats: { blue, gold }, game, left: x.left as number | null, held: x.held, awayLeft: x.awayLeft as number | null, events }
}
export function parseAction(x: unknown): RAction | null {
  if (!isObj(x)) return null
  if (x.t === 'pawn') return isInt(x.n, 1, FACTORS) ? { t: 'pawn', n: x.n } : null
  if (x.t === 'claim') return isInt(x.i, 0, CELLS - 1) ? { t: 'claim', i: x.i } : null
  return null
}
const REFUSALS: Refusal[] = ['over', 'bad', 'same', 'not-set', 'not-moved', 'taken', 'turn']
/** A message from the network, or null if it is not one. Nothing else gets into the sessions. */
export function parseMsg(x: unknown): Msg | null {
  if (!isObj(x)) return null
  switch (x.t) {
    case 'hello':
      return isId(x.id) && typeof x.name === 'string' && x.name.length <= 80 ? { t: 'hello', id: x.id, name: x.name } : null
    case 'ping':
    case 'bye':
      return isId(x.id) ? { t: x.t, id: x.id } : null
    case 'hold':
      return isId(x.id) && typeof x.on === 'boolean' ? { t: 'hold', id: x.id, on: x.on } : null
    case 'act': {
      const a = parseAction(x.a)
      return isId(x.id) && a && isInt(x.n, 0, 1e9) ? { t: 'act', id: x.id, a, n: x.n } : null
    }
    case 'probe':
      return { t: 'probe' }
    case 'snap': {
      const s = parseSnapshot(x.s)
      return s ? { t: 'snap', s } : null
    }
    case 'beat':
      return isId(x.host) && isInt(x.ver, 0, 1e9) ? { t: 'beat', host: x.host, ver: x.ver } : null
    case 'deny':
      return isId(x.to) && (x.why === 'full' || x.why === 'started') ? { t: 'deny', to: x.to, why: x.why } : null
    case 'refuse':
      return isId(x.to) && REFUSALS.includes(x.why as Refusal) && isInt(x.n, 0, 1e9) ? { t: 'refuse', to: x.to, why: x.why as Refusal, n: x.n } : null
    case 'closed':
      return isId(x.host) ? { t: 'closed', host: x.host } : null
    default:
      return null
  }
}

/* ----------------------------------------------------------------------------------------------- what the screen reads */

export interface TableView {
  /** which colour this player is */
  me: Color
  isHost: boolean
  link: 'joining' | 'ok' | 'notfound' | 'full' | 'started' | 'out' | 'lost' | 'closed'
  snap: Snapshot | null
  refusal: { n: number; why: Refusal } | null
  /** an action is on its way to the referee */
  waiting: boolean
  /** when the snapshot was received, by this player's clock, so that the countdowns can be drawn */
  at: number
}

export interface Session {
  readonly me: Color
  readonly id: string
  readonly isHost: boolean
  view(): TableView
  subscribe(fn: () => void): () => void
  act(a: RAction): void
  /** the clock of my turn stands still (a click is being looked at) or goes on */
  hold(on: boolean): void
  leave(): void
}

/* ----------------------------------------------------------------------------------------------- the host */

interface Member extends Seat {
  seen: number
}

export class HostSession implements Session {
  readonly isHost = true
  readonly me: Color = 'blue'
  private blue: Member
  private gold: Member | null = null
  private game: Game | null = null
  private phase: Snapshot['phase'] = 'lobby'
  private ver = 0
  private events: NetEvent[] = []
  private listeners = new Set<() => void>()
  private cache: TableView
  private refusalN = 0
  private refusal: TableView['refusal'] = null
  private timer: unknown = null
  private ticks = 0
  private off: () => void
  private closed = false
  /** the clock of the turn */
  private turnEnds: number | null = null
  private heldLeft: number | null = null
  private heldUntil = 0
  private timerTurn = -1
  /** when the player who is away loses the turn */
  private awayEnds: number | null = null
  timeLimit: number | null

  constructor(
    readonly id: string,
    name: string,
    private bus: Bus,
    private clock: Clock,
    readonly op: Op,
    timeLimit: number | null = null,
    private seed: () => number = () => Math.floor(Math.random() * 2 ** 31),
  ) {
    this.timeLimit = timeLimit
    this.blue = { id, name: cleanName(name), away: false, seen: clock.now() }
    this.cache = this.makeView()
    this.off = bus.onMessage((m) => this.onMessage(m))
    this.changed()
    this.schedule()
  }

  /* --- the table */
  private seatOf(c: Color): Member | null {
    return c === 'blue' ? this.blue : this.gold
  }
  private colorOf(id: string): Color | null {
    return this.blue.id === id ? 'blue' : this.gold && this.gold.id === id ? 'gold' : null
  }
  private snapshot(): Snapshot {
    const now = this.clock.now()
    const playing = this.phase === 'play' && this.game !== null
    const left = playing && this.timeLimit !== null && this.turnEnds !== null ? Math.max(0, Math.round(this.heldLeft ?? this.turnEnds - now)) : null
    const seat = (m: Member): Seat => ({ id: m.id, name: m.name, away: m.away })
    return {
      ver: this.ver,
      phase: this.phase,
      host: this.id,
      op: this.op,
      timeLimit: this.timeLimit,
      seats: { blue: seat(this.blue), gold: this.gold ? seat(this.gold) : null },
      game: this.game,
      left,
      held: playing && this.heldLeft !== null,
      awayLeft: playing && this.awayEnds !== null ? Math.max(0, Math.round(this.awayEnds - now)) : null,
      events: this.events,
    }
  }
  private makeView(): TableView {
    return { me: 'blue', isHost: true, link: 'ok', snap: this.snapshot(), refusal: this.refusal, waiting: false, at: this.clock.now() }
  }
  view(): TableView {
    return this.cache
  }
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
  /** Something changed: a new version, told to the other player. */
  private changed(): void {
    if (this.closed) return
    this.ver++
    this.cache = this.makeView()
    this.events = []
    this.bus.send({ t: 'snap', s: this.cache.snap as Snapshot })
    this.listeners.forEach((f) => f())
  }

  /* --- the clocks of a game */
  private syncClocks(): void {
    const now = this.clock.now()
    const g = this.game
    if (!g || this.phase !== 'play') {
      this.turnEnds = this.heldLeft = this.awayEnds = null
      this.timerTurn = -1
      return
    }
    if (g.turn !== this.timerTurn) {
      this.timerTurn = g.turn
      this.turnEnds = this.timeLimit !== null ? now + this.timeLimit * 1000 : null
      this.heldLeft = null
      this.awayEnds = null
    }
    const seat = this.seatOf(g.current)
    if (seat && seat.away) {
      if (this.awayEnds === null) this.awayEnds = now + Math.min(AWAY_GRACE_S, this.timeLimit ?? AWAY_GRACE_S) * 1000
    } else this.awayEnds = null
  }
  /** After the game moved: the clocks, whether the game is over, and the news. */
  private moved(g: Game, events: NetEvent[]): void {
    this.game = g
    this.events.push(...events)
    if (g.status === 'over') this.phase = 'over'
    this.syncClocks()
    this.changed()
  }
  private end(missed: boolean): void {
    if (!this.game) return
    const r = timeUp(this.game, missed)
    if (r.ok) this.moved(r.g, r.events)
  }

  /* --- the room */
  /** Host only: the time limit of a turn (seconds, or null), in the lobby. */
  configure(timeLimit: number | null): void {
    if (this.phase !== 'lobby') return
    this.timeLimit = timeLimit === null ? null : Math.min(TIME_MAX, Math.max(TIME_MIN, Math.round(timeLimit)))
    this.changed()
  }
  canStart(): boolean {
    return this.phase === 'lobby' && this.gold !== null && !this.gold.away
  }
  start(): boolean {
    if (!this.canStart()) return false
    const seed = this.seed()
    this.game = newGame(this.op, coin(makeRng(seed ^ 0x5bd1e995)), seed)
    this.phase = 'play'
    this.syncClocks()
    this.changed()
    return true
  }
  /** Host only: back to the lobby after a game, with the other player if they are still here. */
  again(): void {
    if (this.phase !== 'over') return
    if (this.gold && this.gold.away) this.gold = null
    this.game = null
    this.phase = 'lobby'
    this.syncClocks()
    this.changed()
  }
  private back(m: Member): boolean {
    if (!m.away) return false
    m.away = false
    const c = this.colorOf(m.id) as Color
    this.events.push({ k: 'back', c })
    this.syncClocks()
    this.changed()
    return true
  }
  private hello(id: string, name: string): void {
    if (this.gold && this.gold.id === id) {
      this.gold.seen = this.clock.now()
      if (!this.back(this.gold)) this.bus.send({ t: 'snap', s: this.cache.snap as Snapshot })
      return
    }
    if (this.phase !== 'lobby') {
      this.bus.send({ t: 'deny', to: id, why: 'started' })
      return
    }
    if (this.gold) {
      this.bus.send({ t: 'deny', to: id, why: 'full' })
      return
    }
    let clean = cleanName(name)
    if (clean === this.blue.name) clean = `${clean.slice(0, NAME_MAX - 2)} 2`
    this.gold = { id, name: clean, away: false, seen: this.clock.now() }
    this.changed()
  }
  private drop(id: string): void {
    const m = this.gold
    if (!m || m.id !== id) return
    if (this.phase === 'lobby') {
      this.gold = null
      this.changed()
    } else if (this.phase === 'play' && !m.away) {
      m.away = true
      this.events.push({ k: 'away', c: 'gold' })
      this.syncClocks()
      this.changed()
    }
  }

  /* --- play */
  act(a: RAction): void {
    this.apply(this.id, a)
  }
  hold(on: boolean): void {
    this.setHold(this.id, on)
  }
  private setHold(id: string, on: boolean): void {
    const g = this.game
    if (!g || this.phase !== 'play' || this.colorOf(id) !== g.current || this.turnEnds === null) return
    if (on && this.heldLeft === null) {
      this.heldLeft = Math.max(0, this.turnEnds - this.clock.now())
      this.heldUntil = this.clock.now() + HOLD_MS
      this.changed()
    } else if (!on && this.heldLeft !== null) this.release()
  }
  private release(): void {
    if (this.heldLeft === null) return
    this.turnEnds = this.clock.now() + this.heldLeft
    this.heldLeft = null
    this.changed()
  }
  private apply(id: string, a: RAction, n = 0): void {
    const c = this.colorOf(id)
    let res: Result
    if (!this.game || this.phase !== 'play' || !c) res = { ok: false, reason: 'over' }
    else if (c !== this.game.current) res = { ok: false, reason: 'turn' }
    else res = a.t === 'pawn' ? setPawn(this.game, a.n) : claim(this.game, a.i)
    if (!res.ok) {
      if (id === this.id) {
        this.refusal = { n: ++this.refusalN, why: res.reason }
        this.cache = { ...this.makeView() }
        this.listeners.forEach((f) => f())
      } else this.bus.send({ t: 'refuse', to: id, why: res.reason, n })
      return
    }
    // a click that was kept ends the pause of the clock; a new turn starts a new clock
    if (this.heldLeft !== null) {
      this.turnEnds = this.clock.now() + this.heldLeft
      this.heldLeft = null
    }
    this.refusal = null
    this.moved(res.g, res.events)
  }

  /* --- the network */
  private onMessage(m: Msg): void {
    if (this.closed) return
    switch (m.t) {
      case 'probe':
        this.bus.send({ t: 'beat', host: this.id, ver: this.ver })
        break
      case 'hello':
        if (m.id !== this.id) this.hello(m.id, m.name)
        break
      case 'ping':
      case 'act':
      case 'hold': {
        if (this.gold && this.gold.id === m.id) {
          this.gold.seen = this.clock.now()
          this.back(this.gold)
        }
        if (m.t === 'act' && m.id !== this.id) this.apply(m.id, m.a, m.n)
        else if (m.t === 'hold' && m.id !== this.id) this.setHold(m.id, m.on)
        break
      }
      case 'bye':
        this.drop(m.id)
        break
      default:
        break
    }
  }
  private schedule(): void {
    this.timer = this.clock.setTimeout(() => {
      if (this.closed) return
      this.tick()
      this.schedule()
    }, TICK_MS)
  }
  private tick(): void {
    const now = this.clock.now()
    if (++this.ticks % BEAT_TICKS === 0) this.bus.send({ t: 'beat', host: this.id, ver: this.ver })
    if (this.gold && now - this.gold.seen > ABSENT_MS) this.drop(this.gold.id)
    if (this.phase !== 'play' || !this.game) return
    if (this.heldLeft !== null && now > this.heldUntil) this.release()
    const seat = this.seatOf(this.game.current)
    if (this.awayEnds !== null && now >= this.awayEnds) this.end(true)
    else if (this.turnEnds !== null && this.heldLeft === null && now >= this.turnEnds) this.end(Boolean(seat && seat.away))
  }
  leave(): void {
    if (this.closed) return
    this.bus.send({ t: 'closed', host: this.id })
    this.closed = true
    this.clock.clearTimeout(this.timer)
    this.off()
    this.bus.close()
  }
}

/* ----------------------------------------------------------------------------------------------- the other player */

export class ClientSession implements Session {
  readonly isHost = false
  readonly me: Color = 'gold'
  private snap: Snapshot | null = null
  private link: TableView['link'] = 'joining'
  private heard: number
  private seenAt: number
  private host: string | null = null
  private refusal: TableView['refusal'] = null
  private waiting = false
  private sentAt = 0
  private actN = 0
  private resyncAt = 0
  private timer: unknown = null
  private startedAt: number
  private listeners = new Set<() => void>()
  private cache: TableView
  private off: () => void
  private closed = false

  constructor(
    readonly id: string,
    private name: string,
    private bus: Bus,
    private clock: Clock,
  ) {
    this.heard = this.seenAt = this.startedAt = clock.now()
    this.cache = this.makeView()
    this.off = bus.onMessage((m) => this.onMessage(m))
    this.sayHello()
    this.tick()
  }

  private makeView(): TableView {
    // a request that was never answered must not leave the buttons dead
    const waiting = this.waiting && this.clock.now() - this.sentAt < 4000
    return { me: 'gold', isHost: false, link: this.link, snap: this.snap, refusal: this.refusal, waiting, at: this.seenAt }
  }
  view(): TableView {
    return this.cache
  }
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
  private changed(): void {
    this.cache = this.makeView()
    this.listeners.forEach((f) => f())
  }
  private sayHello(): void {
    this.bus.send({ t: 'hello', id: this.id, name: this.name })
  }
  act(a: RAction): void {
    if (this.closed || this.link !== 'ok') return
    this.waiting = true
    this.sentAt = this.clock.now()
    this.bus.send({ t: 'act', id: this.id, a, n: ++this.actN })
    this.changed()
  }
  hold(on: boolean): void {
    if (this.closed || this.link !== 'ok') return
    this.bus.send({ t: 'hold', id: this.id, on })
  }

  private onMessage(m: Msg): void {
    if (this.closed) return
    switch (m.t) {
      case 'snap': {
        const s = m.s
        if (this.host !== null && s.host !== this.host) return
        if (this.snap && s.ver < this.snap.ver) return
        this.host = s.host
        this.heard = this.clock.now()
        const mine = s.seats.gold && s.seats.gold.id === this.id
        if (mine) {
          if (this.link === 'notfound') this.tick()
          if (this.link !== 'closed') this.link = 'ok'
        } else if (this.link === 'ok') this.link = 'out'
        if (this.snap === null || s.ver > this.snap.ver) this.waiting = false
        this.snap = s
        this.seenAt = this.clock.now()
        this.changed()
        break
      }
      case 'beat':
        if (this.host !== null && m.host !== this.host) return
        this.heard = this.clock.now()
        if (this.link === 'lost') this.link = 'ok'
        // a beat ahead of what this player knows: something was missed, ask again (not more than once a second)
        if ((!this.snap || m.ver > this.snap.ver) && this.clock.now() - this.resyncAt > 1000) {
          this.resyncAt = this.clock.now()
          this.sayHello()
        }
        this.changed()
        break
      case 'deny':
        if (m.to === this.id) {
          this.link = m.why
          this.stop()
          this.changed()
        }
        break
      case 'refuse':
        if (m.to === this.id) {
          this.refusal = { n: m.n, why: m.why }
          this.waiting = false
          // the referee knows better than this player's copy of the table: ask for it again (not more than once a second)
          if (this.clock.now() - this.resyncAt > 1000) {
            this.resyncAt = this.clock.now()
            this.sayHello()
          }
          this.changed()
        }
        break
      case 'closed':
        if (this.host === null || m.host === this.host) {
          this.link = 'closed'
          this.changed()
        }
        break
      default:
        break
    }
  }
  private stop(): void {
    this.clock.clearTimeout(this.timer)
    this.timer = null
  }
  private tick(): void {
    this.timer = this.clock.setTimeout(() => {
      if (this.closed) return
      const now = this.clock.now()
      this.timer = null
      if (this.link === 'joining') {
        // not let in yet: ask again, and give up after a while
        if (now - this.startedAt > JOIN_MS) {
          this.link = 'notfound'
          this.changed()
          return
        }
        this.sayHello()
      } else {
        this.bus.send({ t: 'ping', id: this.id })
        if (this.link === 'ok' && now - this.heard > LOST_MS) {
          this.link = 'lost'
          this.changed()
        } else if (this.waiting && now - this.sentAt >= 4000) this.changed()
      }
      this.tick()
    }, this.link === 'joining' ? 1500 : PING_MS)
  }
  leave(): void {
    if (this.closed) return
    this.bus.send({ t: 'bye', id: this.id })
    this.closed = true
    this.stop()
    this.off()
    this.bus.close()
  }
}

/** Is a room with this code already hosted? Asks on the bus and listens for a beat for a moment. */
export function probeRoom(bus: Bus, clock: Clock, ms = 1500): Promise<boolean> {
  return new Promise((resolve) => {
    let found = false
    const off = bus.onMessage((m) => {
      if (m.t === 'beat' || m.t === 'snap' || m.t === 'closed') found = true
    })
    bus.send({ t: 'probe' })
    clock.setTimeout(() => {
      off()
      resolve(found)
    }, ms)
  })
}

export { COLORS, other }
