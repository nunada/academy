import type { Submodule } from '../types'
import { L, dot, plane } from './figs'

/** Module 8, submodule 1 — the question forms of the advanced test, and how to
 *  check an answer and plan the time. */

const growth = (dots: [number, number][]) => ({
  ...plane(
    [{ t: 'curve', f: '3*2^x', from: -1.5, to: 3.2, color: 'a' }, ...dots.map((p) => dot(p, undefined, 'result'))],
    { x: [-2, 4], y: [-3, 28] },
  ),
  aspect: 1,
})

const cubic = () =>
  plane(
    [
      { t: 'curve', f: 'x^3-6*x^2+11*x-6', from: 0.3, to: 3.5, color: 'a' },
      dot([1, 0], undefined, 'result'),
      dot([2, 0], undefined, 'result'),
      dot([3, 0], undefined, 'result'),
    ],
    { x: [-1, 5], y: [-4, 6] },
  )

export const m8s1: Submodule = {
  id: 'tka-sml-m8-s1',
  title: L('Question Forms and Strategy', 'Bentuk Soal dan Strategi'),
  summary: L(
    'How to read the three question forms of the advanced test, how to check an answer, and how to plan the time.',
    'Cara membaca tiga bentuk soal tes tingkat lanjut, cara memeriksa jawaban, dan cara merencanakan waktu.',
  ),
  lessons: [
    /* ---------------------------------------------------- L1 the forms */
    {
      id: 'tka-sml-m8-s1-l1',
      title: L('The Question Forms', 'Bentuk-Bentuk Soal'),
      goal: L(
        'You can answer a one-answer question, a choose-all question and a True/False table, in a context of mathematics or of everyday life.',
        'Kamu bisa menjawab soal satu jawaban, soal pilih-semua, dan tabel Benar/Salah, dalam konteks matematika atau kehidupan sehari-hari.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Forms, Contexts and Levels', 'Ayo Amati: Bentuk, Konteks, dan Tingkat'),
          body: L(
            'The advanced test uses the same three forms as the standard test:\n\n- **Simple multiple choice**: five options, one correct answer.\n- **Complex multiple choice, choose all**: several options are correct, and you pick **all** of them.\n- **Complex multiple choice, category**: a table of statements, each **True or False**.\n\nEach question sits in a **context**: a problem of **mathematics** itself, or a problem from **everyday life** (a video that gains viewers, a boat on a river, a loan). The question may come with a graph, a table or a diagram, as in the picture of the views of a video, $3\\cdot2^{t}$ thousand after $t$ days.\n\nThe levels are the same: knowing and understanding, applying, and reasoning.',
            'Tes tingkat lanjut memakai tiga bentuk yang sama dengan tes biasa:\n\n- **Pilihan ganda sederhana**: lima pilihan, satu jawaban benar.\n- **Pilihan ganda kompleks, pilih semua**: beberapa pilihan benar, dan kamu memilih **semuanya**.\n- **Pilihan ganda kompleks, kategori**: tabel pernyataan, masing-masing **Benar atau Salah**.\n\nSetiap soal berada dalam sebuah **konteks**: masalah **matematika** itu sendiri, atau masalah dari **kehidupan sehari-hari** (video yang menambah penonton, perahu di sungai, pinjaman). Soal dapat disertai grafik, tabel, atau diagram, seperti pada gambar penonton sebuah video, $3\\cdot2^{t}$ ribu setelah $t$ hari.\n\nTingkatnya sama: pengetahuan dan pemahaman, aplikasi, dan penalaran.',
          ),
          figure: {
            ...growth([[0, 3], [1, 6], [2, 12], [3, 24]]),
            caption: L('A graph that goes with a question: viewers of a video, in thousands, after t days.', 'Grafik yang menyertai sebuah soal: penonton video, dalam ribuan, setelah t hari.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Choose All That Apply', 'Contoh Bertahap: Pilih Semua yang Benar'),
          body: L(
            'In a choose-all question each option is a **separate claim**. Test every one, and do not stop at the first correct one.\n\nWhich of $x=1,\\ 2,\\ 3,\\ -2$ solve $x^3-6x^2+11x-6=0$?\n\n1. Step 1: $x=1$: $1-6+11-6=0$ ✓.\n2. Step 2: $x=2$: $8-24+22-6=0$ ✓.\n3. Step 3: $x=3$: $27-54+33-6=0$ ✓.\n4. Step 4: $x=-2$: $-8-24-22-6=-60$ ✗.\n\nThree options are correct. Do not look for a "typical" number of correct options: there can be two, three or four.',
            'Pada soal pilih-semua tiap pilihan adalah **pernyataan terpisah**. Uji setiap pilihan, dan jangan berhenti pada yang pertama benar.\n\nManakah dari $x=1,\\ 2,\\ 3,\\ -2$ yang menyelesaikan $x^3-6x^2+11x-6=0$?\n\n1. Langkah 1: $x=1$: $1-6+11-6=0$ ✓.\n2. Langkah 2: $x=2$: $8-24+22-6=0$ ✓.\n3. Langkah 3: $x=3$: $27-54+33-6=0$ ✓.\n4. Langkah 4: $x=-2$: $-8-24-22-6=-60$ ✗.\n\nTiga pilihan benar. Jangan mencari jumlah pilihan benar yang "biasa": bisa dua, tiga, atau empat.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: True/False Tables in a Context', 'Contoh Bertahap: Tabel Benar/Salah dalam Konteks'),
          body: L(
            'Judge **each statement alone**; one wrong statement does not change the others.\n\nA pond plant covers $A(w)=4\\cdot3^{w}$ m$^2$ after $w$ weeks.\n\n- "At the start it covers $4$ m$^2$": $A(0)=4$. **True.**\n- "After $2$ weeks it covers $36$ m$^2$": $4\\cdot9=36$. **True.**\n- "After $3$ weeks it covers $36$ m$^2$": $4\\cdot27=108$. **False.**\n- "The model fails for a very large $w$": the pond is finite. **True.**\n\nThe last kind of statement asks you to **evaluate the model**, not to calculate. A model of growth stops being valid when it predicts something impossible.',
            'Nilai **tiap pernyataan sendiri-sendiri**; satu pernyataan yang salah tidak mengubah yang lain.\n\nSebuah tanaman kolam menutupi $A(w)=4\\cdot3^{w}$ m$^2$ setelah $w$ minggu.\n\n- "Pada awalnya menutupi $4$ m$^2$": $A(0)=4$. **Benar.**\n- "Setelah $2$ minggu menutupi $36$ m$^2$": $4\\cdot9=36$. **Benar.**\n- "Setelah $3$ minggu menutupi $36$ m$^2$": $4\\cdot27=108$. **Salah.**\n- "Model gagal untuk $w$ yang sangat besar": kolamnya terbatas. **Benar.**\n\nPernyataan terakhir meminta kamu **menilai model**, bukan menghitung. Model pertumbuhan tidak berlaku lagi bila ia meramalkan hal yang mustahil.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph shows the viewers of a video, in thousands, after t days. After how many whole days does the video first have more than 20 thousand viewers?',
            'Grafik menunjukkan penonton sebuah video, dalam ribuan, setelah t hari. Setelah berapa hari penuh video pertama kali memiliki lebih dari 20 ribu penonton?',
          ),
          figure: {
            ...growth([[0, 3], [1, 6], [2, 12], [3, 24]]),
            caption: L('The red points are at t = 0, 1, 2, 3.', 'Titik-titik merah ada di t = 0, 1, 2, 3.'),
          },
          options: ['1', '2', '3', '4', '5'].map((s) => L(`$${s}$`, `$${s}$`)),
          answer: 2,
          explain: L(
            'The values are $3,\\ 6,\\ 12,\\ 24$ for $t=0,1,2,3$. At $t=2$ there are $12<20$, and at $t=3$ there are $24>20$. So the answer is $3$ days.',
            'Nilainya $3,\\ 6,\\ 12,\\ 24$ untuk $t=0,1,2,3$. Di $t=2$ ada $12<20$, dan di $t=3$ ada $24>20$. Jadi jawabannya $3$ hari.',
          ),
          hint: L('Read the height of the graph at each whole number of days.', 'Baca tinggi grafik pada tiap bilangan bulat hari.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: the viewers after $3$ days.', 'Coba bersama: penonton setelah $3$ hari.'),
          template: 'f(3)=3\\cdot___=___',
          blanks: ['8', '24'],
          explain: L('$2^3=8$ and $3\\cdot8=24$.', '$2^3=8$ dan $3\\cdot8=24$.'),
          hint: L('Compute the power first.', 'Hitung pangkatnya dulu.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements about the question forms.', 'Pilih DUA pernyataan yang benar tentang bentuk soal.'),
          options: [
            L('In a choose-all question every option must be tested on its own.', 'Pada soal pilih-semua setiap pilihan harus diuji sendiri-sendiri.'),
            L('In a True/False table each statement is judged on its own.', 'Pada tabel Benar/Salah setiap pernyataan dinilai sendiri-sendiri.'),
            L('In a choose-all question you can stop at the first correct option.', 'Pada soal pilih-semua kamu boleh berhenti pada pilihan benar yang pertama.'),
            L('A graph given with a question can be ignored.', 'Grafik yang menyertai soal boleh diabaikan.'),
          ],
          answer: [0, 1],
          explain: L(
            'There can be several correct options, so stopping early loses some. And the graph or table is part of the data of the question.',
            'Bisa ada beberapa pilihan benar, jadi berhenti terlalu awal membuang sebagian. Dan grafik atau tabel adalah bagian dari data soal.',
          ),
          hint: L('Which habits make sure you find every correct option?', 'Kebiasaan mana yang memastikan kamu menemukan setiap pilihan benar?'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'A car loses value so that after $t$ years it is worth $V(t)=20\\left(\\frac45\\right)^{t}$ million rupiah. Decide whether each statement is True or False.',
            'Sebuah mobil menyusut nilainya sehingga setelah $t$ tahun harganya $V(t)=20\\left(\\frac45\\right)^{t}$ juta rupiah. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('The car is worth $20$ million at the start.', 'Mobil bernilai $20$ juta pada awalnya.'),
            L('After $1$ year it is worth $16$ million.', 'Setelah $1$ tahun nilainya $16$ juta.'),
            L('Each year it loses $20\\%$ of its value.', 'Tiap tahun nilainya berkurang $20\\%$.'),
            L('After $5$ years it is worth $0$.', 'Setelah $5$ tahun nilainya $0$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            '$V(0)=20$ and $V(1)=16$. Multiplying by $\\frac45$ keeps $80\\%$, so $20\\%$ is lost. A factor never makes the value exactly $0$: $V(5)=20\\cdot\\frac{1024}{3125}\\approx6.55$.',
            '$V(0)=20$ dan $V(1)=16$. Mengalikan $\\frac45$ mempertahankan $80\\%$, jadi $20\\%$ hilang. Faktor tidak pernah membuat nilainya tepat $0$: $V(5)=20\\cdot\\frac{1024}{3125}\\approx6{,}55$.',
          ),
          hint: L('Evaluate $V$ at the given years and read the factor $\\frac45$.', 'Hitung $V$ pada tahun yang diberikan dan baca faktor $\\frac45$.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'For $f(t)=3\\cdot2^{t}$ thousand viewers, what is the smallest whole number of days $t$ with $f(t)>100$?',
            'Untuk $f(t)=3\\cdot2^{t}$ ribu penonton, berapa bilangan bulat hari $t$ terkecil dengan $f(t)>100$?',
          ),
          blanks: [{ label: 't =', answer: 6 }],
          hints: [
            L('You need $2^{t}>\\frac{100}{3}\\approx33$.', 'Kamu memerlukan $2^{t}>\\frac{100}{3}\\approx33$.'),
            L('$2^5=32$ is not enough.', '$2^5=32$ belum cukup.'),
            L('Try $2^6$.', 'Coba $2^6$.'),
          ],
          explain: L('$f(5)=96<100$ and $f(6)=192>100$, so $t=6$.', '$f(5)=96<100$ dan $f(6)=192>100$, jadi $t=6$.'),
          solution: ['f(5)=3\\cdot32=96 \\qquad f(6)=3\\cdot64=192', 't=6'],
        },
      ],
    },
    /* -------------------------------------------- L2 checking and time */
    {
      id: 'tka-sml-m8-s1-l2',
      title: L('Checking Your Answer and Using Your Time', 'Memeriksa Jawaban dan Memakai Waktu'),
      goal: L(
        'You can check an answer by substitution, by a test value and by the sizes, and plan your time on a test.',
        'Kamu bisa memeriksa jawaban dengan substitusi, dengan nilai uji, dan dengan ukuran, serta merencanakan waktumu pada tes.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Put the Answer Back', 'Ayo Amati: Masukkan Jawaban Kembali'),
          body: L(
            'The surest check is to **put the answer back** into the original problem.\n\nThe picture shows $p(x)=x^3-6x^2+11x-6$ meeting the $x$-axis at $1$, $2$ and $3$. You can check any claim about roots by substituting: $p(3)=27-54+33-6=0$ ✓, but $p(4)=64-96+44-6=6\\ne0$, so $4$ is not a root.\n\nThe graph is also a check: an answer must agree with what you can **see**.',
            'Pemeriksaan paling pasti adalah **memasukkan jawaban kembali** ke soal awal.\n\nGambar menunjukkan $p(x)=x^3-6x^2+11x-6$ memotong sumbu $x$ di $1$, $2$, dan $3$. Kamu dapat memeriksa klaim apa pun tentang akar dengan substitusi: $p(3)=27-54+33-6=0$ ✓, tetapi $p(4)=64-96+44-6=6\\ne0$, jadi $4$ bukan akar.\n\nGrafik juga merupakan pemeriksaan: jawaban harus sesuai dengan apa yang dapat kamu **lihat**.',
          ),
          figure: {
            ...cubic(),
            caption: L('The graph of x³ − 6x² + 11x − 6 meets the axis at the red points 1, 2 and 3.', 'Grafik x³ − 6x² + 11x − 6 memotong sumbu di titik merah 1, 2, dan 3.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Test Values and Sizes', 'Contoh Bertahap: Nilai Uji dan Ukuran'),
          body: L(
            'Other quick checks:\n\n- **A test value for a limit.** For $\\lim_{x\\to3}\\frac{x^2-9}{x-3}$ try $x=3.01$: $\\frac{0.0601}{0.01}=6.01$, close to $6$. Both sides should agree.\n- **Sizes for matrices.** A product $AB$ exists only if the columns of $A$ equal the rows of $B$. Check this before you compute.\n- **Signs and size.** A distance is not negative. A cosine is between $-1$ and $1$. A probability is between $0$ and $1$. The area of a dilated figure grows by $k^2$.\n- **Special values.** Put $x=0$ or $x=1$ into a formula and into each option; one or two options often fail at once.',
            'Pemeriksaan cepat lainnya:\n\n- **Nilai uji untuk limit.** Untuk $\\lim_{x\\to3}\\frac{x^2-9}{x-3}$ coba $x=3{,}01$: $\\frac{0{,}0601}{0{,}01}=6{,}01$, dekat dengan $6$. Kedua sisi harus sama.\n- **Ukuran matriks.** Hasil kali $AB$ ada hanya bila kolom $A$ sama dengan baris $B$. Periksa ini sebelum menghitung.\n- **Tanda dan besar.** Jarak tidak negatif. Kosinus ada di antara $-1$ dan $1$. Peluang ada di antara $0$ dan $1$. Luas bangun yang didilatasi bertambah $k^2$ kali.\n- **Nilai khusus.** Masukkan $x=0$ atau $x=1$ ke rumus dan ke tiap pilihan; satu atau dua pilihan sering gugur seketika.',
          ),
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: A Plan for Your Time', 'Contoh Bertahap: Rencana untuk Waktumu'),
          body: L(
            'A test has questions of different difficulty, and each one counts the same.\n\n1. Step 1: **Go through once** and answer what you can do quickly.\n2. Step 2: **Mark** the questions that need a long calculation and come back to them.\n3. Step 3: In a choose-all or True/False question, **give each option its own few seconds**: the cost of testing all of them is small compared with losing the whole question.\n4. Step 4: **Keep a few minutes** at the end for checking by substitution.\n5. Step 5: **Never leave an answer empty**; after eliminating options, choose the best one left.\n\nSpending too long on one hard question costs several easy ones.',
            'Tes berisi soal dengan tingkat kesulitan berbeda, dan masing-masing bernilai sama.\n\n1. Langkah 1: **Kerjakan sekali jalan** dan jawab yang bisa dikerjakan cepat.\n2. Langkah 2: **Tandai** soal yang memerlukan hitungan panjang dan kembali ke sana.\n3. Langkah 3: Pada soal pilih-semua atau Benar/Salah, **beri tiap pilihan beberapa detiknya sendiri**: biaya menguji semuanya kecil dibandingkan kehilangan seluruh soal.\n4. Langkah 4: **Sisakan beberapa menit** di akhir untuk memeriksa dengan substitusi.\n5. Langkah 5: **Jangan kosongkan jawaban**; setelah menyisihkan pilihan, pilih yang terbaik dari yang tersisa.\n\nTerlalu lama pada satu soal sulit mengorbankan beberapa soal mudah.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The graph shows $p(x)=x^3-6x^2+11x-6$ meeting the axis at the red points. Which of these numbers is NOT a root of $p$?',
            'Grafik menunjukkan $p(x)=x^3-6x^2+11x-6$ memotong sumbu di titik-titik merah. Manakah di antara bilangan ini yang BUKAN akar $p$?',
          ),
          figure: {
            ...cubic(),
            caption: L('A cubic with three roots.', 'Sebuah kubik dengan tiga akar.'),
          },
          options: ['1', '2', '3', '4'].map((s) => L(`$x=${s}$`, `$x=${s}$`)),
          answer: 3,
          explain: L(
            'The graph meets the axis at $1$, $2$ and $3$. For $x=4$: $64-96+44-6=6\\ne0$, so $4$ is not a root.',
            'Grafik memotong sumbu di $1$, $2$, dan $3$. Untuk $x=4$: $64-96+44-6=6\\ne0$, jadi $4$ bukan akar.',
          ),
          hint: L('A root is where the graph meets the $x$-axis. Look for the number it does not reach.', 'Akar adalah tempat grafik memotong sumbu $x$. Cari bilangan yang tidak dicapainya.'),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L('Try it together: check $x=3$.', 'Coba bersama: periksa $x=3$.'),
          template: '27-54+33-6=___',
          blanks: ['0'],
          explain: L('$27-54=-27$, $-27+33=6$, $6-6=0$, so $3$ is a root.', '$27-54=-27$, $-27+33=6$, $6-6=0$, jadi $3$ adalah akar.'),
          hint: L('Work from left to right.', 'Hitung dari kiri ke kanan.'),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO good habits.', 'Pilih DUA kebiasaan yang baik.'),
          options: [
            L('Put your answer back into the original problem.', 'Masukkan jawabanmu kembali ke soal awal.'),
            L('Check that the sizes of two matrices allow their product before computing it.', 'Periksa bahwa ukuran dua matriks memungkinkan hasil kalinya sebelum menghitung.'),
            L('Round every number as early as possible.', 'Bulatkan setiap bilangan sedini mungkin.'),
            L('Skip checking whenever the answer looks neat.', 'Lewati pemeriksaan setiap kali jawaban tampak rapi.'),
          ],
          answer: [0, 1],
          explain: L(
            'Substitution and a size check catch real mistakes. Early rounding spoils exact answers, and a neat answer can still be wrong.',
            'Substitusi dan pemeriksaan ukuran menangkap kesalahan nyata. Pembulatan dini merusak jawaban eksak, dan jawaban yang rapi masih bisa salah.',
          ),
          hint: L('Which habits catch a mistake?', 'Kebiasaan mana yang menangkap kesalahan?'),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L(
            'To check $\\lim_{x\\to3}\\frac{x^2-9}{x-3}$ you try values near $3$. Decide whether each statement is True or False.',
            'Untuk memeriksa $\\lim_{x\\to3}\\frac{x^2-9}{x-3}$ kamu mencoba nilai di dekat $3$. Tentukan tiap pernyataan Benar atau Salah.',
          ),
          statements: [
            L('At $x=3.01$ the value is $6.01$.', 'Di $x=3{,}01$ nilainya $6{,}01$.'),
            L('At $x=2.99$ the value is $5.99$.', 'Di $x=2{,}99$ nilainya $5{,}99$.'),
            L('The values suggest that the limit is $6$.', 'Nilai-nilai itu menunjukkan bahwa limitnya $6$.'),
            L('The limit is $0$ because the numerator is $0$ at $x=3$.', 'Limitnya $0$ karena pembilangnya $0$ di $x=3$.'),
          ],
          answer: [true, true, true, false],
          explain: L(
            'For $x\\ne3$ the fraction equals $x+3$, so the values are $6.01$ and $5.99$ and they approach $6$. The denominator is also $0$ at $x=3$, so a $0$ in the top alone says nothing.',
            'Untuk $x\\ne3$ pecahan itu sama dengan $x+3$, jadi nilainya $6{,}01$ dan $5{,}99$ dan mendekati $6$. Penyebut juga $0$ di $x=3$, jadi $0$ pada pembilang saja tidak berarti apa-apa.',
          ),
          hint: L('Simplify the fraction for $x\\ne3$ first.', 'Sederhanakan pecahan untuk $x\\ne3$ dulu.'),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The cubic $x^3-6x^2+11x-6$ has the roots $1$, $2$ and $3$. Check them by substitution and then give the sum of the roots.',
            'Kubik $x^3-6x^2+11x-6$ mempunyai akar $1$, $2$, dan $3$. Periksa dengan substitusi lalu berikan jumlah akar-akarnya.',
          ),
          blanks: [{ answer: 6 }],
          hints: [
            L('Substitute each root, as in the picture.', 'Substitusikan tiap akar, seperti pada gambar.'),
            L('The roots are $1$, $2$ and $3$.', 'Akar-akarnya $1$, $2$, dan $3$.'),
            L('Add them. The sum also equals $-\\frac{b}{a}=6$.', 'Jumlahkan. Jumlahnya juga sama dengan $-\\frac{b}{a}=6$.'),
          ],
          explain: L('$1+2+3=6$, which agrees with $-\\frac{-6}{1}=6$.', '$1+2+3=6$, yang sesuai dengan $-\\frac{-6}{1}=6$.'),
          solution: ['1+2+3', '=6'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sml-m8-s1-p',
    runtime: 'math',
    title: L('Questions in Context', 'Soal dalam Konteks'),
    brief: L(
      'Work with models from everyday life and check the answers.',
      'Kerjakan model dari kehidupan sehari-hari dan periksa jawabannya.',
    ),
    requirements: [
      L('Evaluate a model and solve for the input.', 'Menghitung sebuah model dan mencari masukannya.'),
      L('Check each answer by putting it back.', 'Memeriksa tiap jawaban dengan memasukkannya kembali.'),
    ],
    hints: [
      L('Read what each letter stands for.', 'Baca arti tiap huruf.'),
      L('Compute a few values to see the pattern.', 'Hitung beberapa nilai untuk melihat polanya.'),
      L('Put your answer back into the problem.', 'Masukkan jawabanmu kembali ke soal.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'A pond plant covers $A(w)=4\\cdot3^{w}$ m$^2$ after $w$ weeks. Find the cover after $3$ weeks, in m$^2$.',
          'Tanaman kolam menutupi $A(w)=4\\cdot3^{w}$ m$^2$ setelah $w$ minggu. Cari luas tutupan setelah $3$ minggu, dalam m$^2$.',
        ),
        blanks: [{ answer: 108 }],
        solution: ['A(3)=4\\cdot27', '=108'],
      },
      {
        prompt: L(
          'With the same model, after how many weeks does the plant first cover more than $300$ m$^2$?',
          'Dengan model yang sama, setelah berapa minggu tanaman itu pertama kali menutupi lebih dari $300$ m$^2$?',
        ),
        blanks: [{ label: 'w =', answer: 4 }],
        solution: ['A(3)=108 \\qquad A(4)=324', 'w=4'],
      },
      {
        prompt: L(
          'A car is worth $V(t)=25\\left(\\frac45\\right)^{t}$ million rupiah after $t$ years. Find $V(2)$, in million rupiah.',
          'Sebuah mobil bernilai $V(t)=25\\left(\\frac45\\right)^{t}$ juta rupiah setelah $t$ tahun. Cari $V(2)$, dalam juta rupiah.',
        ),
        blanks: [{ answer: 16 }],
        solution: ['V(2)=25\\cdot\\frac{16}{25}', '=16'],
      },
      {
        prompt: L(
          'Solve $2^{x+1}=64$.',
          'Selesaikan $2^{x+1}=64$.',
        ),
        blanks: [{ label: 'x =', answer: 5 }],
        solution: ['2^{x+1}=2^{6}', 'x=5'],
      },
      {
        prompt: L(
          'The roots of $x^3-6x^2+11x-6=0$ are $1$, $2$ and $3$. Find the product of the roots.',
          'Akar-akar $x^3-6x^2+11x-6=0$ adalah $1$, $2$, dan $3$. Cari hasil kali akar-akarnya.',
        ),
        blanks: [{ answer: 6 }],
        solution: ['1\\cdot2\\cdot3', '=6'],
      },
    ],
  },
}
