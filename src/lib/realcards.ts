/** The cards of the "Real Number Match" game, and the rules of the game.
 *
 *  A card shows one real number in one of its many forms: a fraction, a mixed number, a decimal, a repeating decimal, a percent, scientific notation, a
 *  power, a root or a square root with the coefficient in front. Two cards match when the two numbers are equal, and "equal" is decided exactly: every
 *  card carries a *spec* (what is written on it, as data), and the number a spec stands for is worked out in BigInt arithmetic, as a rational or as
 *  a + b√m. Nothing is compared as a decimal, so 0.333 does not match 1/3 and 0.999… does match 1.
 *
 *   - `evalSpec`: the exact value of a spec; `cardsMatch` compares two of them;
 *   - `texOf`: what the card shows, as TeX, with the decimal mark of the reader's language;
 *   - `POOL`, `repsOf`: the numbers the game draws from, level by level, and the forms each can be written in;
 *   - `buildDeck`: a shuffled deck for a level, from a seed, in which every number appears on exactly two cards and no two numbers are equal;
 *   - `newGame`, `pick`, `settle`, `stars`: the game itself as a pure state machine.
 *
 *  The checker (tools/check-realcards.mjs) reads the TeX of every card back with its own parser and tests it, with SymPy, against the number the card is
 *  meant to show. */

import { expand, fromRepeating, rat, ratCmp, type Rat } from './realnum'
import { iroot, makeSurd, surdApprox, type Surd } from './irrational'
import { ratDiv, ratMul } from './rationals'

export type Lang = 'en' | 'id'
export type Level = 1 | 2 | 3
export type Mode = 'open' | 'memory'

/** What is written on a card. */
export type Spec =
  /** n/d, not necessarily in lowest terms; the sign is on n */
  | { k: 'frac'; n: bigint; d: bigint }
  /** w and n/d with 0 < n < d */
  | { k: 'mixed'; neg: boolean; w: bigint; n: bigint; d: bigint }
  /** a decimal that ends: `whole`.`frac` (frac may be empty) */
  | { k: 'dec'; neg: boolean; whole: string; frac: string }
  /** a decimal that repeats: whole . pre (rep) */
  | { k: 'rep'; neg: boolean; whole: string; pre: string; rep: string }
  /** whole.frac percent */
  | { k: 'pct'; neg: boolean; whole: string; frac: string }
  /** mant × 10^exp, with mant like "2.5" */
  | { k: 'sci'; neg: boolean; mant: string; exp: number }
  /** base^(p/q), only where it is exact */
  | { k: 'pow'; base: Rat; p: number; q: number }
  /** the index-th root of r (the square root when index is 2) */
  | { k: 'root'; index: number; r: Rat; neg?: boolean }
  /** c√m, written with the coefficient in front, c a fraction */
  | { k: 'coef'; c: Rat; m: bigint }
  /** n / √m */
  | { k: 'inv'; n: bigint; m: bigint }
  /** √a · √b */
  | { k: 'prod'; a: bigint; b: bigint }

export type Family = 'fraction' | 'decimal' | 'repeating' | 'percent' | 'scientific' | 'power' | 'radical'

export const familyOf = (s: Spec): Family => {
  switch (s.k) {
    case 'frac':
    case 'mixed':
      return 'fraction'
    case 'dec':
      return 'decimal'
    case 'rep':
      return 'repeating'
    case 'pct':
      return 'percent'
    case 'sci':
      return 'scientific'
    case 'pow':
      return 'power'
    default:
      return 'radical'
  }
}

/* ----------------------------------------------------------------------- the exact value */

const ZERO: Rat = { n: 0n, d: 1n }
const ONE: Rat = { n: 1n, d: 1n }
const surdOf = (r: Rat): Surd => ({ m: 1n, a: r, b: ZERO })
const neg = (r: Rat): Rat => ({ n: -r.n, d: r.d })
const surdNeg = (v: Surd): Surd => ({ m: v.m, a: neg(v.a), b: neg(v.b) })
const abs = (x: bigint): bigint => (x < 0n ? -x : x)
const ratPow = (r: Rat, e: number): Rat => {
  let out = ONE
  for (let i = 0; i < Math.abs(e); i++) out = ratMul(out, r)
  return e < 0 ? ratDiv(ONE, out) : out
}
/** The q-th root of a positive integer, if it is an integer. */
const exactRoot = (n: bigint, q: number): bigint | null => {
  const r = iroot(n, q)
  return r ** BigInt(q) === n ? r : null
}

/** √(n/d) as a + b√m: √(nd)/d. */
const sqrtRat = (r: Rat): Surd => makeSurd(r.n * r.d, ZERO, rat(1n, r.d))

/** The number a spec stands for, exactly. Throws when a power or root is not exact where it must be. */
export function evalSpec(s: Spec): Surd {
  switch (s.k) {
    case 'frac':
      return surdOf(rat(s.n, s.d))
    case 'mixed': {
      const v = rat(s.w * s.d + s.n, s.d)
      return surdOf(s.neg ? neg(v) : v)
    }
    case 'dec': {
      const v = fromRepeating(s.whole, s.frac, '').value
      return surdOf(s.neg ? neg(v) : v)
    }
    case 'rep': {
      const v = fromRepeating(s.whole, s.pre, s.rep).value
      return surdOf(s.neg ? neg(v) : v)
    }
    case 'pct': {
      const v = ratDiv(fromRepeating(s.whole, s.frac, '').value, rat(100n, 1n))
      return surdOf(s.neg ? neg(v) : v)
    }
    case 'sci': {
      const [w, f = ''] = s.mant.split('.')
      const base = fromRepeating(w, f, '').value
      const v = ratMul(base, ratPow(rat(10n, 1n), s.exp))
      return surdOf(s.neg ? neg(v) : v)
    }
    case 'pow': {
      const rn = exactRoot(s.base.n, s.q)
      const rd = exactRoot(s.base.d, s.q)
      if (rn === null || rd === null) throw new Error('inexact power')
      return surdOf(ratPow(rat(rn, rd), s.p))
    }
    case 'root': {
      let v: Surd
      if (s.index === 2) v = sqrtRat(s.r)
      else {
        const rn = exactRoot(s.r.n, s.index)
        const rd = exactRoot(s.r.d, s.index)
        if (rn === null || rd === null) throw new Error('inexact root')
        v = surdOf(rat(rn, rd))
      }
      return s.neg ? surdNeg(v) : v
    }
    case 'coef':
      return makeSurd(s.m, ZERO, s.c)
    case 'inv':
      // n / √m = n√m / m
      return makeSurd(s.m, ZERO, rat(s.n, s.m))
    case 'prod':
      return makeSurd(s.a * s.b, ZERO, ONE)
  }
}

export const surdEq = (x: Surd, y: Surd): boolean => x.m === y.m && ratCmp(x.a, y.a) === 0 && ratCmp(x.b, y.b) === 0

/** Two cards match when they stand for the same number. */
export const cardsMatch = (a: Spec, b: Spec): boolean => surdEq(evalSpec(a), evalSpec(b))

/** The value as a decimal, for showing: `places` digits after the point. */
export const approx = (s: Spec, places = 4): string => surdApprox(evalSpec(s), places)

/* --------------------------------------------------------------------------- what a card shows */

const mark = (lang: Lang): string => (lang === 'id' ? '{,}' : '.')
const sign = (isNeg: boolean): string => (isNeg ? '-' : '')
const withMark = (whole: string, frac: string, lang: Lang): string => (frac ? `${whole}${mark(lang)}${frac}` : whole)
const radicand = (r: Rat): string => (r.d === 1n ? r.n.toString() : `\\frac{${r.n}}{${r.d}}`)

/** What a card shows, as TeX. The decimal mark is the reader's: a point in English, a comma (`{,}`) in Indonesian. */
export function texOf(s: Spec, lang: Lang): string {
  switch (s.k) {
    case 'frac':
      return `${sign(s.n < 0n)}\\frac{${abs(s.n)}}{${s.d}}`
    case 'mixed':
      return `${sign(s.neg)}${s.w}\\tfrac{${s.n}}{${s.d}}`
    case 'dec':
      return `${sign(s.neg)}${withMark(s.whole, s.frac, lang)}`
    case 'rep':
      return `${sign(s.neg)}${s.whole}${mark(lang)}${s.pre}\\overline{${s.rep}}`
    case 'pct':
      return `${sign(s.neg)}${withMark(s.whole, s.frac, lang)}\\%`
    case 'sci':
      return `${sign(s.neg)}${withMark(s.mant.split('.')[0], s.mant.split('.')[1] ?? '', lang)}\\times10^{${s.exp}}`
    case 'pow': {
      const b = s.base.d === 1n ? s.base.n.toString() : `(\\frac{${s.base.n}}{${s.base.d}})`
      const e = s.q === 1 ? `${s.p}` : `${s.p < 0 ? '-' : ''}\\frac{${Math.abs(s.p)}}{${s.q}}`
      return `${b}^{${e}}`
    }
    case 'root':
      return `${sign(Boolean(s.neg))}${s.index === 2 ? `\\sqrt{${radicand(s.r)}}` : `\\sqrt[${s.index}]{${radicand(s.r)}}`}`
    case 'coef': {
      const p = abs(s.c.n)
      const root = `\\sqrt{${s.m}}`
      const top = p === 1n ? root : `${p}${root}`
      return `${sign(s.c.n < 0n)}${s.c.d === 1n ? top : `\\frac{${top}}{${s.c.d}}`}`
    }
    case 'inv':
      return `${sign(s.n < 0n)}\\frac{${abs(s.n)}}{\\sqrt{${s.m}}}`
    case 'prod':
      return `\\sqrt{${s.a}}\\cdot\\sqrt{${s.b}}`
  }
}

/* ---------------------------------------------------------------------- the forms a number can take */

/** The forms of a rational number the game knows: fractions (also not in lowest terms), a mixed number, a decimal that ends, a repeating decimal,
 *  a percent, scientific notation. */
export function rationalReps(r: Rat): Spec[] {
  const out: Spec[] = []
  const isNeg = r.n < 0n
  const n = abs(r.n)
  const d = r.d
  if (d !== 1n) out.push({ k: 'frac', n: r.n, d })
  for (const k of [2n, 3n, 4n, 5n]) if (d * k <= 60n && n * k <= 200n) out.push({ k: 'frac', n: r.n * k, d: d * k })
  if (d !== 1n && n > d) out.push({ k: 'mixed', neg: isNeg, w: n / d, n: n % d, d })

  const e = expand(r.n, r.d)
  if (e.terminating && e.pre.length <= 5) out.push({ k: 'dec', neg: isNeg, whole: e.whole, frac: e.pre })
  if (!e.terminating && !e.truncated && e.rep.length <= 6 && e.pre.length <= 2) out.push({ k: 'rep', neg: isNeg, whole: e.whole, pre: e.pre, rep: e.rep })

  const e100 = expand(r.n * 100n, r.d)
  if (e100.terminating && e100.pre.length <= 2 && e100.whole.length <= 4 && e100.whole + e100.pre !== '0') out.push({ k: 'pct', neg: isNeg, whole: e100.whole, frac: e100.pre })

  // scientific notation, for numbers that are very small or very large and have few significant digits
  if (e.terminating && (ratCmp(rat(n, d), rat(1n, 100n)) < 0 || ratCmp(rat(n, d), rat(1000n, 1n)) >= 0)) {
    let sig: string
    let exp: number
    if (e.whole !== '0') {
      sig = (e.whole + e.pre).replace(/0+$/, '')
      exp = e.whole.length - 1
    } else {
      const lead = /^0*/.exec(e.pre)![0].length
      sig = e.pre.slice(lead).replace(/0+$/, '')
      exp = -(lead + 1)
    }
    if (sig.length >= 1 && sig.length <= 4) {
      const spec: Spec = { k: 'sci', neg: isNeg, mant: sig.length > 1 ? `${sig[0]}.${sig.slice(1)}` : sig, exp }
      if (surdEq(evalSpec(spec), surdOf(r))) out.push(spec)
    }
  }
  return out
}

/** The forms of c√m the game knows: the coefficient in front, everything under the root, and n over the root. */
export function surdReps(c: Rat, m: bigint): Spec[] {
  const out: Spec[] = [{ k: 'coef', c, m }]
  out.push({ k: 'root', index: 2, r: rat(c.n * c.n * m, c.d * c.d), neg: c.n < 0n })
  const cm = ratMul(c, rat(m, 1n))
  if (cm.d === 1n) out.push({ k: 'inv', n: cm.n, m })
  return out
}

/* ------------------------------------------------------------------------------- the pool */

export interface Entry {
  id: string
  value: Surd
  /** the levels this number is used at */
  levels: Level[]
  /** forms that are not worked out from the value: powers, roots and the like */
  extras: Spec[]
}

const q = (s: string): Rat => {
  const [n, d = '1'] = s.split('/')
  return rat(BigInt(n), BigInt(d))
}
const rational = (v: string, levels: Level[], extras: Spec[] = []): Entry => ({ id: v, value: surdOf(q(v)), levels, extras })
const surd = (c: string, m: number, levels: Level[], extras: Spec[] = []): Entry => ({ id: `${c}r${m}`, value: makeSurd(BigInt(m), ZERO, q(c)), levels, extras })

const pow = (base: string, p: number, qq = 1): Spec => ({ k: 'pow', base: q(base), p, q: qq })
const root = (index: number, r: string): Spec => ({ k: 'root', index, r: q(r) })
const prod = (a: number, b: number): Spec => ({ k: 'prod', a: BigInt(a), b: BigInt(b) })
const repeating = (whole: string, pre: string, rp: string): Spec => ({ k: 'rep', neg: false, whole, pre, rep: rp })

export const POOL: Entry[] = [
  // easy: fractions, decimals and percents that end
  rational('1/2', [1]),
  rational('1/4', [1], [pow('2', -2), pow('1/2', 2)]),
  rational('3/4', [1]),
  rational('1/5', [1]),
  rational('2/5', [1]),
  rational('3/5', [1]),
  rational('4/5', [1]),
  rational('1/8', [1, 2], [pow('2', -3), pow('1/2', 3)]),
  rational('3/8', [1]),
  rational('5/8', [1]),
  rational('1/10', [1], [pow('10', -1)]),
  rational('3/10', [1]),
  rational('7/10', [1]),
  rational('1/20', [1]),
  rational('3/2', [1]),
  rational('5/4', [1]),
  rational('7/4', [1]),
  rational('5/2', [1]),
  rational('9/5', [1]),
  rational('7/2', [1]),
  rational('3', [1]),
  // medium: repeating decimals, negatives, very small and very large numbers, powers
  rational('1/3', [2], [pow('3', -1)]),
  rational('2/3', [2]),
  rational('1/6', [2]),
  rational('5/6', [2]),
  rational('1/9', [2], [pow('3', -2)]),
  rational('2/9', [2]),
  rational('4/9', [2], [pow('2/3', 2)]),
  rational('1/7', [2]),
  rational('1/11', [2]),
  rational('7/12', [2]),
  rational('5/12', [2]),
  rational('11/6', [2]),
  rational('1/16', [2], [pow('2', -4), pow('1/2', 4)]),
  rational('1/25', [2], [pow('5', -2)]),
  rational('1/40', [2]),
  rational('1/100', [2], [pow('10', -2)]),
  rational('1/200', [2]),
  rational('1/400', [2]),
  rational('1/1000', [2, 3], [pow('10', -3)]),
  rational('2500', [2]),
  rational('9/4', [2], [pow('3/2', 2)]),
  rational('8', [2], [pow('2', 3)]),
  rational('-1/2', [2]),
  rational('-3/4', [2]),
  rational('-2/3', [2]),
  rational('-5/8', [2]),
  rational('-7/4', [2]),
  rational('-1/3', [2]),
  // hard: square roots in several forms, and rational numbers in disguise
  surd('1', 2, [3]),
  surd('1', 3, [3]),
  surd('1', 5, [3]),
  surd('1', 6, [3]),
  surd('2', 2, [3]),
  surd('3', 2, [3]),
  surd('2', 3, [3]),
  surd('2', 5, [3]),
  surd('1/2', 2, [3]),
  surd('1/3', 3, [3]),
  surd('1/5', 5, [3]),
  surd('5/2', 2, [3]),
  surd('-1', 2, [3]),
  surd('-2', 3, [3]),
  rational('1', [3], [repeating('0', '', '9'), root(2, '1'), pow('7', 0)]),
  rational('1/2', [3], [repeating('0', '4', '9'), pow('4', -1, 2), root(2, '1/4'), pow('2', -1)]),
  rational('3', [3], [root(2, '9'), root(3, '27'), prod(3, 3), repeating('2', '', '9')]),
  rational('4', [3], [pow('8', 2, 3), prod(2, 8), root(2, '16'), pow('16', 1, 2)]),
  rational('7', [3], [root(2, '49'), prod(7, 7)]),
  rational('8', [3], [pow('16', 3, 4), prod(2, 32), root(3, '512'), pow('2', 3)]),
  rational('6', [3], [prod(3, 12), prod(2, 18), root(2, '36')]),
  rational('10', [3], [prod(5, 20), root(2, '100'), prod(2, 50)]),
  rational('1/3', [3], [root(2, '1/9'), pow('9', -1, 2), repeating('0', '', '3'), pow('3', -1)]),
  rational('1/10', [3], [pow('100', -1, 2), root(2, '1/100'), repeating('0', '0', '9')]),
  rational('9/4', [3], [pow('3/2', 2), root(2, '81/16'), pow('4/9', -1)]),
  rational('27', [3], [pow('9', 3, 2), root(3, '19683'), pow('3', 3)]),
]

export const entriesOf = (level: Level): Entry[] => POOL.filter((e) => e.levels.includes(level))

/** The forms the game shows at each level. A new level adds forms; it never takes one away. */
export const ALLOWED: Record<Level, Family[]> = {
  1: ['fraction', 'decimal', 'percent'],
  2: ['fraction', 'decimal', 'percent', 'repeating', 'scientific', 'power'],
  3: ['fraction', 'decimal', 'percent', 'repeating', 'scientific', 'power', 'radical'],
}

/** Every form of an entry at a level, each different from the others as written. */
export function repsOf(e: Entry, level: Level): Spec[] {
  const base = e.value.b.n === 0n ? rationalReps(e.value.a) : surdReps(e.value.b, e.value.m)
  const seen = new Set<string>()
  return [...base, ...e.extras].filter((s) => {
    if (!ALLOWED[level].includes(familyOf(s))) return false
    const key = texOf(s, 'en')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/* ------------------------------------------------------------------------------------ the deck */

/** A reproducible random source (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(xs: T[], rand: () => number): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface Card {
  /** the place in the deck */
  id: number
  /** the number it shows, by name: the two cards of a pair share it */
  key: string
  spec: Spec
  family: Family
}

export const PAIRS: Record<Level, number> = { 1: 6, 2: 8, 3: 10 }

/** The color of a pair once it is found, as a hue in degrees. Never a red: red is the color of "not the same number", and a pair that was right and looks
 *  wrong is worse than no color at all. Ten hues, for the ten pairs of the hardest level, each at least 15° from the others. */
export const PAIR_HUES = [145, 215, 285, 40, 180, 255, 85, 315, 60, 200]
export const hueOfPair = (pair: number): number => PAIR_HUES[pair % PAIR_HUES.length]

/** A number written as a double, only for deciding which numbers look alike; the game never compares anything with it. */
const looseValue = (v: Surd): number => Number(surdApprox(v, 6))

/** The cards of a game: `PAIRS[level]` different numbers, two cards for each, written in two different forms, shuffled. From level 2 on, the numbers
 *  are picked to look alike (1/3 beside 0.33, √2 beside √3), because telling near numbers apart is the game. */
export function buildDeck(level: Level, seed: number): Card[] {
  const rand = rng(seed)
  const pool = entriesOf(level).filter((e) => repsOf(e, level).length >= 2)
  const want = PAIRS[level]
  const chosen: Entry[] = []
  const distinct = (e: Entry) => chosen.every((c) => !surdEq(c.value, e.value))
  while (chosen.length < want) {
    const rest = shuffle(pool, rand).filter(distinct)
    if (rest.length === 0) throw new Error('not enough different numbers')
    let next = rest[0]
    if (level >= 2 && chosen.length > 0) {
      const last = looseValue(chosen[Math.floor(rand() * chosen.length)].value)
      const near = rest.filter((e) => Math.abs(looseValue(e.value) - last) <= 0.15 * Math.max(1, Math.abs(last)))
      if (near.length > 0 && rand() < 0.7) next = near[0]
    }
    chosen.push(next)
  }
  const cards: Omit<Card, 'id'>[] = []
  for (const e of chosen) {
    const reps = shuffle(repsOf(e, level), rand)
    const first = reps[0]
    const second = reps.slice(1).find((s) => familyOf(s) !== familyOf(first)) ?? reps[1]
    for (const spec of [first, second]) cards.push({ key: e.id, spec, family: familyOf(spec) })
  }
  return shuffle(cards, rand).map((c, id) => ({ ...c, id }))
}

/* ---------------------------------------------------------------------------------------- the game */

export interface GameState {
  level: Level
  mode: Mode
  seed: number
  cards: Card[]
  matched: boolean[]
  /** the cards turned over now: one waiting for its partner, or two that did not match */
  faceUp: number[]
  /** two cards are up and they do not match: the player has to see it, and then `settle` turns them back */
  miss: boolean
  moves: number
  mistakes: number
  /** the pairs found, in order, as the two places in the deck */
  found: [number, number][]
}

export function newGame(level: Level, mode: Mode, seed: number): GameState {
  const cards = buildDeck(level, seed)
  return { level, mode, seed, cards, matched: cards.map(() => false), faceUp: [], miss: false, moves: 0, mistakes: 0, found: [] }
}

export const isDone = (s: GameState): boolean => s.matched.every(Boolean)

/** Turns a wrong pair back (or does nothing). */
export function settle(s: GameState): GameState {
  return s.miss ? { ...s, faceUp: [], miss: false } : s
}

/** The player picks the card in place `i`. A card already found or already picked does nothing; picking while a wrong pair is showing first turns
 *  that pair back. The second card of a try is a move: it is a match, or a mistake. */
export function pick(state: GameState, i: number): GameState {
  const s = settle(state)
  if (i < 0 || i >= s.cards.length || s.matched[i] || s.faceUp.includes(i)) return s
  if (s.faceUp.length === 0) return { ...s, faceUp: [i] }
  const a = s.faceUp[0]
  if (cardsMatch(s.cards[a].spec, s.cards[i].spec)) {
    const matched = [...s.matched]
    matched[a] = true
    matched[i] = true
    return { ...s, matched, faceUp: [], moves: s.moves + 1, found: [...s.found, [a, i]] }
  }
  return { ...s, faceUp: [a, i], miss: true, moves: s.moves + 1, mistakes: s.mistakes + 1 }
}

/** One to three stars. In the open game every wrong try costs; in the memory game (cards face down) some wrong tries are how you find the cards. */
export function stars(mistakes: number, pairs: number, mode: Mode): 1 | 2 | 3 {
  if (mode === 'open') return mistakes === 0 ? 3 : mistakes <= Math.floor(pairs / 3) ? 2 : 1
  return mistakes <= Math.floor(pairs / 2) ? 3 : mistakes <= pairs ? 2 : 1
}

/** Whether a card can be seen: always in the open game; in the memory game only when turned over or already found. */
export const isShown = (s: GameState, i: number): boolean => s.mode === 'open' || s.matched[i] || s.faceUp.includes(i)
