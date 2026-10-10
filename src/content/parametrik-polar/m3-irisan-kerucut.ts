import type { Module } from '../types'
import type { Figure, FigColor, FigItem } from '../../lib/figure'

/** Module 3 — the conic sections. First as loci in rectangular coordinates
 *  (a focus and a directrix, or two foci), with their standard and shifted
 *  equations and a classification of the general second-degree equation;
 *  then in polar coordinates, where one eccentricity-based equation covers
 *  every conic at once. */

const TAU = 6.2832

/** A straight segment between two points that may depend on the sliders —
 *  a `seg` item only takes fixed numbers, so it is drawn as a `param` item
 *  that runs `t` from 0 to 1 along the segment. */
const link = (x0: string, y0: string, x1: string, y1: string, color: FigColor): FigItem => ({
  t: 'param',
  x: `(${x0})+((${x1})-(${x0}))*t`,
  y: `(${y0})+((${y1})-(${y0}))*t`,
  from: 0,
  to: 1,
  color,
  dashed: true,
})

/* ------------------------------------------------------------------ figures */

/** Parabola x² = 4py with its focus, directrix and a point P that slides. */
const figParabola: Figure = {
  dim: 2,
  xSpan: [-6, 6],
  ySpan: [-4, 8],
  ticks: true,
  params: [
    { name: 'p', min: 1, max: 3, step: 0.1, value: 1.5, label: 'p' },
    { name: 's', min: -4, max: 4, step: 0.1, value: 3, label: 's' },
  ],
  items: [
    { t: 'curve', f: 'x^2/(4*p)', from: -6, to: 6, color: 'a' },
    { t: 'hline', y: '-p', color: 'muted', label: 'y = −p' },
    link('s', 's^2/(4*p)', '0', 'p', 'result'),
    link('s', 's^2/(4*p)', 's', '-p', 'b'),
    { t: 'dot', x: 0, y: 'p', label: 'F', color: 'result' },
    { t: 'dot', x: 's', y: 's^2/(4*p)', label: 'P', color: 'a' },
    { t: 'dot', x: 's', y: '-p', label: 'D', color: 'b' },
  ],
  caption: {
    en: 'The parabola $y=x^2/(4p)$ with focus $F$ and directrix $y=-p$. Drag $s$ to slide $P$ along it: the dashed segment $PF$ to the focus and the dashed segment $PD$ down to the directrix are always the same length. Drag $p$ to move the focus up and the directrix down together — a larger $p$ makes the parabola wider and flatter.',
    id: 'Parabola $y=x^2/(4p)$ dengan fokus $F$ dan direktriks $y=-p$. Geser $s$ untuk menggeser $P$ sepanjang kurva: ruas putus-putus $PF$ ke fokus dan ruas putus-putus $PD$ turun ke direktriks selalu sama panjang. Geser $p$ untuk menggerakkan fokus naik dan direktriks turun bersamaan — $p$ yang lebih besar membuat parabola lebih lebar dan lebih landai.',
  },
}

/** Ellipse x²/25 + y²/b² = 1, foci at (±c, 0), and a point P with its two focal distances. */
const figEllipse: Figure = {
  dim: 2,
  xSpan: [-6, 6],
  ySpan: [-6, 6],
  ticks: true,
  params: [
    { name: 'b', min: 1, max: 5, step: 0.1, value: 3, label: 'b' },
    { name: 's', min: -3.14, max: 3.14, step: 0.05, value: 1, label: 's' },
  ],
  items: [
    { t: 'param', x: '5*cos(t)', y: 'b*sin(t)', from: 0, to: TAU, color: 'a' },
    link('5*cos(s)', 'b*sin(s)', '-sqrt(25-b^2)', '0', 'result'),
    link('5*cos(s)', 'b*sin(s)', 'sqrt(25-b^2)', '0', 'b'),
    { t: 'dot', x: 5, y: 0, color: 'muted' },
    { t: 'dot', x: -5, y: 0, color: 'muted' },
    { t: 'dot', x: '-sqrt(25-b^2)', y: 0, label: 'F₁', color: 'result' },
    { t: 'dot', x: 'sqrt(25-b^2)', y: 0, label: 'F₂', color: 'b' },
    { t: 'dot', x: '5*cos(s)', y: 'b*sin(s)', label: 'P', color: 'a' },
  ],
  caption: {
    en: 'The ellipse $x^2/25+y^2/b^2=1$, so $a=5$ stays fixed and the foci sit at $(\\pm c,0)$ with $c=\\sqrt{25-b^2}$. Drag $b$: as $b$ shrinks the foci move apart, and at $b=5$ they merge at the center and the ellipse becomes a circle. Drag $s$ to move $P$ — the two dashed segments $PF_1$ and $PF_2$ always add up to $10=2a$.',
    id: 'Elips $x^2/25+y^2/b^2=1$, sehingga $a=5$ tetap dan fokusnya di $(\\pm c,0)$ dengan $c=\\sqrt{25-b^2}$. Geser $b$: saat $b$ mengecil, kedua fokus menjauh, dan pada $b=5$ keduanya menyatu di pusat sehingga elips menjadi lingkaran. Geser $s$ untuk menggerakkan $P$ — kedua ruas putus-putus $PF_1$ dan $PF_2$ selalu berjumlah $10=2a$.',
  },
}

/** Static ellipse for the "read the figure" quiz: vertices (±5, 0), foci (±3, 0). */
const figEllipseQuiz: Figure = {
  dim: 2,
  xSpan: [-6, 6],
  ySpan: [-6, 6],
  ticks: true,
  items: [
    { t: 'param', x: '5*cos(t)', y: '4*sin(t)', from: 0, to: TAU, color: 'a' },
    { t: 'dot', x: 5, y: 0, color: 'muted' },
    { t: 'dot', x: -5, y: 0, color: 'muted' },
    { t: 'dot', x: 3, y: 0, label: 'F₂', color: 'result' },
    { t: 'dot', x: -3, y: 0, label: 'F₁', color: 'result' },
  ],
  caption: {
    en: 'An ellipse centered at the origin. The two gray dots are its vertices on the $x$-axis and the two colored dots are its foci.',
    id: 'Sebuah elips berpusat di titik asal. Dua titik abu-abu adalah puncaknya pada sumbu-$x$ dan dua titik berwarna adalah fokusnya.',
  },
}

/** Hyperbola x²/a² − y²/b² = 1 with asymptotes, vertices, foci and a point P. */
const figHyperbola: Figure = {
  dim: 2,
  xSpan: [-8, 8],
  ySpan: [-8, 8],
  ticks: true,
  params: [
    { name: 'a', min: 1, max: 3, step: 0.1, value: 3, label: 'a' },
    { name: 'b', min: 1, max: 3.5, step: 0.1, value: 2, label: 'b' },
    { name: 's', min: -1.5, max: 1.5, step: 0.05, value: 1, label: 's' },
  ],
  items: [
    { t: 'param', x: 'a*cosh(t)', y: 'b*sinh(t)', from: -2, to: 2, color: 'a' },
    { t: 'param', x: '-a*cosh(t)', y: 'b*sinh(t)', from: -2, to: 2, color: 'a' },
    { t: 'param', x: 't', y: 'b/a*t', from: -8, to: 8, color: 'muted', dashed: true, label: 'asymptotes' },
    { t: 'param', x: 't', y: '-b/a*t', from: -8, to: 8, color: 'muted', dashed: true },
    link('a*cosh(s)', 'b*sinh(s)', '-sqrt(a^2+b^2)', '0', 'result'),
    link('a*cosh(s)', 'b*sinh(s)', 'sqrt(a^2+b^2)', '0', 'b'),
    { t: 'dot', x: 'a', y: 0, color: 'muted' },
    { t: 'dot', x: '-a', y: 0, color: 'muted' },
    { t: 'dot', x: '-sqrt(a^2+b^2)', y: 0, label: 'F₁', color: 'result' },
    { t: 'dot', x: 'sqrt(a^2+b^2)', y: 0, label: 'F₂', color: 'b' },
    { t: 'dot', x: 'a*cosh(s)', y: 'b*sinh(s)', label: 'P', color: 'a' },
  ],
  caption: {
    en: 'The hyperbola $x^2/a^2-y^2/b^2=1$, drawn as $x=\\pm a\\cosh t,\\ y=b\\sinh t$ (because $\\cosh^2t-\\sinh^2t=1$), with its asymptotes $y=\\pm\\frac{b}{a}x$. Drag $a$ and $b$ to move the vertices, push the foci out to $(\\pm\\sqrt{a^2+b^2},0)$ and tilt the asymptotes. Drag $s$ to move $P$ — the two colored segments to the foci always differ in length by exactly $2a$.',
    id: 'Hiperbola $x^2/a^2-y^2/b^2=1$, digambar sebagai $x=\\pm a\\cosh t,\\ y=b\\sinh t$ (karena $\\cosh^2t-\\sinh^2t=1$), dengan asimtot $y=\\pm\\frac{b}{a}x$. Geser $a$ dan $b$ untuk memindahkan puncak, mendorong fokus keluar ke $(\\pm\\sqrt{a^2+b^2},0)$, dan memiringkan asimtot. Geser $s$ untuk menggerakkan $P$ — kedua ruas berwarna ke fokus selalu berbeda panjang tepat $2a$.',
  },
}

/** Ellipse (x−h)²/9 + (y−k)²/4 = 1: the same shape moved by (h, k). */
const figShifted: Figure = {
  dim: 2,
  xSpan: [-8, 8],
  ySpan: [-8, 8],
  ticks: true,
  params: [
    { name: 'h', min: -4, max: 4, step: 0.5, value: 2, label: 'h' },
    { name: 'k', min: -4, max: 4, step: 0.5, value: -1, label: 'k' },
  ],
  items: [
    { t: 'param', x: 'h+3*cos(t)', y: 'k+2*sin(t)', from: 0, to: TAU, color: 'a' },
    { t: 'hline', y: 'k', color: 'muted' },
    { t: 'vline', x: 'h', color: 'muted' },
    { t: 'dot', x: 'h', y: 'k', label: 'C', color: 'muted' },
    { t: 'dot', x: 'h-sqrt(5)', y: 'k', label: 'F₁', color: 'result' },
    { t: 'dot', x: 'h+sqrt(5)', y: 'k', label: 'F₂', color: 'result' },
    { t: 'dot', x: 'h+3', y: 'k', color: 'b' },
    { t: 'dot', x: 'h-3', y: 'k', color: 'b' },
  ],
  caption: {
    en: 'The ellipse $\\frac{(x-h)^2}{9}+\\frac{(y-k)^2}{4}=1$ with its center $C$, foci $F_1,F_2$ at $(h\\pm\\sqrt5,k)$, vertices at $(h\\pm3,k)$, and dashed lines through the center. Drag $h$ to slide it left and right and $k$ to slide it up and down — the shape never changes, only the position.',
    id: 'Elips $\\frac{(x-h)^2}{9}+\\frac{(y-k)^2}{4}=1$ dengan pusat $C$, fokus $F_1,F_2$ di $(h\\pm\\sqrt5,k)$, puncak di $(h\\pm3,k)$, dan garis putus-putus melalui pusat. Geser $h$ untuk menggesernya ke kiri dan kanan dan $k$ ke atas dan bawah — bentuknya tak pernah berubah, hanya posisinya.',
  },
}

/** Static hyperbola for the quiz: vertices (±4, 0), foci (±5, 0), asymptotes y = ±(3/4)x. */
const figHyperbolaQuiz: Figure = {
  dim: 2,
  xSpan: [-8, 8],
  ySpan: [-8, 8],
  ticks: true,
  items: [
    { t: 'param', x: '4*cosh(t)', y: '3*sinh(t)', from: -2, to: 2, color: 'a' },
    { t: 'param', x: '-4*cosh(t)', y: '3*sinh(t)', from: -2, to: 2, color: 'a' },
    { t: 'param', x: 't', y: '0.75*t', from: -8, to: 8, color: 'muted', dashed: true },
    { t: 'param', x: 't', y: '-0.75*t', from: -8, to: 8, color: 'muted', dashed: true },
    { t: 'dot', x: 4, y: 0, color: 'muted' },
    { t: 'dot', x: -4, y: 0, color: 'muted' },
    { t: 'dot', x: 5, y: 0, label: 'F₂', color: 'result' },
    { t: 'dot', x: -5, y: 0, label: 'F₁', color: 'result' },
  ],
  caption: {
    en: 'A hyperbola centered at the origin with its asymptotes dashed. The gray dots are its vertices and the colored dots are its foci.',
    id: 'Sebuah hiperbola berpusat di titik asal dengan asimtot putus-putus. Titik abu-abu adalah puncaknya dan titik berwarna adalah fokusnya.',
  },
}

/** Ellipse with a = 3 and a slider e, showing PF = e · PD against the right directrix. */
const figEccEllipse: Figure = {
  dim: 2,
  xSpan: [-8, 8],
  ySpan: [-8, 8],
  ticks: true,
  params: [
    { name: 'e', min: 0.4, max: 0.95, step: 0.01, value: 0.6, label: 'e' },
    { name: 's', min: -3.14, max: 3.14, step: 0.05, value: 1, label: 's' },
  ],
  items: [
    { t: 'param', x: '3*cos(t)', y: '3*sqrt(1-e^2)*sin(t)', from: 0, to: TAU, color: 'a' },
    { t: 'vline', x: '3/e', color: 'muted', label: 'directrix' },
    link('3*cos(s)', '3*sqrt(1-e^2)*sin(s)', '3*e', '0', 'result'),
    link('3*cos(s)', '3*sqrt(1-e^2)*sin(s)', '3/e', '3*sqrt(1-e^2)*sin(s)', 'b'),
    { t: 'dot', x: '3*e', y: 0, label: 'F', color: 'result' },
    { t: 'dot', x: '-3*e', y: 0, color: 'muted' },
    { t: 'dot', x: '3*cos(s)', y: '3*sqrt(1-e^2)*sin(s)', label: 'P', color: 'a' },
    { t: 'dot', x: '3/e', y: '3*sqrt(1-e^2)*sin(s)', label: 'D', color: 'b' },
  ],
  caption: {
    en: 'An ellipse with $a=3$, its right focus $F$ and the matching directrix $x=a/e$. Drag $s$ to move $P$: the segment $PF$ is always exactly $e$ times as long as $PD$, the distance across to the directrix. Drag $e$: as $e$ grows the ellipse flattens and the directrix moves in toward it.',
    id: 'Elips dengan $a=3$, fokus kanannya $F$, dan direktriks yang bersesuaian $x=a/e$. Geser $s$ untuk menggerakkan $P$: ruas $PF$ selalu tepat $e$ kali panjang $PD$, jarak mendatar ke direktriks. Geser $e$: saat $e$ membesar, elips menjadi pipih dan direktriksnya bergerak mendekat.',
  },
}

/** Hyperbola with a = 3 and a slider e, showing PF = e · PD. */
const figEccHyperbola: Figure = {
  dim: 2,
  xSpan: [-8, 8],
  ySpan: [-8, 8],
  ticks: true,
  params: [
    { name: 'e', min: 1.1, max: 2.5, step: 0.05, value: 1.6, label: 'e' },
    { name: 's', min: -1.5, max: 1.5, step: 0.05, value: 1, label: 's' },
  ],
  items: [
    { t: 'param', x: '3*cosh(t)', y: '3*sqrt(e^2-1)*sinh(t)', from: -2, to: 2, color: 'a' },
    { t: 'param', x: '-3*cosh(t)', y: '3*sqrt(e^2-1)*sinh(t)', from: -2, to: 2, color: 'a' },
    { t: 'vline', x: '3/e', color: 'muted' },
    { t: 'vline', x: '-3/e', color: 'muted' },
    link('3*cosh(s)', '3*sqrt(e^2-1)*sinh(s)', '3*e', '0', 'result'),
    link('3*cosh(s)', '3*sqrt(e^2-1)*sinh(s)', '3/e', '3*sqrt(e^2-1)*sinh(s)', 'b'),
    { t: 'dot', x: '3*e', y: 0, label: 'F', color: 'result' },
    { t: 'dot', x: '-3*e', y: 0, color: 'muted' },
    { t: 'dot', x: '3*cosh(s)', y: '3*sqrt(e^2-1)*sinh(s)', label: 'P', color: 'a' },
    { t: 'dot', x: '3/e', y: '3*sqrt(e^2-1)*sinh(s)', label: 'D', color: 'b' },
  ],
  caption: {
    en: 'A hyperbola with $a=3$, foci $(\\pm3e,0)$ and directrices $x=\\pm3/e$ (the vertical dashed lines). Drag $e$ to push the foci outward and open the branches wider. Drag $s$ to move $P$ along the right branch — $PF$ is still exactly $e$ times $PD$, now with $e>1$.',
    id: 'Hiperbola dengan $a=3$, fokus $(\\pm3e,0)$ dan direktriks $x=\\pm3/e$ (garis tegak putus-putus). Geser $e$ untuk mendorong fokus keluar dan membuka cabangnya lebih lebar. Geser $s$ untuk menggerakkan $P$ sepanjang cabang kanan — $PF$ tetap tepat $e$ kali $PD$, kini dengan $e>1$.',
  },
}

/** Static hyperbola for the eccentricity quiz: vertices (±4, 0), foci (±6, 0). */
const figEccQuiz: Figure = {
  dim: 2,
  xSpan: [-8, 8],
  ySpan: [-8, 8],
  ticks: true,
  items: [
    { t: 'param', x: '4*cosh(t)', y: 'sqrt(20)*sinh(t)', from: -2, to: 2, color: 'a' },
    { t: 'param', x: '-4*cosh(t)', y: 'sqrt(20)*sinh(t)', from: -2, to: 2, color: 'a' },
    { t: 'dot', x: 4, y: 0, color: 'muted' },
    { t: 'dot', x: -4, y: 0, color: 'muted' },
    { t: 'dot', x: 6, y: 0, label: 'F₂', color: 'result' },
    { t: 'dot', x: -6, y: 0, label: 'F₁', color: 'result' },
  ],
  caption: {
    en: 'A hyperbola centered at the origin. The gray dots mark its vertices and the colored dots mark its foci.',
    id: 'Sebuah hiperbola berpusat di titik asal. Titik abu-abu menandai puncaknya dan titik berwarna menandai fokusnya.',
  },
}

/** r = 3e/(1 + e cos θ): the focus at the pole, directrix x = 3, slider e. */
const figPolarSlider: Figure = {
  dim: 2,
  polar: true,
  xSpan: [-8, 5],
  ySpan: [-6.5, 6.5],
  ticks: true,
  params: [{ name: 'e', min: 0.1, max: 0.7, step: 0.01, value: 0.5, label: 'e' }],
  items: [
    { t: 'polar', r: '3*e/(1+e*cos(theta))', from: 0, to: TAU, color: 'a', label: 'r = ke/(1 + e cos θ)' },
    { t: 'vline', x: 3, color: 'muted', label: 'x = 3' },
    { t: 'dot', x: 0, y: 0, label: 'F', color: 'result' },
    { t: 'dot', x: '3*e/(1+e)', y: 0, label: 'near', color: 'b' },
    { t: 'dot', x: '-3*e/(1-e)', y: 0, label: 'far', color: 'b' },
  ],
  caption: {
    en: 'The conic $r=\\dfrac{ke}{1+e\\cos\\theta}$ with $k=3$: the focus is the pole $F$ and the directrix is the dashed line $x=3$. Drag $e$ — the nearest point (to the right) creeps outward slowly, while the farthest point (to the left) races away, so a larger $e$ stretches the ellipse; past $e=0.7$ the far end leaves the picture on its way to infinity at $e=1$, where the ellipse opens into a parabola.',
    id: 'Konik $r=\\dfrac{ke}{1+e\\cos\\theta}$ dengan $k=3$: fokusnya adalah kutub $F$ dan direktriksnya adalah garis putus-putus $x=3$. Geser $e$ — titik terdekat (di kanan) bergeser keluar pelan-pelan, sementara titik terjauh (di kiri) melesat menjauh, sehingga $e$ yang lebih besar meregangkan elips; melewati $e=0{,}7$ ujung jauhnya keluar dari gambar menuju tak hingga pada $e=1$, ketika elips terbuka menjadi parabola.',
  },
}

/** r = 3/(1 + 0.5 cos θ), the worked orbit: nearest 2, farthest 6, directrix x = 6. */
const figOrbit: Figure = {
  dim: 2,
  polar: true,
  xSpan: [-8, 8],
  ySpan: [-8, 8],
  ticks: true,
  items: [
    { t: 'polar', r: '3/(1+0.5*cos(theta))', from: 0, to: TAU, color: 'a' },
    { t: 'vline', x: 6, color: 'muted', label: 'x = 6' },
    { t: 'dot', x: 0, y: 0, label: 'F', color: 'result' },
    { t: 'dot', x: 2, y: 0, label: 'near', color: 'b' },
    { t: 'dot', x: -6, y: 0, label: 'far', color: 'b' },
  ],
  caption: {
    en: 'The orbit $r=\\dfrac{3}{1+0.5\\cos\\theta}$ with the focus $F$ at the pole and the directrix $x=6$ (dashed). The two dots mark the nearest point, $r=2$ at $\\theta=0$, and the farthest point, $r=6$ at $\\theta=\\pi$; half their sum, $4$, is the semimajor axis $a$.',
    id: 'Orbit $r=\\dfrac{3}{1+0{,}5\\cos\\theta}$ dengan fokus $F$ di kutub dan direktriks $x=6$ (putus-putus). Dua titik menandai titik terdekat, $r=2$ pada $\\theta=0$, dan titik terjauh, $r=6$ pada $\\theta=\\pi$; setengah jumlahnya, $4$, adalah sumbu semimayor $a$.',
  },
}

/** Quiz figure: r = 4/(1 + cos(θ)/3) — nearest 3, farthest 6 (so e = 1/3). */
const figPolarQuiz: Figure = {
  dim: 2,
  polar: true,
  xSpan: [-8, 8],
  ySpan: [-8, 8],
  ticks: true,
  items: [
    { t: 'polar', r: '4/(1+cos(theta)/3)', from: 0, to: TAU, color: 'a' },
    { t: 'dot', x: 0, y: 0, label: 'F', color: 'result' },
    { t: 'dot', x: 3, y: 0, color: 'b' },
    { t: 'dot', x: -6, y: 0, color: 'b' },
  ],
  caption: {
    en: 'A conic with a focus $F$ at the pole. The two dots on the $x$-axis are its nearest and farthest points from $F$.',
    id: 'Sebuah konik dengan fokus $F$ di kutub. Dua titik pada sumbu-$x$ adalah titik terdekat dan terjauhnya dari $F$.',
  },
}

/* ------------------------------------------------------------------- module */

export const module3: Module = {
  id: 'par-m3',
  title: { en: 'Conic Sections', id: 'Irisan Kerucut' },
  summary: {
    en: 'Parabolas, ellipses, and hyperbolas as loci defined by a focus and a directrix or by two foci — their standard and shifted equations, classification from the general equation, and one eccentricity-based polar equation that covers every conic.',
    id: 'Parabola, elips, dan hiperbola sebagai lokus yang didefinisikan oleh sebuah fokus dan direktriks atau oleh dua fokus — persamaan baku dan persamaan bergesernya, klasifikasi dari persamaan umum, serta satu persamaan kutub berbasis eksentrisitas yang mencakup setiap konik.',
  },
  submodules: [
    /* ------------------------------------------------ 10.6 parabolas, ellipses, hyperbolas */
    {
      id: 'par-m3-s1',
      title: { en: 'Parabolas, Ellipses and Hyperbolas', id: 'Parabola, Elips, dan Hiperbola' },
      summary: {
        en: 'Each conic is a set of points defined by distances — to a focus and a line, or to two foci — and each has a short equation that can be read for its vertices, foci, and asymptotes.',
        id: 'Setiap konik adalah himpunan titik yang didefinisikan lewat jarak — ke sebuah fokus dan garis, atau ke dua fokus — dan masing-masing punya persamaan singkat yang bisa dibaca untuk puncak, fokus, dan asimtotnya.',
      },
      lessons: [
        {
          id: 'par-m3-s1-l1',
          title: { en: 'Parabolas and Ellipses', id: 'Parabola dan Elips' },
          goal: {
            en: 'Derive the equations of a parabola and an ellipse from their distance definitions and read off focus, directrix, vertices, and axes.',
            id: 'Menurunkan persamaan parabola dan elips dari definisi jaraknya dan membaca fokus, direktriks, puncak, dan sumbunya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: {
                en: 'A parabola: equally far from a point and a line',
                id: 'Parabola: sama jauh dari sebuah titik dan sebuah garis',
              },
              body: {
                en: 'A **parabola** is the set of all points $P$ that are the same distance from a fixed point $F$ (the **focus**) as from a fixed line (the **directrix**). Put the focus at $F(0,p)$ and the directrix at $y=-p$; then $P(x,y)$ lies on the parabola exactly when $PF=PD$, where $D=(x,-p)$ is the foot of the perpendicular to the directrix.\n\nWrite $PF=PD$ in coordinates and square both sides:\n$$\\sqrt{x^2+(y-p)^2}=y+p \\ \\Rightarrow\\ x^2+y^2-2py+p^2=y^2+2py+p^2 \\ \\Rightarrow\\ x^2=4py$$\nThe number $p$, the distance from the vertex (the origin) to the focus, is the **focal length**. Turning the picture gives the four standard forms, all with $p>0$:\n\n| Equation | Opens | Focus | Directrix |\n| --- | --- | --- | --- |\n| $x^2=4py$ | up | $(0,p)$ | $y=-p$ |\n| $x^2=-4py$ | down | $(0,-p)$ | $y=p$ |\n| $y^2=4px$ | right | $(p,0)$ | $x=-p$ |\n| $y^2=-4px$ | left | $(-p,0)$ | $x=p$ |',
                id: 'Sebuah **parabola** adalah himpunan semua titik $P$ yang jaraknya sama ke sebuah titik tetap $F$ (**fokus**) dan ke sebuah garis tetap (**direktriks**). Letakkan fokus di $F(0,p)$ dan direktriks di $y=-p$; maka $P(x,y)$ terletak pada parabola persis ketika $PF=PD$, dengan $D=(x,-p)$ kaki garis tegak lurus ke direktriks.\n\nTulis $PF=PD$ dalam koordinat lalu kuadratkan kedua ruas:\n$$\\sqrt{x^2+(y-p)^2}=y+p \\ \\Rightarrow\\ x^2+y^2-2py+p^2=y^2+2py+p^2 \\ \\Rightarrow\\ x^2=4py$$\nBilangan $p$, jarak dari puncak (titik asal) ke fokus, disebut **jarak fokus**. Dengan memutar gambarnya didapat empat bentuk baku, semuanya dengan $p>0$:\n\n| Persamaan | Terbuka ke | Fokus | Direktriks |\n| --- | --- | --- | --- |\n| $x^2=4py$ | atas | $(0,p)$ | $y=-p$ |\n| $x^2=-4py$ | bawah | $(0,-p)$ | $y=p$ |\n| $y^2=4px$ | kanan | $(p,0)$ | $x=-p$ |\n| $y^2=-4px$ | kiri | $(-p,0)$ | $x=p$ |',
              },
              figure: figParabola,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: {
                en: 'An ellipse: two foci, one constant sum',
                id: 'Elips: dua fokus, satu jumlah konstan',
              },
              body: {
                en: 'An **ellipse** is the set of points $P$ whose distances to two fixed points $F_1$ and $F_2$ (the **foci**) add up to a constant, which we write as $2a$. Put the foci at $(\\pm c,0)$ with $c<a$ and write the condition in coordinates:\n$$\\sqrt{(x-c)^2+y^2}+\\sqrt{(x+c)^2+y^2}=2a$$\nSquaring twice and collecting terms (worth doing once by hand) leaves $(a^2-c^2)x^2+a^2y^2=a^2(a^2-c^2)$. Naming the positive number $b^2=a^2-c^2$ and dividing by $a^2b^2$ gives\n$$\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1,\\qquad c^2=a^2-b^2$$\n\n- Vertices $(\\pm a,0)$ and co-vertices $(0,\\pm b)$; the major axis has length $2a$ and the minor axis $2b$.\n- Foci $(\\pm c,0)$ on the major axis, with $c^2=a^2-b^2$, so $c<a$.\n- If the major axis is vertical the equation is $\\frac{x^2}{b^2}+\\frac{y^2}{a^2}=1$ and the foci are $(0,\\pm c)$; the larger denominator is always $a^2$.\n\nFor example, $\\frac{x^2}{25}+\\frac{y^2}{9}=1$ has $a=5$, $b=3$ and $c=\\sqrt{25-9}=4$: foci $(\\pm4,0)$, vertices $(\\pm5,0)$. The end of the minor axis, $(0,3)$, is exactly $5=a$ from each focus.',
                id: 'Sebuah **elips** adalah himpunan titik $P$ yang jumlah jaraknya ke dua titik tetap $F_1$ dan $F_2$ (**fokus**) bernilai konstan, yang kita tulis sebagai $2a$. Letakkan fokus di $(\\pm c,0)$ dengan $c<a$ dan tulis syaratnya dalam koordinat:\n$$\\sqrt{(x-c)^2+y^2}+\\sqrt{(x+c)^2+y^2}=2a$$\nMengkuadratkan dua kali dan mengumpulkan suku (layak dikerjakan sekali dengan tangan) menyisakan $(a^2-c^2)x^2+a^2y^2=a^2(a^2-c^2)$. Dengan menamai bilangan positif $b^2=a^2-c^2$ dan membagi dengan $a^2b^2$ didapat\n$$\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1,\\qquad c^2=a^2-b^2$$\n\n- Puncak $(\\pm a,0)$ dan titik ujung sumbu minor $(0,\\pm b)$; sumbu mayor panjangnya $2a$ dan sumbu minor $2b$.\n- Fokus $(\\pm c,0)$ pada sumbu mayor, dengan $c^2=a^2-b^2$, sehingga $c<a$.\n- Jika sumbu mayornya tegak, persamaannya $\\frac{x^2}{b^2}+\\frac{y^2}{a^2}=1$ dan fokusnya $(0,\\pm c)$; penyebut yang lebih besar selalu $a^2$.\n\nContohnya, $\\frac{x^2}{25}+\\frac{y^2}{9}=1$ punya $a=5$, $b=3$, dan $c=\\sqrt{25-9}=4$: fokus $(\\pm4,0)$, puncak $(\\pm5,0)$. Ujung sumbu minor, $(0,3)$, tepat berjarak $5=a$ dari tiap fokus.',
              },
              figure: figEllipse,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A parabola with its vertex at the origin has its focus at $(0,2)$. Which equation describes it?',
                id: 'Sebuah parabola dengan puncak di titik asal punya fokus di $(0,2)$. Persamaan manakah yang menggambarkannya?',
              },
              options: [
                { en: '$x^2=8y$', id: '$x^2=8y$' },
                { en: '$x^2=2y$', id: '$x^2=2y$' },
                { en: '$y^2=8x$', id: '$y^2=8x$' },
                { en: '$x^2=-8y$', id: '$x^2=-8y$' },
              ],
              answer: 0,
              explain: {
                en: 'The focus $(0,p)$ gives $p=2$, and a parabola opening upward is $x^2=4py=8y$.',
                id: 'Fokus $(0,p)$ memberi $p=2$, dan parabola yang terbuka ke atas adalah $x^2=4py=8y$.',
              },
              hint: {
                en: 'A focus on the $y$-axis above the vertex means the form $x^2=4py$. What is $p$ here, and what is $4p$?',
                id: 'Fokus pada sumbu-$y$ di atas puncak berarti bentuk $x^2=4py$. Berapa $p$ di sini, dan berapa $4p$?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Read the ellipse in the figure. What is the length of its minor axis?',
                id: 'Bacalah elips pada gambar. Berapa panjang sumbu minornya?',
              },
              figure: figEllipseQuiz,
              options: [
                { en: '$8$', id: '$8$' },
                { en: '$4$', id: '$4$' },
                { en: '$6$', id: '$6$' },
                { en: '$10$', id: '$10$' },
              ],
              answer: 0,
              explain: {
                en: 'The vertices $(\\pm5,0)$ give $a=5$ and the foci $(\\pm3,0)$ give $c=3$, so $b=\\sqrt{25-9}=4$. The minor axis is the full width $2b=8$.',
                id: 'Puncak $(\\pm5,0)$ memberi $a=5$ dan fokus $(\\pm3,0)$ memberi $c=3$, sehingga $b=\\sqrt{25-9}=4$. Sumbu minor adalah lebar penuh $2b=8$.',
              },
              hint: {
                en: 'Read $a$ from a vertex and $c$ from a focus, then use $c^2=a^2-b^2$. Check whether the question wants $b$ or the whole axis.',
                id: 'Baca $a$ dari sebuah puncak dan $c$ dari sebuah fokus, lalu pakai $c^2=a^2-b^2$. Periksa apakah soal meminta $b$ atau seluruh sumbunya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'The parabola $x^2=12y$ is in the form $x^2=4py$. Find its focal length and its directrix.',
                id: 'Parabola $x^2=12y$ berbentuk $x^2=4py$. Tentukan jarak fokus dan direktriksnya.',
              },
              template: {
                en: 'x^2=12y:\\quad 4p=12 \\Rightarrow p=___,\\quad \\text{directrix } y=-___',
                id: 'x^2=12y:\\quad 4p=12 \\Rightarrow p=___,\\quad \\text{direktriks } y=-___',
              },
              blanks: ['3', '3'],
              explain: {
                en: 'Matching $4p=12$ gives $p=3$. The focus is $(0,3)$ and the directrix is the line $y=-3$, the same distance on the other side of the vertex.',
                id: 'Menyamakan $4p=12$ memberi $p=3$. Fokusnya $(0,3)$ dan direktriksnya garis $y=-3$, jarak yang sama di sisi lain puncak.',
              },
              hint: {
                en: 'Compare $x^2=12y$ with $x^2=4py$ coefficient by coefficient. The directrix lies as far below the vertex as the focus lies above it.',
                id: 'Bandingkan $x^2=12y$ dengan $x^2=4py$ koefisien demi koefisien. Direktriks terletak sejauh fokus di sebelah atas puncak, hanya di bawahnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For the ellipse $\\dfrac{x^2}{169}+\\dfrac{y^2}{25}=1$, find $c$, and the constant sum $PF_1+PF_2$ shared by every point $P$ on it.',
                id: 'Untuk elips $\\dfrac{x^2}{169}+\\dfrac{y^2}{25}=1$, tentukan $c$, dan jumlah konstan $PF_1+PF_2$ yang dimiliki setiap titik $P$ di atasnya.',
              },
              blanks: [
                { label: 'c =', answer: 12 },
                { label: 'PF_1+PF_2 =', answer: 26 },
              ],
              hints: [
                { en: 'The larger denominator is $a^2$, so here $a^2=169$ and $b^2=25$.', id: 'Penyebut yang lebih besar adalah $a^2$, jadi di sini $a^2=169$ dan $b^2=25$.' },
                { en: 'Use $c^2=a^2-b^2$. The constant sum is the major axis length, $2a$.', id: 'Pakai $c^2=a^2-b^2$. Jumlah konstannya adalah panjang sumbu mayor, $2a$.' },
              ],
              explain: {
                en: '$a=13$, $b=5$, so $c=\\sqrt{169-25}=\\sqrt{144}=12$. Every point of the ellipse has $PF_1+PF_2=2a=26$.',
                id: '$a=13$, $b=5$, sehingga $c=\\sqrt{169-25}=\\sqrt{144}=12$. Setiap titik pada elips punya $PF_1+PF_2=2a=26$.',
              },
            },
          ],
        },
        {
          id: 'par-m3-s1-l2',
          title: {
            en: 'Hyperbolas, Shifted Conics, and Classification',
            id: 'Hiperbola, Konik Bergeser, dan Klasifikasi',
          },
          goal: {
            en: 'Describe a hyperbola by its foci and asymptotes, move any conic to a new center, and classify a general second-degree equation by its coefficients.',
            id: 'Menggambarkan hiperbola lewat fokus dan asimtotnya, menggeser konik ke pusat baru, dan mengklasifikasikan persamaan derajat dua umum lewat koefisiennya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: {
                en: 'A hyperbola: two foci, one constant difference',
                id: 'Hiperbola: dua fokus, satu selisih konstan',
              },
              body: {
                en: 'A **hyperbola** is the set of points $P$ for which the **difference** of the distances to two foci $F_1(-c,0)$ and $F_2(c,0)$ is constant, $|PF_1-PF_2|=2a$, with $a<c$. The algebra is the ellipse algebra with one sign changed, and it ends at\n$$\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1,\\qquad c^2=a^2+b^2$$\n\nFar from the center the two branches straighten out toward two lines through the center, the **asymptotes**. To find them, replace the $1$ on the right by $0$: $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=0$ gives $y=\\pm\\frac{b}{a}x$.\n\n- Vertices $(\\pm a,0)$ and foci $(\\pm c,0)$, where $c^2=a^2+b^2$, so $c$ is now the largest of the three lengths.\n- Asymptotes $y=\\pm\\dfrac{b}{a}x$, and the branches open left and right.\n- If the $y^2$ term is the positive one, $\\frac{y^2}{a^2}-\\frac{x^2}{b^2}=1$, the branches open up and down, with vertices $(0,\\pm a)$, foci $(0,\\pm c)$ and asymptotes $y=\\pm\\frac{a}{b}x$.',
                id: 'Sebuah **hiperbola** adalah himpunan titik $P$ yang **selisih** jaraknya ke dua fokus $F_1(-c,0)$ dan $F_2(c,0)$ konstan, $|PF_1-PF_2|=2a$, dengan $a<c$. Aljabarnya sama dengan aljabar elips dengan satu tanda diubah, dan berakhir di\n$$\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1,\\qquad c^2=a^2+b^2$$\n\nJauh dari pusat, kedua cabangnya meluruskan diri menuju dua garis melalui pusat, yaitu **asimtot**. Untuk mencarinya, ganti $1$ di ruas kanan dengan $0$: $\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=0$ memberi $y=\\pm\\frac{b}{a}x$.\n\n- Puncak $(\\pm a,0)$ dan fokus $(\\pm c,0)$, dengan $c^2=a^2+b^2$, sehingga $c$ kini yang terbesar dari ketiga panjang itu.\n- Asimtot $y=\\pm\\dfrac{b}{a}x$, dan cabangnya terbuka ke kiri dan kanan.\n- Jika suku $y^2$ yang positif, $\\frac{y^2}{a^2}-\\frac{x^2}{b^2}=1$, cabangnya terbuka ke atas dan bawah, dengan puncak $(0,\\pm a)$, fokus $(0,\\pm c)$, dan asimtot $y=\\pm\\frac{a}{b}x$.',
              },
              figure: figHyperbola,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: {
                en: 'Moving a conic, and telling which one you have',
                id: 'Menggeser konik, dan mengenali konik yang mana',
              },
              body: {
                en: 'Moving a conic so its center (or vertex) sits at $(h,k)$ replaces $x$ by $x-h$ and $y$ by $y-k$, the same shift rule as for any graph. So $\\frac{(x-h)^2}{a^2}+\\frac{(y-k)^2}{b^2}=1$ is the ellipse centered at $(h,k)$, and every vertex, focus and asymptote moves by the same $(h,k)$.\n\nTo read an unfamiliar equation, group the $x$ terms and the $y$ terms and complete the square in each. For $9x^2+4y^2-18x+16y-11=0$:\n$$9(x^2-2x+1)+4(y^2+4y+4)=11+9+16 \\ \\Rightarrow\\ \\frac{(x-1)^2}{4}+\\frac{(y+2)^2}{9}=1$$\n\nThe center is $(1,-2)$. The larger denominator $9$ sits under $y$, so $a=3$ with a vertical major axis, $b=2$ and $c=\\sqrt{9-4}=\\sqrt5$; the vertices are $(1,-2\\pm3)$ and the foci are $(1,-2\\pm\\sqrt5)$.\n\nYou do not have to complete the square to know **which** conic you have. For $Ax^2+Cy^2+Dx+Ey+F=0$ with no $xy$ term, compare $A$ and $C$:\n\n| Coefficients | Conic |\n| --- | --- |\n| $A=0$ or $C=0$ (not both) | parabola |\n| $A=C$ | circle |\n| $A$ and $C$ the same sign, $A\\neq C$ | ellipse |\n| $A$ and $C$ opposite signs | hyperbola |\n\nOnce in a while the constant makes the curve **degenerate** — a single point, a pair of lines, or no points at all — but those are the only exceptions.',
                id: 'Menggeser konik sehingga pusatnya (atau puncaknya) berada di $(h,k)$ mengganti $x$ dengan $x-h$ dan $y$ dengan $y-k$, aturan geser yang sama seperti untuk grafik apa pun. Jadi $\\frac{(x-h)^2}{a^2}+\\frac{(y-k)^2}{b^2}=1$ adalah elips berpusat di $(h,k)$, dan setiap puncak, fokus, dan asimtot bergeser sebesar $(h,k)$ yang sama.\n\nUntuk membaca persamaan yang belum dikenal, kelompokkan suku $x$ dan suku $y$ lalu lengkapkan kuadrat pada masing-masing. Untuk $9x^2+4y^2-18x+16y-11=0$:\n$$9(x^2-2x+1)+4(y^2+4y+4)=11+9+16 \\ \\Rightarrow\\ \\frac{(x-1)^2}{4}+\\frac{(y+2)^2}{9}=1$$\n\nPusatnya $(1,-2)$. Penyebut yang lebih besar, $9$, ada di bawah $y$, sehingga $a=3$ dengan sumbu mayor tegak, $b=2$, dan $c=\\sqrt{9-4}=\\sqrt5$; puncaknya $(1,-2\\pm3)$ dan fokusnya $(1,-2\\pm\\sqrt5)$.\n\nKamu tak perlu melengkapkan kuadrat untuk tahu konik **yang mana** yang kamu punya. Untuk $Ax^2+Cy^2+Dx+Ey+F=0$ tanpa suku $xy$, bandingkan $A$ dan $C$:\n\n| Koefisien | Konik |\n| --- | --- |\n| $A=0$ atau $C=0$ (tidak keduanya) | parabola |\n| $A=C$ | lingkaran |\n| $A$ dan $C$ bertanda sama, $A\\neq C$ | elips |\n| $A$ dan $C$ berlawanan tanda | hiperbola |\n\nSesekali konstantanya membuat kurva **merosot** — satu titik, sepasang garis, atau tak ada titik sama sekali — tetapi hanya itu pengecualiannya.',
              },
              figure: figShifted,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'For any point $P$ on a hyperbola whose vertices are a distance $a$ from the center, what is $|PF_1-PF_2|$?',
                id: 'Untuk sebarang titik $P$ pada hiperbola yang puncaknya berjarak $a$ dari pusat, berapa $|PF_1-PF_2|$?',
              },
              options: [
                { en: '$2a$', id: '$2a$' },
                { en: '$2c$', id: '$2c$' },
                { en: '$a+c$', id: '$a+c$' },
                { en: 'It depends on which point $P$ is', id: 'Bergantung pada titik $P$ yang mana' },
              ],
              answer: 0,
              explain: {
                en: 'The difference is the same for every point, so test it at a vertex $(a,0)$: the distances to the foci are $c+a$ and $c-a$, and their difference is $2a$.',
                id: 'Selisihnya sama untuk setiap titik, jadi ujilah di sebuah puncak $(a,0)$: jarak ke fokus adalah $c+a$ dan $c-a$, dan selisihnya $2a$.',
              },
              hint: {
                en: 'The definition says the difference is constant, so a vertex is as good a test point as any. How far is $(a,0)$ from each focus?',
                id: 'Definisinya mengatakan selisihnya konstan, jadi sebuah puncak adalah titik uji yang sama baiknya. Berapa jauh $(a,0)$ dari tiap fokus?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which equation describes the hyperbola in the figure?',
                id: 'Persamaan manakah yang menggambarkan hiperbola pada gambar?',
              },
              figure: figHyperbolaQuiz,
              options: [
                { en: '$\\dfrac{x^2}{16}-\\dfrac{y^2}{9}=1$', id: '$\\dfrac{x^2}{16}-\\dfrac{y^2}{9}=1$' },
                { en: '$\\dfrac{x^2}{9}-\\dfrac{y^2}{16}=1$', id: '$\\dfrac{x^2}{9}-\\dfrac{y^2}{16}=1$' },
                { en: '$\\dfrac{y^2}{16}-\\dfrac{x^2}{9}=1$', id: '$\\dfrac{y^2}{16}-\\dfrac{x^2}{9}=1$' },
                { en: '$\\dfrac{x^2}{16}+\\dfrac{y^2}{9}=1$', id: '$\\dfrac{x^2}{16}+\\dfrac{y^2}{9}=1$' },
              ],
              answer: 0,
              explain: {
                en: 'The vertices at $(\\pm4,0)$ give $a=4$ and the foci at $(\\pm5,0)$ give $c=5$, so $b^2=c^2-a^2=9$. The branches open sideways, so the $x^2$ term is the positive one; the asymptotes $y=\\pm\\frac34x$ confirm $b/a=\\frac34$.',
                id: 'Puncak di $(\\pm4,0)$ memberi $a=4$ dan fokus di $(\\pm5,0)$ memberi $c=5$, sehingga $b^2=c^2-a^2=9$. Cabangnya terbuka ke samping, jadi suku $x^2$ yang positif; asimtot $y=\\pm\\frac34x$ menegaskan $b/a=\\frac34$.',
              },
              hint: {
                en: 'The branches open sideways, so decide which variable carries the plus sign. Then take $a$ from a vertex and use $c^2=a^2+b^2$ for $b$.',
                id: 'Cabangnya terbuka ke samping, jadi tentukan variabel mana yang bertanda plus. Lalu ambil $a$ dari sebuah puncak dan pakai $c^2=a^2+b^2$ untuk $b$.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the square to write $x^2+y^2-6x+4y-3=0$ in standard form.',
                id: 'Lengkapkan kuadrat untuk menulis $x^2+y^2-6x+4y-3=0$ dalam bentuk baku.',
              },
              template: '(x-___)^2+(y+___)^2=___',
              blanks: ['3', '2', '16'],
              explain: {
                en: '$(x^2-6x+9)+(y^2+4y+4)=3+9+4=16$, so this is the circle with center $(3,-2)$ and radius $4$.',
                id: '$(x^2-6x+9)+(y^2+4y+4)=3+9+4=16$, jadi ini lingkaran berpusat di $(3,-2)$ dengan jari-jari $4$.',
              },
              hint: {
                en: 'Half the coefficient of $x$ goes inside its bracket, and whatever you add on the left must also be added on the right.',
                id: 'Setengah koefisien $x$ masuk ke dalam kurungnya, dan apa pun yang kamu tambahkan di kiri harus ditambahkan juga di kanan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The equation $16x^2-9y^2+64x+18y-89=0$ has $A$ and $C$ of opposite signs, so it is a hyperbola. Complete the squares to find its center $(h,k)$ and the distance $c$ from the center to each focus.',
                id: 'Persamaan $16x^2-9y^2+64x+18y-89=0$ punya $A$ dan $C$ berlawanan tanda, jadi ia hiperbola. Lengkapkan kuadrat untuk mencari pusatnya $(h,k)$ dan jarak $c$ dari pusat ke tiap fokus.',
              },
              blanks: [
                { label: 'h =', answer: -2 },
                { label: 'k =', answer: 1 },
                { label: 'c =', answer: 5 },
              ],
              hints: [
                { en: 'Factor $16$ out of the $x$ terms and $-9$ out of the $y$ terms, then complete each square.', id: 'Faktorkan $16$ dari suku-suku $x$ dan $-9$ dari suku-suku $y$, lalu lengkapkan masing-masing kuadrat.' },
                { en: 'Divide so the right side is $1$; the denominators are $a^2$ and $b^2$, and $c^2=a^2+b^2$.', id: 'Bagi sehingga ruas kanan menjadi $1$; penyebutnya adalah $a^2$ dan $b^2$, dan $c^2=a^2+b^2$.' },
              ],
              explain: {
                en: '$16(x+2)^2-9(y-1)^2=89+64-9=144$, so $\\frac{(x+2)^2}{9}-\\frac{(y-1)^2}{16}=1$. The center is $(-2,1)$, with $a=3$ and $b=4$, so $c=\\sqrt{9+16}=5$.',
                id: '$16(x+2)^2-9(y-1)^2=89+64-9=144$, sehingga $\\frac{(x+2)^2}{9}-\\frac{(y-1)^2}{16}=1$. Pusatnya $(-2,1)$, dengan $a=3$ dan $b=4$, sehingga $c=\\sqrt{9+16}=5$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'par-m3-s1-p',
        runtime: 'math',
        title: { en: 'Conics From Their Definitions', id: 'Konik dari Definisinya' },
        brief: {
          en: 'A parabola from its focal length, an ellipse and a hyperbola from their standard equations, and a shifted conic read from a general equation.',
          id: 'Sebuah parabola dari jarak fokusnya, sebuah elips dan hiperbola dari persamaan bakunya, dan konik bergeser yang dibaca dari persamaan umum.',
        },
        requirements: [
          {
            en: 'Match each equation to its standard form first, then read $p$, $a$, $b$, or $c$ from it.',
            id: 'Cocokkan tiap persamaan dengan bentuk bakunya dulu, lalu baca $p$, $a$, $b$, atau $c$ darinya.',
          },
          {
            en: 'For a shifted conic, complete the squares before reading the center and the lengths.',
            id: 'Untuk konik bergeser, lengkapkan kuadrat dulu sebelum membaca pusat dan panjang-panjangnya.',
          },
        ],
        tasks: [
          {
            prompt: {
              en: 'The parabola $y^2=24x$ passes through $(6,12)$. Find its focal length $p$ and the distance from $(6,12)$ to the focus.',
              id: 'Parabola $y^2=24x$ melalui $(6,12)$. Tentukan jarak fokus $p$ dan jarak dari $(6,12)$ ke fokus.',
            },
            blanks: [
              { label: 'p =', answer: 6 },
              { label: 'PF =', answer: 12 },
            ],
            solution: {
              en: ['4p=24 \\Rightarrow p=6, \\text{ focus } (6,0), \\text{ directrix } x=-6', 'PF = PD = 6-(-6) = 12'],
              id: ['4p=24 \\Rightarrow p=6, \\text{ fokus } (6,0), \\text{ direktriks } x=-6', 'PF = PD = 6-(-6) = 12'],
            },
          },
          {
            prompt: {
              en: 'For the ellipse $25x^2+9y^2=225$, find $c$ and the distance between the foci. For the hyperbola $16x^2-9y^2=144$, find the positive asymptote slope.',
              id: 'Untuk elips $25x^2+9y^2=225$, tentukan $c$ dan jarak antara kedua fokus. Untuk hiperbola $16x^2-9y^2=144$, tentukan kemiringan asimtot yang positif.',
            },
            blanks: [
              { label: 'c =', answer: 4 },
              { label: { en: '\\text{distance between foci} =', id: '\\text{jarak antar fokus} =' }, answer: 8 },
              { label: { en: '\\text{asymptote slope} =', id: '\\text{kemiringan asimtot} =' }, answer: 4 / 3 },
            ],
            solution: {
              en: [
                '\\tfrac{x^2}{9}+\\tfrac{y^2}{25}=1 \\Rightarrow a^2=25,\\ b^2=9,\\ c=\\sqrt{25-9}=4, \\text{ foci } (0,\\pm4), \\text{ distance } 2c=8',
                '\\tfrac{x^2}{9}-\\tfrac{y^2}{16}=1 \\Rightarrow a=3,\\ b=4,\\ y=\\pm\\tfrac{b}{a}x=\\pm\\tfrac43 x',
              ],
              id: [
                '\\tfrac{x^2}{9}+\\tfrac{y^2}{25}=1 \\Rightarrow a^2=25,\\ b^2=9,\\ c=\\sqrt{25-9}=4, \\text{ fokus } (0,\\pm4), \\text{ jarak } 2c=8',
                '\\tfrac{x^2}{9}-\\tfrac{y^2}{16}=1 \\Rightarrow a=3,\\ b=4,\\ y=\\pm\\tfrac{b}{a}x=\\pm\\tfrac43 x',
              ],
            },
          },
          {
            prompt: {
              en: 'Classify $4x^2+y^2-8x+6y+9=0$ (type $1$ for a parabola, $2$ for an ellipse or circle, $3$ for a hyperbola), then find its center $(h,k)$ and the distance $c$ from the center to a focus.',
              id: 'Klasifikasikan $4x^2+y^2-8x+6y+9=0$ (ketik $1$ untuk parabola, $2$ untuk elips atau lingkaran, $3$ untuk hiperbola), lalu tentukan pusatnya $(h,k)$ dan jarak $c$ dari pusat ke sebuah fokus.',
            },
            blanks: [
              { label: { en: '\\text{type} =', id: '\\text{jenis} =' }, answer: 2 },
              { label: 'h =', answer: 1 },
              { label: 'k =', answer: -3 },
              { label: 'c =', answer: Math.sqrt(3) },
            ],
            solution: {
              en: [
                'A=4,\\ C=1 \\text{ have the same sign and } A\\neq C \\Rightarrow \\text{ellipse}',
                '4(x-1)^2+(y+3)^2=-9+4+9=4 \\Rightarrow \\tfrac{(x-1)^2}{1}+\\tfrac{(y+3)^2}{4}=1',
                '\\text{center } (1,-3),\\ a^2=4,\\ b^2=1,\\ c=\\sqrt{4-1}=\\sqrt3',
              ],
              id: [
                'A=4,\\ C=1 \\text{ bertanda sama dan } A\\neq C \\Rightarrow \\text{elips}',
                '4(x-1)^2+(y+3)^2=-9+4+9=4 \\Rightarrow \\tfrac{(x-1)^2}{1}+\\tfrac{(y+3)^2}{4}=1',
                '\\text{pusat } (1,-3),\\ a^2=4,\\ b^2=1,\\ c=\\sqrt{4-1}=\\sqrt3',
              ],
            },
          },
        ],
        hints: [
          {
            en: 'In task 2 the ellipse has the larger number under $y^2$, so its major axis is vertical and its foci are on the $y$-axis.',
            id: 'Pada butir 2 elipsnya punya bilangan yang lebih besar di bawah $y^2$, sehingga sumbu mayornya tegak dan fokusnya pada sumbu-$y$.',
          },
          {
            en: 'In task 3, $c^2=a^2-b^2$ uses the larger denominator as $a^2$ after you divide the right side to $1$.',
            id: 'Pada butir 3, $c^2=a^2-b^2$ memakai penyebut yang lebih besar sebagai $a^2$ setelah ruas kanan kamu bagi menjadi $1$.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------------ 10.7 conics in polar coordinates */
    {
      id: 'par-m3-s2',
      title: { en: 'Conics in Polar Coordinates', id: 'Konik dalam Koordinat Kutub' },
      summary: {
        en: 'A single focus–directrix rule with an eccentricity $e$ describes every conic, and with the focus at the pole it turns into one short polar equation.',
        id: 'Satu aturan fokus–direktriks dengan eksentrisitas $e$ menggambarkan setiap konik, dan dengan fokus di kutub ia berubah menjadi satu persamaan kutub yang singkat.',
      },
      lessons: [
        {
          id: 'par-m3-s2-l1',
          title: {
            en: 'One Definition for Every Conic: Eccentricity',
            id: 'Satu Definisi untuk Semua Konik: Eksentrisitas',
          },
          goal: {
            en: 'Use the focus–directrix definition $PF=e\\cdot PD$ to tell the conics apart by $e$, and compute $e$, $c$, and the directrices from an equation.',
            id: 'Memakai definisi fokus–direktriks $PF=e\\cdot PD$ untuk membedakan konik lewat $e$, dan menghitung $e$, $c$, serta direktriks dari sebuah persamaan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One rule for every conic', id: 'Satu aturan untuk setiap konik' },
              body: {
                en: 'Parabolas, ellipses, and hyperbolas all fit one definition. Fix a point $F$ (the **focus**), a line $d$ (the **directrix**) and a number $e>0$ (the **eccentricity**); the conic is the set of points $P$ with\n$$PF=e\\cdot PD$$\nwhere $PD$ is the perpendicular distance from $P$ to the line $d$.\n\nThe parabola is the case $e=1$ you already know, $PF=PD$. The value of $e$ decides which conic you get:\n\n| Eccentricity | Conic | Shape |\n| --- | --- | --- |\n| $0<e<1$ | ellipse | a closed oval |\n| $e=1$ | parabola | one open curve |\n| $e>1$ | hyperbola | two open branches |\n\nFor an ellipse, $e$ measures how stretched it is: $e$ near $0$ is almost a circle (the circle itself is the limit $e=0$), and $e$ near $1$ is a long, thin oval.',
                id: 'Parabola, elips, dan hiperbola semuanya cocok dengan satu definisi. Tetapkan sebuah titik $F$ (**fokus**), sebuah garis $d$ (**direktriks**) dan sebuah bilangan $e>0$ (**eksentrisitas**); konik adalah himpunan titik $P$ dengan\n$$PF=e\\cdot PD$$\ndengan $PD$ jarak tegak lurus dari $P$ ke garis $d$.\n\nParabola adalah kasus $e=1$ yang sudah kamu kenal, $PF=PD$. Nilai $e$ menentukan konik mana yang kamu dapat:\n\n| Eksentrisitas | Konik | Bentuk |\n| --- | --- | --- |\n| $0<e<1$ | elips | oval tertutup |\n| $e=1$ | parabola | satu kurva terbuka |\n| $e>1$ | hiperbola | dua cabang terbuka |\n\nPada elips, $e$ mengukur seberapa teregang ia: $e$ mendekati $0$ hampir berupa lingkaran (lingkaran sendiri adalah limit $e=0$), dan $e$ mendekati $1$ adalah oval yang panjang dan tipis.',
              },
              figure: figEccEllipse,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Finding e from an equation', id: 'Menghitung e dari persamaan' },
              body: {
                en: 'For an ellipse or a hyperbola the eccentricity is a ratio of two lengths you already know: the distance from the center to a focus over the distance from the center to a vertex, $e=\\dfrac{c}{a}$. When the axis through the foci is horizontal, the directrices are the vertical lines $x=\\pm\\dfrac{a}{e}$.\n\n- Ellipse: $c^2=a^2-b^2$, so $e=\\dfrac{\\sqrt{a^2-b^2}}{a}$, always less than $1$.\n- Hyperbola: $c^2=a^2+b^2$, so $e=\\dfrac{\\sqrt{a^2+b^2}}{a}$, always greater than $1$.\n- Parabola: $e=1$, with a single focus and a single directrix.\n\nFor $\\frac{x^2}{25}+\\frac{y^2}{9}=1$ we have $a=5$ and $c=\\sqrt{25-9}=4$, so $e=\\frac45$ and the directrices are $x=\\pm\\frac{5}{4/5}=\\pm\\frac{25}{4}$. For $\\frac{x^2}{9}-\\frac{y^2}{16}=1$ we have $a=3$ and $c=\\sqrt{9+16}=5$, so $e=\\frac53>1$ and the directrices are $x=\\pm\\frac{9}{5}$.',
                id: 'Untuk elips atau hiperbola, eksentrisitas adalah rasio dua panjang yang sudah kamu kenal: jarak dari pusat ke fokus dibagi jarak dari pusat ke puncak, $e=\\dfrac{c}{a}$. Ketika sumbu yang melalui fokus mendatar, direktriksnya adalah garis tegak $x=\\pm\\dfrac{a}{e}$.\n\n- Elips: $c^2=a^2-b^2$, sehingga $e=\\dfrac{\\sqrt{a^2-b^2}}{a}$, selalu kurang dari $1$.\n- Hiperbola: $c^2=a^2+b^2$, sehingga $e=\\dfrac{\\sqrt{a^2+b^2}}{a}$, selalu lebih dari $1$.\n- Parabola: $e=1$, dengan satu fokus dan satu direktriks.\n\nUntuk $\\frac{x^2}{25}+\\frac{y^2}{9}=1$ kita punya $a=5$ dan $c=\\sqrt{25-9}=4$, sehingga $e=\\frac45$ dan direktriksnya $x=\\pm\\frac{5}{4/5}=\\pm\\frac{25}{4}$. Untuk $\\frac{x^2}{9}-\\frac{y^2}{16}=1$ kita punya $a=3$ dan $c=\\sqrt{9+16}=5$, sehingga $e=\\frac53>1$ dan direktriksnya $x=\\pm\\frac{9}{5}$.',
              },
              figure: figEccHyperbola,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'An ellipse has semimajor axis $a=8$ and focal distance $c=2$. What is its eccentricity?',
                id: 'Sebuah elips punya sumbu semimayor $a=8$ dan jarak fokus $c=2$. Berapa eksentrisitasnya?',
              },
              options: [
                { en: '$0.25$', id: '$0{,}25$' },
                { en: '$4$', id: '$4$' },
                { en: '$0.5$', id: '$0{,}5$' },
                { en: '$0.75$', id: '$0{,}75$' },
              ],
              answer: 0,
              explain: {
                en: '$e=c/a=2/8=0.25$. As for every ellipse, $e$ is between $0$ and $1$.',
                id: '$e=c/a=2/8=0{,}25$. Seperti pada setiap elips, $e$ berada di antara $0$ dan $1$.',
              },
              hint: {
                en: 'Eccentricity is $c$ divided by $a$, in that order. An ellipse always has $0\\le e<1$, which rules out one of the options.',
                id: 'Eksentrisitas adalah $c$ dibagi $a$, dalam urutan itu. Elips selalu punya $0\\le e<1$, yang menyingkirkan salah satu pilihan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Read the hyperbola in the figure. What is its eccentricity?',
                id: 'Bacalah hiperbola pada gambar. Berapa eksentrisitasnya?',
              },
              figure: figEccQuiz,
              options: [
                { en: '$1.5$', id: '$1{,}5$' },
                { en: '$\\tfrac{2}{3}$', id: '$\\tfrac{2}{3}$' },
                { en: '$2$', id: '$2$' },
                { en: '$2.5$', id: '$2{,}5$' },
              ],
              answer: 0,
              explain: {
                en: 'The vertices at $(\\pm4,0)$ give $a=4$ and the foci at $(\\pm6,0)$ give $c=6$, so $e=c/a=\\frac64=1.5$, greater than $1$ as every hyperbola requires.',
                id: 'Puncak di $(\\pm4,0)$ memberi $a=4$ dan fokus di $(\\pm6,0)$ memberi $c=6$, sehingga $e=c/a=\\frac64=1{,}5$, lebih dari $1$ seperti yang disyaratkan setiap hiperbola.',
              },
              hint: {
                en: 'Read the distance from the center to a vertex and to a focus. For a hyperbola the answer must be bigger than $1$, so check which way round the ratio goes.',
                id: 'Baca jarak dari pusat ke sebuah puncak dan ke sebuah fokus. Untuk hiperbola jawabannya harus lebih dari $1$, jadi periksa arah rasionya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the eccentricity of $\\dfrac{x^2}{100}+\\dfrac{y^2}{64}=1$.',
                id: 'Lengkapi eksentrisitas $\\dfrac{x^2}{100}+\\dfrac{y^2}{64}=1$.',
              },
              template: 'a=10,\\ b=8:\\quad c=___,\\quad e=\\dfrac{c}{a}=___',
              blanks: ['6', '3/5'],
              explain: {
                en: '$c=\\sqrt{100-64}=6$, so $e=\\frac{6}{10}=\\frac35$, between $0$ and $1$ as an ellipse requires.',
                id: '$c=\\sqrt{100-64}=6$, sehingga $e=\\frac{6}{10}=\\frac35$, di antara $0$ dan $1$ seperti yang disyaratkan elips.',
              },
              hint: {
                en: 'For an ellipse $c^2=a^2-b^2$. Once you have $c$, divide it by $a$.',
                id: 'Untuk elips $c^2=a^2-b^2$. Setelah mendapat $c$, bagilah dengan $a$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For the ellipse $\\dfrac{x^2}{36}+\\dfrac{y^2}{20}=1$, find $c$, the eccentricity $e$, and the positive directrix $x=a/e$.',
                id: 'Untuk elips $\\dfrac{x^2}{36}+\\dfrac{y^2}{20}=1$, tentukan $c$, eksentrisitas $e$, dan direktriks positif $x=a/e$.',
              },
              blanks: [
                { label: 'c =', answer: 4 },
                { label: 'e =', answer: 2 / 3 },
                { label: 'x =', answer: 9 },
              ],
              hints: [
                { en: 'The larger denominator is $a^2=36$, so $a=6$; then $c^2=a^2-b^2$.', id: 'Penyebut yang lebih besar adalah $a^2=36$, jadi $a=6$; lalu $c^2=a^2-b^2$.' },
                { en: 'You may type a fraction such as `2/3` for $e$. The directrix is $x=a/e$.', id: 'Kamu boleh mengetik pecahan seperti `2/3` untuk $e$. Direktriksnya $x=a/e$.' },
              ],
              explain: {
                en: '$a=6$, $c=\\sqrt{36-20}=4$, so $e=\\frac46=\\frac23$, and the directrices are $x=\\pm\\frac{6}{2/3}=\\pm9$.',
                id: '$a=6$, $c=\\sqrt{36-20}=4$, sehingga $e=\\frac46=\\frac23$, dan direktriksnya $x=\\pm\\frac{6}{2/3}=\\pm9$.',
              },
            },
          ],
        },
        {
          id: 'par-m3-s2-l2',
          title: { en: 'Polar Equations of Conics', id: 'Persamaan Kutub Konik' },
          goal: {
            en: 'Derive $r=\\dfrac{ke}{1+e\\cos\\theta}$ from $PF=e\\cdot PD$ and read the type, directrix, and nearest and farthest points from a polar conic.',
            id: 'Menurunkan $r=\\dfrac{ke}{1+e\\cos\\theta}$ dari $PF=e\\cdot PD$ dan membaca jenis, direktriks, serta titik terdekat dan terjauh dari sebuah konik kutub.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Putting the focus at the pole', id: 'Menaruh fokus di kutub' },
              body: {
                en: 'In polar coordinates the cleanest place for a focus is the **pole**. Take the directrix to be the vertical line $x=k$ with $k>0$ and let $P(r,\\theta)$ be a point of the conic. Then $PF=r$, and since $P$ has $x=r\\cos\\theta$, the distance to the directrix is $PD=k-r\\cos\\theta$.\n\nNow $PF=e\\cdot PD$ becomes an equation for $r$ alone:\n$$r=e(k-r\\cos\\theta)\\ \\Rightarrow\\ r(1+e\\cos\\theta)=ke\\ \\Rightarrow\\ r=\\frac{ke}{1+e\\cos\\theta}$$\nIt is an ellipse for $e<1$, a parabola for $e=1$, and a hyperbola for $e>1$. Moving the directrix to the other side or turning it sideways only changes the sign and the trig function:\n\n| Directrix | Equation | Axis of symmetry |\n| --- | --- | --- |\n| $x=k$ | $r=\\dfrac{ke}{1+e\\cos\\theta}$ | $x$-axis |\n| $x=-k$ | $r=\\dfrac{ke}{1-e\\cos\\theta}$ | $x$-axis |\n| $y=k$ | $r=\\dfrac{ke}{1+e\\sin\\theta}$ | $y$-axis |\n| $y=-k$ | $r=\\dfrac{ke}{1-e\\sin\\theta}$ | $y$-axis |',
                id: 'Dalam koordinat kutub, tempat terbersih untuk sebuah fokus adalah **kutub**. Ambil direktriks sebagai garis tegak $x=k$ dengan $k>0$ dan biarkan $P(r,\\theta)$ sebuah titik pada konik. Maka $PF=r$, dan karena $P$ punya $x=r\\cos\\theta$, jarak ke direktriks adalah $PD=k-r\\cos\\theta$.\n\nSekarang $PF=e\\cdot PD$ menjadi persamaan untuk $r$ saja:\n$$r=e(k-r\\cos\\theta)\\ \\Rightarrow\\ r(1+e\\cos\\theta)=ke\\ \\Rightarrow\\ r=\\frac{ke}{1+e\\cos\\theta}$$\nIa elips untuk $e<1$, parabola untuk $e=1$, dan hiperbola untuk $e>1$. Memindahkan direktriks ke sisi lain atau memutarnya ke samping hanya mengubah tanda dan fungsi trigonometrinya:\n\n| Direktriks | Persamaan | Sumbu simetri |\n| --- | --- | --- |\n| $x=k$ | $r=\\dfrac{ke}{1+e\\cos\\theta}$ | sumbu-$x$ |\n| $x=-k$ | $r=\\dfrac{ke}{1-e\\cos\\theta}$ | sumbu-$x$ |\n| $y=k$ | $r=\\dfrac{ke}{1+e\\sin\\theta}$ | sumbu-$y$ |\n| $y=-k$ | $r=\\dfrac{ke}{1-e\\sin\\theta}$ | sumbu-$y$ |',
              },
              figure: figPolarSlider,
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Reading a polar conic', id: 'Membaca konik kutub' },
              body: {
                en: 'Reading a polar conic is a short routine:\n\n1. Divide the top and bottom so the denominator starts with $1$; it then reads $1\\pm e\\cos\\theta$ or $1\\pm e\\sin\\theta$.\n2. The coefficient of the trig term is $e$; compare it with $1$ to name the conic.\n3. The numerator is $ke$; divide by $e$ to get $k$, and let the sign and the trig function say which directrix it is.\n\nThe two ends of an ellipse\'s axis are the points nearest to and farthest from the focus. For $r=\\frac{ke}{1+e\\cos\\theta}$ they come from $\\theta=0$ and $\\theta=\\pi$:\n$$r_{\\min}=\\frac{ke}{1+e},\\qquad r_{\\max}=\\frac{ke}{1-e}$$\n\nFor an orbit around the Sun these are the **perihelion** and **aphelion** distances, and they add up to the major axis, $2a=r_{\\min}+r_{\\max}$. With $1-e\\cos\\theta$ in the denominator the two swap places.\n\nFor example, $r=\\dfrac{3}{1+0.5\\cos\\theta}$ describes a probe orbiting a planet, with $r$ in thousands of kilometers. The denominator already starts with $1$, so $e=0.5$ (an ellipse) and $ke=3$ gives $k=6$, a directrix at $x=6$. The nearest distance is $r(0)=2$ and the farthest is $r(\\pi)=6$, so $2a=8$, $a=4$, and $c=ea=2$, the focus sitting $2$ from the center as the figure shows.\n\nOne more polar fact, this time for lines: $r\\cos(\\theta-\\theta_0)=r_0$ is the line whose point nearest the pole lies at distance $r_0$ in the direction $\\theta_0$.',
                id: 'Membaca konik kutub adalah rutinitas singkat:\n\n1. Bagi atas dan bawah sehingga penyebutnya diawali $1$; ia kemudian berbentuk $1\\pm e\\cos\\theta$ atau $1\\pm e\\sin\\theta$.\n2. Koefisien suku trigonometrinya adalah $e$; bandingkan dengan $1$ untuk menamai koniknya.\n3. Pembilangnya $ke$; bagi dengan $e$ untuk mendapat $k$, dan biarkan tanda serta fungsi trigonometrinya menunjukkan direktriks yang mana.\n\nKedua ujung sumbu elips adalah titik yang terdekat dan terjauh dari fokus. Untuk $r=\\frac{ke}{1+e\\cos\\theta}$ keduanya berasal dari $\\theta=0$ dan $\\theta=\\pi$:\n$$r_{\\min}=\\frac{ke}{1+e},\\qquad r_{\\max}=\\frac{ke}{1-e}$$\n\nUntuk orbit mengelilingi Matahari, ini adalah jarak **perihelion** dan **aphelion**, dan keduanya berjumlah sumbu mayor, $2a=r_{\\min}+r_{\\max}$. Dengan $1-e\\cos\\theta$ pada penyebut, keduanya bertukar tempat.\n\nMisalnya, $r=\\dfrac{3}{1+0{,}5\\cos\\theta}$ menggambarkan sebuah wahana yang mengorbit planet, dengan $r$ dalam ribuan kilometer. Penyebutnya sudah diawali $1$, jadi $e=0{,}5$ (elips) dan $ke=3$ memberi $k=6$, direktriks di $x=6$. Jarak terdekatnya $r(0)=2$ dan terjauhnya $r(\\pi)=6$, sehingga $2a=8$, $a=4$, dan $c=ea=2$, fokus berada $2$ dari pusat seperti yang ditunjukkan gambar.\n\nSatu fakta kutub lagi, kali ini untuk garis: $r\\cos(\\theta-\\theta_0)=r_0$ adalah garis yang titik terdekatnya ke kutub berjarak $r_0$ pada arah $\\theta_0$.',
              },
              figure: figOrbit,
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which polar equation describes a conic with a focus at the pole whose directrix is the horizontal line $y=-k$, below the pole?',
                id: 'Persamaan kutub manakah yang menggambarkan konik dengan fokus di kutub yang direktriksnya garis mendatar $y=-k$, di bawah kutub?',
              },
              options: [
                { en: '$r=\\dfrac{ke}{1-e\\sin\\theta}$', id: '$r=\\dfrac{ke}{1-e\\sin\\theta}$' },
                { en: '$r=\\dfrac{ke}{1+e\\sin\\theta}$', id: '$r=\\dfrac{ke}{1+e\\sin\\theta}$' },
                { en: '$r=\\dfrac{ke}{1-e\\cos\\theta}$', id: '$r=\\dfrac{ke}{1-e\\cos\\theta}$' },
                { en: '$r=\\dfrac{ke}{1+e\\cos\\theta}$', id: '$r=\\dfrac{ke}{1+e\\cos\\theta}$' },
              ],
              answer: 0,
              explain: {
                en: 'A horizontal directrix means $\\sin\\theta$, and a directrix on the negative side means the minus sign: $PD=k+r\\sin\\theta$ gives $r(1-e\\sin\\theta)=ke$.',
                id: 'Direktriks mendatar berarti $\\sin\\theta$, dan direktriks di sisi negatif berarti tanda minus: $PD=k+r\\sin\\theta$ memberi $r(1-e\\sin\\theta)=ke$.',
              },
              hint: {
                en: 'The trig function follows the direction of the directrix (vertical lines use $\\cos\\theta$, horizontal lines use $\\sin\\theta$), and the sign follows which side of the pole it is on.',
                id: 'Fungsi trigonometrinya mengikuti arah direktriks (garis tegak memakai $\\cos\\theta$, garis mendatar memakai $\\sin\\theta$), dan tandanya mengikuti sisi kutub tempat ia berada.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The figure shows a conic with a focus at the pole. Reading its nearest and farthest points off the $x$-axis, what is its eccentricity?',
                id: 'Gambar menunjukkan konik dengan fokus di kutub. Dengan membaca titik terdekat dan terjauhnya pada sumbu-$x$, berapa eksentrisitasnya?',
              },
              figure: figPolarQuiz,
              options: [
                { en: '$\\tfrac{1}{3}$', id: '$\\tfrac{1}{3}$' },
                { en: '$\\tfrac{1}{2}$', id: '$\\tfrac{1}{2}$' },
                { en: '$\\tfrac{2}{3}$', id: '$\\tfrac{2}{3}$' },
                { en: '$3$', id: '$3$' },
              ],
              answer: 0,
              explain: {
                en: 'The nearest distance is $3$ and the farthest is $6$, so $2a=9$, $a=4.5$, and the focus is $c=a-3=1.5$ from the center. Then $e=c/a=\\frac13$.',
                id: 'Jarak terdekatnya $3$ dan terjauhnya $6$, sehingga $2a=9$, $a=4{,}5$, dan fokus berjarak $c=a-3=1{,}5$ dari pusat. Maka $e=c/a=\\frac13$.',
              },
              hint: {
                en: 'Half the sum of the two distances is $a$, and the focus lies $c$ from the center. Work out $c$ before you divide.',
                id: 'Setengah jumlah kedua jarak adalah $a$, dan fokus berjarak $c$ dari pusat. Hitung $c$ dulu sebelum membagi.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the steps that turn $PF=e\\cdot PD$ into the polar equation of a conic with the directrix $x=k$.',
                id: 'Susun langkah yang mengubah $PF=e\\cdot PD$ menjadi persamaan kutub konik dengan direktriks $x=k$.',
              },
              lines: [
                'PF=e\\cdot PD',
                'r=e\\,(k-r\\cos\\theta)',
                'r+e\\,r\\cos\\theta=ke',
                'r\\,(1+e\\cos\\theta)=ke',
                'r=\\dfrac{ke}{1+e\\cos\\theta}',
              ],
              explain: {
                en: 'Start from the definition, write both distances in $r$ and $\\theta$, expand, factor out $r$, and divide.',
                id: 'Mulai dari definisi, tulis kedua jarak dalam $r$ dan $\\theta$, jabarkan, faktorkan $r$, lalu bagi.',
              },
              hint: {
                en: 'Replace $PF$ and $PD$ by their polar expressions first; the algebra after that collects every $r$ on one side and ends with a division.',
                id: 'Ganti $PF$ dan $PD$ dengan ungkapan kutubnya lebih dulu; aljabar setelahnya mengumpulkan semua $r$ di satu sisi dan diakhiri dengan pembagian.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The orbit $r=\\dfrac{16}{5+3\\cos\\theta}$ has a focus at the pole. Divide the top and bottom by $5$, then find its eccentricity, its nearest and farthest distances, and its semimajor axis.',
                id: 'Orbit $r=\\dfrac{16}{5+3\\cos\\theta}$ punya fokus di kutub. Bagi atas dan bawah dengan $5$, lalu tentukan eksentrisitasnya, jarak terdekat dan terjauhnya, serta sumbu semimayornya.',
              },
              blanks: [
                { label: 'e =', answer: 0.6 },
                { label: 'r_{\\min} =', answer: 2 },
                { label: 'r_{\\max} =', answer: 8 },
                { label: 'a =', answer: 5 },
              ],
              hints: [
                { en: 'After dividing by $5$ the coefficient of $\\cos\\theta$ in the denominator is $e$.', id: 'Setelah dibagi $5$, koefisien $\\cos\\theta$ pada penyebut adalah $e$.' },
                { en: 'Put $\\theta=0$ and $\\theta=\\pi$ into the original equation: the denominators are $5+3$ and $5-3$.', id: 'Masukkan $\\theta=0$ dan $\\theta=\\pi$ ke persamaan asli: penyebutnya $5+3$ dan $5-3$.' },
              ],
              explain: {
                en: '$r=\\frac{3.2}{1+0.6\\cos\\theta}$, so $e=0.6$. Then $r(0)=\\frac{16}{8}=2$, $r(\\pi)=\\frac{16}{2}=8$, and $a=\\frac{2+8}{2}=5$ — check: $c=ea=3$ and $a-c=2$.',
                id: '$r=\\frac{3{,}2}{1+0{,}6\\cos\\theta}$, sehingga $e=0{,}6$. Lalu $r(0)=\\frac{16}{8}=2$, $r(\\pi)=\\frac{16}{2}=8$, dan $a=\\frac{2+8}{2}=5$ — cek: $c=ea=3$ dan $a-c=2$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'par-m3-s2-p',
        runtime: 'math',
        title: { en: 'Eccentricity and Polar Conics', id: 'Eksentrisitas dan Konik Kutub' },
        brief: {
          en: 'Eccentricity and directrices of a hyperbola and an ellipse, then the nearest and farthest points of a polar orbit whose sign you must read carefully.',
          id: 'Eksentrisitas dan direktriks sebuah hiperbola dan elips, lalu titik terdekat dan terjauh sebuah orbit kutub yang tandanya harus kamu baca dengan cermat.',
        },
        requirements: [
          {
            en: 'Use $e=c/a$ and the directrices $x=\\pm a/e$ for a conic whose foci lie on the $x$-axis.',
            id: 'Pakai $e=c/a$ dan direktriks $x=\\pm a/e$ untuk konik yang fokusnya pada sumbu-$x$.',
          },
          {
            en: 'For a polar conic, normalize the denominator to start with $1$ before reading $e$.',
            id: 'Untuk konik kutub, normalkan penyebut agar diawali $1$ sebelum membaca $e$.',
          },
        ],
        tasks: [
          {
            prompt: {
              en: 'For the hyperbola $\\dfrac{x^2}{16}-\\dfrac{y^2}{9}=1$, find the eccentricity $e$ and the positive directrix $x=a/e$.',
              id: 'Untuk hiperbola $\\dfrac{x^2}{16}-\\dfrac{y^2}{9}=1$, tentukan eksentrisitas $e$ dan direktriks positif $x=a/e$.',
            },
            blanks: [
              { label: 'e =', answer: 1.25 },
              { label: 'x =', answer: 3.2 },
            ],
            solution: {
              en: ['a=4,\\ b=3,\\ c=\\sqrt{16+9}=5', 'e=\\tfrac{c}{a}=\\tfrac54=1.25, \\quad x=\\tfrac{a}{e}=\\tfrac{4}{1.25}=3.2'],
              id: ['a=4,\\ b=3,\\ c=\\sqrt{16+9}=5', 'e=\\tfrac{c}{a}=\\tfrac54=1{,}25, \\quad x=\\tfrac{a}{e}=\\tfrac{4}{1{,}25}=3{,}2'],
            },
          },
          {
            prompt: {
              en: 'An ellipse with its major axis on the $x$-axis has semimajor axis $a=10$ and eccentricity $e=0.8$. Find $c$, $b$, and the positive directrix $x=a/e$.',
              id: 'Sebuah elips dengan sumbu mayor pada sumbu-$x$ punya sumbu semimayor $a=10$ dan eksentrisitas $e=0{,}8$. Tentukan $c$, $b$, dan direktriks positif $x=a/e$.',
            },
            blanks: [
              { label: 'c =', answer: 8 },
              { label: 'b =', answer: 6 },
              { label: 'x =', answer: 12.5 },
            ],
            solution: {
              en: ['c=ea=0.8\\cdot10=8', 'b=\\sqrt{a^2-c^2}=\\sqrt{100-64}=6', 'x=\\tfrac{a}{e}=\\tfrac{10}{0.8}=12.5'],
              id: ['c=ea=0{,}8\\cdot10=8', 'b=\\sqrt{a^2-c^2}=\\sqrt{100-64}=6', 'x=\\tfrac{a}{e}=\\tfrac{10}{0{,}8}=12{,}5'],
            },
          },
          {
            prompt: {
              en: 'The conic $r=\\dfrac{12}{2-\\cos\\theta}$ has a focus at the pole. Find $e$, the nearest distance, the farthest distance, and the semimajor axis $a$.',
              id: 'Konik $r=\\dfrac{12}{2-\\cos\\theta}$ punya fokus di kutub. Tentukan $e$, jarak terdekat, jarak terjauh, dan sumbu semimayor $a$.',
            },
            blanks: [
              { label: 'e =', answer: 0.5 },
              { label: 'r_{\\min} =', answer: 4 },
              { label: 'r_{\\max} =', answer: 12 },
              { label: 'a =', answer: 8 },
            ],
            solution: {
              en: [
                'r=\\dfrac{6}{1-0.5\\cos\\theta} \\Rightarrow e=0.5, \\text{ directrix } x=-12',
                'r(\\pi)=\\tfrac{12}{2+1}=4, \\quad r(0)=\\tfrac{12}{2-1}=12',
                'a=\\tfrac{4+12}{2}=8',
              ],
              id: [
                'r=\\dfrac{6}{1-0{,}5\\cos\\theta} \\Rightarrow e=0{,}5, \\text{ direktriks } x=-12',
                'r(\\pi)=\\tfrac{12}{2+1}=4, \\quad r(0)=\\tfrac{12}{2-1}=12',
                'a=\\tfrac{4+12}{2}=8',
              ],
            },
          },
        ],
        hints: [
          {
            en: 'In task 3 the minus sign in the denominator swaps the roles of $\\theta=0$ and $\\theta=\\pi$: one of them is now the farthest point.',
            id: 'Pada butir 3 tanda minus di penyebut menukar peran $\\theta=0$ dan $\\theta=\\pi$: salah satunya kini menjadi titik terjauh.',
          },
          {
            en: 'The semimajor axis is half the sum of the nearest and farthest distances.',
            id: 'Sumbu semimayor adalah setengah jumlah jarak terdekat dan terjauh.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
