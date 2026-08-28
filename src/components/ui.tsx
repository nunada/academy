import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { MAX_HEARTS, formatCountdown } from '../lib/hearts'
import { useI18n } from '../i18n'
import { previewDocument, previewReactDocument } from '../lib/web'
import { tex } from '../lib/tex'

/** One formula. MathML is markup, not React elements, so it goes in as HTML —
 *  from `tex()`, which escapes what it emits and only ever sees strings this
 *  repository wrote. */
export function Tex({ src, display = false }: { src: string; display?: boolean }) {
  return (
    <span
      className={display ? 'tex block' : 'tex'}
      dangerouslySetInnerHTML={{ __html: tex(src, display) }}
    />
  )
}

/** A displayed equation, or a short stack of them — the working, one line at
 *  a time, centred the way it would be on paper. */
export function TexLines({ lines }: { lines: string[] }) {
  return (
    <div className="texlines">
      {lines.map((l, i) => (
        <Tex src={l} display key={i} />
      ))}
    </div>
  )
}

/** Minimal inline formatting for lesson prose: `code`, **bold**, $maths$, and
 *  $$a displayed equation$$ on a line of its own.
 *  A full markdown dependency would be far more than the content needs. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
          return <Tex src={part.slice(2, -2)} display key={i} />
        }
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          return <Tex src={part.slice(1, -1)} key={i} />
        }
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code className="inline" key={i}>
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export function Bar({ percent, good = false }: { percent: number; good?: boolean }) {
  return (
    <div className={good ? 'bar good' : 'bar'}>
      <i style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
    </div>
  )
}

export function Hearts({ count, nextIn }: { count: number; nextIn: number | null }) {
  const { t } = useI18n()
  return (
    <span className="hearts" title={nextIn === null ? t('fullHearts') : `${t('nextHeartIn')} ${formatCountdown(nextIn)}`}>
      {Array.from({ length: MAX_HEARTS }, (_, i) => (
        <span className={i < count ? 'h on' : 'h'} key={i}>
          ❤️
        </span>
      ))}
      {nextIn !== null && <small className="muted" style={{ marginLeft: 4 }}>{formatCountdown(nextIn)}</small>}
    </span>
  )
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  )
}

export function CodeBlock({ children }: { children: string }) {
  return <pre className="code">{children}</pre>
}

export function Output({ text, error = false }: { text: string; error?: boolean }) {
  return <pre className={error ? 'out err' : 'out'}>{text}</pre>
}

/** A plain textarea that behaves enough like an editor: Tab indents rather
 *  than moving focus, and Enter keeps the previous line's indentation. */
export function CodeEditor({
  value,
  onChange,
  rows = 12,
  disabled = false,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
  disabled?: boolean
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart: s, selectionEnd: en } = el
      const next = value.slice(0, s) + '    ' + value.slice(en)
      onChange(next)
      requestAnimationFrame(() => el.setSelectionRange(s + 4, s + 4))
      return
    }
    if (e.key === 'Enter') {
      const s = el.selectionStart
      const lineStart = value.lastIndexOf('\n', s - 1) + 1
      const line = value.slice(lineStart, s)
      const indent = /^[ \t]*/.exec(line)?.[0] ?? ''
      // A block opener earns one more level, which is most of what Python needs.
      const extra = line.trimEnd().endsWith(':') ? '    ' : ''
      if (!indent && !extra) return
      e.preventDefault()
      const insert = '\n' + indent + extra
      const next = value.slice(0, s) + insert + value.slice(el.selectionEnd)
      onChange(next)
      const pos = s + insert.length
      requestAnimationFrame(() => el.setSelectionRange(pos, pos))
    }
  }

  return (
    <textarea
      ref={ref}
      className="code"
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      rows={rows}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKey}
    />
  )
}

/** Live render of the learner's markup.
 *  Same sandbox as the checker, so what they see is what gets checked. */
export function LivePreview({
  source,
  html,
  js,
  react,
  height = 260,
}: {
  source: string
  /** Fixed markup; `source` is then the stylesheet, or the script when `js`. */
  html?: string
  js?: boolean
  /** `source` is JSX, transpiled in the frame. Implies a script runtime. */
  react?: boolean
  height?: number
}) {
  const { tc } = useI18n()
  const [logs, setLogs] = useState<string[]>([])
  const [failure, setFailure] = useState<string | null>(null)
  // React needs JSX transpiled before the document exists, so the doc is state.
  const [reactDoc, setReactDoc] = useState<string>('')

  // A JavaScript exercise with no markup would otherwise render a blank frame,
  // while everything the learner actually produced went to console.log.
  const nonce = useMemo(() => `p${Math.random().toString(36).slice(2)}`, [])
  const scripted = js === true || react === true
  const consoleOnly = js === true && !react && (html === undefined || html.trim() === '')

  useEffect(() => {
    if (!scripted) return
    function onMessage(event: MessageEvent) {
      const data = event.data as { nunadaLogs?: string; logs?: string[]; error?: string | null }
      if (!data || data.nunadaLogs !== nonce) return
      setLogs(data.logs ?? [])
      setFailure(data.error ?? null)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [scripted, nonce])

  // Each edit reloads the frame, so drop what the previous run said.
  useEffect(() => {
    setLogs([])
    setFailure(null)
  }, [source])

  // Transpiling is async, and a half-typed JSX tag is a syntax error most of the
  // time — so report that in the console strip instead of rebuilding the frame.
  useEffect(() => {
    if (!react) return
    let alive = true
    previewReactDocument(source, html, nonce).then(({ doc, error }) => {
      if (!alive) return
      if (error !== undefined) setFailure(error)
      else setReactDoc(doc ?? '')
    })
    return () => {
      alive = false
    }
  }, [react, source, html, nonce])

  return (
    <>
      <iframe
        className="preview"
        title="preview"
        sandbox="allow-scripts"
        srcDoc={react ? reactDoc : previewDocument(source, html, js, scripted ? nonce : undefined)}
        style={{ height: consoleOnly ? 0 : height, border: consoleOnly ? 'none' : undefined }}
      />
      {scripted && (
        <>
          <div className="io-label" style={{ marginTop: consoleOnly ? 0 : 8 }}>
            console
          </div>
          <Output
            text={
              failure
                ? `${logs.join('\n')}${logs.length ? '\n' : ''}${failure}`
                : logs.length
                  ? logs.join('\n')
                  : tc({ en: '(nothing logged yet)', id: '(belum ada yang ditampilkan)' })
            }
            error={Boolean(failure)}
          />
        </>
      )}
    </>
  )
}

export function Modal({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
