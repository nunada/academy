import type { Course } from '../types'
import { module1 } from './m1-select'
import { module2 } from './m2-groups'
import { module3 } from './m3-joins'
import { module4 } from './m4-writing'

export const sqlCourse: Course = {
  id: 'sql',
  title: { en: 'SQL', id: 'SQL' },
  tagline: {
    en: 'Ask a database questions and get exactly the rows you meant.',
    id: 'Bertanya kepada basis data dan mendapatkan baris yang benar-benar kamu maksud.',
  },
  icon: '🗄️',
  color: '#4f8b56',
  level: { en: 'Beginner', id: 'Pemula' },
  language: 'sql',
  requires: [],
  available: true,
  modules: [module1, module2, module3, module4],
}
