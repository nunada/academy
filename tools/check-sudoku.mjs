// Sudoku: src/lib/sudoku.ts (the rules, the solver, the hints), src/content/sudoku.ts (the 40 puzzles) and the page text. The checks are in tools/sudoku-check-core.mjs.
//   node tools/check-sudoku.mjs
import { check } from './sudoku-check-core.mjs'

await check('sudoku')
