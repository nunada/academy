import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { getBackend } from '../lib/backends'
import { AuthError, authErrors } from '../lib/db'

export default function Auth() {
  const [params, setParams] = useSearchParams()
  const asked = params.get('mode')
  const mode: 'signup' | 'signin' | 'reset' = asked === 'signup' ? 'signup' : asked === 'reset' ? 'reset' : 'signin'
  const { signIn, signUp, mode: backendMode } = useStore()
  const { t, lang } = useI18n()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /** Set once a reset has been asked for. Says the same thing whether or not
   *  the address has an account — see requestPasswordReset. */
  const [sent, setSent] = useState<{ localLink?: string } | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (mode === 'reset') {
        setSent(await getBackend().requestPasswordReset(email))
      } else if (mode === 'signup') {
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

  const judul = mode === 'signup' ? t('authTitleUp') : mode === 'reset' ? t('resetTitle') : t('authTitleIn')
  const sub_ = mode === 'signup' ? t('authSubUp') : mode === 'reset' ? t('resetSub') : t('authSubIn')

  return (
    <main className="page narrow" style={{ maxWidth: 440 }}>
      <div className="card" style={{ marginTop: 28 }}>
        <h1 style={{ fontSize: '1.5rem' }}>{judul}</h1>
        <p className="muted small">{sub_}</p>

        {backendMode === 'local' && (
          <div className="banner">
            <span>⚠️</span>
            <span>{t('localModeNote')}</span>
          </div>
        )}

        {sent ? (
          <>
            <div className="verdict ok" style={{ marginBottom: 14 }}>
              {t('resetSentBody')}
            </div>
            {sent.localLink && (
              <p className="small muted">
                {t('resetLocalNote')} <Link to={sent.localLink}>{t('resetLocalOpen')}</Link>
              </p>
            )}
          </>
        ) : (
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

          {mode !== 'reset' && (
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
          )}

          {error && (
            <div className="verdict no" style={{ marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button className="btn wide" disabled={busy}>
            {busy ? t('working') : mode === 'signup' ? t('signUp') : mode === 'reset' ? t('resetSend') : t('signIn')}
          </button>
        </form>
        )}

        {mode === 'signin' && (
          <p className="small center" style={{ marginTop: 12, marginBottom: 0 }}>
            <button className="btn ghost sm" type="button" onClick={() => setParams({ mode: 'reset' })}>
              {t('forgotPassword')}
            </button>
          </p>
        )}

        {mode === 'reset' ? (
          <p className="small muted center" style={{ marginTop: 16, marginBottom: 0 }}>
            <button className="btn ghost sm" type="button" onClick={() => setParams({})}>
              ← {t('signIn')}
            </button>
          </p>
        ) : (
          <p className="small muted center" style={{ marginTop: 16, marginBottom: 0 }}>
            {mode === 'signup' ? t('haveAccount') : t('noAccount')}{' '}
            <button className="btn ghost sm" type="button" onClick={swap}>
              {mode === 'signup' ? t('signIn') : t('signUp')}
            </button>
          </p>
        )}
      </div>

      <p className="center small muted" style={{ marginTop: 18 }}>
        <Link to="/">← {t('appName')}</Link>
      </p>
    </main>
  )
}
