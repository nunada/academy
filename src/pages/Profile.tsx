import { Link } from 'react-router-dom'
import { useStore } from '../app/store'
import { formatDate, useI18n } from '../i18n'
import { useAllCourses } from '../app/curriculum'
import { allTrophyIds, certificateTitle, describeTrophy } from '../lib/progress'
import { Stat } from '../components/ui'

export default function Profile() {
  const { state, xpTotal, xpWeek } = useStore()
  const { t, tc, lang, setLang } = useI18n()

  // The trophy grid is the one page that names every module, so it is also
  // the one page that waits for every curriculum.
  const courses = useAllCourses()

  if (!state || !courses) return <main className="page muted">{t('loading')}</main>

  const earned = new Set(state.trophies.map((x) => x.trophy_id))
  const all = allTrophyIds(courses)

  return (
    <main className="page narrow">
      <h1>{state.profile.display_name}</h1>
      <p className="muted">
        @{state.profile.username} · {t('memberSince')} {formatDate(state.profile.created_at, lang)}
      </p>

      <div className="card" style={{ display: 'flex', padding: 6, marginBottom: 20 }}>
        <Stat value={xpWeek} label={t('weekXp')} />
        <Stat value={xpTotal} label={t('totalXpLabel')} />
        <Stat value={state.trophies.length} label={t('trophies')} />
        <Stat value={state.certificates.length} label={t('certificates')} />
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="between">
          <b>{t('language')}</b>
          <div className="tabs" style={{ marginBottom: 0 }}>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
              English
            </button>
            <button className={lang === 'id' ? 'on' : ''} onClick={() => setLang('id')}>
              Bahasa Indonesia
            </button>
          </div>
        </div>
      </div>

      <div className="card between" style={{ marginBottom: 24 }}>
        <b>{t('password')}</b>
        <Link className="btn ghost sm" to="/reset-password">
          {t('changePassword')}
        </Link>
      </div>

      <h2>{t('certificates')}</h2>
      {state.certificates.length === 0 ? (
        <div className="card muted small">{t('noCertificates')}</div>
      ) : (
        <div className="grid two">
          {state.certificates.map((c) => (
            <div className="card" key={`${c.kind}:${c.ref_id}`}>
              <div className="row">
                <span style={{ fontSize: '1.6rem' }}>{c.kind === 'path' ? '🏆' : '🎓'}</span>
                <div style={{ flex: 1 }}>
                  <b>{certificateTitle(c.kind, c.ref_id, lang)}</b>
                  <div className="small muted">
                    {c.kind === 'course' ? t('courseWord') : t('pathWord')} · {formatDate(c.issued_at, lang)}
                  </div>
                </div>
              </div>
              <Link className="btn wide" to={`/certificate/${c.kind}/${c.ref_id}`} style={{ marginTop: 12 }}>
                {t('viewCertificate')}
              </Link>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 28 }}>{t('trophies')}</h2>
      <div className="grid two">
        {all.map((id) => {
          const tr = describeTrophy(id, courses)
          const got = earned.has(id)
          return (
            <div className={got ? 'trophy' : 'trophy off'} key={id}>
              <span className="em">{got ? tr.icon : '🔒'}</span>
              <div>
                <b>{tc(tr.title)}</b>
                <div className="small muted">{tc(tr.desc)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
