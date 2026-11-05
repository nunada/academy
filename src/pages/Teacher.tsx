/** What the learners in a class have done, for whoever is teaching them.
 *
 *  An approved teacher sees the learners who chose them; an admin sees every class, and also approves the teachers who
 *  signed up. The reads behind this page are refused by the database to anybody else, and answer for the caller's own
 *  class only. The route guard in App.tsx only decides whether to render — it is not what protects the rows.
 *
 *  A teacher who is still waiting for approval, or was turned down, gets a page that says so and loads nothing. */

import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../app/store'
import { formatDate, useI18n } from '../i18n'
import { getBackend } from '../lib/backends'
import type { Approval, CourseProgressRow, FeedbackRow, RosterRow, TeacherAccountRow } from '../lib/db'
import { isAdmin, isStaff } from '../lib/roles'
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
  const { mode, state } = useStore()
  const { t, tc, lang } = useI18n()
  const profile = state?.profile
  const admin = isAdmin(profile)
  const staff = isStaff(profile)

  const [roster, setRoster] = useState<RosterRow[] | null>(null)
  const [teachers, setTeachers] = useState<TeacherAccountRow[] | null>(null)
  /** Feedback is read when its tab is opened, on its own: a database that has not been given the newest roles.sql
   *  fails here only, not on the whole page. */
  const [feedback, setFeedback] = useState<FeedbackRow[] | null>(null)
  const [feedbackFailed, setFeedbackFailed] = useState(false)
  /** Moving a student: the teacher picked in each row's menu, the row being moved, the row just moved, and whether the last try failed. */
  const [pick, setPick] = useState<Record<string, string>>({})
  const [moving, setMoving] = useState<string | null>(null)
  const [movedId, setMovedId] = useState<string | null>(null)
  const [moveError, setMoveError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [perCourse, setPerCourse] = useState<CourseProgressRow[] | null>(null)
  const [failed, setFailed] = useState(false)

  const [tab, setTab] = useState<'roster' | 'course' | 'teachers' | 'feedback'>('roster')
  const [courseId, setCourseId] = useState(COURSES[0].id)
  const [sort, setSort] = useState<SortKey>('xp')

  useEffect(() => {
    if (!staff) return
    let alive = true
    const backend = getBackend()
    Promise.all([backend.teacherRoster(), backend.teacherCourseProgress(), admin ? backend.adminTeachers() : Promise.resolve(null)])
      .then(([r, c, tl]) => {
        if (!alive) return
        setRoster(r)
        setPerCourse(c)
        setTeachers(tl)
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [staff, admin, reloadKey])

  useEffect(() => {
    if (!admin || tab !== 'feedback' || feedback !== null) return
    let alive = true
    getBackend()
      .adminFeedback()
      .then((rows) => alive && setFeedback(rows))
      .catch(() => alive && setFeedbackFailed(true))
    return () => {
      alive = false
    }
  }, [admin, tab, feedback])

  /** Who a student can be moved to: the admin (that is "study with Nunada") and every approved teacher. */
  const moveOptions = useMemo(() => {
    if (!admin || !profile) return []
    return [
      { id: profile.id, username: profile.username, label: `${profile.display_name} (@${profile.username}) · ${t('roleAdminBadge')}` },
      ...(teachers ?? []).filter((x) => x.approval === 'approved').map((x) => ({ id: x.user_id, username: x.username, label: `${x.display_name} (@${x.username})` })),
    ]
  }, [admin, profile, teachers, t])
  const teacherIdOf = (r: RosterRow) => moveOptions.find((o) => o.username.toLowerCase() === (r.teacher_username ?? '').toLowerCase())?.id ?? ''

  const move = async (r: RosterRow) => {
    const to = pick[r.user_id]
    if (!to || to === teacherIdOf(r)) return
    setMoving(r.user_id)
    setMoveError(false)
    try {
      await getBackend().adminSetStudentTeacher(r.user_id, to)
      setMovedId(r.user_id)
      setPick((m) => {
        const next = { ...m }
        delete next[r.user_id]
        return next
      })
      setReloadKey((k) => k + 1)
    } catch {
      setMoveError(true)
    } finally {
      setMoving(null)
    }
  }

  const decide = async (userId: string, approval: Approval) => {
    try {
      await getBackend().setTeacherApproval(userId, approval)
      setTeachers(await getBackend().adminTeachers())
    } catch {
      setFailed(true)
    }
  }

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

  // A teacher who has not been approved sees where they stand, and nobody's progress.
  if (profile && !staff) {
    return (
      <main className="page narrow">
        <h1>{t('pendingTitle')}</h1>
        <div className="card">{profile.approval === 'rejected' ? t('rejectedBody') : t('pendingBody')}</div>
      </main>
    )
  }

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
      <h1>{admin ? t('adminTitle') : t('teacherTitle')}</h1>
      <p className="small muted">{admin ? t('adminIntro') : t('teacherIntroOwn')}</p>
      {!admin && profile && (
        <p className="small">
          {t('classCodeHint')} <b>@{profile.username}</b>
        </p>
      )}
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
        {admin && (
          <button className={tab === 'feedback' ? 'on' : ''} onClick={() => setTab('feedback')}>
            {t('tabFeedback')}
          </button>
        )}
        {admin && (
          <button className={tab === 'teachers' ? 'on' : ''} onClick={() => setTab('teachers')}>
            {t('tabTeachers')}
            {(teachers ?? []).some((x) => x.approval === 'pending') && (
              <span className="pill warn" style={{ marginLeft: 6 }}>
                {(teachers ?? []).filter((x) => x.approval === 'pending').length}
              </span>
            )}
          </button>
        )}
      </div>

      {admin && tab === 'roster' && moveError && (
        <div className="verdict no" style={{ marginBottom: 10 }}>
          {t('moveFailed')}
        </div>
      )}
      {admin && tab === 'roster' && <p className="small muted">{t('moveHint')}</p>}

      {tab === 'feedback' && admin ? (
        feedbackFailed ? (
          <div className="card">{t('feedbackFailed')}</div>
        ) : feedback === null ? (
          <div className="card center muted">{t('loading')}</div>
        ) : feedback.length === 0 ? (
          <div className="card center muted">{t('feedbackNone')}</div>
        ) : (
          <>
            <div className="grid three" style={{ marginBottom: 14 }}>
              <div className="card stat">
                <b>{feedback.length}</b>
                <span>{t('feedbackCount')}</span>
              </div>
              <div className="card stat">
                <b>{(feedback.reduce((n, f) => n + f.rating, 0) / feedback.length).toFixed(1).replace('.', lang === 'id' ? ',' : '.')}</b>
                <span>{t('feedbackAverage')}</span>
              </div>
              <div className="card stat">
                <b>{feedback.filter((f) => (f.comment ?? '').trim() !== '').length}</b>
                <span>{t('feedbackCommented')}</span>
              </div>
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const n = feedback.filter((f) => f.rating === star).length
                return (
                  <div className="row" key={star} style={{ gap: 10, alignItems: 'center' }}>
                    <span style={{ width: 28 }} aria-label={`${star}`}>
                      {star}★
                    </span>
                    <div style={{ flex: 1 }}>
                      <Bar percent={Math.round((n / feedback.length) * 100)} />
                    </div>
                    <span className="small muted" style={{ width: 28, textAlign: 'right' }}>
                      {n}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="lb">
              {feedback.map((f) => (
                <div className="card" key={f.id} style={{ marginBottom: 10 }}>
                  <div className="between" style={{ flexWrap: 'wrap', gap: 6 }}>
                    <span>
                      <b aria-label={`${f.rating} / 5`}>
                        {'★'.repeat(f.rating)}
                        <span className="muted">{'☆'.repeat(Math.max(0, 5 - f.rating))}</span>
                      </b>{' '}
                      <span className="small">
                        {f.display_name ? (
                          <>
                            {f.display_name} <span className="muted">@{f.username}</span>
                          </>
                        ) : (
                          <span className="muted">{t('feedbackDeleted')}</span>
                        )}
                        {f.role && f.role !== 'learner' && (
                          <span className="pill brand" style={{ marginLeft: 6 }}>
                            {f.role === 'admin' ? t('roleAdminBadge') : t('roleTeacherBadge')}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="small muted">{formatDate(f.created_at, lang)}</span>
                  </div>
                  <p style={{ margin: '8px 0 0', overflowWrap: 'anywhere' }}>{(f.comment ?? '').trim() ? f.comment : <span className="muted">{t('feedbackNoComment')}</span>}</p>
                </div>
              ))}
            </div>
          </>
        )
      ) : tab === 'teachers' && admin ? (
        (teachers ?? []).length === 0 ? (
          <div className="card center muted">{t('noTeachers')}</div>
        ) : (
          <div className="gridwrap">
            <table className="roster">
              <thead>
                <tr>
                  <th>{t('thTeacher')}</th>
                  <th>{t('thJoined')}</th>
                  <th>{t('thStudents')}</th>
                  <th>{t('thStatus')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {(teachers ?? []).map((x) => (
                  <tr key={x.user_id}>
                    <td>
                      <b>{x.display_name}</b>
                      <span className="small muted" style={{ display: 'block' }}>
                        @{x.username}
                      </span>
                    </td>
                    <td className="small muted">{formatDate(x.created_at, lang)}</td>
                    <td>{x.students}</td>
                    <td>
                      <span className={`pill ${x.approval === 'approved' ? 'good' : x.approval === 'pending' ? 'warn' : ''}`}>
                        {x.approval === 'approved' ? t('approvalApproved') : x.approval === 'pending' ? t('approvalPending') : t('approvalRejected')}
                      </span>
                    </td>
                    <td>
                      <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                        {x.approval !== 'approved' && (
                          <button className="btn sm good" onClick={() => void decide(x.user_id, 'approved')}>
                            {t('approveBtn')}
                          </button>
                        )}
                        {x.approval !== 'rejected' && (
                          <button className="btn sm ghost" onClick={() => void decide(x.user_id, 'rejected')}>
                            {t('rejectBtn')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : sorted.length === 0 ? (
        <div className="card center muted">{t('noLearners')}</div>
      ) : tab === 'roster' ? (
        <div className="gridwrap">
          <table className="roster">
            <thead>
              <tr>
                {th('name', t('thLearner'))}
                {admin && <th>{t('thTeacher')}</th>}
                <th>{t('thJoined')}</th>
                {th('xp', 'XP')}
                {th('lessons', t('thLessons'))}
                {th('projects', t('thProjects'))}
                <th title={t('trophies')}>🏆</th>
                <th title={t('certificates')}>📜</th>
                {th('active', t('thLastActive'))}
                {admin && <th>{t('moveStudent')}</th>}
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
                  {admin && <td className="small">{r.teacher_name ? `${r.teacher_name} (@${r.teacher_username})` : '–'}</td>}
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
                  {admin && (
                    <td>
                      <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
                        <select
                          aria-label={`${t('moveStudent')} — ${r.display_name}`}
                          value={pick[r.user_id] ?? teacherIdOf(r)}
                          onChange={(e) => {
                            setMovedId(null)
                            setPick((m) => ({ ...m, [r.user_id]: e.target.value }))
                          }}
                          style={{ maxWidth: 190 }}
                        >
                          {moveOptions.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <button className="btn sm ghost" disabled={moving === r.user_id || !pick[r.user_id] || pick[r.user_id] === teacherIdOf(r)} onClick={() => void move(r)}>
                          {moving === r.user_id ? t('working') : t('moveBtn')}
                        </button>
                        {movedId === r.user_id && (
                          <span className="small" style={{ color: 'var(--good)' }} role="status">
                            {t('moveDone')}
                          </span>
                        )}
                      </div>
                    </td>
                  )}
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
