/** The catalogue: metadata now, curriculum later.
 *
 *  All eight curricula together are 1.0 MB minified — 282 KB over the wire, and
 *  most of what the app used to ship before anything appeared. They sit in a
 *  chunk each now, fetched when a course is opened.
 *
 *  The landing page, the catalogue and the dashboard never fetch one. Everything
 *  their cards show comes from the metadata below plus the learner's own
 *  progress rows, which carry a `course_id` — so "12 of 55, 22%" is arithmetic
 *  on rows the app already had.
 *
 *  `lessons` and `projects` are the price of that: two numbers per course that
 *  live here instead of being counted from the curriculum. They are the only
 *  facts duplicated across the lazy boundary, and `npm run check:curriculum`
 *  counts the real thing and fails on a mismatch.
 */

import type { CareerPath, Course, CourseInfo, Module } from './types'

export const COURSES: CourseInfo[] = [
  {
    id: 'python',
    title: { en: 'Python', id: 'Python' },
    tagline: {
      en: 'From your first printed line to a class that talks to a private API.',
      id: 'Dari baris cetak pertamamu sampai class yang berbicara dengan API privat.',
    },
    icon: '🐍',
    color: '#24463d',
    level: { en: 'Beginner', id: 'Pemula' },
    language: 'python',
    requires: [],
    available: true,
    lessons: 37,
    projects: 18,
  },
  {
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
    lessons: 14,
    projects: 7,
  },
  {
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
    lessons: 14,
    projects: 7,
  },
  {
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
    lessons: 14,
    projects: 7,
  },
  {
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
    lessons: 14,
    projects: 7,
  },
  {
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
    lessons: 14,
    projects: 7,
  },
  {
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
    lessons: 14,
    projects: 7,
  },
  {
    id: 'game-dev',
    title: { en: 'Game Development', id: 'Game Development' },
    tagline: {
      en: 'Loops, sprites, collisions — a small game you can actually play.',
      id: 'Loop, sprite, tabrakan — game kecil yang benar-benar bisa dimainkan.',
    },
    icon: '🎮',
    color: '#ef8f70',
    level: { en: 'Intermediate', id: 'Menengah' },
    language: 'python',
    requires: ['python'],
    available: true,
    lessons: 14,
    projects: 7,
  },
  {
    id: 'python-math',
    title: { en: 'Python for Math: Foundations', id: 'Python untuk Matematika: Dasar' },
    tagline: {
      en: 'Arithmetic, decisions, loops, and functions — every example a formula, not a string of letters.',
      id: 'Aritmetika, keputusan, perulangan, dan fungsi — tiap contohnya formula, bukan rangkaian huruf.',
    },
    icon: '🔢',
    color: '#437649',
    level: { en: 'Beginner', id: 'Pemula' },
    language: 'python',
    requires: [],
    available: true,
    lessons: 16,
    projects: 8,
  },
  {
    id: 'python-media',
    title: { en: 'Python for Math Teaching Media', id: 'Python untuk Media Pembelajaran Matematika' },
    tagline: {
      en: 'Problem generators, an automatic grader, and interactive figures you could show a class.',
      id: 'Generator soal, penilai otomatis, dan peraga interaktif yang bisa ditunjukkan ke satu kelas.',
    },
    icon: '🧑‍🏫',
    color: '#7eaa71',
    level: { en: 'Intermediate', id: 'Menengah' },
    language: 'python',
    requires: ['python-math'],
    available: true,
    lessons: 16,
    projects: 9,
  },
  {
    id: 'python-numpy',
    title: { en: 'Numerical Python', id: 'Python untuk Matematika: Numerik' },
    tagline: {
      en: 'Vectors, matrices, and simulation — numpy arrays instead of arithmetic written out by hand.',
      id: 'Vektor, matriks, dan simulasi — array numpy alih-alih aritmetika yang ditulis manual.',
    },
    icon: '📐',
    color: '#437649',
    level: { en: 'Intermediate', id: 'Menengah' },
    language: 'python',
    requires: ['python-math'],
    available: true,
    lessons: 12,
    projects: 6,
  },
  {
    id: 'vektor',
    title: { en: 'Vectors in the Plane and in Space', id: 'Vektor di Bidang dan di Ruang' },
    tagline: {
      en: 'Components, dot and cross products, and the lines and planes they describe.',
      id: 'Komponen, perkalian titik dan silang, serta garis dan bidang yang dinyatakannya.',
    },
    icon: '➗',
    color: '#4f8b56',
    level: { en: 'Intermediate', id: 'Menengah' },
    language: 'math',
    requires: [],
    available: true,
    lessons: 22,
    projects: 10,
  },
]

/** One dynamic import per course. Written out rather than built from the id so
 *  the bundler can see every one of them and give each its own chunk. */
const MUAT: Record<string, () => Promise<{ modules: Module[] }>> = {
  python: () => import('./python'),
  html: () => import('./html'),
  css: () => import('./css'),
  javascript: () => import('./javascript'),
  sql: () => import('./sql'),
  typescript: () => import('./typescript'),
  react: () => import('./react'),
  'game-dev': () => import('./gamedev'),
  'python-math': () => import('./python-math'),
  'python-media': () => import('./python-media'),
  'python-numpy': () => import('./python-numpy'),
  vektor: () => import('./vektor'),
}

/** Fetched curricula, kept for the session. A course is a few dozen kilobytes
 *  and never changes while the tab is open. */
const dimuat = new Map<string, Course>()

export const courseInfo = (id: string): CourseInfo | undefined => COURSES.find((c) => c.id === id)

export function pathById(id: string): CareerPath | undefined {
  return PATHS.find((p) => p.id === id)
}

/** The curriculum for one course. Resolves from the cache when it is already
 *  here, which after a prefetch is nearly always. */
export async function loadCourse(id: string): Promise<Course | undefined> {
  const hit = dimuat.get(id)
  if (hit) return hit

  const info = courseInfo(id)
  const muat = MUAT[id]
  if (!info || !muat) return undefined

  const { modules } = await muat()
  const course: Course = { ...info, modules }
  dimuat.set(id, course)
  return course
}

export async function loadCourses(ids: string[]): Promise<Course[]> {
  const semua = await Promise.all(ids.map((id) => loadCourse(id)))
  return semua.filter((c): c is Course => Boolean(c))
}

/** Every available course. Used by the things that genuinely need all of them —
 *  the trophy grid, and working out which trophies a completion just earned. */
export async function loadAllCourses(): Promise<Course[]> {
  return loadCourses(COURSES.filter((c) => c.available).map((c) => c.id))
}

/** Already in the cache, or undefined. For render paths that would rather show
 *  what they have than wait. */
export const cachedCourse = (id: string): Course | undefined => dimuat.get(id)

/** All of them, but only if all of them are already here — so a warm page
 *  renders on its first pass instead of flashing a loading line. */
export function cachedAllCourses(): Course[] | null {
  const ada = COURSES.filter((c) => c.available)
  const punya = ada.map((c) => dimuat.get(c.id))
  return punya.every((c): c is Course => Boolean(c)) ? punya : null
}

/** Pull the whole curriculum in the background, once the app is up.
 *  Nothing waits on it; it only means that by the time a learner opens a lesson
 *  or finishes one, the chunk is already here. */
export function prefetchCourses(): void {
  void loadAllCourses()
}

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
