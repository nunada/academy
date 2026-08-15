import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { AuthError, authErrors } from '../lib/db'

export default function Auth() {
  const [params, setParams] = useSearchParams()
  const mode = params.get('mode') === 'signup' ? 'signup' : 'signin'
  const { signIn, signUp, mode: backendMode } = useStore()
  const { t, lang } = useI18n()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (mode === 'signup') {
        await signUp({ email, password, username, displayName })
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      const code = err instanceof AuthError ? err.code : 'unknown'
      setError(authErrors[code][lang])
    } finally {
      setBusy(false)
    }
  }

  const swap = () => setParams(mode === 'signup' ? {} : { mode: 'signup' })

  return (
    <main className="page narrow" style={{ maxWidth: 440 }}>
      <div className="card" style={{ marginTop: 28 }}>
        <h1 style={{ fontSize: '1.5rem' }}>{mode === 'signup' ? t('authTitleUp') : t('authTitleIn')}</h1>
        <p className="muted small">{mode === 'signup' ? t('authSubUp') : t('authSubIn')}</p>

        {backendMode === 'local' && (
          <div className="banner">
            <span>⚠️</span>
            <span>{t('localModeNote')}</span>
          </div>
        )}

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <>
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
            </>
          )}

          <label className="field">
            <span>{t('email')}</span>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span>{t('password')}</span>
            <input
              type="password"
              value={password}
              required
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
            {mode === 'signup' && <small className="muted">{t('passwordHint')}</small>}
          </label>

          {error && (
            <div className="verdict no" style={{ marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button className="btn wide" disabled={busy}>
            {busy ? t('working') : mode === 'signup' ? t('signUp') : t('signIn')}
          </button>
        </form>

        <p className="small muted center" style={{ marginTop: 16, marginBottom: 0 }}>
          {mode === 'signup' ? t('haveAccount') : t('noAccount')}{' '}
          <button className="btn ghost sm" type="button" onClick={swap}>
            {mode === 'signup' ? t('signIn') : t('signUp')}
          </button>
        </p>
      </div>

      <p className="center small muted" style={{ marginTop: 18 }}>
        <Link to="/">← {t('appName')}</Link>
      </p>
    </main>
  )
}
