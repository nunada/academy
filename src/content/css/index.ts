import type { Course } from '../types'
import { module1 } from './m1-rules'
import { module2 } from './m2-box'
import { module3 } from './m3-layout'
import { module4 } from './m4-states'

export const cssCourse: Course = {
  id: 'css',
  title: { en: 'CSS', id: 'CSS' },
  tagline: {
    en: 'Layout, colour, and type — make a page look like it was designed.',
    id: 'Tata letak, warna, dan tipografi — buat halaman tampak dirancang.',
  },
  icon: '🎨',
  color: '#dda52b',
  level: { en: 'Beginner', id: 'Pemula' },
  language: 'css',
  requires: ['html'],
  available: true,
  modules: [module1, module2, module3, module4],
}
