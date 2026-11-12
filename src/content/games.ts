import type { Loc } from './types'

/** The Games section: the list page, and each game's page text. Like `about.ts` and the articles, one source for what the running app shows and what the
 *  build writes into the static HTML. Text is "rich": `$math$`, `**bold**`, `- ` lists, `1. ` steps, `| a | b |` tables and `[words](article:id)` links. */

const L = (en: string, id: string): Loc => ({ en, id })

export type GameId = 'real-number-match' | 'number-fish' | 'code-maze' | 'number-line'

export interface GameMeta {
  id: GameId
  /** the address of the game page, per language: /games/real-number-match and /permainan/pasangkan-bilangan-real */
  slug: Record<'en' | 'id', string>
  icon: string
  title: Loc
  /** the <title>, with room for the site name to be left off */
  seoTitle: Loc
  description: Loc
  keywords: Loc
  /** one line for the card on the list page */
  tagline: Loc
  /** the opening answer, in the box under the title */
  answer: Loc
  published: string
  updated: string
  sections: { id: string; heading: Loc; text: Loc }[]
  faq: { q: Loc; a: Loc }[]
  /** what playing it practises, for the structured data */
  teaches: Loc[]
}

export const GAMES_PAGE = {
  title: L('Games', 'Permainan'),
  seoTitle: L('Free Learning Games: Math and Coding Games in English and Indonesian', 'Game Belajar Gratis: Permainan Matematika dan Coding dalam Dua Bahasa'),
  description: L(
    'Free math and coding games that train one skill at a time: pair the cards, swim among the numbers, put each number on the line, program a robot out of a maze. Play in English or Indonesian, on a phone or a computer.',
    'Permainan matematika dan coding gratis yang melatih satu keterampilan sekaligus: pasangkan kartu, berenang di antara bilangan, letakkan setiap bilangan pada garis, susun program agar robot keluar dari labirin. Mainkan dalam bahasa Indonesia atau Inggris.',
  ),
  keywords: L(
    'math games, free math card games, matching games for fractions and decimals, number line game, learn math by playing, bilingual math games, real number games',
    'permainan matematika, game kartu matematika gratis, game mencocokkan pecahan dan desimal, game garis bilangan, belajar matematika sambil bermain, permainan matematika dua bahasa, game bilangan real',
  ),
  intro: L(
    'Short games, each built around one idea. They need no account, they save your best score in this browser, and every answer is checked exactly, the way the lessons check it.',
    'Permainan singkat, masing-masing dibangun di sekitar satu gagasan. Tidak perlu akun, skor terbaikmu disimpan di browser ini, dan setiap jawaban diperiksa secara eksak, seperti yang dilakukan pelajaran.',
  ),
}

export const GAMES: GameMeta[] = [
  {
    id: 'real-number-match',
    slug: { en: 'real-number-match', id: 'pasangkan-bilangan-real' },
    icon: '🃏',
    title: L('Real Number Match: Pair the Cards That Name the Same Number', 'Pasangkan Bilangan Real: Cocokkan Kartu yang Bernilai Sama'),
    seoTitle: L('Real Number Match: a Fraction, Decimal and Percent Game', 'Pasangkan Bilangan Real: Game Pecahan, Desimal, dan Persen'),
    description: L(
      'A free card game: pair the fractions, decimals, percents, repeating decimals, powers and square roots that are the same real number. Three levels.',
      'Permainan kartu gratis: pasangkan pecahan, desimal, persen, desimal berulang, pangkat, dan akar yang merupakan bilangan real yang sama. Tiga tingkat.',
    ),
    keywords: L(
      'real number match game, matching fractions and decimals game, equivalent fractions decimals and percents, repeating decimal matching game, scientific notation matching cards, square root matching game, rational and irrational number game, math memory game, is 0.999 equal to 1',
      'game pasangkan bilangan real, game mencocokkan pecahan dan desimal, pecahan desimal dan persen yang senilai, game mencocokkan desimal berulang, kartu notasi ilmiah, game mencocokkan bentuk akar, game bilangan rasional dan irasional, game memori matematika, apakah 0,999 sama dengan 1',
    ),
    tagline: L('Find the two cards that show the same number in different clothes.', 'Temukan dua kartu yang menunjukkan bilangan yang sama dengan rupa berbeda.'),
    answer: L(
      '**Find the two cards that show the same real number written in different ways, such as $\\frac{3}{4}$, $0.75$ and $75\\%$.** Every pair is checked exactly, not by rounding: $0.33$ never matches $\\frac13$, and $0.\\overline{9}$ does match $1$.',
      '**Temukan dua kartu yang menunjukkan bilangan real yang sama dengan cara penulisan berbeda, seperti $\\frac{3}{4}$, $0{,}75$, dan $75\\%$.** Setiap pasangan diperiksa secara eksak, tanpa pembulatan: $0{,}33$ tidak pernah cocok dengan $\\frac13$, dan $0{,}\\overline{9}$ justru cocok dengan $1$.',
    ),
    published: '2026-11-06',
    updated: '2026-11-06',
    sections: [
      {
        id: 'how-to-play',
        heading: L('How do you play Real Number Match?', 'Bagaimana cara memainkan Pasangkan Bilangan Real?'),
        text: L(
          `1. Pick a level and a mode, then look at the cards.
2. Tap one card, then tap the card you think is the same number. If they are equal they stay together and the pair is written out below the board. If not, they turn back and a mistake is counted.
3. Find every pair to finish. You earn one to three stars from the number of mistakes; your best game for each level and mode is kept in this browser.

There are two modes. In **open cards** everything is face up and the game is about telling numbers apart. In **memory** the cards are face down and you also have to remember where each one is.`,
          `1. Pilih tingkat dan mode, lalu perhatikan kartunya.
2. Ketuk satu kartu, lalu ketuk kartu yang menurutmu bilangannya sama. Bila sama, keduanya tetap bersama dan pasangannya dituliskan di bawah papan. Bila tidak, keduanya terbalik lagi dan satu kesalahan dihitung.
3. Temukan semua pasangan untuk menyelesaikan permainan. Kamu mendapat satu sampai tiga bintang dari banyaknya kesalahan; permainan terbaikmu untuk tiap tingkat dan mode disimpan di browser ini.

Ada dua mode. Pada **kartu terbuka** semua kartu menghadap ke atas dan permainannya adalah membedakan bilangan. Pada **memori** kartu menghadap ke bawah dan kamu juga harus mengingat letak tiap kartu.`,
        ),
      },
      {
        id: 'levels',
        heading: L('What is on the cards at each level?', 'Apa saja yang ada pada kartu di setiap tingkat?'),
        text: L(
          `| Level | Pairs | Forms on the cards |
|---|---|---|
| Easy | $6$ | fractions (also not in lowest terms), mixed numbers, decimals that end, percents |
| Medium | $8$ | adds repeating decimals, negative numbers, scientific notation and powers such as $2^{-3}$ |
| Hard | $10$ | adds square roots in several forms ($2\\sqrt{2}$, $\\sqrt{8}$, $\\frac{4}{\\sqrt{2}}$), products of roots, rational exponents such as $8^{\\frac23}$ and nines such as $0.\\overline{9}$ |

From the medium level on, the numbers on the board are chosen to look alike, such as $\\frac13$ and $0.33$ or $\\sqrt2$ and $\\sqrt3$, because telling near numbers apart is the whole point.`,
          `| Tingkat | Pasangan | Bentuk pada kartu |
|---|---|---|
| Mudah | $6$ | pecahan (juga yang belum sederhana), pecahan campuran, desimal berhingga, persen |
| Sedang | $8$ | ditambah desimal berulang, bilangan negatif, notasi ilmiah, dan pangkat seperti $2^{-3}$ |
| Sulit | $10$ | ditambah akar kuadrat dalam beberapa bentuk ($2\\sqrt{2}$, $\\sqrt{8}$, $\\frac{4}{\\sqrt{2}}$), hasil kali akar, pangkat rasional seperti $8^{\\frac23}$, dan angka sembilan seperti $0{,}\\overline{9}$ |

Mulai tingkat sedang, bilangan di papan dipilih agar mirip, seperti $\\frac13$ dan $0{,}33$ atau $\\sqrt2$ dan $\\sqrt3$, karena membedakan bilangan yang berdekatan adalah inti permainannya.`,
        ),
      },
      {
        id: 'why-many-names',
        heading: L('Why can one number be written in so many ways?', 'Mengapa satu bilangan dapat ditulis dengan begitu banyak cara?'),
        text: L(
          `A real number is a point on the number line, and a written form is only a way of pointing to it. $\\frac12$, $0.5$, $50\\%$ and $5\\times10^{-1}$ point to the same place. A fraction and a decimal that ends or repeats are the **rational numbers**, explained in [rational numbers](article:rational-numbers); a number such as $\\sqrt2$ never ends and never repeats, and belongs to the [irrational numbers](article:irrational-numbers). The forms with powers and roots come from [exponents and radicals](article:exponents-and-radicals), and the whole picture is in [real numbers](article:real-numbers).

Because a number can be written in many ways, two different-looking cards can be equal, and two similar-looking ones can differ: $0.\\overline{9}$ is not a little less than $1$, it is $1$.`,
          `Bilangan real adalah sebuah titik pada garis bilangan, dan bentuk tulisan hanyalah cara menunjuk titik itu. $\\frac12$, $0{,}5$, $50\\%$, dan $5\\times10^{-1}$ menunjuk tempat yang sama. Pecahan dan desimal yang berhenti atau berulang adalah **bilangan rasional**, yang dijelaskan di [bilangan rasional](article:rational-numbers); bilangan seperti $\\sqrt2$ tidak pernah berhenti dan tidak pernah berulang, dan termasuk [bilangan irasional](article:irrational-numbers). Bentuk dengan pangkat dan akar berasal dari [eksponen dan radikal](article:exponents-and-radicals), dan gambaran utuhnya ada di [bilangan real](article:real-numbers).

Karena sebuah bilangan dapat ditulis dengan banyak cara, dua kartu yang tampak berbeda dapat sama, dan dua kartu yang tampak mirip dapat berbeda: $0{,}\\overline{9}$ bukan sedikit kurang dari $1$, ia adalah $1$.`,
        ),
      },
    ],
    faq: [
      {
        q: L('How do I play Real Number Match?', 'Bagaimana cara bermain Pasangkan Bilangan Real?'),
        a: L(
          'Tap two cards that show the same real number written in different ways, for example one half as a fraction and as 50 percent. Equal cards stay together, unequal cards turn back and count as a mistake. Find all the pairs to finish.',
          'Ketuk dua kartu yang menunjukkan bilangan real yang sama dengan cara penulisan berbeda, misalnya setengah sebagai pecahan dan sebagai 50 persen. Kartu yang sama tetap bersama, kartu yang tidak sama terbalik lagi dan dihitung sebagai kesalahan. Temukan semua pasangan untuk menyelesaikannya.',
        ),
      },
      {
        q: L('How are the stars in the game decided?', 'Bagaimana bintang dalam permainan ditentukan?'),
        a: L(
          'By the number of mistakes. In the open game no mistakes earns three stars and a few earn two; in the memory game, where some wrong tries are how you find the cards, more mistakes are allowed for each star.',
          'Dari banyaknya kesalahan. Pada permainan terbuka tanpa kesalahan memberi tiga bintang dan beberapa kesalahan memberi dua; pada permainan memori, yang sebagian tebakan salahnya adalah cara menemukan kartu, kesalahan yang diizinkan untuk tiap bintang lebih banyak.',
        ),
      },
      {
        q: L('Does the game save my score?', 'Apakah permainan menyimpan skorku?'),
        a: L(
          'Your best result for each level and mode is kept in this browser only. There is no account and nothing is sent anywhere; clearing the site data in your browser clears the scores too.',
          'Hasil terbaikmu untuk tiap tingkat dan mode hanya disimpan di browser ini. Tidak ada akun dan tidak ada yang dikirim ke mana pun; menghapus data situs di browser juga menghapus skornya.',
        ),
      },
      {
        q: L('Which math topics does the game practise?', 'Topik matematika apa yang dilatih permainan ini?'),
        a: L(
          'Equivalent fractions, mixed numbers, converting between fractions, decimals and percents, repeating decimals, scientific notation, powers with negative and fractional exponents, and simplifying square roots, including rationalizing a denominator.',
          'Pecahan senilai, pecahan campuran, mengubah antara pecahan, desimal, dan persen, desimal berulang, notasi ilmiah, pangkat dengan eksponen negatif dan pecahan, serta menyederhanakan akar kuadrat, termasuk merasionalkan penyebut.',
        ),
      },
    ],
    teaches: [
      L('Equivalent fractions, decimals and percents', 'Pecahan, desimal, dan persen yang senilai'),
      L('Repeating decimals and scientific notation', 'Desimal berulang dan notasi ilmiah'),
      L('Exponents, roots and square roots', 'Eksponen, akar, dan akar kuadrat'),
    ],
  },
  {
    id: 'number-fish',
    slug: { en: 'number-fish', id: 'ikan-bilangan' },
    icon: '🐟',
    title: L('Number Fish: Eat the Smaller Numbers, Flee the Larger', 'Ikan Bilangan: Makan Bilangan yang Lebih Kecil, Hindari yang Lebih Besar'),
    seoTitle: L('Number Fish: a Real Number Comparing Game', 'Ikan Bilangan: Game Membandingkan Bilangan Real'),
    description: L(
      'A free fish game for comparing real numbers: eat the fish with a smaller number and flee the larger. Fractions, decimals, roots, π and e. Three levels.',
      'Permainan ikan gratis untuk membandingkan bilangan real: makan ikan berbilangan lebih kecil dan hindari yang lebih besar. Pecahan, desimal, akar, π, dan e.',
    ),
    keywords: L(
      'number fish game, comparing real numbers game, ordering fractions and decimals game, which number is larger game, compare fractions decimals and percents, compare square roots and pi, comparing negative numbers game, feeding frenzy math game, greater than and less than game, math game for ordering numbers',
      'game ikan bilangan, game membandingkan bilangan real, game mengurutkan pecahan dan desimal, game bilangan mana yang lebih besar, membandingkan pecahan desimal dan persen, membandingkan akar dan pi, game membandingkan bilangan negatif, game matematika seperti feeding frenzy, game lebih besar dan lebih kecil, game matematika mengurutkan bilangan',
    ),
    tagline: L('Eat the fish with the smaller number; the larger ones eat you.', 'Makan ikan yang bilangannya lebih kecil; yang lebih besar akan memakanmu.'),
    answer: L(
      '**You swim a fish that carries a real number, and it eats every fish whose number is smaller than its own; a fish with a larger number eats you.** Equal numbers, such as $\\frac12$ and $0.5$, leave each other alone. Eat enough fish and yours grows into a larger number; reach the largest and you win.',
      '**Kamu menggerakkan seekor ikan yang membawa bilangan real, dan ia memakan setiap ikan yang bilangannya lebih kecil daripada miliknya; ikan yang bilangannya lebih besar akan memakanmu.** Bilangan yang sama, seperti $\\frac12$ dan $0{,}5$, saling membiarkan. Makan cukup banyak ikan dan ikanmu tumbuh menjadi bilangan yang lebih besar; capai yang terbesar dan kamu menang.',
    ),
    published: '2026-11-06',
    updated: '2026-11-06',
    sections: [
      {
        id: 'how-to-play',
        heading: L('How do you play Number Fish?', 'Bagaimana cara memainkan Ikan Bilangan?'),
        text: L(
          `1. Choose a level and press Start. Your fish is the gold one, with its number on its body.
2. Swim with the mouse, with a finger on a phone, or with the arrow keys or W A S D. Swim into a fish whose number is **smaller** than yours to eat it.
3. A fish with a **larger** number eats you: you lose one of your three lives and are safe for a moment. Fish with an **equal** number, written another way, do nothing.
4. Every few fish you eat, your fish grows and takes a larger number. Take the largest number of the level to win. Space or P pauses.

You earn three stars if you never lose a life, two if you lose one and one if you lose two. Each time something is eaten the two numbers are shown as a comparison, such as $\\frac35<\\frac58$, at the top of the pond.`,
          `1. Pilih tingkat lalu tekan Mulai. Ikanmu yang berwarna emas, dengan bilangannya di badan.
2. Berenanglah dengan mouse, dengan jari di ponsel, atau dengan tombol panah atau W A S D. Berenanglah ke ikan yang bilangannya **lebih kecil** daripada milikmu untuk memakannya.
3. Ikan yang bilangannya **lebih besar** memakanmu: kamu kehilangan satu dari tiga nyawa dan aman sesaat. Ikan dengan bilangan yang **sama**, ditulis dengan cara lain, tidak berbuat apa-apa.
4. Setiap beberapa ikan yang kamu makan, ikanmu tumbuh dan mengambil bilangan yang lebih besar. Ambil bilangan terbesar tingkat itu untuk menang. Spasi atau P menjeda.

Kamu mendapat tiga bintang bila tidak pernah kehilangan nyawa, dua bila kehilangan satu, dan satu bila kehilangan dua. Setiap ada yang termakan, kedua bilangan ditunjukkan sebagai perbandingan, seperti $\\frac35<\\frac58$, di bagian atas kolam.`,
        ),
      },
      {
        id: 'numbers-on-the-fish',
        heading: L('Which numbers are on the fish?', 'Bilangan apa saja yang ada pada ikan?'),
        text: L(
          `| Level | Numbers on the fish |
|---|---|
| Easy | fractions (also not in lowest terms), decimals that end and percents, from $\\frac1{20}$ up to $\\frac72$ |
| Medium | adds negative numbers, repeating decimals, scientific notation, powers such as $2^{-3}$, and one large number, $2500$ |
| Hard | adds square roots in several forms ($\\sqrt2$, $3\\sqrt2$, $\\frac{\\sqrt3}{3}$), roots and powers of whole numbers, and $\\pi$, $e$, $2\\pi$, $\\frac{\\pi}{2}$ |

Most of the time the fish that swim in have numbers close to yours, because telling near numbers apart is the whole game: $0.6$ against $\\frac58$, or $\\sqrt5$ against $\\frac94$.`,
          `| Tingkat | Bilangan pada ikan |
|---|---|
| Mudah | pecahan (juga yang belum sederhana), desimal berhingga, dan persen, dari $\\frac1{20}$ sampai $\\frac72$ |
| Sedang | ditambah bilangan negatif, desimal berulang, notasi ilmiah, pangkat seperti $2^{-3}$, dan satu bilangan besar, $2500$ |
| Sulit | ditambah akar kuadrat dalam beberapa bentuk ($\\sqrt2$, $3\\sqrt2$, $\\frac{\\sqrt3}{3}$), akar dan pangkat bilangan bulat, serta $\\pi$, $e$, $2\\pi$, $\\frac{\\pi}{2}$ |

Sebagian besar ikan yang datang bilangannya dekat dengan milikmu, karena membedakan bilangan yang berdekatan adalah inti permainannya: $0{,}6$ melawan $\\frac58$, atau $\\sqrt5$ melawan $\\frac94$.`,
        ),
      },
      {
        id: 'how-to-compare',
        heading: L('How do you tell quickly which number is larger?', 'Bagaimana cara cepat mengetahui bilangan mana yang lebih besar?'),
        text: L(
          `- **Turn both into decimals** when you can: $\\frac58=0.625$ is more than $0.6$, and $\\frac13=0.\\overline3$ is more than $0.33$.
- **Fractions:** put them over a common denominator, or cross-multiply: $\\frac35$ against $\\frac58$ is $3\\cdot8=24$ against $5\\cdot5=25$, so $\\frac58$ is the larger.
- **Negatives run backwards:** $-\\frac34$ is less than $-\\frac12$, and every negative number is less than every positive one.
- **Roots:** compare the squares. $\\sqrt5$ against $\\frac94$ is $5$ against $\\frac{81}{16}=5.0625$, so $\\sqrt5$ is the smaller.
- **$\\pi$ and $e$:** $\\pi=3.14159\\ldots$ is a little less than $\\frac{22}{7}=3.142857\\ldots$, and $e=2.71828\\ldots$.

The numbers behind these forms are explained in [real numbers](article:real-numbers), [rational numbers](article:rational-numbers) and [irrational numbers](article:irrational-numbers), and the powers and roots in [exponents and radicals](article:exponents-and-radicals).`,
          `- **Ubah keduanya menjadi desimal** bila bisa: $\\frac58=0{,}625$ lebih besar daripada $0{,}6$, dan $\\frac13=0{,}\\overline3$ lebih besar daripada $0{,}33$.
- **Pecahan:** samakan penyebutnya, atau kalikan silang: $\\frac35$ melawan $\\frac58$ adalah $3\\cdot8=24$ melawan $5\\cdot5=25$, jadi $\\frac58$ yang lebih besar.
- **Bilangan negatif terbalik:** $-\\frac34$ lebih kecil daripada $-\\frac12$, dan setiap bilangan negatif lebih kecil daripada setiap bilangan positif.
- **Akar:** bandingkan kuadratnya. $\\sqrt5$ melawan $\\frac94$ adalah $5$ melawan $\\frac{81}{16}=5{,}0625$, jadi $\\sqrt5$ yang lebih kecil.
- **$\\pi$ dan $e$:** $\\pi=3{,}14159\\ldots$ sedikit lebih kecil daripada $\\frac{22}{7}=3{,}142857\\ldots$, dan $e=2{,}71828\\ldots$.

Bilangan di balik bentuk-bentuk ini dijelaskan di [bilangan real](article:real-numbers), [bilangan rasional](article:rational-numbers), dan [bilangan irasional](article:irrational-numbers), sedangkan pangkat dan akar di [eksponen dan radikal](article:exponents-and-radicals).`,
        ),
      },
    ],
    faq: [
      {
        q: L('How do I play Number Fish?', 'Bagaimana cara bermain Ikan Bilangan?'),
        a: L(
          'Swim your fish with the mouse, a finger or the arrow keys. It eats any fish with a smaller number than its own, and a fish with a larger number eats you. Eat enough fish to grow, and reach the largest number to win.',
          'Gerakkan ikanmu dengan mouse, jari, atau tombol panah. Ia memakan ikan yang bilangannya lebih kecil daripada miliknya, dan ikan yang bilangannya lebih besar memakanmu. Makan cukup banyak ikan untuk tumbuh, dan capai bilangan terbesar untuk menang.',
        ),
      },
      {
        q: L('What happens when two fish have equal numbers?', 'Apa yang terjadi bila dua ikan memiliki bilangan yang sama?'),
        a: L(
          'Nothing: neither eats the other. Equal numbers are equal however they are written, so one half as a fraction and 0.5 as a decimal, or 0.999… and 1, leave each other alone.',
          'Tidak terjadi apa-apa: tidak ada yang memakan yang lain. Bilangan yang sama tetap sama bagaimanapun penulisannya, jadi setengah sebagai pecahan dan 0,5 sebagai desimal, atau 0,999… dan 1, saling membiarkan.',
        ),
      },
      {
        q: L('How are the stars in Number Fish decided?', 'Bagaimana bintang dalam Ikan Bilangan ditentukan?'),
        a: L(
          'By the lives you have left when you win: all three lives earn three stars, two lives two stars, and one life one star. If you lose all three lives the game is lost, and you can play again.',
          'Dari nyawa yang tersisa saat kamu menang: tiga nyawa memberi tiga bintang, dua nyawa dua bintang, dan satu nyawa satu bintang. Bila ketiga nyawa habis, permainan kalah dan kamu bisa main lagi.',
        ),
      },
      {
        q: L('Can I play Number Fish on a phone or with a keyboard?', 'Bisakah memainkan Ikan Bilangan di ponsel atau dengan keyboard?'),
        a: L(
          'Yes: drag a finger across the pond on a phone, or use the arrow keys or W A S D on a computer. The Slow fish option makes the other fish swim slower, which gives more time to read the numbers, and Space or P pauses the game.',
          'Bisa: seret jari melintasi kolam di ponsel, atau pakai tombol panah atau W A S D di komputer. Pilihan Ikan lambat membuat ikan lain berenang lebih lambat sehingga ada lebih banyak waktu untuk membaca bilangan, dan Spasi atau P menjeda permainan.',
        ),
      },
      {
        q: L('Does Number Fish save my score?', 'Apakah Ikan Bilangan menyimpan skorku?'),
        a: L(
          'Your best score and stars for each level are kept in this browser only. There is no account and nothing is sent anywhere; clearing the site data in your browser clears the scores too.',
          'Skor dan bintang terbaikmu untuk tiap tingkat hanya disimpan di browser ini. Tidak ada akun dan tidak ada yang dikirim ke mana pun; menghapus data situs di browser juga menghapus skornya.',
        ),
      },
    ],
    teaches: [
      L('Comparing and ordering real numbers', 'Membandingkan dan mengurutkan bilangan real'),
      L('Fractions, decimals, percents and negative numbers', 'Pecahan, desimal, persen, dan bilangan negatif'),
      L('Comparing square roots, π and e', 'Membandingkan akar kuadrat, π, dan e'),
    ],
  },
  {
    id: 'code-maze',
    slug: { en: 'code-maze', id: 'labirin-kode' },
    icon: '🤖',
    title: L('Code Maze: Program a Robot Out of the Maze with Blocks', 'Labirin Kode: Susun Blok untuk Mengeluarkan Robot dari Labirin'),
    seoTitle: L('Code Maze: a Free Block Coding Game for Beginners', 'Labirin Kode: Game Coding Blok Gratis untuk Pemula'),
    description: L(
      'A free coding game: snap blocks together to guide a robot through mazes. Twenty levels in five tiers, from simple moves to loops, conditions and the right-hand rule.',
      'Game coding gratis: susun blok untuk memandu robot melewati labirin. Dua puluh level dalam lima tingkat, dari gerakan sederhana sampai perulangan, syarat, dan aturan tangan kanan.',
    ),
    keywords: L(
      'code maze game, block coding game, learn to code with blocks, programming game for beginners, robot maze game, loops and conditions for beginners, if else while loop game, right-hand rule maze, wall follower algorithm, coding puzzle game, visual programming for kids, algorithmic thinking game',
      'game labirin kode, game coding blok, belajar coding dengan blok, game pemrograman untuk pemula, game robot labirin, perulangan dan percabangan untuk pemula, game if else while, aturan tangan kanan labirin, algoritma pengikut dinding, game teka-teki coding, pemrograman visual untuk anak, game berpikir algoritmik',
    ),
    tagline: L('Build a program from blocks and watch the robot find its way out.', 'Susun program dari blok dan lihat robot menemukan jalan keluar.'),
    answer: L(
      '**You build a program out of blocks, press Run, and a robot carries it out on a map until it reaches the finish.** There are twenty levels in five tiers. The first only needs move and turn; later tiers add repeat, if and while, and the last asks for one short program that can find the way out of any maze.',
      '**Kamu menyusun program dari blok, menekan Jalankan, dan robot melaksanakannya di peta sampai tiba di finis.** Ada dua puluh level dalam lima tingkat. Tingkat pertama hanya memakai maju dan belok; tingkat berikutnya menambah ulangi, jika, dan selama, dan yang terakhir meminta satu program singkat yang dapat menemukan jalan keluar dari labirin mana pun.',
    ),
    published: '2026-11-12',
    updated: '2026-11-12',
    sections: [
      {
        id: 'how-to-play',
        heading: L('How do you play Code Maze?', 'Bagaimana cara memainkan Labirin Kode?'),
        text: L(
          `1. Pick a tier and a level. Read the goal above the map: usually to stop on the finish square, sometimes also to pick up every star.
2. Press a block in the palette to add it to your program. A block that holds others, such as **repeat**, **if** or **while**, opens ready to be filled; press a slot to choose where the next block goes.
3. Press **Run** to watch the robot, or **End** to jump to the result. The speed buttons make a long run quicker. When the program looks right, press **Check**: it is tried on every map of the level.
4. A solved level earns one to three stars from the number of blocks. Three stars need as few blocks as the model solution; looking at the solution caps the level at one star.

Some levels give several maps and one program has to work on all of them. Some limit the number of blocks, which is what makes a loop worth using. Your stars are kept in this browser.`,
          `1. Pilih tingkat dan level. Baca tujuannya di atas peta: biasanya berhenti di kotak finis, kadang juga mengambil semua bintang.
2. Tekan sebuah blok di palet untuk menambahkannya ke programmu. Blok yang menampung blok lain, seperti **ulangi**, **jika**, atau **selama**, terbuka siap diisi; tekan sebuah slot untuk memilih tempat blok berikutnya.
3. Tekan **Jalankan** untuk melihat robot, atau **Akhir** untuk langsung ke hasil. Tombol kecepatan membuat jalannya program yang panjang lebih cepat. Bila program tampak benar, tekan **Periksa**: program dicoba di setiap peta pada level itu.
4. Level yang selesai memberi satu sampai tiga bintang dari banyaknya blok. Tiga bintang memerlukan blok sesedikit solusi contoh; melihat solusi membatasi level itu pada satu bintang.

Beberapa level memberi beberapa peta dan satu program harus berhasil di semuanya. Beberapa membatasi jumlah blok, yang membuat perulangan layak dipakai. Bintangmu disimpan di browser ini.`,
        ),
      },
      {
        id: 'tiers',
        heading: L('What do the five tiers teach?', 'Apa yang diajarkan kelima tingkat?'),
        text: L(
          `| Tier | Blocks | The idea |
|---|---|---|
| 1 Sequence | move, turn, pick up | a program is a list of orders carried out in order |
| 2 Repeat | adds repeat | a pattern that comes back is written once |
| 3 If | adds if and while | the robot looks before it acts, so one program fits maps it has never seen |
| 4 Sensors | adds the left and right sensors | choosing a way at a corner and at a fork |
| 5 Mazes | the same blocks, bigger mazes with stars | the right-hand rule: a few blocks that solve any maze without loops |

A tier opens when you have solved three levels of the one before, so one stubborn level never blocks you.`,
          `| Tingkat | Blok | Gagasannya |
|---|---|---|
| 1 Urutan | maju, belok, ambil | program adalah daftar perintah yang dilaksanakan berurutan |
| 2 Ulangi | ditambah ulangi | pola yang kembali cukup ditulis sekali |
| 3 Jika | ditambah jika dan selama | robot melihat dulu sebelum bertindak, sehingga satu program cocok untuk peta yang belum pernah ia lihat |
| 4 Sensor | ditambah sensor kiri dan kanan | memilih jalan di tikungan dan di percabangan |
| 5 Labirin | blok yang sama, labirin lebih besar dengan bintang | aturan tangan kanan: beberapa blok yang menyelesaikan labirin mana pun yang tidak berputar |

Satu tingkat terbuka bila kamu sudah menyelesaikan tiga level pada tingkat sebelumnya, jadi satu level yang sulit tidak pernah menghalangimu.`,
        ),
      },
      {
        id: 'right-hand-rule',
        heading: L('What is the right-hand rule for mazes?', 'Apa itu aturan tangan kanan untuk labirin?'),
        text: L(
          `Walk through the maze with one hand always touching the wall on your right. At every step: **if the way on the right is open, turn right and step; otherwise, if the way ahead is open, step; otherwise turn left.** That is all, and it needs no map.

It works in any maze whose walls are all joined together, which means a maze with no loops and no rooms closed off. Every wall then connects to the outer wall, so a hand that follows the wall visits every corridor and must pass the exit. In the game this is a **while** block (until the robot is on the finish) with two **if** blocks inside. It is a small example of an *algorithm*: a fixed recipe that is correct for every input of its kind, not just for the one you tried. The same idea is explained for sorting and searching in [binary search and sorting](article:binary-search-and-sorting).`,
          `Jalanilah labirin dengan satu tangan selalu menyentuh tembok di sisi kananmu. Pada setiap langkah: **bila jalan di kanan terbuka, belok kanan lalu melangkah; bila tidak, dan jalan di depan terbuka, melangkah; bila tidak, belok kiri.** Hanya itu, dan tidak perlu peta.

Aturan ini berhasil di labirin mana pun yang seluruh temboknya tersambung, yaitu labirin tanpa putaran dan tanpa ruang yang tertutup. Setiap tembok lalu tersambung ke tembok luar, sehingga tangan yang mengikuti tembok melewati setiap lorong dan pasti melewati pintu keluar. Dalam game ini aturannya berupa blok **selama** (sampai robot di finis) dengan dua blok **jika** di dalamnya. Ini contoh kecil sebuah *algoritma*: resep tetap yang benar untuk setiap input sejenis, bukan hanya untuk yang kamu coba. Gagasan serupa untuk pengurutan dan pencarian dijelaskan di [pencarian biner dan pengurutan](article:binary-search-and-sorting).`,
        ),
      },
      {
        id: 'fewer-blocks',
        heading: L('Why do fewer blocks earn more stars?', 'Mengapa blok yang lebih sedikit memberi lebih banyak bintang?'),
        text: L(
          `A program that does the same job with fewer blocks has found the pattern in the problem. Walking a staircase one step at a time is sixteen orders, but it is one **repeat** of four. Following a corridor with any number of corners is four blocks if the robot looks before it moves. Short programs are also easier to read, to check and to change, which is why programmers prefer them. If you want to go on from here, the [Code Blocks course](/course/code-blocks) teaches the same blocks step by step, and its variables and your own blocks come next.`,
          `Program yang mengerjakan tugas yang sama dengan blok lebih sedikit telah menemukan pola dalam masalahnya. Menuruni tangga satu anak tangga demi satu anak tangga adalah enam belas perintah, tetapi hanya satu **ulangi** dengan empat blok di dalamnya. Menyusuri lorong dengan tikungan sebanyak apa pun cukup empat blok bila robot melihat sebelum melangkah. Program yang singkat juga lebih mudah dibaca, diperiksa, dan diubah, itulah sebabnya programmer menyukainya. Bila ingin melanjutkan, [kursus Code Blocks](/course/code-blocks) mengajarkan blok yang sama selangkah demi selangkah, dan variabel serta blok buatanmu sendiri menyusul sesudahnya.`,
        ),
      },
    ],
    faq: [
      {
        q: L('How do I play Code Maze?', 'Bagaimana cara bermain Labirin Kode?'),
        a: L(
          'Press blocks in the palette to build a program, press Run to watch the robot carry it out, and press Check to test it on every map of the level. Reach the finish, and pick up the stars when the level asks, to solve it.',
          'Tekan blok di palet untuk menyusun program, tekan Jalankan untuk melihat robot melaksanakannya, dan tekan Periksa untuk mengujinya di setiap peta pada level itu. Capai finis, dan ambil bintang bila level memintanya, untuk menyelesaikan level.',
        ),
      },
      {
        q: L('Do I need to know how to code?', 'Apakah saya harus bisa coding?'),
        a: L(
          'No. The first tier needs only two blocks, and each tier adds one idea at a time. The hints go from a small nudge to nearly the answer, and the game never types code: you only press blocks.',
          'Tidak. Tingkat pertama hanya memerlukan dua blok, dan setiap tingkat menambah satu gagasan sekali waktu. Petunjuknya bergerak dari dorongan kecil sampai hampir jawaban, dan game ini tidak pernah meminta mengetik kode: kamu hanya menekan blok.',
        ),
      },
      {
        q: L('How are the stars decided?', 'Bagaimana bintang ditentukan?'),
        a: L(
          'By the number of blocks in your program. As few blocks as the model solution earns three stars, up to a few more earns two, and any working program earns one. A level solved after looking at the solution counts for one star.',
          'Dari banyaknya blok di programmu. Sesedikit blok pada solusi contoh memberi tiga bintang, sedikit lebih banyak memberi dua, dan program apa pun yang berhasil memberi satu. Level yang diselesaikan setelah melihat solusi dihitung satu bintang.',
        ),
      },
      {
        q: L('Why does my program work on one map but not another?', 'Mengapa programku berhasil di satu peta tetapi tidak di peta lain?'),
        a: L(
          'Because it relies on something true only on that map, such as an exact number of squares. When a level gives several maps, let the robot look with the sensors instead of counting. The report under the map says which map failed and why.',
          'Karena programmu bergantung pada sesuatu yang hanya benar di peta itu, seperti jumlah kotak yang pas. Bila sebuah level memberi beberapa peta, biarkan robot melihat dengan sensor, bukan menghitung. Laporan di bawah peta menyebut peta mana yang gagal dan sebabnya.',
        ),
      },
      {
        q: L('Does Code Maze save my progress?', 'Apakah Labirin Kode menyimpan kemajuanku?'),
        a: L(
          'Your stars for each level are kept in this browser only. There is no account and nothing is sent anywhere; clearing the site data in your browser clears the stars too.',
          'Bintangmu untuk tiap level hanya disimpan di browser ini. Tidak ada akun dan tidak ada yang dikirim ke mana pun; menghapus data situs di browser juga menghapus bintangnya.',
        ),
      },
    ],
    teaches: [
      L('Sequencing instructions and algorithmic thinking', 'Mengurutkan perintah dan berpikir algoritmik'),
      L('Loops (repeat and while) and conditions (if and else)', 'Perulangan (ulangi dan selama) dan percabangan (jika dan kalau tidak)'),
      L('The right-hand rule, an algorithm for solving mazes', 'Aturan tangan kanan, algoritma untuk menyelesaikan labirin'),
    ],
  },
  {
    id: 'number-line',
    slug: { en: 'number-line', id: 'garis-bilangan' },
    icon: '📏',
    title: L('Number Line: Put Each Number Where It Belongs', 'Garis Bilangan: Letakkan Setiap Bilangan di Tempatnya'),
    seoTitle: L('Number Line: a Free Game for Fractions, Decimals and Negatives', 'Garis Bilangan: Game Gratis untuk Pecahan, Desimal, dan Bilangan Negatif'),
    description: L(
      'A free number line game: place integers, fractions, decimals, percents, negative numbers, square roots, π and e at the right spot. Five levels, from counting ticks to zooming in.',
      'Game garis bilangan gratis: letakkan bilangan bulat, pecahan, desimal, persen, bilangan negatif, akar, π, dan e di tempat yang tepat. Lima tingkat, dari menghitung tanda sampai memperbesar.',
    ),
    keywords: L(
      'number line game, placing numbers on a number line, fractions on a number line, decimals on a number line, negative numbers on a number line, integers on a number line, plotting square roots and pi on a number line, number line practice, learn fractions by playing, zoomed number line',
      'game garis bilangan, meletakkan bilangan pada garis bilangan, pecahan pada garis bilangan, desimal pada garis bilangan, bilangan negatif pada garis bilangan, bilangan bulat pada garis bilangan, menempatkan akar dan pi pada garis bilangan, latihan garis bilangan, belajar pecahan sambil bermain, garis bilangan diperbesar',
    ),
    tagline: L('A number appears; you put it on the line.', 'Sebuah bilangan muncul; kamu meletakkannya pada garis.'),
    answer: L(
      '**A number appears, written as a fraction, a decimal, a percent, a root or $\\pi$, and you move a marker to where it belongs on a number line.** On the first four levels the number is exactly on a tick, so only one tick is right; on the last level it lies between ticks, and being within 3% of the line counts.',
      '**Sebuah bilangan muncul, ditulis sebagai pecahan, desimal, persen, akar, atau $\\pi$, dan kamu menggeser penanda ke tempatnya pada garis bilangan.** Pada empat tingkat pertama bilangan itu tepat berada di satu tanda, sehingga hanya satu tanda yang benar; pada tingkat terakhir ia berada di antara tanda, dan dalam 3% panjang garis dianggap tepat.',
    ),
    published: '2026-11-13',
    updated: '2026-11-13',
    sections: [
      {
        id: 'how-to-play',
        heading: L('How do you play Number Line?', 'Bagaimana cara memainkan Garis Bilangan?'),
        text: L(
          `1. Pick a level. Ten numbers wait for you, one at a time. Read the number in the box above the line.
2. Tap or drag on the line to put the marker where the number goes. On the first four levels the marker jumps from tick to tick; the arrow buttons and the arrow keys move it one tick at a time.
3. Press **Check**. If the marker is on the right spot the number is shown in its other forms, such as $\\frac34=0.75=75\\%$. If not, you are told which side of the number your marker is on and what number it stands for, and you try again.
4. After two wrong tries you may ask to be shown the place. That number counts as missed.

You earn three stars for at most one mistake in the ten numbers, two for up to four, and one for finishing. Your best result for each level is kept in this browser.`,
          `1. Pilih tingkat. Sepuluh bilangan menunggumu, satu per satu. Baca bilangan di kotak di atas garis.
2. Ketuk atau seret pada garis untuk meletakkan penanda di tempat bilangan itu. Pada empat tingkat pertama penanda melompat dari tanda ke tanda; tombol panah di layar dan tombol panah di keyboard menggesernya satu tanda sekali.
3. Tekan **Periksa**. Bila penanda ada di tempat yang benar, bilangan itu ditunjukkan dalam bentuk lainnya, seperti $\\frac34=0{,}75=75\\%$. Bila belum, kamu diberi tahu penandamu ada di sisi mana dari bilangan itu dan bilangan apa yang ditunjuk penandamu, lalu kamu mencoba lagi.
4. Setelah dua kali salah, kamu boleh meminta tempatnya ditunjukkan. Bilangan itu dihitung gagal.

Kamu mendapat tiga bintang untuk paling banyak satu kesalahan dalam sepuluh bilangan, dua bintang untuk sampai empat, dan satu bintang karena menyelesaikannya. Hasil terbaikmu untuk tiap tingkat disimpan di browser ini.`,
        ),
      },
      {
        id: 'levels',
        heading: L('What are the five levels?', 'Apa saja kelima tingkatnya?'),
        text: L(
          `| Level | The line | The numbers |
|---|---|---|
| 1 Integers | ticks of $1$, $2$ or $5$, some of the line below $0$ | integers, negative ones too |
| 2 Fractions and decimals | from $0$, with each unit cut into $2$, $4$, $5$, $8$ or $10$ parts | fractions (also not in lowest terms), mixed numbers, decimals that end, percents |
| 3 Below zero | also left of $0$, with units cut in $3$ or $6$ parts | adds negative numbers and repeating decimals such as $0.\\overline{3}$ |
| 4 Zoom in | only the two ends are labelled, such as $0.4$ and $0.5$ or $\\frac12$ and $\\frac34$ | decimals, fractions and percents that sit between two close numbers |
| 5 Roots, $\\pi$ and $e$ | ticks at every half or whole number; the number is not on a tick | $\\sqrt2$, $\\frac{\\sqrt3}{2}$, $-\\sqrt5$, $\\pi$, $\\frac{\\pi}{2}$, $e$ and similar |

Every number in a game is different, and the line changes from number to number, so you have to read the line each time instead of remembering where things were.`,
          `| Tingkat | Garisnya | Bilangannya |
|---|---|---|
| 1 Bilangan bulat | tanda $1$, $2$, atau $5$, sebagian garis ada di bawah $0$ | bilangan bulat, termasuk yang negatif |
| 2 Pecahan dan desimal | mulai dari $0$, dengan setiap satuan dibagi $2$, $4$, $5$, $8$, atau $10$ bagian | pecahan (juga yang belum sederhana), pecahan campuran, desimal berhingga, persen |
| 3 Di bawah nol | juga di kiri $0$, dengan satuan dibagi $3$ atau $6$ bagian | ditambah bilangan negatif dan desimal berulang seperti $0{,}\\overline{3}$ |
| 4 Perbesar | hanya kedua ujung yang diberi label, seperti $0{,}4$ dan $0{,}5$ atau $\\frac12$ dan $\\frac34$ | desimal, pecahan, dan persen yang berada di antara dua bilangan yang berdekatan |
| 5 Akar, $\\pi$, dan $e$ | tanda pada setiap setengah atau bilangan bulat; bilangannya tidak berada di satu tanda | $\\sqrt2$, $\\frac{\\sqrt3}{2}$, $-\\sqrt5$, $\\pi$, $\\frac{\\pi}{2}$, $e$, dan sejenisnya |

Setiap bilangan dalam satu permainan berbeda, dan garisnya berubah dari bilangan ke bilangan, jadi kamu harus membaca garisnya setiap kali, bukan mengingat letaknya.`,
        ),
      },
      {
        id: 'how-to-read',
        heading: L('How do you find where a number goes?', 'Bagaimana cara menemukan tempat sebuah bilangan?'),
        text: L(
          `- **Read the labels first.** The two ends tell you what one tick is worth: from $0$ to $2$ with $8$ ticks, each tick is $\\frac{2}{8}=\\frac14$.
- **A tick is a fraction of a unit.** If a unit has $4$ ticks, $0.75$ is $3$ ticks from $0$, and so are $\\frac34$ and $75\\%$. Several names, one place.
- **Negative numbers mirror the positive ones.** $-\\frac34$ is as far left of $0$ as $\\frac34$ is right of it, so it is $3$ ticks to the left.
- **A repeating decimal is a fraction.** $0.\\overline{3}=\\frac13$ and $0.\\overline{6}=\\frac23$, so they need a unit cut in three; see [rational numbers](article:rational-numbers).
- **On a zoomed line, the ends are the new $0$ and $1$.** Between $0.4$ and $0.5$ with ten ticks, each tick is $0.01$, so $0.47$ is the seventh.
- **A root has no tick, so squeeze it.** $\\sqrt5$ is between $2$ and $3$ because $4<5<9$, and nearer $2$ than $3$ because $5$ is nearer $4$ than $9$. For $\\pi$ and $e$, think of $3.14$ and $2.72$.

The whole picture of these numbers is in [real numbers](article:real-numbers), the negative ones in [integers](article:integers), and the roots in [irrational numbers](article:irrational-numbers) and [exponents and radicals](article:exponents-and-radicals).`,
          `- **Baca labelnya dulu.** Kedua ujung memberi tahu nilai satu tanda: dari $0$ sampai $2$ dengan $8$ tanda, setiap tanda bernilai $\\frac{2}{8}=\\frac14$.
- **Satu tanda adalah sebagian dari satu satuan.** Bila satu satuan punya $4$ tanda, $0{,}75$ berjarak $3$ tanda dari $0$, begitu pula $\\frac34$ dan $75\\%$. Banyak nama, satu tempat.
- **Bilangan negatif mencerminkan bilangan positif.** $-\\frac34$ sejauh $\\frac34$ di kiri $0$ seperti $\\frac34$ di kanannya, jadi letaknya $3$ tanda ke kiri.
- **Desimal berulang adalah pecahan.** $0{,}\\overline{3}=\\frac13$ dan $0{,}\\overline{6}=\\frac23$, jadi memerlukan satuan yang dibagi tiga; lihat [bilangan rasional](article:rational-numbers).
- **Pada garis yang diperbesar, kedua ujung adalah $0$ dan $1$ yang baru.** Antara $0{,}4$ dan $0{,}5$ dengan sepuluh tanda, setiap tanda bernilai $0{,}01$, jadi $0{,}47$ adalah tanda ketujuh.
- **Akar tidak punya tanda, jadi apitlah.** $\\sqrt5$ ada di antara $2$ dan $3$ karena $4<5<9$, dan lebih dekat ke $2$ daripada $3$ karena $5$ lebih dekat ke $4$ daripada $9$. Untuk $\\pi$ dan $e$, ingatlah $3{,}14$ dan $2{,}72$.

Gambaran utuh bilangan-bilangan ini ada di [bilangan real](article:real-numbers), bilangan negatifnya di [bilangan bulat](article:integers), dan akarnya di [bilangan irasional](article:irrational-numbers) dan [eksponen dan radikal](article:exponents-and-radicals).`,
        ),
      },
      {
        id: 'why-number-line',
        heading: L('Why put numbers on a line?', 'Mengapa bilangan diletakkan pada garis?'),
        text: L(
          `A number line turns *which is larger* and *how far apart* into something you can see. Every real number has exactly one place on it, and the many ways of writing a number are only many names for that one place. A fraction, a decimal and a percent that are equal land on the same tick; two numbers that look alike but differ, such as $0.33$ and $\\frac13$, land on different ones, and the zoomed levels show how close and yet apart they are. Learners who can place a number on a line can usually also compare, order and round it, which is why number lines are used from the first years of school to calculus. If you like comparing, [Number Fish](/games/number-fish) asks the same question while you swim.`,
          `Garis bilangan mengubah *mana yang lebih besar* dan *seberapa jauh jaraknya* menjadi sesuatu yang dapat dilihat. Setiap bilangan real punya tepat satu tempat pada garis itu, dan beragam cara menulis sebuah bilangan hanyalah banyak nama untuk satu tempat itu. Pecahan, desimal, dan persen yang sama jatuh pada tanda yang sama; dua bilangan yang tampak mirip tetapi berbeda, seperti $0{,}33$ dan $\\frac13$, jatuh pada tanda yang berlainan, dan tingkat yang diperbesar memperlihatkan betapa dekat namun terpisahnya mereka. Pembelajar yang bisa meletakkan bilangan pada garis biasanya juga bisa membandingkan, mengurutkan, dan membulatkannya, itulah sebabnya garis bilangan dipakai sejak tahun-tahun pertama sekolah sampai kalkulus. Bila kamu suka membandingkan, [Ikan Bilangan](/permainan/ikan-bilangan) mengajukan pertanyaan yang sama sambil kamu berenang.`,
        ),
      },
    ],
    faq: [
      {
        q: L('How do I play Number Line?', 'Bagaimana cara bermain Garis Bilangan?'),
        a: L(
          'Read the number in the box, then tap or drag on the line to put the marker where the number belongs, and press Check. Ten numbers make a game; the marker moves tick by tick on the first four levels, with the arrow buttons or the arrow keys.',
          'Baca bilangan di kotak, lalu ketuk atau seret pada garis untuk meletakkan penanda di tempat bilangan itu, dan tekan Periksa. Sepuluh bilangan membentuk satu permainan; penanda bergerak tanda demi tanda pada empat tingkat pertama, dengan tombol panah di layar atau di keyboard.',
        ),
      },
      {
        q: L('How exact does the marker have to be?', 'Seberapa tepat penanda harus diletakkan?'),
        a: L(
          'On the first four levels the number is exactly on a tick and the marker snaps to ticks, so the answer is that tick and no other: it is decided with exact fractions, never with pixels. On the last level, where a square root or π lies between ticks, a marker within 3% of the line from the number counts.',
          'Pada empat tingkat pertama bilangannya tepat berada di satu tanda dan penanda melekat pada tanda, sehingga jawabannya tanda itu dan bukan yang lain: ini diputuskan dengan pecahan eksak, bukan dengan piksel. Pada tingkat terakhir, saat akar atau π berada di antara tanda, penanda dalam 3% panjang garis dari bilangan itu dianggap benar.',
        ),
      },
      {
        q: L('How are the stars decided?', 'Bagaimana bintang ditentukan?'),
        a: L(
          'By the mistakes in a game of ten numbers: one mistake or none is three stars, two to four mistakes is two stars, more is one star. A mistake is a Check that was wrong; asking to be shown the place does not cost more.',
          'Dari banyaknya kesalahan dalam satu permainan sepuluh bilangan: satu kesalahan atau tanpa kesalahan adalah tiga bintang, dua sampai empat kesalahan dua bintang, lebih dari itu satu bintang. Kesalahan adalah Periksa yang salah; meminta tempatnya ditunjukkan tidak menambah kesalahan.',
        ),
      },
      {
        q: L('Does Number Line save my score?', 'Apakah Garis Bilangan menyimpan skorku?'),
        a: L(
          'Your best stars for each level are kept in this browser only. There is no account and nothing is sent anywhere; clearing the site data in your browser clears them too.',
          'Bintang terbaikmu untuk tiap tingkat hanya disimpan di browser ini. Tidak ada akun dan tidak ada yang dikirim ke mana pun; menghapus data situs di browser juga menghapusnya.',
        ),
      },
      {
        q: L('Which math topics does Number Line practise?', 'Topik matematika apa yang dilatih Garis Bilangan?'),
        a: L(
          'Reading and placing integers, fractions, mixed numbers, decimals, percents and repeating decimals on a number line, negative numbers, scale and zooming, and estimating square roots, π and e between whole numbers.',
          'Membaca dan meletakkan bilangan bulat, pecahan, pecahan campuran, desimal, persen, dan desimal berulang pada garis bilangan, bilangan negatif, skala dan memperbesar, serta memperkirakan akar, π, dan e di antara bilangan bulat.',
        ),
      },
    ],
    teaches: [
      L('Placing fractions, decimals and percents on a number line', 'Meletakkan pecahan, desimal, dan persen pada garis bilangan'),
      L('Negative numbers and the scale of a number line', 'Bilangan negatif dan skala garis bilangan'),
      L('Estimating square roots, π and e', 'Memperkirakan akar, π, dan e'),
    ],
  },
]

export const gameById = (id: string): GameMeta | undefined => GAMES.find((g) => g.id === id)
