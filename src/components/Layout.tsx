import { NavLink, Link, Outlet } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { useAllCourses } from '../app/curriculum'
import { describeTrophy } from '../lib/progress'
import { useTheme, type ThemePref } from '../lib/theme'
import { Hearts, ShareButton } from './ui'
import { Logo } from './Logo'
import { FeedbackWidget } from './FeedbackWidget'

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

/** Light, dark, or follow the system. The saved choice is applied before the first paint (index.html),
 *  so this only shows it and changes it. Three buttons where there is room; on a phone a single button
 *  that shows the current choice and cycles to the next, to keep the top bar to one short row. */
function ThemeToggle() {
  const { t } = useI18n()
  const { pref, setPref } = useTheme()
  const options: { id: ThemePref; icon: string; label: string }[] = [
    { id: 'light', icon: '☀️', label: t('themeLight') },
    { id: 'dark', icon: '🌙', label: t('themeDark') },
    { id: 'system', icon: '🖥️', label: t('themeSystem') },
  ]
  const current = options.find((o) => o.id === pref) ?? options[2]
  const next = options[(options.indexOf(current) + 1) % options.length]
  return (
    <>
      <div className="tabs themesw themegroup" role="group" aria-label={t('themeLabel')}>
        {options.map((o) => (
          <button key={o.id} className={pref === o.id ? 'on' : ''} onClick={() => setPref(o.id)} aria-pressed={pref === o.id} aria-label={o.label} title={o.label}>
            {o.icon}
          </button>
        ))}
      </div>
      <button className="themecycle" onClick={() => setPref(next.id)} aria-label={`${t('themeLabel')}: ${current.label}`} title={`${t('themeLabel')}: ${current.label}`}>
        {current.icon}
      </button>
    </>
  )
}

/** Split in two on purpose. Naming a module trophy needs the curricula, and a
 *  hook cannot be called conditionally — so the guard lives out here, and the
 *  half that asks for them only mounts when there is a toast to name. Layout
 *  renders on every page, including the landing page a signed-out visitor sees,
 *  and that page has no business fetching a curriculum. */
function TrophyToasts() {
  const { freshTrophies } = useStore()
  if (!freshTrophies.length) return null
  return <TrophyList ids={freshTrophies} />
}

function TrophyList({ ids }: { ids: string[] }) {
  const { clearFreshTrophies } = useStore()
  const { tc, lang } = useI18n()
  // A trophy is only ever awarded after the curricula have been read, so by
  // the time a toast appears these are already in the cache.
  const courses = useAllCourses()
  return (
    <div className="toasts">
      {ids.map((id) => {
        const t = describeTrophy(id, courses ?? [])
        const title = tc(t.title)
        const shareText =
          lang === 'id'
            ? `Aku baru saja meraih trofi "${title}" di Nunada Academy! 🏆`
            : `I just earned the "${title}" trophy on Nunada Academy! 🏆`
        return (
          <div className="toast" key={id} onClick={clearFreshTrophies} role="status">
            <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
            <div>
              <b>{title}</b>
              <div className="small muted">{tc(t.desc)}</div>
              <div style={{ marginTop: 6 }}>
                <ShareButton text={shareText} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export interface TopBarProps {
  signedIn: boolean
  isTeacher: boolean
  xp: number
  hearts: number
  nextHeartIn: number | null
  localMode: boolean
  onSignOut: () => void
}

/** The brand, the menu, and the controls. On a phone the controls share one row with the logo and the
 *  menu scrolls sideways on a second row (see the max-width rules in styles.css). */
export function TopBar({ signedIn, isTeacher, xp, hearts, nextHeartIn, localMode, onSignOut }: TopBarProps) {
  const { t, lang } = useI18n()
  // The article list has one address per language.
  const articlesPath = lang === 'id' ? '/artikel' : '/articles'

  return (
    <header className="topbar">
      <Link className="brand" to={signedIn ? '/learn' : '/'}>
        <span className="mark">
          <Logo size={30} />
        </span>
        <span>
          <span className="brand-name">Nunada Academy</span>
          <small>{t('appTagline')}</small>
        </span>
      </Link>

      {signedIn && (
        <nav className="nav">
          <NavLink to="/learn">{t('navLearn')}</NavLink>
          <NavLink to="/catalog">{t('navCatalog')}</NavLink>
          <NavLink to="/playground">{t('navPlayground')}</NavLink>
          <NavLink to="/leaderboard">{t('navLeaderboard')}</NavLink>
          <NavLink to="/profile">{t('navProfile')}</NavLink>
          <NavLink to={articlesPath}>{t('navArticles')}</NavLink>
          <NavLink to="/help">{t('navHelp')}</NavLink>
          {isTeacher && <NavLink to="/teacher">{t('navTeacher')}</NavLink>}
        </nav>
      )}

      <span className="spacer" />

      {signedIn && (
        <>
          <span className="pill brand" title={t('totalXpLabel')}>
            ⚡ {isTeacher ? 99999 : xp}
          </span>
          <Hearts count={hearts} nextIn={nextHeartIn} infinite={isTeacher} />
        </>
      )}
      {localMode && (
        <span className="pill warn" title={t('localModeNote')}>
          {t('localModeBadge')}
        </span>
      )}
      {!signedIn && (
        <>
          <Link className="btn ghost sm" to={articlesPath}>
            {t('navArticles')}
          </Link>
          <Link className="btn ghost sm" to="/help">
            {t('navHelp')}
          </Link>
        </>
      )}
      <ThemeToggle />
      <LangToggle />
      {signedIn && (
        <button className="btn ghost sm signout" onClick={onSignOut} aria-label={t('signOut')} title={t('signOut')}>
          <span className="t">{t('signOut')}</span>
          <span className="i" aria-hidden="true">
            🚪
          </span>
        </button>
      )}
    </header>
  )
}

export default function Layout() {
  const { user, state, signOut, hearts, nextHeartIn, xpTotal, mode } = useStore()

  return (
    <div className="app">
      <TopBar
        signedIn={Boolean(user)}
        isTeacher={state?.profile.role === 'teacher'}
        xp={xpTotal}
        hearts={hearts}
        nextHeartIn={nextHeartIn}
        localMode={mode === 'local'}
        onSignOut={() => void signOut()}
      />

      <Outlet />
      <TrophyToasts />
      <FeedbackWidget />
    </div>
  )
}
