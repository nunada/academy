/** Number Maze (Labirin Angka): you are a number walking through a maze.
 *
 *  A tile that holds an operator changes your value when you step on it, a gate lets you through only when your value fits its condition, and the exit often wants
 *  one exact number. Some operator tiles are used up once (they are a limited supply: *which* ones do you spend, and in what order?), the others never run out.
 *  Keys open the locks of the same number. All values are whole numbers: a division that does not come out even, or a logarithm that is not exact, is simply not
 *  allowed, so that every level can be proved to have a solution.
 *
 *  Everything here is pure (no DOM, no clock, no random), so the screen, the solver and `tools/check-numbermaze.mjs` all play by the very same rules. The idea and
 *  the engine come from the Numaze project; the levels are original.
 *
 *  A level is written as a grid of text, one token per tile, tokens separated by spaces:
 *    #  wall        .  floor        S  start        G  exit, or G?=42 an exit that wants 42
 *    ?<cond>  a gate  (?>=6 ?even ?prime ?x3 ?2..8 ?=1mod2 ?notprime ...)
 *    w^ wv w< w>  a one-way tile: it can be entered from anywhere, but left only in the direction of the arrow
 *    key1..key4  a key        lock1..lock4  a lock (takes a key of the same number, and the key is used up)
 *    +n -n *n /n %n  add, subtract, multiply, divide (only if it comes out even), remainder
 *    ^n  x to the n        n^  n to the x        logn  logarithm to the base n (only if exact)        neg  change sign        abs  absolute value
 *    a trailing !  (+3!  *2!  abs!)  the tile is used up once you have passed it */

export type Dir = 'up' | 'down' | 'left' | 'right'
export interface Vec {
  readonly x: number
  readonly y: number
}
export const DIRS: Record<Dir, Vec> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }
export const ALL_DIRS: Dir[] = ['up', 'right', 'down', 'left']
export const isDir = (x: unknown): x is Dir => x === 'up' || x === 'down' || x === 'left' || x === 'right'

export type Op =
  | { kind: 'add' | 'sub' | 'mul' | 'div' | 'mod' | 'pow' | 'exp' | 'log'; value: number }
  | { kind: 'neg' }
  | { kind: 'abs' }

export type Condition =
  | { kind: 'lt' | 'le' | 'gt' | 'ge' | 'eq' | 'ne'; value: number }
  | { kind: 'even' }
  | { kind: 'odd' }
  | { kind: 'multiple'; value: number }
  | { kind: 'prime' }
  | { kind: 'range'; min: number; max: number }
  /** x is `value` more than a multiple of `modulus` */
  | { kind: 'congruent'; value: number; modulus: number }
  | { kind: 'square' }
  | { kind: 'cube' }
  | { kind: 'not'; inner: Condition }

export type KeyId = 1 | 2 | 3 | 4
export const KEY_IDS: KeyId[] = [1, 2, 3, 4]

export type Tile =
  | { kind: 'wall' }
  | { kind: 'floor' }
  | { kind: 'start' }
  | { kind: 'goal'; condition?: Condition }
  | { kind: 'op'; op: Op; once: boolean; index: number }
  | { kind: 'gate'; condition: Condition }
  | { kind: 'oneway'; dir: Dir }
  | { kind: 'key'; key: KeyId; index: number }
  | { kind: 'lock'; key: KeyId; index: number }

export interface LevelSource {
  id: string
  startValue?: number
  /** the lowest and highest value a level allows (both default to ±MAX_ABS) */
  minValue?: number
  maxValue?: number
  grid: string[]
}
export interface Level {
  readonly id: string
  readonly startValue: number
  readonly minValue: number
  readonly maxValue: number
  readonly width: number
  readonly height: number
  readonly tiles: readonly (readonly Tile[])[]
  readonly start: Vec
  /** how many tiles are used up once (operators with !, keys, locks): the width of the bit mask of what is used */
  readonly consumables: number
  readonly keyBits: Readonly<Record<KeyId, bigint>>
  readonly lockBits: Readonly<Record<KeyId, bigint>>
}

/** a value beyond this is refused, so that numbers stay readable */
export const MAX_ABS = 1_000_000
/** a sanity fence against a broken grid, not a limit of the engine */
export const MAX_CONSUMABLES = 200

/* ----------------------------------------------------------------------------------------------- operators */

export type OpFailure = 'not-divisible' | 'not-exact' | 'undefined' | 'out-of-range'
export type OpResult = { ok: true; value: number } | { ok: false; failure: OpFailure }
const fail = (failure: OpFailure): OpResult => ({ ok: false, failure })

/** What an operator does to a value; it fails (and the step is not taken) when a division leaves a remainder, a logarithm is not exact, or the result is out of range. */
export function applyOp(op: Op, v: number): OpResult {
  let out: number
  switch (op.kind) {
    case 'add':
      out = v + op.value
      break
    case 'sub':
      out = v - op.value
      break
    case 'mul':
      out = v * op.value
      break
    case 'div':
      if (op.value === 0 || v % op.value !== 0) return fail('not-divisible')
      out = v / op.value
      break
    case 'mod':
      if (op.value === 0) return fail('not-divisible')
      // the mathematical remainder: always 0 .. |n|-1, also for a negative value
      out = ((v % op.value) + Math.abs(op.value)) % Math.abs(op.value)
      break
    case 'pow':
      if (op.value < 0) return fail('out-of-range')
      out = Math.pow(v, op.value)
      break
    case 'exp':
      // a negative power would be a fraction
      if (v < 0) return fail('not-exact')
      out = Math.pow(op.value, v)
      break
    case 'log': {
      if (op.value < 2 || v <= 0) return fail('undefined')
      const e = Math.round(Math.log(v) / Math.log(op.value))
      if (Math.pow(op.value, e) !== v) return fail('not-exact')
      out = e
      break
    }
    case 'neg':
      out = -v
      break
    case 'abs':
      out = Math.abs(v)
      break
  }
  if (!Number.isFinite(out) || !Number.isInteger(out) || Math.abs(out) > MAX_ABS) return fail('out-of-range')
  return { ok: true, value: out === 0 ? 0 : out }
}

const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']
const SUP = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']
const script = (n: number, table: readonly string[]): string =>
  String(n)
    .split('')
    .map((d) => table[Number(d)] ?? d)
    .join('')

/** The short label drawn on an operator tile (the same in both languages). */
export function formatOp(op: Op): string {
  switch (op.kind) {
    case 'add':
      return `+${op.value}`
    case 'sub':
      return `−${op.value}`
    case 'mul':
      return `×${op.value}`
    case 'div':
      return `÷${op.value}`
    case 'mod':
      return `mod ${op.value}`
    case 'pow':
      return `x${script(op.value, SUP)}`
    case 'exp':
      return `${op.value}ˣ`
    case 'log':
      return `log${script(op.value, SUB)}`
    case 'neg':
      return '±'
    case 'abs':
      return '|x|'
  }
}

export function describeOp(op: Op, lang: string): string {
  const id = lang === 'id'
  switch (op.kind) {
    case 'add':
      return id ? `tambah ${op.value}` : `add ${op.value}`
    case 'sub':
      return id ? `kurangi ${op.value}` : `subtract ${op.value}`
    case 'mul':
      return id ? `kali ${op.value}` : `multiply by ${op.value}`
    case 'div':
      return id ? `bagi ${op.value} (hanya bila habis dibagi)` : `divide by ${op.value} (only if it comes out even)`
    case 'mod':
      return id ? `sisa bagi ${op.value}` : `remainder when divided by ${op.value}`
    case 'pow':
      return id ? `pangkat ${op.value}` : `raise to the power ${op.value}`
    case 'exp':
      return id ? `${op.value} pangkat nilaimu` : `${op.value} to the power of your value`
    case 'log':
      return id ? `logaritma basis ${op.value} (hanya bila hasilnya bulat)` : `logarithm to the base ${op.value} (only if exact)`
    case 'neg':
      return id ? 'ubah tanda' : 'change the sign'
    case 'abs':
      return id ? 'nilai mutlak' : 'absolute value'
  }
}

const OP_PATTERN = /^([+\-*/%^])(-?\d+)$/
const LOG_PATTERN = /^log(\d+)$/
const EXP_PATTERN = /^(\d+)\^$/

/** `+3`, `*2`, `/2`, `%7`, `^2` (x squared), `2^` (2 to the x), `log2`, `neg`, `abs`. */
export function parseOp(token: string): Op | null {
  if (token === 'neg') return { kind: 'neg' }
  if (token === 'abs') return { kind: 'abs' }
  const log = LOG_PATTERN.exec(token)
  if (log) return { kind: 'log', value: Number(log[1]) }
  const exp = EXP_PATTERN.exec(token)
  if (exp) return { kind: 'exp', value: Number(exp[1]) }
  const m = OP_PATTERN.exec(token)
  if (!m) return null
  const value = Number(m[2])
  switch (m[1]) {
    case '+':
      return { kind: 'add', value }
    case '-':
      return { kind: 'sub', value }
    case '*':
      return { kind: 'mul', value }
    case '/':
      return { kind: 'div', value }
    case '%':
      return { kind: 'mod', value }
    case '^':
      return { kind: 'pow', value }
    default:
      return null
  }
}

/* ----------------------------------------------------------------------------------------------- conditions */

export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false
  if (n % 2 === 0) return n === 2
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false
  return true
}

export function testCondition(c: Condition, v: number): boolean {
  switch (c.kind) {
    case 'lt':
      return v < c.value
    case 'le':
      return v <= c.value
    case 'gt':
      return v > c.value
    case 'ge':
      return v >= c.value
    case 'eq':
      return v === c.value
    case 'ne':
      return v !== c.value
    case 'even':
      return v % 2 === 0
    case 'odd':
      return Math.abs(v % 2) === 1
    case 'multiple':
      return c.value !== 0 && v % c.value === 0
    case 'prime':
      return isPrime(v)
    case 'range':
      return v >= c.min && v <= c.max
    case 'congruent': {
      if (c.modulus === 0) return false
      const m = Math.abs(c.modulus)
      return ((v % m) + m) % m === ((c.value % m) + m) % m
    }
    case 'square': {
      if (v < 0) return false
      const r = Math.round(Math.sqrt(v))
      return r * r === v
    }
    case 'cube': {
      // a negative number has a whole cube root too: -8 = (-2)^3
      const r = Math.round(Math.cbrt(v))
      return r * r * r === v
    }
    case 'not':
      return !testCondition(c.inner, v)
  }
}

/** The short label drawn on a gate or on an exit that has a condition. */
export function formatCondition(c: Condition, lang: string): string {
  const id = lang === 'id'
  switch (c.kind) {
    case 'lt':
      return `< ${c.value}`
    case 'le':
      return `≤ ${c.value}`
    case 'gt':
      return `> ${c.value}`
    case 'ge':
      return `≥ ${c.value}`
    case 'eq':
      return `= ${c.value}`
    case 'ne':
      return `≠ ${c.value}`
    case 'even':
      return id ? 'genap' : 'even'
    case 'odd':
      return id ? 'ganjil' : 'odd'
    case 'multiple':
      return id ? `habis\n÷ ${c.value}` : `multiple\nof ${c.value}`
    case 'prime':
      return id ? 'prima' : 'prime'
    case 'range':
      return `${c.min}–${c.max}`
    case 'congruent':
      return `= ${c.value}\nmod ${c.modulus}`
    case 'square':
      return id ? 'kuadrat' : 'square'
    case 'cube':
      return id ? 'kubik' : 'cube'
    case 'not':
      return id ? `bukan ${formatCondition(c.inner, lang)}` : `not ${formatCondition(c.inner, lang)}`
  }
}

/** A whole phrase for the message "the gate is locked". */
export function describeCondition(c: Condition, lang: string): string {
  const id = lang === 'id'
  switch (c.kind) {
    case 'lt':
      return id ? `kurang dari ${c.value}` : `less than ${c.value}`
    case 'le':
      return id ? `maksimal ${c.value}` : `at most ${c.value}`
    case 'gt':
      return id ? `lebih dari ${c.value}` : `more than ${c.value}`
    case 'ge':
      return id ? `minimal ${c.value}` : `at least ${c.value}`
    case 'eq':
      return id ? `tepat ${c.value}` : `exactly ${c.value}`
    case 'ne':
      return id ? `bukan ${c.value}` : `anything but ${c.value}`
    case 'even':
      return id ? 'bilangan genap' : 'an even number'
    case 'odd':
      return id ? 'bilangan ganjil' : 'an odd number'
    case 'multiple':
      return id ? `kelipatan ${c.value}` : `a multiple of ${c.value}`
    case 'prime':
      return id ? 'bilangan prima' : 'a prime number'
    case 'range':
      return id ? `antara ${c.min} dan ${c.max}` : `between ${c.min} and ${c.max}`
    case 'congruent':
      return id ? `sisa ${c.value} bila dibagi ${c.modulus}` : `remainder ${c.value} when divided by ${c.modulus}`
    case 'square':
      return id ? 'bilangan kuadrat sempurna' : 'a perfect square'
    case 'cube':
      return id ? 'bilangan kubik sempurna' : 'a perfect cube'
    case 'not':
      return id ? `bukan ${describeCondition(c.inner, lang)}` : `not ${describeCondition(c.inner, lang)}`
  }
}

const RANGE_PATTERN = /^(-?\d+)\.\.(-?\d+)$/
const COMPARE_PATTERN = /^(<=|>=|!=|<|>|=)(-?\d+)$/
const CONGRUENT_PATTERN = /^=(-?\d+)mod(\d+)$/

/** The part of a gate token after the `?`: `<10`, `>=6`, `=42`, `!=3`, `even`, `odd`, `prime`, `square`, `cube`, `x3`, `2..8`, `=1mod2`, and any of them after `not`. */
export function parseCondition(body: string): Condition | null {
  if (body.startsWith('not') && body.length > 3) {
    const inner = parseCondition(body.slice(3))
    return inner && { kind: 'not', inner }
  }
  if (body === 'even') return { kind: 'even' }
  if (body === 'odd') return { kind: 'odd' }
  if (body === 'prime') return { kind: 'prime' }
  if (body === 'square') return { kind: 'square' }
  if (body === 'cube') return { kind: 'cube' }
  const congruent = CONGRUENT_PATTERN.exec(body)
  if (congruent) {
    const modulus = Number(congruent[2])
    return modulus < 1 ? null : { kind: 'congruent', value: Number(congruent[1]), modulus }
  }
  const range = RANGE_PATTERN.exec(body)
  if (range) return { kind: 'range', min: Number(range[1]), max: Number(range[2]) }
  if (body.startsWith('x')) {
    const n = Number(body.slice(1))
    return Number.isInteger(n) && body.length > 1 ? { kind: 'multiple', value: n } : null
  }
  const cmp = COMPARE_PATTERN.exec(body)
  if (!cmp) return null
  const value = Number(cmp[2])
  switch (cmp[1]) {
    case '<':
      return { kind: 'lt', value }
    case '<=':
      return { kind: 'le', value }
    case '>':
      return { kind: 'gt', value }
    case '>=':
      return { kind: 'ge', value }
    case '=':
      return { kind: 'eq', value }
    case '!=':
      return { kind: 'ne', value }
    default:
      return null
  }
}

/* ----------------------------------------------------------------------------------------------- levels */

const ONEWAY: Record<string, Dir> = { 'w^': 'up', wv: 'down', 'w<': 'left', 'w>': 'right' }
const KEY_PATTERN = /^(key|lock)([1-4])$/

function parseTile(token: string, where: string, nextIndex: () => number): Tile {
  if (token === '#') return { kind: 'wall' }
  if (token === '.') return { kind: 'floor' }
  if (token === 'S') return { kind: 'start' }
  const dir = ONEWAY[token]
  if (dir) return { kind: 'oneway', dir }
  const keyish = KEY_PATTERN.exec(token)
  if (keyish) {
    const key = Number(keyish[2]) as KeyId
    return keyish[1] === 'key' ? { kind: 'key', key, index: nextIndex() } : { kind: 'lock', key, index: nextIndex() }
  }
  if (token.startsWith('G')) {
    const rest = token.slice(1)
    if (rest === '') return { kind: 'goal' }
    if (!rest.startsWith('?')) throw new Error(`${where}: the condition of an exit starts with "?": "${token}"`)
    const condition = parseCondition(rest.slice(1))
    if (!condition) throw new Error(`${where}: unknown condition: "${token}"`)
    return { kind: 'goal', condition }
  }
  if (token.startsWith('?')) {
    const condition = parseCondition(token.slice(1))
    if (!condition) throw new Error(`${where}: unknown condition of a gate: "${token}"`)
    return { kind: 'gate', condition }
  }
  const once = token.endsWith('!')
  const op = parseOp(once ? token.slice(0, -1) : token)
  if (op) return { kind: 'op', op, once, index: once ? nextIndex() : -1 }
  throw new Error(`${where}: unknown token: "${token}"`)
}

export function parseLevel(src: LevelSource): Level {
  if (src.grid.length === 0) throw new Error(`${src.id}: empty grid`)
  const rows = src.grid.map((row) => row.trim().split(/\s+/))
  const width = rows[0].length
  const tiles: Tile[][] = []
  const keyBits: Record<KeyId, bigint> = { 1: 0n, 2: 0n, 3: 0n, 4: 0n }
  const lockBits: Record<KeyId, bigint> = { 1: 0n, 2: 0n, 3: 0n, 4: 0n }
  let start: Vec | null = null
  let hasGoal = false
  let consumables = 0
  const nextIndex = (): number => {
    if (consumables >= MAX_CONSUMABLES) throw new Error(`${src.id}: more than ${MAX_CONSUMABLES} tiles that are used up`)
    return consumables++
  }
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y]
    if (row.length !== width) throw new Error(`${src.id}: row ${y} has ${row.length} tiles, not ${width}`)
    const parsed: Tile[] = []
    for (let x = 0; x < width; x++) {
      const tile = parseTile(row[x], `${src.id} (${x},${y})`, nextIndex)
      if (tile.kind === 'start') {
        if (start) throw new Error(`${src.id}: more than one start`)
        start = { x, y }
      }
      if (tile.kind === 'goal') hasGoal = true
      if (tile.kind === 'key') keyBits[tile.key] |= 1n << BigInt(tile.index)
      if (tile.kind === 'lock') lockBits[tile.key] |= 1n << BigInt(tile.index)
      parsed.push(tile)
    }
    tiles.push(parsed)
  }
  if (!start) throw new Error(`${src.id}: no start "S"`)
  if (!hasGoal) throw new Error(`${src.id}: no exit "G"`)
  for (const id of KEY_IDS) if (lockBits[id] !== 0n && keyBits[id] === 0n) throw new Error(`${src.id}: a lock ${id} and no key ${id}`)
  return { id: src.id, startValue: src.startValue ?? 0, minValue: src.minValue ?? -MAX_ABS, maxValue: src.maxValue ?? MAX_ABS, width, height: rows.length, tiles, start, consumables, keyBits, lockBits }
}

export function tileAt(level: Level, x: number, y: number): Tile {
  if (y < 0 || y >= level.height || x < 0 || x >= level.width) return { kind: 'wall' }
  return level.tiles[y][x]
}

const popcount = (mask: bigint): number => {
  let n = 0
  let m = mask
  while (m !== 0n) {
    m &= m - 1n
    n++
  }
  return n
}
/** The keys of this number still in hand: those picked up, less the locks that took one. */
export const keysInHand = (level: Level, used: bigint, key: KeyId): number => popcount(used & level.keyBits[key]) - popcount(used & level.lockBits[key])
/** Is the tile with this index used up? */
export const isSpent = (used: bigint, index: number): boolean => (used & (1n << BigInt(index))) !== 0n

/* ----------------------------------------------------------------------------------------------- moving */

/** Why a step is not taken. The screen says it in words. */
export type Blocked =
  | { reason: 'wall' }
  | { reason: 'oneway'; dir: Dir }
  | { reason: 'locked'; condition: Condition; exit: boolean }
  | { reason: 'no-key'; key: KeyId }
  | { reason: OpFailure }
  | { reason: 'limit'; high: boolean; limit: number }
  | { reason: 'finished' }

export interface Step {
  pos: Vec
  value: number
  used: bigint
  won: boolean
}
export type StepResult = { ok: true; step: Step } | { ok: false; blocked: Blocked }

/** What one step would do, without changing anything (the solver uses it too). */
export function peekMove(level: Level, pos: Vec, value: number, used: bigint, dir: Dir): StepResult {
  // a one-way tile limits the way OUT of it, not the way in: at a junction only this reading is right (the tile closes the through road, not the door)
  const standing = tileAt(level, pos.x, pos.y)
  if (standing.kind === 'oneway' && standing.dir !== dir) return { ok: false, blocked: { reason: 'oneway', dir: standing.dir } }

  const d = DIRS[dir]
  const next = { x: pos.x + d.x, y: pos.y + d.y }
  const tile = tileAt(level, next.x, next.y)
  const go = (v = value, u = used, won = false): StepResult => ({ ok: true, step: { pos: next, value: v, used: u, won } })
  switch (tile.kind) {
    case 'wall':
      return { ok: false, blocked: { reason: 'wall' } }
    case 'oneway':
    case 'floor':
    case 'start':
      return go()
    case 'gate':
      return testCondition(tile.condition, value) ? go() : { ok: false, blocked: { reason: 'locked', condition: tile.condition, exit: false } }
    case 'goal':
      if (tile.condition && !testCondition(tile.condition, value)) return { ok: false, blocked: { reason: 'locked', condition: tile.condition, exit: true } }
      return go(value, used, true)
    case 'key':
      return go(value, used | (1n << BigInt(tile.index)))
    case 'lock': {
      if (isSpent(used, tile.index)) return go()
      if (keysInHand(level, used, tile.key) < 1) return { ok: false, blocked: { reason: 'no-key', key: tile.key } }
      return go(value, used | (1n << BigInt(tile.index)))
    }
    case 'op': {
      // an operator that is used up is just floor
      if (tile.once && isSpent(used, tile.index)) return go()
      const r = applyOp(tile.op, value)
      if (!r.ok) return { ok: false, blocked: { reason: r.failure } }
      if (r.value > level.maxValue) return { ok: false, blocked: { reason: 'limit', high: true, limit: level.maxValue } }
      if (r.value < level.minValue) return { ok: false, blocked: { reason: 'limit', high: false, limit: level.minValue } }
      return go(r.value, tile.once ? used | (1n << BigInt(tile.index)) : used)
    }
  }
}

export interface Snapshot {
  pos: Vec
  value: number
  used: bigint
}
export interface Game {
  readonly level: Level
  pos: Vec
  value: number
  used: bigint
  moves: number
  won: boolean
  history: Snapshot[]
}

export function createGame(level: Level): Game {
  return { level, pos: level.start, value: level.startValue, used: 0n, moves: 0, won: false, history: [] }
}

/** One step in a direction. Changes the game when it is taken, and says why when it is not. */
export function move(g: Game, dir: Dir): { ok: true; won: boolean } | { ok: false; blocked: Blocked } {
  if (g.won) return { ok: false, blocked: { reason: 'finished' } }
  const r = peekMove(g.level, g.pos, g.value, g.used, dir)
  if (!r.ok) return r
  g.history.push({ pos: g.pos, value: g.value, used: g.used })
  g.pos = r.step.pos
  g.value = r.step.value
  g.used = r.step.used
  g.moves += 1
  g.won = r.step.won
  return { ok: true, won: g.won }
}

export function undo(g: Game): boolean {
  const prev = g.history.pop()
  if (!prev) return false
  g.pos = prev.pos
  g.value = prev.value
  g.used = prev.used
  g.moves = Math.max(0, g.moves - 1)
  g.won = false
  return true
}

export function reset(g: Game): void {
  g.pos = g.level.start
  g.value = g.level.startValue
  g.used = 0n
  g.moves = 0
  g.won = false
  g.history = []
}

/* ----------------------------------------------------------------------------------------------- the solver */

export interface SolveResult {
  solved: boolean
  /** the shortest way to the exit */
  path: Dir[]
  statesExplored: number
  /** the search was stopped at the limit of states, so `solved: false` is not a proof */
  exhausted: boolean
}

const keyOf = (x: number, y: number, value: number, used: bigint): string => `${x},${y},${value},${used}`

/** The shortest way to the exit from a position (breadth first over (place, value, what is used up)); from the start of the level by default. */
export function solve(level: Level, from?: { pos: Vec; value: number; used: bigint }, stateLimit = 2_000_000): SolveResult {
  const pos = from?.pos ?? level.start
  const value = from?.value ?? level.startValue
  const used = from?.used ?? 0n
  const startKey = keyOf(pos.x, pos.y, value, used)
  const seen = new Map<string, { from: string; dir: Dir } | null>([[startKey, null]])
  const queue: { x: number; y: number; value: number; used: bigint; key: string }[] = [{ x: pos.x, y: pos.y, value, used, key: startKey }]
  for (let head = 0; head < queue.length; head++) {
    const cur = queue[head]
    for (const dir of ALL_DIRS) {
      const r = peekMove(level, { x: cur.x, y: cur.y }, cur.value, cur.used, dir)
      if (!r.ok) continue
      if (r.step.won) {
        const path: Dir[] = [dir]
        let cursor = cur.key
        for (;;) {
          const link = seen.get(cursor)
          if (!link) break
          path.push(link.dir)
          cursor = link.from
        }
        path.reverse()
        return { solved: true, path, statesExplored: seen.size, exhausted: false }
      }
      const key = keyOf(r.step.pos.x, r.step.pos.y, r.step.value, r.step.used)
      if (seen.has(key)) continue
      seen.set(key, { from: cur.key, dir })
      queue.push({ x: r.step.pos.x, y: r.step.pos.y, value: r.step.value, used: r.step.used, key })
      if (seen.size > stateLimit) return { solved: false, path: [], statesExplored: seen.size, exhausted: true }
    }
  }
  return { solved: false, path: [], statesExplored: seen.size, exhausted: false }
}

/* ----------------------------------------------------------------------------------------------- progress */

/** The levels that are solved. A level is solved or not: there is no count of steps and no score. */
export type Progress = Record<string, true>

/** What was stored (a list of level ids), or nothing at all of it: anything that is not the id of a level is dropped. */
export function parseProgress(raw: unknown, ids: readonly string[]): Progress {
  const out: Progress = {}
  if (!Array.isArray(raw)) return out
  for (const id of raw) if (typeof id === 'string' && ids.includes(id)) out[id] = true
  return out
}
