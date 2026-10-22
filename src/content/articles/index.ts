/** The article catalog.
 *
 *  Metadata is imported eagerly: the list page and the search need all of it and
 *  it is small. A body is a dynamic import, so opening one article downloads one
 *  article. To add an article, write `<id>.meta.ts` and `<id>.ts` beside this
 *  file, then add one line to each of the two tables below — and run
 *  `npm run check:articles`, which refuses an article that is missing a piece.
 *  Newest first: the list shows them in this order when there is no search. */

import type { Lang } from '../types'
import type { Article, ArticleBody, ArticleMeta } from './types'
import { meta as realNumbers } from './real-numbers.meta'
import { meta as chineseNumbers } from './chinese-numbers.meta'
import { meta as exponentsAndRadicals } from './exponents-and-radicals.meta'
import { meta as algebraicExpressions } from './algebraic-expressions.meta'
import { meta as integers } from './integers.meta'
import { meta as rationalNumbers } from './rational-numbers.meta'
import { meta as irrationalNumbers } from './irrational-numbers.meta'
import { meta as binaryNumbers } from './binary-numbers.meta'
import { meta as arithmeticSequences } from './arithmetic-sequences-and-series.meta'
import { meta as geometricSequences } from './geometric-sequences-and-series.meta'
import { meta as quadrilaterals } from './quadrilaterals.meta'
import { meta as triangles } from './triangles.meta'
import { meta as circles } from './circles.meta'
import { meta as pythagoreanTheorem } from './pythagorean-theorem.meta'
import { meta as tangentLines } from './tangent-lines-and-derivative-at-a-point.meta'
import { meta as derivativeFunction } from './the-derivative-as-a-function.meta'
import { meta as differentiationRules } from './differentiation-rules.meta'
import { meta as rateOfChange } from './the-derivative-as-a-rate-of-change.meta'
import { meta as trigDerivatives } from './derivatives-of-trigonometric-functions.meta'
import { meta as chainRule } from './the-chain-rule.meta'
import { meta as implicitDiff } from './implicit-differentiation.meta'
import { meta as inverseLogs } from './derivatives-of-inverse-functions-and-logarithms.meta'
import { meta as inverseTrig } from './inverse-trigonometric-functions.meta'
import { meta as relatedRates } from './related-rates.meta'
import { meta as linearization } from './linearization-and-differentials.meta'
import { meta as extremeValues } from './extreme-values-on-closed-intervals.meta'
import { meta as meanValue } from './the-mean-value-theorem.meta'
import { meta as monotonic } from './monotonic-functions-and-the-first-derivative-test.meta'
import { meta as concavity } from './concavity-and-curve-sketching.meta'
import { meta as lhopital } from './indeterminate-forms-and-lhopitals-rule.meta'
import { meta as optimization } from './applied-optimization.meta'
import { meta as newtonsMethod } from './newtons-method.meta'
import { meta as floatingPoint } from './floating-point-numbers.meta'
import { meta as bigO } from './big-o-notation.meta'
import { meta as binarySearch } from './binary-search-and-sorting.meta'
import { meta as fibonacci } from './fibonacci-numbers.meta'

export const ARTICLES: ArticleMeta[] = [fibonacci, binarySearch, bigO, floatingPoint, newtonsMethod, optimization, lhopital, concavity, monotonic, meanValue, extremeValues, linearization, relatedRates, inverseTrig, inverseLogs, implicitDiff, chainRule, trigDerivatives, rateOfChange, differentiationRules, derivativeFunction, tangentLines, pythagoreanTheorem, circles, triangles, quadrilaterals, geometricSequences, arithmeticSequences, binaryNumbers, irrationalNumbers, rationalNumbers, integers, algebraicExpressions, exponentsAndRadicals, chineseNumbers, realNumbers]

const BODIES: Record<string, () => Promise<{ body: ArticleBody }>> = {
  'real-numbers': () => import('./real-numbers'),
  'chinese-numbers': () => import('./chinese-numbers'),
  'exponents-and-radicals': () => import('./exponents-and-radicals'),
  'algebraic-expressions': () => import('./algebraic-expressions'),
  integers: () => import('./integers'),
  'rational-numbers': () => import('./rational-numbers'),
  'irrational-numbers': () => import('./irrational-numbers'),
  'binary-numbers': () => import('./binary-numbers'),
  'arithmetic-sequences-and-series': () => import('./arithmetic-sequences-and-series'),
  'geometric-sequences-and-series': () => import('./geometric-sequences-and-series'),
  quadrilaterals: () => import('./quadrilaterals'),
  triangles: () => import('./triangles'),
  circles: () => import('./circles'),
  'pythagorean-theorem': () => import('./pythagorean-theorem'),
  'tangent-lines-and-derivative-at-a-point': () => import('./tangent-lines-and-derivative-at-a-point'),
  'the-derivative-as-a-function': () => import('./the-derivative-as-a-function'),
  'differentiation-rules': () => import('./differentiation-rules'),
  'derivatives-of-trigonometric-functions': () => import('./derivatives-of-trigonometric-functions'),
  'the-chain-rule': () => import('./the-chain-rule'),
  'implicit-differentiation': () => import('./implicit-differentiation'),
  'derivatives-of-inverse-functions-and-logarithms': () => import('./derivatives-of-inverse-functions-and-logarithms'),
  'inverse-trigonometric-functions': () => import('./inverse-trigonometric-functions'),
  'related-rates': () => import('./related-rates'),
  'linearization-and-differentials': () => import('./linearization-and-differentials'),
  'extreme-values-on-closed-intervals': () => import('./extreme-values-on-closed-intervals'),
  'the-mean-value-theorem': () => import('./the-mean-value-theorem'),
  'concavity-and-curve-sketching': () => import('./concavity-and-curve-sketching'),
  'indeterminate-forms-and-lhopitals-rule': () => import('./indeterminate-forms-and-lhopitals-rule'),
  'applied-optimization': () => import('./applied-optimization'),
  'newtons-method': () => import('./newtons-method'),
  'floating-point-numbers': () => import('./floating-point-numbers'),
  'big-o-notation': () => import('./big-o-notation'),
  'binary-search-and-sorting': () => import('./binary-search-and-sorting'),
  'fibonacci-numbers': () => import('./fibonacci-numbers'),
  'monotonic-functions-and-the-first-derivative-test': () => import('./monotonic-functions-and-the-first-derivative-test'),
  'the-derivative-as-a-rate-of-change': () => import('./the-derivative-as-a-rate-of-change'),
}

export const articleById = (id: string): ArticleMeta | undefined => ARTICLES.find((a) => a.id === id)

/** The article behind a URL slug, in the language the URL is for. */
export const articleBySlug = (lang: Lang, slug: string): ArticleMeta | undefined =>
  ARTICLES.find((a) => a.slug[lang] === slug)

export async function loadArticle(id: string): Promise<Article | null> {
  const m = articleById(id)
  const load = BODIES[id]
  if (!m || !load) return null
  const { body } = await load()
  return { ...m, ...body }
}

/** Every id that has both a meta entry and a body loader, for the checker. */
export const bodyIds = (): string[] => Object.keys(BODIES)
