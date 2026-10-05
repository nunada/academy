import type { Module } from '../types'
import { L } from './figs'
import { m4s1 } from './m4a-aritmetika'
import { m4s2 } from './m4b-geometri-barisan'

export const module4: Module = {
  id: 'tka-sma-m4',
  title: L('Sequences and Series', 'Barisan dan Deret'),
  summary: L(
    'Arithmetic and geometric sequences and series, including the sum of an infinite geometric series.',
    'Barisan dan deret aritmetika dan geometri, termasuk jumlah deret geometri tak hingga.',
  ),
  submodules: [m4s1, m4s2],
}
