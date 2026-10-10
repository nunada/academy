import type { ArticleMeta } from './types'

export const meta: ArticleMeta = {
  id: 'binary-numbers',
  slug: { en: 'binary-numbers', id: 'bilangan-biner' },
  title: {
    en: 'Binary Numbers: How Computers Count, Convert and Calculate',
    id: 'Bilangan Biner: Konversi, Operasi, Bit, dan Komplemen Dua',
  },
  seoTitle: {
    en: 'Binary Numbers: Convert, Add, Two’s Complement',
    id: 'Bilangan Biner: Konversi dan Komplemen Dua',
  },
  description: {
    en: 'Binary numbers explained: bits and place value, converting to decimal and hex, binary arithmetic, two’s complement, bitwise operators and binary fractions.',
    id: 'Bilangan biner: bit dan nilai tempat, konversi ke desimal dan heksadesimal, aritmetika biner, komplemen dua, operator bitwise, dan pecahan biner.',
  },
  track: 'code',
  tags: ['computing', 'numeral-systems', 'fundamentals', 'python', 'javascript'],
  level: { en: 'Beginner to intermediate', id: 'Pemula hingga menengah' },
  keywords: {
    en: 'binary numbers, what is binary, how to convert binary to decimal, decimal to binary, binary addition, binary subtraction, binary multiplication, bits and bytes, hexadecimal, octal, base 2, base 16, place value, two’s complement, negative numbers in binary, signed and unsigned integers, integer overflow, bitwise operators, AND OR XOR NOT, bit shift, bit mask, ASCII, kibibyte, KiB vs KB, binary fractions, 0.1 in binary, floating point IEEE 754, python bin, int base 2, javascript toString(2)',
    id: 'bilangan biner, apa itu biner, cara mengubah biner ke desimal, desimal ke biner, penjumlahan biner, pengurangan biner, perkalian biner, bit dan byte, heksadesimal, oktal, basis 2, basis 16, nilai tempat, komplemen dua, bilangan negatif dalam biner, bilangan bulat bertanda dan tanpa tanda, overflow, operator bitwise, AND OR XOR NOT, geser bit, topeng bit, ASCII, kibibyte, KiB dan KB, pecahan biner, 0,1 dalam biner, floating point IEEE 754, python bin, int basis 2, javascript toString(2)',
  },
  published: '2026-10-10',
  updated: '2026-10-10',
  readingMinutes: 19,
  about: [
    { name: { en: 'Binary number', id: 'Bilangan biner' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Binary_number', id: 'https://id.wikipedia.org/wiki/Sistem_bilangan_biner' } },
    { name: { en: 'Two’s complement', id: 'Komplemen dua' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Two%27s_complement', id: 'https://en.wikipedia.org/wiki/Two%27s_complement' } },
    { name: { en: 'Hexadecimal', id: 'Heksadesimal' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Hexadecimal', id: 'https://id.wikipedia.org/wiki/Sistem_bilangan_heksadesimal' } },
    { name: { en: 'Bit', id: 'Bit' }, sameAs: { en: 'https://en.wikipedia.org/wiki/Bit', id: 'https://id.wikipedia.org/wiki/Bit' } },
  ],
}
