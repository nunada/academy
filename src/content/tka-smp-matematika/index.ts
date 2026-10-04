import type { Module } from '../types'
import { plainColours } from '../figure-palette'
import { module1 } from './m1-bilangan-bulat-rasional'
import { module2 } from './m2-faktorisasi-estimasi-perbandingan'
import { module3 } from './m3-aljabar-persamaan'
import { module4 } from './m4-relasi-fungsi-barisan'
import { module5 } from './m5-sudut-pythagoras-sebangun'
import { module6 } from './m6-transformasi-luas-volume'
import { module7 } from './m7-data-peluang'
import { module8 } from './m8-strategi-simulasi'

export const modules: Module[] = plainColours([module1, module2, module3, module4, module5, module6, module7, module8])
