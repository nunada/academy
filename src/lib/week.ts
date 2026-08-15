/** Weekly leaderboard windows.
 *  A "week" starts Monday 00:00 UTC so the client and Postgres
 *  (`date_trunc('week', ...)`, also Monday-based) agree on the boundary. */

export function weekStart(d: Date = new Date()): Date {
  const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const dow = (utc.getUTCDay() + 6) % 7 // Monday = 0
  utc.setUTCDate(utc.getUTCDate() - dow)
  return utc
}

/** Stable key like `2026-W33`, used to bucket XP events locally. */
export function weekKey(d: Date = new Date()): string {
  const s = weekStart(d)
  const thursday = new Date(s)
  thursday.setUTCDate(s.getUTCDate() + 3)
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export function isThisWeek(iso: string): boolean {
  return new Date(iso).getTime() >= weekStart().getTime()
}

/** Time until the weekly leaderboard rolls over. */
export function msUntilWeekEnd(now: Date = new Date()): number {
  const next = weekStart(now)
  next.setUTCDate(next.getUTCDate() + 7)
  return next.getTime() - now.getTime()
}
