import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { courseById } from '../content/catalog'
import { courseItems, type MiniProject } from '../content/types'
import { isUnlocked } from '../lib/progress'
import { runPython, runTests, splitStdin } from '../lib/python'
import { runWebTests } from '../lib/web'
import { runSql, runSqlTests, type SqlResult } from '../lib/sql'
import { ResultList, fromPython, fromWeb, fromSql, type ResultRow } from '../components/results'
import { CodeBlock, CodeEditor, LivePreview, Output, Rich } from '../components/ui'
import { ResultTable } from '../components/ResultTable'

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
  const [rows, setRows] = useState<ResultRow[] | null>(null)
  const [runOut, setRunOut] = useState<{ text: string; error: boolean } | null>(null)
  const [runRows, setRunRows] = useState<SqlResult | null>(null)
  const [hintsShown, setHintsShown] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [finished, setFinished] = useState(false)
  const [awarded, setAwarded] = useState(0)

  if (!course || !project) return <Navigate to="/catalog" replace />
  if (!state) return <main className="page muted">{t('loading')}</main>
  if (!isUnlocked(course, project.id, state.progress)) return <Navigate to={`/course/${courseId}`} replace />

  // Markup projects render live instead of printing, so the page differs.
  const isWeb = project.runtime === 'web'
  // ...and a project may supply the markup, leaving only the stylesheet or the
  // script to write.
  const isReact = isWeb && project.react === true
  const isJs = isWeb && (project.js === true || isReact)
  const isCss = isWeb && project.html !== undefined && !isJs
  const hasGivenMarkup = isWeb && project.html !== undefined && project.html.trim() !== ''
  const editorLabel = isReact ? 'JSX' : isJs ? 'JavaScript' : isCss ? 'CSS' : 'HTML'
  const consoleOnly = isJs && !isReact && (project.html === undefined || project.html.trim() === '')
  // SQL projects run in the app like Python, but answer with a grid of rows.
  const isSql = project.runtime === 'sql'

  const items = courseItems(course)
  const pos = items.findIndex((i) => i.id === project.id)
  const nextItem = pos >= 0 ? items[pos + 1] : undefined

  async function doRun() {
    if (!project) return
    setBusy(true)
    try {
      if (project.runtime === 'sql') {
        setRunRows(await runSql(project.schema, code))
      } else {
        const res = await runPython(code, splitStdin(stdin))
        setRunOut({
          text: res.error ? `${res.stdout}${res.error}` : res.stdout || '(tidak ada keluaran)',
          error: Boolean(res.error),
        })
      }
      setRows(null)
    } finally {
      setBusy(false)
    }
  }

  async function doCheck() {
    if (!project) return
    setBusy(true)
    try {
      // Each runtime reports differently; they meet again as ResultRow[].
      const next: ResultRow[] =
        project.runtime === 'web'
          ? fromWeb(await runWebTests(code, project.tests, project.html, project.js, project.react))
          : project.runtime === 'sql'
            ? fromSql(await runSqlTests(project.schema, code, project.tests))
            : fromPython(await runTests(code, project.tests))
      setRows(next)
      setRunOut(null)
      setRunRows(null)
      if (next.every((o) => o.passed)) {
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
    <main className={isWeb ? 'page' : 'page narrow'}>
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
        {isWeb ? (
          <>
            {hasGivenMarkup && (
              <details style={{ marginBottom: 12 }}>
                <summary className="io-label" style={{ cursor: 'pointer' }}>
                  {tc({ en: 'The markup (already written for you)', id: 'Markup-nya (sudah disediakan)' })}
                </summary>
                <CodeBlock>{project.html!}</CodeBlock>
              </details>
            )}
            <div className="split">
              <div>
                <div className="io-label">{editorLabel}</div>
                <CodeEditor value={code} onChange={setCode} rows={20} />
              </div>
              <div>
                {!consoleOnly && <div className="io-label">{tc({ en: 'Preview', id: 'Pratinjau' })}</div>}
                <LivePreview source={code} html={project.html} js={project.js} react={project.react} height={420} />
              </div>
            </div>
          </>
        ) : isSql ? (
          <>
            <details style={{ marginBottom: 12 }}>
              <summary className="io-label" style={{ cursor: 'pointer' }}>
                {tc({ en: 'The tables (already set up)', id: 'Tabelnya (sudah disiapkan)' })}
              </summary>
              <CodeBlock>{project.schema}</CodeBlock>
            </details>
            <div className="io-label">SQL</div>
            <CodeEditor value={code} onChange={setCode} rows={16} />
          </>
        ) : (
          <>
            <CodeEditor value={code} onChange={setCode} rows={16} />
            <label className="field" style={{ marginTop: 6 }}>
              <span className="small">{t('stdinLabel')}</span>
              <textarea rows={2} value={stdin} onChange={(e) => setStdin(e.target.value)} spellCheck={false} />
            </label>
          </>
        )}

        <div className="row" style={{ marginTop: isWeb ? 12 : 0 }}>
          {!isWeb && (
            <button className="btn soft sm" onClick={() => void doRun()} disabled={busy}>
              ▶ {t('runCode')}
            </button>
          )}
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

        {busy && !isWeb && !isSql && (
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

        {runRows && (
          <div style={{ marginTop: 12 }}>
            <div className="io-label">{tc({ en: 'Result', id: 'Hasil' })}</div>
            <ResultTable result={runRows} />
          </div>
        )}

        {rows && (
          <>
            <div className={rows.every((r) => r.passed) ? 'verdict ok' : 'verdict no'} style={{ marginTop: 12 }}>
              <b>{rows.every((r) => r.passed) ? t('allTestsPass') : t('someTestsFail')}</b>
            </div>
            <ResultList rows={rows} />
          </>
        )}
      </div>
    </main>
  )
}
