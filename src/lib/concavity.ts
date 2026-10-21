/** Concavity, inflection points, the Second Derivative Test and curve sketching: the numbers behind the "Concavity and
 *  Curve Sketching" article's widgets.
 *
 *  The checker (tools/check-concavity.mjs) tests this against references that do not use it: the textbook's examples worked
 *  out by hand, random polynomials against the exact roots of their second derivative, the cases of the inflection definition
 *  (x⁴ has f″ = 0 and no inflection, x^(5/3) and ∛x have one where f″ does not exist, x^(2/3) has a cusp and none), the Second
 *  Derivative Test against the First, and the curve-sketching steps on the five graphed examples. */

import { derive, evalFloat, X, type Node } from './chain'
import { parseFunction } from './linearize'
import { criticalPoints, extrema } from './extrema'
import { monotone, verdictOf, type Mono, type Trend, type Verdict } from './monotone'

export type ConcError = 'syntax' | 'big' | 'interval' | 'undefined' | 'discontinuous'

/** Which way a graph bends: up (f″ > 0, like a cup), down (f″ < 0, like a cap), or not at all (f″ = 0 throughout). */
export type Bend = 'up' | 'down' | 'flat'

/** What the graph does at a point as seen by a tangent line. */
export type TangentKind = 'smooth' | 'vertical' | 'cusp' | 'corner'

export interface BendPiece {
  lo: number
  hi: number
  bend: Bend
  at: number
  value: number
}

export interface Inflect {
  x: number
  y: number
  /** f″ is zero there, or does not exist */
  kind: 'zero' | 'undefined'
  left: Bend
  right: Bend
  /** is there a tangent line at the point: smooth, or vertical, and not a corner or a cusp */
  tangent: TangentKind
  /** the concavity changes and there is a tangent line: a point of inflection as the textbook defines it */
  inflection: boolean
}

export interface BendRun {
  lo: number
  hi: number
  bend: Bend
}

export interface Concavity {
  ok: true
  f: Node
  df: Node
  d2f: Node
  a: number
  b: number
  pieces: BendPiece[]
  /** every point where f″ is zero or does not exist, and what happens there */
  points: Inflect[]
  runs: BendRun[]
}

export interface ConcFailed {
  ok: false
  error: ConcError
}

const SAMPLES = 9

function bendOn(d2: Node, lo: number, hi: number): { bend: Bend; at: number; value: number } {
  const vs: { x: number; v: number }[] = []
  for (let k = 0; k < SAMPLES; k++) {
    const x = lo + ((hi - lo) * (k + 0.5)) / SAMPLES
    const v = evalFloat(d2, x)
    if (Number.isFinite(v)) vs.push({ x, v })
  }
  if (!vs.length) return { bend: 'flat', at: (lo + hi) / 2, value: NaN }
  const scale = 1 + Math.max(...vs.map((p) => Math.abs(p.v)))
  const tol = 1e-9 * scale
  const pos = vs.filter((p) => p.v > tol).length
  const neg = vs.filter((p) => p.v < -tol).length
  const mid = vs[Math.floor(vs.length / 2)]
  if (pos === 0 && neg === 0) return { bend: 'flat', at: mid.x, value: mid.v }
  const bend: Bend = pos >= neg ? 'up' : 'down'
  const pick = vs.find((p) => (bend === 'up' ? p.v > tol : p.v < -tol)) ?? mid
  return { bend, at: pick.x, value: pick.v }
}

/** Does the graph have a tangent line at c? The slope is read at shrinking distances to each side: if it settles on one number
 *  from both sides the point is smooth, if it settles on two different numbers it is a corner, and if it grows without bound
 *  on both sides it is a vertical tangent (the same sign) or a cusp (opposite signs). */
export function tangentAt(df: Node, c: number, scale = 1): TangentKind {
  const hs = [1e-3, 1e-5, 1e-7, 1e-9].map((h) => h * scale)
  const left = hs.map((h) => evalFloat(df, c - h))
  const right = hs.map((h) => evalFloat(df, c + h))
  const last = hs.length - 1
  const grows = (v: number[]) => !Number.isFinite(v[last]) || (Number.isFinite(v[0]) && Math.abs(v[last]) > 10 * (1 + Math.abs(v[0])) && Math.abs(v[last]) > 20)
  const gl = grows(left)
  const gr = grows(right)
  if (gl && gr) {
    const sgn = (v: number[]) => Math.sign(Number.isFinite(v[last]) ? v[last] : v[last - 1])
    return sgn(left) === sgn(right) ? 'vertical' : 'cusp'
  }
  if (gl || gr) return 'corner'
  const l = left[last]
  const r = right[last]
  return Math.abs(l - r) <= 1e-3 * (1 + Math.abs(l) + Math.abs(r)) ? 'smooth' : 'corner'
}

/** How the graph of f bends on [a, b], where it changes, and where those places are points of inflection. */
export function concavity(src: string, a: number, b: number): Concavity | ConcFailed {
  const f = parseFunction(src)
  if (typeof f === 'string') return { ok: false, error: f === 'big' ? 'big' : 'syntax' }
  if (!(a < b) || !Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'interval' }
  const e = extrema(src, a, b)
  const df = derive(f).result
  const d2f = derive(df).result
  const flatOnly = (): Concavity => ({ ok: true, f, df, d2f, a, b, pieces: [{ lo: a, hi: b, bend: 'flat', at: (a + b) / 2, value: 0 }], points: [], runs: [{ lo: a, hi: b, bend: 'flat' }] })
  if (!e.ok) {
    if (e.error === 'constant') return flatOnly()
    return { ok: false, error: e.error === 'undefined' ? 'undefined' : e.error === 'discontinuous' ? 'discontinuous' : e.error === 'big' ? 'big' : e.error === 'syntax' ? 'syntax' : 'interval' }
  }
  // a function whose second derivative is zero everywhere (a line) has no places to look at
  let zeroEverywhere = true
  for (let k = 0; k < 41; k++) {
    const v = evalFloat(d2f, a + ((b - a) * (k + 0.5)) / 41)
    if (!(v === 0)) zeroEverywhere = false
  }
  if (zeroEverywhere) return flatOnly()
  const pts = criticalPoints(f, d2f, a, b)
  const xs = [a, ...pts.map((p) => p.x), b]
  const pieces: BendPiece[] = []
  for (let i = 0; i + 1 < xs.length; i++) pieces.push({ lo: xs[i], hi: xs[i + 1], ...bendOn(d2f, xs[i], xs[i + 1]) })
  const points: Inflect[] = pts.map((p, i) => {
    const left = pieces[i].bend
    const right = pieces[i + 1].bend
    const tangent = tangentAt(df, p.x, b - a)
    return { x: p.x, y: evalFloat(f, p.x), kind: p.kind, left, right, tangent, inflection: left !== right && left !== 'flat' && right !== 'flat' && (tangent === 'smooth' || tangent === 'vertical') }
  })
  const runs: BendRun[] = []
  for (const p of pieces) {
    const last = runs[runs.length - 1]
    if (last && last.bend === p.bend) last.hi = p.hi
    else runs.push({ lo: p.lo, hi: p.hi, bend: p.bend })
  }
  return { ok: true, f, df, d2f, a, b, pieces, points, runs }
}

/* ------------------------------------------------------- the Second Derivative Test */

export type SecondVerdict = 'min' | 'max' | 'fails' | 'notcritical'

export interface SecondTest {
  ok: true
  c: number
  fc: number
  slope: number
  /** f″(c), or NaN when it does not exist there */
  curvature: number
  /** what the Second Derivative Test says */
  second: SecondVerdict
  /** what the First Derivative Test says, from the sign of f′ on each side */
  first: Verdict
  left: Trend
  right: Trend
}

/** The two tests at a point c of f, which should be a critical point. */
export function secondTest(src: string, c: number, radius = 0.5): SecondTest | ConcFailed {
  const f = parseFunction(src)
  if (typeof f === 'string') return { ok: false, error: f === 'big' ? 'big' : 'syntax' }
  if (!Number.isFinite(c)) return { ok: false, error: 'interval' }
  const fc = evalFloat(f, c)
  if (!Number.isFinite(fc)) return { ok: false, error: 'undefined' }
  const df = derive(f).result
  const d2f = derive(df).result
  const slope = evalFloat(df, c)
  const curvature = evalFloat(d2f, c)
  const critical = Number.isFinite(slope) ? Math.abs(slope) <= 1e-9 * (1 + Math.abs(fc)) : true
  let second: SecondVerdict
  if (!critical) second = 'notcritical'
  else if (!Number.isFinite(slope) || !Number.isFinite(curvature) || Math.abs(curvature) <= 1e-9) second = 'fails'
  else second = curvature > 0 ? 'min' : 'max'
  // the First Derivative Test: the pieces of the window around c, read from the one that has c as a critical point
  const m = monotone(src, c - radius, c + radius)
  let first: Verdict = 'none'
  let left: Trend = 'flat'
  let right: Trend = 'flat'
  if (m.ok) {
    const at = m.crit.find((k) => Math.abs(k.x - c) < 1e-5 * (1 + radius))
    if (at) {
      first = at.verdict
      left = at.left
      right = at.right
    } else {
      // c is not in the list of critical points: the sign does not change there
      const p = m.pieces.find((q) => c > q.lo && c < q.hi)
      left = right = p ? p.trend : 'flat'
      first = verdictOf(left, right)
    }
  }
  return { ok: true, c, fc, slope, curvature, second, first, left, right }
}

/* ------------------------------------------------------------------------ curve sketching */

export interface Asym {
  kind: 'horizontal' | 'oblique' | 'none'
  /** y = m x + b */
  m: number
  b: number
}

export interface Branch {
  lo: number
  hi: number
  mono: Mono
  conc: Concavity
}

export interface Sketch {
  ok: true
  f: Node
  a: number
  b: number
  symmetry: 'even' | 'odd' | 'none'
  /** places inside [a, b] where f is not defined or blows up, found to a few decimals */
  breaks: { x: number; vertical: boolean }[]
  branches: Branch[]
  yIntercept: number | null
  xIntercepts: number[]
  left: Asym
  right: Asym
}

const N = 2001

function symmetryOf(f: Node, span: number): 'even' | 'odd' | 'none' {
  let even = 0
  let odd = 0
  let total = 0
  for (let k = 1; k <= 40; k++) {
    const x = (span * k) / 41
    const p = evalFloat(f, x)
    const q = evalFloat(f, -x)
    if (!Number.isFinite(p) || !Number.isFinite(q)) continue
    total++
    const tol = 1e-9 * (1 + Math.abs(p) + Math.abs(q))
    if (Math.abs(p - q) <= tol) even++
    if (Math.abs(p + q) <= tol) odd++
  }
  if (total < 10) return 'none'
  if (even === total) return 'even'
  if (odd === total) return 'odd'
  return 'none'
}

/** The line that the graph approaches as x → +∞ (sign = 1) or −∞ (sign = −1), if there is one. */
export function asymptoteAt(f: Node, sign: 1 | -1): Asym {
  const none: Asym = { kind: 'none', m: NaN, b: NaN }
  const X1 = sign * 1e5
  const X2 = sign * 2e5
  const X3 = sign * 4e5
  const [y1, y2, y3] = [X1, X2, X3].map((x) => evalFloat(f, x))
  if (![y1, y2, y3].every(Number.isFinite)) return none
  const m = (y3 - y1) / (X3 - X1)
  const m2 = (y2 - y1) / (X2 - X1)
  if (Math.abs(m - m2) > 1e-5 * (1 + Math.abs(m))) return none
  const b = y3 - m * X3
  // the line has to fit the middle point too, and the intercept must not drift
  if (Math.abs(y2 - (m * X2 + b)) > 1e-4 * (1 + Math.abs(b))) return none
  if (Math.abs(m) < 1e-7) return { kind: 'horizontal', m: 0, b: y3 }
  // snap a slope that is a simple number, so that the intercept is not polluted by the slope's last digits
  const snapped = Math.round(m * 1e4) / 1e4
  const mm = Math.abs(m - snapped) < 1e-10 ? snapped : m
  return { kind: 'oblique', m: mm, b: y3 - mm * X3 }
}

/** The graph of f over [a, b] through the textbook's steps: symmetry, breaks, critical points and where f rises and falls,
 *  inflection points and concavity, asymptotes and intercepts. A function with a pole is cut at the pole and each branch is
 *  studied on its own. */
export function sketch(src: string, a: number, b: number): Sketch | ConcFailed {
  const f = parseFunction(src)
  if (typeof f === 'string') return { ok: false, error: f === 'big' ? 'big' : 'syntax' }
  if (!(a < b) || !Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'interval' }
  const len = b - a
  // breaks: a stretch of the grid where f is not a number or is enormous, a sign flip that is a pole or a jump and not a zero, or a
  // sharp peak of |f| that grows without bound when it is searched
  const vals: number[] = []
  for (let i = 0; i <= N; i++) vals.push(evalFloat(f, a + (len * i) / N))
  const finiteVals = vals.filter((v) => Number.isFinite(v)).map(Math.abs).sort((p, q) => p - q)
  const median = finiteVals.length ? finiteVals[Math.floor(finiteVals.length / 2)] : 0
  const big = 1e5 * (1 + median)
  const bad = vals.map((v) => !Number.isFinite(v) || Math.abs(v) > big)
  const breaks: { x: number; vertical: boolean }[] = []
  // a break found by searching (a flip, a peak) is more exact than the edge of a stretch of the grid: it replaces a close one
  const addBreak = (x: number, vertical: boolean, exact = false) => {
    const near = breaks.findIndex((k) => Math.abs(k.x - x) < 1e-2 * len)
    if (near < 0) breaks.push({ x, vertical })
    else if (exact) breaks[near] = { x, vertical: vertical || breaks[near].vertical }
  }
  let i = 0
  while (i <= N) {
    if (!bad[i]) {
      i++
      continue
    }
    let j = i
    while (j + 1 <= N && bad[j + 1]) j++
    // the break sits where the stretch begins or ends, whichever is next to a finite value
    const x = i === 0 ? a + (len * j) / N : j === N ? a + (len * i) / N : a + (len * (i + j)) / (2 * N)
    addBreak(x, vals.slice(i, j + 1).some((v) => !Number.isFinite(v) || Math.abs(v) > big))
    i = j + 1
  }
  for (let k = 0; k < N; k++) {
    const p = vals[k]
    const q = vals[k + 1]
    if (!Number.isFinite(p) || !Number.isFinite(q) || !(p * q < 0)) continue
    // a sign flip is a zero if f goes to 0 where it flips, and a pole or a jump if it does not
    let lo = a + (len * k) / N
    let hi = a + (len * (k + 1)) / N
    let flo = p
    let hitsNaN = false
    for (let t = 0; t < 60; t++) {
      const mid = (lo + hi) / 2
      const fm = evalFloat(f, mid)
      if (!Number.isFinite(fm)) {
        // the search landed on the point where f is not a number: that is the break
        lo = hi = mid
        hitsNaN = true
        break
      }
      if (fm * flo > 0) {
        lo = mid
        flo = fm
      } else hi = mid
    }
    const at = hitsNaN ? Infinity : Math.max(Math.abs(evalFloat(f, lo)), Math.abs(evalFloat(f, hi)))
    if (!(at < 1e-6 * (1 + median))) addBreak((lo + hi) / 2, !(at < 1e3 * (1 + median)), true)
  }
  for (let k = 1; k < N; k++) {
    const m = Math.abs(vals[k])
    const nb = Math.max(Math.abs(vals[k - 1]), Math.abs(vals[k + 1]))
    if (!Number.isFinite(m) || !Number.isFinite(nb) || !(m >= 2 * nb) || !(m > 50 * (1 + median))) continue
    // search the peak: a pole keeps growing, a sharp but smooth peak levels off
    let lo = a + (len * (k - 1)) / N
    let hi = a + (len * (k + 1)) / N
    const phi = (Math.sqrt(5) - 1) / 2
    for (let t = 0; t < 100; t++) {
      const c1 = hi - phi * (hi - lo)
      const c2 = lo + phi * (hi - lo)
      const v1 = Math.abs(evalFloat(f, c1))
      const v2 = Math.abs(evalFloat(f, c2))
      if (!Number.isFinite(v1) || v1 > v2) hi = c2
      else lo = c1
    }
    const top = Math.abs(evalFloat(f, (lo + hi) / 2))
    if (!Number.isFinite(top) || top > 1e8) addBreak((lo + hi) / 2, true, true)
  }
  breaks.sort((p, q) => p.x - q.x)
  // each branch is studied between the breaks, kept away from them until f is a moderate number
  const edges = [a, ...breaks.map((k) => k.x), b]
  const branches: Branch[] = []
  for (let k = 0; k + 1 < edges.length; k++) {
    let lo = edges[k]
    let hi = edges[k + 1]
    if (k > 0) {
      let eps = 1e-3 * len
      for (let t = 0; t < 40 && !(Number.isFinite(evalFloat(f, lo + eps)) && Math.abs(evalFloat(f, lo + eps)) < 1e4); t++) eps *= 1.5
      lo += eps
    }
    if (k + 2 < edges.length) {
      let eps = 1e-3 * len
      for (let t = 0; t < 40 && !(Number.isFinite(evalFloat(f, hi - eps)) && Math.abs(evalFloat(f, hi - eps)) < 1e4); t++) eps *= 1.5
      hi -= eps
    }
    if (!(hi - lo > 1e-6 * len)) continue
    const mono = monotone(src, lo, hi)
    const conc = concavity(src, lo, hi)
    if (mono.ok && conc.ok) branches.push({ lo, hi, mono, conc })
  }
  if (!branches.length) return { ok: false, error: 'undefined' }
  // intercepts
  const y0 = a <= 0 && 0 <= b ? evalFloat(f, 0) : NaN
  const xInt: number[] = []
  for (const br of branches) {
    for (const z of criticalPoints(X, f, br.lo, br.hi)) {
      if (z.kind !== 'zero') continue
      const v = evalFloat(f, z.x)
      if (Number.isFinite(v) && Math.abs(v) < 1e-6 * (1 + Math.abs(br.mono.absMax?.value ?? 0)) && !xInt.some((q) => Math.abs(q - z.x) < 1e-6 * len)) xInt.push(z.x)
    }
  }
  xInt.sort((p, q) => p - q)
  return {
    ok: true,
    f,
    a,
    b,
    symmetry: symmetryOf(f, Math.min(Math.abs(a), Math.abs(b), len / 2) || len / 2),
    breaks,
    branches,
    yIntercept: Number.isFinite(y0) ? y0 : null,
    xIntercepts: xInt,
    left: asymptoteAt(f, -1),
    right: asymptoteAt(f, 1),
  }
}

/* --------------------------------------------------------------------------- cases */

export interface InflectionCase {
  id: string
  src: string
  tex: string
  c: number
  a: number
  b: number
  /** is there a point of inflection at c */
  inflection: boolean
  note: { en: string; id: string }
}

export const INFLECTION_CASES: InflectionCase[] = [
  { id: 'cubic', src: 'x^3-3*x^2+2', tex: 'y=x^3-3x^2+2', c: 1, a: -1, b: 3, inflection: true, note: { en: 'f″ = 6x − 6 is zero at 1 and changes sign there: an inflection point at (1, 0).', id: 'f″ = 6x − 6 nol di 1 dan berganti tanda di sana: titik belok di (1, 0).' } },
  { id: 'fifth-thirds', src: 'x^(5/3)', tex: 'y=x^{5/3}', c: 0, a: -2, b: 2, inflection: true, note: { en: 'f″ = (10/9)x^(−1/3) does not exist at 0, but it changes sign there and the tangent at the origin is horizontal: an inflection point.', id: 'f″ = (10/9)x^(−1/3) tidak ada di 0, tetapi berganti tanda di sana dan garis singgung di titik asal mendatar: titik belok.' } },
  { id: 'cube-root', src: 'x^(1/3)', tex: 'y=\\sqrt[3]{x}', c: 0, a: -2, b: 2, inflection: true, note: { en: 'f′ and f″ do not exist at 0 (a vertical tangent), and f″ changes sign: an inflection point at a vertical tangent.', id: 'f′ dan f″ tidak ada di 0 (garis singgung tegak), dan f″ berganti tanda: titik belok pada garis singgung tegak.' } },
  { id: 'quartic', src: 'x^4', tex: 'y=x^4', c: 0, a: -2, b: 2, inflection: false, note: { en: 'f″ = 12x² is zero at 0 but never changes sign: concave up everywhere, so no inflection point.', id: 'f″ = 12x² nol di 0 tetapi tidak pernah berganti tanda: cekung ke atas di mana-mana, sehingga bukan titik belok.' } },
  { id: 'two-thirds', src: 'x^(2/3)', tex: 'y=x^{2/3}', c: 0, a: -2, b: 2, inflection: false, note: { en: 'f″ does not exist at 0 and is negative on both sides: concave down, and a cusp there, so no inflection point.', id: 'f″ tidak ada di 0 dan negatif di kedua sisi: cekung ke bawah, dan ada titik puncak di sana, sehingga bukan titik belok.' } },
  { id: 'sine', src: '3+sin(x)', tex: 'y=3+\\sin x', c: Math.PI, a: 0, b: 2 * Math.PI, inflection: true, note: { en: 'f″ = −sin x is negative on (0, π) and positive on (π, 2π): the concavity changes at (π, 3).', id: 'f″ = −sin x negatif pada (0, π) dan positif pada (π, 2π): kecekungan berubah di (π, 3).' } },
  { id: 'corner', src: 'x*abs(x)', tex: 'y=x|x|', c: 0, a: -2, b: 2, inflection: true, note: { en: 'f′ = 2|x| exists at 0 although f″ does not, and f″ = 2·sign x changes sign: an inflection point.', id: 'f′ = 2|x| ada di 0 walaupun f″ tidak, dan f″ = 2·sign x berganti tanda: titik belok.' } },
]

export interface SecondCase {
  id: string
  src: string
  tex: string
  c: number
  note: { en: string; id: string }
}

export const SECOND_CASES: SecondCase[] = [
  { id: 'min', src: 'x^2', tex: 'y=x^2', c: 0, note: { en: 'f′(0) = 0 and f″(0) = 2 > 0: a local minimum, found with one derivative value.', id: 'f′(0) = 0 dan f″(0) = 2 > 0: minimum lokal, ditemukan dengan satu nilai turunan.' } },
  { id: 'max', src: '-x^2', tex: 'y=-x^2', c: 0, note: { en: 'f′(0) = 0 and f″(0) = −2 < 0: a local maximum.', id: 'f′(0) = 0 dan f″(0) = −2 < 0: maksimum lokal.' } },
  { id: 'quartic-min', src: 'x^4', tex: 'y=x^4', c: 0, note: { en: 'f″(0) = 0, so the Second Derivative Test fails, yet there is a local minimum: the First Derivative Test decides.', id: 'f″(0) = 0, sehingga Uji Turunan Kedua gagal, padahal ada minimum lokal: Uji Turunan Pertama yang memutuskan.' } },
  { id: 'quartic-max', src: '-x^4', tex: 'y=-x^4', c: 0, note: { en: 'f″(0) = 0: the test fails, and there is a local maximum.', id: 'f″(0) = 0: ujinya gagal, dan ada maksimum lokal.' } },
  { id: 'cubic', src: 'x^3', tex: 'y=x^3', c: 0, note: { en: 'f″(0) = 0: the test fails, and there is no extreme value (f is increasing).', id: 'f″(0) = 0: ujinya gagal, dan tidak ada nilai ekstrem (f naik).' } },
  { id: 'cusp', src: 'x^(2/3)', tex: 'y=x^{2/3}', c: 0, note: { en: 'f′ and f″ do not exist at 0: the Second Derivative Test cannot even start, and the First Derivative Test finds a local minimum.', id: 'f′ dan f″ tidak ada di 0: Uji Turunan Kedua bahkan tidak dapat dimulai, dan Uji Turunan Pertama menemukan minimum lokal.' } },
  { id: 'sine-max', src: 'sin(x)', tex: 'y=\\sin x,\\ x=\\frac\\pi2', c: Math.PI / 2, note: { en: 'f′(π/2) = 0 and f″(π/2) = −1 < 0: a local maximum.', id: 'f′(π/2) = 0 dan f″(π/2) = −1 < 0: maksimum lokal.' } },
  { id: 'sine-min', src: 'sin(x)', tex: 'y=\\sin x,\\ x=\\frac{3\\pi}2', c: (3 * Math.PI) / 2, note: { en: 'f′(3π/2) = 0 and f″(3π/2) = 1 > 0: a local minimum.', id: 'f′(3π/2) = 0 dan f″(3π/2) = 1 > 0: minimum lokal.' } },
]

export interface SketchPreset {
  src: string
  a: number
  b: number
}

/** The five graphed examples of the textbook (Examples 8 to 12). */
export const SKETCH_PRESETS: SketchPreset[] = [
  { src: 'x^4-4*x^3+10', a: -2, b: 4.5 },
  { src: '(x+1)^2/(1+x^2)', a: -8, b: 8 },
  { src: '(x^2+4)/(2*x)', a: -8, b: 8 },
  { src: 'e^(2/x)', a: -6, b: 6 },
  { src: 'cos(x)-sqrt(2)*x/2', a: 0, b: 2 * Math.PI },
]
