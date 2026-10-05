import type { Module } from '../types'
import { L } from './figs'
import { m5s1 } from './m5a-lingkaran'

export const module5: Module = {
  id: 'tka-sml-m5',
  title: L('Circles', 'Lingkaran'),
  summary: L(
    'The equation of a circle, tangent lines, and arcs, sectors and segments.',
    'Persamaan lingkaran, garis singgung, serta busur, juring, dan tembereng.',
  ),
  submodules: [m5s1],
}
