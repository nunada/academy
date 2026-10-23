/** Basic trigonometry: the numbers behind the "Basic Trigonometry" article's widgets (not the derivatives of `lib/trig.ts`).
 *
 *  Angles are in degrees throughout, because that is what a reader types and what a school problem gives. The functions `sinDeg`, `cosDeg`
 *  and `tanDeg` reduce the angle to a reference angle of 0° to 90° first, so that the values the reader expects come out exactly
 *  (cos 90° is 0, not 6e-17, sin 30° is 0.5, not 0.49999999999999994, and tan 90° is undefined, not 1.6e16).
 *
 *  The checker (tools/check-trigbasic.mjs) tests this against references that do not use it: Python's math module and SymPy's exact values for every
 *  whole degree, the coordinates of right triangles measured with atan2, a scan for the roots of the equations, a sampled graph for the extreme
 *  values and zeros of a wave, and SymPy's simplifier for every identity (and a counterexample for every false one). */

export const toRad = (deg: number): number => (deg * Math.PI) / 180
export const toDeg = (rad: number): number => (rad * 180) / Math.PI

/** The same direction as an angle in [0, 360). */
export const normalize = (deg: number): number => ((deg % 360) + 360) % 360

/* ----------------------------------------------------------------------- the functions of an angle */

/** The reference angle (0° to 90°) and the sign of the sine for an angle already in [0, 360). */
function foldSine(n: number): { ref: number; sign: 1 | -1 } {
  if (n <= 90) return { ref: n, sign: 1 }
  if (n <= 180) return { ref: 180 - n, sign: 1 }
  if (n <= 270) return { ref: n - 180, sign: -1 }
  return { ref: 360 - n, sign: -1 }
}

/** sin of an angle from 0° to 90°, with the well-known values exact. */
function sineOfAcute(ref: number): number {
  if (ref === 0) return 0
  if (ref === 30) return 0.5
  if (ref === 45) return Math.SQRT1_2
  if (ref === 60) return Math.sqrt(3) / 2
  if (ref === 90) return 1
  return Math.sin(toRad(ref))
}

export function sinDeg(deg: number): number {
  const { ref, sign } = foldSine(normalize(deg))
  const v = sineOfAcute(ref)
  return v === 0 ? 0 : sign * v
}
export const cosDeg = (deg: number): number => sinDeg(90 - deg)

/** tan of an angle; NaN where it is undefined (90°, 270°, …). */
export function tanDeg(deg: number): number {
  const n = normalize(deg)
  if (n % 180 === 90) return NaN
  const c = cosDeg(n)
  const s = sinDeg(n)
  return s === 0 ? 0 : s / c
}

export interface SixValues {
  sin: number
  cos: number
  tan: number
  csc: number
  sec: number
  cot: number
}
/** The six functions of an angle; NaN where a function is undefined. */
export function sixValues(deg: number): SixValues {
  const s = sinDeg(deg)
  const c = cosDeg(deg)
  return { sin: s, cos: c, tan: tanDeg(deg), csc: s === 0 ? NaN : 1 / s, sec: c === 0 ? NaN : 1 / c, cot: s === 0 ? NaN : c / s }
}

/* ------------------------------------------------------------------------------ the unit circle */

export interface CircleInfo {
  /** the angle brought into [0, 360) */
  deg: number
  /** 1 to 4, or 0 when the angle lies on an axis */
  quadrant: 0 | 1 | 2 | 3 | 4
  /** the acute angle (0° to 90°) the terminal side makes with the x-axis */
  ref: number
  /** −1, 0 or 1; 0 where the value is 0, NaN for tan where it is undefined */
  sinSign: number
  cosSign: number
  tanSign: number
}

export function circleInfo(deg: number): CircleInfo {
  const n = normalize(deg)
  const quadrant = n % 90 === 0 ? 0 : n < 90 ? 1 : n < 180 ? 2 : n < 270 ? 3 : 4
  const ref = n <= 90 ? n : n <= 180 ? 180 - n : n <= 270 ? n - 180 : 360 - n
  const s = Math.sign(sinDeg(n))
  const c = Math.sign(cosDeg(n))
  return { deg: n, quadrant, ref, sinSign: s, cosSign: c, tanSign: n % 180 === 90 ? NaN : s * c }
}

/* ---------------------------------------------------------------------------------- exact values */

/** (one + r2·√2 + r3·√3 + r6·√6) / den, times sign. Every sin, cos and tan of a multiple of 15° is of this form. */
export interface ExactValue {
  sign: 1 | -1
  den: number
  one: number
  r2: number
  r3: number
  r6: number
}
const S = (den: number, one: number, r2: number, r3: number, r6: number): ExactValue => ({ sign: 1, den, one, r2, r3, r6 })

/** Reference angles 0°, 15°, …, 90°; null stands for "undefined". */
const SIN_TABLE: ExactValue[] = [S(1, 0, 0, 0, 0), S(4, 0, -1, 0, 1), S(2, 1, 0, 0, 0), S(2, 0, 1, 0, 0), S(2, 0, 0, 1, 0), S(4, 0, 1, 0, 1), S(1, 1, 0, 0, 0)]
const COS_TABLE: ExactValue[] = [...SIN_TABLE].reverse()
const TAN_TABLE: (ExactValue | null)[] = [S(1, 0, 0, 0, 0), S(1, 2, 0, -1, 0), S(3, 0, 0, 1, 0), S(1, 1, 0, 0, 0), S(1, 0, 0, 1, 0), S(1, 2, 0, 1, 0), null]

/** The exact value of sin, cos or tan of a whole multiple of 15°; 'undefined' where tan has none; null for any other angle. */
export function exactValue(fn: 'sin' | 'cos' | 'tan', deg: number): ExactValue | 'undefined' | null {
  if (!Number.isInteger(deg) || normalize(deg) % 15 !== 0) return null
  const info = circleInfo(deg)
  const k = info.ref / 15
  const neg = (e: ExactValue, sign: number): ExactValue => (sign < 0 && !(e.one === 0 && e.r2 === 0 && e.r3 === 0 && e.r6 === 0) ? { ...e, sign: -1 } : e)
  if (fn === 'sin') return neg(SIN_TABLE[k], info.sinSign)
  if (fn === 'cos') return neg(COS_TABLE[k], info.cosSign)
  const t = TAN_TABLE[k]
  if (t === null || info.tanSign !== info.tanSign) return 'undefined'
  return neg(t, info.tanSign)
}

/** The number an exact value stands for, from the square roots alone. */
export const exactNumber = (e: ExactValue): number => (e.sign * (e.one + e.r2 * Math.SQRT2 + e.r3 * Math.sqrt(3) + e.r6 * Math.sqrt(6))) / e.den

/** An exact value as TeX: `\frac{\sqrt6-\sqrt2}{4}`, `-\frac{\sqrt3}{2}`, `2+\sqrt3`, `0`. */
export function exactTex(e: ExactValue): string {
  const parts: [number, string][] = [
    [e.one, ''],
    [e.r6, '\\sqrt6'],
    [e.r3, '\\sqrt3'],
    [e.r2, '\\sqrt2'],
  ]
  // positive terms first, so that it reads \sqrt6-\sqrt2 and not -\sqrt2+\sqrt6
  parts.sort((p, q) => Number(q[0] > 0) - Number(p[0] > 0))
  let top = ''
  for (const [c, root] of parts) {
    if (c === 0) continue
    const mag = Math.abs(c)
    const body = root === '' ? String(mag) : mag === 1 ? root : `${mag}${root}`
    top += top === '' ? (c < 0 ? `-${body}` : body) : c < 0 ? `-${body}` : `+${body}`
  }
  if (top === '') return '0'
  const sign = e.sign < 0 ? '-' : ''
  // a minus in front of a sum needs brackets: -(2+\sqrt3), not -2+\sqrt3
  if (e.den === 1) return sign && /[+-]/.test(top.slice(1)) ? `-(${top})` : `${sign}${top}`
  return `${sign}\\frac{${top}}{${e.den}}`
}

/* ----------------------------------------------------------------------------- the right triangle */

export type RightGiven =
  | { kind: 'angleHyp'; angle: number; hyp: number }
  | { kind: 'angleOpp'; angle: number; opp: number }
  | { kind: 'angleAdj'; angle: number; adj: number }
  | { kind: 'oppHyp'; opp: number; hyp: number }
  | { kind: 'adjHyp'; adj: number; hyp: number }
  | { kind: 'oppAdj'; opp: number; adj: number }

/** A right triangle seen from its acute angle A: `opp` is the side opposite A, `adj` the leg next to A, `hyp` the longest side, and B = 90° − A. */
export interface RightTriangle {
  A: number
  B: number
  opp: number
  adj: number
  hyp: number
}

const acute = (x: number): boolean => Number.isFinite(x) && x > 0 && x < 90
const positive = (x: number): boolean => Number.isFinite(x) && x > 0

/** Solve a right triangle from an acute angle and a side, or from two sides; null when the numbers cannot make one. */
export function solveRight(g: RightGiven): RightTriangle | null {
  let A: number
  let opp: number
  let adj: number
  let hyp: number
  switch (g.kind) {
    case 'angleHyp':
      if (!acute(g.angle) || !positive(g.hyp)) return null
      A = g.angle
      hyp = g.hyp
      opp = hyp * sinDeg(A)
      adj = hyp * cosDeg(A)
      break
    case 'angleOpp':
      if (!acute(g.angle) || !positive(g.opp)) return null
      A = g.angle
      opp = g.opp
      hyp = opp / sinDeg(A)
      adj = opp / tanDeg(A)
      break
    case 'angleAdj':
      if (!acute(g.angle) || !positive(g.adj)) return null
      A = g.angle
      adj = g.adj
      hyp = adj / cosDeg(A)
      opp = adj * tanDeg(A)
      break
    case 'oppHyp':
      if (!positive(g.opp) || !positive(g.hyp) || g.opp >= g.hyp) return null
      opp = g.opp
      hyp = g.hyp
      adj = Math.sqrt((hyp - opp) * (hyp + opp))
      A = toDeg(Math.atan2(opp, adj))
      break
    case 'adjHyp':
      if (!positive(g.adj) || !positive(g.hyp) || g.adj >= g.hyp) return null
      adj = g.adj
      hyp = g.hyp
      opp = Math.sqrt((hyp - adj) * (hyp + adj))
      A = toDeg(Math.atan2(opp, adj))
      break
    default:
      if (!positive(g.opp) || !positive(g.adj)) return null
      opp = g.opp
      adj = g.adj
      hyp = Math.hypot(opp, adj)
      A = toDeg(Math.atan2(opp, adj))
  }
  return { A, B: 90 - A, opp, adj, hyp }
}

/** The six ratios of the angle A of a right triangle, each as a ratio of two sides. */
export function ratiosOf(t: RightTriangle): SixValues {
  return { sin: t.opp / t.hyp, cos: t.adj / t.hyp, tan: t.opp / t.adj, csc: t.hyp / t.opp, sec: t.hyp / t.adj, cot: t.adj / t.opp }
}

/** The same triangle seen from the other acute angle: the opposite and adjacent sides swap. */
export const otherAngle = (t: RightTriangle): RightTriangle => ({ A: t.B, B: t.A, opp: t.adj, adj: t.opp, hyp: t.hyp })

/* -------------------------------------------------------------------------- the basic equations */

export type BasicFn = 'sin' | 'cos' | 'tan'

/** All the angles x in [0°, 360°) with sin x = c, cos x = c or tan x = c, in increasing order, to nine decimals. */
export function solveBasic(fn: BasicFn, c: number): number[] {
  if (!Number.isFinite(c)) return []
  let raw: number[]
  if (fn === 'sin') {
    if (Math.abs(c) > 1) return []
    const x = toDeg(Math.asin(c))
    raw = [x, 180 - x]
  } else if (fn === 'cos') {
    if (Math.abs(c) > 1) return []
    const x = toDeg(Math.acos(c))
    raw = [x, -x]
  } else {
    const x = toDeg(Math.atan(c))
    raw = [x, x + 180]
  }
  const out: number[] = []
  for (const r of raw) {
    let n = Math.round(normalize(r) * 1e9) / 1e9
    if (n >= 360) n = 0
    if (!out.includes(n)) out.push(n)
  }
  return out.sort((a, b) => a - b)
}

/* --------------------------------------------------------------------------------- waves */

/** y = a · fn(b · (x − c)) + d with x in degrees, b > 0 and a ≠ 0 (a negative a is a reflection). */
export interface Wave {
  fn: 'sin' | 'cos'
  a: number
  b: number
  c: number
  d: number
}
export const waveAt = (w: Wave, x: number): number => w.a * (w.fn === 'sin' ? sinDeg : cosDeg)(w.b * (x - w.c)) + w.d

export interface WaveInfo {
  amplitude: number
  period: number
  phaseShift: number
  midline: number
  max: number
  min: number
}
export function waveInfo(w: Wave): WaveInfo {
  const amplitude = Math.abs(w.a)
  return { amplitude, period: 360 / w.b, phaseShift: w.c, midline: w.d, max: w.d + amplitude, min: w.d - amplitude }
}

/** The x in [x0, x1] where the wave takes the value `level`, in increasing order. */
export function waveLevel(w: Wave, level: number, x0: number, x1: number): number[] {
  const k = (level - w.d) / w.a
  if (Math.abs(k) > 1 + 1e-12) return []
  const kk = Math.max(-1, Math.min(1, k))
  // the angles u = b(x − c) with fn(u) = k, within one turn
  const base = w.fn === 'sin' ? [toDeg(Math.asin(kk)), 180 - toDeg(Math.asin(kk))] : [toDeg(Math.acos(kk)), -toDeg(Math.acos(kk))]
  const out: number[] = []
  const turn = 360 / w.b
  for (const u of base) {
    const first = w.c + u / w.b
    // every x = first + m · turn inside [x0, x1]
    const m0 = Math.ceil((x0 - first) / turn - 1e-9)
    for (let m = m0; first + m * turn <= x1 + 1e-9; m++) {
      const x = Math.round((first + m * turn) * 1e9) / 1e9
      if (!out.includes(x)) out.push(x)
    }
  }
  return out.sort((p, q) => p - q)
}

/* ------------------------------------------------------------------------------- identities */

export interface Identity {
  id: string
  /** the two sides, as TeX */
  lhs: string
  rhs: string
  /** true when it holds for every angle where both sides are defined */
  holds: boolean
  /** which angles it uses */
  uses: 'x' | 'xy'
  /** the two sides evaluated at x (and y); NaN where a side is undefined */
  eval: (x: number, y: number) => [number, number]
}

const sq = (v: number): number => v * v
const div = (p: number, q: number): number => (q === 0 ? NaN : p / q)

export const IDENTITIES: Identity[] = [
  { id: 'pythagorean', lhs: '\\sin^2 x+\\cos^2 x', rhs: '1', holds: true, uses: 'x', eval: (x) => [sq(sinDeg(x)) + sq(cosDeg(x)), 1] },
  { id: 'tangent', lhs: '\\tan x', rhs: '\\frac{\\sin x}{\\cos x}', holds: true, uses: 'x', eval: (x) => [tanDeg(x), div(sinDeg(x), cosDeg(x))] },
  { id: 'cofunction', lhs: '\\sin(90^\\circ-x)', rhs: '\\cos x', holds: true, uses: 'x', eval: (x) => [sinDeg(90 - x), cosDeg(x)] },
  { id: 'supplement', lhs: '\\sin(180^\\circ-x)', rhs: '\\sin x', holds: true, uses: 'x', eval: (x) => [sinDeg(180 - x), sinDeg(x)] },
  { id: 'negative-sine', lhs: '\\sin(-x)', rhs: '-\\sin x', holds: true, uses: 'x', eval: (x) => [sinDeg(-x), -sinDeg(x)] },
  { id: 'negative-cosine', lhs: '\\cos(-x)', rhs: '\\cos x', holds: true, uses: 'x', eval: (x) => [cosDeg(-x), cosDeg(x)] },
  { id: 'double-sine', lhs: '\\sin 2x', rhs: '2\\sin x\\cos x', holds: true, uses: 'x', eval: (x) => [sinDeg(2 * x), 2 * sinDeg(x) * cosDeg(x)] },
  { id: 'double-cosine', lhs: '\\cos 2x', rhs: '\\cos^2 x-\\sin^2 x', holds: true, uses: 'x', eval: (x) => [cosDeg(2 * x), sq(cosDeg(x)) - sq(sinDeg(x))] },
  { id: 'sum-sine', lhs: '\\sin(x+y)', rhs: '\\sin x\\cos y+\\cos x\\sin y', holds: true, uses: 'xy', eval: (x, y) => [sinDeg(x + y), sinDeg(x) * cosDeg(y) + cosDeg(x) * sinDeg(y)] },
  { id: 'sum-cosine', lhs: '\\cos(x+y)', rhs: '\\cos x\\cos y-\\sin x\\sin y', holds: true, uses: 'xy', eval: (x, y) => [cosDeg(x + y), cosDeg(x) * cosDeg(y) - sinDeg(x) * sinDeg(y)] },
  { id: 'secant', lhs: '1+\\tan^2 x', rhs: '\\frac{1}{\\cos^2 x}', holds: true, uses: 'x', eval: (x) => [1 + sq(tanDeg(x)), div(1, sq(cosDeg(x)))] },
  // the tempting ones that are false
  { id: 'wrong-sum-sine', lhs: '\\sin(x+y)', rhs: '\\sin x+\\sin y', holds: false, uses: 'xy', eval: (x, y) => [sinDeg(x + y), sinDeg(x) + sinDeg(y)] },
  { id: 'wrong-double-sine', lhs: '\\sin 2x', rhs: '2\\sin x', holds: false, uses: 'x', eval: (x) => [sinDeg(2 * x), 2 * sinDeg(x)] },
  { id: 'wrong-pythagorean', lhs: '\\sin x+\\cos x', rhs: '1', holds: false, uses: 'x', eval: (x) => [sinDeg(x) + cosDeg(x), 1] },
  { id: 'wrong-double-cosine', lhs: '\\cos 2x', rhs: '2\\cos x', holds: false, uses: 'x', eval: (x) => [cosDeg(2 * x), 2 * cosDeg(x)] },
  { id: 'wrong-sum-tangent', lhs: '\\tan(x+y)', rhs: '\\tan x+\\tan y', holds: false, uses: 'xy', eval: (x, y) => [tanDeg(x + y), tanDeg(x) + tanDeg(y)] },
  { id: 'wrong-half', lhs: '\\sin\\frac{x}{2}', rhs: '\\frac{\\sin x}{2}', holds: false, uses: 'x', eval: (x) => [sinDeg(x / 2), sinDeg(x) / 2] },
]

/** Both sides agree at (x, y): equal to 1e-12, or both undefined. */
export function agrees(id: Identity, x: number, y: number): boolean {
  const [l, r] = id.eval(x, y)
  if (Number.isNaN(l) && Number.isNaN(r)) return true
  if (Number.isNaN(l) || Number.isNaN(r)) return false
  return Math.abs(l - r) <= 1e-12 * Math.max(1, Math.abs(l), Math.abs(r))
}

/** The whole degrees x in [0°, 360°) at which the two sides agree (for a two-angle identity, with y fixed). */
export function agreeingAngles(id: Identity, y = 25): number[] {
  const out: number[] = []
  for (let x = 0; x < 360; x++) if (agrees(id, x, y)) out.push(x)
  return out
}
