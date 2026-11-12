/** Page view counts, the parts that run in the browser:
 *
 *   - the words ("1,234 views", "1 view", "1.234 dilihat"), the address rule, and which visitors are not counted;
 *   - one view per page per session, with a session storage, with none, and with one that throws;
 *   - the local backend answers like the database function: counts, reads, refuses a bad address with null, keeps kinds apart, survives damaged storage;
 *   - the address of every article and every game is one the database accepts, and no two share one;
 *   - every page that should show a number does, and the lists ask for the totals.
 *
 *  Run: npm run check:views   Exit 1 on any failure. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'views-'))

const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
}

const stubCurricula = {
  name: 'stub-curricula',
  setup(b) {
    b.onResolve({ filter: /^\.\/[a-z0-9-]+$/ }, (args) => (args.importer.endsWith('catalog.ts') ? { path: args.path, namespace: 'stub' } : undefined))
    b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export const modules = []', loader: 'js' }))
  },
}
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(
  entry,
  [
    `export * from '${q('src/lib/views.ts')}'`,
    `export { createLocalBackend } from '${q('src/lib/backends/local.ts')}'`,
    `export { GAMES } from '${q('src/content/games.ts')}'`,
    `export { ARTICLES } from '${q('src/content/articles/index.ts')}'`,
  ].join('\n'),
)
const out = path.join(tmp, 'entry.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error', plugins: [stubCurricula], define: { 'import.meta.env': '{}' } })
const M = await import(pathToFileURL(out).href)

let bad = 0
let checks = 0
const ok = (c, m) => {
  checks++
  if (!c) {
    bad++
    console.log('FAIL: ' + m)
  }
}

// ----------------------------------------------------------------- the words
ok(M.formatViews(1234, 'en') === '1,234' && M.formatViews(1234, 'id') === '1.234', 'thousands: a comma in English, a dot in Indonesian')
ok(M.formatViews(1234567, 'en') === '1,234,567' && M.formatViews(1234567, 'id') === '1.234.567', 'millions')
ok(M.formatViews(0, 'en') === '0' && M.formatViews(7, 'id') === '7' && M.formatViews(999, 'en') === '999', 'small numbers')
ok(M.formatViews(-5, 'en') === '0' && M.formatViews(12.9, 'en') === '12', 'never negative, whole numbers')
ok(M.viewsLabel(1, 'en') === '1 view' && M.viewsLabel(2, 'en') === '2 views' && M.viewsLabel(0, 'en') === '0 views', 'one view, many views')
ok(M.viewsLabel(1, 'id') === '1 dilihat' && M.viewsLabel(1234, 'id') === '1.234 dilihat', 'dilihat')

// -------------------------------------------------------------- the address
for (const [kind, slug, want] of [
  ['article', 'real-numbers', true],
  ['game', 'code-maze', true],
  ['article', 'a', true],
  ['article', '7-things', true],
  ['article', 'a' + 'b'.repeat(79), true],
  ['article', 'a' + 'b'.repeat(80), false],
  ['article', '', false],
  ['article', 'Real-Numbers', false],
  ['article', '-x', false],
  ['article', 'a b', false],
  ['article', 'a_b', false],
  ['article', 'a/b', false],
  ['page', 'real-numbers', false],
  ['', 'real-numbers', false],
]) ok(M.isViewKey(kind, slug) === want, `isViewKey(${JSON.stringify(kind)}, ${JSON.stringify(slug.slice(0, 12))}) is ${want}`)

// -------------------------------------------------- who is not counted
const robots = [
  { webdriver: true },
  { userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
  { userAgent: 'Mozilla/5.0 (compatible; bingbot/2.0)' },
  { userAgent: 'Mozilla/5.0 (compatible; YandexBot/3.0)' },
  { userAgent: 'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/120.0' },
  { userAgent: 'Mozilla/5.0 (compatible; Yahoo! Slurp)' },
  { userAgent: 'Mozilla/5.0 Chrome-Lighthouse' },
  { userAgent: 'facebookexternalhit/1.1' },
  { userAgent: 'Mozilla/5.0 (compatible; SomeSpider/1.0)' },
  { userAgent: 'Mozilla/5.0 (compatible; Crawler)' },
]
for (const r of robots) ok(M.looksLikeRobot(r) === true, `a robot: ${JSON.stringify(r).slice(0, 70)}`)
const people = [
  { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36', webdriver: false },
  { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
  { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36' },
  { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Gecko/20100101 Firefox/121.0' },
  {},
  undefined,
]
for (const p of people) ok(M.looksLikeRobot(p) === false, `a person: ${JSON.stringify(p)?.slice(0, 60)}`)

// ---------------------------------------------------- once per session
{
  const mem = new Map()
  const session = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) }
  const seen = new Set()
  ok(M.firstViewInSession(session, 'article', 'a', seen) === true, 'the first visit counts')
  ok(M.firstViewInSession(session, 'article', 'a', seen) === false, 'the second does not')
  ok(M.firstViewInSession(session, 'game', 'a', seen) === true, 'a game of the same address is another page')
  ok(M.firstViewInSession(session, 'article', 'b', seen) === true, 'another page counts')
  // a new page load in the same session: the set is empty, the storage remembers
  ok(M.firstViewInSession(session, 'article', 'a', new Set()) === false, 'a page opened again in the same session does not count')
  // no storage: one page load still counts once
  const s2 = new Set()
  ok(M.firstViewInSession(null, 'article', 'a', s2) === true && M.firstViewInSession(null, 'article', 'a', s2) === false, 'with no storage, once per page load')
  // storage that throws
  const broken = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
  const s3 = new Set()
  let threw = false
  let first
  let second
  try {
    first = M.firstViewInSession(broken, 'article', 'a', s3)
    second = M.firstViewInSession(broken, 'article', 'a', s3)
  } catch {
    threw = true
  }
  ok(!threw && first === true && second === false, 'storage that throws is not an error, and still counts once')
  ok([...mem.keys()].every((k) => k.startsWith('nunada.viewed.')), 'the keys have the app prefix')
}

// ------------------------------------------------------ the local backend
{
  const B = M.createLocalBackend()
  store.clear()
  ok((await B.pageView('article', 'real-numbers', true)) === 1, 'the first view is 1')
  ok((await B.pageView('article', 'real-numbers', true)) === 2, 'then 2')
  ok((await B.pageView('article', 'real-numbers', false)) === 2 && (await B.pageView('article', 'real-numbers', false)) === 2, 'a read does not count')
  ok((await B.pageView('article', 'integers', false)) === 0, 'an unseen page reads 0')
  ok(!JSON.stringify(await B.pageViews('article')).includes('integers'), '...and a read leaves no trace')
  ok((await B.pageView('game', 'real-numbers', true)) === 1 && (await B.pageView('article', 'real-numbers', false)) === 2, 'kinds are counted apart')
  for (const [k, s] of [['article', 'Bad-Slug'], ['article', ''], ['video', 'x'], ['article', "x'; drop"], ['article', 'a'.repeat(81)]]) {
    ok((await B.pageView(k, s, true)) === null && (await B.pageView(k, s, false)) === null, `a refused address gives null: ${k}/${s.slice(0, 10)}`)
  }
  ok(JSON.stringify(await B.pageViews('article')) === JSON.stringify({ 'real-numbers': 2 }), 'the totals of a kind')
  ok(JSON.stringify(await B.pageViews('game')) === JSON.stringify({ 'real-numbers': 1 }), 'and of the other kind')
  const copy = await B.pageViews('article')
  copy['real-numbers'] = 999
  ok((await B.pageViews('article'))['real-numbers'] === 2, 'the totals are a copy')
  // it survives a new backend, as a reload does
  ok((await M.createLocalBackend().pageView('article', 'real-numbers', true)) === 3, 'the counts are kept in storage')
  // damaged storage
  for (const junk of ['{not json', '[1,2]', '"x"', 'null', '']) {
    store.set('nunada.local.views.v1', junk)
    ok((await B.pageView('article', 'a', true)) === 1, `damaged storage (${junk.slice(0, 8)}) starts again instead of failing`)
    store.clear()
  }
  // storage that refuses to write
  const keep = globalThis.localStorage.setItem
  globalThis.localStorage.setItem = () => { throw new Error('full') }
  let threw = false
  let n
  try {
    n = await B.pageView('article', 'x', true)
  } catch {
    threw = true
  }
  globalThis.localStorage.setItem = keep
  ok(!threw && n === 1, 'storage that is full is not an error')
  store.clear()
  // the accounts database is not touched by a view
  ok(!store.has('nunada.local.db.v1'), 'a view creates no account data')
  await B.pageView('article', 'x', true)
  ok([...store.keys()].every((k) => k === 'nunada.local.views.v1'), 'only the views key is written')
}

// --------------------------------------------------- the addresses we have
{
  const ids = [...M.ARTICLES.map((a) => ['article', a.id]), ...M.GAMES.map((g) => ['game', g.id])]
  ok(M.ARTICLES.length >= 50 && M.GAMES.length >= 3, `${M.ARTICLES.length} articles and ${M.GAMES.length} games`)
  for (const [kind, id] of ids) ok(M.isViewKey(kind, id), `the ${kind} "${id}" has an address the database accepts`)
  ok(new Set(ids.map(([k, i]) => k + '/' + i)).size === ids.length, 'no two pages share an address')
  ok(ids.length < 1000, 'well inside the database ceiling of 1000 pages')
}

// ---------------------------------------------------------- the wiring
{
  const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8')
  ok(/<PageViews kind="article" slug=\{article\.id\} \/>/.test(read('src/pages/ArticlePage.tsx')), 'an article page shows its count')
  ok(/<PageViews kind="game" slug=\{game\.id\} \/>/.test(read('src/pages/GamePage.tsx')), 'a game page shows its count')
  ok(/usePageViews\('article'\)/.test(read('src/pages/Articles.tsx')) && /<Views n=\{views\[a\.id\]\}/.test(read('src/pages/Articles.tsx')), 'the articles list shows a count on each card')
  ok(/usePageViews\('game'\)/.test(read('src/pages/Games.tsx')) && /<Views n=\{views\[g\.id\]\}/.test(read('src/pages/Games.tsx')), 'the games list shows a count on each card')
  const sql = read('supabase/views.sql')
  ok(/revoke execute on function public\.page_view\(text, text, boolean\) from public, anon, authenticated/.test(sql), 'the SQL closes the functions to anon by name before opening them')
  ok(/slug ~ '\^\[a-z0-9\]\[a-z0-9-\]\{0,79\}\$'/.test(sql) && M.VIEW_SLUG.source === '^[a-z0-9][a-z0-9-]{0,79}$', 'the SQL and the app agree on what an address is')
  const be = read('src/lib/backends/supabase.ts')
  ok(/rpc\('page_view'/.test(be) && /rpc\('page_views'/.test(be), 'the Supabase backend calls both functions')
  ok(/catch \{\s*return null/.test(be) && /catch \{\s*return \{\}/.test(be), 'and swallows a failure, so a missing counter cannot break a page')
}

fs.rmSync(tmp, { recursive: true, force: true })
console.log(`views check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
