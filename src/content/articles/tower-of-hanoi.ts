import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './tower-of-hanoi.meta'

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
    T`**The Tower of Hanoi asks you to move a stack of $n$ discs of different sizes from one of three pegs to another, one disc at a time, never putting a larger disc on a smaller one; the best solution takes exactly $2^n-1$ moves.** The idea is recursive: move the top $n-1$ discs to the spare peg, move the largest disc, then move the $n-1$ discs back on top, so $T(n)=2T(n-1)+1$. Three discs need $7$ moves; $64$ discs need $18\,446\,744\,073\,709\,551\,615$.`,
    T`**Menara Hanoi meminta kamu memindahkan tumpukan $n$ cakram berukuran berbeda dari satu di antara tiga tiang ke tiang lain, satu cakram sekali waktu, tanpa pernah menaruh cakram yang lebih besar di atas yang lebih kecil; solusi terbaiknya memerlukan tepat $2^n-1$ langkah.** Gagasannya rekursif: pindahkan $n-1$ cakram teratas ke tiang cadangan, pindahkan cakram terbesar, lalu pindahkan $n-1$ cakram itu kembali ke atasnya, sehingga $T(n)=2T(n-1)+1$. Tiga cakram memerlukan $7$ langkah; $64$ cakram memerlukan $18\,446\,744\,073\,709\,551\,615$.`,
  ),

  keyPoints: [
    L(
      T`The rules: three pegs, $n$ discs of different sizes on the first, move one disc at a time, never a larger disc on a smaller one. The goal is the whole tower on another peg. Every assignment of discs to pegs is a legal position, so there are $3^n$ positions.`,
      T`Aturannya: tiga tiang, $n$ cakram berukuran berbeda di tiang pertama, pindahkan satu cakram sekali waktu, tidak pernah cakram besar di atas yang kecil. Tujuannya seluruh menara di tiang lain. Setiap penugasan cakram ke tiang adalah posisi yang sah, sehingga ada $3^n$ posisi.`,
    ),
    L(
      T`Recursive solution: solve $n-1$ discs onto the spare peg, move the largest, solve $n-1$ discs onto the target. The number of moves obeys $T(n)=2T(n-1)+1$, so $T(n)+1=2^n$ and $T(n)=2^n-1$: $7,15,31,63,\ldots$`,
      T`Solusi rekursif: selesaikan $n-1$ cakram ke tiang cadangan, pindahkan yang terbesar, selesaikan $n-1$ cakram ke tiang tujuan. Banyaknya langkah memenuhi $T(n)=2T(n-1)+1$, sehingga $T(n)+1=2^n$ dan $T(n)=2^n-1$: $7,15,31,63,\ldots$`,
    ),
    L(
      T`$2^n-1$ is the best possible: the largest disc must move at least once, and before that the other $n-1$ discs must all sit on the third peg, and after it they must all be moved again. So $T(n)\ge2T(n-1)+1$. The same argument shows that the shortest solution is unique.`,
      T`$2^n-1$ adalah yang terbaik: cakram terbesar harus bergerak sedikitnya sekali, dan sebelumnya $n-1$ cakram lain harus semuanya berada di tiang ketiga, dan sesudahnya semuanya harus dipindahkan lagi. Jadi $T(n)\ge2T(n-1)+1$. Argumen yang sama menunjukkan solusi terpendeknya tunggal.`,
    ),
    L(
      T`Disc number $k$ (the smallest is $1$) moves $2^{n-k}$ times. Move number $m$ moves disc number $v+1$, where $2^v$ is the largest power of two dividing $m$: $1,2,1,3,1,2,1,4,\ldots$ This gives a solution without recursion: always move the smallest disc one step the same way around, and in between make the only other legal move.`,
      T`Cakram nomor $k$ (yang terkecil $1$) bergerak $2^{n-k}$ kali. Langkah nomor $m$ memindahkan cakram nomor $v+1$, dengan $2^v$ pangkat dua terbesar yang membagi $m$: $1,2,1,3,1,2,1,4,\ldots$ Ini memberi solusi tanpa rekursi: selalu pindahkan cakram terkecil satu langkah searah, dan di antaranya lakukan satu-satunya langkah sah yang lain.`,
    ),
    L(
      T`At one move a second, $64$ discs take about $5.85\times10^{11}$ years, $42$ times the age of the universe; at a billion moves a second, about $585$ years. The positions and moves form a graph that is a Sierpiński triangle, and the best solution is one side of it.`,
      T`Pada satu langkah per detik, $64$ cakram memerlukan sekitar $5{,}85\times10^{11}$ tahun, $42$ kali usia alam semesta; pada semiliar langkah per detik, sekitar $585$ tahun. Posisi dan langkah membentuk graf yang merupakan segitiga Sierpiński, dan solusi terbaik adalah satu sisinya.`,
    ),
    L(
      T`With four pegs the Frame–Stewart numbers $1,3,5,9,13,17,25,\ldots$ take over (proved optimal in 2014): $64$ discs need only $18\,433$ moves instead of $2^{64}-1$. The puzzle was published by Édouard Lucas in 1883.`,
      T`Dengan empat tiang bilangan Frame–Stewart $1,3,5,9,13,17,25,\ldots$ berlaku (terbukti optimal pada 2014): $64$ cakram hanya memerlukan $18\,433$ langkah, bukan $2^{64}-1$. Teka-teki ini diterbitkan oleh Édouard Lucas pada 1883.`,
    ),
  ],

  sections: [
    /* --------------------------------------------------------------------------------------- what */
    {
      id: 'what-is-hanoi',
      heading: L('What is the Tower of Hanoi puzzle?', 'Apa itu teka-teki Menara Hanoi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The Tower of Hanoi is a puzzle with three pegs and a stack of discs of different sizes, and the task is to move the whole stack to another peg following two rules.** At the start the discs sit on the first peg, the largest at the bottom and the smallest on top, like a cone. The rules are

1. move **one disc at a time**, the top disc of a peg; and
2. **never put a larger disc on a smaller one**.

The goal is the same tower on a different peg. With $3$ discs it takes $7$ moves. Call the pegs $A$, $B$ and $C$, and the discs $1$ (smallest), $2$ and $3$, moving from $A$ to $C$:

| Move | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Disc | 1 | 2 | 1 | 3 | 1 | 2 | 1 |
| From → to | A → C | A → B | C → B | A → C | B → A | B → C | A → C |

Look at the table: the biggest disc moves once, in the middle, and the smallest disc moves at every other move. Both facts will turn out to be general.

**Positions.** Because a peg holds its discs in order of size, a position is completely described by saying which peg each disc is on. Any choice is legal, so with $n$ discs there are exactly $3^n$ positions: $27$ for three discs, $243$ for five.

Play it below with three to seven discs. Click a peg (or use the buttons) to take the top disc, then click the peg to put it on. The hint button always makes the best next move *from whatever position you are in*.`,
            T`**Menara Hanoi adalah teka-teki dengan tiga tiang dan tumpukan cakram berukuran berbeda, dan tugasnya memindahkan seluruh tumpukan ke tiang lain dengan mengikuti dua aturan.** Pada awalnya cakram berada di tiang pertama, yang terbesar di dasar dan yang terkecil di atas, seperti kerucut. Aturannya

1. pindahkan **satu cakram sekali waktu**, cakram teratas sebuah tiang; dan
2. **jangan pernah menaruh cakram yang lebih besar di atas yang lebih kecil**.

Tujuannya menara yang sama di tiang yang berbeda. Dengan $3$ cakram diperlukan $7$ langkah. Sebut tiangnya $A$, $B$, dan $C$, dan cakramnya $1$ (terkecil), $2$, dan $3$, memindahkan dari $A$ ke $C$:

| Langkah | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Cakram | 1 | 2 | 1 | 3 | 1 | 2 | 1 |
| Dari → ke | A → C | A → B | C → B | A → C | B → A | B → C | A → C |

Lihat tabelnya: cakram terbesar bergerak sekali, di tengah, dan cakram terkecil bergerak setiap dua langkah. Kedua fakta itu ternyata berlaku umum.

**Posisi.** Karena sebuah tiang memegang cakramnya terurut menurut ukuran, sebuah posisi sepenuhnya dijelaskan dengan menyebut tiang tempat setiap cakram berada. Pilihan apa pun sah, sehingga dengan $n$ cakram ada tepat $3^n$ posisi: $27$ untuk tiga cakram, $243$ untuk lima.

Mainkan di bawah dengan tiga sampai tujuh cakram. Klik sebuah tiang (atau pakai tombolnya) untuk mengambil cakram teratas, lalu klik tiang tempat menaruhnya. Tombol petunjuk selalu melakukan langkah terbaik berikutnya *dari posisi mana pun yang sedang kamu tempati*.`,
          ),
        },
        { kind: 'widget', name: 'hanoiplay' },
      ],
    },

    /* --------------------------------------------------------------------------------- recursion */
    {
      id: 'recursion',
      heading: L('How does the recursive solution work?', 'Bagaimana solusi rekursif bekerja?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To move $n$ discs from $A$ to $C$, first move the top $n-1$ discs to $B$, then move the largest disc to $C$, then move the $n-1$ discs from $B$ onto $C$.** The largest disc cannot move until everything above it is out of the way, and it can only go to a peg that is empty or holds larger discs, which means a peg with *no* smaller disc on it. So all the other $n-1$ discs have to be on the third peg at that moment. That is the whole idea, and the two moves of the $n-1$ discs are the *same puzzle again*, with a smaller tower and with the pegs playing different roles:

- move $n-1$ discs from the source to the **spare** peg, using the target as the spare;
- move the largest disc from the source to the target;
- move $n-1$ discs from the spare peg to the **target**, using the source as the spare.

The recursion stops at $0$ discs, where there is nothing to do. For three discs the recipe expands into the seven moves of the table: move $2$ discs $A\to B$ (three moves: $1$ to $C$, $2$ to $B$, $1$ onto $B$), move disc $3$ to $C$, move $2$ discs $B\to C$ (three more).

**Counting the moves.** Let $T(n)$ be the number of moves of this solution. The two sub-solutions take $T(n-1)$ each and the largest disc one move, so
$$T(0)=0,\qquad T(n)=2\,T(n-1)+1.$$
Add $1$ to both sides: $T(n)+1=2\,(T(n-1)+1)$, so $T(n)+1$ doubles at every step, starting from $T(0)+1=1$. Hence
$$T(n)+1=2^n,\qquad T(n)=2^n-1.$$
Check: $T(1)=1$, $T(2)=3$, $T(3)=7$, $T(4)=15$, $T(5)=31$, $T(10)=1023$. Another way to see it: disc number $k$ (the smallest is $1$) moves $2^{n-k}$ times, and $1+2+4+\cdots+2^{n-1}=2^n-1$ is a [geometric series](article:geometric-sequences-and-series#sum-of-a-geometric-series).

**What the computer does.** The function calls itself twice, so it makes $2^{n+1}-1$ calls in all, but the *depth* of the recursion is only $n$: at any time the call stack holds one call for each size from $n$ down to the current one. So a program can solve $25$ discs (33 million moves) without running out of stack, though it will take its time. This is unlike the naive recursion for [Fibonacci numbers](article:fibonacci-numbers#computing), which can be rescued by remembering values: here the answer itself contains $2^n-1$ moves, so no program can be faster than that.`,
            T`**Untuk memindahkan $n$ cakram dari $A$ ke $C$, pindahkan dulu $n-1$ cakram teratas ke $B$, lalu pindahkan cakram terbesar ke $C$, lalu pindahkan $n-1$ cakram itu dari $B$ ke atas $C$.** Cakram terbesar tidak dapat bergerak sebelum semua yang di atasnya menyingkir, dan ia hanya dapat pergi ke tiang yang kosong atau berisi cakram yang lebih besar, yaitu tiang yang *tidak* memiliki cakram lebih kecil. Jadi semua $n-1$ cakram lain harus berada di tiang ketiga pada saat itu. Itulah seluruh gagasannya, dan dua kali pemindahan $n-1$ cakram adalah *teka-teki yang sama lagi*, dengan menara yang lebih kecil dan dengan tiang yang berperan berbeda:

- pindahkan $n-1$ cakram dari asal ke tiang **cadangan**, memakai tujuan sebagai cadangan;
- pindahkan cakram terbesar dari asal ke tujuan;
- pindahkan $n-1$ cakram dari tiang cadangan ke **tujuan**, memakai asal sebagai cadangan.

Rekursi berhenti pada $0$ cakram, yang tidak ada yang dikerjakan. Untuk tiga cakram resep itu terurai menjadi tujuh langkah pada tabel: pindahkan $2$ cakram $A\to B$ (tiga langkah: $1$ ke $C$, $2$ ke $B$, $1$ ke atas $B$), pindahkan cakram $3$ ke $C$, pindahkan $2$ cakram $B\to C$ (tiga lagi).

**Menghitung langkahnya.** Misalkan $T(n)$ banyaknya langkah solusi ini. Kedua sub-solusi masing-masing $T(n-1)$ dan cakram terbesar satu langkah, sehingga
$$T(0)=0,\qquad T(n)=2\,T(n-1)+1.$$
Tambahkan $1$ ke kedua ruas: $T(n)+1=2\,(T(n-1)+1)$, sehingga $T(n)+1$ berlipat dua pada setiap langkah, dimulai dari $T(0)+1=1$. Jadi
$$T(n)+1=2^n,\qquad T(n)=2^n-1.$$
Periksa: $T(1)=1$, $T(2)=3$, $T(3)=7$, $T(4)=15$, $T(5)=31$, $T(10)=1023$. Cara lain melihatnya: cakram nomor $k$ (yang terkecil $1$) bergerak $2^{n-k}$ kali, dan $1+2+4+\cdots+2^{n-1}=2^n-1$ adalah [deret geometri](article:geometric-sequences-and-series#sum-of-a-geometric-series).

**Apa yang dilakukan komputer.** Fungsi itu memanggil dirinya dua kali, sehingga ia membuat $2^{n+1}-1$ panggilan seluruhnya, tetapi *kedalaman* rekursinya hanya $n$: pada setiap saat tumpukan panggilan memuat satu panggilan untuk setiap ukuran dari $n$ turun ke yang sekarang. Jadi program dapat menyelesaikan $25$ cakram (33 juta langkah) tanpa kehabisan tumpukan, walau akan memakan waktu. Ini berbeda dari rekursi naif untuk [bilangan Fibonacci](article:fibonacci-numbers#computing), yang dapat diselamatkan dengan mengingat nilai: di sini jawabannya sendiri memuat $2^n-1$ langkah, sehingga tidak ada program yang bisa lebih cepat daripada itu.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------------------------- optimal */
    {
      id: 'optimal',
      heading: L('Why can no solution use fewer moves?', 'Mengapa tidak ada solusi yang memakai langkah lebih sedikit?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The recursive solution is not just good, it is the best possible: no solution has fewer than $2^n-1$ moves, and no other solution has exactly that many.** The proof uses the largest disc, as the construction did. Let $M(n)$ be the least number of moves of *any* legal solution with $n$ discs.

Look at a solution and at the largest disc. It must move at least once. At the moment of its first move, it goes from the first peg to another peg, and for that to be allowed every other disc must be on the third peg. So before that moment the $n-1$ smaller discs have been moved from the first peg to the third one, which is the same puzzle with $n-1$ discs, and takes at least $M(n-1)$ moves. After the *last* move of the largest disc it sits on the target peg, and the $n-1$ smaller discs, which are on another peg, still have to be moved onto it: at least $M(n-1)$ moves again. Adding the largest disc's own move,
$$M(n)\ge2\,M(n-1)+1,\qquad M(1)=1.$$
So $M(n)\ge2^n-1$, which the recursive solution reaches. **The best solution has exactly $2^n-1$ moves.**

**It is unique.** If a solution has exactly $2^n-1$ moves, every inequality above must be an equality: the largest disc moves exactly once (otherwise there would be an extra move), and the moves before and after it are each a shortest solution for $n-1$ discs. By induction on $n$ there is only one such solution: the recursive one. A shortest solution needs no choice at all, which also explains why the hint button in the puzzle never has to pick between two best moves.

**From any position.** The same idea solves the puzzle from *any* position, not only from a full tower. Find the largest disc that is not yet where it should be; move the smaller discs to the third peg, move that disc, and rebuild a perfect tower on top of it. The number of moves is smallest possible, and the largest distance between any two positions of $n$ discs is $2^n-1$, between two of the three "corner" positions with everything on one peg.`,
            T`**Solusi rekursif bukan sekadar baik, ia yang terbaik: tidak ada solusi yang memiliki kurang dari $2^n-1$ langkah, dan tidak ada solusi lain yang memiliki tepat sebanyak itu.** Buktinya memakai cakram terbesar, seperti pada konstruksinya. Misalkan $M(n)$ banyaknya langkah paling sedikit dari solusi sah *mana pun* dengan $n$ cakram.

Lihat sebuah solusi dan cakram terbesarnya. Ia harus bergerak sedikitnya sekali. Pada saat gerakan pertamanya, ia pergi dari tiang pertama ke tiang lain, dan agar itu diizinkan setiap cakram lain harus berada di tiang ketiga. Jadi sebelum saat itu $n-1$ cakram yang lebih kecil sudah dipindahkan dari tiang pertama ke tiang ketiga, yaitu teka-teki yang sama dengan $n-1$ cakram, dan memerlukan sedikitnya $M(n-1)$ langkah. Setelah gerakan *terakhir* cakram terbesar ia berada di tiang tujuan, dan $n-1$ cakram yang lebih kecil, yang berada di tiang lain, masih harus dipindahkan ke atasnya: sedikitnya $M(n-1)$ langkah lagi. Ditambah gerakan cakram terbesar itu sendiri,
$$M(n)\ge2\,M(n-1)+1,\qquad M(1)=1.$$
Jadi $M(n)\ge2^n-1$, yang dicapai oleh solusi rekursif. **Solusi terbaik memiliki tepat $2^n-1$ langkah.**

**Ia tunggal.** Jika sebuah solusi memiliki tepat $2^n-1$ langkah, setiap ketaksamaan di atas harus berupa kesamaan: cakram terbesar bergerak tepat sekali (jika tidak akan ada langkah ekstra), dan langkah sebelum dan sesudahnya masing-masing adalah solusi terpendek untuk $n-1$ cakram. Dengan induksi pada $n$ hanya ada satu solusi seperti itu: yang rekursif. Solusi terpendek sama sekali tidak memerlukan pilihan, yang juga menjelaskan mengapa tombol petunjuk pada teka-teki tidak pernah harus memilih di antara dua langkah terbaik.

**Dari posisi mana pun.** Gagasan yang sama menyelesaikan teka-teki dari posisi *mana pun*, bukan hanya dari menara penuh. Cari cakram terbesar yang belum berada di tempat seharusnya; pindahkan cakram yang lebih kecil ke tiang ketiga, pindahkan cakram itu, dan bangun menara sempurna di atasnya. Banyaknya langkah sesedikit mungkin, dan jarak terbesar antara dua posisi $n$ cakram adalah $2^n-1$, di antara dua dari tiga posisi "sudut" dengan semuanya di satu tiang.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------------------------------- time */
    {
      id: 'time',
      heading: L('How long would the 64-disc tower take?', 'Berapa lama menara 64 cakram?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Far longer than the universe has existed: at one move a second, $2^{64}-1$ moves take about $5.85\times10^{11}$ years.** In the story Lucas's leaflet told in 1883, and a French science magazine retold in 1884, monks in a temple at Benares are moving $64$ golden discs between three diamond needles, one move at a time, and when they finish the world will end. The number of moves is
$$2^{64}-1=18\,446\,744\,073\,709\,551\,615.$$
At one move a second that is $585$ billion years, about $42$ times the age of the universe ($13.8$ billion years). The doubling is what hurts: every extra disc doubles the time. At one move a second $10$ discs take $17$ minutes, $20$ discs $12$ days, $30$ discs $34$ years and $40$ discs $34\,800$ years. Even a computer that makes a billion moves a second would need $585$ years for $64$ discs.

This is the standard picture of **exponential growth** (see [Big-O notation](article:big-o-notation#recurrences) for the growth classes): adding one disc multiplies the work by $2$, whereas for a polynomial cost like $n^2$ it would add a little. It is also why the legend is only a legend. Move the slider below to see the time for any number of discs, and how often each disc moves.`,
            T`**Jauh lebih lama daripada keberadaan alam semesta: pada satu langkah per detik, $2^{64}-1$ langkah memerlukan sekitar $5{,}85\times10^{11}$ tahun.** Dalam cerita yang dituturkan selebaran Lucas pada 1883, dan diceritakan ulang majalah sains Prancis pada 1884, para biksu di sebuah kuil di Benares memindahkan $64$ cakram emas di antara tiga jarum berlian, satu langkah sekali waktu, dan ketika mereka selesai dunia akan berakhir. Banyaknya langkah adalah
$$2^{64}-1=18\,446\,744\,073\,709\,551\,615.$$
Pada satu langkah per detik itu $585$ miliar tahun, sekitar $42$ kali usia alam semesta ($13{,}8$ miliar tahun). Penggandaannya yang menyakitkan: setiap cakram tambahan melipatduakan waktunya. Pada satu langkah per detik $10$ cakram memerlukan $17$ menit, $20$ cakram $12$ hari, $30$ cakram $34$ tahun, dan $40$ cakram $34\,800$ tahun. Bahkan komputer yang membuat semiliar langkah per detik memerlukan $585$ tahun untuk $64$ cakram.

Ini gambaran baku **pertumbuhan eksponensial** (lihat [notasi Big-O](article:big-o-notation#recurrences) untuk kelas pertumbuhan): menambah satu cakram mengalikan kerja dengan $2$, sedangkan untuk biaya polinomial seperti $n^2$ ia hanya menambah sedikit. Itu juga sebabnya legenda hanyalah legenda. Geser penggeser di bawah untuk melihat waktu untuk sembarang banyak cakram, dan seberapa sering tiap cakram bergerak.`,
          ),
        },
        { kind: 'widget', name: 'hanoitime' },
      ],
    },

    /* -------------------------------------------------------------------------------------- binary */
    {
      id: 'binary',
      heading: L('How is the Tower of Hanoi connected to binary numbers?', 'Bagaimana Menara Hanoi berhubungan dengan bilangan biner?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The disc that moves at move number $m$ is read off the binary form of $m$: it is the position of the lowest $1$ bit.** Number the moves $1,2,3,\ldots,2^n-1$ and the discs $1$ (smallest) to $n$. Then move $m$ moves disc $v+1$, where $2^v$ is the largest power of two that divides $m$ (the number of zeros at the right end of $m$ in binary). The sequence of discs is the *ruler sequence*
$$1,2,1,3,1,2,1,4,1,2,1,3,1,2,1,5,\ldots$$
Odd moves ($m$ ends in $1$) move disc $1$; moves $2,6,10,\ldots$ move disc $2$; move $8$ moves disc $4$; move $2^{n-1}$ moves the largest disc $n$, once, in the middle. The count of moves of each disc, $2^{n-k}$ for disc $k$, is the count of numbers up to $2^n-1$ with exactly $k-1$ trailing zeros.

**A solution without recursion.** Because of that, the solution can be run as a loop:

1. On odd moves, move the smallest disc one peg onward, always in the same direction around the three pegs: $A\to C\to B\to A\to\cdots$ if $n$ is odd, $A\to B\to C\to A\to\cdots$ if $n$ is even.
2. On even moves, make the only legal move that does not involve the smallest disc.

This makes exactly the same moves as the recursion. It also lets a program write down the move number $m$ of a $64$-disc tower in a few steps, without making the $m-1$ moves before it.

**The position after $m$ moves.** The recursion can be unrolled once per disc, from the largest down. If $m$ is below $2^{n-1}$ the largest disc has not moved yet, and the smaller discs are on their way to the spare peg; otherwise it is on the target, $2^{n-1}$ is taken off $m$, and the smaller discs are on their way to the target from the spare peg. The result gives the peg of each of the $n$ discs after any number of moves in $n$ steps, as the widget below does for up to $64$ discs.

**Gray code.** Write each $m$ as its reflected binary Gray code $m\oplus\lfloor m/2\rfloor$ (the exclusive or of $m$ with itself shifted right). Consecutive Gray codes differ in exactly one bit, and the bit that changes at move $m$ is bit number $v$, the same ruler sequence. So bit $k$ of the Gray code of $m$ is $1$ when disc $k+1$ has moved an odd number of times so far. Frank Gray used the same code in a patent for telegraph signals (filed in 1947); Gray codes are used for position sensors, where only one bit may change at a time.

Type any move number below, or step through the moves.`,
            T`**Cakram yang bergerak pada langkah nomor $m$ dibaca dari bentuk biner $m$: ia adalah posisi bit $1$ terendah.** Beri nomor langkah $1,2,3,\ldots,2^n-1$ dan cakram $1$ (terkecil) sampai $n$. Maka langkah $m$ memindahkan cakram $v+1$, dengan $2^v$ pangkat dua terbesar yang membagi $m$ (banyaknya nol di ujung kanan $m$ dalam biner). Barisan cakramnya adalah *barisan penggaris*
$$1,2,1,3,1,2,1,4,1,2,1,3,1,2,1,5,\ldots$$
Langkah ganjil ($m$ berakhir $1$) memindahkan cakram $1$; langkah $2,6,10,\ldots$ memindahkan cakram $2$; langkah $8$ memindahkan cakram $4$; langkah $2^{n-1}$ memindahkan cakram terbesar $n$, sekali, di tengah. Banyaknya langkah tiap cakram, $2^{n-k}$ untuk cakram $k$, adalah banyaknya bilangan sampai $2^n-1$ yang memiliki tepat $k-1$ nol di ujung.

**Solusi tanpa rekursi.** Karena itu, solusinya dapat dijalankan sebagai perulangan:

1. Pada langkah ganjil, pindahkan cakram terkecil satu tiang ke depan, selalu dengan arah yang sama mengelilingi tiga tiang: $A\to C\to B\to A\to\cdots$ jika $n$ ganjil, $A\to B\to C\to A\to\cdots$ jika $n$ genap.
2. Pada langkah genap, lakukan satu-satunya langkah sah yang tidak melibatkan cakram terkecil.

Ini membuat langkah yang persis sama dengan rekursi. Ia juga memungkinkan program menuliskan langkah nomor $m$ menara $64$ cakram dalam beberapa langkah, tanpa membuat $m-1$ langkah sebelumnya.

**Posisi setelah $m$ langkah.** Rekursi dapat diurai sekali per cakram, dari yang terbesar ke bawah. Jika $m$ di bawah $2^{n-1}$ cakram terbesar belum bergerak, dan cakram yang lebih kecil sedang menuju tiang cadangan; jika tidak ia berada di tujuan, $2^{n-1}$ dikurangkan dari $m$, dan cakram yang lebih kecil sedang menuju tujuan dari tiang cadangan. Hasilnya memberi tiang setiap dari $n$ cakram setelah sembarang banyak langkah dalam $n$ langkah, seperti yang dilakukan widget di bawah untuk sampai $64$ cakram.

**Kode Gray.** Tulis setiap $m$ sebagai kode Gray biner berpantulnya $m\oplus\lfloor m/2\rfloor$ (xor $m$ dengan dirinya yang digeser ke kanan). Kode Gray berurutan berbeda tepat satu bit, dan bit yang berubah pada langkah $m$ adalah bit nomor $v$, barisan penggaris yang sama. Jadi bit $k$ kode Gray $m$ bernilai $1$ bila cakram $k+1$ sudah bergerak sebanyak ganjil kali sejauh ini. Frank Gray memakai kode yang sama dalam paten untuk sinyal telegraf (diajukan 1947); kode Gray dipakai pada sensor posisi, yang hanya boleh berubah satu bit sekali waktu.

Ketik nomor langkah mana pun di bawah, atau telusuri langkah-langkahnya.`,
          ),
        },
        { kind: 'widget', name: 'hanoistate' },
      ],
    },

    /* --------------------------------------------------------------------------------------- graph */
    {
      id: 'graph',
      heading: L('What does the graph of all positions look like?', 'Seperti apa graf semua posisi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Draw every position as a dot and join two dots by a line when one move turns one position into the other, and you get a Sierpiński triangle.** For one disc the graph is a triangle: the disc can be on $A$, $B$ or $C$, and it can move between any two pegs. For $n$ discs, split the positions by the peg of the largest disc: three groups, each a copy of the graph for $n-1$ discs (with the large disc fixed, the smaller ones move as before). The three copies are joined by only three lines, one for each move of the largest disc, which can happen only when all smaller discs are on the third peg. Repeating this gives the triangle of triangles of triangles.

The graph has these properties, which the widget lets you check by eye:
- **$3^n$ points**, all the positions;
- **$\frac{3^{n+1}-3}{2}$ lines**, since every position allows three moves except the three corner positions, where all discs are on one peg and only the top disc can move, to either of two pegs: $39$ lines for $3$ discs;
- **three corners**: all discs on $A$, on $B$ or on $C$;
- **the best solution is a path along one side** of the big triangle, from the top corner to the bottom right one, with $2^n-1$ steps, and it is the only shortest path between those corners: the number of moves cannot be shortened because there is nothing shorter to take;
- the **distance** between two positions is the length of a shortest path, and the largest distance in the graph is $2^n-1$.

This explains the self-similarity of the recursion. It also links the puzzle to the Sierpiński triangle and to Pascal's triangle taken mod $2$, as the same pattern in different disguises. Choose the number of discs below and click any dot to see the position and its distance from a finished tower on each peg.`,
            T`**Gambar setiap posisi sebagai titik dan hubungkan dua titik dengan garis bila satu langkah mengubah satu posisi menjadi yang lain, dan kamu mendapatkan segitiga Sierpiński.** Untuk satu cakram grafnya segitiga: cakram dapat berada di $A$, $B$, atau $C$, dan dapat berpindah di antara dua tiang mana pun. Untuk $n$ cakram, bagi posisi menurut tiang cakram terbesar: tiga kelompok, masing-masing salinan graf untuk $n-1$ cakram (dengan cakram besar tetap, yang lebih kecil bergerak seperti sebelumnya). Ketiga salinan dihubungkan hanya oleh tiga garis, satu untuk setiap gerakan cakram terbesar, yang hanya dapat terjadi bila semua cakram yang lebih kecil berada di tiang ketiga. Mengulang ini memberi segitiga dari segitiga dari segitiga.

Graf itu memiliki sifat-sifat ini, yang dapat kamu periksa dengan mata lewat widget:
- **$3^n$ titik**, semua posisi;
- **$\frac{3^{n+1}-3}{2}$ garis**, karena setiap posisi mengizinkan tiga langkah kecuali tiga posisi sudut, yang semua cakramnya di satu tiang dan hanya cakram teratas yang dapat bergerak, ke salah satu dari dua tiang: $39$ garis untuk $3$ cakram;
- **tiga sudut**: semua cakram di $A$, di $B$, atau di $C$;
- **solusi terbaik adalah jalur di sepanjang satu sisi** segitiga besar, dari sudut atas ke sudut kanan bawah, dengan $2^n-1$ langkah, dan ia satu-satunya jalur terpendek di antara kedua sudut itu: banyaknya langkah tidak dapat dipersingkat karena tidak ada yang lebih pendek untuk diambil;
- **jarak** antara dua posisi adalah panjang jalur terpendek, dan jarak terbesar dalam graf adalah $2^n-1$.

Ini menjelaskan keserupaan-diri rekursi. Ia juga menghubungkan teka-teki ini dengan segitiga Sierpiński dan segitiga Pascal mod $2$, sebagai pola yang sama dalam samaran berbeda. Pilih banyak cakram di bawah dan klik titik mana pun untuk melihat posisinya dan jaraknya dari menara selesai di setiap tiang.`,
          ),
        },
        { kind: 'widget', name: 'hanoigraph' },
      ],
    },

    /* --------------------------------------------------------------------------------------- pegs */
    {
      id: 'more-pegs',
      heading: L('What if there are four or more pegs?', 'Bagaimana jika ada empat tiang atau lebih?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**With a fourth peg the puzzle becomes much easier, and the best number of moves is given by a recurrence of Frame and Stewart that was proved optimal for four pegs only in 2014.** The idea: move the top $k$ discs to a spare peg using all four pegs, then move the remaining $n-k$ discs to the target using only three pegs (one is occupied by the $k$ small discs), then move the $k$ discs onto the target, using all four pegs again. If $F(n,p)$ is the number of moves with $p$ pegs,
$$F(n,3)=2^n-1,\qquad F(n,p)=\min_{1\le k<n}\Bigl(2\,F(k,p)+F(n-k,p-1)\Bigr).$$
For four pegs this gives $1,3,5,9,13,17,25,33,41,49,\ldots$ for $n=1,2,3,\ldots$: the differences are $2,2,4,4,4,8,8,8,8,\ldots$, each power of two repeated one more time than the last. Compare three pegs: $1,3,7,15,31,\ldots$. For ten discs it is $49$ moves instead of $1023$, and for $20$ discs $289$ instead of $1\,048\,575$.

The saving grows fast. **For $64$ discs, four pegs need $18\,433$ moves, five pegs $1535$ and six pegs $673$, against $18\,446\,744\,073\,709\,551\,615$ for three pegs**: at one move a second the four-peg tower takes about $5$ hours, and the five-peg tower about $26$ minutes.

**What is known.** Henry Dudeney published a four-peg version, "Reve's puzzle", in 1907. In 1941 J. S. Frame and B. M. Stewart gave the recurrence above, independently. Whether it is optimal was an open problem for more than seventy years: Thierry Bousch proved it for four pegs in 2014. For five or more pegs the Frame–Stewart numbers are only conjectured to be best (a search over all positions confirms them for small cases). Pick the number of pegs and discs below.`,
            T`**Dengan tiang keempat teka-teki menjadi jauh lebih mudah, dan banyaknya langkah terbaik diberikan oleh rekurensi Frame dan Stewart yang baru terbukti optimal untuk empat tiang pada 2014.** Gagasannya: pindahkan $k$ cakram teratas ke tiang cadangan dengan memakai keempat tiang, lalu pindahkan $n-k$ cakram sisanya ke tujuan hanya dengan tiga tiang (satu ditempati $k$ cakram kecil), lalu pindahkan $k$ cakram itu ke tujuan, memakai keempat tiang lagi. Jika $F(n,p)$ adalah banyaknya langkah dengan $p$ tiang,
$$F(n,3)=2^n-1,\qquad F(n,p)=\min_{1\le k<n}\Bigl(2\,F(k,p)+F(n-k,p-1)\Bigr).$$
Untuk empat tiang ini memberi $1,3,5,9,13,17,25,33,41,49,\ldots$ untuk $n=1,2,3,\ldots$: selisihnya $2,2,4,4,4,8,8,8,8,\ldots$, setiap pangkat dua berulang satu kali lebih banyak daripada yang sebelumnya. Bandingkan tiga tiang: $1,3,7,15,31,\ldots$. Untuk sepuluh cakram itu $49$ langkah, bukan $1023$, dan untuk $20$ cakram $289$, bukan $1\,048\,575$.

Penghematannya bertambah cepat. **Untuk $64$ cakram, empat tiang memerlukan $18\,433$ langkah, lima tiang $1535$, dan enam tiang $673$, dibandingkan $18\,446\,744\,073\,709\,551\,615$ untuk tiga tiang**: pada satu langkah per detik menara empat tiang memerlukan sekitar $5$ jam, dan menara lima tiang sekitar $26$ menit.

**Apa yang diketahui.** Henry Dudeney menerbitkan versi empat tiang, "Reve's puzzle", pada 1907. Pada 1941 J. S. Frame dan B. M. Stewart memberikan rekurensi di atas, secara terpisah. Apakah ia optimal adalah masalah terbuka lebih dari tujuh puluh tahun: Thierry Bousch membuktikannya untuk empat tiang pada 2014. Untuk lima tiang atau lebih bilangan Frame–Stewart hanya diduga terbaik (pencarian atas semua posisi memastikannya untuk kasus kecil). Pilih banyak tiang dan cakram di bawah.`,
          ),
        },
        { kind: 'widget', name: 'hanoipegs' },
      ],
    },

    /* ----------------------------------------------------------------------------------- in code */
    {
      id: 'hanoi-in-code',
      heading: L('How do you solve the Tower of Hanoi in Python, JavaScript and C++?', 'Bagaimana menyelesaikan Menara Hanoi di Python, JavaScript, dan C++?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The recursive function is five lines in any language: solve $n-1$, move the largest disc, solve $n-1$ again, with the roles of the pegs rotated.** The Python program below returns the list of moves, checks that the loop version makes exactly the same moves, finds the disc of move $m$ from the lowest set bit, and computes the position after $m$ moves of a tower of $64$ discs without making them. The JavaScript and C++ programs repeat the recursion and the ruler sequence.`,
            T`**Fungsi rekursifnya lima baris di bahasa apa pun: selesaikan $n-1$, pindahkan cakram terbesar, selesaikan $n-1$ lagi, dengan peran tiang diputar.** Program Python di bawah mengembalikan daftar langkah, memeriksa bahwa versi perulangan membuat langkah yang persis sama, mencari cakram langkah $m$ dari bit set terendah, dan menghitung posisi setelah $m$ langkah menara $64$ cakram tanpa melakukannya. Program JavaScript dan C++ mengulang rekursi dan barisan penggaris.`,
          ),
        },
        {
          kind: 'code',
          lang: 'python',
          caption: L('Python: recursion, a loop, the ruler sequence and a jump to move m', 'Python: rekursi, perulangan, barisan penggaris, dan lompat ke langkah m'),
          code: `def hanoi(n, source="A", target="C", spare="B", moves=None):
    """Moves (disc, from, to) of the best solution; disc 1 is the smallest."""
    if moves is None:
        moves = []
    if n == 0:
        return moves
    hanoi(n - 1, source, spare, target, moves)      # clear the n - 1 smaller discs onto the spare peg
    moves.append((n, source, target))               # the largest disc goes straight to its place
    hanoi(n - 1, spare, target, source, moves)      # and the smaller discs are rebuilt on top of it
    return moves


def hanoi_iterative(n):
    """The same moves without recursion: the smallest disc always goes round the pegs the same way."""
    pegs = {"A": list(range(n, 0, -1)), "B": [], "C": []}
    cycle = ["A", "C", "B"] if n % 2 else ["A", "B", "C"]
    where, moves = 0, []
    for step in range(1, 2 ** n):
        if step % 2:                                 # odd moves: the smallest disc
            src, dst = cycle[where], cycle[(where + 1) % 3]
            where = (where + 1) % 3
        else:                                        # even moves: the only legal move of the other two pegs
            a, b = [p for p in "ABC" if p != cycle[where]]
            if not pegs[a] or (pegs[b] and pegs[b][-1] < pegs[a][-1]):
                a, b = b, a
            src, dst = a, b
        disc = pegs[src].pop()
        pegs[dst].append(disc)
        moves.append((disc, src, dst))
    return moves


def disc_at_move(m):
    """Which disc moves at move m (1, 2, 3, ...): the position of the lowest 1 bit of m."""
    return (m & -m).bit_length()


def position_after(n, m):
    """The peg of each disc after m moves, computed from the bits of m without making the moves."""
    source, target, spare = "A", "C", "B"
    where = {}
    for k in range(n, 0, -1):
        half = 2 ** (k - 1)
        if m < half:
            where[k] = source
            target, spare = spare, target
        else:
            where[k] = target
            m -= half
            source, spare = spare, source
    return where


print(hanoi(3))
print(len(hanoi(10)), hanoi_iterative(10) == hanoi(10), 2 ** 10 - 1)
print([disc_at_move(m) for m in range(1, 16)])
print(position_after(5, 15), position_after(5, 16))
print(2 ** 64 - 1, round((2 ** 64 - 1) / (365.25 * 24 * 3600) / 1e9), "billion years at one move a second")
print(position_after(64, 10 ** 18)[64], position_after(64, 10 ** 18)[1])
# [(1, 'A', 'C'), (2, 'A', 'B'), (1, 'C', 'B'), (3, 'A', 'C'), (1, 'B', 'A'), (2, 'B', 'C'), (1, 'A', 'C')]
# 1023 True 1023
# [1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1]
# {5: 'A', 4: 'B', 3: 'B', 2: 'B', 1: 'B'} {5: 'C', 4: 'B', 3: 'B', 2: 'B', 1: 'B'}
# 18446744073709551615 585 billion years at one move a second
# A C`,
        },
        {
          kind: 'code',
          lang: 'javascript',
          caption: L('JavaScript: the recursion, the ruler sequence and the size of the answer', 'JavaScript: rekursi, barisan penggaris, dan ukuran jawaban'),
          code: `const hanoi = (n, from = 'A', to = 'C', via = 'B', moves = []) => {
  if (n === 0) return moves
  hanoi(n - 1, from, via, to, moves)
  moves.push([n, from, to])
  hanoi(n - 1, via, to, from, moves)
  return moves
}
hanoi(3).map(([d, a, b]) => d + ':' + a + b).join(' ')   // '1:AC 2:AB 1:CB 3:AC 1:BA 2:BC 1:AC'
hanoi(10).length                                           // 1023

// the disc of move m is the position of the lowest set bit: m & -m keeps only that bit
const disc = (m) => Math.log2(m & -m) + 1
Array.from({ length: 15 }, (_, i) => disc(i + 1))          // [1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1]

2n ** 64n - 1n                                             // 18446744073709551615n: BigInt, since a double would round it
Number(2n ** 64n - 1n) / 1e9 / (365.25 * 24 * 3600)        // 584.54...: years at a billion moves a second

// the stack only holds n calls at a time, although 2^n - 1 moves are made
let count = 0
const go = (n) => { if (n === 0) return; go(n - 1); count++; go(n - 1) }
go(20)
count                                                      // 1048575`,
        },
        {
          kind: 'code',
          lang: 'cpp',
          caption: L('C++: the moves of three discs, the count for twelve, and the ruler sequence', 'C++: langkah tiga cakram, hitungan untuk dua belas, dan barisan penggaris'),
          code: `#include <iostream>
#include <cstdio>
using namespace std;

int moves = 0;
int show = 1;

void hanoi(int n, char from, char to, char via) {
  if (n == 0) return;
  hanoi(n - 1, from, via, to);
  moves++;
  if (show) printf("disc %d: %c -> %c\\n", n, from, to);
  hanoi(n - 1, via, to, from);
}

int main() {
  hanoi(3, 'A', 'C', 'B');

  show = 0;
  moves = 0;
  hanoi(12, 'A', 'C', 'B');
  printf("%d\\n", moves);                                // 2^12 - 1

  for (int m = 1; m <= 15; m++) {                       // the disc of move m: trailing zeros of m, plus one
    int d = 1, x = m;
    while (x % 2 == 0) {
      x = x / 2;
      d++;
    }
    printf("%d%c", d, m == 15 ? '\\n' : ',');
  }
  return 0;
}

/* output:
disc 1: A -> C
disc 2: A -> B
disc 1: C -> B
disc 3: A -> C
disc 1: B -> A
disc 2: B -> C
disc 1: A -> C
4095
1,2,1,3,1,2,1,4,1,2,1,3,1,2,1
*/`,
        },
      ],
    },

    /* --------------------------------------------------------------------------------- history */
    {
      id: 'history',
      heading: L('Where does the Tower of Hanoi come from?', 'Dari mana Menara Hanoi berasal?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The Tower of Hanoi is a French invention of 1883, wrapped in a legend that is itself part of the invention.**

- **1883.** The mathematician Édouard Lucas put the puzzle on sale as *La Tour d'Hanoï, véritable casse-tête annamite* ("the Tower of Hanoi, a true Vietnamese brain-teaser"), with eight discs, under the invented name *N. Claus (de Siam), mandarin of the Li-Sou-Stian college*. The names are anagrams: *N. Claus de Siam* is *Lucas d'Amiens* (he came from Amiens) and *Li-Sou-Stian* is *Saint-Louis*, the school where he taught. The leaflet carried the legend of the temple in Benares and the end of the world.
- **1884.** Henri de Parville retold the story in the magazine *La Nature* and helped it spread; W. W. Rouse Ball's *Mathematical Recreations and Essays* carried it into English.
- **1907.** Henry Dudeney published a four-peg version, "Reve's puzzle", in *The Canterbury Puzzles*.
- **1939–1941.** A problem in the *American Mathematical Monthly* about four pegs led J. S. Frame and B. M. Stewart to the recurrence that bears their names.
- **1950s.** The Gray code of Frank Gray (patented in 1953) turned out to describe the sequence of discs.
- **1970s.** Psychologists, among them Herbert Simon, used the puzzle to study how people plan and solve problems; versions of it are used in tests of planning ability.
- **1989–1990s.** Andreas Hinz and others studied the graph of positions and its relation to the Sierpiński triangle, and the average distance between positions.
- **2014.** Thierry Bousch proved that the Frame–Stewart numbers are optimal for four pegs.`,
            T`**Menara Hanoi adalah penemuan Prancis tahun 1883, terbungkus legenda yang merupakan bagian dari penemuan itu sendiri.**

- **1883.** Matematikawan Édouard Lucas menjual teka-teki ini sebagai *La Tour d'Hanoï, véritable casse-tête annamite* ("Menara Hanoi, teka-teki Vietnam sejati"), dengan delapan cakram, dengan nama rekaan *N. Claus (de Siam), mandarin dari perguruan Li-Sou-Stian*. Nama-nama itu anagram: *N. Claus de Siam* adalah *Lucas d'Amiens* (ia berasal dari Amiens) dan *Li-Sou-Stian* adalah *Saint-Louis*, sekolah tempatnya mengajar. Selebarannya memuat legenda kuil di Benares dan akhir dunia.
- **1884.** Henri de Parville menceritakan ulang kisah itu di majalah *La Nature* dan membantu penyebarannya; *Mathematical Recreations and Essays* karya W. W. Rouse Ball membawanya ke dalam bahasa Inggris.
- **1907.** Henry Dudeney menerbitkan versi empat tiang, "Reve's puzzle", dalam *The Canterbury Puzzles*.
- **1939–1941.** Sebuah soal dalam *American Mathematical Monthly* tentang empat tiang membawa J. S. Frame dan B. M. Stewart pada rekurensi yang memakai nama mereka.
- **1950-an.** Kode Gray Frank Gray (dipatenkan 1953) ternyata menjelaskan barisan cakramnya.
- **1970-an.** Psikolog, di antaranya Herbert Simon, memakai teka-teki ini untuk mempelajari bagaimana orang merencanakan dan memecahkan masalah; versinya dipakai dalam tes kemampuan merencanakan.
- **1989–1990-an.** Andreas Hinz dan lainnya mempelajari graf posisi dan hubungannya dengan segitiga Sierpiński, dan jarak rata-rata antarposisi.
- **2014.** Thierry Bousch membuktikan bahwa bilangan Frame–Stewart optimal untuk empat tiang.`,
          ),
        },
      ],
    },

    /* --------------------------------------------------------------------------------- mistakes */
    {
      id: 'mistakes',
      heading: L('What mistakes do people make with the Tower of Hanoi?', 'Kesalahan apa yang sering terjadi pada Menara Hanoi?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with the Tower of Hanoi are the nine below, each with the correct statement.**

| Mistake | Correct |
|---|---|
| ❌ The least number of moves for $n$ discs is about $n^2$ or $2n$ | It is $2^n-1$: $7$ for three discs, $1023$ for ten, and every extra disc doubles it. |
| ❌ Start by moving the largest disc | It cannot move until the $n-1$ smaller discs are all on the third peg: solve those first. |
| ❌ A larger disc may rest on a smaller one if it is only for a moment | Never: the rule holds at every moment, so the largest disc needs a peg with no smaller disc. |
| ❌ The recursion needs a stack of $2^n$ calls | It makes $2^{n+1}-1$ calls but is never more than $n$ deep. |
| ❌ The 64-disc tower will be finished soon | At one move a second it takes $585$ billion years, $42$ times the age of the universe. |
| ❌ There are many shortest solutions | With three pegs exactly one: every inequality in the proof must be an equality. |
| ❌ Every position is $2^n-1$ moves from the goal | The distance depends on the position: after $m$ moves of the best solution, only $2^n-1-m$ remain, and the largest disc not yet in place decides the rest. |
| ❌ A fourth peg saves only a little | Ten discs take $49$ moves instead of $1023$, and $64$ discs take $18\,433$ moves instead of $2^{64}-1$. |
| ❌ In the loop version the smallest disc changes direction | It always steps the same way around the pegs, towards the target first if $n$ is odd and towards the spare if $n$ is even. |`,
            T`**Kesalahan paling umum pada Menara Hanoi adalah sembilan hal berikut, masing-masing dengan pernyataan yang benar.**

| Kesalahan | Yang benar |
|---|---|
| ❌ Langkah paling sedikit untuk $n$ cakram sekitar $n^2$ atau $2n$ | Yaitu $2^n-1$: $7$ untuk tiga cakram, $1023$ untuk sepuluh, dan setiap cakram tambahan melipatduakannya. |
| ❌ Mulai dengan memindahkan cakram terbesar | Ia tidak dapat bergerak sampai $n-1$ cakram yang lebih kecil semuanya di tiang ketiga: selesaikan itu dulu. |
| ❌ Cakram besar boleh di atas yang kecil bila hanya sesaat | Tidak pernah: aturannya berlaku setiap saat, sehingga cakram terbesar memerlukan tiang tanpa cakram yang lebih kecil. |
| ❌ Rekursi memerlukan tumpukan $2^n$ panggilan | Ia membuat $2^{n+1}-1$ panggilan tetapi tidak pernah lebih dalam daripada $n$. |
| ❌ Menara 64 cakram akan segera selesai | Pada satu langkah per detik ia memerlukan $585$ miliar tahun, $42$ kali usia alam semesta. |
| ❌ Ada banyak solusi terpendek | Dengan tiga tiang tepat satu: setiap ketaksamaan dalam bukti harus berupa kesamaan. |
| ❌ Setiap posisi berjarak $2^n-1$ langkah dari tujuan | Jaraknya bergantung pada posisi: setelah $m$ langkah solusi terbaik, hanya tersisa $2^n-1-m$, dan cakram terbesar yang belum di tempatnya menentukan sisanya. |
| ❌ Tiang keempat hanya menghemat sedikit | Sepuluh cakram memerlukan $49$ langkah, bukan $1023$, dan $64$ cakram memerlukan $18\,433$ langkah, bukan $2^{64}-1$. |
| ❌ Pada versi perulangan cakram terkecil berganti arah | Ia selalu melangkah searah mengelilingi tiang, lebih dulu ke tujuan jika $n$ ganjil dan ke cadangan jika $n$ genap. |`,
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
              L(T`A larger disc may rest on a smaller one for a moment while moving.`, T`Cakram yang lebih besar boleh berada di atas yang lebih kecil sesaat ketika dipindah.`),
              L(T`The best solution for $n$ discs has exactly $2^n-1$ moves.`, T`Solusi terbaik untuk $n$ cakram memiliki tepat $2^n-1$ langkah.`),
              L(T`With three pegs there is more than one shortest solution.`, T`Dengan tiga tiang ada lebih dari satu solusi terpendek.`),
              L(T`The smallest disc moves at every other move.`, T`Cakram terkecil bergerak setiap dua langkah.`),
              L(T`With four pegs the same tower needs fewer moves.`, T`Dengan empat tiang menara yang sama memerlukan lebih sedikit langkah.`),
              L(T`In the best solution the largest disc moves exactly once.`, T`Dalam solusi terbaik cakram terbesar bergerak tepat sekali.`),
            ],
            answer: [false, true, false, true, true, true],
            explain: L(
              T`The rule holds at every moment. The shortest solution is unique because the proof's inequalities must all be equalities. The smallest disc moves on odd moves. A fourth peg helps a lot (49 moves for 10 discs). The largest disc moves once, in the middle.`,
              T`Aturannya berlaku setiap saat. Solusi terpendeknya tunggal karena semua ketaksamaan dalam bukti harus berupa kesamaan. Cakram terkecil bergerak pada langkah ganjil. Tiang keempat sangat membantu (49 langkah untuk 10 cakram). Cakram terbesar bergerak sekali, di tengah.`,
            ),
            hint: L(T`Look at the table of the seven moves for three discs.`, T`Lihat tabel tujuh langkah untuk tiga cakram.`),
          },
        },
        {
          kind: 'activity',
          title: L('Which disc moves?', 'Cakram mana yang bergerak?'),
          step: {
            kind: 'multi',
            id: 'p2',
            prompt: L(T`Which of these are right? Choose **all** that apply.`, T`Mana yang benar? Pilih **semua** yang benar.`),
            options: [
              L(T`move $12$ moves disc $3$`, T`langkah $12$ memindahkan cakram $3$`),
              L(T`move $8$ moves disc $4$`, T`langkah $8$ memindahkan cakram $4$`),
              L(T`move $7$ moves disc $3$`, T`langkah $7$ memindahkan cakram $3$`),
              L(T`move $6$ moves disc $2$`, T`langkah $6$ memindahkan cakram $2$`),
              L(T`move $16$ moves disc $4$`, T`langkah $16$ memindahkan cakram $4$`),
            ],
            answer: [0, 1, 3],
            explain: L(T`Disc number is the number of trailing zeros of $m$ in binary, plus one: $12=1100_2$ has two, so disc $3$; $8=1000_2$ has three, so disc $4$; $6=110_2$ has one, so disc $2$. $7=111_2$ has none, so disc $1$; $16=10000_2$ has four, so disc $5$.`, T`Nomor cakram adalah banyaknya nol di ujung $m$ dalam biner, ditambah satu: $12=1100_2$ memiliki dua, jadi cakram $3$; $8=1000_2$ memiliki tiga, jadi cakram $4$; $6=110_2$ memiliki satu, jadi cakram $2$. $7=111_2$ tidak punya, jadi cakram $1$; $16=10000_2$ memiliki empat, jadi cakram $5$.`),
            hint: L(T`Write the move number in binary and count the zeros at its right end.`, T`Tulis nomor langkah dalam biner dan hitung nol di ujung kanannya.`),
          },
        },
        {
          kind: 'activity',
          title: L('Six discs', 'Enam cakram'),
          step: {
            kind: 'math',
            id: 'p3',
            hints: [L(T`The number of moves is $2^n-1$.`, T`Banyaknya langkah adalah $2^n-1$.`), L(T`$2^6=64$.`, T`$2^6=64$.`)],
            explain: L(T`$2^6-1=63$ moves.`, T`$2^6-1=63$ langkah.`),
            prompt: L(T`How many moves does the best solution of the Tower of Hanoi with $6$ discs use?`, T`Berapa banyak langkah yang dipakai solusi terbaik Menara Hanoi dengan $6$ cakram?`),
            given: String.raw`T=v`,
            blanks: [{ label: 'T =', answer: 63 }],
          },
        },
        {
          kind: 'activity',
          title: L('How often does the smallest disc move?', 'Seberapa sering cakram terkecil bergerak?'),
          step: {
            kind: 'math',
            id: 'p4',
            hints: [L(T`Disc number $k$ moves $2^{n-k}$ times.`, T`Cakram nomor $k$ bergerak $2^{n-k}$ kali.`), L(T`For $n=6$ and $k=1$: $2^5$.`, T`Untuk $n=6$ dan $k=1$: $2^5$.`)],
            explain: L(T`The smallest disc moves $2^{6-1}=32$ times, at every odd move of the $63$.`, T`Cakram terkecil bergerak $2^{6-1}=32$ kali, pada setiap langkah ganjil dari $63$.`),
            prompt: L(T`How many times does the smallest disc move in the best solution with $6$ discs?`, T`Berapa kali cakram terkecil bergerak dalam solusi terbaik dengan $6$ cakram?`),
            given: String.raw`k=v`,
            blanks: [{ label: 'k =', answer: 32 }],
          },
        },
        {
          kind: 'activity',
          title: L('The recurrence', 'Rekurensi'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [L(T`$T(1)=1$, $T(2)=2\cdot1+1=3$, $T(3)=7$, …`, T`$T(1)=1$, $T(2)=2\cdot1+1=3$, $T(3)=7$, …`), L(T`$T(6)=63$, so $T(7)=2\cdot63+1$.`, T`$T(6)=63$, sehingga $T(7)=2\cdot63+1$.`)],
            explain: L(T`$T(7)=2\cdot63+1=127=2^7-1$.`, T`$T(7)=2\cdot63+1=127=2^7-1$.`),
            prompt: L(T`If $T(n)=2T(n-1)+1$ and $T(1)=1$, what is $T(7)$?`, T`Jika $T(n)=2T(n-1)+1$ dan $T(1)=1$, berapa $T(7)$?`),
            given: String.raw`T(7)=v`,
            blanks: [{ label: 'T(7) =', answer: 127 }],
          },
        },
        {
          kind: 'activity',
          title: L('The ruler sequence', 'Barisan penggaris'),
          step: {
            kind: 'math',
            id: 'p6',
            hints: [L(T`$24$ in binary is $11000$.`, T`$24$ dalam biner adalah $11000$.`), L(T`Three trailing zeros, so the disc number is $3+1$.`, T`Tiga nol di ujung, jadi nomor cakramnya $3+1$.`)],
            explain: L(T`$24=11000_2$ has $3$ trailing zeros, so move $24$ moves disc number $4$.`, T`$24=11000_2$ memiliki $3$ nol di ujung, sehingga langkah $24$ memindahkan cakram nomor $4$.`),
            prompt: L(T`Which disc (the smallest is $1$) moves at move number $24$?`, T`Cakram mana (yang terkecil $1$) yang bergerak pada langkah nomor $24$?`),
            given: String.raw`d=v`,
            blanks: [{ label: 'd =', answer: 4 }],
          },
        },
        {
          kind: 'activity',
          title: L('Thirty discs', 'Tiga puluh cakram'),
          step: {
            kind: 'quiz',
            id: 'p7',
            prompt: L(T`At one move a second, about how long do $30$ discs take?`, T`Pada satu langkah per detik, kira-kira berapa lama $30$ cakram?`),
            options: [
              L(T`about $34$ years ($2^{30}-1\approx1.07\times10^9$ seconds)`, T`sekitar $34$ tahun ($2^{30}-1\approx1{,}07\times10^9$ detik)`),
              L(T`about $30$ seconds`, T`sekitar $30$ detik`),
              L(T`about $17$ minutes`, T`sekitar $17$ menit`),
              L(T`about $585$ billion years`, T`sekitar $585$ miliar tahun`),
            ],
            answer: 0,
            explain: L(T`$2^{30}-1=1\,073\,741\,823$ seconds, and a year is about $3.156\times10^7$ seconds, so about $34$ years. ($17$ minutes is for $10$ discs, $585$ billion years for $64$.)`, T`$2^{30}-1=1\,073\,741\,823$ detik, dan setahun sekitar $3{,}156\times10^7$ detik, jadi sekitar $34$ tahun. ($17$ menit untuk $10$ cakram, $585$ miliar tahun untuk $64$.)`),
            hint: L(T`$2^{10}\approx1000$, so $2^{30}\approx10^9$.`, T`$2^{10}\approx1000$, sehingga $2^{30}\approx10^9$.`),
          },
        },
        {
          kind: 'activity',
          title: L('How many positions?', 'Berapa banyak posisi?'),
          step: {
            kind: 'math',
            id: 'p8',
            hints: [L(T`Each disc can be on any of the three pegs, and the order on a peg is forced.`, T`Setiap cakram dapat berada di tiang mana pun dari ketiganya, dan urutan pada tiang dipaksa.`), L(T`$3\cdot3\cdot3\cdot3\cdot3$.`, T`$3\cdot3\cdot3\cdot3\cdot3$.`)],
            explain: L(T`$3^5=243$ positions, the number of points in the graph for five discs.`, T`$3^5=243$ posisi, banyaknya titik dalam graf untuk lima cakram.`),
            prompt: L(T`How many different positions does a tower of $5$ discs on three pegs have?`, T`Berapa banyak posisi berbeda yang dimiliki menara $5$ cakram pada tiga tiang?`),
            given: String.raw`P=v`,
            blanks: [{ label: 'P =', answer: 243 }],
          },
        },
        {
          kind: 'activity',
          title: L('Four pegs', 'Empat tiang'),
          step: {
            kind: 'math',
            id: 'p9',
            hints: [L(T`The Frame–Stewart numbers for four pegs are $1,3,5,9,13,17,25,\ldots$`, T`Bilangan Frame–Stewart untuk empat tiang adalah $1,3,5,9,13,17,25,\ldots$`), L(T`$n=5$ is the fifth number.`, T`$n=5$ adalah bilangan kelima.`)],
            explain: L(T`The fifth term is $13$: for example $F(5,4)=2F(2,4)+F(3,3)=2\cdot3+7=13$. With three pegs it would be $31$.`, T`Suku kelima adalah $13$: misalnya $F(5,4)=2F(2,4)+F(3,3)=2\cdot3+7=13$. Dengan tiga tiang akan menjadi $31$.`),
            prompt: L(T`How many moves does the best known solution use for $5$ discs and $4$ pegs?`, T`Berapa banyak langkah yang dipakai solusi terbaik yang diketahui untuk $5$ cakram dan $4$ tiang?`),
            given: String.raw`F=v`,
            blanks: [{ label: 'F =', answer: 13 }],
          },
        },
        {
          kind: 'activity',
          title: L('Halfway through', 'Di tengah jalan'),
          step: {
            kind: 'quiz',
            id: 'p10',
            prompt: L(T`A tower of $5$ discs from $A$ to $C$ has had $15$ moves made. Where is the largest disc?`, T`Menara $5$ cakram dari $A$ ke $C$ sudah dilakukan $15$ langkah. Di mana cakram terbesar?`),
            options: [
              L(T`still on $A$: it moves at move $16$`, T`masih di $A$: ia bergerak pada langkah $16$`),
              L(T`on $B$`, T`di $B$`),
              L(T`on $C$`, T`di $C$`),
              L(T`it depends on the solution`, T`bergantung pada solusinya`),
            ],
            answer: 0,
            explain: L(T`The largest disc moves once, at move $2^{5-1}=16$. After $15$ moves the four smaller discs are on $B$ and the largest is still on $A$. The solution is unique, so it does not depend on the solver.`, T`Cakram terbesar bergerak sekali, pada langkah $2^{5-1}=16$. Setelah $15$ langkah keempat cakram yang lebih kecil ada di $B$ dan yang terbesar masih di $A$. Solusinya tunggal, sehingga tidak bergantung pada pemecahnya.`),
            hint: L(T`At which move number does the largest disc move?`, T`Pada langkah nomor berapa cakram terbesar bergerak?`),
          },
        },
        {
          kind: 'activity',
          title: L('Six discs and four pegs', 'Enam cakram dan empat tiang'),
          step: {
            kind: 'math',
            id: 'p11',
            hints: [L(T`Four-peg numbers: $1,3,5,9,13,17,\ldots$`, T`Bilangan empat tiang: $1,3,5,9,13,17,\ldots$`), L(T`$n=6$ is the sixth number.`, T`$n=6$ adalah bilangan keenam.`)],
            explain: L(T`$F(6,4)=17$: the differences are $2,2,4,4,4$, so $1+2+2+4+4+4=17$.`, T`$F(6,4)=17$: selisihnya $2,2,4,4,4$, sehingga $1+2+2+4+4+4=17$.`),
            prompt: L(T`How many moves does the best known solution use for $6$ discs and $4$ pegs?`, T`Berapa banyak langkah yang dipakai solusi terbaik yang diketahui untuk $6$ cakram dan $4$ tiang?`),
            given: String.raw`F=v`,
            blanks: [{ label: 'F =', answer: 17 }],
          },
        },
        {
          kind: 'activity',
          title: L('Why the recursion is shallow', 'Mengapa rekursinya dangkal'),
          step: {
            kind: 'quiz',
            id: 'p12',
            prompt: L(T`The recursive solution of $n=40$ discs makes about $2^{41}$ calls. Why does it not overflow the call stack?`, T`Solusi rekursif $n=40$ cakram membuat sekitar $2^{41}$ panggilan. Mengapa ia tidak meluapkan tumpukan panggilan?`),
            options: [
              L(T`only one call per size from $40$ down is open at any time: the depth is $n$`, T`hanya satu panggilan per ukuran dari $40$ turun yang terbuka pada satu saat: kedalamannya $n$`),
              L(T`the calls are made in parallel`, T`panggilan dilakukan secara paralel`),
              L(T`the computer remembers all $2^{41}$ calls`, T`komputer mengingat semua $2^{41}$ panggilan`),
              L(T`it does overflow, the puzzle cannot be solved by recursion`, T`ia memang meluap, teka-teki tidak dapat dipecahkan dengan rekursi`),
            ],
            answer: 0,
            explain: L(T`A call finishes before the next one of the same level starts, so the stack holds at most one call for each of the $n$ sizes. The program would take an enormous time ($2^{41}$ calls), but it needs very little stack.`, T`Sebuah panggilan selesai sebelum yang berikutnya pada tingkat yang sama dimulai, sehingga tumpukan memuat paling banyak satu panggilan untuk masing-masing dari $n$ ukuran. Program itu akan memakan waktu sangat lama ($2^{41}$ panggilan), tetapi memerlukan tumpukan yang sangat sedikit.`),
            hint: L(T`The depth of recursion is not the number of calls.`, T`Kedalaman rekursi bukan banyaknya panggilan.`),
          },
        },
      ],
    },

    /* --------------------------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: the Tower of Hanoi at a glance', 'Ringkasan: Menara Hanoi sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **Rules:** three pegs, one disc at a time, never a larger disc on a smaller one; $3^n$ positions.
- **Recursion:** solve $n-1$ onto the spare peg, move the largest, solve $n-1$ onto it; $T(n)=2T(n-1)+1$, so $T(n)=2^n-1$.
- **Optimal and unique:** the largest disc must move, with all others on the third peg before and the same work again after: $M(n)\ge2M(n-1)+1$.
- **Time:** $64$ discs, $2^{64}-1$ moves, $585$ billion years at one move a second; the recursion is $n$ deep.
- **Binary:** move $m$ moves disc $v+1$ for the lowest set bit $2^v$ of $m$; disc $k$ moves $2^{n-k}$ times; the loop version moves the smallest disc the same way around every other move; Gray code.
- **Graph:** the $3^n$ positions form a Sierpiński triangle, and the best solution is one side of it.
- **More pegs:** Frame–Stewart $F(n,p)=\min(2F(k,p)+F(n-k,p-1))$, optimal for $p=4$ (2014): $64$ discs in $18\,433$ moves.
- **History:** Lucas 1883, Dudeney 1907, Frame and Stewart 1941, Bousch 2014.`,
            T`- **Aturan:** tiga tiang, satu cakram sekali waktu, tidak pernah cakram besar di atas yang kecil; $3^n$ posisi.
- **Rekursi:** selesaikan $n-1$ ke tiang cadangan, pindahkan yang terbesar, selesaikan $n-1$ ke atasnya; $T(n)=2T(n-1)+1$, sehingga $T(n)=2^n-1$.
- **Optimal dan tunggal:** cakram terbesar harus bergerak, dengan semua yang lain di tiang ketiga sebelumnya dan kerja yang sama lagi sesudahnya: $M(n)\ge2M(n-1)+1$.
- **Waktu:** $64$ cakram, $2^{64}-1$ langkah, $585$ miliar tahun pada satu langkah per detik; rekursinya sedalam $n$.
- **Biner:** langkah $m$ memindahkan cakram $v+1$ untuk bit set terendah $2^v$ dari $m$; cakram $k$ bergerak $2^{n-k}$ kali; versi perulangan menggerakkan cakram terkecil searah setiap dua langkah; kode Gray.
- **Graf:** $3^n$ posisi membentuk segitiga Sierpiński, dan solusi terbaik adalah satu sisinya.
- **Lebih banyak tiang:** Frame–Stewart $F(n,p)=\min(2F(k,p)+F(n-k,p-1))$, optimal untuk $p=4$ (2014): $64$ cakram dalam $18\,433$ langkah.
- **Sejarah:** Lucas 1883, Dudeney 1907, Frame dan Stewart 1941, Bousch 2014.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Tower of Hanoi', 'Menara Hanoi'), definition: L('A puzzle of moving a stack of discs between three pegs, one disc at a time, never putting a larger disc on a smaller one.', 'Teka-teki memindahkan tumpukan cakram di antara tiga tiang, satu cakram sekali waktu, tanpa pernah menaruh cakram yang lebih besar di atas yang lebih kecil.') },
    { term: L('Recursion', 'Rekursi'), definition: L('A method of solving a problem by solving smaller copies of the same problem and combining the results.', 'Cara menyelesaikan masalah dengan menyelesaikan salinan masalah yang sama yang lebih kecil dan menggabungkan hasilnya.') },
    { term: L('Recurrence relation of moves', 'Relasi rekurensi langkah'), definition: L('The equation T(n) = 2T(n−1) + 1 for the number of moves of the best solution with n discs.', 'Persamaan T(n) = 2T(n−1) + 1 untuk banyaknya langkah solusi terbaik dengan n cakram.') },
    { term: L('Exponential growth', 'Pertumbuhan eksponensial'), definition: L('Growth in which each extra unit of input multiplies the cost by a constant, as each extra disc doubles the number of moves.', 'Pertumbuhan yang setiap satuan masukan tambahan mengalikan biaya dengan konstanta, seperti setiap cakram tambahan melipatduakan banyak langkah.') },
    { term: L('Ruler sequence', 'Barisan penggaris'), definition: L('The sequence 1, 2, 1, 3, 1, 2, 1, 4, … in which the term at position m is one plus the number of trailing zeros of m in binary.', 'Barisan 1, 2, 1, 3, 1, 2, 1, 4, … yang suku pada posisi m adalah satu ditambah banyaknya nol di ujung m dalam biner.') },
    { term: L('Gray code', 'Kode Gray'), definition: L('A binary numbering in which consecutive numbers differ in exactly one bit.', 'Penomoran biner yang bilangan berurutannya berbeda tepat satu bit.') },
    { term: L('Sierpiński triangle', 'Segitiga Sierpiński'), definition: L('A fractal made of three half-size copies of itself placed at the corners of a triangle; the graph of positions of the Tower of Hanoi has this shape.', 'Fraktal yang terdiri dari tiga salinan dirinya setengah ukuran yang ditempatkan di sudut-sudut segitiga; graf posisi Menara Hanoi berbentuk seperti ini.') },
    { term: L('Frame–Stewart numbers', 'Bilangan Frame–Stewart'), definition: L('The number of moves of the best known solutions of the Tower of Hanoi with four or more pegs, found by splitting the tower at the best place.', 'Banyaknya langkah solusi terbaik yang diketahui untuk Menara Hanoi dengan empat tiang atau lebih, ditemukan dengan membagi menara di tempat terbaik.') },
  ],

  howTo: [
    {
      name: L('How to solve the Tower of Hanoi', 'Cara menyelesaikan Menara Hanoi'),
      description: L('Use the recursive idea: clear the smaller discs onto the spare peg, move the largest disc, and rebuild the smaller discs on top of it.', 'Pakai gagasan rekursif: singkirkan cakram yang lebih kecil ke tiang cadangan, pindahkan cakram terbesar, dan bangun kembali cakram yang lebih kecil di atasnya.'),
      steps: [
        { name: L('Name the pegs', 'Beri nama tiang'), text: L('Call the pegs source, target and spare, and decide that the goal is to move n discs from the source to the target.', 'Sebut tiangnya asal, tujuan, dan cadangan, dan tentukan bahwa tujuannya memindahkan n cakram dari asal ke tujuan.') },
        { name: L('Clear the smaller discs', 'Singkirkan cakram yang lebih kecil'), text: L('Move the top n minus 1 discs from the source to the spare peg, by the same method with the roles of the pegs changed.', 'Pindahkan n dikurangi 1 cakram teratas dari asal ke tiang cadangan, dengan cara yang sama dan peran tiang yang diubah.') },
        { name: L('Move the largest disc', 'Pindahkan cakram terbesar'), text: L('Move the largest disc from the source to the target in one move.', 'Pindahkan cakram terbesar dari asal ke tujuan dalam satu langkah.') },
        { name: L('Rebuild on top', 'Bangun kembali di atas'), text: L('Move the n minus 1 discs from the spare peg onto the target, again by the same method, and stop when there are no discs left to move.', 'Pindahkan n dikurangi 1 cakram dari tiang cadangan ke tujuan, lagi dengan cara yang sama, dan berhenti ketika tidak ada lagi cakram untuk dipindah.') },
      ],
    },
    {
      name: L('How to solve the Tower of Hanoi without recursion', 'Cara menyelesaikan Menara Hanoi tanpa rekursi'),
      description: L('Alternate between moving the smallest disc in a fixed direction and making the only other legal move.', 'Bergantian antara memindahkan cakram terkecil ke arah tetap dan melakukan satu-satunya langkah sah yang lain.'),
      steps: [
        { name: L('Choose the direction', 'Pilih arahnya'), text: L('If the number of discs is odd the smallest disc will step source to target to spare, and if it is even source to spare to target.', 'Jika banyak cakram ganjil cakram terkecil akan melangkah asal ke tujuan ke cadangan, dan jika genap asal ke cadangan ke tujuan.') },
        { name: L('Move the smallest disc', 'Pindahkan cakram terkecil'), text: L('On every odd move, move the smallest disc one peg onward in that direction.', 'Pada setiap langkah ganjil, pindahkan cakram terkecil satu tiang ke depan menurut arah itu.') },
        { name: L('Make the other legal move', 'Lakukan langkah sah yang lain'), text: L('On every even move, look at the two pegs without the smallest disc and move the smaller of their top discs onto the other peg.', 'Pada setiap langkah genap, lihat dua tiang tanpa cakram terkecil dan pindahkan yang lebih kecil dari cakram teratas keduanya ke tiang yang lain.') },
        { name: L('Stop at 2 to the n minus 1', 'Berhenti di 2 pangkat n dikurangi 1'), text: L('After two to the power n minus one moves the whole tower is on the target peg.', 'Setelah dua pangkat n dikurangi satu langkah seluruh menara berada di tiang tujuan.') },
      ],
    },
  ],

  faq: [
    {
      q: L('What is the minimum number of moves in the Tower of Hanoi?', 'Berapa langkah minimum dalam Menara Hanoi?'),
      a: L(
        'With three pegs and n discs the minimum is two to the power n minus one. Three discs take 7 moves, four take 15 and ten take 1023, and no solution can do better because the largest disc forces the work to repeat.',
        'Dengan tiga tiang dan n cakram minimumnya dua pangkat n dikurangi satu. Tiga cakram memerlukan 7 langkah, empat memerlukan 15 dan sepuluh memerlukan 1023, dan tidak ada solusi yang lebih baik karena cakram terbesar memaksa kerja itu berulang.',
      ),
    },
    {
      q: L('How do you solve the Tower of Hanoi step by step?', 'Bagaimana menyelesaikan Menara Hanoi langkah demi langkah?'),
      a: L(
        'Move the top n minus 1 discs to the spare peg, move the largest disc to the target, then move the n minus 1 discs from the spare peg onto the target. Each of the two big moves is the same puzzle with fewer discs.',
        'Pindahkan n dikurangi 1 cakram teratas ke tiang cadangan, pindahkan cakram terbesar ke tujuan, lalu pindahkan n dikurangi 1 cakram dari tiang cadangan ke tujuan. Masing-masing dari dua pemindahan besar itu adalah teka-teki yang sama dengan lebih sedikit cakram.',
      ),
    },
    {
      q: L('Is there an iterative solution to the Tower of Hanoi?', 'Adakah solusi iteratif untuk Menara Hanoi?'),
      a: L(
        'Yes. On odd moves shift the smallest disc one peg in a fixed direction around the pegs, and on even moves make the only legal move that does not involve the smallest disc. It makes exactly the same moves as the recursion.',
        'Ada. Pada langkah ganjil geser cakram terkecil satu tiang menurut arah tetap mengelilingi tiang, dan pada langkah genap lakukan satu-satunya langkah sah yang tidak melibatkan cakram terkecil. Ia membuat langkah yang persis sama dengan rekursi.',
      ),
    },
    {
      q: L('Is the shortest Tower of Hanoi solution unique?', 'Apakah solusi terpendek Menara Hanoi tunggal?'),
      a: L(
        'With three pegs, yes. A solution with exactly two to the n minus one moves must move the largest disc once, and the moves before and after it must each be a shortest solution for one disc fewer, so induction leaves only one.',
        'Dengan tiga tiang, ya. Solusi dengan tepat dua pangkat n dikurangi satu langkah harus memindahkan cakram terbesar sekali, dan langkah sebelum dan sesudahnya masing-masing harus solusi terpendek untuk satu cakram lebih sedikit, sehingga induksi menyisakan satu.',
      ),
    },
    {
      q: L('How long would it take to solve the 64-disc Tower of Hanoi?', 'Berapa lama menyelesaikan Menara Hanoi 64 cakram?'),
      a: L(
        'It needs 18,446,744,073,709,551,615 moves. At one move a second that is about 585 billion years, roughly 42 times the age of the universe, and even a billion moves a second would still take about 585 years.',
        'Ia memerlukan 18.446.744.073.709.551.615 langkah. Pada satu langkah per detik itu sekitar 585 miliar tahun, kira-kira 42 kali usia alam semesta, dan bahkan semiliar langkah per detik masih memerlukan sekitar 585 tahun.',
      ),
    },
    {
      q: L('How are the Tower of Hanoi and Gray code related?', 'Bagaimana hubungan Menara Hanoi dan kode Gray?'),
      a: L(
        'The disc moved at move m is given by the lowest set bit of m, the ruler sequence, and the same sequence tells which bit changes between consecutive Gray codes. So bit k of the Gray code of m shows whether disc k plus one has moved an odd number of times.',
        'Cakram yang dipindah pada langkah m ditentukan oleh bit set terendah m, barisan penggaris, dan barisan yang sama menunjukkan bit mana yang berubah di antara kode Gray berurutan. Jadi bit k kode Gray m menunjukkan apakah cakram k ditambah satu sudah bergerak sebanyak ganjil kali.',
      ),
    },
    {
      q: L('What is the Frame–Stewart conjecture?', 'Apa itu dugaan Frame–Stewart?'),
      a: L(
        'It says the fewest moves with four or more pegs come from moving the top k discs to a spare peg, the rest with one fewer peg, then the k discs again, with the best k. It is proved for four pegs, and open for more.',
        'Dugaan ini berkata langkah paling sedikit dengan empat tiang atau lebih berasal dari memindahkan k cakram teratas ke tiang cadangan, sisanya dengan satu tiang lebih sedikit, lalu k cakram itu lagi, dengan k terbaik. Ia terbukti untuk empat tiang, dan terbuka untuk lebih banyak.',
      ),
    },
    {
      q: L('Why is recursion a natural way to solve the Tower of Hanoi?', 'Mengapa rekursi cara yang wajar untuk menyelesaikan Menara Hanoi?'),
      a: L(
        'Because moving n discs contains two smaller copies of the same task, moving n minus 1 discs, with only the roles of the pegs changed. The recursion is never deeper than n, even though it makes about two to the n calls.',
        'Karena memindahkan n cakram memuat dua salinan tugas yang sama yang lebih kecil, memindahkan n dikurangi 1 cakram, dengan hanya peran tiang yang berubah. Rekursinya tidak pernah lebih dalam daripada n, meskipun membuat sekitar dua pangkat n panggilan.',
      ),
    },
  ],

  references: [
    { title: 'The Tower of Hanoi – Myths and Maths (2nd ed.)', author: 'Andreas M. Hinz, Sandi Klavžar, Ciril Petr', year: 2018, source: 'Birkhäuser' },
    { title: 'Concrete Mathematics (2nd ed.), section 1.1: The Tower of Hanoi', author: 'Ronald L. Graham, Donald E. Knuth, Oren Patashnik', year: 1994, source: 'Addison-Wesley' },
    { title: 'La Tour d\'Hanoï, véritable casse-tête annamite', author: 'N. Claus (de Siam) [Édouard Lucas]', year: 1883, source: 'Paris, Paul Bousrez' },
    { title: 'La quatrième tour de Hanoï', author: 'Thierry Bousch', year: 2014, source: 'Bulletin of the Belgian Mathematical Society – Simon Stevin 21' },
    { title: 'Solution to Advanced Problem 3918', author: 'J. S. Frame and B. M. Stewart', year: 1941, source: 'The American Mathematical Monthly 48' },
    { title: 'The Canterbury Puzzles', author: 'Henry E. Dudeney', year: 1907, source: 'Heinemann, London' },
  ],

  related: ['big-o-notation', 'binary-numbers', 'geometric-sequences-and-series', 'fibonacci-numbers'],
}
