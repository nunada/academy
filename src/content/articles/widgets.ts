import type { Loc } from '../types'
import type { WidgetName } from './types'

/** What each interactive widget is. The page shows the title above the widget;
 *  the pre-rendered HTML (which has no JavaScript to run the widget with) shows
 *  the description in its place, so a crawler reads what the activity does. */
export const WIDGETS: Record<WidgetName, { title: Loc; description: Loc }> = {
  sets: {
    title: { en: 'Interactive: where does a number live?', id: 'Interaktif: di mana sebuah bilangan berada?' },
    description: {
      en: 'Tap a number to drop it into the diagram of nested number sets and see every set it belongs to.',
      id: 'Pilih sebuah bilangan untuk melihat posisinya dalam diagram himpunan bilangan dan himpunan-himpunan yang memuatnya.',
    },
  },
  classify: {
    title: { en: 'Interactive: classify the number', id: 'Interaktif: golongkan bilangannya' },
    description: {
      en: 'Ten numbers, one at a time: choose the smallest set each one belongs to and get an explanation straight away.',
      id: 'Klasifikasikan sepuluh bilangan dengan memilih himpunan terkecil yang memuat masing-masing bilangan. Kamu akan memperoleh penjelasan setelah menjawab.',
    },
  },
  decimal: {
    title: { en: 'Interactive: fraction to decimal', id: 'Interaktif: pecahan ke desimal' },
    description: {
      en: 'Type a fraction and see its decimal expansion, whether it ends or repeats, the repeating block, and the prime-factor rule that decides it.',
      id: 'Masukkan sebuah pecahan untuk melihat bentuk desimalnya, menentukan apakah desimal tersebut berakhir atau berulang, dan memahami kaitannya dengan faktor prima penyebut.',
    },
  },
  repeat: {
    title: { en: 'Interactive: repeating decimal to fraction', id: 'Interaktif: desimal berulang ke pecahan' },
    description: {
      en: 'Enter the digits of a repeating decimal and get the fraction it equals, with the working shown step by step.',
      id: 'Masukkan bilangan desimal berulang untuk mengubahnya menjadi pecahan senilai beserta langkah-langkah penyelesaiannya.',
    },
  },
  sqrt2: {
    title: { en: 'Interactive: close in on √2', id: 'Interaktif: dekati √2' },
    description: {
      en: 'Find the decimal digits of the square root of 2 one at a time by choosing each digit and checking its square.',
      id: 'Tentukan angka-angka desimal √2 secara bertahap dengan memilih angka yang memenuhi syarat pada setiap langkah.',
    },
  },
  density: {
    title: { en: 'Interactive: always another number in between', id: 'Interaktif: selalu ada bilangan lain di antaranya' },
    description: {
      en: 'Pick two numbers and keep taking the midpoint: there is always another rational number between them.',
      id: 'Pilih dua bilangan lalu terus ambil titik tengahnya: selalu ada bilangan rasional lain di antara keduanya.',
    },
  },
  interval: {
    title: { en: 'Interactive: interval builder', id: 'Interaktif: pembuat interval' },
    description: {
      en: 'Set two endpoints and open or closed ends and see the interval notation, the set-builder form and the number line together.',
      id: 'Tentukan kedua ujung interval beserta jenis ujungnya (terbuka atau tertutup). Hasilnya akan ditampilkan dalam notasi interval, notasi pembentuk himpunan, dan garis bilangan.',
    },
  },
  floats: {
    title: { en: 'Interactive: how a computer stores reals', id: 'Interaktif: cara komputer menyimpan bilangan real' },
    description: {
      en: 'Compare two expressions the way a computer does, with 64-bit floating point, and see why 0.1 + 0.2 is not exactly 0.3.',
      id: 'Bandingkan dua ekspresi menggunakan representasi bilangan titik-mengambang 64-bit untuk memahami mengapa hasil 0,1 + 0,2 tidak selalu sama persis dengan 0,3.',
    },
  },
  cnconvert: {
    title: { en: 'Interactive: write any number in Chinese', id: 'Interaktif: tulis bilangan apa pun dalam bahasa China' },
    description: {
      en: 'Type a number up to 999,999,999,999 and see it written in Chinese characters with pinyin, split into groups of four digits, in simplified, traditional or formal numerals.',
      id: 'Ketik bilangan hingga 999.999.999.999 dan lihat penulisannya dalam aksara China beserta pinyin, dibagi menjadi kelompok empat angka, dalam angka sederhana, tradisional, atau formal.',
    },
  },
  cnread: {
    title: { en: 'Interactive: read the Chinese number', id: 'Interaktif: baca bilangan China-nya' },
    description: {
      en: 'Eight Chinese numbers of growing size: read each one and choose its value, with pinyin on request and an explanation after every answer.',
      id: 'Delapan bilangan China dengan ukuran yang makin besar: baca masing-masing dan pilih nilainya, dengan pinyin bila diminta dan penjelasan setelah tiap jawaban.',
    },
  },
  grouping: {
    title: { en: 'Interactive: groups of three or groups of four?', id: 'Interaktif: kelompok tiga atau kelompok empat?' },
    description: {
      en: 'Type a number and see it grouped in threes, as English and Indonesian do, beside the same number grouped in fours with 万 and 亿, as Chinese does.',
      id: 'Ketik sebuah bilangan dan lihat ia dikelompokkan tiga-tiga seperti bahasa Inggris dan Indonesia, di samping bilangan yang sama dikelompokkan empat-empat dengan 万 dan 亿 seperti bahasa China.',
    },
  },
  explaws: {
    title: { en: 'Interactive: test the laws of exponents', id: 'Interaktif: uji hukum-hukum eksponen' },
    description: {
      en: 'Pick one of the five laws of exponents, choose numbers, and see both sides of the law calculated exactly, as whole numbers and fractions, so you can check that they are equal.',
      id: 'Pilih salah satu dari lima hukum eksponen, tentukan bilangannya, dan lihat kedua ruas hukum itu dihitung secara eksak, sebagai bilangan bulat dan pecahan, sehingga kamu dapat memeriksa bahwa keduanya sama.',
    },
  },
  exppattern: {
    title: { en: 'Interactive: why a⁰ = 1 and a⁻ⁿ = 1/aⁿ', id: 'Interaktif: mengapa a⁰ = 1 dan a⁻ⁿ = 1/aⁿ' },
    description: {
      en: 'A column of powers of one base, each step dividing by the base, which carries on past the exponent 0 into negative exponents.',
      id: 'Satu kolom pangkat dari sebuah basis, setiap langkah membagi dengan basis, dilanjutkan melewati eksponen 0 ke eksponen negatif.',
    },
  },
  simplifyroot: {
    title: { en: 'Interactive: simplify a root', id: 'Interaktif: sederhanakan sebuah akar' },
    description: {
      en: 'Type a number and choose a square root, cube root or higher root: see its prime factors, the groups taken out of the root, and the simplest form.',
      id: 'Ketik sebuah bilangan dan pilih akar kuadrat, akar pangkat tiga, atau akar yang lebih tinggi: lihat faktor primanya, kelompok yang dikeluarkan dari akar, dan bentuk paling sederhananya.',
    },
  },
  rationalise: {
    title: { en: 'Interactive: rationalize the denominator', id: 'Interaktif: rasionalkan penyebutnya' },
    description: {
      en: 'Rationalize a fraction such as 6/√3 or 1/(1+√2), step by step, with the conjugate and the difference of squares shown.',
      id: 'Rasionalkan pecahan seperti 6/√3 atau 1/(1+√2), langkah demi langkah, dengan bentuk sekawan dan selisih kuadrat ditunjukkan.',
    },
  },
  rootexp: {
    title: { en: 'Interactive: radicals and fractional exponents', id: 'Interaktif: akar dan eksponen pecahan' },
    description: {
      en: 'Write a to the power m over n as a radical, evaluate it exactly, and compare with a decimal approximation.',
      id: 'Tulis a pangkat m per n sebagai bentuk akar, hitung nilainya secara eksak, dan bandingkan dengan hampiran desimal.',
    },
  },
  scinot: {
    title: { en: 'Interactive: scientific notation', id: 'Interaktif: notasi ilmiah' },
    description: {
      en: 'Convert a number to scientific notation a × 10 to the power k and back, with the number of places the decimal point moves.',
      id: 'Ubah bilangan ke notasi ilmiah a × 10 pangkat k dan sebaliknya, beserta banyaknya tempat koma desimal berpindah.',
    },
  },
  terms: {
    title: { en: 'Interactive: take an expression apart', id: 'Interaktif: uraikan sebuah ekspresi' },
    description: {
      en: 'Type an expression and see each term split into its coefficient, variable part and degree, with like terms shown in the same color.',
      id: 'Ketik sebuah ekspresi dan lihat tiap suku diuraikan menjadi koefisien, bagian variabel, dan derajatnya, dengan suku sejenis diberi warna yang sama.',
    },
  },
  expand: {
    title: { en: 'Interactive: expand and simplify', id: 'Interaktif: jabarkan dan sederhanakan' },
    description: {
      en: 'Type an expression with brackets and powers and see it multiplied out and its like terms combined, with its number of terms and degree.',
      id: 'Ketik ekspresi dengan tanda kurung dan pangkat dan lihat ia dijabarkan dan suku-suku sejenisnya digabung, beserta jumlah suku dan derajatnya.',
    },
  },
  evalexpr: {
    title: { en: 'Interactive: evaluate an expression', id: 'Interaktif: hitung nilai sebuah ekspresi' },
    description: {
      en: 'Give each letter a value and see the expression with the values substituted and its exact result, plus a table of values for one letter.',
      id: 'Beri tiap huruf sebuah nilai dan lihat ekspresi dengan nilai yang disubstitusikan beserta hasil eksaknya, ditambah tabel nilai untuk satu huruf.',
    },
  },
  areamodel: {
    title: { en: 'Interactive: the area model of multiplying', id: 'Interaktif: model luas untuk perkalian' },
    description: {
      en: 'Move four sliders to cut a rectangle into four smaller ones and see that the product of two sums is the sum of four products.',
      id: 'Geser empat penggeser untuk memotong persegi panjang menjadi empat bagian dan lihat bahwa hasil kali dua jumlah adalah jumlah dari empat hasil kali.',
    },
  },
  factor: {
    title: { en: 'Interactive: factor an expression', id: 'Interaktif: faktorkan sebuah ekspresi' },
    description: {
      en: 'Type a polynomial in one letter and see it factored, with the pattern used named and the factors multiplied back to check.',
      id: 'Ketik polinomial dengan satu huruf dan lihat ia difaktorkan, dengan pola yang dipakai disebut dan faktornya dikalikan kembali sebagai pemeriksaan.',
    },
  },
  intline: {
    title: { en: 'Interactive: add and subtract on the number line', id: 'Interaktif: jumlah dan selisih pada garis bilangan' },
    description: {
      en: 'Move two sliders and watch the sum or difference of two integers drawn as two jumps on a number line, with the rule that applies.',
      id: 'Geser dua penggeser dan lihat jumlah atau selisih dua bilangan bulat digambar sebagai dua lompatan pada garis bilangan, beserta aturan yang berlaku.',
    },
  },
  intops: {
    title: { en: 'Interactive: the four operations on integers', id: 'Interaktif: empat operasi pada bilangan bulat' },
    description: {
      en: 'Type two integers, even very large ones, pick an operation and see the exact result and the sign rule behind it.',
      id: 'Ketik dua bilangan bulat, bahkan yang sangat besar, pilih operasi, dan lihat hasil eksak beserta aturan tanda di baliknya.',
    },
  },
  divmod: {
    title: { en: 'Interactive: division with remainder', id: 'Interaktif: pembagian bersisa' },
    description: {
      en: 'Divide one integer by another and compare the quotient and remainder that mathematics, Python and JavaScript each give, including for negative numbers.',
      id: 'Bagi satu bilangan bulat dengan yang lain dan bandingkan hasil bagi dan sisa menurut matematika, Python, dan JavaScript, termasuk untuk bilangan negatif.',
    },
  },
  divrules: {
    title: { en: 'Interactive: divisibility rules', id: 'Interaktif: aturan habis dibagi' },
    description: {
      en: 'Type any integer and see which of 2, 3, 4, 5, 6, 8, 9, 10 and 11 divide it, what each rule looks at, and the real remainder as a check.',
      id: 'Ketik bilangan bulat apa pun dan lihat mana dari 2, 3, 4, 5, 6, 8, 9, 10, dan 11 yang membaginya, apa yang dilihat tiap aturan, dan sisa sebenarnya sebagai pemeriksaan.',
    },
  },
  primefactor: {
    title: { en: 'Interactive: prime factorization', id: 'Interaktif: faktorisasi prima' },
    description: {
      en: 'Type a whole number up to a trillion and see whether it is prime, its prime factorization step by step, and how many divisors it has.',
      id: 'Ketik bilangan bulat sampai satu triliun dan lihat apakah ia prima, faktorisasi primanya langkah demi langkah, dan berapa banyak pembaginya.',
    },
  },
  gcdlcm: {
    title: { en: 'Interactive: GCD and LCM with Euclid’s algorithm', id: 'Interaktif: FPB dan KPK dengan algoritma Euclid' },
    description: {
      en: 'Enter two positive integers and see Euclid’s algorithm run row by row, then the gcd, the lcm and the prime exponents behind them.',
      id: 'Masukkan dua bilangan bulat positif dan lihat algoritma Euclid berjalan baris demi baris, lalu FPB, KPK, dan eksponen prima di baliknya.',
    },
  },
  fracbars: {
    title: { en: 'Interactive: equivalent fractions as bars', id: 'Interaktif: pecahan senilai sebagai batang' },
    description: {
      en: 'Move three sliders to cut a bar into more equal parts and see that the shaded amount, and so the fraction, does not change.',
      id: 'Geser tiga penggeser untuk memotong batang menjadi lebih banyak bagian sama besar dan lihat bahwa bagian yang diarsir, sehingga pecahannya, tidak berubah.',
    },
  },
  simplify: {
    title: { en: 'Interactive: simplify a fraction', id: 'Interaktif: sederhanakan pecahan' },
    description: {
      en: 'Type a fraction and see the greatest common divisor, the lowest terms, the prime factors, the mixed number and the decimal.',
      id: 'Ketik pecahan dan lihat faktor persekutuan terbesar, bentuk paling sederhana, faktor primanya, bilangan campuran, dan desimalnya.',
    },
  },
  ratcompare: {
    title: { en: 'Interactive: compare two fractions', id: 'Interaktif: bandingkan dua pecahan' },
    description: {
      en: 'Enter two fractions and see which is greater by cross-multiplying, their places on a number line, and a fraction that lies between them.',
      id: 'Masukkan dua pecahan dan lihat mana yang lebih besar dengan perkalian silang, letaknya pada garis bilangan, dan sebuah pecahan di antara keduanya.',
    },
  },
  ratops: {
    title: { en: 'Interactive: the four operations on fractions', id: 'Interaktif: empat operasi pada pecahan' },
    description: {
      en: 'Add, subtract, multiply or divide two fractions and read the working line by line, down to the simplified answer and its mixed number.',
      id: 'Jumlahkan, kurangkan, kalikan, atau bagi dua pecahan dan baca langkah-langkahnya baris demi baris, sampai jawaban sederhana dan bilangan campurannya.',
    },
  },
  ratdecimal: {
    title: { en: 'Interactive: from fraction to decimal and percent', id: 'Interaktif: dari pecahan ke desimal dan persen' },
    description: {
      en: 'Type a fraction and see its decimal, whether it ends or repeats and why, the length of the repeating block, and the percentage.',
      id: 'Ketik pecahan dan lihat desimalnya, apakah ia berakhir atau berulang dan mengapa, panjang blok yang berulang, dan persennya.',
    },
  },
  rootcheck: {
    title: { en: 'Interactive: is this root rational?', id: 'Interaktif: apakah akar ini rasional?' },
    description: {
      en: 'Type a whole number and a root index and see its prime factors, whether the root is a whole number or irrational, the simplified radical and 30 decimals.',
      id: 'Ketik bilangan bulat dan indeks akar dan lihat faktor primanya, apakah akarnya bilangan bulat atau irasional, bentuk akar yang disederhanakan, dan 30 desimal.',
    },
  },
  surdcalc: {
    title: { en: 'Interactive: add and multiply numbers with a square root', id: 'Interaktif: jumlahkan dan kalikan bilangan berakar' },
    description: {
      en: 'Combine two numbers of the form a + b√m exactly and see when the sum, product or quotient of irrational numbers turns out to be rational.',
      id: 'Gabungkan dua bilangan berbentuk a + b√m secara eksak dan lihat kapan jumlah, hasil kali, atau hasil bagi bilangan irasional ternyata rasional.',
    },
  },
  convergents: {
    title: { en: 'Interactive: rational approximations of π, e, √2 and φ', id: 'Interaktif: hampiran rasional untuk π, e, √2, dan φ' },
    description: {
      en: 'Pick a constant and see the fractions from its continued fraction, such as 22/7 and 355/113 for π, with their decimals and errors.',
      id: 'Pilih sebuah konstanta dan lihat pecahan dari pecahan berantainya, seperti 22/7 dan 355/113 untuk π, beserta desimal dan galatnya.',
    },
  },
  baseconv: {
    title: { en: 'Interactive: convert between binary, octal, decimal and hexadecimal', id: 'Interaktif: ubah antara biner, oktal, desimal, dan heksadesimal' },
    description: {
      en: 'Type a whole number in any of the four bases and see it in all of them, with the division ladder that produces its binary digits.',
      id: 'Ketik bilangan bulat dalam salah satu dari empat basis dan lihat dalam semuanya, beserta tangga pembagian yang menghasilkan angka bitnya.',
    },
  },
  binarith: {
    title: { en: 'Interactive: add, subtract and multiply in binary', id: 'Interaktif: jumlah, kurang, dan kali dalam biner' },
    description: {
      en: 'Enter two binary numbers and watch the column working, with its carries and borrows or its shifted partial products, checked against decimal.',
      id: 'Masukkan dua bilangan biner dan perhatikan langkah per kolom, beserta bawaan dan pinjaman atau hasil kali parsial yang digeser, diperiksa dengan desimal.',
    },
  },
  bitedit: {
    title: { en: 'Interactive: flip the bits of a byte', id: 'Interaktif: balik bit-bit satu byte' },
    description: {
      en: 'Click individual bits and read the number as unsigned, as signed two’s complement, in hexadecimal and octal, and as an ASCII character.',
      id: 'Klik bit satu per satu dan baca bilangannya sebagai tanpa tanda, sebagai komplemen dua bertanda, dalam heksadesimal dan oktal, dan sebagai karakter ASCII.',
    },
  },
  bitops: {
    title: { en: 'Interactive: AND, OR, XOR, NOT and shifts', id: 'Interaktif: AND, OR, XOR, NOT, dan geseran' },
    description: {
      en: 'Apply a bitwise operator to two bytes and see the bits line up, with the result in binary and in decimal.',
      id: 'Terapkan operator bitwise pada dua byte dan lihat bit-bitnya sejajar, dengan hasil dalam biner dan desimal.',
    },
  },
  binfrac: {
    title: { en: 'Interactive: fractions in binary', id: 'Interaktif: pecahan dalam biner' },
    description: {
      en: 'Write a number such as 0.1 in binary, octal or hexadecimal and see whether it terminates or repeats, and the long multiplication that gives the digits.',
      id: 'Tulis bilangan seperti 0,1 dalam biner, oktal, atau heksadesimal dan lihat apakah ia berakhir atau berulang, beserta perkalian bersusun yang memberi angkanya.',
    },
  },
  arithseq: {
    title: { en: 'Interactive: build an arithmetic sequence', id: 'Interaktif: susun barisan aritmetika' },
    description: {
      en: 'Choose a first term, a common difference and a length and see the terms, the formula for the n-th term, the sum and a plot of points on a straight line.',
      id: 'Pilih suku pertama, beda, dan panjang lalu lihat suku-sukunya, rumus suku ke-n, jumlahnya, dan plot titik pada garis lurus.',
    },
  },
  arithdetect: {
    title: { en: 'Interactive: is this list an arithmetic sequence?', id: 'Interaktif: apakah daftar ini barisan aritmetika?' },
    description: {
      en: 'Type a list of numbers and see the differences between neighbors, whether they agree, the formula and next terms, or where the pattern breaks.',
      id: 'Ketik daftar bilangan dan lihat selisih antartetangga, apakah sama, rumus dan suku berikutnya, atau di mana pola itu patah.',
    },
  },
  gauss: {
    title: { en: 'Interactive: Gauss’s pairing trick', id: 'Interaktif: trik pasangan Gauss' },
    description: {
      en: 'List the terms forward and backward and see every column add to the same number, which is why S = n/2 times first plus last.',
      id: 'Daftarkan suku-sukunya maju dan mundur dan lihat setiap kolom berjumlah sama, itulah sebabnya S = n/2 kali pertama ditambah terakhir.',
    },
  },
  twoterms: {
    title: { en: 'Interactive: find a sequence from two terms', id: 'Interaktif: temukan barisan dari dua suku' },
    description: {
      en: 'Give any two terms and their positions and get the common difference, the first term, the formula, any later term and its sum, with the working.',
      id: 'Berikan dua suku dan posisinya lalu dapatkan beda, suku pertama, rumus, suku selanjutnya dan jumlahnya, beserta langkahnya.',
    },
  },
  geodetect: {
    title: { en: 'Interactive: is this list a geometric sequence?', id: 'Interaktif: apakah daftar ini barisan geometri?' },
    description: {
      en: 'Type a list of numbers and see the ratios between neighbors, whether they agree, the formula and next terms, or where the pattern breaks.',
      id: 'Ketik daftar bilangan dan lihat rasio antartetangga, apakah sama, rumus dan suku berikutnya, atau di mana pola itu patah.',
    },
  },
  geoseq: {
    title: { en: 'Interactive: build a geometric sequence', id: 'Interaktif: susun barisan geometri' },
    description: {
      en: 'Choose a first term, a common ratio and a length and see the terms, the formula for the n-th term and bars showing growth, decay or alternation.',
      id: 'Pilih suku pertama, rasio, dan panjang lalu lihat suku-sukunya, rumus suku ke-n, dan batang yang menunjukkan pertumbuhan, peluruhan, atau pergantian tanda.',
    },
  },
  geotwo: {
    title: { en: 'Interactive: find a geometric sequence from two terms', id: 'Interaktif: temukan barisan geometri dari dua suku' },
    description: {
      en: 'Give two terms and their positions and get the ratio (or both ratios), the first term and the formula, or see why no fraction fits.',
      id: 'Berikan dua suku dan posisinya lalu dapatkan rasio (atau kedua rasio), suku pertama, dan rumus, atau lihat mengapa tidak ada pecahan yang cocok.',
    },
  },
  geosum: {
    title: { en: 'Interactive: sums of a geometric series', id: 'Interaktif: jumlah deret geometri' },
    description: {
      en: 'See the subtract-and-multiply derivation of the sum formula, the exact sum, and the partial sums closing in on the infinite sum when the ratio is small enough.',
      id: 'Lihat penurunan rumus jumlah dengan mengalikan dan mengurangkan, jumlah eksaknya, dan jumlah parsial yang mendekati jumlah tak hingga bila rasionya cukup kecil.',
    },
  },
  quadclassify: {
    title: { en: 'Interactive: classify four points', id: 'Interaktif: klasifikasikan empat titik' },
    description: {
      en: 'Type the coordinates of four vertices and see which quadrilateral they make, with side and diagonal lengths, angles, symmetry and every name that applies.',
      id: 'Ketik koordinat empat titik sudut dan lihat segiempat apa yang terbentuk, lengkap dengan panjang sisi dan diagonal, sudut, simetri, dan semua nama yang berlaku.',
    },
  },
  quadprops: {
    title: { en: 'Interactive: properties of each quadrilateral', id: 'Interaktif: sifat tiap segiempat' },
    description: {
      en: 'Pick a square, rectangle, rhombus, parallelogram, kite or trapezoid and see its diagonals and a checklist of sides, angles, diagonals, symmetry, area and perimeter.',
      id: 'Pilih persegi, persegi panjang, belah ketupat, jajargenjang, layang-layang, atau trapesium dan lihat diagonalnya serta daftar sisi, sudut, diagonal, simetri, luas, dan keliling.',
    },
  },
  quadarea: {
    title: { en: 'Interactive: area and perimeter from coordinates', id: 'Interaktif: luas dan keliling dari koordinat' },
    description: {
      en: 'Give four vertices and see the shoelace terms, their sum, the exact area, the exact side lengths and the perimeter, and a warning when the shape crosses itself.',
      id: 'Berikan empat titik sudut dan lihat suku-suku tali sepatu, jumlahnya, luas eksak, panjang sisi eksak, dan keliling, serta peringatan bila bangunnya memotong dirinya sendiri.',
    },
  },
  tricheck: {
    title: { en: 'Interactive: can three lengths make a triangle?', id: 'Interaktif: dapatkah tiga panjang membentuk segitiga?' },
    description: {
      en: 'Type three side lengths and see whether they make a triangle, its type by sides and angles, area from Heron\'s formula, inradius, circumradius and angles.',
      id: 'Ketik tiga panjang sisi dan lihat apakah membentuk segitiga, jenisnya menurut sisi dan sudut, luas dari rumus Heron, jari-jari lingkaran dalam dan luar, serta sudutnya.',
    },
  },
  tripoints: {
    title: { en: 'Interactive: the centers of a triangle', id: 'Interaktif: titik-titik penting segitiga' },
    description: {
      en: 'Type three vertices and see the exact centroid, circumcenter and orthocenter, the incenter, both circles and the Euler line through O, G and H.',
      id: 'Ketik tiga titik sudut dan lihat titik berat, pusat lingkaran luar, dan titik tinggi secara eksak, pusat lingkaran dalam, kedua lingkaran, dan garis Euler melalui O, G, dan H.',
    },
  },
  trisolve: {
    title: { en: 'Interactive: solve a triangle', id: 'Interaktif: pecahkan segitiga' },
    description: {
      en: 'Give three measurements (SSS, SAS, ASA, AAS or SSA) and get every side and angle by the law of sines and cosines, including the two-triangle ambiguous case.',
      id: 'Berikan tiga ukuran (SSS, SAS, ASA, AAS, atau SSA) dan dapatkan semua sisi dan sudut dengan aturan sinus dan kosinus, termasuk kasus ambigu dengan dua segitiga.',
    },
  },
  circlecalc: {
    title: { en: 'Interactive: circumference, area, arcs and sectors', id: 'Interaktif: keliling, luas, busur, dan juring' },
    description: {
      en: 'Give a radius, diameter, circumference or area, then slide the central angle to see the arc length, sector, chord and segment, with exact multiples of pi.',
      id: 'Berikan jari-jari, diameter, keliling, atau luas, lalu geser sudut pusat untuk melihat panjang busur, juring, tali busur, dan tembereng, dengan kelipatan pi yang eksak.',
    },
  },
  circangle: {
    title: { en: 'Interactive: angles in a circle', id: 'Interaktif: sudut dalam lingkaran' },
    description: {
      en: 'Slide four points around a circle and watch the central angle, the inscribed angles, Thales\' right angle and the opposite angles of a cyclic quadrilateral.',
      id: 'Geser empat titik mengelilingi lingkaran dan amati sudut pusat, sudut keliling, sudut siku-siku Thales, dan sudut berhadapan segiempat tali busur.',
    },
  },
  circlerel: {
    title: { en: 'Interactive: lines, points and circles', id: 'Interaktif: garis, titik, dan lingkaran' },
    description: {
      en: 'Place a line, a point or a second circle against a circle and get the exact answer: miss, tangent or secant, the tangent points, and how two circles lie.',
      id: 'Letakkan garis, titik, atau lingkaran kedua terhadap sebuah lingkaran dan dapatkan jawaban eksak: tidak memotong, menyinggung, atau memotong, titik singgung, dan letak dua lingkaran.',
    },
  },
  pibound: {
    title: { en: 'Interactive: trapping pi with polygons', id: 'Interaktif: menjebak pi dengan segibanyak' },
    description: {
      en: 'Double the sides of a polygon inside and outside a circle, as Archimedes did, and watch the two bounds close in on pi.',
      id: 'Gandakan sisi segibanyak di dalam dan di luar lingkaran, seperti Archimedes, dan amati kedua batas menyempit ke pi.',
    },
  },
  pythsolve: {
    title: { en: 'Interactive: find the missing side', id: 'Interaktif: cari sisi yang hilang' },
    description: {
      en: 'Give two sides of a right triangle and get the third exactly, as a whole number or a root, with a square drawn on every side so you can see a² + b² = c².',
      id: 'Berikan dua sisi segitiga siku-siku dan dapatkan sisi ketiga secara eksak, sebagai bilangan bulat atau akar, dengan persegi pada setiap sisi agar a² + b² = c² terlihat.',
    },
  },
  pythproof: {
    title: { en: 'Interactive: a proof by rearranging', id: 'Interaktif: bukti dengan menata ulang' },
    description: {
      en: 'Slide the legs a and b and switch between a tilted square on four triangles and two squares on the same four triangles: the empty area is c² or a² + b².',
      id: 'Geser sisi tegak a dan b lalu beralih antara satu persegi miring di sekitar empat segitiga dan dua persegi dengan keempat segitiga yang sama: luas kosongnya c² atau a² + b².',
    },
  },
  pythtriples: {
    title: { en: 'Interactive: Pythagorean triples', id: 'Interaktif: tripel Pythagoras' },
    description: {
      en: 'List every triple up to a hypotenuse, find all whole-number right triangles that share a leg, or build a triple from m and n with Euclid\'s formula.',
      id: 'Daftar setiap tripel sampai suatu hipotenusa, cari semua segitiga siku-siku bersisi bilangan bulat yang berbagi sisi tegak, atau bentuk tripel dari m dan n dengan rumus Euclid.',
    },
  },
  pythtree: {
    title: { en: 'Interactive: the tree of primitive triples', id: 'Interaktif: pohon tripel primitif' },
    description: {
      en: 'Start at (3, 4, 5) and walk down Berggren\'s tree, where every primitive Pythagorean triple appears exactly once and each triple has three children.',
      id: 'Mulai dari (3, 4, 5) dan telusuri pohon Berggren, tempat setiap tripel Pythagoras primitif muncul tepat sekali dan setiap tripel punya tiga anak.',
    },
  },
  tanzoom: {
    title: { en: 'Interactive: zoom in on a curve', id: 'Interaktif: perbesar sebuah kurva' },
    description: {
      en: 'Pick a function and a point and zoom in: the curve straightens out until it is indistinguishable from its tangent line, and the gap between them shrinks faster than the window.',
      id: 'Pilih sebuah fungsi dan titik lalu perbesar: kurva makin lurus sampai tak dapat dibedakan dari garis singgungnya, dan selisih keduanya mengecil lebih cepat daripada jendelanya.',
    },
  },
  tansecant: {
    title: { en: 'Interactive: from a secant to the tangent', id: 'Interaktif: dari garis potong ke garis singgung' },
    description: {
      en: 'Move a second point toward the first from either side and watch the slope of the secant line settle on the slope of the tangent, with a table of the slopes for h = 2 down to 0.0001.',
      id: 'Gerakkan titik kedua mendekati titik pertama dari kedua sisi dan lihat gradien garis potong menuju gradien garis singgung, dengan tabel gradien untuk h = 2 sampai 0,0001.',
    },
  },
  tanline: {
    title: { en: 'Interactive: the tangent line calculator', id: 'Interaktif: kalkulator garis singgung' },
    description: {
      en: 'Type a polynomial and a point and get the difference quotient, the exact slope, the tangent and normal lines and where the tangent meets the curve again, or find the tangents through an outside point.',
      id: 'Ketik sebuah polinomial dan titik lalu dapatkan hasil bagi selisih, gradien eksak, garis singgung dan garis normal serta tempat garis singgung bertemu kurva lagi, atau cari garis singgung melalui titik di luar.',
    },
  },
  tannodiff: {
    title: { en: 'Interactive: where there is no derivative', id: 'Interaktif: ketika turunan tidak ada' },
    description: {
      en: 'Six graphs at x = 0: a corner, a smooth look-alike, a jump, a vertical tangent, a cusp and endless wiggling, each with its one-sided secant slopes and a zoom that shows what never straightens out.',
      id: 'Enam grafik di x = 0: sudut tajam, yang mirip tetapi mulus, lompatan, garis singgung tegak, cusp, dan osilasi tanpa henti, masing-masing dengan gradien garis potong dari tiap sisi dan perbesaran yang menunjukkan apa yang tidak pernah menjadi lurus.',
    },
  },
  derivgraph: {
    title: { en: 'Interactive: the graph of f and the graph of f′', id: 'Interaktif: grafik f dan grafik f′' },
    description: {
      en: 'Slide a point along a graph and watch the height of the second graph follow the slope of the first: nine functions, from a parabola to a corner, a vertical tangent and a derivative that is not continuous.',
      id: 'Geser sebuah titik sepanjang grafik dan lihat tinggi grafik kedua mengikuti gradien grafik pertama: sembilan fungsi, dari parabola sampai sudut tajam, garis singgung tegak, dan turunan yang tidak kontinu.',
    },
  },
  derivdef: {
    title: { en: 'Interactive: a derivative function, exactly', id: 'Interaktif: fungsi turunan, secara eksak' },
    description: {
      en: 'Type a polynomial or a quotient such as x/(x-1) and get the difference quotient expanded in h, the derivative function f′, where it is undefined, both graphs, and a table of secant slopes at a point.',
      id: 'Ketik polinomial atau hasil bagi seperti x/(x-1) dan dapatkan hasil bagi selisih yang dijabarkan dalam h, fungsi turunan f′, tempat ia tak terdefinisi, kedua grafik, dan tabel gradien garis potong di suatu titik.',
    },
  },
  derivsteps: {
    title: { en: 'Interactive: the derivative of a graph made of segments', id: 'Interaktif: turunan grafik yang tersusun dari ruas garis' },
    description: {
      en: 'Enter the corners of a graph made of line segments and get its derivative, a step function with no value at a corner; or go the other way and rebuild the graph from the steps.',
      id: 'Masukkan titik-titik sudut grafik yang tersusun dari ruas garis dan dapatkan turunannya, sebuah fungsi tangga tanpa nilai di sudut tajam; atau sebaliknya, bangun kembali grafik dari anak tangganya.',
    },
  },
  diffsteps: {
    title: { en: 'Interactive: differentiate step by step', id: 'Interaktif: menurunkan langkah demi langkah' },
    description: {
      en: 'Type a function made of powers of x, sqrt(x), e^x, sums, products and quotients, and see every rule applied in order, the derivative, its multiplied-out form, and higher derivatives up to the fourth.',
      id: 'Ketik fungsi yang tersusun dari pangkat x, sqrt(x), e^x, jumlah, hasil kali, dan hasil bagi, lalu lihat setiap aturan yang dipakai berurutan, turunannya, bentuk terjabarnya, dan turunan tingkat tinggi sampai keempat.',
    },
  },
  expbase: {
    title: { en: 'Interactive: the base that makes a^x its own slope', id: 'Interaktif: basis yang membuat a^x menjadi gradiennya sendiri' },
    description: {
      en: 'Slide the base a and watch the slope of a^x where it crosses the y-axis change: it is 0.69 for a = 2, 1.10 for a = 3, and exactly 1 for the number e.',
      id: 'Geser basis a dan lihat gradien a^x di tempat ia memotong sumbu y berubah: 0,69 untuk a = 2, 1,10 untuk a = 3, dan tepat 1 untuk bilangan e.',
    },
  },
  prodbox: {
    title: { en: 'Interactive: the picture of the product rule', id: 'Interaktif: gambar aturan hasil kali' },
    description: {
      en: 'Grow a rectangle u by v by small steps and see the extra area split into two strips and a tiny corner, which vanishes faster than the strips as the steps shrink.',
      id: 'Perbesar persegi panjang u kali v dengan langkah kecil dan lihat luas tambahannya terbagi menjadi dua pita dan satu pojok kecil, yang menghilang lebih cepat daripada pita saat langkahnya mengecil.',
    },
  },
  motionline: {
    title: { en: 'Interactive: motion along a line', id: 'Interaktif: gerak sepanjang garis lurus' },
    description: {
      en: 'Type a position function s(t) and see its velocity, acceleration and jerk, the graphs of position, velocity and acceleration, when the body moves forward or backward and speeds up or slows down, and its total distance.',
      id: 'Ketik fungsi posisi s(t) dan lihat kecepatan, percepatan, dan sentakannya, grafik posisi, kecepatan, dan percepatan, kapan benda maju atau mundur serta makin cepat atau makin lambat, dan jarak totalnya.',
    },
  },
  marginals: {
    title: { en: 'Interactive: marginal cost, revenue and profit', id: 'Interaktif: biaya, pendapatan, dan laba marjinal' },
    description: {
      en: 'Type a cost and a revenue function and compare each marginal value, the derivative, with the exact cost or revenue of one more unit, and find where marginal revenue equals marginal cost.',
      id: 'Ketik fungsi biaya dan pendapatan dan bandingkan setiap nilai marjinal, yaitu turunannya, dengan biaya atau pendapatan eksak untuk satu satuan lagi, serta cari tempat pendapatan marjinal sama dengan biaya marjinal.',
    },
  },
  georates: {
    title: { en: 'Interactive: rates of area and volume', id: 'Interaktif: laju luas dan volume' },
    description: {
      en: 'Grow a circle, a sphere, a cube or a square and see that the rate of its area or volume is a length or an area you already know: the circumference, the surface area, three faces, half the perimeter.',
      id: 'Perbesar lingkaran, bola, kubus, atau persegi dan lihat bahwa laju luas atau volumenya adalah panjang atau luas yang sudah kamu kenal: keliling, luas permukaan, tiga sisi, setengah keliling.',
    },
  },
  trigsteps: {
    title: { en: 'Interactive: differentiate with sine, cosine and the rest', id: 'Interaktif: menurunkan dengan sinus, kosinus, dan lainnya' },
    description: {
      en: 'Type a function made of sin x, cos x, tan x, cot x, sec x, csc x, powers of x, e^x, sums, products and quotients, and see each rule applied, the derivative and higher derivatives, checked against a difference quotient.',
      id: 'Ketik fungsi yang tersusun dari sin x, cos x, tan x, cot x, sec x, csc x, pangkat x, e^x, jumlah, hasil kali, dan hasil bagi, lalu lihat tiap aturan yang dipakai, turunan dan turunan tingkat tingginya, dicocokkan dengan hasil bagi selisih.',
    },
  },
  trigslope: {
    title: { en: 'Interactive: a trigonometric graph and its slopes', id: 'Interaktif: grafik trigonometri dan gradiennya' },
    description: {
      en: 'Slide a point along the graph of sin, cos, tan, cot, sec or csc and watch the slope of its tangent trace out the graph of the derivative underneath.',
      id: 'Geser sebuah titik sepanjang grafik sin, cos, tan, cot, sec, atau csc dan lihat gradien garis singgungnya menggambar grafik turunan di bawahnya.',
    },
  },
  limitsin: {
    title: { en: 'Interactive: the limit behind sine and cosine', id: 'Interaktif: limit di balik sinus dan kosinus' },
    description: {
      en: 'See sin h < h < tan h on a unit circle and the table of sin h / h and (cos h − 1) / h as h shrinks, then switch to degrees to see why calculus insists on radians.',
      id: 'Lihat sin h < h < tan h pada lingkaran satuan dan tabel sin h / h dan (cos h − 1) / h saat h mengecil, lalu ganti ke derajat untuk melihat mengapa kalkulus berkeras memakai radian.',
    },
  },
  springmotion: {
    title: { en: 'Interactive: a weight on a spring', id: 'Interaktif: beban pada pegas' },
    description: {
      en: 'Pull a weight down A units and let it go: its position A cos t, velocity −A sin t and acceleration −A cos t, with the weight bobbing on its spring and the graphs of position and velocity.',
      id: 'Tarik beban ke bawah A satuan lalu lepaskan: posisinya A cos t, kecepatannya −A sin t, dan percepatannya −A cos t, dengan beban yang naik turun pada pegasnya dan grafik posisi dan kecepatan.',
    },
  },
  chainsteps: {
    title: { en: 'Interactive: differentiate a composite function', id: 'Interaktif: menurunkan fungsi komposit' },
    description: {
      en: 'Type a function built from powers, e^u, sin, cos, tan, cot, sec, csc and square roots of other functions, and see each chain rule step with its outside and inside function, the derivative and higher derivatives, checked against a difference quotient.',
      id: 'Ketik fungsi yang dibangun dari pangkat, e^u, sin, cos, tan, cot, sec, csc, dan akar kuadrat dari fungsi lain, lalu lihat tiap langkah aturan rantai dengan fungsi luar dan fungsi dalamnya, turunan dan turunan tingkat tingginya, dicocokkan dengan hasil bagi selisih.',
    },
  },
  chainrates: {
    title: { en: 'Interactive: rates multiply', id: 'Interaktif: laju saling dikalikan' },
    description: {
      en: 'Pick an outside function and an inside function, slide x, and see that the rate of the inside times the rate of the outside is the slope of the composite graph.',
      id: 'Pilih fungsi luar dan fungsi dalam, geser x, dan lihat bahwa laju bagian dalam dikali laju bagian luar adalah gradien grafik komposit.',
    },
  },
  sinscale: {
    title: { en: 'Interactive: the constant inside a sine', id: 'Interaktif: konstanta di dalam sinus' },
    description: {
      en: 'Change k in A sin(kx) and see the slope grow by the factor k, switch to degrees to see the factor π/180, or double the frequency of a piston and watch its velocity, acceleration and jerk grow by 2, 4 and 8.',
      id: 'Ubah k pada A sin(kx) dan lihat gradien membesar dengan faktor k, ganti ke derajat untuk melihat faktor π/180, atau gandakan frekuensi piston dan lihat kecepatan, percepatan, dan sentakannya membesar 2, 4, dan 8 kali.',
    },
  },
  implicitsteps: {
    title: { en: 'Interactive: differentiate an equation implicitly', id: 'Interaktif: menurunkan persamaan secara implisit' },
    description: {
      en: 'Type an equation in x and y, and see both sides differentiated, the terms with y′ collected and solved, the slope, tangent line and normal line at a point of the curve, and the second derivative, with the curve drawn and the slope checked numerically.',
      id: 'Ketik persamaan dalam x dan y, lalu lihat kedua ruas diturunkan, suku-suku dengan y′ dikumpulkan dan diselesaikan, gradien, garis singgung, dan garis normal di suatu titik kurva, serta turunan kedua, dengan kurva yang digambar dan gradien yang diperiksa secara numerik.',
    },
  },
  implicitslide: {
    title: { en: 'Interactive: a point round a curve', id: 'Interaktif: titik mengelilingi kurva' },
    description: {
      en: 'Move a point round a circle, an ellipse or a rounded square and watch its tangent and normal lines turn, with the slope from y′ = −x/y and its relatives, horizontal where the numerator is 0 and vertical where the denominator is 0.',
      id: 'Gerakkan titik mengelilingi lingkaran, elips, atau persegi bulat dan lihat garis singgung dan garis normalnya berputar, dengan gradien dari y′ = −x/y dan kerabatnya, mendatar di tempat pembilang 0 dan tegak di tempat penyebut 0.',
    },
  },
  inverseslope: {
    title: { en: 'Interactive: the slopes of a function and its inverse', id: 'Interaktif: gradien suatu fungsi dan inversnya' },
    description: {
      en: 'Slide a point along a function and see its inverse, the mirror image in the line y = x, with the two tangent lines at corresponding points: their slopes are reciprocals, checked against a numerical inverse.',
      id: 'Geser sebuah titik sepanjang suatu fungsi dan lihat inversnya, bayangan cermin dalam garis y = x, dengan kedua garis singgung di titik-titik yang bersesuaian: gradiennya saling berkebalikan, diperiksa dengan invers numerik.',
    },
  },
  logsteps: {
    title: { en: 'Interactive: differentiate with logarithms and general powers', id: 'Interaktif: menurunkan dengan logaritma dan pangkat umum' },
    description: {
      en: 'Type a function with ln, log, a^x, x^x or x^π, built from the functions of the earlier articles, and see each rule applied, logarithmic differentiation when the base and the exponent both change, and the derivative checked against a difference quotient.',
      id: 'Ketik fungsi dengan ln, log, a^x, x^x, atau x^π, yang dibangun dari fungsi-fungsi artikel terdahulu, lalu lihat tiap aturan yang dipakai, diferensiasi logaritmik bila basis dan pangkatnya sama-sama berubah, dan turunan yang dicocokkan dengan hasil bagi selisih.',
    },
  },
  loglimits: {
    title: { en: 'Interactive: the limits behind e and ln a', id: 'Interaktif: limit di balik e dan ln a' },
    description: {
      en: 'Shrink h and watch (1 + h)^(1/h) settle at e, ln(1 + h)/h at 1 and (a^h − 1)/h at ln a, the slope of a^x at the y-axis.',
      id: 'Kecilkan h dan lihat (1 + h)^(1/h) menetap di e, ln(1 + h)/h di 1, dan (a^h − 1)/h di ln a, gradien a^x di sumbu-y.',
    },
  },
  invtrigslope: {
    title: { en: 'Interactive: an inverse trigonometric function and its slope', id: 'Interaktif: fungsi trigonometri invers dan gradiennya' },
    description: {
      en: 'Slide a point along the graph of arcsin, arccos, arctan, arccot, arcsec or arccsc and watch the slope of its tangent line trace out the graph of the derivative, with the domain and range of each.',
      id: 'Geser sebuah titik sepanjang grafik arcsin, arccos, arctan, arccot, arcsec, atau arccsc dan lihat gradien garis singgungnya menggambar grafik turunan, dengan domain dan jangkauan masing-masing.',
    },
  },
  reftriangle: {
    title: { en: 'Interactive: the reference triangle of an inverse trigonometric function', id: 'Interaktif: segitiga acuan fungsi trigonometri invers' },
    description: {
      en: 'Move x and see the right triangle whose angle is arcsin x, arctan x or arcsec x, its third side from Pythagoras, and the derivative read straight off the triangle.',
      id: 'Geser x dan lihat segitiga siku-siku yang sudutnya arcsin x, arctan x, atau arcsec x, sisi ketiganya dari Pythagoras, dan turunan yang dibaca langsung dari segitiga itu.',
    },
  },
  viewangle: {
    title: { en: 'Interactive: the best place to look at a picture', id: 'Interaktif: tempat terbaik untuk memandang sebuah lukisan' },
    description: {
      en: 'Choose how high the lower and upper edges of a picture hang above your eye and move away from the wall: the viewing angle is arctan(q/x) − arctan(p/x), and it is largest where its derivative is zero, at the geometric mean of the two heights.',
      id: 'Pilih setinggi apa tepi bawah dan tepi atas lukisan menggantung di atas matamu dan menjauhlah dari dinding: sudut pandangnya arctan(q/x) − arctan(p/x), dan ia terbesar di tempat turunannya nol, yaitu di rata-rata geometri kedua tinggi.',
    },
  },
  invsteps: {
    title: { en: 'Interactive: differentiate with inverse trigonometric functions', id: 'Interaktif: menurunkan dengan fungsi trigonometri invers' },
    description: {
      en: 'Type a function with arcsin, arccos, arctan, arccot, arcsec, arccsc or abs of other functions, and see each rule applied, with the outside and inside function at every chain step, the derivative checked against a difference quotient.',
      id: 'Ketik fungsi dengan arcsin, arccos, arctan, arccot, arcsec, arccsc, atau abs dari fungsi lain, lalu lihat tiap aturan yang dipakai, dengan fungsi luar dan dalam pada setiap langkah rantai, turunan yang dicocokkan dengan hasil bagi selisih.',
    },
  },
  ratestool: {
    title: { en: 'Interactive: solve a related rates problem', id: 'Interaktif: selesaikan soal laju terkait' },
    description: {
      en: 'Pick one of the textbook problems or type your own equation, give the values and rates of one moment, choose the rate to find, and see the equation differentiated in time, the numbers put in, and the unknown rate solved.',
      id: 'Pilih salah satu soal buku atau ketik persamaanmu sendiri, isi nilai dan laju pada satu saat, pilih laju yang dicari, lalu lihat persamaan diturunkan terhadap waktu, bilangan dimasukkan, dan laju yang dicari diselesaikan.',
    },
  },
  ladder: {
    title: { en: 'Interactive: a ladder sliding down a wall', id: 'Interaktif: tangga yang meluncur turun dari dinding' },
    description: {
      en: 'Pull the foot of a ladder away from a wall at a steady speed and watch the top slide down, faster and faster, with x dx/dt + y dy/dt = 0 giving its speed at every position.',
      id: 'Tarik kaki tangga menjauhi dinding dengan kecepatan tetap dan lihat ujung atasnya meluncur turun, makin lama makin cepat, dengan x dx/dt + y dy/dt = 0 yang memberi kecepatannya di setiap posisi.',
    },
  },
  conefill: {
    title: { en: 'Interactive: water filling a conical tank', id: 'Interaktif: air mengisi tangki kerucut' },
    description: {
      en: 'Pour water into a cone at a steady rate and watch the level rise more and more slowly, with dy/dt = 4 (dV/dt) / (π y²) and the tangent line to the depth-against-time curve.',
      id: 'Tuang air ke kerucut dengan laju tetap dan lihat permukaan naik makin lambat, dengan dy/dt = 4 (dV/dt) / (π y²) dan garis singgung pada kurva kedalaman terhadap waktu.',
    },
  },
  linearize: {
    title: { en: 'Interactive: a function and its linearization', id: 'Interaktif: sebuah fungsi dan linearisasinya' },
    description: {
      en: 'Type a function and a center a, or pick one of the textbook examples, and see the tangent-line approximation L(x) = f(a) + f′(a)(x − a) with its formula, its values and the error, which is zero at a and flat there.',
      id: 'Ketik sebuah fungsi dan pusat a, atau pilih salah satu contoh buku, dan lihat hampiran garis singgung L(x) = f(a) + f′(a)(x − a) dengan rumus, nilai, dan galatnya, yang nol di a dan mendatar di sana.',
    },
  },
  zoomin: {
    title: { en: 'Interactive: zoom in on a curve until it is a line', id: 'Interaktif: perbesar sebuah kurva sampai menjadi garis' },
    description: {
      en: 'Magnify the graph of a differentiable function around a point and watch it flatten into its tangent line, with a table showing the gap between curve and line shrinking a hundredfold for every tenfold magnification.',
      id: 'Perbesar grafik fungsi terdiferensialkan di sekitar sebuah titik dan lihat ia mendatar menjadi garis singgungnya, dengan tabel yang menunjukkan selisih kurva dan garis mengecil seratus kali untuk setiap pembesaran sepuluh kali.',
    },
  },
  diffgap: {
    title: { en: 'Interactive: the differential df and the true change Δf', id: 'Interaktif: diferensial df dan perubahan sebenarnya Δf' },
    description: {
      en: 'Change x by dx and see the rise of the tangent line, df = f′(a) dx, next to the true change Δf of the function, with the error and the number ε that goes to 0 as dx does.',
      id: 'Ubah x sebesar dx dan lihat kenaikan garis singgung, df = f′(a) dx, di samping perubahan sebenarnya Δf pada fungsi, dengan galat dan bilangan ε yang menuju 0 saat dx menuju 0.',
    },
  },
  errpercent: {
    title: { en: 'Interactive: how a measuring error spreads', id: 'Interaktif: bagaimana galat pengukuran menyebar' },
    description: {
      en: 'Choose a formula such as the area of a circle, the volume of a cube or the flow in an artery, and see that a p% error in the measured radius or edge becomes about n·p% in the result, exactly and by the estimate.',
      id: 'Pilih rumus seperti luas lingkaran, volume kubus, atau aliran dalam arteri, dan lihat bahwa galat p% pada jari-jari atau rusuk yang diukur menjadi sekitar n·p% pada hasilnya, secara tepat dan menurut perkiraan.',
    },
  },
  extremetool: {
    title: { en: 'Interactive: the closed interval method', id: 'Interaktif: metode selang tertutup' },
    description: {
      en: 'Type a function and the ends of a closed interval, or pick a textbook example, and see its critical points and endpoints, the value of the function at each, and the absolute maximum and minimum marked on the graph.',
      id: 'Ketik fungsi dan ujung selang tertutup, atau pilih salah satu contoh buku, dan lihat titik kritis dan ujungnya, nilai fungsi di masing-masing, serta maksimum dan minimum mutlak yang ditandai pada grafik.',
    },
  },
  evtcases: {
    title: { en: 'Interactive: when a function has a maximum and a minimum', id: 'Interaktif: kapan fungsi memiliki maksimum dan minimum' },
    description: {
      en: 'The same function y = x² on four different domains, e^x on the whole line and a function with a jump: see which of them has a maximum and a minimum, and which of the three conditions of the Extreme Value Theorem each one breaks.',
      id: 'Fungsi y = x² yang sama pada empat domain berbeda, e^x pada seluruh garis, dan fungsi dengan lompatan: lihat mana yang punya maksimum dan minimum, dan syarat mana dari Teorema Nilai Ekstrem yang dilanggar masing-masing.',
    },
  },
  boxvolume: {
    title: { en: 'Interactive: the biggest box from a sheet of card', id: 'Interaktif: kotak terbesar dari selembar karton' },
    description: {
      en: 'Cut a square from each corner of a rectangular sheet and fold up the sides: change the sheet and the cut and watch the volume, whose largest value is at the one critical point V′(x) = 0 inside the interval.',
      id: 'Potong sebuah persegi dari setiap sudut karton persegi panjang dan lipat sisinya: ubah karton dan potongannya dan lihat volumenya, yang nilai terbesarnya ada di satu titik kritis V′(x) = 0 di dalam selang.',
    },
  },
  mvtexplorer: {
    title: { en: 'Interactive: the Mean Value Theorem', id: 'Interaktif: Teorema Nilai Rata-rata' },
    description: {
      en: 'Type a function and the ends of an interval, or pick a textbook example, and see the secant through the two ends, every tangent line parallel to it, and whether the two hypotheses (continuous, differentiable inside) hold.',
      id: 'Ketik fungsi dan ujung selang, atau pilih salah satu contoh buku, dan lihat tali busur melalui kedua ujung, setiap garis singgung yang sejajar dengannya, serta apakah kedua syarat (kontinu, terdiferensialkan di dalam) terpenuhi.',
    },
  },
  rollecases: {
    title: { en: 'Interactive: Rolle’s Theorem, case by case', id: 'Interaktif: Teorema Rolle, kasus demi kasus' },
    description: {
      en: 'Seven functions with f(a) = f(b): three where the theorem gives horizontal tangents, and four where a jump, a corner or a cusp breaks a hypothesis and no tangent is horizontal.',
      id: 'Tujuh fungsi dengan f(a) = f(b): tiga yang memberi garis singgung mendatar menurut teorema, dan empat yang lompatan, sudut, atau titik puncaknya melanggar syarat sehingga tidak ada garis singgung mendatar.',
    },
  },
  rolleroots: {
    title: { en: 'Interactive: between two zeros, a zero of the derivative', id: 'Interaktif: di antara dua nol, ada nol turunan' },
    description: {
      en: 'Choose the zeros of a polynomial and see its graph, its derivative and the point with a horizontal tangent that Rolle’s Theorem puts between every two consecutive zeros.',
      id: 'Pilih nol-nol sebuah polinom dan lihat grafiknya, turunannya, serta titik dengan garis singgung mendatar yang menurut teorema Rolle berada di antara setiap dua nol berurutan.',
    },
  },
  shiftcurves: {
    title: { en: 'Interactive: functions with the same derivative', id: 'Interaktif: fungsi dengan turunan yang sama' },
    description: {
      en: 'Pick a derivative and see that every function with that derivative is one curve shifted up or down by a constant C; move the point the graph must pass through and watch C change.',
      id: 'Pilih sebuah turunan dan lihat bahwa setiap fungsi dengan turunan itu adalah satu kurva yang digeser naik atau turun sebesar konstanta C; geser titik yang harus dilalui grafik dan lihat C berubah.',
    },
  },
  monotool: {
    title: { en: 'Interactive: where a function rises and falls', id: 'Interaktif: di mana fungsi naik dan turun' },
    description: {
      en: 'Type a function and a window, or pick a textbook example, and see the graph coloured by what it does, the graph of its derivative, the table of signs between the critical points, and the local and absolute extreme values.',
      id: 'Ketik fungsi dan jendela, atau pilih salah satu contoh buku, dan lihat grafik yang diwarnai menurut perilakunya, grafik turunannya, tabel tanda di antara titik kritis, serta nilai ekstrem lokal dan mutlak.',
    },
  },
  firsttest: {
    title: { en: 'Interactive: the First Derivative Test, case by case', id: 'Interaktif: Uji Turunan Pertama, kasus demi kasus' },
    description: {
      en: 'Eight critical points: a minimum, a maximum, two that are not extreme values, a corner, a cusp, a vertical tangent and a very flat maximum. See the sign of f′ on each side and the verdict of the test.',
      id: 'Delapan titik kritis: minimum, maksimum, dua yang bukan nilai ekstrem, sudut, titik puncak, garis singgung tegak, dan maksimum yang sangat datar. Lihat tanda f′ di setiap sisi dan putusan ujinya.',
    },
  },
  signchart: {
    title: { en: 'Interactive: from the derivative to the function', id: 'Interaktif: dari turunan ke fungsi' },
    description: {
      en: 'Type the derivative f′ (the textbook gives it in Exercises 1 to 14) and see the sign chart, where f rises and falls, and which critical points are local extremes, including double factors that do not change the sign.',
      id: 'Ketik turunan f′ (buku memberikannya di Latihan 1 sampai 14) dan lihat bagan tanda, di mana f naik dan turun, serta titik kritis mana yang ekstrem lokal, termasuk faktor ganda yang tidak mengubah tanda.',
    },
  },
  inequality: {
    title: { en: 'Interactive: proving an inequality by monotonicity', id: 'Interaktif: membuktikan pertidaksamaan dengan kemonotonan' },
    description: {
      en: 'Pick two functions and an interval, such as e^x and 1 + x on [0, 3], and see the difference h = f − g: if h(a) ≥ 0 and h never decreases, then f ≥ g everywhere on the interval.',
      id: 'Pilih dua fungsi dan selang, seperti e^x dan 1 + x pada [0, 3], dan lihat selisih h = f − g: jika h(a) ≥ 0 dan h tidak pernah turun, maka f ≥ g di seluruh selang.',
    },
  },
  concavitytool: {
    title: { en: 'Interactive: how a graph bends', id: 'Interaktif: bagaimana grafik melengkung' },
    description: {
      en: 'Type a function and a window, or pick an example, and see the graph coloured by its concavity, the graph of f″, the table of signs, and every point where f″ is zero or does not exist with the verdict on whether it is a point of inflection.',
      id: 'Ketik fungsi dan jendela, atau pilih contoh, dan lihat grafik yang diwarnai menurut kecekungannya, grafik f″, tabel tanda, serta setiap titik tempat f″ nol atau tidak ada dengan putusan apakah itu titik belok.',
    },
  },
  inflectioncases: {
    title: { en: 'Interactive: points of inflection, case by case', id: 'Interaktif: titik belok, kasus demi kasus' },
    description: {
      en: 'Seven graphs: inflection points where f″ = 0, where f″ does not exist, at a vertical tangent, and at a corner of the second derivative, and two points that look like inflection points and are not (x⁴ and a cusp).',
      id: 'Tujuh grafik: titik belok tempat f″ = 0, tempat f″ tidak ada, pada garis singgung tegak, dan di sudut turunan kedua, serta dua titik yang tampak seperti titik belok padahal bukan (x⁴ dan titik puncak).',
    },
  },
  secondtest: {
    title: { en: 'Interactive: the Second Derivative Test and where it fails', id: 'Interaktif: Uji Turunan Kedua dan di mana ia gagal' },
    description: {
      en: 'Eight critical points read by the Second Derivative Test and by the First side by side: where one derivative value decides, and where f″ = 0 or does not exist and the First Derivative Test has to take over.',
      id: 'Delapan titik kritis dibaca oleh Uji Turunan Kedua dan Uji Turunan Pertama berdampingan: di mana satu nilai turunan memutuskan, dan di mana f″ = 0 atau tidak ada sehingga Uji Turunan Pertama harus mengambil alih.',
    },
  },
  sketchtool: {
    title: { en: 'Interactive: sketch a curve step by step', id: 'Interaktif: sketsa kurva langkah demi langkah' },
    description: {
      en: 'Type a function and a window, or pick one of the five graphed examples of the textbook, and get the seven steps of curve sketching: domain and symmetry, derivatives, critical points, rising and falling, inflection points, asymptotes and intercepts.',
      id: 'Ketik fungsi dan jendela, atau pilih salah satu dari lima contoh grafik di buku, dan dapatkan tujuh langkah penggambaran kurva: domain dan simetri, turunan, titik kritis, naik dan turun, titik belok, asimtot, dan perpotongan.',
    },
  },
  rods: {
    title: { en: 'Interactive: counting rods', id: 'Interaktif: batang hitung' },
    description: {
      en: 'Type a number and see it laid out in counting rods, with the direction of the rods alternating between places and zero left as a gap, next to its Suzhou numerals.',
      id: 'Ketik sebuah bilangan dan lihat ia disusun dengan batang hitung, arah batang bergantian antartempat dan nol dibiarkan kosong, di samping angka Suzhou-nya.',
    },
  },
}
