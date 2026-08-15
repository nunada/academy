import { Link } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { COURSES, PATHS, courseById } from '../content/catalog'
import { courseItems } from '../content/types'
import { courseStatus } from '../lib/progress'
import { Bar, Stat } from '../components/ui'

export default function Dashboard() {
  const { state, xpTotal, xpWeek, isEnrolled } = useStore()
  const { t, tc } = useI18n()

  if (!state) return <main className="page muted">{t('loading')}</main>

  const myCourses = COURSES.filter((c) => c.available && isEnrolled('course', c.id))
  const myPaths = PATHS.filter((p) => p.available && isEnrolled('path', p.id))

  // Courses reachable through an enrolled path count as "mine" too.
  const fromPaths = myPaths
    .flatMap((p) => p.courseIds)
    .map(courseById)
    .filter((c): c is NonNullable<typeof c> => Boolean(c?.available))
  const courses = [...new Map([...myCourses, ...fromPaths].map((c) => [c.id, c])).values()]

  const next = courses
    .map((c) => ({ course: c, status: courseStatus(c, state.progress) }))
    .find((x) => !x.status.finished)

  return (
    <main className="page">
      <div className="between" style={{ marginBottom: 18 }}>
        <div>
          <h1 style={{ marginBottom: 2 }}>
            {tc({ en: 'Hi, ', id: 'Halo, ' })}
            {state.profile.display_name}
          </h1>
          <p className="muted small" style={{ margin: 0 }}>
            @{state.profile.username}
          </p>
        </div>
        <div className="row">
          <div className="card" style={{ padding: 4, display: 'flex' }}>
            <Stat value={xpWeek} label={t('weekXp')} />
            <Stat value={xpTotal} label={t('totalXpLabel')} />
            <Stat value={state.trophies.length} label={t('trophies')} />
          </div>
        </div>
      </div>

      {next && (
        <section className="card" style={{ marginBottom: 22 }}>
          <div className="between">
            <div>
              <div className="small muted">{t('continueLearning')}</div>
              <h2 style={{ margin: '2px 0 6px' }}>
                {next.course.icon} {tc(next.course.title)}
              </h2>
              <div className="small muted">
                {next.status.done} {t('of')} {next.status.total} {t('complete')} · {next.status.percent}%
              </div>
            </div>
            <Link
              className="btn"
              to={nextHref(next.course.id, next.status.nextItemId, next.course.id)}
            >
              {next.status.done === 0 ? t('startCourse') : t('continueBtn')}
            </Link>
          </div>
          <div style={{ marginTop: 12 }}>
            <Bar percent={next.status.percent} />
          </div>
        </section>
      )}

      <h2>{t('yourCourses')}</h2>
      {courses.length === 0 ? (
        <div className="card center">
          <p className="muted">{t('noCourses')}</p>
          <Link className="btn" to="/catalog">
            {t('browseCatalog')}
          </Link>
        </div>
      ) : (
        <div className="grid two">
          {courses.map((c) => {
            const st = courseStatus(c, state.progress)
            return (
              <Link className="card" to={`/course/${c.id}`} key={c.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="row">
                  <span style={{ fontSize: '1.6rem' }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <b>{tc(c.title)}</b>
                    <div className="small muted">
                      {st.done}/{st.total} · {st.percent}%
                    </div>
                  </div>
                  {st.finished && <span className="pill good">🎓 {t('done')}</span>}
                </div>
                <div style={{ marginTop: 12 }}>
                  <Bar percent={st.percent} good={st.finished} />
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {myPaths.length > 0 && (
        <>
          <h2 style={{ marginTop: 26 }}>{t('pathsTitle')}</h2>
          <div className="grid two">
            {myPaths.map((p) => {
              const inPath = p.courseIds.map(courseById).filter((c): c is NonNullable<typeof c> => Boolean(c))
              const total = inPath.reduce((n, c) => n + courseItems(c).length, 0)
              const done = inPath.reduce((n, c) => n + courseStatus(c, state.progress).done, 0)
              const percent = total ? Math.round((done / total) * 100) : 0
              return (
                <div className="card" key={p.id}>
                  <div className="row">
                    <span style={{ fontSize: '1.6rem' }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <b>{tc(p.title)}</b>
                      <div className="small muted">
                        {done}/{total} · {percent}%
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Bar percent={percent} good={percent === 100} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </main>
  )
}

/** Link straight to the next unfinished item, or the map when there is none. */
function nextHref(courseId: string, itemId: string | null, fallbackCourse: string): string {
  if (!itemId) return `/course/${fallbackCourse}`
  const course = courseById(courseId)
  const item = course && courseItems(course).find((i) => i.id === itemId)
  if (!item) return `/course/${courseId}`
  return `/course/${courseId}/${item.kind}/${itemId}`
}
