/** Graphs of the trigonometric functions: the numbers and data behind the "Graphs of Trigonometric Functions" article's widgets.
 *
 *  A graph is y = a · f(b · (x − c)) + d for one of the six functions f, with the argument b(x − c) in degrees and x in whatever unit the
 *  reader's picture uses (degrees for an angle, months or hours for a measurement). Everything a hand sketch needs comes from here:
 *
 *   - `periodOf`, `rangeOf`, `asymptotes`, `zeros`, `levelSet`, `extrema` and `keyPoints` say where the interesting points of a graph are;
 *   - `curveSegments` draws it, lifting the pen at every asymptote;
 *   - `FACTS` is the table of period, symmetry, zeros, asymptotes and range of the six parent functions;
 *   - `fromExtremes` reads a sine or cosine equation off a maximum, a minimum and the x of a maximum;
 *   - `sumPeriod` and `beats` say what the sum of two sine waves does, and `fitSinusoid` fits one wave to measurements by least squares.
 *
 *  The checker (tools/check-triggraph.mjs) tests all of it against references that do not use it: mpmath and SymPy for the six functions (SymPy
 *  exactly, to decide where one is undefined), a brute-force search for the smallest period, a dense sample for the range, the asymptotes, the
 *  zeros and the extreme points, and an independent least-squares solution for the fit. */

import { cosDeg, sinDeg, tanDeg, toDeg } from './trigbasic'

export type GFn = 'sin' | 'cos' | 'tan' | 'cot' | 'sec' | 'csc'
export const GFNS: GFn[] = ['sin', 'cos', 'tan', 'csc', 'sec', 'cot']

const r9 = (x: number): number => Math.round(x * 1e9) / 1e9

/** f(u) with u in degrees; NaN where the function is undefined. */
export function fnValue(fn: GFn, u: number): number {
  switch (fn) {
    case 'sin':
      return sinDeg(u)
    case 'cos':
      return cosDeg(u)
    case 'tan':
      return tanDeg(u)
    case 'cot': {
      const s = sinDeg(u)
      return s === 0 ? NaN : cosDeg(u) / s
    }
    case 'sec': {
      const c = cosDeg(u)
      return c === 0 ? NaN : 1 / c
    }
    case 'csc': {
      const s = sinDeg(u)
      return s === 0 ? NaN : 1 / s
    }
  }
}

/** y = a · fn(b · (x − c)) + d, with a ≠ 0 and b ≠ 0. */
export interface Graph {
  fn: GFn
  a: number
  b: number
  c: number
  d: number
}
export const graphAt = (g: Graph, x: number): number => g.a * fnValue(g.fn, g.b * (x - g.c)) + g.d

/** The smallest p > 0 with f(x + p) = f(x): 360° for sine, cosine, secant and cosecant, 180° for tangent and cotangent, divided by |b|. */
export const periodOf = (g: Graph): number => (g.fn === 'tan' || g.fn === 'cot' ? 180 : 360) / Math.abs(g.b)

export type RangeInfo = { kind: 'band'; lo: number; hi: number } | { kind: 'all' } | { kind: 'outside'; lo: number; hi: number }

/** Where the graph's values lie: between d − |a| and d + |a| (sine, cosine), anywhere (tangent, cotangent), or on or beyond them (secant, cosecant). */
export function rangeOf(g: Graph): RangeInfo {
  const m = Math.abs(g.a)
  if (g.fn === 'sin' || g.fn === 'cos') return { kind: 'band', lo: g.d - m, hi: g.d + m }
  if (g.fn === 'tan' || g.fn === 'cot') return { kind: 'all' }
  return { kind: 'outside', lo: g.d - m, hi: g.d + m }
}

/** The values u (degrees, in [0, period)) with fn(u) = k, and the period of fn. */
function baseSolutions(fn: GFn, k: number): { us: number[]; period: number } {
  const norm = (u: number, p: number): number => {
    const v = r9(((u % p) + p) % p)
    return v >= p - 1e-9 ? 0 : v
  }
  const uniq = (list: number[]): number[] => {
    const out: number[] = []
    for (const v of list) if (!out.some((w) => Math.abs(w - v) < 1e-7)) out.push(v)
    return out.sort((p, q) => p - q)
  }
  const sine = (s: number): number[] => (Math.abs(s) > 1 + 1e-12 ? [] : uniq([norm(toDeg(Math.asin(Math.max(-1, Math.min(1, s)))), 360), norm(180 - toDeg(Math.asin(Math.max(-1, Math.min(1, s)))), 360)]))
  const cosine = (s: number): number[] => (Math.abs(s) > 1 + 1e-12 ? [] : uniq([norm(toDeg(Math.acos(Math.max(-1, Math.min(1, s)))), 360), norm(-toDeg(Math.acos(Math.max(-1, Math.min(1, s)))), 360)]))
  switch (fn) {
    case 'sin':
      return { us: sine(k), period: 360 }
    case 'cos':
      return { us: cosine(k), period: 360 }
    case 'tan':
      return { us: [norm(toDeg(Math.atan(k)), 180)], period: 180 }
    case 'cot':
      return { us: [k === 0 ? 90 : norm(toDeg(Math.atan(1 / k)), 180)], period: 180 }
    case 'sec':
      return { us: k === 0 ? [] : cosine(1 / k), period: 360 }
    case 'csc':
      return { us: k === 0 ? [] : sine(1 / k), period: 360 }
  }
}

/** Every x in [x0, x1) at which fn(b(x − c)) = k, in increasing order. */
function xsWhere(g: Graph, k: number, x0: number, x1: number): number[] {
  const { us, period } = baseSolutions(g.fn, k)
  // the arguments b(x − c) of the points of the interval run from uLo to uHi
  const uA = g.b * (x0 - g.c)
  const uB = g.b * (x1 - g.c)
  const uLo = Math.min(uA, uB)
  const uHi = Math.max(uA, uB)
  const out: number[] = []
  for (const u of us) {
    for (let m = Math.floor((uLo - u) / period) - 1; u + m * period <= uHi + period; m++) {
      const x = r9(g.c + (u + m * period) / g.b)
      if (x >= x0 - 1e-9 && x < x1 - 1e-9 && !out.includes(x)) out.push(x)
    }
  }
  return out.sort((p, q) => p - q)
}

/** The x in [x0, x1) where the graph is equal to `level`. */
export function levelSet(g: Graph, level: number, x0: number, x1: number): number[] {
  return xsWhere(g, (level - g.d) / g.a, x0, x1)
}

/** The x in [x0, x1) where the graph crosses the x-axis. */
export const zeros = (g: Graph, x0: number, x1: number): number[] => levelSet(g, 0, x0, x1)

/** The vertical asymptotes in [x0, x1): where the underlying function is undefined (tangent and secant at 90° + 180° n, cotangent and cosecant at 180° n). */
export function asymptotes(g: Graph, x0: number, x1: number): number[] {
  if (g.fn === 'sin' || g.fn === 'cos') return []
  const first = g.fn === 'tan' || g.fn === 'sec' ? 90 : 0
  const step = 180 / Math.abs(g.b)
  const out: number[] = []
  const start = g.c + first / g.b
  const m0 = Math.floor((x0 - start) / step) - 2
  for (let m = m0; m < m0 + 1000000; m++) {
    const x = r9(start + m * step)
    if (x >= x1 - 1e-9) break
    if (x >= x0 - 1e-9) out.push(x)
  }
  return out
}

export interface Extreme {
  x: number
  y: number
  kind: 'max' | 'min'
}

/** The local maxima and minima in [x0, x1): the peaks and troughs of a sine or cosine, and the tips of the U-shapes of a secant or cosecant. */
export function extrema(g: Graph, x0: number, x1: number): Extreme[] {
  if (g.fn === 'tan' || g.fn === 'cot') return []
  const wave = g.fn === 'sin' || g.fn === 'cos'
  const out: Extreme[] = []
  // f = 1 gives y = a + d: a peak of the wave if a > 0, the bottom of an upward U if a > 0 (and the reverse for a < 0)
  for (const x of xsWhere(g, 1, x0, x1)) out.push({ x, y: g.a + g.d, kind: wave ? (g.a > 0 ? 'max' : 'min') : g.a > 0 ? 'min' : 'max' })
  for (const x of xsWhere(g, -1, x0, x1)) out.push({ x, y: -g.a + g.d, kind: wave ? (g.a > 0 ? 'min' : 'max') : g.a > 0 ? 'max' : 'min' })
  return out.sort((p, q) => p.x - q.x)
}

export interface KeyPoint {
  x: number
  y: number
}

/** The points to plot for a quick sketch: the quarter points of a sine or cosine (zeros, peaks, troughs), the points at 0 and ±45° of a tangent, 45°, 90° and 135° of a cotangent, the tips of a secant or cosecant. */
export function keyPoints(g: Graph, x0: number, x1: number): KeyPoint[] {
  const out: KeyPoint[] = []
  const add = (u: number): void => {
    const x = r9(g.c + u / g.b)
    if (x < x0 - 1e-9 || x >= x1 - 1e-9) return
    const y = graphAt(g, x)
    if (Number.isFinite(y)) out.push({ x, y: r9(y) })
  }
  const span = Math.abs(g.b) * Math.max(Math.abs(x0 - g.c), Math.abs(x1 - g.c)) + 720
  const walk = (stepU: number, offsets: number[]): void => {
    for (let m = -Math.ceil(span / stepU) - 1; m <= Math.ceil(span / stepU) + 1; m++) for (const o of offsets) add(m * stepU + o)
  }
  switch (g.fn) {
    case 'sin':
    case 'cos':
      walk(90, [0])
      break
    case 'tan':
      walk(180, [0, 45, -45])
      break
    case 'cot':
      walk(180, [45, 90, 135])
      break
    case 'sec':
      walk(180, [0])
      break
    case 'csc':
      walk(180, [90])
      break
  }
  const seen: KeyPoint[] = []
  for (const p of out.sort((p, q) => p.x - q.x)) if (!seen.some((s) => Math.abs(s.x - p.x) < 1e-7)) seen.push(p)
  return seen
}

/** The pieces of the graph over [x0, x1] as lists of points: the pen is lifted at every asymptote and wherever |y| passes `cap`. */
export function curveSegments(g: Graph, x0: number, x1: number, n = 600, cap = Infinity): [number, number][][] {
  const poles = asymptotes(g, x0 - 1e-9, x1 + 1e-9)
  const segs: [number, number][][] = []
  let cur: [number, number][] = []
  let prevX = NaN
  const flush = (): void => {
    if (cur.length > 1) segs.push(cur)
    cur = []
  }
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n
    const y = graphAt(g, x)
    if (!Number.isFinite(y) || Math.abs(y) > cap) {
      flush()
    } else {
      if (cur.length && poles.some((p) => p > prevX && p < x)) flush()
      cur.push([x, y])
    }
    prevX = x
  }
  flush()
  return segs
}

/* ---------------------------------------------------------------------------- the six parents */

export interface SetOfAngles {
  /** the angles first + step · n, for every whole number n */
  first: number
  step: number
}
export interface Facts {
  period: number
  parity: 'even' | 'odd'
  zeros: SetOfAngles | null
  poles: SetOfAngles | null
  /** the range: all |f| ≤ 1, all |f| ≥ 1, or every real number */
  range: 'band' | 'outside' | 'all'
}
export const FACTS: Record<GFn, Facts> = {
  sin: { period: 360, parity: 'odd', zeros: { first: 0, step: 180 }, poles: null, range: 'band' },
  cos: { period: 360, parity: 'even', zeros: { first: 90, step: 180 }, poles: null, range: 'band' },
  tan: { period: 180, parity: 'odd', zeros: { first: 0, step: 180 }, poles: { first: 90, step: 180 }, range: 'all' },
  csc: { period: 360, parity: 'odd', zeros: null, poles: { first: 0, step: 180 }, range: 'outside' },
  sec: { period: 360, parity: 'even', zeros: null, poles: { first: 90, step: 180 }, range: 'outside' },
  cot: { period: 180, parity: 'odd', zeros: { first: 90, step: 180 }, poles: { first: 0, step: 180 }, range: 'all' },
}

const num = (x: number): string => String(Number(x.toFixed(6)))

/** The angles of a set as TeX, in degrees: `180^\circ n`, `90^\circ+180^\circ n`. */
export function setTex(s: SetOfAngles, unit: 'deg' | 'rad' = 'deg'): string {
  if (unit === 'rad') {
    const first = radTex(s.first)
    const step = radTex(s.step)
    return s.first === 0 ? `${step}\\,n` : `${first}+${step}\\,n`
  }
  const step = `${num(s.step)}^\\circ`
  return s.first === 0 ? `${step}\\,n` : `${num(s.first)}^\\circ+${step}\\,n`
}

/* ------------------------------------------------------------------------------ radian labels */

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

/** An angle in degrees as the fraction n/q of π in lowest terms, or null if it is not one with q up to 12. */
function piFraction(deg: number): { sign: string; n: number; q: number } | null {
  const sign = deg < 0 ? '-' : ''
  const t = Math.abs(deg) / 180
  for (let q = 1; q <= 12; q++) {
    const p = t * q
    if (Math.abs(p - Math.round(p)) < 1e-7) {
      const n = Math.round(p)
      const g = gcd(n, q)
      return { sign, n: n / g, q: q / g }
    }
  }
  return null
}

/** An angle in degrees as a multiple of π in TeX (`\frac{3\pi}{4}`), or '' if it is not a fraction of π with a denominator up to 12. */
export function radTex(deg: number): string {
  if (Math.abs(deg) < 1e-9) return '0'
  const f = piFraction(deg)
  if (!f) return ''
  const num = f.n === 1 ? '' : String(f.n)
  return f.q === 1 ? `${f.sign}${num}\\pi` : `${f.sign}\\frac{${num}\\pi}{${f.q}}`
}

/** The same in plain text for the labels of an axis: `3π/4`. */
export function radText(deg: number): string {
  if (Math.abs(deg) < 1e-9) return '0'
  const f = piFraction(deg)
  if (!f) return ''
  const num = f.n === 1 ? '' : String(f.n)
  return f.q === 1 ? `${f.sign}${num}π` : `${f.sign}${num}π/${f.q}`
}

/* ------------------------------------------------------------------------ reading a graph */

export interface Extremes {
  /** the highest and the lowest value of the wave */
  max: number
  min: number
  /** the x of one maximum, and the x of the next maximum (or of the next minimum, which is half a period later) */
  xMax: number
  xNext: number
  next: 'max' | 'min'
}

/** The equation y = a · fn(b(x − c)) + d of a wave from its highest and lowest values and the x of a maximum and of the following maximum or minimum. */
export function fromExtremes(e: Extremes, fn: 'sin' | 'cos'): Graph | null {
  const half = e.next === 'min' ? Math.abs(e.xNext - e.xMax) : Math.abs(e.xNext - e.xMax) / 2
  if (!(e.max > e.min) || !(half > 0)) return null
  const period = 2 * half
  const b = 360 / period
  // a cosine peaks where its argument is 0, a sine where it is 90°, a quarter of a period later
  const c = fn === 'cos' ? e.xMax : e.xMax - period / 4
  return { fn, a: (e.max - e.min) / 2, b, c, d: (e.max + e.min) / 2 }
}

/** y = a · fn(b·x − B) + d as y = a · fn(b(x − c)) + d: the shift is B / b. */
export const fromGeneral = (fn: GFn, a: number, b: number, bigB: number, d: number): Graph => ({ fn, a, b, c: bigB / b, d })

/* ------------------------------------------------------------------------- adding two waves */

/** The period of sin(b1·x) + sin(b2·x), in the same unit as x for b measured in degrees per unit; null if the ratio b1/b2 is not a ratio of whole numbers (to three decimals). */
export function sumPeriod(b1: number, b2: number): number | null {
  const s = 1000
  const i1 = Math.round(b1 * s)
  const i2 = Math.round(b2 * s)
  if (Math.abs(b1 * s - i1) > 1e-6 || Math.abs(b2 * s - i2) > 1e-6 || i1 <= 0 || i2 <= 0) return null
  return (360 * s) / gcd(i1, i2)
}

export interface Beats {
  /** sin(b1 x) + sin(b2 x) = 2 cos(envelope · x) sin(carrier · x) */
  carrier: number
  envelope: number
  /** the length of one swell and fade of the loudness, 360° / |b1 − b2| */
  beatPeriod: number
}
export function beats(b1: number, b2: number): Beats | null {
  if (b1 === b2) return null
  return { carrier: (b1 + b2) / 2, envelope: Math.abs(b1 - b2) / 2, beatPeriod: 360 / Math.abs(b1 - b2) }
}

/* ----------------------------------------------------------------------- fitting measurements */

export interface Fit {
  /** y = A sin(bx) + B cos(bx) + D, the three numbers found */
  A: number
  B: number
  D: number
  /** the same wave as a · sin(b(x − c)) + d, with a ≥ 0 and 0 ≤ c < period */
  graph: Graph
  r2: number
  rmse: number
}

/** The least-squares wave of a given period through points (x, y): y ≈ A sin(bx) + B cos(bx) + D with b = 360 / period, which is linear in A, B and D. */
export function fitSinusoid(pts: [number, number][], period: number): Fit | null {
  if (pts.length < 3 || !(period > 0)) return null
  const b = 360 / period
  // normal equations M · [A, B, D] = v
  const M = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
  const v = [0, 0, 0]
  for (const [x, y] of pts) {
    const row = [sinDeg(b * x), cosDeg(b * x), 1]
    for (let i = 0; i < 3; i++) {
      v[i] += row[i] * y
      for (let j = 0; j < 3; j++) M[i][j] += row[i] * row[j]
    }
  }
  // Gaussian elimination with partial pivoting
  for (let col = 0; col < 3; col++) {
    let piv = col
    for (let r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r
    if (Math.abs(M[piv][col]) < 1e-10) return null
    ;[M[col], M[piv]] = [M[piv], M[col]]
    ;[v[col], v[piv]] = [v[piv], v[col]]
    for (let r = col + 1; r < 3; r++) {
      const f = M[r][col] / M[col][col]
      for (let j = col; j < 3; j++) M[r][j] -= f * M[col][j]
      v[r] -= f * v[col]
    }
  }
  const sol = [0, 0, 0]
  for (let i = 2; i >= 0; i--) {
    let s = v[i]
    for (let j = i + 1; j < 3; j++) s -= M[i][j] * sol[j]
    sol[i] = s / M[i][i]
  }
  const [A, B, D] = sol
  const R = Math.hypot(A, B)
  const phi = toDeg(Math.atan2(B, A))
  // R sin(bx + φ) = R sin(b(x − c)) with c = −φ / b, brought into one period
  const c = R < 1e-12 ? 0 : (((-phi / b) % period) + period) % period
  const graph: Graph = { fn: 'sin', a: R, b, c, d: D }
  const mean = pts.reduce((s, p) => s + p[1], 0) / pts.length
  let ssRes = 0
  let ssTot = 0
  for (const [x, y] of pts) {
    const fit = A * sinDeg(b * x) + B * cosDeg(b * x) + D
    ssRes += (y - fit) ** 2
    ssTot += (y - mean) ** 2
  }
  const r2 = ssTot < 1e-12 ? (ssRes < 1e-12 ? 1 : 0) : 1 - ssRes / ssTot
  return { A, B, D, graph, r2, rmse: Math.sqrt(ssRes / pts.length) }
}

/** The measurements the fitting widget offers: x is the time, in the unit named, and the period is the one the physics suggests. Illustrative numbers, not real records. */
export interface Dataset {
  id: string
  xs: number[]
  ys: number[]
  period: number
}
export const DATASETS: Dataset[] = [
  { id: 'temperature', xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], ys: [4.1, 5.0, 8.6, 12.9, 17.5, 21.0, 23.4, 22.8, 19.1, 13.9, 8.2, 4.9], period: 12 },
  { id: 'daylight', xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], ys: [8.2, 9.6, 11.4, 13.4, 15.1, 16.3, 15.9, 14.4, 12.5, 10.5, 8.8, 7.9], period: 12 },
  { id: 'tide', xs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], ys: [1.9, 2.4, 2.8, 2.9, 2.7, 2.4, 1.9, 1.3, 0.9, 0.7, 0.8, 1.1, 1.6], period: 12.4 },
]
