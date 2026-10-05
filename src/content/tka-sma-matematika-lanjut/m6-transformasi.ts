import type { Module } from '../types'
import { L } from './figs'
import { m6s1 } from './m6a-transformasi'

export const module6: Module = {
  id: 'tka-sml-m6',
  title: L('Geometric Transformations', 'Transformasi Geometri'),
  summary: L(
    'Translation, reflection, rotation and dilation with their matrices, compositions, and images of lines, curves and regions.',
    'Translasi, refleksi, rotasi, dan dilatasi dengan matriksnya, komposisi, serta bayangan garis, kurva, dan daerah.',
  ),
  submodules: [m6s1],
}
