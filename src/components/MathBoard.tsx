/** The answer boxes of a mathematics exercise.
 *
 *  A `math` step has one of these; a mathematics mini project has several, one
 *  per part of the problem set. It draws and it reports — the page above it
 *  owns the typed values and decides what a wrong answer costs.
 */

import { useEffect, useRef, useState } from 'react'
import type { MathBlank, MathTask } from '../content/types'
import { resolveBi } from '../content/types'
import { isRight, isSameFormula } from '../lib/answer'
import { useI18n } from '../i18n'
import { Rich, Tex } from './ui'
import { FigureView } from './Figure'

/** A box wants a formula rather than a number. */
const wantsFormula = (b: MathBlank): b is Extract<MathBlank, { formula: string }> => 'formula' in b

const markBlank = (typed: string, b: MathBlank): boolean =>
  wantsFormula(b)
    ? isSameFormula(typed, { formula: b.formula, variable: b.variable, domain: b.domain })
    : isRight(typed, b.answer, b.tol)

/** One verdict per box. Called only when the learner asks to be checked, so
 *  an empty box marks wrong rather than staying blank. */
export const markTask = (task: MathTask, values: string[]): boolean[] =>
  task.blanks.map((b, i) => markBlank(values[i] ?? '', b))

export const emptyValues = (task: MathTask): string[] => task.blanks.map(() => '')

/** What the palette offers. Deliberately short: these are the characters a
 *  keyboard makes awkward, not a second alphabet. `sqrt(` is spelled out
 *  because that is what a learner can also type by hand, and seeing the two
 *  forms side by side is how they learn the typed one exists. */
const KEYS = ['√', 'π', '^', '/', '(', ')', '|']
const VAR_KEY = 'x'

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
  const { tc, lang } = useI18n()
  const boxes = useRef<(HTMLInputElement | null)[]>([])
  // Which box a palette press lands in. The buttons steal focus, so the last
  // box the learner was in has to be remembered rather than asked for.
  const [active, setActive] = useState(0)

  function set(i: number, v: string) {
    const next = [...values]
    next[i] = v
    onChange(next)
  }

  /** Where the caret should go once the inserted value has been rendered.
   *  It cannot be set at insert time: the box is controlled, so the new value
   *  only reaches the DOM on the next commit, and a caret moved before that
   *  is moved again — to the wrong place — when the commit lands. */
  const caret = useRef<{ box: number; at: number } | null>(null)

  useEffect(() => {
    const want = caret.current
    if (!want) return
    caret.current = null
    const el = boxes.current[want.box]
    if (!el) return
    el.focus()
    el.setSelectionRange(want.at, want.at)
  })

  /** Insert at the caret, not at the end: a learner fixing the middle of an
   *  answer should not have the symbol land somewhere else. */
  function insert(sym: string) {
    const i = Math.min(active, task.blanks.length - 1)
    const el = boxes.current[i]
    const value = values[i] ?? ''
    const at = el?.selectionStart ?? value.length
    const to = el?.selectionEnd ?? at
    caret.current = { box: i, at: at + sym.length }
    set(i, value.slice(0, at) + sym + value.slice(to))
  }

  const anyFormula = task.blanks.some(wantsFormula)

  return (
    <>
      <p className="mathprompt">
        <Rich text={tc(task.prompt)} />
      </p>

      {task.given && (
        <div className="given">
          <Tex src={resolveBi(task.given, lang)} display />
        </div>
      )}

      {task.figure && <FigureView figure={task.figure} />}

      <div className={task.inline ? 'blanks inline' : 'blanks'}>
        {task.blanks.map((b, i) => {
          const mark = marks?.[i]
          const formula = wantsFormula(b)
          return (
            <label className={mark === undefined ? 'mathrow' : mark ? 'mathrow ok' : 'mathrow no'} key={i}>
              {b.label && <Tex src={resolveBi(b.label, lang)} />}
              <input
                ref={(el) => {
                  boxes.current[i] = el
                }}
                className={formula ? 'mathbox wide' : 'mathbox'}
                value={values[i] ?? ''}
                disabled={disabled}
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                placeholder={b.placeholder ?? (formula ? `f(${b.variable ?? 'x'})` : '?')}
                aria-label={`${tc(task.prompt)} — ${i + 1}`}
                onFocus={() => setActive(i)}
                onChange={(e) => set(i, e.target.value)}
              />
              {b.after && <Tex src={resolveBi(b.after, lang)} />}
              {mark !== undefined && <span className="mathmark">{mark ? '✓' : '✕'}</span>}
            </label>
          )
        })}
      </div>

      {!disabled && (
        <div className="mathkeys">
          {(anyFormula ? [VAR_KEY, ...KEYS] : KEYS).map((k) => (
            <button type="button" key={k} onClick={() => insert(k)} aria-label={`${lang === 'id' ? 'sisipkan' : 'insert'} ${k}`}>
              {k}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

/** Said once above the first board on a page: what counts as an answer here. */
export function MathInputNote({ formula = false }: { formula?: boolean }) {
  const { tc } = useI18n()
  return (
    <p className="small muted mathnote">
      {tc(
        formula
          ? {
              en: 'Write the formula however you like — `(x-3)/2` and `x/2 - 1.5` are the same answer. Type `sqrt(`, `pi` and `^`, or use the buttons.',
              id: 'Tulis rumusnya sesukamu — `(x-3)/2` dan `x/2 - 1,5` adalah jawaban yang sama. Ketik `sqrt(`, `pi`, dan `^`, atau pakai tombolnya.',
            }
          : {
              en: 'One number per box, rounded to two decimal places — or the exact form: sqrt(14), -7/2 and 2√3 are all read.',
              id: 'Satu bilangan per kotak, dibulatkan sampai dua desimal — atau bentuk eksaknya: sqrt(14), -7/2, dan 2√3 semuanya terbaca.',
            },
      )}
    </p>
  )
}
