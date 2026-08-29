import { useState } from 'react'
import { useStore } from '../app/store'
import { useI18n } from '../i18n'
import { Modal } from './ui'

/** A permanent floating button, open to any signed-in learner, for a quick
 *  1-5 rating and an optional comment. Nothing in the app reads this back —
 *  it is meant to be read from the Supabase dashboard directly. */
export function FeedbackWidget() {
  const { user } = useStore()
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  if (!user) return null

  return (
    <>
      <button className="fab" onClick={() => setOpen(true)} title={t('feedbackButton')} aria-label={t('feedbackButton')}>
        💬
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <FeedbackForm onDone={() => setOpen(false)} />
        </Modal>
      )}
    </>
  )
}

function FeedbackForm({ onDone }: { onDone: () => void }) {
  const { submitFeedback } = useStore()
  const { t } = useI18n()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="center">
        <div style={{ fontSize: '2.4rem' }}>🙏</div>
        <p>{t('feedbackThanks')}</p>
      </div>
    )
  }

  async function submit() {
    if (!rating) return
    setBusy(true)
    setError(false)
    try {
      await submitFeedback(rating, comment.trim() || undefined)
      setSent(true)
      setTimeout(onDone, 1500)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>{t('feedbackTitle')}</h3>
      <label className="field">
        <span>{t('feedbackRatingLabel')}</span>
        <div className="row" role="radiogroup" aria-label={t('feedbackRatingLabel')}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={n <= rating ? 'star on' : 'star'}
              onClick={() => setRating(n)}
              aria-pressed={n === rating}
              aria-label={String(n)}
            >
              ★
            </button>
          ))}
        </div>
      </label>
      <label className="field">
        <span>{t('feedbackCommentLabel')}</span>
        <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>

      {error && <div className="verdict no">{t('feedbackError')}</div>}

      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 4 }}>
        <button className="btn ghost" type="button" onClick={onDone} disabled={busy}>
          {t('cancel')}
        </button>
        <button className="btn" type="button" onClick={submit} disabled={busy || !rating}>
          {busy ? t('working') : t('feedbackSubmit')}
        </button>
      </div>
    </div>
  )
}
