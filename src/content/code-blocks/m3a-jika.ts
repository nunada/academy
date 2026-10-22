import type { Submodule } from '../types'
import { L, clear, concept, judge, left, level, move, multi, prog, quiz, repeat, right, robot, task, wall, when } from './b'
import type { Block, Cond } from '../../lib/blocks'

/** Module 3, submodule 1 — the robot decides: if and otherwise. */

const rightClear: Cond = { t: 'right-clear' }

/** Take a step if the way is clear; otherwise turn towards the open side. */
const follow = (): Block => when(clear, [move(1)], [when(rightClear, [right()], [left()])])

export const m3s1: Submodule = {
  id: 'cb-m3-s1',
  title: L('Decisions', 'Keputusan'),
  summary: L(
    'Let the robot look before it acts: if a wall is ahead turn, otherwise go on.',
    'Membiarkan robot melihat sebelum bertindak: bila ada tembok di depan ia belok, jika tidak ia terus.',
  ),
  lessons: [
    /* ------------------------------------------------------------- L9 if */
    {
      id: 'cb-m3-s1-l1',
      title: L('If a Wall Is Ahead', 'Jika Ada Tembok di Depan'),
      goal: L('You can use an if block so that one program works on maps that are not the same.', 'Kamu bisa memakai blok jika agar satu program berjalan pada peta yang tidak sama.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: The Robot Has Eyes', 'Ayo Amati: Robot Punya Mata'),
          L(
            'So far the program was made for **one** map: you counted the squares. A real program should also work when the map changes.\n\nFor that the robot can **look**. An **if** block has a **condition**, a question the robot answers with yes or no, and a list of orders that run **only if the answer is yes**.\n\nSome conditions: *there is a wall ahead*, *the way ahead is clear*, *the way on the left is clear*, *standing on a star*.\n\nThe orders inside the if block are skipped when the answer is no.',
            'Sejauh ini program dibuat untuk **satu** peta: kamu menghitung kotaknya. Program yang sebenarnya juga harus berjalan bila petanya berubah.\n\nUntuk itu robot bisa **melihat**. Blok **jika** punya **syarat**, yaitu pertanyaan yang dijawab robot dengan ya atau tidak, dan daftar perintah yang berjalan **hanya bila jawabannya ya**.\n\nBeberapa syarat: *ada tembok di depan*, *jalan di depan terbuka*, *jalan di kiri terbuka*, *berdiri di atas bintang*.\n\nPerintah di dalam blok jika dilewati bila jawabannya tidak.',
          ),
          L('if there is a wall ahead\n  turn right', 'jika ada tembok di depan\n  belok kanan'),
        ),
        concept(
          'c2',
          L('Step by Step: One Program for Two Maps', 'Contoh Bertahap: Satu Program untuk Dua Peta'),
          L(
            'Two maps: the road goes along the top and then turns down. On the first map the corner is after 2 squares, on the second after 1 square. In both, the robot makes 4 moves in all.\n\nThis program works on both:\n\n1. Step 1: Repeat 4 times:\n2. Step 2: **if** there is a wall ahead, turn right;\n3. Step 3: move 1.\n\nThe robot only turns **where the wall is**, so it does not matter how far the corner is.',
            'Dua peta: jalannya menyusuri atas lalu berbelok ke bawah. Pada peta pertama sudutnya setelah 2 kotak, pada peta kedua setelah 1 kotak. Pada keduanya robot melakukan 4 langkah seluruhnya.\n\nProgram ini berjalan pada keduanya:\n\n1. Langkah 1: Ulangi 4 kali:\n2. Langkah 2: **jika** ada tembok di depan, belok kanan;\n3. Langkah 3: maju 1.\n\nRobot hanya berbelok **di tempat tembok berada**, jadi tidak masalah seberapa jauh sudutnya.',
          ),
          L('repeat 4 times\n  if there is a wall ahead\n    turn right\n  move 1', 'ulangi 4 kali\n  jika ada tembok di depan\n    belok kanan\n  maju 1'),
        ),
        quiz(
          'q1',
          L('The robot has a wall ahead. What does the if block do?', 'Robot punya tembok di depan. Apa yang dilakukan blok jika?'),
          [L('It runs the orders inside it', 'Ia menjalankan perintah di dalamnya'), L('It skips the orders inside it', 'Ia melewati perintah di dalamnya'), L('It stops the program', 'Ia menghentikan program'), L('It moves the robot back', 'Ia memundurkan robot')],
          0,
          L('The condition “there is a wall ahead” is true, so the orders inside the if block run.', 'Syarat “ada tembok di depan” benar, jadi perintah di dalam blok jika berjalan.'),
          L('Is the answer to the question yes or no?', 'Apakah jawaban pertanyaannya ya atau tidak?'),
          L('if there is a wall ahead\n  turn right', 'jika ada tembok di depan\n  belok kanan'),
        ),
        robot(
          'b1',
          L('One program for **both** maps: the corner turns right. Use at most 5 blocks.', 'Satu program untuk **kedua** peta: sudutnya berbelok ke kanan. Pakai paling banyak 5 blok.'),
          level({ worlds: [['>..#', '##.#', '##G#'], ['>.#', '#.#', '#.#', '#G#']], allowed: ['move', 'turn', 'repeat', 'if'], reach: true, max: 5, must: ['if'] }),
          prog([repeat(4, [when(wall, [right()]), move(1)])]),
          [L('Use the tabs to look at both maps. Each takes 4 moves.', 'Pakai tab untuk melihat kedua peta. Masing-masing memerlukan 4 gerakan.'), L('Inside the repeat: an if (wall ahead) with a right turn, then move 1.', 'Di dalam ulangi: sebuah jika (ada tembok di depan) berisi belok kanan, lalu maju 1.')],
        ),
        judge(
          'j1',
          L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          [
            L('The orders inside an if block run only when its condition is true.', 'Perintah di dalam blok jika berjalan hanya bila syaratnya benar.'),
            L('A program with an if block can work on maps that are not the same.', 'Program dengan blok jika dapat berjalan pada peta yang tidak sama.'),
            L('If the condition is false, the program stops.', 'Bila syaratnya salah, program berhenti.'),
          ],
          [true, true, false],
          L('When the condition is false the orders inside are simply skipped, and the program carries on with the next block.', 'Bila syaratnya salah, perintah di dalamnya dilewati begitu saja, dan program melanjutkan ke blok berikutnya.'),
          L('What happens to the blocks after an if when the answer is no?', 'Apa yang terjadi pada blok sesudah jika bila jawabannya tidak?'),
        ),
        robot(
          'b2',
          L('Now both corners turn **left**. One program for both maps. At most 5 blocks.', 'Sekarang kedua sudut berbelok ke **kiri**. Satu program untuk kedua peta. Paling banyak 5 blok.'),
          level({ worlds: [['##G', '##.', '>..'], ['#G#', '#.#', '#.#', '>.#']], allowed: ['move', 'turn', 'repeat', 'if'], reach: true, max: 5, must: ['if'] }),
          prog([repeat(4, [when(wall, [left()]), move(1)])]),
          [L('Same idea as before. Which way does the road turn?', 'Gagasan yang sama seperti tadi. Ke arah mana jalannya berbelok?')],
        ),
      ],
    },
    /* ---------------------------------------------------------- L10 else */
    {
      id: 'cb-m3-s1-l2',
      title: L('If … Otherwise …', 'Jika … Jika Tidak …'),
      goal: L('You can give the robot two choices: one when the answer is yes and another when it is no.', 'Kamu bisa memberi robot dua pilihan: satu bila jawabannya ya dan satu lagi bila tidak.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: A Second Choice', 'Ayo Amati: Pilihan Kedua'),
          L(
            'Often there are **two** things to do: one when the way is clear, and another when it is not. The **otherwise** part of an if block holds the orders for the answer **no**.\n\n- Condition true → the orders after **if** run.\n- Condition false → the orders after **otherwise** run.\n\nExactly **one** of the two lists runs, never both.',
            'Sering ada **dua** hal yang perlu dilakukan: satu bila jalan terbuka, dan satu lagi bila tidak. Bagian **jika tidak** pada blok jika berisi perintah untuk jawaban **tidak**.\n\n- Syarat benar → perintah sesudah **jika** berjalan.\n- Syarat salah → perintah sesudah **jika tidak** berjalan.\n\n**Tepat satu** dari kedua daftar yang berjalan, tidak pernah keduanya.',
          ),
          L('if the way ahead is clear\n  move 1\notherwise\n  turn right', 'jika jalan di depan terbuka\n  maju 1\njika tidak\n  belok kanan'),
        ),
        concept(
          'c2',
          L('Step by Step: Following a Road', 'Contoh Bertahap: Mengikuti Sebuah Jalan'),
          L(
            'Press “add otherwise” under an if block to open the second list.\n\nFor a road that only ever turns right, every round the robot does ONE thing:\n\n1. Step 1: if the way ahead is clear, move 1;\n2. Step 2: otherwise turn right.\n\nA turn **uses up one round**, so the repeat count is the number of moves **plus** the number of turns.',
            'Tekan “tambah jika tidak” di bawah blok jika untuk membuka daftar kedua.\n\nUntuk jalan yang hanya berbelok ke kanan, tiap putaran robot melakukan SATU hal:\n\n1. Langkah 1: jika jalan di depan terbuka, maju 1;\n2. Langkah 2: jika tidak belok kanan.\n\nSatu belokan **menghabiskan satu putaran**, jadi banyak pengulangan adalah banyak langkah **ditambah** banyak belokan.',
          ),
        ),
        quiz(
          'q1',
          L('A road needs 5 moves and 1 turn. How many times must the loop go round?', 'Sebuah jalan memerlukan 5 langkah dan 1 belokan. Berapa kali perulangan harus berputar?'),
          [L('5 times', '5 kali'), L('6 times', '6 kali'), L('4 times', '4 kali'), L('1 time', '1 kali')],
          1,
          L('Each round does one thing, a move or a turn: $5+1=6$ rounds.', 'Tiap putaran melakukan satu hal, maju atau belok: $5+1=6$ putaran.'),
          L('Count the moves and the turns together.', 'Hitung langkah dan belokan bersama-sama.'),
        ),
        robot(
          'b1',
          L('Follow the road on **both** maps. The road only turns right. At most 4 blocks.', 'Ikuti jalan pada **kedua** peta. Jalan hanya berbelok kanan. Paling banyak 4 blok.'),
          level({ worlds: [['>...#', '###.#', '###G#'], ['>.#', '#.#', '#.#', '#.#', '#G#']], allowed: ['move', 'turn', 'repeat', 'if'], reach: true, max: 4, must: ['if'] }),
          prog([repeat(6, [when(clear, [move(1)], [right()])])]),
          [L('Each map needs 6 rounds: count the moves and the turn.', 'Tiap peta memerlukan 6 putaran: hitung langkah dan belokannya.'), L('Inside the repeat: an if (the way ahead is clear) with move 1, and otherwise turn right.', 'Di dalam ulangi: sebuah jika (jalan di depan terbuka) berisi maju 1, dan jika tidak belok kanan.')],
        ),
        multi(
          'm1',
          L('A robot runs `if the way ahead is clear: move 1, otherwise: turn right` in a loop. Choose ALL true statements.', 'Robot menjalankan `jika jalan di depan terbuka: maju 1, jika tidak: belok kanan` dalam perulangan. Pilih SEMUA pernyataan yang benar.'),
          [
            L('When the way is clear, only the move runs.', 'Bila jalan terbuka, hanya maju yang berjalan.'),
            L('When there is a wall, only the turn runs.', 'Bila ada tembok, hanya belok yang berjalan.'),
            L('Both the move and the turn run in the same round.', 'Maju dan belok berjalan dalam putaran yang sama.'),
            L('The robot never moves on a map with a wall.', 'Robot tidak pernah maju pada peta yang bertembok.'),
          ],
          [0, 1],
          L('Exactly one of the two lists runs in each round. Walls only stop the robot at the corners; it moves everywhere else.', 'Tepat satu dari kedua daftar berjalan pada tiap putaran. Tembok hanya menghentikan robot di sudut; di tempat lain ia maju.'),
          L('One list per round, never both.', 'Satu daftar tiap putaran, tidak pernah keduanya.'),
        ),
        robot(
          'b2',
          L('This road turns **both** ways. If the way ahead is not clear, turn to the side that is open. At most 7 blocks.', 'Jalan ini berbelok ke **kedua** arah. Bila jalan di depan tidak terbuka, belok ke sisi yang terbuka. Paling banyak 7 blok.'),
          level({ worlds: [['>..##', '##..G'], ['>.##', '#.##', '#..G']], allowed: ['move', 'turn', 'repeat', 'if'], reach: true, max: 7, must: ['if'] }),
          prog([repeat(7, [follow()])]),
          [L('Put a second if inside the “otherwise”: if the way on the right is clear turn right, otherwise turn left.', 'Taruh jika kedua di dalam “jika tidak”: bila jalan di kanan terbuka belok kanan, jika tidak belok kiri.'), L('Each map takes 7 rounds.', 'Tiap peta memerlukan 7 putaran.')],
        ),
      ],
    },
  ],
  project: {
    id: 'cb-m3-s1-p',
    runtime: 'blocks',
    title: L('The Careful Robot', 'Robot yang Hati-Hati'),
    brief: L(
      'Four levels with two maps each. One program has to work on both.',
      'Empat level dengan dua peta masing-masing. Satu program harus berjalan pada keduanya.',
    ),
    requirements: [L('Use if and otherwise so the program does not depend on the exact map.', 'Memakai jika dan jika tidak agar program tidak bergantung pada peta yang persis.'), L('Count the rounds of the loop for every map.', 'Menghitung putaran perulangan untuk setiap peta.')],
    hints: [
      L('Use the Map tabs to look at both maps before you build.', 'Pakai tab Peta untuk melihat kedua peta sebelum menyusun.'),
      L('A turn takes up one round of the loop.', 'Satu belokan menghabiskan satu putaran perulangan.'),
      L('Run the program on each map. If it works on one but not the other, the loop count is probably wrong.', 'Jalankan program pada tiap peta. Bila berhasil di satu peta tetapi tidak di yang lain, banyak pengulangan mungkin salah.'),
    ],
    xp: 40,
    tasks: [
      task(
        L('**Level 1.** The road turns right. Both maps take 5 moves. At most 5 blocks.', '**Level 1.** Jalan berbelok kanan. Kedua peta memerlukan 5 langkah. Paling banyak 5 blok.'),
        level({ worlds: [['>...#', '###.#', '###G#'], ['>.#', '#.#', '#.#', '#.#', '#G#']], allowed: ['move', 'turn', 'repeat', 'if'], reach: true, max: 5, must: ['if'] }),
        prog([repeat(5, [when(wall, [right()]), move(1)])]),
      ),
      task(
        L('**Level 2.** The road turns left. Both maps take 5 moves. At most 5 blocks.', '**Level 2.** Jalan berbelok kiri. Kedua peta memerlukan 5 langkah. Paling banyak 5 blok.'),
        level({ worlds: [['##G', '##.', '##.', '>..'], ['#G#', '#.#', '#.#', '#.#', '>.#']], allowed: ['move', 'turn', 'repeat', 'if'], reach: true, max: 5, must: ['if'] }),
        prog([repeat(5, [when(wall, [left()]), move(1)])]),
      ),
      task(
        L('**Level 3.** Use if and otherwise. The road turns right; each map takes 6 rounds. At most 4 blocks.', '**Level 3.** Pakai jika dan jika tidak. Jalan berbelok kanan; tiap peta memerlukan 6 putaran. Paling banyak 4 blok.'),
        level({ worlds: [['>...#', '###.#', '###G#'], ['>.#', '#.#', '#.#', '#.#', '#G#']], allowed: ['move', 'turn', 'repeat', 'if'], reach: true, max: 4, must: ['if'] }),
        prog([repeat(6, [when(clear, [move(1)], [right()])])]),
      ),
      task(
        L('**Level 4.** The road turns both ways. Each map takes 6 rounds. At most 7 blocks.', '**Level 4.** Jalan berbelok ke kedua arah. Tiap peta memerlukan 6 putaran. Paling banyak 7 blok.'),
        level({ worlds: [['>.##', '#..G'], ['#..G', '>.##']], allowed: ['move', 'turn', 'repeat', 'if'], reach: true, max: 7, must: ['if'] }),
        prog([repeat(6, [follow()])]),
      ),
    ],
  },
}
