import type { Module } from '../types'
import { L } from './figs'
import { m2s1 } from './m2a-persamaan-pertidaksamaan'
import { m2s2 } from './m2b-sistem-linear'

export const module2: Module = {
  id: 'tka-sma-m2',
  title: L('Linear Equations, Inequalities and Systems', 'Persamaan, Pertidaksamaan, dan Sistem Linear'),
  summary: L(
    'Solve linear equations and inequalities (with absolute value), systems of two equations, and find the best choice inside a region.',
    'Menyelesaikan persamaan dan pertidaksamaan linear (dengan nilai mutlak), sistem dua persamaan, dan mencari pilihan terbaik di dalam sebuah daerah.',
  ),
  submodules: [m2s1, m2s2],
}
