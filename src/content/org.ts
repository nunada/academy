/** What Nunada Academy says about itself, once, for the places that need it: the About page, the home page's structured data, the publisher
 *  of every article. A search engine builds its idea of a site (its "entity") from one consistent description repeated everywhere and tied to
 *  pages that define it, so the name, the description and the links live here and nowhere else.
 *
 *  Only what is true and public is in it. A founder, a contact address or a social profile goes into `founder`, `email` or `sameAs` when there is
 *  one to name; until then they are left out rather than invented, and the About page and the structured data skip them. */

import type { Loc } from './types'

export interface SubjectEntity {
  name: Loc
  /** The page that defines it, which is how an engine knows which "Python" or "Calculus" is meant. */
  sameAs: string
}

export const ORG = {
  name: 'Nunada Academy',
  alternateName: ['Nunada'],
  /** One sentence: what it is, for whom, in which languages. Used as the Organization description and the About page's opening answer. */
  description: {
    en: 'Nunada Academy is a learning site for mathematics and programming in English and Bahasa Indonesia, with step-by-step courses, interactive practice and free articles that need no account.',
    id: 'Nunada Academy adalah situs belajar matematika dan pemrograman dalam bahasa Inggris dan Bahasa Indonesia, dengan kursus langkah demi langkah, latihan interaktif, dan artikel gratis yang tidak memerlukan akun.',
  } as Loc,
  slogan: { en: 'Learn math and coding, step by step', id: 'Belajar matematika dan coding, langkah demi langkah' } as Loc,
  /** The logo file in `public/`, a square PNG. */
  logo: { path: 'nunada-128.png', size: 128 },
  /** Public profiles that are this organization. The code is public, so the repository counts. */
  sameAs: ['https://github.com/nunada/academy'],
  /** Where a reader reports a mistake: the repository's issue tracker is open. */
  issues: 'https://github.com/nunada/academy/issues',
  /** Left unset on purpose until there is a real person or address to name. */
  founder: undefined as { name: string; url?: string } | undefined,
  email: undefined as string | undefined,
  languages: ['en', 'id'] as const,
}

/** What the site teaches, as things an engine knows about. These tie the site to the subjects of its courses and articles. */
export const SUBJECTS: SubjectEntity[] = [
  { name: { en: 'Mathematics', id: 'Matematika' }, sameAs: 'https://en.wikipedia.org/wiki/Mathematics' },
  { name: { en: 'Algebra', id: 'Aljabar' }, sameAs: 'https://en.wikipedia.org/wiki/Algebra' },
  { name: { en: 'Geometry', id: 'Geometri' }, sameAs: 'https://en.wikipedia.org/wiki/Geometry' },
  { name: { en: 'Trigonometry', id: 'Trigonometri' }, sameAs: 'https://en.wikipedia.org/wiki/Trigonometry' },
  { name: { en: 'Calculus', id: 'Kalkulus' }, sameAs: 'https://en.wikipedia.org/wiki/Calculus' },
  { name: { en: 'Computer programming', id: 'Pemrograman komputer' }, sameAs: 'https://en.wikipedia.org/wiki/Computer_programming' },
  { name: { en: 'Python', id: 'Python' }, sameAs: 'https://en.wikipedia.org/wiki/Python_(programming_language)' },
  { name: { en: 'JavaScript', id: 'JavaScript' }, sameAs: 'https://en.wikipedia.org/wiki/JavaScript' },
  { name: { en: 'TypeScript', id: 'TypeScript' }, sameAs: 'https://en.wikipedia.org/wiki/TypeScript' },
  { name: { en: 'C++', id: 'C++' }, sameAs: 'https://en.wikipedia.org/wiki/C%2B%2B' },
  { name: { en: 'HTML', id: 'HTML' }, sameAs: 'https://en.wikipedia.org/wiki/HTML' },
  { name: { en: 'CSS', id: 'CSS' }, sameAs: 'https://en.wikipedia.org/wiki/CSS' },
  { name: { en: 'SQL', id: 'SQL' }, sameAs: 'https://en.wikipedia.org/wiki/SQL' },
  { name: { en: 'React', id: 'React' }, sameAs: 'https://en.wikipedia.org/wiki/React_(software)' },
]
