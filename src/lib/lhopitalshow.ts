/** Showing the answers of src/lib/lhopital.ts: a limit value as TeX, and the cases where the rule gives nothing. */

import { LIMIT_CASES, type LimitCase, type Side } from './lhopital'

/** A limit value as TeX: an integer, a fraction with a small denominator, e to a simple power, a multiple of π, a square root, or a decimal. */
export function niceTex(x: number): string {
  if (!Number.isFinite(x)) return x > 0 ? '\\infty' : '-\\infty'
  if (Math.abs(x) < 1e-9) return '0'
  const sign = x < 0 ? '-' : ''
  const v = Math.abs(x)
  const frac = (p: number, q: number) => (q === 1 ? `${p}` : `\\frac{${p}}{${q}}`)
  for (let q = 1; q <= 64; q++) {
    const p = Math.round(v * q)
    if (p > 0 && Math.abs(v - p / q) <= 1e-7 * (1 + v)) return sign + frac(p, q)
  }
  // e to a rational power: e, 1/e, e², e^(−1/2)
  const k = Math.log(v)
  if (sign === '') {
    for (let q = 1; q <= 6; q++) {
      const p = Math.round(k * q)
      if (p !== 0 && Math.abs(k - p / q) <= 1e-7 * (1 + Math.abs(k))) {
        const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b))
        const d = g(Math.abs(p), q)
        const pp = p / d
        const qq = q / d
        if (pp === 1 && qq === 1) return 'e'
        return `e^{${pp < 0 ? '-' : ''}${qq === 1 ? Math.abs(pp) : `\\frac{${Math.abs(pp)}}{${qq}}`}}`
      }
    }
  }
  // a multiple of π
  for (let q = 1; q <= 12; q++) {
    const p = Math.round((v / Math.PI) * q)
    if (p > 0 && Math.abs(v - (p * Math.PI) / q) <= 1e-7 * (1 + v)) return sign + (q === 1 ? (p === 1 ? '\\pi' : `${p}\\pi`) : `\\frac{${p === 1 ? '' : p}\\pi}{${q}}`)
  }
  // a square root of a rational
  for (let q = 1; q <= 16; q++) {
    const p = Math.round(v * v * q)
    if (p > 0 && Math.abs(v * v - p / q) <= 1e-7 * (1 + v * v)) return sign + (q === 1 ? `\\sqrt{${p}}` : `\\sqrt{\\frac{${p}}{${q}}}`)
  }
  return sign + String(Number(v.toPrecision(6)))
}

export interface FailCase {
  id: string
  tex: string
  num: string
  den: string
  a: number
  side: Side
  note: { en: string; id: string }
}

const byId = (id: string): LimitCase => LIMIT_CASES.find((c) => c.id === id) as LimitCase

/** The cases where the rule gives nothing or must not be used. */
export const FAIL_CASES: FailCase[] = [
  { id: 'determinate', tex: '\\lim_{x\\to2}\\dfrac{x^2+1}{x+1}', num: 'x^2+1', den: 'x+1', a: 2, side: 'both', note: { en: 'Not 0/0 and not ∞/∞: the limit is 5/3 by substitution. Differentiating anyway would give 2x/1 → 4, which is wrong.', id: 'Bukan 0/0 dan bukan ∞/∞: limitnya 5/3 dengan substitusi. Menurunkan juga akan memberi 2x/1 → 4, yang salah.' } },
  { id: 'ex2', tex: '\\lim_{x\\to0}\\dfrac{1-\\cos x}{x+x^2}', num: '1-cos(x)', den: 'x+x^2', a: 0, side: 'both', note: { en: 'The rule applies once. Then sin x/(1 + 2x) → 0/1 is no longer indeterminate; a second round would give cos x/2 → 1/2, which is wrong.', id: 'Aturan berlaku sekali. Lalu sin x/(1 + 2x) → 0/1 tidak lagi tak tentu; putaran kedua akan memberi cos x/2 → 1/2, yang salah.' } },
  byId('inconclusive'),
  byId('cycle'),
  { id: 'oscillates', tex: '\\lim_{x\\to0^+}\\dfrac{x^2\\sin(1/x)}{\\sin x}', num: 'x^2*sin(1/x)', den: 'sin(x)', a: 0, side: 'plus', note: { en: 'The quotient of derivatives contains cos(1/x), which keeps oscillating: no limit, so the rule says nothing. Write it as x · sin(1/x) · (x/sin x) → 0.', id: 'Hasil bagi turunan memuat cos(1/x), yang terus berosilasi: tidak ada limit, sehingga aturan tidak menyatakan apa pun. Tulis sebagai x · sin(1/x) · (x/sin x) → 0.' } },
  byId('ex3a'),
  byId('ex3b'),
]
