import type { Module } from '../types'

/** Module 4 — continuity, which turns out to be nothing new: it is simply
 *  the name for the case, from Module 1, where the limit and the function's
 *  actual value happen to agree. Everything here is that one idea, sorted
 *  into what can go wrong and what it buys you when nothing does. */
export const module4: Module = {
  id: 'lim-m4',
  title: { en: 'Continuity', id: 'Kekontinuan' },
  summary: {
    en: 'The three-part definition of continuity, the three kinds of discontinuity, and the Intermediate Value Theorem.',
    id: 'Definisi tiga bagian kekontinuan, tiga jenis diskontinuitas, dan Teorema Nilai Antara.',
  },
  submodules: [
    /* ----------------------------------------- 4.1 continuity at a point */
    {
      id: 'lim-m4-s1',
      title: { en: 'Continuity at a Point', id: 'Kekontinuan di Suatu Titik' },
      summary: {
        en: 'Check the three conditions continuity needs, and classify a discontinuity as removable, jump, or infinite.',
        id: 'Memeriksa tiga syarat yang diperlukan kekontinuan, dan menggolongkan diskontinuitas sebagai bisa dihapus, lompatan, atau tak hingga.',
      },
      lessons: [
        {
          id: 'lim-m4-s1-l1',
          title: { en: 'The Three-Part Definition', id: 'Definisi Tiga Bagian' },
          goal: {
            en: 'Check all three conditions continuity requires, in order, and see why the order matters.',
            id: 'Memeriksa ketiga syarat yang diperlukan kekontinuan, secara berurutan, dan melihat mengapa urutannya penting.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Three things have to hold, all at once', id: 'Tiga hal harus berlaku, sekaligus' },
              body: {
                en: '$f$ is **continuous at $a$** when all three of these hold:\n$$\\text{1. } f(a) \\text{ is defined} \\qquad \\text{2. } \\lim_{x \\to a} f(x) \\text{ exists} \\qquad \\text{3. } \\lim_{x \\to a} f(x) = f(a)$$\nEach condition rules out one of the ways Module 1 found a function could misbehave at $a$: condition 1 rules out a hole, condition 2 rules out a jump or a run-away, and condition 3 rules out the patched-value case where the limit exists but points somewhere other than $f(a)$.\n\nInformally: continuity is exactly the case where you could draw the graph through $a$ **without lifting your pen** — no hole to jump over, no gap to leap across, no sudden relocation of the point.',
                id: '$f$ disebut **kontinu di $a$** ketika ketiga hal berikut berlaku:\n$$\\text{1. } f(a) \\text{ terdefinisi} \\qquad \\text{2. } \\lim_{x \\to a} f(x) \\text{ ada} \\qquad \\text{3. } \\lim_{x \\to a} f(x) = f(a)$$\nMasing-masing syarat menyingkirkan satu cara fungsi bisa berulah di $a$ yang ditemukan Modul 1: syarat 1 menyingkirkan lubang, syarat 2 menyingkirkan lompatan atau larian, dan syarat 3 menyingkirkan kasus nilai tertambal tempat limitnya ada tetapi menunjuk ke tempat lain selain $f(a)$.\n\nSecara informal: kekontinuan persis kasus tempat kamu bisa menggambar grafiknya melewati $a$ **tanpa mengangkat pena** — tak ada lubang untuk dilompati, tak ada celah untuk diloncati, tak ada titik yang tiba-tiba berpindah.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-1, 6],
                ticks: true,
                items: [
                  { t: 'curve', f: 'sqrt(x)+1', color: 'a' },
                  { t: 'dot', x: 4, y: 3, color: 'result' },
                ],
                caption: {
                  en: '$f(x) = \\sqrt{x}+1$ at $x=4$: $f(4)=3$ is defined, $\\lim_{x\\to 4} f(x) = 3$ exists, and the two agree. All three conditions hold, so the pen never leaves the paper here.',
                  id: '$f(x) = \\sqrt{x}+1$ di $x=4$: $f(4)=3$ terdefinisi, $\\lim_{x\\to 4} f(x) = 3$ ada, dan keduanya sepakat. Ketiga syaratnya berlaku, jadi pena tak pernah lepas dari kertas di sini.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A function has $f(2) = 5$ and $\\lim_{x \\to 2} f(x) = 5$. Is it continuous at $x=2$?',
                id: 'Sebuah fungsi mempunyai $f(2) = 5$ dan $\\lim_{x \\to 2} f(x) = 5$. Apakah ia kontinu di $x=2$?',
              },
              options: [
                { en: 'Yes — all three conditions hold', id: 'Ya — ketiga syaratnya berlaku' },
                { en: 'No — nothing has been said about nearby points', id: 'Tidak — belum dikatakan apa pun tentang titik-titik di sekitarnya' },
                { en: 'Cannot be decided — more information is needed', id: 'Tak bisa ditentukan — perlu informasi lebih' },
                { en: 'No — $f(2)$ and the limit must differ for continuity', id: 'Tidak — $f(2)$ dan limitnya harus berbeda untuk kontinu' },
              ],
              answer: 0,
              explain: {
                en: '$f(2)$ is defined (condition 1), the limit exists (condition 2), and they agree, both equal to $5$ (condition 3). All three hold, so $f$ is continuous at $2$ — nothing more is needed.',
                id: '$f(2)$ terdefinisi (syarat 1), limitnya ada (syarat 2), dan keduanya sepakat, sama-sama $5$ (syarat 3). Ketiganya berlaku, jadi $f$ kontinu di $2$ — tak ada yang lebih diperlukan.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Reading the graph below, is $f$ continuous at $x = 4$?',
                id: 'Dengan membaca grafik di bawah, apakah $f$ kontinu di $x = 4$?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 6],
                ySpan: [-1, 8],
                ticks: true,
                items: [
                  { t: 'curve', f: '(x-4)^2+2', color: 'a' },
                  { t: 'dot', x: 4, y: 2, color: 'result' },
                ],
              },
              options: [
                { en: 'Yes — the curve passes through the marked point without any break', id: 'Ya — kurvanya melewati titik yang ditandai tanpa putus apa pun' },
                { en: 'No — there is a hole at $x=4$', id: 'Tidak — ada lubang di $x=4$' },
                { en: 'No — the one-sided limits disagree', id: 'Tidak — limit sepihaknya tidak sepakat' },
                { en: 'Cannot be told from a graph', id: 'Tak bisa ditentukan dari grafik' },
              ],
              answer: 0,
              explain: {
                en: 'The dot is filled and sits exactly on the curve — $f(4)=2$ is defined, the limit is $2$, and they match. No pen-lifting required.',
                id: 'Titiknya penuh dan berada persis pada kurvanya — $f(4)=2$ terdefinisi, limitnya $2$, dan keduanya cocok. Tak perlu mengangkat pena sama sekali.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Let $f(x) = x^2 - 1$ for $x \\neq 3$, with $f(3) = 8$ declared separately. Find both facts needed to check continuity at $x=3$.',
                id: 'Misalkan $f(x) = x^2 - 1$ untuk $x \\neq 3$, dengan $f(3) = 8$ ditetapkan terpisah. Tentukan kedua fakta yang diperlukan untuk memeriksa kekontinuan di $x=3$.',
              },
              blanks: [
                { label: '\\lim_{x \\to 3} f(x) =', answer: 8 },
                { label: 'f(3) =', answer: 8 },
              ],
              hints: [
                { en: 'The limit uses the formula $x^2-1$; the declared value is given directly.', id: 'Limitnya memakai rumus $x^2-1$; nilai yang dideklarasikan diberikan langsung.' },
              ],
              explain: {
                en: '$3^2 - 1 = 8$, and $f(3) = 8$ by declaration — they happen to agree, so all three conditions hold and $f$ is continuous at $3$. Changing that declared value to anything but $8$ would break condition 3 alone.',
                id: '$3^2 - 1 = 8$, dan $f(3) = 8$ menurut deklarasinya — keduanya kebetulan sepakat, jadi ketiga syaratnya berlaku dan $f$ kontinu di $3$. Mengubah nilai yang dideklarasikan itu menjadi selain $8$ akan merusak syarat 3 saja.',
              },
            },
          ],
        },
        {
          id: 'lim-m4-s1-l2',
          title: { en: 'Classifying Discontinuities', id: 'Menggolongkan Diskontinuitas' },
          goal: {
            en: 'Name a discontinuity as removable, jump, or infinite from which condition it breaks.',
            id: 'Menamai diskontinuitas sebagai bisa dihapus, lompatan, atau tak hingga dari syarat mana yang dilanggarnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Named by which failure it is', id: 'Dinamai dari kegagalan yang mana' },
              body: {
                en: 'A **removable discontinuity** is a hole: the limit exists, but $f(a)$ is either undefined or set to the wrong value — condition 1 or 3 fails, while condition 2 is fine. It earns the name "removable" because patching in $f(a) = \\lim_{x\\to a} f(x)$ fixes it completely.\n\nA **jump discontinuity** is exactly Module 1\'s disagreeing one-sided limits — condition 2 fails outright, and no single patch to $f(a)$ can repair it, since there is no one value the two sides agree on.\n\nAn **infinite discontinuity** is a vertical asymptote — condition 2 fails because the limit is not a finite number at all. Also unrepairable by patching a single point.\n\nSo the question "which kind?" is really the question "which condition failed, and how?" — and the answer for a jump or an infinite discontinuity is always "not removable".',
                id: '**Diskontinuitas bisa dihapus** adalah sebuah lubang: limitnya ada, tetapi $f(a)$ entah tak terdefinisi atau ditetapkan ke nilai yang salah — syarat 1 atau 3 gagal, sementara syarat 2 baik-baik saja. Ia mendapat nama "bisa dihapus" sebab menambal $f(a) = \\lim_{x\\to a} f(x)$ memperbaikinya sepenuhnya.\n\n**Diskontinuitas lompatan** persis limit sepihak yang tidak sepakat dari Modul 1 — syarat 2 gagal total, dan tak ada tambalan tunggal pada $f(a)$ yang bisa memperbaikinya, sebab tak ada satu nilai pun yang disepakati kedua sisi.\n\n**Diskontinuitas tak hingga** adalah sebuah asimtot tegak — syarat 2 gagal sebab limitnya bahkan bukan bilangan berhingga. Juga tak bisa diperbaiki dengan menambal satu titik.\n\nJadi pertanyaan "jenis yang mana?" sebenarnya adalah pertanyaan "syarat mana yang gagal, dan bagaimana?" — dan jawaban untuk lompatan atau tak hingga selalu "tidak bisa dihapus".',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-1, 5],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x+1', from: -1, to: 2, color: 'a' },
                  { t: 'dot', x: 2, y: 3, open: true, color: 'a' },
                  { t: 'dot', x: 2, y: 1, color: 'result' },
                ],
                caption: {
                  en: 'The curve heads for height $3$, but $f(2) = 1$ is declared elsewhere — a removable discontinuity. Re-defining $f(2)$ to be $3$ would patch it completely, which is exactly what makes this kind different from a jump.',
                  id: 'Kurvanya menuju tinggi $3$, tetapi $f(2) = 1$ dideklarasikan di tempat lain — diskontinuitas yang bisa dihapus. Mendefinisikan ulang $f(2)$ menjadi $3$ akan menambalnya sepenuhnya, dan itulah yang membuat jenis ini berbeda dari lompatan.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A function has a jump discontinuity at $x=a$. Can patching the single value $f(a)$ ever fix it?',
                id: 'Sebuah fungsi punya diskontinuitas lompatan di $x=a$. Bisakah menambal satu nilai $f(a)$ pernah memperbaikinya?',
              },
              options: [
                { en: 'No — the two one-sided limits disagree, so no single value can match both', id: 'Tidak — kedua limit sepihaknya tidak sepakat, jadi tak ada satu nilai pun yang bisa mencocokkan keduanya' },
                { en: 'Yes — set $f(a)$ to the average of the two one-sided limits', id: 'Ya — tetapkan $f(a)$ ke rata-rata kedua limit sepihaknya' },
                { en: 'Yes, always, the same way a removable discontinuity is fixed', id: 'Ya, selalu, dengan cara yang sama seperti diskontinuitas bisa dihapus diperbaiki' },
                { en: 'Only if the jump is small enough', id: 'Hanya jika lompatannya cukup kecil' },
              ],
              answer: 0,
              explain: {
                en: 'Condition 2 itself is broken — the limit does not exist at all, regardless of what $f(a)$ is set to. Only a removable discontinuity, where the limit already exists, can be patched by redefining one point.',
                id: 'Syarat 2 sendiri sudah rusak — limitnya sama sekali tak ada, apa pun nilai $f(a)$ ditetapkan. Hanya diskontinuitas yang bisa dihapus, tempat limitnya sudah ada, yang bisa ditambal dengan mendefinisikan ulang satu titik.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'What kind of discontinuity does $y = \\dfrac{1}{x-2}$ have at $x=2$?',
                id: 'Jenis diskontinuitas apa yang dimiliki $y = \\dfrac{1}{x-2}$ di $x=2$?',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 5],
                ySpan: [-6, 6],
                ticks: true,
                items: [
                  { t: 'curve', f: '1/(x-2)', color: 'a' },
                  { t: 'vline', x: 2, color: 'muted', dashed: true },
                ],
              },
              options: [
                { en: 'Infinite — the limit is not a finite number', id: 'Tak hingga — limitnya bukan bilangan berhingga' },
                { en: 'Removable — patching one point fixes it', id: 'Bisa dihapus — menambal satu titik memperbaikinya' },
                { en: 'Jump — the one-sided limits disagree but are both finite', id: 'Lompatan — limit sepihaknya tidak sepakat tetapi keduanya berhingga' },
                { en: 'There is no discontinuity here', id: 'Tak ada diskontinuitas di sini' },
              ],
              answer: 0,
              explain: {
                en: 'Both sides run off without bound — one to $+\\infty$, the other to $-\\infty$. Condition 2 fails because there is no finite limit at all, which is precisely what makes it infinite rather than removable or a jump.',
                id: 'Kedua sisi lari tanpa batas — yang satu ke $+\\infty$, yang lain ke $-\\infty$. Syarat 2 gagal sebab sama sekali tak ada limit berhingga, dan itulah persis yang membuatnya tak hingga, bukan bisa dihapus atau lompatan.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Order the reasoning that classifies the discontinuity of $f(x) = \\dfrac{x^2-1}{x-1}$ at $x=1$ (with $f(1)$ left undefined).',
                id: 'Susun penalaran yang menggolongkan diskontinuitas $f(x) = \\dfrac{x^2-1}{x-1}$ di $x=1$ (dengan $f(1)$ dibiarkan tak terdefinisi).',
              },
              lines: [
                '\\lim_{x \\to 1} f(x) = \\lim_{x \\to 1}(x+1) = 2 \\text{ exists}',
                'f(1) \\text{ is undefined, so condition 1 fails}',
                '\\text{condition 2 holds, only condition 1 (or 3) fails}',
                '\\text{this is a removable discontinuity}',
              ],
              explain: {
                en: 'Check the limit first, then the value at the point, then decide which condition broke — the pattern that names every discontinuity in this lesson.',
                id: 'Periksa limitnya dahulu, lalu nilai di titik itu, lalu putuskan syarat mana yang rusak — pola yang menamai setiap diskontinuitas dalam pelajaran ini.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $g(x) = \\dfrac{x^2-16}{x-4}$ with $g(4)$ undefined, find the limit that would need to be patched in to remove the discontinuity.',
                id: 'Untuk $g(x) = \\dfrac{x^2-16}{x-4}$ dengan $g(4)$ tak terdefinisi, tentukan limit yang perlu ditambalkan untuk menghapus diskontinuitasnya.',
              },
              blanks: [{ label: '\\lim_{x \\to 4} g(x) =', answer: 8 }],
              hints: [{ en: '$x^2-16 = (x-4)(x+4)$.', id: '$x^2-16 = (x-4)(x+4)$.' }],
              explain: {
                en: '$\\dfrac{(x-4)(x+4)}{x-4} = x+4 \\to 8$. Defining $g(4) = 8$ would satisfy all three conditions and remove the discontinuity — which is exactly why this kind is called removable.',
                id: '$\\dfrac{(x-4)(x+4)}{x-4} = x+4 \\to 8$. Mendefinisikan $g(4) = 8$ akan memenuhi ketiga syarat dan menghapus diskontinuitasnya — dan itulah persis sebabnya jenis ini disebut bisa dihapus.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m4-s1-p',
        runtime: 'math',
        title: { en: 'Checking the Three Conditions', id: 'Memeriksa Ketiga Syarat' },
        brief: {
          en: 'Two continuity checks and one removable discontinuity, patched by finding the right limit.',
          id: 'Dua pemeriksaan kekontinuan dan satu diskontinuitas yang bisa dihapus, ditambal dengan mencari limit yang tepat.',
        },
        requirements: [
          { en: 'Check all three conditions — a single one failing is enough to break continuity.', id: 'Periksa ketiga syaratnya — satu saja gagal sudah cukup merusak kekontinuan.' },
          { en: 'A patch only removes a discontinuity when the limit already exists.', id: 'Tambalan hanya menghapus diskontinuitas ketika limitnya sudah ada.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Let $f(x) = x^2 + 1$ for $x \\neq 2$, with $f(2) = 5$ declared separately. Find $\\lim_{x\\to 2} f(x)$ and $f(2)$, then say whether $f$ is continuous at $2$ by giving $1$ for yes or $0$ for no.',
              id: 'Misalkan $f(x) = x^2 + 1$ untuk $x \\neq 2$, dengan $f(2) = 5$ ditetapkan terpisah. Tentukan $\\lim_{x\\to 2} f(x)$ dan $f(2)$, lalu sebutkan apakah $f$ kontinu di $2$ dengan $1$ untuk ya atau $0$ untuk tidak.',
            },
            blanks: [
              { label: '\\lim_{x \\to 2} f(x) =', answer: 5 },
              { label: 'f(2) =', answer: 5 },
              { label: '\\text{continuous?} =', answer: 1 },
            ],
            solution: ['2^2+1 = 5 = f(2) \\Rightarrow \\text{all three conditions hold}'],
          },
          {
            prompt: {
              en: 'Let $g(x) = x - 3$ for $x \\neq 1$, with $g(1) = 0$ declared separately. Find $\\lim_{x\\to 1} g(x)$ and $g(1)$, then say whether $g$ is continuous at $1$ (again $1$ for yes, $0$ for no).',
              id: 'Misalkan $g(x) = x - 3$ untuk $x \\neq 1$, dengan $g(1) = 0$ ditetapkan terpisah. Tentukan $\\lim_{x\\to 1} g(x)$ dan $g(1)$, lalu sebutkan apakah $g$ kontinu di $1$ ($1$ untuk ya, $0$ untuk tidak).',
            },
            blanks: [
              { label: '\\lim_{x \\to 1} g(x) =', answer: -2 },
              { label: 'g(1) =', answer: 0 },
              { label: '\\text{continuous?} =', answer: 0 },
            ],
            solution: ['1-3 = -2 \\neq 0 = g(1) \\Rightarrow \\text{condition 3 fails, a removable discontinuity}'],
          },
          {
            prompt: {
              en: 'Find the value that would need to be patched in at $h(3)$ to remove the discontinuity of $h(x) = \\dfrac{x^2-9}{x-3}$.',
              id: 'Tentukan nilai yang perlu ditambalkan di $h(3)$ untuk menghapus diskontinuitas $h(x) = \\dfrac{x^2-9}{x-3}$.',
            },
            blanks: [{ answer: 6 }],
            solution: ['\\dfrac{(x-3)(x+3)}{x-3} = x+3 \\to 6 \\text{ as } x \\to 3'],
          },
        ],
        hints: [
          { en: 'Part 2\'s mismatch is the point of the exercise — the limit and the declared value need not agree.', id: 'Ketidakcocokan pada butir 2 adalah inti latihannya — limit dan nilai yang dideklarasikan tak harus sepakat.' },
        ],
        xp: 50,
      },
    },

    /* ------------------------------------- 4.2 continuity on an interval */
    {
      id: 'lim-m4-s2',
      title: { en: 'Continuity on an Interval, and the IVT', id: 'Kekontinuan pada Selang, dan TNA' },
      summary: {
        en: 'Continuity across a whole interval, which elementary functions are continuous everywhere they are defined, and the Intermediate Value Theorem.',
        id: 'Kekontinuan di sepanjang selang, fungsi elementer mana yang kontinu di mana pun ia terdefinisi, dan Teorema Nilai Antara.',
      },
      lessons: [
        {
          id: 'lim-m4-s2-l1',
          title: { en: 'Continuous Everywhere It Is Defined', id: 'Kontinu di Mana pun Ia Terdefinisi' },
          goal: {
            en: 'Say a function is continuous on an interval, and know which familiar functions are continuous on their whole domain.',
            id: 'Menyatakan sebuah fungsi kontinu pada suatu selang, dan mengetahui fungsi mana yang sudah dikenal kontinu di seluruh domainnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One point at a time, all the way along', id: 'Satu titik setiap kali, di sepanjang jalan' },
              body: {
                en: '$f$ is **continuous on an interval** when it is continuous at every point of that interval — the three-part check, passed over and over, everywhere along the way. At an endpoint, only the one-sided limit that stays inside the interval needs to match.\n\nThe good news: every polynomial is continuous on all of $R$, and every rational function is continuous everywhere except at the zeros of its denominator — exactly the points this module has spent its time on. $\\sqrt{x}$ is continuous on $[0,\\infty)$, and $\\sin x$, $\\cos x$ are continuous on all of $R$. Nearly every function this course has drawn is continuous on its whole natural domain — discontinuities are the exception carved out on purpose.',
                id: '$f$ disebut **kontinu pada suatu selang** ketika ia kontinu di setiap titik selang itu — pemeriksaan tiga bagian, dilewati berulang-ulang, di sepanjang jalan. Di titik ujung, hanya limit sepihak yang tetap berada di dalam selang yang perlu dicocokkan.\n\nKabar baiknya: setiap polinom kontinu di seluruh $R$, dan setiap fungsi rasional kontinu di mana pun kecuali di akar-akar penyebutnya — persis titik-titik yang dihabiskan waktunya oleh modul ini. $\\sqrt{x}$ kontinu pada $[0,\\infty)$, dan $\\sin x$, $\\cos x$ kontinu di seluruh $R$. Hampir setiap fungsi yang digambar kursus ini kontinu di seluruh domain alaminya — diskontinuitas adalah pengecualian yang sengaja diukir.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'On which set is $f(x) = \\dfrac{1}{x-4}$ continuous?',
                id: 'Pada himpunan mana $f(x) = \\dfrac{1}{x-4}$ kontinu?',
              },
              options: [
                { en: 'Every real number except $x=4$', id: 'Setiap bilangan real kecuali $x=4$' },
                { en: 'Every real number', id: 'Setiap bilangan real' },
                { en: 'Only for $x > 4$', id: 'Hanya untuk $x > 4$' },
                { en: 'Nowhere', id: 'Tidak di mana pun' },
              ],
              answer: 0,
              explain: {
                en: 'A rational function is continuous everywhere except at the zeros of its denominator. Here that is just $x=4$, an infinite discontinuity; everywhere else, all three conditions hold.',
                id: 'Fungsi rasional kontinu di mana pun kecuali di akar-akar penyebutnya. Di sini itu hanya $x=4$, sebuah diskontinuitas tak hingga; di tempat lain, ketiga syaratnya berlaku.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the domain on which $g(x) = \\sqrt{x - 5}$ is continuous.',
                id: 'Lengkapi domain tempat $g(x) = \\sqrt{x - 5}$ kontinu.',
              },
              template: 'g \\text{ is continuous on } [___, \\infty)',
              blanks: ['5'],
              explain: {
                en: 'A square root is continuous on its whole natural domain, which for $\\sqrt{x-5}$ starts at $x=5$.',
                id: 'Akar kuadrat kontinu di seluruh domain alaminya, yang untuk $\\sqrt{x-5}$ bermula di $x=5$.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $h(x) = \\dfrac{x+1}{(x-2)(x+3)}$, find the two points to remove from $R$ to describe where $h$ is continuous.',
                id: 'Untuk $h(x) = \\dfrac{x+1}{(x-2)(x+3)}$, tentukan kedua titik yang harus dibuang dari $R$ untuk menyatakan tempat $h$ kontinu.',
              },
              blanks: [
                { label: 'x =', answer: 2 },
                { label: { en: '\\text{and } x =', id: '\\text{dan } x =' }, answer: -3 },
              ],
              hints: [{ en: 'A rational function breaks continuity exactly at the zeros of its denominator.', id: 'Fungsi rasional merusak kekontinuan persis di akar-akar penyebutnya.' }],
              explain: {
                en: 'The denominator vanishes at $x=2$ and $x=-3$, and the numerator does not vanish at either, so both are genuine discontinuities. Everywhere else, $h$ is continuous.',
                id: 'Penyebutnya lenyap di $x=2$ dan $x=-3$, dan pembilangnya tak lenyap di keduanya, jadi keduanya diskontinuitas sejati. Di tempat lain, $h$ kontinu.',
              },
            },
          ],
        },
        {
          id: 'lim-m4-s2-l2',
          title: { en: 'The Intermediate Value Theorem', id: 'Teorema Nilai Antara' },
          goal: {
            en: 'Use continuity to guarantee a root exists, without ever finding it.',
            id: 'Memakai kekontinuan untuk menjamin sebuah akar ada, tanpa pernah harus menemukannya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A continuous function hits everything in between', id: 'Fungsi kontinu mengenai segala yang ada di antaranya' },
              body: {
                en: 'If $f$ is continuous on $[a,b]$, then $f$ takes **every value between $f(a)$ and $f(b)$** somewhere in that interval — it cannot skip a value on the way, precisely because its graph has no gap to jump one over. This is the **Intermediate Value Theorem** (IVT).\n\nThe use that shows up constantly: if $f(a)$ and $f(b)$ have **opposite signs**, then $0$ sits between them, so the IVT guarantees a root — some $c$ in $(a,b)$ with $f(c) = 0$ — without ever saying what $c$ is. Continuity is doing all the work; the theorem proves existence, not location.',
                id: 'Jika $f$ kontinu pada $[a,b]$, maka $f$ mencapai **setiap nilai antara $f(a)$ dan $f(b)$** di suatu tempat dalam selang itu — ia tak bisa melompati satu nilai pun di jalan, persis sebab grafiknya tak punya celah untuk dilompati. Inilah **Teorema Nilai Antara** (TNA).\n\nKegunaan yang terus-menerus muncul: jika $f(a)$ dan $f(b)$ berlawanan tanda, maka $0$ berada di antara keduanya, sehingga TNA menjamin sebuah akar — suatu $c$ di $(a,b)$ dengan $f(c) = 0$ — tanpa pernah mengatakan berapa $c$-nya. Kekontinuanlah yang mengerjakan semuanya; teoremanya membuktikan keberadaan, bukan letaknya.',
              },
              figure: {
                dim: 2,
                xSpan: [-1, 4],
                ySpan: [-4, 6],
                ticks: true,
                items: [
                  { t: 'curve', f: 'x^2-3*x-1', color: 'a' },
                  { t: 'dot', x: 0, y: -1, color: 'b' },
                  { t: 'dot', x: 4, y: 3, color: 'b' },
                ],
                caption: {
                  en: '$f(0) = -1$ and $f(4) = 3$ have opposite signs, so somewhere between the two marked points the continuous curve must cross the $x$-axis — a root the IVT guarantees without computing it.',
                  id: '$f(0) = -1$ dan $f(4) = 3$ berlawanan tanda, jadi di suatu tempat antara kedua titik yang ditandai, kurva kontinu itu pasti memotong sumbu $x$ — sebuah akar yang dijamin TNA tanpa menghitungnya.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A continuous function has $f(1) = -3$ and $f(5) = 2$. What does the IVT guarantee?',
                id: 'Sebuah fungsi kontinu mempunyai $f(1) = -3$ dan $f(5) = 2$. Apa yang dijamin TNA?',
              },
              options: [
                { en: 'Some $c$ in $(1,5)$ with $f(c) = 0$', id: 'Suatu $c$ di $(1,5)$ dengan $f(c) = 0$' },
                { en: 'The exact value of the root', id: 'Nilai akar yang tepat' },
                { en: 'That $f$ is increasing on $(1,5)$', id: 'Bahwa $f$ naik pada $(1,5)$' },
                { en: 'Nothing — the IVT needs $f(1)$ and $f(5)$ to be equal', id: 'Tak ada — TNA memerlukan $f(1)$ dan $f(5)$ sama' },
              ],
              answer: 0,
              explain: {
                en: '$0$ lies between $-3$ and $2$, and $f$ is continuous, so the IVT guarantees a root exists somewhere in $(1,5)$ — though it says nothing about exactly where.',
                id: '$0$ terletak antara $-3$ dan $2$, dan $f$ kontinu, jadi TNA menjamin sebuah akar ada di suatu tempat dalam $(1,5)$ — meski tak mengatakan apa pun tentang letak persisnya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Why does the IVT require $f$ to be continuous on $[a,b]$?',
                id: 'Mengapa TNA memerlukan $f$ kontinu pada $[a,b]$?',
              },
              options: [
                { en: 'A discontinuous function could jump clean over a value without ever taking it', id: 'Fungsi yang tak kontinu bisa melompati suatu nilai tanpa pernah mencapainya' },
                { en: 'It is just a technical requirement with no real consequence', id: 'Itu hanya syarat teknis tanpa akibat nyata' },
                { en: 'Continuity guarantees the function is a polynomial', id: 'Kekontinuan menjamin fungsinya polinom' },
                { en: 'It does not — the IVT holds for any function', id: 'Tidak — TNA berlaku untuk fungsi apa pun' },
              ],
              answer: 0,
              explain: {
                en: 'A jump discontinuity is exactly a place a graph skips a whole range of values without passing through them. Continuity is what rules that out and makes the guarantee honest.',
                id: 'Diskontinuitas lompatan persis tempat grafik melompati seluruh rentang nilai tanpa melewatinya. Kekontinuanlah yang menyingkirkan itu dan membuat jaminannya jujur.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $f(x) = x^3 - x - 3$, evaluate $f(1)$ and $f(2)$ to confirm the IVT guarantees a root between them.',
                id: 'Untuk $f(x) = x^3 - x - 3$, hitung $f(1)$ dan $f(2)$ untuk memastikan TNA menjamin sebuah akar di antara keduanya.',
              },
              blanks: [
                { label: 'f(1) =', answer: -3 },
                { label: 'f(2) =', answer: 3 },
              ],
              hints: [{ en: '$f(1) = 1 - 1 - 3$.', id: '$f(1) = 1 - 1 - 3$.' }],
              explain: {
                en: '$f(1) = -3$ and $f(2) = 3$ have opposite signs, and $f$, a polynomial, is continuous everywhere — so the IVT guarantees a root somewhere in $(1,2)$.',
                id: '$f(1) = -3$ dan $f(2) = 3$ berlawanan tanda, dan $f$, sebuah polinom, kontinu di mana-mana — jadi TNA menjamin sebuah akar di suatu tempat dalam $(1,2)$.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'lim-m4-s2-p',
        runtime: 'math',
        title: { en: 'Domains and Guaranteed Roots', id: 'Domain dan Akar yang Terjamin' },
        brief: {
          en: 'Where two functions are continuous, and one application of the Intermediate Value Theorem.',
          id: 'Tempat dua fungsi kontinu, dan satu penerapan Teorema Nilai Antara.',
        },
        requirements: [
          { en: 'A rational function is discontinuous exactly at its denominator\'s zeros — nowhere else.', id: 'Fungsi rasional tak kontinu persis di akar-akar penyebutnya — tak di tempat lain.' },
          { en: 'The IVT needs opposite signs at the two endpoints, and continuity across the whole interval.', id: 'TNA memerlukan tanda berlawanan di kedua ujung, dan kekontinuan di seluruh selang.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Find the single point to exclude from $R$ to describe where $f(x) = \\dfrac{2x}{x+7}$ is continuous.',
              id: 'Tentukan satu titik yang harus dikecualikan dari $R$ untuk menyatakan tempat $f(x) = \\dfrac{2x}{x+7}$ kontinu.',
            },
            blanks: [{ label: 'x =', answer: -7 }],
            solution: ['\\text{denominator zero at } x=-7, \\text{ numerator there is } -14 \\neq 0'],
          },
          {
            prompt: {
              en: 'Find the smallest value in the domain of $g(x) = \\sqrt{2x - 8}$, where $g$ is continuous.',
              id: 'Tentukan nilai terkecil pada domain $g(x) = \\sqrt{2x - 8}$, tempat $g$ kontinu.',
            },
            blanks: [{ label: 'x_{\\min} =', answer: 4 }],
            solution: ['2x - 8 \\geq 0 \\Rightarrow x \\geq 4'],
          },
          {
            prompt: {
              en: 'For $h(x) = x^3 - 4x - 1$, evaluate $h(2)$ and $h(3)$ to confirm the IVT guarantees a root between them.',
              id: 'Untuk $h(x) = x^3 - 4x - 1$, hitung $h(2)$ dan $h(3)$ untuk memastikan TNA menjamin sebuah akar di antara keduanya.',
            },
            blanks: [
              { label: 'h(2) =', answer: -1 },
              { label: 'h(3) =', answer: 14 },
            ],
            solution: ['h(2) = 8-8-1=-1, \\quad h(3) = 27-12-1=14 \\Rightarrow \\text{opposite signs}'],
          },
        ],
        hints: [
          { en: 'A polynomial is continuous everywhere, so part 3 only needs the sign check — no domain restriction to worry about.', id: 'Polinom kontinu di mana-mana, jadi butir 3 hanya perlu pemeriksaan tanda — tak perlu khawatir pembatasan domain.' },
        ],
        xp: 50,
      },
    },
  ],
}
