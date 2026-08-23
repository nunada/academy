/** The curriculum, and nothing else.
 *
 *  A course's name, colour and counts live in the catalogue; this file holds the
 *  part that is fetched on demand. Keeping them apart is what lets the app show
 *  a catalogue without downloading one. */

import type { Module } from '../types'
import { module1 } from './m1-select'
import { module2 } from './m2-groups'
import { module3 } from './m3-joins'
import { module4 } from './m4-writing'

export const modules: Module[] = [module1, module2, module3, module4]
