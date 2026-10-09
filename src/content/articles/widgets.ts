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
    title: { en: 'Interactive: rationalise the denominator', id: 'Interaktif: rasionalkan penyebutnya' },
    description: {
      en: 'Rationalise a fraction such as 6/√3 or 1/(1+√2), step by step, with the conjugate and the difference of squares shown.',
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
      en: 'Type an expression and see each term split into its coefficient, variable part and degree, with like terms shown in the same colour.',
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
    title: { en: 'Interactive: prime factorisation', id: 'Interaktif: faktorisasi prima' },
    description: {
      en: 'Type a whole number up to a trillion and see whether it is prime, its prime factorisation step by step, and how many divisors it has.',
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
  rods: {
    title: { en: 'Interactive: counting rods', id: 'Interaktif: batang hitung' },
    description: {
      en: 'Type a number and see it laid out in counting rods, with the direction of the rods alternating between places and zero left as a gap, next to its Suzhou numerals.',
      id: 'Ketik sebuah bilangan dan lihat ia disusun dengan batang hitung, arah batang bergantian antartempat dan nol dibiarkan kosong, di samping angka Suzhou-nya.',
    },
  },
}
