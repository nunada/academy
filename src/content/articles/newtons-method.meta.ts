import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'newtons-method',
  slug: { en: 'newtons-method', id: 'metode-newton' },
  title: {
    en: 'Newton’s Method',
    id: 'Metode Newton',
  },
  seoTitle: {
    en: 'Newton’s Method: Formula, Examples, Convergence and Failure',
    id: 'Metode Newton: Rumus, Contoh, Konvergensi, dan Kegagalan',
  },
  description: {
    en: 'Newton’s method for solving f(x) = 0: the formula from tangent lines, examples, quadratic convergence, when it fails, square roots by hand, and code.',
    id: 'Metode Newton untuk menyelesaikan f(x) = 0: rumus dari garis singgung, contoh, konvergensi kuadrat, kapan gagal, akar kuadrat dengan tangan, dan kode.',
  },
  track: 'math',
  tags: ['calculus', 'computing'],
  level: { en: 'Intermediate', id: 'Menengah' },
  keywords: {
    en: 'newton method, newton raphson method, how to solve f(x)=0 numerically, newton iteration formula, newton method examples, quadratic convergence, newton method fails, newton method cycle, newton method multiple roots, basin of attraction, newton method square root, babylonian method, reciprocal without division, newton method in python, bisection versus newton, root finding algorithm',
    id: 'metode newton, metode newton raphson, cara menyelesaikan f(x)=0 secara numerik, rumus iterasi newton, contoh metode newton, konvergensi kuadrat, metode newton gagal, metode newton siklus, metode newton akar ganda, daerah tarikan akar, metode newton akar kuadrat, metode babilonia, kebalikan tanpa pembagian, metode newton di python, bisection dan newton, algoritma pencarian akar',
  },
  published: '2026-10-22',
  updated: '2026-10-22',
  readingMinutes: 15,
  about: [
    { name: { en: 'Root-finding algorithm', id: 'Akar fungsi' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Root-finding_algorithm', id: 'https://id.wikipedia.org/wiki/Akar_fungsi' } },
    { name: { en: 'Rate of convergence', id: 'Laju konvergensi' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Rate_of_convergence', id: 'https://id.wikipedia.org/wiki/Laju_konvergensi' } },
    { name: { en: 'Bisection method', id: 'Metode bagi dua' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Bisection_method', id: 'https://id.wikipedia.org/wiki/Metode_bagi_dua' } },
  ],
}
