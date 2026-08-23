import type { Course } from '../types'
import { module1 } from './m1-loop'
import { module2 } from './m2-collision'
import { module3 } from './m3-rules'
import { module4 } from './m4-whole'

export const gameDevCourse: Course = {
  id: 'game-dev',
  title: { en: 'Game Development', id: 'Game Development' },
  tagline: {
    en: 'Loops, sprites, collisions — a small game you can actually play.',
    id: 'Loop, sprite, tabrakan — game kecil yang benar-benar bisa dimainkan.',
  },
  icon: '🎮',
  color: '#ef8f70',
  level: { en: 'Intermediate', id: 'Menengah' },
  language: 'python',
  requires: ['python'],
  available: true,
  modules: [module1, module2, module3, module4],
}
