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
import { GameError, WIDTH, HEIGHT, drawScene, startGame, keyName, type Session } from '../lib/game'
import { Output } from './ui'

/** The field keeps its own cream ground in both themes. The learner picks the
 *  colours in `draw` against this background, and a field that changed hue
 *  with the app theme would quietly break every one of those choices. */
const BACKGROUND = '#f6f1e7'

/** Longest step a frame may take. Two frames' worth at 30fps: enough to ride
 *  out a hiccup, short enough that nothing jumps across the field. */
const MAX_DT = 1 / 15

export function GamePreview({ code, runNonce }: { code: string; runNonce: number }) {
  const { tc } = useI18n()
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const session = useRef<Session | null>(null)
  const keys = useRef<Set<string>>(new Set())
  const frame = useRef<number>(0)
  const last = useRef<number>(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [focused, setFocused] = useState(false)

  const stop = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = 0
    session.current?.stop()
    session.current = null
    setRunning(false)
  }, [])

  // Nothing starts until the learner presses Run: `runNonce` changing is the
  // signal, so pressing it again restarts from a fresh state.
  useEffect(() => {
    if (runNonce === 0) return
    let cancelled = false

    stop()
    setError(null)
    setLoading(true)

    void (async () => {
      try {
        const s = await startGame(code)
        if (cancelled) {
          s.stop()
          return
        }
        session.current = s
        setLoading(false)
        setRunning(true)
        keys.current.clear()
        last.current = performance.now()

        const ctx = canvas.current?.getContext('2d') ?? null

        const step = (now: number) => {
          if (!session.current || !ctx) return
          const dt = Math.min(MAX_DT, (now - last.current) / 1000)
          last.current = now
          try {
            const scene = session.current.step(keys.current, dt)
            drawScene(ctx, scene, BACKGROUND)
          } catch (err) {
            setError(err instanceof GameError ? err.message : String(err))
            stop()
            return
          }
          frame.current = requestAnimationFrame(step)
        }

        frame.current = requestAnimationFrame(step)
      } catch (err) {
        if (cancelled) return
        setLoading(false)
        setError(err instanceof GameError ? err.message : String(err))
      }
    })()

    return () => {
      cancelled = true
      stop()
    }
    // The code is read when Run is pressed, not as it is typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runNonce])

  useEffect(() => stop, [stop])

  // The canvas is sized in device pixels and scaled once, so the learner's
  // coordinates stay in the 320x240 field whatever the screen is.
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const dpr = Math.min(3, window.devicePixelRatio || 1)
    c.width = WIDTH * dpr
    c.height = HEIGHT * dpr
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = false
    drawScene(ctx, [], BACKGROUND)
  }, [])

  function onKeyDown(e: ReactKeyboardEvent) {
    const k = keyName(e.key)
    if (!k) return
    // Arrows and space scroll the page; while the game has focus they are the
    // game's, not the document's.
    e.preventDefault()
    keys.current.add(k)
  }

  function onKeyUp(e: ReactKeyboardEvent) {
    const k = keyName(e.key)
    if (!k) return
    e.preventDefault()
    keys.current.delete(k)
  }

  return (
    <div>
      <div
        className={focused ? 'gamewrap focused' : 'gamewrap'}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          keys.current.clear()
        }}
      >
        <canvas ref={canvas} className="game" />
        {!running && !loading && !error && (
          <div className="gamehint">
            {tc({ en: 'Press Run to play', id: 'Tekan Jalankan untuk bermain' })}
          </div>
        )}
        {loading && (
          <div className="gamehint">🐍 {tc({ en: 'Starting Python…', id: 'Menyalakan Python…' })}</div>
        )}
      </div>

      <p className="small muted" style={{ margin: '6px 0 0' }}>
        {running
          ? focused
            ? tc({ en: 'Arrow keys or WASD, and space.', id: 'Tombol panah atau WASD, dan spasi.' })
            : tc({ en: 'Click the field to use the keyboard.', id: 'Klik lapangannya untuk memakai papan ketik.' })
          : tc({ en: 'The field is 320 by 240, with (0, 0) at the top left.', id: 'Lapangannya 320 kali 240, dengan (0, 0) di kiri atas.' })}
      </p>

      {error && (
        <div style={{ marginTop: 8 }}>
          <Output text={error} error />
        </div>
      )}
    </div>
  )
}
