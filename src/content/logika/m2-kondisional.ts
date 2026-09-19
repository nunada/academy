import type { Module } from '../types'

/** Module 2 — the connective that carries the most weight in mathematics
 *  itself: "if p then q", along with its converse, inverse and contrapositive,
 *  the biconditional, how to negate a compound statement, and the reading
 *  conventions that make a string of connectives unambiguous. */
export const module2: Module = {
  id: 'log-m2',
  title: { en: 'Conditional Statements', id: 'Pernyataan Kondisional' },
  summary: {
    en: 'Implication and biconditional, their converse, inverse and contrapositive, negating a compound statement, and the conventions for reading one.',
    id: 'Implikasi dan biimplikasi, konvers, invers, dan kontraposisinya, mengingkar pernyataan majemuk, serta kesepakatan membacanya.',
  },
  submodules: [
    /* --------------------------------------- 2.1 conditional & biconditional */
    {
      id: 'log-m2-s1',
      title: { en: 'Conditional and Biconditional', id: 'Kondisional dan Bikondisional' },
      summary: {
        en: 'The "if... then" and "if and only if" connectives, and the one truth table each one keeps.',
        id: 'Kata hubung "jika... maka" dan "jika dan hanya jika", serta satu tabel kebenaran yang dimiliki masing-masing.',
      },
      lessons: [
        {
          id: 'log-m2-s1-l1',
          title: { en: 'Conditional: p → q', id: 'Kondisional: p → q' },
          goal: {
            en: 'Build the truth table for "if p then q", and spot its one surprising row.',
            id: 'Menyusun tabel kebenaran untuk "jika p maka q", dan mengenali satu baris yang mengejutkan di dalamnya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Hypothesis and conclusion', id: 'Hipotesis dan konklusi' },
              body: {
                en: 'A **conditional** (or **implikasi**) statement has the form "if $p$ then $q$", written $p \\Rightarrow q$. $p$ is the **hypothesis** (**antesenden**) and $q$ is the **conclusion** (**konsekuen**). "If it rains, then the field is wet" promises nothing about a dry day — only that rain is followed by a wet field.\n$$\\begin{array} p & q & p \\Rightarrow q \\\\\\\\ B & B & B \\\\\\\\ B & S & S \\\\\\\\ S & B & B \\\\\\\\ S & S & B \\end{array}$$\n$p \\Rightarrow q$ is false in exactly one situation: the hypothesis holds but the conclusion does not — a broken promise. Every other combination counts as keeping the promise.',
                id: 'Pernyataan **kondisional** (atau **implikasi**) berbentuk "jika $p$ maka $q$", ditulis $p \\Rightarrow q$. $p$ disebut **hipotesis** (**antesenden**) dan $q$ disebut **konklusi** (**konsekuen**). "Jika hujan, maka lapangannya basah" tidak menjanjikan apa-apa tentang hari yang kering — hanya bahwa hujan diikuti lapangan yang basah.\n$$\\begin{array} p & q & p \\Rightarrow q \\\\\\\\ B & B & B \\\\\\\\ B & S & S \\\\\\\\ S & B & B \\\\\\\\ S & S & B \\end{array}$$\n$p \\Rightarrow q$ salah pada tepat satu keadaan: hipotesisnya berlaku tetapi konklusinya tidak — sebuah janji yang diingkari. Setiap kombinasi lainnya terhitung sebagai janji yang ditepati.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'True whenever the hypothesis fails', id: 'Benar setiap kali hipotesisnya gagal' },
              body: {
                en: 'The last two rows of the table are the ones learners usually distrust: when $p$ is false, $p \\Rightarrow q$ is true no matter what $q$ is. "If it rains, the field is wet" is not broken by a dry, rainless day — the promise was only ever about what happens **if** it rains. A promise with a hypothesis that never triggers is, vacuously, never broken.\n\nThis is exactly why $p \\Rightarrow q$ is **not** the same claim as $q \\Rightarrow p$: swapping hypothesis and conclusion changes which row is the one dangerous case.',
                id: 'Dua baris terakhir tabelnya adalah yang biasanya paling tidak dipercaya pemula: ketika $p$ salah, $p \\Rightarrow q$ benar apa pun nilai $q$. "Jika hujan, lapangannya basah" tidak diingkari oleh hari yang kering tanpa hujan — janjinya memang hanya tentang apa yang terjadi **jika** hujan. Janji yang hipotesisnya tak pernah terpicu, secara hampa (**vakum**), tak pernah diingkari.\n\nInilah tepatnya sebabnya $p \\Rightarrow q$ **bukan** klaim yang sama dengan $q \\Rightarrow p$: menukar hipotesis dan konklusi mengubah baris mana yang menjadi satu-satunya kasus berbahaya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '$p$: "$8$ is even" (true). $q$: "$8$ is negative" (false). What is $p \\Rightarrow q$?',
                id: '$p$: "$8$ genap" (benar). $q$: "$8$ negatif" (salah). Apa nilai $p \\Rightarrow q$?',
              },
              options: [
                { en: 'True', id: 'Benar' },
                { en: 'False', id: 'Salah' },
                { en: 'Cannot be determined', id: 'Tak dapat ditentukan' },
                { en: 'Not a statement', id: 'Bukan pernyataan' },
              ],
              answer: 1,
              explain: {
                en: 'This is the one broken-promise row: hypothesis true, conclusion false. $p \\Rightarrow q$ is false.',
                id: 'Inilah satu-satunya baris janji yang diingkari: hipotesis benar, konklusi salah. $p \\Rightarrow q$ salah.',
              },
              hint: {
                en: 'A conditional fails in exactly one situation. Check whether the hypothesis is true here while the conclusion is false.',
                id: 'Kondisional gagal pada tepat satu keadaan. Periksa apakah hipotesisnya benar di sini sementara konklusinya salah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: '$p$: "$5$ is negative" (false). $q$: "$5$ is prime" (true). What is $p \\Rightarrow q$?',
                id: '$p$: "$5$ negatif" (salah). $q$: "$5$ prima" (benar). Apa nilai $p \\Rightarrow q$?',
              },
              options: [
                { en: 'True', id: 'Benar' },
                { en: 'False', id: 'Salah' },
                { en: 'Cannot be determined', id: 'Tak dapat ditentukan' },
                { en: 'Not a statement', id: 'Bukan pernyataan' },
              ],
              answer: 0,
              explain: {
                en: 'The hypothesis is false, and a conditional with a false hypothesis is true no matter what the conclusion is — one of the "vacuously true" rows.',
                id: 'Hipotesisnya salah, dan kondisional dengan hipotesis salah bernilai benar apa pun konklusinya — salah satu baris yang "benar secara hampa".',
              },
              hint: {
                en: 'Check the hypothesis first. If it is false, there is nothing left to check — recall which two rows of the table that already settles.',
                id: 'Periksa dulu hipotesisnya. Bila salah, tak ada lagi yang perlu diperiksa — ingat dua baris tabel mana yang sudah ditentukan oleh itu.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the description of when a conditional is false.',
                id: 'Lengkapi deskripsi kapan sebuah kondisional bernilai salah.',
              },
              template: {
                en: '$p \\Rightarrow q$ is false in exactly one case: when the ___ is true and the ___ is false.',
                id: '$p \\Rightarrow q$ salah pada tepat satu kasus: ketika ___ benar dan ___ salah.',
              },
              blanks: {
                en: ['hypothesis', 'conclusion'],
                id: ['hipotesis', 'konklusi'],
              },
              explain: {
                en: 'Every other combination — including a false hypothesis — leaves the promise unbroken.',
                id: 'Setiap kombinasi lainnya — termasuk hipotesis yang salah — meninggalkan janjinya tak diingkari.',
              },
              hint: {
                en: '$p$ is the first of the two roles named in the definition, $q$ the second.',
                id: '$p$ adalah peran pertama yang disebut dalam definisinya, $q$ peran kedua.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: '$p$: "$3 + 3 = 6$" and $q$: "$3 \\times 3 = 6$". Evaluate $p \\Rightarrow q$. (Type 1 for true, 0 for false.)',
                id: '$p$: "$3 + 3 = 6$" dan $q$: "$3 \\times 3 = 6$". Tentukan nilai $p \\Rightarrow q$. (Ketik 1 untuk benar, 0 untuk salah.)',
              },
              blanks: [{ label: 'p \\Rightarrow q =', answer: 0 }],
              hints: [
                { en: 'Work out $p$ and $q$ separately first.', id: 'Tentukan dulu $p$ dan $q$ secara terpisah.' },
                { en: '$p$ is true, and $3 \\times 3 = 9$, not 6.', id: '$p$ benar, dan $3 \\times 3 = 9$, bukan 6.' },
              ],
              explain: {
                en: '$p$ is true and $q$ is false ($3 \\times 3 = 9$) — the one broken-promise case, so $p \\Rightarrow q$ is false.',
                id: '$p$ benar dan $q$ salah ($3 \\times 3 = 9$) — satu-satunya kasus janji diingkari, jadi $p \\Rightarrow q$ salah.',
              },
            },
          ],
        },
        {
          id: 'log-m2-s1-l2',
          title: { en: 'Biconditional: p ↔ q', id: 'Bikondisional: p ↔ q' },
          goal: {
            en: 'Build the truth table for "p if and only if q", and see it as agreement between two statements.',
            id: 'Menyusun tabel kebenaran untuk "p jika dan hanya jika q", dan memandangnya sebagai kesepakatan antara dua pernyataan.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'True exactly when the two agree', id: 'Benar tepat ketika keduanya sepakat' },
              body: {
                en: 'The **biconditional** (or **bikondisional**, **biimplikasi**) of $p$ and $q$, written $p \\Leftrightarrow q$ (read "$p$ if and only if $q$"), holds exactly when $p$ and $q$ share the same truth value.\n$$\\begin{array} p & q & p \\Leftrightarrow q \\\\\\\\ B & B & B \\\\\\\\ B & S & S \\\\\\\\ S & B & S \\\\\\\\ S & S & B \\end{array}$$\nUnlike $p \\Rightarrow q$, this table is symmetric in $p$ and $q$ — swapping them changes nothing, since "agreement" does not care which side is named first.',
                id: '**Bikondisional** (atau **biimplikasi**) dari $p$ dan $q$, ditulis $p \\Leftrightarrow q$ (dibaca "$p$ jika dan hanya jika $q$"), berlaku tepat ketika $p$ dan $q$ memiliki nilai kebenaran yang sama.\n$$\\begin{array} p & q & p \\Leftrightarrow q \\\\\\\\ B & B & B \\\\\\\\ B & S & S \\\\\\\\ S & B & S \\\\\\\\ S & S & B \\end{array}$$\nBerbeda dari $p \\Rightarrow q$, tabel ini simetris dalam $p$ dan $q$ — menukar keduanya tak mengubah apa-apa, karena "kesepakatan" tak peduli sisi mana yang disebut lebih dulu.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A biconditional is two conditionals at once', id: 'Bikondisional adalah dua kondisional sekaligus' },
              body: {
                en: '$p \\Leftrightarrow q$ is exactly the conjunction of both directions:\n$$p \\Leftrightarrow q \\equiv (p \\Rightarrow q) \\land (q \\Rightarrow p)$$\n"A triangle is equilateral if and only if all three of its angles are $60°$" packs two promises into one sentence: being equilateral guarantees the angles, **and** having those angles guarantees being equilateral. Mathematics reaches for $\\Leftrightarrow$ exactly when both directions genuinely hold — dropping either one leaves only a plain $\\Rightarrow$.',
                id: '$p \\Leftrightarrow q$ persis konjungsi dari kedua arahnya:\n$$p \\Leftrightarrow q \\equiv (p \\Rightarrow q) \\land (q \\Rightarrow p)$$\n"Sebuah segitiga sama sisi jika dan hanya jika ketiga sudutnya $60°$" memuat dua janji sekaligus dalam satu kalimat: sama sisi menjamin sudut-sudutnya, **dan** memiliki sudut-sudut itu menjamin sama sisinya. Matematika memakai $\\Leftrightarrow$ tepat ketika kedua arah sungguh berlaku — melepas salah satunya hanya menyisakan $\\Rightarrow$ biasa.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '$p$: "$10$ is even" (true). $q$: "$10$ is a multiple of $4$" (false). What is $p \\Leftrightarrow q$?',
                id: '$p$: "$10$ genap" (benar). $q$: "$10$ kelipatan $4$" (salah). Apa nilai $p \\Leftrightarrow q$?',
              },
              options: [
                { en: 'True', id: 'Benar' },
                { en: 'False', id: 'Salah' },
                { en: 'Cannot be determined', id: 'Tak dapat ditentukan' },
                { en: 'Not a statement', id: 'Bukan pernyataan' },
              ],
              answer: 1,
              explain: {
                en: '$p$ and $q$ disagree — one true, one false — so they are not in agreement, and $p \\Leftrightarrow q$ is false.',
                id: '$p$ dan $q$ tidak sepakat — satu benar, satu salah — jadi keduanya tak sejalan, dan $p \\Leftrightarrow q$ salah.',
              },
              hint: {
                en: 'A biconditional only asks one question: do $p$ and $q$ have the same truth value or not?',
                id: 'Bikondisional hanya menanyakan satu hal: apakah $p$ dan $q$ punya nilai kebenaran yang sama atau tidak?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which pair of statements below has $p \\Leftrightarrow q$ true?',
                id: 'Pasangan pernyataan manakah di bawah ini yang membuat $p \\Leftrightarrow q$ benar?',
              },
              options: [
                { en: '$p$: "$7$ is prime" (T), $q$: "$7$ is even" (F)', id: '$p$: "$7$ prima" (B), $q$: "$7$ genap" (S)' },
                { en: '$p$: "$9$ is odd" (T), $q$: "$9$ is a perfect square" (T)', id: '$p$: "$9$ ganjil" (B), $q$: "$9$ bilangan kuadrat" (B)' },
                { en: '$p$: "$4$ is odd" (F), $q$: "$4$ is prime" (T)', id: '$p$: "$4$ ganjil" (S), $q$: "$4$ prima" (B)' },
                { en: 'None of them', id: 'Tak satu pun' },
              ],
              answer: 1,
              explain: {
                en: 'Both statements are true in the second pair, so they agree — the biconditional is true. In the other two pairs one side is true and the other false.',
                id: 'Pada pasangan kedua kedua pernyataannya sama-sama benar, jadi sepakat — bikondisionalnya benar. Pada dua pasangan lainnya satu sisi benar dan sisi lain salah.',
              },
              hint: {
                en: 'You do not need the statements to be related in meaning — only for their two truth values to match.',
                id: 'Kamu tak perlu kedua pernyataannya berkaitan maknanya — hanya perlu kedua nilai kebenarannya sama.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in order to build the truth table for $(p \\Rightarrow q) \\land (q \\Rightarrow p)$, from the header down, and see that it matches $p \\Leftrightarrow q$.',
                id: 'Susun baris-baris ini agar menjadi tabel kebenaran $(p \\Rightarrow q) \\land (q \\Rightarrow p)$, dari judul kolom ke bawah, dan lihat bahwa hasilnya sama dengan $p \\Leftrightarrow q$.',
              },
              lines: {
                en: [
                  '\\begin{array} p & q & p \\Rightarrow q & q \\Rightarrow p & (p \\Rightarrow q) \\land (q \\Rightarrow p)',
                  'B & B & B & B & B',
                  'B & S & S & B & S',
                  'S & B & B & S & S',
                  'S & S & B & B & B',
                ],
                id: [
                  '\\begin{array} p & q & p \\Rightarrow q & q \\Rightarrow p & (p \\Rightarrow q) \\land (q \\Rightarrow p)',
                  'B & B & B & B & B',
                  'B & S & S & B & S',
                  'S & B & B & S & S',
                  'S & S & B & B & B',
                ],
              },
              explain: {
                en: 'Column by column: fill $p \\Rightarrow q$, then $q \\Rightarrow p$, then take their conjunction. Row for row it comes out $B, S, S, B$ — exactly $p \\Leftrightarrow q$\'s own table.',
                id: 'Kolom demi kolom: isi $p \\Rightarrow q$, lalu $q \\Rightarrow p$, lalu ambil konjungsi keduanya. Baris demi baris hasilnya $B, S, S, B$ — persis tabel $p \\Leftrightarrow q$ sendiri.',
              },
              hint: {
                en: 'Fill the two conditional columns first, one implication at a time, then combine only those two columns with the conjunction rule.',
                id: 'Isi dulu kedua kolom kondisional, satu implikasi setiap kali, lalu gabungkan hanya kedua kolom itu dengan aturan konjungsi.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: '$p$: "$-3 < 0$" and $q$: "$(-3)^2 = 9$". Evaluate $p \\Leftrightarrow q$. (Type 1 for true, 0 for false.)',
                id: '$p$: "$-3 < 0$" dan $q$: "$(-3)^2 = 9$". Tentukan nilai $p \\Leftrightarrow q$. (Ketik 1 untuk benar, 0 untuk salah.)',
              },
              blanks: [{ label: 'p \\Leftrightarrow q =', answer: 1 }],
              hints: [
                { en: 'Work out $p$ and $q$ separately, then compare them.', id: 'Tentukan $p$ dan $q$ secara terpisah, lalu bandingkan keduanya.' },
              ],
              explain: {
                en: 'Both $p$ and $q$ are true, so they agree, and $p \\Leftrightarrow q$ is true.',
                id: '$p$ dan $q$ sama-sama benar, jadi keduanya sepakat, dan $p \\Leftrightarrow q$ benar.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m2-s1-p',
        runtime: 'math',
        title: { en: 'Conditional and Biconditional', id: 'Kondisional dan Bikondisional' },
        brief: {
          en: 'Evaluate implications and biconditionals, including the vacuously-true case.',
          id: 'Menilai implikasi dan bikondisional, termasuk kasus yang benar secara hampa.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
          { en: 'Answer truth values as 1 (true) or 0 (false).', id: 'Jawab nilai kebenaran dengan 1 (benar) atau 0 (salah).' },
        ],
        tasks: [
          {
            prompt: {
              en: '$p$: "$2$ is negative" (false). $q$: "$2$ is prime" (true). Evaluate $p \\Rightarrow q$.',
              id: '$p$: "$2$ negatif" (salah). $q$: "$2$ prima" (benar). Tentukan nilai $p \\Rightarrow q$.',
            },
            blanks: [{ label: 'p \\Rightarrow q =', answer: 1 }],
            solution: ['Hipotesisnya salah, jadi kondisionalnya benar secara hampa, apa pun nilai $q$.'],
          },
          {
            prompt: {
              en: '$p$: "$16$ is a perfect square" (true). $q$: "$16$ is odd" (false). Evaluate $p \\Rightarrow q$.',
              id: '$p$: "$16$ bilangan kuadrat" (benar). $q$: "$16$ ganjil" (salah). Tentukan nilai $p \\Rightarrow q$.',
            },
            blanks: [{ label: 'p \\Rightarrow q =', answer: 0 }],
            solution: ['Hipotesisnya benar tetapi konklusinya salah — satu-satunya kasus kondisionalnya salah.'],
          },
          {
            prompt: {
              en: '$p$: "$6 \\times 2 = 12$" and $q$: "$12 \\div 2 = 6$". Evaluate $p \\Leftrightarrow q$.',
              id: '$p$: "$6 \\times 2 = 12$" dan $q$: "$12 \\div 2 = 6$". Tentukan nilai $p \\Leftrightarrow q$.',
            },
            blanks: [{ label: 'p \\Leftrightarrow q =', answer: 1 }],
            solution: ['Kedua pernyataan benar, jadi keduanya sepakat dan $p \\Leftrightarrow q$ benar.'],
          },
        ],
        hints: [
          {
            en: 'Whenever the hypothesis of a conditional is false, you already know the answer without even looking at the conclusion.',
            id: 'Setiap kali hipotesis sebuah kondisional salah, kamu sudah tahu jawabannya tanpa perlu melihat konklusinya.',
          },
        ],
        xp: 50,
      },
    },

    /* --------------------------------- 2.2 converse/inverse/contrapositive */
    {
      id: 'log-m2-s2',
      title: { en: 'Converse, Inverse, Contrapositive, and Negation', id: 'Konvers, Invers, Kontraposisi, dan Negasi' },
      summary: {
        en: 'Three statements built from a conditional, how to negate a compound statement, and the order of reading a string of connectives.',
        id: 'Tiga pernyataan yang dibangun dari sebuah kondisional, cara mengingkar pernyataan majemuk, dan urutan membaca rangkaian kata hubung.',
      },
      lessons: [
        {
          id: 'log-m2-s2-l1',
          title: { en: 'Converse, Inverse, and Contrapositive', id: 'Konvers, Invers, dan Kontraposisi' },
          goal: {
            en: 'Build all three related statements from a conditional, and know which one shares its truth value.',
            id: 'Menyusun ketiga pernyataan terkait dari sebuah kondisional, dan mengetahui yang mana yang berbagi nilai kebenaran dengannya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Three ways to rearrange p ⇒ q', id: 'Tiga cara menyusun ulang p ⇒ q' },
              body: {
                en: 'From $p \\Rightarrow q$, three related statements are built:\n$$\\text{Konvers: } q \\Rightarrow p \\qquad \\text{Invers: } \\neg p \\Rightarrow \\neg q \\qquad \\text{Kontraposisi: } \\neg q \\Rightarrow \\neg p$$\nThe **converse** swaps hypothesis and conclusion. The **inverse** negates both, keeping the order. The **contrapositive** does both at once: swap **and** negate.\n\n"If a number is divisible by 4, then it is even" has converse "if a number is even, then it is divisible by 4" — true originally, but the converse is false ($6$ is even and not divisible by 4). Swapping the two roles is not a step that preserves truth.',
                id: 'Dari $p \\Rightarrow q$, tiga pernyataan terkait dibangun:\n$$\\text{Konvers: } q \\Rightarrow p \\qquad \\text{Invers: } \\neg p \\Rightarrow \\neg q \\qquad \\text{Kontraposisi: } \\neg q \\Rightarrow \\neg p$$\n**Konvers** menukar hipotesis dan konklusi. **Invers** mengingkar keduanya, tetap dengan urutan semula. **Kontraposisi** melakukan keduanya sekaligus: menukar **dan** mengingkar.\n\n"Jika sebuah bilangan habis dibagi 4, maka bilangan itu genap" memiliki konvers "jika sebuah bilangan genap, maka bilangan itu habis dibagi 4" — semula benar, tetapi konversnya salah ($6$ genap dan tak habis dibagi 4). Menukar kedua perannya bukan langkah yang mempertahankan kebenaran.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The one that always agrees', id: 'Yang selalu sepakat' },
              body: {
                en: 'The contrapositive is special: it is **logically equivalent** to the original conditional — always the same truth value, for every possible $p$ and $q$.\n$$p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$$\nCheck it against the earlier example: "if a number is not even, then it is not divisible by 4" is true — an odd number is certainly not a multiple of 4. The converse and the inverse, by contrast, are logically equivalent to **each other** (each is the other read backwards), but not to the original — which is exactly why $6$ broke the converse without ever threatening the original conditional.',
                id: 'Kontraposisi istimewa: ia **ekuivalen secara logis** dengan kondisional aslinya — selalu punya nilai kebenaran yang sama, untuk sebarang $p$ dan $q$.\n$$p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$$\nPeriksa dengan contoh sebelumnya: "jika sebuah bilangan tidak genap, maka bilangan itu tak habis dibagi 4" benar — bilangan ganjil tentu bukan kelipatan 4. Konvers dan invers, sebaliknya, ekuivalen secara logis **satu sama lain** (masing-masing adalah yang lain dibaca terbalik), tetapi tidak dengan yang asli — itulah sebabnya $6$ mematahkan konversnya tanpa pernah mengancam kondisional aslinya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the **contrapositive** of "if $x$ is a multiple of $6$, then $x$ is a multiple of $3$"?',
                id: 'Apa **kontraposisi** dari "jika $x$ kelipatan $6$, maka $x$ kelipatan $3$"?',
              },
              options: [
                { en: 'If $x$ is a multiple of 3, then $x$ is a multiple of 6.', id: 'Jika $x$ kelipatan 3, maka $x$ kelipatan 6.' },
                { en: 'If $x$ is not a multiple of 6, then $x$ is not a multiple of 3.', id: 'Jika $x$ tak kelipatan 6, maka $x$ tak kelipatan 3.' },
                { en: 'If $x$ is not a multiple of 3, then $x$ is not a multiple of 6.', id: 'Jika $x$ tak kelipatan 3, maka $x$ tak kelipatan 6.' },
                { en: 'If $x$ is not a multiple of 6, then $x$ is a multiple of 3.', id: 'Jika $x$ tak kelipatan 6, maka $x$ kelipatan 3.' },
              ],
              answer: 2,
              explain: {
                en: 'The contrapositive swaps the roles **and** negates both: $\\neg q \\Rightarrow \\neg p$ becomes "if $x$ is not a multiple of 3, then $x$ is not a multiple of 6" — and it is true, matching the original.',
                id: 'Kontraposisi menukar peran **dan** mengingkar keduanya: $\\neg q \\Rightarrow \\neg p$ menjadi "jika $x$ tak kelipatan 3, maka $x$ tak kelipatan 6" — dan ini benar, sama dengan yang asli.',
              },
              hint: {
                en: 'The contrapositive does two things to the original at once: swap which side comes first, and negate both sides. Which option does both?',
                id: 'Kontraposisi melakukan dua hal sekaligus pada aslinya: menukar sisi mana yang lebih dulu, dan mengingkar kedua sisinya. Pilihan mana yang melakukan keduanya?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The converse of a true conditional is:',
                id: 'Konvers dari sebuah kondisional yang benar adalah:',
              },
              options: [
                { en: 'Always true as well', id: 'Selalu benar juga' },
                { en: 'Always false', id: 'Selalu salah' },
                { en: 'Not necessarily true — it may go either way', id: 'Belum tentu benar — bisa jadi keduanya' },
                { en: 'Always equivalent to the contrapositive', id: 'Selalu ekuivalen dengan kontraposisinya' },
              ],
              answer: 2,
              explain: {
                en: 'The converse swaps hypothesis and conclusion, and swapping is not a truth-preserving move — "divisible by 4 ⇒ even" is true while its converse is false, but "$x = 2$ ⇒ $x^2 = 4$" has a converse that also happens to be true. Nothing about a true conditional guarantees which way its converse falls.',
                id: 'Konvers menukar hipotesis dan konklusi, dan menukar bukanlah langkah yang mempertahankan kebenaran — "habis dibagi 4 ⇒ genap" benar sementara konversnya salah, tetapi "$x = 2$ ⇒ $x^2 = 4$" konversnya kebetulan juga benar. Tak ada yang menjamin ke arah mana konvers sebuah kondisional yang benar akan jatuh.',
              },
              hint: {
                en: 'Only one of the three related statements is guaranteed to share the original\'s truth value. Is the converse that one?',
                id: 'Hanya satu dari ketiga pernyataan terkait yang dijamin berbagi nilai kebenaran dengan aslinya. Apakah konvers yang dimaksud?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the three statements built from $p \\Rightarrow q$.',
                id: 'Lengkapi ketiga pernyataan yang dibangun dari $p \\Rightarrow q$.',
              },
              template: '\\text{Konvers: } ___ \\qquad \\text{Invers: } ___ \\qquad \\text{Kontraposisi: } ___',
              blanks: ['q \\Rightarrow p', '\\neg p \\Rightarrow \\neg q', '\\neg q \\Rightarrow \\neg p'],
              explain: {
                en: 'Converse swaps only; inverse negates only; contrapositive does both — and only the contrapositive is guaranteed to match the original\'s truth value.',
                id: 'Konvers hanya menukar; invers hanya mengingkar; kontraposisi melakukan keduanya — dan hanya kontraposisi yang dijamin sama nilai kebenarannya dengan aslinya.',
              },
              hint: {
                en: 'Work through each name literally: "swap" for the converse, "negate" for the inverse, and "swap, then negate" for the contrapositive.',
                id: 'Kerjakan tiap namanya secara harfiah: "tukar" untuk konvers, "ingkar" untuk invers, dan "tukar, lalu ingkar" untuk kontraposisi.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The conditional $p \\Rightarrow q$ is true, and its inverse $\\neg p \\Rightarrow \\neg q$ happens to be true as well. What must be true of its converse $q \\Rightarrow p$? (Type 1 for true, 0 for false.)',
                id: 'Kondisional $p \\Rightarrow q$ benar, dan inversnya $\\neg p \\Rightarrow \\neg q$ kebetulan juga benar. Apa yang pasti berlaku pada konversnya $q \\Rightarrow p$? (Ketik 1 untuk benar, 0 untuk salah.)',
              },
              blanks: [{ label: 'q \\Rightarrow p =', answer: 1 }],
              hints: [
                { en: 'The converse and the inverse are each the other one read backwards.', id: 'Konvers dan invers masing-masing adalah yang lain dibaca terbalik.' },
                { en: 'Two logically equivalent statements always share a truth value.', id: 'Dua pernyataan yang ekuivalen secara logis selalu berbagi nilai kebenaran.' },
              ],
              explain: {
                en: 'The converse ($q \\Rightarrow p$) is logically equivalent to the inverse ($\\neg p \\Rightarrow \\neg q$) — each is the contrapositive of the other. Since the inverse is true here, the converse must be true too.',
                id: 'Konvers ($q \\Rightarrow p$) ekuivalen secara logis dengan invers ($\\neg p \\Rightarrow \\neg q$) — masing-masing adalah kontraposisi dari yang lain. Karena inversnya benar di sini, konversnya pun pasti benar.',
              },
            },
          ],
        },
        {
          id: 'log-m2-s2-l2',
          title: { en: 'Negating a Compound Statement', id: 'Negasi Pernyataan Majemuk' },
          goal: {
            en: "Apply De Morgan's Laws and negate a conditional correctly.",
            id: 'Menerapkan Hukum De Morgan dan mengingkar kondisional dengan benar.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: "De Morgan's Laws", id: 'Hukum De Morgan' },
              body: {
                en: 'Negating "$p$ and $q$" does not mean negating both halves and keeping "and" — that is a common and costly mistake. **De Morgan\'s Laws** say what actually happens:\n$$\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q \\qquad \\neg(p \\lor q) \\equiv \\neg p \\land \\neg q$$\nNegating flips the connective as well as each half. "It is not the case that (it is raining and cold)" means "it is not raining, or it is not cold" — at least one half fails, not necessarily both.',
                id: 'Mengingkar "$p$ dan $q$" bukan berarti mengingkar kedua bagiannya sambil tetap memakai "dan" — itu kekeliruan yang umum dan berbahaya. **Hukum De Morgan** menyatakan apa yang sebenarnya terjadi:\n$$\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q \\qquad \\neg(p \\lor q) \\equiv \\neg p \\land \\neg q$$\nMengingkar membalik penghubungnya juga, bukan hanya kedua bagiannya. "Tidaklah benar bahwa (hujan dan dingin)" berarti "tidak hujan, atau tidak dingin" — setidaknya satu bagian gagal, tak harus keduanya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Negating "if... then"', id: 'Mengingkar "jika... maka"' },
              body: {
                en: 'A conditional is only ever broken one way — hypothesis true, conclusion false — so its negation says exactly that, with no $\\Rightarrow$ left at all:\n$$\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$$\nThe negation of "if it rains, the field is wet" is not "if it rains, the field is dry" — it is "it rains, and the field is not wet". A single counterexample (rain, dry field) is all it would take to make the negation true, which is exactly the one row that made the original false.\n\nFor the biconditional, negating "agreement" gives disagreement:\n$$\\neg(p \\Leftrightarrow q) \\equiv (p \\land \\neg q) \\lor (\\neg p \\land q)$$',
                id: 'Kondisional hanya pernah diingkari dengan satu cara — hipotesis benar, konklusi salah — jadi negasinya persis menyatakan itu, tanpa menyisakan $\\Rightarrow$ sama sekali:\n$$\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$$\nNegasi dari "jika hujan, lapangannya basah" bukan "jika hujan, lapangannya kering" — melainkan "hujan, dan lapangannya tidak basah". Satu saja contoh penyangkal (hujan, lapangan kering) sudah cukup membuat negasinya benar, dan itu persis satu baris yang membuat aslinya salah.\n\nUntuk bikondisional, mengingkar "kesepakatan" menghasilkan ketidaksepakatan:\n$$\\neg(p \\Leftrightarrow q) \\equiv (p \\land \\neg q) \\lor (\\neg p \\land q)$$',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the negation of "the number is even and positive"?',
                id: 'Apa negasi dari "bilangan itu genap dan positif"?',
              },
              options: [
                { en: 'The number is odd and negative.', id: 'Bilangan itu ganjil dan negatif.' },
                { en: 'The number is odd, or it is not positive.', id: 'Bilangan itu ganjil, atau tidak positif.' },
                { en: 'The number is odd and not positive.', id: 'Bilangan itu ganjil dan tidak positif.' },
                { en: 'The number is even, or it is positive.', id: 'Bilangan itu genap, atau positif.' },
              ],
              answer: 1,
              explain: {
                en: "By De Morgan's Law, $\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$: negate each half, and turn \"and\" into \"or\".",
                id: 'Menurut Hukum De Morgan, $\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$: ingkar tiap bagian, dan ubah "dan" menjadi "atau".',
              },
              hint: {
                en: 'Negating a conjunction does two things: it negates each half, and it swaps the connective for the other one. Which option does both?',
                id: 'Mengingkar konjungsi melakukan dua hal: mengingkar tiap bagian, dan menukar penghubungnya dengan yang lain. Pilihan mana yang melakukan keduanya?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'What is the negation of "if $n$ is prime, then $n$ is odd"?',
                id: 'Apa negasi dari "jika $n$ prima, maka $n$ ganjil"?',
              },
              options: [
                { en: 'If $n$ is prime, then $n$ is even.', id: 'Jika $n$ prima, maka $n$ genap.' },
                { en: 'If $n$ is not prime, then $n$ is not odd.', id: 'Jika $n$ tak prima, maka $n$ tak ganjil.' },
                { en: '$n$ is prime and $n$ is even.', id: '$n$ prima dan $n$ genap.' },
                { en: '$n$ is not prime, or $n$ is odd.', id: '$n$ tak prima, atau $n$ ganjil.' },
              ],
              answer: 2,
              explain: {
                en: '$\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$: keep the hypothesis, negate the conclusion, and use "and" — the negation of a conditional is never itself a conditional.',
                id: '$\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$: pertahankan hipotesisnya, ingkar konklusinya, dan pakai "dan" — negasi kondisional tak pernah berbentuk kondisional lagi.',
              },
              hint: {
                en: 'Negating a conditional never leaves an "if... then" behind — it becomes an "and" statement instead. Which option has no $\\Rightarrow$ left in it?',
                id: 'Mengingkar kondisional tak pernah menyisakan "jika... maka" — hasilnya justru pernyataan "dan". Pilihan mana yang tak lagi memuat $\\Rightarrow$?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in order to negate $\\neg(p \\lor \\neg q)$ down to its simplest form.',
                id: 'Susun baris-baris ini dengan urutan yang benar untuk mengingkar $\\neg(p \\lor \\neg q)$ hingga bentuk paling sederhana.',
              },
              lines: {
                en: [
                  '\\neg(p \\lor \\neg q)',
                  '\\equiv \\neg p \\land \\neg(\\neg q)',
                  '\\equiv \\neg p \\land q',
                ],
                id: [
                  '\\neg(p \\lor \\neg q)',
                  '\\equiv \\neg p \\land \\neg(\\neg q)',
                  '\\equiv \\neg p \\land q',
                ],
              },
              explain: {
                en: "De Morgan's Law turns the outer \\lor into \\land and negates each half, then the double-negation law removes the leftover \\neg(\\neg q).",
                id: 'Hukum De Morgan mengubah $\\lor$ terluar menjadi $\\land$ dan mengingkar tiap bagian, lalu hukum ingkaran ganda menghilangkan sisa $\\neg(\\neg q)$.',
              },
              hint: {
                en: "Apply De Morgan's Law once to the whole expression first — that alone still leaves a double negation sitting on the $q$, which the next law clears up.",
                id: 'Terapkan dulu Hukum De Morgan sekali pada seluruh ungkapannya — itu saja masih menyisakan ingkaran ganda pada $q$, yang dibereskan oleh hukum berikutnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $p$: "$4$ is even" (true) and $q$: "$4$ is prime" (false), evaluate $\\neg(p \\land q)$. (Type 1 for true, 0 for false.)',
                id: 'Untuk $p$: "$4$ genap" (benar) dan $q$: "$4$ prima" (salah), tentukan nilai $\\neg(p \\land q)$. (Ketik 1 untuk benar, 0 untuk salah.)',
              },
              blanks: [{ label: '\\neg(p \\land q) =', answer: 1 }],
              hints: [
                { en: 'Work out $p \\land q$ first, then negate the whole thing.', id: 'Tentukan dulu $p \\land q$, baru ingkar hasilnya.' },
              ],
              explain: {
                en: '$p \\land q$ is false ($q$ fails), so its negation $\\neg(p \\land q)$ is true.',
                id: '$p \\land q$ salah ($q$ gagal), jadi negasinya $\\neg(p \\land q)$ benar.',
              },
            },
          ],
        },
        {
          id: 'log-m2-s2-l3',
          title: { en: 'Conventions for Reading Connectives', id: 'Kesepakatan Membaca Kata Hubung' },
          goal: {
            en: 'Read an unparenthesised string of connectives the way every mathematics text agrees to.',
            id: 'Membaca rangkaian kata hubung tanpa tanda kurung sebagaimana disepakati semua buku matematika.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'An order of operations for logic', id: 'Urutan pengerjaan untuk logika' },
              body: {
                en: 'Just as $2 + 3 \\times 4$ is agreed to mean $2 + (3 \\times 4)$ and not $(2+3)\\times 4$, a string of connectives with no parentheses is read by a fixed order — tightest-binding first:\n$$\\neg \\quad > \\quad \\land \\quad > \\quad \\lor \\quad > \\quad \\Rightarrow \\quad > \\quad \\Leftrightarrow$$\nSo $\\neg p \\lor q \\land r$ means $(\\neg p) \\lor (q \\land r)$ — negation grabs only $p$, and conjunction binds before disjunction. Parentheses always override the convention, and a well-written problem adds them the moment the order alone would leave any doubt.',
                id: 'Sama seperti $2 + 3 \\times 4$ disepakati berarti $2 + (3 \\times 4)$ dan bukan $(2+3)\\times 4$, rangkaian kata hubung tanpa tanda kurung dibaca menurut urutan tetap — yang paling erat ikatannya dikerjakan lebih dulu:\n$$\\neg \\quad > \\quad \\land \\quad > \\quad \\lor \\quad > \\quad \\Rightarrow \\quad > \\quad \\Leftrightarrow$$\nJadi $\\neg p \\lor q \\land r$ berarti $(\\neg p) \\lor (q \\land r)$ — negasi hanya mengambil $p$, dan konjungsi mengikat lebih dulu daripada disjungsi. Tanda kurung selalu mengalahkan kesepakatan ini, dan soal yang ditulis dengan baik menambahkannya begitu urutan saja masih bisa menyisakan keraguan.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Why the weakest connective goes last', id: 'Mengapa penghubung terlemah dikerjakan terakhir' },
              body: {
                en: 'The order is not arbitrary: $\\neg$ touches only the one statement right after it, so it has to bind tightest or it would reach further than intended. $\\Rightarrow$ and $\\Leftrightarrow$ are usually the **point** of a whole sentence — "if [all that stuff about $p$ and $q$] then [all that stuff about $r$]" — so they are meant to split the sentence into its two largest pieces, which means they must bind **last**, after everything smaller has already been grouped.\n\nWhen two connectives of the same strength appear together, such as $p \\land q \\land r$, they are read left to right — though for $\\land$ and $\\lor$ this never actually matters, since both are associative: $(p \\land q) \\land r$ and $p \\land (q \\land r)$ always agree.',
                id: 'Urutannya tak sembarangan: $\\neg$ hanya menyentuh satu pernyataan tepat setelahnya, jadi ia harus mengikat paling erat, atau ia akan menjangkau lebih jauh dari yang dimaksud. $\\Rightarrow$ dan $\\Leftrightarrow$ biasanya adalah **inti** dari seluruh kalimat — "jika [semua hal tentang $p$ dan $q$ itu] maka [semua hal tentang $r$ itu]" — jadi keduanya memang dimaksudkan untuk membelah kalimat menjadi dua bagian terbesarnya, yang berarti keduanya harus mengikat **paling akhir**, setelah semua yang lebih kecil sudah dikelompokkan.\n\nKetika dua penghubung dengan kekuatan yang sama muncul bersama, seperti $p \\land q \\land r$, keduanya dibaca dari kiri ke kanan — meski untuk $\\land$ dan $\\lor$ ini sebenarnya tak pernah berpengaruh, karena keduanya asosiatif: $(p \\land q) \\land r$ dan $p \\land (q \\land r)$ selalu sepakat.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'How should $p \\land q \\Rightarrow r$ be read, following the usual convention?',
                id: 'Bagaimana seharusnya $p \\land q \\Rightarrow r$ dibaca, menurut kesepakatan yang berlaku?',
              },
              options: [
                { en: '$p \\land (q \\Rightarrow r)$', id: '$p \\land (q \\Rightarrow r)$' },
                { en: '$(p \\land q) \\Rightarrow r$', id: '$(p \\land q) \\Rightarrow r$' },
                { en: 'It is ambiguous without parentheses', id: 'Ambigu tanpa tanda kurung' },
                { en: '$p \\land (q \\land r)$', id: '$p \\land (q \\land r)$' },
              ],
              answer: 1,
              explain: {
                en: '$\\land$ binds tighter than $\\Rightarrow$, so the conjunction is grouped first, leaving the implication to split the sentence into its two largest pieces.',
                id: '$\\land$ mengikat lebih erat daripada $\\Rightarrow$, jadi konjungsinya dikelompokkan lebih dulu, menyisakan implikasi untuk membelah kalimatnya menjadi dua bagian terbesarnya.',
              },
              hint: {
                en: 'Recall which of $\\land$ and $\\Rightarrow$ sits closer to $\\neg$ in the binding order — that one groups first.',
                id: 'Ingat yang mana di antara $\\land$ dan $\\Rightarrow$ yang lebih dekat dengan $\\neg$ dalam urutan pengikatan — itulah yang dikelompokkan lebih dulu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'How should $\\neg p \\land q$ be read?',
                id: 'Bagaimana seharusnya $\\neg p \\land q$ dibaca?',
              },
              options: [
                { en: '$\\neg(p \\land q)$', id: '$\\neg(p \\land q)$' },
                { en: '$(\\neg p) \\land q$', id: '$(\\neg p) \\land q$' },
                { en: '$\\neg(p) \\land \\neg(q)$', id: '$\\neg(p) \\land \\neg(q)$' },
                { en: 'It depends on the truth values of $p$ and $q$', id: 'Tergantung nilai kebenaran $p$ dan $q$' },
              ],
              answer: 1,
              explain: {
                en: '$\\neg$ binds tightest of all, reaching only the single statement right beside it — here, just $p$.',
                id: '$\\neg$ mengikat paling erat dari semuanya, hanya menjangkau satu pernyataan tepat di sisinya — di sini, hanya $p$.',
              },
              hint: {
                en: 'Negation is the tightest-binding connective there is — it never reaches past the single statement written immediately next to it.',
                id: 'Negasi adalah penghubung yang mengikat paling erat — ia tak pernah menjangkau lebih jauh dari satu pernyataan yang ditulis tepat di sebelahnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: {
                en: 'Complete the binding order, from tightest to weakest.',
                id: 'Lengkapi urutan pengikatan, dari yang paling erat ke yang paling lemah.',
              },
              template: '___ \\; > \\; \\land \\; > \\; ___ \\; > \\; \\Rightarrow \\; > \\; ___',
              blanks: ['\\neg', '\\lor', '\\Leftrightarrow'],
              explain: {
                en: 'Negation binds tightest since it touches only one statement; the biconditional binds loosest since it usually names the whole sentence\'s overall shape.',
                id: 'Negasi mengikat paling erat karena hanya menyentuh satu pernyataan; bikondisional mengikat paling lemah karena biasanya menyatakan bentuk keseluruhan kalimatnya.',
              },
              hint: {
                en: 'The full order is $\\neg, \\land, \\lor, \\Rightarrow, \\Leftrightarrow$ — two of its five members are already given to you in the template.',
                id: 'Urutan lengkapnya adalah $\\neg, \\land, \\lor, \\Rightarrow, \\Leftrightarrow$ — dua dari lima anggotanya sudah diberikan pada template.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m2-s2-p',
        runtime: 'math',
        title: { en: 'Converse, Negation, and Convention', id: 'Konvers, Negasi, dan Kesepakatan' },
        brief: {
          en: 'Three checks that combine the contrapositive, De Morgan, and the reading order for connectives.',
          id: 'Tiga pengecekan yang menggabungkan kontraposisi, De Morgan, dan urutan pembacaan kata hubung.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
          { en: 'Answer truth values as 1 (true) or 0 (false).', id: 'Jawab nilai kebenaran dengan 1 (benar) atau 0 (salah).' },
        ],
        tasks: [
          {
            prompt: {
              en: 'The conditional "if $n$ is a multiple of 9, then $n$ is a multiple of 3" is true. Its contrapositive must also be true. Confirm this for $n = 5$: is "$5$ is not a multiple of 3, so $5$ is not a multiple of 9" true?',
              id: 'Kondisional "jika $n$ kelipatan 9, maka $n$ kelipatan 3" benar. Kontraposisinya pasti juga benar. Konfirmasikan untuk $n = 5$: apakah "$5$ bukan kelipatan 3, jadi $5$ bukan kelipatan 9" benar?',
            },
            blanks: [{ answer: 1 }],
            solution: ['$5$ memang bukan kelipatan 3 dan bukan pula kelipatan 9, jadi kontraposisinya benar untuk $n=5$, sebagaimana dijamin oleh ekuivalensinya dengan yang asli.'],
          },
          {
            prompt: {
              en: 'Evaluate $\\neg(p \\lor q)$ for $p$: "$3$ is even" (false) and $q$: "$3$ is negative" (false).',
              id: 'Tentukan nilai $\\neg(p \\lor q)$ untuk $p$: "$3$ genap" (salah) dan $q$: "$3$ negatif" (salah).',
            },
            blanks: [{ label: '\\neg(p \\lor q) =', answer: 1 }],
            solution: ['$p \\lor q$ salah (keduanya salah), jadi negasinya $\\neg(p \\lor q)$ benar — cocok dengan $\\neg p \\land \\neg q$, yang juga benar karena keduanya benar.'],
          },
          {
            prompt: {
              en: 'Reading $p \\lor \\neg q \\land r$ by convention groups it as $p \\lor (\\neg q \\land r)$. With $p$ false, $q$ true, $r$ true, evaluate it.',
              id: 'Membaca $p \\lor \\neg q \\land r$ menurut kesepakatan mengelompokkannya menjadi $p \\lor (\\neg q \\land r)$. Dengan $p$ salah, $q$ benar, $r$ benar, tentukan nilainya.',
            },
            blanks: [{ label: 'p \\lor (\\neg q \\land r) =', answer: 0 }],
            solution: ['$\\neg q$ salah, jadi $\\neg q \\land r$ salah; $p$ juga salah; disjungsi dua bagian yang salah tetap salah.'],
          },
        ],
        hints: [
          {
            en: 'Work each expression from the inside out: negate first, then combine with the tighter-binding connective, and only then the looser one.',
            id: 'Kerjakan tiap ungkapan dari dalam ke luar: ingkar dulu, lalu gabungkan dengan penghubung yang lebih erat ikatannya, baru yang lebih lemah.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
