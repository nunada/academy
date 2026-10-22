import type { Module } from '../types'
import { L } from './b'
import { m4s1 } from './m4a-variabel'
import { m4s2 } from './m4b-blokku'

export const module4: Module = {
  id: 'cb-m4',
  title: L('Variables and Blocks of Your Own', 'Variabel dan Blok Buatan Sendiri'),
  summary: L(
    'Variables that count, and blocks you build and run again and again: the two ideas behind every large program.',
    'Variabel yang menghitung, dan blok yang kamu susun lalu dijalankan berulang-ulang: dua gagasan di balik setiap program besar.',
  ),
  submodules: [m4s1, m4s2],
}
