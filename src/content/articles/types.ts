/** Content model for the articles.
 *
 *  An article is a free-standing explainer, not a lesson: anybody may read it,
 *  in any order, without an account. That changes what it has to be good at —
 *  it is found from a search engine or an AI answer, not from a course map —
 *  so the model carries what those readers and crawlers look for: a direct
 *  answer up front, a table of contents, a FAQ that doubles as structured data,
 *  and references.
 *
 *  Everything a reader sees is bilingual (`Loc`), and the two languages get
 *  their own URL slug, because `/artikel/bilangan-real` and
 *  `/articles/real-numbers` are two pages to a search engine and should read
 *  as native ones.
 *
 *  The metadata and the body live in separate modules. The index page and the
 *  search need every article's metadata and none of its text, and the text of
 *  fifty articles is not something to ship to somebody who opened the list. */

import type { Figure } from '../../lib/figure'
import type { Loc, Step } from '../types'

export type ArticleTrack = 'math' | 'code'

/** Names of the interactive widgets an article may embed (see
 *  `components/article/Widgets.tsx`, and `widgets.ts` for what each one is). */
export type WidgetName =
  | 'sets'
  | 'classify'
  | 'decimal'
  | 'repeat'
  | 'sqrt2'
  | 'density'
  | 'interval'
  | 'floats'
  | 'cnconvert'
  | 'cnread'
  | 'grouping'
  | 'rods'
  | 'explaws'
  | 'exppattern'
  | 'simplifyroot'
  | 'rationalise'
  | 'rootexp'
  | 'scinot'
  | 'terms'
  | 'expand'
  | 'evalexpr'
  | 'areamodel'
  | 'factor'
  | 'intline'
  | 'intops'
  | 'divmod'
  | 'divrules'
  | 'primefactor'
  | 'gcdlcm'
  | 'fracbars'
  | 'simplify'
  | 'ratcompare'
  | 'ratops'
  | 'ratdecimal'
  | 'rootcheck'
  | 'surdcalc'
  | 'convergents'
  | 'baseconv'
  | 'binarith'
  | 'bitedit'
  | 'bitops'
  | 'binfrac'
  | 'arithseq'
  | 'arithdetect'
  | 'gauss'
  | 'twoterms'
  | 'geodetect'
  | 'geoseq'
  | 'geotwo'
  | 'geosum'
  | 'quadclassify'
  | 'quadprops'
  | 'quadarea'
  | 'tricheck'
  | 'tripoints'
  | 'trisolve'

export interface ArticleMeta {
  /** Stable key. Never shown; the URL slugs below may change, this may not. */
  id: string
  /** The last path segment, per language: `real-numbers` / `bilangan-real`. */
  slug: Loc
  /** The page's H1. */
  title: Loc
  /** Shorter title for the browser tab and search results when the H1 is long.
   *  Keep it under about 60 characters. */
  seoTitle?: Loc
  /** The meta description and the card text: 120–160 characters, a complete
   *  sentence that says what the reader will know afterward. */
  description: Loc
  track: ArticleTrack
  /** Ids from `tags.ts`. */
  tags: string[]
  level: Loc
  /** Extra words people search for — synonyms, symbols, common misspellings —
   *  comma-separated. This is what the search matches on besides the title,
   *  the description and the tags. */
  keywords: Loc
  /** ISO dates, `YYYY-MM-DD`. `updated` is what `dateModified` says, so bump it
   *  when the content really changes and not otherwise. */
  published: string
  updated: string
  /** Whole minutes, at about 200 words a minute, activities not counted. */
  readingMinutes: number
  /** The things the article is about, each tied to an authoritative page that
   *  defines it (a Wikipedia article is the usual choice). This is what lets a
   *  search or answer engine connect the page to the *entity* rather than to a
   *  string of words, and it becomes `about` in the Article markup. */
  about?: { name: Loc; sameAs: Loc }[]
}

export type CalloutTone = 'definition' | 'tip' | 'warning' | 'note'

export type ArticleBlock =
  /** Prose, with the lesson text's formatting: paragraphs, `- ` lists,
   *  `1. ` lists, `| tables |`, `**bold**`, `` `code` `` and `$math$`. */
  | { kind: 'text'; text: Loc }
  | { kind: 'callout'; tone: CalloutTone; title: Loc; text: Loc }
  | { kind: 'figure'; figure: Figure }
  | { kind: 'code'; lang: 'python' | 'javascript'; code: string; caption?: Loc }
  /** One of the lesson step types, used as a practice item with no hearts and
   *  no XP — a wrong answer costs nothing here. */
  | { kind: 'activity'; title: Loc; step: Step }
  | { kind: 'widget'; name: WidgetName }

export interface ArticleSection {
  /** Anchor id, the same in both languages (it is part of the URL fragment). */
  id: string
  heading: Loc
  blocks: ArticleBlock[]
}

export interface ArticleFaq {
  q: Loc
  /** Plain prose — no lists or tables — because it is also what goes into the
   *  FAQPage markup, and an answer there has to read as one piece of text. */
  a: Loc
}

export interface ArticleReference {
  title: string
  author?: string
  year?: number
  /** Publisher or journal. */
  source?: string
  url?: string
}

export interface ArticleBody {
  /** The direct answer, in two or three sentences. It sits at the top of the
   *  page and is the first thing an AI answer or a featured snippet can quote,
   *  so it must stand on its own. */
  answer: Loc
  /** Takeaways, one sentence each. */
  keyPoints: Loc[]
  sections: ArticleSection[]
  faq: ArticleFaq[]
  references: ArticleReference[]
  /** Short definitions of the terms the article introduces. A definition that
   *  stands alone is the unit an answer engine quotes, so each one is a full
   *  sentence that does not depend on the text around it. Becomes a
   *  DefinedTermSet. */
  glossary?: { term: Loc; definition: Loc }[]
  /** Procedures the article teaches, as numbered steps. Each must also appear
   *  on the page as visible text: markup that is not on the page is ignored at
   *  best and penalized at worst. Becomes HowTo markup. */
  howTo?: { name: Loc; description: Loc; steps: { name: Loc; text: Loc }[] }[]
  /** Ids of other articles worth reading next. */
  related?: string[]
}

export type Article = ArticleMeta & ArticleBody
