import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'linearization-and-differentials',
  slug: { en: 'linearization-and-differentials', id: 'linearisasi-dan-diferensial' },
  title: {
    en: 'Linearization and Differentials',
    id: 'Linearisasi dan Diferensial',
  },
  seoTitle: {
    en: 'Linearization and Differentials: Formula, Examples, Error',
    id: 'Linearisasi dan Diferensial: Rumus, Contoh, Galat Hampiran',
  },
  description: {
    en: 'Linearization and differentials: the tangent-line approximation L(x) = f(a) + f′(a)(x − a), df = f′(x) dx, estimates, errors, percentage change and code.',
    id: 'Linearisasi dan diferensial: hampiran garis singgung L(x) = f(a) + f′(a)(x − a), df = f′(x) dx, perkiraan, galat, dan perubahan persen, dengan contoh dan kode.',
  },
  track: 'math',
  tags: ['calculus', 'proof', 'computing'],
  level: { en: 'Intermediate', id: 'Menengah' },
  keywords: {
    en: 'linearization, linear approximation, tangent line approximation, standard linear approximation, differentials, dy = f prime of x dx, differential of a function, estimating with differentials, approximation error, relative change, percentage change, percentage error in measurement, propagation of error, small angle approximation, one plus x to the k, Newton method as linearization, mass energy equivalence approximation, sympy linearize',
    id: 'linearisasi, hampiran linear, hampiran garis singgung, hampiran linear baku, diferensial, dy = f aksen x dx, diferensial fungsi, memperkirakan dengan diferensial, galat hampiran, perubahan relatif, perubahan persen, galat persen pengukuran, perambatan galat, hampiran sudut kecil, satu tambah x pangkat k, metode Newton sebagai linearisasi, hampiran kesetaraan massa energi, sympy linearisasi',
  },
  published: '2026-10-20',
  updated: '2026-10-20',
  readingMinutes: 17,
  about: [
    { name: { en: 'Differential of a function', id: 'Diferensial fungsi' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Differential_of_a_function', id: 'https://id.wikipedia.org/wiki/Diferensial_fungsi' } },
    { name: { en: "Newton's method", id: 'Metode Newton' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Newton%27s_method', id: 'https://id.wikipedia.org/wiki/Metode_Newton' } },
    { name: { en: 'Mass–energy equivalence', id: 'Kesetaraan massa-energi' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Mass%E2%80%93energy_equivalence', id: 'https://id.wikipedia.org/wiki/Kesetaraan_massa-energi' } },
  ],
}
