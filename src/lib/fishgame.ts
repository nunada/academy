/** "Number Fish": a Feeding Frenzy for real numbers. The engine, with no drawing in it.
 *
 *  Every fish carries a real number written on its body, in one of the many forms the Real Number Match cards use (fractions, decimals, percents,
 *  repeating decimals, scientific notation, powers, square roots) and, on the hard level, π and e. A fish can eat a fish whose number is smaller than its
 *  own; it is eaten by one whose number is larger; two equal numbers, however written, leave each other alone.
 *
 *   - `valueOf`, `compareValues`, `compareSpecs`: the order of the real numbers, decided exactly where that can be (rational numbers and square roots
 *     through their exact value, a multiple of π or e against another of the same through the multipliers) and by 40 digits otherwise. The numbers of the
 *     game are chosen far enough apart that 40 digits never decide a close call, and two numbers are equal only when they are exactly equal;
 *   - `levelNums`: the numbers of a level, sorted, each with the forms it can be written in; `tiersOf`: the numbers the player's fish grows through;
 *   - `createWorld`, `step`: the pond. The player's fish follows a target point or the keys, other fish swim across, and a collision is settled by
 *     comparing the two numbers: eat, be eaten (a life, then a moment of safety), or nothing. Eat enough fish and the player's fish takes the next, larger
 *     number; take the last one and the level is won; lose all lives and it is lost.
 *
 *  The checker (tools/check-fishgame.mjs) compares the order with mpmath for every pair of numbers and forms, plays every pair of numbers against each
 *  other in the pond, and runs whole games with a perfect, a random and an idle player. */

import { constantScaled, surdApprox, type Surd } from './irrational'
import { rat, ratCmp, type Rat } from './realnum'
import { ALLOWED, POOL, evalSpec, repsOf, rng, surdEq, texOf, type Lang, type Level, type Spec } from './realcards'

export type { Lang, Level } from './realcards'

/* ----------------------------------------------------------------------------- numbers on fish */

/** A multiple of π or e, written as such: 2π, π/2, e. */
export interface ConstSpec {
  k: 'const'
  name: 'pi' | 'e'
  mult: Rat
}
export type FishSpec = Spec | ConstSpec

/** What a fish shows, as TeX (the decimal mark is the reader's, as on the cards). */
export function fishTex(s: FishSpec, lang: Lang): string {
  if (s.k !== 'const') return texOf(s, lang)
  const sym = s.name === 'pi' ? '\\pi' : 'e'
  const sign = s.mult.n < 0n ? '-' : ''
  const p = s.mult.n < 0n ? -s.mult.n : s.mult.n
  if (s.mult.d === 1n) return `${sign}${p === 1n ? '' : p}${sym}`
  return `${sign}\\frac{${p === 1n ? '' : p}${sym}}{${s.mult.d}}`
}

/** Digits of the order. */
export const PLACES = 40
const SCALE_TEXT_PLACES = PLACES

/** A number as the game knows it: exactly where it can (a rational number or a + b√m, or a multiple of π or e), and scaled by 10^40 as well. */
export interface Value {
  exact: Surd | null
  konst: { name: 'pi' | 'e'; mult: Rat } | null
  scaled: bigint
}

function scaledOfSurd(s: Surd): bigint {
  const text = surdApprox(s, SCALE_TEXT_PLACES)
  const neg = text.startsWith('-')
  const digits = text.replace(/^-/, '').replace('.', '')
  return (neg ? -1n : 1n) * BigInt(digits)
}

const constCache = new Map<string, bigint>()
function constScaled(name: 'pi' | 'e'): bigint {
  let v = constCache.get(name)
  if (v === undefined) {
    v = constantScaled(name, PLACES)
    constCache.set(name, v)
  }
  return v
}

export function valueOf(s: FishSpec): Value {
  if (s.k === 'const') return { exact: null, konst: { name: s.name, mult: s.mult }, scaled: (s.mult.n * constScaled(s.name)) / s.mult.d }
  const exact = evalSpec(s)
  return { exact, konst: null, scaled: scaledOfSurd(exact) }
}

/** −1, 0 or 1: whether a is less than, equal to or greater than b. Equal only when exactly equal. */
export function compareValues(a: Value, b: Value): -1 | 0 | 1 {
  if (a.exact && b.exact) {
    if (surdEq(a.exact, b.exact)) return 0
  } else if (a.konst && b.konst && a.konst.name === b.konst.name) {
    const c = ratCmp(a.konst.mult, b.konst.mult)
    return c < 0 ? -1 : c > 0 ? 1 : 0
  }
  return a.scaled < b.scaled ? -1 : a.scaled > b.scaled ? 1 : 0
}
export const compareSpecs = (a: FishSpec, b: FishSpec): -1 | 0 | 1 => compareValues(valueOf(a), valueOf(b))

/* ---------------------------------------------------------------------------- the numbers of a level */

export interface Num {
  /** the number's name: the same for every way of writing it */
  key: string
  value: Value
  /** the forms it can be written in at the level, each different as written */
  reps: FishSpec[]
}

const ratKey = (r: Rat) => `${r.n}/${r.d}`
const valueKey = (e: Surd) => `${ratKey(e.a)}|${ratKey(e.b)}|${e.m}`

/** The numbers π and e and a few multiples, for the hard level. */
const CONSTS: { name: 'pi' | 'e'; mult: Rat }[] = [
  { name: 'pi', mult: rat(1n, 1n) },
  { name: 'e', mult: rat(1n, 1n) },
  { name: 'pi', mult: rat(2n, 1n) },
  { name: 'pi', mult: rat(1n, 2n) },
  { name: 'e', mult: rat(2n, 1n) },
  { name: 'e', mult: rat(1n, 2n) },
  { name: 'pi', mult: rat(-1n, 1n) },
]

const numCache = new Map<Level, Num[]>()

/** The numbers a game level draws from, smallest first. Easy: the fractions, decimals and percents of the first card level. Medium: those and the
 *  second level's repeating decimals, negatives, scientific notation and powers. Hard: everything, the square roots and π and e included. */
export function levelNums(level: Level): Num[] {
  const hit = numCache.get(level)
  if (hit) return hit
  const byKey = new Map<string, { value: Value; reps: Map<string, FishSpec> }>()
  for (const e of POOL) {
    if (!e.levels.some((l) => l <= level)) continue
    const key = valueKey(e.value)
    let slot = byKey.get(key)
    if (!slot) {
      slot = { value: { exact: e.value, konst: null, scaled: scaledOfSurd(e.value) }, reps: new Map() }
      byKey.set(key, slot)
    }
    for (const spec of repsOf(e, level)) slot.reps.set(texOf(spec, 'en'), spec)
  }
  const nums: Num[] = [...byKey.entries()].map(([key, s]) => ({ key, value: s.value, reps: [...s.reps.values()] }))
  if (level === 3 && ALLOWED[3].includes('radical')) {
    for (const c of CONSTS) {
      const spec: ConstSpec = { k: 'const', name: c.name, mult: c.mult }
      nums.push({ key: `${c.name}*${ratKey(c.mult)}`, value: valueOf(spec), reps: [spec] })
    }
  }
  nums.sort((x, y) => (x.value.scaled < y.value.scaled ? -1 : x.value.scaled > y.value.scaled ? 1 : 0))
  numCache.set(level, nums)
  return nums
}

export const TIERS: Record<Level, { count: number; need: number }> = {
  1: { count: 5, need: 3 },
  2: { count: 6, need: 4 },
  3: { count: 7, need: 4 },
}

/** The numbers the player's fish grows through: the first has a few smaller numbers to eat, the last is the largest of the level, and the steps between
 *  are spread evenly over the sorted numbers. */
export function tiersOf(level: Level): Num[] {
  const nums = levelNums(level)
  const n = nums.length
  const start = Math.max(3, Math.round(0.2 * (n - 1)))
  const count = TIERS[level].count
  const picked: number[] = []
  for (let k = 0; k < count; k++) {
    const idx = Math.round(start + (k * (n - 1 - start)) / (count - 1))
    if (picked.length === 0 || idx > picked[picked.length - 1]) picked.push(idx)
  }
  return picked.map((i) => nums[i])
}

/* ----------------------------------------------------------------------------------------- the pond */

export interface Size {
  W: number
  H: number
}
/** the pond on a page with room for it; a phone gets a pond that fits its screen, see `pondFor` */
export const WORLD: Size = { W: 640, H: 400 }

const clampN = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))
/** The pond for a box of `boxW` × `boxH` pixels: the fish keep (about) the size they have on a page, the pond takes the shape of the box. A phone held
 *  upright gets a tall pond, one held sideways a wide one, and in both the fish are as large as the screen allows. */
export function pondFor(boxW: number, boxH: number): Size {
  const s = clampN(Math.min(boxW, boxH) / 400, 0.9, 1.05)
  return { W: clampN(Math.round(boxW / s), 360, 900), H: clampN(Math.round(boxH / s), 330, 760) }
}
export const LIVES = 3
/** how long the player's fish is safe after being eaten, in seconds */
export const SAFE_TIME = 1.6
const PLAYER_SPEED = 190
const SPEEDS: Record<Level, [number, number]> = { 1: [45, 80], 2: [60, 100], 3: [70, 120] }
const MAX_FISH: Record<Level, number> = { 1: 7, 2: 8, 3: 9 }
const SPAWN_EVERY = 0.85
/** how far a fish has to be inside the player's, as a share of the two radii, before they touch */
export const TOUCH = 0.7

export interface Fish {
  id: number
  num: Num
  spec: FishSpec
  x: number
  y: number
  vx: number
  /** a slow wobble up and down */
  phase: number
  w: number
  r: number
  /** what it was when it swam in, for the sake of the pace of the game; the collision compares the numbers at the time of contact */
  kind: 'edible' | 'danger' | 'equal'
  bumped: boolean
}

export interface Player {
  x: number
  y: number
  r: number
  face: 1 | -1
  tier: number
  num: Num
  spec: FishSpec
  /** seconds of safety left */
  safe: number
}

export type World = {
  /** the size of the pond, in pond units */
  W: number
  H: number
  level: Level
  speedFactor: number
  t: number
  rand: () => number
  nums: Num[]
  tiers: Num[]
  player: Player
  fish: Fish[]
  nextId: number
  spawnIn: number
  eatenInTier: number
  need: number
  eaten: number
  lives: number
  lost: number
  score: number
  status: 'play' | 'won' | 'lost'
}

export type GameEvent =
  | { type: 'spawn'; fish: Fish }
  | { type: 'leave'; fish: Fish }
  | { type: 'eat'; fish: Fish; player: FishSpec; points: number }
  | { type: 'hurt'; fish: Fish; player: FishSpec }
  | { type: 'bump'; fish: Fish; player: FishSpec }
  | { type: 'grow'; tier: number; spec: FishSpec }
  | { type: 'won' }
  | { type: 'lost' }

const pickSpec = (n: Num, rand: () => number, not?: FishSpec): FishSpec => {
  const pool = not ? n.reps.filter((s) => fishTex(s, 'en') !== fishTex(not, 'en')) : n.reps
  const from = pool.length ? pool : n.reps
  return from[Math.floor(rand() * from.length)]
}

const widthOf = (s: FishSpec) => Math.max(84, Math.min(140, 9.5 * fishTex(s, 'en').replace(/\\[a-z]+/g, 'x').length + 46))

export function createWorld(level: Level, seed: number, speedFactor = 1, size: Size = WORLD): World {
  const rand = rng(seed)
  const nums = levelNums(level)
  const tiers = tiersOf(level)
  const num = tiers[0]
  const spec = pickSpec(num, rand)
  return {
    W: size.W,
    H: size.H,
    level,
    speedFactor,
    t: 0,
    rand,
    nums,
    tiers,
    player: { x: size.W / 2, y: size.H / 2, r: 20, face: 1, tier: 0, num, spec, safe: 0 },
    fish: [],
    nextId: 1,
    spawnIn: 0.2,
    eatenInTier: 0,
    need: TIERS[level].need,
    eaten: 0,
    lives: LIVES,
    lost: 0,
    score: 0,
    status: 'play',
  }
}

const rankOf = (w: World, n: Num): number => w.nums.findIndex((x) => x.key === n.key)

/** A new fish at the edge of the pond. `kind` picks a number smaller than, larger than or equal to the player's; the smaller and larger ones are
 *  drawn towards the player's own number, because telling near numbers apart is the game. */
export function spawnFish(w: World, kind: Fish['kind']): Fish | null {
  const r = rankOf(w, w.player.num)
  const n = w.nums.length
  const skew = () => w.rand() ** 1.6
  let num: Num | undefined
  if (kind === 'edible' && r > 0) num = w.nums[r - 1 - Math.floor(skew() * r)]
  else if (kind === 'danger' && r < n - 1) num = w.nums[r + 1 + Math.floor(skew() * (n - 1 - r))]
  else if (kind === 'equal' && w.nums[r].reps.length >= 2) num = w.nums[r]
  if (!num) return null
  const spec = pickSpec(num, w.rand, kind === 'equal' ? w.player.spec : undefined)
  const wd = widthOf(spec)
  const [lo, hi] = SPEEDS[w.level]
  const speed = (lo + w.rand() * (hi - lo)) * w.speedFactor
  const fromLeft = w.rand() < 0.5
  const fish: Fish = {
    id: w.nextId++,
    num,
    spec,
    x: fromLeft ? -wd / 2 : w.W + wd / 2,
    y: 36 + w.rand() * (w.H - 72),
    vx: fromLeft ? speed : -speed,
    phase: w.rand() * Math.PI * 2,
    w: wd,
    r: Math.max(24, wd * 0.3),
    kind,
    bumped: false,
  }
  w.fish.push(fish)
  return fish
}

export interface Input {
  /** a point to swim to (a finger or the pointer), in pond units */
  tx?: number
  ty?: number
  /** the keys: −1, 0 or 1 on each axis */
  kx?: number
  ky?: number
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))

/** One tick of the pond: move, swim in, collide, grow. Returns what happened. */
export function step(w: World, dt: number, input: Input): GameEvent[] {
  const events: GameEvent[] = []
  if (w.status !== 'play') return events
  dt = Math.min(dt, 0.05)
  w.t += dt
  w.player.safe = Math.max(0, w.player.safe - dt)

  // the player's fish
  const p = w.player
  let mx = 0
  let my = 0
  if (input.kx || input.ky) {
    const len = Math.hypot(input.kx ?? 0, input.ky ?? 0) || 1
    mx = ((input.kx ?? 0) / len) * PLAYER_SPEED
    my = ((input.ky ?? 0) / len) * PLAYER_SPEED
  } else if (input.tx !== undefined && input.ty !== undefined) {
    const dx = input.tx - p.x
    const dy = input.ty - p.y
    const d = Math.hypot(dx, dy)
    if (d > 2) {
      const speed = Math.min(PLAYER_SPEED, d * 6)
      mx = (dx / d) * speed
      my = (dy / d) * speed
    }
  }
  p.x = clamp(p.x + mx * dt, p.r, w.W - p.r)
  p.y = clamp(p.y + my * dt, p.r, w.H - p.r)
  if (mx > 1) p.face = 1
  else if (mx < -1) p.face = -1

  // the others
  for (const f of w.fish) {
    f.x += f.vx * dt
    f.phase += dt * 1.6
    f.y = clamp(f.y + Math.sin(f.phase) * 8 * dt, 24, w.H - 24)
  }
  for (const f of [...w.fish]) {
    if ((f.vx > 0 && f.x > w.W + f.w) || (f.vx < 0 && f.x < -f.w)) {
      w.fish.splice(w.fish.indexOf(f), 1)
      events.push({ type: 'leave', fish: f })
    }
  }

  // swimming in: at a steady pace, and always something to eat
  w.spawnIn -= dt
  if (w.spawnIn <= 0 && w.fish.length < MAX_FISH[w.level]) {
    w.spawnIn = SPAWN_EVERY * (0.7 + w.rand() * 0.6)
    const edibleOnScreen = w.fish.some((f) => compareValues(p.num.value, f.num.value) > 0)
    const roll = w.rand()
    const kind: Fish['kind'] = !edibleOnScreen || roll < 0.5 ? 'edible' : roll < 0.8 ? 'danger' : 'equal'
    const f = spawnFish(w, kind) ?? spawnFish(w, 'edible') ?? spawnFish(w, 'danger')
    if (f) events.push({ type: 'spawn', fish: f })
  }

  // collisions: the numbers decide
  for (const f of [...w.fish]) {
    if (Math.hypot(f.x - p.x, f.y - p.y) >= (f.r + p.r) * TOUCH) continue
    const c = compareValues(p.num.value, f.num.value)
    if (c > 0) {
      w.fish.splice(w.fish.indexOf(f), 1)
      w.eaten++
      w.eatenInTier++
      w.score += 10
      events.push({ type: 'eat', fish: f, player: p.spec, points: 10 })
    } else if (c < 0) {
      if (p.safe > 0 || w.lives <= 0) continue
      w.lives--
      w.lost++
      p.safe = SAFE_TIME
      events.push({ type: 'hurt', fish: f, player: p.spec })
    } else if (!f.bumped) {
      f.bumped = true
      events.push({ type: 'bump', fish: f, player: p.spec })
    }
  }

  // growing, winning, losing
  if (w.lives <= 0) {
    w.status = 'lost'
    events.push({ type: 'lost' })
  } else if (w.eatenInTier >= w.need) {
    if (p.tier >= w.tiers.length - 1) {
      w.status = 'won'
      events.push({ type: 'won' })
    } else {
      p.tier++
      p.num = w.tiers[p.tier]
      p.spec = pickSpec(p.num, w.rand)
      p.r += 2.5
      w.eatenInTier = 0
      events.push({ type: 'grow', tier: p.tier, spec: p.spec })
    }
  }
  return events
}

/** One to three stars: all the lives left, two, or one. */
export const starsOf = (lives: number): 1 | 2 | 3 => (lives >= LIVES ? 3 : lives === LIVES - 1 ? 2 : 1)
