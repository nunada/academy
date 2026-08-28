/** Marking a typed mathematical answer.
 *
 *  Two kinds of answer, marked two ways. A box may hold **a number**, in which
 *  case anything that evaluates to it counts — `3.74`, `sqrt(14)`, `-7/2`,
 *  `2√3`, `pi/4` are all read. Or it may hold **a formula**, and then it is
 *  marked by agreeing with the author's formula wherever both are defined.
 *
 *  Accepting the exact form matters pedagogically. An answer of √14 marked
 *  wrong because the learner did not round it the way the author did teaches
 *  the wrong lesson, and so does `x/2 - 3/2` marked wrong for not being
 *  spelled `(x-3)/2`.
 *
 *  The arithmetic itself lives in `expr.ts`, shared with the figure plotter.
 *  What is decided here is which functions a learner may reach for — and
 *  trigonometry is deliberately not among them. These courses work in degrees
 *  in some places and radians in others, so `sin(30)` would silently mean one
 *  of the two, and marking it either way would be wrong half the time.
 */

import { evaluate, evaluateAt } from './expr'

const FUNCTIONS = {
  sqrt: Math.sqrt,
  akar: Math.sqrt,
  abs: Math.abs,
  // Logarithms are here and trigonometry is not, for the same reason: these
  // three mean one thing each, whereas `sin(30)` would be a guess about
  // whether the learner was working in degrees or in radians.
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
}

/** A comma is the decimal mark here, so `1,5` has to be read as one and a
 *  half. But `(3,4)` is a learner putting a whole vector in one box, and
 *  reading that as three point four would mark a misunderstanding correct —
 *  so the comma only counts when it stands between two digits in an
 *  expression with no brackets and nothing else for it to mean. */
function decimalComma(src: string): string {
  const single = /^[^,]*,[^,]*$/.test(src)
  const betweenDigits = /[0-9],[0-9]/.test(src)
  const plain = !src.includes('(') && !src.includes(')') && !src.includes('.')
  return single && betweenDigits && plain ? src.replace(',', '.') : src
}

/** The number a learner meant, or null when what they typed is not one. */
export function evalAnswer(input: string): number | null {
  return evaluate(decimalComma(input.trim().toLowerCase().replace(/\s+/g, ' ')), { funcs: FUNCTIONS })
}

/** Two decimal places, or half a percent — whichever is the kinder of the two.
 *
 *  The relative half-percent is what makes `3.74` count as $\sqrt{14}$. On its
 *  own it would be cruel to a small answer: half a percent of $2/7$ is 0.0014,
 *  so a learner who rounded to `0.29` — correctly, to two places — would be
 *  marked wrong for rounding the way they were asked to. The absolute floor of
 *  0.005 is exactly the width of that rounding, and it is far narrower than
 *  the gap between any two answers a real mistake produces. */
export const toleranceFor = (answer: number, tol?: number): number =>
  tol ?? Math.max(Math.abs(answer) * 5e-3, 5e-3)

export function isRight(input: string, answer: number, tol?: number): boolean {
  const got = evalAnswer(input)
  if (got === null) return false
  return Math.abs(got - answer) <= toleranceFor(answer, tol)
}

/* --------------------------------------------------------- formula answers

   Some answers are functions, not numbers: the inverse of a function, a
   composite, the equation of a transformed graph — and, once this track
   reaches derivatives, nearly everything.

   Marking those does not need a computer algebra system. Two formulas are the
   same function when they agree everywhere, so they are checked by being
   evaluated at a spread of points and compared. `(x-3)/2`, `0.5x - 1.5` and
   `x/2 - 3/2` all pass, which is the point: a learner should not be marked
   wrong for spelling an answer differently from the author.

   The sample points are deliberately not round numbers. Two different
   functions can agree at 0, 1 and 2 by coincidence; they do not agree at
   0.7413 and eleven of its neighbours. */

const SAMPLES = 24
/** Below this many usable points the answer is not being checked so much as
 *  guessed at, so it is refused rather than accepted on thin evidence. */
const MIN_USABLE = 5

/** An answer may be written as a whole equation. Everything up to the last
 *  `=` is the learner restating the question, which is not the answer. */
function rightHandSide(src: string): string {
  const at = src.lastIndexOf('=')
  return at < 0 ? src : src.slice(at + 1)
}

export interface FormulaSpec {
  /** What the answer should be, as an expression the plotter can read. */
  formula: string
  /** The letter it is written in. */
  variable?: string
  /** Where to compare them. Give it when the formula is only defined on part
   *  of the line — a root, a logarithm, a denominator that vanishes. */
  domain?: [number, number]
}

export function isSameFormula(input: string, spec: FormulaSpec): boolean {
  const typed = rightHandSide(input.trim().toLowerCase().replace(/\s+/g, ' '))
  if (typed === '') return false

  const v = spec.variable ?? 'x'
  const [lo, hi] = spec.domain ?? [-4, 4]

  let usable = 0
  for (let i = 0; i < SAMPLES; i++) {
    // An irrational stride, so the points never land on the round numbers
    // where two different functions are most likely to meet by accident.
    const t = ((i + 0.5) * 0.6180339887) % 1
    const x = lo + t * (hi - lo)

    const want = evaluateAt(spec.formula, { [v]: x })
    if (!Number.isFinite(want)) continue // outside the answer's own domain

    const got = evaluateAt(typed, { [v]: x })
    // Finite where the answer is finite, or it is a different function.
    if (!Number.isFinite(got)) return false
    if (Math.abs(got - want) > 1e-6 * Math.max(1, Math.abs(want), Math.abs(got))) return false
    usable++
  }
  return usable >= MIN_USABLE
}
