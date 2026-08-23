/** Derived state: what is unlocked, what is finished, what has been earned.
 *  Everything here is a pure function of the rows the backend returned, so the
 *  UI never has to keep a second copy of the truth. */

import { COURSES, PATHS, courseInfo, pathById } from '../content/catalog'
import { TROPHIES, trophyById, type Trophy } from '../content/trophies'
import { courseItems, type Course, type CourseInfo, type Lang, type Loc, type Module } from '../content/types'
import type { ProgressItem, UserState, XpEvent } from './db'
import { isThisWeek } from './week'

export const doneIds = (progress: ProgressItem[]): Set<string> => new Set(progress.map((p) => p.item_id))

export function totalXp(events: XpEvent[]): number {
  return events.reduce((n, e) => n + e.amount, 0)
}

export function weeklyXp(events: XpEvent[]): number {
  return events.filter((e) => isThisWeek(e.created_at)).reduce((n, e) => n + e.amount, 0)
}

export interface CourseCounts {
  done: number
  total: number
  percent: number
  finished: boolean
}

export interface CourseStatus extends CourseCounts {
  /** The next item the learner should open, or null when the course is finished. */
  nextItemId: string | null
}

/** How far through a course, without fetching it.
 *
 *  Every progress row names the course it belongs to, and the catalogue knows
 *  how many items a course has — so a card can show 12 of 55 having downloaded
 *  neither. It cannot say which item comes next; for that you need the order,
 *  which means the curriculum, which means `courseStatus`. */
export function courseProgress(info: CourseInfo, progress: ProgressItem[]): CourseCounts {
  const total = info.lessons + info.projects
  // Clamped: a row for an item that has since been rewritten out of the course
  // should not push the bar past the end.
  const done = Math.min(total, progress.filter((p) => p.course_id === info.id).length)
  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0,
    finished: total > 0 && done >= total,
  }
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
    const info = courseInfo(cid)
    return info ? courseProgress(info, progress).finished : false
  })
}

/* ------------------------------------------------------------------ trophies */

/** Trophy ids that the current state has earned, static and generated alike.
 *
 *  `courses` has to be the loaded curricula: a module trophy is earned when
 *  every item *in that module* is done, and only the curriculum says which
 *  items those are. Everything else here counts rows. */
export function earnedTrophyIds(
  state: Pick<UserState, 'progress' | 'xpEvents'>,
  courses: Course[],
): string[] {
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

  for (const course of courses) {
    if (!course.available) continue
    for (const m of course.modules) {
      if (moduleFinished(m, state.progress)) out.push(`module:${m.id}`)
    }
    if (courseProgress(course, state.progress).finished) out.push(`course:${course.id}`)
  }
  for (const p of PATHS) {
    if (pathFinished(p.id, state.progress)) out.push(`path:${p.id}`)
  }

  return out
}

/** Metadata for a trophy id, including the ones generated from the catalogue.
 *
 *  Only a `module:` trophy needs a loaded curriculum, for the module's own
 *  title; course and path trophies read the catalogue. Pass what you have. */
export function describeTrophy(id: string, courses: Course[] = []): Trophy {
  const stat = trophyById(id)
  if (stat) return stat

  const [kind, ref] = id.split(':')

  if (kind === 'module') {
    for (const c of courses) {
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
    const c = courseInfo(ref)
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

/** Every trophy that exists right now, for the "not yet earned" grid.
 *  Needs the curricula, because the module trophies are named after modules. */
export function allTrophyIds(courses: Course[]): string[] {
  const generated: string[] = []
  for (const c of courses) {
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
    if (c.available && courseProgress(c, progress).finished) {
      out.push({ kind: 'course', refId: c.id, title: c.title })
    }
  }
  for (const p of PATHS) {
    if (pathFinished(p.id, progress)) out.push({ kind: 'path', refId: p.id, title: p.title })
  }
  return out
}

export function certificateTitle(kind: 'course' | 'path', refId: string, lang: Lang): string {
  const item = kind === 'course' ? courseInfo(refId) : pathById(refId)
  return item ? item.title[lang] : refId
}
