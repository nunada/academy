import type { Submodule } from '../types'
import { L, barChart, dot, numberLine, plane } from './figs'
import { lessonSufficiency } from './m10d-kecukupan'

/** Module 10, submodule 2 — the three TKA question formats: one-answer
 *  multiple choice, choose-all-that-apply, and True/False statements, plus a
 *  plan for the time. */

const parabola = (items: Parameters<typeof plane>[0] = []) =>
  plane([{ t: 'curve', f: '(x-1)*(x-5)', from: 0, to: 6, color: 'a' }, ...items], { x: [-1, 7], y: [-6, 8] })

export const m10s2: Submodule = {
  id: 'tka-sma-m10-s2',
  title: L('TKA Question Formats', 'Bentuk Soal TKA'),
  summary: L(
    'How to read and answer the three TKA formats: one correct option, choose all that apply, and True/False statements, and how to plan your time.',
    'Cara membaca dan menjawab tiga bentuk soal TKA: satu pilihan benar, pilih semua yang benar, dan pernyataan Benar/Salah, serta cara merencanakan waktu.',
  ),
  lessons: [
    /* ------------------------------------------------- L1 multiple choice */
    {
      id: 'tka-sma-m10-s2-l1',
      title: L('Multiple Choice and Choose-All-That-Apply', 'Pilihan Ganda dan Pilihan Ganda Kompleks'),
      goal: L(
        'You can answer a one-answer question by solving or by elimination, and a choose-all question by testing every option on its own.',
        'Kamu bisa menjawab soal satu jawaban dengan menghitung atau dengan eliminasi, dan soal pilih-semua dengan menguji tiap pilihan sendiri-sendiri.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Reading a TKA Question', 'Ayo Amati: Membaca Soal TKA'),
          body: L(
            'A TKA multiple-choice question has a **stem** (the question and any picture) and **options**. Three of the options are usually **distractors**: answers made from a common mistake.\n\n- Read the stem **twice**, and use every number and label in the picture.\n- Decide what you expect **before** you look at the options.\n- Look at the picture below: a parabola with the labeled points on it. Which equation matches it? Read first: it opens **upward**, and its lowest point (the vertex) is at $x=3$.\n\nThe official TKA question forms are: **simple multiple choice** (one correct answer), **complex multiple choice** (choose ALL correct answers, or a table of True/False or Agree/Disagree statements). The complex forms give credit only when every part is right. A question may be **single** or part of a **group** that shares one stimulus (a text, table or picture) with several questions.',
            'Soal pilihan ganda TKA punya **pokok soal** (pertanyaan dan gambar apa pun) dan **pilihan**. Tiga dari pilihan biasanya adalah **pengecoh**: jawaban yang dibuat dari kesalahan umum.\n\n- Baca pokok soal **dua kali**, dan pakai setiap bilangan dan label pada gambar.\n- Tentukan apa yang kamu harapkan **sebelum** melihat pilihan.\n- Lihat gambar di bawah: parabola dengan titik-titik berlabel di atasnya. Persamaan mana yang cocok? Baca dulu: parabola membuka ke **atas**, dan titik terendahnya (puncak) ada di $x=3$.\n\nBentuk soal TKA yang resmi adalah: **pilihan ganda sederhana** (satu jawaban benar), **pilihan ganda kompleks** (pilih SEMUA jawaban yang benar, atau tabel pernyataan Benar/Salah atau Sesuai/Tidak Sesuai). Bentuk kompleks hanya memberi nilai bila setiap bagian benar. Soal bisa **tunggal** atau bagian dari **grup** yang memakai satu stimulus (teks, tabel, atau gambar) untuk beberapa soal.',
          ),
          figure: {
            ...parabola([dot([1, 0], undefined, 'result'), dot([5, 0], undefined, 'result'), dot([3, -4], undefined, 'b')]),
            caption: L('A parabola through the red points (1, 0) and (5, 0), with its vertex marked.', 'Parabola melalui titik merah (1, 0) dan (5, 0), dengan puncaknya ditandai.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: One Answer, by Elimination', 'Contoh Bertahap: Satu Jawaban, dengan Eliminasi'),
          body: L(
            'Which equation fits the parabola of the picture?\n\n$\\text{A. }y=(x-1)(x-5)\\quad\\text{B. }y=(x+1)(x+5)\\quad\\text{C. }y=-(x-1)(x-5)\\quad\\text{D. }y=(x-3)^2+4$\n\n1. Step 1: Opens upward, so the coefficient of $x^2$ is positive. This removes **C**.\n2. Step 2: It crosses the $x$-axis at $x=1$ and $x=5$, so the factors are $(x-1)$ and $(x-5)$. B has roots $-1$ and $-5$: removed.\n3. Step 3: D has its lowest point at $y=4$, above the axis, so it never crosses the axis: removed.\n4. Step 4: Only **A** is left. Check one point: at $x=3$, $(3-1)(3-5)=-4$, the vertex ✓.\n\nElimination works because each wrong option fails **one clear test**. Even when you are unsure, removing two options doubles your chance.',
            'Persamaan mana yang cocok dengan parabola pada gambar?\n\n$\\text{A. }y=(x-1)(x-5)\\quad\\text{B. }y=(x+1)(x+5)\\quad\\text{C. }y=-(x-1)(x-5)\\quad\\text{D. }y=(x-3)^2+4$\n\n1. Langkah 1: Membuka ke atas, jadi koefisien $x^2$ positif. Ini menyingkirkan **C**.\n2. Langkah 2: Memotong sumbu $x$ di $x=1$ dan $x=5$, jadi faktornya $(x-1)$ dan $(x-5)$. B punya akar $-1$ dan $-5$: disingkirkan.\n3. Langkah 3: D punya titik terendah di $y=4$, di atas sumbu, jadi tidak pernah memotong sumbu: disingkirkan.\n4. Langkah 4: Hanya **A** yang tersisa. Periksa satu titik: pada $x=3$, $(3-1)(3-5)=-4$, yaitu puncak ✓.\n\nEliminasi berhasil karena setiap pilihan yang salah gagal pada **satu uji yang jelas**. Bahkan saat ragu, menyingkirkan dua pilihan menggandakan peluangmu.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Choose All That Apply', 'Contoh Bertahap: Pilih Semua yang Benar'),
          body: L(
            'In a choose-all question every option is a **separate** statement that is true or false. The prompt says "choose the TWO" or "choose ALL that apply".\n\nFor $y=(x-1)(x-5)$, which statements are true? Judge each one on its own:\n\n- "It meets the $x$-axis at $x=1$ and $x=5$." True: these are the roots.\n- "Its vertex is $(3,-4)$." True: $x=\\frac{1+5}{2}=3$ and $(3-1)(3-5)=-4$.\n- "It opens downward." False: the coefficient of $x^2$ is $+1$.\n- "Its $y$-intercept is $-5$." False: at $x=0$, $(-1)(-5)=+5$.\n\nDo **not** stop after finding two true options when the prompt says "all that apply". And do not guess the number: test every option. Choose-all questions give credit only for the **exact** set.',
            'Pada soal pilih-semua setiap pilihan adalah pernyataan yang **terpisah**, benar atau salah. Pokok soal berbunyi "pilih DUA" atau "pilih SEMUA yang benar".\n\nUntuk $y=(x-1)(x-5)$, pernyataan mana yang benar? Nilai tiap pernyataan sendiri-sendiri:\n\n- "Memotong sumbu $x$ di $x=1$ dan $x=5$." Benar: itulah akar-akarnya.\n- "Puncaknya $(3,-4)$." Benar: $x=\\frac{1+5}{2}=3$ dan $(3-1)(3-5)=-4$.\n- "Membuka ke bawah." Salah: koefisien $x^2$ adalah $+1$.\n- "Titik potong sumbu $y$ adalah $-5$." Salah: pada $x=0$, $(-1)(-5)=+5$.\n\n**Jangan** berhenti setelah menemukan dua pilihan benar bila soal berbunyi "semua yang benar". Dan jangan menebak jumlahnya: uji setiap pilihan. Soal pilih-semua hanya memberi nilai untuk himpunan yang **tepat**.',
          ),
        },
        {
          kind: 'concept',
          id: 'c4',
          title: L('Watch Out!: Reading Traps', 'Awas, Jebakan!: Jebakan Membaca'),
          body: L(
            '- **NOT and EXCEPT.** "Which is NOT true?" turns the question round. Mark the word in your mind, then find the **false** one.\n- **Close options.** $\\frac{1}{2}$ and $-\\frac{1}{2}$, or $4\\pi$ and $2\\pi$ differ by one slip. Recheck the sign and the factor.\n- **Half-way answers.** An option can be the value of an earlier step (like the radius when the area is asked).\n- **Units and form.** Answer in the unit and the form the question asks: meters or centimeters, exact or decimal.\n- **Do not choose by the look of an option.** The longest or the most complicated option is not the answer by default.\n- **Never leave a question empty.** A wrong answer costs no more than an empty one, so give your best guess after eliminating.',
            '- **BUKAN dan KECUALI.** "Manakah yang BUKAN benar?" membalik pertanyaan. Tandai kata itu dalam pikiranmu, lalu cari yang **salah**.\n- **Pilihan yang berdekatan.** $\\frac{1}{2}$ dan $-\\frac{1}{2}$, atau $4\\pi$ dan $2\\pi$ berbeda satu kekeliruan. Periksa kembali tanda dan faktornya.\n- **Jawaban setengah jalan.** Sebuah pilihan dapat berupa nilai langkah sebelumnya (seperti jari-jari padahal luas yang ditanyakan).\n- **Satuan dan bentuk.** Jawablah dalam satuan dan bentuk yang diminta soal: meter atau sentimeter, eksak atau desimal.\n- **Jangan memilih berdasarkan tampilan pilihan.** Pilihan terpanjang atau terumit bukan jawabannya secara otomatis.\n- **Jangan biarkan soal kosong.** Jawaban salah tidak lebih merugikan daripada kosong, jadi berikan tebakan terbaikmu setelah mengeliminasi.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph shows a parabola through the red points $(1,0)$ and $(5,0)$ with its lowest point at $(3,-4)$. Which equation matches it?',
            'Grafik menunjukkan parabola melalui titik merah $(1,0)$ dan $(5,0)$ dengan titik terendah di $(3,-4)$. Persamaan manakah yang cocok?',
          ),
          figure: {
            ...parabola([dot([1, 0], undefined, 'result'), dot([5, 0], undefined, 'result'), dot([3, -4], undefined, 'b')]),
            caption: L('A parabola with two roots and a vertex.', 'Parabola dengan dua akar dan satu puncak.'),
          },
          options: [
            L('$y=(x-1)(x-5)$', '$y=(x-1)(x-5)$'),
            L('$y=(x+1)(x+5)$', '$y=(x+1)(x+5)$'),
            L('$y=-(x-1)(x-5)$', '$y=-(x-1)(x-5)$'),
            L('$y=(x-3)^2+4$', '$y=(x-3)^2+4$'),
          ],
          answer: 0,
          explain: L(
            'The roots 1 and 5 give the factors $(x-1)(x-5)$, and the upward opening needs a positive coefficient. B has the wrong signs of the roots, C opens downward and D has its vertex at $(3,4)$.',
            'Akar 1 dan 5 memberi faktor $(x-1)(x-5)$, dan bukaan ke atas memerlukan koefisien positif. B salah tanda akarnya, C membuka ke bawah, dan D berpuncak di $(3,4)$.',
          ),
          hint: L(
            'Eliminate: which options open downward, and which have the wrong roots or the wrong vertex?',
            'Eliminasi: pilihan mana yang membuka ke bawah, dan mana yang akarnya atau puncaknya salah?',
          ),
        },
        {
          kind: 'quiz',
          id: 'q2',
          prompt: L(
            'Without a calculator: which whole number is closest to $\\sqrt{50}$?',
            'Tanpa kalkulator: bilangan bulat manakah yang paling dekat dengan $\\sqrt{50}$?',
          ),
          options: [L('7', '7'), L('6', '6'), L('8', '8'), L('25', '25')],
          answer: 0,
          explain: L(
            '$7^2=49$ is very close to 50, while $8^2=64$ is far away. So $\\sqrt{50}\\approx7$. The value 25 is half of 50, which is a classic mistake.',
            '$7^2=49$ sangat dekat dengan 50, sedangkan $8^2=64$ jauh. Jadi $\\sqrt{50}\\approx7$. Nilai 25 adalah setengah dari 50, yang merupakan kesalahan klasik.',
          ),
          hint: L(
            'Square the numbers around your guess and compare with 50.',
            'Kuadratkan bilangan di sekitar tebakanmu dan bandingkan dengan 50.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: check the vertex of $y=(x-1)(x-5)$ at $x=3$.',
            'Coba bersama: periksa puncak $y=(x-1)(x-5)$ di $x=3$.',
          ),
          template: '(3-1)(3-5)=2\\times(-2)=___',
          blanks: ['-4'],
          explain: L(
            '$3-1=2$ and $3-5=-2$, so the product is $-4$.',
            '$3-1=2$ dan $3-5=-2$, jadi hasil kalinya $-4$.',
          ),
          hint: L(
            'Work out each bracket first, then multiply. A positive times a negative is negative.',
            'Hitung tiap kurung dulu, lalu kalikan. Positif kali negatif adalah negatif.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements about $y=(x-1)(x-5)$.', 'Pilih DUA pernyataan yang benar tentang $y=(x-1)(x-5)$.'),
          options: [
            L('The graph meets the $x$-axis at $x=1$ and $x=5$.', 'Grafik memotong sumbu $x$ di $x=1$ dan $x=5$.'),
            L('The vertex is the point $(3,-4)$.', 'Puncaknya adalah titik $(3,-4)$.'),
            L('The parabola opens downward.', 'Parabola membuka ke bawah.'),
            L('The $y$-intercept is $-5$.', 'Titik potong sumbu $y$ adalah $-5$.'),
          ],
          answer: [0, 1],
          explain: L(
            'The roots are 1 and 5, and the vertex is halfway at $x=3$ with $y=-4$. The parabola opens upward, and at $x=0$ the value is $(-1)(-5)=5$.',
            'Akar-akarnya 1 dan 5, dan puncaknya di tengah pada $x=3$ dengan $y=-4$. Parabola membuka ke atas, dan pada $x=0$ nilainya $(-1)(-5)=5$.',
          ),
          hint: L(
            'Test each statement on its own: factors give the roots, $x=0$ gives the $y$-intercept.',
            'Uji tiap pernyataan sendiri-sendiri: faktor memberi akar, $x=0$ memberi titik potong sumbu $y$.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc2',
          prompt: L('Choose ALL the irrational numbers.', 'Pilih SEMUA bilangan irasional.'),
          options: [
            L('$\\sqrt{2}$', '$\\sqrt{2}$'),
            L('$\\pi$', '$\\pi$'),
            L('$0.25$', '$0{,}25$'),
            L('$\\sqrt{81}$', '$\\sqrt{81}$'),
          ],
          answer: [0, 1],
          explain: L(
            '$\\sqrt{2}$ and $\\pi$ have decimals that never end or repeat. $0.25=\\frac{1}{4}$ and $\\sqrt{81}=9$ are rational.',
            '$\\sqrt{2}$ dan $\\pi$ punya desimal yang tidak berakhir dan tidak berulang. $0{,}25=\\frac{1}{4}$ dan $\\sqrt{81}=9$ adalah rasional.',
          ),
          hint: L(
            'The prompt says ALL, so test all four. Simplify each root first.',
            'Soal berbunyi SEMUA, jadi uji keempatnya. Sederhanakan tiap akar dulu.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'How many integers $x$ satisfy $(x-1)(x-5)<0$?',
            'Ada berapa bilangan bulat $x$ yang memenuhi $(x-1)(x-5)<0$?',
          ),
          blanks: [{ answer: 3 }],
          hints: [
            L('The parabola $y=(x-1)(x-5)$ is below the $x$-axis between its roots.', 'Parabola $y=(x-1)(x-5)$ berada di bawah sumbu $x$ di antara akar-akarnya.'),
            L('So $1<x<5$, with both ends **not** included.', 'Jadi $1<x<5$, dengan kedua ujung **tidak** termasuk.'),
            L('List the integers strictly between 1 and 5.', 'Daftar bilangan bulat yang tepat di antara 1 dan 5.'),
          ],
          explain: L(
            'The integers are 2, 3 and 4: three of them. The values 1 and 5 give 0, which is not less than 0.',
            'Bilangan bulatnya 2, 3, dan 4: tiga buah. Nilai 1 dan 5 memberi 0, yang tidak kurang dari 0.',
          ),
          solution: {
            en: ['(x-1)(x-5)<0 \\Rightarrow 1<x<5', 'x=2,3,4 \\Rightarrow \\text{3 integers}'],
            id: ['(x-1)(x-5)<0 \\Rightarrow 1<x<5', 'x=2,3,4 \\Rightarrow \\text{3 bilangan bulat}'],
          },
        },
      ],
    },
    /* ----------------------------------------- L2 true/false and time */
    {
      id: 'tka-sma-m10-s2-l2',
      title: L('True/False Statements and Managing Your Time', 'Pernyataan Benar/Salah dan Mengatur Waktu'),
      goal: L(
        'You can judge a table of statements one by one, test a doubtful statement, and plan the minutes of a test.',
        'Kamu bisa menilai tabel pernyataan satu per satu, menguji pernyataan yang meragukan, dan merencanakan menit-menit suatu tes.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: A Table of Statements', 'Ayo Amati: Tabel Pernyataan'),
          body: L(
            'In a True/False question you get one picture or situation and **several statements**. For each statement you mark **True** or **False**. You earn the mark only when **all** the rows are right.\n\nThe picture shows five scores. Judge each statement alone:\n\n- "The mean is 6": $\\frac{3+5+5+7+10}{5}=\\frac{30}{5}=6$. True.\n- "The median is 6": the middle of $3,5,5,7,10$ is 5. False.\n- "The range is 10": $10-3=7$. False.\n\nA statement does not depend on the others. It is common that all rows are True, or all False, or a mix: do not expect a pattern.',
            'Pada soal Benar/Salah kamu diberi satu gambar atau situasi dan **beberapa pernyataan**. Untuk tiap pernyataan kamu menandai **Benar** atau **Salah**. Kamu mendapat nilai hanya bila **semua** baris benar.\n\nGambar menunjukkan lima nilai. Nilai tiap pernyataan sendiri-sendiri:\n\n- "Rata-ratanya 6": $\\frac{3+5+5+7+10}{5}=\\frac{30}{5}=6$. Benar.\n- "Mediannya 6": nilai tengah $3,5,5,7,10$ adalah 5. Salah.\n- "Jangkauannya 10": $10-3=7$. Salah.\n\nSebuah pernyataan tidak bergantung pada yang lain. Bisa saja semua baris Benar, semua Salah, atau campuran: jangan mengharapkan pola.',
          ),
          figure: {
            ...barChart({
              bars: [3, 5, 5, 7, 10].map((v, i) => ({ label: String(i + 1), value: v, color: (['a', 'b', 'c', 'result', 'a'] as const)[i] })),
              max: 10,
              step: 5,
            }),
            caption: L('Five scores: 3, 5, 5, 7 and 10.', 'Lima nilai: 3, 5, 5, 7, dan 10.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Judging One Statement', 'Contoh Bertahap: Menilai Satu Pernyataan'),
          body: L(
            'For each statement, **compute or test it yourself**. Do not just trust how it sounds.\n\nThe picture shows the lines $y=2x+1$ (green) and $y=2x-3$ (orange).\n\n- "The lines are parallel." Both have gradient 2, so **True**.\n- "The lines meet at exactly one point." Parallel lines never meet, so **False**.\n- "The line $y=2x-3$ passes through $(0,3)$." At $x=0$, $y=-3$, so **False**.\n\nIf a statement says **always**, **never**, **every** or **only**, look for one counterexample. If you find one, the statement is False. If a statement says **some** or **at least one**, one example is enough to make it True.',
            'Untuk tiap pernyataan, **hitung atau ujilah sendiri**. Jangan hanya percaya pada bunyinya.\n\nGambar menunjukkan garis $y=2x+1$ (hijau) dan $y=2x-3$ (oranye).\n\n- "Garis-garis itu sejajar." Keduanya bergradien 2, jadi **Benar**.\n- "Garis-garis itu bertemu di tepat satu titik." Garis sejajar tidak pernah bertemu, jadi **Salah**.\n- "Garis $y=2x-3$ melalui $(0,3)$." Pada $x=0$, $y=-3$, jadi **Salah**.\n\nJika pernyataan memuat **selalu**, **tidak pernah**, **setiap**, atau **hanya**, cari satu contoh penyangkal. Jika ketemu, pernyataan itu Salah. Jika pernyataan memuat **beberapa** atau **sedikitnya satu**, satu contoh sudah cukup untuk menjadikannya Benar.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2*x+1', from: -3, to: 4, color: 'a' },
                { t: 'curve', f: '2*x-3', from: -2, to: 5, color: 'b' },
              ],
              { x: [-4, 6], y: [-8, 10] },
            ),
            caption: L('The lines y = 2x + 1 (green) and y = 2x - 3 (orange).', 'Garis y = 2x + 1 (hijau) dan y = 2x - 3 (oranye).'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Planning Your Time', 'Contoh Bertahap: Merencanakan Waktu'),
          body: L(
            'A test has a fixed time, so give each question a **budget**.\n\nA test has 20 questions and lasts 60 minutes. You decide: 5 hard questions get 4 minutes each, 10 minutes are kept for checking, and the other questions share the rest equally.\n\n1. Step 1: The hard questions: $5\\times4=20$ minutes.\n2. Step 2: Time left for the other 15 questions: $60-10-20=30$ minutes.\n3. Step 3: Each of them gets $\\frac{30}{15}=2$ minutes.\n\nHow to use the plan:\n\n- Do the **easy** questions first and collect the sure marks.\n- If a question eats more than its budget, **mark it and move on**; come back at the end.\n- Keep the last minutes for **checking** signs, units and what was asked.\n- Leave nothing empty: a guess after elimination is better than a blank.',
            'Sebuah tes punya waktu tetap, jadi beri tiap soal sebuah **anggaran**.\n\nSebuah tes punya 20 soal dan berlangsung 60 menit. Kamu memutuskan: 5 soal sulit mendapat 4 menit masing-masing, 10 menit disimpan untuk memeriksa, dan soal lainnya berbagi sisanya sama banyak.\n\n1. Langkah 1: Soal sulit: $5\\times4=20$ menit.\n2. Langkah 2: Waktu tersisa untuk 15 soal lainnya: $60-10-20=30$ menit.\n3. Langkah 3: Masing-masing mendapat $\\frac{30}{15}=2$ menit.\n\nCara memakai rencana:\n\n- Kerjakan soal **mudah** lebih dulu dan kumpulkan nilai yang pasti.\n- Jika sebuah soal menghabiskan lebih dari anggarannya, **tandai dan lanjut**; kembali di akhir.\n- Sisakan menit terakhir untuk **memeriksa** tanda, satuan, dan apa yang ditanyakan.\n- Jangan biarkan kosong: tebakan setelah eliminasi lebih baik daripada kosong.',
          ),
        },
        {
          kind: 'concept',
          id: 'c4',
          title: L('Watch Out!: Statements, Time and Nerves', 'Awas, Jebakan!: Pernyataan, Waktu, dan Gugup'),
          body: L(
            '- **One wrong row ruins the question.** Spend a few seconds on each row, not only on the one that looks hard.\n- **Do not copy a pattern.** After three True rows you may feel the fourth "must" be False. Judge it on its own.\n- **Small words matter.** "Always", "never", "exactly", "only", "at least": reread them.\n- **Sign and unit slips** hide in statements such as "$\\cos120^{\\circ}$ is positive" or "$3\\ \\text{m}^2=300\\ \\text{cm}^2$".\n- **Stay calm.** If your mind goes blank, breathe, read the question again, and write down what is given. A calm start is worth more than a rushed first minute.\n- **Review what you were unsure of**, not everything: that is where the marks are.',
            '- **Satu baris yang salah merusak soal.** Luangkan beberapa detik untuk tiap baris, bukan hanya untuk yang tampak sulit.\n- **Jangan meniru pola.** Setelah tiga baris Benar kamu mungkin merasa baris keempat "pasti" Salah. Nilai sendiri-sendiri.\n- **Kata kecil itu penting.** "Selalu", "tidak pernah", "tepat", "hanya", "paling sedikit": baca ulang.\n- **Kekeliruan tanda dan satuan** bersembunyi dalam pernyataan seperti "$\\cos120^{\\circ}$ positif" atau "$3\\ \\text{m}^2=300\\ \\text{cm}^2$".\n- **Tetap tenang.** Jika pikiranmu kosong, tarik napas, baca soal lagi, dan tulis yang diketahui. Awal yang tenang lebih berharga daripada menit pertama yang tergesa-gesa.\n- **Tinjau yang kamu ragukan**, bukan semuanya: di situlah nilai berada.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The bars show the scores 3, 5, 5, 7 and 10. Which statement is true?',
            'Batang-batang menunjukkan nilai 3, 5, 5, 7, dan 10. Pernyataan manakah yang benar?',
          ),
          figure: {
            ...barChart({
              bars: [3, 5, 5, 7, 10].map((v, i) => ({ label: String(i + 1), value: v, color: (['a', 'b', 'c', 'result', 'a'] as const)[i] })),
              max: 10,
              step: 5,
              showValues: false,
            }),
            caption: L('Five scores.', 'Lima nilai.'),
          },
          options: [
            L('The mean is 6.', 'Rata-ratanya 6.'),
            L('The median is 6.', 'Mediannya 6.'),
            L('The mode is 7.', 'Modusnya 7.'),
            L('The range is 10.', 'Jangkauannya 10.'),
          ],
          answer: 0,
          explain: L(
            'The mean is $\\frac{30}{5}=6$. The median is 5, the mode is 5 (it appears twice) and the range is $10-3=7$.',
            'Rata-ratanya $\\frac{30}{5}=6$. Mediannya 5, modusnya 5 (muncul dua kali), dan jangkauannya $10-3=7$.',
          ),
          hint: L(
            'Check each option against the data: sum divided by count, middle value, most frequent, biggest minus smallest.',
            'Periksa tiap pilihan terhadap data: jumlah dibagi banyak, nilai tengah, paling sering, terbesar dikurangi terkecil.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: the range of the five scores.',
            'Coba bersama: jangkauan kelima nilai.',
          ),
          template: '\\text{max}-\\text{min}=10-3=___',
          blanks: ['7'],
          explain: L(
            'The range is the biggest value minus the smallest: $10-3=7$.',
            'Jangkauan adalah nilai terbesar dikurangi nilai terkecil: $10-3=7$.',
          ),
          hint: L(
            'Find the highest and the lowest bar, then subtract.',
            'Cari batang tertinggi dan terendah, lalu kurangkan.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'The graph shows the lines $y=2x+1$ and $y=2x-3$. Decide whether each statement is True or False.',
            'Grafik menunjukkan garis $y=2x+1$ dan $y=2x-3$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          figure: {
            ...plane(
              [
                { t: 'curve', f: '2*x+1', from: -3, to: 4, color: 'a' },
                { t: 'curve', f: '2*x-3', from: -2, to: 5, color: 'b' },
              ],
              { x: [-4, 6], y: [-8, 10] },
            ),
            caption: L('Two lines with the same gradient.', 'Dua garis dengan gradien yang sama.'),
          },
          statements: [
            L('The two lines are parallel.', 'Kedua garis sejajar.'),
            L('The two lines meet at exactly one point.', 'Kedua garis bertemu di tepat satu titik.'),
            L('Both lines have gradient 2.', 'Kedua garis bergradien 2.'),
            L('The line $y=2x-3$ passes through $(0,3)$.', 'Garis $y=2x-3$ melalui $(0,3)$.'),
          ],
          answer: [true, false, true, false],
          explain: L(
            'Equal gradients mean the lines are parallel, so they never meet. At $x=0$ the second line has $y=-3$, not 3.',
            'Gradien yang sama berarti garis sejajar, jadi tidak pernah bertemu. Pada $x=0$ garis kedua punya $y=-3$, bukan 3.',
          ),
          hint: L(
            'Read the gradient from each equation, and substitute $x=0$ for the last statement.',
            'Baca gradien dari tiap persamaan, dan substitusikan $x=0$ untuk pernyataan terakhir.',
          ),
        },
        {
          kind: 'judge',
          id: 'j2',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$\\sqrt{16}$ is an irrational number.', '$\\sqrt{16}$ adalah bilangan irasional.'),
            L('$0.\\overline{3}$ is a rational number.', '$0{,}\\overline{3}$ adalah bilangan rasional.'),
            L('$-3$ is an integer.', '$-3$ adalah bilangan bulat.'),
            L('$\\pi=\\frac{22}{7}$ exactly.', '$\\pi=\\frac{22}{7}$ tepat.'),
          ],
          answer: [false, true, true, false],
          explain: L(
            '$\\sqrt{16}=4$ is rational. $0.\\overline{3}=\\frac{1}{3}$. Negative whole numbers are integers. And $\\frac{22}{7}$ only approximates $\\pi$.',
            '$\\sqrt{16}=4$ rasional. $0{,}\\overline{3}=\\frac{1}{3}$. Bilangan bulat negatif termasuk bilangan bulat. Dan $\\frac{22}{7}$ hanya hampiran $\\pi$.',
          ),
          hint: L(
            'Simplify the root first. Can the decimal be written as a fraction?',
            'Sederhanakan akarnya dulu. Dapatkah desimal itu ditulis sebagai pecahan?',
          ),
        },
        {
          kind: 'judge',
          id: 'j3',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('$\\sin30^{\\circ}=\\cos60^{\\circ}$.', '$\\sin30^{\\circ}=\\cos60^{\\circ}$.'),
            L('If the events $A$ and $B$ are independent, then $P(A\\cap B)=P(A)\\times P(B)$.', 'Jika kejadian $A$ dan $B$ saling bebas, maka $P(A\\cap B)=P(A)\\times P(B)$.'),
            L('$\\tan45^{\\circ}=0$.', '$\\tan45^{\\circ}=0$.'),
            L('$5!=60$.', '$5!=60$.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'Both $\\sin30^{\\circ}$ and $\\cos60^{\\circ}$ equal $\\frac{1}{2}$. $\\tan45^{\\circ}=1$, and $5!=120$ ($60$ is $P(5,3)$).',
            '$\\sin30^{\\circ}$ dan $\\cos60^{\\circ}$ sama-sama $\\frac{1}{2}$. $\\tan45^{\\circ}=1$, dan $5!=120$ ($60$ adalah $P(5,3)$).',
          ),
          hint: L(
            'Use the special-angle table for the trigonometric rows.',
            'Pakai tabel sudut istimewa untuk baris trigonometri.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'A test has 20 questions in 60 minutes. You give 4 minutes to each of the 5 hardest questions and keep 10 minutes for checking. The other questions share the remaining time equally. How many minutes does each of the other questions get?',
            'Sebuah tes punya 20 soal dalam 60 menit. Kamu memberi 4 menit untuk masing-masing dari 5 soal tersulit dan menyimpan 10 menit untuk memeriksa. Soal lainnya berbagi sisa waktu sama banyak. Berapa menit untuk tiap soal lainnya?',
          ),
          blanks: [{ answer: 2, after: '\\text{min}' }],
          hints: [
            L('First find how many minutes the 5 hard questions use.', 'Cari dulu berapa menit yang dipakai 5 soal sulit.'),
            L('$5\\times4=20$ minutes. Subtract it and the 10 minutes for checking from 60.', '$5\\times4=20$ menit. Kurangkan itu dan 10 menit pemeriksaan dari 60.'),
            L('Divide the remaining minutes by the other $20-5=15$ questions.', 'Bagi sisa menit dengan $20-5=15$ soal lainnya.'),
          ],
          explain: L(
            '$60-20-10=30$ minutes for $15$ questions, so $\\frac{30}{15}=2$ minutes each.',
            '$60-20-10=30$ menit untuk $15$ soal, jadi $\\frac{30}{15}=2$ menit masing-masing.',
          ),
          solution: ['5\\times4=20', '60-20-10=30', '\\frac{30}{15}=2'],
        },
      ],
    },
    lessonSufficiency,
  ],
  project: {
    id: 'tka-sma-m10-s2-p',
    runtime: 'math',
    title: L('Project: Test Like a Pro', 'Proyek: Mengerjakan Tes Seperti Ahli'),
    brief: L(
      'Five problems that use the tactics of this submodule: testing options, estimating, counterexamples, planning time and counting.',
      'Lima soal yang memakai taktik submodul ini: menguji pilihan, menaksir, contoh penyangkal, merencanakan waktu, dan mencacah.',
    ),
    requirements: [
      L('Use substitution and estimation to check answers.', 'Memakai substitusi dan penaksiran untuk memeriksa jawaban.'),
      L('Plan your time and count outcomes.', 'Merencanakan waktu dan mencacah hasil.'),
    ],
    hints: [
      L('Substitute each option into the equation instead of solving.', 'Substitusikan tiap pilihan ke persamaan alih-alih menyelesaikan.'),
      L('Estimate with perfect squares near the number.', 'Taksir dengan kuadrat sempurna di dekat bilangan itu.'),
      L('A counterexample needs only one case that fails.', 'Contoh penyangkal hanya memerlukan satu kasus yang gagal.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'Which of $x=4$, $5$, $6$, $7$ satisfies $3x-7=11$? Type that value.',
          'Manakah dari $x=4$, $5$, $6$, $7$ yang memenuhi $3x-7=11$? Ketik nilai itu.',
        ),
        blanks: [{ label: 'x =', answer: 6 }],
        solution: ['3(6)-7=18-7=11'],
      },
      {
        prompt: L(
          'The number $\\sqrt{200}$ lies between the integers $n$ and $n+1$. Find $n$.',
          'Bilangan $\\sqrt{200}$ terletak di antara bilangan bulat $n$ dan $n+1$. Tentukan $n$.',
        ),
        figure: {
          ...numberLine({ from: 12, to: 16, step: 1, marks: [{ at: 14.142, color: 'result', label: '√200' }] }),
          caption: L('The point √200 on the number line.', 'Titik √200 pada garis bilangan.'),
        },
        blanks: [{ label: 'n =', answer: 14 }],
        solution: ['14^2=196<200<225=15^2', 'n=14'],
      },
      {
        prompt: L(
          'Someone claims: "$n^2+n+41$ is a prime number for every positive integer $n$." Find the smallest positive integer $n$ that is a counterexample.',
          'Seseorang menyatakan: "$n^2+n+41$ adalah bilangan prima untuk setiap bilangan bulat positif $n$." Tentukan bilangan bulat positif $n$ terkecil yang menjadi contoh penyangkal.',
        ),
        blanks: [{ label: 'n =', answer: 40 }],
        solution: ['n=40: \\ 40^2+40+41=1\\,681=41\\times41'],
      },
      {
        prompt: L(
          'A test has 30 questions in 80 minutes. You keep 20 minutes for checking and give every question the same time before that. How many minutes does each question get?',
          'Sebuah tes punya 30 soal dalam 80 menit. Kamu menyimpan 20 menit untuk memeriksa dan memberi setiap soal waktu yang sama sebelum itu. Berapa menit untuk tiap soal?',
        ),
        blanks: [{ answer: 2, after: '\\text{min}' }],
        solution: ['80-20=60', '\\frac{60}{30}=2'],
      },
      {
        prompt: L(
          'A question has 6 options (A to F) and exactly 3 are correct. There is no partial credit. How many different sets of 3 options could a guesser choose?',
          'Sebuah soal punya 6 pilihan (A sampai F) dan tepat 3 yang benar. Tidak ada nilai sebagian. Ada berapa himpunan 3 pilihan berbeda yang dapat dipilih oleh penebak?',
        ),
        blanks: [{ answer: 20 }],
        solution: ['C(6,3)=\\frac{6\\times5\\times4}{3\\times2\\times1}=20'],
      },
    ],
  },
}
