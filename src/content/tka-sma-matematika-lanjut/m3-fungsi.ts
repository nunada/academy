import type { Module } from '../types'
import { L } from './figs'
import { m3s1 } from './m3a-domain-grafik'
import { m3s2 } from './m3b-eksponen-trigonometri'

export const module3: Module = {
  id: 'tka-sml-m3',
  title: L('Functions', 'Fungsi'),
  summary: L(
    'Domain, range and graphs of polynomial, rational, root, absolute-value, exponential, logarithmic and trigonometric functions.',
    'Domain, daerah hasil, dan grafik fungsi polinom, rasional, akar, mutlak, eksponensial, logaritma, dan trigonometri.',
  ),
  submodules: [m3s1, m3s2],
}
