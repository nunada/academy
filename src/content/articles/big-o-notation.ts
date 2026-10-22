import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './big-o-notation.meta'

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
    T`**Big-O notation describes how the number of steps of an algorithm grows with the size $n$ of its input, ignoring constant factors and smaller terms: $f(n)=O(g(n))$ means $f(n)\le c\,g(n)$ for some constant $c$ and all large $n$.** An algorithm with $3n^2+5n+7$ steps is $O(n^2)$. The common classes, from slowest to fastest growth, are $O(1)$, $O(\log n)$, $O(n)$, $O(n\log n)$, $O(n^2)$, $O(2^n)$ and $O(n!)$.`,
    T`**Notasi Big-O menggambarkan bagaimana banyaknya langkah sebuah algoritma tumbuh menurut ukuran $n$ masukannya, mengabaikan faktor konstan dan suku yang lebih kecil: $f(n)=O(g(n))$ berarti $f(n)\le c\,g(n)$ untuk suatu konstanta $c$ dan semua $n$ yang besar.** Algoritma dengan $3n^2+5n+7$ langkah adalah $O(n^2)$. Kelas yang umum, dari pertumbuhan paling lambat ke paling cepat, adalah $O(1)$, $O(\log n)$, $O(n)$, $O(n\log n)$, $O(n^2)$, $O(2^n)$, dan $O(n!)$.`,
  ),

  keyPoints: [
    L(
      T`$f(n)=O(g(n))$ means there are constants $c>0$ and $n_0$ with $f(n)\le c\,g(n)$ for all $n\ge n_0$. It is an upper bound on growth: $3n^2+5n+7\le4n^2$ for $n\ge7$, so it is $O(n^2)$.`,
      T`$f(n)=O(g(n))$ berarti ada konstanta $c>0$ dan $n_0$ dengan $f(n)\le c\,g(n)$ untuk semua $n\ge n_0$. Ia adalah batas atas pertumbuhan: $3n^2+5n+7\le4n^2$ untuk $n\ge7$, sehingga ia $O(n^2)$.`,
    ),
    L(
      T`Big-O ignores constant factors and lower-order terms, because they depend on the machine and stop mattering as $n$ grows. $\Omega$ is a lower bound and $\Theta$ is both: $f=\Theta(g)$ means $f=O(g)$ and $g=O(f)$.`,
      T`Big-O mengabaikan faktor konstan dan suku berorde lebih rendah, karena bergantung pada mesin dan tidak lagi penting ketika $n$ membesar. $\Omega$ adalah batas bawah dan $\Theta$ keduanya: $f=\Theta(g)$ berarti $f=O(g)$ dan $g=O(f)$.`,
    ),
    L(
      T`The order of growth is $1\ll\log n\ll\sqrt n\ll n\ll n\log n$ $\ll n^2\ll n^3\ll2^n\ll n!$. At $10^9$ steps a second, the largest input that finishes in one second is about $10^9$ for $n$, $31\,622$ for $n^2$, $29$ for $2^n$ and $12$ for $n!$.`,
      T`Urutan pertumbuhannya $1\ll\log n\ll\sqrt n\ll n\ll n\log n$ $\ll n^2\ll n^3\ll2^n\ll n!$. Pada $10^9$ langkah per detik, masukan terbesar yang selesai dalam satu detik sekitar $10^9$ untuk $n$, $31\,622$ untuk $n^2$, $29$ untuk $2^n$, dan $12$ untuk $n!$.`,
    ),
    L(
      T`To find the complexity of code: add the costs of statements in sequence and keep the largest, multiply the cost of a loop body by the number of iterations, nested loops multiply, a loop that halves its counter runs $\log n$ times, and a recursion gives a recurrence.`,
      T`Untuk mencari kompleksitas kode: jumlahkan biaya pernyataan berurutan dan ambil yang terbesar, kalikan biaya badan perulangan dengan banyak iterasinya, perulangan bersarang mengalikan, perulangan yang membagi dua penghitungnya berjalan $\log n$ kali, dan rekursi menghasilkan rekurensi.`,
    ),
    L(
      T`Divide-and-conquer recurrences $T(n)=aT(n/b)+n^d$ are solved by the Master theorem: compare $d$ with $\log_ba$. Merge sort has $a=b=2$, $d=1$ and costs $\Theta(n\log n)$; binary search has $a=1$, $b=2$, $d=0$ and costs $\Theta(\log n)$.`,
      T`Rekurensi bagi-dan-taklukkan $T(n)=aT(n/b)+n^d$ diselesaikan dengan teorema Master: bandingkan $d$ dengan $\log_ba$. Merge sort memiliki $a=b=2$, $d=1$ dan berbiaya $\Theta(n\log n)$; pencarian biner memiliki $a=1$, $b=2$, $d=0$ dan berbiaya $\Theta(\log n)$.`,
    ),
    L(
      T`Big-O is not running time: a $100n$ algorithm is slower than an $n^2$ one for $n<100$, memory and caches matter, and for numbers the size of the input is the number of digits, not the value.`,
      T`Big-O bukan waktu jalan: algoritma $100n$ lebih lambat daripada $n^2$ untuk $n<100$, memori dan cache berpengaruh, dan untuk bilangan ukuran masukan adalah banyaknya angka, bukan nilainya.`,
    ),
  ],

  sections: [
    /* ------------------------------------------------------------------------------------- what */
    {
      id: 'what-is',
      heading: L('What is Big-O notation?', 'Apa itu notasi Big-O?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Big-O notation is a way to say how fast the work of an algorithm grows as its input gets bigger, without counting seconds.** Seconds depend on the computer, the language and the day; the *number of basic steps* as a function of the input size $n$ does not. If an algorithm takes $f(n)$ steps, we write $f(n)=O(g(n))$ when $f$ grows no faster than $g$, up to a constant factor.

**The definition.** $f(n)=O(g(n))$ means that there are constants $c>0$ and $n_0$ such that
$$f(n)\le c\cdot g(n)\qquad\text{for all }n\ge n_0.$$
The pair $(c,n_0)$ is a *witness*. For example, $f(n)=3n^2+5n+7$ is $O(n^2)$ with the witness $c=4$, $n_0=7$: for $n\ge7$ we have $n^2-5n-7\ge0$ (at $n=7$ it is $7$, and it only grows), that is $5n+7\le n^2$, so $3n^2+5n+7\le4n^2$. A different $c$ gives a different $n_0$: with $c=3$ there is none, because $3n^2+5n+7>3n^2$ always; with $c=100$ the inequality holds from $n_0=1$.

**What it throws away.** Constant factors ($3n^2$ and $50n^2$ are both $O(n^2)$) and lower-order terms ($n^2+1000n$ is $O(n^2)$), because the machine decides the first and the biggest term decides the second when $n$ is large. Two rules follow: the sum of a few functions is dominated by the fastest, and a product multiplies: $O(n)+O(n^2)=O(n^2)$ and $O(n)\cdot O(\log n)=O(n\log n)$.

**Three symbols.** $O$ is an upper bound ("at most this fast a growth"), $\Omega$ is a lower bound ($f(n)\ge c\,g(n)$ for large $n$) and $\Theta$ is both: $f=\Theta(g)$ means $f=O(g)$ and $g=O(f)$. Linear search is $O(n)$, but also $O(n^2)$ and $O(2^n)$, which are true and useless; the useful statement is the tight one, $\Theta(n)$ in the worst case. When the limit of $\frac{f(n)}{g(n)}$ exists, it decides: a finite limit gives $f=O(g)$, a non-zero finite limit gives $f=\Theta(g)$, and a limit of $0$ means $f$ grows strictly slower (this is where [L'Hôpital's Rule](article:indeterminate-forms-and-lhopitals-rule#infinity-forms) is used).

Try the definition below. Type two functions with $n$ written as ´x´, choose $c$, and the widget finds the threshold $n_0$.`,
            T`**Notasi Big-O adalah cara menyatakan seberapa cepat kerja sebuah algoritma tumbuh ketika masukannya membesar, tanpa menghitung detik.** Detik bergantung pada komputer, bahasa, dan harinya; *banyaknya langkah dasar* sebagai fungsi ukuran masukan $n$ tidak. Jika algoritma memerlukan $f(n)$ langkah, kita tulis $f(n)=O(g(n))$ bila $f$ tumbuh tidak lebih cepat daripada $g$, sampai suatu faktor konstan.

**Definisinya.** $f(n)=O(g(n))$ berarti ada konstanta $c>0$ dan $n_0$ sehingga
$$f(n)\le c\cdot g(n)\qquad\text{untuk semua }n\ge n_0.$$
Pasangan $(c,n_0)$ adalah *saksi*. Misalnya, $f(n)=3n^2+5n+7$ adalah $O(n^2)$ dengan saksi $c=4$, $n_0=7$: untuk $n\ge7$ berlaku $n^2-5n-7\ge0$ (di $n=7$ nilainya $7$, dan hanya membesar), yaitu $5n+7\le n^2$, sehingga $3n^2+5n+7\le4n^2$. $c$ yang lain memberi $n_0$ yang lain: dengan $c=3$ tidak ada, karena $3n^2+5n+7>3n^2$ selalu; dengan $c=100$ ketaksamaan berlaku dari $n_0=1$.

**Apa yang dibuang.** Faktor konstan ($3n^2$ dan $50n^2$ keduanya $O(n^2)$) dan suku berorde rendah ($n^2+1000n$ adalah $O(n^2)$), karena mesin menentukan yang pertama dan suku terbesar menentukan yang kedua ketika $n$ besar. Dua aturan mengikutinya: jumlah beberapa fungsi didominasi yang tercepat, dan hasil kali mengalikan: $O(n)+O(n^2)=O(n^2)$ dan $O(n)\cdot O(\log n)=O(n\log n)$.

**Tiga lambang.** $O$ adalah batas atas ("pertumbuhan paling cepat sebesar ini"), $\Omega$ adalah batas bawah ($f(n)\ge c\,g(n)$ untuk $n$ besar), dan $\Theta$ keduanya: $f=\Theta(g)$ berarti $f=O(g)$ dan $g=O(f)$. Pencarian linear adalah $O(n)$, tetapi juga $O(n^2)$ dan $O(2^n)$, yang benar dan tidak berguna; pernyataan yang berguna adalah yang ketat, $\Theta(n)$ pada kasus terburuk. Bila limit $\frac{f(n)}{g(n)}$ ada, ia menentukan: limit terhingga memberi $f=O(g)$, limit terhingga tak nol memberi $f=\Theta(g)$, dan limit $0$ berarti $f$ tumbuh jauh lebih lambat (di sinilah [Aturan L'Hôpital](article:indeterminate-forms-and-lhopitals-rule#infinity-forms) dipakai).

Cobalah definisinya di bawah. Ketik dua fungsi dengan $n$ ditulis ´x´, pilih $c$, dan widget mencari ambang $n_0$.`,
          ),
        },
        { kind: 'widget', name: 'bigowitness' },
      ],
    },

    /* ------------------------------------------------------------------------------ growth rates */
    {
      id: 'growth-rates',
      heading: L('How fast do the common growth rates grow?', 'Seberapa cepat laju pertumbuhan yang umum tumbuh?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A handful of classes cover almost every algorithm you meet, and each is a different world of what is feasible.** From slowest to fastest growth:

| Class | Name | Example |
|---|---|---|
| $O(1)$ | constant | read an array element ´a[i]´ |
| $O(\log n)$ | logarithmic | binary search; halving the problem each step |
| $O(\sqrt n)$ | square root | trial division up to $\sqrt n$ |
| $O(n)$ | linear | one pass over a list |
| $O(n\log n)$ | linearithmic | merge sort; sorting in general |
| $O(n^2)$ | quadratic | comparing all pairs; bubble sort |
| $O(n^3)$ | cubic | multiplying two $n\times n$ matrices the school way |
| $O(2^n)$ | exponential | trying every subset |
| $O(n!)$ | factorial | trying every ordering (a brute-force salesman) |

The order is $1\ll\log n\ll\sqrt n\ll n\ll n\log n$ $\ll n^2\ll n^3\ll2^n\ll n!$, where $f\ll g$ means $\frac fg\to0$; the same comparison of growth, a logarithm below any power below an exponential, is proved with limits in the article on [growth rates and L'Hôpital's Rule](article:indeterminate-forms-and-lhopitals-rule#infinity-forms).

**What the classes mean in time.** Take a computer that does $10^9$ steps a second. For $n=100$ a quadratic algorithm needs $10^4$ steps, ten microseconds. An exponential one needs $2^{100}\approx1.3\times10^{30}$ steps, which is about $4\times10^{13}$ years, thousands of times the age of the universe. And the largest input that finishes in one second is about $10^9$ for $n$, $4\times10^7$ for $n\log n$, $31\,622$ for $n^2$, $1000$ for $n^3$, only $29$ for $2^n$ and $12$ for $n!$. A computer a thousand times faster adds only $10$ to the $n$ of an exponential algorithm ($2^{10}\approx1000$), while it multiplies the $n$ of a linear one by a thousand. That is why the class matters more than the machine.

Slide $n$ and the speed below. The table gives the steps, the time and the largest $n$ for a time budget.`,
            T`**Segelintir kelas mencakup hampir setiap algoritma yang kamu temui, dan masing-masing adalah dunia yang berbeda tentang apa yang layak.** Dari pertumbuhan paling lambat ke paling cepat:

| Kelas | Nama | Contoh |
|---|---|---|
| $O(1)$ | konstan | membaca elemen larik ´a[i]´ |
| $O(\log n)$ | logaritmik | pencarian biner; membagi dua masalah setiap langkah |
| $O(\sqrt n)$ | akar kuadrat | pembagian coba-coba sampai $\sqrt n$ |
| $O(n)$ | linear | satu lintasan atas daftar |
| $O(n\log n)$ | linearitmik | merge sort; pengurutan pada umumnya |
| $O(n^2)$ | kuadratik | membandingkan semua pasangan; bubble sort |
| $O(n^3)$ | kubik | mengalikan dua matriks $n\times n$ dengan cara sekolah |
| $O(2^n)$ | eksponensial | mencoba setiap himpunan bagian |
| $O(n!)$ | faktorial | mencoba setiap urutan (pedagang keliling dengan kekerasan) |

Urutannya $1\ll\log n\ll\sqrt n\ll n\ll n\log n$ $\ll n^2\ll n^3\ll2^n\ll n!$, dengan $f\ll g$ berarti $\frac fg\to0$; perbandingan pertumbuhan yang sama, logaritma di bawah pangkat mana pun di bawah eksponensial, dibuktikan dengan limit dalam artikel [laju pertumbuhan dan Aturan L'Hôpital](article:indeterminate-forms-and-lhopitals-rule#infinity-forms).

**Arti kelas itu dalam waktu.** Ambil komputer yang melakukan $10^9$ langkah per detik. Untuk $n=100$ algoritma kuadratik memerlukan $10^4$ langkah, sepuluh mikrodetik. Yang eksponensial memerlukan $2^{100}\approx1{,}3\times10^{30}$ langkah, sekitar $4\times10^{13}$ tahun, ribuan kali usia alam semesta. Dan masukan terbesar yang selesai dalam satu detik sekitar $10^9$ untuk $n$, $4\times10^7$ untuk $n\log n$, $31\,622$ untuk $n^2$, $1000$ untuk $n^3$, hanya $29$ untuk $2^n$ dan $12$ untuk $n!$. Komputer seribu kali lebih cepat hanya menambah $10$ pada $n$ algoritma eksponensial ($2^{10}\approx1000$), sedangkan ia mengalikan $n$ algoritma linear dengan seribu. Itulah sebabnya kelas lebih penting daripada mesin.

Geser $n$ dan kecepatan di bawah. Tabel memberi langkah, waktu, dan $n$ terbesar untuk anggaran waktu.`,
          ),
        },
        { kind: 'widget', name: 'bigogrowth' },
      ],
    },

    /* ----------------------------------------------------------------------------- counting steps */
    {
      id: 'counting-steps',
      heading: L('How do you find the time complexity of code?', 'Bagaimana mencari kompleksitas waktu sebuah kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**You count basic steps, then keep only the term that grows fastest.** A few rules cover most code:

1. **A basic operation costs 1:** an assignment, a comparison, an arithmetic operation, reading an array element.
2. **Statements in sequence add, and the biggest wins:** a loop of $n$ steps followed by a loop of $n^2$ steps is $O(n+n^2)=O(n^2)$.
3. **A loop multiplies:** the number of iterations times the cost of the body. Two nested loops over $n$ cost $n\cdot n=n^2$.
4. **A triangular double loop** ($j$ from $i+1$ to $n$) runs $\frac{n(n-1)}2$ times, which is still $O(n^2)$.
5. **A loop that halves or doubles its counter** runs $\log_2n$ times: ´while n > 1: n //= 2´ takes $\lfloor\log_2n\rfloor$ steps, and so does ´i *= 2´ while ´i < n´.
6. **A loop to $\sqrt n$** (´while i * i <= n´) runs $\lfloor\sqrt n\rfloor$ times.
7. **A recursive function** gives a recurrence, solved in the next sections; two recursive calls of size $n-1$ give $2^n$.
8. **A condition costs the more expensive branch**, when you want the worst case.

**Counting by experiment.** A good habit is to let the program count its own steps and to *double* $n$: if the count doubles the algorithm is linear; if it quadruples, quadratic; if it grows by a constant, logarithmic; if it multiplies by a little more than two, it is $n\log n$. The widget below runs twelve algorithms on a worst-case input, and the column of ratios shows exactly this.`,
            T`**Kamu menghitung langkah dasar, lalu hanya menyimpan suku yang tumbuh paling cepat.** Beberapa aturan mencakup kebanyakan kode:

1. **Operasi dasar berbiaya 1:** penugasan, perbandingan, operasi aritmetika, membaca elemen larik.
2. **Pernyataan berurutan menjumlahkan, dan yang terbesar menang:** perulangan $n$ langkah diikuti perulangan $n^2$ langkah adalah $O(n+n^2)=O(n^2)$.
3. **Perulangan mengalikan:** banyak iterasi kali biaya badannya. Dua perulangan bersarang atas $n$ berbiaya $n\cdot n=n^2$.
4. **Perulangan ganda segitiga** ($j$ dari $i+1$ sampai $n$) berjalan $\frac{n(n-1)}2$ kali, yang tetap $O(n^2)$.
5. **Perulangan yang membagi dua atau menggandakan penghitungnya** berjalan $\log_2n$ kali: ´while n > 1: n //= 2´ memerlukan $\lfloor\log_2n\rfloor$ langkah, demikian pula ´i *= 2´ selama ´i < n´.
6. **Perulangan sampai $\sqrt n$** (´while i * i <= n´) berjalan $\lfloor\sqrt n\rfloor$ kali.
7. **Fungsi rekursif** menghasilkan rekurensi, diselesaikan pada bagian berikutnya; dua panggilan rekursif berukuran $n-1$ memberi $2^n$.
8. **Kondisi berbiaya cabang yang lebih mahal**, bila kamu menginginkan kasus terburuk.

**Menghitung dengan percobaan.** Kebiasaan baik adalah membiarkan program menghitung langkahnya sendiri dan *menggandakan* $n$: jika hitungannya berlipat dua algoritmanya linear; jika berlipat empat, kuadratik; jika bertambah konstan, logaritmik; jika berlipat sedikit lebih dari dua, ia $n\log n$. Widget di bawah menjalankan dua belas algoritma pada masukan kasus terburuk, dan kolom rasio memperlihatkan persis hal ini.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: five loops and their classes', 'Python: lima perulangan dan kelasnya'),
          code: `def first(a):                 # O(1): one step, whatever the length
    return a[0]


def total(a):                 # O(n): one pass
    s = 0
    for x in a:
        s += x
    return s


def pairs(a):                 # O(n^2): n(n - 1)/2 pairs
    count = 0
    for i in range(len(a)):
        for j in range(i + 1, len(a)):
            count += 1
    return count


def powers(n):                # O(log n): i doubles until it passes n
    i = 1
    while i < n:
        i *= 2
    return i


def is_prime(n):              # O(sqrt n) divisions, but exponential in the number of digits of n
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return n > 1`,
        },
        { kind: 'widget', name: 'bigocounter' },
      ],
    },

    /* ------------------------------------------------------------------------------------ cases */
    {
      id: 'cases',
      heading: L('What are best, worst and average case, and amortized cost?', 'Apa itu kasus terbaik, terburuk, rata-rata, dan biaya teramortisasi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The same algorithm can cost different amounts on different inputs of the same size, so a complexity is always stated for a case: the best, the worst, or the average.** By default "the complexity" means the worst case, because it is a guarantee.

- **Linear search** for a value in a list of $n$: best $1$ comparison (the first element), worst $n$ (it is last or missing), average about $\frac{n+1}{2}$ if it is present and every position is equally likely. Best $\Theta(1)$, worst and average $\Theta(n)$.
- **Insertion sort:** best case $n-1$ comparisons (already sorted), worst case $\frac{n(n-1)}{2}$ (reversed). The same code is $O(n)$ or $O(n^2)$ depending on the input.
- **Quicksort:** average $O(n\log n)$, but $O(n^2)$ in the worst case, when the pivots are always the smallest or largest element.
- **A hash table lookup:** $O(1)$ on average and $O(n)$ if every key collides.

**Amortized cost.** Some operations are usually cheap and occasionally expensive, and what matters is the total over a long sequence. A dynamic array (a Python ´list´, a C++ ´vector´) doubles its capacity when it is full: the copies cost $1+2+4+\cdots+2^k<2\cdot2^k$, so $n$ appends cost fewer than $3n$ steps in all, and each append is $O(1)$ *amortized* although one of them costs $O(n)$.

**Space complexity** is the same idea for memory: merge sort needs $O(n)$ extra space, an in-place sort like heapsort $O(1)$, and a recursion of depth $d$ uses $O(d)$ stack. Big-O describes memory just as it describes time.

**Lower bounds.** $\Omega$ can show that no algorithm does better. Sorting by comparisons needs at least $\log_2(n!)\approx n\log_2n-1.44n$ comparisons, because the $n!$ possible orders must be told apart by yes-or-no answers, so $\Omega(n\log n)$; merge sort reaches it, and is therefore $\Theta(n\log n)$ and optimal among comparison sorts.`,
            T`**Algoritma yang sama dapat berbiaya berbeda pada masukan berbeda dengan ukuran yang sama, sehingga kompleksitas selalu dinyatakan untuk suatu kasus: terbaik, terburuk, atau rata-rata.** Secara bawaan "kompleksitas" berarti kasus terburuk, karena ia adalah jaminan.

- **Pencarian linear** sebuah nilai dalam daftar $n$: terbaik $1$ perbandingan (elemen pertama), terburuk $n$ (ia terakhir atau tidak ada), rata-rata sekitar $\frac{n+1}{2}$ jika ia ada dan setiap posisi sama mungkin. Terbaik $\Theta(1)$, terburuk dan rata-rata $\Theta(n)$.
- **Insertion sort:** kasus terbaik $n-1$ perbandingan (sudah terurut), kasus terburuk $\frac{n(n-1)}{2}$ (terbalik). Kode yang sama $O(n)$ atau $O(n^2)$ tergantung masukannya.
- **Quicksort:** rata-rata $O(n\log n)$, tetapi $O(n^2)$ pada kasus terburuk, ketika pivotnya selalu elemen terkecil atau terbesar.
- **Pencarian tabel hash:** $O(1)$ rata-rata dan $O(n)$ jika setiap kunci bertabrakan.

**Biaya teramortisasi.** Beberapa operasi biasanya murah dan sesekali mahal, dan yang penting adalah totalnya pada barisan panjang. Larik dinamis (´list´ Python, ´vector´ C++) menggandakan kapasitasnya ketika penuh: penyalinan berbiaya $1+2+4+\cdots+2^k<2\cdot2^k$, sehingga $n$ penambahan berbiaya kurang dari $3n$ langkah seluruhnya, dan setiap penambahan $O(1)$ *teramortisasi* walaupun salah satunya berbiaya $O(n)$.

**Kompleksitas ruang** adalah gagasan yang sama untuk memori: merge sort memerlukan ruang tambahan $O(n)$, pengurutan di tempat seperti heapsort $O(1)$, dan rekursi berkedalaman $d$ memakai tumpukan $O(d)$. Big-O menggambarkan memori seperti menggambarkan waktu.

**Batas bawah.** $\Omega$ dapat menunjukkan bahwa tidak ada algoritma yang lebih baik. Pengurutan dengan perbandingan memerlukan sedikitnya $\log_2(n!)\approx n\log_2n-1{,}44n$ perbandingan, karena $n!$ urutan yang mungkin harus dibedakan dengan jawaban ya atau tidak, sehingga $\Omega(n\log n)$; merge sort mencapainya, sehingga ia $\Theta(n\log n)$ dan optimal di antara pengurutan perbandingan.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------------------------- recurrences */
    {
      id: 'recurrences',
      heading: L('How do you solve the recurrence of a recursive algorithm?', 'Bagaimana menyelesaikan rekurensi sebuah algoritma rekursif?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**A recursive algorithm that splits a problem of size $n$ into $a$ subproblems of size $n/b$ and does $n^d$ work to split and combine has the cost $T(n)=aT(n/b)+n^d$, and the Master theorem solves it by comparing $d$ with $\log_ba$.**

**Merge sort, unrolled.** $T(n)=2T(n/2)+n$. The top level does $n$ work. The next level has $2$ problems of size $n/2$, doing $\frac n2$ each, again $n$ in all; the level after that has $4$ problems of size $\frac n4$, again $n$. Every level costs $n$, and there are $\log_2n$ levels (halving $n$ down to $1$), so $T(n)=n\log_2n+n=\Theta(n\log n)$.

**The Master theorem.** For $T(n)=aT(n/b)+\Theta(n^d)$ with $a\ge1$, $b>1$ and $d\ge0$, let $\rho=\frac{a}{b^d}$ be the ratio of the work on one level to the work on the level above:
- if $d>\log_ba$ ($\rho<1$) the work shrinks down the tree and the top dominates: $T(n)=\Theta(n^d)$;
- if $d=\log_ba$ ($\rho=1$) every level costs the same: $T(n)=\Theta(n^d\log n)$;
- if $d<\log_ba$ ($\rho>1$) the work grows down the tree and the leaves dominate: $T(n)=\Theta\left(n^{\log_ba}\right)$.

For $n=b^k$ the sum is exact: $T(b^k)=n^d\left(1+\rho+\rho^2+\cdots+\rho^k\right)$ when each leaf costs $1$, and the three cases are the three behaviors of a geometric series.

**Examples.**
- Binary search: $T(n)=T(n/2)+1$, so $a=1$, $b=2$, $d=0=\log_21$: $\Theta(\log n)$.
- Merge sort: $a=b=2$, $d=1=\log_22$: $\Theta(n\log n)$.
- Multiplying numbers by Karatsuba: $T(n)=3T(n/2)+n$, $d=1<\log_23\approx1.585$: $\Theta\left(n^{1.585}\right)$, better than the school method's $n^2$.
- Multiplying matrices by splitting into $8$ blocks: $T(n)=8T(n/2)+n^2$, $\log_28=3>2$: $\Theta(n^3)$; Strassen's trick with $7$ products, $\log_27\approx2.807$, gives $\Theta\left(n^{2.807}\right)$.
- Halving and then working $n$: $T(n)=T(n/2)+n$, $d=1>\log_21=0$: $\Theta(n)$.

Recurrences that do not have this shape need other methods. $T(n)=T(n-1)+n$ unrolls to $\frac{n(n+1)}{2}=\Theta(n^2)$, and $T(n)=T(n-1)+T(n-2)+1$, the calls of the naive Fibonacci function, grows like $\varphi^n$ with $\varphi=\frac{1+\sqrt5}2\approx1.618$.

Choose $a$, $b$ and $d$ below. The table computes $T(n)$ exactly for $n=b^k$ and divides it by the predicted growth: the last column settles on a constant.`,
            T`**Algoritma rekursif yang memecah masalah berukuran $n$ menjadi $a$ submasalah berukuran $n/b$ dan melakukan kerja $n^d$ untuk memecah dan menggabungkan memiliki biaya $T(n)=aT(n/b)+n^d$, dan teorema Master menyelesaikannya dengan membandingkan $d$ dengan $\log_ba$.**

**Merge sort, diurai.** $T(n)=2T(n/2)+n$. Tingkat teratas melakukan kerja $n$. Tingkat berikutnya punya $2$ masalah berukuran $n/2$, masing-masing $\frac n2$, lagi-lagi $n$ seluruhnya; tingkat sesudahnya punya $4$ masalah berukuran $\frac n4$, lagi-lagi $n$. Setiap tingkat berbiaya $n$, dan ada $\log_2n$ tingkat (membagi dua $n$ sampai $1$), sehingga $T(n)=n\log_2n+n=\Theta(n\log n)$.

**Teorema Master.** Untuk $T(n)=aT(n/b)+\Theta(n^d)$ dengan $a\ge1$, $b>1$, dan $d\ge0$, misalkan $\rho=\frac{a}{b^d}$ adalah rasio kerja pada satu tingkat terhadap kerja di tingkat di atasnya:
- jika $d>\log_ba$ ($\rho<1$) kerja menyusut ke bawah pohon dan puncaknya mendominasi: $T(n)=\Theta(n^d)$;
- jika $d=\log_ba$ ($\rho=1$) setiap tingkat berbiaya sama: $T(n)=\Theta(n^d\log n)$;
- jika $d<\log_ba$ ($\rho>1$) kerja membesar ke bawah pohon dan daun-daunnya mendominasi: $T(n)=\Theta\left(n^{\log_ba}\right)$.

Untuk $n=b^k$ jumlahnya eksak: $T(b^k)=n^d\left(1+\rho+\rho^2+\cdots+\rho^k\right)$ bila setiap daun berbiaya $1$, dan ketiga kasus adalah tiga perilaku deret geometri.

**Contoh.**
- Pencarian biner: $T(n)=T(n/2)+1$, sehingga $a=1$, $b=2$, $d=0=\log_21$: $\Theta(\log n)$.
- Merge sort: $a=b=2$, $d=1=\log_22$: $\Theta(n\log n)$.
- Perkalian bilangan dengan Karatsuba: $T(n)=3T(n/2)+n$, $d=1<\log_23\approx1{,}585$: $\Theta\left(n^{1{,}585}\right)$, lebih baik daripada $n^2$ cara sekolah.
- Perkalian matriks dengan membagi menjadi $8$ blok: $T(n)=8T(n/2)+n^2$, $\log_28=3>2$: $\Theta(n^3)$; trik Strassen dengan $7$ perkalian, $\log_27\approx2{,}807$, memberi $\Theta\left(n^{2{,}807}\right)$.
- Membagi dua lalu bekerja $n$: $T(n)=T(n/2)+n$, $d=1>\log_21=0$: $\Theta(n)$.

Rekurensi yang tidak berbentuk ini memerlukan metode lain. $T(n)=T(n-1)+n$ terurai menjadi $\frac{n(n+1)}{2}=\Theta(n^2)$, dan $T(n)=T(n-1)+T(n-2)+1$, banyaknya panggilan fungsi Fibonacci naif, tumbuh seperti $\varphi^n$ dengan $\varphi=\frac{1+\sqrt5}2\approx1{,}618$.

Pilih $a$, $b$, dan $d$ di bawah. Tabel menghitung $T(n)$ secara eksak untuk $n=b^k$ dan membaginya dengan pertumbuhan yang diramalkan: kolom terakhir menuju konstanta.`,
          ),
        },
        { kind: 'widget', name: 'bigorecur' },
      ],
    },

    /* -------------------------------------------------------------------------------- what it hides */
    {
      id: 'what-it-hides',
      heading: L('What does Big-O not tell you?', 'Apa yang tidak dikatakan Big-O?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Big-O compares growth for large $n$, so it says nothing about small inputs, constant factors, memory or the machine.**

- **Constants matter for small $n$.** $100n$ is $O(n)$ and $n^2$ is $O(n^2)$, yet $n^2<100n$ for every $n<100$. Real sorting libraries are hybrids: Python's and Java's sort (Timsort) use insertion sort, quadratic in the worst case, for short runs, because with a tiny constant it beats $n\log n$ methods below a few dozen elements.
- **Not all steps cost the same.** A step that misses the processor's cache can cost a hundred times a step that hits it. Two $O(n)$ loops, one reading memory in order and one jumping around, can differ by an order of magnitude.
- **What $n$ is.** $n$ is the size of the *input*, the number of bits or digits needed to write it, not its value. Trial division, ´while i * i <= n´, takes $O(\sqrt N)$ divisions to test the number $N$, but $N$ has $n=\log_2N$ bits (see [how many values bits can hold](article:binary-numbers#bits-and-bytes)), so the cost is $O\left(2^{n/2}\right)$: exponential in the size of the input, which is why testing a 600-digit number by trial division is hopeless.
- **Hidden costs of operations.** ´x in a_list´ is $O(n)$ but ´x in a_set´ is $O(1)$ on average; ´s += "a"´ on a string may copy the whole string; ´list.insert(0, x)´ shifts every element, $O(n)$, while ´list.append(x)´ is $O(1)$ amortized; ´sorted(a)´ is $O(n\log n)$.
- **Worst case may not be typical.** Quicksort's worst case is $n^2$ and nobody minds, because it almost never happens with a random pivot.

Use Big-O to choose between a $n^2$ and an $n\log n$ idea before writing code, and measurement to choose between two ideas of the same class.`,
            T`**Big-O membandingkan pertumbuhan untuk $n$ besar, sehingga ia tidak mengatakan apa pun tentang masukan kecil, faktor konstan, memori, atau mesin.**

- **Konstanta penting untuk $n$ kecil.** $100n$ adalah $O(n)$ dan $n^2$ adalah $O(n^2)$, namun $n^2<100n$ untuk setiap $n<100$. Pustaka pengurutan nyata berupa hibrida: pengurutan Python dan Java (Timsort) memakai insertion sort, kuadratik pada kasus terburuk, untuk bagian pendek, karena dengan konstanta yang sangat kecil ia mengalahkan metode $n\log n$ di bawah beberapa puluh elemen.
- **Tidak semua langkah berbiaya sama.** Langkah yang meleset dari cache prosesor dapat berbiaya seratus kali langkah yang mengenainya. Dua perulangan $O(n)$, satu membaca memori berurutan dan satu melompat-lompat, dapat berbeda satu orde besaran.
- **Apa itu $n$.** $n$ adalah ukuran *masukan*, banyaknya bit atau angka yang diperlukan untuk menuliskannya, bukan nilainya. Pembagian coba-coba, ´while i * i <= n´, memerlukan $O(\sqrt N)$ pembagian untuk menguji bilangan $N$, tetapi $N$ memiliki $n=\log_2N$ bit (lihat [berapa nilai yang dapat dimuat bit](article:binary-numbers#bits-and-bytes)), sehingga biayanya $O\left(2^{n/2}\right)$: eksponensial terhadap ukuran masukan, itulah sebabnya menguji bilangan 600 angka dengan pembagian coba-coba tidak ada harapan.
- **Biaya tersembunyi operasi.** ´x in a_list´ adalah $O(n)$ tetapi ´x in a_set´ adalah $O(1)$ rata-rata; ´s += "a"´ pada string dapat menyalin seluruh string; ´list.insert(0, x)´ menggeser setiap elemen, $O(n)$, sedangkan ´list.append(x)´ adalah $O(1)$ teramortisasi; ´sorted(a)´ adalah $O(n\log n)$.
- **Kasus terburuk mungkin tidak lazim.** Kasus terburuk quicksort adalah $n^2$ dan tidak ada yang keberatan, karena ia hampir tidak pernah terjadi dengan pivot acak.

Pakai Big-O untuk memilih antara gagasan $n^2$ dan $n\log n$ sebelum menulis kode, dan pengukuran untuk memilih antara dua gagasan yang sekelas.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- in code */
    {
      id: 'big-o-in-code',
      heading: L('How do you measure complexity in code?', 'Bagaimana mengukur kompleksitas dalam kode?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Count the steps instead of timing them: a counter is exact, repeatable and independent of the computer.** The programs below count the comparisons of linear search, binary search and bubble sort for inputs of $250$, $500$ and $1000$ elements, the calls of the Fibonacci function with and without a memo, and the iterations of a double loop and of a halving loop. Doubling $n$ adds one to the binary search, doubles the linear search and quadruples the bubble sort.`,
            T`**Hitung langkahnya, jangan mengukur waktunya: penghitung itu eksak, dapat diulang, dan tidak bergantung pada komputer.** Program di bawah menghitung perbandingan pencarian linear, pencarian biner, dan bubble sort untuk masukan $250$, $500$, dan $1000$ elemen, panggilan fungsi Fibonacci dengan dan tanpa memo, dan iterasi perulangan ganda dan perulangan pembagian dua. Menggandakan $n$ menambah satu pada pencarian biner, melipatduakan pencarian linear, dan melipatempatkan bubble sort.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: count the steps of five algorithms', 'Python: hitung langkah lima algoritma'),
          code: `def linear(a, target):
    """Comparisons made while looking for target in a list."""
    steps = 0
    for x in a:
        steps += 1
        if x == target:
            break
    return steps


def binary(a, target):
    """Comparisons made by binary search in a sorted list."""
    lo, hi, steps = 0, len(a) - 1, 0
    while lo <= hi:
        steps += 1
        mid = (lo + hi) // 2
        if a[mid] == target:
            return steps
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return steps


def bubble(a):
    """Comparisons made by bubble sort."""
    a, steps = list(a), 0
    for i in range(len(a) - 1):
        for j in range(len(a) - 1 - i):
            steps += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return steps


def fib_calls(n, memo=None):
    """Calls made by fib(n), without and with a dictionary of known values."""
    calls = 0

    def fib(k, known):
        nonlocal calls
        calls += 1
        if k < 2:
            return k
        if known is not None and k in known:
            return known[k]
        value = fib(k - 1, known) + fib(k - 2, known)
        if known is not None:
            known[k] = value
        return value

    fib(n, memo)
    return calls


for n in (250, 500, 1000):
    a = list(range(n))
    print(n, linear(a, -1), binary(a, -1), bubble(a[::-1]))
print(fib_calls(20), fib_calls(20, {}))
print(2 ** 100 / 1e9 / (365.25 * 24 * 3600))
# 250 250 7 31125
# 500 500 8 124750
# 1000 1000 9 499500
# 21891 39
# 40169423537538.64`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: a step counter and the doubling test', 'JavaScript: penghitung langkah dan uji penggandaan'),
          code: `const count = (f, n) => {
  let steps = 0
  f(n, () => steps++)
  return steps
}
const pairs = (n, tick) => { for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) tick() }
const halving = (n, tick) => { while (n > 1) { n = Math.floor(n / 2); tick() } }
const subsets = (n, tick) => { const go = (i) => { if (i === n) return tick(); go(i + 1); go(i + 1) }; go(0) }
const c = [1000, 2000, 4000].map((n) => count(pairs, n))
c                                           // [499500, 1999000, 7998000]
c.map((v, i) => (i ? v / c[i - 1] : null))  // [null, 4.002..., 4.001...]: doubling n quadruples a quadratic count
;[1e3, 1e6, 1e9].map((n) => count(halving, n))   // [9, 19, 29]: a thousand times more input adds about 10 steps
;[10, 14, 18].map((n) => count(subsets, n))      // [1024, 16384, 262144]: four more elements, sixteen times the work`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: a double loop and a halving loop', 'C++: perulangan ganda dan perulangan pembagian dua'),
          code: `#include <iostream>
#include <cstdio>
using namespace std;

int main() {
  for (int n = 100; n <= 400; n = n * 2) {
    int pairs = 0;
    for (int i = 0; i < n; i++)
      for (int j = i + 1; j < n; j++) pairs++;           // n(n - 1)/2 steps
    int halves = 0;
    for (int m = n; m > 1; m = m / 2) halves++;          // about log2(n) steps
    printf("%d %d %d\\n", n, pairs, halves);
  }
  return 0;
}

/* output:
100 4950 6
200 19900 7
400 79800 8
*/`,
        },
      ],
    },

    /* --------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does Big-O notation come from?', 'Dari mana notasi Big-O berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Big-O began in number theory, long before computers, as a way to say how big an error term is.**

- **1894.** The German mathematician Paul Bachmann introduced the letter $O$ in his book on analytic number theory, for the *Ordnung*, the order, of a term.
- **1909.** Edmund Landau used it and added the small $o$ ("grows strictly slower"), and the notation is still often called Landau's.
- **1914.** G. H. Hardy and J. E. Littlewood introduced $\Omega$ for a lower bound on growth.
- **1965.** Juris Hartmanis and Richard Stearns published *On the computational complexity of algorithms*, which measured the time of a computation and founded computational complexity theory.
- **1968 and 1976.** Donald Knuth used $O$ for the analysis of algorithms in *The Art of Computer Programming*, and in 1976 redefined $\Omega$ and introduced $\Theta$ as the tight bound, giving the three symbols the meaning they have in computer science today.
- **1971–1972.** Stephen Cook and Richard Karp defined NP-completeness, the question of which problems can be solved in polynomial time at all: the line between $O(n^k)$ and exponential that this article drew in the table of growth rates.`,
            T`**Big-O bermula dalam teori bilangan, jauh sebelum komputer, sebagai cara menyatakan seberapa besar suku galat.**

- **1894.** Matematikawan Jerman Paul Bachmann memperkenalkan huruf $O$ dalam bukunya tentang teori bilangan analitik, untuk *Ordnung*, orde, sebuah suku.
- **1909.** Edmund Landau memakainya dan menambahkan $o$ kecil ("tumbuh jauh lebih lambat"), dan notasi itu masih sering disebut notasi Landau.
- **1914.** G. H. Hardy dan J. E. Littlewood memperkenalkan $\Omega$ untuk batas bawah pertumbuhan.
- **1965.** Juris Hartmanis dan Richard Stearns menerbitkan *On the computational complexity of algorithms*, yang mengukur waktu suatu komputasi dan mendirikan teori kompleksitas komputasi.
- **1968 dan 1976.** Donald Knuth memakai $O$ untuk analisis algoritma dalam *The Art of Computer Programming*, dan pada 1976 mendefinisikan ulang $\Omega$ dan memperkenalkan $\Theta$ sebagai batas ketat, memberi ketiga lambang itu arti yang mereka miliki dalam ilmu komputer sekarang.
- **1971–1972.** Stephen Cook dan Richard Karp mendefinisikan NP-lengkap, pertanyaan masalah mana yang dapat diselesaikan dalam waktu polinomial sama sekali: garis antara $O(n^k)$ dan eksponensial yang digambar artikel ini dalam tabel laju pertumbuhan.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with Big-O?', 'Kesalahan apa yang sering terjadi pada Big-O?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with Big-O are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ Big-O is the running time in seconds | It is the growth of the number of steps with the input size; the seconds depend on the machine. |
| ❌ Keep the constants: $O(3n^2)$ | Constants and lower terms are dropped: $O(3n^2+5n)=O(n^2)$. |
| ❌ An $O(n)$ algorithm is always faster than an $O(n^2)$ one | Only for large $n$: $n^2<100n$ for $n<100$. |
| ❌ Two loops one after the other cost $O(n^2)$ | Sequential loops add, $O(n)+O(n)=O(n)$; only nested loops multiply. |
| ❌ Every nested loop is $O(n^2)$ | It depends on the inner count: an inner loop that doubles its counter costs $\log n$, so the pair is $O(n\log n)$. |
| ❌ Say "linear search is $O(n^2)$" | True and useless: give the tight bound, $\Theta(n)$ in the worst case. |
| ❌ Quote the best case | The guarantee is the worst case, and the average case must say which inputs it averages over. |
| ❌ $n$ is the number in the input | $n$ is the size of the input: for a number $N$ it is the number of digits, so trial division is exponential. |
| ❌ Forget the cost of the operations inside | ´x in a_list´, string concatenation and ´insert(0, x)´ are $O(n)$ each, inside a loop. |`,
            T`**Kesalahan paling umum pada Big-O adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Big-O adalah waktu jalan dalam detik | Ia adalah pertumbuhan banyaknya langkah menurut ukuran masukan; detiknya bergantung pada mesin. |
| ❌ Menyimpan konstanta: $O(3n^2)$ | Konstanta dan suku rendah dibuang: $O(3n^2+5n)=O(n^2)$. |
| ❌ Algoritma $O(n)$ selalu lebih cepat daripada $O(n^2)$ | Hanya untuk $n$ besar: $n^2<100n$ untuk $n<100$. |
| ❌ Dua perulangan berurutan berbiaya $O(n^2)$ | Perulangan berurutan menjumlahkan, $O(n)+O(n)=O(n)$; hanya perulangan bersarang yang mengalikan. |
| ❌ Setiap perulangan bersarang adalah $O(n^2)$ | Tergantung banyaknya yang dalam: perulangan dalam yang menggandakan penghitungnya berbiaya $\log n$, sehingga pasangannya $O(n\log n)$. |
| ❌ Mengatakan "pencarian linear adalah $O(n^2)$" | Benar dan tidak berguna: beri batas ketat, $\Theta(n)$ pada kasus terburuk. |
| ❌ Mengutip kasus terbaik | Jaminannya adalah kasus terburuk, dan kasus rata-rata harus menyebut masukan mana yang dirata-ratakan. |
| ❌ $n$ adalah bilangan dalam masukan | $n$ adalah ukuran masukan: untuk bilangan $N$ ia adalah banyaknya angka, sehingga pembagian coba-coba bersifat eksponensial. |
| ❌ Melupakan biaya operasi di dalamnya | ´x in a_list´, penyambungan string, dan ´insert(0, x)´ masing-masing $O(n)$, di dalam perulangan. |`,
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
              L(T`$5n+3$ is $O(n)$.`, T`$5n+3$ adalah $O(n)$.`),
              L(T`$n^2$ is $O(n)$.`, T`$n^2$ adalah $O(n)$.`),
              L(T`$O(n)$ is an upper bound, so an $O(n)$ algorithm is also $O(n^2)$.`, T`$O(n)$ adalah batas atas, sehingga algoritma $O(n)$ juga $O(n^2)$.`),
              L(T`An $O(n^2)$ algorithm is always slower than an $O(n)$ one.`, T`Algoritma $O(n^2)$ selalu lebih lambat daripada yang $O(n)$.`),
              L(T`Constant factors are dropped in Big-O.`, T`Faktor konstan dibuang dalam Big-O.`),
              L(T`$\Theta(g)$ is both an upper and a lower bound.`, T`$\Theta(g)$ adalah batas atas sekaligus batas bawah.`),
            ],
            answer: [true, false, true, false, true, true],
            explain: L(
              T`$n^2$ grows faster than $cn$ for any $c$. An upper bound can be loose. For small $n$ a quadratic algorithm with a small constant beats a linear one with a large constant.`,
              T`$n^2$ tumbuh lebih cepat daripada $cn$ untuk $c$ mana pun. Batas atas boleh longgar. Untuk $n$ kecil algoritma kuadratik dengan konstanta kecil mengalahkan yang linear dengan konstanta besar.`,
            ),
            hint: L(T`Recall the definition with $c$ and $n_0$.`, T`Ingat definisi dengan $c$ dan $n_0$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Which statements are true for $f(n)=5n+3$? Choose **all** that apply.`, T`Pernyataan mana yang benar untuk $f(n)=5n+3$? Pilih **semua** yang benar.`),
            options: [
              L(T`$f=O(n)$`, T`$f=O(n)$`),
              L(T`$f=O(n^2)$`, T`$f=O(n^2)$`),
              L(T`$f=O(\log n)$`, T`$f=O(\log n)$`),
              L(T`$f=\Omega(n)$`, T`$f=\Omega(n)$`),
              L(T`$f=\Theta(n^2)$`, T`$f=\Theta(n^2)$`),
            ],
            answer: [0, 1, 3],
            explain: L(T`$f$ is $\Theta(n)$, so it is $O(n)$, $\Omega(n)$ and also $O(n^2)$. It grows faster than $\log n$, so it is not $O(\log n)$, and slower than $n^2$, so it is not $\Theta(n^2)$.`, T`$f$ adalah $\Theta(n)$, sehingga ia $O(n)$, $\Omega(n)$, dan juga $O(n^2)$. Ia tumbuh lebih cepat daripada $\log n$, sehingga bukan $O(\log n)$, dan lebih lambat daripada $n^2$, sehingga bukan $\Theta(n^2)$.`),
            hint: L(T`It is a straight line: $\Theta(n)$.`, T`Ia garis lurus: $\Theta(n)$.`),
          },
        },
        {
          kind: 'activity',
          title: L('A threshold', 'Sebuah ambang'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`$2n+10\le3n$ means $10\le n$.`, T`$2n+10\le3n$ berarti $10\le n$.`), L(T`The smallest such integer is $10$.`, T`Bilangan bulat terkecil seperti itu adalah $10$.`)],
            explain: L(T`$2n+10\le3n\iff n\ge10$, so with $c=3$ the witness is $n_0=10$.`, T`$2n+10\le3n\iff n\ge10$, sehingga dengan $c=3$ saksinya $n_0=10$.`),
            prompt: L(T`With $c=3$, what is the smallest $n_0$ such that $2n+10\le3n$ for all $n\ge n_0$?`, T`Dengan $c=3$, berapa $n_0$ terkecil sehingga $2n+10\le3n$ untuk semua $n\ge n_0$?`),
            given: String.raw`n_0=v`,
            blanks: [{ label: 'n₀ =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('Count a double loop', 'Hitung perulangan ganda'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`The inner loop runs $i$ times for each $i$ from $0$ to $n-1$.`, T`Perulangan dalam berjalan $i$ kali untuk setiap $i$ dari $0$ sampai $n-1$.`), L(T`$0+1+\cdots+9=\frac{9\cdot10}{2}$.`, T`$0+1+\cdots+9=\frac{9\cdot10}{2}$.`)],
            explain: L(T`$\frac{n(n-1)}{2}=\frac{10\cdot9}{2}=45$ iterations, which is $O(n^2)$.`, T`$\frac{n(n-1)}{2}=\frac{10\cdot9}{2}=45$ iterasi, yaitu $O(n^2)$.`),
            prompt: L(T`How many times does the body run for ´n = 10´ in ´for i in range(n): for j in range(i): body´?`, T`Berapa kali badan berjalan untuk ´n = 10´ pada ´for i in range(n): for j in range(i): body´?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 45 }],
          },
        },
        {
          kind: 'activity',
          title: L('A doubling loop', 'Perulangan penggandaan'),
          step: {
            kind: 'quiz',
            id: 'p5',
            prompt: L(T`What is the complexity of ´i = 1; while i < n: i *= 2´?`, T`Berapa kompleksitas ´i = 1; while i < n: i *= 2´?`),
            options: [
              L(T`$O(\log n)$, since $i$ doubles`, T`$O(\log n)$, karena $i$ berlipat dua`),
              L(T`$O(n)$`, T`$O(n)$`),
              L(T`$O(n^2)$`, T`$O(n^2)$`),
              L(T`$O(1)$`, T`$O(1)$`),
            ],
            answer: 0,
            explain: L(T`After $k$ steps $i=2^k$, and the loop stops when $2^k\ge n$, that is after $\lceil\log_2n\rceil$ steps.`, T`Setelah $k$ langkah $i=2^k$, dan perulangan berhenti ketika $2^k\ge n$, yaitu setelah $\lceil\log_2n\rceil$ langkah.`),
            hint: L(T`How many doublings take $1$ up to $n$?`, T`Berapa kali penggandaan membawa $1$ sampai $n$?`),
          },
        },
        {
          kind: 'activity',
          title: L('Binary search', 'Pencarian biner'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`Each step halves the interval: $1000\to500\to250\to\cdots$`, T`Setiap langkah membagi dua selang: $1000\to500\to250\to\cdots$`), L(T`$\lfloor\log_21000\rfloor+1=9+1$.`, T`$\lfloor\log_21000\rfloor+1=9+1$.`)],
            explain: L(T`At most $\lfloor\log_2n\rfloor+1=\lfloor9.97\rfloor+1=10$ comparisons.`, T`Paling banyak $\lfloor\log_2n\rfloor+1=\lfloor9{,}97\rfloor+1=10$ perbandingan.`),
            prompt: L(T`What is the largest number of comparisons binary search needs in a sorted list of $1000$ elements?`, T`Berapa banyak perbandingan terbanyak yang diperlukan pencarian biner dalam daftar terurut $1000$ elemen?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 10 }],
          },
        },
        {
          kind: 'activity',
          title: L('Sequence of loops', 'Barisan perulangan'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L(T`A function runs a loop of $n$ steps, and then a nested double loop of $n^2$ steps. What is its complexity?`, T`Sebuah fungsi menjalankan perulangan $n$ langkah, lalu perulangan ganda bersarang $n^2$ langkah. Berapa kompleksitasnya?`),
            options: [
              L(T`$O(n^2)$: the sum is dominated by the larger term`, T`$O(n^2)$: jumlahnya didominasi suku yang lebih besar`),
              L(T`$O(n^3)$: the costs multiply`, T`$O(n^3)$: biayanya dikalikan`),
              L(T`$O(n)$`, T`$O(n)$`),
              L(T`$O(n+n^2)$ and nothing simpler`, T`$O(n+n^2)$ dan tidak ada yang lebih sederhana`),
            ],
            answer: 0,
            explain: L(T`Sequential parts add: $n+n^2=O(n^2)$. Only nested parts multiply.`, T`Bagian berurutan menjumlahkan: $n+n^2=O(n^2)$. Hanya bagian bersarang yang mengalikan.`),
            hint: L(T`One loop is after the other, not inside it.`, T`Satu perulangan ada sesudah yang lain, bukan di dalamnya.`),
          },
        },
        {
          kind: 'activity',
          title: L('Unroll a recurrence', 'Uraikan sebuah rekurensi'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`$T(2)=2T(1)+2=4$ and $T(4)=2T(2)+4=12$.`, T`$T(2)=2T(1)+2=4$ dan $T(4)=2T(2)+4=12$.`), L(T`$T(8)=2T(4)+8$.`, T`$T(8)=2T(4)+8$.`)],
            explain: L(T`$T(8)=2\cdot12+8=32$, which equals $n\log_2n+n=24+8$.`, T`$T(8)=2\cdot12+8=32$, yang sama dengan $n\log_2n+n=24+8$.`),
            prompt: L(T`If $T(n)=2T(n/2)+n$ and $T(1)=1$, what is $T(8)$?`, T`Jika $T(n)=2T(n/2)+n$ dan $T(1)=1$, berapa $T(8)$?`),
            given: String.raw`T(8)=v`,
            blanks: [{ label: 'T(8) =', answer: 32 }],
          },
        },
        {
          kind: 'activity',
          title: L('The Master theorem', 'Teorema Master'),
          step: {
            kind: 'quiz',
            id: 'p9',
            prompt: L(T`What is the solution of $T(n)=4T(n/2)+n$?`, T`Apa solusi $T(n)=4T(n/2)+n$?`),
            options: [
              L(T`$\Theta(n^2)$, since $d=1<\log_24=2$ and the leaves dominate`, T`$\Theta(n^2)$, karena $d=1<\log_24=2$ dan daun-daunnya mendominasi`),
              L(T`$\Theta(n\log n)$`, T`$\Theta(n\log n)$`),
              L(T`$\Theta(n)$`, T`$\Theta(n)$`),
              L(T`$\Theta(n^3)$`, T`$\Theta(n^3)$`),
            ],
            answer: 0,
            explain: L(T`$a=4$, $b=2$, $d=1$. Since $\log_ba=2>d$, the number of leaves $n^2$ dominates.`, T`$a=4$, $b=2$, $d=1$. Karena $\log_ba=2>d$, banyaknya daun $n^2$ mendominasi.`),
            hint: L(T`Compare $d$ with $\log_ba$.`, T`Bandingkan $d$ dengan $\log_ba$.`),
          },
        },
        {
          kind: 'activity',
          title: L('Small inputs', 'Masukan kecil'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`For $n=50$, which is smaller: $100n$ steps or $n^2$ steps?`, T`Untuk $n=50$, mana yang lebih kecil: $100n$ langkah atau $n^2$ langkah?`),
            options: [
              L(T`$n^2=2500$ is smaller than $100n=5000$`, T`$n^2=2500$ lebih kecil daripada $100n=5000$`),
              L(T`$100n$ is smaller, since it is linear`, T`$100n$ lebih kecil, karena ia linear`),
              L(T`they are equal`, T`keduanya sama`),
              L(T`it cannot be said without the machine`, T`tidak dapat dikatakan tanpa mesinnya`),
            ],
            answer: 0,
            explain: L(T`Big-O is about large $n$. The curves cross at $n=100$, and below it the quadratic one is smaller.`, T`Big-O membahas $n$ besar. Kurvanya berpotongan di $n=100$, dan di bawahnya yang kuadratik lebih kecil.`),
            hint: L(T`Compute both numbers.`, T`Hitung kedua bilangan itu.`),
          },
        },
        {
          kind: 'activity',
          title: L('How big can n be?', 'Seberapa besar n boleh?'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L(T`Solve $n^2\le10^9$.`, T`Selesaikan $n^2\le10^9$.`), L(T`$\sqrt{10^9}\approx31622.78$.`, T`$\sqrt{10^9}\approx31622{,}78$.`)],
            explain: L(T`$\lfloor\sqrt{10^9}\rfloor=31622$: a quadratic algorithm handles about $31\,622$ elements in a second.`, T`$\lfloor\sqrt{10^9}\rfloor=31622$: algoritma kuadratik menangani sekitar $31\,622$ elemen dalam satu detik.`),
            prompt: L(T`At $10^9$ steps a second, what is the largest $n$ for which an $n^2$ algorithm finishes in one second?`, T`Pada $10^9$ langkah per detik, berapa $n$ terbesar yang membuat algoritma $n^2$ selesai dalam satu detik?`),
            given: String.raw`n=v`,
            blanks: [{ label: 'n =', answer: 31622 }],
          },
        },
        {
          kind: 'activity',
          title: L('Amortized cost', 'Biaya teramortisasi'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`Why is appending to a dynamic array $O(1)$ amortized although a single append may copy the whole array?`, T`Mengapa menambah ke larik dinamis adalah $O(1)$ teramortisasi walaupun satu penambahan dapat menyalin seluruh larik?`),
            options: [
              L(T`the capacity doubles, so the copies total less than $2n$ over $n$ appends`, T`kapasitas berlipat dua, sehingga salinan totalnya kurang dari $2n$ pada $n$ penambahan`),
              L(T`copying is free`, T`penyalinan gratis`),
              L(T`the array never grows`, T`larik tidak pernah tumbuh`),
              L(T`it is not $O(1)$, it is $O(n)$ every time`, T`ia bukan $O(1)$, ia $O(n)$ setiap kali`),
            ],
            answer: 0,
            explain: L(T`Copies cost $1+2+4+\cdots<2n$ in all, spread over $n$ appends: a constant per append on average.`, T`Salinan berbiaya $1+2+4+\cdots<2n$ seluruhnya, tersebar pada $n$ penambahan: konstanta per penambahan rata-rata.`),
            hint: L(T`Add up the sizes of all the copies.`, T`Jumlahkan ukuran semua salinan.`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: Big-O notation at a glance', 'Ringkasan: notasi Big-O sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Definition:** $f=O(g)$ if $f(n)\le c\,g(n)$ for all $n\ge n_0$; $\Omega$ is the lower bound, $\Theta$ the tight one.
- **Drop** constants and lower terms: $3n^2+5n+7=O(n^2)$.
- **Order:** $1\ll\log n\ll\sqrt n\ll n\ll n\log n$ $\ll n^2\ll n^3\ll2^n\ll n!$; the class matters more than the machine.
- **Counting:** sequence adds, loops multiply, halving gives $\log n$, recursion gives a recurrence; double $n$ and watch the ratio.
- **Cases:** state best, worst or average; amortized cost spreads rare expensive steps over many cheap ones.
- **Master theorem:** $T(n)=aT(n/b)+n^d$ compares $d$ with $\log_ba$: $\Theta(n^d)$, $\Theta(n^d\log n)$ or $\Theta(n^{\log_ba})$.
- **Limits of Big-O:** constants for small $n$, memory, the size of the input is its digits, and hidden costs of operations.
- **Next:** a search or a sort with its steps counted.
- **Code:** count steps with a counter instead of timing.`,
            T`- **Definisi:** $f=O(g)$ jika $f(n)\le c\,g(n)$ untuk semua $n\ge n_0$; $\Omega$ batas bawah, $\Theta$ yang ketat.
- **Buang** konstanta dan suku rendah: $3n^2+5n+7=O(n^2)$.
- **Urutan:** $1\ll\log n\ll\sqrt n\ll n\ll n\log n$ $\ll n^2\ll n^3\ll2^n\ll n!$; kelas lebih penting daripada mesin.
- **Menghitung:** urutan menjumlahkan, perulangan mengalikan, pembagian dua memberi $\log n$, rekursi memberi rekurensi; gandakan $n$ dan lihat rasionya.
- **Kasus:** sebut terbaik, terburuk, atau rata-rata; biaya teramortisasi menyebarkan langkah mahal yang jarang ke banyak langkah murah.
- **Teorema Master:** $T(n)=aT(n/b)+n^d$ membandingkan $d$ dengan $\log_ba$: $\Theta(n^d)$, $\Theta(n^d\log n)$, atau $\Theta(n^{\log_ba})$.
- **Batas Big-O:** konstanta untuk $n$ kecil, memori, ukuran masukan adalah angkanya, dan biaya tersembunyi operasi.
- **Berikutnya:** pencarian atau pengurutan dengan langkah yang dihitung.
- **Kode:** hitung langkah dengan penghitung, jangan mengukur waktu.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Big-O notation', 'Notasi Big-O'), definition: L('A way of saying that a function grows no faster than another, up to a constant factor and for large inputs.', 'Cara menyatakan bahwa suatu fungsi tumbuh tidak lebih cepat daripada fungsi lain, sampai faktor konstan dan untuk masukan besar.') },
    { term: L('Time complexity', 'Kompleksitas waktu'), definition: L('The number of basic steps an algorithm takes, as a function of the size of its input.', 'Banyaknya langkah dasar yang diambil sebuah algoritma, sebagai fungsi ukuran masukannya.') },
    { term: L('Big Theta', 'Big Theta'), definition: L('A tight bound: a function is both bounded above and bounded below by constant multiples of the same function.', 'Batas ketat: suatu fungsi dibatasi dari atas dan dari bawah oleh kelipatan konstan dari fungsi yang sama.') },
    { term: L('Worst case', 'Kasus terburuk'), definition: L('The input of a given size on which an algorithm takes the most steps, which gives a guarantee.', 'Masukan berukuran tertentu yang membuat algoritma mengambil langkah terbanyak, yang memberi jaminan.') },
    { term: L('Amortized cost', 'Biaya teramortisasi'), definition: L('The average cost per operation over a long sequence, when expensive operations are rare and cheap ones are common.', 'Biaya rata-rata per operasi pada barisan panjang, ketika operasi mahal jarang dan operasi murah sering.') },
    { term: L('Recurrence relation', 'Relasi rekurensi'), definition: L('An equation that gives the cost of a problem of size n in terms of the cost of smaller problems.', 'Persamaan yang memberi biaya masalah berukuran n dalam biaya masalah yang lebih kecil.') },
    { term: L('Master theorem', 'Teorema Master'), definition: L('A rule for solving recurrences of the form T(n) = aT(n/b) + n to the d by comparing d with the logarithm of a in base b.', 'Aturan untuk menyelesaikan rekurensi berbentuk T(n) = aT(n/b) + n pangkat d dengan membandingkan d dengan logaritma a berbasis b.') },
    { term: L('Space complexity', 'Kompleksitas ruang'), definition: L('The amount of extra memory an algorithm needs, as a function of the size of its input.', 'Banyaknya memori tambahan yang diperlukan sebuah algoritma, sebagai fungsi ukuran masukannya.') },
  ],

  howTo: [
    {
      name: L('How to find the Big-O of a function', 'Cara mencari Big-O sebuah fungsi'),
      description: L('Count the basic steps, then keep the fastest-growing term and drop its constant.', 'Hitung langkah dasar, lalu simpan suku yang tumbuh paling cepat dan buang konstantanya.'),
      steps: [
        { name: L('Count the steps', 'Hitung langkahnya'), text: L('Count the basic operations as a function of the input size n, treating loops as multiplication and statements in sequence as addition.', 'Hitung operasi dasar sebagai fungsi ukuran masukan n, dengan memperlakukan perulangan sebagai perkalian dan pernyataan berurutan sebagai penjumlahan.') },
        { name: L('Pick the fastest term', 'Pilih suku tercepat'), text: L('Keep the term that grows fastest, since it dominates for large n.', 'Simpan suku yang tumbuh paling cepat, karena ia mendominasi untuk n besar.') },
        { name: L('Drop the constant', 'Buang konstantanya'), text: L('Remove the constant factor in front of that term.', 'Hapus faktor konstan di depan suku itu.') },
        { name: L('Check with a witness', 'Periksa dengan saksi'), text: L('If you want a proof, find constants c and n zero so that the function is at most c times the bound for all n from n zero.', 'Jika ingin bukti, cari konstanta c dan n nol sehingga fungsi paling banyak c kali batasnya untuk semua n mulai dari n nol.') },
      ],
    },
    {
      name: L('How to solve a divide-and-conquer recurrence', 'Cara menyelesaikan rekurensi bagi-dan-taklukkan'),
      description: L('Identify a, b and d in T(n) = aT(n/b) + n to the d and compare d with the logarithm of a in base b.', 'Tentukan a, b, dan d pada T(n) = aT(n/b) + n pangkat d dan bandingkan d dengan logaritma a berbasis b.'),
      steps: [
        { name: L('Read off a, b and d', 'Baca a, b, dan d'), text: L('The algorithm makes a recursive calls on pieces of size n over b and does n to the d work to split and combine.', 'Algoritma membuat a panggilan rekursif pada bagian berukuran n per b dan melakukan kerja n pangkat d untuk memecah dan menggabungkan.') },
        { name: L('Compute the critical exponent', 'Hitung eksponen kritis'), text: L('Compute the logarithm of a in base b.', 'Hitung logaritma a berbasis b.') },
        { name: L('Compare', 'Bandingkan'), text: L('If d is larger the top level dominates, if they are equal every level counts equally, and if d is smaller the leaves dominate.', 'Jika d lebih besar tingkat teratas mendominasi, jika sama setiap tingkat sama pentingnya, dan jika d lebih kecil daun-daunnya mendominasi.') },
        { name: L('State the result', 'Nyatakan hasilnya'), text: L('Write n to the d, n to the d times log n, or n to the log of a, accordingly.', 'Tulis n pangkat d, n pangkat d kali log n, atau n pangkat log a, sesuai kasusnya.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is Big-O notation?', 'Apa itu notasi Big-O?'),
      a: L(
        'It is a way to describe how the number of steps of an algorithm grows with the size of its input, ignoring constant factors and smaller terms. Saying an algorithm is O of n squared means its steps grow at most like n squared.',
        'Itu adalah cara menggambarkan bagaimana banyaknya langkah sebuah algoritma tumbuh menurut ukuran masukannya, dengan mengabaikan faktor konstan dan suku yang lebih kecil. Mengatakan algoritma O dari n kuadrat berarti langkahnya tumbuh paling banyak seperti n kuadrat.',
      ),
    },
    {
      q: L('How do you calculate time complexity?', 'Bagaimana menghitung kompleksitas waktu?'),
      a: L(
        'Count the basic operations as a function of the input size. Statements in sequence add, loops and nested loops multiply, and a loop that halves its counter runs log n times. Then keep only the fastest-growing term and drop its constant.',
        'Hitung operasi dasar sebagai fungsi ukuran masukan. Pernyataan berurutan menjumlahkan, perulangan dan perulangan bersarang mengalikan, dan perulangan yang membagi dua penghitungnya berjalan log n kali. Lalu simpan hanya suku yang tumbuh paling cepat dan buang konstantanya.',
      ),
    },
    {
      q: L('What is the difference between O, Omega and Theta?', 'Apa beda O, Omega, dan Theta?'),
      a: L(
        'Big O is an upper bound on growth, Omega is a lower bound, and Theta is both, a tight bound. Linear search is O of n and also O of n squared, but only the first is tight; in the worst case it is Theta of n.',
        'Big O adalah batas atas pertumbuhan, Omega batas bawah, dan Theta keduanya, batas ketat. Pencarian linear adalah O dari n dan juga O dari n kuadrat, tetapi hanya yang pertama ketat; pada kasus terburuk ia Theta dari n.',
      ),
    },
    {
      q: L('Why is binary search O(log n)?', 'Mengapa pencarian biner O(log n)?'),
      a: L(
        'Each comparison halves the interval that can still hold the target. A list of n elements can be halved only about log base 2 of n times before one element is left, so a list of a thousand needs at most ten comparisons.',
        'Setiap perbandingan membagi dua selang yang masih dapat memuat target. Daftar n elemen hanya dapat dibagi dua sekitar log basis 2 dari n kali sebelum tersisa satu elemen, sehingga daftar seribu memerlukan paling banyak sepuluh perbandingan.',
      ),
    },
    {
      q: L('Why is merge sort O(n log n)?', 'Mengapa merge sort O(n log n)?'),
      a: L(
        'It splits the list in half about log n times, and every level of the splitting does a total of about n work to merge the pieces. So the cost is n for each of log n levels, which is n log n in all cases.',
        'Ia membagi daftar menjadi dua sekitar log n kali, dan setiap tingkat pembagian melakukan kerja total sekitar n untuk menggabungkan bagian-bagiannya. Jadi biayanya n untuk setiap dari log n tingkat, yaitu n log n pada semua kasus.',
      ),
    },
    {
      q: L('What is amortized time complexity?', 'Apa itu kompleksitas waktu teramortisasi?'),
      a: L(
        'It is the average cost per operation over a worst-case sequence. Appending to a dynamic array is usually constant but sometimes copies everything; since the copies add up to less than twice the number of appends, the amortized cost is constant.',
        'Itu adalah biaya rata-rata per operasi pada barisan kasus terburuk. Menambah ke larik dinamis biasanya konstan tetapi kadang menyalin semuanya; karena salinan itu berjumlah kurang dari dua kali banyaknya penambahan, biaya teramortisasinya konstan.',
      ),
    },
    {
      q: L('What does the Master theorem say?', 'Apa isi teorema Master?'),
      a: L(
        'For T of n equal to a times T of n over b plus n to the d, it compares d with the logarithm of a in base b. If d is larger the answer is n to the d, if equal n to the d times log n, and if smaller n to the log of a.',
        'Untuk T dari n sama dengan a kali T dari n per b tambah n pangkat d, teorema ini membandingkan d dengan logaritma a berbasis b. Jika d lebih besar jawabannya n pangkat d, jika sama n pangkat d kali log n, dan jika lebih kecil n pangkat log a.',
      ),
    },
    {
      q: L('Is an O(n) algorithm always faster than an O(n²) one?', 'Apakah algoritma O(n) selalu lebih cepat daripada yang O(n²)?'),
      a: L(
        'No, only for large enough inputs. Big-O hides constant factors, so an algorithm with 100n steps is slower than one with n squared steps until n reaches 100. For small inputs the simpler method often wins.',
        'Tidak, hanya untuk masukan yang cukup besar. Big-O menyembunyikan faktor konstan, sehingga algoritma dengan 100n langkah lebih lambat daripada yang n kuadrat langkah sampai n mencapai 100. Untuk masukan kecil metode yang lebih sederhana sering menang.',
      ),
    },
  ],

  references: [
    { title: 'Introduction to Algorithms (4th ed.), chapters 3 and 4: Characterizing Running Times; Divide-and-Conquer', author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', year: 2022, source: 'MIT Press' },
    { title: 'Big Omicron and big Omega and big Theta', author: 'Donald E. Knuth', year: 1976, source: 'ACM SIGACT News 8(2)' },
    { title: 'On the computational complexity of algorithms', author: 'Juris Hartmanis and Richard E. Stearns', year: 1965, source: 'Transactions of the American Mathematical Society 117' },
    { title: 'Analytische Zahlentheorie', author: 'Paul Bachmann', year: 1894, source: 'Teubner, Leipzig' },
  ],

  related: ['floating-point-numbers', 'indeterminate-forms-and-lhopitals-rule', 'binary-numbers', 'geometric-sequences-and-series'],
}
