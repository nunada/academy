import type { Module } from '../types'
import { L } from './figs'
import { m1s1 } from './m1a-jenis-sifat'
import { m1s2 } from './m1b-pangkat-akar-log'

export const module1: Module = {
  id: 'tka-sma-m1',
  title: L('Real Numbers', 'Bilangan Real'),
  summary: L(
    'The number system underneath everything else: kinds of real numbers, ratio and percent, exponents, roots and logarithms.',
    'Sistem bilangan yang menjadi dasar semua materi lain: jenis bilangan real, rasio dan persen, eksponen, akar, dan logaritma.',
  ),
  submodules: [m1s1, m1s2],
}
