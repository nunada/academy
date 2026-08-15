import { Link } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { COURSES, PATHS, courseById } from '../content/catalog'
import { lessonCount, projectCount } from '../content/types'
import { courseStatus } from '../lib/progress'
import { Bar } from '../components/ui'

export default function Catalog() {
  const { state, enroll, isEnrolled } = useStore()
  const { t, tc } = useI18n()

  return (
    <main className="page">
      <h1>{t('catalogTitle')}</h1>
      <div className="grid two">
        {COURSES.map((c) => {
          const enrolled = isEnrolled('course', c.id)
          const st = state ? courseStatus(c, state.progress) : null
          const missing = c.requires
            .map(courseById)
            .filter((r): r is NonNullable<typeof r> => Boolean(r))

          return (
            <div className="card" key={c.id} style={{ opacity: c.available ? 1 : 0.72 }}>
              <div className="row">
                <span style={{ fontSize: '1.8rem' }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <b>{tc(c.title)}</b>
                  <div className="small muted">{tc(c.level)}</div>
                </div>
                {!c.available && <span className="pill">{t('comingSoon')}</span>}
              </div>

              <p className="small muted" style={{ marginTop: 10 }}>
                {tc(c.tagline)}
              </p>

              {c.available && (
                <div className="row small">
                  <span className="pill">
                    {lessonCount(c)} {t('lessonsWord')}
                  </span>
                  <span className="pill">
                    {projectCount(c)} {t('projectsWord')}
                  </span>
                </div>
              )}

              {missing.length > 0 && (
                <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>
                  {t('requiresLabel')}: {missing.map((r) => tc(r.title)).join(', ')}
                </p>
              )}

              {c.available && (
                <div style={{ marginTop: 14 }}>
                  {enrolled && st && (
                    <div style={{ marginBottom: 10 }}>
                      <Bar percent={st.percent} good={st.finished} />
                    </div>
                  )}
                  {enrolled ? (
                    <Link className="btn wide" to={`/course/${c.id}`}>
                      {st && st.done > 0 ? t('continueBtn') : t('startCourse')}
                    </Link>
                  ) : (
                    <button className="btn wide" onClick={() => void enroll('course', c.id)}>
                      {t('enroll')}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <h2 style={{ marginTop: 32 }}>{t('pathsTitle')}</h2>
      <p className="muted small">{t('pathsBlurb')}</p>
      <div className="grid two">
        {PATHS.map((p) => {
          const enrolled = isEnrolled('path', p.id)
          const courses = p.courseIds.map(courseById).filter((c): c is NonNullable<typeof c> => Boolean(c))
          return (
            <div className="card" key={p.id} style={{ opacity: p.available ? 1 : 0.72 }}>
              <div className="row">
                <span style={{ fontSize: '1.8rem' }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <b>{tc(p.title)}</b>
                  <div className="small muted">
                    {courses.map((c) => tc(c.title)).join(' → ')}
                  </div>
                </div>
                {!p.available && <span className="pill">{t('comingSoon')}</span>}
              </div>
              <p className="small muted" style={{ marginTop: 10 }}>
                {tc(p.blurb)}
              </p>
              {p.available &&
                (enrolled ? (
                  <span className="pill good">✓ {t('enrolled')}</span>
                ) : (
                  <button className="btn wide" onClick={() => void enroll('path', p.id)}>
                    {t('enroll')}
                  </button>
                ))}
            </div>
          )
        })}
      </div>
    </main>
  )
}
