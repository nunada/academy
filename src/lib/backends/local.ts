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
  Profile,
  ProgressItem,
  Role,
  RosterRow,
  TrophyRow,
  UserState,
  XpEvent,
} from '../db'
import { AuthError } from '../db'
import type { Lang } from '../../content/types'
import { MAX_HEARTS, loseHeart, resolveHearts } from '../hearts'
import { isThisWeek } from '../week'

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
  hearts: { hearts: number; updated_at: string }
  /** Rivals on the leaderboard are seeded with plain totals instead of events. */
  seeded?: { weekly: number; alltime: number; trophies: number }
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

const SEED: { username: string; display_name: string; weekly: number; alltime: number; trophies: number }[] = [
  { username: 'rania_dev', display_name: 'Rania P.', weekly: 340, alltime: 1820, trophies: 6 },
  { username: 'bagas', display_name: 'Bagas W.', weekly: 275, alltime: 990, trophies: 4 },
  { username: 'nadia.codes', display_name: 'Nadia S.', weekly: 210, alltime: 2340, trophies: 8 },
  { username: 'ilham_r', display_name: 'Ilham R.', weekly: 160, alltime: 640, trophies: 3 },
  { username: 'putri', display_name: 'Putri A.', weekly: 95, alltime: 1210, trophies: 5 },
  { username: 'dimas', display_name: 'Dimas H.', weekly: 60, alltime: 320, trophies: 2 },
]

function blankAccount(
  id: string,
  email: string,
  passwordHash: string,
  username: string,
  displayName: string,
  lang: Lang,
  role: Role = 'learner',
): Account {
  return {
    id,
    email,
    passwordHash,
    profile: { id, username, display_name: displayName, lang, created_at: now(), role },
    progress: [],
    xpEvents: [],
    enrollments: [],
    trophies: [],
    certificates: [],
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
    if ((a.profile as Partial<Profile>).role) continue
    a.profile.role = owner && !a.seeded ? 'teacher' : 'learner'
    if (!a.seeded) owner = false
    changed = true
  }
  return changed
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

    async signUp({ email, password, username, displayName, lang }) {
      const db = load()
      const mail = email.trim().toLowerCase()
      const user = username.trim()
      if (password.length < 6) throw new AuthError('weak', 'weak-password')
      if (!mail || !user) throw new AuthError('invalid', 'invalid')
      if (db.accounts.some((a) => a.email === mail)) throw new AuthError('taken', 'email-taken')
      if (db.accounts.some((a) => a.profile.username.toLowerCase() === user.toLowerCase()))
        throw new AuthError('taken', 'username-taken')

      // The first real account in this browser is the teacher. Local mode is a
      // one-person sandbox seeded with six invented rivals, so whoever opens it
      // is the owner — and without this the teacher page could only ever be
      // seen against a live Supabase project.
      const firstReal = !db.accounts.some((a) => !a.seeded)
      const acc = blankAccount(
        `u_${Date.now().toString(36)}`,
        mail,
        hash(password),
        user,
        displayName.trim() || user,
        lang,
        firstReal ? 'teacher' : 'learner',
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
      a.xpEvents.push({ amount: item.xp, source: `${item.kind}:${item.itemId}`, created_at: stamp })
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

    async leaderboard(kind: LeaderboardKind) {
      const db = load()
      const rows: LeaderRow[] = db.accounts.map((a) => {
        let value: number
        if (kind === 'trophies') {
          value = a.seeded ? a.seeded.trophies : a.trophies.length
        } else if (kind === 'weekly') {
          value = a.seeded
            ? a.seeded.weekly
            : a.xpEvents.filter((e) => isThisWeek(e.created_at)).reduce((n, e) => n + e.amount, 0)
        } else {
          value = a.seeded ? a.seeded.alltime : a.xpEvents.reduce((n, e) => n + e.amount, 0)
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

    async teacherRoster() {
      const db = load()
      const me = db.accounts.find((a) => a.id === localStorage.getItem(SESSION_KEY))
      // Not a security boundary — everything here is in one browser already —
      // but refusing mirrors what the database does, so the page's error path
      // is the same one in both modes.
      if (me?.profile.role !== 'teacher') throw new AuthError('teachers only', 'invalid')

      const rows: RosterRow[] = db.accounts.map((a) => ({
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
      if (me?.profile.role !== 'teacher') throw new AuthError('teachers only', 'invalid')

      const out: CourseProgressRow[] = []
      for (const a of db.accounts) {
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
  }
}
