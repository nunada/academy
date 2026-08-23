/** The catalogue states each course's lesson and project counts so that a card
 *  can be drawn without fetching a curriculum. Those two numbers are the only
 *  facts duplicated across the lazy boundary, and a wrong one would show a
 *  learner "12 of 55" on a course with 54 items — quietly, forever.
 *
 *  This counts the real curriculum and fails on any mismatch. It also checks
 *  that every course in the catalogue can actually be loaded, and that no item
 *  id appears twice, since ids are how progress is recorded.
 *
 *  Run: npm run check:curriculum
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nunada-curriculum-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')

// Bundle the catalogue and every curriculum, then read them as data.
const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(
  entry,
  [
    `export { COURSES } from '${q('src/content/catalog.ts')}'`,
    ...['python', 'html', 'css', 'javascript', 'sql', 'typescript', 'react', 'gamedev'].map(
      (c) => `export { modules as ${c.replace('-', '')}Modules } from '${q(`src/content/${c}/index.ts`)}'`,
    ),
  ].join('\n'),
)

// esbuild's own API rather than its CLI: Windows will not spawn a .cmd shim.
const bundle = path.join(tmp, 'bundle.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: bundle, logLevel: 'error' })

const mod = await import('file://' + bundle)

/** Catalogue id -> the export holding its modules. */
const SUMBER = {
  python: 'pythonModules',
  html: 'htmlModules',
  css: 'cssModules',
  javascript: 'javascriptModules',
  sql: 'sqlModules',
  typescript: 'typescriptModules',
  react: 'reactModules',
  'game-dev': 'gamedevModules',
}

const masalah = []
const idTerpakai = new Map()

for (const info of mod.COURSES) {
  const modules = mod[SUMBER[info.id]]
  if (!modules) {
    masalah.push(`${info.id}: no curriculum is wired up for this catalogue entry`)
    continue
  }

  let pelajaran = 0
  let proyek = 0

  for (const m of modules) {
    for (const s of m.submodules) {
      for (const l of s.lessons) {
        pelajaran++
        const punya = idTerpakai.get(l.id)
        if (punya) masalah.push(`duplicate item id ${l.id} (${punya} and ${info.id})`)
        idTerpakai.set(l.id, info.id)
      }
      proyek++
      const punya = idTerpakai.get(s.project.id)
      if (punya) masalah.push(`duplicate item id ${s.project.id} (${punya} and ${info.id})`)
      idTerpakai.set(s.project.id, info.id)
    }
  }

  if (pelajaran !== info.lessons) {
    masalah.push(`${info.id}: catalogue says ${info.lessons} lessons, curriculum has ${pelajaran}`)
  }
  if (proyek !== info.projects) {
    masalah.push(`${info.id}: catalogue says ${info.projects} projects, curriculum has ${proyek}`)
  }
}

fs.rmSync(tmp, { recursive: true, force: true })

if (masalah.length) {
  console.error('curriculum check failed:\n' + masalah.map((m) => '  · ' + m).join('\n'))
  process.exit(1)
}

console.log(`curriculum check ok — ${mod.COURSES.length} courses, ${idTerpakai.size} items, counts match`)
