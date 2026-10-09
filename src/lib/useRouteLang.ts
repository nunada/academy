import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import type { Lang } from '../content/types'

/** Keeps the page language and the URL language the same, in both directions.
 *
 *  An article has one address per language (`/articles/real-numbers`,
 *  `/artikel/bilangan-real`), because to a search engine those are two pages.
 *  So the address decides the language when somebody arrives — a link to the
 *  Indonesian page must show Indonesian whatever the visitor had picked last
 *  time — and the EN/ID switch in the header, when used on such a page, must
 *  move to the other address rather than leave the URL saying one thing and the
 *  page the other.
 *
 *  `siblingPath` is where this page lives in the other language, or null if it
 *  has no counterpart. */
export function useRouteLang(routeLang: Lang, siblingPath: (lang: Lang) => string | null) {
  const { lang, setLang } = useI18n()
  const navigate = useNavigate()
  // False until the page language has been made to match the address once. The
  // two effects below would otherwise race on arrival: the second would see a
  // mismatch and "correct" the address back to the visitor's old language.
  const synced = useRef(false)
  // Going from /articles/x to /artikel/x keeps this same component mounted — both
  // routes render the same page — so "arrived" has to be decided again whenever
  // the address's language changes. Without this, following the "Baca dalam
  // Bahasa Indonesia" link looked like the visitor flipping the switch, and the
  // page sent them straight back.
  const lastRoute = useRef(routeLang)

  useEffect(() => {
    if (lastRoute.current !== routeLang) {
      lastRoute.current = routeLang
      synced.current = false
    }
    if (lang === routeLang) {
      synced.current = true
      return
    }
    if (!synced.current) {
      setLang(routeLang)
      return
    }
    // The visitor used the switch after the page was in sync: follow them.
    const to = siblingPath(lang)
    if (to) navigate(to, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, routeLang])
}
