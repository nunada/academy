import { useState } from 'react'
import { useI18n } from '../i18n'
import { runPython, splitStdin } from '../lib/python'
import { CodeEditor, Output } from '../components/ui'

interface Template {
  id: string
  label: { en: string; id: string }
  code: string
  stdin?: string
}

const TEMPLATES: Template[] = [
  {
    id: 'blank',
    label: { en: 'Blank', id: 'Kosong' },
    code: '# Tulis Python apa saja di sini\nprint("Halo!")\n',
  },
  {
    id: 'input',
    label: { en: 'Reads input', id: 'Membaca input' },
    code: 'nama = input("Nama: ")\numur = int(input("Umur: "))\nprint(f"{nama}, tahun depan {umur + 1}")\n',
    stdin: 'Ani\n17',
  },
  {
    id: 'loop',
    label: { en: 'Loop + list', id: 'Loop + list' },
    code: 'angka = [4, 8, 15, 16, 23, 42]\ntotal = 0\nfor n in angka:\n    total += n\nprint("Total:", total)\nprint("Rata-rata:", total / len(angka))\n',
  },
  {
    id: 'function',
    label: { en: 'Functions', id: 'Fungsi' },
    code: 'def fib(n):\n    a, b = 0, 1\n    hasil = []\n    for _ in range(n):\n        hasil.append(a)\n        a, b = b, a + b\n    return hasil\n\nprint(fib(10))\n',
  },
  {
    id: 'turtleless',
    label: { en: 'ASCII art', id: 'Seni ASCII' },
    code: 'tinggi = 5\nfor i in range(1, tinggi + 1):\n    print(" " * (tinggi - i) + "*" * (2 * i - 1))\n',
  },
]

/** Languages the playground will host once their courses exist. */
const SOON = ['Static website', 'React app', 'React app + router', 'JavaScript']

export default function Playground() {
  const { t, tc } = useI18n()
  const [code, setCode] = useState(TEMPLATES[0].code)
  const [stdin, setStdin] = useState('')
  const [out, setOut] = useState<{ text: string; error: boolean } | null>(null)
  const [busy, setBusy] = useState(false)

  async function run() {
    setBusy(true)
    try {
      const res = await runPython(code, splitStdin(stdin))
      setOut({
        text: res.error ? `${res.stdout}${res.error}` : res.stdout || '(tidak ada keluaran)',
        error: Boolean(res.error),
      })
    } catch {
      setOut({ text: t('errorGeneric'), error: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page">
      <h1>{t('playgroundTitle')}</h1>
      <p className="muted">{t('playgroundBlurb')}</p>

      <div className="row" style={{ marginBottom: 12 }}>
        <span className="small muted">{t('templates')}:</span>
        {TEMPLATES.map((tpl) => (
          <button
            className="btn ghost sm"
            key={tpl.id}
            onClick={() => {
              setCode(tpl.code)
              setStdin(tpl.stdin ?? '')
              setOut(null)
            }}
          >
            {tc(tpl.label)}
          </button>
        ))}
      </div>

      <div className="grid two">
        <div className="card">
          <div className="io-label">🐍 Python</div>
          <CodeEditor value={code} onChange={setCode} rows={18} />
          <label className="field">
            <span className="small">{t('stdinLabel')}</span>
            <textarea rows={3} value={stdin} onChange={(e) => setStdin(e.target.value)} spellCheck={false} />
          </label>
          <div className="row">
            <button className="btn" onClick={() => void run()} disabled={busy}>
              ▶ {t('runCode')}
            </button>
            <button className="btn ghost sm" onClick={() => setOut(null)}>
              {t('clearOutput')}
            </button>
          </div>
          {busy && (
            <p className="small muted" style={{ marginTop: 8 }}>
              🐍 {t('loadingPython')} — {t('loadingPythonNote')}
            </p>
          )}
        </div>

        <div className="card">
          <div className="io-label">{t('output')}</div>
          <Output text={out ? out.text : '—'} error={out?.error} />

          <div style={{ marginTop: 20 }}>
            <div className="io-label">{t('comingSoon')}</div>
            <div className="row">
              {SOON.map((s) => (
                <span className="pill" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <p className="small muted" style={{ marginTop: 8, marginBottom: 0 }}>
              {tc({
                en: 'These arrive with their courses. Python is the one that is live today.',
                id: 'Semua ini hadir bersama kursusnya. Python yang sudah aktif hari ini.',
              })}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
