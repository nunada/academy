import type { Loc } from './types'
import { GENERATED } from './nurikabe-levels'

/** The Nurikabe puzzles, in five sizes. The grids come from `nurikabe-levels.ts`, which tools/nurikabe-build.mjs writes from what tools/nurikabe-generate.mjs made: every one has
 *  exactly one answer, found by the solver of src/lib/nurikabe.ts and checked again by tools/check-nurikabe.mjs with a solver of its own. Here are only the names. */

const L = (en: string, id: string): Loc => ({ en, id })

export interface NkLevel {
  id: string
  /** the numbers, a row each ("." where there is none) */
  rows: string[]
  /** the answer, a row each: "#" sea, "." land */
  sea: string[]
}
export interface NkTier {
  id: string
  size: number
  name: Loc
  subtitle: Loc
  levels: NkLevel[]
}

const TIERS: { id: string; size: number; name: Loc; subtitle: Loc }[] = [
  { id: 'n5', size: 5, name: L('Tiny, 5×5', 'Mungil, 5×5'), subtitle: L('Learn the rules on a small grid.', 'Pelajari aturannya di kotak kecil.') },
  { id: 'n6', size: 6, name: L('Small, 6×6', 'Kecil, 6×6'), subtitle: L('Islands begin to compete for room.', 'Pulau-pulau mulai berebut tempat.') },
  { id: 'n7', size: 7, name: L('Medium, 7×7', 'Sedang, 7×7'), subtitle: L('The sea has to stay in one piece.', 'Laut harus tetap satu bagian.') },
  { id: 'n8', size: 8, name: L('Large, 8×8', 'Besar, 8×8'), subtitle: L('Long chains of reasoning.', 'Rantai penalaran yang panjang.') },
  { id: 'n9', size: 9, name: L('Huge, 9×9', 'Raksasa, 9×9'), subtitle: L('The big ones.', 'Yang besar.') },
]

export const TIER_LIST: NkTier[] = TIERS.map((t) => ({
  ...t,
  levels: (GENERATED[t.id] ?? []).map((g, i) => ({ id: `${t.id}-${String(i + 1).padStart(2, '0')}`, rows: g.rows, sea: g.sea })),
}))

export const ALL_PUZZLES: NkLevel[] = TIER_LIST.flatMap((t) => t.levels)
export const PUZZLE_IDS: string[] = ALL_PUZZLES.map((l) => l.id)
