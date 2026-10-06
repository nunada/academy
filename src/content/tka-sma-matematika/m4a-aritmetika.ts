import type { Submodule } from '../types'
import { L, barChart } from './figs'

/** Module 4, submodule 1 — arithmetic sequences and series. */

const terms = (values: number[], max: number, step: number, showValues = true) =>
  barChart({
    bars: values.map((v, i) => ({ label: String(i + 1), value: v, color: (['a', 'b', 'c', 'result'] as const)[i % 4] })),
    max,
    step,
    showValues,
  })

export const m4s1: Submodule = {
  id: 'tka-sma-m4-s1',
  title: L('Arithmetic Sequences and Series', 'Barisan dan Deret Aritmetika'),
  summary: L(
    'Find any term of an arithmetic sequence, and the sum of the first terms of an arithmetic series.',
    'Mencari suku mana pun dari barisan aritmetika, dan jumlah beberapa suku pertama deret aritmetika.',
  ),
  lessons: [
    /* -------------------------------------------------------- L1 sequences */
    {
      id: 'tka-sma-m4-s1-l1',
      title: L('Arithmetic Sequences', 'Barisan Aritmetika'),
      goal: L(
        'You can recognise an arithmetic sequence, find its common difference and any term, and find how many terms reach a value.',
        'Kamu bisa mengenali barisan aritmetika, mencari bedanya dan suku mana pun, dan mencari banyak suku untuk mencapai suatu nilai.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Always Adding the Same Amount', 'Ayo Amati: Selalu Menambah Jumlah yang Sama'),
          body: L(
            'A pile of tiles has 3 tiles in the first row, and every next row has 4 more: 3, 7, 11, 15, 19, $\\ldots$ This is an **arithmetic sequence**: each term is the one before **plus the same number**, the **common difference** $b$.\n\n- First term $a=U_1=3$ and difference $b=4$.\n- $U_2=a+b$, $U_3=a+2b$, $U_4=a+3b$: the $n$th term takes $n-1$ steps from the first.\n\n$$U_n=a+(n-1)b$$\n\nHere $U_n=3+4(n-1)=4n-1$. The bars rise by the same height each time.',
            'Setumpuk ubin punya 3 ubin pada baris pertama, dan setiap baris berikutnya 4 lebih banyak: 3, 7, 11, 15, 19, $\\ldots$ Ini **barisan aritmetika**: tiap suku adalah suku sebelumnya **ditambah bilangan yang sama**, yaitu **beda** $b$.\n\n- Suku pertama $a=U_1=3$ dan beda $b=4$.\n- $U_2=a+b$, $U_3=a+2b$, $U_4=a+3b$: suku ke-$n$ membutuhkan $n-1$ langkah dari suku pertama.\n\n$$U_n=a+(n-1)b$$\n\nDi sini $U_n=3+4(n-1)=4n-1$. Batang-batangnya naik setinggi yang sama setiap kali.',
          ),
          figure: {
            ...terms([3, 7, 11, 15, 19], 20, 5),
            caption: L('The first five terms: each bar is 4 taller.', 'Lima suku pertama: tiap batang 4 lebih tinggi.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Finding $a$ and $b$', 'Contoh Bertahap: Mencari $a$ dan $b$'),
          body: L(
            'An arithmetic sequence has $U_3=11$ and $U_7=27$. Find $U_{20}$.\n\n1. Step 1: Write the two terms: $a+2b=11$ and $a+6b=27$.\n2. Step 2: Subtract: $4b=16$, so $b=4$.\n3. Step 3: Then $a=11-2(4)=3$.\n4. Step 4: $U_{20}=3+19\\times4=79$.\n\nTo find **how many terms** reach a value, solve for $n$. When is $U_n=99$ for $U_n=4n-1$? $4n-1=99$ gives $n=25$.\n\nTo **insert** three terms between 5 and 25: there are 4 steps from 5 to 25, so $b=\\frac{25-5}{4}=5$ and the sequence is $5,10,15,20,25$.',
            'Sebuah barisan aritmetika punya $U_3=11$ dan $U_7=27$. Cari $U_{20}$.\n\n1. Langkah 1: Tulis kedua suku: $a+2b=11$ dan $a+6b=27$.\n2. Langkah 2: Kurangkan: $4b=16$, jadi $b=4$.\n3. Langkah 3: Maka $a=11-2(4)=3$.\n4. Langkah 4: $U_{20}=3+19\\times4=79$.\n\nUntuk mencari **banyak suku** yang mencapai suatu nilai, selesaikan untuk $n$. Kapan $U_n=99$ untuk $U_n=4n-1$? $4n-1=99$ memberi $n=25$.\n\nUntuk **menyisipkan** tiga suku di antara 5 dan 25: ada 4 langkah dari 5 ke 25, jadi $b=\\frac{25-5}{4}=5$ dan barisannya $5,10,15,20,25$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Watch Out!: Is It Really Arithmetic?', 'Awas, Jebakan!: Benarkah Aritmetika?'),
          body: L(
            'Check **all** the differences, not just the first.\n\n| Sequence | Differences | Arithmetic? |\n|---|---|---|\n| $4,9,14,19$ | $5,5,5$ | yes, $b=5$ |\n| $2,5,9,14$ | $3,4,5$ | **no** |\n| $10,7,4,1$ | $-3,-3,-3$ | yes, $b=-3$ |\n\n- A **negative** difference makes the terms decrease.\n- The formula uses $(n-1)b$, **not** $nb$: with $a=3$ and $b=4$, $U_1=3$, not 7.\n- Three numbers $x,y,z$ in order form an arithmetic sequence when $y-x=z-y$, that is, $y$ is the **average** of $x$ and $z$: $2y=x+z$.',
            'Periksa **semua** bedanya, bukan hanya yang pertama.\n\n| Barisan | Beda | Aritmetika? |\n|---|---|---|\n| $4,9,14,19$ | $5,5,5$ | ya, $b=5$ |\n| $2,5,9,14$ | $3,4,5$ | **bukan** |\n| $10,7,4,1$ | $-3,-3,-3$ | ya, $b=-3$ |\n\n- Beda yang **negatif** membuat suku-sukunya menurun.\n- Rumusnya memakai $(n-1)b$, **bukan** $nb$: dengan $a=3$ dan $b=4$, $U_1=3$, bukan 7.\n- Tiga bilangan $x,y,z$ berurutan membentuk barisan aritmetika jika $y-x=z-y$, artinya $y$ adalah **rata-rata** $x$ dan $z$: $2y=x+z$.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The bars show the first four terms of an arithmetic sequence. What is the 10th term?',
            'Batang-batang menunjukkan empat suku pertama barisan aritmetika. Berapa suku ke-10?',
          ),
          figure: {
            ...terms([5, 9, 13, 17], 20, 5),
            caption: L('Four terms: 5, 9, 13, 17.', 'Empat suku: 5, 9, 13, 17.'),
          },
          options: [L('41', '41'), L('45', '45'), L('37', '37'), L('49', '49')],
          answer: 0,
          explain: L(
            '$a=5$ and $b=4$, so $U_{10}=5+9\\times4=41$. Taking 10 steps (45) is the usual slip: there are only 9 steps from the first term.',
            '$a=5$ dan $b=4$, jadi $U_{10}=5+9\\times4=41$. Mengambil 10 langkah (45) adalah kesalahan umum: hanya ada 9 langkah dari suku pertama.',
          ),
          hint: L(
            'Find the common difference from the bars, then count the steps from the first term to the 10th.',
            'Cari beda dari batang-batangnya, lalu hitung langkah dari suku pertama ke suku ke-10.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: from $a+2b=11$ and $a+6b=27$, find $b$.',
            'Coba bersama: dari $a+2b=11$ dan $a+6b=27$, cari $b$.',
          ),
          template: '(a+6b)-(a+2b)=27-11 \\Rightarrow 4b=___ \\Rightarrow b=___',
          blanks: ['16', '4'],
          explain: L(
            'The $a$ cancels. $27-11=16$, so $4b=16$ and $b=4$.',
            'Suku $a$ habis. $27-11=16$, jadi $4b=16$ dan $b=4$.',
          ),
          hint: L(
            'Subtract the right sides too: $27-11$. Then divide by the coefficient of $b$.',
            'Kurangkan juga ruas kanannya: $27-11$. Lalu bagi dengan koefisien $b$.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO arithmetic sequences.', 'Pilih DUA barisan aritmetika.'),
          options: [L('$2,5,8,11$', '$2,5,8,11$'), L('$10,7,4,1$', '$10,7,4,1$'), L('$1,2,4,8$', '$1,2,4,8$'), L('$3,6,12,24$', '$3,6,12,24$')],
          answer: [0, 1],
          explain: L(
            'The differences are all $+3$ and all $-3$. The last two double each time (multiplying, not adding), so they are not arithmetic.',
            'Bedanya semua $+3$ dan semua $-3$. Dua yang terakhir berlipat dua setiap kali (mengalikan, bukan menambah), jadi bukan aritmetika.',
          ),
          hint: L(
            'Subtract each term from the next and see whether the answer stays the same.',
            'Kurangkan tiap suku dari suku berikutnya dan lihat apakah hasilnya tetap sama.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$4,9,14,19$ has common difference 5.', '$4,9,14,19$ punya beda 5.'),
            L('$2,5,9,14$ is an arithmetic sequence.', '$2,5,9,14$ adalah barisan aritmetika.'),
            L('With a negative common difference the terms decrease.', 'Dengan beda negatif, suku-sukunya menurun.'),
            L('$U_n=a+nb$.', '$U_n=a+nb$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'The differences of $2,5,9,14$ are 3, 4, 5, not equal. The correct formula is $U_n=a+(n-1)b$, since the first term needs no step.',
            'Beda $2,5,9,14$ adalah 3, 4, 5, tidak sama. Rumus yang benar adalah $U_n=a+(n-1)b$, sebab suku pertama tidak memerlukan langkah.',
          ),
          hint: L(
            'For the last statement, test it with $n=1$: it should give back $a$.',
            'Untuk pernyataan terakhir, uji dengan $n=1$: seharusnya menghasilkan $a$.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'In an arithmetic sequence $U_3=11$ and $U_7=27$. Find $U_{20}$.',
            'Pada barisan aritmetika, $U_3=11$ dan $U_7=27$. Tentukan $U_{20}$.',
          ),
          blanks: [{ label: 'U_{20} =', answer: 79 }],
          hints: [
            L('Write $U_3$ and $U_7$ using $a$ and $b$.', 'Tulis $U_3$ dan $U_7$ memakai $a$ dan $b$.'),
            L('$a+2b=11$ and $a+6b=27$. Subtract to find $b$, then find $a$.', '$a+2b=11$ dan $a+6b=27$. Kurangkan untuk mencari $b$, lalu cari $a$.'),
            L('$b=4$ and $a=3$. Now use $U_{20}=a+19b$.', '$b=4$ dan $a=3$. Sekarang pakai $U_{20}=a+19b$.'),
          ],
          explain: L(
            '$b=4$, $a=3$, so $U_{20}=3+19\\times4=3+76=79$.',
            '$b=4$, $a=3$, jadi $U_{20}=3+19\\times4=3+76=79$.',
          ),
          solution: ['4b=27-11=16 \\Rightarrow b=4', 'a=11-2(4)=3', 'U_{20}=3+19\\times4=79'],
        },
      ],
    },
    /* ------------------------------------------------------------ L2 series */
    {
      id: 'tka-sma-m4-s1-l2',
      title: L('Arithmetic Series', 'Deret Aritmetika'),
      goal: L(
        'You can add the first $n$ terms of an arithmetic sequence with a formula, and use it in problems with rows, seats and savings.',
        'Kamu bisa menjumlahkan $n$ suku pertama barisan aritmetika dengan rumus, dan memakainya dalam soal baris, kursi, dan tabungan.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Pairing From Both Ends', 'Ayo Amati: Memasangkan dari Kedua Ujung'),
          body: L(
            'Add $2+4+6+8+10$. The old trick: pair the first with the last, the second with the second-last.\n\n$$2+10=12,\\quad 4+8=12,\\quad 6\\text{ is left alone}\\ (6\\times2=12\\text{ as a half-pair})$$\n\nEvery pair makes 12, and there are $\\frac{5}{2}$ pairs, so the sum is $\\frac{5}{2}\\times12=30$.\n\nIn general, the **sum of the first $n$ terms** of an arithmetic sequence is\n\n$$S_n=\\frac{n}{2}\\,(a+U_n)=\\frac{n}{2}\\,\\bigl(2a+(n-1)b\\bigr)$$\n\nSo $1+2+\\cdots+100=\\frac{100}{2}(1+100)=5050$.',
            'Jumlahkan $2+4+6+8+10$. Triknya: pasangkan suku pertama dengan terakhir, kedua dengan kedua dari belakang.\n\n$$2+10=12,\\quad 4+8=12,\\quad 6\\text{ tersisa}\\ (6\\times2=12\\text{ sebagai setengah pasangan})$$\n\nSetiap pasangan berjumlah 12, dan ada $\\frac{5}{2}$ pasangan, jadi jumlahnya $\\frac{5}{2}\\times12=30$.\n\nSecara umum, **jumlah $n$ suku pertama** barisan aritmetika adalah\n\n$$S_n=\\frac{n}{2}\\,(a+U_n)=\\frac{n}{2}\\,\\bigl(2a+(n-1)b\\bigr)$$\n\nJadi $1+2+\\cdots+100=\\frac{100}{2}(1+100)=5050$.',
          ),
          figure: {
            ...terms([2, 4, 6, 8, 10], 10, 2),
            caption: L('The terms 2, 4, 6, 8, 10: the first and last bars add to the same as the second and second-last.', 'Suku 2, 4, 6, 8, 10: batang pertama dan terakhir berjumlah sama dengan batang kedua dan kedua dari belakang.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Using the Formula', 'Contoh Bertahap: Memakai Rumus'),
          body: L(
            'Find the sum of the first 10 terms of $3,7,11,\\ldots$\n\n1. Step 1: $a=3$, $b=4$, $n=10$.\n2. Step 2: $S_{10}=\\frac{10}{2}\\bigl(2\\cdot3+9\\cdot4\\bigr)$.\n3. Step 3: $=5\\times42=210$.\n\nIf you know the last term instead, use $S_n=\\frac{n}{2}(a+U_n)$: the 10th term is $3+36=39$, and $S_{10}=5(3+39)=210$. Same answer.\n\nA term can be found from two sums: $U_n=S_n-S_{n-1}$ for $n\\ge2$. For example $S_{10}-S_9=U_{10}$.',
            'Cari jumlah 10 suku pertama dari $3,7,11,\\ldots$\n\n1. Langkah 1: $a=3$, $b=4$, $n=10$.\n2. Langkah 2: $S_{10}=\\frac{10}{2}\\bigl(2\\cdot3+9\\cdot4\\bigr)$.\n3. Langkah 3: $=5\\times42=210$.\n\nJika yang diketahui suku terakhir, pakai $S_n=\\frac{n}{2}(a+U_n)$: suku ke-10 adalah $3+36=39$, dan $S_{10}=5(3+39)=210$. Jawabannya sama.\n\nSuatu suku dapat dicari dari dua jumlah: $U_n=S_n-S_{n-1}$ untuk $n\\ge2$. Misalnya $S_{10}-S_9=U_{10}$.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Seats in a Hall', 'Contoh Bertahap: Kursi dalam Aula'),
          body: L(
            'A hall has 20 seats in the first row and each next row has 3 seats more. There are 12 rows. How many seats in all?\n\n1. Step 1: The rows form an arithmetic sequence: $a=20$, $b=3$, $n=12$.\n2. Step 2: $S_{12}=\\frac{12}{2}\\bigl(2\\cdot20+11\\cdot3\\bigr)=6\\times73$.\n3. Step 3: $S_{12}=438$ seats.\n\n**Another type:** the sum of all multiples of 3 between 1 and 100. They are $3,6,\\ldots,99$, so $99=3+(n-1)3$ gives $n=33$, and $S_{33}=\\frac{33}{2}(3+99)=33\\times51=1\\,683$.\n\n**Watch out:** count the terms first. A common error is using $n=99$ or $n=100$ as the number of terms.',
            'Sebuah aula punya 20 kursi pada baris pertama dan setiap baris berikutnya 3 kursi lebih banyak. Ada 12 baris. Berapa kursi seluruhnya?\n\n1. Langkah 1: Baris-barisnya membentuk barisan aritmetika: $a=20$, $b=3$, $n=12$.\n2. Langkah 2: $S_{12}=\\frac{12}{2}\\bigl(2\\cdot20+11\\cdot3\\bigr)=6\\times73$.\n3. Langkah 3: $S_{12}=438$ kursi.\n\n**Jenis lain:** jumlah semua kelipatan 3 antara 1 dan 100. Yaitu $3,6,\\ldots,99$, jadi $99=3+(n-1)3$ memberi $n=33$, dan $S_{33}=\\frac{33}{2}(3+99)=33\\times51=1\\,683$.\n\n**Awas:** hitung banyak sukunya lebih dulu. Kesalahan umum adalah memakai $n=99$ atau $n=100$ sebagai banyak suku.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The bars show the terms $2,4,6,8,10$. What is their sum?',
            'Batang-batang menunjukkan suku $2,4,6,8,10$. Berapa jumlahnya?',
          ),
          figure: {
            ...terms([2, 4, 6, 8, 10], 10, 2, false),
            caption: L('Five terms of an arithmetic sequence.', 'Lima suku barisan aritmetika.'),
          },
          options: [L('30', '30'), L('24', '24'), L('20', '20'), L('36', '36')],
          answer: 0,
          explain: L(
            '$S_5=\\frac{5}{2}(2+10)=\\frac{5}{2}\\times12=30$. Adding directly: $2+4+6+8+10=30$.',
            '$S_5=\\frac{5}{2}(2+10)=\\frac{5}{2}\\times12=30$. Menjumlahkan langsung: $2+4+6+8+10=30$.',
          ),
          hint: L(
            'Use $S_n=\\frac{n}{2}(a+U_n)$ with the first term, the last term and $n=5$.',
            'Pakai $S_n=\\frac{n}{2}(a+U_n)$ dengan suku pertama, suku terakhir, dan $n=5$.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the sum of the first 10 terms of $3,7,11,\\ldots$',
            'Coba bersama: jumlah 10 suku pertama dari $3,7,11,\\ldots$',
          ),
          template: 'S_{10}=\\frac{10}{2}(2\\cdot3+9\\cdot4)=5\\times___=___',
          blanks: ['42', '210'],
          explain: L(
            '$2\\cdot3+9\\cdot4=6+36=42$, and $5\\times42=210$.',
            '$2\\cdot3+9\\cdot4=6+36=42$, dan $5\\times42=210$.',
          ),
          hint: L(
            'First work out the bracket, then multiply by 5.',
            'Hitung kurungnya dulu, lalu kalikan 5.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true equalities.', 'Pilih DUA kesamaan yang benar.'),
          options: [
            L('$1+2+\\cdots+100=5050$', '$1+2+\\cdots+100=5050$'),
            L('The sum of the first 10 odd numbers is 100.', 'Jumlah 10 bilangan ganjil pertama adalah 100.'),
            L('$1+2+\\cdots+10=45$', '$1+2+\\cdots+10=45$'),
            L('$2+4+\\cdots+20=100$', '$2+4+\\cdots+20=100$'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\frac{100}{2}(101)=5050$ and $\\frac{10}{2}(1+19)=100$. But $1+\\cdots+10=\\frac{10}{2}(11)=55$ and $2+\\cdots+20=\\frac{10}{2}(22)=110$.',
            '$\\frac{100}{2}(101)=5050$ dan $\\frac{10}{2}(1+19)=100$. Namun $1+\\cdots+10=\\frac{10}{2}(11)=55$ dan $2+\\cdots+20=\\frac{10}{2}(22)=110$.',
          ),
          hint: L(
            'For each one, find $n$ first, then use $\\frac{n}{2}(\\text{first}+\\text{last})$.',
            'Untuk tiap pernyataan, cari $n$ dulu, lalu pakai $\\frac{n}{2}(\\text{pertama}+\\text{terakhir})$.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$S_n=\\frac{n}{2}(a+U_n)$ for an arithmetic sequence.', '$S_n=\\frac{n}{2}(a+U_n)$ untuk barisan aritmetika.'),
            L('The sum of the first $n$ terms equals the $n$th term.', 'Jumlah $n$ suku pertama sama dengan suku ke-$n$.'),
            L('$U_n=S_n-S_{n-1}$ for $n\\ge2$.', '$U_n=S_n-S_{n-1}$ untuk $n\\ge2$.'),
            L('The sum of the first 20 positive integers is 200.', 'Jumlah 20 bilangan bulat positif pertama adalah 200.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'The sum is the whole stack of terms, not just the last one. $S_n$ with the last term removed is $S_{n-1}$. And $\\frac{20}{2}(1+20)=210$, not 200.',
            'Jumlah adalah seluruh tumpukan suku, bukan hanya yang terakhir. $S_n$ tanpa suku terakhir adalah $S_{n-1}$. Dan $\\frac{20}{2}(1+20)=210$, bukan 200.',
          ),
          hint: L(
            'Calculate $\\frac{20}{2}(1+20)$ for the last statement.',
            'Hitung $\\frac{20}{2}(1+20)$ untuk pernyataan terakhir.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A hall has 20 seats in the first row, and every next row has 3 more seats. There are 12 rows. How many seats are there in all?',
            'Sebuah aula punya 20 kursi pada baris pertama, dan setiap baris berikutnya 3 kursi lebih banyak. Ada 12 baris. Berapa banyak kursi seluruhnya?',
          ),
          blanks: [{ answer: 438 }],
          hints: [
            L('The numbers of seats per row form an arithmetic sequence. What are $a$, $b$ and $n$?', 'Banyak kursi per baris membentuk barisan aritmetika. Berapa $a$, $b$, dan $n$?'),
            L('$a=20$, $b=3$, $n=12$. Use $S_n=\\frac{n}{2}(2a+(n-1)b)$.', '$a=20$, $b=3$, $n=12$. Pakai $S_n=\\frac{n}{2}(2a+(n-1)b)$.'),
            L('$S_{12}=6\\times(40+33)$.', '$S_{12}=6\\times(40+33)$.'),
          ],
          explain: L(
            '$S_{12}=\\frac{12}{2}(2\\cdot20+11\\cdot3)=6\\times73=438$ seats.',
            '$S_{12}=\\frac{12}{2}(2\\cdot20+11\\cdot3)=6\\times73=438$ kursi.',
          ),
          solution: ['S_{12}=\\frac{12}{2}(2\\cdot20+11\\cdot3)', '=6\\times73', '=438'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m4-s1-p',
    runtime: 'math',
    title: L('Arithmetic Patterns', 'Pola Aritmetika'),
    brief: L(
      'Find terms and sums of arithmetic sequences, insert terms, and add multiples.',
      'Cari suku dan jumlah barisan aritmetika, sisipkan suku, dan jumlahkan kelipatan.',
    ),
    requirements: [
      L('Use $U_n=a+(n-1)b$ and $S_n=\\frac{n}{2}(a+U_n)$.', 'Memakai $U_n=a+(n-1)b$ dan $S_n=\\frac{n}{2}(a+U_n)$.'),
      L('Count terms before summing.', 'Menghitung banyak suku sebelum menjumlahkan.'),
    ],
    hints: [
      L('The $n$th term is $n-1$ steps from the first.', 'Suku ke-$n$ berjarak $n-1$ langkah dari suku pertama.'),
      L('To insert $k$ terms, there are $k+1$ steps in all.', 'Untuk menyisipkan $k$ suku, ada $k+1$ langkah seluruhnya.'),
      L('Find the number of terms before you use the sum formula.', 'Cari banyak suku sebelum memakai rumus jumlah.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L('Which term of $3,7,11,\\ldots$ equals 99?', 'Suku ke berapa dari $3,7,11,\\ldots$ yang bernilai 99?'),
        blanks: [{ label: 'n =', answer: 25 }],
        solution: ['U_n=3+4(n-1)=4n-1', '4n-1=99 \\Rightarrow n=25'],
      },
      {
        prompt: L(
          'Three numbers are inserted between 5 and 25 so that all five form an arithmetic sequence. What is the sum of the three inserted numbers?',
          'Tiga bilangan disisipkan di antara 5 dan 25 sehingga kelimanya membentuk barisan aritmetika. Berapa jumlah ketiga bilangan yang disisipkan itu?',
        ),
        blanks: [{ answer: 45 }],
        solution: ['b=\\frac{25-5}{4}=5', '10+15+20=45'],
      },
      {
        prompt: L(
          'What is the sum of all multiples of 3 between 1 and 100?',
          'Berapa jumlah semua kelipatan 3 antara 1 dan 100?',
        ),
        blanks: [{ answer: 1683 }],
        solution: ['3,6,\\ldots,99 \\Rightarrow n=\\frac{99}{3}=33', 'S_{33}=\\frac{33}{2}(3+99)=33\\times51=1\\,683'],
      },
      {
        prompt: L(
          'An arithmetic sequence starts at 2, and the sum of its first 10 terms is 290. What is the common difference?',
          'Sebuah barisan aritmetika dimulai dari 2, dan jumlah 10 suku pertamanya 290. Berapa bedanya?',
        ),
        blanks: [{ label: 'b =', answer: 6 }],
        solution: ['S_{10}=5(4+9b)=290', '4+9b=58 \\Rightarrow 9b=54', 'b=6'],
      },
      {
        prompt: L(
          'The sum of the first $n$ odd numbers is $n^2$. What is the smallest $n$ for which the sum is more than 200?',
          'Jumlah $n$ bilangan ganjil pertama adalah $n^2$. Berapa $n$ terkecil agar jumlahnya lebih dari 200?',
        ),
        blanks: [{ label: 'n =', answer: 15 }],
        solution: ['14^2=196<200', '15^2=225>200', 'n=15'],
      },
    ],
  },
}
