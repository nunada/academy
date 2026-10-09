import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatDate, useI18n } from '../i18n'
import type { Lang } from '../content/types'
import { articleById, articleBySlug, loadArticle } from '../content/articles'
import type { Article } from '../content/articles/types'
import { tagLabel } from '../content/articles/tags'
import { Block, References } from '../components/article/ArticleBlocks'
import { Rich, RichBlock } from '../components/ui'
import { OTHER, articlePath, articleSeo, listPath } from '../lib/articleSeo'
import { siteUrl, useSeo } from '../lib/useSeo'
import { useRouteLang } from '../lib/useRouteLang'

/** The ids of the headings on the page, in order, for the table of contents. */
function tocOf(a: Article, lang: Lang) {
  const items = a.sections.map((s) => ({ id: s.id, label: s.heading[lang] }))
  if (a.glossary?.length) items.push({ id: 'glossary', label: lang === 'id' ? 'Glosarium' : 'Glossary' })
  items.push({ id: 'faq', label: lang === 'id' ? 'Pertanyaan yang sering diajukan' : 'Frequently asked questions' })
  items.push({ id: 'references', label: lang === 'id' ? 'Referensi' : 'References' })
  if (a.related?.length) items.push({ id: 'related', label: lang === 'id' ? 'Artikel terkait' : 'Related articles' })
  return items
}

/** The id of the heading the reader has scrolled to. */
function useActiveHeading(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    // A heading counts as "current" once it crosses the upper third of the
    // screen, and stays current until the next one does.
    const seen = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id)
          else seen.delete(e.target.id)
        }
        const first = ids.find((id) => seen.has(id))
        if (first) setActive(first)
      },
      { rootMargin: '-72px 0px -66% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

/** A thin bar across the top of the page that fills as the article is read. */
function ReadingBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="readbar" aria-hidden="true">
      <i style={{ width: `${pct}%` }} />
    </div>
  )
}

function Toc({ items, active, title }: { items: { id: string; label: string }[]; active: string; title: string }) {
  return (
    <nav className="toc" aria-label={title}>
      <b>{title}</b>
      <ol>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className={active === it.id ? 'on' : ''} aria-current={active === it.id ? 'location' : undefined}>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function ArticlePage({ routeLang }: { routeLang: Lang }) {
  const { slug = '' } = useParams()
  const { t, tc, lang } = useI18n()
  const meta = articleBySlug(routeLang, slug)
  const [article, setArticle] = useState<Article | null | undefined>(undefined)

  useRouteLang(routeLang, (l) => (meta ? articlePath(l, meta) : listPath(l)))

  useEffect(() => {
    let alive = true
    setArticle(undefined)
    if (!meta) {
      setArticle(null)
      return
    }
    loadArticle(meta.id)
      .then((a) => alive && setArticle(a))
      .catch(() => alive && setArticle(null))
    return () => {
      alive = false
    }
  }, [meta?.id])

  // The SEO tags follow the URL's language, not the switch: a crawler fetching
  // /artikel/… is reading the Indonesian page whatever the switch last said.
  const seo = useMemo(() => (article ? articleSeo(article, siteUrl(), routeLang) : null), [article, routeLang])
  useSeo(seo)

  const toc = useMemo(() => (article ? tocOf(article, routeLang) : []), [article, routeLang])
  const active = useActiveHeading(toc.map((x) => x.id))

  // Jump to a section when the address has a #fragment: the content arrives
  // after the page does, so the browser's own scroll has nothing to find yet.
  useEffect(() => {
    if (!article || !window.location.hash) return
    document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
  }, [article])

  if (article === undefined) return <main className="page article muted">{t('loading')}</main>

  if (article === null || !meta) {
    return (
      <main className="page article">
        <p>
          <Link to={listPath(lang)}>{lang === 'id' ? '← Semua artikel' : '← All articles'}</Link>
        </p>
        <div className="card center muted">{lang === 'id' ? 'Artikel itu tidak ditemukan.' : "We couldn't find that article."}</div>
      </main>
    )
  }

  const tocTitle = lang === 'id' ? 'Daftar isi' : 'On this page'

  return (
    <>
      <ReadingBar />
      <main className="page article">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">{lang === 'id' ? 'Beranda' : 'Home'}</Link>
          <span aria-hidden="true">›</span>
          <Link to={listPath(lang)}>{lang === 'id' ? 'Artikel' : 'Articles'}</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{tc(article.title)}</span>
        </nav>

        <div className="article-layout">
          <article className="article-body" lang={routeLang}>
            <header>
              <h1>{tc(article.title)}</h1>
              <p className="artmeta">
                <span>
                  {lang === 'id' ? 'Diperbarui' : 'Updated'}{' '}
                  <time dateTime={article.updated}>{formatDate(article.updated, lang)}</time>
                </span>
                <span>
                  {article.readingMinutes} {lang === 'id' ? 'menit baca' : 'min read'}
                </span>
                <span>{tc(article.level)}</span>
                <span>
                  <Link to={articlePath(OTHER[routeLang], article)} hrefLang={OTHER[routeLang]}>
                    {lang === 'id' ? 'Read in English' : 'Baca dalam Bahasa Indonesia'}
                  </Link>
                </span>
              </p>
              <p className="chips">
                {article.tags.map((id) => (
                  <Link key={id} className="chip static" to={`${listPath(lang)}?tag=${id}`}>
                    {tc(tagLabel(id))}
                  </Link>
                ))}
              </p>
            </header>

            <section className="answerbox" aria-labelledby="quick-answer">
              <h2 id="quick-answer">{lang === 'id' ? 'Jawaban singkat' : 'Quick answer'}</h2>
              <p>
                <Rich text={tc(article.answer)} />
              </p>
              <h3>{lang === 'id' ? 'Poin penting' : 'Key takeaways'}</h3>
              <ul className="richlist">
                {article.keyPoints.map((k, i) => (
                  <li key={i}>
                    <Rich text={tc(k)} />
                  </li>
                ))}
              </ul>
            </section>

            <details className="toc-mobile">
              <summary>{tocTitle}</summary>
              <Toc items={toc} active={active} title={tocTitle} />
            </details>

            {article.sections.map((s) => (
              <section key={s.id} className="artsection" aria-labelledby={s.id}>
                <h2 id={s.id}>
                  {tc(s.heading)}
                  <a className="anchor" href={`#${s.id}`} aria-label={lang === 'id' ? 'Tautan ke bagian ini' : 'Link to this section'}>
                    #
                  </a>
                </h2>
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </section>
            ))}

            {article.glossary && article.glossary.length > 0 && (
              <section className="artsection" aria-labelledby="glossary">
                <h2 id="glossary">{lang === 'id' ? 'Glosarium: istilah penting' : 'Glossary: key terms'}</h2>
                <dl className="glossary">
                  {article.glossary.map((g, i) => (
                    <div key={i}>
                      <dt>
                        <Rich text={tc(g.term)} />
                      </dt>
                      <dd>
                        <Rich text={tc(g.definition)} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section className="artsection" aria-labelledby="faq">
              <h2 id="faq">{lang === 'id' ? 'Pertanyaan yang sering diajukan' : 'Frequently asked questions'}</h2>
              <div className="faq">
                {article.faq.map((f, i) => (
                  <details key={i}>
                    <summary>{tc(f.q)}</summary>
                    <RichBlock text={tc(f.a)} />
                  </details>
                ))}
              </div>
            </section>

            <section className="artsection" aria-labelledby="references">
              <h2 id="references">{lang === 'id' ? 'Referensi' : 'References'}</h2>
              <References items={article.references} />
            </section>

            {article.related && article.related.length > 0 && (
              <section className="artsection" aria-labelledby="related">
                <h2 id="related">{lang === 'id' ? 'Artikel terkait' : 'Related articles'}</h2>
                <div className="grid two">
                  {article.related
                    .map((id) => articleById(id))
                    .filter((r): r is NonNullable<typeof r> => !!r)
                    .map((r) => (
                      <Link key={r.id} className="card artcard" to={articlePath(routeLang, r)}>
                        <h3>{r.title[routeLang]}</h3>
                        <p className="small">{r.description[routeLang]}</p>
                      </Link>
                    ))}
                </div>
              </section>
            )}

            <footer className="artfoot">
              <Link className="btn ghost" to={listPath(lang)}>
                {lang === 'id' ? '← Semua artikel' : '← All articles'}
              </Link>
            </footer>
          </article>

          <aside className="article-aside">
            <Toc items={toc} active={active} title={tocTitle} />
          </aside>
        </div>
      </main>
    </>
  )
}
