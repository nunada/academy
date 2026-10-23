import type { Figure } from '../../lib/figure'
import type { Loc } from '../types'
import { NUMERIC_EQUATIONS, bisect, newton } from '../../lib/trigeq'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './trigonometric-equations.meta'

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
const fig = (f: Omit<Figure, 'dim' | 'axes'>): ArticleBlock => ({ kind: 'figure', figure: { dim: 2, axes: false, ...f, aspect: f.aspect ?? 1 } })

const D = 'x*pi/180' // an angle in degrees, for the expressions of a figure

/** sin x = 1/2 over three turns: six crossings in the picture and infinitely many on the whole line. */
const FIG_MANY = fig({
  xSpan: [-400, 760],
  ySpan: [-1.6, 1.6],
  aspect: 2.7,
  items: [
    { t: 'seg', from: [-380, 0], to: [740, 0], color: 'muted' },
    { t: 'seg', from: [0, -1.25], to: [0, 1.3], color: 'muted' },
    { t: 'curve', f: `sin(${D})`, from: -360, to: 720, color: 'a' },
    { t: 'hline', y: 0.5, color: 'result', dashed: true },
    ...[-330, -210, 30, 150, 390, 510].flatMap((x): FigureItems => [
      { t: 'dot', x, y: 0.5, color: 'result' },
      { t: 'text', at: [x, -0.28], text: `${x}°`, size: 'sm', color: 'result' },
    ]),
  ],
  caption: L(
    T`The line $y=\frac12$ cuts the graph of $\sin x$ at every point of the form $30^\circ+360^\circ n$ and $150^\circ+360^\circ n$. Three turns are drawn here and show six of them; on the whole number line there are infinitely many.`,
    T`Garis $y=\frac12$ memotong grafik $\sin x$ di setiap titik berbentuk $30^\circ+360^\circ n$ dan $150^\circ+360^\circ n$. Gambar ini memperlihatkan tiga putaran dan enam titik di antaranya; pada seluruh garis bilangan jumlahnya tak berhingga.`,
  ),
})
type FigureItems = Figure['items']

/** sin 2x = 1/2: the line cuts the faster wave four times in one turn. */
const FIG_MULTI = fig({
  xSpan: [-40, 410],
  ySpan: [-1.6, 1.6],
  aspect: 2.5,
  items: [
    { t: 'seg', from: [-20, 0], to: [380, 0], color: 'muted' },
    { t: 'seg', from: [0, -1.25], to: [0, 1.3], color: 'muted' },
    { t: 'curve', f: `sin(${D})`, from: 0, to: 360, color: 'muted', dashed: true },
    { t: 'curve', f: `sin(2*${D})`, from: 0, to: 360, color: 'a' },
    { t: 'hline', y: 0.5, color: 'result', dashed: true },
    ...[15, 75, 195, 255].flatMap((x): FigureItems => [
      { t: 'dot', x, y: 0.5, color: 'result' },
      { t: 'text', at: [x, -0.3], text: `${x}°`, size: 'sm', color: 'result' },
    ]),
    { t: 'text', at: [-26, 0.68], text: '1/2', size: 'sm', color: 'result' },
  ],
  caption: L(
    T`The equation $\sin2x=\frac12$ on $0^\circ\le x<360^\circ$. The wave $\sin2x$ (solid) turns twice as fast as $\sin x$ (dashed), so the line meets it four times, at $15^\circ$, $75^\circ$, $195^\circ$ and $255^\circ$, and not twice as for $\sin x=\frac12$.`,
    T`Persamaan $\sin2x=\frac12$ pada $0^\circ\le x<360^\circ$. Gelombang $\sin2x$ (garis penuh) berputar dua kali lebih cepat daripada $\sin x$ (garis putus-putus), sehingga garis memotongnya empat kali, di $15^\circ$, $75^\circ$, $195^\circ$, dan $255^\circ$, bukan dua kali seperti pada $\sin x=\frac12$.`,
  ),
})

/** 2 sin^2 x - sin x - 1: a root where the curve only touches the axis. */
const FIG_QUAD = fig({
  xSpan: [-40, 410],
  ySpan: [-1.6, 2.4],
  aspect: 2.2,
  items: [
    { t: 'seg', from: [-20, 0], to: [380, 0], color: 'muted' },
    { t: 'seg', from: [0, -1.4], to: [0, 2.2], color: 'muted' },
    { t: 'curve', f: `2*sin(${D})^2-sin(${D})-1`, from: 0, to: 360, color: 'a' },
    { t: 'dot', x: 90, y: 0, color: 'result' },
    { t: 'dot', x: 210, y: 0, color: 'result' },
    { t: 'dot', x: 330, y: 0, color: 'result' },
    { t: 'text', at: [90, 0.38], text: '90°', size: 'sm', color: 'result' },
    { t: 'text', at: [193, 0.38], text: '210°', size: 'sm', color: 'result' },
    { t: 'text', at: [350, 0.38], text: '330°', size: 'sm', color: 'result' },
  ],
  caption: L(
    T`The graph of $2\sin^2x-\sin x-1$ on $0^\circ\le x<360^\circ$ meets the axis at three points. At $210^\circ$ and $330^\circ$ (where $\sin x=-\frac12$) it crosses, and at $90^\circ$ (where $\sin x=1$) it only touches from below, because $\sin x$ never goes beyond $1$: a root $u=1$ gives one angle, not two.`,
    T`Grafik $2\sin^2x-\sin x-1$ pada $0^\circ\le x<360^\circ$ menyentuh sumbu di tiga titik. Di $210^\circ$ dan $330^\circ$ (tempat $\sin x=-\frac12$) ia memotong, dan di $90^\circ$ (tempat $\sin x=1$) ia hanya menyentuh dari bawah, karena $\sin x$ tidak pernah melewati $1$: akar $u=1$ memberi satu sudut, bukan dua.`,
  ),
})

/** sin x + cos x = 1, after squaring: the candidates at the level 1 are solutions and the ones at the level -1 are not. */
const FIG_FALSE = fig({
  xSpan: [-40, 410],
  ySpan: [-1.9, 1.9],
  aspect: 2.4,
  items: [
    { t: 'seg', from: [-20, 0], to: [380, 0], color: 'muted' },
    { t: 'seg', from: [0, -1.6], to: [0, 1.7], color: 'muted' },
    { t: 'curve', f: `sin(${D})+cos(${D})`, from: 0, to: 360, color: 'a' },
    { t: 'hline', y: 1, color: 'result', dashed: true },
    { t: 'hline', y: -1, color: 'b', dashed: true },
    { t: 'dot', x: 0, y: 1, color: 'result' },
    { t: 'dot', x: 90, y: 1, color: 'result' },
    { t: 'dot', x: 180, y: -1, color: 'b', open: true },
    { t: 'dot', x: 270, y: -1, color: 'b', open: true },
    { t: 'text', at: [0, 1.38], text: '0°', size: 'sm', color: 'result' },
    { t: 'text', at: [90, 1.38], text: '90°', size: 'sm', color: 'result' },
    { t: 'text', at: [180, -1.38], text: '180°', size: 'sm', color: 'b' },
    { t: 'text', at: [270, -1.38], text: '270°', size: 'sm', color: 'b' },
    { t: 'text', at: [-26, 1.18], text: '1', size: 'sm', color: 'result' },
    { t: 'text', at: [-28, -0.82], text: '-1', size: 'sm', color: 'b' },
  ],
  caption: L(
    T`Squaring $\sin x+\cos x=1$ gives $(\sin x+\cos x)^2=1$, which is true when the sum is $1$ or $-1$. The graph of $\sin x+\cos x$ meets the line $y=1$ at $0^\circ$ and $90^\circ$ (solutions) and the line $y=-1$ at $180^\circ$ and $270^\circ$ (hollow dots: false roots of the original equation).`,
    T`Mengkuadratkan $\sin x+\cos x=1$ memberi $(\sin x+\cos x)^2=1$, yang benar bila jumlahnya $1$ atau $-1$. Grafik $\sin x+\cos x$ memotong garis $y=1$ di $0^\circ$ dan $90^\circ$ (penyelesaian) dan garis $y=-1$ di $180^\circ$ dan $270^\circ$ (titik kosong: akar palsu bagi persamaan semula).`,
  ),
})

/** Bisection on cos x - x over [0, 1]: three halvings. */
const FIG_BISECT = fig({
  xSpan: [-0.12, 1.18],
  ySpan: [-1.15, 1.3],
  aspect: 2,
  items: [
    { t: 'seg', from: [-0.08, 0], to: [1.14, 0], color: 'muted' },
    { t: 'curve', f: 'cos(x)-x', from: 0, to: 1.1, color: 'a' },
    { t: 'seg', from: [0, 0], to: [1, 0], color: 'b', width: 5 },
    { t: 'seg', from: [0.5, 0], to: [0.5, 0.3776], color: 'muted', dashed: true },
    { t: 'seg', from: [0.75, 0], to: [0.75, -0.0183], color: 'muted', dashed: true },
    { t: 'seg', from: [0.625, 0], to: [0.625, 0.186], color: 'muted', dashed: true },
    { t: 'dot', x: 0.5, y: 0.3776, color: 'result' },
    { t: 'dot', x: 0.75, y: -0.0183, color: 'result' },
    { t: 'dot', x: 0.625, y: 0.186, color: 'result' },
    { t: 'text', at: [0, -0.2], text: '0', size: 'sm', color: 'b' },
    { t: 'text', at: [1, -0.2], text: '1', size: 'sm', color: 'b' },
    { t: 'text', at: [0.5, -0.2], text: '1', size: 'sm', color: 'result' },
    { t: 'text', at: [0.75, -0.2], text: '2', size: 'sm', color: 'result' },
    { t: 'text', at: [0.625, -0.2], text: '3', size: 'sm', color: 'result' },
  ],
  caption: L(
    T`Bisection on $f(x)=\cos x-x$ with $x$ in radians. The interval $[0,1]$ has $f(0)>0>f(1)$; the midpoints $0.5$, $0.75$ and $0.625$ (numbered $1$, $2$, $3$) each keep the half where $f$ changes sign, and the root $0.7391$ stays inside every one of them.`,
    T`Bisection pada $f(x)=\cos x-x$ dengan $x$ dalam radian. Interval $[0,1]$ memiliki $f(0)>0>f(1)$; titik tengah $0{,}5$, $0{,}75$, dan $0{,}625$ (bernomor $1$, $2$, $3$) masing-masing mempertahankan separuh yang tanda $f$-nya berubah, dan akar $0{,}7391$ tetap berada di dalam semuanya.`,
  ),
})

/** The first steps of bisection and of Newton's method on cos x = x, as a table in either language. */
const iterTable = (lang: 'en' | 'id'): string => {
  const eq = NUMERIC_EQUATIONS[0]
  const bis = bisect(eq.f, eq.bracket[0], eq.bracket[1])!.rows
  const nw = newton(eq.f, eq.df, eq.start).rows
  const num = (x: number): string => (lang === 'id' ? x.toFixed(10).replace('.', ',') : x.toFixed(10))
  const head = lang === 'id' ? '| Langkah | Bisection: titik tengah | Metode Newton: $x$ |' : '| Step | Bisection: midpoint | Newton\'s method: $x$ |'
  const rows = [1, 2, 3, 4, 5, 6].map((n) => `| ${n} | ${num(bis[n - 1].mid)} | ${num(nw[Math.min(n, nw.length - 1)].x)} |`)
  return `${head}\n|---|---|---|\n${rows.join('\n')}`
}

export const body: ArticleBody = {
  answer: L(
    T`**To solve a trigonometric equation, reduce it to basic equations such as $\sin u=c$, solve each with its two families of angles plus whole turns, and keep the solutions inside the interval asked for.** A multiple angle, as in $\sin2x=\frac12$, gives more solutions per turn, not fewer. Solve an equation quadratic in $\sin x$ as a quadratic first and discard roots beyond $\pm1$. Factor instead of dividing by a function that can be zero, and after squaring check every answer in the original equation.`,
    T`**Untuk menyelesaikan persamaan trigonometri, ubah menjadi persamaan dasar seperti $\sin u=c$, selesaikan masing-masing dengan dua keluarga sudutnya ditambah putaran penuh, dan ambil penyelesaian dalam interval yang diminta.** Sudut kelipatan, seperti pada $\sin2x=\frac12$, memberi lebih banyak penyelesaian per putaran, bukan lebih sedikit. Selesaikan persamaan yang kuadrat dalam $\sin x$ lebih dulu sebagai kuadrat dan buang akar di luar $\pm1$. Faktorkan, jangan membagi dengan fungsi yang bisa nol, dan setelah mengkuadratkan periksa setiap jawaban pada persamaan semula.`,
  ),

  keyPoints: [
    L(
      T`A trigonometric equation has infinitely many solutions unless an interval is given, because the functions repeat: $\sin x=\frac12$ is solved by $30^\circ+360^\circ n$ and $150^\circ+360^\circ n$ for every whole number $n$, and the interval decides which values of $n$ are used.`,
      T`Persamaan trigonometri memiliki tak berhingga penyelesaian kecuali interval diberikan, karena fungsinya berulang: $\sin x=\frac12$ diselesaikan oleh $30^\circ+360^\circ n$ dan $150^\circ+360^\circ n$ untuk setiap bilangan bulat $n$, dan interval menentukan nilai $n$ yang dipakai.`,
    ),
    L(
      T`For $\sin(kx+b)=c$, solve for the angle $u=kx+b$ over an interval $k$ times as long, then subtract $b$ and divide by $k$. That is why $\sin2x=\frac12$ has four solutions in $[0^\circ,360^\circ)$: in one turn there are $2k$ of them.`,
      T`Untuk $\sin(kx+b)=c$, selesaikan untuk sudut $u=kx+b$ pada interval yang $k$ kali lebih panjang, lalu kurangi $b$ dan bagi $k$. Itu sebabnya $\sin2x=\frac12$ punya empat penyelesaian di $[0^\circ,360^\circ)$: dalam satu putaran ada $2k$ penyelesaian.`,
    ),
    L(
      T`An equation quadratic in $\sin x$, $\cos x$ or $\tan x$ is solved by substituting $u$, solving for $u$ and then solving the basic equations. For sine and cosine a root outside $-1\le u\le1$ gives no angle: $\cos^2x=4$ has two roots $u$ and no solution $x$.`,
      T`Persamaan yang kuadrat dalam $\sin x$, $\cos x$, atau $\tan x$ diselesaikan dengan memisalkan $u$, mencari $u$, lalu menyelesaikan persamaan dasarnya. Untuk sinus dan kosinus, akar di luar $-1\le u\le1$ tidak memberi sudut: $\cos^2x=4$ punya dua akar $u$ dan tak punya penyelesaian $x$.`,
    ),
    L(
      T`Never divide by a function that can be zero. In $\sin2x=\cos x$, dividing by $\cos x$ loses $90^\circ$ and $270^\circ$; moving everything to one side and factoring, $\cos x\,(2\sin x-1)=0$, finds all four solutions.`,
      T`Jangan pernah membagi dengan fungsi yang bisa bernilai nol. Pada $\sin2x=\cos x$, membagi dengan $\cos x$ menghilangkan $90^\circ$ dan $270^\circ$; memindahkan semuanya ke satu ruas lalu memfaktorkan, $\cos x\,(2\sin x-1)=0$, menemukan keempat penyelesaiannya.`,
    ),
    L(
      T`Squaring, or multiplying by an expression that can be zero, can add false roots. Squaring $\sin x+\cos x=1$ gives four candidates ($0^\circ$, $90^\circ$, $180^\circ$, $270^\circ$) and only two of them satisfy the original equation, so every candidate is checked.`,
      T`Mengkuadratkan, atau mengalikan dengan ekspresi yang bisa nol, dapat menambah akar palsu. Mengkuadratkan $\sin x+\cos x=1$ memberi empat kandidat ($0^\circ$, $90^\circ$, $180^\circ$, $270^\circ$) dan hanya dua yang memenuhi persamaan semula, jadi setiap kandidat diperiksa.`,
    ),
    L(
      T`When $x$ itself is mixed with a trigonometric function, as in $\cos x=x$, no formula gives the answer. Graph it, bracket a sign change, and use bisection (one more binary digit per step) or Newton's method (roughly twice as many correct digits per step), with $x$ in radians.`,
      T`Bila $x$ sendiri bercampur dengan fungsi trigonometri, seperti pada $\cos x=x$, tak ada rumus yang memberi jawabannya. Gambar grafiknya, apit sebuah perubahan tanda, dan pakai bisection (satu angka biner lagi tiap langkah) atau metode Newton (kira-kira dua kali lipat angka benar tiap langkah), dengan $x$ dalam radian.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- what */
    {
      id: 'what-it-is',
      heading: L('What is a trigonometric equation, and why does it have infinitely many solutions?', 'Apa itu persamaan trigonometri, dan mengapa ia memiliki tak berhingga penyelesaian?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A trigonometric equation is an equation in which the unknown is the angle inside one or more trigonometric functions, such as $\sin x=\frac12$ or $2\cos^2x=\cos x$; because the functions repeat, a solution is never alone.** If $x$ solves $\sin x=\frac12$ then so does $x+360^\circ$, and so does $x-360^\circ$, since a full turn brings the point on the unit circle back to the same place. Sine and cosine repeat every $360^\circ$ (that is $2\pi$ radians), and tangent every $180^\circ$ ($\pi$ radians). So the answer to an equation is either **a family** with a whole number $n$ in it, or **a list** of the solutions inside an interval that the question names.

This is what separates an equation from an identity (see [the article on identities](article:trigonometric-identities#identity-or-equation)): an identity is true for every angle, while an equation is true for some, and solving it means finding them all. The basic cases, $\sin x=c$, $\cos x=c$ and $\tan x=c$, are in [the article on basic trigonometry](article:basic-trigonometry#equations). Here is what comes after them: how to list solutions in an interval, equations with multiple angles, quadratic ones, ones that need an identity, why some steps lose solutions or add false ones, and what to do when no formula exists.

Angles are in degrees below, as they are in the other trigonometry articles, except in the last sections, where an equation mixes the unknown with a plain number and radians are the only choice. To use radians elsewhere, replace $360^\circ$ by $2\pi$ and $180^\circ$ by $\pi$.`,
            T`**Persamaan trigonometri adalah persamaan yang bilangan tak diketahuinya adalah sudut di dalam satu atau lebih fungsi trigonometri, seperti $\sin x=\frac12$ atau $2\cos^2x=\cos x$; karena fungsinya berulang, sebuah penyelesaian tidak pernah sendirian.** Jika $x$ menyelesaikan $\sin x=\frac12$ maka $x+360^\circ$ juga, dan $x-360^\circ$ juga, karena satu putaran penuh membawa titik pada lingkaran satuan kembali ke tempat yang sama. Sinus dan kosinus berulang setiap $360^\circ$ (yaitu $2\pi$ radian), dan tangen setiap $180^\circ$ ($\pi$ radian). Jadi jawaban sebuah persamaan adalah **sebuah keluarga** yang memuat bilangan bulat $n$, atau **sebuah daftar** penyelesaian dalam interval yang disebut soal.

Inilah yang membedakan persamaan dari identitas (lihat [artikel tentang identitas](article:trigonometric-identities#identity-or-equation)): identitas benar untuk setiap sudut, sedangkan persamaan benar untuk sebagian, dan menyelesaikannya berarti menemukan semuanya. Kasus dasar $\sin x=c$, $\cos x=c$, dan $\tan x=c$ ada di [artikel trigonometri dasar](article:basic-trigonometry#equations). Di sini yang datang sesudahnya: cara mendaftar penyelesaian dalam interval, persamaan dengan sudut kelipatan, persamaan kuadrat, persamaan yang memerlukan identitas, mengapa sebagian langkah menghilangkan penyelesaian atau menambah yang palsu, dan apa yang dilakukan bila tak ada rumus.

Sudut di bawah ini dalam derajat, seperti pada artikel trigonometri lain, kecuali di bagian terakhir, ketika persamaan mencampur bilangan tak diketahui dengan bilangan biasa dan radian adalah satu-satunya pilihan. Untuk memakai radian di tempat lain, ganti $360^\circ$ dengan $2\pi$ dan $180^\circ$ dengan $\pi$.`,
          ),
        },
        FIG_MANY,
      ],
    },

    /* --------------------------------------------------------------------------- in an interval */
    {
      id: 'in-an-interval',
      heading: L('How do you pick the solutions that lie in a given interval?', 'Bagaimana memilih penyelesaian yang berada dalam interval tertentu?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To list the solutions in an interval, write the general solution with a whole number $n$, put it into the inequality that describes the interval, and keep the whole numbers $n$ that fit.** The interval then chooses the members of each family, and nothing is guessed.

For $\sin x=\frac12$ with $-180^\circ\le x<540^\circ$ the two families are $30^\circ+360^\circ n$ and $150^\circ+360^\circ n$:

| $n$ | $30^\circ+360^\circ n$ | in the interval? | $150^\circ+360^\circ n$ | in the interval? |
|---|---|---|---|---|
| $-1$ | $-330^\circ$ | no | $-210^\circ$ | no |
| $0$ | $30^\circ$ | yes | $150^\circ$ | yes |
| $1$ | $390^\circ$ | yes | $510^\circ$ | yes |
| $2$ | $750^\circ$ | no | $870^\circ$ | no |

So $x=30^\circ,\ 150^\circ,\ 390^\circ,\ 510^\circ$. For $\tan x=\sqrt3$ with $-360^\circ\le x\le360^\circ$ there is only one family, $60^\circ+180^\circ n$, and $-360\le60+180n\le360$ means $-2.33\le n\le1.67$, so $n=-2,-1,0,1$ and $x=-300^\circ,\ -120^\circ,\ 60^\circ,\ 240^\circ$.

You can also predict how many there will be. An interval that is $L$ degrees long holds $\frac{L}{360}$ turns, and for $|c|<1$ each turn contains two solutions of $\sin x=c$ and two of $\cos x=c$, while each $180^\circ$ contains one solution of $\tan x=c$. At the ends of the range, $c=\pm1$ for sine and cosine, the two families coincide and there is only one solution per turn: the wave touches the line instead of crossing it. In radians the same interval $0\le x<2\pi$ has $\sin x=\frac12$ solved by $\frac{\pi}{6}$ and $\frac{5\pi}{6}$.`,
            T`**Untuk mendaftar penyelesaian dalam suatu interval, tulis penyelesaian umum dengan bilangan bulat $n$, masukkan ke pertidaksamaan yang menyatakan interval itu, dan ambil bilangan bulat $n$ yang cocok.** Interval-lah yang memilih anggota tiap keluarga, tanpa menebak.

Untuk $\sin x=\frac12$ dengan $-180^\circ\le x<540^\circ$, kedua keluarganya adalah $30^\circ+360^\circ n$ dan $150^\circ+360^\circ n$:

| $n$ | $30^\circ+360^\circ n$ | di dalam interval? | $150^\circ+360^\circ n$ | di dalam interval? |
|---|---|---|---|---|
| $-1$ | $-330^\circ$ | tidak | $-210^\circ$ | tidak |
| $0$ | $30^\circ$ | ya | $150^\circ$ | ya |
| $1$ | $390^\circ$ | ya | $510^\circ$ | ya |
| $2$ | $750^\circ$ | tidak | $870^\circ$ | tidak |

Jadi $x=30^\circ,\ 150^\circ,\ 390^\circ,\ 510^\circ$. Untuk $\tan x=\sqrt3$ dengan $-360^\circ\le x\le360^\circ$ hanya ada satu keluarga, $60^\circ+180^\circ n$, dan $-360\le60+180n\le360$ berarti $-2{,}33\le n\le1{,}67$, sehingga $n=-2,-1,0,1$ dan $x=-300^\circ,\ -120^\circ,\ 60^\circ,\ 240^\circ$.

Kita juga dapat memperkirakan banyaknya. Interval sepanjang $L$ derajat memuat $\frac{L}{360}$ putaran, dan untuk $|c|<1$ setiap putaran memuat dua penyelesaian $\sin x=c$ dan dua penyelesaian $\cos x=c$, sedangkan setiap $180^\circ$ memuat satu penyelesaian $\tan x=c$. Di ujung jangkauan, $c=\pm1$ untuk sinus dan kosinus, kedua keluarga berimpit dan hanya ada satu penyelesaian per putaran: gelombang menyentuh garis, bukan memotongnya. Dalam radian, interval $0\le x<2\pi$ yang sama memberi $\sin x=\frac12$ dengan penyelesaian $\frac{\pi}{6}$ dan $\frac{5\pi}{6}$.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------- multiple angles */
    {
      id: 'multiple-angles',
      heading: L('How do you solve an equation like sin 2x = 1/2, where the angle is a multiple of x?', 'Bagaimana menyelesaikan persamaan seperti sin 2x = 1/2, dengan sudut kelipatan x?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To solve $\sin(kx+b)=c$ with $k>0$, solve the basic equation for the whole angle $u=kx+b$ over an interval that is $k$ times as long, then subtract $b$ and divide by $k$.** The step that people skip is the first one: when $x$ runs from $0^\circ$ to $360^\circ$, the angle $u=2x$ runs from $0^\circ$ to $720^\circ$, two full turns, so there are twice as many solutions.

**Example.** $\sin2x=\frac12$ for $0^\circ\le x<360^\circ$. Put $u=2x$, so $0^\circ\le u<720^\circ$. Then $\sin u=\frac12$ gives $u=30^\circ,\ 150^\circ,\ 390^\circ,\ 510^\circ$ and, halving, $x=15^\circ,\ 75^\circ,\ 195^\circ,\ 255^\circ$. Four solutions, not two. Solving only $2x=30^\circ$ and $2x=150^\circ$ would find the first two and miss the second turn.

**With a shift.** $\cos(3x-30^\circ)=\frac12$ for $0^\circ\le x<360^\circ$. Put $u=3x-30^\circ$, so $-30^\circ\le u<1050^\circ$. Then $\cos u=\frac12$ gives $u=60^\circ,\ 300^\circ,\ 420^\circ,\ 660^\circ,\ 780^\circ,\ 1020^\circ$ (the value $-60^\circ$ is below the range), and $x=\frac{u+30^\circ}{3}=30^\circ,\ 110^\circ,\ 150^\circ,\ 230^\circ,\ 270^\circ,\ 350^\circ$. The count follows a rule: **in one turn there are $2k$ solutions** ($k$ of them when $c=\pm1$ for sine and cosine), and they repeat every $\frac{360^\circ}{k}$, or $\frac{180^\circ}{k}$ for tangent. If $k$ is negative, use $\sin(-u)=-\sin u$ and $\cos(-u)=\cos u$ to make it positive first.

Try other values of $k$, $b$ and $c$ below, and read off the general solution.`,
            T`**Untuk menyelesaikan $\sin(kx+b)=c$ dengan $k>0$, selesaikan persamaan dasar untuk seluruh sudut $u=kx+b$ pada interval yang $k$ kali lebih panjang, lalu kurangi $b$ dan bagi $k$.** Langkah yang sering dilewati adalah yang pertama: ketika $x$ berjalan dari $0^\circ$ sampai $360^\circ$, sudut $u=2x$ berjalan dari $0^\circ$ sampai $720^\circ$, dua putaran penuh, sehingga penyelesaiannya dua kali lebih banyak.

**Contoh.** $\sin2x=\frac12$ untuk $0^\circ\le x<360^\circ$. Misalkan $u=2x$, sehingga $0^\circ\le u<720^\circ$. Maka $\sin u=\frac12$ memberi $u=30^\circ,\ 150^\circ,\ 390^\circ,\ 510^\circ$ dan, setelah dibagi dua, $x=15^\circ,\ 75^\circ,\ 195^\circ,\ 255^\circ$. Empat penyelesaian, bukan dua. Hanya menyelesaikan $2x=30^\circ$ dan $2x=150^\circ$ akan menemukan dua yang pertama dan melewatkan putaran kedua.

**Dengan pergeseran.** $\cos(3x-30^\circ)=\frac12$ untuk $0^\circ\le x<360^\circ$. Misalkan $u=3x-30^\circ$, sehingga $-30^\circ\le u<1050^\circ$. Maka $\cos u=\frac12$ memberi $u=60^\circ,\ 300^\circ,\ 420^\circ,\ 660^\circ,\ 780^\circ,\ 1020^\circ$ (nilai $-60^\circ$ berada di bawah jangkauan), dan $x=\frac{u+30^\circ}{3}=30^\circ,\ 110^\circ,\ 150^\circ,\ 230^\circ,\ 270^\circ,\ 350^\circ$. Banyaknya mengikuti aturan: **dalam satu putaran ada $2k$ penyelesaian** ($k$ penyelesaian bila $c=\pm1$ untuk sinus dan kosinus), dan berulang setiap $\frac{360^\circ}{k}$, atau $\frac{180^\circ}{k}$ untuk tangen. Bila $k$ negatif, pakai $\sin(-u)=-\sin u$ dan $\cos(-u)=\cos u$ untuk membuatnya positif terlebih dulu.

Coba nilai $k$, $b$, dan $c$ lain di bawah, dan baca penyelesaian umumnya.`,
          ),
        },
        FIG_MULTI,
        { kind: 'widget', name: 'eqsolve' },
      ],
    },

    /* ------------------------------------------------------------------------------- quadratic */
    {
      id: 'quadratic',
      heading: L('How do you solve an equation that is quadratic in sin x, cos x or tan x?', 'Bagaimana menyelesaikan persamaan yang kuadrat dalam sin x, cos x, atau tan x?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An equation that is quadratic in one trigonometric function is solved by writing $u$ for that function, solving the quadratic in $u$, and then solving a basic equation for each root, keeping a root only if some angle can reach it.** For sine and cosine the roots must lie between $-1$ and $1$; for tangent every root is allowed.

1. Replace the function by $u$: $2\sin^2x-\sin x-1=0$ becomes $2u^2-u-1=0$.
2. Solve for $u$ by factoring or the quadratic formula: $(2u+1)(u-1)=0$, so $u=-\frac12$ or $u=1$.
3. Discard any root with $|u|>1$ when $u$ is a sine or a cosine.
4. For each root left, solve $\sin x=u$: $\sin x=-\frac12$ gives $210^\circ$ and $330^\circ$, and $\sin x=1$ gives $90^\circ$.
5. List all the angles: $x=90^\circ,\ 210^\circ,\ 330^\circ$.

Notice that there are three solutions and not four. The root $u=1$ is the highest value the sine reaches, so it is reached once per turn, as in the picture: the curve touches the axis there.`,
            T`**Persamaan yang kuadrat dalam satu fungsi trigonometri diselesaikan dengan menulis $u$ untuk fungsi itu, menyelesaikan kuadrat dalam $u$, lalu menyelesaikan satu persamaan dasar untuk setiap akar, dan hanya menyimpan akar yang dapat dicapai suatu sudut.** Untuk sinus dan kosinus akarnya harus di antara $-1$ dan $1$; untuk tangen setiap akar diperbolehkan.

1. Ganti fungsinya dengan $u$: $2\sin^2x-\sin x-1=0$ menjadi $2u^2-u-1=0$.
2. Cari $u$ dengan pemfaktoran atau rumus kuadrat: $(2u+1)(u-1)=0$, sehingga $u=-\frac12$ atau $u=1$.
3. Buang akar dengan $|u|>1$ bila $u$ adalah sinus atau kosinus.
4. Untuk setiap akar yang tersisa, selesaikan $\sin x=u$: $\sin x=-\frac12$ memberi $210^\circ$ dan $330^\circ$, dan $\sin x=1$ memberi $90^\circ$.
5. Daftar semua sudutnya: $x=90^\circ,\ 210^\circ,\ 330^\circ$.

Perhatikan bahwa penyelesaiannya tiga, bukan empat. Akar $u=1$ adalah nilai tertinggi yang dicapai sinus, sehingga dicapai sekali per putaran, seperti pada gambar: kurvanya menyentuh sumbu di sana.`,
          ),
        },
        FIG_QUAD,
        {
          kind: 'text',
          text: L(
            T`**When a root is outside the range.** $\sin^2x-\sin x-2=0$ factors as $(\sin x-2)(\sin x+1)=0$. The root $\sin x=2$ is impossible, because no angle has a sine above $1$, and $\sin x=-1$ gives $x=270^\circ$. So the single solution is $270^\circ$. In the same way $\cos^2x=4$ has the roots $\cos x=2$ and $\cos x=-2$ and no solution at all. With tangent there is no such limit: $\tan^2x=3$ gives $\tan x=\pm\sqrt3$ and $x=60^\circ,\ 120^\circ,\ 240^\circ,\ 300^\circ$.

Set the coefficients below to see the roots $u$, which of them an angle can reach, and the graph of the left side.`,
            T`**Bila akar berada di luar jangkauan.** $\sin^2x-\sin x-2=0$ difaktorkan menjadi $(\sin x-2)(\sin x+1)=0$. Akar $\sin x=2$ mustahil, karena tak ada sudut dengan sinus di atas $1$, dan $\sin x=-1$ memberi $x=270^\circ$. Jadi satu-satunya penyelesaian adalah $270^\circ$. Dengan cara yang sama $\cos^2x=4$ punya akar $\cos x=2$ dan $\cos x=-2$ dan sama sekali tak punya penyelesaian. Pada tangen tidak ada batas seperti itu: $\tan^2x=3$ memberi $\tan x=\pm\sqrt3$ dan $x=60^\circ,\ 120^\circ,\ 240^\circ,\ 300^\circ$.

Atur koefisien di bawah untuk melihat akar $u$, mana yang dapat dicapai sebuah sudut, dan grafik ruas kirinya.`,
          ),
        },
        { kind: 'widget', name: 'eqquad' },
      ],
    },

    /* ------------------------------------------------------------------------------ do not divide */
    {
      id: 'do-not-divide',
      heading: L('Why should you never divide both sides by sin x or cos x?', 'Mengapa kita tidak boleh membagi kedua ruas dengan sin x atau cos x?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Dividing both sides by $\sin x$ or $\cos x$ is only valid at the angles where that function is not zero, and the angles where it is zero may be solutions, which the division silently throws away.** The safe move is the one from algebra: bring everything to one side and factor.

Take $\sin2x=\cos x$ on $0^\circ\le x<360^\circ$.

| Dividing | Factoring |
|---|---|
| $2\sin x\cos x=\cos x$ | $2\sin x\cos x-\cos x=0$ |
| divide by $\cos x$: $2\sin x=1$ | $\cos x\,(2\sin x-1)=0$ |
| $x=30^\circ,\ 150^\circ$ | $\cos x=0$ gives $90^\circ,\ 270^\circ$; $\sin x=\frac12$ gives $30^\circ,\ 150^\circ$ |
| **2 solutions, two lost** | **4 solutions** |

The lost angles, $90^\circ$ and $270^\circ$, are exactly the ones where $\cos x=0$, the thing that was divided by. The same happens with $\tan x=2\sin x$: writing $\tan x=\frac{\sin x}{\cos x}$ and then cancelling $\sin x$ loses $0^\circ$ and $180^\circ$, while $\sin x\,(1-2\cos x)=0$ after multiplying by $\cos x$ finds $\sin x=0$ and $\cos x=\frac12$ and so $0^\circ,\ 60^\circ,\ 180^\circ,\ 300^\circ$. If you do want to divide, first solve the case where the divisor is zero on its own, then divide and solve the rest.`,
            T`**Membagi kedua ruas dengan $\sin x$ atau $\cos x$ hanya sah pada sudut yang fungsi itu tidak nol, dan sudut yang membuatnya nol bisa jadi penyelesaian, yang diam-diam dibuang oleh pembagian itu.** Langkah yang aman adalah langkah dari aljabar: bawa semuanya ke satu ruas lalu faktorkan.

Ambil $\sin2x=\cos x$ pada $0^\circ\le x<360^\circ$.

| Membagi | Memfaktorkan |
|---|---|
| $2\sin x\cos x=\cos x$ | $2\sin x\cos x-\cos x=0$ |
| bagi dengan $\cos x$: $2\sin x=1$ | $\cos x\,(2\sin x-1)=0$ |
| $x=30^\circ,\ 150^\circ$ | $\cos x=0$ memberi $90^\circ,\ 270^\circ$; $\sin x=\frac12$ memberi $30^\circ,\ 150^\circ$ |
| **2 penyelesaian, dua hilang** | **4 penyelesaian** |

Sudut yang hilang, $90^\circ$ dan $270^\circ$, tepat yang membuat $\cos x=0$, yaitu pembagi tadi. Hal yang sama terjadi pada $\tan x=2\sin x$: menulis $\tan x=\frac{\sin x}{\cos x}$ lalu mencoret $\sin x$ menghilangkan $0^\circ$ dan $180^\circ$, sedangkan $\sin x\,(1-2\cos x)=0$ setelah dikalikan $\cos x$ menemukan $\sin x=0$ dan $\cos x=\frac12$ sehingga $0^\circ,\ 60^\circ,\ 180^\circ,\ 300^\circ$. Bila memang ingin membagi, selesaikan dulu kasus ketika pembaginya nol secara terpisah, baru bagi dan selesaikan sisanya.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- use identities */
    {
      id: 'use-identities',
      heading: L('Which identity should you use to turn a hard equation into an easy one?', 'Identitas mana yang dipakai untuk mengubah persamaan sulit menjadi mudah?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Use the identity that leaves a single trigonometric function of a single angle, because that is the form you already know how to solve.** What you see in the equation tells you which one.

| What the equation has | The identity | Example |
|---|---|---|
| the same function of $x$ and $2x$ | $\sin2x=2\sin x\cos x$ | $\sin2x=\cos x$ |
| $\cos2x$ together with $\cos x$ | $\cos2x=2\cos^2x-1$ | $\cos2x=\cos x$ |
| squares of sine and cosine together | $\cos^2x=1-\sin^2x$ | $2\cos^2x+3\sin x=3$ |
| a difference of two sines or cosines | sum-to-product | $\sin3x=\sin x$ |
| a product $\sin x\cos x$ | $\sin x\cos x=\frac12\sin2x$ | $\sin x\cos x=\frac14$ |
| a tangent beside a sine | $\tan x=\frac{\sin x}{\cos x}$, then factor | $\tan x=2\sin x$ |
| $a\sin x+b\cos x$ | one wave $R\sin(x+\varphi)$ | $3\sin x+4\cos x=2.5$ |

The formulas themselves are derived in [the article on the double-angle formulas](article:trigonometric-identities#double-and-half). **A worked example:** $\sin3x=\sin x$. Move everything to one side, $\sin3x-\sin x=0$, and use the sum-to-product formula, $\sin3x-\sin x=2\cos2x\,\sin x$. A product is zero when a factor is, so $\sin x=0$, giving $0^\circ,\ 180^\circ$, or $\cos2x=0$, giving $2x=90^\circ+180^\circ n$ and $x=45^\circ,\ 135^\circ,\ 225^\circ,\ 315^\circ$. Six solutions. Another route, with the triple-angle formula, reaches the same six but with more algebra, which is why the choice of identity matters.

Below are eleven equations solved one line at a time, each line with the reason for it. Their graphs show both sides and where they meet.`,
            T`**Pakailah identitas yang meninggalkan satu fungsi trigonometri dari satu sudut, karena itulah bentuk yang sudah kita tahu cara menyelesaikannya.** Apa yang tampak pada persamaan menunjukkan identitas mana.

| Isi persamaan | Identitasnya | Contoh |
|---|---|---|
| fungsi yang sama dari $x$ dan $2x$ | $\sin2x=2\sin x\cos x$ | $\sin2x=\cos x$ |
| $\cos2x$ bersama $\cos x$ | $\cos2x=2\cos^2x-1$ | $\cos2x=\cos x$ |
| kuadrat sinus dan kosinus bersama | $\cos^2x=1-\sin^2x$ | $2\cos^2x+3\sin x=3$ |
| selisih dua sinus atau kosinus | jumlah menjadi hasil kali | $\sin3x=\sin x$ |
| hasil kali $\sin x\cos x$ | $\sin x\cos x=\frac12\sin2x$ | $\sin x\cos x=\frac14$ |
| tangen di samping sinus | $\tan x=\frac{\sin x}{\cos x}$, lalu faktorkan | $\tan x=2\sin x$ |
| $a\sin x+b\cos x$ | satu gelombang $R\sin(x+\varphi)$ | $3\sin x+4\cos x=2{,}5$ |

Rumus-rumusnya diturunkan di [artikel tentang rumus sudut ganda](article:trigonometric-identities#double-and-half). **Contoh yang dikerjakan:** $\sin3x=\sin x$. Pindahkan semuanya ke satu ruas, $\sin3x-\sin x=0$, dan pakai rumus jumlah menjadi hasil kali, $\sin3x-\sin x=2\cos2x\,\sin x$. Hasil kali bernilai nol bila salah satu faktornya nol, jadi $\sin x=0$, memberi $0^\circ,\ 180^\circ$, atau $\cos2x=0$, memberi $2x=90^\circ+180^\circ n$ dan $x=45^\circ,\ 135^\circ,\ 225^\circ,\ 315^\circ$. Enam penyelesaian. Jalan lain, dengan rumus sudut rangkap tiga, mencapai enam yang sama tetapi dengan aljabar lebih banyak, itulah sebabnya pemilihan identitas penting.

Di bawah ada sebelas persamaan yang diselesaikan satu baris demi satu baris, masing-masing baris dengan alasannya. Grafiknya memperlihatkan kedua ruas dan tempat keduanya bertemu.`,
          ),
        },
        { kind: 'widget', name: 'eqsteps' },
      ],
    },

    /* --------------------------------------------------------------------------- sine plus cosine */
    {
      id: 'sine-plus-cosine',
      heading: L('How do you solve a sin x + b cos x = c?', 'Bagaimana menyelesaikan a sin x + b cos x = c?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To solve $a\sin x+b\cos x=c$, write the left side as one wave $R\sin(x+\varphi)$ with $R=\sqrt{a^2+b^2}$ and $\varphi=\operatorname{atan2}(b,a)$; the equation becomes $\sin(x+\varphi)=\frac{c}{R}$, a basic one.** This works exactly when $|c|\le R$, because $R$ is the highest value the wave reaches. The conversion is derived in [the article on product-to-sum formulas and the single wave](article:trigonometric-identities#product-and-sum).

**Example.** $\sqrt3\sin x+\cos x=1$. Here $R=\sqrt{3+1}=2$ and $\varphi=\operatorname{atan2}(1,\sqrt3)=30^\circ$, so $2\sin(x+30^\circ)=1$, that is $\sin(x+30^\circ)=\frac12$. Then $x+30^\circ=30^\circ$ or $150^\circ$ (plus $360^\circ n$), so $x=0^\circ$ or $x=120^\circ$. Check the second: $\sqrt3\sin120^\circ+\cos120^\circ=\frac32-\frac12=1$. With less friendly numbers the steps are the same: $3\sin x+4\cos x=2.5$ has $R=5$, $\varphi\approx53.13^\circ$ and the solutions $96.87^\circ$ and $336.87^\circ$. If $c$ is bigger than $R$ there is no solution: $3\sin x+4\cos x=6$ is impossible, since the left side never exceeds $5$.

There are two other ways. **Squaring** (isolate one term, square, use $\sin^2x+\cos^2x=1$) always works but adds false roots, covered next. **The half-angle substitution** $t=\tan\frac{x}{2}$ turns $\sin x$ into $\frac{2t}{1+t^2}$ and $\cos x$ into $\frac{1-t^2}{1+t^2}$ and the equation into a quadratic in $t$; it loses $x=180^\circ$, where $\tan\frac{x}{2}$ does not exist, so that angle has to be tried separately. The single wave needs neither check, which is why it is the first choice.`,
            T`**Untuk menyelesaikan $a\sin x+b\cos x=c$, tulis ruas kiri sebagai satu gelombang $R\sin(x+\varphi)$ dengan $R=\sqrt{a^2+b^2}$ dan $\varphi=\operatorname{atan2}(b,a)$; persamaannya menjadi $\sin(x+\varphi)=\frac{c}{R}$, persamaan dasar.** Ini berhasil tepat ketika $|c|\le R$, karena $R$ adalah nilai tertinggi yang dicapai gelombang. Pengubahannya diturunkan di [artikel tentang rumus hasil kali menjadi jumlah dan satu gelombang](article:trigonometric-identities#product-and-sum).

**Contoh.** $\sqrt3\sin x+\cos x=1$. Di sini $R=\sqrt{3+1}=2$ dan $\varphi=\operatorname{atan2}(1,\sqrt3)=30^\circ$, sehingga $2\sin(x+30^\circ)=1$, yaitu $\sin(x+30^\circ)=\frac12$. Maka $x+30^\circ=30^\circ$ atau $150^\circ$ (ditambah $360^\circ n$), sehingga $x=0^\circ$ atau $x=120^\circ$. Periksa yang kedua: $\sqrt3\sin120^\circ+\cos120^\circ=\frac32-\frac12=1$. Dengan bilangan yang kurang ramah langkahnya sama: $3\sin x+4\cos x=2{,}5$ memiliki $R=5$, $\varphi\approx53{,}13^\circ$, dan penyelesaian $96{,}87^\circ$ dan $336{,}87^\circ$. Bila $c$ lebih besar dari $R$ tidak ada penyelesaian: $3\sin x+4\cos x=6$ mustahil, karena ruas kiri tidak pernah melebihi $5$.

Ada dua cara lain. **Mengkuadratkan** (pisahkan satu suku, kuadratkan, pakai $\sin^2x+\cos^2x=1$) selalu berhasil tetapi menambah akar palsu, yang dibahas berikutnya. **Substitusi sudut paruh** $t=\tan\frac{x}{2}$ mengubah $\sin x$ menjadi $\frac{2t}{1+t^2}$ dan $\cos x$ menjadi $\frac{1-t^2}{1+t^2}$ dan persamaan menjadi kuadrat dalam $t$; ia menghilangkan $x=180^\circ$, tempat $\tan\frac{x}{2}$ tidak ada, sehingga sudut itu harus dicoba terpisah. Satu gelombang tidak memerlukan pemeriksaan tambahan apa pun, itulah sebabnya ia pilihan pertama.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------ false roots */
    {
      id: 'false-roots',
      heading: L('Why do some answers fail when you check them, and how do you avoid false roots?', 'Mengapa sebagian jawaban gagal saat diperiksa, dan bagaimana menghindari akar palsu?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A false (extraneous) root is an answer that the steps produce but that does not satisfy the original equation; it appears whenever a step is not reversible, such as squaring, and the cure is to check every candidate in the original equation.** Squaring turns $A=B$ into $A^2=B^2$, which is also true when $A=-B$. Multiplying by an expression that can be zero has the same effect.

**Example.** Solve $\sin x+\cos x=1$ on $0^\circ\le x<360^\circ$. Squaring gives $\sin^2x+2\sin x\cos x+\cos^2x=1$, which is $1+\sin2x=1$, so $\sin2x=0$ and $2x=0^\circ,\ 180^\circ,\ 360^\circ,\ 540^\circ$, that is $x=0^\circ,\ 90^\circ,\ 180^\circ,\ 270^\circ$. Now check each in the original: at $0^\circ$ the sum is $0+1=1$ (true), at $90^\circ$ it is $1+0=1$ (true), at $180^\circ$ it is $0-1=-1$ (false) and at $270^\circ$ it is $-1+0=-1$ (false). The solutions are $0^\circ$ and $90^\circ$; the other two solve $\sin x+\cos x=-1$, the equation that squaring also contains. Doing it with the single wave, $\sqrt2\sin(x+45^\circ)=1$, gives $x+45^\circ=45^\circ$ or $135^\circ$ and the same two answers with nothing to check.

**Undefined angles are false roots too.** $\tan x\cos x=1$ simplifies to $\sin x=1$, which suggests $x=90^\circ$. But $\tan90^\circ$ does not exist, so $90^\circ$ is not a solution, and the equation has none at all. The same care applies to anything with $\tan$, $\sec$, $\csc$, $\cot$, a denominator or a square root: list the angles the original equation forbids before you start, and cross them off at the end.

| The step | What can happen | What to do |
|---|---|---|
| square both sides | adds roots (the case $A=-B$) | check each candidate |
| multiply by an expression with $x$ | adds roots where it is zero | check each candidate |
| divide by an expression with $x$ | loses roots where it is zero | solve that case separately |
| a function that is undefined somewhere | the angle is not allowed | cross it off |

Finally, an equation with no real solution may still have complex ones: $\sin x=2$ has none among real angles, but with Euler's formula one finds $x=\frac{\pi}{2}\pm i\ln(2+\sqrt3)$, where $\ln(2+\sqrt3)\approx1.317$.`,
            T`**Akar palsu (extraneous) adalah jawaban yang dihasilkan langkah-langkah tetapi tidak memenuhi persamaan semula; ia muncul setiap kali ada langkah yang tidak dapat dibalik, seperti mengkuadratkan, dan obatnya adalah memeriksa setiap kandidat pada persamaan semula.** Mengkuadratkan mengubah $A=B$ menjadi $A^2=B^2$, yang juga benar bila $A=-B$. Mengalikan dengan ekspresi yang bisa nol berakibat sama.

**Contoh.** Selesaikan $\sin x+\cos x=1$ pada $0^\circ\le x<360^\circ$. Mengkuadratkan memberi $\sin^2x+2\sin x\cos x+\cos^2x=1$, yaitu $1+\sin2x=1$, sehingga $\sin2x=0$ dan $2x=0^\circ,\ 180^\circ,\ 360^\circ,\ 540^\circ$, yaitu $x=0^\circ,\ 90^\circ,\ 180^\circ,\ 270^\circ$. Sekarang periksa masing-masing pada persamaan semula: pada $0^\circ$ jumlahnya $0+1=1$ (benar), pada $90^\circ$ jumlahnya $1+0=1$ (benar), pada $180^\circ$ jumlahnya $0-1=-1$ (salah), dan pada $270^\circ$ jumlahnya $-1+0=-1$ (salah). Penyelesaiannya $0^\circ$ dan $90^\circ$; dua lainnya menyelesaikan $\sin x+\cos x=-1$, persamaan yang juga terkandung dalam pengkuadratan. Dengan satu gelombang, $\sqrt2\sin(x+45^\circ)=1$, diperoleh $x+45^\circ=45^\circ$ atau $135^\circ$ dan dua jawaban yang sama tanpa ada yang perlu diperiksa.

**Sudut yang tak terdefinisi juga akar palsu.** $\tan x\cos x=1$ menyederhana menjadi $\sin x=1$, yang menyarankan $x=90^\circ$. Tetapi $\tan90^\circ$ tidak ada, sehingga $90^\circ$ bukan penyelesaian, dan persamaan ini sama sekali tak punya penyelesaian. Kehati-hatian yang sama berlaku untuk apa pun yang memuat $\tan$, $\sec$, $\csc$, $\cot$, penyebut, atau akar kuadrat: daftar sudut yang dilarang persamaan semula sebelum mulai, dan coret di akhir.

| Langkahnya | Yang dapat terjadi | Yang dilakukan |
|---|---|---|
| mengkuadratkan kedua ruas | menambah akar (kasus $A=-B$) | periksa tiap kandidat |
| mengalikan dengan ekspresi yang memuat $x$ | menambah akar di tempat ia nol | periksa tiap kandidat |
| membagi dengan ekspresi yang memuat $x$ | menghilangkan akar di tempat ia nol | selesaikan kasus itu terpisah |
| fungsi yang tak terdefinisi di suatu tempat | sudut itu tidak diperbolehkan | coret |

Terakhir, persamaan tanpa penyelesaian real masih bisa punya penyelesaian kompleks: $\sin x=2$ tak punya penyelesaian di antara sudut real, tetapi dengan rumus Euler diperoleh $x=\frac{\pi}{2}\pm i\ln(2+\sqrt3)$, dengan $\ln(2+\sqrt3)\approx1{,}317$.`,
          ),
        },
        FIG_FALSE,
      ],
    },

    /* ---------------------------------------------------------------------------------- numeric */
    {
      id: 'numerical',
      heading: L('What if no formula works? Solving cos x = x with graphs, bisection and Newton\'s method', 'Bagaimana jika tak ada rumus yang cocok? Menyelesaikan cos x = x dengan grafik, bisection, dan metode Newton'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**When the unknown appears both as a plain number and inside a trigonometric function, as in $\cos x=x$, no algebra gives the answer, so you graph the equation, trap a root between two points where the sign changes, and close in with bisection or Newton's method.** Now $x$ is a number, not an angle in degrees, and it has to be in **radians**: $\cos x=x$ has a root at $0.7391$, and a calculator in degree mode would answer a different question.

1. **Graph it.** Draw $y=\cos x$ and $y=x$, or $f(x)=\cos x-x$ and look where it crosses zero. This shows how many roots there are (one here, because $\cos x$ falls while $x$ rises) and roughly where.
2. **Bracket it.** Find $a<b$ with $f(a)$ and $f(b)$ of opposite signs: $f(0)=1>0$ and $f(1)=-0.46<0$. A continuous function that changes sign must be zero somewhere in between.
3. **Bisection.** Look at the midpoint and keep the half in which the sign still changes. The interval halves every step, so the error after $n$ steps is at most $\frac{b-a}{2^n}$: one more binary digit, about $0.3$ of a decimal digit, per step. Forty steps give twelve decimals. It is slow but cannot fail.
4. **Newton's method.** From a guess $x$, follow the tangent line to the axis: $x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$, here with $f'(x)=-\sin x-1$. Near a root it roughly doubles the number of correct digits each step (see [the article on Newton's method](article:newtons-method#convergence)) but it needs a good start and can fail (see [where it goes wrong](article:newtons-method#failures)).

The table shows both on $\cos x=x$, bisection on $[0,1]$ and Newton from $x_0=1$; the root is $0.7390851332$.

${iterTable('en')}

Pressing the cosine key again and again on a calculator in radian mode does converge to the same number, because $x_{n+1}=\cos x_n$ shrinks the distance to the root by a factor of about $\sin0.739\approx0.67$ each time, which is slow compared with Newton. Pick another equation below, or step through each method.`,
            T`**Bila bilangan tak diketahui muncul sebagai bilangan biasa sekaligus di dalam fungsi trigonometri, seperti pada $\cos x=x$, tak ada aljabar yang memberi jawabannya, sehingga kita menggambar grafiknya, mengurung akar di antara dua titik yang tandanya berubah, lalu mendekatinya dengan bisection atau metode Newton.** Sekarang $x$ adalah bilangan, bukan sudut dalam derajat, dan ia harus dalam **radian**: $\cos x=x$ punya akar di $0{,}7391$, dan kalkulator dengan mode derajat menjawab pertanyaan yang lain.

1. **Gambar grafiknya.** Gambar $y=\cos x$ dan $y=x$, atau $f(x)=\cos x-x$ dan lihat di mana ia memotong nol. Ini menunjukkan banyaknya akar (satu di sini, karena $\cos x$ turun sedangkan $x$ naik) dan kira-kira letaknya.
2. **Apit akarnya.** Cari $a<b$ dengan $f(a)$ dan $f(b)$ berlawanan tanda: $f(0)=1>0$ dan $f(1)=-0{,}46<0$. Fungsi kontinu yang berubah tanda pasti bernilai nol di suatu titik di antaranya.
3. **Bisection.** Lihat titik tengahnya dan simpan separuh yang tandanya masih berubah. Interval terbelah dua setiap langkah, sehingga galat setelah $n$ langkah paling banyak $\frac{b-a}{2^n}$: satu angka biner lagi, sekitar $0{,}3$ angka desimal, per langkah. Empat puluh langkah memberi dua belas desimal. Lambat tetapi tidak pernah gagal.
4. **Metode Newton.** Dari tebakan $x$, ikuti garis singgung sampai sumbu: $x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$, di sini dengan $f'(x)=-\sin x-1$. Dekat akar ia kira-kira menggandakan banyaknya angka benar tiap langkah (lihat [artikel tentang metode Newton](article:newtons-method#convergence)) tetapi memerlukan awal yang baik dan dapat gagal (lihat [tempat ia salah](article:newtons-method#failures)).

Tabel memperlihatkan keduanya pada $\cos x=x$, bisection pada $[0,1]$ dan Newton dari $x_0=1$; akarnya $0{,}7390851332$.

${iterTable('id')}

Menekan tombol kosinus berulang-ulang pada kalkulator mode radian memang menuju bilangan yang sama, karena $x_{n+1}=\cos x_n$ mengecilkan jarak ke akar dengan faktor sekitar $\sin0{,}739\approx0{,}67$ tiap kali, yang lambat dibandingkan Newton. Pilih persamaan lain di bawah, atau telusuri tiap metode langkah demi langkah.`,
          ),
        },
        FIG_BISECT,
        { kind: 'widget', name: 'eqnumeric' },
      ],
    },

    /* ------------------------------------------------------------------------------------ code */
    {
      id: 'equations-in-code',
      heading: L('How do you solve trigonometric equations in a program?', 'Bagaimana menyelesaikan persamaan trigonometri dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program solves $\sin(kx+b)=c$ by the same steps as on paper: take the principal angle with ´asin´, add its mirror image, step through the whole numbers $n$ and keep the $x$ that fall in the interval.** Three details matter. ´asin´ and ´acos´ return only one angle (´asin´ between $-90^\circ$ and $90^\circ$), so the second family is yours to add. Roots that coincide, as at $c=1$, must not be listed twice, and floating-point errors such as $89.99999999$ make equality tests unreliable, so round before comparing. And a value beyond $\pm1$ makes ´asin´ fail, so test for it first.

The programs below solve four equations from this article, $\sin x=\frac12$, $\sin2x=\frac12$, $\sin x=2$ (no solution) and $2\sin^2x-\sin x-1=0$ through its roots $u=-\frac12$ and $u=1$, and then solve $\cos x=x$ by bisection on $[0,1]$ until the interval is shorter than $10^{-12}$, which takes $40$ steps and gives $0.7390851332$.`,
            T`**Program menyelesaikan $\sin(kx+b)=c$ dengan langkah yang sama seperti di kertas: ambil sudut pokok dengan ´asin´, tambahkan bayangan cerminnya, telusuri bilangan bulat $n$, dan simpan $x$ yang jatuh dalam interval.** Tiga hal penting. ´asin´ dan ´acos´ hanya mengembalikan satu sudut (´asin´ antara $-90^\circ$ dan $90^\circ$), sehingga keluarga kedua harus kita tambahkan sendiri. Akar yang berimpit, seperti pada $c=1$, tidak boleh didaftar dua kali, dan galat bilangan desimal seperti $89{,}99999999$ membuat uji kesamaan tidak andal, jadi bulatkan sebelum membandingkan. Dan nilai di luar $\pm1$ membuat ´asin´ gagal, jadi ujilah terlebih dulu.

Program di bawah menyelesaikan empat persamaan dari artikel ini, $\sin x=\frac12$, $\sin2x=\frac12$, $\sin x=2$ (tanpa penyelesaian), dan $2\sin^2x-\sin x-1=0$ lewat akar $u=-\frac12$ dan $u=1$, lalu menyelesaikan $\cos x=x$ dengan bisection pada $[0,1]$ sampai interval lebih pendek dari $10^{-12}$, yang memerlukan $40$ langkah dan memberi $0{,}7390851332$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: all solutions in an interval, and bisection', 'Python: semua penyelesaian dalam interval, dan bisection'),
          code: `import math


def solve(fn, k, b, c, lo=0.0, hi=360.0):
    """Every x in [lo, hi) with fn(k*x + b) = c, in degrees (k > 0), for fn = 'sin' or 'cos'."""
    if abs(c) > 1:
        return []                                            # no angle has a sine or cosine beyond 1
    alpha = math.degrees(math.asin(c) if fn == 'sin' else math.acos(c))
    mirrors = [alpha, 180 - alpha] if fn == 'sin' else [alpha, -alpha]
    found = set()
    for u0 in mirrors:                                       # k*x + b = u0 + 360 n
        n = math.floor((k * lo + b - u0) / 360) - 1          # start a turn early, filter below
        while True:
            x = (u0 + 360 * n - b) / k
            if x >= hi:
                break
            if x >= lo:
                found.add(round(x, 9))
            n += 1
    return sorted(found)


print(solve('sin', 1, 0, 0.5))                  # [30.0, 150.0]
print(solve('sin', 2, 0, 0.5))                  # [15.0, 75.0, 195.0, 255.0]
print(solve('cos', 3, 0, 0.5, 0, 120))          # [20.0, 100.0]
print(solve('sin', 1, 0, 2))                    # []

# 2 sin^2 x - sin x - 1 = 0: a quadratic in u = sin x
a, b, c = 2, -1, -1
d = b * b - 4 * a * c
for u in [(-b - math.sqrt(d)) / (2 * a), (-b + math.sqrt(d)) / (2 * a)]:
    print(u, solve('sin', 1, 0, u))             # -0.5 [210.0, 330.0], then 1.0 [90.0]


def bisect(f, lo, hi, tol=1e-12):
    """Halve [lo, hi] until it is shorter than tol; f(lo) and f(hi) must have opposite signs."""
    steps = 0
    while hi - lo > tol:
        mid = (lo + hi) / 2
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
        steps += 1
    return (lo + hi) / 2, steps


root, steps = bisect(lambda x: math.cos(x) - x, 0, 1)
print(round(root, 10), steps)                   # 0.7390851332 40

x = 1.0                                         # Newton: x - f(x)/f'(x) with f = cos x - x
for _ in range(4):
    x -= (math.cos(x) - x) / (-math.sin(x) - 1)
print(round(x, 10))                             # 0.7390851332`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same solver', 'JavaScript: pemecah yang sama'),
          code: `function solve(fn, k, b, c, lo = 0, hi = 360) {
  // every x in [lo, hi) with fn(k*x + b) = c, in degrees (k > 0), for fn = 'sin' or 'cos'
  if (Math.abs(c) > 1) return []                                  // no angle has a sine or cosine beyond 1
  const alpha = ((fn === 'sin' ? Math.asin(c) : Math.acos(c)) * 180) / Math.PI
  const mirrors = fn === 'sin' ? [alpha, 180 - alpha] : [alpha, -alpha]
  const found = new Set()
  for (const u0 of mirrors) {                                     // k*x + b = u0 + 360 n
    for (let n = Math.floor((k * lo + b - u0) / 360) - 1; ; n++) { // start a turn early, filter below
      const x = (u0 + 360 * n - b) / k
      if (x >= hi) break
      if (x >= lo) found.add(Math.round(x * 1e9) / 1e9)
    }
  }
  return [...found].sort((p, q) => p - q)
}

solve('sin', 1, 0, 0.5)                    // [30, 150]
solve('sin', 2, 0, 0.5)                    // [15, 75, 195, 255]
solve('cos', 3, 0, 0.5, 0, 120)            // [20, 100]
solve('sin', 1, 0, 2)                      // []

// 2 sin^2 x - sin x - 1 = 0: a quadratic in u = sin x
const [a, b, c] = [2, -1, -1]
const d = b * b - 4 * a * c
;[(-b - Math.sqrt(d)) / (2 * a), (-b + Math.sqrt(d)) / (2 * a)].map((u) => [u, solve('sin', 1, 0, u)])
// [[-0.5, [210, 330]], [1, [90]]]

function bisect(f, lo, hi, tol = 1e-12) {
  // halve [lo, hi] until it is shorter than tol; f(lo) and f(hi) must have opposite signs
  let steps = 0
  while (hi - lo > tol) {
    const mid = (lo + hi) / 2
    if (f(lo) * f(mid) <= 0) hi = mid
    else lo = mid
    steps++
  }
  return [(lo + hi) / 2, steps]
}

const [root, steps] = bisect((x) => Math.cos(x) - x, 0, 1)
;[+root.toFixed(10), steps]                // [0.7390851332, 40]

let x = 1                                  // Newton: x - f(x)/f'(x) with f = cos x - x
for (let i = 0; i < 4; i++) x -= (Math.cos(x) - x) / (-Math.sin(x) - 1)
+x.toFixed(10)                             // 0.7390851332`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same solver with <cmath>', 'C++: pemecah yang sama dengan <cmath>'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

const double PI = 3.14159265358979323846;
double found[64];                                  // the solutions of the last call

// Every x in [lo, hi) with sin(k x + b) = c (degrees, k > 0), sorted, in found[]; returns how many.
int solveSin(double k, double b, double c, double lo, double hi) {
  int count = 0;
  if (fabs(c) > 1) return 0;                       // no angle has a sine beyond 1
  double alpha = asin(c) * 180.0 / PI;
  for (int mirror = 0; mirror < 2; mirror++) {
    double u0 = mirror == 0 ? alpha : 180.0 - alpha;   // k x + b = u0 + 360 n
    int n = (int)floor((k * lo + b - u0) / 360.0) - 1;
    while (count < 60) {
      double x = (u0 + 360.0 * n - b) / k;
      if (x >= hi) break;
      if (x >= lo) {
        int seen = 0;
        for (int i = 0; i < count; i++) if (fabs(found[i] - x) < 1e-9) seen = 1;
        if (seen == 0) { found[count] = x; count++; }
      }
      n++;
    }
  }
  for (int i = 1; i < count; i++) {                // insertion sort
    double v = found[i];
    int j = i - 1;
    while (j >= 0 && found[j] > v) { found[j + 1] = found[j]; j--; }
    found[j + 1] = v;
  }
  return count;
}

void show(int count) {
  if (count == 0) printf("none");
  for (int i = 0; i < count; i++) {
    if (i > 0) printf(" ");
    printf("%.1f", found[i]);
  }
  printf("\\n");
}

double f(double x) { return cos(x) - x; }

int main() {
  show(solveSin(1, 0, 0.5, 0, 360));
  show(solveSin(2, 0, 0.5, 0, 360));
  show(solveSin(1, 0, 2, 0, 360));
  // 2 sin^2 x - sin x - 1 = 0: a quadratic in u = sin x
  double a = 2, b = -1, c = -1;
  double d = b * b - 4 * a * c;
  show(solveSin(1, 0, (-b - sqrt(d)) / (2 * a), 0, 360));
  show(solveSin(1, 0, (-b + sqrt(d)) / (2 * a), 0, 360));
  // cos x = x by bisection on [0, 1]
  double lo = 0, hi = 1;
  int steps = 0;
  while (hi - lo > 1e-12) {
    double mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid;
    steps++;
  }
  printf("%.10f %d\\n", (lo + hi) / 2, steps);
  return 0;
}

/* output:
30.0 150.0
15.0 75.0 195.0 255.0
none
210.0 330.0
90.0
0.7390851332 40
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do trigonometric equations come from?', 'Dari mana persamaan trigonometri berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Trigonometric equations began as table look-ups run backwards in astronomy, and the one that mattered most, Kepler's equation, is exactly the kind with no formula.**

- **About 150 AD.** Ptolemy's *Almagest* gives a table of chords of a circle. Finding the angle for a given chord means reading the table backwards and interpolating between two entries, which is solving $\sin x=c$ numerically.
- **About 500 AD.** Aryabhata's sine table has 24 values, one for every $3.75^\circ$, and such a table can be read forwards, from angle to sine, or backwards, from sine to angle, which is solving $\sin x=c$ by look-up.
- **1609.** Kepler's *Astronomia nova* contains the equation $M=E-e\sin E$ that links the time since a planet passed its nearest point ($M$) to its position ($E$). No formula solves it for $E$ in terms of $M$, so it has been solved ever since by iteration.
- **1687.** Newton's *Principia* gives an iterative method for Kepler's problem, a forerunner of the method that carries his name.
- **1824.** Bessel writes $E$ as a series of the functions that now carry his name, a different answer to the same equation.
- **Today.** Calculators and libraries return the principal value of ´asin´, ´acos´ and ´atan´ and leave the other families to the user; equations such as $\cos x=x$ go to bisection or Newton's method.`,
            T`**Persamaan trigonometri bermula sebagai pencarian tabel yang dijalankan terbalik dalam astronomi, dan yang paling penting, persamaan Kepler, persis jenis yang tidak punya rumus.**

- **Sekitar 150 M.** *Almagest* Ptolemeus memuat tabel tali busur lingkaran. Mencari sudut untuk tali busur tertentu berarti membaca tabel itu terbalik dan menginterpolasi dua entri, yaitu menyelesaikan $\sin x=c$ secara numerik.
- **Sekitar 500 M.** Tabel sinus Aryabhata memuat 24 nilai, satu untuk setiap $3{,}75^\circ$, dan tabel seperti itu dapat dibaca maju, dari sudut ke sinus, atau mundur, dari sinus ke sudut, yaitu menyelesaikan $\sin x=c$ dengan mencari di tabel.
- **1609.** *Astronomia nova* karya Kepler memuat persamaan $M=E-e\sin E$ yang menghubungkan waktu sejak planet melewati titik terdekatnya ($M$) dengan posisinya ($E$). Tak ada rumus yang menyelesaikan $E$ dalam $M$, sehingga sejak itu persamaan ini diselesaikan dengan iterasi.
- **1687.** *Principia* karya Newton memberi metode iteratif untuk soal Kepler, pendahulu metode yang kini memakai namanya.
- **1824.** Bessel menulis $E$ sebagai deret fungsi yang kini memakai namanya, jawaban lain untuk persamaan yang sama.
- **Sekarang.** Kalkulator dan pustaka mengembalikan nilai pokok ´asin´, ´acos´, dan ´atan´ dan menyerahkan keluarga lainnya kepada pengguna; persamaan seperti $\cos x=x$ diserahkan kepada bisection atau metode Newton.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes when solving trigonometric equations?', 'Apa kesalahan umum saat menyelesaikan persamaan trigonometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes when solving trigonometric equations are the nine below, each with the correct step.**

| Mistake | Correct |
|---|---|
| ❌ $\sin x=\frac12\Rightarrow x=30^\circ$ and stop | There is a second family: $150^\circ+360^\circ n$. A calculator gives the principal value only. |
| ❌ $\tan x=1\Rightarrow x=45^\circ+360^\circ n$ | Tangent repeats every $180^\circ$: $x=45^\circ+180^\circ n$, so $225^\circ$ counts too. |
| ❌ $\sin2x=\frac12$: solve $2x=30^\circ,150^\circ$ and halve, finding only $15^\circ,75^\circ$ | $2x$ runs over $0^\circ$ to $720^\circ$, so there are four solutions: $15^\circ,\ 75^\circ,\ 195^\circ,\ 255^\circ$. |
| ❌ Divide both sides of $\sin2x=\cos x$ by $\cos x$ | Factor instead: $\cos x\,(2\sin x-1)=0$, which also finds $90^\circ$ and $270^\circ$. |
| ❌ Accept $\sin x=2$ or $\cos x=-3$ as a step to continue from | No angle has such a sine or cosine: no solution from that root. |
| ❌ Square both sides and keep every answer | Check each candidate in the original equation: $\sin x+\cos x=1$ keeps $0^\circ,90^\circ$ and drops $180^\circ,270^\circ$. |
| ❌ $\sin x\cos x=\frac14\Rightarrow\sin x=\frac14$ or $\cos x=\frac14$ | Only a product equal to $0$ splits into factors. Here $\frac12\sin2x=\frac14$, so $\sin2x=\frac12$. |
| ❌ $\sin^2x=\frac14\Rightarrow\sin x=\frac12$ | Take both roots: $\sin x=\pm\frac12$, giving $30^\circ,150^\circ,210^\circ,330^\circ$. |
| ❌ Solve $\cos x=x$ with $x$ in degrees | $x$ is a plain number mixed with a cosine, so it is in radians: the root is $0.7391$. |`,
            T`**Kesalahan paling umum saat menyelesaikan persamaan trigonometri adalah sembilan hal berikut, masing-masing dengan langkah yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $\sin x=\frac12\Rightarrow x=30^\circ$ lalu berhenti | Ada keluarga kedua: $150^\circ+360^\circ n$. Kalkulator hanya memberi nilai pokok. |
| ❌ $\tan x=1\Rightarrow x=45^\circ+360^\circ n$ | Tangen berulang setiap $180^\circ$: $x=45^\circ+180^\circ n$, jadi $225^\circ$ juga termasuk. |
| ❌ $\sin2x=\frac12$: selesaikan $2x=30^\circ,150^\circ$ lalu bagi dua, hanya menemukan $15^\circ,75^\circ$ | $2x$ berjalan dari $0^\circ$ sampai $720^\circ$, jadi ada empat penyelesaian: $15^\circ,\ 75^\circ,\ 195^\circ,\ 255^\circ$. |
| ❌ Membagi kedua ruas $\sin2x=\cos x$ dengan $\cos x$ | Faktorkan saja: $\cos x\,(2\sin x-1)=0$, yang juga menemukan $90^\circ$ dan $270^\circ$. |
| ❌ Menerima $\sin x=2$ atau $\cos x=-3$ sebagai langkah untuk dilanjutkan | Tak ada sudut dengan sinus atau kosinus seperti itu: akar tersebut tidak memberi penyelesaian. |
| ❌ Mengkuadratkan kedua ruas dan menyimpan semua jawaban | Periksa setiap kandidat pada persamaan semula: $\sin x+\cos x=1$ menyimpan $0^\circ,90^\circ$ dan membuang $180^\circ,270^\circ$. |
| ❌ $\sin x\cos x=\frac14\Rightarrow\sin x=\frac14$ atau $\cos x=\frac14$ | Hanya hasil kali yang sama dengan $0$ yang terpecah menjadi faktor. Di sini $\frac12\sin2x=\frac14$, jadi $\sin2x=\frac12$. |
| ❌ $\sin^2x=\frac14\Rightarrow\sin x=\frac12$ | Ambil kedua akar: $\sin x=\pm\frac12$, memberi $30^\circ,150^\circ,210^\circ,330^\circ$. |
| ❌ Menyelesaikan $\cos x=x$ dengan $x$ dalam derajat | $x$ adalah bilangan biasa yang bercampur dengan kosinus, jadi dalam radian: akarnya $0{,}7391$. |`,
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
              L(T`$\sin x=\frac12$ has infinitely many solutions when no interval is given.`, T`$\sin x=\frac12$ memiliki tak berhingga penyelesaian bila tak ada interval yang diberikan.`),
              L(T`The solutions of $\tan x=c$ repeat every $360^\circ$.`, T`Penyelesaian $\tan x=c$ berulang setiap $360^\circ$.`),
              L(T`$\sin2x=\frac12$ has two solutions between $0^\circ$ and $360^\circ$.`, T`$\sin2x=\frac12$ memiliki dua penyelesaian di antara $0^\circ$ dan $360^\circ$.`),
              L(T`Dividing both sides of $\sin2x=\cos x$ by $\cos x$ is a safe step.`, T`Membagi kedua ruas $\sin2x=\cos x$ dengan $\cos x$ adalah langkah yang aman.`),
              L(T`After squaring both sides, each answer must be checked in the original equation.`, T`Setelah mengkuadratkan kedua ruas, setiap jawaban harus diperiksa pada persamaan semula.`),
              L(T`$\cos x=3$ has no real solution.`, T`$\cos x=3$ tidak memiliki penyelesaian real.`),
            ],
            answer: [true, false, false, false, true, true],
            explain: L(
              T`Tangent repeats every $180^\circ$. $2x$ goes round twice, so $\sin2x=\frac12$ has four solutions. Dividing by $\cos x$ loses $90^\circ$ and $270^\circ$. Squaring can add false roots, and no cosine exceeds $1$.`,
              T`Tangen berulang setiap $180^\circ$. $2x$ berputar dua kali, sehingga $\sin2x=\frac12$ memiliki empat penyelesaian. Membagi dengan $\cos x$ menghilangkan $90^\circ$ dan $270^\circ$. Mengkuadratkan dapat menambah akar palsu, dan tak ada kosinus yang melebihi $1$.`,
            ),
            hint: L(T`Think about how often each function repeats, and about what a step can lose or add.`, T`Pikirkan seberapa sering tiap fungsi berulang, dan apa yang dapat hilang atau bertambah pada sebuah langkah.`),
          },
        },
        {
          kind: 'activity',
          title: L('A multiple angle', 'Sudut kelipatan'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`For $\sin3x=\frac12$, the angle $3x$ runs over three turns.`, T`Untuk $\sin3x=\frac12$, sudut $3x$ berjalan tiga putaran.`), L(T`Two solutions per turn.`, T`Dua penyelesaian per putaran.`)],
            explain: L(T`$u=3x$ runs from $0^\circ$ to $1080^\circ$ and $\sin u=\frac12$ twice per turn: $3\cdot2=6$ solutions.`, T`$u=3x$ berjalan dari $0^\circ$ sampai $1080^\circ$ dan $\sin u=\frac12$ dua kali per putaran: $3\cdot2=6$ penyelesaian.`),
            prompt: L(T`How many angles $x$ with $0^\circ\le x<360^\circ$ satisfy $\sin3x=\frac12$?`, T`Berapa banyak sudut $x$ dengan $0^\circ\le x<360^\circ$ yang memenuhi $\sin3x=\frac12$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('A quadratic in sine', 'Kuadrat dalam sinus'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`Factor: $(2\sin x+1)(\sin x-1)=0$.`, T`Faktorkan: $(2\sin x+1)(\sin x-1)=0$.`), L(T`$\sin x=-\frac12$ gives two angles, $\sin x=1$ gives one.`, T`$\sin x=-\frac12$ memberi dua sudut, $\sin x=1$ memberi satu.`)],
            explain: L(T`$\sin x=-\frac12$: $210^\circ$ and $330^\circ$; $\sin x=1$: $90^\circ$. Three solutions.`, T`$\sin x=-\frac12$: $210^\circ$ dan $330^\circ$; $\sin x=1$: $90^\circ$. Tiga penyelesaian.`),
            prompt: L(T`How many solutions with $0^\circ\le x<360^\circ$ does $2\sin^2x-\sin x-1=0$ have?`, T`Berapa banyak penyelesaian dengan $0^\circ\le x<360^\circ$ yang dimiliki $2\sin^2x-\sin x-1=0$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('Using an identity', 'Memakai identitas'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`$\cos2x=2\cos^2x-1$ turns the equation into a quadratic in $\cos x$.`, T`$\cos2x=2\cos^2x-1$ mengubah persamaan menjadi kuadrat dalam $\cos x$.`), L(T`$(2\cos x+1)(\cos x-1)=0$: $\cos x=-\frac12$ or $1$.`, T`$(2\cos x+1)(\cos x-1)=0$: $\cos x=-\frac12$ atau $1$.`)],
            explain: L(T`The solutions are $0^\circ$, $120^\circ$ and $240^\circ$, and their sum is $360^\circ$.`, T`Penyelesaiannya $0^\circ$, $120^\circ$, dan $240^\circ$, dan jumlahnya $360^\circ$.`),
            prompt: L(T`Add up all the solutions of $\cos2x=\cos x$ with $0^\circ\le x<360^\circ$ (in degrees).`, T`Jumlahkan semua penyelesaian $\cos2x=\cos x$ dengan $0^\circ\le x<360^\circ$ (dalam derajat).`),
            given: String.raw`S=v`,
            blanks: [{ label: 'S =', answer: 360 }],
          },
        },
        {
          kind: 'activity',
          title: L('The largest solution', 'Penyelesaian terbesar'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`$\tan x=-1$ has the family $135^\circ+180^\circ n$.`, T`$\tan x=-1$ memiliki keluarga $135^\circ+180^\circ n$.`), L(T`$135^\circ$ and $135^\circ+180^\circ$.`, T`$135^\circ$ dan $135^\circ+180^\circ$.`)],
            explain: L(T`The solutions are $135^\circ$ and $315^\circ$; the larger is $315^\circ$.`, T`Penyelesaiannya $135^\circ$ dan $315^\circ$; yang lebih besar $315^\circ$.`),
            prompt: L(T`What is the largest solution of $\tan x=-1$ with $0^\circ\le x<360^\circ$ (in degrees)?`, T`Berapa penyelesaian terbesar $\tan x=-1$ dengan $0^\circ\le x<360^\circ$ (dalam derajat)?`),
            given: String.raw`x=v`,
            blanks: [{ label: 'x =', answer: 315 }],
          },
        },
        {
          kind: 'activity',
          title: L('After squaring', 'Setelah mengkuadratkan'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`Squaring gives $\sin2x=0$ and four candidates: $0^\circ,90^\circ,180^\circ,270^\circ$.`, T`Mengkuadratkan memberi $\sin2x=0$ dan empat kandidat: $0^\circ,90^\circ,180^\circ,270^\circ$.`), L(T`Check which of them give $\sin x+\cos x=1$, not $-1$.`, T`Periksa mana yang memberi $\sin x+\cos x=1$, bukan $-1$.`)],
            explain: L(T`At $0^\circ$ and $90^\circ$ the sum is $1$; at $180^\circ$ and $270^\circ$ it is $-1$. Two solutions.`, T`Pada $0^\circ$ dan $90^\circ$ jumlahnya $1$; pada $180^\circ$ dan $270^\circ$ jumlahnya $-1$. Dua penyelesaian.`),
            prompt: L(T`How many solutions with $0^\circ\le x<360^\circ$ does $\sin x+\cos x=1$ have?`, T`Berapa banyak penyelesaian dengan $0^\circ\le x<360^\circ$ yang dimiliki $\sin x+\cos x=1$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('A sine of one half below zero', 'Sinus setengah di bawah nol'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L(T`What are all the solutions of $\sin x=-\frac12$ with $0^\circ\le x<360^\circ$?`, T`Apa semua penyelesaian $\sin x=-\frac12$ dengan $0^\circ\le x<360^\circ$?`),
            options: [L(T`$210^\circ$ and $330^\circ$`, T`$210^\circ$ dan $330^\circ$`), L(T`$30^\circ$ and $150^\circ$`, T`$30^\circ$ dan $150^\circ$`), L(T`$120^\circ$ and $240^\circ$`, T`$120^\circ$ dan $240^\circ$`), L(T`$330^\circ$ only`, T`hanya $330^\circ$`)],
            answer: 0,
            explain: L(T`The reference angle is $30^\circ$; sine is negative in quadrants III and IV: $180^\circ+30^\circ$ and $360^\circ-30^\circ$.`, T`Sudut acuannya $30^\circ$; sinus negatif di kuadran III dan IV: $180^\circ+30^\circ$ dan $360^\circ-30^\circ$.`),
            hint: L(T`Sine is negative below the horizontal axis of the unit circle.`, T`Sinus negatif di bawah sumbu mendatar lingkaran satuan.`),
          },
        },
        {
          kind: 'activity',
          title: L('Which step loses solutions?', 'Langkah mana yang menghilangkan penyelesaian?'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L('Which step can lose solutions of a trigonometric equation?', 'Langkah mana yang dapat menghilangkan penyelesaian persamaan trigonometri?'),
            options: [
              L('dividing both sides by an expression that can be zero', 'membagi kedua ruas dengan ekspresi yang dapat bernilai nol'),
              L('squaring both sides', 'mengkuadratkan kedua ruas'),
              L('factoring after moving everything to one side', 'memfaktorkan setelah memindahkan semuanya ke satu ruas'),
              L('substituting u for sin x', 'memisalkan u untuk sin x'),
            ],
            answer: 0,
            explain: L('Where the divisor is zero the division is not allowed, and any solution there disappears. Squaring adds roots instead; factoring and substituting keep the solutions.', 'Di tempat pembaginya nol pembagian itu tidak diperbolehkan, dan penyelesaian di sana lenyap. Mengkuadratkan justru menambah akar; memfaktorkan dan memisalkan mempertahankan penyelesaian.'),
            hint: L('A step that loses solutions is one that is only valid where something is not zero.', 'Langkah yang menghilangkan penyelesaian adalah yang hanya sah di tempat sesuatu tidak nol.'),
          },
        },
        {
          kind: 'activity',
          title: L('Which have no solution?', 'Mana yang tak memiliki penyelesaian?'),
          step: {
            kind: 'multi',
            id: 'p9',
            prompt: L(T`Which of these equations have **no** real solution? Choose all that apply.`, T`Persamaan mana yang **tidak** memiliki penyelesaian real? Pilih semua yang benar.`),
            options: [
              L(T`$\sin x=1.2$`, T`$\sin x=1{,}2$`),
              L(T`$\tan x=100$`, T`$\tan x=100$`),
              L(T`$3\sin x+4\cos x=6$`, T`$3\sin x+4\cos x=6$`),
              L(T`$\cos x=-1$`, T`$\cos x=-1$`),
              L(T`$\sin^2x=-\frac14$`, T`$\sin^2x=-\frac14$`),
            ],
            answer: [0, 2, 4],
            explain: L(T`A sine never exceeds $1$; $3\sin x+4\cos x$ never exceeds $5$; and a square is never negative. $\tan x=100$ and $\cos x=-1$ (at $180^\circ$) are solvable.`, T`Sinus tidak pernah melebihi $1$; $3\sin x+4\cos x$ tidak pernah melebihi $5$; dan kuadrat tidak pernah negatif. $\tan x=100$ dan $\cos x=-1$ (di $180^\circ$) dapat diselesaikan.`),
            hint: L(T`Compare each number with the largest and smallest value of the left side.`, T`Bandingkan tiap bilangan dengan nilai terbesar dan terkecil ruas kirinya.`),
          },
        },
        {
          kind: 'activity',
          title: L('Order the solution', 'Urutkan penyelesaiannya'),
          step: {
            kind: 'order',
            id: 'p10',
            prompt: L('Put the lines of the solution of $2\\cos^2x=\\cos x$ (for $0^\\circ\\le x<360^\\circ$) in order.', 'Urutkan baris penyelesaian $2\\cos^2x=\\cos x$ (untuk $0^\\circ\\le x<360^\\circ$).'),
            lines: {
              en: ['Move everything to one side: 2 cos² x − cos x = 0', 'Factor: cos x (2 cos x − 1) = 0', 'A product is zero when a factor is: cos x = 0 or cos x = 1/2', 'Solve each: 90°, 270° and 60°, 300°'],
              id: ['Pindahkan semuanya ke satu ruas: 2 cos² x − cos x = 0', 'Faktorkan: cos x (2 cos x − 1) = 0', 'Hasil kali nol bila ada faktor yang nol: cos x = 0 atau cos x = 1/2', 'Selesaikan masing-masing: 90°, 270° dan 60°, 300°'],
            },
            explain: L(T`Do not divide by $\cos x$: that would lose $90^\circ$ and $270^\circ$.`, T`Jangan membagi dengan $\cos x$: itu akan menghilangkan $90^\circ$ dan $270^\circ$.`),
            hint: L(T`You cannot split into factors until the right side is zero.`, T`Kita belum dapat memecah menjadi faktor sebelum ruas kanannya nol.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the period', 'Isi periodenya'),
          step: {
            kind: 'fill',
            id: 'p11',
            prompt: L('Complete the general solution of the tangent equation.', 'Lengkapi penyelesaian umum persamaan tangen.'),
            template: {
              en: 'tan x = c  ⇒  x = α + ___° · n',
              id: 'tan x = c  ⇒  x = α + ___° · n',
            },
            blanks: { en: ['180'], id: ['180'] },
            explain: L(T`The tangent repeats every $180^\circ$, so the family is $x=\alpha+180^\circ n$.`, T`Tangen berulang setiap $180^\circ$, jadi keluarganya $x=\alpha+180^\circ n$.`),
            hint: L(T`Opposite points on the unit circle have the same tangent.`, T`Titik-titik yang berlawanan pada lingkaran satuan memiliki tangen yang sama.`),
          },
        },
        {
          kind: 'activity',
          title: L('Where to begin', 'Dari mana memulai'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`You have to solve $\cos x=x$. What is the best first move?`, T`Anda harus menyelesaikan $\cos x=x$. Apa langkah pertama terbaik?`),
            options: [
              L('graph both sides, see where they cross, and find an interval where cos x − x changes sign', 'menggambar kedua ruas, melihat tempat keduanya berpotongan, dan mencari interval tempat cos x − x berubah tanda'),
              L('divide both sides by cos x', 'membagi kedua ruas dengan cos x'),
              L('take the inverse cosine of both sides and get x = arccos x', 'mengambil invers kosinus kedua ruas dan memperoleh x = arccos x'),
              L('convert x to degrees and use the table of special angles', 'mengubah x ke derajat dan memakai tabel sudut istimewa'),
            ],
            answer: 0,
            explain: L('No formula solves it, so you look at the graph, bracket the root, and use bisection or Newton\'s method with x in radians.', 'Tak ada rumus yang menyelesaikannya, jadi kita melihat grafik, mengapit akar, dan memakai bisection atau metode Newton dengan x dalam radian.'),
            hint: L('x is mixed in with the cosine, so algebra will not isolate it.', 'x bercampur dengan kosinus, sehingga aljabar tidak akan memisahkannya.'),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: trigonometric equations at a glance', 'Ringkasan: persamaan trigonometri sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Many solutions:** the functions repeat ($360^\circ$ for sine and cosine, $180^\circ$ for tangent), so an answer is a family with a whole number $n$ or a list inside an interval.
- **Interval:** put the family into the inequality and keep the whole numbers $n$ that fit; about two solutions per turn for $\sin x=c$ and $\cos x=c$, one per $180^\circ$ for $\tan x=c$.
- **Multiple angle:** $\sin(kx+b)=c$: solve for $u=kx+b$ over a $k$ times longer interval, then $x=\frac{u-b}{k}$; $2k$ solutions per turn.
- **Quadratic:** substitute $u$, solve, discard $|u|>1$ for sine and cosine, solve the basic equations; a root $u=\pm1$ gives one angle.
- **Dividing:** never by a function that can be zero; move everything to one side and factor.
- **Identities:** use the one that leaves a single function of a single angle; $a\sin x+b\cos x=R\sin(x+\varphi)$ needs $|c|\le R$.
- **False roots:** squaring and multiplying can add them, undefined angles are not solutions; check every candidate in the original.
- **No formula:** $\cos x=x$: graph, bracket, bisection (one binary digit per step) or Newton ($x-\frac{f}{f'}$), with $x$ in radians.`,
            T`- **Banyak penyelesaian:** fungsinya berulang ($360^\circ$ untuk sinus dan kosinus, $180^\circ$ untuk tangen), sehingga jawabannya adalah keluarga dengan bilangan bulat $n$ atau daftar dalam sebuah interval.
- **Interval:** masukkan keluarga ke pertidaksamaan dan ambil bilangan bulat $n$ yang cocok; kira-kira dua penyelesaian per putaran untuk $\sin x=c$ dan $\cos x=c$, satu per $180^\circ$ untuk $\tan x=c$.
- **Sudut kelipatan:** $\sin(kx+b)=c$: selesaikan untuk $u=kx+b$ pada interval yang $k$ kali lebih panjang, lalu $x=\frac{u-b}{k}$; $2k$ penyelesaian per putaran.
- **Kuadrat:** misalkan $u$, selesaikan, buang $|u|>1$ untuk sinus dan kosinus, selesaikan persamaan dasarnya; akar $u=\pm1$ memberi satu sudut.
- **Membagi:** jangan pernah dengan fungsi yang bisa nol; pindahkan semuanya ke satu ruas lalu faktorkan.
- **Identitas:** pakai yang meninggalkan satu fungsi dari satu sudut; $a\sin x+b\cos x=R\sin(x+\varphi)$ memerlukan $|c|\le R$.
- **Akar palsu:** mengkuadratkan dan mengalikan dapat menambahnya, sudut tak terdefinisi bukan penyelesaian; periksa setiap kandidat pada persamaan semula.
- **Tanpa rumus:** $\cos x=x$: gambar, apit, bisection (satu angka biner per langkah) atau Newton ($x-\frac{f}{f'}$), dengan $x$ dalam radian.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Trigonometric equation', 'Persamaan trigonometri'), definition: L('An equation whose unknown is the angle inside one or more trigonometric functions, true for some angles and not for others.', 'Persamaan yang bilangan tak diketahuinya adalah sudut di dalam satu atau lebih fungsi trigonometri, benar untuk sebagian sudut dan tidak untuk yang lain.') },
    { term: L('General solution', 'Penyelesaian umum'), definition: L('The family of all solutions of a trigonometric equation, written with a whole number n, such as 30 degrees plus 360 degrees times n.', 'Keluarga semua penyelesaian sebuah persamaan trigonometri, ditulis dengan bilangan bulat n, seperti 30 derajat ditambah 360 derajat kali n.') },
    { term: L('Principal value', 'Nilai pokok'), definition: L('The one angle that an inverse function such as arcsine returns, from which the other solution families are built.', 'Satu sudut yang dikembalikan fungsi invers seperti arcsin, yang darinya keluarga penyelesaian lain dibangun.') },
    { term: L('Multiple-angle equation', 'Persamaan sudut kelipatan'), definition: L('An equation such as sin 2x = 1/2 in which the function is applied to a multiple of the unknown, so that it has 2k solutions per turn.', 'Persamaan seperti sin 2x = 1/2 dengan fungsi yang dikenakan pada kelipatan bilangan tak diketahui, sehingga memiliki 2k penyelesaian per putaran.') },
    { term: L('Quadratic in a trigonometric function', 'Kuadrat dalam fungsi trigonometri'), definition: L('An equation of the form a u squared plus b u plus c equal to zero, where u is sin x, cos x or tan x, solved by substituting u.', 'Persamaan berbentuk a u kuadrat ditambah b u ditambah c sama dengan nol, dengan u adalah sin x, cos x, atau tan x, yang diselesaikan dengan memisalkan u.') },
    { term: L('Extraneous root', 'Akar palsu'), definition: L('An answer produced by the steps of a solution, such as squaring, that does not satisfy the original equation.', 'Jawaban yang dihasilkan langkah-langkah penyelesaian, seperti mengkuadratkan, yang tidak memenuhi persamaan semula.') },
    { term: L('Lost solution', 'Penyelesaian yang hilang'), definition: L('A solution that disappears because a step, such as dividing by an expression that can be zero, is not valid at that angle.', 'Penyelesaian yang lenyap karena sebuah langkah, seperti membagi dengan ekspresi yang dapat bernilai nol, tidak sah pada sudut itu.') },
    { term: L('Bisection', 'Bisection'), definition: L('A way to find a root by repeatedly halving an interval on which a continuous function changes sign, keeping the half that still does.', 'Cara mencari akar dengan membelah dua berulang-ulang sebuah interval tempat fungsi kontinu berubah tanda, dengan menyimpan separuh yang masih berubah tanda.') },
    { term: L('Bracket', 'Apitan'), definition: L('Two points at which a continuous function has opposite signs, which guarantees a root between them.', 'Dua titik tempat fungsi kontinu memiliki tanda berlawanan, yang menjamin adanya akar di antaranya.') },
  ],

  howTo: [
    {
      name: L('How to solve sin(kx + b) = c on an interval', 'Cara menyelesaikan sin(kx + b) = c pada sebuah interval'),
      description: L('Solve for the whole angle over a longer interval, then undo the shift and the multiple.', 'Selesaikan untuk seluruh sudut pada interval yang lebih panjang, lalu batalkan pergeseran dan kelipatannya.'),
      steps: [
        { name: L('Name the angle', 'Namai sudutnya'), text: L('Write u for k x plus b and turn the interval for x into the interval for u, which is k times as long.', 'Tulis u untuk k x ditambah b dan ubah interval x menjadi interval u, yang k kali lebih panjang.') },
        { name: L('Solve the basic equation', 'Selesaikan persamaan dasarnya'), text: L('Solve sin u equals c with the principal angle and its mirror image, 180 minus the angle, and add whole turns until you have every u in the interval.', 'Selesaikan sin u sama dengan c dengan sudut pokok dan bayangan cerminnya, 180 dikurangi sudut itu, dan tambahkan putaran penuh sampai semua u dalam interval didapat.') },
        { name: L('Undo the shift and the multiple', 'Batalkan pergeseran dan kelipatannya'), text: L('Subtract b from each u and divide by k to get x.', 'Kurangi tiap u dengan b dan bagi dengan k untuk mendapat x.') },
        { name: L('Count and check', 'Hitung dan periksa'), text: L('There should be two solutions per turn of u, so about two k per turn of x. Substitute one answer to be sure.', 'Seharusnya ada dua penyelesaian per putaran u, jadi sekitar dua k per putaran x. Substitusikan satu jawaban untuk memastikan.') },
      ],
    },
    {
      name: L('How to solve an equation that is quadratic in sin x or cos x', 'Cara menyelesaikan persamaan yang kuadrat dalam sin x atau cos x'),
      description: L('Substitute u for the function, solve the quadratic, and keep only the roots that an angle can reach.', 'Misalkan u untuk fungsinya, selesaikan kuadratnya, dan simpan hanya akar yang dapat dicapai sebuah sudut.'),
      steps: [
        { name: L('Get a quadratic in one function', 'Dapatkan kuadrat dalam satu fungsi'), text: L('Use an identity such as cos squared equals 1 minus sin squared so that only one function is left.', 'Pakai identitas seperti cos kuadrat sama dengan 1 dikurangi sin kuadrat agar hanya satu fungsi yang tersisa.') },
        { name: L('Substitute and solve', 'Misalkan dan selesaikan'), text: L('Write u for the function and solve a u squared plus b u plus c equals zero by factoring or the quadratic formula.', 'Tulis u untuk fungsinya dan selesaikan a u kuadrat ditambah b u ditambah c sama dengan nol dengan pemfaktoran atau rumus kuadrat.') },
        { name: L('Discard impossible roots', 'Buang akar yang mustahil'), text: L('For sine and cosine, throw away every root below minus 1 or above 1.', 'Untuk sinus dan kosinus, buang setiap akar di bawah minus 1 atau di atas 1.') },
        { name: L('Solve each basic equation', 'Selesaikan tiap persamaan dasar'), text: L('Solve sin x equals each remaining root for the angles in the interval, and list all of them together.', 'Selesaikan sin x sama dengan tiap akar yang tersisa untuk sudut dalam interval, dan daftar semuanya bersama.') },
      ],
    },
    {
      name: L('How to find a root of cos x = x by bisection', 'Cara mencari akar cos x = x dengan bisection'),
      description: L('Trap the root in an interval where the sign changes, and halve the interval until it is as short as you need.', 'Kurung akar dalam interval tempat tanda berubah, dan belah dua interval itu sampai sependek yang diperlukan.'),
      steps: [
        { name: L('Write f and find a bracket', 'Tulis f dan cari apitan'), text: L('Let f of x be cos x minus x, with x in radians, and find a and b with f of a and f of b of opposite signs, such as 0 and 1.', 'Misalkan f dari x adalah cos x dikurangi x, dengan x dalam radian, dan cari a dan b dengan f dari a dan f dari b berlawanan tanda, seperti 0 dan 1.') },
        { name: L('Take the midpoint', 'Ambil titik tengah'), text: L('Compute m as the average of a and b and evaluate f of m.', 'Hitung m sebagai rata-rata a dan b dan hitung f dari m.') },
        { name: L('Keep the half with the sign change', 'Simpan separuh yang tandanya berubah'), text: L('If f of a and f of m have opposite signs, set b to m; otherwise set a to m.', 'Jika f dari a dan f dari m berlawanan tanda, jadikan b sama dengan m; jika tidak, jadikan a sama dengan m.') },
        { name: L('Repeat until short enough', 'Ulangi sampai cukup pendek'), text: L('Stop when b minus a is below the tolerance. After n steps the error is at most the starting length over 2 to the n.', 'Berhenti ketika b dikurangi a di bawah toleransi. Setelah n langkah galatnya paling banyak panjang awal dibagi 2 pangkat n.') },
      ],
    },
  ],

  faq: [
    {
      q: L('How many solutions does a trigonometric equation have?', 'Berapa banyak penyelesaian yang dimiliki persamaan trigonometri?'),
      a: L(
        'Infinitely many if no interval is given, because the functions repeat. In one turn, sin x equals c and cos x equals c each have two solutions when c is strictly between minus 1 and 1, and tan x equals c has one for every 180 degrees.',
        'Tak berhingga bila tak ada interval yang diberikan, karena fungsinya berulang. Dalam satu putaran, sin x sama dengan c dan cos x sama dengan c masing-masing memiliki dua penyelesaian bila c tepat di antara minus 1 dan 1, dan tan x sama dengan c memiliki satu untuk setiap 180 derajat.',
      ),
    },
    {
      q: L('How do you solve sin 2x = 1/2 for x between 0 and 360 degrees?', 'Bagaimana menyelesaikan sin 2x = 1/2 untuk x antara 0 dan 360 derajat?'),
      a: L(
        'Let u be 2x, which runs from 0 to 720 degrees. Then sin u equals one half at 30, 150, 390 and 510 degrees, so x is 15, 75, 195 and 255 degrees. There are four solutions, not two, because 2x goes round twice.',
        'Misalkan u adalah 2x, yang berjalan dari 0 sampai 720 derajat. Maka sin u sama dengan setengah di 30, 150, 390, dan 510 derajat, sehingga x adalah 15, 75, 195, dan 255 derajat. Ada empat penyelesaian, bukan dua, karena 2x berputar dua kali.',
      ),
    },
    {
      q: L('Why do I lose solutions when I divide by cos x?', 'Mengapa saya kehilangan penyelesaian ketika membagi dengan cos x?'),
      a: L(
        'Division by cos x is not allowed where cos x is zero, at 90 and 270 degrees, and those angles may be solutions. Move everything to one side and factor out cos x instead, which keeps the solutions where it is zero.',
        'Pembagian dengan cos x tidak diperbolehkan di tempat cos x nol, yaitu pada 90 dan 270 derajat, dan sudut itu bisa jadi penyelesaian. Pindahkan semuanya ke satu ruas dan keluarkan cos x sebagai faktor, yang mempertahankan penyelesaian di tempat ia nol.',
      ),
    },
    {
      q: L('How do you solve a quadratic trigonometric equation?', 'Bagaimana menyelesaikan persamaan trigonometri kuadrat?'),
      a: L(
        'Write u for sin x, cos x or tan x and solve the quadratic in u by factoring or the formula. For sine and cosine discard roots outside minus 1 to 1, then solve sin x equals each remaining root for the angles.',
        'Tulis u untuk sin x, cos x, atau tan x dan selesaikan kuadrat dalam u dengan pemfaktoran atau rumus. Untuk sinus dan kosinus buang akar di luar minus 1 sampai 1, lalu selesaikan sin x sama dengan tiap akar yang tersisa untuk sudutnya.',
      ),
    },
    {
      q: L('How do you solve a sin x + b cos x = c?', 'Bagaimana menyelesaikan a sin x + b cos x = c?'),
      a: L(
        'Rewrite the left side as R sin of x plus phi with R the square root of a squared plus b squared. Then sin of x plus phi equals c over R, which has solutions exactly when c is not larger than R in absolute value.',
        'Tulis ulang ruas kiri sebagai R sin dari x tambah phi dengan R akar dari a kuadrat tambah b kuadrat. Maka sin dari x tambah phi sama dengan c per R, yang memiliki penyelesaian tepat ketika nilai mutlak c tidak lebih besar dari R.',
      ),
    },
    {
      q: L('Why do I get extra answers after squaring a trigonometric equation?', 'Mengapa saya mendapat jawaban tambahan setelah mengkuadratkan persamaan trigonometri?'),
      a: L(
        'Squaring turns A equals B into A squared equals B squared, which is also true when A equals minus B. The extra answers solve that other equation, so check each candidate in the original equation and cross out the ones that fail.',
        'Mengkuadratkan mengubah A sama dengan B menjadi A kuadrat sama dengan B kuadrat, yang juga benar bila A sama dengan minus B. Jawaban tambahan menyelesaikan persamaan yang lain itu, jadi periksa tiap kandidat pada persamaan semula dan coret yang gagal.',
      ),
    },
    {
      q: L('Can sin x equal 2?', 'Dapatkah sin x sama dengan 2?'),
      a: L(
        'Not for any real angle, because the sine of a real angle is never above 1. With complex numbers it can: sin x equals 2 at x equal to pi over 2 plus or minus i times the natural log of 2 plus root 3.',
        'Tidak untuk sudut real mana pun, karena sinus sudut real tidak pernah di atas 1. Dengan bilangan kompleks bisa: sin x sama dengan 2 di x sama dengan pi per 2 tambah atau kurang i kali logaritma natural dari 2 tambah akar 3.',
      ),
    },
    {
      q: L('How do you solve cos x = x?', 'Bagaimana menyelesaikan cos x = x?'),
      a: L(
        'No formula gives it, so use a numerical method with x in radians. Bracket a sign change of cos x minus x, such as 0 to 1, then use bisection or Newton\'s method. The root is about 0.7391.',
        'Tak ada rumus yang memberinya, jadi pakai metode numerik dengan x dalam radian. Apit perubahan tanda cos x dikurangi x, seperti 0 sampai 1, lalu pakai bisection atau metode Newton. Akarnya sekitar 0,7391.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (chapters on analytic trigonometry)', author: 'James Stewart, Lothar Redlin, Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Trigonometry (2nd ed.)', author: 'I. M. Gelfand, Mark Saul', year: 2001, source: 'Birkhäuser' },
    { title: 'Numerical Analysis (10th ed., chapter 2, solutions of equations in one variable)', author: 'Richard L. Burden, J. Douglas Faires, Annette M. Burden', year: 2015, source: 'Cengage Learning' },
    { title: 'Handbook of Mathematical Functions (section 4.3, circular functions)', author: 'Milton Abramowitz, Irene A. Stegun', year: 1964, source: 'National Bureau of Standards' },
    { title: 'Trigonometric Delights', author: 'Eli Maor', year: 1998, source: 'Princeton University Press' },
    { title: 'Astronomia nova', author: 'Johannes Kepler', year: 1609, source: 'Heidelberg' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
  ],

  related: ['trigonometric-identities', 'basic-trigonometry', 'newtons-method', 'inverse-trigonometric-functions'],
}
