/** Marking a typed mathematical answer.
 *
 *  Every answer box in the maths courses holds one scalar, which is why this
 *  can stay small: no commas to disambiguate, no vectors to parse, no algebra
 *  to compare. A learner may type `3.74`, `sqrt(14)`, `-7/2`, `2√3` or `pi/4`
 *  and all five are read as numbers.
 *
 *  Accepting the exact form matters pedagogically. An answer of √14 marked
 *  wrong because the learner did not round it the way the author did teaches
 *  the wrong lesson, so the tolerance is generous — half a percent — and an
 *  exact expression lands dead on it anyway.
 */

const CONSTANTS: Record<string, number> = { pi: Math.PI, π: Math.PI, e: Math.E }

/** Functions of one argument. Deliberately no trigonometry: this course works
 *  in degrees and `sin(30)` would silently mean radians. */
const FUNCTIONS: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt,
  akar: Math.sqrt,
  abs: Math.abs,
}

interface S {
  src: string
  i: number
}

const ws = (s: S): void => {
  while (s.i < s.src.length && s.src[s.i] === ' ') s.i++
}

/** Something a `*` could be implied in front of. */
function startsValue(s: S): boolean {
  ws(s)
  const c = s.src[s.i]
  if (c === undefined) return false
  return /[0-9(.√πa-z]/.test(c)
}

function parseExpr(s: S): number {
  let value = parseTerm(s)
  for (;;) {
    ws(s)
    const c = s.src[s.i]
    if (c === '+' || c === '-') {
      s.i++
      const rhs = parseTerm(s)
      value = c === '+' ? value + rhs : value - rhs
    } else {
      return value
    }
  }
}

function parseTerm(s: S): number {
  let value = parsePower(s)
  for (;;) {
    ws(s)
    const c = s.src[s.i]
    if (c === '*' || c === '×' || c === '⋅' || c === '·') {
      s.i++
      value *= parsePower(s)
    } else if (c === '/' || c === '÷' || c === ':') {
      s.i++
      value /= parsePower(s)
    } else if (startsValue(s) && s.src[s.i] !== undefined && !/[0-9.]/.test(s.src[s.i])) {
      // `2√3`, `3pi`, `2(1+4)` — implied multiplication. A digit is excluded
      // so that `12` stays twelve rather than becoming one times two.
      value *= parsePower(s)
    } else {
      return value
    }
  }
}

function parsePower(s: S): number {
  const base = parseUnary(s)
  ws(s)
  if (s.src[s.i] === '^') {
    s.i++
    return Math.pow(base, parsePower(s))
  }
  return base
}

function parseUnary(s: S): number {
  ws(s)
  // The sign binds looser than the exponent, so `-2^2` is minus four.
  if (s.src[s.i] === '-') {
    s.i++
    return -parsePower(s)
  }
  if (s.src[s.i] === '+') {
    s.i++
    return parsePower(s)
  }
  return parsePrimary(s)
}

function parsePrimary(s: S): number {
  ws(s)
  const c = s.src[s.i]
  if (c === undefined) throw new Error('empty')

  if (c === '(') {
    s.i++
    const v = parseExpr(s)
    ws(s)
    if (s.src[s.i] !== ')') throw new Error('unclosed')
    s.i++
    return v
  }

  if (c === '|') {
    s.i++
    const v = parseExpr(s)
    ws(s)
    if (s.src[s.i] !== '|') throw new Error('unclosed')
    s.i++
    return Math.abs(v)
  }

  if (c === '√') {
    s.i++
    return Math.sqrt(parseUnary(s))
  }

  if (/[0-9.]/.test(c)) {
    const m = /^[0-9]*\.?[0-9]*/.exec(s.src.slice(s.i))
    const lit = m?.[0] ?? ''
    if (lit === '' || lit === '.') throw new Error('number')
    s.i += lit.length
    return Number(lit)
  }

  const word = /^[a-zπ]+/.exec(s.src.slice(s.i))
  if (word) {
    const name = word[0]
    s.i += name.length
    const fn = FUNCTIONS[name]
    if (fn) return fn(parseUnary(s))
    const konst = CONSTANTS[name]
    if (konst !== undefined) return konst
    throw new Error('unknown ' + name)
  }

  throw new Error('unexpected ' + c)
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
  const src = decimalComma(input.trim().toLowerCase().replace(/\s+/g, ' '))
  if (src === '') return null

  try {
    const s: S = { src, i: 0 }
    const value = parseExpr(s)
    ws(s)
    if (s.i !== src.length) return null
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
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
