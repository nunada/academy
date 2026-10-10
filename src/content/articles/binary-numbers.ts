import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './binary-numbers.meta'

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
    T`**A binary number is a number written in base 2, with only the digits 0 and 1, where each place is worth twice the place to its right: $1011_2=8+2+1=11$.** Computers use it because a switch has two states, and every number, letter and image is stored as a string of these bits. To convert, add the powers of 2 under the 1s, or divide by 2 repeatedly and read the remainders from the bottom up.`,
    T`**Bilangan biner adalah bilangan yang ditulis dalam basis 2, hanya dengan angka 0 dan 1, tempat tiap angka bernilai dua kali tempat di kanannya: $1011_2=8+2+1=11$.** Komputer memakainya karena sebuah saklar punya dua keadaan, dan setiap bilangan, huruf, dan gambar disimpan sebagai untaian bit ini. Untuk mengubah, jumlahkan pangkat 2 di bawah angka 1, atau bagi 2 berulang kali lalu baca sisanya dari bawah ke atas.`,
  ),

  keyPoints: [
    L(
      T`Binary is place value in base 2: the places are worth $1,2,4,8,16,\ldots$, and a digit is a bit, 0 or 1.`,
      T`Biner adalah nilai tempat dalam basis 2: tempatnya bernilai $1,2,4,8,16,\ldots$, dan satu angka adalah satu bit, 0 atau 1.`,
    ),
    L(
      T`$n$ bits hold $2^n$ values, from 0 to $2^n-1$; a byte is 8 bits and holds 256 values.`,
      T`$n$ bit memuat $2^n$ nilai, dari 0 sampai $2^n-1$; satu byte adalah 8 bit dan memuat 256 nilai.`,
    ),
    L(
      T`Hexadecimal is shorthand for binary: one hex digit is exactly four bits, so ´FF´ is $11111111_2=255$.`,
      T`Heksadesimal adalah singkatan biner: satu angka heksadesimal tepat empat bit, sehingga ´FF´ adalah $11111111_2=255$.`,
    ),
    L(
      T`In binary $1+1=10$: add column by column, carrying 1; multiplying is shifting and adding, and doubling is adding a 0 at the end.`,
      T`Dalam biner $1+1=10$: jumlahkan kolom demi kolom dengan membawa 1; mengalikan adalah menggeser dan menjumlahkan, dan menggandakan adalah menambah angka 0 di ujung.`,
    ),
    L(
      T`Negative integers use two's complement: invert the bits and add 1, so $-5$ is $11111011$ in 8 bits and the top bit is worth $-2^{n-1}$.`,
      T`Bilangan bulat negatif memakai komplemen dua: balik bit-bitnya dan tambah 1, sehingga $-5$ adalah $11111011$ dalam 8 bit dan bit paling kiri bernilai $-2^{n-1}$.`,
    ),
    L(
      T`A fraction terminates in binary only if its denominator is a power of 2, so $0.1$ repeats ($0.0\overline{0011}_2$) and a float can only store it approximately.`,
      T`Pecahan berakhir dalam biner hanya bila penyebutnya pangkat 2, sehingga $0{,}1$ berulang ($0{,}0\overline{0011}_2$) dan float hanya dapat menyimpannya secara hampiran.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------ what is it */
    {
      id: 'what-is-binary',
      heading: L('What is a binary number?', 'Apa itu bilangan biner?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A binary number is written in base 2: it uses only the two digits 0 and 1, called bits (from *binary digit*), and each place is worth twice the place to its right.** Ordinary decimal numbers work the same way with ten digits and places worth 1, 10, 100, 1000. In both, the value of a digit depends on where it stands, which is the idea of [place value](article:chinese-numbers#counting-rods) found in every positional system.

The place values in binary are the powers of 2, counted from the right starting at $2^0$ (see [exponents](article:exponents-and-radicals#what-is-an-exponent)):

| Place | $2^7$ | $2^6$ | $2^5$ | $2^4$ | $2^3$ | $2^2$ | $2^1$ | $2^0$ |
|---|---|---|---|---|---|---|---|---|
| Value | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| Bit | 0 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |

The number in the table is $01011010_2=64+16+8+2=90$. A subscript 2 says the base, because $10_2$ is two but $10$ is ten.

Counting in binary is counting in decimal with only two digits. When the last digit reaches 1 the next count carries into the next place, as 9 becomes 10 in decimal:

| Decimal | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| Binary | 0 | 1 | 10 | 11 | 100 | 101 | 110 | 111 |

| Decimal | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|
| Binary | 1000 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |

**Why computers use binary.** A transistor is either conducting or not, a magnetic spot points one way or the other, a pit on a disc is there or not. Two states are easy to tell apart even when the signal is noisy, so a machine can copy and process them without error; ten voltage levels would be far harder. Everything else, numbers, text, pictures and sound, is first turned into numbers and then into bits. The last bit also tells you something simple: a binary number is even when it ends in 0, as in the [even and odd numbers](article:integers#divisibility) of the integers article.`,
            T`**Bilangan biner ditulis dalam basis 2: ia hanya memakai dua angka 0 dan 1, yang disebut bit (dari *binary digit*), dan tiap tempat bernilai dua kali tempat di kanannya.** Bilangan desimal biasa bekerja dengan cara yang sama dengan sepuluh angka dan tempat bernilai 1, 10, 100, 1000. Pada keduanya, nilai sebuah angka bergantung pada tempatnya, yaitu gagasan [nilai tempat](article:chinese-numbers#counting-rods) yang ada di setiap sistem posisi.

Nilai tempat dalam biner adalah pangkat 2, dihitung dari kanan mulai $2^0$ (lihat [eksponen](article:exponents-and-radicals#what-is-an-exponent)):

| Tempat | $2^7$ | $2^6$ | $2^5$ | $2^4$ | $2^3$ | $2^2$ | $2^1$ | $2^0$ |
|---|---|---|---|---|---|---|---|---|
| Nilai | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| Bit | 0 | 1 | 0 | 1 | 1 | 0 | 1 | 0 |

Bilangan pada tabel itu adalah $01011010_2=64+16+8+2=90$. Angka subskrip 2 menyatakan basisnya, sebab $10_2$ adalah dua tetapi $10$ adalah sepuluh.

Menghitung dalam biner sama dengan menghitung dalam desimal dengan hanya dua angka. Ketika angka terakhir mencapai 1, hitungan berikutnya membawa ke tempat selanjutnya, seperti 9 menjadi 10 dalam desimal:

| Desimal | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| Biner | 0 | 1 | 10 | 11 | 100 | 101 | 110 | 111 |

| Desimal | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|
| Biner | 1000 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |

**Mengapa komputer memakai biner.** Transistor menghantar atau tidak, bintik magnetik menghadap ke satu arah atau yang lain, lubang pada cakram ada atau tidak. Dua keadaan mudah dibedakan bahkan ketika sinyalnya berderau, sehingga mesin dapat menyalin dan mengolahnya tanpa galat; sepuluh tingkat tegangan jauh lebih sulit. Segala yang lain, bilangan, teks, gambar, dan suara, lebih dulu diubah menjadi bilangan lalu menjadi bit. Bit terakhir juga memberi tahu hal sederhana: bilangan biner genap bila berakhir 0, seperti pada [bilangan genap dan ganjil](article:integers#divisibility) di artikel bilangan bulat.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: read a binary number', 'Coba: membaca bilangan biner'),
          step: {
            kind: 'math',
            id: 'a1',
            hints: [
              L('The places are $8,4,2,1$ from the left.', 'Tempatnya $8,4,2,1$ dari kiri.'),
              L('$8+4+0+1$.', '$8+4+0+1$.'),
            ],
            explain: L('$1101_2=8+4+0+1=13$.', '$1101_2=8+4+0+1=13$.'),
            prompt: L('What is $1101_2$ in decimal?', 'Berapakah $1101_2$ dalam desimal?'),
            given: String.raw`1101_{2}=v`,
            blanks: [{ label: 'v =', answer: 13 }],
          },
        },
      ],
    },

    /* --------------------------------------------------------------- convert */
    {
      id: 'convert-binary',
      heading: L('How do you convert between binary, decimal and hexadecimal?', 'Bagaimana mengubah antara biner, desimal, dan heksadesimal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To turn binary into decimal, add the place values of the 1s; to turn decimal into binary, divide by 2 again and again and read the remainders from the bottom up.** Both use only the powers of 2.

**Binary to decimal.** $1011010_2$ has 1s in the places worth 64, 16, 8 and 2, so it is $64+16+8+2=90$.

**Decimal to binary.** Divide by 2, write down the remainder, and carry on with the quotient until it reaches 0. For 90:

| Division | Quotient | Remainder |
|---|---|---|
| $90\div2$ | 45 | 0 |
| $45\div2$ | 22 | 1 |
| $22\div2$ | 11 | 0 |
| $11\div2$ | 5 | 1 |
| $5\div2$ | 2 | 1 |
| $2\div2$ | 1 | 0 |
| $1\div2$ | 0 | 1 |

Read the remainders upward: $1011010_2$. This is the same division with remainder as in the [integers article](article:integers#remainders), and the last remainder is the leftmost digit because it is the highest place.

**Octal and hexadecimal.** Binary strings are long, so programmers group the bits. Three bits make one **octal** digit (base 8, digits 0 to 7) and four bits make one **hexadecimal** digit (base 16, digits 0 to 9 and then A to F for 10 to 15):

| Binary | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 |
|---|---|---|---|---|---|---|---|---|
| Hex | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |

| Binary | 1000 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |
|---|---|---|---|---|---|---|---|---|
| Hex | 8 | 9 | A | B | C | D | E | F |

Group from the right: $01011010_2$ is $0101\;1010$, which is $5A_{16}$, and $5\cdot16+10=90$. A byte is always exactly two hex digits, which is why ´FF´ is $11111111_2=255$. Hexadecimal is how colors are written on the web: ´#FF8800´ is red 255, green $\text{88}_{16}=136$ and blue 0, an orange. Octal survives in Unix file permissions, where ´755´ is $111\;101\;101$, read, write and execute for the owner and read and execute for everyone else.

Type a number below in any base and see it in all four.`,
            T`**Untuk mengubah biner menjadi desimal, jumlahkan nilai tempat angka 1; untuk mengubah desimal menjadi biner, bagi 2 berulang kali dan baca sisanya dari bawah ke atas.** Keduanya hanya memakai pangkat 2.

**Biner ke desimal.** $1011010_2$ punya angka 1 di tempat bernilai 64, 16, 8, dan 2, sehingga ia $64+16+8+2=90$.

**Desimal ke biner.** Bagi 2, tulis sisanya, dan lanjutkan dengan hasil baginya sampai mencapai 0. Untuk 90:

| Pembagian | Hasil bagi | Sisa |
|---|---|---|
| $90\div2$ | 45 | 0 |
| $45\div2$ | 22 | 1 |
| $22\div2$ | 11 | 0 |
| $11\div2$ | 5 | 1 |
| $5\div2$ | 2 | 1 |
| $2\div2$ | 1 | 0 |
| $1\div2$ | 0 | 1 |

Baca sisanya ke atas: $1011010_2$. Ini pembagian bersisa yang sama dengan pada [artikel bilangan bulat](article:integers#remainders), dan sisa terakhir adalah angka paling kiri karena ia tempat tertinggi.

**Oktal dan heksadesimal.** Untai biner panjang, sehingga pemrogram mengelompokkan bit. Tiga bit membentuk satu angka **oktal** (basis 8, angka 0 sampai 7) dan empat bit membentuk satu angka **heksadesimal** (basis 16, angka 0 sampai 9 lalu A sampai F untuk 10 sampai 15):

| Biner | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 |
|---|---|---|---|---|---|---|---|---|
| Heks | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |

| Biner | 1000 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |
|---|---|---|---|---|---|---|---|---|
| Heks | 8 | 9 | A | B | C | D | E | F |

Kelompokkan dari kanan: $01011010_2$ adalah $0101\;1010$, yaitu $5A_{16}$, dan $5\cdot16+10=90$. Satu byte selalu tepat dua angka heksadesimal, itulah sebabnya ´FF´ adalah $11111111_2=255$. Heksadesimal adalah cara menulis warna di web: ´#FF8800´ adalah merah 255, hijau $\text{88}_{16}=136$, dan biru 0, sebuah oranye. Oktal masih bertahan pada izin berkas Unix, tempat ´755´ adalah $111\;101\;101$, baca, tulis, dan eksekusi untuk pemilik serta baca dan eksekusi untuk semua yang lain.

Ketik bilangan di bawah dalam basis apa pun dan lihat dalam keempatnya.`,
          ),
        },
        { kind: 'widget', name: 'baseconv' },
        {
          kind: 'activity',
          title: L('Try it: decimal to binary', 'Coba: desimal ke biner'),
          step: {
            kind: 'math',
            id: 'a2',
            hints: [
              L('Divide by 2: $45\\to22\\to11\\to5\\to2\\to1\\to0$.', 'Bagi 2: $45\\to22\\to11\\to5\\to2\\to1\\to0$.'),
              L('The remainders are $1,0,1,1,0,1$; read them from the last to the first.', 'Sisanya $1,0,1,1,0,1$; baca dari yang terakhir ke yang pertama.'),
            ],
            explain: L('$45=32+8+4+1$, so $45=101101_2$.', '$45=32+8+4+1$, sehingga $45=101101_2$.'),
            prompt: L('Write 45 in binary.', 'Tulis 45 dalam biner.'),
            given: String.raw`45=v_{2}`,
            blanks: [{ label: 'v =', answer: 101101 }],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: hexadecimal', 'Coba: heksadesimal'),
          step: {
            kind: 'quiz',
            id: 'a3',
            prompt: L('What is $2F_{16}$ in decimal?', 'Berapakah $2F_{16}$ dalam desimal?'),
            options: [L('$47$', '$47$'), L('$215$', '$215$'), L('$41$', '$41$'), L('$32$', '$32$')],
            answer: 0,
            explain: L('F stands for 15, so $2F_{16}=2\\cdot16+15=47$.', 'F berarti 15, sehingga $2F_{16}=2\\cdot16+15=47$.'),
            hint: L('The 2 is in the sixteens place and F is 15.', 'Angka 2 ada di tempat enam belasan dan F adalah 15.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------ arithmetic */
    {
      id: 'binary-arithmetic',
      heading: L('How do you add, subtract and multiply in binary?', 'Bagaimana menjumlah, mengurang, dan mengalikan dalam biner?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Binary arithmetic uses the same column methods as decimal, with only four sums to remember: $0+0=0$, $0+1=1$, $1+0=1$ and $1+1=10$, which means write 0 and carry 1.** Adding three 1s in a column gives $11_2$: write 1 and carry 1.

**Addition.** Work from the right and carry to the left. For $1011_2+110_2$:

Column by column, from the right: $1+0=1$; $1+1=10$, write 0 and carry 1; $0+1+1=10$, write 0 and carry 1; $1+0+1=10$, write 0 and carry 1; the carry becomes the leading 1. The result is $10001_2$, and as a check $11+6=17$.

**Subtraction.** When a column cannot take its digit away, borrow 1 from the column on the left, which is worth 2 in the column you are working on. For $1011_2-110_2$ the answer is $101_2$, and $11-6=5$. Computers rarely subtract this way: they add the two's complement, in the section on negative numbers.

**Multiplication.** Each bit of the lower number gives either 0 or a copy of the upper number shifted left, and the copies are added. $101_2\times11_2$ is $101+1010=1111_2$, and $5\cdot3=15$. There is no multiplication table to learn, only shifting and adding, which is why hardware multipliers are simple.

**Doubling and halving.** Appending a 0 doubles a binary number ($101_2=5$, $1010_2=10$), as appending a 0 multiplies a decimal number by ten. Dropping the last bit halves it and discards the remainder. This is the idea behind the bit shifts below.

Try your own sums; the working is shown as a column layout.`,
            T`**Aritmetika biner memakai metode kolom yang sama dengan desimal, dengan hanya empat jumlah yang perlu diingat: $0+0=0$, $0+1=1$, $1+0=1$, dan $1+1=10$, yang berarti tulis 0 dan bawa 1.** Menjumlahkan tiga angka 1 dalam satu kolom menghasilkan $11_2$: tulis 1 dan bawa 1.

**Penjumlahan.** Kerjakan dari kanan dan bawa ke kiri. Untuk $1011_2+110_2$:

Kolom demi kolom, dari kanan: $1+0=1$; $1+1=10$, tulis 0 dan bawa 1; $0+1+1=10$, tulis 0 dan bawa 1; $1+0+1=10$, tulis 0 dan bawa 1; bawaan menjadi angka 1 di depan. Hasilnya $10001_2$, dan sebagai pemeriksaan $11+6=17$.

**Pengurangan.** Bila sebuah kolom tidak dapat dikurangi angkanya, pinjam 1 dari kolom di kiri, yang bernilai 2 pada kolom yang sedang kamu kerjakan. Untuk $1011_2-110_2$ jawabannya $101_2$, dan $11-6=5$. Komputer jarang mengurangi dengan cara ini: ia menjumlahkan komplemen dua, pada bagian bilangan negatif.

**Perkalian.** Setiap bit pada bilangan bawah memberi 0 atau salinan bilangan atas yang digeser ke kiri, dan salinannya dijumlahkan. $101_2\times11_2$ adalah $101+1010=1111_2$, dan $5\cdot3=15$. Tidak ada tabel perkalian yang perlu dipelajari, hanya menggeser dan menjumlahkan, itulah sebabnya pengali perangkat keras sederhana.

**Menggandakan dan membagi dua.** Menambah angka 0 di ujung menggandakan bilangan biner ($101_2=5$, $1010_2=10$), seperti menambah 0 mengalikan bilangan desimal dengan sepuluh. Membuang bit terakhir membaginya dua dan membuang sisanya. Inilah gagasan di balik geseran bit di bawah.

Coba penjumlahan buatanmu sendiri; langkahnya ditampilkan sebagai susunan kolom.`,
          ),
        },
        { kind: 'widget', name: 'binarith' },
        {
          kind: 'activity',
          title: L('Try it: add in binary', 'Coba: menjumlah dalam biner'),
          step: {
            kind: 'math',
            id: 'a4',
            hints: [
              L('Add column by column from the right: $1+1=10$.', 'Jumlahkan kolom demi kolom dari kanan: $1+1=10$.'),
              L('Check with decimals: $11+13=24$.', 'Periksa dengan desimal: $11+13=24$.'),
            ],
            explain: L('$1011_2+1101_2=11000_2$, since $11+13=24=16+8$.', '$1011_2+1101_2=11000_2$, sebab $11+13=24=16+8$.'),
            prompt: L('Add the two binary numbers.', 'Jumlahkan kedua bilangan biner.'),
            given: String.raw`1011_{2}+1101_{2}=v_{2}`,
            blanks: [{ label: 'v =', answer: 11000 }],
          },
        },
      ],
    },

    /* ----------------------------------------------------------- bits and bytes */
    {
      id: 'bits-and-bytes',
      heading: L('How many values can bits hold, and what is a byte?', 'Berapa nilai yang dapat dimuat bit, dan apa itu byte?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**$n$ bits can hold $2^n$ different values, the numbers from 0 to $2^n-1$, because each extra bit doubles the number of patterns.** A **byte** is 8 bits and so holds $2^8=256$ values, 0 to 255.

| Bits | Values | Range as unsigned | Common name |
|---|---|---|---|
| 1 | 2 | 0 to 1 | a bit |
| 4 | 16 | 0 to 15 | a nibble, one hex digit |
| 8 | 256 | 0 to 255 | a byte |
| 16 | 65,536 | 0 to 65,535 | a short |
| 32 | 4,294,967,296 | 0 to 4,294,967,295 | an int in many languages |
| 64 | 18,446,744,073,709,551,616 | 0 to 18,446,744,073,709,551,615 | a long |

**Sizes.** A kilobyte (kB) is 1000 bytes in the SI system, but memory comes in powers of 2, so in 1998 the IEC named the binary units: a **kibibyte** (KiB) is $2^{10}=1024$ bytes, a mebibyte (MiB) is $2^{20}=1{,}048{,}576$ bytes and a gibibyte (GiB) is $2^{30}$ bytes. A disc sold as 500 GB (powers of 1000) shows up as about 465 GiB in an operating system that counts in powers of 1024, which is the usual source of "missing" space.

**Text.** A character is stored as a number. ASCII, from 1963, assigns the codes 0 to 127 to English letters, digits, punctuation and control codes, and fits in 7 bits. The letter A is 65, which is $01000001_2$, and a is 97, which is $01100001_2$. The two differ in exactly one bit, the one worth 32, so changing the case of an ASCII letter is flipping that bit. Unicode extends the idea to all writing systems, and UTF-8 stores each code point in 1 to 4 bytes.

Click the bits of a byte below and watch the number, its two readings and the character change.`,
            T`**$n$ bit dapat memuat $2^n$ nilai berbeda, yaitu bilangan dari 0 sampai $2^n-1$, karena tiap bit tambahan menggandakan banyak pola.** Satu **byte** adalah 8 bit sehingga memuat $2^8=256$ nilai, 0 sampai 255.

| Bit | Nilai | Rentang tanpa tanda | Nama umum |
|---|---|---|---|
| 1 | 2 | 0 sampai 1 | sebuah bit |
| 4 | 16 | 0 sampai 15 | sebuah nibble, satu angka heksadesimal |
| 8 | 256 | 0 sampai 255 | sebuah byte |
| 16 | 65.536 | 0 sampai 65.535 | sebuah short |
| 32 | 4.294.967.296 | 0 sampai 4.294.967.295 | int di banyak bahasa |
| 64 | 18.446.744.073.709.551.616 | 0 sampai 18.446.744.073.709.551.615 | sebuah long |

**Ukuran.** Satu kilobita (kB) adalah 1000 byte dalam sistem SI, tetapi memori berukuran pangkat 2, sehingga pada 1998 IEC menamai satuan biner: satu **kibibyte** (KiB) adalah $2^{10}=1024$ byte, satu mebibyte (MiB) adalah $2^{20}=1.048.576$ byte, dan satu gibibyte (GiB) adalah $2^{30}$ byte. Cakram yang dijual 500 GB (pangkat 1000) tampak sekitar 465 GiB pada sistem operasi yang menghitung dengan pangkat 1024, yang menjadi sumber umum ruang yang "hilang".

**Teks.** Sebuah karakter disimpan sebagai bilangan. ASCII, dari 1963, memberi kode 0 sampai 127 untuk huruf Inggris, angka, tanda baca, dan kode kendali, dan muat dalam 7 bit. Huruf A adalah 65, yaitu $01000001_2$, dan a adalah 97, yaitu $01100001_2$. Keduanya berbeda tepat satu bit, yang bernilai 32, sehingga mengubah huruf besar-kecil huruf ASCII berarti membalik bit itu. Unicode memperluas gagasan ini ke semua sistem tulisan, dan UTF-8 menyimpan setiap titik kode dalam 1 sampai 4 byte.

Klik bit-bit sebuah byte di bawah dan perhatikan bilangan, dua cara membacanya, dan karakternya berubah.`,
          ),
        },
        { kind: 'widget', name: 'bitedit' },
        {
          kind: 'activity',
          title: L('Try it: how many values?', 'Coba: berapa nilai?'),
          step: {
            kind: 'quiz',
            id: 'a5',
            prompt: L('How many different values can 10 bits hold?', 'Berapa nilai berbeda yang dapat dimuat 10 bit?'),
            options: [L('$100$', '$100$'), L('$512$', '$512$'), L('$1024$', '$1024$'), L('$2048$', '$2048$')],
            answer: 2,
            explain: L('Each bit doubles the count, so $n$ bits give $2^n$ values: $2^{10}=1024$ (0 to 1023).', 'Tiap bit menggandakan banyaknya, sehingga $n$ bit memberi $2^n$ nilai: $2^{10}=1024$ (0 sampai 1023).'),
            hint: L('One bit gives 2 values, two bits give 4, three give 8.', 'Satu bit memberi 2 nilai, dua bit memberi 4, tiga bit memberi 8.'),
          },
        },
      ],
    },

    /* ---------------------------------------------------------- two's complement */
    {
      id: 'twos-complement',
      heading: L('How are negative numbers stored in binary?', 'Bagaimana bilangan negatif disimpan dalam biner?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Computers store negative integers in two's complement: the leftmost bit counts as $-2^{n-1}$ instead of $+2^{n-1}$, so the same addition circuit works for positive and negative numbers.** To negate a number, invert every bit and add 1.

For 8 bits, to get $-5$: start with $5=00000101$, invert to $11111010$, and add 1 to get $11111011$. Read it with the top bit worth $-128$: $-128+64+32+16+8+2+1=-5$.

| 8-bit pattern | Unsigned | Signed |
|---|---|---|
| 00000000 | 0 | 0 |
| 00000001 | 1 | 1 |
| 01111111 | 127 | 127 |
| 10000000 | 128 | −128 |
| 11111110 | 254 | −2 |
| 11111111 | 255 | −1 |

With $n$ bits the signed range is $-2^{n-1}$ to $2^{n-1}-1$, so 8 bits hold −128 to 127 and 32 bits hold −2,147,483,648 to 2,147,483,647. There is one more negative number than positive because 0 uses one of the non-negative patterns.

**Why this scheme.** Older ideas, such as a separate sign bit, give two zeros (+0 and −0) and need special rules for adding. In two's complement there is one zero, and subtraction is addition: $5+(-5)=00000101+11111011=100000000$, and the ninth bit is discarded, leaving 0. A hardware adder needs no sign logic.

**Overflow.** A result that does not fit wraps around. In 8 bits $127+1=01111111+00000001=10000000$, which reads as −128. Fixed-size integers in C and Java wrap like this (see the [integers in code](article:integers#integers-in-code) section), while Python integers grow as large as memory allows, so Python only shows the wrapping when you mask the bits yourself.

Try the ×2, +1 and NOT buttons on the bit editor above to see the wrap.`,
            T`**Komputer menyimpan bilangan bulat negatif dalam komplemen dua: bit paling kiri bernilai $-2^{n-1}$ dan bukan $+2^{n-1}$, sehingga rangkaian penjumlah yang sama bekerja untuk bilangan positif dan negatif.** Untuk menegasikan sebuah bilangan, balik setiap bit lalu tambah 1.

Untuk 8 bit, mendapatkan $-5$: mulai dari $5=00000101$, balik menjadi $11111010$, lalu tambah 1 menjadi $11111011$. Bacalah dengan bit teratas bernilai $-128$: $-128+64+32+16+8+2+1=-5$.

| Pola 8 bit | Tanpa tanda | Bertanda |
|---|---|---|
| 00000000 | 0 | 0 |
| 00000001 | 1 | 1 |
| 01111111 | 127 | 127 |
| 10000000 | 128 | −128 |
| 11111110 | 254 | −2 |
| 11111111 | 255 | −1 |

Dengan $n$ bit rentang bertanda adalah $-2^{n-1}$ sampai $2^{n-1}-1$, sehingga 8 bit memuat −128 sampai 127 dan 32 bit memuat −2.147.483.648 sampai 2.147.483.647. Ada satu bilangan negatif lebih banyak daripada positif karena 0 memakai salah satu pola tidak negatif.

**Mengapa skema ini.** Gagasan yang lebih tua, seperti bit tanda tersendiri, memberi dua nol (+0 dan −0) dan memerlukan aturan khusus untuk penjumlahan. Dalam komplemen dua hanya ada satu nol, dan pengurangan adalah penjumlahan: $5+(-5)=00000101+11111011=100000000$, dan bit kesembilan dibuang, menyisakan 0. Penjumlah perangkat keras tidak memerlukan logika tanda.

**Overflow.** Hasil yang tidak muat berputar kembali. Dalam 8 bit $127+1=01111111+00000001=10000000$, yang terbaca −128. Bilangan bulat berukuran tetap di C dan Java berputar seperti ini (lihat bagian [bilangan bulat dalam kode](article:integers#integers-in-code)), sedangkan bilangan bulat Python membesar selama memori cukup, sehingga Python hanya memperlihatkan perputaran bila kamu menutup bitnya sendiri.

Coba tombol ×2, +1, dan NOT pada penyunting bit di atas untuk melihat perputarannya.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: negate a number', 'Coba: menegasikan bilangan'),
          step: {
            kind: 'math',
            id: 'a6',
            hints: [
              L('$5=00000101$. Invert every bit: $11111010$.', '$5=00000101$. Balik setiap bit: $11111010$.'),
              L('Now add 1.', 'Sekarang tambah 1.'),
            ],
            explain: L('Inverting $00000101$ gives $11111010$, and adding 1 gives $11111011$. Check: $-128+64+32+16+8+2+1=-5$.', 'Membalik $00000101$ memberi $11111010$, dan menambah 1 memberi $11111011$. Periksa: $-128+64+32+16+8+2+1=-5$.'),
            prompt: L('Write $-5$ in 8-bit two’s complement.', 'Tulis $-5$ dalam komplemen dua 8 bit.'),
            given: String.raw`-5=v_{2}\ (8\text{ bits})`,
            blanks: [{ label: 'v =', answer: 11111011 }],
          },
        },
        {
          kind: 'activity',
          title: L('Try it: read a signed byte', 'Coba: membaca byte bertanda'),
          step: {
            kind: 'quiz',
            id: 'a7',
            prompt: L('What number is $11111110$ in 8-bit two’s complement?', 'Bilangan apa $11111110$ dalam komplemen dua 8 bit?'),
            options: [L('$-2$', '$-2$'), L('$254$', '$254$'), L('$-126$', '$-126$'), L('$-1$', '$-1$')],
            answer: 0,
            explain: L('The pattern is $-128+64+32+16+8+4+2=-2$. It is one less than $11111111$, which is $-1$. Read as unsigned it would be 254.', 'Polanya $-128+64+32+16+8+4+2=-2$. Ia satu kurang dari $11111111$, yaitu $-1$. Dibaca tanpa tanda ia 254.'),
            hint: L('The top bit is worth $-128$; add the other places.', 'Bit teratas bernilai $-128$; jumlahkan tempat lainnya.'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- bitwise */
    {
      id: 'bitwise-operators',
      heading: L('What are bitwise operators and shifts?', 'Apa itu operator bitwise dan geseran?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Bitwise operators work on each bit of a number separately: AND keeps a 1 only where both bits are 1, OR gives 1 where either bit is 1, XOR gives 1 where the bits differ, and NOT flips every bit.** Shifts slide all the bits left or right.

| Bits | AND | OR | XOR |
|---|---|---|---|
| 0, 0 | 0 | 0 | 0 |
| 0, 1 | 0 | 1 | 1 |
| 1, 0 | 0 | 1 | 1 |
| 1, 1 | 1 | 1 | 0 |

For example $1100_2$ AND $1010_2$ is $1000_2$, so $12\,\&\,10=8$; OR gives $1110_2=14$ and XOR gives $0110_2=6$.

**What they are for.**

- **Masks.** ´x & 0xFF´ keeps the lowest byte, and ´x & 1´ is 1 exactly when $x$ is odd.
- **Flags.** Several yes-or-no settings fit in one number, one bit each: set a flag with OR, clear it with AND and NOT, toggle it with XOR. Unix file permissions are three such flags per group.
- **Shifts.** Shifting left by $k$ multiplies by $2^k$ and shifting right by $k$ divides by $2^k$, dropping the remainder, which is the doubling and halving seen earlier. Bits pushed past the end are lost.
- **Tricks.** $x\,\&\,(x-1)$ is 0 exactly when $x$ is a power of 2 (or 0), and $x$ XOR $x$ is always 0.

Mixing operators with ordinary arithmetic needs care about the order of operations, as with negative numbers in the [integers article](article:integers#order-of-operations): put brackets round bitwise expressions. Try the operators on two bytes below.`,
            T`**Operator bitwise bekerja pada setiap bit sebuah bilangan secara terpisah: AND mempertahankan 1 hanya di tempat kedua bit 1, OR memberi 1 di tempat salah satu bit 1, XOR memberi 1 di tempat bitnya berbeda, dan NOT membalik setiap bit.** Geseran menggeser semua bit ke kiri atau kanan.

| Bit | AND | OR | XOR |
|---|---|---|---|
| 0, 0 | 0 | 0 | 0 |
| 0, 1 | 0 | 1 | 1 |
| 1, 0 | 0 | 1 | 1 |
| 1, 1 | 1 | 1 | 0 |

Misalnya $1100_2$ AND $1010_2$ adalah $1000_2$, sehingga $12\,\&\,10=8$; OR memberi $1110_2=14$ dan XOR memberi $0110_2=6$.

**Kegunaannya.**

- **Topeng (mask).** ´x & 0xFF´ mempertahankan byte terendah, dan ´x & 1´ bernilai 1 tepat bila $x$ ganjil.
- **Bendera (flag).** Beberapa pengaturan ya-atau-tidak muat dalam satu bilangan, satu bit masing-masing: nyalakan bendera dengan OR, matikan dengan AND dan NOT, balik dengan XOR. Izin berkas Unix adalah tiga bendera seperti itu per kelompok.
- **Geseran.** Menggeser ke kiri sebanyak $k$ mengalikan dengan $2^k$ dan menggeser ke kanan sebanyak $k$ membagi dengan $2^k$, membuang sisanya, yaitu penggandaan dan pembagian dua yang terlihat tadi. Bit yang melewati ujung hilang.
- **Trik.** $x\,\&\,(x-1)$ bernilai 0 tepat bila $x$ pangkat 2 (atau 0), dan $x$ XOR $x$ selalu 0.

Mencampur operator dengan aritmetika biasa memerlukan kehati-hatian soal urutan operasi, seperti pada bilangan negatif di [artikel bilangan bulat](article:integers#order-of-operations): beri kurung pada ekspresi bitwise. Coba operatornya pada dua byte di bawah.`,
          ),
        },
        { kind: 'widget', name: 'bitops' },
        {
          kind: 'activity',
          title: L('Try it: bitwise AND', 'Coba: AND bitwise'),
          step: {
            kind: 'quiz',
            id: 'a8',
            prompt: L('What is $12\\,\\&\\,10$ (bitwise AND)?', 'Berapakah $12\\,\\&\\,10$ (AND bitwise)?'),
            options: [L('$14$', '$14$'), L('$8$', '$8$'), L('$6$', '$6$'), L('$2$', '$2$')],
            answer: 1,
            explain: L('$12=1100_2$ and $10=1010_2$. Only the leftmost bit is 1 in both, so the AND is $1000_2=8$. OR would give 14 and XOR 6.', '$12=1100_2$ dan $10=1010_2$. Hanya bit paling kiri yang 1 pada keduanya, sehingga AND-nya $1000_2=8$. OR akan memberi 14 dan XOR 6.'),
            hint: L('Write both numbers in binary and keep a 1 only where both have one.', 'Tulis kedua bilangan dalam biner dan pertahankan 1 hanya di tempat keduanya punya.'),
          },
        },
      ],
    },

    /* --------------------------------------------------------------- fractions */
    {
      id: 'binary-fractions',
      heading: L('How are fractions written in binary?', 'Bagaimana pecahan ditulis dalam biner?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**After the binary point the places are worth $\frac12,\frac14,\frac18,\ldots$, so a fraction terminates in binary only when its denominator, in lowest terms, is a power of 2.** For example $0.101_2=\frac12+\frac18=\frac58=0.625$.

The reason is the rule for decimals applied to base 2. A fraction in lowest terms terminates in base $b$ exactly when every prime factor of its denominator divides $b$: in base 10 the primes 2 and 5, as in the [fractions to decimals](article:rational-numbers#decimals-percent) section, and in base 2 only the prime 2. So:

| Fraction | Binary | Terminates? |
|---|---|---|
| $\frac12$ | $0.1$ | yes |
| $\frac38$ | $0.011$ | yes |
| $\frac{5}{4}$ | $1.01$ | yes |
| $\frac13$ | $0.\overline{01}$ | no: repeats |
| $\frac1{10}$ | $0.0\overline{0011}$ | no: repeats |
| $\frac15$ | $0.\overline{0011}$ | no: repeats |

To find the digits, multiply the fractional part by 2: the whole part is the next bit, and the rest is carried on. $0.1\to0.2\to0.4\to0.8\to1.6$ gives bit 0, 0, 0, 1 and continues with 0.6, 1.2, 0.4, so the block 0011 repeats for ever.

**Why this matters for programs.** A floating-point number stores a fixed number of significant bits, 53 in the common 64-bit format (IEEE 754 binary64), as a sign, an exponent and a fraction. So only fractions with a power of 2 as denominator, such as 0.5, 0.25, 0.75 and 0.125, are held exactly. Numbers such as 0.1, 0.2 and 0.3 are cut off in the middle of their repeating block, and the nearest stored value is used instead. That is why ´0.1 + 0.2´ is ´0.30000000000000004´, described in the [real numbers article](article:real-numbers#real-numbers-in-code). The cure is to compare with a tolerance, or to count in whole units such as cents.

Type any number below and see its expansion in binary, octal or hexadecimal.`,
            T`**Setelah koma biner, tempatnya bernilai $\frac12,\frac14,\frac18,\ldots$, sehingga pecahan berakhir dalam biner hanya bila penyebutnya, dalam bentuk paling sederhana, adalah pangkat 2.** Misalnya $0{,}101_2=\frac12+\frac18=\frac58=0{,}625$.

Alasannya adalah aturan desimal yang diterapkan pada basis 2. Pecahan paling sederhana berakhir dalam basis $b$ tepat bila setiap faktor prima penyebutnya membagi $b$: pada basis 10 bilangan prima 2 dan 5, seperti pada bagian [pecahan ke desimal](article:rational-numbers#decimals-percent), dan pada basis 2 hanya bilangan prima 2. Jadi:

| Pecahan | Biner | Berakhir? |
|---|---|---|
| $\frac12$ | $0{,}1$ | ya |
| $\frac38$ | $0{,}011$ | ya |
| $\frac{5}{4}$ | $1{,}01$ | ya |
| $\frac13$ | $0{,}\overline{01}$ | tidak: berulang |
| $\frac1{10}$ | $0{,}0\overline{0011}$ | tidak: berulang |
| $\frac15$ | $0{,}\overline{0011}$ | tidak: berulang |

Untuk mencari angkanya, kalikan bagian pecahan dengan 2: bagian bulatnya adalah bit berikutnya, dan sisanya dilanjutkan. $0{,}1\to0{,}2\to0{,}4\to0{,}8\to1{,}6$ memberi bit 0, 0, 0, 1 dan berlanjut dengan 0,6, 1,2, 0,4, sehingga blok 0011 berulang selamanya.

**Mengapa ini penting bagi program.** Bilangan floating point menyimpan sejumlah tetap bit signifikan, 53 pada format 64 bit yang umum (IEEE 754 binary64), sebagai tanda, eksponen, dan bagian pecahan. Jadi hanya pecahan berpenyebut pangkat 2, seperti 0,5, 0,25, 0,75, dan 0,125, yang disimpan dengan tepat. Bilangan seperti 0,1, 0,2, dan 0,3 terpotong di tengah blok yang berulang, dan nilai tersimpan terdekat dipakai sebagai gantinya. Itulah sebabnya ´0.1 + 0.2´ adalah ´0.30000000000000004´, seperti dijelaskan di [artikel bilangan real](article:real-numbers#real-numbers-in-code). Obatnya adalah membandingkan dengan toleransi, atau menghitung dalam satuan utuh seperti sen.

Ketik bilangan apa pun di bawah dan lihat ekspansinya dalam biner, oktal, atau heksadesimal.`,
          ),
        },
        { kind: 'widget', name: 'binfrac' },
        {
          kind: 'activity',
          title: L('Try it: a binary fraction', 'Coba: pecahan biner'),
          step: {
            kind: 'math',
            id: 'a9',
            hints: [
              L('The places after the point are worth $\\frac12,\\frac14,\\frac18$.', 'Tempat setelah koma bernilai $\\frac12,\\frac14,\\frac18$.'),
              L('$0.101_2=\\frac12+0+\\frac18=\\frac48+\\frac18$.', '$0{,}101_2=\\frac12+0+\\frac18=\\frac48+\\frac18$.'),
            ],
            explain: L('$0.101_2=\\frac12+\\frac18=\\frac58$, so $a=5$ (and the decimal value is $0.625$).', '$0{,}101_2=\\frac12+\\frac18=\\frac58$, sehingga $a=5$ (dan nilai desimalnya $0{,}625$).'),
            prompt: L('Find $a$.', 'Tentukan $a$.'),
            given: { en: String.raw`0.101_{2}=\frac{a}{8}`, id: String.raw`0{,}101_{2}=\frac{a}{8}` },
            blanks: [{ label: 'a =', answer: 5 }],
          },
        },
      ],
    },

    /* ------------------------------------------------------------------ code */
    {
      id: 'binary-in-code',
      heading: L('How do you work with binary numbers in Python and JavaScript?', 'Bagaimana mengolah bilangan biner di Python dan JavaScript?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Both languages write binary literals with ´0b´, convert with ´bin´ and ´int(text, 2)´ in Python or ´toString(2)´ and ´parseInt(text, 2)´ in JavaScript, and share the bitwise operators ´&´, ´|´, ´^´, ´~´, ´<<´ and ´>>´.** They differ on integer size: Python integers have no limit, while JavaScript's bitwise operators silently work on 32-bit signed integers.`,
            T`**Kedua bahasa menulis literal biner dengan ´0b´, mengubah dengan ´bin´ dan ´int(teks, 2)´ di Python atau ´toString(2)´ dan ´parseInt(teks, 2)´ di JavaScript, dan memakai operator bitwise yang sama ´&´, ´|´, ´^´, ´~´, ´<<´, dan ´>>´.** Keduanya berbeda soal ukuran bilangan bulat: bilangan bulat Python tidak terbatas, sedangkan operator bitwise JavaScript diam-diam bekerja pada bilangan bulat bertanda 32 bit.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python', 'Python'),
          code: `>>> bin(10), bin(255), hex(255), oct(64)
('0b1010', '0b11111111', '0xff', '0o100')
>>> int('1011010', 2), int('ff', 16), 0b1011010
(90, 255, 90)
>>> f'{90:08b}', f'{255:#x}', format(5, '04b')   # padded binary, hex, width
('01011010', '0xff', '0101')
>>> (255).bit_length()
8
>>> 0b1100 & 0b1010, 0b1100 | 0b1010, 0b1100 ^ 0b1010
(8, 14, 6)
>>> 1 << 4, 100 >> 2                              # times 16, divide by 4
(16, 25)
>>> ~5                                            # NOT: -x - 1
-6
>>> bin(-5)                                       # a sign, not two's complement
'-0b101'
>>> (-5) & 0xFF                                   # the low 8 bits of -5
251
>>> 2 ** 64                                       # no overflow
18446744073709551616
>>> (0.1).hex()                                   # the stored binary value of 0.1
'0x1.999999999999ap-4'`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript', 'JavaScript'),
          code: `(10).toString(2)             // '1010'
(255).toString(16)           // 'ff'
parseInt('1011010', 2)       // 90
0b1011010                    // 90
5 & 3, 5 | 3, 5 ^ 3          // 1, 7, 6
~5                           // -6
1 << 31                      // -2147483648: bitwise operators use 32-bit signed integers
(1 << 31) >>> 0              // 2147483648: >>> reads the 32 bits as unsigned
-5 >>> 0                     // 4294967291
(-5 >>> 0).toString(2)       // '11111111111111111111111111111011': two's complement in 32 bits
2 ** 32 >> 0                 // 0: the high bits are discarded
2n ** 64n                    // 18446744073709551616n (BigInt has no 32-bit limit)`,
        },
        {
          kind: 'text',
          text: L(
            T`The pitfalls, in order of how often they bite:

| Pitfall | What happens | What to do |
|---|---|---|
| ´~5´ | gives −6, not −5 | NOT is −x − 1; negate with ´-x´ |
| ´bin(-5)´ or ´(-5).toString(2)´ | a minus sign and the bits of 5 | mask with ´& 0xFF´ (Python) or use ´>>> 0´ (JavaScript) to see two's complement |
| Bitwise operators in JavaScript | work on 32 bits: ´2 ** 32 >> 0´ is 0 | use ´BigInt´ for larger values |
| ´1 << 31´ in JavaScript | negative | add ´>>> 0´ when you want unsigned |
| Shift count too large | JavaScript uses the count modulo 32: ´1 << 32´ is 1 | keep the count below the width |
| Precedence | ´x & 1 == 0´ means ´x & (1 == 0)´ in many languages | add brackets: ´(x & 1) == 0´ |
| Binary fractions | ´0.1 + 0.2 != 0.3´ | compare with a tolerance |

Use ´int(text, 2)´ or ´parseInt(text, 2)´ to read binary typed by a person, and format with ´f'{n:08b}'´ or ´n.toString(2).padStart(8, '0')´ to line the bits up.`,
            T`Jebakannya, berurutan dari yang paling sering menggigit:

| Jebakan | Yang terjadi | Yang sebaiknya dilakukan |
|---|---|---|
| ´~5´ | memberi −6, bukan −5 | NOT adalah −x − 1; negasikan dengan ´-x´ |
| ´bin(-5)´ atau ´(-5).toString(2)´ | tanda minus dan bit-bit 5 | tutup dengan ´& 0xFF´ (Python) atau pakai ´>>> 0´ (JavaScript) untuk melihat komplemen dua |
| Operator bitwise di JavaScript | bekerja pada 32 bit: ´2 ** 32 >> 0´ adalah 0 | pakai ´BigInt´ untuk nilai lebih besar |
| ´1 << 31´ di JavaScript | negatif | tambah ´>>> 0´ bila ingin tanpa tanda |
| Banyak geseran terlalu besar | JavaScript memakai banyaknya modulo 32: ´1 << 32´ adalah 1 | jaga banyaknya di bawah lebar bit |
| Prioritas | ´x & 1 == 0´ berarti ´x & (1 == 0)´ di banyak bahasa | beri kurung: ´(x & 1) == 0´ |
| Pecahan biner | ´0.1 + 0.2 != 0.3´ | bandingkan dengan toleransi |

Pakai ´int(teks, 2)´ atau ´parseInt(teks, 2)´ untuk membaca biner yang diketik orang, dan format dengan ´f'{n:08b}'´ atau ´n.toString(2).padStart(8, '0')´ untuk merapikan bit-bitnya.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- history */
    {
      id: 'history-of-binary',
      heading: L('Where does binary come from?', 'Dari mana asal biner?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Binary arithmetic is much older than computers: Indian, Egyptian and European thinkers used it long before electronics made it essential.**

- **c. 200 BCE.** Pingala, in a Sanskrit work on poetic meter, described patterns of short and long syllables that amount to binary numbers.
- **Egypt.** The Rhind Papyrus multiplies by repeated doubling and adding, which is multiplication by the binary digits of one number.
- **1703.** Leibniz published *Explication de l'arithmétique binaire*. He saw in the hexagrams of the I Ching, which are six-line patterns of broken and unbroken lines, the numbers 0 to 63 in binary.
- **1854.** George Boole's *Laws of Thought* made logic an algebra of true and false, 1 and 0.
- **1937.** Claude Shannon showed in his master's thesis that relay switches can carry out Boolean logic, the link between algebra and circuits. In 1948 he made the word *bit*, suggested by John Tukey, the unit of information.
- **1963.** ASCII gave letters and symbols standard 7-bit codes.

One theme runs through all of them: two symbols are enough to write any number, and any decision between two options can be recorded as a single bit.`,
            T`**Aritmetika biner jauh lebih tua daripada komputer: pemikir India, Mesir, dan Eropa memakainya jauh sebelum elektronik menjadikannya penting.**

- **Sekitar 200 SM.** Pingala, dalam karya Sanskerta tentang matra puisi, menjelaskan pola suku kata pendek dan panjang yang setara dengan bilangan biner.
- **Mesir.** Papirus Rhind mengalikan dengan penggandaan dan penjumlahan berulang, yaitu perkalian dengan angka biner dari salah satu bilangan.
- **1703.** Leibniz menerbitkan *Explication de l'arithmétique binaire*. Ia melihat pada heksagram I Ching, yaitu pola enam garis putus dan tak putus, bilangan 0 sampai 63 dalam biner.
- **1854.** *Laws of Thought* karya George Boole menjadikan logika aljabar benar dan salah, 1 dan 0.
- **1937.** Claude Shannon menunjukkan dalam tesis masternya bahwa saklar relai dapat melakukan logika Boole, penghubung antara aljabar dan rangkaian. Pada 1948 ia menjadikan kata *bit*, yang disarankan John Tukey, sebagai satuan informasi.
- **1963.** ASCII memberi huruf dan simbol kode standar 7 bit.

Satu benang merah mengalir melalui semuanya: dua simbol cukup untuk menulis bilangan apa pun, dan setiap keputusan antara dua pilihan dapat dicatat sebagai satu bit.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with binary numbers?', 'Apa kesalahan umum pada bilangan biner?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with binary numbers are the nine below, each with the correct statement and a number that shows why.**

| Mistake | Correct |
|---|---|
| ❌ $1+1=2$ in binary | There is no digit 2 in binary: $1+1=10_2$. |
| ❌ $10_2$ is ten | $10_2$ is two; ten is $1010_2$. |
| ❌ A byte is 4 bits | A byte is 8 bits; 4 bits are a nibble. |
| ❌ A byte holds 255 values | It holds 256 values, 0 to 255. |
| ❌ ´~5´ is −5 | $\sim5=-6$: NOT is $-x-1$. |
| ❌ Binary cannot show negative numbers | Two's complement does: $11111011_2=-5$ in 8 bits. |
| ❌ $11111111_2$ is always 255 | Unsigned it is 255; as signed 8-bit it is −1. |
| ❌ 1 KB is always 1024 bytes | kB is 1000 bytes; KiB is 1024 bytes. |
| ❌ 0.1 is stored exactly in binary | $0.1=0.0\overline{0011}_2$ repeats, so a float holds only the nearest value. |`,
            T`**Kesalahan paling umum pada bilangan biner adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar dan bilangan yang menunjukkan alasannya.**

| Kesalahan | Yang benar |
|---|---|
| ❌ $1+1=2$ dalam biner | Tidak ada angka 2 dalam biner: $1+1=10_2$. |
| ❌ $10_2$ adalah sepuluh | $10_2$ adalah dua; sepuluh adalah $1010_2$. |
| ❌ Satu byte adalah 4 bit | Satu byte adalah 8 bit; 4 bit adalah satu nibble. |
| ❌ Satu byte memuat 255 nilai | Ia memuat 256 nilai, 0 sampai 255. |
| ❌ ´~5´ adalah −5 | $\sim5=-6$: NOT adalah $-x-1$. |
| ❌ Biner tidak dapat menunjukkan bilangan negatif | Komplemen dua dapat: $11111011_2=-5$ dalam 8 bit. |
| ❌ $11111111_2$ selalu 255 | Tanpa tanda ia 255; sebagai 8 bit bertanda ia −1. |
| ❌ 1 KB selalu 1024 byte | kB adalah 1000 byte; KiB adalah 1024 byte. |
| ❌ 0,1 disimpan dengan tepat dalam biner | $0{,}1=0{,}0\overline{0011}_2$ berulang, sehingga float hanya menyimpan nilai terdekat. |`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- practice */
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
              L('$1+1=10$ in binary.', '$1+1=10$ dalam biner.'),
              L('$1000_2$ is eight.', '$1000_2$ adalah delapan.'),
              L('A byte can hold 255 different values.', 'Satu byte dapat memuat 255 nilai berbeda.'),
              L('In 8-bit two’s complement, $11111111$ is 255.', 'Dalam komplemen dua 8 bit, $11111111$ adalah 255.'),
              L('$0.1$ can be written exactly with finitely many binary digits.', '$0{,}1$ dapat ditulis tepat dengan angka biner yang berhingga banyaknya.'),
            ],
            answer: [true, true, false, false, false],
            explain: L(
              '$1+1=10_2$. $1000_2=8$. A byte holds 256 values, 0 to 255. The signed reading of $11111111$ is $-1$. And $0.1=0.0\\overline{0011}_2$ repeats, so it has no finite binary expansion.',
              '$1+1=10_2$. $1000_2=8$. Satu byte memuat 256 nilai, 0 sampai 255. Pembacaan bertanda $11111111$ adalah $-1$. Dan $0{,}1=0{,}0\\overline{0011}_2$ berulang, sehingga tidak punya ekspansi biner berhingga.',
            ),
            hint: L('Count the values from 0, and remember the top bit of a signed number is negative.', 'Hitung nilai mulai dari 0, dan ingat bit teratas bilangan bertanda bernilai negatif.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L('Choose **all** the numbers equal to twelve.', 'Pilih **semua** bilangan yang sama dengan dua belas.'),
            options: [L('$1100_2$', '$1100_2$'), L('$14_8$', '$14_8$'), L('$C_{16}$', '$C_{16}$'), L('$1010_2$', '$1010_2$'), L('$20_8$', '$20_8$')],
            answer: [0, 1, 2],
            explain: L(
              '$1100_2=8+4=12$, $14_8=8+4=12$ and $C_{16}=12$. But $1010_2=10$ and $20_8=16$.',
              '$1100_2=8+4=12$, $14_8=8+4=12$, dan $C_{16}=12$. Tetapi $1010_2=10$ dan $20_8=16$.',
            ),
            hint: L('Convert each one to decimal.', 'Ubah masing-masing ke desimal.'),
          },
        },
        {
          kind: 'activity',
          title: L('A carry that runs through', 'Bawaan yang merambat'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [
              L('$1+1=10$: write 0 and carry 1, and the carry keeps going.', '$1+1=10$: tulis 0 dan bawa 1, dan bawaan itu terus merambat.'),
              L('Check: $15+1=16=2^4$.', 'Periksa: $15+1=16=2^4$.'),
            ],
            explain: L('$1111_2+1_2=10000_2$, since $15+1=16=2^4$.', '$1111_2+1_2=10000_2$, sebab $15+1=16=2^4$.'),
            prompt: L('Add.', 'Jumlahkan.'),
            given: String.raw`1111_{2}+1_{2}=v_{2}`,
            blanks: [{ label: 'v =', answer: 10000 }],
          },
        },
        {
          kind: 'activity',
          title: L('Hexadecimal to decimal', 'Heksadesimal ke desimal'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [
              L('A stands for 10.', 'A berarti 10.'),
              L('$10\\cdot16+5$.', '$10\\cdot16+5$.'),
            ],
            explain: L('$A5_{16}=10\\cdot16+5=165$.', '$A5_{16}=10\\cdot16+5=165$.'),
            prompt: L('Convert to decimal.', 'Ubah ke desimal.'),
            given: String.raw`\mathrm{A5}_{16}=v`,
            blanks: [{ label: 'v =', answer: 165 }],
          },
        },
        {
          kind: 'activity',
          title: L('Minus one', 'Minus satu'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L('Which 8-bit pattern is $-1$ in two’s complement?', 'Pola 8 bit mana yang merupakan $-1$ dalam komplemen dua?'),
            options: [L('$10000001$', '$10000001$'), L('$10000000$', '$10000000$'), L('$01111111$', '$01111111$'), L('$11111111$', '$11111111$')],
            answer: 3,
            explain: L(
              'Invert $00000001$ to get $11111110$ and add 1: $11111111$. It reads $-128+127=-1$. $10000000$ is $-128$ and $01111111$ is $127$.',
              'Balik $00000001$ menjadi $11111110$ lalu tambah 1: $11111111$. Ia terbaca $-128+127=-1$. $10000000$ adalah $-128$ dan $01111111$ adalah $127$.',
            ),
            hint: L('Invert the bits of 1 and add 1.', 'Balik bit-bit 1 lalu tambah 1.'),
          },
        },
        {
          kind: 'activity',
          title: L('An odd test', 'Uji ganjil'),
          step: {
            kind: 'quiz',
            id: 'p6',
            prompt: L('Which expression is true exactly when $x$ is odd?', 'Ekspresi mana yang benar tepat bila $x$ ganjil?'),
            options: [L('$x\\,\\&\\,2=1$', '$x\\,\\&\\,2=1$'), L('$x\\gg1=1$', '$x\\gg1=1$'), L('$x\\,\\&\\,1=1$', '$x\\,\\&\\,1=1$'), L('$x\\oplus x=1$', '$x\\oplus x=1$')],
            answer: 2,
            explain: L(
              'The lowest bit of a number is 1 exactly when it is odd, and AND with 1 keeps only that bit. $x\\,\\&\\,2$ is 0 or 2, never 1, and $x\\oplus x$ is always 0.',
              'Bit terendah sebuah bilangan adalah 1 tepat bila ia ganjil, dan AND dengan 1 hanya mempertahankan bit itu. $x\\,\\&\\,2$ adalah 0 atau 2, tidak pernah 1, dan $x\\oplus x$ selalu 0.',
            ),
            hint: L('Which bit tells you whether a number is odd?', 'Bit mana yang memberi tahu apakah suatu bilangan ganjil?'),
          },
        },
      ],
    },

    /* -------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: binary numbers at a glance', 'Ringkasan: bilangan biner sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Binary:** base 2, digits 0 and 1 (bits), places worth $1,2,4,8,\ldots$; $1011_2=11$.
- **Converting:** add the powers of 2 under the 1s; divide by 2 and read the remainders upward; four bits make one hex digit, three one octal digit.
- **Arithmetic:** $1+1=10$ with a carry; multiply by shifting and adding; appending 0 doubles.
- **Size:** $n$ bits hold $2^n$ values, a byte is 8 bits (256 values); KiB is 1024 bytes, kB is 1000.
- **Negatives:** two's complement, the top bit is $-2^{n-1}$; negate by inverting and adding 1; overflow wraps.
- **Bitwise:** AND masks, OR sets, XOR flips; $x\ll k$ is $x\cdot2^k$; $x\,\&\,1$ tests odd.
- **Fractions:** places $\frac12,\frac14,\ldots$; terminates only for denominators that are powers of 2, so 0.1 repeats and floats approximate it.
- **Code:** ´bin´, ´int(s, 2)´, ´toString(2)´; JavaScript bitwise operators are 32-bit; ´~x´ is ´-x - 1´.`,
            T`- **Biner:** basis 2, angka 0 dan 1 (bit), tempat bernilai $1,2,4,8,\ldots$; $1011_2=11$.
- **Mengubah:** jumlahkan pangkat 2 di bawah angka 1; bagi 2 dan baca sisanya ke atas; empat bit membentuk satu angka heksadesimal, tiga bit satu angka oktal.
- **Aritmetika:** $1+1=10$ dengan bawaan; kalikan dengan menggeser dan menjumlahkan; menambah 0 menggandakan.
- **Ukuran:** $n$ bit memuat $2^n$ nilai, satu byte 8 bit (256 nilai); KiB adalah 1024 byte, kB adalah 1000.
- **Negatif:** komplemen dua, bit teratas bernilai $-2^{n-1}$; negasikan dengan membalik dan menambah 1; overflow berputar.
- **Bitwise:** AND menutup, OR menyalakan, XOR membalik; $x\ll k$ adalah $x\cdot2^k$; $x\,\&\,1$ menguji ganjil.
- **Pecahan:** tempat $\frac12,\frac14,\ldots$; berakhir hanya untuk penyebut pangkat 2, sehingga 0,1 berulang dan float menghampirinya.
- **Kode:** ´bin´, ´int(s, 2)´, ´toString(2)´; operator bitwise JavaScript 32 bit; ´~x´ adalah ´-x - 1´.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Bit', 'Bit'), definition: L('A binary digit, 0 or 1, the smallest unit of information; the word is short for binary digit.', 'Angka biner, 0 atau 1, satuan informasi terkecil; kata itu singkatan dari binary digit.') },
    { term: L('Byte', 'Byte'), definition: L('A group of 8 bits, which can hold 256 different values, 0 to 255 when read as unsigned.', 'Sekelompok 8 bit, yang dapat memuat 256 nilai berbeda, 0 sampai 255 bila dibaca tanpa tanda.') },
    { term: L('Binary number', 'Bilangan biner'), definition: L('A number written in base 2 with only the digits 0 and 1, each place worth a power of 2.', 'Bilangan yang ditulis dalam basis 2 dengan hanya angka 0 dan 1, tiap tempat bernilai pangkat 2.') },
    { term: L('Place value', 'Nilai tempat'), definition: L('The principle that a digit is worth its face value times the power of the base for the place it stands in.', 'Prinsip bahwa sebuah angka bernilai nilai tampaknya dikali pangkat basis untuk tempat ia berada.') },
    { term: L('Hexadecimal', 'Heksadesimal'), definition: L('Base 16, with digits 0 to 9 and A to F; one hex digit is exactly four bits, so a byte is two hex digits.', 'Basis 16, dengan angka 0 sampai 9 dan A sampai F; satu angka heksadesimal tepat empat bit, sehingga satu byte adalah dua angka heksadesimal.') },
    { term: L('Octal', 'Oktal'), definition: L('Base 8, with digits 0 to 7; one octal digit is exactly three bits.', 'Basis 8, dengan angka 0 sampai 7; satu angka oktal tepat tiga bit.') },
    { term: L('Nibble', 'Nibble'), definition: L('A group of four bits, which is one hexadecimal digit.', 'Sekelompok empat bit, yaitu satu angka heksadesimal.') },
    { term: L('Most significant bit', 'Bit paling bermakna'), definition: L('The leftmost bit of a binary number, the one in the highest place; in two’s complement it is the sign bit.', 'Bit paling kiri sebuah bilangan biner, yang ada di tempat tertinggi; dalam komplemen dua ia adalah bit tanda.') },
    { term: L('Two’s complement', 'Komplemen dua'), definition: L('The usual way to store negative integers, where the leftmost bit is worth minus 2 to the power n minus 1 and a number is negated by inverting its bits and adding 1.', 'Cara umum menyimpan bilangan bulat negatif, tempat bit paling kiri bernilai minus 2 pangkat n dikurangi 1 dan sebuah bilangan dinegasikan dengan membalik bitnya dan menambah 1.') },
    { term: L('Overflow', 'Overflow'), definition: L('The wrapping around that happens when a result does not fit in the fixed number of bits, as 127 plus 1 becomes minus 128 in 8 bits.', 'Perputaran yang terjadi ketika hasil tidak muat dalam banyak bit yang tetap, seperti 127 ditambah 1 menjadi minus 128 dalam 8 bit.') },
    { term: L('Bitwise operator', 'Operator bitwise'), definition: L('An operator such as AND, OR, XOR or NOT that works on each bit of its operands separately.', 'Operator seperti AND, OR, XOR, atau NOT yang bekerja pada setiap bit operannya secara terpisah.') },
    { term: L('Bit shift', 'Geseran bit'), definition: L('An operation that slides all the bits left or right; shifting left by k multiplies by 2 to the power k.', 'Operasi yang menggeser semua bit ke kiri atau kanan; menggeser ke kiri sebanyak k mengalikan dengan 2 pangkat k.') },
    { term: L('Bit mask', 'Topeng bit'), definition: L('A number whose 1 bits select which bits of another number to keep, change or test, used with AND, OR and XOR.', 'Bilangan yang bit 1-nya memilih bit mana dari bilangan lain yang dipertahankan, diubah, atau diuji, dipakai dengan AND, OR, dan XOR.') },
    { term: L('Kibibyte', 'Kibibyte'), definition: L('The binary unit equal to 1024 bytes, written KiB, to tell it from the kilobyte of 1000 bytes.', 'Satuan biner yang sama dengan 1024 byte, ditulis KiB, untuk membedakannya dari kilobita sebesar 1000 byte.') },
    { term: L('ASCII', 'ASCII'), definition: L('A 1963 standard that gives English letters, digits, punctuation and control characters the codes 0 to 127.', 'Standar 1963 yang memberi huruf Inggris, angka, tanda baca, dan karakter kendali kode 0 sampai 127.') },
    { term: L('Floating-point number', 'Bilangan floating point'), definition: L('A number stored as a sign, an exponent and a fixed number of significant bits, so most fractions are held only approximately.', 'Bilangan yang disimpan sebagai tanda, eksponen, dan sejumlah tetap bit signifikan, sehingga sebagian besar pecahan hanya disimpan secara hampiran.') },
  ],

  howTo: [
    {
      name: L('How to convert a decimal number to binary', 'Cara mengubah bilangan desimal menjadi biner'),
      description: L('Divide by 2 repeatedly and read the remainders from the bottom up.', 'Bagi 2 berulang kali dan baca sisanya dari bawah ke atas.'),
      steps: [
        { name: L('Divide by 2', 'Bagi 2'), text: L('Divide the number by 2 and write down the remainder, which is 0 or 1; for 45 the first remainder is 1.', 'Bagi bilangan itu dengan 2 dan tulis sisanya, yaitu 0 atau 1; untuk 45 sisa pertamanya 1.') },
        { name: L('Repeat with the quotient', 'Ulangi dengan hasil bagi'), text: L('Divide the quotient by 2 again and keep going until the quotient is 0.', 'Bagi hasil bagi dengan 2 lagi dan teruskan sampai hasil baginya 0.') },
        { name: L('Read upward', 'Baca ke atas'), text: L('Read the remainders from the last to the first: they are the bits from left to right.', 'Baca sisanya dari yang terakhir ke yang pertama: itulah bit dari kiri ke kanan.') },
        { name: L('Check', 'Periksa'), text: L('Add the powers of 2 under the 1s to get the number back: 45 is 32 plus 8 plus 4 plus 1, which is 101101.', 'Jumlahkan pangkat 2 di bawah angka 1 untuk mendapat bilangan semula: 45 adalah 32 ditambah 8 ditambah 4 ditambah 1, yaitu 101101.') },
      ],
    },
    {
      name: L('How to add two binary numbers', 'Cara menjumlahkan dua bilangan biner'),
      description: L('Add column by column from the right, carrying 1 when a column reaches 2.', 'Jumlahkan kolom demi kolom dari kanan, membawa 1 bila kolom mencapai 2.'),
      steps: [
        { name: L('Line up the digits', 'Sejajarkan angkanya'), text: L('Write one number under the other with the last digits in the same column.', 'Tulis satu bilangan di bawah yang lain dengan angka terakhir di kolom yang sama.') },
        { name: L('Add each column', 'Jumlahkan tiap kolom'), text: L('Start at the right and add the two bits plus any carry: 0 stays 0, 1 stays 1.', 'Mulai dari kanan dan jumlahkan kedua bit ditambah bawaan: 0 tetap 0, 1 tetap 1.') },
        { name: L('Carry when you reach two', 'Bawa bila mencapai dua'), text: L('When a column adds up to 2 or 3 write 0 or 1 and carry 1 to the next column on the left, because 1 plus 1 is 10.', 'Bila sebuah kolom berjumlah 2 atau 3 tulis 0 atau 1 dan bawa 1 ke kolom berikutnya di kiri, karena 1 ditambah 1 adalah 10.') },
        { name: L('Write the final carry', 'Tulis bawaan akhir'), text: L('If a carry is left after the last column, write it as the leading digit.', 'Jika masih ada bawaan setelah kolom terakhir, tulis sebagai angka terdepan.') },
      ],
    },
    {
      name: L('How to find the two’s complement of a number', 'Cara mencari komplemen dua suatu bilangan'),
      description: L('Invert every bit and add 1 to write a negative number with a fixed number of bits.', 'Balik setiap bit dan tambah 1 untuk menulis bilangan negatif dengan banyak bit tetap.'),
      steps: [
        { name: L('Write the positive number', 'Tulis bilangan positifnya'), text: L('Write the size of the number in binary with the chosen number of bits, for example 5 in 8 bits is 00000101.', 'Tulis ukuran bilangan itu dalam biner dengan banyak bit yang dipilih, misalnya 5 dalam 8 bit adalah 00000101.') },
        { name: L('Invert every bit', 'Balik setiap bit'), text: L('Change each 0 to 1 and each 1 to 0, which gives 11111010.', 'Ubah tiap 0 menjadi 1 dan tiap 1 menjadi 0, yang memberi 11111010.') },
        { name: L('Add 1', 'Tambah 1'), text: L('Add 1 to the result and drop any carry out of the top: 11111010 plus 1 is 11111011.', 'Tambah 1 pada hasilnya dan buang bawaan yang keluar dari atas: 11111010 ditambah 1 adalah 11111011.') },
        { name: L('Check', 'Periksa'), text: L('Read the top bit as minus 128 and add the rest: minus 128 plus 123 is minus 5.', 'Baca bit teratas sebagai minus 128 dan jumlahkan sisanya: minus 128 ditambah 123 adalah minus 5.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is a binary number?', 'Apa itu bilangan biner?'),
      a: L(
        'A binary number is a number written in base 2, using only the digits 0 and 1. Each place is worth twice the place to its right, so 1011 in binary is 8 plus 2 plus 1, which is 11. Each digit is called a bit.',
        'Bilangan biner adalah bilangan yang ditulis dalam basis 2, hanya memakai angka 0 dan 1. Tiap tempat bernilai dua kali tempat di kanannya, sehingga 1011 dalam biner adalah 8 ditambah 2 ditambah 1, yaitu 11. Tiap angka disebut bit.',
      ),
    },
    {
      q: L('Why do computers use binary?', 'Mengapa komputer memakai biner?'),
      a: L(
        'Electronic parts such as transistors have two reliable states, on and off, and two states are easy to tell apart even with noise. Machines can therefore copy and process binary signals without errors. Every number, letter and image is first turned into bits.',
        'Komponen elektronik seperti transistor punya dua keadaan yang andal, menyala dan mati, dan dua keadaan mudah dibedakan bahkan dengan derau. Mesin karena itu dapat menyalin dan mengolah sinyal biner tanpa galat. Setiap bilangan, huruf, dan gambar lebih dulu diubah menjadi bit.',
      ),
    },
    {
      q: L('How do you convert binary to decimal?', 'Bagaimana mengubah biner ke desimal?'),
      a: L(
        'Write the place values 1, 2, 4, 8 and so on from the right, and add the ones that sit under a 1. For 1011010 these are 64, 16, 8 and 2, which add up to 90. Each place is a power of 2.',
        'Tulis nilai tempat 1, 2, 4, 8 dan seterusnya dari kanan, lalu jumlahkan yang berada di bawah angka 1. Untuk 1011010 itu adalah 64, 16, 8, dan 2, yang berjumlah 90. Setiap tempat adalah pangkat 2.',
      ),
    },
    {
      q: L('How do you convert decimal to binary?', 'Bagaimana mengubah desimal ke biner?'),
      a: L(
        'Divide the number by 2 repeatedly, writing down each remainder, until the quotient is 0. Then read the remainders from the last to the first. For 45 the remainders read upward are 101101, and 32 plus 8 plus 4 plus 1 is 45.',
        'Bagi bilangan itu dengan 2 berulang kali, menulis tiap sisa, sampai hasil baginya 0. Lalu baca sisanya dari yang terakhir ke yang pertama. Untuk 45 sisa yang dibaca ke atas adalah 101101, dan 32 ditambah 8 ditambah 4 ditambah 1 adalah 45.',
      ),
    },
    {
      q: L('What is hexadecimal and why is it used?', 'Apa itu heksadesimal dan mengapa dipakai?'),
      a: L(
        'Hexadecimal is base 16, with digits 0 to 9 and A to F. One hex digit is exactly four bits, so a byte is two hex digits and long binary strings become short. Web colors such as FF8800 and memory addresses are written in hexadecimal.',
        'Heksadesimal adalah basis 16, dengan angka 0 sampai 9 dan A sampai F. Satu angka heksadesimal tepat empat bit, sehingga satu byte adalah dua angka heksadesimal dan untai biner yang panjang menjadi pendek. Warna web seperti FF8800 dan alamat memori ditulis dalam heksadesimal.',
      ),
    },
    {
      q: L('What is the difference between a bit and a byte?', 'Apa beda bit dan byte?'),
      a: L(
        'A bit is a single binary digit, 0 or 1. A byte is a group of 8 bits, which can hold 256 different values from 0 to 255. Four bits are called a nibble, and one hexadecimal digit is a nibble.',
        'Bit adalah satu angka biner, 0 atau 1. Byte adalah sekelompok 8 bit, yang dapat memuat 256 nilai berbeda dari 0 sampai 255. Empat bit disebut nibble, dan satu angka heksadesimal adalah satu nibble.',
      ),
    },
    {
      q: L('How many values can n bits store?', 'Berapa nilai yang dapat disimpan n bit?'),
      a: L(
        'Exactly 2 to the power n, because each extra bit doubles the number of patterns. As unsigned numbers they run from 0 to 2 to the power n minus 1. So 8 bits store 256 values, 16 bits store 65,536 and 32 bits store about 4.3 billion.',
        'Tepat 2 pangkat n, karena tiap bit tambahan menggandakan banyak pola. Sebagai bilangan tanpa tanda, nilainya berjalan dari 0 sampai 2 pangkat n dikurangi 1. Jadi 8 bit menyimpan 256 nilai, 16 bit menyimpan 65.536, dan 32 bit menyimpan sekitar 4,3 miliar.',
      ),
    },
    {
      q: L('How are negative numbers stored in binary?', 'Bagaimana bilangan negatif disimpan dalam biner?'),
      a: L(
        'Almost all computers use two’s complement. The leftmost bit is worth minus 2 to the power n minus 1, so in 8 bits 10000000 is minus 128 and 11111111 is minus 1. To negate a number, invert every bit and add 1, which makes subtraction an ordinary addition.',
        'Hampir semua komputer memakai komplemen dua. Bit paling kiri bernilai minus 2 pangkat n dikurangi 1, sehingga dalam 8 bit 10000000 adalah minus 128 dan 11111111 adalah minus 1. Untuk menegasikan bilangan, balik setiap bit dan tambah 1, yang membuat pengurangan menjadi penjumlahan biasa.',
      ),
    },
    {
      q: L('What is integer overflow?', 'Apa itu overflow bilangan bulat?'),
      a: L(
        'It is what happens when a result does not fit in the fixed number of bits. The value wraps around: in 8-bit signed arithmetic 127 plus 1 gives minus 128. In C and Java this is a real hazard, while Python integers grow as large as memory allows.',
        'Itu yang terjadi ketika hasil tidak muat dalam banyak bit yang tetap. Nilainya berputar: dalam aritmetika bertanda 8 bit 127 ditambah 1 menghasilkan minus 128. Di C dan Java ini bahaya nyata, sedangkan bilangan bulat Python membesar selama memori cukup.',
      ),
    },
    {
      q: L('What is 1 plus 1 in binary?', 'Berapa 1 ditambah 1 dalam biner?'),
      a: L(
        'It is 10 in binary, which is read one-zero and means two. There is no digit 2 in base 2, so the sum is written as 0 with a carry of 1 into the next place, just as 5 plus 5 is written as 0 with a carry in decimal.',
        'Hasilnya 10 dalam biner, yang dibaca satu-nol dan berarti dua. Tidak ada angka 2 dalam basis 2, sehingga jumlahnya ditulis 0 dengan bawaan 1 ke tempat berikutnya, seperti 5 ditambah 5 ditulis 0 dengan bawaan dalam desimal.',
      ),
    },
    {
      q: L('What do AND, OR and XOR do to bits?', 'Apa yang dilakukan AND, OR, dan XOR pada bit?'),
      a: L(
        'They combine two numbers bit by bit. AND gives 1 only where both bits are 1, OR gives 1 where at least one is 1, and XOR gives 1 where the bits differ. NOT flips every bit. They are used for masks, flags and quick tests such as whether a number is odd.',
        'Ketiganya menggabungkan dua bilangan bit demi bit. AND memberi 1 hanya di tempat kedua bit 1, OR memberi 1 di tempat sekurangnya satu bit 1, dan XOR memberi 1 di tempat bitnya berbeda. NOT membalik setiap bit. Dipakai untuk topeng, bendera, dan uji cepat seperti apakah bilangan ganjil.',
      ),
    },
    {
      q: L('What does shifting bits do?', 'Apa yang dilakukan menggeser bit?'),
      a: L(
        'Shifting left by k places multiplies a number by 2 to the power k, and shifting right by k places divides by 2 to the power k and drops the remainder. It works like adding or removing zeros in decimal. Bits pushed past the end of the number are lost.',
        'Menggeser ke kiri sebanyak k tempat mengalikan bilangan dengan 2 pangkat k, dan menggeser ke kanan sebanyak k tempat membagi dengan 2 pangkat k dan membuang sisanya. Cara kerjanya seperti menambah atau menghapus nol dalam desimal. Bit yang melewati ujung bilangan hilang.',
      ),
    },
    {
      q: L('Why is 0.1 not stored exactly in binary?', 'Mengapa 0,1 tidak disimpan dengan tepat dalam biner?'),
      a: L(
        'A fraction terminates in binary only if its denominator is a power of 2. One tenth has the factor 5, so its binary expansion 0.000110011 and so on repeats for ever. A float keeps only 53 significant bits, so it stores the nearest value, and 0.1 plus 0.2 is slightly more than 0.3.',
        'Pecahan berakhir dalam biner hanya bila penyebutnya pangkat 2. Sepersepuluh punya faktor 5, sehingga ekspansi binernya 0,000110011 dan seterusnya berulang selamanya. Float hanya menyimpan 53 bit signifikan, sehingga menyimpan nilai terdekat, dan 0,1 ditambah 0,2 sedikit lebih dari 0,3.',
      ),
    },
    {
      q: L('How do you work with binary in Python?', 'Bagaimana memakai biner di Python?'),
      a: L(
        'Write literals with the prefix 0b, convert a number with bin, hex and format, and read text with int and a base such as 2. The operators are the ampersand, the bar, the caret, the tilde and the two shifts. Python integers have no fixed size, so the tilde of 5 is minus 6.',
        'Tulis literal dengan awalan 0b, ubah bilangan dengan bin, hex, dan format, dan baca teks dengan int dan basis seperti 2. Operatornya adalah ampersand, garis tegak, tanda sisipan, tilde, dan dua geseran. Bilangan bulat Python tidak punya ukuran tetap, sehingga tilde dari 5 adalah minus 6.',
      ),
    },
  ],

  references: [
    { title: 'Precalculus: Mathematics for Calculus (7th ed.)', author: 'James Stewart, Lothar Redlin and Saleem Watson', year: 2016, source: 'Cengage Learning' },
    { title: 'The Art of Computer Programming, volume 2: Seminumerical Algorithms (3rd ed.), section 4.1 (positional number systems)', author: 'Donald E. Knuth', year: 1997, source: 'Addison-Wesley' },
    { title: 'Explication de l’arithmétique binaire', author: 'Gottfried Wilhelm Leibniz', year: 1703, source: 'Mémoires de l’Académie royale des sciences' },
    { title: 'An Investigation of the Laws of Thought', author: 'George Boole', year: 1854 },
    { title: 'A Symbolic Analysis of Relay and Switching Circuits', author: 'Claude E. Shannon', year: 1938, source: 'Transactions of the American Institute of Electrical Engineers 57, 713–723' },
    { title: 'IEEE Standard for Floating-Point Arithmetic (IEEE 754-2019)', author: 'IEEE', year: 2019, source: 'Institute of Electrical and Electronics Engineers' },
    { title: 'IEC 80000-13:2008, Quantities and units, Part 13: Information science and technology (binary prefixes kibi, mebi, gibi)', author: 'International Electrotechnical Commission', year: 2008 },
    { title: 'The Python Standard Library: bitwise operations on integer types', author: 'Python Software Foundation', source: 'docs.python.org', url: 'https://docs.python.org/3/library/stdtypes.html#bitwise-operations-on-integer-types' },
  ],

  related: ['integers', 'rational-numbers', 'real-numbers', 'exponents-and-radicals'],
}
