import type { Module } from '../types'

/** Module 6 — a physical model for two connectives at once. A switch is
 *  either closed (true) or open (false), and it turns out that wiring two
 *  switches in series behaves exactly like conjunction, and wiring them in
 *  parallel behaves exactly like disjunction — logic you can build. */
export const module6: Module = {
  id: 'log-m6',
  title: { en: 'Logic in Switching Circuits', id: 'Logika dalam Jaringan Listrik' },
  summary: {
    en: 'Series and parallel circuits as conjunction and disjunction, and simplifying a circuit with a logical equivalence.',
    id: 'Rangkaian seri dan paralel sebagai konjungsi dan disjungsi, serta menyederhanakan rangkaian dengan ekivalensi logis.',
  },
  submodules: [
    {
      id: 'log-m6-s1',
      title: { en: 'Series and Parallel Circuits', id: 'Rangkaian Seri dan Paralel' },
      summary: {
        en: 'Read a switching circuit as a compound statement, and use logic to build a smaller one that does the same job.',
        id: 'Membaca rangkaian saklar sebagai pernyataan majemuk, dan memakai logika untuk menyusun rangkaian lebih kecil yang bekerja sama.',
      },
      lessons: [
        {
          id: 'log-m6-s1-l1',
          title: { en: 'Series and Parallel as Connectives', id: 'Seri dan Paralel sebagai Kata Hubung' },
          goal: {
            en: 'Read a series circuit as a conjunction and a parallel circuit as a disjunction.',
            id: 'Membaca rangkaian seri sebagai konjungsi dan rangkaian paralel sebagai disjungsi.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Series: both, or the lamp stays dark', id: 'Seri: keduanya, atau lampunya tetap padam' },
              body: {
                en: 'A switch $p$ is **closed** (current can pass) or **open** (it cannot) — exactly the two values of a statement. Wire two switches $p$ and $q$ **in series**, one after the other along a single path, and current only reaches the lamp when it can get past both.\n$$\\text{Lampu menyala} \\iff p \\land q$$\nOpen either switch and the path is broken, however closed the other one is — precisely the row of $p \\land q$\'s table that a single false half already ruled out.',
                id: 'Sebuah saklar $p$ **tertutup** (arus bisa lewat) atau **terbuka** (tidak bisa) — persis dua nilai sebuah pernyataan. Rangkai dua saklar $p$ dan $q$ **seri**, satu demi satu pada satu jalur, dan arus hanya mencapai lampu bila bisa melewati keduanya.\n$$\\text{Lampu menyala} \\iff p \\land q$$\nBuka salah satu saklar dan jalurnya terputus, betapa pun tertutupnya saklar yang lain — persis baris tabel $p \\land q$ yang sudah disingkirkan oleh satu bagian yang salah saja.',
              },
              figure: {
                dim: 2,
                axes: false,
                xSpan: [-1, 9],
                ySpan: [-2, 2],
                items: [
                  { t: 'point', at: [-0.5, 0], label: 'Sumber', color: 'muted' },
                  { t: 'seg', from: [-0.5, 0], to: [2, 0], color: 'a' },
                  { t: 'point', at: [2, 0], label: 'p', color: 'a' },
                  { t: 'seg', from: [2, 0], to: [5, 0], color: 'a' },
                  { t: 'point', at: [5, 0], label: 'q', color: 'a' },
                  { t: 'seg', from: [5, 0], to: [8, 0], color: 'a' },
                  { t: 'point', at: [8, 0], label: 'Lampu', color: 'muted' },
                ],
                caption: {
                  en: 'Switches $p$ and $q$ share a single path: current visits $p$, then $q$, then the lamp. Both have to be closed.',
                  id: 'Saklar $p$ dan $q$ berbagi satu jalur: arus melewati $p$, lalu $q$, lalu lampu. Keduanya harus tertutup.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Parallel: either one keeps the lamp lit', id: 'Paralel: salah satu saja membuat lampu tetap menyala' },
              body: {
                en: 'Wire the same two switches **in parallel**, side by side on two separate paths that share the same two ends, and current only needs one open route.\n$$\\text{Lampu menyala} \\iff p \\lor q$$\nBoth switches would have to be open at once to break every path — exactly the single row that makes $p \\lor q$ false.',
                id: 'Rangkai kedua saklar yang sama **paralel**, berdampingan pada dua jalur terpisah yang berbagi kedua ujung yang sama, dan arus hanya butuh satu rute yang terbuka.\n$$\\text{Lampu menyala} \\iff p \\lor q$$\nKedua saklar harus sama-sama terbuka sekaligus untuk memutus semua jalur — persis satu baris yang membuat $p \\lor q$ salah.',
              },
              figure: {
                dim: 2,
                axes: false,
                xSpan: [-1, 9],
                ySpan: [-2, 2],
                items: [
                  { t: 'point', at: [-0.5, 0], label: 'Sumber', color: 'muted' },
                  { t: 'seg', from: [-0.5, 0], to: [0, 0], color: 'a' },
                  { t: 'seg', from: [0, 0], to: [0, 1], color: 'a' },
                  { t: 'seg', from: [0, 0], to: [0, -1], color: 'b' },
                  { t: 'seg', from: [0, 1], to: [3, 1], color: 'a' },
                  { t: 'point', at: [3, 1], label: 'p', color: 'a' },
                  { t: 'seg', from: [3, 1], to: [6, 1], color: 'a' },
                  { t: 'seg', from: [0, -1], to: [3, -1], color: 'b' },
                  { t: 'point', at: [3, -1], label: 'q', color: 'b' },
                  { t: 'seg', from: [3, -1], to: [6, -1], color: 'b' },
                  { t: 'seg', from: [6, 1], to: [6, 0], color: 'a' },
                  { t: 'seg', from: [6, -1], to: [6, 0], color: 'b' },
                  { t: 'seg', from: [6, 0], to: [8, 0], color: 'muted' },
                  { t: 'point', at: [8, 0], label: 'Lampu', color: 'muted' },
                ],
                caption: {
                  en: 'Switches $p$ and $q$ sit on two separate paths between the same source and the same lamp. Either path being open is enough.',
                  id: 'Saklar $p$ dan $q$ berada pada dua jalur terpisah di antara sumber dan lampu yang sama. Salah satu jalur yang terbuka saja sudah cukup.',
                },
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'In a series circuit with switches $p$ and $q$, $p$ is closed and $q$ is open. Does the lamp light up?',
                id: 'Pada rangkaian seri dengan saklar $p$ dan $q$, $p$ tertutup dan $q$ terbuka. Apakah lampunya menyala?',
              },
              options: [
                { en: 'Yes, since one switch is closed', id: 'Ya, karena satu saklar tertutup' },
                { en: 'No, since the path is broken at $q$', id: 'Tidak, karena jalurnya terputus di $q$' },
                { en: 'Yes, always, regardless of the switches', id: 'Ya, selalu, apa pun keadaan saklarnya' },
                { en: 'Cannot be determined', id: 'Tak dapat ditentukan' },
              ],
              answer: 1,
              explain: {
                en: 'Series wiring is $p \\land q$, and $q$ being open (false) alone breaks the whole conjunction — exactly the way one false half kills a conjunction regardless of the other.',
                id: 'Pengawatan seri adalah $p \\land q$, dan $q$ yang terbuka (salah) saja sudah mematahkan seluruh konjungsinya — persis seperti satu bagian yang salah mematikan konjungsi apa pun keadaan bagian lain.',
              },
              hint: {
                en: 'A series circuit needs every switch on the path closed. Does having just one of two closed satisfy that?',
                id: 'Rangkaian seri butuh setiap saklar pada jalurnya tertutup. Apakah memiliki hanya satu dari dua yang tertutup memenuhi itu?',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'In a parallel circuit with switches $p$ and $q$, $p$ is closed and $q$ is open. Does the lamp light up?',
                id: 'Pada rangkaian paralel dengan saklar $p$ dan $q$, $p$ tertutup dan $q$ terbuka. Apakah lampunya menyala?',
              },
              options: [
                { en: 'Yes, since one path is still open', id: 'Ya, karena satu jalur masih terbuka' },
                { en: 'No, since $q$ is open', id: 'Tidak, karena $q$ terbuka' },
                { en: 'No, both must be closed', id: 'Tidak, keduanya harus tertutup' },
                { en: 'Cannot be determined', id: 'Tak dapat ditentukan' },
              ],
              answer: 0,
              explain: {
                en: 'Parallel wiring is $p \\lor q$, and $p$ closed alone is enough — current takes the path through $p$, regardless of $q$.',
                id: 'Pengawatan paralel adalah $p \\lor q$, dan $p$ yang tertutup saja sudah cukup — arus melewati jalur lewat $p$, apa pun keadaan $q$.',
              },
              hint: {
                en: 'A parallel circuit only needs one of its two paths open. Is the path through $p$ open here?',
                id: 'Rangkaian paralel hanya butuh salah satu dari dua jalurnya terbuka. Apakah jalur lewat $p$ terbuka di sini?',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the description of each circuit type.',
                id: 'Lengkapi deskripsi tiap jenis rangkaian.',
              },
              template: {
                en: 'A ___ circuit behaves like a conjunction; a ___ circuit behaves like a disjunction.',
                id: 'Rangkaian ___ berperilaku seperti konjungsi; rangkaian ___ berperilaku seperti disjungsi.',
              },
              blanks: {
                en: ['series', 'parallel'],
                id: ['seri', 'paralel'],
              },
              explain: {
                en: 'One shared path needing every switch closed is "and"; separate paths needing only one closed is "or".',
                id: 'Satu jalur bersama yang butuh setiap saklar tertutup adalah "dan"; jalur terpisah yang hanya butuh satu tertutup adalah "atau".',
              },
              hint: {
                en: 'Match each wiring style to the connective whose truth table needs the same number of true parts to succeed.',
                id: 'Cocokkan tiap gaya pengawatan dengan penghubung yang tabel kebenarannya butuh jumlah bagian benar yang sama untuk berhasil.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A parallel circuit has switches $p$ and $q$, giving $4$ possible open/closed combinations. In how many of them does the lamp light up?',
                id: 'Rangkaian paralel punya saklar $p$ dan $q$, memberi $4$ kemungkinan kombinasi terbuka/tertutup. Pada berapa banyak di antaranya lampunya menyala?',
              },
              blanks: [{ answer: 3 }],
              hints: [
                { en: 'The lamp lights up in every combination except the one where both switches are open.', id: 'Lampunya menyala pada setiap kombinasi kecuali yang keduanya sama-sama terbuka.' },
              ],
              explain: {
                en: 'This is exactly $p \\lor q$\'s own table: true in 3 of its 4 rows, false only when both are open.',
                id: 'Ini persis tabel $p \\lor q$ sendiri: benar pada 3 dari 4 barisnya, salah hanya ketika keduanya sama-sama terbuka.',
              },
            },
          ],
        },
        {
          id: 'log-m6-s1-l2',
          title: { en: 'Building and Simplifying a Circuit', id: 'Menyusun dan Menyederhanakan Rangkaian' },
          goal: {
            en: 'Turn a compound statement into a circuit, and use a logical equivalence to build a smaller one.',
            id: 'Mengubah pernyataan majemuk menjadi rangkaian, dan memakai ekivalensi logis untuk menyusun rangkaian lebih kecil.',
          },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'Reading an expression as wiring', id: 'Membaca ungkapan sebagai pengawatan' },
              body: {
                en: 'Any compound statement built from $\\land$ and $\\lor$ can be built as a circuit: $\\land$ means "in series", $\\lor$ means "in parallel", and parentheses mean "wire this whole sub-circuit as one piece". $p \\land (q \\lor r)$ is switch $p$ in series with a parallel pair of $q$ and $r$ — three switches in total.\n\nNegation has a physical picture too: a **normally-closed switch** for $\\neg p$ stays closed until $p$\'s own switch is closed, at which point it opens — wired so it is on exactly when $p$ is off.',
                id: 'Pernyataan majemuk apa pun yang dibangun dari $\\land$ dan $\\lor$ bisa disusun sebagai rangkaian: $\\land$ berarti "seri", $\\lor$ berarti "paralel", dan tanda kurung berarti "kawatkan seluruh sub-rangkaian ini sebagai satu kesatuan". $p \\land (q \\lor r)$ adalah saklar $p$ yang diseri dengan pasangan paralel $q$ dan $r$ — tiga saklar seluruhnya.\n\nNegasi juga punya gambaran fisiknya: sebuah **saklar normal-tertutup** untuk $\\neg p$ tetap tertutup sampai saklar $p$ sendiri tertutup, saat itulah ia terbuka — dikawatkan sehingga ia menyala tepat ketika $p$ mati.',
              },
              figure: {
                dim: 2,
                axes: false,
                xSpan: [-1, 10],
                ySpan: [-2, 2],
                items: [
                  { t: 'point', at: [-0.5, 0], label: 'Sumber', color: 'muted' },
                  { t: 'seg', from: [-0.5, 0], to: [1.5, 0], color: 'a' },
                  { t: 'point', at: [1.5, 0], label: 'p', color: 'a' },
                  { t: 'seg', from: [1.5, 0], to: [3, 0], color: 'a' },
                  { t: 'seg', from: [3, 0], to: [3, 1], color: 'b' },
                  { t: 'seg', from: [3, 0], to: [3, -1], color: 'c' },
                  { t: 'seg', from: [3, 1], to: [6, 1], color: 'b' },
                  { t: 'point', at: [6, 1], label: 'q', color: 'b' },
                  { t: 'seg', from: [6, 1], to: [9, 1], color: 'b' },
                  { t: 'seg', from: [3, -1], to: [6, -1], color: 'c' },
                  { t: 'point', at: [6, -1], label: 'r', color: 'c' },
                  { t: 'seg', from: [6, -1], to: [9, -1], color: 'c' },
                  { t: 'seg', from: [9, 1], to: [9, 0], color: 'b' },
                  { t: 'seg', from: [9, -1], to: [9, 0], color: 'c' },
                  { t: 'seg', from: [9, 0], to: [10, 0], color: 'muted' },
                  { t: 'point', at: [10, 0], label: 'Lampu', color: 'muted' },
                ],
                caption: {
                  en: '$p \\land (q \\lor r)$: $p$ alone on its own path in series with a parallel pair of $q$ and $r$.',
                  id: '$p \\land (q \\lor r)$: $p$ sendiri pada jalurnya sendiri, diseri dengan pasangan paralel $q$ dan $r$.',
                },
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'The same job, fewer switches', id: 'Pekerjaan yang sama, saklar lebih sedikit' },
              body: {
                en: 'A logical equivalence lets a circuit be redesigned without changing what it does. The **distributive law**\n$$(p \\land q) \\lor (p \\land r) \\equiv p \\land (q \\lor r)$$\nreads, on the left, as **four** switches — two copies of $p$, one $q$, one $r$, wired as two series branches in parallel. The right side is the very circuit drawn above: only **three** switches, one copy of $p$ each. Since the two sides are logically equivalent, the smaller circuit lights the lamp under exactly the same conditions as the larger one — proving an equivalence is exactly proving a circuit can be simplified without changing its behaviour.',
                id: 'Sebuah ekivalensi logis memungkinkan sebuah rangkaian dirancang ulang tanpa mengubah kerjanya. **Hukum distributif**\n$$(p \\land q) \\lor (p \\land r) \\equiv p \\land (q \\lor r)$$\npada ruas kiri terbaca sebagai **empat** saklar — dua salinan $p$, satu $q$, satu $r$, dikawatkan sebagai dua cabang seri yang diparalel. Ruas kanan adalah persis rangkaian yang digambar di atas: hanya **tiga** saklar, satu salinan $p$ saja. Karena kedua ruasnya ekivalen secara logis, rangkaian yang lebih kecil menyalakan lampu pada kondisi yang persis sama dengan yang lebih besar — membuktikan sebuah ekivalensi persis membuktikan sebuah rangkaian bisa disederhanakan tanpa mengubah perilakunya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'What circuit does $(p \\lor q) \\land r$ describe?',
                id: 'Rangkaian apa yang digambarkan oleh $(p \\lor q) \\land r$?',
              },
              options: [
                { en: 'A parallel pair of $p$ and $q$, in series with $r$', id: 'Pasangan paralel $p$ dan $q$, diseri dengan $r$' },
                { en: 'Three switches all in series', id: 'Tiga saklar seluruhnya diseri' },
                { en: 'Three switches all in parallel', id: 'Tiga saklar seluruhnya diparalel' },
                { en: 'A series pair of $p$ and $q$, in parallel with $r$', id: 'Pasangan seri $p$ dan $q$, diparalel dengan $r$' },
              ],
              answer: 0,
              explain: {
                en: 'The parenthesised $p \\lor q$ is one parallel sub-circuit, and the outer $\\land$ puts that whole sub-circuit in series with $r$.',
                id: '$p \\lor q$ yang berkurung adalah satu sub-rangkaian paralel, dan $\\land$ terluarnya menaruh seluruh sub-rangkaian itu diseri dengan $r$.',
              },
              hint: {
                en: 'Work from the parentheses outward: build the inner sub-circuit first, then wire the outer connective around the whole thing.',
                id: 'Kerjakan dari tanda kurung ke luar: bangun dulu sub-rangkaian di dalamnya, lalu kawatkan penghubung terluarnya di sekeliling keseluruhannya.',
              },
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: {
                en: 'Using the distributive law, how many switches does the smallest circuit for $(p \\land q) \\lor (p \\land r)$ actually need?',
                id: 'Dengan hukum distributif, berapa banyak saklar yang sebenarnya dibutuhkan rangkaian terkecil untuk $(p \\land q) \\lor (p \\land r)$?',
              },
              options: [
                { en: '4', id: '4' },
                { en: '3', id: '3' },
                { en: '2', id: '2' },
                { en: '5', id: '5' },
              ],
              answer: 1,
              explain: {
                en: 'The equivalent form $p \\land (q \\lor r)$ needs only one $p$, one $q$, and one $r$ — three switches, down from the four the original expression seems to ask for.',
                id: 'Bentuk ekivalennya $p \\land (q \\lor r)$ hanya butuh satu $p$, satu $q$, dan satu $r$ — tiga saklar, turun dari empat yang seolah diminta oleh ungkapan aslinya.',
              },
              hint: {
                en: 'Rewrite the expression using the distributive law first, then count how many distinct letters appear in the rewritten form.',
                id: 'Tulis ulang dulu ungkapannya memakai hukum distributif, lalu hitung berapa banyak huruf berbeda yang muncul pada bentuk yang sudah ditulis ulang.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              math: true,
              prompt: {
                en: "Put these lines in order to simplify the switch count for $(p \\land \\neg p) \\lor q$ using the fact that $p \\land \\neg p$ is a contradiction.",
                id: 'Susun baris-baris ini dengan urutan yang benar untuk menyederhanakan banyaknya saklar bagi $(p \\land \\neg p) \\lor q$ dengan memakai fakta bahwa $p \\land \\neg p$ kontradiksi.',
              },
              lines: {
                en: [
                  '(p \\land \\neg p) \\lor q',
                  '\\equiv S \\lor q \\quad \\text{(a contradiction is always false)}',
                  '\\equiv q',
                ],
                id: [
                  '(p \\land \\neg p) \\lor q',
                  '\\equiv S \\lor q \\quad \\text{(kontradiksi selalu salah)}',
                  '\\equiv q',
                ],
              },
              explain: {
                en: 'A branch that is a contradiction contributes nothing to a disjunction — it can be replaced by "always false", and "false or q" is just q. The circuit for $p \\land \\neg p$ can be removed entirely, since it never lets current through anyway.',
                id: 'Cabang yang berupa kontradiksi tak menyumbang apa-apa pada disjungsi — ia bisa diganti dengan "selalu salah", dan "salah atau q" hanyalah q. Rangkaian untuk $p \\land \\neg p$ bisa dihilangkan sama sekali, karena ia memang tak pernah meloloskan arus.',
              },
              hint: {
                en: 'Replace the contradiction with its known constant truth value first, then simplify the disjunction that is left.',
                id: 'Ganti dulu kontradiksinya dengan nilai kebenaran tetapnya yang sudah diketahui, lalu sederhanakan disjungsi yang tersisa.',
              },
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: {
                en: 'A circuit for $(p \\land q \\land r) \\lor (p \\land q \\land s)$ uses $6$ switches as written. Using $p \\land q \\land (r \\lor s)$ instead, how many switches are needed?',
                id: 'Rangkaian untuk $(p \\land q \\land r) \\lor (p \\land q \\land s)$ memakai $6$ saklar sebagaimana ditulis. Dengan memakai $p \\land q \\land (r \\lor s)$ sebagai gantinya, berapa banyak saklar yang dibutuhkan?',
              },
              blanks: [{ answer: 4 }],
              hints: [
                { en: 'Count the distinct letters in the simplified expression: p, q, r, and s.', id: 'Hitung huruf-huruf berbeda pada ungkapan yang sudah disederhanakan: p, q, r, dan s.' },
              ],
              explain: {
                en: 'The simplified form needs one copy each of $p$, $q$, $r$, $s$ — four switches, two fewer than the six the unsimplified expression seems to need.',
                id: 'Bentuk yang disederhanakan hanya butuh satu salinan masing-masing $p$, $q$, $r$, $s$ — empat saklar, dua lebih sedikit dari enam yang seolah dibutuhkan ungkapan yang belum disederhanakan.',
              },
            },
          ],
        },
      ],
      project: {
        id: 'log-m6-s1-p',
        runtime: 'math',
        title: { en: 'Circuits as Logic', id: 'Rangkaian sebagai Logika' },
        brief: {
          en: 'Evaluate whether a lamp lights up, and count switches saved by simplifying a circuit.',
          id: 'Menentukan apakah lampu menyala, dan menghitung saklar yang dihemat dengan menyederhanakan rangkaian.',
        },
        requirements: [
          { en: 'Every box has to be right before a part counts as answered.', id: 'Setiap kotak harus benar sebelum satu butir dihitung terjawab.' },
          { en: 'Answer 1 for "lights up" / true, 0 for "stays dark" / false.', id: 'Jawab 1 untuk "menyala" / benar, 0 untuk "tetap padam" / salah.' },
        ],
        tasks: [
          {
            prompt: {
              en: 'A circuit is wired as $p \\land (q \\lor r)$. With $p$ closed, $q$ open, $r$ closed, does the lamp light up?',
              id: 'Sebuah rangkaian dikawatkan sebagai $p \\land (q \\lor r)$. Dengan $p$ tertutup, $q$ terbuka, $r$ tertutup, apakah lampunya menyala?',
            },
            blanks: [{ answer: 1 }],
            solution: ['$q \\lor r$ benar ($r$ tertutup), dan $p$ tertutup, jadi $p \\land (q \\lor r)$ benar — lampunya menyala.'],
          },
          {
            prompt: {
              en: 'Same wiring, $p \\land (q \\lor r)$. With $p$ open, $q$ closed, $r$ closed, does the lamp light up?',
              id: 'Pengawatan yang sama, $p \\land (q \\lor r)$. Dengan $p$ terbuka, $q$ tertutup, $r$ tertutup, apakah lampunya menyala?',
            },
            blanks: [{ answer: 0 }],
            solution: ['$p$ terbuka sudah cukup mematahkan seluruh konjungsinya, apa pun keadaan $q$ dan $r$ — lampunya tetap padam.'],
          },
          {
            prompt: {
              en: 'A circuit for $(p \\land r) \\lor (q \\land r)$ uses 4 switches as written. Its equivalent form $(p \\lor q) \\land r$ needs how many?',
              id: 'Rangkaian untuk $(p \\land r) \\lor (q \\land r)$ memakai 4 saklar sebagaimana ditulis. Bentuk ekivalennya $(p \\lor q) \\land r$ butuh berapa saklar?',
            },
            blanks: [{ answer: 3 }],
            solution: ['Bentuk ekivalennya hanya butuh satu $p$, satu $q$, satu $r$ — tiga saklar.'],
          },
        ],
        hints: [
          {
            en: 'Evaluate the inner parenthesised part first in each case, exactly the way you would evaluate any compound statement.',
            id: 'Tentukan dulu bagian dalam tanda kurung pada tiap kasus, persis seperti caramu menilai pernyataan majemuk apa pun.',
          },
        ],
        xp: 50,
      },
    },
  ],
}
