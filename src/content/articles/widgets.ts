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
  lhopitaltool: {
    title: { en: 'Interactive: l’Hôpital’s Rule, round by round', id: 'Interaktif: Aturan l’Hôpital, putaran demi putaran' },
    description: {
      en: 'Type a numerator, a denominator and the point (a number, inf or -inf), or pick a textbook example, and watch the rule applied round by round: the form at each step, the quotient of derivatives, and the limit where it stops.',
      id: 'Ketik pembilang, penyebut, dan titiknya (bilangan, inf, atau -inf), atau pilih contoh buku, dan lihat aturan diterapkan putaran demi putaran: bentuk di tiap langkah, hasil bagi turunan, dan limit di tempat ia berhenti.',
    },
  },
  formstool: {
    title: { en: 'Interactive: the other indeterminate forms', id: 'Interaktif: bentuk tak tentu lainnya' },
    description: {
      en: 'Products 0·∞, differences ∞−∞ and powers 1^∞, 0^0, ∞^0: see each one rewritten as a quotient (or through a logarithm) and the rule applied to it.',
      id: 'Hasil kali 0·∞, selisih ∞−∞, dan pangkat 1^∞, 0^0, ∞^0: lihat masing-masing ditulis ulang sebagai hasil bagi (atau lewat logaritma) dan aturan diterapkan padanya.',
    },
  },
  lhopitalfail: {
    title: { en: 'Interactive: when the rule does not help', id: 'Interaktif: ketika aturan tidak membantu' },
    description: {
      en: 'A quotient that is not indeterminate (where the rule gives a wrong number), one that cycles, one whose derivatives have no limit, and one-sided limits that differ: see what the stepper reports and what to do instead.',
      id: 'Hasil bagi yang bukan bentuk tak tentu (tempat aturan memberi bilangan yang salah), yang berputar-putar, yang turunannya tidak punya limit, dan limit satu sisi yang berbeda: lihat apa yang dilaporkan dan apa yang dilakukan sebagai gantinya.',
    },
  },
  cauchytool: {
    title: { en: 'Interactive: Cauchy’s Mean Value Theorem', id: 'Interaktif: Teorema Nilai Rata-rata Cauchy' },
    description: {
      en: 'Two functions f and g on an interval give a curve (g(t), f(t)): see the secant through its ends and every tangent parallel to it, where f′(c)/g′(c) equals the secant slope, the fact behind l’Hôpital’s Rule.',
      id: 'Dua fungsi f dan g pada suatu selang memberi kurva (g(t), f(t)): lihat tali busur melalui ujungnya dan setiap garis singgung yang sejajar dengannya, tempat f′(c)/g′(c) sama dengan gradien tali busur, fakta di balik Aturan l’Hôpital.',
    },
  },
  optproblems: {
    title: { en: 'Interactive: fifteen textbook optimization problems', id: 'Interaktif: lima belas soal optimisasi dari buku' },
    description: {
      en: 'Pick a textbook problem and see the four steps: what x stands for, the relations that reduce the problem to one variable, the domain, the graph, a table of the critical points and ends with the best marked, and the answer in the words of the problem.',
      id: 'Pilih satu soal dari buku dan lihat empat langkahnya: arti x, hubungan yang mengubah soal menjadi satu peubah, domain, grafik, tabel titik kritis dan ujung dengan yang terbaik ditandai, dan jawaban dalam kata-kata soal.',
    },
  },
  optcan: {
    title: { en: 'Interactive: the can that uses the least metal', id: 'Interaktif: kaleng yang memakai logam paling sedikit' },
    description: {
      en: 'Choose a closed can, an open one or one cut with waste, set the volume and drag the radius: see the can, the metal used as a function of the radius, and the best radius and height, which keep the same ratio at every volume.',
      id: 'Pilih kaleng tertutup, tanpa tutup, atau dengan sisa potongan, atur volumenya, dan geser jari-jarinya: lihat kalengnya, logam yang terpakai sebagai fungsi jari-jari, serta jari-jari dan tinggi terbaik, yang perbandingannya sama untuk setiap volume.',
    },
  },
  snell: {
    title: { en: 'Interactive: the quickest path of light', id: 'Interaktif: jalur tercepat cahaya' },
    description: {
      en: 'Move the point where a ray crosses a surface and watch the travel time; the minimum of t(x) is where sin θ₁ / c₁ = sin θ₂ / c₂ (Snell’s law), and with one medium and a mirror the angles of incidence and reflection are equal.',
      id: 'Geser titik tempat sinar memotong permukaan dan amati waktu tempuhnya; minimum t(x) ada di tempat sin θ₁ / c₁ = sin θ₂ / c₂ (hukum Snell), dan dengan satu medium dan cermin sudut datang sama dengan sudut pantul.',
    },
  },
  profittool: {
    title: { en: 'Interactive: marginal revenue equals marginal cost', id: 'Interaktif: pendapatan marjinal sama dengan biaya marjinal' },
    description: {
      en: 'With revenue px and the textbook cost curve, change the price and the production level: the profit peaks where marginal cost equals marginal revenue, there is a maximum loss at the other solution, and below a price of 3 there is none.',
      id: 'Dengan pendapatan px dan kurva biaya dari buku, ubah harga dan tingkat produksi: laba mencapai puncak di tempat biaya marjinal sama dengan pendapatan marjinal, rugi terbesar ada di penyelesaian lainnya, dan di bawah harga 3 tidak ada keduanya.',
    },
  },
  deliverytool: {
    title: { en: 'Interactive: how often to order', id: 'Interaktif: seberapa sering memesan' },
    description: {
      en: 'The average daily cost of a delivery every x days is a hyperbola plus a line: change the delivery and storage costs and see that the best cycle is where the two parts are equal, with the Wilson lot size formula as the same result.',
      id: 'Biaya harian rata-rata pengiriman setiap x hari adalah hiperbola ditambah garis: ubah biaya pengiriman dan penyimpanan dan lihat bahwa siklus terbaik ada di tempat kedua bagian sama besar, dengan rumus ukuran lot Wilson sebagai hasil yang sama.',
    },
  },
  newtontool: {
    title: { en: 'Interactive: Newton’s method, step by step', id: 'Interaktif: metode Newton, langkah demi langkah' },
    description: {
      en: 'Type a function and a starting value, or pick a textbook example, and watch the tangent lines: from each approximation up to the curve, along the tangent down to the x-axis, with the table of xₙ, f(xₙ), f′(xₙ) and xₙ₊₁.',
      id: 'Ketik sebuah fungsi dan nilai awal, atau pilih contoh buku, dan amati garis singgungnya: dari setiap hampiran naik ke kurva, menyusuri garis singgung ke sumbu-x, dengan tabel xₙ, f(xₙ), f′(xₙ), dan xₙ₊₁.',
    },
  },
  newtonspeed: {
    title: { en: 'Interactive: how fast does it converge?', id: 'Interaktif: seberapa cepat konvergensinya?' },
    description: {
      en: 'See the error at each step, the number of correct digits (it doubles for a simple root), the ratio e(n+1)/e(n)² against f″/(2f′), the slow constant factor for a multiple root, and bisection for comparison.',
      id: 'Lihat galat di setiap langkah, banyaknya angka benar (berlipat dua untuk akar sederhana), perbandingan e(n+1)/e(n)² terhadap f″/(2f′), faktor tetap yang lambat untuk akar ganda, dan bisection sebagai pembanding.',
    },
  },
  newtonfail: {
    title: { en: 'Interactive: when Newton’s method fails', id: 'Interaktif: ketika metode Newton gagal' },
    description: {
      en: 'Seven starting points that go wrong in different ways: a cycle, an escape to infinity, a start that is too far out, a horizontal tangent, the wrong root and a root that is too flat, each with its steps and picture.',
      id: 'Tujuh titik awal yang gagal dengan cara berbeda: siklus, lari ke tak hingga, awal yang terlalu jauh, garis singgung mendatar, akar yang keliru, dan akar yang terlalu datar, masing-masing dengan langkah dan gambarnya.',
    },
  },
  newtonbasin: {
    title: { en: 'Interactive: which root do you reach?', id: 'Interaktif: akar mana yang kamu capai?' },
    description: {
      en: 'A strip of 480 starting values, each coloured by the root that Newton’s method reaches, with the share of each root and the starts that reach none: the boundaries between colours are where tiny changes in the start matter.',
      id: 'Pita 480 nilai awal, masing-masing diwarnai oleh akar yang dicapai metode Newton, dengan bagian tiap akar dan awal yang tidak mencapai akar mana pun: batas antarwarna adalah tempat perubahan kecil pada awal berpengaruh.',
    },
  },
  newtonroots: {
    title: { en: 'Interactive: square roots and reciprocals by hand', id: 'Interaktif: akar kuadrat dan kebalikan dengan tangan' },
    description: {
      en: 'Newton’s method for xⁿ − a = 0 needs no derivative: x ← ((n − 1)x + a/xⁿ⁻¹)/n, the Babylonian rule for n = 2; and for 1/x − a = 0 it gives x(2 − a x), a way to divide without dividing.',
      id: 'Metode Newton untuk xⁿ − a = 0 tidak memerlukan turunan: x ← ((n − 1)x + a/xⁿ⁻¹)/n, aturan Babilonia untuk n = 2; dan untuk 1/x − a = 0 ia memberi x(2 − a x), cara membagi tanpa membagi.',
    },
  },
  fpbits: {
    title: { en: 'Interactive: the bits of a floating-point number', id: 'Interaktif: bit sebuah bilangan floating-point' },
    description: {
      en: 'Type a number and a format (float16, bfloat16, float32, float64) and see its sign, exponent and fraction bits, the formula they stand for, the exact value stored, the rounding error and the gap to its neighbours.',
      id: 'Ketik sebuah bilangan dan format (float16, bfloat16, float32, float64) dan lihat bit tanda, eksponen, dan pecahannya, rumus yang diwakilinya, nilai tepat yang tersimpan, galat pembulatan, dan jarak ke tetangganya.',
    },
  },
  fptoy: {
    title: { en: 'Interactive: every number of a tiny format', id: 'Interaktif: semua bilangan pada format mini' },
    description: {
      en: 'Choose a format with 2 to 4 exponent bits and 1 to 4 fraction bits and see all of its numbers on a line: crowded near zero, twice as far apart at each power of two, with the subnormal numbers filling the gap next to zero.',
      id: 'Pilih format dengan 2 sampai 4 bit eksponen dan 1 sampai 4 bit pecahan dan lihat semua bilangannya pada satu garis: rapat di dekat nol, dua kali lebih renggang di setiap pangkat dua, dengan bilangan subnormal mengisi celah di sebelah nol.',
    },
  },
  fpsum: {
    title: { en: 'Interactive: errors that add up', id: 'Interaktif: galat yang menumpuk' },
    description: {
      en: 'Add a value n times, one at a time, with Kahan’s compensation and exactly, in float32 or float64, and see the error grow with n; or add ones to 2^53 and watch them being absorbed.',
      id: 'Jumlahkan satu nilai n kali, satu per satu, dengan kompensasi Kahan, dan secara tepat, dalam float32 atau float64, dan lihat galat tumbuh bersama n; atau tambahkan satu-satu pada 2^53 dan perhatikan mereka terserap.',
    },
  },
  fpcancel: {
    title: { en: 'Interactive: when subtraction destroys digits', id: 'Interaktif: ketika pengurangan menghancurkan angka' },
    description: {
      en: 'Four expressions written in two ways, the obvious one and a stable one: move x and see how many correct digits each form keeps when the subtraction cancels the leading digits.',
      id: 'Empat ungkapan yang ditulis dengan dua cara, yang lazim dan yang stabil: geser x dan lihat berapa angka benar yang dipertahankan tiap bentuk ketika pengurangan menghapus angka terdepan.',
    },
  },
  bigowitness: {
    title: { en: 'Interactive: the definition of O(g), with c and n₀', id: 'Interaktif: definisi O(g), dengan c dan n₀' },
    description: {
      en: 'Type two functions f(n) and g(n) and a constant c, and find the threshold n₀ from which f(n) ≤ c·g(n): see the two curves, the crossing and the ratio f/g at the end of the scan.',
      id: 'Ketik dua fungsi f(n) dan g(n) dan sebuah konstanta c, dan cari ambang n₀ yang membuat f(n) ≤ c·g(n): lihat kedua kurva, titik potongnya, dan rasio f/g di ujung pemindaian.',
    },
  },
  bigogrowth: {
    title: { en: 'Interactive: how long do the growth classes take?', id: 'Interaktif: berapa lama tiap kelas pertumbuhan?' },
    description: {
      en: 'Slide the input size n from 1 to ten million and read the number of steps and the time of every class from 1 to n!, at the speed you choose, and the largest n that finishes in a second, a minute, an hour or a day.',
      id: 'Geser ukuran masukan n dari 1 sampai sepuluh juta dan baca banyaknya langkah dan waktu setiap kelas dari 1 sampai n!, pada kecepatan yang kamu pilih, dan n terbesar yang selesai dalam satu detik, menit, jam, atau hari.',
    },
  },
  bigocounter: {
    title: { en: 'Interactive: count the steps of an algorithm', id: 'Interaktif: hitung langkah sebuah algoritma' },
    description: {
      en: 'Twelve algorithms run on inputs of size 1, 2, 4, 8, …: see the counted steps, the ratio each time n doubles, and the steps divided by the growth class that fits, which settles on a constant.',
      id: 'Dua belas algoritma dijalankan pada masukan berukuran 1, 2, 4, 8, …: lihat langkah yang dihitung, rasio setiap n berlipat dua, dan langkah dibagi kelas pertumbuhan yang cocok, yang menuju konstanta.',
    },
  },
  bigorecur: {
    title: { en: 'Interactive: solve T(n) = a·T(n/b) + nᵈ', id: 'Interaktif: selesaikan T(n) = a·T(n/b) + nᵈ' },
    description: {
      en: 'Choose a, b and d, or a famous algorithm (merge sort, binary search, Karatsuba, Strassen), and see the case of the Master theorem, the solution, and the table of T(n) divided by the predicted growth.',
      id: 'Pilih a, b, dan d, atau sebuah algoritma terkenal (merge sort, pencarian biner, Karatsuba, Strassen), dan lihat kasus teorema Master, solusinya, dan tabel T(n) dibagi pertumbuhan yang diramalkan.',
    },
  },
  bsearch: {
    title: { en: 'Interactive: watch a binary search halve the list', id: 'Interaktif: lihat pencarian biner membelah daftar' },
    description: {
      en: 'Type a list and a target x and step through the search: the open interval lo to hi, the middle element looked at, and the answer for finding x, the first index with a[i] ≥ x, or the first with a[i] > x.',
      id: 'Ketik sebuah daftar dan target x lalu telusuri pencariannya langkah demi langkah: selang terbuka lo sampai hi, elemen tengah yang dilihat, dan jawaban untuk mencari x, indeks pertama dengan a[i] ≥ x, atau yang pertama dengan a[i] > x.',
    },
  },
  sortviz: {
    title: { en: 'Interactive: six sorting algorithms, move by move', id: 'Interaktif: enam algoritma pengurutan, gerakan demi gerakan' },
    description: {
      en: 'Pick selection, insertion, bubble, merge, quick or heap sort and an input (random, sorted, reversed, few values, nearly sorted), then play the bars and read the comparisons and moves it needs.',
      id: 'Pilih selection, insertion, bubble, merge, quick, atau heap sort dan sebuah masukan (acak, terurut, terbalik, sedikit nilai, hampir terurut), lalu putar batangnya dan baca perbandingan serta perpindahan yang dibutuhkan.',
    },
  },
  sortrace: {
    title: { en: 'Interactive: the sorting race', id: 'Interaktif: balapan pengurutan' },
    description: {
      en: 'Run all six algorithms on the same input of 16 to 1024 numbers and compare the counted comparisons and moves, to see why the best choice depends on the input, not only on the Big-O class.',
      id: 'Jalankan keenam algoritma pada masukan yang sama berukuran 16 sampai 1024 bilangan dan bandingkan perbandingan serta perpindahan yang dihitung, untuk melihat mengapa pilihan terbaik bergantung pada masukan, bukan hanya kelas Big-O.',
    },
  },
  bisectanswer: {
    title: { en: 'Interactive: binary search on the answer', id: 'Interaktif: pencarian biner pada jawaban' },
    description: {
      en: 'Halve an interval to trap a root of f(x) = 0 digit by digit, or find the integer square root of a number up to a trillion with about forty tests, and see what makes a question suitable for binary search.',
      id: 'Bagi dua sebuah selang untuk menjebak akar f(x) = 0 angka demi angka, atau cari akar kuadrat bulat sebuah bilangan sampai satu triliun dengan sekitar empat puluh pengujian, dan lihat apa yang membuat suatu pertanyaan cocok untuk pencarian biner.',
    },
  },
  fibexplore: {
    title: { en: 'Interactive: Fibonacci numbers and their ratios', id: 'Interaktif: bilangan Fibonacci dan perbandingannya' },
    description: {
      en: 'Slide n up to 120 and read the exact Fibonacci number, the ratio of neighbors with the decimals of the golden ratio it gets right, and the point where the Binet formula in floating point first goes wrong.',
      id: 'Geser n sampai 120 dan baca bilangan Fibonacci yang eksak, perbandingan tetangga dengan desimal rasio emas yang sudah benar, dan titik ketika rumus Binet dalam titik mengambang mulai salah.',
    },
  },
  fibcompute: {
    title: { en: 'Interactive: four ways to compute F(n)', id: 'Interaktif: empat cara menghitung F(n)' },
    description: {
      en: 'Slide n from 1 to 100 000 and compare the steps of the plain recursion, the memo, the loop and fast doubling, with the number of digits and the first and last digits of the exact answer.',
      id: 'Geser n dari 1 sampai 100.000 dan bandingkan langkah rekursi biasa, memo, perulangan, dan penggandaan cepat, dengan banyak angka serta angka pertama dan terakhir dari jawaban eksak.',
    },
  },
  fibidentity: {
    title: { en: 'Interactive: check the Fibonacci identities', id: 'Interaktif: periksa identitas Fibonacci' },
    description: {
      en: 'Pick n and see seven identities (sums, sums of squares, Cassini, doubling) hold with exact numbers, each side computed independently, and check that gcd(F(m), F(n)) equals F(gcd(m, n)).',
      id: 'Pilih n dan lihat tujuh identitas (jumlah, jumlah kuadrat, Cassini, penggandaan) berlaku dengan bilangan eksak, tiap ruas dihitung terpisah, dan periksa bahwa gcd(F(m), F(n)) sama dengan F(gcd(m, n)).',
    },
  },
  fibzeck: {
    title: { en: 'Interactive: write a number with Fibonacci numbers', id: 'Interaktif: tulis bilangan dengan bilangan Fibonacci' },
    description: {
      en: 'Type a number and get its Zeckendorf sum of non-neighboring Fibonacci numbers, its string of Fibonacci digits next to its binary form, and how many other sums of different Fibonacci numbers it has.',
      id: 'Ketik sebuah bilangan dan dapatkan jumlah Zeckendorf-nya dari bilangan Fibonacci yang tidak bertetangga, untaian angka Fibonacci di samping bentuk binernya, dan berapa jumlah lain dari bilangan Fibonacci berbeda yang dimilikinya.',
    },
  },
  fibpisano: {
    title: { en: 'Interactive: the period of Fibonacci numbers mod m', id: 'Interaktif: periode bilangan Fibonacci mod m' },
    description: {
      en: 'Choose a modulus m and see the Pisano period after which the remainders repeat, then find F(n) mod m for an n of up to 30 digits by reducing n modulo the period.',
      id: 'Pilih modulus m dan lihat periode Pisano yang setelahnya sisa-sisa berulang, lalu cari F(n) mod m untuk n sampai 30 angka dengan mereduksi n modulo periode.',
    },
  },
  hanoiplay: {
    title: { en: 'Interactive: play the Tower of Hanoi', id: 'Interaktif: mainkan Menara Hanoi' },
    description: {
      en: 'Move three to seven discs from peg A to peg C by taking from one peg and putting on another, with the move counter, the best possible number, and a hint that always gives the best next move from the current position.',
      id: 'Pindahkan tiga sampai tujuh cakram dari tiang A ke tiang C dengan mengambil dari satu tiang dan menaruh di tiang lain, dengan penghitung langkah, jumlah terbaik, dan petunjuk yang selalu memberi langkah terbaik berikutnya dari posisi sekarang.',
    },
  },
  hanoitime: {
    title: { en: 'Interactive: how long does the tower take?', id: 'Interaktif: berapa lama menara itu?' },
    description: {
      en: 'Slide the number of discs up to 64 and read the number of moves 2ⁿ − 1, the time at one move a second, a thousand or a billion, how often each disc moves, and the comparison with the age of the universe.',
      id: 'Geser banyak cakram sampai 64 dan baca banyak langkah 2ⁿ − 1, waktu pada satu langkah per detik, seribu, atau semiliar, seberapa sering tiap cakram bergerak, dan perbandingan dengan usia alam semesta.',
    },
  },
  hanoistate: {
    title: { en: 'Interactive: the position after any move', id: 'Interaktif: posisi setelah langkah mana pun' },
    description: {
      en: 'Type a move number for a tower of up to 64 discs and see the position after it, which disc moved, and the binary and Gray code of the move number, computed directly without making the earlier moves.',
      id: 'Ketik nomor langkah untuk menara sampai 64 cakram dan lihat posisi setelahnya, cakram mana yang dipindah, serta biner dan kode Gray dari nomor langkah itu, dihitung langsung tanpa melakukan langkah sebelumnya.',
    },
  },
  hanoigraph: {
    title: { en: 'Interactive: the graph of all positions', id: 'Interaktif: graf semua posisi' },
    description: {
      en: 'See every position of up to five discs as a dot and every legal move as a line: a Sierpiński triangle with the single shortest solution along its edge, and click a dot to read its position and its distance from a finished tower.',
      id: 'Lihat setiap posisi sampai lima cakram sebagai titik dan setiap langkah sah sebagai garis: segitiga Sierpiński dengan satu solusi terpendek menyusuri tepinya, dan klik sebuah titik untuk membaca posisinya dan jaraknya dari menara yang selesai.',
    },
  },
  hanoipegs: {
    title: { en: 'Interactive: more than three pegs', id: 'Interaktif: lebih dari tiga tiang' },
    description: {
      en: 'Choose three to six pegs and up to 64 discs and read the Frame–Stewart number of moves, the number of discs it moves first to a spare peg, and a table that shows how fast extra pegs shorten the solution.',
      id: 'Pilih tiga sampai enam tiang dan sampai 64 cakram dan baca bilangan Frame–Stewart untuk banyak langkah, banyak cakram yang dipindah lebih dulu ke tiang cadangan, dan tabel yang memperlihatkan seberapa cepat tiang tambahan memperpendek solusi.',
    },
  },
  texlive: {
    title: { en: 'Interactive: type LaTeX and see the formula', id: 'Interaktif: ketik LaTeX dan lihat rumusnya' },
    description: {
      en: 'Type a formula in LaTeX and watch it appear, with a linter that points at the usual mistakes (a missing brace, x^10, a mismatched environment, an undefined command) in the words LaTeX itself would use.',
      id: 'Ketik rumus dalam LaTeX dan lihat ia muncul, dengan linter yang menunjuk kesalahan yang lazim (kurung kurawal hilang, x^10, lingkungan yang tidak cocok, perintah tak terdefinisi) dalam kata-kata yang akan dipakai LaTeX sendiri.',
    },
  },
  texsymbols: {
    title: { en: 'Interactive: find the command for a symbol', id: 'Interaktif: cari perintah untuk sebuah simbol' },
    description: {
      en: 'Search more than a hundred symbols by name, in English or Indonesian, or by part of the command, filter by kind (Greek letters, relations, arrows, brackets) and see which ones need the amsmath or amssymb package.',
      id: 'Cari lebih dari seratus simbol menurut nama, dalam bahasa Inggris atau Indonesia, atau menurut sebagian perintah, saring menurut jenis (huruf Yunani, relasi, panah, kurung) dan lihat mana yang memerlukan paket amsmath atau amssymb.',
    },
  },
  texgen: {
    title: { en: 'Interactive: build a formula from a form', id: 'Interaktif: susun rumus dari sebuah formulir' },
    description: {
      en: 'Fill in the fields of a fraction, root, power, sum, product, integral, limit, matrix or piecewise function and get the LaTeX code and the drawn result, ready to copy, with the linter checking it.',
      id: 'Isi kolom sebuah pecahan, akar, pangkat, jumlah, hasil kali, integral, limit, matriks, atau fungsi sepotong-sepotong dan dapatkan kode LaTeX dan hasil gambarnya, siap disalin, dengan linter yang memeriksanya.',
    },
  },
  texdoc: {
    title: { en: 'Interactive: assemble a LaTeX document', id: 'Interaktif: rakit dokumen LaTeX' },
    description: {
      en: 'Choose the class, font size, paper, packages, margins and parts (abstract, equation, table, figure, bibliography) and get a complete main.tex with the commands to compile it and the rules that were applied.',
      id: 'Pilih kelas, ukuran huruf, kertas, paket, margin, dan bagian (abstrak, persamaan, tabel, gambar, daftar pustaka) dan dapatkan main.tex lengkap dengan perintah untuk mengompilasinya dan aturan yang diterapkan.',
    },
  },
  angleconvert: {
    title: { en: 'Interactive: one angle in every unit', id: 'Interaktif: satu sudut dalam setiap satuan' },
    description: {
      en: 'Type an angle in degrees, radians, gradians or turns and read it in all four, as a fraction of π, in degrees, minutes and seconds, with its name and its complement, supplement and explement, drawn on a circle.',
      id: 'Ketik sebuah sudut dalam derajat, radian, gradian, atau putaran dan baca dalam keempatnya, sebagai pecahan π, dalam derajat, menit, dan detik, dengan namanya serta penyiku, pelurus, dan pelengkap penuhnya, digambar pada lingkaran.',
    },
  },
  angletransversal: {
    title: { en: 'Interactive: a line across two parallel lines', id: 'Interaktif: garis memotong dua garis sejajar' },
    description: {
      en: 'Move the transversal and see the eight angles; choose corresponding, alternate, co-interior, vertical or linear pairs to highlight them and see which are equal and which add up to 180°.',
      id: 'Gerakkan garis lintang dan lihat kedelapan sudutnya; pilih pasangan sehadap, berseberangan, sepihak, bertolak belakang, atau berpelurus untuk menyorotnya dan lihat mana yang sama besar dan mana yang berjumlah 180°.',
    },
  },
  anglepolygon: {
    title: { en: 'Interactive: the angles of a regular polygon', id: 'Interaktif: sudut-sudut segi banyak beraturan' },
    description: {
      en: 'Slide the number of sides from 3 to 20 and read the sum of the interior angles, each interior and exterior angle and the diagonals, see whether the polygon tiles the plane, and find the polygon from its angle.',
      id: 'Geser banyak sisi dari 3 sampai 20 dan baca jumlah sudut dalam, tiap sudut dalam dan luar serta diagonalnya, lihat apakah segi banyak itu mengubin bidang, dan cari segi banyaknya dari sudutnya.',
    },
  },
  angleclock: {
    title: { en: 'Interactive: the angle between the hands of a clock', id: 'Interaktif: sudut di antara jarum jam' },
    description: {
      en: 'Set the hour, minute and second and see the angle between the hands, then pick an angle and list the 22 (or 11) exact times in twelve hours at which the hands make it, to the fraction of a second.',
      id: 'Atur jam, menit, dan detik dan lihat sudut di antara jarumnya, lalu pilih sebuah sudut dan daftarkan 22 (atau 11) waktu tepat dalam dua belas jam ketika jarum membentuknya, sampai pecahan detik.',
    },
  },
  anglecircle: {
    title: { en: 'Interactive: angles at the center and on a circle', id: 'Interaktif: sudut di pusat dan pada lingkaran' },
    description: {
      en: 'Move a central angle and a point P on the circle, and see the angle at P measured from coordinates against half the central angle, with the arc, sector area and chord for a radius you choose.',
      id: 'Gerakkan sudut pusat dan titik P pada lingkaran, dan lihat sudut di P yang diukur dari koordinat dibandingkan setengah sudut pusat, dengan busur, luas juring, dan tali busur untuk jari-jari yang kamu pilih.',
    },
  },
  anglevector: {
    title: { en: 'Interactive: the angle between two vectors, and bearings', id: 'Interaktif: sudut antara dua vektor, dan bearing' },
    description: {
      en: 'Enter two vectors and compare the angle from atan2 with the arc cosine formula, which fails for very small angles; or turn a mathematical direction into a compass bearing and the other way round.',
      id: 'Masukkan dua vektor dan bandingkan sudut dari atan2 dengan rumus arc kosinus, yang gagal untuk sudut yang sangat kecil; atau ubah arah matematika menjadi bearing kompas dan sebaliknya.',
    },
  },
  rods: {
    title: { en: 'Interactive: counting rods', id: 'Interaktif: batang hitung' },
    description: {
      en: 'Type a number and see it laid out in counting rods, with the direction of the rods alternating between places and zero left as a gap, next to its Suzhou numerals.',
      id: 'Ketik sebuah bilangan dan lihat ia disusun dengan batang hitung, arah batang bergantian antartempat dan nol dibiarkan kosong, di samping angka Suzhou-nya.',
    },
  },
  constructplay: {
    title: { en: 'Interactive: draw with a ruler and compass, step by step', id: 'Interaktif: melukis dengan penggaris dan jangka, langkah demi langkah' },
    description: {
      en: 'Choose one of eleven constructions (copy a segment, midpoint, perpendicular, parallel, 60°, 90°, 30°, 45°, copy or bisect an angle) and step through every circle and line, then measure the finished drawing.',
      id: 'Pilih salah satu dari sebelas lukisan (menyalin ruas garis, titik tengah, tegak lurus, sejajar, 60°, 90°, 30°, 45°, menyalin atau membagi dua sudut) dan ikuti setiap lingkaran dan garis, lalu ukur gambar yang sudah jadi.',
    },
  },
  constructangle: {
    title: { en: 'Interactive: which angles can you build?', id: 'Interaktif: sudut mana yang dapat dilukis?' },
    description: {
      en: 'Type a whole number of degrees from 1 to 179: if a ruler and compass can build it you get the shortest recipe of 60°, 90°, 72°, halving, adding and subtracting, and the drawing; if not, you see why.',
      id: 'Ketik bilangan bulat derajat dari 1 sampai 179: jika penggaris dan jangka dapat membangunnya Anda mendapat resep terpendek dari 60°, 90°, 72°, membagi dua, menambah, dan mengurangi, beserta gambarnya; jika tidak, Anda melihat sebabnya.',
    },
  },
  constructdivide: {
    title: { en: 'Interactive: divide a segment into equal parts', id: 'Interaktif: membagi ruas garis menjadi bagian-bagian sama' },
    description: {
      en: 'Cut a segment into 2 to 10 equal parts with steps on a ray and parallel lines, play every circle and line, and measure each mark against k/n of the way.',
      id: 'Potong sebuah ruas garis menjadi 2 sampai 10 bagian sama dengan langkah-langkah pada sebuah sinar dan garis-garis sejajar, putar setiap lingkaran dan garis, dan ukur tiap tanda terhadap k/n dari panjangnya.',
    },
  },
  constructtrisect: {
    title: { en: 'Interactive: trisecting an angle', id: 'Interaktif: membagi tiga sebuah sudut' },
    description: {
      en: 'Slide an angle and see Archimedes’ trisection with a ruler that has two marks, and whether a plain ruler and compass could trisect that angle too (they cannot for 60°).',
      id: 'Geser sebuah sudut dan lihat pembagian tiga Archimedes dengan penggaris yang memiliki dua tanda, serta apakah penggaris dan jangka biasa juga dapat membagi tiga sudut itu (tidak dapat untuk 60°).',
    },
  },
  constructpoly: {
    title: { en: 'Interactive: which regular polygons can be built?', id: 'Interaktif: segi banyak beraturan mana yang dapat dilukis?' },
    description: {
      en: 'Type the number of sides from 3 to 65537 and see whether the regular polygon can be built with a ruler and compass, with the factors that decide it, Euler’s φ and the central angle.',
      id: 'Ketik banyak sisi dari 3 sampai 65537 dan lihat apakah segi banyak beraturannya dapat dilukis dengan penggaris dan jangka, beserta faktor-faktor penentunya, φ Euler, dan sudut pusatnya.',
    },
  },
  trigratio: {
    title: { en: 'Interactive: the ratios of a right triangle', id: 'Interaktif: perbandingan pada segitiga siku-siku' },
    description: {
      en: 'Slide an angle and the hypotenuse of a right triangle and read sine, cosine, tangent and their reciprocals as ratios of sides: the sides grow, the ratios do not.',
      id: 'Geser sebuah sudut dan sisi miring segitiga siku-siku dan baca sinus, kosinus, tangen, dan kebalikannya sebagai perbandingan sisi: sisinya membesar, perbandingannya tidak.',
    },
  },
  trigright: {
    title: { en: 'Interactive: solve a right triangle', id: 'Interaktif: pecahkan segitiga siku-siku' },
    description: {
      en: 'Give an angle and a side, or two sides, and get every side and angle with the formula used; five everyday problems (a tower, a ladder, a ramp, a road, a shadow) are ready to try.',
      id: 'Berikan satu sudut dan satu sisi, atau dua sisi, dan dapatkan setiap sisi dan sudut beserta rumus yang dipakai; lima soal sehari-hari (menara, tangga, landasan, jalan, bayangan) siap dicoba.',
    },
  },
  trigcircle: {
    title: { en: 'Interactive: the unit circle', id: 'Interaktif: lingkaran satuan' },
    description: {
      en: 'Turn an angle from −360° to 720° and watch the point (cos, sin) move on the unit circle, with its quadrant, reference angle, signs, exact values for multiples of 15° and all six functions.',
      id: 'Putar sebuah sudut dari −360° sampai 720° dan lihat titik (cos, sin) bergerak pada lingkaran satuan, beserta kuadran, sudut acuan, tanda, nilai eksak untuk kelipatan 15°, dan keenam fungsinya.',
    },
  },
  trigequation: {
    title: { en: 'Interactive: solve sin x = c, cos x = c and tan x = c', id: 'Interaktif: selesaikan sin x = c, cos x = c, dan tan x = c' },
    description: {
      en: 'Choose a function and a level c and see every angle between 0° and 360° that reaches it as the crossings of a graph and a line, with the general solution for all turns.',
      id: 'Pilih sebuah fungsi dan tingkat c dan lihat setiap sudut di antara 0° dan 360° yang mencapainya sebagai titik potong grafik dan garis, beserta penyelesaian umum untuk semua putaran.',
    },
  },
  trigwave: {
    title: { en: 'Interactive: the graph of a sine or cosine wave', id: 'Interaktif: grafik gelombang sinus atau kosinus' },
    description: {
      en: 'Change a, b, c and d in y = a sin(b(x − c)) + d and watch the amplitude, period, phase shift and midline change, with the maximum, the minimum and where the wave crosses zero.',
      id: 'Ubah a, b, c, dan d dalam y = a sin(b(x − c)) + d dan lihat amplitudo, periode, pergeseran fase, dan garis tengah berubah, beserta maksimum, minimum, dan tempat gelombang memotong nol.',
    },
  },
  trigidentity: {
    title: { en: 'Interactive: test a trigonometric identity', id: 'Interaktif: uji sebuah identitas trigonometri' },
    description: {
      en: 'Pick one of eleven true identities or six tempting false ones, move the angles, and compare both sides over all 360 whole degrees: an identity never fails, and a false one fails at a counterexample.',
      id: 'Pilih salah satu dari sebelas identitas yang benar atau enam yang menggoda tetapi salah, gerakkan sudutnya, dan bandingkan kedua ruas pada semua 360 derajat bulat: identitas tidak pernah gagal, dan yang salah gagal pada contoh penyangkal.',
    },
  },
  idtest: {
    title: { en: 'Interactive: test an identity before you prove it', id: 'Interaktif: uji sebuah identitas sebelum membuktikannya' },
    description: {
      en: 'Type the two sides of a claimed identity and compare them at hundreds of angles: you get a counterexample if it is false, or a note when the sides agree only where both are defined.',
      id: 'Ketik kedua ruas sebuah identitas yang diklaim dan bandingkan pada ratusan sudut: Anda mendapat contoh penyangkal bila salah, atau catatan bila kedua ruas sama hanya di tempat keduanya terdefinisi.',
    },
  },
  idproof: {
    title: { en: 'Interactive: proofs, one line at a time', id: 'Interaktif: pembuktian, satu baris demi satu baris' },
    description: {
      en: 'Nine proofs of identities, from tan x + cot x = sec x csc x to sin 3x, each shown line by line with the reason for every step, and every line checked against the one before it.',
      id: 'Sembilan pembuktian identitas, dari tan x + cot x = sec x csc x sampai sin 3x, masing-masing ditampilkan baris demi baris dengan alasan setiap langkah, dan setiap baris diperiksa terhadap baris sebelumnya.',
    },
  },
  idrotate: {
    title: { en: 'Interactive: the sum formula as a rotation', id: 'Interaktif: rumus jumlah sebagai rotasi' },
    description: {
      en: 'Turn the point at x through y on the unit circle and see its new coordinates built from the four products cos x cos y, sin x sin y, sin x cos y and cos x sin y.',
      id: 'Putar titik pada x sebesar y pada lingkaran satuan dan lihat koordinat barunya tersusun dari empat hasil kali cos x cos y, sin x sin y, sin x cos y, dan cos x sin y.',
    },
  },
  idexact: {
    title: { en: 'Interactive: exact values from the formulas', id: 'Interaktif: nilai eksak dari rumus-rumus' },
    description: {
      en: 'Pick 15°, 75°, 105°, 165°, 22.5°, 67.5°, 18°, 36°, 54° or 72° and read how the sum, difference and half-angle formulas give its sine, cosine and tangent exactly.',
      id: 'Pilih 15°, 75°, 105°, 165°, 22,5°, 67,5°, 18°, 36°, 54°, atau 72° dan baca bagaimana rumus jumlah, selisih, dan sudut paruh memberi sinus, kosinus, dan tangennya secara eksak.',
    },
  },
  idharmonic: {
    title: { en: 'Interactive: a sin x + b cos x as one wave', id: 'Interaktif: a sin x + b cos x sebagai satu gelombang' },
    description: {
      en: 'Choose a and b and see a sin x + b cos x become R sin(x + φ), with the amplitude R, the shift φ, the two curves lying on top of each other, and the solutions of the equation for any value.',
      id: 'Pilih a dan b dan lihat a sin x + b cos x menjadi R sin(x + φ), dengan amplitudo R, pergeseran φ, kedua kurva saling menumpuk, dan penyelesaian persamaan untuk nilai apa pun.',
    },
  },
  eqsolve: {
    title: { en: 'Interactive: solve sin(kx + b) = c, cos(kx + b) = c and tan(kx + b) = c', id: 'Interaktif: selesaikan sin(kx + b) = c, cos(kx + b) = c, dan tan(kx + b) = c' },
    description: {
      en: 'Choose a function, the multiple k, the shift b, the level c and an interval, and see every solution as a crossing of a graph and a line, with the general solution and the count per turn.',
      id: 'Pilih sebuah fungsi, kelipatan k, pergeseran b, tingkat c, dan sebuah interval, dan lihat setiap penyelesaian sebagai titik potong grafik dan garis, beserta penyelesaian umum dan banyaknya per putaran.',
    },
  },
  eqquad: {
    title: { en: 'Interactive: an equation that is quadratic in sin x, cos x or tan x', id: 'Interaktif: persamaan yang kuadrat dalam sin x, cos x, atau tan x' },
    description: {
      en: 'Set a, b and c in a·u² + b·u + c = 0 with u = sin x, cos x or tan x, and see the roots u, which of them an angle can reach, and the angles between 0° and 360°.',
      id: 'Atur a, b, dan c dalam a·u² + b·u + c = 0 dengan u = sin x, cos x, atau tan x, dan lihat akar u, mana yang dapat dicapai sebuah sudut, dan sudut di antara 0° dan 360°.',
    },
  },
  eqsteps: {
    title: { en: 'Interactive: eleven equations solved line by line', id: 'Interaktif: sebelas persamaan diselesaikan baris demi baris' },
    description: {
      en: 'Eleven trigonometric equations, each solved one line at a time with the reason for every step and a graph of both sides, including the one where squaring adds roots that are not solutions.',
      id: 'Sebelas persamaan trigonometri, masing-masing diselesaikan satu baris demi satu baris dengan alasan setiap langkah dan grafik kedua ruas, termasuk yang pengkuadratannya menambah akar yang bukan penyelesaian.',
    },
  },
  eqnumeric: {
    title: { en: "Interactive: solve cos x = x by bisection and by Newton's method", id: 'Interaktif: selesaikan cos x = x dengan bisection dan metode Newton' },
    description: {
      en: "Watch bisection halve an interval and Newton's method follow tangent lines to the root of five equations that no formula can solve, and see how many decimals each step gains.",
      id: 'Lihat bisection membelah dua sebuah interval dan metode Newton mengikuti garis singgung menuju akar dari lima persamaan yang tak dapat diselesaikan rumus mana pun, dan lihat berapa desimal yang didapat tiap langkah.',
    },
  },
  gfsix: {
    title: { en: 'Interactive: the graphs of the six trigonometric functions', id: 'Interaktif: grafik keenam fungsi trigonometri' },
    description: {
      en: 'Pick sine, cosine, tangent, cosecant, secant or cotangent, move a point along its graph, and read its period, domain, range, symmetry, zeros and asymptotes in degrees or radians.',
      id: 'Pilih sinus, kosinus, tangen, kosekan, sekan, atau kotangen, geser sebuah titik di sepanjang grafiknya, dan baca periode, daerah asal, daerah hasil, simetri, nol, dan asimtotnya dalam derajat atau radian.',
    },
  },
  gftrans: {
    title: { en: 'Interactive: a, b, c and d for any trigonometric graph', id: 'Interaktif: a, b, c, dan d untuk grafik trigonometri apa pun' },
    description: {
      en: 'Stretch, squeeze, shift and lift the graph of any of the six functions with y = a f(b(x − c)) + d, with the parent drawn faintly, the asymptotes, the points to plot and the equation in both forms.',
      id: 'Regangkan, rapatkan, geser, dan angkat grafik salah satu dari enam fungsi dengan y = a f(b(x − c)) + d, dengan fungsi induk digambar samar, asimtot, titik yang digambar, dan persamaan dalam kedua bentuk.',
    },
  },
  gfread: {
    title: { en: 'Interactive: find the equation of a wave from its graph', id: 'Interaktif: temukan persamaan gelombang dari grafiknya' },
    description: {
      en: 'Enter the highest and lowest values and the x of two successive peaks, and get a, d, the period and the sine and cosine equations, for a tide, the mains voltage or a wave of your own.',
      id: 'Masukkan nilai tertinggi dan terendah dan x dua puncak berurutan, dan dapatkan a, d, periode, serta persamaan sinus dan kosinus, untuk pasang surut, tegangan listrik, atau gelombang buatan sendiri.',
    },
  },
  gfsum: {
    title: { en: 'Interactive: adding two sine waves', id: 'Interaktif: menjumlahkan dua gelombang sinus' },
    description: {
      en: 'Choose two frequencies, amplitudes and a phase and see when the sum repeats, when it never does (the ratio is irrational), and how close frequencies beat.',
      id: 'Pilih dua frekuensi, amplitudo, dan fase dan lihat kapan jumlahnya berulang, kapan tidak pernah (perbandingannya irasional), dan bagaimana frekuensi yang berdekatan menghasilkan layangan.',
    },
  },
  gffit: {
    title: { en: 'Interactive: fit a sine wave to measurements', id: 'Interaktif: cocokkan gelombang sinus dengan pengukuran' },
    description: {
      en: 'Fit the best wave of a chosen period to monthly temperatures, daylight or a tide by least squares, see the errors as red segments, and search for the period that explains the most.',
      id: 'Cocokkan gelombang terbaik berperiode tertentu dengan suhu bulanan, jam siang, atau pasang surut dengan kuadrat terkecil, lihat galatnya sebagai ruas merah, dan cari periode yang menjelaskan paling banyak.',
    },
  },
  lsratio: {
    title: { en: 'Interactive: the law of sines in any triangle', id: 'Interaktif: aturan sinus pada segitiga apa pun' },
    description: {
      en: 'Set two angles and a side and see the triangle with the circle through its vertices, the three ratios side over sine of the opposite angle all equal to the diameter, and the area three ways.',
      id: 'Atur dua sudut dan satu sisi dan lihat segitiganya beserta lingkaran yang melalui titik-titik sudutnya, ketiga perbandingan sisi per sinus sudut di depannya yang semuanya sama dengan diameter, dan luas dengan tiga cara.',
    },
  },
  lsambig: {
    title: { en: 'Interactive: the ambiguous case, zero, one or two triangles', id: 'Interaktif: kasus ambigu, nol, satu, atau dua segitiga' },
    description: {
      en: 'Slide the side a while b and the angle A stay fixed, and watch the circle of radius a around C meet the ray at zero, one or two points, with both triangles solved.',
      id: 'Geser sisi a sementara b dan sudut A tetap, dan lihat lingkaran berjari-jari a di sekitar C memotong sinar di nol, satu, atau dua titik, dengan kedua segitiga terpecahkan.',
    },
  },
  lssurvey: {
    title: { en: 'Interactive: the width of a river from a baseline and two angles', id: 'Interaktif: lebar sungai dari garis dasar dan dua sudut' },
    description: {
      en: 'Two observers read the angles to a tree on the far bank: get the distances and the width of the river, and see how an error of a degree in each reading moves the answer.',
      id: 'Dua pengamat membaca sudut ke pohon di seberang: dapatkan jarak dan lebar sungai, dan lihat bagaimana galat satu derajat pada tiap bacaan menggeser jawabannya.',
    },
  },
  lchinge: {
    title: { en: 'Interactive: the hinge, how the third side grows with the angle', id: 'Interaktif: engsel, bagaimana sisi ketiga bertambah dengan sudutnya' },
    description: {
      en: 'Open two sides of lengths a and b like a hinge and watch c² = a² + b² − 2ab cos C: the correction term, the right angle where it vanishes, and the limits |a − b| and a + b.',
      id: 'Buka dua sisi berpanjang a dan b seperti engsel dan lihat c² = a² + b² − 2ab cos C: suku koreksi, sudut siku-siku tempat ia lenyap, dan batas |a − b| dan a + b.',
    },
  },
  lcsss: {
    title: { en: 'Interactive: the three angles from three sides, and the thin triangle', id: 'Interaktif: ketiga sudut dari tiga sisi, dan segitiga tipis' },
    description: {
      en: 'Type three side lengths and get the angles two ways, by the arccosine and by the half-angle form, with the kind of each angle; a triangle with two very long sides shows where the plain arccosine fails.',
      id: 'Ketik tiga panjang sisi dan dapatkan sudutnya dengan dua cara, lewat arkus kosinus dan bentuk setengah sudut, beserta jenis tiap sudut; segitiga dengan dua sisi sangat panjang memperlihatkan di mana arkus kosinus biasa gagal.',
    },
  },
  lctrip: {
    title: { en: 'Interactive: a ship on two bearings, how far and in which direction', id: 'Interaktif: kapal pada dua arah, seberapa jauh dan ke arah mana' },
    description: {
      en: 'Sail a distance on one bearing and then another and get the straight-line distance, the bearing of the end and the bearing home, with the law of cosines on the triangle of the journey.',
      id: 'Berlayarlah sejauh tertentu pada satu arah lalu arah lain dan dapatkan jarak garis lurus, arah akhir, dan arah pulang, dengan aturan kosinus pada segitiga perjalanan itu.',
    },
  },
  lsgraph: {
    title: { en: 'Interactive: two lines, one system', id: 'Interaktif: dua garis, satu sistem' },
    description: {
      en: 'Type two linear equations and watch their lines: they cross at one point, never meet, or are the same line, with the exact crossing point and the determinants D, Dx and Dy that decide which.',
      id: 'Ketik dua persamaan linear dan lihat garisnya: keduanya berpotongan di satu titik, tak pernah bertemu, atau garis yang sama, dengan titik potong eksak dan determinan D, Dx, dan Dy yang menentukannya.',
    },
  },
  lselim: {
    title: { en: 'Interactive: solve it step by step', id: 'Interaktif: selesaikan langkah demi langkah' },
    description: {
      en: 'Type a system and see it solved by elimination, by substitution or by Cramer’s rule, every step written out with exact fractions, including the systems that cancel to 0 = 0 or to 0 = 5.',
      id: 'Ketik sebuah sistem dan lihat ia diselesaikan dengan eliminasi, substitusi, atau aturan Cramer, setiap langkah ditulis dengan pecahan eksak, termasuk sistem yang habis menjadi 0 = 0 atau 0 = 5.',
    },
  },
  lsill: {
    title: { en: 'Interactive: almost parallel lines', id: 'Interaktif: garis yang hampir sejajar' },
    description: {
      en: 'Two lines at a tiny angle: nudge one right-hand side by a hair and the crossing point jumps, and below about 10⁻¹⁶ double precision cannot tell the lines apart at all, while exact fractions can.',
      id: 'Dua garis dengan sudut sangat kecil: geser satu ruas kanan sehelai rambut dan titik potongnya melompat, dan di bawah sekitar 10⁻¹⁶ presisi ganda sama sekali tak dapat membedakan kedua garis, sedangkan pecahan eksak bisa.',
    },
  },
  cbnet: {
    title: { en: 'Interactive: which arrangements of six squares fold into a cube?', id: 'Interaktif: susunan enam persegi mana yang terlipat menjadi kubus?' },
    description: {
      en: 'Press squares on a grid to build a net, or load one of the 11 nets of the cube; see whether it folds, which face each square becomes, and why a row of six or a 2 × 3 block does not.',
      id: 'Tekan persegi pada kisi untuk menyusun jaring, atau muat salah satu dari 11 jaring kubus; lihat apakah ia terlipat, sisi mana yang menjadi tiap persegi, dan mengapa satu baris enam atau blok 2 × 3 tidak bisa.',
    },
  },
  cbmeasure: {
    title: { en: 'Interactive: edge, area, volume and diagonals of a cube', id: 'Interaktif: rusuk, luas, volume, dan diagonal kubus' },
    description: {
      en: 'Slide the edge of a cube and read its face area, surface area, volume, face diagonal and space diagonal, and see what doubling the edge does to the area and the volume.',
      id: 'Geser rusuk sebuah kubus dan baca luas sisi, luas permukaan, volume, diagonal sisi, dan diagonal ruangnya, dan lihat apa yang dilakukan penggandaan rusuk pada luas dan volume.',
    },
  },
  cbcut: {
    title: { en: 'Interactive: slice a cube with a plane', id: 'Interaktif: mengiris kubus dengan bidang' },
    description: {
      en: 'Move a plane through a cube and watch the shape of the cut change from a triangle to a regular hexagon and back, laid flat with its side lengths and area.',
      id: 'Gerakkan sebuah bidang melewati kubus dan lihat bentuk irisannya berubah dari segitiga ke segienam beraturan dan kembali, dibentangkan dengan panjang sisi dan luasnya.',
    },
  },
}
