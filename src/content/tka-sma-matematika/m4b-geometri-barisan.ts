import type { Submodule } from '../types'
import { L, barChart } from './figs'
import { lessonGrowth } from './m4c-pertumbuhan'

/** Module 4, submodule 2 — geometric sequences and series, finite and infinite. */

const bars = (values: number[], max: number, step: number, showValues = true) =>
  barChart({
    bars: values.map((v, i) => ({ label: String(i + 1), value: v, color: (['a', 'b', 'c', 'result'] as const)[i % 4] })),
    max,
    step,
    showValues,
  })

export const m4s2: Submodule = {
  id: 'tka-sma-m4-s2',
  title: L('Geometric Sequences and Series', 'Barisan dan Deret Geometri'),
  summary: L(
    'Find terms of a geometric sequence, add finitely many terms, and add infinitely many terms when the ratio is small.',
    'Mencari suku barisan geometri, menjumlahkan sejumlah suku berhingga, dan menjumlahkan tak hingga suku bila rasionya kecil.',
  ),
  lessons: [
    /* -------------------------------------------------------- L1 sequences */
    {
      id: 'tka-sma-m4-s2-l1',
      title: L('Geometric Sequences', 'Barisan Geometri'),
      goal: L(
        'You can recognise a geometric sequence, find its common ratio and any term, and tell it apart from an arithmetic sequence.',
        'Kamu bisa mengenali barisan geometri, mencari rasionya dan suku mana pun, dan membedakannya dari barisan aritmetika.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Always Multiplying by the Same Number', 'Ayo Amati: Selalu Mengalikan dengan Bilangan yang Sama'),
          body: L(
            'A rumour is told to 2 people. Each of them tells it to 3 new people each hour: the numbers of new listeners are 2, 6, 18, 54, $\\ldots$ Each term is the one before **times the same number**, the **common ratio** $r$. This is a **geometric sequence**.\n\n- $r=\\frac{U_{n+1}}{U_n}=\\frac{6}{2}=3$, and the first term is $a=2$.\n- $U_2=ar$, $U_3=ar^2$: the $n$th term multiplies by $r$ a total of $n-1$ times.\n\n$$U_n=a\\,r^{\\,n-1}$$\n\nSo $U_6=2\\times3^5=486$. The bars grow faster and faster, because each bar is a multiple of the last, not an addition.',
            'Sebuah kabar disampaikan kepada 2 orang. Setiap orang menyampaikannya kepada 3 orang baru setiap jam: banyak pendengar baru adalah 2, 6, 18, 54, $\\ldots$ Tiap suku adalah suku sebelumnya **dikali bilangan yang sama**, yaitu **rasio** $r$. Ini **barisan geometri**.\n\n- $r=\\frac{U_{n+1}}{U_n}=\\frac{6}{2}=3$, dan suku pertamanya $a=2$.\n- $U_2=ar$, $U_3=ar^2$: suku ke-$n$ dikalikan $r$ sebanyak $n-1$ kali.\n\n$$U_n=a\\,r^{\\,n-1}$$\n\nJadi $U_6=2\\times3^5=486$. Batang-batangnya tumbuh makin cepat, karena tiap batang adalah kelipatan batang sebelumnya, bukan penambahan.',
          ),
          figure: {
            ...bars([2, 6, 18, 54], 54, 18),
            caption: L('The terms 2, 6, 18, 54: each is 3 times the one before.', 'Suku 2, 6, 18, 54: masing-masing 3 kali suku sebelumnya.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Finding Terms and the Ratio', 'Contoh Bertahap: Mencari Suku dan Rasio'),
          body: L(
            'A geometric sequence has $U_3=12$ and $U_6=96$. Find $U_8$.\n\n1. Step 1: $U_6$ is three steps after $U_3$, so $U_6=U_3\\cdot r^3$: $96=12r^3$.\n2. Step 2: $r^3=8$, so $r=2$.\n3. Step 3: $a=\\frac{12}{2^2}=3$.\n4. Step 4: $U_8=3\\times2^7=384$.\n\nThe **middle term** of three consecutive terms $x,y,z$ satisfies $y^2=xz$. To put one positive number between 4 and 36 in a geometric sequence: $y^2=4\\times36=144$, so $y=12$ and the sequence is $4,12,36$ with $r=3$.',
            'Sebuah barisan geometri punya $U_3=12$ dan $U_6=96$. Cari $U_8$.\n\n1. Langkah 1: $U_6$ berjarak tiga langkah dari $U_3$, jadi $U_6=U_3\\cdot r^3$: $96=12r^3$.\n2. Langkah 2: $r^3=8$, jadi $r=2$.\n3. Langkah 3: $a=\\frac{12}{2^2}=3$.\n4. Langkah 4: $U_8=3\\times2^7=384$.\n\n**Suku tengah** dari tiga suku berurutan $x,y,z$ memenuhi $y^2=xz$. Untuk menyisipkan satu bilangan positif di antara 4 dan 36 dalam barisan geometri: $y^2=4\\times36=144$, jadi $y=12$ dan barisannya $4,12,36$ dengan $r=3$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Add or Multiply?', 'Awas, Jebakan!: Menambah atau Mengalikan?'),
          body: L(
            'Always ask: do I **add** the same number (arithmetic) or **multiply** by the same number (geometric)?\n\n| Sequence | Test | Type |\n|---|---|---|\n| $5,10,20,40$ | ratios $2,2,2$ | geometric, $r=2$ |\n| $1,3,5,7$ | differences $2,2,2$ | arithmetic |\n| $16,-8,4,-2$ | ratios $-\\frac{1}{2}$ each | geometric, $r=-\\frac{1}{2}$ |\n| $1,4,9,16$ | neither | neither |\n\n- With $r>1$ and $a>0$ the terms grow. With $0<r<1$ they shrink towards 0. With $r<0$ the signs alternate.\n- The formula has $r^{\\,n-1}$, **not** $r^{\\,n}$: the first term is $a$, not $ar$.',
            'Selalu tanyakan: apakah aku **menambah** bilangan yang sama (aritmetika) atau **mengalikan** dengan bilangan yang sama (geometri)?\n\n| Barisan | Uji | Jenis |\n|---|---|---|\n| $5,10,20,40$ | rasio $2,2,2$ | geometri, $r=2$ |\n| $1,3,5,7$ | beda $2,2,2$ | aritmetika |\n| $16,-8,4,-2$ | rasio $-\\frac{1}{2}$ setiap kali | geometri, $r=-\\frac{1}{2}$ |\n| $1,4,9,16$ | bukan keduanya | bukan keduanya |\n\n- Dengan $r>1$ dan $a>0$ suku-sukunya membesar. Dengan $0<r<1$ suku-sukunya mengecil menuju 0. Dengan $r<0$ tandanya berganti-ganti.\n- Rumusnya memuat $r^{\\,n-1}$, **bukan** $r^{\\,n}$: suku pertama adalah $a$, bukan $ar$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The bars show four terms of a geometric sequence. What is the next term?',
            'Batang-batang menunjukkan empat suku barisan geometri. Berapa suku berikutnya?',
          ),
          figure: {
            ...bars([2, 6, 18, 54], 54, 18),
            caption: L('Four terms: 2, 6, 18, 54.', 'Empat suku: 2, 6, 18, 54.'),
          },
          options: [L('162', '162'), L('108', '108'), L('90', '90'), L('72', '72')],
          answer: 0,
          explain: L(
            'The ratio is $\\frac{6}{2}=\\frac{18}{6}=\\frac{54}{18}=3$, so the next term is $54\\times3=162$. Adding 36 (the last difference) is the arithmetic habit and gives 90.',
            'Rasionya $\\frac{6}{2}=\\frac{18}{6}=\\frac{54}{18}=3$, jadi suku berikutnya $54\\times3=162$. Menambah 36 (beda terakhir) adalah kebiasaan aritmetika dan memberi 90.',
          ),
          hint: L(
            'Divide each term by the one before it. Is the answer always the same?',
            'Bagi tiap suku dengan suku sebelumnya. Apakah hasilnya selalu sama?',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: find the ratio and the 6th term of $2,6,18,\\ldots$',
            'Coba bersama: cari rasio dan suku ke-6 dari $2,6,18,\\ldots$',
          ),
          template: 'r=\\frac{6}{2}=___ \\quad U_6=2\\cdot3^{___}=___',
          blanks: ['3', '5', '486'],
          explain: L(
            '$r=3$, and the 6th term has 5 multiplications: $U_6=2\\cdot3^5=2\\cdot243=486$.',
            '$r=3$, dan suku ke-6 mengalami 5 perkalian: $U_6=2\\cdot3^5=2\\cdot243=486$.',
          ),
          hint: L(
            'For the exponent, count the steps from the first term to the 6th.',
            'Untuk eksponen, hitung langkah dari suku pertama sampai suku ke-6.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO geometric sequences.', 'Pilih DUA barisan geometri.'),
          options: [L('$3,6,12,24$', '$3,6,12,24$'), L('$81,27,9,3$', '$81,27,9,3$'), L('$2,4,6,8$', '$2,4,6,8$'), L('$1,4,9,16$', '$1,4,9,16$')],
          answer: [0, 1],
          explain: L(
            'The ratios are all 2 and all $\\frac{1}{3}$. The sequence $2,4,6,8$ is arithmetic (add 2), and $1,4,9,16$ are squares, which are neither.',
            'Rasionya semua 2 dan semua $\\frac{1}{3}$. Barisan $2,4,6,8$ aritmetika (tambah 2), dan $1,4,9,16$ adalah kuadrat, yang bukan keduanya.',
          ),
          hint: L(
            'Divide each term by the one before it and check that the answer does not change.',
            'Bagi tiap suku dengan suku sebelumnya dan periksa bahwa hasilnya tidak berubah.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$5,10,20,40$ has common ratio 2.', '$5,10,20,40$ punya rasio 2.'),
            L('A geometric sequence cannot have negative terms.', 'Barisan geometri tidak boleh punya suku negatif.'),
            L('If $0<r<1$ and $a>0$, the terms get smaller.', 'Jika $0<r<1$ dan $a>0$, suku-sukunya mengecil.'),
            L('$1,3,5,7$ is a geometric sequence.', '$1,3,5,7$ adalah barisan geometri.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            '$16,-8,4,-2$ is geometric with $r=-\\frac{1}{2}$, so negative terms are allowed. $1,3,5,7$ adds 2 each time, so it is arithmetic.',
            '$16,-8,4,-2$ geometri dengan $r=-\\frac{1}{2}$, jadi suku negatif diperbolehkan. $1,3,5,7$ menambah 2 setiap kali, jadi aritmetika.',
          ),
          hint: L(
            'Try $r=-\\frac{1}{2}$ with $a=16$ for the second statement.',
            'Coba $r=-\\frac{1}{2}$ dengan $a=16$ untuk pernyataan kedua.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A geometric sequence has $U_2=6$ and $U_5=162$. Find $U_7$.',
            'Sebuah barisan geometri punya $U_2=6$ dan $U_5=162$. Tentukan $U_7$.',
          ),
          blanks: [{ label: 'U_7 =', answer: 1458 }],
          hints: [
            L('$U_5$ is three steps after $U_2$, so $U_5=U_2\\cdot r^3$.', '$U_5$ berjarak tiga langkah dari $U_2$, jadi $U_5=U_2\\cdot r^3$.'),
            L('$162=6r^3$ gives $r^3=27$, so $r=3$.', '$162=6r^3$ memberi $r^3=27$, jadi $r=3$.'),
            L('From $U_5$, two more steps: $U_7=U_5\\cdot r^2$.', 'Dari $U_5$, dua langkah lagi: $U_7=U_5\\cdot r^2$.'),
          ],
          explain: L(
            '$r=3$, so $U_7=162\\times3^2=162\\times9=1\\,458$.',
            '$r=3$, jadi $U_7=162\\times3^2=162\\times9=1\\,458$.',
          ),
          solution: ['162=6r^3 \\Rightarrow r^3=27 \\Rightarrow r=3', 'U_7=162\\times3^2', '=1\\,458'],
        },
      ],
    },
    /* ------------------------------------------------------------ L2 series */
    {
      id: 'tka-sma-m4-s2-l2',
      title: L('Geometric Series', 'Deret Geometri'),
      goal: L(
        'You can add the first $n$ terms of a geometric sequence, and the whole infinite series when $|r|<1$.',
        'Kamu bisa menjumlahkan $n$ suku pertama barisan geometri, dan seluruh deret tak hingga bila $|r|<1$.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Sum That Cancels', 'Ayo Amati: Jumlah yang Saling Menghapus'),
          body: L(
            'Add $S=2+6+18+54+162$ with $r=3$. Multiply the whole sum by $r$:\n\n$$3S=6+18+54+162+486$$\n\nSubtract: nearly everything cancels, and $3S-S=486-2$. So $2S=484$ and $S=242$.\n\nThe same trick works every time and gives the formula for the **sum of the first $n$ terms** of a geometric sequence:\n\n$$S_n=\\frac{a\\,(r^{n}-1)}{r-1}\\qquad(r\\neq1)$$\n\nHere $S_5=\\frac{2(3^5-1)}{3-1}=\\frac{2\\times242}{2}=242$. If $r<1$, the form $S_n=\\frac{a(1-r^n)}{1-r}$ avoids negative signs.',
            'Jumlahkan $S=2+6+18+54+162$ dengan $r=3$. Kalikan seluruh jumlah dengan $r$:\n\n$$3S=6+18+54+162+486$$\n\nKurangkan: hampir semuanya saling menghapus, dan $3S-S=486-2$. Jadi $2S=484$ dan $S=242$.\n\nTrik yang sama selalu berhasil dan memberi rumus **jumlah $n$ suku pertama** barisan geometri:\n\n$$S_n=\\frac{a\\,(r^{n}-1)}{r-1}\\qquad(r\\neq1)$$\n\nDi sini $S_5=\\frac{2(3^5-1)}{3-1}=\\frac{2\\times242}{2}=242$. Jika $r<1$, bentuk $S_n=\\frac{a(1-r^n)}{1-r}$ menghindari tanda negatif.',
          ),
          figure: {
            ...bars([2, 6, 18, 54, 162], 162, 54),
            caption: L('The five terms to be added.', 'Lima suku yang akan dijumlahkan.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Adding Forever', 'Contoh Bertahap: Menjumlahkan Tanpa Henti'),
          body: L(
            'Add $8+4+2+1+\\frac{1}{2}+\\cdots$ with no end. Here $r=\\frac{1}{2}$, and each bar is half the one before.\n\n1. Step 1: The partial sums are $8,12,14,15,15.5,\\ldots$ They creep up towards a limit.\n2. Step 2: When $|r|<1$, $r^n\\to0$ as $n$ grows, so $S_n=\\frac{a(1-r^n)}{1-r}$ tends to $\\frac{a}{1-r}$.\n3. Step 3: $S_\\infty=\\frac{8}{1-\\frac{1}{2}}=16$.\n\n$$S_\\infty=\\frac{a}{1-r}\\qquad\\text{only if }|r|<1$$\n\nIf $|r|\\ge1$ the terms do not shrink, so the sum grows without limit (or jumps about) and there is **no** sum to infinity.',
            'Jumlahkan $8+4+2+1+\\frac{1}{2}+\\cdots$ tanpa akhir. Di sini $r=\\frac{1}{2}$, dan tiap batang setengah batang sebelumnya.\n\n1. Langkah 1: Jumlah sebagiannya $8,12,14,15,15{,}5,\\ldots$ Jumlah itu merayap mendekati suatu batas.\n2. Langkah 2: Bila $|r|<1$, $r^n\\to0$ saat $n$ membesar, sehingga $S_n=\\frac{a(1-r^n)}{1-r}$ mendekati $\\frac{a}{1-r}$.\n3. Langkah 3: $S_\\infty=\\frac{8}{1-\\frac{1}{2}}=16$.\n\n$$S_\\infty=\\frac{a}{1-r}\\qquad\\text{hanya jika }|r|<1$$\n\nJika $|r|\\ge1$ suku-sukunya tidak mengecil, sehingga jumlahnya membesar tanpa batas (atau melompat-lompat) dan **tidak ada** jumlah tak hingga.',
          ),
          figure: {
            ...bars([8, 4, 2, 1], 8, 2),
            caption: L('The terms 8, 4, 2, 1, … each half the one before.', 'Suku 8, 4, 2, 1, … masing-masing setengah suku sebelumnya.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: The Bouncing Ball', 'Contoh Bertahap: Bola yang Memantul'),
          body: L(
            'A ball is dropped from 8 m. After each bounce it rises to $\\frac{1}{2}$ of the previous height. What total distance does it travel before it stops?\n\n1. Step 1: The first fall is 8 m.\n2. Step 2: After that, each rebound height is travelled **twice** (up and down): $2\\left(4+2+1+\\cdots\\right)$.\n3. Step 3: $4+2+1+\\cdots=\\frac{4}{1-\\frac{1}{2}}=8$.\n4. Step 4: Total: $8+2\\times8=24$ m.\n\n**Repeating decimals** are infinite geometric series too: $0.\\overline{3}=0.3+0.03+0.003+\\cdots=\\frac{0.3}{1-0.1}=\\frac{1}{3}$.\n\n**Watch out:** do not forget the first fall, which is travelled only once.',
            'Sebuah bola dijatuhkan dari ketinggian 8 m. Setelah tiap pantulan, bola naik setinggi $\\frac{1}{2}$ tinggi sebelumnya. Berapa jarak total yang ditempuh sebelum bola berhenti?\n\n1. Langkah 1: Jatuh pertama 8 m.\n2. Langkah 2: Setelah itu, setiap tinggi pantulan ditempuh **dua kali** (naik dan turun): $2\\left(4+2+1+\\cdots\\right)$.\n3. Langkah 3: $4+2+1+\\cdots=\\frac{4}{1-\\frac{1}{2}}=8$.\n4. Langkah 4: Total: $8+2\\times8=24$ m.\n\n**Desimal berulang** juga deret geometri tak hingga: $0{,}\\overline{3}=0{,}3+0{,}03+0{,}003+\\cdots=\\frac{0{,}3}{1-0{,}1}=\\frac{1}{3}$.\n\n**Awas:** jangan lupa jatuh pertama, yang hanya ditempuh sekali.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The bars show the first terms of an infinite geometric series. What is the sum of the whole series?',
            'Batang-batang menunjukkan suku-suku pertama deret geometri tak hingga. Berapa jumlah seluruh deret itu?',
          ),
          figure: {
            ...bars([8, 4, 2, 1], 8, 2, false),
            caption: L('Each bar is half of the one before, and the bars go on for ever.', 'Tiap batang setengah batang sebelumnya, dan batang-batang itu berlanjut tanpa akhir.'),
          },
          options: [L('16', '16'), L('15', '15'), L('32', '32'), L('It has no sum.', 'Tidak punya jumlah.')],
          answer: 0,
          explain: L(
            '$a=8$ and $r=\\frac{1}{2}$ with $|r|<1$, so $S_\\infty=\\frac{8}{1-\\frac{1}{2}}=16$. Adding only the four bars shown gives 15, but there are more.',
            '$a=8$ dan $r=\\frac{1}{2}$ dengan $|r|<1$, jadi $S_\\infty=\\frac{8}{1-\\frac{1}{2}}=16$. Menjumlahkan hanya empat batang yang tampak memberi 15, tetapi masih ada yang lain.',
          ),
          hint: L(
            'Find the first term and the ratio, and check that the ratio is between $-1$ and 1.',
            'Cari suku pertama dan rasio, dan periksa bahwa rasionya di antara $-1$ dan 1.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the sum of the first 5 terms of $2,6,18,\\ldots$',
            'Coba bersama: jumlah 5 suku pertama dari $2,6,18,\\ldots$',
          ),
          template: 'S_5=\\frac{2(3^5-1)}{3-1}=\\frac{2\\times___}{2}=___',
          blanks: ['242', '242'],
          explain: L(
            '$3^5=243$, so $3^5-1=242$. Then $\\frac{2\\times242}{2}=242$.',
            '$3^5=243$, jadi $3^5-1=242$. Lalu $\\frac{2\\times242}{2}=242$.',
          ),
          hint: L(
            'Work out $3^5$ first, then subtract 1.',
            'Hitung $3^5$ dulu, lalu kurangi 1.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO infinite series that have a sum.', 'Pilih DUA deret tak hingga yang punya jumlah.'),
          options: [
            L('$12+6+3+\\cdots$', '$12+6+3+\\cdots$'),
            L('$1-\\frac{1}{3}+\\frac{1}{9}-\\cdots$', '$1-\\frac{1}{3}+\\frac{1}{9}-\\cdots$'),
            L('$2+4+8+16+\\cdots$', '$2+4+8+16+\\cdots$'),
            L('$5+5+5+5+\\cdots$', '$5+5+5+5+\\cdots$'),
          ],
          answer: [0, 1],
          explain: L(
            'The first has $r=\\frac{1}{2}$ and the second $r=-\\frac{1}{3}$, both with $|r|<1$. The third has $r=2$ and the fourth $r=1$, so their terms never shrink.',
            'Yang pertama punya $r=\\frac{1}{2}$ dan yang kedua $r=-\\frac{1}{3}$, keduanya dengan $|r|<1$. Yang ketiga punya $r=2$ dan yang keempat $r=1$, jadi suku-sukunya tidak pernah mengecil.',
          ),
          hint: L(
            'Find $r$ for each series and compare $|r|$ with 1.',
            'Cari $r$ untuk tiap deret dan bandingkan $|r|$ dengan 1.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('An infinite geometric series with $r=2$ has a finite sum.', 'Deret geometri tak hingga dengan $r=2$ punya jumlah berhingga.'),
            L('$0.\\overline{3}=0.3+0.03+0.003+\\cdots=\\frac{1}{3}$.', '$0{,}\\overline{3}=0{,}3+0{,}03+0{,}003+\\cdots=\\frac{1}{3}$.'),
            L('The sum of $8+4+2+\\cdots$ to infinity is 16.', 'Jumlah $8+4+2+\\cdots$ sampai tak hingga adalah 16.'),
            L('$S_\\infty$ exists whenever $|r|\\ge1$.', '$S_\\infty$ ada setiap kali $|r|\\ge1$.'),
          ],
          answer: [false, true, true, false],
          explain: L(
            'With $r=2$ the terms grow, so the sum has no limit. The decimal has $a=0.3$ and $r=0.1$, giving $\\frac{0.3}{0.9}=\\frac{1}{3}$. And $S_\\infty$ exists only when $|r|<1$, the opposite of the last statement.',
            'Dengan $r=2$ suku-sukunya membesar, jadi jumlahnya tak berbatas. Desimal itu punya $a=0{,}3$ dan $r=0{,}1$, memberi $\\frac{0{,}3}{0{,}9}=\\frac{1}{3}$. Dan $S_\\infty$ ada hanya bila $|r|<1$, kebalikan dari pernyataan terakhir.',
          ),
          hint: L(
            'A sum to infinity needs the terms to shrink: what does that say about $|r|$?',
            'Jumlah tak hingga memerlukan suku yang mengecil: apa artinya bagi $|r|$?',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A ball is dropped from 8 m and bounces back to half of its previous height each time. What total distance, in metres, does it travel before it comes to rest?',
            'Sebuah bola dijatuhkan dari 8 m dan memantul setengah tinggi sebelumnya setiap kali. Berapa jarak total, dalam meter, yang ditempuh bola sebelum berhenti?',
          ),
          blanks: [{ answer: 24, after: '\\text{m}' }],
          hints: [
            L('The first fall is 8 m. After that, every rebound height is travelled up and down.', 'Jatuh pertama 8 m. Setelahnya, setiap tinggi pantulan ditempuh naik dan turun.'),
            L('The rebound heights are $4,2,1,\\ldots$: a geometric series with $a=4$, $r=\\frac{1}{2}$. Its sum is $\\frac{4}{1-\\frac{1}{2}}$.', 'Tinggi pantulannya $4,2,1,\\ldots$: deret geometri dengan $a=4$, $r=\\frac{1}{2}$. Jumlahnya $\\frac{4}{1-\\frac{1}{2}}$.'),
            L('The sum is 8. Double it, then add the first fall.', 'Jumlahnya 8. Gandakan, lalu tambahkan jatuh pertama.'),
          ],
          explain: L(
            '$4+2+1+\\cdots=8$, travelled twice gives 16, and with the first fall of 8 m the total is $8+16=24$ m.',
            '$4+2+1+\\cdots=8$, ditempuh dua kali menjadi 16, dan dengan jatuh pertama 8 m totalnya $8+16=24$ m.',
          ),
          solution: ['4+2+1+\\cdots=\\frac{4}{1-\\frac{1}{2}}=8', '8+2\\times8', '=24'],
        },
      ],
    },
    lessonGrowth,
  ],
  project: {
    id: 'tka-sma-m4-s2-p',
    runtime: 'math',
    title: L('Geometric Patterns', 'Pola Geometri'),
    brief: L(
      'Find terms, sums and sums to infinity of geometric sequences, including a bouncing ball.',
      'Cari suku, jumlah, dan jumlah tak hingga barisan geometri, termasuk bola yang memantul.',
    ),
    requirements: [
      L('Use $U_n=ar^{n-1}$ and the sum formulas.', 'Memakai $U_n=ar^{n-1}$ dan rumus-rumus jumlah.'),
      L('Decide when a sum to infinity exists.', 'Menentukan kapan jumlah tak hingga ada.'),
    ],
    hints: [
      L('Divide terms to find $r$, using $U_m=U_k\\cdot r^{m-k}$.', 'Bagi suku-suku untuk mencari $r$, memakai $U_m=U_k\\cdot r^{m-k}$.'),
      L('Three numbers $x,y,z$ in a geometric sequence satisfy $y^2=xz$.', 'Tiga bilangan $x,y,z$ dalam barisan geometri memenuhi $y^2=xz$.'),
      L('$S_\\infty=\\frac{a}{1-r}$ only when $|r|<1$.', '$S_\\infty=\\frac{a}{1-r}$ hanya bila $|r|<1$.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'A geometric sequence has $U_3=12$ and $U_6=96$. Find $U_8$.',
          'Sebuah barisan geometri punya $U_3=12$ dan $U_6=96$. Tentukan $U_8$.',
        ),
        blanks: [{ label: 'U_8 =', answer: 384 }],
        solution: ['96=12r^3 \\Rightarrow r=2 \\quad a=\\frac{12}{4}=3', 'U_8=3\\times2^7=384'],
      },
      {
        prompt: L(
          'What positive number $y$ makes $4,y,36$ a geometric sequence?',
          'Bilangan positif $y$ berapa yang membuat $4,y,36$ barisan geometri?',
        ),
        blanks: [{ label: 'y =', answer: 12 }],
        solution: ['y^2=4\\times36=144', 'y=12'],
      },
      {
        prompt: L(
          'Find the sum of the first 6 terms of $3,6,12,\\ldots$',
          'Cari jumlah 6 suku pertama dari $3,6,12,\\ldots$',
        ),
        blanks: [{ label: 'S_6 =', answer: 189 }],
        solution: ['S_6=\\frac{3(2^6-1)}{2-1}', '=3\\times63=189'],
      },
      {
        prompt: L(
          'Find the sum to infinity of $18+6+2+\\cdots$',
          'Cari jumlah tak hingga dari $18+6+2+\\cdots$',
        ),
        blanks: [{ label: 'S_\\infty =', answer: 27 }],
        solution: ['r=\\frac{6}{18}=\\frac{1}{3}', 'S_\\infty=\\frac{18}{1-\\frac{1}{3}}=27'],
      },
      {
        prompt: L(
          'A ball is dropped from 10 m and rebounds to $\\frac{3}{5}$ of its previous height each time. What total distance, in metres, does it travel before it stops?',
          'Sebuah bola dijatuhkan dari 10 m dan memantul setinggi $\\frac{3}{5}$ tinggi sebelumnya setiap kali. Berapa jarak total, dalam meter, yang ditempuh sebelum berhenti?',
        ),
        blanks: [{ answer: 40, after: '\\text{m}' }],
        solution: {
          en: ['\\text{rebounds: } 6+3.6+\\cdots=\\frac{6}{1-0.6}=15', '10+2\\times15=40'],
          id: ['\\text{pantulan: } 6+3{,}6+\\cdots=\\frac{6}{1-0{,}6}=15', '10+2\\times15=40'],
        },
      },
      {
        prompt: L(
          'A town has 5 000 residents and grows by 20% every year. How many residents will it have after 3 years?',
          'Sebuah kota berpenduduk 5.000 orang dan tumbuh 20% setiap tahun. Berapa penduduknya setelah 3 tahun?',
        ),
        blanks: [{ answer: 8640 }],
        solution: {
          en: ['5\\,000\\times1.2^3=5\\,000\\times1.728', '=8\\,640'],
          id: ['5\\,000\\times1{,}2^3=5\\,000\\times1{,}728', '=8\\,640'],
        },
      },
    ],
  },
}
