import type { Module } from '../types'
import { L } from './figs'
import { m6s1 } from './m6a-transformasi-titik'
import { m6s2 } from './m6b-komposisi'

export const module6: Module = {
  id: 'tka-sma-m6',
  title: L('Transformations', 'Transformasi'),
  summary: L(
    'Translation, reflection, rotation and dilation of points, and compositions of transformations.',
    'Translasi, refleksi, rotasi, dan dilatasi titik, serta komposisi transformasi.',
  ),
  submodules: [m6s1, m6s2],
}
