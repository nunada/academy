import type { Module } from '../types'
import { L } from './figs'
import { m8s1 } from './m8a-segitiga'
import { m8s2 } from './m8b-lingkaran-satuan'

export const module8: Module = {
  id: 'tka-sma-m8',
  title: L('Trigonometry', 'Trigonometri'),
  summary: L(
    'Trigonometric ratios in triangles, the sine and cosine rules, the unit circle, radians, identities, equations and graphs.',
    'Perbandingan trigonometri pada segitiga, aturan sinus dan kosinus, lingkaran satuan, radian, identitas, persamaan, dan grafik.',
  ),
  submodules: [m8s1, m8s2],
}
