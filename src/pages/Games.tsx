import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { Lang } from '../content/types'
import { GAMES, GAMES_PAGE } from '../content/games'
import { gamePath, gamesPath, gamesSeo } from '../lib/gameSeo'
import { siteUrl, useSeo } from '../lib/useSeo'
import { useRouteLang } from '../lib/useRouteLang'
import { useI18n } from '../i18n'

/** The list of games. Open to everybody, signed in or not, like the articles. */
export default function Games({ routeLang }: { routeLang: Lang }) {
  const { tc, lang } = useI18n()

  useRouteLang(routeLang, (l) => gamesPath(l))
  useSeo(useMemo(() => gamesSeo(siteUrl(), routeLang), [routeLang]))

  return (
    <main className="page">
      <h1>{tc(GAMES_PAGE.title)}</h1>
      <p className="muted" style={{ maxWidth: '62ch' }}>
        {tc(GAMES_PAGE.intro)}
      </p>
      <div className="grid two" style={{ marginTop: 18 }}>
        {GAMES.map((g) => (
          <Link key={g.id} className="card artcard gamecard" to={gamePath(lang, g)}>
            <div className="gameicon" aria-hidden="true">
              {g.icon}
            </div>
            <h2 style={{ fontSize: '1.15rem', margin: '6px 0' }}>{tc(g.title)}</h2>
            <p className="small muted">{tc(g.tagline)}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
