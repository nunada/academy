import type { Lesson } from '../types'
import { L, barChart } from './figs'

/** Module 4 — sequences applied to growth, decay, simple and compound
 *  interest (the framework names these applications). */

const bars = (values: number[], max: number, step: number, showValues = true) =>
  barChart({
    bars: values.map((v, i) => ({ label: String(i), value: v, color: (['a', 'b', 'c', 'result'] as const)[i % 4] })),
    max,
    step,
    showValues,
    title: 'Rp×1000',
  })

export const lessonGrowth: Lesson = {
  id: 'tka-sma-m4-s2-l3',
  title: L('Growth, Decay and Interest', 'Pertumbuhan, Peluruhan, dan Bunga'),
  goal: L(
    'You can model simple interest with an arithmetic sequence, and compound interest, growth and decay with a geometric sequence.',
    'Kamu bisa memodelkan bunga tunggal dengan barisan aritmetika, dan bunga majemuk, pertumbuhan, dan peluruhan dengan barisan geometri.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: Adding the Same Amount Each Year', 'Ayo Amati: Menambah Jumlah yang Sama Tiap Tahun'),
      body: L(
        'With **simple interest** the interest is always figured on the **starting** amount $P$. Every year the same amount $Pr$ is added, so the balances form an **arithmetic sequence**.\n\nRp1,000,000 at 10% simple interest a year: the interest is Rp100,000 every year.\n\n$$1\\,000,\\ 1\\,100,\\ 1\\,200,\\ 1\\,300,\\ \\ldots\\ \\text{(thousand rupiah)}$$\n\nAfter $n$ years: $A_n=P+n\\cdot Pr=P(1+nr)$. After 3 years: $1\\,000\\,000\\times(1+3\\times0.1)=1\\,300\\,000$.\n\nThe bars rise by the same height each year.',
        'Pada **bunga tunggal**, bunga selalu dihitung dari jumlah **awal** $P$. Setiap tahun jumlah yang sama $Pr$ ditambahkan, sehingga saldonya membentuk **barisan aritmetika**.\n\nRp1.000.000 dengan bunga tunggal 10% per tahun: bunganya Rp100.000 setiap tahun.\n\n$$1\\,000,\\ 1\\,100,\\ 1\\,200,\\ 1\\,300,\\ \\ldots\\ \\text{(ribu rupiah)}$$\n\nSetelah $n$ tahun: $A_n=P+n\\cdot Pr=P(1+nr)$. Setelah 3 tahun: $1\\,000\\,000\\times(1+3\\times0{,}1)=1\\,300\\,000$.\n\nBatang-batangnya naik setinggi yang sama tiap tahun.',
      ),
      figure: {
        ...bars([1000, 1100, 1200, 1300], 1500, 500),
        caption: L('Simple interest: the balance grows by the same amount each year.', 'Bunga tunggal: saldo bertambah dengan jumlah yang sama tiap tahun.'),
      },
    },
    {
      kind: 'concept',
      id: 'c2',
      title: L('Step by Step: Multiplying by the Same Factor', 'Contoh Bertahap: Mengalikan dengan Faktor yang Sama'),
      body: L(
        'With **compound interest** each year the interest is added to the balance, so the balances form a **geometric sequence** with ratio $1+r$.\n\nRp1,000,000 at 10% compound interest:\n\n1. Step 1: Year 1: $1\\,000\\times1.1=1\\,100$.\n2. Step 2: Year 2: $1\\,100\\times1.1=1\\,210$.\n3. Step 3: Year 3: $1\\,210\\times1.1=1\\,331$.\n\n$$A_n=P(1+r)^n$$\n\nThe same idea covers **growth** (a population rising 20% a year has ratio $1.2$) and **decay** (a machine losing 20% of its value a year, **depreciation**, has ratio $0.8$).\n\n| Situation | Ratio |\n|---|---|\n| rises by 20% | $1.2$ |\n| falls by 20% | $0.8$ |\n| doubles | $2$ |\n| halves | $0.5$ |',
        'Pada **bunga majemuk**, tiap tahun bunga ditambahkan ke saldo, sehingga saldonya membentuk **barisan geometri** dengan rasio $1+r$.\n\nRp1.000.000 dengan bunga majemuk 10%:\n\n1. Langkah 1: Tahun 1: $1\\,000\\times1{,}1=1\\,100$.\n2. Langkah 2: Tahun 2: $1\\,100\\times1{,}1=1\\,210$.\n3. Langkah 3: Tahun 3: $1\\,210\\times1{,}1=1\\,331$.\n\n$$A_n=P(1+r)^n$$\n\nGagasan yang sama mencakup **pertumbuhan** (populasi yang naik 20% per tahun punya rasio $1{,}2$) dan **peluruhan** (mesin yang kehilangan 20% nilainya per tahun, **penyusutan**, punya rasio $0{,}8$).\n\n| Situasi | Rasio |\n|---|---|\n| naik 20% | $1{,}2$ |\n| turun 20% | $0{,}8$ |\n| berlipat dua | $2$ |\n| menjadi setengah | $0{,}5$ |',
      ),
      figure: {
        ...bars([1000, 1100, 1210, 1331], 1500, 500),
        caption: L('Compound interest: each bar is 1.1 times the one before.', 'Bunga majemuk: tiap batang 1,1 kali batang sebelumnya.'),
      },
    },
    {
      kind: 'concept',
      id: 'c3',
      title: L('Step by Step: Depreciation and "When Does It Reach?"', 'Contoh Bertahap: Penyusutan dan "Kapan Mencapai?"'),
      body: L(
        'A machine costs Rp125 million and loses 20% of its value each year. Its value after 3 years:\n\n1. Step 1: Ratio $0.8$.\n2. Step 2: $125\\times0.8^3=125\\times0.512=64$ million.\n\n**How long until it reaches a target?** Start at Rp1,000,000 at 10% compound interest. When does the balance pass 1,500,000?\n\n1. Step 1: We need $1.1^n\\ge1.5$.\n2. Step 2: Try values: $1.1^4=1.46$, $1.1^5=1.61$.\n3. Step 3: The smallest whole number of years is $n=5$.\n\n**Watch out:** a negative rate is a decay (ratio below 1). And percent changes **multiply**; they are not added: two years of 10% growth is $\\times1.21$, not $\\times1.2$.',
        'Sebuah mesin berharga Rp125 juta dan kehilangan 20% nilainya tiap tahun. Nilainya setelah 3 tahun:\n\n1. Langkah 1: Rasio $0{,}8$.\n2. Langkah 2: $125\\times0{,}8^3=125\\times0{,}512=64$ juta.\n\n**Berapa lama sampai mencapai target?** Mulai dari Rp1.000.000 dengan bunga majemuk 10%. Kapan saldo melewati 1.500.000?\n\n1. Langkah 1: Kita perlu $1{,}1^n\\ge1{,}5$.\n2. Langkah 2: Coba nilai: $1{,}1^4=1{,}46$, $1{,}1^5=1{,}61$.\n3. Langkah 3: Banyak tahun bulat terkecil adalah $n=5$.\n\n**Awas:** laju negatif adalah peluruhan (rasio di bawah 1). Dan perubahan persen **dikalikan**, bukan dijumlahkan: dua tahun pertumbuhan 10% adalah $\\times1{,}21$, bukan $\\times1{,}2$.',
      ),
    },
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L(
        'The bars show a balance over 4 years: 1 000, 1 100, 1 210 and 1 331. Which description fits?',
        'Batang-batang menunjukkan saldo selama 4 tahun: 1.000, 1.100, 1.210, dan 1.331. Uraian manakah yang cocok?',
      ),
      figure: {
        ...bars([1000, 1100, 1210, 1331], 1500, 500, false),
        caption: L('A balance over 4 years.', 'Saldo selama 4 tahun.'),
      },
      options: [
        L('A geometric sequence with ratio 1.1', 'Barisan geometri dengan rasio 1,1'),
        L('An arithmetic sequence with difference 100', 'Barisan aritmetika dengan beda 100'),
        L('An arithmetic sequence with difference 110', 'Barisan aritmetika dengan beda 110'),
        L('A geometric sequence with ratio 1.21', 'Barisan geometri dengan rasio 1,21'),
      ],
      answer: 0,
      explain: L(
        'The differences are 100, 110, 121 (not constant), but the ratios are $\\frac{1100}{1000}=\\frac{1210}{1100}=\\frac{1331}{1210}=1.1$. So the balance grows geometrically: compound interest of 10%.',
        'Bedanya 100, 110, 121 (tidak tetap), tetapi rasionya $\\frac{1100}{1000}=\\frac{1210}{1100}=\\frac{1331}{1210}=1{,}1$. Jadi saldo tumbuh secara geometri: bunga majemuk 10%.',
      ),
      hint: L(
        'Subtract neighboring bars, then divide them. Which result stays the same?',
        'Kurangkan batang yang bersebelahan, lalu bagi. Hasil mana yang tetap sama?',
      ),
    },
    {
      kind: 'fill',
      id: 'f1',
      math: true,
      prompt: L(
        'Try it together: Rp2,000,000 at 5% simple interest. Find the interest per year and the balance after 3 years.',
        'Coba bersama: Rp2.000.000 dengan bunga tunggal 5%. Cari bunga per tahun dan saldo setelah 3 tahun.',
      ),
      template: '2\\,000\\,000+3\\times___=___',
      blanks: ['100000', '2300000'],
      explain: L(
        '5% of 2 000 000 is 100 000 each year, so after 3 years $2\\,000\\,000+3\\times100\\,000=2\\,300\\,000$.',
        '5% dari 2.000.000 adalah 100.000 tiap tahun, jadi setelah 3 tahun $2\\,000\\,000+3\\times100\\,000=2\\,300\\,000$.',
      ),
      hint: L(
        'Simple interest adds 5% of the **starting** amount every year.',
        'Bunga tunggal menambahkan 5% dari jumlah **awal** setiap tahun.',
      ),
    },
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
      options: [
        L('Balances under simple interest form an arithmetic sequence.', 'Saldo pada bunga tunggal membentuk barisan aritmetika.'),
        L('Balances under compound interest form a geometric sequence.', 'Saldo pada bunga majemuk membentuk barisan geometri.'),
        L('A loss of 20% a year has the ratio 1.2.', 'Kehilangan 20% per tahun punya rasio 1,2.'),
        L('After 1 year simple and compound interest differ.', 'Setelah 1 tahun bunga tunggal dan majemuk berbeda.'),
      ],
      answer: [0, 1],
      explain: L(
        'A loss of 20% leaves 80%, so the ratio is 0.8. After exactly one year the two kinds of interest give the same amount.',
        'Kehilangan 20% menyisakan 80%, jadi rasionya 0,8. Setelah tepat satu tahun kedua jenis bunga memberi jumlah yang sama.',
      ),
      hint: L(
        'For the third statement: what fraction of the value is left after losing 20%?',
        'Untuk pernyataan ketiga: berapa bagian nilai yang tersisa setelah kehilangan 20%?',
      ),
    },
    {
      kind: 'judge',
      id: 'j1',
      prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
      statements: [
        L('A depreciation of 20% a year multiplies the value by 0.8 each year.', 'Penyusutan 20% per tahun mengalikan nilai dengan 0,8 tiap tahun.'),
        L('Simple and compound interest give the same amount after 2 years.', 'Bunga tunggal dan majemuk memberi jumlah yang sama setelah 2 tahun.'),
        L('A quantity that doubles every year goes 5, 10, 20, 40, so it is 40 after 3 years from 5.', 'Besaran yang berlipat dua tiap tahun berjalan 5, 10, 20, 40, jadi 40 setelah 3 tahun dari 5.'),
        L('After $n$ years of simple interest the balance is $P(1+r)^n$.', 'Setelah $n$ tahun bunga tunggal saldonya $P(1+r)^n$.'),
      ],
      answer: [true, false, true, false],
      explain: L(
        'From the second year on, compound interest earns interest on the interest, so it is larger. The formula $P(1+r)^n$ belongs to compound interest; for simple interest it is $P(1+nr)$.',
        'Mulai tahun kedua, bunga majemuk berbunga atas bunga, sehingga lebih besar. Rumus $P(1+r)^n$ milik bunga majemuk; untuk bunga tunggal rumusnya $P(1+nr)$.',
      ),
      hint: L(
        'Compare the two formulas for $n=2$.',
        'Bandingkan kedua rumus untuk $n=2$.',
      ),
    },
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        'A machine costs Rp125 million and loses 20% of its value each year. How many million rupiah is it worth after 3 years?',
        'Sebuah mesin berharga Rp125 juta dan kehilangan 20% nilainya tiap tahun. Berapa juta rupiah nilainya setelah 3 tahun?',
      ),
      blanks: [{ answer: 64, after: { en: '\\text{ million}', id: '\\text{ juta}' } }],
      hints: [
        L('Each year the value is multiplied by the same ratio. What is it for a 20% loss?', 'Tiap tahun nilai dikalikan rasio yang sama. Berapa untuk kehilangan 20%?'),
        L('The ratio is $0.8$, and 3 years means $0.8^3$.', 'Rasionya $0{,}8$, dan 3 tahun berarti $0{,}8^3$.'),
        L('$0.8^3=0.512$. Multiply by 125.', '$0{,}8^3=0{,}512$. Kalikan dengan 125.'),
      ],
      explain: L(
        '$125\\times0.512=64$ million rupiah.',
        '$125\\times0{,}512=64$ juta rupiah.',
      ),
      solution: {
        en: ['125\\times0.8^3=125\\times0.512', '=64'],
        id: ['125\\times0{,}8^3=125\\times0{,}512', '=64'],
      },
    },
  ],
}
