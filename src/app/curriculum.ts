/** Reading a lazily-fetched curriculum from a component.
 *
 *  Both hooks start from the cache, so a course the app has already prefetched
 *  arrives on the very first render and nothing flickers. The loading state is
 *  real but, in practice, is only seen by someone who opened a lesson within a
 *  second of the app starting. */

import { useEffect, useState } from 'react'
import { cachedAllCourses, cachedCourse, loadAllCourses, loadCourse } from '../content/catalog'
import type { Course } from '../content/types'

/** One course's curriculum. `undefined` while it is on its way — and also when
 *  the id is not a course at all, so pair it with `courseInfo` when you need to
 *  tell those apart. */
export function useCourse(id: string): Course | undefined {
  const [course, setCourse] = useState<Course | undefined>(() => cachedCourse(id))

  useEffect(() => {
    const hit = cachedCourse(id)
    if (hit) {
      setCourse(hit)
      return
    }

    let alive = true
    setCourse(undefined)
    void loadCourse(id).then((c) => {
      if (alive) setCourse(c)
    })
    return () => {
      alive = false
    }
  }, [id])

  return course
}

/** Every available curriculum — what the trophy grid needs, since the module
 *  trophies are named after modules. `null` while they are on their way. */
export function useAllCourses(): Course[] | null {
  const [courses, setCourses] = useState<Course[] | null>(() => cachedAllCourses())

  useEffect(() => {
    const hit = cachedAllCourses()
    if (hit) {
      setCourses(hit)
      return
    }

    let alive = true
    void loadAllCourses().then((c) => {
      if (alive) setCourses(c)
    })
    return () => {
      alive = false
    }
  }, [])

  return courses
}
