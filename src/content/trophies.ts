import type { Loc } from './types'

export interface Trophy {
  id: string
  icon: string
  title: Loc
  desc: Loc
}

/** Static trophies. Per-module and per-course trophies are generated in
 *  `progress.ts` from the course tree so adding a module adds its trophy too. */
export const TROPHIES: Trophy[] = [
  {
    id: 'first-lesson',
    icon: '🌱',
    title: { en: 'First Steps', id: 'Langkah Pertama' },
    desc: { en: 'Finish your first lesson.', id: 'Selesaikan pelajaran pertamamu.' },
  },
  {
    id: 'first-project',
    icon: '🔨',
    title: { en: 'Builder', id: 'Perakit' },
    desc: { en: 'Finish your first mini project.', id: 'Selesaikan mini proyek pertamamu.' },
  },
  {
    id: 'xp-100',
    icon: '⚡',
    title: { en: 'Century', id: 'Seratus' },
    desc: { en: 'Earn 100 XP in total.', id: 'Kumpulkan 100 XP total.' },
  },
  {
    id: 'xp-500',
    icon: '🔥',
    title: { en: 'On Fire', id: 'Membara' },
    desc: { en: 'Earn 500 XP in total.', id: 'Kumpulkan 500 XP total.' },
  },
  {
    id: 'xp-1000',
    icon: '🚀',
    title: { en: 'Liftoff', id: 'Melesat' },
    desc: { en: 'Earn 1000 XP in total.', id: 'Kumpulkan 1000 XP total.' },
  },
  {
    id: 'week-100',
    icon: '📅',
    title: { en: 'Busy Week', id: 'Minggu Sibuk' },
    desc: { en: 'Earn 100 XP in a single week.', id: 'Kumpulkan 100 XP dalam satu minggu.' },
  },
  {
    id: 'week-300',
    icon: '🏅',
    title: { en: 'Weekly Grinder', id: 'Penggiat Mingguan' },
    desc: { en: 'Earn 300 XP in a single week.', id: 'Kumpulkan 300 XP dalam satu minggu.' },
  },
  {
    id: 'projects-5',
    icon: '🧰',
    title: { en: 'Toolmaker', id: 'Pembuat Alat' },
    desc: { en: 'Finish 5 mini projects.', id: 'Selesaikan 5 mini proyek.' },
  },
]

export function trophyById(id: string): Trophy | undefined {
  return TROPHIES.find((t) => t.id === id)
}
