import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'triangles',
  slug: { en: 'triangles', id: 'segitiga' },
  title: {
    en: 'Triangles: Types, Angles, Area, Centers and Congruence',
    id: 'Segitiga: Jenis, Sudut, Luas, Titik Penting, dan Kekongruenan',
  },
  seoTitle: {
    en: 'Triangles: Types, Angles, Area, Centers',
    id: 'Segitiga: Jenis, Sudut, Luas, Titik Penting',
  },
  description: {
    en: 'Triangles explained: types by sides and angles, the 180° angle sum, the triangle inequality, area and Heron\'s formula, centers, congruence and the law of sines.',
    id: 'Segitiga: jenis menurut sisi dan sudut, jumlah sudut 180°, ketaksamaan segitiga, luas dan rumus Heron, titik penting, kekongruenan, dan aturan sinus, dengan latihan.',
  },
  track: 'math',
  tags: ['geometry', 'fundamentals', 'proof', 'computing'],
  level: { en: 'Beginner to intermediate', id: 'Pemula hingga menengah' },
  keywords: {
    en: 'triangle, types of triangles, equilateral triangle, isosceles triangle, scalene triangle, acute triangle, right triangle, obtuse triangle, angle sum of a triangle, 180 degrees, exterior angle theorem, triangle inequality, 30-60-90 triangle, 45-45-90 triangle, area of a triangle, Heron formula, shoelace formula, centroid, circumcenter, orthocenter, incenter, Euler line, medians and altitudes, congruent triangles, similar triangles, SSS SAS ASA, law of sines, law of cosines, solve a triangle, ambiguous case SSA, triangle in python',
    id: 'segitiga, jenis-jenis segitiga, segitiga sama sisi, segitiga sama kaki, segitiga sembarang, segitiga lancip, segitiga siku-siku, segitiga tumpul, jumlah sudut segitiga, 180 derajat, sudut luar segitiga, ketaksamaan segitiga, segitiga 30-60-90, segitiga 45-45-90, luas segitiga, rumus Heron, titik berat, pusat lingkaran luar, titik tinggi, pusat lingkaran dalam, garis Euler, garis berat dan garis tinggi, segitiga kongruen, segitiga sebangun, aturan sinus, aturan kosinus, soal cerita segitiga',
  },
  published: '2026-10-10',
  updated: '2026-10-10',
  readingMinutes: 20,
  about: [
    { name: { en: 'Triangle', id: 'Segitiga' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Triangle', id: 'https://id.wikipedia.org/wiki/Segitiga' } },
    { name: { en: 'Law of cosines', id: 'Aturan kosinus' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Law_of_cosines', id: 'https://id.wikipedia.org/wiki/Aturan_kosinus' } },
    { name: { en: 'Equilateral triangle', id: 'Segitiga sama sisi' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Equilateral_triangle', id: 'https://id.wikipedia.org/wiki/Segitiga_sama_sisi' } },
    { name: { en: 'Right triangle', id: 'Segitiga siku-siku' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Right_triangle', id: 'https://id.wikipedia.org/wiki/Segitiga_siku-siku' } },
  ],
}
