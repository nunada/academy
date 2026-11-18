/** The real `Bus` for Math Domino: a Supabase Realtime Broadcast channel, one per room.
 *
 *  Broadcast needs no table and no SQL: it only carries messages between the browsers that joined the same channel name, and keeps none of them. The
 *  client made here is separate from the app's own (no sign-in, nothing stored in the browser), so playing never touches an account. */

import { parseMsg, type Bus, type Msg } from './dominonet'
import { newRoomCode, probeRoom, realClock, HostSession, ClientSession, parseRoomCode, type Session } from './dominonet'
import type { Level, ModeId } from './domino'

const env = (): { url?: string; key?: string } => {
  const e = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  return { url: e?.VITE_SUPABASE_URL, key: e?.VITE_SUPABASE_ANON_KEY }
}
/** Online play needs the Supabase keys of the site; without them (a local copy with no keys) the menu says so. */
export const onlineAvailable = (): boolean => Boolean(env().url && env().key)

/** Join the channel of a room. Rejects if the channel cannot be reached. */
export async function realtimeBus(code: string): Promise<Bus> {
  const { url, key } = env()
  if (!url || !key) throw new Error('no-keys')
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 40 } },
  })
  const channel = sb.channel(`nunada-domino-${code}`, { config: { broadcast: { self: false, ack: false } } })
  const listeners = new Set<(m: Msg) => void>()
  channel.on('broadcast', { event: 'm' }, ({ payload }) => {
    const m = parseMsg(payload)
    if (m) listeners.forEach((f) => f(m))
  })
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), 12000)
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        clearTimeout(timer)
        resolve()
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        clearTimeout(timer)
        reject(new Error(status))
      }
    })
  })
  return {
    send: (msg) => {
      void channel.send({ type: 'broadcast', event: 'm', payload: msg })
    },
    onMessage: (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    close: () => {
      listeners.clear()
      void sb.removeChannel(channel)
      void sb.realtime.disconnect()
    },
  }
}

const randomId = (): string => Array.from({ length: 10 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('')

/** Make a room: find a code nobody is hosting, and become its host. */
export async function hostRoom(name: string, mode: ModeId, level: Level, me = randomId()): Promise<{ code: string; session: HostSession }> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = newRoomCode()
    const bus = await realtimeBus(code)
    if (await probeRoom(bus, realClock)) {
      bus.close()
      continue
    }
    return { code, session: new HostSession(me, name, bus, realClock, mode, level) }
  }
  throw new Error('no-free-code')
}

/** Join the room with this code (as typed). Returns null when the code is not a code. The session says by itself if the room is not there. */
export async function joinRoom(codeText: string, name: string, me = randomId()): Promise<{ code: string; session: Session } | null> {
  const code = parseRoomCode(codeText)
  if (!code) return null
  const bus = await realtimeBus(code)
  return { code, session: new ClientSession(me, name, bus, realClock) }
}
