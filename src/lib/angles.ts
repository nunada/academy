/** Angles: the numbers behind the "Angles" article's widgets.
 *
 *  The checker (tools/check-angles.mjs) tests this against references that do not use it: exact fractions (Python's Fraction) for the
 *  multiples of π and for the clock, a count over every 1/11 of a second of twelve hours for the times at which the hands make a
 *  given angle, the coordinates of lines and of regular polygons measured with atan2 for the angles at a transversal and in a
 *  polygon, and rotated vectors for the angle between two vectors. */

export type Unit = 'deg' | 'rad' | 'grad' | 'turn'

export const UNITS: Unit[] = ['deg', 'rad', 'grad', 'turn']

/** The same angle in the four units. */
export function fromDegrees(deg: number): Record<Unit, number> {
  return { deg, rad: (deg * Math.PI) / 180, grad: (deg * 10) / 9, turn: deg / 360 }
}

export function toDegrees(value: number, unit: Unit): number {
  switch (unit) {
    case 'deg':
      return value
    case 'rad':
      return (value * 180) / Math.PI
    case 'grad':
      return (value * 9) / 10
    case 'turn':
      return value * 360
  }
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

/** A whole number of degrees as a fraction of π radians, in lowest terms: 30° is 1/6 π. null if deg is not a whole number. */
export function piFraction(deg: number): { num: number; den: number } | null {
  if (!Number.isInteger(deg)) return null
  if (deg === 0) return { num: 0, den: 1 }
  const g = gcd(deg, 180)
  return { num: deg / g, den: 180 / g }
}

/** Degrees, minutes and seconds (sign separate), with the seconds rounded to `places` decimals and the carries done. */
export function dms(deg: number, places = 2): { sign: 1 | -1; d: number; m: number; s: number } {
  const sign = deg < 0 ? -1 : 1
  const unit = 10 ** places
  let total = Math.round(Math.abs(deg) * 3600 * unit) // in units of 10^-places of a second
  const perMinute = 60 * unit
  const perDegree = 3600 * unit
  const d = Math.floor(total / perDegree)
  total -= d * perDegree
  const m = Math.floor(total / perMinute)
  total -= m * perMinute
  return { sign, d, m, s: total / unit }
}

/** The angle for degrees, minutes and seconds. */
export const fromDms = (d: number, m: number, s: number): number => d + m / 60 + s / 3600

export type AngleKind = 'zero' | 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex' | 'full' | 'beyond'

/** The name of an angle between 0° and 360°; `beyond` for 360° and more, and for negative angles. */
export function classify(deg: number): AngleKind {
  if (deg < 0 || deg > 360) return 'beyond'
  if (deg === 0) return 'zero'
  if (deg < 90) return 'acute'
  if (deg === 90) return 'right'
  if (deg < 180) return 'obtuse'
  if (deg === 180) return 'straight'
  if (deg < 360) return 'reflex'
  return 'full'
}

/** The angle in [0, 360). */
export function normalize(deg: number): number {
  const r = deg % 360
  return r < 0 ? r + 360 : r === 0 ? 0 : r
}

/** The angle in (−180, 180]. */
export function normalizeSigned(deg: number): number {
  const r = normalize(deg)
  return r > 180 ? r - 360 : r
}

export const complement = (deg: number): number => 90 - deg
export const supplement = (deg: number): number => 180 - deg
export const explement = (deg: number): number => 360 - deg

/* ---------------------------------------------------------------------------------- a transversal */

export type PairKind = 'corresponding' | 'alternateInterior' | 'alternateExterior' | 'coInterior' | 'coExterior' | 'vertical' | 'linearPair'

/** The eight angles where a line crosses two parallel lines, numbered 1 to 8: 1 upper left, 2 upper right, 3 lower left, 4 lower right at the
 *  upper parallel line, and 5 to 8 in the same order at the lower one. `alpha` is the angle between the transversal (rising to the right)
 *  and the parallel lines, which is the angle number 2 (and 3, 6 and 7); the others are its supplement. */
export function transversalAngles(alpha: number): Record<number, number> {
  const b = 180 - alpha
  return { 1: b, 2: alpha, 3: alpha, 4: b, 5: b, 6: alpha, 7: alpha, 8: b }
}

export const PAIRS: Record<PairKind, [number, number][]> = {
  corresponding: [[1, 5], [2, 6], [3, 7], [4, 8]],
  alternateInterior: [[3, 6], [4, 5]],
  alternateExterior: [[1, 8], [2, 7]],
  coInterior: [[3, 5], [4, 6]],
  coExterior: [[1, 7], [2, 8]],
  vertical: [[1, 4], [2, 3], [5, 8], [6, 7]],
  linearPair: [[1, 2], [3, 4], [1, 3], [2, 4], [5, 6], [7, 8], [5, 7], [6, 8]],
}

/** Whether the two angles of such a pair are equal, or add up to 180°. */
export const PAIR_RELATION: Record<PairKind, 'equal' | 'supplementary'> = {
  corresponding: 'equal',
  alternateInterior: 'equal',
  alternateExterior: 'equal',
  coInterior: 'supplementary',
  coExterior: 'supplementary',
  vertical: 'equal',
  linearPair: 'supplementary',
}

/* -------------------------------------------------------------------------------------- polygons */

export const interiorSum = (n: number): number => (n - 2) * 180
export const regularInterior = (n: number): number => ((n - 2) * 180) / n
export const regularExterior = (n: number): number => 360 / n
export const diagonals = (n: number): number => (n * (n - 3)) / 2

/** The number of sides of the regular polygon whose interior angle is `deg`, or null if there is none. */
export function sidesFromInterior(deg: number): number | null {
  if (!(deg > 0 && deg < 180)) return null
  const n = 360 / (180 - deg)
  const r = Math.round(n)
  return Math.abs(n - r) < 1e-9 && r >= 3 ? r : null
}

/** Whether copies of the regular n-gon fit around a point without gaps: its interior angle divides 360°. */
export function tilesPlane(n: number): boolean {
  const a = ((n - 2) * 180) / n
  return Math.abs(360 / a - Math.round(360 / a)) < 1e-9
}

/** The vertices of a regular n-gon of circumradius R centered at the origin, the first at angle 90° (straight up), counterclockwise. */
export function regularPolygon(n: number, R = 1): [number, number][] {
  return Array.from({ length: n }, (_, k) => {
    const t = Math.PI / 2 + (2 * Math.PI * k) / n
    return [R * Math.cos(t), R * Math.sin(t)]
  })
}

/* ------------------------------------------------------------------------------------------ clock */

/** The angles of the two hands, in degrees clockwise from 12. */
export function clockHands(h: number, m: number, s = 0): { hour: number; minute: number } {
  return { hour: (((h % 12) * 3600 + m * 60 + s) / 120) % 360, minute: ((m * 720 + s * 12) / 120) % 360 }
}

/** The angle between the hands, from 0° to 180°. */
export function clockBetween(h: number, m: number, s = 0): number {
  // in 120ths of a degree, so that every time is an exact integer
  const hour = ((h % 12) * 3600 + m * 60 + s) % 43200
  const minute = (m * 720 + s * 12) % 43200
  const d = Math.abs(hour - minute)
  return Math.min(d, 43200 - d) / 120
}

/** The times in twelve hours at which the angle between the hands is `theta` degrees (a whole number from 0 to 180), as seconds after 12:00:00
 *  in lowest terms (num/den), sorted: 22 times for an angle strictly between 0° and 180°, 11 times for 0° and for 180°. */
export function clockTimes(theta: number): { num: number; den: number }[] {
  const found = new Map<string, { num: number; den: number }>()
  const add = (n: number, d: number): void => {
    const g = gcd(n, d)
    const f = { num: n / g, den: d / g }
    found.set(`${f.num}/${f.den}`, f)
  }
  // the relative speed of the hands is 11/120 of a degree per second, so the angle (minute hand minus hour hand) is 11 t / 120
  for (const target of [theta, 360 - theta]) {
    for (let k = 0; k < 12; k++) {
      const num = (target + 360 * k) * 120
      if (num / 11 < 43200) add(num, 11)
    }
  }
  return [...found.values()].sort((a, b) => a.num / a.den - b.num / b.den)
}

/** Seconds after 12:00:00 as hours, minutes and seconds (the seconds may be a fraction): h is 12, 1, …, 11. */
export function timeOfDay(num: number, den: number): { h: number; m: number; sNum: number; sDen: number } {
  const whole = Math.floor(num / den)
  const rem = num - whole * den
  const h = Math.floor(whole / 3600)
  const m = Math.floor((whole % 3600) / 60)
  const s = whole % 60
  return { h: h === 0 ? 12 : h, m, sNum: s * den + rem, sDen: den }
}

/* ------------------------------------------------------------------------------------- directions */

export const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']

/** The compass bearing (clockwise from north) of a direction given as a mathematical angle (counterclockwise from east). */
export const bearingFromMath = (deg: number): number => normalize(90 - deg)

/** The mathematical angle (counterclockwise from east) of a compass bearing. */
export const mathFromBearing = (bearing: number): number => normalize(90 - bearing)

/** The name of the nearest of the sixteen compass points. */
export function compassName(bearing: number): string {
  return COMPASS[Math.round(normalize(bearing) / 22.5) % 16]
}

/* --------------------------------------------------------------------------------------- vectors */

export type Vec = [number, number]

const dot = (a: Vec, b: Vec): number => a[0] * b[0] + a[1] * b[1]
const cross = (a: Vec, b: Vec): number => a[0] * b[1] - a[1] * b[0]

/** The angle between two vectors in radians, 0 to π, from atan2 of the cross and dot products: accurate for every angle. */
export const angleBetween = (a: Vec, b: Vec): number => Math.atan2(Math.abs(cross(a, b)), dot(a, b))

/** The same angle from the arc cosine of the normalized dot product, as it is often written: it loses all precision near 0 and π. */
export function angleBetweenAcos(a: Vec, b: Vec): number {
  const c = dot(a, b) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]))
  return Math.acos(Math.max(-1, Math.min(1, c)))
}

/** The signed angle that turns a into b, in (−π, π]: positive counterclockwise. */
export const directedAngle = (a: Vec, b: Vec): number => Math.atan2(cross(a, b), dot(a, b))

/** The acute angle between two lines with slopes m1 and m2, in degrees (90 for perpendicular lines, also if one is vertical: pass Infinity). */
export function lineAngle(m1: number, m2: number): number {
  if (m1 === m2) return 0
  if (!Number.isFinite(m1) && !Number.isFinite(m2)) return 0
  if (!Number.isFinite(m1)) return m2 === 0 ? 90 : (Math.atan(Math.abs(1 / m2)) * 180) / Math.PI
  if (!Number.isFinite(m2)) return m1 === 0 ? 90 : (Math.atan(Math.abs(1 / m1)) * 180) / Math.PI
  const denom = 1 + m1 * m2
  if (denom === 0) return 90
  return (Math.atan(Math.abs((m1 - m2) / denom)) * 180) / Math.PI
}

/* ---------------------------------------------------------------------------------------- circles */

/** The arc, sector area and chord of a circle of radius r for a central angle in radians. */
export function sectorOf(r: number, theta: number): { arc: number; area: number; chord: number } {
  return { arc: r * theta, area: (r * r * theta) / 2, chord: 2 * r * Math.sin(theta / 2) }
}

/** The angle at the point P, at polar angle `pointDeg` on the circle, between the two ends of a chord at polar angles 0 and `centralDeg`,
 *  measured from the coordinates, in degrees. */
export function inscribedAt(centralDeg: number, pointDeg: number): number {
  const at = (deg: number): Vec => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
  const P = at(pointDeg)
  const A = at(0)
  const B = at(centralDeg)
  const u: Vec = [A[0] - P[0], A[1] - P[1]]
  const v: Vec = [B[0] - P[0], B[1] - P[1]]
  return (angleBetween(u, v) * 180) / Math.PI
}

/** What the inscribed angle theorem says it should be: half the central angle for a point outside the arc from A to B (counterclockwise), and 180° minus that for a point on it. */
export function inscribedFormula(centralDeg: number, pointDeg: number): number {
  const p = normalize(pointDeg)
  const onArc = p > 0 && p < centralDeg
  return onArc ? 180 - centralDeg / 2 : centralDeg / 2
}
