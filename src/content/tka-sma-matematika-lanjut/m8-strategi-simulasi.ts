import type { Module } from '../types'
import { L } from './figs'
import { m8s1 } from './m8a-bentuk-strategi'
import { m8s2 } from './m8d-simulasi'

export const module8: Module = {
  id: 'tka-sml-m8',
  title: L('Strategy and Practice Tests', 'Strategi dan Simulasi TKA'),
  summary: L(
    'The question forms, how to check an answer and plan your time, and two full practice tests.',
    'Bentuk soal, cara memeriksa jawaban dan merencanakan waktu, serta dua simulasi lengkap.',
  ),
  submodules: [m8s1, m8s2],
}
