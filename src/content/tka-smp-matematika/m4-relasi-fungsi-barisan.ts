import type { Loc, Module } from '../types'
import type { Figure, FigItem } from '../../lib/figure'
import type { Piece } from './figs'
import { arrowDiagram, barChart, fit, line, lineChart, numberLine, rectPts, solid, txt } from './figs'

/** Module 4 — relations and functions (domain, codomain, range; arrow diagram,
 *  pairs, table, graph; f(x) = ax + b), then finite arithmetic and geometric
 *  sequences and their finite series. Everything stops at a last term: no
 *  infinite series. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

/** A coordinate plane with the numbers on the axes; the scale is equal on both axes
 *  unless the aspect ratio has to be clamped. */
const plane = (x: [number, number], y: [number, number], items: FigItem[]): Figure => ({
  dim: 2,
  xSpan: x,
  ySpan: y,
  aspect: Math.max(0.5, Math.min(3, (x[1] - x[0]) / (y[1] - y[0]))),
  ticks: true,
  items,
})

/** Patterns of matchstick squares in a row: `counts[i]` squares in pattern i+1. Every
 *  stick is drawn, so the sticks can be counted: k squares use 3k + 1 sticks. */
function stickSquares(counts: number[]): Piece {
  const items: FigItem[] = []
  let x0 = 0
  counts.forEach((k, idx) => {
    for (let i = 0; i < k; i++) {
      items.push(line([x0 + i, 1], [x0 + i + 1, 1], 'b', { width: 4 }))
      items.push(line([x0 + i, 0], [x0 + i + 1, 0], 'b', { width: 4 }))
    }
    for (let i = 0; i <= k; i++) items.push(line([x0 + i, 0], [x0 + i, 1], 'b', { width: 4 }))
    items.push(txt(x0 + k / 2, -0.7, String(idx + 1), 'md', 'muted'))
    x0 += k + 1.5
  })
  return { dim: 2, axes: false, ...fit([[-0.2, -1.2], [x0 - 1.5 + 0.2, 1.3]], 0.4), items }
}

/** Rows of unit squares, row r (from the bottom) holding `rows - r` squares. */
function staircase(rows: number): Piece {
  const items: FigItem[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < rows - r; c++) items.push(solid(rectPts(c, r, 1, 1), r % 2 === 0 ? 'a' : 'c'))
  }
  return { dim: 2, axes: false, ...fit([[0, 0], [rows, rows]], 0.5), items }
}

/** Gauss pairing for 1 + 2 + ... + 2m: the first m numbers on top, the others below in reverse. */
function gaussPairs(m: number): Piece {
  const items: FigItem[] = []
  const total = 2 * m + 1
  for (let i = 0; i < m; i++) {
    const x = i * 1.8
    items.push(txt(x, 2, String(i + 1), 'lg', 'a'))
    items.push(txt(x, 0, String(2 * m - i), 'lg', 'b'))
    items.push(line([x, 0.5], [x, 1.5], 'muted', { width: 2 }))
    items.push(txt(x, -1.2, String(total), 'lg', 'result'))
  }
  return { dim: 2, axes: false, ...fit([[-0.8, -1.9], [(m - 1) * 1.8 + 0.8, 2.7]], 0.4), items }
}

/* -------------------------------------------------------------- module */

export const module4: Module = {
  id: 'tka-smp-m4',
  title: L('Relations, Functions, Sequences and Series', 'Relasi, Fungsi, Barisan, dan Deret'),
  summary: L(
    'Pair the members of two sets, tell functions from other relations, use the rule f(x) = ax + b with tables and graphs, and work with finite arithmetic and geometric sequences and their sums.',
    'Memasangkan anggota dua himpunan, membedakan fungsi dari relasi lain, memakai rumus f(x) = ax + b beserta tabel dan grafiknya, serta mengolah barisan aritmetika dan geometri berhingga beserta jumlahnya.',
  ),
  submodules: [
    /* ================================================= S1: relations and functions */
    {
      id: 'tka-smp-m4-s1',
      title: L('Relations and Functions', 'Relasi dan Fungsi'),
      summary: L(
        'Show a relation as arrows, pairs, a table and a graph; name its domain, codomain and range; decide when it is a function; and use the rule f(x) = ax + b.',
        'Menyajikan relasi dengan diagram panah, pasangan berurutan, tabel, dan grafik; menyebut daerah asal, kodomain, dan daerah hasilnya; menentukan kapan relasi adalah fungsi; serta memakai rumus f(x) = ax + b.',
      ),
      lessons: [
        /* ------------------------------------------------ S1 L1 relations */
        {
          id: 'tka-smp-m4-s1-l1',
          title: L('Relations and How to Show Them', 'Relasi dan Cara Menyajikannya'),
          goal: L(
            'You can show a relation in four ways, name its domain, codomain and range, and decide whether it is a function.',
            'Kamu bisa menyajikan relasi dengan empat cara, menyebut daerah asal, kodomain, dan daerah hasilnya, serta menentukan apakah relasi itu fungsi.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Pairing Two Sets', 'Ayo Amati: Memasangkan Dua Himpunan'),
              body: L(
                'Ani asks four friends for their favourite fruit and writes each answer next to the name. Every friend is **paired** with a fruit. A pairing between the members of one set and the members of another set is called a **relation**.\n\nNow a relation between numbers. Let $A=\\{1,2,3,4\\}$ and $B=\\{2,4,6,8,10\\}$, and pair every number of $A$ with its double in $B$. The same relation can be shown in four ways:\n\n- **Arrow diagram:** an arrow goes from each member of $A$ to its partner in $B$ (see the picture).\n- **Ordered pairs:** $\\{(1,2),(2,4),(3,6),(4,8)\\}$. In $(1,2)$ the first number comes from $A$ and the second from $B$.\n- **Table:** the pairs are written in two rows, as below.\n- **Graph:** every pair is a point on a plane. We draw it in the next step.\n\n| $x$ (from $A$) | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| $y$ (from $B$) | 2 | 4 | 6 | 8 |',
                'Ani menanyakan buah kesukaan empat temannya dan menulis setiap jawaban di samping namanya. Setiap teman **dipasangkan** dengan satu buah. Pemasangan antara anggota suatu himpunan dan anggota himpunan lain disebut **relasi**.\n\nSekarang relasi antar bilangan. Misalkan $A=\\{1,2,3,4\\}$ dan $B=\\{2,4,6,8,10\\}$, lalu pasangkan setiap bilangan di $A$ dengan dua kalinya di $B$. Relasi yang sama dapat disajikan dengan empat cara:\n\n- **Diagram panah:** panah dari setiap anggota $A$ ke pasangannya di $B$ (lihat gambar).\n- **Pasangan berurutan:** $\\{(1,2),(2,4),(3,6),(4,8)\\}$. Pada $(1,2)$ bilangan pertama berasal dari $A$ dan bilangan kedua dari $B$.\n- **Tabel:** pasangannya ditulis dalam dua baris, seperti di bawah.\n- **Grafik:** setiap pasangan menjadi satu titik pada bidang. Kita menggambarnya di langkah berikutnya.\n\n| $x$ (dari $A$) | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| $y$ (dari $B$) | 2 | 4 | 6 | 8 |',
              ),
              figure: {
                ...arrowDiagram({
                  domain: ['1', '2', '3', '4'],
                  codomain: ['2', '4', '6', '8', '10'],
                  pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
                  titles: ['A', 'B'],
                }),
                caption: L(
                  'An arrow diagram: each number of A points to its double in B.',
                  'Diagram panah: setiap bilangan di A menunjuk ke dua kalinya di B.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Domain, Codomain and Range', 'Contoh Bertahap: Daerah Asal, Kodomain, dan Daerah Hasil'),
              body: L(
                'Take the same relation. On the graph, each pair $(x,y)$ is a dot: $x$ is the number from $A$ and $y$ is its partner in $B$.\n\n1. Step 1: The **domain** is the set where the arrows start: $A=\\{1,2,3,4\\}$.\n2. Step 2: The **codomain** is the whole set the arrows may land in: $B=\\{2,4,6,8,10\\}$.\n3. Step 3: The **range** has only the members of $B$ that an arrow really reaches: $\\{2,4,6,8\\}$.\n4. Step 4: The number 10 is in the codomain, but no arrow ends there, so it is NOT in the range.\n\n**Remember:**\n\n| Name | Meaning | In this example |\n|---|---|---|\n| Domain | the inputs: where arrows start | $\\{1,2,3,4\\}$ |\n| Codomain | the whole target set: every output that is allowed | $\\{2,4,6,8,10\\}$ |\n| Range | the outputs that are really used | $\\{2,4,6,8\\}$ |',
                'Ambil relasi yang sama. Pada grafik, setiap pasangan $(x,y)$ adalah satu titik: $x$ adalah bilangan dari $A$ dan $y$ adalah pasangannya di $B$.\n\n1. Langkah 1: **Daerah asal** (domain) adalah himpunan tempat panah berawal: $A=\\{1,2,3,4\\}$.\n2. Langkah 2: **Daerah kawan** (kodomain) adalah seluruh himpunan tujuan panah: $B=\\{2,4,6,8,10\\}$.\n3. Langkah 3: **Daerah hasil** (range) hanya berisi anggota $B$ yang benar-benar dicapai panah: $\\{2,4,6,8\\}$.\n4. Langkah 4: Bilangan 10 ada di kodomain, tetapi tidak ada panah yang berakhir di sana, jadi 10 BUKAN anggota daerah hasil.\n\n**Ingat:**\n\n| Nama | Arti | Pada contoh ini |\n|---|---|---|\n| Daerah asal | masukan: tempat panah berawal | $\\{1,2,3,4\\}$ |\n| Kodomain | seluruh himpunan tujuan: semua keluaran yang diperbolehkan | $\\{2,4,6,8,10\\}$ |\n| Daerah hasil | keluaran yang benar-benar terpakai | $\\{2,4,6,8\\}$ |',
              ),
              figure: {
                ...plane([-1, 6], [-1, 10], [
                  { t: 'dot', x: 1, y: 2, label: '(1,2)', color: 'a' },
                  { t: 'dot', x: 2, y: 4, label: '(2,4)', color: 'a' },
                  { t: 'dot', x: 3, y: 6, label: '(3,6)', color: 'a' },
                  { t: 'dot', x: 4, y: 8, label: '(4,8)', color: 'a' },
                ]),
                caption: L(
                  'The same relation as a graph: one dot for each ordered pair.',
                  'Relasi yang sama sebagai grafik: satu titik untuk setiap pasangan berurutan.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Range, Codomain and Functions', 'Awas, Jebakan!: Daerah Hasil, Kodomain, dan Fungsi'),
              body: L(
                'A relation is a **function** when every member of the domain has exactly one partner. On a graph, use the **vertical line test**: if every vertical line crosses the graph at most once, it is a function.\n\n| Wrong | Right |\n|---|---|\n| The range of the relation above is $\\{2,4,6,8,10\\}$ (the whole codomain was copied) | The range is $\\{2,4,6,8\\}$: only the outputs that an arrow really reaches |\n| $\\{(1,2),(1,3),(2,4)\\}$ is a function, because every number has an arrow | Not a function: the input 1 has two outputs, 2 and 3 |\n| $\\{(1,5),(2,5),(3,5)\\}$ is not a function, because 5 appears three times | It is a function: different inputs may share one output. Only one INPUT with two outputs is forbidden |',
                'Relasi disebut **fungsi** jika setiap anggota daerah asal punya tepat satu pasangan. Pada grafik, pakai **uji garis vertikal**: jika setiap garis vertikal memotong grafik paling banyak satu kali, grafik itu fungsi.\n\n| Salah | Benar |\n|---|---|\n| Daerah hasil relasi di atas adalah $\\{2,4,6,8,10\\}$ (seluruh kodomain disalin) | Daerah hasilnya $\\{2,4,6,8\\}$: hanya keluaran yang benar-benar dicapai panah |\n| $\\{(1,2),(1,3),(2,4)\\}$ adalah fungsi, karena setiap bilangan punya panah | Bukan fungsi: masukan 1 punya dua keluaran, yaitu 2 dan 3 |\n| $\\{(1,5),(2,5),(3,5)\\}$ bukan fungsi, karena 5 muncul tiga kali | Itu fungsi: masukan yang berbeda boleh punya keluaran yang sama. Yang dilarang hanya SATU masukan dengan dua keluaran |',
              ),
              figure: {
                ...plane([-1, 6], [-1, 7], [
                  { t: 'vline', x: 2, color: 'result', dashed: true },
                  { t: 'dot', x: 1, y: 2, color: 'a' },
                  { t: 'dot', x: 2, y: 1, color: 'a' },
                  { t: 'dot', x: 2, y: 5, color: 'a' },
                  { t: 'dot', x: 4, y: 4, color: 'a' },
                ]),
                caption: L(
                  'The dashed vertical line touches two dots: the input 2 has two outputs, so this is not a function.',
                  'Garis vertikal putus-putus menyentuh dua titik: masukan 2 punya dua keluaran, jadi ini bukan fungsi.',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The arrow diagram shows the relation "is one less than" from $A$ to $B$. What is the range?',
                'Diagram panah menunjukkan relasi "satu kurangnya dari" dari $A$ ke $B$. Berapa daerah hasilnya?',
              ),
              figure: {
                ...arrowDiagram({
                  domain: ['1', '2', '3'],
                  codomain: ['2', '3', '4', '5', '6'],
                  pairs: [[0, 0], [1, 1], [2, 2]],
                  titles: ['A', 'B'],
                }),
                caption: L('Follow every arrow from A to B.', 'Ikuti setiap panah dari A ke B.'),
              },
              options: [
                L('$\\{2,3,4\\}$', '$\\{2,3,4\\}$'),
                L('$\\{2,3,4,5,6\\}$', '$\\{2,3,4,5,6\\}$'),
                L('$\\{1,2,3\\}$', '$\\{1,2,3\\}$'),
                L('$\\{5,6\\}$', '$\\{5,6\\}$'),
              ],
              answer: 0,
              explain: L(
                'The range holds only the members of $B$ that an arrow reaches: 2, 3 and 4. The whole set $B$ is the codomain, $A$ is the domain, and $\\{5,6\\}$ are the members that no arrow reaches.',
                'Daerah hasil hanya berisi anggota $B$ yang dicapai panah: 2, 3, dan 4. Seluruh himpunan $B$ adalah kodomain, $A$ adalah daerah asal, dan $\\{5,6\\}$ adalah anggota yang tidak dicapai panah.',
              ),
              hint: L(
                'Follow each arrow to its tip and write down only the numbers where an arrow ends.',
                'Ikuti setiap panah sampai ujungnya dan catat hanya bilangan tempat panah berakhir.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: from $A=\\{1,2,3\\}$, every number $x$ is paired with $2x+1$. Complete the ordered pairs.',
                'Coba bersama: dari $A=\\{1,2,3\\}$, setiap bilangan $x$ dipasangkan dengan $2x+1$. Lengkapi pasangan berurutannya.',
              ),
              template: '(1,\\ ___),\\ (2,\\ ___),\\ (3,\\ ___)',
              blanks: ['3', '5', '7'],
              explain: L(
                '$2\\times1+1=3$, $2\\times2+1=5$ and $2\\times3+1=7$. So the relation is $\\{(1,3),(2,5),(3,7)\\}$.',
                '$2\\times1+1=3$, $2\\times2+1=5$, dan $2\\times3+1=7$. Jadi relasinya $\\{(1,3),(2,5),(3,7)\\}$.',
              ),
              hint: L(
                'For each pair, put the first number in place of $x$ in $2x+1$: multiply by 2, then add 1.',
                'Untuk setiap pasangan, ganti $x$ pada $2x+1$ dengan bilangan pertama: kalikan 2, lalu tambah 1.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Look at this arrow diagram from $A$ to $B$. Which statement is correct?',
                'Perhatikan diagram panah dari $A$ ke $B$ ini. Pernyataan mana yang benar?',
              ),
              figure: {
                ...arrowDiagram({
                  domain: ['1', '2', '3'],
                  codomain: ['2', '4', '6', '8'],
                  pairs: [[0, 0], [1, 1], [1, 2], [2, 3]],
                  titles: ['A', 'B'],
                }),
                caption: L('One number of A has two arrows.', 'Satu bilangan di A punya dua panah.'),
              },
              options: [
                L('It is not a function, because the number 2 has two partners (4 and 6)', 'Bukan fungsi, karena bilangan 2 punya dua pasangan (4 dan 6)'),
                L('It is a function, because every number of $A$ has at least one arrow', 'Fungsi, karena setiap bilangan di $A$ punya setidaknya satu panah'),
                L('It is not a function, because $B$ has more members than $A$', 'Bukan fungsi, karena $B$ punya lebih banyak anggota daripada $A$'),
                L('It is a function, because no number of $B$ receives two arrows', 'Fungsi, karena tidak ada bilangan di $B$ yang menerima dua panah'),
              ],
              answer: 0,
              explain: L(
                'A function needs exactly one arrow from every member of the domain. The input 2 has two arrows, so it breaks the rule. Having extra members in $B$ is allowed, and so is a member of $B$ with two arrows coming in.',
                'Fungsi membutuhkan tepat satu panah dari setiap anggota daerah asal. Masukan 2 punya dua panah, jadi aturannya dilanggar. Anggota $B$ yang berlebih boleh ada, dan anggota $B$ yang menerima dua panah juga boleh.',
              ),
              hint: L(
                'Count the arrows that leave each number of $A$. Is there exactly one for every number?',
                'Hitung panah yang keluar dari setiap bilangan di $A$. Apakah setiap bilangan punya tepat satu?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('$\\{(1,4),(2,4),(3,5)\\}$ is a function.', '$\\{(1,4),(2,4),(3,5)\\}$ adalah fungsi.'),
                L('$\\{(1,2),(1,3),(2,4)\\}$ is a function.', '$\\{(1,2),(1,3),(2,4)\\}$ adalah fungsi.'),
                L('In a function, every member of the domain has exactly one partner.', 'Pada fungsi, setiap anggota daerah asal punya tepat satu pasangan.'),
                L('The range is always the same set as the codomain.', 'Daerah hasil selalu sama dengan kodomain.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'In the first set every input (1, 2, 3) has one output, and two inputs may share the output 4. In the second set the input 1 has two outputs. The range can be smaller than the codomain when some members of the codomain are not reached.',
                'Pada himpunan pertama setiap masukan (1, 2, 3) punya satu keluaran, dan dua masukan boleh punya keluaran 4 yang sama. Pada himpunan kedua masukan 1 punya dua keluaran. Daerah hasil bisa lebih kecil daripada kodomain jika ada anggota kodomain yang tidak dicapai.',
              ),
              hint: L(
                'For a set of pairs, look at the first numbers. Does any first number appear twice with different partners?',
                'Untuk himpunan pasangan, lihat bilangan pertamanya. Apakah ada bilangan pertama yang muncul dua kali dengan pasangan berbeda?',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Each set below is a relation written as ordered pairs. Choose the TWO sets that are functions.',
                'Setiap himpunan di bawah adalah relasi yang ditulis sebagai pasangan berurutan. Pilih DUA himpunan yang merupakan fungsi.',
              ),
              options: [
                L('$\\{(1,3),(2,3),(3,3)\\}$', '$\\{(1,3),(2,3),(3,3)\\}$'),
                L('$\\{(0,1),(1,2),(2,5),(3,10)\\}$', '$\\{(0,1),(1,2),(2,5),(3,10)\\}$'),
                L('$\\{(2,1),(2,2),(3,3)\\}$', '$\\{(2,1),(2,2),(3,3)\\}$'),
                L('$\\{(1,4),(2,5),(1,6)\\}$', '$\\{(1,4),(2,5),(1,6)\\}$'),
              ],
              answer: [0, 1],
              explain: L(
                'The first two sets never use the same first number twice, so each input has one output. The other two sets use a first number twice with different second numbers (2 with 1 and 2, and 1 with 4 and 6).',
                'Dua himpunan pertama tidak pernah memakai bilangan pertama yang sama dua kali, jadi setiap masukan punya satu keluaran. Dua himpunan lainnya memakai satu bilangan pertama dua kali dengan bilangan kedua berbeda (2 dengan 1 dan 2, serta 1 dengan 4 dan 6).',
              ),
              hint: L(
                'List the first number of every pair. A set is a function only if no first number repeats with a different second number.',
                'Tulis bilangan pertama dari setiap pasangan. Himpunan adalah fungsi hanya jika tidak ada bilangan pertama yang berulang dengan bilangan kedua yang berbeda.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Mr. Eko draws a relation from $A=\\{1,2,3,4\\}$ to $B=\\{1,2,3,\\ldots,12\\}$. Every number $x$ of $A$ is paired with $3x-1$. How many members does the range have, and how many members of the codomain are NOT in the range?',
                'Pak Eko menggambar relasi dari $A=\\{1,2,3,4\\}$ ke $B=\\{1,2,3,\\ldots,12\\}$. Setiap bilangan $x$ di $A$ dipasangkan dengan $3x-1$. Berapa anggota daerah hasilnya, dan berapa anggota kodomain yang BUKAN anggota daerah hasil?',
              ),
              blanks: [
                { label: { en: '\\text{range} =', id: '\\text{daerah hasil} =' }, answer: 4, after: { en: '\\text{ members}', id: '\\text{ anggota}' } },
                { label: { en: '\\text{not in range} =', id: '\\text{bukan daerah hasil} =' }, answer: 8, after: { en: '\\text{ members}', id: '\\text{ anggota}' } },
              ],
              hints: [
                L(
                  'The range is made of the outputs. Work out the partner of every number in $A$ first.',
                  'Daerah hasil terdiri dari keluaran. Hitung dulu pasangan dari setiap bilangan di $A$.',
                ),
                L(
                  'Replace $x$ in $3x-1$ by 1, 2, 3 and 4. Count the different results: that is the size of the range.',
                  'Ganti $x$ pada $3x-1$ dengan 1, 2, 3, dan 4. Hitung hasil yang berbeda: itulah banyak anggota daerah hasil.',
                ),
                L(
                  'The codomain $B$ has 12 members. Subtract the number of members of the range from 12 to get the members that are not reached.',
                  'Kodomain $B$ punya 12 anggota. Kurangkan banyak anggota daerah hasil dari 12 untuk mendapat anggota yang tidak dicapai.',
                ),
              ],
              explain: L(
                'The partners are 2, 5, 8 and 11, so the range has 4 members. The codomain has 12 members, and $12-4=8$ of them are never reached.',
                'Pasangannya adalah 2, 5, 8, dan 11, jadi daerah hasil punya 4 anggota. Kodomain punya 12 anggota, dan $12-4=8$ di antaranya tidak pernah dicapai.',
              ),
              solution: {
                en: ['x=1: 3(1)-1=2 \\quad x=2: 3(2)-1=5', 'x=3: 3(3)-1=8 \\quad x=4: 3(4)-1=11', '\\text{range}=\\{2,5,8,11\\}: 4', '12-4=8'],
                id: ['x=1: 3(1)-1=2 \\quad x=2: 3(2)-1=5', 'x=3: 3(3)-1=8 \\quad x=4: 3(4)-1=11', '\\text{daerah hasil}=\\{2,5,8,11\\}: 4', '12-4=8'],
              },
            },
          ],
        },
        /* ------------------------------------------ S1 L2 functions */
        {
          id: 'tka-smp-m4-s1-l2',
          title: L('Functions: Rule, Table and Graph', 'Fungsi: Rumus, Tabel, dan Grafik'),
          goal: L(
            'You can use f(x) = ax + b: find outputs and inputs, make a table, read and draw the graph, and write the rule from two values.',
            'Kamu bisa memakai f(x) = ax + b: mencari keluaran dan masukan, membuat tabel, membaca dan menggambar grafik, serta menuliskan rumus dari dua nilai.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: A Function Is a Machine', 'Ayo Amati: Fungsi Itu Seperti Mesin'),
              body: L(
                'A **function** is a rule that gives exactly one output for every input. Think of a machine: you put in a number $x$, it doubles the number and adds 3.\n\nWe name the machine $f$ and write its rule as $f(x)=2x+3$.\n\n- $x$ is the **input**. $f(x)$, read "f of x", is the **output**.\n- To find $f(4)$, replace every $x$ by 4: $f(4)=2\\times4+3=11$.\n- A rule of the form $f(x)=ax+b$ is a **linear function**: its graph is a straight line.\n\nA table lists inputs with their outputs.\n\n| $x$ | $-2$ | $-1$ | 0 | 1 | 2 |\n|---|---|---|---|---|---|\n| $f(x)$ | $-1$ | 1 | 3 | 5 | 7 |',
                '**Fungsi** adalah aturan yang memberi tepat satu keluaran untuk setiap masukan. Bayangkan sebuah mesin: kamu memasukkan bilangan $x$, mesin menggandakannya lalu menambah 3.\n\nMesin itu kita beri nama $f$ dan aturannya ditulis $f(x)=2x+3$.\n\n- $x$ adalah **masukan**. $f(x)$, dibaca "f dari x", adalah **keluaran**.\n- Untuk mencari $f(4)$, ganti setiap $x$ dengan 4: $f(4)=2\\times4+3=11$.\n- Aturan berbentuk $f(x)=ax+b$ disebut **fungsi linear**: grafiknya berupa garis lurus.\n\nTabel mendaftar masukan beserta keluarannya.\n\n| $x$ | $-2$ | $-1$ | 0 | 1 | 2 |\n|---|---|---|---|---|---|\n| $f(x)$ | $-1$ | 1 | 3 | 5 | 7 |',
              ),
              figure: {
                ...arrowDiagram({
                  domain: ['0', '1', '2', '3'],
                  codomain: ['3', '5', '7', '9'],
                  pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
                  titles: ['x', 'f(x)'],
                }),
                caption: L(
                  'The machine f(x) = 2x + 3 sends every input to one output.',
                  'Mesin f(x) = 2x + 3 mengirim setiap masukan ke satu keluaran.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Table and Graph', 'Contoh Bertahap: Tabel dan Grafik'),
              body: L(
                'Let us draw the graph of $f(x)=2x+3$.\n\n1. Step 1: Choose some inputs, for example $x=-2,-1,0,1,2$.\n2. Step 2: Work out each output: $f(-2)=2(-2)+3=-1$, $f(-1)=1$, $f(0)=3$, $f(1)=5$, $f(2)=7$.\n3. Step 3: Each pair $(x,f(x))$ is a point. Plot $(-2,-1)$, $(-1,1)$, $(0,3)$, $(1,5)$ and $(2,7)$.\n4. Step 4: Join the points. They lie on one straight line.\n\n**Remember:**\n\n- The line crosses the $y$-axis at $(0,b)$. Here it is $(0,3)$.\n- Each step of 1 to the right makes the output change by $a$. Here the line goes up by 2.\n- To find the input for a given output, solve an equation. For $f(x)=9$: $2x+3=9$, so $2x=6$ and $x=3$.',
                'Mari kita gambar grafik $f(x)=2x+3$.\n\n1. Langkah 1: Pilih beberapa masukan, misalnya $x=-2,-1,0,1,2$.\n2. Langkah 2: Hitung setiap keluaran: $f(-2)=2(-2)+3=-1$, $f(-1)=1$, $f(0)=3$, $f(1)=5$, $f(2)=7$.\n3. Langkah 3: Setiap pasangan $(x,f(x))$ adalah satu titik. Gambar $(-2,-1)$, $(-1,1)$, $(0,3)$, $(1,5)$, dan $(2,7)$.\n4. Langkah 4: Hubungkan titik-titiknya. Semuanya terletak pada satu garis lurus.\n\n**Ingat:**\n\n- Garis memotong sumbu $y$ di $(0,b)$. Di sini $(0,3)$.\n- Setiap bergeser 1 ke kanan, keluaran berubah sebesar $a$. Di sini garis naik 2.\n- Untuk mencari masukan dari keluaran tertentu, selesaikan persamaan. Untuk $f(x)=9$: $2x+3=9$, jadi $2x=6$ dan $x=3$.',
              ),
              figure: {
                ...plane([-4, 4], [-2, 10], [
                  { t: 'curve', f: '2*x+3', color: 'a' },
                  { t: 'dot', x: -2, y: -1, color: 'result' },
                  { t: 'dot', x: -1, y: 1, color: 'result' },
                  { t: 'dot', x: 0, y: 3, color: 'result' },
                  { t: 'dot', x: 1, y: 5, color: 'result' },
                  { t: 'dot', x: 2, y: 7, color: 'result' },
                ]),
                caption: L(
                  'The five points of the table lie on the graph of f(x) = 2x + 3.',
                  'Kelima titik pada tabel terletak pada grafik f(x) = 2x + 3.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: f(x) Is Not f Times x', 'Awas, Jebakan!: f(x) Bukan f Dikali x'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| $f(x)$ means $f\\times x$, so $f(4)=f\\times4$ | $f(x)$ is the name of the output. $f(4)=2\\times4+3=11$ |\n| $f(-2)=2-2+3=3$ (the multiplication was lost) | $f(-2)=2\\times(-2)+3=-1$ (use brackets for a negative input) |\n| $f(x)=13$, so $x=13$ | $f(x)=13$ means the OUTPUT is 13. Solve $2x+3=13$: $x=5$ |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| $f(x)$ berarti $f\\times x$, jadi $f(4)=f\\times4$ | $f(x)$ adalah nama keluaran. $f(4)=2\\times4+3=11$ |\n| $f(-2)=2-2+3=3$ (perkaliannya hilang) | $f(-2)=2\\times(-2)+3=-1$ (pakai tanda kurung untuk masukan negatif) |\n| $f(x)=13$, jadi $x=13$ | $f(x)=13$ berarti KELUARANNYA 13. Selesaikan $2x+3=13$: $x=5$ |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The rule of a function is $f(x)=3x-4$. What is $f(5)$?',
                'Rumus sebuah fungsi adalah $f(x)=3x-4$. Berapa $f(5)$?',
              ),
              options: [
                L('$11$', '$11$'),
                L('$15$', '$15$'),
                L('$-17$', '$-17$'),
                L('$1$', '$1$'),
              ],
              answer: 0,
              explain: L(
                'Replace $x$ by 5: $f(5)=3\\times5-4=15-4=11$. The answer 15 forgets to subtract 4, $-17$ comes from computing $3-4\\times5$, and 1 comes from $5-4$ with the 3 forgotten.',
                'Ganti $x$ dengan 5: $f(5)=3\\times5-4=15-4=11$. Jawaban 15 lupa mengurangi 4, $-17$ berasal dari $3-4\\times5$, dan 1 berasal dari $5-4$ dengan 3 yang terlupa.',
              ),
              hint: L(
                'Put 5 in the place of $x$, multiply by 3 first, and subtract 4 last.',
                'Tempatkan 5 pada posisi $x$, kalikan 3 dulu, lalu kurangi 4 terakhir.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: for $f(x)=2x+3$, find the input $x$ whose output is 13. Subtract 3 from both sides, then divide by 2.',
                'Coba bersama: untuk $f(x)=2x+3$, cari masukan $x$ yang keluarannya 13. Kurangi kedua ruas dengan 3, lalu bagi dengan 2.',
              ),
              template: '2x+3=13 \\quad 2x=13-3=___ \\quad x=___ \\div 2=___',
              blanks: ['10', '10', '5'],
              explain: L(
                'Subtracting 3 gives $2x=10$, and dividing both sides by 2 gives $x=5$. Check: $f(5)=2\\times5+3=13$.',
                'Dikurangi 3 menghasilkan $2x=10$, dan membagi kedua ruas dengan 2 menghasilkan $x=5$. Periksa: $f(5)=2\\times5+3=13$.',
              ),
              hint: L(
                'First undo the "+3", then undo the "$\\times2$". The result of the subtraction is the very number you then divide by 2.',
                'Batalkan dulu "+3", lalu batalkan "$\\times2$". Hasil pengurangan itulah bilangan yang kemudian dibagi 2.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The graph shows a linear function $f$. Use the graph to find $f(2)$.',
                'Grafik menunjukkan fungsi linear $f$. Gunakan grafik untuk mencari $f(2)$.',
              ),
              figure: {
                ...plane([-3, 5], [-3, 9], [
                  { t: 'curve', f: '2*x+1', color: 'a' },
                  { t: 'dot', x: 0, y: 1, label: 'P', color: 'result' },
                  { t: 'dot', x: 1, y: 3, label: 'Q', color: 'result' },
                ]),
                caption: L(
                  'A straight line through the points P and Q.',
                  'Garis lurus yang melalui titik P dan Q.',
                ),
              },
              options: [
                L('$5$', '$5$'),
                L('$2$', '$2$'),
                L('$3$', '$3$'),
                L('$7$', '$7$'),
              ],
              answer: 0,
              explain: L(
                'Go to $x=2$ on the horizontal axis and up to the line: the height is 5. The value 2 is the input, 3 is $f(1)$ and 7 is $f(3)$.',
                'Pergi ke $x=2$ pada sumbu mendatar lalu naik ke garis: tingginya 5. Nilai 2 adalah masukan, 3 adalah $f(1)$, dan 7 adalah $f(3)$.',
              ),
              hint: L(
                'The input is on the horizontal axis. Find $x=2$, go up to the line, and read the height on the vertical axis.',
                'Masukan ada di sumbu mendatar. Cari $x=2$, naik ke garis, lalu baca tingginya pada sumbu tegak.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('The rule is $f(x)=4x-1$. Decide whether each statement is True or False.', 'Rumusnya $f(x)=4x-1$. Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('$f(2)=7$', '$f(2)=7$'),
                L('$f(-1)=3$', '$f(-1)=3$'),
                L('If $f(x)=11$, then $x=3$.', 'Jika $f(x)=11$, maka $x=3$.'),
                L('$f(x)$ means "$f$ times $x$".', '$f(x)$ berarti "$f$ dikali $x$".'),
              ],
              answer: [true, false, true, false],
              explain: L(
                '$f(2)=4\\times2-1=7$ is true. $f(-1)=4\\times(-1)-1=-5$, not 3. From $4x-1=11$ we get $4x=12$ and $x=3$. And $f(x)$ is a name for the output, not a product.',
                '$f(2)=4\\times2-1=7$ benar. $f(-1)=4\\times(-1)-1=-5$, bukan 3. Dari $4x-1=11$ diperoleh $4x=12$ dan $x=3$. Dan $f(x)$ adalah nama keluaran, bukan hasil kali.',
              ),
              hint: L(
                'Test each statement by replacing $x$ in $4x-1$. For the third one, solve $4x-1=11$.',
                'Uji setiap pernyataan dengan mengganti $x$ pada $4x-1$. Untuk yang ketiga, selesaikan $4x-1=11$.',
              ),
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Step by Step: A Function from a Story', 'Contoh Bertahap: Fungsi dari Sebuah Cerita'),
              body: L(
                'A taxi charges a starting fee of Rp5,000 plus Rp3,000 for every kilometre. For $x$ km the fare in rupiah is $f(x)=3\\,000x+5\\,000$. For example, $f(4)=3\\,000\\times4+5\\,000=17\\,000$.\n\nNow the other way round: we know two values and want the rule $f(x)=ax+b$. Suppose $f(2)=11\\,000$ and $f(4)=17\\,000$.\n\n1. Step 1: From 2 km to 4 km the fare rises by $17\\,000-11\\,000=6\\,000$, for $4-2=2$ extra km. So $a=6\\,000\\div2=3\\,000$.\n2. Step 2: Put $x=2$ in $f(x)=3\\,000x+b$: $3\\,000\\times2+b=11\\,000$, so $b=5\\,000$.\n3. Step 3: Write the rule: $f(x)=3\\,000x+5\\,000$.\n\n**Remember:**\n\n- $a$ tells how much the output changes when the input goes up by 1.\n- $b$ is the output when the input is 0, the starting amount.',
                'Sebuah taksi menarik biaya awal Rp5.000 ditambah Rp3.000 untuk setiap kilometer. Untuk $x$ km, ongkos dalam rupiah adalah $f(x)=3\\,000x+5\\,000$. Contohnya, $f(4)=3\\,000\\times4+5\\,000=17\\,000$.\n\nSekarang sebaliknya: kita tahu dua nilai dan ingin mencari rumus $f(x)=ax+b$. Misalkan $f(2)=11\\,000$ dan $f(4)=17\\,000$.\n\n1. Langkah 1: Dari 2 km ke 4 km ongkos naik $17\\,000-11\\,000=6\\,000$, untuk tambahan $4-2=2$ km. Jadi $a=6\\,000\\div2=3\\,000$.\n2. Langkah 2: Masukkan $x=2$ ke $f(x)=3\\,000x+b$: $3\\,000\\times2+b=11\\,000$, jadi $b=5\\,000$.\n3. Langkah 3: Tulis rumusnya: $f(x)=3\\,000x+5\\,000$.\n\n**Ingat:**\n\n- $a$ menyatakan seberapa besar keluaran berubah ketika masukan naik 1.\n- $b$ adalah keluaran ketika masukan 0, yaitu jumlah awal.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A mall charges a parking fee that is a linear function of the hours parked. Let $f(x)$ be the fee in thousand rupiah for $x$ hours. Parking for 2 hours costs Rp5,000 and parking for 5 hours costs Rp11,000, so $f(2)=5$ and $f(5)=11$. Write the rule $f(x)$, then find the fee in thousand rupiah for 8 hours.',
                'Sebuah mal menarik biaya parkir yang merupakan fungsi linear dari lama parkir. Misalkan $f(x)$ adalah biaya dalam ribu rupiah untuk $x$ jam. Parkir 2 jam membayar Rp5.000 dan parkir 5 jam membayar Rp11.000, jadi $f(2)=5$ dan $f(5)=11$. Tuliskan rumus $f(x)$, lalu cari biaya dalam ribu rupiah untuk 8 jam.',
              ),
              blanks: [
                { label: 'f(x) =', formula: '2*x+1', variable: 'x', domain: [0, 12] },
                { label: 'f(8) =', answer: 17, after: { en: '\\text{ thousand rupiah}', id: '\\text{ ribu rupiah}' } },
              ],
              hints: [
                L(
                  'Two values are known. How much does the fee change when the hours go from 2 to 5, and how many extra hours is that?',
                  'Dua nilai sudah diketahui. Berapa perubahan biaya ketika jam naik dari 2 ke 5, dan berapa jam tambahannya?',
                ),
                L(
                  'The number $a$ is (change in fee) $\\div$ (change in hours). Then use $f(2)=5$ in $f(x)=ax+b$ to find $b$.',
                  'Bilangan $a$ adalah (perubahan biaya) $\\div$ (perubahan jam). Lalu pakai $f(2)=5$ pada $f(x)=ax+b$ untuk mencari $b$.',
                ),
                L(
                  'Work out $a=6\\div3$ first, then solve $2a+b=5$ for $b$. Finally put $x=8$ into your rule.',
                  'Hitung dulu $a=6\\div3$, lalu selesaikan $2a+b=5$ untuk $b$. Terakhir, masukkan $x=8$ ke rumusmu.',
                ),
              ],
              explain: L(
                'The fee rises by $11-5=6$ for $5-2=3$ extra hours, so $a=2$. Then $2\\times2+b=5$ gives $b=1$, so $f(x)=2x+1$ and $f(8)=2\\times8+1=17$ thousand rupiah, which is Rp17,000.',
                'Biaya naik $11-5=6$ untuk tambahan $5-2=3$ jam, jadi $a=2$. Lalu $2\\times2+b=5$ memberi $b=1$, sehingga $f(x)=2x+1$ dan $f(8)=2\\times8+1=17$ ribu rupiah, yaitu Rp17.000.',
              ),
              solution: ['a=\\frac{11-5}{5-2}=\\frac{6}{3}=2', '2\\times2+b=5 \\Rightarrow b=1', 'f(x)=2x+1', 'f(8)=2\\times8+1=17'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m4-s1-p',
        runtime: 'math',
        title: L('Relations and Functions in Action', 'Relasi dan Fungsi dalam Aksi'),
        brief: L(
          'Read an arrow diagram, evaluate a function, build a rule from a story and from a graph.',
          'Membaca diagram panah, menghitung nilai fungsi, dan menyusun rumus dari cerita dan dari grafik.',
        ),
        requirements: [
          L('Name the domain, codomain and range of a relation and decide whether it is a function.', 'Menyebut daerah asal, kodomain, dan daerah hasil suatu relasi serta menentukan apakah relasi itu fungsi.'),
          L('Use f(x) = ax + b: evaluate it, solve for the input and write the rule from two values.', 'Memakai f(x) = ax + b: menghitung nilainya, mencari masukan, dan menuliskan rumus dari dua nilai.'),
        ],
        hints: [
          L('For a relation, the range only holds the outputs that an arrow reaches.', 'Pada relasi, daerah hasil hanya berisi keluaran yang dicapai panah.'),
          L('To find the input for a given output, write an equation and undo the operations one by one.', 'Untuk mencari masukan dari keluaran tertentu, tulis persamaan lalu batalkan operasinya satu per satu.'),
          L('To write the rule from two values, first find $a$ as change in output divided by change in input, then find $b$.', 'Untuk menuliskan rumus dari dua nilai, cari dulu $a$ sebagai perubahan keluaran dibagi perubahan masukan, lalu cari $b$.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Look at the arrow diagram. How many members does the range have, and how many members of the codomain are NOT in the range?',
              'Perhatikan diagram panah. Berapa anggota daerah hasilnya, dan berapa anggota kodomain yang BUKAN anggota daerah hasil?',
            ),
            figure: {
              ...arrowDiagram({
                domain: ['1', '2', '3', '4'],
                codomain: ['3', '5', '7', '9', '11'],
                pairs: [[0, 0], [1, 1], [2, 2], [3, 3]],
                titles: ['A', 'B'],
              }),
              caption: L('A relation from A to B.', 'Sebuah relasi dari A ke B.'),
            },
            inline: true,
            blanks: [
              { label: { en: '\\text{range} =', id: '\\text{daerah hasil} =' }, answer: 4 },
              { label: { en: '\\text{not in range} =', id: '\\text{bukan daerah hasil} =' }, answer: 1 },
            ],
            solution: {
              en: ['\\text{range}=\\{3,5,7,9\\}: 4 \\text{ members}', '\\text{codomain}=\\{3,5,7,9,11\\}: 5 \\text{ members}', '5-4=1'],
              id: ['\\text{daerah hasil}=\\{3,5,7,9\\}: 4 \\text{ anggota}', '\\text{kodomain}=\\{3,5,7,9,11\\}: 5 \\text{ anggota}', '5-4=1'],
            },
          },
          {
            prompt: L(
              'The rule of a function is $f(x)=5x-7$. Find $f(4)$, and find the input $x$ whose output is 18.',
              'Rumus sebuah fungsi adalah $f(x)=5x-7$. Cari $f(4)$, dan cari masukan $x$ yang keluarannya 18.',
            ),
            inline: true,
            blanks: [
              { label: 'f(4) =', answer: 13 },
              { label: { en: '\\text{input for output 18: } x =', id: '\\text{masukan untuk keluaran 18: } x =' }, answer: 5 },
            ],
            solution: ['f(4)=5\\times4-7=13', '5x-7=18', '5x=25', 'x=5'],
          },
          {
            prompt: L(
              'An online motorbike taxi charges a fare that is a linear function of the distance. Let $f(x)$ be the fare in thousand rupiah for $x$ km. A trip of 4 km costs Rp16,000 and a trip of 10 km costs Rp28,000. Write the rule $f(x)$, then find the fare in thousand rupiah for 7 km.',
              'Sebuah ojek daring menarik ongkos yang merupakan fungsi linear dari jarak. Misalkan $f(x)$ adalah ongkos dalam ribu rupiah untuk $x$ km. Perjalanan 4 km membayar Rp16.000 dan perjalanan 10 km membayar Rp28.000. Tuliskan rumus $f(x)$, lalu cari ongkos dalam ribu rupiah untuk 7 km.',
            ),
            blanks: [
              { label: 'f(x) =', formula: '2*x+8', variable: 'x', domain: [0, 20] },
              { label: 'f(7) =', answer: 22, after: { en: '\\text{ thousand rupiah}', id: '\\text{ ribu rupiah}' } },
            ],
            solution: ['a=\\frac{28-16}{10-4}=\\frac{12}{6}=2', '2\\times4+b=16 \\Rightarrow b=8', 'f(x)=2x+8', 'f(7)=2\\times7+8=22'],
          },
          {
            prompt: L(
              'The graph is of a linear function $f$. Find $f(0)$, and find the number $k$ for which $f(k)=15$.',
              'Grafik berikut adalah grafik fungsi linear $f$. Cari $f(0)$, dan cari bilangan $k$ yang memenuhi $f(k)=15$.',
            ),
            figure: {
              ...plane([-2, 9], [-3, 17], [
                { t: 'curve', f: '2*x+1', color: 'a' },
                { t: 'dot', x: 1, y: 3, label: 'P', color: 'result' },
                { t: 'dot', x: 3, y: 7, label: 'Q', color: 'result' },
              ]),
              caption: L('The line passes through P and Q.', 'Garis melalui titik P dan Q.'),
            },
            inline: true,
            blanks: [
              { label: 'f(0) =', answer: 1 },
              { label: 'k =', answer: 7 },
            ],
            solution: ['P(1,3),\\ Q(3,7): a=\\frac{7-3}{3-1}=2', '2\\times1+b=3 \\Rightarrow b=1: f(x)=2x+1,\\ f(0)=1', '2k+1=15', 'k=7'],
          },
        ],
      },
    },

    /* ================================================= S2: sequences and series */
    {
      id: 'tka-smp-m4-s2',
      title: L('Sequences and Series', 'Barisan dan Deret'),
      summary: L(
        'Arithmetic and geometric sequences with their n-th term, and the sum of a finite number of terms.',
        'Barisan aritmetika dan geometri beserta suku ke-n, serta jumlah sejumlah suku yang berhingga.',
      ),
      lessons: [
        /* ------------------------------------------- S2 L1 sequences */
        {
          id: 'tka-smp-m4-s2-l1',
          title: L('Arithmetic and Geometric Sequences', 'Barisan Aritmetika dan Geometri'),
          goal: L(
            'You can tell an arithmetic sequence from a geometric one, find any term, and count the terms of a finite sequence.',
            'Kamu bisa membedakan barisan aritmetika dari barisan geometri, mencari suku mana pun, dan menghitung banyak suku barisan berhingga.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Lists with a Pattern', 'Ayo Amati: Daftar Bilangan Berpola'),
              body: L(
                'A **sequence** is a list of numbers in a fixed order. Each number is a **term**: $U_1$ is the first term, $U_2$ the second, and $U_n$ the $n$-th term. The first term is also called $a$. A **finite** sequence stops at a last term.\n\nLook at two sequences:\n\n- $3, 7, 11, 15,\\ldots$ Each term is the one before **plus 4**. This is an **arithmetic sequence** with common difference $b=4$.\n- $2, 6, 18, 54,\\ldots$ Each term is the one before **times 3**. This is a **geometric sequence** with common ratio $r=3$.\n\nThe picture shows the first sequence on a number line: every jump has the same size.',
                '**Barisan** adalah daftar bilangan dengan urutan tetap. Setiap bilangan disebut **suku**: $U_1$ suku pertama, $U_2$ suku kedua, dan $U_n$ suku ke-$n$. Suku pertama juga ditulis $a$. Barisan **berhingga** berhenti pada suku terakhir.\n\nPerhatikan dua barisan:\n\n- $3, 7, 11, 15,\\ldots$ Setiap suku adalah suku sebelumnya **ditambah 4**. Ini **barisan aritmetika** dengan beda $b=4$.\n- $2, 6, 18, 54,\\ldots$ Setiap suku adalah suku sebelumnya **dikali 3**. Ini **barisan geometri** dengan rasio $r=3$.\n\nGambar menunjukkan barisan pertama pada garis bilangan: setiap lompatan sama besar.',
              ),
              figure: {
                ...numberLine({
                  from: 1,
                  to: 16,
                  step: 1,
                  marks: [{ at: 3, color: 'a' }, { at: 7, color: 'a' }, { at: 11, color: 'a' }, { at: 15, color: 'a' }],
                  jumps: [
                    { from: 3, to: 7, label: '+4' },
                    { from: 7, to: 11, label: '+4' },
                    { from: 11, to: 15, label: '+4' },
                  ],
                }),
                caption: L(
                  'The terms 3, 7, 11, 15 on a number line: each jump is +4.',
                  'Suku-suku 3, 7, 11, 15 pada garis bilangan: setiap lompatan +4.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: The n-th Term', 'Contoh Bertahap: Suku ke-n'),
              body: L(
                'Find the 20th term of $5, 8, 11, 14,\\ldots$\n\n1. Step 1: Find $a$ and $b$. The first term is $a=5$. The difference is $8-5=3$, so $b=3$ (check: $11-8=3$).\n2. Step 2: Write the formula $U_n=a+(n-1)b=5+(n-1)\\times3$.\n3. Step 3: Put $n=20$: $U_{20}=5+19\\times3$.\n4. Step 4: Calculate: $U_{20}=5+57=62$.\n\n**Remember:**\n\n| Idea | Arithmetic | Geometric |\n|---|---|---|\n| Each term from the one before | add $b$ | multiply by $r$ |\n| The $n$-th term | $U_n=a+(n-1)b$ | $U_n=a\\cdot r^{n-1}$ |\n| Example | $5,8,11,\\ldots$: $U_{20}=5+19\\times3=62$ | $3,6,12,\\ldots$: $U_7=3\\times2^{6}=192$ |\n\n- To find how many terms a finite sequence has, put its last term into $U_n$ and solve for $n$.',
                'Cari suku ke-20 dari $5, 8, 11, 14,\\ldots$\n\n1. Langkah 1: Cari $a$ dan $b$. Suku pertama $a=5$. Selisihnya $8-5=3$, jadi $b=3$ (periksa: $11-8=3$).\n2. Langkah 2: Tulis rumusnya $U_n=a+(n-1)b=5+(n-1)\\times3$.\n3. Langkah 3: Masukkan $n=20$: $U_{20}=5+19\\times3$.\n4. Langkah 4: Hitung: $U_{20}=5+57=62$.\n\n**Ingat:**\n\n| Hal | Aritmetika | Geometri |\n|---|---|---|\n| Setiap suku dari suku sebelumnya | tambah $b$ | kali $r$ |\n| Suku ke-$n$ | $U_n=a+(n-1)b$ | $U_n=a\\cdot r^{n-1}$ |\n| Contoh | $5,8,11,\\ldots$: $U_{20}=5+19\\times3=62$ | $3,6,12,\\ldots$: $U_7=3\\times2^{6}=192$ |\n\n- Untuk mencari banyak suku barisan berhingga, masukkan suku terakhirnya ke $U_n$ lalu selesaikan untuk $n$.',
              ),
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: n or n - 1?', 'Awas, Jebakan!: n atau n - 1?'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| $U_{20}=5+20\\times3=65$ (the first term is already there, so only 19 steps were taken) | $U_{20}=5+19\\times3=62$ |\n| $U_7=3\\times2^7=384$ (the power must be $n-1$) | $U_7=3\\times2^6=192$ |\n| $2,4,8,16$ is arithmetic because the terms keep growing | The differences 2, 4, 8 are not equal. The ratio is always 2, so it is geometric |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| $U_{20}=5+20\\times3=65$ (suku pertama sudah ada, jadi hanya 19 langkah yang diambil) | $U_{20}=5+19\\times3=62$ |\n| $U_7=3\\times2^7=384$ (pangkatnya harus $n-1$) | $U_7=3\\times2^6=192$ |\n| $2,4,8,16$ aritmetika karena sukunya terus membesar | Selisih 2, 4, 8 tidak sama. Rasionya selalu 2, jadi barisan itu geometri |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The bars show the first four terms of a sequence. Which description is correct?',
                'Batang-batang menunjukkan empat suku pertama sebuah barisan. Deskripsi mana yang benar?',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: '1', value: 48 },
                    { label: '2', value: 24 },
                    { label: '3', value: 12 },
                    { label: '4', value: 6 },
                  ],
                  max: 48,
                  step: 12,
                }),
                caption: L('Bar number n has the height of the term U_n.', 'Batang bernomor n setinggi suku U_n.'),
              },
              options: [
                L('Geometric, with ratio $r=\\frac{1}{2}$', 'Geometri, dengan rasio $r=\\frac{1}{2}$'),
                L('Arithmetic, with difference $b=-24$', 'Aritmetika, dengan beda $b=-24$'),
                L('Arithmetic, with difference $b=-12$', 'Aritmetika, dengan beda $b=-12$'),
                L('Geometric, with ratio $r=2$', 'Geometri, dengan rasio $r=2$'),
              ],
              answer: 0,
              explain: L(
                'Each term is half of the one before: $24\\div48=\\frac{1}{2}$, $12\\div24=\\frac{1}{2}$, $6\\div12=\\frac{1}{2}$. The differences $-24$, $-12$ and $-6$ are not equal, so it is not arithmetic. A ratio of 2 would make the terms grow.',
                'Setiap suku adalah setengah dari suku sebelumnya: $24\\div48=\\frac{1}{2}$, $12\\div24=\\frac{1}{2}$, $6\\div12=\\frac{1}{2}$. Selisih $-24$, $-12$, dan $-6$ tidak sama, jadi bukan aritmetika. Rasio 2 akan membuat suku membesar.',
              ),
              hint: L(
                'Compare neighbouring terms two ways: subtract them, and divide them. Which way gives the same number every time?',
                'Bandingkan suku-suku yang berdekatan dengan dua cara: kurangkan, dan bagi. Cara mana yang memberi bilangan sama setiap kali?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: find the 10th term of $4, 7, 10,\\ldots$ Here $a=4$ and $b=3$.',
                'Coba bersama: cari suku ke-10 dari $4, 7, 10,\\ldots$ Di sini $a=4$ dan $b=3$.',
              ),
              template: 'U_{10}=4+(10-1)\\times3=4+___=___',
              blanks: ['27', '31'],
              explain: L(
                '$(10-1)\\times3=27$, and $4+27=31$. There are 9 steps of 3 from the first term to the 10th.',
                '$(10-1)\\times3=27$, dan $4+27=31$. Ada 9 langkah sebesar 3 dari suku pertama ke suku ke-10.',
              ),
              hint: L(
                'Work out $(10-1)\\times3$ first. Then add the first term 4.',
                'Hitung $(10-1)\\times3$ dulu. Lalu tambahkan suku pertama 4.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Pattern 1 is a square of 4 matchsticks, pattern 2 has two squares in a row, and pattern 3 has three. The sticks are 4, 7, 10, and so on. How many matchsticks does pattern 10 need?',
                'Pola 1 adalah satu persegi dari 4 batang korek, pola 2 punya dua persegi berderet, dan pola 3 punya tiga. Banyak batangnya 4, 7, 10, dan seterusnya. Berapa batang korek yang dibutuhkan pola 10?',
              ),
              figure: {
                ...stickSquares([1, 2, 3]),
                caption: L(
                  'The first three patterns. The number under each pattern is its number.',
                  'Tiga pola pertama. Angka di bawah setiap pola adalah nomor polanya.',
                ),
              },
              options: [
                L('$31$', '$31$'),
                L('$34$', '$34$'),
                L('$40$', '$40$'),
                L('$30$', '$30$'),
              ],
              answer: 0,
              explain: L(
                'The sequence is arithmetic with $a=4$ and $b=3$ (each new square adds 3 sticks), so $U_{10}=4+9\\times3=31$. The answer 34 uses 10 steps instead of 9, 40 is $4\\times10$, and 30 forgets the 4 sticks of the first square.',
                'Barisannya aritmetika dengan $a=4$ dan $b=3$ (setiap persegi baru menambah 3 batang), jadi $U_{10}=4+9\\times3=31$. Jawaban 34 memakai 10 langkah, bukan 9, 40 adalah $4\\times10$, dan 30 melupakan 4 batang persegi pertama.',
              ),
              hint: L(
                'How many sticks does each new square add? Then count how many squares are added after the first pattern.',
                'Berapa batang yang ditambahkan setiap persegi baru? Lalu hitung berapa persegi yang ditambahkan setelah pola pertama.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('$2, 5, 8, 11$ is an arithmetic sequence with $b=3$.', '$2, 5, 8, 11$ adalah barisan aritmetika dengan $b=3$.'),
                L('$3, 6, 12, 24$ is an arithmetic sequence with $b=3$.', '$3, 6, 12, 24$ adalah barisan aritmetika dengan $b=3$.'),
                L('The 6th term of $100, 90, 80,\\ldots$ is 50.', 'Suku ke-6 dari $100, 90, 80,\\ldots$ adalah 50.'),
                L('$1, 4, 9, 16$ is an arithmetic sequence.', '$1, 4, 9, 16$ adalah barisan aritmetika.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The first and third are true: $b=-10$ gives $U_6=100+5\\times(-10)=50$. In $3,6,12,24$ the differences are 3, 6, 12 (not equal): it is geometric with $r=2$. In $1,4,9,16$ the differences are 3, 5, 7, so it is not arithmetic.',
                'Pernyataan pertama dan ketiga benar: $b=-10$ memberi $U_6=100+5\\times(-10)=50$. Pada $3,6,12,24$ selisihnya 3, 6, 12 (tidak sama): barisan itu geometri dengan $r=2$. Pada $1,4,9,16$ selisihnya 3, 5, 7, jadi bukan aritmetika.',
              ),
              hint: L(
                'For each list, subtract neighbouring terms. An arithmetic sequence gives the same difference every time.',
                'Untuk setiap daftar, kurangkan suku-suku yang berdekatan. Barisan aritmetika memberi selisih yang sama setiap kali.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Mrs. Gita drops a ball from a height of 160 cm. After each bounce it rises to half of the height before. Choose the TWO true statements.',
                'Bu Gita menjatuhkan bola dari ketinggian 160 cm. Setelah setiap pantulan, bola naik setengah dari ketinggian sebelumnya. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...lineChart({
                  points: [
                    { label: '0', value: 160 },
                    { label: '1', value: 80 },
                    { label: '2', value: 40 },
                    { label: '3', value: 20 },
                    { label: '4', value: 10 },
                  ],
                  max: 160,
                  step: 40,
                }),
                caption: L(
                  'Height in cm. Point 0 is the drop; point n is the n-th rebound.',
                  'Tinggi dalam cm. Titik 0 adalah ketinggian awal; titik n adalah pantulan ke-n.',
                ),
              },
              options: [
                L('The rebound heights 80, 40, 20,… form a geometric sequence with $r=\\frac{1}{2}$', 'Tinggi pantulan 80, 40, 20,… membentuk barisan geometri dengan $r=\\frac{1}{2}$'),
                L('The 5th rebound reaches 5 cm', 'Pantulan ke-5 mencapai 5 cm'),
                L('The rebound heights go down by the same number of centimetres each time', 'Tinggi pantulan berkurang dengan banyak sentimeter yang sama setiap kali'),
                L('The 4th rebound reaches 20 cm', 'Pantulan ke-4 mencapai 20 cm'),
              ],
              answer: [0, 1],
              explain: L(
                'The heights are multiplied by $\\frac{1}{2}$ each time: 80, 40, 20, 10, 5. So the 5th rebound is $80\\times(\\frac{1}{2})^4=5$ cm. The drops 40, 20, 10 are not equal, and 20 cm is the 3rd rebound, not the 4th.',
                'Tinggi dikali $\\frac{1}{2}$ setiap kali: 80, 40, 20, 10, 5. Jadi pantulan ke-5 adalah $80\\times(\\frac{1}{2})^4=5$ cm. Penurunan 40, 20, 10 tidak sama, dan 20 cm adalah pantulan ke-3, bukan ke-4.',
              ),
              hint: L(
                'Write the first five rebound heights by halving again and again. Then check each statement against your list.',
                'Tulis lima tinggi pantulan pertama dengan membagi dua berulang kali. Lalu cocokkan setiap pernyataan dengan daftarmu.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A theatre has 12 seats in the first row, and every next row has 2 seats more than the row before. The last row has 40 seats. Write the formula for $U_n$, the number of seats in row $n$, and find how many rows the theatre has.',
                'Sebuah gedung teater punya 12 kursi pada baris pertama, dan setiap baris berikutnya punya 2 kursi lebih banyak daripada baris sebelumnya. Baris terakhir punya 40 kursi. Tuliskan rumus $U_n$, banyak kursi pada baris ke-$n$, dan cari banyak baris di teater itu.',
              ),
              blanks: [
                { label: 'U_n =', formula: '2*n+10', variable: 'n', domain: [1, 30] },
                { label: { en: '\\text{rows} =', id: '\\text{baris} =' }, answer: 15 },
              ],
              hints: [
                L(
                  'The seats grow by the same number every row. Which kind of sequence is that, and what are $a$ and $b$?',
                  'Kursi bertambah sama banyak setiap baris. Barisan jenis apa itu, dan berapa $a$ dan $b$?',
                ),
                L(
                  'Use $U_n=a+(n-1)b$ and simplify. For the number of rows, put the last term 40 in place of $U_n$ and solve for $n$.',
                  'Pakai $U_n=a+(n-1)b$ lalu sederhanakan. Untuk banyak baris, masukkan suku terakhir 40 pada $U_n$ lalu selesaikan untuk $n$.',
                ),
                L(
                  'With $a=12$ and $b=2$: $U_n=12+(n-1)\\times2$. Then solve $12+(n-1)\\times2=40$: first subtract 12, then divide by 2, then add 1.',
                  'Dengan $a=12$ dan $b=2$: $U_n=12+(n-1)\\times2$. Lalu selesaikan $12+(n-1)\\times2=40$: kurangi 12 dulu, bagi 2, lalu tambah 1.',
                ),
              ],
              explain: L(
                '$U_n=12+(n-1)\\times2=2n+10$. For the last row, $2n+10=40$ gives $n=15$, so there are 15 rows.',
                '$U_n=12+(n-1)\\times2=2n+10$. Untuk baris terakhir, $2n+10=40$ memberi $n=15$, jadi ada 15 baris.',
              ),
              solution: ['a=12,\\ b=2', 'U_n=12+(n-1)\\times2=2n+10', '2n+10=40', '2n=30', 'n=15'],
            },
          ],
        },
        /* ------------------------------------------- S2 L2 series */
        {
          id: 'tka-smp-m4-s2-l2',
          title: L('Finite Series', 'Deret Berhingga'),
          goal: L(
            'You can add the terms of a finite arithmetic or geometric sequence with a formula.',
            'Kamu bisa menjumlahkan suku-suku barisan aritmetika atau geometri berhingga dengan rumus.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: Gauss and the Pairs', 'Ayo Amati: Gauss dan Pasangan Bilangan'),
              body: L(
                'A **series** is the SUM of the terms of a sequence. The sequence $2, 4, 6, 8$ has four terms, and its series is $2+4+6+8=20$. The sum of the first $n$ terms is written $S_n$.\n\nA famous story: the young Gauss was asked to add $1+2+3+\\ldots+100$. He paired the first number with the last: $1+100=101$, then $2+99=101$, then $3+98=101$, and so on. There are $100\\div2=50$ pairs, each worth 101, so the sum is $50\\times101=5\\,050$.\n\nThe picture does the same for $1+2+\\ldots+10$: there are 5 pairs, each worth 11, so the sum is $5\\times11=55$.',
                '**Deret** adalah JUMLAH suku-suku sebuah barisan. Barisan $2, 4, 6, 8$ punya empat suku, dan deretnya $2+4+6+8=20$. Jumlah $n$ suku pertama ditulis $S_n$.\n\nSebuah cerita terkenal: Gauss kecil diminta menjumlahkan $1+2+3+\\ldots+100$. Ia memasangkan bilangan pertama dengan yang terakhir: $1+100=101$, lalu $2+99=101$, lalu $3+98=101$, dan seterusnya. Ada $100\\div2=50$ pasangan, masing-masing bernilai 101, jadi jumlahnya $50\\times101=5\\,050$.\n\nGambar melakukan hal yang sama untuk $1+2+\\ldots+10$: ada 5 pasangan, masing-masing bernilai 11, jadi jumlahnya $5\\times11=55$.',
              ),
              figure: {
                ...gaussPairs(5),
                caption: L(
                  'Each number in the top row is paired with the number below it. Every pair adds up to 11.',
                  'Setiap bilangan pada baris atas dipasangkan dengan bilangan di bawahnya. Setiap pasangan berjumlah 11.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: An Arithmetic Series', 'Contoh Bertahap: Deret Aritmetika'),
              body: L(
                'Find $3+7+11+\\ldots+39$.\n\n1. Step 1: It is arithmetic with $a=3$, $b=4$ and last term $U_n=39$.\n2. Step 2: Find the number of terms: $39=3+(n-1)\\times4$, so $(n-1)\\times4=36$, so $n-1=9$ and $n=10$.\n3. Step 3: Use the pairing formula: $S_n=\\frac{n}{2}(a+U_n)=\\frac{10}{2}(3+39)$.\n4. Step 4: Calculate: $S_{10}=5\\times42=210$.\n\n**Remember:**\n\n| Series | Formula | Use it when |\n|---|---|---|\n| Arithmetic | $S_n=\\frac{n}{2}(a+U_n)$ | you know the first and the last term |\n| Arithmetic | $S_n=\\frac{n}{2}(2a+(n-1)b)$ | you know $a$, $b$ and $n$ |\n| Geometric, $r\\neq1$ | $S_n=\\frac{a(r^n-1)}{r-1}$ | each term is the one before times $r$ |',
                'Cari $3+7+11+\\ldots+39$.\n\n1. Langkah 1: Deret ini aritmetika dengan $a=3$, $b=4$, dan suku terakhir $U_n=39$.\n2. Langkah 2: Cari banyak suku: $39=3+(n-1)\\times4$, jadi $(n-1)\\times4=36$, sehingga $n-1=9$ dan $n=10$.\n3. Langkah 3: Pakai rumus pasangan: $S_n=\\frac{n}{2}(a+U_n)=\\frac{10}{2}(3+39)$.\n4. Langkah 4: Hitung: $S_{10}=5\\times42=210$.\n\n**Ingat:**\n\n| Deret | Rumus | Dipakai ketika |\n|---|---|---|\n| Aritmetika | $S_n=\\frac{n}{2}(a+U_n)$ | suku pertama dan suku terakhir diketahui |\n| Aritmetika | $S_n=\\frac{n}{2}(2a+(n-1)b)$ | $a$, $b$, dan $n$ diketahui |\n| Geometri, $r\\neq1$ | $S_n=\\frac{a(r^n-1)}{r-1}$ | setiap suku adalah suku sebelumnya dikali $r$ |',
              ),
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Sum or Term, Half or Not', 'Awas, Jebakan!: Jumlah atau Suku, Setengah atau Tidak'),
              body: L(
                'Be careful with these common mistakes.\n\n| Wrong | Right |\n|---|---|\n| $S_4$ of $2,4,6,8$ is 8, the last term | $S_4=2+4+6+8=20$: a series is the SUM of all the terms |\n| $S_{10}=10\\times(3+39)=420$ (the half was forgotten) | $S_{10}=\\frac{10}{2}\\times(3+39)=210$ |\n| $3+6+12+24$: $S_4=\\frac{3(2^3-1)}{2-1}=21$ (the power was $n-1$) | $S_4=\\frac{3(2^4-1)}{2-1}=45$: the formula has $r^n$ |',
                'Hati-hati dengan kesalahan yang sering terjadi ini.\n\n| Salah | Benar |\n|---|---|\n| $S_4$ dari $2,4,6,8$ adalah 8, yaitu suku terakhir | $S_4=2+4+6+8=20$: deret adalah JUMLAH semua suku |\n| $S_{10}=10\\times(3+39)=420$ (setengahnya terlupa) | $S_{10}=\\frac{10}{2}\\times(3+39)=210$ |\n| $3+6+12+24$: $S_4=\\frac{3(2^3-1)}{2-1}=21$ (pangkatnya $n-1$) | $S_4=\\frac{3(2^4-1)}{2-1}=45$: rumusnya memakai $r^n$ |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'The bars show the number of seats in the first five rows of a hall. How many seats are there in these five rows altogether?',
                'Batang-batang menunjukkan banyak kursi pada lima baris pertama sebuah aula. Berapa jumlah kursi pada kelima baris itu?',
              ),
              figure: {
                ...barChart({
                  bars: [
                    { label: '1', value: 5 },
                    { label: '2', value: 8 },
                    { label: '3', value: 11 },
                    { label: '4', value: 14 },
                    { label: '5', value: 17 },
                  ],
                  max: 18,
                  step: 3,
                }),
                caption: L('Seats in rows 1 to 5.', 'Kursi pada baris 1 sampai 5.'),
              },
              options: [
                L('$55$', '$55$'),
                L('$17$', '$17$'),
                L('$110$', '$110$'),
                L('$85$', '$85$'),
              ],
              answer: 0,
              explain: L(
                '$S_5=\\frac{5}{2}(5+17)=55$, which is also $5+8+11+14+17$. The number 17 is only the last row, 110 forgets the half, and 85 is $5\\times17$, as if every row had 17 seats.',
                '$S_5=\\frac{5}{2}(5+17)=55$, sama dengan $5+8+11+14+17$. Bilangan 17 hanya baris terakhir, 110 melupakan setengahnya, dan 85 adalah $5\\times17$, seolah setiap baris punya 17 kursi.',
              ),
              hint: L(
                'Add the heights of all five bars, or pair the first bar with the last one and use the pairing idea.',
                'Jumlahkan tinggi kelima batang, atau pasangkan batang pertama dengan batang terakhir dan pakai ide pasangan.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: find $3+6+12+24+48+96$. It is geometric with $a=3$, $r=2$ and $n=6$.',
                'Coba bersama: cari $3+6+12+24+48+96$. Ini geometri dengan $a=3$, $r=2$, dan $n=6$.',
              ),
              template: 'S_6=3\\times\\frac{2^6-1}{2-1}=3\\times___=___',
              blanks: ['63', '189'],
              explain: L(
                '$2^6-1=63$, and $3\\times63=189$. You can check by adding: $3+6+12+24+48+96=189$.',
                '$2^6-1=63$, dan $3\\times63=189$. Kamu bisa memeriksa dengan menjumlahkan: $3+6+12+24+48+96=189$.',
              ),
              hint: L(
                'First work out $2^6-1$ (the denominator $2-1$ is just 1). Then multiply by the first term 3.',
                'Hitung dulu $2^6-1$ (penyebut $2-1$ hanya 1). Lalu kalikan dengan suku pertama 3.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Cans are stacked in rows. The bottom row has 8 cans, and every row above has one can fewer, up to a top row of 1 can. How many cans are in the stack?',
                'Kaleng-kaleng ditumpuk dalam baris. Baris paling bawah punya 8 kaleng, dan setiap baris di atasnya punya satu kaleng lebih sedikit, sampai baris paling atas dengan 1 kaleng. Berapa banyak kaleng dalam tumpukan itu?',
              ),
              figure: {
                ...staircase(8),
                caption: L('Each square is one can.', 'Setiap persegi adalah satu kaleng.'),
              },
              options: [
                L('$36$', '$36$'),
                L('$72$', '$72$'),
                L('$64$', '$64$'),
                L('$28$', '$28$'),
              ],
              answer: 0,
              explain: L(
                'The rows have $8,7,\\ldots,1$ cans: an arithmetic series with $n=8$, so $S_8=\\frac{8}{2}(8+1)=36$. The answer 72 forgets the half, 64 is $8\\times8$, and 28 stops at 7 cans in the bottom row.',
                'Baris-barisnya berisi $8,7,\\ldots,1$ kaleng: deret aritmetika dengan $n=8$, jadi $S_8=\\frac{8}{2}(8+1)=36$. Jawaban 72 melupakan setengahnya, 64 adalah $8\\times8$, dan 28 berhenti pada 7 kaleng di baris bawah.',
              ),
              hint: L(
                'The number of cans in each row forms a sequence. Which kind, and what are its first and last terms?',
                'Banyak kaleng pada setiap baris membentuk sebuah barisan. Jenis apa, dan berapa suku pertama dan terakhirnya?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan apakah setiap pernyataan Benar atau Salah.'),
              statements: [
                L('$1+2+3+\\ldots+100=5\\,050$', '$1+2+3+\\ldots+100=5\\,050$'),
                L('A series is the list of the terms, not their sum.', 'Deret adalah daftar suku-suku, bukan jumlahnya.'),
                L('For $2+4+8+16$ (geometric, $a=2$, $r=2$, $n=4$): $S_4=30$.', 'Untuk $2+4+8+16$ (geometri, $a=2$, $r=2$, $n=4$): $S_4=30$.'),
                L('$5+7+9+11=28$', '$5+7+9+11=28$'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The first is Gauss\' result. A series is a sum. $S_4=\\frac{2(2^4-1)}{2-1}=30$ is right. And $5+7+9+11=32$, which is also $\\frac{4}{2}(5+11)$.',
                'Yang pertama adalah hasil Gauss. Deret adalah jumlah. $S_4=\\frac{2(2^4-1)}{2-1}=30$ benar. Dan $5+7+9+11=32$, sama dengan $\\frac{4}{2}(5+11)$.',
              ),
              hint: L(
                'Check each sum by adding the terms or with the formula. Remember that a series is a sum.',
                'Periksa setiap jumlah dengan menjumlahkan suku-sukunya atau dengan rumus. Ingat bahwa deret adalah jumlah.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Choose the TWO expressions that are equal to $1+2+3+\\ldots+10$.',
                'Pilih DUA ekspresi yang sama dengan $1+2+3+\\ldots+10$.',
              ),
              options: [
                L('$\\frac{10}{2}(1+10)$', '$\\frac{10}{2}(1+10)$'),
                L('$\\frac{10\\times11}{2}$', '$\\frac{10\\times11}{2}$'),
                L('$10\\times(1+10)$', '$10\\times(1+10)$'),
                L('$\\frac{10}{2}\\times10$', '$\\frac{10}{2}\\times10$'),
              ],
              answer: [0, 1],
              explain: L(
                'Both correct options equal 55, the value of the series: 5 pairs worth 11 each. The expression $10\\times(1+10)=110$ forgets the half, and $\\frac{10}{2}\\times10=50$ uses 10 instead of the pair sum 11.',
                'Kedua pilihan yang benar bernilai 55, nilai deret itu: 5 pasangan masing-masing bernilai 11. Ekspresi $10\\times(1+10)=110$ melupakan setengahnya, dan $\\frac{10}{2}\\times10=50$ memakai 10, bukan jumlah pasangan 11.',
              ),
              hint: L(
                'Work out the value of each expression, then compare it with $1+2+\\ldots+10$. Use pairs worth $1+10$.',
                'Hitung nilai setiap ekspresi, lalu bandingkan dengan $1+2+\\ldots+10$. Pakai pasangan bernilai $1+10$.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Mrs. Siti saves Rp10,000 in week 1. Every following week she saves Rp5,000 more than the week before. She does this for 12 weeks. How much does she save in week 12, and how much in total?',
                'Bu Siti menabung Rp10.000 pada pekan pertama. Setiap pekan berikutnya ia menabung Rp5.000 lebih banyak daripada pekan sebelumnya. Ia melakukannya selama 12 pekan. Berapa tabungannya pada pekan ke-12, dan berapa totalnya?',
              ),
              blanks: [
                { label: { en: '\\text{week 12: Rp}', id: '\\text{pekan ke-12: Rp}' }, answer: 65000 },
                { label: { en: '\\text{total: Rp}', id: '\\text{total: Rp}' }, answer: 450000 },
              ],
              hints: [
                L(
                  'The weekly savings go up by the same amount, so they form an arithmetic sequence. What are $a$, $b$ and $n$?',
                  'Tabungan tiap pekan naik sama besar, jadi membentuk barisan aritmetika. Berapa $a$, $b$, dan $n$?',
                ),
                L(
                  'First find the saving in week 12 with $U_n=a+(n-1)b$. Then use $S_n=\\frac{n}{2}(a+U_n)$ for the total.',
                  'Cari dulu tabungan pekan ke-12 dengan $U_n=a+(n-1)b$. Lalu pakai $S_n=\\frac{n}{2}(a+U_n)$ untuk totalnya.',
                ),
                L(
                  '$U_{12}=10\\,000+11\\times5\\,000$. For the total, multiply half of 12 by the sum of the first and the last week.',
                  '$U_{12}=10\\,000+11\\times5\\,000$. Untuk totalnya, kalikan setengah dari 12 dengan jumlah pekan pertama dan pekan terakhir.',
                ),
              ],
              explain: L(
                '$U_{12}=10\\,000+11\\times5\\,000=65\\,000$, and $S_{12}=\\frac{12}{2}(10\\,000+65\\,000)=6\\times75\\,000=450\\,000$. She saves Rp450,000 in total.',
                '$U_{12}=10\\,000+11\\times5\\,000=65\\,000$, dan $S_{12}=\\frac{12}{2}(10\\,000+65\\,000)=6\\times75\\,000=450\\,000$. Total tabungannya Rp450.000.',
              ),
              solution: ['a=10\\,000,\\ b=5\\,000,\\ n=12', 'U_{12}=10\\,000+11\\times5\\,000=65\\,000', 'S_{12}=\\frac{12}{2}(10\\,000+65\\,000)', 'S_{12}=6\\times75\\,000=450\\,000'],
            },
          ],
        },
      ],
      project: {
        id: 'tka-smp-m4-s2-p',
        runtime: 'math',
        title: L('Sequences and Series Challenge', 'Tantangan Barisan dan Deret'),
        brief: L(
          'Find terms and sums of arithmetic and geometric patterns in numbers, savings and seats.',
          'Mencari suku dan jumlah pola aritmetika dan geometri pada bilangan, tabungan, dan kursi.',
        ),
        requirements: [
          L('Find the common difference or ratio and any term of a finite sequence.', 'Mencari beda atau rasio dan suku mana pun dari barisan berhingga.'),
          L('Add the terms of a finite arithmetic or geometric series with a formula.', 'Menjumlahkan suku-suku deret aritmetika atau geometri berhingga dengan rumus.'),
        ],
        hints: [
          L('First decide: do the terms grow by adding the same number or by multiplying by the same number?', 'Putuskan dulu: apakah suku bertambah dengan menambah bilangan yang sama atau dengan mengalikan bilangan yang sama?'),
          L('For the $n$-th term remember $n-1$ steps: $a+(n-1)b$ or $a\\cdot r^{n-1}$.', 'Untuk suku ke-$n$ ingat ada $n-1$ langkah: $a+(n-1)b$ atau $a\\cdot r^{n-1}$.'),
          L('For a sum, an arithmetic series uses $\\frac{n}{2}(a+U_n)$ and a geometric series uses $\\frac{a(r^n-1)}{r-1}$.', 'Untuk jumlah, deret aritmetika memakai $\\frac{n}{2}(a+U_n)$ dan deret geometri memakai $\\frac{a(r^n-1)}{r-1}$.'),
        ],
        xp: 50,
        tasks: [
          {
            prompt: L(
              'Look at the sequence $5, 15, 45, 135,\\ldots$ Find the common ratio and the next term.',
              'Perhatikan barisan $5, 15, 45, 135,\\ldots$ Cari rasio dan suku berikutnya.',
            ),
            inline: true,
            blanks: [
              { label: 'r =', answer: 3 },
              { label: { en: '\\text{next term} =', id: '\\text{suku berikutnya} =' }, answer: 405 },
            ],
            solution: ['15\\div5=3,\\ 45\\div15=3,\\ 135\\div45=3', 'r=3', '135\\times3=405'],
          },
          {
            prompt: L(
              'An arithmetic sequence has first term 7 and common difference 4. Write the formula for $U_n$, then find the 30th term.',
              'Sebuah barisan aritmetika punya suku pertama 7 dan beda 4. Tuliskan rumus $U_n$, lalu cari suku ke-30.',
            ),
            blanks: [
              { label: 'U_n =', formula: '4*n+3', variable: 'n', domain: [1, 40] },
              { label: 'U_{30} =', answer: 123 },
            ],
            solution: ['a=7,\\ b=4', 'U_n=7+(n-1)\\times4=4n+3', 'U_{30}=4\\times30+3=123'],
          },
          {
            prompt: L(
              'Fitri puts Rp1,000 in a jar on day 1. Every next day she puts in double the amount of the day before. She does this for 8 days. How much does she put in on day 8, and how much is in the jar after 8 days? Answer in rupiah.',
              'Fitri memasukkan Rp1.000 ke celengan pada hari pertama. Setiap hari berikutnya ia memasukkan dua kali lipat jumlah hari sebelumnya. Ia melakukannya selama 8 hari. Berapa yang ia masukkan pada hari ke-8, dan berapa isi celengan setelah 8 hari? Jawab dalam rupiah.',
            ),
            blanks: [
              { label: { en: '\\text{day 8: Rp}', id: '\\text{hari ke-8: Rp}' }, answer: 128000 },
              { label: { en: '\\text{total: Rp}', id: '\\text{total: Rp}' }, answer: 255000 },
            ],
            solution: ['a=1\\,000,\\ r=2,\\ n=8', 'U_8=1\\,000\\times2^7=128\\,000', 'S_8=\\frac{1\\,000(2^8-1)}{2-1}=1\\,000\\times255=255\\,000'],
          },
          {
            prompt: L(
              'In a hall the first row has 4 seats and the last row has 40 seats. Every row has the same number of seats more than the row in front of it. Altogether there are 220 seats. How many rows are there, and how many seats more does each row have than the row in front?',
              'Pada sebuah aula, baris pertama punya 4 kursi dan baris terakhir punya 40 kursi. Setiap baris punya kursi lebih banyak dengan selisih yang sama daripada baris di depannya. Seluruhnya ada 220 kursi. Berapa banyak baris, dan berapa kursi lebih banyak setiap baris daripada baris di depannya?',
            ),
            inline: true,
            blanks: [
              { label: { en: '\\text{rows} =', id: '\\text{baris} =' }, answer: 10 },
              { label: { en: '\\text{more per row} =', id: '\\text{tambahan per baris} =' }, answer: 4 },
            ],
            solution: ['S_n=\\frac{n}{2}(a+U_n)=\\frac{n}{2}(4+40)=22n', '22n=220 \\Rightarrow n=10', '40=4+(10-1)b', '9b=36 \\Rightarrow b=4'],
          },
        ],
      },
    },
  ],
}
