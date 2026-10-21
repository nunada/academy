/** Indeterminate forms and l'Hôpital's Rule: the numbers behind the "Indeterminate Forms and l'Hôpital's Rule" article's widgets.
 *
 *  The checker (tools/check-lhopital.mjs) tests this against references that do not use it: limits worked out by hand and by
 *  SymPy's `limit` (a separate program), the textbook's examples and exercises, the cases where the rule does not apply or only
 *  cycles, Cauchy's Mean Value Theorem against a scan, and random limits whose values are known in closed form.
 *
 *  The behavior of a function near a point is read numerically, on a ladder of distances that shrinks fast enough to see a
 *  logarithm settle (10⁻², 10⁻⁴, … down to 10⁻⁶⁴ at 0, or 10², 10⁴, … up to 10¹⁵⁰ at infinity). The rule itself is applied
 *  exactly: the derivatives come from the chain-rule differentiator. */

import { K, derive, div, evalFloat, neg, simp, toTex, type Node } from './chain'
import { parseFunction } from './linearize'

export type Side = 'both' | 'plus' | 'minus'
export type Form = '0/0' | 'inf/inf' | 'determinate'

/** How a function behaves approaching a point from one side. */
export type Beh =
  | { kind: 'zero'; sign: 1 | -1 }
  | { kind: 'finite'; value: number; sign: 1 | -1 }
  | { kind: 'inf'; sign: 1 | -1 }
  | { kind: 'dne' }

export type Result = { kind: 'finite'; value: number } | { kind: 'inf'; sign: 1 | -1 } | { kind: 'dne' }

const FINITE_LADDER = [1e-2, 1e-4, 1e-8, 1e-16, 1e-32, 1e-64]
const NEAR_LADDER = [1e-2, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12]
const FAR_LADDER = [1e2, 1e4, 1e8, 1e16, 1e32, 1e64, 1e150]
const MID_LADDER = [10, 20, 40, 80, 160, 320, 640]

/** What f does as x → a from one side (dir = +1 from above, −1 from below); a may be ±Infinity (then dir is ignored). The
 *  readings go down a ladder whose distances shrink fast (10⁻², 10⁻⁴, 10⁻⁸, … or 10², 10⁴, 10⁸, …), so that a logarithm,
 *  which grows or settles very slowly, is seen doing so: it keeps growing with every rung, or its steps shrink by a constant factor. */
export function behaviour(f: Node, a: number, dir: 1 | -1): Beh {
  let xs: number[]
  if (!Number.isFinite(a)) xs = FAR_LADDER.map((h) => (a > 0 ? h : -h))
  else if (a === 0) xs = FINITE_LADDER.map((h) => dir * h)
  else xs = NEAR_LADDER.map((h) => a + dir * h * Math.max(1, Math.abs(a)))
  let vs = xs.map((x) => evalFloat(f, x))
  // out there a quotient of two overflowing numbers is NaN or ∞ for the wrong reason: read it again on a ladder that stops short of the overflow
  if (!Number.isFinite(a) && (vs.slice(-3).some((v) => Number.isNaN(v)) || !Number.isFinite(vs[vs.length - 1]))) vs = MID_LADDER.map((h) => evalFloat(f, a > 0 ? h : -h))
  const tail = vs.slice(-3)
  if (tail.some((v) => Number.isNaN(v))) return { kind: 'dne' }
  const last = vs[vs.length - 1]
  const prev = vs[vs.length - 2]
  const sgn = (v: number): 1 | -1 => (v < 0 ? -1 : 1)
  if (!Number.isFinite(last)) return { kind: 'inf', sign: sgn(last) }
  // growth without bound: the same sign, and larger with every one of the last rungs
  const mags = vs.slice(-4).map(Math.abs)
  const growing = mags[mags.length - 1] >= 5 && mags.every((m, k) => k === 0 || m >= 1.05 * mags[k - 1]) && vs.slice(-4).every((v) => sgn(v) === sgn(last))
  if (growing) return { kind: 'inf', sign: sgn(last) }
  // settling: the last two readings agree
  let value = last
  let settled = Math.abs(last - prev) <= 1e-6 * (1 + Math.abs(last)) || (Math.abs(last) < 1e-9 && Math.abs(prev) < 1e-6)
  if (!settled) {
    // a slow settling (a logarithm): the steps shrink by a constant factor, so Aitken's extrapolation gives the limit
    const v0 = vs[vs.length - 4]
    const v1 = vs[vs.length - 3]
    const d0 = v1 - v0
    const d1 = prev - v1
    const d2 = last - prev
    const r1 = d1 / d0
    const r = d2 / d1
    if (d0 !== 0 && d1 !== 0 && d2 !== 0 && d1 * d2 > 0 && d0 * d1 > 0 && r > 0.05 && r < 0.9 && Math.abs(r - r1) < 0.2) {
      value = last + (d2 * r) / (1 - r)
      settled = true
    }
  }
  if (!settled) return { kind: 'dne' }
  const sign = sgn(value !== 0 ? value : prev)
  if (Math.abs(value) < 1e-7) return { kind: 'zero', sign }
  return { kind: 'finite', value, sign }
}

/** Both sides of a point, or one. */
export function behaviours(f: Node, a: number, side: Side): { plus?: Beh; minus?: Beh } {
  if (!Number.isFinite(a)) return { plus: behaviour(f, a, 1) }
  return { plus: side !== 'minus' ? behaviour(f, a, 1) : undefined, minus: side !== 'plus' ? behaviour(f, a, -1) : undefined }
}

/** The form of a quotient of two behaviors on one side. */
function formOf(n: Beh, d: Beh): Form | 'dne' {
  if (n.kind === 'dne' || d.kind === 'dne') return 'dne'
  if (n.kind === 'zero' && d.kind === 'zero') return '0/0'
  if (n.kind === 'inf' && d.kind === 'inf') return 'inf/inf'
  return 'determinate'
}

/** The value of a quotient that is not indeterminate, on one side. */
function quotient(n: Beh, d: Beh): Result {
  if (n.kind === 'dne' || d.kind === 'dne') return { kind: 'dne' }
  if (d.kind === 'inf') return n.kind === 'inf' ? { kind: 'dne' } : { kind: 'finite', value: 0 }
  if (d.kind === 'zero') {
    if (n.kind === 'zero') return { kind: 'dne' }
    return { kind: 'inf', sign: ((n.sign * d.sign) as 1 | -1) }
  }
  // d is a nonzero number
  if (n.kind === 'inf') return { kind: 'inf', sign: ((n.sign * d.sign) as 1 | -1) }
  if (n.kind === 'zero') return { kind: 'finite', value: 0 }
  return { kind: 'finite', value: n.value / d.value }
}

/** Combine the results from the two sides of a point: they have to agree for the two-sided limit to exist. */
function agree(a: Result | undefined, b: Result | undefined): Result {
  if (!a) return b ?? { kind: 'dne' }
  if (!b) return a
  if (a.kind === 'finite' && b.kind === 'finite') return Math.abs(a.value - b.value) <= 1e-6 * (1 + Math.abs(a.value)) ? a : { kind: 'dne' }
  if (a.kind === 'inf' && b.kind === 'inf' && a.sign === b.sign) return a
  return { kind: 'dne' }
}

export interface RuleStep {
  num: Node
  den: Node
  tex: string
  numBeh: { plus?: Beh; minus?: Beh }
  denBeh: { plus?: Beh; minus?: Beh }
  form: Form
}

export interface Lhopital {
  ok: true
  steps: RuleStep[]
  /** done: a quotient that is no longer indeterminate was reached; cycle: the same quotient came back; inconclusive: the
   *  limit of the quotient of derivatives does not exist, so the rule says nothing; many: too many rounds */
  status: 'done' | 'cycle' | 'inconclusive' | 'many' | 'notindeterminate'
  result: Result
  /** the limit of the original quotient read directly, when the rule could not give it */
  direct: Result | null
}

export interface LhFailed {
  ok: false
  error: 'syntax' | 'big' | 'point'
}

const MAX_STEPS = 6

/** A simplified quotient as a numerator and a denominator: the top-level fraction, or the whole thing over 1. */
function splitQuotient(q: Node): { num: Node; den: Node } {
  if (q.t === 'neg' && q.a.t === 'div') return { num: neg(q.a.a), den: q.a.b }
  if (q.t === 'div') return { num: q.a, den: q.b }
  return { num: q, den: K(1) }
}

function formOfSides(nb: { plus?: Beh; minus?: Beh }, db: { plus?: Beh; minus?: Beh }): Form | 'dne' {
  const forms = [nb.plus && db.plus ? formOf(nb.plus, db.plus) : null, nb.minus && db.minus ? formOf(nb.minus, db.minus) : null].filter((x): x is Form | 'dne' => x !== null)
  if (forms.some((f) => f === 'dne')) return 'dne'
  if (forms.every((f) => f === '0/0')) return '0/0'
  if (forms.every((f) => f === 'inf/inf')) return 'inf/inf'
  return 'determinate'
}

function resultOfSides(nb: { plus?: Beh; minus?: Beh }, db: { plus?: Beh; minus?: Beh }): Result {
  const p = nb.plus && db.plus ? quotient(nb.plus, db.plus) : undefined
  const m = nb.minus && db.minus ? quotient(nb.minus, db.minus) : undefined
  return agree(p, m)
}

/** Apply l'Hôpital's Rule to lim f(x)/g(x) as x → a, differentiating as long as the quotient is 0/0 or ∞/∞. */
export function lhopital(numSrc: string, denSrc: string, a: number, side: Side = 'both'): Lhopital | LhFailed {
  const f0 = parseFunction(numSrc)
  const g0 = parseFunction(denSrc)
  if (typeof f0 === 'string' || typeof g0 === 'string') return { ok: false, error: (f0 === 'big' || g0 === 'big') ? 'big' : 'syntax' }
  if (Number.isNaN(a)) return { ok: false, error: 'point' }
  const steps: RuleStep[] = []
  const seen: string[] = []
  let f = f0
  let g = g0
  let status: Lhopital['status'] = 'many'
  let result: Result = { kind: 'dne' }
  for (let i = 0; i <= MAX_STEPS; i++) {
    const numBeh = behaviours(f, a, side)
    const denBeh = behaviours(g, a, side)
    const form = formOfSides(numBeh, denBeh)
    const tex = `\\frac{${toTex(f)}}{${toTex(g)}}`
    if (form === 'dne') {
      steps.push({ num: f, den: g, tex, numBeh, denBeh, form: 'determinate' })
      status = i === 0 ? 'notindeterminate' : 'inconclusive'
      result = { kind: 'dne' }
      break
    }
    steps.push({ num: f, den: g, tex, numBeh, denBeh, form })
    if (form === 'determinate') {
      result = resultOfSides(numBeh, denBeh)
      status = i === 0 ? 'notindeterminate' : result.kind === 'dne' ? 'inconclusive' : 'done'
      break
    }
    if (seen.includes(tex)) {
      status = 'cycle'
      break
    }
    seen.push(tex)
    if (i === MAX_STEPS) break
    // the quotient of the derivatives is simplified before it is read: common factors cancel (as in the textbook's Example 7, where
    // 1/(1 + x) comes out), and what is left is split into a numerator and a denominator again
    const q = simp(div(derive(f).result, derive(g).result))
    const s = splitQuotient(q)
    f = s.num
    g = s.den
  }
  // the quotient of derivatives has no limit, or the rule cycles: read the original quotient directly
  let direct: Result | null = null
  if (status === 'cycle' || status === 'many' || status === 'inconclusive') {
    const q = parseFunction(`(${numSrc})/(${denSrc})`)
    if (typeof q !== 'string') {
      const b = behaviours(q, a, side)
      const toResult = (v: Beh | undefined): Result | undefined => (!v ? undefined : v.kind === 'dne' ? { kind: 'dne' } : v.kind === 'inf' ? { kind: 'inf', sign: v.sign } : { kind: 'finite', value: v.kind === 'zero' ? 0 : v.value })
      direct = agree(toResult(b.plus), toResult(b.minus))
    }
  }
  if (status === 'notindeterminate' && steps.length === 1) result = resultOfSides(steps[0].numBeh, steps[0].denBeh)
  return { ok: true, steps, status, result, direct }
}

/* -------------------------------------------------------------------- indeterminate powers */

export interface PowerLimit {
  ok: true
  /** the form: 1^∞, 0^0, ∞^0, or one that is not indeterminate */
  form: '1^inf' | '0^0' | 'inf^0' | 'determinate'
  /** the limit of g·ln f, by l'Hôpital's Rule on ln f / (1/g) */
  log: Lhopital | null
  result: Result
}

/** lim f(x)^g(x): take the logarithm, find the limit L of g ln f by the rule, and exponentiate. */
export function powerLimit(fSrc: string, gSrc: string, a: number, side: Side = 'both'): PowerLimit | LhFailed {
  const f = parseFunction(fSrc)
  const g = parseFunction(gSrc)
  if (typeof f === 'string' || typeof g === 'string') return { ok: false, error: f === 'big' || g === 'big' ? 'big' : 'syntax' }
  const fb = behaviours(f, a, side)
  const gb = behaviours(g, a, side)
  const one = (b: Beh | undefined) => !b || (b.kind === 'finite' && Math.abs(b.value - 1) < 1e-6)
  const zero = (b: Beh | undefined) => !b || b.kind === 'zero'
  const inf = (b: Beh | undefined) => !b || b.kind === 'inf'
  const all = (p: (b: Beh | undefined) => boolean, x: { plus?: Beh; minus?: Beh }) => p(x.plus) && p(x.minus) && (x.plus !== undefined || x.minus !== undefined)
  let form: PowerLimit['form'] = 'determinate'
  if (all(one, fb) && all(inf, gb)) form = '1^inf'
  else if (all(zero, fb) && all(zero, gb)) form = '0^0'
  else if (all(inf, fb) && all(zero, gb)) form = 'inf^0'
  if (form === 'determinate') {
    // the form is not indeterminate: f^g = exp(g ln f) is read directly
    const q = parseFunction(`e^((${gSrc})*ln(${fSrc}))`)
    if (typeof q === 'string') return { ok: false, error: 'syntax' }
    const b = behaviours(q, a, side)
    const r = (v: Beh | undefined): Result | undefined => (!v ? undefined : v.kind === 'dne' ? { kind: 'dne' } : v.kind === 'inf' ? { kind: 'inf', sign: v.sign } : { kind: 'finite', value: v.kind === 'zero' ? 0 : v.value })
    return { ok: true, form, log: null, result: agree(r(b.plus), r(b.minus)) }
  }
  const log = lhopital(`ln(${fSrc})`, `1/(${gSrc})`, a, side)
  if (!log.ok) return log
  let result: Result = { kind: 'dne' }
  if (log.status === 'done') {
    const L = log.result
    if (L.kind === 'finite') result = { kind: 'finite', value: Math.exp(L.value) }
    else if (L.kind === 'inf') result = L.sign > 0 ? { kind: 'inf', sign: 1 } : { kind: 'finite', value: 0 }
  } else if (log.direct) {
    const L = log.direct
    if (L.kind === 'finite') result = { kind: 'finite', value: Math.exp(L.value) }
  }
  return { ok: true, form, log, result }
}

/* ----------------------------------------------------------------- Cauchy's Mean Value Theorem */

export interface Cauchy {
  ok: true
  fa: number
  fb: number
  ga: number
  gb: number
  /** (f(b) − f(a)) / (g(b) − g(a)), the slope of the secant of the curve (g(t), f(t)) */
  slope: number
  /** every c in (a, b) with f′(c)/g′(c) equal to it */
  points: number[]
  /** g′ is nonzero throughout (a, b), the hypothesis that makes g(a) ≠ g(b) */
  gPrimeNonzero: boolean
}

/** Cauchy's Mean Value Theorem for f and g on [a, b]: the points c where f′(c)/g′(c) equals the secant slope. */
export function cauchy(fSrc: string, gSrc: string, a: number, b: number): Cauchy | LhFailed {
  const f = parseFunction(fSrc)
  const g = parseFunction(gSrc)
  if (typeof f === 'string' || typeof g === 'string') return { ok: false, error: f === 'big' || g === 'big' ? 'big' : 'syntax' }
  if (!(a < b) || !Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'point' }
  const fa = evalFloat(f, a)
  const fb = evalFloat(f, b)
  const ga = evalFloat(g, a)
  const gb = evalFloat(g, b)
  if (![fa, fb, ga, gb].every(Number.isFinite)) return { ok: false, error: 'point' }
  const df = derive(f).result
  const dg = derive(g).result
  const slope = (fb - fa) / (gb - ga)
  const N = 4000
  let gPrimeNonzero = true
  for (let i = 1; i < N; i++) {
    const v = evalFloat(dg, a + ((b - a) * i) / N)
    if (!Number.isFinite(v) || Math.abs(v) < 1e-12) gPrimeNonzero = false
  }
  // F(c) = f′(c) − slope g′(c) is zero where f′/g′ equals the slope
  const F = (x: number) => evalFloat(df, x) - slope * evalFloat(dg, x)
  const points: number[] = []
  let prev = Math.sign(F(a + (b - a) / (2 * N)))
  for (let i = 1; i < N; i++) {
    const x1 = a + ((b - a) * (i + 0.5)) / N
    const s = Math.sign(F(x1))
    if (s !== 0 && prev !== 0 && s !== prev) {
      let lo = a + ((b - a) * (i - 0.5)) / N
      let hi = x1
      let flo = F(lo)
      for (let k = 0; k < 100; k++) {
        const mid = (lo + hi) / 2
        const fm = F(mid)
        if (!Number.isFinite(fm)) break
        if (fm * flo > 0) {
          lo = mid
          flo = fm
        } else hi = mid
      }
      const c = (lo + hi) / 2
      if (Math.abs(F(c)) < 1e-6 * (1 + Math.abs(slope))) points.push(c)
    }
    if (s !== 0) prev = s
  }
  return { ok: true, fa, fb, ga, gb, slope, points, gPrimeNonzero }
}

/* ------------------------------------------------------------------- the textbook's cases */

export interface LimitCase {
  id: string
  /** the limit as it is written, in TeX */
  tex: string
  num: string
  den: string
  a: number
  side: Side
  note: { en: string; id: string }
}

const INF = Infinity

export const LIMIT_CASES: LimitCase[] = [
  { id: 'ex1a', tex: '\\lim_{x\\to0}\\dfrac{3x-\\sin x}{x}', num: '3*x-sin(x)', den: 'x', a: 0, side: 'both', note: { en: 'One use of the rule: the quotient of derivatives is 2.', id: 'Satu kali memakai aturan: hasil bagi turunannya 2.' } },
  { id: 'ex1b', tex: '\\lim_{x\\to0}\\dfrac{\\sqrt{1+x}-1}{x}', num: 'sqrt(1+x)-1', den: 'x', a: 0, side: 'both', note: { en: 'After one step the quotient is 1/(2√(1+x)) → 1/2.', id: 'Setelah satu langkah hasil baginya 1/(2√(1+x)) → 1/2.' } },
  { id: 'ex1c', tex: '\\lim_{x\\to0}\\dfrac{\\sqrt{1+x}-1-\\frac x2}{x^2}', num: 'sqrt(1+x)-1-x/2', den: 'x^2', a: 0, side: 'both', note: { en: 'Still 0/0 after one step, so the rule is applied again: −1/8.', id: 'Setelah satu langkah masih 0/0, sehingga aturan diterapkan lagi: −1/8.' } },
  { id: 'ex1d', tex: '\\lim_{x\\to0}\\dfrac{x-\\sin x}{x^3}', num: 'x-sin(x)', den: 'x^3', a: 0, side: 'both', note: { en: 'Three rounds: 0/0, 0/0, 0/0, and then 1/6.', id: 'Tiga putaran: 0/0, 0/0, 0/0, lalu 1/6.' } },
  { id: 'ex2', tex: '\\lim_{x\\to0}\\dfrac{1-\\cos x}{x+x^2}', num: '1-cos(x)', den: 'x+x^2', a: 0, side: 'both', note: { en: 'After one step the quotient sin x/(1 + 2x) → 0/1 is not indeterminate: stop. The answer is 0, not 1/2.', id: 'Setelah satu langkah hasil baginya sin x/(1 + 2x) → 0/1 tidak tak tentu: berhenti. Jawabannya 0, bukan 1/2.' } },
  { id: 'ex3a', tex: '\\lim_{x\\to0^+}\\dfrac{\\sin x}{x^2}', num: 'sin(x)', den: 'x^2', a: 0, side: 'plus', note: { en: 'From the right the quotient cos x/(2x) → +∞.', id: 'Dari kanan hasil baginya cos x/(2x) → +∞.' } },
  { id: 'ex3b', tex: '\\lim_{x\\to0^-}\\dfrac{\\sin x}{x^2}', num: 'sin(x)', den: 'x^2', a: 0, side: 'minus', note: { en: 'From the left it is −∞: the one-sided limits differ, so the two-sided limit does not exist.', id: 'Dari kiri hasilnya −∞: limit satu sisinya berbeda, sehingga limit dua sisinya tidak ada.' } },
  { id: 'ex4a', tex: '\\lim_{x\\to0^+}\\dfrac{\\ln x}{\\ln\\sin x}', num: 'ln(x)', den: 'ln(sin(x))', a: 0, side: 'plus', note: { en: 'An ∞/∞ form at a finite point: the quotient of derivatives sin x/(x cos x) is a 0/0, and one more round gives 1.', id: 'Bentuk ∞/∞ di titik terhingga: hasil bagi turunan sin x/(x cos x) berbentuk 0/0, dan satu putaran lagi memberi 1.' } },
  { id: 'ex4b', tex: '\\lim_{x\\to\\infty}\\dfrac{\\ln x}{2\\sqrt x}', num: 'ln(x)', den: '2*sqrt(x)', a: INF, side: 'both', note: { en: '(1/x)/(1/√x) = 1/√x → 0: a logarithm grows more slowly than a root.', id: '(1/x)/(1/√x) = 1/√x → 0: logaritma tumbuh lebih lambat daripada akar.' } },
  { id: 'ex4c', tex: '\\lim_{x\\to\\infty}\\dfrac{e^x}{x^2}', num: 'e^x', den: 'x^2', a: INF, side: 'both', note: { en: 'Twice: e^x/(2x), then e^x/2 → ∞: an exponential beats any power.', id: 'Dua kali: e^x/(2x), lalu e^x/2 → ∞: eksponensial mengalahkan pangkat apa pun.' } },
  { id: 'poly', tex: '\\lim_{x\\to\\infty}\\dfrac{5x^2-3x}{7x^2+1}', num: '5*x^2-3*x', den: '7*x^2+1', a: INF, side: 'both', note: { en: 'Twice, to 10/14 = 5/7, the leading coefficients.', id: 'Dua kali, menjadi 10/14 = 5/7, koefisien utamanya.' } },
  { id: 'ex5a', tex: '\\lim_{x\\to\\infty}\\dfrac{\\sin(1/x)}{1/x}', num: 'sin(1/x)', den: '1/x', a: INF, side: 'both', note: { en: 'The form of x sin(1/x), an ∞·0, rewritten as 0/0.', id: 'Bentuk x sin(1/x), yaitu ∞·0, ditulis ulang sebagai 0/0.' } },
  { id: 'ex5b', tex: '\\lim_{x\\to0^+}\\dfrac{\\ln x}{1/x}', num: 'ln(x)', den: '1/x', a: 0, side: 'plus', note: { en: 'The form of x ln x, a 0·∞, rewritten as ∞/∞: (1/x)/(−1/x²) = −x → 0.', id: 'Bentuk x ln x, yaitu 0·∞, ditulis ulang sebagai ∞/∞: (1/x)/(−1/x²) = −x → 0.' } },
  { id: 'ex6', tex: '\\lim_{x\\to0}\\dfrac{\\sin x-x}{x\\sin x}', num: 'sin(x)-x', den: 'x*sin(x)', a: 0, side: 'both', note: { en: 'The form of 1/x − 1/sin x, an ∞ − ∞, combined into one fraction: 0/0 twice, then 0.', id: 'Bentuk 1/x − 1/sin x, yaitu ∞ − ∞, digabung menjadi satu pecahan: 0/0 dua kali, lalu 0.' } },
  { id: 'ln-slope', tex: '\\lim_{x\\to0}\\dfrac{\\ln(1+x)}{x}', num: 'ln(1+x)', den: 'x', a: 0, side: 'both', note: { en: '1/(1 + x) → 1: the derivative of ln at 1.', id: '1/(1 + x) → 1: turunan ln di 1.' } },
  { id: 'cycle', tex: '\\lim_{x\\to\\infty}\\dfrac{\\sqrt{9x+1}}{\\sqrt x+1}', num: 'sqrt(9*x+1)', den: 'sqrt(x)+1', a: INF, side: 'both', note: { en: 'Differentiating just cycles through the same kind of quotient. Divide by √x instead: the limit is 3.', id: 'Menurunkan hanya berputar melalui jenis hasil bagi yang sama. Bagilah dengan √x: limitnya 3.' } },
  { id: 'inconclusive', tex: '\\lim_{x\\to\\infty}\\dfrac{x+\\sin x}{x}', num: 'x+sin(x)', den: 'x', a: INF, side: 'both', note: { en: 'The quotient of derivatives 1 + cos x has no limit, so the rule says nothing. Split it: 1 + sin x/x → 1.', id: 'Hasil bagi turunan 1 + cos x tidak punya limit, sehingga aturan tidak menyatakan apa pun. Pisahkan: 1 + sin x/x → 1.' } },
]

export interface FormCase {
  id: string
  kind: { en: string; id: string }
  tex: string
  /** a quotient to run, or a power f^g */
  num?: string
  den?: string
  pow?: { f: string; g: string }
  a: number
  side: Side
  note: { en: string; id: string }
}

export const FORM_CASES: FormCase[] = [
  { id: 'x-ln-x', kind: { en: '0 · ∞', id: '0 · ∞' }, tex: '\\lim_{x\\to0^+}x\\ln x', num: 'ln(x)', den: '1/x', a: 0, side: 'plus', note: { en: 'Write x ln x as ln x / (1/x).', id: 'Tulis x ln x sebagai ln x / (1/x).' } },
  { id: 'x-sin', kind: { en: '∞ · 0', id: '∞ · 0' }, tex: '\\lim_{x\\to\\infty}x\\sin\\frac1x', num: 'sin(1/x)', den: '1/x', a: INF, side: 'both', note: { en: 'Write x sin(1/x) as sin(1/x) / (1/x).', id: 'Tulis x sin(1/x) sebagai sin(1/x) / (1/x).' } },
  { id: 'difference', kind: { en: '∞ − ∞', id: '∞ − ∞' }, tex: '\\lim_{x\\to0}\\left(\\frac1x-\\frac1{\\sin x}\\right)', num: 'sin(x)-x', den: 'x*sin(x)', a: 0, side: 'both', note: { en: 'Combine into one fraction: (sin x − x)/(x sin x).', id: 'Gabungkan menjadi satu pecahan: (sin x − x)/(x sin x).' } },
  { id: 'difference-log', kind: { en: '∞ − ∞', id: '∞ − ∞' }, tex: '\\lim_{x\\to1^+}\\left(\\frac1{\\ln x}-\\frac1{x-1}\\right)', num: 'x-1-ln(x)', den: 'ln(x)*(x-1)', a: 1, side: 'plus', note: { en: 'Combine: (x − 1 − ln x)/((x − 1) ln x), then the rule twice.', id: 'Gabungkan: (x − 1 − ln x)/((x − 1) ln x), lalu aturan dua kali.' } },
  { id: 'one-inf', kind: { en: '1^∞', id: '1^∞' }, tex: '\\lim_{x\\to0^+}(1+x)^{1/x}', pow: { f: '1+x', g: '1/x' }, a: 0, side: 'plus', note: { en: 'ln f = ln(1 + x)/x → 1, so the limit is e.', id: 'ln f = ln(1 + x)/x → 1, sehingga limitnya e.' } },
  { id: 'one-inf-far', kind: { en: '1^∞', id: '1^∞' }, tex: '\\lim_{x\\to\\infty}\\left(1+\\frac1x\\right)^x', pow: { f: '1+1/x', g: 'x' }, a: INF, side: 'both', note: { en: 'The limit that defines e.', id: 'Limit yang mendefinisikan e.' } },
  { id: 'inf-zero', kind: { en: '∞⁰', id: '∞⁰' }, tex: '\\lim_{x\\to\\infty}x^{1/x}', pow: { f: 'x', g: '1/x' }, a: INF, side: 'both', note: { en: 'ln f = (ln x)/x → 0, so the limit is e⁰ = 1.', id: 'ln f = (ln x)/x → 0, sehingga limitnya e⁰ = 1.' } },
  { id: 'zero-zero', kind: { en: '0⁰', id: '0⁰' }, tex: '\\lim_{x\\to0^+}x^x', pow: { f: 'x', g: 'x' }, a: 0, side: 'plus', note: { en: 'ln f = x ln x → 0, so the limit is 1.', id: 'ln f = x ln x → 0, sehingga limitnya 1.' } },
  { id: 'zero-zero-sin', kind: { en: '0⁰', id: '0⁰' }, tex: '\\lim_{x\\to0^+}(\\sin x)^x', pow: { f: 'sin(x)', g: 'x' }, a: 0, side: 'plus', note: { en: 'x ln sin x → 0, so the limit is 1.', id: 'x ln sin x → 0, sehingga limitnya 1.' } },
  { id: 'one-inf-slope', kind: { en: '1^∞', id: '1^∞' }, tex: '\\lim_{x\\to1^+}x^{1/(x-1)}', pow: { f: 'x', g: '1/(x-1)' }, a: 1, side: 'plus', note: { en: 'ln x/(x − 1) → 1, so the limit is e.', id: 'ln x/(x − 1) → 1, sehingga limitnya e.' } },
]
