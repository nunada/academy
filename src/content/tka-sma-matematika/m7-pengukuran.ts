import type { Module } from '../types'
import { L } from './figs'
import { m7s1 } from './m7a-satuan-luas'
import { m7s2 } from './m7b-bangun-ruang'

export const module7: Module = {
  id: 'tka-sma-m7',
  title: L('Measurement', 'Pengukuran'),
  summary: L(
    'Units and rates, perimeter and area, and the volume and surface area of solids.',
    'Satuan dan laju, keliling dan luas, serta volume dan luas permukaan bangun ruang.',
  ),
  submodules: [m7s1, m7s2],
}
