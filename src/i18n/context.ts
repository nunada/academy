import { createContext, useContext } from 'react'
import type { Lang, Loc } from '../content/types'
import type { UiKey } from './strings'

/** Split from the provider so a hot reload of `index.tsx` does not invalidate
 *  the context object every consumer is already holding. */

export interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  /** UI string by key. */
  t: (key: UiKey) => string
  /** Any bilingual content object. */
  tc: (loc: Loc) => string
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

/** Locale-aware date formatting used by profile + certificates. */
export function formatDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
