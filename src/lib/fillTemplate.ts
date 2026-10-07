/** Splits a formula template with `___` blanks into pieces that can be typeset
 *  one at a time with an input box between them.
 *
 *  Cutting the TeX at every `___` is fine while the blank sits at the top level
 *  of the formula. Inside `\frac{___}{8}` it is not: the pieces `\frac{` and
 *  `}{8}` are each broken TeX, and the learner sees "1/2 = [box] 8" instead of a
 *  fraction with a box in its numerator. So a fraction that holds a blank is
 *  returned as a node of its own — numerator and denominator are themselves lists
 *  of pieces — and the page lays it out as a real fraction with the boxes inside.
 *
 *  Anything else that holds a blank inside braces (a square root, an exponent,
 *  a matrix) is not understood here and still splits; `tools/check-fill-templates.mjs`
 *  flags those so the template can be rewritten with the blank at the top level. */

export type FillNode =
  | { t: 'tex'; src: string }
  | { t: 'blank'; i: number }
  | { t: 'frac'; num: FillNode[]; den: FillNode[] }

const BLANK = '___'
const FRAC = /^\\[dt]?frac\s*\{/

/** Index just past the `}` that closes the `{` at `open`, or -1. A `\{` or `\}`
 *  is a literal brace and does not count. */
function closeOf(s: string, open: number): number {
  let depth = 0
  for (let i = open; i < s.length; i++) {
    const c = s[i]
    if (c === '\\') {
      i++
      continue
    }
    if (c === '{') depth++
    else if (c === '}' && --depth === 0) return i + 1
  }
  return -1
}

export function parseFillTemplate(template: string): FillNode[] {
  const next = { i: 0 }
  return parse(template, next)
}

function parse(s: string, next: { i: number }): FillNode[] {
  const nodes: FillNode[] = []
  let buf = ''
  const flush = () => {
    if (buf) nodes.push({ t: 'tex', src: buf })
    buf = ''
  }

  let pos = 0
  while (pos < s.length) {
    if (s.startsWith(BLANK, pos)) {
      flush()
      nodes.push({ t: 'blank', i: next.i++ })
      pos += BLANK.length
      continue
    }

    const m = FRAC.exec(s.slice(pos))
    if (m) {
      const open1 = pos + m[0].length - 1
      const end1 = closeOf(s, open1)
      let open2 = end1
      while (open2 >= 0 && /\s/.test(s[open2] ?? '')) open2++
      const end2 = end1 >= 0 && s[open2] === '{' ? closeOf(s, open2) : -1
      if (end1 > 0 && end2 > 0) {
        const num = s.slice(open1 + 1, end1 - 1)
        const den = s.slice(open2 + 1, end2 - 1)
        if (num.includes(BLANK) || den.includes(BLANK)) {
          flush()
          // Numerator first, so the boxes are numbered in reading order.
          const n = parse(num, next)
          const d = parse(den, next)
          nodes.push({ t: 'frac', num: n, den: d })
          pos = end2
          continue
        }
        // A whole fraction with no blank in it is ordinary TeX.
        buf += s.slice(pos, end2)
        pos = end2
        continue
      }
    }

    // A backslash takes the next character with it, so `\{` never opens a group.
    if (s[pos] === '\\' && pos + 1 < s.length) {
      buf += s.slice(pos, pos + 2)
      pos += 2
      continue
    }
    buf += s[pos]
    pos++
  }
  flush()
  return nodes
}

/** How many blanks a parsed template holds. */
export function countBlanks(nodes: FillNode[]): number {
  let n = 0
  for (const x of nodes) {
    if (x.t === 'blank') n++
    else if (x.t === 'frac') n += countBlanks(x.num) + countBlanks(x.den)
  }
  return n
}

/** TeX pieces that are not whole formulas: a stray brace or an unclosed
 *  \begin means a blank sat inside a group that this parser does not handle. */
export function brokenPieces(nodes: FillNode[]): string[] {
  const out: string[] = []
  for (const x of nodes) {
    if (x.t === 'tex') {
      const stripped = x.src.replace(/\\[{}]/g, '')
      let depth = 0
      let ok = true
      for (const c of stripped) {
        if (c === '{') depth++
        else if (c === '}' && --depth < 0) ok = false
      }
      const envs = (x.src.match(/\\begin\{/g) ?? []).length - (x.src.match(/\\end\{/g) ?? []).length
      if (!ok || depth !== 0 || envs !== 0) out.push(x.src)
    } else if (x.t === 'frac') {
      out.push(...brokenPieces(x.num), ...brokenPieces(x.den))
    }
  }
  return out
}
