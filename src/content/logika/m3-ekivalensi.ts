import type { Module } from '../types'

/** Module 3 — three labels for the last column of a truth table: always true,
 *  always false, or in step with another compound statement row for row. */
export const module3: Module = {
  id: 'log-m3',
  title: { en: 'Tautology, Contradiction, and Equivalence', id: 'Tautologi, Kontradiksi, dan Ekivalensi' },
  summary: {
    en: 'What it means for a compound statement to be always true, always false, or logically identical to another.',
    id: 'Apa artinya sebuah pernyataan majemuk selalu benar, selalu salah, atau identik secara logis dengan pernyataan lain.',
  },
  submodules: [
    {
      id: 'log-m3-s1',
      title: { en: 'Tautology, Contradiction, and Equivalence', id: 'Tautologi, Kontradiksi, dan Ekivalensi' },
      summary: {
        en: 'Spot a statement that cannot come out false, one that cannot come out true, and prove two statements say the same thing.',
        id: 'Mengenali pernyataan yang tak mungkin salah, pernyataan yang tak mungkin benar, dan membuktikan dua pernyataan mengatakan hal yang sama.',
      },
      lessons: [
        {
          id: 'log-m3-s1-l1',
          title: { en: 'Tautology and Contradiction', id: 'Tautologi dan Kontradiksi' },
          goal: {
            en: 'Tell a tautology from a contradiction from an ordinary contingent statement.',
            id: 'Membedakan tautologi, kontradiksi, dan pernyataan kontingen biasa.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'True no matter what, false no matter what', id: 'Benar apa pun keadaannya, salah apa pun keadaannya' },
              body: {
                en: 'A **tautology** is a compound statement whose last column is true in every single row of its truth table — true no matter what truth values its parts take. $p \\lor \\neg p$ is the simplest example: whatever $p$ is, either it or its negation holds.\n$$\\begin{array} p & \\neg p & p \\lor \\neg p \\\\\\\\ B & S & B \\\\\\\\ S & B & B \\end{array}$$\nA **contradiction** is the mirror image: false in every row, no matter what. $p \\land \\neg p$ can never hold — a statement and its own negation cannot both be true.',
                id: '**Tautologi** adalah pernyataan majemuk yang kolom terakhirnya benar pada setiap baris tabel kebenarannya — benar apa pun nilai kebenaran bagian-bagiannya. $p \\lor \\neg p$ adalah contoh paling sederhana: apa pun $p$-nya, salah satu antara ia atau ingkarannya pasti berlaku.\n$$\\begin{array} p & \\neg p & p \\lor \\neg p \\\\\\\\ B & S & B \\\\\\\\ S & B & B \\end{array}$$\n**Kontradiksi** adalah bayangan cerminnya: salah pada setiap baris, apa pun keadaannya. $p \\land \\neg p$ tak pernah bisa berlaku — sebuah pernyataan dan ingkarannya sendiri tak mungkin sama-sama benar.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Most statements are neither', id: 'Kebanyakan pernyataan bukan keduanya' },
              body: {
                en: 'A compound statement whose truth value genuinely depends on the values of its parts — true in some rows, false in others — is called a **contingency**. Almost every compound statement met so far, like $p \\land q$ or $p \\Rightarrow q$, is a contingency: neither guaranteed true nor guaranteed false.\n\nA tautology is worth spotting because it carries no information — it was going to be true regardless, which is exactly what makes it useful as a **law**: a pattern you can substitute into any argument and rely on without checking a single truth value.',
                id: 'Pernyataan majemuk yang nilai kebenarannya sungguh bergantung pada nilai bagian-bagiannya — benar pada sebagian baris, salah pada sebagian lain — disebut **kontingensi**. Hampir semua pernyataan majemuk yang sudah ditemui sejauh ini, seperti $p \\land q$ atau $p \\Rightarrow q$, adalah kontingensi: tak dijamin benar dan tak dijamin salah.\n\nTautologi layak dikenali justru karena ia tak membawa informasi apa pun — ia memang akan benar apa pun keadaannya, dan justru itulah yang membuatnya berguna sebagai **hukum**: pola yang bisa disubstitusikan ke argumen mana pun dan diandalkan tanpa perlu memeriksa satu pun nilai kebenaran.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which of these is a **tautology**?',
                id: 'Manakah dari berikut ini yang merupakan **tautologi**?',
              },
              options: [
                { en: '$p \\land q$', id: '$p \\land q$' },
                { en: '$p \\Rightarrow (p \\lor q)$', id: '$p \\Rightarrow (p \\lor q)$' },
                { en: '$p \\land \\neg p$', id: '$p \\land \\neg p$' },
                { en: '$p \\Leftrightarrow q$', id: '$p \\Leftrightarrow q$' },
              ],
              answer: 1,
              explain: {
                en: 'Check every row: if $p$ is true, $p \\lor q$ is automatically true, so the conditional holds; if $p$ is false, the hypothesis fails and the conditional holds vacuously. Every row comes out true.',
                id: 'Periksa setiap baris: jika $p$ benar, $p \\lor q$ otomatis benar, jadi kondisionalnya berlaku; jika $p$ salah, hipotesisnya gagal dan kondisionalnya berlaku secara hampa. Setiap baris bernilai benar.',
              },
              hint: {
                en: 'Try building the truth table for each option in your head, row by row. Only one of them never lands on false.',
                id: 'Coba bangun tabel kebenaran tiap pilihan di kepalamu, baris demi baris. Hanya satu yang tak pernah jatuh ke salah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which of these is a **contradiction**?',
                id: 'Manakah dari berikut ini yang merupakan **kontradiksi**?',
              },
              options: [
                { en: '$(p \\Rightarrow q) \\land (p \\land \\neg q)$', id: '$(p \\Rightarrow q) \\land (p \\land \\neg q)$' },
                { en: '$p \\lor q$', id: '$p \\lor q$' },
                { en: '$p \\Rightarrow p$', id: '$p \\Rightarrow p$' },
                { en: '$\\neg p \\lor q$', id: '$\\neg p \\lor q$' },
              ],
              answer: 0,
              explain: {
                en: '$p \\Rightarrow q$ and $p \\land \\neg q$ are each other\'s exact opposite condition — one holds precisely when the other fails. Their conjunction can never be true in any row.',
                id: '$p \\Rightarrow q$ dan $p \\land \\neg q$ adalah syarat yang persis berlawanan satu sama lain — yang satu berlaku tepat ketika yang lain gagal. Konjungsi keduanya tak pernah bisa benar pada baris mana pun.',
              },
              hint: {
                en: 'Recall which single row makes $p \\Rightarrow q$ false — and compare it to which rows make $p \\land \\neg q$ true. Do those two ever overlap?',
                id: 'Ingat baris tunggal mana yang membuat $p \\Rightarrow q$ salah — dan bandingkan dengan baris mana yang membuat $p \\land \\neg q$ benar. Apakah keduanya pernah tumpang tindih?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in order to build the truth table for $p \\Rightarrow (p \\lor q)$, from the header down, and confirm it is a tautology.',
                id: 'Susun baris-baris ini agar menjadi tabel kebenaran $p \\Rightarrow (p \\lor q)$, dari judul kolom ke bawah, dan pastikan ia tautologi.',
              },
              lines: {
                en: [
                  '\\begin{array} p & q & p \\lor q & p \\Rightarrow (p \\lor q) \\end{array}',
                  '\\begin{array} B & B & B & B \\end{array}',
                  '\\begin{array} B & S & B & B \\end{array}',
                  '\\begin{array} S & B & B & B \\end{array}',
                  '\\begin{array} S & S & S & B \\end{array}',
                ],
                id: [
                  '\\begin{array} p & q & p \\lor q & p \\Rightarrow (p \\lor q) \\end{array}',
                  '\\begin{array} B & B & B & B \\end{array}',
                  '\\begin{array} B & S & B & B \\end{array}',
                  '\\begin{array} S & B & B & B \\end{array}',
                  '\\begin{array} S & S & S & B \\end{array}',
                ],
              },
              explain: {
                en: 'The last column is true in every one of the four rows — even the last one, where the hypothesis $p$ is false and the conditional holds vacuously.',
                id: 'Kolom terakhir benar pada keempat baris — bahkan pada baris terakhir, saat hipotesis $p$ salah dan kondisionalnya berlaku secara hampa.',
              },
              hint: {
                en: 'Fill $p \\lor q$ first, then compare it against $p$ in the same row using the conditional rule.',
                id: 'Isi dulu $p \\lor q$, lalu bandingkan dengan $p$ pada baris yang sama memakai aturan kondisional.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The truth table for the tautology $p \\lor \\neg p$ has $2$ rows, one for each value of $p$. How many of those rows come out true?',
                id: 'Tabel kebenaran tautologi $p \\lor \\neg p$ punya $2$ baris, satu untuk tiap nilai $p$. Berapa banyak dari baris itu yang bernilai benar?',
              },
              blanks: [{ answer: 2 }],
              hints: [
                { en: 'A tautology, by definition, has no false row at all.', id: 'Tautologi, menurut definisinya, sama sekali tak punya baris yang salah.' },
              ],
              explain: {
                en: '$p \\lor \\neg p$ is a tautology, so both of its rows — $p$ true and $p$ false alike — come out true.',
                id: '$p \\lor \\neg p$ adalah tautologi, jadi kedua barisnya — baik saat $p$ benar maupun saat $p$ salah — sama-sama bernilai benar.',
              },
            },
          ],
        },
        {
          id: 'log-m3-s1-l2',
          title: { en: 'Logical Equivalence', id: 'Ekivalensi Logis' },
          goal: {
            en: 'Prove two compound statements say the same thing, by truth table and by known laws.',
            id: 'Membuktikan dua pernyataan majemuk menyatakan hal yang sama, dengan tabel kebenaran dan dengan hukum yang sudah dikenal.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Same table, same statement', id: 'Tabel yang sama, pernyataan yang sama' },
              body: {
                en: 'Two compound statements are **logically equivalent**, written $A \\equiv B$, when their truth tables agree row for row — for every possible combination of truth values of their parts, both come out true together or both come out false together. Every law met so far is really an equivalence claim: the double-negation law $\\neg(\\neg p) \\equiv p$, De Morgan\'s Laws, and the contrapositive law $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$.\n\nEquivalently, $A \\equiv B$ exactly when $A \\Leftrightarrow B$ is a tautology — the two views of equivalence are the same idea from two directions.',
                id: 'Dua pernyataan majemuk **ekivalen secara logis**, ditulis $A \\equiv B$, ketika tabel kebenarannya sepakat baris demi baris — untuk setiap kemungkinan kombinasi nilai kebenaran bagian-bagiannya, keduanya sama-sama benar atau sama-sama salah. Setiap hukum yang sudah ditemui sejauh ini sebenarnya adalah klaim ekivalensi: hukum ingkaran ganda $\\neg(\\neg p) \\equiv p$, Hukum De Morgan, dan hukum kontraposisi $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$.\n\nSetara dengan itu, $A \\equiv B$ tepat ketika $A \\Leftrightarrow B$ adalah tautologi — kedua sudut pandang ekivalensi ini adalah gagasan yang sama dari dua arah.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A conditional in disguise', id: 'Kondisional yang menyamar' },
              body: {
                en: 'A useful equivalence worth adding to the collection: an implication written as a disjunction.\n$$p \\Rightarrow q \\equiv \\neg p \\lor q$$\nCheck it row by row: both are false only when $p$ is true and $q$ is false, and true everywhere else — exactly $p \\Rightarrow q$\'s own table. This equivalence is what makes De Morgan\'s Law able to negate a conditional at all: negate $\\neg p \\lor q$ and De Morgan gives $p \\land \\neg q$, the same result found earlier by reasoning about broken promises directly.',
                id: 'Sebuah ekivalensi berguna yang layak ditambahkan ke koleksi: sebuah implikasi ditulis sebagai disjungsi.\n$$p \\Rightarrow q \\equiv \\neg p \\lor q$$\nPeriksa baris demi baris: keduanya salah hanya ketika $p$ benar dan $q$ salah, dan benar di tempat lainnya — persis tabel $p \\Rightarrow q$ sendiri. Ekivalensi inilah yang membuat Hukum De Morgan bisa mengingkar sebuah kondisional sama sekali: ingkarkan $\\neg p \\lor q$ dan De Morgan memberi $p \\land \\neg q$, hasil yang sama dengan yang ditemukan sebelumnya lewat penalaran langsung tentang janji yang diingkari.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which pair of statements is logically equivalent?',
                id: 'Pasangan pernyataan manakah yang ekivalen secara logis?',
              },
              options: [
                { en: '$p \\Rightarrow q$ and $q \\Rightarrow p$', id: '$p \\Rightarrow q$ dan $q \\Rightarrow p$' },
                { en: '$p \\land q$ and $p \\lor q$', id: '$p \\land q$ dan $p \\lor q$' },
                { en: '$\\neg(p \\lor q)$ and $\\neg p \\land \\neg q$', id: '$\\neg(p \\lor q)$ dan $\\neg p \\land \\neg q$' },
                { en: '$p$ and $\\neg p$', id: '$p$ dan $\\neg p$' },
              ],
              answer: 2,
              explain: {
                en: "This is exactly De Morgan's Law for disjunction — the two sides agree in every row by construction.",
                id: 'Inilah persis Hukum De Morgan untuk disjungsi — kedua sisinya sepakat pada setiap baris karena memang begitu disusun.',
              },
              hint: {
                en: 'Two of these pairs are each other\'s converse or negation, which is not the same as being equivalent. Which pair is a law you have already met?',
                id: 'Dua dari pasangan ini adalah konvers atau negasi satu sama lain, yang bukan berarti ekivalen. Pasangan mana yang merupakan hukum yang sudah kamu kenal?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'To prove $A \\equiv B$ by truth table, what must be true?',
                id: 'Untuk membuktikan $A \\equiv B$ dengan tabel kebenaran, apa yang harus benar?',
              },
              options: [
                { en: 'A and B must have the same number of simple statements', id: '$A$ dan $B$ harus punya jumlah pernyataan sederhana yang sama' },
                { en: 'The final columns for A and B must match in every row', id: 'Kolom akhir untuk $A$ dan $B$ harus cocok pada setiap baris' },
                { en: 'A and B must both be tautologies', id: '$A$ dan $B$ harus sama-sama tautologi' },
                { en: 'A must appear inside B', id: '$A$ harus muncul di dalam $B$' },
              ],
              answer: 1,
              explain: {
                en: 'Equivalence is row-for-row agreement in the final column, nothing more — A and B need not be tautologies, and one need not be built from the other.',
                id: 'Ekivalensi adalah kesepakatan baris demi baris pada kolom akhir, tidak lebih — $A$ dan $B$ tak perlu tautologi, dan yang satu tak perlu dibangun dari yang lain.',
              },
              hint: {
                en: 'Go back to the definition given for logical equivalence — it is entirely about what the last column of each table looks like, row by row.',
                id: 'Kembali ke definisi ekivalensi logis yang sudah diberikan — ia sepenuhnya tentang bagaimana kolom terakhir tiap tabel, baris demi baris.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in order to prove $p \\Rightarrow q \\equiv \\neg p \\lor q$ by truth table, from the header down.',
                id: 'Susun baris-baris ini agar membuktikan $p \\Rightarrow q \\equiv \\neg p \\lor q$ dengan tabel kebenaran, dari judul kolom ke bawah.',
              },
              lines: {
                en: [
                  '\\begin{array} p & q & p \\Rightarrow q & \\neg p & \\neg p \\lor q \\end{array}',
                  '\\begin{array} B & B & B & S & B \\end{array}',
                  '\\begin{array} B & S & S & S & S \\end{array}',
                  '\\begin{array} S & B & B & B & B \\end{array}',
                  '\\begin{array} S & S & B & B & B \\end{array}',
                ],
                id: [
                  '\\begin{array} p & q & p \\Rightarrow q & \\neg p & \\neg p \\lor q \\end{array}',
                  '\\begin{array} B & B & B & S & B \\end{array}',
                  '\\begin{array} B & S & S & S & S \\end{array}',
                  '\\begin{array} S & B & B & B & B \\end{array}',
                  '\\begin{array} S & S & B & B & B \\end{array}',
                ],
              },
              explain: {
                en: 'The third and fifth columns — $p \\Rightarrow q$ and $\\neg p \\lor q$ — match in every row: $B, S, B, B$ both times. That row-for-row agreement is exactly what proves the equivalence.',
                id: 'Kolom ketiga dan kelima — $p \\Rightarrow q$ dan $\\neg p \\lor q$ — cocok pada setiap baris: $B, S, B, B$ pada keduanya. Kesepakatan baris demi baris itulah yang membuktikan ekivalensinya.',
              },
              hint: {
                en: 'Fill the $p \\Rightarrow q$ column using the conditional rule, then separately build $\\neg p$ and combine it with $q$ using the disjunction rule — then compare the two final columns.',
                id: 'Isi kolom $p \\Rightarrow q$ memakai aturan kondisional, lalu secara terpisah bangun $\\neg p$ dan gabungkan dengan $q$ memakai aturan disjungsi — lalu bandingkan kedua kolom akhirnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Using $p \\Rightarrow q \\equiv \\neg p \\lor q$, rewrite $\\neg(\\neg p \\lor q)$ using De Morgan, then evaluate it for $p$ true, $q$ false. (Type 1 for true, 0 for false.)',
                id: 'Dengan memakai $p \\Rightarrow q \\equiv \\neg p \\lor q$, tulis ulang $\\neg(\\neg p \\lor q)$ memakai De Morgan, lalu tentukan nilainya untuk $p$ benar, $q$ salah. (Ketik 1 untuk benar, 0 untuk salah.)',
              },
              blanks: [{ label: '\\neg(\\neg p \\lor q) =', answer: 1 }],
              hints: [
                { en: "De Morgan's Law gives $\\neg(\\neg p \\lor q) \\equiv p \\land \\neg q$.", id: 'Hukum De Morgan memberi $\\neg(\\neg p \\lor q) \\equiv p \\land \\neg q$.' },
                { en: 'This is exactly the negation of a conditional you already know: $\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$.', id: 'Ini persis negasi kondisional yang sudah kamu kenal: $\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$.' },
              ],
              explain: {
                en: '$\\neg(\\neg p \\lor q) \\equiv p \\land \\neg q$, and with $p$ true and $q$ false, both halves hold, so the result is true.',
                id: '$\\neg(\\neg p \\lor q) \\equiv p \\land \\neg q$, dan dengan $p$ benar dan $q$ salah, kedua bagiannya berlaku, jadi hasilnya benar.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m3-s1-p',
        runtime: 'math',
        title: { en: 'Tautology, Contradiction, and Equivalence', id: 'Tautologi, Kontradiksi, dan Ekivalensi' },
        brief: {
          en: 'Classify compound statements and confirm a well-known equivalence.',
          id: 'Mengklasifikasikan pernyataan majemuk dan mengonfirmasi sebuah ekivalensi yang sudah dikenal.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
          { en: 'Every part now uses three simple statements, so the truth table has 8 rows — build the whole thing before answering.', id: 'Setiap butir kini memakai tiga pernyataan sederhana, jadi tabel kebenarannya punya 8 baris — bangun semuanya sebelum menjawab.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'The truth table for $(p \\land r) \\lor (\\neg q \\land \\neg r)$ has $8$ rows, one for each combination of $p$, $q$, and $r$. How many of those rows come out true?',
              id: 'Tabel kebenaran $(p \\land r) \\lor (\\neg q \\land \\neg r)$ punya $8$ baris, satu untuk tiap kombinasi $p$, $q$, dan $r$. Berapa banyak dari baris itu yang bernilai benar?',
            },
            blanks: [{ answer: 4 }],
            solution: ['\\text{Baris yang bernilai benar: }(B,B,B), (B,S,B), (B,S,S), (S,S,S).', '(p,q,r)=(B,B,B): p \\land r = B.', '(p,q,r)=(B,S,B): p \\land r = B.', '(p,q,r)=(B,S,S): \\neg q \\land \\neg r = B \\land B = B.', '(p,q,r)=(S,S,S): \\neg q \\land \\neg r = B \\land B = B.', '\\text{Empat dari delapan baris benar.}'],
          },
          {
            prompt: {
              en: 'The truth table for $(p \\Rightarrow q) \\land (p \\Rightarrow \\neg q) \\land (q \\lor r)$ has $8$ rows. How many of those rows come out true?',
              id: 'Tabel kebenaran $(p \\Rightarrow q) \\land (p \\Rightarrow \\neg q) \\land (q \\lor r)$ punya $8$ baris. Berapa banyak dari baris itu yang bernilai benar?',
            },
            blanks: [{ answer: 3 }],
            solution: ['p=B: (p \\Rightarrow q) \\land (p \\Rightarrow \\neg q) \\equiv q \\land \\neg q, \\text{ selalu salah — keempat baris }p=B\\text{ salah.}', 'p=S: \\text{ kedua kondisional benar secara hampa, jadi bergantung hanya pada }q \\lor r.', '(S,B,B): q \\lor r = B.\\quad (S,B,S): q \\lor r = B.\\quad (S,S,B): q \\lor r = B.\\quad (S,S,S): q \\lor r = S.', '\\text{Tiga dari delapan baris benar.}'],
          },
          {
            prompt: {
              en: '$p \\land (q \\lor r)$ and $(p \\land q) \\lor (p \\land r)$ are claimed to be logically equivalent (the distributive law). Building both truth tables across all $8$ rows, in how many rows do they agree?',
              id: '$p \\land (q \\lor r)$ dan $(p \\land q) \\lor (p \\land r)$ diklaim ekivalen secara logis (hukum distributif). Dengan membangun kedua tabel kebenarannya pada kedelapan baris, pada berapa banyak baris keduanya sepakat?',
            },
            blanks: [{ answer: 8 }],
            solution: ['\\text{Keduanya adalah bentuk yang sama menurut hukum distributif, jadi keduanya bernilai sama pada setiap kombinasi }p, q, r.', '\\text{Delapan dari delapan baris sepakat.}'],
          },
        ],
        hints: [
          {
            en: 'Write out the full 8-row truth table for each expression — every combination of p, q, and r — before counting or comparing anything.',
            id: 'Tulis dulu tabel kebenaran lengkap 8 barisnya untuk tiap ungkapan — setiap kombinasi p, q, dan r — sebelum menghitung atau membandingkan apa pun.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
