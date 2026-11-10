import type { Loc } from './types'

/** The Games section: the list page, and each game's page text. Like `about.ts` and the articles, one source for what the running app shows and what the
 *  build writes into the static HTML. Text is "rich": `$math$`, `**bold**`, `- ` lists, `1. ` steps, `| a | b |` tables and `[words](article:id)` links. */

const L = (en: string, id: string): Loc => ({ en, id })

export type GameId = 'real-number-match' | 'number-fish'

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
  seoTitle: L('Math Games: Free Learning Games in English and Indonesian', 'Permainan Matematika: Game Belajar Gratis dalam Dua Bahasa'),
  description: L(
    'Free math games that train one skill at a time: pair the cards, beat the clock, earn stars. Play in English or Indonesian, on a phone or a computer.',
    'Permainan matematika gratis yang melatih satu keterampilan sekaligus: pasangkan kartu, kejar waktu, raih bintang. Mainkan dalam bahasa Indonesia atau Inggris.',
  ),
  keywords: L(
    'math games, free math card games, matching games for fractions and decimals, learn math by playing, bilingual math games, real number games',
    'permainan matematika, game kartu matematika gratis, game mencocokkan pecahan dan desimal, belajar matematika sambil bermain, permainan matematika dua bahasa, game bilangan real',
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
]

export const gameById = (id: string): GameMeta | undefined => GAMES.find((g) => g.id === id)
