import type { Submodule } from '../types'
import { L, call, collect, concept, judge, left, level, move, multi, prog, quiz, repeat, right, robot, say, task } from './b'

/** Module 4, submodule 2 — blocks you build yourself. */

export const m4s2: Submodule = {
  id: 'cb-m4-s2',
  title: L('My Own Blocks', 'Blok Buatanku'),
  summary: L(
    'Give a group of blocks a name, build it once and run it as often as you like, even from inside another block of your own.',
    'Memberi nama pada sekelompok blok, menyusunnya sekali dan menjalankannya sesering mungkin, bahkan dari dalam blok buatanmu yang lain.',
  ),
  lessons: [
    /* ------------------------------------------------------------ L15 define */
    {
      id: 'cb-m4-s2-l1',
      title: L('Build a Block', 'Susun Sebuah Blok'),
      goal: L('You can build your own block from other blocks and run it wherever you need it.', 'Kamu bisa menyusun blokmu sendiri dari blok lain dan menjalankannya di mana pun diperlukan.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: Name a Piece, Use It Again', 'Ayo Amati: Namai Sebuah Potongan, Pakai Lagi'),
          L(
            'A loop repeats a piece **in a row**. But what if the same piece is needed in **different places** of the program, with other blocks in between?\n\nThen you **build your own block**. You give a group of blocks a **name**, build it once under that name, and in the main program you only write *run name*.\n\nThe level shows the blocks you may build: they appear under **my block**, each with its own stack. The main program runs the block with the **run** block.',
            'Perulangan mengulang sebuah potongan **berturut-turut**. Tetapi bagaimana bila potongan yang sama diperlukan di **tempat yang berbeda** dalam program, dengan blok lain di antaranya?\n\nMaka kamu **menyusun blokmu sendiri**. Kamu memberi nama pada sekelompok blok, menyusunnya sekali dengan nama itu, dan di program utama kamu cukup menulis *jalankan nama*.\n\nLevel menunjukkan blok yang boleh kamu susun: ia muncul di bawah **blokku**, masing-masing dengan tumpukannya sendiri. Program utama menjalankan blok itu dengan blok **jalankan**.',
          ),
          L('my block row:\n  repeat 3 times\n    move 1\n    pick up the star\n\nmain:\n  run row\n  turn right\n  move 1\n  turn right\n  run row', 'blokku row:\n  ulangi 3 kali\n    maju 1\n    ambil bintang\n\nutama:\n  jalankan row\n  belok kanan\n  maju 1\n  belok kanan\n  jalankan row'),
        ),
        concept(
          'c2',
          L('Step by Step: Why It Helps', 'Contoh Bertahap: Mengapa Ini Membantu'),
          L(
            'A block of your own gives you three things:\n\n1. Step 1: **Less to write.** The piece is built once and run many times.\n2. Step 2: **One place to fix.** If the piece is wrong, you correct it once and every run is corrected.\n3. Step 3: **A name that tells what it does.** “run row” is easier to read than 3 loose blocks.\n\nAfter you build a block, the main program only has to say **when** to run it.',
            'Blok buatan sendiri memberi tiga hal:\n\n1. Langkah 1: **Lebih sedikit yang ditulis.** Potongan disusun sekali dan dijalankan berkali-kali.\n2. Langkah 2: **Satu tempat untuk memperbaiki.** Bila potongannya salah, kamu memperbaikinya sekali dan setiap pemanggilan ikut benar.\n3. Langkah 3: **Nama yang menjelaskan fungsinya.** “jalankan row” lebih mudah dibaca daripada 3 blok lepas.\n\nSetelah menyusun sebuah blok, program utama hanya perlu mengatakan **kapan** menjalankannya.',
          ),
        ),
        quiz(
          'q1',
          L('The block `row` has 3 blocks in it. The main program runs it twice. How many times does the robot walk the `row` piece?', 'Blok `row` berisi 3 blok. Program utama menjalankannya dua kali. Berapa kali robot melakukan potongan `row`?'),
          [L('1 time', '1 kali'), L('2 times', '2 kali'), L('3 times', '3 kali'), L('6 times', '6 kali')],
          1,
          L('Each “run row” does the piece once, so two runs do it twice. The 3 is the number of blocks **inside** the piece, not the number of runs.', 'Setiap “jalankan row” melakukan potongan itu sekali, jadi dua pemanggilan melakukannya dua kali. Angka 3 adalah banyak blok **di dalam** potongan, bukan banyak pemanggilan.'),
          L('Count the “run row” blocks in the main program.', 'Hitung blok “jalankan row” di program utama.'),
        ),
        robot(
          'b1',
          L('Pick up the stars on both rows. Build a block called **row** and run it twice. Use at most 8 blocks in all.', 'Ambil bintang di kedua baris. Susun sebuah blok bernama **row** dan jalankan dua kali. Pakai paling banyak 8 blok seluruhnya.'),
          level({ worlds: ['>***', '***.'], allowed: ['move', 'turn', 'collect', 'repeat', 'call'], defs: ['row'], stars: true, max: 8, must: ['call'] }),
          prog([call('row'), right(), move(1), right(), call('row')], { row: [repeat(3, [move(1), collect()])] }),
          [L('Build row first: repeat 3 times of (move 1, pick up).', 'Susun row dulu: ulangi 3 kali (maju 1, ambil).'), L('Main program: run row, turn right, move 1, turn right, run row.', 'Program utama: jalankan row, belok kanan, maju 1, belok kanan, jalankan row.')],
        ),
        judge(
          'j1',
          L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          [
            L('You build a block once and can run it many times.', 'Kamu menyusun blok sekali dan dapat menjalankannya berkali-kali.'),
            L('A block you built does nothing until the main program runs it.', 'Blok yang kamu susun tidak melakukan apa-apa sampai program utama menjalankannya.'),
            L('To fix a mistake in a block, you have to fix every run of it.', 'Untuk memperbaiki kesalahan pada blok, kamu harus memperbaiki setiap pemanggilannya.'),
          ],
          [true, true, false],
          L('A block is only built under its name. The main program must run it, and a correction in the block fixes every run at once.', 'Blok hanya disusun di bawah namanya. Program utama harus menjalankannya, dan satu perbaikan pada blok memperbaiki semua pemanggilan sekaligus.'),
          L('Where does the piece live?', 'Di mana potongan itu berada?'),
        ),
        robot(
          'b2',
          L('Pick up the stars at the corners of the square. Build a block called **corner** and run it three times with a repeat. At most 6 blocks.', 'Ambil bintang di sudut-sudut persegi. Susun sebuah blok bernama **corner** dan jalankan tiga kali dengan ulangi. Paling banyak 6 blok.'),
          level({ worlds: ['>.*', '.#.', '*.*'], allowed: ['move', 'turn', 'collect', 'repeat', 'call'], defs: ['corner'], stars: true, max: 6, must: ['call', 'repeat'] }),
          prog([repeat(3, [call('corner')])], { corner: [move(2), collect(), right()] }),
          [L('corner is: move 2, pick up, turn right.', 'corner adalah: maju 2, ambil, belok kanan.'), L('The main program is only: repeat 3 times, run corner.', 'Program utamanya hanya: ulangi 3 kali, jalankan corner.')],
        ),
      ],
    },
    /* --------------------------------------------------------- L16 nested */
    {
      id: 'cb-m4-s2-l2',
      title: L('Blocks That Run Blocks', 'Blok yang Menjalankan Blok'),
      goal: L('You can build a bigger block out of smaller blocks of your own.', 'Kamu bisa menyusun blok yang lebih besar dari blok-blok kecil buatanmu.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: Small Blocks, Bigger Blocks', 'Ayo Amati: Blok Kecil, Blok Lebih Besar'),
          L(
            'A block of your own can **run another block of your own**. That is how big programs are made: first small pieces with clear names, then bigger pieces made of them.\n\nFor a square of stars: build **side** (walk a side and pick up the stars, then turn). Then build **square** that runs **side** four times. The main program only says *run square*.\n\nThe program reads like a description of the task: a square is four sides.',
            'Blok buatanmu dapat **menjalankan blok buatanmu yang lain**. Begitulah program besar dibuat: mula-mula potongan kecil dengan nama yang jelas, lalu potongan lebih besar yang tersusun dari potongan kecil itu.\n\nUntuk persegi bintang: susun **side** (berjalan menyusuri satu sisi dan mengambil bintangnya, lalu belok). Kemudian susun **square** yang menjalankan **side** empat kali. Program utama hanya berkata *jalankan square*.\n\nProgramnya terbaca seperti uraian tugasnya: persegi adalah empat sisi.',
          ),
          L('my block side:\n  repeat 3 times\n    move 1\n    pick up the star\n  turn right\n\nmy block square:\n  run side (four times)\n\nmain:\n  run square', 'blokku side:\n  ulangi 3 kali\n    maju 1\n    ambil bintang\n  belok kanan\n\nblokku square:\n  jalankan side (empat kali)\n\nutama:\n  jalankan square'),
        ),
        concept(
          'c2',
          L('Watch Out!: A Block That Runs Itself', 'Awas, Jebakan!: Blok yang Menjalankan Dirinya Sendiri'),
          L(
            'If a block runs **itself**, the program never ends: the block starts, runs itself, which starts again, and so on. The program is stopped with a message that a block runs itself again and again.\n\nAlso, a block can only run a block that **has been built**. If you run “side” but never built it, the robot tells you that the block has not been built yet.',
            'Bila sebuah blok menjalankan **dirinya sendiri**, program tidak pernah berakhir: blok itu mulai, menjalankan dirinya, yang mulai lagi, dan seterusnya. Program dihentikan dengan pesan bahwa sebuah blok menjalankan dirinya sendiri terus-menerus.\n\nSelain itu, sebuah blok hanya dapat menjalankan blok yang **sudah disusun**. Bila kamu menjalankan “side” tetapi tidak pernah menyusunnya, robot memberi tahu bahwa blok itu belum dibuat.',
          ),
        ),
        quiz(
          'q1',
          L('`side` makes the robot walk 3 steps and turn right. `square` runs `side` 4 times. How many steps does `run square` take in all?', '`side` membuat robot berjalan 3 langkah dan belok kanan. `square` menjalankan `side` 4 kali. Berapa langkah yang diambil `jalankan square` seluruhnya?'),
          [L('3', '3'), L('4', '4'), L('7', '7'), L('12', '12')],
          3,
          L('Each side is 3 steps and there are 4 sides: $4\\times3=12$ steps.', 'Tiap sisi 3 langkah dan ada 4 sisi: $4\\times3=12$ langkah.'),
          L('Multiply the steps of one side by the number of runs.', 'Kalikan langkah satu sisi dengan banyak pemanggilan.'),
        ),
        robot(
          'b1',
          L('Walk down the stairs. Build **step** (1 step, right, 1 step, left) and **stairs** (three steps) and run stairs. At most 8 blocks.', 'Turuni tangga. Susun **step** (1 langkah, kanan, 1 langkah, kiri) dan **stairs** (tiga step) lalu jalankan stairs. Paling banyak 8 blok.'),
          level({ worlds: ['>...', '....', '....', '...G'], allowed: ['move', 'turn', 'call'], defs: ['step', 'stairs'], reach: true, max: 8, must: ['call'] }),
          prog([call('stairs')], { step: [move(1), right(), move(1), left()], stairs: [call('step'), call('step'), call('step')] }),
          [L('Build step first: move 1, turn right, move 1, turn left.', 'Susun step dulu: maju 1, belok kanan, maju 1, belok kiri.'), L('stairs is three “run step” blocks. The main program is “run stairs”.', 'stairs adalah tiga blok “jalankan step”. Program utamanya “jalankan stairs”.')],
        ),
        multi(
          'm1',
          L('Choose ALL the true statements about blocks of your own.', 'Pilih SEMUA pernyataan yang benar tentang blok buatanmu sendiri.'),
          [
            L('One of your blocks can run another one of your blocks.', 'Satu blok buatanmu dapat menjalankan blok buatanmu yang lain.'),
            L('A block must be built before the program can run it.', 'Blok harus disusun sebelum program dapat menjalankannya.'),
            L('A block can safely run itself.', 'Blok dapat menjalankan dirinya sendiri dengan aman.'),
            L('A block you built can be run only once.', 'Blok yang kamu susun hanya dapat dijalankan sekali.'),
          ],
          [0, 1],
          L('Blocks can be built from other blocks, but they must exist first. A block that runs itself never ends, and a built block can be run as often as you like.', 'Blok dapat disusun dari blok lain, tetapi harus sudah ada lebih dulu. Blok yang menjalankan dirinya tidak pernah berakhir, dan blok yang sudah disusun dapat dijalankan sesering mungkin.'),
          L('Think about what each block needs in order to run.', 'Pikirkan apa yang diperlukan tiap blok agar dapat berjalan.'),
        ),
        robot(
          'b2',
          L('Walk once round the edge and pick up all 11 stars. Build **side** and **square**, and run square. At most 9 blocks.', 'Berjalanlah sekali mengelilingi tepi dan ambil semua 11 bintang. Susun **side** dan **square**, lalu jalankan square. Paling banyak 9 blok.'),
          level({ worlds: ['>***', '*##*', '*##*', '****'], allowed: ['move', 'turn', 'collect', 'repeat', 'call'], defs: ['side', 'square'], stars: true, max: 9, must: ['call'] }),
          prog([call('square')], {
            side: [repeat(3, [move(1), collect()]), right()],
            square: [call('side'), call('side'), call('side'), call('side')],
          }),
          [L('side: repeat 3 times of (move 1, pick up), then turn right.', 'side: ulangi 3 kali (maju 1, ambil), lalu belok kanan.'), L('square: four “run side” blocks.', 'square: empat blok “jalankan side”.')],
        ),
      ],
    },
  ],
  project: {
    id: 'cb-m4-s2-p',
    runtime: 'blocks',
    title: L('The Block Builder', 'Penyusun Blok'),
    brief: L(
      'Four levels where the blocks you build are the key to staying within the block limit.',
      'Empat level tempat blok yang kamu susun menjadi kunci agar tidak melewati batas jumlah blok.',
    ),
    requirements: [L('Build a block and run it from the main program.', 'Menyusun sebuah blok dan menjalankannya dari program utama.'), L('Build a block out of other blocks of your own.', 'Menyusun sebuah blok dari blok buatanmu yang lain.')],
    hints: [
      L('Find the piece that comes back and give it a name.', 'Cari potongan yang kembali dan beri nama.'),
      L('Build the small blocks before the bigger ones.', 'Susun blok kecil sebelum yang lebih besar.'),
      L('Every block you run has to be built.', 'Setiap blok yang dijalankan harus sudah disusun.'),
    ],
    xp: 40,
    tasks: [
      task(
        L('**Level 1.** Two rows of four stars. Build **row** and run it twice. At most 8 blocks.', '**Level 1.** Dua baris berisi empat bintang. Susun **row** dan jalankan dua kali. Paling banyak 8 blok.'),
        level({ worlds: ['>****', '****.'], allowed: ['move', 'turn', 'collect', 'repeat', 'call'], defs: ['row'], stars: true, max: 8, must: ['call'] }),
        prog([call('row'), right(), move(1), right(), call('row')], { row: [repeat(4, [move(1), collect()])] }),
      ),
      task(
        L('**Level 2.** Stars at three corners of a large square. Build **corner**, run it with a repeat. At most 6 blocks.', '**Level 2.** Bintang di tiga sudut persegi besar. Susun **corner**, jalankan dengan ulangi. Paling banyak 6 blok.'),
        level({ worlds: ['>..*', '.##.', '.##.', '*..*'], allowed: ['move', 'turn', 'collect', 'repeat', 'call'], defs: ['corner'], stars: true, max: 6, must: ['call', 'repeat'] }),
        prog([repeat(3, [call('corner')])], { corner: [move(3), collect(), right()] }),
      ),
      task(
        L('**Level 3.** A long staircase to the goal. Build **step** and **stairs** (two steps), and run stairs twice. At most 9 blocks.', '**Level 3.** Tangga panjang menuju garis finis. Susun **step** dan **stairs** (dua step), dan jalankan stairs dua kali. Paling banyak 9 blok.'),
        level({ worlds: ['>....', '.....', '.....', '.....', '....G'], allowed: ['move', 'turn', 'call'], defs: ['step', 'stairs'], reach: true, max: 9, must: ['call'] }),
        prog([call('stairs'), call('stairs')], { step: [move(1), right(), move(1), left()], stairs: [call('step'), call('step')] }),
      ),
      task(
        L('**Level 4.** Say **hi**, walk to the goal, and say **hi** again. Build **hello** (it says hi) and **walk** (4 steps).', '**Level 4.** Ucapkan **hi**, berjalan ke garis finis, dan ucapkan **hi** lagi. Susun **hello** (mengucapkan hi) dan **walk** (4 langkah).'),
        level({ worlds: ['>...G'], allowed: ['move', 'say', 'call'], defs: ['hello', 'walk'], reach: true, say: ['hi', 'hi'], must: ['call'] }),
        prog([call('hello'), call('walk'), call('hello')], { hello: [say('hi')], walk: [move(4)] }),
      ),
    ],
  },
}

