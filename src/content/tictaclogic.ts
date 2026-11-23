import type { Loc } from './types'
import { GENERATED } from './tictaclogic-levels'

/** The Tic-Tac-Logic puzzles, in five sizes. The grids come from `tictaclogic-levels.ts`, which tools/tictaclogic-build.mjs writes from what tools/tictaclogic-generate.mjs made:
 *  every one has exactly one answer, found by the solver of src/lib/tictaclogic.ts and checked again by tools/check-tictaclogic.mjs with a solver of its own. Here are only the names. */

const L = (en: string, id: string): Loc => ({ en, id })

export interface TtLevel {
  id: string
  /** the given cells, a row each: X, O or "." */
  rows: string[]
  /** the answer, a row each */
  sol: string[]
}
export interface TtTier {
  id: string
  size: number
  name: Loc
  subtitle: Loc
  levels: TtLevel[]
}

const TIERS: { id: string; size: number; name: Loc; subtitle: Loc }[] = [
  { id: 't4', size: 4, name: L('Tiny, 4×4', 'Mungil, 4×4'), subtitle: L('Learn the three rules on a small grid.', 'Pelajari tiga aturan di kotak kecil.') },
  { id: 't6', size: 6, name: L('Small, 6×6', 'Kecil, 6×6'), subtitle: L('Pairs and gaps start to decide cells.', 'Pasangan dan celah mulai menentukan petak.') },
  { id: 't8', size: 8, name: L('Medium, 8×8', 'Sedang, 8×8'), subtitle: L('Counting a whole row or column.', 'Menghitung satu baris atau kolom penuh.') },
  { id: 't10', size: 10, name: L('Large, 10×10', 'Besar, 10×10'), subtitle: L('Rows that must not be the same.', 'Baris yang tidak boleh sama.') },
  { id: 't12', size: 12, name: L('Huge, 12×12', 'Raksasa, 12×12'), subtitle: L('The big ones.', 'Yang besar.') },
]

export const TIER_LIST: TtTier[] = TIERS.map((t) => ({
  ...t,
  levels: (GENERATED[t.id] ?? []).map((g, i) => ({ id: `${t.id}-${String(i + 1).padStart(2, '0')}`, rows: g.rows, sol: g.sol })),
}))

export const ALL_PUZZLES: TtLevel[] = TIER_LIST.flatMap((t) => t.levels)
export const PUZZLE_IDS: string[] = ALL_PUZZLES.map((l) => l.id)
