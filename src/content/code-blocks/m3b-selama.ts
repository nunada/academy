import type { Submodule } from '../types'
import { L, clear, collect, concept, judge, left, level, move, multi, notGoal, prog, quiz, right, robot, task, when, whileDo } from './b'
import type { Block, Cond } from '../../lib/blocks'

/** Module 3, submodule 2 — the while block: go on until something changes. */

const rightClear: Cond = { t: 'right-clear' }

/** One careful round: step if the way is clear, else turn to the open side. */
const follow = (): Block => when(clear, [move(1)], [when(rightClear, [right()], [left()])])

export const m3s2: Submodule = {
  id: 'cb-m3-s2',
  title: L('Repeat Until', 'Ulangi Sampai'),
  summary: L(
    'The while block repeats as long as a condition holds, so one program can cross a road of any length.',
    'Blok selama mengulang selama suatu syarat berlaku, sehingga satu program dapat melintasi jalan sepanjang apa pun.',
  ),
  lessons: [
    /* --------------------------------------------------------- L11 while */
    {
      id: 'cb-m3-s2-l1',
      title: L('While the Way Is Clear', 'Selama Jalan Terbuka'),
      goal: L('You can repeat orders for as long as a condition is true, without counting.', 'Kamu bisa mengulang perintah selama suatu syarat benar, tanpa menghitung.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: A Loop That Does Not Count', 'Ayo Amati: Perulangan yang Tidak Menghitung'),
          L(
            'A **repeat** block needs a number. But what if you do not know how long the road is?\n\nA **while** block has a **condition** instead of a number. It looks at the condition **before every round**:\n\n- if the answer is **yes**, it does the orders inside and looks again;\n- if the answer is **no**, it stops and the program goes on after the block.\n\nSo “while the way ahead is clear: move 1” walks to the wall, however far that is.',
            'Blok **ulangi** memerlukan sebuah bilangan. Tetapi bagaimana bila kamu tidak tahu seberapa panjang jalannya?\n\nBlok **selama** memakai **syarat** sebagai pengganti bilangan. Ia memeriksa syarat itu **sebelum tiap putaran**:\n\n- bila jawabannya **ya**, ia mengerjakan perintah di dalamnya lalu memeriksa lagi;\n- bila jawabannya **tidak**, ia berhenti dan program berlanjut sesudah blok.\n\nJadi “selama jalan di depan terbuka: maju 1” berjalan sampai tembok, seberapa jauh pun itu.',
          ),
          L('while the way ahead is clear\n  move 1', 'selama jalan di depan terbuka\n  maju 1'),
        ),
        concept(
          'c2',
          L('Watch Out!: A Loop That Never Ends', 'Awas, Jebakan!: Perulangan yang Tidak Pernah Berakhir'),
          L(
            'If the condition **stays true**, the loop never stops. For example “while the way ahead is clear” with **nothing inside** it never changes anything, so the answer is always yes.\n\nThe robot stops the program after a very large number of rounds and tells you it ran for too long.\n\nTo avoid this, make sure that something **inside** the loop can make the condition false: a move that reaches the wall, a step that reaches the goal.',
            'Bila syaratnya **tetap benar**, perulangan tidak pernah berhenti. Misalnya “selama jalan di depan terbuka” dengan **isi kosong** tidak pernah mengubah apa pun, jadi jawabannya selalu ya.\n\nRobot menghentikan program setelah sangat banyak putaran dan memberi tahu bahwa program berjalan terlalu lama.\n\nUntuk menghindarinya, pastikan ada sesuatu **di dalam** perulangan yang dapat membuat syaratnya salah: langkah yang sampai ke tembok, langkah yang sampai ke garis finis.',
          ),
        ),
        quiz(
          'q1',
          L('The robot is 3 squares from the wall and runs this. Where does it stop?', 'Robot berjarak 3 kotak dari tembok dan menjalankan ini. Di mana ia berhenti?'),
          [L('Right in front of the wall', 'Tepat di depan tembok'), L('3 squares before the wall', '3 kotak sebelum tembok'), L('It never stops', 'Ia tidak pernah berhenti'), L('It walks through the wall', 'Ia menembus tembok')],
          0,
          L('The condition is checked before each round. After 3 moves the wall is ahead, the answer is no and the loop ends, with the robot right in front of the wall.', 'Syarat diperiksa sebelum tiap putaran. Setelah 3 langkah tembok ada di depan, jawabannya tidak dan perulangan berakhir, dengan robot tepat di depan tembok.'),
          L('When does the answer to “is the way ahead clear?” become no?', 'Kapan jawaban “apakah jalan di depan terbuka?” menjadi tidak?'),
          L('while the way ahead is clear\n  move 1', 'selama jalan di depan terbuka\n  maju 1'),
        ),
        robot(
          'b1',
          L('Walk to the end of the corridor, on **every** map. Use at most 2 blocks.', 'Berjalanlah sampai ujung lorong, pada **setiap** peta. Pakai paling banyak 2 blok.'),
          level({ worlds: [['>...G'], ['>.........G'], ['>.G']], allowed: ['move', 'while'], reach: true, max: 2, must: ['while'] }),
          prog([whileDo(clear, [move(1)])]),
          [L('You do not know how long the corridor is, so use a while block, not a number.', 'Kamu tidak tahu panjang lorongnya, jadi pakai blok selama, bukan angka.'), L('Press “while”, choose “the way ahead is clear”, then put “move 1” inside.', 'Tekan “selama”, pilih “jalan di depan terbuka”, lalu taruh “maju 1” di dalamnya.')],
        ),
        judge(
          'j1',
          L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          [
            L('A while block checks its condition before every round.', 'Blok selama memeriksa syaratnya sebelum tiap putaran.'),
            L('A while block can run zero rounds.', 'Blok selama bisa berjalan nol putaran.'),
            L('A while block with nothing inside, and a condition that stays true, ends by itself.', 'Blok selama yang kosong dengan syarat yang tetap benar berakhir dengan sendirinya.'),
          ],
          [true, true, false],
          L('The condition is checked first, so if it is false from the start nothing runs. If nothing inside can change the condition, the loop never ends.', 'Syarat diperiksa lebih dulu, jadi bila sejak awal salah, tidak ada yang berjalan. Bila tidak ada yang bisa mengubah syarat di dalamnya, perulangan tidak pernah berakhir.'),
          L('Does anything inside the loop change the answer?', 'Adakah sesuatu di dalam perulangan yang mengubah jawabannya?'),
        ),
        robot(
          'b2',
          L('Walk to the wall, turn right and walk to the next wall. It works on every map. At most 5 blocks.', 'Berjalan sampai tembok, belok kanan, dan berjalan sampai tembok berikutnya. Harus berhasil pada setiap peta. Paling banyak 5 blok.'),
          level({ worlds: [['>...', '....', '...G'], ['>..', '...', '...', '...', '..G']], allowed: ['move', 'turn', 'while'], reach: true, max: 5, must: ['while'] }),
          prog([whileDo(clear, [move(1)]), right(), whileDo(clear, [move(1)])]),
          [L('Two while blocks, with a turn between them.', 'Dua blok selama, dengan sebuah belokan di antaranya.')],
        ),
        robot(
          'b3',
          L('Pick up every star on the way, on every map. At most 3 blocks.', 'Ambil setiap bintang di sepanjang jalan, pada setiap peta. Paling banyak 3 blok.'),
          level({ worlds: [['>***'], ['>*****'], ['>**']], allowed: ['move', 'collect', 'while'], stars: true, max: 3, must: ['while'] }),
          prog([whileDo(clear, [move(1), collect()])]),
          [L('Inside the loop: move 1, then pick up. The loop stops by itself at the wall.', 'Di dalam perulangan: maju 1, lalu ambil. Perulangan berhenti sendiri di tembok.')],
        ),
      ],
    },
    /* ------------------------------------------------------ L12 corners */
    {
      id: 'cb-m3-s2-l2',
      title: L('Until the Goal', 'Sampai Garis Finis'),
      goal: L('You can follow a winding road of any length with a while block and an if block together.', 'Kamu bisa menyusuri jalan berliku sepanjang apa pun dengan blok selama dan blok jika bersama-sama.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: Stop When You Arrive', 'Ayo Amati: Berhenti Ketika Tiba'),
          L(
            'A while block can also test whether the robot **has arrived**. The condition “**not on the goal yet**” is true until the robot stands on the goal, and then the loop ends by itself.\n\nPut an **if … otherwise** block inside it, and you get a program that follows a road of **any length** to the goal:\n\n*while not on the goal yet: if the way ahead is clear, move; otherwise, turn right.*',
            'Blok selama juga dapat menguji apakah robot **sudah tiba**. Syarat “**belum di garis finis**” benar sampai robot berdiri di garis finis, lalu perulangan berakhir dengan sendirinya.\n\nTaruh blok **jika … jika tidak** di dalamnya, dan kamu mendapat program yang menyusuri jalan **sepanjang apa pun** sampai garis finis:\n\n*selama belum di garis finis: jika jalan di depan terbuka, maju; jika tidak, belok kanan.*',
          ),
          L('while not on the goal yet\n  if the way ahead is clear\n    move 1\n  otherwise\n    turn right', 'selama belum di garis finis\n  jika jalan di depan terbuka\n    maju 1\n  jika tidak\n    belok kanan'),
        ),
        concept(
          'c2',
          L('Step by Step: Which Way to Turn?', 'Contoh Bertahap: Belok ke Arah Mana?'),
          L(
            'If the road can turn **both** ways, the robot has to look to the side. The two side conditions are *the way on the right is clear* and *the way on the left is clear*.\n\n1. Step 1: if the way ahead is clear, move 1.\n2. Step 2: otherwise, if the way on the **right** is clear, turn right.\n3. Step 3: otherwise turn left.\n\nA second if inside the “otherwise” is called **nesting**. The order of the questions matters: the program asks about the right side first.',
            'Bila jalan dapat berbelok ke **kedua** arah, robot harus melihat ke samping. Kedua syarat samping adalah *jalan di kanan terbuka* dan *jalan di kiri terbuka*.\n\n1. Langkah 1: jika jalan di depan terbuka, maju 1.\n2. Langkah 2: jika tidak, jika jalan di **kanan** terbuka, belok kanan.\n3. Langkah 3: jika tidak, belok kiri.\n\nJika kedua di dalam “jika tidak” disebut **bersarang**. Urutan pertanyaan penting: program menanyakan sisi kanan lebih dulu.',
          ),
        ),
        quiz(
          'q1',
          L('When does the loop `while not on the goal yet` stop?', 'Kapan perulangan `selama belum di garis finis` berhenti?'),
          [L('As soon as the robot stands on the goal', 'Begitu robot berdiri di garis finis'), L('After 10 rounds', 'Setelah 10 putaran'), L('When the robot hits a wall', 'Ketika robot menabrak tembok'), L('When the robot turns', 'Ketika robot belok')],
          0,
          L('The condition “not on the goal yet” becomes false the moment the robot stands on the goal, and then the loop ends.', 'Syarat “belum di garis finis” menjadi salah begitu robot berdiri di garis finis, lalu perulangan berakhir.'),
          L('What makes “not on the goal yet” false?', 'Apa yang membuat “belum di garis finis” menjadi salah?'),
        ),
        robot(
          'b1',
          L('Follow the road to the goal on both maps. It only turns right. At most 4 blocks.', 'Ikuti jalan sampai garis finis pada kedua peta. Jalan hanya berbelok kanan. Paling banyak 4 blok.'),
          level({ worlds: [['>..#', '##.#', '##G#'], ['>...#', '###.#', '##G.#']], allowed: ['move', 'turn', 'while', 'if'], reach: true, max: 4, must: ['while', 'if'] }),
          prog([whileDo(notGoal, [when(clear, [move(1)], [right()])])]),
          [L('Choose “not on the goal yet” as the while condition.', 'Pilih “belum di garis finis” sebagai syarat selama.'), L('Inside it: if the way ahead is clear move 1, otherwise turn right.', 'Di dalamnya: jika jalan di depan terbuka maju 1, jika tidak belok kanan.')],
        ),
        multi(
          'm1',
          L('The robot follows a road with `if the way ahead is clear: move 1, otherwise: if the right is clear turn right, otherwise turn left`. Choose ALL the places where the robot turns LEFT.', 'Robot menyusuri jalan dengan `jika jalan di depan terbuka: maju 1, jika tidak: jika kanan terbuka belok kanan, jika tidak belok kiri`. Pilih SEMUA tempat robot berbelok KIRI.'),
          [
            L('The way ahead is blocked and only the left side is open', 'Jalan di depan tertutup dan hanya sisi kiri yang terbuka'),
            L('The way ahead is clear', 'Jalan di depan terbuka'),
            L('The way ahead is blocked and both sides are open', 'Jalan di depan tertutup dan kedua sisi terbuka'),
            L('The way ahead is blocked and only the right side is open', 'Jalan di depan tertutup dan hanya sisi kanan yang terbuka'),
          ],
          [0],
          L('The robot asks about the right side first. It turns left only when the front is blocked **and** the right is not open. With both sides open it turns right.', 'Robot menanyakan sisi kanan lebih dulu. Ia berbelok kiri hanya bila depan tertutup **dan** kanan tidak terbuka. Bila kedua sisi terbuka ia berbelok kanan.'),
          L('Follow the questions in order: front, then right.', 'Ikuti pertanyaannya berurutan: depan, lalu kanan.'),
        ),
        robot(
          'b2',
          L('This road turns both ways. One program for both maps. At most 6 blocks.', 'Jalan ini berbelok ke kedua arah. Satu program untuk kedua peta. Paling banyak 6 blok.'),
          level({ worlds: [['>...##', '###.##', '###..G'], ['##..G', '##.##', '>..##']], allowed: ['move', 'turn', 'while', 'if'], reach: true, max: 6, must: ['while', 'if'] }),
          prog([whileDo(notGoal, [follow()])]),
          [L('Put “if the way on the right is clear” inside the “otherwise”.', 'Taruh “jika jalan di kanan terbuka” di dalam “jika tidak”.'), L('Use the tabs to look at both maps. One starts with a right turn and the other with a left turn.', 'Pakai tab untuk melihat kedua peta. Satu dimulai dengan belokan kanan dan yang lain dengan belokan kiri.')],
        ),
      ],
    },
  ],
  project: {
    id: 'cb-m3-s2-p',
    runtime: 'blocks',
    title: L('Any Road, Any Length', 'Jalan Apa Pun, Sepanjang Apa Pun'),
    brief: L(
      'Four levels, each with several maps. No counting allowed: one program has to work everywhere.',
      'Empat level, masing-masing dengan beberapa peta. Dilarang menghitung: satu program harus berjalan di mana-mana.',
    ),
    requirements: [L('Use while instead of a number of repeats.', 'Memakai selama sebagai pengganti banyak pengulangan.'), L('Combine while with if and otherwise.', 'Menggabungkan selama dengan jika dan jika tidak.')],
    hints: [
      L('Look at every map with the tabs before you build.', 'Lihat setiap peta dengan tab sebelum menyusun.'),
      L('Make sure something inside the loop can make the condition false.', 'Pastikan ada sesuatu di dalam perulangan yang bisa membuat syaratnya salah.'),
      L('If the robot runs for too long the loop never ends.', 'Bila robot berjalan terlalu lama, perulangan tidak pernah berakhir.'),
    ],
    xp: 40,
    tasks: [
      task(
        L('**Level 1.** Walk to the end of the corridor. At most 2 blocks.', '**Level 1.** Berjalan sampai ujung lorong. Paling banyak 2 blok.'),
        level({ worlds: [['>....G'], ['>..G'], ['>.........G']], allowed: ['move', 'while'], reach: true, max: 2, must: ['while'] }),
        prog([whileDo(clear, [move(1)])]),
      ),
      task(
        L('**Level 2.** Walk to the wall, turn right and walk to the next wall. At most 5 blocks.', '**Level 2.** Berjalan sampai tembok, belok kanan, dan berjalan sampai tembok berikutnya. Paling banyak 5 blok.'),
        level({ worlds: [['>....', '.....', '.....', '....G'], ['>..', '...', '...', '...', '...', '..G']], allowed: ['move', 'turn', 'while'], reach: true, max: 5, must: ['while'] }),
        prog([whileDo(clear, [move(1)]), right(), whileDo(clear, [move(1)])]),
      ),
      task(
        L('**Level 3.** Pick up every star in the corridor, whatever its length. At most 3 blocks.', '**Level 3.** Ambil setiap bintang di lorong, berapa pun panjangnya. Paling banyak 3 blok.'),
        level({ worlds: [['>***'], ['>******'], ['>*']], allowed: ['move', 'collect', 'while'], stars: true, max: 3, must: ['while'] }),
        prog([whileDo(clear, [move(1), collect()])]),
      ),
      task(
        L('**Level 4.** A road that turns left and right. At most 6 blocks.', '**Level 4.** Jalan yang berbelok ke kiri dan ke kanan. Paling banyak 6 blok.'),
        level({ worlds: [['>..##', '##...', '####G'], ['####G', '##...', '>..##']], allowed: ['move', 'turn', 'while', 'if'], reach: true, max: 6, must: ['while', 'if'] }),
        prog([whileDo(notGoal, [follow()])]),
      ),
    ],
  },
}
