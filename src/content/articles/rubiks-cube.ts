import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './rubiks-cube.meta'

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

export const body: ArticleBody = {
  answer: L(
    T`A Rubik’s cube is a puzzle of 26 small pieces whose six faces turn, and its mathematics is the mathematics of permutations. It has $43\,252\,003\,274\,489\,856\,000$ reachable positions, repeating any sequence of turns enough times brings the cube back to the start (the sequence ´R U´ needs $105$ repeats), and every position can be solved in at most $20$ face turns, a number called God’s number.`,
    T`Kubus Rubik adalah teka-teki dari 26 keping kecil yang keenam sisinya dapat diputar, dan matematikanya adalah matematika permutasi. Ia memiliki $43.252.003.274.489.856.000$ posisi yang dapat dicapai, mengulang urutan putaran apa pun cukup banyak kali mengembalikan kubus ke awal (urutan ´R U´ memerlukan $105$ pengulangan), dan setiap posisi dapat dipecahkan dengan paling banyak $20$ putaran sisi, bilangan yang disebut God’s number.`,
  ),

  keyPoints: [
    L(T`A $3\times3\times3$ cube has $8$ corner pieces, $12$ edge pieces and $6$ fixed centers, and a position is a place and a twist or flip for each corner and edge.`, T`Kubus $3\times3\times3$ memiliki $8$ keping sudut, $12$ keping rusuk, dan $6$ pusat tetap, dan sebuah posisi adalah tempat serta putaran atau pembalikan untuk setiap sudut dan rusuk.`),
    L(T`Moves are written with the letters U, D, L, R, F, B, a prime for the inverse and a 2 for a half turn: ´R U R' U'´ is four moves.`, T`Gerakan ditulis dengan huruf U, D, L, R, F, B, tanda petik untuk kebalikan dan angka 2 untuk setengah putaran: ´R U R' U'´ adalah empat gerakan.`),
    L(T`Of all the ways to rebuild the cube, only one in twelve can be reached by turning, which leaves $43\,252\,003\,274\,489\,856\,000$ positions.`, T`Dari semua cara merakit ulang kubus, hanya satu dari dua belas yang dapat dicapai dengan memutar, sehingga tersisa $43.252.003.274.489.856.000$ posisi.`),
    L(T`A position is reachable exactly when the corner twists add up to a multiple of $3$, the edge flips to an even number, and the corners and the edges are permuted with the same parity.`, T`Sebuah posisi dapat dicapai tepat bila putaran sudut berjumlah kelipatan $3$, pembalikan rusuk berjumlah genap, dan sudut serta rusuk dipermutasikan dengan paritas yang sama.`),
    L(T`The moves form a group in which order matters: ´R U´ is not ´U R´, but ´R L´ is ´L R´; every sequence repeated enough times returns to the start, and the largest order is $1260$.`, T`Gerakan membentuk grup yang urutannya berpengaruh: ´R U´ bukan ´U R´, tetapi ´R L´ sama dengan ´L R´; setiap urutan yang diulang cukup banyak kembali ke awal, dan orde terbesar adalah $1260$.`),
    L(T`God’s number is $20$ face turns ($26$ if only quarter turns count); a counting argument alone shows that some position needs at least $18$.`, T`God’s number adalah $20$ putaran sisi ($26$ bila hanya putaran seperempat yang dihitung); argumen penghitungan saja menunjukkan bahwa ada posisi yang memerlukan sedikitnya $18$.`),
  ],

  sections: [
    /* ----------------------------------------------------------------------------- pieces */
    {
      id: 'what-is-it',
      heading: L('What is a Rubik’s cube made of?', 'Terbuat dari apa kubus Rubik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A Rubik’s cube is made of $26$ small pieces, called cubies, held together around a hidden core: $8$ corner pieces with three colored stickers, $12$ edge pieces with two, and $6$ center pieces with one, which makes $54$ stickers.** The corners and the edges are the pieces that move. Each center is fixed to the core and only spins on the spot, so the centers never change places with one another and the color of a face is decided by its center. Turning an outer face moves $8$ pieces, $4$ corners and $4$ edges, and turns the center of that face in place.

| Kind of piece | How many | Stickers on each | Stickers together | What a turn of a face does to it |
|---|---|---|---|---|
| Corner | 8 | 3 | 24 | moves it to another corner place and may twist it |
| Edge | 12 | 2 | 24 | moves it to another edge place and may flip it |
| Center | 6 | 1 | 6 | turns it on the spot, never moves it |

The totals are $8\cdot3+12\cdot2+6\cdot1=54$ stickers and $8+12+6=26=3^3-1$ pieces, the same $26$ visible little cubes as in a $3\times3\times3$ block, described in the [cube](article:cube#cubes-in-the-world) article.

A piece never changes its kind: a corner piece is always in a corner place and an edge piece in an edge place. So a position of the cube can be written down with four lists, which is also how a program stores it:

- for each of the $8$ corner places, which corner piece is there and how it is twisted, $0$, $1$ or $2$ thirds of a turn;
- for each of the $12$ edge places, which edge piece is there and whether it is flipped, $0$ or $1$.`,
            T`**Kubus Rubik terbuat dari $26$ keping kecil, yang disebut kubik, yang diikat mengelilingi inti tersembunyi: $8$ keping sudut dengan tiga stiker berwarna, $12$ keping rusuk dengan dua, dan $6$ keping pusat dengan satu, sehingga ada $54$ stiker.** Sudut dan rusuk adalah keping yang berpindah. Setiap pusat melekat pada inti dan hanya berputar di tempat, jadi pusat-pusat tak pernah bertukar tempat dan warna sebuah sisi ditentukan oleh pusatnya. Memutar sebuah sisi luar menggerakkan $8$ keping, $4$ sudut dan $4$ rusuk, dan memutar pusat sisi itu di tempatnya.

| Jenis keping | Banyaknya | Stiker pada tiap keping | Jumlah stiker | Yang dilakukan putaran sisi padanya |
|---|---|---|---|---|
| Sudut | 8 | 3 | 24 | memindahkannya ke tempat sudut lain dan dapat memutarnya |
| Rusuk | 12 | 2 | 24 | memindahkannya ke tempat rusuk lain dan dapat membaliknya |
| Pusat | 6 | 1 | 6 | memutarnya di tempat, tak pernah memindahkannya |

Jumlahnya $8\cdot3+12\cdot2+6\cdot1=54$ stiker dan $8+12+6=26=3^3-1$ keping, $26$ kubus kecil yang terlihat yang sama seperti pada balok $3\times3\times3$, dibahas dalam artikel [kubus](article:cube#cubes-in-the-world).

Sebuah keping tak pernah berganti jenis: keping sudut selalu di tempat sudut dan keping rusuk di tempat rusuk. Jadi sebuah posisi kubus dapat dituliskan dengan empat daftar, yang juga cara sebuah program menyimpannya:

- untuk setiap dari $8$ tempat sudut, keping sudut mana yang ada di sana dan bagaimana ia terputar, $0$, $1$, atau $2$ sepertiga putaran;
- untuk setiap dari $12$ tempat rusuk, keping rusuk mana yang ada di sana dan apakah ia terbalik, $0$ atau $1$.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- notation */
    {
      id: 'notation',
      heading: L('How do you write down the moves of a Rubik’s cube?', 'Bagaimana menuliskan gerakan kubus Rubik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Every face has a letter, U for up, D for down, L for left, R for right, F for front and B for back; a letter alone is a clockwise quarter turn of that face seen from outside it, a prime as in ´R'´ is a counter-clockwise quarter turn, and a 2 as in ´R2´ is a half turn.** A sequence is read from left to right, so ´R U R' U'´ is four moves: turn the right face clockwise, the top face clockwise, the right face back, the top face back. Each of the $6$ faces can be turned in $3$ ways, so there are $6\cdot3=18$ moves, or $12$ if half turns are written as two quarter turns.

The **inverse** of a sequence undoes it: write the moves backwards and invert each one. The inverse of ´R U2 F'´ is ´F U2 R'´. The notation was introduced by David Singmaster around 1980 and is now used all over the world. Try it below: scramble the cube, then turn it back with the way back shown under it.`,
            T`**Setiap sisi memiliki huruf, U untuk atas, D untuk bawah, L untuk kiri, R untuk kanan, F untuk depan, dan B untuk belakang; huruf saja adalah putaran seperempat searah jarum jam sisi itu dilihat dari luar, tanda petik seperti ´R'´ adalah putaran seperempat berlawanan arah jarum jam, dan angka 2 seperti ´R2´ adalah setengah putaran.** Sebuah urutan dibaca dari kiri ke kanan, jadi ´R U R' U'´ adalah empat gerakan: putar sisi kanan searah jarum jam, sisi atas searah jarum jam, sisi kanan kembali, sisi atas kembali. Setiap dari $6$ sisi dapat diputar dalam $3$ cara, jadi ada $6\cdot3=18$ gerakan, atau $12$ bila setengah putaran ditulis sebagai dua putaran seperempat.

**Kebalikan** sebuah urutan membatalkannya: tulis gerakannya mundur dan balik setiap gerakan. Kebalikan ´R U2 F'´ adalah ´F U2 R'´. Notasi ini diperkenalkan David Singmaster sekitar tahun 1980 dan kini dipakai di seluruh dunia. Cobalah di bawah: acak kubus, lalu putar kembali dengan jalan kembali yang ditunjukkan di bawahnya.`,
          ),
        },
        { kind: 'widget', name: 'rbplay' },
      ],
    },

    /* ----------------------------------------------------------------------------- count */
    {
      id: 'how-many-positions',
      heading: L('Why does a Rubik’s cube have 43 quintillion positions and not 519 quintillion?', 'Mengapa kubus Rubik memiliki 43 kuintiliun posisi dan bukan 519 kuintiliun?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Because only one of every twelve ways to put the pieces back together can be reached by turning the faces: of the 519,024,039,293,878,272,000 arrangements of a rebuilt cube, three conditions, with factors $3$, $2$ and $2$, keep only 43,252,003,274,489,856,000.** Count it one reason at a time:

1. The $8$ corner pieces can fill the $8$ corner places in $8!=40\,320$ ways.
2. Each corner piece can sit in $3$ twists, which is $3^8=6\,561$ more ways, but the twists always add up to a multiple of $3$, so the last corner has no choice: divide by $3$, which leaves $3^7=2\,187$.
3. The $12$ edge pieces can fill the $12$ edge places in $12!=479\,001\,600$ ways.
4. Each edge piece can be flipped or not, $2^{12}=4\,096$ ways, but the flips always add up to an even number: divide by $2$, which leaves $2^{11}=2\,048$.
5. The corners and the edges are always permuted by permutations of the same parity, both even or both odd, so half of the arrangements are out of reach: divide by $2$.

$$\frac{8!\cdot3^7\cdot12!\cdot2^{11}}{2}$$

That is $43\,252\,003\,274\,489\,856\,000$ positions, about $4.3\times10^{19}$. The reasons for the three divisions are the subject of the next section. The same number is stated briefly in the article on the [cube](article:cube#cubes-in-the-world); here is where it comes from. The $2\times2\times2$ cube has only corners, and since the whole cube may be turned, one corner can be held fixed: $7!\cdot3^6=3\,674\,160$ positions.

Switch the reasons on and off below, and watch what each one does to the count.`,
            T`**Karena hanya satu dari setiap dua belas cara memasang kembali keping yang dapat dicapai dengan memutar sisi: dari 519.024.039.293.878.272.000 susunan kubus yang dirakit ulang, tiga syarat, dengan faktor $3$, $2$, dan $2$, hanya menyisakan 43.252.003.274.489.856.000.** Hitung satu alasan demi satu alasan:

1. $8$ keping sudut dapat mengisi $8$ tempat sudut dalam $8!=40.320$ cara.
2. Setiap keping sudut dapat berada dalam $3$ putaran, yaitu $3^8=6.561$ cara lagi, tetapi putarannya selalu berjumlah kelipatan $3$, sehingga sudut terakhir tidak punya pilihan: bagi dengan $3$, sehingga tersisa $3^7=2.187$.
3. $12$ keping rusuk dapat mengisi $12$ tempat rusuk dalam $12!=479.001.600$ cara.
4. Setiap keping rusuk dapat dibalik atau tidak, $2^{12}=4.096$ cara, tetapi pembaliknya selalu berjumlah genap: bagi dengan $2$, sehingga tersisa $2^{11}=2.048$.
5. Sudut dan rusuk selalu dipermutasikan oleh permutasi yang paritasnya sama, keduanya genap atau keduanya ganjil, sehingga separuh susunan tak terjangkau: bagi dengan $2$.

$$\frac{8!\cdot3^7\cdot12!\cdot2^{11}}{2}$$

Itu $43.252.003.274.489.856.000$ posisi, sekitar $4{,}3\times10^{19}$. Alasan ketiga pembagian itu adalah pokok bahasan bagian berikutnya. Bilangan yang sama dinyatakan singkat dalam artikel [kubus](article:cube#cubes-in-the-world); di sini asal-usulnya. Kubus $2\times2\times2$ hanya memiliki sudut, dan karena seluruh kubus boleh diputar, satu sudut dapat ditahan tetap: $7!\cdot3^6=3.674.160$ posisi.

Aktifkan dan matikan alasan-alasan di bawah, dan lihat apa yang dilakukan masing-masing pada hitungannya.`,
          ),
        },
        { kind: 'widget', name: 'rbcount' },
        {
          kind: 'callout',
          tone: 'note',
          title: L('How big is 43 quintillion?', 'Seberapa besar 43 kuintiliun?'),
          text: L(
            T`Looking at one position every second, one after another, would take about $1.4$ trillion years, roughly a hundred times the age of the universe. At a billion positions a second it would still take about $1\,370$ years. And if you took the cube apart and put the pieces back at random, the chance that the result could be solved at all is $\frac{1}{12}$.`,
            T`Memandang satu posisi setiap detik, satu demi satu, memerlukan sekitar $1{,}4$ triliun tahun, kira-kira seratus kali usia alam semesta. Pada satu miliar posisi per detik pun masih diperlukan sekitar $1.370$ tahun. Dan bila kamu membongkar kubus dan memasang kepingnya kembali secara acak, peluang hasilnya dapat dipecahkan sama sekali adalah $\frac{1}{12}$.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------ impossible */
    {
      id: 'impossible-positions',
      heading: L('Which positions of a Rubik’s cube can never be solved?', 'Posisi kubus Rubik mana yang tak pernah dapat dipecahkan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A position can be solved exactly when it meets three conditions: the corner twists add up to a multiple of $3$, the edge flips add up to an even number, and the corner pieces and the edge pieces are permuted with the same parity; so a single twisted corner, a single flipped edge, or two swapped edges can never be solved without taking the cube apart.** Each condition holds for the solved cube and is kept by every turn:

- **Twists.** A quarter turn of U or D twists nothing. A quarter turn of R, L, F or B twists its four corners by $+1,+2,+1,+2$ thirds of a turn, which adds up to $6$, a multiple of $3$. So the total twist stays $0$ modulo $3$.
- **Flips.** With the usual way of counting flips, only a quarter turn of F or B flips edges, and it flips four of them, an even number. So the total flip stays even.
- **Parity.** A quarter turn moves four corners in a $4$-cycle and four edges in a $4$-cycle. A $4$-cycle is three swaps, an odd permutation, so every quarter turn changes the parity of the corners and the parity of the edges together.

That these three are the only conditions follows by counting. Taking the pieces out and putting them back gives $12$ times as many arrangements as there are positions, and each of the three conditions cuts the number by one factor of $3$, $2$ and $2$. A computer algebra system confirms that the group made by the six turns has exactly $43\,252\,003\,274\,489\,856\,000$ elements, which is the number of arrangements that meet the conditions, so every arrangement that meets them is reached by some sequence of turns.

| Position | Twists | Flips | Parity | Can it be solved? |
|---|---|---|---|---|
| One corner twisted | not a multiple of 3 | even | equal | No |
| One edge flipped | multiple of 3 | odd | equal | No |
| Two edges swapped | multiple of 3 | even | different | No |
| Two corners swapped | multiple of 3 | even | different | No |
| Two corners and two edges swapped | multiple of 3 | even | equal | Yes |
| All 12 edges flipped (the superflip) | multiple of 3 | even | equal | Yes |
| One corner twisted by 1 and another by 2 | 1 + 2 = 3 | even | equal | Yes |

Try them below: turn faces, which keeps all three ticks, then take the cube apart and watch one tick go.`,
            T`**Sebuah posisi dapat dipecahkan tepat bila memenuhi tiga syarat: putaran sudut berjumlah kelipatan $3$, pembalikan rusuk berjumlah genap, dan keping sudut serta keping rusuk dipermutasikan dengan paritas yang sama; jadi satu sudut yang terputar, satu rusuk yang terbalik, atau dua rusuk yang bertukar tak pernah dapat dipecahkan tanpa membongkar kubus.** Setiap syarat berlaku untuk kubus yang terpecahkan dan dijaga oleh setiap putaran:

- **Putaran.** Putaran seperempat U atau D tidak memutar apa pun. Putaran seperempat R, L, F, atau B memutar keempat sudutnya sebesar $+1,+2,+1,+2$ sepertiga putaran, yang berjumlah $6$, kelipatan $3$. Jadi jumlah putaran tetap $0$ modulo $3$.
- **Pembalikan.** Dengan cara menghitung pembalikan yang lazim, hanya putaran seperempat F atau B yang membalik rusuk, dan ia membalik empat di antaranya, bilangan genap. Jadi jumlah pembalikan tetap genap.
- **Paritas.** Putaran seperempat memindahkan empat sudut dalam siklus-$4$ dan empat rusuk dalam siklus-$4$. Siklus-$4$ adalah tiga pertukaran, permutasi ganjil, jadi setiap putaran seperempat mengubah paritas sudut dan paritas rusuk bersama-sama.

Bahwa ketiganya satu-satunya syarat berasal dari penghitungan. Mengeluarkan keping dan memasangnya kembali menghasilkan $12$ kali lebih banyak susunan daripada posisi, dan setiap syarat dari ketiganya mengurangi banyaknya dengan satu faktor $3$, $2$, dan $2$. Sistem aljabar komputer memastikan bahwa grup yang dibentuk keenam putaran memiliki tepat $43.252.003.274.489.856.000$ anggota, yaitu banyaknya susunan yang memenuhi syarat, jadi setiap susunan yang memenuhinya dicapai oleh suatu urutan putaran.

| Posisi | Putaran | Pembalikan | Paritas | Dapatkah dipecahkan? |
|---|---|---|---|---|
| Satu sudut terputar | bukan kelipatan 3 | genap | sama | Tidak |
| Satu rusuk terbalik | kelipatan 3 | ganjil | sama | Tidak |
| Dua rusuk bertukar | kelipatan 3 | genap | berbeda | Tidak |
| Dua sudut bertukar | kelipatan 3 | genap | berbeda | Tidak |
| Dua sudut dan dua rusuk bertukar | kelipatan 3 | genap | sama | Ya |
| Kedua belas rusuk terbalik (superflip) | kelipatan 3 | genap | sama | Ya |
| Satu sudut terputar 1 dan sudut lain 2 | 1 + 2 = 3 | genap | sama | Ya |

Cobalah di bawah: putar sisi, yang menjaga ketiga centang, lalu bongkar kubus dan lihat satu centang hilang.`,
          ),
        },
        { kind: 'widget', name: 'rbparity' },
        {
          kind: 'callout',
          tone: 'warning',
          title: L('Peeling stickers is not a solution', 'Mengelupas stiker bukan solusi'),
          text: L(
            T`A cube that was taken apart and rebuilt, or whose stickers were moved, is solvable only about one time in twelve. If a scrambled cube will not solve, no sequence of turns is wrong: the position is simply not one of the $43$ quintillion.`,
            T`Kubus yang dibongkar dan dirakit ulang, atau yang stikernya dipindahkan, hanya dapat dipecahkan sekitar satu dari dua belas kali. Bila kubus acak tak mau terpecahkan, bukan urutan putarannya yang salah: posisinya memang bukan satu dari $43$ kuintiliun itu.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- group */
    {
      id: 'group',
      heading: L('Why do the moves of a Rubik’s cube form a group?', 'Mengapa gerakan kubus Rubik membentuk grup?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Because turning the faces obeys the four rules that define a group: one sequence followed by another is again a sequence, doing nothing is a sequence, every sequence can be undone, and the way sequences are grouped does not matter; but the order in which they are done does matter, and that is what makes the cube hard.** Every move is a permutation of the $54$ stickers, and doing one after another is composing permutations. This is the *Rubik’s cube group*, a group of permutations in the sense of the permutation groups of group theory, and its $43\,252\,003\,274\,489\,856\,000$ elements are exactly the reachable positions: each position corresponds to one way of reaching it from the solved cube, up to sequences that do the same thing.

- **Identity.** The empty sequence leaves the cube alone. A quarter turn done four times is the identity: ´U U U U´ is nothing.
- **Inverses.** ´R'´ undoes ´R´, and the inverse of a sequence is the reversed sequence with every move inverted.
- **Order matters.** ´R U´ and ´U R´ give different cubes, and so do any two moves on neighboring faces. Two moves on opposite faces do commute: ´R L´ and ´L R´ are the same cube, because the two layers never touch.

A group can contain smaller groups, and this one gives a ladder. In 1981 Morwen Thistlethwaite solved the cube by going down a chain of groups, each inside the one before it, $G_0$, $G_1$, $G_2$, $G_3$ and the group with one element, where $G_0$ is everything, $G_1$ is made by U, D, L, R, F2, B2, $G_2$ by U, D, L2, R2, F2, B2 and $G_3$ by the six half turns. Each step needs only moves of the smaller group, and the groups have $43\,252\,003\,274\,489\,856\,000$, $21\,119\,142\,223\,872\,000$, $19\,508\,428\,800$ and $663\,552$ elements: the cube is shrunk by a factor $2\,048$, then $1\,082\,565$, then $29\,400$, then solved inside the last $663\,552$. His method needs at most $52$ moves, far more than the best possible, but the idea of searching in a nest of subgroups is what later led to $20$.`,
            T`**Karena memutar sisi menaati empat aturan yang mendefinisikan grup: satu urutan diikuti urutan lain adalah urutan lagi, tidak berbuat apa-apa adalah suatu urutan, setiap urutan dapat dibatalkan, dan cara urutan dikelompokkan tidak berpengaruh; tetapi urutan melakukannya berpengaruh, dan itulah yang membuat kubus sulit.** Setiap gerakan adalah permutasi dari $54$ stiker, dan melakukan satu demi satu adalah menggabungkan permutasi. Ini adalah *grup kubus Rubik*, grup permutasi dalam arti grup permutasi pada teori grup, dan $43.252.003.274.489.856.000$ anggotanya tepat posisi-posisi yang dapat dicapai: setiap posisi sesuai dengan satu cara mencapainya dari kubus terpecahkan, sampai urutan yang melakukan hal yang sama.

- **Identitas.** Urutan kosong membiarkan kubus. Putaran seperempat yang dilakukan empat kali adalah identitas: ´U U U U´ bukan apa-apa.
- **Kebalikan.** ´R'´ membatalkan ´R´, dan kebalikan sebuah urutan adalah urutan terbalik dengan setiap gerakan dibalik.
- **Urutan berpengaruh.** ´R U´ dan ´U R´ menghasilkan kubus yang berbeda, begitu pula dua gerakan pada sisi yang bersebelahan. Dua gerakan pada sisi berhadapan bertukar tempat: ´R L´ dan ´L R´ adalah kubus yang sama, karena kedua lapisan tak pernah bersentuhan.

Sebuah grup dapat memuat grup yang lebih kecil, dan grup ini memberi tangga. Pada 1981 Morwen Thistlethwaite memecahkan kubus dengan turun mengikuti rantai grup, masing-masing di dalam yang sebelumnya, $G_0$, $G_1$, $G_2$, $G_3$, dan grup dengan satu anggota, dengan $G_0$ seluruhnya, $G_1$ dibentuk oleh U, D, L, R, F2, B2, $G_2$ oleh U, D, L2, R2, F2, B2, dan $G_3$ oleh keenam setengah putaran. Setiap langkah hanya memerlukan gerakan grup yang lebih kecil, dan grup-grup itu memiliki $43.252.003.274.489.856.000$, $21.119.142.223.872.000$, $19.508.428.800$, dan $663.552$ anggota: kubus diperkecil dengan faktor $2.048$, lalu $1.082.565$, lalu $29.400$, lalu dipecahkan di dalam $663.552$ yang terakhir. Metodenya memerlukan paling banyak $52$ gerakan, jauh lebih banyak daripada yang terbaik, tetapi gagasan mencari dalam sarang subgrup itulah yang kemudian mengarah ke $20$.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- order */
    {
      id: 'order',
      heading: L('How many times must a sequence be repeated to bring the cube back?', 'Berapa kali sebuah urutan harus diulang agar kubus kembali?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Repeat a sequence enough times and the cube always returns to the start; the number of repeats is called the order of the sequence, and it is the least common multiple of the orders of its cycles: ´R U´ has order $105$, ´R U R' U'´ has order $6$, and no sequence has an order above $1\,260$.** After one pass of a sequence, each piece has moved to some place, then on to the next place at the next pass, and so on round a cycle of places, until it is back. A cycle of $\ell$ pieces needs $\ell$ passes for the pieces to be back in their places, and if the pieces come back twisted a corner cycle needs $3$ times as many passes, an edge cycle $2$ times as many. The pieces of different cycles are independent, so the cube is back when every cycle is, which is the [least common multiple](article:integers#gcd-lcm) of the cycle orders.

For ´R U´ the corners make a $5$-cycle that comes back twisted, which takes $5\cdot3=15$ passes, and one corner that stays in place but is twisted, $3$ passes; the edges make a $7$-cycle, $7$ passes. So the order is $\operatorname{lcm}(15,3,7)=105$.

The largest order is $1\,260$, reached for instance by ´R U2 D' B D'´. Its cycles have orders $9$, $15$, $14$, $2$ and $4$, and $\operatorname{lcm}(9,15,14,2,4)=1\,260$. No other combination of cycles that the three conditions of the previous section allow has a larger one, as a search through all cycle structures confirms.

Type any sequence below, and slide through its repeats to watch the cube come back.`,
            T`**Ulangi sebuah urutan cukup banyak kali dan kubus selalu kembali ke awal; banyak pengulangannya disebut orde urutan itu, dan ia adalah kelipatan persekutuan terkecil dari orde siklus-siklusnya: ´R U´ berorde $105$, ´R U R' U'´ berorde $6$, dan tak ada urutan dengan orde di atas $1.260$.** Setelah satu kali urutan, setiap keping berpindah ke suatu tempat, lalu ke tempat berikutnya pada urutan berikutnya, dan seterusnya mengelilingi sebuah siklus tempat, sampai ia kembali. Sebuah siklus dengan $\ell$ keping memerlukan $\ell$ kali agar keping-kepingnya kembali ke tempatnya, dan bila kepingnya kembali dalam keadaan terputar siklus sudut memerlukan $3$ kali lebih banyak, siklus rusuk $2$ kali lebih banyak. Keping dari siklus yang berbeda tak saling bergantung, jadi kubus kembali bila setiap siklus kembali, yaitu [kelipatan persekutuan terkecil](article:integers#gcd-lcm) dari orde siklus.

Untuk ´R U´ sudut-sudutnya membentuk siklus-$5$ yang kembali dalam keadaan terputar, yang memerlukan $5\cdot3=15$ kali, dan satu sudut yang tetap di tempat tetapi terputar, $3$ kali; rusuknya membentuk siklus-$7$, $7$ kali. Jadi ordenya $\operatorname{lcm}(15,3,7)=105$.

Orde terbesar adalah $1.260$, dicapai misalnya oleh ´R U2 D' B D'´. Orde siklusnya $9$, $15$, $14$, $2$, dan $4$, dan $\operatorname{lcm}(9,15,14,2,4)=1.260$. Tak ada kombinasi siklus lain yang diizinkan ketiga syarat pada bagian sebelumnya dengan orde lebih besar, seperti dipastikan pencarian melalui semua struktur siklus.

Ketik urutan apa pun di bawah, dan geser melalui pengulangannya untuk melihat kubus kembali.`,
          ),
        },
        { kind: 'widget', name: 'rborder' },
      ],
    },

    /* ------------------------------------------------------------------------- solving */
    {
      id: 'solving',
      heading: L('How do you solve a Rubik’s cube layer by layer?', 'Bagaimana memecahkan kubus Rubik lapis demi lapis?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Solve the cube one layer at a time: first the cross and the corners of the first layer, then the edges of the middle layer, then the last layer in four steps, each step using a short sequence that changes only the pieces being worked on and leaves the layers already finished alone.**

1. **The first-layer cross.** Put the four edge pieces of one color around that color’s center, each matching the side center it touches. This is done by looking, not by a fixed sequence.
2. **The first-layer corners.** Bring each corner piece of that color above its place and drop it in with a sequence such as ´R' D' R D´, repeated if needed; the sequence has order $6$, so it always comes back.
3. **The middle-layer edges.** Bring each of the four middle edges above its place and slide it in with ´U R U' R' U' F' U F´ for the right-hand slot, or its mirror image for the left-hand slot. It changes only the top layer and one middle-layer slot.
4. **The last-layer cross.** Look at the top face: the four edges show the top color in a dot, an L, a line or a cross. For a dot, do ´F R U R' U' F'´ once. For an L, turn the top until the two edges that show the top color are at the front and the right, then do it once. For a line, turn the top until the line runs from left to right, then do it once. The cross appears.
5. **Orient the last-layer corners.** Repeat the Sune ´R U R' U R U2 R'´, turning the top layer to the right place before each one, until all four corners show the top color. Three Sunes are always enough.
6. **Position the last-layer corners.** Use ´R' F R' B2 R F' R' B2 R2´, which cycles three corners of the top layer and changes nothing else, not even a twist, with the top layer turned between, until each corner is next to its own colors.
7. **Position the last-layer edges.** Use ´R U' R U R U R U' R' U' R2´, which cycles three edges of the top layer and nothing else, with the top layer turned between, until every edge is next to its own colors.

The sequences of steps 4 to 7 keep the first two layers because each changes only pieces of the top layer, and the last two never twist or flip anything, which is why the corners stay oriented while they are put in place. The table shows what a few well-known sequences do to the pieces, all checked by computer.

| Sequence | What it does | Order |
|---|---|---|
| R U R' U' | moves four corners and three edges | 6 |
| R U R' U R U2 R' (Sune) | changes only the top layer: twists four corners, cycles three edges | 6 |
| F R U R' U' F' | changes only the top layer: it is the cross maker | 6 |
| R' F R' B2 R F' R' B2 R2 | cycles three corners of the top layer, nothing else | 3 |
| R U' R U R U R U' R' U' R2 | cycles three edges of the top layer, nothing else | 3 |
| R U R' U' R' F R2 U' R' U' R U R' F' (T-perm) | swaps two corners and two edges, nothing else | 2 |
| U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2 | flips all twelve edges, nothing else (the superflip) | 2 |

The T-perm is the sequence that shows the parity rule at work: it cannot swap two corners without swapping two edges as well. And that these building blocks are enough is not luck: a computer search through all $62\,208$ positions of a last layer with the first two layers solved shows that every one of them is finished by at most nine of five blocks, a turn of the top layer, ´F R U R' U' F'´, the Sune, the corner cycle and the edge cycle.`,
            T`**Pecahkan kubus satu lapis sekali waktu: pertama salib dan sudut lapis pertama, lalu rusuk lapis tengah, lalu lapis terakhir dalam empat langkah, setiap langkah memakai urutan pendek yang hanya mengubah keping yang sedang dikerjakan dan membiarkan lapis yang sudah selesai.**

1. **Salib lapis pertama.** Letakkan empat keping rusuk berwarna sama mengelilingi pusat warna itu, masing-masing cocok dengan pusat samping yang disentuhnya. Ini dikerjakan dengan melihat, bukan dengan urutan tetap.
2. **Sudut lapis pertama.** Bawa setiap keping sudut berwarna itu ke atas tempatnya dan jatuhkan dengan urutan seperti ´R' D' R D´, diulang bila perlu; urutan itu berorde $6$, jadi ia selalu kembali.
3. **Rusuk lapis tengah.** Bawa setiap dari empat rusuk tengah ke atas tempatnya dan selipkan dengan ´U R U' R' U' F' U F´ untuk slot kanan, atau bayangan cerminnya untuk slot kiri. Ia hanya mengubah lapis atas dan satu slot lapis tengah.
4. **Salib lapis terakhir.** Lihat sisi atas: keempat rusuk menunjukkan warna atas dalam bentuk titik, L, garis, atau salib. Untuk titik, lakukan ´F R U R' U' F'´ sekali. Untuk L, putar sisi atas sampai kedua rusuk yang menunjukkan warna atas ada di depan dan di kanan, lalu lakukan sekali. Untuk garis, putar sisi atas sampai garis membentang dari kiri ke kanan, lalu lakukan sekali. Salib muncul.
5. **Orientasikan sudut lapis terakhir.** Ulangi Sune ´R U R' U R U2 R'´, dengan memutar lapis atas ke tempat yang tepat sebelum masing-masing, sampai keempat sudut menunjukkan warna atas. Tiga Sune selalu cukup.
6. **Tempatkan sudut lapis terakhir.** Pakai ´R' F R' B2 R F' R' B2 R2´, yang menyiklus tiga sudut lapis atas dan tidak mengubah yang lain, bahkan satu putaran pun, dengan lapis atas diputar di antaranya, sampai setiap sudut berada di sebelah warnanya sendiri.
7. **Tempatkan rusuk lapis terakhir.** Pakai ´R U' R U R U R U' R' U' R2´, yang menyiklus tiga rusuk lapis atas dan tak ada yang lain, dengan lapis atas diputar di antaranya, sampai setiap rusuk berada di sebelah warnanya sendiri.

Urutan pada langkah 4 sampai 7 menjaga dua lapis pertama karena masing-masing hanya mengubah keping lapis atas, dan dua yang terakhir tak pernah memutar atau membalik apa pun, itulah sebabnya sudut tetap terorientasi saat ditempatkan. Tabel menunjukkan apa yang dilakukan beberapa urutan terkenal pada keping, semuanya diperiksa komputer.

| Urutan | Yang dilakukan | Orde |
|---|---|---|
| R U R' U' | menggerakkan empat sudut dan tiga rusuk | 6 |
| R U R' U R U2 R' (Sune) | hanya mengubah lapis atas: memutar empat sudut, menyiklus tiga rusuk | 6 |
| F R U R' U' F' | hanya mengubah lapis atas: pembuat salib | 6 |
| R' F R' B2 R F' R' B2 R2 | menyiklus tiga sudut lapis atas, tak ada yang lain | 3 |
| R U' R U R U R U' R' U' R2 | menyiklus tiga rusuk lapis atas, tak ada yang lain | 3 |
| R U R' U' R' F R2 U' R' U' R U R' F' (T-perm) | menukar dua sudut dan dua rusuk, tak ada yang lain | 2 |
| U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2 | membalik kedua belas rusuk, tak ada yang lain (superflip) | 2 |

T-perm adalah urutan yang memperlihatkan aturan paritas bekerja: ia tak dapat menukar dua sudut tanpa menukar dua rusuk juga. Dan bahwa blok-blok bangunan ini cukup bukan kebetulan: pencarian komputer melalui seluruh $62.208$ posisi lapis terakhir dengan dua lapis pertama terpecahkan menunjukkan bahwa setiap posisi selesai dengan paling banyak sembilan dari lima blok, putaran sisi atas, ´F R U R' U' F'´, Sune, siklus sudut, dan siklus rusuk.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- god's number */
    {
      id: 'gods-number',
      heading: L('What is God’s number for the Rubik’s cube?', 'Berapa God’s number untuk kubus Rubik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**God’s number is $20$: every position of the Rubik’s cube can be solved in at most $20$ face turns, and some positions need all $20$.** Here a half turn counts as one move. If only quarter turns count, God’s number is $26$. The name is a joke about how many moves a perfect solver, who always knows the shortest way, would need in the worst case.

The best way to see why it is hard to find is to count the positions at each distance from the solved cube, by a breadth-first search, the same idea as in the [Tower of Hanoi](article:tower-of-hanoi) graph of states.

| Moves from solved | Positions at that distance | Sequences with no wasted turn |
|---|---|---|
| 0 | 1 | 1 |
| 1 | 18 | 18 |
| 2 | 243 | 243 |
| 3 | 3,240 | 3,240 |
| 4 | 43,239 | 43,254 |
| 5 | 574,908 | 577,368 |

The two columns agree up to three moves and then split: two different sequences can lead to the same position, and from four moves on that happens, for instance ´U2 D2 R2 L2´ and ´R2 L2 U2 D2´ are one position. A sequence has a *wasted turn* if it turns the same face twice in a row, or two opposite faces in the wrong order, so the third column counts sequences that cannot be shortened that way. It grows by a factor of about $13.4$ at each step, and the first column grows almost as fast.

Counting alone gives a lower bound. All the sequences of at most $17$ moves with no wasted turn number about $2.0\times10^{19}$, fewer than the $4.3\times10^{19}$ positions, so some position needs at least $18$ moves. In 1995 Michael Reid showed that the superflip needs $20$. The upper bound came much later: in 2010 Tomas Rokicki, Herbert Kociemba, Morley Davidson and John Dethridge showed that $20$ moves always suffice, by splitting the positions into about $2.2$ billion groups, solving them with a program and using about $35$ years of computer time donated by Google. In 2014 Rokicki and Davidson showed that the quarter-turn number is $26$. The $2\times2\times2$ cube, searched completely in the same way, has God’s number $11$.`,
            T`**God’s number adalah $20$: setiap posisi kubus Rubik dapat dipecahkan dengan paling banyak $20$ putaran sisi, dan sebagian posisi memerlukan seluruh $20$.** Di sini setengah putaran dihitung sebagai satu gerakan. Bila hanya putaran seperempat yang dihitung, God’s number adalah $26$. Namanya adalah gurauan tentang berapa gerakan yang diperlukan pemecah sempurna, yang selalu tahu jalan terpendek, dalam kasus terburuk.

Cara terbaik melihat mengapa ia sulit ditemukan adalah menghitung posisi pada setiap jarak dari kubus terpecahkan, dengan pencarian melebar-dahulu, gagasan yang sama seperti pada graf keadaan [Menara Hanoi](article:tower-of-hanoi).

| Gerakan dari terpecahkan | Posisi pada jarak itu | Urutan tanpa putaran sia-sia |
|---|---|---|
| 0 | 1 | 1 |
| 1 | 18 | 18 |
| 2 | 243 | 243 |
| 3 | 3.240 | 3.240 |
| 4 | 43.239 | 43.254 |
| 5 | 574.908 | 577.368 |

Kedua kolom sama sampai tiga gerakan lalu berpisah: dua urutan yang berbeda dapat menuju posisi yang sama, dan dari empat gerakan itu terjadi, misalnya ´U2 D2 R2 L2´ dan ´R2 L2 U2 D2´ adalah satu posisi. Sebuah urutan memiliki *putaran sia-sia* bila ia memutar sisi yang sama dua kali berturut-turut, atau dua sisi berhadapan dalam urutan yang salah, jadi kolom ketiga menghitung urutan yang tak dapat dipersingkat dengan cara itu. Ia tumbuh dengan faktor sekitar $13{,}4$ pada setiap langkah, dan kolom pertama tumbuh hampir secepat itu.

Penghitungan saja memberi batas bawah. Semua urutan paling banyak $17$ gerakan tanpa putaran sia-sia berjumlah sekitar $2{,}0\times10^{19}$, lebih sedikit daripada $4{,}3\times10^{19}$ posisi, jadi ada posisi yang memerlukan sedikitnya $18$ gerakan. Pada 1995 Michael Reid menunjukkan bahwa superflip memerlukan $20$. Batas atasnya datang jauh kemudian: pada 2010 Tomas Rokicki, Herbert Kociemba, Morley Davidson, dan John Dethridge menunjukkan bahwa $20$ gerakan selalu cukup, dengan membagi posisi menjadi sekitar $2{,}2$ miliar kelompok, memecahkannya dengan program, dan memakai sekitar $35$ tahun waktu komputer yang disumbangkan Google. Pada 2014 Rokicki dan Davidson menunjukkan bahwa bilangan putaran seperempatnya adalah $26$. Kubus $2\times2\times2$, yang dicari lengkap dengan cara yang sama, memiliki God’s number $11$.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------------------- in code */
    {
      id: 'rubik-in-code',
      heading: L('How do you represent and turn a Rubik’s cube in a program?', 'Bagaimana merepresentasikan dan memutar kubus Rubik dalam program?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A program keeps a cube as four lists, the corner piece and its twist for each of the $8$ corner places and the edge piece and its flip for each of the $12$ edge places, and a move is just such a state: doing a move is composing the cube with it.** Composing two states $a$ then $b$ takes, for each place $i$, the piece that $a$ has at the place $b$ says it comes from, and adds the twists. With this one function every sequence is a loop, the order of a sequence is a loop that repeats it until the cube is solved again, and nothing is approximate: states are small whole numbers, so ´R U´ is $105$ in every language. The programs below hold the moves U, R and F (the others are written the same way), and print the order of ´R U´ and of ´R U R' U'´.`,
            T`**Program menyimpan kubus sebagai empat daftar, keping sudut dan putarannya untuk setiap dari $8$ tempat sudut serta keping rusuk dan pembaliknya untuk setiap dari $12$ tempat rusuk, dan sebuah gerakan hanyalah keadaan semacam itu: melakukan gerakan adalah menggabungkan kubus dengannya.** Menggabungkan dua keadaan $a$ lalu $b$ mengambil, untuk setiap tempat $i$, keping yang dimiliki $a$ di tempat yang dikatakan $b$ sebagai asalnya, dan menambahkan putarannya. Dengan satu fungsi ini setiap urutan adalah perulangan, orde sebuah urutan adalah perulangan yang mengulanginya sampai kubus terpecahkan lagi, dan tak ada yang pendekatan: keadaan adalah bilangan bulat kecil, jadi ´R U´ adalah $105$ di setiap bahasa. Program di bawah memuat gerakan U, R, dan F (yang lain ditulis dengan cara yang sama), dan mencetak orde ´R U´ dan ´R U R' U'´.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: the cube as four lists, and the order of a sequence', 'Python: kubus sebagai empat daftar, dan orde sebuah urutan'),
          code: `from math import gcd

# A state is four lists: the corner piece in each corner place, its twist (0 to 2),
# the edge piece in each edge place, its flip (0 or 1).
# Corners: URF UFL ULB UBR DFR DLF DBL DRB.   Edges: UR UF UL UB DR DF DL DB FR FL BL BR.
SOLVED = (list(range(8)), [0] * 8, list(range(12)), [0] * 12)
TURN = {  # a clockwise quarter turn of a face, seen from outside it
    'U': ([3, 0, 1, 2, 4, 5, 6, 7], [0] * 8, [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11], [0] * 12),
    'R': ([4, 1, 2, 0, 7, 5, 6, 3], [2, 0, 0, 1, 1, 0, 0, 2], [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0], [0] * 12),
    'F': ([1, 5, 2, 3, 0, 4, 6, 7], [1, 2, 0, 0, 2, 1, 0, 0], [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11], [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0]),
}


def then(a, b):
    """The state a, followed by the state b."""
    cp = [a[0][b[0][i]] for i in range(8)]
    co = [(a[1][b[0][i]] + b[1][i]) % 3 for i in range(8)]
    ep = [a[2][b[2][i]] for i in range(12)]
    eo = [(a[3][b[2][i]] + b[3][i]) % 2 for i in range(12)]
    return cp, co, ep, eo


def do(moves, state=SOLVED):
    """Carry out moves such as "R U R' U'" (a ' undoes a turn, a 2 is a half turn)."""
    for m in moves.split():
        quarters = {'': 1, '2': 2, "'": 3}[m[1:]]
        for _ in range(quarters):
            state = then(state, TURN[m[0]])
    return state


def order(moves):
    """How many times the moves must be repeated to bring the cube back to solved."""
    one = do(moves)
    state, n = one, 1
    while state != SOLVED:
        state, n = then(state, one), n + 1
    return n


def cycle_orders(state):
    """The cycles of the corners and of the edges, as the number of repeats each needs."""
    out = []
    for perm, twist, mod in ((state[0], state[1], 3), (state[2], state[3], 2)):
        seen = set()
        for start in range(len(perm)):
            length, total, place = 0, 0, start
            while place not in seen:
                seen.add(place)
                length, total, place = length + 1, total + twist[place], perm[place]
            if length > 1 or total % mod:
                out.append(length * (mod if total % mod else 1))
    return out


print(order('R U'))                  # 105
print(order("R U R' U'"))            # 6
print(order('F2'), order('U'))       # 2 4
print(cycle_orders(do('R U')))       # [3, 15, 7]: the order is their least common multiple
print(do("R U R' U'") == SOLVED, do("R U R' U' " * 6) == SOLVED)   # False True`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the same', 'JavaScript: yang sama'),
          code: `// A state: the corner piece in each corner place, its twist (0 to 2), the edge piece in each edge place, its flip (0 or 1).
// Corners: URF UFL ULB UBR DFR DLF DBL DRB.   Edges: UR UF UL UB DR DF DL DB FR FL BL BR.
const zeros = (n) => Array(n).fill(0)
const range = (n) => [...Array(n).keys()]
const SOLVED = { cp: range(8), co: zeros(8), ep: range(12), eo: zeros(12) }
const TURN = {   // a clockwise quarter turn of a face, seen from outside it
  U: { cp: [3, 0, 1, 2, 4, 5, 6, 7], co: zeros(8), ep: [3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11], eo: zeros(12) },
  R: { cp: [4, 1, 2, 0, 7, 5, 6, 3], co: [2, 0, 0, 1, 1, 0, 0, 2], ep: [8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0], eo: zeros(12) },
  F: { cp: [1, 5, 2, 3, 0, 4, 6, 7], co: [1, 2, 0, 0, 2, 1, 0, 0], ep: [0, 9, 2, 3, 4, 8, 6, 7, 1, 5, 10, 11], eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0] },
}

// the state a, followed by the state b
const then = (a, b) => ({
  cp: range(8).map((i) => a.cp[b.cp[i]]),
  co: range(8).map((i) => (a.co[b.cp[i]] + b.co[i]) % 3),
  ep: range(12).map((i) => a.ep[b.ep[i]]),
  eo: range(12).map((i) => (a.eo[b.ep[i]] + b.eo[i]) % 2),
})
const isSolved = (s) => JSON.stringify(s) === JSON.stringify(SOLVED)

// carry out moves such as "R U R' U'" (a ' undoes a turn, a 2 is a half turn)
function run(moves, state = SOLVED) {
  for (const m of moves.split(/\\s+/).filter(Boolean)) {
    const quarters = { '': 1, '2': 2, "'": 3 }[m.slice(1)]
    for (let k = 0; k < quarters; k++) state = then(state, TURN[m[0]])
  }
  return state
}

// how many times the moves must be repeated to bring the cube back to solved
function order(moves) {
  const one = run(moves)
  let state = one
  let n = 1
  while (!isSolved(state)) {
    state = then(state, one)
    n++
  }
  return n
}

order('R U')                      // 105
order("R U R' U'")                // 6
;[order('F2'), order('U')]        // [2, 4]
isSolved(run("R U R' U' ".repeat(6)))   // true`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the same with arrays of numbers', 'C++: yang sama dengan larik bilangan'),
          code: `#include <iostream>
#include <cstdio>
using namespace std;

// A state is 40 numbers: the corner piece in each of the 8 corner places, its twist (0 to 2),
// the edge piece in each of the 12 edge places, and its flip (0 or 1).
int solved[40] = {0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
int turnU[40] = {3, 0, 1, 2, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
int turnR[40] = {4, 1, 2, 0, 7, 5, 6, 3, 2, 0, 0, 1, 1, 0, 0, 2, 8, 1, 2, 3, 11, 5, 6, 7, 4, 9, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

// out = a, then b
void follow(int a[], int b[], int out[]) {
  for (int i = 0; i < 8; i++) {
    out[i] = a[b[i]];
    out[8 + i] = (a[8 + b[i]] + b[8 + i]) % 3;
  }
  for (int i = 0; i < 12; i++) {
    out[16 + i] = a[16 + b[16 + i]];
    out[28 + i] = (a[28 + b[16 + i]] + b[28 + i]) % 2;
  }
}

int isSolved(int s[]) {
  for (int i = 0; i < 40; i++) {
    if (s[i] != solved[i]) return 0;
  }
  return 1;
}

// how many times the state "one" must be repeated to bring the cube back to solved
int order(int one[]) {
  int state[40];
  int next[40];
  for (int i = 0; i < 40; i++) state[i] = one[i];
  int n = 1;
  while (!isSolved(state)) {
    follow(state, one, next);
    for (int i = 0; i < 40; i++) state[i] = next[i];
    n++;
  }
  return n;
}

int main() {
  int ru[40];
  follow(turnR, turnU, ru);          // R, then U
  printf("R U: %d\\n", order(ru));

  int r2[40];
  int r3[40];
  int u3[40];
  int t[40];
  int sexy[40];
  follow(turnR, turnR, r2);
  follow(r2, turnR, r3);             // R' is R three times
  follow(turnU, turnU, t);
  follow(t, turnU, u3);              // U' is U three times
  follow(turnR, turnU, t);           // R U
  follow(t, r3, sexy);               // R U R'
  follow(sexy, u3, t);               // R U R' U'
  printf("R U R' U': %d\\n", order(t));
  return 0;
}

/* output:
R U: 105
R U R' U': 6
*/`,
        },
      ],
    },

    /* ---------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Who invented the Rubik’s cube, and who solved its mathematics?', 'Siapa yang menciptakan kubus Rubik, dan siapa yang memecahkan matematikanya?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The cube was invented in 1974 by Ernő Rubik, a Hungarian architect and teacher in Budapest, as a teaching tool for three-dimensional movement, and its mathematics was worked out over the next forty years by hobbyists, mathematicians and computers.**

- **1974.** Ernő Rubik, the inventor, builds the first working cube; it is first sold in Hungary as the Magic Cube (*Bűvös kocka*).
- **1980.** The cube is sold around the world as Rubik’s Cube and becomes one of the best-selling toys of all time, with hundreds of millions of cubes sold.
- **1980 and 1981.** David Singmaster writes *Notes on Rubik’s “Magic Cube”* and introduces the notation with the letters U, D, L, R, F, B, and the count of positions.
- **1981.** Morwen Thistlethwaite finds a method that solves any cube in at most $52$ moves, by descending a chain of subgroups.
- **1982.** The first world championship is held in Budapest.
- **1995.** Michael Reid shows that the superflip needs $20$ moves.
- **2010.** Rokicki, Kociemba, Davidson and Dethridge prove that $20$ moves always suffice: God’s number is $20$.
- **2014.** Rokicki and Davidson show that God’s number is $26$ when only quarter turns count.
- **Today.** The fastest people solve the cube in about three seconds, and the cube is the standard example in courses on groups, algorithms and search.`,
            T`**Kubus ini diciptakan pada 1974 oleh Ernő Rubik, arsitek dan guru Hungaria di Budapest, sebagai alat mengajar gerak tiga dimensi, dan matematikanya dikerjakan selama empat puluh tahun berikutnya oleh para penggemar, matematikawan, dan komputer.**

- **1974.** Ernő Rubik, sang penemu, membuat kubus pertama yang berfungsi; ia mula-mula dijual di Hungaria sebagai Kubus Ajaib (*Bűvös kocka*).
- **1980.** Kubus dijual ke seluruh dunia sebagai Rubik’s Cube dan menjadi salah satu mainan terlaris sepanjang masa, dengan ratusan juta kubus terjual.
- **1980 dan 1981.** David Singmaster menulis *Notes on Rubik’s “Magic Cube”* dan memperkenalkan notasi dengan huruf U, D, L, R, F, B, serta penghitungan banyak posisi.
- **1981.** Morwen Thistlethwaite menemukan metode yang memecahkan kubus apa pun dengan paling banyak $52$ gerakan, dengan menuruni rantai subgrup.
- **1982.** Kejuaraan dunia pertama diadakan di Budapest.
- **1995.** Michael Reid menunjukkan bahwa superflip memerlukan $20$ gerakan.
- **2010.** Rokicki, Kociemba, Davidson, dan Dethridge membuktikan bahwa $20$ gerakan selalu cukup: God’s number adalah $20$.
- **2014.** Rokicki dan Davidson menunjukkan bahwa God’s number adalah $26$ bila hanya putaran seperempat yang dihitung.
- **Sekarang.** Orang tercepat memecahkan kubus dalam sekitar tiga detik, dan kubus ini adalah contoh baku dalam kuliah grup, algoritma, dan pencarian.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes about the Rubik’s cube?', 'Apa kesalahan umum tentang kubus Rubik?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes about the Rubik’s cube are the eight below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Any way of putting the pieces back can be solved | Only one rebuilt cube in twelve can be: the twists, the flips and the parity are conditions. |
| ❌ A single corner can be twisted back on its own | The twists always add up to a multiple of 3, so one twisted corner cannot be solved by turning. |
| ❌ ´R U´ and ´U R´ are the same | Moves on neighboring faces do not commute; only opposite faces do, as ´R L´ and ´L R´. |
| ❌ ´R2´ is the same as ´R'´ | ´R2´ is a half turn, ´R'´ is three quarter turns; ´R2´ is its own inverse. |
| ❌ Repeating a sequence never brings the cube back | It always does: the number of repeats is the order, the least common multiple of its cycles. |
| ❌ The cube has billions of positions | It has 43 quintillion: 43 252 003 274 489 856 000. |
| ❌ God’s number is how long a person needs | It is the worst case for a perfect solver: 20 turns. People use many more. |
| ❌ The center pieces move around | They only turn in place, so the color of each face is fixed by its center. |`,
            T`**Kesalahan paling umum tentang kubus Rubik adalah delapan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Cara apa pun memasang kembali keping dapat dipecahkan | Hanya satu dari dua belas kubus yang dirakit ulang yang dapat: putaran, pembalikan, dan paritas adalah syarat. |
| ❌ Satu sudut dapat diputar kembali sendiri | Putarannya selalu berjumlah kelipatan 3, jadi satu sudut terputar tak dapat dipecahkan dengan memutar. |
| ❌ ´R U´ dan ´U R´ sama | Gerakan pada sisi bersebelahan tidak bertukar tempat; hanya sisi berhadapan, seperti ´R L´ dan ´L R´. |
| ❌ ´R2´ sama dengan ´R'´ | ´R2´ adalah setengah putaran, ´R'´ adalah tiga putaran seperempat; ´R2´ adalah kebalikannya sendiri. |
| ❌ Mengulang urutan tak pernah mengembalikan kubus | Ia selalu kembali: banyak pengulangannya adalah orde, kelipatan persekutuan terkecil dari siklusnya. |
| ❌ Kubus memiliki miliaran posisi | Ia memiliki 43 kuintiliun: 43.252.003.274.489.856.000. |
| ❌ God’s number adalah lamanya seseorang memerlukan | Ia adalah kasus terburuk pemecah sempurna: 20 putaran. Orang memakai jauh lebih banyak. |
| ❌ Keping pusat berpindah-pindah | Mereka hanya berputar di tempat, jadi warna setiap sisi ditentukan oleh pusatnya. |`,
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
              L(T`A $3\times3\times3$ Rubik’s cube has $54$ stickers.`, T`Kubus Rubik $3\times3\times3$ memiliki $54$ stiker.`),
              L(T`Turning a face moves the center piece of that face to another place.`, T`Memutar sebuah sisi memindahkan keping pusat sisi itu ke tempat lain.`),
              L(T`´R L´ and ´L R´ give the same cube.`, T`´R L´ dan ´L R´ menghasilkan kubus yang sama.`),
              L(T`´R U´ and ´U R´ give the same cube.`, T`´R U´ dan ´U R´ menghasilkan kubus yang sama.`),
              L(T`A quarter turn of one face done four times leaves the cube as it was.`, T`Putaran seperempat satu sisi yang dilakukan empat kali membiarkan kubus seperti semula.`),
            ],
            answer: [true, false, true, false, true],
            explain: L(
              T`$8\cdot3+12\cdot2+6=54$. A center only turns in place. Opposite faces share no piece, so their moves commute; neighboring faces share pieces, so they do not. Four quarter turns make a full turn of one layer.`,
              T`$8\cdot3+12\cdot2+6=54$. Pusat hanya berputar di tempat. Sisi berhadapan tak berbagi keping, jadi gerakannya bertukar tempat; sisi bersebelahan berbagi keping, jadi tidak. Empat putaran seperempat membuat satu putaran penuh sebuah lapisan.`,
            ),
            hint: L(T`Count the stickers by kind of piece, and ask which faces share a corner.`, T`Hitung stiker menurut jenis keping, dan tanyakan sisi mana yang berbagi sudut.`),
          },
        },
        {
          kind: 'activity',
          title: L('Counting the moves', 'Menghitung gerakan'),
          step: {
            kind: 'quiz',
            id: 'p2',
            prompt: L('How many different moves are there if a quarter turn, its inverse and a half turn of each of the six faces all count?', 'Ada berapa gerakan berbeda bila putaran seperempat, kebalikannya, dan setengah putaran setiap dari keenam sisi semuanya dihitung?'),
            options: [L('6', '6'), L('12', '12'), L('18', '18'), L('24', '24')],
            answer: 2,
            explain: L(T`$6\cdot3=18$.`, T`$6\cdot3=18$.`),
            hint: L('Each face can be turned in three ways.', 'Setiap sisi dapat diputar dalam tiga cara.'),
          },
        },
        {
          kind: 'activity',
          title: L('The inverse of a sequence', 'Kebalikan sebuah urutan'),
          step: {
            kind: 'quiz',
            id: 'p3',
            prompt: L(`What is the inverse of the sequence R U2 F' ?`, `Apa kebalikan urutan R U2 F' ?`),
            options: [L(`F U2 R'`, `F U2 R'`), L(`F' U2 R'`, `F' U2 R'`), L(`R' U2 F`, `R' U2 F`), L(`F U2 R`, `F U2 R`)],
            answer: 0,
            explain: L(T`Write the moves backwards, $F'\,U2\,R$, and invert each one: $F$, $U2$, $R'$. A half turn is its own inverse.`, T`Tulis gerakannya mundur, $F'\,U2\,R$, dan balik masing-masing: $F$, $U2$, $R'$. Setengah putaran adalah kebalikannya sendiri.`),
            hint: L('Reverse the order, then invert every move.', 'Balik urutannya, lalu balik setiap gerakan.'),
          },
        },
        {
          kind: 'activity',
          title: L('Arranging the edges', 'Menyusun rusuk'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`The first place can take any of the $12$ pieces, the next any of the $11$ left.`, T`Tempat pertama dapat diisi salah satu dari $12$ keping, tempat berikutnya salah satu dari $11$ yang tersisa.`), L(T`The product is $12!$.`, T`Hasil kalinya $12!$.`)],
            explain: L(T`$12!=479\,001\,600$.`, T`$12!=479.001.600$.`),
            prompt: L(T`In how many ways can the $12$ edge pieces be put in the $12$ edge places, ignoring flips?`, T`Dalam berapa cara $12$ keping rusuk dapat diletakkan di $12$ tempat rusuk, mengabaikan pembalikan?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 479001600 }],
          },
        },
        {
          kind: 'activity',
          title: L('Fill in the count', 'Isi hitungannya'),
          step: {
            kind: 'fill',
            id: 'p5',
            prompt: L('Complete the formula for the number N of positions of the cube.', 'Lengkapi rumus banyak posisi N kubus.'),
            template: {
              en: 'N = 8! · 12!\n· 3^___ · 2^___\n/ ___',
              id: 'N = 8! · 12!\n· 3^___ · 2^___\n/ ___',
            },
            blanks: { en: ['7', '11', '2'], id: ['7', '11', '2'] },
            explain: L(T`The last corner twist and the last edge flip are forced, leaving $3^7$ and $2^{11}$, and half of the arrangements have the wrong parity.`, T`Putaran sudut terakhir dan pembalikan rusuk terakhir ditentukan, menyisakan $3^7$ dan $2^{11}$, dan separuh susunan memiliki paritas yang salah.`),
            hint: L(T`There are $8$ corners and $12$ edges, and one of each is forced; and a final division for the parity.`, T`Ada $8$ sudut dan $12$ rusuk, dan satu dari masing-masing ditentukan; dan pembagian terakhir untuk paritas.`),
          },
        },
        {
          kind: 'activity',
          title: L('Which can be solved?', 'Mana yang dapat dipecahkan?'),
          step: {
            kind: 'multi',
            id: 'p6',
            prompt: L('Which of these positions can be solved by turning the faces? Choose **all** that apply.', 'Posisi mana yang dapat dipecahkan dengan memutar sisi? Pilih **semua** yang benar.'),
            options: [
              L('One corner twisted in place, everything else solved', 'Satu sudut terputar di tempat, yang lain terpecahkan'),
              L('Two edge pieces swapped, everything else solved', 'Dua keping rusuk bertukar, yang lain terpecahkan'),
              L('All twelve edges flipped, everything else solved (the superflip)', 'Kedua belas rusuk terbalik, yang lain terpecahkan (superflip)'),
              L('Two corners swapped and two edges swapped', 'Dua sudut bertukar dan dua rusuk bertukar'),
              L('One edge flipped, everything else solved', 'Satu rusuk terbalik, yang lain terpecahkan'),
              L('One corner twisted by a third of a turn and another by two thirds', 'Satu sudut terputar sepertiga putaran dan sudut lain dua pertiga'),
            ],
            answer: [2, 3, 5],
            explain: L(T`The twists must add up to a multiple of $3$ ($1+2=3$ works), the flips to an even number ($12$ works), and the corner and edge permutations must have the same parity (two corners and two edges swapped works). A single twist, a single flip and a single swap of edges each break one condition.`, T`Putaran harus berjumlah kelipatan $3$ ($1+2=3$ berlaku), pembalikan berjumlah genap ($12$ berlaku), dan permutasi sudut serta rusuk harus berparitas sama (dua sudut dan dua rusuk bertukar berlaku). Satu putaran, satu pembalikan, dan satu pertukaran rusuk masing-masing melanggar satu syarat.`),
            hint: L('Check the three conditions one by one: twists mod 3, flips mod 2, parity of the two permutations.', 'Periksa ketiga syarat satu per satu: putaran mod 3, pembalikan mod 2, paritas kedua permutasi.'),
          },
        },
        {
          kind: 'activity',
          title: L('After many repeats', 'Setelah banyak pengulangan'),
          step: {
            kind: 'math',
            id: 'p7',
            hints: [L(T`The sequence has order $6$, so only the remainder of the number of repeats divided by $6$ matters.`, T`Urutan berorde $6$, jadi hanya sisa pembagian banyak pengulangan oleh $6$ yang berpengaruh.`), L(T`$100=16\cdot6+4$.`, T`$100=16\cdot6+4$.`)],
            explain: L(T`$100=16\cdot6+4$: sixteen full cycles bring the cube back, so $100$ repeats leave it where $4$ repeats do.`, T`$100=16\cdot6+4$: enam belas siklus penuh mengembalikan kubus, jadi $100$ pengulangan membiarkannya di tempat $4$ pengulangan.`),
            prompt: L(T`The sequence ´R U R' U'´ has order $6$. After $100$ repeats the cube is the same as after how many repeats (a number from $0$ to $5$)?`, T`Urutan ´R U R' U'´ berorde $6$. Setelah $100$ pengulangan kubus sama seperti setelah berapa pengulangan (bilangan dari $0$ sampai $5$)?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 4 }],
          },
        },
        {
          kind: 'activity',
          title: L('The order from the cycles', 'Orde dari siklus'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`Nothing is twisted or flipped, so each cycle needs as many repeats as its length.`, T`Tak ada yang terputar atau terbalik, jadi setiap siklus memerlukan pengulangan sebanyak panjangnya.`), L(T`$\operatorname{lcm}(3,5,4,2)$.`, T`$\operatorname{lcm}(3,5,4,2)$.`)],
            explain: L(T`$\operatorname{lcm}(3,5,4,2)=60$. (Such a sequence exists: the corner permutation is even and the edge permutation is even, since a $4$-cycle and a $2$-cycle are odd together.)`, T`$\operatorname{lcm}(3,5,4,2)=60$. (Urutan seperti itu ada: permutasi sudut genap dan permutasi rusuk genap, karena siklus-$4$ dan siklus-$2$ bersama-sama ganjil.)`),
            prompt: L(T`A sequence cycles the corners in a $3$-cycle and a $5$-cycle and the edges in a $4$-cycle and a $2$-cycle, with nothing twisted or flipped. What is its order?`, T`Sebuah urutan menyiklus sudut dalam siklus-$3$ dan siklus-$5$ dan rusuk dalam siklus-$4$ dan siklus-$2$, tanpa ada yang terputar atau terbalik. Berapa ordenya?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 60 }],
          },
        },
        {
          kind: 'activity',
          title: L('A random rebuild', 'Rakit ulang acak'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L('You take a cube apart and put the pieces back at random. What is the chance that the result can be solved?', 'Kamu membongkar kubus dan memasang kepingnya kembali secara acak. Berapa peluang hasilnya dapat dipecahkan?'),
            options: [L('1 in 2', '1 dari 2'), L('1 in 6', '1 dari 6'), L('1 in 12', '1 dari 12'), L('1 in 24', '1 dari 24')],
            answer: 2,
            explain: L(T`Of the 519,024,039,293,878,272,000 ways to rebuild, only $\frac{1}{3\cdot2\cdot2}=\frac{1}{12}$ meet the twist, flip and parity conditions.`, T`Dari 519.024.039.293.878.272.000 cara merakit ulang, hanya $\frac{1}{3\cdot2\cdot2}=\frac{1}{12}$ yang memenuhi syarat putaran, pembalikan, dan paritas.`),
            hint: L('The three conditions cut the arrangements by a factor of 3, 2 and 2.', 'Ketiga syarat mengurangi susunan dengan faktor 3, 2, dan 2.'),
          },
        },
        {
          kind: 'activity',
          title: L('The pocket cube', 'Kubus saku'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L(T`Hold one corner fixed: the other $7$ can be arranged in $7!$ ways.`, T`Tahan satu sudut tetap: $7$ sudut lainnya dapat disusun dalam $7!$ cara.`), L(T`Each of the $7$ corners can twist in $3$ ways, the last forced: $3^6$.`, T`Setiap dari $7$ sudut dapat terputar dalam $3$ cara, yang terakhir ditentukan: $3^6$.`)],
            explain: L(T`$7!\cdot3^6=5040\cdot729=3\,674\,160$.`, T`$7!\cdot3^6=5040\cdot729=3.674.160$.`),
            prompt: L(T`How many positions does the $2\times2\times2$ cube have, if one corner is held fixed?`, T`Berapa posisi kubus $2\times2\times2$, bila satu sudut ditahan tetap?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 3674160 }],
          },
        },
        {
          kind: 'activity',
          title: L('The order of the order', 'Urutan mencari orde'),
          step: {
            kind: 'order',
            id: 'p11',
            prompt: L('Put the steps of finding the order of a move sequence in order.', 'Urutkan langkah mencari orde sebuah urutan gerakan.'),
            lines: {
              en: ['Carry out the sequence once on the solved cube', 'Write down the cycles of the corner pieces and of the edge pieces, with their twists and flips', 'Give each cycle its order: its length, times 3 (corners) or 2 (edges) if it comes back twisted', 'Take the least common multiple of the orders of the cycles'],
              id: ['Lakukan urutan itu sekali pada kubus yang terpecahkan', 'Tuliskan siklus keping sudut dan keping rusuk, dengan putaran dan pembaliknya', 'Beri setiap siklus ordenya: panjangnya, dikali 3 (sudut) atau 2 (rusuk) bila ia kembali terputar', 'Ambil kelipatan persekutuan terkecil dari orde siklus-siklusnya'],
            },
            explain: L(T`The cycles can only be read after the sequence has been done, and the least common multiple is taken last, once every cycle has its own order.`, T`Siklus baru dapat dibaca setelah urutan dilakukan, dan kelipatan persekutuan terkecil diambil terakhir, setelah setiap siklus memiliki ordenya sendiri.`),
            hint: L(T`The least common multiple comes last.`, T`Kelipatan persekutuan terkecil datang terakhir.`),
          },
        },
        {
          kind: 'activity',
          title: L('The last layer', 'Lapis terakhir'),
          step: {
            kind: 'order',
            id: 'p12',
            prompt: L('Put the four steps of the last layer in order.', 'Urutkan keempat langkah lapis terakhir.'),
            lines: {
              en: ['Make the cross on the top face', 'Turn the four top corners so that they show the top color', 'Put the four top corners in their own places', 'Put the four top edges in their own places'],
              id: ['Buat salib pada sisi atas', 'Putar keempat sudut atas sehingga menunjukkan warna atas', 'Tempatkan keempat sudut atas di tempatnya sendiri', 'Tempatkan keempat rusuk atas di tempatnya sendiri'],
            },
            explain: L(T`The cross comes first because the sequences that orient corners and permute pieces keep the edges oriented; the permutations come after the orientations, since the permuting sequences do not change any twist.`, T`Salib datang pertama karena urutan yang mengorientasikan sudut dan mempermutasikan keping menjaga rusuk tetap terorientasi; permutasi datang setelah orientasi, karena urutan permutasi tidak mengubah putaran apa pun.`),
            hint: L('Orient before you permute.', 'Orientasikan sebelum mempermutasikan.'),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the Rubik’s cube at a glance', 'Ringkasan: kubus Rubik sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Pieces:** $8$ corners (three stickers), $12$ edges (two), $6$ fixed centers: $26$ pieces, $54$ stickers; a position is a place and a twist or flip for each corner and edge.
- **Moves:** U, D, L, R, F, B, a prime for the inverse and a 2 for a half turn; $18$ moves; the inverse of a sequence is reversed with every move inverted.
- **Positions:** 43,252,003,274,489,856,000, which is $8!\cdot3^7\cdot12!\cdot2^{11}$ divided by $2$; the $2\times2\times2$ cube has $3\,674\,160$.
- **Reachable:** twists add up to $0$ mod $3$, flips to $0$ mod $2$, corner and edge permutations have equal parity: one twisted corner, one flipped edge or two swapped edges can never be solved.
- **Group:** moves compose, can be undone, and do not commute in general (´R U´ is not ´U R´; opposite faces commute).
- **Order:** the least common multiple of the cycle orders; ´R U´ is $105$, ´R U R' U'´ is $6$, the largest is $1\,260$.
- **God’s number:** $20$ half-turn or $26$ quarter-turn moves; counting alone gives at least $18$; a layer-by-layer solution is far longer but uses a handful of sequences.`,
            T`- **Keping:** $8$ sudut (tiga stiker), $12$ rusuk (dua), $6$ pusat tetap: $26$ keping, $54$ stiker; sebuah posisi adalah tempat dan putaran atau pembalikan untuk setiap sudut dan rusuk.
- **Gerakan:** U, D, L, R, F, B, tanda petik untuk kebalikan dan angka 2 untuk setengah putaran; $18$ gerakan; kebalikan sebuah urutan adalah urutan terbalik dengan setiap gerakan dibalik.
- **Posisi:** 43.252.003.274.489.856.000, yaitu $8!\cdot3^7\cdot12!\cdot2^{11}$ dibagi $2$; kubus $2\times2\times2$ memiliki $3.674.160$.
- **Dapat dicapai:** putaran berjumlah $0$ mod $3$, pembalikan $0$ mod $2$, permutasi sudut dan rusuk berparitas sama: satu sudut terputar, satu rusuk terbalik, atau dua rusuk bertukar tak pernah dapat dipecahkan.
- **Grup:** gerakan dapat digabung, dapat dibatalkan, dan pada umumnya tidak bertukar tempat (´R U´ bukan ´U R´; sisi berhadapan bertukar).
- **Orde:** kelipatan persekutuan terkecil dari orde siklus; ´R U´ adalah $105$, ´R U R' U'´ adalah $6$, yang terbesar $1.260$.
- **God’s number:** $20$ gerakan setengah putaran atau $26$ putaran seperempat; penghitungan saja memberi sedikitnya $18$; solusi lapis demi lapis jauh lebih panjang tetapi memakai segelintir urutan.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Cubie', 'Kubik'), definition: L('One of the small pieces that make up the Rubik’s cube: a corner piece, an edge piece or a center piece.', 'Salah satu keping kecil penyusun kubus Rubik: keping sudut, keping rusuk, atau keping pusat.') },
    { term: L('Face turn', 'Putaran sisi'), definition: L('A turn of one outer layer of the cube, written with the letter of the face: a quarter turn clockwise, a prime for counter-clockwise, a 2 for a half turn.', 'Putaran satu lapis luar kubus, ditulis dengan huruf sisinya: putaran seperempat searah jarum jam, tanda petik untuk berlawanan, angka 2 untuk setengah putaran.') },
    { term: L('Twist', 'Putaran sudut'), definition: L('How a corner piece is turned in its place: 0, 1 or 2 thirds of a full turn.', 'Cara keping sudut terputar di tempatnya: 0, 1, atau 2 sepertiga putaran penuh.') },
    { term: L('Flip', 'Pembalikan'), definition: L('Whether an edge piece is turned over in its place: 0 or 1.', 'Apakah keping rusuk terbalik di tempatnya: 0 atau 1.') },
    { term: L('Parity', 'Paritas'), definition: L('Whether a permutation is made of an even or an odd number of swaps of two things; every quarter turn changes the parity of the corners and of the edges together.', 'Apakah sebuah permutasi tersusun dari banyak pertukaran dua benda yang genap atau ganjil; setiap putaran seperempat mengubah paritas sudut dan rusuk bersama-sama.') },
    { term: L('Rubik’s cube group', 'Grup kubus Rubik'), definition: L('The group of all positions reachable by turning the faces, with composition of move sequences as the operation; it has 43 252 003 274 489 856 000 elements.', 'Grup semua posisi yang dapat dicapai dengan memutar sisi, dengan penggabungan urutan gerakan sebagai operasinya; ia memiliki 43.252.003.274.489.856.000 anggota.') },
    { term: L('Order of a sequence', 'Orde sebuah urutan'), definition: L('The number of times a sequence of moves must be repeated to bring the cube back to the solved position; it is the least common multiple of the orders of its cycles.', 'Banyaknya sebuah urutan gerakan harus diulang agar kubus kembali ke posisi terpecahkan; ia adalah kelipatan persekutuan terkecil dari orde siklusnya.') },
    { term: L('God’s number', 'God’s number'), definition: L('The smallest number of moves that solves every position: 20 face turns, or 26 if only quarter turns count.', 'Banyak gerakan terkecil yang memecahkan setiap posisi: 20 putaran sisi, atau 26 bila hanya putaran seperempat yang dihitung.') },
    { term: L('Superflip', 'Superflip'), definition: L('The position in which all twelve edges are flipped and everything else is solved; it needs 20 face turns.', 'Posisi di mana kedua belas rusuk terbalik dan yang lain terpecahkan; ia memerlukan 20 putaran sisi.') },
    { term: L('Algorithm (cube)', 'Algoritma (kubus)'), definition: L('A fixed sequence of moves with a known effect on the pieces, such as the Sune or the T-perm, used to solve the cube.', 'Urutan gerakan tetap dengan pengaruh yang diketahui pada keping, seperti Sune atau T-perm, yang dipakai untuk memecahkan kubus.') },
  ],

  howTo: [
    {
      name: L('How to count the positions of a Rubik’s cube', 'Cara menghitung posisi kubus Rubik'),
      description: L('Multiply the arrangements of the corners and the edges, then divide by the three conditions that hold for every position that can be reached.', 'Kalikan susunan sudut dan rusuk, lalu bagi dengan tiga syarat yang berlaku untuk setiap posisi yang dapat dicapai.'),
      steps: [
        { name: L('Count the corner arrangements', 'Hitung susunan sudut'), text: L('The eight corner pieces fill the eight corner places in 8 factorial ways.', 'Delapan keping sudut mengisi delapan tempat sudut dalam 8 faktorial cara.') },
        { name: L('Count the corner twists', 'Hitung putaran sudut'), text: L('Each corner has three twists, but the twists add up to a multiple of three, so the last corner is forced: 3 to the seventh power.', 'Setiap sudut memiliki tiga putaran, tetapi putarannya berjumlah kelipatan tiga, sehingga sudut terakhir ditentukan: 3 pangkat tujuh.') },
        { name: L('Count the edge arrangements and flips', 'Hitung susunan dan pembalikan rusuk'), text: L('The twelve edge pieces fill the edge places in 12 factorial ways, and flips give 2 to the eleventh power since the last flip is forced.', 'Dua belas keping rusuk mengisi tempat rusuk dalam 12 faktorial cara, dan pembalikan memberi 2 pangkat sebelas karena pembalikan terakhir ditentukan.') },
        { name: L('Divide by the parity condition', 'Bagi dengan syarat paritas'), text: L('The corner and edge permutations must have the same parity, which halves the product: 43 252 003 274 489 856 000 positions.', 'Permutasi sudut dan rusuk harus berparitas sama, yang membagi dua hasil kalinya: 43.252.003.274.489.856.000 posisi.') },
      ],
    },
    {
      name: L('How to find the order of a move sequence', 'Cara mencari orde sebuah urutan gerakan'),
      description: L('Do the sequence once, write down the cycles of the pieces, and take the least common multiple of the orders of the cycles.', 'Lakukan urutan itu sekali, tuliskan siklus keping, dan ambil kelipatan persekutuan terkecil dari orde siklusnya.'),
      steps: [
        { name: L('Do the sequence once', 'Lakukan urutan sekali'), text: L('Carry it out on the solved cube and note where each corner piece and each edge piece has gone.', 'Lakukan pada kubus yang terpecahkan dan catat ke mana setiap keping sudut dan keping rusuk pergi.') },
        { name: L('Write the cycles', 'Tuliskan siklusnya'), text: L('Follow each piece from place to place until it returns, giving cycles of the corners and of the edges.', 'Ikuti setiap keping dari tempat ke tempat sampai kembali, sehingga diperoleh siklus sudut dan siklus rusuk.') },
        { name: L('Give each cycle its order', 'Beri setiap siklus ordenya'), text: L('The order of a cycle is its length, multiplied by 3 for a corner cycle that comes back twisted or by 2 for an edge cycle that comes back flipped.', 'Orde sebuah siklus adalah panjangnya, dikali 3 untuk siklus sudut yang kembali terputar atau dikali 2 untuk siklus rusuk yang kembali terbalik.') },
        { name: L('Take the least common multiple', 'Ambil kelipatan persekutuan terkecil'), text: L('The cube is solved again when every cycle is back, so the order of the sequence is the least common multiple of the cycle orders.', 'Kubus terpecahkan lagi saat setiap siklus kembali, jadi orde urutan adalah kelipatan persekutuan terkecil dari orde siklus.') },
      ],
    },
    {
      name: L('How to solve a Rubik’s cube layer by layer', 'Cara memecahkan kubus Rubik lapis demi lapis'),
      description: L('Solve the first layer, then the middle layer, then the last layer in four steps, using short sequences that leave the finished layers alone.', 'Pecahkan lapis pertama, lalu lapis tengah, lalu lapis terakhir dalam empat langkah, dengan urutan pendek yang membiarkan lapis yang selesai.'),
      steps: [
        { name: L('Solve the first layer', 'Pecahkan lapis pertama'), text: L('Make the cross of one color on the first layer, then drop in its four corners.', 'Buat salib satu warna pada lapis pertama, lalu jatuhkan keempat sudutnya.') },
        { name: L('Solve the middle layer', 'Pecahkan lapis tengah'), text: L('Slide each of the four middle edges into its place from the top layer with the right or the left sequence.', 'Selipkan masing-masing dari empat rusuk tengah ke tempatnya dari lapis atas dengan urutan kanan atau kiri.') },
        { name: L('Make the cross on the last layer', 'Buat salib pada lapis terakhir'), text: L('Do F R U R\' U\' F\' once for a dot, an L or a line, turning the top layer to the right position first.', 'Lakukan F R U R\' U\' F\' sekali untuk titik, L, atau garis, dengan memutar lapis atas ke posisi yang tepat lebih dulu.') },
        { name: L('Orient the last-layer corners', 'Orientasikan sudut lapis terakhir'), text: L('Repeat the Sune, turning the top layer to the right place before each one, until all four corners show the top color; three Sunes are always enough.', 'Ulangi Sune, dengan memutar lapis atas ke tempat yang tepat sebelum masing-masing, sampai keempat sudut menunjukkan warna atas; tiga Sune selalu cukup.') },
        { name: L('Position the corners and then the edges', 'Tempatkan sudut lalu rusuk'), text: L('Cycle three corners, then three edges, of the top layer, with the top layer turned between, until every piece is in its own place.', 'Siklus tiga sudut, lalu tiga rusuk, lapis atas, dengan lapis atas diputar di antaranya, sampai setiap keping berada di tempatnya sendiri.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a Rubik’s cube?', 'Apa itu kubus Rubik?'),
      a: L(
        'A Rubik’s cube is a puzzle of 26 small pieces, eight corners, twelve edges and six centers, whose six faces can be turned. It was invented by Ernő Rubik in 1974, and solving it means turning the faces until each face shows one color.',
        'Kubus Rubik adalah teka-teki dari 26 keping kecil, delapan sudut, dua belas rusuk, dan enam pusat, yang keenam sisinya dapat diputar. Ia diciptakan Ernő Rubik pada 1974, dan memecahkannya berarti memutar sisi sampai setiap sisi menunjukkan satu warna.',
      ),
    },
    {
      q: L('How many positions does a Rubik’s cube have?', 'Berapa banyak posisi yang dimiliki kubus Rubik?'),
      a: L(
        'A Rubik’s cube has 43,252,003,274,489,856,000 positions, about 43 quintillion, which is 8 factorial times 3 to the seventh times 12 factorial times 2 to the eleventh, divided by 2. They are only one in twelve of the ways to rebuild it.',
        'Kubus Rubik memiliki 43.252.003.274.489.856.000 posisi, sekitar 43 kuintiliun, yaitu 8 faktorial kali 3 pangkat tujuh kali 12 faktorial kali 2 pangkat sebelas, dibagi 2. Itu hanya satu dari dua belas cara merakit ulangnya.',
      ),
    },
    {
      q: L('What does R U R\' U\' mean in Rubik’s cube notation?', 'Apa arti R U R\' U\' dalam notasi kubus Rubik?'),
      a: L(
        'It is four moves read left to right: turn the right face a quarter turn clockwise, the top face clockwise, the right face counter-clockwise, and the top face counter-clockwise. The apostrophe means the inverse, and a 2 means a half turn.',
        'Itu empat gerakan yang dibaca dari kiri ke kanan: putar sisi kanan seperempat putaran searah jarum jam, sisi atas searah jarum jam, sisi kanan berlawanan arah jarum jam, dan sisi atas berlawanan arah jarum jam. Tanda petik berarti kebalikan, dan angka 2 berarti setengah putaran.',
      ),
    },
    {
      q: L('What is God’s number for the Rubik’s cube?', 'Berapa God’s number untuk kubus Rubik?'),
      a: L(
        'God’s number is 20: every position of the Rubik’s cube can be solved in at most 20 face turns, a half turn counted as one move, and some positions, such as the superflip, need all 20. It is 26 if only quarter turns are counted.',
        'God’s number adalah 20: setiap posisi kubus Rubik dapat dipecahkan dengan paling banyak 20 putaran sisi, setengah putaran dihitung satu gerakan, dan sebagian posisi, seperti superflip, memerlukan seluruh 20. Ia 26 bila hanya putaran seperempat yang dihitung.',
      ),
    },
    {
      q: L('Can every scrambled Rubik’s cube be solved?', 'Apakah setiap kubus Rubik yang diacak dapat dipecahkan?'),
      a: L(
        'Yes, if it was scrambled by turning the faces: every position reached that way can be solved. A cube that was taken apart or whose stickers were moved is solvable only one time in twelve, because of the conditions on twists, flips and parity.',
        'Ya, bila ia diacak dengan memutar sisi: setiap posisi yang dicapai dengan cara itu dapat dipecahkan. Kubus yang dibongkar atau yang stikernya dipindahkan hanya dapat dipecahkan satu dari dua belas kali, karena syarat pada putaran, pembalikan, dan paritas.',
      ),
    },
    {
      q: L('Why can’t you twist just one corner of a Rubik’s cube?', 'Mengapa satu sudut kubus Rubik tak dapat diputar sendiri?'),
      a: L(
        'Because every turn of a face twists its four corners by amounts that add up to a multiple of three, so the sum of all the twists stays zero modulo 3. One corner twisted alone makes the sum one or two, so no sequence of turns reaches it.',
        'Karena setiap putaran sisi memutar keempat sudutnya sebesar jumlah yang berkelipatan tiga, sehingga jumlah semua putaran tetap nol modulo 3. Satu sudut yang terputar sendiri membuat jumlahnya satu atau dua, jadi tak ada urutan putaran yang mencapainya.',
      ),
    },
    {
      q: L('How many times can you repeat a move sequence before the cube returns to its start?', 'Berapa kali sebuah urutan gerakan dapat diulang sebelum kubus kembali ke awal?'),
      a: L(
        'Exactly as many times as its order, the least common multiple of the orders of its cycles. R U needs 105 repeats, R U R\' U\' needs 6, a single face turn 4, and no sequence needs more than 1260.',
        'Tepat sebanyak ordenya, kelipatan persekutuan terkecil dari orde siklusnya. R U memerlukan 105 pengulangan, R U R\' U\' memerlukan 6, satu putaran sisi 4, dan tak ada urutan yang memerlukan lebih dari 1260.',
      ),
    },
    {
      q: L('How many moves does it take to solve a Rubik’s cube?', 'Berapa gerakan yang diperlukan untuk memecahkan kubus Rubik?'),
      a: L(
        'A perfect solution never needs more than 20 face turns. A beginner’s layer-by-layer method uses many more, often over a hundred, and expert methods use roughly fifty to sixty, because people memorize sequences instead of searching for the shortest way.',
        'Solusi sempurna tak pernah memerlukan lebih dari 20 putaran sisi. Metode lapis demi lapis untuk pemula memakai jauh lebih banyak, sering lebih dari seratus, dan metode ahli memakai kira-kira lima puluh sampai enam puluh, karena orang menghafal urutan alih-alih mencari jalan terpendek.',
      ),
    },
    {
      q: L('Why is the Rubik’s cube used to teach group theory?', 'Mengapa kubus Rubik dipakai untuk mengajarkan teori grup?'),
      a: L(
        'Because its moves are a group you can hold: they compose, can be undone, and do not commute. Orders, subgroups and parity, which are abstract in a textbook, show up as things the hands can do, and a short program can check them.',
        'Karena gerakannya adalah grup yang dapat dipegang: dapat digabung, dapat dibatalkan, dan tak bertukar tempat. Orde, subgrup, dan paritas, yang abstrak di buku teks, tampak sebagai hal yang dapat dilakukan tangan, dan program pendek dapat memeriksanya.',
      ),
    },
  ],

  references: [
    { title: 'Notes on Rubik’s “Magic Cube”', author: 'David Singmaster', year: 1981, source: 'Enslow Publishers' },
    { title: 'Adventures in Group Theory: Rubik’s Cube, Merlin’s Machine, and Other Mathematical Toys (2nd ed.)', author: 'David Joyner', year: 2008, source: 'Johns Hopkins University Press' },
    { title: 'The Diameter of the Rubik’s Cube Group Is Twenty', author: 'Tomas Rokicki, Herbert Kociemba, Morley Davidson, John Dethridge', year: 2013, source: 'SIAM Journal on Discrete Mathematics 27(2)' },
    { title: 'God’s Number is 26 in the Quarter-Turn Metric', author: 'Tomas Rokicki, Morley Davidson', year: 2014, source: 'cube20.org' },
    { title: 'Inside Rubik’s Cube and Beyond', author: 'Christoph Bandelow', year: 1982, source: 'Birkhäuser' },
    { title: 'Group Theory and the Rubik’s Cube', author: 'Janet Chen', year: 2004, source: 'Lecture notes, Harvard University' },
    { title: 'Contemporary Abstract Algebra (10th ed.), chapter on permutation groups', author: 'Joseph A. Gallian', year: 2021, source: 'Chapman and Hall/CRC' },
  ],

  related: ['cube', 'tower-of-hanoi', 'integers', 'big-o-notation'],
}
