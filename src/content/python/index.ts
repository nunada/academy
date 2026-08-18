import type { Course } from '../types'
import { module1 } from './m1-basics'
import { module2 } from './m2-decisions'
import { module3 } from './m3-loops'
import { module4 } from './m4-collections'
import { module5 } from './m5-functions'
import { module6 } from './m6-errors'
import { module7 } from './m7-files'
import { module8 } from './m8-objects'
import { module9 } from './m9-private-apis'

export const pythonCourse: Course = {
  id: 'python',
  title: { en: 'Python', id: 'Python' },
  tagline: {
    en: 'From your first printed line to a class that talks to a private API.',
    id: 'Dari baris cetak pertamamu sampai class yang berbicara dengan API privat.',
  },
  icon: '🐍',
  color: '#3b82f6',
  level: { en: 'Beginner', id: 'Pemula' },
  language: 'python',
  requires: [],
  available: true,
  modules: [module1, module2, module3, module4, module5, module6, module7, module8, module9],
}
