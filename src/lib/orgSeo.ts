/** The structured data that says what Nunada Academy *is*: the organization, the website, and the courses it offers.
 *
 *  An engine does not understand a site from its pages one at a time. It builds an entity (a thing with a name, a logo, a set of subjects, links
 *  to the same thing elsewhere) and attaches pages to it, and the way to make that entity unambiguous is to describe it once with a stable `@id`
 *  and refer to that id everywhere else. So the full description is written here, appears on the home page and the About page, and every
 *  article's author and publisher is just a reference to `/#organization`.
 *
 *  Pure functions with no DOM and no React, like `articleSeo.ts`: the page sets these tags once it is running, and the build writes them into
 *  static HTML for crawlers that run no script. Everything else comes in as arguments (the catalog is passed in rather than imported, so this
 *  file does not drag the course loaders into whatever uses it). */

import type { CourseInfo, Lang } from '../content/types'
import { ORG, SUBJECTS } from '../content/org'

const root = (site: string) => site.replace(/\/+$/, '')
export const homeUrl = (site: string) => root(site) + '/'

/** Stable identifiers: the same string on every page, so every mention is the same entity. */
export const orgId = (site: string) => root(site) + '/#organization'
export const websiteId = (site: string) => root(site) + '/#website'

/** A reference to the organization, for `author` and `publisher`: the id ties it to the full description, the name and url are there for readers
 *  that do not follow ids. */
export function orgRef(site: string) {
  return { '@type': 'Organization', '@id': orgId(site), name: ORG.name, url: homeUrl(site) }
}

const logoUrl = (site: string) => `${root(site)}/${ORG.logo.path}`

/** One course, as an offer of the organization. Courses live behind a sign-in, so the address given is the About page's own anchor for the course
 *  (a real place on a real page), not the sign-in-only course map. */
function courseNode(site: string, lang: Lang, c: CourseInfo, aboutUrl: string) {
  return {
    '@type': 'Course',
    name: c.title[lang],
    description: c.tagline[lang],
    url: `${aboutUrl}#course-${c.id}`,
    provider: { '@id': orgId(site) },
    inLanguage: [...ORG.languages],
    educationalLevel: c.level[lang],
    courseMode: 'online',
  }
}

/** The organization in full. `aboutUrl` is where the course anchors are. */
export function organizationNode(site: string, lang: Lang, courses: CourseInfo[], aboutUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'Organization'],
    '@id': orgId(site),
    name: ORG.name,
    alternateName: ORG.alternateName,
    url: homeUrl(site),
    description: ORG.description[lang],
    slogan: ORG.slogan[lang],
    logo: { '@type': 'ImageObject', url: logoUrl(site), width: ORG.logo.size, height: ORG.logo.size },
    image: logoUrl(site),
    sameAs: ORG.sameAs,
    knowsLanguage: [...ORG.languages],
    // What it teaches, as things an engine already knows, each tied to the page that defines it.
    knowsAbout: SUBJECTS.map((s) => ({ '@type': 'Thing', name: s.name[lang], sameAs: s.sameAs })),
    founder: ORG.founder ? { '@type': 'Person', name: ORG.founder.name, url: ORG.founder.url } : undefined,
    email: ORG.email,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: lang === 'id' ? 'Kursus Nunada Academy' : 'Nunada Academy courses',
      itemListElement: courses.filter((c) => c.available).map((c) => courseNode(site, lang, c, aboutUrl)),
    },
  }
}

/** The website, published by the organization. */
export function websiteNode(site: string, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(site),
    url: homeUrl(site),
    name: ORG.name,
    alternateName: ORG.alternateName,
    description: ORG.description[lang],
    inLanguage: [...ORG.languages],
    publisher: { '@id': orgId(site) },
  }
}
