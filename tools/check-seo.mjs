/** Checks the HTML the build wrote (dist/) for what a search engine or an AI crawler reads, page by page, after `npm run build`.
 *
 *  `check-articles.mjs` checks the articles as data. This checks what was actually written to disk, because that is what gets served:
 *
 *   - every article page has Article and FAQPage structured data (and a BreadcrumbList), each parseable, each question with an answer;
 *   - every article's author and publisher is a reference to the one Organization on the home page, by `@id`, and that Organization is complete
 *     (name, logo, sameAs links, subjects tied to a defining page, a course for each available course);
 *   - the About pages are AboutPage + FAQPage + Organization + WebSite;
 *   - hreflang: every page lists itself, its other language and x-default; every alternate exists on disk and lists the page back; the canonical
 *     link is the page's own address; the `<html lang>` matches the address;
 *   - the sitemap names every page, with the same alternates;
 *   - every image has a text alternative: an `<img>` has `alt`, an `<svg>` is hidden from assistive technology or is `role="img"` with a label,
 *     and every share picture has `og:image:alt`.
 *
 *  Run: npm run check:seo   (needs dist/; `npm run build` makes it)   Exit 1 on any problem. */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const DIST = path.join(process.cwd(), 'dist')
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html not found: run `npm run build` first')
  process.exit(1)
}

let bad = 0
let checks = 0
const flag = (where, msg) => {
  bad++
  console.log(`${where}: ${msg}`)
}
const ok = (cond, where, msg) => {
  checks++
  if (!cond) flag(where, msg)
  return cond
}

const read = (rel) => fs.readFileSync(path.join(DIST, rel), 'utf8')
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))

/** The pages the prerender writes: a folder with an index.html under these. */
const PAGE_DIRS = { en: ['articles', 'about'], id: ['artikel', 'tentang'] }
const pages = []
for (const [lang, dirs] of Object.entries(PAGE_DIRS))
  for (const d of dirs) {
    const base = path.join(DIST, d)
    if (!fs.existsSync(base)) continue
    for (const f of walk(base)) if (path.basename(f) === 'index.html') pages.push({ lang, rel: path.relative(DIST, f).replace(/\\/g, '/') })
  }

/* ---------------------------------------------------------------- parsing */

const attr = (tag, name) => {
  const m = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i').exec(tag)
  return m ? m[1] : undefined
}
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

function parse(rel) {
  const html = read(rel)
  const head = html.slice(0, html.indexOf('</head>'))
  const jsonLd = []
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      jsonLd.push(JSON.parse(m[1]))
    } catch (e) {
      flag(rel, `a JSON-LD block does not parse: ${e.message}`)
    }
  }
  const links = [...head.matchAll(/<link\b[^>]*>/g)].map((m) => m[0])
  const metas = [...head.matchAll(/<meta\b[^>]*>/g)].map((m) => m[0])
  return {
    html,
    jsonLd,
    lang: /<html lang="([^"]*)"/.exec(html)?.[1],
    title: /<title[^>]*>([\s\S]*?)<\/title>/.exec(head)?.[1],
    canonical: links.map((l) => (attr(l, 'rel') === 'canonical' ? attr(l, 'href') : undefined)).find(Boolean),
    alternates: Object.fromEntries(links.filter((l) => attr(l, 'rel') === 'alternate' && attr(l, 'hreflang')).map((l) => [attr(l, 'hreflang'), unesc(attr(l, 'href') ?? '')])),
    meta: (key) => metas.map((m) => ((attr(m, 'name') ?? attr(m, 'property')) === key ? attr(m, 'content') : undefined)).find((v) => v !== undefined),
  }
}

const typesOf = (node) => [].concat(node?.['@type'] ?? [])
const find = (docs, type) => docs.filter((d) => typesOf(d).includes(type))

/* ----------------------------------------------------------- the home page */

const home = parse('index.html')
const orgs = find(home.jsonLd, 'Organization')
const org = orgs[0]
const ORG_ID = org?.['@id']
if (ok(org, 'index.html', 'no Organization in the home page structured data') && org) {
  ok(typeof ORG_ID === 'string' && /^https:\/\/.+\/#organization$/.test(ORG_ID), 'index.html', `Organization @id "${ORG_ID}" is not an https address ending /#organization`)
  ok(typesOf(org).includes('EducationalOrganization'), 'index.html', 'Organization should also be an EducationalOrganization')
  ok(org.name && org.url && org.description, 'index.html', 'Organization needs a name, url and description')
  ok(org.logo?.url && /^https:/.test(org.logo.url) && org.logo.width && org.logo.height, 'index.html', 'Organization logo needs an https url and a size')
  ok(Array.isArray(org.sameAs) && org.sameAs.length > 0 && org.sameAs.every((u) => /^https:\/\//.test(u)), 'index.html', 'Organization sameAs must be a non-empty list of https links')
  ok(Array.isArray(org.knowsAbout) && org.knowsAbout.length >= 8, 'index.html', 'Organization should say what it knows about (at least 8 subjects)')
  for (const k of org.knowsAbout ?? []) ok(k.name && /^https:\/\/en\.wikipedia\.org\/wiki\//.test(k.sameAs ?? ''), 'index.html', `knowsAbout "${k.name}" needs a Wikipedia sameAs`)
  const courses = org.hasOfferCatalog?.itemListElement ?? []
  ok(courses.length >= 10, 'index.html', `OfferCatalog has ${courses.length} courses`)
  for (const c of courses) ok(c.name && c.description && c.provider?.['@id'] === ORG_ID && /#course-[a-z0-9-]+$/.test(c.url ?? ''), 'index.html', `course "${c.name}" needs name, description, provider by @id and a #course- address`)
}
const site = find(home.jsonLd, 'WebSite')[0]
if (ok(site, 'index.html', 'no WebSite in the home page structured data') && site) ok(site.publisher?.['@id'] === ORG_ID, 'index.html', 'WebSite publisher must refer to the Organization by @id')

/* ------------------------------------------------------------- every page */

const urlToRel = (url) => {
  const u = new URL(url)
  return u.pathname.replace(/^\/+/, '').replace(/\/?$/, '/') + 'index.html'
}
const byRel = new Map()
for (const p of pages) byRel.set(p.rel, parse(p.rel))

for (const p of pages) {
  const d = byRel.get(p.rel)
  const where = p.rel
  const isArticle = /^(articles|artikel)\/[^/]+\/index\.html$/.test(p.rel)
  const isAbout = /^(about|tentang)\/index\.html$/.test(p.rel)

  /* head basics */
  ok(d.title && d.title.length >= 10, where, 'missing <title>')
  ok((d.meta('description') ?? '').length >= 50, where, 'meta description missing or under 50 characters')
  ok(d.lang === p.lang, where, `<html lang="${d.lang}"> but the address is in "${p.lang}"`)

  /* hreflang and canonical */
  const alts = d.alternates
  ok(alts.en && alts.id && alts['x-default'], where, `hreflang needs en, id and x-default, has: ${Object.keys(alts).join(', ') || 'none'}`)
  ok(d.canonical && alts[p.lang] === d.canonical, where, `canonical ${d.canonical} must equal this page's own hreflang (${alts[p.lang]})`)
  ok(alts['x-default'] === alts.en, where, 'x-default should be the English page')
  for (const [l, url] of Object.entries(alts)) {
    if (l === p.lang) continue
    const rel = urlToRel(url)
    const other = byRel.get(rel)
    if (!ok(other, where, `hreflang ${l} points at ${url}, which is not a page in dist/`)) continue
    if (l !== 'x-default') ok(other.alternates[p.lang] === d.canonical, where, `${rel} does not list this page back as hreflang ${p.lang}`)
  }

  /* images: share picture, <img>, <svg> */
  const og = d.meta('og:image')
  ok(og && /^https:\/\//.test(og), where, 'og:image missing or not https')
  ok((d.meta('og:image:alt') ?? '').trim().length > 0, where, 'og:image:alt is missing: the share picture needs a text alternative')
  ok((d.meta('twitter:image') ?? '') === og, where, 'twitter:image should be the same picture as og:image')
  for (const m of d.html.matchAll(/<img\b[^>]*>/g)) ok(attr(m[0], 'alt') !== undefined, where, `<img> without alt: ${m[0].slice(0, 80)}`)
  for (const m of d.html.matchAll(/<svg\b[^>]*>/g)) {
    const t = m[0]
    const hidden = attr(t, 'aria-hidden') === 'true'
    const labelled = attr(t, 'role') === 'img' && (attr(t, 'aria-label') || attr(t, 'aria-labelledby'))
    ok(hidden || labelled, where, `<svg> is neither aria-hidden nor role="img" with a label: ${t.slice(0, 80)}`)
  }
  for (const doc of d.jsonLd) for (const im of [doc.logo, doc.image].flat().filter((x) => x && typeof x === 'object')) ok(/^https:\/\//.test(im.url ?? ''), where, 'structured-data image needs an https url')

  /* structured data */
  const faq = find(d.jsonLd, 'FAQPage')[0]
  // the article list is a collection page with no questions of its own; articles and the About page answer questions
  if ((isArticle || isAbout) && ok(faq, where, 'no FAQPage structured data') && faq) {
    ok(Array.isArray(faq.mainEntity) && faq.mainEntity.length >= 1, where, 'FAQPage has no questions')
    for (const q of faq.mainEntity ?? []) ok(q['@type'] === 'Question' && q.name && q.acceptedAnswer?.text, where, `FAQ question without a name or an answer: ${q.name}`)
  }
  ok(find(d.jsonLd, 'BreadcrumbList').length === 1, where, 'needs exactly one BreadcrumbList')

  if (isArticle) {
    const art = find(d.jsonLd, 'Article')[0]
    if (ok(art, where, 'no Article structured data') && art) {
      ok(art.headline && art.description && art.datePublished && art.dateModified, where, 'Article needs headline, description, datePublished and dateModified')
      ok(art.inLanguage === p.lang, where, `Article inLanguage "${art.inLanguage}" should be "${p.lang}"`)
      ok(art.mainEntityOfPage?.['@id'] === d.canonical && art.url === d.canonical, where, 'Article url and mainEntityOfPage must be the canonical address')
      ok(art.author?.['@id'] === ORG_ID && art.publisher?.['@id'] === ORG_ID, where, 'Article author and publisher must refer to the Organization by @id')
      ok(Array.isArray(art.about) && art.about.length >= 1 && art.about.every((x) => /^https:\/\//.test(x.sameAs ?? '')), where, 'Article about needs entities, each with an https sameAs')
      ok(art.workTranslation?.url === alts[p.lang === 'en' ? 'id' : 'en'], where, 'workTranslation should be the other-language page')
      ok(typeof art.keywords === 'string' && art.keywords.split(',').length >= 8, where, 'Article keywords should list at least 8 terms')
    }
    ok(find(d.jsonLd, 'FAQPage').length === 1, where, 'an article has exactly one FAQPage')
  }

  if (isAbout) {
    ok(find(d.jsonLd, 'AboutPage').length === 1, where, 'About page needs an AboutPage')
    const o = find(d.jsonLd, 'Organization')[0]
    ok(o && o['@id'] === ORG_ID, where, 'About page must carry the same Organization @id as the home page')
    ok(JSON.stringify(o?.sameAs) === JSON.stringify(org?.sameAs), where, 'About page Organization sameAs differs from the home page')
    ok(find(d.jsonLd, 'WebSite').length === 1, where, 'About page needs the WebSite')
    ok(find(d.jsonLd, 'AboutPage')[0]?.mainEntity?.['@id'] === ORG_ID, where, 'AboutPage mainEntity must be the Organization')
    ok((o?.hasOfferCatalog?.itemListElement ?? []).length === (org?.hasOfferCatalog?.itemListElement ?? []).length, where, 'About page lists a different number of courses from the home page')
    // every course the structured data links to has its anchor on the page
    for (const c of o?.hasOfferCatalog?.itemListElement ?? []) {
      const id = /#(course-[a-z0-9-]+)$/.exec(c.url)?.[1]
      ok(id && d.html.includes(`id="${id}"`), where, `course anchor ${id} is not on the page`)
    }
    ok(/class="answerbox"/.test(d.html) && /id="quick-answer"/.test(d.html), where, 'About page needs the quick answer box')
    ok(/href="[^"]*(?:about|tentang)\/"/.test(d.html), where, 'About page should link to its other-language twin')
  } else {
    // every other page points to the About page, so the entity is one click away
    ok(/href="[^"]*\/(?:about|tentang)\/"/.test(d.html), where, 'no link to the About page (the footer carries it)')
  }
}

/* --------------------------------------------------------------- sitemap */

const sitemap = read('sitemap.xml')
for (const p of pages) {
  const d = byRel.get(p.rel)
  const loc = `<loc>${(d.canonical ?? '').replace(/&/g, '&amp;')}</loc>`
  if (ok(sitemap.includes(loc), p.rel, 'is not in sitemap.xml')) {
    const block = sitemap.split('<url>').find((b) => b.includes(loc)) ?? ''
    for (const [l, url] of Object.entries(d.alternates)) ok(block.includes(`hreflang="${l}" href="${url}"`), p.rel, `sitemap entry lacks hreflang ${l} ${url}`)
  }
}
/* ------------------------------------------- one request is enough to read it */

// A slash-less address (`/articles/real-numbers`) must answer with the page itself and not a redirect that costs a second request, and so must
// the short address (`/real-numbers`): each has a file of its own, and its canonical link names the real page.
for (const p of pages) {
  const twin = p.rel.replace(/\/index\.html$/, '.html')
  ok(fs.existsSync(path.join(DIST, twin)) && read(twin) === read(p.rel), p.rel, `${twin} (the slash-less address) is missing or differs from the page`)
}
let aliasCount = 0
for (const f of fs.readdirSync(DIST)) {
  if (!f.endsWith('.html')) continue
  const html = read(f)
  const hop = /<script>location\.replace\(("[^"]*")/.exec(html)
  if (!hop) continue
  aliasCount++
  const slug = f.replace(/\.html$/, '')
  const d = parse(f)
  const target = byRel.get(urlToRel(d.canonical ?? ''))
  ok(target, f, `alias canonical ${d.canonical} is not a page in dist/`)
  ok(new URL(d.canonical).pathname === JSON.parse(hop[1]), f, 'the script sends the browser somewhere other than the canonical address')
  ok(fs.existsSync(path.join(DIST, slug, 'index.html')) && read(path.join(slug, 'index.html')) === html, f, `${slug}/ is missing or differs from ${f}`)
  ok(find(d.jsonLd, 'Article').length === 1 && find(d.jsonLd, 'FAQPage').length === 1, f, 'an alias must carry the whole article, Article and FAQPage included, so one request is enough')
  ok(!sitemap.includes(`<loc>${new URL(d.canonical).origin}/${slug}/</loc>`), f, 'an alias must not be in the sitemap')
}
ok(aliasCount >= 40, 'aliases', `only ${aliasCount} short aliases were written`)

// the plain sitemap lists exactly the canonical addresses of the full one, and nothing else in them
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const simple = read('sitemap-simple.xml')
ok(JSON.stringify(locs(simple)) === JSON.stringify(locs(sitemap)), 'sitemap-simple.xml', 'must list the same addresses, in the same order, as sitemap.xml')
ok(!/xhtml:|<lastmod|hreflang/.test(simple), 'sitemap-simple.xml', 'must have no hreflang links or dates in it')
ok(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/.test(simple)&& simple.trimEnd().endsWith('</urlset>'), 'sitemap-simple.xml', 'wrong header or no closing urlset')
for (const p of pages) ok(locs(simple).includes(byRel.get(p.rel).canonical), p.rel, 'canonical address is not in sitemap-simple.xml')
ok(locs(simple).every((u) => u.endsWith('/') || u === new URL(u).origin), 'sitemap-simple.xml', 'every address must end with a slash, like its canonical link')
ok(read('llms.txt').includes('/about/') && read('llms.txt').includes('/tentang/'), 'llms.txt', 'does not name the About pages')

console.log(`seo check: ${pages.length} pages, ${checks} checks, ${bad} problem(s)`)
process.exit(bad ? 1 : 0)
