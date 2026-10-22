import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'big-o-notation',
  slug: { en: 'big-o-notation', id: 'notasi-big-o' },
  title: {
    en: 'Big-O Notation',
    id: 'Notasi Big-O',
  },
  seoTitle: {
    en: 'Big-O Notation: Time Complexity, Growth Rates and Examples',
    id: 'Notasi Big-O: Kompleksitas Waktu, Laju Pertumbuhan, dan Contoh',
  },
  description: {
    en: 'Big-O notation explained: the definition, growth rates from O(1) to O(n!), counting steps in code, best and worst case, recurrences and the Master theorem.',
    id: 'Notasi Big-O dijelaskan: definisi, laju pertumbuhan dari O(1) sampai O(n!), menghitung langkah dalam kode, kasus terbaik dan terburuk, rekurensi, dan teorema Master.',
  },
  track: 'code',
  tags: ['computing', 'proof', 'python', 'javascript'],
  level: { en: 'Intermediate', id: 'Menengah' },
  keywords: {
    en: 'big o notation, time complexity, algorithm complexity, big o cheat sheet, o(n) o(log n) o(n log n) o(n^2), how to calculate time complexity, big omega and big theta, best worst and average case, amortized analysis, space complexity, master theorem, recurrence relation divide and conquer, analysis of algorithms, why binary search is log n, complexity of merge sort',
    id: 'notasi big o, kompleksitas waktu, kompleksitas algoritma, contekan big o, o(n) o(log n) o(n log n) o(n^2), cara menghitung kompleksitas waktu, big omega dan big theta, kasus terbaik terburuk dan rata-rata, analisis teramortisasi, kompleksitas ruang, teorema master, relasi rekurensi bagi dan taklukkan, analisis algoritma, mengapa pencarian biner log n, kompleksitas merge sort',
  },
  published: '2026-10-22',
  updated: '2026-10-22',
  readingMinutes: 16,
  about: [
    { name: { en: 'Big O notation', id: 'Notasi O besar' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Big_O_notation', id: 'https://id.wikipedia.org/wiki/Notasi_O_besar' } },
    { name: { en: 'Time complexity', id: 'Kompleksitas waktu' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Time_complexity', id: 'https://id.wikipedia.org/wiki/Kompleksitas_waktu' } },
    { name: { en: 'Master theorem', id: 'Teorema master' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)', id: 'https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)' } },
  ],
}
