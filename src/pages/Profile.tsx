import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../app/store'
import { formatDate, useI18n } from '../i18n'
import { useAllCourses } from '../app/curriculum'
import { allTrophyIds, certificateTitle, describeTrophy } from '../lib/progress'
import { AuthError, authErrors, type MedalCounts } from '../lib/db'
import { getBackend } from '../lib/backends'
import { Stat } from '../components/ui'

const MEDAL_RANK_LABELS = ['medalRank1', 'medalRank2', 'medalRank3'] as const

/** Whether the signed-in learner is currently top 3 on the all-time board —
 *  `null` while loading, `-1` once loaded if they are not there. All-time has
 *  only one, continuously-updated ranking, so — unlike the weekly medals
 *  below — there is nothing to accumulate: it is either true right now or it
 *  is not, and it is never shown at all when it is not (see `MedalCard`). */
function useAllTimeRank(userId: string | undefined): number | null {
  const [rank, setRank] = useState<number | null>(null)

  useEffect(() => {
    if (!userId) return
    let alive = true
    setRank(null)
    getBackend()
      .leaderboard('alltime', 'all')
      .then((rows) => alive && setRank(rows.findIndex((r) => r.user_id === userId)))
      .catch(() => alive && setRank(-1))
    return () => {
      alive = false
    }
  }, [userId])

  return rank
}

/** The learner's own accumulated weekly medal counts — how many *completed*
 *  weeks they placed 1st/2nd/3rd overall. `null` while loading. */
function useWeeklyMedals(userId: string | undefined): MedalCounts | null {
  const [medals, setMedals] = useState<MedalCounts | null>(null)

  useEffect(() => {
    if (!userId) return
    let alive = true
    setMedals(null)
    getBackend()
      .myWeeklyMedals()
      .then((m) => alive && setMedals(m))
      .catch(() => alive && setMedals({ gold: 0, silver: 0, bronze: 0 }))
    return () => {
      alive = false
    }
  }, [userId])

  return medals
}

/** One earned medal. Unlike a trophy, there is no locked state to show for a
 *  medal that has never been won — the whole point is that only what was
 *  actually earned appears here at all. */
function MedalCard({ icon, label, detail }: { icon: string; label: string; detail: string }) {
  return (
    <div className="trophy">
      <span className="em">{icon}</span>
      <div>
        <b>{label}</b>
        <div className="small muted">{detail}</div>
      </div>
    </div>
  )
}

/** Username and display name, in place — the same click-to-reveal shape as
 *  the reset-password screen's "sent" panel, so an edit that can fail (the
 *  name might be taken) never navigates the learner away from the page they
 *  were already looking at. */
function ProfileIdentity() {
  const { state, updateProfile } = useStore()
  const { t, lang } = useI18n()
  const profile = state!.profile

  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(profile.username)
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const open = () => {
    setUsername(profile.username)
    setDisplayName(profile.display_name)
    setError(null)
    setSaved(false)
    setEditing(true)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await updateProfile({ username, displayName })
      setEditing(false)
      setSaved(true)
    } catch (err) {
      const code = err instanceof AuthError ? err.code : 'unknown'
      setError(authErrors[code][lang])
    } finally {
      setBusy(false)
    }
  }

  if (!editing) {
    return (
      <>
        <div className="between" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>{profile.display_name}</h1>
            <p className="muted" style={{ margin: 0 }}>
              @{profile.username}
            </p>
          </div>
          <button className="btn ghost sm" onClick={open}>
            {t('edit')}
          </button>
        </div>
        {saved && <p className="small" style={{ color: 'var(--good)', marginTop: 6 }}>{t('profileSaved')}</p>}
      </>
    )
  }

  return (
    <form onSubmit={submit} className="card" style={{ marginBottom: 4 }}>
      <label className="field">
        <span>{t('displayName')}</span>
        <input
          type="text"
          value={displayName}
          required
          maxLength={40}
          onChange={(e) => setDisplayName(e.target.value)}
          autoComplete="name"
        />
      </label>
      <label className="field">
        <span>{t('username')}</span>
        <input
          type="text"
          value={username}
          required
          minLength={3}
          maxLength={24}
          pattern="[A-Za-z0-9_.]+"
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <small className="muted">{t('usernameHint')}</small>
      </label>

      {error && (
        <div className="verdict no" style={{ marginBottom: 14 }}>
          {error}
        </div>
      )}

      <div className="row">
        <button className="btn" disabled={busy}>
          {busy ? t('working') : t('save')}
        </button>
        <button className="btn ghost" type="button" onClick={() => setEditing(false)} disabled={busy}>
          {t('cancel')}
        </button>
      </div>
    </form>
  )
}

export default function Profile() {
  const { state, user, xpTotal, xpWeek } = useStore()
  const { t, tc, lang, setLang } = useI18n()

  // The trophy grid is the one page that names every module, so it is also
  // the one page that waits for every curriculum.
  const courses = useAllCourses()

  // Called unconditionally, ahead of the loading guard below, same as every
  // other hook here — the leaderboard fetch itself waits on `user`.
  const allTimeRank = useAllTimeRank(user?.id)
  const weeklyMedals = useWeeklyMedals(user?.id)

  if (!state || !courses) return <main className="page muted">{t('loading')}</main>

  const earned = new Set(state.trophies.map((x) => x.trophy_id))
  const all = allTrophyIds(courses)

  const allTimePlaced = allTimeRank !== null && allTimeRank >= 0 && allTimeRank < 3
  const stillLoadingMedals = allTimeRank === null || weeklyMedals === null
  const hasAnyMedal =
    allTimePlaced || (weeklyMedals !== null && (weeklyMedals.gold > 0 || weeklyMedals.silver > 0 || weeklyMedals.bronze > 0))
  const wonCount = (n: number) => (lang === 'id' ? `Diraih ${n} kali` : `Won ${n} time${n === 1 ? '' : 's'}`)

  return (
    <main className="page narrow">
      <ProfileIdentity />
      <p className="muted" style={{ marginTop: 4 }}>
        {t('memberSince')} {formatDate(state.profile.created_at, lang)}
      </p>

      <div className="card" style={{ display: 'flex', padding: 6, marginBottom: 20 }}>
        <Stat value={xpWeek} label={t('weekXp')} />
        <Stat value={xpTotal} label={t('totalXpLabel')} />
        <Stat value={state.trophies.length} label={t('trophies')} />
        <Stat value={state.certificates.length} label={t('certificates')} />
      </div>

      <h2>{t('medals')}</h2>
      {stillLoadingMedals ? (
        <p className="muted" style={{ marginBottom: 24 }}>
          {t('loading')}
        </p>
      ) : !hasAnyMedal ? (
        <div className="card muted small" style={{ marginBottom: 24 }}>
          {t('medalsEmpty')}
        </div>
      ) : (
        <div className="grid three" style={{ marginBottom: 24 }}>
          {allTimePlaced && (
            <MedalCard
              icon={['🥇', '🥈', '🥉'][allTimeRank!]}
              label={t('medalAllTime')}
              detail={t(MEDAL_RANK_LABELS[allTimeRank!])}
            />
          )}
          {weeklyMedals!.gold > 0 && (
            <MedalCard icon="🥇" label={t('medalGold')} detail={wonCount(weeklyMedals!.gold)} />
          )}
          {weeklyMedals!.silver > 0 && (
            <MedalCard icon="🥈" label={t('medalSilver')} detail={wonCount(weeklyMedals!.silver)} />
          )}
          {weeklyMedals!.bronze > 0 && (
            <MedalCard icon="🥉" label={t('medalBronze')} detail={wonCount(weeklyMedals!.bronze)} />
          )}
        </div>
      )}

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
