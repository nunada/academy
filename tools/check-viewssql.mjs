/** Runs supabase/views.sql on a real Postgres (PGlite, with a stand-in for the roles Supabase adds and for its default privileges) and tests the page
 *  view counter as the people who meet it would:
 *
 *   - the file runs twice (it is a migration to paste into the SQL editor, and may be pasted again);
 *   - a view is counted, a read is not, pages and kinds are counted apart, an unknown page reads as 0;
 *   - an address the table would refuse (a wrong kind, an upper-case or empty or too long slug, text that looks like SQL) is "unknown" (null), not an
 *     error, and writes nothing;
 *   - at most 1000 pages are ever counted: a new one is refused after that, the old ones keep counting;
 *   - anon and authenticated can call both functions and cannot touch the table in any way, not even under Supabase's blanket default grants;
 *   - the list of totals holds one kind, in order, with the right counts.
 *
 *  Run: npm run check:viewssql   Exit 1 on any failure. VIEWS_SQL=<file> runs another copy of views.sql (the mutation tests do). */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { PGlite } from '@electric-sql/pglite'

const ROOT = process.cwd()
const file = process.env.VIEWS_SQL ?? path.join(ROOT, 'supabase', 'views.sql')
const db = new PGlite()

let bad = 0
let checks = 0
const ok = (cond, msg) => {
  checks++
  if (!cond) {
    bad++
    console.log('FAIL: ' + msg)
  }
}

// what Supabase sets up: the roles, and every new function and table open to them by default
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`)
const text = fs.readFileSync(file, 'utf8')
await db.exec(text)
await db.exec(text) // pasted twice

const as = async (role, fn) => {
  await db.exec(`set role ${role}`)
  try {
    return await fn()
  } finally {
    await db.exec('reset role')
  }
}
const view = async (role, kind, slug, count) => (await as(role, () => db.query('select public.page_view($1, $2, $3) as n', [kind, slug, count]))).rows[0].n
const rows = async () => (await db.query('select kind, slug, views from public.page_views order by kind, slug')).rows
const refused = async (role, q) => {
  try {
    await as(role, () => db.query(q))
    return false
  } catch (e) {
    return /permission denied|row-level security/i.test(String(e.message))
  }
}

// ---------------------------------------------------------------- counting
ok((await view('anon', 'article', 'real-numbers', true)) === 1, 'the first view of a page is 1 (counted by anon)')
ok((await view('anon', 'article', 'real-numbers', true)) === 2 && (await view('authenticated', 'article', 'real-numbers', true)) === 3, 'it goes on counting, for anon and for a signed-in user alike')
ok((await view('anon', 'article', 'real-numbers', false)) === 3, 'a read answers with the total')
ok((await view('anon', 'article', 'real-numbers', false)) === 3, 'and does not count')
ok((await view('anon', 'article', 'integers', false)) === 0, 'a page nobody has opened reads 0')
ok((await rows()).every((r) => r.slug !== 'integers'), 'and a read makes no row for it')
ok((await view('anon', 'game', 'real-numbers', true)) === 1 && (await view('anon', 'article', 'real-numbers', false)) === 3, 'a game and an article of the same address are counted apart')
ok((await view('anon', 'article', 'integers', true)) === 1, 'another page counts from 1')
ok(Number((await view('anon', 'article', 'real-numbers', null))) === 4, 'a null "count" counts: only an explicit false is a read')
ok(typeof (await view('anon', 'article', 'real-numbers', true)) === 'string' || typeof (await view('anon', 'article', 'real-numbers', true)) === 'number', 'the total is a number')

// --------------------------------------------------------- what it refuses
const before = JSON.stringify(await rows())
const longest = 'a' + 'b'.repeat(79)
const refusals = [
  ['article', 'Real-Numbers'],
  ['article', ''],
  ['article', '-leading-hyphen'],
  ['article', 'has space'],
  ['article', 'under_score'],
  ['article', 'a' + 'b'.repeat(80)],
  ['article', "x'; drop table public.page_views; --"],
  ['article', 'ünïcode'],
  ['article', null],
  ['page', 'real-numbers'],
  ['Article', 'real-numbers'],
  ['', 'real-numbers'],
  [null, 'real-numbers'],
]
for (const [kind, slug] of refusals) {
  for (const count of [true, false]) {
    let n
    let threw = false
    try {
      n = await view('anon', kind, slug, count)
    } catch {
      threw = true
    }
    ok(!threw && n === null, `refused as unknown, not as an error: ${JSON.stringify([kind, slug, count])} → ${threw ? 'error' : n}`)
  }
}
ok(JSON.stringify(await rows()) === before, 'and none of it wrote a row')
ok((await view('anon', 'article', longest, true)) === 1, 'a slug of exactly 80 characters is accepted')
ok((await view('anon', 'article', 'a', true)) === 1 && (await view('anon', 'article', '7-things', true)) === 1, 'a one-letter slug, and one that starts with a digit, are accepted')

// the table itself says no as well, for whoever might write to it directly
for (const [q, why] of [
  ["insert into public.page_views (kind, slug, views) values ('video', 'x', 1)", 'a wrong kind'],
  ["insert into public.page_views (kind, slug, views) values ('article', 'X', 1)", 'a bad slug'],
  ["insert into public.page_views (kind, slug, views) values ('article', 'neg', -1)", 'a negative count'],
]) {
  let rejected = false
  try {
    await db.exec(q)
  } catch {
    rejected = true
  }
  ok(rejected, `the table refuses ${why}`)
}

// ------------------------------------------------------------- the ceiling
{
  const have = (await rows()).length
  await db.exec(`insert into public.page_views (kind, slug, views) select 'article', 'fill-' || g, 1 from generate_series(1, ${999 - have}) g`)
  ok((await rows()).length === 999, 'the table holds 999 pages')
  ok((await view('anon', 'game', 'the-thousandth', true)) === 1 && (await rows()).length === 1000, 'the 1000th page is still accepted')
  ok((await view('anon', 'article', 'one-too-many', true)) === null, 'a 1001st page is refused')
  ok((await rows()).length === 1000, 'and not written')
  ok((await view('anon', 'game', 'one-too-many', true)) === null, 'for games too')
  ok((await view('anon', 'article', 'real-numbers', true)) !== null && (await view('anon', 'article', 'fill-1', true)) === 2, 'a page that is already counted goes on counting')
  ok((await view('anon', 'article', 'one-too-many', false)) === 0, 'an unseen page can still be read as 0')
  await db.exec(`delete from public.page_views where slug like 'fill-%'`)
}

// ------------------------------------------------------------------ who can do what
for (const role of ['anon', 'authenticated']) {
  for (const q of ['select * from public.page_views', "insert into public.page_views values ('article', 'sneaky', 99)", "update public.page_views set views = 0", 'delete from public.page_views', 'truncate public.page_views']) {
    ok(await refused(role, q), `${role} cannot touch the table: ${q}`)
  }
  const fns = (await db.query(`select has_function_privilege('${role}', 'public.page_view(text, text, boolean)', 'execute') as a, has_function_privilege('${role}', 'public.page_views(text)', 'execute') as b`)).rows[0]
  ok(fns.a === true && fns.b === true, `${role} can run both functions`)
}
{
  // the functions are security definer, so the table is read for the caller; and the search path is pinned
  const f = (await db.query(`select proname, prosecdef, proconfig from pg_proc where proname in ('page_view', 'page_views') order by proname`)).rows
  ok(f.length === 2 && f.every((r) => r.prosecdef === true), 'both functions are security definer')
  ok(f.every((r) => (r.proconfig ?? []).some((c) => c.startsWith('search_path='))), 'with a pinned search_path')
  const t = (await db.query(`select relrowsecurity from pg_class where relname = 'page_views'`)).rows[0]
  ok(t.relrowsecurity === true, 'row-level security is on')
  const g = (await db.query(`select count(*)::int as n from information_schema.role_table_grants where table_name = 'page_views' and grantee in ('anon', 'authenticated', 'PUBLIC')`)).rows[0]
  ok(g.n === 0, `no table privilege is left for anon, authenticated or PUBLIC (${g.n})`)
}

// --------------------------------------------------------------- the totals
{
  await db.exec('truncate public.page_views')
  for (const [k, s, n] of [['article', 'b-page', 3], ['article', 'a-page', 1], ['game', 'zeta', 5], ['article', 'c-page', 2]]) for (let i = 0; i < n; i++) await view('anon', k, s, true)
  const a = (await as('anon', () => db.query(`select * from public.page_views('article')`))).rows
  ok(JSON.stringify(a.map((r) => [r.slug, Number(r.views)])) === JSON.stringify([['a-page', 1], ['b-page', 3], ['c-page', 2]]), 'the totals of a kind, in order of address')
  const g = (await as('authenticated', () => db.query(`select * from public.page_views('game')`))).rows
  ok(g.length === 1 && g[0].slug === 'zeta' && Number(g[0].views) === 5, 'games are listed apart from articles')
  ok((await as('anon', () => db.query(`select * from public.page_views('video')`))).rows.length === 0 && (await as('anon', () => db.query(`select * from public.page_views(null)`))).rows.length === 0, 'an unknown kind lists nothing')
  const cols = Object.keys(a[0]).sort().join()
  ok(cols === 'slug,views', `the list gives only slug and views (${cols})`)
}

console.log(`views sql check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
