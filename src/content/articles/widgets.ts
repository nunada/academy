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
  rods: {
    title: { en: 'Interactive: counting rods', id: 'Interaktif: batang hitung' },
    description: {
      en: 'Type a number and see it laid out in counting rods, with the direction of the rods alternating between places and zero left as a gap, next to its Suzhou numerals.',
      id: 'Ketik sebuah bilangan dan lihat ia disusun dengan batang hitung, arah batang bergantian antartempat dan nol dibiarkan kosong, di samping angka Suzhou-nya.',
    },
  },
}
