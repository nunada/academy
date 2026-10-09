import type { Loc } from '../types'
import type { ArticleBody } from './types'
import { meta } from './chinese-numbers.meta'

export { meta }

const L = (en: string, id: string): Loc => ({ en, id })

/** Prose is written between backticks with its text unescaped; the code marker
 *  inside it is ´ rather than a backtick, and `*word*` emphasis is dropped. */
const T = (s: TemplateStringsArray): string =>
  s.raw[0]
    .replace(/´([^´\n]+)´/g, '`$1`')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
    .replace(/^\s+|\s+$/g, '')

export const body: ArticleBody = {
  answer: L(
    T`**Chinese numbers are built from eleven basic words — 零 líng (0), 一 yī, 二 èr, 三 sān, 四 sì, 五 wǔ, 六 liù, 七 qī, 八 bā, 九 jiǔ and 十 shí (10) — and the place words 百 (100), 千 (1,000), 万 (10,000) and 亿 (100,000,000).** Names above ten are fully regular: 十二 is "ten-two", which is 12. Chinese groups digits in fours rather than threes, so 100,000 is 十万, "ten wàn".`,
    T`**Bilangan dalam bahasa China dibangun dari sebelas kata dasar — 零 líng (0), 一 yī, 二 èr, 三 sān, 四 sì, 五 wǔ, 六 liù, 七 qī, 八 bā, 九 jiǔ, dan 十 shí (10) — serta kata tempat 百 (100), 千 (1.000), 万 (10.000), dan 亿 (100.000.000).** Nama bilangan di atas sepuluh sepenuhnya teratur: 十二 berarti "sepuluh-dua", yaitu 12. Bahasa China mengelompokkan angka empat-empat, bukan tiga-tiga, sehingga 100.000 adalah 十万, "sepuluh wàn".`,
  ),

  keyPoints: [
    L(
      T`The ten digits and zero are 零 to 十, and every number from 11 to 99 is built from them with 十: 十一 is 11, 二十 is 20, 三十五 is 35.`,
      T`Kesepuluh angka dan nol adalah 零 sampai 十, dan setiap bilangan dari 11 sampai 99 dibangun darinya dengan 十: 十一 adalah 11, 二十 adalah 20, 三十五 adalah 35.`,
    ),
    L(
      T`Digits are grouped in fours: 万 (wàn) is 10,000 and 亿 (yì) is 100,000,000, so "100,000" is 十万, not "a hundred thousand".`,
      T`Angka dikelompokkan empat-empat: 万 (wàn) adalah 10.000 dan 亿 (yì) adalah 100.000.000, sehingga "100.000" adalah 十万, bukan "seratus ribu".`,
    ),
    L(
      T`A gap of zeros is read as one 零, a lone 2 before 千, 万 or 亿 is 两 rather than 二, and 十 loses its 一 only at the very start of a number.`,
      T`Celah berisi nol dibaca satu 零, angka 2 yang berdiri sendiri sebelum 千, 万, atau 亿 menjadi 两 dan bukan 二, dan 十 kehilangan 一-nya hanya di awal sebuah bilangan.`,
    ),
    L(
      T`Fractions, percentages and ordinals are patterns (三分之一, 百分之五十, 第三), while years and phone numbers are read digit by digit.`,
      T`Pecahan, persen, dan bilangan urutan mengikuti pola (三分之一, 百分之五十, 第三), sedangkan tahun dan nomor telepon dibaca angka demi angka.`,
    ),
    L(
      T`Formal numerals (壹 贰 叁 …) protect cheques and contracts from alteration, and Chinese counting rods were an early decimal place-value system with zero left as a gap.`,
      T`Angka formal (壹 贰 叁 …) melindungi cek dan kontrak dari pengubahan, dan batang hitung China adalah sistem nilai tempat desimal awal dengan nol dibiarkan sebagai celah.`,
    ),
    L(
      T`Because the names are so regular, researchers have linked them to children learning to count sooner (Miller and colleagues, 1995).`,
      T`Karena namanya begitu teratur, para peneliti mengaitkannya dengan anak yang lebih cepat belajar berhitung (Miller dan kawan-kawan, 1995).`,
    ),
  ],

  sections: [
    /* ---------------------------------------------------------------- 0 to 10 */
    {
      id: 'count-0-to-10',
      heading: L('How do you count from 0 to 10 in Chinese?', 'Bagaimana menghitung dari 0 sampai 10 dalam bahasa China?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**In Mandarin Chinese the numbers 0 to 10 are 零 (líng), 一 (yī), 二 (èr), 三 (sān), 四 (sì), 五 (wǔ), 六 (liù), 七 (qī), 八 (bā), 九 (jiǔ) and 十 (shí).** Each one is a single character, and each is said with one of the four tones of Mandarin, which the marks above the pinyin letters show.

| Number | Character | Pinyin | Worth knowing |
|---|---|---|---|
| 0 | 零 | líng | also written 〇 in years and dates |
| 1 | 一 | yī | said *yāo* (written 幺) in phone numbers |
| 2 | 二 | èr | 两 (liǎng) is used for quantities |
| 3 | 三 | sān | three horizontal strokes |
| 4 | 四 | sì | sounds like 死 (sǐ, "death") |
| 5 | 五 | wǔ | — |
| 6 | 六 | liù | sounds like 流 (liú, "to flow smoothly") |
| 7 | 七 | qī | — |
| 8 | 八 | bā | sounds like 发 (fā, "to get rich") |
| 9 | 九 | jiǔ | sounds like 久 (jiǔ, "long-lasting") |
| 10 | 十 | shí | two crossing strokes |

**Pinyin** is the standard way of writing Mandarin sounds with the Latin alphabet. Mandarin has four tones — high and level (ā), rising (á), dipping (ǎ) and falling (à) — and a neutral tone, and a different tone is a different word: sì (4, falling) and sǐ (death, dipping) differ only in tone. The marks are not decoration; learn each number with its tone.`,
            T`**Dalam bahasa Mandarin, bilangan 0 sampai 10 adalah 零 (líng), 一 (yī), 二 (èr), 三 (sān), 四 (sì), 五 (wǔ), 六 (liù), 七 (qī), 八 (bā), 九 (jiǔ), dan 十 (shí).** Masing-masing satu aksara, dan masing-masing diucapkan dengan salah satu dari empat nada bahasa Mandarin, yang ditunjukkan oleh tanda di atas huruf pinyin.

| Bilangan | Aksara | Pinyin | Perlu diketahui |
|---|---|---|---|
| 0 | 零 | líng | juga ditulis 〇 dalam tahun dan tanggal |
| 1 | 一 | yī | dibaca *yāo* (ditulis 幺) pada nomor telepon |
| 2 | 二 | èr | 两 (liǎng) dipakai untuk jumlah |
| 3 | 三 | sān | tiga goresan mendatar |
| 4 | 四 | sì | bunyinya mirip 死 (sǐ, "mati") |
| 5 | 五 | wǔ | — |
| 6 | 六 | liù | bunyinya mirip 流 (liú, "mengalir lancar") |
| 7 | 七 | qī | — |
| 8 | 八 | bā | bunyinya mirip 发 (fā, "menjadi kaya") |
| 9 | 九 | jiǔ | bunyinya mirip 久 (jiǔ, "awet") |
| 10 | 十 | shí | dua goresan yang bersilang |

**Pinyin** adalah cara baku menulis bunyi bahasa Mandarin dengan huruf Latin. Bahasa Mandarin punya empat nada — tinggi mendatar (ā), naik (á), turun-naik (ǎ), dan turun (à) — serta nada netral, dan nada yang berbeda berarti kata yang berbeda: sì (4, turun) dan sǐ (mati, turun-naik) hanya berbeda nada. Tanda itu bukan hiasan; pelajari setiap bilangan beserta nadanya.`,
          ),
        },
        {
          kind: 'callout',
          tone: 'note',
          title: L('Why 一 sounds different in speech', 'Mengapa 一 terdengar berbeda saat diucapkan'),
          text: L(
            T`Textbooks give each character its own tone, as this article does. In speech 一 (yī) changes: it becomes yí before a falling tone (一万 yí wàn) and yì before the other tones (一百 yì bǎi, 一千 yì qiān). The writing never changes, only the sound.`,
            T`Buku pelajaran memberi tiap aksara nadanya sendiri, seperti artikel ini. Saat diucapkan, 一 (yī) berubah: menjadi yí sebelum nada turun (一万 yí wàn) dan yì sebelum nada lainnya (一百 yì bǎi, 一千 yì qiān). Tulisannya tidak pernah berubah, hanya bunyinya.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------ 11 to 99 */
    {
      id: 'eleven-to-ninety-nine',
      heading: L('How do the numbers 11 to 99 work in Chinese?', 'Bagaimana cara kerja bilangan 11 sampai 99 dalam bahasa China?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Numbers from 11 to 99 are built by saying the tens first and the ones second: 十一 is "ten-one" (11), 二十 is "two-ten" (20) and 三十五 is "three-ten-five" (35).** There is nothing to memorise beyond 零 to 十 and one rule: for 10 to 19 say 十 and then the digit, and for 20 to 99 say the tens digit, then 十, then the ones digit (leave it out when it is 0).

| Number | Chinese | Pinyin | Literally |
|---|---|---|---|
| 11 | 十一 | shí yī | ten-one |
| 12 | 十二 | shí èr | ten-two |
| 20 | 二十 | èr shí | two-ten |
| 21 | 二十一 | èr shí yī | two-ten-one |
| 35 | 三十五 | sān shí wǔ | three-ten-five |
| 99 | 九十九 | jiǔ shí jiǔ | nine-ten-nine |

Compare this with English, which has the special words eleven, twelve, thirteen and twenty, and with Indonesian, where 11 is sebelas and 12 is dua belas (belas marks the teens) and 20 is dua puluh. Chinese has no such exceptions at all.

| Number | Chinese | Indonesian | English |
|---|---|---|---|
| 11 | 十一 | sebelas | eleven |
| 12 | 十二 | dua belas | twelve |
| 20 | 二十 | dua puluh | twenty |
| 21 | 二十一 | dua puluh satu | twenty-one |
| 35 | 三十五 | tiga puluh lima | thirty-five |

Researchers have linked such regular names to how children learn to count. In a 1995 study by Miller and colleagues, Chinese-speaking children counted further than American children of the same age, and the difference showed mainly in the numbers beyond ten, where English names stop being regular.`,
            T`**Bilangan dari 11 sampai 99 dibangun dengan menyebut puluhan lebih dulu dan satuan kemudian: 十一 adalah "sepuluh-satu" (11), 二十 adalah "dua-sepuluh" (20), dan 三十五 adalah "tiga-sepuluh-lima" (35).** Tidak ada yang perlu dihafal selain 零 sampai 十 dan satu aturan: untuk 10 sampai 19 ucapkan 十 lalu angkanya, dan untuk 20 sampai 99 ucapkan angka puluhan, lalu 十, lalu angka satuan (dihilangkan bila 0).

| Bilangan | Aksara | Pinyin | Secara harfiah |
|---|---|---|---|
| 11 | 十一 | shí yī | sepuluh-satu |
| 12 | 十二 | shí èr | sepuluh-dua |
| 20 | 二十 | èr shí | dua-sepuluh |
| 21 | 二十一 | èr shí yī | dua-sepuluh-satu |
| 35 | 三十五 | sān shí wǔ | tiga-sepuluh-lima |
| 99 | 九十九 | jiǔ shí jiǔ | sembilan-sepuluh-sembilan |

Bandingkan dengan bahasa Inggris, yang punya kata khusus eleven, twelve, thirteen, dan twenty, serta dengan bahasa Indonesia, tempat 11 adalah sebelas, 12 adalah dua belas (belas menandai belasan), dan 20 adalah dua puluh. Bahasa China sama sekali tidak punya pengecualian seperti itu.

| Bilangan | Bahasa China | Bahasa Indonesia | Bahasa Inggris |
|---|---|---|---|
| 11 | 十一 | sebelas | eleven |
| 12 | 十二 | dua belas | twelve |
| 20 | 二十 | dua puluh | twenty |
| 21 | 二十一 | dua puluh satu | twenty-one |
| 35 | 三十五 | tiga puluh lima | thirty-five |

Para peneliti mengaitkan nama bilangan yang teratur seperti ini dengan cara anak belajar berhitung. Dalam studi tahun 1995 oleh Miller dan kawan-kawan, anak-anak berbahasa China berhitung lebih jauh daripada anak-anak Amerika seusianya, dan perbedaannya terutama tampak pada bilangan di atas sepuluh, tempat nama dalam bahasa Inggris tidak lagi teratur.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: build a number', 'Coba: susun sebuah bilangan'),
          step: {
            kind: 'quiz',
            id: 'a1',
            prompt: L('Which one is 36 in Chinese?', 'Mana yang berarti 36 dalam bahasa China?'),
            options: [L('三十六', '三十六'), L('六十三', '六十三'), L('三六', '三六'), L('十三六', '十三六')],
            answer: 0,
            explain: L(
              '三十六 is "three-ten-six": the tens digit 三, then 十, then the ones digit 六. 六十三 would be 63.',
              '三十六 adalah "tiga-sepuluh-enam": angka puluhan 三, lalu 十, lalu angka satuan 六. 六十三 berarti 63.',
            ),
            hint: L('Say the tens digit first, then 十, then the ones digit.', 'Ucapkan angka puluhan lebih dulu, lalu 十, lalu angka satuan.'),
          },
        },
      ],
    },

    /* ------------------------------------------------- hundreds, thousands, zero */
    {
      id: 'hundreds-thousands-zero',
      heading: L('How do you say hundreds, thousands and zero in Chinese?', 'Bagaimana menyebut ratusan, ribuan, dan nol dalam bahasa China?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Hundreds and thousands use the place words 百 (bǎi) and 千 (qiān) after the digit, and a gap of zeros is read as a single 零 (líng): 105 is 一百零五.** Unlike 十, the words 百 and 千 always need their digit, so 100 is 一百 and never just 百.

| Number | Chinese | Pinyin | What to notice |
|---|---|---|---|
| 100 | 一百 | yī bǎi | 一 is kept before 百 |
| 101 | 一百零一 | yī bǎi líng yī | one 零 for the empty tens place |
| 110 | 一百一十 | yī bǎi yī shí | 一十, not 十, because 十 is not at the start |
| 305 | 三百零五 | sān bǎi líng wǔ | 零 for the empty tens place |
| 1,000 | 一千 | yī qiān | the zeros at the end are not read |
| 1,001 | 一千零一 | yī qiān líng yī | two empty places, but one 零 |
| 1,010 | 一千零一十 | yī qiān líng yī shí | one 零 for the empty hundreds place |
| 2,000 | 两千 | liǎng qiān | 两, not 二, before 千 |
| 2,345 | 两千三百四十五 | liǎng qiān sān bǎi sì shí wǔ | |

**The zero rule.** Say 零 once for each gap of one or more zeros that sits between two non-zero digits. Never say it for zeros at the end of a number: 1,000 is 一千, not "一千零".

**Two words for 2.** Use 二 (èr) when 2 is a digit or the last digit of a group (二十, 十二, 第二). Use 两 (liǎng) when a lone 2 comes before 千, 万 or 亿 (两千, 两万, 两亿) and before a measure word (两个人, "two people"). Before 百 both are heard: 二百 and 两百.

**In speech the last unit is often dropped.** 一百五 usually means 150 (一百五十) and 三千五 means 3,500. That is why 105 must keep its 零: 一百零五 is 105, but 一百五 is 150.`,
            T`**Ratusan dan ribuan memakai kata tempat 百 (bǎi) dan 千 (qiān) setelah angkanya, dan celah berisi nol dibaca satu 零 (líng): 105 adalah 一百零五.** Berbeda dengan 十, kata 百 dan 千 selalu membutuhkan angkanya, jadi 100 adalah 一百 dan tidak pernah hanya 百.

| Bilangan | Aksara | Pinyin | Yang perlu diperhatikan |
|---|---|---|---|
| 100 | 一百 | yī bǎi | 一 dipertahankan sebelum 百 |
| 101 | 一百零一 | yī bǎi líng yī | satu 零 untuk tempat puluhan yang kosong |
| 110 | 一百一十 | yī bǎi yī shí | 一十, bukan 十, karena 十 tidak berada di awal |
| 305 | 三百零五 | sān bǎi líng wǔ | 零 untuk tempat puluhan yang kosong |
| 1.000 | 一千 | yī qiān | nol di ujung tidak dibaca |
| 1.001 | 一千零一 | yī qiān líng yī | dua tempat kosong, tetapi satu 零 |
| 1.010 | 一千零一十 | yī qiān líng yī shí | satu 零 untuk tempat ratusan yang kosong |
| 2.000 | 两千 | liǎng qiān | 两, bukan 二, sebelum 千 |
| 2.345 | 两千三百四十五 | liǎng qiān sān bǎi sì shí wǔ | |

**Aturan nol.** Ucapkan 零 satu kali untuk setiap celah berisi satu atau lebih angka nol yang berada di antara dua angka bukan nol. Jangan pernah mengucapkannya untuk nol di ujung bilangan: 1.000 adalah 一千, bukan "一千零".

**Dua kata untuk 2.** Pakai 二 (èr) ketika 2 adalah sebuah angka atau angka terakhir sebuah kelompok (二十, 十二, 第二). Pakai 两 (liǎng) ketika angka 2 yang berdiri sendiri berada sebelum 千, 万, atau 亿 (两千, 两万, 两亿) dan sebelum kata penggolong (两个人, "dua orang"). Sebelum 百 keduanya terdengar: 二百 dan 两百.

**Dalam percakapan, satuan terakhir sering dihilangkan.** 一百五 biasanya berarti 150 (一百五十) dan 三千五 berarti 3.500. Itulah sebabnya 105 harus mempertahankan 零-nya: 一百零五 adalah 105, tetapi 一百五 adalah 150.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: the zero rule', 'Coba: aturan nol'),
          step: {
            kind: 'quiz',
            id: 'a2',
            prompt: L('Which one is 4,007 in Chinese?', 'Mana yang berarti 4.007 dalam bahasa China?'),
            options: [L('四千零七', '四千零七'), L('四千七', '四千七'), L('四千零七十', '四千零七十'), L('四百零七', '四百零七')],
            answer: 0,
            explain: L(
              '四千零七 is "four thousand, zero, seven". 四千七 would be heard as 4,700, 四千零七十 is 4,070 and 四百零七 is 407.',
              '四千零七 adalah "empat ribu, nol, tujuh". 四千七 akan terdengar sebagai 4.700, 四千零七十 adalah 4.070, dan 四百零七 adalah 407.',
            ),
            hint: L('The hundreds and tens places are empty. How many 零 do you say for that gap?', 'Tempat ratusan dan puluhan kosong. Berapa 零 yang diucapkan untuk celah itu?'),
          },
        },
      ],
    },

    /* ----------------------------------------------------------------- wan, yi */
    {
      id: 'wan-yi',
      heading: L('Why does Chinese count in 万 and 亿 instead of thousands and millions?', 'Mengapa bahasa China menghitung dengan 万 dan 亿, bukan ribuan dan jutaan?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Chinese groups digits in fours, not threes: after 千 (1,000) the next new word is 万 (wàn, 10,000), and the next after that is 亿 (yì, 100,000,000).** English, Indonesian and most European languages add a new word every three digits (thousand, million, billion). Chinese adds one every four, so a number is a short list of numbers up to 9999, each followed by 万 or 亿.

| Value | Chinese | English | Indonesian |
|---|---|---|---|
| 10,000 | 一万 | ten thousand | sepuluh ribu |
| 100,000 | 十万 | one hundred thousand | seratus ribu |
| 1,000,000 | 一百万 | one million | satu juta |
| 10,000,000 | 一千万 | ten million | sepuluh juta |
| 100,000,000 | 一亿 | one hundred million | seratus juta |
| 1,000,000,000 | 十亿 | one billion | satu miliar |
| 1,000,000,000,000 | 一万亿 | one trillion | satu triliun |

The two systems agree only at 10 to the power 12, where 万亿 (10,000 × 100,000,000) is one trillion. In between, a speaker has to translate: "100,000" is not "a hundred thousand" but "ten wàn". The scholars' word *myriad* for 10,000 is the same unit as 万.

**A quick way to read any number.** Count the digits from the right in fours. The first four are the plain group, the next four are the 万 group, and the next four are the 亿 group. The widget below shows both groupings at once.`,
            T`**Bahasa China mengelompokkan angka empat-empat, bukan tiga-tiga: setelah 千 (1.000) kata baru berikutnya adalah 万 (wàn, 10.000), dan setelah itu 亿 (yì, 100.000.000).** Bahasa Inggris, Indonesia, dan kebanyakan bahasa Eropa menambah kata baru setiap tiga angka (ribu, juta, miliar). Bahasa China menambah satu setiap empat angka, jadi sebuah bilangan adalah daftar pendek bilangan sampai 9999, masing-masing diikuti 万 atau 亿.

| Nilai | Bahasa China | Bahasa Inggris | Bahasa Indonesia |
|---|---|---|---|
| 10.000 | 一万 | ten thousand | sepuluh ribu |
| 100.000 | 十万 | one hundred thousand | seratus ribu |
| 1.000.000 | 一百万 | one million | satu juta |
| 10.000.000 | 一千万 | ten million | sepuluh juta |
| 100.000.000 | 一亿 | one hundred million | seratus juta |
| 1.000.000.000 | 十亿 | one billion | satu miliar |
| 1.000.000.000.000 | 一万亿 | one trillion | satu triliun |

Kedua sistem bertemu hanya pada 10 pangkat 12, tempat 万亿 (10.000 × 100.000.000) adalah satu triliun. Di antaranya, penutur harus menerjemahkan: "100.000" bukan "seratus ribu" melainkan "sepuluh wàn". Kata *myriad* yang dipakai para sarjana untuk 10.000 adalah satuan yang sama dengan 万.

**Cara cepat membaca bilangan apa pun.** Hitung angka dari kanan, empat demi empat. Empat angka pertama adalah kelompok biasa, empat berikutnya adalah kelompok 万, dan empat berikutnya lagi adalah kelompok 亿. Widget di bawah memperlihatkan kedua pengelompokan sekaligus.`,
          ),
        },
        { kind: 'widget', name: 'grouping' },
        {
          kind: 'activity',
          title: L('Try it: how big is it?', 'Coba: seberapa besar?'),
          step: {
            kind: 'quiz',
            id: 'a3',
            prompt: L('What is 三千万?', 'Berapakah 三千万?'),
            options: [L('3,000,000', '3.000.000'), L('30,000,000', '30.000.000'), L('300,000,000', '300.000.000'), L('30,000', '30.000')],
            answer: 1,
            explain: L(
              '三千万 is 3,000 × 万, and 万 is 10,000, so it is 30,000,000. 30,000 would be 三万.',
              '三千万 adalah 3.000 × 万, dan 万 adalah 10.000, jadi nilainya 30.000.000. Bilangan 30.000 adalah 三万.',
            ),
            hint: L('Read 三千 as 3,000, then multiply by 万.', 'Baca 三千 sebagai 3.000, lalu kalikan dengan 万.'),
          },
        },
        {
          kind: 'activity',
          title: L('Try it: type the value', 'Coba: ketik nilainya'),
          step: {
            kind: 'math',
            id: 'a4',
            hints: [
              L('一百二十 is 120. Then multiply by 万.', '一百二十 adalah 120. Lalu kalikan dengan 万.'),
              L('120 × 10,000 = 1,200,000.', '120 × 10.000 = 1.200.000.'),
            ],
            explain: L('一百二十 is 120 and 万 is 10,000, so 一百二十万 = 1,200,000.', '一百二十 adalah 120 dan 万 adalah 10.000, jadi 一百二十万 = 1.200.000.'),
            prompt: L('Write 一百二十万 as digits.', 'Tulis 一百二十万 dengan angka.'),
            blanks: [{ answer: 1200000 }],
          },
        },
      ],
    },

    /* ------------------------------------------------------------ convert */
    {
      id: 'convert-any-number',
      heading: L('How do you write any number in Chinese, step by step?', 'Bagaimana menulis bilangan apa pun dalam bahasa China, langkah demi langkah?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To write a number in Chinese, split its digits into groups of four from the right, read each group with 千 百 十, put 亿 or 万 after the groups, and say 零 once for each gap of zeros.** Take 20,508,030:

1. Write the digits and cut them into groups of four from the right: 2050 | 8030.
2. Read each group as a number up to 9999 with 千, 百 and 十. 2050 is 两千零五十 and 8030 is 八千零三十.
3. Put 万 after the second group from the right and 亿 after the third. The last group has no unit: 两千零五十万 八千零三十.
4. Say 零 once for each gap of zeros, including a gap between groups (when a group starts below 1,000, or a whole group is empty).
5. Check the special cases: 两 for a lone 2 before 千, 万 or 亿; drop the 一 only before a leading 十 (十, 十一, 十万); and do not read zeros at the end.

So 20,508,030 is 两千零五十万八千零三十 (liǎng qiān líng wǔ shí wàn bā qiān líng sān shí). Try your own numbers below, and switch between simplified, traditional and formal writing.`,
            T`**Untuk menulis sebuah bilangan dalam bahasa China, bagi angkanya menjadi kelompok empat-empat dari kanan, baca tiap kelompok dengan 千 百 十, taruh 亿 atau 万 setelah kelompok, dan ucapkan 零 satu kali untuk setiap celah berisi nol.** Ambil 20.508.030:

1. Tulis angkanya dan potong menjadi kelompok empat-empat dari kanan: 2050 | 8030.
2. Baca tiap kelompok sebagai bilangan sampai 9999 dengan 千, 百, dan 十. 2050 adalah 两千零五十 dan 8030 adalah 八千零三十.
3. Taruh 万 setelah kelompok kedua dari kanan dan 亿 setelah kelompok ketiga. Kelompok terakhir tidak punya satuan: 两千零五十万 八千零三十.
4. Ucapkan 零 satu kali untuk setiap celah berisi nol, termasuk celah di antara kelompok (ketika sebuah kelompok dimulai di bawah 1.000, atau seluruh kelompok kosong).
5. Periksa kasus khusus: 两 untuk angka 2 yang berdiri sendiri sebelum 千, 万, atau 亿; hilangkan 一 hanya sebelum 十 di awal (十, 十一, 十万); dan jangan baca nol di ujung.

Jadi 20.508.030 adalah 两千零五十万八千零三十 (liǎng qiān líng wǔ shí wàn bā qiān líng sān shí). Coba bilanganmu sendiri di bawah, dan ganti antara tulisan sederhana, tradisional, dan formal.`,
          ),
        },
        { kind: 'widget', name: 'cnconvert' },
        {
          kind: 'callout',
          tone: 'tip',
          title: L('Traditional characters', 'Aksara tradisional'),
          text: L(
            T`Taiwan, Hong Kong and Macau write with traditional characters. Only three number characters differ from the simplified ones used on the mainland: 两 becomes 兩, 万 becomes 萬 and 亿 becomes 億. Everything else, and every rule above, is the same.`,
            T`Taiwan, Hong Kong, dan Makau menulis dengan aksara tradisional. Hanya tiga aksara bilangan yang berbeda dari aksara sederhana yang dipakai di daratan: 两 menjadi 兩, 万 menjadi 萬, dan 亿 menjadi 億. Selebihnya, dan setiap aturan di atas, sama saja.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------- practise reading */
    {
      id: 'practise-reading',
      heading: L('How can you practise reading Chinese numbers?', 'Bagaimana berlatih membaca bilangan China?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**To read a Chinese number, find 亿 and 万, read each part as a number up to 9999, and write each part with four digits.** Reading is the writing steps run backwards:

1. Find 亿 and 万 in the number and cut it after each of them.
2. Read each part on its own: 千 is thousands, 百 hundreds, 十 tens, and what is left is the ones.
3. Write every part except the first with four digits, putting zeros in front where needed (零 tells you a place is empty).
4. Join the parts. For example 两千零五十万八千零三十 is 2050 | 8030, which is 20,508,030.

Practise with the widget below: eight numbers of growing size, with pinyin on request. The wrong answers are the mistakes people really make — a place too many or too few, two digits swapped, one digit off.`,
            T`**Untuk membaca bilangan China, cari 亿 dan 万, baca tiap bagian sebagai bilangan sampai 9999, dan tulis tiap bagian dengan empat angka.** Membaca adalah langkah menulis yang dijalankan terbalik:

1. Cari 亿 dan 万 dalam bilangan itu dan potong setelah masing-masing.
2. Baca tiap bagian sendiri-sendiri: 千 adalah ribuan, 百 ratusan, 十 puluhan, dan sisanya satuan.
3. Tulis setiap bagian kecuali yang pertama dengan empat angka, dengan nol di depan bila perlu (零 memberi tahu bahwa sebuah tempat kosong).
4. Gabungkan bagian-bagiannya. Misalnya 两千零五十万八千零三十 adalah 2050 | 8030, yaitu 20.508.030.

Berlatihlah dengan widget di bawah: delapan bilangan dengan ukuran yang makin besar, dengan pinyin bila diminta. Jawaban yang salah adalah kesalahan yang memang sering dibuat — satu tempat terlalu banyak atau terlalu sedikit, dua angka tertukar, atau satu angka meleset.`,
          ),
        },
        { kind: 'widget', name: 'cnread' },
      ],
    },

    /* --------------------------------------------- fractions, decimals, dates */
    {
      id: 'fractions-decimals-dates',
      heading: L('How do you say fractions, decimals, percentages, years and phone numbers?', 'Bagaimana menyebut pecahan, desimal, persen, tahun, dan nomor telepon?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Fractions, decimals, percentages, negatives and ordinals follow fixed patterns built from the same number words, while years and phone numbers are read digit by digit.**

| Meaning | Pattern | Example | Pinyin |
|---|---|---|---|
| Decimal | whole part + 点 + digits one by one | 3.14 = 三点一四 | sān diǎn yī sì |
| Fraction | denominator + 分之 + numerator | 1/3 = 三分之一 | sān fēn zhī yī |
| Fraction | denominator first, always | 2/3 = 三分之二 | sān fēn zhī èr |
| Percentage | 百分之 + number | 25% = 百分之二十五 | bǎi fēn zhī èr shí wǔ |
| Negative | 负 + number | −5 = 负五 | fù wǔ |
| Ordinal | 第 + number | 3rd = 第三 | dì sān |
| Half | 半 | half an hour = 半小时 | bàn xiǎoshí |
| Year | digit by digit + 年 | 2025 = 二〇二五年 | èr líng èr wǔ nián |
| Phone number | digit by digit, 1 = 幺 | 110 = 幺幺〇 | yāo yāo líng |

A [fraction](article:rational-numbers) is said "of three parts, one": 三分之一 means "one of three parts". A [percentage](article:rational-numbers#decimals-percent) is "of a hundred parts": 百分之五十 is 50%. The digits after 点 are never grouped: 3.14 is "three point one four", never "three point fourteen".

A year is a label, not a quantity, so it is read as separate digits and written with 〇 (or 零): 二〇二五年. The quantity "two thousand and twenty-five" would be 两千零二十五.`,
            T`**Pecahan, desimal, persen, bilangan negatif, dan bilangan urutan mengikuti pola tetap yang dibangun dari kata bilangan yang sama, sedangkan tahun dan nomor telepon dibaca angka demi angka.**

| Arti | Pola | Contoh | Pinyin |
|---|---|---|---|
| Desimal | bagian bulat + 点 + angka satu per satu | 3,14 = 三点一四 | sān diǎn yī sì |
| Pecahan | penyebut + 分之 + pembilang | 1/3 = 三分之一 | sān fēn zhī yī |
| Pecahan | penyebut selalu lebih dulu | 2/3 = 三分之二 | sān fēn zhī èr |
| Persen | 百分之 + bilangan | 25% = 百分之二十五 | bǎi fēn zhī èr shí wǔ |
| Negatif | 负 + bilangan | −5 = 负五 | fù wǔ |
| Urutan | 第 + bilangan | ke-3 = 第三 | dì sān |
| Setengah | 半 | setengah jam = 半小时 | bàn xiǎoshí |
| Tahun | angka demi angka + 年 | 2025 = 二〇二五年 | èr líng èr wǔ nián |
| Nomor telepon | angka demi angka, 1 = 幺 | 110 = 幺幺〇 | yāo yāo líng |

[Pecahan](article:rational-numbers) dibaca "dari tiga bagian, satu": 三分之一 berarti "satu dari tiga bagian". [Persen](article:rational-numbers#decimals-percent) adalah "dari seratus bagian": 百分之五十 adalah 50%. Angka setelah 点 tidak pernah dikelompokkan: 3,14 dibaca "tiga koma satu empat", bukan "tiga koma empat belas".

Tahun adalah label, bukan jumlah, sehingga dibaca sebagai angka-angka terpisah dan ditulis dengan 〇 (atau 零): 二〇二五年. Jumlah "dua ribu dua puluh lima" adalah 两千零二十五.`,
          ),
        },
        {
          kind: 'activity',
          title: L('Try it: a percentage', 'Coba: sebuah persen'),
          step: {
            kind: 'quiz',
            id: 'a5',
            prompt: L('How do you say 25% in Chinese?', 'Bagaimana mengucapkan 25% dalam bahasa China?'),
            options: [L('百分之二十五', '百分之二十五'), L('二十五分之百', '二十五分之百'), L('二十五百分', '二十五百分'), L('百二十五分', '百二十五分')],
            answer: 0,
            explain: L(
              '百分之 means "of a hundred parts", and the number follows it: 百分之二十五. The pattern is always 百分之 first.',
              '百分之 berarti "dari seratus bagian", dan bilangannya mengikuti: 百分之二十五. Polanya selalu 百分之 di depan.',
            ),
            hint: L('A percentage starts with 百分之, then the number.', 'Persen diawali 百分之, lalu bilangannya.'),
          },
        },
      ],
    },

    /* ------------------------------------------------------------- formal */
    {
      id: 'formal-numerals',
      heading: L('What are the formal Chinese numerals 壹, 贰, 叁?', 'Apa itu angka formal China 壹, 贰, 叁?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Formal Chinese numerals (大写数字, dàxiě shùzì) are a second set of characters for the same numbers, used on cheques, receipts and contracts because they are hard to alter.** The ordinary 一 can become 三 with one stroke, and 十 can become 千; 壹 and 叁 cannot.

| Number | Ordinary | Formal | Pinyin |
|---|---|---|---|
| 0 | 零 | 零 | líng |
| 1 | 一 | 壹 | yī |
| 2 | 二 | 贰 | èr |
| 3 | 三 | 叁 | sān |
| 4 | 四 | 肆 | sì |
| 5 | 五 | 伍 | wǔ |
| 6 | 六 | 陆 | lù |
| 7 | 七 | 柒 | qī |
| 8 | 八 | 捌 | bā |
| 9 | 九 | 玖 | jiǔ |
| 10 | 十 | 拾 | shí |
| 100 | 百 | 佰 | bǎi |
| 1,000 | 千 | 仟 | qiān |

The reading rules are the same, with two differences: the formal form of 2 is always 贰 (never 两), and 10 is written 壹拾 with its 壹 kept. A cheque for 1,205 yuan reads 壹仟贰佰零伍元整 (yī qiān èr bǎi líng wǔ yuán zhěng), where 整 means "exactly", closing the amount so nothing can be added after it. The converter above has a formal setting.

This is the same idea as writing an amount in words on a cheque in English or Indonesian.`,
            T`**Angka formal China (大写数字, dàxiě shùzì) adalah set aksara kedua untuk bilangan yang sama, dipakai pada cek, kuitansi, dan kontrak karena sulit diubah.** 一 yang biasa dapat menjadi 三 dengan satu goresan, dan 十 dapat menjadi 千; 壹 dan 叁 tidak bisa.

| Bilangan | Biasa | Formal | Pinyin |
|---|---|---|---|
| 0 | 零 | 零 | líng |
| 1 | 一 | 壹 | yī |
| 2 | 二 | 贰 | èr |
| 3 | 三 | 叁 | sān |
| 4 | 四 | 肆 | sì |
| 5 | 五 | 伍 | wǔ |
| 6 | 六 | 陆 | lù |
| 7 | 七 | 柒 | qī |
| 8 | 八 | 捌 | bā |
| 9 | 九 | 玖 | jiǔ |
| 10 | 十 | 拾 | shí |
| 100 | 百 | 佰 | bǎi |
| 1.000 | 千 | 仟 | qiān |

Aturan bacanya sama, dengan dua perbedaan: bentuk formal 2 selalu 贰 (tidak pernah 两), dan 10 ditulis 壹拾 dengan 壹 tetap ada. Sebuah cek senilai 1.205 yuan dibaca 壹仟贰佰零伍元整 (yī qiān èr bǎi líng wǔ yuán zhěng), tempat 整 berarti "tepat", menutup jumlah itu agar tidak ada yang bisa ditambahkan di belakangnya. Konverter di atas punya pengaturan formal.

Gagasannya sama dengan menulis jumlah dengan huruf pada cek dalam bahasa Inggris atau Indonesia.`,
          ),
        },
      ],
    },

    /* ----------------------------------------------------------------- rods */
    {
      id: 'counting-rods',
      heading: L('What are Chinese counting rods and Suzhou numerals?', 'Apa itu batang hitung China dan angka Suzhou?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Counting rods (算筹, suànchóu) were small sticks of bamboo, bone or ivory laid out in columns on a flat surface to calculate; they form an early decimal place-value system in which an empty place is a gap.** Bundles of rods have been found in tombs of the Han dynasty (206 BCE to 220 CE), and the *Sunzi suanjing*, written between the 3rd and 5th centuries CE, describes how the digits are laid out. The rods were gradually replaced by the abacus (算盘, suànpán), which was widespread by the Ming dynasty (1368 to 1644).

How a number is laid out:

- Each place gets its own column, with the highest place on the left, exactly like written digits.
- The digits 1 to 5 are that many rods. For 6 to 9, one rod laid across stands for 5, and the remaining rods are added to it.
- The direction alternates from place to place: rods stand upright in the ones, hundreds and ten-thousands places and lie flat in the tens, thousands and hundred-thousands places, so two neighbouring digits are never mixed up.
- Zero is an empty column. A written circle for zero appears in Chinese mathematical books by the 13th century, for example in Qin Jiushao's *Shùshū Jiǔzhāng* (1247).
- Red rods are positive and black rods negative in the *Nine Chapters on the Mathematical Art*, so a column of rods can hold a debt: see the history of [negative numbers](article:integers#what-are-integers) in the article on integers.

**Suzhou numerals** (苏州码子, Sūzhōu mǎzi) are the written shorthand that grew out of the rods, long used by traders and still seen on some market price tags: 〇 〡 〢 〣 〤 〥 〦 〧 〨 〩 for 0 to 9. The widget draws the rods for a number beside its Suzhou numerals.`,
            T`**Batang hitung (算筹, suànchóu) adalah batang kecil dari bambu, tulang, atau gading yang disusun dalam kolom di permukaan datar untuk berhitung; ia membentuk sistem nilai tempat desimal awal, tempat sebuah tempat yang kosong adalah celah.** Seikat batang hitung ditemukan di makam dinasti Han (206 SM sampai 220 M), dan *Sunzi suanjing*, yang ditulis antara abad ke-3 dan ke-5 M, menjelaskan cara menyusun angkanya. Batang hitung berangsur digantikan oleh sempoa (算盘, suànpán), yang sudah meluas pada masa dinasti Ming (1368 sampai 1644).

Cara sebuah bilangan disusun:

- Setiap tempat mendapat kolomnya sendiri, dengan tempat tertinggi di kiri, persis seperti angka yang ditulis.
- Angka 1 sampai 5 adalah sebanyak itu batang. Untuk 6 sampai 9, satu batang yang dibaringkan melintang mewakili 5, dan batang sisanya ditambahkan padanya.
- Arahnya bergantian dari tempat ke tempat: batang berdiri tegak di tempat satuan, ratusan, dan puluh ribuan, dan berbaring mendatar di tempat puluhan, ribuan, dan ratus ribuan, sehingga dua angka bertetangga tidak pernah tertukar.
- Nol adalah kolom kosong. Lingkaran tertulis untuk nol muncul dalam buku matematika China pada abad ke-13, misalnya dalam *Shùshū Jiǔzhāng* karya Qin Jiushao (1247).
- Batang merah positif dan batang hitam negatif dalam *Nine Chapters on the Mathematical Art*, sehingga satu kolom batang dapat menyimpan utang: lihat sejarah [bilangan negatif](article:integers#what-are-integers) pada artikel bilangan bulat.

**Angka Suzhou** (苏州码子, Sūzhōu mǎzi) adalah tulisan singkat yang tumbuh dari batang hitung, lama dipakai para pedagang dan masih terlihat pada beberapa label harga di pasar: 〇 〡 〢 〣 〤 〥 〦 〧 〨 〩 untuk 0 sampai 9. Widget menggambar batang hitung untuk sebuah bilangan di samping angka Suzhou-nya.`,
          ),
        },
        { kind: 'widget', name: 'rods' },
        {
          kind: 'callout',
          tone: 'note',
          title: L('A drawing convention', 'Sebuah konvensi gambar'),
          text: L(
            T`Old sources differ in small details, such as which end carries the rod that stands for five in the lying-down form. The widget draws one common form so the idea is clear; it is not a facsimile of any particular text.`,
            T`Sumber-sumber lama berbeda dalam rincian kecil, misalnya ujung mana yang membawa batang pewakil lima pada bentuk berbaring. Widget menggambar satu bentuk yang umum agar gagasannya jelas; ia bukan tiruan persis dari teks tertentu.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------- lucky */
    {
      id: 'lucky-numbers',
      heading: L('Why are some numbers lucky or unlucky in Chinese?', 'Mengapa sebagian bilangan dianggap beruntung atau tidak beruntung dalam bahasa China?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Numbers are lucky or unlucky in Chinese because of how they sound: a number that sounds like a good word is lucky, and one that sounds like a bad word is avoided.** The meaning comes from the sound, not from the number.

| Number | Pinyin | Sounds like | Meaning |
|---|---|---|---|
| 8 | bā | 发 (fā) "to get rich" | the luckiest number: prices, car plates, dates |
| 6 | liù | 流 (liú) "to flow smoothly" | lucky: everything goes smoothly |
| 9 | jiǔ | 久 (jiǔ) "long-lasting" | lucky, common at weddings |
| 4 | sì | 死 (sǐ) "death" | unlucky: some buildings have no 4th floor |
| 520 | wǔ èr líng | 我爱你 (wǒ ài nǐ) "I love you" | used on 20 May, "520 day" |
| 1314 | yī sān yī sì | 一生一世 (yī shēng yī shì) "for a lifetime" | used in messages of love |
| 666 | liù liù liù | smooth, smooth, smooth | internet slang for "awesome" |
| 88 | bā bā | 拜拜 (bàibài) "bye-bye" | used at the end of text messages |

The Beijing Summer Olympics opened on 8 August 2008 at 8:08 pm, a date and time chosen for all those eights.`,
            T`**Bilangan dianggap beruntung atau tidak beruntung dalam bahasa China karena bunyinya: bilangan yang bunyinya mirip kata yang baik dianggap beruntung, dan yang bunyinya mirip kata yang buruk dihindari.** Maknanya berasal dari bunyi, bukan dari bilangannya.

| Bilangan | Pinyin | Bunyinya mirip | Makna |
|---|---|---|---|
| 8 | bā | 发 (fā) "menjadi kaya" | bilangan paling beruntung: harga, pelat mobil, tanggal |
| 6 | liù | 流 (liú) "mengalir lancar" | beruntung: semuanya berjalan lancar |
| 9 | jiǔ | 久 (jiǔ) "awet" | beruntung, umum pada pernikahan |
| 4 | sì | 死 (sǐ) "mati" | tidak beruntung: sebagian gedung tidak punya lantai 4 |
| 520 | wǔ èr líng | 我爱你 (wǒ ài nǐ) "aku cinta kamu" | dipakai pada 20 Mei, "hari 520" |
| 1314 | yī sān yī sì | 一生一世 (yī shēng yī shì) "seumur hidup" | dipakai dalam pesan cinta |
| 666 | liù liù liù | lancar, lancar, lancar | bahasa gaul internet untuk "keren sekali" |
| 88 | bā bā | 拜拜 (bàibài) "dadah" | dipakai di ujung pesan teks |

Olimpiade Musim Panas Beijing dibuka pada 8 Agustus 2008 pukul 20:08, tanggal dan waktu yang dipilih karena semua angka delapan itu.`,
          ),
        },
      ],
    },

    /* -------------------------------------------------------------- fingers */
    {
      id: 'finger-counting',
      heading: L('How do you show numbers with one hand in China?', 'Bagaimana menunjukkan bilangan dengan satu tangan di China?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**Chinese speakers show the numbers 1 to 10 with one hand, using a sign for each number that does not depend on language, which lets a market seller and a buyer agree a price across a noisy street.** These are common signs; details vary by region and by person.

| Number | Common sign |
|---|---|
| 1 to 5 | that many fingers raised: 1 is the index finger, 2 adds the middle finger, and 5 is the open hand |
| 6 | thumb and little finger out, the other fingers folded |
| 7 | thumb and fingertips pinched together |
| 8 | thumb and index finger out, in an L shape |
| 9 | index finger bent like a hook |
| 10 | a fist, or the two index fingers crossed to draw 十 |

The sign for 10 draws the character itself: two crossing lines, 十.`,
            T`**Penutur bahasa China menunjukkan bilangan 1 sampai 10 dengan satu tangan, memakai tanda untuk setiap bilangan yang tidak bergantung pada bahasa, sehingga penjual dan pembeli di pasar bisa sepakat soal harga di jalan yang bising.** Ini adalah tanda yang umum; rinciannya berbeda menurut daerah dan orangnya.

| Bilangan | Tanda yang umum |
|---|---|
| 1 sampai 5 | sebanyak itu jari diangkat: 1 adalah jari telunjuk, 2 menambah jari tengah, dan 5 adalah telapak terbuka |
| 6 | ibu jari dan kelingking terbuka, jari lainnya dilipat |
| 7 | ibu jari dan ujung-ujung jari dijepitkan |
| 8 | ibu jari dan telunjuk terbuka, membentuk huruf L |
| 9 | jari telunjuk ditekuk seperti kait |
| 10 | kepalan tangan, atau dua telunjuk disilangkan untuk menggambar 十 |

Tanda untuk 10 menggambar aksaranya sendiri: dua garis yang bersilang, 十.`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------ mistakes */
    {
      id: 'mistakes',
      heading: L('What are the common mistakes with Chinese numbers?', 'Apa kesalahan umum dengan bilangan China?'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`**The most common mistakes with Chinese numbers are the seven below, each with the correct form.**

| Mistake | Correct |
|---|---|
| "10,000 is 十千." | 10,000 is 一万. Chinese has a word for 10 to the power 4, so 十千 is never said. |
| "105 is 一百五." | 一百五 is 150, because the last unit is dropped in speech. 105 is 一百零五. |
| "30,000 is 三千万." | 三千万 is 30,000,000. 30,000 is 三万. |
| "100 is just 百." | 100 is 一百. Only 十 can lose its 一, and only at the start of a number. |
| "Two people is 二个人." | Say 两个人. Use 两 before a measure word. |
| "2025 is 两千零二十五年." | A year is read digit by digit: 二〇二五年. |
| "Say 零 for every zero." | Say 零 once per gap, and never for zeros at the end. |`,
            T`**Kesalahan paling umum dengan bilangan China adalah tujuh hal berikut, masing-masing dengan bentuk yang benar.**

| Kesalahan | Yang benar |
|---|---|
| "10.000 adalah 十千." | 10.000 adalah 一万. Bahasa China punya kata untuk 10 pangkat 4, jadi 十千 tidak pernah diucapkan. |
| "105 adalah 一百五." | 一百五 adalah 150, karena satuan terakhir dihilangkan dalam percakapan. 105 adalah 一百零五. |
| "30.000 adalah 三千万." | 三千万 adalah 30.000.000. 30.000 adalah 三万. |
| "100 cukup 百." | 100 adalah 一百. Hanya 十 yang boleh kehilangan 一-nya, dan hanya di awal bilangan. |
| "Dua orang adalah 二个人." | Ucapkan 两个人. Pakai 两 sebelum kata penggolong. |
| "2025 adalah 两千零二十五年." | Tahun dibaca angka demi angka: 二〇二五年. |
| "Ucapkan 零 untuk setiap nol." | Ucapkan 零 satu kali per celah, dan jangan untuk nol di ujung. |`,
          ),
        },
      ],
    },

    /* ------------------------------------------------------------- practice */
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
          title: L('Which number is it?', 'Bilangan yang mana?'),
          step: {
            kind: 'quiz',
            id: 'p1',
            prompt: L('What number is 三百零五?', 'Bilangan berapakah 三百零五?'),
            options: [L('305', '305'), L('350', '350'), L('3,005', '3.005'), L('35', '35')],
            answer: 0,
            explain: L(
              '三百零五 is 300, then 零 for the empty tens place, then 5: 305. 350 would be 三百五十.',
              '三百零五 adalah 300, lalu 零 untuk tempat puluhan yang kosong, lalu 5: 305. Bilangan 350 adalah 三百五十.',
            ),
            hint: L('零 marks an empty place between 三百 and 五.', '零 menandai tempat kosong di antara 三百 dan 五.'),
          },
        },
        {
          kind: 'activity',
          title: L('True or false?', 'Benar atau salah?'),
          step: {
            kind: 'judge',
            id: 'p2',
            prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
            statements: [
              L('十万 is 100,000.', '十万 adalah 100.000.'),
              L('两千 is 2,000.', '两千 adalah 2.000.'),
              L('一百五 means 105.', '一百五 berarti 105.'),
              L('一万 is 1,000.', '一万 adalah 1.000.'),
              L('二十 can also be written 两十.', '二十 juga dapat ditulis 两十.'),
            ],
            answer: [true, true, false, false, false],
            explain: L(
              '十万 is ten wàn, 100,000. 两千 is 2,000. 一百五 is 150, and 105 is 一百零五. 一万 is 10,000. 二十 is always 二十: 两 is never used for a tens digit.',
              '十万 adalah sepuluh wàn, 100.000. 两千 adalah 2.000. 一百五 adalah 150, dan 105 adalah 一百零五. 一万 adalah 10.000. 二十 selalu 二十: 两 tidak pernah dipakai untuk angka puluhan.',
            ),
            hint: L('Remember 万 is 10,000 and that 一百五 drops its last unit.', 'Ingat bahwa 万 adalah 10.000 dan 一百五 menghilangkan satuan terakhirnya.'),
          },
        },
        {
          kind: 'activity',
          title: L('Select all that apply', 'Pilih semua yang benar'),
          step: {
            kind: 'multi',
            id: 'p3',
            prompt: L('Choose **all** the correct equalities.', 'Pilih **semua** kesamaan yang benar.'),
            options: [
              L('一千万 = 10,000,000', '一千万 = 10.000.000'),
              L('一亿 = 100,000,000', '一亿 = 100.000.000'),
              L('十亿 = 100,000,000', '十亿 = 100.000.000'),
              L('一万 = 10,000', '一万 = 10.000'),
              L('两百万 = 20,000,000', '两百万 = 20.000.000'),
            ],
            answer: [0, 1, 3],
            explain: L(
              '一千万 is 1,000 × 10,000 = 10,000,000; 一亿 is 100,000,000; 一万 is 10,000. 十亿 is 1,000,000,000, and 两百万 is 2,000,000.',
              '一千万 adalah 1.000 × 10.000 = 10.000.000; 一亿 adalah 100.000.000; 一万 adalah 10.000. 十亿 adalah 1.000.000.000, dan 两百万 adalah 2.000.000.',
            ),
            hint: L('Multiply each number before 万 or 亿 by 10,000 or 100,000,000.', 'Kalikan tiap bilangan sebelum 万 atau 亿 dengan 10.000 atau 100.000.000.'),
          },
        },
        {
          kind: 'activity',
          title: L('Write a big number', 'Tulis bilangan besar'),
          step: {
            kind: 'quiz',
            id: 'p4',
            prompt: L('How do you write 20,508,030 in Chinese?', 'Bagaimana menulis 20.508.030 dalam bahasa China?'),
            options: [
              L('两千零五十万八千零三十', '两千零五十万八千零三十'),
              L('两千五十万八千三十', '两千五十万八千三十'),
              L('二百零五万八千零三十', '二百零五万八千零三十'),
              L('两千零五十八万零三十', '两千零五十八万零三十'),
            ],
            answer: 0,
            explain: L(
              'Cut 20,508,030 into 2050 | 8030. 2050 is 两千零五十 and 8030 is 八千零三十, with 万 between them. The other options drop a 零 or move the 万.',
              'Potong 20.508.030 menjadi 2050 | 8030. 2050 adalah 两千零五十 dan 8030 adalah 八千零三十, dengan 万 di antara keduanya. Pilihan lain menghilangkan 零 atau memindahkan 万.',
            ),
            hint: L('Split into groups of four from the right, then read each group.', 'Bagi menjadi kelompok empat dari kanan, lalu baca tiap kelompok.'),
          },
        },
        {
          kind: 'activity',
          title: L('Type the value', 'Ketik nilainya'),
          step: {
            kind: 'math',
            id: 'p5',
            hints: [
              L('一亿 is 100,000,000. 两千万 is 2,000 × 10,000.', '一亿 adalah 100.000.000. 两千万 adalah 2.000 × 10.000.'),
              L('100,000,000 + 20,000,000.', '100.000.000 + 20.000.000.'),
            ],
            explain: L('一亿 is 100,000,000 and 两千万 is 20,000,000, so 一亿两千万 = 120,000,000.', '一亿 adalah 100.000.000 dan 两千万 adalah 20.000.000, jadi 一亿两千万 = 120.000.000.'),
            prompt: L('Write 一亿两千万 as digits.', 'Tulis 一亿两千万 dengan angka.'),
            blanks: [{ answer: 120000000 }],
          },
        },
      ],
    },

    /* -------------------------------------------------------------- summary */
    {
      id: 'summary',
      heading: L('Summary: Chinese numbers at a glance', 'Ringkasan: bilangan China sekilas'),
      blocks: [
        {
          kind: 'text',
          text: L(
            T`- **0 to 10** are 零 一 二 三 四 五 六 七 八 九 十; **11 to 99** are the digits joined with 十 (十一, 二十, 三十五).
- **Hundreds and thousands** use 百 and 千 after the digit; 100 is 一百, never 百.
- **Zero:** say 零 once per gap of zeros, including across 万 and 亿; never for zeros at the end.
- **Two:** 二 as a digit, 两 before 千, 万, 亿 and measure words; 二百 and 两百 are both heard.
- **Groups of four:** 万 is 10,000 and 亿 is 100,000,000, so 100,000 is 十万 and one billion is 十亿.
- **Patterns:** 三分之一 (1/3), 百分之五十 (50%), 第三 (3rd), 负五 (−5); years and phone numbers are digit by digit.
- **Formal numerals** 壹 贰 叁 … are for cheques and contracts; **counting rods** and **Suzhou numerals** are older written systems with zero left empty.`,
            T`- **0 sampai 10** adalah 零 一 二 三 四 五 六 七 八 九 十; **11 sampai 99** adalah angka-angka yang digabung dengan 十 (十一, 二十, 三十五).
- **Ratusan dan ribuan** memakai 百 dan 千 setelah angkanya; 100 adalah 一百, tidak pernah 百.
- **Nol:** ucapkan 零 satu kali per celah berisi nol, termasuk melewati 万 dan 亿; jangan untuk nol di ujung.
- **Dua:** 二 sebagai angka, 两 sebelum 千, 万, 亿, dan kata penggolong; 二百 dan 两百 sama-sama terdengar.
- **Kelompok empat:** 万 adalah 10.000 dan 亿 adalah 100.000.000, jadi 100.000 adalah 十万 dan satu miliar adalah 十亿.
- **Pola:** 三分之一 (1/3), 百分之五十 (50%), 第三 (ke-3), 负五 (−5); tahun dan nomor telepon dibaca angka demi angka.
- **Angka formal** 壹 贰 叁 … untuk cek dan kontrak; **batang hitung** dan **angka Suzhou** adalah sistem tulis lebih tua dengan nol dibiarkan kosong.`,
          ),
        },
      ],
    },
  ],

  glossary: [
    { term: L('Pinyin', 'Pinyin'), definition: L('The standard system for writing the sounds of Mandarin with the Latin alphabet and tone marks, such as sān for 3.', 'Sistem baku untuk menulis bunyi bahasa Mandarin dengan huruf Latin dan tanda nada, seperti sān untuk 3.') },
    { term: L('Tone', 'Nada'), definition: L('The pitch pattern of a Mandarin syllable; there are four tones and a neutral tone, and changing the tone changes the word.', 'Pola tinggi-rendah suara pada suku kata Mandarin; ada empat nada dan satu nada netral, dan mengubah nada mengubah kata.') },
    { term: L('Hanzi (汉字)', 'Hanzi (汉字)'), definition: L('The Chinese characters; each number word is written with one character, such as 三 for 3.', 'Aksara China; setiap kata bilangan ditulis dengan satu aksara, seperti 三 untuk 3.') },
    { term: L('万 (wàn)', '万 (wàn)'), definition: L('The Chinese word for 10,000, the unit that follows 千 and that groups digits in fours.', 'Kata China untuk 10.000, satuan yang mengikuti 千 dan yang mengelompokkan angka empat-empat.') },
    { term: L('亿 (yì)', '亿 (yì)'), definition: L('The Chinese word for 100,000,000, ten thousand times 万.', 'Kata China untuk 100.000.000, sepuluh ribu kali 万.') },
    { term: L('零 (líng)', '零 (líng)'), definition: L('Zero; it is also read once for each gap of zeros between two non-zero digits.', 'Nol; ia juga dibaca satu kali untuk setiap celah berisi nol di antara dua angka bukan nol.') },
    { term: L('两 (liǎng)', '两 (liǎng)'), definition: L('The form of 2 used for quantities and before 千, 万 and 亿 instead of 二.', 'Bentuk 2 yang dipakai untuk jumlah dan sebelum 千, 万, dan 亿 sebagai pengganti 二.') },
    { term: L('Formal numerals (大写)', 'Angka formal (大写)'), definition: L('A second set of characters for numbers, such as 壹 贰 叁, used on cheques and contracts because they are hard to alter.', 'Set aksara kedua untuk bilangan, seperti 壹 贰 叁, dipakai pada cek dan kontrak karena sulit diubah.') },
    { term: L('Counting rods (算筹)', 'Batang hitung (算筹)'), definition: L('Small sticks laid out in columns to calculate, an early decimal place-value system in which zero is an empty place.', 'Batang kecil yang disusun dalam kolom untuk berhitung, sistem nilai tempat desimal awal tempat nol adalah tempat yang kosong.') },
    { term: L('Suzhou numerals', 'Angka Suzhou'), definition: L('A written shorthand derived from counting rods, used by traders, with 〡 to 〩 for 1 to 9 and 〇 for 0.', 'Tulisan singkat turunan batang hitung, dipakai para pedagang, dengan 〡 sampai 〩 untuk 1 sampai 9 dan 〇 untuk 0.') },
    { term: L('Myriad', 'Myriad'), definition: L('An older English word for 10,000, the same unit as 万.', 'Kata bahasa Inggris yang lebih tua untuk 10.000, satuan yang sama dengan 万.') },
    { term: L('Place value', 'Nilai tempat'), definition: L('The principle that a digit is worth more or less depending on where it stands in the number.', 'Prinsip bahwa sebuah angka bernilai lebih besar atau lebih kecil bergantung pada letaknya dalam bilangan.') },
  ],

  howTo: [
    {
      name: L('How to count to 99 in Chinese', 'Cara menghitung sampai 99 dalam bahasa China'),
      description: L('Build every number from 11 to 99 from the ten digit words and 十.', 'Susun setiap bilangan dari 11 sampai 99 dari sepuluh kata angka dan 十.'),
      steps: [
        { name: L('Learn the digit words', 'Pelajari kata-kata angka'), text: L('Learn 零 líng, 一 yī, 二 èr, 三 sān, 四 sì, 五 wǔ, 六 liù, 七 qī, 八 bā, 九 jiǔ and 十 shí.', 'Pelajari 零 líng, 一 yī, 二 èr, 三 sān, 四 sì, 五 wǔ, 六 liù, 七 qī, 八 bā, 九 jiǔ, dan 十 shí.') },
        { name: L('Say 11 to 19 with 十 first', 'Ucapkan 11 sampai 19 dengan 十 lebih dulu'), text: L('Say 十 and then the ones digit: 十一 is 11 and 十九 is 19.', 'Ucapkan 十 lalu angka satuan: 十一 adalah 11 dan 十九 adalah 19.') },
        { name: L('Say 20 to 99 as tens, 十, ones', 'Ucapkan 20 sampai 99 sebagai puluhan, 十, satuan'), text: L('Say the tens digit, then 十, then the ones digit, leaving it out when it is 0: 二十 is 20 and 三十五 is 35.', 'Ucapkan angka puluhan, lalu 十, lalu angka satuan, dan hilangkan bila 0: 二十 adalah 20 dan 三十五 adalah 35.') },
      ],
    },
    {
      name: L('How to write any number in Chinese', 'Cara menulis bilangan apa pun dalam bahasa China'),
      description: L('Group the digits in fours, read each group, add 万 and 亿, and place 零 for gaps.', 'Kelompokkan angka empat-empat, baca tiap kelompok, tambahkan 万 dan 亿, dan taruh 零 untuk celah.'),
      steps: [
        { name: L('Cut into groups of four', 'Potong menjadi kelompok empat'), text: L('Write the digits and cut them into groups of four from the right, for example 2050 | 8030.', 'Tulis angkanya dan potong menjadi kelompok empat dari kanan, misalnya 2050 | 8030.') },
        { name: L('Read each group', 'Baca tiap kelompok'), text: L('Read each group as a number up to 9999 with 千, 百 and 十.', 'Baca tiap kelompok sebagai bilangan sampai 9999 dengan 千, 百, dan 十.') },
        { name: L('Add 万 and 亿', 'Tambahkan 万 dan 亿'), text: L('Put 万 after the second group from the right and 亿 after the third.', 'Taruh 万 setelah kelompok kedua dari kanan dan 亿 setelah kelompok ketiga.') },
        { name: L('Place 零 for gaps', 'Taruh 零 untuk celah'), text: L('Say 零 once for each gap of zeros, including between groups, and never for zeros at the end.', 'Ucapkan 零 satu kali untuk setiap celah berisi nol, termasuk di antara kelompok, dan jangan untuk nol di ujung.') },
        { name: L('Check the special cases', 'Periksa kasus khusus'), text: L('Use 两 for a lone 2 before 千, 万 or 亿, and drop 一 only before a leading 十.', 'Pakai 两 untuk angka 2 yang berdiri sendiri sebelum 千, 万, atau 亿, dan hilangkan 一 hanya sebelum 十 di awal.') },
      ],
    },
    {
      name: L('How to read a large Chinese number as digits', 'Cara membaca bilangan China yang besar menjadi angka'),
      description: L('Cut the number at 亿 and 万, read each part, and write each part with four digits.', 'Potong bilangan di 亿 dan 万, baca tiap bagian, dan tulis tiap bagian dengan empat angka.'),
      steps: [
        { name: L('Cut at 亿 and 万', 'Potong di 亿 dan 万'), text: L('Find 亿 and 万 and cut the number after each of them.', 'Cari 亿 dan 万 dan potong bilangan itu setelah masing-masing.') },
        { name: L('Read each part', 'Baca tiap bagian'), text: L('Read each part on its own: 千 is thousands, 百 hundreds, 十 tens, and the rest is ones.', 'Baca tiap bagian sendiri-sendiri: 千 adalah ribuan, 百 ratusan, 十 puluhan, dan sisanya satuan.') },
        { name: L('Write four digits per part', 'Tulis empat angka per bagian'), text: L('Write every part except the first with four digits, adding zeros in front where 零 shows an empty place.', 'Tulis setiap bagian kecuali yang pertama dengan empat angka, menambah nol di depan bila 零 menunjukkan tempat kosong.') },
        { name: L('Join the parts', 'Gabungkan bagian-bagiannya'), text: L('Join the parts: 两千零五十万八千零三十 is 2050 | 8030, which is 20,508,030.', 'Gabungkan bagian-bagiannya: 两千零五十万八千零三十 adalah 2050 | 8030, yaitu 20.508.030.') },
      ],
    },
  ],

  faq: [
    {
      q: L('How do you count from 1 to 10 in Chinese?', 'Bagaimana menghitung dari 1 sampai 10 dalam bahasa China?'),
      a: L(
        'In Mandarin the numbers 1 to 10 are 一 yī, 二 èr, 三 sān, 四 sì, 五 wǔ, 六 liù, 七 qī, 八 bā, 九 jiǔ and 十 shí. Zero is 零 líng. Each number is one character, and the tone marks in pinyin show how it is pronounced.',
        'Dalam bahasa Mandarin, bilangan 1 sampai 10 adalah 一 yī, 二 èr, 三 sān, 四 sì, 五 wǔ, 六 liù, 七 qī, 八 bā, 九 jiǔ, dan 十 shí. Nol adalah 零 líng. Setiap bilangan satu aksara, dan tanda nada pada pinyin menunjukkan cara pengucapannya.',
      ),
    },
    {
      q: L('How do you say 100 in Chinese?', 'Bagaimana mengucapkan 100 dalam bahasa China?'),
      a: L(
        'One hundred is 一百, pronounced yī bǎi. The 一 cannot be left out before 百, so 百 alone is not 100. Compare 10, which is just 十, and 101, which is 一百零一 with a 零 for the empty tens place.',
        'Seratus adalah 一百, dibaca yī bǎi. Aksara 一 tidak boleh dihilangkan sebelum 百, jadi 百 saja bukan 100. Bandingkan dengan 10 yang cukup 十, dan 101 yang adalah 一百零一 dengan 零 untuk tempat puluhan yang kosong.',
      ),
    },
    {
      q: L('How do you say 10,000 in Chinese?', 'Bagaimana mengucapkan 10.000 dalam bahasa China?'),
      a: L(
        'Ten thousand is 一万, pronounced yī wàn. Chinese has its own word, 万, for 10,000, so there is no "ten thousand" built from 十 and 千. One hundred thousand is 十万 and one million is 一百万.',
        'Sepuluh ribu adalah 一万, dibaca yī wàn. Bahasa China punya kata sendiri, 万, untuk 10.000, sehingga tidak ada "sepuluh ribu" yang disusun dari 十 dan 千. Seratus ribu adalah 十万 dan satu juta adalah 一百万.',
      ),
    },
    {
      q: L('Why does Chinese use 万 and 亿 instead of thousand and million?', 'Mengapa bahasa China memakai 万 dan 亿, bukan ribu dan juta?'),
      a: L(
        'Chinese groups digits in fours: 万 is 10,000 and 亿 is 100,000,000, each four digits above the last. English and Indonesian group digits in threes with thousand, million and billion. Neither grouping is more correct; they are different conventions for naming large numbers.',
        'Bahasa China mengelompokkan angka empat-empat: 万 adalah 10.000 dan 亿 adalah 100.000.000, masing-masing empat angka di atas sebelumnya. Bahasa Inggris dan Indonesia mengelompokkan angka tiga-tiga dengan ribu, juta, dan miliar. Tidak ada pengelompokan yang lebih benar; keduanya hanyalah konvensi berbeda untuk menamai bilangan besar.',
      ),
    },
    {
      q: L('What is the difference between 二 and 两?', 'Apa beda 二 dan 两?'),
      a: L(
        'Both mean 2. Use 二 (èr) for the digit itself, in 二十, 十二 and ordinals like 第二. Use 两 (liǎng) for a quantity, before measure words as in 两个人, and before 千, 万 and 亿 as in 两千 and 两万. Before 百 both 二百 and 两百 are heard.',
        'Keduanya berarti 2. Pakai 二 (èr) untuk angka itu sendiri, dalam 二十, 十二, dan bilangan urutan seperti 第二. Pakai 两 (liǎng) untuk jumlah, sebelum kata penggolong seperti 两个人, dan sebelum 千, 万, dan 亿 seperti 两千 dan 两万. Sebelum 百 keduanya terdengar: 二百 dan 两百.',
      ),
    },
    {
      q: L('How do you say zero in Chinese?', 'Bagaimana mengucapkan nol dalam bahasa China?'),
      a: L(
        'Zero is 零, pronounced líng. In years and dates it is often written 〇, a circle, with the same sound. Inside a number, 零 is also said once for a gap of zeros, as in 一百零五 for 105.',
        'Nol adalah 零, dibaca líng. Dalam tahun dan tanggal sering ditulis 〇, sebuah lingkaran, dengan bunyi yang sama. Di dalam sebuah bilangan, 零 juga diucapkan satu kali untuk celah berisi nol, seperti 一百零五 untuk 105.',
      ),
    },
    {
      q: L('How do you say 2025 in Chinese?', 'Bagaimana mengucapkan 2025 dalam bahasa China?'),
      a: L(
        'As a year, 2025 is read digit by digit: 二〇二五年, èr líng èr wǔ nián. As a quantity, such as 2,025 people, it is 两千零二十五, liǎng qiān líng èr shí wǔ. The year is a label, so it is not read as one number.',
        'Sebagai tahun, 2025 dibaca angka demi angka: 二〇二五年, èr líng èr wǔ nián. Sebagai jumlah, misalnya 2.025 orang, bunyinya 两千零二十五, liǎng qiān líng èr shí wǔ. Tahun adalah label, jadi tidak dibaca sebagai satu bilangan.',
      ),
    },
    {
      q: L('How do you say one million and one billion in Chinese?', 'Bagaimana mengucapkan satu juta dan satu miliar dalam bahasa China?'),
      a: L(
        'One million is 一百万, yī bǎi wàn, literally "one hundred wàn". One billion is 十亿, shí yì, literally "ten yì". One trillion is 一万亿, yī wàn yì. Count the digits in fours from the right to find the unit.',
        'Satu juta adalah 一百万, yī bǎi wàn, secara harfiah "seratus wàn". Satu miliar adalah 十亿, shí yì, secara harfiah "sepuluh yì". Satu triliun adalah 一万亿, yī wàn yì. Hitung angka empat-empat dari kanan untuk menemukan satuannya.',
      ),
    },
    {
      q: L('Are Chinese numbers easier to learn than English numbers?', 'Apakah bilangan China lebih mudah dipelajari daripada bilangan Inggris?'),
      a: L(
        'Above ten they are more regular, since 12 is ten-two and 21 is two-ten-one, with no words like eleven or twenty. A 1995 study by Miller and colleagues found Chinese-speaking children counted further than American peers. Large numbers with 万 and 亿 need practice, though.',
        'Di atas sepuluh, bilangan China lebih teratur, karena 12 adalah sepuluh-dua dan 21 adalah dua-sepuluh-satu, tanpa kata seperti eleven atau twenty. Studi tahun 1995 oleh Miller dan kawan-kawan menemukan anak-anak berbahasa China berhitung lebih jauh daripada teman sebaya Amerika. Bilangan besar dengan 万 dan 亿 tetap perlu latihan.',
      ),
    },
    {
      q: L('What are the formal Chinese numerals?', 'Apa itu angka formal China?'),
      a: L(
        'Formal numerals are a second set of characters used on cheques and contracts: 壹 贰 叁 肆 伍 陆 柒 捌 玖 拾 for 1 to 10, with 佰 for 100 and 仟 for 1,000. They are hard to alter, unlike 一 二 三, which can be changed with a stroke.',
        'Angka formal adalah set aksara kedua yang dipakai pada cek dan kontrak: 壹 贰 叁 肆 伍 陆 柒 捌 玖 拾 untuk 1 sampai 10, dengan 佰 untuk 100 dan 仟 untuk 1.000. Angka ini sulit diubah, berbeda dari 一 二 三 yang dapat diubah dengan satu goresan.',
      ),
    },
    {
      q: L('How do you say a phone number in Chinese?', 'Bagaimana mengucapkan nomor telepon dalam bahasa China?'),
      a: L(
        'A phone number is read digit by digit, and the digit 1 is said yāo (幺) instead of yī so it is not confused with 7, qī. The police number 110 is therefore yāo yāo líng.',
        'Nomor telepon dibaca angka demi angka, dan angka 1 diucapkan yāo (幺) dan bukan yī agar tidak tertukar dengan 7, qī. Nomor polisi 110 karena itu dibaca yāo yāo líng.',
      ),
    },
    {
      q: L('Which numbers are lucky in Chinese culture?', 'Bilangan apa yang beruntung dalam budaya China?'),
      a: L(
        'Eight is the luckiest because bā sounds like fā, "to get rich". Six sounds like "smooth" and nine like "long-lasting". Four is unlucky because sì sounds like sǐ, "death", so some buildings skip the fourth floor. The luck comes from the sound of the word.',
        'Delapan paling beruntung karena bā berbunyi mirip fā, "menjadi kaya". Enam berbunyi mirip "lancar" dan sembilan mirip "awet". Empat tidak beruntung karena sì berbunyi mirip sǐ, "mati", sehingga sebagian gedung melewatkan lantai empat. Keberuntungannya berasal dari bunyi katanya.',
      ),
    },
    {
      q: L('Do all Chinese languages use the same numbers?', 'Apakah semua bahasa China memakai bilangan yang sama?'),
      a: L(
        'The written characters are the same, but the pronunciation differs by language. Cantonese says 一 as yāt and 三 as sāam, and often uses 廿 for 20 where Mandarin says 二十. This article teaches Mandarin, the standard language of mainland China, Taiwan and Singapore.',
        'Aksaranya sama, tetapi pengucapannya berbeda menurut bahasanya. Bahasa Kanton mengucapkan 一 sebagai yāt dan 三 sebagai sāam, dan sering memakai 廿 untuk 20 tempat bahasa Mandarin mengucapkan 二十. Artikel ini mengajarkan bahasa Mandarin, bahasa baku di daratan China, Taiwan, dan Singapura.',
      ),
    },
  ],

  references: [
    { title: 'The Universal History of Numbers: From Prehistory to the Invention of the Computer', author: 'Georges Ifrah', year: 2000, source: 'John Wiley & Sons' },
    { title: 'Science and Civilisation in China, Volume 3: Mathematics and the Sciences of the Heavens and the Earth', author: 'Joseph Needham', year: 1959, source: 'Cambridge University Press' },
    { title: 'Fleeting Footsteps: Tracing the Conception of Arithmetic and Algebra in Ancient China', author: 'Lam Lay Yong and Ang Tian Se', year: 1992, source: 'World Scientific' },
    { title: 'A History of Chinese Mathematics', author: 'Jean-Claude Martzloff', year: 1997, source: 'Springer' },
    { title: 'GB/T 15835-2011 出版物上数字用法 (Rules for the use of numerals in publications)', author: 'Standardization Administration of China', year: 2011 },
    { title: 'Preschool origins of cross-national differences in mathematical competence: The role of number-naming systems', author: 'Kevin F. Miller, Catherine M. Smith, Jianjun Zhu and Houcan Zhang', year: 1995, source: 'Psychological Science 6(1), 56–60' },
    { title: 'Shùshū Jiǔzhāng (Mathematical Treatise in Nine Sections)', author: 'Qin Jiushao', year: 1247 },
  ],

  related: ['real-numbers', 'exponents-and-radicals'],
}
