import type { Module } from '../types'
import { L } from './figs'
import { m5s1 } from './m5a-bidang'
import { m5s2 } from './m5b-ruang'

export const module5: Module = {
  id: 'tka-sma-m5',
  title: L('Geometric Objects', 'Objek Geometri'),
  summary: L(
    'Triangles and circles in the plane, then cubes, boxes and the angles between lines and planes in space.',
    'Segitiga dan lingkaran pada bidang, lalu kubus, balok, dan sudut antara garis dan bidang dalam ruang.',
  ),
  submodules: [m5s1, m5s2],
}
