/** Drawing a `Scene3D`: the triangles, lines, balls and labels `lib/scene3d.ts` works out, lit and turned with an orbit control, with the scene's
 *  sliders and readouts underneath.
 *
 *  Like `Solid3DView.tsx`, this file imports `three` and is only ever reached through a `lazy(() => import(...))`, so a lesson without a scene never
 *  pays for it. The scene itself is rebuilt from the description whenever a slider moves: a few hundred triangles, which costs nothing, and it keeps
 *  the picture the statement itself rather than a second copy of it.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { readoutValue, resolveScene, showNumber, startValues, type Scene3D, type SceneColor, type V3 } from '../lib/scene3d'
import { useI18n } from '../i18n'
import { useTheme } from '../lib/theme'
import { Rich } from './ui'

/** Materials look the same in the light and the dark theme: water is blue either way. */
const MATERIAL: Partial<Record<SceneColor, string>> = {
  water: '#3b8fd0',
  wood: '#c08a4f',
  concrete: '#b9b6ad',
  steel: '#7d8a96',
  earth: '#9a7b56',
  road: '#8b9198',
  grass: '#6da35e',
}

const cssColor = (name: string, fallback: string): THREE.Color => {
  const css = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return new THREE.Color(css || fallback)
}

/** The color of a surface. A figure role is lightened in HSL first (see `Solid3DView.tsx` for why a lerp toward white will not do). */
function surfaceColor(role: SceneColor): THREE.Color {
  const fixed = MATERIAL[role]
  if (fixed) return new THREE.Color(fixed)
  const color = cssColor(`--fig-${role}`, '#4f8b56')
  const hsl = { h: 0, s: 0, l: 0 }
  color.getHSL(hsl)
  color.setHSL(hsl.h, hsl.s, Math.min(0.9, hsl.l + 0.18))
  return color
}
/** The color of a line or an arrow: the role as it is, since a thin stroke wants it saturated. */
const strokeColor = (role: SceneColor): THREE.Color => (MATERIAL[role] ? new THREE.Color(MATERIAL[role]) : cssColor(`--fig-${role}`, '#4f8b56'))

/** The engineer's axes (x right, y back, z up) in Three's (x right, y up, z towards the viewer). */
const place = (p: V3): [number, number, number] => [p[0], p[2], -p[1]]

/** A short text as a sprite that always faces the camera. */
function tagSprite(text: string, color: string, size: number): THREE.Sprite {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const font = '600 56px system-ui, -apple-system, "Segoe UI", sans-serif'
  ctx.font = font
  const w = Math.ceil(ctx.measureText(text).width) + 24
  canvas.width = w
  canvas.height = 80
  const c2 = canvas.getContext('2d')!
  c2.font = font
  c2.textBaseline = 'middle'
  c2.textAlign = 'center'
  c2.fillStyle = color
  c2.fillText(text, w / 2, 42)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true }))
  const h = size * 0.075
  sprite.scale.set((h * w) / 80, h, 1)
  sprite.renderOrder = 10
  return sprite
}

function disposeGroup(group: THREE.Group) {
  group.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.geometry) m.geometry.dispose()
    const mat = m.material as THREE.Material | THREE.Material[] | undefined
    for (const one of Array.isArray(mat) ? mat : mat ? [mat] : []) {
      const map = (one as THREE.SpriteMaterial).map
      if (map) map.dispose()
      one.dispose()
    }
  })
  group.clear()
}

export function Scene3DView({ scene }: { scene: Scene3D }) {
  const { tc, lang } = useI18n()
  const theme = useTheme()
  const mountRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<string, number>>(() => startValues(scene))
  const [failed, setFailed] = useState(false)
  const ctx = useRef<{ group: THREE.Group; camera: THREE.PerspectiveCamera; controls: OrbitControls; home: () => void; turn: (deg: number) => void } | null>(null)

  // what the scene looks like at the start: the camera is placed for this, and stays there while a slider moves
  const first = useMemo(() => resolveScene(scene, startValues(scene), 'en'), [scene])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const world = new THREE.Scene()
    const center = new THREE.Vector3(...place([(first.min[0] + first.max[0]) / 2, (first.min[1] + first.max[1]) / 2, (first.min[2] + first.max[2]) / 2]))
    const size = Math.hypot(first.max[0] - first.min[0], first.max[1] - first.min[1], first.max[2] - first.min[2]) || 1
    const camera = new THREE.PerspectiveCamera(38, 1, size / 200, size * 40)

    world.add(new THREE.AmbientLight(0xffffff, 0.62))
    const sun = new THREE.DirectionalLight(0xffffff, 1.0)
    sun.position.set(size, size * 1.6, size * 1.1)
    world.add(sun)
    const fill = new THREE.DirectionalLight(0xffffff, 0.3)
    fill.position.set(-size, size * 0.4, -size * 0.7)
    world.add(fill)

    const group = new THREE.Group()
    world.add(group)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.copy(center)
    const [az, el] = scene.view ?? [28, 22]
    const home = () => {
      const a = (az * Math.PI) / 180
      const e = (el * Math.PI) / 180
      // looking from the front (the -y side), turned `az` towards +x and raised `el`
      const dir = new THREE.Vector3(...place([Math.sin(a) * Math.cos(e), -Math.cos(a) * Math.cos(e), Math.sin(e)])).normalize()
      // far enough for every corner of the scene's box to be inside the picture, and no farther: a long thin beam and a squat log both fill the frame
      const right = new THREE.Vector3(0, 1, 0).cross(dir).normalize()
      const up = dir.clone().cross(right).normalize()
      const tanV = Math.tan((camera.fov * Math.PI) / 360)
      const aspect = mount.clientWidth > 0 && mount.clientHeight > 0 ? mount.clientWidth / mount.clientHeight : 1.4
      let dist = 0
      for (const x of [first.min[0], first.max[0]])
        for (const y of [first.min[1], first.max[1]])
          for (const z of [first.min[2], first.max[2]]) {
            const v = new THREE.Vector3(...place([x, y, z])).sub(center)
            const depth = v.dot(dir)
            dist = Math.max(dist, depth + Math.abs(v.dot(up)) / tanV, depth + Math.abs(v.dot(right)) / (tanV * aspect))
          }
      camera.position.copy(center).addScaledVector(dir, dist * 1.1)
      controls.target.copy(center)
      camera.lookAt(center)
      controls.update()
    }
    const turn = (deg: number) => {
      const offset = camera.position.clone().sub(controls.target)
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), (deg * Math.PI) / 180)
      camera.position.copy(controls.target).add(offset)
      controls.update()
    }
    home()

    const resize = new ResizeObserver(() => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    resize.observe(mount)

    let frame = 0
    const tick = () => {
      controls.update()
      renderer.render(world, camera)
      frame = requestAnimationFrame(tick)
    }
    tick()
    ctx.current = { group, camera, controls, home, turn }

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      controls.dispose()
      disposeGroup(group)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
      ctx.current = null
    }
  }, [scene, first, theme])

  // the things themselves, rebuilt whenever a slider moves (or the theme or the language changes)
  useEffect(() => {
    const c = ctx.current
    if (!c) return
    disposeGroup(c.group)
    const r = resolveScene(scene, values, lang)
    const size = Math.hypot(first.max[0] - first.min[0], first.max[1] - first.min[1], first.max[2] - first.min[2]) || 1
    const edge = cssColor('--text', '#24463d')

    for (const m of r.meshes) {
      const positions = new Float32Array(m.positions.length)
      for (let i = 0; i < m.positions.length; i += 3) {
        const [x, y, z] = place([m.positions[i], m.positions[i + 1], m.positions[i + 2]])
        positions[i] = x
        positions[i + 1] = y
        positions[i + 2] = z
      }
      let geometry: THREE.BufferGeometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setIndex(m.indices)
      if (!m.smooth) {
        const flat = geometry.toNonIndexed()
        geometry.dispose()
        geometry = flat
      }
      geometry.computeVertexNormals()
      const see = m.opacity < 1
      const material = new THREE.MeshStandardMaterial({ color: surfaceColor(m.color), metalness: 0, roughness: 0.85, side: THREE.DoubleSide, transparent: see, opacity: m.opacity, depthWrite: !see, polygonOffset: see, polygonOffsetFactor: -2, polygonOffsetUnits: -2 })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.renderOrder = see ? 2 : 0
      c.group.add(mesh)
      if (!m.smooth) {
        const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 25), new THREE.LineBasicMaterial({ color: edge, transparent: true, opacity: see ? 0.3 : 0.45 }))
        lines.renderOrder = see ? 3 : 1
        c.group.add(lines)
      }
    }
    for (const l of r.lines) {
      const pts = l.points.filter((p) => p.every(Number.isFinite)).map((p) => new THREE.Vector3(...place(p)))
      if (pts.length < 2) continue
      const geometry = new THREE.BufferGeometry().setFromPoints(pts)
      const color = strokeColor(l.color)
      const line = new THREE.Line(geometry, l.dashed ? new THREE.LineDashedMaterial({ color, dashSize: size * 0.02, gapSize: size * 0.015 }) : new THREE.LineBasicMaterial({ color }))
      if (l.dashed) line.computeLineDistances()
      line.renderOrder = 4
      c.group.add(line)
    }
    for (const b of r.balls) {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(b.r, 20, 14), new THREE.MeshStandardMaterial({ color: strokeColor(b.color), roughness: 0.6 }))
      ball.position.set(...place(b.at))
      ball.renderOrder = 5
      c.group.add(ball)
    }
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#24463d'
    for (const t of r.tags) {
      const sprite = tagSprite(t.text, ink, size)
      sprite.position.set(...place(t.at))
      c.group.add(sprite)
    }
  }, [scene, values, lang, theme, first])

  const params = scene.params ?? []
  const caption = scene.caption ? tc(scene.caption) : ''
  const unitText = (u: string | { en: string; id: string } | undefined): string => (u === undefined ? '' : typeof u === 'string' ? u : tc(u))
  const stepOf = (s: number | undefined): number => s ?? 0.1
  const places = (s: number | undefined): number => {
    const t = String(stepOf(s))
    return t.includes('.') ? t.split('.')[1].length : 0
  }

  return (
    <figure className="fig">
      <div ref={mountRef} className="fig3d scene3d" style={{ height: scene.height ?? 360 }} role="img" aria-label={caption || tc({ en: 'A scene in space', id: 'Sebuah adegan dalam ruang' })}>
        {failed && <p className="small muted" style={{ padding: 16 }}>{tc({ en: 'This browser cannot draw the 3D picture. The numbers below still follow the sliders.', id: 'Browser ini tidak dapat menggambar adegan 3D. Angka di bawah tetap mengikuti penggeser.' })}</p>}
      </div>

      {params.length > 0 && (
        <div className="figsliders">
          {params.map((p) => (
            <label className="figslider" key={p.name}>
              <span>
                <i>{p.label ?? p.name}</i> = {showNumber(values[p.name], places(p.step), lang)}
              </span>
              <input type="range" min={p.min} max={p.max} step={stepOf(p.step)} value={values[p.name]} aria-label={p.label ?? p.name} onChange={(e) => setValues((v) => ({ ...v, [p.name]: Number(e.target.value) }))} />
            </label>
          ))}
        </div>
      )}

      {scene.readouts && scene.readouts.length > 0 && (
        <div className="figreadout" aria-live="polite">
          {scene.readouts.map((r, i) => (
            <span key={i}>
              <i>{tc(r.label)}</i> = {showNumber(readoutValue(r, values), r.dp ?? 2, lang)}
              {r.unit ? ` ${unitText(r.unit)}` : ''}
            </span>
          ))}
        </div>
      )}

      <figcaption>
        {caption && <Rich text={caption} />}{' '}
        <span className="figtip">{tc({ en: 'Drag to rotate. Scroll to zoom.', id: 'Seret untuk memutar. Gulir untuk memperbesar.' })}</span>{' '}
        <button className="btn ghost sm" onClick={() => ctx.current?.turn(-30)} aria-label={tc({ en: 'Turn the scene to the left', id: 'Putar adegan ke kiri' })}>
          ⟲
        </button>{' '}
        <button className="btn ghost sm" onClick={() => ctx.current?.turn(30)} aria-label={tc({ en: 'Turn the scene to the right', id: 'Putar adegan ke kanan' })}>
          ⟳
        </button>{' '}
        <button
          className="btn ghost sm"
          onClick={() => {
            setValues(startValues(scene))
            ctx.current?.home()
          }}
        >
          {tc({ en: 'Reset', id: 'Setel ulang' })}
        </button>
      </figcaption>
    </figure>
  )
}
