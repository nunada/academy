import type { Course } from '../types'
import { module1 } from './m1-document'
import { module2 } from './m2-links-lists'
import { module3 } from './m3-tables-forms'
import { module4 } from './m4-semantics'

export const htmlCourse: Course = {
  id: 'html',
  title: { en: 'HTML', id: 'HTML' },
  tagline: {
    en: 'Structure a web page with the language browsers actually read.',
    id: 'Menyusun halaman web dengan bahasa yang benar-benar dibaca peramban.',
  },
  icon: '📄',
  color: '#e16f47',
  level: { en: 'Beginner', id: 'Pemula' },
  language: 'html',
  requires: [],
  available: true,
  modules: [module1, module2, module3, module4],
}
