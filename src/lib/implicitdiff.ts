/** Implicit differentiation for the article's widgets, built on the differentiator of chain.ts.
 *
 *  An equation such as x³ + y³ = 9xy is read into two sides made of x, y, numbers, powers, e^u and the trigonometric
 *  functions. y is treated as a differentiable function of x: both sides are differentiated by the rules and the chain
 *  rule (so d/dx of y² is 2y·y′, written with the symbol y′), the equation is collected into A + B·y′ = 0 without
 *  multiplying anything out, and solved: y′ = −A / B. Higher derivatives differentiate that formula again and put y′
 *  back in.
 *
 *  The checker (tools/check-implicitdiff.mjs) uses references that never run this algorithm: curves built around a known
 *  function y = f(x), whose slope must come out as f′, an exact comparison with derivative.ts, and a numerical solution
 *  of the equation for y by Newton's method, differentiated by central differences. */

import { commonFactor, differentiate, divideTerms, evalFloat, K, ParseError, parseExpression, simp, sub, neg, div, mul, add, type Node, type Step } from './chain'

export { ParseError, type Node, type Step }

export interface Equation {
  lhs: Node
  rhs: Node
}

/** Read `lhs = rhs`: exactly one equals sign, both sides made of x, y, numbers and the functions of the chain rule. */
export function parseEquation(src: string): Equation {
  const parts = src.replace(/−/g, '-').split('=')
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) throw new ParseError('equation')
  return { lhs: parseExpression(parts[0], { y: true }), rhs: parseExpression(parts[1], { y: true }) }
}

/** lhs − rhs, the function whose zero set is the curve. */
export const curveFn = (eq: Equation): Node => sub(eq.lhs, eq.rhs)

/** A node as A + B·y′ with A and B free of y′ (B = null means zero). The equation is linear in y′, so this is exact. */
function linear(n: Node): { a: Node; b: Node | null } {
  const noYp = (m: Node): boolean => {
    switch (m.t) {
      case 'yp':
        return false
      case 'num':
      case 'pi':
      case 'x':
      case 'y':
        return true
      case 'neg':
      case 'pow':
      case 'exp':
      case 'fn':
      case 'ln':
        return noYp(m.a)
      default:
        return noYp(m.a) && noYp(m.b)
    }
  }
  if (noYp(n)) return { a: n, b: null }
  switch (n.t) {
    case 'yp':
      return { a: K(0), b: K(1) }
    case 'neg': {
      const l = linear(n.a)
      return { a: neg(l.a), b: l.b && neg(l.b) }
    }
    case 'add':
    case 'sub': {
      const l = linear(n.a)
      const r = linear(n.b)
      const comb = n.t === 'add' ? add : sub
      return { a: comb(l.a, r.a), b: l.b && r.b ? comb(l.b, r.b) : l.b ? l.b : r.b ? (n.t === 'add' ? r.b : neg(r.b)) : null }
    }
    case 'mul': {
      const l = linear(n.a)
      const r = linear(n.b)
      if (l.b && r.b) throw new ParseError('syntax')
      const a = mul(l.a, r.a)
      const b = l.b ? mul(l.b, r.a) : r.b ? mul(l.a, r.b) : null
      return { a, b }
    }
    case 'div': {
      const l = linear(n.a)
      const r = linear(n.b)
      if (r.b) throw new ParseError('syntax')
      return { a: div(l.a, r.a), b: l.b && div(l.b, r.a) }
    }
    default:
      throw new ParseError('syntax')
  }
}

export interface Implicit {
  eq: Equation
  /** The derivatives of the two sides, simplified, containing y′. */
  dl: Node
  dr: Node
  /** The collected equation A + B·y′ = 0, and the solution y′ = −A / B in x and y only. */
  a: Node
  b: Node
  slope: Node
  steps: Step[]
}

/** Differentiate both sides with respect to x, collect the terms with y′ and solve for it. */
export function implicitDerivative(eq: Equation): Implicit {
  const steps: Step[] = []
  const rawL = differentiate(eq.lhs, steps)
  const rawR = differentiate(eq.rhs, steps)
  const { a, b } = linear(sub(rawL, rawR))
  if (b === null) throw new ParseError('noy')
  const A = simp(a)
  const B = simp(b)
  if (B.t === 'num' && B.v.n === 0n) throw new ParseError('noy')
  // y′ = −A/B written without a common factor: 9y − 3x² over 3y² − 9x becomes 3y − x² over y² − 3x
  const N = simp(neg(A))
  const f = commonFactor([N, B])
  const slope = simp(div(divideTerms(N, f), divideTerms(B, f)))
  return { eq, dl: simp(rawL), dr: simp(rawR), a: A, b: B, slope, steps }
}

/** Put a node in place of y′ everywhere. */
function putYp(n: Node, by: Node): Node {
  switch (n.t) {
    case 'yp':
      return by
    case 'num':
    case 'pi':
    case 'x':
    case 'y':
      return n
    case 'neg':
      return neg(putYp(n.a, by))
    case 'pow':
      return { t: 'pow', a: putYp(n.a, by), n: n.n }
    case 'exp':
      return { t: 'exp', a: putYp(n.a, by) }
    case 'fn':
      return { t: 'fn', f: n.f, a: putYp(n.a, by) }
    case 'ln':
      return { t: 'ln', a: putYp(n.a, by) }
    default:
      return { t: n.t, a: putYp(n.a, by), b: putYp(n.b, by) } as Node
  }
}

/** y″ in x and y: differentiate y′ = −A/B again and put the formula for y′ back in. */
export function secondDerivative(imp: Implicit): Node {
  const raw = differentiate(imp.slope)
  return simp(putYp(raw, imp.slope))
}

/** The slope at a point, or ±Infinity / NaN where the formula divides by zero. */
export function slopeAt(imp: Implicit, x: number, y: number): number {
  return evalFloat(imp.slope, x, y)
}

/** Solve H(x, y) = 0 for y near a guess, by Newton's method with a difference quotient for ∂H/∂y; null when it fails. */
export function solveY(H: Node, x: number, guess: number): number | null {
  let y = guess
  for (let i = 0; i < 80; i++) {
    const f = evalFloat(H, x, y)
    if (!Number.isFinite(f)) return null
    if (Math.abs(f) < 1e-13) return y
    const h = 1e-6 * Math.max(1, Math.abs(y))
    const d = (evalFloat(H, x, y + h) - evalFloat(H, x, y - h)) / (2 * h)
    if (!Number.isFinite(d) || Math.abs(d) < 1e-14) return null
    const next = y - f / d
    if (Math.abs(next - y) > 1e3) return null
    y = next
  }
  return Math.abs(evalFloat(H, x, y)) < 1e-9 ? y : null
}

/** The curve H = 0 inside a box, as short line segments (marching squares with linear interpolation). */
export function contour(H: Node, x0: number, x1: number, y0: number, y1: number, N = 140): [number, number, number, number][] {
  const out: [number, number, number, number][] = []
  const xs = (i: number) => x0 + ((x1 - x0) * i) / N
  const ys = (j: number) => y0 + ((y1 - y0) * j) / N
  const grid: number[][] = []
  for (let i = 0; i <= N; i++) {
    const col: number[] = []
    for (let j = 0; j <= N; j++) col.push(evalFloat(H, xs(i), ys(j)))
    grid.push(col)
  }
  const cross = (xa: number, ya: number, va: number, xb: number, yb: number, vb: number): [number, number] | null => {
    if (!Number.isFinite(va) || !Number.isFinite(vb)) return null
    if (va === 0 && vb === 0) return null
    if ((va < 0) === (vb < 0) && va !== 0 && vb !== 0) return null
    const t = va / (va - vb)
    return [xa + t * (xb - xa), ya + t * (yb - ya)]
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const v0 = grid[i][j]
      const v1 = grid[i + 1][j]
      const v2 = grid[i + 1][j + 1]
      const v3 = grid[i][j + 1]
      if (![v0, v1, v2, v3].every(Number.isFinite)) continue
      const xa = xs(i)
      const xb = xs(i + 1)
      const ya = ys(j)
      const yb = ys(j + 1)
      const bt = cross(xa, ya, v0, xb, ya, v1)
      const rt = cross(xb, ya, v1, xb, yb, v2)
      const tp = cross(xa, yb, v3, xb, yb, v2)
      const lf = cross(xa, ya, v0, xa, yb, v3)
      const pts = [bt, rt, tp, lf].filter((p): p is [number, number] => p !== null)
      const push = (p: [number, number], q: [number, number]) => out.push([p[0], p[1], q[0], q[1]])
      if (pts.length === 2) push(pts[0], pts[1])
      else if (pts.length === 4 && bt && rt && tp && lf) {
        const centre = evalFloat(H, (xa + xb) / 2, (ya + yb) / 2)
        if (Number.isFinite(centre) && (centre < 0) === (v0 < 0)) {
          push(bt, rt)
          push(tp, lf)
        } else {
          push(bt, lf)
          push(rt, tp)
        }
      }
    }
  }
  return out
}

