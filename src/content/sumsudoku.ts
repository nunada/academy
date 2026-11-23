import type { Loc } from './types'
import { GENERATED } from './sumsudoku-levels'
import type { SdLevel, SdTier } from './sudoku'

/** The Sum Sudoku puzzles, in five sizes. The cages come from `sumsudoku-levels.ts`, which tools/sumsudoku-build.mjs writes from what tools/sumsudoku-generate.mjs made:
 *  every one has exactly one answer, found by the solver of src/lib/sudoku.ts and checked again by tools/check-sumsudoku.mjs with a Dancing Links solver of its own. Here are only the names. */

const L = (en: string, id: string): Loc => ({ en, id })

const TIERS: { id: string; size: number; name: Loc; subtitle: Loc }[] = [
  { id: 's4', size: 4, name: L('Tiny, 4×4', 'Mungil, 4×4'), subtitle: L('Meet the cages on a small grid.', 'Berkenalan dengan kandang di kotak kecil.') },
  { id: 's6', size: 6, name: L('Small, 6×6', 'Kecil, 6×6'), subtitle: L('Boxes of 2 rows by 3 columns, cages of two to five cells.', 'Kotak 2 baris kali 3 kolom, kandang dua sampai lima petak.') },
  { id: 's9e', size: 9, name: L('Easy, 9×9', 'Mudah, 9×9'), subtitle: L('Small cages and many digits already given.', 'Kandang kecil dan banyak angka yang sudah diberikan.') },
  { id: 's9m', size: 9, name: L('Medium, 9×9', 'Sedang, 9×9'), subtitle: L('Bigger cages and fewer one-cell cages.', 'Kandang lebih besar dan lebih sedikit kandang satu petak.') },
  { id: 's9h', size: 9, name: L('Hard, 9×9', 'Sulit, 9×9'), subtitle: L('Few cages: try a digit and follow what it forces.', 'Sedikit kandang: coba satu angka dan ikuti akibatnya.') },
]

export const TIER_LIST: SdTier[] = TIERS.map((t) => ({
  ...t,
  levels: (GENERATED[t.id] ?? []).map((g, i): SdLevel => ({ id: `${t.id}-${String(i + 1).padStart(2, '0')}`, cages: g.cages, sol: g.sol })),
}))

export const ALL_PUZZLES: SdLevel[] = TIER_LIST.flatMap((t) => t.levels)
export const PUZZLE_IDS: string[] = ALL_PUZZLES.map((l) => l.id)
