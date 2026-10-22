import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './binary-search-and-sorting.meta'

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
    T`**Binary search finds a value in a sorted list by looking at the middle element and throwing away the half that cannot contain it, so $n$ items need at most $\lfloor\log_2n\rfloor+1$ looks; sorting puts a list in order, and the good general-purpose algorithms (merge sort, quicksort, heapsort) use about $n\log_2n$ comparisons, against about $\frac{n^2}{2}$ for selection, insertion and bubble sort.** A thousand sorted numbers take at most $10$ looks to search. Sorting a thousand numbers takes roughly $10\,000$ comparisons with a good algorithm and $500\,000$ with a simple one.`,
    T`**Pencarian biner menemukan sebuah nilai dalam daftar terurut dengan melihat elemen tengah dan membuang separuh yang tidak mungkin memuatnya, sehingga $n$ elemen memerlukan paling banyak $\lfloor\log_2n\rfloor+1$ kali melihat; pengurutan menyusun daftar menurut urutan, dan algoritma serbaguna yang baik (merge sort, quicksort, heapsort) memakai sekitar $n\log_2n$ perbandingan, dibandingkan sekitar $\frac{n^2}{2}$ untuk selection, insertion, dan bubble sort.** Seribu bilangan terurut memerlukan paling banyak $10$ kali melihat untuk dicari. Mengurutkan seribu bilangan memerlukan kira-kira $10\,000$ perbandingan dengan algoritma yang baik dan $500\,000$ dengan yang sederhana.`,
  ),

  keyPoints: [
    L(
      T`Binary search needs a sorted list. Each look at the middle discards half of what is left, so $1000$ items need at most $10$ looks, $10^9$ items $30$, and all eight billion people on Earth $33$.`,
      T`Pencarian biner memerlukan daftar terurut. Setiap melihat bagian tengah membuang separuh sisanya, sehingga $1000$ elemen memerlukan paling banyak $10$ kali melihat, $10^9$ elemen $30$, dan seluruh delapan miliar penduduk Bumi $33$.`,
    ),
    L(
      T`With duplicates, ask for a position, not just a match: the lower bound is the first index with $a[i]\ge x$ and the upper bound the first with $a[i]>x$. Their difference counts the copies of $x$. Python calls them ´bisect_left´ and ´bisect_right´; C++ ´lower_bound´ and ´upper_bound´.`,
      T`Dengan nilai kembar, tanyakan sebuah posisi, bukan sekadar kecocokan: batas bawah adalah indeks pertama dengan $a[i]\ge x$ dan batas atas yang pertama dengan $a[i]>x$. Selisihnya menghitung salinan $x$. Python menamainya ´bisect_left´ dan ´bisect_right´; C++ ´lower_bound´ dan ´upper_bound´.`,
    ),
    L(
      T`Binary search also works on an answer: any yes-or-no question that is false up to a threshold and true after it. The integer square root of a number below $10^{12}$ takes $40$ tests, and bisection traps a root of $f(x)=0$ one binary digit per step.`,
      T`Pencarian biner juga bekerja pada sebuah jawaban: pertanyaan ya atau tidak apa pun yang salah sampai suatu ambang dan benar sesudahnya. Akar kuadrat bulat bilangan di bawah $10^{12}$ memerlukan $40$ pengujian, dan bisection menjebak akar $f(x)=0$ satu angka biner per langkah.`,
    ),
    L(
      T`Selection, insertion and bubble sort take about $n^2$ steps. Insertion and bubble sort make exactly as many moves as the list has inversions (pairs in the wrong order): $0$ when sorted, $\frac{n(n-1)}{2}$ when reversed, about $\frac{n(n-1)}{4}$ on average.`,
      T`Selection, insertion, dan bubble sort memerlukan sekitar $n^2$ langkah. Insertion dan bubble sort membuat perpindahan sebanyak inversi dalam daftar (pasangan yang salah urutan): $0$ bila terurut, $\frac{n(n-1)}{2}$ bila terbalik, rata-rata sekitar $\frac{n(n-1)}{4}$.`,
    ),
    L(
      T`Merge sort uses at most $n\lceil\log_2n\rceil$ comparisons and $n$ extra cells, and is stable. Quicksort averages $2(n+1)H_n-4n\approx1.39\,n\log_2n$ comparisons but needs $\frac{n(n-1)}{2}$ when its pivots are always extreme. No comparison sort can beat $\log_2(n!)\approx n\log_2n-1.44n$.`,
      T`Merge sort memakai paling banyak $n\lceil\log_2n\rceil$ perbandingan dan $n$ sel tambahan, dan stabil. Quicksort rata-rata $2(n+1)H_n-4n\approx1{,}39\,n\log_2n$ perbandingan tetapi memerlukan $\frac{n(n-1)}{2}$ bila pivotnya selalu ekstrem. Tidak ada pengurutan perbandingan yang mengalahkan $\log_2(n!)\approx n\log_2n-1{,}44n$.`,
    ),
    L(
      T`Real libraries use hybrids (Timsort in Python and for Java objects, introsort in C++). Ask for a stable sort when you sort by several keys in turn, and remember that JavaScript's ´[10, 9, 1].sort()´ compares text and gives ´[1, 10, 9]´.`,
      T`Pustaka sungguhan memakai hibrida (Timsort di Python dan untuk objek Java, introsort di C++). Minta pengurutan stabil ketika mengurutkan menurut beberapa kunci berturut-turut, dan ingat bahwa ´[10, 9, 1].sort()´ di JavaScript membandingkan teks dan menghasilkan ´[1, 10, 9]´.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------------------------ binary search */
    {
      id: 'binary-search',
      heading: L('How does binary search find a value?', 'Bagaimana pencarian biner menemukan sebuah nilai?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Binary search looks at the middle element of a sorted list: if it is the target the search is over; if the target is larger, everything to the left is out; if smaller, everything to the right is out. Repeat on the half that is left.** It is the game "I am thinking of a number from 1 to 1000" played well: guess $500$, hear "higher", guess $750$, and so on. Nobody needs more than $10$ guesses.

**The algorithm.** Keep two indices, ´lo´ and ´hi´, with the promise (the *invariant*) that *if the target is in the list, its index is between ´lo´ and ´hi´, ends included*. Start with ´lo = 0´ and ´hi = n - 1´. While ´lo <= hi´: look at ´mid´, the middle index; if ´a[mid]´ equals the target, return ´mid´; if it is smaller, set ´lo = mid + 1´; otherwise set ´hi = mid - 1´. If the interval becomes empty, the target is not there.

**Why it is correct.** The invariant is true at the start. A look at ´mid´ rules out ´mid´ itself and one whole side: if $a[mid]<x$, the list is sorted, so every element at or before ´mid´ is smaller than $x$ and the target, if present, lies to the right. So the invariant still holds after each step. *The list must be sorted, and it must allow jumping to the middle in one step* (an array, not a linked list); otherwise the argument and the speed are both lost.

**Why it is fast.** An interval of width $w$ becomes one of width at most $\lfloor w/2\rfloor$. Starting with $n$, after $k$ looks the width is at most $\lfloor n/2^k\rfloor$, which is $0$ as soon as $2^k>n$. So the number of looks is at most
$$\lfloor\log_2n\rfloor+1.$$
That is $10$ for $1000$ items, $20$ for a million, $30$ for a billion and $33$ for eight billion: each doubling of the list costs one more look. A linear scan of the same list could need $n$ looks ([Big-O notation](article:big-o-notation#cases) explains the cases).

Type a list and a target below and step through the search. The orange cell is the one being looked at, the faint cells are already ruled out, and the green cell is the answer.`,
            T`**Pencarian biner melihat elemen tengah daftar terurut: jika itu target, pencarian selesai; jika target lebih besar, semua di kiri gugur; jika lebih kecil, semua di kanan gugur. Ulangi pada separuh yang tersisa.** Ia adalah permainan "aku memikirkan bilangan dari 1 sampai 1000" yang dimainkan dengan baik: tebak $500$, dengar "lebih besar", tebak $750$, dan seterusnya. Tak seorang pun memerlukan lebih dari $10$ tebakan.

**Algoritmanya.** Simpan dua indeks, ´lo´ dan ´hi´, dengan janji (*invarian*) bahwa *jika target ada dalam daftar, indeksnya berada di antara ´lo´ dan ´hi´, ujung-ujungnya termasuk*. Mulai dengan ´lo = 0´ dan ´hi = n - 1´. Selama ´lo <= hi´: lihat ´mid´, indeks tengah; jika ´a[mid]´ sama dengan target, kembalikan ´mid´; jika lebih kecil, setel ´lo = mid + 1´; jika tidak, setel ´hi = mid - 1´. Jika selangnya menjadi kosong, target tidak ada.

**Mengapa benar.** Invarian benar di awal. Melihat ´mid´ menggugurkan ´mid´ sendiri dan satu sisi utuh: jika $a[mid]<x$, daftarnya terurut, sehingga setiap elemen di ´mid´ atau sebelumnya lebih kecil daripada $x$ dan target, bila ada, berada di kanan. Jadi invarian tetap berlaku setelah setiap langkah. *Daftarnya harus terurut, dan harus memungkinkan lompatan ke tengah dalam satu langkah* (larik, bukan linked list); jika tidak, argumen dan kecepatannya hilang.

**Mengapa cepat.** Selang selebar $w$ menjadi selang selebar paling banyak $\lfloor w/2\rfloor$. Dimulai dari $n$, setelah $k$ kali melihat lebarnya paling banyak $\lfloor n/2^k\rfloor$, yaitu $0$ begitu $2^k>n$. Jadi banyaknya melihat paling banyak
$$\lfloor\log_2n\rfloor+1.$$
Itu $10$ untuk $1000$ elemen, $20$ untuk sejuta, $30$ untuk semiliar, dan $33$ untuk delapan miliar: setiap penggandaan daftar hanya menambah satu kali melihat. Pemindaian linear atas daftar yang sama dapat memerlukan $n$ kali ([Notasi Big-O](article:big-o-notation#cases) menjelaskan kasus-kasusnya).

Ketik daftar dan target di bawah lalu telusuri pencariannya. Sel oranye adalah yang sedang dilihat, sel pudar sudah gugur, dan sel hijau adalah jawabannya.`,
          ),
        },
        { kind: 'widget', name: 'bsearch' },
      ],
    },

    /* ----------------------------------------------------------------------------------- bounds */
    {
      id: 'bounds',
      heading: L('How do you find the first match and avoid off-by-one errors?', 'Bagaimana menemukan kecocokan pertama dan menghindari galat selisih satu?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Use one template for every question about position: keep a half-open interval of indices ´lo <= i < hi´ in which everything before ´lo´ is known to be too small and everything from ´hi´ on is known to be large enough.** With duplicates, "find $x$" has no single answer, but "the first index with $a[i]\ge x$" always does. In the list $[1,3,3,5,7,7,7,9,12]$:

| Question | Name | $x=7$ | $x=4$ | $x=100$ |
|---|---|---|---|---|
| first index with $a[i]\ge x$ | lower bound (´bisect_left´) | $4$ | $3$ | $9$ |
| first index with $a[i]>x$ | upper bound (´bisect_right´) | $7$ | $3$ | $9$ |

The upper bound minus the lower bound is the number of copies of $x$: $7-4=3$. When $x$ is absent the lower bound is the *insertion point*, the index where $x$ would go to keep the list sorted, and it may be $n$ (past the end).

**The template.** Start with ´lo = 0´, ´hi = n´ (one past the last index). While ´lo < hi´: take ´mid = lo + (hi - lo) // 2´; if ´a[mid] < x´ then ´lo = mid + 1´ (the lower bound is to the right of ´mid´), else ´hi = mid´ (´mid´ may be the answer, so keep it). When the loop ends, ´lo == hi´ is the answer. For the upper bound, change the test to ´a[mid] <= x´. The invariant is the whole proof: everything before ´lo´ is $<x$, everything from ´hi´ on is $\ge x$, and each step shrinks ´hi - lo´ by at least one, so the loop ends.

**Where the off-by-one errors come from.** Mixing the two conventions: the closed interval ´lo <= i <= hi´ goes with ´hi = n - 1´, ´while lo <= hi´ and ´hi = mid - 1´; the half-open interval ´lo <= i < hi´ goes with ´hi = n´, ´while lo < hi´ and ´hi = mid´. Writing ´hi = mid´ in a closed interval can loop forever on two elements, and ´hi = mid - 1´ in a half-open one can skip the answer. Choose one and write the invariant as a comment. Jon Bentley found that most professional programmers he tried this on could not write a correct binary search, and Donald Knuth remarked that the first binary search was published in 1946 but a correct one for every length did not appear until 1962.

**The overflow bug.** The middle is the average of ´lo´ and ´hi´, and the obvious formula ´(lo + hi) / 2´ adds them first. In a language with 32-bit integers the sum of two valid indices can be larger than $2\,147\,483\,647$ and wrap around to a negative number (see [two's complement](article:binary-numbers#twos-complement)), as with ´lo = 1 500 000 000´ and ´hi = 2 000 000 000´. In 2006 Joshua Bloch reported that this had been in the binary search of the Java library for years. The safe form is ´lo + (hi - lo) / 2´: the difference is never larger than ´hi´.`,
            T`**Pakai satu templat untuk setiap pertanyaan tentang posisi: simpan selang indeks setengah terbuka ´lo <= i < hi´ yang di dalamnya semua yang sebelum ´lo´ diketahui terlalu kecil dan semua dari ´hi´ ke belakang diketahui cukup besar.** Dengan nilai kembar, "cari $x$" tidak punya jawaban tunggal, tetapi "indeks pertama dengan $a[i]\ge x$" selalu punya. Pada daftar $[1,3,3,5,7,7,7,9,12]$:

| Pertanyaan | Nama | $x=7$ | $x=4$ | $x=100$ |
|---|---|---|---|---|
| indeks pertama dengan $a[i]\ge x$ | batas bawah (´bisect_left´) | $4$ | $3$ | $9$ |
| indeks pertama dengan $a[i]>x$ | batas atas (´bisect_right´) | $7$ | $3$ | $9$ |

Batas atas dikurangi batas bawah adalah banyaknya salinan $x$: $7-4=3$. Bila $x$ tidak ada, batas bawah adalah *titik sisip*, indeks tempat $x$ akan ditaruh agar daftar tetap terurut, dan ia bisa bernilai $n$ (melewati ujung).

**Templatnya.** Mulai dengan ´lo = 0´, ´hi = n´ (satu setelah indeks terakhir). Selama ´lo < hi´: ambil ´mid = lo + (hi - lo) // 2´; jika ´a[mid] < x´ maka ´lo = mid + 1´ (batas bawah ada di kanan ´mid´), jika tidak ´hi = mid´ (´mid´ mungkin jawabannya, jadi simpan). Ketika perulangan berakhir, ´lo == hi´ adalah jawabannya. Untuk batas atas, ubah ujinya menjadi ´a[mid] <= x´. Invarian adalah seluruh buktinya: semua sebelum ´lo´ bernilai $<x$, semua dari ´hi´ bernilai $\ge x$, dan setiap langkah memperkecil ´hi - lo´ sedikitnya satu, sehingga perulangan berakhir.

**Dari mana galat selisih satu berasal.** Dari mencampur dua konvensi: selang tertutup ´lo <= i <= hi´ berpasangan dengan ´hi = n - 1´, ´while lo <= hi´, dan ´hi = mid - 1´; selang setengah terbuka ´lo <= i < hi´ berpasangan dengan ´hi = n´, ´while lo < hi´, dan ´hi = mid´. Menulis ´hi = mid´ pada selang tertutup dapat berputar tanpa henti pada dua elemen, dan ´hi = mid - 1´ pada yang setengah terbuka dapat melewatkan jawabannya. Pilih satu dan tulis invariannya sebagai komentar. Jon Bentley mendapati bahwa kebanyakan pemrogram profesional yang ia uji tidak dapat menulis pencarian biner yang benar, dan Donald Knuth mengamati bahwa pencarian biner pertama diterbitkan pada 1946 tetapi yang benar untuk setiap panjang baru muncul pada 1962.

**Galat luapan.** Titik tengah adalah rata-rata ´lo´ dan ´hi´, dan rumus yang paling mudah, ´(lo + hi) / 2´, menjumlahkan keduanya lebih dulu. Dalam bahasa dengan bilangan bulat 32-bit, jumlah dua indeks yang sah dapat lebih besar daripada $2\,147\,483\,647$ dan berputar menjadi bilangan negatif (lihat [komplemen dua](article:binary-numbers#twos-complement)), seperti pada ´lo = 1 500 000 000´ dan ´hi = 2 000 000 000´. Pada 2006 Joshua Bloch melaporkan bahwa ini sudah bertahun-tahun ada dalam pencarian biner pustaka Java. Bentuk yang aman adalah ´lo + (hi - lo) / 2´: selisihnya tidak pernah lebih besar daripada ´hi´.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------------------- search the answer */
    {
      id: 'search-the-answer',
      heading: L('How can you binary search for an answer instead of a value?', 'Bagaimana mencari jawaban, bukan nilai, dengan pencarian biner?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Binary search needs no list at all, only a yes-or-no question that is false for small numbers and true for large ones: the answer is the place where it switches.** The question can be asked about any number, the list never has to exist, and the same loop finds the switch in about $\log_2$ of the number of candidates.

- **An integer square root.** The largest $r$ with $r^2\le N$: the test "$m^2\le N$" is true for $m$ up to $\lfloor\sqrt N\rfloor$ and false after. For $N=123\,456\,789$ the search between $0$ and $N$ needs $27$ tests to find $11\,111$ (since $11\,111^2=123\,454\,321$ and $11\,112^2=123\,476\,544$); counting up from zero would need $11\,111$. Any $N$ up to $10^{12}$ takes at most $40$ tests.
- **Finding a bad commit.** ´git bisect´ asks you whether a version is good or bad; the history goes from good to bad once, so among $1000$ commits it finds the first bad one in $10$ tests.
- **Capacity questions.** "What is the smallest truck size that delivers everything in $D$ days?" Bigger always works if smaller does, so binary search on the size, and only write the checking loop.
- **A root of a function.** If $f$ is continuous and $f(a)$ and $f(b)$ have opposite signs, there is a root between them. Look at the midpoint, and keep the half whose ends still have opposite signs. This is *bisection*: every step halves the bracket and adds $\log_{10}2\approx0.30$ of a decimal digit, so $50$ halvings of $[1,2]$ pin $\sqrt2$ down to $2^{-50}\approx8.9\times10^{-16}$, about fifteen digits.

**Bisection against Newton's method.** [Newton's method](article:newtons-method#convergence) doubles the number of correct digits at each step, which is far faster, but it needs a derivative and a good starting point and can leave the interval or cycle (see [when it fails](article:newtons-method#failures)). Bisection gains only one binary digit per step but cannot fail once the sign changes. Many solvers use both: bisection to be safe, Newton's method to be quick.

**Floating-point caution.** With real numbers do not loop "until ´hi - lo < 1e-18´": near $1$ the doubles are $2.2\times10^{-16}$ apart (see [the spacing of floats](article:floating-point-numbers#spacing)), so ´hi - lo´ never gets below that and the loop never ends. Loop a fixed number of times ($60$ is enough for any bracket of doubles) or stop when ´mid´ equals ´lo´ or ´hi´.

Try both kinds below: a formula and an interval, or an integer.`,
            T`**Pencarian biner sama sekali tidak memerlukan daftar, hanya pertanyaan ya atau tidak yang salah untuk bilangan kecil dan benar untuk bilangan besar: jawabannya adalah tempat ia berganti.** Pertanyaan itu dapat diajukan tentang bilangan apa pun, daftarnya tidak perlu ada, dan perulangan yang sama menemukan pergantiannya dalam sekitar $\log_2$ banyaknya calon.

- **Akar kuadrat bulat.** $r$ terbesar dengan $r^2\le N$: ujinya "$m^2\le N$" benar untuk $m$ sampai $\lfloor\sqrt N\rfloor$ dan salah sesudahnya. Untuk $N=123\,456\,789$ pencarian antara $0$ dan $N$ memerlukan $27$ pengujian untuk menemukan $11\,111$ (karena $11\,111^2=123\,454\,321$ dan $11\,112^2=123\,476\,544$); menghitung naik dari nol memerlukan $11\,111$. $N$ mana pun sampai $10^{12}$ memerlukan paling banyak $40$ pengujian.
- **Mencari komit yang rusak.** ´git bisect´ menanyakan apakah suatu versi baik atau rusak; riwayatnya beralih dari baik ke rusak sekali saja, sehingga di antara $1000$ komit ia menemukan yang pertama rusak dalam $10$ pengujian.
- **Pertanyaan kapasitas.** "Berapa ukuran truk terkecil yang mengantar semuanya dalam $D$ hari?" Yang lebih besar selalu berhasil bila yang lebih kecil berhasil, jadi lakukan pencarian biner pada ukurannya, dan cukup tulis perulangan pengeceknya.
- **Akar sebuah fungsi.** Jika $f$ kontinu dan $f(a)$ serta $f(b)$ berlawanan tanda, ada akar di antaranya. Lihat titik tengah, dan simpan separuh yang ujung-ujungnya masih berlawanan tanda. Inilah *bisection*: setiap langkah membagi dua kurungan dan menambah $\log_{10}2\approx0{,}30$ angka desimal, sehingga $50$ pembagian dua pada $[1,2]$ menjepit $\sqrt2$ sampai $2^{-50}\approx8{,}9\times10^{-16}$, sekitar lima belas angka.

**Bisection melawan metode Newton.** [Metode Newton](article:newtons-method#convergence) menggandakan banyaknya angka benar pada setiap langkah, jauh lebih cepat, tetapi ia memerlukan turunan dan titik awal yang baik dan dapat keluar dari selang atau berputar (lihat [kapan ia gagal](article:newtons-method#failures)). Bisection hanya memperoleh satu angka biner per langkah tetapi tidak dapat gagal begitu tandanya berganti. Banyak penyelesai memakai keduanya: bisection agar aman, metode Newton agar cepat.

**Kehati-hatian pada bilangan titik mengambang.** Dengan bilangan real jangan berulang "sampai ´hi - lo < 1e-18´": di sekitar $1$ jarak antardouble adalah $2{,}2\times10^{-16}$ (lihat [jarak antarbilangan titik mengambang](article:floating-point-numbers#spacing)), sehingga ´hi - lo´ tidak pernah lebih kecil daripada itu dan perulangan tidak pernah berakhir. Ulangi sebanyak tetap ($60$ cukup untuk kurungan double mana pun) atau berhenti ketika ´mid´ sama dengan ´lo´ atau ´hi´.

Cobalah keduanya di bawah: sebuah rumus dan selang, atau sebuah bilangan bulat.`,
          ),
        },
        { kind: 'widget', name: 'bisectanswer' },
      ],
    },

    /* ----------------------------------------------------------------------------- simple sorts */
    {
      id: 'simple-sorts',
      heading: L('How do selection, insertion and bubble sort work?', 'Bagaimana selection, insertion, dan bubble sort bekerja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Selection, insertion and bubble sort are the three simple sorts: each needs about $\frac{n^2}{2}$ steps, they are short to write, and they are the right choice only for short or nearly sorted lists.**

- **Selection sort.** Find the smallest of the unsorted part and swap it to the front; repeat. It makes exactly $\frac{n(n-1)}{2}$ comparisons whatever the input, but at most $n-1$ swaps: the one to use if moving an element is very expensive.
- **Insertion sort.** Take the next number and slide it left past every larger neighbor, as you do with cards in your hand. On a sorted list each number is compared once ($n-1$ comparisons in all); on a reversed list every number slides all the way.
- **Bubble sort.** Walk along the list swapping neighbors that are out of order; the largest number is carried to the end on the first pass, the next largest on the second, and so on. With a flag that stops after a pass with no swap, a sorted list costs one pass.

**Inversions explain the cost.** An *inversion* is a pair of positions $i<j$ with $a[i]>a[j]$. The list $[5,2,4,6,1,3]$ has $9$: $(5,2)$, $(5,4)$, $(5,1)$, $(5,3)$, $(2,1)$, $(4,1)$, $(4,3)$, $(6,1)$ and $(6,3)$. A sorted list has $0$ and a reversed one has $\frac{n(n-1)}{2}$, every pair; a random list has about half of that, $\frac{n(n-1)}{4}$. Swapping two *neighbors* that are out of order removes exactly one inversion, and so does one shift of insertion sort. So **bubble sort makes exactly as many swaps, and insertion sort exactly as many shifts, as the list has inversions**, and any method that only moves neighbors needs about $\frac{n^2}{4}$ steps on a random list. To go faster, a sort must move elements across long distances: that is what merge sort and quicksort do.

Choose an algorithm and an input below and play the bars. Gold bars are being compared, red ones are moving, and green ones are in their final place.`,
            T`**Selection, insertion, dan bubble sort adalah tiga pengurutan sederhana: masing-masing memerlukan sekitar $\frac{n^2}{2}$ langkah, ketiganya pendek untuk ditulis, dan merupakan pilihan yang tepat hanya untuk daftar pendek atau hampir terurut.**

- **Selection sort.** Cari yang terkecil dari bagian yang belum terurut lalu tukar ke depan; ulangi. Ia membuat tepat $\frac{n(n-1)}{2}$ perbandingan apa pun masukannya, tetapi paling banyak $n-1$ pertukaran: yang dipakai bila memindahkan satu elemen sangat mahal.
- **Insertion sort.** Ambil bilangan berikutnya dan geser ke kiri melewati setiap tetangga yang lebih besar, seperti yang kamu lakukan dengan kartu di tangan. Pada daftar terurut tiap bilangan dibandingkan sekali ($n-1$ perbandingan seluruhnya); pada daftar terbalik setiap bilangan bergeser sampai ujung.
- **Bubble sort.** Berjalan menyusuri daftar sambil menukar tetangga yang salah urutan; bilangan terbesar terbawa ke ujung pada putaran pertama, yang terbesar berikutnya pada putaran kedua, dan seterusnya. Dengan penanda yang berhenti setelah putaran tanpa pertukaran, daftar terurut hanya memerlukan satu putaran.

**Inversi menjelaskan biayanya.** *Inversi* adalah pasangan posisi $i<j$ dengan $a[i]>a[j]$. Daftar $[5,2,4,6,1,3]$ memiliki $9$: $(5,2)$, $(5,4)$, $(5,1)$, $(5,3)$, $(2,1)$, $(4,1)$, $(4,3)$, $(6,1)$, dan $(6,3)$. Daftar terurut memiliki $0$ dan daftar terbalik memiliki $\frac{n(n-1)}{2}$, semua pasangan; daftar acak memiliki sekitar setengahnya, $\frac{n(n-1)}{4}$. Menukar dua *tetangga* yang salah urutan menghilangkan tepat satu inversi, demikian pula satu geseran insertion sort. Jadi **bubble sort membuat pertukaran sebanyak inversi, dan insertion sort geseran sebanyak inversi, tepat**, dan metode apa pun yang hanya memindahkan tetangga memerlukan sekitar $\frac{n^2}{4}$ langkah pada daftar acak. Agar lebih cepat, pengurutan harus memindahkan elemen melintasi jarak jauh: itulah yang dilakukan merge sort dan quicksort.

Pilih algoritma dan masukan di bawah lalu putar batangnya. Batang emas sedang dibandingkan, yang merah sedang pindah, dan yang hijau sudah di tempat akhirnya.`,
          ),
        },
        { kind: 'widget', name: 'sortviz' },
      ],
    },

    /* ------------------------------------------------------------------------------ merge sort */
    {
      id: 'merge-sort',
      heading: L('How does merge sort sort in n log n steps?', 'Bagaimana merge sort mengurutkan dalam n log n langkah?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Merge sort splits the list in half, sorts each half the same way, and then merges the two sorted halves into one.** Merging is the easy part: two sorted lists have their smallest elements at the front, so compare the two fronts, move the smaller to the output, and repeat. Merging lists of total length $n$ takes at most $n-1$ comparisons and exactly $n$ writes.

The recursion halves the list until single elements (already sorted) remain, so there are $\lceil\log_2n\rceil$ levels, and each level merges all $n$ elements once. That is $n$ writes per level and a total of about $n\log_2n$. The recurrence is $T(n)=2T(n/2)+n$, solved in [the section on recurrences](article:big-o-notation#recurrences). In exact numbers:

- **writes:** $8$ numbers need $24=8\cdot3$, and $1000$ need $9976$;
- **comparisons, worst case:** $n\lceil\log_2n\rceil-2^{\lceil\log_2n\rceil}+1$, which is $17$ for $8$ numbers and $8977$ for $1000$;
- **comparisons, already sorted:** about half as many, since one list runs out first: $12$ for $8$ numbers.

**Properties.** Merge sort needs $O(n)$ extra memory for the merged output, it is *stable* (if two elements are equal, take the one from the left half first, which is the ´<=´ in the code below), and its cost barely depends on the input. It is the natural choice for linked lists and for data on disk or tape, which are read in order; it was the first computer sort, programmed by John von Neumann in 1945.`,
            T`**Merge sort membagi daftar menjadi dua, mengurutkan setiap separuh dengan cara yang sama, lalu menggabungkan kedua separuh terurut itu menjadi satu.** Penggabungan adalah bagian yang mudah: dua daftar terurut memiliki elemen terkecilnya di depan, jadi bandingkan kedua depan itu, pindahkan yang lebih kecil ke keluaran, dan ulangi. Menggabungkan daftar dengan panjang total $n$ memerlukan paling banyak $n-1$ perbandingan dan tepat $n$ penulisan.

Rekursinya membagi dua daftar sampai tersisa elemen tunggal (yang sudah terurut), sehingga ada $\lceil\log_2n\rceil$ tingkat, dan setiap tingkat menggabungkan semua $n$ elemen sekali. Itu $n$ penulisan per tingkat dan totalnya sekitar $n\log_2n$. Rekurensinya $T(n)=2T(n/2)+n$, diselesaikan pada [bagian tentang rekurensi](article:big-o-notation#recurrences). Dalam angka eksak:

- **penulisan:** $8$ bilangan memerlukan $24=8\cdot3$, dan $1000$ memerlukan $9976$;
- **perbandingan, kasus terburuk:** $n\lceil\log_2n\rceil-2^{\lceil\log_2n\rceil}+1$, yaitu $17$ untuk $8$ bilangan dan $8977$ untuk $1000$;
- **perbandingan, sudah terurut:** sekitar setengahnya, karena satu daftar habis lebih dulu: $12$ untuk $8$ bilangan.

**Sifat-sifatnya.** Merge sort memerlukan memori tambahan $O(n)$ untuk keluaran gabungan, ia *stabil* (jika dua elemen sama, ambil yang dari separuh kiri lebih dulu, yaitu ´<=´ dalam kode di bawah), dan biayanya hampir tidak bergantung pada masukan. Ia pilihan yang wajar untuk linked list dan untuk data di cakram atau pita, yang dibaca berurutan; ia pengurutan komputer pertama, diprogram oleh John von Neumann pada 1945.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------------------------- quicksort */
    {
      id: 'quicksort',
      heading: L('How does quicksort work, and when is it slow?', 'Bagaimana quicksort bekerja, dan kapan ia lambat?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Quicksort picks a pivot, moves the smaller elements before it and the others after it, and then sorts the two sides the same way.** After the partition the pivot is already in its final place. The partition of Nico Lomuto, used in the code below, takes the last element as the pivot and sweeps from left to right keeping a boundary ´p´: every element smaller than the pivot is swapped to the boundary, which moves one step right. Tony Hoare's original partition uses two pointers moving toward each other and does fewer swaps.

**What it costs.** A partition of $m$ elements makes $m-1$ comparisons. If the pivot splits the range roughly in half every time there are about $\log_2n$ levels of about $n$ comparisons each. If the pivot is always the smallest or the largest element, the two sides have sizes $0$ and $m-1$ and the total is
$$(n-1)+(n-2)+\cdots+1=\frac{n(n-1)}{2},$$
quadratic. With the last element as the pivot this happens on an *already sorted* or reversed list, which is exactly the input people give. On a random list the average is
$$2(n+1)H_n-4n\approx2n\ln n\approx1.39\,n\log_2n,$$
where $H_n=1+\frac12+\cdots+\frac1n$. For $1000$ elements that is about $10\,986$ comparisons (against at most $8977$ for merge sort), and the chance of a very bad run is tiny.

**What real implementations do.**
- **Choose the pivot well:** a random element, or the median of the first, middle and last.
- **Handle equal keys:** a three-way partition (smaller, equal, larger) keeps a list of few distinct values from slowing down.
- **Bound the damage:** *introsort* (David Musser, 1997) switches to heapsort if the recursion gets too deep, so the worst case is $O(n\log n)$; it is behind C++'s ´std::sort´. Recursing into the smaller side first keeps the stack at $O(\log n)$.
- **Quicksort is not stable**, and it sorts in place, with no extra array. Cache-friendly sweeps make it faster than merge sort on arrays in practice, in spite of the extra comparisons.

The sorting race below runs all six algorithms on the same input and counts comparisons and moves.`,
            T`**Quicksort memilih sebuah pivot, memindahkan elemen yang lebih kecil ke depannya dan yang lain ke belakangnya, lalu mengurutkan kedua sisi dengan cara yang sama.** Setelah partisi, pivot sudah berada di tempat akhirnya. Partisi Nico Lomuto, yang dipakai dalam kode di bawah, mengambil elemen terakhir sebagai pivot dan menyapu dari kiri ke kanan sambil menjaga batas ´p´: setiap elemen yang lebih kecil daripada pivot ditukar ke batas, yang lalu maju satu langkah. Partisi asli Tony Hoare memakai dua penunjuk yang bergerak saling mendekat dan melakukan lebih sedikit pertukaran.

**Biayanya.** Partisi $m$ elemen membuat $m-1$ perbandingan. Jika pivot membagi rentang kira-kira dua sama besar setiap kali, ada sekitar $\log_2n$ tingkat dengan sekitar $n$ perbandingan masing-masing. Jika pivot selalu elemen terkecil atau terbesar, kedua sisi berukuran $0$ dan $m-1$ dan totalnya
$$(n-1)+(n-2)+\cdots+1=\frac{n(n-1)}{2},$$
kuadratik. Dengan elemen terakhir sebagai pivot, hal ini terjadi pada daftar yang *sudah terurut* atau terbalik, persis masukan yang sering diberikan orang. Pada daftar acak rata-ratanya
$$2(n+1)H_n-4n\approx2n\ln n\approx1{,}39\,n\log_2n,$$
dengan $H_n=1+\frac12+\cdots+\frac1n$. Untuk $1000$ elemen itu sekitar $10\,986$ perbandingan (dibandingkan paling banyak $8977$ untuk merge sort), dan peluang jalannya sangat buruk amat kecil.

**Yang dilakukan implementasi sungguhan.**
- **Memilih pivot dengan baik:** elemen acak, atau median dari yang pertama, tengah, dan terakhir.
- **Menangani kunci yang sama:** partisi tiga arah (lebih kecil, sama, lebih besar) menjaga daftar dengan sedikit nilai berbeda tidak melambat.
- **Membatasi kerusakan:** *introsort* (David Musser, 1997) beralih ke heapsort jika rekursi terlalu dalam, sehingga kasus terburuknya $O(n\log n)$; ia ada di balik ´std::sort´ C++. Merekursi sisi yang lebih kecil lebih dulu menjaga tumpukan tetap $O(\log n)$.
- **Quicksort tidak stabil**, dan ia mengurutkan di tempat, tanpa larik tambahan. Sapuan yang ramah cache membuatnya lebih cepat daripada merge sort pada larik dalam praktik, meskipun perbandingannya lebih banyak.

Balapan pengurutan di bawah menjalankan keenam algoritma pada masukan yang sama dan menghitung perbandingan serta perpindahan.`,
          ),
        },
        { kind: 'widget', name: 'sortrace' },
      ],
    },

    /* ----------------------------------------------------------------------------------- choosing */
    {
      id: 'choosing',
      heading: L('Which sorting algorithm should you use?', 'Algoritma pengurutan mana yang sebaiknya dipakai?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In practice, call the sort of your language: it is a tuned hybrid, and it is almost always faster and more correct than anything you will write.** Know what it promises, though.

| Algorithm | Best | Average | Worst | Extra memory | Stable |
|---|---|---|---|---|---|
| selection | $n^2$ | $n^2$ | $n^2$ | $O(1)$ | no |
| insertion | $n$ | $n^2$ | $n^2$ | $O(1)$ | yes |
| bubble | $n$ | $n^2$ | $n^2$ | $O(1)$ | yes |
| merge | $n\log n$ | $n\log n$ | $n\log n$ | $O(n)$ | yes |
| quick | $n\log n$ | $n\log n$ | $n^2$ | $O(\log n)$ | no |
| heap | $n\log n$ | $n\log n$ | $n\log n$ | $O(1)$ | no |

Three properties decide the choice. **Stable**: equal keys keep their original order, which lets you sort by several keys in turn (sort by name, then stably by city, and each city is still in name order). **In place**: only $O(1)$ or $O(\log n)$ extra memory. **Adaptive**: faster on nearly sorted input, like insertion sort. *Heapsort* builds a max-heap in the array, then repeatedly swaps the largest to the end and repairs the heap: in place and $O(n\log n)$ in the worst case, but not stable and not cache friendly.

**A limit and a way around it.** Any sort that only *compares* elements needs at least $\log_2(n!)\approx n\log_2n-1.44n$ comparisons, because the $n!$ possible orders must be told apart by yes-or-no answers (the idea of the lower bound in [the section on cases](article:big-o-notation#cases)). For $1000$ elements that is $8530$ comparisons, and merge sort's worst case, $8977$, is within about 5 percent of it. Sorts that do not compare can be faster: *counting sort* counts how many times each value occurs ($O(n+k)$ for values below $k$), and *radix sort* sorts digit by digit with a stable sort, which is how punched-card sorters worked.

**What the libraries do.**
- **Python:** ´sorted(a)´ returns a new list and ´a.sort()´ sorts in place and returns ´None´. Both use *Timsort* (Tim Peters, 2002): it finds runs that are already ordered, extends short runs with insertion sort and merges runs, so it is stable, $O(n\log n)$ and $O(n)$ on sorted input.
- **JavaScript:** ´array.sort()´ is stable since 2019, but *without a comparator it compares the elements as text*, so ´[10, 9, 1].sort()´ gives ´[1, 10, 9]´. Always write ´(a, b) => a - b´ for numbers.
- **Java:** Timsort for objects, a dual-pivot quicksort for arrays of numbers. **C++:** ´std::sort´ (introsort, not stable) and ´std::stable_sort´.`,
            T`**Dalam praktik, panggil fungsi pengurutan bahasamu: ia hibrida yang sudah disetel, dan hampir selalu lebih cepat dan lebih benar daripada apa pun yang akan kamu tulis.** Tetapi ketahui apa yang dijanjikannya.

| Algoritma | Terbaik | Rata-rata | Terburuk | Memori tambahan | Stabil |
|---|---|---|---|---|---|
| selection | $n^2$ | $n^2$ | $n^2$ | $O(1)$ | tidak |
| insertion | $n$ | $n^2$ | $n^2$ | $O(1)$ | ya |
| bubble | $n$ | $n^2$ | $n^2$ | $O(1)$ | ya |
| merge | $n\log n$ | $n\log n$ | $n\log n$ | $O(n)$ | ya |
| quick | $n\log n$ | $n\log n$ | $n^2$ | $O(\log n)$ | tidak |
| heap | $n\log n$ | $n\log n$ | $n\log n$ | $O(1)$ | tidak |

Tiga sifat menentukan pilihan. **Stabil**: kunci yang sama mempertahankan urutan awalnya, yang memungkinkan mengurutkan menurut beberapa kunci berturut-turut (urutkan menurut nama, lalu secara stabil menurut kota, dan setiap kota tetap terurut menurut nama). **Di tempat**: hanya memerlukan memori tambahan $O(1)$ atau $O(\log n)$. **Adaptif**: lebih cepat pada masukan yang hampir terurut, seperti insertion sort. *Heapsort* membangun max-heap di dalam larik, lalu berulang kali menukar yang terbesar ke ujung dan memperbaiki heap: di tempat dan $O(n\log n)$ pada kasus terburuk, tetapi tidak stabil dan tidak ramah cache.

**Sebuah batas dan cara mengelilinginya.** Pengurutan apa pun yang hanya *membandingkan* elemen memerlukan sedikitnya $\log_2(n!)\approx n\log_2n-1{,}44n$ perbandingan, karena $n!$ urutan yang mungkin harus dibedakan dengan jawaban ya atau tidak (gagasan batas bawah dalam [bagian tentang kasus](article:big-o-notation#cases)). Untuk $1000$ elemen itu $8530$ perbandingan, dan kasus terburuk merge sort, $8977$, hanya sekitar 5 persen di atasnya. Pengurutan yang tidak membandingkan bisa lebih cepat: *counting sort* menghitung berapa kali tiap nilai muncul ($O(n+k)$ untuk nilai di bawah $k$), dan *radix sort* mengurutkan angka demi angka dengan pengurutan stabil, begitulah cara pengurut kartu berlubang bekerja.

**Yang dilakukan pustaka.**
- **Python:** ´sorted(a)´ mengembalikan daftar baru dan ´a.sort()´ mengurutkan di tempat dan mengembalikan ´None´. Keduanya memakai *Timsort* (Tim Peters, 2002): ia menemukan bagian yang sudah berurutan, memperpanjang bagian pendek dengan insertion sort dan menggabungkan bagian-bagiannya, sehingga stabil, $O(n\log n)$, dan $O(n)$ pada masukan terurut.
- **JavaScript:** ´array.sort()´ stabil sejak 2019, tetapi *tanpa pembanding ia membandingkan elemen sebagai teks*, sehingga ´[10, 9, 1].sort()´ menghasilkan ´[1, 10, 9]´. Selalu tulis ´(a, b) => a - b´ untuk bilangan.
- **Java:** Timsort untuk objek, quicksort dwi-pivot untuk larik bilangan. **C++:** ´std::sort´ (introsort, tidak stabil) dan ´std::stable_sort´.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- in code */
    {
      id: 'search-and-sort-in-code',
      heading: L('How do you search and sort in Python, JavaScript and C++?', 'Bagaimana mencari dan mengurutkan di Python, JavaScript, dan C++?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Write the binary search once with the half-open template and reuse it; in Python the standard library already has it as ´bisect´.** The first program below has the lower bound, the closed-interval search that counts its looks, the integer square root by searching the answer, and a comparison with ´bisect_left´ and ´bisect_right´. The second program has insertion sort (counting its shifts), merge sort, quicksort (counting its comparisons) and a stable sort by key. The two numbers $9$ and $9$ in the output are the inversions of $[5,2,4,6,1,3]$ and the shifts of insertion sort: they are equal.`,
            T`**Tulis pencarian biner sekali dengan templat setengah terbuka dan pakai ulang; di Python pustaka standar sudah memilikinya sebagai ´bisect´.** Program pertama di bawah memuat batas bawah, pencarian selang tertutup yang menghitung berapa kali melihat, akar kuadrat bulat dengan mencari jawaban, dan perbandingan dengan ´bisect_left´ dan ´bisect_right´. Program kedua memuat insertion sort (menghitung geserannya), merge sort, quicksort (menghitung perbandingannya), dan pengurutan stabil menurut kunci. Dua bilangan $9$ dan $9$ pada keluaran adalah inversi $[5,2,4,6,1,3]$ dan geseran insertion sort: keduanya sama.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: binary search in three forms', 'Python: pencarian biner dalam tiga bentuk'),
          code: `from bisect import bisect_left, bisect_right


def lower_bound(a, x):
    """The first index i with a[i] >= x, in the half-open form [lo, hi)."""
    lo, hi = 0, len(a)
    while lo < hi:
        mid = lo + (hi - lo) // 2      # never (lo + hi) // 2 with fixed-size integers
        if a[mid] < x:
            lo = mid + 1               # everything up to mid is too small
        else:
            hi = mid                   # mid itself might be the answer
    return lo


def find(a, x):
    """An index holding x (or -1) and the number of looks, in the closed form [lo, hi]."""
    lo, hi, looks = 0, len(a) - 1, 0
    while lo <= hi:
        looks += 1
        mid = lo + (hi - lo) // 2
        if a[mid] == x:
            return mid, looks
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, looks


def isqrt(n):
    """The largest r with r * r <= n: a binary search on the answer, no list needed."""
    lo, hi = 0, n
    while lo < hi:
        mid = lo + (hi - lo + 1) // 2  # round up, so that lo = mid always makes progress
        if mid * mid <= n:
            lo = mid
        else:
            hi = mid - 1
    return lo


a = [1, 3, 3, 5, 7, 7, 7, 9, 12]
print(lower_bound(a, 7), bisect_left(a, 7), bisect_right(a, 7))
print(bisect_right(a, 7) - bisect_left(a, 7), lower_bound(a, 4), lower_bound(a, 100))
print(find(a, 5), find(a, 8))
print(isqrt(99), isqrt(100), isqrt(10 ** 12))
big = list(range(0, 2_000_000, 2))     # a million even numbers
print(find(big, 777_776), find(big, 777_777))
# 4 4 7
# 3 3 9
# (3, 4) (-1, 3)
# 9 10 1000000
# (388888, 19) (-1, 20)`,
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: three sorts, with their counts', 'Python: tiga pengurutan, dengan hitungannya'),
          code: `def insertion(a):
    """Insertion sort; returns the sorted list and the number of shifts."""
    a, shifts = list(a), 0
    for i in range(1, len(a)):
        x, j = a[i], i - 1
        while j >= 0 and a[j] > x:
            a[j + 1] = a[j]
            shifts += 1
            j -= 1
        a[j + 1] = x
    return a, shifts


def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = (len(a) + 1) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:        # <= keeps equal keys in order: the sort is stable
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]


def quicksort(a, lo=0, hi=None):
    """In place, Lomuto partition, last element as the pivot. Returns the comparisons made."""
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return 0
    p, count = lo, 0
    for j in range(lo, hi):
        count += 1
        if a[j] < a[hi]:
            a[p], a[j] = a[j], a[p]
            p += 1
    a[p], a[hi] = a[hi], a[p]
    return count + quicksort(a, lo, p - 1) + quicksort(a, p + 1, hi)


def inversions(a):
    return sum(a[i] > a[j] for i in range(len(a)) for j in range(i + 1, len(a)))


x = [5, 2, 4, 6, 1, 3]
print(insertion(x), inversions(x))
print(merge_sort(x))
n = 200
print(quicksort(list(range(n))), n * (n - 1) // 2)            # sorted input: the worst case
data = [(i * 73) % n for i in range(n)]                        # a scrambled permutation of 0..199
print(quicksort(data), data == sorted(range(n)))
people = [("Ana", 30), ("Budi", 25), ("Citra", 30), ("Dewi", 25)]
print(sorted(people, key=lambda p: p[1]))                      # stable: Budi stays before Dewi
# ([1, 2, 3, 4, 5, 6], 9) 9
# [1, 2, 3, 4, 5, 6]
# 19900 19900
# 1409 True
# [('Budi', 25), ('Dewi', 25), ('Ana', 30), ('Citra', 30)]`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the sort trap, a lower bound and bisection', 'JavaScript: jebakan sort, batas bawah, dan bisection'),
          code: `;[10, 9, 1, 100].sort()                      // [1, 10, 100, 9]: no comparator means text order
;[10, 9, 1, 100].sort((a, b) => a - b)       // [1, 9, 10, 100]
const lowerBound = (a, x) => {
  let lo = 0, hi = a.length
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1)        // not (lo + hi) >> 1: see below
    if (a[mid] < x) lo = mid + 1
    else hi = mid
  }
  return lo
}
const a = [1, 3, 3, 5, 7, 7, 7, 9, 12]
;[7, 8, 100].map((x) => lowerBound(a, x))    // [4, 7, 9]
;(1500000000 + 2000000000) >> 1               // -397483648: the sum overflowed 32 bits
1500000000 + ((2000000000 - 1500000000) >> 1) // 1750000000

// bisection: halve a bracket on which f changes sign (60 would be enough for any bracket of doubles)
const f = (x) => x * x - 2
let lo = 1, hi = 2
for (let k = 0; k < 50; k++) {
  const mid = (lo + hi) / 2
  if (f(mid) * f(lo) <= 0) hi = mid
  else lo = mid
}
;[lo, hi, hi - lo]                           // [1.414213562373095, 1.4142135623730958, 8.88e-16]`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: insertion sort with its shifts, then a lower bound', 'C++: insertion sort dengan geserannya, lalu batas bawah'),
          code: `#include <iostream>
#include <cstdio>
using namespace std;

int lowerBound(int a[], int n, int x) {
  int lo = 0, hi = n;
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;                 // not (lo + hi) / 2: it can overflow
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

int main() {
  int a[6] = {5, 2, 4, 6, 1, 3};
  int shifts = 0;
  for (int i = 1; i < 6; i++) {
    int x = a[i], j = i - 1;
    while (j >= 0 && a[j] > x) {
      a[j + 1] = a[j];
      shifts++;
      j--;
    }
    a[j + 1] = x;
  }
  for (int i = 0; i < 6; i++) printf("%d ", a[i]);
  printf("\\n%d\\n", shifts);                        // 9: the number of inversions

  int b[9] = {1, 3, 3, 5, 7, 7, 7, 9, 12};
  printf("%d %d %d\\n", lowerBound(b, 9, 7), lowerBound(b, 9, 8), lowerBound(b, 9, 100));
  return 0;
}

/* output:
1 2 3 4 5 6
9
4 7 9
*/`,
        },
      ],
    },

    /* --------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where do binary search and sorting come from?', 'Dari mana pencarian biner dan pengurutan berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Sorting is older than computers, because the machines of the census and the bank needed it, and binary search turned out to be famously easy to get wrong.**

- **1890s–1900s.** Herman Hollerith's punched-card machines tabulated the 1890 United States census, and the card sorters that followed sorted by one column at a time, the idea of radix sort.
- **1945.** John von Neumann wrote merge sort for the EDVAC, the first sorting program for a stored-program computer.
- **1946.** John Mauchly described binary search in a lecture series on computing at the Moore School; it is the earliest published description.
- **1959.** Donald Shell published Shellsort, the first sort known to beat $n^2$ by comparing elements far apart. In the same year Tony Hoare invented quicksort, working in Moscow on machine translation; he published it in 1961.
- **1962.** By Knuth's account, the first published binary search that is correct for every length of list appeared, sixteen years after the first.
- **1964.** J. W. J. Williams published heapsort, and Robert Floyd soon showed how to build the heap in linear time.
- **1997.** David Musser designed introsort, the quicksort that cannot degrade.
- **2002.** Tim Peters wrote Timsort for Python, and it later spread to Java, Android and JavaScript engines.
- **2006.** Joshua Bloch showed that the middle computed as ´(lo + hi) / 2´ in the Java library's binary search and merge sort could overflow for lists of more than $2^{30}$ elements.`,
            T`**Pengurutan lebih tua daripada komputer, karena mesin sensus dan bank memerlukannya, dan pencarian biner ternyata terkenal mudah salah ditulis.**

- **1890-an–1900-an.** Mesin kartu berlubang Herman Hollerith mentabulasi sensus Amerika Serikat 1890, dan pengurut kartu yang menyusul mengurutkan satu kolom sekali waktu, gagasan radix sort.
- **1945.** John von Neumann menulis merge sort untuk EDVAC, program pengurutan pertama untuk komputer program tersimpan.
- **1946.** John Mauchly menguraikan pencarian biner dalam rangkaian kuliah tentang komputasi di Moore School; itulah uraian tertua yang diterbitkan.
- **1959.** Donald Shell menerbitkan Shellsort, pengurutan pertama yang diketahui mengalahkan $n^2$ dengan membandingkan elemen yang berjauhan. Pada tahun yang sama Tony Hoare menemukan quicksort, ketika bekerja di Moskow pada penerjemahan mesin; ia menerbitkannya pada 1961.
- **1962.** Menurut Knuth, pencarian biner pertama yang diterbitkan dan benar untuk setiap panjang daftar muncul, enam belas tahun sesudah yang pertama.
- **1964.** J. W. J. Williams menerbitkan heapsort, dan Robert Floyd segera menunjukkan cara membangun heap dalam waktu linear.
- **1997.** David Musser merancang introsort, quicksort yang tidak dapat memburuk.
- **2002.** Tim Peters menulis Timsort untuk Python, dan kemudian ia menyebar ke Java, Android, dan mesin JavaScript.
- **2006.** Joshua Bloch menunjukkan bahwa titik tengah yang dihitung sebagai ´(lo + hi) / 2´ dalam pencarian biner dan merge sort pustaka Java dapat meluap untuk daftar lebih dari $2^{30}$ elemen.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with searching and sorting?', 'Kesalahan apa yang sering terjadi pada pencarian dan pengurutan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with binary search and sorting are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Binary search works on any list | The list must be sorted, and indexing must be $O(1)$; on unsorted data the answer is simply wrong. |
| ❌ ´mid = (lo + hi) / 2´ is always safe | With fixed-size integers the sum can overflow; write ´mid = lo + (hi - lo) / 2´. |
| ❌ Use ´hi = mid - 1´ with ´while lo < hi´ | Mixing the closed and half-open conventions skips answers or loops forever; choose one and state the invariant. |
| ❌ Binary search returns the first match | It returns *a* match; for the first one use the lower bound (´bisect_left´). |
| ❌ Bisect reals until ´hi - lo < 1e-18´ | Doubles near $1$ are $2.2\times10^{-16}$ apart, so the loop may never end; count iterations or compare ´mid´ with the ends. |
| ❌ Bubble or insertion sort is fine for a million items | About $\frac{n^2}{2}=5\times10^{11}$ steps; they suit lists of a few dozen or nearly sorted ones. |
| ❌ Quicksort is always $O(n\log n)$ | Its worst case is $n^2$, and with the last element as pivot a sorted list is the worst case. |
| ❌ Two sorts in a row sort by two keys | Only stable sorts keep the first order among equals: sort by the less important key first, or sort by a tuple. |
| ❌ ´[10, 9, 1].sort()´ sorts numbers | JavaScript sorts as text and gives ´[1, 10, 9]´; pass ´(a, b) => a - b´. |`,
            T`**Kesalahan paling umum pada pencarian biner dan pengurutan adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Pencarian biner bekerja pada daftar apa pun | Daftarnya harus terurut, dan pengindeksan harus $O(1)$; pada data tak terurut jawabannya sekadar salah. |
| ❌ ´mid = (lo + hi) / 2´ selalu aman | Dengan bilangan bulat berukuran tetap jumlahnya bisa meluap; tulis ´mid = lo + (hi - lo) / 2´. |
| ❌ Pakai ´hi = mid - 1´ dengan ´while lo < hi´ | Mencampur konvensi tertutup dan setengah terbuka melewatkan jawaban atau berputar tanpa henti; pilih satu dan nyatakan invariannya. |
| ❌ Pencarian biner mengembalikan kecocokan pertama | Ia mengembalikan *sebuah* kecocokan; untuk yang pertama pakai batas bawah (´bisect_left´). |
| ❌ Bisection bilangan real sampai ´hi - lo < 1e-18´ | Double di dekat $1$ berjarak $2{,}2\times10^{-16}$, sehingga perulangan mungkin tidak pernah berakhir; hitung iterasi atau bandingkan ´mid´ dengan ujungnya. |
| ❌ Bubble atau insertion sort baik untuk sejuta elemen | Sekitar $\frac{n^2}{2}=5\times10^{11}$ langkah; keduanya cocok untuk daftar beberapa puluh elemen atau yang hampir terurut. |
| ❌ Quicksort selalu $O(n\log n)$ | Kasus terburuknya $n^2$, dan dengan elemen terakhir sebagai pivot daftar terurut adalah kasus terburuk. |
| ❌ Dua pengurutan berturut-turut mengurutkan menurut dua kunci | Hanya pengurutan stabil yang mempertahankan urutan pertama di antara yang sama: urutkan menurut kunci yang kurang penting lebih dulu, atau urutkan menurut tupel. |
| ❌ ´[10, 9, 1].sort()´ mengurutkan bilangan | JavaScript mengurutkan sebagai teks dan menghasilkan ´[1, 10, 9]´; berikan ´(a, b) => a - b´. |`,
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
              L(T`Binary search needs the list to be sorted.`, T`Pencarian biner memerlukan daftar terurut.`),
              L(T`Binary search on a linked list takes $O(\log n)$ steps.`, T`Pencarian biner pada linked list memerlukan $O(\log n)$ langkah.`),
              L(T`Selection sort makes the same number of comparisons on every input of size $n$.`, T`Selection sort membuat banyak perbandingan yang sama pada setiap masukan berukuran $n$.`),
              L(T`Merge sort can be made stable by taking the left element when two are equal.`, T`Merge sort dapat dibuat stabil dengan mengambil elemen kiri bila dua elemen sama.`),
              L(T`Quicksort with the last element as pivot is fast on a sorted list.`, T`Quicksort dengan elemen terakhir sebagai pivot cepat pada daftar terurut.`),
              L(T`Python's ´sorted(a)´ sorts the list ´a´ in place.`, T`´sorted(a)´ Python mengurutkan daftar ´a´ di tempat.`),
            ],
            answer: [true, false, true, true, false, false],
            explain: L(
              T`A linked list cannot jump to its middle, so reaching it costs $O(n)$. Selection sort always compares every pair of the unsorted part. A sorted list is the worst input for that quicksort: $\frac{n(n-1)}{2}$ comparisons. ´sorted´ returns a new list; ´a.sort()´ sorts in place.`,
              T`Linked list tidak dapat melompat ke tengahnya, sehingga mencapainya memerlukan $O(n)$. Selection sort selalu membandingkan setiap pasangan pada bagian yang belum terurut. Daftar terurut adalah masukan terburuk bagi quicksort itu: $\frac{n(n-1)}{2}$ perbandingan. ´sorted´ mengembalikan daftar baru; ´a.sort()´ mengurutkan di tempat.`,
            ),
            hint: L(T`Think of what each algorithm needs: random access, an order of comparisons, the pivot's position.`, T`Pikirkan apa yang dibutuhkan tiap algoritma: akses acak, urutan perbandingan, posisi pivot.`),
          },
        },
        {
          kind: 'activity',
          title: L('Which sorts are stable?', 'Pengurutan mana yang stabil?'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Which of these sorts are stable (equal keys keep their order)? Choose **all** that apply.`, T`Pengurutan mana yang stabil (kunci yang sama mempertahankan urutannya)? Pilih **semua** yang benar.`),
            options: [
              L(T`insertion sort`, T`insertion sort`),
              L(T`selection sort`, T`selection sort`),
              L(T`merge sort`, T`merge sort`),
              L(T`quicksort (Lomuto)`, T`quicksort (Lomuto)`),
              L(T`bubble sort`, T`bubble sort`),
            ],
            answer: [0, 2, 4],
            explain: L(T`Insertion, merge and bubble sort only move an element past strictly larger ones (or take the left one first), so equal keys keep their order. Selection sort and quicksort swap elements across a distance, which can jump an element over an equal one; heapsort has the same problem.`, T`Insertion, merge, dan bubble sort hanya memindahkan elemen melewati yang benar-benar lebih besar (atau mengambil yang kiri lebih dulu), sehingga kunci yang sama mempertahankan urutannya. Selection sort dan quicksort menukar elemen melintasi jarak, yang dapat melompatkan sebuah elemen melewati yang sama; heapsort punya masalah yang sama.`),
            hint: L(T`Does the algorithm ever swap two elements that are far apart?`, T`Apakah algoritma itu pernah menukar dua elemen yang berjauhan?`),
          },
        },
        {
          kind: 'activity',
          title: L('How many looks?', 'Berapa kali melihat?'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`The bound is $\lfloor\log_2n\rfloor+1$.`, T`Batasnya $\lfloor\log_2n\rfloor+1$.`), L(T`$2^{19}=524\,288$ and $2^{20}=1\,048\,576$, so $\lfloor\log_210^6\rfloor=19$.`, T`$2^{19}=524\,288$ dan $2^{20}=1\,048\,576$, sehingga $\lfloor\log_210^6\rfloor=19$.`)],
            explain: L(T`$\lfloor\log_210^6\rfloor+1=19+1=20$ looks at most.`, T`$\lfloor\log_210^6\rfloor+1=19+1=20$ kali melihat paling banyak.`),
            prompt: L(T`At most how many looks does binary search need in a sorted list of one million elements?`, T`Paling banyak berapa kali melihat yang diperlukan pencarian biner dalam daftar terurut sejuta elemen?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 20 }],
          },
        },
        {
          kind: 'activity',
          title: L('Count the inversions', 'Hitung inversinya'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`List the pairs where the left number is bigger than the right one.`, T`Daftarkan pasangan yang bilangan kirinya lebih besar daripada bilangan kanannya.`), L(T`$3>1$, $3>2$ and $5>4$.`, T`$3>1$, $3>2$, dan $5>4$.`)],
            explain: L(T`The pairs $(3,1)$, $(3,2)$ and $(5,4)$: $3$ inversions, so bubble sort makes exactly $3$ swaps.`, T`Pasangan $(3,1)$, $(3,2)$, dan $(5,4)$: $3$ inversi, sehingga bubble sort membuat tepat $3$ pertukaran.`),
            prompt: L(T`How many inversions does the list $[3,1,2,5,4]$ have?`, T`Berapa inversi yang dimiliki daftar $[3,1,2,5,4]$?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 3 }],
          },
        },
        {
          kind: 'activity',
          title: L('Selection sort comparisons', 'Perbandingan selection sort'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`The first pass compares $11$ pairs, the next $10$, and so on.`, T`Putaran pertama membandingkan $11$ pasang, berikutnya $10$, dan seterusnya.`), L(T`$11+10+\cdots+1=\frac{12\cdot11}{2}$.`, T`$11+10+\cdots+1=\frac{12\cdot11}{2}$.`)],
            explain: L(T`$\frac{n(n-1)}{2}=\frac{12\cdot11}{2}=66$ comparisons, whatever the order of the numbers.`, T`$\frac{n(n-1)}{2}=\frac{12\cdot11}{2}=66$ perbandingan, apa pun urutan bilangannya.`),
            prompt: L(T`How many comparisons does selection sort make on $12$ numbers?`, T`Berapa perbandingan yang dibuat selection sort pada $12$ bilangan?`),
            given: String.raw`c=v`,
            blanks: [{ label: 'c =', answer: 66 }],
          },
        },
        {
          kind: 'activity',
          title: L('A lower bound', 'Sebuah batas bawah'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`The lower bound is the first index with $a[i]\ge8$.`, T`Batas bawah adalah indeks pertama dengan $a[i]\ge8$.`), L(T`The list is $[1,3,3,5,7,7,7,9,12]$ with indices $0$ to $8$; $a[7]=9$.`, T`Daftarnya $[1,3,3,5,7,7,7,9,12]$ dengan indeks $0$ sampai $8$; $a[7]=9$.`)],
            explain: L(T`The numbers before $9$ are all below $8$ and $9\ge8$, so the lower bound of $8$ is index $7$, the insertion point.`, T`Bilangan sebelum $9$ semuanya di bawah $8$ dan $9\ge8$, sehingga batas bawah $8$ adalah indeks $7$, titik sisipnya.`),
            prompt: L(T`In $[1,3,3,5,7,7,7,9,12]$, what index does the lower bound template return for $x=8$?`, T`Pada $[1,3,3,5,7,7,7,9,12]$, indeks berapa yang dikembalikan templat batas bawah untuk $x=8$?`),
            given: String.raw`i=v`,
            blanks: [{ label: 'i =', answer: 7 }],
          },
        },
        {
          kind: 'activity',
          title: L('The safe middle', 'Titik tengah yang aman'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L(T`Which formula for the middle cannot overflow when ´lo´ and ´hi´ are valid 32-bit indices?`, T`Rumus titik tengah mana yang tidak dapat meluap bila ´lo´ dan ´hi´ adalah indeks 32-bit yang sah?`),
            options: [
              L(T`´lo + (hi - lo) / 2´`, T`´lo + (hi - lo) / 2´`),
              L(T`´(lo + hi) / 2´`, T`´(lo + hi) / 2´`),
              L(T`´(lo + hi) * 0.5´`, T`´(lo + hi) * 0.5´`),
              L(T`´lo * hi / 2´`, T`´lo * hi / 2´`),
            ],
            answer: 0,
            explain: L(T`´hi - lo´ is never larger than ´hi´, so ´lo + (hi - lo) / 2´ stays between ´lo´ and ´hi´. The sum ´lo + hi´ can exceed $2^{31}-1$.`, T`´hi - lo´ tidak pernah lebih besar daripada ´hi´, sehingga ´lo + (hi - lo) / 2´ tetap di antara ´lo´ dan ´hi´. Jumlah ´lo + hi´ dapat melebihi $2^{31}-1$.`),
            hint: L(T`Which formula never adds the two big numbers?`, T`Rumus mana yang tidak pernah menjumlahkan kedua bilangan besar itu?`),
          },
        },
        {
          kind: 'activity',
          title: L('Search the answer', 'Cari jawabannya'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`Test $m^2\le200$ for $m=14$ and $m=15$.`, T`Uji $m^2\le200$ untuk $m=14$ dan $m=15$.`), L(T`$14^2=196$ and $15^2=225$.`, T`$14^2=196$ dan $15^2=225$.`)],
            explain: L(T`$14^2=196\le200<225=15^2$, so the largest $r$ with $r^2\le200$ is $14$.`, T`$14^2=196\le200<225=15^2$, sehingga $r$ terbesar dengan $r^2\le200$ adalah $14$.`),
            prompt: L(T`What integer does a binary search on the answer return for the largest $r$ with $r^2\le200$?`, T`Bilangan bulat apa yang dikembalikan pencarian biner pada jawaban untuk $r$ terbesar dengan $r^2\le200$?`),
            given: String.raw`r=v`,
            blanks: [{ label: 'r =', answer: 14 }],
          },
        },
        {
          kind: 'activity',
          title: L('Merge sort writes', 'Penulisan merge sort'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`Every level of the recursion merges all $8$ numbers once.`, T`Setiap tingkat rekursi menggabungkan semua $8$ bilangan sekali.`), L(T`$8$ numbers halve three times: $8\to4\to2\to1$.`, T`$8$ bilangan dibagi dua tiga kali: $8\to4\to2\to1$.`)],
            explain: L(T`$3$ levels of merging, $8$ writes each: $3\cdot8=24$.`, T`$3$ tingkat penggabungan, masing-masing $8$ penulisan: $3\cdot8=24$.`),
            prompt: L(T`How many numbers does merge sort write into merged lists when it sorts $8$ numbers?`, T`Berapa bilangan yang ditulis merge sort ke daftar gabungan ketika mengurutkan $8$ bilangan?`),
            given: String.raw`w=v`,
            blanks: [{ label: 'w =', answer: 24 }],
          },
        },
        {
          kind: 'activity',
          title: L('Quicksort on a sorted list', 'Quicksort pada daftar terurut'),
          step: {
            kind: 'math',
            id: 'p10',
            hints: [L(T`The partitions make $10$, then $9$, then $8$ comparisons, and so on.`, T`Partisinya membuat $10$, lalu $9$, lalu $8$ perbandingan, dan seterusnya.`), L(T`$10+9+\cdots+1=\frac{11\cdot10}{2}$.`, T`$10+9+\cdots+1=\frac{11\cdot10}{2}$.`)],
            explain: L(T`$\frac{n(n-1)}{2}=\frac{11\cdot10}{2}=55$ comparisons: the pivot is always the largest element of what is left.`, T`$\frac{n(n-1)}{2}=\frac{11\cdot10}{2}=55$ perbandingan: pivotnya selalu elemen terbesar dari yang tersisa.`),
            prompt: L(T`How many comparisons does quicksort (last element as pivot) make on the sorted list $[1,2,\dots,11]$?`, T`Berapa perbandingan yang dibuat quicksort (elemen terakhir sebagai pivot) pada daftar terurut $[1,2,\dots,11]$?`),
            given: String.raw`c=v`,
            blanks: [{ label: 'c =', answer: 55 }],
          },
        },
        {
          kind: 'activity',
          title: L('Sort by two keys', 'Urutkan menurut dua kunci'),
          step: {
            kind: 'quiz',
            id: 'p11',
            prompt: L(T`Orders are listed by arrival time. You sort them by date and want orders on the same date to stay in arrival order. What do you need?`, T`Pesanan dicantumkan menurut waktu kedatangan. Kamu mengurutkannya menurut tanggal dan ingin pesanan pada tanggal yang sama tetap menurut urutan kedatangan. Apa yang kamu perlukan?`),
            options: [
              L(T`a stable sort`, T`pengurutan stabil`),
              L(T`an in-place sort`, T`pengurutan di tempat`),
              L(T`a sort that is $O(n\log n)$ in the worst case`, T`pengurutan yang $O(n\log n)$ pada kasus terburuk`),
              L(T`a sort that uses no extra memory`, T`pengurutan yang tidak memakai memori tambahan`),
            ],
            answer: 0,
            explain: L(T`Stability is exactly the promise that elements with equal keys (the same date) keep their earlier order (arrival time). Speed and memory are separate questions.`, T`Stabil tepat berarti janji bahwa elemen dengan kunci sama (tanggal sama) mempertahankan urutan sebelumnya (waktu kedatangan). Kecepatan dan memori adalah pertanyaan yang terpisah.`),
            hint: L(T`What happens to equal keys?`, T`Apa yang terjadi pada kunci yang sama?`),
          },
        },
        {
          kind: 'activity',
          title: L('Finding a broken commit', 'Mencari komit yang rusak'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`Why can ´git bisect´ find the first bad commit among $1000$ in about $10$ tests?`, T`Mengapa ´git bisect´ dapat menemukan komit rusak pertama di antara $1000$ dalam sekitar $10$ pengujian?`),
            options: [
              L(T`the history goes from good to bad once, so each test halves the candidates`, T`riwayat beralih dari baik ke rusak sekali, sehingga setiap pengujian membagi dua calon`),
              L(T`it tests the commits in random order`, T`ia menguji komit dalam urutan acak`),
              L(T`it reads the code of every commit`, T`ia membaca kode setiap komit`),
              L(T`it tests only the last ten commits`, T`ia hanya menguji sepuluh komit terakhir`),
            ],
            answer: 0,
            explain: L(T`The question "is this commit bad?" is false up to a threshold and true after it, so binary search on the answer applies: $\lceil\log_21000\rceil=10$ tests.`, T`Pertanyaan "apakah komit ini rusak?" salah sampai suatu ambang dan benar sesudahnya, sehingga pencarian biner pada jawaban berlaku: $\lceil\log_21000\rceil=10$ pengujian.`),
            hint: L(T`What shape does the sequence good, good, ..., bad, bad have?`, T`Bagaimana bentuk barisan baik, baik, ..., rusak, rusak?`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: binary search and sorting at a glance', 'Ringkasan: pencarian biner dan pengurutan sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Binary search:** sorted list, look at the middle, discard half; at most $\lfloor\log_2n\rfloor+1$ looks.
- **Position questions:** the half-open template gives the lower bound (first $a[i]\ge x$); change ´<´ to ´<=´ for the upper bound; the difference counts copies.
- **Bugs:** keep one convention with its invariant, and use ´lo + (hi - lo) / 2´.
- **Search the answer:** any monotone yes-or-no question; integer roots in $\log_2N$ tests; bisection gains one binary digit per step and cannot fail.
- **Simple sorts:** about $\frac{n^2}{2}$ steps; bubble and insertion sort move exactly as many times as there are inversions.
- **Merge sort:** at most $n\lceil\log_2n\rceil$ comparisons, $O(n)$ extra memory, stable. **Quicksort:** $\approx1.39\,n\log_2n$ on average, $\frac{n(n-1)}{2}$ for extreme pivots, in place, not stable.
- **Limits:** a comparison sort needs $\log_2(n!)\approx n\log_2n-1.44n$ comparisons; counting and radix sort avoid comparing.
- **In practice:** use the library sort (Timsort, introsort), a stable one for several keys, and a comparator for numbers in JavaScript.`,
            T`- **Pencarian biner:** daftar terurut, lihat bagian tengah, buang separuh; paling banyak $\lfloor\log_2n\rfloor+1$ kali melihat.
- **Pertanyaan posisi:** templat setengah terbuka memberi batas bawah ($a[i]\ge x$ pertama); ubah ´<´ menjadi ´<=´ untuk batas atas; selisihnya menghitung salinan.
- **Galat:** pertahankan satu konvensi dengan invariannya, dan pakai ´lo + (hi - lo) / 2´.
- **Cari jawabannya:** pertanyaan ya atau tidak yang monoton apa pun; akar bulat dalam $\log_2N$ pengujian; bisection memperoleh satu angka biner per langkah dan tidak dapat gagal.
- **Pengurutan sederhana:** sekitar $\frac{n^2}{2}$ langkah; bubble dan insertion sort bergerak tepat sebanyak inversi.
- **Merge sort:** paling banyak $n\lceil\log_2n\rceil$ perbandingan, memori tambahan $O(n)$, stabil. **Quicksort:** $\approx1{,}39\,n\log_2n$ rata-rata, $\frac{n(n-1)}{2}$ untuk pivot ekstrem, di tempat, tidak stabil.
- **Batas:** pengurutan perbandingan memerlukan $\log_2(n!)\approx n\log_2n-1{,}44n$ perbandingan; counting dan radix sort menghindari perbandingan.
- **Dalam praktik:** pakai pengurutan pustaka (Timsort, introsort), yang stabil untuk beberapa kunci, dan pembanding untuk bilangan di JavaScript.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Binary search', 'Pencarian biner'), definition: L('A search in a sorted list that looks at the middle element and discards the half that cannot contain the target.', 'Pencarian dalam daftar terurut yang melihat elemen tengah dan membuang separuh yang tidak mungkin memuat target.') },
    { term: L('Invariant', 'Invarian'), definition: L('A statement that is true before and after every step of a loop, from which the correctness of the loop is proved.', 'Pernyataan yang benar sebelum dan sesudah setiap langkah perulangan, yang dari situ kebenaran perulangan dibuktikan.') },
    { term: L('Lower bound (position)', 'Batas bawah (posisi)'), definition: L('The first index whose element is at least x; for an absent x it is the insertion point that keeps the list sorted.', 'Indeks pertama yang elemennya sedikitnya x; untuk x yang tidak ada ia adalah titik sisip yang menjaga daftar tetap terurut.') },
    { term: L('Bisection method', 'Metode bisection'), definition: L('A way to find a root of a continuous function by repeatedly halving an interval on whose ends the function has opposite signs.', 'Cara mencari akar fungsi kontinu dengan berulang kali membagi dua selang yang di ujung-ujungnya fungsi itu berlawanan tanda.') },
    { term: L('Inversion', 'Inversi'), definition: L('A pair of positions in a list where the earlier element is larger than the later one; a sorted list has none.', 'Pasangan posisi dalam daftar dengan elemen awal lebih besar daripada elemen akhir; daftar terurut tidak memilikinya.') },
    { term: L('Stable sort', 'Pengurutan stabil'), definition: L('A sort that keeps elements with equal keys in the order they had before sorting.', 'Pengurutan yang mempertahankan elemen berkunci sama dalam urutan yang dimilikinya sebelum diurutkan.') },
    { term: L('In-place sort', 'Pengurutan di tempat'), definition: L('A sort that rearranges the list using only a small amount of extra memory.', 'Pengurutan yang menata ulang daftar dengan hanya sedikit memori tambahan.') },
    { term: L('Pivot', 'Pivot'), definition: L('The element quicksort chooses so that smaller elements are moved before it and the others after it.', 'Elemen yang dipilih quicksort agar elemen yang lebih kecil dipindahkan ke depannya dan yang lain ke belakangnya.') },
    { term: L('Comparison sort', 'Pengurutan perbandingan'), definition: L('A sort that learns the order only by comparing two elements at a time, and so needs about n log n comparisons.', 'Pengurutan yang mengetahui urutan hanya dengan membandingkan dua elemen sekali waktu, sehingga memerlukan sekitar n log n perbandingan.') },
    { term: L('Timsort', 'Timsort'), definition: L('The stable hybrid of merge sort and insertion sort used by Python and by Java for objects, fast on data that is partly ordered.', 'Hibrida stabil dari merge sort dan insertion sort yang dipakai Python dan Java untuk objek, cepat pada data yang sebagian terurut.') },
  ],

  howTo: [
    {
      name: L('How to write a correct binary search', 'Cara menulis pencarian biner yang benar'),
      description: L('Use the half-open template with an invariant, and compute the middle without overflow.', 'Pakai templat setengah terbuka dengan invarian, dan hitung titik tengah tanpa luapan.'),
      steps: [
        { name: L('Check the input', 'Periksa masukannya'), text: L('Make sure the list is sorted and that you can reach any index in one step.', 'Pastikan daftar terurut dan kamu dapat mencapai indeks mana pun dalam satu langkah.') },
        { name: L('Write the invariant', 'Tulis invariannya'), text: L('Start with lo at 0 and hi at the length, and state that everything before lo is too small and everything from hi on is large enough.', 'Mulai dengan lo di 0 dan hi di panjang daftar, dan nyatakan bahwa semua sebelum lo terlalu kecil dan semua dari hi ke belakang cukup besar.') },
        { name: L('Halve safely', 'Bagi dua dengan aman'), text: L('While lo is below hi, take mid as lo plus half of hi minus lo; if the element at mid is too small move lo past it, otherwise set hi to mid.', 'Selama lo di bawah hi, ambil mid sebagai lo ditambah setengah dari hi dikurangi lo; jika elemen di mid terlalu kecil pindahkan lo melewatinya, jika tidak setel hi ke mid.') },
        { name: L('Read the answer', 'Baca jawabannya'), text: L('When lo equals hi it is the first index that qualifies; check that it is inside the list and holds the value you wanted.', 'Ketika lo sama dengan hi ia adalah indeks pertama yang memenuhi syarat; periksa bahwa ia berada di dalam daftar dan memuat nilai yang kamu inginkan.') },
      ],
    },
    {
      name: L('How to choose a sorting algorithm', 'Cara memilih algoritma pengurutan'),
      description: L('Start from the library sort and change it only for a reason you can name.', 'Mulai dari pengurutan pustaka dan ubah hanya karena alasan yang dapat kamu sebut.'),
      steps: [
        { name: L('Use the library sort', 'Pakai pengurutan pustaka'), text: L('Call the sort of your language; it is a tuned hybrid that is hard to beat.', 'Panggil pengurutan bahasamu; ia hibrida yang sudah disetel dan sulit dikalahkan.') },
        { name: L('Decide if you need stability', 'Putuskan perlu stabil atau tidak'), text: L('If you sort by several keys in turn, or equal elements carry other information, choose a stable sort.', 'Jika kamu mengurutkan menurut beberapa kunci berturut-turut, atau elemen yang sama membawa informasi lain, pilih pengurutan stabil.') },
        { name: L('Look at the data', 'Lihat datanya'), text: L('For a few dozen items or a nearly sorted list insertion sort is enough; for small whole numbers consider counting sort.', 'Untuk beberapa puluh elemen atau daftar yang hampir terurut insertion sort sudah cukup; untuk bilangan bulat kecil pertimbangkan counting sort.') },
        { name: L('Mind memory and the worst case', 'Perhatikan memori dan kasus terburuk'), text: L('Merge sort needs extra memory, plain quicksort can degrade, and heapsort or introsort give a worst-case guarantee in place.', 'Merge sort memerlukan memori tambahan, quicksort biasa dapat memburuk, dan heapsort atau introsort memberi jaminan kasus terburuk di tempat.') },
      ],
    },
  ],

  faq: [
    {
      q: L('How does binary search work?', 'Bagaimana cara kerja pencarian biner?'),
      a: L(
        'It compares the target with the middle element of a sorted list. If they are equal it is done; if the target is larger it continues in the right half, otherwise in the left half. Each step halves the list, so a thousand items need at most ten steps.',
        'Ia membandingkan target dengan elemen tengah daftar terurut. Jika sama, selesai; jika target lebih besar ia melanjutkan di separuh kanan, jika tidak di separuh kiri. Setiap langkah membagi dua daftar, sehingga seribu elemen memerlukan paling banyak sepuluh langkah.',
      ),
    },
    {
      q: L('Does binary search work on an unsorted list?', 'Apakah pencarian biner bekerja pada daftar tak terurut?'),
      a: L(
        'No. It throws away half of the list after one comparison, and that is only safe when the order tells you which half cannot hold the target. On unsorted data it can miss a value that is present, so sort first or scan linearly.',
        'Tidak. Ia membuang separuh daftar setelah satu perbandingan, dan itu hanya aman bila urutan memberi tahu separuh mana yang tidak mungkin memuat target. Pada data tak terurut ia dapat melewatkan nilai yang ada, jadi urutkan dulu atau pindai secara linear.',
      ),
    },
    {
      q: L('How do you avoid overflow and off-by-one errors in binary search?', 'Bagaimana menghindari luapan dan galat selisih satu pada pencarian biner?'),
      a: L(
        'Compute the middle as lo plus half of hi minus lo, so the sum of two large indices never overflows. Pick either a closed interval or a half-open one, use the matching loop condition and updates, and write the invariant as a comment.',
        'Hitung titik tengah sebagai lo ditambah setengah dari hi dikurangi lo, sehingga jumlah dua indeks besar tidak pernah meluap. Pilih selang tertutup atau setengah terbuka, pakai syarat perulangan dan pembaruan yang cocok, dan tulis invariannya sebagai komentar.',
      ),
    },
    {
      q: L('What is the difference between bisect_left and bisect_right?', 'Apa beda bisect_left dan bisect_right?'),
      a: L(
        'Both return an insertion point in a sorted list. With duplicates, bisect_left returns the index before the copies of the value and bisect_right the index after them, so their difference is how many copies there are.',
        'Keduanya mengembalikan titik sisip dalam daftar terurut. Dengan nilai kembar, bisect_left mengembalikan indeks sebelum salinan nilai itu dan bisect_right indeks sesudahnya, sehingga selisihnya adalah banyaknya salinan.',
      ),
    },
    {
      q: L('What is the fastest sorting algorithm?', 'Apa algoritma pengurutan tercepat?'),
      a: L(
        'There is none for every input. Comparison sorts cannot beat about n log n comparisons, and among them quicksort is usually fastest on arrays and merge sort on linked lists. Counting and radix sort can beat that when the keys are small integers.',
        'Tidak ada yang tercepat untuk setiap masukan. Pengurutan perbandingan tidak dapat mengalahkan sekitar n log n perbandingan, dan di antaranya quicksort biasanya tercepat pada larik dan merge sort pada linked list. Counting dan radix sort dapat mengalahkannya bila kuncinya bilangan bulat kecil.',
      ),
    },
    {
      q: L('What is the difference between quicksort and merge sort?', 'Apa beda quicksort dan merge sort?'),
      a: L(
        'Merge sort splits blindly in half and does its work while merging; it is stable, always n log n, and needs extra memory. Quicksort does its work while partitioning around a pivot; it sorts in place, but is not stable and can reach n squared.',
        'Merge sort membagi buta menjadi dua dan melakukan kerjanya saat menggabungkan; ia stabil, selalu n log n, dan memerlukan memori tambahan. Quicksort melakukan kerjanya saat mempartisi di sekitar pivot; ia mengurutkan di tempat, tetapi tidak stabil dan dapat mencapai n kuadrat.',
      ),
    },
    {
      q: L('What is a stable sort and why does it matter?', 'Apa itu pengurutan stabil dan mengapa penting?'),
      a: L(
        'A stable sort keeps items with equal keys in their original order. It matters when you sort by one key and want an earlier ordering to survive among ties, for instance sorting people by city while keeping each city sorted by name.',
        'Pengurutan stabil mempertahankan elemen berkunci sama dalam urutan aslinya. Ini penting ketika kamu mengurutkan menurut satu kunci dan ingin urutan sebelumnya bertahan di antara yang seri, misalnya mengurutkan orang menurut kota sambil menjaga tiap kota tetap terurut menurut nama.',
      ),
    },
    {
      q: L('Why does JavaScript sort 10 before 9?', 'Mengapa JavaScript mengurutkan 10 sebelum 9?'),
      a: L(
        'Without a comparison function, sort converts the elements to text and compares them letter by letter, and "10" comes before "9" because the character 1 comes before 9. Pass a function such as a minus b to sort numbers by value.',
        'Tanpa fungsi pembanding, sort mengubah elemen menjadi teks dan membandingkannya huruf demi huruf, dan "10" mendahului "9" karena karakter 1 mendahului 9. Berikan fungsi seperti a dikurangi b untuk mengurutkan bilangan menurut nilainya.',
      ),
    },
  ],

  references: [
    { title: 'The Art of Computer Programming, Volume 3: Sorting and Searching (2nd ed.), sections 5 and 6.2.1', author: 'Donald E. Knuth', year: 1998, source: 'Addison-Wesley' },
    { title: 'Introduction to Algorithms (4th ed.), chapters 2, 6, 7 and 8: Getting Started; Heapsort; Quicksort; Sorting in Linear Time', author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', year: 2022, source: 'MIT Press' },
    { title: 'Algorithm 64: Quicksort', author: 'C. A. R. Hoare', year: 1961, source: 'Communications of the ACM 4(7)' },
    { title: 'Extra, Extra - Read All About It: Nearly All Binary Searches and Mergesorts are Broken', author: 'Joshua Bloch', year: 2006, source: 'Google Research Blog' },
    { title: 'Programming Pearls (2nd ed.), column 4: Writing Correct Programs', author: 'Jon Bentley', year: 1999, source: 'Addison-Wesley' },
  ],

  related: ['big-o-notation', 'newtons-method', 'floating-point-numbers', 'binary-numbers'],
}
