import type { Module } from '../types'
import { L } from './figs'
import { m4s1 } from './m4a-vektor'

export const module4: Module = {
  id: 'tka-sml-m4',
  title: L('Vectors', 'Vektor'),
  summary: L(
    'Vectors in the plane and in space: components, length, operations, the dot product and the angle.',
    'Vektor pada bidang dan ruang: komponen, panjang, operasi, hasil kali titik, dan sudut.',
  ),
  submodules: [m4s1],
}
