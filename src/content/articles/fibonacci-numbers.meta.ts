import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'fibonacci-numbers',
  slug: { en: 'fibonacci-numbers', id: 'bilangan-fibonacci' },
  title: {
    en: 'Fibonacci Numbers',
    id: 'Bilangan Fibonacci',
  },
  seoTitle: {
    en: 'Fibonacci Numbers: Formula, Identities, Fast Computing, Code',
    id: 'Bilangan Fibonacci: Rumus, Identitas, Hitung Cepat, dan Kode',
  },
  description: {
    en: 'Fibonacci numbers explained: the recurrence, Binet\'s formula, identities, fast doubling, Zeckendorf sums, Pisano periods and the golden ratio, with code.',
    id: 'Bilangan Fibonacci dijelaskan: rekurensi, rumus Binet, identitas, penggandaan cepat, jumlah Zeckendorf, periode Pisano, dan rasio emas, lengkap dengan kode.',
  },
  track: 'math',
  tags: ['numbers', 'proof', 'computing', 'python', 'javascript'],
  level: { en: 'Intermediate', id: 'Menengah' },
  keywords: {
    en: 'fibonacci numbers, fibonacci sequence, fibonacci formula, binet formula, nth fibonacci number, fibonacci in python, fast doubling fibonacci, matrix exponentiation fibonacci, cassini identity, zeckendorf theorem, pisano period, fibonacci mod m, climbing stairs fibonacci, fibonacci in nature, fibonacci spiral, fibonacci and euclid algorithm, lucas numbers',
    id: 'bilangan fibonacci, barisan fibonacci, rumus fibonacci, rumus binet, suku ke-n fibonacci, fibonacci di python, penggandaan cepat fibonacci, perpangkatan matriks fibonacci, identitas cassini, teorema zeckendorf, periode pisano, fibonacci mod m, menaiki tangga fibonacci, fibonacci di alam, spiral fibonacci, fibonacci dan algoritma euclid, bilangan lucas',
  },
  published: '2026-10-22',
  updated: '2026-10-22',
  readingMinutes: 20,
  about: [
    { name: { en: 'Fibonacci sequence', id: 'Bilangan Fibonacci' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Fibonacci_sequence', id: 'https://id.wikipedia.org/wiki/Bilangan_Fibonacci' } },
    { name: { en: 'Zeckendorf\'s theorem', id: 'Teorema Zeckendorf' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Zeckendorf%27s_theorem', id: 'https://en.wikipedia.org/wiki/Zeckendorf%27s_theorem' } },
    { name: { en: 'Pisano period', id: 'Periode Pisano' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Pisano_period', id: 'https://en.wikipedia.org/wiki/Pisano_period' } },
  ],
}
