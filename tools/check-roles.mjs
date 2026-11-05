/** Checks the roles of the local backend (src/lib/backends/local.ts) and the helpers that decide what the app shows (src/lib/roles.ts).
 *
 *  The database enforces the same rules in SQL, and `check-roles-sql.mjs` tests that on a real Postgres. This is the browser-only twin, which has to
 *  answer the same way so that the pages behave alike in both modes:
 *
 *   - the first real account in a browser is the admin; a teacher sign-up is pending; a sign-up cannot ask for admin;
 *   - a learner joins a teacher by username (any case) and only an approved teacher or an admin can be named; blank means the Nunada admin;
 *   - a teacher sees only the learners who chose them, an admin sees all, a pending or rejected teacher and a learner see none;
 *   - the admin lists the teachers, approves and rejects; nobody else can;
 *   - the leaderboards and public profiles leave teachers and admins out; a completion worth 0 XP records progress and no XP event;
 *   - the XP label of the top bar: 9999 for a teacher, the unlimited sign for an admin.
 *
 *  Run: npm run check:roles   Exit 1 on any failure. */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'roles-'))

// a browser's storage, for a module written against it
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  clear: () => store.clear(),
}

// The catalog names the course curricula it loads lazily; the roles do not need them.
const stubCurricula = {
  name: 'stub-curricula',
  setup(b) {
    b.onResolve({ filter: /^\.\/[a-z0-9-]+$/ }, (args) => (args.importer.endsWith('catalog.ts') ? { path: args.path, namespace: 'stub' } : undefined))
    b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export const modules = []', loader: 'js' }))
  },
}
const entry = path.join(tmp, 'entry.ts')
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')
fs.writeFileSync(entry, `export { createLocalBackend } from '${q('src/lib/backends/local.ts')}'\nexport * from '${q('src/lib/roles.ts')}'\nexport { AuthError } from '${q('src/lib/db.ts')}'`)
const out = path.join(tmp, 'entry.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error', plugins: [stubCurricula], define: { 'import.meta.env': '{}' } })
const M = await import(pathToFileURL(out).href)

let bad = 0
let checks = 0
const ok = (cond, msg) => {
  checks++
  if (!cond) {
    bad++
    console.log('FAIL: ' + msg)
  }
}
const fails = async (fn) => {
  try {
    await fn()
    return null
  } catch (e) {
    return e instanceof M.AuthError ? e.code : String(e.message ?? e)
  }
}

const b = M.createLocalBackend()
const up = (name, role) => b.signUp({ email: `${name}@x.test`, password: 'secret1', username: name, displayName: name, lang: 'en', role })
const state = async (id) => (await b.getState(id)).profile
const login = (name) => b.signIn({ email: `${name}@x.test`, password: 'secret1' })

/* ------------------------------------------------------------ sign-up and roles */

const nunada = (await up('Nunada')).user
ok((await state(nunada.id)).role === 'admin', 'the first real account in a browser is the admin')
const tea1 = (await up('tea1', 'teacher')).user
const tea2 = (await up('tea2', 'teacher')).user
const stu1 = (await up('stu1')).user
const stu2 = (await up('stu2')).user
const stu3 = (await up('stu3')).user
const evil = (await up('evil', 'admin')).user
ok((await state(tea1.id)).role === 'teacher' && (await state(tea1.id)).approval === 'pending', 'a teacher sign-up is pending')
ok((await state(stu1.id)).role === 'learner' && (await state(stu1.id)).approval === 'approved' && (await state(stu1.id)).teacher_id === null, 'a student is an approved learner with no teacher chosen yet')
ok((await state(evil.id)).role === 'learner', 'a sign-up cannot ask for admin')

/* ---------------------------------------------------------------- staff helpers */

const P = (role, approval) => ({ role, approval })
ok(M.isStaff(P('admin', 'approved')) && M.isStaff(P('teacher', 'approved')), 'an admin and an approved teacher are staff')
ok(!M.isStaff(P('teacher', 'pending')) && !M.isStaff(P('teacher', 'rejected')) && !M.isStaff(P('learner', 'approved')) && !M.isStaff(null), 'a pending or rejected teacher, a learner and nobody are not')
ok(M.isStaff({ role: 'teacher' }), 'a teacher from a database without the approval column is still staff')
ok(M.isAdmin(P('admin', 'approved')) && !M.isAdmin(P('teacher', 'approved')), 'only an admin is an admin')
ok(M.hasClassPage(P('teacher', 'pending')) && M.hasClassPage(P('admin', 'approved')) && !M.hasClassPage(P('learner', 'approved')), 'teachers (any approval) and admins have a class page, learners do not')
ok(M.staffXpLabel(P('teacher', 'approved')) === '9999' && M.staffXpLabel(P('admin', 'approved')) === '♾️', 'XP label: 9999 for a teacher, the unlimited sign for an admin')

/* -------------------------------------------------- nobody sees a roster by default */

const as = async (name) => {
  await login(name)
}
await as('tea1')
ok((await fails(() => b.teacherRoster())) === 'invalid', 'a pending teacher is refused the roster')
ok((await fails(() => b.teacherCourseProgress())) === 'invalid', 'a pending teacher is refused the course progress')
ok((await fails(() => b.adminTeachers())) === 'invalid', 'a teacher is refused the list of teachers')
ok((await fails(() => b.setTeacherApproval(tea1.id, 'approved'))) === 'invalid', 'a teacher cannot approve themselves')
await as('stu1')
ok((await fails(() => b.teacherRoster())) === 'invalid', 'a learner is refused the roster')
ok((await fails(() => b.setTeacherApproval(tea1.id, 'approved'))) === 'invalid', 'a learner cannot approve a teacher')

/* ---------------------------------------------------------- the admin approves */

await as('Nunada')
const list = await b.adminTeachers()
ok(list.length === 2 && list.every((x) => x.approval === 'pending'), 'the admin lists two teachers, both waiting')
ok(!list.some((x) => x.username === 'stu1' || x.username === 'Nunada'), 'the list holds teachers only')
await b.setTeacherApproval(tea1.id, 'approved')
await b.setTeacherApproval(tea2.id, 'rejected')
ok((await state(tea1.id)).approval === 'approved' && (await state(tea2.id)).approval === 'rejected', 'the admin approves one and turns down another')
ok((await fails(() => b.setTeacherApproval(stu1.id, 'approved'))) === 'invalid', 'only a teacher account can be approved')

/* ------------------------------------------------------------ joining a class */

const teacherOf = async (id) => (await b.getState(id)).teacher
await as('stu1')
ok((await teacherOf(stu1.id)).username === 'Nunada' && (await teacherOf(stu1.id)).role === 'admin', 'a learner who chose nobody belongs to the Nunada admin')
await b.setMyTeacher(stu1.id, 'TEA1')
ok((await teacherOf(stu1.id)).username === 'tea1' && (await state(stu1.id)).teacher_id === tea1.id, 'a learner joins an approved teacher by username, in any case')
await login('stu2')
await b.setMyTeacher(stu2.id, 'tea1')
await login('stu3')
await b.setMyTeacher(stu3.id, '')
ok((await state(stu3.id)).teacher_id === nunada.id, 'a blank username means the admin')
ok((await fails(() => b.setMyTeacher(stu3.id, 'tea2'))) === 'teacher-not-found', 'a teacher who was turned down cannot be joined')
const tea3 = (await up('tea3', 'teacher')).user
await login('stu3')
ok((await fails(() => b.setMyTeacher(stu3.id, 'tea3'))) === 'teacher-not-found', 'a teacher who is pending cannot be joined')
ok((await fails(() => b.setMyTeacher(stu3.id, 'nobody_here'))) === 'teacher-not-found', 'an unknown username is refused')
ok((await fails(() => b.setMyTeacher(stu3.id, 'stu1'))) === 'teacher-not-found', 'a learner cannot be named as a teacher')
ok((await state(stu3.id)).teacher_id === nunada.id, 'a refused name changes nothing')
await b.setMyTeacher(stu3.id, 'nunada')
ok((await teacherOf(stu3.id)).username === 'Nunada', 'the admin can be named, in any case')
await login('tea1')
ok((await fails(() => b.setMyTeacher(tea1.id, 'nunada'))) === 'invalid', 'a teacher has no teacher to choose')
ok((await b.getState(tea1.id)).teacher === null, 'and has none to show')

/* ------------------------------------------------------------- progress to see */

const done = async (name, id, course, item, kind, xp) => {
  await login(name)
  await b.completeItem(id, { courseId: course, itemId: item, kind, xp })
}
await done('stu1', stu1.id, 'python', 'p1', 'lesson', 10)
await done('stu1', stu1.id, 'python', 'p2', 'project', 20)
await done('stu2', stu2.id, 'html', 'h1', 'lesson', 10)
await done('stu3', stu3.id, 'css', 'c1', 'lesson', 15)
await done('tea1', tea1.id, 'python', 'a1', 'lesson', 0)
await done('Nunada', nunada.id, 'python', 'a2', 'lesson', 0)
ok((await b.getState(tea1.id)).xpEvents.length === 0 && (await b.getState(tea1.id)).progress.length === 1, 'a completion worth 0 XP records progress and no XP event')
await done('Nunada', nunada.id, 'python', 'a3', 'lesson', 50)

const names = (rows) => rows.map((r) => r.username.toLowerCase()).sort().join(',')

await login('tea1')
const r1 = await b.teacherRoster()
ok(names(r1) === 'stu1,stu2', `a teacher sees only their own students, got ${names(r1)}`)
ok(r1.find((r) => r.username === 'stu1').xp === 30 && r1.find((r) => r.username === 'stu1').lessons === 1 && r1.find((r) => r.username === 'stu1').projects === 1, 'and their numbers')
ok(r1.every((r) => r.teacher_username === 'tea1'), 'the class column names the teacher')
const c1 = await b.teacherCourseProgress()
ok(c1.length === 2 && c1.every((r) => r.user_id === stu1.id || r.user_id === stu2.id), 'course progress covers only their students')

await login('Nunada')
const ra = await b.teacherRoster()
ok(names(ra).includes('stu1') && names(ra).includes('stu2') && names(ra).includes('stu3') && names(ra).includes('evil'), 'the admin sees every learner')
ok(!ra.some((r) => ['nunada', 'tea1', 'tea2', 'tea3'].includes(r.username.toLowerCase())), 'teachers and admins are not rows of the roster')
ok(ra.find((r) => r.username === 'stu1').teacher_username === 'tea1' && ra.find((r) => r.username === 'evil').teacher_username === 'Nunada', "the admin's roster shows each learner's teacher, the admin for those who chose nobody")
ok((await b.teacherCourseProgress()).length >= 3, 'the admin sees all course progress')

await b.setTeacherApproval(tea1.id, 'rejected')
await login('tea1')
ok((await fails(() => b.teacherRoster())) === 'invalid', 'a teacher who is no longer approved loses the roster')
await login('Nunada')
await b.setTeacherApproval(tea1.id, 'approved')
await login('tea1')
ok(names(await b.teacherRoster()) === 'stu1,stu2', 'and gets it back when approved again')

/* ------------------------------------------------------- the admin moves a student */

await login('stu1')
ok((await fails(() => b.adminSetStudentTeacher(stu1.id, tea1.id))) === 'invalid', 'a learner cannot use the admin move')
await login('tea1')
ok((await fails(() => b.adminSetStudentTeacher(stu1.id, nunada.id))) === 'invalid', 'a teacher cannot move a student')
await login('Nunada')
await b.adminSetStudentTeacher(stu1.id, nunada.id)
ok((await state(stu1.id)).teacher_id === nunada.id, 'the admin moves a student to the admin')
await login('tea1')
ok(names(await b.teacherRoster()) === 'stu2', 'and the old teacher no longer sees them')
await login('Nunada')
ok((await fails(() => b.adminSetStudentTeacher(stu1.id, tea2.id))) === 'teacher-not-found', 'not to a teacher who was turned down')
ok((await fails(() => b.adminSetStudentTeacher(stu1.id, tea3.id))) === 'teacher-not-found', 'not to a teacher who is pending')
ok((await fails(() => b.adminSetStudentTeacher(stu1.id, stu2.id))) === 'teacher-not-found', 'not to a learner')
ok((await fails(() => b.adminSetStudentTeacher(stu1.id, 'nobody'))) === 'teacher-not-found', 'not to nobody')
ok((await fails(() => b.adminSetStudentTeacher(tea1.id, nunada.id))) === 'invalid', 'a teacher is not a student to move')
ok((await state(stu1.id)).teacher_id === nunada.id, 'refused moves change nothing')
await b.adminSetStudentTeacher(stu1.id, tea1.id)
await login('tea1')
ok(names(await b.teacherRoster()) === 'stu1,stu2', 'moved back to the teacher')

/* -------------------------------------------------------------- feedback for the admin */

const pause = () => new Promise((r) => setTimeout(r, 5))
for (const [name, user, rating, comment] of [['stu1', stu1, 5, 'great lessons'], ['stu2', stu2, 2, undefined], ['Nunada', nunada, 4, 'ok'], ['tea1', tea1, 3, 'class page is clear']]) {
  await login(name)
  await b.submitFeedback(user.id, rating, comment)
  await pause()
}
await login('Nunada')
const fb = await b.adminFeedback()
ok(fb.length === 4, `the admin reads all feedback, got ${fb.length}`)
ok(fb[0].username === 'tea1' && fb[3].username === 'stu1', `newest first, got ${fb.map((r) => r.username).join(',')}`)
ok(fb[0].role === 'teacher' && fb[3].comment === 'great lessons' && fb[3].rating === 5, 'with who wrote it, the rating and the comment')
ok(fb.find((r) => r.username === 'stu2').comment === null, 'an empty comment stays empty')
await login('stu1')
ok((await fails(() => b.adminFeedback())) === 'invalid', 'a learner cannot read the feedback')
await login('tea1')
ok((await fails(() => b.adminFeedback())) === 'invalid', 'nor a teacher')

/* ------------------------------------------------------------ boards leave staff out */

await login('stu1')
const board = (await b.leaderboard('alltime', 'all')).map((r) => r.username.toLowerCase())
ok(!board.includes('nunada') && !board.includes('tea1'), 'the leaderboard leaves out an admin who earned XP and a teacher')
ok((await b.publicProfile(nunada.id)) === null && (await b.publicProfile(tea1.id)) === null, "an admin's and a teacher's public profile cannot be opened")
ok((await b.publicProfile(stu1.id)) !== null, "a learner's can")

console.log(`roles check: ${checks} checks, ${bad} failure(s)`)
process.exit(bad ? 1 : 0)
