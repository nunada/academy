import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { courseInfo } from '../content/catalog'
import { useCourse } from '../app/curriculum'
import { courseItems, type Course, type Lesson } from '../content/types'
import { isUnlocked } from '../lib/progress'
import { formatCountdown } from '../lib/hearts'
import StepView from '../components/StepView'
import { Modal } from '../components/ui'

function findLesson(course: Course | undefined, lessonId: string): Lesson | undefined {
  if (!course) return undefined
  for (const m of course.modules) {
    for (const s of m.submodules) {
      const l = s.lessons.find((x) => x.id === lessonId)
      if (l) return l
    }
  }
  return undefined
}

export default function LessonPage() {
  const { courseId = '', itemId = '' } = useParams()
  const navigate = useNavigate()
  const { state, complete, loseHeart, hearts, nextHeartIn } = useStore()
  const { t, tc } = useI18n()

  const info = courseInfo(courseId)
  const course = useCourse(courseId)
  const lesson = useMemo(() => findLesson(course, itemId), [course, itemId])

  const [index, setIndex] = useState(0)
  const [solved, setSolved] = useState<Set<string>>(new Set())
  const [practice, setPractice] = useState(false)
  const [finished, setFinished] = useState(false)
  const [awarded, setAwarded] = useState(0)
  const [showHeartModal, setShowHeartModal] = useState(false)

  if (!info || !info.available) return <Navigate to="/catalog" replace />
  if (!state || !course) return <main className="page muted">{t('loading')}</main>
  if (!lesson) return <Navigate to={`/course/${courseId}`} replace />
  // A teacher previews material out of order — a learner still climbs the ladder.
  const isTeacher = state.profile.role === 'teacher'
  if (!isTeacher && !isUnlocked(course, lesson.id, state.progress)) {
    return <Navigate to={`/course/${courseId}`} replace />
  }

  const step = lesson.steps[index]
  // A markup step shows an editor beside a preview, which needs the wider page.
  const wide = step.kind === 'web'
  const isLast = index === lesson.steps.length - 1
  const stepSolved = solved.has(step.id)
  const blocked = hearts === 0 && !practice && !isTeacher

  async function handleSolved() {
    if (!lesson) return
    const next = new Set(solved)
    next.add(step.id)
    setSolved(next)

    if (isLast) {
      if (practice) {
        // Practice runs teach but do not record progress or XP.
        setAwarded(0)
        setFinished(true)
        return
      }
      // A teacher's progress still counts — a lesson can be marked done for
      // planning purposes — but XP and the leaderboard are a learner's game.
      const xp = await complete({ courseId, itemId: lesson.id, kind: 'lesson', xp: isTeacher ? 0 : lesson.xp })
      setAwarded(xp)
      setFinished(true)
    }
  }

  async function handleWrong() {
    // A teacher is here to preview the material, not to play it — wrong
    // answers cost nothing and never lock them out.
    if (practice || isTeacher) return
    const left = await loseHeart()
    if (left === 0) setShowHeartModal(true)
  }

  // Where the learner goes next, in course order.
  const items = courseItems(course)
  const pos = items.findIndex((i) => i.id === lesson.id)
  const nextItem = pos >= 0 ? items[pos + 1] : undefined

  if (finished) {
    return (
      <main className="page narrow">
        <div className="card center" style={{ marginTop: 40 }}>
          <div style={{ fontSize: '3rem' }}>{practice ? '📘' : '🎉'}</div>
          <h1>{t('lessonComplete')}</h1>
          <p className="muted">{tc(lesson.title)}</p>
          {practice ? (
            <p className="small muted">
              {tc({
                en: 'Practice mode — no XP recorded. Come back with a heart to earn it.',
                id: 'Mode latihan — XP tidak dicatat. Kembalilah saat punya heart untuk mendapatkannya.',
              })}
            </p>
          ) : isTeacher ? (
            <p className="small muted">
              {tc({
                en: 'Marked done. Teacher accounts do not earn XP.',
                id: 'Ditandai selesai. Akun guru tidak mendapatkan XP.',
              })}
            </p>
          ) : (
            <p className="pill brand" style={{ fontSize: '1rem' }}>
              ⚡ +{awarded} {t('earnedXp')}
            </p>
          )}
          <div className="row" style={{ justifyContent: 'center', marginTop: 18 }}>
            <Link className="btn ghost" to={`/course/${courseId}`}>
              {t('backToMap')}
            </Link>
            {nextItem && (
              <Link className="btn" to={`/course/${courseId}/${nextItem.kind}/${nextItem.id}`}>
                {nextItem.kind === 'project' ? t('miniProject') : t('nextLesson')} →
              </Link>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={wide ? 'page' : 'page narrow'}>
      <div className="between" style={{ marginBottom: 10 }}>
        <Link className="small muted" to={`/course/${courseId}`} style={{ textDecoration: 'none' }}>
          ← {t('backToCourse')}
        </Link>
        <span className="small muted">
          {index + 1} {t('of')} {lesson.steps.length}
        </span>
      </div>

      <div className="stepbar" style={{ marginBottom: 16 }}>
        {lesson.steps.map((s, i) => (
          <i key={s.id} className={solved.has(s.id) ? 'past' : i === index ? 'on' : ''} />
        ))}
      </div>

      <h1 style={{ fontSize: '1.3rem' }}>{tc(lesson.title)}</h1>

      {practice && (
        <div className="banner">
          <span>📘</span>
          <span>
            {tc({
              en: 'Practice mode: answers are not graded and nothing is recorded.',
              id: 'Mode latihan: jawaban tidak dinilai dan tidak ada yang dicatat.',
            })}
          </span>
        </div>
      )}

      <div className="player">
        <StepView
          key={step.id}
          step={step}
          solved={stepSolved}
          onSolved={() => void handleSolved()}
          onWrong={() => void handleWrong()}
          blocked={blocked}
        />

        {stepSolved && !isLast && (
          <button className="btn wide" onClick={() => setIndex((i) => i + 1)}>
            {t('continueNext')} →
          </button>
        )}

        {blocked && (
          <div className="banner">
            <span>💔</span>
            <span>
              {t('outOfHeartsBody')}{' '}
              {nextHeartIn !== null && (
                <b>
                  {t('nextHeartIn')} {formatCountdown(nextHeartIn)}
                </b>
              )}
            </span>
          </div>
        )}
      </div>

      {showHeartModal && (
        <Modal onClose={() => setShowHeartModal(false)}>
          <div className="center">
            <div style={{ fontSize: '2.4rem' }}>💔</div>
            <h2>{t('outOfHearts')}</h2>
            <p className="muted small">{t('outOfHeartsBody')}</p>
            {nextHeartIn !== null && (
              <p className="pill">
                {t('nextHeartIn')} {formatCountdown(nextHeartIn)}
              </p>
            )}
            <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
              <button className="btn ghost" onClick={() => navigate(`/course/${courseId}`)}>
                {t('waitForHeart')}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setPractice(true)
                  setShowHeartModal(false)
                }}
              >
                {t('practiceAnyway')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  )
}
