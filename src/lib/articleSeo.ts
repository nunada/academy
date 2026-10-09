/** Everything a search engine or an AI answer engine reads about an article,
 *  built from the article itself.
 *
 *  Pure functions with no DOM and no React, because two places need the same
 *  answer: the page sets these tags once it is running (`useSeo`), and the build
 *  script writes them into a static HTML file for every article
 *  (`tools/prerender-articles.mjs`) so a crawler that does not run JavaScript —
 *  most AI crawlers do not — still gets the title, the description, the
 *  structured data and the article's text. Two builders would drift apart; one
 *  cannot. */

import type { Lang, Loc } from '../content/types'
import type { Article, ArticleMeta } from '../content/articles/types'

export const SITE_NAME = 'Nunada Academy'

/** Path of the article list, per language. */
export const LIST_PATH: Record<Lang, string> = { en: 'articles', id: 'artikel' }

export const OTHER: Record<Lang, Lang> = { en: 'id', id: 'en' }

export const LOCALE: Record<Lang, string> = { en: 'en_US', id: 'id_ID' }

const join = (...parts: string[]) => parts.map((p, i) => (i === 0 ? p.replace(/\/+$/, '') : p.replace(/^\/+|\/+$/g, ''))).filter(Boolean).join('/')

/** `https://host/base/articles/real-numbers/`. The trailing slash is on purpose:
 *  the build writes each article as a folder with an index.html, and a static host
 *  answers the slash-less address with a redirect to this one. The canonical link
 *  must be the address that answers 200, or it points a crawler round in a circle. */
export function articleUrl(site: string, lang: Lang, m: Pick<ArticleMeta, 'slug'>): string {
  return join(site, LIST_PATH[lang], m.slug[lang]) + '/'
}
export const listUrl = (site: string, lang: Lang) => join(site, LIST_PATH[lang]) + '/'

/** The router path, which has no host: `/articles/real-numbers`. */
export const articlePath = (lang: Lang, m: Pick<ArticleMeta, 'slug'>) => `/${LIST_PATH[lang]}/${m.slug[lang]}`
export const listPath = (lang: Lang) => `/${LIST_PATH[lang]}`

const pick = (l: Loc, lang: Lang) => l[lang]

/** The `<title>`: the SEO title when there is one, with the site name after it
 *  unless that would push it past what a results page shows (about 60 characters). */
export function pageTitle(m: ArticleMeta, lang: Lang): string {
  const base = m.seoTitle ? pick(m.seoTitle, lang) : pick(m.title, lang)
  const withSite = `${base} | ${SITE_NAME}`
  return withSite.length <= 62 ? withSite : base
}

export interface Seo {
  title: string
  description: string
  canonical: string
  lang: Lang
  /** hreflang → URL, including `x-default`. */
  alternates: Record<string, string>
  ogType: 'article' | 'website'
  jsonLd: object[]
  published?: string
  modified?: string
  keywords?: string
}

export function listSeo(site: string, lang: Lang): Seo {
  const title =
    lang === 'id'
      ? `Artikel Matematika dan Coding | ${SITE_NAME}`
      : `Math and Coding Articles | ${SITE_NAME}`
  const description =
    lang === 'id'
      ? 'Artikel gratis tentang matematika dan coding: penjelasan lengkap dengan daftar isi, aktivitas interaktif, dan FAQ. Bisa dibaca urut maupun acak.'
      : 'Free articles on mathematics and coding: complete explanations with a table of contents, interactive activities and a FAQ. Read them in any order.'
  const canonical = listUrl(site, lang)
  return {
    title,
    description,
    canonical,
    lang,
    alternates: { en: listUrl(site, 'en'), id: listUrl(site, 'id'), 'x-default': listUrl(site, 'en') },
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url: canonical,
        inLanguage: lang,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: site },
      },
      breadcrumbs(site, lang, null),
    ],
  }
}

function breadcrumbs(site: string, lang: Lang, a: ArticleMeta | null) {
  const home = lang === 'id' ? 'Beranda' : 'Home'
  const list = lang === 'id' ? 'Artikel' : 'Articles'
  const items = [
    { name: home, url: site.replace(/\/+$/, '') + '/' },
    { name: list, url: listUrl(site, lang) },
  ]
  if (a) items.push({ name: pick(a.title, lang), url: articleUrl(site, lang, a) })
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  }
}

/** Plain text of a piece of formatted prose: markup and TeX delimiters removed,
 *  so it is safe inside JSON-LD and reads as a sentence. */
export function plain(text: string): string {
  return text
    .replace(/\$\$?([^$]+)\$\$?/g, (_, tex: string) => texToText(tex))
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

const TEX_SYMBOLS: Record<string, string> = {
  pi: 'π', times: '×', cdot: '·', div: '÷', pm: '±', neq: '≠', leq: '≤', geq: '≥', approx: '≈', infty: '∞',
  in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆', cup: '∪', cap: '∩', Rightarrow: '⇒', to: '→', ldots: '…', cdots: '…',
  sqrt: '√', mid: '|', quad: ' ', qquad: ' ', alpha: 'α', beta: 'β', varphi: 'φ', phi: 'φ', theta: 'θ',
}

/** A readable one-line version of a TeX formula, for text-only readers. Not a
 *  renderer: it handles what the articles write — fractions, roots, powers,
 *  the number-set letters — and leaves anything else as it is. */
export function texToText(tex: string): string {
  let s = tex
  s = s.replace(/\\mathbb\{([A-Z])\}/g, (_, c: string) => ({ N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ', C: 'ℂ' } as Record<string, string>)[c] ?? c)
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
    s = s.replace(/\\sqrt\[(\w+)\]\{([^{}]*)\}/g, '$2^(1/$1)')
    s = s.replace(/\\sqrt\{([^{}]*)\}/g, '√($1)')
    s = s.replace(/\\overline\{([^{}]*)\}/g, '($1 repeating)')
    s = s.replace(/\\text\{([^{}]*)\}/g, '$1')
    s = s.replace(/\^\{([^{}]*)\}/g, '^$1').replace(/_\{([^{}]*)\}/g, '_$1')
  }
  s = s.replace(/\\([A-Za-z]+)/g, (m, name: string) => TEX_SYMBOLS[name] ?? m)
  s = s.replace(/\\[,;: !]/g, ' ').replace(/[{}]/g, '').replace(/\s+/g, ' ')
  // "(3)/(4)" is noise for a single digit or letter.
  s = s.replace(/\((\w)\)\/\((\w)\)/g, '$1/$2').replace(/√\((\w)\)/g, '√$1')
  return s.trim()
}

export function articleSeo(a: Article, site: string, lang: Lang): Seo {
  const canonical = articleUrl(site, lang, a)
  const other = OTHER[lang]
  const url = (l: Lang) => articleUrl(site, l, a)
  const title = pageTitle(a, lang)
  const description = pick(a.description, lang)
  const faq = a.faq.map((f) => ({
    '@type': 'Question',
    name: plain(pick(f.q, lang)),
    acceptedAnswer: { '@type': 'Answer', text: plain(pick(f.a, lang)) },
  }))

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      // `TechArticle` would be for software docs; this is an explainer, and
      // `Article` with `LearningResource` fields says so more truthfully.
      '@type': ['Article', 'LearningResource'],
      headline: pick(a.title, lang),
      alternativeHeadline: a.seoTitle ? pick(a.seoTitle, lang) : undefined,
      description,
      abstract: plain(pick(a.answer, lang)),
      inLanguage: lang,
      url: canonical,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      datePublished: a.published,
      dateModified: a.updated,
      author: { '@type': 'Organization', name: SITE_NAME, url: site },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: site },
      keywords: pick(a.keywords, lang),
      articleSection: a.track === 'math' ? (lang === 'id' ? 'Matematika' : 'Mathematics') : 'Coding',
      timeRequired: `PT${a.readingMinutes}M`,
      learningResourceType: lang === 'id' ? 'Artikel penjelasan dengan latihan interaktif' : 'Explainer article with interactive practice',
      educationalLevel: pick(a.level, lang),
      isAccessibleForFree: true,
      // The entities the page is about, tied to a page that defines each: this is
      // what lets an engine connect the article to the idea, not just the words.
      about: a.about?.map((x) => ({ '@type': 'Thing', name: pick(x.name, lang), sameAs: pick(x.sameAs, lang) })),
      // The parts a voice assistant may read aloud: the direct answer.
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#quick-answer', '.answerbox > p'] },
      isPartOf: { '@type': 'Blog', name: lang === 'id' ? `Artikel ${SITE_NAME}` : `${SITE_NAME} Articles`, url: listUrl(site, lang) },
      workTranslation: { '@type': 'Article', inLanguage: other, url: url(other) },
      citation: a.references.map((r) => ({
        '@type': 'CreativeWork',
        name: r.title,
        author: r.author ? { '@type': 'Person', name: r.author } : undefined,
        datePublished: r.year ? String(r.year) : undefined,
        publisher: r.source ? { '@type': 'Organization', name: r.source } : undefined,
        url: r.url,
      })),
    },
    breadcrumbs(site, lang, a),
  ]
  if (faq.length) jsonLd.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq })
  for (const h of a.howTo ?? []) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: pick(h.name, lang),
      description: pick(h.description, lang),
      inLanguage: lang,
      step: h.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: plain(pick(s.name, lang)), text: plain(pick(s.text, lang)) })),
    })
  }
  if (a.glossary?.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: lang === 'id' ? `Glosarium: ${pick(a.title, lang)}` : `Glossary: ${pick(a.title, lang)}`,
      inLanguage: lang,
      hasDefinedTerm: a.glossary.map((g) => ({
        '@type': 'DefinedTerm',
        name: plain(pick(g.term, lang)),
        description: plain(pick(g.definition, lang)),
        inDefinedTermSet: canonical,
      })),
    })
  }

  return {
    title,
    description,
    canonical,
    lang,
    alternates: { [lang]: url(lang), [other]: url(other), 'x-default': url('en') },
    ogType: 'article',
    jsonLd,
    published: a.published,
    modified: a.updated,
    keywords: pick(a.keywords, lang),
  }
}

/** JSON-LD as the text of a `<script>` element. `undefined` fields are dropped
 *  by JSON.stringify; `<` is escaped so the text can never close the script. */
export const jsonLdText = (data: object): string => JSON.stringify(data).replace(/</g, '\\u003c')
