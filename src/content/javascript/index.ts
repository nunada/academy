import type { Course } from '../types'
import { module1 } from './m1-values'
import { module2 } from './m2-functions'
import { module3 } from './m3-dom'
import { module4 } from './m4-robust'

export const javascriptCourse: Course = {
  id: 'javascript',
  title: { en: 'JavaScript', id: 'JavaScript' },
  tagline: {
    en: 'Make pages respond to the person using them.',
    id: 'Membuat halaman merespons orang yang memakainya.',
  },
  icon: '⚡',
  color: '#c8912f',
  level: { en: 'Beginner', id: 'Pemula' },
  language: 'javascript',
  requires: [],
  available: true,
  modules: [module1, module2, module3, module4],
}
