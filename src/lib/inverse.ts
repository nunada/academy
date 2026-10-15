/** Numbers and drawings for the "Derivatives of Inverse Functions and Logarithms" article's widgets.
 *
 *  Each function in INVERSES is increasing with a derivative that never vanishes on its interval, which is exactly the
 *  condition of the derivative rule for inverses. The inverse is found numerically, by bisection, so that the drawn
 *  graph of f⁻¹ and its slope do not depend on knowing a formula for it; the checker (tools/check-inverse.mjs) compares
 *  1/f′(a) with a difference quotient of that numerical inverse, and the two limits behind ln with their definitions. */

export interface InverseFn {
  id: string
  tex: string
  /** The inverse as a formula, when there is one, only for the label. */
  invTex: string
  f: (x: number) => number
  d: (x: number) => number
  /** The interval on which f is increasing with f′ > 0. */
  xr: [number, number]
}

export const INVERSES: InverseFn[] = [
  { id: 'half', tex: '\\frac12x+1', invTex: '2x-2', f: (x) => x / 2 + 1, d: () => 0.5, xr: [-3, 4] },
  { id: 'square', tex: 'x^2\\ (x>0)', invTex: '\\sqrt x', f: (x) => x * x, d: (x) => 2 * x, xr: [0.15, 3] },
  { id: 'cube', tex: 'x^3-2\\ (x>0)', invTex: '\\sqrt[3]{x+2}', f: (x) => x ** 3 - 2, d: (x) => 3 * x * x, xr: [0.2, 2.2] },
  { id: 'cubeplus', tex: 'x^3+x', invTex: '', f: (x) => x ** 3 + x, d: (x) => 3 * x * x + 1, xr: [-1.7, 1.7] },
  { id: 'exp', tex: 'e^x', invTex: '\\ln x', f: Math.exp, d: Math.exp, xr: [-2, 2] },
  { id: 'ln', tex: '\\ln x', invTex: 'e^x', f: Math.log, d: (x) => 1 / x, xr: [0.15, 5] },
  { id: 'fifth', tex: 'x^5+x', invTex: '', f: (x) => x ** 5 + x, d: (x) => 5 * x ** 4 + 1, xr: [-1.4, 1.4] },
]

/** f⁻¹(b) for an increasing f on [lo, hi], by bisection; NaN when b is outside the range of f on that interval. */
export function inverse(f: (x: number) => number, b: number, lo: number, hi: number): number {
  if (!(b >= f(lo) && b <= f(hi))) return NaN
  let a = lo
  let c = hi
  for (let i = 0; i < 200; i++) {
    const m = (a + c) / 2
    if (f(m) < b) a = m
    else c = m
  }
  return (a + c) / 2
}

/** The derivative rule for inverses: (f⁻¹)′(b) = 1 / f′(f⁻¹(b)). */
export function inverseSlope(g: InverseFn, b: number): number {
  const a = inverse(g.f, b, g.xr[0], g.xr[1])
  return 1 / g.d(a)
}

/** (1 + h)^(1/h): tends to e as h → 0, because ln of it is ln(1 + h)/h, the difference quotient of ln at 1. */
export const eLimit = (h: number): number => (1 + h) ** (1 / h)

/** (a^h − 1)/h: tends to ln a as h → 0, the slope of a^x at the y-axis. */
export const expSlopeAtZero = (a: number, h: number): number => (a ** h - 1) / h

/** ln(1 + h)/h: tends to 1. */
export const lnLimit = (h: number): number => Math.log(1 + h) / h
