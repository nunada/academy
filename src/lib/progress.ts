/** Derived state: what is unlocked, what is finished, what has been earned.
 *  Everything here is a pure function of the rows the backend returned, so the
 *  UI never has to keep a second copy of the truth. */

import { COURSES, PATHS, courseById, pathById } from '../content/catalog'
import { TROPHIES, trophyById, type Trophy } from '../content/trophies'
import { courseItems, type Course, type Lang, type Loc, type Module } from '../content/types'
import type { ProgressItem, UserState, XpEvent } from './db'
import { isThisWeek } from './week'

export const doneIds = (progress: ProgressItem[]): Set<string> => new Set(progress.map((p) => p.item_id))

export function totalXp(events: XpEvent[]): number {
  return events.reduce((n, e) => n + e.amount, 0)
}

export function weeklyXp(events: XpEvent[]): number {
  return events.filter((e) => isThisWeek(e.created_at)).reduce((n, e) => n + e.amount, 0)
}

export interface CourseStatus {
  done: number
  total: number
  percent: number
  /** The next item the learner should open, or null when the course is finished. */
  nextItemId: string | null
  finished: boolean
}

export function courseStatus(course: Course, progress: ProgressItem[]): CourseStatus {
  const items = courseItems(course)
  const done = doneIds(progress)
  const completed = items.filter((i) => done.has(i.id)).length
  const next = items.find((i) => !done.has(i.id))
  return {
    done: completed,
    total: items.length,
    percent: items.length ? Math.round((completed / items.length) * 100) : 0,
    nextItemId: next?.id ?? null,
    finished: items.length > 0 && completed === items.length,
  }
}

/** Sequential unlocking: an item opens once the one before it is finished. */
export function isUnlocked(course: Course, itemId: string, progress: ProgressItem[]): boolean {
  const items = courseItems(course)
  const index = items.findIndex((i) => i.id === itemId)
  if (index <= 0) return index === 0
  return doneIds(progress).has(items[index - 1].id)
}

export function moduleFinished(module: Module, progress: ProgressItem[]): boolean {
  const done = doneIds(progress)
  return module.submodules.every(
    (s) => s.lessons.every((l) => done.has(l.id)) && done.has(s.project.id),
  )
}

export function pathFinished(pathId: string, progress: ProgressItem[]): boolean {
  const path = pathById(pathId)
  if (!path || !path.available) return false
  return path.courseIds.every((cid) => {
    const c = courseById(cid)
    return c ? courseStatus(c, progress).finished : false
  })
}

/* ------------------------------------------------------------------ trophies */

/** Trophy ids that the current state has earned, static and generated alike. */
export function earnedTrophyIds(state: Pick<UserState, 'progress' | 'xpEvents'>): string[] {
  const out: string[] = []
  const lessons = state.progress.filter((p) => p.kind === 'lesson').length
  const projects = state.progress.filter((p) => p.kind === 'project').length
  const total = totalXp(state.xpEvents)
  const week = weeklyXp(state.xpEvents)

  if (lessons >= 1) out.push('first-lesson')
  if (projects >= 1) out.push('first-project')
  if (projects >= 5) out.push('projects-5')
  if (total >= 100) out.push('xp-100')
  if (total >= 500) out.push('xp-500')
  if (total >= 1000) out.push('xp-1000')
  if (week >= 100) out.push('week-100')
  if (week >= 300) out.push('week-300')

  for (const course of COURSES) {
    if (!course.available) continue
    for (const m of course.modules) {
      if (moduleFinished(m, state.progress)) out.push(`module:${m.id}`)
    }
    if (courseStatus(course, state.progress).finished) out.push(`course:${course.id}`)
  }
  for (const p of PATHS) {
    if (pathFinished(p.id, state.progress)) out.push(`path:${p.id}`)
  }

  return out
}

/** Metadata for a trophy id, including the ones generated from the catalogue. */
export function describeTrophy(id: string): Trophy {
  const stat = trophyById(id)
  if (stat) return stat

  const [kind, ref] = id.split(':')

  if (kind === 'module') {
    for (const c of COURSES) {
      const m = c.modules.find((x) => x.id === ref)
      if (m) {
        return {
          id,
          icon: '📘',
          title: { en: `${m.title.en} finished`, id: `${m.title.id} tuntas` },
          desc: {
            en: `Complete every lesson and project in ${m.title.en}.`,
            id: `Selesaikan semua pelajaran dan proyek di ${m.title.id}.`,
          },
        }
      }
    }
  }

  if (kind === 'course') {
    const c = courseById(ref)
    if (c) {
      return {
        id,
        icon: '🎓',
        title: { en: `${c.title.en} graduate`, id: `Lulusan ${c.title.id}` },
        desc: { en: `Finish the whole ${c.title.en} course.`, id: `Tuntaskan seluruh kursus ${c.title.id}.` },
      }
    }
  }

  if (kind === 'path') {
    const p = pathById(ref)
    if (p) {
      return {
        id,
        icon: '🏆',
        title: { en: `${p.title.en}`, id: `${p.title.id}` },
        desc: { en: `Finish every course in the path.`, id: `Tuntaskan semua kursus dalam jalur ini.` },
      }
    }
  }

  return { id, icon: '🎖️', title: { en: id, id }, desc: { en: '', id: '' } }
}

/** Every trophy that exists right now, for the "not yet earned" grid. */
export function allTrophyIds(): string[] {
  const generated: string[] = []
  for (const c of COURSES) {
    if (!c.available) continue
    for (const m of c.modules) generated.push(`module:${m.id}`)
    generated.push(`course:${c.id}`)
  }
  for (const p of PATHS) if (p.available) generated.push(`path:${p.id}`)
  return [...TROPHIES.map((t) => t.id), ...generated]
}

/* -------------------------------------------------------------- certificates */

export interface EarnedCertificate {
  kind: 'course' | 'path'
  refId: string
  title: Loc
}

/** Courses and paths finished — the app issues a certificate for each. */
export function certificatesDue(progress: ProgressItem[]): EarnedCertificate[] {
  const out: EarnedCertificate[] = []
  for (const c of COURSES) {
    if (c.available && courseStatus(c, progress).finished) {
      out.push({ kind: 'course', refId: c.id, title: c.title })
    }
  }
  for (const p of PATHS) {
    if (pathFinished(p.id, progress)) out.push({ kind: 'path', refId: p.id, title: p.title })
  }
  return out
}

export function certificateTitle(kind: 'course' | 'path', refId: string, lang: Lang): string {
  const item = kind === 'course' ? courseById(refId) : pathById(refId)
  return item ? item.title[lang] : refId
}
