import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'floating-point-numbers',
  slug: { en: 'floating-point-numbers', id: 'bilangan-floating-point' },
  title: {
    en: 'Floating-Point Numbers',
    id: 'Bilangan Floating-Point',
  },
  seoTitle: {
    en: 'Floating-Point Numbers: IEEE 754, Rounding and Precision',
    id: 'Bilangan Floating-Point: IEEE 754, Pembulatan, dan Ketelitian',
  },
  description: {
    en: 'How floating-point numbers work: the IEEE 754 bits, spacing and rounding, NaN and infinity, accumulated errors, cancellation, comparisons, and which type to use.',
    id: 'Cara kerja bilangan floating-point: bit IEEE 754, jarak dan pembulatan, NaN dan tak hingga, galat yang menumpuk, pembatalan, perbandingan, dan tipe yang dipakai.',
  },
  track: 'code',
  tags: ['computing', 'numeral-systems', 'python', 'javascript'],
  level: { en: 'Intermediate', id: 'Menengah' },
  keywords: {
    en: 'ieee 754, float vs double, how floats are stored, sign exponent and fraction bits, machine epsilon, ulp unit in the last place, subnormal numbers, nan and infinity, negative zero, catastrophic cancellation, kahan summation, float16 bfloat16 float32 float64, round to nearest even, floating point precision, python math isclose and math ulp',
    id: 'ieee 754, float dan double, cara float disimpan, bit tanda eksponen dan pecahan, epsilon mesin, ulp unit pada tempat terakhir, bilangan subnormal, nan dan tak hingga, nol negatif, pembatalan katastrofik, penjumlahan kahan, float16 bfloat16 float32 float64, pembulatan ke genap terdekat, ketelitian floating point, python math isclose dan math ulp',
  },
  published: '2026-10-22',
  updated: '2026-10-22',
  readingMinutes: 20,
  about: [
    { name: { en: 'IEEE 754', id: 'IEEE 754' }, sameAs: { en: 'https://en.wikipedia.org/wiki/IEEE_754', id: 'https://en.wikipedia.org/wiki/IEEE_754' } },
    { name: { en: 'NaN', id: 'NaN' }, sameAs: { en: 'https://en.wikipedia.org/wiki/NaN', id: 'https://id.wikipedia.org/wiki/NaN' } },
    { name: { en: 'Machine epsilon', id: 'Epsilon mesin' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Machine_epsilon', id: 'https://en.wikipedia.org/wiki/Machine_epsilon' } },
  ],
}
