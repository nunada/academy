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

const ROOT = process.cwd()
const DIST = path.join(ROOT, 'dist')
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html not found — run `vite build` first')
  process.exit(1)
}

/* --------------------------------------------------------------- site url */

function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '')
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
export * from '${q('src/lib/articleSeo.ts')}'`,
)
const out = path.join(tmp, 'entry.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const lib = await import('file://' + out.replace(/\\/g, '/'))
const { ARTICLES, loadArticle, articleById, tagLabel, WIDGETS, articleSeo, listSeo, jsonLdText, plain, texToText, articleUrl, listUrl, LIST_PATH, SITE_NAME, LOCALE, OTHER } = lib

const LANGS = ['en', 'id']

/* -------------------------------------------------------- text → html */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** The inline formatting of lesson prose, as HTML. Formulas become readable
 *  text inside <span class="math">: a crawler cannot use MathML it was not
 *  given, and a sentence like "√(2) is irrational" it can quote. */
function inline(text) {
  return text
    .split(/(\$\$[^$]+\$\$|\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*)/g)
    .map((part) => {
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
</article></div></main>`
}

function listBodyHtml(lang) {
  const t = T[lang]
  return `<main class="page"><h1>${t.articles}</h1><div class="grid two">${ARTICLES.map(
    (a) => `<a class="card artcard" href="${esc(articleUrl(SITE, lang, a))}"><span class="small muted">${a.readingMinutes} ${t.minutes}</span><h2>${esc(a.title[lang])}</h2><p class="small">${esc(a.description[lang])}</p></a>`,
  ).join('')}</div></main>`
}

/* ------------------------------------------------------------- head, page */

function headTags(seo) {
  const m = (attr, key, content) => `<meta ${attr}="${key}" content="${esc(content)}" data-seo="1" />`
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
    m('name', 'twitter:card', 'summary'),
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
for (const lang of LANGS) {
  write(`${LIST_PATH[lang]}/index.html`, page(listSeo(SITE, lang), listBodyHtml(lang)))
  pages++
  for (const a of articles) {
    write(`${LIST_PATH[lang]}/${a.slug[lang]}/index.html`, page(articleSeo(a, SITE, lang), articleBodyHtml(a, lang)))
    pages++
  }
}

/* ---------------------------------------------------------------- sitemap */

const urlEntry = (loc, alts, lastmod) =>
  `  <url>\n    <loc>${esc(loc)}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}${Object.entries(alts)
    .map(([l, href]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(href)}" />\n`)
    .join('')}  </url>`

const entries = [urlEntry(`${SITE}/`, {}, undefined)]
for (const lang of LANGS) {
  entries.push(urlEntry(listUrl(SITE, lang), { en: listUrl(SITE, 'en'), id: listUrl(SITE, 'id'), 'x-default': listUrl(SITE, 'en') }, undefined))
}
for (const a of articles) {
  for (const lang of LANGS) {
    entries.push(
      urlEntry(articleUrl(SITE, lang, a), { en: articleUrl(SITE, 'en', a), id: articleUrl(SITE, 'id', a), 'x-default': articleUrl(SITE, 'en', a) }, a.updated),
    )
  }
}
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
)

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
    `> ${SITE_NAME} teaches coding and mathematics step by step, in English and Bahasa Indonesia. The articles below are free, need no account, and can be read in any order. Each has a quick answer, a table of contents, interactive practice, a FAQ and references.`,
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
  return parts.join('\n')
}
write('llms-full.txt', articles.flatMap((a) => LANGS.map((l) => md(a, l))).join('\n\n---\n\n') + '\n')

console.log(`prerendered ${pages} pages for ${articles.length} article(s) at ${SITE}; wrote sitemap.xml, robots.txt, llms.txt, llms-full.txt`)
