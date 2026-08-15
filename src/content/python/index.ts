import type { Course } from '../types'
import { module1 } from './m1-basics'
import { module2 } from './m2-decisions'
import { module3 } from './m3-loops'
import { module4 } from './m4-collections'
import { module5 } from './m5-functions'

export const pythonCourse: Course = {
  id: 'python',
  title: { en: 'Python', id: 'Python' },
  tagline: {
    en: 'From your first printed line to functions that work together.',
    id: 'Dari baris cetak pertamamu sampai fungsi yang saling bekerja sama.',
  },
  icon: '🐍',
  color: '#3b82f6',
  level: { en: 'Beginner', id: 'Pemula' },
  language: 'python',
  requires: [],
  available: true,
  modules: [module1, module2, module3, module4, module5],
}
