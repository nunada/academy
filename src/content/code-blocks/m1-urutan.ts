import type { Module } from '../types'
import { L } from './b'
import { m1s1 } from './m1a-gerakan'
import { m1s2 } from './m1b-bintang-ucapan'

export const module1: Module = {
  id: 'cb-m1',
  title: L('Orders in Sequence', 'Perintah Berurutan'),
  summary: L(
    'Programs as lists of orders: move, turn, pick up stars and say things, one block after another.',
    'Program sebagai daftar perintah: maju, belok, mengambil bintang, dan berbicara, satu blok demi satu blok.',
  ),
  submodules: [m1s1, m1s2],
}
