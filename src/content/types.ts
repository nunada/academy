/** Content model for Nunada Academy.
 *  Every learner-facing string is bilingual (`Loc`), so a course is authored once
 *  and rendered in whichever language the learner picked. */

import type { Figure } from '../lib/figure'

export type Lang = 'en' | 'id'

export interface Loc {
  en: string
  id: string
}

/** Like `Loc`, but for a value that is executed rather than displayed — code,
 *  test data, anything Pyodide runs. Only wrap fields that actually need a
 *  second language; most content stays a plain, language-neutral `T`.
 *  Never instantiate with a `T` that itself has `en`/`id` keys — `resolveBi`
 *  can't tell that apart from an actual bilingual wrapper. */
export type Bi<T> = T | { en: T; id: T }

export function resolveBi<T>(v: Bi<T>, lang: Lang): T {
  return v !== null && typeof v === 'object' && !Array.isArray(v) && 'en' in v && 'id' in v
    ? (v as { en: T; id: T })[lang]
    : (v as T)
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

/** A check that runs against the learner's C++, interpreted by JSCPP.
 *
 *  JSCPP has no `std::string`, no `std::vector`, and no references — a subset
 *  of the language built around primitives, arrays and pointers. There is no
 *  `setup` or `assert` here the way `PyTest` has them: everything a check needs
 *  has to come out through `cout`, since there is no shared namespace to poke
 *  a variable out of once the program has run. */
export interface CppTest {
  name: Loc
  /** Lines fed to `cin` while the learner's code runs, joined with newlines —
   *  `cin >>` skips whitespace including line breaks, so one line or three
   *  reads exactly the same way. */
  stdin?: string[]
  /** stdout must equal this after trimming trailing whitespace on each line. */
  expectOutput?: string
  /** stdout must contain every one of these fragments (case-insensitive). */
  expectContains?: string[]
}

/** A check that runs against the learner's markup, inside the sandboxed preview.
 *
 *  `check` is JavaScript, evaluated in the rendered page after it parses. These
 *  helpers are in scope:
 *    sel(q)        first matching element, or null
 *    all(q)        array of matching elements
 *    text(q)       trimmed textContent of the first match, or ""
 *    attr(q, a)    attribute value of the first match, or null
 *    style(q, p)   computed value of CSS property p on the first match
 *    css()         the whole stylesheet as text, for rules getComputedStyle
 *                  cannot see — :hover, or a media query that is not matching
 *    logs()        array of lines the learner's code passed to console.log
 *    out()         those lines joined with newlines
 *    error()       message of an uncaught error, or null
 *    tick(ms)      await this to let the page settle
 *    click(q)      click the first match, then wait a tick
 *    assert(c, m)  fail with message m when c is falsy
 *
 *  `check` runs as an async function, so it may `await`. React commits after
 *  the handler that triggered it returns, which means a check reading the DOM
 *  straight after a click sees the value from before it — write
 *  `await click(q)` rather than `sel(q).click()`.
 *
 *  Every check in a test runs against the *same* page, in order, so anything an
 *  earlier one did is still there. A check that clicks must not assume it starts
 *  from zero: read the value first, act, then compare against what you read.
 *
 *  In a `js` exercise the learner's script has already run in this same frame,
 *  so its top-level names — `function`, `const`, `let` alike — can be referenced
 *  directly by name inside `check`.
 *  Throwing fails the test, and the thrown message is what the learner sees. */
export interface WebTest {
  name: Loc
  check: string
}

/** A check that runs the learner's SQL against a fresh database.
 *
 *  Each check gets its own database, built from the exercise's schema, so a
 *  write in one cannot be seen by the next. */
export interface SqlTest {
  name: Loc
  /** SQL run after the schema and before the learner's, to vary the data. */
  setup?: string
  /** The rows the learner's statement must return. */
  expectRows?: (string | number | null)[][]
  /** Column names the result must have, in order. Compared case-insensitively. */
  expectColumns?: string[]
  /** Row order matters. Leave false unless the exercise asks for ORDER BY. */
  ordered?: boolean
  /** Run after the learner's statement; its rows are compared instead.
   *  This is how INSERT, UPDATE and DELETE exercises are checked. */
  verify?: string
}

/** A check that runs against the learner's TypeScript.
 *
 *  A type is only as good as what it refuses, so the usual check appends a
 *  `probe` — a value handed to the type they wrote — and asks the compiler
 *  whether it accepted it. Set `expectError` when the probe is the bad value
 *  the type is supposed to catch, and leave it off when the probe is a good
 *  value that must go through.
 *
 *  The learner's own code is compiled first and must be clean, so an error
 *  found with a probe attached can only have come from the probe.
 *
 *  `errorCode` pins the expectation to one TypeScript error — 2322 not
 *  assignable, 2345 bad argument, 2339 no such property, 2741 missing
 *  property, 18048 possibly undefined. Steadier than matching message text,
 *  which changes between compiler releases.
 *
 *  `check` is the other kind: JavaScript run against the emitted output in the
 *  sandboxed frame, with every helper a `web` check gets. Use it for what the
 *  code *does*; use a probe for what the types *say*. */
export interface TsTest {
  name: Loc
  /** TypeScript appended after the learner's code. */
  probe?: string
  /** The probe must be rejected. Without this, it must be accepted. */
  expectError?: boolean
  /** Narrow `expectError` to one TypeScript error code. */
  errorCode?: number
  /** Behaviour check, run on the compiled JavaScript. */
  check?: string
}

/** What every answer box shares. */
interface MathBlankBase {
  /** LaTeX printed to the left of the box, e.g. `\vec{a}\cdot\vec{b} =`. Wrap
   *  in `Bi<T>` whenever it carries a word rather than bare notation — a
   *  bare `x =` needs no translation, but `\text{starts at } x =` does. */
  label?: Bi<string>
  /** LaTeX printed to the right — a unit, or a closing bracket. */
  after?: Bi<string>
  /** Placeholder shown in the empty box. */
  placeholder?: string
}

/** A box holding one number.
 *
 *  One number per box is deliberate. Marking a typed vector means guessing at
 *  notation — whether `(3,4)` is a point, whether `3i+4j` was spelled with
 *  hats — and guessing wrong marks a learner who was right as wrong. One box
 *  per component sidesteps all of it, and reads the way the working does.
 *
 *  A learner may type the decimal (`3.74`), the exact form (`sqrt(14)`), a
 *  fraction (`-7/2`), or the decimal written with a comma (`1,5`). */
export interface MathNumberBlank extends MathBlankBase {
  answer: number
  /** Absolute tolerance. Defaults to half a percent of the answer, which
   *  accepts two decimal places without accepting a different number. */
  tol?: number
}

/** A box holding a formula rather than a number — an inverse, a composite, a
 *  transformed graph. Marked by agreeing with `formula` wherever that is
 *  defined, so the learner may spell it however they like. */
export interface MathFormulaBlank extends MathBlankBase {
  /** The expected answer, as an expression `lib/expr.ts` can read. */
  formula: string
  /** The letter it is written in. Defaults to `x`. */
  variable?: string
  /** Where the two are compared. Give it whenever the answer is not defined
   *  on the whole line — a root, a logarithm, a vanishing denominator. */
  domain?: [number, number]
}

/** One answer box in a mathematics exercise. */
export type MathBlank = MathNumberBlank | MathFormulaBlank

/** A question answered by filling boxes. Shared by the `math` step and by the
 *  parts of a mathematics mini project. */
export interface MathTask {
  prompt: Loc
  /** The problem as it would be printed on paper, in LaTeX, above the boxes. */
  given?: Bi<string>
  /** A drawing of the situation, shown above the boxes. */
  figure?: Figure
  blanks: MathBlank[]
  /** Boxes side by side — a vector's components — rather than stacked. */
  inline?: boolean
  /** The working, one LaTeX line at a time. Offered once the hints run out. */
  solution?: Bi<string[]>
}

/**
 * Steps are ordered so support fades across a lesson:
 * `concept` (worked example) -> `quiz` (predict) -> `fill` (complete) ->
 * `order` (assemble) -> `code` (write it alone).
 *
 * A mathematics lesson climbs the same ladder and ends on `math` rather than
 * `code`: nothing to choose between and no template to complete — the learner
 * does the working and types what came out of it.
 */
export type Step =
  | {
      kind: 'concept'
      id: string
      title: Loc
      body: Loc
      /** A drawing, shown between the prose and any sample code. Some of the
       *  ideas in this app are geometry, and geometry is faster looked at. */
      figure?: Figure
      /** A plain string when the snippet is language-neutral code with no
       *  prose in it; `Loc` only where a comment or string literal needs
       *  translating, so most snippets don't carry a redundant duplicate. */
      code?: string | Loc
      /** What the sample code prints, shown as a worked example. */
      output?: Bi<string>
      /** Render `code` as a live page instead of printing text.
       *  Markup is easier to understand seen than described. */
      preview?: boolean
    }
  | {
      kind: 'quiz'
      id: string
      prompt: Loc
      code?: string | Loc
      options: Loc[]
      answer: number
      explain: Loc
    }
  | {
      kind: 'fill'
      id: string
      prompt: Loc
      /** Use `___` (three underscores) for each blank, in order. */
      template: Bi<string>
      blanks: Bi<string[]>
      explain: Loc
      /** The template is LaTeX, and the pieces around the blanks are set as
       *  a formula rather than as monospaced code. */
      math?: boolean
    }
  | {
      kind: 'order'
      id: string
      prompt: Loc
      /** Correct order. Shuffled for the learner. */
      lines: Bi<string[]>
      explain: Loc
      /** The lines are LaTeX — the steps of a derivation rather than of a
       *  program — and are set as formulas. */
      math?: boolean
    }
  | {
      kind: 'code'
      id: string
      prompt: Loc
      starter: Bi<string>
      tests: Bi<PyTest[]>
      /** Revealed one at a time; the last hint may show the answer shape. */
      hints: Loc[]
      solution: Bi<string>
    }
  | {
      /** Same rung of the ladder as `code`, but the learner writes markup and
       *  sees it render rather than writing a program and reading its output. */
      kind: 'web'
      id: string
      prompt: Loc
      starter: Bi<string>
      tests: Bi<WebTest[]>
      hints: Loc[]
      solution: Bi<string>
      /** Fixed markup for the exercise. When present the learner writes CSS
       *  (or, with `js`, JavaScript) against this page rather than authoring it.
       *  The HTML becomes context; the exercise is the stylesheet or the script. */
      html?: Bi<string>
      /** The editor holds JavaScript, run as a script on the page. */
      js?: boolean
      /** The editor holds JSX, transpiled in the frame before it runs.
       *  React and ReactDOM are already on the page as globals. */
      react?: boolean
    }
  | {
      /** Same rung as `code` and `web`: the learner writes a statement and sees
       *  the rows it returns. */
      kind: 'sql'
      id: string
      prompt: Loc
      starter: string
      tests: SqlTest[]
      hints: Loc[]
      solution: string
      /** DDL and seed data, run before every check and before every free run. */
      schema: string
    }
  | {
      /** Same rung as `code`, in C++ rather than Python. */
      kind: 'cpp'
      id: string
      prompt: Loc
      starter: Bi<string>
      tests: Bi<CppTest[]>
      hints: Loc[]
      solution: Bi<string>
    }
  | {
      /** Same rung again, and the only one that is played rather than read.
       *  The learner writes `awal`, `perbarui` and `gambar`; the checks call
       *  those functions directly, so the tests are ordinary Python and the
       *  canvas is for the learner, not for the checking. */
      kind: 'game'
      id: string
      prompt: Loc
      starter: string
      tests: PyTest[]
      hints: Loc[]
      solution: string
    }
  | {
      /** Same rung as `code`, `web` and `sql`: the learner writes TypeScript and
       *  finds out what the compiler makes of it. */
      kind: 'ts'
      id: string
      prompt: Loc
      starter: Bi<string>
      tests: Bi<TsTest[]>
      hints: Loc[]
      solution: Bi<string>
    }
  | ({
      /** The last rung of a mathematics lesson. There is nothing to pick from
       *  and no template to complete: work it out, type the number. */
      kind: 'math'
      id: string
      hints: Loc[]
      explain: Loc
    } & MathTask)

export interface Lesson {
  id: string
  title: Loc
  /** Short "what you'll be able to do" line shown on the map. */
  goal: Loc
  xp: number
  steps: Step[]
}

/** The mini project that closes every submodule. */
interface MiniProjectBase {
  id: string
  title: Loc
  brief: Loc
  requirements: Loc[]
  hints: Loc[]
  xp: number
}

/** The shape every project had before mathematics arrived: an editor with
 *  something in it to begin with, and one right answer to fall back on. */
type CodeProject = MiniProjectBase & { starter: Bi<string>; solution: Bi<string> }

/** Discriminated by `runtime` so each kind carries only the tests it can run.
 *  Python is the default, which keeps every existing project unchanged. */
export type MiniProject =
  | (CodeProject & { runtime?: 'python'; tests: Bi<PyTest[]> })
  | (CodeProject & { runtime: 'web'; tests: Bi<WebTest[]>; html?: Bi<string>; js?: boolean; react?: boolean })
  | (CodeProject & { runtime: 'sql'; tests: SqlTest[]; schema: string })
  | (CodeProject & { runtime: 'ts'; tests: Bi<TsTest[]> })
  | (CodeProject & { runtime: 'game'; tests: Bi<PyTest[]> })
  | (CodeProject & { runtime: 'cpp'; tests: Bi<CppTest[]> })
  /** A problem set: several questions, every box right before it counts.
   *  No starter and no single solution string — each part carries its own
   *  working instead. */
  | (MiniProjectBase & { runtime: 'math'; tasks: MathTask[] })

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

/** What the catalogue knows about a course without fetching its curriculum.
 *
 *  Everything a card shows lives here, including the two counts — the landing
 *  page and the catalogue must never pull a curriculum just to say "37 lessons".
 *  Those counts are the one fact that crosses the lazy boundary by hand; the
 *  curriculum check counts the real thing and fails on a mismatch. */
export interface CourseInfo {
  id: string
  title: Loc
  tagline: Loc
  /** Emoji shown on the course card. */
  icon: string
  /** CSS colour used for the card accent. */
  color: string
  level: Loc
  /** What the learner writes. `math` is the one that is not a programming
   *  language: those courses are worked on paper and answered in a box. */
  language: 'python' | 'html' | 'css' | 'javascript' | 'typescript' | 'sql' | 'react' | 'cpp' | 'mixed' | 'math'
  /** Which half of the catalogue this belongs under.
   *
   *  Not the same question as `language`. The three Python-for-mathematics
   *  courses are about mathematics but are `code`: the learner writes a
   *  program and a runtime checks it. A `math` course is worked on paper and
   *  answered in a box. The two are different enough — different exercises,
   *  different marking, different reason to be here — that a learner
   *  scanning for one should not have to read past the other. */
  track: 'code' | 'math'
  /** Courses that must be finished first. */
  requires: string[]
  /** false = shown on the catalogue but not yet playable. */
  available: boolean
  /** How many of each the curriculum holds. */
  lessons: number
  projects: number
}

/** A course with its curriculum attached — what `loadCourse` hands back. */
export interface Course extends CourseInfo {
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
