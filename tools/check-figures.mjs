// Usage (from repo root): node tools/check-figures.mjs <course...>
// Bundles each course's curriculum and checks every plane figure the way the
// renderer will actually read it:
//  - every curve / param / polar expression evaluates to a number somewhere in its range
//    at the sliders' starting values (an expression that is NaN everywhere draws nothing,
//    which is how an uppercase slider name or a typo fails — silently)
//  - dot / hline / vline expressions are finite at the starting values
//  - dots and points sit inside the declared frame
//  - labels carry no literal ^ or _ (labels are plain text, not math: use eˣ, x², x₀)
//  - slider names are lowercase, ranges are sane, the start value is inside the range
//  - a slider is not named t or theta when a param / polar item would shadow it
// Prints problems, exits 1 if any.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { build } from 'esbuild'

const ROOT = process.cwd()
const courses = process.argv.slice(2)
if (!courses.length) { console.error('give course dirs'); process.exit(2) }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'figcheck-'))
const q = (p) => path.join(ROOT, p).replace(/\\/g, '/')

const entry = path.join(tmp, 'entry.ts')
fs.writeFileSync(
  entry,
  [
    `export { evaluateAt } from '${q('src/lib/expr.ts')}'`,
    ...courses.map((c) => `export { modules as ${c.replace(/-/g, '_')} } from '${q(`src/content/${c}/index.ts`)}'`),
  ].join('\n'),
)
const out = path.join(tmp, 'bundle.mjs')
await build({ entryPoints: [entry], bundle: true, format: 'esm', outfile: out, logLevel: 'error' })
const mod = await import('file://' + out.replace(/\\/g, '/'))
const { evaluateAt } = mod

let bad = 0
let figures = 0
const fail = (where, msg) => { console.log(`${where}: ${msg}`); bad++ }

function checkFigure(fig, where) {
  if (fig.dim !== 2) return
  figures++
  const params = Object.fromEntries((fig.params ?? []).map((p) => [p.name, p.value]))
  const xSpan = fig.xSpan ?? [-(fig.range ?? 5), fig.range ?? 5]
  const ySpan = fig.ySpan ?? [-(fig.range ?? 5), fig.range ?? 5]
  const usesPath = fig.items.some((i) => i.t === 'param' || i.t === 'polar')

  for (const p of fig.params ?? []) {
    if (p.name !== p.name.toLowerCase()) fail(where, `slider name "${p.name}" must be lowercase`)
    if (!(p.min < p.max)) fail(where, `slider ${p.name}: min >= max`)
    if (p.value < p.min || p.value > p.max) fail(where, `slider ${p.name}: start value outside [min, max]`)
    if (p.step !== undefined && p.step <= 0) fail(where, `slider ${p.name}: step <= 0`)
    if (/[0-9]$/.test(p.name) && !p.label) fail(where, `slider ${p.name} needs a label (e.g. x₀) — the bare name shows as plain "x0"`)
    if (p.label && /[\^_]/.test(p.label)) fail(where, `slider label "${p.label}" has a literal ^ or _`)
    if (usesPath && (p.name === 't' || p.name === 'theta')) fail(where, `slider "${p.name}" is shadowed by the param/polar variable`)
  }

  const numOf = (v, vars) => (typeof v === 'number' ? v : evaluateAt(v, vars))
  const inFrame = (x, y) => x >= xSpan[0] - 1e-9 && x <= xSpan[1] + 1e-9 && y >= ySpan[0] - 1e-9 && y <= ySpan[1] + 1e-9

  fig.items.forEach((it, n) => {
    const w = `${where} item#${n}(${it.t})`
    if (it.label && /[\^_]/.test(it.label)) fail(w, `label "${it.label}" has a literal ^ or _`)
    if (it.t === 'curve') {
      const from = it.from ?? xSpan[0]
      const to = it.to ?? xSpan[1]
      let ok = 0
      for (let i = 0; i <= 40; i++) if (Number.isFinite(evaluateAt(it.f, { ...params, x: from + ((to - from) * i) / 40 }))) ok++
      if (!ok) fail(w, `curve "${it.f}" is NaN everywhere on [${from}, ${to}]`)
    } else if (it.t === 'param') {
      const from = numOf(it.from, params), to = numOf(it.to, params)
      if (!Number.isFinite(from) || !Number.isFinite(to)) { fail(w, 'from/to is not a number'); return }
      let ok = 0, inside = 0
      for (let i = 0; i <= 60; i++) {
        const t = from + ((to - from) * i) / 60
        const x = evaluateAt(it.x, { ...params, t }), y = evaluateAt(it.y, { ...params, t })
        if (Number.isFinite(x) && Number.isFinite(y)) { ok++; if (inFrame(x, y)) inside++ }
      }
      if (!ok) fail(w, `param (${it.x}, ${it.y}) is NaN everywhere`)
      else if (!inside) fail(w, `param (${it.x}, ${it.y}) never enters the frame`)
    } else if (it.t === 'polar') {
      const from = numOf(it.from, params), to = numOf(it.to, params)
      if (!Number.isFinite(from) || !Number.isFinite(to)) { fail(w, 'from/to is not a number'); return }
      let ok = 0, inside = 0
      for (let i = 0; i <= 60; i++) {
        const th = from + ((to - from) * i) / 60
        const r = evaluateAt(it.r, { ...params, theta: th })
        if (Number.isFinite(r)) { ok++; if (inFrame(r * Math.cos(th), r * Math.sin(th))) inside++ }
      }
      if (!ok) fail(w, `polar r = ${it.r} is NaN everywhere`)
      else if (!inside) fail(w, `polar r = ${it.r} never enters the frame`)
    } else if (it.t === 'dot') {
      const x = numOf(it.x, params), y = numOf(it.y, params)
      if (!Number.isFinite(x) || !Number.isFinite(y)) fail(w, `dot (${it.x}, ${it.y}) is not finite at the starting sliders`)
      else if (!inFrame(x, y)) fail(w, `dot (${x.toFixed(2)}, ${y.toFixed(2)}) is outside the frame`)
    } else if (it.t === 'hline') {
      const y = numOf(it.y, params)
      if (!Number.isFinite(y)) fail(w, 'hline y is not finite')
    } else if (it.t === 'vline') {
      const x = numOf(it.x, params)
      if (!Number.isFinite(x)) fail(w, 'vline x is not finite')
    } else if (it.t === 'text' && Array.isArray(it.at)) {
      if (!inFrame(it.at[0], it.at[1])) fail(w, `text "${it.text}" at (${it.at[0]}, ${it.at[1]}) is outside the frame`)
    } else if (it.t === 'point' && Array.isArray(it.at)) {
      if (!inFrame(it.at[0], it.at[1])) fail(w, `point (${it.at[0]}, ${it.at[1]}) is outside the frame`)
    } else if (it.t === 'seg' && Array.isArray(it.from) && Array.isArray(it.to)) {
      if (!inFrame(...it.from) && !inFrame(...it.to)) fail(w, 'segment has both ends outside the frame')
    }
  })
}

for (const c of courses) {
  const modules = mod[c.replace(/-/g, '_')]
  for (const m of modules) for (const s of m.submodules) {
    for (const l of s.lessons) for (const st of l.steps) {
      if (st.figure) checkFigure(st.figure, `${c} ${l.id}/${st.id}`)
    }
    if (s.project.runtime === 'math') {
      for (const [i, t] of s.project.tasks.entries()) if (t.figure) checkFigure(t.figure, `${c} ${s.project.id}/task${i}`)
    }
  }
}
fs.rmSync(tmp, { recursive: true, force: true })
console.log(bad ? `${bad} PROBLEMS in ${figures} plane figures` : `ok — ${figures} plane figures`)
process.exit(bad ? 1 : 0)
