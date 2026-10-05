import type { Module } from '../types'
import { L } from './figs'
import { m3s1 } from './m3a-fungsi-dasar'
import { m3s2 } from './m3b-kuadrat'

export const module3: Module = {
  id: 'tka-sma-m3',
  title: L('Functions', 'Fungsi'),
  summary: L(
    'Functions and their graphs: lines, composites and inverses, rational functions and parabolas.',
    'Fungsi dan grafiknya: garis, komposisi dan invers, fungsi rasional, dan parabola.',
  ),
  submodules: [m3s1, m3s2],
}
