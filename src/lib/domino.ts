/** The "Math Domino" game: dominoes whose halves show a calculation, and the rules of the game.
 *
 *  A tile has two halves and each half shows a calculation such as `3+4` or `10-3` or, now and then, just the number (`7`), so the two halves of a tile are
 *  often of different kinds. Two halves that touch must be *equal in value*, so `3+4` goes next to
 *  `10-3` (both are 7) and not next to `2×4`. Every tile set has nine values and every pair of values makes one tile (45 tiles, which is enough for 8
 *  players). The game is played with the draw rules of ordinary dominoes:
 *
 *   - the first player may put down any tile; after that a tile goes at the left end or at the right end of the chain, with a half of equal value touching;
 *   - a player with no tile that fits draws from the boneyard (one tile at a time) until one fits, and passes when the boneyard is empty;
 *   - putting a tile that does not fit is a miscalculation: the tile goes back, the player draws `MISS_PENALTY` tiles as a penalty (fewer if the boneyard
 *     has fewer) and the turn passes. Three tiles is a heavy price, so putting a tile down on purpose
 *     where it does not fit, to pass the turn, is never worth it;
 *   - the first player to run out of tiles wins; if nobody can move, the player with the fewest tiles left wins.
 *
 *  What a half is worth is a number of its own (`Half.v`, a place in the mode's list of nine values), and the expression is what the player has to read. The
 *  engine compares only `v`; `tools/check-domino.mjs` reads the TeX of every half back with its own parser and tests it against the value the half claims.
 *
 *  Everything here is pure and seeded (the same seed gives the same tiles and the same deal), so a script can play whole games. `src/lib/dominonet.ts`
 *  carries the same rules over the network: one player's browser is the referee. */

import type { Loc } from '../content/types'

export type Level = 1 | 2 | 3
export type ModeId = 'natural' | 'integer' | 'times' | 'integer-times' | 'fraction' | 'mixed' | 'decimal' | 'percent' | 'power' | 'linear' | 'forms'
/** How the value of a place of a mode is written when a half is just the number: 7, a fraction, a decimal, or the solution x=7. */
export type Style = 'int' | 'frac' | 'decimal' | 'solve'
export type End = 'left' | 'right'
export type Strength = 'easy' | 'medium' | 'hard'

/** How many values a tile set has, and so how many tiles: every pair of values once. */
export const VALUES = 9
export const TILE_COUNT = (VALUES * (VALUES + 1)) / 2
export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 8
/** A game that has gone on this many turns is stopped as blocked (a guard against two players who keep missing on purpose). */
export const MAX_TURNS = 300
/** The tiles a player draws for a miscalculation: enough that a wrong tile is never a cheap way to pass the turn. */
export const MISS_PENALTY = 3

/** Tiles dealt to each player: seven up to four players, then fewer so that the boneyard never runs dry at the start. */
export const handSize = (players: number): number => (players <= 4 ? 7 : players === 5 ? 6 : 5)

/* ----------------------------------------------------------------------------------------------- seeded random */

export type Rng = () => number
export function makeRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
/** An integer from lo to hi, both included. */
const ri = (rng: Rng, lo: number, hi: number): number => lo + Math.floor(rng() * (hi - lo + 1))
const pick = <T>(rng: Rng, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)]
function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ----------------------------------------------------------------------------------------------- the modes */

/** An exact value n/d (d > 0, lowest terms). */
export interface Frac {
  n: number
  d: number
}

export interface ModeInfo {
  id: ModeId
  name: Loc
  about: Loc
  /** two expressions of the same value, to show what a pair looks like */
  example: [string, string]
  /** the nine values a tile can have, smallest first */
  domain: Frac[]
  /** how a plain half of this mode is written */
  style: Style
  /** how the values are told to the player */
  range: Loc
}

const L = (en: string, id: string): Loc => ({ en, id })
const ints = (lo: number, hi: number): Frac[] => Array.from({ length: hi - lo + 1 }, (_, i) => ({ n: lo + i, d: 1 }))
/** n/d in lowest terms */
const reduce = (n: number, d: number): Frac => {
  const g = ((a: number, b: number): number => { while (b) [a, b] = [b, a % b]; return a })(n, d)
  return { n: n / g, d: d / g }
}
/** the values of the mode about fractions, decimals and percents, as [numerator, denominator] */
const FORMS_VALUES: [number, number][] = [[1, 10], [1, 5], [1, 4], [2, 5], [1, 2], [3, 5], [3, 4], [4, 5], [9, 10]]
const halves = (): Frac[] => Array.from({ length: VALUES }, (_, i) => (i % 2 === 1 ? { n: (i + 1) / 2, d: 1 } : { n: i + 1, d: 2 }))

export const MODES: ModeInfo[] = [
  {
    id: 'natural',
    name: L('Natural numbers: add and subtract', 'Bilangan asli: tambah dan kurang'),
    about: L('Sums and differences of natural numbers, such as $3+4$ and $10-3$.', 'Jumlah dan selisih bilangan asli, seperti $3+4$ dan $10-3$.'),
    example: ['3+4', '10-3'],
    domain: ints(1, 9),
    style: 'int',
    range: L('values $1$ to $9$', 'nilai $1$ sampai $9$'),
  },
  {
    id: 'integer',
    name: L('Integers: add and subtract', 'Bilangan bulat: tambah dan kurang'),
    about: L('Sums and differences with negative numbers, such as $-3+5$ and $4-(-2)$.', 'Jumlah dan selisih dengan bilangan negatif, seperti $-3+5$ dan $4-(-2)$.'),
    example: ['-3+5', '6-4'],
    domain: ints(-4, 4),
    style: 'int',
    range: L('values $-4$ to $4$', 'nilai $-4$ sampai $4$'),
  },
  {
    id: 'times',
    name: L('Natural numbers: multiply and divide', 'Bilangan asli: kali dan bagi'),
    about: L('Products and quotients, such as $2\\times4$ and $24\\div3$.', 'Hasil kali dan hasil bagi, seperti $2\\times4$ dan $24\\div3$.'),
    example: ['2\\times4', '24\\div3'],
    domain: ints(2, 10),
    style: 'int',
    range: L('values $2$ to $10$', 'nilai $2$ sampai $10$'),
  },
  {
    id: 'integer-times',
    name: L('Integers: multiply and divide', 'Bilangan bulat: kali dan bagi'),
    about: L('Products and quotients with negative numbers, such as $(-2)\\times3$ and $12\\div(-4)$.', 'Hasil kali dan hasil bagi dengan bilangan negatif, seperti $(-2)\\times3$ dan $12\\div(-4)$.'),
    example: ['(-2)\\times3', '12\\div(-2)'],
    domain: ints(-4, 4),
    style: 'int',
    range: L('values $-4$ to $4$', 'nilai $-4$ sampai $4$'),
  },
  {
    id: 'fraction',
    name: L('Fractions: add, subtract and simplify', 'Pecahan: tambah, kurang, dan sederhanakan'),
    about: L('Fractions that are equal in different forms, such as $\\frac12$ and $\\frac24$, and sums such as $\\frac14+\\frac14$.', 'Pecahan yang sama dalam bentuk berbeda, seperti $\\frac12$ dan $\\frac24$, dan jumlah seperti $\\frac14+\\frac14$.'),
    example: ['\\frac{1}{4}+\\frac{1}{4}', '\\frac{3}{6}'],
    domain: halves(),
    style: 'frac',
    range: L('values $\\frac12$ to $4\\frac12$ in steps of $\\frac12$', 'nilai $\\frac12$ sampai $4\\frac12$ dengan selisih $\\frac12$'),
  },
  {
    id: 'mixed',
    name: L('Order of operations', 'Urutan operasi hitung'),
    about: L('All four operations and brackets, such as $2+3\\times4$ and $(8-2)\\div3$: multiply and divide first.', 'Keempat operasi dan tanda kurung, seperti $2+3\\times4$ dan $(8-2)\\div3$: kali dan bagi dulu.'),
    example: ['2+3\\times4', '28\\div2'],
    domain: ints(2, 10),
    style: 'int',
    range: L('values $2$ to $10$', 'nilai $2$ sampai $10$'),
  },
  {
    id: 'decimal',
    name: L('Decimals: add and subtract', 'Desimal: tambah dan kurang'),
    about: L('Sums and differences of decimals, such as $0.4+0.3$ and $1.2-0.5$.', 'Jumlah dan selisih desimal, seperti $0{,}4+0{,}3$ dan $1{,}2-0{,}5$.'),
    example: ['0.4+0.3', '1.2-0.5'],
    domain: Array.from({ length: VALUES }, (_, i) => reduce(i + 1, 10)),
    style: 'decimal',
    range: L('values $0.1$ to $0.9$', 'nilai $0{,}1$ sampai $0{,}9$'),
  },
  {
    id: 'percent',
    name: L('Percentages of a number', 'Persen dari suatu bilangan'),
    about: L('A percentage of a number, such as $50\\%\\times8$ and $10\\%\\times40$: both are $4$.', 'Persen dari suatu bilangan, seperti $50\\%\\times8$ dan $10\\%\\times40$: keduanya $4$.'),
    example: ['50\\%\\times8', '10\\%\\times40'],
    domain: ints(2, 10),
    style: 'int',
    range: L('values $2$ to $10$', 'nilai $2$ sampai $10$'),
  },
  {
    id: 'power',
    name: L('Powers and roots', 'Pangkat dan akar'),
    about: L('Squares, cubes and roots, alone or with a small number added or taken away, such as $3^{2}-2$ and $\\sqrt{49}$: both are $7$.', 'Kuadrat, pangkat tiga, dan akar, sendiri atau ditambah atau dikurangi bilangan kecil, seperti $3^{2}-2$ dan $\\sqrt{49}$: keduanya $7$.'),
    example: ['3^{2}-2', '\\sqrt{49}'],
    domain: ints(2, 10),
    style: 'int',
    range: L('values $2$ to $10$', 'nilai $2$ sampai $10$'),
  },
  {
    id: 'linear',
    name: L('Solve for x', 'Selesaikan nilai x'),
    about: L('Each half is an equation and its value is the solution, such as $x+3=7$ and $2x=8$: both have $x=4$.', 'Setiap sisi adalah persamaan dan nilainya adalah penyelesaiannya, seperti $x+3=7$ dan $2x=8$: keduanya $x=4$.'),
    example: ['x+3=7', '2x=8'],
    domain: ints(1, 9),
    style: 'solve',
    range: L('solutions $x=1$ to $x=9$', 'penyelesaian $x=1$ sampai $x=9$'),
  },
  {
    id: 'forms',
    name: L('Fractions, decimals and percents', 'Pecahan, desimal, dan persen'),
    about: L('One number written as a fraction, a decimal or a percent, such as $\\frac{1}{4}$, $0.25$ and $25\\%$, and sums of them.', 'Satu bilangan yang ditulis sebagai pecahan, desimal, atau persen, seperti $\\frac{1}{4}$, $0{,}25$, dan $25\\%$, dan jumlah dari semuanya.'),
    example: ['\\frac{1}{4}', '25\\%'],
    domain: FORMS_VALUES.map(([n, d]) => ({ n, d })),
    style: 'frac',
    range: L('values $\\frac{1}{10}$ to $\\frac{9}{10}$', 'nilai $\\frac{1}{10}$ sampai $\\frac{9}{10}$'),
  },
]
export const modeInfo = (id: ModeId): ModeInfo => MODES.find((m) => m.id === id) as ModeInfo
/** What the value at place `i` of a mode is, as TeX: `-3`, `7`, `\frac{3}{2}`. Shown when the player asks to see the value of an end. */
export function valueTex(mode: ModeId, i: number): string {
  const m = modeInfo(mode)
  const f = m.domain[i]
  if (m.style === 'decimal') return dec(Math.round((f.n * 100) / f.d))
  if (m.style === 'solve') return `x=${f.n}`
  return f.d === 1 ? String(f.n) : `\\frac{${f.n}}{${f.d}}`
}
/** What the value of a place is worth, as the number alone (the plain half of the mode about x is `x=4`, and what it is worth is `4`). */
export const worthTex = (mode: ModeId, i: number): string => (modeInfo(mode).style === 'solve' ? valueTex(mode, i).slice(2) : valueTex(mode, i))
/** The TeX of a half or a value as the player's language writes it: the decimal point is a comma in Indonesian. */
export const localTex = (tex: string, lang: string): string => (lang === 'id' ? tex.replace(/(\d)\.(\d)/g, '$1{,}$2') : tex)
export const isModeId = (s: unknown): s is ModeId => MODES.some((m) => m.id === s)
export const isLevel = (n: unknown): n is Level => n === 1 || n === 2 || n === 3

/** An integer as an operand after the first: negative numbers go in brackets. */
const later = (x: number): string => (x < 0 ? `(${x})` : String(x))
/** A sum or difference of integers, written from `[sign, value]` terms: -3+5, 4-(-2). */
function terms(ts: [1 | -1, number][]): string {
  return ts.map(([s, x], i) => (i === 0 ? (s === 1 ? String(x) : `-${later(x)}`) : `${s === 1 ? '+' : '-'}${later(x)}`)).join('')
}

type Form = (v: number, level: Level, rng: Rng) => string | null
/** Try the forms (a form may decline a value) until one gives an expression. */
function express(forms: Form[], v: number, level: Level, rng: Rng, fallback: string): string {
  for (let tries = 0; tries < 80; tries++) {
    const s = pick(rng, forms)(v, level, rng)
    if (s !== null) return s
  }
  return fallback
}
const cap = (level: Level, a: number, b: number, c: number): number => [0, a, b, c][level]

/* natural numbers, + and -: every number in an expression is at least 1 */
const naturalForms: Form[] = [
  (v, lv, rng) => (v >= 2 && lv <= 2 ? (() => { const a = ri(rng, 1, v - 1); return `${a}+${v - a}` })() : null),
  (v, lv, rng) => { const b = ri(rng, 1, cap(lv, 9, 40, 99)); return `${v + b}-${b}` },
  (v, lv, rng) => {
    if (lv === 1) return null
    const m = cap(lv, 0, 20, 60)
    const a = ri(rng, 1, m)
    const b = ri(rng, 1, m)
    return a + b > v ? `${a}+${b}-${a + b - v}` : null
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const b = ri(rng, 1, 40)
    const c = ri(rng, 1, 40)
    return `${v + b + c}-${b}-${c}`
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const b = ri(rng, 2, 60)
    const c = ri(rng, 1, b - 1)
    return `${v + b - c}-(${b}-${c})`
  },
]

/* integers, + and -: no operand is 0 */
const integerForms: Form[] = [
  (v, lv, rng) => {
    const m = cap(lv, 6, 15, 40)
    const a = ri(rng, -m, m)
    const b = v - a
    return a === 0 || b === 0 || Math.abs(b) > m ? null : terms([[1, a], [1, b]])
  },
  (v, lv, rng) => {
    const m = cap(lv, 6, 15, 40)
    const a = ri(rng, -m, m)
    const b = a - v
    return a === 0 || b === 0 || Math.abs(b) > m ? null : terms([[1, a], [-1, b]])
  },
  (v, lv, rng) => {
    if (lv === 1) return null
    const m = cap(lv, 0, 12, 30)
    const a = ri(rng, -m, m)
    const b = ri(rng, -m, m)
    const c = v - a - b
    return a === 0 || b === 0 || c === 0 || Math.abs(c) > m ? null : terms([[1, a], [1, b], [1, c]])
  },
  (v, lv, rng) => {
    if (lv === 1) return null
    const m = cap(lv, 0, 12, 30)
    const a = ri(rng, -m, m)
    const b = ri(rng, -m, m)
    const c = a + b - v
    return a === 0 || b === 0 || c === 0 || Math.abs(c) > m ? null : terms([[1, a], [1, b], [-1, c]])
  },
]

/* natural numbers, × and ÷ */
const TIMES = '\\times'
const DIV = '\\div'
const timesForms: Form[] = [
  (v, _lv, rng) => {
    const ds = Array.from({ length: v }, (_, i) => i + 1).filter((d) => v % d === 0 && d > 1 && d < v)
    return ds.length ? (() => { const a = pick(rng, ds); return `${a}${TIMES}${v / a}` })() : null
  },
  (v, lv, rng) => { const k = ri(rng, 2, cap(lv, 9, 12, 25)); return `${v * k}${DIV}${k}` },
  (v, lv, rng) => {
    if (lv === 1) return null
    const c = ri(rng, 2, 9)
    const a = ri(rng, 2, 12)
    return (v * c) % a === 0 && (v * c) / a >= 2 ? `${a}${TIMES}${(v * c) / a}${DIV}${c}` : null
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const c = ri(rng, 2, 9)
    const b = ri(rng, 2, 9)
    return v % c === 0 && v / c >= 2 ? `${(v / c) * b}${DIV}${b}${TIMES}${c}` : null
  },
]

/* integers, × and ÷: a negative operand is always in brackets, the first one too */
const par = (x: number): string => (x < 0 ? `(${x})` : String(x))
const integerTimesForms: Form[] = [
  (v, _lv, rng) => {
    if (v === 0) {
      const k = pick(rng, [-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9])
      return rng() < 0.5 ? `0${TIMES}${par(k)}` : `${par(k)}${TIMES}0`
    }
    const abs = Math.abs(v)
    const ds = Array.from({ length: abs }, (_, i) => i + 1).filter((d) => abs % d === 0)
    const good = ds.filter((d) => d > 1 && d < abs)
    const d = pick(rng, good.length ? good : ds)
    const a = rng() < 0.5 ? d : -d
    return `${par(a)}${TIMES}${par(v / a)}`
  },
  (v, lv, rng) => {
    const k = ri(rng, 2, cap(lv, 9, 12, 20)) * (rng() < 0.5 ? -1 : 1)
    return `${par(v * k)}${DIV}${par(k)}`
  },
  (v, lv, rng) => {
    if (lv === 1) return null
    const c = ri(rng, 2, 9) * (rng() < 0.5 ? -1 : 1)
    const a = ri(rng, 2, 9) * (rng() < 0.5 ? -1 : 1)
    return (v * c) % a === 0 && v * c !== 0 ? `${par(a)}${TIMES}${par((v * c) / a)}${DIV}${par(c)}` : null
  },
]

/* fractions: the value is n/2 */
const frac = (a: number, d: number): string => `\\frac{${a}}{${d}}`
const fractionForms = (n: number): Form[] => [
  // an equal fraction in other terms, kept small enough to read on a tile: 36/8, never 72/16
  (_v, lv, rng) => { const k = ri(rng, 2, Math.max(2, Math.min(cap(lv, 3, 5, 8), Math.floor(40 / n)))); return frac(n * k, 2 * k) },
  (_v, lv, rng) => {
    const ds = lv === 1 ? [2, 4] : lv === 2 ? [2, 3, 4, 6, 8] : [2, 3, 4, 5, 6, 8]
    const d1 = pick(rng, ds)
    const d2 = lv === 3 ? pick(rng, ds) : d1
    const a = ri(rng, 1, Math.max(1, Math.floor((n * d1 - 1) / 2)))
    const num = d2 * (n * d1 - 2 * a)
    const den = 2 * d1
    return num > 0 && num % den === 0 ? `${frac(a, d1)}+${frac(num / den, d2)}` : null
  },
  (_v, lv, rng) => {
    const ds = lv === 1 ? [2, 4] : lv === 2 ? [2, 3, 4, 6, 8] : [2, 3, 4, 5, 6, 8]
    const d1 = pick(rng, ds)
    const d2 = lv === 3 ? pick(rng, ds) : d1
    const b = ri(rng, 1, 3 * d2)
    const num = d1 * (n * d2 + 2 * b)
    const den = 2 * d2
    return num % den === 0 && num / den <= 60 ? `${frac(num / den, d1)}-${frac(b, d2)}` : null
  },
]

/** The value of a plain expression (digits, + - * / and brackets) when every step is a whole number of at least 1, else null. */
export function evalPlain(src: string): number | null {
  let i = 0
  let bad = false
  const num = (): number => {
    if (src[i] === '(') {
      i++
      const v = expr()
      if (src[i] !== ')') bad = true
      i++
      return v
    }
    const m = /^\d+/.exec(src.slice(i))
    if (!m) {
      bad = true
      return 0
    }
    i += m[0].length
    return Number(m[0])
  }
  const check = (v: number): number => {
    if (!Number.isInteger(v) || v < 1) bad = true
    return v
  }
  const term = (): number => {
    let v = num()
    while (src[i] === '*' || src[i] === '/') {
      const op = src[i++]
      const w = num()
      v = check(op === '*' ? v * w : w === 0 ? NaN : v / w)
    }
    return v
  }
  function expr(): number {
    let v = term()
    while (src[i] === '+' || src[i] === '-') {
      const op = src[i++]
      const w = term()
      v = check(op === '+' ? v + w : v - w)
    }
    return v
  }
  const v = expr()
  return bad || i !== src.length ? null : v
}

const MIXED: Record<1 | 2 | 3, string[]> = {
  1: ['a+b*c', 'a*b+c', 'a*b-c', 'a-b*c', 'a+b+c'],
  2: ['a+b*c', 'a*b+c', 'a*b-c', 'a-b*c', '(a+b)*c', 'a+b/c', 'a-b/c', 'a*b/c', '(a-b)*c', 'a/b+c', '(a+b)/c', '(a-b)/c', 'a*b-c*d'],
  3: ['a+b*c-d', '(a+b)*c-d', 'a*b+c/d', 'a-b*c+d', '(a+b)*(c-d)', 'a*(b+c)-d', 'a/b+c*d', 'a*b-c*d', '(a+b)/c+d', 'a-b/c*d'],
}
const mixedForm: Form = (v, lv, rng) => {
  const cap2 = cap(lv, 9, 12, 20)
  for (let tries = 0; tries < 400; tries++) {
    const t = pick(rng, MIXED[lv])
    const s = t.replace(/[a-d]/g, () => String(ri(rng, 1, cap2)))
    if (evalPlain(s) === v) return s.replace(/\*/g, TIMES).replace(/\//g, DIV)
  }
  return null
}

/* decimals, + and -: the value is t/10 (0.1 to 0.9); every operand is a decimal of at least 0.05 and at most two places, written 1.2, 0.35, never 1.20 */
/** Hundredths as a decimal number: 120 is 1.2, 35 is 0.35, 100 is 1.0. */
const dec = (h: number): string => {
  const whole = Math.floor(h / 100)
  const rest = h % 100
  return rest % 10 === 0 ? `${whole}.${rest / 10}` : `${whole}.${String(rest).padStart(2, '0')}`
}
const decimalForms: Form[] = [
  (v, lv, rng) => {
    const V = Math.round(v * 100)
    const step = lv === 1 ? 10 : 5
    if (V / step < 2) return null
    const a = step * ri(rng, 1, V / step - 1)
    return `${dec(a)}+${dec(V - a)}`
  },
  (v, lv, rng) => {
    const V = Math.round(v * 100)
    const step = lv === 1 ? 10 : 5
    const b = step * ri(rng, 1, cap(lv, 100, 200, 450) / step)
    return `${dec(V + b)}-${dec(b)}`
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const V = Math.round(v * 100)
    const a = 5 * ri(rng, 2, 80)
    const b = 5 * ri(rng, 1, 80)
    const c = a + b - V
    return c >= 5 && c <= 400 ? `${dec(a)}+${dec(b)}-${dec(c)}` : null
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const V = Math.round(v * 100)
    const b = 5 * ri(rng, 1, 60)
    const c = 5 * ri(rng, 1, 60)
    return `${dec(V + b + c)}-${dec(b)}-${dec(c)}`
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    // a - b + c: a stays above b, so that no step is below zero
    const V = Math.round(v * 100)
    if (V < 10) return null
    const b = 5 * ri(rng, 1, 80)
    const c = 5 * ri(rng, 1, V / 5 - 1)
    return `${dec(V + b - c)}-${dec(b)}+${dec(c)}`
  },
]

/* percentages of a number: p% × n, the value is a whole number from 2 to 10 */
const PERCENTS: Record<Level, number[]> = { 1: [50, 25, 10], 2: [50, 25, 10, 20, 75, 5, 40, 60, 30, 80], 3: [50, 25, 10, 20, 75, 5, 40, 60, 30, 80, 15, 35, 45, 90, 120, 150, 200] }
const PERCENT_N: Record<Level, number> = { 1: 100, 2: 200, 3: 400 }
const percentBases = (w: number, lv: Level): [number, number][] =>
  PERCENTS[lv].filter((p) => (100 * w) % p === 0 && (100 * w) / p >= 2 && (100 * w) / p <= PERCENT_N[lv]).map((p) => [p, (100 * w) / p])
const percentForms: Form[] = [
  (v, lv, rng) => {
    const bs = percentBases(v, lv)
    if (!bs.length) return null
    const [p, n] = pick(rng, bs)
    return `${p}\\%${TIMES}${n}`
  },
  (v, lv, rng) => {
    if (lv < 2) return null
    const bs = percentBases(v, lv)
    if (!bs.length) return null
    const [p, n] = pick(rng, bs)
    return `${n}${TIMES}${p}\\%`
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const k = ri(rng, 1, 9)
    const bs = v - k >= 2 ? percentBases(v - k, lv) : []
    if (!bs.length) return null
    const [p, n] = pick(rng, bs)
    return `${p}\\%${TIMES}${n}+${k}`
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const k = ri(rng, 1, 9)
    const bs = percentBases(v + k, lv)
    if (!bs.length) return null
    const [p, n] = pick(rng, bs)
    return `${p}\\%${TIMES}${n}-${k}`
  },
]

/* powers and roots: squares, cubes, powers of 2, square and cube roots, alone or with a small number added or taken away (two of them at level 3) */
interface Atom {
  tex: string
  v: number
}
const powAtom = (a: number, k: number): Atom => ({ tex: `${a}^{${k}}`, v: a ** k })
const rootAtom = (a: number): Atom => ({ tex: `\\sqrt{${a * a}}`, v: a })
const cbrtAtom = (a: number): Atom => ({ tex: `\\sqrt[3]{${a ** 3}}`, v: a })
function atomsOf(lv: Level): Atom[] {
  const out: Atom[] = []
  const sq = cap(lv, 6, 9, 10)
  for (let a = 2; a <= sq; a++) out.push(powAtom(a, 2))
  for (let a = 2; a <= cap(lv, 3, 4, 4); a++) out.push(powAtom(a, 3))
  for (let k = 2; k <= cap(lv, 5, 6, 6); k++) out.push(powAtom(2, k))
  for (let a = 2; a <= cap(lv, 7, 10, 10); a++) out.push(rootAtom(a))
  if (lv >= 2) for (let a = 2; a <= 4; a++) out.push(cbrtAtom(a))
  // 2^2 and 4^1-like duplicates are not wanted: keep one atom per text
  return out.filter((x, i, xs) => xs.findIndex((y) => y.tex === x.tex) === i)
}
const powerCache = new Map<Level, Atom[]>()
const powerForm: Form = (v, lv, rng) => {
  let atoms = powerCache.get(lv)
  if (!atoms) powerCache.set(lv, (atoms = atomsOf(lv)))
  const out: string[] = []
  for (const A of atoms) {
    if (A.v === v) out.push(A.tex)
    for (let b = 1; b <= 9; b++) {
      if (A.v + b === v) out.push(`${A.tex}+${b}`, `${b}+${A.tex}`)
      if (A.v - b === v) out.push(`${A.tex}-${b}`)
      if (b - A.v === v) out.push(`${b}-${A.tex}`)
    }
    if (lv >= 3)
      for (const B of atoms) {
        if (B.tex === A.tex) continue
        if (A.v + B.v === v) out.push(`${A.tex}+${B.tex}`)
        if (A.v - B.v === v) out.push(`${A.tex}-${B.tex}`)
      }
  }
  // the plain atom alone is a calculation too (3^2, the root of 49); a value the list cannot reach is declined
  return out.length ? pick(rng, out) : null
}

/* solving for x: the half is an equation and its value is the solution, 1 to 9 */
const fr = (a: string, d: number): string => `\\frac{${a}}{${d}}`
const linearForms: Form[] = [
  (v, _lv, rng) => {
    const b = ri(rng, 1, 9)
    return `x+${b}=${v + b}`
  },
  (v, _lv, rng) => (v >= 2 ? (() => { const b = ri(rng, 1, Math.min(9, v - 1)); return `x-${b}=${v - b}` })() : null),
  (v, _lv, rng) => { const a = ri(rng, 2, 9); return `${a}x=${a * v}` },
  (v, lv, rng) => (lv >= 2 ? (() => { const a = ri(rng, 2, 9); const b = ri(rng, 1, 9); return `${a}x+${b}=${a * v + b}` })() : null),
  (v, lv, rng) => {
    if (lv < 2) return null
    const a = ri(rng, 2, 9)
    const b = ri(rng, 1, 9)
    return a * v - b >= 1 ? `${a}x-${b}=${a * v - b}` : null
  },
  (v, lv, rng) => {
    if (lv < 2) return null
    const ds = [2, 3, 4, 5, 6, 7, 8, 9].filter((a) => v % a === 0)
    return ds.length ? (() => { const a = pick(rng, ds); return `${fr('x', a)}=${v / a}` })() : null
  },
  (v, lv, rng) => {
    if (lv < 2) return null
    const b = ri(rng, v + 1, 9 + v)
    return b - v >= 1 ? `${b}-x=${b - v}` : null
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const a = ri(rng, 2, 9)
    const b = ri(rng, 1, 9)
    return `${a}(x+${b})=${a * (v + b)}`
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const a = ri(rng, 2, 9)
    const b = ri(rng, 1, Math.max(1, v - 1))
    return v > b ? `${a}(x-${b})=${a * (v - b)}` : null
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const a = ri(rng, 3, 9)
    const c = ri(rng, 1, a - 1)
    const b = ri(rng, 1, 9)
    const d = (a - c) * v + b
    return d <= 99 ? `${a}x+${b}=${c}x+${d}` : null
  },
  (v, lv, rng) => {
    if (lv < 3) return null
    const a = ri(rng, 2, 9)
    const b = ri(rng, 1, 9)
    return (v + b) % a === 0 ? `${fr(`x+${b}`, a)}=${(v + b) / a}` : null
  },
]

/* fractions, decimals and percents: the value is one of 1/10 1/5 1/4 2/5 1/2 3/5 3/4 4/5 9/10 written as a fraction (in other terms too), a decimal or a
 * percent; at levels 2 and 3 two or three of them added or taken away. W is a number of hundredths (a percent). */
const gcdN = (a: number, b: number): number => (b === 0 ? a : gcdN(b, a % b))
/** A number of hundredths written one of three ways: the fraction (maybe not in lowest terms, with a denominator up to 20), the decimal, the percent. */
function formOf(W: number, kind: 0 | 1 | 2, rng: Rng, minK = 1): string {
  if (kind === 1) return dec(W)
  if (kind === 2) return `${W}\\%`
  const g = gcdN(W, 100)
  const n0 = W / g
  const d0 = 100 / g
  // a denominator of at least 2 (never 1/1), and at level 1 never the fraction in lowest terms itself, which is how a plain half is written
  const lo = Math.max(minK, d0 === 1 ? 2 : 1)
  const k = ri(rng, lo, Math.max(lo, Math.floor(20 / d0)))
  return frac(n0 * k, d0 * k)
}
const formsForm: Form = (v, lv, rng) => {
  const V = Math.round(v * 100)
  for (let tries = 0; tries < 60; tries++) {
    if (lv === 1) {
      const kind = ri(rng, 0, 2) as 0 | 1 | 2
      return formOf(V, kind, rng, 2)
    }
    const a = 5 * ri(rng, 1, lv === 2 ? 30 : 40)
    const b = V - a
    if (b >= 5 && lv >= 2 && rng() < 0.55) return `${formOf(a, ri(rng, 0, 2) as 0 | 1 | 2, rng)}+${formOf(b, ri(rng, 0, 2) as 0 | 1 | 2, rng)}`
    const c = a - V
    if (c >= 5) return `${formOf(a, ri(rng, 0, 2) as 0 | 1 | 2, rng)}-${formOf(c, ri(rng, 0, 2) as 0 | 1 | 2, rng)}`
    if (lv >= 3) {
      const e = 5 * ri(rng, 1, 30)
      const f = a + e - V
      if (f >= 5 && f <= 150) return `${formOf(a, ri(rng, 0, 2) as 0 | 1 | 2, rng)}+${formOf(e, ri(rng, 0, 2) as 0 | 1 | 2, rng)}-${formOf(f, ri(rng, 0, 2) as 0 | 1 | 2, rng)}`
    }
  }
  return null
}

/** An expression that is worth the value at index `i` of the mode's list, at the given level. */
export function expressionFor(mode: ModeId, i: number, level: Level, rng: Rng): string {
  const m = modeInfo(mode)
  const f = m.domain[i]
  const v = f.n / f.d
  switch (mode) {
    case 'natural':
      return express(naturalForms, v, level, rng, `${v - 1}+1`)
    case 'integer':
      return express(integerForms, v, level, rng, `${v + 1}-1`)
    case 'times':
      return express(timesForms, v, level, rng, `${v * 2}${DIV}2`)
    case 'integer-times':
      return express(integerTimesForms, v, level, rng, `${par(v * 2)}${DIV}2`)
    case 'fraction':
      return express(fractionForms(i + 1), v, level, rng, frac((i + 1) * 2, 4))
    case 'mixed':
      return express([mixedForm, (w) => `${w - 1}+1`], v, level, rng, `${v - 1}+1`)
    case 'decimal':
      return express(decimalForms, v, level, rng, `${dec(Math.round(v * 100) + 10)}-0.1`)
    case 'percent':
      return express(percentForms, v, level, rng, `100\\%${TIMES}${v}`)
    case 'power':
      return express([powerForm], v, level, rng, `\\sqrt{${v * v}}`)
    case 'linear':
      return express(linearForms, v, level, rng, `x+1=${v + 1}`)
    case 'forms':
      return express([formsForm], v, level, rng, frac(i + 1 === 1 ? 2 : FORMS_VALUES[i][0] * 2, FORMS_VALUES[i][1] * 2))
  }
}

/* ----------------------------------------------------------------------------------------------- tiles */

export interface Half {
  /** the place of its value in the mode's list of nine */
  v: number
  tex: string
}
export interface Tile {
  id: number
  a: Half
  b: Half
}

/** How often a half is just the number (7, -3, ½) and not a calculation, by level: 3 halves in 10, 1 in 4, 1 in 5. */
export const PLAIN_CHANCE: Record<Level, number> = { 1: 0.3, 2: 0.25, 3: 0.2 }

/** The 45 tiles of a mode: one for every pair of values, each half a calculation of its value or, now and then, the plain number. No two calculations read alike when it can be helped. */
export function buildTiles(mode: ModeId, level: Level, rng: Rng): Tile[] {
  const seen = new Set<string>()
  const half = (v: number): Half => {
    // some halves are just the number, so that the two halves of a tile are often of different kinds
    if (rng() < PLAIN_CHANCE[level]) return { v, tex: valueTex(mode, v) }
    let tex = ''
    for (let k = 0; k < 14; k++) {
      tex = expressionFor(mode, v, level, rng)
      if (!seen.has(tex)) break
    }
    seen.add(tex)
    return { v, tex }
  }
  const tiles: Tile[] = []
  for (let i = 0; i < VALUES; i++) {
    for (let j = i; j < VALUES; j++) {
      let a = half(i)
      let b = half(j)
      if (rng() < 0.5) [a, b] = [b, a]
      tiles.push({ id: tiles.length, a, b })
    }
  }
  return tiles
}

/* ----------------------------------------------------------------------------------------------- the chain */

/** A tile on the table. `flip` shows its `b` half on the left and its `a` half on the right. */
export interface Placed {
  tile: Tile
  flip: boolean
}
export const leftHalf = (p: Placed): Half => (p.flip ? p.tile.b : p.tile.a)
export const rightHalf = (p: Placed): Half => (p.flip ? p.tile.a : p.tile.b)

export interface Ends {
  left: Half | null
  right: Half | null
}
/** The two open ends of a chain: the left half of its first tile and the right half of its last. */
export function endsOf(chain: readonly Placed[]): Ends {
  return chain.length === 0 ? { left: null, right: null } : { left: leftHalf(chain[0]), right: rightHalf(chain[chain.length - 1]) }
}

/** How a tile would lie at an end of the chain, or null when its values do not fit. On an empty chain any tile goes. */
export function placement(chain: readonly Placed[], tile: Tile, end: End): Placed | null {
  if (chain.length === 0) return { tile, flip: false }
  if (end === 'right') {
    const e = rightHalf(chain[chain.length - 1]).v
    if (tile.a.v === e) return { tile, flip: false }
    if (tile.b.v === e) return { tile, flip: true }
    return null
  }
  const e = leftHalf(chain[0]).v
  if (tile.b.v === e) return { tile, flip: false }
  if (tile.a.v === e) return { tile, flip: true }
  return null
}

export interface Move {
  tile: Tile
  end: End
  placed: Placed
}
/** Every way to play one of the tiles in a hand. On an empty chain that is each tile once. */
export function legalMoves(chain: readonly Placed[], hand: readonly Tile[]): Move[] {
  const out: Move[] = []
  for (const tile of hand) {
    for (const end of chain.length === 0 ? (['right'] as End[]) : (['left', 'right'] as End[])) {
      const placed = placement(chain, tile, end)
      if (placed) out.push({ tile, end, placed })
    }
  }
  return out
}
export const addToChain = (chain: readonly Placed[], placed: Placed, end: End): Placed[] => (end === 'left' && chain.length > 0 ? [placed, ...chain] : [...chain, placed])

/* ----------------------------------------------------------------------------------------------- the game */

export interface Game {
  mode: ModeId
  level: Level
  seed: number
  hands: Tile[][]
  /** tiles are drawn from the end */
  boneyard: Tile[]
  chain: Placed[]
  turn: number
  /** passes in a row since a tile was last played */
  passes: number
  /** turns taken: plays, passes and misses */
  turns: number
  status: 'play' | 'over'
  /** players who left; their tiles went back to the boneyard */
  gone: boolean[]
  mistakes: number[]
}

export type Action = { t: 'play'; tile: number; end: End } | { t: 'draw' } | { t: 'pass' }

export type GameEvent =
  | { k: 'play'; p: number; tile: Tile; end: End; start: boolean }
  /** `penalty` is how many tiles were drawn for it, from 0 (the boneyard was empty) to MISS_PENALTY */
  | { k: 'miss'; p: number; tile: Tile; end: End; penalty: number }
  | { k: 'draw'; p: number }
  | { k: 'pass'; p: number }
  | { k: 'out'; p: number }
  | { k: 'blocked' }
  | { k: 'left'; p: number }
  /** a player stepped away (left, or went silent): the tiles are kept until the turn comes to them */
  | { k: 'away'; p: number }
  | { k: 'back'; p: number }
  | { k: 'last' }

export type Refusal = 'over' | 'turn' | 'tile' | 'has-move' | 'empty-boneyard' | 'draw-first' | 'bad'

/** A new game for 2 to 8 players: the tiles, the deal, and a player to begin. */
export function newGame(mode: ModeId, level: Level, players: number, seed: number): Game {
  if (!Number.isInteger(players) || players < MIN_PLAYERS || players > MAX_PLAYERS) throw new RangeError('players must be 2 to 8')
  const rng = makeRng(seed)
  const deck = shuffle(rng, buildTiles(mode, level, rng))
  const n = handSize(players)
  const hands: Tile[][] = Array.from({ length: players }, (_, p) => deck.slice(p * n, (p + 1) * n))
  return {
    mode,
    level,
    seed,
    hands,
    boneyard: deck.slice(players * n),
    chain: [],
    turn: Math.floor(rng() * players),
    passes: 0,
    turns: 0,
    status: 'play',
    gone: Array(players).fill(false),
    mistakes: Array(players).fill(0),
  }
}

const copy = (g: Game): Game => ({ ...g, hands: g.hands.map((h) => [...h]), boneyard: [...g.boneyard], chain: [...g.chain], gone: [...g.gone], mistakes: [...g.mistakes] })
export const activePlayers = (g: Game): number => g.gone.filter((x) => !x).length
export const canPlay = (g: Game, p: number): boolean => legalMoves(g.chain, g.hands[p]).length > 0

function advance(g: Game): void {
  for (let k = 1; k <= g.hands.length; k++) {
    const q = (g.turn + k) % g.hands.length
    if (!g.gone[q]) {
      g.turn = q
      return
    }
  }
}

/** The game after the player's action, and what happened; or why the action is refused (the game is then unchanged). */
export function act(g0: Game, p: number, action: Action): { ok: true; g: Game; events: GameEvent[] } | { ok: false; reason: Refusal } {
  if (g0.status !== 'play') return { ok: false, reason: 'over' }
  if (!Number.isInteger(p) || p < 0 || p >= g0.hands.length || g0.gone[p] || p !== g0.turn) return { ok: false, reason: 'turn' }
  const g = copy(g0)
  const events: GameEvent[] = []
  const finish = () => {
    if (g.hands[p].length === 0) {
      g.status = 'over'
      events.push({ k: 'out', p })
    } else if (g.passes >= activePlayers(g)) {
      g.status = 'over'
      events.push({ k: 'blocked' })
    } else if (g.turns >= MAX_TURNS) {
      g.status = 'over'
      events.push({ k: 'blocked' })
    } else advance(g)
  }

  if (action.t === 'draw') {
    if (canPlay(g, p)) return { ok: false, reason: 'has-move' }
    const t = g.boneyard.pop()
    if (!t) return { ok: false, reason: 'empty-boneyard' }
    g.hands[p].push(t)
    events.push({ k: 'draw', p })
    return { ok: true, g, events }
  }
  if (action.t === 'pass') {
    if (canPlay(g, p)) return { ok: false, reason: 'has-move' }
    if (g.boneyard.length > 0) return { ok: false, reason: 'draw-first' }
    g.passes++
    g.turns++
    events.push({ k: 'pass', p })
    finish()
    return { ok: true, g, events }
  }
  if (action.t !== 'play' || (action.end !== 'left' && action.end !== 'right')) return { ok: false, reason: 'bad' }
  const at = g.hands[p].findIndex((t) => t.id === action.tile)
  if (at < 0) return { ok: false, reason: 'tile' }
  const tile = g.hands[p][at]
  const placed = placement(g.chain, tile, action.end)
  if (!placed) {
    // a miscalculation: the tile stays in the hand, tiles are drawn as a penalty, the turn passes
    let drawn = 0
    for (; drawn < MISS_PENALTY && g.boneyard.length > 0; drawn++) g.hands[p].push(g.boneyard.pop() as Tile)
    g.mistakes[p]++
    g.passes = 0
    g.turns++
    events.push({ k: 'miss', p, tile, end: action.end, penalty: drawn })
    finish()
    return { ok: true, g, events }
  }
  g.hands[p].splice(at, 1)
  const start = g.chain.length === 0
  g.chain = addToChain(g.chain, placed, action.end)
  g.passes = 0
  g.turns++
  events.push({ k: 'play', p, tile, end: action.end, start })
  finish()
  return { ok: true, g, events }
}

/** A player leaves: the tiles go back to the boneyard and the others play on. With one player left that player wins. */
export function removePlayer(g0: Game, p: number): { g: Game; events: GameEvent[] } {
  if (g0.status !== 'play' || p < 0 || p >= g0.hands.length || g0.gone[p]) return { g: g0, events: [] }
  const g = copy(g0)
  const events: GameEvent[] = [{ k: 'left', p }]
  g.boneyard.unshift(...g.hands[p])
  g.hands[p] = []
  g.gone[p] = true
  if (activePlayers(g) <= 1) {
    g.status = 'over'
    events.push({ k: 'last' })
  } else if (g.turn === p) advance(g)
  return { g, events }
}

export interface Standing {
  p: number
  /** tiles left */
  count: number
  rank: number
  gone: boolean
}
/** Who is where: fewest tiles left first, players who left last; equal counts share a rank. */
export function standings(g: Game): Standing[] {
  const rows = g.hands.map((h, p) => ({ p, count: h.length, gone: g.gone[p] }))
  rows.sort((x, y) => Number(x.gone) - Number(y.gone) || x.count - y.count || x.p - y.p)
  const out: Standing[] = []
  rows.forEach((r, i) => {
    const before = out[i - 1]
    const tied = before && before.gone === r.gone && before.count === r.count
    out.push({ ...r, rank: tied ? before.rank : i + 1 })
  })
  return out
}
/** Players in first place once the game is over (several when tiles are equal in a blocked game). */
export const winners = (g: Game): number[] => (g.status === 'over' ? standings(g).filter((s) => s.rank === 1).map((s) => s.p) : [])

/* ----------------------------------------------------------------------------------------------- the computer */

/** What a player can see: the table, the own hand and how many tiles the others hold. This is all a computer player is given. */
export interface View {
  hand: Tile[]
  chain: Placed[]
  boneyard: number
}
export const viewOf = (g: Game, p: number): View => ({ hand: g.hands[p], chain: g.chain, boneyard: g.boneyard.length })

/** A chance of calculating wrongly, per strength: easy computers put down a tile that does not fit one time in five, medium ones one time in sixteen. */
export const MISS_CHANCE: Record<Strength, number> = { easy: 1 / 5, medium: 1 / 16, hard: 0 }

/** The computer's action. It reads only its own hand and the table. */
export function choose(view: View, strength: Strength, rng: Rng): Action {
  const moves = legalMoves(view.chain, view.hand)
  if (moves.length === 0) return view.boneyard > 0 ? { t: 'draw' } : { t: 'pass' }
  if (view.chain.length > 0 && rng() < MISS_CHANCE[strength]) {
    const wrong: { tile: Tile; end: End }[] = []
    for (const tile of view.hand) for (const end of ['left', 'right'] as End[]) if (!placement(view.chain, tile, end)) wrong.push({ tile, end })
    if (wrong.length) {
      const w = pick(rng, wrong)
      return { t: 'play', tile: w.tile.id, end: w.end }
    }
  }
  if (strength === 'easy') {
    const m = pick(rng, moves)
    return { t: 'play', tile: m.tile.id, end: m.end }
  }
  // keep the hand flexible: after the move, as many tiles as possible should still fit an end; hard also leaves ends that few tiles in the game can match
  const seen = new Map<number, number>()
  const see = (v: number) => seen.set(v, (seen.get(v) ?? 0) + 1)
  for (const t of view.hand) {
    see(t.a.v)
    see(t.b.v)
  }
  for (const c of view.chain) {
    see(c.tile.a.v)
    see(c.tile.b.v)
  }
  let best = moves[0]
  let bestScore = -Infinity
  for (const m of moves) {
    const next = addToChain(view.chain, m.placed, m.end)
    const e = endsOf(next)
    const rest = view.hand.filter((t) => t.id !== m.tile.id)
    let score = 0
    for (const t of rest) for (const h of [t.a.v, t.b.v]) score += (h === e.left?.v ? 1 : 0) + (h === e.right?.v ? 1 : 0)
    if (m.tile.a.v === m.tile.b.v) score += 0.5
    if (strength === 'hard') for (const h of [e.left, e.right]) score -= 0.3 * (VALUES + 1 - (seen.get(h?.v ?? -1) ?? 0))
    score += rng() * 0.1
    if (score > bestScore) {
      bestScore = score
      best = m
    }
  }
  return { t: 'play', tile: best.tile.id, end: best.end }
}
