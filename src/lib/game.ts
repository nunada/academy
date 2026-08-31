/** A playable game, written in Python.
 *
 *  The course could have been taught headlessly — a game's *logic* is ordinary
 *  functions over state, and that is the part worth teaching and the only part
 *  worth testing. But a game you cannot play is a strange thing to spend four
 *  modules on, so this runs one.
 *
 *  The shape it asks for is deliberate:
 *
 *      start()                  -> the starting state
 *      update(state, keys, dt)  -> the next state
 *      draw(state)              -> a list of drawing commands
 *
 *  `update` is a **pure function**: state in, state out, no drawing and no
 *  input of its own. That is what lets a check call it directly with a made-up
 *  state and a made-up set of keys — every exercise in this course is tested
 *  with the same PyTest machinery as the Python course, with no canvas in sight.
 *  And `draw` returns *data* rather than painting, for the same reason.
 *
 *  The bridge between Python and the canvas is JSON, once per frame. That is a
 *  little wasteful and completely predictable: no proxies to leak, no lifetime
 *  to get wrong, and a scene that is plain data on both sides.
 */

import { friendlyError, getPython } from './python'

/** The logical field. Everything the learner draws is in these units, whatever
 *  size the canvas ends up on screen. Small round numbers make the arithmetic
 *  in an exercise something you can do in your head. */
export const WIDTH = 320
export const HEIGHT = 240

/** One drawing command. Anything else in the list is ignored rather than
 *  fatal — a half-written `draw` should still show what it got right. */
export interface Command {
  shape: 'box' | 'circle' | 'text' | 'line'
  color?: string
  x?: number
  y?: number
  w?: number
  h?: number
  r?: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  thickness?: number
  text?: string
  size?: number
}

/** The keys a game may read, named the way the rest of the content is named. */
export const KEYS = ['left', 'right', 'up', 'down', 'space'] as const
export type Key = (typeof KEYS)[number]

/** Maps a browser key to one of ours. Arrows and WASD both, because a learner
 *  testing their own game should not have to think about it. */
export function keyName(key: string): Key | null {
  switch (key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'left'
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'right'
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'up'
    case 'ArrowDown':
    case 's':
    case 'S':
      return 'down'
    case ' ':
    case 'Spacebar':
      return 'space'
    default:
      return null
  }
}

/** Run after the learner's code. Holds the state between frames so the loop on
 *  the JavaScript side stays a loop and nothing has to cross the boundary but
 *  the keys going in and the scene coming out. */
const DRIVER = `
import json as _nunada_json

def _nunada_mulai():
    global _nunada_keadaan
    _nunada_keadaan = start()
    return _nunada_json.dumps(draw(_nunada_keadaan))

def _nunada_langkah(_tombol_json, _dt):
    global _nunada_keadaan
    _tombol = set(_nunada_json.loads(_tombol_json))
    _nunada_keadaan = update(_nunada_keadaan, _tombol, _dt)
    return _nunada_json.dumps(draw(_nunada_keadaan))

def _nunada_keadaan_json():
    return _nunada_json.dumps(_nunada_keadaan)
`

export interface Session {
  /** Advance one frame and get the scene to draw. */
  step(keys: Set<string>, dt: number): Command[]
  /** Back to the starting state. */
  reset(): Command[]
  /** The current state, for the little inspector under the canvas. */
  state(): unknown
  stop(): void
}

/** A thrown message a learner can act on, rather than a stack from our code. */
export class GameError extends Error {}

/** Start a session. Throws GameError when the code will not load, or when it
 *  does not define the three functions the loop needs. */
export async function startGame(code: string): Promise<Session> {
  const py = await getPython()

  const dict = py.globals.get('dict')
  const ns = dict()

  const cleanup = () => {
    ns.destroy?.()
    dict.destroy?.()
  }

  try {
    await py.runPythonAsync(code, { globals: ns })
  } catch (err) {
    cleanup()
    throw new GameError(friendlyError(String((err as Error).message ?? err)))
  }

  for (const name of ['start', 'update', 'draw']) {
    if (ns.get(name) === undefined) {
      cleanup()
      throw new GameError(`Belum ada fungsi ${name}(). / No ${name}() function yet.`)
    }
  }

  try {
    await py.runPythonAsync(DRIVER, { globals: ns })
  } catch (err) {
    cleanup()
    throw new GameError(friendlyError(String((err as Error).message ?? err)))
  }

  const start = ns.get('_nunada_mulai')
  const step = ns.get('_nunada_langkah')
  const stateJson = ns.get('_nunada_keadaan_json')

  const readScene = (raw: unknown): Command[] => {
    const data: unknown = JSON.parse(String(raw))
    return Array.isArray(data) ? (data as Command[]) : []
  }

  const call = <T>(fn: () => T): T => {
    try {
      return fn()
    } catch (err) {
      throw new GameError(friendlyError(String((err as Error).message ?? err)))
    }
  }

  const session: Session = {
    step: (keys, dt) =>
      readScene(call(() => step(JSON.stringify([...keys]), dt))),
    reset: () => readScene(call(() => start())),
    state: () => {
      try {
        return JSON.parse(String(stateJson()))
      } catch {
        return null
      }
    },
    stop: () => {
      start.destroy?.()
      step.destroy?.()
      stateJson.destroy?.()
      cleanup()
    },
  }

  // Fail here rather than on the first frame: a broken start() or draw() is
  // much easier to understand before anything has been drawn.
  try {
    session.reset()
  } catch (err) {
    session.stop()
    throw err
  }
  return session
}

/** Paint a scene. Unknown shapes are skipped, and a missing field falls back to
 *  something harmless — a half-finished `draw` shows what it got right. */
export function drawScene(ctx: CanvasRenderingContext2D, scene: Command[], background: string): void {
  ctx.save()
  ctx.fillStyle = background
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  for (const p of scene) {
    if (!p || typeof p !== 'object') continue
    const color = typeof p.color === 'string' ? p.color : '#24463d'
    ctx.fillStyle = color
    ctx.strokeStyle = color

    switch (p.shape) {
      case 'box':
        ctx.fillRect(p.x ?? 0, p.y ?? 0, p.w ?? 0, p.h ?? 0)
        break
      case 'circle':
        ctx.beginPath()
        ctx.arc(p.x ?? 0, p.y ?? 0, Math.max(0, p.r ?? 0), 0, Math.PI * 2)
        ctx.fill()
        break
      case 'line':
        ctx.lineWidth = p.thickness ?? 1
        ctx.beginPath()
        ctx.moveTo(p.x1 ?? 0, p.y1 ?? 0)
        ctx.lineTo(p.x2 ?? 0, p.y2 ?? 0)
        ctx.stroke()
        break
      case 'text':
        ctx.font = `${p.size ?? 12}px ui-monospace, monospace`
        ctx.textBaseline = 'top'
        ctx.fillText(String(p.text ?? ''), p.x ?? 0, p.y ?? 0)
        break
      default:
        break
    }
  }

  ctx.restore()
}
