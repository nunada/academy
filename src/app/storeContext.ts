import { createContext, useContext } from 'react'
import type { AuthUser, UserState } from '../lib/db'

/** Kept apart from `store.tsx` on purpose: the context identity must survive a
 *  hot reload of the provider, otherwise every consumer sees a fresh (null)
 *  context and the app throws mid-edit. */

export interface StoreValue {
  ready: boolean
  user: AuthUser | null
  state: UserState | null
  mode: 'supabase' | 'local'

  hearts: number
  /** ms until the next heart, or null when full. */
  nextHeartIn: number | null
  xpTotal: number
  xpWeek: number

  signIn: (email: string, password: string) => Promise<void>
  /** Resolves once the account exists. `needsConfirmation: true` means
   *  Supabase is waiting on an email click before any session exists — the
   *  caller is still signed out, and must say so rather than act signed in. */
  signUp: (input: {
    email: string
    password: string
    username: string
    displayName: string
  }) => Promise<{ needsConfirmation: boolean }>
  signOut: () => Promise<void>
  enroll: (kind: 'course' | 'path', refId: string) => Promise<void>
  isEnrolled: (kind: 'course' | 'path', refId: string) => boolean
  /** Returns the XP actually awarded (0 if the item was already finished). */
  complete: (item: { courseId: string; itemId: string; kind: 'lesson' | 'project'; xp: number }) => Promise<number>
  loseHeart: () => Promise<number>
  /** Newly earned trophy ids since the last check, for the celebration toast. */
  freshTrophies: string[]
  clearFreshTrophies: () => void
}

export const StoreContext = createContext<StoreValue | null>(null)

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
