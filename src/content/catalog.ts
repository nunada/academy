import type { CareerPath, Course } from './types'
import { pythonCourse } from './python'
import { htmlCourse } from './html'
import { cssCourse } from './css'
import { javascriptCourse } from './javascript'

/** A course that is listed but not yet written.
 *  Keeping these in the catalogue makes the roadmap visible without pretending
 *  the content exists — `available: false` blocks enrolment everywhere. */
function soon(
  id: string,
  title: string,
  icon: string,
  color: string,
  language: Course['language'],
  tagline: { en: string; id: string },
  level: { en: string; id: string },
  requires: string[] = [],
): Course {
  return {
    id,
    title: { en: title, id: title },
    tagline,
    icon,
    color,
    level,
    language,
    requires,
    available: false,
    modules: [],
  }
}

const BEGINNER = { en: 'Beginner', id: 'Pemula' }
const INTERMEDIATE = { en: 'Intermediate', id: 'Menengah' }

export const COURSES: Course[] = [
  pythonCourse,
  htmlCourse,
  cssCourse,
  javascriptCourse,
  soon('sql', 'SQL', '🗄️', '#4f8b56', 'sql', {
    en: 'Ask a database questions and get exactly the rows you meant.',
    id: 'Bertanya kepada basis data dan mendapatkan baris yang benar-benar kamu maksud.',
  }, BEGINNER),
  soon('typescript', 'TypeScript', '🧩', '#6d8175', 'typescript', {
    en: 'JavaScript that tells you about a mistake before you ship it.',
    id: 'JavaScript yang memberitahumu soal kesalahan sebelum kamu rilis.',
  }, INTERMEDIATE, ['javascript']),
  soon('react', 'React', '⚛️', '#7eaa71', 'react', {
    en: 'Build interfaces out of components that manage their own state.',
    id: 'Membangun antarmuka dari komponen yang mengelola state-nya sendiri.',
  }, INTERMEDIATE, ['html', 'css', 'javascript']),
  soon('game-dev', 'Game Development', '🎮', '#ef8f70', 'python', {
    en: 'Loops, sprites, collisions — a small game you can actually play.',
    id: 'Loop, sprite, tabrakan — game kecil yang benar-benar bisa dimainkan.',
  }, INTERMEDIATE, ['python']),
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
    available: false,
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
    available: false,
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
    available: false,
  },
]

export function courseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id)
}

export function pathById(id: string): CareerPath | undefined {
  return PATHS.find((p) => p.id === id)
}
