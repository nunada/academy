import type { ReactNode } from 'react'
import { useI18n } from '../../i18n'
import type { Loc } from '../../content/types'
import type { WidgetName } from '../../content/articles/types'
import { WIDGETS } from '../../content/articles/widgets'

/** The small pieces every interactive widget is built from. */

export const L = (en: string, id: string): Loc => ({ en, id })

/** The frame every widget sits in: a title, the widget, and nothing else. */
export function Frame({ name, children }: { name: WidgetName; children: ReactNode }) {
  const { tc } = useI18n()
  return (
    <div className="wgt" role="group" aria-label={tc(WIDGETS[name].title)}>
      <h4>{tc(WIDGETS[name].title)}</h4>
      {children}
    </div>
  )
}

/** A decimal separator the reader's language expects. */
export const useSep = () => (useI18n().lang === 'id' ? ',' : '.')
export const dec = (s: string, sep: string) => (sep === ',' ? s.replace('.', ',') : s)

/** Chinese text, marked as such so a screen reader pronounces it as Mandarin and
 *  a browser picks a Chinese font rather than a Japanese one for the same glyphs. */
export function Zh({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span lang="zh-Hans" className={`zh ${className}`.trim()}>
      {children}
    </span>
  )
}

/** A whole number with the reader's thousands separator. */
export const groupNumber = (n: bigint | number, lang: 'en' | 'id'): string =>
  BigInt(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'id' ? '.' : ',')
