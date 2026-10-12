/** Numbers and drawings for the "Derivatives of Trigonometric Functions" article's widgets.
 *
 *  The checker (tools/check-trig.mjs) tests every formula here without ever calling Math.sin or Math.cos as its
 *  reference: it sums the Taylor series of sine and cosine in exact fractions, and from those exact values it builds
 *  the difference quotients (sin(x + h) − sin x) / h and checks, with rigorous error bounds, that they sit where the
 *  derivative formulas say they must. */

import { rat, type Rat } from './realnum'
import { ratAdd, ratDiv, ratMul, ratSub } from './rationals'

export { rat, type Rat }

export type TrigId = 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'csc'

export interface TrigDef {
  id: TrigId
  tex: string
  dtex: string
  f: (x: number) => number
  d: (x: number) => number
  /** Where the function is not defined (a pole), as a test on x. */
  pole?: (x: number) => boolean
  xr: [number, number]
  fy: [number, number]
  dy: [number, number]
  note: { en: string; id: string }
}

const nearMultiple = (x: number, offset: number, eps = 0.012): boolean => {
  const k = (x - offset) / Math.PI
  return Math.abs(k - Math.round(k)) * Math.PI < eps
}

export const TRIGS: TrigDef[] = [
  {
    id: 'sin',
    tex: '\\sin x',
    dtex: '\\frac{d}{dx}\\sin x=\\cos x',
    f: Math.sin,
    d: Math.cos,
    xr: [-6.5, 6.5],
    fy: [-1.6, 1.6],
    dy: [-1.6, 1.6],
    note: { en: 'The slope of the sine wave is largest (1) where it crosses the axis going up, zero at every peak and valley, and −1 where it crosses going down: that is the cosine wave.', id: 'Gradien gelombang sinus terbesar (1) di tempat ia memotong sumbu sambil naik, nol di setiap puncak dan lembah, dan −1 di tempat ia memotong sambil turun: itulah gelombang kosinus.' },
  },
  {
    id: 'cos',
    tex: '\\cos x',
    dtex: '\\frac{d}{dx}\\cos x=-\\sin x',
    f: Math.cos,
    d: (x) => -Math.sin(x),
    xr: [-6.5, 6.5],
    fy: [-1.6, 1.6],
    dy: [-1.6, 1.6],
    note: { en: 'The cosine starts at its peak, so its slope there is 0; it then falls, so the slope turns negative: the derivative is the negative of the sine wave.', id: 'Kosinus mulai dari puncaknya, sehingga gradiennya di sana 0; lalu ia turun, sehingga gradiennya menjadi negatif: turunannya adalah negatif gelombang sinus.' },
  },
  {
    id: 'tan',
    tex: '\\tan x',
    dtex: '\\frac{d}{dx}\\tan x=\\sec^2 x',
    f: Math.tan,
    d: (x) => 1 / Math.cos(x) ** 2,
    pole: (x) => nearMultiple(x, Math.PI / 2),
    xr: [-4.6, 4.6],
    fy: [-6, 6],
    dy: [-1, 13],
    note: { en: 'The slope sec² x is never below 1: the tangent function always rises, is flattest at the origin (slope 1) and gets steeper without bound as it nears each vertical asymptote.', id: 'Gradien sec² x tidak pernah di bawah 1: fungsi tangen selalu naik, paling landai di titik asal (gradien 1), dan makin curam tanpa batas saat mendekati tiap asimtot tegak.' },
  },
  {
    id: 'cot',
    tex: '\\cot x',
    dtex: '\\frac{d}{dx}\\cot x=-\\csc^2 x',
    f: (x) => 1 / Math.tan(x),
    d: (x) => -1 / Math.sin(x) ** 2,
    pole: (x) => nearMultiple(x, 0),
    xr: [-4.6, 4.6],
    fy: [-6, 6],
    dy: [-13, 1],
    note: { en: 'The slope −csc² x is never above −1: the cotangent always falls, the mirror image of the tangent.', id: 'Gradien −csc² x tidak pernah di atas −1: kotangen selalu turun, bayangan cermin tangen.' },
  },
  {
    id: 'sec',
    tex: '\\sec x',
    dtex: '\\frac{d}{dx}\\sec x=\\sec x\\tan x',
    f: (x) => 1 / Math.cos(x),
    d: (x) => Math.sin(x) / Math.cos(x) ** 2,
    pole: (x) => nearMultiple(x, Math.PI / 2),
    xr: [-4.6, 4.6],
    fy: [-6, 6],
    dy: [-10, 10],
    note: { en: 'The slope sec x tan x is zero at every multiple of π, where the secant has its bottoms and tops (±1), and it is positive on the right of each valley and negative on the left.', id: 'Gradien sec x tan x nol di setiap kelipatan π, tempat sekan memiliki dasar dan puncaknya (±1), dan ia positif di kanan tiap lembah dan negatif di kiri.' },
  },
  {
    id: 'csc',
    tex: '\\csc x',
    dtex: '\\frac{d}{dx}\\csc x=-\\csc x\\cot x',
    f: (x) => 1 / Math.sin(x),
    d: (x) => -Math.cos(x) / Math.sin(x) ** 2,
    pole: (x) => nearMultiple(x, 0),
    xr: [-4.6, 4.6],
    fy: [-6, 6],
    dy: [-10, 10],
    note: { en: 'The slope −csc x cot x is zero where the cosecant is at ±1, at odd multiples of π/2, and the sign is the opposite of the secant’s: cofunctions get a minus sign.', id: 'Gradien −csc x cot x nol di tempat kosekan bernilai ±1, pada kelipatan ganjil π/2, dan tandanya berlawanan dengan sekan: kofungsi mendapat tanda minus.' },
  },
]

/* ------------------------------------------------------------------ the two limits */

/** sin(h)/h with h in radians. */
export const sinOverH = (h: number): number => Math.sin(h) / h
/** (cos(h) − 1)/h with h in radians. */
export const cosMinusOneOverH = (h: number): number => (Math.cos(h) - 1) / h
/** sin(h°)/h with h in degrees: tends to π/180, not to 1. */
export const sinDegOverH = (h: number): number => Math.sin((h * Math.PI) / 180) / h
export const cosDegMinusOneOverH = (h: number): number => (Math.cos((h * Math.PI) / 180) - 1) / h

/* ------------------------------------------------------------ simple harmonic motion */

/** A weight on a spring pulled down A units and let go: s = A cos t. */
export function spring(A: number, t: number): { s: number; v: number; a: number; j: number } {
  return { s: A * Math.cos(t), v: -A * Math.sin(t), a: -A * Math.cos(t), j: A * Math.sin(t) }
}

/* ------------------------------------------------------------- exact series values */

const fact = (n: number): bigint => {
  let r = 1n
  for (let i = 2; i <= n; i++) r *= BigInt(i)
  return r
}

/** sin x as the Taylor series summed in exact fractions, `terms` terms; the error is below |x|^(2·terms + 1) / (2·terms + 1)!. */
export function sinRat(x: Rat, terms = 30): Rat {
  let sum = rat(0n, 1n)
  let pow = x
  const x2 = ratMul(x, x)
  for (let k = 0; k < terms; k++) {
    const term = ratDiv(pow, rat(fact(2 * k + 1), 1n))
    sum = k % 2 === 0 ? ratAdd(sum, term) : ratSub(sum, term)
    pow = ratMul(pow, x2)
  }
  return sum
}

/** cos x the same way. */
export function cosRat(x: Rat, terms = 30): Rat {
  let sum = rat(0n, 1n)
  let pow = rat(1n, 1n)
  const x2 = ratMul(x, x)
  for (let k = 0; k < terms; k++) {
    const term = ratDiv(pow, rat(fact(2 * k), 1n))
    sum = k % 2 === 0 ? ratAdd(sum, term) : ratSub(sum, term)
    pow = ratMul(pow, x2)
  }
  return sum
}
