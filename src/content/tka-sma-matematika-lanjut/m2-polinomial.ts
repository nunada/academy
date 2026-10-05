import type { Module } from '../types'
import { L } from './figs'
import { m2s1 } from './m2a-polinomial'

export const module2: Module = {
  id: 'tka-sml-m2',
  title: L('Polynomials', 'Polinomial'),
  summary: L(
    'Operations, factoring and remainders of polynomials of degree up to 4.',
    'Operasi, pemfaktoran, dan sisa pembagian polinomial berderajat sampai 4.',
  ),
  submodules: [m2s1],
}
