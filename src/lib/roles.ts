/** Who is who, in one place.
 *
 *  A *staff* account is an admin or a teacher who has been approved. Staff work through every lesson without being
 *  held back (nothing is locked, hearts never run out, answers can be revealed) and earn no XP, which is why the
 *  leaderboards leave them out. A teacher whose account is still waiting for approval, or was turned down, is not
 *  staff: they use the app like a learner until an admin decides.
 *
 *  These decide what the app shows. They do not decide what may be read: every read of another person's progress is
 *  checked again by the database (`supabase/roles.sql`). */

import type { Profile } from './db'

type Who = Pick<Profile, 'role' | 'approval'>

export const isAdmin = (p: Who | null | undefined): boolean => p?.role === 'admin'

/** A teacher is approved unless the account says otherwise. A database that has not been given `supabase/roles.sql` yet has no
 *  `approval` column at all, and the teachers it already had must not be locked out by that. */
const approved = (p: Who): boolean => p.approval !== 'pending' && p.approval !== 'rejected'

/** An approved teacher or an admin. */
export const isStaff = (p: Who | null | undefined): boolean => Boolean(p) && (p!.role === 'admin' || (p!.role === 'teacher' && approved(p!)))

/** Anybody who has a page of their own under "Class": an admin, or a teacher, approved or not (the page says where they stand). */
export const hasClassPage = (p: Who | null | undefined): boolean => p?.role === 'admin' || p?.role === 'teacher'

/** The XP shown in the top bar for a staff account: a teacher's is a fixed 9999, an admin's is unlimited. */
export const staffXpLabel = (p: Who): string => (p.role === 'admin' ? '♾️' : '9999')
