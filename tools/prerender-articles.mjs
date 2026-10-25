/** Writes the static files a search engine or an AI crawler needs, after `vite build`.
 *
 *  The app is a single-page app: its HTML is an empty `<div id="root">` until
 *  JavaScript runs. That is fine for a signed-in learner and poor for an
 *  article that is meant to be found. Googlebot runs scripts (eventually), but
 *  most AI crawlers and link-preview fetchers do not. So for every article, in
 *  both languages, this writes a real HTML file with:
 *    - its own <title>, description, canonical link, hreflang pair, Open Graph
 *      and Twitter tags;
 *    - JSON-LD: Article (+ LearningResource), BreadcrumbList and FAQPage;
 *    - the article's text, headings, tables and FAQ inside <div id="root">, so
 *      it is readable without any script. React replaces it on load.
 *  It also writes sitemap.xml, robots.txt, llms.txt and llms-full.txt.
 *
 *  The tags come from src/lib/articleSeo.ts, the same functions the running page
 *  uses, so the two can never disagree.
 *
 *  Run by `npm run build` after vite. Needs dist/ to exist.
 *  SITE_URL sets the public address (no trailing slash); without it the address
 *  is worked out from GITHUB_REPOSITORY, which Actions sets. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'
import { ogSvg, renderPng } from './og-image.mjs'

const ROOT = process.cwd()
const DIST = path.join(ROOT, 'dist')
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html not found — run `vite build` first')
  process.exit(1)
}

/* --------------------------------------------------------------- site url */

function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '')
  // the domain the repository says the site has (public/CNAME is also what GitHub Pages reads)
  const cname = path.join(ROOT, 'public', 'CNAME')
  if (fs.existsSync(cname)) {
    const domain = fs.readFileSync(cname, 'utf8').trim()
    if (domain) return `https://${domain}`
  }
  const repo = process.env.GITHUB_REPOSITORY // "owner/name"
  if (repo) {
    const [owner, name] = repo.split('/')
    return name.toLowerCase().endsWith('.github.io') ? `https://${name}` : `https://${owner}.github.io/${name}`
  }
  return 'https://nunada.github.io/academy'
}
const SITE = siteUrl()

/* ------------------------------------------------------------------ bundle */

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'prerender-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(
  entry,
  `export { ARTICLES, loadArticle, articleById } from '${q('src/content/articles/index.ts')}'
export { tagLabel } from '${q('src/content/articles/tags.ts')}'
export { WIDGETS } from '${q('src/content/articles/widgets.ts')}'
export { coverSvg } from '${q('src/content/articles/covers.ts')}'
export * from '${q('src/lib/articleSeo.ts')}'
export * from '${q('src/lib/aboutSeo.ts')}'
export * from '${q('src/lib/orgSeo.ts')}'
export { ABOUT, aboutStats, fillStats } from '${q('src/content/about.ts')}'
export { ORG } from '${q('src/content/org.ts')}'
export { COURSES, coursesIn } from '${q('src/content/catalog.ts')}'`,
)
const out = path.join(tmp, 'entry.mjs')
// The catalog file names the course curricula it loads lazily (`import('./python')`). The About page needs only the catalog's metadata, so those
// imports are given an empty module instead of pulling a megabyte of lessons into the bundle.
const stubCurricula = {
  name: 'stub-curricula',
  setup(b) {
    b.onResolve({ filter: /^\.\/[a-z0-9-]+$/ }, (args) => (args.importer.endsWith('catalog.ts') ? { path: args.path, namespace: 'stub' } : undefined))
    b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export const modules = []', loader: 'js' }))
  },
}
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error', plugins: [stubCurricula] })
const lib = await import('file://' + out.replace(/\\/g, '/'))
const { ARTICLES, loadArticle, articleById, tagLabel, WIDGETS, coverSvg, articleSeo, listSeo, jsonLdText, plain, texToText, articleUrl, listUrl, LIST_PATH, SITE_NAME, LOCALE, OTHER, OG_WIDTH, OG_HEIGHT, ogImageUrl, ogListImageUrl, ogDefaultImageUrl, aboutSeo, aboutUrl, ABOUT_PATH, ABOUT, aboutStats, fillStats, ORG, COURSES, coursesIn, organizationNode, websiteNode, homeUrl } = lib

const LANGS = ['en', 'id']

/* -------------------------------------------------------- text → html */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** The inline formatting of lesson prose, as HTML. Formulas become readable
 *  text inside <span class="math">: a crawler cannot use MathML it was not
 *  given, and a sentence like "√(2) is irrational" it can quote. */
let curLang = 'en'

function inline(text) {
  return text
    .split(/(\$\$[^$]+\$\$|\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\(article:[a-z0-9#-]+\)|\[[^\]]+\]\((?:\/[^)\s]*|https?:\/\/[^)\s]+)\))/g)
    .map((part) => {
      const plainLink = /^\[([^\]]+)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)$/.exec(part)
      if (plainLink) return `<a href="${esc(plainLink[2].startsWith('/') ? SITE + plainLink[2] : plainLink[2])}">${esc(plainLink[1])}</a>`
      const link = /^\[([^\]]+)\]\(article:([a-z0-9-]+)(?:#([a-z0-9-]+))?\)$/.exec(part)
      if (link) {
        const target = articleById(link[2])
        return target ? `<a href="${esc(articleUrl(SITE, curLang, target))}${link[3] ? '#' + esc(link[3]) : ''}">${esc(link[1])}</a>` : esc(link[1])
      }
      if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) return `<span class="math">${esc(texToText(part.slice(2, -2)))}</span>`
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) return `<span class="math">${esc(texToText(part.slice(1, -1)))}</span>`
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return `<code>${esc(part.slice(1, -1))}</code>`
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return `<strong>${inline(part.slice(2, -2))}</strong>`
      return esc(part)
    })
    .join('')
}

function cells(line) {
  const out = []
  let cur = ''
  let inMath = false
  for (const ch of line.trim()) {
    if (ch === '$') inMath = !inMath
    if (ch === '|' && !inMath) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  out.push(cur.trim())
  if (out[0] === '') out.shift()
  if (out[out.length - 1] === '') out.pop()
  return out
}

/** The block structure of lesson prose, as HTML: paragraphs, lists, tables. */
function rich(text) {
  return text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim())
      if (lines.every((l) => l.startsWith('- '))) return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`
      if (lines.every((l) => /^\d+\.\s/.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\.\s+/, ''))}</li>`).join('')}</ol>`
      if (lines.every((l) => l.startsWith('|'))) {
        const rows = lines.filter((l) => !/^\|[\s:|-]+\|?$/.test(l)).map(cells)
        const [head, ...body] = rows
        return `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody></table>`
      }
      return `<p>${inline(block)}</p>`
    })
    .join('\n')
}

/** A practice item, as the question only — a crawler needs to know it exists and
 *  what it asks, and the answers are for the reader. */
function activityHtml(a, lang) {
  const s = a.step
  const prompt = s.prompt ? inline(s.prompt[lang]) : ''
  const opts =
    s.options && s.options.length ? `<ul>${s.options.map((o) => `<li>${inline(o[lang])}</li>`).join('')}</ul>` : s.statements ? `<ul>${s.statements.map((o) => `<li>${inline(o[lang])}</li>`).join('')}</ul>` : ''
  return `<div class="wgt activity"><h4>${esc(a.title[lang])}</h4><p>${prompt}</p>${opts}</div>`
}

function blockHtml(b, lang) {
  switch (b.kind) {
    case 'text':
      return rich(b.text[lang])
    case 'callout':
      return `<aside class="callout ${b.tone}"><b>${esc(b.title[lang])}</b>${rich(b.text[lang])}</aside>`
    case 'figure':
      return b.figure.caption ? `<figure class="artfig"><figcaption>${esc(b.figure.caption[lang])}</figcaption></figure>` : ''
    case 'code':
      return `<figure class="codefig">${b.caption ? `<figcaption>${esc(b.caption[lang])}</figcaption>` : ''}<pre class="code">${esc(b.code)}</pre></figure>`
    case 'activity':
      return activityHtml(b, lang)
    case 'widget':
      return `<div class="wgt"><h4>${esc(WIDGETS[b.name].title[lang])}</h4><p>${esc(WIDGETS[b.name].description[lang])}</p></div>`
    default:
      return ''
  }
}

const T = {
  en: { home: 'Home', articles: 'Articles', updated: 'Updated', minutes: 'min read', quick: 'Quick answer', takeaways: 'Key takeaways', toc: 'On this page', faq: 'Frequently asked questions', refs: 'References', glossary: 'Glossary', glossaryTitle: 'Glossary: key terms', related: 'Related articles', all: 'All articles', other: 'Baca dalam Bahasa Indonesia' },
  id: { home: 'Beranda', articles: 'Artikel', updated: 'Diperbarui', minutes: 'menit baca', quick: 'Jawaban singkat', takeaways: 'Poin penting', toc: 'Daftar isi', faq: 'Pertanyaan yang sering diajukan', refs: 'Referensi', glossary: 'Glosarium', glossaryTitle: 'Glosarium: istilah penting', related: 'Artikel terkait', all: 'Semua artikel', other: 'Read in English' },
}

const dateText = (iso, lang) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function refHtml(r) {
  return `<li>${r.author ? esc(r.author) : ''}${r.year ? ` (${r.year})` : ''}${r.author || r.year ? '. ' : ''}<i>${esc(r.title)}</i>${r.source ? `. ${esc(r.source)}` : ''}${r.url ? `. <a href="${esc(r.url)}">${esc(r.url)}</a>` : ''}.</li>`
}

function articleBodyHtml(a, lang) {
  curLang = lang
  const t = T[lang]
  const other = OTHER[lang]
  const related = (a.related ?? []).map((id) => articleById(id)).filter(Boolean)
  const toc = [
    ...a.sections.map((s) => [s.id, s.heading[lang]]),
    ...(a.glossary?.length ? [['glossary', t.glossary]] : []),
    ['faq', t.faq],
    ['references', t.refs],
    ...(related.length ? [['related', t.related]] : []),
  ]
  return `<main class="page article">
<nav class="crumbs" aria-label="Breadcrumb"><a href="${esc(SITE)}/">${t.home}</a> › <a href="${esc(listUrl(SITE, lang))}">${t.articles}</a> › <span>${esc(a.title[lang])}</span></nav>
<div class="article-layout"><article class="article-body" lang="${lang}">
<header><h1>${esc(a.title[lang])}</h1>
<p class="artmeta"><span>${t.updated} <time datetime="${a.updated}">${esc(dateText(a.updated, lang))}</time></span> <span>${a.readingMinutes} ${t.minutes}</span> <span>${esc(a.level[lang])}</span> <span><a href="${esc(articleUrl(SITE, other, a))}" hreflang="${other}">${t.other}</a></span></p>
<p class="chips">${a.tags.map((id) => `<span class="chip static">${esc(tagLabel(id)[lang])}</span>`).join(' ')}</p></header>
<section class="answerbox" aria-labelledby="quick-answer"><h2 id="quick-answer">${t.quick}</h2><p>${inline(a.answer[lang])}</p><h3>${t.takeaways}</h3><ul>${a.keyPoints.map((k) => `<li>${inline(k[lang])}</li>`).join('')}</ul></section>
<nav class="toc" aria-label="${t.toc}"><b>${t.toc}</b><ol>${toc.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join('')}</ol></nav>
${a.sections.map((s) => `<section class="artsection" aria-labelledby="${s.id}"><h2 id="${s.id}">${esc(s.heading[lang])}</h2>\n${s.blocks.map((b) => blockHtml(b, lang)).join('\n')}</section>`).join('\n')}
${a.glossary?.length ? `<section class="artsection" aria-labelledby="glossary"><h2 id="glossary">${t.glossaryTitle}</h2><dl class="glossary">${a.glossary.map((g) => `<div><dt>${inline(g.term[lang])}</dt><dd>${inline(g.definition[lang])}</dd></div>`).join('')}</dl></section>` : ''}
<section class="artsection" aria-labelledby="faq"><h2 id="faq">${t.faq}</h2><div class="faq">${a.faq.map((f) => `<details open><summary>${inline(f.q[lang])}</summary><p>${inline(f.a[lang])}</p></details>`).join('')}</div></section>
<section class="artsection" aria-labelledby="references"><h2 id="references">${t.refs}</h2><ol class="refs">${a.references.map(refHtml).join('')}</ol></section>
${related.length ? `<section class="artsection" aria-labelledby="related"><h2 id="related">${t.related}</h2><ul>${related.map((r) => `<li><a href="${esc(articleUrl(SITE, lang, r))}">${esc(r.title[lang])}</a>: ${esc(r.description[lang])}</li>`).join('')}</ul></section>` : ''}
</article></div></main>${footerHtml(lang)}`
}

function listBodyHtml(lang) {
  const t = T[lang]
  return `<main class="page"><h1>${t.articles}</h1><div class="grid two">${ARTICLES.map(
    (a) => `<a class="card artcard" href="${esc(articleUrl(SITE, lang, a))}"><div class="artcover" aria-hidden="true">${coverSvg(a.id)}</div><span class="small muted">${a.readingMinutes} ${t.minutes}</span><h2>${esc(a.title[lang])}</h2><p class="small">${esc(a.description[lang])}</p></a>`,
  ).join('')}</div></main>${footerHtml(lang)}`
}

/* --------------------------------------------------------- footer, about */

const FOOT = {
  en: { about: 'About', articles: 'Articles', guide: 'Guide', tagline: 'Learn math and coding, step by step.', nav: 'About and links' },
  id: { about: 'Tentang', articles: 'Artikel', guide: 'Panduan', tagline: 'Belajar matematika dan coding, langkah demi langkah.', nav: 'Tentang dan tautan' },
}

/** The line of links the running app shows at the bottom of every page, so a crawler that lands on any page can reach the About page. */
function footerHtml(lang) {
  const f = FOOT[lang]
  return `<footer class="sitefoot"><span>© ${new Date().getFullYear()} ${esc(ORG.name)} · ${esc(f.tagline)}</span><nav aria-label="${esc(f.nav)}"><a href="${esc(aboutUrl(SITE, lang))}">${f.about}</a><a href="${esc(listUrl(SITE, lang))}">${f.articles}</a><a href="${esc(SITE)}/help">${f.guide}</a><a href="${esc(ORG.sameAs[0])}">GitHub</a></nav></footer>`
}

const WORDS = { en: { lessons: 'lessons', projects: 'mini projects' }, id: { lessons: 'pelajaran', projects: 'mini proyek' } }

function courseCardHtml(c, lang) {
  return `<div class="card" id="course-${esc(c.id)}"><div class="row"><span aria-hidden="true">${esc(c.icon)}</span><div><b>${esc(c.title[lang])}</b><div class="small muted">${esc(c.level[lang])}</div></div></div><p class="small muted">${esc(c.tagline[lang])}</p><div class="row small muted"><span class="pill">${c.lessons} ${WORDS[lang].lessons}</span> <span class="pill">${c.projects} ${WORDS[lang].projects}</span></div></div>`
}

function aboutBodyHtml(articles, lang) {
  curLang = lang
  const stats = aboutStats(COURSES, articles.length)
  const t = T[lang]
  const block = (b) => {
    if (b.kind === 'text') return rich(fillStats(b.text[lang], stats))
    if (b.kind === 'courses') return `<h3>${esc(b.heading[lang])}</h3><div class="grid two">${coursesIn(b.track).filter((c) => c.available).map((c) => courseCardHtml(c, lang)).join('')}</div>`
    const newest = [...articles].sort((a, z) => z.published.localeCompare(a.published)).slice(0, b.count)
    return `<div class="grid two">${newest.map((a) => `<a class="card artcard" href="${esc(articleUrl(SITE, lang, a))}"><h3>${esc(a.title[lang])}</h3><p class="small muted">${esc(a.description[lang])}</p></a>`).join('')}</div>`
  }
  const other = OTHER[lang]
  return `<main class="page article about">
<nav class="crumbs" aria-label="Breadcrumb"><a href="${esc(SITE)}/">${t.home}</a> › <span>${esc(ABOUT.title[lang])}</span></nav>
<article class="article-body" lang="${lang}">
<header><h1>${esc(ABOUT.title[lang])}</h1></header>
<section class="answerbox" aria-labelledby="quick-answer"><h2 id="quick-answer">${t.quick}</h2><p>${esc(ABOUT.answer[lang])}</p></section>
${ABOUT.sections.map((s) => `<section class="artsection" aria-labelledby="${s.id}"><h2 id="${s.id}">${esc(s.heading[lang])}</h2>\n${s.blocks.map(block).join('\n')}</section>`).join('\n')}
<section class="artsection" aria-labelledby="faq"><h2 id="faq">${t.faq}</h2><div class="faq">${ABOUT.faq.map((f) => `<details open><summary>${inline(f.q[lang])}</summary><p>${inline(f.a[lang])}</p></details>`).join('')}</div></section>
<p class="small muted"><a href="${esc(aboutUrl(SITE, other))}" hreflang="${other}">${t.other}</a></p>
</article></main>${footerHtml(lang)}`
}

/* ------------------------------------------------------------- head, page */

const m = (attr, key, content, seoAttr = ' data-seo="1"') => `<meta ${attr}="${key}" content="${esc(content)}"${seoAttr} />`

/** The share picture's tags, and the card type that goes with it: a large image card when there is one. */
function imageTags(image, seoAttr) {
  if (!image) return [m('name', 'twitter:card', 'summary', seoAttr)]
  return [
    m('property', 'og:image', image.url, seoAttr),
    m('property', 'og:image:type', 'image/png', seoAttr),
    m('property', 'og:image:width', String(OG_WIDTH), seoAttr),
    m('property', 'og:image:height', String(OG_HEIGHT), seoAttr),
    m('property', 'og:image:alt', image.alt, seoAttr),
    m('name', 'twitter:card', 'summary_large_image', seoAttr),
    m('name', 'twitter:image', image.url, seoAttr),
  ]
}

function headTags(seo) {
  const tags = [
    `<title data-seo="1">${esc(seo.title)}</title>`,
    m('name', 'description', seo.description),
    seo.keywords ? m('name', 'keywords', seo.keywords) : '',
    `<link rel="canonical" href="${esc(seo.canonical)}" data-seo="1" />`,
    ...Object.entries(seo.alternates).map(([l, href]) => `<link rel="alternate" hreflang="${l}" href="${esc(href)}" data-seo="1" />`),
    m('property', 'og:title', seo.title),
    m('property', 'og:description', seo.description),
    m('property', 'og:type', seo.ogType),
    m('property', 'og:url', seo.canonical),
    m('property', 'og:site_name', SITE_NAME),
    m('property', 'og:locale', LOCALE[seo.lang]),
    ...imageTags(seo.image),
    m('name', 'twitter:title', seo.title),
    m('name', 'twitter:description', seo.description),
    seo.published ? m('property', 'article:published_time', seo.published) : '',
    seo.modified ? m('property', 'article:modified_time', seo.modified) : '',
    ...seo.jsonLd.map((d) => `<script type="application/ld+json" data-seo="1">${jsonLdText(d)}</script>`),
  ]
  return tags.filter(Boolean).join('\n    ')
}

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

function page(seo, bodyHtml) {
  let html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${seo.lang}"`)
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace('</head>', `    ${headTags(seo)}\n  </head>`)
  if (!html.includes('<div id="root"></div>')) throw new Error('index.html has no empty #root to fill')
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`)
  return html
}

function write(rel, content) {
  const file = path.join(DIST, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

/* -------------------------------------------------------------------- run */

const articles = []
for (const m of ARTICLES) {
  const a = await loadArticle(m.id)
  if (!a) throw new Error(`article ${m.id} is listed but has no body`)
  articles.push(a)
}

let pages = 0
let twins = 0
let aliases = 0

/** Writes a page at `dir/index.html` and again at `dir.html`.
 *
 *  A static host answers `/articles/real-numbers` (no trailing slash) with a 301 to `/articles/real-numbers/` when the page is a folder, and a
 *  reader or crawler that does not follow redirects gets an empty body on the first request and the page only on the second. With the same file
 *  also at `real-numbers.html`, the host serves it straight away at the slash-less address, with a 200. Both copies name the slash address as
 *  canonical, so there is still one page as far as a search engine is concerned. */
function writeWithTwin(dir, html) {
  write(`${dir}/index.html`, html)
  write(`${dir}.html`, html)
  pages++
  twins++
}

for (const lang of LANGS) {
  writeWithTwin(LIST_PATH[lang], page(listSeo(SITE, lang), listBodyHtml(lang)))
  for (const a of articles) writeWithTwin(`${LIST_PATH[lang]}/${a.slug[lang]}`, page(articleSeo(a, SITE, lang), articleBodyHtml(a, lang)))
  // The About page, one address per language (/about, /tentang).
  writeWithTwin(ABOUT_PATH[lang], page(aboutSeo(SITE, lang, COURSES), aboutBodyHtml(articles, lang)))
}

/* ------------------------------------------------------------ short aliases */

// People type and share `nunada.my.id/real-numbers`. There is no such route in the app, and the host would answer 404 and leave the work to a
// script in the 404 page: the reader's browser gets there on a second request, a crawler does not. So the short address is a real page too: the
// full article, one request, with the real address as canonical, and a line of script that moves a browser to the real address.
const TAKEN = new Set(['articles', 'artikel', 'about', 'tentang', 'help', 'learn', 'catalog', 'course', 'auth', 'playground', 'leaderboard', 'profile', 'u', 'teacher', 'certificate', 'reset-password', 'og', 'assets', 'sitemap', 'sitemap-1', 'robots', 'llms', 'llms-full', 'index', '404', 'favicon-16', 'favicon-32', 'nunada-128'])
const aliasOf = new Map() // short slug -> { lang, article }
for (const lang of LANGS)
  for (const a of articles) {
    const slug = a.slug[lang]
    if (TAKEN.has(slug) || aliasOf.has(slug) || fs.existsSync(path.join(DIST, slug)) || fs.existsSync(path.join(DIST, slug + '.html'))) continue
    aliasOf.set(slug, { lang, article: a })
  }
for (const [slug, { lang, article }] of aliasOf) {
  const real = articleUrl(SITE, lang, article)
  const hop = `<script>location.replace(${JSON.stringify(new URL(real).pathname)} + location.search + location.hash)</script>`
  const html = page(articleSeo(article, SITE, lang), articleBodyHtml(article, lang)).replace('</head>', `    ${hop}
  </head>`)
  write(`${slug}/index.html`, html)
  write(`${slug}.html`, html)
  aliases++
}

/* ------------------------------------------------------------ share images */

// The picture a shared link shows: 1200x630 PNG per article and language, one per list page, one for the home page.
const domain = SITE.replace(/^https?:\/\//, '')
const outPath = (url) => url.slice(SITE.length + 1)
const pngTo = (url, svg) => {
  write(outPath(url), renderPng(svg))
  images++
}
let images = 0
for (const lang of LANGS) {
  for (const a of articles) {
    pngTo(
      ogImageUrl(SITE, lang, a.id),
      ogSvg({ title: a.title[lang], kicker: `${a.level[lang]} · ${a.readingMinutes} ${T[lang].minutes}`, covers: [coverSvg(a.id)], domain, brand: SITE_NAME }),
    )
  }
  pngTo(
    ogListImageUrl(SITE, lang),
    ogSvg({
      title: lang === 'id' ? 'Artikel Matematika dan Coding' : 'Math and Coding Articles',
      kicker: lang === 'id' ? `${articles.length} artikel gratis, dua bahasa` : `${articles.length} free articles, two languages`,
      covers: articles.slice(0, 4).map((a) => coverSvg(a.id)),
      domain,
      brand: SITE_NAME,
    }),
  )
}
const HOME_TITLE = 'Nunada Academy: Matematika & Coding'
const HOME_DESCRIPTION = 'Belajar matematika dan coding langkah demi langkah dengan scaffolding, mini proyek, XP, dan sertifikat.'
const homeImage = { url: ogDefaultImageUrl(SITE), alt: HOME_TITLE }
pngTo(
  homeImage.url,
  ogSvg({ title: 'Belajar matematika dan coding, langkah demi langkah', kicker: 'Learn math and coding, step by step', covers: articles.slice(0, 4).map((a) => coverSvg(a.id)), domain, brand: SITE_NAME }),
)

// The home page has the tags of a link preview too. They are not marked data-seo: nothing running replaces them, and an article page
// opened from the home page overwrites the same tags and puts them back when it closes.
fs.writeFileSync(
  path.join(DIST, 'index.html'),
  template.replace(
    '</head>',
    `    ${[
      m('property', 'og:title', HOME_TITLE, ''),
      m('property', 'og:description', HOME_DESCRIPTION, ''),
      m('property', 'og:type', 'website', ''),
      m('property', 'og:url', `${SITE}/`, ''),
      m('property', 'og:site_name', SITE_NAME, ''),
      m('property', 'og:locale', LOCALE.id, ''),
      ...imageTags(homeImage, ''),
      m('name', 'twitter:title', HOME_TITLE, ''),
      m('name', 'twitter:description', HOME_DESCRIPTION, ''),
      // The organization and the website, in full, once: every article's author and publisher refers to these by id.
      ...[organizationNode(SITE, 'id', COURSES, aboutUrl(SITE, 'id')), websiteNode(SITE, 'id')].map((d) => `<script type="application/ld+json">${jsonLdText(d)}</script>`),
    ].join('\n    ')}\n  </head>`,
  ),
)

/* ---------------------------------------------------------------- sitemap */

const urlEntry = (loc, alts, lastmod) =>
  `  <url>\n    <loc>${esc(loc)}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}${Object.entries(alts)
    .map(([l, href]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(href)}" />\n`)
    .join('')}  </url>`

const entries = [urlEntry(`${SITE}/`, {}, undefined)]
for (const lang of LANGS) {
  entries.push(urlEntry(listUrl(SITE, lang), { en: listUrl(SITE, 'en'), id: listUrl(SITE, 'id'), 'x-default': listUrl(SITE, 'en') }, undefined))
}
for (const lang of LANGS) {
  entries.push(urlEntry(aboutUrl(SITE, lang), { en: aboutUrl(SITE, 'en'), id: aboutUrl(SITE, 'id'), 'x-default': aboutUrl(SITE, 'en') }, undefined))
}
for (const a of articles) {
  for (const lang of LANGS) {
    entries.push(
      urlEntry(articleUrl(SITE, lang, a), { en: articleUrl(SITE, 'en', a), id: articleUrl(SITE, 'id', a), 'x-default': articleUrl(SITE, 'en', a) }, a.updated),
    )
  }
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`
write('sitemap.xml', sitemap)

/* ----------------------------------------------------------------- robots */

// Written on purpose with the AI crawlers named: being quotable in an answer
// engine is the point of these pages. Note that a robots.txt only counts at the
// root of a host; on a GitHub Pages project site (user.github.io/repo/) this
// copy is inert, and the sitemap has to be submitted by hand instead.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']
write(
  'robots.txt',
  [
    'User-agent: *',
    'Allow: /',
    '',
    ...AI_BOTS.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
  ].join('\n'),
)

/* ------------------------------------------------------------------ llms */

write(
  'llms.txt',
  [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} teaches mathematics and coding step by step, in English and Bahasa Indonesia. The articles below are free, need no account, and can be read in any order. Each has a quick answer, a table of contents, interactive practice, a FAQ and references.`,
    '',
    '## About',
    '',
    `- [About ${SITE_NAME}](${aboutUrl(SITE, 'en')}): ${ORG.description.en}`,
    `- [Tentang ${SITE_NAME}](${aboutUrl(SITE, 'id')}): ${ORG.description.id}`,
    '',
    '## Articles (English)',
    '',
    ...articles.map((a) => `- [${a.title.en}](${articleUrl(SITE, 'en', a)}): ${a.description.en}`),
    '',
    '## Artikel (Bahasa Indonesia)',
    '',
    ...articles.map((a) => `- [${a.title.id}](${articleUrl(SITE, 'id', a)}): ${a.description.id}`),
    '',
    '## Optional',
    '',
    `- [Full text of every article](${SITE}/llms-full.txt)`,
    `- [Sitemap](${SITE}/sitemap.xml)`,
    '',
  ].join('\n'),
)

const md = (a, lang) => {
  const parts = [`# ${a.title[lang]}`, '', `Source: ${articleUrl(SITE, lang, a)}`, `Updated: ${a.updated}`, '', `## ${T[lang].quick}`, '', a.answer[lang], '', `### ${T[lang].takeaways}`, '', ...a.keyPoints.map((k) => `- ${k[lang]}`), '']
  for (const s of a.sections) {
    parts.push(`## ${s.heading[lang]}`, '')
    for (const b of s.blocks) {
      if (b.kind === 'text') parts.push(b.text[lang], '')
      else if (b.kind === 'callout') parts.push(`> **${b.title[lang]}**`, '>', ...b.text[lang].split('\n').map((l) => `> ${l}`), '')
      else if (b.kind === 'code') parts.push('```' + b.lang, b.code, '```', '')
      else if (b.kind === 'figure' && b.figure.caption) parts.push(`*${b.figure.caption[lang]}*`, '')
    }
  }
  if (a.glossary?.length) {
    parts.push(`## ${T[lang].glossaryTitle}`, '')
    for (const g of a.glossary) parts.push(`- **${plain(g.term[lang])}**: ${g.definition[lang]}`)
    parts.push('')
  }
  parts.push(`## ${T[lang].faq}`, '')
  for (const f of a.faq) parts.push(`### ${plain(f.q[lang])}`, '', plain(f.a[lang]), '')
  return parts.join('\n').replace(/\[([^\]]+)\]\(article:([a-z0-9-]+)(?:#([a-z0-9-]+))?\)/g, (m0, label, id, hash) => {
    const target = articleById(id)
    return target ? `[${label}](${articleUrl(SITE, lang, target)}${hash ? '#' + hash : ''})` : label
  })
}
write('llms-full.txt', articles.flatMap((a) => LANGS.map((l) => md(a, l))).join('\n\n---\n\n') + '\n')

console.log(`prerendered ${pages} pages (+${twins} slash-less twins, ${aliases} short aliases) and ${images} share images for ${articles.length} article(s) at ${SITE}; wrote sitemap.xml, robots.txt, llms.txt, llms-full.txt`)
