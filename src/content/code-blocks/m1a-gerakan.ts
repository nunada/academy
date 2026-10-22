import type { Submodule } from '../types'
import { L, concept, judge, left, level, move, order, prog, quiz, right, robot, task } from './b'

/** Module 1, submodule 1 — telling the robot where to go. */

export const m1s1: Submodule = {
  id: 'cb-m1-s1',
  title: L('The Robot and Its Moves', 'Robot dan Gerakannya'),
  summary: L(
    'Meet the robot, give it orders with move and turn blocks, and learn that a program runs from the top down.',
    'Berkenalan dengan robot, memberinya perintah dengan blok maju dan belok, dan memahami bahwa program berjalan dari atas ke bawah.',
  ),
  lessons: [
    /* ------------------------------------------------------------ L1 move */
    {
      id: 'cb-m1-s1-l1',
      title: L('Move Forward', 'Maju'),
      goal: L(
        'You can build a program of move blocks that takes the robot to the goal.',
        'Kamu bisa menyusun program dari blok maju yang membawa robot ke garis finis.',
      ),
      xp: 15,
      steps: [
        concept(
          'c1',
          L('Look Closely: A Robot That Follows Orders', 'Ayo Amati: Robot yang Menuruti Perintah'),
          L(
            'A **program** is a list of orders. In this course the orders are **blocks**, and a little robot carries them out on a map.\n\nThe robot always **faces** one way, shown by the pointed end of its body. A **move** block makes it walk forward, and the number in the block says how many **steps**.\n\n- A grey square is a wall. The robot cannot walk into it, or off the map.\n- The square with the green frame is the **goal**.\n\nPress a block in the palette and it joins your program. Press **Run** to watch the robot.',
            '**Program** adalah daftar perintah. Di kursus ini perintahnya berupa **blok**, dan sebuah robot kecil melaksanakannya di atas peta.\n\nRobot selalu **menghadap** satu arah, ditunjukkan oleh ujung runcing badannya. Blok **maju** membuatnya berjalan ke depan, dan angka pada blok menyatakan berapa **langkah**.\n\n- Kotak gelap adalah tembok. Robot tidak bisa menabraknya, atau keluar dari peta.\n- Kotak berbingkai hijau adalah **garis finis**.\n\nTekan sebuah blok di palet dan blok itu masuk ke programmu. Tekan **Jalankan** untuk melihat robot bergerak.',
          ),
          L('move 3', 'maju 3'),
        ),
        concept(
          'c2',
          L('Step by Step: Orders Run From the Top Down', 'Contoh Bertahap: Perintah Berjalan dari Atas ke Bawah'),
          L(
            'The robot does the first block, then the next, and so on, **in the order you wrote them**.\n\n1. Step 1: `move 2` takes it 2 steps forward.\n2. Step 2: `move 3` takes it 3 more.\n3. Step 3: Together the robot has walked $2+3=5$ steps.\n\nThe number of blocks and the number of steps are different things. One block `move 5` does the same as `move 2` followed by `move 3`.',
            'Robot mengerjakan blok pertama, lalu blok berikutnya, dan seterusnya, **menurut urutan yang kamu tulis**.\n\n1. Langkah 1: `maju 2` membawanya 2 langkah ke depan.\n2. Langkah 2: `maju 3` membawanya 3 langkah lagi.\n3. Langkah 3: Seluruhnya robot berjalan $2+3=5$ langkah.\n\nBanyak blok dan banyak langkah adalah dua hal yang berbeda. Satu blok `maju 5` sama dengan `maju 2` disusul `maju 3`.',
          ),
          L('move 2\nmove 3', 'maju 2\nmaju 3'),
        ),
        quiz(
          'q1',
          L('The robot faces right and runs this program. How many steps does it walk in all?', 'Robot menghadap ke kanan dan menjalankan program ini. Berapa langkah yang ia tempuh seluruhnya?'),
          [L('2 steps', '2 langkah'), L('3 steps', '3 langkah'), L('5 steps', '5 langkah'), L('6 steps', '6 langkah')],
          2,
          L('The robot does both blocks, one after the other: $2+3=5$ steps. The answer 6 multiplies instead of adding.', 'Robot mengerjakan kedua blok itu satu demi satu: $2+3=5$ langkah. Jawaban 6 mengalikan, bukan menjumlahkan.'),
          L('The robot does every block, so add the numbers.', 'Robot mengerjakan semua blok, jadi jumlahkan angkanya.'),
          L('move 2\nmove 3', 'maju 2\nmaju 3'),
        ),
        robot(
          'b1',
          L('Take the robot to the goal. Count the squares between them.', 'Bawa robot ke garis finis. Hitung kotak di antara keduanya.'),
          level({ worlds: ['>...G'], allowed: ['move'], reach: true }),
          prog([move(4)]),
          [L('The goal is 4 squares ahead of the robot.', 'Garis finis berada 4 kotak di depan robot.'), L('Press “move forward”, then change the number in the block to 4.', 'Tekan “maju”, lalu ubah angka pada blok menjadi 4.')],
        ),
        judge(
          'j1',
          L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          [
            L('A program runs from the top block to the bottom block.', 'Program berjalan dari blok paling atas ke blok paling bawah.'),
            L('The robot can walk through a wall.', 'Robot bisa berjalan menembus tembok.'),
            L('`move 3` followed by `move 1` takes the same number of steps as `move 4`.', '`maju 3` disusul `maju 1` menempuh langkah yang sama dengan `maju 4`.'),
            L('The number of blocks always equals the number of steps.', 'Banyak blok selalu sama dengan banyak langkah.'),
          ],
          [true, false, true, false],
          L('The blocks run in order, a wall stops the robot, and $3+1=4$. One block can stand for many steps, so blocks and steps are not the same count.', 'Blok berjalan berurutan, tembok menghentikan robot, dan $3+1=4$. Satu blok bisa mewakili banyak langkah, jadi banyak blok dan banyak langkah tidak sama.'),
          L('Think about what the robot actually does when it runs each block.', 'Pikirkan apa yang sebenarnya dilakukan robot pada tiap blok.'),
        ),
        robot(
          'b2',
          L('This time the robot faces left. Use only ONE block.', 'Kali ini robot menghadap ke kiri. Pakai hanya SATU blok.'),
          level({ worlds: ['G......<'], allowed: ['move'], reach: true, max: 1 }),
          prog([move(7)]),
          [L('One block can walk many steps: change its number.', 'Satu blok bisa berjalan banyak langkah: ubah angkanya.'), L('Count the squares from the robot to the G.', 'Hitung kotak dari robot sampai G.')],
        ),
      ],
    },
    /* ------------------------------------------------------------ L2 turn */
    {
      id: 'cb-m1-s1-l2',
      title: L('Turn', 'Belok'),
      goal: L('You can combine move and turn blocks to follow a path with corners.', 'Kamu bisa menggabungkan blok maju dan belok untuk mengikuti jalur yang berbelok.'),
      xp: 15,
      steps: [
        concept(
          'c1',
          L('Look Closely: Turning on the Spot', 'Ayo Amati: Berputar di Tempat'),
          L(
            'A **turn** block makes the robot rotate a quarter turn **without moving**. It can turn **left** or **right**.\n\nLeft and right are seen **from the robot**, not from you. If the robot faces down the map, its left hand points to the right side of the screen.\n\nA path with a corner needs both kinds of blocks: move along, turn, move along again.',
            'Blok **belok** membuat robot berputar seperempat putaran **tanpa berpindah**. Ia bisa belok **kiri** atau **kanan**.\n\nKiri dan kanan dilihat **dari sisi robot**, bukan dari sisimu. Bila robot menghadap ke bawah, tangan kirinya menunjuk ke sisi kanan layar.\n\nJalur yang berbelok memerlukan kedua jenis blok: maju, belok, lalu maju lagi.',
          ),
          L('move 3\nturn right\nmove 2', 'maju 3\nbelok kanan\nmaju 2'),
        ),
        concept(
          'c2',
          L('Watch Out!: Turn First, Then Move', 'Awas, Jebakan!: Belok Dulu, Baru Maju'),
          L(
            'After a turn the robot is still on the **same square**. It only faces a new way.\n\nTo walk down a corridor that goes off to the side, the order is always:\n\n1. Step 1: move up to the corner;\n2. Step 2: turn;\n3. Step 3: move along the new corridor.\n\nIf you move before you turn, the robot walks the old way and may bump into a wall.',
            'Setelah belok, robot masih berada di **kotak yang sama**. Ia hanya menghadap arah baru.\n\nUntuk menyusuri lorong yang menyimpang ke samping, urutannya selalu:\n\n1. Langkah 1: maju sampai sudut;\n2. Langkah 2: belok;\n3. Langkah 3: maju menyusuri lorong baru.\n\nBila kamu maju sebelum belok, robot berjalan ke arah lama dan bisa menabrak tembok.',
          ),
        ),
        quiz(
          'q1',
          L('The robot faces right and runs `turn left`. Which way does it face now?', 'Robot menghadap ke kanan dan menjalankan `belok kiri`. Sekarang ia menghadap ke mana?'),
          [L('Up, towards the top of the map', 'Atas, ke bagian atas peta'), L('Down, towards the bottom of the map', 'Bawah, ke bagian bawah peta'), L('Left', 'Kiri'), L('Still right', 'Tetap kanan')],
          0,
          L('A left turn from facing right points the robot up. Facing right, its left hand is on the top side of the map.', 'Belok kiri dari menghadap kanan membuat robot menghadap atas. Saat menghadap kanan, tangan kirinya ada di sisi atas peta.'),
          L('Imagine standing where the robot stands, facing right. Which way is your left hand?', 'Bayangkan kamu berdiri di tempat robot, menghadap kanan. Ke mana tangan kirimu menunjuk?'),
        ),
        robot(
          'b1',
          L('Walk to the goal around the corner.', 'Berjalanlah ke garis finis melewati tikungan.'),
          level({ worlds: ['>...', '###.', '###G'], allowed: ['move', 'turn'], reach: true }),
          prog([move(3), right(), move(2)]),
          [L('Go along the top row first. Then turn towards the goal.', 'Susuri baris atas dulu. Lalu belok ke arah garis finis.'), L('3 steps, turn right, 2 steps.', '3 langkah, belok kanan, 2 langkah.')],
        ),
        order(
          'o1',
          L('Put the program in order so that the robot goes 3 steps ahead, turns right and goes 1 step.', 'Susun program agar robot maju 3 langkah, belok kanan, lalu maju 1 langkah.'),
          { en: ['move 3', 'turn right', 'move 1'], id: ['maju 3', 'belok kanan', 'maju 1'] },
          L('The robot has to reach the corner before it turns, and turn before it walks the new way.', 'Robot harus sampai di sudut sebelum belok, dan belok sebelum berjalan ke arah baru.'),
          L('The turn goes between the two moves.', 'Blok belok berada di antara kedua blok maju.'),
        ),
        robot(
          'b2',
          L('This corner turns left. Take the robot to the goal.', 'Tikungan ini berbelok ke kiri. Bawa robot ke garis finis.'),
          level({ worlds: ['##G', '##.', '>..'], allowed: ['move', 'turn'], reach: true }),
          prog([move(2), left(), move(2)]),
          [L('The robot starts at the bottom left and the goal is at the top right.', 'Robot mulai di kiri bawah dan garis finis ada di kanan atas.'), L('Move 2, turn left, move 2.', 'Maju 2, belok kiri, maju 2.')],
        ),
        robot(
          'b3',
          L('Two corners in a row. Take the robot to the goal.', 'Dua tikungan berturut-turut. Bawa robot ke garis finis.'),
          level({ worlds: ['>..#', '##.#', 'G..#'], allowed: ['move', 'turn'], reach: true }),
          prog([move(2), right(), move(2), right(), move(2)]),
          [L('Follow the path with your finger and write down each straight piece and each turn.', 'Ikuti jalurnya dengan jarimu dan catat tiap bagian lurus dan tiap belokan.'), L('Both turns go to the right.', 'Kedua belokan menuju ke kanan.')],
        ),
      ],
    },
  ],
  project: {
    id: 'cb-m1-s1-p',
    runtime: 'blocks',
    title: L('Robot Delivery', 'Pengantaran Robot'),
    brief: L(
      'Four deliveries, each one a path with more corners than the last. Write the program for every one.',
      'Empat pengantaran, masing-masing berjalur lebih banyak tikungan daripada sebelumnya. Tulis program untuk tiap pengantaran.',
    ),
    requirements: [
      L('Use move blocks with the right number of steps.', 'Memakai blok maju dengan banyak langkah yang tepat.'),
      L('Turn at every corner, to the correct side.', 'Belok di setiap tikungan, ke sisi yang benar.'),
    ],
    hints: [
      L('Walk along the path with your finger and write down each straight piece.', 'Susuri jalurnya dengan jarimu dan catat tiap bagian lurus.'),
      L('The robot starts facing the way the pointed end shows.', 'Robot mulai menghadap ke arah yang ditunjukkan ujung runcingnya.'),
      L('If the robot hits a wall, press Run and watch where it went wrong.', 'Bila robot menabrak tembok, tekan Jalankan dan lihat di mana ia salah.'),
    ],
    xp: 40,
    tasks: [
      task(
        L('**Delivery 1.** One corner.', '**Pengantaran 1.** Satu tikungan.'),
        level({ worlds: ['>...', '###.', '###.', '###G'], allowed: ['move', 'turn'], reach: true }),
        prog([move(3), right(), move(3)]),
      ),
      task(
        L('**Delivery 2.** A step down the stairs.', '**Pengantaran 2.** Menuruni tangga.'),
        level({ worlds: ['>.##', '#...', '###G'], allowed: ['move', 'turn'], reach: true }),
        prog([move(1), right(), move(1), left(), move(2), right(), move(1)]),
      ),
      task(
        L('**Delivery 3.** The robot starts at the bottom and turns left.', '**Pengantaran 3.** Robot mulai dari bawah dan berbelok ke kiri.'),
        level({ worlds: ['..G', '.#.', '.#.', '>..'], allowed: ['move', 'turn'], reach: true }),
        prog([move(2), left(), move(3)]),
      ),
      task(
        L('**Delivery 4.** A long winding road with turns to both sides.', '**Pengantaran 4.** Jalan panjang berliku dengan belokan ke kedua sisi.'),
        level({ worlds: ['>..#..G', '##.#.##', '##...##'], allowed: ['move', 'turn'], reach: true }),
        prog([move(2), right(), move(2), left(), move(2), left(), move(2), right(), move(2)]),
      ),
    ],
  },
}
