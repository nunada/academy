import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { AuthError, authErrors } from '../lib/db'
import type { CourseInfo } from '../content/types'
import { PATHS, courseInfo, coursesIn } from '../content/catalog'
import { courseProgress } from '../lib/progress'
import { Bar } from '../components/ui'

/** The Enroll button. The first time a learner takes anything they are asked, once, for their teacher's username — optional:
 *  left empty they study with Nunada (the admin), which is what an empty `teacher_id` already means, so nothing is written
 *  for it. Later enrollments go straight through; the teacher can be changed from the profile page. */
function EnrollControl({ kind, refId }: { kind: 'course' | 'path'; refId: string }) {
  const { state, enroll, chooseTeacher } = useStore()
  const { t, lang } = useI18n()
  const [asking, setAsking] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const firstTime = state?.profile.role === 'learner' && !state.profile.teacher_id && state.enrollments.length === 0

  if (!asking) {
    return (
      <button className="btn wide" onClick={() => (firstTime ? setAsking(true) : void enroll(kind, refId))}>
        {t('enroll')}
      </button>
    )
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const teacher = name.trim().replace(/^@/, '')
      if (teacher) await chooseTeacher(teacher)
      await enroll(kind, refId)
    } catch (err) {
      const code = err instanceof AuthError ? err.code : 'unknown'
      setError(authErrors[code][lang])
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <label className="field" style={{ marginBottom: 8 }}>
        <span>{t('teacherPromptLabel')}</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={24} />
        <small className="muted">{t('teacherPromptHint')}</small>
      </label>
      {error && (
        <div className="verdict no" style={{ marginBottom: 8 }}>
          {error}
        </div>
      )}
      <div className="row" style={{ gap: 8 }}>
        <button className="btn" disabled={busy}>
          {busy ? t('working') : t('teacherPromptGo')}
        </button>
        <button type="button" className="btn ghost" onClick={() => setAsking(false)} disabled={busy}>
          {t('cancel')}
        </button>
      </div>
    </form>
  )
}

export default function Catalog() {
  const { state, isEnrolled } = useStore()
  const { t, tc } = useI18n()

  const card = (c: CourseInfo) => {
    const enrolled = isEnrolled('course', c.id)
    // Counts and rows only: the catalogue never fetches a curriculum.
    const st = state ? courseProgress(c, state.progress) : null
    const missing = c.requires.map(courseInfo).filter((r): r is NonNullable<typeof r> => Boolean(r))

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
              {c.lessons} {t('lessonsWord')}
            </span>
            <span className="pill">
              {c.projects} {t('projectsWord')}
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
              <EnrollControl kind="course" refId={c.id} />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="page">
      <h1>{t('catalogTitle')}</h1>

      <h2>{t('trackMath')}</h2>
      <div className="grid two">{coursesIn('math').map(card)}</div>

      <h2 style={{ marginTop: 32 }}>{t('trackCode')}</h2>
      <div className="grid two">{coursesIn('code').map(card)}</div>

      <h2 style={{ marginTop: 32 }}>{t('pathsTitle')}</h2>
      <p className="muted small">{t('pathsBlurb')}</p>
      <div className="grid two">
        {PATHS.map((p) => {
          const enrolled = isEnrolled('path', p.id)
          const courses = p.courseIds.map(courseInfo).filter((c): c is NonNullable<typeof c> => Boolean(c))
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
                  <EnrollControl kind="path" refId={p.id} />
                ))}
            </div>
          )
        })}
      </div>
    </main>
  )
}
