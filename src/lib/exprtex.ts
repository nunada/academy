/** The text a learner types for a formula, as TeX: `3x^2 - 5x + 1` → `3x^{2}-5x+1`.
 *
 *  The preset buttons of the widgets hold the very text that goes into the input box, which is the text form of the
 *  formula: `^` for powers, `*` for products, `sqrt(…)`, `sin(…)`, `a/b`. On a button it reads better typeset, so this
 *  turns it into TeX for the renderer. It reads the notation the widgets accept — numbers, letters, brackets, `+ − * /`,
 *  `^` with a number, a letter or a bracket, the function names `sin cos tan … ln log exp sqrt abs`, and `pi` — and is
 *  not a general parser: what it does not know it leaves as it is.
 *
 *  A product is a run of factors with no operator between them (`x sin(2x)`, `x^2 (x+1)^3`); `/` takes the whole run
 *  before it as the numerator and the next factor as the denominator. */

const FUNCS = ['arcsin', 'arccos', 'arctan', 'arccot', 'arcsec', 'arccsc', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'ln', 'log', 'exp']
const GREEK: Record<string, string> = { pi: '\\pi', theta: '\\theta', alpha: '\\alpha', beta: '\\beta', phi: '\\varphi', omega: '\\omega' }

interface Factor {
  tex: string
  /** the inside of the brackets when the factor is a bracket and nothing else */
  inner?: string
  end: number
}

const isDigit = (c: string | undefined): boolean => c !== undefined && c >= '0' && c <= '9'
const isLetter = (c: string | undefined): boolean => c !== undefined && /[a-zA-Z]/.test(c)

function skipSpaces(s: string, i: number): number {
  while (s[i] === ' ') i++
  return i
}

function parseSum(s: string, start: number): { tex: string; end: number } {
  let out = ''
  let i = start
  while (i < s.length && s[i] !== ')') {
    if (s[i] === ' ') {
      i++
      continue
    }
    if (s[i] === '+' || s[i] === '-') {
      out += s[i]
      i++
      continue
    }
    const t = parseTerm(s, i)
    out += t.tex
    i = t.end
  }
  return { tex: out, end: i }
}

function parseTerm(s: string, start: number): { tex: string; end: number } {
  let acc = ''
  let single: string | undefined // the inside of the bracket, while the term so far is one bracket
  let i = start
  let guard = 0
  while (i < s.length && guard++ < 1000) {
    const c = s[i]
    if (c === ' ') {
      const j = skipSpaces(s, i)
      if (j >= s.length || s[j] === '+' || s[j] === '-' || s[j] === ')') {
        i = j
        break
      }
      i = j
      continue
    }
    if (c === '+' || c === '-' || c === ')') break
    if (c === '*') {
      i = skipSpaces(s, i + 1)
      // 2*x is 2x; every other product shows a dot
      if (!(/[0-9a-zA-Z)]$/.test(acc) && (isLetter(s[i]) || s[i] === '('))) acc += '\\cdot '
      single = undefined
      continue
    }
    if (c === '/') {
      i = skipSpaces(s, i + 1)
      const sign = s[i] === '-' ? '-' : ''
      if (sign) i++
      const den = parseFactor(s, i)
      acc = `\\frac{${single ?? acc}}{${sign}${den.inner ?? den.tex}}`
      single = undefined
      i = den.end
      continue
    }
    const f = parseFactor(s, i)
    single = acc === '' ? f.inner : undefined
    acc += f.tex
    i = f.end
  }
  return { tex: acc, end: i }
}

function parsePower(s: string, i: number): { tex: string; end: number } | null {
  if (s[i] !== '^') return null
  i++
  if (s[i] === '(') {
    const g = parseSum(s, i + 1)
    return { tex: `^{${g.tex}}`, end: g.end + 1 }
  }
  const word = /^(pi|theta)/.exec(s.slice(i))
  if (word) return { tex: `^{${GREEK[word[0]]}}`, end: i + word[0].length }
  const m = /^-?\d+(\.\d+)?|^[a-zA-Z]/.exec(s.slice(i))
  if (!m) return { tex: '^{}', end: i }
  return { tex: `^{${m[0]}}`, end: i + m[0].length }
}

function parseFactor(s: string, start: number): Factor {
  let i = start
  let tex = ''
  let inner: string | undefined
  const c = s[i]
  if (isDigit(c) || (c === '.' && isDigit(s[i + 1]))) {
    const m = /^\d*\.?\d+/.exec(s.slice(i))
    tex = m ? m[0] : c
    i += tex.length
  } else if (c === '(') {
    const g = parseSum(s, i + 1)
    tex = `(${g.tex})`
    inner = g.tex
    i = g.end + 1
  } else if (isLetter(c)) {
    const word = /^[a-zA-Z]+/.exec(s.slice(i))![0]
    if ((word === 'sqrt' || word === 'abs') && s[i + word.length] === '(') {
      const g = parseSum(s, i + word.length + 1)
      tex = word === 'sqrt' ? `\\sqrt{${g.tex}}` : `\\left|${g.tex}\\right|`
      i = g.end + 1
    } else if (FUNCS.includes(word)) {
      tex = `\\${word}`
      i += word.length
      const p = parsePower(s, i)
      if (p) {
        tex += p.tex
        i = p.end
      }
      if (s[i] === '(') {
        const g = parseSum(s, i + 1)
        tex += `(${g.tex})`
        i = g.end + 1
      } else {
        const j = skipSpaces(s, i)
        if (j > i && j < s.length && s[j] !== '+' && s[j] !== '-' && s[j] !== ')' && s[j] !== '*' && s[j] !== '/') {
          const a = parseFactor(s, j)
          tex += ` ${a.tex}`
          i = a.end
        } else tex += ' '
      }
      return { tex, end: i }
    } else if (GREEK[word]) {
      tex = GREEK[word]
      i += word.length
    } else {
      tex = word
      i += word.length
    }
  } else {
    // anything else is shown as it was typed
    tex = c === '{' || c === '}' || c === '\\' || c === '%' || c === '$' || c === '&' || c === '#' || c === '_' ? `\\${c === '\\' ? 'backslash' : c}` : c
    i++
  }
  for (let p = parsePower(s, i); p; p = parsePower(s, i)) {
    tex += p.tex
    i = p.end
    inner = undefined
  }
  return { tex, inner, end: i }
}

/** The TeX of a formula typed in the text notation of the widgets. */
export function exprTex(src: string): string {
  const s = src.trim()
  let tex = ''
  let i = 0
  let guard = 0
  while (i < s.length && guard++ < 1000) {
    const r = parseSum(s, i)
    tex += r.tex
    i = r.end
    if (i < s.length) {
      // a stray ')': keep it
      tex += s[i]
      i++
    }
  }
  return tex.replace(/\s+$/, '')
}
