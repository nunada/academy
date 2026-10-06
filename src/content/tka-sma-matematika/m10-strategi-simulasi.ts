import type { Module } from '../types'
import { L } from './figs'
import { m10s1 } from './m10a-strategi'
import { m10s2 } from './m10b-bentuk-soal'
import { m10s3 } from './m10c-simulasi'

export const module10: Module = {
  id: 'tka-sma-m10',
  title: L('Strategy and Practice Tests', 'Strategi dan Simulasi TKA'),
  summary: L(
    'A method for solving problems, the three TKA question formats, a plan for your time, and two full practice tests.',
    'Metode memecahkan soal, tiga bentuk soal TKA, rencana untuk waktumu, dan dua simulasi lengkap.',
  ),
  submodules: [m10s1, m10s2, m10s3],
}
