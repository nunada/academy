/** The head tags and structured data of the Games section, built the same way the articles' and the About page's are: one function, used by the running
 *  page and by the build that writes the static HTML. */

import type { Lang } from '../content/types'
import { GAMES, GAMES_PAGE, type GameMeta } from '../content/games'
import { OTHER, SITE_NAME, ogDefaultImageUrl, plain, type Seo } from './articleSeo'
import { homeUrl, orgRef, websiteId } from './orgSeo'

/** Where the games live, per language: /games and /permainan. Two addresses, because to a search engine they are two pages. */
export const GAMES_PATH: Record<Lang, string> = { en: 'games', id: 'permainan' }

const root = (site: string) => site.replace(/\/+$/, '')
export const gamesUrl = (site: string, lang: Lang) => `${root(site)}/${GAMES_PATH[lang]}/`
export const gameUrl = (site: string, lang: Lang, g: Pick<GameMeta, 'slug'>) => `${root(site)}/${GAMES_PATH[lang]}/${g.slug[lang]}/`
/** The router paths, which have no host. */
export const gamesPath = (lang: Lang) => `/${GAMES_PATH[lang]}`
export const gamePath = (lang: Lang, g: Pick<GameMeta, 'slug'>) => `/${GAMES_PATH[lang]}/${g.slug[lang]}`

const withSite = (base: string) => (`${base} | ${SITE_NAME}`.length <= 62 ? `${base} | ${SITE_NAME}` : base)

function breadcrumbs(site: string, lang: Lang, g: GameMeta | null) {
  const items = [
    { name: lang === 'id' ? 'Beranda' : 'Home', url: homeUrl(site) },
    { name: GAMES_PAGE.title[lang], url: gamesUrl(site, lang) },
  ]
  if (g) items.push({ name: g.title[lang], url: gameUrl(site, lang, g) })
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  }
}

export function gamesSeo(site: string, lang: Lang): Seo {
  const canonical = gamesUrl(site, lang)
  const title = withSite(GAMES_PAGE.seoTitle[lang])
  const description = GAMES_PAGE.description[lang]
  return {
    title,
    description,
    canonical,
    lang,
    image: { url: ogDefaultImageUrl(site), alt: title },
    alternates: { en: gamesUrl(site, 'en'), id: gamesUrl(site, 'id'), 'x-default': gamesUrl(site, 'en') },
    ogType: 'website',
    keywords: GAMES_PAGE.keywords[lang],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': canonical + '#webpage',
        name: GAMES_PAGE.title[lang],
        description,
        url: canonical,
        inLanguage: lang,
        isPartOf: { '@id': websiteId(site) },
        hasPart: GAMES.map((g) => ({ '@type': 'Game', name: g.title[lang], url: gameUrl(site, lang, g) })),
      },
      breadcrumbs(site, lang, null),
    ],
  }
}

export function gameSeo(g: GameMeta, site: string, lang: Lang): Seo {
  const canonical = gameUrl(site, lang, g)
  const other = OTHER[lang]
  const title = withSite(g.seoTitle[lang])
  const description = g.description[lang]
  return {
    title,
    description,
    canonical,
    lang,
    image: { url: ogDefaultImageUrl(site), alt: title },
    alternates: { en: gameUrl(site, 'en', g), id: gameUrl(site, 'id', g), 'x-default': gameUrl(site, 'en', g) },
    ogType: 'website',
    published: g.published,
    modified: g.updated,
    keywords: g.keywords[lang],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': ['Game', 'LearningResource'],
        '@id': canonical + '#game',
        name: g.title[lang],
        description,
        url: canonical,
        inLanguage: lang,
        genre: 'Educational card game',
        keywords: g.keywords[lang],
        learningResourceType: 'game',
        interactivityType: 'active',
        isAccessibleForFree: true,
        teaches: g.teaches.map((t) => t[lang]),
        datePublished: g.published,
        dateModified: g.updated,
        numberOfPlayers: { '@type': 'QuantitativeValue', value: 1 },
        author: orgRef(site),
        publisher: orgRef(site),
        isPartOf: { '@id': websiteId(site) },
        workTranslation: { '@type': 'Game', inLanguage: other, url: gameUrl(site, other, g) },
        mainEntityOfPage: { '@id': canonical },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: g.faq.map((f) => ({
          '@type': 'Question',
          name: plain(f.q[lang]),
          acceptedAnswer: { '@type': 'Answer', text: plain(f.a[lang]) },
        })),
      },
      breadcrumbs(site, lang, g),
    ],
  }
}
