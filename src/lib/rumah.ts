/** Rumah Perkalian (Multiplication House) and Rumah Penjumlahan (Addition House): one engine for both.
 *
 *  A 9 x 9 board holds every result of two numbers from 1 to 9: the 81 products 1x1 ... 9x9, or the 81 sums 1+1 ... 9+9. Each player has a pawn on a strip of
 *  the numbers 1 to 9. On your turn you must move *your* pawn to another number, work out the result of the two pawns, and claim a cell of the board that
 *  holds that result. Four cells in a row, in a column or on a diagonal win. A cell that does not hold the result loses the game (the player has a few
 *  seconds to undo a click; that window is in the screen, the engine only sees the click that was kept).
 *
 *  Everything here is pure and seeded (no Math.random, no clock), so the same play can be run by a script: the screen, the online referee and the checker
 *  all use these functions. The computer opponent (six levels) is at the end. */

import { makeRng, type Rng } from './domino'

export { makeRng, type Rng }

export type Op = 'times' | 'plus'
export type Color = 'blue' | 'gold'
export const OPS: Op[] = ['times', 'plus']
export const COLORS: Color[] = ['blue', 'gold']
export const isOp = (x: unknown): x is Op => x === 'times' || x === 'plus'
export const isColor = (x: unknown): x is Color => x === 'blue' || x === 'gold'
export const other = (c: Color): Color => (c === 'blue' ? 'gold' : 'blue')

export const SIZE = 9
export const CELLS = SIZE * SIZE
export const CENTER = (CELLS - 1) / 2
/** four in a row win */
export const WIN = 4
/** the numbers a pawn can stand on */
export const FACTORS = 9
/** seconds to undo a click on the board */
export const CONFIRM_SECONDS = 5
/** the time limit of a turn, in seconds: what can be chosen and the usual one */
export const TIME_MIN = 5
export const TIME_MAX = 300
export const TIME_DEFAULT = 60
/** a player who is away when the turn comes to them has this long (or the time limit, if that is shorter) to come back */
export const AWAY_GRACE_S = 30
/** the computer has six levels, 0 to 5 */
export const LEVELS = 6
export const MAX_LEVEL = LEVELS - 1

/** What the two pawns make: the product, or the sum. */
export const combine = (op: Op, a: number, b: number): number => (op === 'times' ? a * b : a + b)
/** The symbol between the pawns. */
export const symbol = (op: Op): string => (op === 'times' ? '×' : '+')
/** The one result that is on the board only once; it is pinned to the middle cell (1x1 = 1, 1+1 = 2). */
export const centerValue = (op: Op): number => combine(op, 1, 1)

/* ----------------------------------------------------------------------------------------------- the board */

export interface Cell {
  value: number
  owner: Color | null
}

/** The 81 results in a new order for every game, except the one that occurs once (1 or 2): it is the middle cell. */
export function buildBoard(op: Op, rng: Rng): Cell[] {
  const values: number[] = []
  for (let i = 1; i <= FACTORS; i++) for (let j = 1; j <= FACTORS; j++) values.push(combine(op, i, j))
  values.splice(values.indexOf(centerValue(op)), 1)
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[values[i], values[j]] = [values[j], values[i]]
  }
  const cells: Cell[] = []
  let s = 0
  for (let idx = 0; idx < CELLS; idx++) cells.push({ value: idx === CENTER ? centerValue(op) : values[s++], owner: null })
  return cells
}

/** The longest line through `index` made of cells of `owner`, if it has WIN or more. */
export function lineThrough(board: readonly Cell[], index: number, owner: Color): number[] | null {
  const row = Math.floor(index / SIZE)
  const col = index % SIZE
  for (const [dr, dc] of [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]) {
    const line = [index]
    let r = row - dr
    let c = col - dc
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r * SIZE + c].owner === owner) {
      line.unshift(r * SIZE + c)
      r -= dr
      c -= dc
    }
    r = row + dr
    c = col + dc
    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r * SIZE + c].owner === owner) {
      line.push(r * SIZE + c)
      r += dr
      c += dc
    }
    if (line.length >= WIN) return line
  }
  return null
}

/* ----------------------------------------------------------------------------------------------- the game */

export type Why = 'line' | 'full' | 'wrong-cell' | 'time' | 'missed-turn'
export const WHYS: Why[] = ['line', 'full', 'wrong-cell', 'time', 'missed-turn']

export interface Game {
  op: Op
  board: Cell[]
  /** where each pawn stands; null until the first player has placed both */
  pawn: Record<Color, number | null>
  /** who started */
  first: Color
  /** whose turn it is */
  current: Color
  status: 'play' | 'over'
  /** null while playing, and in a draw */
  winner: Color | null
  /** the four or more cells that won */
  line: number[]
  /** the very first turn: the first player sets both pawns before there is a result */
  placing: boolean
  /** the pawns the first player has set so far */
  pending: Record<Color, number | null>
  /** the pawn was moved this turn (it must be, before a cell can be claimed) */
  moved: boolean
  why: Why | null
  /** turns passed: it goes up when the turn goes to the other player */
  turn: number
}

export type GameEvent =
  /** a pawn was put on a number; `start` on the very first turn, when the first player sets both pawns */
  | { k: 'pawn'; c: Color; pawn: Color; n: number; start: boolean }
  | { k: 'claim'; c: Color; i: number; v: number }
  | { k: 'pass'; c: Color; v: number }
  | { k: 'wrong'; c: Color; i: number; v: number }
  | { k: 'line'; c: Color }
  | { k: 'full' }
  | { k: 'time'; c: Color }
  | { k: 'missed'; c: Color }

export type Refusal = 'over' | 'bad' | 'same' | 'moved' | 'not-set' | 'not-moved' | 'taken' | 'turn'
export type Result = { ok: true; g: Game; events: GameEvent[] } | { ok: false; reason: Refusal }

export function newGame(op: Op, first: Color, seed: number): Game {
  return {
    op,
    board: buildBoard(op, makeRng(seed)),
    pawn: { blue: null, gold: null },
    first,
    current: first,
    status: 'play',
    winner: null,
    line: [],
    placing: true,
    pending: { blue: null, gold: null },
    moved: false,
    why: null,
    turn: 0,
  }
}

export const copy = (g: Game): Game => ({ ...g, board: g.board.map((c) => ({ ...c })), pawn: { ...g.pawn }, pending: { ...g.pending }, line: [...g.line] })

/** What the pawns make now, or null before both are set. */
export const resultOf = (g: Game): number | null => (g.pawn.blue === null || g.pawn.gold === null ? null : combine(g.op, g.pawn.blue, g.pawn.gold))
/** The empty cells that hold the result. */
export function openCells(g: Game): number[] {
  const v = resultOf(g)
  const out: number[] = []
  if (v === null) return out
  g.board.forEach((c, i) => {
    if (c.owner === null && c.value === v) out.push(i)
  })
  return out
}
export const countOf = (g: Game, c: Color): number => g.board.reduce((n, x) => n + (x.owner === c ? 1 : 0), 0)

function advance(g: Game): void {
  g.current = other(g.current)
  g.turn += 1
  g.moved = false
}

/** After a pawn was moved: if every cell with the result is covered the turn passes, otherwise the player claims one. */
function afterPawn(g: Game, events: GameEvent[]): void {
  g.moved = true
  const v = resultOf(g) as number
  if (openCells(g).length === 0) {
    events.push({ k: 'pass', c: g.current, v })
    advance(g)
  }
}

/** The player whose turn it is puts a pawn on a number. The first turn sets the blue pawn, then the gold one (any numbers, even the same); later the player
 *  moves their own pawn to a different number, once: the place the pawn left cannot be chosen again in the same turn. */
export function setPawn(g0: Game, n: number): Result {
  if (g0.status !== 'play') return { ok: false, reason: 'over' }
  if (!Number.isInteger(n) || n < 1 || n > FACTORS) return { ok: false, reason: 'bad' }
  const g = copy(g0)
  const events: GameEvent[] = []
  if (g.placing) {
    const which: Color = g.pending.blue === null ? 'blue' : 'gold'
    g.pending[which] = n
    events.push({ k: 'pawn', c: g.current, pawn: which, n, start: true })
    if (which === 'gold') {
      g.pawn = { blue: g.pending.blue, gold: g.pending.gold }
      g.placing = false
      afterPawn(g, events)
    }
    return { ok: true, g, events }
  }
  // the pawn moves once a turn: when it has moved, the turn goes on with taking a cell, and the pawn cannot be moved again (nor back to where it was)
  if (g.moved) return { ok: false, reason: 'moved' }
  if (g.pawn[g.current] === n) return { ok: false, reason: 'same' }
  g.pawn[g.current] = n
  events.push({ k: 'pawn', c: g.current, pawn: g.current, n, start: false })
  afterPawn(g, events)
  return { ok: true, g, events }
}

/** The player claims a cell. A cell that does not hold the result loses the game at once (the screen gives the player a few seconds to undo the click
 *  before it gets here). */
export function claim(g0: Game, index: number): Result {
  if (g0.status !== 'play') return { ok: false, reason: 'over' }
  if (g0.placing || resultOf(g0) === null) return { ok: false, reason: 'not-set' }
  if (!g0.moved) return { ok: false, reason: 'not-moved' }
  if (!Number.isInteger(index) || index < 0 || index >= CELLS) return { ok: false, reason: 'bad' }
  const cell = g0.board[index]
  if (cell.owner !== null) return { ok: false, reason: 'taken' }
  const g = copy(g0)
  const events: GameEvent[] = []
  const v = resultOf(g) as number
  const me = g.current
  if (cell.value !== v) {
    events.push({ k: 'wrong', c: me, i: index, v: cell.value })
    g.status = 'over'
    g.winner = other(me)
    g.why = 'wrong-cell'
    return { ok: true, g, events }
  }
  g.board[index].owner = me
  events.push({ k: 'claim', c: me, i: index, v })
  const line = lineThrough(g.board, index, me)
  if (line) {
    g.status = 'over'
    g.winner = me
    g.line = line
    g.why = 'line'
    events.push({ k: 'line', c: me })
    return { ok: true, g, events }
  }
  if (g.board.every((c) => c.owner !== null)) {
    g.status = 'over'
    g.why = 'full'
    events.push({ k: 'full' })
    return { ok: true, g, events }
  }
  advance(g)
  return { ok: true, g, events }
}

/** The time of the turn ran out (or, with `missed`, the player stayed away until it was their turn and the grace ran out). */
export function timeUp(g0: Game, missed = false): Result {
  if (g0.status !== 'play') return { ok: false, reason: 'over' }
  const g = copy(g0)
  g.status = 'over'
  g.winner = other(g.current)
  g.why = missed ? 'missed-turn' : 'time'
  return { ok: true, g, events: [{ k: missed ? 'missed' : 'time', c: g.current }] }
}

/** Would `color` claiming this empty cell make a line? (For the computer and the checker; nothing changes.) */
export function wouldWin(g: Game, index: number, color: Color): boolean {
  const cell = g.board[index]
  if (!cell || cell.owner !== null) return false
  cell.owner = color
  const line = lineThrough(g.board, index, color)
  cell.owner = null
  return line !== null
}

/** The whole move of a turn, as the computer and the checker's players make it: set the pawn, then claim. */
export interface Decision {
  n: number
  /** null when the result is already all covered and the turn simply passes */
  cell: number | null
}

/* ----------------------------------------------------------------------------------------------- the computer */

const pickOne = <T>(rng: Rng, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)]

function winningCells(g: Game, color: Color): number[] {
  const out: number[] = []
  for (let i = 0; i < CELLS; i++) if (g.board[i].owner === null && wouldWin(g, i, color)) out.push(i)
  return out
}

/** Every (pawn number, cell) the computer could play: moving its pawn to some other number n makes a result with the other pawn, and any empty cell that
 *  holds it can be claimed. A number whose result is covered everywhere only passes the turn. */
function moveList(g: Game, me: Color): { moves: { n: number; cell: number; value: number }[]; passOnly: number[] } {
  const you = other(me)
  const yours = g.pawn[you] as number
  const mine = g.pawn[me]
  const moves: { n: number; cell: number; value: number }[] = []
  const passOnly: number[] = []
  for (let n = 1; n <= FACTORS; n++) {
    if (n === mine) continue
    const value = combine(g.op, n, yours)
    const cells: number[] = []
    for (let i = 0; i < CELLS; i++) if (g.board[i].owner === null && g.board[i].value === value) cells.push(i)
    if (cells.length === 0) passOnly.push(n)
    else for (const cell of cells) moves.push({ n, cell, value })
  }
  return { moves, passOnly }
}

/** After the computer leaves its pawn on n, could the other player make four in a row on the very next turn, with any pawn move and any cell? */
function leavesDanger(g: Game, me: Color, n: number): boolean {
  const you = other(me)
  const yourPawn = g.pawn[you]
  const danger = winningCells(g, you)
  if (danger.length === 0) return false
  for (let h = 1; h <= FACTORS; h++) {
    if (h === yourPawn) continue
    const value = combine(g.op, n, h)
    for (const i of danger) if (g.board[i].value === value) return true
  }
  return false
}

function futureThreats(g: Game, me: Color, cell: number): number {
  g.board[cell].owner = me
  const score = winningCells(g, me).length
  g.board[cell].owner = null
  return score
}

/**
 * The computer's turn (its pawns are already placed). Each level keeps everything the level below it does and adds something, so a higher level is never weaker:
 *   0, 1  plays at random (level 0 also always shows the help, which the screen does)
 *   2     always takes a win that is free, and always blocks the other player's win
 *   3     as 2, and half of the time also avoids leaving a number that gives the other player a win
 *   4     as 3, and always avoids it
 *   5     as 4, and among the safe moves builds its own threats
 * Returns null only if there is nothing to play (it cannot happen: eight numbers are always free).
 */
export function decide(g: Game, me: Color, level: number, rng: Rng): Decision | null {
  const { moves, passOnly } = moveList(g, me)
  if (moves.length === 0) return passOnly.length ? { n: pickOne(rng, passOnly), cell: null } : null
  if (level <= 1) {
    const m = pickOne(rng, moves)
    return { n: m.n, cell: m.cell }
  }
  const mine = winningCells(g, me)
  if (mine.length) {
    const wins = moves.filter((m) => mine.includes(m.cell))
    if (wins.length) {
      const m = pickOne(rng, wins)
      return { n: m.n, cell: m.cell }
    }
  }
  const yours = winningCells(g, other(me))
  if (yours.length) {
    const blocks = moves.filter((m) => yours.includes(m.cell))
    if (blocks.length) {
      const m = pickOne(rng, blocks)
      return { n: m.n, cell: m.cell }
    }
  }
  const safe = moves.filter((m) => !leavesDanger(g, me, m.n))
  const done = (m: { n: number; cell: number }): Decision => ({ n: m.n, cell: m.cell })
  if (level === 2) return done(pickOne(rng, moves))
  if (level === 3) {
    if (rng() < 0.5) return done(pickOne(rng, moves))
    return done(pickOne(rng, safe.length ? safe : moves))
  }
  if (level === 4) return done(pickOne(rng, safe.length ? safe : moves))
  const pool = safe.length ? safe : moves
  let best = pool[0]
  let bestScore = -1
  for (const m of pool) {
    const s = futureThreats(g, me, m.cell)
    if (s > bestScore) {
      bestScore = s
      best = m
    }
  }
  return done(best)
}

/** The two first pawns when the computer starts: nothing is at stake yet, so any numbers. */
export function decideFirst(rng: Rng): { blue: number; gold: number } {
  return { blue: 1 + Math.floor(rng() * FACTORS), gold: 1 + Math.floor(rng() * FACTORS) }
}

/** Who goes first, from a seed (the coin toss). */
export const coin = (rng: Rng): Color => (rng() < 0.5 ? 'blue' : 'gold')

/** The turn clock: the limit a player may type is kept inside what the game allows. */
export const clampTime = (s: number): number => Math.min(TIME_MAX, Math.max(TIME_MIN, Math.round(Number.isFinite(s) ? s : TIME_DEFAULT)))
