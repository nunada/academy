import type { Submodule } from '../types'
import { L, collect, concept, fill, judge, level, move, prog, quiz, right, robot, say, sayStars, task } from './b'

/** Module 1, submodule 2 — stars to pick up, and words to say. */

export const m1s2: Submodule = {
  id: 'cb-m1-s2',
  title: L('Stars and Words', 'Bintang dan Kata-Kata'),
  summary: L(
    'Pick up stars with the collect block, make the robot say things, and report a count.',
    'Mengambil bintang dengan blok ambil, membuat robot mengucapkan sesuatu, dan melaporkan sebuah hitungan.',
  ),
  lessons: [
    /* ------------------------------------------------------------ L3 stars */
    {
      id: 'cb-m1-s2-l1',
      title: L('Pick Up Stars', 'Ambil Bintang'),
      goal: L('You can walk the robot to each star and pick it up.', 'Kamu bisa membawa robot ke tiap bintang dan mengambilnya.'),
      xp: 15,
      steps: [
        concept(
          'c1',
          L('Look Closely: Collecting', 'Ayo Amati: Mengambil'),
          L(
            'A yellow **star** lies on a square. Walking over it does **nothing**: the robot picks it up only when you give the **pick up the star** block **while it stands on the star**.\n\nA good program for a corridor of stars is: walk to the star, pick it up, walk to the next one, pick it up.\n\nSome levels ask you to reach the goal **and** pick up every star. Then both must be true at the end.',
            '**Bintang** kuning tergeletak di sebuah kotak. Berjalan melewatinya **tidak** melakukan apa-apa: robot mengambilnya hanya bila kamu memberi blok **ambil bintang** **saat robot berdiri di atas bintang**.\n\nProgram yang baik untuk lorong berbintang adalah: berjalan ke bintang, ambil, berjalan ke bintang berikutnya, ambil.\n\nBeberapa level meminta kamu mencapai garis finis **dan** mengambil semua bintang. Maka keduanya harus terpenuhi di akhir.',
          ),
          L('move 2\npick up the star\nmove 1', 'maju 2\nambil bintang\nmaju 1'),
        ),
        concept(
          'c2',
          L('Watch Out!: Pick Up on the Right Square', 'Awas, Jebakan!: Ambil di Kotak yang Tepat'),
          L(
            'If the robot is **not** on a star when it meets the pick-up block, nothing happens: no error, but the star stays where it is.\n\nSo count carefully. For stars at 2 and 4 steps from the start:\n\n1. Step 1: `move 2`, `pick up`: the first star is taken;\n2. Step 2: `move 2` (not 4!), `pick up`: the robot is already at 2, so 2 more steps reach 4.\n\nThe robot remembers where it **is**, not where it started.',
            'Bila robot **tidak** berada di atas bintang saat bertemu blok ambil, tidak terjadi apa-apa: tidak ada kesalahan, tetapi bintang tetap di tempatnya.\n\nJadi hitung dengan teliti. Untuk bintang di 2 dan 4 langkah dari awal:\n\n1. Langkah 1: `maju 2`, `ambil`: bintang pertama terambil;\n2. Langkah 2: `maju 2` (bukan 4!), `ambil`: robot sudah di 2, jadi 2 langkah lagi sampai di 4.\n\nRobot mengingat di mana ia **berada**, bukan di mana ia mulai.',
          ),
        ),
        quiz(
          'q1',
          L('Stars lie 1 and 4 squares ahead of the robot. After picking up the first star, how far must it move to reach the second?', 'Bintang berada 1 dan 4 kotak di depan robot. Setelah mengambil bintang pertama, berapa langkah lagi agar sampai di bintang kedua?'),
          [L('4 steps', '4 langkah'), L('3 steps', '3 langkah'), L('5 steps', '5 langkah'), L('1 step', '1 langkah')],
          1,
          L('The robot is already 1 step along, so it needs $4-1=3$ more steps.', 'Robot sudah maju 1 langkah, jadi ia memerlukan $4-1=3$ langkah lagi.'),
          L('Subtract the steps the robot has already walked.', 'Kurangkan langkah yang sudah ditempuh robot.'),
        ),
        robot(
          'b1',
          L('Pick up both stars and finish on the goal.', 'Ambil kedua bintang dan berhenti di garis finis.'),
          level({ worlds: ['>.*.*G'], allowed: ['move', 'collect'], reach: true, stars: true }),
          prog([move(2), collect(), move(2), collect(), move(1)]),
          [L('The stars are 2 and 4 steps ahead, and the goal is 5 steps ahead.', 'Bintang ada di 2 dan 4 langkah, garis finis di 5 langkah.'), L('Walk, pick up, walk, pick up, walk.', 'Jalan, ambil, jalan, ambil, jalan.')],
        ),
        fill(
          'f1',
          L('Complete the program so that the robot picks up the star 3 steps ahead.', 'Lengkapi program agar robot mengambil bintang 3 langkah di depannya.'),
          { en: 'move ___\n___ the star', id: 'maju ___\n___ bintang' },
          { en: ['3', 'pick up'], id: ['3', 'ambil'] },
          L('The robot walks 3 steps and then picks the star up.', 'Robot berjalan 3 langkah lalu mengambil bintang.'),
          L('First the number of steps, then the name of the second block.', 'Pertama banyak langkah, lalu nama blok kedua.'),
        ),
        robot(
          'b2',
          L('Pick up both stars. The corner is part of the path.', 'Ambil kedua bintang. Tikungan termasuk dalam jalurnya.'),
          level({ worlds: ['>.*', '##.', '##*'], allowed: ['move', 'turn', 'collect'], stars: true }),
          prog([move(2), collect(), right(), move(2), collect()]),
          [L('The first star is at the end of the top row.', 'Bintang pertama ada di ujung baris atas.'), L('Pick it up before you turn.', 'Ambil sebelum kamu belok.')],
        ),
      ],
    },
    /* ------------------------------------------------------------- L4 say */
    {
      id: 'cb-m1-s2-l2',
      title: L('Say It', 'Ucapkan'),
      goal: L('You can make the robot say a word or report how many stars it holds.', 'Kamu bisa membuat robot mengucapkan sebuah kata atau melaporkan berapa bintang yang ia pegang.'),
      xp: 15,
      steps: [
        concept(
          'c1',
          L('Look Closely: A Block That Talks', 'Ayo Amati: Blok yang Berbicara'),
          L(
            'The **say** block makes the robot say something, and the words show up under the map. You choose what it says:\n\n- **a word**, which you type;\n- **a number**;\n- **stars I hold**, the number of stars the robot has picked up so far.\n\nSaying does not move the robot. A program can say something at the start, in the middle and at the end, and the robot says the things **in the order of the blocks**.',
            'Blok **ucapkan** membuat robot mengatakan sesuatu, dan kata-katanya muncul di bawah peta. Kamu memilih apa yang diucapkan:\n\n- **sebuah kata**, yang kamu ketik;\n- **sebuah bilangan**;\n- **bintang yang kupegang**, banyaknya bintang yang sudah diambil robot sampai saat itu.\n\nMengucapkan tidak memindahkan robot. Program dapat mengucapkan sesuatu di awal, di tengah, dan di akhir, dan robot mengucapkannya **menurut urutan blok**.',
          ),
          L('say start\nmove 3\nsay end', 'ucapkan start\nmaju 3\nucapkan end'),
        ),
        concept(
          'c2',
          L('Step by Step: Reporting a Count', 'Contoh Bertahap: Melaporkan Hitungan'),
          L(
            'To report how many stars the robot picked up:\n\n1. Step 1: Pick up all the stars.\n2. Step 2: **Last of all**, add `say stars I hold`.\n\nThe number said is the count **at that moment**. If you put the say block before the last pick-up, the report will be one too low.',
            'Untuk melaporkan berapa bintang yang diambil robot:\n\n1. Langkah 1: Ambil semua bintang.\n2. Langkah 2: **Paling akhir**, tambahkan `ucapkan bintang yang kupegang`.\n\nBilangan yang diucapkan adalah hitungan **pada saat itu**. Bila kamu menaruh blok ucapkan sebelum pengambilan terakhir, laporannya kurang satu.',
          ),
          L('move 1\npick up the star\nmove 2\npick up the star\nsay stars I hold', 'maju 1\nambil bintang\nmaju 2\nambil bintang\nucapkan bintang yang kupegang'),
        ),
        quiz(
          'q1',
          L('What does the robot say?', 'Apa yang diucapkan robot?'),
          [L('1 then 2', '1 lalu 2'), L('2 then 1', '2 lalu 1'), L('Only 2', 'Hanya 2'), L('Nothing', 'Tidak mengucapkan apa-apa')],
          0,
          L('The robot says the words in the order of the blocks: first 1, then 2.', 'Robot mengucapkan kata-kata menurut urutan blok: pertama 1, lalu 2.'),
          L('Read the program from the top down.', 'Baca program dari atas ke bawah.'),
          L('say 1\nmove 1\nsay 2', 'ucapkan 1\nmaju 1\nucapkan 2'),
        ),
        robot(
          'b1',
          L('Make the robot say **Hello**. Change the word in the say block.', 'Buat robot mengucapkan **Hello**. Ubah kata pada blok ucapkan.'),
          level({ worlds: ['>.'], allowed: ['say'], say: ['Hello'] }),
          prog([say('Hello')]),
          [L('Press “say”. It says “hi” at first, so change the word.', 'Tekan “ucapkan”. Mula-mula ia mengucapkan “hi”, jadi ubah katanya.'), L('Type Hello with a capital H.', 'Ketik Hello dengan H besar.')],
        ),
        robot(
          'b2',
          L('Say **start**, walk to the goal, then say **end**.', 'Ucapkan **start**, berjalan ke garis finis, lalu ucapkan **end**.'),
          level({ worlds: ['>...G'], allowed: ['move', 'say'], reach: true, say: ['start', 'end'] }),
          prog([say('start'), move(4), say('end')]),
          [L('Three blocks: say, move, say.', 'Tiga blok: ucapkan, maju, ucapkan.')],
        ),
        judge(
          'j1',
          L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          [
            L('The say block moves the robot.', 'Blok ucapkan memindahkan robot.'),
            L('The robot says things in the order of the blocks.', 'Robot mengucapkan sesuatu menurut urutan blok.'),
            L('`say stars I hold` before the last pick-up reports one star too few.', '`ucapkan bintang yang kupegang` sebelum pengambilan terakhir melaporkan satu bintang terlalu sedikit.'),
            L('The word in a say block cannot be changed.', 'Kata pada blok ucapkan tidak bisa diubah.'),
          ],
          [false, true, true, false],
          L('Saying never moves the robot, it follows the order of the blocks, the count is taken at the moment of saying, and you can type any word.', 'Mengucapkan tidak pernah memindahkan robot, mengikuti urutan blok, hitungannya diambil saat mengucapkan, dan kamu bisa mengetik kata apa pun.'),
          L('Think about what the robot knows at the moment it reaches the say block.', 'Pikirkan apa yang diketahui robot saat sampai pada blok ucapkan.'),
        ),
        robot(
          'b3',
          L('Pick up both stars, then say how many you hold.', 'Ambil kedua bintang, lalu ucapkan berapa yang kamu pegang.'),
          level({ worlds: ['>*.*'], allowed: ['move', 'collect', 'say'], stars: true, say: ['2'] }),
          prog([move(1), collect(), move(2), collect(), sayStars()]),
          [L('Pick up first, say last.', 'Ambil dulu, ucapkan paling akhir.'), L('Choose “stars I hold” in the say block.', 'Pilih “bintang yang kupegang” pada blok ucapkan.')],
        ),
      ],
    },
  ],
  project: {
    id: 'cb-m1-s2-p',
    runtime: 'blocks',
    title: L('Treasure and Message', 'Harta Karun dan Pesan'),
    brief: L(
      'Four levels that mix everything so far: moves, turns, stars and words.',
      'Empat level yang memadukan semua yang sudah dipelajari: gerak, belok, bintang, dan kata.',
    ),
    requirements: [
      L('Pick up every star on the map.', 'Mengambil setiap bintang di peta.'),
      L('Say the right thing at the right moment.', 'Mengucapkan hal yang tepat pada saat yang tepat.'),
    ],
    hints: [
      L('Write the path first, then add the pick-ups and the words.', 'Tulis jalurnya dulu, lalu tambahkan pengambilan dan kata-katanya.'),
      L('The count you say is the count at that moment.', 'Hitungan yang diucapkan adalah hitungan pada saat itu.'),
      L('Press Run to watch what the robot really does.', 'Tekan Jalankan untuk melihat apa yang benar-benar dilakukan robot.'),
    ],
    xp: 40,
    tasks: [
      task(
        L('**Level 1.** Pick up the three stars and say how many you hold.', '**Level 1.** Ambil ketiga bintang dan ucapkan berapa yang kamu pegang.'),
        level({ worlds: ['>*.*.*'], allowed: ['move', 'collect', 'say'], stars: true, say: ['3'] }),
        prog([move(1), collect(), move(2), collect(), move(2), collect(), sayStars()]),
      ),
      task(
        L('**Level 2.** Say **go**, walk to the goal, then say **arrived**.', '**Level 2.** Ucapkan **go**, berjalan ke garis finis, lalu ucapkan **arrived**.'),
        level({ worlds: ['>..G'], allowed: ['move', 'say'], reach: true, say: ['go', 'arrived'] }),
        prog([say('go'), move(3), say('arrived')]),
      ),
      task(
        L('**Level 3.** Three stars around the corners. Pick them all up.', '**Level 3.** Tiga bintang di sekeliling tikungan. Ambil semuanya.'),
        level({ worlds: ['>.*', '##.', '*.*'], allowed: ['move', 'turn', 'collect'], stars: true }),
        prog([move(2), collect(), right(), move(2), collect(), right(), move(2), collect()]),
      ),
      task(
        L('**Level 4.** Pick up both stars, finish on the goal and say how many you hold.', '**Level 4.** Ambil kedua bintang, berhenti di garis finis, dan ucapkan berapa yang kamu pegang.'),
        level({ worlds: ['>*.#', '##*#', '##G#'], allowed: ['move', 'turn', 'collect', 'say'], reach: true, stars: true, say: ['2'] }),
        prog([move(1), collect(), move(1), right(), move(1), collect(), move(1), sayStars()]),
      ),
    ],
  },
}
