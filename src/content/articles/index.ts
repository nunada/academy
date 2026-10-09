/** The article catalogue.
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

export const ARTICLES: ArticleMeta[] = [exponentsAndRadicals, chineseNumbers, realNumbers]

const BODIES: Record<string, () => Promise<{ body: ArticleBody }>> = {
  'real-numbers': () => import('./real-numbers'),
  'chinese-numbers': () => import('./chinese-numbers'),
  'exponents-and-radicals': () => import('./exponents-and-radicals'),
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
