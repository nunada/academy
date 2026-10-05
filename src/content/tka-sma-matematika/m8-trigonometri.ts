import type { Module } from '../types'
import { L } from './figs'
import { m8s1 } from './m8a-segitiga'
import { m8s2 } from './m8b-hubungan-penerapan'

export const module8: Module = {
  id: 'tka-sma-m8',
  title: L('Trigonometry', 'Trigonometri'),
  summary: L(
    'The six trigonometric ratios: sine, cosine, tangent, cotangent, secant and cosecant, their relations, and problems that use them.',
    'Keenam perbandingan trigonometri: sinus, kosinus, tangen, kotangen, sekan, dan kosekan, hubungannya, serta soal yang memakainya.',
  ),
  submodules: [m8s1, m8s2],
}
