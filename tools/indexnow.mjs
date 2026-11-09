#!/usr/bin/env node
/**
 * IndexNow: tells Bing, Yandex, Naver, Seznam and Yep (the search engines that take part; Google does not) which pages are new or changed.
 *
 * The protocol is one POST of a list of addresses. The engine checks that the site is the sender's by fetching a key file from the site's root:
 * `public/<key>.txt`, which contains the key and nothing else. The key is not a secret; the file is public by design.
 *
 *   node tools/indexnow.mjs                 the pages of the sitemap whose lastmod is within the last 2 days
 *   node tools/indexnow.mjs --days 7        ... within the last 7 days
 *   node tools/indexnow.mjs --all           every page of the sitemap (do this once, after setting up, and not again without a reason)
 *   node tools/indexnow.mjs --dry-run       show what would be sent and send nothing
 *   node tools/indexnow.mjs --sitemap https://nunada.my.id/sitemap.xml    read the sitemap from another place (default: dist/sitemap.xml)
 *
 * The CI job runs it after the deploy, so the key file is live when the search engine looks for it. A failure never fails the deploy.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const ENDPOINT = 'https://api.indexnow.org/indexnow'
/** the protocol takes at most this many addresses in one request */
export const MAX_URLS = 10000
/** the characters a key may have, and its length (the protocol's own rules) */
export const KEY_RE = /^[A-Za-z0-9-]{8,128}$/

/** The key: the one file in `public/` that is named like a key and holds exactly that key. */
export function findKey(publicDir = path.join(ROOT, 'public')) {
  const found = []
  for (const name of fs.readdirSync(publicDir)) {
    const m = /^(.+)\.txt$/.exec(name)
    if (!m || !KEY_RE.test(m[1])) continue
    if (fs.readFileSync(path.join(publicDir, name), 'utf8').trim() === m[1]) found.push(m[1])
  }
  if (found.length !== 1) throw new Error(`expected exactly one IndexNow key file in ${publicDir}, found ${found.length}`)
  return found[0]
}

/** The `<url>` entries of a sitemap: the address and, when there is one, the date it was last changed. */
export function parseSitemap(xml) {
  const out = []
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/.exec(block[1])
    if (!loc) continue
    const mod = /<lastmod>\s*([^<\s]+)\s*<\/lastmod>/.exec(block[1])
    out.push({ loc: loc[1].replace(/&amp;/g, '&'), lastmod: mod ? mod[1] : null })
  }
  return out
}

/** The addresses to send: all of them, or the ones changed within `days` days of `now` (a page with no date is not known to have changed). */
export function pick(entries, { all = false, days = 2, now = new Date() } = {}) {
  const urls = all
    ? entries.map((e) => e.loc)
    : entries.filter((e) => {
        if (!e.lastmod) return false
        const t = Date.parse(e.lastmod)
        if (Number.isNaN(t)) return false
        return now.getTime() - t <= days * 86400000 && t <= now.getTime() + 86400000
      }).map((e) => e.loc)
  return [...new Set(urls)]
}

/** The body of the request. Every address has to be on the host the key file is on. */
export function payload(host, key, urls) {
  const bad = urls.filter((u) => new URL(u).host !== host)
  if (bad.length) throw new Error(`addresses on another host than ${host}: ${bad.slice(0, 3).join(', ')}`)
  if (urls.length === 0 || urls.length > MAX_URLS) throw new Error(`${urls.length} addresses: IndexNow takes 1 to ${MAX_URLS} in a request`)
  return { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls }
}

/** What the answer of the service means. 200 and 202 are both success: 202 is "received, the key is being checked". */
export function explain(status) {
  if (status === 200) return 'accepted'
  if (status === 202) return 'accepted; the key file will be checked by the search engine'
  if (status === 400) return 'bad request: the format is wrong'
  if (status === 403) return 'the key is not valid: the key file was not found on the site, or does not hold the key'
  if (status === 422) return 'an address is not on the host of the key, or the key does not follow the protocol'
  if (status === 429) return 'too many requests: wait and send fewer'
  return `unexpected answer ${status}`
}

async function keyIsLive(host, key, fetchImpl, tries = 6, waitMs = 10000) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetchImpl(`https://${host}/${key}.txt`, { redirect: 'follow' })
      if (r.ok && (await r.text()).trim() === key) return true
    } catch {
      /* try again */
    }
    if (i < tries - 1) await new Promise((res) => setTimeout(res, waitMs))
  }
  return false
}

export async function run(argv, { fetchImpl = fetch, log = console.log } = {}) {
  const arg = (name) => {
    const i = argv.indexOf(name)
    return i >= 0 ? argv[i + 1] : undefined
  }
  const all = argv.includes('--all')
  const dry = argv.includes('--dry-run')
  const days = arg('--days') !== undefined ? Number(arg('--days')) : 2
  if (!Number.isFinite(days) || days < 0) throw new Error('--days wants a number of days')
  const where = arg('--sitemap') ?? path.join(ROOT, 'dist', 'sitemap.xml')
  const xml = /^https?:\/\//.test(where) ? await (await fetchImpl(where)).text() : fs.readFileSync(where, 'utf8')
  const entries = parseSitemap(xml)
  if (!entries.length) throw new Error(`no addresses in ${where}`)
  const host = new URL(entries[0].loc).host
  const key = findKey()
  const urls = pick(entries, { all, days })
  if (!urls.length) {
    log(`IndexNow: nothing changed in the last ${days} day(s) among ${entries.length} pages; nothing sent`)
    return 0
  }
  const body = payload(host, key, urls)
  log(`IndexNow: ${urls.length} of ${entries.length} pages for ${host}${all ? ' (all)' : ` (changed in the last ${days} day(s))`}`)
  if (dry) {
    for (const u of urls) log('  ' + u)
    log('dry run: nothing sent')
    return 0
  }
  if (!(await keyIsLive(host, key, fetchImpl))) {
    log(`IndexNow: https://${host}/${key}.txt is not live yet; nothing sent`)
    return 1
  }
  const r = await fetchImpl(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) })
  log(`IndexNow: ${r.status} ${explain(r.status)}`)
  return r.status === 200 || r.status === 202 ? 0 : 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error('IndexNow: ' + e.message)
      process.exit(1)
    },
  )
}
