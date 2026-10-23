import type { Loc } from '../types'
import { CATALOG, type Group } from '../../lib/trigident'
import type { ArticleBody } from './types'
import { meta } from './trigonometric-identities.meta'

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

/** The rows of the catalog for some groups, as a table of left side, equals sign and right side. A dagger marks an identity that holds only
 *  where both sides are defined. Everything on the page that is printed from here has been tested by the checker. */
const table = (groups: Group[], left: string, right: string): string =>
  `| ${left} | = | ${right} |\n|---|---|---|\n` + CATALOG.filter((c) => groups.includes(c.group)).map((c) => `| $${c.lhs}$ | $=$ | $${c.rhs}$${c.domain ? ' †' : ''} |`).join('\n')
const EN_L = 'Left side'
const EN_R = 'Right side'
const ID_L = 'Ruas kiri'
const ID_R = 'Ruas kanan'

export const body: ArticleBody = {
  answer: L(
    T`**A trigonometric identity is an equation between trigonometric expressions that is true for every angle at which both sides are defined, such as $\sin^2x+\cos^2x=1$.** The fundamental ones come from the unit circle; the sum formulas $\sin(x+y)=\sin x\cos y+\cos x\sin y$ and $\cos(x+y)=\cos x\cos y-\sin x\sin y$ come from turning a point through an angle, and the double-angle, half-angle, product and power formulas follow from them. To prove an identity you change one side into the other with valid steps; trying numbers can only refute it.`,
    T`**Identitas trigonometri adalah persamaan antara ekspresi trigonometri yang benar untuk setiap sudut yang kedua ruasnya terdefinisi, misalnya $\sin^2x+\cos^2x=1$.** Yang mendasar berasal dari lingkaran satuan; rumus jumlah $\sin(x+y)=\sin x\cos y+\cos x\sin y$ dan $\cos(x+y)=\cos x\cos y-\sin x\sin y$ berasal dari memutar sebuah titik sebesar sebuah sudut, dan rumus sudut ganda, sudut paruh, hasil kali, dan pangkat mengikuti darinya. Untuk membuktikan identitas, kita mengubah satu ruas menjadi ruas lain dengan langkah yang sah; mencoba bilangan hanya dapat membantahnya.`,
  ),

  keyPoints: [
    L(
      T`An identity holds for every angle where both sides are defined; an equation holds only for some. $\tan x=\frac{\sin x}{\cos x}$ is an identity even though neither side exists at $90^\circ$. A formula such as $\sin(x+y)=\sin x+\sin y$ is false, and one counterexample ($x=y=30^\circ$) shows it.`,
      T`Identitas berlaku untuk setiap sudut yang kedua ruasnya terdefinisi; persamaan hanya berlaku untuk sebagian. $\tan x=\frac{\sin x}{\cos x}$ adalah identitas walaupun tak satu pun ruasnya ada pada $90^\circ$. Rumus seperti $\sin(x+y)=\sin x+\sin y$ salah, dan satu contoh penyangkal ($x=y=30^\circ$) menunjukkannya.`,
    ),
    L(
      T`The fundamental identities (reciprocal, quotient, Pythagorean, cofunction, even and odd, shifts) are all read off the unit circle: the point at the angle $x$ is $(\cos x,\sin x)$ and lies at distance $1$ from the origin, which is already $\sin^2x+\cos^2x=1$.`,
      T`Identitas dasar (kebalikan, hasil bagi, Pythagoras, komplemen, genap dan ganjil, pergeseran) semuanya dibaca dari lingkaran satuan: titik pada sudut $x$ adalah $(\cos x,\sin x)$ dan berjarak $1$ dari titik asal, yang sudah merupakan $\sin^2x+\cos^2x=1$.`,
    ),
    L(
      T`Turning the point at $x$ through $y$ gives the sum formulas, because the images of $(1,0)$ and $(0,1)$ are $(\cos y,\sin y)$ and $(-\sin y,\cos y)$. Replace $y$ by $-y$ for the difference formulas, and divide for the tangent.`,
      T`Memutar titik pada $x$ sebesar $y$ memberi rumus jumlah, karena bayangan $(1,0)$ dan $(0,1)$ adalah $(\cos y,\sin y)$ dan $(-\sin y,\cos y)$. Ganti $y$ dengan $-y$ untuk rumus selisih, dan bagi untuk tangen.`,
    ),
    L(
      T`Put $y=x$ in the sum formulas and you get the double-angle formulas, with three forms of $\cos2x$; solve them for the squares and you get the half-angle and power-reducing formulas. Add and subtract the sum formulas and you get the product-to-sum formulas, and the sum-to-product ones are the same thing read backwards.`,
      T`Pasang $y=x$ pada rumus jumlah dan diperoleh rumus sudut ganda, dengan tiga bentuk $\cos2x$; selesaikan untuk kuadratnya dan diperoleh rumus sudut paruh dan pengurangan pangkat. Jumlahkan dan kurangkan rumus jumlah dan diperoleh rumus hasil kali menjadi jumlah, dan yang jumlah menjadi hasil kali adalah hal yang sama dibaca terbalik.`,
    ),
    L(
      T`Any $a\sin x+b\cos x$ is a single wave $R\sin(x+\varphi)$ with $R=\sqrt{a^2+b^2}$ and $\varphi=\operatorname{atan2}(b,a)$, so its largest value is $R$ and an equation such as $3\sin x+4\cos x=2.5$ becomes a basic one.`,
      T`Setiap $a\sin x+b\cos x$ adalah satu gelombang $R\sin(x+\varphi)$ dengan $R=\sqrt{a^2+b^2}$ dan $\varphi=\operatorname{atan2}(b,a)$, sehingga nilai terbesarnya adalah $R$ dan persamaan seperti $3\sin x+4\cos x=2{,}5$ menjadi persamaan dasar.`,
    ),
    L(
      T`To prove an identity, work on one side, one valid step at a time (never move terms across the equals sign), turn everything into sine and cosine when stuck, and use $\sin^2x+\cos^2x=1$. Before you start, test the claim at a few angles: one counterexample ends the search, but agreement at some angles proves nothing.`,
      T`Untuk membuktikan identitas, kerjakan satu ruas, satu langkah sah pada satu waktu (jangan pernah memindahkan suku melewati tanda sama dengan), ubah semuanya menjadi sinus dan kosinus bila buntu, dan pakai $\sin^2x+\cos^2x=1$. Sebelum mulai, uji klaimnya pada beberapa sudut: satu contoh penyangkal mengakhiri pencarian, tetapi kecocokan pada sebagian sudut tidak membuktikan apa-apa.`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------------------------- what */
    {
      id: 'identity-or-equation',
      heading: L('What makes an equation a trigonometric identity?', 'Apa yang membuat sebuah persamaan menjadi identitas trigonometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A trigonometric identity is an equation that is true for every angle at which both of its sides are defined; an ordinary equation is true only for some angles.** $\sin x=\frac12$ is an equation: it is true at $30^\circ$ and $150^\circ$ and false at $45^\circ$. $\sin^2x+\cos^2x=1$ is an identity: it is true at $45^\circ$, at $1000^\circ$ and at every other angle. Solving an equation means finding the angles that make it true; proving an identity means showing that all of them do.

Two details are worth knowing from the start.

- **The sides need not exist everywhere.** $\tan x=\frac{\sin x}{\cos x}$ is an identity although neither side exists at $90^\circ$, because the claim is only about the angles where both do. Cancelling can change where an expression is defined: $\frac{\sin x\cos x}{\cos x}$ is not defined at $90^\circ$ but $\sin x$ is, so the two are equal *wherever both are defined*, which is as much as an identity ever asks.
- **A false formula needs only one counterexample.** $\sin(x+y)=\sin x+\sin y$ looks reasonable, but at $x=y=30^\circ$ the left side is $\sin60^\circ\approx0.866$ and the right side is $0.5+0.5=1$. A true identity, on the other hand, can never be shown by trying angles, since there are infinitely many; it has to be *proved*.

This article lists the identities worth knowing, shows where they come from (everything follows from the unit circle and one rotation), and then shows how to prove one and how to test a claim before spending time on it. The basics of the sine, cosine and tangent are in [the article on basic trigonometry](article:basic-trigonometry#identities); here are the proofs and the longer list.`,
            T`**Identitas trigonometri adalah persamaan yang benar untuk setiap sudut yang kedua ruasnya terdefinisi; persamaan biasa hanya benar untuk sebagian sudut.** $\sin x=\frac12$ adalah persamaan: benar pada $30^\circ$ dan $150^\circ$ dan salah pada $45^\circ$. $\sin^2x+\cos^2x=1$ adalah identitas: benar pada $45^\circ$, pada $1000^\circ$, dan pada setiap sudut lain. Menyelesaikan persamaan berarti mencari sudut yang membuatnya benar; membuktikan identitas berarti menunjukkan bahwa semuanya membuatnya benar.

Dua hal perlu diketahui sejak awal.

- **Kedua ruas tidak harus ada di mana-mana.** $\tan x=\frac{\sin x}{\cos x}$ adalah identitas walaupun tak satu pun ruasnya ada pada $90^\circ$, karena klaimnya hanya tentang sudut yang keduanya ada. Mencoret dapat mengubah di mana sebuah ekspresi terdefinisi: $\frac{\sin x\cos x}{\cos x}$ tidak terdefinisi pada $90^\circ$ tetapi $\sin x$ terdefinisi, jadi keduanya sama *di mana pun keduanya terdefinisi*, yang sudah merupakan permintaan sebuah identitas.
- **Rumus yang salah hanya memerlukan satu contoh penyangkal.** $\sin(x+y)=\sin x+\sin y$ tampak masuk akal, tetapi pada $x=y=30^\circ$ ruas kiri adalah $\sin60^\circ\approx0{,}866$ dan ruas kanan $0{,}5+0{,}5=1$. Identitas yang benar, sebaliknya, tidak pernah dapat ditunjukkan dengan mencoba sudut, karena jumlahnya tak terhingga; ia harus *dibuktikan*.

Artikel ini mendaftar identitas yang layak diketahui, menunjukkan asalnya (semuanya mengikuti dari lingkaran satuan dan satu rotasi), lalu menunjukkan cara membuktikan identitas dan menguji sebuah klaim sebelum menghabiskan waktu untuknya. Dasar-dasar sinus, kosinus, dan tangen ada di [artikel trigonometri dasar](article:basic-trigonometry#identities); di sini ada pembuktian dan daftar yang lebih panjang.`,
          ),
        },
      ],
    },

    /* ---------------------------------------------------------------------------- fundamental */
    {
      id: 'fundamental',
      heading: L('Where do the fundamental trigonometric identities come from?', 'Dari mana identitas trigonometri yang mendasar berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The fundamental identities are the reciprocal, quotient, Pythagorean, cofunction, even-odd and shift identities, and every one of them can be read straight off the unit circle.** On the unit circle the point at the angle $x$ is $(\cos x,\sin x)$, which is where the sine and cosine come from for every angle (see [the unit circle](article:basic-trigonometry#unit-circle)).

**Reciprocal and quotient.** These are the definitions of $\tan$, $\cot$, $\sec$ and $\csc$ in terms of $\sin$ and $\cos$:

${table(['reciprocal', 'quotient'], EN_L, EN_R)}

**Pythagorean.** The point is on a circle of radius $1$, so its coordinates satisfy $x^2+y^2=1$, which is $\cos^2x+\sin^2x=1$. Divide it by $\cos^2x$ and you get $1+\tan^2x=\sec^2x$; divide it by $\sin^2x$ and you get $1+\cot^2x=\csc^2x$. It is the [Pythagorean theorem](article:pythagorean-theorem#what-is-the-theorem) in disguise.

${table(['pythagorean'], EN_L, EN_R)}

**Cofunction.** The two acute angles of a right triangle add up to $90^\circ$, and the side that is opposite one is adjacent to the other, so the sine of an angle is the cosine of its complement.

${table(['cofunction'], EN_L, EN_R)}

**Even and odd.** Turning by $-x$ mirrors the point in the $x$-axis: the $x$-coordinate stays and the $y$-coordinate changes sign.

${table(['parity'], EN_L, EN_R)}

**Shifts by $90^\circ$ and $180^\circ$.** A half turn sends $(x,y)$ to $(-x,-y)$, and a quarter turn sends it to $(-y,x)$.

${table(['shift'], EN_L, EN_R)}

† An identity that holds wherever both sides are defined: the two sides are not defined at the same angles.

Every formula in the tables on this page was tested by a program at hundreds of angles, against an independent calculation, and the ones with a dagger are exactly the ones where one side is defined and the other is not at some angle.`,
            T`**Identitas dasar adalah identitas kebalikan, hasil bagi, Pythagoras, komplemen, genap-ganjil, dan pergeseran, dan masing-masing dapat dibaca langsung dari lingkaran satuan.** Pada lingkaran satuan titik pada sudut $x$ adalah $(\cos x,\sin x)$, dari sinilah sinus dan kosinus berasal untuk setiap sudut (lihat [lingkaran satuan](article:basic-trigonometry#unit-circle)).

**Kebalikan dan hasil bagi.** Inilah definisi $\tan$, $\cot$, $\sec$, dan $\csc$ dalam $\sin$ dan $\cos$:

${table(['reciprocal', 'quotient'], ID_L, ID_R)}

**Pythagoras.** Titik itu berada pada lingkaran berjari-jari $1$, jadi koordinatnya memenuhi $x^2+y^2=1$, yaitu $\cos^2x+\sin^2x=1$. Bagi dengan $\cos^2x$ dan diperoleh $1+\tan^2x=\sec^2x$; bagi dengan $\sin^2x$ dan diperoleh $1+\cot^2x=\csc^2x$. Ini adalah [teorema Pythagoras](article:pythagorean-theorem#what-is-the-theorem) dalam penyamaran.

${table(['pythagorean'], ID_L, ID_R)}

**Komplemen.** Kedua sudut lancip segitiga siku-siku berjumlah $90^\circ$, dan sisi yang berada di depan yang satu berada di samping yang lain, jadi sinus sebuah sudut adalah kosinus penyikunya.

${table(['cofunction'], ID_L, ID_R)}

**Genap dan ganjil.** Berputar sebesar $-x$ mencerminkan titik pada sumbu-$x$: koordinat-$x$ tetap dan koordinat-$y$ berganti tanda.

${table(['parity'], ID_L, ID_R)}

**Pergeseran $90^\circ$ dan $180^\circ$.** Setengah putaran mengirim $(x,y)$ ke $(-x,-y)$, dan seperempat putaran mengirimnya ke $(-y,x)$.

${table(['shift'], ID_L, ID_R)}

† Identitas yang berlaku di mana pun kedua ruas terdefinisi: kedua ruas tidak terdefinisi pada sudut yang sama.

Setiap rumus dalam tabel di halaman ini diuji oleh program pada ratusan sudut, terhadap perhitungan yang bebas, dan yang bertanda belati adalah tepat yang pada suatu sudut satu ruasnya terdefinisi sedangkan yang lain tidak.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- sum and difference */
    {
      id: 'sum-and-difference',
      heading: L('How do the sum and difference formulas work?', 'Bagaimana rumus jumlah dan selisih bekerja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The sum formulas come from turning a point through an angle: the point at $x$, turned through $y$, lands at the angle $x+y$, and its new coordinates are made of the four products $\cos x\cos y$, $\sin x\sin y$, $\sin x\cos y$ and $\cos x\sin y$.**

Turn the whole plane about the origin through the angle $y$. The point $(1,0)$ goes to $(\cos y,\sin y)$ and the point $(0,1)$ goes to $(-\sin y,\cos y)$. A rotation keeps sums and multiples, and the point at the angle $x$ is $\cos x\cdot(1,0)+\sin x\cdot(0,1)$, so it goes to

$$\cos x\,(\cos y,\ \sin y)+\sin x\,(-\sin y,\ \cos y)$$

$$=\left(\cos x\cos y-\sin x\sin y,\ \ \sin x\cos y+\cos x\sin y\right).$$

But turning the point at $x$ through $y$ puts it at the angle $x+y$, whose coordinates are $(\cos(x+y),\sin(x+y))$. Comparing the two coordinates gives both formulas at once.

${table(['sum'], EN_L, EN_R)}

† The tangent formulas hold wherever both sides are defined.

**The difference formulas** are the sum formulas with $y$ replaced by $-y$, using $\cos(-y)=\cos y$ and $\sin(-y)=-\sin y$, which flips one sign in each: look at the minus in $\cos(x+y)=\cos x\cos y-\sin x\sin y$ and the plus in $\cos(x-y)=\cos x\cos y+\sin x\sin y$. **The tangent formulas** are the quotient of the two: divide the numerator and the denominator of $\frac{\sin(x+y)}{\cos(x+y)}$ by $\cos x\cos y$.

Move the angles below and watch the four products make up the new point.`,
            T`**Rumus jumlah berasal dari memutar sebuah titik sebesar sebuah sudut: titik pada $x$, diputar sebesar $y$, jatuh pada sudut $x+y$, dan koordinat barunya tersusun dari empat hasil kali $\cos x\cos y$, $\sin x\sin y$, $\sin x\cos y$, dan $\cos x\sin y$.**

Putar seluruh bidang terhadap titik asal sebesar sudut $y$. Titik $(1,0)$ pergi ke $(\cos y,\sin y)$ dan titik $(0,1)$ pergi ke $(-\sin y,\cos y)$. Rotasi mempertahankan jumlah dan kelipatan, dan titik pada sudut $x$ adalah $\cos x\cdot(1,0)+\sin x\cdot(0,1)$, jadi ia pergi ke

$$\cos x\,(\cos y,\ \sin y)+\sin x\,(-\sin y,\ \cos y)$$

$$=\left(\cos x\cos y-\sin x\sin y,\ \ \sin x\cos y+\cos x\sin y\right).$$

Tetapi memutar titik pada $x$ sebesar $y$ menempatkannya pada sudut $x+y$, yang koordinatnya $(\cos(x+y),\sin(x+y))$. Membandingkan kedua koordinat memberi kedua rumus sekaligus.

${table(['sum'], ID_L, ID_R)}

† Rumus tangen berlaku di mana pun kedua ruas terdefinisi.

**Rumus selisih** adalah rumus jumlah dengan $y$ diganti $-y$, memakai $\cos(-y)=\cos y$ dan $\sin(-y)=-\sin y$, yang membalik satu tanda pada masing-masing: perhatikan minus pada $\cos(x+y)=\cos x\cos y-\sin x\sin y$ dan plus pada $\cos(x-y)=\cos x\cos y+\sin x\sin y$. **Rumus tangen** adalah hasil bagi keduanya: bagi pembilang dan penyebut $\frac{\sin(x+y)}{\cos(x+y)}$ dengan $\cos x\cos y$.

Geser sudut-sudut di bawah dan lihat keempat hasil kali menyusun titik yang baru.`,
          ),
        },
        { kind: 'widget', name: 'idrotate' },
      ],
    },

    /* --------------------------------------------------------------------------- double, half */
    {
      id: 'double-and-half',
      heading: L('How do you get the double-angle, half-angle and power-reducing formulas?', 'Bagaimana memperoleh rumus sudut ganda, sudut paruh, dan pengurangan pangkat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Put $y=x$ in the sum formulas and you get the double-angle formulas; solve those for the squares and you get the half-angle and power-reducing formulas.** Nothing new is needed: it is the same rotation.

**Double angle.** $\sin2x=\sin(x+x)=2\sin x\cos x$ and $\cos2x=\cos^2x-\sin^2x$. Because $\sin^2x+\cos^2x=1$, the cosine has three forms: replace $\sin^2x$ by $1-\cos^2x$ and you get $2\cos^2x-1$; replace $\cos^2x$ by $1-\sin^2x$ and you get $1-2\sin^2x$. Which one to use depends on what you want to be left with.

${table(['double'], EN_L, EN_R)}

**Triple angle.** $\sin3x=\sin(2x+x)$ and $\cos3x=\cos(2x+x)$: use the sum formula, then the double-angle ones, then $\sin^2x+\cos^2x=1$.

${table(['triple'], EN_L, EN_R)}

**Half angle.** Take $\cos x=1-2\sin^2\frac{x}{2}$ and $\cos x=2\cos^2\frac{x}{2}-1$ (the double-angle formulas for the angle $\frac{x}{2}$) and solve for the squares:

${table(['half'], EN_L, EN_R)}

Taking the square root gives $\sin\frac{x}{2}=\pm\sqrt{\frac{1-\cos x}{2}}$ and $\cos\frac{x}{2}=\pm\sqrt{\frac{1+\cos x}{2}}$, and the sign is the sign of the sine or cosine in the quadrant where $\frac{x}{2}$ lies, not a free choice. **Power reducing.** The same two equations with $x$ in place of $\frac{x}{2}$ turn a square into a first power of a double angle, which is what an integral or a signal analysis wants:

${table(['power'], EN_L, EN_R)}

**Exact values.** With these formulas the angles of $30^\circ$, $45^\circ$ and $60^\circ$ lead to many more. $\sin15^\circ=\sin(45^\circ-30^\circ)$, which is $\frac{\sqrt2}{2}\cdot\frac{\sqrt3}{2}-\frac{\sqrt2}{2}\cdot\frac12$, that is $\frac{\sqrt6-\sqrt2}{4}$. $\sin22.5^\circ$ is half of $45^\circ$: $\sin^2 22.5^\circ=\frac{1-\cos45^\circ}{2}=\frac{2-\sqrt2}{4}$, so $\sin22.5^\circ=\frac{\sqrt{2-\sqrt2}}{2}$. Even the pentagon's angles ($18^\circ$, $36^\circ$, $54^\circ$, $72^\circ$) are exact: $\cos36^\circ=\frac{1+\sqrt5}{4}$, half the golden ratio. Pick any of them below to see the derivation.`,
            T`**Pasang $y=x$ pada rumus jumlah dan diperoleh rumus sudut ganda; selesaikan untuk kuadratnya dan diperoleh rumus sudut paruh dan pengurangan pangkat.** Tidak ada yang baru diperlukan: ini rotasi yang sama.

**Sudut ganda.** $\sin2x=\sin(x+x)=2\sin x\cos x$ dan $\cos2x=\cos^2x-\sin^2x$. Karena $\sin^2x+\cos^2x=1$, kosinus memiliki tiga bentuk: ganti $\sin^2x$ dengan $1-\cos^2x$ dan diperoleh $2\cos^2x-1$; ganti $\cos^2x$ dengan $1-\sin^2x$ dan diperoleh $1-2\sin^2x$. Bentuk mana yang dipakai bergantung pada apa yang ingin tersisa.

${table(['double'], ID_L, ID_R)}

**Sudut rangkap tiga.** $\sin3x=\sin(2x+x)$ dan $\cos3x=\cos(2x+x)$: pakai rumus jumlah, lalu rumus sudut ganda, lalu $\sin^2x+\cos^2x=1$.

${table(['triple'], ID_L, ID_R)}

**Sudut paruh.** Ambil $\cos x=1-2\sin^2\frac{x}{2}$ dan $\cos x=2\cos^2\frac{x}{2}-1$ (rumus sudut ganda untuk sudut $\frac{x}{2}$) dan selesaikan untuk kuadratnya:

${table(['half'], ID_L, ID_R)}

Menarik akar kuadrat memberi $\sin\frac{x}{2}=\pm\sqrt{\frac{1-\cos x}{2}}$ dan $\cos\frac{x}{2}=\pm\sqrt{\frac{1+\cos x}{2}}$, dan tandanya adalah tanda sinus atau kosinus pada kuadran tempat $\frac{x}{2}$ berada, bukan pilihan bebas. **Pengurangan pangkat.** Kedua persamaan yang sama dengan $x$ menggantikan $\frac{x}{2}$ mengubah kuadrat menjadi pangkat satu dari sudut ganda, yang diinginkan integral atau analisis sinyal:

${table(['power'], ID_L, ID_R)}

**Nilai eksak.** Dengan rumus-rumus ini sudut $30^\circ$, $45^\circ$, dan $60^\circ$ menuntun ke banyak sudut lain. $\sin15^\circ=\sin(45^\circ-30^\circ)$, yaitu $\frac{\sqrt2}{2}\cdot\frac{\sqrt3}{2}-\frac{\sqrt2}{2}\cdot\frac12$, atau $\frac{\sqrt6-\sqrt2}{4}$. $\sin22{,}5^\circ$ adalah setengah dari $45^\circ$: $\sin^2 22{,}5^\circ=\frac{1-\cos45^\circ}{2}=\frac{2-\sqrt2}{4}$, jadi $\sin22{,}5^\circ=\frac{\sqrt{2-\sqrt2}}{2}$. Bahkan sudut-sudut segi lima ($18^\circ$, $36^\circ$, $54^\circ$, $72^\circ$) eksak: $\cos36^\circ=\frac{1+\sqrt5}{4}$, setengah rasio emas. Pilih salah satunya di bawah untuk melihat penurunannya.`,
          ),
        },
        { kind: 'widget', name: 'idexact' },
      ],
    },

    /* ---------------------------------------------------------------------------- product, sum */
    {
      id: 'product-and-sum',
      heading: L('What are the product-to-sum formulas, and what is R sin(x + φ)?', 'Apa rumus hasil kali menjadi jumlah, dan apa itu R sin(x + φ)?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Adding and subtracting the sum and difference formulas turns a product of sines and cosines into a sum, and the reverse turns a sum into a product.** Add $\sin(x+y)=\sin x\cos y+\cos x\sin y$ and $\sin(x-y)=\sin x\cos y-\cos x\sin y$: the second terms cancel and $\sin(x+y)+\sin(x-y)=2\sin x\cos y$. The other three come the same way.

${table(['product'], EN_L, EN_R)}

**Sum to product.** Write the angles as $x=\frac{u+v}{2}+\frac{u-v}{2}$ and $y=\frac{u+v}{2}-\frac{u-v}{2}$ in the product formulas, and a sum of two sines or cosines becomes a product:

${table(['sumproduct'], EN_L, EN_R)}

**One wave from two.** The sum of a sine and a cosine of the same angle is again a single wave. Look for numbers $R$ and $\varphi$ with $R\cos\varphi=a$ and $R\sin\varphi=b$: then

$$a\sin x+b\cos x=R\sin x\cos\varphi+R\cos x\sin\varphi=R\sin(x+\varphi),$$

by the sum formula. Squaring and adding the two conditions gives $R^2=a^2+b^2$, so $R=\sqrt{a^2+b^2}$, and $\varphi=\operatorname{atan2}(b,a)$. For example $3\sin x+4\cos x=5\sin(x+53.13^\circ)$, because $R=\sqrt{9+16}=5$.

This does three jobs. **The largest and smallest values** of $a\sin x+b\cos x$ are $\pm R$ (here $\pm5$). **An equation** such as $3\sin x+4\cos x=2.5$ becomes the basic equation $\sin(x+53.13^\circ)=0.5$, whose solutions are $x+53.13^\circ=30^\circ$ or $150^\circ$ (plus whole turns), so $x\approx336.87^\circ$ or $96.87^\circ$ between $0^\circ$ and $360^\circ$ (more such equations are solved in [the article on trigonometric equations](article:trigonometric-equations#use-identities)). **Two waves of the same frequency** add up to another wave of that frequency, which is how alternating currents and sound waves combine. Try other values of $a$ and $b$ below.`,
            T`**Menjumlahkan dan mengurangkan rumus jumlah dan selisih mengubah hasil kali sinus dan kosinus menjadi jumlah, dan kebalikannya mengubah jumlah menjadi hasil kali.** Jumlahkan $\sin(x+y)=\sin x\cos y+\cos x\sin y$ dan $\sin(x-y)=\sin x\cos y-\cos x\sin y$: suku kedua saling menghilangkan dan $\sin(x+y)+\sin(x-y)=2\sin x\cos y$. Tiga yang lain diperoleh dengan cara yang sama.

${table(['product'], ID_L, ID_R)}

**Jumlah menjadi hasil kali.** Tulis sudut-sudutnya sebagai $x=\frac{u+v}{2}+\frac{u-v}{2}$ dan $y=\frac{u+v}{2}-\frac{u-v}{2}$ dalam rumus hasil kali, dan jumlah dua sinus atau kosinus menjadi hasil kali:

${table(['sumproduct'], ID_L, ID_R)}

**Satu gelombang dari dua.** Jumlah sebuah sinus dan sebuah kosinus dari sudut yang sama adalah lagi satu gelombang. Cari bilangan $R$ dan $\varphi$ dengan $R\cos\varphi=a$ dan $R\sin\varphi=b$: maka

$$a\sin x+b\cos x=R\sin x\cos\varphi+R\cos x\sin\varphi=R\sin(x+\varphi),$$

menurut rumus jumlah. Mengkuadratkan dan menjumlahkan kedua syarat memberi $R^2=a^2+b^2$, jadi $R=\sqrt{a^2+b^2}$, dan $\varphi=\operatorname{atan2}(b,a)$. Misalnya $3\sin x+4\cos x=5\sin(x+53{,}13^\circ)$, karena $R=\sqrt{9+16}=5$.

Ini melakukan tiga pekerjaan. **Nilai terbesar dan terkecil** $a\sin x+b\cos x$ adalah $\pm R$ (di sini $\pm5$). **Persamaan** seperti $3\sin x+4\cos x=2{,}5$ menjadi persamaan dasar $\sin(x+53{,}13^\circ)=0{,}5$, yang penyelesaiannya $x+53{,}13^\circ=30^\circ$ atau $150^\circ$ (ditambah putaran penuh), sehingga $x\approx336{,}87^\circ$ atau $96{,}87^\circ$ di antara $0^\circ$ dan $360^\circ$ (persamaan semacam ini lebih banyak diselesaikan di [artikel tentang persamaan trigonometri](article:trigonometric-equations#use-identities)). **Dua gelombang berfrekuensi sama** menjumlah menjadi gelombang lain berfrekuensi itu, begitulah arus bolak-balik dan gelombang bunyi bergabung. Coba nilai $a$ dan $b$ yang lain di bawah.`,
          ),
        },
        { kind: 'widget', name: 'idharmonic' },
      ],
    },

    /* ---------------------------------------------------------------------------------- prove */
    {
      id: 'how-to-prove',
      heading: L('How do you prove a trigonometric identity?', 'Bagaimana membuktikan sebuah identitas trigonometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To prove an identity, start from one side and change it, one valid step at a time, until it becomes the other side.** Every line must equal the line before it, and the last line must be the other side of the claim.

1. **Pick a side.** Usually the more complicated one, because simplifying is easier than growing.
2. **Do not move terms across the equals sign** and do not multiply or add to both sides. That assumes what you want to prove. (You may work on both sides separately until they meet in the middle.)
3. **Turn everything into sine and cosine** when you do not see a path: $\tan$, $\cot$, $\sec$, $\csc$ all have a definition in $\sin$ and $\cos$.
4. **Use the algebra you know:** common denominators, expanding, factoring, the difference of squares $a^2-b^2=(a-b)(a+b)$.
5. **Use $\sin^2x+\cos^2x=1$ in whichever direction helps:** $1\to\sin^2x+\cos^2x$, $1-\cos^2x\to\sin^2x$.
6. **Reach for the sum, double-angle and half-angle formulas** when an angle such as $2x$, $x+y$ or $\frac{x}{2}$ appears.
7. **Say where it holds:** wherever both sides are defined.

**Example 1.** Prove $\tan x+\cot x=\sec x\csc x$. Start from the left side. $\tan x+\cot x=\frac{\sin x}{\cos x}+\frac{\cos x}{\sin x}$ (quotient identities) $=\frac{\sin^2x+\cos^2x}{\sin x\cos x}$ (common denominator) $=\frac{1}{\sin x\cos x}$ (Pythagorean) $=\sec x\csc x$ (reciprocals). Done.

**Example 2.** Prove $(1-\cos x)(1+\cos x)=\sin^2x$. Start from the left side. It equals $1-\cos^2x$ (difference of squares), which is $\sin^2x$ (Pythagorean). Done.

The nine proofs below go from these first ones to the triple angle and the half-angle tangent. Each line carries its reason, and a program has checked that each line equals the one before it.`,
            T`**Untuk membuktikan identitas, mulailah dari satu ruas dan ubah, satu langkah sah pada satu waktu, sampai menjadi ruas yang lain.** Setiap baris harus sama dengan baris sebelumnya, dan baris terakhir harus ruas lain dari klaim itu.

1. **Pilih satu ruas.** Biasanya yang lebih rumit, karena menyederhanakan lebih mudah daripada membesarkan.
2. **Jangan memindahkan suku melewati tanda sama dengan** dan jangan mengalikan atau menambah kedua ruas. Itu mengandaikan apa yang ingin dibuktikan. (Boleh mengerjakan kedua ruas secara terpisah sampai bertemu di tengah.)
3. **Ubah semuanya menjadi sinus dan kosinus** bila belum melihat jalan: $\tan$, $\cot$, $\sec$, $\csc$ semuanya memiliki definisi dalam $\sin$ dan $\cos$.
4. **Pakai aljabar yang sudah dikenal:** penyebut sama, menjabarkan, memfaktorkan, selisih kuadrat $a^2-b^2=(a-b)(a+b)$.
5. **Pakai $\sin^2x+\cos^2x=1$ ke arah mana pun yang membantu:** $1\to\sin^2x+\cos^2x$, $1-\cos^2x\to\sin^2x$.
6. **Pakai rumus jumlah, sudut ganda, dan sudut paruh** ketika muncul sudut seperti $2x$, $x+y$, atau $\frac{x}{2}$.
7. **Sebutkan di mana ia berlaku:** di mana pun kedua ruas terdefinisi.

**Contoh 1.** Buktikan $\tan x+\cot x=\sec x\csc x$. Mulai dari ruas kiri. $\tan x+\cot x=\frac{\sin x}{\cos x}+\frac{\cos x}{\sin x}$ (identitas hasil bagi) $=\frac{\sin^2x+\cos^2x}{\sin x\cos x}$ (penyebut sama) $=\frac{1}{\sin x\cos x}$ (Pythagoras) $=\sec x\csc x$ (kebalikan). Selesai.

**Contoh 2.** Buktikan $(1-\cos x)(1+\cos x)=\sin^2x$. Mulai dari ruas kiri. Ia sama dengan $1-\cos^2x$ (selisih kuadrat), yaitu $\sin^2x$ (Pythagoras). Selesai.

Sembilan pembuktian di bawah berjalan dari yang pertama ini sampai sudut rangkap tiga dan tangen sudut paruh. Setiap baris membawa alasannya, dan sebuah program telah memeriksa bahwa setiap baris sama dengan baris sebelumnya.`,
          ),
        },
        { kind: 'widget', name: 'idproof' },
      ],
    },

    /* ------------------------------------------------------------------------------------ test */
    {
      id: 'testing-a-claim',
      heading: L('How can you test an identity before proving it, and what can a test not tell you?', 'Bagaimana menguji sebuah identitas sebelum membuktikannya, dan apa yang tidak dapat dikatakan sebuah uji?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Test a claimed identity by comparing both sides at many angles: a single difference refutes it, but agreement, however long, only makes it likely.** This saves a great deal of time, because trying to prove a false statement is a trap. Evaluate both sides at a few angles that are not special ($25^\circ$, $40^\circ$, $100^\circ$) and not too symmetric. If the sides differ anywhere, you have a counterexample and are done.

What a test cannot do is prove. $\sin2x=2\sin x$ is true at $x=0^\circ$ and $x=180^\circ$, and a test at those two angles alone would pass it; it fails at $30^\circ$, where $\sin60^\circ\approx0.866$ and $2\sin30^\circ=1$. Even a test at a thousand angles is only evidence. An identity is proved with algebra or geometry, as in the previous section.

A test also has to deal with two practical matters:

- **Undefined points.** If one side is undefined where the other is not (cancelling $\cos x$ removes $90^\circ$ from the domain), the sides are equal *where both are defined*, and the tester below reports that case separately instead of calling it a difference.
- **Rounding.** A computer does not get $\sin^2x+\cos^2x=1$ exactly: the difference is about $10^{-16}$, so compare with a small tolerance, never with equality. Near $90^\circ$ a tangent is huge, and a difference of two huge numbers loses its digits, so a sensible tester skips points where the numbers are too large.

Type your own claim below, in degrees, with $x$ (and $y$ for two angles). It compares the sides at every whole degree from $0^\circ$ to $359^\circ$ and at hundreds of other angles.`,
            T`**Uji identitas yang diklaim dengan membandingkan kedua ruas pada banyak sudut: satu perbedaan membantahnya, tetapi kecocokan, sepanjang apa pun, hanya membuatnya mungkin benar.** Ini menghemat banyak waktu, karena mencoba membuktikan pernyataan yang salah adalah jebakan. Hitung kedua ruas pada beberapa sudut yang tidak istimewa ($25^\circ$, $40^\circ$, $100^\circ$) dan tidak terlalu simetris. Bila kedua ruas berbeda di mana pun, kita punya contoh penyangkal dan selesai.

Yang tidak dapat dilakukan sebuah uji adalah membuktikan. $\sin2x=2\sin x$ benar pada $x=0^\circ$ dan $x=180^\circ$, dan uji pada kedua sudut itu saja akan meloloskannya; ia gagal pada $30^\circ$, tempat $\sin60^\circ\approx0{,}866$ dan $2\sin30^\circ=1$. Bahkan uji pada seribu sudut hanyalah bukti pendukung. Identitas dibuktikan dengan aljabar atau geometri, seperti pada bagian sebelumnya.

Sebuah uji juga harus menangani dua hal praktis:

- **Titik tak terdefinisi.** Bila satu ruas tak terdefinisi di tempat yang lain terdefinisi (mencoret $\cos x$ menghapus $90^\circ$ dari daerah asal), kedua ruas sama *di tempat keduanya terdefinisi*, dan penguji di bawah melaporkan kasus itu secara terpisah alih-alih menyebutnya perbedaan.
- **Pembulatan.** Komputer tidak mendapatkan $\sin^2x+\cos^2x=1$ dengan tepat: selisihnya sekitar $10^{-16}$, jadi bandingkan dengan toleransi kecil, jangan pernah dengan kesamaan. Dekat $90^\circ$ tangen sangat besar, dan selisih dua bilangan yang sangat besar kehilangan angkanya, jadi penguji yang baik melewati titik yang bilangannya terlalu besar.

Ketik klaim Anda sendiri di bawah, dalam derajat, dengan $x$ (dan $y$ untuk dua sudut). Ia membandingkan kedua ruas pada setiap derajat bulat dari $0^\circ$ sampai $359^\circ$ dan pada ratusan sudut lain.`,
          ),
        },
        { kind: 'widget', name: 'idtest' },
      ],
    },

    /* ------------------------------------------------------------------------------------ Euler */
    {
      id: 'one-rule',
      heading: L('Is there one rule behind all of these formulas?', 'Adakah satu aturan di balik semua rumus ini?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Yes: Euler's formula $e^{i\theta}=\cos\theta+i\sin\theta$ contains the sum formulas, and with them everything else in this article.** The exponential has the rule $e^{ix}\cdot e^{iy}=e^{i(x+y)}$. Write each factor with Euler's formula and multiply out, remembering $i^2=-1$:

$$(\cos x+i\sin x)(\cos y+i\sin y)=(\cos x\cos y-\sin x\sin y)+i(\sin x\cos y+\cos x\sin y).$$

The left side is $e^{i(x+y)}=\cos(x+y)+i\sin(x+y)$. Two complex numbers are equal only if their real parts and their imaginary parts are equal, so the real parts give the cosine sum formula and the imaginary parts give the sine sum formula. It is the rotation of the previous section, since multiplying by $e^{iy}$ is turning through $y$.

Raising to a power gives de Moivre's formula, $(\cos x+i\sin x)^n=\cos nx+i\sin nx$. For $n=3$, expanding the left side gives $\cos3x=\cos^3x-3\cos x\sin^2x$ and $\sin3x=3\cos^2x\sin x-\sin^3x$, which are the triple-angle formulas written with both functions (use $\sin^2x+\cos^2x=1$ to get the forms above). Exactly one rule about exponents sits behind the whole list.`,
            T`**Ada: rumus Euler $e^{i\theta}=\cos\theta+i\sin\theta$ memuat rumus jumlah, dan bersamanya semua yang lain dalam artikel ini.** Eksponensial memiliki aturan $e^{ix}\cdot e^{iy}=e^{i(x+y)}$. Tulis setiap faktor dengan rumus Euler dan kalikan, ingat $i^2=-1$:

$$(\cos x+i\sin x)(\cos y+i\sin y)=(\cos x\cos y-\sin x\sin y)+i(\sin x\cos y+\cos x\sin y).$$

Ruas kiri adalah $e^{i(x+y)}=\cos(x+y)+i\sin(x+y)$. Dua bilangan kompleks sama hanya jika bagian real dan bagian imajinernya sama, jadi bagian real memberi rumus jumlah kosinus dan bagian imajiner memberi rumus jumlah sinus. Inilah rotasi pada bagian sebelumnya, karena mengalikan dengan $e^{iy}$ adalah memutar sebesar $y$.

Memangkatkan memberi rumus de Moivre, $(\cos x+i\sin x)^n=\cos nx+i\sin nx$. Untuk $n=3$, menjabarkan ruas kiri memberi $\cos3x=\cos^3x-3\cos x\sin^2x$ dan $\sin3x=3\cos^2x\sin x-\sin^3x$, yaitu rumus sudut rangkap tiga yang ditulis dengan kedua fungsi (pakai $\sin^2x+\cos^2x=1$ untuk mendapat bentuk di atas). Tepat satu aturan tentang eksponen berada di balik seluruh daftar.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------------ code */
    {
      id: 'identities-in-code',
      heading: L('How do you check an identity in a program?', 'Bagaimana memeriksa sebuah identitas dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program checks an identity by sampling: evaluate both sides at many angles and report the largest difference, which should be around $10^{-16}$ for a true identity and large for a false one.** Three details matter. Convert degrees to radians before calling ´sin´ and ´cos´. Compare with a tolerance such as $10^{-12}$ rather than ´==´. And skip the angles where a side is undefined (´tan´ at $90^\circ$ or a division by zero) rather than calling them differences.

The programs below measure the largest gap for four claims: $\sin^2x+\cos^2x=1$, $\sin2x=2\sin x\cos x$, the false $\sin2x=2\sin x$, and $3\sin x+4\cos x=5\sin(x+53.13^\circ)$. They print whether the gap is below the tolerance (true for the identities), and for the false one the size of the gap and where it is largest ($2.5981$ at $120^\circ$). For symbolic proofs of the same statements, use a computer algebra system such as SymPy: it can simplify one side into the other, which a numeric sample never can.`,
            T`**Program memeriksa identitas dengan cuplikan: hitung kedua ruas pada banyak sudut dan laporkan selisih terbesar, yang seharusnya sekitar $10^{-16}$ untuk identitas yang benar dan besar untuk yang salah.** Tiga hal penting. Ubah derajat ke radian sebelum memanggil ´sin´ dan ´cos´. Bandingkan dengan toleransi seperti $10^{-12}$ alih-alih ´==´. Dan lewati sudut yang salah satu ruasnya tak terdefinisi (´tan´ pada $90^\circ$ atau pembagian dengan nol) alih-alih menyebutnya perbedaan.

Program di bawah mengukur selisih terbesar untuk empat klaim: $\sin^2x+\cos^2x=1$, $\sin2x=2\sin x\cos x$, yang salah $\sin2x=2\sin x$, dan $3\sin x+4\cos x=5\sin(x+53{,}13^\circ)$. Mereka mencetak apakah selisihnya di bawah toleransi (benar untuk identitas), dan untuk yang salah besar selisih dan tempat terbesarnya ($2{,}5981$ pada $120^\circ$). Untuk pembuktian simbolik atas pernyataan yang sama, pakai sistem aljabar komputer seperti SymPy: ia dapat menyederhanakan satu ruas menjadi ruas lain, yang tidak pernah dapat dilakukan cuplikan numerik.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: the largest gap between the two sides', 'Python: selisih terbesar antara kedua ruas'),
          code: `import math


def max_gap(f, g, n=3600):
    """The largest |f(x) - g(x)| over n + 1 angles from 0 to 360 degrees, and where it first happens."""
    worst, at = 0.0, 0.0
    for k in range(n + 1):
        x = 360 * k / n
        try:
            gap = abs(f(x) - g(x))
        except ZeroDivisionError:
            continue                    # undefined here: skip the point, do not call it a difference
        if gap > worst:
            worst, at = gap, x
    return worst, at


r = math.radians
sin = lambda x: math.sin(r(x))
cos = lambda x: math.cos(r(x))

print(max_gap(lambda x: sin(x) ** 2 + cos(x) ** 2, lambda x: 1)[0] < 1e-12)                          # True
print(max_gap(lambda x: sin(2 * x), lambda x: 2 * sin(x) * cos(x))[0] < 1e-12)                       # True
print(max_gap(lambda x: sin(x + 25), lambda x: sin(x) * cos(25) + cos(x) * sin(25))[0] < 1e-12)      # True
gap, at = max_gap(lambda x: sin(2 * x), lambda x: 2 * sin(x))
print(round(gap, 4), at)                                                                              # 2.5981 120.0: not an identity
print(round(max_gap(lambda x: sin(x + 25), lambda x: sin(x) + sin(25))[0], 4))                       # 0.8555: not an identity either
R = math.hypot(3, 4)
phi = math.degrees(math.atan2(4, 3))
print(round(R, 4), round(phi, 4))                                                                    # 5.0 53.1301
print(max_gap(lambda x: 3 * sin(x) + 4 * cos(x), lambda x: R * sin(x + phi))[0] < 1e-12)            # True`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same check', 'JavaScript: pemeriksaan yang sama'),
          code: `const r = (d) => (d * Math.PI) / 180
const sin = (x) => Math.sin(r(x))
const cos = (x) => Math.cos(r(x))

function maxGap(f, g, n = 3600) {
  // the largest |f(x) - g(x)| over n + 1 angles from 0 to 360 degrees, and where it first happens
  let worst = 0, at = 0
  for (let k = 0; k <= n; k++) {
    const x = (360 * k) / n
    const gap = Math.abs(f(x) - g(x))
    if (Number.isNaN(gap)) continue            // undefined here: skip the point, do not call it a difference
    if (gap > worst) { worst = gap; at = x }
  }
  return [worst, at]
}

maxGap((x) => sin(x) ** 2 + cos(x) ** 2, () => 1)[0] < 1e-12                                  // true
maxGap((x) => sin(2 * x), (x) => 2 * sin(x) * cos(x))[0] < 1e-12                               // true
maxGap((x) => sin(x + 25), (x) => sin(x) * cos(25) + cos(x) * sin(25))[0] < 1e-12              // true
const [gap, at] = maxGap((x) => sin(2 * x), (x) => 2 * sin(x))
;[+gap.toFixed(4), at]                                                                          // [2.5981, 120]: not an identity
+maxGap((x) => sin(x + 25), (x) => sin(x) + sin(25))[0].toFixed(4)                              // 0.8555: not an identity either
const R = Math.hypot(3, 4), phi = (Math.atan2(4, 3) * 180) / Math.PI
;[+R.toFixed(4), +phi.toFixed(4)]                                                               // [5, 53.1301]
maxGap((x) => 3 * sin(x) + 4 * cos(x), (x) => R * sin(x + phi))[0] < 1e-12                      // true`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same check with <cmath>', 'C++: pemeriksaan yang sama dengan <cmath>'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

const double PI = 3.14159265358979323846;
double worstAt;                                  // where the largest gap is

double rad(double d) { return d * PI / 180.0; }

// the two sides of claim number "which", at x degrees
double lhs(int which, double x) {
  double a = rad(x);
  if (which == 1) return sin(a) * sin(a) + cos(a) * cos(a);
  if (which == 2) return sin(2 * a);
  if (which == 3) return sin(2 * a);
  return 3 * sin(a) + 4 * cos(a);
}

double rhs(int which, double x) {
  double a = rad(x);
  if (which == 1) return 1;
  if (which == 2) return 2 * sin(a) * cos(a);
  if (which == 3) return 2 * sin(a);
  return 5 * sin(a + rad(53.13010235415598));
}

double maxGap(int which) {
  double worst = 0;
  worstAt = 0;
  for (int k = 0; k <= 3600; k++) {
    double x = 360.0 * k / 3600.0;
    double gap = fabs(lhs(which, x) - rhs(which, x));
    if (gap > worst) { worst = gap; worstAt = x; }
  }
  return worst;
}

int main() {
  printf("%d\\n", maxGap(1) < 1e-12 ? 1 : 0);
  printf("%d\\n", maxGap(2) < 1e-12 ? 1 : 0);
  printf("%.4f %.1f\\n", maxGap(3), worstAt);
  printf("%d\\n", maxGap(4) < 1e-9 ? 1 : 0);
  return 0;
}

/* output:
1
1
2.5981 120.0
1
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do the trigonometric identities come from?', 'Dari mana identitas trigonometri berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The sum formulas began as a theorem about chords in a circle, became tools for multiplying large numbers before logarithms, and were folded into one rule about exponentials in the eighteenth century.**

- **About 150 AD.** Ptolemy's *Almagest* proves a theorem about the sides and diagonals of a quadrilateral inscribed in a circle. It gives the chord of a sum or a difference of two arcs, which is the sum formula for the sine in the language of chords, and Ptolemy used it to build his table.
- **About 500 AD.** Indian astronomers state the rules for the sine and cosine of sums, and for the half angle, as part of their sine tables.
- **16th century.** *Prosthaphaeresis*: before logarithms, astronomers (Tycho Brahe's circle among them) turned a multiplication into an addition with $\cos x\cos y=\frac{\cos(x-y)+\cos(x+y)}{2}$, looking the three cosines up in a table. Napier's logarithms (1614) replaced the method.
- **1722.** de Moivre's formula, the form $(\cos x+i\sin x)^n=\cos nx+i\sin nx$, ties the multiple-angle formulas to powers.
- **1748.** Euler's *Introductio* makes the modern notation standard and gives $e^{ix}=\cos x+i\sin x$, from which the sum formulas follow in two lines.`,
            T`**Rumus jumlah bermula sebagai teorema tentang tali busur pada lingkaran, menjadi alat untuk mengalikan bilangan besar sebelum logaritma, dan dilebur menjadi satu aturan tentang eksponensial pada abad kedelapan belas.**

- **Sekitar 150 M.** *Almagest* Ptolemeus membuktikan teorema tentang sisi dan diagonal segi empat yang tertulis dalam lingkaran. Ia memberi tali busur jumlah atau selisih dua busur, yaitu rumus jumlah sinus dalam bahasa tali busur, dan Ptolemeus memakainya untuk menyusun tabelnya.
- **Sekitar 500 M.** Astronom India menyatakan aturan untuk sinus dan kosinus jumlah, dan untuk sudut paruh, sebagai bagian dari tabel sinus mereka.
- **Abad ke-16.** *Prostaferesis*: sebelum logaritma, para astronom (termasuk lingkaran Tycho Brahe) mengubah perkalian menjadi penjumlahan dengan $\cos x\cos y=\frac{\cos(x-y)+\cos(x+y)}{2}$, mencari ketiga kosinus dalam tabel. Logaritma Napier (1614) menggantikan metode itu.
- **1722.** Rumus de Moivre, bentuk $(\cos x+i\sin x)^n=\cos nx+i\sin nx$, mengikat rumus sudut kelipatan dengan pangkat.
- **1748.** *Introductio* karya Euler menjadikan notasi modern baku dan memberi $e^{ix}=\cos x+i\sin x$, yang darinya rumus jumlah mengikuti dalam dua baris.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with trigonometric identities?', 'Apa kesalahan umum pada identitas trigonometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with trigonometric identities are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ $\sin(x+y)=\sin x+\sin y$ | $\sin(x+y)=\sin x\cos y+\cos x\sin y$; at $30^\circ$ and $30^\circ$ the first gives $0.866$ and the wrong one $1$. |
| ❌ $\cos(x-y)=\cos x-\cos y$ | $\cos(x-y)=\cos x\cos y+\sin x\sin y$: the sign flips between the sum and the difference formula. |
| ❌ $\sin2x=2\sin x$ | $\sin2x=2\sin x\cos x$; the wrong version holds only at $0^\circ$ and $180^\circ$. |
| ❌ $\sin\frac{x}{2}=\frac{\sin x}{2}$ | $\sin\frac{x}{2}=\pm\sqrt{\frac{1-\cos x}{2}}$, with the sign of the quadrant of $\frac{x}{2}$. |
| ❌ Take $+\sqrt{\ }$ in every half-angle formula | The sign is that of sine or cosine where $\frac{x}{2}$ lies: negative in quadrants III and IV for sine. |
| ❌ $\sin x^2=\sin^2x$ | $\sin^2x$ means $(\sin x)^2$; $\sin(x^2)$ is a different function. |
| ❌ Cancel a term of a sum: $\frac{\sin x+\cos x}{\sin x}=\cos x$ | Only factors cancel: it is $1+\cot x$. |
| ❌ Move terms across the equals sign while proving | Work on one side only; each line must equal the one before it. |
| ❌ Test one angle and call it an identity | Agreement at some angles proves nothing; one counterexample refutes, and only a proof confirms. |`,
            T`**Kesalahan paling umum pada identitas trigonometri adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $\sin(x+y)=\sin x+\sin y$ | $\sin(x+y)=\sin x\cos y+\cos x\sin y$; pada $30^\circ$ dan $30^\circ$ yang benar memberi $0{,}866$ dan yang salah $1$. |
| ❌ $\cos(x-y)=\cos x-\cos y$ | $\cos(x-y)=\cos x\cos y+\sin x\sin y$: tandanya berbalik antara rumus jumlah dan rumus selisih. |
| ❌ $\sin2x=2\sin x$ | $\sin2x=2\sin x\cos x$; versi yang salah hanya berlaku pada $0^\circ$ dan $180^\circ$. |
| ❌ $\sin\frac{x}{2}=\frac{\sin x}{2}$ | $\sin\frac{x}{2}=\pm\sqrt{\frac{1-\cos x}{2}}$, dengan tanda kuadran $\frac{x}{2}$. |
| ❌ Mengambil $+\sqrt{\ }$ pada setiap rumus sudut paruh | Tandanya adalah tanda sinus atau kosinus di tempat $\frac{x}{2}$ berada: negatif di kuadran III dan IV untuk sinus. |
| ❌ $\sin x^2=\sin^2x$ | $\sin^2x$ berarti $(\sin x)^2$; $\sin(x^2)$ adalah fungsi yang berbeda. |
| ❌ Mencoret suku dari jumlah: $\frac{\sin x+\cos x}{\sin x}=\cos x$ | Hanya faktor yang dapat dicoret: hasilnya $1+\cot x$. |
| ❌ Memindahkan suku melewati tanda sama dengan saat membuktikan | Kerjakan satu ruas saja; setiap baris harus sama dengan baris sebelumnya. |
| ❌ Menguji satu sudut dan menyebutnya identitas | Kecocokan pada sebagian sudut tidak membuktikan apa-apa; satu contoh penyangkal membantah, dan hanya bukti yang memastikan. |`,
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
              L(T`An identity is true for every angle at which both sides are defined.`, T`Identitas benar untuk setiap sudut yang kedua ruasnya terdefinisi.`),
              L(T`$\cos2x=1-2\sin^2x$ is an identity.`, T`$\cos2x=1-2\sin^2x$ adalah identitas.`),
              L(T`$\cos(x-y)=\cos x\cos y-\sin x\sin y$.`, T`$\cos(x-y)=\cos x\cos y-\sin x\sin y$.`),
              L(T`If both sides agree at $x=45^\circ$, the identity is proved.`, T`Jika kedua ruas sama pada $x=45^\circ$, identitas itu terbukti.`),
              L(T`$1+\tan^2x=\sec^2x$ comes from dividing $\sin^2x+\cos^2x=1$ by $\cos^2x$.`, T`$1+\tan^2x=\sec^2x$ berasal dari membagi $\sin^2x+\cos^2x=1$ dengan $\cos^2x$.`),
              L(T`In a proof you may add the same thing to both sides.`, T`Dalam pembuktian kita boleh menambahkan hal yang sama pada kedua ruas.`),
            ],
            answer: [true, true, false, false, true, false],
            explain: L(
              T`The difference formula is $\cos(x-y)=\cos x\cos y+\sin x\sin y$ (plus, not minus). One angle proves nothing. A proof changes one side into the other; adding to both sides assumes the claim.`,
              T`Rumus selisihnya $\cos(x-y)=\cos x\cos y+\sin x\sin y$ (plus, bukan minus). Satu sudut tidak membuktikan apa-apa. Pembuktian mengubah satu ruas menjadi ruas lain; menambah kedua ruas mengandaikan klaimnya.`,
            ),
            hint: L(T`Check the sign in the difference formula, and remember what a test can and cannot do.`, T`Periksa tanda pada rumus selisih, dan ingat apa yang dapat dan tidak dapat dilakukan sebuah uji.`),
          },
        },
        {
          kind: 'activity',
          title: L('A double angle', 'Sebuah sudut ganda'),
          step: {
            kind: 'math',
            id: 'p2',
            hints: [L(T`Use $\cos2x=1-2\sin^2x$ with $\sin x=\frac35$.`, T`Pakai $\cos2x=1-2\sin^2x$ dengan $\sin x=\frac35$.`), L(T`$25(1-2\cdot\frac{9}{25})=25-18$.`, T`$25(1-2\cdot\frac{9}{25})=25-18$.`)],
            explain: L(T`$\cos2x=1-2\cdot\frac{9}{25}=\frac{7}{25}$, so $25\cos2x=7$.`, T`$\cos2x=1-2\cdot\frac{9}{25}=\frac{7}{25}$, jadi $25\cos2x=7$.`),
            prompt: L(T`If $\sin x=\frac35$, what is $25\cos2x$?`, T`Jika $\sin x=\frac35$, berapa $25\cos2x$?`),
            given: String.raw`v=v`,
            blanks: [{ label: '25 cos 2x =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('A product of tangents', 'Hasil kali tangen'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`$\tan75^\circ=\tan(45^\circ+30^\circ)$, and $\tan15^\circ=2-\sqrt3$.`, T`$\tan75^\circ=\tan(45^\circ+30^\circ)$, dan $\tan15^\circ=2-\sqrt3$.`), L(T`$\tan75^\circ=2+\sqrt3$, and $(2-\sqrt3)(2+\sqrt3)=4-3$.`, T`$\tan75^\circ=2+\sqrt3$, dan $(2-\sqrt3)(2+\sqrt3)=4-3$.`)],
            explain: L(T`$\tan15^\circ\tan75^\circ=(2-\sqrt3)(2+\sqrt3)=1$. (Also: $75^\circ=90^\circ-15^\circ$ and $\tan(90^\circ-x)=\cot x$.)`, T`$\tan15^\circ\tan75^\circ=(2-\sqrt3)(2+\sqrt3)=1$. (Juga: $75^\circ=90^\circ-15^\circ$ dan $\tan(90^\circ-x)=\cot x$.)`),
            prompt: L(T`What is $\tan15^\circ\cdot\tan75^\circ$?`, T`Berapa $\tan15^\circ\cdot\tan75^\circ$?`),
            given: String.raw`p=v`,
            blanks: [{ label: 'p =', answer: 1 }],
          },
        },
        {
          kind: 'activity',
          title: L('How many solutions?', 'Berapa penyelesaian?'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`$\sin x\cos x=\frac12\sin2x$, so the equation is $\sin2x=\frac12$.`, T`$\sin x\cos x=\frac12\sin2x$, jadi persamaannya $\sin2x=\frac12$.`), L(T`$2x=30^\circ,150^\circ,390^\circ,510^\circ$ for $2x$ up to $720^\circ$.`, T`$2x=30^\circ,150^\circ,390^\circ,510^\circ$ untuk $2x$ sampai $720^\circ$.`)],
            explain: L(T`$2x$ runs over $0^\circ$ to $720^\circ$ and $\sin2x=\frac12$ twice per turn: $x=15^\circ,75^\circ,195^\circ,255^\circ$, four angles.`, T`$2x$ berjalan dari $0^\circ$ sampai $720^\circ$ dan $\sin2x=\frac12$ dua kali per putaran: $x=15^\circ,75^\circ,195^\circ,255^\circ$, empat sudut.`),
            prompt: L(T`How many angles $x$ with $0^\circ\le x<360^\circ$ satisfy $\sin x\cos x=\frac14$?`, T`Berapa banyak sudut $x$ dengan $0^\circ\le x<360^\circ$ yang memenuhi $\sin x\cos x=\frac14$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 4 }],
          },
        },
        {
          kind: 'activity',
          title: L('One wave', 'Satu gelombang'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`$R=\sqrt{a^2+b^2}$.`, T`$R=\sqrt{a^2+b^2}$.`), L(T`$\sqrt{36+64}$.`, T`$\sqrt{36+64}$.`)],
            explain: L(T`$R=\sqrt{6^2+8^2}=10$, so $6\sin x+8\cos x=10\sin(x+53.13^\circ)$.`, T`$R=\sqrt{6^2+8^2}=10$, jadi $6\sin x+8\cos x=10\sin(x+53{,}13^\circ)$.`),
            prompt: L(T`What is $R$ in $6\sin x+8\cos x=R\sin(x+\varphi)$?`, T`Berapa $R$ dalam $6\sin x+8\cos x=R\sin(x+\varphi)$?`),
            given: String.raw`R=v`,
            blanks: [{ label: 'R =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('The largest value', 'Nilai terbesar'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`The largest value of $a\sin x+b\cos x$ is $R=\sqrt{a^2+b^2}$.`, T`Nilai terbesar $a\sin x+b\cos x$ adalah $R=\sqrt{a^2+b^2}$.`), L(T`$\sqrt{25+144}$.`, T`$\sqrt{25+144}$.`)],
            explain: L(T`$\sqrt{5^2+(-12)^2}=13$, the highest the wave goes.`, T`$\sqrt{5^2+(-12)^2}=13$, tertinggi yang dicapai gelombang.`),
            prompt: L(T`What is the largest value of $5\sin x-12\cos x$?`, T`Berapa nilai terbesar $5\sin x-12\cos x$?`),
            given: String.raw`M=v`,
            blanks: [{ label: 'M =', answer: 13 }],
          },
        },
        {
          kind: 'activity',
          title: L('Which form?', 'Bentuk yang mana?'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L(T`Which expression equals $\cos2x$?`, T`Ekspresi mana yang sama dengan $\cos2x$?`),
            options: [L(T`$2\cos^2x-1$`, T`$2\cos^2x-1$`), L(T`$2\cos x$`, T`$2\cos x$`), L(T`$1-2\cos^2x$`, T`$1-2\cos^2x$`), L(T`$\cos^2x+\sin^2x$`, T`$\cos^2x+\sin^2x$`)],
            answer: 0,
            explain: L(T`$\cos2x=\cos^2x-\sin^2x=\cos^2x-(1-\cos^2x)=2\cos^2x-1$. The last option is $1$.`, T`$\cos2x=\cos^2x-\sin^2x=\cos^2x-(1-\cos^2x)=2\cos^2x-1$. Pilihan terakhir adalah $1$.`),
            hint: L(T`Start from $\cos^2x-\sin^2x$ and replace $\sin^2x$.`, T`Mulailah dari $\cos^2x-\sin^2x$ dan ganti $\sin^2x$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A sum as a product', 'Jumlah sebagai hasil kali'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L(T`Which is equal to $\sin x+\sin y$?`, T`Mana yang sama dengan $\sin x+\sin y$?`),
            options: [
              L(T`$2\sin\frac{x+y}{2}\cos\frac{x-y}{2}$`, T`$2\sin\frac{x+y}{2}\cos\frac{x-y}{2}$`),
              L(T`$2\cos\frac{x+y}{2}\sin\frac{x-y}{2}$`, T`$2\cos\frac{x+y}{2}\sin\frac{x-y}{2}$`),
              L(T`$\sin(x+y)$`, T`$\sin(x+y)$`),
              L(T`$2\sin\frac{x+y}{2}\sin\frac{x-y}{2}$`, T`$2\sin\frac{x+y}{2}\sin\frac{x-y}{2}$`),
            ],
            answer: 0,
            explain: L(T`The second option is $\sin x-\sin y$. A quick test: at $x=y$ the sum is $2\sin x$ and the first option gives $2\sin x\cos0^\circ=2\sin x$.`, T`Pilihan kedua adalah $\sin x-\sin y$. Uji cepat: pada $x=y$ jumlahnya $2\sin x$ dan pilihan pertama memberi $2\sin x\cos0^\circ=2\sin x$.`),
            hint: L(T`Test each option at $x=y$.`, T`Uji tiap pilihan pada $x=y$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Which are identities?', 'Mana yang identitas?'),
          step: {
            kind: 'multi',
            id: 'p9',
            prompt: L(T`Which of these are identities? Choose **all** that apply.`, T`Mana yang merupakan identitas? Pilih **semua** yang benar.`),
            options: [
              L(T`$\sin2x=2\sin x\cos x$`, T`$\sin2x=2\sin x\cos x$`),
              L(T`$\cos(x-y)=\cos x-\cos y$`, T`$\cos(x-y)=\cos x-\cos y$`),
              L(T`$1+\tan^2x=\sec^2x$`, T`$1+\tan^2x=\sec^2x$`),
              L(T`$\sin\frac{x}{2}=\frac{\sin x}{2}$`, T`$\sin\frac{x}{2}=\frac{\sin x}{2}$`),
              L(T`$\cos2x=1-2\sin^2x$`, T`$\cos2x=1-2\sin^2x$`),
            ],
            answer: [0, 2, 4],
            explain: L(T`The second and fourth are false: $\cos(x-y)=\cos x\cos y+\sin x\sin y$, and $\sin\frac{x}{2}=\pm\sqrt{\frac{1-\cos x}{2}}$.`, T`Yang kedua dan keempat salah: $\cos(x-y)=\cos x\cos y+\sin x\sin y$, dan $\sin\frac{x}{2}=\pm\sqrt{\frac{1-\cos x}{2}}$.`),
            hint: L(T`Test the doubtful ones at $x=60^\circ$ and $y=30^\circ$.`, T`Uji yang meragukan pada $x=60^\circ$ dan $y=30^\circ$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Order the proof', 'Urutkan pembuktiannya'),
          step: {
            kind: 'order',
            id: 'p10',
            prompt: L('Put the lines of the proof of $(1-\\cos x)(1+\\cos x)=\\sin^2 x$ in order.', 'Urutkan baris pembuktian $(1-\\cos x)(1+\\cos x)=\\sin^2 x$.'),
            lines: {
              en: ['Start from the left side: (1 − cos x)(1 + cos x)', 'Multiply out with the difference of squares: 1 − cos² x', 'Use sin² x + cos² x = 1: 1 − cos² x = sin² x', 'The left side has become the right side: sin² x'],
              id: ['Mulai dari ruas kiri: (1 − cos x)(1 + cos x)', 'Jabarkan dengan selisih kuadrat: 1 − cos² x', 'Pakai sin² x + cos² x = 1: 1 − cos² x = sin² x', 'Ruas kiri telah menjadi ruas kanan: sin² x'],
            },
            explain: L(T`Start from one side, simplify with valid steps, and arrive at the other.`, T`Mulai dari satu ruas, sederhanakan dengan langkah yang sah, dan sampai ke ruas lain.`),
            hint: L(T`The claim comes last, and you never begin from it.`, T`Klaimnya datang terakhir, dan kita tidak pernah mulai darinya.`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the formula', 'Isi rumusnya'),
          step: {
            kind: 'fill',
            id: 'p11',
            prompt: L('Complete the sum formula.', 'Lengkapi rumus jumlah.'),
            template: {
              en: 'sin(x + y) = sin x cos y + ___ sin y',
              id: 'sin(x + y) = sin x cos y + ___ sin y',
            },
            blanks: { en: ['cos x'], id: ['cos x'] },
            explain: L(T`$\sin(x+y)=\sin x\cos y+\cos x\sin y$: the two products pair a sine with a cosine.`, T`$\sin(x+y)=\sin x\cos y+\cos x\sin y$: kedua hasil kali memasangkan sinus dengan kosinus.`),
            hint: L(T`The second product swaps the roles of $x$ and $y$.`, T`Hasil kali kedua menukar peran $x$ dan $y$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A lucky angle', 'Sudut yang kebetulan cocok'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`$\sin2x$ and $2\sin x$ are equal at $x=0^\circ$. What does that show?`, T`$\sin2x$ dan $2\sin x$ sama pada $x=0^\circ$. Apa yang ditunjukkan itu?`),
            options: [
              L(T`nothing: it is true at a few angles, and false at $30^\circ$`, T`tidak apa-apa: benar pada beberapa sudut, dan salah pada $30^\circ$`),
              L(T`that $\sin2x=2\sin x$ is an identity`, T`bahwa $\sin2x=2\sin x$ adalah identitas`),
              L(T`that $\sin x=0$ for all $x$`, T`bahwa $\sin x=0$ untuk semua $x$`),
              L(T`that the formula needs a tolerance`, T`bahwa rumus itu memerlukan toleransi`),
            ],
            answer: 0,
            explain: L(T`At $30^\circ$ the left side is $\sin60^\circ\approx0.866$ and the right side is $1$. Agreement at a few angles proves nothing.`, T`Pada $30^\circ$ ruas kiri adalah $\sin60^\circ\approx0{,}866$ dan ruas kanan $1$. Kecocokan pada beberapa sudut tidak membuktikan apa-apa.`),
            hint: L(T`Try another angle, such as $30^\circ$.`, T`Coba sudut lain, seperti $30^\circ$.`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: trigonometric identities at a glance', 'Ringkasan: identitas trigonometri sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Identity:** true wherever both sides are defined; a false formula needs one counterexample, a true one needs a proof.
- **Fundamental:** $\sin^2x+\cos^2x=1$, $1+\tan^2x=\sec^2x$, $\tan x=\frac{\sin x}{\cos x}$, $\sin(90^\circ-x)=\cos x$, $\sin(-x)=-\sin x$, $\cos(-x)=\cos x$.
- **Sum and difference:** $\sin(x\pm y)=\sin x\cos y\pm\cos x\sin y$, $\cos(x\pm y)=\cos x\cos y\mp\sin x\sin y$, from turning a point through $y$.
- **Double and half:** $\sin2x=2\sin x\cos x$; $\cos2x=\cos^2x-\sin^2x$, also $2\cos^2x-1$ and $1-2\sin^2x$; $\sin^2\frac{x}{2}=\frac{1-\cos x}{2}$, $\cos^2\frac{x}{2}=\frac{1+\cos x}{2}$.
- **Product and sum:** $\sin x\cos y=\frac{\sin(x+y)+\sin(x-y)}{2}$ and the other three; sums become products with the half sum and half difference.
- **One wave:** $a\sin x+b\cos x=R\sin(x+\varphi)$, $R=\sqrt{a^2+b^2}$, $\varphi=\operatorname{atan2}(b,a)$.
- **Proving:** one side only, valid steps, sine and cosine when stuck, Pythagorean in either direction, state the domain.
- **Testing:** compare at many angles, tolerance not equality, skip undefined points; a test refutes but never proves.
- **Behind it all:** $e^{ix}\cdot e^{iy}=e^{i(x+y)}$.`,
            T`- **Identitas:** benar di mana pun kedua ruas terdefinisi; rumus yang salah memerlukan satu contoh penyangkal, yang benar memerlukan bukti.
- **Dasar:** $\sin^2x+\cos^2x=1$, $1+\tan^2x=\sec^2x$, $\tan x=\frac{\sin x}{\cos x}$, $\sin(90^\circ-x)=\cos x$, $\sin(-x)=-\sin x$, $\cos(-x)=\cos x$.
- **Jumlah dan selisih:** $\sin(x\pm y)=\sin x\cos y\pm\cos x\sin y$, $\cos(x\pm y)=\cos x\cos y\mp\sin x\sin y$, dari memutar titik sebesar $y$.
- **Ganda dan paruh:** $\sin2x=2\sin x\cos x$; $\cos2x=\cos^2x-\sin^2x$, juga $2\cos^2x-1$ dan $1-2\sin^2x$; $\sin^2\frac{x}{2}=\frac{1-\cos x}{2}$, $\cos^2\frac{x}{2}=\frac{1+\cos x}{2}$.
- **Hasil kali dan jumlah:** $\sin x\cos y=\frac{\sin(x+y)+\sin(x-y)}{2}$ dan tiga yang lain; jumlah menjadi hasil kali dengan setengah jumlah dan setengah selisih.
- **Satu gelombang:** $a\sin x+b\cos x=R\sin(x+\varphi)$, $R=\sqrt{a^2+b^2}$, $\varphi=\operatorname{atan2}(b,a)$.
- **Membuktikan:** satu ruas saja, langkah sah, sinus dan kosinus bila buntu, Pythagoras ke dua arah, sebutkan daerah asal.
- **Menguji:** bandingkan pada banyak sudut, toleransi bukan kesamaan, lewati titik tak terdefinisi; uji membantah tetapi tidak pernah membuktikan.
- **Di balik semuanya:** $e^{ix}\cdot e^{iy}=e^{i(x+y)}$.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Trigonometric identity', 'Identitas trigonometri'), definition: L('An equation between trigonometric expressions that is true for every angle at which both sides are defined.', 'Persamaan antara ekspresi trigonometri yang benar untuk setiap sudut yang kedua ruasnya terdefinisi.') },
    { term: L('Counterexample', 'Contoh penyangkal'), definition: L('One angle at which the two sides of a claimed identity differ, which proves the claim false.', 'Satu sudut yang membuat kedua ruas identitas yang diklaim berbeda, yang membuktikan klaim itu salah.') },
    { term: L('Pythagorean identity', 'Identitas Pythagoras'), definition: L('The identity sin squared plus cos squared equals 1, which says that the point at an angle on the unit circle is at distance 1 from the center.', 'Identitas sin kuadrat ditambah cos kuadrat sama dengan 1, yang menyatakan bahwa titik pada suatu sudut di lingkaran satuan berjarak 1 dari pusat.') },
    { term: L('Sum formula', 'Rumus jumlah'), definition: L('A formula that gives the sine, cosine or tangent of x plus y from the functions of x and of y, such as sin(x + y) = sin x cos y + cos x sin y.', 'Rumus yang memberi sinus, kosinus, atau tangen x ditambah y dari fungsi x dan y, seperti sin(x + y) = sin x cos y + cos x sin y.') },
    { term: L('Double-angle formula', 'Rumus sudut ganda'), definition: L('A formula for the sine, cosine or tangent of 2x in terms of the functions of x, found by putting y equal to x in the sum formula.', 'Rumus sinus, kosinus, atau tangen 2x dalam fungsi x, yang diperoleh dengan memasang y sama dengan x pada rumus jumlah.') },
    { term: L('Half-angle formula', 'Rumus sudut paruh'), definition: L('A formula for the sine, cosine or tangent of x over 2, with a square root whose sign is that of the function in the quadrant of x over 2.', 'Rumus sinus, kosinus, atau tangen x per 2, dengan akar kuadrat yang tandanya adalah tanda fungsi di kuadran x per 2.') },
    { term: L('Product-to-sum formula', 'Rumus hasil kali menjadi jumlah'), definition: L('A formula that writes a product of two sines or cosines as half a sum, such as sin x cos y = (sin(x + y) + sin(x - y)) / 2.', 'Rumus yang menulis hasil kali dua sinus atau kosinus sebagai setengah jumlah, seperti sin x cos y = (sin(x + y) + sin(x - y)) / 2.') },
    { term: L('Single-wave form', 'Bentuk satu gelombang'), definition: L('The rewriting of a sin x + b cos x as R sin(x + phi) with R equal to the square root of a squared plus b squared.', 'Penulisan ulang a sin x + b cos x sebagai R sin(x + phi) dengan R sama dengan akar dari a kuadrat ditambah b kuadrat.') },
    { term: L('Domain of an identity', 'Daerah asal identitas'), definition: L('The angles at which both sides are defined; an identity says nothing about angles where a side is undefined.', 'Sudut-sudut yang membuat kedua ruas terdefinisi; identitas tidak menyatakan apa-apa tentang sudut tempat sebuah ruas tak terdefinisi.') },
    { term: L('Prosthaphaeresis', 'Prostaferesis'), definition: L('A sixteenth-century method that used the product-to-sum formulas to replace a multiplication by additions and table look-ups.', 'Metode abad keenam belas yang memakai rumus hasil kali menjadi jumlah untuk mengganti perkalian dengan penjumlahan dan pencarian tabel.') },
  ],

  howTo: [
    {
      name: L('How to prove a trigonometric identity step by step', 'Cara membuktikan identitas trigonometri langkah demi langkah'),
      description: L('Work on one side with valid steps, using the fundamental identities, until it becomes the other side.', 'Kerjakan satu ruas dengan langkah yang sah, memakai identitas dasar, sampai menjadi ruas yang lain.'),
      steps: [
        { name: L('Pick one side', 'Pilih satu ruas'), text: L('Choose the more complicated side and keep the other as the target. Do not move terms across the equals sign.', 'Pilih ruas yang lebih rumit dan simpan yang lain sebagai sasaran. Jangan memindahkan suku melewati tanda sama dengan.') },
        { name: L('Rewrite in sine and cosine', 'Tulis ulang dalam sinus dan kosinus'), text: L('Replace tangent, cotangent, secant and cosecant by their definitions when you do not see a path.', 'Ganti tangen, kotangen, sekan, dan kosekan dengan definisinya bila belum melihat jalan.') },
        { name: L('Simplify with algebra and identities', 'Sederhanakan dengan aljabar dan identitas'), text: L('Use common denominators, factoring, expanding, the difference of squares and the Pythagorean identity, one valid step per line.', 'Pakai penyebut sama, pemfaktoran, penjabaran, selisih kuadrat, dan identitas Pythagoras, satu langkah sah per baris.') },
        { name: L('Arrive at the other side', 'Sampai ke ruas lain'), text: L('Stop when the last line is the other side of the claim, and say that it holds wherever both sides are defined.', 'Berhenti ketika baris terakhir adalah ruas lain dari klaim, dan nyatakan bahwa ia berlaku di mana pun kedua ruas terdefinisi.') },
      ],
    },
    {
      name: L('How to find the exact value of sin 15 degrees', 'Cara mencari nilai eksak sin 15 derajat'),
      description: L('Write 15 degrees as 45 minus 30 and use the difference formula with the exact values you already know.', 'Tulis 15 derajat sebagai 45 dikurangi 30 dan pakai rumus selisih dengan nilai eksak yang sudah diketahui.'),
      steps: [
        { name: L('Write the angle as a difference', 'Tulis sudut sebagai selisih'), text: L('Write 15 degrees as 45 degrees minus 30 degrees.', 'Tulis 15 derajat sebagai 45 derajat dikurangi 30 derajat.') },
        { name: L('Use the difference formula', 'Pakai rumus selisih'), text: L('Apply sin(a - b) = sin a cos b - cos a sin b with a = 45 degrees and b = 30 degrees.', 'Terapkan sin(a - b) = sin a cos b - cos a sin b dengan a = 45 derajat dan b = 30 derajat.') },
        { name: L('Put in the exact values', 'Masukkan nilai eksak'), text: L('Sin 45 is root 2 over 2, cos 30 is root 3 over 2, cos 45 is root 2 over 2 and sin 30 is one half.', 'Sin 45 adalah akar 2 per 2, cos 30 adalah akar 3 per 2, cos 45 adalah akar 2 per 2, dan sin 30 adalah setengah.') },
        { name: L('Simplify', 'Sederhanakan'), text: L('The product is root 6 over 4 minus root 2 over 4, so sin 15 degrees equals root 6 minus root 2, over 4.', 'Hasilnya akar 6 per 4 dikurangi akar 2 per 4, jadi sin 15 derajat sama dengan akar 6 dikurangi akar 2, per 4.') },
      ],
    },
    {
      name: L('How to write a sin x + b cos x as a single sine wave', 'Cara menulis a sin x + b cos x sebagai satu gelombang sinus'),
      description: L('Find the amplitude R and the shift phi so that a sin x + b cos x equals R sin(x + phi).', 'Cari amplitudo R dan pergeseran phi sehingga a sin x + b cos x sama dengan R sin(x + phi).'),
      steps: [
        { name: L('Find the amplitude', 'Cari amplitudonya'), text: L('Compute R as the square root of a squared plus b squared.', 'Hitung R sebagai akar dari a kuadrat ditambah b kuadrat.') },
        { name: L('Find the shift', 'Cari pergeserannya'), text: L('Take phi as atan2 of b and a, so that R cos phi equals a and R sin phi equals b.', 'Ambil phi sebagai atan2 dari b dan a, sehingga R cos phi sama dengan a dan R sin phi sama dengan b.') },
        { name: L('Write the single wave', 'Tulis satu gelombangnya'), text: L('Then a sin x + b cos x equals R sin(x + phi), by the sine sum formula.', 'Maka a sin x + b cos x sama dengan R sin(x + phi), menurut rumus jumlah sinus.') },
        { name: L('Use it', 'Pakai'), text: L('The largest and smallest values are plus and minus R, and an equation becomes sin(x + phi) equal to a number.', 'Nilai terbesar dan terkecilnya adalah plus dan minus R, dan persamaan menjadi sin(x + phi) sama dengan sebuah bilangan.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the difference between a trigonometric identity and an equation?', 'Apa beda identitas trigonometri dan persamaan?'),
      a: L(
        'An identity is true for every angle where both sides are defined, like sin squared plus cos squared equals 1. An equation is true only for some angles, like sine of x equals one half, so you solve it instead of proving it.',
        'Identitas benar untuk setiap sudut yang kedua ruasnya terdefinisi, seperti sin kuadrat ditambah cos kuadrat sama dengan 1. Persamaan hanya benar untuk sebagian sudut, seperti sinus x sama dengan setengah, sehingga diselesaikan, bukan dibuktikan.',
      ),
    },
    {
      q: L('What are the sum and difference formulas for sine and cosine?', 'Apa rumus jumlah dan selisih untuk sinus dan kosinus?'),
      a: L(
        'Sin of x plus y is sin x cos y plus cos x sin y, and cos of x plus y is cos x cos y minus sin x sin y. For differences, change the sign in the sine formula and flip the sign in the cosine formula.',
        'Sin x tambah y adalah sin x cos y tambah cos x sin y, dan cos x tambah y adalah cos x cos y kurang sin x sin y. Untuk selisih, ubah tanda pada rumus sinus dan balik tanda pada rumus kosinus.',
      ),
    },
    {
      q: L('How do you derive the double-angle formulas?', 'Bagaimana menurunkan rumus sudut ganda?'),
      a: L(
        'Put y equal to x in the sum formulas: sin 2x is 2 sin x cos x and cos 2x is cos squared x minus sin squared x. With sin squared plus cos squared equal to 1, cos 2x also equals 2 cos squared x minus 1 and 1 minus 2 sin squared x.',
        'Pasang y sama dengan x pada rumus jumlah: sin 2x adalah 2 sin x cos x dan cos 2x adalah cos kuadrat x kurang sin kuadrat x. Dengan sin kuadrat ditambah cos kuadrat sama dengan 1, cos 2x juga sama dengan 2 cos kuadrat x kurang 1 dan 1 kurang 2 sin kuadrat x.',
      ),
    },
    {
      q: L('What is the half-angle formula for sine and cosine?', 'Apa rumus sudut paruh untuk sinus dan kosinus?'),
      a: L(
        'Sine squared of x over 2 is 1 minus cos x, over 2, and cosine squared of x over 2 is 1 plus cos x, over 2. Taking the square root needs a plus or minus sign chosen by the quadrant of x over 2.',
        'Sinus kuadrat x per 2 adalah 1 kurang cos x, per 2, dan kosinus kuadrat x per 2 adalah 1 tambah cos x, per 2. Menarik akar kuadrat memerlukan tanda plus atau minus yang dipilih menurut kuadran x per 2.',
      ),
    },
    {
      q: L('How do you prove a trigonometric identity?', 'Bagaimana membuktikan identitas trigonometri?'),
      a: L(
        'Start from one side and change it, one valid step at a time, into the other side. Rewrite in sine and cosine when stuck, use the Pythagorean identity, and never move terms across the equals sign.',
        'Mulailah dari satu ruas dan ubah, satu langkah sah pada satu waktu, menjadi ruas yang lain. Tulis ulang dalam sinus dan kosinus bila buntu, pakai identitas Pythagoras, dan jangan memindahkan suku melewati tanda sama dengan.',
      ),
    },
    {
      q: L('Can you check an identity by plugging in numbers?', 'Dapatkah identitas diperiksa dengan memasukkan bilangan?'),
      a: L(
        'Only to refute it. One angle where the sides differ shows the claim is false, but agreement at some angles proves nothing: sin 2x and 2 sin x agree at 0 and 180 degrees and are not equal in general.',
        'Hanya untuk membantahnya. Satu sudut yang membuat kedua ruas berbeda menunjukkan klaim itu salah, tetapi kecocokan pada sebagian sudut tidak membuktikan apa-apa: sin 2x dan 2 sin x sama pada 0 dan 180 derajat dan tidak sama secara umum.',
      ),
    },
    {
      q: L('How do you turn a sin x + b cos x into a single sine?', 'Bagaimana mengubah a sin x + b cos x menjadi satu sinus?'),
      a: L(
        'Write it as R sin of x plus phi, where R is the square root of a squared plus b squared and phi is atan2 of b and a. For example 3 sin x plus 4 cos x equals 5 sin of x plus 53.13 degrees.',
        'Tulis sebagai R sin dari x tambah phi, dengan R akar dari a kuadrat tambah b kuadrat dan phi atan2 dari b dan a. Misalnya 3 sin x tambah 4 cos x sama dengan 5 sin dari x tambah 53,13 derajat.',
      ),
    },
    {
      q: L('Which formulas give exact values such as sin 15 degrees?', 'Rumus mana yang memberi nilai eksak seperti sin 15 derajat?'),
      a: L(
        'The difference and sum formulas applied to 30, 45 and 60 degrees, and the half-angle formulas. Sin 15 degrees is sin of 45 minus 30, which is root 6 minus root 2, over 4.',
        'Rumus selisih dan jumlah yang diterapkan pada 30, 45, dan 60 derajat, dan rumus sudut paruh. Sin 15 derajat adalah sin dari 45 kurang 30, yaitu akar 6 kurang akar 2, per 4.',
      ),
    },
  ],

  references: [
    { title: 'Handbook of Mathematical Functions (section 4.3, circular functions)', author: 'Milton Abramowitz, Irene A. Stegun', year: 1964, source: 'National Bureau of Standards' },
    { title: 'Trigonometric Delights', author: 'Eli Maor', year: 1998, source: 'Princeton University Press' },
    { title: 'Trigonometry (2nd ed.)', author: 'I. M. Gelfand, Mark Saul', year: 2001, source: 'Birkhäuser' },
    { title: 'Precalculus: Mathematics for Calculus (chapters on analytic trigonometry)', author: 'James Stewart, Lothar Redlin, Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'Ptolemy\'s Almagest (translated and annotated)', author: 'G. J. Toomer', year: 1984, source: 'Springer' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
    { title: 'Introductio in analysin infinitorum', author: 'Leonhard Euler', year: 1748, source: 'Marcum-Michaelem Bousquet' },
  ],

  related: ['basic-trigonometry', 'angles', 'triangles', 'derivatives-of-trigonometric-functions'],
}
