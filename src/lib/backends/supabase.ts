/** Supabase backend — Postgres + Supabase Auth.
 *  Mirrors `supabase/schema.sql`; run that file once before using this. */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
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
      return { id: u.id, email: u.email ?? email }
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

    async leaderboard(kind) {
      const { data, error } = await sb.rpc(RPC_BY_KIND[kind], { p_limit: 50 })
      if (error) throw error
      return (data ?? []) as LeaderRow[]
    },
  }
}
