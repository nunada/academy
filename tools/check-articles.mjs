/** Checks every article before it can be published.
 *
 *  An article is found from a search result or an AI answer, so what the page
 *  says about itself matters as much as what is in it: a description cut off by
 *  the results page, two articles claiming one URL, a FAQ answer with a list in
 *  it that the FAQPage markup cannot hold. This looks for those, and for the
 *  quieter ones — a formula the renderer does not understand, a practice item
 *  with no right answer, a language that has drifted from the other.
 *
 *  It also runs the search on a few queries a reader would type, including a
 *  typo and a word's first letters, so a change to the matcher cannot silently
 *  stop it finding things.
 *
 *  Run: npm run check:articles   Exit 1 on any problem. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'articles-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(
  entry,
  `export { ARTICLES, loadArticle, bodyIds } from '${q('src/content/articles/index.ts')}'
export { TAGS } from '${q('src/content/articles/tags.ts')}'
export { WIDGETS } from '${q('src/content/articles/widgets.ts')}'
export { tex } from '${q('src/lib/tex.ts')}'
export { parseFillTemplate, brokenPieces, countBlanks } from '${q('src/lib/fillTemplate.ts')}'
export { buildIndex, search } from '${q('src/lib/articleSearch.ts')}'
export { articleSeo, listSeo, plain } from '${q('src/lib/articleSeo.ts')}'`,
)
const out = path.join(tmp, 'entry.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' })
const L = await import('file://' + out.replace(/\\/g, '/'))

let bad = 0
const flag = (where, msg) => {
  bad++
  console.log(`${where}: ${msg}`)
}
const isLoc = (v) => v && typeof v === 'object' && typeof v.en === 'string' && typeof v.id === 'string'
const LANGS = ['en', 'id']
const RESERVED = new Set(['quick-answer', 'faq', 'references', 'glossary', 'related', 'index'])

/* ------------------------------------------------------------- helpers */

/** Everything under `node` that is a { en, id } pair, with where it is. */
function* locs(node, where = '') {
  if (isLoc(node)) {
    yield [where, node]
    return
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === 'function') continue
      yield* locs(v, `${where}/${k}`)
    }
  }
}

const LINK = /\[([^\]]*)\]\(article:([a-z0-9-]+)(?:#([a-z0-9-]+))?\)/g
const words = (s) => s.replace(LINK, '$1').replace(/\$[^$]*\$/g, ' x ').replace(/[*`|#>-]/g, ' ').split(/\s+/).filter(Boolean).length

/** The shape of a piece of prose, so the two languages can be compared. */
function shape(text) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)
  return blocks.map((b) => {
    const lines = b.split('\n').map((l) => l.trim())
    if (lines.every((l) => l.startsWith('- '))) return `ul${lines.length}`
    if (lines.every((l) => /^\d+\.\s/.test(l))) return `ol${lines.length}`
    if (lines.every((l) => l.startsWith('|'))) {
      const rows = lines.filter((l) => !/^\|[\s:|-]+\|?$/.test(l))
      return `table${rows.length}`
    }
    return 'p'
  })
}

/** Formulas in a string that the renderer cannot draw. */
function badTex(text) {
  const found = []
  for (const m of text.matchAll(/\$\$([^$]+)\$\$|\$([^$]+)\$/g)) {
    const src = m[1] ?? m[2]
    let html
    try {
      html = L.tex(src, !!m[1])
    } catch (e) {
      found.push(`${src} (${e.message})`)
      continue
    }
    // An unsupported command comes out as literal text, backslash and all.
    const visible = html.replace(/<[^>]+>/g, '')
    if (/\\[a-zA-Z]+/.test(visible)) found.push(src)
  }
  return found
}

/* ------------------------------------------------------------ catalogue */

const ids = new Set()
const slugs = { en: new Set(), id: new Set() }
const loaded = []
const tagIds = new Set(L.TAGS.map((t) => t.id))

const listed = new Set(L.ARTICLES.map((a) => a.id))
for (const id of L.bodyIds()) if (!listed.has(id)) flag(id, 'has a body loader but no entry in ARTICLES')

for (const m of L.ARTICLES) {
  const w = m.id
  if (ids.has(m.id)) flag(w, 'duplicate id')
  ids.add(m.id)
  if (!L.bodyIds().includes(m.id)) flag(w, 'is listed but has no body loader')

  for (const lang of LANGS) {
    const slug = m.slug?.[lang]
    if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) flag(w, `slug.${lang} must be lowercase letters, digits and hyphens: "${slug}"`)
    else if (RESERVED.has(slug)) flag(w, `slug.${lang} "${slug}" is reserved`)
    else if (slugs[lang].has(slug)) flag(w, `slug.${lang} "${slug}" is used by another article`)
    slugs[lang].add(slug)

    const title = m.title?.[lang] ?? ''
    if (title.length < 10 || title.length > 90) flag(w, `title.${lang} should be 10–90 characters, is ${title.length}`)
    const desc = m.description?.[lang] ?? ''
    if (desc.length < 100 || desc.length > 165) flag(w, `description.${lang} should be 100–165 characters (a results page cuts it), is ${desc.length}`)
    if (m.seoTitle && m.seoTitle[lang].length > 62) flag(w, `seoTitle.${lang} is ${m.seoTitle[lang].length} characters; keep it at 62 or fewer`)
    if (!m.keywords?.[lang] || m.keywords[lang].split(',').length < 5) flag(w, `keywords.${lang} needs at least 5 comma-separated terms`)
    if (!m.level?.[lang]) flag(w, `level.${lang} is empty`)
  }
  for (const t of m.tags) if (!tagIds.has(t)) flag(w, `unknown tag "${t}"`)
  if (!m.tags.length) flag(w, 'needs at least one tag')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.published) || !/^\d{4}-\d{2}-\d{2}$/.test(m.updated)) flag(w, 'published and updated must be YYYY-MM-DD')
  else if (m.updated < m.published) flag(w, 'updated is before published')
  if (!['math', 'code'].includes(m.track)) flag(w, `track must be math or code, is "${m.track}"`)

  const a = await L.loadArticle(m.id)
  if (!a) {
    flag(w, 'body failed to load')
    continue
  }
  loaded.push(a)

  /* ---- body ---- */
  for (const k of ['answer', 'keyPoints', 'sections', 'faq', 'references']) if (!(k in a)) flag(w, `missing ${k}`)
  if (a.keyPoints.length < 3) flag(w, 'needs at least 3 key points')
  if (a.sections.length < 3) flag(w, 'needs at least 3 sections')
  if (a.faq.length < 5) flag(w, 'needs at least 5 FAQ entries (the FAQ is structured data too)')
  if (a.references.length < 2) flag(w, 'needs at least 2 references')

  for (const lang of LANGS) {
    const n = words(a.answer[lang])
    if (n < 25 || n > 90) flag(w, `answer.${lang} should be a 25–90 word direct answer, is ${n}`)
  }

  const sectionIds = new Set()
  const stepIds = new Set()
  for (const s of a.sections) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id)) flag(w, `section id "${s.id}" must be lowercase with hyphens`)
    if (RESERVED.has(s.id)) flag(w, `section id "${s.id}" is reserved`)
    if (sectionIds.has(s.id)) flag(w, `duplicate section id "${s.id}"`)
    sectionIds.add(s.id)
    if (!s.blocks.length) flag(w, `section "${s.id}" is empty`)

    s.blocks.forEach((b, i) => {
      const at = `${w}/${s.id}[${i}]`
      if (b.kind === 'widget' && !L.WIDGETS[b.name]) flag(at, `unknown widget "${b.name}"`)
      if (b.kind === 'text') {
        const [en, id] = LANGS.map((l) => shape(b.text[l]).join(','))
        if (en !== id) flag(at, `English and Indonesian prose differ in structure: ${en} vs ${id}`)
      }
      if (b.kind === 'activity') {
        const st = b.step
        if (stepIds.has(st.id)) flag(at, `duplicate step id "${st.id}"`)
        stepIds.add(st.id)
        if (!['quiz', 'multi', 'judge', 'fill', 'order', 'math'].includes(st.kind)) flag(at, `a "${st.kind}" step does not belong in an article`)
        if (st.kind === 'quiz' && !(Number.isInteger(st.answer) && st.answer >= 0 && st.answer < st.options.length)) flag(at, 'quiz answer is not an option')
        if (st.kind === 'quiz' && st.options.length < 3) flag(at, 'a quiz needs at least 3 options')
        if (st.kind === 'multi' && (st.answer.length < 2 || st.answer.some((x) => x < 0 || x >= st.options.length))) flag(at, 'multi needs 2 or more valid correct options')
        if (st.kind === 'judge' && st.answer.length !== st.statements.length) flag(at, 'judge needs one answer per statement')
        if (st.kind === 'order' && (!st.lines || (st.lines.en ?? st.lines).length < 3)) flag(at, 'order needs at least 3 lines')
        if (st.kind === 'math' && (!st.blanks?.length || !st.hints?.length)) flag(at, 'math needs blanks and at least one hint')
        if (st.kind === 'fill') {
          for (const lang of LANGS) {
            const t = typeof st.template === 'string' ? st.template : st.template[lang]
            const bl = Array.isArray(st.blanks) ? st.blanks : st.blanks[lang]
            if (st.math) {
              const nodes = L.parseFillTemplate(t)
              if (L.brokenPieces(nodes).length) flag(at, `a blank sits inside a group that splits the formula (${lang})`)
              if (L.countBlanks(nodes) !== bl.length) flag(at, `template has ${L.countBlanks(nodes)} blanks, ${bl.length} answers (${lang})`)
            } else if (t.split('___').length - 1 !== bl.length) flag(at, `template/blanks count differ (${lang})`)
          }
        }
        if (!st.explain || !st.hint) if (st.kind !== 'math') flag(at, 'every practice item needs both an explanation and a hint')
      }
    })
  }

  /* ---- faq ---- */
  a.faq.forEach((f, i) => {
    for (const lang of LANGS) {
      const ans = f.a[lang]
      if (/\n|^- |^\d+\.\s|\|/.test(ans)) flag(`${w}/faq[${i}]`, `answer.${lang} must be one plain paragraph (it goes into FAQPage markup)`)
      const n = words(ans)
      if (n < 15 || n > 90) flag(`${w}/faq[${i}]`, `answer.${lang} should be 15–90 words, is ${n}`)
      if (!/[?？]$/.test(f.q[lang].trim())) flag(`${w}/faq[${i}]`, `question.${lang} should end with a question mark`)
    }
  })

  /* ---- answer-engine and generative-engine shape ---- */
  for (const lang of LANGS) {
    // Headings people would type as a search: at least five are questions.
    const questions = a.sections.filter((s) => /\?/.test(s.heading[lang])).length
    if (questions < 5) flag(w, `only ${questions} section headings are questions in ${lang}; use at least 5 (what / how / why …?)`)
    if (m.title[lang].length > 70) flag(w, `title.${lang} is ${m.title[lang].length} characters; the H1 should stay near 60`)
  }
  for (const s of a.sections) {
    if (['practice', 'summary'].includes(s.id)) continue
    const first = s.blocks[0]
    if (!first || first.kind !== 'text') continue
    for (const lang of LANGS) {
      const para = first.text[lang].split(/\n{2,}/)[0]
      // A section that opens with a paragraph opens with its answer in bold,
      // so the first 40 words can be quoted without the rest.
      if (shape(para)[0] === 'p' && !/\*\*/.test(para.slice(0, 220))) flag(`${w}/${s.id}`, `${lang} section does not open with a bold direct answer`)
    }
  }
  if (!a.glossary || a.glossary.length < 6) flag(w, 'needs a glossary of at least 6 terms (definitions are what answer engines quote)')
  else {
    const seen = new Set()
    for (const g of a.glossary) {
      if (seen.has(g.term.en)) flag(w, `duplicate glossary term "${g.term.en}"`)
      seen.add(g.term.en)
      for (const lang of LANGS) if (/[$\n]/.test(g.definition[lang]) || words(g.definition[lang]) < 5 || words(g.definition[lang]) > 45) flag(w, `glossary "${g.term.en}" (${lang}) must be one plain sentence of 5–45 words`)
    }
  }
  if (!a.howTo?.length) flag(w, 'needs at least one HowTo (a procedure taught as steps)')
  for (const h of a.howTo ?? []) {
    if (h.steps.length < 3) flag(w, `HowTo "${h.name.en}" needs at least 3 steps`)
    for (const st of h.steps) for (const lang of LANGS) if (/[$\n*`]/.test(st.text[lang] + st.name[lang])) flag(w, `HowTo "${h.name.en}" step text must be plain (${lang})`)
  }
  for (const rid of a.related ?? []) {
    if (rid === m.id) flag(w, 'related lists the article itself')
    else if (!listed.has(rid)) flag(w, `related names "${rid}", which is not an article`)
  }
  if ((a.related ?? []).length > 4) flag(w, 'related should hold at most 4 articles')
  if (!m.about?.length || m.about.some((x) => !/^https:\/\//.test(x.sameAs.en) || !/^https:\/\//.test(x.sameAs.id))) flag(w, 'about needs at least one entity with https sameAs links in both languages')

  /* ---- every language string, every formula ---- */
  for (const [where, loc] of locs(a, w)) {
    for (const lang of LANGS) {
      if (!loc[lang].trim()) flag(where, `${lang} is empty`)
      for (const f of badTex(loc[lang])) flag(where, `the formula renderer cannot draw "${f}" (${lang})`)
      if (/(?<!\\)\$[^$]*$/.test(loc[lang].replace(/\$\$[^$]*\$\$|\$[^$]*\$/g, ''))) flag(where, `unbalanced $ in ${lang} text`)
    }
    // Indonesian writes decimals with a comma; a point in prose (not inside a
    // formula or code) is the English habit slipping through.
    // Dotted thousands (10.000, 1.205) are how Indonesian writes big numbers, not decimals.
    const prose = loc.id
      .replace(/\$[^$]*\$/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/(?:\b|(?<=Rp))\d{1,3}(?:\.\d{3})+\b/g, ' ')
    if (/\d\.\d/.test(prose) && !/https?:|v\d+\.\d|\d+\.\d+\.\d+/.test(prose)) flag(where, 'Indonesian text has a decimal point; use a comma')
  }

  /* ---- reading time ---- */
  const prose = [a.answer, ...a.keyPoints, ...a.faq.flatMap((f) => [f.q, f.a]), ...a.sections.flatMap((s) => [s.heading, ...s.blocks.filter((b) => b.kind === 'text' || b.kind === 'callout').map((b) => b.text)])]
  const en = prose.reduce((n, l) => n + words(l.en), 0)
  const est = Math.round(en / 200)
  console.log(`${w}: ${en} English words of prose → about ${est} min at 200 wpm; meta says ${m.readingMinutes}`)
  if (Math.abs(est - m.readingMinutes) > Math.max(3, est * 0.35)) flag(w, `readingMinutes ${m.readingMinutes} is far from the ~${est} the text implies`)

  /* ---- seo builder ---- */
  for (const lang of LANGS) {
    const seo = L.articleSeo(a, 'https://example.test/app', lang)
    if (!seo.canonical.endsWith('/')) flag(w, 'canonical must end with a slash')
    if (!seo.jsonLd.some((d) => d['@type'] === 'FAQPage')) flag(w, 'no FAQPage markup')
    if (!seo.jsonLd.some((d) => Array.isArray(d['@type']) && d['@type'].includes('Article'))) flag(w, 'no Article markup')
    const faq = seo.jsonLd.find((d) => d['@type'] === 'FAQPage')
    if (faq && faq.mainEntity.some((e) => /[$`*]/.test(e.name + e.acceptedAnswer.text))) flag(w, `FAQPage text still holds markup (${lang})`)
  }
}

/* ------------------------------------------------- internal links in text */

// `[label](article:id)` or `[label](article:id#section)` inside the prose of a
// section. A link inside the text is worth more than a list at the bottom: it
// sits where the reader needs the other article, with words around it that say
// why. So each article must have some, they must point somewhere real, and they
// must point to the same places in both languages.
const byId = new Map(loaded.map((a) => [a.id, a]))
for (const a of loaded) {
  const w = a.id
  const inText = /\/sections\/\d+\/blocks\/\d+\/text$/
  const targets = { en: [], id: [] }
  for (const [where, loc] of locs(a, w)) {
    for (const lang of LANGS) {
      const found = [...loc[lang].matchAll(LINK)]
      if (found.length && !inText.test(where)) flag(where, `internal links belong in the text of a section, not here (${lang})`)
      for (const f of found) {
        const [, label, id, hash] = f
        if (!label.trim() || /[$*`[\]]/.test(label)) flag(where, `link label "${label}" must be plain words (${lang})`)
        const t = byId.get(id)
        if (!t) flag(where, `link to "${id}", which is not an article (${lang})`)
        else if (id === a.id) flag(where, `link to the article itself (${lang})`)
        else if (hash && !t.sections.some((s) => s.id === hash)) flag(where, `link to "${id}#${hash}": no such section (${lang})`)
        targets[lang].push(`${id}#${hash ?? ''}`)
      }
    }
  }
  if (targets.en.join() !== targets.id.join()) flag(w, `inline links differ between the languages: ${targets.en.join(' ')} vs ${targets.id.join(' ')}`)
  const distinct = new Set(targets.en.map((t) => t.split('#')[0]))
  const want = Math.min(2, loaded.length - 1)
  if (distinct.size < want) flag(w, `needs inline links to at least ${want} other article(s) in its text, has ${distinct.size}`)
}

/* --------------------------------------------------------------- search */

if (L.ARTICLES.length) {
  const index = L.buildIndex(
    L.ARTICLES.map((a) => ({
      id: a.id,
      title: `${a.title.en} ${a.title.id}`,
      description: a.description.en,
      tags: a.tags,
      keywords: `${a.keywords.en} ${a.keywords.id}`,
    })),
  )
  const first = L.ARTICLES[0]
  const tests = [
    ['irrational', true],
    ['irrat', true],
    ['irrationl', true],
    ['Bilangan REAL', true],
    ['floating point', true],
    ['akar 2', true],
    ['zzzzqqq', false],
  ]
  for (const [query, expectFirst] of tests) {
    if (first.id !== 'real-numbers') break
    const hits = L.search(index, query)
    const found = hits.some((h) => h.id === 'real-numbers')
    if (found !== expectFirst) flag('search', `"${query}" ${expectFirst ? 'should find' : 'should not find'} real-numbers`)
  }
  if (L.search(index, '').length) flag('search', 'an empty query should return nothing')
}

/* --------------------------------------------------------------- result */

if (bad) {
  console.error(`\n${bad} problem(s)`)
  process.exit(1)
}
console.log(`\narticles check ok — ${L.ARTICLES.length} article(s), both languages`)
