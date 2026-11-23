// Sum Sudoku: src/lib/sudoku.ts (the rules, the solver, the hints), src/content/sumsudoku.ts (the 40 puzzles) and the page text. The checks are in tools/sudoku-check-core.mjs.
//   node tools/check-sumsudoku.mjs
import { check } from './sudoku-check-core.mjs'

await check('sum')
