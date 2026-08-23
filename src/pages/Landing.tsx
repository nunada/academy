import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { COURSES, PATHS } from '../content/catalog'
import { lessonCount, projectCount } from '../content/types'
import { Logo } from '../components/Logo'

export default function Landing() {
  const { t, tc } = useI18n()
  const live = COURSES.filter((c) => c.available)

  return (
    <main className="page">
      <section className="hero">
        <Logo size={72} title="Nunada" />
        <h1 style={{ marginTop: 16 }}>{t('heroTitle')}</h1>
        <p>{t('heroBody')}</p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 20 }}>
          <Link className="btn" to="/auth?mode=signup">
            {t('getStarted')}
          </Link>
          <Link className="btn ghost" to="/auth">
            {t('iHaveAccount')}
          </Link>
        </div>
      </section>

      <section className="grid three" style={{ marginTop: 42 }}>
        <div className="card">
          <div style={{ fontSize: '1.6rem' }}>🪜</div>
          <h3>{t('featScaffold')}</h3>
          <p className="muted small">{t('featScaffoldBody')}</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '1.6rem' }}>🛠️</div>
          <h3>{t('featProjects')}</h3>
          <p className="muted small">{t('featProjectsBody')}</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '1.6rem' }}>🏆</div>
          <h3>{t('featCompete')}</h3>
          <p className="muted small">{t('featCompeteBody')}</p>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2>{t('catalogTitle')}</h2>
        <div className="grid two">
          {live.map((c) => (
            <div className="card" key={c.id}>
              <div className="row">
                <span style={{ fontSize: '1.7rem' }}>{c.icon}</span>
                <div>
                  <b>{tc(c.title)}</b>
                  <div className="small muted">{tc(c.level)}</div>
                </div>
              </div>
              <p className="small muted" style={{ marginTop: 10 }}>
                {tc(c.tagline)}
              </p>
              <div className="row small muted">
                <span className="pill">
                  {lessonCount(c)} {t('lessonsWord')}
                </span>
                <span className="pill">
                  {projectCount(c)} {t('projectsWord')}
                </span>
              </div>
            </div>
          ))}
          {PATHS.filter((p) => p.available).map((p) => (
            <div className="card" key={p.id}>
              <div className="row">
                <span style={{ fontSize: '1.7rem' }}>{p.icon}</span>
                <div>
                  <b>{tc(p.title)}</b>
                  <div className="small muted">{t('pathWord')}</div>
                </div>
              </div>
              <p className="small muted" style={{ marginTop: 10 }}>
                {tc(p.blurb)}
              </p>
            </div>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: 14 }}>
          {tc({
            en: 'HTML, CSS, JavaScript, React, SQL, TypeScript and Game Development are on the roadmap — see the catalog.',
            id: 'HTML, CSS, JavaScript, React, SQL, TypeScript, dan Game Development ada di peta jalan — lihat katalog.',
          })}
        </p>
      </section>
    </main>
  )
}
