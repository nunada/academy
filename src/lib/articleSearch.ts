/** Search across the article list, in the browser.
 *
 *  Built for a catalogue of a few hundred articles, not a few: the index is made
 *  once, a query is a pass over pre-tokenised fields with no regular expressions
 *  in the loop, and the work is cut short for the ones that cannot match.
 *
 *  What it matches on is each article's *metadata* — title, description, tags,
 *  and the hand-written `keywords` (synonyms, symbols, misspellings). The body
 *  text is deliberately not in the index: shipping every article's full text to
 *  somebody who opened the list is the cost this design avoids. If full-text
 *  search is ever wanted, the place to add it is a `body` field in `SearchDoc`
 *  filled from a build-time extract, at a low weight.
 *
 *  Matching is forgiving in the ways people are sloppy: case and accents do not
 *  matter, a word may be typed as just its start ("irrat" finds "irrational"),
 *  and a word of four or more letters may be one typo away ("ration" is a prefix,
 *  "irrationl", missing an "a", is not, and still finds it). Every word of the query has to match
 *  somewhere, so adding words narrows the list. */

export interface SearchDoc {
  id: string
  title: string
  description: string
  tags: string[]
  keywords: string
}

type Field = 'title' | 'tags' | 'keywords' | 'description'

/** How much a hit in each field is worth. A word in the title says what the
 *  article is about; a word in the description only says it is mentioned. */
const WEIGHT: Record<Field, number> = { title: 10, tags: 8, keywords: 6, description: 3 }

interface Entry {
  id: string
  fields: Record<Field, string[]>
  /** The title, normalised, for matching a phrase typed in order. */
  titleText: string
}

export interface SearchIndex {
  entries: Entry[]
}

export interface SearchHit {
  id: string
  score: number
  /** Which fields the query matched in, best first — for a "matched in…" hint. */
  matched: Field[]
}

/** Lower-case, strip accents, and turn everything that is not a letter or digit
 *  into a space. The same function runs over the documents and the query, so
 *  they can only ever disagree about meaning, never about spelling. */
export function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

export const tokenise = (s: string): string[] => {
  const n = normalise(s)
  return n ? n.split(' ') : []
}

export function buildIndex(docs: SearchDoc[]): SearchIndex {
  return {
    entries: docs.map((d) => ({
      id: d.id,
      titleText: normalise(d.title),
      fields: {
        title: tokenise(d.title),
        tags: d.tags.flatMap(tokenise),
        keywords: tokenise(d.keywords),
        description: tokenise(d.description),
      },
    })),
  }
}

/** True when `a` and `b` differ by at most one insertion, deletion, substitution
 *  or swap of neighbours. Cheaper than a full edit distance, and it is the only
 *  distance this needs. */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true
  const la = a.length
  const lb = b.length
  if (Math.abs(la - lb) > 1) return false
  let i = 0
  while (i < la && i < lb && a[i] === b[i]) i++
  if (i === la || i === lb) return true // one is the other plus a letter
  if (la === lb) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true // substitution
    if (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2)) return true // swap
    return false
  }
  return la > lb ? a.slice(i + 1) === b.slice(i) : b.slice(i + 1) === a.slice(i)
}

/** The best score one query word earns against one field's words: a whole-word
 *  match counts fully, the start of a word 70%, a typo 45%. */
function wordScore(q: string, words: string[], fuzzy: boolean): number {
  let best = 0
  for (const w of words) {
    if (w === q) return 1
    if (w.startsWith(q)) best = Math.max(best, 0.7)
    else if (fuzzy && Math.abs(w.length - q.length) <= 1 && withinOneEdit(q, w)) best = Math.max(best, 0.45)
  }
  return best
}

export function search(index: SearchIndex, query: string): SearchHit[] {
  const words = tokenise(query)
  if (!words.length) return []
  const phrase = words.join(' ')
  const hits: SearchHit[] = []

  for (const e of index.entries) {
    let total = 0
    const matched = new Map<Field, number>()
    let all = true

    for (const q of words) {
      const fuzzy = q.length >= 4
      let bestForWord = 0
      let bestField: Field | null = null
      for (const f of Object.keys(WEIGHT) as Field[]) {
        const s = wordScore(q, e.fields[f], fuzzy) * WEIGHT[f]
        if (s > bestForWord) {
          bestForWord = s
          bestField = f
        }
      }
      if (bestForWord === 0 || !bestField) {
        all = false
        break
      }
      total += bestForWord
      matched.set(bestField, (matched.get(bestField) ?? 0) + bestForWord)
    }
    if (!all) continue

    // The whole query appearing in order in the title is a better answer than
    // the same words scattered about.
    if (words.length > 1 && e.titleText.includes(phrase)) total += 12
    hits.push({
      id: e.id,
      score: total,
      matched: [...matched.entries()].sort((a, b) => b[1] - a[1]).map(([f]) => f),
    })
  }
  return hits.sort((a, b) => b.score - a.score)
}
