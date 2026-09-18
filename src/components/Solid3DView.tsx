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

export function Solid3DView({ solid }: { solid: Solid3D }) {
  const { tc } = useI18n()
  const mountRef = useRef<HTMLDivElement>(null)
  const [sweep, setSweep] = useState(solid.sweep ?? 270)

  // The profile only depends on the solid's own data, never on `sweep` —
  // re-revolving it at a different angle doesn't need new sample points.
  const profile = useMemo(() => buildProfile(solid), [solid])

  const three = useRef<{ camera: THREE.PerspectiveCamera; controls: OrbitControls; mesh: THREE.Mesh } | null>(null)

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

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const sun = new THREE.DirectionalLight(0xffffff, 1.1)
    sun.position.set(dist, dist * 1.4, dist)
    scene.add(sun)

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
    // A lathe's own axis is vertical (Y). `axis: 'x'` lays it on its side —
    // height running left-right — to match a disk/washer lesson's own
    // horizontal integration variable; `axis: 'y'` leaves it upright.
    if (solid.axis === 'x') mesh.rotation.z = -Math.PI / 2
    scene.add(mesh)

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

    three.current = { camera, controls, mesh }

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      controls.dispose()
      mesh.geometry.dispose()
      material.dispose()
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
