import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { CourseInfo, Lang } from '../content/types'
import { ABOUT, aboutStats, fillStats, type AboutBlock } from '../content/about'
import { COURSES, coursesIn } from '../content/catalog'
import { ARTICLES } from '../content/articles'
import { articlePath } from '../lib/articleSeo'
import { aboutPath, aboutSeo } from '../lib/aboutSeo'
import { siteUrl, useSeo } from '../lib/useSeo'
import { useRouteLang } from '../lib/useRouteLang'
import { useI18n } from '../i18n'
import { Rich, RichBlock } from '../components/ui'

/** What Nunada Academy is, for a visitor and for a search engine. The words come from `content/about.ts`, the same file the build draws the static
 *  HTML from, with the counts taken from the catalog and the article list. */
export default function About({ routeLang }: { routeLang: Lang }) {
  const { t, tc, lang } = useI18n()
  const stats = useMemo(() => aboutStats(COURSES, ARTICLES.length), [])
  const fill = (text: string) => fillStats(text, stats)

  useRouteLang(routeLang, (l) => aboutPath(l))
  // The tags follow the address's language, not the switch: a crawler fetching /tentang is reading the Indonesian page.
  useSeo(useMemo(() => aboutSeo(siteUrl(), routeLang, COURSES), [routeLang]))

  const courseCard = (c: CourseInfo) => (
    <div className="card" id={`course-${c.id}`} key={c.id}>
      <div className="row">
        <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
          {c.icon}
        </span>
        <div>
          <b>{tc(c.title)}</b>
          <div className="small muted">{tc(c.level)}</div>
        </div>
      </div>
      <p className="small muted" style={{ marginTop: 8 }}>
        {tc(c.tagline)}
      </p>
      <div className="row small muted">
        <span className="pill">
          {c.lessons} {t('lessonsWord')}
        </span>
        <span className="pill">
          {c.projects} {t('projectsWord')}
        </span>
      </div>
    </div>
  )

  const block = (b: AboutBlock, i: number) => {
    if (b.kind === 'text') return <RichBlock key={i} text={fill(tc(b.text))} />
    if (b.kind === 'courses') {
      return (
        <div key={i}>
          <h3>{tc(b.heading)}</h3>
          <div className="grid two">{coursesIn(b.track).filter((c) => c.available).map(courseCard)}</div>
        </div>
      )
    }
    const newest = [...ARTICLES].sort((a, z) => z.published.localeCompare(a.published)).slice(0, b.count)
    return (
      <div className="grid two" key={i}>
        {newest.map((a) => (
          <Link key={a.id} className="card artcard" to={articlePath(lang, a)}>
            <h3>{tc(a.title)}</h3>
            <p className="small muted">{tc(a.description)}</p>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <main className="page article about">
      <nav className="crumbs" aria-label={lang === 'id' ? 'Jejak halaman' : 'Breadcrumb'}>
        <Link to="/">{lang === 'id' ? 'Beranda' : 'Home'}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{tc(ABOUT.title)}</span>
      </nav>

      <article className="article-body" lang={routeLang}>
        <header>
          <h1>{tc(ABOUT.title)}</h1>
        </header>

        <section className="answerbox" aria-labelledby="quick-answer">
          <h2 id="quick-answer">{lang === 'id' ? 'Jawaban singkat' : 'Quick answer'}</h2>
          <p>{tc(ABOUT.answer)}</p>
        </section>

        {ABOUT.sections.map((s) => (
          <section key={s.id} className="artsection" aria-labelledby={s.id}>
            <h2 id={s.id}>
              {tc(s.heading)}
              <a className="anchor" href={`#${s.id}`} aria-label={lang === 'id' ? 'Tautan ke bagian ini' : 'Link to this section'}>
                #
              </a>
            </h2>
            {s.blocks.map(block)}
          </section>
        ))}

        <section className="artsection" aria-labelledby="faq">
          <h2 id="faq">{lang === 'id' ? 'Pertanyaan yang sering diajukan' : 'Frequently asked questions'}</h2>
          <div className="faq">
            {ABOUT.faq.map((f, i) => (
              <details key={i}>
                <summary>{tc(f.q)}</summary>
                <Rich text={tc(f.a)} />
              </details>
            ))}
          </div>
        </section>

        <p className="small muted" style={{ marginTop: 32 }}>
          <Link to={aboutPath(routeLang === 'en' ? 'id' : 'en')} hrefLang={routeLang === 'en' ? 'id' : 'en'}>
            {routeLang === 'en' ? 'Baca dalam Bahasa Indonesia' : 'Read in English'}
          </Link>
        </p>
      </article>
    </main>
  )
}
