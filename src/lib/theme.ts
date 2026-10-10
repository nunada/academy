/** The color theme: light, dark, or follow the system.
 *
 *  The choice is kept in localStorage and applied as `data-theme` on <html>. With the
 *  system choice the attribute is absent, and the `prefers-color-scheme` rules in
 *  styles.css decide; with a forced choice the attribute decides. `index.html` applies
 *  the saved choice before the first paint, so a reload does not flash the wrong theme. */

import { useCallback, useSyncExternalStore } from 'react'

export type ThemePref = 'system' | 'light' | 'dark'
export type Theme = 'light' | 'dark'

const KEY = 'nunada.theme'
/** The same colors as the --bg token in the two themes. */
const BAR: Record<Theme, string> = { light: '#fbf7ec', dark: '#16241f' }

const listeners = new Set<() => void>()
const mq = (): MediaQueryList | null => (typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null)

export function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

/** The theme actually shown for a choice. */
export const resolveTheme = (pref: ThemePref): Theme => (pref === 'system' ? (mq()?.matches ? 'dark' : 'light') : pref)

/** Put a choice on the page: the attribute CSS reads, and the browser bar color. */
export function applyPref(pref: ThemePref): void {
  const root = document.documentElement
  if (pref === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', pref)
  // A forced theme must also color the browser bar the same way; the system choice restores the pair of
  // media-dependent colors from index.html.
  const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
  metas.forEach((m) => {
    const dark = /dark/.test(m.media)
    m.content = pref === 'system' ? BAR[dark ? 'dark' : 'light'] : BAR[pref]
  })
}

export function savePref(pref: ThemePref): void {
  try {
    if (pref === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, pref)
  } catch {
    // Private windows can refuse storage: the choice then lasts until the page closes.
  }
  applyPref(pref)
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  const m = mq()
  m?.addEventListener('change', cb)
  return () => {
    listeners.delete(cb)
    m?.removeEventListener('change', cb)
  }
}

// One string keeps the two facts together: `${choice}|${shown}`.
const snapshot = (): string => `${readPref()}|${resolveTheme(readPref())}`

/** The saved choice, the theme shown now, and a setter. Re-renders when either changes, also when the
 *  system theme flips while the choice is "system". */
export function useTheme(): { pref: ThemePref; theme: Theme; setPref: (p: ThemePref) => void } {
  const s = useSyncExternalStore(subscribe, snapshot, () => 'system|light')
  const [pref, theme] = s.split('|') as [ThemePref, Theme]
  const setPref = useCallback((p: ThemePref) => savePref(p), [])
  return { pref, theme, setPref }
}
