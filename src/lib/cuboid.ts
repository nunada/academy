/** The cuboid (the rectangular box): the numbers behind the "Cuboid" article's widgets.
 *
 *   - `measures`, `exactMeasures`: volume, surface area, lateral area, the three face diagonals and the space diagonal, the edges together;
 *   - `heightForSurface`, `volumeForSurface`, `bestVolumeForSurface`: the boxes that share one surface area, and the cube that holds the most;
 *   - `directionAngles`, `anglesBetweenDiagonals`: the angles the space diagonal makes with the edges, and the angles at which two space diagonals cross;
 *   - `fitsRod`, `gridPacking`: whether a straight rod fits inside, and how many small boxes fit when all are laid the same way;
 *   - `pythagoreanQuadruples`, `quadrupleFromFour`, `eulerBricks`, `perfectCuboids`: boxes whose diagonals are whole numbers;
 *   - `boxNet`: the six rectangles of the net, with their areas.
 *
 *  The checker (tools/check-cuboid.mjs) tests all of it against references that do not use it: the eight corners as coordinates (areas from cross products,
 *  lengths from distances), Python integers and mpmath, brute-force search for the boxes with whole-number diagonals, a grid search for the box of largest volume
 *  on a given surface, and counting small boxes cell by cell. */

/* ------------------------------------------------------------------------- measures */

export interface Measures {
  l: number
  w: number
  h: number
  volume: number
  /** 2(lw + lh + wh): all six faces */
  surface: number
  /** 2h(l + w): the four walls, without the top and the bottom */
  lateral: number
  base: number
  /** the diagonals of the three kinds of face: l × w, l × h and w × h */
  faceDiagonalLW: number
  faceDiagonalLH: number
  faceDiagonalWH: number
  spaceDiagonal: number
  /** the twelve edges end to end: 4(l + w + h) */
  edgeTotal: number
}

export function measures(l: number, w: number, h: number): Measures {
  return {
    l,
    w,
    h,
    volume: l * w * h,
    surface: 2 * (l * w + l * h + w * h),
    lateral: 2 * h * (l + w),
    base: l * w,
    faceDiagonalLW: Math.hypot(l, w),
    faceDiagonalLH: Math.hypot(l, h),
    faceDiagonalWH: Math.hypot(w, h),
    spaceDiagonal: Math.sqrt(l * l + w * w + h * h),
    edgeTotal: 4 * (l + w + h),
  }
}

export interface ExactMeasures {
  volume: bigint
  surface: bigint
  lateral: bigint
  /** the squares of the diagonals: whole numbers when the edges are */
  faceDiagonalLW2: bigint
  faceDiagonalLH2: bigint
  faceDiagonalWH2: bigint
  spaceDiagonal2: bigint
  edgeTotal: bigint
}

export function exactMeasures(l: bigint, w: bigint, h: bigint): ExactMeasures {
  return {
    volume: l * w * h,
    surface: 2n * (l * w + l * h + w * h),
    lateral: 2n * h * (l + w),
    faceDiagonalLW2: l * l + w * w,
    faceDiagonalLH2: l * l + h * h,
    faceDiagonalWH2: w * w + h * h,
    spaceDiagonal2: l * l + w * w + h * h,
    edgeTotal: 4n * (l + w + h),
  }
}

/** The integer square root of a non-negative whole number, rounded down: Newton's iteration on whole numbers, from a start above the root, so it is exact however big n is. */
export function isqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('negative')
  if (n < 2n) return n
  let x = 1n << BigInt((n.toString(2).length + 1) >> 1)
  for (;;) {
    const y = (x + n / x) >> 1n
    if (y >= x) return x
    x = y
  }
}

/** The square root of n when n is a perfect square, else null. */
export function exactSqrt(n: bigint): bigint | null {
  if (n < 0n) return null
  const r = isqrt(n)
  return r * r === n ? r : null
}

/** A box scaled by k in every direction: the lengths by k, the areas by k², the volume by k³. */
export const scaleFactors = (k: number): { length: number; area: number; volume: number } => ({ length: k, area: k * k, volume: k * k * k })

/* ------------------------------------------------------------------- one surface area */

/** The height of the box with a base l × w and surface area S: from S = 2(lw + lh + wh), h = (S/2 − lw) / (l + w). Negative or zero when the base alone is too large. */
export const heightForSurface = (S: number, l: number, w: number): number => (S / 2 - l * w) / (l + w)

/** The volume of that box, or 0 when there is no such box. */
export function volumeForSurface(S: number, l: number, w: number): number {
  const h = heightForSurface(S, l, w)
  return h > 0 ? l * w * h : 0
}

/** The largest volume any box of surface area S can have: that of the cube, edge √(S/6), volume (S/6)^(3/2). */
export const bestVolumeForSurface = (S: number): number => (S / 6) ** 1.5

/** The edge of the cube with surface area S. */
export const cubeEdgeForSurface = (S: number): number => Math.sqrt(S / 6)

/* -------------------------------------------------------------------------- the angles */

const DEG = 180 / Math.PI

/** The angles, in degrees, between the space diagonal and the three edges l, w, h: their cosines are l/d, w/d and h/d, so the squares of the three cosines add up to 1. */
export function directionAngles(l: number, w: number, h: number): { alpha: number; beta: number; gamma: number; cosSquares: number } {
  const d = Math.sqrt(l * l + w * w + h * h)
  return {
    alpha: Math.acos(l / d) * DEG,
    beta: Math.acos(w / d) * DEG,
    gamma: Math.acos(h / d) * DEG,
    cosSquares: (l / d) ** 2 + (w / d) ** 2 + (h / d) ** 2,
  }
}

/** The acute angles at which two space diagonals cross, for the three kinds of pair: the diagonals (l, w, h) and (−l, w, h) meet at arccos(|−l² + w² + h²| / d²), and so on. For a cube every angle is arccos(1/3). */
export function anglesBetweenDiagonals(l: number, w: number, h: number): { throughL: number; throughW: number; throughH: number } {
  const d2 = l * l + w * w + h * h
  const a = (c: number): number => Math.acos(Math.min(1, Math.abs(c) / d2)) * DEG
  return { throughL: a(-l * l + w * w + h * h), throughW: a(l * l - w * w + h * h), throughH: a(l * l + w * w - h * h) }
}

/* ------------------------------------------------------------------- fitting things in */

/** Does a thin straight rod of length r fit inside the box? It does when r is not more than the space diagonal (at exactly that length it just fits, corner to corner). */
export const fitsRod = (l: number, w: number, h: number, r: number): boolean => r <= Math.sqrt(l * l + w * w + h * h) * (1 + 1e-12)

export interface Packing {
  /** the number of small boxes in the best arrangement */
  count: number
  /** how many fit along each side of the big box, and which small edge goes along it: a permutation of the small box's edges */
  along: [number, number, number]
  order: [number, number, number]
}

/** How many small boxes l × w × h fit in a big box L × W × H when they are all laid the same way, with their edges parallel to the walls: the best of the six
 *  ways to lay them, the product of ⌊L/a⌋·⌊W/b⌋·⌊H/c⌋ for the edge a, b, c of the small box in that order. (Turning some of them differently can sometimes fit more.) */
export function gridPacking(L: number, W: number, H: number, small: [number, number, number]): Packing {
  const perms: [number, number, number][] = [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ]
  let best: Packing = { count: -1, along: [0, 0, 0], order: [0, 1, 2] }
  for (const p of perms) {
    const a = Math.floor(L / small[p[0]] + 1e-9)
    const b = Math.floor(W / small[p[1]] + 1e-9)
    const c = Math.floor(H / small[p[2]] + 1e-9)
    if (a * b * c > best.count) best = { count: a * b * c, along: [a, b, c], order: p }
  }
  return best
}

/* ----------------------------------------------------------- boxes with whole diagonals */

export interface Quadruple {
  a: bigint
  b: bigint
  c: bigint
  d: bigint
  /** the greatest common divisor of a, b, c, d is 1 */
  primitive: boolean
}

const gcd = (x: bigint, y: bigint): bigint => {
  x = x < 0n ? -x : x
  y = y < 0n ? -y : y
  while (y) [x, y] = [y, x % y]
  return x
}

/** Every Pythagorean quadruple a² + b² + c² = d² with 1 ≤ a ≤ b ≤ c and d ≤ maxD: the boxes with whole-number edges whose space diagonal is a whole number too. Sorted by d, then a, b, c. */
export function pythagoreanQuadruples(maxD: number): Quadruple[] {
  const out: Quadruple[] = []
  for (let d = 2; d <= maxD; d++) {
    const d2 = d * d
    for (let c = 1; c < d; c++) {
      // c is the longest edge, so 3c² ≥ d²
      if (3 * c * c < d2) continue
      const rest = d2 - c * c
      for (let b = 1; b <= c; b++) {
        // a ≤ b means a² = rest − b² ≤ b²; a ≥ 1 means b² < rest
        if (2 * b * b < rest) continue
        if (b * b >= rest) break
        const a2 = rest - b * b
        const a = Math.round(Math.sqrt(a2))
        if (a * a === a2) {
          const A = BigInt(a)
          const B = BigInt(b)
          const C = BigInt(c)
          const D = BigInt(d)
          out.push({ a: A, b: B, c: C, d: D, primitive: gcd(gcd(A, B), gcd(C, D)) === 1n })
        }
      }
    }
  }
  return out.sort((x, y) => Number(x.d - y.d) || Number(x.a - y.a) || Number(x.b - y.b) || Number(x.c - y.c))
}

/** An identity for four whole numbers: for any whole numbers m, n, p, q the numbers (m² + n² − p² − q², 2(mq + np), 2(nq − mp)) have squares that add up to (m² + n² + p² + q²)². */
export function quadrupleFromFour(m: bigint, n: bigint, p: bigint, q: bigint): { a: bigint; b: bigint; c: bigint; d: bigint } {
  return { a: m * m + n * n - p * p - q * q, b: 2n * (m * q + n * p), c: 2n * (n * q - m * p), d: m * m + n * n + p * p + q * q }
}

/** The Euler bricks with edges a < b < c ≤ maxC: boxes whose three face diagonals are whole numbers. The smallest is 44 × 117 × 240 (face diagonals 125, 244, 267). */
export function eulerBricks(maxC: number): { a: number; b: number; c: number; fab: number; fac: number; fbc: number }[] {
  const isSq = (n: number): number => {
    const r = Math.round(Math.sqrt(n))
    return r * r === n ? r : -1
  }
  const out: { a: number; b: number; c: number; fab: number; fac: number; fbc: number }[] = []
  for (let c = 3; c <= maxC; c++)
    for (let b = 2; b < c; b++) {
      const fbc = isSq(b * b + c * c)
      if (fbc < 0) continue
      for (let a = 1; a < b; a++) {
        const fab = isSq(a * a + b * b)
        if (fab < 0) continue
        const fac = isSq(a * a + c * c)
        if (fac >= 0) out.push({ a, b, c, fab, fac, fbc })
      }
    }
  return out.sort((x, y) => x.c - y.c || x.b - y.b || x.a - y.a)
}

/** The Euler bricks (edges up to maxC) whose space diagonal is a whole number as well: perfect cuboids. None is known; the search finds none. */
export function perfectCuboids(maxC: number): { a: number; b: number; c: number }[] {
  return eulerBricks(maxC)
    .filter(({ a, b, c }) => exactSqrt(BigInt(a * a + b * b + c * c)) !== null)
    .map(({ a, b, c }) => ({ a, b, c }))
}

/* ------------------------------------------------------------------------------ the net */

export interface NetRect {
  name: string
  w: number
  h: number
  area: number
}

/** The six rectangles of the net of a box l × w × h, as base and top (l × w), front and back (l × h), left and right (w × h), with their areas; the areas add up to the surface area. */
export function boxNet(l: number, w: number, h: number): NetRect[] {
  const r = (name: string, a: number, b: number): NetRect => ({ name, w: a, h: b, area: a * b })
  return [r('base', l, w), r('top', l, w), r('front', l, h), r('back', l, h), r('left', w, h), r('right', w, h)]
}
