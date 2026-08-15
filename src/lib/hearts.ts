/** Heart economy: 5 max, one wrong answer costs one, one regenerates every 15 minutes.
 *
 *  Rather than running a timer, we store `hearts` plus the timestamp that clock
 *  started from and derive the current value on read. That keeps the client and
 *  the database in agreement without a cron job. */

export const MAX_HEARTS = 5
export const REGEN_MS = 15 * 60 * 1000

export interface HeartsRow {
  hearts: number
  /** When the current regeneration clock started. */
  updated_at: string
}

export interface HeartsState {
  hearts: number
  /** ms until the next heart arrives, or null when full. */
  nextIn: number | null
  /** Normalised row to persist back, or null if nothing changed. */
  persist: HeartsRow | null
}

export function resolveHearts(row: HeartsRow, now: number = Date.now()): HeartsState {
  if (row.hearts >= MAX_HEARTS) {
    return { hearts: MAX_HEARTS, nextIn: null, persist: null }
  }

  const started = new Date(row.updated_at).getTime()
  const elapsed = Math.max(0, now - started)
  const regen = Math.floor(elapsed / REGEN_MS)
  const hearts = Math.min(MAX_HEARTS, row.hearts + regen)

  if (hearts >= MAX_HEARTS) {
    return {
      hearts: MAX_HEARTS,
      nextIn: null,
      persist: { hearts: MAX_HEARTS, updated_at: new Date(now).toISOString() },
    }
  }

  // Carry the remainder forward so partial progress toward the next heart is not lost.
  const newStart = started + regen * REGEN_MS
  return {
    hearts,
    nextIn: newStart + REGEN_MS - now,
    persist: regen > 0 ? { hearts, updated_at: new Date(newStart).toISOString() } : null,
  }
}

export function loseHeart(row: HeartsRow, now: number = Date.now()): HeartsRow {
  const cur = resolveHearts(row, now)
  const hearts = Math.max(0, cur.hearts - 1)
  // Dropping from full starts a fresh clock; otherwise the running clock continues.
  const updated_at =
    cur.hearts >= MAX_HEARTS
      ? new Date(now).toISOString()
      : (cur.persist?.updated_at ?? row.updated_at)
  return { hearts, updated_at }
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
