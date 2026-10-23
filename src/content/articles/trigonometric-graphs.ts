import type { FigItem, Figure } from '../../lib/figure'
import type { Loc } from '../types'
import { DATASETS, FACTS, GFNS, fitSinusoid, radTex, setTex, type GFn } from '../../lib/triggraph'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './trigonometric-graphs.meta'

export { meta }

const L = (en: string, id: string): Loc => ({ en, id })

/** Prose is written between backticks with its TeX unescaped; the code marker
 *  inside it is ´ rather than a backtick, and `*word*` emphasis is dropped.
 *  `[words](article:id#section)` is a link to another article. Values may be
 *  put in with ${...}: they are taken as they are, so TeX in them is not escaped. */
const T = (s: TemplateStringsArray, ...v: string[]): string =>
  String.raw({ raw: s.raw }, ...v)
    .replace(/´([^´\n]+)´/g, '`$1`')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/^\s+|\s+$/g, '')

/** A static drawing on a plain canvas: the figure items are the only things in it, with no sliders and nothing to drag. The labels inside a
 *  drawing are letters, numbers and symbols, which read the same in both languages; the words are in the caption. */
const fig = (f: Omit<Figure, 'dim' | 'axes'>): ArticleBlock => {
  // With both spans given and no aspect, choose the frame that gives one scale on both axes (a 460-wide drawing with 26 of margin all round), so that circles are round
  const aspect = f.aspect ?? (f.xSpan && f.ySpan ? Math.min(3, Math.max(0.5, 460 / (52 + (460 - 52) * ((f.ySpan[1] - f.ySpan[0]) / (f.xSpan[1] - f.xSpan[0]))))) : 1)
  return { kind: 'figure', figure: { dim: 2, axes: false, ...f, aspect } }
}
const D = 'x*pi/180' // an angle in degrees, for the expressions of a figure

/* ------------------------------------------------------------------------------- the figures */

/** All six functions of an angle as lengths on the unit circle. */
const th = (35 * Math.PI) / 180
const cs = Math.cos(th)
const sn = Math.sin(th)
const tn = Math.tan(th)
const FIG_CIRCLE: ArticleBlock = fig({
  range: 1.4, // the size of the angle arc follows this
  xSpan: [-1.2, 2.0],
  ySpan: [-0.35, 1.5],
  items: [
    { t: 'seg', from: [-1.1, 0], to: [1.85, 0], color: 'muted' },
    { t: 'seg', from: [0, -0.2], to: [0, 1.4], color: 'muted' },
    { t: 'param', x: 'cos(t)', y: 'sin(t)', from: 0, to: 6.2832, color: 'muted' },
    { t: 'seg', from: [1, -0.15], to: [1, 1.25], color: 'muted', dashed: true },
    { t: 'seg', from: [-0.2, 1], to: [1.85, 1], color: 'muted', dashed: true },
    { t: 'seg', from: [0, 0], to: [1, tn], color: 'result', width: 2, dashed: true },
    { t: 'seg', from: [cs, 0], to: [cs, sn], color: 'a', width: 3 },
    { t: 'seg', from: [0, 0], to: [cs, 0], color: 'b', width: 3 },
    { t: 'seg', from: [1, 0], to: [1, tn], color: 'c', width: 3 },
    { t: 'seg', from: [0, 1], to: [1 / tn, 1], color: 'c', width: 3 },
    { t: 'seg', from: [0, 0], to: [1 / tn, 1], color: 'result', width: 2, dashed: true },
    { t: 'point', at: [cs, sn], color: 'a' },
    { t: 'angle', at: [0, 0], from: [1, 0], to: [cs, sn], label: 'θ' },
    { t: 'text', at: [cs - 0.1, sn / 2], text: 'sin', size: 'sm', color: 'a', anchor: 'end' },
    { t: 'text', at: [cs / 2, -0.12], text: 'cos', size: 'sm', color: 'b' },
    { t: 'text', at: [1.1, tn / 2], text: 'tan', size: 'sm', color: 'c', anchor: 'start' },
    { t: 'text', at: [0.3, 0.36], text: 'sec', size: 'sm', color: 'result' },
    { t: 'text', at: [0.62, 1.1], text: 'cot', size: 'sm', color: 'c' },
    { t: 'text', at: [1.2, 0.74], text: 'csc', size: 'sm', color: 'result', anchor: 'start' },
  ],
  caption: L(
    T`The six functions of $\theta$ as lengths on the unit circle: $\sin\theta$ and $\cos\theta$ are the height and the width of the point; the ray through the point meets the line $x=1$ at the height $\tan\theta$, and its length up to that line is $\sec\theta$; it meets the line $y=1$ at the distance $\cot\theta$ along it, and its length up to that line is $\csc\theta$. Here $\theta=35^\circ$.`,
    T`Keenam fungsi $\theta$ sebagai panjang pada lingkaran satuan: $\sin\theta$ dan $\cos\theta$ adalah tinggi dan lebar titik; sinar melalui titik itu memotong garis $x=1$ pada tinggi $\tan\theta$, dan panjangnya sampai garis itu adalah $\sec\theta$; ia memotong garis $y=1$ pada jarak $\cot\theta$ di sepanjangnya, dan panjangnya sampai garis itu adalah $\csc\theta$. Di sini $\theta=35^\circ$.`,
  ),
})

/** The tangent: branches between asymptotes. */
const FIG_TAN: ArticleBlock = fig({
  xSpan: [-200, 380],
  ySpan: [-4.2, 4.6],
  aspect: 2.2,
  items: [
    { t: 'seg', from: [-190, 0], to: [370, 0], color: 'muted' },
    { t: 'seg', from: [0, -3.6], to: [0, 3.6], color: 'muted' },
    { t: 'vline', x: -90, color: 'result', dashed: true },
    { t: 'vline', x: 90, color: 'result', dashed: true },
    { t: 'vline', x: 270, color: 'result', dashed: true },
    { t: 'curve', f: `tan(${D})`, from: -180, to: 360, color: 'a' },
    ...[
      [0, 0],
      [45, 1],
      [-45, -1],
      [180, 0],
      [135, -1],
      [225, 1],
    ].map(([x, y]): FigItem => ({ t: 'dot', x, y, color: 'b' })),
    { t: 'text', at: [-82, 3.9], text: '−90°', size: 'sm', color: 'result', anchor: 'start' },
    { t: 'text', at: [98, 3.9], text: '90°', size: 'sm', color: 'result', anchor: 'start' },
    { t: 'text', at: [278, 3.9], text: '270°', size: 'sm', color: 'result', anchor: 'start' },
  ],
  caption: L(
    T`The graph of $y=\tan x$. It is undefined at $-90^\circ$, $90^\circ$, $270^\circ$, and so on (dashed lines: the vertical asymptotes), rises from far below to far above between two of them, passes through $(0^\circ,0)$ and $(45^\circ,1)$, and is the same picture again $180^\circ$ later.`,
    T`Grafik $y=\tan x$. Ia tak terdefinisi di $-90^\circ$, $90^\circ$, $270^\circ$, dan seterusnya (garis putus-putus: asimtot tegak), naik dari jauh di bawah ke jauh di atas di antara dua asimtot, melalui $(0^\circ,0)$ dan $(45^\circ,1)$, dan menjadi gambar yang sama lagi $180^\circ$ kemudian.`,
  ),
})

/** The secant above the cosine. */
const FIG_SEC: ArticleBlock = fig({
  xSpan: [-30, 390],
  ySpan: [-4.2, 4.2],
  aspect: 2.2,
  items: [
    { t: 'seg', from: [-20, 0], to: [380, 0], color: 'muted' },
    { t: 'hline', y: 1, color: 'muted', dashed: true },
    { t: 'hline', y: -1, color: 'muted', dashed: true },
    { t: 'vline', x: 90, color: 'result', dashed: true },
    { t: 'vline', x: 270, color: 'result', dashed: true },
    { t: 'curve', f: `cos(${D})`, from: 0, to: 360, color: 'muted', dashed: true },
    { t: 'curve', f: `1/cos(${D})`, from: 0, to: 360, color: 'a' },
    { t: 'dot', x: 0, y: 1, color: 'result' },
    { t: 'dot', x: 180, y: -1, color: 'result' },
    { t: 'dot', x: 360, y: 1, color: 'result' },
    { t: 'text', at: [98, 3.6], text: '90°', size: 'sm', color: 'result', anchor: 'start' },
    { t: 'text', at: [278, 3.6], text: '270°', size: 'sm', color: 'result', anchor: 'start' },
  ],
  caption: L(
    T`The secant (solid) drawn from the cosine (dashed). Where $\cos x=0$ the secant has asymptotes, at $90^\circ$ and $270^\circ$; where $\cos x$ is $1$ or $-1$ the secant touches the same height ($0^\circ$, $180^\circ$, $360^\circ$); and it never lies between $-1$ and $1$.`,
    T`Sekan (garis penuh) digambar dari kosinus (garis putus-putus). Di tempat $\cos x=0$ sekan punya asimtot, di $90^\circ$ dan $270^\circ$; di tempat $\cos x$ bernilai $1$ atau $-1$ sekan menyentuh tinggi yang sama ($0^\circ$, $180^\circ$, $360^\circ$); dan ia tak pernah berada di antara $-1$ dan $1$.`,
  ),
})

/** y = 3 sin(2x − 60°) + 1 with its five points. */
const FIG_SKETCH: ArticleBlock = fig({
  xSpan: [-30, 260],
  ySpan: [-3.2, 5.4],
  aspect: 2.2,
  items: [
    { t: 'seg', from: [-20, 0], to: [250, 0], color: 'muted' },
    { t: 'seg', from: [0, -2.6], to: [0, 4.8], color: 'muted' },
    { t: 'hline', y: 1, color: 'c', dashed: true },
    { t: 'curve', f: `sin(${D})`, from: 0, to: 240, color: 'muted', dashed: true },
    { t: 'curve', f: `3*sin((2*x-60)*pi/180)+1`, from: 0, to: 240, color: 'a' },
    ...[
      [30, 1],
      [75, 4],
      [120, 1],
      [165, -2],
      [210, 1],
    ].map(([x, y]): FigItem => ({ t: 'dot', x, y, color: 'result' })),
    { t: 'text', at: [30, 2.1], text: '30°', size: 'sm', color: 'result' },
    { t: 'text', at: [75, 4.8], text: '75°', size: 'sm', color: 'result' },
    { t: 'text', at: [134, 1.9], text: '120°', size: 'sm', color: 'result' },
    { t: 'text', at: [165, -2.7], text: '165°', size: 'sm', color: 'result' },
    { t: 'text', at: [210, 2.1], text: '210°', size: 'sm', color: 'result' },
    { t: 'text', at: [-22, 4], text: '4', size: 'sm', color: 'result' },
    { t: 'text', at: [-22, -2], text: '-2', size: 'sm', color: 'result' },
  ],
  caption: L(
    T`The graph of $y=3\sin(2x-60^\circ)+1$. One cycle starts where $2x-60^\circ=0$, that is at $x=30^\circ$, lasts $180^\circ$, and is drawn through five points a quarter of a period apart, at the heights $1,\ 4,\ 1,\ -2,\ 1$. The dashed curve is the parent $\sin x$.`,
    T`Grafik $y=3\sin(2x-60^\circ)+1$. Satu siklus dimulai di tempat $2x-60^\circ=0$, yaitu di $x=30^\circ$, panjangnya $180^\circ$, dan digambar melalui lima titik yang berjarak seperempat periode, pada tinggi $1,\ 4,\ 1,\ -2,\ 1$. Kurva putus-putus adalah induknya $\sin x$.`,
  ),
})

/** y = 2 tan(x/2). */
const FIG_SKETCH_TAN: ArticleBlock = fig({
  xSpan: [-420, 420],
  ySpan: [-6.8, 7],
  aspect: 2.2,
  items: [
    { t: 'seg', from: [-400, 0], to: [400, 0], color: 'muted' },
    { t: 'seg', from: [0, -5.8], to: [0, 5.8], color: 'muted' },
    { t: 'vline', x: -180, color: 'result', dashed: true },
    { t: 'vline', x: 180, color: 'result', dashed: true },
    { t: 'curve', f: `2*tan(${D}/2)`, from: -400, to: 400, color: 'a' },
    { t: 'dot', x: 0, y: 0, color: 'b' },
    { t: 'dot', x: 90, y: 2, color: 'b' },
    { t: 'dot', x: -90, y: -2, color: 'b' },
    { t: 'text', at: [-168, 6.3], text: '−180°', size: 'sm', color: 'result', anchor: 'start' },
    { t: 'text', at: [192, 6.3], text: '180°', size: 'sm', color: 'result', anchor: 'start' },
    { t: 'text', at: [112, 0.9], text: '(90°, 2)', size: 'sm', color: 'b', anchor: 'start' },
  ],
  caption: L(
    T`The graph of $y=2\tan\frac{x}{2}$: the period is $\frac{180^\circ}{1/2}=360^\circ$, the asymptotes are at $x=\pm180^\circ$, the graph crosses at $0^\circ$, and at a quarter of the way to an asymptote, $x=\pm90^\circ$, it is at $y=\pm2$ (because $\tan45^\circ=1$ and $a=2$).`,
    T`Grafik $y=2\tan\frac{x}{2}$: periodenya $\frac{180^\circ}{1/2}=360^\circ$, asimtotnya di $x=\pm180^\circ$, grafik memotong di $0^\circ$, dan pada seperempat jalan menuju asimtot, $x=\pm90^\circ$, ia berada di $y=\pm2$ (karena $\tan45^\circ=1$ dan $a=2$).`,
  ),
})

/** A tide read off its peaks. */
const FIG_TIDE: ArticleBlock = fig({
  xSpan: [-3, 27],
  ySpan: [-0.1, 3.6],
  aspect: 2.4,
  items: [
    { t: 'seg', from: [-1, 0], to: [26, 0], color: 'muted' },
    { t: 'hline', y: 2.9, color: 'muted', dashed: true },
    { t: 'hline', y: 0.7, color: 'muted', dashed: true },
    { t: 'hline', y: 1.8, color: 'c', dashed: true },
    { t: 'curve', f: '1.8+1.1*cos(2*pi/12.4*(x-3))', from: 0, to: 25, color: 'a' },
    { t: 'dot', x: 3, y: 2.9, color: 'result' },
    { t: 'dot', x: 15.4, y: 2.9, color: 'result' },
    { t: 'dot', x: 9.2, y: 0.7, color: 'result' },
    { t: 'text', at: [-1.7, 3.12], text: '2.9', size: 'sm', color: 'result' },
    { t: 'text', at: [-1.7, 2.02], text: '1.8', size: 'sm', color: 'c' },
    { t: 'text', at: [-1.7, 0.92], text: '0.7', size: 'sm', color: 'result' },
    { t: 'text', at: [3, -0.35], text: '3', size: 'sm', color: 'result' },
    { t: 'text', at: [9.2, -0.35], text: '9.2', size: 'sm', color: 'result' },
    { t: 'text', at: [15.4, -0.35], text: '15.4', size: 'sm', color: 'result' },
  ],
  caption: L(
    T`A tide (illustrative numbers): the water is highest, $2.9$ m, at $3$ h and again at $15.4$ h, and lowest, $0.7$ m. The midline is $\frac{2.9+0.7}{2}=1.8$ m, the amplitude $1.1$ m, the period $15.4-3=12.4$ h, so $y=1.1\cos\left(\frac{2\pi}{12.4}(t-3)\right)+1.8$.`,
    T`Pasang surut (angka ilustrasi): air tertinggi, $2{,}9$ m, pada jam $3$ dan lagi pada jam $15{,}4$, dan terendah $0{,}7$ m. Garis tengahnya $\frac{2{,}9+0{,}7}{2}=1{,}8$ m, amplitudonya $1{,}1$ m, periodenya $15{,}4-3=12{,}4$ jam, jadi $y=1{,}1\cos\left(\frac{2\pi}{12{,}4}(t-3)\right)+1{,}8$.`,
  ),
})

/** Two close frequencies: beats. */
const FIG_BEATS: ArticleBlock = fig({
  xSpan: [-30, 390],
  ySpan: [-2.6, 2.6],
  aspect: 2.6,
  items: [
    { t: 'seg', from: [-20, 0], to: [380, 0], color: 'muted' },
    { t: 'curve', f: `2*cos(0.5*${D})`, from: 0, to: 360, color: 'result', dashed: true },
    { t: 'curve', f: `-2*cos(0.5*${D})`, from: 0, to: 360, color: 'result', dashed: true },
    { t: 'curve', f: `sin(10*${D})+sin(11*${D})`, from: 0, to: 360, color: 'a' },
  ],
  caption: L(
    T`The sum $\sin10x+\sin11x$ over $0^\circ$ to $360^\circ$ (solid) is a fast wave whose height swells and fades inside the envelope $\pm2\cos\frac{x}{2}$ (dashed): $\sin10x+\sin11x=2\cos\frac{x}{2}\,\sin10.5x$. The loudness of two close notes does this, and the swelling is called a beat.`,
    T`Jumlah $\sin10x+\sin11x$ pada $0^\circ$ sampai $360^\circ$ (garis penuh) adalah gelombang cepat yang tingginya membesar dan mengecil di dalam selubung $\pm2\cos\frac{x}{2}$ (garis putus-putus): $\sin10x+\sin11x=2\cos\frac{x}{2}\,\sin10{,}5x$. Kerasnya dua nada berdekatan berbuat begini, dan pembesaran itu disebut layangan.`,
  ),
})

/** The monthly temperatures and the best wave of period 12. */
const TEMP = DATASETS.find((d) => d.id === 'temperature')!
const FIT = fitSinusoid(TEMP.xs.map((x, i): [number, number] => [x, TEMP.ys[i]]), TEMP.period)!
const r4 = (x: number): string => String(Math.round(x * 1e4) / 1e4)
const FIG_FIT: ArticleBlock = fig({
  xSpan: [-0.5, 13.5],
  ySpan: [-2, 27],
  aspect: 2,
  items: [
    { t: 'seg', from: [0, 0], to: [13, 0], color: 'muted' },
    { t: 'hline', y: FIT.D, color: 'c', dashed: true },
    { t: 'curve', f: `${r4(FIT.graph.d)}+${r4(FIT.graph.a)}*sin(2*pi/12*(x-${r4(FIT.graph.c)}))`, from: 0.3, to: 12.7, color: 'a' },
    ...TEMP.xs.map((x, i): FigItem => ({ t: 'dot', x, y: TEMP.ys[i], color: 'result' })),
    ...[1, 4, 7, 10].map((x): FigItem => ({ t: 'text', at: [x, -1.2], text: String(x), size: 'sm', color: 'muted' })),
  ],
  caption: L(
    T`Twelve monthly mean temperatures (illustrative, in $^\circ$C) and the least-squares wave of period $12$ months through them: $y\approx${r4(FIT.graph.a)}\sin\left(\frac{2\pi}{12}(x-${r4(FIT.graph.c)})\right)+${r4(FIT.graph.d)}$, with $R^2\approx${r4(FIT.r2)}$. The dashed line is the mean level.`,
    T`Dua belas suhu rata-rata bulanan (ilustrasi, dalam $^\circ$C) dan gelombang kuadrat terkecil berperiode $12$ bulan yang melalui titik-titiknya: $y\approx${r4(FIT.graph.a).replace('.', '{,}')}\sin\left(\frac{2\pi}{12}(x-${r4(FIT.graph.c).replace('.', '{,}')})\right)+${r4(FIT.graph.d).replace('.', '{,}')}$, dengan $R^2\approx${r4(FIT.r2).replace('.', '{,}')}$. Garis putus-putus adalah tingkat rata-rata.`,
  ),
})

/** The table of the six parent graphs, printed from the same data the checker tested. */
const FN_TEX: Record<GFn, string> = { sin: '\\sin x', cos: '\\cos x', tan: '\\tan x', csc: '\\csc x', sec: '\\sec x', cot: '\\cot x' }
const factsTable = (lang: 'en' | 'id'): string => {
  const w = lang === 'en' ? { head: '| Function | Period | Domain | Range | Zeros | Asymptotes |', all: 'all real numbers', none: 'none', or: 'or' } : { head: '| Fungsi | Periode | Daerah asal | Daerah hasil | Nol | Asimtot |', all: 'semua bilangan real', none: 'tidak ada', or: 'atau' }
  const rows = GFNS.map((fn) => {
    const f = FACTS[fn]
    const period = `$${f.period}^\\circ$ ($${radTex(f.period)}$)`
    const domain = f.poles ? `$x\\ne ${setTex(f.poles)}$` : w.all
    const range = f.range === 'band' ? '$-1\\le y\\le1$' : f.range === 'outside' ? `$y\\le-1$ ${w.or} $y\\ge1$` : w.all
    const zeros = f.zeros ? `$x=${setTex(f.zeros)}$` : w.none
    const poles = f.poles ? `$x=${setTex(f.poles)}$` : w.none
    return `| $y=${FN_TEX[fn]}$ | ${period} | ${domain} | ${range} | ${zeros} | ${poles} |`
  })
  return `${w.head}\n|---|---|---|---|---|---|\n${rows.join('\n')}`
}

export const body: ArticleBody = {
  answer: L(
    T`**Each trigonometric function has a graph read off the unit circle: sine and cosine are waves between $-1$ and $1$ that repeat every $360^\circ$, tangent and cotangent repeat every $180^\circ$ with vertical asymptotes, and secant and cosecant are U-shaped branches that never lie between $-1$ and $1$.** The equation $y=a\,f(b(x-c))+d$ stretches the graph by $a$, divides the period by $b$, shifts it right by $c$ and up by $d$, and a sketch needs only the period, the shift and five key points.`,
    T`**Keenam fungsi trigonometri memiliki grafik yang dibaca dari lingkaran satuan: sinus dan kosinus adalah gelombang di antara $-1$ dan $1$ yang berulang setiap $360^\circ$, tangen dan kotangen berulang setiap $180^\circ$ dengan asimtot tegak, dan sekan serta kosekan adalah cabang berbentuk U yang tak pernah berada di antara $-1$ dan $1$.** Persamaan $y=a\,f(b(x-c))+d$ meregangkan grafik dengan $a$, membagi periode dengan $b$, menggesernya ke kanan sejauh $c$ dan ke atas sejauh $d$, dan sketsa hanya memerlukan periode, pergeseran, dan lima titik yang berjarak seperempat periode.`,
  ),

  keyPoints: [
    L(
      T`All six graphs come from one picture, the unit circle: the point at the angle $\theta$ gives $\sin\theta$ and $\cos\theta$, and the ray through it cuts the lines $x=1$ and $y=1$ at lengths $\tan\theta$, $\sec\theta$, $\cot\theta$ and $\csc\theta$. The asymptotes appear where the ray is parallel to one of those lines.`,
      T`Keenam grafik berasal dari satu gambar, lingkaran satuan: titik pada sudut $\theta$ memberi $\sin\theta$ dan $\cos\theta$, dan sinar melaluinya memotong garis $x=1$ dan $y=1$ pada panjang $\tan\theta$, $\sec\theta$, $\cot\theta$, dan $\csc\theta$. Asimtot muncul di tempat sinar sejajar dengan salah satu garis itu.`,
    ),
    L(
      T`The tangent has vertical asymptotes at $x=90^\circ+180^\circ n$, where $\cos x=0$, and repeats every $180^\circ$, not $360^\circ$, because half a turn changes the signs of the sine and the cosine together. It has no amplitude: its range is every real number.`,
      T`Tangen memiliki asimtot tegak di $x=90^\circ+180^\circ n$, tempat $\cos x=0$, dan berulang setiap $180^\circ$, bukan $360^\circ$, karena setengah putaran mengubah tanda sinus dan kosinus bersamaan. Ia tak punya amplitudo: daerah hasilnya semua bilangan real.`,
    ),
    L(
      T`Secant, cosecant and cotangent are drawn from the cosine, sine and tangent by taking reciprocals: an asymptote wherever the base is $0$, a tip wherever the base is $1$ or $-1$, and values that never fall between $-1$ and $1$ for secant and cosecant.`,
      T`Sekan, kosekan, dan kotangen digambar dari kosinus, sinus, dan tangen dengan mengambil kebalikan: asimtot di mana pun dasarnya $0$, ujung di mana pun dasarnya $1$ atau $-1$, dan nilai yang tak pernah jatuh di antara $-1$ dan $1$ untuk sekan dan kosekan.`,
    ),
    L(
      T`In $y=a\,f(b(x-c))+d$ the period is the parent period divided by $|b|$, the shift is $c$, and $d$ lifts the graph. If the equation is written $y=a\,f(bx-B)+d$, the shift is $\frac{B}{b}$, not $B$: the most common error with these graphs.`,
      T`Pada $y=a\,f(b(x-c))+d$ periodenya adalah periode induk dibagi $|b|$, pergeserannya $c$, dan $d$ mengangkat grafik. Bila persamaan ditulis $y=a\,f(bx-B)+d$, pergeserannya $\frac{B}{b}$, bukan $B$: kesalahan paling umum pada grafik ini.`,
    ),
    L(
      T`A wave is read from its picture in three numbers: $d=\frac{\max+\min}{2}$, $a=\frac{\max-\min}{2}$, and the period $P$ from two successive peaks, with $b=\frac{360^\circ}{P}$; a cosine is then shifted by the $x$ of a peak, and a sine by a quarter of a period less.`,
      T`Gelombang dibaca dari gambarnya dalam tiga bilangan: $d=\frac{\text{maks}+\text{min}}{2}$, $a=\frac{\text{maks}-\text{min}}{2}$, dan periode $P$ dari dua puncak berurutan, dengan $b=\frac{360^\circ}{P}$; kosinus lalu digeser sebesar $x$ sebuah puncak, dan sinus seperempat periode lebih sedikit.`,
    ),
    L(
      T`Two waves of the same frequency add up to one wave; waves of different frequencies add up to a wave that is not a sine, repeating every $\frac{360^\circ}{\gcd}$ if the frequencies are whole numbers and never if their ratio is irrational. A sine wave of known period is fitted to measurements by least squares, which is a linear problem in $\sin$, $\cos$ and a constant.`,
      T`Dua gelombang berfrekuensi sama menjumlah menjadi satu gelombang; gelombang berfrekuensi berbeda menjumlah menjadi gelombang yang bukan sinus, berulang setiap $\frac{360^\circ}{\text{fpb}}$ bila frekuensinya bilangan bulat dan tak pernah bila perbandingannya irasional. Gelombang sinus berperiode diketahui dicocokkan dengan pengukuran lewat kuadrat terkecil, yang merupakan masalah linear dalam $\sin$, $\cos$, dan sebuah konstanta.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------------------- from the circle */
    {
      id: 'from-the-circle',
      heading: L('How does the unit circle give the graphs of all six trigonometric functions?', 'Bagaimana lingkaran satuan memberi grafik keenam fungsi trigonometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**On the unit circle all six functions of an angle $\theta$ are lengths you can see: sine and cosine are the height and the width of the point, the tangent is the height at which the ray through the point meets the line $x=1$, and the cotangent is the distance at which it meets the line $y=1$.** Put the point $P$ at the angle $\theta$ on the circle of radius $1$ (see [the unit circle](article:basic-trigonometry#unit-circle)). Extend the ray from the centre through $P$ until it meets the vertical line $x=1$. By similar triangles the height of the meeting point is $\frac{\sin\theta}{\cos\theta}=\tan\theta$, and the length of the ray up to it is $\frac{1}{\cos\theta}=\sec\theta$. Do the same with the horizontal line $y=1$: the meeting point is at $x=\cot\theta$ and the ray has length $\csc\theta$.

A graph is what you get by letting $\theta$ turn and plotting one of these lengths against the angle. Because all six come from one picture, their features can be read from it. The ray is parallel to the line $x=1$ when $\theta=90^\circ$, so it never meets it, and $\tan\theta$ and $\sec\theta$ do not exist there. The ray is parallel to the line $y=1$ when $\theta=0^\circ$ and $180^\circ$, and $\cot\theta$ and $\csc\theta$ do not exist. Those gaps are the **vertical asymptotes**. The sine and the cosine are shadows of a segment of length $1$, so they never exceed $1$, but the lines $x=1$ and $y=1$ are infinitely long, so the tangent and the cotangent can be any number.`,
            T`**Pada lingkaran satuan keenam fungsi sebuah sudut $\theta$ adalah panjang yang dapat dilihat: sinus dan kosinus adalah tinggi dan lebar titik, tangen adalah tinggi tempat sinar melalui titik itu memotong garis $x=1$, dan kotangen adalah jarak tempat ia memotong garis $y=1$.** Letakkan titik $P$ pada sudut $\theta$ di lingkaran berjari-jari $1$ (lihat [lingkaran satuan](article:basic-trigonometry#unit-circle)). Perpanjang sinar dari pusat melalui $P$ sampai memotong garis tegak $x=1$. Dengan segitiga sebangun tinggi titik potongnya $\frac{\sin\theta}{\cos\theta}=\tan\theta$, dan panjang sinar sampai ke sana $\frac{1}{\cos\theta}=\sec\theta$. Lakukan hal yang sama dengan garis mendatar $y=1$: titik potongnya di $x=\cot\theta$ dan sinar itu panjangnya $\csc\theta$.

Grafik adalah apa yang diperoleh dengan memutar $\theta$ dan menggambar salah satu panjang itu terhadap sudutnya. Karena keenamnya berasal dari satu gambar, ciri-cirinya dapat dibaca darinya. Sinar sejajar dengan garis $x=1$ ketika $\theta=90^\circ$, sehingga tak pernah memotongnya, dan $\tan\theta$ serta $\sec\theta$ tidak ada di sana. Sinar sejajar dengan garis $y=1$ ketika $\theta=0^\circ$ dan $180^\circ$, dan $\cot\theta$ serta $\csc\theta$ tidak ada. Celah-celah itu adalah **asimtot tegak**. Sinus dan kosinus adalah bayangan ruas sepanjang $1$, sehingga tak pernah melebihi $1$, tetapi garis $x=1$ dan $y=1$ panjangnya tak berhingga, sehingga tangen dan kotangen dapat bernilai berapa pun.`,
          ),
        },
        FIG_CIRCLE,
      ],
    },

    /* ----------------------------------------------------------------------------------- tangent */
    {
      id: 'tangent',
      heading: L('Why does the tangent graph have vertical asymptotes and repeat every 180°?', 'Mengapa grafik tangen memiliki asimtot tegak dan berulang setiap 180°?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The graph of $y=\tan x$ has a vertical asymptote at every $x=90^\circ+180^\circ n$, because $\tan x=\frac{\sin x}{\cos x}$ and the cosine is zero there; between two asymptotes it rises from far below to far above, and the whole picture repeats every $180^\circ$.** Follow one branch, from $-90^\circ$ to $90^\circ$. At $0^\circ$ the sine is $0$, so $\tan0^\circ=0$. As $x$ grows towards $90^\circ$ the sine approaches $1$ and the cosine approaches $0$ from the positive side, so the quotient grows without limit: the graph shoots up along the asymptote. Just after $90^\circ$ the cosine is a small negative number while the sine is still near $1$, so the tangent comes in from far below, passes through $0$ at $180^\circ$, and the next branch begins.

The period is $180^\circ$ and not $360^\circ$ because half a turn sends the point $(\cos x,\sin x)$ to $(-\cos x,-\sin x)$: both signs change and the quotient does not notice, $\tan(x+180^\circ)=\tan x$. The other facts follow from the quotient. $\tan45^\circ=1$, since the sine and cosine are equal. $\tan(-x)=-\tan x$, so the graph is unchanged by a half turn about the origin. The tangent never has a highest or lowest point and rises on every branch, so its range is all real numbers and it has no amplitude. Its slope at $0$ is $1$ when $x$ is in radians, which is why $\tan x\approx x$ for small angles (the derivative is $\sec^2x$, see [the derivatives of the other four functions](article:derivatives-of-trigonometric-functions#other-four)). In radians the asymptotes are at $\frac{\pi}{2}+\pi n$ and the period is $\pi$.`,
            T`**Grafik $y=\tan x$ memiliki asimtot tegak di setiap $x=90^\circ+180^\circ n$, karena $\tan x=\frac{\sin x}{\cos x}$ dan kosinus bernilai nol di sana; di antara dua asimtot ia naik dari jauh di bawah ke jauh di atas, dan seluruh gambarnya berulang setiap $180^\circ$.** Ikuti satu cabang, dari $-90^\circ$ sampai $90^\circ$. Pada $0^\circ$ sinusnya $0$, sehingga $\tan0^\circ=0$. Ketika $x$ membesar menuju $90^\circ$ sinus mendekati $1$ dan kosinus mendekati $0$ dari sisi positif, sehingga hasil bagi membesar tanpa batas: grafik melesat naik sepanjang asimtot. Tepat setelah $90^\circ$ kosinus adalah bilangan negatif kecil sementara sinus masih dekat $1$, sehingga tangen datang dari jauh di bawah, melewati $0$ pada $180^\circ$, dan cabang berikutnya dimulai.

Periodenya $180^\circ$ dan bukan $360^\circ$ karena setengah putaran mengirim titik $(\cos x,\sin x)$ ke $(-\cos x,-\sin x)$: kedua tanda berubah dan hasil bagi tidak terpengaruh, $\tan(x+180^\circ)=\tan x$. Fakta lain mengikuti dari hasil bagi itu. $\tan45^\circ=1$, karena sinus dan kosinusnya sama. $\tan(-x)=-\tan x$, sehingga grafik tidak berubah oleh setengah putaran terhadap titik asal. Tangen tak pernah memiliki titik tertinggi atau terendah dan naik pada setiap cabang, sehingga daerah hasilnya semua bilangan real dan ia tak punya amplitudo. Gradiennya di $0$ adalah $1$ bila $x$ dalam radian, itulah sebabnya $\tan x\approx x$ untuk sudut kecil (turunannya $\sec^2x$, lihat [turunan keempat fungsi lainnya](article:derivatives-of-trigonometric-functions#other-four)). Dalam radian asimtotnya di $\frac{\pi}{2}+\pi n$ dan periodenya $\pi$.`,
          ),
        },
        FIG_TAN,
      ],
    },

    /* --------------------------------------------------------------------------------- reciprocals */
    {
      id: 'reciprocal',
      heading: L('How do you draw secant, cosecant and cotangent from cosine, sine and tangent?', 'Bagaimana menggambar sekan, kosekan, dan kotangen dari kosinus, sinus, dan tangen?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To draw the secant, cosecant or cotangent, draw the cosine, sine or tangent faintly first and take reciprocals: an asymptote wherever the base function is $0$, a tip wherever it is $1$ or $-1$, and in between a curve that is far from the axis, because $\frac{1}{y}$ is large when $y$ is small.** For the secant, with $\sec x=\frac{1}{\cos x}$:

1. Sketch $y=\cos x$ lightly.
2. Draw a dashed vertical asymptote at every zero of the cosine: $90^\circ$, $270^\circ$, and so on.
3. Mark the points where the cosine is $1$ or $-1$ (its peaks and troughs). The secant has the same value there: $(0^\circ,1)$, $(180^\circ,-1)$, $(360^\circ,1)$.
4. From each of these points draw a U-shaped branch that runs away from the axis towards the two nearest asymptotes: opening upwards where the cosine is positive and downwards where it is negative.
5. Check: the secant has the same sign as the cosine, and it never takes a value between $-1$ and $1$.

The cosecant is the same with the sine: asymptotes at $0^\circ$, $180^\circ$, $360^\circ$, tips at $(90^\circ,1)$ and $(270^\circ,-1)$. The cotangent is $\frac{1}{\tan x}=\frac{\cos x}{\sin x}$: asymptotes where the tangent is $0$ (at $180^\circ n$), zeros where the tangent is undefined ($90^\circ+180^\circ n$), and it falls from far above to far below on every branch. It is the tangent reflected and shifted: $\cot x=-\tan(x-90^\circ)$.`,
            T`**Untuk menggambar sekan, kosekan, atau kotangen, gambar dulu kosinus, sinus, atau tangen secara samar lalu ambil kebalikannya: asimtot di mana pun fungsi dasarnya $0$, ujung di mana pun ia $1$ atau $-1$, dan di antaranya kurva yang jauh dari sumbu, karena $\frac{1}{y}$ besar bila $y$ kecil.** Untuk sekan, dengan $\sec x=\frac{1}{\cos x}$:

1. Sketsa $y=\cos x$ dengan samar.
2. Gambar asimtot tegak putus-putus di setiap nol kosinus: $90^\circ$, $270^\circ$, dan seterusnya.
3. Tandai titik tempat kosinus bernilai $1$ atau $-1$ (puncak dan lembahnya). Sekan bernilai sama di sana: $(0^\circ,1)$, $(180^\circ,-1)$, $(360^\circ,1)$.
4. Dari tiap titik itu gambar cabang berbentuk U yang menjauh dari sumbu menuju dua asimtot terdekat: membuka ke atas di tempat kosinus positif dan ke bawah di tempat kosinus negatif.
5. Periksa: sekan bertanda sama dengan kosinus, dan tak pernah bernilai di antara $-1$ dan $1$.

Kosekan sama dengan memakai sinus: asimtot di $0^\circ$, $180^\circ$, $360^\circ$, ujung di $(90^\circ,1)$ dan $(270^\circ,-1)$. Kotangen adalah $\frac{1}{\tan x}=\frac{\cos x}{\sin x}$: asimtot di tempat tangen $0$ (di $180^\circ n$), nol di tempat tangen tak terdefinisi ($90^\circ+180^\circ n$), dan ia turun dari jauh di atas ke jauh di bawah pada setiap cabang. Ia adalah tangen yang dicerminkan dan digeser: $\cot x=-\tan(x-90^\circ)$.`,
          ),
        },
        FIG_SEC,
      ],
    },

    /* ------------------------------------------------------------------------------- properties */
    {
      id: 'properties',
      heading: L('What are the period, domain, range and symmetry of each of the six graphs?', 'Apa periode, daerah asal, daerah hasil, dan simetri tiap keenam grafik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The six graphs differ in four things you can read from the table: the period ($360^\circ$ for sine, cosine, secant and cosecant and $180^\circ$ for tangent and cotangent), the places where the function does not exist, the range, and where it is zero.** In the table $n$ is any whole number; the radian values of the periods are in brackets. Printed from the same data the checker compared with a scan of the graphs.

${factsTable('en')}

**Symmetry.** Cosine and secant are *even*: $\cos(-x)=\cos x$, so the graph is its own mirror image in the $y$-axis. Sine, tangent, cosecant and cotangent are *odd*: $f(-x)=-f(x)$, so a half turn about the origin leaves the graph unchanged. Pick a function below, move the point along its graph, and read all of this in degrees or in radians.`,
            T`**Keenam grafik berbeda dalam empat hal yang dapat dibaca dari tabel: periode ($360^\circ$ untuk sinus, kosinus, sekan, dan kosekan dan $180^\circ$ untuk tangen dan kotangen), tempat fungsi tidak ada, daerah hasil, dan tempat fungsi bernilai nol.** Dalam tabel $n$ adalah bilangan bulat apa saja; nilai radian periode ada di dalam tanda kurung. Dicetak dari data yang sama yang dibandingkan pengecek dengan pemindaian grafik.

${factsTable('id')}

**Simetri.** Kosinus dan sekan *genap*: $\cos(-x)=\cos x$, sehingga grafik adalah bayangan cerminnya sendiri terhadap sumbu-$y$. Sinus, tangen, kosekan, dan kotangen *ganjil*: $f(-x)=-f(x)$, sehingga setengah putaran terhadap titik asal tidak mengubah grafik. Pilih sebuah fungsi di bawah, geser titik di sepanjang grafiknya, dan baca semuanya dalam derajat atau radian.`,
          ),
        },
        { kind: 'widget', name: 'gfsix' },
      ],
    },

    /* -------------------------------------------------------------------------- transformations */
    {
      id: 'transformations',
      heading: L('How do a, b, c and d change the graph of any trigonometric function?', 'Bagaimana a, b, c, dan d mengubah grafik fungsi trigonometri apa pun?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Any of the six graphs can be stretched and moved with $y=a\,f(b(x-c))+d$: $a$ stretches it vertically (and flips it if $a$ is negative), $b$ squeezes it horizontally so that the period is the parent's period divided by $|b|$, $c$ moves it to the right by $c$, and $d$ lifts it by $d$.** The four numbers act on different things, so they can be read off one at a time:

- **$a$, vertical stretch.** For a sine or cosine, $|a|$ is the *amplitude*, the distance from the midline to a peak. Tangent, cotangent, secant and cosecant have no amplitude (they are unbounded or have no peaks); $a$ stretches them, and for the secant and cosecant the tips of the U-shapes are at $d\pm|a|$.
- **$b$, horizontal squeeze.** The period is $\frac{360^\circ}{|b|}$ for sine, cosine, secant and cosecant and $\frac{180^\circ}{|b|}$ for tangent and cotangent (in radians $\frac{2\pi}{|b|}$ and $\frac{\pi}{|b|}$). The asymptotes of a tangent are $\frac{180^\circ}{|b|}$ apart. A negative $b$ mirrors the graph in the $y$-axis; use $\sin(-u)=-\sin u$ and $\cos(-u)=\cos u$ to make $b$ positive first.
- **$c$, shift.** The graph moves right by $c$ (left if $c$ is negative): every special point of the parent, at $u=b(x-c)$, moves to $x=c+\frac{u}{b}$. The asymptotes of a tangent are at $x=c+\frac{90^\circ+180^\circ n}{b}$.
- **$d$, lift.** The whole graph moves up by $d$; the midline of a wave is $y=d$. The vertical asymptotes do not move.

**Bx minus B.** Equations are often written $y=a\,f(bx-B)+d$. Factor out $b$: $bx-B=b\left(x-\frac{B}{b}\right)$, so the shift is $\frac{B}{b}$, not $B$. For $y=\sin(2x-60^\circ)$ the graph moves $30^\circ$ to the right, not $60^\circ$. For example $y=\tan2x$ has period $90^\circ$ and asymptotes at $\pm45^\circ$, $\pm135^\circ$, and $y=2\cos\frac{x}{2}-1$ has amplitude $2$, midline $y=-1$ and period $720^\circ$. Try all four numbers on any of the six functions below.`,
            T`**Setiap keenam grafik dapat diregangkan dan digeser dengan $y=a\,f(b(x-c))+d$: $a$ meregangkannya secara vertikal (dan membaliknya bila $a$ negatif), $b$ merapatkannya secara horizontal sehingga periodenya adalah periode induk dibagi $|b|$, $c$ menggesernya ke kanan sejauh $c$, dan $d$ mengangkatnya sejauh $d$.** Keempat bilangan itu bekerja pada hal yang berbeda, sehingga dapat dibaca satu per satu:

- **$a$, regangan vertikal.** Untuk sinus atau kosinus, $|a|$ adalah *amplitudo*, jarak dari garis tengah ke puncak. Tangen, kotangen, sekan, dan kosekan tak punya amplitudo (tak terbatas atau tak punya puncak); $a$ meregangkannya, dan untuk sekan dan kosekan ujung bentuk U ada di $d\pm|a|$.
- **$b$, perapatan horizontal.** Periodenya $\frac{360^\circ}{|b|}$ untuk sinus, kosinus, sekan, dan kosekan dan $\frac{180^\circ}{|b|}$ untuk tangen dan kotangen (dalam radian $\frac{2\pi}{|b|}$ dan $\frac{\pi}{|b|}$). Asimtot tangen berjarak $\frac{180^\circ}{|b|}$. $b$ negatif mencerminkan grafik terhadap sumbu-$y$; pakai $\sin(-u)=-\sin u$ dan $\cos(-u)=\cos u$ untuk membuat $b$ positif lebih dulu.
- **$c$, pergeseran.** Grafik bergeser ke kanan sejauh $c$ (ke kiri bila $c$ negatif): setiap titik istimewa induk, di $u=b(x-c)$, pindah ke $x=c+\frac{u}{b}$. Asimtot tangen ada di $x=c+\frac{90^\circ+180^\circ n}{b}$.
- **$d$, pengangkatan.** Seluruh grafik naik sejauh $d$; garis tengah gelombang adalah $y=d$. Asimtot tegak tidak bergerak.

**Bentuk bx dikurangi B.** Persamaan sering ditulis $y=a\,f(bx-B)+d$. Keluarkan $b$: $bx-B=b\left(x-\frac{B}{b}\right)$, jadi pergeserannya $\frac{B}{b}$, bukan $B$. Untuk $y=\sin(2x-60^\circ)$ grafik bergeser $30^\circ$ ke kanan, bukan $60^\circ$. Misalnya $y=\tan2x$ berperiode $90^\circ$ dan berasimtot di $\pm45^\circ$, $\pm135^\circ$, dan $y=2\cos\frac{x}{2}-1$ beramplitudo $2$, bergaris tengah $y=-1$, dan berperiode $720^\circ$. Coba keempat bilangan pada salah satu dari keenam fungsi di bawah.`,
          ),
        },
        { kind: 'widget', name: 'gftrans' },
      ],
    },

    /* ------------------------------------------------------------------------------- sketching */
    {
      id: 'sketching',
      heading: L('How do you sketch y = a sin(bx − B) + d by hand, and a tangent too?', 'Bagaimana membuat sketsa y = a sin(bx − B) + d dengan tangan, dan tangen juga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To sketch a sine or cosine graph, find the period and the start of one cycle, mark five points a quarter of a period apart, give them the heights midline, peak, midline, trough, midline, and join them with a smooth wave.** For $y=a\sin(bx-B)+d$:

1. **Period.** $P=\frac{360^\circ}{b}$.
2. **Start.** The cycle starts where $bx-B=0$, so at $x=\frac{B}{b}$.
3. **Five points.** $x=\frac{B}{b},\ \frac{B}{b}+\frac{P}{4},\ \frac{B}{b}+\frac{P}{2},\ \frac{B}{b}+\frac{3P}{4},\ \frac{B}{b}+P$.
4. **Heights.** For a positive $a$ and a sine: $d,\ d+a,\ d,\ d-a,\ d$. (A cosine starts at the peak: $d+a,\ d,\ d-a,\ d,\ d+a$. A negative $a$ swaps peak and trough.)
5. **Join** the points with a smooth curve, flat at the peaks and troughs and steepest at the midline, and repeat the cycle in both directions.

**Example.** $y=3\sin(2x-60^\circ)+1$. The period is $\frac{360^\circ}{2}=180^\circ$, the cycle starts at $x=\frac{60^\circ}{2}=30^\circ$, the quarter points are $30^\circ,\ 75^\circ,\ 120^\circ,\ 165^\circ,\ 210^\circ$ and the heights are $1,\ 4,\ 1,\ -2,\ 1$.`,
            T`**Untuk membuat sketsa grafik sinus atau kosinus, cari periode dan awal satu siklus, tandai lima titik yang berjarak seperempat periode, beri tinggi garis tengah, puncak, garis tengah, lembah, garis tengah, lalu hubungkan dengan gelombang mulus.** Untuk $y=a\sin(bx-B)+d$:

1. **Periode.** $P=\frac{360^\circ}{b}$.
2. **Awal.** Siklus dimulai di tempat $bx-B=0$, yaitu di $x=\frac{B}{b}$.
3. **Lima titik.** $x=\frac{B}{b},\ \frac{B}{b}+\frac{P}{4},\ \frac{B}{b}+\frac{P}{2},\ \frac{B}{b}+\frac{3P}{4},\ \frac{B}{b}+P$.
4. **Tinggi.** Untuk $a$ positif dan sinus: $d,\ d+a,\ d,\ d-a,\ d$. (Kosinus dimulai dari puncak: $d+a,\ d,\ d-a,\ d,\ d+a$. $a$ negatif menukar puncak dan lembah.)
5. **Hubungkan** titik-titik itu dengan kurva mulus, mendatar di puncak dan lembah dan paling curam di garis tengah, lalu ulangi siklusnya ke dua arah.

**Contoh.** $y=3\sin(2x-60^\circ)+1$. Periodenya $\frac{360^\circ}{2}=180^\circ$, siklus dimulai di $x=\frac{60^\circ}{2}=30^\circ$, titik seperempatnya $30^\circ,\ 75^\circ,\ 120^\circ,\ 165^\circ,\ 210^\circ$ dan tingginya $1,\ 4,\ 1,\ -2,\ 1$.`,
          ),
        },
        FIG_SKETCH,
        {
          kind: 'text',
          text: L(
            T`**A tangent is sketched from its asymptotes and three points.** For $y=a\tan(b(x-c))+d$ the period is $\frac{180^\circ}{|b|}$; put two neighbouring asymptotes at $x=c\pm\frac{90^\circ}{b}$, the graph crosses the line $y=d$ halfway between them at $x=c$, and a quarter of the way in from each asymptote, at $x=c\pm\frac{45^\circ}{b}$, it is at $y=d\pm a$ (because $\tan45^\circ=1$). Then draw the branch through these three points rising towards both asymptotes, and repeat it. For $y=2\tan\frac{x}{2}$: the period is $360^\circ$, the asymptotes are at $\pm180^\circ$, the crossing is at the origin and the points $(\pm90^\circ,\pm2)$ guide the curve.`,
            T`**Tangen dibuat sketsanya dari asimtot dan tiga titik.** Untuk $y=a\tan(b(x-c))+d$ periodenya $\frac{180^\circ}{|b|}$; letakkan dua asimtot bersebelahan di $x=c\pm\frac{90^\circ}{b}$, grafik memotong garis $y=d$ di tengah-tengah keduanya pada $x=c$, dan pada seperempat jalan dari tiap asimtot, di $x=c\pm\frac{45^\circ}{b}$, ia berada di $y=d\pm a$ (karena $\tan45^\circ=1$). Lalu gambar cabang melalui ketiga titik itu yang naik menuju kedua asimtot, dan ulangi. Untuk $y=2\tan\frac{x}{2}$: periodenya $360^\circ$, asimtotnya di $\pm180^\circ$, perpotongannya di titik asal dan titik $(\pm90^\circ,\pm2)$ memandu kurvanya.`,
          ),
        },
        FIG_SKETCH_TAN,
      ],
    },

    /* ---------------------------------------------------------------------------- reading a graph */
    {
      id: 'reading-a-graph',
      heading: L('How do you find the equation of a trigonometric graph from its picture?', 'Bagaimana mencari persamaan sebuah grafik trigonometri dari gambarnya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To write the equation of a sine or cosine graph, read the midline and the amplitude from its highest and lowest values, the period from two successive peaks, and the shift from the position of a peak.**

1. **Midline and amplitude.** $d=\frac{\max+\min}{2}$ and $a=\frac{\max-\min}{2}$.
2. **Period.** $P$ is the distance between two successive peaks (or twice the distance from a peak to the next trough). Then $b=\frac{360^\circ}{P}$, or $\frac{2\pi}{P}$ when $x$ is a time and the argument is in radians.
3. **Shift.** Choose the cosine and let $c$ be the $x$ of a peak, since $\cos0=1$. Or choose the sine and let $c$ be the $x$ of a peak minus $\frac{P}{4}$.
4. **Check** the equation at one more point.

**A tide.** In the picture the water is highest, $2.9$ m, at $3$ h and at $15.4$ h, and lowest, $0.7$ m. Then $d=1.8$, $a=1.1$, $P=15.4-3=12.4$ h and $y=1.1\cos\left(\frac{2\pi}{12.4}(t-3)\right)+1.8$; as a sine it is $y=1.1\sin\left(\frac{2\pi}{12.4}(t+0.1)\right)+1.8$. **The mains.** The PLN supply is called $220$ V, but that is its effective value; the wave reaches $220\sqrt2\approx311$ V. Peaks of $311.1$ V at $5$ ms and troughs at $15$ ms give $P=20$ ms (that is $50$ Hz) and $v=311.1\sin\left(\frac{2\pi}{20}t\right)$ with $t$ in milliseconds. There is never only one right answer: a cosine can be a sine with another shift, adding a whole period to $c$ changes nothing, and a negative $a$ with a shift of half a period gives the same graph.`,
            T`**Untuk menulis persamaan grafik sinus atau kosinus, baca garis tengah dan amplitudo dari nilai tertinggi dan terendahnya, periode dari dua puncak berurutan, dan pergeseran dari letak sebuah puncak.**

1. **Garis tengah dan amplitudo.** $d=\frac{\text{maks}+\text{min}}{2}$ dan $a=\frac{\text{maks}-\text{min}}{2}$.
2. **Periode.** $P$ adalah jarak antara dua puncak berurutan (atau dua kali jarak dari puncak ke lembah berikutnya). Lalu $b=\frac{360^\circ}{P}$, atau $\frac{2\pi}{P}$ bila $x$ adalah waktu dan argumennya dalam radian.
3. **Pergeseran.** Pilih kosinus dan misalkan $c$ adalah $x$ sebuah puncak, karena $\cos0=1$. Atau pilih sinus dan misalkan $c$ adalah $x$ sebuah puncak dikurangi $\frac{P}{4}$.
4. **Periksa** persamaan itu pada satu titik lain.

**Pasang surut.** Pada gambar air tertinggi, $2{,}9$ m, pada jam $3$ dan jam $15{,}4$, dan terendah $0{,}7$ m. Maka $d=1{,}8$, $a=1{,}1$, $P=15{,}4-3=12{,}4$ jam dan $y=1{,}1\cos\left(\frac{2\pi}{12{,}4}(t-3)\right)+1{,}8$; sebagai sinus $y=1{,}1\sin\left(\frac{2\pi}{12{,}4}(t+0{,}1)\right)+1{,}8$. **Listrik PLN.** Pasokan PLN disebut $220$ V, tetapi itu nilai efektifnya; gelombangnya mencapai $220\sqrt2\approx311$ V. Puncak $311{,}1$ V pada $5$ ms dan lembah pada $15$ ms memberi $P=20$ ms (yaitu $50$ Hz) dan $v=311{,}1\sin\left(\frac{2\pi}{20}t\right)$ dengan $t$ dalam milidetik. Tak pernah hanya ada satu jawaban benar: kosinus dapat menjadi sinus dengan pergeseran lain, menambah satu periode penuh pada $c$ tidak mengubah apa-apa, dan $a$ negatif dengan pergeseran setengah periode memberi grafik yang sama.`,
          ),
        },
        FIG_TIDE,
        { kind: 'widget', name: 'gfread' },
      ],
    },

    /* ------------------------------------------------------------------------------ adding waves */
    {
      id: 'adding-waves',
      heading: L('What happens when you add two sine waves, and is the sum still a sine wave?', 'Apa yang terjadi bila dua gelombang sinus dijumlahkan, dan apakah jumlahnya masih gelombang sinus?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Two sine waves of the same frequency add up to one sine wave, but waves of different frequencies add up to a graph that is not a sine wave; it repeats only if the ratio of the frequencies is a ratio of whole numbers.** Write $b$ for the number of cycles in $360^\circ$, so that $\sin bx$ has period $\frac{360^\circ}{b}$.

- **Same frequency.** $A\sin bx+B\cos bx=R\sin(bx+\varphi)$ with $R=\sqrt{A^2+B^2}$, one wave of the same period (see [the single-wave form](article:trigonometric-identities#product-and-sum)). Two waves of amplitudes $A_1$, $A_2$ with a phase difference $\varphi$ give a wave of amplitude $R=\sqrt{A_1^2+A_2^2+2A_1A_2\cos\varphi}$: between $|A_1-A_2|$ (opposite) and $A_1+A_2$ (in step).
- **Whole-number frequencies.** $\sin2x+\sin3x$ repeats when both have finished whole cycles together: the period is $\frac{360^\circ}{\gcd(2,3)}=360^\circ$. For $\sin4x+\sin6x$ it is $\frac{360^\circ}{2}=180^\circ$. The shape is not a sine wave.
- **Irrational ratio.** $\sin x+\sin\sqrt2\,x$ never repeats exactly, because no stretch of $x$ holds a whole number of cycles of both. It comes close to repeating again and again, but it has no period.
- **Close frequencies: beats.** $\sin b_1x+\sin b_2x=2\cos\frac{b_1-b_2}{2}x\,\sin\frac{b_1+b_2}{2}x$ (a product-to-sum formula): a fast wave at the average frequency whose height swells and fades $|b_1-b_2|$ times in $360^\circ$. Two guitar strings at $440$ Hz and $442$ Hz are heard to swell $2$ times a second, and tuning by ear means slowing the beats to nothing.

Choose two frequencies below and see the period of the sum, or the lack of one.`,
            T`**Dua gelombang sinus berfrekuensi sama menjumlah menjadi satu gelombang sinus, tetapi gelombang berfrekuensi berbeda menjumlah menjadi grafik yang bukan gelombang sinus; ia berulang hanya bila perbandingan frekuensinya adalah perbandingan bilangan bulat.** Tulis $b$ untuk banyaknya siklus dalam $360^\circ$, sehingga $\sin bx$ berperiode $\frac{360^\circ}{b}$.

- **Frekuensi sama.** $A\sin bx+B\cos bx=R\sin(bx+\varphi)$ dengan $R=\sqrt{A^2+B^2}$, satu gelombang berperiode sama (lihat [bentuk satu gelombang](article:trigonometric-identities#product-and-sum)). Dua gelombang beramplitudo $A_1$, $A_2$ dengan beda fase $\varphi$ memberi gelombang beramplitudo $R=\sqrt{A_1^2+A_2^2+2A_1A_2\cos\varphi}$: di antara $|A_1-A_2|$ (berlawanan) dan $A_1+A_2$ (searah).
- **Frekuensi bilangan bulat.** $\sin2x+\sin3x$ berulang ketika keduanya telah menyelesaikan siklus utuh bersamaan: periodenya $\frac{360^\circ}{\gcd(2,3)}=360^\circ$. Untuk $\sin4x+\sin6x$ periodenya $\frac{360^\circ}{2}=180^\circ$. Bentuknya bukan gelombang sinus.
- **Perbandingan irasional.** $\sin x+\sin\sqrt2\,x$ tak pernah berulang tepat, karena tak ada bentangan $x$ yang memuat bilangan bulat siklus keduanya. Ia berulang-ulang hampir berulang, tetapi tak punya periode.
- **Frekuensi berdekatan: layangan.** $\sin b_1x+\sin b_2x=2\cos\frac{b_1-b_2}{2}x\,\sin\frac{b_1+b_2}{2}x$ (rumus hasil kali menjadi jumlah): gelombang cepat pada frekuensi rata-rata yang tingginya membesar dan mengecil $|b_1-b_2|$ kali dalam $360^\circ$. Dua senar gitar $440$ Hz dan $442$ Hz terdengar membesar $2$ kali per detik, dan menyetem dengan telinga berarti memperlambat layangan sampai hilang.

Pilih dua frekuensi di bawah dan lihat periode jumlahnya, atau tiadanya periode.`,
          ),
        },
        FIG_BEATS,
        { kind: 'widget', name: 'gfsum' },
      ],
    },

    /* ----------------------------------------------------------------------------------- fitting */
    {
      id: 'fitting',
      heading: L('How do you fit a sine wave to measurements?', 'Bagaimana mencocokkan gelombang sinus dengan pengukuran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To fit a sine wave to measurements, choose the period from what you know about the cause, and then the other numbers come from a linear least-squares problem: $y\approx A\sin bx+B\cos bx+D$ with $b=\frac{360^\circ}{P}$.** The unknown shift would make the problem hard, but the sum formula hides it in the products: $a\sin(b(x-c))=(a\cos bc)\sin bx-(a\sin bc)\cos bx$, so with $A=a\cos bc$ and $B=-a\sin bc$ the equation is linear in $A$, $B$ and $D$. *Least squares* chooses them so that the sum of the squared errors, the vertical distances from each point to the wave, is as small as possible; that is a $3\times3$ linear system. Then
$$a=\sqrt{A^2+B^2},\qquad d=D,\qquad c=-\frac{\operatorname{atan2}(B,A)}{b},$$
and $c$ can be moved into one period by adding the period.

**Example.** Twelve monthly mean temperatures (illustrative) and the period $12$ months give $a\approx9.77\ ^\circ$C, $d\approx13.45\ ^\circ$C, $c\approx4.09$ months, so the warmest point is at $x=c+\frac{P}{4}\approx7.09$, early in the seventh month. The measure of fit is $R^2=1-\frac{\text{squared errors}}{\text{squared spread of the data}}$: here $0.996$, so the wave explains $99.6\%$ of the variation. When the period is not known, try many periods and keep the best $R^2$: a wave of $0.6$ times the right period explains only about $30\%$ of this data. A high $R^2$ says the wave describes these measurements, not that the cause is periodic.`,
            T`**Untuk mencocokkan gelombang sinus dengan pengukuran, pilih periode dari apa yang diketahui tentang penyebabnya, lalu bilangan lainnya berasal dari masalah kuadrat terkecil linear: $y\approx A\sin bx+B\cos bx+D$ dengan $b=\frac{360^\circ}{P}$.** Pergeseran yang tak diketahui akan membuat masalahnya sulit, tetapi rumus jumlah menyembunyikannya dalam hasil kali: $a\sin(b(x-c))=(a\cos bc)\sin bx-(a\sin bc)\cos bx$, sehingga dengan $A=a\cos bc$ dan $B=-a\sin bc$ persamaannya linear dalam $A$, $B$, dan $D$. *Kuadrat terkecil* memilihnya sehingga jumlah kuadrat galat, jarak tegak dari tiap titik ke gelombang, sekecil mungkin; itu sistem linear $3\times3$. Lalu
$$a=\sqrt{A^2+B^2},\qquad d=D,\qquad c=-\frac{\operatorname{atan2}(B,A)}{b},$$
dan $c$ dapat dipindahkan ke satu periode dengan menambahkan periode.

**Contoh.** Dua belas suhu rata-rata bulanan (ilustrasi) dan periode $12$ bulan memberi $a\approx9{,}77\ ^\circ$C, $d\approx13{,}45\ ^\circ$C, $c\approx4{,}09$ bulan, sehingga titik terhangat di $x=c+\frac{P}{4}\approx7{,}09$, awal bulan ketujuh. Ukuran kecocokannya $R^2=1-\frac{\text{kuadrat galat}}{\text{kuadrat sebaran data}}$: di sini $0{,}996$, sehingga gelombang menjelaskan $99{,}6\%$ variasi. Bila periode tidak diketahui, coba banyak periode dan simpan $R^2$ terbaik: gelombang berperiode $0{,}6$ kali periode yang benar hanya menjelaskan sekitar $30\%$ data ini. $R^2$ tinggi mengatakan gelombang menggambarkan pengukuran ini, bukan bahwa penyebabnya periodik.`,
          ),
        },
        FIG_FIT,
        { kind: 'widget', name: 'gffit' },
      ],
    },

    /* ------------------------------------------------------------------------------------ code */
    {
      id: 'graphs-in-code',
      heading: L('How do you draw and fit trigonometric graphs in a program?', 'Bagaimana menggambar dan mencocokkan grafik trigonometri dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program draws a tangent or secant by treating the asymptotes as gaps: it evaluates the function on a grid, writes nothing where the function does not exist or is huge, and starts a new line after every gap.** Three details matter. The cosine of $90^\circ$ is not exactly $0$ on a computer ($6\times10^{-17}$), so test ´abs(cos) < 1e-12´ rather than ´== 0´ and the value $1.6\times10^{16}$ does not appear as a point on the graph. Convert degrees to radians. And never join two points on either side of an asymptote, however close, since the line between them is not part of the graph.

The programs print the tangent near $90^\circ$ (rising to $572.96$ at $89.9^\circ$, then undefined, then falling from $-572.96$) and then fit a wave of period $12$ to the twelve temperatures by solving the three normal equations with Gaussian elimination, printing the amplitude, the shift, the mean level and $R^2$.`,
            T`**Program menggambar tangen atau sekan dengan memperlakukan asimtot sebagai celah: ia menghitung fungsi pada kisi, tidak menulis apa-apa di tempat fungsi tidak ada atau sangat besar, dan memulai garis baru setelah tiap celah.** Tiga hal penting. Kosinus $90^\circ$ tidak tepat $0$ pada komputer ($6\times10^{-17}$), jadi ujilah ´abs(cos) < 1e-12´ alih-alih ´== 0´ dan nilai $1{,}6\times10^{16}$ tidak muncul sebagai titik pada grafik. Ubah derajat ke radian. Dan jangan pernah menghubungkan dua titik di kedua sisi asimtot, sedekat apa pun, karena garis di antaranya bukan bagian grafik.

Program mencetak tangen di dekat $90^\circ$ (naik ke $572{,}96$ pada $89{,}9^\circ$, lalu tak terdefinisi, lalu turun dari $-572{,}96$) dan kemudian mencocokkan gelombang berperiode $12$ dengan dua belas suhu dengan menyelesaikan tiga persamaan normal memakai eliminasi Gauss, mencetak amplitudo, pergeseran, tingkat rata-rata, dan $R^2$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: a tangent with its asymptote, and a least-squares wave', 'Python: tangen dengan asimtotnya, dan gelombang kuadrat terkecil'),
          code: `import math


def tan_deg(x):
    """tan of x degrees, or None where it does not exist (cos x = 0)."""
    c = math.cos(math.radians(x))
    return None if abs(c) < 1e-12 else round(math.sin(math.radians(x)) / c, 2)


print([tan_deg(x) for x in (89, 89.9, 90, 90.1, 91)])   # [57.29, 572.96, None, -572.96, -57.29]


def sinusoid_fit(xs, ys, period):
    """Least squares y ~ A sin(wx) + B cos(wx) + D, w = 2 pi / period; returns a, c, d, r2 for a sin(w (x - c)) + d."""
    w = 2 * math.pi / period
    M = [[0.0] * 3 for _ in range(3)]                    # the normal equations M [A, B, D] = v
    v = [0.0] * 3
    for x, y in zip(xs, ys):
        row = [math.sin(w * x), math.cos(w * x), 1.0]
        for i in range(3):
            v[i] += row[i] * y
            for j in range(3):
                M[i][j] += row[i] * row[j]
    for col in range(3):                                 # Gaussian elimination with a pivot
        piv = max(range(col, 3), key=lambda r: abs(M[r][col]))
        M[col], M[piv] = M[piv], M[col]
        v[col], v[piv] = v[piv], v[col]
        for r in range(col + 1, 3):
            f = M[r][col] / M[col][col]
            for j in range(col, 3):
                M[r][j] -= f * M[col][j]
            v[r] -= f * v[col]
    sol = [0.0] * 3
    for i in (2, 1, 0):
        sol[i] = (v[i] - sum(M[i][j] * sol[j] for j in range(i + 1, 3))) / M[i][i]
    A, B, D = sol
    a = math.hypot(A, B)
    c = (-math.atan2(B, A) / w) % period                 # A sin + B cos = a sin(w (x - c))
    mean = sum(ys) / len(ys)
    res = sum((y - (A * math.sin(w * x) + B * math.cos(w * x) + D)) ** 2 for x, y in zip(xs, ys))
    tot = sum((y - mean) ** 2 for y in ys)
    return a, c, D, 1 - res / tot


months = list(range(1, 13))
temp = [4.1, 5.0, 8.6, 12.9, 17.5, 21.0, 23.4, 22.8, 19.1, 13.9, 8.2, 4.9]
a, c, d, r2 = sinusoid_fit(months, temp, 12)
print(round(a, 2), round(c, 2), round(d, 2), round(r2, 4))   # 9.77 4.09 13.45 0.9959`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same two things', 'JavaScript: dua hal yang sama'),
          code: `const rad = (d) => (d * Math.PI) / 180

function tanDeg(x) {
  // tan of x degrees, or null where it does not exist (cos x = 0)
  const c = Math.cos(rad(x))
  return Math.abs(c) < 1e-12 ? null : +(Math.sin(rad(x)) / c).toFixed(2)
}

;[89, 89.9, 90, 90.1, 91].map(tanDeg)           // [57.29, 572.96, null, -572.96, -57.29]

function sinusoidFit(xs, ys, period) {
  // least squares y ~ A sin(wx) + B cos(wx) + D, w = 2 pi / period; returns [a, c, d, r2] for a sin(w (x - c)) + d
  const w = (2 * Math.PI) / period
  const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]            // the normal equations M [A, B, D] = v
  const v = [0, 0, 0]
  xs.forEach((x, k) => {
    const row = [Math.sin(w * x), Math.cos(w * x), 1]
    for (let i = 0; i < 3; i++) {
      v[i] += row[i] * ys[k]
      for (let j = 0; j < 3; j++) M[i][j] += row[i] * row[j]
    }
  })
  for (let col = 0; col < 3; col++) {                    // Gaussian elimination with a pivot
    let piv = col
    for (let r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r
    ;[M[col], M[piv]] = [M[piv], M[col]]
    ;[v[col], v[piv]] = [v[piv], v[col]]
    for (let r = col + 1; r < 3; r++) {
      const f = M[r][col] / M[col][col]
      for (let j = col; j < 3; j++) M[r][j] -= f * M[col][j]
      v[r] -= f * v[col]
    }
  }
  const sol = [0, 0, 0]
  for (let i = 2; i >= 0; i--) {
    let s = v[i]
    for (let j = i + 1; j < 3; j++) s -= M[i][j] * sol[j]
    sol[i] = s / M[i][i]
  }
  const [A, B, D] = sol
  const a = Math.hypot(A, B)
  const c = (((-Math.atan2(B, A) / w) % period) + period) % period   // A sin + B cos = a sin(w (x - c))
  const mean = ys.reduce((s, y) => s + y, 0) / ys.length
  let res = 0, tot = 0
  xs.forEach((x, k) => {
    res += (ys[k] - (A * Math.sin(w * x) + B * Math.cos(w * x) + D)) ** 2
    tot += (ys[k] - mean) ** 2
  })
  return [a, c, D, 1 - res / tot]
}

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const temp = [4.1, 5.0, 8.6, 12.9, 17.5, 21.0, 23.4, 22.8, 19.1, 13.9, 8.2, 4.9]
const [a, c, d, r2] = sinusoidFit(months, temp, 12)
;[+a.toFixed(2), +c.toFixed(2), +d.toFixed(2), +r2.toFixed(4)]   // [9.77, 4.09, 13.45, 0.9959]`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same two things with <cmath>', 'C++: dua hal yang sama dengan <cmath>'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

const double PI = 3.14159265358979323846;
double xs[12], ys[12];
double M[9], v[3], sol[3];            // the normal equations M [A, B, D] = v

double tanDeg(double x) { return sin(x * PI / 180) / cos(x * PI / 180); }

// the angle of the point (x, y), from -PI to PI, in any quadrant (what atan2 does)
double angleOf(double y, double x) {
  if (x > 0) return atan(y / x);
  if (x < 0) return atan(y / x) + (y >= 0 ? PI : -PI);
  return y >= 0 ? PI / 2 : -PI / 2;
}

int main() {
  double test[5] = {89, 89.9, 90.1, 91, 45};
  for (int i = 0; i < 4; i++) printf("%.2f ", tanDeg(test[i]));
  printf("\\n");

  double temp[12] = {4.1, 5.0, 8.6, 12.9, 17.5, 21.0, 23.4, 22.8, 19.1, 13.9, 8.2, 4.9};
  double period = 12;
  double w = 2 * PI / period;
  for (int i = 0; i < 12; i++) { xs[i] = i + 1; ys[i] = temp[i]; }
  for (int i = 0; i < 9; i++) M[i] = 0;
  for (int i = 0; i < 3; i++) v[i] = 0;
  for (int k = 0; k < 12; k++) {
    double row[3];
    row[0] = sin(w * xs[k]); row[1] = cos(w * xs[k]); row[2] = 1;
    for (int i = 0; i < 3; i++) {
      v[i] += row[i] * ys[k];
      for (int j = 0; j < 3; j++) M[i * 3 + j] += row[i] * row[j];
    }
  }
  for (int col = 0; col < 3; col++) {                  // Gaussian elimination with a pivot
    int piv = col;
    for (int r = col + 1; r < 3; r++) if (fabs(M[r * 3 + col]) > fabs(M[piv * 3 + col])) piv = r;
    for (int j = 0; j < 3; j++) { double t = M[col * 3 + j]; M[col * 3 + j] = M[piv * 3 + j]; M[piv * 3 + j] = t; }
    double t2 = v[col]; v[col] = v[piv]; v[piv] = t2;
    for (int r = col + 1; r < 3; r++) {
      double f = M[r * 3 + col] / M[col * 3 + col];
      for (int j = col; j < 3; j++) M[r * 3 + j] -= f * M[col * 3 + j];
      v[r] -= f * v[col];
    }
  }
  for (int i = 2; i >= 0; i--) {
    double s = v[i];
    for (int j = i + 1; j < 3; j++) s -= M[i * 3 + j] * sol[j];
    sol[i] = s / M[i * 3 + i];
  }
  double A = sol[0], B = sol[1], D = sol[2];
  double a = sqrt(A * A + B * B);
  double c = -angleOf(B, A) / w;
  c = c - period * floor(c / period);                  // into one period
  double mean = 0;
  for (int k = 0; k < 12; k++) mean += ys[k] / 12;
  double res = 0, tot = 0;
  for (int k = 0; k < 12; k++) {
    double fit = A * sin(w * xs[k]) + B * cos(w * xs[k]) + D;
    res += (ys[k] - fit) * (ys[k] - fit);
    tot += (ys[k] - mean) * (ys[k] - mean);
  }
  printf("%.2f %.2f %.2f %.4f\\n", a, c, D, 1 - res / tot);
  return 0;
}

/* output:
57.29 572.96 -572.96 -57.29
9.77 4.09 13.45 0.9959
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do the graphs of the trigonometric functions come from?', 'Dari mana grafik fungsi trigonometri berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Graphs of the trigonometric functions came late: the functions began as lengths in a circle, and only when a quantity was plotted against another did the wave appear.**

- **About 1350.** Nicole Oresme drew a quantity that changes, such as a speed over time, as a line whose height shows its size at each moment, an early forerunner of the graph.
- **1630s.** Roberval drew the sine curve as a companion of the cycloid and found the area under one arch. It is among the first sine waves drawn as a curve.
- **1748.** Euler's *Introductio* treats sine and cosine as functions of a number, with angles in radians, so that $\sin x$ can be graphed against $x$ and differentiated.
- **1822.** Fourier's *Théorie analytique de la chaleur* shows that a periodic function can be written as a sum of sine and cosine waves, which is why adding waves, as in this article, describes sounds, tides and signals.
- **1863.** Helmholtz's *Die Lehre von den Tonempfindungen* describes a pure tone as a sine wave and a musical note as a sum of them.
- **Late 1800s.** Alternating-current power systems made the sine wave of voltage a daily object, with the mains frequency fixed at $50$ or $60$ Hz.`,
            T`**Grafik fungsi trigonometri muncul terlambat: fungsinya bermula sebagai panjang dalam lingkaran, dan hanya ketika sebuah besaran digambar terhadap besaran lain gelombangnya muncul.**

- **Sekitar 1350.** Nicole Oresme menggambar besaran yang berubah, seperti kecepatan terhadap waktu, sebagai garis yang tingginya menunjukkan besarnya pada tiap saat, pendahulu awal grafik.
- **1630-an.** Roberval menggambar kurva sinus sebagai pendamping sikloid dan menemukan luas di bawah satu lengkungannya. Ini termasuk gelombang sinus pertama yang digambar sebagai kurva.
- **1748.** *Introductio* karya Euler memperlakukan sinus dan kosinus sebagai fungsi bilangan, dengan sudut dalam radian, sehingga $\sin x$ dapat digambar terhadap $x$ dan diturunkan.
- **1822.** *Théorie analytique de la chaleur* karya Fourier menunjukkan bahwa fungsi periodik dapat ditulis sebagai jumlah gelombang sinus dan kosinus, itulah sebabnya menjumlahkan gelombang, seperti dalam artikel ini, menggambarkan bunyi, pasang surut, dan sinyal.
- **1863.** *Die Lehre von den Tonempfindungen* karya Helmholtz menggambarkan nada murni sebagai gelombang sinus dan nada musik sebagai jumlahnya.
- **Akhir 1800-an.** Sistem tenaga arus bolak-balik menjadikan gelombang sinus tegangan sebagai benda sehari-hari, dengan frekuensi listrik tetap $50$ atau $60$ Hz.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with trigonometric graphs?', 'Apa kesalahan umum pada grafik trigonometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with trigonometric graphs are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ The tangent graph is a wave between $-1$ and $1$ | It has no highest or lowest point: it rises from far below to far above between asymptotes. |
| ❌ Join the branches of $\tan x$ through the asymptote | The function does not exist at $90^\circ$: lift the pen, and draw the dashed asymptote. |
| ❌ The period of $\tan x$ is $360^\circ$ | It is $180^\circ$, since half a turn changes the signs of sine and cosine together. |
| ❌ The period of $\sin bx$ is $360^\circ b$ | It is $\frac{360^\circ}{b}$: a larger $b$ squeezes the wave. |
| ❌ $y=\sin(2x-60^\circ)$ is shifted $60^\circ$ to the right | Factor out the $2$: $\sin\left(2(x-30^\circ)\right)$, so the shift is $30^\circ$. |
| ❌ The amplitude of $3\tan x$ is $3$ | A tangent has no amplitude: $3$ only stretches it. |
| ❌ Draw $\sec x$ dipping between $-1$ and $1$ | $\sec x=\frac{1}{\cos x}$ always has $|\sec x|\ge1$: its U-shapes touch $1$ and $-1$ and no lower. |
| ❌ $\sin2x+\sin3x$ has period $2\times3$ or $360^\circ\cdot6$ | It repeats every $\frac{360^\circ}{\gcd(2,3)}=360^\circ$; the sum of waves of different frequencies is not even a sine wave. |
| ❌ Plot $\sin x$ for $x$ up to $360$ with the calculator in radian mode | $360$ radians is about $57$ turns. Match the unit of the axis and the mode of the program. |`,
            T`**Kesalahan paling umum pada grafik trigonometri adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Grafik tangen adalah gelombang di antara $-1$ dan $1$ | Ia tak punya titik tertinggi atau terendah: ia naik dari jauh di bawah ke jauh di atas di antara asimtot. |
| ❌ Menyambung cabang $\tan x$ melewati asimtot | Fungsinya tidak ada di $90^\circ$: angkat pena, dan gambar asimtot putus-putus. |
| ❌ Periode $\tan x$ adalah $360^\circ$ | Periodenya $180^\circ$, karena setengah putaran mengubah tanda sinus dan kosinus bersamaan. |
| ❌ Periode $\sin bx$ adalah $360^\circ b$ | Periodenya $\frac{360^\circ}{b}$: $b$ yang lebih besar merapatkan gelombang. |
| ❌ $y=\sin(2x-60^\circ)$ bergeser $60^\circ$ ke kanan | Keluarkan $2$: $\sin\left(2(x-30^\circ)\right)$, jadi pergeserannya $30^\circ$. |
| ❌ Amplitudo $3\tan x$ adalah $3$ | Tangen tak punya amplitudo: $3$ hanya meregangkannya. |
| ❌ Menggambar $\sec x$ menukik di antara $-1$ dan $1$ | $\sec x=\frac{1}{\cos x}$ selalu memiliki $|\sec x|\ge1$: bentuk U-nya menyentuh $1$ dan $-1$ dan tidak lebih rendah. |
| ❌ $\sin2x+\sin3x$ berperiode $2\times3$ atau $360^\circ\cdot6$ | Ia berulang setiap $\frac{360^\circ}{\gcd(2,3)}=360^\circ$; jumlah gelombang berfrekuensi berbeda bahkan bukan gelombang sinus. |
| ❌ Menggambar $\sin x$ untuk $x$ sampai $360$ dengan kalkulator mode radian | $360$ radian sekitar $57$ putaran. Samakan satuan sumbu dan mode program. |`,
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
              L(T`The graph of $\tan x$ has vertical asymptotes at $90^\circ+180^\circ n$.`, T`Grafik $\tan x$ memiliki asimtot tegak di $90^\circ+180^\circ n$.`),
              L(T`The period of $\tan x$ is $360^\circ$.`, T`Periode $\tan x$ adalah $360^\circ$.`),
              L(T`$\sec x$ can equal $0.5$.`, T`$\sec x$ dapat bernilai $0{,}5$.`),
              L(T`$y=\sin2x$ has period $180^\circ$.`, T`$y=\sin2x$ berperiode $180^\circ$.`),
              L(T`The graph of $y=\sin(2x-60^\circ)$ is the graph of $\sin2x$ shifted $60^\circ$ to the right.`, T`Grafik $y=\sin(2x-60^\circ)$ adalah grafik $\sin2x$ yang digeser $60^\circ$ ke kanan.`),
              L(T`The sum of two sine waves of different frequencies is again a sine wave.`, T`Jumlah dua gelombang sinus berfrekuensi berbeda adalah lagi gelombang sinus.`),
            ],
            answer: [true, false, false, true, false, false],
            explain: L(
              T`The tangent repeats every $180^\circ$. $\sec x=\frac{1}{\cos x}$ is at least $1$ in absolute value. $\sin(2x-60^\circ)=\sin(2(x-30^\circ))$ is shifted $30^\circ$. Two different frequencies never give a single sine wave.`,
              T`Tangen berulang setiap $180^\circ$. $\sec x=\frac{1}{\cos x}$ nilai mutlaknya paling sedikit $1$. $\sin(2x-60^\circ)=\sin(2(x-30^\circ))$ digeser $30^\circ$. Dua frekuensi berbeda tak pernah memberi satu gelombang sinus.`,
            ),
            hint: L(T`Think about what the cosine is when the secant is large, and factor the $2$ out of the argument.`, T`Pikirkan berapa kosinus ketika sekan besar, dan keluarkan $2$ dari argumennya.`),
          },
        },
        {
          kind: 'activity',
          title: L('A period', 'Sebuah periode'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`The period of $\sin bx$ is $\frac{360^\circ}{b}$.`, T`Periode $\sin bx$ adalah $\frac{360^\circ}{b}$.`), L(T`Here $b=4$.`, T`Di sini $b=4$.`)],
            explain: L(T`$\frac{360^\circ}{4}=90^\circ$; the $3$ and the $-1$ change the height, not the period.`, T`$\frac{360^\circ}{4}=90^\circ$; $3$ dan $-1$ mengubah tinggi, bukan periode.`),
            prompt: L(T`What is the period, in degrees, of $y=3\sin4x-1$?`, T`Berapa periode, dalam derajat, $y=3\sin4x-1$?`),
            given: String.raw`P=v`,
            blanks: [{ label: 'P =', answer: 90 }],
          },
        },
        {
          kind: 'activity',
          title: L('The highest point', 'Titik tertinggi'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`The highest value is $d+|a|$.`, T`Nilai tertingginya $d+|a|$.`), L(T`Write it as $y=-2\cos3x+5$.`, T`Tulis sebagai $y=-2\cos3x+5$.`)],
            explain: L(T`The midline is $5$ and the amplitude is $2$, so the highest value is $5+2=7$ (where $\cos3x=-1$).`, T`Garis tengahnya $5$ dan amplitudonya $2$, jadi nilai tertingginya $5+2=7$ (di tempat $\cos3x=-1$).`),
            prompt: L(T`What is the largest value of $y=5-2\cos3x$?`, T`Berapa nilai terbesar $y=5-2\cos3x$?`),
            given: String.raw`M=v`,
            blanks: [{ label: 'M =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('Between asymptotes', 'Di antara asimtot'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`A tangent $\tan bx$ has period $\frac{180^\circ}{b}$.`, T`Tangen $\tan bx$ berperiode $\frac{180^\circ}{b}$.`), L(T`Neighbouring asymptotes are one period apart.`, T`Asimtot yang bersebelahan berjarak satu periode.`)],
            explain: L(T`The period of $\tan3x$ is $\frac{180^\circ}{3}=60^\circ$, and the asymptotes are one period apart.`, T`Periode $\tan3x$ adalah $\frac{180^\circ}{3}=60^\circ$, dan asimtotnya berjarak satu periode.`),
            prompt: L(T`How far apart, in degrees, are two neighbouring asymptotes of $y=\tan3x$?`, T`Berapa jarak, dalam derajat, dua asimtot bersebelahan $y=\tan3x$?`),
            given: String.raw`d=v`,
            blanks: [{ label: 'd =', answer: 60 }],
          },
        },
        {
          kind: 'activity',
          title: L('The shift', 'Pergeseran'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`Factor out the number in front of $x$: $2x-60^\circ=2(x-\ldots)$.`, T`Keluarkan bilangan di depan $x$: $2x-60^\circ=2(x-\ldots)$.`), L(T`$60^\circ$ divided by $2$.`, T`$60^\circ$ dibagi $2$.`)],
            explain: L(T`$2x-60^\circ=2(x-30^\circ)$, so the graph is shifted $30^\circ$ to the right.`, T`$2x-60^\circ=2(x-30^\circ)$, jadi grafik digeser $30^\circ$ ke kanan.`),
            prompt: L(T`By how many degrees to the right is $y=\sin(2x-60^\circ)$ shifted from $y=\sin2x$?`, T`Berapa derajat ke kanan $y=\sin(2x-60^\circ)$ bergeser dari $y=\sin2x$?`),
            given: String.raw`c=v`,
            blanks: [{ label: 'c =', answer: 30 }],
          },
        },
        {
          kind: 'activity',
          title: L('The midline', 'Garis tengah'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`The midline is halfway between the highest and the lowest value.`, T`Garis tengah ada di tengah-tengah nilai tertinggi dan terendah.`), L(T`$\frac{7+(-3)}{2}$.`, T`$\frac{7+(-3)}{2}$.`)],
            explain: L(T`$d=\frac{7-3}{2}=2$; the amplitude is $\frac{7-(-3)}{2}=5$.`, T`$d=\frac{7-3}{2}=2$; amplitudonya $\frac{7-(-3)}{2}=5$.`),
            prompt: L(T`A wave has highest value $7$ and lowest value $-3$. At what height $y=d$ is its midline?`, T`Sebuah gelombang bernilai tertinggi $7$ dan terendah $-3$. Pada tinggi $y=d$ berapa garis tengahnya?`),
            given: String.raw`d=v`,
            blanks: [{ label: 'd =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('A sum', 'Sebuah jumlah'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`The sum repeats when both waves have finished whole cycles together.`, T`Jumlahnya berulang ketika kedua gelombang telah menyelesaikan siklus utuh bersamaan.`), L(T`$\sin2x$ has period $180^\circ$ and $\sin3x$ has period $120^\circ$.`, T`$\sin2x$ berperiode $180^\circ$ dan $\sin3x$ berperiode $120^\circ$.`)],
            explain: L(T`The smallest common multiple of $180^\circ$ and $120^\circ$ is $360^\circ$, which is $\frac{360^\circ}{\gcd(2,3)}$.`, T`Kelipatan persekutuan terkecil $180^\circ$ dan $120^\circ$ adalah $360^\circ$, yaitu $\frac{360^\circ}{\gcd(2,3)}$.`),
            prompt: L(T`What is the period, in degrees, of $\sin2x+\sin3x$?`, T`Berapa periode, dalam derajat, $\sin2x+\sin3x$?`),
            given: String.raw`P=v`,
            blanks: [{ label: 'P =', answer: 360 }],
          },
        },
        {
          kind: 'activity',
          title: L('Never between', 'Tak pernah di antara'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L(T`Which function never takes a value between $-1$ and $1$?`, T`Fungsi mana yang tak pernah bernilai di antara $-1$ dan $1$?`),
            options: [L(T`$\csc x$`, T`$\csc x$`), L(T`$\tan x$`, T`$\tan x$`), L(T`$\cos x$`, T`$\cos x$`), L(T`$\cot x$`, T`$\cot x$`)],
            answer: 0,
            explain: L(T`$\csc x=\frac{1}{\sin x}$ and $|\sin x|\le1$, so $|\csc x|\ge1$. The tangent and cotangent take every value.`, T`$\csc x=\frac{1}{\sin x}$ dan $|\sin x|\le1$, jadi $|\csc x|\ge1$. Tangen dan kotangen mengambil setiap nilai.`),
            hint: L(T`A reciprocal of a number whose absolute value is at most $1$ has absolute value at least $1$.`, T`Kebalikan bilangan yang nilai mutlaknya paling banyak $1$ bernilai mutlak paling sedikit $1$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Which have asymptotes?', 'Mana yang memiliki asimtot?'),
          step: {
            kind: 'multi',
            id: 'p9',
            prompt: L(T`Which graphs have vertical asymptotes? Choose **all** that apply.`, T`Grafik mana yang memiliki asimtot tegak? Pilih **semua** yang benar.`),
            options: [L(T`$y=\tan x$`, T`$y=\tan x$`), L(T`$y=\cos x$`, T`$y=\cos x$`), L(T`$y=\cot x$`, T`$y=\cot x$`), L(T`$y=\sec x$`, T`$y=\sec x$`), L(T`$y=\sin x$`, T`$y=\sin x$`)],
            answer: [0, 2, 3],
            explain: L(T`The tangent, cotangent and secant have a denominator ($\cos x$ or $\sin x$) that is zero somewhere. Sine and cosine are defined for every angle.`, T`Tangen, kotangen, dan sekan memiliki penyebut ($\cos x$ atau $\sin x$) yang nol di suatu tempat. Sinus dan kosinus terdefinisi untuk setiap sudut.`),
            hint: L('A graph has a vertical asymptote where the function is not defined.', 'Grafik memiliki asimtot tegak di tempat fungsinya tidak terdefinisi.'),
          },
        },
        {
          kind: 'activity',
          title: L('Order the sketch', 'Urutkan sketsanya'),
          step: {
            kind: 'order',
            id: 'p10',
            prompt: L('Put the steps of sketching $y=3\\sin(2x-60^\\circ)+1$ in order.', 'Urutkan langkah membuat sketsa $y=3\\sin(2x-60^\\circ)+1$.'),
            lines: {
              en: ['Period: 360° ÷ 2 = 180°', 'Start of a cycle: 2x − 60° = 0, so x = 30°', 'Quarter points: 30°, 75°, 120°, 165°, 210°', 'Heights 1, 4, 1, −2, 1: join them with a smooth wave'],
              id: ['Periode: 360° ÷ 2 = 180°', 'Awal siklus: 2x − 60° = 0, jadi x = 30°', 'Titik seperempat: 30°, 75°, 120°, 165°, 210°', 'Tinggi 1, 4, 1, −2, 1: hubungkan dengan gelombang mulus'],
            },
            explain: L(T`You need the period before the quarter points, and the start before the five $x$-values.`, T`Periode diperlukan sebelum titik seperempat, dan awal sebelum kelima nilai $x$.`),
            hint: L(T`The heights come last, once you know where the points are.`, T`Tinggi datang terakhir, setelah diketahui letak titik-titiknya.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the reciprocal', 'Isi kebaliknya'),
          step: {
            kind: 'fill',
            id: 'p11',
            prompt: L('Complete the definition of the secant.', 'Lengkapi definisi sekan.'),
            template: {
              en: 'sec x = 1 / ___ x',
              id: 'sec x = 1 / ___ x',
            },
            blanks: { en: ['cos'], id: ['cos'] },
            explain: L(T`$\sec x=\frac{1}{\cos x}$, so it has asymptotes where the cosine is zero.`, T`$\sec x=\frac{1}{\cos x}$, sehingga ia punya asimtot di tempat kosinus nol.`),
            hint: L(T`The secant pairs with the cosine, the cosecant with the sine.`, T`Sekan berpasangan dengan kosinus, kosekan dengan sinus.`),
          },
        },
        {
          kind: 'activity',
          title: L('A tide period', 'Periode pasang surut'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('High tide is at 3 h and again at 15.4 h. What is the period of the tide?', 'Pasang tertinggi terjadi pada jam 3 dan lagi pada jam 15,4. Berapa periode pasang surutnya?'),
            options: [L('12.4 h', '12,4 jam'), L('6.2 h', '6,2 jam'), L('18.4 h', '18,4 jam'), L('24.8 h', '24,8 jam')],
            answer: 0,
            explain: L('The period is the distance between two successive peaks: 15.4 − 3 = 12.4 hours.', 'Periode adalah jarak antara dua puncak berurutan: 15,4 − 3 = 12,4 jam.'),
            hint: L('Subtract the two times.', 'Kurangkan kedua waktu itu.'),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: trigonometric graphs at a glance', 'Ringkasan: grafik trigonometri sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **From the circle:** sine and cosine are the height and width of the point; tangent, cotangent, secant and cosecant are the lengths cut by the ray on the lines $x=1$ and $y=1$.
- **Tangent:** asymptotes at $90^\circ+180^\circ n$, period $180^\circ$, odd, no amplitude, through $(45^\circ,1)$.
- **Reciprocals:** asymptotes where the base is $0$, tips where it is $\pm1$, $|\sec x|\ge1$, $|\csc x|\ge1$; $\cot x=-\tan(x-90^\circ)$.
- **Transformations:** $y=a\,f(b(x-c))+d$; period $\frac{360^\circ}{|b|}$ (or $\frac{180^\circ}{|b|}$), shift $c$, lift $d$; in $bx-B$ the shift is $\frac{B}{b}$.
- **Sketching:** period, start $\frac{B}{b}$, five points a quarter of a period apart, heights $d,\ d+a,\ d,\ d-a,\ d$; a tangent from its asymptotes and the points at $\pm45^\circ$.
- **Reading:** $d=\frac{\max+\min}{2}$, $a=\frac{\max-\min}{2}$, $P$ from two peaks, cosine shifted by a peak.
- **Adding:** same frequency, one wave; whole-number frequencies, period $\frac{360^\circ}{\gcd}$; irrational ratio, no period; close frequencies beat.
- **Fitting:** a known period makes $y\approx A\sin bx+B\cos bx+D$ linear; $R^2$ measures the fit.`,
            T`- **Dari lingkaran:** sinus dan kosinus adalah tinggi dan lebar titik; tangen, kotangen, sekan, dan kosekan adalah panjang yang dipotong sinar pada garis $x=1$ dan $y=1$.
- **Tangen:** asimtot di $90^\circ+180^\circ n$, periode $180^\circ$, ganjil, tanpa amplitudo, melalui $(45^\circ,1)$.
- **Kebalikan:** asimtot di tempat dasarnya $0$, ujung di tempat ia $\pm1$, $|\sec x|\ge1$, $|\csc x|\ge1$; $\cot x=-\tan(x-90^\circ)$.
- **Transformasi:** $y=a\,f(b(x-c))+d$; periode $\frac{360^\circ}{|b|}$ (atau $\frac{180^\circ}{|b|}$), pergeseran $c$, pengangkatan $d$; pada $bx-B$ pergeserannya $\frac{B}{b}$.
- **Sketsa:** periode, awal $\frac{B}{b}$, lima titik berjarak seperempat periode, tinggi $d,\ d+a,\ d,\ d-a,\ d$; tangen dari asimtotnya dan titik di $\pm45^\circ$.
- **Membaca:** $d=\frac{\text{maks}+\text{min}}{2}$, $a=\frac{\text{maks}-\text{min}}{2}$, $P$ dari dua puncak, kosinus digeser oleh sebuah puncak.
- **Menjumlahkan:** frekuensi sama, satu gelombang; frekuensi bilangan bulat, periode $\frac{360^\circ}{\text{fpb}}$; perbandingan irasional, tanpa periode; frekuensi berdekatan berlayang.
- **Mencocokkan:** periode yang diketahui membuat $y\approx A\sin bx+B\cos bx+D$ linear; $R^2$ mengukur kecocokan.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Vertical asymptote', 'Asimtot tegak'), definition: L('A vertical line that a graph approaches without ever touching, at an x where the function does not exist, such as x = 90 degrees for the tangent.', 'Garis tegak yang didekati grafik tanpa pernah menyentuhnya, di x tempat fungsi tidak ada, seperti x = 90 derajat untuk tangen.') },
    { term: L('Period', 'Periode'), definition: L('The smallest positive length after which a graph repeats exactly: 360 degrees for the sine and 180 degrees for the tangent.', 'Panjang positif terkecil yang setelahnya grafik berulang tepat: 360 derajat untuk sinus dan 180 derajat untuk tangen.') },
    { term: L('Amplitude', 'Amplitudo'), definition: L('The distance from the midline of a sine or cosine wave to its highest point, equal to the absolute value of a in a sin(bx) plus d.', 'Jarak dari garis tengah gelombang sinus atau kosinus ke titik tertingginya, sama dengan nilai mutlak a pada a sin(bx) ditambah d.') },
    { term: L('Midline', 'Garis tengah'), definition: L('The horizontal line halfway between the highest and the lowest value of a wave, y equal to d.', 'Garis mendatar di tengah-tengah nilai tertinggi dan terendah sebuah gelombang, y sama dengan d.') },
    { term: L('Phase shift', 'Pergeseran fase'), definition: L('The distance c that a graph y = a f(b(x - c)) + d is moved to the right compared with the parent; for f(bx - B) it is B divided by b.', 'Jarak c yang digeserkan ke kanan grafik y = a f(b(x - c)) + d dibandingkan induknya; untuk f(bx - B) nilainya B dibagi b.') },
    { term: L('Sinusoid', 'Sinusoida'), definition: L('A graph of the form a sin(b(x - c)) + d; sine and cosine waves of any amplitude, period and shift are all sinusoids.', 'Grafik berbentuk a sin(b(x - c)) + d; gelombang sinus dan kosinus dengan amplitudo, periode, dan pergeseran apa pun semuanya sinusoida.') },
    { term: L('Frequency', 'Frekuensi'), definition: L('The number of cycles per unit: the reciprocal of the period, so a period of 20 milliseconds is 50 cycles per second, 50 hertz.', 'Banyaknya siklus per satuan: kebalikan periode, sehingga periode 20 milidetik adalah 50 siklus per detik, 50 hertz.') },
    { term: L('Beat', 'Layangan'), definition: L('The slow swelling and fading of the sum of two waves of nearby frequencies, repeating as often as the difference of the frequencies.', 'Pembesaran dan pengecilan lambat jumlah dua gelombang berfrekuensi berdekatan, berulang sesering selisih frekuensinya.') },
    { term: L('Least squares', 'Kuadrat terkecil'), definition: L('A way to fit a curve to measurements by choosing the numbers that make the sum of the squared vertical distances to the points as small as possible.', 'Cara mencocokkan kurva dengan pengukuran dengan memilih bilangan yang membuat jumlah kuadrat jarak tegak ke titik-titik sekecil mungkin.') },
  ],

  howTo: [
    {
      name: L('How to sketch y = a sin(bx − B) + d', 'Cara membuat sketsa y = a sin(bx − B) + d'),
      description: L('Find the period and the start of a cycle, plot five points a quarter of a period apart, and join them.', 'Cari periode dan awal satu siklus, gambar lima titik yang berjarak seperempat periode, dan hubungkan.'),
      steps: [
        { name: L('Find the period', 'Cari periodenya'), text: L('Divide 360 degrees by b to get the period P.', 'Bagi 360 derajat dengan b untuk mendapat periode P.') },
        { name: L('Find where a cycle starts', 'Cari awal siklus'), text: L('Solve b x minus B equals 0, so the cycle starts at x equal to B divided by b.', 'Selesaikan b x dikurangi B sama dengan 0, sehingga siklus dimulai di x sama dengan B dibagi b.') },
        { name: L('Mark five points', 'Tandai lima titik'), text: L('Mark x at the start, then add P over 4 four times to get the other four points.', 'Tandai x di awal, lalu tambahkan P per 4 empat kali untuk mendapat empat titik lainnya.') },
        { name: L('Give them heights and join them', 'Beri tinggi dan hubungkan'), text: L('The heights are d, d plus a, d, d minus a, d. Join them with a smooth wave and repeat the cycle both ways.', 'Tingginya d, d ditambah a, d, d dikurangi a, d. Hubungkan dengan gelombang mulus dan ulangi siklus ke dua arah.') },
      ],
    },
    {
      name: L('How to graph secant or cosecant from cosine or sine', 'Cara menggambar sekan atau kosekan dari kosinus atau sinus'),
      description: L('Draw the base function lightly, then add the asymptotes and the U-shaped branches.', 'Gambar fungsi dasar dengan samar, lalu tambahkan asimtot dan cabang berbentuk U.'),
      steps: [
        { name: L('Draw the base lightly', 'Gambar dasarnya dengan samar'), text: L('Sketch the cosine for the secant, or the sine for the cosecant.', 'Sketsa kosinus untuk sekan, atau sinus untuk kosekan.') },
        { name: L('Draw the asymptotes', 'Gambar asimtotnya'), text: L('Draw a dashed vertical line at every zero of the base function.', 'Gambar garis tegak putus-putus di setiap nol fungsi dasar.') },
        { name: L('Mark the tips', 'Tandai ujungnya'), text: L('At each peak and trough of the base, where it is 1 or minus 1, mark the point at the same height.', 'Pada tiap puncak dan lembah dasar, tempat ia 1 atau minus 1, tandai titik pada tinggi yang sama.') },
        { name: L('Draw the U-shaped branches', 'Gambar cabang berbentuk U'), text: L('From each tip draw a branch that runs away from the axis towards the two nearest asymptotes.', 'Dari tiap ujung gambar cabang yang menjauh dari sumbu menuju dua asimtot terdekat.') },
      ],
    },
    {
      name: L('How to find the equation of a sine or cosine graph', 'Cara mencari persamaan grafik sinus atau kosinus'),
      description: L('Read the midline, amplitude, period and shift from the picture and write a f(b(x - c)) + d.', 'Baca garis tengah, amplitudo, periode, dan pergeseran dari gambar dan tulis a f(b(x - c)) + d.'),
      steps: [
        { name: L('Midline and amplitude', 'Garis tengah dan amplitudo'), text: L('Take d as the highest plus the lowest value over 2, and a as the highest minus the lowest value over 2.', 'Ambil d sebagai nilai tertinggi ditambah terendah per 2, dan a sebagai nilai tertinggi dikurangi terendah per 2.') },
        { name: L('Period and b', 'Periode dan b'), text: L('Measure the distance P between two successive peaks and take b as 360 degrees divided by P.', 'Ukur jarak P antara dua puncak berurutan dan ambil b sebagai 360 derajat dibagi P.') },
        { name: L('Shift', 'Pergeseran'), text: L('For a cosine let c be the x of a peak; for a sine let c be the x of a peak minus P over 4.', 'Untuk kosinus misalkan c adalah x sebuah puncak; untuk sinus misalkan c adalah x sebuah puncak dikurangi P per 4.') },
        { name: L('Check a point', 'Periksa satu titik'), text: L('Put the x of another point on the graph into the equation and compare the height.', 'Masukkan x titik lain pada grafik ke persamaan dan bandingkan tingginya.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What does the graph of tan x look like?', 'Seperti apa grafik tan x?'),
      a: L(
        'It is a series of rising branches separated by vertical asymptotes at 90 degrees plus 180 degrees times n. Each branch passes through the x-axis, goes through the point at 45 degrees with height 1, and runs from far below to far above.',
        'Ia adalah rangkaian cabang yang naik dan dipisahkan asimtot tegak di 90 derajat ditambah 180 derajat kali n. Tiap cabang melewati sumbu-x, melalui titik pada 45 derajat dengan tinggi 1, dan berjalan dari jauh di bawah ke jauh di atas.',
      ),
    },
    {
      q: L('What is the period of tangent and cotangent?', 'Berapa periode tangen dan kotangen?'),
      a: L(
        'Both repeat every 180 degrees, or pi radians, not 360. Half a turn changes the sign of both sine and cosine, so their quotient stays the same. For tan of b x the period is 180 degrees divided by b.',
        'Keduanya berulang setiap 180 derajat, atau pi radian, bukan 360. Setengah putaran mengubah tanda sinus dan kosinus sekaligus, sehingga hasil baginya tetap. Untuk tan b x periodenya 180 derajat dibagi b.',
      ),
    },
    {
      q: L('How do you graph secant and cosecant?', 'Bagaimana menggambar grafik sekan dan kosekan?'),
      a: L(
        'Draw cosine or sine lightly. Put asymptotes where it is zero, mark the points where it is 1 or minus 1, and draw U-shaped branches from those points to the asymptotes. The graph never lies between minus 1 and 1.',
        'Gambar kosinus atau sinus dengan samar. Letakkan asimtot di tempat ia nol, tandai titik tempat ia 1 atau minus 1, dan gambar cabang berbentuk U dari titik itu ke asimtot. Grafiknya tak pernah berada di antara minus 1 dan 1.',
      ),
    },
    {
      q: L('What is the phase shift of y = sin(2x − π/3)?', 'Berapa pergeseran fase y = sin(2x − π/3)?'),
      a: L(
        'Factor out the 2: sin of 2 times x minus pi over 6. The graph is shifted pi over 6 radians, 30 degrees, to the right, not pi over 3. The shift is B divided by b.',
        'Keluarkan 2: sin dari 2 kali x dikurangi pi per 6. Grafik bergeser pi per 6 radian, 30 derajat, ke kanan, bukan pi per 3. Pergeserannya B dibagi b.',
      ),
    },
    {
      q: L('How do you find the equation of a sine graph from its picture?', 'Bagaimana mencari persamaan grafik sinus dari gambarnya?'),
      a: L(
        'Take the midline as the average of the highest and lowest values and the amplitude as half their difference. Measure the period between two peaks, set b to 360 degrees over the period, and shift a cosine by the x of a peak.',
        'Ambil garis tengah sebagai rata-rata nilai tertinggi dan terendah dan amplitudo sebagai setengah selisihnya. Ukur periode antara dua puncak, jadikan b sama dengan 360 derajat per periode, dan geser kosinus sebesar x sebuah puncak.',
      ),
    },
    {
      q: L('Is the sum of two sine waves a sine wave?', 'Apakah jumlah dua gelombang sinus adalah gelombang sinus?'),
      a: L(
        'Only if they have the same frequency, when the sum is one sine wave. With different frequencies the sum is not a sine wave; it repeats if the frequencies are whole numbers, and never repeats if their ratio is irrational.',
        'Hanya bila frekuensinya sama, ketika jumlahnya satu gelombang sinus. Dengan frekuensi berbeda jumlahnya bukan gelombang sinus; ia berulang bila frekuensinya bilangan bulat, dan tak pernah berulang bila perbandingannya irasional.',
      ),
    },
    {
      q: L('How do you fit a sine wave to data?', 'Bagaimana mencocokkan gelombang sinus dengan data?'),
      a: L(
        'Choose the period, then fit y as A sin plus B cos plus D by least squares, which is linear. The amplitude is the square root of A squared plus B squared, and the fit quality is R squared. Try several periods if unsure.',
        'Pilih periodenya, lalu cocokkan y sebagai A sin ditambah B cos ditambah D dengan kuadrat terkecil, yang linear. Amplitudonya akar dari A kuadrat ditambah B kuadrat, dan mutu kecocokan adalah R kuadrat. Coba beberapa periode bila ragu.',
      ),
    },
    {
      q: L('What is the range of secant and cosecant?', 'Berapa daerah hasil sekan dan kosekan?'),
      a: L(
        'All numbers that are at least 1 or at most minus 1, with nothing in between. They are the reciprocals of cosine and sine, which never leave the interval from minus 1 to 1, so the reciprocals never enter it.',
        'Semua bilangan yang paling sedikit 1 atau paling banyak minus 1, tanpa apa pun di antaranya. Keduanya kebalikan kosinus dan sinus, yang tak pernah keluar dari selang minus 1 sampai 1, sehingga kebalikannya tak pernah memasukinya.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (chapters on trigonometric functions of real numbers and graphs)', author: 'James Stewart, Lothar Redlin, Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Trigonometric Delights', author: 'Eli Maor', year: 1998, source: 'Princeton University Press' },
    { title: 'Trigonometry (2nd ed.)', author: 'I. M. Gelfand, Mark Saul', year: 2001, source: 'Birkhäuser' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
    { title: 'Introductio in analysin infinitorum', author: 'Leonhard Euler', year: 1748, source: 'Marcum-Michaelem Bousquet' },
    { title: 'Théorie analytique de la chaleur', author: 'Joseph Fourier', year: 1822, source: 'Firmin Didot' },
    { title: 'Die Lehre von den Tonempfindungen', author: 'Hermann von Helmholtz', year: 1863, source: 'Vieweg' },
  ],

  related: ['basic-trigonometry', 'trigonometric-equations', 'trigonometric-identities', 'derivatives-of-trigonometric-functions'],
}
