/** Math Domino over the network: 2 to 8 players in a room.
 *
 *  Nothing here knows about the web. A `Bus` is anything that carries a small message to every other player in the room (the real one is a Supabase
 *  Realtime channel, `dominorealtime.ts`; the checker uses a fake one with a fake clock), so the whole protocol can be played by a script.
 *
 *  One browser is the referee, the *host*: the player who made the room. The host owns the game (`domino.ts`), takes every player's action, refuses the ones
 *  the rules refuse, and tells everyone what the table looks like now (a `Snapshot`, which holds no hidden tile) and, privately, what each player holds. A
 *  message is only addressed to a player by an `id`, the room is a public channel, so a player who reads the network traffic could read the other hands:
 *  this keeps friends honest, it is not a protection against cheating.
 *
 *  Who is still there is told by heartbeats: every player pings every few seconds and the host beats. A player not heard from for `ABSENT_MS` is dropped
 *  (the tiles go back to the boneyard); a host not heard from for `LOST_MS` ends the game for everyone. A message that may have been missed is repaired by
 *  the version numbers: a beat that is ahead of what a player has makes the player ask again. */

import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  TILE_COUNT,
  VALUES,
  act as playAct,
  isLevel,
  isModeId,
  newGame,
  removePlayer,
  standings,
  type Action,
  type End,
  type Game,
  type GameEvent,
  type Half,
  type Level,
  type ModeId,
  type Placed,
  type Refusal,
  type Tile,
} from './domino'

export const BEAT_MS = 3000
export const PING_MS = 3000
/** A player not heard from for this long has left. */
export const ABSENT_MS = 13000
/** A host not heard from for this long has gone. */
export const LOST_MS = 13000
/** A player who gets no answer to the first hello for this long has the wrong code. */
export const JOIN_MS = 6000
export const NAME_MAX = 16

/* ----------------------------------------------------------------------------------------------- messages */

export type NetEvent =
  | { k: 'play'; id: string; tile: Tile; end: End; start: boolean }
  | { k: 'miss'; id: string; tile: Tile; end: End; penalty: boolean }
  | { k: 'draw'; id: string }
  | { k: 'pass'; id: string }
  | { k: 'out'; id: string }
  | { k: 'blocked' }
  | { k: 'left'; id: string }
  | { k: 'last' }

export interface PlayerInfo {
  id: string
  name: string
  /** tiles in the hand */
  count: number
  gone: boolean
  mistakes: number
}
export interface Snapshot {
  ver: number
  phase: 'lobby' | 'play' | 'over'
  host: string
  mode: ModeId
  level: Level
  players: PlayerInfo[]
  turn: string | null
  chain: Placed[]
  boneyard: number
  /** what happened in the step that made this snapshot */
  events: NetEvent[]
  /** at the end of a game: where each player stands */
  ranks: { id: string; rank: number; count: number }[] | null
}

export type DenyReason = 'full' | 'started' | 'out'
export type Msg =
  | { t: 'hello'; id: string; name: string }
  | { t: 'ping'; id: string }
  | { t: 'act'; id: string; a: Action; n: number }
  | { t: 'bye'; id: string }
  | { t: 'probe' }
  | { t: 'snap'; s: Snapshot }
  | { t: 'hand'; to: string; ver: number; tiles: Tile[] }
  | { t: 'beat'; host: string; ver: number }
  | { t: 'deny'; to: string; why: DenyReason }
  | { t: 'refuse'; to: string; why: Refusal; n: number }
  | { t: 'closed'; host: string }

/** Anything that carries a message to the others in the room, and hands the others' messages to a listener. The sender does not hear its own. */
export interface Bus {
  send(msg: Msg): void
  onMessage(fn: (msg: Msg) => void): () => void
  close(): void
}
export interface Clock {
  now(): number
  setTimeout(fn: () => void, ms: number): unknown
  clearTimeout(handle: unknown): void
}
export const realClock: Clock = {
  now: () => Date.now(),
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (h) => clearTimeout(h as ReturnType<typeof setTimeout>),
}

/* ----------------------------------------------------------------------------------------------- what is accepted from the network */

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)
const isInt = (x: unknown, lo: number, hi: number): x is number => typeof x === 'number' && Number.isInteger(x) && x >= lo && x <= hi
const isStr = (x: unknown, max: number): x is string => typeof x === 'string' && x.length >= 1 && x.length <= max
/** The only TeX a tile ever shows: digits, signs, brackets, \frac, \times and \div. The host is another person's browser, so nothing else is rendered. */
export const TEX_OK = /^(?:[0-9+\-(){} ]|\\frac|\\times|\\div)*$/
const isId = (x: unknown): x is string => isStr(x, 24) && /^[A-Za-z0-9_-]+$/.test(x as string)

function parseHalf(x: unknown): Half | null {
  return isObj(x) && isInt(x.v, 0, VALUES - 1) && typeof x.tex === 'string' && x.tex.length >= 1 && x.tex.length <= 120 && TEX_OK.test(x.tex) ? { v: x.v, tex: x.tex } : null
}
export function parseTile(x: unknown): Tile | null {
  if (!isObj(x) || !isInt(x.id, 0, TILE_COUNT - 1)) return null
  const a = parseHalf(x.a)
  const b = parseHalf(x.b)
  return a && b ? { id: x.id, a, b } : null
}
const parseEnd = (x: unknown): End | null => (x === 'left' || x === 'right' ? x : null)
export function parseAction(x: unknown): Action | null {
  if (!isObj(x)) return null
  if (x.t === 'draw') return { t: 'draw' }
  if (x.t === 'pass') return { t: 'pass' }
  const end = parseEnd(x.end)
  return x.t === 'play' && isInt(x.tile, 0, TILE_COUNT - 1) && end ? { t: 'play', tile: x.tile, end } : null
}
function parseEvent(x: unknown): NetEvent | null {
  if (!isObj(x)) return null
  switch (x.k) {
    case 'play': {
      const tile = parseTile(x.tile)
      const end = parseEnd(x.end)
      return isId(x.id) && tile && end && typeof x.start === 'boolean' ? { k: 'play', id: x.id, tile, end, start: x.start } : null
    }
    case 'miss': {
      const tile = parseTile(x.tile)
      const end = parseEnd(x.end)
      return isId(x.id) && tile && end && typeof x.penalty === 'boolean' ? { k: 'miss', id: x.id, tile, end, penalty: x.penalty } : null
    }
    case 'draw':
    case 'pass':
    case 'out':
    case 'left':
      return isId(x.id) ? { k: x.k, id: x.id } : null
    case 'blocked':
    case 'last':
      return { k: x.k }
    default:
      return null
  }
}
function parseList<T>(x: unknown, max: number, one: (y: unknown) => T | null): T[] | null {
  if (!Array.isArray(x) || x.length > max) return null
  const out: T[] = []
  for (const y of x) {
    const p = one(y)
    if (!p) return null
    out.push(p)
  }
  return out
}
export function parseSnapshot(x: unknown): Snapshot | null {
  if (!isObj(x) || !isInt(x.ver, 0, 1e9) || !isId(x.host) || !isModeId(x.mode) || !isLevel(x.level) || !isInt(x.boneyard, 0, TILE_COUNT)) return null
  if (x.phase !== 'lobby' && x.phase !== 'play' && x.phase !== 'over') return null
  const players = parseList(x.players, MAX_PLAYERS, (p) =>
    isObj(p) && isId(p.id) && isStr(p.name, NAME_MAX * 2) && isInt(p.count, 0, TILE_COUNT) && typeof p.gone === 'boolean' && isInt(p.mistakes, 0, 1e6)
      ? { id: p.id, name: p.name, count: p.count, gone: p.gone, mistakes: p.mistakes }
      : null,
  )
  const chain = parseList(x.chain, TILE_COUNT, (c) => {
    const tile = isObj(c) ? parseTile(c.tile) : null
    return isObj(c) && tile && typeof c.flip === 'boolean' ? { tile, flip: c.flip } : null
  })
  const events = parseList(x.events, 8, parseEvent)
  const ranks =
    x.ranks === null
      ? null
      : parseList(x.ranks, MAX_PLAYERS, (r) => (isObj(r) && isId(r.id) && isInt(r.rank, 1, MAX_PLAYERS) && isInt(r.count, 0, TILE_COUNT) ? { id: r.id, rank: r.rank, count: r.count } : null))
  if (!players || !chain || !events || (x.ranks !== null && !ranks)) return null
  if (x.turn !== null && !isId(x.turn)) return null
  return { ver: x.ver, phase: x.phase, host: x.host, mode: x.mode, level: x.level, players, turn: x.turn as string | null, chain, boneyard: x.boneyard, events, ranks }
}
const REFUSALS: Refusal[] = ['over', 'turn', 'tile', 'has-move', 'empty-boneyard', 'draw-first', 'bad']
/** A message from the network, or null if it is not one. Nothing else gets into the sessions. */
export function parseMsg(x: unknown): Msg | null {
  if (!isObj(x)) return null
  switch (x.t) {
    case 'hello':
      return isId(x.id) && typeof x.name === 'string' && x.name.length <= 80 ? { t: 'hello', id: x.id, name: x.name } : null
    case 'ping':
    case 'bye':
      return isId(x.id) ? { t: x.t, id: x.id } : null
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
    case 'hand': {
      const tiles = parseList(x.tiles, TILE_COUNT, parseTile)
      return isId(x.to) && isInt(x.ver, 0, 1e9) && tiles ? { t: 'hand', to: x.to, ver: x.ver, tiles } : null
    }
    case 'beat':
      return isId(x.host) && isInt(x.ver, 0, 1e9) ? { t: 'beat', host: x.host, ver: x.ver } : null
    case 'deny':
      return isId(x.to) && (x.why === 'full' || x.why === 'started' || x.why === 'out') ? { t: 'deny', to: x.to, why: x.why } : null
    case 'refuse':
      return isId(x.to) && REFUSALS.includes(x.why as Refusal) && isInt(x.n, 0, 1e9) ? { t: 'refuse', to: x.to, why: x.why as Refusal, n: x.n } : null
    case 'closed':
      return isId(x.host) ? { t: 'closed', host: x.host } : null
    default:
      return null
  }
}

/** A name another player can read: no control characters, no long runs of spaces, at most 16 characters. */
export function cleanName(s: string, fallback = 'Player'): string {
  // eslint-disable-next-line no-control-regex
  const t = s.replace(/[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁦-⁩]/g, '').replace(/\s+/g, ' ').trim()
  return Array.from(t).slice(0, NAME_MAX).join('').trim() || fallback
}

/* ----------------------------------------------------------------------------------------------- rooms */

/** Room codes avoid the letters and digits that look alike (I, O, 0, 1). */
export const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const CODE_LENGTH = 4
export function newRoomCode(rand: () => number = Math.random): string {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[Math.floor(rand() * CODE_ALPHABET.length)]).join('')
}
/** What a player typed, as a room code, or null. Lower case and stray spaces are forgiven; O and I are read as 0 and 1 only if they are not in the alphabet. */
export function parseRoomCode(s: string): string | null {
  const t = s.toUpperCase().replace(/[\s-]/g, '')
  return t.length === CODE_LENGTH && Array.from(t).every((c) => CODE_ALPHABET.includes(c)) ? t : null
}

/* ----------------------------------------------------------------------------------------------- snapshots */

export interface TableView {
  me: string
  isHost: boolean
  link: 'joining' | 'ok' | 'notfound' | 'full' | 'started' | 'out' | 'lost' | 'closed'
  snap: Snapshot | null
  hand: Tile[]
  /** the last action the referee refused, with a counter so the same reason can show twice */
  refusal: { n: number; why: Refusal } | null
  /** an action has been sent and the table has not changed yet */
  waiting: boolean
}

const netEvents = (events: GameEvent[], ids: string[]): NetEvent[] =>
  events.map((e): NetEvent => {
    switch (e.k) {
      case 'play':
        return { k: 'play', id: ids[e.p], tile: e.tile, end: e.end, start: e.start }
      case 'miss':
        return { k: 'miss', id: ids[e.p], tile: e.tile, end: e.end, penalty: e.penalty }
      case 'blocked':
      case 'last':
        return { k: e.k }
      default:
        return { k: e.k, id: ids[e.p] }
    }
  })

/** The public picture of a table. `ids` and `names` are the players in seat order; with no game yet (a lobby) everyone holds nothing. */
export function snapshotOf(a: { ver: number; phase: Snapshot['phase']; host: string; mode: ModeId; level: Level; ids: string[]; names: string[]; game: Game | null; events: GameEvent[] }): Snapshot {
  const g = a.game
  return {
    ver: a.ver,
    phase: a.phase,
    host: a.host,
    mode: a.mode,
    level: a.level,
    players: a.ids.map((id, p) => ({ id, name: a.names[p], count: g ? g.hands[p].length : 0, gone: g ? g.gone[p] : false, mistakes: g ? g.mistakes[p] : 0 })),
    turn: g && g.status === 'play' ? a.ids[g.turn] : null,
    chain: g ? g.chain : [],
    boneyard: g ? g.boneyard.length : 0,
    events: netEvents(a.events, a.ids),
    ranks: g && g.status === 'over' ? standings(g).map((s) => ({ id: a.ids[s.p], rank: s.rank, count: s.count })) : null,
  }
}

export interface Session {
  readonly me: string
  readonly isHost: boolean
  view(): TableView
  subscribe(fn: () => void): () => void
  act(a: Action): void
  leave(): void
}

/* ----------------------------------------------------------------------------------------------- the host */

interface Member {
  id: string
  name: string
  seen: number
}

export class HostSession implements Session {
  readonly isHost = true
  private members: Member[]
  private game: Game | null = null
  private phase: Snapshot['phase'] = 'lobby'
  private ver = 0
  private events: GameEvent[] = []
  private listeners = new Set<() => void>()
  private cache: TableView
  private refusalN = 0
  private refusal: TableView['refusal'] = null
  private timer: unknown = null
  private off: () => void
  private closed = false
  mode: ModeId
  level: Level

  constructor(
    readonly me: string,
    name: string,
    private bus: Bus,
    private clock: Clock,
    mode: ModeId,
    level: Level,
    private seed: () => number = () => Math.floor(Math.random() * 2 ** 31),
  ) {
    this.mode = mode
    this.level = level
    this.members = [{ id: me, name: cleanName(name), seen: clock.now() }]
    this.cache = this.makeView()
    this.off = bus.onMessage((m) => this.onMessage(m))
    this.changed()
    this.schedule()
  }

  /* --- the table */
  private ids = (): string[] => this.members.map((m) => m.id)
  private snapshot(): Snapshot {
    return snapshotOf({ ver: this.ver, phase: this.phase, host: this.me, mode: this.mode, level: this.level, ids: this.ids(), names: this.members.map((m) => m.name), game: this.game, events: this.events })
  }
  private makeView(): TableView {
    const at = this.members.findIndex((m) => m.id === this.me)
    return { me: this.me, isHost: true, link: 'ok', snap: this.members ? this.snapshot() : null, hand: this.game ? this.game.hands[at] : [], refusal: this.refusal, waiting: false }
  }
  view(): TableView {
    return this.cache
  }
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
  /** Something changed: a new version, told to everyone. */
  private changed(): void {
    if (this.closed) return
    this.ver++
    this.cache = this.makeView()
    this.events = []
    this.bus.send({ t: 'snap', s: this.cache.snap as Snapshot })
    this.listeners.forEach((f) => f())
  }
  private sendHand(id: string): void {
    if (!this.game || id === this.me) return
    const at = this.members.findIndex((m) => m.id === id)
    if (at >= 0) this.bus.send({ t: 'hand', to: id, ver: this.ver, tiles: this.game.hands[at] })
  }
  private sendHands(): void {
    for (const m of this.members) this.sendHand(m.id)
  }

  /* --- the room */
  /** Host only: change what will be played (in the lobby). */
  configure(mode: ModeId, level: Level): void {
    if (this.phase !== 'lobby') return
    this.mode = mode
    this.level = level
    this.changed()
  }
  canStart(): boolean {
    return this.phase === 'lobby' && this.members.length >= MIN_PLAYERS
  }
  start(): boolean {
    if (!this.canStart()) return false
    this.game = newGame(this.mode, this.level, this.members.length, this.seed())
    this.phase = 'play'
    this.changed()
    this.sendHands()
    return true
  }
  /** Host only: back to the lobby after a game, with the players who are still here. */
  again(): void {
    if (this.phase !== 'over') return
    const game = this.game
    this.members = this.members.filter((_, p) => !game || !game.gone[p])
    this.game = null
    this.phase = 'lobby'
    this.changed()
  }
  private hello(id: string, name: string): void {
    const at = this.members.findIndex((m) => m.id === id)
    if (at >= 0) {
      if (this.game && this.game.gone[at]) {
        this.bus.send({ t: 'deny', to: id, why: 'out' })
        return
      }
      this.members[at].seen = this.clock.now()
      this.bus.send({ t: 'snap', s: this.cache.snap as Snapshot })
      this.sendHand(id)
      return
    }
    if (this.phase !== 'lobby') {
      this.bus.send({ t: 'deny', to: id, why: 'started' })
      return
    }
    if (this.members.length >= MAX_PLAYERS) {
      this.bus.send({ t: 'deny', to: id, why: 'full' })
      return
    }
    let clean = cleanName(name)
    const taken = (n: string) => this.members.some((m) => m.name === n)
    for (let k = 2; taken(clean) && k < 20; k++) clean = `${cleanName(name).slice(0, NAME_MAX - 4)} ${k}`
    this.members.push({ id, name: clean, seen: this.clock.now() })
    this.changed()
  }
  private drop(id: string): void {
    const at = this.members.findIndex((m) => m.id === id)
    if (at <= 0) return
    if (this.phase === 'lobby') {
      this.members.splice(at, 1)
      this.changed()
    } else if (this.phase === 'play' && this.game && !this.game.gone[at]) {
      const r = removePlayer(this.game, at)
      this.game = r.g
      this.events.push(...r.events)
      if (this.game.status === 'over') this.phase = 'over'
      this.changed()
    }
  }

  /* --- play */
  act(a: Action): void {
    this.apply(this.me, a)
  }
  private apply(id: string, a: Action, n = 0): void {
    const at = this.members.findIndex((m) => m.id === id)
    const res = this.game && this.phase === 'play' && at >= 0 ? playAct(this.game, at, a) : null
    if (!res || !res.ok) {
      const why: Refusal = res ? res.reason : 'over'
      if (id === this.me) {
        this.refusal = { n: ++this.refusalN, why }
        this.cache = { ...this.makeView() }
        this.listeners.forEach((f) => f())
      } else this.bus.send({ t: 'refuse', to: id, why, n })
      return
    }
    this.game = res.g
    this.events.push(...res.events)
    if (res.g.status === 'over') this.phase = 'over'
    this.changed()
    this.sendHand(id)
  }

  /* --- the network */
  private onMessage(m: Msg): void {
    if (this.closed) return
    switch (m.t) {
      case 'probe':
        this.bus.send({ t: 'beat', host: this.me, ver: this.ver })
        break
      case 'hello':
        if (m.id !== this.me) this.hello(m.id, m.name)
        break
      case 'ping':
      case 'act': {
        const mem = this.members.find((x) => x.id === m.id)
        if (mem) mem.seen = this.clock.now()
        if (m.t === 'act' && m.id !== this.me) this.apply(m.id, m.a, m.n)
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
      this.bus.send({ t: 'beat', host: this.me, ver: this.ver })
      const now = this.clock.now()
      for (const m of [...this.members]) if (m.id !== this.me && now - m.seen > ABSENT_MS) this.drop(m.id)
      this.schedule()
    }, BEAT_MS)
  }
  leave(): void {
    if (this.closed) return
    this.bus.send({ t: 'closed', host: this.me })
    this.closed = true
    this.clock.clearTimeout(this.timer)
    this.off()
    this.bus.close()
  }
}

/* ----------------------------------------------------------------------------------------------- a player */

export class ClientSession implements Session {
  readonly isHost = false
  private snap: Snapshot | null = null
  private hand: Tile[] = []
  private handVer = -1
  private link: TableView['link'] = 'joining'
  private heard: number
  private host: string | null = null
  private refusal: TableView['refusal'] = null
  private waiting = false
  private sentAt = 0
  private actN = 0
  private resyncAt = 0
  private timer: unknown = null
  private hello: unknown = null
  private startedAt: number
  private listeners = new Set<() => void>()
  private cache: TableView
  private off: () => void
  private closed = false

  constructor(
    readonly me: string,
    private name: string,
    private bus: Bus,
    private clock: Clock,
  ) {
    this.heard = clock.now()
    this.startedAt = clock.now()
    this.cache = this.makeView()
    this.off = bus.onMessage((m) => this.onMessage(m))
    this.sayHello()
    this.tick()
  }

  private makeView(): TableView {
    // a request that was never answered must not leave the buttons dead
    const waiting = this.waiting && this.clock.now() - this.sentAt < 4000
    return { me: this.me, isHost: false, link: this.link, snap: this.snap, hand: this.hand, refusal: this.refusal, waiting }
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
    this.bus.send({ t: 'hello', id: this.me, name: this.name })
  }
  act(a: Action): void {
    if (this.closed || this.link !== 'ok') return
    this.waiting = true
    this.sentAt = this.clock.now()
    this.bus.send({ t: 'act', id: this.me, a, n: ++this.actN })
    this.changed()
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
        const me = s.players.find((p) => p.id === this.me)
        if (me && me.gone) this.link = 'out'
        else if (me) {
          if (this.link === 'notfound') this.tick()
          if (this.link !== 'closed' && this.link !== 'out') this.link = 'ok'
        } else if (this.link === 'ok') this.link = 'out'
        if (this.snap === null || s.ver > this.snap.ver) this.waiting = false
        if (s.phase === 'lobby') this.hand = []
        this.snap = s
        this.changed()
        break
      }
      case 'hand':
        if (m.to === this.me && m.ver >= this.handVer) {
          this.hand = m.tiles
          this.handVer = m.ver
          this.waiting = false
          this.changed()
        }
        break
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
        if (m.to === this.me) {
          this.link = m.why
          this.stop()
          this.changed()
        }
        break
      case 'refuse':
        if (m.to === this.me) {
          this.refusal = { n: m.n, why: m.why }
          this.waiting = false
          // the referee knows better than this player's copy of the hand: ask for it again (not more than once a second)
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
    this.clock.clearTimeout(this.hello)
    this.timer = this.hello = null
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
        this.bus.send({ t: 'ping', id: this.me })
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
    this.bus.send({ t: 'bye', id: this.me })
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
