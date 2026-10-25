import type { Figure } from '../../lib/figure'
import type { Loc } from '../types'
import type { ArticleBlock, ArticleBody } from './types'
import { meta } from './linear-systems-two-variables.meta'

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

/** A static graph on a plain canvas with axes and numbers on them: the figure items are the only things in it, with no sliders and nothing to drag. The
 *  labels inside a drawing are letters, numbers and symbols, which read the same in both languages; the words are in the caption. */
const plot = (f: Omit<Figure, 'dim' | 'axes' | 'ticks'>): ArticleBlock => {
  // With both spans given and no aspect, choose the frame that gives one scale on both axes
  const aspect = f.aspect ?? (f.xSpan && f.ySpan ? Math.min(3, Math.max(0.5, 460 / (52 + (460 - 52) * ((f.ySpan[1] - f.ySpan[0]) / (f.xSpan[1] - f.xSpan[0]))))) : 1)
  return { kind: 'figure', figure: { dim: 2, axes: true, ticks: true, ...f, aspect } }
}

/* ------------------------------------------------------------------------------- the figures */

/** x + y = 10 and x − y = 2 cross at (6, 4). */
const FIG_CROSS: ArticleBlock = plot({
  range: 1,
  xSpan: [-1, 12],
  ySpan: [-3, 12],
  items: [
    { t: 'curve', f: '10 - x', color: 'b' },
    { t: 'curve', f: 'x - 2', color: 'c' },
    { t: 'seg', from: [6, 4], to: [6, 0], color: 'muted', dashed: true },
    { t: 'seg', from: [6, 4], to: [0, 4], color: 'muted', dashed: true },
    { t: 'point', at: [6, 4], color: 'result', label: '(6, 4)' },
    { t: 'text', at: [0.4, 9.6], text: 'x + y = 10', color: 'b', size: 'sm', anchor: 'start' },
    { t: 'text', at: [8.2, 7.6], text: 'x − y = 2', color: 'c', size: 'sm', anchor: 'start' },
  ],
  caption: L(
    T`The two equations $x+y=10$ and $x-y=2$ are two lines. They cross at one point, $(6,4)$, and that point is the only pair that lies on both lines: $6+4=10$ and $6-4=2$.`,
    T`Dua persamaan $x+y=10$ dan $x-y=2$ adalah dua garis. Keduanya berpotongan di satu titik, $(6,4)$, dan titik itu satu-satunya pasangan yang terletak pada kedua garis: $6+4=10$ dan $6-4=2$.`,
  ),
})

/** 2x + 3y = 6 and 4x + 6y = 18: parallel, never meet. */
const FIG_PARALLEL: ArticleBlock = plot({
  range: 1,
  xSpan: [-4, 8],
  ySpan: [-3, 6],
  items: [
    { t: 'curve', f: '2 - 2*x/3', color: 'b' },
    { t: 'curve', f: '3 - 2*x/3', color: 'c' },
    { t: 'text', at: [-3.6, 1.5], text: '2x + 3y = 6', color: 'b', size: 'sm', anchor: 'start' },
    { t: 'text', at: [-3.6, 5.4], text: '4x + 6y = 18', color: 'c', size: 'sm', anchor: 'start' },
  ],
  caption: L(
    T`The lines $2x+3y=6$ and $4x+6y=18$ have the same slope, $-\frac23$, and different heights where they cross the $y$-axis ($2$ and $3$). They are parallel, so no point lies on both and the system has no solution.`,
    T`Garis $2x+3y=6$ dan $4x+6y=18$ memiliki kemiringan yang sama, $-\frac23$, dan tinggi yang berbeda di sumbu $y$ ($2$ dan $3$). Keduanya sejajar, sehingga tak ada titik yang terletak pada keduanya dan sistem itu tidak memiliki penyelesaian.`,
  ),
})

/** x + 2y = 4 and 3x + 6y = 12: the same line. */
const FIG_SAME: ArticleBlock = plot({
  range: 1,
  xSpan: [-4, 8],
  ySpan: [-3, 5],
  items: [
    { t: 'curve', f: '2 - x/2', color: 'b', dashed: false },
    { t: 'curve', f: '2 - x/2', color: 'c', dashed: true },
    { t: 'point', at: [4, 0], color: 'result' },
    { t: 'point', at: [2, 1], color: 'result' },
    { t: 'point', at: [0, 2], color: 'result' },
    { t: 'text', at: [-3.6, 4.3], text: 'x + 2y = 4  and  3x + 6y = 12', color: 'b', size: 'sm', anchor: 'start' },
  ],
  caption: L(
    T`The equations $x+2y=4$ and $3x+6y=12$ are the same equation, the second being the first multiplied by $3$. Their lines lie on top of each other (one is drawn dashed), so every point on the line, such as $(4,0)$, $(2,1)$ or $(0,2)$, is a solution: infinitely many.`,
    T`Persamaan $x+2y=4$ dan $3x+6y=12$ adalah persamaan yang sama, yang kedua adalah yang pertama dikalikan $3$. Garisnya saling menumpuk (satu digambar putus-putus), sehingga setiap titik pada garis itu, seperti $(4,0)$, $(2,1)$, atau $(0,2)$, adalah penyelesaian: tak terhingga banyaknya.`,
  ),
})

/** The coefficient vectors (2, 3) and (3, −2) of 2x + 3y = 12 and 3x − 2y = 5 span a parallelogram of area 13 = |D|. */
const FIG_AREA: ArticleBlock = plot({
  range: 1,
  xSpan: [-1, 6],
  ySpan: [-3, 4],
  items: [
    { t: 'poly', pts: [[0, 0], [2, 3], [5, 1], [3, -2]], color: 'a' },
    { t: 'vec', from: [0, 0], to: [2, 3], color: 'b', label: 'n₁' },
    { t: 'vec', from: [0, 0], to: [3, -2], color: 'c', label: 'n₂' },
    { t: 'text', at: [2.5, 0.6], text: 'area 13', size: 'sm', color: 'result' },
  ],
  caption: L(
    T`For $2x+3y=12$ and $3x-2y=5$, the coefficients make the vectors $n_1=(2,3)$ and $n_2=(3,-2)$. The parallelogram on them has area $|2\cdot(-2)-3\cdot3|=13$, which is $|D|$. If the two vectors pointed the same way the parallelogram would be flat, the area $0$, and the lines would have the same direction.`,
    T`Untuk $2x+3y=12$ dan $3x-2y=5$, koefisiennya membentuk vektor $n_1=(2,3)$ dan $n_2=(3,-2)$. Jajar genjang pada keduanya memiliki luas $|2\cdot(-2)-3\cdot3|=13$, yaitu $|D|$. Bila kedua vektor searah, jajar genjangnya pipih, luasnya $0$, dan kedua garis berarah sama.`,
  ),
})

export const body: ArticleBody = {
  answer: L(
    T`**A system of two linear equations in two variables asks for the one pair $(x,y)$ that satisfies both equations, which on a graph is the point where two lines cross.** Solve it by substitution (solve one equation for a variable and put that in the other) or by elimination (add or subtract multiples of the equations so a variable cancels). The lines can cross, never meet, or coincide, giving one, no, or infinitely many solutions, and $D=a_1b_2-a_2b_1$ tells which.`,
    T`**Sistem dua persamaan linear dengan dua variabel mencari satu pasangan $(x,y)$ yang memenuhi kedua persamaan, yang pada grafik adalah titik tempat dua garis berpotongan.** Selesaikan dengan substitusi (selesaikan satu persamaan untuk sebuah variabel lalu masukkan ke yang lain) atau eliminasi (jumlahkan atau kurangkan kelipatan persamaan agar sebuah variabel habis). Kedua garis dapat berpotongan, tak bertemu, atau berimpit, memberi satu, tidak ada, atau tak terhingga penyelesaian, dan $D=a_1b_2-a_2b_1$ menentukan yang mana.`,
  ),

  keyPoints: [
    L(
      T`A system is two conditions at once: $a_1x+b_1y=c_1$ and $a_2x+b_2y=c_2$. Each equation alone has infinitely many solutions (the points of a line); the system asks for the pair that is on both lines.`,
      T`Sistem adalah dua syarat sekaligus: $a_1x+b_1y=c_1$ dan $a_2x+b_2y=c_2$. Tiap persamaan sendirian memiliki tak terhingga penyelesaian (titik-titik sebuah garis); sistem meminta pasangan yang berada di kedua garis.`,
    ),
    L(
      T`There are exactly three outcomes: the lines cross (one solution, $D\ne0$), are parallel (none, $D=0$ and the right-hand sides do not fit), or are the same line (infinitely many, $D=0$ and they fit).`,
      T`Hanya ada tiga kemungkinan: garis berpotongan (satu penyelesaian, $D\ne0$), sejajar (tidak ada, $D=0$ dan ruas kanan tidak cocok), atau garis yang sama (tak terhingga, $D=0$ dan cocok).`,
    ),
    L(
      T`Substitution is easiest when some variable has coefficient $1$ or $-1$; elimination works for every system and keeps the numbers whole: multiply so one variable has opposite coefficients, then add (or subtract when they are equal).`,
      T`Substitusi paling mudah bila ada variabel berkoefisien $1$ atau $-1$; eliminasi berlaku untuk semua sistem dan menjaga bilangan tetap bulat: kalikan agar satu variabel berkoefisien berlawanan, lalu jumlahkan (atau kurangkan bila sama).`,
    ),
    L(
      T`Elimination that ends in $0=0$ means infinitely many solutions, and one that ends in $0=5$ (any false statement) means none. Always check the answer in both original equations.`,
      T`Eliminasi yang berakhir pada $0=0$ berarti tak terhingga penyelesaian, dan yang berakhir pada $0=5$ (pernyataan salah apa pun) berarti tidak ada. Selalu periksa jawaban di kedua persamaan semula.`,
    ),
    L(
      T`Cramer’s rule gives the answer at once when $D\ne0$: $x=\frac{c_1b_2-c_2b_1}{D}$ and $y=\frac{a_1c_2-a_2c_1}{D}$. $|D|$ is the area of the parallelogram on the coefficient vectors, so $D=0$ means the lines have the same direction.`,
      T`Aturan Cramer memberi jawabannya sekaligus bila $D\ne0$: $x=\frac{c_1b_2-c_2b_1}{D}$ dan $y=\frac{a_1c_2-a_2c_1}{D}$. $|D|$ adalah luas jajar genjang pada vektor koefisien, sehingga $D=0$ berarti kedua garis berarah sama.`,
    ),
    L(
      T`Lines that are almost parallel make the answer extremely sensitive: for $x+y=2$ and $x+(1+\varepsilon)y=2+\delta$ the answer moves by $\delta/\varepsilon$. In double precision, $1+\varepsilon$ is exactly $1$ below about $10^{-16}$ and the solver sees $D=0$; exact fractions do not.`,
      T`Garis yang hampir sejajar membuat jawaban sangat peka: untuk $x+y=2$ dan $x+(1+\varepsilon)y=2+\delta$ jawabannya bergeser sebesar $\delta/\varepsilon$. Dalam presisi ganda, $1+\varepsilon$ tepat $1$ di bawah sekitar $10^{-16}$ dan penyelesai melihat $D=0$; pecahan eksak tidak.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- what */
    {
      id: 'what-is-a-system',
      heading: L('What is a system of linear equations in two variables?', 'Apa itu sistem persamaan linear dua variabel (SPLDV)?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A system of two linear equations in two variables is a pair of equations, $a_1x+b_1y=c_1$ and $a_2x+b_2y=c_2$, that must be true at the same time; its solution is a pair of numbers $(x,y)$ that makes both true.** "Linear" means each unknown appears only to the first power and is only multiplied by a number, so each equation is a straight line. In Indonesian schools the topic is called SPLDV, short for *sistem persamaan linear dua variabel*.

Take $x+y=10$. It has infinitely many solutions: $(0,10)$, $(4,6)$, $(5,5)$, $(6,4)$, $(10,0)$ and every other pair that adds to $10$. The equation $x-y=2$ also has infinitely many: $(2,0)$, $(3,1)$, $(6,4)$, $(8,6)$. Only one pair is on both lists, $(6,4)$, and that is the solution of the system
$$\begin{cases} x+y=10 \\ x-y=2 \end{cases}$$
Check it in both equations: $6+4=10$ and $6-4=2$. Each equation on its own leaves one degree of freedom; the second one removes it, which is why two equations can pin down two unknowns. Writing a problem in words as such a pair is the skill of [turning words into algebra](article:algebraic-expressions#words-to-algebra).`,
            T`**Sistem dua persamaan linear dengan dua variabel adalah sepasang persamaan, $a_1x+b_1y=c_1$ dan $a_2x+b_2y=c_2$, yang harus benar sekaligus; penyelesaiannya adalah pasangan bilangan $(x,y)$ yang membuat keduanya benar.** "Linear" berarti tiap bilangan tak diketahui hanya berpangkat satu dan hanya dikalikan bilangan, sehingga tiap persamaan adalah garis lurus. Di sekolah di Indonesia topik ini disebut SPLDV, singkatan dari *sistem persamaan linear dua variabel*.

Ambil $x+y=10$. Ia punya tak terhingga penyelesaian: $(0,10)$, $(4,6)$, $(5,5)$, $(6,4)$, $(10,0)$, dan setiap pasangan lain yang berjumlah $10$. Persamaan $x-y=2$ juga punya tak terhingga: $(2,0)$, $(3,1)$, $(6,4)$, $(8,6)$. Hanya satu pasangan yang ada di kedua daftar, $(6,4)$, dan itulah penyelesaian sistem
$$\begin{cases} x+y=10 \\ x-y=2 \end{cases}$$
Periksa di kedua persamaan: $6+4=10$ dan $6-4=2$. Tiap persamaan sendirian menyisakan satu derajat kebebasan; persamaan kedua menghilangkannya, itulah sebabnya dua persamaan dapat memastikan dua bilangan tak diketahui. Menuliskan soal cerita sebagai pasangan seperti itu adalah keterampilan [mengubah kalimat menjadi aljabar](article:algebraic-expressions#words-to-algebra).`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------- the graph */
    {
      id: 'graphs-and-solutions',
      heading: L('What does the graph of a system show, and how many solutions can it have?', 'Apa yang ditunjukkan grafik sistem, dan berapa banyak penyelesaian yang mungkin?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Each equation is a line, and the solution of the system is where the two lines meet, so a system has exactly one solution, none, or infinitely many.** When $b\ne0$ the equation $ax+by=c$ is the line $y=\frac{c-ax}{b}$ with slope $-\frac ab$; when $b=0$ it is the vertical line $x=\frac ca$. Two lines in a plane can be in only three positions:

| The lines | Solutions | $D=a_1b_2-a_2b_1$ | Example |
|---|---|---|---|
| cross at one point | exactly one | $D\ne0$ | $x+y=10$ and $x-y=2$ |
| are parallel | none | $D=0$, right-hand sides do not fit | $2x+3y=6$ and $4x+6y=18$ |
| are the same line | infinitely many | $D=0$, right-hand sides fit | $x+2y=4$ and $3x+6y=12$ |

The number $D$ decides because two lines are parallel exactly when their slopes are equal: $-\frac{a_1}{b_1}=-\frac{a_2}{b_2}$, which after cross-multiplying is $a_1b_2=a_2b_1$, that is $D=0$. When $D=0$ the lines are either on top of each other or apart, and the right-hand sides tell which: if $c_2$ is the same multiple of $c_1$ that the other numbers are, the second equation is the first one in disguise.

A school shortcut compares ratios: one solution if $\frac{a_1}{a_2}\ne\frac{b_1}{b_2}$, none if $\frac{a_1}{a_2}=\frac{b_1}{b_2}\ne\frac{c_1}{c_2}$, infinitely many if all three ratios are equal. It breaks when a coefficient is $0$ (you cannot divide by it), and $D$ never does. Type any two equations below and watch the lines.`,
            T`**Tiap persamaan adalah garis, dan penyelesaian sistem adalah tempat kedua garis bertemu, sehingga sistem punya tepat satu penyelesaian, tidak ada, atau tak terhingga.** Bila $b\ne0$ persamaan $ax+by=c$ adalah garis $y=\frac{c-ax}{b}$ dengan kemiringan $-\frac ab$; bila $b=0$ ia garis tegak $x=\frac ca$. Dua garis di bidang hanya dapat berada pada tiga posisi:

| Kedua garis | Penyelesaian | $D=a_1b_2-a_2b_1$ | Contoh |
|---|---|---|---|
| berpotongan di satu titik | tepat satu | $D\ne0$ | $x+y=10$ dan $x-y=2$ |
| sejajar | tidak ada | $D=0$, ruas kanan tidak cocok | $2x+3y=6$ dan $4x+6y=18$ |
| garis yang sama | tak terhingga | $D=0$, ruas kanan cocok | $x+2y=4$ dan $3x+6y=12$ |

Bilangan $D$ menentukan karena dua garis sejajar tepat ketika kemiringannya sama: $-\frac{a_1}{b_1}=-\frac{a_2}{b_2}$, yang setelah dikali silang menjadi $a_1b_2=a_2b_1$, yaitu $D=0$. Bila $D=0$ kedua garis saling menumpuk atau berjauhan, dan ruas kanan yang memberi tahu mana: bila $c_2$ adalah kelipatan $c_1$ yang sama dengan kelipatan bilangan lainnya, persamaan kedua adalah persamaan pertama yang menyamar.

Jalan pintas di sekolah membandingkan rasio: satu penyelesaian bila $\frac{a_1}{a_2}\ne\frac{b_1}{b_2}$, tidak ada bila $\frac{a_1}{a_2}=\frac{b_1}{b_2}\ne\frac{c_1}{c_2}$, tak terhingga bila ketiga rasio sama. Ia gagal bila ada koefisien $0$ (tak dapat dibagi), dan $D$ tak pernah gagal. Ketik dua persamaan mana pun di bawah dan lihat garisnya.`,
          ),
        },
        { kind: 'widget', name: 'lsgraph' },
        FIG_CROSS,
        FIG_PARALLEL,
        FIG_SAME,
      ],
    },

    /* ------------------------------------------------------------------------- substitution */
    {
      id: 'substitution',
      heading: L('How do you solve a system by substitution?', 'Bagaimana menyelesaikan sistem dengan metode substitusi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To solve by substitution, solve one equation for one variable, put that expression in the other equation, solve the resulting one-variable equation, and go back for the other variable.** Take
$$\begin{cases} 2x-y=1 \\ 3x+2y=12 \end{cases}$$
1. Solve the first equation for $y$, which has coefficient $-1$: $y=2x-1$.
2. Put that in for $y$ in the *other* equation: $3x+2(2x-1)=12$.
3. Expand and combine like terms ([see the rules](article:algebraic-expressions#like-terms)): $3x+4x-2=12$, so $7x=14$ and $x=2$.
4. Go back: $y=2\cdot2-1=3$.

The solution is $(2,3)$. Check both equations: $2\cdot2-3=1$ and $3\cdot2+2\cdot3=12$. Two things go wrong most often. Substituting into the *same* equation you took the expression from only gives $0=0$ or $x=x$, since it is the same fact twice. And a missing bracket around the substituted expression changes the sum: it is $2(2x-1)$, not $2\cdot2x-1$.

Substitution is at its best when a variable has coefficient $1$ or $-1$, as here. If every coefficient is bigger, isolating a variable creates fractions: in $2x+3y=12$ and $3x-2y=5$, solving the first for $x$ gives $x=6-\frac32y$, and the work is easier by elimination, next.`,
            T`**Untuk menyelesaikan dengan substitusi, selesaikan satu persamaan untuk satu variabel, masukkan ungkapan itu ke persamaan lain, selesaikan persamaan satu variabel yang dihasilkan, lalu kembali mencari variabel yang lain.** Ambil
$$\begin{cases} 2x-y=1 \\ 3x+2y=12 \end{cases}$$
1. Selesaikan persamaan pertama untuk $y$, yang berkoefisien $-1$: $y=2x-1$.
2. Masukkan itu sebagai $y$ ke persamaan *yang lain*: $3x+2(2x-1)=12$.
3. Jabarkan dan gabungkan suku sejenis ([lihat aturannya](article:algebraic-expressions#like-terms)): $3x+4x-2=12$, sehingga $7x=14$ dan $x=2$.
4. Kembali: $y=2\cdot2-1=3$.

Penyelesaiannya $(2,3)$. Periksa kedua persamaan: $2\cdot2-3=1$ dan $3\cdot2+2\cdot3=12$. Dua hal paling sering salah. Memasukkan ke persamaan yang *sama* dengan asal ungkapan itu hanya menghasilkan $0=0$ atau $x=x$, karena itu fakta yang sama dua kali. Dan kurung yang hilang di sekitar ungkapan yang dimasukkan mengubah jumlahnya: yang benar $2(2x-1)$, bukan $2\cdot2x-1$.

Substitusi paling baik bila ada variabel berkoefisien $1$ atau $-1$, seperti di sini. Bila semua koefisien lebih besar, mengisolasi sebuah variabel menimbulkan pecahan: pada $2x+3y=12$ dan $3x-2y=5$, menyelesaikan yang pertama untuk $x$ memberi $x=6-\frac32y$, dan pekerjaan lebih mudah dengan eliminasi, berikut.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------------------- elimination */
    {
      id: 'elimination',
      heading: L('How do you solve a system by elimination?', 'Bagaimana menyelesaikan sistem dengan metode eliminasi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To solve by elimination, multiply the equations so one variable has coefficients of the same size, then add the equations if the coefficients have opposite signs (or subtract them if the signs are equal), so that variable cancels.** You may add equations because adding equal things to both sides of a true statement keeps it true.

The easy case first, $x+y=10$ and $x-y=2$: the $y$-coefficients are already opposite, so adding gives $2x=12$, $x=6$, and the first equation gives $y=4$.

When no variable cancels at once, scale the equations. For
$$\begin{cases} 2x+3y=12 \\ 3x-2y=5 \end{cases}$$
make the $y$-coefficients $6$ and $-6$: multiply the first equation by $2$ and the second by $3$.
$$\begin{cases} 4x+6y=24 \\ 9x-6y=15 \end{cases}$$
Adding cancels $y$: $13x=39$, so $x=3$. Put $x=3$ in the first original equation: $6+3y=12$, so $y=2$. Check the second: $3\cdot3-2\cdot2=5$. The multipliers come from the least common multiple of the two coefficients, here $6$ ([see the LCM](article:integers#gcd-lcm)); use the smallest ones, so the numbers stay small. Eliminating $x$ instead works just as well: multiply by $3$ and $2$ and subtract.

Two cautions. Multiply *every* term of an equation, both sides included. And when you subtract an equation, change the sign of every term in it, not only the first. Try your own system, with the steps written out, below: any of the three methods, exact fractions throughout.`,
            T`**Untuk menyelesaikan dengan eliminasi, kalikan persamaan agar satu variabel memiliki koefisien yang sama besar, lalu jumlahkan persamaan bila koefisiennya berlawanan tanda (atau kurangkan bila tandanya sama), sehingga variabel itu habis.** Persamaan boleh dijumlahkan karena menambah hal yang sama pada kedua ruas pernyataan yang benar menjaganya tetap benar.

Kasus mudah dulu, $x+y=10$ dan $x-y=2$: koefisien $y$ sudah berlawanan, jadi penjumlahan memberi $2x=12$, $x=6$, dan persamaan pertama memberi $y=4$.

Bila tak ada variabel yang habis sekaligus, ubah skala persamaan. Untuk
$$\begin{cases} 2x+3y=12 \\ 3x-2y=5 \end{cases}$$
buat koefisien $y$ menjadi $6$ dan $-6$: kalikan persamaan pertama dengan $2$ dan yang kedua dengan $3$.
$$\begin{cases} 4x+6y=24 \\ 9x-6y=15 \end{cases}$$
Menjumlahkan menghabiskan $y$: $13x=39$, sehingga $x=3$. Masukkan $x=3$ ke persamaan pertama semula: $6+3y=12$, sehingga $y=2$. Periksa yang kedua: $3\cdot3-2\cdot2=5$. Pengalinya berasal dari kelipatan persekutuan terkecil kedua koefisien, di sini $6$ ([lihat KPK](article:integers#gcd-lcm)); pakai yang terkecil, agar bilangan tetap kecil. Mengeliminasi $x$ sebagai gantinya sama baiknya: kalikan dengan $3$ dan $2$ lalu kurangkan.

Dua kewaspadaan. Kalikan *setiap* suku persamaan, kedua ruas termasuk. Dan saat mengurangkan sebuah persamaan, ubah tanda setiap suku di dalamnya, bukan hanya yang pertama. Cobalah sistemmu sendiri, dengan langkah-langkah yang ditulis, di bawah: salah satu dari tiga metode, dengan pecahan eksak sepanjang jalan.`,
          ),
        },
        { kind: 'widget', name: 'lselim' },
      ],
    },

    /* --------------------------------------------------------------------- special cases */
    {
      id: 'no-solution-or-infinite',
      heading: L('What happens when a system has no solution or infinitely many?', 'Apa yang terjadi bila sistem tidak punya penyelesaian atau punya tak terhingga?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**When elimination makes every variable disappear, what is left is a statement with no unknowns: if it is true ($0=0$) the system has infinitely many solutions, and if it is false ($0=-4$) it has none.** Nothing has gone wrong; the algebra is reporting the geometry.

*No solution.* For $2x+4y=10$ and $x+2y=7$, multiply the second by $2$ to get $2x+4y=14$ and subtract it from the first: $0=-4$. That is false for every $x$ and $y$, so no pair satisfies both: the lines are parallel. The left sides match (one is twice the other) but the right sides do not.

*Infinitely many solutions.* For $x+2y=4$ and $3x+6y=12$, multiply the first by $3$ to get $3x+6y=12$ and subtract the second: $0=0$. That is always true, so the second equation told us nothing new: it is the first one in disguise, and every point of the line $x+2y=4$ is a solution. They can be listed by choosing $y=t$ freely: $x=4-2t$, $y=t$, giving $(4,0)$ for $t=0$, $(2,1)$ for $t=1$, $(0,2)$ for $t=2$, and so on.

Do not mix the two up: $0=0$ is true, so there are *many* solutions; $0=5$ is false, so there are *none*. The same happens with substitution, where the one-variable equation turns into $0=0$ or $0=5$ instead of $7x=14$. Both of these systems are in the widget above; type them to see the working.`,
            T`**Bila eliminasi menghabiskan setiap variabel, yang tersisa adalah pernyataan tanpa bilangan tak diketahui: bila benar ($0=0$) sistem punya tak terhingga penyelesaian, dan bila salah ($0=-4$) ia tidak punya.** Tak ada yang keliru; aljabar sedang melaporkan geometrinya.

*Tanpa penyelesaian.* Untuk $2x+4y=10$ dan $x+2y=7$, kalikan yang kedua dengan $2$ untuk mendapat $2x+4y=14$ dan kurangkan dari yang pertama: $0=-4$. Itu salah untuk setiap $x$ dan $y$, sehingga tak ada pasangan yang memenuhi keduanya: garisnya sejajar. Ruas kirinya cocok (satu dua kali yang lain) tetapi ruas kanannya tidak.

*Tak terhingga penyelesaian.* Untuk $x+2y=4$ dan $3x+6y=12$, kalikan yang pertama dengan $3$ untuk mendapat $3x+6y=12$ dan kurangkan yang kedua: $0=0$. Itu selalu benar, jadi persamaan kedua tak memberi hal baru: ia persamaan pertama yang menyamar, dan setiap titik pada garis $x+2y=4$ adalah penyelesaian. Mereka dapat didaftar dengan memilih $y=t$ bebas: $x=4-2t$, $y=t$, memberi $(4,0)$ untuk $t=0$, $(2,1)$ untuk $t=1$, $(0,2)$ untuk $t=2$, dan seterusnya.

Jangan tertukar: $0=0$ benar, sehingga ada *banyak* penyelesaian; $0=5$ salah, sehingga *tidak ada*. Hal yang sama terjadi pada substitusi, tempat persamaan satu variabel berubah menjadi $0=0$ atau $0=5$ alih-alih $7x=14$. Kedua sistem itu ada di widget di atas; ketik untuk melihat pengerjaannya.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------- Cramer */
    {
      id: 'cramers-rule',
      heading: L('What is Cramer’s rule for two equations, and why does the determinant decide?', 'Apa aturan Cramer untuk dua persamaan, dan mengapa determinan yang menentukan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Cramer’s rule says that when $D=a_1b_2-a_2b_1\ne0$, the solution is $x=\frac{D_x}{D}$ and $y=\frac{D_y}{D}$, with $D_x=c_1b_2-c_2b_1$ and $D_y=a_1c_2-a_2c_1$.** It is elimination done once for every system. To eliminate $y$ from $a_1x+b_1y=c_1$ and $a_2x+b_2y=c_2$, multiply the first by $b_2$ and the second by $b_1$ and subtract:
$$(a_1b_2-a_2b_1)\,x=c_1b_2-c_2b_1.$$
To eliminate $x$, multiply by $a_2$ and $a_1$ and subtract the other way:
$$(a_1b_2-a_2b_1)\,y=a_1c_2-a_2c_1.$$
Both equations have the same coefficient $D$ in front, so if $D\ne0$ you divide and are done; if $D=0$ you cannot divide, and that is exactly the parallel or coincident case.

For $2x+3y=12$ and $3x-2y=5$: $D=2\cdot(-2)-3\cdot3=-13$, $D_x=12\cdot(-2)-5\cdot3=-39$, $D_y=2\cdot5-3\cdot12=-26$. So $x=\frac{-39}{-13}=3$ and $y=\frac{-26}{-13}=2$, as before.

There is a picture behind $D$. Take the coefficients of each equation as a vector, $n_1=(a_1,b_1)$ and $n_2=(a_2,b_2)$ (each is perpendicular to its line). Then $|D|$ is the area of the parallelogram they span. If the two lines have the same direction, $n_1$ and $n_2$ are parallel, the parallelogram is flat, and $D=0$.`,
            T`**Aturan Cramer mengatakan bahwa bila $D=a_1b_2-a_2b_1\ne0$, penyelesaiannya $x=\frac{D_x}{D}$ dan $y=\frac{D_y}{D}$, dengan $D_x=c_1b_2-c_2b_1$ dan $D_y=a_1c_2-a_2c_1$.** Ia adalah eliminasi yang dikerjakan sekali untuk setiap sistem. Untuk mengeliminasi $y$ dari $a_1x+b_1y=c_1$ dan $a_2x+b_2y=c_2$, kalikan yang pertama dengan $b_2$ dan yang kedua dengan $b_1$ lalu kurangkan:
$$(a_1b_2-a_2b_1)\,x=c_1b_2-c_2b_1.$$
Untuk mengeliminasi $x$, kalikan dengan $a_2$ dan $a_1$ lalu kurangkan dengan arah sebaliknya:
$$(a_1b_2-a_2b_1)\,y=a_1c_2-a_2c_1.$$
Kedua persamaan memiliki koefisien yang sama $D$ di depannya, sehingga bila $D\ne0$ kamu membagi dan selesai; bila $D=0$ kamu tak dapat membagi, dan itu tepat kasus sejajar atau berimpit.

Untuk $2x+3y=12$ dan $3x-2y=5$: $D=2\cdot(-2)-3\cdot3=-13$, $D_x=12\cdot(-2)-5\cdot3=-39$, $D_y=2\cdot5-3\cdot12=-26$. Jadi $x=\frac{-39}{-13}=3$ dan $y=\frac{-26}{-13}=2$, seperti sebelumnya.

Ada gambar di balik $D$. Ambil koefisien tiap persamaan sebagai vektor, $n_1=(a_1,b_1)$ dan $n_2=(a_2,b_2)$ (masing-masing tegak lurus pada garisnya). Maka $|D|$ adalah luas jajar genjang yang direntangkannya. Bila kedua garis berarah sama, $n_1$ dan $n_2$ sejajar, jajar genjangnya pipih, dan $D=0$.`,
          ),
        },
        FIG_AREA,
      ],
    },

    /* ----------------------------------------------------------------------- word problems */
    {
      id: 'word-problems',
      heading: L('How do you solve a word problem with two unknowns?', 'Bagaimana menyelesaikan soal cerita dengan dua bilangan tak diketahui?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Solve a word problem with two unknowns in five steps: name the two unknowns with their units, write one equation for each fact, solve the system, check the answer against the words of the problem, and answer in a sentence.** The equations are the hard part; the solving is the same as above.

*Tickets.* Two adult tickets and three child tickets cost $60 in all, and one adult ticket and two child tickets cost $35. Let $x$ be the price of an adult ticket and $y$ that of a child ticket, in dollars:
$$\begin{cases} 2x+3y=60 \\ x+2y=35 \end{cases}$$
Multiply the second by $2$ to get $2x+4y=70$, subtract the first: $y=10$. Then $x=35-2\cdot10=15$. An adult ticket costs $15 and a child ticket $10. Check in words: $2\cdot15+3\cdot10=60$ and $15+2\cdot10=35$.

*Ages.* A father and his son are $40$ years old together, and the father is three times as old as the son. With $x$ the father’s age and $y$ the son’s: $x+y=40$ and $x=3y$. This is made for substitution: $3y+y=40$, so $y=10$ and $x=30$.

*A boat on a river.* A boat goes $18$ km/h with the current and $12$ km/h against it. If $x$ is the speed of the boat in still water and $y$ the speed of the current, then $x+y=18$ and $x-y=12$. Adding gives $2x=30$, so the boat does $15$ km/h and the current is $3$ km/h.

The most common slip is writing both equations about the same fact. Each equation should use a *different* piece of information; if the second could be got from the first, you will meet $0=0$. And always check against the story: an age of $-3$ or a price of $0.5$ people may be a clue that an equation was set up wrongly.`,
            T`**Selesaikan soal cerita dengan dua bilangan tak diketahui dalam lima langkah: namai kedua bilangan tak diketahui beserta satuannya, tulis satu persamaan untuk tiap fakta, selesaikan sistemnya, periksa jawaban terhadap kata-kata soal, dan jawab dengan satu kalimat.** Persamaannya bagian yang sulit; menyelesaikannya sama seperti di atas.

*Tiket.* Dua tiket dewasa dan tiga tiket anak harganya Rp60.000 seluruhnya, dan satu tiket dewasa dan dua tiket anak Rp35.000. Misalkan $x$ harga tiket dewasa dan $y$ harga tiket anak, dalam ribu rupiah:
$$\begin{cases} 2x+3y=60 \\ x+2y=35 \end{cases}$$
Kalikan yang kedua dengan $2$ untuk mendapat $2x+4y=70$, kurangkan yang pertama: $y=10$. Lalu $x=35-2\cdot10=15$. Tiket dewasa Rp15.000 dan tiket anak Rp10.000. Periksa dalam kata-kata: $2\cdot15+3\cdot10=60$ dan $15+2\cdot10=35$.

*Umur.* Seorang ayah dan anaknya berumur $40$ tahun bersama-sama, dan umur ayah tiga kali umur anaknya. Dengan $x$ umur ayah dan $y$ umur anak: $x+y=40$ dan $x=3y$. Ini cocok untuk substitusi: $3y+y=40$, sehingga $y=10$ dan $x=30$.

*Perahu di sungai.* Sebuah perahu melaju $18$ km/jam searah arus dan $12$ km/jam melawan arus. Bila $x$ kecepatan perahu di air tenang dan $y$ kecepatan arus, maka $x+y=18$ dan $x-y=12$. Menjumlahkan memberi $2x=30$, sehingga perahu melaju $15$ km/jam dan arusnya $3$ km/jam.

Kekeliruan paling umum adalah menulis kedua persamaan tentang fakta yang sama. Tiap persamaan harus memakai informasi yang *berbeda*; bila yang kedua dapat diperoleh dari yang pertama, kamu akan bertemu $0=0$. Dan selalu periksa terhadap ceritanya: umur $-3$ atau harga $0{,}5$ orang bisa menjadi petunjuk bahwa sebuah persamaan disusun salah.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------- the choice */
    {
      id: 'which-method',
      heading: L('Which method should you choose for a system of equations?', 'Metode mana yang sebaiknya dipilih untuk sistem persamaan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Use substitution when a variable has coefficient $1$ or $-1$, elimination when the coefficients are larger, Cramer’s rule when you want a formula or a program, and the graph to see the three outcomes.** All four give the same answer.

| Method | Best when | Watch out |
|---|---|---|
| Graph | you want to see how many solutions there are | reading $(\frac{31}{11},\frac5{11})$ off a grid is guesswork |
| Substitution | one variable has coefficient $1$ or $-1$ | fractions appear if you isolate a bigger coefficient |
| Elimination | the coefficients are bigger, or the system is large | multiply every term; subtract all of the signs |
| Cramer’s rule | writing a formula or a program | $D=0$ means no formula: test it exactly |

For three or more unknowns, elimination is the one that grows into Gaussian elimination, the method behind every serious linear solver, and Cramer’s rule becomes very slow. The square roots, fractions and decimals that can appear in the answers are handled the usual way: leave the exact fraction as long as you can ([fractions](article:rational-numbers#add-subtract-fractions)) and round only at the end.`,
            T`**Pakai substitusi bila ada variabel berkoefisien $1$ atau $-1$, eliminasi bila koefisiennya lebih besar, aturan Cramer bila kamu ingin rumus atau program, dan grafik untuk melihat ketiga kemungkinan.** Keempatnya memberi jawaban yang sama.

| Metode | Terbaik bila | Waspadai |
|---|---|---|
| Grafik | ingin melihat berapa banyak penyelesaian | membaca $(\frac{31}{11},\frac5{11})$ dari kisi hanyalah tebakan |
| Substitusi | satu variabel berkoefisien $1$ atau $-1$ | pecahan muncul bila mengisolasi koefisien yang lebih besar |
| Eliminasi | koefisien lebih besar, atau sistemnya besar | kalikan setiap suku; kurangkan semua tandanya |
| Aturan Cramer | menulis rumus atau program | $D=0$ berarti tak ada rumus: ujilah secara eksak |

Untuk tiga bilangan tak diketahui atau lebih, eliminasi adalah yang berkembang menjadi eliminasi Gauss, metode di balik setiap penyelesai linear yang serius, dan aturan Cramer menjadi sangat lambat. Pecahan dan desimal yang dapat muncul pada jawaban ditangani seperti biasa: biarkan pecahan eksak selama mungkin ([pecahan](article:rational-numbers#add-subtract-fractions)) dan bulatkan hanya di akhir.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- numerics */
    {
      id: 'nearly-parallel-lines',
      heading: L('Why do nearly parallel lines make a computer give the wrong answer?', 'Mengapa garis yang hampir sejajar membuat komputer memberi jawaban yang salah?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**When two lines are nearly parallel, a tiny change in one number moves their crossing point a long way, so the system is ill-conditioned and a computer, which stores numbers with tiny errors, can return a badly wrong answer or none at all.** Take
$$\begin{cases} x+y=2 \\ x+(1+\varepsilon)\,y=2+\delta \end{cases}$$
with $\varepsilon$ small. Subtract the first from the second: $\varepsilon y=\delta$, so $y=\frac{\delta}{\varepsilon}$ and $x=2-\frac\delta\varepsilon$. With $\delta=0$ the answer is $(2,0)$. With $\varepsilon=10^{-6}$ and a nudge of only $\delta=10^{-9}$ in one right-hand side, $y$ becomes $10^{-3}$: a change in the ninth decimal place of one number appears in the third of the answer. The amplification is $\frac1\varepsilon$ and the condition number of the coefficients, which measures how much any change can be magnified, is about $\frac4\varepsilon$.

A computer adds a second problem. $D=a_1b_2-a_2b_1$ subtracts two products that are nearly equal, which is [cancellation](article:floating-point-numbers#cancellation), and in double precision $1+\varepsilon$ is exactly $1$ once $\varepsilon$ is below about $10^{-16}$: both equations look identical, $D$ comes out exactly $0$, and a solver reports "singular" or divides by zero. Move the sliders below to see the exact answer, the double-precision answer, and where the computer gives up.

What helps: for a system you build by hand from whole numbers or fractions, use exact arithmetic (Python’s ´Fraction´ never loses the $\varepsilon$); never test ´D == 0´ on numbers that came from measurements, compare with a tolerance; and for real data use a solver that pivots and report the *residual* and the condition number, remembering that a tiny residual does not prove a small error when the condition number is huge.`,
            T`**Bila dua garis hampir sejajar, perubahan kecil pada satu bilangan memindahkan titik potongnya jauh sekali, sehingga sistem itu berkondisi buruk dan komputer, yang menyimpan bilangan dengan galat kecil, dapat memberi jawaban yang sangat salah atau tidak ada sama sekali.** Ambil
$$\begin{cases} x+y=2 \\ x+(1+\varepsilon)\,y=2+\delta \end{cases}$$
dengan $\varepsilon$ kecil. Kurangkan yang pertama dari yang kedua: $\varepsilon y=\delta$, sehingga $y=\frac{\delta}{\varepsilon}$ dan $x=2-\frac\delta\varepsilon$. Dengan $\delta=0$ jawabannya $(2,0)$. Dengan $\varepsilon=10^{-6}$ dan geseran hanya $\delta=10^{-9}$ pada satu ruas kanan, $y$ menjadi $10^{-3}$: perubahan di desimal kesembilan satu bilangan muncul di desimal ketiga jawabannya. Faktor pembesarannya $\frac1\varepsilon$ dan bilangan kondisi koefisien, yang mengukur seberapa besar perubahan apa pun dapat dibesarkan, sekitar $\frac4\varepsilon$.

Komputer menambah masalah kedua. $D=a_1b_2-a_2b_1$ mengurangkan dua hasil kali yang hampir sama, yaitu [pembatalan](article:floating-point-numbers#cancellation), dan dalam presisi ganda $1+\varepsilon$ tepat $1$ begitu $\varepsilon$ di bawah sekitar $10^{-16}$: kedua persamaan tampak identik, $D$ keluar tepat $0$, dan penyelesai melaporkan "singular" atau membagi dengan nol. Geser penggeser di bawah untuk melihat jawaban eksak, jawaban presisi ganda, dan tempat komputer menyerah.

Yang membantu: untuk sistem yang kamu susun sendiri dari bilangan bulat atau pecahan, pakai aritmetika eksak (´Fraction´ Python tak pernah kehilangan $\varepsilon$); jangan pernah menguji ´D == 0´ pada bilangan yang berasal dari pengukuran, bandingkan dengan toleransi; dan untuk data nyata pakai penyelesai yang melakukan pivot dan laporkan *residu* serta bilangan kondisinya, dengan mengingat bahwa residu yang kecil tidak membuktikan galat yang kecil bila bilangan kondisinya sangat besar.`,
          ),
        },
        { kind: 'widget', name: 'lsill' },
      ],
    },

    /* ------------------------------------------------------------------------------- code */
    {
      id: 'linear-systems-in-code',
      heading: L('How do you solve a system of equations in a program?', 'Bagaimana menyelesaikan sistem persamaan dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program solves a two-variable system with Cramer’s rule in a few lines: compute $D$, divide when it is not zero, and otherwise decide between "no solution" and "infinitely many" from the right-hand sides.** For whole numbers do everything in integers and fractions, so that $\frac{31}{11}$ stays exact. The three programs below print the same four systems from this article, the last two being parallel and the same line, and then show the nearly parallel trap: $1\cdot(1+10^{-16})-1\cdot1$ is exactly $0$ in double precision, while Python’s exact fractions still find the answer $(1,1)$.`,
            T`**Program menyelesaikan sistem dua variabel dengan aturan Cramer dalam beberapa baris: hitung $D$, bagi bila tidak nol, dan bila nol tentukan antara "tidak ada penyelesaian" dan "tak terhingga" dari ruas kanannya.** Untuk bilangan bulat kerjakan semuanya dalam bilangan bulat dan pecahan, agar $\frac{31}{11}$ tetap eksak. Ketiga program di bawah mencetak empat sistem yang sama dari artikel ini, dua yang terakhir sejajar dan garis yang sama, lalu memperlihatkan jebakan hampir sejajar: $1\cdot(1+10^{-16})-1\cdot1$ tepat $0$ dalam presisi ganda, sedangkan pecahan eksak Python masih menemukan jawaban $(1,1)$.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: exact Cramer’s rule with Fraction', 'Python: aturan Cramer eksak dengan Fraction'),
          code: `from fractions import Fraction


def solve2(a1, b1, c1, a2, b2, c2):
    """a1 x + b1 y = c1 and a2 x + b2 y = c2, exactly. Each equation must contain x or y."""
    a1, b1, c1, a2, b2, c2 = (Fraction(v) for v in (a1, b1, c1, a2, b2, c2))
    D = a1 * b2 - a2 * b1
    if D != 0:
        return 'one', (c1 * b2 - c2 * b1) / D, (a1 * c2 - a2 * c1) / D
    # D = 0: the lines have the same direction; they are one line when the right-hand sides fit as well
    if a1 * c2 == a2 * c1 and b1 * c2 == b2 * c1:
        return 'line', None, None
    return 'none', None, None


def describe(*system):
    kind, x, y = solve2(*system)
    if kind == 'one':
        return f'x = {x}; y = {y}'
    return 'infinitely many solutions' if kind == 'line' else 'no solution'


print(describe(1, 1, 10, 1, -1, 2))     # x = 6; y = 4
print(describe(2, 3, 7, 1, -4, 1))      # x = 31/11; y = 5/11
print(describe(2, 3, 6, 4, 6, 18))      # no solution
print(describe(1, 2, 4, 3, 6, 12))      # infinitely many solutions

# nearly parallel lines: x + y = 2 and x + (1 + e) y = 2 + e, whose exact answer is (1, 1)
e = 1e-16
print(1 * (1 + e) - 1 * 1)              # 0.0: in doubles the two equations are the same
tiny = Fraction(1, 10**16)
print(describe(1, 1, 2, 1, 1 + tiny, 2 + tiny))   # x = 1; y = 1`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same with whole numbers', 'JavaScript: yang sama dengan bilangan bulat'),
          code: `const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b))

// n / d in lowest terms, as text
const frac = (n, d) => {
  const g = gcd(n, d) * Math.sign(d)
  return \`\${n / g}\${d / g === 1 ? '' : '/' + d / g}\`
}

function solve2(a1, b1, c1, a2, b2, c2) {
  const D = a1 * b2 - a2 * b1
  if (D !== 0) return \`x = \${frac(c1 * b2 - c2 * b1, D)}; y = \${frac(a1 * c2 - a2 * c1, D)}\`
  // D = 0: one line when the right-hand sides fit as well, else parallel
  const same = a1 * c2 === a2 * c1 && b1 * c2 === b2 * c1
  return same ? 'infinitely many solutions' : 'no solution'
}

solve2(1, 1, 10, 1, -1, 2)   // 'x = 6; y = 4'
solve2(2, 3, 7, 1, -4, 1)    // 'x = 31/11; y = 5/11'
solve2(2, 3, 6, 4, 6, 18)    // 'no solution'
solve2(1, 2, 4, 3, 6, 12)    // 'infinitely many solutions'

// nearly parallel lines: in doubles, 1 + 1e-16 is exactly 1
const e = 1e-16
1 * (1 + e) - 1 * 1          // 0`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same with integers and printf', 'C++: yang sama dengan bilangan bulat dan printf'),
          code: `#include <iostream>
#include <cstdio>
using namespace std;

int gcd(int a, int b) { return b == 0 ? (a < 0 ? -a : a) : gcd(b, a % b); }

// prints n / d in lowest terms
void printFraction(int n, int d) {
  int g = gcd(n, d);
  if (d < 0) g = -g;
  n = n / g;
  d = d / g;
  if (d == 1) printf("%d", n);
  else printf("%d/%d", n, d);
}

void solve2(int a1, int b1, int c1, int a2, int b2, int c2) {
  int D = a1 * b2 - a2 * b1;
  if (D != 0) {
    printf("x = ");
    printFraction(c1 * b2 - c2 * b1, D);
    printf("; y = ");
    printFraction(a1 * c2 - a2 * c1, D);
    printf("\\n");
  } else if (a1 * c2 == a2 * c1 && b1 * c2 == b2 * c1) {
    printf("infinitely many solutions\\n");
  } else {
    printf("no solution\\n");
  }
}

int main() {
  solve2(1, 1, 10, 1, -1, 2);
  solve2(2, 3, 7, 1, -4, 1);
  solve2(2, 3, 6, 4, 6, 18);
  solve2(1, 2, 4, 3, 6, 12);
  double e = 1e-16;
  printf("%.1f\\n", 1 * (1 + e) - 1 * 1);
  return 0;
}

/* output:
x = 6; y = 4
x = 31/11; y = 5/11
no solution
infinitely many solutions
0.0
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do systems of equations come from?', 'Dari mana asal sistem persamaan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Systems of linear equations are among the oldest problems in mathematics, and the method of elimination is older than the notation we use for it.**

- **From about 1800 BCE.** Clay tablets from Babylon pose problems that amount to two linear equations in two unknowns, such as two fields whose areas and combined yield are known, and solve them with rules that come to elimination.
- **By the 1st century CE.** The Chinese *Nine Chapters on the Mathematical Art* devotes its eighth chapter, *fangcheng* ("rectangular arrays"), to systems of several equations, solved by an elimination procedure on arrays of numbers laid out with counting rods, the same steps as Gaussian elimination.
- **1557.** Robert Recorde writes the first equals sign, $=$, "bicause noe 2 thynges can be moare equalle" than two parallel lines of the same length.
- **1707 and 1750.** Newton’s lectures, published in 1707, describe elimination for several unknowns, and Gabriel Cramer publishes, in 1750, the determinant rule that carries his name (Colin Maclaurin had found it for two and three unknowns a little earlier).
- **Early 19th century.** Gauss uses the systematic elimination for his least-squares calculations, which is why it is called Gaussian elimination; it is the ancestor of the solvers in every numerical library today.`,
            T`**Sistem persamaan linear termasuk masalah tertua dalam matematika, dan metode eliminasi lebih tua daripada notasi yang kita pakai untuknya.**

- **Dari sekitar 1800 SM.** Lempeng tanah liat dari Babilonia mengajukan soal yang setara dengan dua persamaan linear dengan dua bilangan tak diketahui, seperti dua ladang yang luas dan hasil panen gabungannya diketahui, dan menyelesaikannya dengan aturan yang sama dengan eliminasi.
- **Pada abad ke-1 M.** Kitab Tiongkok *Sembilan Bab tentang Seni Matematika* mengabdikan bab kedelapan, *fangcheng* ("susunan persegi panjang"), untuk sistem beberapa persamaan, yang diselesaikan dengan prosedur eliminasi pada susunan bilangan yang ditata dengan batang hitung, langkah yang sama dengan eliminasi Gauss.
- **1557.** Robert Recorde menulis tanda sama dengan pertama, $=$, "karena tak ada dua hal yang lebih sama" daripada dua garis sejajar yang sama panjang.
- **1707 dan 1750.** Kuliah Newton, diterbitkan 1707, menguraikan eliminasi untuk beberapa bilangan tak diketahui, dan Gabriel Cramer menerbitkan, pada 1750, aturan determinan yang memakai namanya (Colin Maclaurin telah menemukannya untuk dua dan tiga bilangan tak diketahui sedikit lebih awal).
- **Awal abad ke-19.** Gauss memakai eliminasi yang sistematis untuk perhitungan kuadrat terkecilnya, itulah sebabnya ia disebut eliminasi Gauss; ia leluhur penyelesai di setiap pustaka numerik sekarang.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with systems of equations?', 'Apa kesalahan umum pada sistem persamaan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with systems of equations are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Substitute the expression into the same equation it came from | That gives $0=0$ or $x=x$: put it into the *other* equation. |
| ❌ Multiply only one term, or one side, when scaling an equation | Multiply every term on both sides, or the equation is no longer the same one. |
| ❌ Add when the coefficients have the same sign and expect it to cancel | Opposite signs: add. Equal signs: subtract. Check that the variable is gone. |
| ❌ $(3x+2y)-(x-y)=2x+y$ | Subtracting changes every sign: $(3x+2y)-(x-y)=2x+3y$. |
| ❌ Find $x$ and stop | A solution is a pair: go back for the other variable. |
| ❌ Check the answer in one equation only | Check both: $(0,10)$ fits $x+y=10$ but not $x-y=2$. |
| ❌ $0=0$ means no solution, $0=5$ means infinitely many | The other way round: $0=0$ is true (infinitely many); $0=5$ is false (none). |
| ❌ The answer must be whole numbers | It often is not: $2x+3y=7$ and $x-4y=1$ give $(\frac{31}{11},\frac5{11})$. |
| ❌ Test $D==0$ on floating-point numbers | Rounding hides or invents zeros: use exact numbers, or compare with a tolerance. |`,
            T`**Kesalahan paling umum pada sistem persamaan adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Mensubstitusi ungkapan ke persamaan yang sama dengan asalnya | Itu memberi $0=0$ atau $x=x$: masukkan ke persamaan *yang lain*. |
| ❌ Mengalikan hanya satu suku, atau satu ruas, saat mengubah skala persamaan | Kalikan setiap suku di kedua ruas, atau persamaannya bukan lagi yang sama. |
| ❌ Menjumlahkan saat koefisien bertanda sama dan berharap habis | Tanda berlawanan: jumlahkan. Tanda sama: kurangkan. Pastikan variabelnya habis. |
| ❌ $(3x+2y)-(x-y)=2x+y$ | Mengurangkan mengubah setiap tanda: $(3x+2y)-(x-y)=2x+3y$. |
| ❌ Menemukan $x$ lalu berhenti | Penyelesaian adalah pasangan: kembali mencari variabel yang lain. |
| ❌ Memeriksa jawaban di satu persamaan saja | Periksa keduanya: $(0,10)$ cocok dengan $x+y=10$ tetapi tidak dengan $x-y=2$. |
| ❌ $0=0$ berarti tak ada penyelesaian, $0=5$ berarti tak terhingga | Sebaliknya: $0=0$ benar (tak terhingga); $0=5$ salah (tidak ada). |
| ❌ Jawabannya harus bilangan bulat | Sering tidak: $2x+3y=7$ dan $x-4y=1$ memberi $(\frac{31}{11},\frac5{11})$. |
| ❌ Menguji $D==0$ pada bilangan floating-point | Pembulatan menyembunyikan atau menciptakan nol: pakai bilangan eksak, atau bandingkan dengan toleransi. |`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- practice */
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
              L(T`A system of two linear equations can have exactly two solutions.`, T`Sistem dua persamaan linear dapat memiliki tepat dua penyelesaian.`),
              L(T`If elimination ends in $0=0$, the system has infinitely many solutions.`, T`Bila eliminasi berakhir pada $0=0$, sistem itu memiliki tak terhingga penyelesaian.`),
              L(T`If elimination ends in $0=7$, the lines are parallel and there is no solution.`, T`Bila eliminasi berakhir pada $0=7$, garisnya sejajar dan tidak ada penyelesaian.`),
              L(T`The solution of a system is the point where the two lines cross.`, T`Penyelesaian sistem adalah titik tempat kedua garis berpotongan.`),
              L(T`When $D\ne0$ the system has exactly one solution.`, T`Bila $D\ne0$ sistem itu memiliki tepat satu penyelesaian.`),
              L(T`The solution of a system always has whole numbers for $x$ and $y$.`, T`Penyelesaian sistem selalu berupa bilangan bulat untuk $x$ dan $y$.`),
            ],
            answer: [false, true, true, true, true, false],
            explain: L(
              T`Two lines meet in at most one point or are the same line, so the count is $0$, $1$ or infinite, never $2$. $0=0$ is always true (many solutions) and $0=7$ never (none). With $D\ne0$ the lines have different directions and cross once. The answers are often fractions, such as $(\frac{31}{11},\frac5{11})$.`,
              T`Dua garis bertemu paling banyak di satu titik atau merupakan garis yang sama, jadi banyaknya $0$, $1$, atau tak terhingga, tak pernah $2$. $0=0$ selalu benar (banyak penyelesaian) dan $0=7$ tak pernah (tidak ada). Dengan $D\ne0$ kedua garis berarah berbeda dan berpotongan sekali. Jawabannya sering pecahan, seperti $(\frac{31}{11},\frac5{11})$.`,
            ),
            hint: L(T`Think of two lines on a graph: in how many ways can they meet? And is $0=0$ a true or a false statement?`, T`Bayangkan dua garis pada grafik: dengan berapa cara keduanya dapat bertemu? Dan apakah $0=0$ pernyataan benar atau salah?`),
          },
        },
        {
          kind: 'activity',
          title: L('Add the equations', 'Jumlahkan persamaannya'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`Adding the equations cancels $y$: $2x=8$.`, T`Menjumlahkan persamaan menghabiskan $y$: $2x=8$.`), L(T`Then $y=7-x$.`, T`Lalu $y=7-x$.`)],
            explain: L(T`Adding gives $2x=8$, so $x=4$; then $y=7-4=3$. Check: $4-3=1$.`, T`Penjumlahan memberi $2x=8$, sehingga $x=4$; lalu $y=7-4=3$. Periksa: $4-3=1$.`),
            prompt: L(T`Solve $x+y=7$ and $x-y=1$.`, T`Selesaikan $x+y=7$ dan $x-y=1$.`),
            given: String.raw`x=v,\ y=w`,
            blanks: [
              { label: 'x =', answer: 4 },
              { label: 'y =', answer: 3 },
            ],
          },
        },
        {
          kind: 'activity',
          title: L('Substitution', 'Substitusi'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`From $3x-y=5$: $y=3x-5$. Put it into $x+2y=4$.`, T`Dari $3x-y=5$: $y=3x-5$. Masukkan ke $x+2y=4$.`), L(T`$x+2(3x-5)=4$, so $7x=14$.`, T`$x+2(3x-5)=4$, sehingga $7x=14$.`)],
            explain: L(T`$y=3x-5$, so $x+2(3x-5)=4$, $7x-10=4$, $x=2$, and $y=3\cdot2-5=1$.`, T`$y=3x-5$, sehingga $x+2(3x-5)=4$, $7x-10=4$, $x=2$, dan $y=3\cdot2-5=1$.`),
            prompt: L(T`Solve $3x-y=5$ and $x+2y=4$.`, T`Selesaikan $3x-y=5$ dan $x+2y=4$.`),
            given: String.raw`x=v,\ y=w`,
            blanks: [
              { label: 'x =', answer: 2 },
              { label: 'y =', answer: 1 },
            ],
          },
        },
        {
          kind: 'activity',
          title: L('How many solutions?', 'Berapa banyak penyelesaian?'),
          step: {
            kind: 'quiz',
            id: 'p4',
            prompt: L('How many solutions does 2x + 4y = 6 and 3x + 6y = 8 have?', 'Berapa banyak penyelesaian 2x + 4y = 6 dan 3x + 6y = 8?'),
            options: [L('none', 'tidak ada'), L('exactly one', 'tepat satu'), L('exactly two', 'tepat dua'), L('infinitely many', 'tak terhingga')],
            answer: 0,
            explain: L('$D=2\\cdot6-3\\cdot4=0$, so the lines have the same direction. Multiply the first by $\\frac32$: $3x+6y=9$, but the second says $8$. The left sides match and the right sides do not, so the lines are parallel: no solution.', '$D=2\\cdot6-3\\cdot4=0$, jadi garisnya berarah sama. Kalikan yang pertama dengan $\\frac32$: $3x+6y=9$, tetapi yang kedua berkata $8$. Ruas kiri cocok dan ruas kanan tidak, jadi garisnya sejajar: tidak ada penyelesaian.'),
            hint: L('Is the second left side a multiple of the first? If so, is the right side the same multiple?', 'Apakah ruas kiri kedua kelipatan yang pertama? Bila ya, apakah ruas kanannya kelipatan yang sama?'),
          },
        },
        {
          kind: 'activity',
          title: L('Another system', 'Sistem lain'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('How many solutions does x − 2y = 3 and 2x − 4y = 6 have?', 'Berapa banyak penyelesaian x − 2y = 3 dan 2x − 4y = 6?'),
            options: [L('none', 'tidak ada'), L('exactly one', 'tepat satu'), L('exactly two', 'tepat dua'), L('infinitely many', 'tak terhingga')],
            answer: 3,
            explain: L('The second equation is the first one multiplied by $2$ on every term, so they are the same line and every point of it is a solution. Elimination gives $0=0$.', 'Persamaan kedua adalah yang pertama dikalikan $2$ pada setiap suku, jadi keduanya garis yang sama dan setiap titiknya adalah penyelesaian. Eliminasi memberi $0=0$.'),
            hint: L('Multiply the first equation by 2 and compare it with the second.', 'Kalikan persamaan pertama dengan 2 lalu bandingkan dengan yang kedua.'),
          },
        },
        {
          kind: 'activity',
          title: L('A price', 'Sebuah harga'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`Let $p$ be the price of a marker and $n$ that of a notebook: $3p+2n=27$ and $p+4n=29$.`, T`Misalkan $p$ harga sebuah pulpen dan $n$ harga sebuah buku: $3p+2n=27$ dan $p+4n=29$.`), L(T`Multiply the first by $2$ and subtract the second.`, T`Kalikan yang pertama dengan $2$ lalu kurangkan yang kedua.`)],
            explain: L(T`$6p+4n=54$; subtract $p+4n=29$: $5p=25$, $p=5$. Then $4n=29-5=24$ and $n=6$. Check: $3\cdot5+2\cdot6=27$.`, T`$6p+4n=54$; kurangkan $p+4n=29$: $5p=25$, $p=5$. Lalu $4n=29-5=24$ dan $n=6$. Periksa: $3\cdot5+2\cdot6=27$.`),
            prompt: L(T`Three markers and two notebooks cost $27 together; one marker and four notebooks cost $29. How much does one notebook cost, in dollars?`, T`Tiga pulpen dan dua buku harganya Rp27.000 bersama; satu pulpen dan empat buku Rp29.000. Berapa harga satu buku, dalam ribu rupiah?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('Ages', 'Umur'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`$x+y=50$ and $x=4y$. Substitute.`, T`$x+y=50$ dan $x=4y$. Substitusikan.`), L(T`$4y+y=50$.`, T`$4y+y=50$.`)],
            explain: L(T`$4y+y=50$, so $5y=50$ and $y=10$; the father is $40$. Check: $40+10=50$ and $40=4\cdot10$.`, T`$4y+y=50$, sehingga $5y=50$ dan $y=10$; sang ayah $40$. Periksa: $40+10=50$ dan $40=4\cdot10$.`),
            prompt: L(T`A father and his son are $50$ years old together, and the father is four times as old as the son. How old is the son?`, T`Seorang ayah dan anaknya berumur $50$ tahun bersama, dan umur ayah empat kali umur anaknya. Berapa umur sang anak?`),
            given: String.raw`y=v`,
            blanks: [{ label: 'y =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('The determinant', 'Determinan'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`$D=a_1b_2-a_2b_1$ with $a_1=2$, $b_1=3$, $a_2=3$, $b_2=-2$.`, T`$D=a_1b_2-a_2b_1$ dengan $a_1=2$, $b_1=3$, $a_2=3$, $b_2=-2$.`), L(T`$2\cdot(-2)-3\cdot3$.`, T`$2\cdot(-2)-3\cdot3$.`)],
            explain: L(T`$D=2\cdot(-2)-3\cdot3=-4-9=-13$. It is not zero, so there is exactly one solution.`, T`$D=2\cdot(-2)-3\cdot3=-4-9=-13$. Ia tidak nol, jadi ada tepat satu penyelesaian.`),
            prompt: L(T`Find $D=a_1b_2-a_2b_1$ for $2x+3y=12$ and $3x-2y=5$.`, T`Carilah $D=a_1b_2-a_2b_1$ untuk $2x+3y=12$ dan $3x-2y=5$.`),
            given: String.raw`D=v`,
            blanks: [{ label: 'D =', answer: -13 }],
          },
        },
        {
          kind: 'activity',
          title: L('Which have exactly one solution?', 'Mana yang memiliki tepat satu penyelesaian?'),
          step: {
            kind: 'multi',
            id: 'p9',
            prompt: L('Which of these systems has exactly one solution? Choose **all** that apply.', 'Sistem mana yang memiliki tepat satu penyelesaian? Pilih **semua** yang benar.'),
            options: [
              L(T`$x+y=3$ and $x-y=1$`, T`$x+y=3$ dan $x-y=1$`),
              L(T`$2x+y=4$ and $4x+2y=8$`, T`$2x+y=4$ dan $4x+2y=8$`),
              L(T`$x-y=2$ and $2x-2y=5$`, T`$x-y=2$ dan $2x-2y=5$`),
              L(T`$3x+2y=7$ and $x-y=1$`, T`$3x+2y=7$ dan $x-y=1$`),
            ],
            answer: [0, 3],
            explain: L(T`$D=-2$ and $D=-5$ for the first and last, so each has one solution. The second is the same line twice ($D=0$, right sides fit: infinitely many) and the third is parallel ($D=0$, right sides do not fit: none).`, T`$D=-2$ dan $D=-5$ untuk yang pertama dan terakhir, jadi masing-masing punya satu penyelesaian. Yang kedua adalah garis yang sama dua kali ($D=0$, ruas kanan cocok: tak terhingga) dan yang ketiga sejajar ($D=0$, ruas kanan tidak cocok: tidak ada).`),
            hint: L(T`Compute $D=a_1b_2-a_2b_1$ for each system.`, T`Hitung $D=a_1b_2-a_2b_1$ untuk tiap sistem.`),
          },
        },
        {
          kind: 'activity',
          title: L('Order the elimination', 'Urutkan eliminasinya'),
          step: {
            kind: 'order',
            id: 'p10',
            prompt: L('Put the steps of solving a system by elimination in order.', 'Urutkan langkah menyelesaikan sistem dengan eliminasi.'),
            lines: {
              en: ['Multiply the equations so one variable has coefficients of the same size', 'Add the equations (opposite signs) or subtract them (equal signs) so that variable cancels', 'Solve the remaining equation for the other variable', 'Put that value into an original equation to find the first variable', 'Check the pair in both original equations'],
              id: ['Kalikan persamaan agar satu variabel memiliki koefisien yang sama besar', 'Jumlahkan persamaan (tanda berlawanan) atau kurangkan (tanda sama) agar variabel itu habis', 'Selesaikan persamaan yang tersisa untuk variabel yang lain', 'Masukkan nilai itu ke persamaan semula untuk mencari variabel pertama', 'Periksa pasangan itu di kedua persamaan semula'],
            },
            explain: L(T`First make the coefficients match, then cancel, solve, go back, and check in *both* equations.`, T`Pertama samakan koefisiennya, lalu habiskan, selesaikan, kembali, dan periksa di *kedua* persamaan.`),
            hint: L(T`You cannot solve for the second variable before one of them has been eliminated.`, T`Kamu tak dapat menyelesaikan variabel kedua sebelum salah satunya dieliminasi.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the working', 'Isi pengerjaannya'),
          step: {
            kind: 'fill',
            id: 'p11',
            prompt: L('Add the equations 2x + y = 8 and x − y = 1 to eliminate y, and complete the working.', 'Jumlahkan persamaan 2x + y = 8 dan x − y = 1 untuk mengeliminasi y, dan lengkapi pengerjaannya.'),
            template: {
              en: '(2x + x) + (y − y) = ___ + ___, so ___x = ___',
              id: '(2x + x) + (y − y) = ___ + ___, sehingga ___x = ___',
            },
            blanks: { en: ['8', '1', '3', '9'], id: ['8', '1', '3', '9'] },
            explain: L(T`The $y$ terms cancel, $2x+x=3x$, and $8+1=9$: $3x=9$, so $x=3$ and then $y=2$.`, T`Suku $y$ saling menghabiskan, $2x+x=3x$, dan $8+1=9$: $3x=9$, sehingga $x=3$ lalu $y=2$.`),
            hint: L(T`Add the left sides together and the right sides together.`, T`Jumlahkan ruas kiri dan jumlahkan ruas kanan.`),
          },
        },
        {
          kind: 'activity',
          title: L('Which is right?', 'Mana yang benar?'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L('Elimination of x from two equations leaves 0 = 5. What does that tell you?', 'Eliminasi x dari dua persamaan menyisakan 0 = 5. Apa artinya?'),
            options: [L('the lines are parallel: no solution', 'garisnya sejajar: tidak ada penyelesaian'), L('the lines are the same: infinitely many solutions', 'garisnya sama: tak terhingga penyelesaian'), L('x = 5', 'x = 5'), L('the lines cross at the origin', 'garis berpotongan di titik asal')],
            answer: 0,
            explain: L('$0=5$ is false for every $x$ and $y$, so no pair satisfies both equations. The lines have the same direction (the unknowns cancelled) but are not the same line.', '$0=5$ salah untuk setiap $x$ dan $y$, jadi tak ada pasangan yang memenuhi kedua persamaan. Garisnya berarah sama (bilangan tak diketahui habis) tetapi bukan garis yang sama.'),
            hint: L('Is 0 = 5 a true statement? What does it say about any x and y?', 'Apakah 0 = 5 pernyataan benar? Apa katanya tentang x dan y mana pun?'),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: systems of linear equations at a glance', 'Ringkasan: sistem persamaan linear sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **System:** $a_1x+b_1y=c_1$ and $a_2x+b_2y=c_2$ at once; the solution is the pair $(x,y)$ on both lines.
- **Three outcomes:** cross (one solution, $D\ne0$), parallel (none), same line (infinitely many); for the last two $D=0$.
- **Substitution:** isolate a variable (best with coefficient $\pm1$), put it in the *other* equation, solve, go back.
- **Elimination:** scale so a variable has opposite coefficients, add (subtract if equal), solve, go back; $0=0$ means infinitely many, $0=5$ means none.
- **Cramer:** $x=\frac{c_1b_2-c_2b_1}{D}$, $y=\frac{a_1c_2-a_2c_1}{D}$; $|D|$ is the area on the coefficient vectors.
- **Word problems:** name the unknowns, one equation per fact, solve, check in the story, answer in a sentence.
- **Numerics:** nearly parallel lines amplify errors by about $\frac1\varepsilon$; double precision sees $D=0$ below $10^{-16}$; use exact fractions for exact data.`,
            T`- **Sistem:** $a_1x+b_1y=c_1$ dan $a_2x+b_2y=c_2$ sekaligus; penyelesaiannya adalah pasangan $(x,y)$ pada kedua garis.
- **Tiga kemungkinan:** berpotongan (satu penyelesaian, $D\ne0$), sejajar (tidak ada), garis yang sama (tak terhingga); untuk dua yang terakhir $D=0$.
- **Substitusi:** isolasi sebuah variabel (terbaik dengan koefisien $\pm1$), masukkan ke persamaan *yang lain*, selesaikan, kembali.
- **Eliminasi:** ubah skala agar satu variabel berkoefisien berlawanan, jumlahkan (kurangkan bila sama), selesaikan, kembali; $0=0$ berarti tak terhingga, $0=5$ berarti tidak ada.
- **Cramer:** $x=\frac{c_1b_2-c_2b_1}{D}$, $y=\frac{a_1c_2-a_2c_1}{D}$; $|D|$ adalah luas pada vektor koefisien.
- **Soal cerita:** namai bilangan tak diketahui, satu persamaan per fakta, selesaikan, periksa dalam cerita, jawab dengan satu kalimat.
- **Numerik:** garis hampir sejajar memperbesar galat sekitar $\frac1\varepsilon$; presisi ganda melihat $D=0$ di bawah $10^{-16}$; pakai pecahan eksak untuk data eksak.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('System of linear equations', 'Sistem persamaan linear'), definition: L('Two or more linear equations that must all be true at once; with two unknowns, two lines.', 'Dua persamaan linear atau lebih yang harus benar sekaligus; dengan dua bilangan tak diketahui, dua garis.') },
    { term: L('Solution of a system', 'Penyelesaian sistem'), definition: L('The pair of numbers x and y that makes every equation of the system true; the point where the lines meet.', 'Pasangan bilangan x dan y yang membuat setiap persamaan sistem benar; titik tempat garis-garis bertemu.') },
    { term: L('Substitution', 'Substitusi'), definition: L('Solving one equation for a variable and putting that expression into the other equation.', 'Menyelesaikan satu persamaan untuk sebuah variabel dan memasukkan ungkapan itu ke persamaan yang lain.') },
    { term: L('Elimination', 'Eliminasi'), definition: L('Adding or subtracting multiples of the equations so that one variable cancels.', 'Menjumlahkan atau mengurangkan kelipatan persamaan agar satu variabel habis.') },
    { term: L('Determinant of a 2 by 2 system', 'Determinan sistem 2 kali 2'), definition: L('The number a1 b2 minus a2 b1; the system has exactly one solution when it is not zero.', 'Bilangan a1 b2 dikurangi a2 b1; sistem memiliki tepat satu penyelesaian bila ia tidak nol.') },
    { term: L('Cramer’s rule', 'Aturan Cramer'), definition: L('The formulas x equals Dx over D and y equals Dy over D that solve a system when D is not zero.', 'Rumus x sama dengan Dx per D dan y sama dengan Dy per D yang menyelesaikan sistem bila D tidak nol.') },
    { term: L('Parallel lines', 'Garis sejajar'), definition: L('Lines with the same slope that never meet; a system of two of them has no solution.', 'Garis dengan kemiringan sama yang tak pernah bertemu; sistem dua garis itu tidak memiliki penyelesaian.') },
    { term: L('Coincident lines', 'Garis berimpit'), definition: L('Two equations describing the same line; every point of it is a solution.', 'Dua persamaan yang menggambarkan garis yang sama; setiap titiknya adalah penyelesaian.') },
    { term: L('Ill-conditioned system', 'Sistem berkondisi buruk'), definition: L('A system whose answer changes a lot when the numbers change a little, as with nearly parallel lines.', 'Sistem yang jawabannya berubah banyak bila bilangannya berubah sedikit, seperti pada garis yang hampir sejajar.') },
    { term: L('Condition number', 'Bilangan kondisi'), definition: L('A number that says how many times a change in the data can be magnified in the answer; it is large for nearly parallel lines.', 'Bilangan yang menyatakan berapa kali perubahan pada data dapat dibesarkan pada jawaban; ia besar untuk garis yang hampir sejajar.') },
  ],

  howTo: [
    {
      name: L('How to solve a system of two equations by substitution', 'Cara menyelesaikan sistem dua persamaan dengan substitusi'),
      description: L('Isolate one variable, substitute it into the other equation, solve, and go back.', 'Isolasi satu variabel, substitusikan ke persamaan lain, selesaikan, dan kembali.'),
      steps: [
        { name: L('Isolate a variable', 'Isolasi sebuah variabel'), text: L('Solve one equation for the variable with the easiest coefficient, ideally 1 or minus 1.', 'Selesaikan satu persamaan untuk variabel dengan koefisien termudah, idealnya 1 atau minus 1.') },
        { name: L('Substitute', 'Substitusikan'), text: L('Put that expression, in brackets, into the other equation, never the same one.', 'Masukkan ungkapan itu, dalam kurung, ke persamaan yang lain, bukan yang sama.') },
        { name: L('Solve one equation', 'Selesaikan satu persamaan'), text: L('Expand, combine like terms and solve the equation that now has one variable.', 'Jabarkan, gabungkan suku sejenis, dan selesaikan persamaan yang kini memiliki satu variabel.') },
        { name: L('Go back and check', 'Kembali dan periksa'), text: L('Put the value into the isolated expression for the other variable, then check the pair in both original equations.', 'Masukkan nilai itu ke ungkapan yang diisolasi untuk variabel lain, lalu periksa pasangan itu di kedua persamaan semula.') },
      ],
    },
    {
      name: L('How to solve a system of two equations by elimination', 'Cara menyelesaikan sistem dua persamaan dengan eliminasi'),
      description: L('Scale the equations, add or subtract them so a variable cancels, solve, and go back.', 'Ubah skala persamaan, jumlahkan atau kurangkan agar sebuah variabel habis, selesaikan, dan kembali.'),
      steps: [
        { name: L('Match the coefficients', 'Samakan koefisiennya'), text: L('Multiply each equation, every term, so one variable has coefficients of the same size, using the least common multiple.', 'Kalikan tiap persamaan, setiap suku, agar satu variabel memiliki koefisien yang sama besar, dengan kelipatan persekutuan terkecil.') },
        { name: L('Add or subtract', 'Jumlahkan atau kurangkan'), text: L('Add the equations if the signs are opposite, subtract if they are equal, so that variable disappears.', 'Jumlahkan persamaan bila tandanya berlawanan, kurangkan bila sama, sehingga variabel itu lenyap.') },
        { name: L('Read the result', 'Baca hasilnya'), text: L('If one variable is left, solve it. If you get 0 = 0 there are infinitely many solutions; a false statement such as 0 = 5 means none.', 'Bila satu variabel tersisa, selesaikan. Bila mendapat 0 = 0 ada tak terhingga penyelesaian; pernyataan salah seperti 0 = 5 berarti tidak ada.') },
        { name: L('Go back and check', 'Kembali dan periksa'), text: L('Put the value into an original equation to find the other variable and check the pair in both equations.', 'Masukkan nilai itu ke persamaan semula untuk mencari variabel lain dan periksa pasangan itu di kedua persamaan.') },
      ],
    },
    {
      name: L('How to turn a word problem into a system of equations', 'Cara mengubah soal cerita menjadi sistem persamaan'),
      description: L('Name two unknowns, write one equation per fact, solve and check in the story.', 'Namai dua bilangan tak diketahui, tulis satu persamaan per fakta, selesaikan dan periksa dalam cerita.'),
      steps: [
        { name: L('Name the unknowns', 'Namai bilangan tak diketahui'), text: L('Choose a letter for each unknown quantity and write down what it means and its unit.', 'Pilih huruf untuk tiap besaran tak diketahui dan tulis artinya beserta satuannya.') },
        { name: L('Write an equation for each fact', 'Tulis persamaan untuk tiap fakta'), text: L('Turn each separate piece of information into an equation; the two equations must say different things.', 'Ubah tiap informasi tersendiri menjadi persamaan; kedua persamaan harus berkata hal yang berbeda.') },
        { name: L('Solve the system', 'Selesaikan sistemnya'), text: L('Use substitution or elimination, whichever is shorter for these numbers.', 'Pakai substitusi atau eliminasi, mana yang lebih singkat untuk bilangan ini.') },
        { name: L('Check and answer', 'Periksa dan jawab'), text: L('Test the answer against the words of the problem, not only the equations, and answer in a sentence with units.', 'Uji jawaban terhadap kata-kata soal, bukan hanya persamaannya, dan jawab dengan satu kalimat beserta satuan.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a system of linear equations in two variables?', 'Apa itu sistem persamaan linear dua variabel?'),
      a: L(
        'It is two linear equations, a1 x plus b1 y equals c1 and a2 x plus b2 y equals c2, that must hold at the same time. Its solution is the pair x and y that satisfies both, which on a graph is the point where the two lines cross.',
        'Ia adalah dua persamaan linear, a1 x ditambah b1 y sama dengan c1 dan a2 x ditambah b2 y sama dengan c2, yang harus berlaku bersamaan. Penyelesaiannya adalah pasangan x dan y yang memenuhi keduanya, yang pada grafik adalah titik tempat kedua garis berpotongan.',
      ),
    },
    {
      q: L('How do you solve a system of equations by substitution?', 'Bagaimana menyelesaikan sistem persamaan dengan substitusi?'),
      a: L(
        'Solve one equation for one variable, put that expression into the other equation, solve the equation that now has one variable, and substitute back to get the other. Then check the pair in both original equations.',
        'Selesaikan satu persamaan untuk satu variabel, masukkan ungkapan itu ke persamaan lain, selesaikan persamaan yang kini bervariabel satu, dan substitusikan kembali untuk mendapat yang lain. Lalu periksa pasangan itu di kedua persamaan semula.',
      ),
    },
    {
      q: L('How do you solve a system of equations by elimination?', 'Bagaimana menyelesaikan sistem persamaan dengan eliminasi?'),
      a: L(
        'Multiply the equations so one variable has coefficients of the same size, then add them if the signs are opposite or subtract them if equal, so that variable cancels. Solve for the other, then go back for the first.',
        'Kalikan persamaan agar satu variabel memiliki koefisien yang sama besar, lalu jumlahkan bila tandanya berlawanan atau kurangkan bila sama, sehingga variabel itu habis. Selesaikan untuk yang lain, lalu kembali mencari yang pertama.',
      ),
    },
    {
      q: L('How can you tell whether a system has no solution or infinitely many?', 'Bagaimana mengetahui sistem tidak punya penyelesaian atau punya tak terhingga?'),
      a: L(
        'Look at D, a1 b2 minus a2 b1. If D is not zero there is one solution. If D is zero the lines have the same direction: they are the same line, with infinitely many solutions, when the right sides fit too, and parallel, with none, when they do not.',
        'Lihat D, a1 b2 dikurangi a2 b1. Bila D tidak nol ada satu penyelesaian. Bila D nol kedua garis berarah sama: keduanya garis yang sama, dengan tak terhingga penyelesaian, bila ruas kanan juga cocok, dan sejajar, tanpa penyelesaian, bila tidak.',
      ),
    },
    {
      q: L('What does the solution of a system mean on a graph?', 'Apa arti penyelesaian sistem pada grafik?'),
      a: L(
        'Each equation is a line, and every point of a line satisfies its equation. The solution of the system is therefore the point that lies on both lines, their intersection. Parallel lines have none, and identical lines share all their points.',
        'Tiap persamaan adalah garis, dan setiap titik pada garis memenuhi persamaannya. Penyelesaian sistem karenanya adalah titik yang terletak pada kedua garis, perpotongannya. Garis sejajar tidak memilikinya, dan garis yang identik berbagi semua titiknya.',
      ),
    },
    {
      q: L('What is Cramer’s rule for two equations?', 'Apa aturan Cramer untuk dua persamaan?'),
      a: L(
        'When D, a1 b2 minus a2 b1, is not zero, x equals Dx over D and y equals Dy over D, where Dx is c1 b2 minus c2 b1 and Dy is a1 c2 minus a2 c1. It is elimination carried out once for every system.',
        'Bila D, a1 b2 dikurangi a2 b1, tidak nol, x sama dengan Dx per D dan y sama dengan Dy per D, dengan Dx adalah c1 b2 dikurangi c2 b1 dan Dy adalah a1 c2 dikurangi a2 c1. Ia adalah eliminasi yang dikerjakan sekali untuk setiap sistem.',
      ),
    },
    {
      q: L('How do you solve a word problem with two unknowns?', 'Bagaimana menyelesaikan soal cerita dengan dua bilangan tak diketahui?'),
      a: L(
        'Name the two unknowns with their units, write one equation for each different fact in the problem, solve the system by substitution or elimination, and check the answer against the story before answering in a sentence.',
        'Namai kedua bilangan tak diketahui beserta satuannya, tulis satu persamaan untuk setiap fakta berbeda dalam soal, selesaikan sistem dengan substitusi atau eliminasi, dan periksa jawaban terhadap cerita sebelum menjawab dengan satu kalimat.',
      ),
    },
    {
      q: L('Why do nearly parallel lines make a computer solver unreliable?', 'Mengapa garis hampir sejajar membuat penyelesai komputer tidak andal?'),
      a: L(
        'Their crossing point moves a long way when a number changes slightly, so tiny rounding errors are magnified, and in double precision two very close slopes can become identical, giving a determinant of exactly zero. Exact fractions avoid this for exact data.',
        'Titik potongnya bergeser jauh bila sebuah bilangan berubah sedikit, sehingga galat pembulatan kecil dibesarkan, dan dalam presisi ganda dua kemiringan yang sangat dekat dapat menjadi identik, menghasilkan determinan tepat nol. Pecahan eksak menghindarinya untuk data eksak.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (chapters on systems of equations)', author: 'James Stewart, Lothar Redlin, Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Introduction to Linear Algebra (5th ed.)', author: 'Gilbert Strang', year: 2016, source: 'Wellesley-Cambridge Press' },
    { title: 'The Nine Chapters on the Mathematical Art: Companion and Commentary', author: 'Shen Kangshen, John N. Crossley, Anthony W.-C. Lun', year: 1999, source: 'Oxford University Press' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
    { title: 'Introduction à l’analyse des lignes courbes algébriques', author: 'Gabriel Cramer', year: 1750, source: 'Frères Cramer et Cl. Philibert' },
    { title: 'Numerical Linear Algebra', author: 'Lloyd N. Trefethen, David Bau III', year: 1997, source: 'SIAM' },
    { title: 'Accuracy and Stability of Numerical Algorithms (2nd ed.)', author: 'Nicholas J. Higham', year: 2002, source: 'SIAM' },
  ],

  related: ['algebraic-expressions', 'rational-numbers', 'floating-point-numbers', 'integers'],
}
