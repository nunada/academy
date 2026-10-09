import { useEffect } from 'react'
import { LOCALE, SITE_NAME, jsonLdText, type Seo } from './articleSeo'

/** The site's own URL, without a trailing slash: the origin plus Vite's base
 *  (`/` locally, `/academy/` on a GitHub Pages project site). Read at run time,
 *  so a canonical link is right on whatever host the app is served from. */
export function siteUrl(): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  return `${window.location.origin}${base}`
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): () => void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  const created = !el
  const before = el?.getAttribute('content') ?? null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return () => {
    if (!el) return
    if (created) el.remove()
    else if (before !== null) el.setAttribute('content', before)
  }
}

/** Puts a page's SEO tags into the document head while it is on screen and takes
 *  them out again when it leaves — title, description, canonical, hreflang,
 *  Open Graph, Twitter and the JSON-LD blocks.
 *
 *  The same tags are already in the static HTML the build writes for each
 *  article, which is what crawlers that do not run scripts read. This is for
 *  everyone else: a reader who navigated here inside the app, whose tab title
 *  and shared link should match the page they are looking at. */
export function useSeo(seo: Seo | null) {
  const key = seo ? JSON.stringify([seo.title, seo.canonical, seo.lang]) : ''
  useEffect(() => {
    if (!seo) return
    const undo: (() => void)[] = []
    const added: Element[] = []
    const add = (el: Element) => {
      el.setAttribute('data-seo', '1')
      document.head.appendChild(el)
      added.push(el)
    }

    // A pre-rendered page ships these same tags marked `data-seo`; drop them so
    // the running page owns the head and nothing is there twice.
    document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove())

    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = seo.title
    document.documentElement.lang = seo.lang

    undo.push(upsertMeta('name', 'description', seo.description))
    if (seo.keywords) undo.push(upsertMeta('name', 'keywords', seo.keywords))
    undo.push(upsertMeta('property', 'og:title', seo.title))
    undo.push(upsertMeta('property', 'og:description', seo.description))
    undo.push(upsertMeta('property', 'og:type', seo.ogType))
    undo.push(upsertMeta('property', 'og:url', seo.canonical))
    undo.push(upsertMeta('property', 'og:site_name', SITE_NAME))
    undo.push(upsertMeta('property', 'og:locale', LOCALE[seo.lang]))
    undo.push(upsertMeta('name', 'twitter:card', 'summary'))
    undo.push(upsertMeta('name', 'twitter:title', seo.title))
    undo.push(upsertMeta('name', 'twitter:description', seo.description))
    if (seo.published) undo.push(upsertMeta('property', 'article:published_time', seo.published))
    if (seo.modified) undo.push(upsertMeta('property', 'article:modified_time', seo.modified))

    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = seo.canonical
    add(canonical)

    for (const [lang, href] of Object.entries(seo.alternates)) {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = lang
      link.href = href
      add(link)
    }

    for (const block of seo.jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = jsonLdText(block)
      add(script)
    }

    return () => {
      added.forEach((el) => el.remove())
      undo.forEach((f) => f())
      document.title = prevTitle
      document.documentElement.lang = prevLang
    }
    // `key` stands for the parts of `seo` that change what the page says.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
