import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { courseById } from '../content/catalog'
import { courseItems, type MiniProject } from '../content/types'
import { isUnlocked } from '../lib/progress'
import { runPython, runTests, splitStdin, type TestOutcome } from '../lib/python'
import { TestList } from '../components/StepView'
import { CodeBlock, CodeEditor, Output, Rich } from '../components/ui'

function findProject(courseId: string, projectId: string): MiniProject | undefined {
  const course = courseById(courseId)
  if (!course) return undefined
  for (const m of course.modules) {
    for (const s of m.submodules) {
      if (s.project.id === projectId) return s.project
    }
  }
  return undefined
}

export default function ProjectPage() {
  const { courseId = '', itemId = '' } = useParams()
  const { state, complete } = useStore()
  const { t, tc } = useI18n()

  const course = courseById(courseId)
  const project = useMemo(() => findProject(courseId, itemId), [courseId, itemId])

  const [code, setCode] = useState(() => project?.starter ?? '')
  const [stdin, setStdin] = useState('')
  const [busy, setBusy] = useState(false)
  const [outcomes, setOutcomes] = useState<TestOutcome[] | null>(null)
  const [runOut, setRunOut] = useState<{ text: string; error: boolean } | null>(null)
  const [hintsShown, setHintsShown] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [finished, setFinished] = useState(false)
  const [awarded, setAwarded] = useState(0)

  if (!course || !project) return <Navigate to="/catalog" replace />
  if (!state) return <main className="page muted">{t('loading')}</main>
  if (!isUnlocked(course, project.id, state.progress)) return <Navigate to={`/course/${courseId}`} replace />

  const items = courseItems(course)
  const pos = items.findIndex((i) => i.id === project.id)
  const nextItem = pos >= 0 ? items[pos + 1] : undefined

  async function doRun() {
    setBusy(true)
    try {
      const res = await runPython(code, splitStdin(stdin))
      setRunOut({
        text: res.error ? `${res.stdout}${res.error}` : res.stdout || '(tidak ada keluaran)',
        error: Boolean(res.error),
      })
      setOutcomes(null)
    } finally {
      setBusy(false)
    }
  }

  async function doCheck() {
    if (!project) return
    setBusy(true)
    try {
      const res = await runTests(code, project.tests)
      setOutcomes(res)
      setRunOut(null)
      if (res.every((o) => o.passed)) {
        const xp = await complete({ courseId, itemId: project.id, kind: 'project', xp: project.xp })
        setAwarded(xp)
        setFinished(true)
      }
    } finally {
      setBusy(false)
    }
  }

  if (finished) {
    return (
      <main className="page narrow">
        <div className="card center" style={{ marginTop: 40 }}>
          <div style={{ fontSize: '3rem' }}>🛠️</div>
          <h1>{t('projectComplete')}</h1>
          <p className="muted">{tc(project.title)}</p>
          <p className="pill brand" style={{ fontSize: '1rem' }}>
            ⚡ +{awarded} {t('earnedXp')}
          </p>
          <div className="row" style={{ justifyContent: 'center', marginTop: 18 }}>
            <Link className="btn ghost" to={`/course/${courseId}`}>
              {t('backToMap')}
            </Link>
            {nextItem && (
              <Link className="btn" to={`/course/${courseId}/${nextItem.kind}/${nextItem.id}`}>
                {t('nextLesson')} →
              </Link>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page narrow">
      <Link className="small muted" to={`/course/${courseId}`} style={{ textDecoration: 'none' }}>
        ← {t('backToCourse')}
      </Link>

      <div className="between" style={{ marginTop: 8 }}>
        <h1 style={{ fontSize: '1.4rem', marginBottom: 4 }}>
          🛠️ {tc(project.title)}
        </h1>
        <span className="pill brand">+{project.xp} XP</span>
      </div>
      <p className="muted">{tc(project.brief)}</p>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="io-label">{t('requirements')}</div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {project.requirements.map((r, i) => (
            <li key={i}>
              <Rich text={tc(r)} />
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <CodeEditor value={code} onChange={setCode} rows={16} />

        <label className="field" style={{ marginTop: 6 }}>
          <span className="small">{t('stdinLabel')}</span>
          <textarea rows={2} value={stdin} onChange={(e) => setStdin(e.target.value)} spellCheck={false} />
        </label>

        <div className="row">
          <button className="btn soft sm" onClick={() => void doRun()} disabled={busy}>
            ▶ {t('runCode')}
          </button>
          <button className="btn sm" onClick={() => void doCheck()} disabled={busy}>
            ✓ {t('runTests')}
          </button>
          {hintsShown < project.hints.length && (
            <button className="btn ghost sm" onClick={() => setHintsShown((n) => n + 1)}>
              💡 {t('hint')} ({hintsShown}/{project.hints.length})
            </button>
          )}
          {hintsShown >= project.hints.length && !showSolution && (
            <button className="btn ghost sm" onClick={() => setShowSolution(true)}>
              {t('showSolution')}
            </button>
          )}
        </div>

        <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>
          {tc({
            en: 'Checking a project never costs a heart — iterate as much as you like.',
            id: 'Memeriksa proyek tidak pernah memakan heart — ulangi sesukamu.',
          })}
        </p>

        {busy && (
          <p className="small muted" style={{ marginTop: 8 }}>
            🐍 {t('loadingPython')}
          </p>
        )}

        {project.hints.slice(0, hintsShown).map((h, i) => (
          <div className="banner" key={i} style={{ marginTop: 10, marginBottom: 0 }}>
            <span>💡</span>
            <span>
              <Rich text={tc(h)} />
            </span>
          </div>
        ))}

        {showSolution && (
          <div style={{ marginTop: 12 }}>
            <div className="io-label">{t('showSolution')}</div>
            <CodeBlock>{project.solution}</CodeBlock>
          </div>
        )}

        {runOut && (
          <div style={{ marginTop: 12 }}>
            <div className="io-label">{t('output')}</div>
            <Output text={runOut.text} error={runOut.error} />
          </div>
        )}

        {outcomes && (
          <>
            <div className={outcomes.every((o) => o.passed) ? 'verdict ok' : 'verdict no'} style={{ marginTop: 12 }}>
              <b>{outcomes.every((o) => o.passed) ? t('allTestsPass') : t('someTestsFail')}</b>
            </div>
            <TestList outcomes={outcomes} />
          </>
        )}
      </div>
    </main>
  )
}
