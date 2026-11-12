/** Page view counts: the parts that need no React and no database.
 *
 *  A view is one visit to an article or a game page. It is counted once per browser session per page, so reloading
 *  or going back and forth does not add to it, and it is not counted for visitors that say they are robots. No
 *  cookie is set and nothing about the visitor is sent: only the kind of page and its address, which is the id of
 *  the article or the game and so the same in both languages. */

import type { Lang } from '../content/types'

export type ViewKind = 'article' | 'game'

/** What the database accepts as an address (`supabase/views.sql` has the same pattern). */
export const VIEW_SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/

export const isViewKey = (kind: string, slug: string): kind is ViewKind => (kind === 'article' || kind === 'game') && VIEW_SLUG.test(slug)

/** "1,234" in English, "1.234" in Indonesian. */
export function formatViews(n: number, lang: Lang): string {
  return Math.max(0, Math.floor(n)).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')
}

/** "1,234 views" / "1 view" / "1.234 dilihat". */
export function viewsLabel(n: number, lang: Lang): string {
  const f = formatViews(n, lang)
  return lang === 'id' ? `${f} dilihat` : `${f} ${n === 1 ? 'view' : 'views'}`
}

/** Crawlers, headless browsers and tools that announce themselves are read, not counted. */
export function looksLikeRobot(nav: { userAgent?: string; webdriver?: boolean } | undefined): boolean {
  if (!nav) return false
  if (nav.webdriver === true) return true
  return /bot|crawl|spider|slurp|headless|lighthouse|prerender|facebookexternalhit/i.test(nav.userAgent ?? '')
}

type Store = Pick<Storage, 'getItem' | 'setItem'>

/** True the first time a page is seen in this session, false after. Session storage remembers across navigations;
 *  `seen` is the fallback for a browser that has none (a private window), so one page load never counts twice. */
export function firstViewInSession(store: Store | null, kind: ViewKind, slug: string, seen: Set<string>): boolean {
  const k = `nunada.viewed.${kind}.${slug}`
  if (seen.has(k)) return false
  seen.add(k)
  try {
    if (store) {
      if (store.getItem(k)) return false
      store.setItem(k, '1')
    }
  } catch {
    /* no storage: the set above is all there is */
  }
  return true
}
