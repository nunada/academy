import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'cube',
  slug: { en: 'cube', id: 'kubus' },
  title: {
    en: 'Cube: Faces, Nets, Volume, Diagonals and Cross-Sections',
    id: 'Kubus: Sisi, Jaring-Jaring, Volume, Diagonal, dan Irisan',
  },
  seoTitle: {
    en: 'Cube: Surface Area, Volume, Nets and Diagonals',
    id: 'Kubus: Luas Permukaan, Volume, dan Jaring-Jaring',
  },
  description: {
    en: 'The cube: 6 faces, 12 edges and 8 corners, its 11 nets, surface area, volume, diagonals, slices that give a hexagon, doubling the cube, and the cube in code.',
    id: 'Kubus: 6 sisi, 12 rusuk, 8 titik sudut, 11 jaring-jaringnya, luas permukaan, volume, diagonal, irisan segienam, menggandakan kubus, dan kubus dalam kode.',
  },
  track: 'math',
  tags: ['geometry', 'algebra', 'computing', 'python', 'javascript'],
  level: { en: 'Beginner to intermediate', id: 'Pemula sampai menengah' },
  keywords: {
    en: 'cube, how to find the volume of a cube, surface area of a cube formula, how to find the space diagonal of a cube, space diagonal of a cube formula, how many nets does a cube have, which nets fold into a cube, faces edges and vertices of a cube, cross section of a cube, regular hexagon cross section of a cube, volume of a cube when the edge doubles, sphere inside a cube, doubling the cube, cube root with newton’s method, cube numbers and the sum of cubes, dice with opposite faces adding to 7, number of positions of a rubik’s cube, corners of a cube in python, gray code walk along the edges of a cube',
    id: 'kubus, cara mencari volume kubus, rumus luas permukaan kubus, cara mencari diagonal ruang kubus, rumus diagonal ruang kubus, ada berapa jaring-jaring kubus, jaring-jaring mana yang dapat dilipat menjadi kubus, sisi rusuk dan titik sudut kubus, irisan kubus, irisan kubus berbentuk segi enam beraturan, volume kubus bila rusuk digandakan, bola di dalam kubus, menggandakan kubus, akar pangkat tiga dengan metode Newton, bilangan kubik dan jumlah kubik, dadu dengan sisi berhadapan berjumlah 7, banyak posisi kubus Rubik, titik sudut kubus di python, jalan kode Gray menyusuri rusuk kubus',
  },
  published: '2026-10-31',
  updated: '2026-11-01',
  readingMinutes: 18,
  about: [
    { name: { en: 'Cube', id: 'Kubus' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Cube', id: 'https://en.wikipedia.org/wiki/Cube' } },
    { name: { en: 'Net (polyhedron)', id: 'Jaring-jaring (bangun ruang)' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Net_(polyhedron)', id: 'https://en.wikipedia.org/wiki/Net_(polyhedron)' } },
    { name: { en: 'Platonic solid', id: 'Bangun ruang Platonik' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Platonic_solid', id: 'https://en.wikipedia.org/wiki/Platonic_solid' } },
    { name: { en: 'Doubling the cube', id: 'Menggandakan kubus' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Doubling_the_cube', id: 'https://en.wikipedia.org/wiki/Doubling_the_cube' } },
  ],
}
