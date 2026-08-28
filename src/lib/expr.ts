/** A tiny arithmetic evaluator, shared by two callers who need different
 *  halves of it.
 *
 *  `answer.ts` reads what a learner typed into a box, and deliberately gets a
 *  small function set: this course works in degrees in some places and radians
 *  in others, so accepting `sin(30)` would silently mean one of them.
 *  `figure.ts` plots a curve and gets the full set plus a variable `x`.
 *
 *  It is a plain recursive-descent parser over a string. Nothing here is
 *  evaluated as JavaScript, so an expression from the curriculum can only ever
 *  produce a number or a refusal.
 */

export interface ExprEnv {
  /** Named values the expression may use — `x`, and any sliders. */
  vars?: Record<string, number>
  /** Functions of one argument. */
  funcs?: Record<string, (x: number) => number>
}

const CONSTANTS: Record<string, number> = { pi: Math.PI, π: Math.PI, e: Math.E }

/** Everything a graph may need. Trigonometry here is in radians, which is what
 *  a curve is drawn in. */
export const MATH_FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  exp: Math.exp,
  ln: Math.log,
  log: Math.log10,
  log2: Math.log2,
  sqrt: Math.sqrt,
  akar: Math.sqrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign,
}

interface S {
  src: string
  i: number
  env: ExprEnv
}

const ws = (s: S): void => {
  while (s.i < s.src.length && s.src[s.i] === ' ') s.i++
}

/** Something a `*` could be implied in front of. */
function startsValue(s: S): boolean {
  ws(s)
  const c = s.src[s.i]
  return c !== undefined && /[0-9(.√πa-z]/.test(c)
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
    } else if (startsValue(s) && !/[0-9.]/.test(s.src[s.i])) {
      // `2x`, `2√3`, `3pi`, `2(1+4)` — implied multiplication. A digit is
      // excluded so that `12` stays twelve rather than one times two.
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

/** A run of letters may be one name or several stuck together — `2ax` is a
 *  product, not a variable called `ax`. Take the longest prefix that is
 *  actually known and leave the rest for the implied-multiplication rule. */
function readName(s: S): string {
  const word = /^[a-zπ]+/.exec(s.src.slice(s.i))
  if (!word) return ''
  let name = word[0]
  while (name.length > 1) {
    if (name in (s.env.funcs ?? {}) || name in (s.env.vars ?? {}) || name in CONSTANTS) break
    name = name.slice(0, -1)
  }
  s.i += name.length
  return name
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

  const name = readName(s)
  if (name) {
    const fn = s.env.funcs?.[name]
    if (fn) return fn(parseUnary(s))
    const v = s.env.vars?.[name]
    if (v !== undefined) return v
    const konst = CONSTANTS[name]
    if (konst !== undefined) return konst
    throw new Error('unknown ' + name)
  }

  throw new Error('unexpected ' + c)
}

/** The value of an expression, or null when it is not one. */
export function evaluate(src: string, env: ExprEnv = {}): number | null {
  const text = src.trim().toLowerCase().replace(/\s+/g, ' ')
  if (text === '') return null
  try {
    const s: S = { src: text, i: 0, env }
    const value = parseExpr(s)
    ws(s)
    if (s.i !== text.length) return null
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

/** The same, but a non-finite result (a pole, a root of a negative) comes back
 *  as NaN rather than null — a curve wants to break there, not give up. */
export function evaluateAt(src: string, vars: Record<string, number>): number {
  try {
    const text = src.trim().toLowerCase().replace(/\s+/g, ' ')
    const s: S = { src: text, i: 0, env: { vars, funcs: MATH_FUNCS } }
    const value = parseExpr(s)
    ws(s)
    return s.i === text.length ? value : NaN
  } catch {
    return NaN
  }
}
