import { NavLink, Link, Outlet } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { describeTrophy } from '../lib/progress'
import { Hearts } from './ui'
import { Logo } from './Logo'

function LangToggle() {
  const { lang, setLang } = useI18n()
  return (
    <div className="tabs" style={{ marginBottom: 0 }}>
      <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>
        EN
      </button>
      <button className={lang === 'id' ? 'on' : ''} onClick={() => setLang('id')} aria-pressed={lang === 'id'}>
        ID
      </button>
    </div>
  )
}

function TrophyToasts() {
  const { freshTrophies, clearFreshTrophies } = useStore()
  const { tc } = useI18n()
  if (!freshTrophies.length) return null
  return (
    <div className="toasts">
      {freshTrophies.map((id) => {
        const t = describeTrophy(id)
        return (
          <div className="toast" key={id} onClick={clearFreshTrophies} role="status">
            <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
            <div>
              <b>{tc(t.title)}</b>
              <div className="small muted">{tc(t.desc)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Layout() {
  const { user, signOut, hearts, nextHeartIn, xpTotal, mode } = useStore()
  const { t } = useI18n()

  return (
    <div className="app">
      <header className="topbar">
        <Link className="brand" to={user ? '/learn' : '/'}>
          <span className="mark">
            <Logo size={30} />
          </span>
          <span>
            <span className="brand-name">Nunada Academy</span>
            <small>{t('appTagline')}</small>
          </span>
        </Link>

        {user && (
          <nav className="nav">
            <NavLink to="/learn">{t('navLearn')}</NavLink>
            <NavLink to="/catalog">{t('navCatalog')}</NavLink>
            <NavLink to="/playground">{t('navPlayground')}</NavLink>
            <NavLink to="/leaderboard">{t('navLeaderboard')}</NavLink>
            <NavLink to="/profile">{t('navProfile')}</NavLink>
          </nav>
        )}

        <span className="spacer" />

        {user && (
          <>
            <span className="pill brand" title={t('totalXpLabel')}>
              ⚡ {xpTotal}
            </span>
            <Hearts count={hearts} nextIn={nextHeartIn} />
          </>
        )}
        {mode === 'local' && (
          <span className="pill warn" title={t('localModeNote')}>
            {t('localModeBadge')}
          </span>
        )}
        <LangToggle />
        {user && (
          <button className="btn ghost sm" onClick={() => void signOut()}>
            {t('signOut')}
          </button>
        )}
      </header>

      <Outlet />
      <TrophyToasts />
    </div>
  )
}
