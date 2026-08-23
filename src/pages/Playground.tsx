/** The scratch space.
 *
 *  Every runtime the courses use is already built, so this page is mostly a
 *  switch: pick a mode, pick a template, edit, run. Nothing is graded and
 *  nothing costs a heart.
 *
 *  What you write is kept in localStorage per mode, because a scratch space
 *  that loses your work when you reload is not one. */

import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { MODES, ROOT_HTML, SQL_SCHEMA, modeById, type ModeId } from '../content/playground'
import { runPython, splitStdin } from '../lib/python'
import { runSql, type SqlResult } from '../lib/sql'
import { compileTs, type TsCompile } from '../lib/ts'
import { CodeBlock, CodeEditor, LivePreview, Output } from '../components/ui'
import { ResultTable } from '../components/ResultTable'
import { CompileReport } from '../components/CompileReport'
import { GamePreview } from '../components/GamePreview'

const SIMPAN = 'nunada.playground.v1'

interface Tersimpan {
  mode: ModeId
  kode: Partial<Record<ModeId, string>>
  stdin: string
}

function baca(): Tersimpan | null {
  try {
    const raw = localStorage.getItem(SIMPAN)
    return raw ? (JSON.parse(raw) as Tersimpan) : null
  } catch {
    return null
  }
}

export default function Playground() {
  const { t, tc } = useI18n()

  const awal = useMemo(baca, [])
  const [modeId, setModeId] = useState<ModeId>(awal?.mode ?? 'python')
  const [kode, setKode] = useState<Partial<Record<ModeId, string>>>(awal?.kode ?? {})
  const [stdin, setStdin] = useState(awal?.stdin ?? '')

  const [out, setOut] = useState<{ text: string; error: boolean } | null>(null)
  const [rows, setRows] = useState<SqlResult | null>(null)
  const [compiled, setCompiled] = useState<TsCompile | null>(null)
  // The live runtimes redraw as you type; the others wait to be asked.
  const [nonce, setNonce] = useState(0)
  const [busy, setBusy] = useState(false)

  const mode = modeById(modeId)
  const source = kode[modeId] ?? mode.templat[0].code

  // Keep the scratch space across reloads. One write per edit is plenty here —
  // this is a few kilobytes of text, not a document store.
  useEffect(() => {
    try {
      localStorage.setItem(SIMPAN, JSON.stringify({ mode: modeId, kode, stdin }))
    } catch {
      // A full or blocked store is not a reason to stop working.
    }
  }, [modeId, kode, stdin])

  function setSource(next: string) {
    setKode((k) => ({ ...k, [modeId]: next }))
  }

  function pilihMode(id: ModeId) {
    setModeId(id)
    setOut(null)
    setRows(null)
    setCompiled(null)
    setNonce(0)
  }

  function pakaiTemplat(id: string) {
    const tpl = mode.templat.find((x) => x.id === id)
    if (!tpl) return
    setSource(tpl.code)
    if (tpl.stdin !== undefined) setStdin(tpl.stdin)
    setOut(null)
    setRows(null)
    setCompiled(null)
    setNonce(0)
  }

  async function jalankan() {
    setBusy(true)
    try {
      if (modeId === 'python') {
        const res = await runPython(source, splitStdin(stdin))
        setOut({
          text: res.error ? `${res.stdout}${res.error}` : res.stdout || '(tidak ada keluaran)',
          error: Boolean(res.error),
        })
      } else if (modeId === 'sql') {
        setRows(await runSql(SQL_SCHEMA, source))
      } else if (modeId === 'typescript') {
        setCompiled(await compileTs(source))
      } else {
        // web, react and game all render; bumping the nonce restarts them.
        setNonce((n) => n + 1)
      }
    } catch {
      setOut({ text: t('errorGeneric'), error: true })
    } finally {
      setBusy(false)
    }
  }

  const isReact = modeId === 'react'
  const isWeb = modeId === 'web' || modeId === 'javascript' || isReact
  const konsolSaja = modeId === 'javascript'

  return (
    <main className="page">
      <h1>{t('playgroundTitle')}</h1>
      <p className="muted">{t('playgroundBlurb')}</p>

      <div className="row modes" style={{ marginBottom: 10 }}>
        {MODES.map((m) => (
          <button
            className={m.id === modeId ? 'btn sm' : 'btn ghost sm'}
            key={m.id}
            onClick={() => pilihMode(m.id)}
          >
            {m.icon} {tc(m.label)}
          </button>
        ))}
      </div>

      <div className="row" style={{ marginBottom: 12 }}>
        <span className="small muted">{t('templates')}:</span>
        {mode.templat.map((tpl) => (
          <button className="btn ghost sm" key={tpl.id} onClick={() => pakaiTemplat(tpl.id)}>
            {tc(tpl.label)}
          </button>
        ))}
      </div>

      <div className="grid two">
        <div className="card">
          <div className="io-label">
            {mode.icon} {mode.editorLabel}
          </div>
          <CodeEditor value={source} onChange={setSource} rows={modeId === 'python' ? 18 : 22} />

          {modeId === 'python' && (
            <label className="field">
              <span className="small">{t('stdinLabel')}</span>
              <textarea rows={3} value={stdin} onChange={(e) => setStdin(e.target.value)} spellCheck={false} />
            </label>
          )}

          {modeId === 'sql' && (
            <details style={{ marginTop: 10 }}>
              <summary className="io-label" style={{ cursor: 'pointer' }}>
                {tc({ en: 'The tables (already set up)', id: 'Tabelnya (sudah disiapkan)' })}
              </summary>
              <CodeBlock>{SQL_SCHEMA}</CodeBlock>
            </details>
          )}

          <div className="row">
            <button className="btn" onClick={() => void jalankan()} disabled={busy}>
              ▶ {t('runCode')}
            </button>
            <button
              className="btn ghost sm"
              onClick={() => {
                setOut(null)
                setRows(null)
                setCompiled(null)
                setNonce(0)
              }}
            >
              {t('clearOutput')}
            </button>
          </div>

          {busy && modeId === 'python' && (
            <p className="small muted" style={{ marginTop: 8 }}>
              🐍 {t('loadingPython')} — {t('loadingPythonNote')}
            </p>
          )}
          {busy && modeId === 'typescript' && (
            <p className="small muted" style={{ marginTop: 8 }}>
              🧩 {tc({ en: 'Loading the TypeScript compiler…', id: 'Memuat kompiler TypeScript…' })}
            </p>
          )}
        </div>

        <div className="card">
          <div className="io-label">
            {isWeb && !konsolSaja
              ? tc({ en: 'Preview', id: 'Pratinjau' })
              : modeId === 'game'
                ? tc({ en: 'The game', id: 'Gamenya' })
                : t('output')}
          </div>

          {modeId === 'python' && <Output text={out ? out.text : '—'} error={out?.error} />}

          {modeId === 'sql' &&
            (rows ? (
              <ResultTable result={rows} cap={30} />
            ) : (
              <p className="small muted" style={{ margin: 0 }}>
                —
              </p>
            ))}

          {modeId === 'typescript' &&
            (compiled ? (
              <CompileReport result={compiled} />
            ) : (
              <p className="small muted" style={{ margin: 0 }}>
                —
              </p>
            ))}

          {isWeb &&
            (nonce > 0 ? (
              <LivePreview
                key={nonce}
                source={source}
                html={isReact ? ROOT_HTML : undefined}
                js={modeId === 'javascript'}
                react={isReact}
                height={420}
              />
            ) : (
              <p className="small muted" style={{ margin: 0 }}>
                {tc({ en: 'Press Run to see it.', id: 'Tekan Jalankan untuk melihatnya.' })}
              </p>
            ))}

          {modeId === 'game' && <GamePreview code={source} runNonce={nonce} />}
        </div>
      </div>
    </main>
  )
}
