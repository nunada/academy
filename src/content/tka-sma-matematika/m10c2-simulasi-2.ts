import type { Lesson } from '../types'
import { L, dot, numberLine, plane, rightTriangle, shape } from './figs'

/** Practice test 2: twelve questions, easy to hard, across the matrix. */

export const test2: Lesson = {
  id: 'tka-sma-m10-s3-l2',
  title: L('Practice Test 2', 'Simulasi TKA SMA 2'),
  goal: L(
    'You can finish a second practice test with a mix of question types and levels, faster and more calmly than the first.',
    'Kamu bisa menyelesaikan simulasi kedua dengan berbagai bentuk dan tingkat soal, lebih cepat dan lebih tenang daripada yang pertama.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: How Practice Test 2 Works', 'Ayo Amati: Cara Kerja Simulasi TKA SMA 2'),
      body: L(
        'This is the second practice test: 12 questions, about 30 minutes. The structure is the same as the first, but the questions are new.\n\n- Before you start, make your **time plan**: about 2 minutes for easy questions, up to 4 for hard ones, and a minute at the end to review.\n- Do the easy questions first and **mark** any question that is taking too long.\n- The levels run the same way: four of Knowing and Understanding, five of Applying and three of Reasoning.\n- Remember the three formats: one answer (use elimination), choose all (test every option) and True/False (judge each row on its own).\n- Check the three usual slips: signs, units and what exactly was asked.\n\nCompare your result with Practice Test 1. Did the same kind of mistake come back? Then that is the area to practice next.',
        'Ini simulasi kedua: 12 soal, sekitar 30 menit. Strukturnya sama dengan yang pertama, tetapi soalnya baru.\n\n- Sebelum mulai, buat **rencana waktumu**: sekitar 2 menit untuk soal mudah, sampai 4 untuk yang sulit, dan satu menit di akhir untuk meninjau.\n- Kerjakan soal mudah lebih dulu dan **tandai** soal yang terlalu lama.\n- Levelnya berjalan sama: empat Pengetahuan dan Pemahaman, lima Aplikasi, dan tiga Penalaran.\n- Ingat tiga bentuk soal: satu jawaban (pakai eliminasi), pilih semua (uji setiap pilihan), dan Benar/Salah (nilai tiap baris sendiri-sendiri).\n- Periksa tiga kekeliruan yang biasa: tanda, satuan, dan apa yang sebenarnya ditanyakan.\n\nBandingkan hasilmu dengan Simulasi 1. Apakah jenis kesalahan yang sama muncul lagi? Itulah bidang yang harus dilatih berikutnya.',
      ),
    },
    /* 1 — numbers, understanding */
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L('Simplify $2^5\\times2^{-3}$.', 'Sederhanakan $2^5\\times2^{-3}$.'),
      options: [L('$4$', '$4$'), L('$\\frac{1}{4}$', '$\\frac{1}{4}$'), L('$64$', '$64$'), L('$2^{-15}$', '$2^{-15}$'), L('$8$', '$8$')],
      answer: 0,
      explain: L(
        'Same base: add the exponents, $2^{5+(-3)}=2^2=4$. The value $2^{-15}$ multiplies the exponents instead of adding them, and $\\frac{1}{4}$ has the wrong sign of the exponent.',
        'Basis sama: jumlahkan eksponen, $2^{5+(-3)}=2^2=4$. Nilai $2^{-15}$ mengalikan eksponen, bukan menjumlahkannya, dan $\\frac{1}{4}$ salah tanda eksponennya.',
      ),
      hint: L(
        'For the same base, the exponents are added when the powers are multiplied.',
        'Untuk basis yang sama, eksponen dijumlahkan saat pangkat dikalikan.',
      ),
    },
    /* 2 — data, understanding */
    {
      kind: 'quiz',
      id: 'q2',
      prompt: L('What kind of correlation does this scatter plot show?', 'Korelasi macam apa yang ditunjukkan diagram pencar ini?'),
      figure: {
        ...plane(
          [
            dot([1, 2], undefined, 'a'),
            dot([2, 2.5], undefined, 'a'),
            dot([3, 4], undefined, 'a'),
            dot([4, 4.5], undefined, 'a'),
            dot([5, 6], undefined, 'a'),
            dot([6, 6.5], undefined, 'a'),
          ],
          { x: [0, 8], y: [0, 8] },
        ),
        caption: L('Six points that rise from left to right.', 'Enam titik yang naik dari kiri ke kanan.'),
      },
      options: [L('Positive', 'Positif'), L('Negative', 'Negatif'), L('No correlation', 'Tidak ada korelasi'), L('It cannot be told', 'Tidak dapat ditentukan'), L('Negative for small $x$ and positive for large $x$', 'Negatif untuk $x$ kecil dan positif untuk $x$ besar')],
      answer: 0,
      explain: L(
        'The points go up as $x$ goes up, so the correlation is positive. A negative correlation would go downward.',
        'Titik-titik naik saat $x$ naik, jadi korelasinya positif. Korelasi negatif akan menurun.',
      ),
      hint: L(
        'Follow the points from left to right. Do they rise or fall?',
        'Ikuti titik-titik dari kiri ke kanan. Apakah naik atau turun?',
      ),
    },
    /* 3 — exponents, understanding */
    {
      kind: 'quiz',
      id: 'q3',
      prompt: L('Solve $4^x=\\frac{1}{8}$.', 'Selesaikan $4^x=\\frac{1}{8}$.'),
      options: [L('$x=-\\frac{3}{2}$', '$x=-\\frac{3}{2}$'), L('$x=\\frac{3}{2}$', '$x=\\frac{3}{2}$'), L('$x=-2$', '$x=-2$'), L('$x=-\\frac{3}{4}$', '$x=-\\frac{3}{4}$'), L('$x=-3$', '$x=-3$')],
      answer: 0,
      explain: L(
        'Write both sides with base 2: $4^x=2^{2x}$ and $\\frac{1}{8}=2^{-3}$. So $2x=-3$ and $x=-\\frac{3}{2}$. The value $\\frac{3}{2}$ forgets the negative sign, and $-\\frac{3}{4}$ forgets that $4=2^2$ doubles the exponent.',
        'Tulis kedua ruas dengan basis 2: $4^x=2^{2x}$ dan $\\frac{1}{8}=2^{-3}$. Jadi $2x=-3$ dan $x=-\\frac{3}{2}$. Nilai $\\frac{3}{2}$ melupakan tanda negatif, dan $-\\frac{3}{4}$ melupakan bahwa $4=2^2$ menggandakan eksponen.',
      ),
      hint: L(
        'Write 4 and $\\frac{1}{8}$ as powers of 2, then compare the exponents.',
        'Tulis 4 dan $\\frac{1}{8}$ sebagai pangkat dari 2, lalu bandingkan eksponennya.',
      ),
    },
    /* 4 — geometry, understanding */
    {
      kind: 'quiz',
      id: 'q4',
      prompt: L('What is the size of angle $x$ in the triangle?', 'Berapa besar sudut $x$ pada segitiga ini?'),
      figure: {
        ...shape({
          pts: [[0, 0], [8, 0], [3, 4.5]],
          names: 'ABC',
          extra: [
            { t: 'angle', at: [0, 0], from: [8, 0], to: [3, 4.5], label: '50' },
            { t: 'angle', at: [8, 0], from: [0, 0], to: [3, 4.5], label: '60' },
            { t: 'angle', at: [3, 4.5], from: [0, 0], to: [8, 0], label: 'x' },
          ],
        }),
        caption: L('A triangle with angles of 50 and 60 degrees and an angle x at the top.', 'Segitiga dengan sudut 50 dan 60 derajat dan sudut x di puncak.'),
      },
      options: [L('$70^{\\circ}$', '$70^{\\circ}$'), L('$110^{\\circ}$', '$110^{\\circ}$'), L('$10^{\\circ}$', '$10^{\\circ}$'), L('$130^{\\circ}$', '$130^{\\circ}$'), L('$50^{\\circ}$', '$50^{\\circ}$')],
      answer: 0,
      explain: L(
        '$x=180^{\\circ}-50^{\\circ}-60^{\\circ}=70^{\\circ}$. The value $110^{\\circ}$ is the sum of the two known angles, which is the exterior angle at $C$, not $x$.',
        '$x=180^{\\circ}-50^{\\circ}-60^{\\circ}=70^{\\circ}$. Nilai $110^{\\circ}$ adalah jumlah dua sudut yang diketahui, yaitu sudut luar di $C$, bukan $x$.',
      ),
      hint: L(
        'The three angles of a triangle add up to $180^{\\circ}$.',
        'Ketiga sudut segitiga berjumlah $180^{\\circ}$.',
      ),
    },
    /* 5 — inequalities, application */
    {
      kind: 'judge',
      id: 'j1',
      prompt: L(
        'The number line shows the solution of an inequality: a green stretch from $-1$ (filled dot) to $3$ (open dot). Decide whether each statement is True or False.',
        'Garis bilangan menunjukkan penyelesaian suatu pertidaksamaan: rentang hijau dari $-1$ (titik penuh) sampai $3$ (titik kosong). Tentukan tiap pernyataan Benar atau Salah.',
      ),
      figure: {
        ...numberLine({
          from: -3,
          to: 5,
          step: 1,
          shade: [-1, 3],
          marks: [
            { at: -1, color: 'a' },
            { at: 3, color: 'a', open: true },
          ],
        }),
        caption: L('The solution stretch from -1 (included) to 3 (not included).', 'Rentang penyelesaian dari -1 (termasuk) sampai 3 (tidak termasuk).'),
      },
      statements: [
        L('$-1$ is a solution.', '$-1$ adalah penyelesaian.'),
        L('$3$ is a solution.', '$3$ adalah penyelesaian.'),
        L('$2.9$ is a solution.', '$2{,}9$ adalah penyelesaian.'),
        L('The solution is $-1\\le x\\le3$.', 'Penyelesaiannya $-1\\le x\\le3$.'),
      ],
      answer: [true, false, true, false],
      explain: L(
        'A filled dot includes its end, so $-1$ is a solution. An open dot leaves its end out, so $3$ is not, but $2.9$ is. The solution is $-1\\le x<3$, which does not include 3.',
        'Titik penuh menyertakan ujungnya, jadi $-1$ adalah penyelesaian. Titik kosong tidak menyertakan ujungnya, jadi $3$ bukan, tetapi $2{,}9$ ya. Penyelesaiannya $-1\\le x<3$, yang tidak menyertakan 3.',
      ),
      hint: L(
        'A filled dot means the end is included; an open dot means it is not.',
        'Titik penuh berarti ujungnya termasuk; titik kosong berarti tidak.',
      ),
    },
    /* 6 — systems, application */
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        'The numbers $x$ and $y$ satisfy $2x+y=11$ and $x-y=1$. Find the product $xy$.',
        'Bilangan $x$ dan $y$ memenuhi $2x+y=11$ dan $x-y=1$. Tentukan hasil kali $xy$.',
      ),
      blanks: [{ label: 'xy =', answer: 12 }],
      hints: [
        L('Add the two equations so that $y$ disappears.', 'Jumlahkan kedua persamaan sehingga $y$ hilang.'),
        L('$3x=12$, so $x=4$.', '$3x=12$, jadi $x=4$.'),
        L('Put $x=4$ into $x-y=1$ to find $y$, then multiply $x$ and $y$.', 'Masukkan $x=4$ ke $x-y=1$ untuk mencari $y$, lalu kalikan $x$ dan $y$.'),
      ],
      explain: L(
        '$x=4$ and $y=3$. Check: $2(4)+3=11$ and $4-3=1$ ✓. The product is $4\\times3=12$.',
        '$x=4$ dan $y=3$. Periksa: $2(4)+3=11$ dan $4-3=1$ ✓. Hasil kalinya $4\\times3=12$.',
      ),
      solution: ['(2x+y)+(x-y)=11+1 \\Rightarrow x=4', 'y=x-1=3', 'xy=12'],
    },
    /* 7 — measurement, application */
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L(
        'A cylinder has radius 5 and height 12. Choose the TWO true statements.',
        'Sebuah tabung berjari-jari 5 dan tinggi 12. Pilih DUA pernyataan yang benar.',
      ),
      options: [
        L('The volume is $300\\pi$.', 'Volumenya $300\\pi$.'),
        L('The curved surface area is $120\\pi$.', 'Luas selimutnya $120\\pi$.'),
        L('The total surface area is $240\\pi$.', 'Luas permukaan totalnya $240\\pi$.'),
        L('The volume is $600\\pi$.', 'Volumenya $600\\pi$.'),
      ],
      answer: [0, 1],
      explain: L(
        '$V=\\pi\\times25\\times12=300\\pi$ and the curved area is $2\\pi\\times5\\times12=120\\pi$. The total is $2\\pi\\times25+120\\pi=170\\pi$ (not $240\\pi$), and $600\\pi$ doubles the volume.',
        '$V=\\pi\\times25\\times12=300\\pi$ dan luas selimutnya $2\\pi\\times5\\times12=120\\pi$. Totalnya $2\\pi\\times25+120\\pi=170\\pi$ (bukan $240\\pi$), dan $600\\pi$ menggandakan volume.',
      ),
      hint: L(
        'Use $V=\\pi r^2h$, side area $2\\pi rh$, and add two circles for the total surface.',
        'Pakai $V=\\pi r^2t$, luas selimut $2\\pi rt$, dan tambahkan dua lingkaran untuk luas permukaan total.',
      ),
    },
    /* 8 — transformations, application */
    {
      kind: 'quiz',
      id: 'q5',
      prompt: L(
        'The point $(3,-2)$ is reflected in the $y$-axis and then translated by $\\begin{pmatrix}1\\\\4\\end{pmatrix}$. What is the final point?',
        'Titik $(3,-2)$ dicerminkan pada sumbu $y$ lalu digeser dengan $\\begin{pmatrix}1\\\\4\\end{pmatrix}$. Apa titik akhirnya?',
      ),
      options: [L('$(-2,2)$', '$(-2,2)$'), L('$(4,2)$', '$(4,2)$'), L('$(-4,-6)$', '$(-4,-6)$'), L('$(2,2)$', '$(2,2)$'), L('$(2,-6)$', '$(2,-6)$')],
      answer: 0,
      explain: L(
        'The $y$-axis reflection changes the sign of $x$: $(-3,-2)$. Then add $(1,4)$: $(-2,2)$. The point $(4,2)$ translates without reflecting.',
        'Refleksi sumbu $y$ mengubah tanda $x$: $(-3,-2)$. Lalu tambahkan $(1,4)$: $(-2,2)$. Titik $(4,2)$ hanya digeser tanpa dicerminkan.',
      ),
      hint: L(
        'Do the two moves in the order given. The $y$-axis reflection flips the sign of $x$.',
        'Lakukan kedua gerakan menurut urutannya. Refleksi sumbu $y$ membalik tanda $x$.',
      ),
    },
    /* 9 — trigonometry, application */
    {
      kind: 'quiz',
      id: 'q6',
      prompt: L(
        'In the right triangle the hypotenuse is 12 and one angle is $30^{\\circ}$. How long is the side $x$ opposite that angle?',
        'Pada segitiga siku-siku, sisi miringnya 12 dan satu sudutnya $30^{\\circ}$. Berapa panjang sisi $x$ yang berhadapan dengan sudut itu?',
      ),
      figure: {
        ...rightTriangle({ a: 10.39, b: 6, angle: '30°', sides: { up: 'x', slant: '12' } }),
        caption: L('A right triangle with hypotenuse 12 and an angle of 30 degrees.', 'Segitiga siku-siku dengan sisi miring 12 dan sudut 30 derajat.'),
      },
      options: [L('$6$', '$6$'), L('$6\\sqrt{3}$', '$6\\sqrt{3}$'), L('$12$', '$12$'), L('$24$', '$24$'), L('$3\\sqrt{3}$', '$3\\sqrt{3}$')],
      answer: 0,
      explain: L(
        '$x=12\\sin30^{\\circ}=12\\times\\frac{1}{2}=6$. The value $6\\sqrt{3}$ is the other leg (adjacent to $30^{\\circ}$), and the sides of a right triangle can never be longer than the hypotenuse, which rules out 24.',
        '$x=12\\sin30^{\\circ}=12\\times\\frac{1}{2}=6$. Nilai $6\\sqrt{3}$ adalah sisi tegak lainnya (di samping $30^{\\circ}$), dan sisi segitiga siku-siku tidak mungkin lebih panjang dari sisi miring, yang menyingkirkan 24.',
      ),
      hint: L(
        'The side opposite the angle and the hypotenuse go with sine.',
        'Sisi di hadapan sudut dan sisi miring berpasangan dengan sinus.',
      ),
    },
    /* 10 — series, reasoning */
    {
      kind: 'math',
      id: 'm2',
      prompt: L(
        'An infinite geometric series has first term 12 and sum 18. What is its common ratio $r$?',
        'Sebuah deret geometri tak hingga memiliki suku pertama 12 dan jumlah 18. Berapa rasionya $r$?',
      ),
      blanks: [{ label: 'r =', answer: 1 / 3 }],
      hints: [
        L('For an infinite series with $|r|<1$, $S=\\frac{a}{1-r}$.', 'Untuk deret tak hingga dengan $|r|<1$, $S=\\frac{a}{1-r}$.'),
        L('$18=\\frac{12}{1-r}$. Solve for $1-r$.', '$18=\\frac{12}{1-r}$. Selesaikan untuk $1-r$.'),
        L('$1-r=\\frac{12}{18}=\\frac{2}{3}$.', '$1-r=\\frac{12}{18}=\\frac{2}{3}$.'),
      ],
      explain: L(
        '$1-r=\\frac{12}{18}=\\frac{2}{3}$, so $r=\\frac{1}{3}$. It satisfies $|r|<1$, so the series really has a sum.',
        '$1-r=\\frac{12}{18}=\\frac{2}{3}$, jadi $r=\\frac{1}{3}$. Nilai ini memenuhi $|r|<1$, jadi deret itu memang punya jumlah.',
      ),
      solution: ['18=\\frac{12}{1-r}', '1-r=\\frac{2}{3}', 'r=\\frac{1}{3}'],
    },
    /* 11 — probability, reasoning */
    {
      kind: 'multi',
      id: 'mc2',
      prompt: L(
        'A fair die is rolled twice. Choose the TWO true statements.',
        'Sebuah dadu setimbang dilempar dua kali. Pilih DUA pernyataan yang benar.',
      ),
      options: [
        L('$P(\\text{sum}=7)=\\frac{1}{6}$', '$P(\\text{jumlah}=7)=\\frac{1}{6}$'),
        L('$P(\\text{both even})=\\frac{1}{4}$', '$P(\\text{keduanya genap})=\\frac{1}{4}$'),
        L('$P(\\text{sum}=12)=\\frac{1}{12}$', '$P(\\text{jumlah}=12)=\\frac{1}{12}$'),
        L('$P(\\text{a double})=\\frac{1}{3}$', '$P(\\text{kembar})=\\frac{1}{3}$'),
      ],
      answer: [0, 1],
      explain: L(
        'Sum 7 has 6 of 36 outcomes. Both even: $\\frac{1}{2}\\times\\frac{1}{2}=\\frac{1}{4}$. A sum of 12 needs $(6,6)$ only, so $\\frac{1}{36}$; a double (same number twice) has 6 of 36, so $\\frac{1}{6}$.',
        'Jumlah 7 ada 6 dari 36 hasil. Keduanya genap: $\\frac{1}{2}\\times\\frac{1}{2}=\\frac{1}{4}$. Jumlah 12 hanya $(6,6)$, jadi $\\frac{1}{36}$; kembar (bilangan sama dua kali) ada 6 dari 36, jadi $\\frac{1}{6}$.',
      ),
      hint: L(
        'There are 36 equally likely outcomes. Count the favorable ones for each statement.',
        'Ada 36 hasil yang sama mungkinnya. Hitung hasil yang diinginkan untuk tiap pernyataan.',
      ),
    },
    /* 12 — functions, reasoning */
    {
      kind: 'judge',
      id: 'j2',
      prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
      statements: [
        L('$f(x)=x^2$ has an inverse function on all real numbers.', '$f(x)=x^2$ punya fungsi invers pada semua bilangan real.'),
        L('The inverse of $f(x)=2x+3$ is $f^{-1}(x)=\\frac{x-3}{2}$.', 'Invers $f(x)=2x+3$ adalah $f^{-1}(x)=\\frac{x-3}{2}$.'),
        L('$(f\\circ g)(x)=(g\\circ f)(x)$ for every pair of functions.', '$(f\\circ g)(x)=(g\\circ f)(x)$ untuk setiap pasangan fungsi.'),
        L('$y=2^x$ is positive for every real $x$.', '$y=2^x$ positif untuk setiap $x$ real.'),
      ],
      answer: [false, true, false, true],
      explain: L(
        '$f(2)=f(-2)$, so $x^2$ is not one-to-one on all reals. From $y=2x+3$ we get $x=\\frac{y-3}{2}$. Composition is not commutative in general. And a positive base to any power is positive.',
        '$f(2)=f(-2)$, jadi $x^2$ tidak satu-satu pada semua bilangan real. Dari $y=2x+3$ diperoleh $x=\\frac{y-3}{2}$. Komposisi pada umumnya tidak komutatif. Dan basis positif dipangkatkan apa pun hasilnya positif.',
      ),
      hint: L(
        'Test each claim with a number, for example $x=2$ and $x=-2$ for the first.',
        'Uji tiap pernyataan dengan bilangan, misalnya $x=2$ dan $x=-2$ untuk yang pertama.',
      ),
    },
  ],
}
