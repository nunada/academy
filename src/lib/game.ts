/** A playable game, written in Python.
 *
 *  The course could have been taught headlessly — a game's *logic* is ordinary
 *  functions over state, and that is the part worth teaching and the only part
 *  worth testing. But a game you cannot play is a strange thing to spend four
 *  modules on, so this runs one.
 *
 *  The shape it asks for is deliberate:
 *
 *      awal()                    -> the starting state
 *      perbarui(keadaan, tombol, dt) -> the next state
 *      gambar(keadaan)           -> a list of drawing commands
 *
 *  `perbarui` is a **pure function**: state in, state out, no drawing and no
 *  input of its own. That is what lets a check call it directly with a made-up
 *  state and a made-up set of keys — every exercise in this course is tested
 *  with the same PyTest machinery as the Python course, with no canvas in sight.
 *  And `gambar` returns *data* rather than painting, for the same reason.
 *
 *  The bridge between Python and the canvas is JSON, once per frame. That is a
 *  little wasteful and completely predictable: no proxies to leak, no lifetime
 *  to get wrong, and a scene that is plain data on both sides.
 */

import { friendlyError, getPython } from './python'

/** The logical field. Everything the learner draws is in these units, whatever
 *  size the canvas ends up on screen. Small round numbers make the arithmetic
 *  in an exercise something you can do in your head. */
export const LEBAR = 320
export const TINGGI = 240

/** One drawing command. Anything else in the list is ignored rather than
 *  fatal — a half-written `gambar` should still show what it got right. */
export interface Perintah {
  bentuk: 'kotak' | 'lingkaran' | 'teks' | 'garis'
  warna?: string
  x?: number
  y?: number
  l?: number
  t?: number
  r?: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  tebal?: number
  isi?: string
  ukuran?: number
}

/** The keys a game may read, named the way the rest of the content is named. */
export const TOMBOL = ['kiri', 'kanan', 'atas', 'bawah', 'spasi'] as const
export type Tombol = (typeof TOMBOL)[number]

/** Maps a browser key to one of ours. Arrows and WASD both, because a learner
 *  testing their own game should not have to think about it. */
export function namaTombol(key: string): Tombol | null {
  switch (key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'kiri'
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'kanan'
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'atas'
    case 'ArrowDown':
    case 's':
    case 'S':
      return 'bawah'
    case ' ':
    case 'Spacebar':
      return 'spasi'
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
    _nunada_keadaan = awal()
    return _nunada_json.dumps(gambar(_nunada_keadaan))

def _nunada_langkah(_tombol_json, _dt):
    global _nunada_keadaan
    _tombol = set(_nunada_json.loads(_tombol_json))
    _nunada_keadaan = perbarui(_nunada_keadaan, _tombol, _dt)
    return _nunada_json.dumps(gambar(_nunada_keadaan))

def _nunada_keadaan_json():
    return _nunada_json.dumps(_nunada_keadaan)
`

export interface Sesi {
  /** Advance one frame and get the scene to draw. */
  langkah(tombol: Set<string>, dt: number): Perintah[]
  /** Back to the starting state. */
  ulang(): Perintah[]
  /** The current state, for the little inspector under the canvas. */
  keadaan(): unknown
  hentikan(): void
}

/** A thrown message a learner can act on, rather than a stack from our code. */
export class GameError extends Error {}

/** Start a session. Throws GameError when the code will not load, or when it
 *  does not define the three functions the loop needs. */
export async function mulaiGame(code: string): Promise<Sesi> {
  const py = await getPython()

  const dict = py.globals.get('dict')
  const ns = dict()

  const bersihkan = () => {
    ns.destroy?.()
    dict.destroy?.()
  }

  try {
    await py.runPythonAsync(code, { globals: ns })
  } catch (err) {
    bersihkan()
    throw new GameError(friendlyError(String((err as Error).message ?? err)))
  }

  for (const nama of ['awal', 'perbarui', 'gambar']) {
    if (ns.get(nama) === undefined) {
      bersihkan()
      throw new GameError(`Belum ada fungsi ${nama}(). / No ${nama}() function yet.`)
    }
  }

  try {
    await py.runPythonAsync(DRIVER, { globals: ns })
  } catch (err) {
    bersihkan()
    throw new GameError(friendlyError(String((err as Error).message ?? err)))
  }

  const mulai = ns.get('_nunada_mulai')
  const langkah = ns.get('_nunada_langkah')
  const keadaanJson = ns.get('_nunada_keadaan_json')

  const bacaAdegan = (raw: unknown): Perintah[] => {
    const data: unknown = JSON.parse(String(raw))
    return Array.isArray(data) ? (data as Perintah[]) : []
  }

  const panggil = <T>(fn: () => T): T => {
    try {
      return fn()
    } catch (err) {
      throw new GameError(friendlyError(String((err as Error).message ?? err)))
    }
  }

  const sesi: Sesi = {
    langkah: (tombol, dt) =>
      bacaAdegan(panggil(() => langkah(JSON.stringify([...tombol]), dt))),
    ulang: () => bacaAdegan(panggil(() => mulai())),
    keadaan: () => {
      try {
        return JSON.parse(String(keadaanJson()))
      } catch {
        return null
      }
    },
    hentikan: () => {
      mulai.destroy?.()
      langkah.destroy?.()
      keadaanJson.destroy?.()
      bersihkan()
    },
  }

  // Fail here rather than on the first frame: a broken awal() or gambar() is
  // much easier to understand before anything has been drawn.
  try {
    sesi.ulang()
  } catch (err) {
    sesi.hentikan()
    throw err
  }
  return sesi
}

/** Paint a scene. Unknown shapes are skipped, and a missing field falls back to
 *  something harmless — a half-finished `gambar` shows what it got right. */
export function gambarAdegan(ctx: CanvasRenderingContext2D, adegan: Perintah[], latar: string): void {
  ctx.save()
  ctx.fillStyle = latar
  ctx.fillRect(0, 0, LEBAR, TINGGI)

  for (const p of adegan) {
    if (!p || typeof p !== 'object') continue
    const warna = typeof p.warna === 'string' ? p.warna : '#24463d'
    ctx.fillStyle = warna
    ctx.strokeStyle = warna

    switch (p.bentuk) {
      case 'kotak':
        ctx.fillRect(p.x ?? 0, p.y ?? 0, p.l ?? 0, p.t ?? 0)
        break
      case 'lingkaran':
        ctx.beginPath()
        ctx.arc(p.x ?? 0, p.y ?? 0, Math.max(0, p.r ?? 0), 0, Math.PI * 2)
        ctx.fill()
        break
      case 'garis':
        ctx.lineWidth = p.tebal ?? 1
        ctx.beginPath()
        ctx.moveTo(p.x1 ?? 0, p.y1 ?? 0)
        ctx.lineTo(p.x2 ?? 0, p.y2 ?? 0)
        ctx.stroke()
        break
      case 'teks':
        ctx.font = `${p.ukuran ?? 12}px ui-monospace, monospace`
        ctx.textBaseline = 'top'
        ctx.fillText(String(p.isi ?? ''), p.x ?? 0, p.y ?? 0)
        break
      default:
        break
    }
  }

  ctx.restore()
}
