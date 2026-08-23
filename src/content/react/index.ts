import type { Course } from '../types'
import { module1 } from './m1-components'
import { module2 } from './m2-state'
import { module3 } from './m3-effects'
import { module4 } from './m4-app'

export const reactCourse: Course = {
  id: 'react',
  title: { en: 'React', id: 'React' },
  tagline: {
    en: 'Build interfaces out of components that manage their own state.',
    id: 'Membangun antarmuka dari komponen yang mengelola state-nya sendiri.',
  },
  icon: '⚛️',
  color: '#7eaa71',
  level: { en: 'Intermediate', id: 'Menengah' },
  language: 'react',
  requires: ['html', 'css', 'javascript'],
  available: true,
  modules: [module1, module2, module3, module4],
}
