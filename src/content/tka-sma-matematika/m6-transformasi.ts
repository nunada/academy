import type { Module } from '../types'
import { L } from './figs'
import { m6s1 } from './m6a-transformasi-titik'
import { m6s2 } from './m6b-transformasi-grafik'

export const module6: Module = {
  id: 'tka-sma-m6',
  title: L('Transformations', 'Transformasi'),
  summary: L(
    'Translation, reflection, rotation and dilation of points, graphs of transformed functions, compositions and symmetry.',
    'Translasi, refleksi, rotasi, dan dilatasi titik, grafik fungsi yang ditransformasi, komposisi, dan simetri.',
  ),
  submodules: [m6s1, m6s2],
}
