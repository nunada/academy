import type { Module } from '../types'
import { L } from './figs'
import { m7s1 } from './m7a-limit'

export const module7: Module = {
  id: 'tka-sml-m7',
  title: L('Limits', 'Limit'),
  summary: L(
    'The idea of a limit, algebraic limits and limits at infinity, and trigonometric limits.',
    'Gagasan limit, limit aljabar dan limit di tak hingga, serta limit trigonometri.',
  ),
  submodules: [m7s1],
}
