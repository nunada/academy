import type { FigItem, Figure } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './basic-trigonometry.meta'

export { meta }

const L = (en: string, id: string): Loc => ({ en, id })

/** Prose is written between backticks with its TeX unescaped; the code marker
 *  inside it is ´ rather than a backtick, and `*word*` emphasis is dropped.
 *  `[words](article:id#section)` is a link to another article. */
const T = (s: TemplateStringsArray): string =>
  s.raw[0]
    .replace(/´([^´\n]+)´/g, '`$1`')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/^\s+|\s+$/g, '')

/** A static drawing on a plain canvas: the figure items are the only things in it, with no sliders and nothing to drag. The labels inside a
 *  drawing are letters, numbers and symbols, which read the same in both languages; the words are in the caption. */
const fig = (f: Omit<Figure, 'dim' | 'axes'>): ArticleBlock => {
  // With both spans given and no aspect, choose the frame that gives one scale on both axes (a 460-wide drawing with 26 of margin all round), so that circles are round and right angles look right
  const aspect = f.aspect ?? (f.xSpan && f.ySpan ? Math.min(3, Math.max(0.5, 460 / (52 + (460 - 52) * ((f.ySpan[1] - f.ySpan[0]) / (f.xSpan[1] - f.xSpan[0]))))) : 1)
  return { kind: 'figure', figure: { dim: 2, axes: false, ...f, aspect } }
}
const TURN = 6.2832

/** The unit circle with its two axes, for the figures that need them. */
const circleAndAxes = (): FigItem[] => [
  { t: 'seg', from: [-1.35, 0], to: [1.35, 0], color: 'muted' },
  { t: 'seg', from: [0, -1.35], to: [0, 1.35], color: 'muted' },
  { t: 'param', x: 'cos(t)', y: 'sin(t)', from: 0, to: TURN, color: 'muted' },
]

/** The right triangle with its sides named from the angle θ. */
const FIG_TRIANGLE = fig({
  xSpan: [-1, 5.4],
  ySpan: [-0.9, 3.9],
  items: [
    { t: 'poly', pts: [[0, 0], [4, 0], [4, 3]], color: 'a' },
    { t: 'seg', from: [0, 0], to: [4, 0], color: 'b', width: 2.6, label: 'b' },
    { t: 'seg', from: [4, 0], to: [4, 3], color: 'c', width: 2.6, label: 'a' },
    { t: 'seg', from: [0, 0], to: [4, 3], color: 'result', width: 2.6, label: 'c' },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [4, 3], label: 'θ' },
    { t: 'right', at: [4, 0], from: [0, 0], to: [4, 3] },
  ],
  caption: L(
    T`The sides of a right triangle named from the angle $\theta$: $a$ is the opposite side, $b$ the adjacent side and $c$ the hypotenuse. Then $\sin\theta=\frac{a}{c}$, $\cos\theta=\frac{b}{c}$ and $\tan\theta=\frac{a}{b}$.`,
    T`Sisi-sisi segitiga siku-siku diberi nama dari sudut $\theta$: $a$ adalah sisi depan, $b$ sisi samping, dan $c$ sisi miring. Maka $\sin\theta=\frac{a}{c}$ (sin-de-mi), $\cos\theta=\frac{b}{c}$ (cos-sa-mi), dan $\tan\theta=\frac{a}{b}$ (tan-de-sa).`,
  ),
})

/** Two similar right triangles. */
const FIG_SIMILAR = fig({
  xSpan: [-1, 9.6],
  ySpan: [-1, 7.2],
  items: [
    { t: 'poly', pts: [[0, 0], [8, 0], [8, 6]], color: 'muted', look: 'outline' },
    { t: 'poly', pts: [[0, 0], [4, 0], [4, 3]], color: 'a' },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [8, 6], label: 'θ' },
    { t: 'right', at: [8, 0], from: [0, 0], to: [8, 6] },
    { t: 'right', at: [4, 0], from: [0, 0], to: [4, 3] },
    { t: 'text', at: [2, -0.55], text: '4', color: 'a' },
    { t: 'text', at: [4.55, 1.5], text: '3', color: 'a' },
    { t: 'text', at: [1.6, 2.1], text: '5', color: 'a' },
    { t: 'text', at: [6, -0.55], text: '8', color: 'muted' },
    { t: 'text', at: [8.6, 3], text: '6', color: 'muted' },
    { t: 'text', at: [5.6, 4.9], text: '10', color: 'muted' },
    { t: 'text', at: [2.4, 6.2], text: 'sin θ = 3/5 = 6/10', size: 'lg', color: 'result' },
  ],
  caption: L(
    T`Two right triangles with the same angle $\theta$. Every side of the larger one is twice the matching side of the smaller one, so $\sin\theta=\frac35=\frac{6}{10}$ in both: the ratio belongs to the angle, not to the size of the triangle.`,
    T`Dua segitiga siku-siku dengan sudut $\theta$ yang sama. Setiap sisi segitiga yang lebih besar dua kali sisi yang bersesuaian pada yang lebih kecil, sehingga $\sin\theta=\frac35=\frac{6}{10}$ pada keduanya: perbandingan itu milik sudutnya, bukan ukuran segitiganya.`,
  ),
})

/** The tower seen at an angle of elevation. */
const FIG_TOWER = fig({
  xSpan: [-1.6, 12],
  ySpan: [-1.6, 8.4],
  items: [
    { t: 'seg', from: [-1, 0], to: [11.2, 0], color: 'muted', width: 2 },
    { t: 'seg', from: [10, 0], to: [10, 7], color: 'b', width: 5 },
    { t: 'seg', from: [0, 0], to: [10, 7], color: 'result', width: 2.2 },
    { t: 'seg', from: [0, 0], to: [10, 0], color: 'muted', dashed: true },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [10, 7], label: '35°' },
    { t: 'right', at: [10, 0], from: [0, 0], to: [10, 7] },
    { t: 'point', at: [0, 0], color: 'a' },
    { t: 'point', at: [10, 7], color: 'b' },
    { t: 'text', at: [5, -0.7], text: '40 m', color: 'a' },
    { t: 'text', at: [10.9, 3.5], text: 'h', size: 'lg', color: 'b' },
  ],
  caption: L(
    T`The tower problem: from $40$ m away you see the top at an angle of elevation of $35^\circ$. The height above your eye is $h=40\tan35^\circ\approx28$ m. (The drawing uses $10$ units for $40$ m.)`,
    T`Soal menara: dari jarak $40$ m Anda melihat puncaknya dengan sudut elevasi $35^\circ$. Tinggi di atas mata Anda adalah $h=40\tan35^\circ\approx28$ m. (Gambar memakai $10$ satuan untuk $40$ m.)`,
  ),
})

/** Half of an equilateral triangle. */
const FIG_HALF_EQUILATERAL = fig({
  range: 1.6, // the size of the angle arcs and of the right-angle marks follows this, and these drawings are small in graph units
  xSpan: [-0.7, 2.7],
  ySpan: [-0.6, 2.25],
  items: [
    { t: 'poly', pts: [[0, 0], [2, 0], [1, 1.732]], color: 'muted', look: 'outline' },
    { t: 'poly', pts: [[0, 0], [1, 0], [1, 1.732]], color: 'a' },
    { t: 'seg', from: [0, 0], to: [1, 0], color: 'b', width: 2.6, label: '1' },
    { t: 'seg', from: [1, 0], to: [1, 1.732], color: 'c', width: 2.6, label: '√3' },
    { t: 'seg', from: [0, 0], to: [1, 1.732], color: 'result', width: 2.6, label: '2' },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [1, 1.732], label: '60°' },
    { t: 'angle', at: [1, 1.732], from: [1, 0], to: [0, 0], label: '30°' },
    { t: 'right', at: [1, 0], from: [0, 0], to: [1, 1.732] },
  ],
  caption: L(
    T`An equilateral triangle of side $2$ cut along its height. Each half is a right triangle with angles $30^\circ$, $60^\circ$, $90^\circ$ and sides $1$, $\sqrt3$, $2$ (the long leg is $\sqrt{2^2-1^2}=\sqrt3$).`,
    T`Segitiga sama sisi bersisi $2$ yang dibelah sepanjang tingginya. Setiap belahan adalah segitiga siku-siku dengan sudut $30^\circ$, $60^\circ$, $90^\circ$ dan sisi $1$, $\sqrt3$, $2$ (sisi tegak panjangnya $\sqrt{2^2-1^2}=\sqrt3$).`,
  ),
})

/** Half of a square. */
const FIG_HALF_SQUARE = fig({
  range: 1.2, // the size of the angle arcs and of the right-angle marks follows this, and these drawings are small in graph units
  xSpan: [-0.6, 1.7],
  ySpan: [-0.5, 1.4],
  items: [
    { t: 'poly', pts: [[0, 0], [1, 0], [1, 1], [0, 1]], color: 'muted', look: 'outline' },
    { t: 'poly', pts: [[0, 0], [1, 0], [1, 1]], color: 'a' },
    { t: 'seg', from: [0, 0], to: [1, 0], color: 'b', width: 2.6, label: '1' },
    { t: 'seg', from: [1, 0], to: [1, 1], color: 'c', width: 2.6, label: '1' },
    { t: 'seg', from: [0, 0], to: [1, 1], color: 'result', width: 2.6, label: '√2' },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [1, 1], label: '45°' },
    { t: 'angle', at: [1, 1], from: [1, 0], to: [0, 0], label: '45°' },
    { t: 'right', at: [1, 0], from: [0, 0], to: [1, 1] },
  ],
  caption: L(
    T`A square of side $1$ cut along a diagonal. Each half is a right triangle with two angles of $45^\circ$ and sides $1$, $1$, $\sqrt2$, so $\sin45^\circ=\cos45^\circ=\frac{1}{\sqrt2}=\frac{\sqrt2}{2}$ and $\tan45^\circ=1$.`,
    T`Persegi bersisi $1$ yang dibelah sepanjang diagonalnya. Setiap belahan adalah segitiga siku-siku dengan dua sudut $45^\circ$ dan sisi $1$, $1$, $\sqrt2$, sehingga $\sin45^\circ=\cos45^\circ=\frac{1}{\sqrt2}=\frac{\sqrt2}{2}$ dan $\tan45^\circ=1$.`,
  ),
})

/** The unit circle with the right triangle of an angle in the first quadrant. */
const FIG_UNIT_CIRCLE = fig({
  range: 1.5, // the size of the angle arcs and of the right-angle marks follows this, and these drawings are small in graph units
  xSpan: [-1.45, 2.7],
  ySpan: [-1.4, 1.4],
  items: [
    ...circleAndAxes(),
    { t: 'seg', from: [0, 0], to: [0.766, 0.6428], color: 'a', width: 2.8, label: '1' },
    { t: 'seg', from: [0, 0], to: [0.766, 0], color: 'b', width: 3.2, label: 'cos θ' },
    { t: 'seg', from: [0.766, 0], to: [0.766, 0.6428], color: 'c', width: 3.2, label: 'sin θ' },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [0.766, 0.6428], label: 'θ' },
    { t: 'right', at: [0.766, 0], from: [0, 0], to: [0.766, 0.6428] },
    { t: 'point', at: [0.766, 0.6428], label: '(cos θ, sin θ)', color: 'result' },
  ],
  caption: L(
    T`The unit circle. The point at the angle $\theta$ is $(\cos\theta,\sin\theta)$: the radius is the hypotenuse, of length $1$, the horizontal leg is $\cos\theta$ and the vertical leg is $\sin\theta$. Pythagoras gives $\sin^2\theta+\cos^2\theta=1$.`,
    T`Lingkaran satuan. Titik pada sudut $\theta$ adalah $(\cos\theta,\sin\theta)$: jari-jari adalah sisi miring, berpanjang $1$, sisi tegak mendatar adalah $\cos\theta$ dan sisi tegak vertikal adalah $\sin\theta$. Pythagoras memberi $\sin^2\theta+\cos^2\theta=1$.`,
  ),
})

/** An angle in the second quadrant, its reference angle, and the signs of the four quadrants. */
const FIG_QUADRANTS = fig({
  range: 1.5, // the size of the angle arcs and of the right-angle marks follows this, and these drawings are small in graph units
  xSpan: [-2.45, 2.45],
  ySpan: [-1.3, 1.3],
  items: [
    ...circleAndAxes(),
    { t: 'seg', from: [0, 0], to: [-0.866, 0.5], color: 'a', width: 2.8 },
    { t: 'seg', from: [-0.866, 0.5], to: [-0.866, 0], color: 'c', dashed: true },
    { t: 'angle', at: [0, 0], from: [-1, 0], to: [-0.866, 0.5], label: '30°' },
    { t: 'param', x: '0.3*cos(t)', y: '0.3*sin(t)', from: 0, to: 2.618, color: 'result', dashed: true },
    { t: 'text', at: [0.55, 0.17], text: '150°', size: 'sm', color: 'result' },
    { t: 'point', at: [-0.866, 0.5], color: 'a' },
    { t: 'text', at: [1.65, 0.8], text: 'I:  + + +', size: 'lg', color: 'muted' },
    { t: 'text', at: [-1.65, 0.8], text: 'II:  + − −', size: 'lg', color: 'a' },
    { t: 'text', at: [-1.65, -0.8], text: 'III:  − − +', size: 'lg', color: 'muted' },
    { t: 'text', at: [1.65, -0.8], text: 'IV:  − + −', size: 'lg', color: 'muted' },
  ],
  caption: L(
    T`The angle $150^\circ$ is in quadrant II. Its reference angle is $180^\circ-150^\circ=30^\circ$, so $\sin150^\circ=\sin30^\circ=\frac12$ (positive there) and $\cos150^\circ=-\cos30^\circ=-\frac{\sqrt3}{2}$ (negative there). The signs written in each quadrant are those of $\sin$, $\cos$ and $\tan$, in that order.`,
    T`Sudut $150^\circ$ berada di kuadran II. Sudut acuannya adalah $180^\circ-150^\circ=30^\circ$, sehingga $\sin150^\circ=\sin30^\circ=\frac12$ (positif di sana) dan $\cos150^\circ=-\cos30^\circ=-\frac{\sqrt3}{2}$ (negatif di sana). Tanda yang tertulis di tiap kuadran adalah tanda $\sin$, $\cos$, dan $\tan$, dalam urutan itu.`,
  ),
})

/** One turn of the sine wave and the cosine wave. */
const FIG_WAVES = fig({
  xSpan: [-0.8, 7.1],
  ySpan: [-1.9, 1.7],
  items: [
    { t: 'seg', from: [-0.5, 0], to: [6.9, 0], color: 'muted' },
    { t: 'seg', from: [0, -1.5], to: [0, 1.5], color: 'muted' },
    { t: 'seg', from: [1.5708, 0], to: [1.5708, -1.35], color: 'muted', dashed: true },
    { t: 'seg', from: [3.1416, 0], to: [3.1416, -1.35], color: 'muted', dashed: true },
    { t: 'seg', from: [4.7124, 0], to: [4.7124, -1.35], color: 'muted', dashed: true },
    { t: 'seg', from: [TURN, 0], to: [TURN, -1.35], color: 'muted', dashed: true },
    { t: 'curve', f: 'cos(x)', from: 0, to: TURN, color: 'b', dashed: true },
    { t: 'curve', f: 'sin(x)', from: 0, to: TURN, color: 'a' },
    { t: 'dot', x: 1.5708, y: 1, color: 'result' },
    { t: 'dot', x: 3.1416, y: 0, color: 'result' },
    { t: 'dot', x: 4.7124, y: -1, color: 'result' },
    { t: 'dot', x: TURN, y: 0, color: 'result' },
    { t: 'text', at: [1.5708, -1.62], text: '90°', size: 'sm', color: 'muted' },
    { t: 'text', at: [3.1416, -1.62], text: '180°', size: 'sm', color: 'muted' },
    { t: 'text', at: [4.7124, -1.62], text: '270°', size: 'sm', color: 'muted' },
    { t: 'text', at: [TURN, -1.62], text: '360°', size: 'sm', color: 'muted' },
    { t: 'text', at: [-0.4, 1], text: '1', size: 'sm', color: 'muted' },
    { t: 'text', at: [-0.45, -1], text: '−1', size: 'sm', color: 'muted' },
    { t: 'text', at: [2.2, 1.3], text: 'sin', color: 'a' },
    { t: 'text', at: [0.55, 1.3], text: 'cos', color: 'b' },
  ],
  caption: L(
    T`One turn of the sine wave (solid) and of the cosine wave (dashed). The cosine is the sine shifted $90^\circ$ to the left. Both oscillate between $-1$ and $1$ and repeat every $360^\circ$.`,
    T`Satu putaran gelombang sinus (garis penuh) dan gelombang kosinus (putus-putus). Kosinus adalah sinus yang digeser $90^\circ$ ke kiri. Keduanya berosilasi di antara $-1$ dan $1$ dan berulang setiap $360^\circ$.`,
  ),
})

/** The graph of y = 2 sin 3x + 1 with its amplitude, period and midline marked. */
const FIG_WAVE_PARTS = fig({
  xSpan: [-40, 410],
  ySpan: [-2.5, 4],
  aspect: 2.3,
  items: [
    { t: 'seg', from: [-20, 0], to: [380, 0], color: 'muted' },
    { t: 'seg', from: [0, -2.1], to: [0, 3.8], color: 'muted' },
    { t: 'hline', y: 1, color: 'b', dashed: true },
    { t: 'vline', x: 120, color: 'muted', dashed: true },
    { t: 'curve', f: '2*sin(3*x*pi/180)+1', from: 0, to: 360, color: 'a' },
    { t: 'dot', x: 30, y: 3, color: 'result' },
    { t: 'dot', x: 90, y: -1, color: 'result' },
    { t: 'seg', from: [30, 1], to: [30, 3], color: 'result', width: 3 },
    { t: 'text', at: [78, 2.35], text: '|a| = 2', color: 'result' },
    { t: 'seg', from: [0, -1.8], to: [120, -1.8], color: 'c', width: 3 },
    { t: 'text', at: [60, -2.25], text: '120°', color: 'c' },
    { t: 'text', at: [-22, 1.3], text: 'd = 1', size: 'sm', color: 'b' },
    { t: 'text', at: [330, 3.5], text: 'y = 2 sin 3x + 1', size: 'lg', color: 'a' },
  ],
  caption: L(
    T`The graph of $y=2\sin3x+1$. The midline is $y=1$ (dashed), the amplitude is $2$ (from the midline up to the peak at $y=3$) and the period is $\frac{360^\circ}{3}=120^\circ$ (the bar at the bottom).`,
    T`Grafik $y=2\sin3x+1$. Garis tengahnya $y=1$ (putus-putus), amplitudonya $2$ (dari garis tengah ke puncak di $y=3$), dan periodenya $\frac{360^\circ}{3}=120^\circ$ (batang di bagian bawah).`,
  ),
})

/** The equation sin x = 1/2 as the crossings of a wave and a line. */
const FIG_EQUATION = fig({
  xSpan: [-40, 410],
  ySpan: [-1.5, 1.5],
  aspect: 2.5,
  items: [
    { t: 'seg', from: [-20, 0], to: [380, 0], color: 'muted' },
    { t: 'seg', from: [0, -1.2], to: [0, 1.25], color: 'muted' },
    { t: 'curve', f: 'sin(x*pi/180)', from: 0, to: 360, color: 'a' },
    { t: 'hline', y: 0.5, color: 'result', dashed: true },
    { t: 'seg', from: [30, 0.5], to: [30, 0], color: 'muted', dashed: true },
    { t: 'seg', from: [150, 0.5], to: [150, 0], color: 'muted', dashed: true },
    { t: 'dot', x: 30, y: 0.5, color: 'result' },
    { t: 'dot', x: 150, y: 0.5, color: 'result' },
    { t: 'text', at: [30, -0.22], text: '30°', size: 'sm', color: 'result' },
    { t: 'text', at: [150, -0.22], text: '150°', size: 'sm', color: 'result' },
    { t: 'text', at: [-24, 0.68], text: '1/2', size: 'sm', color: 'result' },
  ],
  caption: L(
    T`The equation $\sin x=\frac12$. The line $y=\frac12$ cuts the sine wave between $0^\circ$ and $360^\circ$ at two points, $x=30^\circ$ and $x=180^\circ-30^\circ=150^\circ$; every further turn adds $360^\circ$.`,
    T`Persamaan $\sin x=\frac12$. Garis $y=\frac12$ memotong gelombang sinus di antara $0^\circ$ dan $360^\circ$ di dua titik, $x=30^\circ$ dan $x=180^\circ-30^\circ=150^\circ$; setiap putaran berikutnya menambah $360^\circ$.`,
  ),
})

export const body: ArticleBody = {
  answer: L(
    T`**Trigonometry links the angles of a triangle to the lengths of its sides: in a right triangle, the sine of an angle is the opposite side over the hypotenuse, the cosine is the adjacent side over the hypotenuse, and the tangent is the opposite side over the adjacent side.** These ratios depend only on the angle, never on the size of the triangle, so one angle and one side give you every other side. The unit circle extends them to every angle, positive or negative.`,
    T`**Trigonometri menghubungkan sudut segitiga dengan panjang sisinya: pada segitiga siku-siku, sinus sebuah sudut adalah sisi depan dibagi sisi miring, kosinus adalah sisi samping dibagi sisi miring, dan tangen adalah sisi depan dibagi sisi samping.** Perbandingan ini hanya bergantung pada sudut, tidak pernah pada ukuran segitiga, sehingga satu sudut dan satu sisi memberi semua sisi lainnya. Lingkaran satuan memperluasnya ke setiap sudut, positif maupun negatif.`,
  ),

  keyPoints: [
    L(
      T`For an acute angle $\theta$ of a right triangle: $\sin\theta=\frac{\text{opposite}}{\text{hypotenuse}}$, $\cos\theta=\frac{\text{adjacent}}{\text{hypotenuse}}$, $\tan\theta=\frac{\text{opposite}}{\text{adjacent}}$ (SOH-CAH-TOA). Their reciprocals are $\csc\theta$, $\sec\theta$ and $\cot\theta$. Two right triangles with the same angle are similar, so the ratios do not depend on the size.`,
      T`Untuk sudut lancip $\theta$ pada segitiga siku-siku: $\sin\theta=\frac{\text{depan}}{\text{miring}}$, $\cos\theta=\frac{\text{samping}}{\text{miring}}$, $\tan\theta=\frac{\text{depan}}{\text{samping}}$ (sin-de-mi, cos-sa-mi, tan-de-sa). Kebalikannya adalah $\csc\theta$, $\sec\theta$, dan $\cot\theta$. Dua segitiga siku-siku dengan sudut sama sebangun, sehingga perbandingannya tidak bergantung pada ukuran.`,
    ),
    L(
      T`To find a missing side, pick the ratio that holds the side you know and the side you want, and solve; to find an angle, use the inverse function ($\arcsin$, $\arccos$, $\arctan$). Always check the calculator mode: degrees for a problem in degrees.`,
      T`Untuk mencari sisi yang hilang, pilih perbandingan yang memuat sisi yang diketahui dan sisi yang dicari, lalu selesaikan; untuk mencari sudut, pakai fungsi invers ($\arcsin$, $\arccos$, $\arctan$). Selalu periksa mode kalkulator: derajat untuk soal dalam derajat.`,
    ),
    L(
      T`The exact values at $30^\circ$, $45^\circ$ and $60^\circ$ come from half an equilateral triangle and half a square: $\sin30^\circ=\frac12$, $\sin45^\circ=\frac{\sqrt2}{2}$, $\sin60^\circ=\frac{\sqrt3}{2}$, with the cosines in reverse order, and $\tan$ is $\frac{\sqrt3}{3}$, $1$, $\sqrt3$.`,
      T`Nilai eksak pada $30^\circ$, $45^\circ$, dan $60^\circ$ berasal dari setengah segitiga sama sisi dan setengah persegi: $\sin30^\circ=\frac12$, $\sin45^\circ=\frac{\sqrt2}{2}$, $\sin60^\circ=\frac{\sqrt3}{2}$, dengan kosinus dalam urutan terbalik, dan $\tan$ bernilai $\frac{\sqrt3}{3}$, $1$, $\sqrt3$.`,
    ),
    L(
      T`On the unit circle the point at angle $\theta$ is $(\cos\theta,\sin\theta)$. That defines the functions for every angle, with signs by quadrant (all positive in I, sine in II, tangent in III, cosine in IV) and the value equal to the value at the reference angle, up to sign. Sine and cosine repeat every $360^\circ$, tangent every $180^\circ$.`,
      T`Pada lingkaran satuan titik pada sudut $\theta$ adalah $(\cos\theta,\sin\theta)$. Itu mendefinisikan fungsi untuk setiap sudut, dengan tanda menurut kuadran (semua positif di I, sinus di II, tangen di III, kosinus di IV) dan nilai sama dengan nilai pada sudut acuan, kecuali tandanya. Sinus dan kosinus berulang setiap $360^\circ$, tangen setiap $180^\circ$.`,
    ),
    L(
      T`The basic identities are $\sin^2\theta+\cos^2\theta=1$, $\tan\theta=\frac{\sin\theta}{\cos\theta}$, $\sin(90^\circ-\theta)=\cos\theta$, $\sin2\theta=2\sin\theta\cos\theta$ and $\sin(\alpha+\beta)=\sin\alpha\cos\beta+\cos\alpha\sin\beta$. The tempting ones such as $\sin(\alpha+\beta)=\sin\alpha+\sin\beta$ are false: one lucky angle does not prove an identity.`,
      T`Identitas dasarnya adalah $\sin^2\theta+\cos^2\theta=1$, $\tan\theta=\frac{\sin\theta}{\cos\theta}$, $\sin(90^\circ-\theta)=\cos\theta$, $\sin2\theta=2\sin\theta\cos\theta$, dan $\sin(\alpha+\beta)=\sin\alpha\cos\beta+\cos\alpha\sin\beta$. Yang menggoda seperti $\sin(\alpha+\beta)=\sin\alpha+\sin\beta$ salah: satu sudut yang kebetulan cocok tidak membuktikan identitas.`,
    ),
    L(
      T`The equation $\sin x=c$ has two solutions between $0^\circ$ and $360^\circ$ (the angle and its mirror image), $\cos x=c$ has two, and $\tan x=c$ has two a half turn apart. The graph of $y=a\sin(b(x-c))+d$ has amplitude $|a|$, period $\frac{360^\circ}{b}$, phase shift $c$ and midline $y=d$. In code, convert degrees to radians, and prefer ´atan2´ to find an angle.`,
      T`Persamaan $\sin x=c$ memiliki dua penyelesaian di antara $0^\circ$ dan $360^\circ$ (sudut itu dan bayangan cerminnya), $\cos x=c$ memiliki dua, dan $\tan x=c$ memiliki dua yang berjarak setengah putaran. Grafik $y=a\sin(b(x-c))+d$ memiliki amplitudo $|a|$, periode $\frac{360^\circ}{b}$, pergeseran fase $c$, dan garis tengah $y=d$. Dalam kode, ubah derajat ke radian, dan pilih ´atan2´ untuk mencari sudut.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- ratios */
    {
      id: 'what-is-trigonometry',
      heading: L('What are sine, cosine and tangent?', 'Apa itu sinus, kosinus, dan tangen?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Trigonometry is the part of mathematics that connects the angles of a triangle with the lengths of its sides; its three basic tools are the sine, the cosine and the tangent of an angle.** The name comes from the Greek for *triangle measure*. It starts with the right triangle, the one with a $90^\circ$ angle.

Pick one of the two acute angles and call it $\theta$. The three sides now have names *relative to $\theta$*:

- the **hypotenuse** is the side opposite the right angle, always the longest;
- the **opposite** side is the one across from $\theta$;
- the **adjacent** side is the other leg, the one that touches $\theta$.`,
            T`**Trigonometri adalah bagian matematika yang menghubungkan sudut segitiga dengan panjang sisinya; tiga alat dasarnya adalah sinus, kosinus, dan tangen sebuah sudut.** Namanya berasal dari bahasa Yunani yang berarti *pengukuran segitiga*. Ia bermula dari segitiga siku-siku, yang memiliki sudut $90^\circ$.

Pilih satu dari dua sudut lancipnya dan sebut $\theta$. Ketiga sisi sekarang memiliki nama *relatif terhadap $\theta$*:

- **sisi miring** (hipotenusa) adalah sisi di depan sudut siku-siku, selalu yang terpanjang;
- **sisi depan** adalah sisi yang berseberangan dengan $\theta$;
- **sisi samping** adalah sisi tegak lainnya, yang menyentuh $\theta$.`,
          ),
        },
        FIG_TRIANGLE,
        {
          kind: 'text',
          text: L(
            T`Then the three ratios are

$$\sin\theta=\frac{\text{opposite}}{\text{hypotenuse}},\qquad \cos\theta=\frac{\text{adjacent}}{\text{hypotenuse}},\qquad \tan\theta=\frac{\text{opposite}}{\text{adjacent}}.$$

A way to remember them is *SOH-CAH-TOA*: Sine is Opposite over Hypotenuse, Cosine is Adjacent over Hypotenuse, Tangent is Opposite over Adjacent. There are also three reciprocals: the cosecant $\csc\theta=\frac{1}{\sin\theta}$, the secant $\sec\theta=\frac{1}{\cos\theta}$ and the cotangent $\cot\theta=\frac{1}{\tan\theta}$.

**Why does this make sense?** Two right triangles that share the angle $\theta$ have all three angles equal, so they are *similar*: one is an enlargement of the other, and the ratio of two sides stays the same. So $\sin\theta$ is a number that belongs to the angle, not to the triangle: it is the same for a triangle on paper and for one the size of a tower. Because the hypotenuse is the longest side, $\sin\theta$ and $\cos\theta$ of an acute angle are always between $0$ and $1$.`,
            T`Maka ketiga perbandingannya adalah

$$\sin\theta=\frac{\text{depan}}{\text{miring}},\qquad \cos\theta=\frac{\text{samping}}{\text{miring}},\qquad \tan\theta=\frac{\text{depan}}{\text{samping}}.$$

Cara mengingatnya adalah *sin-de-mi, cos-sa-mi, tan-de-sa*: Sinus adalah sisi DEpan per sisi MIring, Kosinus adalah sisi SAmping per sisi MIring, Tangen adalah sisi DEpan per sisi SAmping. Ada pula tiga kebalikannya: kosekan $\csc\theta=\frac{1}{\sin\theta}$, sekan $\sec\theta=\frac{1}{\cos\theta}$, dan kotangen $\cot\theta=\frac{1}{\tan\theta}$.

**Mengapa ini masuk akal?** Dua segitiga siku-siku yang sama-sama memiliki sudut $\theta$ memiliki ketiga sudut sama, sehingga *sebangun*: yang satu adalah pembesaran yang lain, dan perbandingan dua sisi tetap sama. Jadi $\sin\theta$ adalah bilangan milik sudut, bukan milik segitiga: ia sama untuk segitiga di atas kertas dan untuk segitiga sebesar menara. Karena sisi miring adalah sisi terpanjang, $\sin\theta$ dan $\cos\theta$ sebuah sudut lancip selalu di antara $0$ dan $1$.`,
          ),
        },
        FIG_SIMILAR,
        {
          kind: 'text',
          text: L(
            T`Two more facts follow at once. The other acute angle is $90^\circ-\theta$, and the opposite and adjacent sides swap when you look from it, so $\sin(90^\circ-\theta)=\cos\theta$. And by the [Pythagorean theorem](article:pythagorean-theorem#what-is-the-theorem), $\text{opposite}^2+\text{adjacent}^2=\text{hypotenuse}^2$; divide by the hypotenuse squared and you get $\sin^2\theta+\cos^2\theta=1$.

Try it: move the angle and the size, and switch the angle you look from.`,
            T`Dua fakta lagi mengikuti. Sudut lancip yang lain adalah $90^\circ-\theta$, dan sisi depan dan samping bertukar bila kita melihat darinya, sehingga $\sin(90^\circ-\theta)=\cos\theta$. Dan menurut [teorema Pythagoras](article:pythagorean-theorem#what-is-the-theorem), $\text{depan}^2+\text{samping}^2=\text{miring}^2$; bagi dengan kuadrat sisi miring dan diperoleh $\sin^2\theta+\cos^2\theta=1$.

Cobalah: geser sudut dan ukurannya, dan ganti sudut yang dilihat.`,
          ),
        },
        { kind: 'widget', name: 'trigratio' },
      ],
    },

    /* ---------------------------------------------------------------------------- right triangles */
    {
      id: 'right-triangles',
      heading: L('How do you find a missing side or angle of a right triangle?', 'Bagaimana mencari sisi atau sudut yang hilang pada segitiga siku-siku?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To find a missing side, choose the ratio that contains the side you know and the side you want, write it down and solve for the unknown; to find a missing angle, use the inverse function of that ratio.** Any right triangle can be solved from an angle and a side, or from two sides.

1. Draw the triangle and mark the angle $\theta$ you are using.
2. Name the sides relative to $\theta$: opposite, adjacent, hypotenuse.
3. Pick the ratio that holds the known side and the unknown side: opposite and hypotenuse mean sine, adjacent and hypotenuse mean cosine, opposite and adjacent mean tangent.
4. Write the equation, for example $\sin\theta=\frac{\text{opposite}}{\text{hypotenuse}}$, and solve it: multiply to find a side, or take the inverse function ($\arcsin$, $\arccos$, $\arctan$) to find an angle.
5. Check that the hypotenuse is the longest side, and that $\text{opposite}^2+\text{adjacent}^2=\text{hypotenuse}^2$.

**Example, a side.** You stand $40$ m from the foot of a tower and see its top at an *angle of elevation* of $35^\circ$ (the angle above the horizontal). The known side is the adjacent $40$ and the unknown is the opposite, so the tangent is the right ratio: $\tan35^\circ=\frac{h}{40}$, hence $h=40\tan35^\circ\approx28.01$ m. (Add the height of your eye to get the height of the tower.) Looking *down* from a tower to a boat uses the *angle of depression*, measured below the horizontal; it equals the angle of elevation seen from the boat.`,
            T`**Untuk mencari sisi yang hilang, pilih perbandingan yang memuat sisi yang diketahui dan sisi yang dicari, tulis, lalu selesaikan untuk bilangan yang tidak diketahui; untuk mencari sudut yang hilang, pakai fungsi invers dari perbandingan itu.** Setiap segitiga siku-siku dapat dipecahkan dari satu sudut dan satu sisi, atau dari dua sisi.

1. Gambar segitiganya dan tandai sudut $\theta$ yang dipakai.
2. Namai sisi-sisinya relatif terhadap $\theta$: depan, samping, miring.
3. Pilih perbandingan yang memuat sisi yang diketahui dan sisi yang tidak diketahui: depan dan miring berarti sinus, samping dan miring berarti kosinus, depan dan samping berarti tangen.
4. Tulis persamaannya, misalnya $\sin\theta=\frac{\text{depan}}{\text{miring}}$, dan selesaikan: kalikan untuk mencari sisi, atau ambil fungsi invers ($\arcsin$, $\arccos$, $\arctan$) untuk mencari sudut.
5. Periksa bahwa sisi miring adalah sisi terpanjang, dan bahwa $\text{depan}^2+\text{samping}^2=\text{miring}^2$.

**Contoh, sebuah sisi.** Anda berdiri $40$ m dari kaki sebuah menara dan melihat puncaknya dengan *sudut elevasi* $35^\circ$ (sudut di atas garis mendatar). Sisi yang diketahui adalah sisi samping $40$ dan yang tidak diketahui sisi depan, jadi tangen adalah perbandingan yang tepat: $\tan35^\circ=\frac{h}{40}$, sehingga $h=40\tan35^\circ\approx28{,}01$ m. (Tambahkan tinggi mata Anda untuk mendapat tinggi menara.) Memandang *ke bawah* dari menara ke sebuah perahu memakai *sudut depresi*, diukur di bawah garis mendatar; ia sama dengan sudut elevasi yang dilihat dari perahu.`,
          ),
        },
        FIG_TOWER,
        {
          kind: 'text',
          text: L(
            T`**Example, an angle.** A road rises $8$ m over a horizontal distance of $100$ m. Then $\tan\theta=\frac{8}{100}$, so $\theta=\arctan0.08\approx4.57^\circ$. A grade of $8\%$ is exactly this tangent.

**Example, a ladder.** A $5$ m ladder leans against a wall at $70^\circ$ to the ground. The hypotenuse is $5$, so it reaches $5\sin70^\circ\approx4.70$ m up the wall, and its foot is $5\cos70^\circ\approx1.71$ m from the wall.

The inverse functions are the subject of [their own article](article:inverse-trigonometric-functions#definitions): $\arcsin x$ is the angle between $-90^\circ$ and $90^\circ$ whose sine is $x$. For a triangle that is not a right triangle, use the law of sines and the law of cosines ([solving a triangle](article:triangles#solve-a-triangle)). The solver below takes any pair of measurements and also has these examples ready.`,
            T`**Contoh, sebuah sudut.** Sebuah jalan naik $8$ m pada jarak mendatar $100$ m. Maka $\tan\theta=\frac{8}{100}$, sehingga $\theta=\arctan0{,}08\approx4{,}57^\circ$. Kemiringan $8\%$ tepat adalah tangen ini.

**Contoh, sebuah tangga.** Tangga $5$ m bersandar pada dinding dengan sudut $70^\circ$ terhadap tanah. Sisi miringnya $5$, jadi ia mencapai $5\sin70^\circ\approx4{,}70$ m ke atas dinding, dan kakinya $5\cos70^\circ\approx1{,}71$ m dari dinding.

Fungsi invers adalah topik [artikelnya sendiri](article:inverse-trigonometric-functions#definitions): $\arcsin x$ adalah sudut di antara $-90^\circ$ dan $90^\circ$ yang sinusnya $x$. Untuk segitiga yang bukan siku-siku, pakai aturan sinus dan aturan kosinus ([memecahkan segitiga](article:triangles#solve-a-triangle)). Pemecah di bawah menerima pasangan ukuran apa pun dan juga menyediakan contoh-contoh ini.`,
          ),
        },
        { kind: 'widget', name: 'trigright' },
      ],
    },

    /* ----------------------------------------------------------------------------- special angles */
    {
      id: 'special-angles',
      heading: L('What are the exact values of sine and cosine at 30°, 45° and 60°?', 'Berapa nilai eksak sinus dan kosinus pada 30°, 45°, dan 60°?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The exact values at $30^\circ$, $45^\circ$ and $60^\circ$ come from two triangles you can draw: half of an equilateral triangle, and half of a square.**

*Half of an equilateral triangle.* Take an equilateral triangle with side $2$ and cut it in half along a height. You get a right triangle with angles $30^\circ$, $60^\circ$ and $90^\circ$, hypotenuse $2$, the short leg $1$ (half of the base) and the long leg $\sqrt{2^2-1^2}=\sqrt3$. Read the ratios: $\sin30^\circ=\frac12$, $\cos30^\circ=\frac{\sqrt3}{2}$, $\tan30^\circ=\frac{1}{\sqrt3}=\frac{\sqrt3}{3}$, and from the other angle $\sin60^\circ=\frac{\sqrt3}{2}$, $\cos60^\circ=\frac12$, $\tan60^\circ=\sqrt3$.`,
            T`**Nilai eksak pada $30^\circ$, $45^\circ$, dan $60^\circ$ berasal dari dua segitiga yang dapat digambar: setengah segitiga sama sisi, dan setengah persegi.**

*Setengah segitiga sama sisi.* Ambil segitiga sama sisi dengan sisi $2$ dan belah menjadi dua sepanjang tingginya. Diperoleh segitiga siku-siku dengan sudut $30^\circ$, $60^\circ$, dan $90^\circ$, sisi miring $2$, sisi tegak pendek $1$ (setengah alas), dan sisi tegak panjang $\sqrt{2^2-1^2}=\sqrt3$. Baca perbandingannya: $\sin30^\circ=\frac12$, $\cos30^\circ=\frac{\sqrt3}{2}$, $\tan30^\circ=\frac{1}{\sqrt3}=\frac{\sqrt3}{3}$, dan dari sudut yang lain $\sin60^\circ=\frac{\sqrt3}{2}$, $\cos60^\circ=\frac12$, $\tan60^\circ=\sqrt3$.`,
          ),
        },
        FIG_HALF_EQUILATERAL,
        {
          kind: 'text',
          text: L(
            T`*Half of a square.* Cut a square of side $1$ along a diagonal. You get a right triangle with two angles of $45^\circ$, legs $1$ and hypotenuse $\sqrt2$. So $\sin45^\circ=\cos45^\circ=\frac{1}{\sqrt2}=\frac{\sqrt2}{2}$ and $\tan45^\circ=1$.`,
            T`*Setengah persegi.* Belah persegi bersisi $1$ sepanjang diagonalnya. Diperoleh segitiga siku-siku dengan dua sudut $45^\circ$, sisi tegak $1$, dan sisi miring $\sqrt2$. Jadi $\sin45^\circ=\cos45^\circ=\frac{1}{\sqrt2}=\frac{\sqrt2}{2}$ dan $\tan45^\circ=1$.`,
          ),
        },
        FIG_HALF_SQUARE,
        {
          kind: 'text',
          text: L(
            T`| $\theta$ | $0^\circ$ | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ |
|---|---|---|---|---|---|
| $\sin\theta$ | $0$ | $\frac12$ | $\frac{\sqrt2}{2}$ | $\frac{\sqrt3}{2}$ | $1$ |
| $\cos\theta$ | $1$ | $\frac{\sqrt3}{2}$ | $\frac{\sqrt2}{2}$ | $\frac12$ | $0$ |
| $\tan\theta$ | $0$ | $\frac{\sqrt3}{3}$ | $1$ | $\sqrt3$ | undefined |

**A pattern to remember.** Write the sines of $0^\circ,30^\circ,45^\circ,60^\circ,90^\circ$ as $\frac{\sqrt0}{2},\frac{\sqrt1}{2},\frac{\sqrt2}{2},\frac{\sqrt3}{2},\frac{\sqrt4}{2}$; the cosines are the same list backwards, and the tangent is the sine divided by the cosine. The angle $0^\circ$ is a degenerate triangle with no height ($\sin0^\circ=0$) and at $90^\circ$ the adjacent side shrinks to nothing, so $\tan90^\circ=\frac{1}{0}$ has no value.

The multiples of $15^\circ$ need a little more: $\sin15^\circ=\frac{\sqrt6-\sqrt2}{4}$, $\cos15^\circ=\frac{\sqrt6+\sqrt2}{4}$ and $\tan15^\circ=2-\sqrt3$, which follow from the angle formulas below ($15^\circ=45^\circ-30^\circ$). The unit circle further down gives the exact value of all of them. These triangles are also the ones from [right triangles](article:triangles#right-triangles), where their sides appear as the ratios $1:1:\sqrt2$ and $1:\sqrt3:2$.`,
            T`| $\theta$ | $0^\circ$ | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ |
|---|---|---|---|---|---|
| $\sin\theta$ | $0$ | $\frac12$ | $\frac{\sqrt2}{2}$ | $\frac{\sqrt3}{2}$ | $1$ |
| $\cos\theta$ | $1$ | $\frac{\sqrt3}{2}$ | $\frac{\sqrt2}{2}$ | $\frac12$ | $0$ |
| $\tan\theta$ | $0$ | $\frac{\sqrt3}{3}$ | $1$ | $\sqrt3$ | tak terdefinisi |

**Pola yang mudah diingat.** Tulis sinus $0^\circ,30^\circ,45^\circ,60^\circ,90^\circ$ sebagai $\frac{\sqrt0}{2},\frac{\sqrt1}{2},\frac{\sqrt2}{2},\frac{\sqrt3}{2},\frac{\sqrt4}{2}$; kosinusnya adalah daftar yang sama dari belakang, dan tangen adalah sinus dibagi kosinus. Sudut $0^\circ$ adalah segitiga yang merosot tanpa tinggi ($\sin0^\circ=0$) dan pada $90^\circ$ sisi samping menyusut menjadi nol, sehingga $\tan90^\circ=\frac{1}{0}$ tidak bernilai.

Kelipatan $15^\circ$ memerlukan sedikit lebih banyak: $\sin15^\circ=\frac{\sqrt6-\sqrt2}{4}$, $\cos15^\circ=\frac{\sqrt6+\sqrt2}{4}$, dan $\tan15^\circ=2-\sqrt3$, yang mengikuti dari rumus sudut di bawah ($15^\circ=45^\circ-30^\circ$). Lingkaran satuan di bawah memberi nilai eksak semuanya. Segitiga-segitiga ini juga yang ada pada [segitiga siku-siku](article:triangles#right-triangles), tempat sisi-sisinya muncul sebagai perbandingan $1:1:\sqrt2$ dan $1:\sqrt3:2$.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------------------------- unit circle */
    {
      id: 'unit-circle',
      heading: L('How does the unit circle give sine and cosine for every angle?', 'Bagaimana lingkaran satuan memberi sinus dan kosinus untuk setiap sudut?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**On the unit circle, the circle of radius $1$ around the origin, the point reached by turning through an angle $\theta$ from the positive $x$-axis is $(\cos\theta,\sin\theta)$.** This is the definition that works for every angle. For an acute angle it agrees with the triangle: drop a perpendicular from the point to the $x$-axis, and the right triangle has hypotenuse $1$, so the adjacent side is $\cos\theta$ and the opposite side is $\sin\theta$. Positive angles turn counterclockwise, negative angles clockwise (see [how angles are measured](article:angles#units)), and $\tan\theta=\frac{\sin\theta}{\cos\theta}$ wherever the cosine is not $0$.`,
            T`**Pada lingkaran satuan, lingkaran berjari-jari $1$ berpusat di titik asal, titik yang dicapai dengan berputar sebesar sudut $\theta$ dari sumbu-$x$ positif adalah $(\cos\theta,\sin\theta)$.** Inilah definisi yang berlaku untuk setiap sudut. Untuk sudut lancip ia sesuai dengan segitiga: jatuhkan garis tegak lurus dari titik itu ke sumbu-$x$, dan segitiga siku-sikunya memiliki sisi miring $1$, sehingga sisi samping adalah $\cos\theta$ dan sisi depan adalah $\sin\theta$. Sudut positif berputar berlawanan arah jarum jam, sudut negatif searah jarum jam (lihat [cara sudut diukur](article:angles#units)), dan $\tan\theta=\frac{\sin\theta}{\cos\theta}$ di mana pun kosinus bukan $0$.`,
          ),
        },
        FIG_UNIT_CIRCLE,
        {
          kind: 'text',
          text: L(
            T`Three things follow.

**Signs by quadrant.** The sign of $\cos\theta$ is the sign of the $x$-coordinate and the sign of $\sin\theta$ that of the $y$-coordinate:

| Quadrant | Angles | $\sin$ | $\cos$ | $\tan$ |
|---|---|---|---|---|
| I | $0^\circ$ to $90^\circ$ | $+$ | $+$ | $+$ |
| II | $90^\circ$ to $180^\circ$ | $+$ | $-$ | $-$ |
| III | $180^\circ$ to $270^\circ$ | $-$ | $-$ | $+$ |
| IV | $270^\circ$ to $360^\circ$ | $-$ | $+$ | $-$ |

In words: all three are positive in I, only sine in II, only tangent in III and only cosine in IV (English speakers remember it as "All Students Take Calculus").

**Reference angles.** The *reference angle* of $\theta$ is the acute angle between its terminal side and the $x$-axis. By symmetry, each function at $\theta$ has the absolute value it has at the reference angle, and the sign is given by the quadrant.

1. Find the reference angle: $\theta$ in quadrant II gives $180^\circ-\theta$, in III gives $\theta-180^\circ$, in IV gives $360^\circ-\theta$.
2. Read the value at the reference angle (the table in the previous section).
3. Put the sign of the quadrant in front.

For example $\sin210^\circ$: it is in quadrant III, the reference angle is $30^\circ$, and sine is negative there, so $\sin210^\circ=-\frac12$. And $\cos120^\circ=-\cos60^\circ=-\frac12$, $\tan135^\circ=-\tan45^\circ=-1$.`,
            T`Tiga hal mengikuti.

**Tanda menurut kuadran.** Tanda $\cos\theta$ adalah tanda koordinat-$x$ dan tanda $\sin\theta$ adalah tanda koordinat-$y$:

| Kuadran | Sudut | $\sin$ | $\cos$ | $\tan$ |
|---|---|---|---|---|
| I | $0^\circ$ sampai $90^\circ$ | $+$ | $+$ | $+$ |
| II | $90^\circ$ sampai $180^\circ$ | $+$ | $-$ | $-$ |
| III | $180^\circ$ sampai $270^\circ$ | $-$ | $-$ | $+$ |
| IV | $270^\circ$ sampai $360^\circ$ | $-$ | $+$ | $-$ |

Dengan kata-kata: ketiganya positif di I, hanya sinus di II, hanya tangen di III, dan hanya kosinus di IV (urutan kuadran I sampai IV: semua, sin, tan, cos).

**Sudut acuan.** *Sudut acuan* $\theta$ adalah sudut lancip antara kaki terminalnya dan sumbu-$x$. Karena kesimetrian, setiap fungsi di $\theta$ memiliki nilai mutlak yang sama dengan nilainya pada sudut acuan, dan tandanya ditentukan kuadran.

1. Cari sudut acuan: $\theta$ di kuadran II memberi $180^\circ-\theta$, di III memberi $\theta-180^\circ$, di IV memberi $360^\circ-\theta$.
2. Baca nilai pada sudut acuan (tabel di bagian sebelumnya).
3. Pasang tanda kuadran di depannya.

Misalnya $\sin210^\circ$: ia di kuadran III, sudut acuannya $30^\circ$, dan sinus negatif di sana, jadi $\sin210^\circ=-\frac12$. Dan $\cos120^\circ=-\cos60^\circ=-\frac12$, $\tan135^\circ=-\tan45^\circ=-1$.`,
          ),
        },
        FIG_QUADRANTS,
        {
          kind: 'text',
          text: L(
            T`**Periodicity and negative angles.** A full turn changes nothing, so $\sin(\theta+360^\circ)=\sin\theta$ and the same for cosine; the tangent repeats after a half turn, $\tan(\theta+180^\circ)=\tan\theta$. Turning the other way mirrors the point in the $x$-axis: $\sin(-\theta)=-\sin\theta$ and $\cos(-\theta)=\cos\theta$. So $\sin(-30^\circ)=-\frac12$ and $\cos(-30^\circ)=\frac{\sqrt3}{2}$. (Mathematicians measure the same turn in radians, where $360^\circ=2\pi$.)

Move the angle below, from $-360^\circ$ to $720^\circ$, and watch the point, the signs and the exact values.`,
            T`**Periodisitas dan sudut negatif.** Satu putaran penuh tidak mengubah apa pun, sehingga $\sin(\theta+360^\circ)=\sin\theta$ dan hal yang sama untuk kosinus; tangen berulang setelah setengah putaran, $\tan(\theta+180^\circ)=\tan\theta$. Berputar ke arah sebaliknya mencerminkan titik pada sumbu-$x$: $\sin(-\theta)=-\sin\theta$ dan $\cos(-\theta)=\cos\theta$. Jadi $\sin(-30^\circ)=-\frac12$ dan $\cos(-30^\circ)=\frac{\sqrt3}{2}$. (Ahli matematika mengukur putaran yang sama dalam radian, dengan $360^\circ=2\pi$.)

Geser sudut di bawah, dari $-360^\circ$ sampai $720^\circ$, dan lihat titik, tanda, dan nilai eksaknya.`,
          ),
        },
        { kind: 'widget', name: 'trigcircle' },
      ],
    },

    /* --------------------------------------------------------------------------------- equations */
    {
      id: 'equations',
      heading: L('How do you solve sin x = c, cos x = c and tan x = c?', 'Bagaimana menyelesaikan sin x = c, cos x = c, dan tan x = c?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To solve $\sin x=c$, $\cos x=c$ or $\tan x=c$, find one angle with the inverse function, find its mirror image on the unit circle, and add whole turns to both.** The reason there is a second angle is that two points of the unit circle have the same height (the same sine), two have the same $x$-coordinate (the same cosine), and two opposite points give the same tangent.

1. If $c$ is outside $-1\le c\le1$ for sine or cosine, there is no solution.
2. Find the principal angle $\alpha$ with the inverse function ($\arcsin c$, $\arccos c$ or $\arctan c$).
3. Find the second angle between $0^\circ$ and $360^\circ$ from the symmetry:
   - sine: $x=\alpha$ and $x=180^\circ-\alpha$;
   - cosine: $x=\alpha$ and $x=360^\circ-\alpha$ (that is, $\pm\alpha$);
   - tangent: $x=\alpha$ and $x=\alpha+180^\circ$.
4. Add whole turns for all the solutions: $360^\circ k$ for sine and cosine, $180^\circ k$ for tangent, where $k$ is any whole number.
5. Check the answers by substituting.

**Example.** $\sin x=\frac12$. The principal angle is $\alpha=30^\circ$, so the solutions between $0^\circ$ and $360^\circ$ are $30^\circ$ and $180^\circ-30^\circ=150^\circ$; in general $x=30^\circ+360^\circ k$ or $x=150^\circ+360^\circ k$. For $\cos x=-\frac{\sqrt2}{2}$ the principal angle is $135^\circ$, and the solutions are $135^\circ$ and $225^\circ$. For $\tan x=\sqrt3$ they are $60^\circ$ and $240^\circ$.

A calculator or program gives only the principal value ($\arcsin$ returns an angle between $-90^\circ$ and $90^\circ$), so the second solution is yours to find. The same method solves harder equations once they are brought to this form, for instance $2\sin^2x=\sin x$ becomes $\sin x\,(2\sin x-1)=0$, so $\sin x=0$ or $\sin x=\frac12$.`,
            T`**Untuk menyelesaikan $\sin x=c$, $\cos x=c$, atau $\tan x=c$, cari satu sudut dengan fungsi invers, cari bayangan cerminnya pada lingkaran satuan, dan tambahkan putaran penuh pada keduanya.** Alasan adanya sudut kedua adalah bahwa dua titik pada lingkaran satuan memiliki tinggi yang sama (sinus yang sama), dua titik memiliki koordinat-$x$ yang sama (kosinus yang sama), dan dua titik berlawanan memberi tangen yang sama.

1. Bila $c$ di luar $-1\le c\le1$ untuk sinus atau kosinus, tidak ada penyelesaian.
2. Cari sudut pokok $\alpha$ dengan fungsi invers ($\arcsin c$, $\arccos c$, atau $\arctan c$).
3. Cari sudut kedua di antara $0^\circ$ dan $360^\circ$ dari kesimetrian:
   - sinus: $x=\alpha$ dan $x=180^\circ-\alpha$;
   - kosinus: $x=\alpha$ dan $x=360^\circ-\alpha$ (yaitu $\pm\alpha$);
   - tangen: $x=\alpha$ dan $x=\alpha+180^\circ$.
4. Tambahkan putaran penuh untuk semua penyelesaian: $360^\circ k$ untuk sinus dan kosinus, $180^\circ k$ untuk tangen, dengan $k$ bilangan bulat apa saja.
5. Periksa jawabannya dengan substitusi.

**Contoh.** $\sin x=\frac12$. Sudut pokoknya $\alpha=30^\circ$, sehingga penyelesaian di antara $0^\circ$ dan $360^\circ$ adalah $30^\circ$ dan $180^\circ-30^\circ=150^\circ$; secara umum $x=30^\circ+360^\circ k$ atau $x=150^\circ+360^\circ k$. Untuk $\cos x=-\frac{\sqrt2}{2}$ sudut pokoknya $135^\circ$, dan penyelesaiannya $135^\circ$ dan $225^\circ$. Untuk $\tan x=\sqrt3$ penyelesaiannya $60^\circ$ dan $240^\circ$.

Kalkulator atau program hanya memberi nilai pokok ($\arcsin$ mengembalikan sudut di antara $-90^\circ$ dan $90^\circ$), sehingga penyelesaian kedua harus dicari sendiri. Cara yang sama menyelesaikan persamaan yang lebih sulit setelah dibawa ke bentuk ini, misalnya $2\sin^2x=\sin x$ menjadi $\sin x\,(2\sin x-1)=0$, sehingga $\sin x=0$ atau $\sin x=\frac12$.`,
          ),
        },
        FIG_EQUATION,
        { kind: 'widget', name: 'trigequation' },
      ],
    },

    /* ------------------------------------------------------------------------------- identities */
    {
      id: 'identities',
      heading: L('What are the basic trigonometric identities?', 'Apa saja identitas trigonometri dasar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A trigonometric identity is an equation that is true for every angle for which both sides are defined, which makes it different from an equation, which is true only for some angles.** $\sin x=\frac12$ is an equation (it holds at $30^\circ$ and $150^\circ$ and so on); $\sin^2x+\cos^2x=1$ is an identity (it holds always). These are the ones to know.

| Name | Identity |
|---|---|
| Pythagorean | $\sin^2x+\cos^2x=1$ and $1+\tan^2x=\frac{1}{\cos^2x}$ |
| Quotient and reciprocal | $\tan x=\frac{\sin x}{\cos x}$, $\csc x=\frac{1}{\sin x}$, $\sec x=\frac{1}{\cos x}$, $\cot x=\frac{1}{\tan x}$ |
| Cofunction | $\sin(90^\circ-x)=\cos x$ and $\cos(90^\circ-x)=\sin x$ |
| Supplement and negative angle | $\sin(180^\circ-x)=\sin x$, $\sin(-x)=-\sin x$, $\cos(-x)=\cos x$ |
| Double angle | $\sin2x=2\sin x\cos x$ and $\cos2x=\cos^2x-\sin^2x$ |
| Sum | $\sin(x+y)=\sin x\cos y+\cos x\sin y$ and $\cos(x+y)=\cos x\cos y-\sin x\sin y$ |

Where they come from. The Pythagorean identity is the equation of the unit circle, $x^2+y^2=1$, with $x=\cos\theta$ and $y=\sin\theta$; divide it by $\cos^2x$ for the second form. The cofunction identity says that the sine of an angle is the cosine of its complement (the two acute angles of a right triangle). The double-angle formulas are the sum formulas with $y=x$, and the sum formulas can be proved from the geometry of the unit circle. With them you get exact values beyond the table, for example $\sin75^\circ=\sin(45^\circ+30^\circ)$, which by the sum formula is $\frac{\sqrt2}{2}\cdot\frac{\sqrt3}{2}+\frac{\sqrt2}{2}\cdot\frac12$, that is $\frac{\sqrt6+\sqrt2}{4}$.

**An identity is not proved by trying a number.** The tempting formulas $\sin(x+y)=\sin x+\sin y$, $\sin2x=2\sin x$ and $\sin x+\cos x=1$ are false, yet each is true at a few angles: $\sin2x=2\sin x$ holds at $x=0^\circ$ and $x=180^\circ$, and a single lucky test would convince you. A false identity is refuted by one counterexample ($\sin(30^\circ+60^\circ)=1$ but $\sin30^\circ+\sin60^\circ\approx1.366$); a true one has to be proved, with algebra or geometry. The tester below compares both sides over all $360$ whole degrees.`,
            T`**Identitas trigonometri adalah persamaan yang benar untuk setiap sudut yang kedua ruasnya terdefinisi, yang membedakannya dari persamaan biasa, yang benar hanya untuk sebagian sudut.** $\sin x=\frac12$ adalah persamaan (berlaku pada $30^\circ$ dan $150^\circ$ dan seterusnya); $\sin^2x+\cos^2x=1$ adalah identitas (berlaku selalu). Berikut yang perlu diketahui.

| Nama | Identitas |
|---|---|
| Pythagoras | $\sin^2x+\cos^2x=1$ dan $1+\tan^2x=\frac{1}{\cos^2x}$ |
| Hasil bagi dan kebalikan | $\tan x=\frac{\sin x}{\cos x}$, $\csc x=\frac{1}{\sin x}$, $\sec x=\frac{1}{\cos x}$, $\cot x=\frac{1}{\tan x}$ |
| Fungsi komplemen | $\sin(90^\circ-x)=\cos x$ dan $\cos(90^\circ-x)=\sin x$ |
| Pelurus dan sudut negatif | $\sin(180^\circ-x)=\sin x$, $\sin(-x)=-\sin x$, $\cos(-x)=\cos x$ |
| Sudut ganda | $\sin2x=2\sin x\cos x$ dan $\cos2x=\cos^2x-\sin^2x$ |
| Jumlah | $\sin(x+y)=\sin x\cos y+\cos x\sin y$ dan $\cos(x+y)=\cos x\cos y-\sin x\sin y$ |

Asalnya. Identitas Pythagoras adalah persamaan lingkaran satuan, $x^2+y^2=1$, dengan $x=\cos\theta$ dan $y=\sin\theta$; bagi dengan $\cos^2x$ untuk bentuk kedua. Identitas fungsi komplemen mengatakan bahwa sinus sebuah sudut adalah kosinus penyikunya (kedua sudut lancip segitiga siku-siku). Rumus sudut ganda adalah rumus jumlah dengan $y=x$, dan rumus jumlah dapat dibuktikan dari geometri lingkaran satuan. Dengannya diperoleh nilai eksak di luar tabel, misalnya $\sin75^\circ=\sin(45^\circ+30^\circ)$, yang menurut rumus jumlah adalah $\frac{\sqrt2}{2}\cdot\frac{\sqrt3}{2}+\frac{\sqrt2}{2}\cdot\frac12$, yaitu $\frac{\sqrt6+\sqrt2}{4}$.

**Identitas tidak dibuktikan dengan mencoba satu bilangan.** Rumus yang menggoda $\sin(x+y)=\sin x+\sin y$, $\sin2x=2\sin x$, dan $\sin x+\cos x=1$ salah, namun masing-masing benar pada beberapa sudut: $\sin2x=2\sin x$ berlaku pada $x=0^\circ$ dan $x=180^\circ$, dan satu uji yang kebetulan cocok dapat meyakinkan kita. Identitas yang salah dibantah oleh satu contoh penyangkal ($\sin(30^\circ+60^\circ)=1$ tetapi $\sin30^\circ+\sin60^\circ\approx1{,}366$); yang benar harus dibuktikan, dengan aljabar atau geometri. Penguji di bawah membandingkan kedua ruas pada semua $360$ derajat bulat.`,
          ),
        },
        { kind: 'widget', name: 'trigidentity' },
      ],
    },

    /* ------------------------------------------------------------------------------------ graphs */
    {
      id: 'graphs',
      heading: L('What do the graphs of sine and cosine look like?', 'Seperti apa grafik sinus dan kosinus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The graphs of $y=\sin x$ and $y=\cos x$ are waves that repeat every $360^\circ$ and oscillate between $-1$ and $1$; the cosine is the sine shifted left by $90^\circ$.** Plot the height of the point on the unit circle against the angle and you get the sine wave: it starts at $0$, rises to $1$ at $90^\circ$, falls through $0$ at $180^\circ$ to $-1$ at $270^\circ$ and is back at $0$ at $360^\circ$. The tangent has a different shape: it repeats every $180^\circ$ and blows up near $90^\circ$ and $270^\circ$, where the cosine is $0$.`,
            T`**Grafik $y=\sin x$ dan $y=\cos x$ adalah gelombang yang berulang setiap $360^\circ$ dan berosilasi di antara $-1$ dan $1$; kosinus adalah sinus yang digeser $90^\circ$ ke kiri.** Gambarkan tinggi titik pada lingkaran satuan terhadap sudutnya dan diperoleh gelombang sinus: ia mulai dari $0$, naik ke $1$ pada $90^\circ$, turun melewati $0$ pada $180^\circ$ ke $-1$ pada $270^\circ$, dan kembali di $0$ pada $360^\circ$. Tangen memiliki bentuk lain: ia berulang setiap $180^\circ$ dan meledak di dekat $90^\circ$ dan $270^\circ$, tempat kosinus bernilai $0$.`,
          ),
        },
        FIG_WAVES,
        {
          kind: 'text',
          text: L(
            T`Every wave of the form $y=a\sin(b(x-c))+d$ (or with the cosine) is described by four numbers:

- the **amplitude** $|a|$, the distance from the middle line to a peak; a negative $a$ flips the wave upside down;
- the **period** $\frac{360^\circ}{b}$, the length of one full cycle (in radians, $\frac{2\pi}{b}$); a larger $b$ squeezes the wave;
- the **phase shift** $c$, how far the wave is moved to the right;
- the **midline** $y=d$, the height around which it oscillates; the maximum is $d+|a|$ and the minimum $d-|a|$.

**Example.** $y=2\sin(3x)+1$: amplitude $2$, period $\frac{360^\circ}{3}=120^\circ$, no shift, midline $y=1$, maximum $3$, minimum $-1$. The zeros are where $\sin3x=-\frac12$.`,
            T`Setiap gelombang berbentuk $y=a\sin(b(x-c))+d$ (atau dengan kosinus) diuraikan oleh empat bilangan:

- **amplitudo** $|a|$, jarak dari garis tengah ke puncak; $a$ negatif membalik gelombang;
- **periode** $\frac{360^\circ}{b}$, panjang satu siklus penuh (dalam radian, $\frac{2\pi}{b}$); $b$ yang lebih besar merapatkan gelombang;
- **pergeseran fase** $c$, seberapa jauh gelombang digeser ke kanan;
- **garis tengah** $y=d$, tinggi tempat gelombang berosilasi; maksimumnya $d+|a|$ dan minimumnya $d-|a|$.

**Contoh.** $y=2\sin(3x)+1$: amplitudo $2$, periode $\frac{360^\circ}{3}=120^\circ$, tanpa pergeseran, garis tengah $y=1$, maksimum $3$, minimum $-1$. Nolnya ada di tempat $\sin3x=-\frac12$.`,
          ),
        },
        FIG_WAVE_PARTS,
        {
          kind: 'text',
          text: L(
            T`Waves of this shape describe anything that goes round and round or back and forth: the height of a tide, a swinging pendulum, a sound of one pure pitch, alternating current, the seasons of daylight. Their slopes are another wave, which is the subject of [the derivatives of sine and cosine](article:derivatives-of-trigonometric-functions#sine-and-cosine). Change the four numbers below and watch the table.`,
            T`Gelombang berbentuk ini menggambarkan apa pun yang berputar atau bolak-balik: tinggi pasang surut, bandul yang berayun, bunyi satu nada murni, arus bolak-balik, pergantian panjang siang. Gradiennya adalah gelombang lain, yang menjadi topik [turunan sinus dan kosinus](article:derivatives-of-trigonometric-functions#sine-and-cosine). Ubah keempat bilangan di bawah dan lihat tabelnya.`,
          ),
        },
        { kind: 'widget', name: 'trigwave' },
      ],
    },

    /* ----------------------------------------------------------------------------- applications */
    {
      id: 'applications',
      heading: L('Where is trigonometry used?', 'Di mana trigonometri dipakai?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Trigonometry is used wherever you cannot measure a length or a direction directly but can measure an angle, or wherever something turns or oscillates.**

- **Heights and distances.** The height of a tower, a tree or a mountain, the width of a river, the distance to a ship: one angle and one measured length give the rest (surveying works exactly like this, with a theodolite to measure the angles).
- **Slopes.** The gradient of a road or a roof is the tangent of its angle; a ramp for a wheelchair should not exceed about $5^\circ$.
- **Navigation.** A bearing is an angle from north (see [directions and bearings](article:angles#directions)); the components of a course east and north are $d\sin\theta$ and $d\cos\theta$ for a bearing $\theta$.
- **Physics and engineering.** A force or velocity at angle $\theta$ has components $F\cos\theta$ and $F\sin\theta$; a block on a slope feels $mg\sin\theta$ along it.
- **Waves and signals.** Sound, light, radio, alternating current and tides are sums of sine waves.
- **Computers.** A point rotated by $\theta$ about the origin goes to $(x\cos\theta-y\sin\theta,\ x\sin\theta+y\cos\theta)$, the basis of graphics, games and robot arms; the position of a point on a circle is $(r\cos\theta,\ r\sin\theta)$.

All of it rests on the same picture: a right triangle, or the point on the unit circle.`,
            T`**Trigonometri dipakai di mana pun kita tidak dapat mengukur panjang atau arah secara langsung tetapi dapat mengukur sudut, atau di mana sesuatu berputar atau berosilasi.**

- **Tinggi dan jarak.** Tinggi menara, pohon, atau gunung, lebar sungai, jarak ke sebuah kapal: satu sudut dan satu panjang yang terukur memberi sisanya (survei bekerja persis seperti ini, dengan teodolit untuk mengukur sudutnya).
- **Kemiringan.** Gradien jalan atau atap adalah tangen sudutnya; landasan miring untuk kursi roda sebaiknya tidak melebihi sekitar $5^\circ$.
- **Navigasi.** Bearing adalah sudut dari utara (lihat [arah dan bearing](article:angles#directions)); komponen arah timur dan utara dari sebuah haluan adalah $d\sin\theta$ dan $d\cos\theta$ untuk bearing $\theta$.
- **Fisika dan teknik.** Gaya atau kecepatan pada sudut $\theta$ memiliki komponen $F\cos\theta$ dan $F\sin\theta$; sebuah balok pada bidang miring merasakan $mg\sin\theta$ sepanjang bidang itu.
- **Gelombang dan sinyal.** Bunyi, cahaya, radio, arus bolak-balik, dan pasang surut adalah jumlah gelombang sinus.
- **Komputer.** Sebuah titik yang diputar sebesar $\theta$ terhadap titik asal berpindah ke $(x\cos\theta-y\sin\theta,\ x\sin\theta+y\cos\theta)$, dasar grafika, permainan, dan lengan robot; posisi titik pada lingkaran adalah $(r\cos\theta,\ r\sin\theta)$.

Semuanya bertumpu pada gambar yang sama: sebuah segitiga siku-siku, atau titik pada lingkaran satuan.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------------- code */
    {
      id: 'trigonometry-in-code',
      heading: L('How do you use trigonometry in code?', 'Bagaimana memakai trigonometri dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Every programming language takes angles in radians, so convert first: ´math.sin(math.radians(30))´ in Python, ´Math.sin(30 * Math.PI / 180)´ in JavaScript, ´sin(30 * PI / 180)´ in C++.** Forgetting this is the most common error: ´math.sin(30)´ is the sine of $30$ radians, about $-0.988$.

The second trap is rounding. Because $\pi$ is stored with a small error, the values you expect to be exact are not: ´math.sin(math.radians(30))´ gives ´0.49999999999999994´, ´math.cos(math.radians(90))´ gives ´6.1e-17´ instead of $0$, and ´math.tan(math.radians(90))´ gives about $1.6\times10^{16}$ instead of "undefined". Compare with a tolerance, never with ´==´, or fold the angle to a reference angle between $0^\circ$ and $90^\circ$ first, as the function ´sin_deg´ below does.

To go the other way, use the inverse functions, and prefer ´atan2(opposite, adjacent)´ to ´atan(opposite / adjacent)´: it gets the quadrant right and does not divide by zero (see [the angle between two vectors](article:angles#between-lines-and-vectors)). The program solves the tower and the road of the examples, the $3$-$4$-$5$ triangle and the equation $\sin x=\frac12$.`,
            T`**Setiap bahasa pemrograman menerima sudut dalam radian, jadi ubah dulu: ´math.sin(math.radians(30))´ di Python, ´Math.sin(30 * Math.PI / 180)´ di JavaScript, ´sin(30 * PI / 180)´ di C++.** Melupakan ini adalah kesalahan paling umum: ´math.sin(30)´ adalah sinus $30$ radian, sekitar $-0{,}988$.

Jebakan kedua adalah pembulatan. Karena $\pi$ disimpan dengan galat kecil, nilai yang kita harapkan tepat ternyata tidak: ´math.sin(math.radians(30))´ memberi ´0.49999999999999994´, ´math.cos(math.radians(90))´ memberi ´6.1e-17´ alih-alih $0$, dan ´math.tan(math.radians(90))´ memberi sekitar $1{,}6\times10^{16}$ alih-alih "tak terdefinisi". Bandingkan dengan toleransi, jangan pernah dengan ´==´, atau lipat sudut ke sudut acuan di antara $0^\circ$ dan $90^\circ$ dulu, seperti fungsi ´sin_deg´ di bawah.

Untuk arah sebaliknya, pakai fungsi invers, dan pilih ´atan2(depan, samping)´ daripada ´atan(depan / samping)´: ia mendapatkan kuadran yang benar dan tidak membagi dengan nol (lihat [sudut antara dua vektor](article:angles#between-lines-and-vectors)). Program memecahkan menara dan jalan dari contoh, segitiga $3$-$4$-$5$, dan persamaan $\sin x=\frac12$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: degrees and radians, rounding, and the examples of this article', 'Python: derajat dan radian, pembulatan, dan contoh-contoh artikel ini'),
          code: `import math


def sin_deg(d):
    """Sine of an angle in degrees: fold to a reference angle first, so 30 and 90 come out exact."""
    n = d % 360
    ref, sign = (n, 1) if n <= 90 else (180 - n, 1) if n <= 180 else (n - 180, -1) if n <= 270 else (360 - n, -1)
    v = {0: 0.0, 30: 0.5, 90: 1.0}.get(ref, math.sin(math.radians(ref)))
    return sign * v if v else 0.0


def cos_deg(d):
    return sin_deg(90 - d)


print(math.sin(math.radians(30)), sin_deg(30))       # 0.49999999999999994 0.5
print(math.cos(math.radians(90)), cos_deg(90))       # 6.123233995736766e-17 0.0
print(math.tan(math.radians(90)))                    # 1.633123935319537e+16, not "undefined"
print(round(40 * math.tan(math.radians(35)), 2))     # 28.01: the tower seen at 35 degrees from 40 m
print(round(math.degrees(math.atan2(8, 100)), 2))    # 4.57: the road that rises 8 m in 100 m
print(round(math.degrees(math.atan2(3, 4)), 4), math.hypot(3, 4))     # 36.8699 5.0
x = math.degrees(math.asin(0.5))                     # the principal value of sin x = 1/2
print(round(x, 6), round(180 - x, 6))                # 30.0 150.0: the mirror image is yours to add
print(round(math.sin(math.radians(75)), 6), round((math.sqrt(6) + math.sqrt(2)) / 4, 6))   # 0.965926 0.965926
print(sin_deg(210), sin_deg(-30), cos_deg(120))      # -0.5 -0.5 -0.5`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same functions', 'JavaScript: fungsi yang sama'),
          code: `const rad = (d) => (d * Math.PI) / 180
const deg = (r) => (r * 180) / Math.PI

function sinDeg(d) {
  const n = ((d % 360) + 360) % 360                     // JavaScript's % keeps the sign of d, so fix it
  const [ref, sign] = n <= 90 ? [n, 1] : n <= 180 ? [180 - n, 1] : n <= 270 ? [n - 180, -1] : [360 - n, -1]
  const v = ref === 0 ? 0 : ref === 30 ? 0.5 : ref === 90 ? 1 : Math.sin(rad(ref))
  return v === 0 ? 0 : sign * v
}
const cosDeg = (d) => sinDeg(90 - d)

;[Math.sin(rad(30)), sinDeg(30)]                        // [0.49999999999999994, 0.5]
;[Math.cos(rad(90)), cosDeg(90)]                        // [6.123233995736766e-17, 0]
Math.tan(rad(90))                                       // 16331239353195370, not "undefined"
+(40 * Math.tan(rad(35))).toFixed(2)                    // 28.01
+deg(Math.atan2(8, 100)).toFixed(2)                     // 4.57
;[deg(Math.asin(0.5)), 180 - deg(Math.asin(0.5))].map((x) => +x.toFixed(6))   // [30, 150]
;[sinDeg(210), sinDeg(-30), cosDeg(120)]                // [-0.5, -0.5, -0.5]`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same functions with <cmath>', 'C++: fungsi yang sama dengan <cmath>'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

const double PI = 3.14159265358979323846;

double radians(double d) { return d * PI / 180.0; }

double sinDeg(double d) {
  double n = d - 360.0 * floor(d / 360.0);        // into [0, 360)
  double ref = n;
  double sign = 1;
  if (n > 270) { ref = 360 - n; sign = -1; }
  else if (n > 180) { ref = n - 180; sign = -1; }
  else if (n > 90) { ref = 180 - n; }
  double v;
  if (ref == 0) v = 0;
  else if (ref == 30) v = 0.5;
  else if (ref == 90) v = 1;
  else v = sin(radians(ref));
  return v == 0 ? 0 : sign * v;
}

double cosDeg(double d) { return sinDeg(90 - d); }

int same(double a, double b) { return a == b ? 1 : 0; }

int main() {
  printf("%d %d\\n", same(sin(radians(30)), 0.5), same(sinDeg(30), 0.5));
  printf("%d %d\\n", same(cos(radians(90)), 0), same(cosDeg(90), 0));
  printf("%.2f\\n", 40 * tan(radians(35)));
  printf("%.2f\\n", atan2(8, 100) * 180 / PI);
  printf("%.4f %.4f\\n", sinDeg(210), cosDeg(120));
  printf("%.6f %.6f\\n", asin(0.5) * 180 / PI, 180 - asin(0.5) * 180 / PI);
  return 0;
}

/* output:
0 1
0 1
28.01
4.57
-0.5000 -0.5000
30.000000 150.000000
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does trigonometry come from?', 'Dari mana trigonometri berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Trigonometry began as the astronomy of chords, grew sines and cosines in India and the Islamic world, and became the functions we write today in the eighteenth century.**

- **About 150 BC.** Hipparchus builds the first table of *chords* (the length of the segment joining two points of a circle for a given angle), to predict the positions of the Sun and Moon. Around 150 AD, Ptolemy's *Almagest* has a chord table for every half degree.
- **About 500 AD.** Indian astronomers such as Aryabhata work with the *half-chord* instead, the *jya*, which is our sine, and tabulate it; the cosine appears as the sine of the complement.
- **About 800 to 1000.** In the Islamic world, scholars including al-Khwarizmi and Abu al-Wafa extend the tables and use all six functions, and al-Battani replaces the Greek chords by sines in his astronomy.
- **12th century.** Latin translators render the Arabic *jayb* (a mis-reading of the Sanskrit *jya*) as *sinus*, which means "fold" or "bay": that is how the word *sine* got its name.
- **1464.** Regiomontanus writes *De triangulis omnimodis*, the first European book on trigonometry as a subject of its own, apart from astronomy.
- **1595.** Bartholomaeus Pitiscus publishes *Trigonometria* and gives the subject its name.
- **1748.** Euler's *Introductio in analysin infinitorum* fixes the modern notation (sin, cos, tan) and treats them as functions of a number, which opens the way to calculus and to waves.`,
            T`**Trigonometri bermula sebagai astronomi tali busur, tumbuh menjadi sinus dan kosinus di India dan dunia Islam, dan menjadi fungsi yang kita tulis sekarang pada abad kedelapan belas.**

- **Sekitar 150 SM.** Hipparchus menyusun tabel *tali busur* pertama (panjang ruas garis yang menghubungkan dua titik pada lingkaran untuk suatu sudut), untuk meramalkan posisi Matahari dan Bulan. Sekitar 150 M, *Almagest* Ptolemeus memuat tabel tali busur untuk setiap setengah derajat.
- **Sekitar 500 M.** Astronom India seperti Aryabhata bekerja dengan *setengah tali busur*, yaitu *jya*, yang adalah sinus kita, dan menabelkannya; kosinus muncul sebagai sinus sudut penyiku.
- **Sekitar 800 sampai 1000.** Di dunia Islam, cendekiawan termasuk al-Khwarizmi dan Abu al-Wafa memperluas tabel dan memakai keenam fungsi, dan al-Battani mengganti tali busur Yunani dengan sinus dalam astronominya.
- **Abad ke-12.** Penerjemah Latin menerjemahkan *jayb* dalam bahasa Arab (salah baca atas *jya* Sanskerta) sebagai *sinus*, yang berarti "lipatan" atau "teluk": begitulah kata *sine* mendapat namanya.
- **1464.** Regiomontanus menulis *De triangulis omnimodis*, buku Eropa pertama tentang trigonometri sebagai bidang tersendiri, terpisah dari astronomi.
- **1595.** Bartholomaeus Pitiscus menerbitkan *Trigonometria* dan memberi bidang itu namanya.
- **1748.** *Introductio in analysin infinitorum* karya Euler menetapkan notasi modern (sin, cos, tan) dan memperlakukannya sebagai fungsi dari sebuah bilangan, yang membuka jalan bagi kalkulus dan gelombang.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes in trigonometry?', 'Apa kesalahan umum dalam trigonometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes in trigonometry are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Use the calculator or program in the wrong mode | Degrees for degrees, radians for radians; check that $\sin30$ gives $0.5$ in degree mode. |
| ❌ $\sin(x+y)=\sin x+\sin y$ | $\sin(x+y)=\sin x\cos y+\cos x\sin y$; for $30^\circ$ and $60^\circ$ the first gives $1$ and the wrong one $1.366$. |
| ❌ $\sin2x=2\sin x$ | $\sin2x=2\sin x\cos x$; the wrong version only works at $0^\circ$ and $180^\circ$. |
| ❌ $\sin^{-1}x$ means $\frac{1}{\sin x}$ | $\sin^{-1}x$ is the inverse function $\arcsin x$; the reciprocal is $\csc x$. |
| ❌ Opposite and adjacent are fixed sides | They depend on the angle you look from; they swap when you look from the other acute angle. |
| ❌ $\tan90^\circ=\infty$ or $0$ | It is undefined: $\tan90^\circ=\frac{\sin90^\circ}{\cos90^\circ}=\frac10$. |
| ❌ A big triangle has a bigger sine | The ratios depend only on the angle; for an acute angle the sine is between $0$ and $1$. |
| ❌ $\sin150^\circ$ is negative because $150^\circ>90^\circ$ | It is in quadrant II, where sine is positive: $\sin150^\circ=\sin30^\circ=\frac12$. |
| ❌ $\sin x=\frac12$ has only the solution $30^\circ$ | There are two between $0^\circ$ and $360^\circ$: $30^\circ$ and $150^\circ$ (and every turn more). |`,
            T`**Kesalahan paling umum dalam trigonometri adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Memakai kalkulator atau program pada mode yang salah | Derajat untuk derajat, radian untuk radian; periksa bahwa $\sin30$ memberi $0{,}5$ pada mode derajat. |
| ❌ $\sin(x+y)=\sin x+\sin y$ | $\sin(x+y)=\sin x\cos y+\cos x\sin y$; untuk $30^\circ$ dan $60^\circ$ yang benar memberi $1$ dan yang salah $1{,}366$. |
| ❌ $\sin2x=2\sin x$ | $\sin2x=2\sin x\cos x$; versi yang salah hanya berlaku pada $0^\circ$ dan $180^\circ$. |
| ❌ $\sin^{-1}x$ berarti $\frac{1}{\sin x}$ | $\sin^{-1}x$ adalah fungsi invers $\arcsin x$; kebalikannya adalah $\csc x$. |
| ❌ Sisi depan dan samping adalah sisi yang tetap | Keduanya bergantung pada sudut yang dilihat; keduanya bertukar bila kita melihat dari sudut lancip yang lain. |
| ❌ $\tan90^\circ=\infty$ atau $0$ | Ia tak terdefinisi: $\tan90^\circ=\frac{\sin90^\circ}{\cos90^\circ}=\frac10$. |
| ❌ Segitiga besar memiliki sinus lebih besar | Perbandingan hanya bergantung pada sudut; untuk sudut lancip sinus berada di antara $0$ dan $1$. |
| ❌ $\sin150^\circ$ negatif karena $150^\circ>90^\circ$ | Ia di kuadran II, tempat sinus positif: $\sin150^\circ=\sin30^\circ=\frac12$. |
| ❌ $\sin x=\frac12$ hanya memiliki penyelesaian $30^\circ$ | Ada dua di antara $0^\circ$ dan $360^\circ$: $30^\circ$ dan $150^\circ$ (dan setiap putaran berikutnya). |`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- practice */
    {
      id: 'practice',
      heading: L('Practice: test your understanding', 'Latihan: uji pemahamanmu'),
      blocks: [
        {
          kind: 'text',
          text: L(
            'These questions mix everything above. A wrong answer costs nothing here: read the hint and try again.',
            'Soal-soal ini mencampur semua yang dibahas di atas. Jika jawabanmu belum tepat, perhatikan petunjuk yang tersedia, lalu coba kembali.',
          ),
        },
        {
          kind: 'activity',
          title: L('True or false?', 'Benar atau salah?'),
          step: {
            kind: 'judge',
            id: 'p1',
            prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
            statements: [
              L(T`The sine of an acute angle in a right triangle is the opposite side divided by the hypotenuse.`, T`Sinus sudut lancip pada segitiga siku-siku adalah sisi depan dibagi sisi miring.`),
              L(T`$\tan45^\circ=1$.`, T`$\tan45^\circ=1$.`),
              L(T`$\cos120^\circ$ is positive.`, T`$\cos120^\circ$ bernilai positif.`),
              L(T`$\sin^2x+\cos^2x=1$ for every angle $x$.`, T`$\sin^2x+\cos^2x=1$ untuk setiap sudut $x$.`),
              L(T`$\sin(x+y)=\sin x+\sin y$.`, T`$\sin(x+y)=\sin x+\sin y$.`),
              L(T`A bigger right triangle with the same angle has a bigger sine.`, T`Segitiga siku-siku yang lebih besar dengan sudut sama memiliki sinus yang lebih besar.`),
            ],
            answer: [true, true, false, true, false, false],
            explain: L(
              T`$120^\circ$ is in quadrant II, where cosine is negative ($\cos120^\circ=-\frac12$). $\sin(x+y)=\sin x\cos y+\cos x\sin y$. The sine depends only on the angle, because the triangles are similar.`,
              T`$120^\circ$ berada di kuadran II, tempat kosinus negatif ($\cos120^\circ=-\frac12$). $\sin(x+y)=\sin x\cos y+\cos x\sin y$. Sinus hanya bergantung pada sudut, karena segitiganya sebangun.`,
            ),
            hint: L(T`Think of the unit circle for the signs, and of similar triangles for the size.`, T`Pikirkan lingkaran satuan untuk tandanya, dan segitiga sebangun untuk ukurannya.`),
          },
        },
        {
          kind: 'activity',
          title: L('A side from a sine', 'Sebuah sisi dari sinus'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`The opposite side is the hypotenuse times $\sin\theta$.`, T`Sisi depan adalah sisi miring dikali $\sin\theta$.`), L(T`$\sin30^\circ=\frac12$, so $10\cdot\frac12$.`, T`$\sin30^\circ=\frac12$, jadi $10\cdot\frac12$.`)],
            explain: L(T`$\text{opposite}=10\sin30^\circ=10\cdot\frac12=5$.`, T`$\text{depan}=10\sin30^\circ=10\cdot\frac12=5$.`),
            prompt: L(T`A right triangle has a hypotenuse of $10$ and an angle of $30^\circ$. How long is the side opposite that angle?`, T`Sebuah segitiga siku-siku memiliki sisi miring $10$ dan sudut $30^\circ$. Berapa panjang sisi di depan sudut itu?`),
            given: String.raw`x=v`,
            blanks: [{ label: 'x =', answer: 5 }],
          },
        },
        {
          kind: 'activity',
          title: L('A tower', 'Sebuah menara'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`Opposite and adjacent: use the tangent.`, T`Sisi depan dan samping: pakai tangen.`), L(T`$\tan45^\circ=1$, so $h=30\cdot1$.`, T`$\tan45^\circ=1$, jadi $h=30\cdot1$.`)],
            explain: L(T`$h=30\tan45^\circ=30$ m.`, T`$h=30\tan45^\circ=30$ m.`),
            prompt: L(T`From $30$ m away you see the top of a tower at an angle of elevation of $45^\circ$. How tall is the tower above your eye, in metres?`, T`Dari jarak $30$ m Anda melihat puncak sebuah menara dengan sudut elevasi $45^\circ$. Berapa tinggi menara di atas mata Anda, dalam meter?`),
            given: String.raw`h=v`,
            blanks: [{ label: 'h =', answer: 30 }],
          },
        },
        {
          kind: 'activity',
          title: L('An exact value', 'Sebuah nilai eksak'),
          step: {
            kind: 'quiz',
            id: 'p4',
            prompt: L(T`What is the exact value of $\cos60^\circ$?`, T`Berapa nilai eksak $\cos60^\circ$?`),
            options: [L(T`$\frac12$`, T`$\frac12$`), L(T`$\frac{\sqrt3}{2}$`, T`$\frac{\sqrt3}{2}$`), L(T`$\frac{\sqrt2}{2}$`, T`$\frac{\sqrt2}{2}$`), L(T`$1$`, T`$1$`)],
            answer: 0,
            explain: L(T`In the half equilateral triangle the side next to $60^\circ$ is $1$ and the hypotenuse $2$, so $\cos60^\circ=\frac12$.`, T`Pada setengah segitiga sama sisi sisi di samping $60^\circ$ adalah $1$ dan sisi miringnya $2$, jadi $\cos60^\circ=\frac12$.`),
            hint: L(T`Cosine is adjacent over hypotenuse in the $30^\circ$–$60^\circ$–$90^\circ$ triangle with sides $1$, $\sqrt3$, $2$.`, T`Kosinus adalah samping per miring pada segitiga $30^\circ$–$60^\circ$–$90^\circ$ dengan sisi $1$, $\sqrt3$, $2$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A reference angle', 'Sebuah sudut acuan'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`$210^\circ$ is in quadrant III: subtract $180^\circ$.`, T`$210^\circ$ berada di kuadran III: kurangkan $180^\circ$.`), L(T`$210-180$.`, T`$210-180$.`)],
            explain: L(T`$210^\circ-180^\circ=30^\circ$.`, T`$210^\circ-180^\circ=30^\circ$.`),
            prompt: L(T`What is the reference angle of $210^\circ$, in degrees?`, T`Berapa sudut acuan $210^\circ$, dalam derajat?`),
            given: String.raw`r=v`,
            blanks: [{ label: 'r =', answer: 30 }],
          },
        },
        {
          kind: 'activity',
          title: L('A sine in the third quadrant', 'Sinus di kuadran ketiga'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L(T`What is $\sin210^\circ$?`, T`Berapa $\sin210^\circ$?`),
            options: [L(T`$-\frac12$`, T`$-\frac12$`), L(T`$\frac12$`, T`$\frac12$`), L(T`$-\frac{\sqrt3}{2}$`, T`$-\frac{\sqrt3}{2}$`), L(T`$\frac{\sqrt3}{2}$`, T`$\frac{\sqrt3}{2}$`)],
            answer: 0,
            explain: L(T`The reference angle is $30^\circ$ and $\sin30^\circ=\frac12$; sine is negative in quadrant III, so $\sin210^\circ=-\frac12$.`, T`Sudut acuannya $30^\circ$ dan $\sin30^\circ=\frac12$; sinus negatif di kuadran III, jadi $\sin210^\circ=-\frac12$.`),
            hint: L(T`Find the reference angle, read its sine, then choose the sign by the quadrant.`, T`Cari sudut acuan, baca sinusnya, lalu pilih tanda menurut kuadran.`),
          },
        },
        {
          kind: 'activity',
          title: L('Two solutions', 'Dua penyelesaian'),
          step: {
            kind: 'multi',
            id: 'p7',
            prompt: L(T`Which angles between $0^\circ$ and $360^\circ$ satisfy $\sin x=\frac{\sqrt3}{2}$? Choose **all** that apply.`, T`Sudut mana di antara $0^\circ$ dan $360^\circ$ yang memenuhi $\sin x=\frac{\sqrt3}{2}$? Pilih **semua** yang benar.`),
            options: [L(T`$30^\circ$`, T`$30^\circ$`), L(T`$60^\circ$`, T`$60^\circ$`), L(T`$120^\circ$`, T`$120^\circ$`), L(T`$150^\circ$`, T`$150^\circ$`), L(T`$240^\circ$`, T`$240^\circ$`)],
            answer: [1, 2],
            explain: L(T`The principal angle is $60^\circ$ and its mirror image is $180^\circ-60^\circ=120^\circ$.`, T`Sudut pokoknya $60^\circ$ dan bayangan cerminnya $180^\circ-60^\circ=120^\circ$.`),
            hint: L(T`Sine is positive in quadrants I and II.`, T`Sinus positif di kuadran I dan II.`),
          },
        },
        {
          kind: 'activity',
          title: L('A period', 'Sebuah periode'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`The period of $y=\sin(bx)$ is $\frac{360^\circ}{b}$.`, T`Periode $y=\sin(bx)$ adalah $\frac{360^\circ}{b}$.`), L(T`$\frac{360}{3}$.`, T`$\frac{360}{3}$.`)],
            explain: L(T`$\frac{360^\circ}{3}=120^\circ$.`, T`$\frac{360^\circ}{3}=120^\circ$.`),
            prompt: L(T`What is the period of $y=\sin3x$, in degrees?`, T`Berapa periode $y=\sin3x$, dalam derajat?`),
            given: String.raw`P=v`,
            blanks: [{ label: 'P =', answer: 120 }],
          },
        },
        {
          kind: 'activity',
          title: L('An amplitude', 'Sebuah amplitudo'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`The amplitude is $|a|$ in $y=a\cos x+d$: the minus sign only flips the wave.`, T`Amplitudo adalah $|a|$ pada $y=a\cos x+d$: tanda minus hanya membalik gelombang.`), L(T`$|-4|$.`, T`$|-4|$.`)],
            explain: L(T`The amplitude is $|-4|=4$; the maximum is $1+4=5$ and the minimum $1-4=-3$.`, T`Amplitudonya $|-4|=4$; maksimumnya $1+4=5$ dan minimumnya $1-4=-3$.`),
            prompt: L(T`What is the amplitude of $y=-4\cos x+1$?`, T`Berapa amplitudo $y=-4\cos x+1$?`),
            given: String.raw`A=v`,
            blanks: [{ label: 'A =', answer: 4 }],
          },
        },
        {
          kind: 'activity',
          title: L('An identity', 'Sebuah identitas'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`Which of these is an identity (true for every angle)?`, T`Manakah yang merupakan identitas (benar untuk setiap sudut)?`),
            options: [
              L(T`$\cos^2x=1-\sin^2x$`, T`$\cos^2x=1-\sin^2x$`),
              L(T`$\sin2x=2\sin x$`, T`$\sin2x=2\sin x$`),
              L(T`$\sin x+\cos x=1$`, T`$\sin x+\cos x=1$`),
              L(T`$\cos2x=2\cos x$`, T`$\cos2x=2\cos x$`),
            ],
            answer: 0,
            explain: L(T`It is the Pythagorean identity rearranged. The others each hold at a few angles only ($\sin2x=2\sin x$ at $0^\circ$ and $180^\circ$).`, T`Itu identitas Pythagoras yang disusun ulang. Yang lain masing-masing hanya berlaku pada beberapa sudut ($\sin2x=2\sin x$ pada $0^\circ$ dan $180^\circ$).`),
            hint: L(T`Start from $\sin^2x+\cos^2x=1$.`, T`Mulailah dari $\sin^2x+\cos^2x=1$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Order the steps', 'Urutkan langkah-langkahnya'),
          step: {
            kind: 'order',
            id: 'p11',
            prompt: L('Put the steps of finding the height of a tower from an angle of elevation in order.', 'Urutkan langkah mencari tinggi menara dari sudut elevasi.'),
            lines: {
              en: [
                'Draw the right triangle: the tower is the opposite side.',
                'Measure the distance to the foot of the tower (the adjacent side).',
                'Measure the angle of elevation.',
                'Pick the tangent: tan θ = height / distance.',
                'Solve: height = distance × tan θ.',
              ],
              id: [
                'Gambar segitiga siku-siku: menara adalah sisi depan.',
                'Ukur jarak ke kaki menara (sisi samping).',
                'Ukur sudut elevasi.',
                'Pilih tangen: tan θ = tinggi / jarak.',
                'Selesaikan: tinggi = jarak × tan θ.',
              ],
            },
            explain: L(T`First the picture and the two measurements, then the ratio that links the known side and angle to the unknown side, then the solution.`, T`Pertama gambar dan kedua ukuran, lalu perbandingan yang menghubungkan sisi dan sudut yang diketahui dengan sisi yang dicari, lalu penyelesaiannya.`),
            hint: L(T`Measure before you choose a ratio, and choose it before you solve.`, T`Ukur sebelum memilih perbandingan, dan pilih sebelum menyelesaikan.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the ratio', 'Isi perbandingannya'),
          step: {
            kind: 'fill',
            id: 'p12',
            prompt: L('Complete the sentence.', 'Lengkapi kalimatnya.'),
            template: {
              en: 'In a right triangle, tan A = opposite / ___ and sin A = opposite / ___.',
              id: 'Pada segitiga siku-siku, tan A = depan / ___ dan sin A = depan / ___.',
            },
            blanks: { en: ['adjacent', 'hypotenuse'], id: ['samping', 'miring'] },
            explain: L(T`SOH-CAH-TOA: sine is opposite over hypotenuse, tangent is opposite over adjacent.`, T`Sin-de-mi, tan-de-sa: sinus adalah depan per miring, tangen adalah depan per samping.`),
            hint: L(T`Recall SOH-CAH-TOA.`, T`Ingat sin-de-mi, cos-sa-mi, tan-de-sa.`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: basic trigonometry at a glance', 'Ringkasan: trigonometri dasar sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Ratios:** $\sin\theta=\frac{\text{opp}}{\text{hyp}}$, $\cos\theta=\frac{\text{adj}}{\text{hyp}}$, $\tan\theta=\frac{\text{opp}}{\text{adj}}$ (SOH-CAH-TOA); reciprocals $\csc$, $\sec$, $\cot$; they depend only on the angle (similar triangles).
- **Solve a right triangle:** one angle and one side, or two sides; pick the ratio with the known and unknown sides; inverse functions for angles; check with Pythagoras.
- **Special angles:** $\sin30^\circ=\frac12$, $\sin45^\circ=\frac{\sqrt2}{2}$, $\sin60^\circ=\frac{\sqrt3}{2}$; cosines in reverse; $\tan$: $\frac{\sqrt3}{3}$, $1$, $\sqrt3$; $\tan90^\circ$ undefined.
- **Unit circle:** the point at angle $\theta$ is $(\cos\theta,\sin\theta)$; signs: all, sine, tangent, cosine in quadrants I to IV; reference angle; period $360^\circ$ (tangent $180^\circ$); $\sin(-\theta)=-\sin\theta$, $\cos(-\theta)=\cos\theta$.
- **Equations:** $\sin x=c$: $\alpha$ and $180^\circ-\alpha$; $\cos x=c$: $\pm\alpha$; $\tan x=c$: $\alpha$ and $\alpha+180^\circ$; add turns.
- **Identities:** $\sin^2x+\cos^2x=1$, $\tan x=\frac{\sin x}{\cos x}$, $\sin(90^\circ-x)=\cos x$, $\sin2x=2\sin x\cos x$, $\sin(x+y)=\sin x\cos y+\cos x\sin y$; a counterexample refutes, a proof is needed to confirm.
- **Graphs:** $y=a\sin(b(x-c))+d$ has amplitude $|a|$, period $\frac{360^\circ}{b}$, phase shift $c$, midline $d$.
- **Code:** radians for ´sin´ and ´cos´; compare with a tolerance; ´atan2´ for angles; the inverse functions give only one solution.`,
            T`- **Perbandingan:** $\sin\theta=\frac{\text{dep}}{\text{mir}}$, $\cos\theta=\frac{\text{sam}}{\text{mir}}$, $\tan\theta=\frac{\text{dep}}{\text{sam}}$ (sin-de-mi, cos-sa-mi, tan-de-sa); kebalikan $\csc$, $\sec$, $\cot$; hanya bergantung pada sudut (segitiga sebangun).
- **Memecahkan segitiga siku-siku:** satu sudut dan satu sisi, atau dua sisi; pilih perbandingan dengan sisi yang diketahui dan dicari; fungsi invers untuk sudut; periksa dengan Pythagoras.
- **Sudut istimewa:** $\sin30^\circ=\frac12$, $\sin45^\circ=\frac{\sqrt2}{2}$, $\sin60^\circ=\frac{\sqrt3}{2}$; kosinus terbalik; $\tan$: $\frac{\sqrt3}{3}$, $1$, $\sqrt3$; $\tan90^\circ$ tak terdefinisi.
- **Lingkaran satuan:** titik pada sudut $\theta$ adalah $(\cos\theta,\sin\theta)$; tanda: semua, sinus, tangen, kosinus di kuadran I sampai IV; sudut acuan; periode $360^\circ$ (tangen $180^\circ$); $\sin(-\theta)=-\sin\theta$, $\cos(-\theta)=\cos\theta$.
- **Persamaan:** $\sin x=c$: $\alpha$ dan $180^\circ-\alpha$; $\cos x=c$: $\pm\alpha$; $\tan x=c$: $\alpha$ dan $\alpha+180^\circ$; tambahkan putaran.
- **Identitas:** $\sin^2x+\cos^2x=1$, $\tan x=\frac{\sin x}{\cos x}$, $\sin(90^\circ-x)=\cos x$, $\sin2x=2\sin x\cos x$, $\sin(x+y)=\sin x\cos y+\cos x\sin y$; satu contoh penyangkal membantah, bukti diperlukan untuk memastikan.
- **Grafik:** $y=a\sin(b(x-c))+d$ memiliki amplitudo $|a|$, periode $\frac{360^\circ}{b}$, pergeseran fase $c$, garis tengah $d$.
- **Kode:** radian untuk ´sin´ dan ´cos´; bandingkan dengan toleransi; ´atan2´ untuk sudut; fungsi invers hanya memberi satu penyelesaian.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Trigonometry', 'Trigonometri'), definition: L('The branch of mathematics that relates the angles of a triangle to the lengths of its sides, through the sine, cosine and tangent.', 'Cabang matematika yang menghubungkan sudut segitiga dengan panjang sisinya, melalui sinus, kosinus, dan tangen.') },
    { term: L('Hypotenuse', 'Sisi miring'), definition: L('The side of a right triangle opposite the right angle, and its longest side.', 'Sisi segitiga siku-siku di depan sudut siku-siku, dan sisi terpanjangnya.') },
    { term: L('Sine', 'Sinus'), definition: L('For an acute angle of a right triangle, the length of the opposite side divided by the hypotenuse; on the unit circle, the y-coordinate of the point at that angle.', 'Untuk sudut lancip segitiga siku-siku, panjang sisi depan dibagi sisi miring; pada lingkaran satuan, koordinat-y titik pada sudut itu.') },
    { term: L('Cosine', 'Kosinus'), definition: L('For an acute angle of a right triangle, the adjacent side divided by the hypotenuse; on the unit circle, the x-coordinate of the point at that angle.', 'Untuk sudut lancip segitiga siku-siku, sisi samping dibagi sisi miring; pada lingkaran satuan, koordinat-x titik pada sudut itu.') },
    { term: L('Tangent', 'Tangen'), definition: L('The opposite side divided by the adjacent side, which equals sine divided by cosine; it is undefined where the cosine is zero.', 'Sisi depan dibagi sisi samping, yang sama dengan sinus dibagi kosinus; ia tak terdefinisi di tempat kosinus bernilai nol.') },
    { term: L('Unit circle', 'Lingkaran satuan'), definition: L('The circle of radius 1 centered at the origin, used to define sine and cosine for every angle.', 'Lingkaran berjari-jari 1 berpusat di titik asal, dipakai untuk mendefinisikan sinus dan kosinus untuk setiap sudut.') },
    { term: L('Reference angle', 'Sudut acuan'), definition: L('The acute angle between the terminal side of an angle and the x-axis; the functions at the angle equal those at the reference angle up to sign.', 'Sudut lancip antara kaki terminal sebuah sudut dan sumbu-x; nilai fungsi pada sudut itu sama dengan pada sudut acuan kecuali tandanya.') },
    { term: L('Angle of elevation', 'Sudut elevasi'), definition: L('The angle above the horizontal at which you look up at an object; the angle of depression is the same angle measured below the horizontal.', 'Sudut di atas garis mendatar saat kita memandang ke atas sebuah benda; sudut depresi adalah sudut yang sama diukur di bawah garis mendatar.') },
    { term: L('Trigonometric identity', 'Identitas trigonometri'), definition: L('An equation involving trigonometric functions that is true for every angle at which both sides are defined, such as sin squared plus cos squared equals 1.', 'Persamaan yang memuat fungsi trigonometri yang benar untuk setiap sudut yang kedua ruasnya terdefinisi, seperti sin kuadrat ditambah cos kuadrat sama dengan 1.') },
    { term: L('Amplitude and period', 'Amplitudo dan periode'), definition: L('For a sine or cosine wave, the amplitude is the height from the midline to a peak, and the period is the length of one full cycle.', 'Pada gelombang sinus atau kosinus, amplitudo adalah tinggi dari garis tengah ke puncak, dan periode adalah panjang satu siklus penuh.') },
  ],

  howTo: [
    {
      name: L('How to find a side of a right triangle from an angle with sine, cosine or tangent', 'Cara mencari sisi segitiga siku-siku dari sebuah sudut dengan sinus, kosinus, atau tangen'),
      description: L('Name the sides from a chosen angle, pick the trigonometric ratio that holds the known and unknown sides, and solve the equation.', 'Namai sisi-sisi dari sudut yang dipilih, pilih perbandingan trigonometri yang memuat sisi yang diketahui dan yang tidak diketahui, dan selesaikan persamaannya.'),
      steps: [
        { name: L('Mark the angle and name the sides', 'Tandai sudut dan namai sisinya'), text: L('Draw the triangle, mark the angle you use, and name the sides opposite, adjacent and hypotenuse relative to it.', 'Gambar segitiganya, tandai sudut yang dipakai, dan namai sisi depan, samping, dan miring relatif terhadapnya.') },
        { name: L('Pick the ratio', 'Pilih perbandingannya'), text: L('Choose sine for opposite and hypotenuse, cosine for adjacent and hypotenuse, tangent for opposite and adjacent.', 'Pilih sinus untuk sisi depan dan miring, kosinus untuk samping dan miring, tangen untuk depan dan samping.') },
        { name: L('Write and solve the equation', 'Tulis dan selesaikan persamaannya'), text: L('Write the ratio as an equation with the unknown side and solve it by multiplying or dividing.', 'Tulis perbandingan itu sebagai persamaan dengan sisi yang tidak diketahui dan selesaikan dengan mengalikan atau membagi.') },
        { name: L('Check the answer', 'Periksa jawabannya'), text: L('The hypotenuse must be the longest side and the sides must satisfy the Pythagorean theorem.', 'Sisi miring harus sisi terpanjang dan sisi-sisinya harus memenuhi teorema Pythagoras.') },
      ],
    },
    {
      name: L('How to find the sine of an angle with a reference angle', 'Cara mencari sinus sebuah sudut dengan sudut acuan'),
      description: L('Reduce the angle to its acute reference angle, read the value there and give it the sign of the quadrant.', 'Kurangi sudut itu ke sudut acuannya yang lancip, baca nilainya di sana, dan beri tanda kuadran.'),
      steps: [
        { name: L('Find the quadrant', 'Cari kuadrannya'), text: L('Bring the angle into 0 to 360 degrees by adding or subtracting whole turns and see which quadrant it is in.', 'Bawa sudut ke 0 sampai 360 derajat dengan menambah atau mengurangi putaran penuh dan lihat kuadrannya.') },
        { name: L('Find the reference angle', 'Cari sudut acuannya'), text: L('Use 180 minus the angle in quadrant II, the angle minus 180 in III, 360 minus the angle in IV.', 'Pakai 180 dikurangi sudut di kuadran II, sudut dikurangi 180 di III, 360 dikurangi sudut di IV.') },
        { name: L('Read the value', 'Baca nilainya'), text: L('Read the sine at the reference angle from the table of special angles.', 'Baca sinus pada sudut acuan dari tabel sudut istimewa.') },
        { name: L('Give it the sign', 'Beri tandanya'), text: L('Put a minus sign in front if sine is negative in that quadrant, that is, in quadrants III and IV.', 'Beri tanda minus di depannya bila sinus negatif di kuadran itu, yaitu di kuadran III dan IV.') },
      ],
    },
    {
      name: L('How to solve a basic trigonometric equation', 'Cara menyelesaikan persamaan trigonometri dasar'),
      description: L('Find the principal angle with the inverse function, add its mirror image and then whole turns.', 'Cari sudut pokok dengan fungsi invers, tambahkan bayangan cerminnya, lalu putaran penuh.'),
      steps: [
        { name: L('Check the range', 'Periksa jangkauannya'), text: L('For sine or cosine, the number c must be between minus 1 and 1, otherwise there is no solution.', 'Untuk sinus atau kosinus, bilangan c harus di antara minus 1 dan 1, jika tidak tidak ada penyelesaian.') },
        { name: L('Find the principal angle', 'Cari sudut pokoknya'), text: L('Apply arcsine, arccosine or arctangent to c to get the angle alpha.', 'Terapkan arcsin, arccos, atau arctan pada c untuk mendapat sudut alfa.') },
        { name: L('Find the mirror image', 'Cari bayangan cerminnya'), text: L('For sine use 180 minus alpha, for cosine use 360 minus alpha, for tangent use alpha plus 180.', 'Untuk sinus pakai 180 dikurangi alfa, untuk kosinus pakai 360 dikurangi alfa, untuk tangen pakai alfa ditambah 180.') },
        { name: L('Add whole turns', 'Tambahkan putaran penuh'), text: L('Add 360 times k for sine and cosine, 180 times k for tangent, where k is any whole number.', 'Tambahkan 360 kali k untuk sinus dan kosinus, 180 kali k untuk tangen, dengan k bilangan bulat apa saja.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What are sine, cosine and tangent?', 'Apa itu sinus, kosinus, dan tangen?'),
      a: L(
        'They are the three basic ratios of a right triangle for one of its acute angles: sine is opposite over hypotenuse, cosine is adjacent over hypotenuse and tangent is opposite over adjacent. They depend only on the angle.',
        'Ketiganya adalah perbandingan dasar segitiga siku-siku untuk salah satu sudut lancipnya: sinus adalah depan per miring, kosinus adalah samping per miring, dan tangen adalah depan per samping. Ketiganya hanya bergantung pada sudut.',
      ),
    },
    {
      q: L('What does SOH-CAH-TOA mean?', 'Apa arti sin-de-mi, cos-sa-mi, tan-de-sa?'),
      a: L(
        'It is a memory aid: Sine is Opposite over Hypotenuse, Cosine is Adjacent over Hypotenuse, Tangent is Opposite over Adjacent. The sides are named from the angle you are looking at.',
        'Itu alat bantu ingatan: sin-de-mi berarti sinus adalah sisi depan per sisi miring, cos-sa-mi berarti kosinus adalah sisi samping per sisi miring, dan tan-de-sa berarti tangen adalah sisi depan per sisi samping. Sisi-sisi dinamai dari sudut yang dilihat.',
      ),
    },
    {
      q: L('How do you find a side of a right triangle with trigonometry?', 'Bagaimana mencari sisi segitiga siku-siku dengan trigonometri?'),
      a: L(
        'Pick the ratio that contains the side you know and the side you want, write it as an equation and solve. For example, with an angle of 35 degrees and an adjacent side of 40, the opposite side is 40 times tan 35.',
        'Pilih perbandingan yang memuat sisi yang diketahui dan sisi yang dicari, tulis sebagai persamaan, dan selesaikan. Misalnya dengan sudut 35 derajat dan sisi samping 40, sisi depannya adalah 40 kali tan 35.',
      ),
    },
    {
      q: L('What are the exact values of sin, cos and tan for 30, 45 and 60 degrees?', 'Berapa nilai eksak sin, cos, dan tan untuk 30, 45, dan 60 derajat?'),
      a: L(
        'Sine is one half, root 2 over 2 and root 3 over 2; cosine is the same list backwards; tangent is root 3 over 3, 1 and root 3. They come from half an equilateral triangle and half a square.',
        'Sinus adalah setengah, akar 2 per 2, dan akar 3 per 2; kosinus adalah daftar yang sama dari belakang; tangen adalah akar 3 per 3, 1, dan akar 3. Nilai-nilai itu berasal dari setengah segitiga sama sisi dan setengah persegi.',
      ),
    },
    {
      q: L('What is the unit circle in trigonometry?', 'Apa itu lingkaran satuan dalam trigonometri?'),
      a: L(
        'It is the circle of radius 1 around the origin. The point reached by turning through an angle from the positive x-axis has coordinates cosine and sine of that angle, which defines the functions for every angle.',
        'Itu adalah lingkaran berjari-jari 1 di sekitar titik asal. Titik yang dicapai dengan berputar sebesar sudut dari sumbu-x positif memiliki koordinat kosinus dan sinus sudut itu, yang mendefinisikan fungsi untuk setiap sudut.',
      ),
    },
    {
      q: L('Why is tan 90 degrees undefined?', 'Mengapa tan 90 derajat tak terdefinisi?'),
      a: L(
        'Tangent is sine divided by cosine, and at 90 degrees the cosine is 0 while the sine is 1, so the division has no value. The graph of the tangent rises without bound near 90 degrees.',
        'Tangen adalah sinus dibagi kosinus, dan pada 90 derajat kosinus bernilai 0 sedangkan sinus 1, sehingga pembagiannya tidak bernilai. Grafik tangen naik tanpa batas di dekat 90 derajat.',
      ),
    },
    {
      q: L('Is sin(a + b) equal to sin a + sin b?', 'Apakah sin(a + b) sama dengan sin a + sin b?'),
      a: L(
        'No. The correct formula is sin a cos b plus cos a sin b. For 30 and 60 degrees the left side is sin 90, which is 1, while sin 30 plus sin 60 is about 1.366.',
        'Tidak. Rumus yang benar adalah sin a cos b ditambah cos a sin b. Untuk 30 dan 60 derajat ruas kirinya sin 90, yaitu 1, sedangkan sin 30 ditambah sin 60 sekitar 1,366.',
      ),
    },
    {
      q: L('Why does my calculator give a wrong answer for sin 30?', 'Mengapa kalkulator saya memberi jawaban salah untuk sin 30?'),
      a: L(
        'It is probably in radian mode, where 30 means 30 radians and the sine is about minus 0.988. Switch to degree mode to get 0.5. Programming languages always use radians, so convert degrees first.',
        'Kemungkinan ia dalam mode radian, di mana 30 berarti 30 radian dan sinusnya sekitar minus 0,988. Ganti ke mode derajat untuk mendapat 0,5. Bahasa pemrograman selalu memakai radian, jadi ubah derajat dulu.',
      ),
    },
  ],

  references: [
    { title: 'Trigonometric Delights', author: 'Eli Maor', year: 1998, source: 'Princeton University Press' },
    { title: 'Trigonometry (2nd ed.)', author: 'I. M. Gelfand, Mark Saul', year: 2001, source: 'Birkhäuser' },
    { title: 'Precalculus: Mathematics for Calculus (chapters on trigonometric functions)', author: 'James Stewart, Lothar Redlin, Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
    { title: 'Ptolemy\'s Almagest (translated and annotated)', author: 'G. J. Toomer', year: 1984, source: 'Springer' },
    { title: 'Introductio in analysin infinitorum', author: 'Leonhard Euler', year: 1748, source: 'Marcum-Michaelem Bousquet' },
  ],

  related: ['angles', 'triangles', 'pythagorean-theorem', 'inverse-trigonometric-functions'],
}
