import { NAME_MAX } from '../../lib/dominonet'

/** What a person sees who opened a link with a room code in it (?room=K7QF): nothing but the room, a name and one button. The rest of the menu (the kinds of
 *  calculation, playing the computer, making a room) is one small link away, because a friend who was invited came to join, not to choose. */
export default function InviteCard({
  lang,
  game,
  code,
  name,
  placeholder,
  how,
  busy,
  error,
  onName,
  onJoin,
  onMore,
}: {
  lang: string
  /** the name of the game, as the player's language says it */
  game: string
  code: string
  name: string
  placeholder: string
  /** one sentence on how a turn goes */
  how: string
  busy: boolean
  error: string
  onName: (s: string) => void
  onJoin: () => void
  onMore: () => void
}) {
  const t = (en: string, id: string) => (lang === 'id' ? id : en)
  return (
    <form
      className="dminvite"
      onSubmit={(e) => {
        e.preventDefault()
        if (!busy) onJoin()
      }}
    >
      <p className="dminvite-title">{t(`You are invited to play ${game}`, `Kamu diundang bermain ${game}`)}</p>
      <div className="dmcode">
        <span className="small muted">{t('Room code', 'Kode ruangan')}</span>
        <b aria-label={code.split('').join(' ')}>{code}</b>
      </div>
      <label className="dmfield">
        <span>{t('Type your name', 'Ketik namamu')}</span>
        <input type="text" value={name} maxLength={NAME_MAX} placeholder={placeholder} autoComplete="nickname" autoFocus onChange={(e) => onName(e.target.value)} />
      </label>
      <button type="submit" className="btn dminvite-go" disabled={busy}>
        {busy ? t('Connecting…', 'Menyambung…') : t('Join the room', 'Masuk ke ruangan')}
      </button>
      {error && (
        <p role="alert" className="dmerror">
          {error}
        </p>
      )}
      <p className="small muted">{t('Then wait for the host to start the game.', 'Lalu tunggu tuan rumah memulai permainan.')} {how}</p>
      <button type="button" className="linkbtn small" onClick={onMore}>
        {t('Not what you wanted? See all the choices', 'Bukan ini yang kamu mau? Lihat semua pilihan')}
      </button>
    </form>
  )
}
