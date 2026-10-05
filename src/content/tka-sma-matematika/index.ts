import type { Module } from '../types'
import { plainColours } from '../figure-palette'
import { module1 } from './m1-bilangan-real'
import { module2 } from './m2-persamaan-linear'
import { module3 } from './m3-fungsi'
import { module4 } from './m4-barisan-deret'
import { module5 } from './m5-objek-geometri'
import { module6 } from './m6-transformasi'
import { module7 } from './m7-pengukuran'
import { module8 } from './m8-trigonometri'
import { module9 } from './m9-data-peluang'

export const modules: Module[] = plainColours([module1, module2, module3, module4, module5, module6, module7, module8, module9])
