import type { Module } from '../types'
import { plainColours } from '../figure-palette'
import { module1 } from './m1-bilangan-real'
import { module2 } from './m2-persamaan-linear'
import { module3 } from './m3-fungsi'
import { module4 } from './m4-barisan-deret'

export const modules: Module[] = plainColours([module1, module2, module3, module4])
