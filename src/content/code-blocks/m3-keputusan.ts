import type { Module } from '../types'
import { L } from './b'
import { m3s1 } from './m3a-jika'
import { m3s2 } from './m3b-selama'

export const module3: Module = {
  id: 'cb-m3',
  title: L('Decisions', 'Keputusan'),
  summary: L(
    'If, otherwise and while: programs that look at the map before they act.',
    'Jika, jika tidak, dan selama: program yang melihat peta sebelum bertindak.',
  ),
  submodules: [m3s1, m3s2],
}
