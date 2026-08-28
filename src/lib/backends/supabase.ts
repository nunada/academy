/** Supabase backend — Postgres + Supabase Auth.
 *  Mirrors `supabase/schema.sql`; run that file once before using this. */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
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
  RosterRow,
  TrophyRow,
  UserState,
  XpEvent,
} from '../db'
import { AuthError } from '../db'
import { coursesIn } from '../../content/catalog'
import { MAX_HEARTS } from '../hearts'

function client(): SupabaseClient {
  return createClient(import.meta.env.VITE_SUPABASE_URL as string, import.meta.env.VITE_SUPABASE_ANON_KEY as string, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
}

const RPC_BY_KIND: Record<LeaderboardKind, string> = {
  weekly: 'leaderboard_weekly',
  alltime: 'leaderboard_alltime',
  trophies: 'leaderboard_trophies',
}

export function createSupabaseBackend(): Backend {
  const sb = client()

  return {
    mode: 'supabase',

    async getSession() {
      const { data } = await sb.auth.getSession()
      const u = data.session?.user
      return u ? { id: u.id, email: u.email ?? '' } : null
    },

    onAuthChange(cb: (u: AuthUser | null) => void) {
      const { data } = sb.auth.onAuthStateChange((_event, session) => {
        const u = session?.user
        cb(u ? { id: u.id, email: u.email ?? '' } : null)
      })
      return () => data.subscription.unsubscribe()
    },

    async signUp({ email, password, username, displayName, lang }) {
      if (password.length < 6) throw new AuthError('weak', 'weak-password')

      // Check the name first: a unique-violation inside the profile trigger would
      // leave a half-created auth user behind.
      const { data: free, error: checkErr } = await sb.rpc('username_available', { p_username: username })
      if (checkErr) throw new AuthError(checkErr.message, 'unknown')
      if (!free) throw new AuthError('taken', 'username-taken')

      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: { username, display_name: displayName || username, lang },
          // Without this, the confirmation link points at whatever the project's
          // Site URL happens to be — which is localhost until somebody
          // remembers to change it, and then nobody can confirm an account.
          // Asking for the address this copy is actually served from means a
          // deploy anywhere works, provided that address is on Supabase's
          // redirect allow-list.
          emailRedirectTo: window.location.origin + import.meta.env.BASE_URL,
        },
      })
      if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes('already')) throw new AuthError(error.message, 'email-taken')
        if (msg.includes('password')) throw new AuthError(error.message, 'weak-password')
        throw new AuthError(error.message, 'unknown')
      }
      const u = data.user
      if (!u) throw new AuthError('no user returned', 'unknown')
      // data.session is null exactly when confirmation is required — Supabase
      // creates the account either way, but only a real session lets getState
      // read the profile row past RLS.
      return { user: { id: u.id, email: u.email ?? email }, needsConfirmation: !data.session }
    },

    async signIn({ email, password }) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password })
      if (error) throw new AuthError(error.message, 'bad-credentials')
      const u = data.user
      if (!u) throw new AuthError('no user returned', 'unknown')
      return { id: u.id, email: u.email ?? email }
    },

    async signOut() {
      await sb.auth.signOut()
    },

    async requestPasswordReset(email) {
      // The address of this copy, not a hard-coded one, for the same reason
      // sign-up does it: a build served anywhere sends people back to where
      // they started. It has to be on Supabase's redirect allow-list.
      const redirectTo = window.location.origin + import.meta.env.BASE_URL + 'reset-password'
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo })
      // Supabase returns no error for an address it has never seen, on purpose;
      // anything that does arrive here is a real failure, like a rate limit.
      if (error) throw new AuthError(error.message, 'unknown')
      return {}
    },

    async updatePassword(password) {
      if (password.length < 6) throw new AuthError('weak', 'weak-password')
      const { error } = await sb.auth.updateUser({ password })
      if (error) {
        // Landing here without a session means the recovery link was stale or
        // already spent — supabase-js reads it out of the URL before this page
        // renders, so by now there is nothing left to try.
        const msg = error.message.toLowerCase()
        if (msg.includes('session') || msg.includes('jwt') || msg.includes('expired')) {
          throw new AuthError(error.message, 'link-expired')
        }
        if (msg.includes('password')) throw new AuthError(error.message, 'weak-password')
        throw new AuthError(error.message, 'unknown')
      }
    },

    async getState(userId): Promise<UserState> {
      const [profileRes, progressRes, xpRes, enrollRes, trophyRes, certRes, heartsRes] = await Promise.all([
        sb.from('profiles').select('*').eq('id', userId).single(),
        sb.from('progress').select('course_id,item_id,kind,xp,completed_at').eq('user_id', userId),
        sb.from('xp_events').select('amount,source,created_at').eq('user_id', userId),
        sb.from('enrollments').select('kind,ref_id,enrolled_at').eq('user_id', userId),
        sb.from('trophies').select('trophy_id,earned_at').eq('user_id', userId),
        sb.from('certificates').select('kind,ref_id,serial,issued_at').eq('user_id', userId),
        sb.rpc('resolve_hearts'),
      ])

      if (profileRes.error) throw profileRes.error

      const heartsRow = (heartsRes.data ?? null) as { hearts: number; updated_at: string } | null

      return {
        profile: profileRes.data as Profile,
        progress: (progressRes.data ?? []) as ProgressItem[],
        xpEvents: (xpRes.data ?? []) as XpEvent[],
        enrollments: (enrollRes.data ?? []) as Enrollment[],
        trophies: (trophyRes.data ?? []) as TrophyRow[],
        certificates: (certRes.data ?? []) as CertificateRow[],
        hearts: heartsRow ?? { hearts: MAX_HEARTS, updated_at: new Date().toISOString() },
      }
    },

    async setLang(userId, lang) {
      await sb.from('profiles').update({ lang }).eq('id', userId)
    },

    async updateProfile(userId, { username, displayName }) {
      const patch: Record<string, string> = {}

      if (username !== undefined) {
        const { data: mine } = await sb.from('profiles').select('username').eq('id', userId).single()
        const changing = !mine || mine.username.toLowerCase() !== username.toLowerCase()
        if (changing) {
          // Same check sign-up runs before creating the account — a stranger's
          // name is refused before a write is even attempted.
          const { data: free, error: checkErr } = await sb.rpc('username_available', { p_username: username })
          if (checkErr) throw new AuthError(checkErr.message, 'unknown')
          if (!free) throw new AuthError('taken', 'username-taken')
        }
        patch.username = username
      }
      if (displayName !== undefined) patch.display_name = displayName

      const { data, error } = await sb.from('profiles').update(patch).eq('id', userId).select().single()
      if (error) {
        // The RPC check above closes the common case; this catches the rare
        // race where two people claim the same name between the check and
        // the write — the column's own unique constraint is what actually
        // stops it, this just gives it the same friendly message.
        if (error.code === '23505') throw new AuthError(error.message, 'username-taken')
        throw new AuthError(error.message, 'unknown')
      }
      return data as Profile
    },

    async enroll(userId, kind, refId) {
      await sb.from('enrollments').upsert(
        { user_id: userId, kind, ref_id: refId },
        { onConflict: 'user_id,kind,ref_id', ignoreDuplicates: true },
      )
      const { data } = await sb.from('enrollments').select('kind,ref_id,enrolled_at').eq('user_id', userId)
      return (data ?? []) as Enrollment[]
    },

    async completeItem(userId, item) {
      const { data, error } = await sb.rpc('complete_item', {
        p_course_id: item.courseId,
        p_item_id: item.itemId,
        p_kind: item.kind,
        p_xp: item.xp,
      })
      if (error) throw error

      const [progressRes, xpRes] = await Promise.all([
        sb.from('progress').select('course_id,item_id,kind,xp,completed_at').eq('user_id', userId),
        sb.from('xp_events').select('amount,source,created_at').eq('user_id', userId),
      ])

      return {
        progress: (progressRes.data ?? []) as ProgressItem[],
        xpEvents: (xpRes.data ?? []) as XpEvent[],
        awardedXp: (data as number) ?? 0,
      }
    },

    async spendHeart() {
      const { data, error } = await sb.rpc('spend_heart')
      if (error) throw error
      return data as { hearts: number; updated_at: string }
    },

    async syncHearts(userId, row) {
      // The server derives regeneration itself; this only exists to satisfy the
      // interface when the client resolved a newer value first.
      await sb.from('hearts').update(row).eq('user_id', userId)
    },

    async awardTrophies(userId, ids) {
      if (ids.length) {
        await sb.from('trophies').upsert(
          ids.map((trophy_id) => ({ user_id: userId, trophy_id })),
          { onConflict: 'user_id,trophy_id', ignoreDuplicates: true },
        )
      }
      const { data } = await sb.from('trophies').select('trophy_id,earned_at').eq('user_id', userId)
      return (data ?? []) as TrophyRow[]
    },

    async issueCertificate(userId, kind, refId) {
      const { error } = await sb.rpc('issue_certificate', { p_kind: kind, p_ref_id: refId })
      if (error) throw error
      const { data } = await sb.from('certificates').select('kind,ref_id,serial,issued_at').eq('user_id', userId)
      return (data ?? []) as CertificateRow[]
    },

    async leaderboard(kind, track) {
      // The trophy board has no course filter, and passing one to it would be
      // a call to a function that does not take it.
      const args =
        kind === 'trophies' || track === 'all'
          ? { p_limit: 50 }
          : { p_limit: 50, p_courses: coursesIn(track).map((c) => c.id) }
      const { data, error } = await sb.rpc(RPC_BY_KIND[kind], args)
      if (error) throw error
      return (data ?? []) as LeaderRow[]
    },

    // The two below raise 42501 for anybody who is not a teacher, and the error
    // is left to travel: a learner who reaches this URL should see the page
    // fail, not an empty roster that looks like a cohort of nobody.

    async teacherRoster() {
      const { data, error } = await sb.rpc('teacher_roster')
      if (error) throw error
      return (data ?? []) as RosterRow[]
    },

    async teacherCourseProgress() {
      const { data, error } = await sb.rpc('teacher_course_progress')
      if (error) throw error
      return (data ?? []) as CourseProgressRow[]
    },
  }
}
