import type { Submodule } from '../types'
import { L, gridRect, pieChart } from './figs'

/** Module 9, submodule 2 — counting rules and probability. */

export const m9s2: Submodule = {
  id: 'tka-sma-m9-s2',
  title: L('Counting and Probability', 'Aturan Pencacahan dan Peluang'),
  summary: L(
    'Count with the multiplication rule, permutations and combinations, and find probabilities of single and combined events, with expected value.',
    'Mencacah dengan aturan perkalian, permutasi, dan kombinasi, serta mencari peluang kejadian tunggal dan gabungan, dengan nilai harapan.',
  ),
  lessons: [
    /* ------------------------------------------------------- L1 counting */
    {
      id: 'tka-sma-m9-s2-l1',
      title: L('Counting Rules', 'Aturan Pencacahan'),
      goal: L(
        'You can count outcomes with the multiplication rule, and decide between a permutation and a combination.',
        'Kamu bisa mencacah hasil dengan aturan perkalian, dan memutuskan antara permutasi dan kombinasi.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Choices Multiply', 'Ayo Amati: Pilihan Saling Mengalikan'),
          body: L(
            'A shop has 4 shirts and 3 pairs of trousers. Each square in the grid is one outfit: a column for a shirt and a row for a pair of trousers.\n\n$$4\\times3=12\\ \\text{outfits}$$\n\nThis is the **multiplication rule**: if one choice can be made in $m$ ways and then another in $n$ ways, the two together can be made in $m\\times n$ ways.\n\nFor several steps, multiply them all. A PIN of 3 digits, each from 0–9 (repeats allowed), has $10\\times10\\times10=1\\,000$ possibilities. If no digit may repeat: $10\\times9\\times8=720$.\n\nThe **addition rule** is for "or": a menu with 4 soups **or** 3 salads (never both) offers $4+3=7$ choices.',
            'Sebuah toko punya 4 kemeja dan 3 celana. Setiap kotak pada petak adalah satu setelan: satu kolom untuk satu kemeja dan satu baris untuk satu celana.\n\n$$4\\times3=12\\ \\text{setelan}$$\n\nIni **aturan perkalian**: jika satu pilihan dapat dibuat dengan $m$ cara dan kemudian pilihan lain dengan $n$ cara, keduanya bersama dapat dibuat dengan $m\\times n$ cara.\n\nUntuk beberapa langkah, kalikan semuanya. PIN 3 angka, masing-masing dari 0–9 (boleh berulang), punya $10\\times10\\times10=1\\,000$ kemungkinan. Jika angka tidak boleh berulang: $10\\times9\\times8=720$.\n\n**Aturan penjumlahan** untuk "atau": sebuah menu dengan 4 sup **atau** 3 salad (tidak pernah keduanya) menawarkan $4+3=7$ pilihan.',
          ),
          figure: {
            ...gridRect({ cols: 4, rows: 3, shade: 12, dims: ['4', '3'] }),
            caption: L('Each of the 12 squares is one outfit.', 'Masing-masing dari 12 kotak adalah satu setelan.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Arrangements and Permutations', 'Contoh Bertahap: Susunan dan Permutasi'),
          body: L(
            'The number of ways to arrange $n$ different objects in a row is the **factorial**:\n\n$$n!=n\\times(n-1)\\times\\cdots\\times2\\times1\\qquad 5!=120\\qquad 0!=1$$\n\nA **permutation** picks $r$ of $n$ objects **and the order matters**:\n\n$$P(n,r)=\\frac{n!}{(n-r)!}$$\n\nFrom 5 students choose a president, a vice-president and a secretary (3 different jobs):\n\n1. Step 1: $5$ choices for president, then $4$ for vice-president, then $3$ for secretary.\n2. Step 2: $P(5,3)=\\frac{5!}{2!}=5\\times4\\times3=60$.\n\n**Letters that repeat.** The arrangements of BANANA: 6 letters with A three times and N twice, so $\\frac{6!}{3!\\,2!}=\\frac{720}{12}=60$. Divide by the factorial of each repeat.',
            'Banyak cara menyusun $n$ benda berbeda dalam satu baris adalah **faktorial**:\n\n$$n!=n\\times(n-1)\\times\\cdots\\times2\\times1\\qquad 5!=120\\qquad 0!=1$$\n\n**Permutasi** memilih $r$ dari $n$ benda **dan urutan berpengaruh**:\n\n$$P(n,r)=\\frac{n!}{(n-r)!}$$\n\nDari 5 siswa pilih ketua, wakil ketua, dan sekretaris (3 jabatan berbeda):\n\n1. Langkah 1: $5$ pilihan untuk ketua, lalu $4$ untuk wakil, lalu $3$ untuk sekretaris.\n2. Langkah 2: $P(5,3)=\\frac{5!}{2!}=5\\times4\\times3=60$.\n\n**Huruf yang berulang.** Susunan BANANA: 6 huruf dengan A tiga kali dan N dua kali, jadi $\\frac{6!}{3!\\,2!}=\\frac{720}{12}=60$. Bagi dengan faktorial tiap pengulangan.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Combinations', 'Contoh Bertahap: Kombinasi'),
          body: L(
            'A **combination** picks $r$ of $n$ objects when **the order does not matter**:\n\n$$C(n,r)=\\frac{n!}{r!\\,(n-r)!}$$\n\nA committee of 3 people from 5 (the three are not given different jobs):\n\n1. Step 1: Count it as a permutation first: $P(5,3)=60$.\n2. Step 2: Each group of 3 was counted $3!=6$ times (once for each order), so divide: $\\frac{60}{6}=10$.\n3. Step 3: $C(5,3)=\\frac{5!}{3!\\,2!}=10$.\n\nUseful: $C(n,r)=C(n,n-r)$, because choosing who is **in** is the same as choosing who is **out**. And $C(6,2)=15$ is the number of handshakes among 6 people.\n\n**How to decide:** if swapping two chosen items gives a **different** result (jobs, ranking, a number), it is a permutation. If it gives the **same** result (a team, a hand of cards), it is a combination.',
            '**Kombinasi** memilih $r$ dari $n$ benda bila **urutan tidak berpengaruh**:\n\n$$C(n,r)=\\frac{n!}{r!\\,(n-r)!}$$\n\nSebuah panitia 3 orang dari 5 (ketiganya tidak diberi jabatan berbeda):\n\n1. Langkah 1: Hitung dulu sebagai permutasi: $P(5,3)=60$.\n2. Langkah 2: Setiap kelompok 3 orang terhitung $3!=6$ kali (sekali untuk setiap urutan), jadi bagi: $\\frac{60}{6}=10$.\n3. Langkah 3: $C(5,3)=\\frac{5!}{3!\\,2!}=10$.\n\nBerguna: $C(n,r)=C(n,n-r)$, karena memilih siapa yang **masuk** sama dengan memilih siapa yang **keluar**. Dan $C(6,2)=15$ adalah banyak jabat tangan di antara 6 orang.\n\n**Cara memutuskan:** jika menukar dua benda terpilih memberi hasil yang **berbeda** (jabatan, peringkat, sebuah bilangan), itu permutasi. Jika memberi hasil yang **sama** (sebuah tim, kartu di tangan), itu kombinasi.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'A menu has 3 starters and 5 main dishes. A meal is one starter and one main dish (the grid shows all of them). How many different meals are there?',
            'Sebuah menu punya 3 hidangan pembuka dan 5 hidangan utama. Satu santapan adalah satu pembuka dan satu hidangan utama (petak menunjukkan semuanya). Ada berapa santapan yang berbeda?',
          ),
          figure: {
            ...gridRect({ cols: 3, rows: 5, shade: 15, dims: ['3', '5'] }),
            caption: L('A grid with 3 columns and 5 rows.', 'Petak dengan 3 kolom dan 5 baris.'),
          },
          options: [L('15', '15'), L('8', '8'), L('35', '35'), L('10', '10')],
          answer: 0,
          explain: L(
            '$3\\times5=15$: each starter can go with each of the 5 main dishes. Adding gives 8, which counts "starter or main", not a meal with both.',
            '$3\\times5=15$: setiap pembuka dapat dipasangkan dengan masing-masing dari 5 hidangan utama. Menjumlahkan memberi 8, yang menghitung "pembuka atau utama", bukan santapan dengan keduanya.',
          ),
          hint: L(
            'A meal needs both a starter and a main: do you add or multiply the numbers of choices?',
            'Sebuah santapan memerlukan pembuka dan hidangan utama: apakah banyak pilihan dijumlahkan atau dikalikan?',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: choose a president, a vice-president and a secretary from 5 students.',
            'Coba bersama: pilih ketua, wakil ketua, dan sekretaris dari 5 siswa.',
          ),
          template: 'P(5,3)=\\frac{5!}{2!}=5\\times4\\times___=___',
          blanks: ['3', '60'],
          explain: L(
            '$\\frac{5!}{2!}$ cancels to $5\\times4\\times3=60$.',
            '$\\frac{5!}{2!}$ disederhanakan menjadi $5\\times4\\times3=60$.',
          ),
          hint: L(
            'Write $5!$ out, and cancel the $2\\times1$ with the $2!$ below.',
            'Tulis $5!$ lengkap, dan coret $2\\times1$ dengan $2!$ di bawahnya.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true equalities.', 'Pilih DUA kesamaan yang benar.'),
          options: [
            L('$C(5,2)=10$', '$C(5,2)=10$'),
            L('$4!=24$', '$4!=24$'),
            L('$P(5,2)=10$', '$P(5,2)=10$'),
            L('$C(6,3)=18$', '$C(6,3)=18$'),
          ],
          answer: [0, 1],
          explain: L(
            '$P(5,2)=5\\times4=20$ (the order matters, so it is twice $C(5,2)$). $C(6,3)=\\frac{6\\times5\\times4}{6}=20$, not 18.',
            '$P(5,2)=5\\times4=20$ (urutan berpengaruh, jadi dua kali $C(5,2)$). $C(6,3)=\\frac{6\\times5\\times4}{6}=20$, bukan 18.',
          ),
          hint: L(
            'Work out each: a permutation is $n(n-1)\\cdots$ for $r$ factors, and a combination divides that by $r!$.',
            'Hitung masing-masing: permutasi adalah $n(n-1)\\cdots$ sebanyak $r$ faktor, dan kombinasi membagi hasilnya dengan $r!$.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('In a permutation the order of the chosen objects matters.', 'Pada permutasi urutan benda yang dipilih berpengaruh.'),
            L('$C(n,r)=C(n,n-r)$.', '$C(n,r)=C(n,n-r)$.'),
            L('$5!=60$.', '$5!=60$.'),
            L('The word BANANA can be arranged in 720 different ways.', 'Kata BANANA dapat disusun dalam 720 cara berbeda.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            '$5!=120$ ($60$ is $P(5,3)$). BANANA has repeated letters, so $\\frac{6!}{3!\\,2!}=60$; 720 would be right only if all six letters were different.',
            '$5!=120$ ($60$ adalah $P(5,3)$). BANANA memuat huruf berulang, jadi $\\frac{6!}{3!\\,2!}=60$; 720 benar hanya jika keenam huruf berbeda.',
          ),
          hint: L(
            'For BANANA, divide $6!$ by the factorial of each repeated letter.',
            'Untuk BANANA, bagi $6!$ dengan faktorial tiap huruf yang berulang.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A committee of 3 people is chosen from 5 boys and 4 girls. At least 1 of the 3 must be a girl. How many committees are possible?',
            'Sebuah panitia 3 orang dipilih dari 5 anak laki-laki dan 4 anak perempuan. Sedikitnya 1 dari 3 orang harus perempuan. Ada berapa panitia yang mungkin?',
          ),
          blanks: [{ answer: 74 }],
          hints: [
            L('It is easier to count all committees and subtract the ones with no girl at all.', 'Lebih mudah menghitung semua panitia lalu mengurangi yang tanpa perempuan sama sekali.'),
            L('All committees: $C(9,3)=84$. Committees of only boys: $C(5,3)=10$.', 'Semua panitia: $C(9,3)=84$. Panitia hanya laki-laki: $C(5,3)=10$.'),
            L('Subtract: $84-10$.', 'Kurangkan: $84-10$.'),
          ],
          explain: L(
            '$C(9,3)=\\frac{9\\times8\\times7}{6}=84$ and $C(5,3)=10$, so $84-10=74$.',
            '$C(9,3)=\\frac{9\\times8\\times7}{6}=84$ dan $C(5,3)=10$, jadi $84-10=74$.',
          ),
          solution: {
            en: ['\\text{all}: C(9,3)=84', '\\text{no girl}: C(5,3)=10', '84-10=74'],
            id: ['\\text{semua}: C(9,3)=84', '\\text{tanpa perempuan}: C(5,3)=10', '84-10=74'],
          },
        },
      ],
    },
    /* ----------------------------------------------------- L2 probability */
    {
      id: 'tka-sma-m9-s2-l2',
      title: L('Probability', 'Peluang'),
      goal: L(
        'You can find the probability of an event, of "not", "or" and "and" events, with and without replacement, and an expected value.',
        'Kamu bisa mencari peluang suatu kejadian, kejadian "bukan", "atau", dan "dan", dengan dan tanpa pengembalian, serta nilai harapan.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: All the Outcomes of Two Dice', 'Ayo Amati: Semua Hasil dari Dua Dadu'),
          body: L(
            'The **probability** of an event, when all outcomes are equally likely, is\n\n$$P(E)=\\frac{\\text{number of favourable outcomes}}{\\text{number of all outcomes}}$$\n\nWhen two fair dice are rolled there are $6\\times6=36$ equally likely outcomes (the grid). Exactly 6 of them have a sum of 7: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$.\n\n$$P(\\text{sum}=7)=\\frac{6}{36}=\\frac{1}{6}$$\n\nA probability is always between 0 (impossible) and 1 (certain).',
            '**Peluang** suatu kejadian, bila semua hasil sama mungkinnya, adalah\n\n$$P(E)=\\frac{\\text{banyak hasil yang diinginkan}}{\\text{banyak semua hasil}}$$\n\nSaat dua dadu setimbang dilempar ada $6\\times6=36$ hasil yang sama mungkinnya (petak). Tepat 6 di antaranya berjumlah 7: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$.\n\n$$P(\\text{jumlah}=7)=\\frac{6}{36}=\\frac{1}{6}$$\n\nPeluang selalu di antara 0 (mustahil) dan 1 (pasti).',
          ),
          figure: {
            ...gridRect({ cols: 6, rows: 6, shade: 6, dims: ['6', '6'] }),
            caption: L('The 36 outcomes of two dice; 6 of them (coloured) give a sum of 7.', '36 hasil dua dadu; 6 di antaranya (berwarna) berjumlah 7.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Not, Or, And', 'Contoh Bertahap: Bukan, Atau, Dan'),
          body: L(
            '- **Not:** $P(E\')=1-P(E)$.\n- **Or:** $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$. The overlap is subtracted so it is not counted twice.\n- **And, independent events:** $P(A\\cap B)=P(A)\\times P(B)$.\n\n**Or.** Draw a card from 52. $P(\\text{heart or king})$: 13 hearts, 4 kings, and the king of hearts is in both.\n\n$$\\frac{13}{52}+\\frac{4}{52}-\\frac{1}{52}=\\frac{16}{52}=\\frac{4}{13}$$\n\n**And.** A bag has 3 red and 2 blue balls. Take two balls **without putting the first back**.\n\n1. Step 1: First red: $\\frac{3}{5}$.\n2. Step 2: Now 2 red among 4 balls: $\\frac{2}{4}$.\n3. Step 3: $P(\\text{both red})=\\frac{3}{5}\\times\\frac{2}{4}=\\frac{3}{10}$.\n\nWith replacement the second chance stays $\\frac{3}{5}$ and the answer would be $\\frac{9}{25}$.',
            '- **Bukan:** $P(E\')=1-P(E)$.\n- **Atau:** $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$. Irisannya dikurangi agar tidak terhitung dua kali.\n- **Dan, kejadian saling bebas:** $P(A\\cap B)=P(A)\\times P(B)$.\n\n**Atau.** Ambil sebuah kartu dari 52. $P(\\text{hati atau raja})$: 13 hati, 4 raja, dan raja hati ada pada keduanya.\n\n$$\\frac{13}{52}+\\frac{4}{52}-\\frac{1}{52}=\\frac{16}{52}=\\frac{4}{13}$$\n\n**Dan.** Sebuah kantong berisi 3 bola merah dan 2 bola biru. Ambil dua bola **tanpa mengembalikan yang pertama**.\n\n1. Langkah 1: Pertama merah: $\\frac{3}{5}$.\n2. Langkah 2: Sekarang 2 merah di antara 4 bola: $\\frac{2}{4}$.\n3. Langkah 3: $P(\\text{keduanya merah})=\\frac{3}{5}\\times\\frac{2}{4}=\\frac{3}{10}$.\n\nDengan pengembalian peluang kedua tetap $\\frac{3}{5}$ dan jawabannya $\\frac{9}{25}$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Expected Value', 'Contoh Bertahap: Nilai Harapan'),
          body: L(
            'The **expected value** is the long-run average result: multiply each value by its probability and add.\n\n$$E=\\sum x\\cdot P(x)$$\n\nA game: roll a fair die. If it shows 1 or 2, you win 0. If 3 or 4, you win 6. If 5 or 6, you win 9 (all in thousands of rupiah).\n\n1. Step 1: Each pair has probability $\\frac{2}{6}=\\frac{1}{3}$.\n2. Step 2: $E=0\\times\\frac{1}{3}+6\\times\\frac{1}{3}+9\\times\\frac{1}{3}=\\frac{15}{3}=5$.\n3. Step 3: If it costs 4 to play, the expected profit is $5-4=1$ per game, so the game favours the player.\n\n**Watch out:** the expected value need not be one of the actual outcomes. A single game pays 0, 6 or 9, never exactly 5.',
            '**Nilai harapan** adalah hasil rata-rata jangka panjang: kalikan tiap nilai dengan peluangnya lalu jumlahkan.\n\n$$E=\\sum x\\cdot P(x)$$\n\nSebuah permainan: lempar dadu setimbang. Jika muncul 1 atau 2, kamu menang 0. Jika 3 atau 4, kamu menang 6. Jika 5 atau 6, kamu menang 9 (semua dalam ribuan rupiah).\n\n1. Langkah 1: Setiap pasangan berpeluang $\\frac{2}{6}=\\frac{1}{3}$.\n2. Langkah 2: $E=0\\times\\frac{1}{3}+6\\times\\frac{1}{3}+9\\times\\frac{1}{3}=\\frac{15}{3}=5$.\n3. Langkah 3: Jika biaya bermain 4, keuntungan yang diharapkan $5-4=1$ per permainan, jadi permainan itu menguntungkan pemain.\n\n**Awas:** nilai harapan tidak harus salah satu hasil sebenarnya. Satu permainan membayar 0, 6, atau 9, tidak pernah tepat 5.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'A spinner is cut into 8 equal sections: 3 are labelled R, 2 labelled B and 3 labelled G (the numbers on the picture count sections). What is the probability that it does NOT land on R?',
            'Sebuah gasing putar dibagi 8 bagian sama: 3 berlabel R, 2 berlabel B, dan 3 berlabel G (bilangan pada gambar menyatakan banyak bagian). Berapa peluang gasing TIDAK berhenti di R?',
          ),
          figure: {
            ...pieChart({
              slices: [
                { label: 'R', value: 3 },
                { label: 'B', value: 2 },
                { label: 'G', value: 3 },
              ],
            }),
            caption: L('A spinner with 8 equal sections.', 'Gasing putar dengan 8 bagian sama.'),
          },
          options: [L('$\\frac{5}{8}$', '$\\frac{5}{8}$'), L('$\\frac{3}{8}$', '$\\frac{3}{8}$'), L('$\\frac{5}{3}$', '$\\frac{5}{3}$'), L('$\\frac{1}{2}$', '$\\frac{1}{2}$')],
          answer: 0,
          explain: L(
            '$P(R)=\\frac{3}{8}$, so $P(\\text{not }R)=1-\\frac{3}{8}=\\frac{5}{8}$. A probability can never be larger than 1, which rules out $\\frac{5}{3}$.',
            '$P(R)=\\frac{3}{8}$, jadi $P(\\text{bukan }R)=1-\\frac{3}{8}=\\frac{5}{8}$. Peluang tidak pernah lebih dari 1, yang menyingkirkan $\\frac{5}{3}$.',
          ),
          hint: L(
            'Count the sections that are not R, or subtract $P(R)$ from 1.',
            'Hitung bagian yang bukan R, atau kurangkan $P(R)$ dari 1.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the complement of landing on R.',
            'Coba bersama: komplemen dari berhenti di R.',
          ),
          template: "P(R')=1-\\frac{3}{8}=\\frac{___}{8}",
          blanks: ['5'],
          explain: L(
            '$1=\\frac{8}{8}$, so $\\frac{8}{8}-\\frac{3}{8}=\\frac{5}{8}$.',
            '$1=\\frac{8}{8}$, jadi $\\frac{8}{8}-\\frac{3}{8}=\\frac{5}{8}$.',
          ),
          hint: L(
            'Write 1 as a fraction with denominator 8 and subtract.',
            'Tulis 1 sebagai pecahan berpenyebut 8 lalu kurangkan.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$.', '$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$.'),
            L('For independent events, $P(A\\cap B)=P(A)\\times P(B)$.', 'Untuk kejadian saling bebas, $P(A\\cap B)=P(A)\\times P(B)$.'),
            L('A probability can be 1.2.', 'Peluang dapat bernilai 1,2.'),
            L('$P(E\')=P(E)-1$.', '$P(E\')=P(E)-1$.'),
          ],
          answer: [0, 1],
          explain: L(
            'A probability lies between 0 and 1. The complement rule is $P(E\')=1-P(E)$; $P(E)-1$ would be negative.',
            'Peluang berada di antara 0 dan 1. Aturan komplemen adalah $P(E\')=1-P(E)$; $P(E)-1$ akan negatif.',
          ),
          hint: L(
            'Which formula would give a negative probability? Which value is outside 0 to 1?',
            'Rumus mana yang memberi peluang negatif? Nilai mana yang di luar 0 sampai 1?',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('The probability of an impossible event is 0.', 'Peluang kejadian yang mustahil adalah 0.'),
            L('For two coin flips, $P(\\text{two heads})=\\frac{1}{2}$.', 'Untuk dua lemparan koin, $P(\\text{dua gambar})=\\frac{1}{2}$.'),
            L('From a bag of 3 red and 2 blue balls, taking two without replacement, $P(\\text{both red})=\\frac{3}{10}$.', 'Dari kantong berisi 3 bola merah dan 2 biru, mengambil dua tanpa pengembalian, $P(\\text{keduanya merah})=\\frac{3}{10}$.'),
            L('The expected value is always one of the possible outcomes.', 'Nilai harapan selalu salah satu hasil yang mungkin.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'Two heads: $\\frac{1}{2}\\times\\frac{1}{2}=\\frac{1}{4}$. The expected value of a fair die is 3.5, which is not a face of the die.',
            'Dua gambar: $\\frac{1}{2}\\times\\frac{1}{2}=\\frac{1}{4}$. Nilai harapan dadu setimbang adalah 3,5, yang bukan mata dadu.',
          ),
          hint: L(
            'For two independent flips, multiply the two probabilities.',
            'Untuk dua lemparan yang saling bebas, kalikan kedua peluangnya.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'One card is drawn at random from a standard deck of 52 cards. $P(\\text{heart or king})=\\frac{a}{b}$ in lowest terms. Find $a$ and $b$.',
            'Satu kartu diambil secara acak dari satu set 52 kartu. $P(\\text{hati atau raja})=\\frac{a}{b}$ dalam bentuk paling sederhana. Tentukan $a$ dan $b$.',
          ),
          inline: true,
          blanks: [
            { label: 'a =', answer: 4 },
            { label: 'b =', answer: 13 },
          ],
          hints: [
            L('Use $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$. How many cards are both a heart and a king?', 'Pakai $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$. Berapa kartu yang sekaligus hati dan raja?'),
            L('13 hearts, 4 kings, and 1 card (the king of hearts) is in both.', '13 hati, 4 raja, dan 1 kartu (raja hati) ada pada keduanya.'),
            L('$\\frac{13+4-1}{52}=\\frac{16}{52}$. Simplify by 4.', '$\\frac{13+4-1}{52}=\\frac{16}{52}$. Sederhanakan dengan 4.'),
          ],
          explain: L(
            '$\\frac{16}{52}=\\frac{4}{13}$, so $a=4$ and $b=13$.',
            '$\\frac{16}{52}=\\frac{4}{13}$, jadi $a=4$ dan $b=13$.',
          ),
          solution: ['\\frac{13}{52}+\\frac{4}{52}-\\frac{1}{52}=\\frac{16}{52}', '=\\frac{4}{13}'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m9-s2-p',
    runtime: 'math',
    title: L('Counting and Probability at Work', 'Pencacahan dan Peluang dalam Pemakaian'),
    brief: L(
      'Count arrangements and selections, and find probabilities and an expected value.',
      'Cacah susunan dan pilihan, dan cari peluang dan nilai harapan.',
    ),
    requirements: [
      L('Choose between permutations and combinations.', 'Memilih antara permutasi dan kombinasi.'),
      L('Find probabilities of combined events and an expected value.', 'Mencari peluang kejadian gabungan dan nilai harapan.'),
    ],
    hints: [
      L('If the order matters, use a permutation; if not, a combination.', 'Jika urutan berpengaruh, pakai permutasi; jika tidak, kombinasi.'),
      L('Without replacement, the second probability changes.', 'Tanpa pengembalian, peluang kedua berubah.'),
      L('Expected value: multiply each value by its probability and add.', 'Nilai harapan: kalikan tiap nilai dengan peluangnya lalu jumlahkan.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'How many different arrangements are there of the letters of the word LEVEL?',
          'Ada berapa susunan berbeda dari huruf-huruf pada kata LEVEL?',
        ),
        blanks: [{ answer: 30 }],
        solution: ['\\frac{5!}{2!\\,2!}=\\frac{120}{4}=30'],
      },
      {
        prompt: L(
          'A team of 3 players is chosen from 8. How many different teams are possible?',
          'Sebuah tim 3 pemain dipilih dari 8. Ada berapa tim berbeda yang mungkin?',
        ),
        blanks: [{ answer: 56 }],
        solution: ['C(8,3)=\\frac{8\\times7\\times6}{3\\times2\\times1}=56'],
      },
      {
        prompt: L(
          'Two fair dice are rolled. Of the 36 equally likely outcomes, $a$ have a sum of 8, so $P(\\text{sum}=8)=\\frac{a}{36}$. Find $a$.',
          'Dua dadu setimbang dilempar. Dari 36 hasil yang sama mungkinnya, $a$ hasil berjumlah 8, sehingga $P(\\text{jumlah}=8)=\\frac{a}{36}$. Tentukan $a$.',
        ),
        figure: {
          ...gridRect({ cols: 6, rows: 6, shade: 5, dims: ['6', '6'] }),
          caption: L('The 36 outcomes; 5 of them (coloured) give a sum of 8.', '36 hasil; 5 di antaranya (berwarna) berjumlah 8.'),
        },
        blanks: [{ label: 'a =', answer: 5 }],
        solution: ['(2,6),(3,5),(4,4),(5,3),(6,2)', 'a=5'],
      },
      {
        prompt: L(
          'A bag has 4 red and 6 blue balls. Two balls are taken without replacement. $P(\\text{both red})=\\frac{a}{b}$ in lowest terms. Find $a$ and $b$.',
          'Sebuah kantong berisi 4 bola merah dan 6 bola biru. Dua bola diambil tanpa pengembalian. $P(\\text{keduanya merah})=\\frac{a}{b}$ dalam bentuk paling sederhana. Tentukan $a$ dan $b$.',
        ),
        inline: true,
        blanks: [
          { label: 'a =', answer: 2 },
          { label: 'b =', answer: 15 },
        ],
        solution: ['\\frac{4}{10}\\times\\frac{3}{9}=\\frac{12}{90}', '=\\frac{2}{15}'],
      },
      {
        prompt: L(
          'A game: flip two fair coins. If both land heads you win Rp10,000; otherwise you lose Rp2,000. What is the expected result per game, in thousands of rupiah?',
          'Sebuah permainan: lempar dua koin setimbang. Jika keduanya gambar kamu menang Rp10.000; jika tidak kamu kalah Rp2.000. Berapa hasil yang diharapkan per permainan, dalam ribuan rupiah?',
        ),
        blanks: [{ answer: 1 }],
        solution: ['E=10\\times\\frac{1}{4}+(-2)\\times\\frac{3}{4}', '=\\frac{10-6}{4}=1'],
      },
    ],
  },
}
