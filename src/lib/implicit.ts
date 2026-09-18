/** Implicit curves — g(x, y) = h(x, y), the shape `Figure`'s `curve` item
 *  can't draw (that's a single-valued y = f(x)). A circle is the standard
 *  example: `x^2 + y^2 = 9` has no function form, but it still has a
 *  boundary, and marching squares finds it by sampling a grid and joining
 *  the places the sign of g-h flips.
 *
 *  Nothing here knows about Figure or React — the result is a plain list of
 *  line segments, which the caller turns into `seg` items exactly like any
 *  other figure content.
 */

import { evaluateAt } from './expr'

const RESOLUTION = 48

/** A `y = f(x)` row has none of these outside `x` itself; an implicit row's
 *  `y` is likewise never a free parameter, whichever side of `=` it's on —
 *  both are reserved, not variables a learner can slide. */
const RESERVED = new Set(['x', 'y'])

/** Every identifier in an expression that isn't a function name, a
 *  constant, or a reserved axis variable — candidates for a slider. Mirrors
 *  `expr.ts`'s own tokenizer (`readName`'s `[a-zπ][a-z0-9π]*`, case-folded
 *  the same way `evaluate`/`evaluateAt` lowercase their input first). */
export function freeVariables(expr: string, knownFuncs: Set<string>): string[] {
  const text = expr.toLowerCase()
  const found = new Set<string>()
  const re = /[a-zπ][a-z0-9π]*/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const name = m[0]
    if (RESERVED.has(name) || knownFuncs.has(name) || name === 'pi' || name === 'e' || name === 'π') continue
    found.add(name)
  }
  return [...found]
}

/** Substitute known values into an expression, textually — the same
 *  identifiers `freeVariables` would find, each replaced by its current
 *  slider value in parentheses (so `a*x` with `a: -2` becomes `(-2)*x`,
 *  never `-2*x` with a sign that reads as part of the next token). Anything
 *  not in `values` (a function name, `x`, `y`, a constant) is left alone. */
export function substitute(expr: string, values: Record<string, number>): string {
  return expr.replace(/[a-zA-Zπ][a-zA-Z0-9π]*/g, (name) => {
    const v = values[name.toLowerCase()]
    return v === undefined ? name : `(${v})`
  })
}

/** Trace g(x,y) = h(x,y) across the given window as line segments, via a
 *  plain (non-disambiguated) marching squares: sample g-h on a grid, and on
 *  every cell edge whose two corners disagree in sign, linearly interpolate
 *  the crossing. A cell with exactly two crossings gets one segment; the
 *  rare saddle with four is joined in a fixed, not sign-analyzed, pairing —
 *  a small fidelity trade against the complexity of doing it exactly, for a
 *  scratch-space graphing board rather than a plotting library. */
export function traceImplicit(
  lhs: string,
  rhs: string,
  xSpan: [number, number],
  ySpan: [number, number],
): [[number, number], [number, number]][] {
  const [x0, x1] = xSpan
  const [y0, y1] = ySpan
  const nx = RESOLUTION
  const ny = RESOLUTION
  const dx = (x1 - x0) / nx
  const dy = (y1 - y0) / ny

  const g = (x: number, y: number): number => evaluateAt(lhs, { x, y }) - evaluateAt(rhs, { x, y })

  const grid: number[][] = []
  for (let i = 0; i <= nx; i++) {
    const row: number[] = []
    for (let j = 0; j <= ny; j++) row.push(g(x0 + i * dx, y0 + j * dy))
    grid.push(row)
  }

  const segments: [[number, number], [number, number]][] = []
  const lerp = (a: number, b: number, va: number, vb: number): number => {
    if (!Number.isFinite(va) || !Number.isFinite(vb) || va === vb) return (a + b) / 2
    return a + ((b - a) * (0 - va)) / (vb - va)
  }

  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const x00 = x0 + i * dx,
        x10 = x0 + (i + 1) * dx
      const y00 = y0 + j * dy,
        y01 = y0 + (j + 1) * dy
      const v00 = grid[i][j],
        v10 = grid[i + 1][j],
        v11 = grid[i + 1][j + 1],
        v01 = grid[i][j + 1]
      if ([v00, v10, v11, v01].some((v) => !Number.isFinite(v))) continue

      const pts: [number, number][] = []
      // bottom edge (00 -> 10)
      if (v00 === 0 || v00 * v10 < 0) pts.push([lerp(x00, x10, v00, v10), y00])
      // right edge (10 -> 11)
      if (v10 === 0 || v10 * v11 < 0) pts.push([x10, lerp(y00, y01, v10, v11)])
      // top edge (01 -> 11)
      if (v01 === 0 || v01 * v11 < 0) pts.push([lerp(x00, x10, v01, v11), y01])
      // left edge (00 -> 01)
      if (v00 === 0 || v00 * v01 < 0) pts.push([x00, lerp(y00, y01, v00, v01)])

      if (pts.length === 2) segments.push([pts[0], pts[1]])
      else if (pts.length === 4) {
        segments.push([pts[0], pts[1]])
        segments.push([pts[2], pts[3]])
      }
    }
  }
  return segments
}
