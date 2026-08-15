import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Lang } from '../content/types'
import { ui } from './strings'
import { I18nContext, type I18nValue } from './context'

export { useI18n, formatDate } from './context'
export type { I18nValue } from './context'

const STORAGE_KEY = 'nunada.lang'

function detect(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'id') return saved
  return navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect)

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l)
    document.documentElement.lang = l
    setLangState(l)
  }, [])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key) => ui[key][lang] ?? ui[key].en,
      tc: (loc) => (loc ? (loc[lang] ?? loc.en) : ''),
    }),
    [lang, setLang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
