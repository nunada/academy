import type { Loc } from './types'
import { GENERATED } from './sudoku-levels'

/** The Sudoku puzzles, in five sizes. The grids come from `sudoku-levels.ts`, which tools/sudoku-build.mjs writes from what tools/sudoku-generate.mjs made:
 *  every one has exactly one answer, found by the solver of src/lib/sudoku.ts and checked again by tools/check-sudoku.mjs with a Dancing Links solver of its own. Here are only the names. */

const L = (en: string, id: string): Loc => ({ en, id })

export interface SdLevel {
  id: string
  /** the given digits, a row each: a digit or "." (Sudoku) */
  rows?: string[]
  /** Sum Sudoku: [the sum, the cells] of every cage */
  cages?: [number, number[]][]
  /** the answer, a row each */
  sol: string[]
}
export interface SdTier {
  id: string
  size: number
  name: Loc
  subtitle: Loc
  levels: SdLevel[]
}

const TIERS: { id: string; size: number; name: Loc; subtitle: Loc }[] = [
  { id: 's4', size: 4, name: L('Tiny, 4×4', 'Mungil, 4×4'), subtitle: L('Digits 1 to 4, boxes of 2×2: learn the rules.', 'Angka 1 sampai 4, kotak 2×2: pelajari aturannya.') },
  { id: 's6', size: 6, name: L('Small, 6×6', 'Kecil, 6×6'), subtitle: L('Digits 1 to 6, boxes of 2 rows by 3 columns.', 'Angka 1 sampai 6, kotak 2 baris kali 3 kolom.') },
  { id: 's9e', size: 9, name: L('Easy, 9×9', 'Mudah, 9×9'), subtitle: L('The classic grid with many digits given.', 'Kotak klasik dengan banyak angka diberikan.') },
  { id: 's9m', size: 9, name: L('Medium, 9×9', 'Sedang, 9×9'), subtitle: L('Fewer digits given, still no trying needed.', 'Angka diberikan lebih sedikit, tetap tanpa mencoba-coba.') },
  { id: 's9h', size: 9, name: L('Hard, 9×9', 'Sulit, 9×9'), subtitle: L('Singles are not enough: try a digit and follow it.', 'Satu-satunya tempat tidak cukup: coba satu angka dan ikuti akibatnya.') },
]

export const TIER_LIST: SdTier[] = TIERS.map((t) => ({
  ...t,
  levels: (GENERATED[t.id] ?? []).map((g, i) => ({ id: `${t.id}-${String(i + 1).padStart(2, '0')}`, rows: g.rows, sol: g.sol })),
}))

export const ALL_PUZZLES: SdLevel[] = TIER_LIST.flatMap((t) => t.levels)
export const PUZZLE_IDS: string[] = ALL_PUZZLES.map((l) => l.id)
