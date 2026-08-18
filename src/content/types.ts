/** Content model for Nunada Academy.
 *  Every learner-facing string is bilingual (`Loc`), so a course is authored once
 *  and rendered in whichever language the learner picked. */

export type Lang = 'en' | 'id'

export interface Loc {
  en: string
  id: string
}

/** A check that runs against the learner's Python code inside Pyodide. */
export interface PyTest {
  name: Loc
  /** Python run *before* the learner's code, in the same namespace.
   *  Lays out any files the exercise expects, and clears leftovers from an
   *  earlier test — Pyodide keeps one filesystem for the whole session, so
   *  without this a later test can silently read an earlier test's file. */
  setup?: string
  /** Lines fed to `input()` while the learner's code runs. */
  stdin?: string[]
  /** stdout must equal this after trimming trailing whitespace on each line. */
  expectOutput?: string
  /** stdout must contain every one of these fragments (case-insensitive). */
  expectContains?: string[]
  /** Extra Python executed after the learner's code, in the same namespace.
   *  Raise/assert to fail. Use it to test the functions they defined. */
  assert?: string
}

/**
 * Steps are ordered so support fades across a lesson:
 * `concept` (worked example) -> `quiz` (predict) -> `fill` (complete) ->
 * `order` (assemble) -> `code` (write it alone).
 */
export type Step =
  | {
      kind: 'concept'
      id: string
      title: Loc
      body: Loc
      code?: string
      /** What the sample code prints, shown as a worked example. */
      output?: string
    }
  | {
      kind: 'quiz'
      id: string
      prompt: Loc
      code?: string
      options: Loc[]
      answer: number
      explain: Loc
    }
  | {
      kind: 'fill'
      id: string
      prompt: Loc
      /** Use `___` (three underscores) for each blank, in order. */
      template: string
      blanks: string[]
      explain: Loc
    }
  | {
      kind: 'order'
      id: string
      prompt: Loc
      /** Correct order. Shuffled for the learner. */
      lines: string[]
      explain: Loc
    }
  | {
      kind: 'code'
      id: string
      prompt: Loc
      starter: string
      tests: PyTest[]
      /** Revealed one at a time; the last hint may show the answer shape. */
      hints: Loc[]
      solution: string
    }

export interface Lesson {
  id: string
  title: Loc
  /** Short "what you'll be able to do" line shown on the map. */
  goal: Loc
  xp: number
  steps: Step[]
}

/** The mini project that closes every submodule. */
export interface MiniProject {
  id: string
  title: Loc
  brief: Loc
  requirements: Loc[]
  starter: string
  tests: PyTest[]
  hints: Loc[]
  solution: string
  xp: number
}

export interface Submodule {
  id: string
  title: Loc
  summary: Loc
  lessons: Lesson[]
  project: MiniProject
}

export interface Module {
  id: string
  title: Loc
  summary: Loc
  submodules: Submodule[]
}

export interface Course {
  id: string
  title: Loc
  tagline: Loc
  /** Emoji shown on the course card. */
  icon: string
  /** CSS colour used for the card accent. */
  color: string
  level: Loc
  language: 'python' | 'html' | 'css' | 'javascript' | 'typescript' | 'sql' | 'react' | 'mixed'
  /** Courses that must be finished first. */
  requires: string[]
  /** false = shown on the catalogue but not yet playable. */
  available: boolean
  modules: Module[]
}

export interface CareerPath {
  id: string
  title: Loc
  blurb: Loc
  icon: string
  color: string
  courseIds: string[]
  available: boolean
}

/* ---------- helpers ---------- */

export const t = (loc: Loc, lang: Lang): string => loc[lang] ?? loc.en

export function lessonCount(course: Course): number {
  return course.modules.reduce(
    (n, m) => n + m.submodules.reduce((k, s) => k + s.lessons.length, 0),
    0,
  )
}

export function projectCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.submodules.length, 0)
}

/** Every completable item id in course order — the backbone of "unlock the next one". */
export function courseItems(course: Course): { id: string; kind: 'lesson' | 'project'; xp: number }[] {
  const out: { id: string; kind: 'lesson' | 'project'; xp: number }[] = []
  for (const m of course.modules) {
    for (const s of m.submodules) {
      for (const l of s.lessons) out.push({ id: l.id, kind: 'lesson', xp: l.xp })
      out.push({ id: s.project.id, kind: 'project', xp: s.project.xp })
    }
  }
  return out
}

export function totalXp(course: Course): number {
  return courseItems(course).reduce((n, i) => n + i.xp, 0)
}
