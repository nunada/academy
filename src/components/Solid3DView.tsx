/** Drawing a `Solid3D`: a lathe geometry built from `buildProfile`, lit,
 *  coloured from the same `--fig-*` roles `Figure.tsx` draws with, and
 *  turned with an orbit control rather than the plane figures' own
 *  hand-rolled drag — a real camera earns a real one.
 *
 *  This is the one file in the app that imports `three`. It is only ever
 *  reached through `StepView.tsx`'s `lazy(() => import('./Solid3DView'))`,
 *  so a lesson that never shows a solid never pays for it.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildProfile, type Solid3D } from '../lib/solid3d'
import { useI18n } from '../i18n'
import { Rich } from './ui'

const figColor = (role: Solid3D['color']): THREE.Color => {
  const css = getComputedStyle(document.documentElement).getPropertyValue(`--fig-${role ?? 'result'}`).trim()
  return new THREE.Color(css || '#4f8b56')
}

const lathe = (profile: [number, number][], sweepDeg: number): THREE.LatheGeometry => {
  const points = profile.map(([r, h]) => new THREE.Vector2(r, h))
  const geometry = new THREE.LatheGeometry(points, 48, 0, (sweepDeg * Math.PI) / 180)
  geometry.computeVertexNormals()
  return geometry
}

/** A lathe only ever generates the swept *skin* — cutting away a wedge (any
 *  `sweep` under 360°) leaves the two straight edges of that wedge with no
 *  geometry at all. Doubled-sided material makes that opening render, but
 *  without a face filling it there is nothing to distinguish "an open cut
 *  through solid material" from "the shape is hollow here" — exactly the
 *  wall a washer's thin, self-touching profile makes worst, since the
 *  camera then looks straight through open skin to more open skin. A flat
 *  polygon dropped in at each cut, shaped like the profile itself, is what
 *  a real cut face would look like: solid, and colored distinctly enough
 *  from the outer skin to read as "this is the inside", the way a diagram
 *  in a textbook shades a cross-section. */
const cap = (profile: [number, number][], phiRad: number): THREE.BufferGeometry => {
  const shape = new THREE.Shape(profile.map(([r, h]) => new THREE.Vector2(r, h)))
  const geometry = new THREE.ShapeGeometry(shape)
  const pos = geometry.attributes.position
  const cos = Math.cos(phiRad)
  const sin = Math.sin(phiRad)
  for (let i = 0; i < pos.count; i++) {
    const r = pos.getX(i)
    const h = pos.getY(i)
    pos.setXYZ(i, r * cos, h, r * sin)
  }
  pos.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

const FULL_SWEEP_EPS = 0.5 // degrees — near enough to 360° that no cut is showing

/** The cap's own material: a pale tint of the solid's colour, flat rather
 *  than glossy, so a cut face reads as freshly-sliced material rather than
 *  as more of the same lit, curved skin. */
const capMaterial = (base: THREE.Color): THREE.MeshStandardMaterial =>
  new THREE.MeshStandardMaterial({
    color: base.clone().lerp(new THREE.Color('#ffffff'), 0.6),
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide,
  })

export function Solid3DView({ solid }: { solid: Solid3D }) {
  const { tc } = useI18n()
  const mountRef = useRef<HTMLDivElement>(null)
  const [sweep, setSweep] = useState(solid.sweep ?? 270)

  // The profile only depends on the solid's own data, never on `sweep` —
  // re-revolving it at a different angle doesn't need new sample points.
  const profile = useMemo(() => buildProfile(solid), [solid])

  const three = useRef<{
    camera: THREE.PerspectiveCamera
    controls: OrbitControls
    mesh: THREE.Mesh
    cap1: THREE.Mesh
    cap2: THREE.Mesh
  } | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    const heights = profile.map((p) => p[1])
    const minH = Math.min(...heights)
    const maxH = Math.max(...heights)
    const radius = Math.max(...profile.map((p) => p[0]), 1)
    const span = maxH - minH || 1
    const dist = Math.max(radius, span) * 2.4
    camera.position.set(dist * 0.7, dist * 0.5, dist * 0.7)

    // preserveDrawingBuffer: a plain <canvas> screenshot (this app's own
    // export tools, a browser's page-capture) reads the buffer between
    // frames — WebGL clears it right after presenting by default, so
    // without this the canvas can appear blank to anything but its own
    // render loop.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // A lower ambient share than a flat 0.6 leaves real light-to-shadow
    // falloff across the curved skin — with ambient doing most of the work,
    // a solid colour reads as a flat cutout instead of a rounded surface.
    // The key light carries the shading; a dim, cool-toned fill from the
    // opposite side keeps its own shadow side from going fully black
    // without erasing the contrast the key light is there to provide.
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const sun = new THREE.DirectionalLight(0xffffff, 1.3)
    sun.position.set(dist, dist * 1.4, dist)
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.35)
    fill.position.set(-dist, dist * 0.3, -dist * 0.6)
    scene.add(fill)

    const material = new THREE.MeshStandardMaterial({
      color: figColor(solid.color),
      metalness: 0.05,
      roughness: 0.55,
      side: THREE.DoubleSide,
    })
    // Built here, synchronously, in the same effect that creates the mesh —
    // not in a second effect keyed on `sweep`. Two effects sharing state
    // through a ref both look correct in isolation, but React's Strict Mode
    // double-invokes effects on mount (setup → cleanup → setup again) to
    // catch exactly this: the geometry effect can run against the first,
    // already-torn-down scene, leaving the live one with an empty
    // placeholder geometry forever. Building it inline has no such gap.
    const mesh = new THREE.Mesh(lathe(profile, sweep), material)

    // A lathe under 360° is only ever the swept skin — the two straight
    // edges where the wedge was cut away have no geometry of their own.
    // These fill that opening with the profile's own flat shape, so a
    // partial reveal reads as a clean cut through solid material rather
    // than as a peek into a hollow shell.
    const capMat = capMaterial(figColor(solid.color))
    const cap1 = new THREE.Mesh(cap(profile, 0), capMat)
    const cap2 = new THREE.Mesh(cap(profile, (sweep * Math.PI) / 180), capMat)
    const capsShow = sweep < 360 - FULL_SWEEP_EPS
    cap1.visible = capsShow
    cap2.visible = capsShow

    const group = new THREE.Group()
    group.add(mesh, cap1, cap2)
    // A lathe's own axis is vertical (Y). `axis: 'x'` lays it on its side —
    // height running left-right — to match a disk/washer lesson's own
    // horizontal integration variable; `axis: 'y'` leaves it upright.
    if (solid.axis === 'x') group.rotation.z = -Math.PI / 2
    scene.add(group)

    const controls = new OrbitControls(camera, renderer.domElement)
    const mid = minH + span / 2
    controls.target.set(solid.axis === 'x' ? mid : 0, solid.axis === 'x' ? 0 : mid, 0)
    controls.enableDamping = true
    camera.lookAt(controls.target)

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
      renderer.render(scene, camera)
      frame = requestAnimationFrame(tick)
    }
    tick()

    three.current = { camera, controls, mesh, cap1, cap2 }

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      controls.dispose()
      mesh.geometry.dispose()
      material.dispose()
      cap1.geometry.dispose()
      cap2.geometry.dispose()
      capMat.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
      three.current = null
    }
    // `sweep`'s current value is read at setup time on purpose — its own
    // changes are handled below, without tearing down the whole scene.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solid, profile])

  // A user-driven sweep change, after the scene above already exists —
  // swap the geometry in place rather than rebuilding the whole scene.
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const ctx = three.current
    if (!ctx) return
    const geometry = lathe(profile, sweep)
    ctx.mesh.geometry.dispose()
    ctx.mesh.geometry = geometry

    // cap1 stays put at phi=0; only cap2 (the moving edge of the wedge)
    // needs a new shape, and both hide the instant the cut closes up.
    const cap2Geometry = cap(profile, (sweep * Math.PI) / 180)
    ctx.cap2.geometry.dispose()
    ctx.cap2.geometry = cap2Geometry
    const capsShow = sweep < 360 - FULL_SWEEP_EPS
    ctx.cap1.visible = capsShow
    ctx.cap2.visible = capsShow
  }, [sweep, profile])

  const reset = () => setSweep(solid.sweep ?? 270)

  return (
    <figure className="fig">
      <div ref={mountRef} className="fig3d" style={{ height: solid.height ?? 380 }} role="img" aria-label={solid.caption ? tc(solid.caption) : undefined} />

      <div className="figsliders">
        <label className="figslider">
          <span>
            <i>{tc({ en: 'reveal', id: 'bukaan' })}</i> = {Math.round(sweep)}°
          </span>
          <input type="range" min={20} max={360} step={5} value={sweep} onChange={(e) => setSweep(Number(e.target.value))} />
        </label>
      </div>

      <figcaption>
        {solid.caption && <Rich text={tc(solid.caption)} />}{' '}
        <span className="figtip">{tc({ en: 'Drag to rotate. Scroll to zoom.', id: 'Seret untuk memutar. Gulir untuk memperbesar.' })}</span>{' '}
        <button className="btn ghost sm" onClick={reset}>
          {tc({ en: 'Reset', id: 'Setel ulang' })}
        </button>
      </figcaption>
    </figure>
  )
}
