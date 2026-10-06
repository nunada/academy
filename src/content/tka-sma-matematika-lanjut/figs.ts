/** Drawing helpers for the advanced senior-high course: everything the
 *  senior-high course draws, plus the hollow dot of a limit and the shapes
 *  that matrices and circles need. */

import type { FigItem } from '../../lib/figure'
import type { Pt } from '../tka-smp-matematika/figs'

export * from '../tka-sma-matematika/figs'

/** A hollow circle on a graph: the point a limit approaches but the function
 *  does not take. */
export const hole = (p: Pt, label?: string, color: 'a' | 'b' | 'c' | 'result' | 'muted' = 'a'): FigItem => ({
  t: 'dot',
  x: p[0],
  y: p[1],
  color,
  label,
  open: true,
})

/** A circle of radius `r` about `c`, as a parametric curve. */
export const circle = (c: Pt, r: number, color: 'a' | 'b' | 'c' | 'result' | 'muted' = 'a', dashed = false): FigItem => ({
  t: 'param',
  x: `${c[0]}+${r}*cos(t)`,
  y: `${c[1]}+${r}*sin(t)`,
  from: 0,
  to: 6.283185,
  color,
  dashed,
})

/** An arrow from the origin (or from `from`) to a point. */
export const arrow = (to: Pt, label?: string, color: 'a' | 'b' | 'c' | 'result' | 'muted' = 'a', from: Pt = [0, 0]): FigItem => ({
  t: 'vec',
  from,
  to,
  label,
  color,
})

/** A matrix as LaTeX: `pm([1, 2], [3, 4])` is the 2 x 2 matrix with rows 1 2 and 3 4. */
export const pm = (...rows: (string | number)[][]): string =>
  '\\begin{pmatrix}' + rows.map((r) => r.join('&')).join('\\\\') + '\\end{pmatrix}'

/** The same with straight bars: the determinant. */
export const dm = (...rows: (string | number)[][]): string =>
  '\\begin{vmatrix}' + rows.map((r) => r.join('&')).join('\\\\') + '\\end{vmatrix}'
