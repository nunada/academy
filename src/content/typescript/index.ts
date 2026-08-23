import type { Course } from '../types'
import { module1 } from './m1-annotations'
import { module2 } from './m2-unions'
import { module3 } from './m3-generics'
import { module4 } from './m4-holding'

export const typescriptCourse: Course = {
  id: 'typescript',
  title: { en: 'TypeScript', id: 'TypeScript' },
  tagline: {
    en: 'JavaScript that tells you about a mistake before you ship it.',
    id: 'JavaScript yang memberitahumu soal kesalahan sebelum kamu rilis.',
  },
  icon: '🧩',
  color: '#6d8175',
  level: { en: 'Intermediate', id: 'Menengah' },
  language: 'typescript',
  requires: ['javascript'],
  available: true,
  modules: [module1, module2, module3, module4],
}
