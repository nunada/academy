import type { Module } from '../types'
import { plainColours } from '../figure-palette'
import { module1 } from './m1-matriks'
import { module2 } from './m2-polinomial'
import { module3 } from './m3-fungsi'

export const modules: Module[] = plainColours([module1, module2, module3])
