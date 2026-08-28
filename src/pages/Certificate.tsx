import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../app/store'
import { formatDate, useI18n } from '../i18n'
import { certificateTitle } from '../lib/progress'

export default function Certificate() {
  const { kind = '', refId = '' } = useParams()
  const { state } = useStore()
  const { t, tc, lang } = useI18n()

  if (!state) return <main className="page muted">{t('loading')}</main>
  if (kind !== 'course' && kind !== 'path') return <Navigate to="/profile" replace />

  const cert = state.certificates.find((c) => c.kind === kind && c.ref_id === refId)
  if (!cert) return <Navigate to="/profile" replace />

  const title = certificateTitle(kind, refId, lang)

  return (
    <main className="page narrow">
      <div className="between noprint" style={{ marginBottom: 14 }}>
        <Link className="small muted" to="/profile" style={{ textDecoration: 'none' }}>
          ← {t('navProfile')}
        </Link>
        <button className="btn sm" onClick={() => window.print()}>
          🖨️ {t('print')}
        </button>
      </div>

      <article className="cert">
        <div className="kicker">
          {t('appName')} · {t('appTagline')}
        </div>
        <h2>{t('certificateOf')}</h2>

        <p className="small" style={{ marginBottom: 0 }}>
          {t('awardedTo')}
        </p>
        <div className="name">{state.profile.display_name}</div>
        <div className="small">@{state.profile.username}</div>

        <div className="rule" />

        <p className="small" style={{ marginBottom: 4 }}>
          {t('hasCompleted')}
        </p>
        <div className="course">
          {kind === 'path' ? '🏆' : '🎓'} {title}
        </div>
        <div className="small">{kind === 'course' ? t('courseWord') : t('pathWord')}</div>

        <p className="small" style={{ marginTop: 22, marginBottom: 0, maxWidth: '46ch', marginInline: 'auto' }}>
          {tc({
            en: 'Completed every lesson and mini project, with all automated checks passing.',
            id: 'Menuntaskan seluruh pelajaran dan mini proyek, dengan semua pemeriksaan otomatis lolos.',
          })}
        </p>

        <div className="foot">
          <span>
            {t('issuedOn')}: {formatDate(cert.issued_at, lang)}
          </span>
          <span>
            {t('serial')}: {cert.serial}
          </span>
        </div>
      </article>
    </main>
  )
}
