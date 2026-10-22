/** The picture on each article's card.
 *
 *  A cover is a small SVG drawn from the article's own subject: the number line with π and √2, the square on the
 *  hypotenuse, a tangent line to a parabola, the product-rule rectangle. It is built here as a string rather than a
 *  React tree so that the same drawing serves two places: the running list page (which puts the string in a
 *  wrapper) and the build step that writes the static HTML of the list (`tools/prerender-articles.mjs`), which
 *  cannot render React. Colors are classes (`sa`, `pb`, ...) defined in styles.css, so a cover follows the light and
 *  dark theme like every figure does. Text inside a cover is symbols and numbers only, so it needs no translation.
 *
 *  Add a cover for a new article by adding its id to COVERS; an article without one gets the plain `generic` drawing. */

const W = 400
const H = 200

const n1 = (x: number): string => String(Math.round(x * 10) / 10)

const line = (x1: number, y1: number, x2: number, y2: number, cls: string, w = 3, dash = ''): string =>
  `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`

const poly = (pts: [number, number][], cls: string): string => `<polygon points="${pts.map(([x, y]) => `${n1(x)},${n1(y)}`).join(' ')}" class="${cls}"/>`
const rect = (x: number, y: number, w: number, h: number, cls: string, r = 3): string => `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${r}" class="${cls}"/>`
const dot = (x: number, y: number, cls: string, r = 5.5): string => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${r}" class="${cls}"/>`
const path = (d: string, cls: string, w = 3, dash = ''): string => `<path d="${d}" class="${cls}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`
const text = (x: number, y: number, s: string, size = 16, cls = '', anchor = 'middle'): string =>
  `<text x="${n1(x)}" y="${n1(y)}" font-size="${size}" text-anchor="${anchor}" class="${cls}">${s}</text>`

/** The graph of f as a path over [x0, x1], through the maps X and Y, skipping what leaves the picture. */
function curve(f: (x: number) => number, x0: number, x1: number, X: (x: number) => number, Y: (y: number) => number, cls: string, w = 3.2, n = 90, dash = ''): string {
  let d = ''
  let pen = false
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n
    const y = Y(f(x))
    if (!Number.isFinite(y) || y < -20 || y > H + 20) {
      pen = false
      continue
    }
    d += `${pen ? 'L' : 'M'}${n1(X(x))},${n1(y)}`
    pen = true
  }
  return path(d, cls, w, dash)
}

/** A tick-marked horizontal axis from x1 to x2 at height y. */
const axis = (x1: number, x2: number, y: number): string => line(x1, y, x2, y, 'sm', 2)

/* ------------------------------------------------------------------ the covers */

const realNumbers = (): string => {
  const X = (v: number) => 44 + v * 74
  const y = 118
  let s = axis(20, 380, y) + path(`M372,${y - 6}L382,${y}L372,${y + 6}`, 'sm', 2)
  for (let v = 0; v <= 4; v++) s += line(X(v), y - 7, X(v), y + 7, 'sm', 2) + text(X(v), y + 28, String(v), 15, 'tm')
  const marks: [number, string, string, number][] = [
    [0.5, '½', 'fc', 42],
    [Math.SQRT2, '√2', 'fa', 70],
    [Math.E, 'e', 'fr', 42],
    [Math.PI, 'π', 'fb', 70],
  ]
  for (const [v, label, cls, up] of marks) s += line(X(v), y, X(v), y - up + 14, 'sm', 1.4, '3 3') + dot(X(v), y, cls, 6) + text(X(v), y - up, label, 22, '')
  return s
}

const chineseNumbers = (): string => {
  const chars = ['一', '二', '三', '四', '五']
  let s = ''
  chars.forEach((c, i) => {
    const cx = 56 + i * 72
    s += `<text x="${cx}" y="112" font-size="60" text-anchor="middle" class="zh" lang="zh-Hans">${c}</text>`
    for (let k = 0; k <= i; k++) s += line(cx - 22 + k * 11, 138, cx - 22 + k * 11, 172, 'sb', 4)
  })
  return s
}

const exponents = (): string => {
  const X = (x: number) => 70 + x * 92
  const Y = (y: number) => 172 - y * 50
  return axis(50, 360, 172) + line(70, 190, 70, 14, 'sm', 2) + line(X(0), Y(0), X(3), Y(3), 'sm', 2, '6 5') + curve((x) => x * x, 0, 1.76, X, Y, 'sa') + curve(Math.sqrt, 0, 3, X, Y, 'sb') + text(X(1.55), Y(2.7) - 4, 'x²', 20, '') + text(X(2.75), Y(1.5), '√x', 20, '')
}

const algebra = (): string => {
  const x0 = 96
  const y0 = 28
  const wx = 132
  const w3 = 72
  const hx = 92
  const h2 = 52
  return (
    rect(x0, y0, wx, hx, 'pa') +
    rect(x0 + wx, y0, w3, hx, 'pb') +
    rect(x0, y0 + hx, wx, h2, 'pb') +
    rect(x0 + wx, y0 + hx, w3, h2, 'pc') +
    text(x0 + wx / 2, y0 + hx / 2 + 8, 'x²', 26) +
    text(x0 + wx + w3 / 2, y0 + hx / 2 + 7, '3x', 22) +
    text(x0 + wx / 2, y0 + hx + h2 / 2 + 7, '2x', 22) +
    text(x0 + wx + w3 / 2, y0 + hx + h2 / 2 + 7, '6', 22) +
    text(x0 + wx / 2, y0 - 8, 'x', 17, 'tm') +
    text(x0 + wx + w3 / 2, y0 - 8, '+3', 17, 'tm') +
    text(x0 - 14, y0 + hx / 2 + 6, 'x', 17, 'tm') +
    text(x0 - 22, y0 + hx + h2 / 2 + 6, '+2', 17, 'tm')
  )
}

const integers = (): string => {
  const X = (v: number) => 200 + v * 34
  const y = 124
  let s = axis(20, 380, y)
  for (let v = -5; v <= 5; v++) s += line(X(v), y - 7, X(v), y + 7, v === 0 ? 'st' : 'sm', v === 0 ? 3 : 2) + (v % 5 === 0 ? text(X(v), y + 28, String(v), 15, 'tm') : '')
  s += path(`M${X(-3)},${y - 8}Q${(X(-3) + X(2)) / 2},${y - 92} ${X(2)},${y - 8}`, 'sb', 3.4)
  s += path(`M${X(2) - 9},${y - 24}L${X(2)},${y - 8}L${X(2) - 17},${y - 10}`, 'sb', 3)
  return s + dot(X(-3), y, 'fr', 6.5) + dot(X(2), y, 'fa', 6.5) + text((X(-3) + X(2)) / 2, y - 70, '+5', 20, '') + text(X(-3), y + 28, '−3', 15, 'tm') + text(X(2), y + 28, '2', 15, 'tm')
}

const rationals = (): string => {
  let s = ''
  const rows: [number, number, string][] = [
    [2, 1, '½'],
    [4, 2, '2/4'],
    [6, 3, '3/6'],
  ]
  rows.forEach(([parts, filled, label], i) => {
    const y = 28 + i * 52
    const w = 270
    const x0 = 44
    for (let k = 0; k < parts; k++) s += rect(x0 + (k * w) / parts + 1.5, y, w / parts - 3, 36, k < filled ? 'pa' : 'pm', 4)
    s += text(354, y + 26, label, 21, '')
  })
  return s
}

const irrational = (): string => {
  const x0 = 96
  const yb = 160
  const u = 104
  let s = axis(48, 370, yb) + rect(x0, yb - u, u, u, 'pa', 2)
  s += line(x0, yb, x0 + u, yb - u, 'sr', 4)
  s += path(`M${n1(x0 + u)},${yb - u}A${n1(u * Math.SQRT2)},${n1(u * Math.SQRT2)} 0 0 1 ${n1(x0 + u * Math.SQRT2)},${yb}`, 'sr', 2.4, '5 4')
  s += dot(x0, yb, 'fm', 4.5) + dot(x0 + u, yb, 'fm', 4.5) + dot(x0 + u * Math.SQRT2, yb, 'fr', 7)
  return s + text(x0, yb + 26, '0', 15, 'tm') + text(x0 + u, yb + 26, '1', 15, 'tm') + text(x0 + u * Math.SQRT2 + 6, yb + 28, '√2', 19, '') + text(x0 + u / 2 - 14, yb - u / 2 - 4, '√2', 18, '')
}

const binary = (): string => {
  const bits = [1, 0, 1, 1, 0, 1, 0, 0]
  const vals = [128, 64, 32, 16, 8, 4, 2, 1]
  let s = ''
  bits.forEach((b, i) => {
    const x = 28 + i * 44
    s += rect(x, 58, 38, 52, b ? 'pa' : 'pm', 6) + text(x + 19, 94, String(b), 30, '') + text(x + 19, 130, String(vals[i]), 13, 'tm')
  })
  return s + text(200, 172, '128 + 32 + 16 + 4 = 180', 17, 'tm')
}

const arithmetic = (): string => {
  let s = axis(30, 372, 182)
  const pts: string[] = []
  for (let i = 0; i < 7; i++) {
    const h = 26 + i * 20
    const x = 48 + i * 48
    s += rect(x, 182 - h, 30, h, 'pa', 3)
    pts.push(`${n1(x + 15)},${n1(182 - h)}`)
  }
  s += path(`M${pts.join('L')}`, 'sr', 2.6, '2 6')
  return s + pts.map((p) => dot(Number(p.split(',')[0]), Number(p.split(',')[1]), 'fr', 4.5)).join('')
}

const geometric = (): string => {
  let s = axis(30, 372, 182)
  const pts: [number, number][] = []
  for (let i = 0; i < 5; i++) {
    const h = 10 * 2 ** i
    const x = 56 + i * 66
    s += rect(x, 182 - h, 42, h, 'pb', 3)
    pts.push([x + 21, 182 - h])
  }
  return s + curve((x) => 10 * 2 ** x, 0, 4, (x) => 77 + x * 66, (y) => 182 - y, 'sa', 3, 60) + pts.map(([x, y]) => dot(x, y, 'fa', 4.5)).join('')
}

const quadrilaterals = (): string => {
  const at = (cx: number, pts: [number, number][], cls: string) => poly(pts.map(([x, y]) => [cx + x, 100 + y] as [number, number]), cls)
  return (
    at(48, [[-26, -26], [26, -26], [26, 26], [-26, 26]], 'pa') +
    at(124, [[-34, -22], [34, -22], [34, 22], [-34, 22]], 'pb') +
    at(200, [[-30, 24], [14, 24], [34, -24], [-10, -24]], 'pc') +
    at(276, [[-34, 24], [34, 24], [18, -24], [-18, -24]], 'pr') +
    at(352, [[0, -36], [26, -8], [0, 36], [-26, -8]], 'pm')
  )
}

const triangles = (): string => {
  const A: [number, number] = [78, 162]
  const B: [number, number] = [322, 162]
  const C: [number, number] = [190, 30]
  const mid = (p: [number, number], q: [number, number]): [number, number] => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  const G: [number, number] = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3]
  const mAB = mid(A, B)
  const mBC = mid(B, C)
  const mCA = mid(C, A)
  return (
    poly([A, B, C], 'pa') +
    line(C[0], C[1], mAB[0], mAB[1], 'sb', 2.4, '6 5') +
    line(A[0], A[1], mBC[0], mBC[1], 'sb', 2.4, '6 5') +
    line(B[0], B[1], mCA[0], mCA[1], 'sb', 2.4, '6 5') +
    dot(G[0], G[1], 'fr', 7) +
    text(A[0] - 12, A[1] + 6, 'A', 17) +
    text(B[0] + 12, B[1] + 6, 'B', 17) +
    text(C[0], C[1] - 10, 'C', 17)
  )
}

const circles = (): string => {
  const cx = 170
  const cy = 100
  const r = 72
  const a = (30 * Math.PI) / 180
  const P: [number, number] = [cx + r * Math.cos(a), cy - r * Math.sin(a)]
  const d: [number, number] = [Math.sin(a), Math.cos(a)]
  const Q1: [number, number] = [cx + r * Math.cos((165 * Math.PI) / 180), cy - r * Math.sin((165 * Math.PI) / 180)]
  const Q2: [number, number] = [cx + r * Math.cos((285 * Math.PI) / 180), cy - r * Math.sin((285 * Math.PI) / 180)]
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" class="pa"/>` +
    line(P[0] - 110 * d[0], P[1] - 110 * d[1], P[0] + 110 * d[0], P[1] + 110 * d[1], 'sr', 3) +
    line(cx, cy, P[0], P[1], 'sb', 3) +
    line(Q1[0], Q1[1], Q2[0], Q2[1], 'sm', 2.4, '6 5') +
    dot(cx, cy, 'fm', 4.5) +
    dot(P[0], P[1], 'fr', 6.5) +
    text(cx - 12, cy + 24, 'O', 16, 'tm') +
    text(P[0] + 16, P[1] - 10, 'P', 17)
  )
}

const pythagoras = (): string => {
  const dx = 95
  const u = 15
  const X = (x: number) => x + dx
  const C: [number, number] = [125, 128]
  const B: [number, number] = [C[0] + 4 * u, C[1]]
  const A: [number, number] = [C[0], C[1] - 3 * u]
  const n: [number, number] = [3 * u, -4 * u]
  const P = (pts: [number, number][]) => pts.map(([x, y]) => [X(x), y] as [number, number])
  return (
    poly(P([C, B, [B[0], B[1] + 4 * u], [C[0], C[1] + 4 * u]]), 'pb') +
    poly(P([A, C, [C[0] - 3 * u, C[1]], [A[0] - 3 * u, A[1]]]), 'pa') +
    poly(P([A, B, [B[0] + n[0], B[1] + n[1]], [A[0] + n[0], A[1] + n[1]]]), 'pr') +
    poly(P([C, B, A]), 'pm') +
    text(X(C[0] + 2 * u), C[1] + 2 * u + 8, '4²', 21) +
    text(X(C[0] - 1.5 * u), C[1] - 1.5 * u + 8, '3²', 21) +
    text(X(A[0] + 2 * u + 1.5 * u), A[1] + 1.5 * u - 2 * u + 4, '5²', 21)
  )
}

const tangentLines = (): string => {
  const X = (x: number) => 84 + (x + 2) * 58
  const Y = (y: number) => 178 - y * 28
  const q = 2.2
  return (
    axis(40, 370, 178) +
    curve((x) => x * x, -1.9, 2.55, X, Y, 'sa') +
    curve((x) => (Math.pow(q, 2) - 1) / (q - 1) * (x - 1) + 1, 0.1, 2.5, X, Y, 'sb', 2.6, 10, '7 5') +
    curve((x) => 2 * x - 1, -0.5, 2.1, X, Y, 'sr', 3.4, 10) +
    dot(X(1), Y(1), 'fr', 7) +
    dot(X(q), Y(q * q), 'fb', 5.5) +
    text(X(1) - 14, Y(1) + 8, 'P', 17) +
    text(X(q) + 14, Y(q * q) - 6, 'Q', 17)
  )
}

const derivativeFunction = (): string => {
  const panel = (x0: number): string => rect(x0, 14, 176, 172, 'pm', 8)
  const XL = (x: number) => 24 + (x + 2.2) * (168 / 4.4)
  const YL = (y: number) => 100 - y * 17
  const XR = (x: number) => 208 + (x + 2.2) * (168 / 4.4)
  const YR = (y: number) => 158 - (y + 3) * 8.4
  return (
    panel(16) +
    panel(200) +
    curve((x) => x ** 3 - 3 * x, -2.2, 2.2, XL, YL, 'sa') +
    curve((x) => 3 * x * x - 3, -2.2, 2.2, XR, YR, 'sb') +
    line(XR(-2.2), YR(0), XR(2.2), YR(0), 'sm', 1.6, '4 4') +
    dot(XL(-1), YL(2), 'fr', 5.5) +
    dot(XL(1), YL(-2), 'fr', 5.5) +
    dot(XR(-1), YR(0), 'fr', 5.5) +
    dot(XR(1), YR(0), 'fr', 5.5) +
    text(104, 36, 'f', 19) +
    text(288, 36, "f′", 19)
  )
}

const differentiationRules = (): string => {
  const x0 = 78
  const yb = 150
  const w = 150
  const h = 84
  const dw = 44
  const dh = 32
  return (
    rect(x0, yb - h, w, h, 'pa', 2) +
    rect(x0 + w, yb - h, dw, h, 'pb', 2) +
    rect(x0, yb - h - dh, w, dh, 'pc', 2) +
    rect(x0 + w, yb - h - dh, dw, dh, 'pr', 2) +
    text(x0 + w / 2, yb - h / 2 + 8, 'uv', 28) +
    text(x0 + w + dw / 2, yb - h / 2 + 5, 'vΔu', 14) +
    text(x0 + w / 2, yb - h - dh / 2 + 6, 'uΔv', 16) +
    text(x0 + w / 2, yb + 26, '(uv)′ = u′v + uv′', 18, 'tm')
  )
}

const rateOfChange = (): string => {
  const X = (t: number) => 44 + t * 31
  const Ys = (s: number) => 92 - s * 0.55
  const Yv = (v: number) => 148 - v * 0.62
  return (
    line(X(0), Ys(0), X(10), Ys(0), 'sm', 2) +
    line(X(0), Yv(0), X(10), Yv(0), 'sm', 2) +
    line(X(5), Ys(122.5), X(5), Yv(-49), 'sm', 1.6, '4 4') +
    curve((t) => 49 * t - 4.9 * t * t, 0, 10, X, Ys, 'sa', 3.4) +
    curve((t) => 49 - 9.8 * t, 0, 10, X, Yv, 'sb', 3.4, 10) +
    dot(X(5), Ys(122.5), 'fr', 6.5) +
    dot(X(5), Yv(0), 'fr', 6.5) +
    text(362, 36, 's', 20) +
    text(362, 172, 'v', 20)
  )
}

const trigonometry = (): string => {
  const X = (x: number) => 24 + x * (352 / (2 * Math.PI))
  const Y = (y: number) => 100 - y * 62
  const a = 0.95
  const m = Math.cos(a)
  return (
    axis(16, 384, Y(0)) +
    curve(Math.sin, 0, 2 * Math.PI, X, Y, 'sa', 3.4, 120) +
    curve(Math.cos, 0, 2 * Math.PI, X, Y, 'sb', 3, 120, '7 5') +
    curve((x) => Math.sin(a) + m * (x - a), a - 0.6, a + 0.6, X, Y, 'sr', 3.2, 10) +
    line(X(a), Y(Math.sin(a)), X(a), Y(m), 'sm', 1.5, '3 3') +
    dot(X(a), Y(Math.sin(a)), 'fr', 6.5) +
    dot(X(a), Y(m), 'fr', 5) +
    text(X(2.5), Y(1) - 12, 'sin', 17) +
    text(X(5.3), Y(1) - 12, 'cos', 17)
  )
}

const chainRule = (): string => {
  const cx = [78, 200, 322]
  const y = 76
  const arrow = (x1: number, x2: number): string => line(x1, y, x2, y, 'st', 2.6) + path(`M${x2 - 9},${y - 7}L${x2},${y}L${x2 - 9},${y + 7}`, 'st', 2.6)
  return (
    dot(cx[0], y, 'pa', 36) +
    dot(cx[1], y, 'pb', 36) +
    dot(cx[2], y, 'pr', 36) +
    arrow(cx[0] + 40, cx[1] - 40) +
    arrow(cx[1] + 40, cx[2] - 40) +
    text(cx[0], y + 9, 'x', 28) +
    text(cx[1], y + 9, 'u', 28) +
    text(cx[2], y + 9, 'y', 28) +
    text((cx[0] + cx[1]) / 2, y - 14, 'g', 19, 'tm') +
    text((cx[1] + cx[2]) / 2, y - 14, 'f', 19, 'tm') +
    path('M78,128C120,150 280,150 322,128', 'sm', 2, '5 5') +
    text(200, 176, 'dy/dx = dy/du · du/dx', 19)
  )
}

const implicitDifferentiation = (): string => {
  const X = (x: number) => 54 + x * 36
  const Y = (y: number) => 176 - y * 31
  // the folium of Descartes, x³ + y³ = 9xy, drawn from its parametrization t = tan φ
  let d = ''
  for (let i = 0; i <= 160; i++) {
    const t = Math.tan((i / 160) * 1.5707)
    const x = (9 * t) / (1 + t ** 3)
    const y = (9 * t * t) / (1 + t ** 3)
    d += `${i ? 'L' : 'M'}${n1(X(x))},${n1(Y(y))}`
  }
  return (
    line(20, Y(0), 380, Y(0), 'sm', 2) +
    line(X(0), 190, X(0), 12, 'sm', 2) +
    path(d, 'sa', 3.6) +
    line(X(0.2), Y(4 + 0.8 * -1.8), X(4.2), Y(4 + 0.8 * 2.2), 'sb', 3) +
    line(X(0.8), Y(4 - 1.25 * -1.2), X(3.2), Y(4 - 1.25 * 1.2), 'sr', 3, '7 5') +
    dot(X(2), Y(4), 'fr', 6.5) +
    text(330, 78, 'y′', 46) +
    text(330, 112, 'x³+y³=9xy', 16, 'tm')
  )
}

const inverseLogarithms = (): string => {
  const X = (x: number) => 200 + x * 52
  const Y = (y: number) => 100 - y * 52
  return (
    line(24, Y(0), 376, Y(0), 'sm', 2) +
    line(X(0), 190, X(0), 10, 'sm', 2) +
    line(X(-2.4), Y(-2.4), X(2.4), Y(2.4), 'sm', 1.6, '6 5') +
    curve(Math.exp, -2.4, 1.85, X, Y, 'sa', 3.6, 100) +
    curve(Math.log, 0.09, 3.4, X, Y, 'sb', 3.6, 100) +
    dot(X(1), Y(Math.E), 'fr', 6) +
    dot(X(Math.E), Y(1), 'fr', 6) +
    text(X(1.35) + 8, Y(2.9), 'eˣ', 22) +
    text(X(3.1), Y(0.75) + 12, 'ln x', 20)
  )
}

const inverseTrig = (): string => {
  // y = arctan x with its two horizontal asymptotes, and the right triangle that defines it
  const X = (x: number) => 150 + x * 26
  const Y = (y: number) => 100 - y * 46
  return (
    line(20, Y(0), 380, Y(0), 'sm', 2) +
    line(X(0), 190, X(0), 10, 'sm', 2) +
    line(20, Y(Math.PI / 2), 380, Y(Math.PI / 2), 'sm', 1.6, '6 5') +
    line(20, Y(-Math.PI / 2), 380, Y(-Math.PI / 2), 'sm', 1.6, '6 5') +
    curve(Math.atan, -5.6, 5.6, X, Y, 'sa', 3.6, 100) +
    poly([[274, 150], [374, 150], [374, 92]], 'pb') +
    path('M300,150 A26,26 0 0 0 297,139', 'sr', 3) +
    text(311, 143, 'θ', 17) +
    dot(X(1), Y(Math.PI / 4), 'fr', 5.5) +
    text(86, Y(Math.PI / 2) - 8, 'π/2', 16, 'tm')
  )
}

const relatedRates = (): string =>
  // a ladder leaning on a wall: the foot slides out, the top slides down, and the triangle x, y, L that ties the two
  line(70, 26, 70, 172, 'sm', 3) +
  line(70, 172, 370, 172, 'sm', 3) +
  poly([[70, 52], [70, 172], [236, 172]], 'pb') +
  line(70, 52, 236, 172, 'sa', 5) +
  line(236, 172, 312, 172, 'sr', 3.4) +
  poly([[308, 163], [326, 172], [308, 181]], 'fr') +
  line(70, 52, 70, 108, 'sr', 3.4) +
  poly([[61, 104], [70, 122], [79, 104]], 'fr') +
  dot(70, 52, 'fr', 6) +
  dot(236, 172, 'fr', 6) +
  text(153, 194, 'x', 17) +
  text(50, 118, 'y', 17) +
  text(176, 104, 'L', 17)

const linearization = (): string => {
  // y = sqrt(x) with its tangent line at x = 4, and the rise dy next to the true change
  const X = (x: number) => 40 + x * 62
  const Y = (y: number) => 176 - y * 62
  const f = Math.sqrt
  const L = (x: number) => 2 + (x - 4) / 4
  return (
    line(20, Y(0), 380, Y(0), 'sm', 2) +
    line(X(0), 190, X(0), 10, 'sm', 2) +
    line(X(0.6), Y(L(0.6)), X(5.7), Y(L(5.7)), 'sr', 3, '8 5') +
    curve(f, 0.05, 5.8, X, Y, 'sa', 3.6, 100) +
    line(X(4), Y(2), X(5), Y(2), 'sm', 2.4, '5 4') +
    line(X(5), Y(2), X(5), Y(L(5)), 'sr', 4) +
    line(X(5), Y(L(5)), X(5), Y(f(5)), 'sm', 4) +
    dot(X(4), Y(2), 'fr', 6) +
    dot(X(5), Y(f(5)), 'fr', 5)
  )
}

const extremeValues = (): string => {
  // y = x^3 - 3x on [-2, 3]: the largest and the smallest value, taken at the right end and at two places
  const X = (x: number) => 50 + (x + 2) * 60
  const Y = (y: number) => 172 - (y + 2) * 7.6
  const f = (x: number) => x ** 3 - 3 * x
  return (
    line(X(-2), 16, X(-2), 188, 'sm', 2, '6 5') +
    line(X(3), 16, X(3), 188, 'sm', 2, '6 5') +
    line(30, Y(18), X(3), Y(18), 'sr', 2.4, '8 5') +
    line(30, Y(-2), X(3), Y(-2), 'sr', 2.4, '8 5') +
    curve(f, -2, 3, X, Y, 'sa', 3.8, 100) +
    dot(X(3), Y(18), 'fr', 6.5) +
    dot(X(1), Y(-2), 'fr', 6.5) +
    dot(X(-2), Y(-2), 'fr', 6.5) +
    dot(X(-1), Y(2), 'fr', 4.5) +
    text(X(3) + 20, Y(18) + 5, 'M', 16) +
    text(X(3) + 20, Y(-2) + 5, 'm', 16)
  )
}

const meanValue = (): string => {
  // a curve, the secant through its two ends, and the tangent parallel to it where the theorem puts the point c
  const f = (x: number) => 0.55 * x + 0.9 * Math.sin(1.25 * x) + 0.8
  const df = (x: number) => 0.55 + 1.125 * Math.cos(1.25 * x)
  const X = (x: number) => 36 + x * 84
  const Y = (y: number) => 176 - y * 38
  const a = 0.3
  const b = 3.9
  const m = (f(b) - f(a)) / (b - a)
  let c = a
  for (let i = 1; i <= 2000; i++) {
    const x0 = a + ((b - a) * (i - 1)) / 2000
    const x1 = a + ((b - a) * i) / 2000
    if ((df(x0) - m) * (df(x1) - m) <= 0) {
      c = (x0 + x1) / 2
      break
    }
  }
  const L = (x: number) => f(a) + m * (x - a)
  const T = (x: number) => f(c) + m * (x - c)
  return (
    axis(20, 390, 182) +
    line(X(a), Y(f(a)), X(a), 182, 'sm', 2, '5 4') +
    line(X(b), Y(f(b)), X(b), 182, 'sm', 2, '5 4') +
    line(X(a - 0.15), Y(L(a - 0.15)), X(b + 0.15), Y(L(b + 0.15)), 'sb', 3) +
    line(X(c - 1.5), Y(T(c - 1.5)), X(c + 1.5), Y(T(c + 1.5)), 'sr', 3, '8 5') +
    curve(f, 0, 4.1, X, Y, 'sa', 3.8, 100) +
    dot(X(a), Y(f(a)), 'fb', 6) +
    dot(X(b), Y(f(b)), 'fb', 6) +
    dot(X(c), Y(f(c)), 'fr', 6.5) +
    text(X(a) - 4, 198, 'a', 15) +
    text(X(b) + 4, 198, 'b', 15) +
    text(X(c) + 14, Y(f(c)) + 22, 'c', 16)
  )
}

const monotonic = (): string => {
  // y = x^3 - 12x - 5: dark where it rises, orange where it falls, a dot at each turning point and the signs of f'
  const f = (x: number) => x ** 3 - 12 * x - 5
  const X = (x: number) => 200 + x * 46
  const Y = (y: number) => 95 - y * 3.4
  return (
    axis(20, 390, Y(0)) +
    line(X(-2), 24, X(-2), 188, 'sm', 2, '6 5') +
    line(X(2), 24, X(2), 188, 'sm', 2, '6 5') +
    line(X(-2) - 34, Y(f(-2)), X(-2) + 34, Y(f(-2)), 'sr', 3) +
    line(X(2) - 34, Y(f(2)), X(2) + 34, Y(f(2)), 'sr', 3) +
    curve(f, -4, -2, X, Y, 'sa', 4, 40) +
    curve(f, -2, 2, X, Y, 'sb', 4, 60) +
    curve(f, 2, 4, X, Y, 'sa', 4, 40) +
    dot(X(-2), Y(f(-2)), 'fr', 6.5) +
    dot(X(2), Y(f(2)), 'fr', 6.5) +
    text(X(-3), 190, '+', 20) +
    text(X(0), 190, '\u2212', 20) +
    text(X(3), 190, '+', 20)
  )
}

const concavityCover = (): string => {
  // y = x^3/4 + x/2: concave down (orange) before the inflection point and concave up (dark) after it, with the tangent that the curve crosses
  const f = (x: number) => x ** 3 / 4 + x / 2
  const X = (x: number) => 200 + x * 58
  const Y = (y: number) => 100 - y * 9
  const m = 0.5
  return (
    axis(20, 390, Y(0)) +
    line(X(0), 20, X(0), 188, 'sm', 2, '6 5') +
    line(X(-2.7), Y(-2.7 * m), X(2.7), Y(2.7 * m), 'sr', 3, '8 5') +
    curve(f, -3, 0, X, Y, 'sb', 4.2, 50) +
    curve(f, 0, 3, X, Y, 'sa', 4.2, 50) +
    dot(X(0), Y(0), 'fr', 7) +
    text(X(-1.7), Y(f(-1.7)) - 18, '\u2212', 20) +
    text(X(1.7), Y(f(1.7)) + 30, '+', 20)
  )
}

const lhopitalCover = (): string => {
  // y = sin x / x: the 0/0 form at the origin is a hole, filled by the limit 1; the curve's two sides are dark, the limit line orange
  const f = (x: number) => (Math.abs(x) < 1e-9 ? 1 : Math.sin(x) / x)
  const X = (x: number) => 200 + x * 24
  const Y = (y: number) => 160 - y * 100
  return (
    axis(20, 390, Y(0)) +
    line(X(0), 20, X(0), 188, 'sm', 2, '6 5') +
    line(20, Y(1), 390, Y(1), 'sr', 2.5, '8 5') +
    curve(f, -7.5, -0.12, X, Y, 'sa', 4.2, 90) +
    curve(f, 0.12, 7.5, X, Y, 'sa', 4.2, 90) +
    dot(X(0), Y(1), 'fr', 8) +
    dot(X(0), Y(1), 'bg', 4.2) +
    text(X(0) + 20, Y(1) - 10, '1', 17)
  )
}

const optimizationCover = (): string => {
  // A(r) = 2 pi r^2 + 2000 / r, the metal in a one-liter can: the dark curve falls, reaches its lowest point (orange) where the tangent is flat, and rises again
  const f = (x: number) => 2 * x * x + 6 / x
  const X = (x: number) => 40 + x * 108
  const Y = (y: number) => 192 - y * 11.2
  const xm = Math.cbrt(1.5)
  return (
    axis(20, 390, 192) +
    line(X(xm), 20, X(xm), 192, 'sm', 2, '6 5') +
    line(X(xm) - 78, Y(f(xm)), X(xm) + 78, Y(f(xm)), 'sr', 3, '8 5') +
    curve(f, 0.58, 2.98, X, Y, 'sa', 4.2, 80) +
    dot(X(xm), Y(f(xm)), 'fr', 7.5)
  )
}

const newtonCover = (): string => {
  // y = x^3 - x - 1: Newton's method from x0 = 2.4 (orange: the tangent lines going down to the axis, the dark curve above) with the root marked where the steps end
  const f = (x: number) => x * x * x - x - 1
  const df = (x: number) => 3 * x * x - 1
  const X = (x: number) => 70 + x * 112
  const Y = (y: number) => 150 - y * 9
  let art = axis(20, 390, Y(0)) + curve(f, 0.35, 2.55, X, Y, 'sa', 4.2, 80)
  let x = 2.4
  for (let i = 0; i < 3; i++) {
    const next = x - f(x) / df(x)
    art += line(X(x), Y(0), X(x), Y(f(x)), 'sm', 2, '5 4') + line(X(x), Y(f(x)), X(next), Y(0), 'sr', 3) + dot(X(x), Y(0), 'fb', 5.5)
    x = next
  }
  return art + dot(X(1.3247), Y(0), 'fr', 7)
}

const generic = (): string => {
  const X = (x: number) => 60 + x * 70
  const Y = (y: number) => 160 - y * 60
  return axis(40, 370, 160) + line(60, 184, 60, 20, 'sm', 2) + curve((x) => Math.sqrt(Math.max(x, 0)) * 1.2 + 0.1, 0, 4, X, Y, 'sa')
}

const COVERS: Record<string, () => string> = {
  'newtons-method': newtonCover,
  'applied-optimization': optimizationCover,
  'indeterminate-forms-and-lhopitals-rule': lhopitalCover,
  'real-numbers': realNumbers,
  'chinese-numbers': chineseNumbers,
  'exponents-and-radicals': exponents,
  'algebraic-expressions': algebra,
  integers,
  'rational-numbers': rationals,
  'irrational-numbers': irrational,
  'binary-numbers': binary,
  'arithmetic-sequences-and-series': arithmetic,
  'geometric-sequences-and-series': geometric,
  quadrilaterals,
  triangles,
  circles,
  'pythagorean-theorem': pythagoras,
  'tangent-lines-and-derivative-at-a-point': tangentLines,
  'the-derivative-as-a-function': derivativeFunction,
  'differentiation-rules': differentiationRules,
  'the-derivative-as-a-rate-of-change': rateOfChange,
  'derivatives-of-trigonometric-functions': trigonometry,
  'the-chain-rule': chainRule,
  'implicit-differentiation': implicitDifferentiation,
  'derivatives-of-inverse-functions-and-logarithms': inverseLogarithms,
  'inverse-trigonometric-functions': inverseTrig,
  'related-rates': relatedRates,
  'linearization-and-differentials': linearization,
  'extreme-values-on-closed-intervals': extremeValues,
  'the-mean-value-theorem': meanValue,
  'concavity-and-curve-sketching': concavityCover,
  'monotonic-functions-and-the-first-derivative-test': monotonic,
}

/** Ids that have their own drawing, for the checker. */
export const coverIds = (): string[] => Object.keys(COVERS)

/** The whole `<svg>` of an article's cover, as markup. Decorative: the card already carries the title. */
export function coverSvg(id: string): string {
  const art = (COVERS[id] ?? generic)()
  return `<svg class="cv" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice"><rect width="${W}" height="${H}" class="bg"/>${art}</svg>`
}
