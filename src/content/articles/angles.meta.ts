import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'angles',
  slug: { en: 'angles', id: 'sudut' },
  title: {
    en: 'Angles: Measuring, Types, Pairs and Parallel Lines',
    id: 'Sudut: Pengukuran, Jenis, Pasangan, dan Garis Sejajar',
  },
  seoTitle: {
    en: 'Angles: Types, Degrees, Radians, Pairs and Parallel Lines',
    id: 'Sudut: Jenis, Derajat, Radian, Pasangan, dan Garis Sejajar',
  },
  description: {
    en: 'Angles explained: degrees, radians and turns, types and pairs of angles, parallel lines and transversals, polygon angles, clock angles and bearings.',
    id: 'Sudut dijelaskan: derajat, radian, dan putaran, jenis dan pasangan sudut, garis sejajar dan garis lintang, sudut segi banyak, sudut jam, dan bearing.',
  },
  track: 'math',
  tags: ['geometry', 'proof', 'computing', 'python', 'javascript'],
  level: { en: 'Beginner to intermediate', id: 'Pemula hingga menengah' },
  keywords: {
    en: 'angles, types of angles, acute right obtuse straight reflex angle, how to measure an angle with a protractor, degrees minutes seconds, convert degrees to radians, complementary and supplementary angles, vertical angles, parallel lines and a transversal, corresponding angles, alternate interior angles, interior angles of a polygon formula, exterior angles sum 360, bearing and compass direction, angle between clock hands, angle between two vectors, atan2, normalize an angle',
    id: 'sudut, jenis-jenis sudut, sudut lancip siku-siku tumpul lurus refleks, cara mengukur sudut dengan busur derajat, derajat menit detik, mengubah derajat ke radian, sudut berpenyiku dan berpelurus, sudut bertolak belakang, garis sejajar dan garis lintang, sudut sehadap, sudut dalam berseberangan, rumus sudut dalam segi banyak, jumlah sudut luar 360, bearing dan arah kompas, sudut antara jarum jam, sudut antara dua vektor, atan2, menormalkan sudut',
  },
  published: '2026-10-23',
  updated: '2026-10-23',
  readingMinutes: 21,
  about: [
    { name: { en: 'Angle', id: 'Sudut' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Angle', id: 'https://id.wikipedia.org/wiki/Sudut_(geometri)' } },
    { name: { en: 'Degree (angle)', id: 'Derajat (sudut)' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Degree_(angle)', id: 'https://id.wikipedia.org/wiki/Derajat_(sudut)' } },
    { name: { en: 'Protractor', id: 'Busur derajat' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Protractor', id: 'https://id.wikipedia.org/wiki/Busur_derajat' } },
  ],
}
