/** Where a reset link lands.
 *
 *  Public on purpose. In Supabase mode the link carries a recovery token in the
 *  URL fragment, and supabase-js has already spent it on a session by the time
 *  this renders — so somebody arriving here is signed in, and a guard that sent
 *  signed-in visitors away would send them away from the one page they came
 *  for. In local mode the token is a query parameter and is spent below.
 *
 *  The same page also serves somebody who is simply changing their password
 *  from their profile; the only difference is where they came from. */

import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { getBackend } from '../lib/backends'
import { AuthError, authErrors } from '../lib/db'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? undefined
  const { mode: backendMode } = useStore()
  const { t, lang } = useI18n()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [again, setAgain] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    // Checked here rather than by the backend: the two fields only exist in
    // this form, so nothing further down could tell them apart.
    if (password !== again) {
      setError(t('passwordMismatch'))
      return
    }
    setBusy(true)
    setError(null)
    try {
      await getBackend().updatePassword(password, token)
      setDone(true)
      // Long enough to read the confirmation, short enough not to feel stuck.
      window.setTimeout(() => navigate('/learn'), 1600)
    } catch (err) {
      setError(authErrors[err instanceof AuthError ? err.code : 'unknown'][lang])
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page narrow" style={{ maxWidth: 440 }}>
      <div className="card" style={{ marginTop: 28 }}>
        <h1 style={{ fontSize: '1.5rem' }}>{t('newPasswordTitle')}</h1>
        <p className="muted small">{t('newPasswordSub')}</p>

        {backendMode === 'local' && (
          <div className="banner">
            <span>⚠️</span>
            <span>{t('localModeNote')}</span>
          </div>
        )}

        {done ? (
          <div className="verdict ok">{t('newPasswordDone')}</div>
        ) : (
          <form onSubmit={submit}>
            <label className="field">
              <span>{t('newPassword')}</span>
              <input
                type="password"
                value={password}
                required
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <small className="muted">{t('passwordHint')}</small>
            </label>

            <label className="field">
              <span>{t('newPasswordAgain')}</span>
              <input
                type="password"
                value={again}
                required
                minLength={6}
                onChange={(e) => setAgain(e.target.value)}
                autoComplete="new-password"
              />
            </label>

            {error && (
              <div className="verdict no" style={{ marginBottom: 14 }}>
                {error}
              </div>
            )}

            <button className="btn wide" disabled={busy}>
              {busy ? t('working') : t('newPasswordSave')}
            </button>
          </form>
        )}
      </div>

      <p className="center small muted" style={{ marginTop: 18 }}>
        <Link to="/auth">← {t('signIn')}</Link>
      </p>
    </main>
  )
}
