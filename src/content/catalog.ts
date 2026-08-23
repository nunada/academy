import type { CareerPath, Course } from './types'
import { pythonCourse } from './python'
import { htmlCourse } from './html'
import { cssCourse } from './css'
import { javascriptCourse } from './javascript'
import { reactCourse } from './react'
import { sqlCourse } from './sql'
import { typescriptCourse } from './typescript'
import { gameDevCourse } from './gamedev'

/** Every course here is written. A course that is planned but not yet built
 *  belongs in this list too, with `available: false` and an empty `modules` —
 *  that is what keeps it visible on the roadmap while blocking enrolment
 *  everywhere, and the landing page derives its "coming soon" line from it. */
export const COURSES: Course[] = [
  pythonCourse,
  htmlCourse,
  cssCourse,
  javascriptCourse,
  sqlCourse,
  typescriptCourse,
  reactCourse,
  gameDevCourse,
]

export const PATHS: CareerPath[] = [
  {
    id: 'python-developer',
    title: { en: 'Python Developer', id: 'Python Developer' },
    blurb: {
      en: 'Start from zero and end able to read, write, and structure real Python programs.',
      id: 'Mulai dari nol dan berakhir mampu membaca, menulis, dan menyusun program Python nyata.',
    },
    icon: '🐍',
    color: '#24463d',
    courseIds: ['python'],
    available: true,
  },
  {
    id: 'front-end',
    title: { en: 'Front-End Developer', id: 'Front-End Developer' },
    blurb: {
      en: 'Everything the browser runs: structure, style, behaviour, components.',
      id: 'Semua yang dijalankan peramban: struktur, gaya, perilaku, komponen.',
    },
    icon: '🖼️',
    color: '#e16f47',
    courseIds: ['html', 'css', 'javascript', 'react'],
    available: true,
  },
  {
    id: 'back-end',
    title: { en: 'Back-End Developer', id: 'Back-End Developer' },
    blurb: {
      en: 'The half nobody sees: data, queries, and the rules behind an app.',
      id: 'Bagian yang tak terlihat: data, kueri, dan aturan di balik sebuah aplikasi.',
    },
    icon: '⚙️',
    color: '#4f8b56',
    courseIds: ['python', 'sql'],
    available: true,
  },
  {
    id: 'full-stack',
    title: { en: 'Full-Stack Developer', id: 'Full-Stack Developer' },
    blurb: {
      en: 'Both halves, end to end — from the button to the database row.',
      id: 'Kedua sisi, ujung ke ujung — dari tombolnya sampai baris basis datanya.',
    },
    icon: '🧱',
    color: '#dda52b',
    courseIds: ['html', 'css', 'javascript', 'react', 'sql', 'python'],
    available: true,
  },
]

export function courseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id)
}

export function pathById(id: string): CareerPath | undefined {
  return PATHS.find((p) => p.id === id)
}
