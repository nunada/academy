import type { Module } from '../types'
import { module1 } from './m1-barisan-deret-tak-hingga'
import { module2 } from './m2-uji-integral-perbandingan'
import { module3 } from './m3-konvergensi-mutlak-berselang'
import { module4 } from './m4-deret-pangkat-taylor'
import { module5 } from './m5-konvergensi-aplikasi-taylor'

export const modules: Module[] = [module1, module2, module3, module4, module5]
