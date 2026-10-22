import type { Module } from '../types'
import { L } from './b'
import { m2s1 } from './m2a-ulangi'
import { m2s2 } from './m2b-bersarang'

export const module2: Module = {
  id: 'cb-m2',
  title: L('Loops', 'Perulangan'),
  summary: L(
    'The repeat block: say a pattern once, count inside loops, and put loops inside loops.',
    'Blok ulangi: menyatakan pola sekali, menghitung di dalam perulangan, dan menaruh perulangan di dalam perulangan.',
  ),
  submodules: [m2s1, m2s2],
}
