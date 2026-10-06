import type { Module } from '../types'
import { L } from './figs'
import { m9s1 } from './m9a-statistika'
import { m9s2 } from './m9b-peluang'

export const module9: Module = {
  id: 'tka-sma-m9',
  title: L('Data and Probability', 'Data dan Peluang'),
  summary: L(
    'Centre and spread of data, reading data displays, counting rules, probability and expected value.',
    'Pusat dan sebaran data, membaca penyajian data, aturan pencacahan, peluang, dan nilai harapan.',
  ),
  submodules: [m9s1, m9s2],
}
