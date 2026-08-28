/** The answer boxes of a mathematics exercise.
 *
 *  A `math` step has one of these; a mathematics mini project has several, one
 *  per part of the problem set. It draws and it reports — the page above it
 *  owns the typed values and decides what a wrong answer costs.
 */

import type { MathTask } from '../content/types'
import { isRight } from '../lib/answer'
import { useI18n } from '../i18n'
import { Rich, Tex } from './ui'
import { FigureView } from './Figure'

/** One verdict per box. Called only when the learner asks to be checked, so
 *  an empty box marks wrong rather than staying blank. */
export const markTask = (task: MathTask, values: string[]): boolean[] =>
  task.blanks.map((b, i) => isRight(values[i] ?? '', b.answer, b.tol))

export const emptyValues = (task: MathTask): string[] => task.blanks.map(() => '')

export function MathBoard({
  task,
  values,
  marks,
  disabled,
  onChange,
}: {
  task: MathTask
  values: string[]
  /** null until the learner has asked to be checked. */
  marks: boolean[] | null
  disabled: boolean
  onChange: (values: string[]) => void
}) {
  const { tc } = useI18n()

  function set(i: number, v: string) {
    const next = [...values]
    next[i] = v
    onChange(next)
  }

  return (
    <>
      <p className="mathprompt">
        <Rich text={tc(task.prompt)} />
      </p>

      {task.given && (
        <div className="given">
          <Tex src={task.given} display />
        </div>
      )}

      {task.figure && <FigureView figure={task.figure} />}

      <div className={task.inline ? 'blanks inline' : 'blanks'}>
        {task.blanks.map((b, i) => {
          const mark = marks?.[i]
          return (
            <label className={mark === undefined ? 'mathrow' : mark ? 'mathrow ok' : 'mathrow no'} key={i}>
              {b.label && <Tex src={b.label} />}
              <input
                className="mathbox"
                value={values[i] ?? ''}
                disabled={disabled}
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                placeholder={b.placeholder ?? '?'}
                aria-label={`${tc(task.prompt)} — ${i + 1}`}
                onChange={(e) => set(i, e.target.value)}
              />
              {b.after && <Tex src={b.after} />}
              {mark !== undefined && <span className="mathmark">{mark ? '✓' : '✕'}</span>}
            </label>
          )
        })}
      </div>
    </>
  )
}

/** Said once above the first board on a page: what counts as a number here. */
export function MathInputNote() {
  const { tc } = useI18n()
  return (
    <p className="small muted mathnote">
      {tc({
        en: 'One number per box, rounded to two decimal places — or the exact form: sqrt(14), -7/2 and 2√3 are all read.',
        id: 'Satu bilangan per kotak, dibulatkan sampai dua desimal — atau bentuk eksaknya: sqrt(14), -7/2, dan 2√3 semuanya terbaca.',
      })}
    </p>
  )
}
