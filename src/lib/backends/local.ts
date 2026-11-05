/** localStorage backend — the fallback when no Supabase keys are configured.
 *
 *  It exists so the app is runnable (and demo-able) out of the box. It is NOT a
 *  security boundary: passwords are only lightly hashed and everything lives in
 *  the browser. The UI shows a "Local mode" badge whenever this one is active. */

import type {
  AuthUser,
  Backend,
  CertificateRow,
  CourseProgressRow,
  Enrollment,
  LeaderRow,
  LeaderboardKind,
  LeaderboardTrack,
  MedalCounts,
  Profile,
  ProgressItem,
  Approval,
  Role,
  RosterRow,
  TeacherAccountRow,
  TeacherInfo,
  TrophyRow,
  UserState,
  XpEvent,
} from '../db'
import { isStaff } from '../roles'
import { AuthError } from '../db'
import type { Lang } from '../../content/types'
import { MAX_HEARTS, loseHeart, resolveHearts } from '../hearts'
import { isThisWeek, weekStart } from '../week'
import { coursesIn } from '../../content/catalog'

const KEY = 'nunada.local.db.v1'
const SESSION_KEY = 'nunada.local.session'

interface Account {
  id: string
  email: string
  passwordHash: string
  profile: Profile
  progress: ProgressItem[]
  xpEvents: XpEvent[]
  enrollments: Enrollment[]
  trophies: TrophyRow[]
  certificates: CertificateRow[]
  feedback: { rating: number; comment?: string; created_at: string }[]
  hearts: { hearts: number; updated_at: string }
  /** Rivals on the leaderboard are seeded with plain totals instead of events,
   *  split by track so the filtered boards are not a list of one. */
  seeded?: { weekly: TrackXp; alltime: TrackXp; trophies: number }
  /** Outstanding password-reset token. One at a time, spent on use — the same
   *  two rules Supabase's emailed link follows. */
  reset?: { token: string; expires: number }
}

interface Db {
  accounts: Account[]
}

function hash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return `h${(h >>> 0).toString(36)}`
}

const now = () => new Date().toISOString()

/** XP split the way the boards split it. The two always sum to the total. */
interface TrackXp {
  code: number
  math: number
}

/** Deliberately lopsided rivals: somebody near the top of the combined board
 *  who is nowhere on the mathematics one is the whole reason the filter is
 *  worth having, and the seeds should show it rather than hide it. */
const SEED: {
  username: string
  display_name: string
  weekly: TrackXp
  alltime: TrackXp
  trophies: number
}[] = [
  { username: 'rania_dev', display_name: 'Rania P.', weekly: { code: 320, math: 20 }, alltime: { code: 1720, math: 100 }, trophies: 6 },
  { username: 'bagas', display_name: 'Bagas W.', weekly: { code: 55, math: 220 }, alltime: { code: 190, math: 800 }, trophies: 4 },
  { username: 'nadia.codes', display_name: 'Nadia S.', weekly: { code: 130, math: 80 }, alltime: { code: 1640, math: 700 }, trophies: 8 },
  { username: 'ilham_r', display_name: 'Ilham R.', weekly: { code: 0, math: 160 }, alltime: { code: 40, math: 600 }, trophies: 3 },
  { username: 'putri', display_name: 'Putri A.', weekly: { code: 95, math: 0 }, alltime: { code: 1210, math: 0 }, trophies: 5 },
  { username: 'dimas', display_name: 'Dimas H.', weekly: { code: 20, math: 40 }, alltime: { code: 120, math: 200 }, trophies: 2 },
]

function blankAccount(
  id: string,
  email: string,
  passwordHash: string,
  username: string,
  displayName: string,
  lang: Lang,
  role: Role = 'learner',
  approval: Approval = 'approved',
): Account {
  return {
    id,
    email,
    passwordHash,
    profile: { id, username, display_name: displayName, lang, created_at: now(), role, approval, teacher_id: null },
    progress: [],
    xpEvents: [],
    enrollments: [],
    trophies: [],
    certificates: [],
    feedback: [],
    hearts: { hearts: MAX_HEARTS, updated_at: now() },
  }
}

/** Accounts saved before roles existed have no `role` at all. Rather than
 *  clearing the store and taking somebody's practice with it, the field is
 *  filled in on the way past, by the same rule sign-up uses: the first real
 *  account in this browser owns the sandbox. */
function normalise(db: Db): boolean {
  const known = db.accounts.some((a) => (a.profile as Partial<Profile>).role)
  let changed = false
  let owner = !known
  for (const a of db.accounts) {
    // A store written before the boards were split has plain numbers here.
    // Those seeds predate the mathematics courses, so all of it is `code` —
    // reading it as anything else would be inventing a standing nobody earned.
    if (a.seeded && typeof (a.seeded.weekly as unknown) === 'number') {
      const old = a.seeded as unknown as { weekly: number; alltime: number; trophies: number }
      a.seeded = {
        weekly: { code: old.weekly, math: 0 },
        alltime: { code: old.alltime, math: 0 },
        trophies: old.trophies,
      }
      changed = true
    }
    // A store written before feedback existed has no array to push into.
    if (!a.feedback) {
      a.feedback = []
      changed = true
    }
    // A store written before approval and classes existed: teachers stay approved, nobody has chosen a teacher yet.
    if (!(a.profile as Partial<Profile>).approval) {
      a.profile.approval = 'approved'
      changed = true
    }
    if ((a.profile as Partial<Profile>).teacher_id === undefined) {
      a.profile.teacher_id = null
      changed = true
    }
    if ((a.profile as Partial<Profile>).role) continue
    a.profile.role = owner && !a.seeded ? 'admin' : 'learner'
    if (!a.seeded) owner = false
    changed = true
  }
  return changed
}

/** The admin a learner belongs to when they chose nobody: the account named "nunada", or else the oldest admin. */
function defaultAdmin(db: Db): Account | undefined {
  const admins = db.accounts.filter((a) => a.profile.role === 'admin')
  return admins.find((a) => a.profile.username.toLowerCase() === 'nunada') ?? admins.sort((x, y) => x.profile.created_at.localeCompare(y.profile.created_at))[0]
}

/** Whom a learner studies with; nobody for a teacher or an admin. */
function teacherOf(db: Db, a: Account): TeacherInfo | null {
  if (a.profile.role !== 'learner') return null
  const t = (a.profile.teacher_id && db.accounts.find((x) => x.id === a.profile.teacher_id)) || defaultAdmin(db)
  return t ? { id: t.id, username: t.profile.username, display_name: t.profile.display_name, role: t.profile.role === 'admin' ? 'admin' : 'teacher' } : null
}

/** The learners a member of staff may see: an admin sees all of them, an approved teacher the ones who chose them. */
function classOf(db: Db, me: Account | undefined): Account[] {
  if (!me || !isStaff(me.profile)) throw new AuthError('teachers only', 'invalid')
  return db.accounts.filter((a) => a.profile.role === 'learner' && (me.profile.role === 'admin' || a.profile.teacher_id === me.id))
}

function load(): Db {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const db = JSON.parse(raw) as Db
      if (normalise(db)) save(db)
      return db
    }
  } catch {
    /* corrupt store — start over */
  }
  const db: Db = { accounts: [] }
  for (const s of SEED) {
    const acc = blankAccount(`seed-${s.username}`, `${s.username}@example.com`, hash('seed'), s.username, s.display_name, 'id')
    acc.seeded = { weekly: s.weekly, alltime: s.alltime, trophies: s.trophies }
    db.accounts.push(acc)
  }
  localStorage.setItem(KEY, JSON.stringify(db))
  return db
}

function save(db: Db) {
  localStorage.setItem(KEY, JSON.stringify(db))
}

function find(db: Db, id: string): Account {
  const a = db.accounts.find((x) => x.id === id)
  if (!a) throw new AuthError('account not found', 'invalid')
  return a
}

const alltimeXpOf = (a: Account): number =>
  a.seeded ? a.seeded.alltime.code + a.seeded.alltime.math : a.xpEvents.reduce((n, e) => n + e.amount, 0)

/** How many *completed* weeks (never the one still running — its rank can
 *  still change) this learner placed 1st/2nd/3rd overall. Walks every distinct
 *  week their own xpEvents touch and re-ranks that one week against everybody
 *  else's total for it, rather than keeping a running counter anywhere:
 *  xpEvents already is the full history, so there is nothing to keep in sync. */
function weeklyMedalsOf(db: Db, who: Account): MedalCounts {
  if (who.seeded) return { gold: 0, silver: 0, bronze: 0 }

  const thisWeekStart = weekStart().getTime()
  const pastWeeks = new Set<number>()
  for (const e of who.xpEvents) {
    const s = weekStart(new Date(e.created_at)).getTime()
    if (s < thisWeekStart) pastWeeks.add(s)
  }

  let gold = 0
  let silver = 0
  let bronze = 0
  for (const wk of pastWeeks) {
    const totals = db.accounts
      .filter((a) => a.profile.role === 'learner')
      .map((a) => ({
        user_id: a.id,
        // A rival's seeded weekly figure stands in for every week alike —
        // there is no invented history behind it to look up instead.
        value: a.seeded
          ? a.seeded.weekly.code + a.seeded.weekly.math
          : a.xpEvents
              .filter((e) => weekStart(new Date(e.created_at)).getTime() === wk)
              .reduce((n, e) => n + e.amount, 0),
      }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value)

    const rank = totals.findIndex((r) => r.user_id === who.id)
    if (rank === 0) gold++
    else if (rank === 1) silver++
    else if (rank === 2) bronze++
  }
  return { gold, silver, bronze }
}

export function createLocalBackend(): Backend {
  const listeners = new Set<(u: AuthUser | null) => void>()

  const emit = (u: AuthUser | null) => listeners.forEach((l) => l(u))

  const toState = (a: Account): UserState => ({
    profile: a.profile,
    progress: a.progress,
    xpEvents: a.xpEvents,
    enrollments: a.enrollments,
    trophies: a.trophies,
    certificates: a.certificates,
    hearts: a.hearts,
    teacher: teacherOf(load(), a),
  })

  return {
    mode: 'local',

    async getSession() {
      const id = localStorage.getItem(SESSION_KEY)
      if (!id) return null
      const db = load()
      const a = db.accounts.find((x) => x.id === id)
      return a ? { id: a.id, email: a.email } : null
    },

    onAuthChange(cb) {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },

    async signUp({ email, password, username, displayName, lang, role }) {
      const db = load()
      const mail = email.trim().toLowerCase()
      const user = username.trim()
      if (password.length < 6) throw new AuthError('weak', 'weak-password')
      if (!mail || !user) throw new AuthError('invalid', 'invalid')
      if (db.accounts.some((a) => a.email === mail)) throw new AuthError('taken', 'email-taken')
      if (db.accounts.some((a) => a.profile.username.toLowerCase() === user.toLowerCase()))
        throw new AuthError('taken', 'username-taken')

      // The first real account in this browser is the admin. Local mode is a
      // one-person sandbox seeded with six invented rivals, so whoever opens it
      // is the owner — and without this the admin and teacher pages could only
      // ever be seen against a live Supabase project. Everybody after that is a
      // learner, or a teacher waiting for the admin's approval, as in the database.
      const firstReal = !db.accounts.some((a) => !a.seeded)
      const wantsTeacher = role === 'teacher'
      const acc = blankAccount(
        // the clock alone gives two accounts made in the same millisecond one id
        `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
        mail,
        hash(password),
        user,
        displayName.trim() || user,
        lang,
        firstReal ? 'admin' : wantsTeacher ? 'teacher' : 'learner',
        wantsTeacher && !firstReal ? 'pending' : 'approved',
      )
      db.accounts.push(acc)
      save(db)
      localStorage.setItem(SESSION_KEY, acc.id)
      const u = { id: acc.id, email: acc.email }
      emit(u)
      // Local mode has no email to confirm, so there is nothing to wait for.
      return { user: u, needsConfirmation: false }
    },

    async signIn({ email, password }) {
      const db = load()
      const mail = email.trim().toLowerCase()
      const acc = db.accounts.find((a) => a.email === mail)
      if (!acc || acc.passwordHash !== hash(password)) throw new AuthError('bad', 'bad-credentials')
      localStorage.setItem(SESSION_KEY, acc.id)
      const u = { id: acc.id, email: acc.email }
      emit(u)
      return u
    },

    async signOut() {
      localStorage.removeItem(SESSION_KEY)
      emit(null)
    },

    async requestPasswordReset(email) {
      const db = load()
      const acc = db.accounts.find((a) => a.email === email.trim().toLowerCase())
      // Deliberately silent about a miss. There is nobody to hide from inside
      // one browser, but the page above must behave identically in both modes,
      // and the only way to be sure of that is to give it nothing to tell apart.
      if (!acc) return {}

      const token = `r_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
      acc.reset = { token, expires: Date.now() + 3600_000 }
      save(db)
      // No email to send it in, so it goes back to the caller and the page
      // prints it. Local mode is a sandbox; this is the honest version of a
      // link that would otherwise never arrive.
      return { localLink: `/reset-password?token=${token}` }
    },

    async updatePassword(password, token) {
      if (password.length < 6) throw new AuthError('weak', 'weak-password')
      const db = load()

      const acc = token
        ? db.accounts.find((a) => a.reset?.token === token && a.reset.expires > Date.now())
        : db.accounts.find((a) => a.id === localStorage.getItem(SESSION_KEY))

      if (!acc) throw new AuthError('no such token or session', token ? 'link-expired' : 'invalid')

      acc.passwordHash = hash(password)
      // Spent, whether it was used to reset or not — a link that still works
      // after it has been followed is not a reset link.
      delete acc.reset
      save(db)

      // Following the link signs you in, the way the emailed one does.
      localStorage.setItem(SESSION_KEY, acc.id)
      emit({ id: acc.id, email: acc.email })
    },

    async getState(userId) {
      const db = load()
      const a = find(db, userId)
      const resolved = resolveHearts(a.hearts)
      if (resolved.persist) {
        a.hearts = resolved.persist
        save(db)
      }
      return toState(a)
    },

    async setLang(userId, lang) {
      const db = load()
      find(db, userId).profile.lang = lang
      save(db)
    },

    async updateProfile(userId, { username, displayName }) {
      const db = load()
      const a = find(db, userId)

      if (username !== undefined) {
        const trimmed = username.trim()
        const changing = trimmed.toLowerCase() !== a.profile.username.toLowerCase()
        if (changing && db.accounts.some((x) => x.id !== userId && x.profile.username.toLowerCase() === trimmed.toLowerCase())) {
          throw new AuthError('taken', 'username-taken')
        }
        a.profile.username = trimmed
      }
      if (displayName !== undefined) {
        a.profile.display_name = displayName.trim() || a.profile.display_name
      }

      save(db)
      return a.profile
    },

    async setMyTeacher(userId, username) {
      const db = load()
      const a = find(db, userId)
      if (a.profile.role !== 'learner') throw new AuthError('learners only', 'invalid')
      const name = (username ?? '').trim()
      let target: Account | undefined
      if (!name) target = defaultAdmin(db)
      else {
        // Only an admin or an approved teacher can be named; a name that is nobody's and a teacher who is not
        // approved get the same answer, as in the database.
        target = db.accounts.find(
          (x) => x.profile.username.toLowerCase() === name.toLowerCase() && (x.profile.role === 'admin' || (x.profile.role === 'teacher' && x.profile.approval === 'approved')),
        )
      }
      if (!target) throw new AuthError('teacher not found', 'teacher-not-found')
      a.profile.teacher_id = target.id
      save(db)
      return { profile: a.profile, teacher: teacherOf(db, a) }
    },

    async enroll(userId, kind, refId) {
      const db = load()
      const a = find(db, userId)
      if (!a.enrollments.some((e) => e.kind === kind && e.ref_id === refId)) {
        a.enrollments.push({ kind, ref_id: refId, enrolled_at: now() })
        save(db)
      }
      return a.enrollments
    },

    async completeItem(userId, item) {
      const db = load()
      const a = find(db, userId)
      const already = a.progress.some((p) => p.item_id === item.itemId)
      if (already) return { progress: a.progress, xpEvents: a.xpEvents, awardedXp: 0 }

      const stamp = now()
      a.progress.push({
        course_id: item.courseId,
        item_id: item.itemId,
        kind: item.kind,
        xp: item.xp,
        completed_at: stamp,
      })
      // Staff finish items worth 0 XP: the progress row is kept, and no XP event is written (the database does the same).
      if (item.xp > 0) {
        a.xpEvents.push({
          amount: item.xp,
          source: `${item.kind}:${item.itemId}`,
          course_id: item.courseId,
          created_at: stamp,
        })
      }
      save(db)
      return { progress: a.progress, xpEvents: a.xpEvents, awardedXp: item.xp }
    },

    async spendHeart(userId) {
      const db = load()
      const a = find(db, userId)
      a.hearts = loseHeart(a.hearts)
      save(db)
      return a.hearts
    },

    async syncHearts(userId, row) {
      const db = load()
      find(db, userId).hearts = row
      save(db)
    },

    async awardTrophies(userId, ids) {
      const db = load()
      const a = find(db, userId)
      let changed = false
      for (const id of ids) {
        if (!a.trophies.some((t) => t.trophy_id === id)) {
          a.trophies.push({ trophy_id: id, earned_at: now() })
          changed = true
        }
      }
      if (changed) save(db)
      return a.trophies
    },

    async issueCertificate(userId, kind, refId) {
      const db = load()
      const a = find(db, userId)
      if (!a.certificates.some((c) => c.kind === kind && c.ref_id === refId)) {
        a.certificates.push({
          kind,
          ref_id: refId,
          // Random suffix for the same reason as the SQL version: a course and its
          // path finish together, so a clock-only serial repeats itself.
          serial: `NA-${kind === 'course' ? 'C' : 'P'}-${Date.now().toString(36).toUpperCase()}-${Math.random()
            .toString(36)
            .slice(2, 8)
            .toUpperCase()}`,
          issued_at: now(),
        })
        save(db)
      }
      return a.certificates
    },

    async submitFeedback(userId, rating, comment) {
      const db = load()
      const a = find(db, userId)
      a.feedback.push({ rating, comment, created_at: now() })
      save(db)
    },

    async leaderboard(kind: LeaderboardKind, track: LeaderboardTrack) {
      const db = load()
      // Which courses count. The trophy board counts all of them: a trophy for
      // earning 100 XP in total belongs to neither track.
      const counted =
        kind === 'trophies' || track === 'all' ? null : new Set(coursesIn(track).map((c) => c.id))
      const mine = (e: XpEvent) => counted === null || (e.course_id != null && counted.has(e.course_id))
      const seededXp = (t: TrackXp) => (track === 'all' ? t.code + t.math : t[track])

      // A teacher account never earns XP or trophies today, but that is a
      // caller-side convention, not something enforced where xpEvents/trophies
      // get written — so this filters on role directly rather than trusting
      // every value to already be zero.
      const rows: LeaderRow[] = db.accounts
        .filter((a) => a.profile.role === 'learner')
        .map((a) => {
          let value: number
          if (kind === 'trophies') {
            value = a.seeded ? a.seeded.trophies : a.trophies.length
          } else if (kind === 'weekly') {
            value = a.seeded
              ? seededXp(a.seeded.weekly)
              : a.xpEvents.filter((e) => isThisWeek(e.created_at) && mine(e)).reduce((n, e) => n + e.amount, 0)
          } else {
            value = a.seeded
              ? seededXp(a.seeded.alltime)
              : a.xpEvents.filter(mine).reduce((n, e) => n + e.amount, 0)
          }
          return {
            user_id: a.id,
            username: a.profile.username,
            display_name: a.profile.display_name,
            value,
          }
        })
      return rows.filter((r) => r.value > 0).sort((a, b) => b.value - a.value)
    },

    // How many *completed* weeks (never the one still running — its rank can
    // still change) the signed-in learner placed 1st/2nd/3rd overall. Walks
    // every distinct week their own xpEvents touch and re-ranks that one week
    // against everybody else's total for it, rather than keeping a running
    // counter anywhere: xp_events already is the full history, so there is
    // nothing to keep in sync.
    async myWeeklyMedals() {
      const db = load()
      const me = db.accounts.find((a) => a.id === localStorage.getItem(SESSION_KEY))
      return me ? weeklyMedalsOf(db, me) : { gold: 0, silver: 0, bronze: 0 }
    },

    // Same shape the database function returns, and the same refusals: nobody
    // for an unknown id, and nobody for a teacher. Never the email or the
    // password hash, which sit on the account beside everything read here.
    async publicProfile(userId) {
      const db = load()
      const a = db.accounts.find((x) => x.id === userId)
      if (!a || a.profile.role !== 'learner') return null

      const place = db.accounts
        .filter((x) => x.profile.role === 'learner')
        .map((x) => ({ id: x.id, xp: alltimeXpOf(x), name: x.profile.username }))
        .filter((r) => r.xp > 0)
        .sort((p, q) => q.xp - p.xp || p.name.localeCompare(q.name))
        .findIndex((r) => r.id === a.id)

      return {
        user_id: a.id,
        username: a.profile.username,
        display_name: a.profile.display_name,
        created_at: a.profile.created_at,
        xp_total: alltimeXpOf(a),
        xp_week: a.seeded
          ? a.seeded.weekly.code + a.seeded.weekly.math
          : a.xpEvents.filter((e) => isThisWeek(e.created_at)).reduce((n, e) => n + e.amount, 0),
        trophy_ids: a.trophies.map((t) => t.trophy_id),
        trophy_count: a.seeded ? a.seeded.trophies : a.trophies.length,
        certificates: a.certificates.map((c) => ({ kind: c.kind, ref_id: c.ref_id, issued_at: c.issued_at })),
        medals: weeklyMedalsOf(db, a),
        alltime_rank: place >= 0 && place < 3 ? place + 1 : null,
      }
    },

    async teacherRoster() {
      const db = load()
      const me = db.accounts.find((a) => a.id === localStorage.getItem(SESSION_KEY))
      // Not a security boundary — everything here is in one browser already —
      // but refusing mirrors what the database does, so the page's error path
      // is the same one in both modes.
      const mine = classOf(db, me)

      const rows: RosterRow[] = mine.map((a) => ({
        teacher_username: teacherOf(db, a)?.username ?? null,
        teacher_name: teacherOf(db, a)?.display_name ?? null,
        user_id: a.id,
        username: a.profile.username,
        display_name: a.profile.display_name,
        role: a.profile.role,
        created_at: a.profile.created_at,
        // Deliberately not the seeded totals the leaderboard uses. Those rivals
        // are invented to keep a board from being empty, and they have no
        // progress rows behind them — reporting their XP here would print a
        // learner with 2,340 XP who has never started anything. This page is
        // about work actually done, so it counts rows and nothing else.
        //
        // The real backend cannot disagree with itself this way: complete_item
        // writes the progress row and the XP event together.
        xp: a.xpEvents.reduce((n, e) => n + e.amount, 0),
        lessons: a.progress.filter((p) => p.kind === 'lesson').length,
        projects: a.progress.filter((p) => p.kind === 'project').length,
        trophies: a.trophies.length,
        certificates: a.certificates.length,
        last_active: a.progress.reduce<string | null>(
          (latest, p) => (latest && latest > p.completed_at ? latest : p.completed_at),
          null,
        ),
      }))
      return rows.sort((x, y) => y.xp - x.xp || x.username.localeCompare(y.username))
    },

    async teacherCourseProgress() {
      const db = load()
      const me = db.accounts.find((a) => a.id === localStorage.getItem(SESSION_KEY))
      const out: CourseProgressRow[] = []
      for (const a of classOf(db, me)) {
        const byCourse = new Map<string, ProgressItem[]>()
        for (const p of a.progress) {
          const list = byCourse.get(p.course_id)
          if (list) list.push(p)
          else byCourse.set(p.course_id, [p])
        }
        for (const [course_id, items] of byCourse) {
          out.push({
            user_id: a.id,
            course_id,
            lessons: items.filter((i) => i.kind === 'lesson').length,
            projects: items.filter((i) => i.kind === 'project').length,
            last_touched: items.reduce((l, i) => (l > i.completed_at ? l : i.completed_at), items[0].completed_at),
          })
        }
      }
      return out
    },

    async adminTeachers() {
      const db = load()
      const me = db.accounts.find((a) => a.id === localStorage.getItem(SESSION_KEY))
      if (me?.profile.role !== 'admin') throw new AuthError('admins only', 'invalid')
      const rows: TeacherAccountRow[] = db.accounts
        .filter((a) => a.profile.role === 'teacher')
        .map((a) => ({
          user_id: a.id,
          username: a.profile.username,
          display_name: a.profile.display_name,
          approval: a.profile.approval,
          created_at: a.profile.created_at,
          students: db.accounts.filter((s) => s.profile.role === 'learner' && s.profile.teacher_id === a.id).length,
        }))
      // those waiting come first, then the newest
      return rows.sort((x, y) => Number(y.approval === 'pending') - Number(x.approval === 'pending') || y.created_at.localeCompare(x.created_at))
    },

    async setTeacherApproval(userId, approval) {
      const db = load()
      const me = db.accounts.find((a) => a.id === localStorage.getItem(SESSION_KEY))
      if (me?.profile.role !== 'admin') throw new AuthError('admins only', 'invalid')
      const target = db.accounts.find((a) => a.id === userId)
      if (!target || target.profile.role !== 'teacher') throw new AuthError('not a teacher account', 'invalid')
      target.profile.approval = approval
      save(db)
    },
  }
}
