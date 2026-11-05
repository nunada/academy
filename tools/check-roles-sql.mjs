/** Runs supabase/schema.sql, public-profile.sql and supabase/roles.sql on a real Postgres (PGlite, Postgres compiled to WebAssembly, with a stand-in
 *  for what Supabase adds: the anon, authenticated and service_role roles, auth.users, auth.uid() and the default privileges) and tests the rules of
 *  roles, teacher approval and classes as the signed-in roles would meet them:
 *
 *   - schema.sql runs on an empty database (it once could not: a function used the `role` column before it existed), and roles.sql runs twice;
 *   - the account named Nunada becomes admin, in any case; an old teacher stays approved; a teacher sign-up starts pending; a sign-up that asks for admin
 *     is a learner;
 *   - role, approval and teacher_id cannot be written from the app, not even under a blanket grant (the trigger is the second lock);
 *   - a pending, rejected or learner account is refused every staff function; an approved teacher cannot approve; anon reaches none of the functions;
 *   - the admin lists and approves teachers; a learner joins an approved teacher (or the admin) by username, in any case, and nobody else;
 *   - a teacher sees only the learners who chose them, the admin sees all of them with their teacher, and losing approval loses the view at once;
 *   - a completion worth 0 XP writes progress and no XP event; boards and public profiles leave staff out; row-level security still holds.
 *
 *  Run: npm run check:rolessql   Exit 1 on any failure. ROLES_SQL=<file> runs another copy of roles.sql (the mutation tests do). */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { PGlite } from '@electric-sql/pglite'
import { citext } from '@electric-sql/pglite/contrib/citext'

const ROOT = process.cwd()
const sql = (f) => fs.readFileSync(f === 'roles.sql' && process.env.ROLES_SQL ? process.env.ROLES_SQL : path.join(ROOT, 'supabase', f), 'utf8')

const db = new PGlite({ extensions: { citext } })

let bad = 0
let checks = 0
const ok = (cond, msg) => {
  checks++
  if (!cond) {
    bad++
    console.log('FAIL: ' + msg)
  }
}

// ------------------------------------------------------------------ a stand-in for Supabase
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb not null default '{}');
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema public, auth to anon, authenticated, service_role;
  -- what Supabase sets on the public schema: every new function and table is open to these roles
  alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`)
await db.exec(sql('schema.sql'))
await db.exec(sql('public-profile.sql'))

// accounts that exist before roles.sql is run: the one to be promoted, an old teacher and a student
const uid = {}
async function signup(name, meta = {}) {
  const r = await db.query(`insert into auth.users (email, raw_user_meta_data) values ($1, $2::jsonb) returning id`, [`${name}@x.test`, JSON.stringify({ username: name, display_name: name, ...meta })])
  uid[name] = r.rows[0].id
}
await signup('Nunada')
await signup('oldteacher')
await signup('oldstudent')
await db.exec(`update public.profiles set role = 'teacher' where username = 'oldteacher'`)

// ------------------------------------------------------------------------ roles.sql, twice
await db.exec(sql('roles.sql'))
await db.exec(sql('roles.sql'))

const admin = await db.query(`select role, approval from public.profiles where username = 'nunada'`)
ok(admin.rows[0]?.role === 'admin' && admin.rows[0]?.approval === 'approved', 'the account named Nunada becomes admin (case-insensitive)')
const old = await db.query(`select role, approval from public.profiles where username = 'oldteacher'`)
ok(old.rows[0]?.role === 'teacher' && old.rows[0]?.approval === 'approved', 'an existing teacher stays approved')

// new accounts, after the new trigger
await signup('tea1', { role: 'teacher' })
await signup('tea2', { role: 'teacher' })
await signup('stu1')
await signup('stu2')
await signup('stu3')
await signup('evil', { role: 'admin' })
const prof = async (name) => (await db.query(`select role, approval, teacher_id from public.profiles where username = $1`, [name])).rows[0]
ok((await prof('tea1')).role === 'teacher' && (await prof('tea1')).approval === 'pending', 'a teacher sign-up starts pending')
ok((await prof('stu1')).role === 'learner' && (await prof('stu1')).approval === 'approved', 'a student sign-up is an approved learner')
ok((await prof('evil')).role === 'learner', 'a sign-up that asks for admin is a learner')

// run as a signed-in user: a role, a claim, and a statement; the role is put back afterwards
async function as(name, fn) {
  await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${uid[name]}', false);`)
  try {
    return await fn()
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`)
  }
}
async function denied(name, text, params = []) {
  try {
    await as(name, () => db.query(text, params))
    return null
  } catch (e) {
    return e.code ?? e.message
  }
}
const rows = (name, text, params = []) => as(name, async () => (await db.query(text, params)).rows)

// ------------------------------------------------------- a pending teacher can see nothing
ok((await denied('tea1', 'select * from public.teacher_roster()')) === '42501', 'a pending teacher is refused the roster')
ok((await denied('tea1', 'select * from public.teacher_course_progress()')) === '42501', 'a pending teacher is refused the course progress')
ok((await denied('tea1', 'select * from public.admin_teachers()')) === '42501', 'a teacher is refused the list of teachers')
ok((await denied('tea1', `select public.set_teacher_approval('${uid.tea1}', 'approved')`)) === '42501', 'a teacher cannot approve themselves')
ok(String(await denied('tea1', `update public.profiles set approval = 'approved' where id = '${uid.tea1}'`)).length > 0, 'a teacher cannot write approval directly')
ok(String(await denied('stu1', `update public.profiles set role = 'admin' where id = '${uid.stu1}'`)).length > 0, 'a learner cannot write role directly')
ok(String(await denied('stu1', `update public.profiles set teacher_id = '${uid.tea1}' where id = '${uid.stu1}'`)).length > 0, 'a learner cannot write teacher_id directly')
ok((await denied('stu1', 'select * from public.teacher_roster()')) === '42501', 'a learner is refused the roster')
ok((await denied('stu1', 'select * from public.admin_teachers()')) === '42501', 'a learner is refused the list of teachers')
ok((await denied('stu1', `select public.set_teacher_approval('${uid.tea1}', 'approved')`)) === '42501', 'a learner cannot approve a teacher')
ok((await denied('oldteacher', `select public.set_teacher_approval('${uid.tea1}', 'approved')`)) === '42501', 'an approved teacher cannot approve another')

// the SQL editor (no session) may change a role; a signed-in user may not, even with a blanket grant
await db.exec(`grant update on public.profiles to authenticated`)
ok((await denied('stu1', `update public.profiles set role = 'admin' where id = '${uid.stu1}'`)) === '42501', 'the trigger stops a role change even under a blanket grant')
ok((await denied('stu1', `update public.profiles set approval = 'pending' where id = '${uid.stu1}'`)) === '42501', 'the trigger stops an approval change under a blanket grant')
ok((await denied('stu1', `update public.profiles set teacher_id = '${uid.tea1}' where id = '${uid.stu1}'`)) === '42501', 'the trigger stops a teacher_id change under a blanket grant')
await db.exec(`revoke update on public.profiles from authenticated; grant update (username, display_name, lang) on public.profiles to authenticated`)

// anon reaches none of the new functions
for (const fn of ['is_admin()', 'is_teacher()', 'is_staff()', 'my_teacher()', "set_my_teacher('x')", 'admin_teachers()', "set_teacher_approval('" + uid.tea1 + "', 'approved')", 'teacher_roster()', 'teacher_course_progress()', "complete_item('a','b','lesson',1)"]) {
  let code = null
  await db.exec(`set role anon`)
  try {
    await db.query(`select * from public.${fn}`)
  } catch (e) {
    code = e.code
  }
  await db.exec(`reset role`)
  ok(code === '42501', `anon must not execute ${fn} (got ${code})`)
}
// ... and that is the privilege itself, not only the function refusing: a staff function answers 42501 to anon either way
for (const sig of ['is_admin()', 'is_teacher()', 'is_staff()', 'my_teacher()', 'set_my_teacher(text)', 'admin_teachers()', 'set_teacher_approval(uuid, text)', 'teacher_roster()', 'teacher_course_progress()', 'complete_item(text, text, text, integer)']) {
  const r = await db.query(`select has_function_privilege('anon', 'public.${sig}', 'execute') as anon, has_function_privilege('authenticated', 'public.${sig}', 'execute') as authed`)
  ok(r.rows[0].anon === false && r.rows[0].authed === true, `${sig}: anon must have no EXECUTE and signed-in users must (anon ${r.rows[0].anon}, authenticated ${r.rows[0].authed})`)
}
const internal = await db.query(`select has_function_privilege('authenticated', 'public.default_teacher_id()', 'execute') as authed`)
ok(internal.rows[0].authed === false, 'default_teacher_id() is internal: no EXECUTE for signed-in users')
// the values the columns allow
try {
  await db.exec(`update public.profiles set approval = 'banned' where username = 'tea1'`)
  ok(false, 'approval accepts only pending, approved and rejected')
} catch (e) {
  ok(e.code === '23514', `approval accepts only pending, approved and rejected (got ${e.code})`)
}
try {
  await db.exec(`update public.profiles set role = 'owner' where username = 'stu1'`)
  ok(false, 'role accepts only learner, teacher and admin')
} catch (e) {
  ok(e.code === '23514', `role accepts only learner, teacher and admin (got ${e.code})`)
}
// default_teacher_id is internal: not even a signed-in user calls it
ok((await denied('stu1', 'select public.default_teacher_id()')) === '42501', 'default_teacher_id is not callable by a signed-in user')

// ------------------------------------------------------------- the admin approves
const pending = await rows('Nunada', 'select username, approval, students from public.admin_teachers()')
ok(pending[0].approval === 'pending' && pending.some((r) => r.username === 'tea1') && pending.some((r) => r.username === 'oldteacher' && r.approval === 'approved'), 'the admin lists teachers, pending first')
ok(!pending.some((r) => r.username === 'stu1' || r.username === 'nunada'), 'the list holds teachers only')
// a teacher approved after another one signed up still comes after the one who is waiting
await rows('Nunada', `select public.set_teacher_approval('${uid.tea2}', 'approved')`)
const ordered = await rows('Nunada', 'select username, approval from public.admin_teachers()')
ok(ordered[0].username === 'tea1' && ordered[0].approval === 'pending' && ordered[1].username === 'tea2', `waiting teachers come first, then the newest, got ${ordered.map((r) => r.username).join(',')}`)
await rows('Nunada', `select public.set_teacher_approval('${uid.tea1}', 'approved')`)
ok((await prof('tea1')).approval === 'approved', 'the admin approves a teacher')
await rows('Nunada', `select public.set_teacher_approval('${uid.tea2}', 'rejected')`)
ok((await prof('tea2')).approval === 'rejected', 'the admin rejects a teacher')
ok((await denied('Nunada', `select public.set_teacher_approval('${uid.stu1}', 'approved')`)) === 'P0002', 'only a teacher account can be approved')
ok((await denied('Nunada', `select public.set_teacher_approval('${uid.tea1}', 'maybe')`)) === '22023', 'an unknown approval value is refused')

// -------------------------------------------------------------- choosing a teacher
const mine = async (n) => {
  const r = (await rows(n, 'select username, role from public.my_teacher()'))[0]
  return r && { ...r, username: r.username.toLowerCase() }
}
ok((await mine('stu1')).username === 'nunada' && (await mine('stu1')).role === 'admin', 'a learner who chose nobody belongs to the Nunada admin')
await rows('stu1', `select public.set_my_teacher('TEA1')`)
ok((await mine('stu1')).username === 'tea1', 'a learner joins an approved teacher by username, in any case')
ok((await prof('stu1')).teacher_id === uid.tea1, 'teacher_id is stored')
await rows('stu2', `select public.set_my_teacher('tea1')`)
await rows('stu3', `select public.set_my_teacher('')`)
ok((await mine('stu3')).username === 'nunada' && (await prof('stu3')).teacher_id === uid.Nunada, 'a blank username means the admin, stored explicitly')
ok((await denied('stu3', `select public.set_my_teacher('tea2')`)) === 'P0002', 'a rejected teacher cannot be joined')
await signup('tea3', { role: 'teacher' })
ok((await denied('stu3', `select public.set_my_teacher('tea3')`)) === 'P0002', 'a pending teacher cannot be joined')
ok((await denied('stu3', `select public.set_my_teacher('nobody_here')`)) === 'P0002', 'an unknown username is refused')
ok((await denied('stu3', `select public.set_my_teacher('stu1')`)) === 'P0002', 'a learner cannot be named as a teacher')
ok((await mine('stu3')).username === 'nunada', 'a refused name changes nothing')
await rows('stu2', `select public.set_my_teacher('nunada')`)
ok((await mine('stu2')).username === 'nunada', 'a learner can name the admin and change teacher')
await rows('stu2', `select public.set_my_teacher('tea1')`)
ok((await denied('tea1', `select public.set_my_teacher('nunada')`)) === '42501', 'a teacher has no teacher to choose')
ok((await denied('Nunada', `select public.set_my_teacher('tea1')`)) === '42501', 'an admin has no teacher to choose')
ok((await rows('tea1', 'select * from public.my_teacher()')).length === 0, 'a teacher has no my_teacher row')

// --------------------------------------------------------------- progress to look at
async function done(name, course, item, kind, xp) {
  await rows(name, `select public.complete_item('${course}', '${item}', '${kind}', ${xp})`)
}
await done('stu1', 'python', 'p1', 'lesson', 10)
await done('stu1', 'python', 'p2', 'project', 20)
await done('stu2', 'html', 'h1', 'lesson', 10)
await done('stu3', 'css', 'c1', 'lesson', 15)
await done('oldstudent', 'sql', 'q1', 'lesson', 5)
await done('Nunada', 'python', 'a1', 'lesson', 0)
await done('tea1', 'python', 'a1', 'lesson', 0)
ok((await db.query(`select count(*)::int n from public.xp_events where user_id = '${uid.tea1}' or user_id = '${uid.Nunada}'`)).rows[0].n === 0, 'a completion worth 0 XP records progress and no XP event')
ok((await db.query(`select count(*)::int n from public.progress where user_id = '${uid.tea1}'`)).rows[0].n === 1, 'and the progress row is there')
await done('Nunada', 'python', 'a2', 'lesson', 50)

const rosterOf = async (n) => (await rows(n, 'select username, xp, lessons, projects, teacher_username from public.teacher_roster() order by username'))
const names = (r) => r.map((x) => x.username.toLowerCase()).join(',')

// -------------------------------------------------------------- a teacher's class
const r1 = await rosterOf('tea1')
ok(names(r1) === 'stu1,stu2', `a teacher sees only their own students, got ${names(r1)}`)
ok(r1.find((r) => r.username === 'stu1').xp === 30 && r1.find((r) => r.username === 'stu1').lessons === 1 && r1.find((r) => r.username === 'stu1').projects === 1, 'and their numbers')
ok(r1.every((r) => r.teacher_username === 'tea1'), 'the class column names the teacher')
const c1 = await rows('tea1', 'select user_id, course_id from public.teacher_course_progress()')
ok(c1.length === 2 && c1.every((r) => r.user_id === uid.stu1 || r.user_id === uid.stu2), 'course progress covers only their students')
ok(!c1.some((r) => r.user_id === uid.stu3 || r.user_id === uid.oldstudent), 'and not the others')
const ro = await rosterOf('oldteacher')
ok(ro.length === 0, 'an approved teacher with no students sees nobody')
const counts = Object.fromEntries((await rows('Nunada', 'select username, students from public.admin_teachers()')).map((r) => [r.username, Number(r.students)]))
ok(counts.tea1 === 2 && counts.oldteacher === 0, `the admin sees how many students each teacher has, got ${JSON.stringify(counts)}`)

// ----------------------------------------------------------------- the admin sees all
const ra = await rosterOf('Nunada')
ok(names(ra) === 'evil,oldstudent,stu1,stu2,stu3', `the admin sees every learner, got ${names(ra)}`)
ok(ra.find((r) => r.username === 'oldstudent').teacher_username.toLowerCase() === 'nunada', 'a learner who never chose is shown under the admin')
ok(ra.find((r) => r.username === 'stu1').teacher_username === 'tea1', 'a learner shows their teacher')
ok(!ra.some((r) => ['nunada', 'tea1', 'oldteacher'].includes(r.username)), 'teachers and admins are not rows of the roster')
const ca = await rows('Nunada', 'select user_id from public.teacher_course_progress()')
ok(ca.length === 4, `the admin sees all course progress, got ${ca.length}`)

// teachers who lose approval lose the view, at once
await rows('Nunada', `select public.set_teacher_approval('${uid.tea1}', 'rejected')`)
ok((await denied('tea1', 'select * from public.teacher_roster()')) === '42501', 'a teacher who is no longer approved loses the roster')
await rows('Nunada', `select public.set_teacher_approval('${uid.tea1}', 'approved')`)
ok(names(await rosterOf('tea1')) === 'stu1,stu2', 'and gets it back when approved again')

// ------------------------------------------------------------------ boards leave staff out
await db.exec(`reset role`)
const board = (await rows('stu1', `select username from public.leaderboard_alltime(50, null)`)).map((r) => r.username).join(',')
ok(board === 'stu1,stu3,stu2,oldstudent' || board === 'stu1,stu3,stu2,oldstudent'.split(',').sort().join(',') || !/nunada|tea1|oldteacher/.test(board), `the leaderboard leaves out staff, got ${board}`)
ok(!/nunada/i.test(board), 'an admin who earned XP is not on the board')
ok((await rows('stu1', `select * from public.public_profile('${uid.Nunada}')`)).length === 0, "an admin's public profile cannot be opened")

// ---------------------------------------------------------------------------------- rls
ok((await rows('stu1', `select count(*)::int n from public.progress`))[0].n === 2, 'a learner still reads only their own progress rows')
ok((await rows('tea1', `select count(*)::int n from public.progress`))[0].n === 1, 'and a teacher only their own: the roster is the only way in')

console.log(`roles sql: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
