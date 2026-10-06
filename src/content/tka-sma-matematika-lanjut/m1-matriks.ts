import type { Module } from '../types'
import { L } from './figs'
import { m1s1 } from './m1a-operasi-determinan'
import { m1s2 } from './m1b-invers'

export const module1: Module = {
  id: 'tka-sml-m1',
  title: L('Matrices', 'Matriks'),
  summary: L(
    'Operations on matrices, determinants of 2 x 2 and 3 x 3 matrices, inverses, and solving equations with matrices.',
    'Operasi pada matriks, determinan matriks 2 x 2 dan 3 x 3, invers, dan menyelesaikan persamaan dengan matriks.',
  ),
  submodules: [m1s1, m1s2],
}
