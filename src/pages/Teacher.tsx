/** What every learner has done, for whoever is teaching them.
 *
 *  The two reads behind this page are refused by the database to anybody whose
 *  profile role is not 'teacher'. The route guard in App.tsx only decides
 *  whether to render — it is not what protects the rows. */

import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../app/store'
import { formatDate, useI18n } from '../i18n'
import { getBackend } from '../lib/backends'
import type { CourseProgressRow, RosterRow } from '../lib/db'
import { COURSES } from '../content/catalog'
import { Bar } from '../components/ui'

type SortKey = 'xp' | 'name' | 'lessons' | 'projects' | 'active'

const DAY = 86400000

/** Days since an ISO timestamp, or null for somebody who has finished nothing. */
function daysSince(iso: string | null): number | null {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / DAY)
}

function LastActive({ iso }: { iso: string | null }) {
  const { t, lang } = useI18n()
  const days = daysSince(iso)

  if (days === null) return <span className="pill warn">{t('neverStarted')}</span>
  if (days === 0) return <span>{t('today')}</span>

  const label = lang === 'id' ? `${days} ${t('daysAgo')}` : `${days}${t('daysAgo')}`
  // A week without finishing anything is the thing a teacher wants to spot from
  // across the table, so it is coloured rather than merely written.
  return days >= 7 ? (
    <span className="pill warn" title={formatDate(iso as string, lang)}>
      {label}
    </span>
  ) : (
    <span title={formatDate(iso as string, lang)}>{label}</span>
  )
}

export default function Teacher() {
  const { mode } = useStore()
  const { t, tc, lang } = useI18n()

  const [roster, setRoster] = useState<RosterRow[] | null>(null)
  const [perCourse, setPerCourse] = useState<CourseProgressRow[] | null>(null)
  const [failed, setFailed] = useState(false)

  const [tab, setTab] = useState<'roster' | 'course'>('roster')
  const [courseId, setCourseId] = useState(COURSES[0].id)
  const [sort, setSort] = useState<SortKey>('xp')

  useEffect(() => {
    let alive = true
    const backend = getBackend()
    Promise.all([backend.teacherRoster(), backend.teacherCourseProgress()])
      .then(([r, c]) => {
        if (!alive) return
        setRoster(r)
        setPerCourse(c)
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [])

  const sorted = useMemo(() => {
    if (!roster) return null
    const rows = [...roster]
    rows.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.display_name.localeCompare(b.display_name)
        case 'lessons':
          return b.lessons - a.lessons || a.username.localeCompare(b.username)
        case 'projects':
          return b.projects - a.projects || a.username.localeCompare(b.username)
        case 'active': {
          // Null means "finished nothing", which belongs at the end of a list
          // sorted by recency rather than at the top of it.
          const x = a.last_active ? new Date(a.last_active).getTime() : -Infinity
          const y = b.last_active ? new Date(b.last_active).getTime() : -Infinity
          return y - x || a.username.localeCompare(b.username)
        }
        default:
          return b.xp - a.xp || a.username.localeCompare(b.username)
      }
    })
    return rows
  }, [roster, sort])

  /** Learners who have finished every item of at least one course.
   *
   *  The denominator comes from the catalogue rather than from SQL: how many
   *  items a course holds is a fact about the curriculum, and it is already
   *  written down once, for the course cards. */
  const finishedACourse = useMemo(() => {
    if (!perCourse) return 0
    const done = new Set<string>()
    for (const row of perCourse) {
      const info = COURSES.find((c) => c.id === row.course_id)
      if (!info) continue
      if (row.lessons + row.projects >= info.lessons + info.projects) done.add(row.user_id)
    }
    return done.size
  }, [perCourse])

  const activeThisWeek = useMemo(
    () => (roster ?? []).filter((r) => (daysSince(r.last_active) ?? Infinity) < 7).length,
    [roster],
  )

  const course = COURSES.find((c) => c.id === courseId) ?? COURSES[0]
  const courseTotal = course.lessons + course.projects

  /** Everyone, including those who have not opened this course — the empty bars
   *  are half the reason to look at this tab. */
  const courseRows = useMemo(() => {
    if (!roster || !perCourse) return null
    const byUser = new Map(perCourse.filter((r) => r.course_id === courseId).map((r) => [r.user_id, r]))
    return roster
      .map((r) => {
        const hit = byUser.get(r.user_id)
        const done = Math.min(courseTotal, (hit?.lessons ?? 0) + (hit?.projects ?? 0))
        return { ...r, done, percent: courseTotal ? Math.round((done / courseTotal) * 100) : 0 }
      })
      .sort((a, b) => b.done - a.done || a.username.localeCompare(b.username))
  }, [roster, perCourse, courseId, courseTotal])

  if (failed) {
    return (
      <main className="page narrow">
        <h1>{t('teacherTitle')}</h1>
        <div className="card">{t('teacherDenied')}</div>
      </main>
    )
  }

  if (!sorted || !courseRows) {
    return <main className="page center muted">{t('loading')}</main>
  }

  const th = (key: SortKey, label: string) => (
    <th>
      <button className={`sortable${sort === key ? ' on' : ''}`} onClick={() => setSort(key)} aria-pressed={sort === key}>
        {label}
      </button>
    </th>
  )

  return (
    <main className="page">
      <h1>{t('teacherTitle')}</h1>
      <p className="small muted">{t('teacherIntro')}</p>
      {mode === 'local' && <p className="small muted">{t('teacherLocalNote')}</p>}

      <div className="grid three" style={{ marginBottom: 18 }}>
        <div className="card stat">
          <b>{sorted.length}</b>
          <span>{t('statLearners')}</span>
        </div>
        <div className="card stat">
          <b>{activeThisWeek}</b>
          <span>{t('statActiveWeek')}</span>
        </div>
        <div className="card stat">
          <b>{finishedACourse}</b>
          <span>{t('statFinished')}</span>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'roster' ? 'on' : ''} onClick={() => setTab('roster')}>
          {t('tabRoster')}
        </button>
        <button className={tab === 'course' ? 'on' : ''} onClick={() => setTab('course')}>
          {t('tabByCourse')}
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="card center muted">{t('noLearners')}</div>
      ) : tab === 'roster' ? (
        <div className="gridwrap">
          <table className="roster">
            <thead>
              <tr>
                {th('name', t('thLearner'))}
                <th>{t('thJoined')}</th>
                {th('xp', 'XP')}
                {th('lessons', t('thLessons'))}
                {th('projects', t('thProjects'))}
                <th title={t('trophies')}>🏆</th>
                <th title={t('certificates')}>📜</th>
                {th('active', t('thLastActive'))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.user_id}>
                  <td>
                    <b>{r.display_name}</b>
                    {r.role === 'teacher' && (
                      <span className="pill brand" style={{ marginLeft: 6 }}>
                        {t('teacherBadge')}
                      </span>
                    )}
                    <span className="small muted" style={{ display: 'block' }}>
                      @{r.username}
                    </span>
                  </td>
                  <td className="small muted">{formatDate(r.created_at, lang)}</td>
                  <td>
                    <b>{r.xp}</b>
                  </td>
                  <td>{r.lessons}</td>
                  <td>{r.projects}</td>
                  <td>{r.trophies}</td>
                  <td>{r.certificates}</td>
                  <td>
                    <LastActive iso={r.last_active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <label className="field" style={{ maxWidth: 320 }}>
            <span>{t('thCourse')}</span>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {tc(c.title)} — {c.lessons + c.projects}
                </option>
              ))}
            </select>
          </label>

          <div className="lb" style={{ marginTop: 14 }}>
            {courseRows.map((r) => (
              <div className="lbrow" key={r.user_id}>
                <div className="who">
                  <b>{r.display_name}</b>
                  <span className="small muted">@{r.username}</span>
                  <div style={{ marginTop: 6 }}>
                    <Bar percent={r.percent} good={r.percent === 100} />
                  </div>
                </div>
                <span className="val small">
                  {r.done === 0 ? (
                    <span className="muted">{t('notStartedCourse')}</span>
                  ) : (
                    <>
                      {r.done} {t('of')} {courseTotal} · {r.percent}%
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
