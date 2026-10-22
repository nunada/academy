import type { Submodule } from '../types'
import { L, collect, concept, fill, judge, left, level, move, multi, prog, quiz, repeat, right, robot, sayStars, task } from './b'

/** Module 2, submodule 1 — the repeat block. */

export const m2s1: Submodule = {
  id: 'cb-m2-s1',
  title: L('Repeat', 'Ulangi'),
  summary: L(
    'Replace a long list of identical orders with one repeat block, and count things inside a loop.',
    'Mengganti daftar panjang perintah yang sama dengan satu blok ulangi, dan menghitung sesuatu di dalam perulangan.',
  ),
  lessons: [
    /* ---------------------------------------------------------- L5 repeat */
    {
      id: 'cb-m2-s1-l1',
      title: L('Repeat a Pattern', 'Ulangi Sebuah Pola'),
      goal: L('You can spot a pattern that comes back and write it once inside a repeat block.', 'Kamu bisa mengenali pola yang berulang dan menuliskannya sekali di dalam blok ulangi.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: Do Not Write It Twice', 'Ayo Amati: Jangan Menulis Dua Kali'),
          L(
            'Some paths are made of the **same piece** again and again, like a staircase. Writing every block out is long and easy to get wrong.\n\nA **repeat** block says: “do everything inside me this many times”. The orders go **inside** the block, and the number says how often.\n\nThis staircase is “1 step, turn right, 1 step, turn left”, three times:',
            'Sebagian jalur tersusun dari **potongan yang sama** berulang-ulang, seperti tangga. Menulis setiap blok sangat panjang dan mudah salah.\n\nBlok **ulangi** berkata: “kerjakan semua yang ada di dalamku sebanyak ini”. Perintahnya masuk **ke dalam** blok, dan angkanya menyatakan berapa kali.\n\nTangga ini adalah “1 langkah, belok kanan, 1 langkah, belok kiri”, sebanyak tiga kali:',
          ),
          L('repeat 3 times\n  move 1\n  turn right\n  move 1\n  turn left', 'ulangi 3 kali\n  maju 1\n  belok kanan\n  maju 1\n  belok kiri'),
        ),
        concept(
          'c2',
          L('Step by Step: Finding the Piece That Repeats', 'Contoh Bertahap: Mencari Potongan yang Berulang'),
          L(
            'To write a loop:\n\n1. Step 1: Walk the path with your finger and find the **smallest piece** that comes back the same.\n2. Step 2: Write that piece **once**, inside a repeat block.\n3. Step 3: Count how many times the piece occurs, and put that number in the block.\n\nThe loop also saves blocks: three stairs written out take 12 blocks, but inside a repeat they take only 5.',
            'Untuk menulis perulangan:\n\n1. Langkah 1: Susuri jalur dengan jarimu dan cari **potongan terkecil** yang kembali sama.\n2. Langkah 2: Tulis potongan itu **sekali**, di dalam blok ulangi.\n3. Langkah 3: Hitung berapa kali potongan itu muncul, dan taruh angkanya pada blok.\n\nPerulangan juga menghemat blok: tiga anak tangga yang ditulis satu per satu memerlukan 12 blok, tetapi di dalam blok ulangi hanya 5.',
          ),
        ),
        quiz(
          'q1',
          L('Which program does exactly the same as `move 1`, `move 1`, `move 1`, `move 1`?', 'Program manakah yang melakukan hal yang persis sama dengan `maju 1`, `maju 1`, `maju 1`, `maju 1`?'),
          [L('repeat 4 times: move 1', 'ulangi 4 kali: maju 1'), L('repeat 1 time: move 4 steps four times', 'ulangi 1 kali: maju 4 langkah'), L('repeat 2 times: move 1', 'ulangi 2 kali: maju 1'), L('repeat 4 times: move 4', 'ulangi 4 kali: maju 4')],
          0,
          L('Four moves of 1 step are 4 steps in all. “Repeat 4 times: move 1” gives $4\\times1=4$. The last option gives $4\\times4=16$.', 'Empat kali maju 1 langkah seluruhnya 4 langkah. “Ulangi 4 kali: maju 1” memberi $4\\times1=4$. Pilihan terakhir memberi $4\\times4=16$.'),
          L('The total number of steps is the number of repeats times the steps inside.', 'Jumlah langkah adalah banyak pengulangan dikali langkah di dalamnya.'),
        ),
        robot(
          'b1',
          L('Walk down the stairs to the goal. Use a repeat block and at most 6 blocks.', 'Turuni tangga sampai garis finis. Pakai blok ulangi dan paling banyak 6 blok.'),
          level({ worlds: ['>...', '....', '....', '...G'], allowed: ['move', 'turn', 'repeat'], reach: true, max: 6, must: ['repeat'] }),
          prog([repeat(3, [move(1), right(), move(1), left()])]),
          [L('One stair is: 1 step, turn right, 1 step, turn left. How many stairs are there?', 'Satu anak tangga adalah: 1 langkah, belok kanan, 1 langkah, belok kiri. Ada berapa anak tangga?'), L('After you press “repeat”, new blocks go inside it.', 'Setelah menekan “ulangi”, blok baru masuk ke dalamnya.')],
        ),
        fill(
          'f1',
          L('The robot walks a square: move 1, turn right, again and again. How many times must the loop run for it to come back to where it started?', 'Robot berjalan membentuk persegi: maju 1, belok kanan, berulang-ulang. Berapa kali perulangan agar ia kembali ke tempat ia mulai?'),
          { en: 'repeat ___ times\n  move 1\n  turn right', id: 'ulangi ___ kali\n  maju 1\n  belok kanan' },
          ['4'],
          L('A square has 4 sides. Four right turns make one whole turn, so the robot is back where it started, facing the same way.', 'Persegi punya 4 sisi. Empat kali belok kanan membuat satu putaran penuh, sehingga robot kembali ke tempat mulai dengan menghadap arah yang sama.'),
          L('Each turn is a quarter of a whole turn.', 'Tiap belokan adalah seperempat putaran penuh.'),
        ),
        robot(
          'b2',
          L('Pick up the three stars at the corners. Use a repeat block and at most 5 blocks.', 'Ambil tiga bintang di sudut-sudut. Pakai blok ulangi dan paling banyak 5 blok.'),
          level({ worlds: ['>.*', '.#.', '*.*'], allowed: ['move', 'turn', 'collect', 'repeat'], stars: true, max: 5, must: ['repeat'] }),
          prog([repeat(3, [move(2), collect(), right()])]),
          [L('Each side of the square is the same: walk 2 steps, pick up, turn.', 'Tiap sisi persegi sama: jalan 2 langkah, ambil, belok.'), L('There are three stars, so the piece repeats three times.', 'Ada tiga bintang, jadi potongan itu diulang tiga kali.')],
        ),
      ],
    },
    /* ------------------------------------------------------- L6 counting */
    {
      id: 'cb-m2-s1-l2',
      title: L('Count Inside a Loop', 'Menghitung di Dalam Perulangan'),
      goal: L('You can pick up a row of stars with a loop, and say a count inside or after it.', 'Kamu bisa mengambil sebaris bintang dengan perulangan, dan mengucapkan hitungan di dalam atau sesudahnya.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: Inside the Loop or After It', 'Ayo Amati: Di Dalam Perulangan atau Sesudahnya'),
          L(
            'Where a block sits makes a big difference.\n\n- A block **inside** the repeat is done **every time round**.\n- A block **after** the repeat is done **once**, when the loop has finished.\n\nSo a `say stars I hold` **inside** the loop reports a running count (1, then 2, then 3), but **after** the loop it says only the final count.',
            'Letak sebuah blok sangat berpengaruh.\n\n- Blok **di dalam** ulangi dikerjakan **setiap putaran**.\n- Blok **sesudah** ulangi dikerjakan **sekali**, ketika perulangan selesai.\n\nJadi `ucapkan bintang yang kupegang` **di dalam** perulangan melaporkan hitungan berjalan (1, lalu 2, lalu 3), tetapi **sesudah** perulangan hanya mengucapkan hitungan akhir.',
          ),
          L('repeat 3 times\n  move 1\n  pick up the star\n  say stars I hold', 'ulangi 3 kali\n  maju 1\n  ambil bintang\n  ucapkan bintang yang kupegang'),
        ),
        concept(
          'c2',
          L('Watch Out!: How Many Times?', 'Awas, Jebakan!: Berapa Kali?'),
          L(
            'The number in the repeat block must match the world. For a row of 4 stars:\n\n- repeat 4 times: all four stars are picked up;\n- repeat 3 times: the robot stops one star short;\n- repeat 5 times: the fifth `move 1` walks into the wall at the end and the program fails.\n\nCount the squares on the map **before** you type the number.',
            'Angka pada blok ulangi harus sesuai dengan peta. Untuk sebaris 4 bintang:\n\n- ulangi 4 kali: keempat bintang terambil;\n- ulangi 3 kali: robot berhenti kurang satu bintang;\n- ulangi 5 kali: `maju 1` kelima menabrak tembok di ujung dan program gagal.\n\nHitung kotak di peta **sebelum** mengetik angkanya.',
          ),
        ),
        quiz(
          'q1',
          L('What does the robot say?', 'Apa yang diucapkan robot?'),
          [L('1, 2, 3', '1, 2, 3'), L('3', '3'), L('3, 3, 3', '3, 3, 3'), L('1', '1')],
          0,
          L('The say block is **inside** the loop, so it says the count every time round: 1, then 2, then 3.', 'Blok ucapkan ada **di dalam** perulangan, jadi ia mengucapkan hitungan setiap putaran: 1, lalu 2, lalu 3.'),
          L('Is the say block inside the repeat or after it?', 'Apakah blok ucapkan ada di dalam atau sesudah ulangi?'),
          L('(a row of 3 stars)\nrepeat 3 times\n  move 1\n  pick up the star\n  say stars I hold', '(sebaris 3 bintang)\nulangi 3 kali\n  maju 1\n  ambil bintang\n  ucapkan bintang yang kupegang'),
        ),
        robot(
          'b1',
          L('Pick up the four stars with a loop, then say how many you hold. Use at most 4 blocks.', 'Ambil keempat bintang dengan perulangan, lalu ucapkan berapa yang kamu pegang. Pakai paling banyak 4 blok.'),
          level({ worlds: ['>****'], allowed: ['move', 'collect', 'repeat', 'say'], stars: true, say: ['4'], max: 4, must: ['repeat'] }),
          prog([repeat(4, [move(1), collect()]), sayStars()]),
          [L('The piece that repeats is: move 1, pick up.', 'Potongan yang berulang adalah: maju 1, ambil.'), L('Put the say block after the repeat, not inside it.', 'Taruh blok ucapkan sesudah ulangi, bukan di dalamnya.')],
        ),
        multi(
          'm1',
          L('The robot walks a row of 5 stars with “repeat N times: move 1, pick up”. Choose ALL the values of N that work without the robot hitting the wall (the row has no wall in front of it for 5 steps, then a wall).', 'Robot menyusuri sebaris 5 bintang dengan “ulangi N kali: maju 1, ambil”. Pilih SEMUA nilai N yang berhasil tanpa membuat robot menabrak tembok (baris itu lurus 5 langkah, lalu ada tembok).'),
          [L('N = 3', 'N = 3'), L('N = 5', 'N = 5'), L('N = 6', 'N = 6'), L('N = 4', 'N = 4')],
          [0, 1, 3],
          L('With N up to 5 the robot always has a square to step on. N = 6 makes the sixth step run into the wall. But only N = 5 picks up **all** the stars.', 'Dengan N sampai 5 robot selalu punya kotak untuk diinjak. N = 6 membuat langkah keenam menabrak tembok. Tetapi hanya N = 5 yang mengambil **semua** bintang.'),
          L('Which values stay on the map? Then think about which of them pick up everything.', 'Nilai mana yang tetap berada di dalam peta? Lalu pikirkan mana di antaranya yang mengambil semuanya.'),
        ),
        robot(
          'b2',
          L('Pick up the stars and say how many you hold after **each** one: 1, 2, 3.', 'Ambil bintang-bintangnya dan ucapkan berapa yang kamu pegang setelah **tiap** bintang: 1, 2, 3.'),
          level({ worlds: ['>***'], allowed: ['move', 'collect', 'repeat', 'say'], stars: true, say: ['1', '2', '3'], max: 4, must: ['repeat'] }),
          prog([repeat(3, [move(1), collect(), sayStars()])]),
          [L('This time the say block must be inside the loop.', 'Kali ini blok ucapkan harus ada di dalam perulangan.')],
        ),
        judge(
          'j1',
          L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          [
            L('A block inside a repeat is done every time round.', 'Blok di dalam ulangi dikerjakan setiap putaran.'),
            L('A block after the repeat is done once, when the loop is over.', 'Blok sesudah ulangi dikerjakan sekali, ketika perulangan selesai.'),
            L('The number in a repeat block can be bigger than the squares on the map without any problem.', 'Angka pada blok ulangi boleh lebih besar daripada kotak di peta tanpa masalah apa pun.'),
          ],
          [true, true, false],
          L('Inside means every round, after means once. And too big a number sends the robot into a wall.', 'Di dalam berarti setiap putaran, sesudah berarti sekali. Dan angka yang terlalu besar membuat robot menabrak tembok.'),
          L('Picture where each block sits in the stack.', 'Bayangkan letak tiap blok di dalam tumpukan.'),
        ),
      ],
    },
  ],
  project: {
    id: 'cb-m2-s1-p',
    runtime: 'blocks',
    title: L('Loop Workshop', 'Bengkel Perulangan'),
    brief: L(
      'Four levels where a loop is the only way to stay within the block limit.',
      'Empat level yang hanya bisa diselesaikan dengan perulangan agar tidak melewati batas jumlah blok.',
    ),
    requirements: [L('Write the repeating piece once, inside a repeat block.', 'Menulis potongan yang berulang sekali, di dalam blok ulangi.'), L('Choose the right number of repeats.', 'Memilih banyak pengulangan yang tepat.')],
    hints: [
      L('Find the piece that comes back the same way.', 'Cari potongan yang kembali dengan cara yang sama.'),
      L('Count how many times it occurs.', 'Hitung berapa kali ia muncul.'),
      L('Check the block limit shown in the level text.', 'Periksa batas jumlah blok yang tertulis pada soal.'),
    ],
    xp: 40,
    tasks: [
      task(
        L('**Level 1.** A long staircase. At most 6 blocks.', '**Level 1.** Tangga yang panjang. Paling banyak 6 blok.'),
        level({ worlds: ['>....', '.....', '.....', '.....', '....G'], allowed: ['move', 'turn', 'repeat'], reach: true, max: 6, must: ['repeat'] }),
        prog([repeat(4, [move(1), right(), move(1), left()])]),
      ),
      task(
        L('**Level 2.** Stars at three corners of a big square. At most 5 blocks.', '**Level 2.** Bintang di tiga sudut persegi besar. Paling banyak 5 blok.'),
        level({ worlds: ['>..*', '.##.', '.##.', '*..*'], allowed: ['move', 'turn', 'collect', 'repeat'], stars: true, max: 5, must: ['repeat'] }),
        prog([repeat(3, [move(3), collect(), right()])]),
      ),
      task(
        L('**Level 3.** Pick up six stars and say how many. At most 4 blocks.', '**Level 3.** Ambil enam bintang dan ucapkan banyaknya. Paling banyak 4 blok.'),
        level({ worlds: ['>******'], allowed: ['move', 'collect', 'repeat', 'say'], stars: true, say: ['6'], max: 4, must: ['repeat'] }),
        prog([repeat(6, [move(1), collect()]), sayStars()]),
      ),
      task(
        L('**Level 4.** Say the running count, then walk on to the goal. At most 5 blocks.', '**Level 4.** Ucapkan hitungan berjalan, lalu lanjut ke garis finis. Paling banyak 5 blok.'),
        level({ worlds: ['>***G'], allowed: ['move', 'collect', 'repeat', 'say'], reach: true, stars: true, say: ['1', '2', '3'], max: 5, must: ['repeat'] }),
        prog([repeat(3, [move(1), collect(), sayStars()]), move(1)]),
      ),
    ],
  },
}
