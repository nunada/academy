import type { Loc } from './types'

/** The Games section: the list page, and each game's page text. Like `about.ts` and the articles, one source for what the running app shows and what the
 *  build writes into the static HTML. Text is "rich": `$math$`, `**bold**`, `- ` lists, `1. ` steps, `| a | b |` tables and `[words](article:id)` links. */

const L = (en: string, id: string): Loc => ({ en, id })

export type GameId = 'real-number-match' | 'number-fish' | 'code-maze' | 'number-line' | 'math-domino' | 'multiplication-house' | 'addition-house'

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

It works in any maze whose walls are all joined together, which means a maze with no loops and no rooms closed off. Every wall then connects to the outer wall, so a hand that follows the wall visits every corridor and must pass the exit. In the game this is a **while** block (until the robot is on the finish) with two **if** blocks inside. It is a small example of an **algorithm**: a fixed recipe that is correct for every input of its kind, not just for the one you tried. The same idea is explained for sorting and searching in [binary search and sorting](article:binary-search-and-sorting).`,
          `Jalanilah labirin dengan satu tangan selalu menyentuh tembok di sisi kananmu. Pada setiap langkah: **bila jalan di kanan terbuka, belok kanan lalu melangkah; bila tidak, dan jalan di depan terbuka, melangkah; bila tidak, belok kiri.** Hanya itu, dan tidak perlu peta.

Aturan ini berhasil di labirin mana pun yang seluruh temboknya tersambung, yaitu labirin tanpa putaran dan tanpa ruang yang tertutup. Setiap tembok lalu tersambung ke tembok luar, sehingga tangan yang mengikuti tembok melewati setiap lorong dan pasti melewati pintu keluar. Dalam game ini aturannya berupa blok **selama** (sampai robot di finis) dengan dua blok **jika** di dalamnya. Ini contoh kecil sebuah **algoritma**: resep tetap yang benar untuk setiap input sejenis, bukan hanya untuk yang kamu coba. Gagasan serupa untuk pengurutan dan pencarian dijelaskan di [pencarian biner dan pengurutan](article:binary-search-and-sorting).`,
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
  {
    id: 'math-domino',
    slug: { en: 'math-domino', id: 'domino-matematika' },
    icon: '🎲',
    title: L('Math Domino: Match the Ends by Calculating', 'Domino Matematika: Cocokkan Ujungnya dengan Menghitung'),
    seoTitle: L('Math Domino: a Free Online Game for Integers, Fractions and More', 'Domino Matematika: Game Gratis Online untuk Bilangan Bulat, Pecahan, dan Lainnya'),
    description: L(
      'A free math domino game for one player against the computer or 2 to 8 players online. Each half of a tile is a calculation or a plain number, and tiles touch when the values are equal. Natural numbers, integers, multiplication, fractions and order of operations.',
      'Game domino matematika gratis untuk satu pemain melawan komputer atau 2 sampai 8 pemain online. Setiap sisi kartu berupa hitungan atau bilangan biasa, dan kartu bersentuhan bila nilainya sama. Bilangan asli, bilangan bulat, perkalian, pecahan, dan urutan operasi hitung.',
    ),
    keywords: L(
      'math domino, math domino game online, domino game for kids, integer domino, fraction domino, multiplayer math game, play math games with friends, adding and subtracting integers game, order of operations game, equivalent fractions game, learn math by playing',
      'domino matematika, game domino matematika online, game domino untuk anak, domino bilangan bulat, domino pecahan, game matematika multiplayer, main game matematika bersama teman, game penjumlahan dan pengurangan bilangan bulat, game urutan operasi hitung, game pecahan senilai, belajar matematika sambil bermain',
    ),
    tagline: L('Dominoes whose halves are calculations. Play the computer or friends.', 'Domino yang sisinya berupa hitungan. Lawan komputer atau teman.'),
    answer: L(
      '**Math Domino is a domino game in which each half of a tile is a calculation or a plain number, and two halves touch when their values are equal.** $3+4$ can sit next to $10-3$, because both are $7$. You can play alone against the computer or online with 2 to 8 players, with natural numbers, integers, multiplication and division, fractions, or the order of operations.',
      '**Domino Matematika adalah game domino yang setiap sisi kartunya berupa hitungan atau bilangan biasa, dan dua sisi bersentuhan bila nilainya sama.** $3+4$ boleh bersebelahan dengan $10-3$, karena keduanya bernilai $7$. Kamu bisa bermain sendiri melawan komputer atau online dengan 2 sampai 8 pemain, dengan bilangan asli, bilangan bulat, perkalian dan pembagian, pecahan, atau urutan operasi hitung.',
    ),
    published: '2026-11-18',
    updated: '2026-11-18',
    sections: [
      {
        id: 'how-to-play',
        heading: L('How do you play Math Domino?', 'Bagaimana cara memainkan Domino Matematika?'),
        text: L(
          `1. Choose the kind of calculation and a level. Then play against the computer, or make a room and share its code with friends.
2. Every tile has two halves, and each half is a calculation such as $3+4$ or $10-3$, or sometimes just a number such as $7$. You are dealt some tiles; the rest make the pile.
3. A tile goes at one end of the chain, with a half that has **the same value** as that end touching it. $3+4$ and $10-3$ are both $7$, so they can touch.
4. On your turn, tap one of your tiles, then tap the end where it goes, the **left end** or the **right end**. The first tile of the game can be any tile.
5. If none of your tiles fits, press **Draw a tile**, and go on drawing until one fits. When the pile is empty, press **Pass**.
6. The first player to play all their tiles wins. If nobody can move, the player with the fewest tiles left wins.

A tile put where its value does not equal the end is a miscalculation: the tile stays in your hand, you draw one tile as a penalty and your turn is over. The game only says that the values are not equal; it never gives the answer.`,
          `1. Pilih jenis hitungan dan tingkatnya. Lalu main melawan komputer, atau buat ruangan dan bagikan kodenya ke teman.
2. Setiap kartu punya dua sisi, dan tiap sisi adalah hitungan seperti $3+4$ atau $10-3$, atau kadang hanya sebuah bilangan seperti $7$. Kamu dibagi beberapa kartu; sisanya menjadi tumpukan.
3. Sebuah kartu dipasang di salah satu ujung rantai, dengan sisi yang **bernilai sama** dengan ujung itu saling bersentuhan. $3+4$ dan $10-3$ sama-sama $7$, jadi boleh bersentuhan.
4. Pada gilirannya, ketuk salah satu kartumu, lalu ketuk ujung tempat memasangnya, **ujung kiri** atau **ujung kanan**. Kartu pertama dalam permainan boleh kartu mana saja.
5. Bila tidak ada kartumu yang cocok, tekan **Ambil kartu**, dan terus ambil sampai ada yang cocok. Bila tumpukan habis, tekan **Lewati**.
6. Pemain pertama yang menghabiskan semua kartunya menang. Bila tidak ada yang bisa jalan, pemain dengan kartu tersisa paling sedikit menang.

Kartu yang dipasang di tempat yang nilainya tidak sama dengan ujungnya dianggap salah hitung: kartu tetap di tanganmu, kamu mengambil satu kartu sebagai hukuman, dan gilirannya selesai. Game hanya mengatakan bahwa nilainya tidak sama; ia tidak pernah memberi jawabannya.`,
        ),
      },
      {
        id: 'the-ends',
        heading: L('How do you tell the ends of the chain?', 'Bagaimana cara mengenali ujung-ujung rantai?'),
        text: L(
          `- **The left end is the left half of the first tile in the chain, and the right end is the right half of the last tile.** Everything in between is already joined and no longer counts.
- Two big boxes right below the chain always show the two ends, **green for the left end and gold for the right end**, even when the chain is long enough to scroll. The same two halves are outlined in the same colors inside the chain, with the words left and right above them.
- A tile fits an end when **one of its two halves** has the same value as that end. The half that touches the end is joined; the other half becomes the new end.
- When you pick a tile, the boxes light up and say **Put it here**; tap the one you want. On a keyboard, press Tab to move between your tiles and the two boxes, and Enter to choose.
- At the start the chain is empty and has no ends yet, so the first tile can be any tile.
- To check your work, switch on **Show the value of each end**. It writes what each end is worth, for example $3+4=7$. It is a help for beginners, and you can leave it off.`,
          `- **Ujung kiri adalah sisi kiri dari kartu pertama dalam rantai, dan ujung kanan adalah sisi kanan dari kartu terakhir.** Semua yang ada di antaranya sudah tersambung dan tidak dihitung lagi.
- Dua kotak besar tepat di bawah rantai selalu menunjukkan kedua ujung, **hijau untuk ujung kiri dan emas untuk ujung kanan**, bahkan ketika rantainya cukup panjang sampai harus digeser. Kedua sisi yang sama diberi garis tepi dengan warna yang sama di dalam rantai, dengan kata kiri dan kanan di atasnya.
- Sebuah kartu cocok dengan sebuah ujung bila **salah satu dari dua sisinya** bernilai sama dengan ujung itu. Sisi yang bersentuhan dengan ujung menjadi tersambung; sisi lainnya menjadi ujung yang baru.
- Saat kamu memilih kartu, kotak-kotak itu menyala dan bertuliskan **Pasang di sini**; ketuk yang kamu inginkan. Dengan keyboard, tekan Tab untuk berpindah antara kartumu dan kedua kotak, dan Enter untuk memilih.
- Di awal, rantainya kosong dan belum punya ujung, jadi kartu pertama boleh kartu mana saja.
- Untuk memeriksa pekerjaanmu, nyalakan **Tampilkan nilai tiap ujung**. Ia menuliskan nilai tiap ujung, misalnya $3+4=7$. Ini bantuan untuk pemula, dan boleh dibiarkan mati.`,
        ),
      },
      {
        id: 'modes',
        heading: L('What kinds of calculation can you play?', 'Hitungan jenis apa saja yang bisa dimainkan?'),
        text: L(
          `| Kind | What the halves look like | The nine values |
|---|---|---|
| Natural numbers: add and subtract | $3+4$, $10-3$, $15-8$ | $1$ to $9$ |
| Integers: add and subtract | $-3+5$, $4-(-2)$, $6-4$ | $-4$ to $4$ |
| Natural numbers: multiply and divide | $2\\times4$, $24\\div3$ | $2$ to $10$ |
| Integers: multiply and divide | $(-2)\\times3$, $12\\div(-4)$ | $-4$ to $4$ |
| Fractions: add, subtract and simplify | $\\frac12$, $\\frac36$, $\\frac14+\\frac14$, $\\frac32-\\frac12$ | $\\frac12$ to $4\\frac12$ in steps of $\\frac12$ |
| Order of operations | $2+3\\times4$, $(8-2)\\div3$ | $2$ to $10$ |

**A half is usually a calculation, but about three halves in ten at level 1, one in four at level 2 and one in five at level 3 are just a number**, such as $7$, so the two halves of one tile are often of different kinds. Each kind has three levels. At level 1 the calculations are short and use small numbers. At level 2 they are longer. At level 3 the numbers are bigger, there are more steps, and fractions may have different denominators.

Every set has **nine different values and 45 tiles, one for each pair of values**, so a value shows up on ten halves, each written differently.`,
          `| Jenis | Bentuk sisi kartunya | Kesembilan nilai |
|---|---|---|
| Bilangan asli: tambah dan kurang | $3+4$, $10-3$, $15-8$ | $1$ sampai $9$ |
| Bilangan bulat: tambah dan kurang | $-3+5$, $4-(-2)$, $6-4$ | $-4$ sampai $4$ |
| Bilangan asli: kali dan bagi | $2\\times4$, $24\\div3$ | $2$ sampai $10$ |
| Bilangan bulat: kali dan bagi | $(-2)\\times3$, $12\\div(-4)$ | $-4$ sampai $4$ |
| Pecahan: tambah, kurang, dan sederhanakan | $\\frac12$, $\\frac36$, $\\frac14+\\frac14$, $\\frac32-\\frac12$ | $\\frac12$ sampai $4\\frac12$ dengan selisih $\\frac12$ |
| Urutan operasi hitung | $2+3\\times4$, $(8-2)\\div3$ | $2$ sampai $10$ |

**Sebuah sisi biasanya berupa hitungan, tetapi sekitar tiga dari sepuluh sisi pada tingkat 1, satu dari empat pada tingkat 2, dan satu dari lima pada tingkat 3 hanyalah bilangan**, seperti $7$, sehingga kedua sisi sebuah kartu sering berlainan jenis. Setiap jenis punya tiga tingkat. Pada tingkat 1 hitungannya pendek dan bilangannya kecil. Pada tingkat 2 hitungannya lebih panjang. Pada tingkat 3 bilangannya lebih besar, langkahnya lebih banyak, dan pecahan boleh berpenyebut berbeda.

Setiap set punya **sembilan nilai berbeda dan 45 kartu, satu untuk setiap pasangan nilai**, sehingga sebuah nilai muncul pada sepuluh sisi, masing-masing ditulis berbeda.`,
        ),
      },
      {
        id: 'online',
        heading: L('How do you play online with friends?', 'Bagaimana cara bermain online dengan teman?'),
        text: L(
          `1. Type a name and press **Make a room**. You get a code of four characters, such as K7QF, and a link you can copy.
2. Friends open the link, or type the code under **Join**. From 2 to 8 players can be in one room.
3. You, the host, choose the kind of calculation and the level, and press **Start the game** when everyone is in.
4. Everybody plays the same tiles on their own screen, and each player's turn shows to all.

| Players | Tiles for each | Tiles in the pile at the start |
|---|---|---|
| 2 | 7 | 31 |
| 3 | 7 | 24 |
| 4 | 7 | 17 |
| 5 | 6 | 15 |
| 6 | 5 | 15 |
| 7 | 5 | 10 |
| 8 | 5 | 5 |

The host's browser keeps the rules for the room, so if the host leaves, the room closes. Anyone who leaves, or is out of contact for about 13 seconds, has only stepped away: the seat and the tiles are kept, and they can come back (join again with the same code, in the same browser tab) until the turn comes to their seat. If the turn comes while they are away, they have missed it: they are out, their tiles go back to the pile, and the others play on. After a game the host can start another with the same players.`,
          `1. Ketik nama dan tekan **Buat ruangan**. Kamu mendapat kode empat karakter, seperti K7QF, dan sebuah link yang bisa disalin.
2. Teman membuka link itu, atau mengetik kodenya di bagian **Gabung**. Satu ruangan bisa diisi 2 sampai 8 pemain.
3. Kamu, sebagai tuan rumah, memilih jenis hitungan dan tingkatnya, lalu menekan **Mulai permainan** ketika semua sudah masuk.
4. Semua orang memainkan kartu yang sama di layarnya sendiri, dan giliran tiap pemain terlihat oleh semua.

| Pemain | Kartu per pemain | Kartu di tumpukan pada awal |
|---|---|---|
| 2 | 7 | 31 |
| 3 | 7 | 24 |
| 4 | 7 | 17 |
| 5 | 6 | 15 |
| 6 | 5 | 15 |
| 7 | 5 | 10 |
| 8 | 5 | 5 |

Browser tuan rumah menjaga aturan untuk ruangan itu, jadi bila tuan rumah keluar, ruangannya ditutup. Pemain yang keluar, atau putus hubungan sekitar 13 detik, hanya dianggap keluar dulu: kursi dan kartunya disimpan, dan ia bisa masuk lagi (gabung lagi dengan kode yang sama, di tab browser yang sama) sebelum gilirannya tiba. Kalau gilirannya tiba saat ia tidak ada, gilirannya terlewat: ia keluar dari permainan, kartunya kembali ke tumpukan, dan yang lain melanjutkan. Setelah satu permainan, tuan rumah bisa memulai permainan lagi dengan pemain yang sama.`,
        ),
      },
      {
        id: 'against-the-computer',
        heading: L('How does the computer play?', 'Bagaimana komputer bermain?'),
        text: L(
          `The computer sees only what you could see: its own tiles and the chain. It has three strengths:

| Strength | How it plays |
|---|---|
| Easy | puts down any tile that fits, and miscalculates about one time in five |
| Medium | keeps its hand flexible, so that more of its tiles still fit after its move, and miscalculates about one time in sixteen |
| Hard | does the same and also leaves ends that few tiles in the game can match, and never miscalculates |

A computer that miscalculates puts a tile where it does not fit, draws a tile as a penalty and loses its turn, just as you would.`,
          `Komputer hanya melihat apa yang bisa kamu lihat: kartunya sendiri dan rantai. Ia punya tiga tingkat kekuatan:

| Tingkat | Cara bermainnya |
|---|---|
| Mudah | memasang kartu apa pun yang cocok, dan salah hitung sekitar satu kali dari lima |
| Sedang | menjaga tangannya tetap luwes, sehingga lebih banyak kartunya yang masih cocok setelah langkahnya, dan salah hitung sekitar satu kali dari enam belas |
| Sulit | melakukan hal yang sama dan juga meninggalkan ujung yang sedikit kartu dalam permainan bisa mencocokinya, dan tidak pernah salah hitung |

Komputer yang salah hitung memasang kartu di tempat yang tidak cocok, mengambil kartu sebagai hukuman, dan kehilangan gilirannya, persis seperti kamu.`,
        ),
      },
      {
        id: 'why-domino',
        heading: L('Why practise math with dominoes?', 'Mengapa berlatih matematika dengan domino?'),
        text: L(
          `The one idea behind the game is that **one value has many names**. $3+4$, $10-3$ and $14\\div2$ all stand for $7$, and $\\frac12$, $\\frac36$ and $\\frac14+\\frac14$ all stand for the same number. To play, you have to work each half out and compare the results, which is how you check an equation, and a quick, correct answer is rewarded at once because it lets you play a tile.

The integer kinds practise the sign rules, such as $4-(-2)=6$ and $(-2)\\times(-3)=6$; see [integers](article:integers). The fraction kind practises equal fractions and sums over a common denominator; see [rational numbers](article:rational-numbers). The last kind practises doing multiplication and division before addition and subtraction.`,
          `Gagasan di balik game ini adalah bahwa **satu nilai punya banyak nama**. $3+4$, $10-3$, dan $14\\div2$ semuanya menyatakan $7$, dan $\\frac12$, $\\frac36$, dan $\\frac14+\\frac14$ semuanya menyatakan bilangan yang sama. Untuk bermain, kamu harus menghitung tiap sisi dan membandingkan hasilnya, seperti cara memeriksa sebuah persamaan, dan jawaban yang cepat dan benar langsung berbalas karena memungkinkanmu memasang kartu.

Jenis bilangan bulat melatih aturan tanda, seperti $4-(-2)=6$ dan $(-2)\\times(-3)=6$; lihat [bilangan bulat](article:integers). Jenis pecahan melatih pecahan senilai dan penjumlahan dengan penyebut sama; lihat [bilangan rasional](article:rational-numbers). Jenis terakhir melatih pengerjaan perkalian dan pembagian sebelum penjumlahan dan pengurangan.`,
        ),
      },
    ],
    faq: [
      {
        q: L('How do I play Math Domino?', 'Bagaimana cara bermain Domino Matematika?'),
        a: L(
          'Tap one of your tiles, then tap the left or the right end of the chain. A tile fits an end when one of its halves has the same value as that end, for example $3+4$ next to $10-3$. If no tile fits, draw from the pile.',
          'Ketuk salah satu kartumu, lalu ketuk ujung kiri atau ujung kanan rantai. Sebuah kartu cocok dengan ujung bila salah satu sisinya bernilai sama dengan ujung itu, misalnya $3+4$ di samping $10-3$. Bila tidak ada kartu yang cocok, ambil dari tumpukan.',
        ),
      },
      {
        q: L('How can I see which end is which?', 'Bagaimana cara melihat mana ujung yang mana?'),
        a: L(
          'The two big boxes right below the chain always show the ends: green is the left end and gold is the right end. The same two halves are outlined in those colors inside the chain. You can also switch on a help that shows what each end is worth.',
          'Dua kotak besar tepat di bawah rantai selalu menunjukkan ujungnya: hijau adalah ujung kiri dan emas adalah ujung kanan. Kedua sisi yang sama diberi garis tepi dengan warna itu di dalam rantai. Kamu juga bisa menyalakan bantuan yang menampilkan nilai tiap ujung.',
        ),
      },
      {
        q: L('What happens if I put a tile in the wrong place?', 'Apa yang terjadi bila aku memasang kartu di tempat yang salah?'),
        a: L(
          'It counts as a miscalculation: the tile stays in your hand, you draw one tile from the pile as a penalty, and your turn is over. The game tells you only that the values were not equal, not what they are.',
          'Itu dihitung salah hitung: kartu tetap di tanganmu, kamu mengambil satu kartu dari tumpukan sebagai hukuman, dan gilirannya selesai. Game hanya memberi tahu bahwa nilainya tidak sama, bukan berapa nilainya.',
        ),
      },
      {
        q: L('How many people can play online?', 'Berapa orang yang bisa bermain online?'),
        a: L(
          'From 2 to 8 players in one room. One player makes the room and gets a four-character code; the others join with that code or with the link. No account is needed.',
          'Dari 2 sampai 8 pemain dalam satu ruangan. Satu pemain membuat ruangan dan mendapat kode empat karakter; yang lain bergabung dengan kode itu atau dengan link-nya. Tidak perlu akun.',
        ),
      },
      {
        q: L('Is online play private and safe?', 'Apakah bermain online ini pribadi dan aman?'),
        a: L(
          'The only thing shared with the other players is the name you type, and nothing is stored on a server. A room is a channel named by its code, so anyone who has the code can join while the game has not started. A technically skilled player could also read the other players\' tiles from the network traffic, so play with friends and not for prizes.',
          'Satu-satunya yang dibagikan ke pemain lain adalah nama yang kamu ketik, dan tidak ada yang disimpan di server. Ruangan adalah saluran yang namanya adalah kodenya, jadi siapa pun yang punya kodenya bisa bergabung selama permainan belum dimulai. Pemain yang ahli teknis juga bisa membaca kartu pemain lain dari lalu lintas jaringan, jadi bermainlah dengan teman dan bukan untuk hadiah.',
        ),
      },
      {
        q: L('How strong is the computer?', 'Seberapa kuat komputernya?'),
        a: L(
          'You choose: easy, medium or hard. An easy computer miscalculates about one time in five; a hard one never does and plays to keep your options narrow.',
          'Kamu yang memilih: mudah, sedang, atau sulit. Komputer yang mudah salah hitung sekitar satu kali dari lima; yang sulit tidak pernah salah dan bermain untuk mempersempit pilihanmu.',
        ),
      },
      {
        q: L('Which math topics does Math Domino practise?', 'Topik matematika apa yang dilatih Domino Matematika?'),
        a: L(
          'Adding and subtracting natural numbers and integers, multiplying and dividing (also with negative numbers), equal fractions and adding fractions, and the order of operations.',
          'Menjumlah dan mengurangi bilangan asli dan bilangan bulat, mengalikan dan membagi (juga dengan bilangan negatif), pecahan senilai dan penjumlahan pecahan, serta urutan operasi hitung.',
        ),
      },
      {
        q: L('Does Math Domino save my score?', 'Apakah Domino Matematika menyimpan skorku?'),
        a: L(
          'No. Only your choices (name, kind of calculation, level) are remembered in this browser, so you do not have to set them again. Nothing is sent to an account.',
          'Tidak. Hanya pilihanmu (nama, jenis hitungan, tingkat) yang diingat di browser ini, jadi kamu tidak perlu mengaturnya lagi. Tidak ada yang dikirim ke sebuah akun.',
        ),
      },
    ],
    teaches: [
      L('Adding and subtracting natural numbers and integers', 'Menjumlah dan mengurangi bilangan asli dan bilangan bulat'),
      L('Multiplying and dividing, with negative numbers too', 'Mengalikan dan membagi, juga dengan bilangan negatif'),
      L('Equal fractions and adding fractions', 'Pecahan senilai dan penjumlahan pecahan'),
      L('The order of operations', 'Urutan operasi hitung'),
    ],
  },
  {
    id: 'multiplication-house',
    slug: { en: 'multiplication-house', id: 'rumah-perkalian' },
    icon: '🏠',
    title: L('Multiplication House: Four in a Row With the Times Table', 'Rumah Perkalian: Empat Sejajar dengan Tabel Perkalian'),
    seoTitle: L('Multiplication House: a Free Times Table Game for Two', 'Rumah Perkalian: Game Tabel Perkalian Gratis untuk Dua Pemain'),
    description: L(
      'A free times table game: move your pawn on the numbers 1 to 9, multiply the two pawns, and take that product on a 9 by 9 board. Four in a row wins. Play the computer (six levels), a friend on one screen, or a friend online.',
      'Game tabel perkalian gratis: pindahkan pionmu di angka 1 sampai 9, kalikan kedua pion, lalu ambil hasil kalinya di papan 9 kali 9. Empat sejajar menang. Main melawan komputer (enam level), dengan teman di satu layar, atau dengan teman online.',
    ),
    keywords: L(
      'multiplication game, times table game, learn multiplication by playing, multiplication facts game, four in a row multiplication, product game, game for two players, multiplication practice for kids, play math games with friends, online math game, memorize the multiplication table',
      'game perkalian, game tabel perkalian, belajar perkalian sambil bermain, game hafalan perkalian, empat sejajar perkalian, game perkalian untuk anak, game dua pemain, latihan perkalian, main game matematika bersama teman, game matematika online, menghafal tabel perkalian',
    ),
    tagline: L('Multiply the two pawns and take the product on the board.', 'Kalikan kedua pion dan ambil hasil kalinya di papan.'),
    answer: L(
      '**Multiplication House is a board game for two in which you multiply the numbers under two pawns and take that product on a 9 by 9 board; four of your cells in a row win.** The board holds all 81 products from 1 × 1 to 9 × 9. You can play the computer (six levels), a friend on one screen, or a friend online.',
      '**Rumah Perkalian adalah permainan papan untuk dua pemain: kamu mengalikan angka di bawah dua pion lalu mengambil hasil kalinya di papan 9 kali 9; empat petakmu yang sejajar menang.** Papan berisi semua 81 hasil kali dari 1 × 1 sampai 9 × 9. Kamu bisa main melawan komputer (enam level), dengan teman di satu layar, atau dengan teman online.',
    ),
    published: '2026-11-20',
    updated: '2026-11-20',
    sections: [
      {
        id: 'how-to-play',
        heading: L('How do you play Multiplication House?', 'Bagaimana cara memainkan Rumah Perkalian?'),
        text: L(
          `1. Choose how to play: against the computer, two players on one screen, or online. A coin toss decides who starts.
2. The board holds the 81 products 1 × 1 to 9 × 9 (so 12 appears four times, 36 appears three times, and 1 only once). The cell in the middle is always 1, the one result that is on the board only once (1 × 1).
3. Under the board is a strip with the numbers 1 to 9. Each player has a pawn on it: **blue** (●) and **yellow** (◆). The player who starts puts both pawns on a number each, the same number if they like.
4. Then take a cell of the board that holds the product of the two pawns. For example, with the pawns on 3 and 4 the result is 12, because 3 × 4 = 12.
5. On every later turn you **must move your own pawn** to a different number, work out the new product, and take a free cell that holds it.
6. The first player to have **four cells in a row**, across, down or diagonally, wins. If the board fills up first, it is a draw.

If every cell that holds the result is already taken, your turn passes without taking a cell.`,
          `1. Pilih cara bermain: melawan komputer, dua pemain di satu layar, atau online. Lemparan koin menentukan siapa yang mulai.
2. Papan berisi 81 hasil kali 1 × 1 sampai 9 × 9 (jadi 12 muncul empat kali, 36 muncul tiga kali, dan 1 hanya sekali). Petak di tengah selalu 1, satu-satunya hasil yang hanya sekali di papan (1 × 1).
3. Di bawah papan ada deret angka 1 sampai 9. Tiap pemain punya satu pion di situ: **biru** (●) dan **kuning** (◆). Pemain yang mulai menaruh kedua pion, masing-masing di satu angka, boleh angka yang sama.
4. Lalu ambil sebuah petak di papan yang berisi hasil kali kedua pion. Misalnya, dengan pion di 3 dan 4 hasilnya 12, karena 3 × 4 = 12.
5. Pada setiap giliran berikutnya kamu **wajib memindahkan pionmu sendiri** ke angka lain, menghitung hasil kali yang baru, dan mengambil petak kosong yang berisinya.
6. Pemain pertama yang punya **empat petak sejajar**, mendatar, menurun, atau miring, menang. Bila papan penuh lebih dulu, hasilnya seri.

Bila semua petak yang berisi hasilnya sudah terisi, gilirannya dilewati tanpa mengambil petak.`,
        ),
      },
      {
        id: 'a-wrong-cell',
        heading: L('What if I pick a cell that is not the product?', 'Bagaimana kalau aku memilih petak yang bukan hasil kali?'),
        text: L(
          `After you click a cell you have **5 seconds** to look at it. Press **Undo** if you doubt, or **Sure** to go on at once. If the time runs out and the cell does not hold the product of the pawns, **you lose the game.** A cell that is already taken is refused straight away and costs nothing.

The game never tells you the right answer; it only says, at the end, that the cell was not the product. That is what makes it a game of knowing your times table, not of clicking until something works.

**Memorised mode** is on at first: it hides the product and the cells that hold it. Switch the help on to see them, for learning. At level 0 the help is always on.`,
          `Setelah kamu mengklik sebuah petak, kamu punya **5 detik** untuk memeriksanya. Tekan **Undo** bila ragu, atau **Yakin** untuk langsung lanjut. Bila waktunya habis dan petak itu bukan hasil kali kedua pion, **kamu kalah.** Petak yang sudah terisi langsung ditolak dan tidak merugikan apa-apa.

Game tidak pernah memberi tahu jawaban yang benar; ia hanya mengatakan, di akhir, bahwa petak itu bukan hasil kali. Itulah yang membuatnya permainan untuk mengetahui tabel perkalianmu, bukan permainan mengklik sampai ada yang cocok.

**Mode sudah hafal** menyala di awal: ia menyembunyikan hasil kali dan petak yang berisinya. Nyalakan bantuan untuk melihatnya, untuk belajar. Di level 0 bantuan selalu menyala.`,
        ),
      },
      {
        id: 'levels',
        heading: L('How strong is the computer?', 'Seberapa kuat komputernya?'),
        text: L(
          `There are six levels, from 0 to 5. Each keeps everything the level below it does and adds something, so a higher level is never weaker. **Win a level to open the next one**; a level that is open can be played again whenever you like.

| Level | How the computer plays |
|---|---|
| 0 | at random, and the help is always on: for learning the rules |
| 1 | at random, but the help follows your own setting |
| 2 | always takes a win that is free, and always blocks yours |
| 3 | as level 2, and half of the time also avoids leaving a pawn number that gives you a win |
| 4 | as level 3, and always avoids it |
| 5 | as level 4, and among the safe moves builds threats of its own |`,
          `Ada enam level, dari 0 sampai 5. Tiap level mempertahankan semua yang dilakukan level di bawahnya dan menambahkan sesuatu, jadi level yang lebih tinggi tidak pernah lebih lemah. **Menang di satu level membuka level berikutnya**; level yang sudah terbuka boleh dimainkan ulang kapan saja.

| Level | Cara komputer bermain |
|---|---|
| 0 | acak, dan bantuan selalu menyala: untuk belajar aturan |
| 1 | acak, tetapi bantuan mengikuti pengaturanmu sendiri |
| 2 | selalu mengambil kemenangan gratis, dan selalu memblokir kemenanganmu |
| 3 | seperti level 2, dan separuh waktu juga menghindari meninggalkan angka pion yang menguntungkanmu |
| 4 | seperti level 3, dan selalu menghindarinya |
| 5 | seperti level 4, dan di antara langkah aman ia membangun ancamannya sendiri |`,
        ),
      },
      {
        id: 'online',
        heading: L('How do you play online with a friend?', 'Bagaimana cara bermain online dengan teman?'),
        text: L(
          `1. Type a name and press **Make a room**. You get a code of four characters, such as K7QF, and a link you can copy.
2. Your friend opens the link, or types the code under **Join**. A room has two players: you are blue, your friend is yellow.
3. You may set a **time limit** for each turn (from 5 to 300 seconds; 60 is the usual one). When you press **Start the game**, a coin toss decides who goes first.

The host's browser keeps the rules, so if the host leaves, the room closes. **If your friend leaves** (or loses the connection for about 13 seconds), the game goes on: you keep playing as usual. Only when the turn comes to a friend who is still away do **30 seconds** start (or the time limit, if that is shorter). If they are back by then, the game goes on; if not, the turn is missed and you win. To come back, join again with the same code in the same browser tab.`,
          `1. Ketik nama dan tekan **Buat ruangan**. Kamu mendapat kode empat karakter, seperti K7QF, dan sebuah link yang bisa disalin.
2. Temanmu membuka link itu, atau mengetik kodenya di bagian **Gabung**. Satu ruangan berisi dua pemain: kamu biru, temanmu kuning.
3. Kamu boleh menetapkan **batas waktu** tiap giliran (dari 5 sampai 300 detik; 60 detik adalah yang biasa). Saat kamu menekan **Mulai permainan**, lemparan koin menentukan siapa yang mulai.

Browser tuan rumah menjaga aturan, jadi bila tuan rumah keluar, ruangannya ditutup. **Kalau temanmu keluar** (atau sambungannya putus sekitar 13 detik), permainan jalan terus: kamu tetap bermain seperti biasa. Baru ketika giliran tiba pada teman yang masih keluar, **30 detik** mulai berjalan (atau batas waktu, kalau lebih pendek). Bila ia sudah kembali, permainan lanjut; bila belum, gilirannya terlewat dan kamu menang. Untuk kembali, gabung lagi dengan kode yang sama di tab browser yang sama.`,
        ),
      },
      {
        id: 'why-multiplication-house',
        heading: L('What does Multiplication House practise?', 'Apa yang dilatih Rumah Perkalian?'),
        text: L(
          `It practises your times table, because every turn asks for a new product that you must find yourself. Only a few products appear more than once, so each pair of pawns points at a small set of cells: you have to know the products, or find them by counting in steps.

The move that wins is rarely the first one you see: you also look at what your pawn move leaves for your opponent. If you like this game, try **Addition House**, which has the same rules with the other operation.`,
          `Ia melatih tabel perkalianmu, karena setiap giliran meminta hasil kali baru yang harus kamu temukan sendiri. Hanya sedikit hasil kali yang muncul lebih dari sekali, jadi tiap pasangan pion menunjuk ke sekumpulan kecil petak: kamu harus tahu hasil kalinya, atau mencarinya dengan berhitung loncat.

Langkah yang menang jarang yang pertama kamu lihat: kamu juga memperhatikan apa yang ditinggalkan gerakan pionmu untuk lawan. Bila kamu suka game ini, coba **Rumah Penjumlahan**, yang aturannya sama dengan operasi yang lain.`,
        ),
      },
    ],
    faq: [
      {
        q: L('How do I play Multiplication House?', 'Bagaimana cara bermain Rumah Perkalian?'),
        a: L(
          'Move your pawn to a different number from 1 to 9, work out the product of the two pawns, and click a cell of the board that holds it. Four of your cells in a row win.',
          'Pindahkan pionmu ke angka lain dari 1 sampai 9, hitung hasil kali kedua pion, lalu klik petak di papan yang berisinya. Empat petakmu yang sejajar menang.',
        ),
      },
      {
        q: L('What happens if I click the wrong cell?', 'Apa yang terjadi bila aku mengklik petak yang salah?'),
        a: L(
          'You have 5 seconds to press Undo. If you do not, and the cell does not hold the product, you lose the game. The game does not say what the right answer was.',
          'Kamu punya 5 detik untuk menekan Undo. Bila tidak, dan petak itu bukan hasil kali, kamu kalah. Game tidak mengatakan apa jawaban yang benar.',
        ),
      },
      {
        q: L('Can two people play on one phone or computer?', 'Bisakah dua orang bermain di satu ponsel atau komputer?'),
        a: L(
          'Yes. Choose Two players, type two names and take turns. A coin toss decides who starts.',
          'Bisa. Pilih 2 Pemain, ketik dua nama, lalu bergantian. Lemparan koin menentukan siapa yang mulai.',
        ),
      },
      {
        q: L('Can I play a friend online?', 'Bisakah aku bermain dengan teman secara online?'),
        a: L(
          'Yes. One player makes a room and gets a four-character code; the other joins with the code or the link. No account is needed, and nothing is stored on a server.',
          'Bisa. Satu pemain membuat ruangan dan mendapat kode empat karakter; yang lain bergabung dengan kode atau link-nya. Tidak perlu akun, dan tidak ada yang disimpan di server.',
        ),
      },
      {
        q: L('Can a player who left come back?', 'Bisakah pemain yang keluar masuk lagi?'),
        a: L(
          'Yes, as long as they have not missed their turn. When the turn comes to a player who is away, 30 seconds start (or the time limit, if shorter); if they are not back by then, the turn is missed and the other player wins.',
          'Bisa, selama ia belum melewatkan gilirannya. Ketika giliran tiba pada pemain yang sedang keluar, 30 detik mulai berjalan (atau batas waktu, kalau lebih pendek); bila ia belum kembali, gilirannya terlewat dan pemain lain menang.',
        ),
      },
      {
        q: L('Does Multiplication House save my score?', 'Apakah Rumah Perkalian menyimpan skorku?'),
        a: L(
          'No. Only your choices (names, level, options) and the highest computer level you have opened are remembered in this browser. Nothing is sent to an account.',
          'Tidak. Hanya pilihanmu (nama, level, opsi) dan level komputer tertinggi yang sudah kamu buka yang diingat di browser ini. Tidak ada yang dikirim ke sebuah akun.',
        ),
      },
    ],
    teaches: [
      L('The times table, 1 × 1 to 9 × 9', 'Tabel perkalian, 1 × 1 sampai 9 × 9'),
      L('Finding a product in a table of results', 'Mencari hasil kali dalam tabel hasil'),
      L('Planning ahead and blocking an opponent', 'Merencanakan langkah dan menghalangi lawan'),
    ],
  },
  {
    id: 'addition-house',
    slug: { en: 'addition-house', id: 'rumah-penjumlahan' },
    icon: '🏡',
    title: L('Addition House: Four in a Row With Adding', 'Rumah Penjumlahan: Empat Sejajar dengan Penjumlahan'),
    seoTitle: L('Addition House: a Free Adding Game for Two Players', 'Rumah Penjumlahan: Game Penjumlahan Gratis untuk Dua Pemain'),
    description: L(
      'A free addition game: move your pawn on the numbers 1 to 9, add the two pawns, and take that sum on a 9 by 9 board. Four in a row wins. Play the computer (six levels), a friend on one screen, or a friend online.',
      'Game penjumlahan gratis: pindahkan pionmu di angka 1 sampai 9, jumlahkan kedua pion, lalu ambil hasil jumlahnya di papan 9 kali 9. Empat sejajar menang. Main melawan komputer (enam level), dengan teman di satu layar, atau dengan teman online.',
    ),
    keywords: L(
      'addition game, adding game for kids, learn addition by playing, addition facts game, four in a row addition, sum game, game for two players, addition practice for kids, play math games with friends, online math game, mental addition game',
      'game penjumlahan, game menjumlah untuk anak, belajar penjumlahan sambil bermain, game fakta penjumlahan, empat sejajar penjumlahan, game dua pemain, latihan penjumlahan, main game matematika bersama teman, game matematika online, game berhitung, game hitung cepat',
    ),
    tagline: L('Add the two pawns and take the sum on the board.', 'Jumlahkan kedua pion dan ambil hasil jumlahnya di papan.'),
    answer: L(
      '**Addition House is a board game for two in which you add the numbers under two pawns and take that sum on a 9 by 9 board; four of your cells in a row win.** The board holds all 81 sums from 1 + 1 to 9 + 9, which only run from 2 to 18, so every result appears on several cells. You can play the computer (six levels), a friend on one screen, or a friend online.',
      '**Rumah Penjumlahan adalah permainan papan untuk dua pemain: kamu menjumlahkan angka di bawah dua pion lalu mengambil hasil jumlahnya di papan 9 kali 9; empat petakmu yang sejajar menang.** Papan berisi semua 81 hasil jumlah dari 1 + 1 sampai 9 + 9, yang hanya berkisar dari 2 sampai 18, jadi setiap hasil muncul di beberapa petak. Kamu bisa main melawan komputer (enam level), dengan teman di satu layar, atau dengan teman online.',
    ),
    published: '2026-11-20',
    updated: '2026-11-20',
    sections: [
      {
        id: 'how-to-play',
        heading: L('How do you play Addition House?', 'Bagaimana cara memainkan Rumah Penjumlahan?'),
        text: L(
          `1. Choose how to play: against the computer, two players on one screen, or online. A coin toss decides who starts.
2. The board holds the 81 sums 1 + 1 to 9 + 9 (so 10 appears nine times, and 2 and 18 only once each). The cell in the middle is always 2, the one result that is on the board only once (1 + 1).
3. Under the board is a strip with the numbers 1 to 9. Each player has a pawn on it: **blue** (●) and **yellow** (◆). The player who starts puts both pawns on a number each, the same number if they like.
4. Then take a cell of the board that holds the sum of the two pawns. For example, with the pawns on 3 and 4 the result is 7, because 3 + 4 = 7.
5. On every later turn you **must move your own pawn** to a different number, work out the new sum, and take a free cell that holds it.
6. The first player to have **four cells in a row**, across, down or diagonally, wins. If the board fills up first, it is a draw.

If every cell that holds the result is already taken, your turn passes without taking a cell.`,
          `1. Pilih cara bermain: melawan komputer, dua pemain di satu layar, atau online. Lemparan koin menentukan siapa yang mulai.
2. Papan berisi 81 hasil jumlah 1 + 1 sampai 9 + 9 (jadi 10 muncul sembilan kali, dan 2 serta 18 masing-masing hanya sekali). Petak di tengah selalu 2, satu-satunya hasil yang hanya sekali di papan (1 + 1).
3. Di bawah papan ada deret angka 1 sampai 9. Tiap pemain punya satu pion di situ: **biru** (●) dan **kuning** (◆). Pemain yang mulai menaruh kedua pion, masing-masing di satu angka, boleh angka yang sama.
4. Lalu ambil sebuah petak di papan yang berisi hasil jumlah kedua pion. Misalnya, dengan pion di 3 dan 4 hasilnya 7, karena 3 + 4 = 7.
5. Pada setiap giliran berikutnya kamu **wajib memindahkan pionmu sendiri** ke angka lain, menghitung hasil jumlah yang baru, dan mengambil petak kosong yang berisinya.
6. Pemain pertama yang punya **empat petak sejajar**, mendatar, menurun, atau miring, menang. Bila papan penuh lebih dulu, hasilnya seri.

Bila semua petak yang berisi hasilnya sudah terisi, gilirannya dilewati tanpa mengambil petak.`,
        ),
      },
      {
        id: 'a-wrong-cell',
        heading: L('What if I pick a cell that is not the sum?', 'Bagaimana kalau aku memilih petak yang bukan hasil jumlah?'),
        text: L(
          `After you click a cell you have **5 seconds** to look at it. Press **Undo** if you doubt, or **Sure** to go on at once. If the time runs out and the cell does not hold the sum of the pawns, **you lose the game.** A cell that is already taken is refused straight away and costs nothing.

The game never tells you the right answer; it only says, at the end, that the cell was not the sum. That is what makes it a game of knowing your addition facts, not of clicking until something works.

**Memorised mode** is on at first: it hides the sum and the cells that hold it. Switch the help on to see them, for learning. At level 0 the help is always on.`,
          `Setelah kamu mengklik sebuah petak, kamu punya **5 detik** untuk memeriksanya. Tekan **Undo** bila ragu, atau **Yakin** untuk langsung lanjut. Bila waktunya habis dan petak itu bukan hasil jumlah kedua pion, **kamu kalah.** Petak yang sudah terisi langsung ditolak dan tidak merugikan apa-apa.

Game tidak pernah memberi tahu jawaban yang benar; ia hanya mengatakan, di akhir, bahwa petak itu bukan hasil jumlah. Itulah yang membuatnya permainan untuk mengetahui fakta penjumlahanmu, bukan permainan mengklik sampai ada yang cocok.

**Mode sudah hafal** menyala di awal: ia menyembunyikan hasil jumlah dan petak yang berisinya. Nyalakan bantuan untuk melihatnya, untuk belajar. Di level 0 bantuan selalu menyala.`,
        ),
      },
      {
        id: 'levels',
        heading: L('How strong is the computer?', 'Seberapa kuat komputernya?'),
        text: L(
          `There are six levels, from 0 to 5. Each keeps everything the level below it does and adds something, so a higher level is never weaker. **Win a level to open the next one**; a level that is open can be played again whenever you like.

| Level | How the computer plays |
|---|---|
| 0 | at random, and the help is always on: for learning the rules |
| 1 | at random, but the help follows your own setting |
| 2 | always takes a win that is free, and always blocks yours |
| 3 | as level 2, and half of the time also avoids leaving a pawn number that gives you a win |
| 4 | as level 3, and always avoids it |
| 5 | as level 4, and among the safe moves builds threats of its own |`,
          `Ada enam level, dari 0 sampai 5. Tiap level mempertahankan semua yang dilakukan level di bawahnya dan menambahkan sesuatu, jadi level yang lebih tinggi tidak pernah lebih lemah. **Menang di satu level membuka level berikutnya**; level yang sudah terbuka boleh dimainkan ulang kapan saja.

| Level | Cara komputer bermain |
|---|---|
| 0 | acak, dan bantuan selalu menyala: untuk belajar aturan |
| 1 | acak, tetapi bantuan mengikuti pengaturanmu sendiri |
| 2 | selalu mengambil kemenangan gratis, dan selalu memblokir kemenanganmu |
| 3 | seperti level 2, dan separuh waktu juga menghindari meninggalkan angka pion yang menguntungkanmu |
| 4 | seperti level 3, dan selalu menghindarinya |
| 5 | seperti level 4, dan di antara langkah aman ia membangun ancamannya sendiri |`,
        ),
      },
      {
        id: 'online',
        heading: L('How do you play online with a friend?', 'Bagaimana cara bermain online dengan teman?'),
        text: L(
          `1. Type a name and press **Make a room**. You get a code of four characters, such as K7QF, and a link you can copy.
2. Your friend opens the link, or types the code under **Join**. A room has two players: you are blue, your friend is yellow.
3. You may set a **time limit** for each turn (from 5 to 300 seconds; 60 is the usual one). When you press **Start the game**, a coin toss decides who goes first.

The host's browser keeps the rules, so if the host leaves, the room closes. **If your friend leaves** (or loses the connection for about 13 seconds), the game goes on: you keep playing as usual. Only when the turn comes to a friend who is still away do **30 seconds** start (or the time limit, if that is shorter). If they are back by then, the game goes on; if not, the turn is missed and you win. To come back, join again with the same code in the same browser tab.`,
          `1. Ketik nama dan tekan **Buat ruangan**. Kamu mendapat kode empat karakter, seperti K7QF, dan sebuah link yang bisa disalin.
2. Temanmu membuka link itu, atau mengetik kodenya di bagian **Gabung**. Satu ruangan berisi dua pemain: kamu biru, temanmu kuning.
3. Kamu boleh menetapkan **batas waktu** tiap giliran (dari 5 sampai 300 detik; 60 detik adalah yang biasa). Saat kamu menekan **Mulai permainan**, lemparan koin menentukan siapa yang mulai.

Browser tuan rumah menjaga aturan, jadi bila tuan rumah keluar, ruangannya ditutup. **Kalau temanmu keluar** (atau sambungannya putus sekitar 13 detik), permainan jalan terus: kamu tetap bermain seperti biasa. Baru ketika giliran tiba pada teman yang masih keluar, **30 detik** mulai berjalan (atau batas waktu, kalau lebih pendek). Bila ia sudah kembali, permainan lanjut; bila belum, gilirannya terlewat dan kamu menang. Untuk kembali, gabung lagi dengan kode yang sama di tab browser yang sama.`,
        ),
      },
      {
        id: 'why-addition-house',
        heading: L('What does Addition House practise?', 'Apa yang dilatih Rumah Penjumlahan?'),
        text: L(
          `It practises your addition facts, because every turn asks for a new sum that you must find yourself. Sums only run from 2 to 18, so every result sits on many cells and the board is quick and friendly for younger players; the game is about seeing which pawn move keeps your options open and blocks your opponent.

The move that wins is rarely the first one you see: you also look at what your pawn move leaves for your opponent. If you like this game, try **Multiplication House**, which has the same rules with the other operation.`,
          `Ia melatih fakta penjumlahanmu, karena setiap giliran meminta hasil jumlah baru yang harus kamu temukan sendiri. Hasil jumlah hanya berkisar dari 2 sampai 18, jadi setiap hasil ada di banyak petak dan papannya cepat dan ramah untuk pemain yang lebih muda; yang dilatih adalah melihat gerakan pion mana yang menjaga pilihanmu tetap terbuka dan menghalangi lawan.

Langkah yang menang jarang yang pertama kamu lihat: kamu juga memperhatikan apa yang ditinggalkan gerakan pionmu untuk lawan. Bila kamu suka game ini, coba **Rumah Perkalian**, yang aturannya sama dengan operasi yang lain.`,
        ),
      },
    ],
    faq: [
      {
        q: L('How do I play Addition House?', 'Bagaimana cara bermain Rumah Penjumlahan?'),
        a: L(
          'Move your pawn to a different number from 1 to 9, work out the sum of the two pawns, and click a cell of the board that holds it. Four of your cells in a row win.',
          'Pindahkan pionmu ke angka lain dari 1 sampai 9, hitung hasil jumlah kedua pion, lalu klik petak di papan yang berisinya. Empat petakmu yang sejajar menang.',
        ),
      },
      {
        q: L('What happens if I click the wrong cell?', 'Apa yang terjadi bila aku mengklik petak yang salah?'),
        a: L(
          'You have 5 seconds to press Undo. If you do not, and the cell does not hold the sum, you lose the game. The game does not say what the right answer was.',
          'Kamu punya 5 detik untuk menekan Undo. Bila tidak, dan petak itu bukan hasil jumlah, kamu kalah. Game tidak mengatakan apa jawaban yang benar.',
        ),
      },
      {
        q: L('Can two people play on one phone or computer?', 'Bisakah dua orang bermain di satu ponsel atau komputer?'),
        a: L(
          'Yes. Choose Two players, type two names and take turns. A coin toss decides who starts.',
          'Bisa. Pilih 2 Pemain, ketik dua nama, lalu bergantian. Lemparan koin menentukan siapa yang mulai.',
        ),
      },
      {
        q: L('Can I play a friend online?', 'Bisakah aku bermain dengan teman secara online?'),
        a: L(
          'Yes. One player makes a room and gets a four-character code; the other joins with the code or the link. No account is needed, and nothing is stored on a server.',
          'Bisa. Satu pemain membuat ruangan dan mendapat kode empat karakter; yang lain bergabung dengan kode atau link-nya. Tidak perlu akun, dan tidak ada yang disimpan di server.',
        ),
      },
      {
        q: L('Can a player who left come back?', 'Bisakah pemain yang keluar masuk lagi?'),
        a: L(
          'Yes, as long as they have not missed their turn. When the turn comes to a player who is away, 30 seconds start (or the time limit, if shorter); if they are not back by then, the turn is missed and the other player wins.',
          'Bisa, selama ia belum melewatkan gilirannya. Ketika giliran tiba pada pemain yang sedang keluar, 30 detik mulai berjalan (atau batas waktu, kalau lebih pendek); bila ia belum kembali, gilirannya terlewat dan pemain lain menang.',
        ),
      },
      {
        q: L('Does Addition House save my score?', 'Apakah Rumah Penjumlahan menyimpan skorku?'),
        a: L(
          'No. Only your choices (names, level, options) and the highest computer level you have opened are remembered in this browser. Nothing is sent to an account.',
          'Tidak. Hanya pilihanmu (nama, level, opsi) dan level komputer tertinggi yang sudah kamu buka yang diingat di browser ini. Tidak ada yang dikirim ke sebuah akun.',
        ),
      },
    ],
    teaches: [
      L('Addition facts, 1 + 1 to 9 + 9', 'Fakta penjumlahan, 1 + 1 sampai 9 + 9'),
      L('Finding a sum in a table of results', 'Mencari hasil jumlah dalam tabel hasil'),
      L('Planning ahead and blocking an opponent', 'Merencanakan langkah dan menghalangi lawan'),
    ],
  },
]

export const gameById = (id: string): GameMeta | undefined => GAMES.find((g) => g.id === id)
