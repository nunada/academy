/** The curriculum, and nothing else.
 *
 *  A course's name, colour and counts live in the catalogue; this file holds the
 *  part that is fetched on demand. Keeping them apart is what lets the app show
 *  a catalogue without downloading one. */

import type { Module } from '../types'
import { module1 } from './m1-basics'
import { module2 } from './m2-decisions'
import { module3 } from './m3-loops'
import { module4 } from './m4-collections'
import { module5 } from './m5-functions'
import { module6 } from './m6-errors'
import { module7 } from './m7-files'
import { module8 } from './m8-objects'
import { module9 } from './m9-private-apis'

export const modules: Module[] = [module1, module2, module3, module4, module5, module6, module7, module8, module9]
