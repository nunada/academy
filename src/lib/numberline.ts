/** "Number Line": place a number where it belongs on a line. The engine, with no drawing in it.
 *
 *  Each round shows a number, written in one of the forms the Real Number Match cards use (an integer, a fraction, a mixed number, a decimal, a repeating
 *  decimal, a percent; on the last level a square root, π or e), and a line with a few labelled marks. The player puts a marker where the number goes.
 *
 *   - five levels: integers (negative ones too); fractions, decimals and percents between 0 and 4; the same on lines that also go below zero, with repeating
 *     decimals; "zoom" lines that show only the stretch between two close numbers; and square roots, π and e;
 *   - on the first four levels the marker *snaps to the ticks* and the number is always exactly on one tick, so an answer is right when it is the tick, and
 *     that is decided with exact fractions (`Rat`), never with a screen position. On the last level the number lies between ticks and the marker moves
 *     freely: an answer is right when it is within `TOL` of the line's length from the number, whose position is worked out to 40 digits;
 *   - `buildRounds` makes the rounds of a game from a seed (distinct numbers, a mix of lines); `newGame`, `setMark`, `nudge`, `check`, `reveal`, `advance`
 *     are the game as a pure state machine; `stars` turns the mistakes of a finished game into one to three stars.
 *
 *  The checker (tools/check-numberline.mjs) reads the TeX of every number back with its own parser and compares it, with Python fractions and mpmath, with
 *  the tick or position the game accepts, for every line the levels can make. */

import { expand, rat, ratAdd, type Rat } from './realnum'
import { ratMul, ratSub } from './rationals'
import { evalSpec, familyOf, rationalReps, rng, surdEq, surdReps, type Family, type Lang, type Spec } from './realcards'
import { fishTex, valueOf, type ConstSpec, type FishSpec } from './fishgame'

export type { Lang } from './realcards'
export type Level = 1 | 2 | 3 | 4 | 5
export const LEVELS: Level[] = [1, 2, 3, 4, 5]
/** Numbers to place in one game. */
export const ROUNDS = 10
/** Wrong tries in one round after which the place may be shown. */
export const REVEAL_AFTER = 2
/** On a free line (the last level) a marker within this fraction of the line's length of the number is right. */
export const TOL = 0.03

/* -------------------------------------------------------------------------------- lines */

export type LabelStyle = 'int' | 'dec' | 'frac'

export interface Line {
  min: Rat
  max: Rat
  /** the number of equal intervals from min to max */
  n: number
  /** a label under every labelEvery-th tick (from min), and under both ends */
  labelEvery: number
  style: LabelStyle
  /** true: the marker sits on ticks and the number is on a tick; false: the marker is free */
  snap: boolean
}

export const lineStep = (l: Line): Rat => ratMul(ratSub(l.max, l.min), rat(1n, BigInt(l.n)))
/** The number at tick i, exactly. */
export const tickValue = (l: Line, i: number): Rat => ratAdd(l.min, ratMul(lineStep(l), rat(BigInt(i), 1n)))
/** Whether tick i carries a label. */
export const isLabelled = (l: Line, i: number): boolean => i === 0 || i === l.n || i % l.labelEvery === 0

const R = (s: string): Rat => {
  const [n, d = '1'] = s.split('/')
  return rat(BigInt(n), BigInt(d))
}
const line = (min: string, max: string, n: number, labelEvery: number, style: LabelStyle = 'int', snap = true): Line => ({ min: R(min), max: R(max), n, labelEvery, style, snap })

/** The lines of the first four levels. A tick is as wide as at least 15 pixels on a phone: no line has more than 20 intervals. */
const TEMPLATES: Record<1 | 2 | 3 | 4, Line[]> = {
  // whole numbers, some negative; the step is 1, 2 or 5
  1: [
    line('-10', '10', 20, 5),
    line('0', '20', 20, 5),
    line('-15', '5', 20, 5),
    line('-6', '6', 12, 2),
    line('-20', '20', 20, 5),
    line('-50', '50', 20, 2),
    line('-8', '2', 10, 2),
  ],
  // from 0, ticks of a half, fourth, fifth, eighth or tenth; the labels are the whole numbers
  2: [
    line('0', '2', 4, 2),
    line('0', '3', 6, 2),
    line('0', '2', 8, 4),
    line('0', '3', 12, 4),
    line('1', '3', 8, 4),
    line('0', '2', 10, 5),
    line('0', '3', 15, 5),
    line('1', '3', 10, 5),
    line('0', '1', 8, 8),
    line('0', '2', 16, 8),
    line('0', '1', 10, 10),
    line('0', '2', 20, 10),
  ],
  // across zero, with thirds and sixths as well
  3: [
    line('-2', '2', 8, 2),
    line('-2', '2', 12, 3),
    line('-2', '2', 16, 4),
    line('-2', '2', 20, 5),
    line('-3', '3', 12, 2),
    line('-3', '3', 18, 3),
    line('-1', '2', 9, 3),
    line('-1', '2', 12, 4),
    line('-1', '2', 15, 5),
    line('-1', '2', 18, 6),
    line('-2', '1', 12, 4),
    line('-2', '1', 15, 5),
    line('-2', '1', 18, 6),
    line('-1', '1', 12, 6),
    line('-1', '1', 16, 8),
    line('-1', '1', 20, 10),
  ],
  // zoom: only the two ends are labelled, ten (or five) ticks between
  4: [
    line('2/5', '1/2', 10, 10, 'dec'),
    line('3/10', '2/5', 10, 10, 'dec'),
    line('7/10', '4/5', 10, 10, 'dec'),
    line('6/5', '13/10', 10, 10, 'dec'),
    line('-1/2', '-2/5', 10, 10, 'dec'),
    line('-3/10', '-1/5', 10, 10, 'dec'),
    line('9/5', '19/10', 10, 10, 'dec'),
    line('12/100', '13/100', 10, 10, 'dec'),
    line('37/100', '38/100', 10, 10, 'dec'),
    line('-6/100', '-5/100', 10, 10, 'dec'),
    line('1', '2', 10, 10, 'dec'),
    line('-1', '0', 10, 10, 'dec'),
    line('2', '3', 10, 10, 'dec'),
    line('1/2', '3/4', 5, 5, 'frac'),
    line('1/4', '1/2', 5, 5, 'frac'),
    line('3/4', '1', 5, 5, 'frac'),
    line('0', '1/4', 5, 5, 'frac'),
    line('1/3', '2/3', 5, 5, 'frac'),
    line('0', '1/3', 5, 5, 'frac'),
    line('2/3', '1', 5, 5, 'frac'),
    line('1/5', '2/5', 4, 4, 'frac'),
    line('-1/2', '-1/4', 5, 5, 'frac'),
    line('-2/3', '-1/3', 5, 5, 'frac'),
  ],
}

export const templatesOf = (level: 1 | 2 | 3 | 4): Line[] => TEMPLATES[level]

/* ------------------------------------------------------------------------- how a number is written */

const mark = (lang: Lang): string => (lang === 'id' ? '{,}' : '.')
const absB = (x: bigint): bigint => (x < 0n ? -x : x)

/** A fraction in lowest terms as TeX (an integer when the denominator is 1). */
export function fracTex(r: Rat): string {
  if (r.d === 1n) return r.n.toString()
  return `${r.n < 0n ? '-' : ''}\\frac{${absB(r.n)}}{${r.d}}`
}
/** A rational number that ends, as a decimal in TeX; null when it does not end. */
export function decimalTex(r: Rat, lang: Lang): string | null {
  const e = expand(r.n, r.d)
  if (!e.terminating) return null
  return `${r.n < 0n ? '-' : ''}${e.whole}${e.pre ? mark(lang) + e.pre : ''}`
}
/** A rational number written in the style of a line's labels. */
export function styleTex(r: Rat, style: LabelStyle, lang: Lang): string {
  if (style === 'frac') return fracTex(r)
  if (style === 'dec') return decimalTex(r, lang) ?? fracTex(r)
  return fracTex(r)
}
/** What the label of tick i says. */
export const tickTex = (l: Line, i: number, lang: Lang): string => styleTex(tickValue(l, i), l.style, lang)
/** A rational number as a fraction, and as a decimal as well when it ends within four places and is not a whole number. */
export function bothTex(r: Rat, lang: Lang): string {
  const f = fracTex(r)
  if (r.d === 1n) return f
  const dec = decimalTex(r, lang)
  return dec && expand(r.n, r.d).pre.length <= 4 ? `${f}=${dec}` : f
}

/* ------------------------------------------------------------------------------------- the numbers */

export interface Round {
  line: Line
  /** what is written on the card */
  spec: FishSpec
  /** snapped lines: the tick the number is on; free lines: null */
  tick: number | null
  /** where the number is along the line, 0 (min) to 1 (max) */
  at: number
}

/** A whole number written as a card. */
const integerSpec = (v: Rat): Spec => ({ k: 'dec', neg: v.n < 0n, whole: absB(v.n).toString(), frac: '' })

const ALLOWED: Record<1 | 2 | 3 | 4, Family[]> = {
  1: ['decimal'],
  2: ['fraction', 'decimal', 'percent'],
  3: ['fraction', 'decimal', 'percent', 'repeating'],
  4: ['fraction', 'decimal', 'percent', 'repeating'],
}

/** The forms a rational number is shown in at a level. */
export function formsOf(v: Rat, level: 1 | 2 | 3 | 4): Spec[] {
  if (v.d === 1n) return [integerSpec(v)]
  return rationalReps(v).filter((s) => ALLOWED[level].includes(familyOf(s)))
}
const weight = (s: Spec): number => (s.k === 'frac' && rat(s.n, s.d).d !== s.d ? 1 : 3)

/** The numbers for the last level: square roots in a few forms, π and e. */
const rootSpecs = (c: string, m: number): Spec[] => surdReps(R(c), BigInt(m))
const konst = (name: 'pi' | 'e', mult: string): ConstSpec => ({ k: 'const', name, mult: R(mult) })
export const IRRATIONALS: FishSpec[][] = [
  rootSpecs('1', 2),
  rootSpecs('1', 3),
  rootSpecs('1', 5),
  rootSpecs('1', 6),
  rootSpecs('1', 7),
  rootSpecs('1', 10),
  rootSpecs('2', 2),
  rootSpecs('3', 2),
  rootSpecs('1/2', 2),
  rootSpecs('1/2', 3),
  rootSpecs('-1', 2),
  rootSpecs('-1', 3),
  rootSpecs('-1', 5),
  [konst('pi', '1')],
  [konst('pi', '1/2')],
  [konst('pi', '2')],
  [konst('pi', '-1')],
  [konst('e', '1')],
  [konst('e', '-1')],
  [konst('e', '1/2')],
]
const WINDOWS: [number, number][] = [
  [0, 3], [1, 4], [0, 4], [1, 5], [2, 5], [0, 5], [-3, 0], [-4, 0], [-5, -1], [-2, 2], [-3, 3], [-4, 4], [-5, 0], [-1, 4], [-4, 1], [0, 7], [-7, 0], [-1, 6], [2, 7],
]

/** A number as a double, from its 40 digits; enough to place a marker. */
export function numeric(s: FishSpec): number {
  const v = valueOf(s)
  return Number(v.scaled / 10n ** 24n) / 1e16
}

/** The number to a few decimal places, as TeX with the reader's decimal mark. */
export function approxTex(s: FishSpec, lang: Lang, places = 4): string {
  const v = valueOf(s).scaled
  const neg = v < 0n
  const q = 10n ** BigInt(40 - places)
  const t = ((neg ? -v : v) + q / 2n) / q
  const digits = t.toString().padStart(places + 1, '0')
  const text = `${digits.slice(0, digits.length - places)}${mark(lang)}${digits.slice(digits.length - places)}`
  return `${neg && /[1-9]/.test(digits) ? '-' : ''}${text}`
}

const pickOf = <T>(xs: T[], rand: () => number): T => xs[Math.floor(rand() * xs.length)]
const weighted = <T>(xs: T[], w: (x: T) => number, rand: () => number): T => {
  const total = xs.reduce((s, x) => s + w(x), 0)
  let t = rand() * total
  for (const x of xs) {
    t -= w(x)
    if (t < 0) return x
  }
  return xs[xs.length - 1]
}

/** The ticks a number may be on in a snapped line: not an end, and not a labelled tick (those are given). */
export function targetTicks(l: Line): number[] {
  const out: number[] = []
  for (let i = 1; i < l.n; i++) if (!isLabelled(l, i)) out.push(i)
  return out
}

/** The window of a free line round for a number: ticks at every half unit up to width 4, else every unit; labels at the whole numbers. */
export function windowsFor(x: number): Line[] {
  const out: Line[] = []
  for (const [lo, hi] of WINDOWS) {
    if (x < lo + 0.3 || x > hi - 0.3) continue
    const width = hi - lo
    out.push(width <= 4 ? line(String(lo), String(hi), width * 2, 2, 'int', false) : line(String(lo), String(hi), width, 1, 'int', false))
  }
  return out
}

/** The rounds of a game: `count` different numbers, each with a line it fits on, from a seed. */
export function buildRounds(level: Level, seed: number, count = ROUNDS): Round[] {
  const rand = rng(seed)
  const rounds: Round[] = []
  const used = new Set<string>()
  for (let attempts = 0; rounds.length < count && attempts < 4000; attempts++) {
    if (level === 5) {
      const forms = pickOf(IRRATIONALS, rand)
      // the root written with its coefficient in front is the usual form; 7/√7 (the same number as √7) is shown too, but rarely
      const spec = weighted(forms.filter((s) => s.k !== 'inv' || s.n !== s.m), (s) => (s.k === 'coef' || s.k === 'const' ? 4 : 1), rand)
      const key = fishTex(forms[0], 'en')
      if (used.has(key)) continue
      const x = numeric(spec)
      const ws = windowsFor(x)
      if (ws.length === 0) continue
      // the narrower windows are the fairer test: they are chosen more often
      const l = weighted(ws, (w) => 1 / Number(ratSub(w.max, w.min).n), rand)
      used.add(key)
      rounds.push({ line: l, spec, tick: null, at: (x - Number(l.min.n)) / (Number(l.max.n) - Number(l.min.n)) })
      continue
    }
    const l = pickOf(TEMPLATES[level], rand)
    const ticks = targetTicks(l)
    if (ticks.length === 0) continue
    const tick = pickOf(ticks, rand)
    const v = tickValue(l, tick)
    const key = `${v.n}/${v.d}`
    if (used.has(key)) continue
    const forms = formsOf(v, level)
    if (forms.length === 0) continue
    used.add(key)
    rounds.push({ line: l, spec: weighted(forms, weight, rand), tick, at: tick / l.n })
  }
  if (rounds.length < count) throw new Error(`level ${level}, seed ${seed}: only ${rounds.length} rounds`)
  return rounds
}

/** Whether two written numbers are the same number (used by the checker). */
export const sameNumber = (a: Spec, b: Spec): boolean => surdEq(evalSpec(a), evalSpec(b))

/* --------------------------------------------------------------------------------------- the game */

export type Phase = 'play' | 'right' | 'wrong' | 'shown' | 'done'
export type Result = 'first' | 'retry' | 'shown'

export interface Game {
  level: Level
  seed: number
  rounds: Round[]
  index: number
  /** the marker: a tick (snapped lines) or a fraction of the line (free lines); null until the player first puts it somewhere */
  mark: number | null
  phase: Phase
  /** wrong tries in this round */
  tries: number
  mistakes: number
  results: Result[]
}

export function newGame(level: Level, seed: number, count = ROUNDS): Game {
  return { level, seed, rounds: buildRounds(level, seed, count), index: 0, mark: null, phase: 'play', tries: 0, mistakes: 0, results: [] }
}

export const roundOf = (g: Game): Round => g.rounds[Math.min(g.index, g.rounds.length - 1)]
const canMove = (g: Game): boolean => g.phase === 'play' || g.phase === 'wrong'

/** The marker's mark for a place along the line (0 to 1): the nearest tick on a snapped line. */
export function markAt(l: Line, f: number): number {
  const c = Math.min(1, Math.max(0, Number.isFinite(f) ? f : 0))
  return l.snap ? Math.round(c * l.n) : c
}
/** Where a mark is along the line, 0 to 1. */
export const placeOf = (l: Line, m: number): number => (l.snap ? m / l.n : m)

/** Put the marker at a place along the line. Moving it takes back a "wrong". */
export function setMark(g: Game, f: number): Game {
  if (!canMove(g)) return g
  return { ...g, mark: markAt(roundOf(g).line, f), phase: 'play' }
}

/** Move the marker by steps: a tick on a snapped line, a hundredth of the line on a free one. The first move puts it in the middle. */
export function nudge(g: Game, steps: number): Game {
  if (!canMove(g)) return g
  const l = roundOf(g).line
  if (g.mark === null) return { ...g, mark: l.snap ? Math.round(l.n / 2) : 0.5, phase: 'play' }
  const next = l.snap ? Math.min(l.n, Math.max(0, g.mark + steps)) : Math.min(1, Math.max(0, Math.round((g.mark + steps / 100) * 1000) / 1000))
  return { ...g, mark: next, phase: 'play' }
}

/** Whether a mark is right for a round, and on which side of the number it is (+1: to its right, -1: to its left). */
export function judge(r: Round, m: number): { ok: boolean; side: -1 | 0 | 1 } {
  if (r.line.snap) return { ok: m === r.tick, side: m < (r.tick as number) ? -1 : m > (r.tick as number) ? 1 : 0 }
  const d = m - r.at
  return { ok: Math.abs(d) <= TOL, side: d < 0 ? -1 : d > 0 ? 1 : 0 }
}

/** Check the marker. Right: the round is won (first try, or after wrong ones). Wrong: a mistake is counted and the player may move the marker. */
export function check(g: Game): Game {
  if (!canMove(g) || g.mark === null) return g
  const j = judge(roundOf(g), g.mark)
  if (j.ok) return { ...g, phase: 'right', results: [...g.results, g.tries === 0 ? 'first' : 'retry'] }
  return { ...g, phase: 'wrong', tries: g.tries + 1, mistakes: g.mistakes + 1 }
}

/** After enough wrong tries the place is shown; the round counts as missed. */
export function reveal(g: Game): Game {
  if (g.phase !== 'wrong' || g.tries < REVEAL_AFTER) return g
  return { ...g, phase: 'shown', results: [...g.results, 'shown'] }
}

/** On to the next number, or to the end. */
export function advance(g: Game): Game {
  if (g.phase !== 'right' && g.phase !== 'shown') return g
  if (g.index + 1 >= g.rounds.length) return { ...g, phase: 'done' }
  return { ...g, index: g.index + 1, mark: null, phase: 'play', tries: 0 }
}

/** One to three stars: at most one mistake in the game is three, up to four is two. */
export function stars(mistakes: number, rounds = ROUNDS): 1 | 2 | 3 {
  if (mistakes <= 1) return 3
  return mistakes <= Math.ceil(rounds * 0.4) ? 2 : 1
}

/* ------------------------------------------------------------------ what to tell the player */

/** The number the marker stands for, as TeX: exact on a snapped line, "about" on a free one. */
export function markTex(r: Round, m: number, lang: Lang): string {
  const l = r.line
  if (l.snap) return l.style === 'int' ? bothTex(tickValue(l, m), lang) : styleTex(tickValue(l, m), l.style, lang)
  const x = Number(l.min.n) + m * (Number(l.max.n) - Number(l.min.n))
  const t = x.toFixed(2)
  return `\\approx ${lang === 'id' ? t.replace('.', '{,}') : t}`
}

/** A form worth showing next to another: a fraction in lowest terms, not 14/8. */
const isPlain = (s: Spec): boolean => s.k !== 'frac' || rat(s.n, s.d).d === s.d

/** What is true of the number once it is placed: the other ways to write it, or, for a root, π or e, its first digits. */
export function equalsTex(r: Round, lang: Lang): string {
  if (r.spec.k === 'const' || !r.line.snap) return `${fishTex(r.spec, lang)}\\approx ${approxTex(r.spec, lang)}`
  const v = tickValue(r.line, r.tick as number)
  const own = fishTex(r.spec, lang)
  const parts = [own]
  const others = formsOf(v, 4)
  // the forms a reader may not have thought of: the fraction in lowest terms, the decimal, the percent
  const wanted: Family[] = ['fraction', 'decimal', 'repeating', 'percent']
  for (const fam of wanted) {
    const s = others.find((o) => familyOf(o) === fam && isPlain(o) && fishTex(o, lang) !== own && !parts.includes(fishTex(o, lang)))
    if (s && parts.length < 3) parts.push(fishTex(s, lang))
  }
  return parts.length > 1 ? parts.join('=') : own
}
