import type { FigItem } from '../../lib/figure'
import type { Submodule } from '../types'
import { L, fit, rectPts, shape, solid, txt } from './figs'
import type { Pt } from './figs'

/** Module 10, submodule 1 — a method for any problem: four steps, a handful
 *  of strategies, and reasoning with mixed topics. */

/** Four boxes joined by arrows, with the undoing arrows underneath. */
function chain() {
  const labels = ['x', '×3', '−4', '20']
  const colors = ['a', 'b', 'c', 'result'] as const
  const items: FigItem[] = []
  labels.forEach((t, i) => {
    items.push(solid(rectPts(i * 4, 0, 2.4, 1.4), colors[i]))
    items.push(txt(i * 4 + 1.2, 0.7, t, 'lg', 'muted'))
  })
  for (let i = 0; i < 3; i++) {
    items.push({ t: 'vec', from: [i * 4 + 2.5, 0.7], to: [(i + 1) * 4 - 0.1, 0.7], color: 'a' })
  }
  const back: [number, string][] = [[2, '+4'], [1, '÷3']]
  back.forEach(([i, t]) => {
    items.push({ t: 'vec', from: [(i + 1) * 4 - 0.1, -0.7], to: [i * 4 + 2.5, -0.7], color: 'result' })
    items.push(txt(i * 4 + 3.25, -1.3, t, 'md', 'result'))
  })
  const corners: Pt[] = [[-0.5, -1.9], [12.9, 2.2]]
  return { dim: 2 as const, axes: false as const, ...fit(corners, 0.3), items }
}

/** Triangular arrangements of dots: row k holds k dots. */
function dotRows(rows: number) {
  const items: FigItem[] = []
  const all: Pt[] = []
  for (let k = 1; k <= rows; k++) {
    for (let j = 0; j < k; j++) {
      const p: Pt = [j - (k - 1) / 2, -(k - 1) * 0.9]
      all.push(p)
      items.push({ t: 'dot', x: p[0], y: p[1], color: (['a', 'b', 'c', 'result'] as const)[(k - 1) % 4] })
    }
  }
  return { dim: 2 as const, axes: false as const, ...fit(all, 0.8), items }
}

export const m10s1: Submodule = {
  id: 'tka-sma-m10-s1',
  title: L('Problem-Solving Strategies', 'Strategi Memecahkan Soal'),
  summary: L(
    'A four-step method for word problems, the strategies of working backward and writing equations, and reasoning with mixed-topic and pattern questions.',
    'Metode empat langkah untuk soal cerita, strategi bekerja mundur dan menulis persamaan, serta bernalar dalam soal campuran dan pola.',
  ),
  lessons: [
    /* ---------------------------------------------------- L1 four steps */
    {
      id: 'tka-sma-m10-s1-l1',
      title: L('Four Steps for Word Problems', 'Empat Langkah Memecahkan Soal Cerita'),
      goal: L(
        'You can read, plan, solve and check a word problem, using an equation, a diagram or working backward.',
        'Kamu bisa membaca, merencanakan, menyelesaikan, dan memeriksa soal cerita, memakai persamaan, gambar, atau bekerja mundur.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Four Steps', 'Ayo Amati: Empat Langkah'),
          body: L(
            'Every problem in the TKA, from any chapter, can be met with the same four steps:\n\n1. **Read.** Say in your own words what is given and what is asked. Underline the question.\n2. **Plan.** Choose a tool: a diagram, a table, an equation, a formula, or working backward.\n3. **Solve.** Do the calculation neatly, one line at a time.\n4. **Check.** Does the answer make sense? Are the units right? Did you answer the question that was asked?\n\n**Example.** The length of a rectangle is 3 more than its width. Its perimeter is 26. Find the width.\n\n1. Read: the unknown is the width $w$; the length is $w+3$.\n2. Plan: perimeter $=2\\times(\\text{length}+\\text{width})$.\n3. Solve: $2(w+3+w)=26$, so $2w+3=13$ and $w=5$.\n4. Check: length 8, perimeter $2(8+5)=26$ ✓.',
            'Setiap soal TKA, dari bab mana pun, dapat dihadapi dengan empat langkah yang sama:\n\n1. **Baca.** Katakan dengan kata-katamu sendiri apa yang diketahui dan apa yang ditanyakan. Garis bawahi pertanyaannya.\n2. **Rencanakan.** Pilih alat: gambar, tabel, persamaan, rumus, atau bekerja mundur.\n3. **Selesaikan.** Hitung dengan rapi, satu baris demi satu baris.\n4. **Periksa.** Apakah jawaban masuk akal? Apakah satuannya benar? Apakah kamu menjawab pertanyaan yang diajukan?\n\n**Contoh.** Panjang sebuah persegi panjang 3 lebih dari lebarnya. Kelilingnya 26. Tentukan lebarnya.\n\n1. Baca: yang dicari adalah lebar $w$; panjangnya $w+3$.\n2. Rencana: keliling $=2\\times(\\text{panjang}+\\text{lebar})$.\n3. Selesaikan: $2(w+3+w)=26$, jadi $2w+3=13$ dan $w=5$.\n4. Periksa: panjang 8, keliling $2(8+5)=26$ ✓.',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [8, 0], [8, 5], [0, 5]],
              rights: [0, 1, 2, 3],
              sides: ['w+3', undefined, undefined, 'w'],
            }),
            caption: L('A diagram of the rectangle: length w + 3, width w.', 'Gambar persegi panjang: panjang w + 3, lebar w.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Working Backward', 'Contoh Bertahap: Bekerja Mundur'),
          body: L(
            'When the **end result** is known and the starting number is asked, undo the steps in the opposite order.\n\nI think of a number, multiply it by 3, subtract 4, and get 20. What was the number?\n\n1. Step 1: Draw the chain forward: $x\\to\\times3\\to-4\\to20$.\n2. Step 2: Go back from 20 and **undo the last step first**: undo $-4$ with $+4$: $20+4=24$.\n3. Step 3: Undo $\\times3$ with $\\div3$: $24\\div3=8$.\n4. Step 4: Check forward: $8\\times3=24$, $24-4=20$ ✓.\n\nThe red arrows in the picture show the way back. Every operation is undone by its opposite: $+$ by $-$, $\\times$ by $\\div$, square by square root.',
            'Bila **hasil akhir** diketahui dan bilangan awal yang ditanyakan, batalkan langkah-langkahnya dengan urutan sebaliknya.\n\nAku memikirkan sebuah bilangan, mengalikannya dengan 3, mengurangi 4, dan mendapat 20. Berapa bilangan itu?\n\n1. Langkah 1: Gambar rantai maju: $x\\to\\times3\\to-4\\to20$.\n2. Langkah 2: Mundur dari 20 dan **batalkan langkah terakhir lebih dulu**: batalkan $-4$ dengan $+4$: $20+4=24$.\n3. Langkah 3: Batalkan $\\times3$ dengan $\\div3$: $24\\div3=8$.\n4. Langkah 4: Periksa maju: $8\\times3=24$, $24-4=20$ ✓.\n\nPanah merah pada gambar menunjukkan jalan mundur. Setiap operasi dibatalkan oleh kebalikannya: $+$ oleh $-$, $\\times$ oleh $\\div$, kuadrat oleh akar kuadrat.',
          ),
          figure: {
            ...chain(),
            caption: L('The forward chain, and the red arrows that undo it.', 'Rantai maju, dan panah merah yang membatalkannya.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Letting Letters Stand for the Unknowns', 'Contoh Bertahap: Memisalkan Hal yang Dicari dengan Huruf'),
          body: L(
            'When two things are unknown, give each a letter and write **one equation for each fact**.\n\nA purse holds 35 coins. Some are worth 5 and the others are worth 10. The total value is 250. How many coins are worth 10?\n\n1. Step 1: Let $x$ be the number of 5-coins and $y$ the number of 10-coins.\n2. Step 2: The facts: $x+y=35$ and $5x+10y=250$.\n3. Step 3: From the first, $x=35-y$. Put it in the second: $5(35-y)+10y=250$, so $175+5y=250$ and $y=15$.\n4. Step 4: Then $x=20$. Check: $20\\times5+15\\times10=100+150=250$ ✓.\n\nThe answer to the question is $y=15$ (the 10-coins), not $x$.',
            'Bila dua hal tidak diketahui, beri tiap hal sebuah huruf dan tulis **satu persamaan untuk tiap fakta**.\n\nSebuah dompet berisi 35 koin. Sebagian bernilai 5 dan sisanya bernilai 10. Nilai totalnya 250. Berapa koin yang bernilai 10?\n\n1. Langkah 1: Misalkan $x$ banyak koin 5 dan $y$ banyak koin 10.\n2. Langkah 2: Faktanya: $x+y=35$ dan $5x+10y=250$.\n3. Langkah 3: Dari yang pertama, $x=35-y$. Masukkan ke yang kedua: $5(35-y)+10y=250$, jadi $175+5y=250$ dan $y=15$.\n4. Langkah 4: Maka $x=20$. Periksa: $20\\times5+15\\times10=100+150=250$ ✓.\n\nJawaban pertanyaan adalah $y=15$ (koin 10), bukan $x$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c4',
          title: L('Watch Out!: Word Problem Traps', 'Awas, Jebakan!: Jebakan Soal Cerita'),
          body: L(
            '- **Answer what is asked.** After solving for $w=5$, the question may want the length (8) or the perimeter (26).\n- **Units.** Convert first (cm and m, minutes and hours, liters and cm$^3$), then calculate.\n- **Percent of what?** A 20% rise followed by a 20% fall is not a return to the start, because the second 20% is of a new amount.\n- **"At least"** means $\\ge$, **"more than"** means $>$, **"at most"** means $\\le$.\n- **Reasonable answers.** A person cannot be 2.5 people, a length cannot be negative, and a probability cannot be above 1. If the answer is impossible, find the slip.\n- **Last step: check.** Put your answer back into the story, not just into your own equation.',
            '- **Jawab yang ditanyakan.** Setelah mendapat $w=5$, soal mungkin menanyakan panjang (8) atau keliling (26).\n- **Satuan.** Ubah dulu (cm dan m, menit dan jam, liter dan cm$^3$), baru hitung.\n- **Persen dari apa?** Naik 20% lalu turun 20% tidak kembali ke awal, karena 20% kedua dihitung dari jumlah yang baru.\n- **"Paling sedikit"** berarti $\\ge$, **"lebih dari"** berarti $>$, **"paling banyak"** berarti $\\le$.\n- **Jawaban yang wajar.** Orang tidak mungkin 2,5 orang, panjang tidak mungkin negatif, dan peluang tidak mungkin di atas 1. Jika jawaban mustahil, cari kekeliruannya.\n- **Langkah terakhir: periksa.** Masukkan jawabanmu kembali ke ceritanya, bukan hanya ke persamaanmu sendiri.',
          ),
        },
        {
          kind: 'concept',
          id: 'c5',
          title: L('Look Closely: Three Levels of Thinking', 'Ayo Amati: Tiga Level Berpikir'),
          body: L(
            'The official framework of the TKA measures mathematical ability at **three cognitive levels**. A test mixes all three, from easy to hard.\n\n| Level | What you do | Example |\n|---|---|---|\n| **1. Knowing and Understanding** | calculate, read a graph or table, classify, identify | simplify $3(2x-4)-2(x-3)$; read the vertex from a graph |\n| **2. Applying** | model a real situation, apply a familiar method, interpret | write and solve an equation for a price problem |\n| **3. Reasoning** | analyze, solve a new kind of problem, evaluate, conclude, generalize, justify | test a claim with a counterexample; find a rule for a pattern |\n\nThe abilities behind them are: knowing mathematics, **representing** (equation, graph, table, diagram), **reasoning and proving**, **solving problems** and **connecting** topics.\n\nHow to use this: in a test, do the level-1 questions quickly and carefully, spend your thinking time on level 3, and always explain to yourself **why** an answer is right, not just what it is.',
            'Kerangka resmi TKA mengukur kemampuan matematis pada **tiga level kognitif**. Sebuah tes mencampur ketiganya, dari yang mudah sampai yang sulit.\n\n| Level | Yang kamu lakukan | Contoh |\n|---|---|---|\n| **1. Pengetahuan dan Pemahaman** | menghitung, membaca grafik atau tabel, mengelompokkan, mengidentifikasi | menyederhanakan $3(2x-4)-2(x-3)$; membaca puncak dari grafik |\n| **2. Aplikasi** | memodelkan situasi nyata, menerapkan cara yang dikenal, menginterpretasikan | menulis dan menyelesaikan persamaan untuk soal harga |\n| **3. Penalaran** | menganalisis, menyelesaikan masalah jenis baru, mengevaluasi, menyimpulkan, menggeneralisasi, menjustifikasi | menguji pernyataan dengan contoh penyangkal; menemukan aturan suatu pola |\n\nKemampuan di baliknya adalah: pengetahuan matematika, **representasi** (persamaan, grafik, tabel, diagram), **penalaran dan pembuktian**, **pemecahan masalah**, dan **koneksi** antartopik.\n\nCara memakainya: dalam tes, kerjakan soal level 1 dengan cepat dan teliti, pakai waktu berpikirmu untuk level 3, dan selalu jelaskan pada dirimu sendiri **mengapa** sebuah jawaban benar, bukan hanya apa jawabannya.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'A rectangle has width $x$ and length $2x-1$. Its perimeter is 34. What is the width $x$?',
            'Sebuah persegi panjang berlebar $x$ dan berpanjang $2x-1$. Kelilingnya 34. Berapa lebar $x$?',
          ),
          figure: {
            ...shape({
              pts: [[0, 0], [10, 0], [10, 5], [0, 5]],
              rights: [0, 1, 2, 3],
              sides: ['2x-1', undefined, undefined, 'x'],
            }),
            caption: L('A rectangle of width x and length 2x - 1.', 'Persegi panjang berlebar x dan berpanjang 2x - 1.'),
          },
          options: [L('6', '6'), L('11', '11'), L('8', '8'), L('5', '5')],
          answer: 0,
          explain: L(
            '$2(x+2x-1)=34$ gives $3x-1=17$, so $x=6$. The length is $2\\times6-1=11$, which is the trap answer: the question asks for the width.',
            '$2(x+2x-1)=34$ memberi $3x-1=17$, jadi $x=6$. Panjangnya $2\\times6-1=11$, yaitu jawaban jebakan: soal menanyakan lebar.',
          ),
          hint: L(
            'Write the perimeter as $2\\times(\\text{width}+\\text{length})$ and solve the equation.',
            'Tulis keliling sebagai $2\\times(\\text{lebar}+\\text{panjang})$ lalu selesaikan persamaannya.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: I multiply a number by 3, subtract 4 and get 20. Work backward.',
            'Coba bersama: aku mengalikan sebuah bilangan dengan 3, mengurangi 4, dan mendapat 20. Bekerjalah mundur.',
          ),
          template: '20+4=___ \\quad ___\\div3=___',
          blanks: ['24', '24', '8'],
          explain: L(
            'Undo the last step first: $20+4=24$. Then undo the multiplication: $24\\div3=8$.',
            'Batalkan langkah terakhir lebih dulu: $20+4=24$. Lalu batalkan perkalian: $24\\div3=8$.',
          ),
          hint: L(
            'Undo the steps in the opposite order: the last step comes undone first.',
            'Batalkan langkah dengan urutan sebaliknya: langkah terakhir dibatalkan lebih dulu.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO good habits for solving a word problem.', 'Pilih DUA kebiasaan baik untuk memecahkan soal cerita.'),
          options: [
            L('Underline what the question asks for.', 'Garis bawahi apa yang ditanyakan.'),
            L('Check that the answer makes sense in the story.', 'Periksa bahwa jawaban masuk akal dalam ceritanya.'),
            L('Start calculating with the first two numbers you see.', 'Mulai menghitung dengan dua bilangan pertama yang terlihat.'),
            L('Ignore the units until the end.', 'Abaikan satuan sampai akhir.'),
          ],
          answer: [0, 1],
          explain: L(
            'Reading carefully and checking are the habits that save marks. Grabbing the first numbers or ignoring units leads to wrong answers.',
            'Membaca dengan cermat dan memeriksa adalah kebiasaan yang menyelamatkan nilai. Mengambil bilangan pertama atau mengabaikan satuan menghasilkan jawaban yang salah.',
          ),
          hint: L(
            'Which two habits help you answer the question that was really asked?',
            'Dua kebiasaan mana yang membantumu menjawab pertanyaan yang sebenarnya diajukan?',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('When working backward, you undo the last step first.', 'Saat bekerja mundur, kamu membatalkan langkah terakhir lebih dulu.'),
            L('A 20% increase followed by a 20% decrease returns to the starting value.', 'Kenaikan 20% diikuti penurunan 20% kembali ke nilai awal.'),
            L('"At least 5" means 5 or more.', '"Paling sedikit 5" berarti 5 atau lebih.'),
            L('The answer $2.5$ people can be correct in a counting problem.', 'Jawaban $2{,}5$ orang bisa benar dalam soal menghitung.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            '$1.2\\times0.8=0.96$, not 1. And a count of people must be a whole number.',
            '$1{,}2\\times0{,}8=0{,}96$, bukan 1. Dan banyak orang harus bilangan bulat.',
          ),
          hint: L(
            'For the percent statement, work with a starting value of 100.',
            'Untuk pernyataan persen, kerjakan dengan nilai awal 100.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A purse holds 35 coins. Some are worth 5 and the others are worth 10, and the total value is 250. How many coins are worth 10?',
            'Sebuah dompet berisi 35 koin. Sebagian bernilai 5 dan sisanya bernilai 10, dan nilai totalnya 250. Berapa koin yang bernilai 10?',
          ),
          blanks: [{ answer: 15 }],
          hints: [
            L('Let $x$ be the 5-coins and $y$ the 10-coins. Write one equation for the count and one for the value.', 'Misalkan $x$ koin 5 dan $y$ koin 10. Tulis satu persamaan untuk banyaknya dan satu untuk nilainya.'),
            L('$x+y=35$ and $5x+10y=250$. Replace $x$ by $35-y$.', '$x+y=35$ dan $5x+10y=250$. Ganti $x$ dengan $35-y$.'),
            L('$175+5y=250$.', '$175+5y=250$.'),
          ],
          explain: L(
            '$5(35-y)+10y=250$ gives $175+5y=250$, so $y=15$.',
            '$5(35-y)+10y=250$ memberi $175+5y=250$, jadi $y=15$.',
          ),
          solution: ['x+y=35 \\quad 5x+10y=250', '5(35-y)+10y=250 \\Rightarrow 5y=75', 'y=15'],
        },
      ],
    },
    /* ----------------------------------------------- L2 mixed topics, reasoning */
    {
      id: 'tka-sma-m10-s1-l2',
      title: L('Patterns, Reasoning and Mixed Topics', 'Pola, Penalaran, dan Soal Campuran'),
      goal: L(
        'You can find the rule of a pattern, test a claim with examples and counterexamples, and combine ideas from different chapters.',
        'Kamu bisa menemukan aturan suatu pola, menguji suatu pernyataan dengan contoh dan contoh penyangkal, dan menggabungkan gagasan dari bab yang berbeda.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Pattern of Dots', 'Ayo Amati: Pola Titik-Titik'),
          body: L(
            'Cans are stacked in rows: 1 can in the top row, 2 in the next, 3, 4, $\\ldots$ The picture shows the first 4 rows. The totals form a pattern:\n\n$$1,\\ 3,\\ 6,\\ 10,\\ \\ldots$$\n\nThe differences are $2,3,4,\\ldots$ and they keep growing by 1, so the rule is not linear. These are the **triangular numbers**:\n\n$$T_n=1+2+\\cdots+n=\\frac{n(n+1)}{2}$$\n\nSo the 4th total is $\\frac{4\\times5}{2}=10$ and the 10th is $\\frac{10\\times11}{2}=55$.\n\nThis question mixes the topic of **sequences** (an arithmetic series) with a **pattern**: recognizing which tool applies from which chapter is half of the work.',
            'Kaleng ditumpuk dalam baris: 1 kaleng di baris teratas, 2 di baris berikutnya, 3, 4, $\\ldots$ Gambar menunjukkan 4 baris pertama. Totalnya membentuk pola:\n\n$$1,\\ 3,\\ 6,\\ 10,\\ \\ldots$$\n\nSelisihnya $2,3,4,\\ldots$ dan terus bertambah 1, jadi aturannya tidak linear. Ini **bilangan segitiga**:\n\n$$T_n=1+2+\\cdots+n=\\frac{n(n+1)}{2}$$\n\nJadi total ke-4 adalah $\\frac{4\\times5}{2}=10$ dan total ke-10 adalah $\\frac{10\\times11}{2}=55$.\n\nSoal ini mencampur topik **barisan** (deret aritmetika) dengan **pola**: mengenali alat dari bab mana yang berlaku adalah separuh pekerjaan.',
          ),
          figure: {
            ...dotRows(4),
            caption: L('Rows of 1, 2, 3 and 4 dots: 10 dots in all.', 'Baris berisi 1, 2, 3, dan 4 titik: seluruhnya 10 titik.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Test a Claim', 'Contoh Bertahap: Menguji Suatu Pernyataan'),
          body: L(
            'Some questions give a claim and ask whether it is **always** true. Two moves:\n\n- **Test with numbers.** Try a small, ordinary value, then an awkward one: 0, negative, a fraction, a big number.\n- **One counterexample is enough to show a claim is false.** Many examples never prove it true, but one failure kills it.\n\n"The product of two irrational numbers is irrational."\n\n1. Step 1: Try $\\sqrt{2}\\times\\sqrt{3}=\\sqrt{6}$: irrational, so far fine.\n2. Step 2: Try $\\sqrt{2}\\times\\sqrt{2}=2$: this is rational. The claim is **false**.\n\n"For every $x$, $x^2>x$."\n\n1. Step 1: Try $x=3$: $9>3$ ✓.\n2. Step 2: Try $x=\\frac{1}{2}$: $\\frac{1}{4}>\\frac{1}{2}$? No. False.\n\nTo show a claim is **true** you need a general reason, such as an algebra argument.',
            'Beberapa soal memberi pernyataan dan menanyakan apakah pernyataan itu **selalu** benar. Dua langkah:\n\n- **Uji dengan bilangan.** Coba nilai kecil yang biasa, lalu yang janggal: 0, negatif, pecahan, bilangan besar.\n- **Satu contoh penyangkal sudah cukup untuk menunjukkan pernyataan salah.** Banyak contoh tidak pernah membuktikan benar, tetapi satu kegagalan mematahkannya.\n\n"Hasil kali dua bilangan irasional adalah irasional."\n\n1. Langkah 1: Coba $\\sqrt{2}\\times\\sqrt{3}=\\sqrt{6}$: irasional, sejauh ini cocok.\n2. Langkah 2: Coba $\\sqrt{2}\\times\\sqrt{2}=2$: ini rasional. Pernyataan itu **salah**.\n\n"Untuk setiap $x$, $x^2>x$."\n\n1. Langkah 1: Coba $x=3$: $9>3$ ✓.\n2. Langkah 2: Coba $x=\\frac{1}{2}$: $\\frac{1}{4}>\\frac{1}{2}$? Tidak. Salah.\n\nUntuk menunjukkan pernyataan **benar** diperlukan alasan umum, seperti argumen aljabar.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Finding the Rule of a Pattern', 'Contoh Bertahap: Menemukan Aturan Suatu Pola'),
          body: L(
            'To find a rule, look at the **differences**.\n\n- Constant first differences (like $5,8,11,14$): a **linear** rule, an arithmetic sequence.\n- Constant second differences (like $1,3,6,10$ with differences $2,3,4$): a **quadratic** rule.\n- A constant ratio (like $3,6,12,24$): an **exponential** rule, a geometric sequence.\n\nFind the smallest $n$ with $T_n\\ge100$.\n\n1. Step 1: $T_n=\\frac{n(n+1)}{2}\\ge100$, that is $n(n+1)\\ge200$.\n2. Step 2: Try $n=13$: $13\\times14=182<200$. Not enough.\n3. Step 3: Try $n=14$: $14\\times15=210\\ge200$ ✓.\n4. Step 4: The smallest is $n=14$ (and $T_{14}=105$).\n\nWhen the rule is awkward to solve, **trying values** near an estimate ($n^2\\approx200$, so $n\\approx14$) is a quick and honest method.',
            'Untuk menemukan aturan, lihat **selisihnya**.\n\n- Selisih pertama konstan (seperti $5,8,11,14$): aturan **linear**, barisan aritmetika.\n- Selisih kedua konstan (seperti $1,3,6,10$ dengan selisih $2,3,4$): aturan **kuadrat**.\n- Rasio konstan (seperti $3,6,12,24$): aturan **eksponensial**, barisan geometri.\n\nCari $n$ terkecil dengan $T_n\\ge100$.\n\n1. Langkah 1: $T_n=\\frac{n(n+1)}{2}\\ge100$, yaitu $n(n+1)\\ge200$.\n2. Langkah 2: Coba $n=13$: $13\\times14=182<200$. Belum cukup.\n3. Langkah 3: Coba $n=14$: $14\\times15=210\\ge200$ ✓.\n4. Langkah 4: Yang terkecil $n=14$ (dan $T_{14}=105$).\n\nBila aturannya sulit diselesaikan, **mencoba nilai** di dekat taksiran ($n^2\\approx200$, jadi $n\\approx14$) adalah cara yang cepat dan jujur.',
          ),
        },
        {
          kind: 'concept',
          id: 'c4',
          title: L('Watch Out!: Mixed-Topic Traps', 'Awas, Jebakan!: Jebakan Soal Campuran'),
          body: L(
            '- **Name the topic.** Ask "which chapter is this?": a rate, a sequence, a triangle, a probability? Then use that chapter\'s tool.\n- **Do not stop halfway.** Mixed problems often have two stages: for example, find a radius with Pythagoras, then use it in an area.\n- **Check the whole chain of units.** Area in $\\text{cm}^2$, volume in $\\text{cm}^3$, liters from $\\text{cm}^3$.\n- **Exact or rounded?** Keep $\\pi$ and square roots exact until the very last step, unless the question gives a value to use.\n- **"The first" or "the next".** In patterns, count from the correct start: term number 1 is the first term.\n- If you are stuck, **try a smaller case**: 2 rows instead of 10, 3 people instead of 30.',
            '- **Namai topiknya.** Tanyakan "ini bab apa?": laju, barisan, segitiga, peluang? Lalu pakai alat bab itu.\n- **Jangan berhenti di tengah.** Soal campuran sering punya dua tahap: misalnya, cari jari-jari dengan Pythagoras, lalu pakai untuk luas.\n- **Periksa seluruh rantai satuan.** Luas dalam $\\text{cm}^2$, volume dalam $\\text{cm}^3$, liter dari $\\text{cm}^3$.\n- **Eksak atau dibulatkan?** Pertahankan $\\pi$ dan akar tetap eksak sampai langkah terakhir, kecuali soal memberi nilai yang harus dipakai.\n- **"Yang pertama" atau "yang berikutnya".** Dalam pola, hitung dari awal yang benar: suku nomor 1 adalah suku pertama.\n- Jika buntu, **coba kasus yang lebih kecil**: 2 baris bukan 10, 3 orang bukan 30.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The picture shows dots arranged in rows of 1, 2, 3 and 4. If the pattern goes on, how many dots are there in 6 rows?',
            'Gambar menunjukkan titik-titik yang disusun dalam baris berisi 1, 2, 3, dan 4. Jika pola berlanjut, ada berapa titik dalam 6 baris?',
          ),
          figure: {
            ...dotRows(4),
            caption: L('The first four rows of the pattern.', 'Empat baris pertama dari pola.'),
          },
          options: [L('21', '21'), L('18', '18'), L('15', '15'), L('36', '36')],
          answer: 0,
          explain: L(
            '$T_6=\\frac{6\\times7}{2}=21$, that is $1+2+3+4+5+6=21$. The value 15 is $T_5$, and 36 is $6^2$.',
            '$T_6=\\frac{6\\times7}{2}=21$, yaitu $1+2+3+4+5+6=21$. Nilai 15 adalah $T_5$, dan 36 adalah $6^2$.',
          ),
          hint: L(
            'The 5th row adds 5 dots and the 6th row adds 6. Start from the total of 4 rows.',
            'Baris ke-5 menambah 5 titik dan baris ke-6 menambah 6. Mulai dari total 4 baris.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the number of dots in 6 rows, with the formula $T_n=\\frac{n(n+1)}{2}$.',
            'Coba bersama: banyak titik dalam 6 baris, dengan rumus $T_n=\\frac{n(n+1)}{2}$.',
          ),
          template: 'T_6=\\frac{6\\times7}{2}=___',
          blanks: ['21'],
          explain: L(
            '$6\\times7=42$ and $42\\div2=21$.',
            '$6\\times7=42$ dan $42\\div2=21$.',
          ),
          hint: L(
            'Multiply 6 by the next number, then halve.',
            'Kalikan 6 dengan bilangan berikutnya, lalu bagi dua.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO statements that are always true.', 'Pilih DUA pernyataan yang selalu benar.'),
          options: [
            L('The sum of two even numbers is even.', 'Jumlah dua bilangan genap adalah genap.'),
            L('The product of two odd numbers is odd.', 'Hasil kali dua bilangan ganjil adalah ganjil.'),
            L('The sum of two prime numbers is even.', 'Jumlah dua bilangan prima adalah genap.'),
            L('The square of a number is greater than the number.', 'Kuadrat suatu bilangan lebih besar daripada bilangannya.'),
          ],
          answer: [0, 1],
          explain: L(
            'Counterexamples: $2+3=5$ is odd, and $\\left(\\frac{1}{2}\\right)^2=\\frac{1}{4}<\\frac{1}{2}$ (also $0^2=0$).',
            'Contoh penyangkal: $2+3=5$ ganjil, dan $\\left(\\frac{1}{2}\\right)^2=\\frac{1}{4}<\\frac{1}{2}$ (juga $0^2=0$).',
          ),
          hint: L(
            'For each statement, try to find one example that breaks it.',
            'Untuk tiap pernyataan, coba cari satu contoh yang mematahkannya.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$x^2\\ge0$ for every real number $x$.', '$x^2\\ge0$ untuk setiap bilangan real $x$.'),
            L('$x^2>x$ for every real number $x$.', '$x^2>x$ untuk setiap bilangan real $x$.'),
            L('If $a>b>0$, then $\\frac{1}{a}<\\frac{1}{b}$.', 'Jika $a>b>0$, maka $\\frac{1}{a}<\\frac{1}{b}$.'),
            L('$\\sqrt{a^2}=a$ for every real number $a$.', '$\\sqrt{a^2}=a$ untuk setiap bilangan real $a$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'A square is never negative. $x=\\frac{1}{2}$ breaks the second statement. Dividing 1 by a bigger positive number gives a smaller result. And $\\sqrt{(-3)^2}=3\\neq-3$.',
            'Kuadrat tidak pernah negatif. $x=\\frac{1}{2}$ mematahkan pernyataan kedua. Membagi 1 dengan bilangan positif yang lebih besar memberi hasil lebih kecil. Dan $\\sqrt{(-3)^2}=3\\neq-3$.',
          ),
          hint: L(
            'Try a negative number and a fraction as your awkward test values.',
            'Coba bilangan negatif dan pecahan sebagai nilai uji yang janggal.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'Cans are stacked in rows of 1, 2, 3, 4, $\\ldots$ cans. What is the smallest number of rows that holds at least 100 cans?',
            'Kaleng ditumpuk dalam baris berisi 1, 2, 3, 4, $\\ldots$ kaleng. Berapa banyak baris paling sedikit yang memuat sedikitnya 100 kaleng?',
          ),
          blanks: [{ answer: 14 }],
          hints: [
            L('The total in $n$ rows is $\\frac{n(n+1)}{2}$.', 'Total dalam $n$ baris adalah $\\frac{n(n+1)}{2}$.'),
            L('You need $n(n+1)\\ge200$. Estimate: $n^2\\approx200$, so $n$ is about 14.', 'Kamu memerlukan $n(n+1)\\ge200$. Taksir: $n^2\\approx200$, jadi $n$ sekitar 14.'),
            L('Test $n=13$ and $n=14$.', 'Uji $n=13$ dan $n=14$.'),
          ],
          explain: L(
            '$13\\times14=182<200$, but $14\\times15=210\\ge200$. So 14 rows (holding 105 cans).',
            '$13\\times14=182<200$, tetapi $14\\times15=210\\ge200$. Jadi 14 baris (memuat 105 kaleng).',
          ),
          solution: {
            en: ['\\frac{n(n+1)}{2}\\ge100 \\Rightarrow n(n+1)\\ge200', '13\\times14=182 \\quad 14\\times15=210', 'n=14'],
            id: ['\\frac{n(n+1)}{2}\\ge100 \\Rightarrow n(n+1)\\ge200', '13\\times14=182 \\quad 14\\times15=210', 'n=14'],
          },
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m10-s1-p',
    runtime: 'math',
    title: L('Project: Plan, Calculate, Check', 'Proyek: Rencanakan, Hitung, Periksa'),
    brief: L(
      'Five mixed problems. For each one, name the topic, plan, solve and check.',
      'Lima soal campuran. Untuk tiap soal, namai topiknya, rencanakan, selesaikan, dan periksa.',
    ),
    requirements: [
      L('Use the four steps on every problem.', 'Memakai empat langkah pada setiap soal.'),
      L('Choose the right tool for each topic.', 'Memilih alat yang tepat untuk tiap topik.'),
    ],
    hints: [
      L('Write down what is given and what is asked before you calculate.', 'Tulis yang diketahui dan yang ditanyakan sebelum menghitung.'),
      L('Work backward for "I think of a number" questions.', 'Bekerja mundur untuk soal "aku memikirkan sebuah bilangan".'),
      L('Always check the answer in the story.', 'Selalu periksa jawaban dalam ceritanya.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'I think of a number, add 5, multiply by 4 and then subtract 6. The result is 34. What is my number?',
          'Aku memikirkan sebuah bilangan, menambah 5, mengalikan 4, lalu mengurangi 6. Hasilnya 34. Berapa bilanganku?',
        ),
        blanks: [{ answer: 5 }],
        solution: ['34+6=40 \\quad 40\\div4=10', '10-5=5'],
      },
      {
        prompt: L(
          'A rectangle is 4 cm longer than it is wide, and its area is 96 cm$^2$. Find the width, in cm.',
          'Sebuah persegi panjang 4 cm lebih panjang daripada lebarnya, dan luasnya 96 cm$^2$. Tentukan lebarnya, dalam cm.',
        ),
        blanks: [{ answer: 8, after: '\\text{cm}' }],
        solution: ['w(w+4)=96 \\Rightarrow w^2+4w-96=0', '(w+12)(w-8)=0 \\Rightarrow w=8'],
      },
      {
        prompt: L(
          'A shop sells pens at Rp3,000 and notebooks at Rp5,000. Dewi buys 12 items and pays Rp48,000. How many notebooks did she buy?',
          'Sebuah toko menjual pena Rp3.000 dan buku tulis Rp5.000. Dewi membeli 12 barang dan membayar Rp48.000. Berapa buku tulis yang ia beli?',
        ),
        blanks: [{ answer: 6 }],
        solution: ['p+n=12 \\quad 3p+5n=48', '3(12-n)+5n=48 \\Rightarrow 36+2n=48', 'n=6'],
      },
      {
        prompt: L(
          'Dots form a triangle with 1 dot in the first row, 2 in the second, and so on. How many dots are there in 12 rows?',
          'Titik-titik membentuk segitiga dengan 1 titik pada baris pertama, 2 pada baris kedua, dan seterusnya. Ada berapa titik dalam 12 baris?',
        ),
        figure: {
          ...dotRows(5),
          caption: L('The first five rows of the dot triangle.', 'Lima baris pertama dari segitiga titik.'),
        },
        blanks: [{ answer: 78 }],
        solution: ['\\frac{12\\times13}{2}=78'],
      },
      {
        prompt: L(
          'A price rises by 25% and then falls by 20%. The final price is Rp60,000. What was the original price, in rupiah?',
          'Sebuah harga naik 25% lalu turun 20%. Harga akhirnya Rp60.000. Berapa harga semula, dalam rupiah?',
        ),
        blanks: [{ label: 'Rp', answer: 60000 }],
        solution: { en: ['1.25\\times0.8=1', '\\text{the final price equals the original price}'], id: ['1{,}25\\times0{,}8=1', '\\text{harga akhir sama dengan harga semula}'] },
      },
    ],
  },
}
