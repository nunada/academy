import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getBackend } from '../lib/backends'
import type { AuthUser, UserState } from '../lib/db'
import { MAX_HEARTS, resolveHearts } from '../lib/hearts'
import { loadAllCourses, prefetchCourses } from '../content/catalog'
import { certificatesDue, earnedTrophyIds, totalXp, weeklyXp } from '../lib/progress'
import { useI18n } from '../i18n'
import type { Lang } from '../content/types'
import { StoreContext, type StoreValue } from './storeContext'

export { useStore } from './storeContext'

export function StoreProvider({ children }: { children: ReactNode }) {
  const backend = useMemo(() => getBackend(), [])
  const { lang, setLang } = useI18n()

  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [state, setState] = useState<UserState | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [freshTrophies, setFreshTrophies] = useState<string[]>([])

  // Only adopt the stored language once per sign-in, so a later toggle sticks.
  const langAdopted = useRef<string | null>(null)

  const loadState = useCallback(
    async (uid: string) => {
      const next = await backend.getState(uid)
      setState(next)
      if (langAdopted.current !== uid) {
        langAdopted.current = uid
        if (next.profile.lang !== lang) setLang(next.profile.lang as Lang)
      }
      return next
    },
    [backend, lang, setLang],
  )

  /** A session can outlive the account it belongs to — a deleted user still holds
   *  a valid JWT until it expires. Without this, the profile fetch rejects and the
   *  app sits on "Loading…" forever, signed in as somebody who no longer exists. */
  const loadOrSignOut = useCallback(
    async (uid: string) => {
      try {
        await loadState(uid)
        // Nothing waits on this, and only somebody signed in gets it: a visitor
        // reading the landing page has no use for 282 KB of curriculum. For a
        // learner it means the chunk is already here by the time they open a
        // lesson or finish one.
        prefetchCourses()
      } catch {
        await backend.signOut()
        setUser(null)
        setState(null)
        langAdopted.current = null
      }
    },
    [backend, loadState],
  )

  useEffect(() => {
    let alive = true
    backend
      .getSession()
      .then(async (session) => {
        if (!alive) return
        setUser(session)
        if (session) await loadOrSignOut(session.id)
      })
      .finally(() => alive && setReady(true))

    const unsub = backend.onAuthChange(async (u) => {
      setUser(u)
      if (u) await loadOrSignOut(u.id)
      else {
        setState(null)
        langAdopted.current = null
      }
    })
    return () => {
      alive = false
      unsub()
    }
    // loadState changes with `lang`; re-subscribing on that would be wasteful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend])

  // Drives the heart countdown. One tick per second is enough for a mm:ss clock.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const resolved = state ? resolveHearts(state.hearts, now) : null
  const hearts = resolved?.hearts ?? MAX_HEARTS
  const nextHeartIn = resolved?.nextIn ?? null

  // Persist regenerated hearts once the derived value moves past the stored one.
  const lastSynced = useRef<string>('')
  useEffect(() => {
    if (!user || !state || !resolved?.persist) return
    const key = `${resolved.persist.hearts}@${resolved.persist.updated_at}`
    if (lastSynced.current === key) return
    lastSynced.current = key
    const persisted = resolved.persist
    setState((s) => (s ? { ...s, hearts: persisted } : s))
    void backend.syncHearts(user.id, persisted)
  }, [backend, user, state, resolved])

  /** Award any trophies and certificates the new progress has just unlocked. */
  const settleRewards = useCallback(
    async (next: UserState) => {
      // Module trophies need the curricula; the prefetch below means this is
      // almost always a cache read rather than a fetch.
      const earned = earnedTrophyIds(next, await loadAllCourses())
      const have = new Set(next.trophies.map((t) => t.trophy_id))
      const missing = earned.filter((id) => !have.has(id))

      let updated = next
      if (missing.length) {
        const trophies = await backend.awardTrophies(next.profile.id, missing)
        updated = { ...updated, trophies }
        setFreshTrophies(missing)
      }

      const due = certificatesDue(next.progress)
      const held = new Set(next.certificates.map((c) => `${c.kind}:${c.ref_id}`))
      for (const cert of due) {
        if (held.has(`${cert.kind}:${cert.refId}`)) continue
        const certificates = await backend.issueCertificate(next.profile.id, cert.kind, cert.refId)
        updated = { ...updated, certificates }
      }

      if (updated !== next) setState(updated)
    },
    [backend],
  )

  const value: StoreValue = {
    ready,
    user,
    state,
    mode: backend.mode,
    hearts,
    nextHeartIn,
    xpTotal: state ? totalXp(state.xpEvents) : 0,
    xpWeek: state ? weeklyXp(state.xpEvents) : 0,
    freshTrophies,
    clearFreshTrophies: () => setFreshTrophies([]),

    async signIn(email, password) {
      const u = await backend.signIn({ email, password })
      setUser(u)
      await loadState(u.id)
    },

    async signUp({ email, password, username, displayName }) {
      const { user: u, needsConfirmation } = await backend.signUp({ email, password, username, displayName, lang })

      // With email confirmation switched on — the default — Supabase creates
      // the account but hands back no session, and won't until the link in
      // the email is clicked. Setting user here anyway used to cause a real
      // bug, not just a cosmetic one: RequireAuth would let the optimistic
      // user through to render /learn for a moment, loadState would fail
      // against RLS with no session to authenticate it, and then the
      // auth-state listener would report the same "no session" a moment
      // later and silently wipe user back to null — bouncing the new arrival
      // straight to a bare sign-in screen with no explanation at all. Leaving
      // user untouched here means Auth.tsx is the one that decides what the
      // screen says, instead of that race deciding it by accident.
      if (needsConfirmation) return { needsConfirmation: true }

      setUser(u)
      try {
        await loadState(u.id)
      } catch {
        setState(null)
      }
      return { needsConfirmation: false }
    },

    async signOut() {
      await backend.signOut()
      setUser(null)
      setState(null)
      langAdopted.current = null
    },

    async enroll(kind, refId) {
      if (!user) return
      const enrollments = await backend.enroll(user.id, kind, refId)
      setState((s) => (s ? { ...s, enrollments } : s))
    },

    isEnrolled(kind, refId) {
      return Boolean(state?.enrollments.some((e) => e.kind === kind && e.ref_id === refId))
    },

    async complete(item) {
      if (!user || !state) return 0
      const { progress, xpEvents, awardedXp } = await backend.completeItem(user.id, item)
      const next: UserState = { ...state, progress, xpEvents }
      setState(next)
      await settleRewards(next)
      return awardedXp
    },

    async loseHeart() {
      if (!user || !state) return hearts
      const row = await backend.spendHeart(user.id)
      setState((s) => (s ? { ...s, hearts: row } : s))
      return row.hearts
    },
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
