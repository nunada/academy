/** The shape every backend must provide.
 *
 *  Two implementations exist:
 *    - `backends/supabase.ts` — the real one (Postgres + Supabase Auth)
 *    - `backends/local.ts`    — a localStorage stand-in so the app runs with no keys
 *  `getBackend()` picks based on whether VITE_SUPABASE_URL is set. */

import type { Lang } from '../content/types'

export interface AuthUser {
  id: string
  email: string
}

export type Role = 'learner' | 'teacher'

export interface Profile {
  id: string
  username: string
  display_name: string
  lang: Lang
  created_at: string
  /** Only a teacher may read the roster. Set by hand from the SQL editor —
   *  the database refuses to let anybody assign it to themselves. */
  role: Role
}

export interface ProgressItem {
  course_id: string
  item_id: string
  kind: 'lesson' | 'project'
  xp: number
  completed_at: string
}

export interface XpEvent {
  amount: number
  source: string
  created_at: string
}

export interface Enrollment {
  kind: 'course' | 'path'
  ref_id: string
  enrolled_at: string
}

export interface TrophyRow {
  trophy_id: string
  earned_at: string
}

export interface CertificateRow {
  kind: 'course' | 'path'
  ref_id: string
  serial: string
  issued_at: string
}

export interface UserState {
  profile: Profile
  progress: ProgressItem[]
  xpEvents: XpEvent[]
  enrollments: Enrollment[]
  trophies: TrophyRow[]
  certificates: CertificateRow[]
  hearts: { hearts: number; updated_at: string }
}

export interface LeaderRow {
  user_id: string
  username: string
  display_name: string
  value: number
}

export type LeaderboardKind = 'weekly' | 'alltime' | 'trophies'

/** One learner as a teacher sees them. Everybody appears, including somebody
 *  who signed up and finished nothing — `last_active` is null for them. */
export interface RosterRow {
  user_id: string
  username: string
  display_name: string
  role: Role
  created_at: string
  xp: number
  lessons: number
  projects: number
  trophies: number
  certificates: number
  last_active: string | null
}

/** Counts only. How many items a course holds belongs to the curriculum, and
 *  the catalogue already carries it — so the denominator is applied here
 *  rather than duplicated into SQL. */
export interface CourseProgressRow {
  user_id: string
  course_id: string
  lessons: number
  projects: number
  last_touched: string
}

export interface Backend {
  readonly mode: 'supabase' | 'local'

  getSession(): Promise<AuthUser | null>
  onAuthChange(cb: (user: AuthUser | null) => void): () => void
  signUp(input: { email: string; password: string; username: string; displayName: string; lang: Lang }): Promise<AuthUser>
  signIn(input: { email: string; password: string }): Promise<AuthUser>
  signOut(): Promise<void>

  getState(userId: string): Promise<UserState>
  setLang(userId: string, lang: Lang): Promise<void>
  enroll(userId: string, kind: 'course' | 'path', refId: string): Promise<Enrollment[]>
  /** Idempotent: completing an already-finished item awards no extra XP. */
  completeItem(
    userId: string,
    item: { courseId: string; itemId: string; kind: 'lesson' | 'project'; xp: number },
  ): Promise<{ progress: ProgressItem[]; xpEvents: XpEvent[]; awardedXp: number }>
  spendHeart(userId: string): Promise<{ hearts: number; updated_at: string }>
  syncHearts(userId: string, row: { hearts: number; updated_at: string }): Promise<void>
  awardTrophies(userId: string, ids: string[]): Promise<TrophyRow[]>
  issueCertificate(userId: string, kind: 'course' | 'path', refId: string): Promise<CertificateRow[]>
  leaderboard(kind: LeaderboardKind): Promise<LeaderRow[]>

  /** Both are teachers-only. The check lives in the database, not here: these
   *  read every learner's rows, so a client-side guard would be decoration. */
  teacherRoster(): Promise<RosterRow[]>
  teacherCourseProgress(): Promise<CourseProgressRow[]>
}

export class AuthError extends Error {
  constructor(
    message: string,
    /** Key into `authErrors` so the message can be shown in the learner's language. */
    public code: 'email-taken' | 'username-taken' | 'bad-credentials' | 'weak-password' | 'invalid' | 'unknown' = 'unknown',
  ) {
    super(message)
  }
}

export const authErrors: Record<string, { en: string; id: string }> = {
  'email-taken': { en: 'That email is already registered.', id: 'Email itu sudah terdaftar.' },
  'username-taken': { en: 'That username is taken.', id: 'Nama pengguna itu sudah dipakai.' },
  'bad-credentials': { en: 'Wrong email or password.', id: 'Email atau kata sandi salah.' },
  'weak-password': { en: 'Password must be at least 6 characters.', id: 'Kata sandi minimal 6 karakter.' },
  invalid: { en: 'Please check the form and try again.', id: 'Periksa kembali isian lalu coba lagi.' },
  unknown: { en: 'Something went wrong. Try again.', id: 'Terjadi kesalahan. Coba lagi.' },
}

export const hasSupabaseConfig =
  Boolean(import.meta.env.VITE_SUPABASE_URL) && Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY)
