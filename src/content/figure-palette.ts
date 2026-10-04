import type { Figure } from '../lib/figure'
import type { Module } from './types'

/** Draw every figure in a course in the plain-colour palette.
 *
 *  A course whose text says "the red dot" and "the orange bar" needs colours
 *  that really are those, so each of its figures is marked `palette: 'kid'`
 *  (see `.fig.kid` in styles.css). Done once, at the course's index, so no
 *  figure has to remember to ask for it. */
export function plainColours(modules: Module[]): Module[] {
  const mark = (f: Figure | undefined) => {
    if (f) f.palette = 'kid'
  }
  for (const m of modules) {
    for (const s of m.submodules) {
      for (const l of s.lessons) for (const st of l.steps) if ('figure' in st) mark(st.figure)
      if (s.project.runtime === 'math') for (const t of s.project.tasks) mark(t.figure)
    }
  }
  return modules
}
