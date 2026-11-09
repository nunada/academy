// IndexNow: the key file, the reading of the sitemap, the choice of addresses, the request, and what the whole run does against a fake service.
// With a built site (dist/) it also checks that the key file is served at the root and that every address of the sitemap is on one host.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import * as I from './indexnow.mjs'

let bad = 0
let checks = 0
const ok = (c, m) => {
  checks++
  if (!c) {
    bad++
    if (bad <= 30) console.error('FAIL: ' + m)
  }
}
const throws = (f) => {
  try {
    f()
    return false
  } catch {
    return true
  }
}

const PUB = path.resolve('public')

// the key file: one, named like its key, holding exactly the key, in the alphabet of the protocol
{
  const key = I.findKey()
  ok(I.KEY_RE.test(key) && key.length >= 8 && key.length <= 128, 'the key follows the protocol')
  ok(fs.readFileSync(path.join(PUB, key + '.txt'), 'utf8').trim() === key, 'the key file holds the key')
  ok(!/\s/.test(fs.readFileSync(path.join(PUB, key + '.txt'), 'utf8').trim()), 'and nothing else')
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'))
  ok(throws(() => I.findKey(tmp)), 'no key file: an error')
  fs.writeFileSync(path.join(tmp, 'abcdefgh12345678.txt'), 'something else')
  ok(throws(() => I.findKey(tmp)), 'a file whose content is not its name is not a key')
  fs.writeFileSync(path.join(tmp, 'abcdefgh12345678.txt'), 'abcdefgh12345678\n')
  ok(I.findKey(tmp) === 'abcdefgh12345678', 'a file that holds its name is the key, with or without a newline')
  fs.writeFileSync(path.join(tmp, 'zzzzzzzz99999999.txt'), 'zzzzzzzz99999999')
  ok(throws(() => I.findKey(tmp)), 'two keys: an error, rather than a guess')
  fs.writeFileSync(path.join(tmp, 'short.txt'), 'short')
  fs.rmSync(path.join(tmp, 'zzzzzzzz99999999.txt'))
  ok(I.findKey(tmp) === 'abcdefgh12345678', 'a name too short for a key is ignored')
  fs.rmSync(tmp, { recursive: true })
}

// the sitemap
const XML = `<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.test/</loc>
  </url>
  <url>
    <loc>https://example.test/a/</loc>
    <lastmod>2026-11-08</lastmod>
    <xhtml:link rel="alternate" hreflang="id" href="https://example.test/b/" />
  </url>
  <url><loc> https://example.test/b/?x=1&amp;y=2 </loc><lastmod>2026-10-01</lastmod></url>
  <url>
    <loc>https://example.test/c/</loc>
    <lastmod>2026-11-10</lastmod>
  </url>
  <url>
    <loc>https://example.test/d/</loc>
    <lastmod>not a date</lastmod>
  </url>
  <url>
    <loc>https://example.test/a/</loc>
    <lastmod>2026-11-09</lastmod>
  </url>
</urlset>`
{
  const e = I.parseSitemap(XML)
  ok(e.length === 6, `parseSitemap found ${e.length} entries, not 6`)
  ok(e[0].loc === 'https://example.test/' && e[0].lastmod === null, 'an entry with no date')
  ok(e[1].loc === 'https://example.test/a/' && e[1].lastmod === '2026-11-08', 'its address and date; an alternate link is not an address')
  ok(e[2].loc === 'https://example.test/b/?x=1&y=2', 'spaces are trimmed and &amp; is read as &')
  ok(I.parseSitemap('<urlset></urlset>').length === 0, 'an empty sitemap')

  const now = new Date('2026-11-09T12:00:00Z')
  ok(I.pick(e, { all: true, now }).length === 5, 'all: every address, once')
  const two = I.pick(e, { days: 2, now })
  ok(JSON.stringify(two) === JSON.stringify(['https://example.test/a/', 'https://example.test/c/']), `2 days: ${JSON.stringify(two)}`)
  ok(I.pick(e, { days: 60, now }).includes('https://example.test/b/?x=1&y=2'), '60 days reaches 1 October')
  ok(!I.pick(e, { days: 60, now }).includes('https://example.test/'), 'a page with no date is never "changed"')
  ok(!I.pick(e, { days: 60, now }).includes('https://example.test/d/'), 'nor one with a date nobody can read')
  ok(I.pick(e, { days: 60, now }).includes('https://example.test/c/'), 'a date half a day ahead (another time zone) counts')
  ok(I.pick([{ loc: 'https://example.test/z/', lastmod: '2026-12-01' }], { days: 60, now }).length === 0, 'a date weeks ahead is a mistake, not a change')
  ok(I.pick(e, { days: 1, now }).length === 2 && I.pick(e, { days: 1, now }).every((u) => /\/(a|c)\/$/.test(u)),'1 day: the page of the 9th and the one of the 10th')
  ok(I.pick([], { all: true, now }).length === 0, 'nothing in, nothing out')
}

// the request
{
  const p = I.payload('example.test', 'abcdefgh12345678', ['https://example.test/a/', 'https://example.test/b/'])
  ok(p.host === 'example.test' && p.key === 'abcdefgh12345678' && p.keyLocation === 'https://example.test/abcdefgh12345678.txt' && p.urlList.length === 2, 'the body of the request')
  ok(throws(() => I.payload('example.test', 'k'.repeat(10), ['https://other.test/a/'])), 'an address on another host is refused')
  ok(throws(() => I.payload('example.test', 'k'.repeat(10), [])), 'no addresses is refused')
  ok(throws(() => I.payload('example.test', 'k'.repeat(10), Array.from({ length: I.MAX_URLS + 1 }, (_, i) => `https://example.test/${i}`))), 'more than the limit is refused')
  ok(!throws(() => I.payload('example.test', 'k'.repeat(10), Array.from({ length: I.MAX_URLS }, (_, i) => `https://example.test/${i}`))), 'exactly the limit is accepted')
  for (const [s, word] of [[200, 'accepted'], [202, 'accepted'], [400, 'bad request'], [403, 'key is not valid'], [422, 'host'], [429, 'too many'], [500, 'unexpected']]) ok(I.explain(s).includes(word), `explain(${s})`)
}

// a whole run against a fake service
{
  const key = I.findKey()
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'indexnow-'))
  const sm = path.join(tmp, 'sitemap.xml')
  const today = new Date().toISOString().slice(0, 10)
  const old = '2020-01-01'
  fs.writeFileSync(sm, `<urlset><url><loc>https://example.test/</loc></url><url><loc>https://example.test/new/</loc><lastmod>${today}</lastmod></url><url><loc>https://example.test/old/</loc><lastmod>${old}</lastmod></url></urlset>`)
  const fake = (status, keyOk = true) => {
    const calls = []
    const f = async (url, init) => {
      calls.push({ url, init })
      if (url.endsWith('.txt')) return { ok: keyOk, status: keyOk ? 200 : 404, text: async () => (keyOk ? key : 'not found') }
      return { ok: status < 400, status, text: async () => '' }
    }
    f.calls = calls
    return f
  }
  const quiet = []
  const log = (m) => quiet.push(m)

  let f = fake(200)
  ok((await I.run(['--sitemap', sm], { fetchImpl: f, log })) === 0, 'a run: success')
  const post = f.calls.find((c) => c.url === I.ENDPOINT)
  ok(post && post.init.method === 'POST', 'it posts to the IndexNow endpoint')
  const body = post && JSON.parse(post.init.body)
  ok(body && JSON.stringify(body.urlList) === JSON.stringify(['https://example.test/new/']) && body.key === key && body.host === 'example.test' && body.keyLocation === `https://example.test/${key}.txt`, 'and sends only the page that changed, with the key and where to find it')
  ok(f.calls.findIndex((c) => c.url.endsWith('.txt')) < f.calls.findIndex((c) => c.url === I.ENDPOINT), 'the key file is looked for before anything is sent')

  f = fake(202)
  ok((await I.run(['--sitemap', sm, '--all'], { fetchImpl: f, log })) === 0 && JSON.parse(f.calls.find((c) => c.url === I.ENDPOINT).init.body).urlList.length === 3, '--all sends the three pages; 202 is success')
  f = fake(200)
  ok((await I.run(['--sitemap', sm, '--dry-run', '--all'], { fetchImpl: f, log })) === 0 && f.calls.length === 0, '--dry-run sends nothing and asks for nothing')
  f = fake(403)
  ok((await I.run(['--sitemap', sm, '--all'], { fetchImpl: f, log })) === 1, 'an answer of 403 is a failure')
  f = fake(429)
  ok((await I.run(['--sitemap', sm, '--all'], { fetchImpl: f, log })) === 1, 'and so is 429')
  fs.writeFileSync(sm, `<urlset><url><loc>https://example.test/old/</loc><lastmod>${old}</lastmod></url></urlset>`)
  f = fake(200)
  ok((await I.run(['--sitemap', sm], { fetchImpl: f, log })) === 0 && f.calls.length === 0, 'nothing changed: nothing is sent, and it is not a failure')
  let threw = false
  try {
    await I.run(['--sitemap', sm, '--days', 'x'], { fetchImpl: f, log })
  } catch {
    threw = true
  }
  ok(threw, 'a --days that is not a number is an error')
  fs.rmSync(tmp, { recursive: true })
}

// the built site, when there is one: the key file is in the root, and the sitemap is on one host
if (fs.existsSync('dist/sitemap.xml')) {
  const key = I.findKey()
  ok(fs.existsSync(path.join('dist', key + '.txt')) && fs.readFileSync(path.join('dist', key + '.txt'), 'utf8').trim() === key, 'dist has the key file at its root')
  const entries = I.parseSitemap(fs.readFileSync('dist/sitemap.xml', 'utf8'))
  const hosts = new Set(entries.map((e) => new URL(e.loc).host))
  ok(entries.length > 50 && hosts.size === 1, `the sitemap has ${entries.length} addresses on ${hosts.size} host(s)`)
  const host = [...hosts][0]
  ok(host === fs.readFileSync('public/CNAME', 'utf8').trim(), 'and it is the host of the CNAME')
  const out = execFileSync('node', ['tools/indexnow.mjs', '--dry-run', '--all'], { encoding: 'utf8' })
  ok(out.includes(`${entries.length} of ${entries.length} pages`) && out.includes('dry run: nothing sent'), 'the real script, as a dry run over the whole sitemap')
  const robots = fs.readFileSync('dist/robots.txt', 'utf8')
  ok(!robots.includes('Disallow: /'), 'robots.txt lets the search engines in')
}

console.log(`indexnow check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
