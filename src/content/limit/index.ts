import type { Module } from '../types'
import { module1 } from './m1-ide-limit'
import { moduleDef } from './m1b-definisi-presisi'
import { module2 } from './m2-hukum-limit'
import { module3 } from './m3-limit-tak-hingga'
import { module4 } from './m4-kekontinuan'
import { module5 } from './m5-apit'

export const modules: Module[] = [module1, moduleDef, module2, module3, module4, module5]
