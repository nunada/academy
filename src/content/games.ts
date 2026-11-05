import type { Loc } from './types'

/** The Games section: the list page, and each game's page text. Like `about.ts` and the articles, one source for what the running app shows and what the
 *  build writes into the static HTML. Text is "rich": `$math$`, `**bold**`, `- ` lists, `1. ` steps, `| a | b |` tables and `[words](article:id)` links. */

const L = (en: string, id: string): Loc => ({ en, id })

export type GameId = 'real-number-match'

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
    'Permainan singkat, masing-masing dibangun di sekitar satu gagasan. Tidak perlu akun, skor terbaikmu disimpan di peramban ini, dan setiap jawaban diperiksa secara eksak, seperti yang dilakukan pelajaran.',
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
3. Temukan semua pasangan untuk menyelesaikan permainan. Kamu mendapat satu sampai tiga bintang dari banyaknya kesalahan; permainan terbaikmu untuk tiap tingkat dan mode disimpan di peramban ini.

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
          'Hasil terbaikmu untuk tiap tingkat dan mode hanya disimpan di peramban ini. Tidak ada akun dan tidak ada yang dikirim ke mana pun; menghapus data situs di peramban juga menghapus skornya.',
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
]

export const gameById = (id: string): GameMeta | undefined => GAMES.find((g) => g.id === id)
