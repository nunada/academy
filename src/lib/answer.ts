/** Marking a typed mathematical answer.
 *
 *  Every answer box in the maths courses holds one scalar, which is why this
 *  can stay small: no commas to disambiguate, no vectors to parse, no algebra
 *  to compare. A learner may type `3.74`, `sqrt(14)`, `-7/2`, `2√3` or `pi/4`
 *  and all five are read as numbers.
 *
 *  Accepting the exact form matters pedagogically. An answer of √14 marked
 *  wrong because the learner did not round it the way the author did teaches
 *  the wrong lesson.
 *
 *  The arithmetic itself lives in `expr.ts`, shared with the figure plotter.
 *  What is decided here is which functions a learner may reach for — and
 *  trigonometry is deliberately not among them. These courses work in degrees
 *  in some places and radians in others, so `sin(30)` would silently mean one
 *  of the two, and marking it either way would be wrong half the time.
 */

import { evaluate } from './expr'

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
