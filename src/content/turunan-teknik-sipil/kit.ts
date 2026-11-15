import type { Bi, Loc } from '../types'

/** The small helpers the modules of this course are written with. */

export const L = (en: string, id: string): Loc => ({ en, id })

/** Prose and formulas written as they read: a backslash is a backslash, and a line break is a line break. */
export const T = (s: TemplateStringsArray, ...v: string[]): string => String.raw({ raw: s.raw }, ...v).trim()

/** Lines of working in LaTeX, written once with decimal points. The Indonesian reader gets the same lines with decimal commas (`3{,}46`), so the
 *  numbers under an Indonesian sentence are written the Indonesian way. Use symbols and units in these lines, not words. */
export const S = (...lines: string[]): Bi<string[]> => ({ en: lines, id: lines.map((l) => l.replace(/(\d)\.(\d)/g, '$1{,}$2')) })
