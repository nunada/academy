import type { Loc } from '../types'

/** The topics an article can be filed under. An article names them by id, so a
 *  tag is renamed here once and every article follows. */
export const TAGS: { id: string; label: Loc }[] = [
  { id: 'geometry', label: { en: 'Geometry', id: 'Geometri' } },
  { id: 'numbers', label: { en: 'Numbers', id: 'Bilangan' } },
  { id: 'algebra', label: { en: 'Algebra', id: 'Aljabar' } },
  { id: 'fundamentals', label: { en: 'Fundamentals', id: 'Dasar' } },
  { id: 'proof', label: { en: 'Proof', id: 'Pembuktian' } },
  { id: 'python', label: { en: 'Python', id: 'Python' } },
  { id: 'javascript', label: { en: 'JavaScript', id: 'JavaScript' } },
  { id: 'computing', label: { en: 'Computing', id: 'Komputasi' } },
  { id: 'numeral-systems', label: { en: 'Numeral systems', id: 'Sistem bilangan' } },
  { id: 'history', label: { en: 'History', id: 'Sejarah' } },
  { id: 'languages', label: { en: 'Languages', id: 'Bahasa' } },
]

export const tagLabel = (id: string): Loc => TAGS.find((t) => t.id === id)?.label ?? { en: id, id }
