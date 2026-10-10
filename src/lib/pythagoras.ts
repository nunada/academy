/** Exact arithmetic for the Pythagorean theorem article's widgets.
 *
 *  Triples are whole numbers (BigInt), found by Euclid's formula and by the factoring
 *  c² − b² = (c − b)(c + b); the primitive triples are also a tree (Berggren, 1934) that
 *  starts at (3, 4, 5) and has three children for every triple. A missing side of a right
 *  triangle with rational known sides is written exactly as k√m, and a distance in any
 *  dimension is a sum of squares, so it stays exact until the very last square root. */

import { gcd, rat, type Rat } from './realnum'
import { ratAdd, ratMul, ratSub } from './rationals'
import { sqrtParts } from './triangle'

export { rat, type Rat }

export type Triple = [bigint, bigint, bigint]

const sq = (r: Rat): Rat => ratMul(r, r)
const num = (r: Rat): number => Number(r.n) / Number(r.d)

/** a² + b² = c² for positive whole numbers. */
export const isTriple = (a: bigint, b: bigint, c: bigint): boolean => a > 0n && b > 0n && c > 0n && a * a + b * b === c * c

/** No common factor of all three numbers. */
export const isPrimitive = (t: Triple): boolean => gcd(gcd(t[0], t[1]), t[2]) === 1n

/** Euclid's formula: for m > n > 0 the triple (m² − n², 2mn, m² + n²). */
export const euclid = (m: bigint, n: bigint): Triple => [m * m - n * n, 2n * m * n, m * m + n * n]

/** Legs in increasing order. */
const ordered = (t: Triple): Triple => (t[0] < t[1] ? [t[0], t[1], t[2]] : [t[1], t[0], t[2]])

/** Every triple a < b < c with hypotenuse at most maxC (multiples included unless `primitiveOnly`),
 *  sorted by hypotenuse and then by the shorter leg. */
export function triplesUpTo(maxC: number, primitiveOnly = false): Triple[] {
  const out: Triple[] = []
  const limit = BigInt(maxC)
  for (let m = 2n; m * m + 1n <= limit; m++)
    for (let n = 1n; n < m; n++) {
      if ((m - n) % 2n === 0n || gcd(m, n) !== 1n) continue
      const base = ordered(euclid(m, n))
      if (base[2] > limit) continue
      if (primitiveOnly) out.push(base)
      else for (let k = 1n; base[2] * k <= limit; k++) out.push([base[0] * k, base[1] * k, base[2] * k])
    }
  return out.sort((x, y) => (x[2] === y[2] ? (x[0] < y[0] ? -1 : 1) : x[2] < y[2] ? -1 : 1))
}

/** Every right triangle with whole sides that has `a` as a leg: [a, other leg, hypotenuse], sorted by hypotenuse.
 *  Uses a² = c² − b² = (c − b)(c + b): each divisor d < a of a² whose partner e = a²/d has the same parity
 *  gives c = (d + e)/2 and b = (e − d)/2. */
export function triplesWithLeg(a: bigint): Triple[] {
  if (a < 3n) return []
  const a2 = a * a
  const out: Triple[] = []
  for (let d = 1n; d < a; d++) {
    if (a2 % d !== 0n) continue
    const e = a2 / d
    if ((d + e) % 2n !== 0n) continue
    out.push([a, (e - d) / 2n, (d + e) / 2n])
  }
  return out.sort((x, y) => (x[2] < y[2] ? -1 : x[2] > y[2] ? 1 : 0))
}

/* ----------------------------------------------------- the tree of primitive triples */

// Berggren's three matrices, acting on (odd leg, even leg, hypotenuse).
const M: bigint[][][] = [
  [[1n, -2n, 2n], [2n, -1n, 2n], [2n, -2n, 3n]],
  [[1n, 2n, 2n], [2n, 1n, 2n], [2n, 2n, 3n]],
  [[-1n, 2n, 2n], [-2n, 1n, 2n], [-2n, 2n, 3n]],
]
const apply = (m: bigint[][], t: Triple): Triple => [
  m[0][0] * t[0] + m[0][1] * t[1] + m[0][2] * t[2],
  m[1][0] * t[0] + m[1][1] * t[1] + m[1][2] * t[2],
  m[2][0] * t[0] + m[2][1] * t[1] + m[2][2] * t[2],
]
// The inverse of such a matrix is J Mᵀ J with J = diag(1, 1, −1).
const inverse = (m: bigint[][]): bigint[][] => {
  const J = [1n, 1n, -1n]
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => J[i] * m[j][i] * J[j]))
}
const INV = M.map(inverse)

/** The three children of a primitive triple (odd leg, even leg, hypotenuse): the root (3, 4, 5) has
 *  (5, 12, 13), (21, 20, 29) and (15, 8, 17). */
export const children = (t: Triple): [Triple, Triple, Triple] => [apply(M[0], t), apply(M[1], t), apply(M[2], t)]

/** The parent of a primitive triple in the tree, or null for the root (3, 4, 5). */
export function parent(t: Triple): Triple | null {
  if (t[0] === 3n && t[1] === 4n && t[2] === 5n) return null
  for (const inv of INV) {
    const p = apply(inv, t)
    if (p[0] > 0n && p[1] > 0n && p[2] > 0n && p[2] < t[2]) return p
  }
  return null
}

/** A primitive triple written with the odd leg first. */
export const oddFirst = (t: Triple): Triple => (t[0] % 2n === 1n ? t : [t[1], t[0], t[2]])

/* ------------------------------------------------------------ missing side, distance */

export interface Missing {
  /** The square of the unknown side, and the side as k√m (m squarefree) and as a decimal. */
  square: Rat
  k: Rat
  m: bigint
  value: number
  /** True when the side is a rational number (m = 1). */
  rational: boolean
}

const missing = (square: Rat): Missing => {
  const { k, m } = sqrtParts(square)
  return { square, k, m, value: Math.sqrt(num(square)), rational: m === 1n }
}

/** The hypotenuse of a right triangle with legs x and y. */
export const hypotenuse = (x: Rat, y: Rat): Missing => missing(ratAdd(sq(x), sq(y)))

/** The other leg, given a leg x and the hypotenuse y (null unless y > x > 0). */
export function otherLeg(x: Rat, y: Rat): Missing | null {
  const d = ratSub(sq(y), sq(x))
  return d.n > 0n && x.n > 0n ? missing(d) : null
}

/** The squared distance between two points of the same dimension: the sum of the squared differences. */
export function distanceSq(p: Rat[], q: Rat[]): Rat {
  let s = rat(0n, 1n)
  for (let i = 0; i < p.length; i++) s = ratAdd(s, sq(ratSub(p[i], q[i])))
  return s
}

/** The diagonal of a box l × w × h, squared. */
export const boxDiagonalSq = (l: Rat, w: Rat, h: Rat): Rat => ratAdd(ratAdd(sq(l), sq(w)), sq(h))

export { missing as sideFromSquare }
