/** Shorthand for writing the Code Blocks course: block constructors, level
 *  builders and the lesson steps that every lesson is made of. */

import type { Block, BlockKind, BlocksLevel, Cond, Num, Program, Val } from '../../lib/blocks'
import type { BlocksTask, Loc, Step } from '../types'

export const L = (en: string, id: string): Loc => ({ en, id })

/* ----------------------------------------------------------------- blocks */

export const move = (n: Num = 1): Block => ({ t: 'move', n })
export const left = (): Block => ({ t: 'turn', dir: 'left' })
export const right = (): Block => ({ t: 'turn', dir: 'right' })
export const collect = (): Block => ({ t: 'collect' })
export const say = (what: string | number | Val): Block => ({
  t: 'say',
  what: typeof what === 'string' ? { k: 'text', v: what } : typeof what === 'number' ? { k: 'num', v: what } : what,
})
export const sayVar = (name: string): Block => ({ t: 'say', what: { k: 'var', name } })
export const sayStars = (): Block => ({ t: 'say', what: { k: 'stars' } })
export const repeat = (n: Num, body: Block[]): Block => ({ t: 'repeat', n, body })
export const when = (cond: Cond, then: Block[], otherwise?: Block[]): Block => ({ t: 'if', cond, then, ...(otherwise ? { otherwise } : {}) })
export const whileDo = (cond: Cond, body: Block[]): Block => ({ t: 'while', cond, body })
export const set = (name: string, value: Num): Block => ({ t: 'set', name, value })
export const change = (name: string, by: Num): Block => ({ t: 'change', name, by })
export const call = (name: string): Block => ({ t: 'call', name })

export const clear: Cond = { t: 'front-clear' }
export const wall: Cond = { t: 'front-blocked' }
export const onStar: Cond = { t: 'on-star' }
export const onGoal: Cond = { t: 'on-goal' }
export const notGoal: Cond = { t: 'not-on-goal' }
export const cmp = (name: string, op: '<' | '>' | '=' | '<=' | '>=' | '!=', value: Num): Cond => ({ t: 'cmp', name, op, value })

export const prog = (main: Block[], defs?: Record<string, Block[]>): Program => (defs ? { main, defs } : { main })

/* ----------------------------------------------------------------- levels */

interface LevelSpec {
  worlds: string[] | string[][]
  allowed: BlockKind[]
  reach?: boolean
  stars?: boolean
  say?: string[]
  max?: number
  must?: BlockKind[]
  vars?: string[]
  defs?: string[]
  conds?: BlocksLevel['conds']
}

/** `worlds` may be one grid (an array of rows) or several (an array of grids). */
export const level = (s: LevelSpec): BlocksLevel => ({
  worlds: typeof s.worlds[0] === 'string' ? [s.worlds as string[]] : (s.worlds as string[][]),
  allowed: s.allowed,
  ...(s.conds ? { conds: s.conds } : {}),
  ...(s.vars ? { vars: s.vars } : {}),
  ...(s.defs ? { defs: s.defs } : {}),
  ...(s.max !== undefined ? { maxBlocks: s.max } : {}),
  ...(s.must ? { mustUse: s.must } : {}),
  goal: { ...(s.reach ? { reach: true } : {}), ...(s.stars ? { collectAll: true } : {}), ...(s.say ? { say: s.say } : {}) },
})

/* ------------------------------------------------------------------ steps */

export const concept = (id: string, title: Loc, body: Loc, code?: Loc): Step => ({
  kind: 'concept',
  id,
  title,
  body,
  ...(code ? { code } : {}),
})

export const quiz = (id: string, prompt: Loc, options: Loc[], answer: number, explain: Loc, hint: Loc, code?: Loc): Step => ({
  kind: 'quiz',
  id,
  prompt,
  ...(code ? { code } : {}),
  options,
  answer,
  explain,
  hint,
})

export const multi = (id: string, prompt: Loc, options: Loc[], answer: number[], explain: Loc, hint: Loc): Step => ({
  kind: 'multi',
  id,
  prompt,
  options,
  answer,
  explain,
  hint,
})

export const judge = (id: string, prompt: Loc, statements: Loc[], answer: boolean[], explain: Loc, hint: Loc): Step => ({
  kind: 'judge',
  id,
  prompt,
  statements,
  answer,
  explain,
  hint,
})

export const order = (id: string, prompt: Loc, lines: { en: string[]; id: string[] }, explain: Loc, hint: Loc): Step => ({
  kind: 'order',
  id,
  prompt,
  lines,
  explain,
  hint,
})

export const fill = (id: string, prompt: Loc, template: { en: string; id: string }, blanks: string[] | { en: string[]; id: string[] }, explain: Loc, hint: Loc): Step => ({
  kind: 'fill',
  id,
  prompt,
  template,
  blanks,
  explain,
  hint,
})

export const robot = (id: string, prompt: Loc, lv: BlocksLevel, solution: Program, hints: Loc[], starter?: Program): Step => ({
  kind: 'blocks',
  id,
  prompt,
  level: lv,
  ...(starter ? { starter } : {}),
  hints,
  solution,
})

export const task = (prompt: Loc, lv: BlocksLevel, solution: Program, starter?: Program): BlocksTask => ({
  prompt,
  level: lv,
  ...(starter ? { starter } : {}),
  solution,
})
