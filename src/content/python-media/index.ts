import type { Module } from '../types'
import { module1 } from './m1-generator-soal'
import { module2 } from './m2-lembar-kerja'
import { module3 } from './m3-peraga-statis'
import { module4 } from './m4-peraga-interaktif'
import { module5 } from './m5-perkakas'

export const modules: Module[] = [module1, module2, module3, module4, module5]
