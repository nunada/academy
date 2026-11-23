import type { Loc } from './types'
import { GENERATED } from './hashi-levels'

/** The Hashi puzzles, in five sizes. The grids come from `hashi-levels.ts`, which tools/hashi-build.mjs writes from what tools/hashi-generate.mjs made: every one has exactly
 *  one answer, found by the solver of src/lib/hashi.ts and checked again by tools/check-hashi.mjs with a solver of its own. Here are only the names. */

const L = (en: string, id: string): Loc => ({ en, id })

export interface HsLevel {
  id: string
  /** the numbers, a row each ("." where there is no island) */
  rows: string[]
  /** the answer: [island, island, bridges], islands counted in reading order from 0 */
  links: [number, number, number][]
}
export interface HsTier {
  id: string
  size: number
  name: Loc
  subtitle: Loc
  levels: HsLevel[]
}

const TIERS: { id: string; size: number; name: Loc; subtitle: Loc }[] = [
  { id: 'h5', size: 5, name: L('Tiny, 5×5', 'Mungil, 5×5'), subtitle: L('Learn the rules on a small map.', 'Pelajari aturannya di peta kecil.') },
  { id: 'h7', size: 7, name: L('Small, 7×7', 'Kecil, 7×7'), subtitle: L('Bridges start to get in each other’s way.', 'Jembatan mulai saling menghalangi.') },
  { id: 'h9', size: 9, name: L('Medium, 9×9', 'Sedang, 9×9'), subtitle: L('Every island must join the network.', 'Setiap pulau harus tersambung ke jaringan.') },
  { id: 'h11', size: 11, name: L('Large, 11×11', 'Besar, 11×11'), subtitle: L('Long chains of reasoning.', 'Rantai penalaran yang panjang.') },
  { id: 'h13', size: 13, name: L('Huge, 13×13', 'Raksasa, 13×13'), subtitle: L('The big ones.', 'Yang besar.') },
]

export const TIER_LIST: HsTier[] = TIERS.map((t) => ({
  ...t,
  levels: (GENERATED[t.id] ?? []).map((g, i) => ({ id: `${t.id}-${String(i + 1).padStart(2, '0')}`, rows: g.rows, links: g.links })),
}))

export const ALL_PUZZLES: HsLevel[] = TIER_LIST.flatMap((t) => t.levels)
export const PUZZLE_IDS: string[] = ALL_PUZZLES.map((l) => l.id)
