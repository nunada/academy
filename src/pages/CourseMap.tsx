import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { courseById } from '../content/catalog'
import { courseStatus, doneIds, isUnlocked } from '../lib/progress'
import { Bar } from '../components/ui'

export default function CourseMap() {
  const { courseId = '' } = useParams()
  const { state } = useStore()
  const { t, tc } = useI18n()

  const course = courseById(courseId)
  if (!course || !course.available) return <Navigate to="/catalog" replace />
  if (!state) return <main className="page muted">{t('loading')}</main>

  const done = doneIds(state.progress)
  const st = courseStatus(course, state.progress)

  return (
    <main className="page narrow">
      <div className="between" style={{ marginBottom: 6 }}>
        <h1 style={{ marginBottom: 0 }}>
          {course.icon} {tc(course.title)}
        </h1>
        {st.finished && (
          <Link className="btn good sm" to={`/certificate/course/${course.id}`}>
            🎓 {t('viewCertificate')}
          </Link>
        )}
      </div>
      <p className="muted">{tc(course.tagline)}</p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="between small" style={{ marginBottom: 8 }}>
          <b>{t('courseProgress')}</b>
          <span className="muted">
            {st.done} / {st.total} · {st.percent}%
          </span>
        </div>
        <Bar percent={st.percent} good={st.finished} />
      </div>

      {course.modules.map((m, mi) => (
        <section className="mod" key={m.id}>
          <div className="row">
            <span className="pill brand">{mi + 1}</span>
            <div>
              <h2 style={{ marginBottom: 0 }}>{tc(m.title)}</h2>
              <div className="small muted">{tc(m.summary)}</div>
            </div>
          </div>

          {m.submodules.map((s) => (
            <div className="sub" key={s.id}>
              <h3 style={{ marginTop: 14 }}>{tc(s.title)}</h3>
              <p className="small muted" style={{ marginTop: -4 }}>
                {tc(s.summary)}
              </p>

              {s.lessons.map((l) => {
                const isDone = done.has(l.id)
                const open = isUnlocked(course, l.id, state.progress)
                const cls = `node${isDone ? ' done' : ''}${open ? '' : ' locked'}`
                const inner = (
                  <>
                    <span className="icon">{isDone ? '✓' : open ? '▶' : '🔒'}</span>
                    <span className="body">
                      <b>{tc(l.title)}</b>
                      <span>{isDone ? t('done') : open ? tc(l.goal) : t('lockedHint')}</span>
                    </span>
                    <span className="pill">+{l.xp} XP</span>
                  </>
                )
                return open ? (
                  <Link className={cls} to={`/course/${course.id}/lesson/${l.id}`} key={l.id}>
                    {inner}
                  </Link>
                ) : (
                  <div className={cls} key={l.id} aria-disabled>
                    {inner}
                  </div>
                )
              })}

              {(() => {
                const p = s.project
                const isDone = done.has(p.id)
                const open = isUnlocked(course, p.id, state.progress)
                const cls = `node project${isDone ? ' done' : ''}${open ? '' : ' locked'}`
                const inner = (
                  <>
                    <span className="icon">{isDone ? '✓' : open ? '🛠️' : '🔒'}</span>
                    <span className="body">
                      <b>
                        {t('miniProject')}: {tc(p.title)}
                      </b>
                      <span>{isDone ? t('done') : open ? tc(p.brief) : t('lockedHint')}</span>
                    </span>
                    <span className="pill">+{p.xp} XP</span>
                  </>
                )
                return open ? (
                  <Link className={cls} to={`/course/${course.id}/project/${p.id}`} key={p.id}>
                    {inner}
                  </Link>
                ) : (
                  <div className={cls} key={p.id} aria-disabled>
                    {inner}
                  </div>
                )
              })()}
            </div>
          ))}
        </section>
      ))}
    </main>
  )
}
