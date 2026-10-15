/** Numbers and drawings for the "Inverse Trigonometric Functions" article's widgets.
 *
 *  The checker (tools/check-invtrig.mjs) tests every formula here against references that do not use it: the rule for
 *  inverses applied to the restricted trigonometric functions (the slope of arcsin at x is 1 / cos(arcsin x), by the
 *  derivative of cosine, and so on), central differences, the identities between the six functions, the reference
 *  triangles (their sides satisfy Pythagoras and give back x), and the viewing angle, whose largest value is found by a
 *  scan and compared with the closed form. */

export type InvId = 'arcsin' | 'arccos' | 'arctan' | 'arccot' | 'arcsec' | 'arccsc'

export interface InvTrig {
  id: InvId
  tex: string
  dtex: string
  /** NaN outside the domain. */
  f: (x: number) => number
  d: (x: number) => number
  xr: [number, number]
  fy: [number, number]
  dy: [number, number]
  domain: { en: string; id: string }
  range: { en: string; id: string }
  note: { en: string; id: string }
}

const sec = (x: number) => 1 / Math.abs(x) / Math.sqrt(x * x - 1)

export const INVTRIGS: InvTrig[] = [
  {
    id: 'arcsin',
    tex: '\\arcsin x',
    dtex: '\\frac{d}{dx}\\arcsin x=\\frac{1}{\\sqrt{1-x^2}}',
    f: Math.asin,
    d: (x) => 1 / Math.sqrt(1 - x * x),
    xr: [-1.5, 1.5],
    fy: [-2, 2],
    dy: [0, 6],
    domain: { en: '−1 ≤ x ≤ 1', id: '−1 ≤ x ≤ 1' },
    range: { en: '−π/2 ≤ y ≤ π/2', id: '−π/2 ≤ y ≤ π/2' },
    note: { en: 'The graph has vertical tangent lines at x = −1 and x = 1, so the slope grows without bound there; in between it is at least 1.', id: 'Grafik memiliki garis singgung tegak di x = −1 dan x = 1, sehingga gradiennya membesar tanpa batas di sana; di antaranya paling sedikit 1.' },
  },
  {
    id: 'arccos',
    tex: '\\arccos x',
    dtex: '\\frac{d}{dx}\\arccos x=-\\frac{1}{\\sqrt{1-x^2}}',
    f: Math.acos,
    d: (x) => -1 / Math.sqrt(1 - x * x),
    xr: [-1.5, 1.5],
    fy: [-0.4, 3.5],
    dy: [-6, 0],
    domain: { en: '−1 ≤ x ≤ 1', id: '−1 ≤ x ≤ 1' },
    range: { en: '0 ≤ y ≤ π', id: '0 ≤ y ≤ π' },
    note: { en: 'The arccosine always falls, and its slope is the negative of the arcsine’s, because arccos x = π/2 − arcsin x.', id: 'Arkus kosinus selalu turun, dan gradiennya negatif dari gradien arkus sinus, karena arccos x = π/2 − arcsin x.' },
  },
  {
    id: 'arctan',
    tex: '\\arctan x',
    dtex: '\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}',
    f: Math.atan,
    d: (x) => 1 / (1 + x * x),
    xr: [-5, 5],
    fy: [-2, 2],
    dy: [-0.1, 1.2],
    domain: { en: 'all real x', id: 'semua x real' },
    range: { en: '−π/2 < y < π/2', id: '−π/2 < y < π/2' },
    note: { en: 'The slope 1/(1 + x²) is defined for every x, is greatest (1) at the origin and tends to 0 on both sides: the graph flattens towards the horizontal asymptotes y = ±π/2.', id: 'Gradien 1/(1 + x²) terdefinisi untuk setiap x, terbesar (1) di titik asal dan menuju 0 di kedua sisi: grafik melandai menuju asimtot mendatar y = ±π/2.' },
  },
  {
    id: 'arccot',
    tex: '\\arccot x',
    dtex: '\\frac{d}{dx}\\arccot x=-\\frac{1}{1+x^2}',
    f: (x) => Math.PI / 2 - Math.atan(x),
    d: (x) => -1 / (1 + x * x),
    xr: [-5, 5],
    fy: [-0.4, 3.5],
    dy: [-1.2, 0.1],
    domain: { en: 'all real x', id: 'semua x real' },
    range: { en: '0 < y < π', id: '0 < y < π' },
    note: { en: 'The arccotangent falls from π to 0, with the negative of the arctangent’s slope, since arccot x = π/2 − arctan x.', id: 'Arkus kotangen turun dari π ke 0, dengan gradien negatif dari gradien arkus tangen, karena arccot x = π/2 − arctan x.' },
  },
  {
    id: 'arcsec',
    tex: '\\arcsec x',
    dtex: '\\frac{d}{dx}\\arcsec x=\\frac{1}{|x|\\sqrt{x^2-1}}',
    f: (x) => Math.acos(1 / x),
    d: (x) => sec(x),
    xr: [-5, 5],
    fy: [-0.4, 3.5],
    dy: [0, 6],
    domain: { en: '|x| ≥ 1', id: '|x| ≥ 1' },
    range: { en: '0 ≤ y ≤ π, y ≠ π/2', id: '0 ≤ y ≤ π, y ≠ π/2' },
    note: { en: 'The slope is positive on both pieces of the graph, which is why the formula needs the absolute value |x|.', id: 'Gradien positif pada kedua bagian grafik, itulah sebabnya rumus memerlukan nilai mutlak |x|.' },
  },
  {
    id: 'arccsc',
    tex: '\\arccsc x',
    dtex: '\\frac{d}{dx}\\arccsc x=-\\frac{1}{|x|\\sqrt{x^2-1}}',
    f: (x) => Math.asin(1 / x),
    d: (x) => -sec(x),
    xr: [-5, 5],
    fy: [-2, 2],
    dy: [-6, 0],
    domain: { en: '|x| ≥ 1', id: '|x| ≥ 1' },
    range: { en: '−π/2 ≤ y ≤ π/2, y ≠ 0', id: '−π/2 ≤ y ≤ π/2, y ≠ 0' },
    note: { en: 'The arccosecant falls on both pieces of its graph, with the negative of the arcsecant’s slope, since arccsc x = π/2 − arcsec x.', id: 'Arkus kosekan turun pada kedua bagian grafiknya, dengan gradien negatif dari gradien arkus sekan, karena arccsc x = π/2 − arcsec x.' },
  },
]

/* ------------------------------------------------------------------- the reference triangle */

export interface RefTriangle {
  /** The angle θ in radians, and the sides with the angle at the vertex between adj and hyp. */
  theta: number
  opp: number
  adj: number
  hyp: number
}

/** The right triangle behind arcsin x (0 < x < 1), arctan x (x > 0) or arcsec x (x > 1): the angle whose sine, tangent or
 *  secant is x, with sides chosen so that the ratio is x. Pythagoras gives the third side. */
export function refTriangle(id: 'arcsin' | 'arctan' | 'arcsec', x: number): RefTriangle {
  if (id === 'arcsin') return { theta: Math.asin(x), opp: x, adj: Math.sqrt(1 - x * x), hyp: 1 }
  if (id === 'arctan') return { theta: Math.atan(x), opp: x, adj: 1, hyp: Math.sqrt(1 + x * x) }
  return { theta: Math.acos(1 / x), opp: Math.sqrt(x * x - 1), adj: 1, hyp: x }
}

/* ------------------------------------------------------------------- the viewing angle */

/** A picture hangs with its lower edge p and its upper edge q above your eye (p < q); standing x away, the angle it fills. */
export const viewAngle = (p: number, q: number, x: number): number => Math.atan(q / x) - Math.atan(p / x)

/** Its rate of change with the distance: −q/(x² + q²) + p/(x² + p²). */
export const viewAngleSlope = (p: number, q: number, x: number): number => -q / (x * x + q * q) + p / (x * x + p * p)

/** The distance that gives the largest angle: the geometric mean √(pq), where the slope is zero. */
export const bestDistance = (p: number, q: number): number => Math.sqrt(p * q)

/** The largest angle: arctan((q − p) / (2√(pq))). */
export const maxViewAngle = (p: number, q: number): number => Math.atan((q - p) / (2 * Math.sqrt(p * q)))
