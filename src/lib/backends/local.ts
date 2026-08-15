/** localStorage backend — the fallback when no Supabase keys are configured.
 *
 *  It exists so the app is runnable (and demo-able) out of the box. It is NOT a
 *  security boundary: passwords are only lightly hashed and everything lives in
 *  the browser. The UI shows a "Local mode" badge whenever this one is active. */

import type {
  AuthUser,
  Backend,
  CertificateRow,
  Enrollment,
  LeaderRow,
  LeaderboardKind,
  Profile,
  ProgressItem,
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

function blankAccount(id: string, email: string, passwordHash: string, username: string, displayName: string, lang: Lang): Account {
  return {
    id,
    email,
    passwordHash,
    profile: { id, username, display_name: displayName, lang, created_at: now() },
    progress: [],
    xpEvents: [],
    enrollments: [],
    trophies: [],
    certificates: [],
    hearts: { hearts: MAX_HEARTS, updated_at: now() },
  }
}

function load(): Db {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Db
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

      const acc = blankAccount(`u_${Date.now().toString(36)}`, mail, hash(password), user, displayName.trim() || user, lang)
      db.accounts.push(acc)
      save(db)
      localStorage.setItem(SESSION_KEY, acc.id)
      const u = { id: acc.id, email: acc.email }
      emit(u)
      return u
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
  }
}
