import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './angles.meta'

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

export const body: ArticleBody = {
  answer: L(
    T`**An angle is the amount of turning between two rays that start at the same point, measured in degrees (a full turn is $360^\circ$), in radians (a full turn is $2\pi$) or in turns.** Angles are named by size (acute below $90^\circ$, right at $90^\circ$, obtuse between $90^\circ$ and $180^\circ$, straight at $180^\circ$, reflex above), and they come in pairs: complementary angles add up to $90^\circ$, supplementary ones to $180^\circ$, and vertical angles are equal.`,
    T`**Sudut adalah besarnya putaran antara dua sinar yang berawal dari titik yang sama, diukur dalam derajat (satu putaran penuh $360^\circ$), dalam radian (satu putaran penuh $2\pi$) atau dalam putaran.** Sudut dinamai menurut besarnya (lancip di bawah $90^\circ$, siku-siku $90^\circ$, tumpul antara $90^\circ$ dan $180^\circ$, lurus $180^\circ$, refleks di atasnya), dan datang berpasangan: sudut berpenyiku berjumlah $90^\circ$, berpelurus $180^\circ$, dan sudut bertolak belakang sama besar.`,
  ),

  keyPoints: [
    L(
      T`An angle is formed by two rays with a common endpoint, the *vertex*. Its size is the turn from one ray to the other: positive counterclockwise, with a full turn of $360^\circ=2\pi$ radians $=400$ gradians $=1$ turn. To convert, multiply degrees by $\frac{\pi}{180}$ for radians.`,
      T`Sudut dibentuk oleh dua sinar dengan titik ujung bersama, yaitu *titik sudut*. Besarnya adalah putaran dari satu sinar ke sinar lain: positif berlawanan arah jarum jam, dengan satu putaran penuh $360^\circ=2\pi$ radian $=400$ gradian $=1$ putaran. Untuk mengubah, kalikan derajat dengan $\frac{\pi}{180}$ untuk radian.`,
    ),
    L(
      T`Types by size: acute ($0^\circ$ to $90^\circ$), right ($90^\circ$), obtuse ($90^\circ$ to $180^\circ$), straight ($180^\circ$), reflex ($180^\circ$ to $360^\circ$). Pairs: complementary ($90^\circ$), supplementary ($180^\circ$), adjacent, a linear pair (adjacent and supplementary) and vertical angles (equal).`,
      T`Jenis menurut besarnya: lancip ($0^\circ$ sampai $90^\circ$), siku-siku ($90^\circ$), tumpul ($90^\circ$ sampai $180^\circ$), lurus ($180^\circ$), refleks ($180^\circ$ sampai $360^\circ$). Pasangan: berpenyiku ($90^\circ$), berpelurus ($180^\circ$), bersisian, pasangan linear (bersisian dan berpelurus), dan sudut bertolak belakang (sama besar).`,
    ),
    L(
      T`A line crossing two parallel lines makes eight angles that take only two values, $\alpha$ and $180^\circ-\alpha$. Corresponding, alternate interior, alternate exterior and vertical pairs are equal; co-interior, co-exterior and linear pairs add up to $180^\circ$. The lines are parallel exactly when such a pair is equal.`,
      T`Sebuah garis yang memotong dua garis sejajar membuat delapan sudut yang hanya bernilai dua, $\alpha$ dan $180^\circ-\alpha$. Pasangan sehadap, dalam berseberangan, luar berseberangan, dan bertolak belakang sama besar; pasangan dalam sepihak, luar sepihak, dan berpelurus berjumlah $180^\circ$. Garis-garis itu sejajar tepat ketika pasangan seperti itu sama besar.`,
    ),
    L(
      T`The interior angles of an $n$-sided polygon add up to $(n-2)\cdot180^\circ$, because it splits into $n-2$ triangles; the exterior angles always add up to $360^\circ$. A regular polygon has interior angles $\frac{(n-2)\cdot180^\circ}{n}$ and exterior angles $\frac{360^\circ}{n}$.`,
      T`Sudut-sudut dalam segi-$n$ berjumlah $(n-2)\cdot180^\circ$, karena ia terbagi menjadi $n-2$ segitiga; sudut luarnya selalu berjumlah $360^\circ$. Segi banyak beraturan memiliki sudut dalam $\frac{(n-2)\cdot180^\circ}{n}$ dan sudut luar $\frac{360^\circ}{n}$.`,
    ),
    L(
      T`The hour hand turns $0.5^\circ$ a minute and the minute hand $6^\circ$, so the angle between them is $\left|30h-5.5m\right|$ (or $360^\circ$ minus that if it is larger than $180^\circ$). In twelve hours the hands overlap $11$ times and are at right angles $22$ times. A compass bearing is measured clockwise from north: bearing $=90^\circ-\theta$ for a direction $\theta$ counterclockwise from east.`,
      T`Jarum jam berputar $0{,}5^\circ$ per menit dan jarum menit $6^\circ$, sehingga sudut di antaranya $\left|30h-5{,}5m\right|$ (atau $360^\circ$ dikurangi itu bila lebih dari $180^\circ$). Dalam dua belas jam kedua jarum bertumpuk $11$ kali dan membentuk sudut siku-siku $22$ kali. Bearing kompas diukur searah jarum jam dari utara: bearing $=90^\circ-\theta$ untuk arah $\theta$ berlawanan arah jarum jam dari timur.`,
    ),
    L(
      T`In code, convert with ´math.radians´ and ´math.degrees´, normalize with ´% 360´, and find the angle between two vectors with ´atan2(|a × b|, a · b)´: the arc cosine formula returns $0$ for an angle of $10^{-8}$ radians.`,
      T`Dalam kode, ubah dengan ´math.radians´ dan ´math.degrees´, normalkan dengan ´% 360´, dan cari sudut antara dua vektor dengan ´atan2(|a × b|, a · b)´: rumus arc kosinus menghasilkan $0$ untuk sudut $10^{-8}$ radian.`,
    ),
  ],

  sections: [
    /* --------------------------------------------------------------------------------------- what */
    {
      id: 'what-is-an-angle',
      heading: L('What is an angle?', 'Apa itu sudut?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An angle is the figure made by two rays, called its *sides* or *arms*, that start at the same point, called its *vertex*; its size says how far you must turn one ray to land on the other.** Open a door, and the angle between the door and the frame grows; swing a clock hand, and it sweeps an angle. The size does not depend on how long the rays are drawn, only on the turn between them.

**Naming.** An angle is written with three letters and the angle sign, with the vertex in the middle: $\angle ABC$ has its vertex at $B$ and its sides along $BA$ and $BC$. A single letter ($\angle B$) is enough when no other angle shares the vertex, and a Greek letter ($\theta$, $\alpha$) is often used for the size itself.

**Direction.** In mathematics an angle is measured from a starting ray, the *initial side*, to a *terminal side*, and a turn **counterclockwise is positive** and clockwise is negative. So $-90^\circ$ is a quarter turn clockwise, and $450^\circ$ is a full turn plus a quarter: it ends in the same place as $90^\circ$. Euclid, in the *Elements*, described an angle as the inclination of two lines to one another in a plane, and for centuries geometry used only angles below a straight angle; the idea of an angle as an amount of *turning*, which can be added, negative or larger than a full turn, is what trigonometry, rotations and navigation need.

**Why we measure.** Two angles can be compared and added: placing them side by side along a common ray gives the sum. To say *how big* they are we need a unit, and the next sections describe the units, the names of angles by size, and the rules that relate angles to each other and to lines, polygons, circles, clocks and vectors.`,
            T`**Sudut adalah bangun yang dibentuk oleh dua sinar, disebut *sisi* atau *kaki*-nya, yang berawal dari titik yang sama, disebut *titik sudut*-nya; besarnya menyatakan seberapa jauh satu sinar harus diputar untuk jatuh di atas yang lain.** Buka sebuah pintu, dan sudut antara pintu dan kusen membesar; ayunkan jarum jam, dan ia menyapu sebuah sudut. Besarnya tidak bergantung pada panjang sinar yang digambar, hanya pada putaran di antaranya.

**Penamaan.** Sudut ditulis dengan tiga huruf dan tanda sudut, dengan titik sudut di tengah: $\angle ABC$ memiliki titik sudut di $B$ dan sisinya sepanjang $BA$ dan $BC$. Satu huruf ($\angle B$) cukup bila tidak ada sudut lain yang berbagi titik sudut, dan huruf Yunani ($\theta$, $\alpha$) sering dipakai untuk besarnya.

**Arah.** Dalam matematika sudut diukur dari sebuah sinar awal, *sisi awal*, ke *sisi akhir*, dan putaran **berlawanan arah jarum jam adalah positif** dan searah jarum jam negatif. Jadi $-90^\circ$ adalah seperempat putaran searah jarum jam, dan $450^\circ$ adalah satu putaran penuh ditambah seperempat: ia berakhir di tempat yang sama dengan $90^\circ$. Euklides, dalam *Elements*, menguraikan sudut sebagai kemiringan dua garis satu terhadap yang lain dalam sebuah bidang, dan berabad-abad geometri hanya memakai sudut di bawah sudut lurus; gagasan sudut sebagai besarnya *putaran*, yang dapat dijumlahkan, negatif, atau lebih besar dari satu putaran penuh, adalah yang diperlukan trigonometri, rotasi, dan navigasi.

**Mengapa mengukur.** Dua sudut dapat dibandingkan dan dijumlahkan: menaruhnya berdampingan sepanjang sinar bersama memberi jumlahnya. Untuk menyatakan *seberapa besar* diperlukan satuan, dan bagian berikutnya menguraikan satuan, nama sudut menurut besarnya, dan aturan yang menghubungkan sudut satu sama lain serta dengan garis, segi banyak, lingkaran, jam, dan vektor.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- units */
    {
      id: 'units',
      heading: L('How are angles measured in degrees, radians and turns?', 'Bagaimana sudut diukur dalam derajat, radian, dan putaran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A full turn is $360$ degrees, $2\pi$ radians, $400$ gradians or $1$ turn, and every unit is a way of cutting the same turn into equal parts.**

| Unit | Full turn | Right angle | Used for |
|---|---|---|---|
| degree ($^\circ$) | $360$ | $90$ | everyday life, geometry, maps |
| radian (rad) | $2\pi\approx6.283$ | $\frac{\pi}{2}$ | calculus, physics, programming |
| gradian (gon) | $400$ | $100$ | surveying, some calculators |
| turn | $1$ | $\frac14$ | rotations, frequency |

**Degrees.** The degree is $\frac{1}{360}$ of a turn. The number $360$ comes from the Babylonians, who counted in sixties and whose year was close to $360$ days; it is divisible by $24$ numbers, which makes halves, thirds, quarters, fifths, sixths and eighths of a turn whole numbers. A degree is cut into $60$ *minutes* ($1^\circ=60'$) and a minute into $60$ *seconds* ($1'=60''$), as an hour is: $12^\circ30'15''=12+\frac{30}{60}+\frac{15}{3600}=12.504\overline{16}^\circ$. Latitude and longitude on maps are written this way.

**Radians.** One radian is the angle at the center of a circle that cuts an arc as long as the radius. Since the circumference is $2\pi r$, a full turn is $2\pi$ radians, and an angle of $\theta$ radians cuts an arc of length $r\theta$ (see [arcs and sectors](article:circles#arcs-and-sectors) for the circle). Radians make the formulas of calculus clean (the derivative of $\sin x$ is $\cos x$ only when $x$ is in radians), so mathematicians and programming languages use them by default.

**Converting.** Since $180^\circ=\pi$ radians,
$$\text{radians}=\text{degrees}\cdot\frac{\pi}{180},\qquad\text{degrees}=\text{radians}\cdot\frac{180}{\pi}.$$
Common angles: $30^\circ=\frac{\pi}{6}$, $45^\circ=\frac{\pi}{4}$, $60^\circ=\frac{\pi}{3}$, $90^\circ=\frac{\pi}{2}$, $120^\circ=\frac{2\pi}{3}$, $135^\circ=\frac{3\pi}{4}$, $180^\circ=\pi$, $270^\circ=\frac{3\pi}{2}$, $360^\circ=2\pi$. One radian is $\frac{180}{\pi}\approx57.2958^\circ$, and one degree is about $0.017453$ radians.

Type an angle in any unit below, or pick one of the common angles, and read it in all of them, with its name and its complement, supplement and explement (the angle that completes it to $360^\circ$).`,
            T`**Satu putaran penuh adalah $360$ derajat, $2\pi$ radian, $400$ gradian, atau $1$ putaran, dan setiap satuan adalah cara memotong putaran yang sama menjadi bagian-bagian yang sama besar.**

| Satuan | Satu putaran | Sudut siku-siku | Dipakai untuk |
|---|---|---|---|
| derajat ($^\circ$) | $360$ | $90$ | kehidupan sehari-hari, geometri, peta |
| radian (rad) | $2\pi\approx6{,}283$ | $\frac{\pi}{2}$ | kalkulus, fisika, pemrograman |
| gradian (gon) | $400$ | $100$ | survei, beberapa kalkulator |
| putaran | $1$ | $\frac14$ | rotasi, frekuensi |

**Derajat.** Derajat adalah $\frac{1}{360}$ putaran. Bilangan $360$ berasal dari bangsa Babilonia, yang menghitung dalam enam puluhan dan yang tahunnya mendekati $360$ hari; ia habis dibagi $24$ bilangan, sehingga setengah, sepertiga, seperempat, seperlima, seperenam, dan seperdelapan putaran menjadi bilangan bulat. Sebuah derajat dipotong menjadi $60$ *menit* ($1^\circ=60'$) dan sebuah menit menjadi $60$ *detik* ($1'=60''$), seperti pada jam: $12^\circ30'15''=12+\frac{30}{60}+\frac{15}{3600}=12{,}504\overline{16}^\circ$. Lintang dan bujur pada peta ditulis dengan cara ini.

**Radian.** Satu radian adalah sudut di pusat lingkaran yang memotong busur sepanjang jari-jari. Karena kelilingnya $2\pi r$, satu putaran penuh adalah $2\pi$ radian, dan sudut $\theta$ radian memotong busur sepanjang $r\theta$ (lihat [busur dan juring](article:circles#arcs-and-sectors) untuk lingkarannya). Radian membuat rumus kalkulus bersih (turunan $\sin x$ adalah $\cos x$ hanya bila $x$ dalam radian), sehingga matematikawan dan bahasa pemrograman memakainya secara bawaan.

**Mengubah.** Karena $180^\circ=\pi$ radian,
$$\text{radian}=\text{derajat}\cdot\frac{\pi}{180},\qquad\text{derajat}=\text{radian}\cdot\frac{180}{\pi}.$$
Sudut yang umum: $30^\circ=\frac{\pi}{6}$, $45^\circ=\frac{\pi}{4}$, $60^\circ=\frac{\pi}{3}$, $90^\circ=\frac{\pi}{2}$, $120^\circ=\frac{2\pi}{3}$, $135^\circ=\frac{3\pi}{4}$, $180^\circ=\pi$, $270^\circ=\frac{3\pi}{2}$, $360^\circ=2\pi$. Satu radian adalah $\frac{180}{\pi}\approx57{,}2958^\circ$, dan satu derajat sekitar $0{,}017453$ radian.

Ketik sudut dalam satuan apa pun di bawah, atau pilih salah satu sudut yang umum, dan baca dalam semuanya, dengan namanya serta penyiku, pelurus, dan pelengkap penuhnya (sudut yang melengkapinya menjadi $360^\circ$).`,
          ),
        },
        { kind: 'widget', name: 'angleconvert' },
      ],
    },

    /* ------------------------------------------------------------------------- types and pairs */
    {
      id: 'types-and-pairs',
      heading: L('What are the types of angles and the pairs of angles?', 'Apa saja jenis sudut dan pasangan sudut?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Angles are named by their size, and two angles are named as a pair when their sizes are tied by a simple rule.**

| Name | Size |
|---|---|
| zero angle | $0^\circ$ |
| acute | more than $0^\circ$ and less than $90^\circ$ |
| right | exactly $90^\circ$ (drawn with a small square) |
| obtuse | more than $90^\circ$ and less than $180^\circ$ |
| straight | exactly $180^\circ$ (the two sides form a line) |
| reflex | more than $180^\circ$ and less than $360^\circ$ |
| full | exactly $360^\circ$ |

**Pairs.**
- **Complementary angles** add up to $90^\circ$: the complement of $35^\circ$ is $55^\circ$. Only acute angles have a complement.
- **Supplementary angles** add up to $180^\circ$: the supplement of $112^\circ$ is $68^\circ$. The word is *supplement*, not "complement", and the memory aid is *C* before *S* as $90$ before $180$.
- **Explementary** (or conjugate) angles add up to $360^\circ$.
- **Adjacent angles** share a vertex and one side and do not overlap. If their outer sides form a straight line they are a **linear pair**, and a linear pair is supplementary.
- **Vertical angles** are the opposite angles where two lines cross, and **vertical angles are equal**. Proof: if the angles in order around the crossing are $a$, $b$, $a'$, $b'$, then $a+b=180^\circ$ and $b+a'=180^\circ$ (both are linear pairs), so $a=a'$; the same argument shows $b=b'$.

Two lines that cross at a right angle are *perpendicular*. Around a point the angles add up to $360^\circ$, and along a line to $180^\circ$; most of the "find the missing angle" exercises are these two facts and the pairs above, used over and over.`,
            T`**Sudut dinamai menurut besarnya, dan dua sudut dinamai sebagai pasangan bila besarnya terikat oleh aturan sederhana.**

| Nama | Besar |
|---|---|
| sudut nol | $0^\circ$ |
| lancip | lebih dari $0^\circ$ dan kurang dari $90^\circ$ |
| siku-siku | tepat $90^\circ$ (digambar dengan persegi kecil) |
| tumpul | lebih dari $90^\circ$ dan kurang dari $180^\circ$ |
| lurus | tepat $180^\circ$ (kedua sisinya membentuk garis) |
| refleks | lebih dari $180^\circ$ dan kurang dari $360^\circ$ |
| penuh | tepat $360^\circ$ |

**Pasangan.**
- **Sudut berpenyiku** berjumlah $90^\circ$: penyiku $35^\circ$ adalah $55^\circ$. Hanya sudut lancip yang punya penyiku.
- **Sudut berpelurus** berjumlah $180^\circ$: pelurus $112^\circ$ adalah $68^\circ$. Pengingatnya *penyiku* lebih dulu daripada *pelurus* seperti $90$ sebelum $180$.
- **Sudut pelengkap penuh** (atau konjugat) berjumlah $360^\circ$.
- **Sudut bersisian** berbagi titik sudut dan satu sisi dan tidak tumpang tindih. Bila sisi luarnya membentuk garis lurus mereka adalah **pasangan linear**, dan pasangan linear berpelurus.
- **Sudut bertolak belakang** adalah sudut yang berhadapan di tempat dua garis berpotongan, dan **sudut bertolak belakang sama besar**. Buktinya: bila sudut-sudut berurutan di sekitar perpotongan adalah $a$, $b$, $a'$, $b'$, maka $a+b=180^\circ$ dan $b+a'=180^\circ$ (keduanya pasangan linear), sehingga $a=a'$; argumen yang sama menunjukkan $b=b'$.

Dua garis yang berpotongan siku-siku disebut *tegak lurus*. Di sekitar satu titik sudut-sudut berjumlah $360^\circ$, dan sepanjang garis $180^\circ$; kebanyakan latihan "cari sudut yang hilang" adalah kedua fakta ini dan pasangan di atas, dipakai berulang-ulang.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------- parallel lines */
    {
      id: 'parallel-lines',
      heading: L('Which angles are equal when a line crosses two parallel lines?', 'Sudut mana yang sama besar ketika sebuah garis memotong dua garis sejajar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A line, called a *transversal*, that crosses two parallel lines makes eight angles, and they take only two values: an angle $\alpha$ and its supplement $180^\circ-\alpha$.** Number them $1$ to $8$, the first four at the upper line and the other four at the lower line, each time in the order upper left, upper right, lower left, lower right. The *interior* angles are the four between the parallel lines ($3$, $4$, $5$, $6$) and the *exterior* angles the other four.

| Pair | Which | Relation |
|---|---|---|
| corresponding | in the same place at each line: $1$ and $5$, $2$ and $6$, $3$ and $7$, $4$ and $8$ | equal |
| alternate interior | inside, on opposite sides: $3$ and $6$, $4$ and $5$ | equal |
| alternate exterior | outside, on opposite sides: $1$ and $8$, $2$ and $7$ | equal |
| co-interior (same-side interior) | inside, on the same side: $3$ and $5$, $4$ and $6$ | add up to $180^\circ$ |
| co-exterior | outside, on the same side: $1$ and $7$, $2$ and $8$ | add up to $180^\circ$ |
| vertical | opposite at one crossing | equal |
| linear pair | adjacent along a line | add up to $180^\circ$ |

**The theorem and its converse.** *If* the two lines are parallel, corresponding angles are equal, and *if* a transversal makes equal corresponding angles, the two lines are parallel. This is the form in which Euclid's parallel postulate is used (Elements I.27 and I.29), and it is a way to prove lines parallel. The other pairs follow from the corresponding angles and the vertical angles: angle $3$ is vertical to $2$, and $2$ corresponds to $6$, so $3=6$, the alternate interior pair. The same chain gives the others.

**Using it.** Given one angle, all eight are known: if $\angle2=65^\circ$ then $\angle1=\angle4=\angle5=\angle8=115^\circ$ and $\angle3=\angle6=\angle7=65^\circ$. The widget below lets you move the transversal and highlights the pairs of each kind with their values. The same reasoning proves that the angles of a triangle add up to $180^\circ$: draw a parallel to one side through the opposite vertex (see [the angle sum of a triangle](article:triangles#angle-sum)).`,
            T`**Sebuah garis, disebut *garis lintang* (transversal), yang memotong dua garis sejajar membuat delapan sudut, dan mereka hanya bernilai dua: sebuah sudut $\alpha$ dan pelurusnya $180^\circ-\alpha$.** Beri nomor $1$ sampai $8$, empat pertama pada garis atas dan empat lainnya pada garis bawah, setiap kali dengan urutan kiri atas, kanan atas, kiri bawah, kanan bawah. Sudut *dalam* adalah keempat sudut di antara garis sejajar ($3$, $4$, $5$, $6$) dan sudut *luar* keempat lainnya.

| Pasangan | Yang mana | Hubungan |
|---|---|---|
| sehadap | di tempat yang sama pada setiap garis: $1$ dan $5$, $2$ dan $6$, $3$ dan $7$, $4$ dan $8$ | sama besar |
| dalam berseberangan | di dalam, pada sisi berlawanan: $3$ dan $6$, $4$ dan $5$ | sama besar |
| luar berseberangan | di luar, pada sisi berlawanan: $1$ dan $8$, $2$ dan $7$ | sama besar |
| dalam sepihak | di dalam, pada sisi yang sama: $3$ dan $5$, $4$ dan $6$ | berjumlah $180^\circ$ |
| luar sepihak | di luar, pada sisi yang sama: $1$ dan $7$, $2$ dan $8$ | berjumlah $180^\circ$ |
| bertolak belakang | berhadapan pada satu perpotongan | sama besar |
| pasangan linear | bersisian sepanjang garis | berjumlah $180^\circ$ |

**Teorema dan kebalikannya.** *Jika* kedua garis sejajar, sudut sehadap sama besar, dan *jika* sebuah garis lintang membuat sudut sehadap yang sama besar, kedua garis itu sejajar. Inilah bentuk yang dipakai postulat kesejajaran Euklides (Elements I.27 dan I.29), dan ia cara membuktikan garis sejajar. Pasangan lain mengikuti dari sudut sehadap dan sudut bertolak belakang: sudut $3$ bertolak belakang dengan $2$, dan $2$ sehadap dengan $6$, sehingga $3=6$, pasangan dalam berseberangan. Rantai yang sama memberi yang lain.

**Memakainya.** Bila satu sudut diketahui, kedelapannya diketahui: jika $\angle2=65^\circ$ maka $\angle1=\angle4=\angle5=\angle8=115^\circ$ dan $\angle3=\angle6=\angle7=65^\circ$. Widget di bawah memungkinkan kamu menggeser garis lintang dan menyorot pasangan setiap jenis beserta nilainya. Penalaran yang sama membuktikan bahwa sudut-sudut segitiga berjumlah $180^\circ$: gambar garis sejajar salah satu sisi melalui titik sudut di seberangnya (lihat [jumlah sudut segitiga](article:triangles#angle-sum)).`,
          ),
        },
        { kind: 'widget', name: 'angletransversal' },
      ],
    },

    /* --------------------------------------------------------------------------------- polygons */
    {
      id: 'polygon-angles',
      heading: L('What is the sum of the angles of any polygon?', 'Berapa jumlah sudut segi banyak mana pun?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The interior angles of a polygon with $n$ sides add up to $(n-2)\cdot180^\circ$, and its exterior angles add up to $360^\circ$, whatever the shape.**

**Why $(n-2)\cdot180^\circ$.** Choose one vertex and draw all the diagonals from it. They cut the polygon into $n-2$ triangles (a quadrilateral into $2$, a pentagon into $3$), and the angles of the triangles together make up exactly the interior angles of the polygon. Each triangle contributes $180^\circ$. So
$$\text{sum}=(n-2)\cdot180^\circ:\qquad 180^\circ,\ 360^\circ,\ 540^\circ,\ 720^\circ,\ \ldots\ \text{for}\ n=3,4,5,6,\ldots$$
(The triangle gives $180^\circ$ and the quadrilateral $360^\circ$, which are the facts of [the triangle](article:triangles#angle-sum) and [the quadrilateral](article:quadrilaterals#angle-sum).) This works for convex polygons and also for concave ones.

**Exterior angles.** At each vertex the *exterior angle* is the turn you make when you walk around the polygon: it is $180^\circ$ minus the interior angle. After going once around you have turned a full turn, so **the exterior angles add up to $360^\circ$**, for any convex polygon. Check with the interior sum: $n\cdot180^\circ-(n-2)\cdot180^\circ=360^\circ$.

**Regular polygons.** If all the angles are equal, each interior angle is $\frac{(n-2)\cdot180^\circ}{n}$ and each exterior angle is $\frac{360^\circ}{n}$: $60^\circ$ for a triangle, $90^\circ$ for a square, $108^\circ$ for a pentagon, $120^\circ$ for a hexagon, $135^\circ$ for an octagon. Given an angle you can find $n$: a regular polygon with exterior angle $24^\circ$ has $\frac{360}{24}=15$ sides. A polygon has $\frac{n(n-3)}{2}$ diagonals.

**Tiling.** Copies of a regular polygon fit around a point without a gap exactly when the interior angle divides $360^\circ$. That happens for the triangle ($6$ around a point), the square ($4$) and the hexagon ($3$) only, which is why bathroom tiles are squares, triangles or hexagons, and why a honeycomb is hexagonal. Slide the number of sides below.`,
            T`**Sudut-sudut dalam segi banyak dengan $n$ sisi berjumlah $(n-2)\cdot180^\circ$, dan sudut luarnya berjumlah $360^\circ$, apa pun bentuknya.**

**Mengapa $(n-2)\cdot180^\circ$.** Pilih satu titik sudut dan gambar semua diagonal dari situ. Mereka memotong segi banyak menjadi $n-2$ segitiga (segiempat menjadi $2$, segilima menjadi $3$), dan sudut-sudut segitiga itu bersama-sama tepat membentuk sudut dalam segi banyak. Setiap segitiga menyumbang $180^\circ$. Jadi
$$\text{jumlah}=(n-2)\cdot180^\circ:\qquad 180^\circ,\ 360^\circ,\ 540^\circ,\ 720^\circ,\ \ldots\ \text{untuk}\ n=3,4,5,6,\ldots$$
(Segitiga memberi $180^\circ$ dan segiempat $360^\circ$, yang merupakan fakta [segitiga](article:triangles#angle-sum) dan [segiempat](article:quadrilaterals#angle-sum).) Ini berlaku untuk segi banyak cembung dan juga yang cekung.

**Sudut luar.** Pada setiap titik sudut, *sudut luar* adalah belokan yang kamu buat ketika berjalan mengelilingi segi banyak: ia $180^\circ$ dikurangi sudut dalam. Setelah mengelilinginya sekali kamu telah berbelok satu putaran penuh, sehingga **sudut luar berjumlah $360^\circ$**, untuk segi banyak cembung mana pun. Periksa dengan jumlah sudut dalam: $n\cdot180^\circ-(n-2)\cdot180^\circ=360^\circ$.

**Segi banyak beraturan.** Bila semua sudutnya sama, setiap sudut dalam adalah $\frac{(n-2)\cdot180^\circ}{n}$ dan setiap sudut luar $\frac{360^\circ}{n}$: $60^\circ$ untuk segitiga, $90^\circ$ untuk persegi, $108^\circ$ untuk segilima, $120^\circ$ untuk segienam, $135^\circ$ untuk segidelapan. Dari sebuah sudut kamu dapat mencari $n$: segi banyak beraturan dengan sudut luar $24^\circ$ memiliki $\frac{360}{24}=15$ sisi. Sebuah segi banyak memiliki $\frac{n(n-3)}{2}$ diagonal.

**Pengubinan.** Salinan segi banyak beraturan muat mengelilingi satu titik tanpa celah tepat ketika sudut dalamnya membagi $360^\circ$. Itu terjadi hanya untuk segitiga ($6$ di sekeliling satu titik), persegi ($4$), dan segienam ($3$), itulah sebabnya ubin kamar mandi berupa persegi, segitiga, atau segienam, dan sarang lebah berbentuk segienam. Geser banyak sisi di bawah.`,
          ),
        },
        { kind: 'widget', name: 'anglepolygon' },
      ],
    },

    /* ----------------------------------------------------------------------------------- circle */
    {
      id: 'arc-and-angle',
      heading: L('How is an angle related to an arc of a circle?', 'Bagaimana sudut berhubungan dengan busur lingkaran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**An angle at the center of a circle is the fraction of the turn that its arc takes, and every length and area of the slice is that fraction of the whole.** If the central angle is $\theta$ radians, the arc has length $r\theta$, the sector has area $\frac12r^2\theta$ and the chord joining the ends has length $2r\sin\frac\theta2$. That the arc divided by the radius gives the angle is the definition of the radian.

An angle with its vertex *on* the circle, between two chords, is an *inscribed angle*. For the chord $AB$ with a central angle of $\theta$, the inscribed angle at a point $P$ outside the arc from $A$ to $B$ is always $\frac\theta2$, wherever $P$ moves, and at a point on that arc it is $180^\circ-\frac\theta2$. When $AB$ is a diameter ($\theta=180^\circ$) the inscribed angle is always $90^\circ$ (Thales). The proofs and more theorems are in [the angle theorems of a circle](article:circles#angle-theorems).

The widget below measures the angle at $P$ from the coordinates of the points, with no theorem, and compares it with half the central angle: they agree wherever you drag $P$. It also gives the arc, sector and chord for a radius you type.`,
            T`**Sudut di pusat lingkaran adalah pecahan putaran yang diambil busurnya, dan setiap panjang dan luas irisan itu adalah pecahan tersebut dari keseluruhan.** Jika sudut pusatnya $\theta$ radian, busurnya sepanjang $r\theta$, juringnya seluas $\frac12r^2\theta$ dan tali busur yang menghubungkan ujungnya sepanjang $2r\sin\frac\theta2$. Bahwa busur dibagi jari-jari memberi sudut adalah definisi radian.

Sudut dengan titik sudut *pada* lingkaran, di antara dua tali busur, adalah *sudut keliling*. Untuk tali busur $AB$ dengan sudut pusat $\theta$, sudut keliling di titik $P$ di luar busur dari $A$ ke $B$ selalu $\frac\theta2$, ke mana pun $P$ bergerak, dan di titik pada busur itu ia $180^\circ-\frac\theta2$. Bila $AB$ adalah diameter ($\theta=180^\circ$) sudut kelilingnya selalu $90^\circ$ (Thales). Bukti dan teorema lainnya ada di [teorema sudut pada lingkaran](article:circles#angle-theorems).

Widget di bawah mengukur sudut di $P$ dari koordinat titik-titiknya, tanpa teorema, dan membandingkannya dengan setengah sudut pusat: keduanya sesuai ke mana pun kamu menyeret $P$. Ia juga memberi busur, juring, dan tali busur untuk jari-jari yang kamu ketik.`,
          ),
        },
        { kind: 'widget', name: 'anglecircle' },
      ],
    },

    /* ----------------------------------------------------------------------------------- clock */
    {
      id: 'clock-angles',
      heading: L('How do the hands of a clock make angles?', 'Bagaimana jarum jam membentuk sudut?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The minute hand turns $6^\circ$ every minute and the hour hand $0.5^\circ$ every minute, so at $h$ hours and $m$ minutes the angle between them is $|30h-5.5m|$, and if that is more than $180^\circ$ the angle is $360^\circ$ minus it.** Measure each hand clockwise from the $12$. The hour hand is at $30h+0.5m$ degrees: $30^\circ$ for each hour, plus the share of the next hour that has passed. The minute hand is at $6m$ degrees. Their difference is
$$|30h+0.5m-6m|=|30h-5.5m|.$$
Examples: at $3{:}00$ it is $|90-0|=90^\circ$; at $2{:}30$ it is $|60-165|=105^\circ$; at $12{:}30$ it is $|0-165|=165^\circ$; at $6{:}00$ it is $180^\circ$.

**How often.** The minute hand gains $5.5^\circ$ a minute on the hour hand, so it laps it every $\frac{360}{5.5}=65\frac{5}{11}$ minutes: the hands overlap $11$ times in twelve hours, first at $1{:}05{:}27\frac3{11}$ (and not at $1{:}05$ exactly), then at $2{:}10{:}54\frac6{11}$, and so on, and the eleventh overlap is at $12{:}00$ again. The relative angle runs through all values from $0^\circ$ to $360^\circ$ eleven times in twelve hours, so any angle strictly between $0^\circ$ and $180^\circ$ occurs $22$ times (twice per lap, once with each hand ahead): **the hands are at right angles $22$ times in twelve hours, $44$ times a day**, and exactly opposite $11$ times. The right angles are at $3{:}00$ and $9{:}00$ and at twenty other, awkward times such as $12{:}16{:}21\frac{9}{11}$.

Move the hands below, and choose an angle to see all the times at which the hands make it, to the exact fraction of a second (click a time to set the clock).`,
            T`**Jarum menit berputar $6^\circ$ setiap menit dan jarum jam $0{,}5^\circ$ setiap menit, sehingga pada jam $h$ dan menit $m$ sudut di antaranya adalah $|30h-5{,}5m|$, dan bila itu lebih dari $180^\circ$ sudutnya adalah $360^\circ$ dikurangi itu.** Ukur setiap jarum searah jarum jam dari angka $12$. Jarum jam berada pada $30h+0{,}5m$ derajat: $30^\circ$ untuk setiap jam, ditambah bagian jam berikutnya yang telah berlalu. Jarum menit berada pada $6m$ derajat. Selisihnya
$$|30h+0{,}5m-6m|=|30h-5{,}5m|.$$
Contoh: pada $3{:}00$ nilainya $|90-0|=90^\circ$; pada $2{:}30$ nilainya $|60-165|=105^\circ$; pada $12{:}30$ nilainya $|0-165|=165^\circ$; pada $6{:}00$ nilainya $180^\circ$.

**Seberapa sering.** Jarum menit mendahului jarum jam $5{,}5^\circ$ per menit, sehingga ia menyusulnya setiap $\frac{360}{5{,}5}=65\frac{5}{11}$ menit: kedua jarum bertumpuk $11$ kali dalam dua belas jam, pertama pada $1{:}05{:}27\frac3{11}$ (dan bukan tepat $1{:}05$), lalu pada $2{:}10{:}54\frac6{11}$, dan seterusnya, dan tumpukan kesebelas adalah pada $12{:}00$ lagi. Sudut relatifnya melewati semua nilai dari $0^\circ$ sampai $360^\circ$ sebanyak sebelas kali dalam dua belas jam, sehingga setiap sudut yang benar-benar di antara $0^\circ$ dan $180^\circ$ terjadi $22$ kali (dua kali per putaran, sekali dengan masing-masing jarum di depan): **kedua jarum membentuk sudut siku-siku $22$ kali dalam dua belas jam, $44$ kali sehari**, dan tepat berlawanan $11$ kali. Sudut siku-siku itu terjadi pada $3{:}00$ dan $9{:}00$ dan pada dua puluh waktu lain yang janggal seperti $12{:}16{:}21\frac{9}{11}$.

Geser jarum di bawah, dan pilih sebuah sudut untuk melihat semua waktu ketika jarum membentuknya, sampai pecahan detik yang tepat (klik sebuah waktu untuk mengatur jam).`,
          ),
        },
        { kind: 'widget', name: 'angleclock' },
      ],
    },

    /* ------------------------------------------------------------------------------ directions */
    {
      id: 'directions',
      heading: L('How do compass bearings relate to the angles of mathematics?', 'Bagaimana bearing kompas berhubungan dengan sudut matematika?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A compass bearing is an angle measured clockwise from north, while a mathematical angle is measured counterclockwise from east, so the two are related by bearing $=90^\circ-\theta$ (modulo $360^\circ$).** Mathematics puts angle $0^\circ$ along the positive $x$-axis (east) and turns toward $y$ (north). Navigators and surveyors start at north and turn the way a compass needle's markings run, clockwise. The conversion is a reflection and a shift:

| Direction | Mathematical angle | Bearing |
|---|---|---|
| east | $0^\circ$ | $90^\circ$ |
| north | $90^\circ$ | $0^\circ$ |
| west | $180^\circ$ | $270^\circ$ |
| south | $270^\circ$ | $180^\circ$ |
| northwest | $135^\circ$ | $315^\circ$ |

The sixteen points of the compass are $22.5^\circ$ apart: N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW. A bearing is usually written with three digits ($045^\circ$), and a *back bearing* (the reverse direction) is the bearing plus or minus $180^\circ$. Programs that draw on screens add a third convention: screen $y$ grows *downward*, so a counterclockwise angle needs its sine negated.

The second mode of the widget at the end of the next section converts between the two systems and gives the compass name.`,
            T`**Bearing kompas adalah sudut yang diukur searah jarum jam dari utara, sedangkan sudut matematika diukur berlawanan arah jarum jam dari timur, sehingga keduanya berhubungan dengan bearing $=90^\circ-\theta$ (modulo $360^\circ$).** Matematika menaruh sudut $0^\circ$ sepanjang sumbu-$x$ positif (timur) dan berputar menuju $y$ (utara). Navigator dan juru ukur mulai dari utara dan berputar searah jarum jam. Konversinya adalah pencerminan dan pergeseran:

| Arah | Sudut matematika | Bearing |
|---|---|---|
| timur | $0^\circ$ | $90^\circ$ |
| utara | $90^\circ$ | $0^\circ$ |
| barat | $180^\circ$ | $270^\circ$ |
| selatan | $270^\circ$ | $180^\circ$ |
| barat laut | $135^\circ$ | $315^\circ$ |

Enam belas titik kompas berjarak $22{,}5^\circ$: N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW. Bearing biasanya ditulis dengan tiga angka ($045^\circ$), dan *bearing balik* (arah sebaliknya) adalah bearing ditambah atau dikurangi $180^\circ$. Program yang menggambar di layar menambah konvensi ketiga: $y$ layar bertambah ke *bawah*, sehingga sudut berlawanan arah jarum jam memerlukan sinus yang dinegasikan.

Mode kedua widget di akhir bagian berikutnya mengubah di antara kedua sistem dan memberi nama kompasnya.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------- vectors */
    {
      id: 'between-lines-and-vectors',
      heading: L('How do you find the angle between two lines or two vectors?', 'Bagaimana mencari sudut antara dua garis atau dua vektor?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Between two vectors the angle comes from the dot product, $\cos\theta=\frac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$, and between two lines from their slopes, $\tan\theta=\left|\frac{m_1-m_2}{1+m_1m_2}\right|$.**

**Vectors.** For $\mathbf a=(a_1,a_2)$ and $\mathbf b=(b_1,b_2)$ the dot product is $a_1b_1+a_2b_2=|\mathbf a||\mathbf b|\cos\theta$ and the cross product $a_1b_2-a_2b_1=|\mathbf a||\mathbf b|\sin\theta$. The sign of the dot product tells the kind of angle: positive for acute, zero for a right angle, negative for obtuse. Dividing gives $\tan\theta$, which is why the angle can be computed as
$$\theta=\operatorname{atan2}\bigl(|a_1b_2-a_2b_1|,\ a_1b_1+a_2b_2\bigr)$$
with no division and no square roots. Many programs instead write $\theta=\arccos\frac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$, which is right on paper but loses precision in floating point: the cosine of a tiny angle is $1$ to sixteen digits, so for $\theta=10^{-8}$ the arc cosine gets $\cos\theta=1$ exactly and answers $0$, and near $180^\circ$ it answers exactly $180^\circ$ (see [floating-point numbers](article:floating-point-numbers#cancellation)). Without the absolute value, the same expression is the *directed* angle in $(-180^\circ,180^\circ]$, positive counterclockwise.

**Lines.** A line with slope $m$ makes the angle $\arctan m$ with the $x$-axis, so the angle between two lines is $\theta_1-\theta_2$, and the formula for the tangent of a difference gives $\tan\theta=\frac{m_1-m_2}{1+m_1m_2}$. The lines are perpendicular exactly when $m_1m_2=-1$, and parallel when $m_1=m_2$. For example the lines with slopes $1$ and $-1$ meet at $90^\circ$, and slopes $0$ and $\sqrt3$ at $60^\circ$. A vertical line has no slope: use its direction vector instead.

Try two vectors below: the presets include an angle of $10^{-8}$ radians, where the two formulas differ.`,
            T`**Antara dua vektor sudut berasal dari hasil kali titik, $\cos\theta=\frac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$, dan antara dua garis dari gradiennya, $\tan\theta=\left|\frac{m_1-m_2}{1+m_1m_2}\right|$.**

**Vektor.** Untuk $\mathbf a=(a_1,a_2)$ dan $\mathbf b=(b_1,b_2)$ hasil kali titiknya $a_1b_1+a_2b_2=|\mathbf a||\mathbf b|\cos\theta$ dan hasil kali silangnya $a_1b_2-a_2b_1=|\mathbf a||\mathbf b|\sin\theta$. Tanda hasil kali titik menunjukkan jenis sudutnya: positif untuk lancip, nol untuk siku-siku, negatif untuk tumpul. Membaginya memberi $\tan\theta$, itulah sebabnya sudut dapat dihitung sebagai
$$\theta=\operatorname{atan2}\bigl(|a_1b_2-a_2b_1|,\ a_1b_1+a_2b_2\bigr)$$
tanpa pembagian dan tanpa akar. Banyak program sebaliknya menulis $\theta=\arccos\frac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$, yang benar di atas kertas tetapi kehilangan presisi dalam titik mengambang: kosinus sudut yang sangat kecil adalah $1$ sampai enam belas angka, sehingga untuk $\theta=10^{-8}$ arc kosinus mendapat $\cos\theta=1$ persis dan menjawab $0$, dan di dekat $180^\circ$ ia menjawab persis $180^\circ$ (lihat [bilangan titik mengambang](article:floating-point-numbers#cancellation)). Tanpa nilai mutlak, ungkapan yang sama adalah sudut *berarah* dalam $(-180^\circ,180^\circ]$, positif berlawanan arah jarum jam.

**Garis.** Garis dengan gradien $m$ membuat sudut $\arctan m$ dengan sumbu-$x$, sehingga sudut antara dua garis adalah $\theta_1-\theta_2$, dan rumus tangen selisih memberi $\tan\theta=\frac{m_1-m_2}{1+m_1m_2}$. Garis-garis itu tegak lurus tepat ketika $m_1m_2=-1$, dan sejajar ketika $m_1=m_2$. Misalnya garis dengan gradien $1$ dan $-1$ bertemu pada $90^\circ$, dan gradien $0$ dan $\sqrt3$ pada $60^\circ$. Garis tegak tidak punya gradien: pakai vektor arahnya.

Coba dua vektor di bawah: prasetnya mencakup sudut $10^{-8}$ radian, ketika kedua rumus berbeda.`,
          ),
        },
        { kind: 'widget', name: 'anglevector' },
      ],
    },

    /* ----------------------------------------------------------------------------------- in code */
    {
      id: 'angles-in-code',
      heading: L('How do you work with angles in Python, JavaScript and C++?', 'Bagaimana bekerja dengan sudut di Python, JavaScript, dan C++?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Programs measure angles in radians, so convert degrees first, normalize results into a fixed range, and use ´atan2´ rather than ´acos´ for the angle between vectors.** The trigonometric functions of every language (´sin´, ´cos´, ´tan´) take radians, so ´sin(30)´ is the sine of $30$ radians, not of $30^\circ$. The remainder operator needs care: Python's ´%´ always gives a result with the sign of the divisor, so ´-30 % 360´ is ´330´; JavaScript's and C++'s keep the sign of the dividend, so ´-30 % 360´ is ´-30´ and you add $360$ and take the remainder again (C++ uses ´fmod´ for decimals). And since a radian measure is a floating-point number, ´sin(π)´ is not $0$ but about $1.2\times10^{-16}$. The Python program below normalizes angles, finds the angle between vectors both ways, the angle between clock hands, the sum of the angles of polygons and a compass bearing. The JavaScript and C++ programs do the same in their way.`,
            T`**Program mengukur sudut dalam radian, jadi ubah derajat lebih dulu, normalkan hasilnya ke rentang tetap, dan pakai ´atan2´ bukan ´acos´ untuk sudut antara vektor.** Fungsi trigonometri setiap bahasa (´sin´, ´cos´, ´tan´) menerima radian, sehingga ´sin(30)´ adalah sinus $30$ radian, bukan $30^\circ$. Operator sisa perlu hati-hati: ´%´ Python selalu memberi hasil bertanda sama dengan pembagi, sehingga ´-30 % 360´ adalah ´330´; milik JavaScript dan C++ mempertahankan tanda yang dibagi, sehingga ´-30 % 360´ adalah ´-30´ dan kamu menambah $360$ dan mengambil sisa lagi (C++ memakai ´fmod´ untuk desimal). Dan karena ukuran radian adalah bilangan titik mengambang, ´sin(π)´ bukan $0$ melainkan sekitar $1{,}2\times10^{-16}$. Program Python di bawah menormalkan sudut, mencari sudut antara vektor dengan kedua cara, sudut antara jarum jam, jumlah sudut segi banyak, dan bearing kompas. Program JavaScript dan C++ melakukan hal yang sama dengan caranya.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: normalize, angle between vectors, clock and polygon', 'Python: normalisasi, sudut antara vektor, jam, dan segi banyak'),
          code: `import math
from fractions import Fraction


def normalize(deg):
    """The same direction as an angle in [0, 360): Python's % already gives a non-negative result."""
    return deg % 360


def angle_between(a, b):
    """The angle between two 2D vectors in degrees, from atan2: accurate for every angle."""
    cross = a[0] * b[1] - a[1] * b[0]
    dot = a[0] * b[0] + a[1] * b[1]
    return math.degrees(math.atan2(abs(cross), dot))


def angle_between_acos(a, b):
    c = (a[0] * b[0] + a[1] * b[1]) / (math.hypot(*a) * math.hypot(*b))
    return math.degrees(math.acos(max(-1.0, min(1.0, c))))


def clock_angle(h, m):
    """The angle between the hands at h:m, from 0 to 180 degrees."""
    d = abs(30 * (h % 12) - 5.5 * m) % 360
    return min(d, 360 - d)


def interior_sum(n):
    return (n - 2) * 180


def bearing(math_angle):
    """Compass bearing (clockwise from north) of a direction given counterclockwise from east."""
    return (90 - math_angle) % 360


print(normalize(-30), normalize(725), normalize(360))
print(angle_between((1, 0), (1, 1)), angle_between((1, 0), (0, 2)), angle_between((1, 0), (-1, 0)))
print(angle_between((1, 0), (1, 1e-8)), angle_between_acos((1, 0), (1, 1e-8)))
print(clock_angle(3, 0), clock_angle(2, 30), clock_angle(12, 30), clock_angle(6, 0))
print([interior_sum(n) for n in (3, 4, 5, 6, 10)], [(n - 2) * 180 / n for n in (3, 4, 5, 6, 8, 12)])
print(math.degrees(math.pi / 6), math.radians(180), Fraction(150, 180))
print(bearing(0), bearing(90), bearing(135), bearing(-90))
print(math.sin(math.radians(30)), math.cos(math.radians(60)), math.sin(math.pi))
# 330 5 0
# 45.0 90.0 180.0
# 5.729577951308232e-07 0.0
# 90.0 105.0 165.0 180.0
# [180, 360, 540, 720, 1440] [60.0, 90.0, 108.0, 120.0, 135.0, 150.0]
# 29.999999999999996 3.141592653589793 5/6
# 90 0 315 180
# 0.49999999999999994 0.5000000000000001 1.2246467991473532e-16`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the sign of %, atan2 and the arc cosine', 'JavaScript: tanda %, atan2, dan arc kosinus'),
          code: `const toDeg = (r) => (r * 180) / Math.PI
const normalize = (d) => ((d % 360) + 360) % 360          // JavaScript's % keeps the sign of d, so fix it
const angleBetween = (a, b) => toDeg(Math.atan2(Math.abs(a[0] * b[1] - a[1] * b[0]), a[0] * b[0] + a[1] * b[1]))
const angleBetweenAcos = (a, b) => toDeg(Math.acos((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b))))
;[-30 % 360, normalize(-30), normalize(725), normalize(360)]       // [-30, 330, 5, 0]
;[angleBetween([1, 0], [1, 1]), angleBetween([1, 0], [0, 2])]      // [45, 90]
angleBetween([1, 0], [1, 1e-8])                                    // 5.729577951308232e-7
angleBetweenAcos([1, 0], [1, 1e-8])                                // 0: the arc cosine lost the angle
angleBetween([1, 0], [-1, 1e-8])                                   // 179.9999994270422
angleBetweenAcos([1, 0], [-1, 1e-8])                               // 180
const clockAngle = (h, m) => { const d = Math.abs(30 * (h % 12) - 5.5 * m) % 360; return Math.min(d, 360 - d) }
;[clockAngle(3, 0), clockAngle(2, 30), clockAngle(12, 30)]         // [90, 105, 165]
const bearing = (mathAngle) => normalize(90 - mathAngle)
;[bearing(0), bearing(90), bearing(135)]                           // [90, 0, 315]
;[Math.sin(Math.PI / 6), Math.sin(30)]                             // [0.49999999999999994, -0.9880316240928618]: sin takes radians
;[Math.atan2(1, 1), Math.atan2(-1, -1)].map(toDeg)                 // [45, -135]: atan2 knows the quadrant, atan does not`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the angle between vectors, clock hands and normalizing', 'C++: sudut antara vektor, jarum jam, dan normalisasi'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

const double PI = 3.14159265358979323846;

double degrees(double rad) { return rad * 180.0 / PI; }

double angleBetween(double ax, double ay, double bx, double by) {
  double cross = ax * by - ay * bx;
  double dot = ax * bx + ay * by;
  return degrees(atan2(fabs(cross), dot));
}

double clockAngle(int h, int m) {
  double d = fabs(30.0 * (h % 12) - 5.5 * m);
  while (d >= 360) d -= 360;
  return d > 180 ? 360 - d : d;
}

int main() {
  printf("%.1f\\n", angleBetween(1, 0, 1, 1));
  printf("%.1f\\n", angleBetween(1, 0, 0, 2));
  printf("%.1f %.1f %.1f\\n", clockAngle(3, 0), clockAngle(2, 30), clockAngle(12, 30));
  printf("%d\\n", (5 - 2) * 180);                               // the angles of a pentagon
  double a = -30;
  printf("%.1f\\n", a - 360.0 * floor(a / 360.0));              // for decimals: subtract whole turns, rounding down
  return 0;
}

/* output:
45.0
90.0
90.0 105.0 165.0
540
330.0
*/`,
        },
      ],
    },

    /* --------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do the degree and the angle come from?', 'Dari mana derajat dan sudut berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The $360^\circ$ circle is Babylonian, the theory of angles is Greek, and the radian is a modern idea.**

- **By the first millennium BC.** Babylonian astronomers, counting in base $60$, divided the circle into $360$ parts, close to the number of days in the year, and their sixtieths are the minutes and seconds we still use for angles and for time.
- **About 300 BC.** Euclid's *Elements* defines the plane angle and the right angle, proves that vertical angles are equal, states the parallel postulate and proves that a transversal of parallel lines makes equal alternate angles (Book I).
- **About 150 BC.** Hipparchus compiled the first table of chords, the ancestor of the sine table, dividing the circle into $360^\circ$ in the Greek world; Ptolemy used it in the *Almagest* (about 150 AD).
- **About 500 AD.** Indian astronomers, such as Aryabhata, replaced chords by half-chords, the sine, which led to the trigonometry used today.
- **1714.** Roger Cotes described measuring an angle by the arc it cuts on a circle of radius $1$, the idea of the radian, without giving it a name.
- **1790s.** The French metric system proposed dividing the right angle into $100$ grades (gradians, now gons), still used in surveying.
- **1873.** The name *radian* appeared in print, credited to the Irish engineer James Thomson, the brother of Lord Kelvin.
- **1900s–today.** Angles became rotations: the unit of calculus, of complex numbers ($e^{i\theta}$), of computer graphics and robotics, and of the turn used for frequency.`,
            T`**Lingkaran $360^\circ$ berasal dari Babilonia, teori sudut dari Yunani, dan radian adalah gagasan modern.**

- **Pada milenium pertama SM.** Astronom Babilonia, menghitung dalam basis $60$, membagi lingkaran menjadi $360$ bagian, dekat dengan banyak hari dalam setahun, dan seperenam puluhnya adalah menit dan detik yang masih kita pakai untuk sudut dan waktu.
- **Sekitar 300 SM.** *Elements* Euklides mendefinisikan sudut bidang dan sudut siku-siku, membuktikan bahwa sudut bertolak belakang sama besar, menyatakan postulat kesejajaran, dan membuktikan bahwa garis lintang pada garis sejajar membuat sudut berseberangan yang sama (Buku I).
- **Sekitar 150 SM.** Hipparchus menyusun tabel tali busur pertama, leluhur tabel sinus, membagi lingkaran menjadi $360^\circ$ di dunia Yunani; Ptolemeus memakainya dalam *Almagest* (sekitar 150 M).
- **Sekitar 500 M.** Astronom India, seperti Aryabhata, mengganti tali busur dengan setengah tali busur, yaitu sinus, yang mengarah ke trigonometri yang dipakai sekarang.
- **1714.** Roger Cotes menguraikan pengukuran sudut dengan busur yang dipotongnya pada lingkaran berjari-jari $1$, gagasan radian, tanpa memberinya nama.
- **1790-an.** Sistem metrik Prancis mengusulkan membagi sudut siku-siku menjadi $100$ grade (gradian, kini gon), yang masih dipakai dalam survei.
- **1873.** Nama *radian* muncul dalam cetakan, dikaitkan dengan insinyur Irlandia James Thomson, saudara Lord Kelvin.
- **1900-an–kini.** Sudut menjadi rotasi: satuan kalkulus, bilangan kompleks ($e^{i\theta}$), grafika komputer dan robotika, dan putaran yang dipakai untuk frekuensi.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with angles?', 'Apa kesalahan umum pada sudut?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with angles are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Mix up complementary and supplementary | Complementary adds up to $90^\circ$ (C before S, $90$ before $180$), supplementary to $180^\circ$. |
| ❌ Call $90^\circ$ or $180^\circ$ acute or obtuse | An acute angle is below $90^\circ$ and an obtuse one is between $90^\circ$ and $180^\circ$; $90^\circ$ is right and $180^\circ$ is straight. |
| ❌ Alternate and co-interior angles are always equal | Alternate interior angles are equal, co-interior angles add up to $180^\circ$, and only if the two lines are parallel. |
| ❌ The angles of a polygon add up to $n\cdot180^\circ$ | They add up to $(n-2)\cdot180^\circ$, because $n-2$ triangles fill the polygon. |
| ❌ The exterior angles grow with the number of sides | They always add up to $360^\circ$; each exterior angle of a regular polygon is $\frac{360^\circ}{n}$. |
| ❌ At $2{:}30$ the clock hands are at $120^\circ$ or $90^\circ$ | The hour hand has moved halfway to the 3: the angle is $|30\cdot2-5.5\cdot30|=105^\circ$. |
| ❌ Use ´sin(30)´ for the sine of $30^\circ$ in a program | Functions take radians: convert first, ´sin(radians(30))´. |
| ❌ Find an angle with ´acos´ of the normalized dot product | It fails for tiny angles and can give NaN for rounding above 1; use ´atan2(abs(cross), dot)´. |
| ❌ Use $\theta$ as a compass bearing as it is | A bearing is clockwise from north: bearing $=90^\circ-\theta$ (modulo $360^\circ$). |`,
            T`**Kesalahan paling umum pada sudut adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Tertukar antara berpenyiku dan berpelurus | Berpenyiku berjumlah $90^\circ$ (penyiku sebelum pelurus, $90$ sebelum $180$), berpelurus $180^\circ$. |
| ❌ Menyebut $90^\circ$ atau $180^\circ$ lancip atau tumpul | Sudut lancip di bawah $90^\circ$ dan sudut tumpul di antara $90^\circ$ dan $180^\circ$; $90^\circ$ adalah siku-siku dan $180^\circ$ adalah lurus. |
| ❌ Sudut berseberangan dan sepihak selalu sama besar | Sudut dalam berseberangan sama besar, sudut dalam sepihak berjumlah $180^\circ$, dan hanya jika kedua garis sejajar. |
| ❌ Sudut-sudut segi banyak berjumlah $n\cdot180^\circ$ | Mereka berjumlah $(n-2)\cdot180^\circ$, karena $n-2$ segitiga mengisi segi banyak itu. |
| ❌ Sudut luar membesar seiring banyaknya sisi | Mereka selalu berjumlah $360^\circ$; setiap sudut luar segi banyak beraturan adalah $\frac{360^\circ}{n}$. |
| ❌ Pada $2{:}30$ jarum jam membentuk $120^\circ$ atau $90^\circ$ | Jarum jam sudah bergerak setengah jalan ke angka 3: sudutnya $|30\cdot2-5{,}5\cdot30|=105^\circ$. |
| ❌ Memakai ´sin(30)´ untuk sinus $30^\circ$ dalam program | Fungsi menerima radian: ubah dulu, ´sin(radians(30))´. |
| ❌ Mencari sudut dengan ´acos´ hasil kali titik ternormalisasi | Ia gagal untuk sudut kecil dan dapat memberi NaN karena pembulatan di atas 1; pakai ´atan2(abs(cross), dot)´. |
| ❌ Memakai $\theta$ sebagai bearing kompas apa adanya | Bearing searah jarum jam dari utara: bearing $=90^\circ-\theta$ (modulo $360^\circ$). |`,
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
              L(T`An acute angle is smaller than $90^\circ$.`, T`Sudut lancip lebih kecil daripada $90^\circ$.`),
              L(T`Vertical angles are equal.`, T`Sudut bertolak belakang sama besar.`),
              L(T`Supplementary angles add up to $90^\circ$.`, T`Sudut berpelurus berjumlah $90^\circ$.`),
              L(T`The interior angles of a hexagon add up to $720^\circ$.`, T`Sudut dalam segienam berjumlah $720^\circ$.`),
              L(T`A transversal of two parallel lines makes equal alternate interior angles.`, T`Garis lintang pada dua garis sejajar membuat sudut dalam berseberangan yang sama besar.`),
              L(T`At $3{:}00$ the angle between the clock hands is $30^\circ$.`, T`Pada $3{:}00$ sudut antara jarum jam adalah $30^\circ$.`),
            ],
            answer: [true, true, false, true, true, false],
            explain: L(
              T`Supplementary angles add up to $180^\circ$ (complementary ones to $90^\circ$). A hexagon has $(6-2)\cdot180^\circ=720^\circ$. At $3{:}00$ the minute hand is at the $12$ and the hour hand at the $3$, a quarter turn: $90^\circ$.`,
              T`Sudut berpelurus berjumlah $180^\circ$ (yang berpenyiku $90^\circ$). Segienam memiliki $(6-2)\cdot180^\circ=720^\circ$. Pada $3{:}00$ jarum menit di angka $12$ dan jarum jam di angka $3$, seperempat putaran: $90^\circ$.`,
            ),
            hint: L(T`Recall the definitions of the pairs and the formula for polygons.`, T`Ingat definisi pasangan dan rumus segi banyak.`),
          },
        },
        {
          kind: 'activity',
          title: L('Equal angles at a transversal', 'Sudut sama besar pada garis lintang'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`A line crosses two parallel lines. Which kinds of pairs are equal? Choose **all** that apply.`, T`Sebuah garis memotong dua garis sejajar. Pasangan jenis mana yang sama besar? Pilih **semua** yang benar.`),
            options: [
              L(T`corresponding angles`, T`sudut sehadap`),
              L(T`alternate interior angles`, T`sudut dalam berseberangan`),
              L(T`co-interior (same-side interior) angles`, T`sudut dalam sepihak`),
              L(T`vertical angles`, T`sudut bertolak belakang`),
              L(T`a linear pair`, T`pasangan linear`),
            ],
            answer: [0, 1, 3],
            explain: L(T`Corresponding, alternate and vertical pairs are equal. Co-interior angles and a linear pair add up to $180^\circ$, so they are equal only when both are $90^\circ$.`, T`Pasangan sehadap, berseberangan, dan bertolak belakang sama besar. Sudut dalam sepihak dan pasangan linear berjumlah $180^\circ$, sehingga sama besar hanya bila keduanya $90^\circ$.`),
            hint: L(T`Which pairs add up to $180^\circ$ instead?`, T`Pasangan mana yang justru berjumlah $180^\circ$?`),
          },
        },
        {
          kind: 'activity',
          title: L('A complement', 'Sebuah penyiku'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`Complementary angles add up to $90^\circ$.`, T`Sudut berpenyiku berjumlah $90^\circ$.`), L(T`$90-35$.`, T`$90-35$.`)],
            explain: L(T`$90^\circ-35^\circ=55^\circ$.`, T`$90^\circ-35^\circ=55^\circ$.`),
            prompt: L(T`What is the complement of $35^\circ$, in degrees?`, T`Berapa penyiku $35^\circ$, dalam derajat?`),
            given: String.raw`c=v`,
            blanks: [{ label: 'c =', answer: 55 }],
          },
        },
        {
          kind: 'activity',
          title: L('A supplement', 'Sebuah pelurus'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`Supplementary angles add up to $180^\circ$.`, T`Sudut berpelurus berjumlah $180^\circ$.`), L(T`$180-112$.`, T`$180-112$.`)],
            explain: L(T`$180^\circ-112^\circ=68^\circ$.`, T`$180^\circ-112^\circ=68^\circ$.`),
            prompt: L(T`What is the supplement of $112^\circ$, in degrees?`, T`Berapa pelurus $112^\circ$, dalam derajat?`),
            given: String.raw`s=v`,
            blanks: [{ label: 's =', answer: 68 }],
          },
        },
        {
          kind: 'activity',
          title: L('A pentagon', 'Sebuah segilima'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`The formula is $(n-2)\cdot180^\circ$.`, T`Rumusnya $(n-2)\cdot180^\circ$.`), L(T`A pentagon has $n=5$: $3\cdot180$.`, T`Segilima memiliki $n=5$: $3\cdot180$.`)],
            explain: L(T`$(5-2)\cdot180^\circ=540^\circ$: three triangles.`, T`$(5-2)\cdot180^\circ=540^\circ$: tiga segitiga.`),
            prompt: L(T`What is the sum of the interior angles of a pentagon, in degrees?`, T`Berapa jumlah sudut dalam segilima, dalam derajat?`),
            given: String.raw`S=v`,
            blanks: [{ label: 'S =', answer: 540 }],
          },
        },
        {
          kind: 'activity',
          title: L('A regular octagon', 'Segidelapan beraturan'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`Each interior angle is $\frac{(n-2)\cdot180}{n}$.`, T`Setiap sudut dalam adalah $\frac{(n-2)\cdot180}{n}$.`), L(T`$\frac{6\cdot180}{8}$.`, T`$\frac{6\cdot180}{8}$.`)],
            explain: L(T`$\frac{6\cdot180^\circ}{8}=135^\circ$. (The exterior angle is $\frac{360}{8}=45^\circ$.)`, T`$\frac{6\cdot180^\circ}{8}=135^\circ$. (Sudut luarnya $\frac{360}{8}=45^\circ$.)`),
            prompt: L(T`What is each interior angle of a regular octagon, in degrees?`, T`Berapa setiap sudut dalam segidelapan beraturan, dalam derajat?`),
            given: String.raw`a=v`,
            blanks: [{ label: 'a =', answer: 135 }],
          },
        },
        {
          kind: 'activity',
          title: L('The number of sides', 'Banyak sisi'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`The exterior angle of a regular polygon is $\frac{360}{n}$.`, T`Sudut luar segi banyak beraturan adalah $\frac{360}{n}$.`), L(T`$n=\frac{360}{24}$.`, T`$n=\frac{360}{24}$.`)],
            explain: L(T`$n=\frac{360^\circ}{24^\circ}=15$ sides.`, T`$n=\frac{360^\circ}{24^\circ}=15$ sisi.`),
            prompt: L(T`A regular polygon has exterior angles of $24^\circ$. How many sides does it have?`, T`Sebuah segi banyak beraturan memiliki sudut luar $24^\circ$. Berapa sisinya?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 15 }],
          },
        },
        {
          kind: 'activity',
          title: L('From radians to degrees', 'Dari radian ke derajat'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`$\pi$ radians is $180^\circ$.`, T`$\pi$ radian adalah $180^\circ$.`), L(T`$\frac34\cdot180$.`, T`$\frac34\cdot180$.`)],
            explain: L(T`$\frac{3\pi}{4}\cdot\frac{180^\circ}{\pi}=135^\circ$.`, T`$\frac{3\pi}{4}\cdot\frac{180^\circ}{\pi}=135^\circ$.`),
            prompt: L(T`How many degrees is $\frac{3\pi}{4}$ radians?`, T`Berapa derajat $\frac{3\pi}{4}$ radian?`),
            given: String.raw`d=v`,
            blanks: [{ label: 'd =', answer: 135 }],
          },
        },
        {
          kind: 'activity',
          title: L('The clock at 2:30', 'Jam pada 2:30'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`The angle is $|30h-5.5m|$.`, T`Sudutnya $|30h-5{,}5m|$.`), L(T`$|60-165|$.`, T`$|60-165|$.`)],
            explain: L(T`$|30\cdot2-5.5\cdot30|=|60-165|=105^\circ$.`, T`$|30\cdot2-5{,}5\cdot30|=|60-165|=105^\circ$.`),
            prompt: L(T`What is the angle between the hands of a clock at $2{:}30$, in degrees?`, T`Berapa sudut antara jarum jam pada $2{:}30$, dalam derajat?`),
            given: String.raw`a=v`,
            blanks: [{ label: 'a =', answer: 105 }],
          },
        },
        {
          kind: 'activity',
          title: L('Right angles on the clock', 'Sudut siku-siku pada jam'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L(T`Any angle strictly between $0^\circ$ and $180^\circ$ happens twice per lap, and the hands lap $11$ times in twelve hours.`, T`Sudut apa pun yang benar-benar di antara $0^\circ$ dan $180^\circ$ terjadi dua kali per putaran, dan jarum menyusul $11$ kali dalam dua belas jam.`), L(T`$2\cdot11$.`, T`$2\cdot11$.`)],
            explain: L(T`$2\cdot11=22$ times in twelve hours (and $44$ in a day).`, T`$2\cdot11=22$ kali dalam dua belas jam (dan $44$ dalam sehari).`),
            prompt: L(T`How many times in twelve hours are the hands of a clock at right angles?`, T`Berapa kali dalam dua belas jam jarum jam membentuk sudut siku-siku?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 22 }],
          },
        },
        {
          kind: 'activity',
          title: L('A bearing', 'Sebuah bearing'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L(T`A direction is $135^\circ$ counterclockwise from east (northwest). What is its compass bearing?`, T`Sebuah arah adalah $135^\circ$ berlawanan arah jarum jam dari timur (barat laut). Berapa bearing kompasnya?`),
            options: [
              L(T`$315^\circ$`, T`$315^\circ$`),
              L(T`$135^\circ$`, T`$135^\circ$`),
              L(T`$45^\circ$`, T`$45^\circ$`),
              L(T`$225^\circ$`, T`$225^\circ$`),
            ],
            answer: 0,
            explain: L(T`bearing $=90^\circ-135^\circ=-45^\circ\equiv315^\circ$, which is northwest (NW).`, T`bearing $=90^\circ-135^\circ=-45^\circ\equiv315^\circ$, yaitu barat laut (NW).`),
            hint: L(T`Use bearing $=90^\circ-\theta$ and add $360^\circ$ if it is negative.`, T`Pakai bearing $=90^\circ-\theta$ dan tambahkan $360^\circ$ bila negatif.`),
          },
        },
        {
          kind: 'activity',
          title: L('atan2 or arccos?', 'atan2 atau arccos?'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`Why is $\operatorname{atan2}(|\mathbf a\times\mathbf b|,\ \mathbf a\cdot\mathbf b)$ better than $\arccos\frac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$ for the angle between vectors in a program?`, T`Mengapa $\operatorname{atan2}(|\mathbf a\times\mathbf b|,\ \mathbf a\cdot\mathbf b)$ lebih baik daripada $\arccos\frac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$ untuk sudut antara vektor dalam program?`),
            options: [
              L(T`the cosine is almost $1$ for tiny angles, so the arc cosine loses them (and rounding can push it above $1$)`, T`kosinus hampir $1$ untuk sudut kecil, sehingga arc kosinus kehilangannya (dan pembulatan dapat mendorongnya di atas $1$)`),
              L(T`atan2 returns degrees`, T`atan2 mengembalikan derajat`),
              L(T`arccos only works in three dimensions`, T`arccos hanya bekerja dalam tiga dimensi`),
              L(T`there is no difference`, T`tidak ada bedanya`),
            ],
            answer: 0,
            explain: L(T`For $\theta=10^{-8}$ the cosine is $1$ to sixteen digits, so $\arccos$ returns $0$; atan2 works from the cross and dot products and keeps the angle for every size. Both return radians.`, T`Untuk $\theta=10^{-8}$ kosinusnya $1$ sampai enam belas angka, sehingga $\arccos$ mengembalikan $0$; atan2 bekerja dari hasil kali silang dan titik dan mempertahankan sudut untuk setiap ukuran. Keduanya mengembalikan radian.`),
            hint: L(T`What is $\cos$ of a very small angle?`, T`Berapa $\cos$ sudut yang sangat kecil?`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: angles at a glance', 'Ringkasan: sudut sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Angle:** the turn between two rays at a vertex; counterclockwise is positive; $360^\circ=2\pi$ rad $=400$ gradians $=1$ turn.
- **Convert:** radians $=$ degrees $\cdot\frac{\pi}{180}$; $1$ rad $\approx57.2958^\circ$; degrees, minutes, seconds are sixtieths.
- **Types:** acute $<90^\circ$, right $=90^\circ$, obtuse between $90^\circ$ and $180^\circ$, straight $=180^\circ$, reflex above.
- **Pairs:** complementary $90^\circ$, supplementary $180^\circ$, vertical angles equal, a linear pair supplementary.
- **Parallel lines:** corresponding, alternate and vertical pairs equal; co-interior and linear pairs add up to $180^\circ$; equal corresponding angles prove the lines parallel.
- **Polygons:** interior sum $(n-2)\cdot180^\circ$, exterior sum $360^\circ$, regular interior $\frac{(n-2)\cdot180^\circ}{n}$; only the triangle, square and hexagon tile.
- **Clock:** $|30h-5.5m|$; $11$ overlaps and $22$ right angles in twelve hours.
- **Directions:** bearing $=90^\circ-\theta$; sixteen compass points $22.5^\circ$ apart.
- **Vectors and lines:** $\operatorname{atan2}(|\text{cross}|,\text{dot})$, slopes with $\tan\theta=\left|\frac{m_1-m_2}{1+m_1m_2}\right|$.
- **Code:** radians in trigonometric functions, normalize with $\%$ (watch the sign), prefer atan2 to acos.`,
            T`- **Sudut:** putaran antara dua sinar di titik sudut; berlawanan arah jarum jam positif; $360^\circ=2\pi$ rad $=400$ gradian $=1$ putaran.
- **Mengubah:** radian $=$ derajat $\cdot\frac{\pi}{180}$; $1$ rad $\approx57{,}2958^\circ$; derajat, menit, detik adalah seperenam puluhan.
- **Jenis:** lancip $<90^\circ$, siku-siku $=90^\circ$, tumpul di antara $90^\circ$ dan $180^\circ$, lurus $=180^\circ$, refleks di atasnya.
- **Pasangan:** berpenyiku $90^\circ$, berpelurus $180^\circ$, sudut bertolak belakang sama besar, pasangan linear berpelurus.
- **Garis sejajar:** pasangan sehadap, berseberangan, dan bertolak belakang sama besar; pasangan dalam sepihak dan linear berjumlah $180^\circ$; sudut sehadap yang sama besar membuktikan garis sejajar.
- **Segi banyak:** jumlah sudut dalam $(n-2)\cdot180^\circ$, jumlah sudut luar $360^\circ$, sudut dalam beraturan $\frac{(n-2)\cdot180^\circ}{n}$; hanya segitiga, persegi, dan segienam yang mengubin.
- **Jam:** $|30h-5{,}5m|$; $11$ tumpukan dan $22$ sudut siku-siku dalam dua belas jam.
- **Arah:** bearing $=90^\circ-\theta$; enam belas titik kompas berjarak $22{,}5^\circ$.
- **Vektor dan garis:** $\operatorname{atan2}(|\text{silang}|,\text{titik})$, gradien dengan $\tan\theta=\left|\frac{m_1-m_2}{1+m_1m_2}\right|$.
- **Kode:** radian dalam fungsi trigonometri, normalkan dengan $\%$ (perhatikan tandanya), pilih atan2 daripada acos.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Angle', 'Sudut'), definition: L('The figure formed by two rays with a common endpoint, or the amount of turning from one ray to the other.', 'Bangun yang dibentuk dua sinar dengan titik ujung bersama, atau besarnya putaran dari satu sinar ke sinar lain.') },
    { term: L('Vertex', 'Titik sudut'), definition: L('The common endpoint of the two rays that form an angle.', 'Titik ujung bersama dari dua sinar yang membentuk sudut.') },
    { term: L('Degree', 'Derajat'), definition: L('A unit of angle equal to one 360th of a full turn, divided into 60 minutes of 60 seconds each.', 'Satuan sudut yang sama dengan sepertiga ratus enam puluh putaran penuh, dibagi menjadi 60 menit yang masing-masing 60 detik.') },
    { term: L('Complementary angles', 'Sudut berpenyiku'), definition: L('Two angles whose sizes add up to 90 degrees.', 'Dua sudut yang besarnya berjumlah 90 derajat.') },
    { term: L('Supplementary angles', 'Sudut berpelurus'), definition: L('Two angles whose sizes add up to 180 degrees; a linear pair is supplementary.', 'Dua sudut yang besarnya berjumlah 180 derajat; pasangan linear berpelurus.') },
    { term: L('Vertical angles', 'Sudut bertolak belakang'), definition: L('The opposite angles formed where two lines cross; they are equal.', 'Sudut berhadapan yang terbentuk di tempat dua garis berpotongan; mereka sama besar.') },
    { term: L('Transversal', 'Garis lintang'), definition: L('A line that crosses two or more other lines, making pairs of corresponding, alternate and co-interior angles.', 'Garis yang memotong dua garis atau lebih, membuat pasangan sudut sehadap, berseberangan, dan sepihak.') },
    { term: L('Exterior angle of a polygon', 'Sudut luar segi banyak'), definition: L('The turn at a vertex when walking around the polygon, 180 degrees minus the interior angle; the exterior angles add up to 360 degrees.', 'Belokan di sebuah titik sudut ketika berjalan mengelilingi segi banyak, 180 derajat dikurangi sudut dalam; sudut luar berjumlah 360 derajat.') },
    { term: L('Bearing', 'Bearing'), definition: L('A direction measured as an angle clockwise from north, usually written with three digits.', 'Arah yang diukur sebagai sudut searah jarum jam dari utara, biasanya ditulis dengan tiga angka.') },
    { term: L('Protractor', 'Busur derajat'), definition: L('A semicircular or circular tool with a scale of degrees for measuring and drawing angles.', 'Alat setengah lingkaran atau lingkaran dengan skala derajat untuk mengukur dan menggambar sudut.') },
  ],

  howTo: [
    {
      name: L('How to find the angle between the hands of a clock', 'Cara mencari sudut antara jarum jam'),
      description: L('Find the position of each hand in degrees from the 12, subtract, and take the smaller way round.', 'Cari posisi setiap jarum dalam derajat dari angka 12, kurangkan, dan ambil jalan yang lebih pendek.'),
      steps: [
        { name: L('Place the hour hand', 'Tempatkan jarum jam'), text: L('Multiply the hour by 30 and add half a degree for each minute: it is the hour hand angle from the 12.', 'Kalikan jam dengan 30 dan tambahkan setengah derajat untuk setiap menit: itu sudut jarum jam dari angka 12.') },
        { name: L('Place the minute hand', 'Tempatkan jarum menit'), text: L('Multiply the minutes by 6: it is the minute hand angle from the 12.', 'Kalikan menit dengan 6: itu sudut jarum menit dari angka 12.') },
        { name: L('Subtract', 'Kurangkan'), text: L('Take the absolute value of the difference of the two angles, which equals the absolute value of 30 times the hour minus 5.5 times the minutes.', 'Ambil nilai mutlak selisih kedua sudut, yang sama dengan nilai mutlak 30 kali jam dikurangi 5,5 kali menit.') },
        { name: L('Take the smaller angle', 'Ambil sudut yang lebih kecil'), text: L('If the result is more than 180 degrees, subtract it from 360 degrees to get the angle between the hands.', 'Jika hasilnya lebih dari 180 derajat, kurangkan dari 360 derajat untuk mendapat sudut antara jarum.') },
      ],
    },
    {
      name: L('How to find the missing angles when a line crosses two parallel lines', 'Cara mencari sudut yang hilang ketika garis memotong dua garis sejajar'),
      description: L('From one known angle, use vertical angles, linear pairs and corresponding angles to find all eight.', 'Dari satu sudut yang diketahui, pakai sudut bertolak belakang, pasangan linear, dan sudut sehadap untuk menemukan kedelapannya.'),
      steps: [
        { name: L('Name the known angle', 'Namai sudut yang diketahui'), text: L('Call the known angle alpha and mark where it is at the crossing.', 'Sebut sudut yang diketahui alfa dan tandai di mana ia berada pada perpotongan.') },
        { name: L('Fill in the crossing', 'Isi perpotongan itu'), text: L('The vertical angle is also alpha, and each angle next to them is 180 degrees minus alpha, because they form a linear pair.', 'Sudut bertolak belakangnya juga alfa, dan setiap sudut di sebelahnya 180 derajat dikurangi alfa, karena mereka membentuk pasangan linear.') },
        { name: L('Copy to the other line', 'Salin ke garis lain'), text: L('Corresponding angles at the other parallel line are equal to the ones in the same place, so copy each value to it.', 'Sudut sehadap pada garis sejajar yang lain sama besar dengan yang di tempat yang sama, jadi salin setiap nilai ke sana.') },
        { name: L('Check with the pair rules', 'Periksa dengan aturan pasangan'), text: L('Alternate angles must be equal and co-interior angles must add up to 180 degrees.', 'Sudut berseberangan harus sama besar dan sudut sepihak harus berjumlah 180 derajat.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is an angle in geometry?', 'Apa itu sudut dalam geometri?'),
      a: L(
        'An angle is the figure formed by two rays with the same endpoint, called the vertex. Its size is the amount of turning needed to bring one ray onto the other, measured in degrees or radians.',
        'Sudut adalah bangun yang dibentuk dua sinar dengan titik ujung yang sama, disebut titik sudut. Besarnya adalah jumlah putaran yang diperlukan untuk membawa satu sinar ke sinar lain, diukur dalam derajat atau radian.',
      ),
    },
    {
      q: L('How many degrees are in a full circle, and why 360?', 'Berapa derajat dalam satu lingkaran penuh, dan mengapa 360?'),
      a: L(
        'A full circle is 360 degrees. The number comes from the Babylonians, who counted in sixties, and it is handy because 360 has 24 divisors, so many fractions of a turn are whole numbers of degrees.',
        'Satu lingkaran penuh adalah 360 derajat. Bilangan ini berasal dari bangsa Babilonia, yang menghitung dalam enam puluhan, dan ia praktis karena 360 memiliki 24 pembagi, sehingga banyak pecahan putaran berupa bilangan bulat derajat.',
      ),
    },
    {
      q: L('How do you convert degrees to radians?', 'Bagaimana mengubah derajat ke radian?'),
      a: L(
        'Multiply the degrees by pi over 180. For example 90 degrees is pi over 2 and 180 degrees is pi. To go back, multiply the radians by 180 over pi.',
        'Kalikan derajat dengan pi per 180. Misalnya 90 derajat adalah pi per 2 dan 180 derajat adalah pi. Untuk kembali, kalikan radian dengan 180 per pi.',
      ),
    },
    {
      q: L('What is the difference between complementary and supplementary angles?', 'Apa beda sudut berpenyiku dan sudut berpelurus?'),
      a: L(
        'Complementary angles add up to 90 degrees, supplementary angles to 180 degrees. The complement of 35 degrees is 55 degrees and its supplement is 145 degrees. Only an acute angle has a complement.',
        'Sudut berpenyiku berjumlah 90 derajat, sudut berpelurus 180 derajat. Penyiku 35 derajat adalah 55 derajat dan pelurusnya 145 derajat. Hanya sudut lancip yang punya penyiku.',
      ),
    },
    {
      q: L('Which angles are equal when a line crosses two parallel lines?', 'Sudut mana yang sama besar ketika garis memotong dua garis sejajar?'),
      a: L(
        'Corresponding angles, alternate interior angles, alternate exterior angles and vertical angles are equal. Co-interior angles and the angles of a linear pair are not equal, they add up to 180 degrees.',
        'Sudut sehadap, sudut dalam berseberangan, sudut luar berseberangan, dan sudut bertolak belakang sama besar. Sudut dalam sepihak dan sudut pasangan linear tidak sama, mereka berjumlah 180 derajat.',
      ),
    },
    {
      q: L('What is the sum of the interior angles of a polygon?', 'Berapa jumlah sudut dalam sebuah segi banyak?'),
      a: L(
        'For a polygon with n sides it is n minus 2, times 180 degrees, because the polygon splits into n minus 2 triangles. A hexagon has 720 degrees, and the exterior angles always add up to 360 degrees.',
        'Untuk segi banyak dengan n sisi jumlahnya n dikurangi 2, kali 180 derajat, karena segi banyak terbagi menjadi n dikurangi 2 segitiga. Segienam memiliki 720 derajat, dan sudut luar selalu berjumlah 360 derajat.',
      ),
    },
    {
      q: L('How do you find the angle between the hands of a clock?', 'Bagaimana mencari sudut antara jarum jam?'),
      a: L(
        'Take the absolute value of 30 times the hour minus 5.5 times the minutes, and if it is more than 180 degrees subtract it from 360. At 2:30 this gives 105 degrees.',
        'Ambil nilai mutlak 30 kali jam dikurangi 5,5 kali menit, dan bila lebih dari 180 derajat kurangkan dari 360. Pada 2:30 ini memberi 105 derajat.',
      ),
    },
    {
      q: L('How do you find the angle between two vectors?', 'Bagaimana mencari sudut antara dua vektor?'),
      a: L(
        'Use the dot product: the cosine of the angle is the dot product divided by the product of the lengths. In code, atan2 of the size of the cross product and the dot product is more accurate for very small angles.',
        'Pakai hasil kali titik: kosinus sudutnya adalah hasil kali titik dibagi hasil kali panjangnya. Dalam kode, atan2 dari besar hasil kali silang dan hasil kali titik lebih akurat untuk sudut yang sangat kecil.',
      ),
    },
  ],

  references: [
    { title: 'Euclid\'s Elements, Book I (definitions of angles, propositions 13, 15, 27, 29, 32)', author: 'Euclid, translated by Thomas L. Heath', year: 1956, source: 'Dover' },
    { title: 'Harmonia mensurarum', author: 'Roger Cotes', year: 1722, source: 'Cambridge' },
    { title: 'Geometry Revisited, chapters on angles and circles', author: 'H. S. M. Coxeter, Samuel L. Greitzer', year: 1967, source: 'Mathematical Association of America' },
    { title: 'A History of Mathematics (3rd ed.)', author: 'Carl B. Boyer, Uta C. Merzbach', year: 2011, source: 'Wiley' },
    { title: 'IEEE Standard for Floating-Point Arithmetic (IEEE 754-2019)', author: 'IEEE', year: 2019, source: 'IEEE' },
  ],

  related: ['triangles', 'quadrilaterals', 'circles', 'floating-point-numbers'],
}
