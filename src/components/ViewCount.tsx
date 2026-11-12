import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { getBackend } from '../lib/backends'
import { firstViewInSession, looksLikeRobot, viewsLabel, type ViewKind } from '../lib/views'

/** Pages already counted during this page load, for a browser with no session storage. */
const seen = new Set<string>()

const storage = (): Storage | null => {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

/** Counts this visit once per session and gives the total, or null while it is unknown or when there is no counter to ask. */
export function usePageView(kind: ViewKind, slug: string): number | null {
  const [n, setN] = useState<number | null>(null)
  useEffect(() => {
    let live = true
    const count = !looksLikeRobot(typeof navigator === 'undefined' ? undefined : navigator) && firstViewInSession(storage(), kind, slug, seen)
    void getBackend()
      .pageView(kind, slug, count)
      .then((v) => {
        if (live) setN(v)
      })
      .catch(() => {})
    return () => {
      live = false
    }
  }, [kind, slug])
  return n
}

const totals = new Map<ViewKind, Promise<Record<string, number>>>()

/** The counts of every page of one kind, asked for once per page load. */
export function usePageViews(kind: ViewKind): Record<string, number> {
  const [all, setAll] = useState<Record<string, number>>({})
  useEffect(() => {
    let live = true
    let p = totals.get(kind)
    if (!p) {
      p = getBackend()
        .pageViews(kind)
        .catch(() => ({}))
      totals.set(kind, p)
    }
    void p.then((v) => {
      if (live) setAll(v)
    })
    return () => {
      live = false
    }
  }, [kind])
  return all
}

/** "1,234 views": a small eye and the count. Nothing is drawn until there is a number. */
export function Views({ n, className }: { n: number | null | undefined; className?: string }) {
  const { lang } = useI18n()
  if (n === null || n === undefined) return null
  return (
    <span className={`views${className ? ' ' + className : ''}`}>
      <span aria-hidden="true">👁</span> {viewsLabel(n, lang)}
    </span>
  )
}

/** The count of one page, and the visit being counted. */
export function PageViews({ kind, slug }: { kind: ViewKind; slug: string }) {
  return <Views n={usePageView(kind, slug)} />
}
