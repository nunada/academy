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
    en: 'triangle, types of triangles, equilateral triangle, isosceles triangle, scalene triangle, acute triangle, right triangle, obtuse triangle, angle sum of a triangle, 180 degrees, exterior angle theorem, triangle inequality, 30-60-90 triangle, 45-45-90 triangle, area of a triangle, Heron formula, shoelace formula, centroid, circumcenter, orthocenter, incenter, Euler line, medians and altitudes, congruent triangles, similar triangles, SSS SAS ASA, law of sines, law of cosines, solve a triangle, ambiguous case SSA, triangle in python, how to find the area of a triangle from its three sides, can any three lengths form a triangle, how to tell what kind of triangle three lengths make, difference between a median and an altitude',
    id: 'segitiga, jenis-jenis segitiga, segitiga sama sisi, segitiga sama kaki, segitiga sembarang, segitiga lancip, segitiga siku-siku, segitiga tumpul, jumlah sudut segitiga, 180 derajat, sudut luar segitiga, ketaksamaan segitiga, segitiga 30-60-90, segitiga 45-45-90, luas segitiga, rumus Heron, titik berat, pusat lingkaran luar, titik tinggi, pusat lingkaran dalam, garis Euler, garis berat dan garis tinggi, segitiga kongruen, segitiga sebangun, aturan sinus, aturan kosinus, soal cerita segitiga, cara mencari luas segitiga dari ketiga sisinya, dapatkah tiga panjang sembarang membentuk segitiga, cara menentukan jenis segitiga dari tiga panjang, beda garis berat dan garis tinggi, cara mencari luas segitiga dari koordinat, mengapa sudut segitiga berjumlah 180 derajat',
  },
  published: '2026-10-10',
  updated: '2026-10-29',
  readingMinutes: 20,
  about: [
    { name: { en: 'Triangle', id: 'Segitiga' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Triangle', id: 'https://id.wikipedia.org/wiki/Segitiga' } },
    { name: { en: 'Equilateral triangle', id: 'Segitiga sama sisi' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Equilateral_triangle', id: 'https://id.wikipedia.org/wiki/Segitiga_sama_sisi' } },
    { name: { en: 'Right triangle', id: 'Segitiga siku-siku' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Right_triangle', id: 'https://id.wikipedia.org/wiki/Segitiga_siku-siku' } },
  ],
}
