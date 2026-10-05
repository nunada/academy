import type { Module } from '../types'
import { L } from './figs'
import { m3s1 } from './m3a-fungsi-dasar'
import { m3s2 } from './m3b-kuadrat-eksponen'

export const module3: Module = {
  id: 'tka-sma-m3',
  title: L('Functions', 'Fungsi'),
  summary: L(
    'Functions and their graphs: lines, composites and inverses, parabolas, and exponential growth and decay.',
    'Fungsi dan grafiknya: garis, komposisi dan invers, parabola, serta pertumbuhan dan peluruhan eksponensial.',
  ),
  submodules: [m3s1, m3s2],
}
