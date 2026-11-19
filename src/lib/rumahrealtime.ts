/** The real `Bus` for the Houses: a Supabase Realtime Broadcast channel per room, the same kind Math Domino uses (no table, no SQL, no account). A room of
 *  Multiplication House and a room of Addition House have different channel names, so a code typed into the wrong game finds nothing. */

import { openChannel, randomId } from './dominorealtime'
import { ClientSession, HostSession, newRoomCode, parseMsg, parseRoomCode, probeRoom, realClock, type Bus, type Msg, type Session } from './rumahnet'
import type { Op } from './rumah'

export { onlineAvailable } from './dominorealtime'

export const realtimeBus = (op: Op, code: string): Promise<Bus> => openChannel<Msg>(`nunada-rumah-${op}-${code}`, parseMsg)

/** Make a room: find a code nobody is hosting, and become its host. */
export async function hostRoom(op: Op, name: string, timeLimit: number | null, me = randomId()): Promise<{ code: string; session: HostSession }> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = newRoomCode()
    const bus = await realtimeBus(op, code)
    if (await probeRoom(bus, realClock)) {
      bus.close()
      continue
    }
    return { code, session: new HostSession(me, name, bus, realClock, op, timeLimit) }
  }
  throw new Error('no-free-code')
}

/** Join the room with this code (as typed). Returns null when the code is not a code. The session says by itself if the room is not there. */
export async function joinRoom(op: Op, codeText: string, name: string, me = randomId()): Promise<{ code: string; session: Session } | null> {
  const code = parseRoomCode(codeText)
  if (!code) return null
  const bus = await realtimeBus(op, code)
  return { code, session: new ClientSession(me, name, bus, realClock) }
}
