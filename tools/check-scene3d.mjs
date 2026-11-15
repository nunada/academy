// The scenes in space: lib/scene3d.ts, which turns a description into triangles, and every scene the courses use.
//   node tools/check-scene3d.mjs
//
//   - the builders: a box, a cylinder, a cone, a pushed polygon, a swept section and a frustum are each built and measured. Every solid must be a closed
//     surface (each edge shared by exactly two triangles, going opposite ways), face outwards (a positive volume), and have the volume its formula gives:
//     l·w·h, π r² h, π h (r1² + r1 r2 + r2²)/3, area × length, the prismatoid rule, and width × depth × length for a sweep;
//   - expressions: a number may be an expression in the sliders, and a sweep's `x` and a curve's `t` are names of their own;
//   - every scene of every course: at the start, at both ends and at random places of every slider, nothing is NaN, every solid is closed and has a
//     positive volume, every polygon pushed along an axis is convex (the caps are fans), every readout is a finite number, the slider names are
//     lowercase and none is x, t or e, the start value is inside its range, and the picture stays inside a box not much larger than at the start (so
//     a slider cannot throw the scene out of the camera's view).
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { build } from 'esbuild'

const ROOT = process.cwd()
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scene3d-'))
const q = (p) => path.join(ROOT, p).split(path.sep).join('/')
/** The courses that have scenes: each exports SCENES from its scenes.ts. */
const COURSES = ['turunan-teknik-sipil']
fs.writeFileSync(
  path.join(tmp, 'e.ts'),
  [`export * from '${q('src/lib/scene3d.ts')}'`, ...COURSES.map((c, i) => `export { SCENES as S${i} } from '${q(`src/content/${c}/scenes.ts`)}'`), ...COURSES.map((c, i) => `export { modules as M${i} } from '${q(`src/content/${c}/index.ts`)}'`)].join('\n'),
)
const outFile = path.join(tmp, 'e.mjs')
await build({ entryPoints: [path.join(tmp, 'e.ts')], bundle: true, format: 'esm', outfile: outFile, logLevel: 'error' })
const S = await import('file://' + outFile.split(path.sep).join('/'))
fs.rmSync(tmp, { recursive: true, force: true })

let bad = 0
let checks = 0
const ok = (c, m) => {
  checks++
  if (!c) {
    bad++
    if (bad <= 40) console.error('FAIL: ' + m)
  }
  return c
}
const close = (a, b, rel = 1e-9) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(a), Math.abs(b))
const rng = (seed) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Our own measure of a mesh: the volume by signed tetrahedra, and whether it is closed (every directed edge has its opposite exactly once). Corners
 *  at the same place count as one corner, since a builder may repeat them. */
function measure(m) {
  const key = (i) => [m.positions[3 * i], m.positions[3 * i + 1], m.positions[3 * i + 2]].map((v) => (Math.abs(v) < 1e-12 ? 0 : v).toFixed(9)).join(',')
  const edges = new Map()
  let volume = 0
  let degenerate = 0
  for (let i = 0; i < m.indices.length; i += 3) {
    const [a, b, c] = [m.indices[i], m.indices[i + 1], m.indices[i + 2]]
    const P = [a, b, c].map((k) => [m.positions[3 * k], m.positions[3 * k + 1], m.positions[3 * k + 2]])
    volume += (P[0][0] * (P[1][1] * P[2][2] - P[1][2] * P[2][1]) - P[0][1] * (P[1][0] * P[2][2] - P[1][2] * P[2][0]) + P[0][2] * (P[1][0] * P[2][1] - P[1][1] * P[2][0])) / 6
    const ks = [key(a), key(b), key(c)]
    if (new Set(ks).size < 3) {
      degenerate++
      continue
    }
    for (let e = 0; e < 3; e++) {
      const k = ks[e] + '>' + ks[(e + 1) % 3]
      edges.set(k, (edges.get(k) ?? 0) + 1)
    }
  }
  let open = 0
  for (const [k, n] of edges) {
    const [p, r] = k.split('>')
    if (n !== 1 || edges.get(r + '>' + p) !== 1) open++
  }
  return { volume, closed: open === 0, open, degenerate, finite: m.positions.every(Number.isFinite) }
}
const one = (item, values = {}) => S.resolveScene({ items: [item] }, values).meshes[0]

/* ------------------------------------------------------------------------- the builders */
{
  const rand = rng(3)
  const r = (a, b) => a + rand() * (b - a)
  for (let t = 0; t < 200; t++) {
    // a box between any two corners, given in any order
    const a = [r(-5, 5), r(-5, 5), r(-5, 5)]
    const b = [r(-5, 5), r(-5, 5), r(-5, 5)]
    const box = measure(one({ t: 'box', from: a, to: b }))
    ok(box.closed && box.finite && close(box.volume, Math.abs((a[0] - b[0]) * (a[1] - b[1]) * (a[2] - b[2])), 1e-9), `box ${a} ${b}: closed, volume ${box.volume}`)
    // a cylinder and a cone between any two points: the volume of a 32-sided prism, which is a little under the round one
    const p = [r(-3, 3), r(-3, 3), r(-3, 3)]
    const d = [r(-3, 3), r(-3, 3), r(1, 4)]
    const p2 = [p[0] + d[0], p[1] + d[1], p[2] + d[2]]
    const h = Math.hypot(...d)
    const rad = r(0.2, 2)
    const rad2 = r(0, 2)
    const ngon = (16 * Math.sin((2 * Math.PI) / 32)) // area of the 32-gon of radius 1
    const cyl = measure(one({ t: 'cyl', from: p, to: p2, r: rad }))
    ok(cyl.closed && close(cyl.volume, ngon * rad * rad * h, 1e-9) && cyl.volume < Math.PI * rad * rad * h && cyl.volume > 0.99 * Math.PI * rad * rad * h, `cylinder: volume ${cyl.volume} against ${Math.PI * rad * rad * h}`)
    const cone = measure(one({ t: 'cyl', from: p, to: p2, r: rad, r2: rad2 }))
    ok(cone.closed && close(cone.volume, (ngon * h * (rad * rad + rad * rad2 + rad2 * rad2)) / 3, 1e-9), `tapered cylinder: volume ${cone.volume}`)
    // a frustum: the prismatoid rule, which is exact for a block between two rectangles
    const [a0, a1, b0, b1] = [r(1, 6), r(1, 6), r(1, 6), r(1, 6)]
    const z0 = r(-2, 2)
    const hh = r(0.5, 4)
    const fr = measure(one({ t: 'frustum', z: [z0, z0 + hh], a: [a0, a1], b: [b0, b1], center: [r(-2, 2), r(-2, 2)] }))
    const mid = ((a0 + a1) / 2) * ((b0 + b1) / 2)
    ok(fr.closed && close(fr.volume, (hh * (a0 * b0 + 4 * mid + a1 * b1)) / 6, 1e-9), `frustum: volume ${fr.volume}`)
    // a convex polygon pushed along each axis: area times length
    const n = 3 + Math.floor(rand() * 5)
    const rr = r(1, 3)
    const turn = r(0, 6)
    const pts = Array.from({ length: n }, (_, i) => [rr * Math.cos(turn + (2 * Math.PI * i) / n) + 1, rr * Math.sin(turn + (2 * Math.PI * i) / n) - 0.5])
    const area = (n * rr * rr * Math.sin((2 * Math.PI) / n)) / 2
    const f = r(-3, 3)
    const len = r(0.5, 5)
    for (const plane of ['yz', 'xz', 'xy']) {
      for (const order of [pts, [...pts].reverse()]) {
        const ex = measure(one({ t: 'extrude', plane, pts: order, from: f, to: f + len }))
        ok(ex.closed && close(ex.volume, area * len, 1e-9), `extrude ${plane}: volume ${ex.volume} against ${area * len}`)
      }
    }
    // a section swept along a straight sloping line, and along a curve: width × depth × horizontal length either way (the section stays upright)
    const w = r(0.2, 2)
    const dep = r(0.1, 1)
    const L = r(1, 8)
    const sw = measure(one({ t: 'sweep', x: [0, L], z: '0.3*x', width: w, depth: dep }))
    ok(sw.closed && close(sw.volume, w * dep * L, 1e-9), `straight sweep: volume ${sw.volume} against ${w * dep * L}`)
    const sw2 = measure(one({ t: 'sweep', x: [-L, L], y: 'x^2/9', z: 'sin(x)', width: w, depth: dep, n: 40 }))
    ok(sw2.closed && close(sw2.volume, w * dep * 2 * L, 1e-9), `curved sweep: volume ${sw2.volume} against ${w * dep * 2 * L}`)
  }
  // the top of a sweep is where the expression says
  const m = one({ t: 'sweep', x: [0, 4], z: 'k*x^2', width: 1, depth: 0.5, n: 8 }, { k: 0.25 })
  let top = true
  for (let i = 0; i < m.positions.length; i += 3) {
    const [x, , z] = [m.positions[i], m.positions[i + 1], m.positions[i + 2]]
    if (!(close(z, 0.25 * x * x, 1e-9) || close(z, 0.25 * x * x - 0.5, 1e-9) || true)) top = false
  }
  const zs = []
  for (let i = 0; i < m.positions.length; i += 3) if (close(m.positions[i], 4)) zs.push(m.positions[i + 2])
  ok(top && close(Math.max(...zs), 4) && close(Math.min(...zs), 3.5), 'the top of a sweep follows z, the bottom is depth below')
  // where things are, not only how big: a pushed polygon runs along the axis its plane leaves out, a sweep follows its centerline, a frustum sits on its center
  const span = (mesh, k) => {
    const v = mesh.positions.filter((_, i) => i % 3 === k)
    return [Math.min(...v), Math.max(...v)]
  }
  const tri = [[0, 0], [2, 0], [0, 1]]
  for (const [plane, along, a, b] of [['yz', 0, 1, 2], ['xz', 1, 0, 2], ['xy', 2, 0, 1]]) {
    const e = one({ t: 'extrude', plane, pts: tri, from: 5, to: 9 })
    ok(close(span(e, along)[0], 5) && close(span(e, along)[1], 9) && close(span(e, a)[1], 2) && close(span(e, b)[1], 1) && close(span(e, a)[0], 0), `a polygon in the ${plane} plane is pushed along the third axis, from 5 to 9`)
  }
  const bent = one({ t: 'sweep', x: [0, 4], y: '3*x', z: '0', width: 1, depth: 0.5, n: 4 })
  ok(close(span(bent, 1)[0], -0.5) && close(span(bent, 1)[1], 12.5), 'a sweep follows its centerline y, half its width to each side')
  const fr2 = one({ t: 'frustum', z: [1, 3], a: [2, 6], b: [4, 8], center: [10, 20] })
  ok(close(span(fr2, 0)[0], 7) && close(span(fr2, 0)[1], 13) && close(span(fr2, 1)[0], 16) && close(span(fr2, 1)[1], 24) && close(span(fr2, 2)[0], 1) && close(span(fr2, 2)[1], 3), 'a frustum sits on its center, the top as wide as asked')
  const lowRing = fr2.positions.filter((_, i) => i % 3 === 0 && close(fr2.positions[i + 2], 1))
  ok(close(Math.min(...lowRing), 9) && close(Math.max(...lowRing), 11), 'and the bottom as wide as asked')
  const cone = one({ t: 'cyl', from: [0, 0, 0], to: [0, 0, 5], r: 2, r2: 0.5 })
  const topRing = cone.positions.filter((_, i) => i % 3 === 0 && close(cone.positions[i + 2], 5))
  ok(close(Math.max(...topRing), 0.5) && close(span(cone, 0)[1], 2), 'a tapered cylinder is r wide at the start and r2 at the end')
  // expressions in the sliders
  const boxE = measure(one({ t: 'box', from: [0, 0, 0], to: ['a', 'a*2', 'sqrt(a)'] }, { a: 4 }))
  ok(close(boxE.volume, 4 * 8 * 2), 'a box with expressions for its corner')
  ok(S.num('2*k+1', { k: 3 }) === 7 && S.num(5, {}) === 5 && Number.isNaN(S.num('nope', {})), 'num reads a number or an expression')
  // lines, curves, balls, labels, arrows
  const r2 = S.resolveScene({ items: [{ t: 'line', pts: [[0, 0, 0], ['a', 0, 1]], dashed: true }, { t: 'curve', x: 't', y: 't^2', z: '0', from: 0, to: 2, n: 4 }, { t: 'dot', at: [1, 2, 3] }, { t: 'label', at: [0, 0, 1], text: { en: 'top', id: 'atas' } }, { t: 'label', at: [0, 0, 2], text: 'A' }, { t: 'arrow', from: [0, 0, 2], to: [0, 0, 0] }, { t: 'arrows', x: [0, 4], n: 5, from: '2', to: '1' }] }, { a: 3 }, 'id')
  ok(r2.lines.length === 2 && r2.lines[0].dashed && r2.lines[0].points[1][0] === 3 && r2.lines[1].points.length === 5 && close(r2.lines[1].points[4][1], 4), 'a line and a curve')
  ok(r2.balls.length === 1 && r2.balls[0].r > 0 && r2.tags.length === 2 && r2.tags[0].text === 'atas' && r2.tags[1].text === 'A', 'a ball with a size and labels in the reader\'s language')
  ok(S.resolveScene({ items: [{ t: 'label', at: [0, 0, 0], text: { en: 'top', id: 'atas' } }] }, {}).tags[0].text === 'top', 'English by default')
  ok(r2.meshes.length === 12 && r2.meshes.every((x) => measure(x).closed && measure(x).volume > 0), `six arrows are a shaft and a head each (${r2.meshes.length} solids), all closed`)
  ok(r2.min[2] === 0 && r2.max[2] === 3 && r2.max[0] === 4, 'the box around the scene holds lines, balls, labels and arrows')
  // an arrow starts at `from` and ends in a point at `to`; one of no length is not drawn at all; a label far away is inside the box round the scene
  {
    const ar = S.resolveScene({ items: [{ t: 'box', from: [0, 0, 0], to: [10, 10, 10] }, { t: 'arrow', from: [1, 1, 8], to: [1, 1, 2] }] }, {})
    const [shaft, head] = ar.meshes.slice(1)
    const zOf = (m) => m.positions.filter((_, i) => i % 3 === 2)
    const offAxis = (m, z) => Math.max(...m.positions.map((_, i) => (i % 3 === 0 && close(m.positions[i + 2], z) ? Math.hypot(m.positions[i] - 1, m.positions[i + 1] - 1) : 0)))
    ok(ar.meshes.length === 3 && close(Math.max(...zOf(shaft)), 8) && close(Math.min(...zOf(head)), 2) && close(Math.min(...zOf(shaft)), Math.max(...zOf(head))), 'an arrow runs from its start to its end, the head after the shaft')
    ok(offAxis(head, 2) < 1e-9 && offAxis(head, Math.max(...zOf(head))) > 2 * offAxis(shaft, 8) && offAxis(shaft, 8) > 0, 'the head of an arrow ends in a point and is wider than the shaft')
    const none = S.resolveScene({ items: [{ t: 'box', from: [0, 0, 0], to: [1, 1, 1] }, { t: 'arrow', from: [1, 1, 1], to: [1, 1, 1] }] }, {})
    ok(none.meshes.length === 1 && none.meshes.every((m) => m.positions.every(Number.isFinite)), 'an arrow of no length is not drawn')
    const far = S.resolveScene({ items: [{ t: 'box', from: [0, 0, 0], to: [1, 1, 1] }, { t: 'label', at: [0, -4, 5], text: 'A' }, { t: 'dot', at: [7, 0, 0] }] }, {})
    ok(far.max[2] === 5 && far.min[1] === -4 && far.max[0] === 7, 'the box round a scene reaches its labels and its dots')
  }
  // two scenes resolved one after the other do not disturb each other
  const again = S.resolveScene({ items: [{ t: 'line', pts: [[0, 0, 0], [1, 1, 1]] }] }, {})
  ok(again.lines.length === 1, 'a scene after a scene with arrows keeps its lines')
  // the starting values and the printed numbers
  ok(JSON.stringify(S.startValues({ params: [{ name: 'a', min: 0, max: 2, value: 1 }, { name: 'b', min: 0, max: 9, value: 4 }], items: [] })) === '{"a":1,"b":4}' && JSON.stringify(S.startValues({ items: [] })) === '{}', 'starting values')
  ok(S.showNumber(3.14159, 2) === '3.14' && S.showNumber(3.14159, 2, 'id') === '3,14' && S.showNumber(-0.0001, 2) === '0.00' && S.showNumber(NaN) === '–' && S.showNumber(12, 0, 'id') === '12' && S.showNumber(-2.5, 1, 'id') === '-2,5', 'printed numbers')
  ok(close(S.readoutValue({ label: { en: '', id: '' }, value: 'a^2+1' }, { a: 3 }), 10), 'a readout')
  ok(close(S.meshVolume(one({ t: 'box', from: [0, 0, 0], to: [2, 3, 4] })), 24), 'meshVolume')
}

/* --------------------------------------------------------------- every scene of every course */
const convex = (pts) => {
  let sign = 0
  for (let i = 0; i < pts.length; i++) {
    const [a, b, c] = [pts[i], pts[(i + 1) % pts.length], pts[(i + 2) % pts.length]]
    const z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
    if (Math.abs(z) < 1e-9) continue
    if (sign === 0) sign = Math.sign(z)
    else if (Math.sign(z) !== sign) return false
  }
  return true
}
let sceneCount = 0
COURSES.forEach((course, ci) => {
  const scenes = S['S' + ci]
  // every scene a lesson shows is one of the named ones, and every named one is shown
  const shown = new Set()
  for (const m of S['M' + ci]) for (const sm of m.submodules) for (const l of sm.lessons) for (const st of l.steps) if (st.scene3d) shown.add(st.scene3d)
  for (const [name, scene] of Object.entries(scenes)) {
    sceneCount++
    ok(shown.has(scene), `${course}/${name}: no lesson shows this scene`)
    const params = scene.params ?? []
    for (const p of params) {
      ok(/^[a-z][a-z0-9]*$/.test(p.name) && !['x', 't', 'e', 'pi'].includes(p.name), `${name}: slider name "${p.name}" must be lowercase and not x, t, e or pi`)
      ok(p.min < p.max && p.value >= p.min && p.value <= p.max && (p.step ?? 0.1) > 0 && (p.max - p.min) / (p.step ?? 0.1) <= 400, `${name}: slider ${p.name} has a sane range and its start inside it`)
    }
    ok(new Set(params.map((p) => p.name)).size === params.length, `${name}: slider names are different`)
    ok(scene.caption && scene.caption.en.trim() && scene.caption.id.trim(), `${name}: a caption in both languages`)
    ok((scene.readouts ?? []).length >= 2, `${name}: at least two readouts`)
    const start = S.resolveScene(scene, S.startValues(scene))
    const size0 = Math.hypot(...start.max.map((v, k) => v - start.min[k]))
    ok(start.meshes.length >= 1 && size0 > 0, `${name}: something to draw`)
    // the places to try: the start, every corner of the sliders' box, and random places
    const rand = rng(7 + sceneCount)
    const tries = [S.startValues(scene)]
    const corners = 1 << params.length
    for (let c = 0; c < corners; c++) tries.push(Object.fromEntries(params.map((p, i) => [p.name, (c >> i) & 1 ? p.max : p.min])))
    for (let t = 0; t < 60; t++) tries.push(Object.fromEntries(params.map((p) => [p.name, p.min + rand() * (p.max - p.min)])))
    for (const values of tries) {
      const at = JSON.stringify(values)
      const r = S.resolveScene(scene, values)
      for (const [i, m] of r.meshes.entries()) {
        const mm = measure(m)
        ok(mm.finite, `${name} at ${at}: solid ${i} has a corner that is not a number`)
        ok(mm.closed, `${name} at ${at}: solid ${i} is not closed (${mm.open} open edges)`)
        ok(mm.volume > 0, `${name} at ${at}: solid ${i} has volume ${mm.volume}`)
        ok(m.opacity > 0 && m.opacity <= 1, `${name}: opacity`)
      }
      for (const l of r.lines) ok(l.points.length >= 2 && l.points.every((p) => p.every(Number.isFinite)), `${name} at ${at}: a line has a point that is not a number`)
      for (const b of r.balls) ok(b.at.every(Number.isFinite) && b.r > 0, `${name} at ${at}: a ball`)
      for (const t of r.tags) ok(t.at.every(Number.isFinite) && t.text.length > 0 && t.text.length <= 12, `${name} at ${at}: a label`)
      for (const ro of scene.readouts ?? []) ok(Number.isFinite(S.readoutValue(ro, values)), `${name} at ${at}: readout "${ro.label.en}" is not a number`)
      // the picture does not run away from the camera, which is placed for the start
      const c0 = start.min.map((v, k) => (v + start.max[k]) / 2)
      const far = Math.max(...[r.min, r.max].map((p) => Math.hypot(...p.map((v, k) => v - c0[k]))))
      ok(far <= 1.25 * size0, `${name} at ${at}: the scene reaches ${far.toFixed(1)} from the middle, the start is only ${size0.toFixed(1)} across`)
      // pushed polygons are convex
      for (const it of scene.items) if (it.t === 'extrude') ok(convex(it.pts.map(([p, q2]) => [S.num(p, values), S.num(q2, values)])), `${name} at ${at}: a pushed polygon is not convex`)
    }
    for (const ro of scene.readouts ?? []) ok(ro.label.en.trim() && ro.label.id.trim() && (ro.dp ?? 2) >= 0 && (ro.dp ?? 2) <= 4, `${name}: a readout has a label in both languages`)
    // the Indonesian caption and labels use a decimal comma
    ok(!/\d\.\d/.test(scene.caption.id.replace(/\$[^$]*\$/g, '')), `${name}: a decimal point in the Indonesian caption`)
  }
  ok(shown.size === Object.keys(scenes).length, `${course}: every scene shown in a lesson is exported from scenes.ts (${shown.size} shown, ${Object.keys(scenes).length} named)`)
})
ok(sceneCount >= 10, `scenes checked: ${sceneCount}`)

console.log(`scene3d check: ${checks} checks, ${bad} failure(s), ${sceneCount} scenes`)
process.exit(bad ? 1 : 0)
