import type { Module } from '../types'

/** Module 4 — the exponential functions.
 *
 *  The distinction this module has to land is between $x^2$ and $2^x$: same
 *  two symbols, and one of them eventually beats the other by any margin you
 *  like. Everything about growth, decay and compound interest is that one
 *  fact, dressed for a particular occasion. */
export const module4: Module = {
  id: 'fun-m4',
  title: { en: 'Exponential Functions', id: 'Fungsi Eksponen' },
  summary: {
    en: 'Constant ratios instead of constant differences: the laws, the graphs, the number $e$, and the growth and decay they describe.',
    id: 'Perbandingan tetap alih-alih selisih tetap: hukumnya, grafiknya, bilangan $e$, serta pertumbuhan dan peluruhan yang dinyatakannya.',
  },
  submodules: [
    /* ------------------------------------------- 4.1 exponentials and graphs */
    {
      id: 'fun-m4-s1',
      title: { en: 'Exponentials and Their Graphs', id: 'Eksponen dan Grafiknya' },
      summary: {
        en: 'The laws of exponents, what $a^x$ looks like, and where the number $e$ comes from.',
        id: 'Hukum eksponen, rupa $a^x$, dan dari mana bilangan $e$ berasal.',
      },
      lessons: [
        {
          id: 'fun-m4-s1-l1',
          title: { en: 'The Laws, and the Shape', id: 'Hukumnya, dan Bentuknya' },
          goal: {
            en: 'Use the five laws of exponents, and describe the graph of $a^x$ for any base.',
            id: 'Memakai kelima hukum eksponen, dan menggambarkan grafik $a^x$ untuk sebarang basis.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The variable is the exponent', id: 'Variabelnya ada di pangkat' },
              body: {
                en: 'An **exponential function** is $f(x) = a^x$ with a fixed base $a > 0$, $a \\neq 1$. The variable is upstairs, and that is the whole difference from a power function like $x^2$.\n\nThe five laws are the ones you already have, now allowed to take any real exponent:\n$$a^m a^n = a^{m+n}, \\qquad \\frac{a^m}{a^n} = a^{m-n}, \\qquad (a^m)^n = a^{mn}$$\n$$a^0 = 1, \\qquad a^{-n} = \\frac{1}{a^n}, \\qquad a^{m/n} = \\sqrt[n]{a^m}$$\nThe base is kept positive so that $a^{1/2}$ means something. $(-4)^{1/2}$ has no real value, and a function that is undefined at scattered points is no use as a model.',
                id: '**Fungsi eksponen** adalah $f(x) = a^x$ dengan basis tetap $a > 0$, $a \\neq 1$. Variabelnya berada di atas, dan itulah seluruh bedanya dari fungsi pangkat seperti $x^2$.\n\nKelima hukumnya adalah hukum yang sudah kamu punya, kini boleh menerima pangkat real apa pun:\n$$a^m a^n = a^{m+n}, \\qquad \\frac{a^m}{a^n} = a^{m-n}, \\qquad (a^m)^n = a^{mn}$$\n$$a^0 = 1, \\qquad a^{-n} = \\frac{1}{a^n}, \\qquad a^{m/n} = \\sqrt[n]{a^m}$$\nBasisnya dijaga positif agar $a^{1/2}$ bermakna. $(-4)^{1/2}$ tak punya nilai real, dan fungsi yang tak terdefinisi di titik-titik yang berserakan tak berguna sebagai model.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One shape, two directions', id: 'Satu bentuk, dua arah' },
              body: {
                en: 'Every graph $y = a^x$ shares four things: domain all of $R$, range $(0, \\infty)$, the point $(0, 1)$, and the $x$-axis as a **horizontal asymptote**. The curve approaches it forever and never touches — $a^x$ is never zero, for any $x$ at all.\n\nWhat the base decides is the direction:\n**$a > 1$** — increasing, growth, rising steeply to the right\n**$0 < a < 1$** — decreasing, decay, the same curve reflected\n\nThat reflection is exact, because $\\left(\\tfrac{1}{2}\\right)^x = 2^{-x}$. A decay curve is a growth curve read backwards, which is why the two are never really separate topics.',
                id: 'Setiap grafik $y = a^x$ punya empat hal yang sama: domain seluruh $R$, range $(0, \\infty)$, titik $(0, 1)$, dan sumbu $x$ sebagai **asimtot mendatar**. Kurvanya mendekati sumbu itu selamanya dan tak pernah menyentuhnya — $a^x$ tak pernah bernilai nol, untuk $x$ mana pun.\n\nYang ditentukan basisnya adalah arahnya:\n**$a > 1$** — naik, pertumbuhan, menanjak tajam ke kanan\n**$0 < a < 1$** — turun, peluruhan, kurva yang sama namun dicerminkan\n\nPencerminan itu tepat, sebab $\\left(\\tfrac{1}{2}\\right)^x = 2^{-x}$. Kurva peluruhan adalah kurva pertumbuhan yang dibaca mundur, dan itulah sebabnya keduanya tak pernah benar-benar menjadi dua topik terpisah.',
              },
              figure: {
                dim: 2,
                xSpan: [-3, 3],
                ySpan: [-1, 9],
                ticks: true,
                params: [{ name: 'a', min: 0.2, max: 4, step: 0.1, value: 2, label: 'a' }],
                items: [
                  { t: 'curve', f: 'a^x', color: 'a', label: 'aˣ' },
                  { t: 'hline', y: 0, label: 'y = 0' },
                  { t: 'dot', x: 0, y: 1, label: '(0, 1)' },
                ],
                caption: {
                  en: 'Drag $a$ across 1 and watch the curve turn over. Every base passes through $(0, 1)$, and none of them ever reaches the axis.',
                  id: 'Seret $a$ melewati 1 dan perhatikan kurvanya berbalik. Setiap basis melewati $(0, 1)$, dan tak satu pun pernah mencapai sumbunya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which is true of $y = 3^x$?',
                id: 'Manakah yang benar tentang $y = 3^x$?',
              },
              options: [
                { en: 'It is zero at $x = 0$.', id: 'Nilainya nol di $x = 0$.' },
                { en: 'It is negative for negative $x$.', id: 'Nilainya negatif untuk $x$ negatif.' },
                { en: 'It is positive for every $x$, and approaches 0 as $x \\to -\\infty$.', id: 'Nilainya positif untuk setiap $x$, dan mendekati 0 saat $x \\to -\\infty$.' },
                { en: 'Its range is all of $R$.', id: 'Range-nya seluruh $R$.' },
              ],
              answer: 2,
              explain: {
                en: '$3^{-2} = \\tfrac{1}{9}$ — small, but positive. A negative exponent gives a reciprocal, never a negative value, so the range is $(0, \\infty)$ and $y = 0$ is an asymptote it never reaches.',
                id: '$3^{-2} = \\tfrac{1}{9}$ — kecil, tetapi positif. Pangkat negatif memberi kebalikan, tak pernah nilai negatif, jadi range-nya $(0, \\infty)$ dan $y = 0$ adalah asimtot yang tak pernah dicapainya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate each using the laws.',
                id: 'Hitung masing-masing dengan memakai hukumnya.',
              },
              blanks: [
                { label: '2^3 \\cdot 2^4 =', answer: 128 },
                { label: '(3^2)^3 =', answer: 729 },
                { label: '8^{2/3} =', answer: 4 },
                { label: '2^{-3} =', answer: 0.125 },
              ],
              hints: [
                { en: 'Add the exponents for a product, multiply them for a power of a power.', id: 'Jumlahkan pangkatnya untuk hasil kali, kalikan untuk pangkat dari pangkat.' },
                { en: '$8^{2/3} = \\left(\\sqrt[3]{8}\\right)^2 = 2^2$.', id: '$8^{2/3} = \\left(\\sqrt[3]{8}\\right)^2 = 2^2$.' },
              ],
              solution: [
                '2^3 \\cdot 2^4 = 2^7 = 128',
                '(3^2)^3 = 3^6 = 729',
                '8^{2/3} = (8^{1/3})^2 = 2^2 = 4',
                '2^{-3} = \\tfrac{1}{8} = 0{,}125',
              ],
              explain: {
                en: 'Taking the root first in the third one keeps the numbers small: $\\sqrt[3]{64}$ is the same answer but much harder to see.',
                id: 'Mengambil akarnya lebih dulu pada soal ketiga menjaga bilangannya tetap kecil: $\\sqrt[3]{64}$ memberi jawaban yang sama tetapi jauh lebih sulit dilihat.',
              },
            },
          ],
        },
        {
          id: 'fun-m4-s1-l2',
          title: { en: 'Growth and Decay', id: 'Pertumbuhan dan Peluruhan' },
          goal: {
            en: 'Build a model of the form $y_0 a^{t/T}$ from a doubling time or a half-life.',
            id: 'Menyusun model berbentuk $y_0 a^{t/T}$ dari waktu penggandaan atau waktu paruh.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Equal ratios in equal times', id: 'Perbandingan sama dalam waktu yang sama' },
              body: {
                en: 'A linear model adds the same amount each step. An exponential model **multiplies by the same factor** each step — and that single sentence is the whole of this lesson.\n\nIf a quantity starts at $y_0$ and multiplies by $a$ every $T$ units of time,\n$$y(t) = y_0\\,a^{t/T}$$\nThe $t/T$ is the number of periods that have gone by, and it need not be a whole number. Two common cases:\n**Doubling time $T$**: $y = y_0 \\cdot 2^{t/T}$\n**Half-life $T$**: $y = y_0 \\cdot \\left(\\tfrac{1}{2}\\right)^{t/T}$\n\nThe factor is what stays fixed, not the increase. A population growing 8% a year multiplies by $1{,}08$ every year, so $y = y_0(1{,}08)^t$ — the *number* added gets bigger every year even though the rate never changes.',
                id: 'Model linear menambahkan besaran yang sama tiap langkah. Model eksponen **mengalikan dengan faktor yang sama** tiap langkah — dan satu kalimat itulah seluruh isi pelajaran ini.\n\nBila suatu besaran bermula di $y_0$ dan dikalikan $a$ setiap $T$ satuan waktu,\n$$y(t) = y_0\\,a^{t/T}$$\nBagian $t/T$ adalah banyaknya periode yang sudah berlalu, dan ia tak harus bilangan bulat. Dua kasus yang lazim:\n**Waktu penggandaan $T$**: $y = y_0 \\cdot 2^{t/T}$\n**Waktu paruh $T$**: $y = y_0 \\cdot \\left(\\tfrac{1}{2}\\right)^{t/T}$\n\nYang tetap adalah faktornya, bukan penambahannya. Populasi yang tumbuh 8% setahun dikalikan $1{,}08$ tiap tahun, jadi $y = y_0(1{,}08)^t$ — *banyaknya* tambahan makin besar tiap tahun meski lajunya tak pernah berubah.',
              },
              figure: {
                dim: 2,
                xSpan: [0, 12],
                ySpan: [0, 9000],
                ticks: true,
                items: [
                  { t: 'curve', f: '500*2^(x/3)', from: 0, color: 'a', label: 'eksponen' },
                  { t: 'curve', f: '500+700*x', from: 0, color: 'muted', dashed: true, label: 'linear' },
                  { t: 'dot', x: 3, y: 1000 },
                  { t: 'dot', x: 6, y: 2000 },
                  { t: 'dot', x: 9, y: 4000 },
                  { t: 'dot', x: 12, y: 8000, label: '8000' },
                ],
                caption: {
                  en: '500 bacteria doubling every 3 hours. The marked points are $1000, 2000, 4000, 8000$ — each three hours apart, each twice the one before. The dashed line adds a fixed 700 an hour and is left far behind.',
                  id: '500 bakteri yang berlipat dua tiap 3 jam. Titik-titik yang ditandai adalah $1000, 2000, 4000, 8000$ — masing-masing berselang tiga jam, masing-masing dua kali sebelumnya. Garis putus-putus menambah 700 tiap jam dan tertinggal jauh.',
                },
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'A culture of 500 doubles every 3 hours. Complete the value at $t = 12$.',
                id: 'Sebuah biakan berjumlah 500 berlipat dua tiap 3 jam. Lengkapi nilainya pada $t = 12$.',
              },
              template: 'y(12) = 500 \\cdot 2^{12/3} = 500 \\cdot 2^{___} = ___',
              blanks: ['4', '8000'],
              explain: {
                en: 'Twelve hours is four doubling periods, and four doublings multiply by 16. The exponent counts periods, not hours.',
                id: 'Dua belas jam adalah empat periode penggandaan, dan empat kali penggandaan berarti dikalikan 16. Pangkatnya menghitung periode, bukan jam.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A substance has a half-life of 20 years. What fraction is left after 60 years?',
                id: 'Suatu zat mempunyai waktu paruh 20 tahun. Berapa bagian yang tersisa setelah 60 tahun?',
              },
              options: [
                { en: 'None — three half-lives use it all up.', id: 'Habis — tiga waktu paruh menghabiskannya.' },
                { en: '$\\tfrac{1}{8}$', id: '$\\tfrac{1}{8}$' },
                { en: '$\\tfrac{1}{6}$', id: '$\\tfrac{1}{6}$' },
                { en: '$\\tfrac{1}{3}$', id: '$\\tfrac{1}{3}$' },
              ],
              answer: 1,
              explain: {
                en: 'Three half-lives halve it three times: $\\tfrac{1}{2} \\to \\tfrac{1}{4} \\to \\tfrac{1}{8}$. Halving repeatedly never reaches zero — which is exactly the horizontal asymptote, seen from the physics side.',
                id: 'Tiga waktu paruh membagi duanya tiga kali: $\\tfrac{1}{2} \\to \\tfrac{1}{4} \\to \\tfrac{1}{8}$. Membagi dua berulang kali tak pernah mencapai nol — dan itulah persis asimtot mendatarnya, dilihat dari sisi fisikanya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A town of 12000 people grows 3% a year, so $P(t) = 12000(1{,}03)^t$.',
                id: 'Sebuah kota berpenduduk 12000 tumbuh 3% setahun, sehingga $P(t) = 12000(1{,}03)^t$.',
              },
              blanks: [
                { label: 'P(0) =', answer: 12000 },
                { label: 'P(10) =', answer: 12000 * Math.pow(1.03, 10), tol: 1 },
                { label: 'P(25) =', answer: 12000 * Math.pow(1.03, 25), tol: 1 },
              ],
              hints: [
                { en: 'Anything to the power 0 is 1.', id: 'Apa pun berpangkat 0 bernilai 1.' },
                { en: 'You may type `12000*1.03^10` straight into the box.', id: 'Kamu boleh mengetik `12000*1.03^10` langsung ke kotaknya.' },
              ],
              solution: [
                'P(0) = 12000',
                'P(10) = 12000(1{,}03)^{10} \\approx 16127',
                'P(25) = 12000(1{,}03)^{25} \\approx 25125',
              ],
              explain: {
                en: 'The first decade adds about 4100 people; the following fifteen years add about 9000. Same 3%, larger increases — that is what a constant ratio does.',
                id: 'Dasawarsa pertama menambah sekitar 4100 orang; lima belas tahun berikutnya menambah sekitar 9000. Persentasenya sama 3%, tambahannya lebih besar — begitulah perilaku perbandingan yang tetap.',
              },
            },
          ],
        },
        {
          id: 'fun-m4-s1-l3',
          title: { en: 'The Number $e$', id: 'Bilangan $e$' },
          goal: {
            en: 'Say where $e$ comes from, and why it is the base calculus prefers.',
            id: 'Menyebut dari mana $e$ berasal, dan mengapa ia menjadi basis pilihan kalkulus.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'What interest compounded forever gives you', id: 'Yang diberikan bunga yang dimajemukkan tanpa henti' },
              body: {
                en: 'Invest 1 for a year at 100% interest, compounded $n$ times. You end with $\\left(1 + \\tfrac{1}{n}\\right)^n$. Compounding more often helps — but less and less:\n$$n = 1: \\ 2 \\qquad n = 12: \\ 2{,}613 \\qquad n = 365: \\ 2{,}715 \\qquad n = 10^6: \\ 2{,}71828$$\nIt settles on a number, and that number is\n$$e = \\lim_{n \\to \\infty}\\left(1 + \\frac{1}{n}\\right)^n \\approx 2{,}718281828$$\nLike $\\pi$, it is irrational — the digits never repeat, and the pleasant $1828$ twice over is a coincidence that stops immediately.\n\n$e$ sits between 2 and 3, so the graph of $e^x$ sits between $2^x$ and $3^x$. Nothing about the shape is special. What is special comes in the next course: $e^x$ is the one exponential whose rate of change at every point equals its own value there, and that is why every formula in calculus is written in base $e$.',
                id: 'Investasikan 1 selama setahun dengan bunga 100%, dimajemukkan $n$ kali. Kamu berakhir dengan $\\left(1 + \\tfrac{1}{n}\\right)^n$. Memajemukkan lebih sering memang membantu — tetapi makin lama makin sedikit:\n$$n = 1: \\ 2 \\qquad n = 12: \\ 2{,}613 \\qquad n = 365: \\ 2{,}715 \\qquad n = 10^6: \\ 2{,}71828$$\nIa mengendap pada satu bilangan, dan bilangan itu adalah\n$$e = \\lim_{n \\to \\infty}\\left(1 + \\frac{1}{n}\\right)^n \\approx 2{,}718281828$$\nSeperti $\\pi$, ia irasional — angkanya tak pernah berulang, dan $1828$ yang muncul dua kali itu kebetulan yang langsung berhenti setelahnya.\n\n$e$ terletak antara 2 dan 3, jadi grafik $e^x$ terletak di antara $2^x$ dan $3^x$. Tak ada yang istimewa dari bentuknya. Yang istimewa datang pada kursus berikutnya: $e^x$ adalah satu-satunya fungsi eksponen yang laju perubahannya di setiap titik sama dengan nilainya sendiri di titik itu, dan itulah sebabnya setiap rumus dalam kalkulus ditulis dengan basis $e$.',
              },
              figure: {
                dim: 2,
                xSpan: [-2, 2.5],
                ySpan: [-1, 10],
                ticks: true,
                items: [
                  { t: 'curve', f: '2^x', color: 'b', label: '2ˣ' },
                  { t: 'curve', f: 'e^x', color: 'a', label: 'eˣ' },
                  { t: 'curve', f: '3^x', color: 'c', label: '3ˣ' },
                  { t: 'dot', x: 1, y: Math.E, label: 'e' },
                ],
                caption: {
                  en: 'Three graphs of the same shape, and $e^x$ is simply the one in the middle. At $x = 1$ they read $2$, $2{,}718$ and $3$.',
                  id: 'Tiga grafik dengan bentuk yang sama, dan $e^x$ sekadar yang berada di tengah. Pada $x = 1$ ketiganya bernilai $2$, $2{,}718$, dan $3$.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which is the largest?',
                id: 'Manakah yang terbesar?',
              },
              options: [
                { en: '$2^{10}$', id: '$2^{10}$' },
                { en: '$10^2$', id: '$10^2$' },
                { en: 'They are equal.', id: 'Keduanya sama.' },
                { en: 'It depends on the convention.', id: 'Tergantung kesepakatan.' },
              ],
              answer: 0,
              explain: {
                en: '$2^{10} = 1024$ against $10^2 = 100$. The exponential wins, and this is with a base of only 2 — with the exponent going up, no power function ever keeps up for long.',
                id: '$2^{10} = 1024$ melawan $10^2 = 100$. Eksponennya menang, dan itu dengan basis yang hanya 2 — begitu pangkatnya naik, tak ada fungsi pangkat yang bisa mengimbanginya lama-lama.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Evaluate each. Two decimal places is enough.',
                id: 'Hitung masing-masing. Dua desimal sudah cukup.',
              },
              blanks: [
                { label: 'e^0 =', answer: 1 },
                { label: 'e^1 =', answer: Math.E },
                { label: 'e^2 =', answer: Math.E * Math.E },
                { label: 'e^{-1} =', answer: 1 / Math.E },
              ],
              hints: [
                { en: 'You may type `e` and `e^2` — the box knows the constant.', id: 'Kamu boleh mengetik `e` dan `e^2` — kotaknya mengenali konstantanya.' },
              ],
              solution: [
                'e^0 = 1, \\qquad e^1 \\approx 2{,}72',
                'e^2 \\approx 7{,}39, \\qquad e^{-1} = \\tfrac{1}{e} \\approx 0{,}37',
              ],
              explain: {
                en: '$e^{-1}$ is about $0{,}37$ — a reciprocal, still positive, exactly as the asymptote demands.',
                id: '$e^{-1}$ sekitar $0{,}37$ — sebuah kebalikan, tetap positif, persis seperti yang dituntut asimtotnya.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m4-s1-p',
        runtime: 'math',
        title: { en: 'Reading an Exponential', id: 'Membaca Fungsi Eksponen' },
        brief: {
          en: 'The laws, a doubling model, and a decay model — three questions, one shape.',
          id: 'Hukumnya, satu model penggandaan, dan satu model peluruhan — tiga soal, satu bentuk.',
        },
        requirements: [
          { en: 'The exponent counts periods, not raw units of time.', id: 'Pangkatnya menghitung periode, bukan satuan waktu mentahnya.' },
          { en: 'You may type an expression straight into a box: `400*2^(9/3)` is read.', id: 'Kamu boleh mengetik ekspresi langsung ke kotaknya: `400*2^(9/3)` terbaca.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Evaluate $\\dfrac{5^7}{5^4}$ and $27^{2/3}$.',
              id: 'Hitung $\\dfrac{5^7}{5^4}$ dan $27^{2/3}$.',
            },
            blanks: [{ answer: 125 }, { answer: 9 }],
            solution: ['\\tfrac{5^7}{5^4} = 5^3 = 125', '27^{2/3} = (27^{1/3})^2 = 3^2 = 9'],
          },
          {
            prompt: {
              en: 'A colony of 400 doubles every 3 days. How many after 9 days, and after 12?',
              id: 'Sebuah koloni berjumlah 400 berlipat dua tiap 3 hari. Berapa banyaknya setelah 9 hari, dan setelah 12 hari?',
            },
            blanks: [
              { label: 'y(9) =', answer: 3200 },
              { label: 'y(12) =', answer: 6400 },
            ],
            solution: [
              'y(9) = 400 \\cdot 2^{9/3} = 400 \\cdot 8 = 3200',
              'y(12) = 400 \\cdot 2^4 = 6400',
            ],
          },
          {
            prompt: {
              en: 'A sample of 80 mg has a half-life of 6 hours. How much is left after 18 hours, and after 3?',
              id: 'Sebuah sampel 80 mg mempunyai waktu paruh 6 jam. Berapa yang tersisa setelah 18 jam, dan setelah 3 jam?',
            },
            blanks: [
              { label: 'y(18) =', answer: 10 },
              { label: 'y(3) =', answer: 80 / Math.SQRT2, tol: 0.05 },
            ],
            solution: [
              'y(18) = 80\\left(\\tfrac{1}{2}\\right)^{3} = 10',
              'y(3) = 80\\left(\\tfrac{1}{2}\\right)^{1/2} = \\tfrac{80}{\\sqrt2} \\approx 56{,}57',
            ],
          },
        ],
        hints: [
          {
            en: 'In part 3, three hours is half a half-life, so the exponent is $\\tfrac{1}{2}$ — not a whole number, and that is fine.',
            id: 'Pada butir 3, tiga jam adalah setengah waktu paruh, jadi pangkatnya $\\tfrac{1}{2}$ — bukan bilangan bulat, dan itu tidak masalah.',
          },
          {
            en: 'Halving by a fractional power divides by $\\sqrt{2}$, which is about $1{,}41$ — not by 2.',
            id: 'Membagi dua dengan pangkat pecahan berarti membagi dengan $\\sqrt{2}$, sekitar $1{,}41$ — bukan dengan 2.',
          },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------------------------ 4.2 applications */
    {
      id: 'fun-m4-s2',
      title: { en: 'Interest, Decay and Continuous Growth', id: 'Bunga, Peluruhan, dan Pertumbuhan Sinambung' },
      summary: {
        en: 'Where the models come from, and what changes when the compounding never stops.',
        id: 'Dari mana model-modelnya berasal, dan apa yang berubah ketika pemajemukannya tak pernah berhenti.',
      },
      lessons: [
        {
          id: 'fun-m4-s2-l1',
          title: { en: 'Compound Interest', id: 'Bunga Majemuk' },
          goal: {
            en: 'Use both compounding formulas, and see what the continuous one is doing.',
            id: 'Memakai kedua rumus pemajemukan, dan melihat apa yang sebenarnya dilakukan bentuk sinambungnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'n times a year, and then always', id: 'n kali setahun, lalu terus-menerus' },
              body: {
                en: 'A principal $P$ at annual rate $r$, compounded $n$ times a year for $t$ years, becomes\n$$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$\nEach period pays $r/n$ of interest, and there are $nt$ of them. Let $n$ grow without bound and the same limit that produced $e$ appears again:\n$$A = P e^{rt}$$\nThis is **continuous compounding** — interest added at every instant. It is not much more than the daily figure, and that is the point worth taking away: the gap between compounding monthly and compounding forever is small, because the limit converges fast.',
                id: 'Modal $P$ dengan suku bunga tahunan $r$, dimajemukkan $n$ kali setahun selama $t$ tahun, menjadi\n$$A = P\\left(1 + \\frac{r}{n}\\right)^{nt}$$\nTiap periode membayar bunga sebesar $r/n$, dan ada $nt$ periode. Biarkan $n$ membesar tanpa batas dan limit yang sama yang melahirkan $e$ muncul lagi:\n$$A = P e^{rt}$$\nInilah **pemajemukan sinambung** — bunga yang ditambahkan pada setiap saat. Nilainya tak jauh berbeda dari perhitungan harian, dan justru itulah yang layak dibawa pulang: selisih antara memajemukkan bulanan dan memajemukkan terus-menerus itu kecil, sebab limitnya cepat menyatu.',
              },
              figure: {
                dim: 2,
                xSpan: [0, 20],
                ySpan: [900, 3400],
                ticks: true,
                items: [
                  { t: 'curve', f: '1000*(1+0.06/12)^(12*x)', from: 0, color: 'a', label: 'bulanan' },
                  { t: 'curve', f: '1000*e^(0.06*x)', from: 0, color: 'b', dashed: true, label: 'sinambung' },
                  { t: 'curve', f: '1000+60*x', from: 0, color: 'muted', dashed: true, label: 'tunggal' },
                ],
                caption: {
                  en: '1000 at 6% for twenty years. Monthly and continuous are almost the same curve — the two solid answers differ by about 30 after two decades. Simple interest, which never compounds at all, is the straight line far below.',
                  id: '1000 dengan bunga 6% selama dua puluh tahun. Bulanan dan sinambung nyaris kurva yang sama — kedua jawabannya berselisih sekitar 30 setelah dua dasawarsa. Bunga tunggal, yang sama sekali tak pernah dimajemukkan, adalah garis lurus jauh di bawahnya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Compounding more often always gives more. What does it approach?',
                id: 'Memajemukkan lebih sering selalu memberi lebih banyak. Menuju apa nilainya?',
              },
              options: [
                { en: 'Infinity — more compounding, more money, without limit.', id: 'Tak hingga — makin sering dimajemukkan, makin banyak uangnya, tanpa batas.' },
                { en: '$Pe^{rt}$, and no further.', id: '$Pe^{rt}$, dan tak lebih dari itu.' },
                { en: '$P(1 + r)^t$', id: '$P(1 + r)^t$' },
                { en: 'Double the principal.', id: 'Dua kali modal awalnya.' },
              ],
              answer: 1,
              explain: {
                en: 'Each extra split adds less than the one before, and the total settles on $Pe^{rt}$. Continuous compounding is a ceiling, not an escape.',
                id: 'Tiap pembagian tambahan menyumbang lebih sedikit daripada sebelumnya, dan totalnya mengendap pada $Pe^{rt}$. Pemajemukan sinambung adalah langit-langit, bukan jalan keluar.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Invest 1000 at 6% a year for 5 years. Compute both totals.',
                id: 'Investasikan 1000 dengan bunga 6% setahun selama 5 tahun. Hitung kedua totalnya.',
              },
              blanks: [
                { label: { en: '\\text{monthly} =', id: '\\text{bulanan} =' }, answer: 1000 * Math.pow(1 + 0.06 / 12, 60), tol: 0.5 },
                { label: { en: '\\text{continuous} =', id: '\\text{sinambung} =' }, answer: 1000 * Math.exp(0.3), tol: 0.5 },
              ],
              hints: [
                { en: 'Monthly: $1000(1 + 0{,}06/12)^{12 \\cdot 5}$, so 60 periods of $0{,}5\\%$.', id: 'Bulanan: $1000(1 + 0{,}06/12)^{12 \\cdot 5}$, jadi 60 periode masing-masing $0{,}5\\%$.' },
                { en: 'You may type `1000*1.005^60` and `1000*e^0.3`.', id: 'Kamu boleh mengetik `1000*1.005^60` dan `1000*e^0.3`.' },
              ],
              solution: [
                'A = 1000(1{,}005)^{60} \\approx 1348{,}85',
                'A = 1000e^{0{,}3} \\approx 1349{,}86',
              ],
              explain: {
                en: 'About one currency unit apart after five years. All that extra compounding buys almost nothing — which is why the continuous formula is used for its simplicity, not its size.',
                id: 'Selisihnya sekitar satu satuan mata uang setelah lima tahun. Semua pemajemukan tambahan itu hampir tak membeli apa-apa — dan itulah sebabnya rumus sinambung dipakai karena kesederhanaannya, bukan karena besarnya.',
              },
            },
          ],
        },
        {
          id: 'fun-m4-s2-l2',
          title: { en: 'Decay and Half-Life', id: 'Peluruhan dan Waktu Paruh' },
          goal: {
            en: 'Work with a decay model at times that are not whole multiples of the half-life.',
            id: 'Bekerja dengan model peluruhan pada waktu yang bukan kelipatan bulat dari waktu paruhnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The same law, running down', id: 'Hukum yang sama, menuju surut' },
              body: {
                en: 'Radioactive decay, a cooling drink, a drug leaving the bloodstream — all lose a **fixed fraction** in each fixed stretch of time, which is the exponential law with a base below 1:\n$$Q(t) = Q_0\\left(\\tfrac{1}{2}\\right)^{t/T}$$\nwhere $T$ is the **half-life**. Equivalently $Q = Q_0e^{-kt}$ with $k = \\tfrac{\\ln 2}{T}$, which is the form the next course will use.\n\nThe half-life does not depend on how much you started with. Half of a kilogram takes exactly as long to disappear as half of a milligram — a fact that surprises people and is the entire basis of radiocarbon dating.',
                id: 'Peluruhan radioaktif, minuman yang mendingin, obat yang meninggalkan aliran darah — semuanya kehilangan **bagian yang tetap** dalam tiap rentang waktu yang tetap, dan itulah hukum eksponen dengan basis di bawah 1:\n$$Q(t) = Q_0\\left(\\tfrac{1}{2}\\right)^{t/T}$$\ndengan $T$ sebagai **waktu paruh**. Setara dengan $Q = Q_0e^{-kt}$ dengan $k = \\tfrac{\\ln 2}{T}$, dan bentuk itulah yang akan dipakai kursus berikutnya.\n\nWaktu paruhnya tidak bergantung pada berapa banyak yang kamu mulai. Separuh dari satu kilogram membutuhkan waktu persis sama untuk lenyap dengan separuh dari satu miligram — kenyataan yang mengejutkan banyak orang dan menjadi seluruh dasar penanggalan radiokarbon.',
              },
              figure: {
                dim: 2,
                xSpan: [0, 24],
                ySpan: [0, 90],
                ticks: true,
                items: [
                  { t: 'curve', f: '80*0.5^(x/6)', from: 0, color: 'a', label: 'peluruhan' },
                  { t: 'dot', x: 6, y: 40, label: '40' },
                  { t: 'dot', x: 12, y: 20, label: '20' },
                  { t: 'dot', x: 18, y: 10, label: '10' },
                  { t: 'hline', y: 0 },
                ],
                caption: {
                  en: 'Every six hours, whatever is left is halved. The steps get smaller and smaller and the curve never reaches the axis — there is always something left, in the mathematics if not in the laboratory.',
                  id: 'Tiap enam jam, apa pun yang tersisa dibagi dua. Langkahnya makin lama makin kecil dan kurvanya tak pernah mencapai sumbu — selalu ada yang tersisa, setidaknya dalam matematikanya kalau tidak di laboratorium.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Two samples of the same isotope: one 10 g, one 1000 g. Which loses half its mass first?',
                id: 'Dua sampel isotop yang sama: satu 10 g, satu 1000 g. Manakah yang lebih dulu kehilangan separuh massanya?',
              },
              options: [
                { en: 'The 10 g sample — there is less to lose.', id: 'Sampel 10 g — lebih sedikit yang harus hilang.' },
                { en: 'The 1000 g sample — it decays faster.', id: 'Sampel 1000 g — ia meluruh lebih cepat.' },
                { en: 'Both at the same moment.', id: 'Keduanya pada saat yang sama.' },
                { en: 'It depends on the temperature.', id: 'Tergantung suhunya.' },
              ],
              answer: 2,
              explain: {
                en: 'The half-life is a property of the isotope, not of the amount. The big sample loses far more grams per hour, but the same **fraction** — and fractions are what the exponential law is about.',
                id: 'Waktu paruh adalah sifat isotopnya, bukan sifat jumlahnya. Sampel besar kehilangan jauh lebih banyak gram per jam, tetapi dengan **bagian** yang sama — dan bagianlah yang dibicarakan hukum eksponen.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Carbon-14 has a half-life of 5730 years. What fraction of the original remains after each time?',
                id: 'Karbon-14 mempunyai waktu paruh 5730 tahun. Berapa bagian dari jumlah semula yang tersisa setelah tiap kurun berikut?',
              },
              blanks: [
                { label: 't = 5730:', answer: 0.5 },
                { label: 't = 11460:', answer: 0.25 },
                { label: 't = 2000:', answer: Math.pow(0.5, 2000 / 5730), tol: 0.005 },
              ],
              hints: [
                { en: 'The first two are whole numbers of half-lives.', id: 'Dua yang pertama adalah kelipatan bulat waktu paruh.' },
                { en: 'For the third, type `0.5^(2000/5730)`.', id: 'Untuk yang ketiga, ketik `0.5^(2000/5730)`.' },
              ],
              solution: [
                '\\left(\\tfrac{1}{2}\\right)^{5730/5730} = \\tfrac{1}{2}',
                '\\left(\\tfrac{1}{2}\\right)^{2} = \\tfrac{1}{4}',
                '\\left(\\tfrac{1}{2}\\right)^{2000/5730} \\approx 0{,}785',
              ],
              explain: {
                en: 'About 78,5% left after 2000 years — a third of a half-life removes only a fifth of the material, because the exponent is what is scaled, not the amount.',
                id: 'Sekitar 78,5% tersisa setelah 2000 tahun — sepertiga waktu paruh hanya membuang seperlima bahannya, sebab yang diskalakan adalah pangkatnya, bukan jumlahnya.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'fun-m4-s2-p',
        runtime: 'math',
        title: { en: 'Money and Isotopes', id: 'Uang dan Isotop' },
        brief: {
          en: 'Two ways of compounding and one decaying sample, all from the same law.',
          id: 'Dua cara memajemukkan dan satu sampel yang meluruh, semuanya dari hukum yang sama.',
        },
        requirements: [
          { en: 'A percentage becomes a decimal before it goes into a formula.', id: 'Persentase diubah menjadi desimal sebelum masuk ke rumus.' },
          { en: 'Round money to two decimal places.', id: 'Bulatkan nilai uang sampai dua desimal.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Invest 2500 at 4% a year for 8 years, compounded quarterly.',
              id: 'Investasikan 2500 dengan bunga 4% setahun selama 8 tahun, dimajemukkan tiap triwulan.',
            },
            blanks: [{ label: 'A =', answer: 2500 * Math.pow(1.01, 32), tol: 0.5 }],
            solution: [
              'A = 2500\\left(1 + \\tfrac{0{,}04}{4}\\right)^{4 \\cdot 8} = 2500(1{,}01)^{32} \\approx 3437{,}37',
            ],
          },
          {
            prompt: {
              en: 'The same 2500 at 4%, but compounded continuously for 8 years.',
              id: 'Dengan 2500 dan 4% yang sama, tetapi dimajemukkan sinambung selama 8 tahun.',
            },
            blanks: [{ label: 'A =', answer: 2500 * Math.exp(0.32), tol: 0.5 }],
            solution: ['A = 2500e^{0{,}04 \\cdot 8} = 2500e^{0{,}32} \\approx 3442{,}82'],
          },
          {
            prompt: {
              en: 'A 200 mg sample has a half-life of 4 days. How much is left after 10 days?',
              id: 'Sebuah sampel 200 mg mempunyai waktu paruh 4 hari. Berapa yang tersisa setelah 10 hari?',
            },
            blanks: [{ label: 'Q =', answer: 200 * Math.pow(0.5, 2.5), tol: 0.1 }],
            solution: ['Q = 200\\left(\\tfrac{1}{2}\\right)^{10/4} = 200(0{,}5)^{2{,}5} \\approx 35{,}36'],
          },
        ],
        hints: [
          {
            en: 'Quarterly means $n = 4$: the rate per period is $0{,}01$ and there are 32 periods.',
            id: 'Triwulanan berarti $n = 4$: laju per periodenya $0{,}01$ dan ada 32 periode.',
          },
          {
            en: 'Ten days is two and a half half-lives, so the exponent is $2{,}5$.',
            id: 'Sepuluh hari adalah dua setengah waktu paruh, jadi pangkatnya $2{,}5$.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
