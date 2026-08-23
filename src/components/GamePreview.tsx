/** The canvas a Python game runs in.
 *
 *  Frames are driven by requestAnimationFrame, and `dt` is real elapsed time in
 *  seconds — clamped, because a tab that was in the background for ten seconds
 *  should resume, not teleport the player through a wall.
 *
 *  Keys are held in a ref rather than in state: a keystroke must not re-render
 *  the component sixty times a second, and the loop reads the ref directly. */

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useI18n } from '../i18n'
import { GameError, LEBAR, TINGGI, gambarAdegan, mulaiGame, namaTombol, type Sesi } from '../lib/game'
import { Output } from './ui'

/** The field keeps its own cream ground in both themes. The learner picks the
 *  colours in `gambar` against this background, and a field that changed hue
 *  with the app theme would quietly break every one of those choices. */
const LATAR = '#f6f1e7'

/** Longest step a frame may take. Two frames' worth at 30fps: enough to ride
 *  out a hiccup, short enough that nothing jumps across the field. */
const DT_MAKS = 1 / 15

export function GamePreview({ code, runNonce }: { code: string; runNonce: number }) {
  const { tc } = useI18n()
  const kanvas = useRef<HTMLCanvasElement | null>(null)
  const sesi = useRef<Sesi | null>(null)
  const tombol = useRef<Set<string>>(new Set())
  const frame = useRef<number>(0)
  const terakhir = useRef<number>(0)

  const [memuat, setMemuat] = useState(false)
  const [galat, setGalat] = useState<string | null>(null)
  const [jalan, setJalan] = useState(false)
  const [fokus, setFokus] = useState(false)

  const berhenti = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = 0
    sesi.current?.hentikan()
    sesi.current = null
    setJalan(false)
  }, [])

  // Nothing starts until the learner presses Run: `runNonce` changing is the
  // signal, so pressing it again restarts from a fresh state.
  useEffect(() => {
    if (runNonce === 0) return
    let dibatalkan = false

    berhenti()
    setGalat(null)
    setMemuat(true)

    void (async () => {
      try {
        const s = await mulaiGame(code)
        if (dibatalkan) {
          s.hentikan()
          return
        }
        sesi.current = s
        setMemuat(false)
        setJalan(true)
        tombol.current.clear()
        terakhir.current = performance.now()

        const ctx = kanvas.current?.getContext('2d') ?? null

        const langkah = (sekarang: number) => {
          if (!sesi.current || !ctx) return
          const dt = Math.min(DT_MAKS, (sekarang - terakhir.current) / 1000)
          terakhir.current = sekarang
          try {
            const adegan = sesi.current.langkah(tombol.current, dt)
            gambarAdegan(ctx, adegan, LATAR)
          } catch (err) {
            setGalat(err instanceof GameError ? err.message : String(err))
            berhenti()
            return
          }
          frame.current = requestAnimationFrame(langkah)
        }

        frame.current = requestAnimationFrame(langkah)
      } catch (err) {
        if (dibatalkan) return
        setMemuat(false)
        setGalat(err instanceof GameError ? err.message : String(err))
      }
    })()

    return () => {
      dibatalkan = true
      berhenti()
    }
    // The code is read when Run is pressed, not as it is typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runNonce])

  useEffect(() => berhenti, [berhenti])

  // The canvas is sized in device pixels and scaled once, so the learner's
  // coordinates stay in the 320x240 field whatever the screen is.
  useEffect(() => {
    const c = kanvas.current
    if (!c) return
    const dpr = Math.min(3, window.devicePixelRatio || 1)
    c.width = LEBAR * dpr
    c.height = TINGGI * dpr
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = false
    gambarAdegan(ctx, [], LATAR)
  }, [])

  function turun(e: ReactKeyboardEvent) {
    const t = namaTombol(e.key)
    if (!t) return
    // Arrows and space scroll the page; while the game has focus they are the
    // game's, not the document's.
    e.preventDefault()
    tombol.current.add(t)
  }

  function naik(e: ReactKeyboardEvent) {
    const t = namaTombol(e.key)
    if (!t) return
    e.preventDefault()
    tombol.current.delete(t)
  }

  return (
    <div>
      <div
        className={fokus ? 'gamewrap fokus' : 'gamewrap'}
        tabIndex={0}
        onKeyDown={turun}
        onKeyUp={naik}
        onFocus={() => setFokus(true)}
        onBlur={() => {
          setFokus(false)
          tombol.current.clear()
        }}
      >
        <canvas ref={kanvas} className="game" />
        {!jalan && !memuat && !galat && (
          <div className="gamehint">
            {tc({ en: 'Press Run to play', id: 'Tekan Jalankan untuk bermain' })}
          </div>
        )}
        {memuat && (
          <div className="gamehint">🐍 {tc({ en: 'Starting Python…', id: 'Menyalakan Python…' })}</div>
        )}
      </div>

      <p className="small muted" style={{ margin: '6px 0 0' }}>
        {jalan
          ? fokus
            ? tc({ en: 'Arrow keys or WASD, and space.', id: 'Tombol panah atau WASD, dan spasi.' })
            : tc({ en: 'Click the field to use the keyboard.', id: 'Klik lapangannya untuk memakai papan ketik.' })
          : tc({ en: 'The field is 320 by 240, with (0, 0) at the top left.', id: 'Lapangannya 320 kali 240, dengan (0, 0) di kiri atas.' })}
      </p>

      {galat && (
        <div style={{ marginTop: 8 }}>
          <Output text={galat} error />
        </div>
      )}
    </div>
  )
}
