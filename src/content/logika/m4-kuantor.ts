import type { Module } from '../types'

/** Module 4 — statements about a whole domain at once, rather than about one
 *  fixed subject. Quantifiers close an open sentence a different way than
 *  substitution does: instead of picking one value, they say how many of the
 *  domain's members make it true. */
export const module4: Module = {
  id: 'log-m4',
  title: { en: 'Quantifiers', id: 'Kuantor' },
  summary: {
    en: 'The universal and existential quantifiers, and how to negate a quantified statement correctly.',
    id: 'Kuantor universal dan eksistensial, serta cara mengingkar pernyataan berkuantor dengan benar.',
  },
  submodules: [
    {
      id: 'log-m4-s1',
      title: { en: 'Universal and Existential Quantifiers', id: 'Kuantor Universal dan Eksistensial' },
      summary: {
        en: 'Close an open sentence by saying "for all" or "there exists", and negate the result.',
        id: 'Menutup kalimat terbuka dengan mengatakan "untuk semua" atau "ada", dan mengingkar hasilnya.',
      },
      lessons: [
        {
          id: 'log-m4-s1-l1',
          title: { en: 'Quantified Statements', id: 'Pernyataan Berkuantor' },
          goal: {
            en: 'Close an open sentence into a statement using ∀ or ∃, and evaluate it over a domain.',
            id: 'Menutup kalimat terbuka menjadi pernyataan memakai ∀ atau ∃, dan menilainya pada suatu semesta.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Closing an open sentence a second way', id: 'Cara kedua menutup kalimat terbuka' },
              body: {
                en: 'Substituting one value is not the only way to close an open sentence: a **quantifier** closes it by saying how many members of the domain make it true. The **universal quantifier** $\\forall$ (read "for all" or "for every") says **every** member does:\n$$\\forall x, \\; p(x)$$\n"$\\forall x \\in \\mathbb{Z}, x^2 \\geq 0$" — for every integer $x$, $x^2 \\geq 0$ — is a true statement, closed and complete, with no $x$ left free.',
                id: 'Mensubstitusi satu nilai bukan satu-satunya cara menutup kalimat terbuka: sebuah **kuantor** menutupnya dengan menyatakan berapa banyak anggota semesta yang membuatnya benar. **Kuantor universal** $\\forall$ (dibaca "untuk semua" atau "untuk setiap") menyatakan **setiap** anggota membuatnya benar:\n$$\\forall x, \\; p(x)$$\n"$\\forall x \\in \\mathbb{Z}, x^2 \\geq 0$" — untuk setiap bilangan bulat $x$, $x^2 \\geq 0$ — adalah pernyataan yang benar, sudah tertutup dan lengkap, tanpa $x$ yang tersisa bebas.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Sometimes one is all it takes', id: 'Kadang cukup satu saja' },
              body: {
                en: 'The **existential quantifier** $\\exists$ (read "there exists" or "there is at least one") says **some** member of the domain makes the sentence true — one is enough:\n$$\\exists x, \\; p(x)$$\n"$\\exists x \\in \\mathbb{Z}, x^2 = 4$" — there exists an integer $x$ such that $x^2 = 4$ — is true, and one witness ($x=2$, or $x=-2$) settles it completely; the statement makes no claim about any other integer.\n\nA universal statement needs every member checked to be **confirmed**, but only one counterexample to be **refuted**. An existential statement is the reverse: one witness confirms it, but every member must fail for it to be refuted.',
                id: '**Kuantor eksistensial** $\\exists$ (dibaca "ada" atau "terdapat setidaknya satu") menyatakan **sebagian** anggota semesta membuat kalimatnya benar — satu saja sudah cukup:\n$$\\exists x, \\; p(x)$$\n"$\\exists x \\in \\mathbb{Z}, x^2 = 4$" — ada bilangan bulat $x$ sehingga $x^2 = 4$ — bernilai benar, dan satu saksi ($x=2$, atau $x=-2$) sudah cukup menetapkannya sepenuhnya; pernyataannya tak mengklaim apa-apa tentang bilangan bulat lain.\n\nPernyataan universal butuh setiap anggota diperiksa untuk **dikonfirmasi**, tetapi hanya satu contoh penyangkal untuk **disangkal**. Pernyataan eksistensial justru sebaliknya: satu saksi mengonfirmasinya, tetapi setiap anggota harus gagal agar ia tersangkal.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Is "$\\forall x \\in \\{1, 2, 3, 4\\}, x^2 > x$" true?',
                id: 'Apakah "$\\forall x \\in \\{1, 2, 3, 4\\}, x^2 > x$" benar?',
              },
              options: [
                { en: 'True — most members satisfy it', id: 'Benar — sebagian besar anggota memenuhinya' },
                { en: 'False — $x = 1$ fails, since $1^2 = 1$, not greater than $1$', id: 'Salah — $x = 1$ gagal, karena $1^2 = 1$, bukan lebih besar dari $1$' },
                { en: 'True — it holds for at least one member', id: 'Benar — berlaku untuk setidaknya satu anggota' },
                { en: 'Cannot be determined without more information', id: 'Tak dapat ditentukan tanpa keterangan lain' },
              ],
              answer: 1,
              explain: {
                en: 'A universal claim needs every member to work — "most" is not enough. $x=1$ gives $1^2 = 1$, which is not greater than $1$, and that single failure is enough to make the whole universal statement false.',
                id: 'Klaim universal butuh setiap anggota berhasil — "sebagian besar" tidak cukup. $x=1$ memberi $1^2 = 1$, yang tidak lebih besar dari $1$, dan satu kegagalan itu saja sudah cukup membuat seluruh pernyataan universalnya salah.',
              },
              hint: {
                en: 'A universal statement is only as strong as its weakest member. Check the smallest value in the domain first.',
                id: 'Pernyataan universal hanya sekuat anggotanya yang paling lemah. Periksa dulu nilai terkecil dalam semestanya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Is "$\\exists x \\in \\{1, 2, 3, 4\\}, x^2 > 10$" true?',
                id: 'Apakah "$\\exists x \\in \\{1, 2, 3, 4\\}, x^2 > 10$" benar?',
              },
              options: [
                { en: 'True — $x = 4$ gives $16 > 10$', id: 'Benar — $x = 4$ memberi $16 > 10$' },
                { en: 'False — not every member satisfies it', id: 'Salah — tak semua anggota memenuhinya' },
                { en: 'False — $x = 1$ fails', id: 'Salah — $x = 1$ gagal' },
                { en: 'Cannot be determined', id: 'Tak dapat ditentukan' },
              ],
              answer: 0,
              explain: {
                en: 'An existential claim needs only one witness. $x = 4$ gives $x^2 = 16 > 10$, and that alone makes the statement true — nothing about $x=1$, $2$, or $3$ matters.',
                id: 'Klaim eksistensial hanya butuh satu saksi. $x = 4$ memberi $x^2 = 16 > 10$, dan itu saja sudah membuat pernyataannya benar — tak peduli apa yang terjadi pada $x=1$, $2$, atau $3$.',
              },
              hint: {
                en: 'You only need to find one member of the domain that works — you do not need to check them all.',
                id: 'Kamu hanya perlu menemukan satu anggota semesta yang berhasil — tak perlu memeriksa semuanya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the description of how each quantifier is confirmed or refuted.',
                id: 'Lengkapi deskripsi bagaimana tiap kuantor dikonfirmasi atau disangkal.',
              },
              template: {
                en: 'A universal statement is refuted by ___ counterexample; an existential statement is confirmed by ___ witness.',
                id: 'Pernyataan universal disangkal oleh ___ contoh penyangkal; pernyataan eksistensial dikonfirmasi oleh ___ saksi.',
              },
              blanks: {
                en: ['one', 'one'],
                id: ['satu', 'satu'],
              },
              explain: {
                en: 'A single failure is fatal to "for all", and a single success is enough for "there exists" — the two quantifiers are mirror images of each other in exactly this way.',
                id: 'Satu kegagalan saja sudah fatal bagi "untuk semua", dan satu keberhasilan saja sudah cukup bagi "ada" — kedua kuantor adalah bayangan cermin satu sama lain, tepat dengan cara ini.',
              },
              hint: {
                en: 'Both blanks are the same small number — the fewest cases it ever takes to settle either kind of claim in the direction described.',
                id: 'Kedua isian adalah bilangan kecil yang sama — jumlah kasus paling sedikit yang pernah dibutuhkan untuk menetapkan salah satu jenis klaim, ke arah yang dideskripsikan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'How many members of the domain $\\{1, 2, 3, 4, 5, 6\\}$ make "$x$ is a factor of $12$" true? (This count is what an existential claim over this domain would need to be at least $1$ to hold.)',
                id: 'Berapa banyak anggota semesta $\\{1, 2, 3, 4, 5, 6\\}$ yang membuat "$x$ faktor dari $12$" benar? (Banyaknya ini yang harus setidaknya $1$ agar klaim eksistensial pada semesta ini berlaku.)',
              },
              blanks: [{ answer: 5 }],
              hints: [
                { en: 'List the factors of 12 that fall inside $\\{1,\\ldots,6\\}$.', id: 'Daftar faktor dari 12 yang berada di dalam $\\{1,\\ldots,6\\}$.' },
                { en: 'They are 1, 2, 3, 4, and 6 — check that 5 is not one of them.', id: 'Yaitu 1, 2, 3, 4, dan 6 — periksa bahwa 5 bukan salah satunya.' },
              ],
              explain: {
                en: 'The factors of 12 inside the domain are 1, 2, 3, 4, 6 — five members. Since this is well above zero, both "$\\exists x, x \\text{ is a factor of } 12$" is true, and "$\\forall x, x \\text{ is a factor of } 12$" is false (5 fails).',
                id: 'Faktor dari 12 yang berada di semesta itu adalah 1, 2, 3, 4, 6 — lima anggota. Karena jelas lebih dari nol, baik "$\\exists x, x \\text{ faktor dari } 12$" benar, maupun "$\\forall x, x \\text{ faktor dari } 12$" salah (5 gagal).',
              },
            },
          ],
        },
        {
          id: 'log-m4-s1-l2',
          title: { en: 'Negating a Quantified Statement', id: 'Negasi Pernyataan Berkuantor' },
          goal: {
            en: 'Negate a universal or existential statement correctly, swapping the quantifier.',
            id: 'Mengingkar pernyataan berkuantor universal atau eksistensial dengan benar, dengan menukar kuantornya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Negating swaps the quantifier too', id: 'Mengingkar juga menukar kuantornya' },
              body: {
                en: '"Not every student passed" does not mean "no student passed" — it means at least one student failed. Negating a universal statement gives an existential one, over the negated open sentence:\n$$\\neg(\\forall x, \\; p(x)) \\equiv \\exists x, \\; \\neg p(x)$$\nAnd the other way round: "there is no even prime greater than 2" means every prime greater than 2 fails to be even.\n$$\\neg(\\exists x, \\; p(x)) \\equiv \\forall x, \\; \\neg p(x)$$\nBoth are De Morgan\'s Laws again, in a different costume: a universal is like a giant conjunction across the whole domain, an existential like a giant disjunction, and negating still flips $\\land$ to $\\lor$ (that is, $\\forall$ to $\\exists$) while negating every piece.',
                id: '"Tidak semua siswa lulus" tidak berarti "tak ada siswa yang lulus" — melainkan setidaknya satu siswa tidak lulus. Mengingkar pernyataan universal menghasilkan pernyataan eksistensial, atas kalimat terbuka yang diingkarkan:\n$$\\neg(\\forall x, \\; p(x)) \\equiv \\exists x, \\; \\neg p(x)$$\nDan sebaliknya: "tak ada bilangan prima genap yang lebih besar dari 2" berarti setiap bilangan prima lebih besar dari 2 gagal menjadi genap.\n$$\\neg(\\exists x, \\; p(x)) \\equiv \\forall x, \\; \\neg p(x)$$\nKeduanya adalah Hukum De Morgan lagi, dalam kostum berbeda: pernyataan universal seperti konjungsi raksasa di seluruh semesta, pernyataan eksistensial seperti disjungsi raksasa, dan mengingkar tetap membalik $\\land$ menjadi $\\lor$ (yakni, $\\forall$ menjadi $\\exists$) sambil mengingkar tiap bagiannya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Negating in two steps', id: 'Mengingkar dalam dua langkah' },
              body: {
                en: 'Negating a quantified statement is always two separate moves: swap the quantifier ($\\forall \\leftrightarrow \\exists$), then negate the open sentence inside it — and negating the inside might itself need De Morgan or the conditional-negation rule if it is already compound.\n\n"$\\forall x, \\; p(x) \\Rightarrow q(x)$" negates to "$\\exists x, \\; \\neg(p(x) \\Rightarrow q(x))$", which by the conditional-negation rule becomes "$\\exists x, \\; p(x) \\land \\neg q(x)$" — there is some $x$ for which $p(x)$ holds but $q(x)$ does not, exactly a counterexample to the original claim.',
                id: 'Mengingkar pernyataan berkuantor selalu berupa dua langkah terpisah: tukar kuantornya ($\\forall \\leftrightarrow \\exists$), lalu ingkar kalimat terbuka di dalamnya — dan mengingkar bagian dalamnya mungkin sendiri membutuhkan De Morgan atau aturan negasi kondisional bila ia sudah berupa pernyataan majemuk.\n\n"$\\forall x, \\; p(x) \\Rightarrow q(x)$" diingkar menjadi "$\\exists x, \\; \\neg(p(x) \\Rightarrow q(x))$", yang menurut aturan negasi kondisional menjadi "$\\exists x, \\; p(x) \\land \\neg q(x)$" — ada suatu $x$ yang $p(x)$-nya berlaku tetapi $q(x)$-nya tidak, persis sebuah contoh penyangkal klaim aslinya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What is the negation of "$\\forall x \\in \\mathbb{Z}, x$ is even"?',
                id: 'Apa negasi dari "$\\forall x \\in \\mathbb{Z}, x$ genap"?',
              },
              options: [
                { en: '$\\forall x \\in \\mathbb{Z}, x$ is odd', id: '$\\forall x \\in \\mathbb{Z}, x$ ganjil' },
                { en: '$\\exists x \\in \\mathbb{Z}, x$ is odd', id: '$\\exists x \\in \\mathbb{Z}, x$ ganjil' },
                { en: '$\\exists x \\in \\mathbb{Z}, x$ is even', id: '$\\exists x \\in \\mathbb{Z}, x$ genap' },
                { en: '$\\neg \\forall x \\in \\mathbb{Z}, x$ is even', id: '$\\neg \\forall x \\in \\mathbb{Z}, x$ genap' },
              ],
              answer: 1,
              explain: {
                en: 'Swap $\\forall$ for $\\exists$, and negate "even" to "odd" — this correctly reads as "there exists an integer that is odd", which is true and does refute the original.',
                id: 'Tukar $\\forall$ menjadi $\\exists$, dan ingkar "genap" menjadi "ganjil" — ini terbaca dengan benar sebagai "ada bilangan bulat yang ganjil", yang benar dan memang menyangkal aslinya.',
              },
              hint: {
                en: 'Two things have to change here: the quantifier itself, and the open sentence inside it. Which option changes both?',
                id: 'Dua hal harus berubah di sini: kuantornya sendiri, dan kalimat terbuka di dalamnya. Pilihan mana yang mengubah keduanya?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'What is the negation of "$\\exists x$, $x$ is a student who failed the exam"?',
                id: 'Apa negasi dari "$\\exists x$, $x$ adalah siswa yang gagal ujian"?',
              },
              options: [
                { en: 'Every student failed the exam.', id: 'Setiap siswa gagal ujian.' },
                { en: 'Every student passed the exam.', id: 'Setiap siswa lulus ujian.' },
                { en: 'Some student passed the exam.', id: 'Sebagian siswa lulus ujian.' },
                { en: 'No student took the exam.', id: 'Tak ada siswa yang mengikuti ujian.' },
              ],
              answer: 1,
              explain: {
                en: 'Swap $\\exists$ for $\\forall$, and negate "failed" to "passed": every student passed the exam — no exceptions left for the original claim to hide behind.',
                id: 'Tukar $\\exists$ menjadi $\\forall$, dan ingkar "gagal" menjadi "lulus": setiap siswa lulus ujian — tak ada pengecualian yang tersisa bagi klaim aslinya untuk bersembunyi.',
              },
              hint: {
                en: 'Negating "there is at least one who failed" should leave no room at all for a failing student. Which option achieves that?',
                id: 'Mengingkar "ada setidaknya satu yang gagal" seharusnya tak menyisakan ruang sama sekali bagi siswa yang gagal. Pilihan mana yang mencapai itu?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in order to negate $\\forall x, \\; p(x) \\Rightarrow q(x)$ down to its simplest form.',
                id: 'Susun baris-baris ini dengan urutan yang benar untuk mengingkar $\\forall x, \\; p(x) \\Rightarrow q(x)$ hingga bentuk paling sederhana.',
              },
              lines: {
                en: [
                  '\\neg(\\forall x, \\; p(x) \\Rightarrow q(x))',
                  '\\equiv \\exists x, \\; \\neg(p(x) \\Rightarrow q(x))',
                  '\\equiv \\exists x, \\; p(x) \\land \\neg q(x)',
                ],
                id: [
                  '\\neg(\\forall x, \\; p(x) \\Rightarrow q(x))',
                  '\\equiv \\exists x, \\; \\neg(p(x) \\Rightarrow q(x))',
                  '\\equiv \\exists x, \\; p(x) \\land \\neg q(x)',
                ],
              },
              explain: {
                en: 'First swap the quantifier and push the negation inside; then apply the conditional-negation rule to the compound sentence that is left over.',
                id: 'Tukar dulu kuantornya dan dorong negasinya ke dalam; lalu terapkan aturan negasi kondisional pada pernyataan majemuk yang tersisa.',
              },
              hint: {
                en: 'The quantifier swap always happens first, before anything is done to the open sentence sitting inside it.',
                id: 'Penukaran kuantor selalu terjadi lebih dulu, sebelum apa pun dilakukan pada kalimat terbuka yang ada di dalamnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The statement "$\\forall x \\in \\{2,3,4,5\\}, x \\text{ is prime}$" is false, since $4$ is not prime. How many members of the domain are witnesses to its negation "$\\exists x \\in \\{2,3,4,5\\}, x \\text{ is not prime}$"?',
                id: 'Pernyataan "$\\forall x \\in \\{2,3,4,5\\}, x \\text{ prima}$" salah, karena $4$ tidak prima. Berapa banyak anggota semesta yang menjadi saksi bagi negasinya "$\\exists x \\in \\{2,3,4,5\\}, x \\text{ tak prima}$"?',
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: 'Check each member of $\\{2,3,4,5\\}$ for primality.', id: 'Periksa tiap anggota $\\{2,3,4,5\\}$ apakah prima.' },
                { en: 'Only one of the four fails to be prime.', id: 'Hanya satu dari empat anggota yang tidak prima.' },
              ],
              explain: {
                en: 'Only $4$ is not prime among $\\{2,3,4,5\\}$ — one witness, and an existential claim only ever needs one.',
                id: 'Hanya $4$ yang tidak prima di antara $\\{2,3,4,5\\}$ — satu saksi, dan klaim eksistensial memang hanya pernah membutuhkan satu.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m4-s1-p',
        runtime: 'math',
        title: { en: 'Quantifiers', id: 'Kuantor' },
        brief: {
          en: 'Evaluate and negate universal and existential statements over small domains.',
          id: 'Menilai dan mengingkar pernyataan universal dan eksistensial pada semesta kecil.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
          { en: 'Answer truth values as 1 (true) or 0 (false).', id: 'Jawab nilai kebenaran dengan 1 (benar) atau 0 (salah).' },
        ],
        tasks: [
          {
            prompt: {
              en: 'Is "$\\forall x \\in \\{2,4,6,8\\}, x$ is even" true?',
              id: 'Apakah "$\\forall x \\in \\{2,4,6,8\\}, x$ genap" benar?',
            },
            blanks: [{ answer: 1 }],
            solution: ['Setiap anggota semestanya genap, jadi klaim universalnya benar.'],
          },
          {
            prompt: {
              en: 'Is "$\\exists x \\in \\{2,4,6,8\\}, x$ is a multiple of $5$" true?',
              id: 'Apakah "$\\exists x \\in \\{2,4,6,8\\}, x$ kelipatan $5$" benar?',
            },
            blanks: [{ answer: 0 }],
            solution: ['Tak satu pun anggota semestanya kelipatan 5, jadi tak ada saksi dan klaim eksistensialnya salah.'],
          },
          {
            prompt: {
              en: 'How many members of $\\{2,4,6,8\\}$ are witnesses to the negation of "$\\forall x \\in \\{2,4,6,8\\}, x < 6$"?',
              id: 'Berapa banyak anggota $\\{2,4,6,8\\}$ yang menjadi saksi bagi negasi dari "$\\forall x \\in \\{2,4,6,8\\}, x < 6$"?',
            },
            blanks: [{ answer: 2 }],
            solution: ['Negasinya adalah "$\\exists x, x \\geq 6$"; anggota yang memenuhi adalah 6 dan 8 — dua saksi.'],
          },
        ],
        hints: [
          {
            en: 'For the last part, negate the statement first (swap the quantifier, negate the inequality), then count how many members satisfy that negated form.',
            id: 'Untuk butir terakhir, ingkar dulu pernyataannya (tukar kuantornya, ingkar pertidaksamaannya), lalu hitung berapa banyak anggota yang memenuhi bentuk negasi itu.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
