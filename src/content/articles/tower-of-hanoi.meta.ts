import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'tower-of-hanoi',
  slug: { en: 'tower-of-hanoi', id: 'menara-hanoi' },
  title: {
    en: 'Tower of Hanoi',
    id: 'Menara Hanoi',
  },
  seoTitle: {
    en: 'Tower of Hanoi: Recursive Solution, 2^n - 1 Moves and Code',
    id: 'Menara Hanoi: Solusi Rekursif, 2^n - 1 Langkah, dan Kode',
  },
  description: {
    en: 'The Tower of Hanoi explained: the recursive solution, why 2^n - 1 moves is optimal, the binary pattern, the Sierpinski graph and four pegs, with code.',
    id: 'Menara Hanoi dijelaskan: solusi rekursif, mengapa 2^n - 1 langkah optimal, pola biner, graf Sierpinski, dan empat tiang, lengkap dengan kode.',
  },
  track: 'code',
  tags: ['computing', 'proof', 'python', 'javascript'],
  level: { en: 'Intermediate', id: 'Menengah' },
  keywords: {
    en: 'tower of hanoi, tower of hanoi solution, tower of hanoi recursion, tower of hanoi minimum moves, tower of hanoi 2^n - 1, tower of hanoi recursive solution, tower of hanoi python, tower of hanoi iterative, tower of hanoi four pegs, frame-stewart conjecture, tower of hanoi gray code, tower of hanoi sierpinski triangle, tower of hanoi 64 discs legend, recursion example',
    id: 'menara hanoi, solusi menara hanoi, rekursi menara hanoi, langkah minimum menara hanoi, menara hanoi 2^n - 1, solusi rekursif menara hanoi, menara hanoi python, menara hanoi iteratif, menara hanoi empat tiang, dugaan frame-stewart, menara hanoi kode gray, menara hanoi segitiga sierpinski, legenda menara hanoi 64 cakram, contoh rekursi',
  },
  published: '2026-10-22',
  updated: '2026-10-22',
  readingMinutes: 20,
  about: [
    { name: { en: 'Tower of Hanoi', id: 'Menara Hanoi' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Tower_of_Hanoi', id: 'https://id.wikipedia.org/wiki/Menara_Hanoi' } },
    { name: { en: 'Recursion (computer science)', id: 'Rekursi' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Recursion_%28computer_science%29', id: 'https://id.wikipedia.org/wiki/Rekursi' } },
    { name: { en: 'Gray code', id: 'Kode Gray' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Gray_code', id: 'https://id.wikipedia.org/wiki/Kode_Gray' } },
  ],
}
