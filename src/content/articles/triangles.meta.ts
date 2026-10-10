import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'triangles',
  slug: { en: 'triangles', id: 'segitiga' },
  title: {
    en: 'Triangles: Types, Angles, Area and the Pythagorean Theorem',
    id: 'Segitiga: Jenis, Sudut, Luas, dan Teorema Pythagoras',
  },
  seoTitle: {
    en: 'Triangles: Types, Angles, Area, Pythagoras',
    id: 'Segitiga: Jenis, Sudut, Luas, Pythagoras',
  },
  description: {
    en: 'Triangles explained: types by sides and angles, the 180° angle sum, the Pythagorean theorem, area and Heron\'s formula, centers, congruence and the law of sines.',
    id: 'Segitiga: jenis menurut sisi dan sudut, jumlah sudut 180°, teorema Pythagoras, luas dan rumus Heron, titik penting, kekongruenan, dan aturan sinus, dengan latihan.',
  },
  track: 'math',
  tags: ['geometry', 'fundamentals', 'proof', 'computing'],
  level: { en: 'Beginner to intermediate', id: 'Pemula hingga menengah' },
  keywords: {
    en: 'triangle, types of triangles, equilateral triangle, isosceles triangle, scalene triangle, acute triangle, right triangle, obtuse triangle, angle sum of a triangle, 180 degrees, exterior angle theorem, triangle inequality, Pythagorean theorem, Pythagorean triples, 3-4-5 triangle, 30-60-90 triangle, 45-45-90 triangle, area of a triangle, Heron formula, shoelace formula, centroid, circumcenter, orthocenter, incenter, Euler line, medians and altitudes, congruent triangles, similar triangles, SSS SAS ASA, law of sines, law of cosines, solve a triangle, ambiguous case SSA, triangle in python',
    id: 'segitiga, jenis-jenis segitiga, segitiga sama sisi, segitiga sama kaki, segitiga sembarang, segitiga lancip, segitiga siku-siku, segitiga tumpul, jumlah sudut segitiga, 180 derajat, sudut luar segitiga, ketaksamaan segitiga, teorema Pythagoras, tripel Pythagoras, segitiga 3-4-5, segitiga 30-60-90, segitiga 45-45-90, luas segitiga, rumus Heron, titik berat, pusat lingkaran luar, titik tinggi, pusat lingkaran dalam, garis Euler, garis berat dan garis tinggi, segitiga kongruen, segitiga sebangun, aturan sinus, aturan kosinus, soal cerita segitiga',
  },
  published: '2026-10-10',
  updated: '2026-10-10',
  readingMinutes: 21,
  about: [
    { name: { en: 'Triangle', id: 'Segitiga' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Triangle', id: 'https://id.wikipedia.org/wiki/Segitiga' } },
    { name: { en: 'Pythagorean theorem', id: 'Teorema Pythagoras' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Pythagorean_theorem', id: 'https://id.wikipedia.org/wiki/Teorema_Pythagoras' } },
    { name: { en: 'Equilateral triangle', id: 'Segitiga sama sisi' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Equilateral_triangle', id: 'https://id.wikipedia.org/wiki/Segitiga_sama_sisi' } },
    { name: { en: 'Right triangle', id: 'Segitiga siku-siku' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Right_triangle', id: 'https://id.wikipedia.org/wiki/Segitiga_siku-siku' } },
  ],
}
