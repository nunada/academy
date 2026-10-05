import type { Lesson } from '../types'
import { L, barChart, cone2d, plane, dot, rightTriangle } from './figs'

/** Practice test 1: twelve questions, easy to hard, across the matrix. */

export const test1: Lesson = {
  id: 'tka-sma-m10-s3-l1',
  title: L('Practice Test 1', 'Simulasi TKA SMA 1'),
  goal: L(
    'You can finish a practice test with a mix of question types and levels, from easy to hard, using the four steps and your time plan.',
    'Kamu bisa menyelesaikan simulasi dengan berbagai bentuk dan tingkat soal, dari yang mudah sampai yang sulit, memakai empat langkah dan rencana waktumu.',
  ),
  xp: 20,
  steps: [
    {
      kind: 'concept',
      id: 'c1',
      title: L('Look Closely: How Practice Test 1 Works', 'Ayo Amati: Cara Kerja Simulasi TKA SMA 1'),
      body: L(
        'This practice test has 12 questions, like a small TKA. Plan about 2.5 minutes for each question, which is 30 minutes in all. Use a timer if you can.\n\n- The questions go from **easy to hard**: the first four are level 1 (Knowing and Understanding), the middle five are level 2 (Applying), and the last three are level 3 (Reasoning).\n- You will meet one-answer questions, choose-all questions, True/False statements and typed answers.\n- Choose-all and True/False questions need every part right, with no partial credit.\n- The questions come from all the areas: numbers, algebra and functions, geometry and measurement, trigonometry, and data and probability.\n\nA hint appears when an answer is wrong, and an explanation appears when it is right. Use the four steps, check your answers and stay calm. Good luck!',
        'Simulasi ini terdiri dari 12 soal, seperti TKA kecil. Rencanakan sekitar 2,5 menit untuk tiap soal, jadi 30 menit seluruhnya. Pakai pengatur waktu kalau bisa.\n\n- Soal-soal berjalan dari **mudah ke sulit**: empat pertama level 1 (Pengetahuan dan Pemahaman), lima di tengah level 2 (Aplikasi), dan tiga terakhir level 3 (Penalaran).\n- Kamu akan bertemu soal satu jawaban, soal pilih semua, pernyataan Benar/Salah, dan jawaban ketikan.\n- Soal pilih semua dan Benar/Salah memerlukan setiap bagian benar, tanpa nilai sebagian.\n- Soal berasal dari semua bidang: bilangan, aljabar dan fungsi, geometri dan pengukuran, trigonometri, serta data dan peluang.\n\nPetunjuk muncul kalau jawabanmu salah, dan penjelasan muncul kalau benar. Pakai empat langkah, periksa jawabanmu, dan tetap tenang. Semoga berhasil!',
      ),
    },
    /* 1 — numbers, understanding */
    {
      kind: 'quiz',
      id: 'q1',
      prompt: L('Which of these numbers is irrational?', 'Manakah di antara bilangan berikut yang irasional?'),
      options: [L('$\\sqrt{12}$', '$\\sqrt{12}$'), L('$\\frac{22}{7}$', '$\\frac{22}{7}$'), L('$3.14$', '$3{,}14$'), L('$\\sqrt{49}$', '$\\sqrt{49}$')],
      answer: 0,
      explain: L(
        '12 is not a perfect square, so $\\sqrt{12}=2\\sqrt{3}$ is irrational. $\\frac{22}{7}$ and $3.14$ are fractions (approximations of $\\pi$, but rational themselves), and $\\sqrt{49}=7$.',
        '12 bukan kuadrat sempurna, jadi $\\sqrt{12}=2\\sqrt{3}$ irasional. $\\frac{22}{7}$ dan $3{,}14$ adalah pecahan (hampiran $\\pi$, tetapi sendirinya rasional), dan $\\sqrt{49}=7$.',
      ),
      hint: L(
        'Simplify each root. A number that can be written as a fraction of integers is rational.',
        'Sederhanakan tiap akar. Bilangan yang dapat ditulis sebagai pecahan bilangan bulat adalah rasional.',
      ),
    },
    /* 2 — functions, understanding */
    {
      kind: 'quiz',
      id: 'q2',
      prompt: L('What is the gradient of the line through the two red points?', 'Berapa gradien garis yang melalui kedua titik merah?'),
      figure: {
        ...plane(
          [
            { t: 'curve', f: '3-x', from: -1, to: 4, color: 'a' },
            dot([0, 3], undefined, 'result'),
            dot([3, 0], undefined, 'result'),
          ],
          { x: [-2, 5], y: [-2, 5] },
        ),
        caption: L('A line through (0, 3) and (3, 0).', 'Garis melalui (0, 3) dan (3, 0).'),
      },
      options: [L('$-1$', '$-1$'), L('$1$', '$1$'), L('$3$', '$3$'), L('$-3$', '$-3$')],
      answer: 0,
      explain: L(
        'The line goes down as it goes right: $\\frac{0-3}{3-0}=-1$. A line that falls has a negative gradient, which rules out $1$ and $3$. The value $-3$ uses the intercept instead of the rise over the run.',
        'Garis turun saat bergerak ke kanan: $\\frac{0-3}{3-0}=-1$. Garis yang turun bergradien negatif, yang menyingkirkan $1$ dan $3$. Nilai $-3$ memakai titik potong, bukan kenaikan dibagi pergeseran mendatar.',
      ),
      hint: L(
        'Gradient is rise over run. Does the line go up or down from left to right?',
        'Gradien adalah kenaikan dibagi pergeseran mendatar. Apakah garis naik atau turun dari kiri ke kanan?',
      ),
    },
    /* 3 — trigonometry, understanding */
    {
      kind: 'quiz',
      id: 'q3',
      prompt: L('Find the value of $\\sin30^{\\circ}+\\cos60^{\\circ}$.', 'Tentukan nilai $\\sin30^{\\circ}+\\cos60^{\\circ}$.'),
      options: [L('$1$', '$1$'), L('$\\frac{1}{2}$', '$\\frac{1}{2}$'), L('$\\frac{\\sqrt{3}}{2}$', '$\\frac{\\sqrt{3}}{2}$'), L('$\\sqrt{3}$', '$\\sqrt{3}$')],
      answer: 0,
      explain: L(
        '$\\sin30^{\\circ}=\\frac{1}{2}$ and $\\cos60^{\\circ}=\\frac{1}{2}$, so the sum is $1$. The value $\\frac{1}{2}$ is only one of the terms, and $\\frac{\\sqrt{3}}{2}$ belongs to $\\sin60^{\\circ}$ and $\\cos30^{\\circ}$.',
        '$\\sin30^{\\circ}=\\frac{1}{2}$ dan $\\cos60^{\\circ}=\\frac{1}{2}$, jadi jumlahnya $1$. Nilai $\\frac{1}{2}$ hanya salah satu sukunya, dan $\\frac{\\sqrt{3}}{2}$ milik $\\sin60^{\\circ}$ dan $\\cos30^{\\circ}$.',
      ),
      hint: L(
        'Recall the table of special angles: the small angle has the small sine.',
        'Ingat tabel sudut istimewa: sudut kecil punya sinus kecil.',
      ),
    },
    /* 4 — data, understanding */
    {
      kind: 'quiz',
      id: 'q4',
      prompt: L('What is the median of the data $3,\\ 9,\\ 4,\\ 12,\\ 7,\\ 5$?', 'Berapa median dari data $3,\\ 9,\\ 4,\\ 12,\\ 7,\\ 5$?'),
      options: [L('$6$', '$6$'), L('$5$', '$5$'), L('$7$', '$7$'), L('$8$', '$8$')],
      answer: 0,
      explain: L(
        'Sort first: $3,4,5,7,9,12$. There are six values, so the median is the average of the 3rd and 4th: $\\frac{5+7}{2}=6$. The value 8 comes from taking the middle of the unsorted list.',
        'Urutkan dulu: $3,4,5,7,9,12$. Ada enam nilai, jadi median adalah rata-rata nilai ke-3 dan ke-4: $\\frac{5+7}{2}=6$. Nilai 8 berasal dari mengambil bagian tengah daftar yang belum diurutkan.',
      ),
      hint: L(
        'Put the numbers in order first. With an even number of values, average the two middle ones.',
        'Urutkan bilangan dulu. Bila banyak nilai genap, rata-ratakan kedua nilai tengah.',
      ),
    },
    /* 5 — data, application */
    {
      kind: 'judge',
      id: 'j1',
      prompt: L(
        'The bars show four scores: 4, 6, 8 and 2. Decide whether each statement is True or False.',
        'Batang-batang menunjukkan empat nilai: 4, 6, 8, dan 2. Tentukan tiap pernyataan Benar atau Salah.',
      ),
      figure: {
        ...barChart({
          bars: [4, 6, 8, 2].map((v, i) => ({ label: String(i + 1), value: v, color: (['a', 'b', 'c', 'result'] as const)[i] })),
          max: 8,
          step: 2,
        }),
        caption: L('Four scores.', 'Empat nilai.'),
      },
      statements: [
        L('The mean is 5.', 'Rata-ratanya 5.'),
        L('The range is 6.', 'Jangkauannya 6.'),
        L('The median is 6.', 'Mediannya 6.'),
        L('The mode is 8.', 'Modusnya 8.'),
      ],
      answer: [true, true, false, false],
      explain: L(
        'The mean is $\\frac{20}{4}=5$ and the range is $8-2=6$. Sorted, the data are $2,4,6,8$, so the median is $\\frac{4+6}{2}=5$. No value repeats, so there is no mode.',
        'Rata-ratanya $\\frac{20}{4}=5$ dan jangkauannya $8-2=6$. Terurut, datanya $2,4,6,8$, jadi mediannya $\\frac{4+6}{2}=5$. Tidak ada nilai yang berulang, jadi tidak ada modus.',
      ),
      hint: L(
        'For the median, sort the scores and average the two middle ones.',
        'Untuk median, urutkan nilai lalu rata-ratakan kedua nilai tengah.',
      ),
    },
    /* 6 — numbers, application */
    {
      kind: 'math',
      id: 'm1',
      prompt: L(
        'Rp4,000,000 is saved at 5% compound interest a year. How many rupiah is the balance after 2 years?',
        'Uang Rp4.000.000 ditabung dengan bunga majemuk 5% per tahun. Berapa rupiah saldo setelah 2 tahun?',
      ),
      blanks: [{ label: 'Rp', answer: 4410000 }],
      hints: [
        L('Each year the balance is multiplied by the same factor. What is it for 5%?', 'Setiap tahun saldo dikalikan faktor yang sama. Berapa untuk 5%?'),
        L('The factor is $1.05$, and 2 years means $1.05^2$.', 'Faktornya $1{,}05$, dan 2 tahun berarti $1{,}05^2$.'),
        L('$1.05^2=1.1025$. Multiply by $4\\,000\\,000$.', '$1{,}05^2=1{,}1025$. Kalikan dengan $4\\,000\\,000$.'),
      ],
      explain: L(
        '$4\\,000\\,000\\times1.05^2=4\\,000\\,000\\times1.1025=4\\,410\\,000$. Simple interest would give only $4\\,400\\,000$.',
        '$4\\,000\\,000\\times1{,}05^2=4\\,000\\,000\\times1{,}1025=4\\,410\\,000$. Bunga tunggal hanya memberi $4\\,400\\,000$.',
      ),
      solution: {
        en: ['4\\,000\\,000\\times1.05^2', '=4\\,000\\,000\\times1.1025=4\\,410\\,000'],
        id: ['4\\,000\\,000\\times1{,}05^2', '=4\\,000\\,000\\times1{,}1025=4\\,410\\,000'],
      },
    },
    /* 7 — measurement, application */
    {
      kind: 'multi',
      id: 'mc1',
      prompt: L(
        'A cone has radius 6 and height 8. Choose the TWO true statements.',
        'Sebuah kerucut berjari-jari 6 dan tinggi 8. Pilih DUA pernyataan yang benar.',
      ),
      figure: {
        ...cone2d({ r: 6, h: 8, labels: { r: '6', h: '8' } }),
        caption: L('A cone with radius 6 and height 8.', 'Kerucut dengan jari-jari 6 dan tinggi 8.'),
      },
      options: [
        L('The slant height is 10.', 'Garis pelukisnya 10.'),
        L('The volume is $96\\pi$.', 'Volumenya $96\\pi$.'),
        L('The curved surface area is $48\\pi$.', 'Luas selimutnya $48\\pi$.'),
        L('The total surface area is $84\\pi$.', 'Luas permukaan totalnya $84\\pi$.'),
      ],
      answer: [0, 1],
      explain: L(
        'The slant height is $\\sqrt{36+64}=10$ and the volume is $\\frac{1}{3}\\pi\\times36\\times8=96\\pi$. The curved area is $\\pi rs=60\\pi$ (not $48\\pi$), and the total is $36\\pi+60\\pi=96\\pi$ (not $84\\pi$).',
        'Garis pelukisnya $\\sqrt{36+64}=10$ dan volumenya $\\frac{1}{3}\\pi\\times36\\times8=96\\pi$. Luas selimutnya $\\pi rs=60\\pi$ (bukan $48\\pi$), dan totalnya $36\\pi+60\\pi=96\\pi$ (bukan $84\\pi$).',
      ),
      hint: L(
        'Find the slant height with Pythagoras first, then test each formula.',
        'Cari garis pelukis dengan Pythagoras dulu, lalu uji tiap rumus.',
      ),
    },
    /* 8 — sequences, application */
    {
      kind: 'quiz',
      id: 'q5',
      prompt: L(
        'In an arithmetic sequence $U_2=7$ and $U_6=19$. What is $U_{10}$?',
        'Pada barisan aritmetika, $U_2=7$ dan $U_6=19$. Berapa $U_{10}$?',
      ),
      options: [L('$31$', '$31$'), L('$28$', '$28$'), L('$34$', '$34$'), L('$25$', '$25$')],
      answer: 0,
      explain: L(
        'From $U_6-U_2=4b=12$, $b=3$. Then $U_{10}=U_6+4b=19+12=31$. The value 28 adds 3 only three times, and 25 adds 6.',
        'Dari $U_6-U_2=4b=12$, $b=3$. Maka $U_{10}=U_6+4b=19+12=31$. Nilai 28 hanya menambah 3 sebanyak tiga kali, dan 25 menambah 6.',
      ),
      hint: L(
        'From $U_2$ to $U_6$ there are 4 steps. Use that to find the difference.',
        'Dari $U_2$ ke $U_6$ ada 4 langkah. Pakai itu untuk mencari bedanya.',
      ),
    },
    /* 9 — circle, application */
    {
      kind: 'quiz',
      id: 'q6',
      prompt: L(
        'A circle has centre $O$ and radius 6. The point $P$ is 10 from $O$, and $PT$ touches the circle at $T$. How long is $PT$?',
        'Sebuah lingkaran berpusat $O$ dan berjari-jari 6. Titik $P$ berjarak 10 dari $O$, dan $PT$ menyinggung lingkaran di $T$. Berapa panjang $PT$?',
      ),
      figure: {
        ...rightTriangle({ a: 8, b: 6, corners: ['T', 'P', 'O'], sides: { across: '?', up: '6', slant: '10' } }),
        caption: L('The triangle OTP has a right angle at T.', 'Segitiga OTP siku-siku di T.'),
      },
      options: [L('$8$', '$8$'), L('$4$', '$4$'), L('$16$', '$16$'), L('$\\sqrt{136}$', '$\\sqrt{136}$')],
      answer: 0,
      explain: L(
        'A tangent is perpendicular to the radius, so $PT^2=OP^2-OT^2=100-36=64$ and $PT=8$. The value $\\sqrt{136}$ adds the squares instead of subtracting.',
        'Garis singgung tegak lurus jari-jari, jadi $PT^2=OP^2-OT^2=100-36=64$ dan $PT=8$. Nilai $\\sqrt{136}$ menjumlahkan kuadrat, bukan mengurangkan.',
      ),
      hint: L(
        'Which side of the right triangle is the longest? That one is $OP$.',
        'Sisi mana pada segitiga siku-siku yang terpanjang? Itu $OP$.',
      ),
    },
    /* 10 — reasoning */
    {
      kind: 'math',
      id: 'm2',
      prompt: L(
        'Two numbers add up to 14, and the sum of their squares is 100. What is their product?',
        'Dua bilangan berjumlah 14, dan jumlah kuadratnya 100. Berapa hasil kalinya?',
      ),
      blanks: [{ answer: 48 }],
      hints: [
        L('Let the numbers be $a$ and $b$. You know $a+b$ and $a^2+b^2$, and you want $ab$.', 'Misalkan bilangannya $a$ dan $b$. Kamu tahu $a+b$ dan $a^2+b^2$, dan kamu mencari $ab$.'),
        L('Square the sum: $(a+b)^2=a^2+2ab+b^2$.', 'Kuadratkan jumlahnya: $(a+b)^2=a^2+2ab+b^2$.'),
        L('$14^2=100+2ab$.', '$14^2=100+2ab$.'),
      ],
      explain: L(
        '$(a+b)^2=196$, so $100+2ab=196$ and $2ab=96$, giving $ab=48$. (The numbers are 6 and 8... check: $6+8=14$ and $36+64=100$ ✓.)',
        '$(a+b)^2=196$, jadi $100+2ab=196$ dan $2ab=96$, sehingga $ab=48$. (Bilangannya 6 dan 8... periksa: $6+8=14$ dan $36+64=100$ ✓.)',
      ),
      solution: ['(a+b)^2=a^2+2ab+b^2', '196=100+2ab \\Rightarrow ab=48'],
    },
    /* 11 — counting, reasoning */
    {
      kind: 'multi',
      id: 'mc2',
      prompt: L(
        'A committee of 3 people is chosen from 4 boys and 3 girls. Choose the TWO true statements.',
        'Sebuah panitia 3 orang dipilih dari 4 anak laki-laki dan 3 anak perempuan. Pilih DUA pernyataan yang benar.',
      ),
      options: [
        L('There are 35 possible committees.', 'Ada 35 panitia yang mungkin.'),
        L('There are 12 committees with exactly 2 girls.', 'Ada 12 panitia dengan tepat 2 perempuan.'),
        L('There are 6 committees of only boys.', 'Ada 6 panitia yang hanya laki-laki.'),
        L('There are 30 committees with at least 1 girl.', 'Ada 30 panitia dengan sedikitnya 1 perempuan.'),
      ],
      answer: [0, 1],
      explain: L(
        'The total is $C(7,3)=35$. Exactly 2 girls: $C(3,2)\\times C(4,1)=3\\times4=12$. Only boys: $C(4,3)=4$ (not 6), so at least 1 girl is $35-4=31$ (not 30).',
        'Totalnya $C(7,3)=35$. Tepat 2 perempuan: $C(3,2)\\times C(4,1)=3\\times4=12$. Hanya laki-laki: $C(4,3)=4$ (bukan 6), jadi sedikitnya 1 perempuan adalah $35-4=31$ (bukan 30).',
      ),
      hint: L(
        'The order does not matter, so use combinations. For "at least one", subtract the "none" case from the total.',
        'Urutan tidak berpengaruh, jadi pakai kombinasi. Untuk "sedikitnya satu", kurangkan kasus "tidak ada" dari total.',
      ),
    },
    /* 12 — mixed, reasoning */
    {
      kind: 'math',
      id: 'm3',
      prompt: L(
        'A ball is thrown upward from a balcony. Its height in metres after $t$ seconds is $h=-5t^2+20t+25$. After how many seconds does it hit the ground?',
        'Sebuah bola dilempar ke atas dari balkon. Tingginya dalam meter setelah $t$ detik adalah $h=-5t^2+20t+25$. Setelah berapa detik bola menyentuh tanah?',
      ),
      blanks: [{ label: 't =', answer: 5, after: '\\text{s}' }],
      hints: [
        L('The ball is on the ground when $h=0$.', 'Bola berada di tanah saat $h=0$.'),
        L('Divide $-5t^2+20t+25=0$ by $-5$: $t^2-4t-5=0$.', 'Bagi $-5t^2+20t+25=0$ dengan $-5$: $t^2-4t-5=0$.'),
        L('Factor: two numbers with product $-5$ and sum $-4$. Only the positive solution makes sense.', 'Faktorkan: dua bilangan berhasil kali $-5$ dan berjumlah $-4$. Hanya penyelesaian positif yang masuk akal.'),
      ],
      explain: L(
        '$t^2-4t-5=(t-5)(t+1)=0$, so $t=5$ or $t=-1$. A time cannot be negative, so the ball lands after 5 seconds.',
        '$t^2-4t-5=(t-5)(t+1)=0$, jadi $t=5$ atau $t=-1$. Waktu tidak mungkin negatif, jadi bola mendarat setelah 5 detik.',
      ),
      solution: ['-5t^2+20t+25=0 \\Rightarrow t^2-4t-5=0', '(t-5)(t+1)=0', 't=5'],
    },
  ],
}
