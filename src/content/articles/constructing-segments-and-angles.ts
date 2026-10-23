import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './constructing-segments-and-angles.meta'

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
    T`**A geometric construction draws a figure with only an unmarked ruler and a compass: the ruler draws a line through two points, the compass draws a circle, and every new point must be a crossing of lines and circles already drawn.** With them you can copy a segment or an angle, find a midpoint, bisect an angle, draw perpendiculars and parallels, and make $60^\circ$, $90^\circ$, $30^\circ$ and $45^\circ$ exactly; you cannot trisect a general angle.`,
    T`**Melukis dalam geometri berarti menggambar bangun hanya dengan penggaris tanpa skala dan jangka: penggaris menarik garis melalui dua titik, jangka menggambar lingkaran, dan setiap titik baru harus berupa perpotongan garis dan lingkaran yang sudah digambar.** Dengan keduanya kita dapat menyalin ruas garis atau sudut, mencari titik tengah, membagi dua sudut, membuat garis tegak lurus dan sejajar, serta membuat $60^\circ$, $90^\circ$, $30^\circ$, dan $45^\circ$ dengan tepat; sudut sembarang tidak dapat dibagi tiga.`,
  ),

  keyPoints: [
    L(
      T`A construction uses two tools: a ruler without numbers (a straightedge) and a compass. There are three allowed moves: draw the line through two points, draw the circle around a point through another, and mark a point where two lines or circles cross. A construction is exact and comes with a proof, which a drawing with a protractor never does.`,
      T`Lukisan memakai dua alat: penggaris tanpa angka dan jangka. Ada tiga langkah yang boleh: menarik garis melalui dua titik, menggambar lingkaran berpusat di satu titik melalui titik lain, dan menandai titik tempat dua garis atau lingkaran berpotongan. Lukisan itu tepat dan disertai bukti, sesuatu yang tidak dimiliki gambar dengan busur derajat.`,
    ),
    L(
      T`To copy a segment, set the compass to its length and swing an arc from the new point. To find the midpoint, draw two circles of the same radius around the ends: the line through their two crossings is the perpendicular bisector. Both rest on one fact: a point on the bisector is equally far from both ends.`,
      T`Untuk menyalin ruas garis, atur jangka sepanjang ruas itu dan ayunkan busur dari titik yang baru. Untuk mencari titik tengah, gambar dua lingkaran berjari-jari sama di kedua ujung: garis melalui kedua titik potongnya adalah garis sumbu. Keduanya bertumpu pada satu fakta: titik pada garis sumbu sama jauh dari kedua ujung.`,
    ),
    L(
      T`An equilateral triangle on a segment gives $60^\circ$. To bisect an angle, draw an arc around the vertex, then two arcs of equal radius around the points where it cuts the arms. To copy an angle, copy its chord with the compass. All three are proved by congruent triangles with three equal sides (SSS).`,
      T`Segitiga sama sisi pada sebuah ruas garis memberi $60^\circ$. Untuk membagi dua sudut, gambar busur berpusat di titik sudut, lalu dua busur berjari-jari sama berpusat di titik tempat busur itu memotong kaki sudut. Untuk menyalin sudut, salin tali busurnya dengan jangka. Ketiganya dibuktikan dengan segitiga kongruen yang memiliki tiga sisi sama (SSS).`,
    ),
    L(
      T`A perpendicular is the perpendicular bisector of two points marked on the line with a circle; a parallel is the opposite side of a rhombus. From $60^\circ$, $90^\circ$, halving, adding and subtracting you get $30^\circ$, $45^\circ$, $15^\circ$, $75^\circ$ and more; with the pentagon's $72^\circ$ you reach every whole number of degrees that is a multiple of $3$ and no other.`,
      T`Garis tegak lurus adalah garis sumbu dari dua titik yang ditandai pada garis dengan lingkaran; garis sejajar adalah sisi berhadapan sebuah belah ketupat. Dari $60^\circ$, $90^\circ$, membagi dua, menambah, dan mengurangi diperoleh $30^\circ$, $45^\circ$, $15^\circ$, $75^\circ$ dan lainnya; dengan $72^\circ$ dari segi lima tercapai setiap derajat bulat kelipatan $3$ dan tidak ada yang lain.`,
    ),
    L(
      T`Equal steps along any ray and parallel lines cut a segment into $n$ equal parts (the intercept theorem). But a ruler and compass cannot trisect a general angle, double a cube or square a circle: they only reach numbers whose degree over the rationals is a power of $2$. A regular $n$-gon can be built exactly when $n$ is a power of $2$ times different Fermat primes.`,
      T`Langkah-langkah sama panjang sepanjang sebuah sinar dan garis-garis sejajar membagi ruas garis menjadi $n$ bagian sama (teorema intersep). Tetapi penggaris dan jangka tidak dapat membagi tiga sudut sembarang, menggandakan kubus, atau mengkuadratkan lingkaran: keduanya hanya mencapai bilangan yang derajatnya atas bilangan rasional adalah pangkat dari $2$. Segi-$n$ beraturan dapat dilukis tepat bila $n$ adalah pangkat dari $2$ dikali bilangan prima Fermat yang berbeda.`,
    ),
    L(
      T`In code, a construction is the crossing of two circles: solve for the two points with the distance between the centers, and use ´max(h², 0)´ so that tangent circles do not give a square root of a tiny negative number. The test for buildable angles and polygons is Euler's $\varphi$ function.`,
      T`Dalam kode, sebuah lukisan adalah perpotongan dua lingkaran: hitung kedua titik dengan jarak antarpusat, dan pakai ´max(h², 0)´ agar lingkaran yang bersinggungan tidak memberi akar dari bilangan negatif yang sangat kecil. Uji untuk sudut dan segi banyak yang dapat dilukis adalah fungsi $\varphi$ Euler.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------------------------------ what */
    {
      id: 'what-is-a-construction',
      heading: L('What does it mean to construct a figure in geometry?', 'Apa artinya melukis sebuah bangun dalam geometri?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A geometric construction is a drawing made with only two tools, an unmarked ruler and a compass, in which every new point has to be a crossing of lines and circles that are already drawn.** The ruler (called a *straightedge* in geometry) draws a straight line through two points; it has no numbers, so it cannot measure. The compass draws a circle, or just an arc of one, around a point, with a radius equal to a distance you already have. Nothing else is allowed: no protractor, no marks on the ruler, no placing a point by eye.

Why work so strictly? Because a construction is *exact* and *provable*. A figure drawn with a protractor is only as good as the width of the pencil line, while a construction comes with a reason (usually that two triangles have three equal sides) which shows that the result is exactly right, however carefully or carelessly you draw. This is how Euclid built geometry in the *Elements* around 300 BC, and why a bisected angle or a perpendicular bisector is still the first thing a geometry course teaches you to draw.

| | Drawing with a ruler and protractor | Constructing with a ruler and compass |
|---|---|---|
| Tools | ruler with numbers, protractor | ruler without numbers, compass |
| How a length is made | measured in cm | copied with the compass |
| How good is it | as good as your reading | exact, and proved |
| What it teaches | how to measure | why it is true |`,
            T`**Lukisan geometri adalah gambar yang dibuat hanya dengan dua alat, penggaris tanpa skala dan jangka, dengan setiap titik baru harus berupa perpotongan garis dan lingkaran yang sudah digambar.** Penggaris (dalam geometri disebut *straightedge*) menarik garis lurus melalui dua titik; ia tidak punya angka, jadi tidak dapat mengukur. Jangka menggambar lingkaran, atau hanya busurnya, berpusat di sebuah titik, dengan jari-jari sama dengan jarak yang sudah kita punya. Selain itu tidak boleh: tidak ada busur derajat, tidak ada skala pada penggaris, dan tidak ada menaruh titik dengan perkiraan mata.

Mengapa seketat itu? Karena lukisan itu *tepat* dan *dapat dibuktikan*. Bangun yang digambar dengan busur derajat hanya sebaik tebal garis pensilnya, sedangkan lukisan disertai alasan (biasanya dua segitiga memiliki tiga sisi sama) yang menunjukkan bahwa hasilnya tepat, secermat atau seceroboh apa pun kita menggambar. Begitulah Euklides membangun geometri dalam *Elements* sekitar 300 SM, dan itu sebabnya membagi dua sudut atau melukis garis sumbu masih menjadi hal pertama yang diajarkan pelajaran geometri.

| | Menggambar dengan penggaris dan busur derajat | Melukis dengan penggaris dan jangka |
|---|---|---|
| Alat | penggaris berangka, busur derajat | penggaris tanpa angka, jangka |
| Cara membuat panjang | diukur dalam cm | disalin dengan jangka |
| Seberapa baik | sebaik pembacaan kita | tepat, dan terbukti |
| Yang diajarkan | cara mengukur | mengapa itu benar |`,
          ),
        },
        {
          kind: 'callout',
          tone: 'definition',
          title: L('The three allowed moves', 'Tiga langkah yang diperbolehkan'),
          text: L(
            T`- **Line:** draw the line through two points that already exist.
- **Circle:** draw the circle around a point that exists, with a radius equal to the distance between two points that exist (often: through another point that exists).
- **Point:** mark a new point where two of the lines and circles you have drawn cross.

Every construction in this article is a list of these three moves and nothing else; the interactive drawings below check that rule on every step.`,
            T`- **Garis:** tarik garis melalui dua titik yang sudah ada.
- **Lingkaran:** gambar lingkaran berpusat di sebuah titik yang ada, dengan jari-jari sama dengan jarak antara dua titik yang ada (sering kali: melalui titik lain yang ada).
- **Titik:** tandai titik baru tempat dua garis atau lingkaran yang sudah digambar berpotongan.

Setiap lukisan dalam artikel ini adalah daftar ketiga langkah itu dan tidak ada yang lain; gambar interaktif di bawah memeriksa aturan itu pada setiap langkah.`,
          ),
        },
        {
          kind: 'callout',
          tone: 'note',
          title: L('A compass that folds, or one that stays open?', 'Jangka yang menutup, atau yang tetap terbuka?'),
          text: L(
            T`Euclid's compass *collapses* when it is lifted off the paper, so it cannot carry a length from one place to another. A school compass keeps its opening. Euclid's Proposition I.2 shows that the two are equivalent: whatever one can build, the other can too. In this article the compass keeps its opening, which is how the tool really behaves.`,
            T`Jangka Euklides *menutup* ketika diangkat dari kertas, sehingga tidak dapat membawa panjang dari satu tempat ke tempat lain. Jangka sekolah mempertahankan bukaannya. Proposisi I.2 Euklides menunjukkan bahwa keduanya setara: apa yang dapat dibangun satu, dapat dibangun yang lain. Dalam artikel ini jangka mempertahankan bukaannya, sesuai cara alat itu bekerja.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------- segments */
    {
      id: 'segments',
      heading: L('How do you copy, add and subtract line segments?', 'Bagaimana menyalin, menjumlahkan, dan mengurangkan ruas garis?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To copy a segment $AB$ onto a ray that starts at $C$, open the compass until its point is on $A$ and its pencil on $B$, then put the point on $C$ and swing an arc across the ray: the crossing $D$ gives $CD=AB$.** The ruler is used only to draw the ray. The compass does the measuring without any numbers, because it keeps its opening, so every point of the arc is exactly the length $AB$ from $C$.

1. Draw a ray from $C$ (or use the one you have).
2. Open the compass from $A$ to $B$.
3. Keep that opening, put the point on $C$ and draw an arc that crosses the ray at $D$.

With this one move you can do arithmetic on lengths:

- **Add** two segments: copy the first onto a ray from $C$, ending at $D$; then put the compass point on $D$ and copy the second one further along the same ray, ending at $E$. Then $CE$ is the sum.
- **Subtract**: copy the longer segment onto a ray, then copy the shorter one from its end *back* towards $C$. What is left is the difference.
- **Multiply by a whole number**: copy the same segment end to end, $2$, $3$, $4$ times.

Lengths here are copied, never read: you may not know in centimetres how long $AB$ is, and you do not need to. If you choose one segment as the unit, the same moves give lengths such as $2$, $3$ or $\frac{3}{2}$ times it.`,
            T`**Untuk menyalin ruas garis $AB$ pada sinar yang berawal di $C$, bukalah jangka sampai kakinya di $A$ dan pensilnya di $B$, lalu letakkan kaki jangka di $C$ dan ayunkan busur memotong sinar: titik potong $D$ memberi $CD=AB$.** Penggaris hanya dipakai untuk menarik sinar. Jangka mengukur tanpa angka, karena ia mempertahankan bukaannya, sehingga setiap titik pada busur berjarak tepat $AB$ dari $C$.

1. Tarik sinar dari $C$ (atau pakai yang sudah ada).
2. Bukalah jangka dari $A$ sampai $B$.
3. Pertahankan bukaan itu, letakkan kaki jangka di $C$ dan gambar busur yang memotong sinar di $D$.

Dengan satu langkah ini kita dapat berhitung dengan panjang:

- **Menjumlahkan** dua ruas garis: salin yang pertama pada sinar dari $C$, berakhir di $D$; lalu letakkan kaki jangka di $D$ dan salin yang kedua lebih jauh sepanjang sinar yang sama, berakhir di $E$. Maka $CE$ adalah jumlahnya.
- **Mengurangkan**: salin ruas garis yang lebih panjang pada sebuah sinar, lalu salin yang lebih pendek dari ujungnya *kembali* ke arah $C$. Sisanya adalah selisihnya.
- **Mengalikan dengan bilangan bulat**: salin ruas garis yang sama ujung ke ujung, $2$, $3$, $4$ kali.

Panjang di sini disalin, tidak dibaca: kita mungkin tidak tahu berapa sentimeter panjang $AB$, dan tidak perlu tahu. Bila satu ruas garis dipilih sebagai satuan, langkah yang sama menghasilkan panjang seperti $2$, $3$, atau $\frac{3}{2}$ kali satuan itu.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------- perpendicular bisector */
    {
      id: 'perpendicular-bisector',
      heading: L('How do you find the midpoint and perpendicular bisector of a segment?', 'Bagaimana mencari titik tengah dan garis sumbu sebuah ruas garis?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Draw two circles of the same radius around the ends $A$ and $B$ of the segment; the line through their two crossings $P$ and $Q$ is the perpendicular bisector of $AB$, and it meets $AB$ at its midpoint $M$.** The *perpendicular bisector* is the line that cuts a segment in half at a right angle; it is also the set of all points that are equally far from $A$ and from $B$.

1. Open the compass to more than half of $AB$ (the length $AB$ itself is a good choice).
2. Put the point on $A$ and draw an arc above the segment and another below it.
3. Keep the same opening, put the point on $B$ and draw two arcs that cross the first two, at $P$ above and $Q$ below.
4. Draw the line $PQ$ with the ruler. It crosses $AB$ at the midpoint $M$ and is perpendicular to it.

**Why it works.** Both circles have the same radius, so $PA=PB=QA=QB$: the quadrilateral $APBQ$ has four equal sides, which makes it a rhombus. The diagonals of a rhombus cut each other in half and meet at a right angle (see [the properties of quadrilaterals](article:quadrilaterals#properties)), and those diagonals are exactly $AB$ and $PQ$. Another way to see it: the triangles $APQ$ and $BPQ$ have three equal sides, so they are congruent, and the angles at $P$ are equal.

This construction does a lot of work. Finding the midpoint of a side is the first step to the median of a triangle, and the perpendicular bisectors of two sides of a triangle meet at the center of its circumscribed circle (see [the centers of a triangle](article:triangles#centers)).`,
            T`**Gambar dua lingkaran berjari-jari sama berpusat di ujung $A$ dan $B$ ruas garis; garis melalui kedua titik potongnya $P$ dan $Q$ adalah garis sumbu $AB$, dan ia memotong $AB$ di titik tengahnya $M$.** *Garis sumbu* adalah garis yang membagi sebuah ruas garis menjadi dua sama panjang dengan sudut siku-siku; ia juga himpunan semua titik yang sama jauh dari $A$ dan dari $B$.

1. Bukalah jangka lebih dari setengah $AB$ (panjang $AB$ sendiri adalah pilihan yang baik).
2. Letakkan kaki jangka di $A$ dan gambar satu busur di atas ruas garis dan satu lagi di bawahnya.
3. Pertahankan bukaan yang sama, letakkan kaki jangka di $B$ dan gambar dua busur yang memotong kedua busur pertama, di $P$ di atas dan $Q$ di bawah.
4. Tarik garis $PQ$ dengan penggaris. Ia memotong $AB$ di titik tengah $M$ dan tegak lurus padanya.

**Mengapa berhasil.** Kedua lingkaran berjari-jari sama, jadi $PA=PB=QA=QB$: segi empat $APBQ$ memiliki empat sisi sama panjang, sehingga merupakan belah ketupat. Diagonal belah ketupat saling membagi dua dan berpotongan siku-siku (lihat [sifat-sifat segi empat](article:quadrilaterals#properties)), dan diagonal-diagonal itu tepat $AB$ dan $PQ$. Cara lain melihatnya: segitiga $APQ$ dan $BPQ$ memiliki tiga sisi sama, jadi kongruen, dan sudut-sudut di $P$ sama besar.

Lukisan ini sangat berguna. Mencari titik tengah sisi adalah langkah pertama menuju garis berat segitiga, dan garis sumbu dua sisi segitiga bertemu di pusat lingkaran luarnya (lihat [titik-titik penting segitiga](article:triangles#centers)).`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------------------ angles */
    {
      id: 'angles',
      heading: L('How do you construct 60°, bisect an angle and copy an angle?', 'Bagaimana melukis 60°, membagi dua sudut, dan menyalin sudut?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The three basic angle constructions all use circles of one single radius, and each is proved by two triangles with three equal sides (SSS).**

**An equilateral triangle gives $60^\circ$.** This is Euclid's very first proposition. Draw the segment $AB$, then the circle around $A$ through $B$ and the circle around $B$ through $A$. They cross at $C$, and $CA=AB=CB$: three equal sides. The three angles of an equilateral triangle are equal and add up to $180^\circ$, so each is $60^\circ$ (see [the angles of a triangle](article:triangles#angle-sum)).

**To bisect an angle** $POQ$ with vertex $O$:

1. Put the compass point on $O$ and draw an arc that crosses both arms, at $P$ and $Q$.
2. Put the point on $P$ and draw an arc inside the angle.
3. Keep the same opening, put the point on $Q$ and draw an arc that crosses the previous one at $R$.
4. Draw the ray $OR$. It cuts the angle into two equal angles.

*Why:* the triangles $OPR$ and $OQR$ have $OP=OQ$ (the first arc), $PR=QR$ (the same opening) and the side $OR$ in common. Three equal sides make them congruent, so the angles $POR$ and $QOR$ are equal. If the second and third arcs also use the radius $OP$, then $O$, $P$, $R$, $Q$ form a rhombus, and a diagonal of a rhombus bisects its angle.

**To copy an angle** $POQ$ onto a ray $ST$:

1. With the point on $O$, draw an arc that crosses the arms at $P$ and $Q$. Draw the same arc (the same opening) around $S$, crossing the ray $ST$ at $U$.
2. Open the compass to the distance $PQ$.
3. With the point on $U$, draw an arc that crosses the first arc at $V$.
4. Draw the ray $SV$. The angle $USV$ equals $POQ$.

*Why:* the triangles $OPQ$ and $SUV$ have $OP=SU$, $OQ=SV$ and $PQ=UV$, all copied with the compass, so they are congruent by SSS and the angles at $O$ and $S$ are equal. Bisecting, copying and adding angles are the only moves you need to build every other angle (see [how angles are named and added](article:angles#types-and-pairs)).`,
            T`**Tiga lukisan sudut dasar semuanya memakai lingkaran berjari-jari satu saja, dan masing-masing dibuktikan oleh dua segitiga yang memiliki tiga sisi sama (SSS).**

**Segitiga sama sisi memberi $60^\circ$.** Ini proposisi pertama Euklides. Gambar ruas garis $AB$, lalu lingkaran berpusat di $A$ melalui $B$ dan lingkaran berpusat di $B$ melalui $A$. Keduanya berpotongan di $C$, dan $CA=AB=CB$: tiga sisi sama panjang. Ketiga sudut segitiga sama sisi sama besar dan berjumlah $180^\circ$, jadi masing-masing $60^\circ$ (lihat [sudut-sudut segitiga](article:triangles#angle-sum)).

**Untuk membagi dua sudut** $POQ$ dengan titik sudut $O$:

1. Letakkan kaki jangka di $O$ dan gambar busur yang memotong kedua kaki sudut, di $P$ dan $Q$.
2. Letakkan kaki jangka di $P$ dan gambar busur di dalam sudut.
3. Pertahankan bukaan yang sama, letakkan kaki jangka di $Q$ dan gambar busur yang memotong busur sebelumnya di $R$.
4. Tarik sinar $OR$. Ia membagi sudut menjadi dua sudut sama besar.

*Mengapa:* segitiga $OPR$ dan $OQR$ memiliki $OP=OQ$ (busur pertama), $PR=QR$ (bukaan yang sama), dan sisi $OR$ yang dipakai bersama. Tiga sisi sama membuatnya kongruen, jadi sudut $POR$ dan $QOR$ sama besar. Bila busur kedua dan ketiga juga memakai jari-jari $OP$, maka $O$, $P$, $R$, $Q$ membentuk belah ketupat, dan diagonal belah ketupat membagi dua sudutnya.

**Untuk menyalin sudut** $POQ$ pada sinar $ST$:

1. Dengan kaki jangka di $O$, gambar busur yang memotong kaki sudut di $P$ dan $Q$. Gambar busur yang sama (bukaan yang sama) berpusat di $S$, memotong sinar $ST$ di $U$.
2. Bukalah jangka sebesar jarak $PQ$.
3. Dengan kaki jangka di $U$, gambar busur yang memotong busur pertama di $V$.
4. Tarik sinar $SV$. Sudut $USV$ sama dengan $POQ$.

*Mengapa:* segitiga $OPQ$ dan $SUV$ memiliki $OP=SU$, $OQ=SV$, dan $PQ=UV$, semuanya disalin dengan jangka, jadi kongruen menurut SSS dan sudut di $O$ dan $S$ sama besar. Membagi dua, menyalin, dan menjumlahkan sudut adalah satu-satunya langkah yang diperlukan untuk membangun sudut lain (lihat [cara sudut dinamai dan dijumlahkan](article:angles#types-and-pairs)).`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------ perpendicular and parallel */
    {
      id: 'perpendicular-and-parallel',
      heading: L('How do you draw a perpendicular line and a parallel line?', 'Bagaimana melukis garis tegak lurus dan garis sejajar?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A perpendicular is the perpendicular bisector of two points that you mark on the line with a circle, and a parallel is the opposite side of a rhombus, so both come from the constructions above.**

**A perpendicular at a point $C$ on a line.**

1. Put the compass point on $C$ and draw a circle that crosses the line at two points, $A$ on one side and $X$ on the other. They are the same distance from $C$.
2. Construct the perpendicular bisector of $AX$ (two circles of the same radius around $A$ and $X$).
3. That bisector goes through the midpoint of $AX$, which is $C$, and is perpendicular to the line. To make a right angle of $90^\circ$ at the end of a ray, extend the ray backwards and take $C$ to be the end.

**A perpendicular from a point $C$ that is not on the line.**

1. Draw a circle around $C$ that cuts the line at two points, $A$ and $X$.
2. Construct the perpendicular bisector of $AX$. Because $CA=CX$, the point $C$ is on it.
3. The bisector is the perpendicular from $C$; it meets the line at the foot $F$, and $CF$ is the shortest way from $C$ to the line.

**A parallel to a line $AB$ through a point $C$ that is not on it.**

1. Draw the circle around $A$ through $C$. It crosses the line at $X$.
2. With the same opening, draw a circle around $X$ and another around $C$. They cross at $A$ and at a second point $Q$.
3. Draw the line $CQ$. The four points $A$, $X$, $Q$, $C$ are the corners of a rhombus (four sides equal to the one opening), and opposite sides of a rhombus are parallel, so $CQ\parallel AB$.

A second way to make a parallel is to copy an angle: draw any line through $C$ that crosses $AB$, copy the angle it makes with $AB$ so that it becomes the *corresponding* angle at $C$, and use the fact that equal corresponding angles mean parallel lines (see [lines cut by a transversal](article:angles#parallel-lines)).`,
            T`**Garis tegak lurus adalah garis sumbu dari dua titik yang kita tandai pada garis dengan sebuah lingkaran, dan garis sejajar adalah sisi berhadapan sebuah belah ketupat, jadi keduanya berasal dari lukisan di atas.**

**Garis tegak lurus di titik $C$ pada sebuah garis.**

1. Letakkan kaki jangka di $C$ dan gambar lingkaran yang memotong garis di dua titik, $A$ di satu sisi dan $X$ di sisi lain. Keduanya sama jauh dari $C$.
2. Lukis garis sumbu $AX$ (dua lingkaran berjari-jari sama berpusat di $A$ dan $X$).
3. Garis sumbu itu melalui titik tengah $AX$, yaitu $C$, dan tegak lurus pada garis. Untuk membuat sudut siku-siku $90^\circ$ di ujung sebuah sinar, perpanjang sinar itu ke belakang dan ambil $C$ sebagai ujungnya.

**Garis tegak lurus dari titik $C$ yang tidak berada pada garis.**

1. Gambar lingkaran berpusat di $C$ yang memotong garis di dua titik, $A$ dan $X$.
2. Lukis garis sumbu $AX$. Karena $CA=CX$, titik $C$ berada di atasnya.
3. Garis sumbu itu adalah garis tegak lurus dari $C$; ia memotong garis di kaki $F$, dan $CF$ adalah jalan terpendek dari $C$ ke garis.

**Garis sejajar $AB$ melalui titik $C$ yang tidak berada di atasnya.**

1. Gambar lingkaran berpusat di $A$ melalui $C$. Ia memotong garis di $X$.
2. Dengan bukaan yang sama, gambar lingkaran berpusat di $X$ dan satu lagi berpusat di $C$. Keduanya berpotongan di $A$ dan di titik kedua $Q$.
3. Tarik garis $CQ$. Keempat titik $A$, $X$, $Q$, $C$ adalah titik sudut belah ketupat (empat sisi sama dengan satu bukaan), dan sisi berhadapan belah ketupat sejajar, jadi $CQ\parallel AB$.

Cara kedua membuat garis sejajar adalah menyalin sudut: tarik sembarang garis melalui $C$ yang memotong $AB$, salin sudut yang dibentuknya dengan $AB$ sehingga menjadi sudut *sehadap* di $C$, dan pakai fakta bahwa sudut sehadap yang sama besar berarti garis sejajar (lihat [garis yang dipotong garis lintang](article:angles#parallel-lines)).`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- play */
    {
      id: 'play-the-constructions',
      heading: L('Can you watch every circle and line of each construction?', 'Dapatkah kita melihat setiap lingkaran dan garis tiap lukisan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Pick a construction, step through it one circle or line at a time, and measure the finished drawing.** The drawing obeys the rule of the three moves: a new point can only appear where two things you have already drawn cross, and the program refuses any other step. Press *another drawing* to run the same construction on a new segment or angle: the measurements stay exact because the proof does not depend on where the points are.`,
            T`**Pilih sebuah lukisan, ikuti satu lingkaran atau garis pada satu waktu, dan ukur gambar yang sudah jadi.** Gambar ini menaati aturan tiga langkah: titik baru hanya dapat muncul di tempat dua hal yang sudah kita gambar berpotongan, dan program menolak langkah lain. Tekan *gambar lain* untuk menjalankan lukisan yang sama pada ruas garis atau sudut yang baru: pengukurannya tetap tepat karena buktinya tidak bergantung pada letak titik-titiknya.`,
          ),
        },
        { kind: 'widget', name: 'constructplay' },
      ],
    },

    /* ----------------------------------------------------------------------------- special angles */
    {
      id: 'special-angles',
      heading: L('Which angles can be built with a ruler and compass?', 'Sudut mana yang dapat dilukis dengan penggaris dan jangka?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Starting from $60^\circ$ and $90^\circ$ and using only halving, adding and subtracting, you can build $30^\circ$, $45^\circ$, $15^\circ$, $75^\circ$, $105^\circ$, $120^\circ$, $135^\circ$, $150^\circ$ and many more, but not $20^\circ$ or $1^\circ$.** Each of the rows below is a few moves of the constructions above.

| Angle | How |
|---|---|
| $90^\circ$ | a perpendicular |
| $60^\circ$ | an equilateral triangle |
| $30^\circ$ | half of $60^\circ$ |
| $45^\circ$ | half of $90^\circ$ |
| $15^\circ$ | half of $30^\circ$ |
| $75^\circ$ | $60^\circ+15^\circ$ |
| $105^\circ$ | $90^\circ+15^\circ$ |
| $120^\circ$ | $60^\circ+60^\circ$ |
| $135^\circ$ | $90^\circ+45^\circ$ |
| $150^\circ$ | $90^\circ+60^\circ$ |

There is one more building block, found by the Greeks: the regular pentagon. Its central angle is $72^\circ$, because $\cos72^\circ=\frac{\sqrt5-1}{4}$ and a square root is something a compass can make (a circle of radius $\frac{\sqrt5}{2}$ around the midpoint of a radius, and two more bisections). From $72^\circ$ you get $36^\circ$, $18^\circ$ and, subtracting $60^\circ$, $12^\circ$. And then $15^\circ-12^\circ=3^\circ$: **an angle of one degree is out of reach, but one of three degrees is not.**

**The whole degrees that can be built are exactly the multiples of $3$.** Every multiple of $3$ is reached by adding and subtracting copies of $3^\circ$. For the others, suppose $n^\circ$ could be built with $n$ not a multiple of $3$. Then $n$ and $3$ have no common factor, so there are whole numbers $a$ and $b$ with $an+3b=1$, and adding and subtracting copies of $n^\circ$ and $3^\circ$ would build $1^\circ$. But $1^\circ$ cannot be built, as the section on impossible constructions explains.

Type any whole number of degrees below and you get the cheapest recipe and the finished drawing, or the reason why none exists.`,
            T`**Mulai dari $60^\circ$ dan $90^\circ$ dan hanya memakai membagi dua, menambah, dan mengurangi, kita dapat membangun $30^\circ$, $45^\circ$, $15^\circ$, $75^\circ$, $105^\circ$, $120^\circ$, $135^\circ$, $150^\circ$ dan banyak lagi, tetapi bukan $20^\circ$ atau $1^\circ$.** Setiap baris di bawah adalah beberapa langkah dari lukisan di atas.

| Sudut | Cara |
|---|---|
| $90^\circ$ | garis tegak lurus |
| $60^\circ$ | segitiga sama sisi |
| $30^\circ$ | setengah dari $60^\circ$ |
| $45^\circ$ | setengah dari $90^\circ$ |
| $15^\circ$ | setengah dari $30^\circ$ |
| $75^\circ$ | $60^\circ+15^\circ$ |
| $105^\circ$ | $90^\circ+15^\circ$ |
| $120^\circ$ | $60^\circ+60^\circ$ |
| $135^\circ$ | $90^\circ+45^\circ$ |
| $150^\circ$ | $90^\circ+60^\circ$ |

Ada satu bahan lagi, yang ditemukan bangsa Yunani: segi lima beraturan. Sudut pusatnya $72^\circ$, karena $\cos72^\circ=\frac{\sqrt5-1}{4}$ dan akar kuadrat adalah sesuatu yang dapat dibuat jangka (lingkaran berjari-jari $\frac{\sqrt5}{2}$ berpusat di titik tengah sebuah jari-jari, dan dua pembagian dua lagi). Dari $72^\circ$ diperoleh $36^\circ$, $18^\circ$ dan, dengan mengurangkan $60^\circ$, $12^\circ$. Lalu $15^\circ-12^\circ=3^\circ$: **sudut satu derajat tidak terjangkau, tetapi tiga derajat terjangkau.**

**Derajat bulat yang dapat dilukis tepat adalah kelipatan $3$.** Setiap kelipatan $3$ dicapai dengan menambah dan mengurangi salinan $3^\circ$. Untuk yang lain, misalkan $n^\circ$ dapat dilukis dengan $n$ bukan kelipatan $3$. Maka $n$ dan $3$ tidak punya faktor persekutuan, sehingga ada bilangan bulat $a$ dan $b$ dengan $an+3b=1$, dan menambah serta mengurangi salinan $n^\circ$ dan $3^\circ$ akan membuat $1^\circ$. Tetapi $1^\circ$ tidak dapat dilukis, seperti dijelaskan pada bagian tentang lukisan yang mustahil.

Ketik sembarang bilangan bulat derajat di bawah dan kita mendapat resep termurah dan gambar jadinya, atau alasan mengapa resepnya tidak ada.`,
          ),
        },
        { kind: 'widget', name: 'constructangle' },
      ],
    },

    /* ----------------------------------------------------------------------------------- divide */
    {
      id: 'equal-parts',
      heading: L('How do you divide a segment into equal parts?', 'Bagaimana membagi ruas garis menjadi bagian-bagian sama?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To divide $AB$ into $n$ equal parts, step $n$ equal lengths off a ray from $A$, join the last mark to $B$, and draw parallels to that line through the other marks; they cut $AB$ into $n$ equal parts.** The reason is the *intercept theorem*: parallel lines that cut equal pieces from one transversal cut equal pieces from every other. Here is the construction for $n=3$.

1. Draw a ray from $A$ at any angle to $AB$.
2. Choose any compass opening and step off three equal lengths along the ray, from $A$: the marks $D_1$, $D_2$, $D_3$.
3. Draw the line $D_3B$.
4. Draw the parallels to $D_3B$ through $D_2$ and $D_1$ (see the rhombus method above). They cross $AB$ at $K_2$ and $K_1$.
5. $AK_1=K_1K_2=K_2B$.

The same moves divide a segment in a given ratio: to cut $AB$ in the ratio $2:3$, divide it into $5$ equal parts and take the second mark. Dividing a segment into two equal parts is the perpendicular bisector, which is quicker than this method. And because you can build $\frac{a}{n}$ of any length, the lengths you can make from one unit segment include every fraction.

The drawing below plays the whole construction for $2$ to $10$ parts; the table at the end measures every mark against $\frac{k}{n}$ of the way from $A$ to $B$.`,
            T`**Untuk membagi $AB$ menjadi $n$ bagian sama, langkahkan $n$ panjang yang sama sepanjang sinar dari $A$, hubungkan tanda terakhir dengan $B$, dan tarik garis-garis sejajar dengan garis itu melalui tanda-tanda lainnya; garis-garis itu membagi $AB$ menjadi $n$ bagian sama.** Alasannya adalah *teorema intersep*: garis-garis sejajar yang memotong bagian sama dari satu garis lintang memotong bagian sama dari setiap garis lintang lainnya. Berikut lukisan untuk $n=3$.

1. Tarik sinar dari $A$ dengan sudut sembarang terhadap $AB$.
2. Pilih sembarang bukaan jangka dan langkahkan tiga panjang yang sama sepanjang sinar, dari $A$: tanda $D_1$, $D_2$, $D_3$.
3. Tarik garis $D_3B$.
4. Tarik garis-garis sejajar $D_3B$ melalui $D_2$ dan $D_1$ (lihat cara belah ketupat di atas). Keduanya memotong $AB$ di $K_2$ dan $K_1$.
5. $AK_1=K_1K_2=K_2B$.

Langkah yang sama membagi ruas garis dengan perbandingan tertentu: untuk memotong $AB$ dengan perbandingan $2:3$, bagi menjadi $5$ bagian sama dan ambil tanda kedua. Membagi ruas garis menjadi dua bagian sama adalah garis sumbu, yang lebih cepat daripada cara ini. Dan karena kita dapat membuat $\frac{a}{n}$ dari panjang mana pun, panjang yang dapat dibuat dari satu ruas garis satuan mencakup setiap pecahan.

Gambar di bawah memutar seluruh lukisan untuk $2$ sampai $10$ bagian; tabel di akhir mengukur setiap tanda terhadap $\frac{k}{n}$ perjalanan dari $A$ ke $B$.`,
          ),
        },
        { kind: 'widget', name: 'constructdivide' },
      ],
    },

    /* ---------------------------------------------------------------------------------- impossible */
    {
      id: 'impossible',
      heading: L('What can never be built with a ruler and compass?', 'Apa yang tidak akan pernah dapat dilukis dengan penggaris dan jangka?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A general angle cannot be divided into three equal parts, a cube cannot be doubled and a circle cannot be squared with a ruler and compass; each was proved impossible in the nineteenth century.** The three problems were open for more than two thousand years. The answer is not that nobody was clever enough, but that the tools reach only certain numbers.

**What numbers can be built?** Take a unit length. The three moves can only produce the numbers you get from $1$ by adding, subtracting, multiplying, dividing and taking square roots, because crossing a line with a line leads to a linear equation and crossing a line or circle with a circle leads to a quadratic one. Each square root at most doubles the *degree* of a number over the rationals (the smallest degree of a whole-number polynomial that has it as a root). So a number that can be built has a degree that is a power of $2$: $1$, $2$, $4$, $8$, … This is Wantzel's theorem (1837).

**Why $20^\circ$ cannot be built.** The triple-angle identity says $\cos3\varphi=4\cos^3\varphi-3\cos\varphi$. Put $\varphi=20^\circ$ and $\cos60^\circ=\frac12$, and $x=\cos20^\circ$ satisfies $8x^3-6x-1=0$. This cubic has no rational root (the only candidates are $\pm1$, $\pm\frac12$, $\pm\frac14$, $\pm\frac18$, and none works), so it cannot be split, and $\cos20^\circ$ has degree $3$. Three is not a power of $2$, so $20^\circ$ cannot be built, and an angle of $60^\circ$ cannot be trisected. If $1^\circ$ could be built, so could $20^\circ$ (twenty copies), which is why no whole degree outside the multiples of $3$ can.

**The three classical problems.**

- **Trisecting an angle:** possible for special angles ($90^\circ$ gives $30^\circ$), impossible in general ($60^\circ$ gives $20^\circ$).
- **Doubling the cube:** a cube of twice the volume needs an edge of $\sqrt[3]{2}$ times the old one, a number of degree $3$.
- **Squaring the circle:** a square of the same area as a circle of radius $1$ needs a side $\sqrt\pi$. Lindemann proved in 1882 that $\pi$ is transcendental, which means it is not a root of any whole-number polynomial, so $\sqrt\pi$ is out of reach too (see [π and the transcendental numbers](article:irrational-numbers#pi-e-transcendental)).

**Other tools can do it.** Archimedes trisected any angle with a ruler that has two marks one unit apart (a *marked ruler*, called *neusis* in Greek). Put the ruler through $B$ so that one mark is on the circle at $C$ and the other is on the line $AO$ extended, at $D$; the angle at $D$ is exactly one third of the angle at $O$. Paper folding (origami) and some other curves can also trisect an angle. The impossibility is about the *ruler and compass alone*.

The drawing below shows Archimedes' trisection for any angle, and tells you whether a ruler and compass alone could have done it.`,
            T`**Sudut sembarang tidak dapat dibagi tiga sama besar, kubus tidak dapat digandakan, dan lingkaran tidak dapat dikuadratkan dengan penggaris dan jangka; ketiganya terbukti mustahil pada abad kesembilan belas.** Ketiga masalah itu terbuka selama lebih dari dua ribu tahun. Jawabannya bukan bahwa tak seorang pun cukup cerdas, melainkan bahwa alat-alat itu hanya mencapai bilangan tertentu.

**Bilangan apa yang dapat dibuat?** Ambil satu panjang satuan. Tiga langkah itu hanya dapat menghasilkan bilangan yang diperoleh dari $1$ dengan menambah, mengurangi, mengalikan, membagi, dan menarik akar kuadrat, karena perpotongan garis dengan garis menghasilkan persamaan linear dan perpotongan garis atau lingkaran dengan lingkaran menghasilkan persamaan kuadrat. Setiap akar kuadrat paling banyak menggandakan *derajat* sebuah bilangan atas bilangan rasional (derajat terkecil polinomial berkoefisien bulat yang memiliki bilangan itu sebagai akar). Jadi bilangan yang dapat dibuat berderajat pangkat dari $2$: $1$, $2$, $4$, $8$, … Inilah teorema Wantzel (1837).

**Mengapa $20^\circ$ tidak dapat dilukis.** Identitas sudut rangkap tiga berbunyi $\cos3\varphi=4\cos^3\varphi-3\cos\varphi$. Ambil $\varphi=20^\circ$ dan $\cos60^\circ=\frac12$, maka $x=\cos20^\circ$ memenuhi $8x^3-6x-1=0$. Polinomial kubik ini tidak punya akar rasional (kandidatnya hanya $\pm1$, $\pm\frac12$, $\pm\frac14$, $\pm\frac18$, dan tidak ada yang berhasil), sehingga tidak dapat dipecah, dan $\cos20^\circ$ berderajat $3$. Tiga bukan pangkat dari $2$, jadi $20^\circ$ tidak dapat dilukis, dan sudut $60^\circ$ tidak dapat dibagi tiga. Bila $1^\circ$ dapat dilukis, maka $20^\circ$ juga (dua puluh salinan), itulah sebabnya tidak ada derajat bulat di luar kelipatan $3$ yang dapat dilukis.

**Tiga masalah klasik.**

- **Membagi tiga sudut:** mungkin untuk sudut khusus ($90^\circ$ memberi $30^\circ$), mustahil secara umum ($60^\circ$ memberi $20^\circ$).
- **Menggandakan kubus:** kubus bervolume dua kali lipat memerlukan rusuk $\sqrt[3]{2}$ kali rusuk lama, bilangan berderajat $3$.
- **Mengkuadratkan lingkaran:** persegi yang luasnya sama dengan lingkaran berjari-jari $1$ memerlukan sisi $\sqrt\pi$. Lindemann membuktikan pada 1882 bahwa $\pi$ transenden, artinya bukan akar polinomial berkoefisien bulat mana pun, sehingga $\sqrt\pi$ juga tak terjangkau (lihat [π dan bilangan transenden](article:irrational-numbers#pi-e-transcendental)).

**Alat lain dapat melakukannya.** Archimedes membagi tiga sudut mana pun dengan penggaris yang memiliki dua tanda berjarak satu satuan (*penggaris bertanda*, disebut *neusis* dalam bahasa Yunani). Letakkan penggaris melalui $B$ sehingga satu tanda berada di lingkaran di $C$ dan tanda lainnya di garis $AO$ yang diperpanjang, di $D$; sudut di $D$ tepat sepertiga sudut di $O$. Lipat kertas (origami) dan beberapa kurva lain juga dapat membagi tiga sebuah sudut. Kemustahilan itu hanya berlaku untuk *penggaris dan jangka saja*.

Gambar di bawah memperlihatkan pembagian tiga Archimedes untuk sudut mana pun, dan menyatakan apakah penggaris dan jangka saja dapat melakukannya.`,
          ),
        },
        { kind: 'widget', name: 'constructtrisect' },
      ],
    },

    /* ----------------------------------------------------------------------------------- polygons */
    {
      id: 'regular-polygons',
      heading: L('Which regular polygons can be built with a ruler and compass?', 'Segi banyak beraturan mana yang dapat dilukis dengan penggaris dan jangka?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A regular polygon with $n$ sides can be built exactly when $n$ is a power of $2$ times different Fermat primes ($3$, $5$, $17$, $257$, $65537$); the first few are $3$, $4$, $5$, $6$, $8$, $10$, $12$, $15$, $16$, $17$.** This is the Gauss–Wantzel theorem. Carl Friedrich Gauss found at 18 that the regular 17-gon can be built, published it in 1801, and asked for one on his gravestone; Pierre Wantzel proved in 1837 that no other regular polygons can.

Why those numbers? Building the $n$-gon means building the angle $\frac{360^\circ}{n}$, that is, the number $\cos\frac{2\pi}{n}$, whose degree over the rationals is $\frac{\varphi(n)}{2}$ for $n\ge3$. Here $\varphi(n)$ is Euler's function, the count of whole numbers from $1$ to $n$ that share no factor with $n$. That degree is a power of $2$ exactly when $\varphi(n)$ is, and $\varphi(n)$ is a power of $2$ exactly when $n$ is a power of $2$ times different primes of the form $2^{2^k}+1$ (Fermat primes). The only five known are $3$, $5$, $17$, $257$ and $65537$.

- **Pentagon ($5$):** $\cos72^\circ=\frac{\sqrt5-1}{4}$, one square root. Built by the Greeks.
- **Heptagon ($7$) and nonagon ($9$):** $\varphi(7)=6$ and $\varphi(9)=6$ are not powers of $2$, so they cannot be built. The $9$-gon would need the trisection of $120^\circ$, which is impossible.
- **17-gon:** $\varphi(17)=16$, and $\cos\frac{2\pi}{17}$ needs three nested layers of square roots.
- **257-gon and 65537-gon:** built on paper by Richelot (1832) and by Hermes (1894, after about ten years of work).

Type a number of sides to see why a polygon can or cannot be built.`,
            T`**Segi banyak beraturan bersisi $n$ dapat dilukis tepat bila $n$ adalah pangkat dari $2$ dikali bilangan prima Fermat yang berbeda ($3$, $5$, $17$, $257$, $65537$); beberapa yang pertama adalah $3$, $4$, $5$, $6$, $8$, $10$, $12$, $15$, $16$, $17$.** Inilah teorema Gauss–Wantzel. Carl Friedrich Gauss menemukan pada usia 18 tahun bahwa segi tujuh belas beraturan dapat dilukis, menerbitkannya pada 1801, dan meminta satu di batu nisannya; Pierre Wantzel membuktikan pada 1837 bahwa tidak ada segi banyak beraturan lain yang dapat.

Mengapa bilangan-bilangan itu? Melukis segi-$n$ berarti melukis sudut $\frac{360^\circ}{n}$, yaitu bilangan $\cos\frac{2\pi}{n}$, yang derajatnya atas bilangan rasional adalah $\frac{\varphi(n)}{2}$ untuk $n\ge3$. Di sini $\varphi(n)$ adalah fungsi Euler, banyaknya bilangan bulat dari $1$ sampai $n$ yang tidak punya faktor persekutuan dengan $n$. Derajat itu pangkat dari $2$ tepat bila $\varphi(n)$ demikian, dan $\varphi(n)$ pangkat dari $2$ tepat bila $n$ adalah pangkat dari $2$ dikali bilangan prima berbeda yang berbentuk $2^{2^k}+1$ (prima Fermat). Hanya lima yang diketahui: $3$, $5$, $17$, $257$, dan $65537$.

- **Segi lima ($5$):** $\cos72^\circ=\frac{\sqrt5-1}{4}$, satu akar kuadrat. Dilukis bangsa Yunani.
- **Segi tujuh ($7$) dan segi sembilan ($9$):** $\varphi(7)=6$ dan $\varphi(9)=6$ bukan pangkat dari $2$, jadi tidak dapat dilukis. Segi sembilan memerlukan pembagian tiga $120^\circ$, yang mustahil.
- **Segi tujuh belas:** $\varphi(17)=16$, dan $\cos\frac{2\pi}{17}$ memerlukan tiga lapis akar kuadrat bersarang.
- **Segi 257 dan segi 65537:** dilukis di atas kertas oleh Richelot (1832) dan oleh Hermes (1894, setelah sekitar sepuluh tahun kerja).

Ketik banyak sisi untuk melihat mengapa sebuah segi banyak dapat atau tidak dapat dilukis.`,
          ),
        },
        { kind: 'widget', name: 'constructpoly' },
      ],
    },

    /* --------------------------------------------------------------------------------------- code */
    {
      id: 'constructions-in-code',
      heading: L('How do you do a construction in code?', 'Bagaimana melakukan lukisan dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In a program a construction is the crossing of two circles (or of a line and a circle) computed from the distance between the centers.** For circles of radii $r_1$ and $r_2$ whose centers are $d$ apart, the crossings lie at the distance $a=\frac{r_1^2-r_2^2+d^2}{2d}$ from the first center along the line between the centers, and at the height $h=\sqrt{r_1^2-a^2}$ on both sides of it. If $d>r_1+r_2$ or $d<|r_1-r_2|$ the circles miss each other and there is no point.

Two details matter in floating-point arithmetic (see [why floating-point sums are not exact](article:floating-point-numbers)). First, when the circles only touch, $r_1^2-a^2$ can come out as $-10^{-17}$, so take ´max(h², 0)´ before the square root. Second, never compare lengths with ´==´: two distances that are equal on paper differ in the last digit, so compare with a small tolerance, and measure angles with ´atan2´.

The program builds the lens of the perpendicular bisector for $A=(0,0)$ and $B=(4,0)$, checks that the upper crossing makes an equilateral triangle, and tests which whole degrees and which polygons are buildable with Euler's $\varphi$ function.`,
            T`**Dalam program, sebuah lukisan adalah perpotongan dua lingkaran (atau garis dan lingkaran) yang dihitung dari jarak antarpusat.** Untuk lingkaran berjari-jari $r_1$ dan $r_2$ dengan pusat berjarak $d$, titik potongnya berada pada jarak $a=\frac{r_1^2-r_2^2+d^2}{2d}$ dari pusat pertama sepanjang garis antarpusat, dan pada tinggi $h=\sqrt{r_1^2-a^2}$ di kedua sisinya. Bila $d>r_1+r_2$ atau $d<|r_1-r_2|$ lingkaran saling melewati dan tidak ada titik.

Dua hal penting dalam aritmetika floating-point (lihat [mengapa penjumlahan floating-point tidak tepat](article:floating-point-numbers)). Pertama, ketika lingkaran hanya bersinggungan, $r_1^2-a^2$ dapat bernilai $-10^{-17}$, jadi ambil ´max(h², 0)´ sebelum akar kuadrat. Kedua, jangan pernah membandingkan panjang dengan ´==´: dua jarak yang sama di atas kertas berbeda di angka terakhir, jadi bandingkan dengan toleransi kecil, dan ukur sudut dengan ´atan2´.

Program membangun lensa garis sumbu untuk $A=(0,0)$ dan $B=(4,0)$, memeriksa bahwa titik potong atas membentuk segitiga sama sisi, dan menguji derajat bulat dan segi banyak mana yang dapat dilukis dengan fungsi $\varphi$ Euler.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: two circles cross, the lens, and which angles and polygons can be built', 'Python: dua lingkaran berpotongan, lensa, dan sudut serta segi banyak mana yang dapat dilukis'),
          code: `import math


def circles_meet(c1, r1, c2, r2):
    """The two points where two circles cross, the one on the left of c1 -> c2 first; None if they miss."""
    dx, dy = c2[0] - c1[0], c2[1] - c1[1]
    d = math.hypot(dx, dy)
    if d == 0 or d > r1 + r2 or d < abs(r1 - r2):
        return None
    a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    h = math.sqrt(max(r1 * r1 - a * a, 0.0))      # rounding can leave -1e-17 when the circles only touch
    mx, my = c1[0] + a * dx / d, c1[1] + a * dy / d
    return (mx - h * dy / d, my + h * dx / d), (mx + h * dy / d, my - h * dx / d)


def totient(n):
    return sum(1 for k in range(1, n + 1) if math.gcd(k, n) == 1)


def is_power_of_two(n):
    return n >= 1 and n & (n - 1) == 0


def angle_buildable(deg):
    """A whole number of degrees can be built when cos(deg) has a degree that is a power of two."""
    m = 360 // math.gcd(deg, 360)
    return is_power_of_two(1 if m <= 2 else totient(m) // 2)


def polygon_buildable(n):
    return n >= 3 and is_power_of_two(totient(n))


A, B = (0.0, 0.0), (4.0, 0.0)
P, Q = circles_meet(A, 4, B, 4)                       # the lens of the perpendicular bisector
print([round(v, 4) for v in P], [round(v, 4) for v in Q])    # [2.0, 3.4641] [2.0, -3.4641]
print(round(math.dist(P, A), 4), round(math.dist(P, B), 4), round(math.dist(A, B), 4))    # 4.0 4.0 4.0
print(round(math.degrees(math.atan2(P[1] - A[1], P[0] - A[0])), 4))    # 60.0: the angle PAB
print([d for d in range(1, 31) if angle_buildable(d)])     # [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
print([n for n in range(3, 41) if polygon_buildable(n)])   # [3, 4, 5, 6, 8, 10, 12, 15, 16, 17, 20, 24, 30, 32, 34, 40]
print(circles_meet((0, 0), 1, (5, 0), 1))                  # None: too far apart`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same crossing and the same two tests', 'JavaScript: perpotongan yang sama dan dua uji yang sama'),
          code: `const circlesMeet = ([x1, y1], r1, [x2, y2], r2) => {
  const dx = x2 - x1, dy = y2 - y1
  const d = Math.hypot(dx, dy)
  if (d === 0 || d > r1 + r2 || d < Math.abs(r1 - r2)) return null
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(r1 * r1 - a * a, 0))     // rounding can leave -1e-17 when the circles only touch
  const mx = x1 + (a * dx) / d, my = y1 + (a * dy) / d
  return [[mx - (h * dy) / d, my + (h * dx) / d], [mx + (h * dy) / d, my - (h * dx) / d]]
}
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
const totient = (n) => { let t = 0; for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) t++; return t }
const isPowerOfTwo = (n) => n >= 1 && (n & (n - 1)) === 0
const angleBuildable = (deg) => { const m = 360 / gcd(deg, 360); return isPowerOfTwo(m <= 2 ? 1 : totient(m) / 2) }
const polygonBuildable = (n) => n >= 3 && isPowerOfTwo(totient(n))

const [P, Q] = circlesMeet([0, 0], 4, [4, 0], 4)
;[P.map((v) => +v.toFixed(4)), Q.map((v) => +v.toFixed(4))]                 // [[2, 3.4641], [2, -3.4641]]
;+(Math.atan2(P[1], P[0]) * 180 / Math.PI).toFixed(4)                       // 60
Array.from({ length: 30 }, (_, i) => i + 1).filter(angleBuildable)           // [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
Array.from({ length: 38 }, (_, i) => i + 3).filter(polygonBuildable)         // [3, 4, 5, 6, 8, 10, 12, 15, 16, 17, 20, 24, 30, 32, 34, 40]
circlesMeet([0, 0], 1, [5, 0], 1)                                             // null: too far apart`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the crossing of two circles and Euler\'s function', 'C++: perpotongan dua lingkaran dan fungsi Euler'),
          code: `#include <iostream>
#include <cstdio>
#include <cmath>
using namespace std;

double px, py, qx, qy;   // the two crossings, set by circlesMeet

int circlesMeet(double x1, double y1, double r1, double x2, double y2, double r2) {
  double dx = x2 - x1;
  double dy = y2 - y1;
  double d = sqrt(dx * dx + dy * dy);
  if (d == 0 || d > r1 + r2 || d < fabs(r1 - r2)) return 0;
  double a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  double h2 = r1 * r1 - a * a;
  double h = h2 > 0 ? sqrt(h2) : 0;       // rounding can leave -1e-17 when the circles only touch
  double mx = x1 + a * dx / d;
  double my = y1 + a * dy / d;
  px = mx - h * dy / d;
  py = my + h * dx / d;
  qx = mx + h * dy / d;
  qy = my - h * dx / d;
  return 1;
}

int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }

int totient(int n) {
  int result = n;
  int m = n;
  for (int p = 2; p * p <= m; p++) {
    if (m % p == 0) {
      while (m % p == 0) m /= p;
      result -= result / p;
    }
  }
  if (m > 1) result -= result / m;
  return result;
}

int isPowerOfTwo(int n) { return n >= 1 && (n & (n - 1)) == 0; }

int angleBuildable(int deg) {
  int m = 360 / gcd(deg, 360);
  return isPowerOfTwo(m <= 2 ? 1 : totient(m) / 2);
}

int main() {
  circlesMeet(0, 0, 4, 4, 0, 4);
  printf("%.4f %.4f %.4f %.4f\\n", px, py, qx, qy);
  printf("%.1f\\n", atan2(py, px) * 180.0 / 3.14159265358979323846);
  for (int d = 1; d <= 30; d++) if (angleBuildable(d)) printf("%d ", d);
  printf("\\n");
  for (int n = 3; n <= 40; n++) if (isPowerOfTwo(totient(n))) printf("%d ", n);
  printf("\\n");
  printf("%d\\n", circlesMeet(0, 0, 1, 5, 0, 1));
  return 0;
}

/* output:
2.0000 3.4641 2.0000 -3.4641
60.0
3 6 9 12 15 18 21 24 27 30
3 4 5 6 8 10 12 15 16 17 20 24 30 32 34 40
0
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do ruler-and-compass constructions come from?', 'Dari mana lukisan dengan penggaris dan jangka berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Construction is the oldest way of doing geometry, and the question of what it can and cannot do took two thousand years to answer.**

- **About 300 BC.** Euclid's *Elements* begins with the equilateral triangle and builds on the ruler and compass alone: bisecting an angle and a segment, perpendiculars, parallels, copying an angle, and the regular pentagon (Books I and IV). Book VI divides a segment into equal parts by the intercept theorem.
- **About 250 BC.** Archimedes trisects an angle with a marked ruler. Greek geometers tried for centuries to trisect an angle, double a cube and square a circle with the ruler and compass alone.
- **1672 and 1797.** Georg Mohr and, independently, Lorenzo Mascheroni show that every point that can be built with a ruler and compass can be built with the compass alone.
- **1796.** Gauss, aged 18, builds the regular 17-gon, the first new regular polygon since antiquity, and publishes the general rule in 1801.
- **1832.** Friedrich Richelot gives the construction of the 257-gon.
- **1837.** Pierre Wantzel proves that the doubling of the cube and the trisection of a general angle are impossible, and that Gauss's list of polygons is complete.
- **1882.** Ferdinand von Lindemann proves that $\pi$ is transcendental, which ends the squaring of the circle.
- **1894.** Johann Gustav Hermes finishes the construction of the 65537-gon, after about ten years.`,
            T`**Melukis adalah cara tertua mengerjakan geometri, dan pertanyaan tentang apa yang bisa dan tidak bisa dilakukannya memerlukan dua ribu tahun untuk dijawab.**

- **Sekitar 300 SM.** *Elements* Euklides diawali dengan segitiga sama sisi dan dibangun dengan penggaris dan jangka saja: membagi dua sudut dan ruas garis, garis tegak lurus, garis sejajar, menyalin sudut, dan segi lima beraturan (Buku I dan IV). Buku VI membagi ruas garis menjadi bagian sama dengan teorema intersep.
- **Sekitar 250 SM.** Archimedes membagi tiga sebuah sudut dengan penggaris bertanda. Ahli geometri Yunani berabad-abad mencoba membagi tiga sudut, menggandakan kubus, dan mengkuadratkan lingkaran dengan penggaris dan jangka saja.
- **1672 dan 1797.** Georg Mohr dan, secara terpisah, Lorenzo Mascheroni menunjukkan bahwa setiap titik yang dapat dilukis dengan penggaris dan jangka dapat dilukis dengan jangka saja.
- **1796.** Gauss, berusia 18 tahun, melukis segi tujuh belas beraturan, segi banyak beraturan baru pertama sejak zaman kuno, dan menerbitkan aturan umumnya pada 1801.
- **1832.** Friedrich Richelot memberikan lukisan segi 257.
- **1837.** Pierre Wantzel membuktikan bahwa menggandakan kubus dan membagi tiga sudut sembarang adalah mustahil, dan bahwa daftar segi banyak Gauss sudah lengkap.
- **1882.** Ferdinand von Lindemann membuktikan bahwa $\pi$ transenden, yang mengakhiri soal mengkuadratkan lingkaran.
- **1894.** Johann Gustav Hermes menyelesaikan lukisan segi 65537, setelah sekitar sepuluh tahun.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes in constructions?', 'Apa kesalahan umum dalam melukis?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes in constructions are the eight below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Read a length off the ruler (“5 cm”) | The ruler only draws lines. Copy a length with the compass; it keeps its opening. |
| ❌ Change the compass opening between the two arcs of a bisector | Keep one opening, so the four sides are equal and the figure is a rhombus. |
| ❌ Use an opening too small for the arcs to cross | To find a midpoint the opening must be more than half the segment. |
| ❌ Make $60^\circ$ with a protractor and call it a construction | Draw the equilateral triangle; its angles are exactly $60^\circ$ by SSS. |
| ❌ A construction is “drawing carefully” | It is a list of allowed moves with a proof; careless pencil work does not change the proof. |
| ❌ Any whole number of degrees can be built if you are careful | Only the multiples of $3$; $1^\circ$ and $20^\circ$ are impossible. |
| ❌ Trisecting an angle is impossible with any tool | Only with a ruler and compass alone; a marked ruler or paper folding can do it. |
| ❌ Every regular polygon can be built, such as the heptagon | Only when $n$ is a power of $2$ times different Fermat primes; $7$ and $9$ cannot. |`,
            T`**Kesalahan paling umum dalam melukis adalah delapan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Membaca panjang dari penggaris (“5 cm”) | Penggaris hanya menarik garis. Salin panjang dengan jangka; ia mempertahankan bukaannya. |
| ❌ Mengubah bukaan jangka di antara kedua busur garis bagi | Pertahankan satu bukaan, sehingga keempat sisi sama dan bangunnya belah ketupat. |
| ❌ Memakai bukaan yang terlalu kecil sehingga busur tidak berpotongan | Untuk mencari titik tengah, bukaan harus lebih dari setengah ruas garis. |
| ❌ Membuat $60^\circ$ dengan busur derajat dan menyebutnya lukisan | Gambar segitiga sama sisi; sudutnya tepat $60^\circ$ menurut SSS. |
| ❌ Melukis berarti “menggambar dengan hati-hati” | Lukisan adalah daftar langkah yang diperbolehkan disertai bukti; pensil yang ceroboh tidak mengubah buktinya. |
| ❌ Setiap derajat bulat dapat dilukis bila kita teliti | Hanya kelipatan $3$; $1^\circ$ dan $20^\circ$ mustahil. |
| ❌ Membagi tiga sudut mustahil dengan alat apa pun | Hanya dengan penggaris dan jangka saja; penggaris bertanda atau lipatan kertas dapat melakukannya. |
| ❌ Setiap segi banyak beraturan dapat dilukis, misalnya segi tujuh | Hanya bila $n$ adalah pangkat dari $2$ dikali prima Fermat yang berbeda; $7$ dan $9$ tidak dapat. |`,
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
              L(T`A compass keeps its opening, so it can copy a length.`, T`Jangka mempertahankan bukaannya, sehingga dapat menyalin panjang.`),
              L(T`The ruler of a construction has no numbers.`, T`Penggaris dalam melukis tidak memiliki angka.`),
              L(T`The perpendicular bisector of $AB$ is made with two circles of the same radius around $A$ and $B$.`, T`Garis sumbu $AB$ dibuat dengan dua lingkaran berjari-jari sama berpusat di $A$ dan $B$.`),
              L(T`An equilateral triangle gives $60^\circ$.`, T`Segitiga sama sisi memberi $60^\circ$.`),
              L(T`A ruler and compass can trisect every angle.`, T`Penggaris dan jangka dapat membagi tiga setiap sudut.`),
              L(T`A regular heptagon can be built with a ruler and compass.`, T`Segi tujuh beraturan dapat dilukis dengan penggaris dan jangka.`),
            ],
            answer: [true, true, true, true, false, false],
            explain: L(
              T`A general angle cannot be trisected (for $60^\circ$ you would need $\cos20^\circ$, of degree $3$). A heptagon would need $\varphi(7)=6$ to be a power of $2$, and it is not.`,
              T`Sudut sembarang tidak dapat dibagi tiga (untuk $60^\circ$ diperlukan $\cos20^\circ$, yang berderajat $3$). Segi tujuh memerlukan $\varphi(7)=6$ berupa pangkat dari $2$, dan bukan.`,
            ),
            hint: L(T`Think about which of these are limits of the tools, and which are the tools' strengths.`, T`Pikirkan mana yang merupakan batas alat dan mana yang kekuatan alat.`),
          },
        },
        {
          kind: 'activity',
          title: L('Order the steps', 'Urutkan langkah-langkahnya'),
          step: {
            kind: 'order',
            id: 'p2',
            prompt: L('Put the steps of the perpendicular bisector of $AB$ in order.', 'Urutkan langkah-langkah garis sumbu $AB$.'),
            lines: {
              en: [
                'Open the compass to more than half of AB.',
                'Put the point on A and draw an arc above and below AB.',
                'Keep the same opening, put the point on B and draw arcs that cross the first two.',
                'Draw the line through the two crossings with the ruler.',
                'The line meets AB at its midpoint, at a right angle.',
              ],
              id: [
                'Bukalah jangka lebih dari setengah AB.',
                'Letakkan kaki jangka di A dan gambar busur di atas dan di bawah AB.',
                'Pertahankan bukaan yang sama, letakkan kaki jangka di B dan gambar busur yang memotong kedua busur pertama.',
                'Tarik garis melalui kedua titik potong dengan penggaris.',
                'Garis itu memotong AB di titik tengahnya, dengan sudut siku-siku.',
              ],
            },
            explain: L(T`The opening is chosen first and kept, the arcs around $A$ come before those around $B$, and only then the ruler draws the line.`, T`Bukaan dipilih dahulu dan dipertahankan, busur di sekitar $A$ mendahului busur di sekitar $B$, dan barulah penggaris menarik garisnya.`),
            hint: L(T`The compass is used before the ruler, and the opening is set before any arc.`, T`Jangka dipakai sebelum penggaris, dan bukaan diatur sebelum busur mana pun.`),
          },
        },
        {
          kind: 'activity',
          title: L('Which angles can be built?', 'Sudut mana yang dapat dilukis?'),
          step: {
            kind: 'multi',
            id: 'p3',
            prompt: L(T`Which of these angles can be built exactly with a ruler and compass? Choose **all** that apply.`, T`Sudut mana yang dapat dilukis tepat dengan penggaris dan jangka? Pilih **semua** yang benar.`),
            options: [
              L(T`$15^\circ$`, T`$15^\circ$`),
              L(T`$20^\circ$`, T`$20^\circ$`),
              L(T`$75^\circ$`, T`$75^\circ$`),
              L(T`$40^\circ$`, T`$40^\circ$`),
              L(T`$105^\circ$`, T`$105^\circ$`),
            ],
            answer: [0, 2, 4],
            explain: L(T`Whole degrees that are multiples of $3$ can be built: $15$, $75$ and $105$. $20$ and $40$ are not multiples of $3$.`, T`Derajat bulat kelipatan $3$ dapat dilukis: $15$, $75$, dan $105$. $20$ dan $40$ bukan kelipatan $3$.`),
            hint: L(T`Which of them are multiples of $3$?`, T`Mana saja yang merupakan kelipatan $3$?`),
          },
        },
        {
          kind: 'activity',
          title: L('Half of an angle', 'Setengah sebuah sudut'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`The bisector cuts the angle into two equal angles.`, T`Garis bagi membagi sudut menjadi dua sudut sama besar.`), L(T`$80\div2$.`, T`$80\div2$.`)],
            explain: L(T`$80^\circ\div2=40^\circ$.`, T`$80^\circ\div2=40^\circ$.`),
            prompt: L(T`You bisect an angle of $80^\circ$. How big is each part, in degrees?`, T`Sebuah sudut $80^\circ$ dibagi dua. Berapa besar tiap bagian, dalam derajat?`),
            given: String.raw`x=v`,
            blanks: [{ label: 'x =', answer: 40 }],
          },
        },
        {
          kind: 'activity',
          title: L('A recipe for 75°', 'Resep untuk 75°'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`$75=60+15$ and $15$ is half of $30$.`, T`$75=60+15$ dan $15$ adalah setengah $30$.`), L(T`Bisect once for $30$, once more for $15$.`, T`Bagi dua sekali untuk $30$, sekali lagi untuk $15$.`)],
            explain: L(T`$60^\circ\to30^\circ\to15^\circ$ takes two bisections, then $60^\circ+15^\circ=75^\circ$. The two bisections are the answer.`, T`$60^\circ\to30^\circ\to15^\circ$ memerlukan dua kali membagi dua, lalu $60^\circ+15^\circ=75^\circ$. Dua kali membagi dua adalah jawabannya.`),
            prompt: L(T`How many times do you bisect an angle to get $15^\circ$ from $60^\circ$?`, T`Berapa kali sudut dibagi dua untuk mendapat $15^\circ$ dari $60^\circ$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 2 }],
          },
        },
        {
          kind: 'activity',
          title: L('Equal parts', 'Bagian sama'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`You need $n$ equal steps along the ray, and $n-1$ marks on the segment.`, T`Diperlukan $n$ langkah sama panjang sepanjang sinar, dan $n-1$ tanda pada ruas garis.`), L(T`$n=7$.`, T`$n=7$.`)],
            explain: L(T`Cutting a segment into $7$ equal parts takes $7-1=6$ cuts.`, T`Memotong ruas garis menjadi $7$ bagian sama memerlukan $7-1=6$ potongan.`),
            prompt: L(T`When you divide a segment into $7$ equal parts, how many points do you mark inside it (not counting the ends)?`, T`Ketika sebuah ruas garis dibagi menjadi $7$ bagian sama, berapa titik yang ditandai di dalamnya (tidak termasuk ujung)?`),
            given: String.raw`m=v`,
            blanks: [{ label: 'm =', answer: 6 }],
          },
        },
        {
          kind: 'activity',
          title: L('Euler\'s function', 'Fungsi Euler'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`Count the numbers from $1$ to $15$ with no common factor with $15$.`, T`Hitung bilangan dari $1$ sampai $15$ yang tidak punya faktor persekutuan dengan $15$.`), L(T`$\varphi(15)=\varphi(3)\cdot\varphi(5)=2\cdot4$.`, T`$\varphi(15)=\varphi(3)\cdot\varphi(5)=2\cdot4$.`)],
            explain: L(T`$\varphi(15)=2\cdot4=8$, a power of $2$, so the regular 15-gon can be built.`, T`$\varphi(15)=2\cdot4=8$, pangkat dari $2$, jadi segi lima belas beraturan dapat dilukis.`),
            prompt: L(T`What is $\varphi(15)$?`, T`Berapa $\varphi(15)$?`),
            given: String.raw`\varphi(15)=v`,
            blanks: [{ label: 'φ(15) =', answer: 8 }],
          },
        },
        {
          kind: 'activity',
          title: L('Which polygon?', 'Segi banyak yang mana?'),
          step: {
            kind: 'quiz',
            id: 'p8',
            prompt: L(T`Which of these regular polygons can **not** be built with a ruler and compass?`, T`Segi banyak beraturan mana yang **tidak** dapat dilukis dengan penggaris dan jangka?`),
            options: [
              L(T`the 17-gon`, T`segi tujuh belas`),
              L(T`the 12-gon`, T`segi dua belas`),
              L(T`the 9-gon`, T`segi sembilan`),
              L(T`the 10-gon`, T`segi sepuluh`),
            ],
            answer: 2,
            explain: L(T`$9=3\cdot3$ uses the Fermat prime $3$ twice, and $\varphi(9)=6$ is not a power of $2$. The others are $17$, $2^2\cdot3$ and $2\cdot5$.`, T`$9=3\cdot3$ memakai prima Fermat $3$ dua kali, dan $\varphi(9)=6$ bukan pangkat dari $2$. Yang lain adalah $17$, $2^2\cdot3$, dan $2\cdot5$.`),
            hint: L(T`Write each number as a power of $2$ times primes, and see which prime repeats or is not a Fermat prime.`, T`Tulis tiap bilangan sebagai pangkat dari $2$ dikali bilangan prima, dan lihat prima mana yang berulang atau bukan prima Fermat.`),
          },
        },
        {
          kind: 'activity',
          title: L('Why not trisect?', 'Mengapa tidak dapat dibagi tiga?'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L(T`Why can a ruler and compass not trisect an angle of $60^\circ$?`, T`Mengapa penggaris dan jangka tidak dapat membagi tiga sudut $60^\circ$?`),
            options: [
              L(T`it needs $\cos20^\circ$, a root of a cubic with no simpler factor, and its degree $3$ is not a power of $2$`, T`diperlukan $\cos20^\circ$, akar polinomial kubik yang tidak dapat difaktorkan, dan derajatnya $3$ bukan pangkat dari $2$`),
              L(T`the compass is too small`, T`jangkanya terlalu kecil`),
              L(T`nobody has found the construction yet`, T`belum ada yang menemukan lukisannya`),
              L(T`$60^\circ$ is not a multiple of $3$`, T`$60^\circ$ bukan kelipatan $3$`),
            ],
            answer: 0,
            explain: L(T`This is Wantzel's argument: the numbers a ruler and compass reach have degrees $1,2,4,8,\dots$, and $\cos20^\circ$ has degree $3$. It is proved impossible, not unsolved. (And $60$ is a multiple of $3$, which is why $60^\circ$ itself can be built.)`, T`Inilah argumen Wantzel: bilangan yang dicapai penggaris dan jangka berderajat $1,2,4,8,\dots$, dan $\cos20^\circ$ berderajat $3$. Terbukti mustahil, bukan belum terpecahkan. (Dan $60$ adalah kelipatan $3$, itu sebabnya $60^\circ$ sendiri dapat dilukis.)`),
            hint: L(T`Think about the degree of $\cos20^\circ$ over the rationals.`, T`Pikirkan derajat $\cos20^\circ$ atas bilangan rasional.`),
          },
        },
        {
          kind: 'activity',
          title: L('Why the bisector works', 'Mengapa garis bagi berhasil'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`In bisecting an angle at $O$, the triangles $OPR$ and $OQR$ are congruent because…`, T`Dalam membagi dua sudut di $O$, segitiga $OPR$ dan $OQR$ kongruen karena…`),
            options: [
              L(T`they have three pairs of equal sides: $OP=OQ$, $PR=QR$ and $OR$ shared`, T`mereka memiliki tiga pasang sisi sama: $OP=OQ$, $PR=QR$, dan $OR$ dipakai bersama`),
              L(T`they have the same angle at $O$`, T`mereka memiliki sudut yang sama di $O$`),
              L(T`they both have a right angle`, T`keduanya memiliki sudut siku-siku`),
              L(T`the ruler was straight`, T`penggarisnya lurus`),
            ],
            answer: 0,
            explain: L(T`$OP=OQ$ because $P$ and $Q$ are on one arc around $O$; $PR=QR$ because the two later arcs have the same radius. Three equal sides give congruent triangles (SSS), so the angles at $O$ are equal.`, T`$OP=OQ$ karena $P$ dan $Q$ berada pada satu busur berpusat di $O$; $PR=QR$ karena kedua busur berikutnya berjari-jari sama. Tiga sisi sama memberi segitiga kongruen (SSS), jadi sudut di $O$ sama besar.`),
            hint: L(T`Which three sides of the triangles are equal, and why?`, T`Ketiga sisi segitiga yang mana yang sama, dan mengapa?`),
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the angle', 'Isi sudutnya'),
          step: {
            kind: 'fill',
            id: 'p11',
            prompt: L('Complete the sentence.', 'Lengkapi kalimatnya.'),
            template: {
              en: 'The whole degrees that can be built are exactly the multiples of ___, so 3° can be built but ___° cannot.',
              id: 'Derajat bulat yang dapat dilukis tepat adalah kelipatan ___, jadi 3° dapat dilukis tetapi ___° tidak.',
            },
            blanks: { en: ['3', '1'], id: ['3', '1'] },
            explain: L(T`Multiples of $3$ can be built, and $1^\circ$ cannot: if it could, $20^\circ$ could too.`, T`Kelipatan $3$ dapat dilukis, dan $1^\circ$ tidak: bila bisa, $20^\circ$ juga bisa.`),
            hint: L(T`The smallest buildable whole angle is $3^\circ$.`, T`Sudut bulat terkecil yang dapat dilukis adalah $3^\circ$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Doubling a segment', 'Menggandakan ruas garis'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`You want a segment twice as long as $AB$. What do you do?`, T`Kita ingin ruas garis dua kali panjang $AB$. Apa yang dilakukan?`),
            options: [
              L(T`copy $AB$ twice, end to end, on a ray`, T`salin $AB$ dua kali, ujung ke ujung, pada sebuah sinar`),
              L(T`measure $AB$ in cm and multiply`, T`ukur $AB$ dalam cm lalu kalikan`),
              L(T`open the compass to $AB$ and draw a circle`, T`buka jangka sebesar $AB$ dan gambar lingkaran`),
              L(T`bisect $AB$`, T`bagi dua $AB$`),
            ],
            answer: 0,
            explain: L(T`The compass copies the length, and putting two copies end to end on a ray gives twice the length, with no measuring.`, T`Jangka menyalin panjangnya, dan dua salinan ujung ke ujung pada sebuah sinar memberi panjang dua kali, tanpa mengukur.`),
            hint: L(T`The ruler has no numbers, so you cannot measure.`, T`Penggaris tidak punya angka, jadi kita tidak dapat mengukur.`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: constructions at a glance', 'Ringkasan: lukisan sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Rules:** an unmarked ruler and a compass; three moves (line through two points, circle around a point, point at a crossing); the construction is exact and has a proof.
- **Copy a segment:** set the compass to its length and swing an arc from the new point; add and subtract by copying end to end or back.
- **Perpendicular bisector and midpoint:** two circles of one radius around the ends, join their crossings; justified by a rhombus or by SSS.
- **Angles:** equilateral triangle $\to60^\circ$; bisect with an arc and two equal arcs; copy by copying the chord; all by SSS.
- **Perpendicular and parallel:** the perpendicular bisector of two marked points; the opposite side of a rhombus.
- **Special angles:** $90^\circ$, $60^\circ$, $30^\circ$, $45^\circ$, $15^\circ$, $75^\circ$, $120^\circ$, $135^\circ$, $150^\circ$ from halving, adding and subtracting; with $72^\circ$, every whole number of degrees that is a multiple of $3$.
- **Equal parts:** equal steps on a ray and parallels (intercept theorem).
- **Impossible:** trisecting a general angle, doubling the cube, squaring the circle; the buildable numbers have degrees that are powers of $2$.
- **Polygons:** the regular $n$-gon is buildable exactly when $\varphi(n)$ is a power of $2$, that is, $n$ is a power of $2$ times different Fermat primes.
- **Code:** the crossing of two circles from $a=\frac{r_1^2-r_2^2+d^2}{2d}$ and $h=\sqrt{r_1^2-a^2}$; ´max(h², 0)´ and a tolerance.`,
            T`- **Aturan:** penggaris tanpa skala dan jangka; tiga langkah (garis melalui dua titik, lingkaran berpusat di satu titik, titik di perpotongan); lukisan itu tepat dan memiliki bukti.
- **Menyalin ruas garis:** atur jangka sepanjang ruas itu dan ayunkan busur dari titik yang baru; jumlahkan dan kurangkan dengan menyalin ujung ke ujung atau ke belakang.
- **Garis sumbu dan titik tengah:** dua lingkaran berjari-jari sama di kedua ujung, hubungkan titik potongnya; dibenarkan oleh belah ketupat atau oleh SSS.
- **Sudut:** segitiga sama sisi $\to60^\circ$; bagi dua dengan satu busur dan dua busur sama; salin dengan menyalin tali busur; semuanya dengan SSS.
- **Tegak lurus dan sejajar:** garis sumbu dua titik yang ditandai; sisi berhadapan belah ketupat.
- **Sudut istimewa:** $90^\circ$, $60^\circ$, $30^\circ$, $45^\circ$, $15^\circ$, $75^\circ$, $120^\circ$, $135^\circ$, $150^\circ$ dari membagi dua, menambah, dan mengurangi; dengan $72^\circ$, setiap derajat bulat kelipatan $3$.
- **Bagian sama:** langkah sama panjang pada sinar dan garis sejajar (teorema intersep).
- **Mustahil:** membagi tiga sudut sembarang, menggandakan kubus, mengkuadratkan lingkaran; bilangan yang dapat dilukis berderajat pangkat dari $2$.
- **Segi banyak:** segi-$n$ beraturan dapat dilukis tepat bila $\varphi(n)$ pangkat dari $2$, yaitu $n$ pangkat dari $2$ dikali prima Fermat yang berbeda.
- **Kode:** perpotongan dua lingkaran dari $a=\frac{r_1^2-r_2^2+d^2}{2d}$ dan $h=\sqrt{r_1^2-a^2}$; ´max(h², 0)´ dan toleransi.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Geometric construction', 'Lukisan geometri'), definition: L('A figure drawn with only an unmarked ruler and a compass, where every new point is a crossing of lines and circles already drawn.', 'Bangun yang digambar hanya dengan penggaris tanpa skala dan jangka, dengan setiap titik baru berupa perpotongan garis dan lingkaran yang sudah digambar.') },
    { term: L('Straightedge', 'Penggaris tanpa skala'), definition: L('A ruler without any marks, used only to draw a straight line through two points.', 'Penggaris tanpa tanda apa pun, hanya dipakai untuk menarik garis lurus melalui dua titik.') },
    { term: L('Perpendicular bisector', 'Garis sumbu'), definition: L('The line that cuts a segment in half at a right angle; every point on it is equally far from the two ends.', 'Garis yang membagi sebuah ruas garis menjadi dua sama panjang dengan sudut siku-siku; setiap titik padanya sama jauh dari kedua ujung.') },
    { term: L('Angle bisector', 'Garis bagi sudut'), definition: L('The ray from the vertex of an angle that divides it into two equal angles.', 'Sinar dari titik sudut sebuah sudut yang membaginya menjadi dua sudut sama besar.') },
    { term: L('Rhombus', 'Belah ketupat'), definition: L('A quadrilateral with four equal sides; its diagonals bisect each other at right angles and bisect its angles.', 'Segi empat dengan empat sisi sama panjang; diagonalnya saling membagi dua secara siku-siku dan membagi dua sudutnya.') },
    { term: L('Constructible number', 'Bilangan yang dapat dikonstruksi'), definition: L('A number that can be made as a length from a unit length with a ruler and compass; it is obtained from 1 by adding, subtracting, multiplying, dividing and taking square roots.', 'Bilangan yang dapat dibuat sebagai panjang dari panjang satuan dengan penggaris dan jangka; ia diperoleh dari 1 dengan menambah, mengurangi, mengalikan, membagi, dan menarik akar kuadrat.') },
    { term: L('Degree of a number', 'Derajat sebuah bilangan'), definition: L('The smallest degree of a polynomial with whole-number coefficients that has the number as a root; a constructible number has a degree that is a power of 2.', 'Derajat terkecil polinomial berkoefisien bilangan bulat yang memiliki bilangan itu sebagai akar; bilangan yang dapat dikonstruksi berderajat pangkat dari 2.') },
    { term: L('Fermat prime', 'Prima Fermat'), definition: L('A prime of the form 2 to the power 2^k, plus 1; only five are known: 3, 5, 17, 257 and 65537.', 'Bilangan prima berbentuk 2 pangkat 2^k, ditambah 1; hanya lima yang diketahui: 3, 5, 17, 257, dan 65537.') },
    { term: L('Euler\'s totient function', 'Fungsi totien Euler'), definition: L('The number of whole numbers from 1 to n that have no common factor with n, written phi of n.', 'Banyaknya bilangan bulat dari 1 sampai n yang tidak memiliki faktor persekutuan dengan n, ditulis phi dari n.') },
    { term: L('Neusis', 'Neusis'), definition: L('A construction that uses a ruler with two marks, which can trisect any angle although a plain ruler and compass cannot.', 'Lukisan yang memakai penggaris dengan dua tanda, yang dapat membagi tiga sudut mana pun walaupun penggaris dan jangka biasa tidak dapat.') },
  ],

  howTo: [
    {
      name: L('How to construct the perpendicular bisector of a segment', 'Cara melukis garis sumbu sebuah ruas garis'),
      description: L('Mark two points that are equally far from both ends and join them: the line is the perpendicular bisector and gives the midpoint.', 'Tandai dua titik yang sama jauh dari kedua ujung dan hubungkan: garis itu adalah garis sumbu dan memberi titik tengah.'),
      steps: [
        { name: L('Open the compass', 'Bukalah jangka'), text: L('Open the compass to more than half the length of the segment AB.', 'Bukalah jangka lebih dari setengah panjang ruas garis AB.') },
        { name: L('Arcs around A', 'Busur di sekitar A'), text: L('Put the point on A and draw an arc above the segment and another below it.', 'Letakkan kaki jangka di A dan gambar busur di atas ruas garis dan satu lagi di bawahnya.') },
        { name: L('Arcs around B', 'Busur di sekitar B'), text: L('Keep the same opening, put the point on B and draw arcs that cross the first two at P and Q.', 'Pertahankan bukaan yang sama, letakkan kaki jangka di B dan gambar busur yang memotong kedua busur pertama di P dan Q.') },
        { name: L('Draw the line', 'Tarik garisnya'), text: L('Draw the line PQ with the ruler; it meets AB at the midpoint M, at a right angle.', 'Tarik garis PQ dengan penggaris; ia memotong AB di titik tengah M, dengan sudut siku-siku.') },
      ],
    },
    {
      name: L('How to bisect an angle with a compass', 'Cara membagi dua sudut dengan jangka'),
      description: L('Mark two points on the arms at the same distance from the vertex, then find the point that is equally far from both: the ray through it bisects the angle.', 'Tandai dua titik pada kaki sudut dengan jarak sama dari titik sudut, lalu cari titik yang sama jauh dari keduanya: sinar melalui titik itu membagi dua sudut.'),
      steps: [
        { name: L('Arc around the vertex', 'Busur di sekitar titik sudut'), text: L('Put the compass point on the vertex O and draw an arc that crosses both arms, at P and Q.', 'Letakkan kaki jangka di titik sudut O dan gambar busur yang memotong kedua kaki sudut, di P dan Q.') },
        { name: L('Arc around P', 'Busur di sekitar P'), text: L('Put the point on P and draw an arc inside the angle.', 'Letakkan kaki jangka di P dan gambar busur di dalam sudut.') },
        { name: L('Arc around Q', 'Busur di sekitar Q'), text: L('Keep the same opening, put the point on Q and draw an arc that crosses the previous one at R.', 'Pertahankan bukaan yang sama, letakkan kaki jangka di Q dan gambar busur yang memotong busur sebelumnya di R.') },
        { name: L('Draw the ray', 'Tarik sinarnya'), text: L('Draw the ray OR. It divides the angle into two equal angles.', 'Tarik sinar OR. Ia membagi sudut menjadi dua sudut sama besar.') },
      ],
    },
    {
      name: L('How to copy an angle with a compass', 'Cara menyalin sudut dengan jangka'),
      description: L('Copy the chord of the angle with the compass so that the new angle has three sides equal to the old one.', 'Salin tali busur sudut dengan jangka sehingga sudut yang baru memiliki tiga sisi yang sama dengan yang lama.'),
      steps: [
        { name: L('Draw the same arc twice', 'Gambar busur yang sama dua kali'), text: L('Draw an arc around the vertex O crossing the arms at P and Q, and the same arc around S crossing the new ray at U.', 'Gambar busur berpusat di titik sudut O yang memotong kaki sudut di P dan Q, dan busur yang sama berpusat di S yang memotong sinar baru di U.') },
        { name: L('Measure the chord', 'Ukur tali busurnya'), text: L('Open the compass to the distance PQ.', 'Bukalah jangka sebesar jarak PQ.') },
        { name: L('Mark the new point', 'Tandai titik yang baru'), text: L('Put the point on U and draw an arc that crosses the arc around S at V.', 'Letakkan kaki jangka di U dan gambar busur yang memotong busur berpusat di S di V.') },
        { name: L('Draw the ray', 'Tarik sinarnya'), text: L('Draw the ray SV. The angle USV equals the angle POQ.', 'Tarik sinar SV. Sudut USV sama dengan sudut POQ.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What tools are allowed in a geometric construction?', 'Alat apa yang diperbolehkan dalam lukisan geometri?'),
      a: L(
        'Only an unmarked ruler (a straightedge) and a compass. The ruler draws a line through two points, the compass draws a circle, and a new point may only be made where lines and circles already drawn cross.',
        'Hanya penggaris tanpa skala dan jangka. Penggaris menarik garis melalui dua titik, jangka menggambar lingkaran, dan titik baru hanya boleh dibuat di tempat garis dan lingkaran yang sudah digambar berpotongan.',
      ),
    },
    {
      q: L('How do you find the midpoint of a segment with a compass?', 'Bagaimana mencari titik tengah ruas garis dengan jangka?'),
      a: L(
        'Draw an arc of the same radius, more than half the segment, around each end, once above and once below. Join the two crossings with a ruler; the line meets the segment at its midpoint, at a right angle.',
        'Gambar busur berjari-jari sama, lebih dari setengah ruas garis, di sekitar masing-masing ujung, sekali di atas dan sekali di bawah. Hubungkan kedua titik potong dengan penggaris; garis itu memotong ruas garis di titik tengahnya, dengan sudut siku-siku.',
      ),
    },
    {
      q: L('How do you bisect an angle with a compass?', 'Bagaimana membagi dua sudut dengan jangka?'),
      a: L(
        'Draw an arc around the vertex to cut both arms, then draw two arcs of the same radius around those two points so that they cross inside the angle. The ray from the vertex through that crossing bisects the angle.',
        'Gambar busur berpusat di titik sudut untuk memotong kedua kaki sudut, lalu gambar dua busur berjari-jari sama berpusat di kedua titik itu sehingga berpotongan di dalam sudut. Sinar dari titik sudut melalui titik potong itu membagi dua sudut.',
      ),
    },
    {
      q: L('How do you construct a 60-degree angle?', 'Bagaimana melukis sudut 60 derajat?'),
      a: L(
        'Draw a segment AB, then circles around A through B and around B through A. They cross at C, and triangle ABC has three equal sides, so every angle is 60 degrees. The angle at A is the 60-degree angle.',
        'Gambar ruas garis AB, lalu lingkaran berpusat di A melalui B dan berpusat di B melalui A. Keduanya berpotongan di C, dan segitiga ABC memiliki tiga sisi sama, sehingga setiap sudutnya 60 derajat. Sudut di A adalah sudut 60 derajat itu.',
      ),
    },
    {
      q: L('How do you copy an angle with a compass and straightedge?', 'Bagaimana menyalin sudut dengan jangka dan penggaris?'),
      a: L(
        'Draw the same arc around the old vertex and the new one, measure the chord of the old angle with the compass, and mark it on the new arc. The ray through the mark makes an equal angle, because the triangles have three equal sides.',
        'Gambar busur yang sama di sekitar titik sudut lama dan yang baru, ukur tali busur sudut lama dengan jangka, dan tandai pada busur baru. Sinar melalui tanda itu membentuk sudut yang sama, karena kedua segitiga memiliki tiga sisi sama.',
      ),
    },
    {
      q: L('Which angles can be constructed with a compass and straightedge?', 'Sudut mana yang dapat dilukis dengan jangka dan penggaris?'),
      a: L(
        'Starting from 60 and 90 degrees you can halve, add and subtract, and with the pentagon angle of 72 degrees you reach every whole number of degrees that is a multiple of 3. One degree and 20 degrees cannot be built.',
        'Mulai dari 60 dan 90 derajat kita dapat membagi dua, menambah, dan mengurangi, dan dengan sudut segi lima 72 derajat kita mencapai setiap derajat bulat kelipatan 3. Satu derajat dan 20 derajat tidak dapat dilukis.',
      ),
    },
    {
      q: L('Why can an angle not be trisected with a compass and straightedge?', 'Mengapa sudut tidak dapat dibagi tiga dengan jangka dan penggaris?',),
      a: L(
        'A third of 60 degrees needs the cosine of 20 degrees, which is a root of a cubic with no simpler factor. A ruler and compass only reach numbers whose degree is a power of 2, and 3 is not, as Wantzel proved in 1837.',
        'Sepertiga 60 derajat memerlukan kosinus 20 derajat, yang merupakan akar polinomial kubik yang tidak dapat difaktorkan. Penggaris dan jangka hanya mencapai bilangan berderajat pangkat dari 2, dan 3 bukan, seperti dibuktikan Wantzel pada 1837.',
      ),
    },
    {
      q: L('Which regular polygons can be constructed?', 'Segi banyak beraturan mana yang dapat dilukis?'),
      a: L(
        'A regular polygon with n sides can be built when n is a power of 2 times different Fermat primes (3, 5, 17, 257, 65537). So the triangle, square, pentagon, hexagon, octagon and 17-gon can, but the heptagon and nonagon cannot.',
        'Segi banyak beraturan bersisi n dapat dilukis bila n adalah pangkat dari 2 dikali bilangan prima Fermat yang berbeda (3, 5, 17, 257, 65537). Jadi segitiga, persegi, segi lima, segi enam, segi delapan, dan segi tujuh belas dapat, tetapi segi tujuh dan segi sembilan tidak.',
      ),
    },
  ],

  references: [
    { title: 'Euclid\'s Elements (Books I, IV and VI)', author: 'Euclid, translated by Thomas L. Heath', year: 1956, source: 'Dover' },
    { title: 'What Is Mathematics? An Elementary Approach to Ideas and Methods (chapter III, geometrical constructions)', author: 'Richard Courant, Herbert Robbins', year: 1996, source: 'Oxford University Press' },
    { title: 'The Ruler and the Round: Classic Problems in Geometric Constructions', author: 'Nicholas D. Kazarinoff', year: 2003, source: 'Dover' },
    { title: 'Geometry: Euclid and Beyond', author: 'Robin Hartshorne', year: 2000, source: 'Springer' },
    { title: 'Galois Theory (chapter on geometric constructions)', author: 'Ian Stewart', year: 2015, source: 'CRC Press' },
    { title: 'Recherches sur les moyens de reconnaître si un problème de géométrie peut se résoudre avec la règle et le compas', author: 'Pierre-Laurent Wantzel', year: 1837, source: 'Journal de Mathématiques Pures et Appliquées 2' },
    { title: 'Disquisitiones Arithmeticae (section VII, the division of the circle)', author: 'Carl Friedrich Gauss', year: 1801, source: 'Gerhard Fleischer' },
  ],

  related: ['angles', 'triangles', 'circles', 'floating-point-numbers'],
}
