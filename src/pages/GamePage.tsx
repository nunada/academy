import { useMemo, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { Lang } from '../content/types'
import { GAMES, GAMES_PAGE, type GameId } from '../content/games'
import { gamePath, gameSeo, gamesPath } from '../lib/gameSeo'
import { siteUrl, useSeo } from '../lib/useSeo'
import { useRouteLang } from '../lib/useRouteLang'
import { useI18n } from '../i18n'
import { Rich, RichBlock } from '../components/ui'
import RealMatchGame from '../components/games/RealMatchGame'
import NumberFishGame from '../components/games/NumberFishGame'

/** The game itself, by id. A new game is one more case here, one more entry in `content/games.ts`, and one more `lib/` engine. */
const PLAYERS: Record<GameId, () => ReactNode> = {
  'real-number-match': () => <RealMatchGame />,
  'number-fish': () => <NumberFishGame />,
}

/** A game's page: the game on top, then what it is, how to play it and what it practises, in words a visitor and a search engine can both read.
 *  The words come from `content/games.ts`, the same file the build draws the static HTML from. */
export default function GamePage({ routeLang }: { routeLang: Lang }) {
  const { slug } = useParams()
  const { tc, lang } = useI18n()
  const game = GAMES.find((g) => g.slug[routeLang] === slug)

  useRouteLang(routeLang, (l) => (game ? gamePath(l, game) : null))
  useSeo(useMemo(() => (game ? gameSeo(game, siteUrl(), routeLang) : null), [game, routeLang]))

  if (!game) return <Navigate to={gamesPath(lang)} replace />
  const other: Lang = routeLang === 'en' ? 'id' : 'en'

  return (
    <main className="page article gamepage">
      <nav className="crumbs" aria-label={lang === 'id' ? 'Jejak halaman' : 'Breadcrumb'}>
        <Link to="/">{lang === 'id' ? 'Beranda' : 'Home'}</Link>
        <span aria-hidden="true">›</span>
        <Link to={gamesPath(lang)}>{tc(GAMES_PAGE.title)}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{tc(game.title)}</span>
      </nav>

      <article className="article-body" lang={routeLang}>
        <header>
          <h1>{tc(game.title)}</h1>
        </header>

        <section className="answerbox" aria-labelledby="quick-answer">
          <h2 id="quick-answer">{lang === 'id' ? 'Jawaban singkat' : 'Quick answer'}</h2>
          <p>
            <Rich text={tc(game.answer)} />
          </p>
        </section>

        {PLAYERS[game.id]()}

        {game.sections.map((s) => (
          <section key={s.id} className="artsection" aria-labelledby={s.id}>
            <h2 id={s.id}>
              {tc(s.heading)}
              <a className="anchor" href={`#${s.id}`} aria-label={lang === 'id' ? 'Tautan ke bagian ini' : 'Link to this section'}>
                #
              </a>
            </h2>
            <RichBlock text={tc(s.text)} />
          </section>
        ))}

        <section className="artsection" aria-labelledby="faq">
          <h2 id="faq">{lang === 'id' ? 'Pertanyaan yang sering diajukan' : 'Frequently asked questions'}</h2>
          <div className="faq">
            {game.faq.map((f, i) => (
              <details key={i}>
                <summary>{tc(f.q)}</summary>
                <Rich text={tc(f.a)} />
              </details>
            ))}
          </div>
        </section>

        <p className="small muted" style={{ marginTop: 32 }}>
          <Link to={gamePath(other, game)} hrefLang={other}>
            {routeLang === 'en' ? 'Mainkan dalam Bahasa Indonesia' : 'Play in English'}
          </Link>
        </p>
      </article>
    </main>
  )
}
