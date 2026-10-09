import { Suspense, lazy, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import type { ArticleBlock, ArticleReference } from '../../content/articles/types'
import { RichBlock } from '../ui'
import { FigureView } from '../Figure'
import { ArticleWidget } from './Widgets'

// The step renderers pull in every runtime a lesson can use. An article only
// ever shows the quiz-like ones, so the bundle is fetched when one is on screen.
const StepView = lazy(() => import('../StepView'))

const CALLOUT_ICON = { definition: '📘', tip: '💡', warning: '⚠️', note: '📝' } as const

/** One practice item: a lesson step with the game taken out. A wrong answer
 *  costs no heart and earns no XP, and a finished one can be played again. */
function Activity({ title, step }: { title: Loc; step: Extract<ArticleBlock, { kind: 'activity' }>['step'] }) {
  const { tc } = useI18n()
  const [solved, setSolved] = useState(false)
  const [round, setRound] = useState(0)
  return (
    <div className="wgt activity">
      <h4>🎯 {tc(title)}</h4>
      <Suspense fallback={<p className="muted">…</p>}>
        <StepView key={round} step={step} solved={solved} onSolved={() => setSolved(true)} onWrong={() => {}} blocked={false} />
      </Suspense>
      {solved && (
        <button
          className="btn ghost sm"
          style={{ marginTop: 10 }}
          onClick={() => {
            setSolved(false)
            setRound((r) => r + 1)
          }}
        >
          {tc({ en: 'Try again', id: 'Coba lagi' })}
        </button>
      )}
    </div>
  )
}

export function Block({ block }: { block: ArticleBlock }) {
  const { tc } = useI18n()
  switch (block.kind) {
    case 'text':
      return <RichBlock text={tc(block.text)} />
    case 'callout':
      return (
        <aside className={`callout ${block.tone}`}>
          <b>
            <span aria-hidden="true">{CALLOUT_ICON[block.tone]}</span> {tc(block.title)}
          </b>
          <RichBlock text={tc(block.text)} />
        </aside>
      )
    case 'figure':
      return (
        <figure className="artfig">
          <FigureView figure={block.figure} />
        </figure>
      )
    case 'code':
      return (
        <figure className="codefig">
          {block.caption && <figcaption>{tc(block.caption)}</figcaption>}
          <pre className="code" data-lang={block.lang}>
            {block.code}
          </pre>
        </figure>
      )
    case 'activity':
      return <Activity title={block.title} step={block.step} />
    case 'widget':
      return <ArticleWidget name={block.name} />
  }
}

export function References({ items }: { items: ArticleReference[] }) {
  return (
    <ol className="refs">
      {items.map((r, i) => (
        <li key={i}>
          {r.author && <span>{r.author}</span>}
          {r.year && <span> ({r.year})</span>}
          {(r.author || r.year) && '. '}
          <i>{r.title}</i>
          {r.source && <span>. {r.source}</span>}
          {r.url && (
            <>
              {'. '}
              <a href={r.url} rel="noopener noreferrer" target="_blank">
                {r.url}
              </a>
            </>
          )}
          .
        </li>
      ))}
    </ol>
  )
}

