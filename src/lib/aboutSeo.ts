/** The head tags and structured data of the About page, built the same way the articles' are (`articleSeo.ts`): one function, used by the running
 *  page and by the build that writes the static HTML. */

import type { CourseInfo, Lang } from '../content/types'
import { ABOUT } from '../content/about'
import { OTHER, ogDefaultImageUrl, plain, type Seo } from './articleSeo'
import { homeUrl, orgId, organizationNode, websiteId, websiteNode } from './orgSeo'

/** Where the page lives, per language: `/about` and `/tentang`. Two addresses, because to a search engine they are two pages. */
export const ABOUT_PATH: Record<Lang, string> = { en: 'about', id: 'tentang' }

export const aboutUrl = (site: string, lang: Lang) => `${site.replace(/\/+$/, '')}/${ABOUT_PATH[lang]}/`
/** The router path, which has no host. */
export const aboutPath = (lang: Lang) => `/${ABOUT_PATH[lang]}`

export function aboutSeo(site: string, lang: Lang, courses: CourseInfo[]): Seo {
  const canonical = aboutUrl(site, lang)
  const other = OTHER[lang]
  const title = ABOUT.seoTitle[lang]
  const description = ABOUT.description[lang]
  const home = lang === 'id' ? 'Beranda' : 'Home'

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      '@id': canonical + '#webpage',
      url: canonical,
      name: ABOUT.title[lang],
      description,
      inLanguage: lang,
      isPartOf: { '@id': websiteId(site) },
      about: { '@id': orgId(site) },
      mainEntity: { '@id': orgId(site) },
      workTranslation: { '@type': 'AboutPage', inLanguage: other, url: aboutUrl(site, other) },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#quick-answer', '.answerbox > p'] },
    },
    organizationNode(site, lang, courses, canonical),
    websiteNode(site, lang),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: ABOUT.faq.map((f) => ({
        '@type': 'Question',
        name: plain(f.q[lang]),
        acceptedAnswer: { '@type': 'Answer', text: plain(f.a[lang]) },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: home, item: homeUrl(site) },
        { '@type': 'ListItem', position: 2, name: ABOUT.title[lang], item: canonical },
      ],
    },
  ]

  return {
    title,
    description,
    canonical,
    lang,
    image: { url: ogDefaultImageUrl(site), alt: title },
    alternates: { en: aboutUrl(site, 'en'), id: aboutUrl(site, 'id'), 'x-default': aboutUrl(site, 'en') },
    ogType: 'website',
    jsonLd,
    keywords: ABOUT.keywords[lang],
  }
}
