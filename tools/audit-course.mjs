// Usage (from repo root): node tools/audit-course.mjs <course-dir> [--min-tasks=4]
// Audits a prep course against its scaffolding rules and prints a per-module table plus problems:
//  - every quiz / multi / judge / fill / order step has a hint
//  - every math step has 3 graduated hints, an explain and a solution
//  - every lesson has a concept step with a figure, a quiz with a figure, and a math step
//  - lessons (not practice tests) carry at least one multi or judge step in about half the lessons overall
//  - every project has >= min tasks, each with a solution
//  - quiz options: 3-4, answer in range, no option refers to another by position
//  - every `en` string is free of common Indonesian words
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = process.cwd()
const course = process.argv[2]
const minTasks = Number((process.argv.find((a) => a.startsWith('--min-tasks=')) ?? '--min-tasks=4').split('=')[1])
if (!course) { console.error('give a course dir'); process.exit(2) }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-'))
const entry = path.join(tmp, 'e.ts')
fs.writeFileSync(entry, `export { modules } from '${path.join(ROOT, 'src/content', course, 'index.ts').replace(/\\/g, '/')}'`)
const out = path.join(tmp, 'e.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: out, logLevel: 'error' })
const { modules } = await import('file://' + out.replace(/\\/g, '/'))

const ID = /\b(yang|dan|dengan|adalah|untuk|tidak|dari|pada|ini|itu|atau|sebagai|karena|maka|jika|bila|titik|garis|luas|panjang|setiap|semua|akan|bisa|dapat|lebih|oleh|saat|ketika|sudut|jarak|bilangan|hasil|rumus|nilai|bentuk|persamaan|jawaban|benar|salah|pilih|hitung|tentukan|cari|berapa|apa|mana|seperti|sehingga|namun|tetapi|sebuah|dua|tiga|satu)\b/i
const POSITIONAL = /\b(option|choice|pilihan|opsi) ([a-d]\b|pertama|kedua|ketiga|terakhir|first|second|third|last)|\b(all|none) of the above\b|semua (jawaban )?(di atas|benar)/i
const problems = []
const bad = (where, msg) => problems.push(`${where}: ${msg}`)

function prose(s) {
  return String(s).replace(/\$\$[\s\S]*?\$\$/g, ' ').replace(/\$[^$]*\$/g, ' ').replace(/`[^`]*`/g, ' ')
}
function scanLoc(v, where) {
  if (v && typeof v === 'object') {
    if (!Array.isArray(v) && typeof v.en === 'string' && typeof v.id === 'string') {
      const m = prose(v.en).match(ID)
      if (m) bad(where, `Indonesian word "${m[0]}" in en: ${prose(v.en).slice(0, 70).replace(/\n/g, ' ')}`)
      if (POSITIONAL.test(v.en) || POSITIONAL.test(v.id)) bad(where, 'refers to an option by position: ' + v.en.slice(0, 70))
      return
    }
    for (const [k, x] of Object.entries(v)) scanLoc(x, where + '/' + k)
  }
}

const rows = []
let lessons = 0, withFormat = 0
for (const m of modules) {
  const row = { module: m.id, subs: m.submodules.length, lessons: 0, projects: 0, steps: 0, multi: 0, judge: 0, quiz: 0, math: 0, fig: 0, tasks: 0 }
  for (const s of m.submodules) {
    for (const l of s.lessons) {
      lessons++
      row.lessons++
      const where = `${m.id}/${l.id}`
      const kinds = l.steps.map((x) => x.kind)
      const practice = kinds.filter((k) => k === 'concept').length <= 1 && l.steps.length >= 10
      if (!kinds.includes('math') && !practice) bad(where, 'no math step')
      if (!practice) {
        const c = l.steps.filter((x) => x.kind === 'concept')
        if (c.length < 2) bad(where, 'fewer than 2 concept steps')
        if (!c.some((x) => x.figure)) bad(where, 'no concept step with a figure')
        if (!l.steps.some((x) => x.kind === 'quiz' && x.figure)) bad(where, 'no quiz with a figure')
      }
      if (kinds.includes('multi') || kinds.includes('judge')) withFormat++
      const ids = new Set()
      for (const st of l.steps) {
        row.steps++
        if (ids.has(st.id)) bad(where, `duplicate step id ${st.id}`)
        ids.add(st.id)
        if (st.figure) row.fig++
        if (['quiz', 'multi', 'judge', 'fill', 'order'].includes(st.kind) && !st.hint) bad(`${where}/${st.id}`, `${st.kind} has no hint`)
        if (st.kind === 'quiz') {
          row.quiz++
          if (st.options.length < 3 || st.options.length > 4) bad(`${where}/${st.id}`, `quiz has ${st.options.length} options`)
          if (!(st.answer >= 0 && st.answer < st.options.length)) bad(`${where}/${st.id}`, 'quiz answer out of range')
        }
        if (st.kind === 'multi') {
          row.multi++
          if (!st.answer.length || st.answer.some((a) => a < 0 || a >= st.options.length)) bad(`${where}/${st.id}`, 'multi answer out of range')
          if (st.answer.length === st.options.length) bad(`${where}/${st.id}`, 'multi: every option is correct')
        }
        if (st.kind === 'judge') {
          row.judge++
          if (st.answer.length !== st.statements.length) bad(`${where}/${st.id}`, 'judge answer length != statements')
          if (st.answer.every(Boolean) || st.answer.every((a) => !a)) console.log(`note: ${where}/${st.id}: every statement has the same truth value (fine if deliberate)`)
        }
        if (st.kind === 'math') {
          row.math++
          if (!st.hints || st.hints.length !== 3) bad(`${where}/${st.id}`, `math has ${st.hints?.length ?? 0} hints (want 3)`)
          if (!st.solution) bad(`${where}/${st.id}`, 'math has no solution')
          if (!st.explain) bad(`${where}/${st.id}`, 'math has no explain')
        }
        scanLoc(st, `${where}/${st.id}`)
      }
    }
    row.projects++
    const p = s.project
    const pw = `${m.id}/${p.id}`
    if (p.runtime !== 'math') bad(pw, 'project is not runtime math')
    else {
      if ((p.tasks?.length ?? 0) < minTasks) bad(pw, `only ${p.tasks?.length ?? 0} tasks`)
      row.tasks += p.tasks.length
      p.tasks.forEach((t, i) => {
        if (!t.solution || !(Array.isArray(t.solution) ? t.solution.length : 1)) bad(`${pw}/task${i}`, 'task has no solution')
        if (!t.blanks?.length) bad(`${pw}/task${i}`, 'task has no blanks')
      })
      if (!p.hints?.length) bad(pw, 'project has no hints')
    }
    scanLoc(p, pw)
  }
  rows.push(row)
}
console.table(rows)
console.log(`${lessons} lessons; ${withFormat} contain a multi or judge step`)
fs.rmSync(tmp, { recursive: true, force: true })
if (problems.length) { console.log(problems.join('\n')); console.log(`${problems.length} PROBLEMS`); process.exit(1) }
console.log('audit ok')
