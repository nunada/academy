import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../app/store'
import { formatDate, useI18n } from '../i18n'
import { useAllCourses } from '../app/curriculum'
import { certificateTitle, describeTrophy } from '../lib/progress'
import { getBackend } from '../lib/backends'
import type { PublicProfile as PublicProfileData } from '../lib/db'
import { Stat, MedalCard } from '../components/ui'

const MEDAL_RANK_LABELS = ['medalRank1', 'medalRank2', 'medalRank3'] as const

/** Another learner, as everybody signed in may see them: reached by clicking a
 *  name on the leaderboard. Read-only, and only what `PublicProfile` carries —
 *  the learner's own page (`/profile`) stays the one place with edit controls,
 *  the password, and the language switch. */
export default function PublicProfile() {
  const { userId } = useParams()
  const { user } = useStore()
  const { t, tc, lang } = useI18n()
  const courses = useAllCourses()

  // undefined = loading, null = nobody by that id.
  const [data, setData] = useState<PublicProfileData | null | undefined>(undefined)
  // Kept apart from "nobody by that id": a request that failed says nothing
  // about whether the learner exists, and telling somebody "not found" when
  // the database simply could not be asked sends them looking for the wrong fix.
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!userId) return
    let alive = true
    setData(undefined)
    setFailed(false)
    getBackend()
      .publicProfile(userId)
      .then((p) => alive && setData(p))
      .catch(() => {
        if (!alive) return
        setFailed(true)
        setData(null)
      })
    return () => {
      alive = false
    }
  }, [userId])

  // Your own row on the board opens your own page, where the edit controls are.
  if (userId && user?.id === userId) return <Navigate to="/profile" replace />

  const back = (
    <Link className="small" to="/leaderboard">
      {t('backToLeaderboard')}
    </Link>
  )

  if (data === undefined || !courses) return <main className="page narrow muted">{t('loading')}</main>

  if (data === null) {
    return (
      <main className="page narrow">
        {back}
        <div className="card center muted" style={{ marginTop: 14 }}>
          {failed ? t('profileLoadError') : t('profileNotFound')}
        </div>
      </main>
    )
  }

  const { medals } = data
  const hasAnyMedal = data.alltime_rank !== null || medals.gold > 0 || medals.silver > 0 || medals.bronze > 0
  const wonCount = (n: number) => (lang === 'id' ? `Diraih ${n} kali` : `Won ${n} time${n === 1 ? '' : 's'}`)

  return (
    <main className="page narrow">
      {back}
      <h1 style={{ marginBottom: 4, marginTop: 10 }}>{data.display_name}</h1>
      <p className="muted" style={{ margin: 0 }}>
        @{data.username}
      </p>
      <p className="muted" style={{ marginTop: 4 }}>
        {t('memberSince')} {formatDate(data.created_at, lang)}
      </p>

      <div className="card" style={{ display: 'flex', padding: 6, marginBottom: 20 }}>
        <Stat value={data.xp_week} label={t('weekXp')} />
        <Stat value={data.xp_total} label={t('totalXpLabel')} />
        <Stat value={data.trophy_count} label={t('trophies')} />
        <Stat value={data.certificates.length} label={t('certificates')} />
      </div>

      <h2>{t('medals')}</h2>
      {!hasAnyMedal ? (
        <div className="card muted small" style={{ marginBottom: 24 }}>
          {t('profileNoMedals')}
        </div>
      ) : (
        <div className="grid three" style={{ marginBottom: 24 }}>
          {data.alltime_rank !== null && (
            <MedalCard
              icon={['🥇', '🥈', '🥉'][data.alltime_rank - 1]}
              label={t('medalAllTime')}
              detail={t(MEDAL_RANK_LABELS[data.alltime_rank - 1])}
            />
          )}
          {medals.gold > 0 && <MedalCard icon="🥇" label={t('medalGold')} detail={wonCount(medals.gold)} />}
          {medals.silver > 0 && <MedalCard icon="🥈" label={t('medalSilver')} detail={wonCount(medals.silver)} />}
          {medals.bronze > 0 && <MedalCard icon="🥉" label={t('medalBronze')} detail={wonCount(medals.bronze)} />}
        </div>
      )}

      <h2>{t('certificates')}</h2>
      {data.certificates.length === 0 ? (
        <div className="card muted small" style={{ marginBottom: 24 }}>
          {t('profileNoCertificates')}
        </div>
      ) : (
        <div className="grid two" style={{ marginBottom: 24 }}>
          {data.certificates.map((c) => (
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
            </div>
          ))}
        </div>
      )}

      {/* A seeded rival in local mode has a trophy count but no list to show;
          the stat above already carries the count, so the section is left out
          rather than shown as a heading over nothing. */}
      {(data.trophy_count === 0 || data.trophy_ids.length > 0) && (
        <>
          <h2>{t('trophies')}</h2>
          {data.trophy_count === 0 ? (
            <div className="card muted small">{t('profileNoTrophies')}</div>
          ) : (
            <div className="grid two">
              {/* Only the trophies this learner has earned: the locked ones
                  belong to the owner's own page, where they are a to-do list. */}
              {data.trophy_ids.map((id) => {
                const tr = describeTrophy(id, courses)
                return (
                  <div className="trophy" key={id}>
                    <span className="em">{tr.icon}</span>
                    <div>
                      <b>{tc(tr.title)}</b>
                      <div className="small muted">{tc(tr.desc)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </main>
  )
}
