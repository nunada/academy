import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { formatDate, useI18n } from '../i18n'
import type { Lang } from '../content/types'
import { ARTICLES } from '../content/articles'
import type { ArticleTrack } from '../content/articles/types'
import { TAGS, tagLabel } from '../content/articles/tags'
import { articlePath, listPath, listSeo } from '../lib/articleSeo'
import { buildIndex, search } from '../lib/articleSearch'
import { siteUrl, useSeo } from '../lib/useSeo'
import { useRouteLang } from '../lib/useRouteLang'

export default function Articles({ routeLang }: { routeLang: Lang }) {
  const { t, tc, lang } = useI18n()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const tag = params.get('tag') ?? ''
  const track = (params.get('track') ?? '') as ArticleTrack | ''
  const box = useRef<HTMLInputElement>(null)

  useRouteLang(routeLang, (l) => listPath(l))
  useSeo(useMemo(() => listSeo(siteUrl(), routeLang), [routeLang]))

  // The index covers both languages' titles and keywords, so a reader typing
  // "irrational" in the Indonesian list still finds "Bilangan Real".
  const index = useMemo(
    () =>
      buildIndex(
        ARTICLES.map((a) => ({
          id: a.id,
          title: `${a.title.en} ${a.title.id}`,
          description: a.description[lang],
          tags: a.tags.flatMap((id) => [tagLabel(id).en, tagLabel(id).id]),
          keywords: `${a.keywords.en} ${a.keywords.id}`,
        })),
      ),
    [lang],
  )

  const results = useMemo(() => {
    const byId = new Map(ARTICLES.map((a) => [a.id, a]))
    let list = query.trim()
      ? search(index, query).map((h) => byId.get(h.id)!)
      : [...ARTICLES].sort((a, b) => (a.updated < b.updated ? 1 : -1))
    if (tag) list = list.filter((a) => a.tags.includes(tag))
    if (track) list = list.filter((a) => a.track === track)
    return list
  }, [index, query, tag, track])

  // Press "/" anywhere on the page to jump to the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (e.key === '/' && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
        e.preventDefault()
        box.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const usedTags = TAGS.filter((x) => ARTICLES.some((a) => a.tags.includes(x.id)))
  const filtered = query.trim() !== '' || tag !== '' || track !== ''

  return (
    <main className="page">
      <h1>{lang === 'id' ? 'Artikel' : 'Articles'}</h1>
      <p className="muted" style={{ maxWidth: '62ch' }}>
        {lang === 'id'
          ? 'Penjelasan lengkap tentang matematika dan coding. Tidak perlu akun dan tidak perlu urut: buka yang kamu butuhkan.'
          : 'In-depth explanations of mathematics and coding. No account and no order: open what you need.'}
      </p>

      <div className="searchbar" role="search">
        <input
          ref={box}
          type="search"
          value={query}
          onChange={(e) => set('q', e.target.value)}
          placeholder={lang === 'id' ? 'Cari artikel… (tekan / )' : 'Search articles… (press / )'}
          aria-label={lang === 'id' ? 'Cari artikel' : 'Search articles'}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="chips" role="group" aria-label={lang === 'id' ? 'Saring' : 'Filter'}>
        <button className={track === '' ? 'chip on' : 'chip'} onClick={() => set('track', '')}>
          {t('lbTrackAll')}
        </button>
        <button className={track === 'math' ? 'chip on' : 'chip'} onClick={() => set('track', track === 'math' ? '' : 'math')}>
          {t('trackMath')}
        </button>
        <button className={track === 'code' ? 'chip on' : 'chip'} onClick={() => set('track', track === 'code' ? '' : 'code')}>
          {t('trackCode')}
        </button>
        <span className="chipsep" aria-hidden="true" />
        {usedTags.map((x) => (
          <button key={x.id} className={tag === x.id ? 'chip on' : 'chip'} onClick={() => set('tag', tag === x.id ? '' : x.id)}>
            {tc(x.label)}
          </button>
        ))}
        {filtered && (
          <button className="chip ghost" onClick={() => setParams({}, { replace: true })}>
            {lang === 'id' ? 'Hapus saringan' : 'Clear'}
          </button>
        )}
      </div>

      <p className="small muted" aria-live="polite">
        {lang === 'id' ? `${results.length} artikel` : `${results.length} article${results.length === 1 ? '' : 's'}`}
        {query.trim() ? (lang === 'id' ? ` untuk “${query.trim()}”` : ` for “${query.trim()}”`) : ''}
      </p>

      {results.length === 0 ? (
        <div className="card center muted">
          {lang === 'id' ? 'Tidak ada artikel yang cocok. Coba kata lain, atau hapus saringan.' : 'No article matches. Try another word, or clear the filters.'}
        </div>
      ) : (
        <div className="grid two">
          {results.map((a) => (
            <Link key={a.id} className="card artcard" to={articlePath(routeLang, a)}>
              <span className="small muted">
                {a.track === 'math' ? t('trackMath') : t('trackCode')} · {a.readingMinutes} {lang === 'id' ? 'menit baca' : 'min read'}
              </span>
              <h2>{tc(a.title)}</h2>
              <p className="small">{tc(a.description)}</p>
              <span className="chips">
                {a.tags.map((id) => (
                  <span key={id} className="chip static">
                    {tc(tagLabel(id))}
                  </span>
                ))}
              </span>
              <span className="small muted">
                {lang === 'id' ? 'Diperbarui' : 'Updated'} {formatDate(a.updated, lang)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
