import type { Module } from '../types'

/** Module 5 — logic put to work: an argument is a set of premises claimed to
 *  force a conclusion, and "valid" is a precise, checkable claim about that
 *  force rather than a compliment about how convincing it sounds. The module
 *  closes with mathematical induction, which is exactly a valid argument form
 *  applied once per natural number, all at once. */
export const module5: Module = {
  id: 'log-m5',
  title: { en: 'Arguments and Proof', id: 'Argumen dan Pembuktian' },
  summary: {
    en: 'Premises and conclusions, the standard valid argument forms, indirect proof, arguments about quantified statements, and mathematical induction.',
    id: 'Premis dan konklusi, bentuk-bentuk argumen sah yang baku, pembuktian tidak langsung, argumen tentang pernyataan berkuantor, dan induksi matematika.',
  },
  submodules: [
    /* --------------------------------- 5.1 premises, arguments, validity */
    {
      id: 'log-m5-s1',
      title: { en: 'Premises, Arguments, and Validity', id: 'Premis, Argumen, dan Validitas' },
      summary: {
        en: 'The shape of an argument, the two standard valid forms, and the truth-table test that checks any argument at all.',
        id: 'Bentuk sebuah argumen, dua bentuk sah yang baku, dan uji tabel kebenaran yang memeriksa argumen apa pun.',
      },
      lessons: [
        {
          id: 'log-m5-s1-l1',
          title: { en: 'Premises and Arguments', id: 'Premis dan Argumen' },
          goal: {
            en: 'Name the parts of an argument, and say what "valid" actually claims.',
            id: 'Menyebut bagian-bagian sebuah argumen, dan menyatakan apa yang sebenarnya diklaim oleh "sah".',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Premises in, conclusion out', id: 'Premis masuk, konklusi keluar' },
              body: {
                en: 'An **argument** is a list of statements called **premises** ($P_1, P_2, \\ldots, P_n$), followed by a statement called the **conclusion** ($C$), claimed to follow from them. It is usually written stacked, with a line and $\\therefore$ ("therefore") separating the two:\n$$P_1 \\\\\\\\ P_2 \\\\\\\\ \\vdots \\\\\\\\ P_n \\\\\\\\ \\therefore C$$\nAn **argument form** uses placeholder letters $p, q, r$ for its statements, describing a whole pattern of arguments at once; an **argument** proper substitutes actual statements in for those letters, exactly the way an open sentence becomes a statement once its variable is substituted.',
                id: 'Sebuah **argumen** adalah daftar pernyataan yang disebut **premis** ($P_1, P_2, \\ldots, P_n$), diikuti sebuah pernyataan yang disebut **konklusi** ($C$), yang diklaim mengikuti dari premis-premisnya. Biasanya ditulis bertumpuk, dengan garis dan $\\therefore$ ("jadi" atau "maka") memisahkan keduanya:\n$$P_1 \\\\\\\\ P_2 \\\\\\\\ \\vdots \\\\\\\\ P_n \\\\\\\\ \\therefore C$$\nSebuah **bentuk argumen** memakai huruf $p, q, r$ sebagai pengganti untuk pernyataan-pernyataannya, menggambarkan seluruh pola argumen sekaligus; sebuah **argumen** yang sesungguhnya mensubstitusikan pernyataan nyata untuk huruf-huruf itu, persis seperti kalimat terbuka menjadi pernyataan begitu variabelnya disubstitusi.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: '"Valid" is not "true"', id: '"Sah" bukan "benar"' },
              body: {
                en: 'An argument is **valid** when its conclusion cannot possibly be false while every one of its premises is true. This is a claim about the **connection** between premises and conclusion, not about whether any of them are actually true.\n\nA valid argument can still have a false conclusion — if one of its premises is false, nothing is guaranteed. And a true conclusion proves nothing about validity either: an argument can reach a true conclusion by pure luck, from premises that do not actually support it. Validity is checked once, on the form itself, and it holds or fails for every substitution at once.',
                id: 'Sebuah argumen **sah** ketika konklusinya tak mungkin salah selagi setiap premisnya benar. Ini adalah klaim tentang **keterkaitan** antara premis dan konklusi, bukan tentang apakah salah satu di antaranya benar-benar benar.\n\nArgumen yang sah tetap bisa berkonklusi salah — bila salah satu premisnya salah, tak ada yang dijamin. Dan konklusi yang benar pun tak membuktikan apa-apa soal kesahihan: sebuah argumen bisa mencapai konklusi yang benar hanya karena kebetulan, dari premis-premis yang sebenarnya tak mendukungnya. Kesahihan diperiksa sekali, pada bentuknya sendiri, dan berlaku atau gagal untuk setiap substitusi sekaligus.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'In the argument "All birds can fly. A penguin is a bird. Therefore, a penguin can fly.", what is the conclusion?',
                id: 'Pada argumen "Semua burung bisa terbang. Penguin adalah burung. Jadi, penguin bisa terbang.", apa konklusinya?',
              },
              options: [
                { en: 'All birds can fly.', id: 'Semua burung bisa terbang.' },
                { en: 'A penguin is a bird.', id: 'Penguin adalah burung.' },
                { en: 'A penguin can fly.', id: 'Penguin bisa terbang.' },
                { en: 'The whole argument is the conclusion.', id: 'Seluruh argumen itu sendiri adalah konklusinya.' },
              ],
              answer: 2,
              explain: {
                en: 'The conclusion is whatever comes after "therefore" — everything before it is a premise being offered in support.',
                id: 'Konklusi adalah apa pun yang muncul setelah "jadi" — segala sesuatu sebelumnya adalah premis yang diajukan sebagai dukungan.',
              },
              hint: {
                en: 'Look for the word that always introduces a conclusion in an argument written this way.',
                id: 'Cari kata yang selalu memperkenalkan konklusi pada argumen yang ditulis dengan cara ini.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'The argument above ("All birds can fly...") reaches a false conclusion, since penguins cannot fly. What does this show?',
                id: 'Argumen di atas ("Semua burung bisa terbang...") mencapai konklusi yang salah, karena penguin tak bisa terbang. Apa yang ditunjukkan hal ini?',
              },
              options: [
                { en: 'The argument form itself is invalid.', id: 'Bentuk argumennya sendiri tidak sah.' },
                { en: 'The argument form is valid, but a premise ("all birds can fly") is false.', id: 'Bentuk argumennya sah, tetapi satu premisnya ("semua burung bisa terbang") salah.' },
                { en: 'Nothing can be concluded about the argument at all.', id: 'Tak ada yang bisa disimpulkan tentang argumennya sama sekali.' },
                { en: 'The conclusion must therefore be a premise instead.', id: 'Konklusinya karena itu pasti sebenarnya adalah sebuah premis.' },
              ],
              answer: 1,
              explain: {
                en: 'The reasoning pattern itself — "every A is B, x is an A, so x is B" — is a perfectly valid form (it is exactly the pattern the next lesson names). What breaks the example is a false premise, not a broken connection between premises and conclusion.',
                id: 'Pola penalarannya sendiri — "setiap A adalah B, x adalah A, jadi x adalah B" — adalah bentuk yang sepenuhnya sah (persis pola yang dinamai pada pelajaran berikutnya). Yang gagal pada contoh ini adalah premis yang salah, bukan keterkaitan yang rusak antara premis dan konklusi.',
              },
              hint: {
                en: 'Validity is about the connection between premises and conclusion, not about whether the premises happen to be true. Is the reasoning pattern itself broken here, or is it one of the premises?',
                id: 'Kesahihan adalah soal keterkaitan antara premis dan konklusi, bukan soal apakah premisnya kebetulan benar. Apakah pola penalarannya sendiri yang rusak di sini, atau salah satu premisnya?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the definition of a valid argument.',
                id: 'Lengkapi definisi argumen yang sah.',
              },
              template: {
                en: 'An argument is valid when its ___ cannot be false while every one of its ___ is true.',
                id: 'Sebuah argumen sah ketika ___-nya tak mungkin salah selagi setiap ___-nya benar.',
              },
              blanks: {
                en: ['conclusion', 'premises'],
                id: ['konklusi', 'premis'],
              },
              explain: {
                en: 'Validity is entirely about this one guarantee — never about whether any particular statement in the argument happens to be true.',
                id: 'Kesahihan sepenuhnya tentang satu jaminan ini — tak pernah tentang apakah pernyataan tertentu dalam argumennya kebetulan benar.',
              },
              hint: {
                en: 'The two blanks name the two parts of an argument, in the order the definition talks about them.',
                id: 'Kedua isian menyebut dua bagian sebuah argumen, dengan urutan seperti yang dibicarakan definisinya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'An argument has premises $P_1$, $P_2$, and $P_3$. How many statements sit above the $\\therefore$ line in total?',
                id: 'Sebuah argumen mempunyai premis $P_1$, $P_2$, dan $P_3$. Berapa banyak pernyataan yang berada di atas garis $\\therefore$ seluruhnya?',
              },
              blanks: [{ answer: 3 }],
              hints: [
                { en: 'Everything above the line is a premise; the conclusion sits below it, after $\\therefore$.', id: 'Segala yang di atas garis adalah premis; konklusi berada di bawahnya, setelah $\\therefore$.' },
              ],
              explain: {
                en: 'Three premises are named, and the conclusion is not one of them — it sits below the line.',
                id: 'Ada tiga premis yang disebutkan, dan konklusinya bukan salah satunya — ia berada di bawah garis.',
              },
            },
          ],
        },
        {
          id: 'log-m5-s1-l2',
          title: { en: 'Modus Ponens and Modus Tollens', id: 'Modus Ponens dan Modus Tollens' },
          goal: {
            en: 'Recognise and apply the two most common valid argument forms.',
            id: 'Mengenali dan menerapkan dua bentuk argumen sah yang paling umum.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Modus Ponens: affirming the hypothesis', id: 'Modus Ponens: menegaskan hipotesis' },
              body: {
                en: '**Modus Ponens** is the argument form\n$$p \\Rightarrow q \\\\\\\\ p \\\\\\\\ \\therefore q$$\n"If it rains, the field is wet. It is raining. Therefore, the field is wet." Given the conditional and its hypothesis, the conclusion follows: the only row of the conditional\'s table where $p$ is true is the row where $q$ is true too — there is no way to have both premises true and the conclusion false.',
                id: '**Modus Ponens** adalah bentuk argumen\n$$p \\Rightarrow q \\\\\\\\ p \\\\\\\\ \\therefore q$$\n"Jika hujan, lapangannya basah. Sedang hujan. Jadi, lapangannya basah." Diberikan kondisional dan hipotesisnya, konklusinya pasti mengikuti: satu-satunya baris tabel kondisional yang $p$-nya benar adalah baris yang $q$-nya juga benar — tak ada cara membuat kedua premis benar sementara konklusinya salah.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Modus Tollens: denying the conclusion', id: 'Modus Tollens: mengingkar konklusi' },
              body: {
                en: '**Modus Tollens** works from the other end:\n$$p \\Rightarrow q \\\\\\\\ \\neg q \\\\\\\\ \\therefore \\neg p$$\n"If it rains, the field is wet. The field is not wet. Therefore, it is not raining." If $p$ had been true, $q$ would have had to be true as well (that is what $p \\Rightarrow q$ promises) — so a false $q$ rules $p$ out entirely. Modus Tollens is really the contrapositive law in action: $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$, and Modus Ponens applied to that contrapositive.',
                id: '**Modus Tollens** bekerja dari arah lain:\n$$p \\Rightarrow q \\\\\\\\ \\neg q \\\\\\\\ \\therefore \\neg p$$\n"Jika hujan, lapangannya basah. Lapangannya tidak basah. Jadi, tidak sedang hujan." Andai $p$ benar, $q$ pun pasti harus benar (itulah yang dijanjikan $p \\Rightarrow q$) — jadi $q$ yang salah menyingkirkan $p$ sama sekali. Modus Tollens sebenarnya adalah hukum kontraposisi dalam aksi: $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$, dan Modus Ponens diterapkan pada kontraposisi itu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Which argument form is this? "If $n$ is prime and $n > 2$, then $n$ is odd. $7$ is prime and $7 > 2$. Therefore, $7$ is odd."',
                id: 'Bentuk argumen manakah ini? "Jika $n$ prima dan $n > 2$, maka $n$ ganjil. $7$ prima dan $7 > 2$. Jadi, $7$ ganjil."',
              },
              options: [
                { en: 'Modus Ponens', id: 'Modus Ponens' },
                { en: 'Modus Tollens', id: 'Modus Tollens' },
                { en: 'Neither — it is invalid', id: 'Bukan keduanya — ia tidak sah' },
                { en: 'The converse error', id: 'Kekeliruan konvers' },
              ],
              answer: 0,
              explain: {
                en: 'The hypothesis of the conditional is affirmed directly ("$7$ is prime and $7>2$"), and the conclusion follows — the pattern $p \\Rightarrow q$, $p$, $\\therefore q$.',
                id: 'Hipotesis kondisionalnya ditegaskan secara langsung ("$7$ prima dan $7>2$"), dan konklusinya mengikuti — pola $p \\Rightarrow q$, $p$, $\\therefore q$.',
              },
              hint: {
                en: 'Check which of the conditional\'s two parts — hypothesis or conclusion — the second premise affirms directly.',
                id: 'Periksa bagian mana dari kedua bagian kondisionalnya — hipotesis atau konklusi — yang ditegaskan langsung oleh premis kedua.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which argument form is this? "If $n$ is a multiple of 6, then $n$ is even. $9$ is not even. Therefore, $9$ is not a multiple of 6."',
                id: 'Bentuk argumen manakah ini? "Jika $n$ kelipatan 6, maka $n$ genap. $9$ tidak genap. Jadi, $9$ bukan kelipatan 6."',
              },
              options: [
                { en: 'Modus Ponens', id: 'Modus Ponens' },
                { en: 'Modus Tollens', id: 'Modus Tollens' },
                { en: 'Neither — it is invalid', id: 'Bukan keduanya — ia tidak sah' },
                { en: 'The inverse error', id: 'Kekeliruan invers' },
              ],
              answer: 1,
              explain: {
                en: 'The conclusion of the conditional is denied ("$9$ is not even"), and the hypothesis is denied in turn — the pattern $p \\Rightarrow q$, $\\neg q$, $\\therefore \\neg p$.',
                id: 'Konklusi kondisionalnya diingkar ("$9$ tidak genap"), dan hipotesisnya pun diingkar — pola $p \\Rightarrow q$, $\\neg q$, $\\therefore \\neg p$.',
              },
              hint: {
                en: 'The second premise here negates one of the conditional\'s parts, rather than affirming it. Which part, and what does that make the conclusion?',
                id: 'Premis kedua di sini mengingkar salah satu bagian kondisionalnya, bukan menegaskannya. Bagian yang mana, dan apa yang itu buat konklusinya?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in order to write out a Modus Tollens argument about $n = 10$ and being a multiple of $4$.',
                id: 'Susun baris-baris ini dengan urutan yang benar untuk menuliskan argumen Modus Tollens tentang $n = 10$ dan kelipatan $4$.',
              },
              lines: {
                en: [
                  'p \\Rightarrow q: \\text{ if } n \\text{ is a multiple of } 4 \\text{, then } n \\text{ is even}',
                  '\\neg q: \\; 10 \\text{ is even, so this premise would instead need } n \\text{ to be odd — use } n = 9 \\text{: } 9 \\text{ is not even}',
                  '\\therefore \\neg p: \\; 9 \\text{ is not a multiple of } 4',
                ],
                id: [
                  'p \\Rightarrow q: \\text{ jika } n \\text{ kelipatan } 4 \\text{, maka } n \\text{ genap}',
                  '\\neg q: \\; 10 \\text{ genap, jadi premis ini justru butuh } n \\text{ ganjil — pakai } n = 9 \\text{: } 9 \\text{ tidak genap}',
                  '\\therefore \\neg p: \\; 9 \\text{ bukan kelipatan } 4',
                ],
              },
              explain: {
                en: 'Modus Tollens needs a false conclusion to deny, so $n$ has to be a value that is **not** even — $9$, not $10$; from there, denying "even" forces denying "multiple of 4" as well.',
                id: 'Modus Tollens butuh konklusi yang salah untuk diingkar, jadi $n$ harus berupa nilai yang **tidak** genap — $9$, bukan $10$; dari situ, mengingkar "genap" memaksa mengingkar "kelipatan 4" juga.',
              },
              hint: {
                en: 'The conditional always comes first. After that, the second premise must deny the conclusion side of it, not the hypothesis side.',
                id: 'Kondisionalnya selalu diletakkan lebih dulu. Setelah itu, premis kedua harus mengingkar sisi konklusinya, bukan sisi hipotesisnya.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Given "$p \\Rightarrow q$" is true and "$p$" is true, Modus Ponens guarantees $q$. If $p$: "$x = 3$" and $q$: "$x^2 = 9$", what is $x^2$? ',
                id: 'Diberikan "$p \\Rightarrow q$" benar dan "$p$" benar, Modus Ponens menjamin $q$. Jika $p$: "$x = 3$" dan $q$: "$x^2 = 9$", berapakah $x^2$?',
              },
              blanks: [{ label: 'x^2 =', answer: 9 }],
              hints: [
                { en: 'Modus Ponens guarantees the conclusion $q$ holds — read off exactly what $q$ says.', id: 'Modus Ponens menjamin konklusi $q$ berlaku — baca persis apa yang dikatakan $q$.' },
              ],
              explain: {
                en: 'Modus Ponens guarantees $q$ holds, and $q$ says $x^2 = 9$ directly.',
                id: 'Modus Ponens menjamin $q$ berlaku, dan $q$ langsung menyatakan $x^2 = 9$.',
              },
            },
          ],
        },
        {
          id: 'log-m5-s1-l3',
          title: { en: 'Syllogism and the Truth-Table Test', id: 'Silogisme dan Uji Tabel Kebenaran' },
          goal: {
            en: 'Chain implications with hypothetical syllogism, and test any argument for validity by truth table.',
            id: 'Merangkai implikasi dengan silogisme hipotetis, dan menguji sahih tidaknya argumen apa pun dengan tabel kebenaran.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Chaining two conditionals', id: 'Merangkai dua kondisional' },
              body: {
                en: 'The **hypothetical syllogism** chains two conditionals into a third:\n$$p \\Rightarrow q \\\\\\\\ q \\Rightarrow r \\\\\\\\ \\therefore p \\Rightarrow r$$\n"If a number is a multiple of 12, it is a multiple of 6. If it is a multiple of 6, it is a multiple of 3. Therefore, if it is a multiple of 12, it is a multiple of 3." The middle statement $q$ is the link that makes the chain work — remove it and $p$ and $r$ would have nothing connecting them.',
                id: '**Silogisme hipotetis** merangkai dua kondisional menjadi kondisional ketiga:\n$$p \\Rightarrow q \\\\\\\\ q \\Rightarrow r \\\\\\\\ \\therefore p \\Rightarrow r$$\n"Jika sebuah bilangan kelipatan 12, ia kelipatan 6. Jika ia kelipatan 6, ia kelipatan 3. Jadi, jika ia kelipatan 12, ia kelipatan 3." Pernyataan tengah $q$ adalah penghubung yang membuat rantainya bekerja — hilangkan ia dan $p$ dan $r$ tak punya apa pun yang menghubungkannya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One test for every argument', id: 'Satu uji untuk semua argumen' },
              body: {
                en: 'Every argument, whatever shape it takes, can be tested the same way: an argument with premises $P_1, \\ldots, P_n$ and conclusion $C$ is valid exactly when\n$$(P_1 \\land P_2 \\land \\cdots \\land P_n) \\Rightarrow C$$\nis a **tautology**. Build the truth table for this one big conditional; if any row makes every premise true and the conclusion false, the argument is invalid — that row is a **counterexample**. If no such row exists, it is valid.\n\nThis single test is what confirms Modus Ponens, Modus Tollens and hypothetical syllogism are all valid — and it is also what exposes the two classic fallacies: **affirming the consequent** ($p \\Rightarrow q$, $q$, $\\therefore p$) and **denying the antecedent** ($p \\Rightarrow q$, $\\neg p$, $\\therefore \\neg q$) both fail it, since each has a row with true premises and a false conclusion.',
                id: 'Setiap argumen, apa pun bentuknya, bisa diuji dengan cara yang sama: argumen dengan premis $P_1, \\ldots, P_n$ dan konklusi $C$ sah tepat ketika\n$$(P_1 \\land P_2 \\land \\cdots \\land P_n) \\Rightarrow C$$\nadalah **tautologi**. Bangun tabel kebenaran untuk satu kondisional besar ini; bila ada baris yang membuat setiap premis benar tetapi konklusinya salah, argumennya tidak sah — baris itu adalah **contoh penyangkal**. Bila tak ada baris seperti itu, argumennya sah.\n\nSatu uji ini sajalah yang mengonfirmasi Modus Ponens, Modus Tollens, dan silogisme hipotetis semuanya sah — dan ia juga yang membongkar dua kekeliruan klasik: **menegaskan konsekuen** ($p \\Rightarrow q$, $q$, $\\therefore p$) dan **mengingkar antesenden** ($p \\Rightarrow q$, $\\neg p$, $\\therefore \\neg q$) sama-sama gagal diuji ini, karena masing-masing punya baris berpremis benar tetapi berkonklusi salah.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Is "$p \\Rightarrow q$, $q$, $\\therefore p$" (affirming the consequent) valid?',
                id: 'Apakah "$p \\Rightarrow q$, $q$, $\\therefore p$" (menegaskan konsekuen) sah?',
              },
              options: [
                { en: 'Yes — it looks just like Modus Ponens', id: 'Ya — bentuknya mirip sekali dengan Modus Ponens' },
                { en: 'No — with $p$ false and $q$ true, both premises can be true while the conclusion is false', id: 'Tidak — dengan $p$ salah dan $q$ benar, kedua premis bisa benar sementara konklusinya salah' },
                { en: 'Yes — it is the contrapositive of Modus Ponens', id: 'Ya — ia kontraposisi dari Modus Ponens' },
                { en: 'It depends on what $p$ and $q$ actually are', id: 'Tergantung apa sebenarnya $p$ dan $q$' },
              ],
              answer: 1,
              explain: {
                en: 'Take $p$ false and $q$ true: $p \\Rightarrow q$ is true (false hypothesis), $q$ is true, but the conclusion $p$ is false — a counterexample row, so this form is invalid despite resembling Modus Ponens at a glance.',
                id: 'Ambil $p$ salah dan $q$ benar: $p \\Rightarrow q$ benar (hipotesisnya salah), $q$ benar, tetapi konklusi $p$ salah — sebuah baris contoh penyangkal, jadi bentuk ini tidak sah meski sepintas mirip Modus Ponens.',
              },
              hint: {
                en: 'Try to find one combination of truth values for $p$ and $q$ that makes both premises true and the conclusion false. A false hypothesis is always worth trying first.',
                id: 'Coba cari satu kombinasi nilai kebenaran $p$ dan $q$ yang membuat kedua premis benar tetapi konklusinya salah. Hipotesis yang salah selalu layak dicoba lebih dulu.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'An argument\'s premises are all true, and its truth-table test shows $(P_1 \\land P_2) \\Rightarrow C$ is a tautology. What can you conclude?',
                id: 'Premis-premis sebuah argumen semuanya benar, dan uji tabel kebenarannya menunjukkan $(P_1 \\land P_2) \\Rightarrow C$ tautologi. Apa yang bisa kamu simpulkan?',
              },
              options: [
                { en: 'C must be true', id: '$C$ pasti benar' },
                { en: 'C might be true or false — nothing is guaranteed', id: '$C$ bisa benar atau salah — tak ada yang dijamin' },
                { en: 'The argument is invalid', id: 'Argumennya tidak sah' },
                { en: 'The premises must be false instead', id: 'Premisnya justru pasti salah' },
              ],
              answer: 0,
              explain: {
                en: 'A tautological $(P_1 \\land P_2) \\Rightarrow C$ means the argument is valid — and with premises that are actually true, validity forces the conclusion to be true as well. This is exactly what makes a valid argument with true premises useful.',
                id: '$(P_1 \\land P_2) \\Rightarrow C$ yang tautologi berarti argumennya sah — dan dengan premis yang benar-benar benar, kesahihan memaksa konklusinya pun ikut benar. Inilah tepatnya yang membuat argumen sah berpremis benar berguna.',
              },
              hint: {
                en: 'A tautological conditional here means the argument is valid. Combine that with the given fact that the premises are actually true.',
                id: 'Kondisional yang tautologi di sini berarti argumennya sah. Gabungkan itu dengan fakta bahwa premisnya benar-benar benar.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in order to test the hypothetical syllogism $p \\Rightarrow q, q \\Rightarrow r, \\therefore p \\Rightarrow r$ for the one row where $p$ is true, $q$ is true, $r$ is false.',
                id: 'Susun baris-baris ini dengan urutan yang benar untuk menguji silogisme hipotetis $p \\Rightarrow q, q \\Rightarrow r, \\therefore p \\Rightarrow r$ pada satu baris ketika $p$ benar, $q$ benar, $r$ salah.',
              },
              lines: {
                en: [
                  'p \\Rightarrow q = B \\; (p = B, q = B)',
                  'q \\Rightarrow r = S \\; (q = B, r = S)',
                  '\\text{Premis } q \\Rightarrow r \\text{ sudah salah, jadi baris ini bukan contoh penyangkal}',
                ],
                id: [
                  'p \\Rightarrow q = B \\; (p = B, q = B)',
                  'q \\Rightarrow r = S \\; (q = B, r = S)',
                  '\\text{Premis } q \\Rightarrow r \\text{ sudah salah, jadi baris ini bukan contoh penyangkal}',
                ],
              },
              explain: {
                en: 'A counterexample needs **every** premise true. As soon as one premise ($q \\Rightarrow r$) comes out false in a row, that row is already disqualified from being a counterexample, whatever the conclusion does.',
                id: 'Contoh penyangkal butuh **setiap** premis benar. Begitu satu premis ($q \\Rightarrow r$) bernilai salah pada suatu baris, baris itu sudah gugur sebagai contoh penyangkal, apa pun yang terjadi pada konklusinya.',
              },
              hint: {
                en: 'Check each premise for this row in turn, in the order they are listed in the argument. The moment one of them is false, the row is settled.',
                id: 'Periksa tiap premis untuk baris ini satu per satu, sesuai urutan yang tercantum dalam argumen. Begitu salah satunya salah, baris itu sudah selesai diperiksa.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Testing $p \\Rightarrow q, q, \\therefore p$ (affirming the consequent) for $p$ false and $q$ true: is this row a counterexample? (Type 1 for yes, 0 for no.)',
                id: 'Menguji $p \\Rightarrow q, q, \\therefore p$ (menegaskan konsekuen) untuk $p$ salah dan $q$ benar: apakah baris ini contoh penyangkal? (Ketik 1 untuk ya, 0 untuk tidak.)',
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: 'Check whether both premises come out true in this row.', id: 'Periksa apakah kedua premisnya benar pada baris ini.' },
                { en: 'Then check the conclusion $p$ on its own.', id: 'Lalu periksa konklusi $p$ sendiri.' },
              ],
              explain: {
                en: '$p \\Rightarrow q$ is true (false hypothesis), $q$ is true — both premises hold — but the conclusion $p$ is false. Every condition for a counterexample is met.',
                id: '$p \\Rightarrow q$ benar (hipotesisnya salah), $q$ benar — kedua premis berlaku — tetapi konklusi $p$ salah. Setiap syarat contoh penyangkal terpenuhi.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m5-s1-p',
        runtime: 'math',
        title: { en: 'Valid Argument Forms', id: 'Bentuk Argumen Sah' },
        brief: {
          en: 'Apply Modus Ponens and Modus Tollens, and hunt for a counterexample.',
          id: 'Menerapkan Modus Ponens dan Modus Tollens, dan mencari contoh penyangkal.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
          { en: 'Answer truth values or yes/no as 1 or 0.', id: 'Jawab nilai kebenaran atau ya/tidak dengan 1 atau 0.' },
        ],
        tasks: [
          {
            prompt: {
              en: '"If $n$ is a multiple of 15, then $n$ is a multiple of 5. $n$ is not a multiple of 5." By Modus Tollens, is $n$ a multiple of 15? (1 = no/false, i.e. the conclusion "not a multiple of 15" holds.)',
              id: '"Jika $n$ kelipatan 15, maka $n$ kelipatan 5. $n$ bukan kelipatan 5." Menurut Modus Tollens, apakah $n$ kelipatan 15? (1 = tidak/salah, yakni konklusi "bukan kelipatan 15" berlaku.)',
            },
            blanks: [{ answer: 1 }],
            solution: ['Modus Tollens menjamin $\\neg p$: $n$ bukan kelipatan 15.'],
          },
          {
            prompt: {
              en: 'Testing "$p \\Rightarrow q$, $\\neg p$, $\\therefore \\neg q$" (denying the antecedent) for $p$ false, $q$ true: are both premises true in this row?',
              id: 'Menguji "$p \\Rightarrow q$, $\\neg p$, $\\therefore \\neg q$" (mengingkar antesenden) untuk $p$ salah, $q$ benar: apakah kedua premisnya benar pada baris ini?',
            },
            blanks: [{ answer: 1 }],
            solution: ['$p \\Rightarrow q$ benar (hipotesis salah) dan $\\neg p$ benar ($p$ salah) — keduanya benar.'],
          },
          {
            prompt: {
              en: 'Same row as above. Is the conclusion $\\neg q$ true? Does this row make the argument invalid? (Answer 1 for "yes, invalid".)',
              id: 'Baris yang sama seperti di atas. Apakah konklusi $\\neg q$ benar? Apakah baris ini membuat argumennya tidak sah? (Jawab 1 untuk "ya, tidak sah".)',
            },
            blanks: [{ answer: 1 }],
            solution: ['$q$ benar, jadi $\\neg q$ salah — dengan kedua premis benar dan konklusi salah, baris ini contoh penyangkal, dan argumennya tidak sah.'],
          },
        ],
        hints: [
          {
            en: 'For the last two parts: settle every premise first, then compare against the conclusion in that same row.',
            id: 'Untuk dua butir terakhir: tentukan dulu setiap premis, lalu bandingkan dengan konklusi pada baris yang sama.',
          },
        ],
        xp: 50,
      },
    },

    /* --------------------- 5.2 indirect proof & quantified arguments */
    {
      id: 'log-m5-s2',
      title: { en: 'Indirect Proof and Quantified Arguments', id: 'Pembuktian Tidak Langsung dan Argumen Berkuantor' },
      summary: {
        en: 'Prove a statement by assuming it false, prove it via its contrapositive, and reason about a universal claim applied to one case.',
        id: 'Membuktikan pernyataan dengan mengandaikannya salah, membuktikannya lewat kontraposisi, dan bernalar tentang klaim universal yang diterapkan pada satu kasus.',
      },
      lessons: [
        {
          id: 'log-m5-s2-l1',
          title: { en: 'Indirect Proof: Contradiction and Contrapositive', id: 'Pembuktian Tidak Langsung: Kontradiksi dan Kontraposisi' },
          goal: {
            en: 'Prove a statement without proving it head-on, by contradiction or by its contrapositive.',
            id: 'Membuktikan pernyataan tanpa membuktikannya secara langsung, dengan kontradiksi atau lewat kontraposisinya.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Assume the opposite, find a contradiction', id: 'Andaikan sebaliknya, temukan kontradiksi' },
              body: {
                en: 'A **direct proof** of $p \\Rightarrow q$ starts from $p$ and reasons forward to $q$. A **proof by contradiction** does the opposite: assume $p$ is true **and** $q$ is false — that is, assume $\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$ — and reason forward until two statements contradict each other. Since a contradiction can never actually hold, the assumption that led there must be false, which forces $p \\Rightarrow q$ to be true after all.\n\nA classic example: to prove "there is no largest integer", assume the opposite — that some integer $N$ is the largest. Then $N + 1$ is an integer, and $N + 1 > N$, contradicting that $N$ was the largest. The assumption breaks, so no largest integer exists.',
                id: '**Pembuktian langsung** untuk $p \\Rightarrow q$ dimulai dari $p$ dan bernalar maju menuju $q$. **Pembuktian dengan kontradiksi** melakukan sebaliknya: andaikan $p$ benar **dan** $q$ salah — yakni, andaikan $\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$ — dan bernalar maju hingga dua pernyataan saling bertentangan. Karena kontradiksi tak pernah bisa benar-benar berlaku, pengandaian yang membawanya ke sana pastilah salah, yang memaksa $p \\Rightarrow q$ pada akhirnya benar.\n\nContoh klasik: untuk membuktikan "tak ada bilangan bulat terbesar", andaikan sebaliknya — bahwa ada bilangan bulat $N$ yang terbesar. Maka $N + 1$ adalah bilangan bulat, dan $N + 1 > N$, bertentangan dengan anggapan bahwa $N$ terbesar. Pengandaiannya runtuh, jadi tak ada bilangan bulat terbesar.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Or prove the contrapositive instead', id: 'Atau buktikan kontraposisinya saja' },
              body: {
                en: 'A **proof by contrapositive** takes advantage of $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$: instead of proving $p \\Rightarrow q$ directly, prove $\\neg q \\Rightarrow \\neg p$, which is sometimes far easier to reason about directly.\n\nTo prove "if $n^2$ is even, then $n$ is even", proving it head-on means starting from a fact about $n^2$ and somehow extracting a fact about $n$ — awkward. Its contrapositive, "if $n$ is odd, then $n^2$ is odd", is a direct computation: $n = 2k+1$ gives $n^2 = 4k^2 + 4k + 1 = 2(2k^2+2k)+1$, visibly odd. Proving this proves the original, since the two are logically equivalent.',
                id: '**Pembuktian dengan kontraposisi** memanfaatkan $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$: alih-alih membuktikan $p \\Rightarrow q$ secara langsung, buktikan $\\neg q \\Rightarrow \\neg p$, yang kadang jauh lebih mudah dinalar secara langsung.\n\nUntuk membuktikan "jika $n^2$ genap, maka $n$ genap", membuktikannya secara langsung berarti mulai dari fakta tentang $n^2$ dan entah bagaimana menarik fakta tentang $n$ — canggung. Kontraposisinya, "jika $n$ ganjil, maka $n^2$ ganjil", adalah perhitungan langsung: $n = 2k+1$ memberi $n^2 = 4k^2 + 4k + 1 = 2(2k^2+2k)+1$, jelas ganjil. Membuktikan ini membuktikan yang asli, karena keduanya ekivalen secara logis.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A proof by contradiction of $p \\Rightarrow q$ begins by assuming:',
                id: 'Pembuktian dengan kontradiksi untuk $p \\Rightarrow q$ dimulai dengan mengandaikan:',
              },
              options: [
                { en: '$p$ is true and $q$ is true', id: '$p$ benar dan $q$ benar' },
                { en: '$p$ is true and $q$ is false', id: '$p$ benar dan $q$ salah' },
                { en: '$p$ is false and $q$ is true', id: '$p$ salah dan $q$ benar' },
                { en: '$p$ is false and $q$ is false', id: '$p$ salah dan $q$ salah' },
              ],
              answer: 1,
              explain: {
                en: 'The assumption is the negation of the whole conditional, $\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$ — exactly the one broken-promise row.',
                id: 'Pengandaiannya adalah negasi dari seluruh kondisionalnya, $\\neg(p \\Rightarrow q) \\equiv p \\land \\neg q$ — persis satu baris janji yang diingkari.',
              },
              hint: {
                en: 'Recall the negation of a conditional you derived in an earlier module — that is exactly what a proof by contradiction assumes.',
                id: 'Ingat negasi kondisional yang sudah kamu turunkan pada modul sebelumnya — itulah persis yang diandaikan oleh pembuktian dengan kontradiksi.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'To prove "if $x + y$ is odd, then $x$ and $y$ have different parity" by contrapositive, what should be proved instead?',
                id: 'Untuk membuktikan "jika $x + y$ ganjil, maka $x$ dan $y$ berbeda paritas" lewat kontraposisi, apa yang seharusnya dibuktikan sebagai gantinya?',
              },
              options: [
                { en: 'If $x$ and $y$ have different parity, then $x + y$ is odd.', id: 'Jika $x$ dan $y$ berbeda paritas, maka $x + y$ ganjil.' },
                { en: 'If $x$ and $y$ have the same parity, then $x + y$ is even.', id: 'Jika $x$ dan $y$ sama paritas, maka $x + y$ genap.' },
                { en: 'If $x + y$ is even, then $x$ and $y$ have the same parity.', id: 'Jika $x + y$ genap, maka $x$ dan $y$ sama paritas.' },
                { en: 'If $x$ and $y$ are both odd, then $x + y$ is odd.', id: 'Jika $x$ dan $y$ sama-sama ganjil, maka $x + y$ genap.' },
              ],
              answer: 1,
              explain: {
                en: 'The contrapositive negates both parts and swaps them: "not different parity" is "same parity", and "not odd" is "even" — giving "if $x$ and $y$ have the same parity, then $x + y$ is even".',
                id: 'Kontraposisi mengingkar kedua bagiannya dan menukarnya: "tidak berbeda paritas" berarti "sama paritas", dan "tidak ganjil" berarti "genap" — menghasilkan "jika $x$ dan $y$ sama paritas, maka $x + y$ genap".',
              },
              hint: {
                en: 'Negate each half of the original conditional first — "different parity" becomes "same parity", and "odd" becomes "even" — then swap their order.',
                id: 'Ingkar dulu tiap bagian kondisional aslinya — "berbeda paritas" menjadi "sama paritas", dan "ganjil" menjadi "genap" — lalu tukar urutannya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Put these steps in order for a proof by contradiction that $\\sqrt{2}$ cannot be written as $\\frac{a}{b}$ in lowest terms with both $a$ and $b$ even (the first step of the classical proof).',
                id: 'Susun langkah-langkah ini dengan urutan yang benar untuk pembuktian dengan kontradiksi bahwa $\\sqrt{2}$ tak bisa ditulis sebagai $\\frac{a}{b}$ dalam bentuk paling sederhana dengan $a$ dan $b$ sama-sama genap (langkah pertama pembuktian klasiknya).',
              },
              lines: {
                en: [
                  'Assume, for contradiction, that a/b is in lowest terms and both a and b are even.',
                  '"Both even" means 2 divides a and 2 divides b.',
                  'But then a/b could be reduced further by dividing both by 2.',
                  'This contradicts the assumption that a/b was already in lowest terms.',
                ],
                id: [
                  'Andaikan, untuk kontradiksi, a/b dalam bentuk paling sederhana dan a serta b sama-sama genap.',
                  '"Sama-sama genap" berarti 2 membagi a dan 2 membagi b.',
                  'Tetapi kalau begitu a/b masih bisa disederhanakan lagi dengan membagi keduanya dengan 2.',
                  'Ini bertentangan dengan pengandaian bahwa a/b sudah dalam bentuk paling sederhana.',
                ],
              },
              explain: {
                en: 'Every proof by contradiction follows this shape: state the assumption, unfold what it means, derive a consequence, and show that consequence clashes with something already assumed.',
                id: 'Setiap pembuktian dengan kontradiksi mengikuti bentuk ini: nyatakan pengandaiannya, uraikan artinya, turunkan sebuah akibat, dan tunjukkan akibat itu bertentangan dengan sesuatu yang sudah diandaikan.',
              },
              hint: {
                en: 'The contradiction has to be the very last line — it only makes sense once everything it clashes with has already been said.',
                id: 'Kontradiksinya harus menjadi baris paling akhir — ia hanya masuk akal setelah semua yang ditentangnya sudah dinyatakan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'Proving "if $n^2$ is odd, then $n$ is odd" by contrapositive means proving "if $n$ is even, then $n^2$ is even" instead. For $n = 6$, what is $n^2$? (Confirms the contrapositive holds in this case.)',
                id: 'Membuktikan "jika $n^2$ ganjil, maka $n$ ganjil" lewat kontraposisi berarti membuktikan "jika $n$ genap, maka $n^2$ genap" sebagai gantinya. Untuk $n = 6$, berapakah $n^2$? (Mengonfirmasi kontraposisinya berlaku pada kasus ini.)',
              },
              blanks: [{ label: 'n^2 =', answer: 36 }],
              hints: [
                { en: 'Just square 6.', id: 'Kuadratkan saja 6.' },
              ],
              explain: {
                en: '$6^2 = 36$, which is even — consistent with the contrapositive, and therefore with the original statement too.',
                id: '$6^2 = 36$, yang genap — sesuai dengan kontraposisinya, dan karena itu sesuai pula dengan pernyataan aslinya.',
              },
            },
          ],
        },
        {
          id: 'log-m5-s2-l2',
          title: { en: 'Validity for Quantified Statements', id: 'Validitas untuk Pernyataan Berkuantor' },
          goal: {
            en: 'Apply a universal premise to a specific case, and see why the reverse move is not valid.',
            id: 'Menerapkan premis universal pada suatu kasus tertentu, dan melihat mengapa langkah sebaliknya tidak sah.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'From every member to one member', id: 'Dari setiap anggota ke satu anggota' },
              body: {
                en: 'The most common valid argument built from a quantifier is **universal instantiation**: from a statement about **every** member of a domain, a claim about one specific member follows immediately.\n$$\\forall x, \\; p(x) \\\\\\\\ \\therefore p(a) \\quad \\text{for any specific } a \\text{ in the domain}$$\n"All men are mortal. Socrates is a man. Therefore, Socrates is mortal." is exactly universal instantiation ($\\forall x, \\text{man}(x) \\Rightarrow \\text{mortal}(x)$) chained with Modus Ponens (Socrates is a man, so Socrates is mortal) — the classical syllogism is these two familiar tools working together, not a third one.',
                id: 'Argumen sah paling umum yang dibangun dari kuantor adalah **instansiasi universal**: dari pernyataan tentang **setiap** anggota semesta, klaim tentang satu anggota tertentu langsung mengikuti.\n$$\\forall x, \\; p(x) \\\\\\\\ \\therefore p(a) \\quad \\text{untuk sebarang } a \\text{ tertentu di semesta}$$\n"Semua manusia fana. Socrates adalah manusia. Jadi, Socrates fana." adalah persis instansiasi universal ($\\forall x, \\text{manusia}(x) \\Rightarrow \\text{fana}(x)$) yang dirangkai dengan Modus Ponens (Socrates manusia, jadi Socrates fana) — silogisme klasik ini adalah kedua alat yang sudah dikenal bekerja bersama, bukan alat ketiga.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'One example never proves a universal claim', id: 'Satu contoh tak pernah membuktikan klaim universal' },
              body: {
                en: 'The reverse move is **not** valid: from a fact about one member, nothing about every member follows.\n$$p(a) \\text{ for some specific } a \\\\\\\\ \\therefore \\forall x, \\; p(x) \\qquad \\text{— invalid}$$\n"$2$ is even and prime. Therefore, every even number is prime." is obviously broken — $4$ is an immediate counterexample. This is the same asymmetry met with quantifiers earlier: a universal claim needs **every** member checked to be confirmed, and one example, however true, is never every member.',
                id: 'Langkah sebaliknya **tidak** sah: dari fakta tentang satu anggota, tak ada apa pun tentang setiap anggota yang mengikuti.\n$$p(a) \\text{ untuk suatu } a \\text{ tertentu} \\\\\\\\ \\therefore \\forall x, \\; p(x) \\qquad \\text{— tidak sah}$$\n"$2$ genap dan prima. Jadi, setiap bilangan genap prima." jelas keliru — $4$ adalah contoh penyangkal yang langsung terlihat. Ini asimetri yang sama seperti yang sudah ditemui pada kuantor sebelumnya: klaim universal butuh **setiap** anggota diperiksa untuk dikonfirmasi, dan satu contoh, sebenar apa pun, tak pernah setiap anggota.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: '"Every prime greater than $2$ is odd. $17$ is a prime greater than $2$." What follows validly?',
                id: '"Setiap bilangan prima lebih dari $2$ adalah ganjil. $17$ adalah bilangan prima lebih dari $2$." Apa yang mengikuti secara sah?',
              },
              options: [
                { en: '$17$ is odd.', id: '$17$ ganjil.' },
                { en: 'Every odd number is prime.', id: 'Setiap bilangan ganjil prima.' },
                { en: 'Nothing follows without more information.', id: 'Tak ada yang mengikuti tanpa keterangan lain.' },
                { en: 'All primes are greater than 2.', id: 'Semua bilangan prima lebih dari 2.' },
              ],
              answer: 0,
              explain: {
                en: 'Universal instantiation applies the universal premise to the specific member $17$, then Modus Ponens finishes it: $17$ is odd.',
                id: 'Instansiasi universal menerapkan premis universalnya pada anggota tertentu $17$, lalu Modus Ponens menuntaskannya: $17$ ganjil.',
              },
              hint: {
                en: 'This is exactly the "Socrates" pattern — a universal fact plus a specific instance of its hypothesis. What did that pattern conclude?',
                id: 'Ini persis pola "Socrates" — fakta universal ditambah satu contoh khusus hipotesisnya. Apa yang disimpulkan pola itu?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Is "$3^2 = 9$ is odd. Therefore, $n^2$ is odd for every odd $n$." a valid argument?',
                id: 'Apakah "$3^2 = 9$ ganjil. Jadi, $n^2$ ganjil untuk setiap $n$ ganjil." argumen yang sah?',
              },
              options: [
                { en: 'Yes — $3$ is a representative odd number', id: 'Ya — $3$ mewakili bilangan ganjil' },
                { en: 'No — one example cannot establish a universal claim', id: 'Tidak — satu contoh tak bisa menetapkan klaim universal' },
                { en: 'Yes — the conclusion happens to be true', id: 'Ya — konklusinya kebetulan benar' },
                { en: 'Cannot be judged without knowing every odd number', id: 'Tak bisa dinilai tanpa mengetahui setiap bilangan ganjil' },
              ],
              answer: 1,
              explain: {
                en: 'The conclusion here happens to be true, but the argument reaching it is invalid regardless — one instance never validly establishes "for every". (A correct proof of this particular claim exists — algebraically, from $n=2k+1$ — but this argument is not that proof.)',
                id: 'Konklusinya di sini kebetulan benar, tetapi argumen yang mencapainya tetap tidak sah — satu contoh tak pernah secara sah menetapkan "untuk setiap". (Bukti yang benar untuk klaim ini memang ada — secara aljabar, dari $n=2k+1$ — tetapi argumen ini bukan bukti itu.)',
              },
              hint: {
                en: 'Ask the general question first, ignoring whether this particular conclusion happens to be true: can one example alone ever validly establish "for every"?',
                id: 'Tanyakan dulu pertanyaan umumnya, abaikan dulu apakah konklusi khusus ini kebetulan benar: bisakah satu contoh saja secara sah menetapkan "untuk setiap"?',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'From "$\\forall x \\in \\mathbb{Z}, \\; x^2 \\geq 0$" and the specific case $x = -7$, universal instantiation gives $(-7)^2 \\geq 0$. What is $(-7)^2$?',
                id: 'Dari "$\\forall x \\in \\mathbb{Z}, \\; x^2 \\geq 0$" dan kasus tertentu $x = -7$, instansiasi universal memberi $(-7)^2 \\geq 0$. Berapakah $(-7)^2$?',
              },
              blanks: [{ label: '(-7)^2 =', answer: 49 }],
              hints: [
                { en: 'Squaring a negative number gives a positive result.', id: 'Mengkuadratkan bilangan negatif memberi hasil positif.' },
              ],
              explain: {
                en: '$(-7)^2 = 49$, which is indeed $\\geq 0$, confirming the instantiated claim.',
                id: '$(-7)^2 = 49$, yang memang $\\geq 0$, mengonfirmasi klaim yang diinstansiasi.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m5-s2-p',
        runtime: 'math',
        title: { en: 'Indirect Proof and Instantiation', id: 'Pembuktian Tidak Langsung dan Instansiasi' },
        brief: {
          en: 'Work through a contrapositive proof and a universal instantiation.',
          id: 'Mengerjakan pembuktian dengan kontraposisi dan sebuah instansiasi universal.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'To prove "if $3n + 1$ is even, then $n$ is odd" by contrapositive, you instead prove "if $n$ is even, then $3n+1$ is odd". Check it for $n = 4$: what is $3n + 1$?',
              id: 'Untuk membuktikan "jika $3n + 1$ genap, maka $n$ ganjil" lewat kontraposisi, kamu justru membuktikan "jika $n$ genap, maka $3n+1$ ganjil". Periksa untuk $n = 4$: berapakah $3n + 1$?',
            },
            blanks: [{ label: '3n + 1 =', answer: 13 }],
            solution: ['$3(4) + 1 = 13$, yang ganjil — konsisten dengan kontraposisinya.'],
          },
          {
            prompt: {
              en: 'From "$\\forall x \\in \\mathbb{Z}, \\; x^3 \\text{ has the same sign as } x$" and $x = -2$, universal instantiation gives a claim about $(-2)^3$. What is $(-2)^3$?',
              id: 'Dari "$\\forall x \\in \\mathbb{Z}, \\; x^3 \\text{ bertanda sama dengan } x$" dan $x = -2$, instansiasi universal memberi klaim tentang $(-2)^3$. Berapakah $(-2)^3$?',
            },
            blanks: [{ label: '(-2)^3 =', answer: -8 }],
            solution: ['$(-2)^3 = -8$, negatif seperti $-2$ sendiri — sesuai dengan yang diklaim.'],
          },
          {
            prompt: {
              en: 'A proof by contradiction of "$\\sqrt{3}$ is irrational" assumes $\\sqrt{3} = \\frac{a}{b}$ in lowest terms, and derives that $3$ divides $a$, so $a = 3k$. Substituting, $3b^2 = 9k^2$, so $b^2 = 3k^2$ — meaning $3$ also divides $b$. This contradicts "lowest terms" because $a$ and $b$ would share what common factor?',
              id: 'Pembuktian dengan kontradiksi untuk "$\\sqrt{3}$ irasional" mengandaikan $\\sqrt{3} = \\frac{a}{b}$ dalam bentuk paling sederhana, dan menurunkan bahwa $3$ membagi $a$, jadi $a = 3k$. Disubstitusi, $3b^2 = 9k^2$, jadi $b^2 = 3k^2$ — berarti $3$ juga membagi $b$. Ini bertentangan dengan "bentuk paling sederhana" karena $a$ dan $b$ akan berbagi faktor persekutuan apa?',
            },
            blanks: [{ answer: 3 }],
            solution: ['Keduanya habis dibagi 3, bertentangan dengan pengandaian bahwa $a/b$ sudah paling sederhana.'],
          },
        ],
        hints: [
          {
            en: 'The last part only needs the number both derived facts ("3 divides a", "3 divides b") already agree on.',
            id: 'Butir terakhir hanya butuh bilangan yang sudah disepakati oleh kedua fakta yang diturunkan ("3 membagi a", "3 membagi b").',
          },
        ],
        xp: 50,
      },
    },

    /* ---------------------------------------- 5.3 mathematical induction */
    {
      id: 'log-m5-s3',
      title: { en: 'Mathematical Induction', id: 'Induksi Matematika' },
      summary: {
        en: 'Prove a statement for every natural number at once, by a base case and a step that never stops.',
        id: 'Membuktikan pernyataan untuk setiap bilangan asli sekaligus, dengan kasus basis dan langkah yang tak pernah berhenti.',
      },
      lessons: [
        {
          id: 'log-m5-s3-l1',
          title: { en: 'The Principle of Mathematical Induction', id: 'Prinsip Induksi Matematika' },
          goal: {
            en: 'State the two parts of an induction proof, and see why together they prove infinitely many cases.',
            id: 'Menyatakan dua bagian pembuktian induksi, dan melihat mengapa keduanya sekaligus membuktikan tak terhingga banyak kasus.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Dominoes, not a truth table', id: 'Kartu domino, bukan tabel kebenaran' },
              body: {
                en: 'Some statements are claimed for **every** natural number: "$1 + 2 + \\cdots + n = \\frac{n(n+1)}{2}$ for every $n \\geq 1$". A truth table cannot check infinitely many rows, so a different valid argument form is used: **mathematical induction**, with two parts.\n\n**Base case**: show the statement $P(1)$ holds for the smallest case.\n**Inductive step**: show that **if** $P(k)$ holds for some arbitrary $k$, **then** $P(k+1)$ holds too — that is, prove $P(k) \\Rightarrow P(k+1)$.\n\nTogether these two are like the first domino falling, and every domino being close enough to knock over the next one: $P(1)$ true, and $P(1) \\Rightarrow P(2)$, so $P(2)$ true, and $P(2) \\Rightarrow P(3)$, so $P(3)$ true — Modus Ponens applied once per natural number, forever.',
                id: 'Sebagian pernyataan diklaim untuk **setiap** bilangan asli: "$1 + 2 + \\cdots + n = \\frac{n(n+1)}{2}$ untuk setiap $n \\geq 1$". Tabel kebenaran tak bisa memeriksa tak terhingga banyak baris, jadi dipakai bentuk argumen sah yang berbeda: **induksi matematika**, dengan dua bagian.\n\n**Basis induksi**: tunjukkan pernyataan $P(1)$ berlaku untuk kasus terkecil.\n**Langkah induktif**: tunjukkan bahwa **jika** $P(k)$ berlaku untuk suatu $k$ sembarang, **maka** $P(k+1)$ juga berlaku — yakni, buktikan $P(k) \\Rightarrow P(k+1)$.\n\nKeduanya bersama-sama seperti domino pertama yang jatuh, dan setiap domino cukup dekat untuk merobohkan domino berikutnya: $P(1)$ benar, dan $P(1) \\Rightarrow P(2)$, jadi $P(2)$ benar, dan $P(2) \\Rightarrow P(3)$, jadi $P(3)$ benar — Modus Ponens diterapkan sekali untuk setiap bilangan asli, selamanya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Both parts are required', id: 'Kedua bagian sama-sama diperlukan' },
              body: {
                en: 'Neither part alone is enough. Skipping the base case is exactly the fallacy of never actually knocking over the first domino: the inductive step for "$n = n + 1$" is trivially true ($P(k) \\Rightarrow P(k+1)$ holds, since adding 1 to both a false equation\'s sides keeps it "just as false"), yet no $n$ ever actually satisfies it, because $P(1)$ is already false.\n\nSkipping the inductive step is just as fatal: checking $P(1), P(2), \\ldots, P(100)$ one by one, however many cases, never proves $P(n)$ for **every** $n$ — there is always a $101$ left unchecked. Only the inductive step turns finitely many verified dominoes into infinitely many.',
                id: 'Tak satu pun bagian saja yang cukup. Melewati basis induksi persis kekeliruan tak pernah benar-benar merobohkan domino pertama: langkah induktif untuk "$n = n + 1$" secara trivial benar ($P(k) \\Rightarrow P(k+1)$ berlaku, karena menambahkan 1 ke kedua ruas persamaan yang salah tetap membuatnya "sama-sama salah"), tetapi tak ada $n$ yang benar-benar memenuhinya, karena $P(1)$ sudah salah sejak awal.\n\nMelewati langkah induktif sama fatalnya: memeriksa $P(1), P(2), \\ldots, P(100)$ satu per satu, sebanyak apa pun kasusnya, tak pernah membuktikan $P(n)$ untuk **setiap** $n$ — selalu ada $101$ yang belum diperiksa. Hanya langkah induktif yang mengubah domino berhingga yang sudah diperiksa menjadi tak terhingga banyaknya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A proof by induction skips the base case but proves the inductive step correctly. What has been proved?',
                id: 'Sebuah pembuktian induksi melewati basis induksi tetapi membuktikan langkah induktifnya dengan benar. Apa yang telah dibuktikan?',
              },
              options: [
                { en: 'The statement, for every natural number', id: 'Pernyataannya, untuk setiap bilangan asli' },
                { en: 'Nothing at all — the chain never starts', id: 'Tak ada apa-apa — rantainya tak pernah dimulai' },
                { en: 'The statement, for every number except the first', id: 'Pernyataannya, untuk setiap bilangan kecuali yang pertama' },
                { en: 'The base case is implied by the inductive step', id: 'Basis induksinya tersirat oleh langkah induktif' },
              ],
              answer: 1,
              explain: {
                en: 'Without a true $P(1)$ to start from, "$P(k) \\Rightarrow P(k+1)$" never actually fires for any real $k$ — it is a chain of dominoes with no first one falling, so nothing at all has been established.',
                id: 'Tanpa $P(1)$ yang benar untuk memulai, "$P(k) \\Rightarrow P(k+1)$" tak pernah benar-benar terpicu untuk $k$ mana pun yang nyata — ia rantai domino tanpa domino pertama yang jatuh, jadi tak ada apa pun yang ditetapkan.',
              },
              hint: {
                en: 'Think about the domino picture: what use is "every domino would knock over the next one" if not a single domino ever actually falls?',
                id: 'Pikirkan gambaran domino: apa gunanya "setiap domino akan merobohkan yang berikutnya" bila tak satu pun domino yang benar-benar jatuh?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Which of these is the correct statement of the inductive step, for a claim $P(n)$?',
                id: 'Manakah dari berikut ini pernyataan yang benar untuk langkah induktif, bagi klaim $P(n)$?',
              },
              options: [
                { en: 'Prove $P(k)$ for some specific large $k$', id: 'Buktikan $P(k)$ untuk suatu $k$ tertentu yang besar' },
                { en: 'Prove $P(k) \\Rightarrow P(k+1)$ for an arbitrary $k$', id: 'Buktikan $P(k) \\Rightarrow P(k+1)$ untuk $k$ sembarang' },
                { en: 'Prove $P(1)$', id: 'Buktikan $P(1)$' },
                { en: 'Prove $P(n)$ directly, for every $n$ at once', id: 'Buktikan $P(n)$ secara langsung, untuk setiap $n$ sekaligus' },
              ],
              answer: 1,
              explain: {
                en: "That conditional, proved for an arbitrary (not a specific) $k$, is exactly what lets one true case knock over the next, forever — the engine of the whole method.",
                id: 'Kondisional itu, yang dibuktikan untuk $k$ sembarang (bukan yang tertentu), persis yang memungkinkan satu kasus yang benar merobohkan yang berikutnya, selamanya — mesin dari seluruh metode ini.',
              },
              hint: {
                en: 'The inductive step is a conditional statement, not a statement about one fixed number — reread the domino description for exactly what it claims.',
                id: 'Langkah induktif adalah pernyataan kondisional, bukan pernyataan tentang satu bilangan tetap — baca ulang deskripsi domino untuk tahu persis apa yang diklaimnya.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the two parts of a proof by induction.',
                id: 'Lengkapi dua bagian pembuktian dengan induksi.',
              },
              template: {
                en: 'The ___ shows $P(1)$ holds; the ___ shows $P(k) \\Rightarrow P(k+1)$ for arbitrary $k$.',
                id: '___ menunjukkan $P(1)$ berlaku; ___ menunjukkan $P(k) \\Rightarrow P(k+1)$ untuk $k$ sembarang.',
              },
              blanks: {
                en: ['base case', 'inductive step'],
                id: ['basis induksi', 'langkah induktif'],
              },
              explain: {
                en: 'Both parts are necessary and neither alone is sufficient — together they cover every natural number by a Modus-Ponens chain that never stops.',
                id: 'Kedua bagian sama-sama diperlukan dan tak satu pun sendiri cukup — bersama-sama keduanya mencakup setiap bilangan asli lewat rantai Modus Ponens yang tak pernah berhenti.',
              },
              hint: {
                en: 'One blank names the single starting fact; the other names the repeatable conditional that keeps the chain going.',
                id: 'Satu isian menyebut fakta awal tunggal; yang lain menyebut kondisional yang bisa diulang yang menjaga rantainya terus berjalan.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'The base case of "$1 + 2 + \\cdots + n = \\frac{n(n+1)}{2}$" checks $n = 1$: the left side is just $1$. What does the right side, $\\frac{n(n+1)}{2}$, give for $n = 1$?',
                id: 'Basis induksi untuk "$1 + 2 + \\cdots + n = \\frac{n(n+1)}{2}$" memeriksa $n = 1$: ruas kirinya adalah $1$ saja. Berapakah ruas kanannya, $\\frac{n(n+1)}{2}$, untuk $n = 1$?',
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: 'Substitute $n=1$ directly: $\\frac{1 \\cdot 2}{2}$.', id: 'Substitusikan langsung $n=1$: $\\frac{1 \\cdot 2}{2}$.' },
              ],
              explain: {
                en: '$\\frac{1 \\cdot 2}{2} = 1$, matching the left side — the base case holds.',
                id: '$\\frac{1 \\cdot 2}{2} = 1$, cocok dengan ruas kiri — basis induksinya berlaku.',
              },
            },
          ],
        },
        {
          id: 'log-m5-s3-l2',
          title: { en: 'Applying Induction to Sums and Divisibility', id: 'Menerapkan Induksi pada Jumlah dan Keterbagian' },
          goal: {
            en: 'Carry out the inductive step for a sum formula and for a divisibility claim.',
            id: 'Mengerjakan langkah induktif untuk rumus jumlah dan untuk klaim keterbagian.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'The inductive step for a sum', id: 'Langkah induktif untuk sebuah jumlah' },
              body: {
                en: 'For $P(n)$: "$1 + 2 + \\cdots + n = \\frac{n(n+1)}{2}$", the inductive step assumes $P(k)$ — the **induction hypothesis** — and must derive $P(k+1)$:\n$$1 + 2 + \\cdots + k = \\frac{k(k+1)}{2} \\quad \\text{(assumed)}$$\n$$1 + 2 + \\cdots + k + (k+1) = \\frac{k(k+1)}{2} + (k+1) \\quad \\text{(add } k+1 \\text{ to both sides)}$$\n$$= \\frac{k(k+1) + 2(k+1)}{2} = \\frac{(k+1)(k+2)}{2}$$\nThe last line is exactly $P(k+1)$: the formula with $n$ replaced by $k+1$. The trick every inductive step shares is right there in the middle line — use the induction hypothesis to replace the awkward part of $P(k+1)$\'s left side, then simplify with ordinary algebra.',
                id: 'Untuk $P(n)$: "$1 + 2 + \\cdots + n = \\frac{n(n+1)}{2}$", langkah induktif mengandaikan $P(k)$ — **hipotesis induksi** — dan harus menurunkan $P(k+1)$:\n$$1 + 2 + \\cdots + k = \\frac{k(k+1)}{2} \\quad \\text{(diandaikan)}$$\n$$1 + 2 + \\cdots + k + (k+1) = \\frac{k(k+1)}{2} + (k+1) \\quad \\text{(tambahkan } k+1 \\text{ ke kedua ruas)}$$\n$$= \\frac{k(k+1) + 2(k+1)}{2} = \\frac{(k+1)(k+2)}{2}$$\nBaris terakhir persis $P(k+1)$: rumusnya dengan $n$ diganti $k+1$. Trik yang dimiliki bersama oleh setiap langkah induktif ada persis di baris tengah: pakai hipotesis induksi untuk mengganti bagian canggung dari ruas kiri $P(k+1)$, lalu sederhanakan dengan aljabar biasa.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Induction proves divisibility too', id: 'Induksi juga membuktikan keterbagian' },
              body: {
                en: 'Induction is not only for sums. For $P(n)$: "$7^n - 1$ is divisible by $6$", the base case is $7^1 - 1 = 6$, divisible by $6$. The inductive step assumes $7^k - 1 = 6m$ for some integer $m$, and must show $7^{k+1} - 1$ is a multiple of $6$ too:\n$$7^{k+1} - 1 = 7 \\cdot 7^k - 1 = 7(7^k - 1) + 6 = 7(6m) + 6 = 6(7m + 1)$$\nEvery step here only used the induction hypothesis ($7^k - 1 = 6m$) and algebra — never a fresh fact about $7^{k+1}$ pulled from nowhere. That reuse of the assumed case is exactly what makes it an **inductive** step rather than a second, independent proof.',
                id: 'Induksi tak hanya untuk jumlah. Untuk $P(n)$: "$7^n - 1$ habis dibagi $6$", basis induksinya adalah $7^1 - 1 = 6$, habis dibagi $6$. Langkah induktif mengandaikan $7^k - 1 = 6m$ untuk suatu bilangan bulat $m$, dan harus menunjukkan $7^{k+1} - 1$ juga kelipatan $6$:\n$$7^{k+1} - 1 = 7 \\cdot 7^k - 1 = 7(7^k - 1) + 6 = 7(6m) + 6 = 6(7m + 1)$$\nSetiap langkah di sini hanya memakai hipotesis induksi ($7^k - 1 = 6m$) dan aljabar — tak pernah fakta baru tentang $7^{k+1}$ yang muncul entah dari mana. Pemakaian ulang kasus yang diandaikan itulah yang membuatnya langkah **induktif**, bukan pembuktian kedua yang berdiri sendiri.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'In the inductive step for the sum formula, what is added to both sides of the induction hypothesis?',
                id: 'Pada langkah induktif untuk rumus jumlah, apa yang ditambahkan ke kedua ruas hipotesis induksi?',
              },
              options: [
                { en: '$1$', id: '$1$' },
                { en: '$k$', id: '$k$' },
                { en: '$k + 1$', id: '$k + 1$' },
                { en: '$\\frac{k(k+1)}{2}$', id: '$\\frac{k(k+1)}{2}$' },
              ],
              answer: 2,
              explain: {
                en: 'Going from the sum up to $k$ to the sum up to $k+1$ means adding exactly the new last term, $k+1$, to both the sum and its claimed value.',
                id: 'Beralih dari jumlah sampai $k$ ke jumlah sampai $k+1$ berarti menambahkan tepat suku baru terakhirnya, $k+1$, ke jumlah dan ke nilai yang diklaimnya.',
              },
              hint: {
                en: 'Compare the left side of $P(k)$ with the left side of $P(k+1)$ — what single extra term does $P(k+1)$\'s sum have that $P(k)$\'s does not?',
                id: 'Bandingkan ruas kiri $P(k)$ dengan ruas kiri $P(k+1)$ — suku tambahan apa yang dimiliki jumlah $P(k+1)$ tetapi tidak dimiliki $P(k)$?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'In the divisibility proof, why is writing $7^k - 1 = 6m$ useful?',
                id: 'Pada pembuktian keterbagian, mengapa menulis $7^k - 1 = 6m$ berguna?',
              },
              options: [
                { en: 'It fixes a specific value of $k$', id: 'Ia menetapkan nilai $k$ tertentu' },
                { en: 'It lets $7^k - 1$ be replaced by a multiple of 6 inside the $k+1$ expression', id: 'Ia memungkinkan $7^k - 1$ diganti dengan kelipatan 6 di dalam ungkapan $k+1$' },
                { en: 'It proves the base case', id: 'Ia membuktikan basis induksi' },
                { en: 'It is not useful — it just restates the hypothesis', id: 'Tak berguna — hanya menyatakan ulang hipotesisnya' },
              ],
              answer: 1,
              explain: {
                en: 'Writing the hypothesis with an explicit $m$ turns an abstract assumption into an algebraic substitution: $7(7^k - 1)$ can be rewritten as $7(6m)$, which is visibly a multiple of 6 and lets the rest of the algebra go through.',
                id: 'Menulis hipotesisnya dengan $m$ yang eksplisit mengubah pengandaian yang abstrak menjadi substitusi aljabar: $7(7^k - 1)$ bisa ditulis ulang menjadi $7(6m)$, yang jelas kelipatan 6 dan membiarkan sisa aljabarnya berjalan.',
              },
              hint: {
                en: 'Look at how $m$ actually gets used a few lines later in the algebra — what does having an explicit multiple of 6 let you substitute?',
                id: 'Lihat bagaimana $m$ sebenarnya dipakai beberapa baris kemudian dalam aljabarnya — apa yang bisa disubstitusikan bila kamu punya kelipatan 6 yang eksplisit?',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: 'Put these lines in order for the inductive step proving $2 + 4 + \\cdots + 2n = n(n+1)$.',
                id: 'Susun baris-baris ini dengan urutan yang benar untuk langkah induktif membuktikan $2 + 4 + \\cdots + 2n = n(n+1)$.',
              },
              lines: {
                en: [
                  '\\text{Assume } 2 + 4 + \\cdots + 2k = k(k+1)',
                  '2 + 4 + \\cdots + 2k + 2(k+1) = k(k+1) + 2(k+1)',
                  '= (k+1)(k+2)',
                  '\\text{which is } P(k+1) \\text{: the formula with } n = k+1',
                ],
                id: [
                  '\\text{Andaikan } 2 + 4 + \\cdots + 2k = k(k+1)',
                  '2 + 4 + \\cdots + 2k + 2(k+1) = k(k+1) + 2(k+1)',
                  '= (k+1)(k+2)',
                  '\\text{yaitu } P(k+1) \\text{: rumusnya dengan } n = k+1',
                ],
              },
              explain: {
                en: 'State the induction hypothesis, add the new term $2(k+1)$ to both sides, factor, and recognise the result as $P(k+1)$.',
                id: 'Nyatakan hipotesis induksinya, tambahkan suku baru $2(k+1)$ ke kedua ruas, faktorkan, dan kenali hasilnya sebagai $P(k+1)$.',
              },
              hint: {
                en: 'This follows the exact same shape as the worked sum example: hypothesis, add the new term, simplify, recognise.',
                id: 'Ini mengikuti bentuk yang persis sama dengan contoh jumlah yang sudah dikerjakan: hipotesis, tambahkan suku baru, sederhanakan, kenali.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'For $P(n)$: "$3^n - 1$ is divisible by $2$", check the base case $n=1$: is $3^1 - 1$ divisible by 2? (Type 1 for yes, 0 for no.)',
                id: 'Untuk $P(n)$: "$3^n - 1$ habis dibagi $2$", periksa basis induksi $n=1$: apakah $3^1 - 1$ habis dibagi 2? (Ketik 1 untuk ya, 0 untuk tidak.)',
              },
              blanks: [{ answer: 1 }],
              hints: [
                { en: '$3^1 - 1 = 2$.', id: '$3^1 - 1 = 2$.' },
              ],
              explain: {
                en: '$3^1 - 1 = 2$, and $2$ is divisible by $2$ — the base case holds.',
                id: '$3^1 - 1 = 2$, dan $2$ habis dibagi $2$ — basis induksinya berlaku.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m5-s3-p',
        runtime: 'math',
        title: { en: 'Mathematical Induction', id: 'Induksi Matematika' },
        brief: {
          en: 'Check base cases and carry out one step of algebra in an inductive step.',
          id: 'Memeriksa basis induksi dan mengerjakan satu langkah aljabar dalam langkah induktif.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'For $P(n)$: "$1 + 3 + 5 + \\cdots + (2n-1) = n^2$", check the base case $n=1$: the left side is $1$. What does $n^2$ give for $n=1$?',
              id: 'Untuk $P(n)$: "$1 + 3 + 5 + \\cdots + (2n-1) = n^2$", periksa basis induksi $n=1$: ruas kirinya $1$. Berapakah $n^2$ untuk $n=1$?',
            },
            blanks: [{ answer: 1 }],
            solution: ['$1^2 = 1$, cocok dengan ruas kiri.'],
          },
          {
            prompt: {
              en: 'In the inductive step for the same formula, the induction hypothesis $1 + 3 + \\cdots + (2k-1) = k^2$ has $(2(k+1)-1) = 2k+1$ added to both sides, giving $k^2 + (2k+1)$. What is this equal to, as a single square?',
              id: 'Pada langkah induktif untuk rumus yang sama, hipotesis induksi $1 + 3 + \\cdots + (2k-1) = k^2$ ditambah $(2(k+1)-1) = 2k+1$ pada kedua ruas, menghasilkan $k^2 + (2k+1)$. Berapakah ini, sebagai satu bentuk kuadrat?',
            },
            blanks: [{ label: 'k^2 + 2k + 1 =', formula: '(k+1)^2', variable: 'k' }],
            solution: ['$k^2 + 2k + 1 = (k+1)^2$ — persis $P(k+1)$.'],
          },
          {
            prompt: {
              en: 'For $P(n)$: "$4^n - 1$ is divisible by $3$", check the base case: what is $4^1 - 1$?',
              id: 'Untuk $P(n)$: "$4^n - 1$ habis dibagi $3$", periksa basis induksinya: berapakah $4^1 - 1$?',
            },
            blanks: [{ answer: 3 }],
            solution: ['$4^1 - 1 = 3$, habis dibagi 3 — basis induksinya berlaku.'],
          },
        ],
        hints: [
          {
            en: 'For the middle part, this is exactly the perfect-square pattern $a^2 + 2a + 1 = (a+1)^2$ with $a = k$.',
            id: 'Untuk butir tengah, ini persis pola kuadrat sempurna $a^2 + 2a + 1 = (a+1)^2$ dengan $a = k$.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
