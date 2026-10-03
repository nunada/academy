import type { Module } from '../types'
import type { Figure } from '../../lib/figure'
import { module1 } from './m1-bilangan-cacah'
import { module2 } from './m2-faktor-kelipatan'
import { module3 } from './m3-pecahan'
import { module4 } from './m4-desimal-persen'
import { module5 } from './m5-panjang-berat-volume'
import { module6 } from './m6-waktu-kecepatan'
import { module7 } from './m7-sudut-penaksiran'
import { module8 } from './m8-bangun-datar'
import { module9 } from './m9-bangun-ruang'
import { module10 } from './m10-data'
import { module11 } from './m11-strategi-simulasi'

/** Every figure in this course is drawn in the plain-colour palette: the text
 *  says "the red dot" and "the orange bar", so the colours have to be exactly
 *  that. Done once here so no figure has to remember to ask for it. */
const kid = (f: Figure | undefined) => {
  if (f) f.palette = 'kid'
}
const raw: Module[] = [module1, module2, module3, module4, module5, module6, module7, module8, module9, module10, module11]
for (const m of raw) {
  for (const s of m.submodules) {
    for (const l of s.lessons) for (const st of l.steps) if ('figure' in st) kid(st.figure)
    if (s.project.runtime === 'math') for (const t of s.project.tasks) kid(t.figure)
  }
}

export const modules: Module[] = raw
