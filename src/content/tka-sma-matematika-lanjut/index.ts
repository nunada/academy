import type { Module } from '../types'
import { plainColours } from '../figure-palette'
import { module1 } from './m1-matriks'
import { module2 } from './m2-polinomial'
import { module3 } from './m3-fungsi'
import { module4 } from './m4-vektor'
import { module5 } from './m5-lingkaran'
import { module6 } from './m6-transformasi'
import { module7 } from './m7-limit'

export const modules: Module[] = plainColours([module1, module2, module3, module4, module5, module6, module7])
