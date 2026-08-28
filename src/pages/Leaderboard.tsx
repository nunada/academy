import { useEffect, useState } from 'react'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { getBackend } from '../lib/backends'
import type { LeaderRow, LeaderboardKind, LeaderboardTrack } from '../lib/db'
import { msUntilWeekEnd } from '../lib/week'

const MEDALS = ['🥇', '🥈', '🥉']

function countdown(ms: number, lang: 'en' | 'id'): string {
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  return lang === 'id' ? `${days} hari ${hours} jam lagi` : `${days}d ${hours}h left`
}

export default function Leaderboard() {
  const { user } = useStore()
  const { t, lang } = useI18n()
  const [kind, setKind] = useState<LeaderboardKind>('weekly')
  const [track, setTrack] = useState<LeaderboardTrack>('all')
  const [rows, setRows] = useState<LeaderRow[] | null>(null)

  // The trophy board has no track, so asking for one would fetch the same
  // rows under a filter the UI is not showing.
  const shownTrack: LeaderboardTrack = kind === 'trophies' ? 'all' : track

  useEffect(() => {
    let alive = true
    setRows(null)
    getBackend()
      .leaderboard(kind, shownTrack)
      .then((r) => alive && setRows(r))
      .catch(() => alive && setRows([]))
    return () => {
      alive = false
    }
  }, [kind, shownTrack])

  const unit = kind === 'trophies' ? '🏆' : 'XP'

  return (
    <main className="page narrow">
      <h1>{t('navLeaderboard')}</h1>

      {/* `.tabs` is inline-flex, so the two rows would otherwise run together
          into one strip of six buttons — which reads as one choice, not two. */}
      <div>
        <div className="tabs">
          <button className={kind === 'weekly' ? 'on' : ''} onClick={() => setKind('weekly')}>
            {t('lbWeekly')}
          </button>
          <button className={kind === 'alltime' ? 'on' : ''} onClick={() => setKind('alltime')}>
            {t('lbAllTime')}
          </button>
          <button className={kind === 'trophies' ? 'on' : ''} onClick={() => setKind('trophies')}>
            {t('lbTrophies')}
          </button>
        </div>
      </div>

      {/* Trophies are not earned in a course — "100 XP in total" belongs to no
          track — so the filter appears only where it means something. */}
      {kind !== 'trophies' && (
        <div>
          <div className="tabs">
            <button className={track === 'all' ? 'on' : ''} onClick={() => setTrack('all')}>
              {t('lbTrackAll')}
            </button>
            <button className={track === 'math' ? 'on' : ''} onClick={() => setTrack('math')}>
              {t('trackMath')}
            </button>
            <button className={track === 'code' ? 'on' : ''} onClick={() => setTrack('code')}>
              {t('trackCode')}
            </button>
          </div>
        </div>
      )}

      {/* The all-time board has nothing to explain, and an empty <p> would still
          carry its bottom margin — so it is left out rather than emptied. */}
      {kind === 'weekly' && (
        <p className="small muted">
          {t('lbWeeklyNote')} · {countdown(msUntilWeekEnd(), lang)}
        </p>
      )}
      {kind === 'trophies' && <p className="small muted">{t('lbTrophyNote')}</p>}
      {kind !== 'trophies' && track !== 'all' && (
        <p className="small muted">{t('lbTrackNote')}</p>
      )}

      {rows === null ? (
        <p className="muted">{t('loading')}</p>
      ) : rows.length === 0 ? (
        <div className="card center muted">{t('empty')}</div>
      ) : (
        <div className="lb">
          {rows.map((r, i) => (
            <div
              className={`lbrow${r.user_id === user?.id ? ' me' : ''}${i < 3 ? ` top${i + 1}` : ''}`}
              key={r.user_id}
            >
              <span className="pos">{i < 3 ? MEDALS[i] : i + 1}</span>
              <span className="who">
                <b>
                  {r.display_name}
                  {r.user_id === user?.id && <span className="pill brand" style={{ marginLeft: 8 }}>{t('you')}</span>}
                </b>
                <span className="small muted">@{r.username}</span>
              </span>
              <span className="val">
                {r.value} {unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
