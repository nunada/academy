/** The prism: the numbers behind the "Prism" article's widgets.
 *
 *   - `regularBase`, `prismCounts`, `rightPrism`: a right prism on a regular polygon: base area, volume, lateral and total surface, the corners, edges and faces,
 *     the diagonals of the lateral faces and the space diagonals;
 *   - `generalPrism`: any prism, right or oblique, on any polygon, from the corners of its base and the vector that carries the base to the top: volume, lateral
 *     area (the parallelograms), surface, and the perimeter of the section at right angles to the edges, whose product with the edge is the lateral area;
 *   - `inscribedAreaRatio`, `prismInCircle`: the prism on a regular polygon in a circle, and how it closes in on the cylinder as the sides multiply;
 *   - `prismDeviation`, `minDeviation`, `indexFromMinDeviation`, `incidenceAtMinDeviation`, `criticalAngle`: light through a glass prism, by Snell's law at two faces.
 *
 *  The checker (tools/check-prism.mjs) tests all of it against references that do not use it: the corners as coordinates (areas from cross products, volumes and
 *  surfaces from the convex hull), polygons built on a circle and measured by the shoelace formula, mpmath for the trigonometry, and a ray traced through the glass
 *  with Snell's law in vector form. */

/* --------------------------------------------------------------------- regular bases */

export interface RegularBase {
  area: number
  perimeter: number
  /** the distance from the centre to a side, and to a corner */
  apothem: number
  circumradius: number
}

/** The regular polygon with n sides of length s: area n·s² / (4 tan(π/n)), perimeter n·s. */
export function regularBase(n: number, s: number): RegularBase {
  const t = Math.tan(Math.PI / n)
  return { area: (n * s * s) / (4 * t), perimeter: n * s, apothem: s / (2 * t), circumradius: s / (2 * Math.sin(Math.PI / n)) }
}

/** The corners, edges and faces of a prism on an n-gon: 2n, 3n and n + 2, and V − E + F. */
export function prismCounts(n: number): { V: number; E: number; F: number; chi: number } {
  return { V: 2 * n, E: 3 * n, F: n + 2, chi: 2 * n - 3 * n + (n + 2) }
}

export interface RightPrism {
  n: number
  s: number
  h: number
  baseArea: number
  perimeter: number
  volume: number
  /** the n rectangles s × h: perimeter times height */
  lateral: number
  /** two bases plus the lateral area */
  surface: number
  /** the diagonal of a lateral face, √(s² + h²) */
  faceDiagonal: number
  /** the lengths of the space diagonals, the segments between corners that share no face, distinct and ascending; empty for n = 3, where there are none */
  spaceDiagonals: number[]
}

/** The right prism on a regular n-gon of side s and height h. */
export function rightPrism(n: number, s: number, h: number): RightPrism {
  const b = regularBase(n, s)
  const diagonals: number[] = []
  // from a corner of the bottom to a corner of the top that is k places round, 2 ≤ k ≤ n/2: the base distance is 2R sin(kπ/n)
  for (let k = 2; k <= Math.floor(n / 2); k++) diagonals.push(Math.sqrt((2 * b.circumradius * Math.sin((k * Math.PI) / n)) ** 2 + h * h))
  return {
    n,
    s,
    h,
    baseArea: b.area,
    perimeter: b.perimeter,
    volume: b.area * h,
    lateral: b.perimeter * h,
    surface: 2 * b.area + b.perimeter * h,
    faceDiagonal: Math.hypot(s, h),
    spaceDiagonals: diagonals,
  }
}

/* ------------------------------------------------------------------- any prism */

export type P2 = [number, number]
export type P3 = [number, number, number]

/** The area of a polygon from its corners in order (the shoelace formula), always positive. */
export function polygonArea(p: P2[]): number {
  let twice = 0
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i]
    const [x2, y2] = p[(i + 1) % p.length]
    twice += x1 * y2 - x2 * y1
  }
  return Math.abs(twice) / 2
}

export const polygonPerimeter = (p: P2[]): number => p.reduce((s, q, i) => s + Math.hypot(p[(i + 1) % p.length][0] - q[0], p[(i + 1) % p.length][1] - q[1]), 0)

const cross3 = (u: P3, v: P3): P3 => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
const len3 = (u: P3): number => Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2])

export interface GeneralPrism {
  baseArea: number
  perimeter: number
  /** the height (the vertical part of the shift) and the length of a lateral edge (the whole shift) */
  height: number
  edge: number
  right: boolean
  volume: number
  /** the n parallelograms: Σ |side × shift| */
  lateral: number
  surface: number
  /** the perimeter of the cross-section made by a plane at right angles to the lateral edges; its product with the edge length is the lateral area */
  rightSectionPerimeter: number
}

/** A prism whose base is the polygon `base` (in the plane z = 0) and whose top is the same polygon carried by `shift = (dx, dy, h)`, h > 0: right when dx = dy = 0,
 *  oblique otherwise. Volume is base area times height whether or not the prism leans (Cavalieri's principle). */
export function generalPrism(base: P2[], shift: P3): GeneralPrism {
  const A = polygonArea(base)
  const P = polygonPerimeter(base)
  const edge = len3(shift)
  let lateral = 0
  for (let i = 0; i < base.length; i++) {
    const [x1, y1] = base[i]
    const [x2, y2] = base[(i + 1) % base.length]
    lateral += len3(cross3([x2 - x1, y2 - y1, 0], shift))
  }
  // the section at right angles to the edges: project the base along the shift onto a plane perpendicular to it
  const u: P3 = [shift[0] / edge, shift[1] / edge, shift[2] / edge]
  const proj = base.map(([x, y]): P3 => {
    const d = x * u[0] + y * u[1]
    return [x - d * u[0], y - d * u[1], -d * u[2]]
  })
  let section = 0
  for (let i = 0; i < proj.length; i++) {
    const a = proj[i]
    const b = proj[(i + 1) % proj.length]
    section += len3([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
  }
  return {
    baseArea: A,
    perimeter: P,
    height: shift[2],
    edge,
    right: shift[0] === 0 && shift[1] === 0,
    volume: A * shift[2],
    lateral,
    surface: 2 * A + lateral,
    rightSectionPerimeter: section,
  }
}

/** The corners of a regular n-gon of side s in the plane z = 0, centred at the origin, the first on the x axis. */
export function regularPolygon(n: number, s: number): P2[] {
  const R = regularBase(n, s).circumradius
  return Array.from({ length: n }, (_, i): P2 => [R * Math.cos((2 * Math.PI * i) / n), R * Math.sin((2 * Math.PI * i) / n)])
}

/* ---------------------------------------------------------- towards the cylinder */

/** The area of the regular n-gon inscribed in a circle, as a fraction of the circle: (n / 2π) sin(2π/n). It tends to 1 as n grows. */
export const inscribedAreaRatio = (n: number): number => (n / (2 * Math.PI)) * Math.sin((2 * Math.PI) / n)

/** The prism on a regular n-gon inscribed in a circle of radius r, with height h, and the cylinder it approaches. */
export function prismInCircle(n: number, r: number, h: number): { volume: number; lateral: number; surface: number; cylinderVolume: number; cylinderSurface: number } {
  const area = (n / 2) * r * r * Math.sin((2 * Math.PI) / n)
  const perimeter = 2 * n * r * Math.sin(Math.PI / n)
  return {
    volume: area * h,
    lateral: perimeter * h,
    surface: 2 * area + perimeter * h,
    cylinderVolume: Math.PI * r * r * h,
    cylinderSurface: 2 * Math.PI * r * r + 2 * Math.PI * r * h,
  }
}

/* ------------------------------------------------------------- light through glass */

const RAD = Math.PI / 180
const DEG = 180 / Math.PI

export interface Passage {
  /** the angle of incidence at the first face, the angle of refraction there, the angle of incidence at the second face, the angle at which the light leaves, and the total deviation, in degrees */
  i1: number
  r1: number
  r2: number
  e: number
  D: number
}

/** A ray through a prism of apex angle A and refractive index n, arriving at the first face at the angle i1 (degrees): Snell's law at the first face (sin i1 = n sin r1),
 *  the two refraction angles add up to the apex angle (r1 + r2 = A), Snell's law again (sin e = n sin r2), and the deviation is D = i1 + e − A.
 *  Null when the light cannot leave the second face: n sin r2 > 1 is total internal reflection. */
export function prismDeviation(A: number, n: number, i1: number): Passage | null {
  const r1 = Math.asin(Math.sin(i1 * RAD) / n) * DEG
  const r2 = A - r1
  const s = n * Math.sin(r2 * RAD)
  if (Math.abs(s) > 1) return null
  const e = Math.asin(s) * DEG
  return { i1, r1, r2, e, D: i1 + e - A }
}

/** The smallest deviation, reached when the ray goes symmetrically through the prism (i1 = e): D = 2 arcsin(n sin(A/2)) − A. Null when n sin(A/2) ≥ 1. */
export function minDeviation(A: number, n: number): number | null {
  const s = n * Math.sin((A / 2) * RAD)
  return s >= 1 ? null : 2 * Math.asin(s) * DEG - A
}

/** The angle of incidence at which that happens: arcsin(n sin(A/2)). */
export const incidenceAtMinDeviation = (A: number, n: number): number => Math.asin(n * Math.sin((A / 2) * RAD)) * DEG

/** The refractive index from a measured apex angle and minimum deviation: n = sin((A + D) / 2) / sin(A / 2). */
export const indexFromMinDeviation = (A: number, D: number): number => Math.sin(((A + D) / 2) * RAD) / Math.sin((A / 2) * RAD)

/** The critical angle of a surface between glass of index n and air: arcsin(1/n), in degrees. */
export const criticalAngle = (n: number): number => Math.asin(1 / n) * DEG
