import type { Submodule } from '../types'
import { L, change, cmp, collect, concept, judge, level, move, multi, onStar, prog, quiz, repeat, right, robot, sayVar, set, task, when, whileDo } from './b'

/** Module 4, submodule 1 — variables: a name for a number that can change. */

const steps = { var: 'steps' }

export const m4s1: Submodule = {
  id: 'cb-m4-s1',
  title: L('Variables', 'Variabel'),
  summary: L(
    'A variable is a named box that holds a number. Set it, change it, use it, and count with it.',
    'Variabel adalah kotak bernama yang menyimpan bilangan. Mengatur, mengubah, memakai, dan menghitung dengannya.',
  ),
  lessons: [
    /* ------------------------------------------------------- L13 variable */
    {
      id: 'cb-m4-s1-l1',
      title: L('A Box With a Number', 'Kotak Berisi Bilangan'),
      goal: L('You can set a variable and use it in place of a number in other blocks.', 'Kamu bisa mengatur sebuah variabel dan memakainya sebagai pengganti bilangan pada blok lain.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: Give a Number a Name', 'Ayo Amati: Memberi Nama pada Sebuah Bilangan'),
          L(
            'Look at a road with two legs of the same length: “walk 3, turn, walk 3”. The number 3 is written **twice**. To change the road you would have to change both, and it is easy to forget one.\n\nA **variable** is a box with a **name** that holds a number. You put a number into the box once with **set**, and then use the **name** wherever the number would go.\n\nIn a block that takes a number, a small menu lets you choose between a number and a variable.',
            'Perhatikan jalan dengan dua ruas yang sama panjang: “jalan 3, belok, jalan 3”. Angka 3 ditulis **dua kali**. Untuk mengubah jalannya kamu harus mengubah keduanya, dan mudah lupa salah satu.\n\n**Variabel** adalah kotak dengan **nama** yang menyimpan sebuah bilangan. Kamu memasukkan bilangan ke kotak sekali dengan **atur**, lalu memakai **namanya** di mana pun bilangan itu dipakai.\n\nPada blok yang menerima bilangan, sebuah menu kecil memungkinkan kamu memilih antara bilangan dan variabel.',
          ),
          L('set steps to 3\nmove steps\nturn right\nmove steps', 'atur steps menjadi 3\nmaju steps\nbelok kanan\nmaju steps'),
        ),
        concept(
          'c2',
          L('Step by Step: Change It in One Place', 'Contoh Bertahap: Ubah di Satu Tempat'),
          L(
            'With the variable, the program above reads “set steps to 3”, and both moves use `steps`.\n\n1. Step 1: To make both legs 5 long, change only the **set** block.\n2. Step 2: Both moves now walk 5 steps.\n\nA variable also **keeps its value** while the program runs. The value only changes when a **set** or **change** block changes it.\n\nA variable has to be set before it is used. Using a variable that nobody set gives an error.',
            'Dengan variabel, program di atas berbunyi “atur steps menjadi 3”, dan kedua blok maju memakai `steps`.\n\n1. Langkah 1: Untuk membuat kedua ruas sepanjang 5, ubah hanya blok **atur**.\n2. Langkah 2: Kedua blok maju kini berjalan 5 langkah.\n\nVariabel juga **menyimpan nilainya** selama program berjalan. Nilainya hanya berubah bila blok **atur** atau **ubah** mengubahnya.\n\nVariabel harus diatur sebelum dipakai. Memakai variabel yang belum diatur menimbulkan kesalahan.',
          ),
        ),
        quiz(
          'q1',
          L('How many steps does the robot walk in all?', 'Berapa langkah yang ditempuh robot seluruhnya?'),
          [L('4', '4'), L('8', '8'), L('2', '2'), L('16', '16')],
          1,
          L('`steps` holds 4, and it is used in two moves: $4+4=8$ steps.', '`steps` berisi 4, dan dipakai pada dua blok maju: $4+4=8$ langkah.'),
          L('What number is in the box when each move runs?', 'Bilangan apa yang ada di dalam kotak saat tiap blok maju berjalan?'),
          L('set steps to 4\nmove steps\nturn right\nmove steps', 'atur steps menjadi 4\nmaju steps\nbelok kanan\nmaju steps'),
        ),
        robot(
          'b1',
          L('The road has two legs of the same length. Set a variable called **steps** and use it in both moves.', 'Jalan itu punya dua ruas yang sama panjang. Atur variabel bernama **steps** dan pakai pada kedua blok maju.'),
          level({ worlds: ['>...', '###.', '###.', '###G'], allowed: ['move', 'turn', 'set'], vars: ['steps'], reach: true, must: ['set'] }),
          prog([set('steps', 3), move(steps), right(), move(steps)]),
          [L('Each leg is 3 steps long.', 'Tiap ruas sepanjang 3 langkah.'), L('In the move block choose steps from the small menu, instead of a number.', 'Pada blok maju pilih steps dari menu kecil, bukan sebuah angka.')],
        ),
        judge(
          'j1',
          L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          [
            L('A variable is a named box that holds a number.', 'Variabel adalah kotak bernama yang menyimpan bilangan.'),
            L('To change a number used in many blocks, you can change only the set block.', 'Untuk mengubah bilangan yang dipakai pada banyak blok, kamu cukup mengubah blok atur.'),
            L('A variable can be used before it has been set.', 'Variabel dapat dipakai sebelum diatur.'),
          ],
          [true, true, false],
          L('A variable needs a value before it is used; that is what the set block gives it.', 'Variabel memerlukan nilai sebelum dipakai; itulah yang diberikan blok atur.'),
          L('What does the robot know about a variable nobody has set?', 'Apa yang diketahui robot tentang variabel yang belum diatur?'),
        ),
        robot(
          'b2',
          L('Make the robot say 1, 2 and 3. Use a variable called **count**, and a loop.', 'Buat robot mengucapkan 1, 2, dan 3. Pakai variabel bernama **count**, dan sebuah perulangan.'),
          level({ worlds: ['>.'], allowed: ['set', 'change', 'repeat', 'say'], vars: ['count'], say: ['1', '2', '3'], must: ['change'] }),
          prog([set('count', 0), repeat(3, [change('count', 1), sayVar('count')])]),
          [L('Start the count at 0. Inside the loop: change count by 1, then say the value of count.', 'Mulai hitungan dari 0. Di dalam perulangan: ubah count sebesar 1, lalu ucapkan nilai count.'), L('In the say block choose “value of count”.', 'Pada blok ucapkan pilih “nilai count”.')],
        ),
      ],
    },
    /* ------------------------------------------------------- L14 counting */
    {
      id: 'cb-m4-s1-l2',
      title: L('Counting With a Variable', 'Menghitung dengan Variabel'),
      goal: L('You can add up what happens during a run, and loop while a count is small enough.', 'Kamu bisa menjumlahkan apa yang terjadi selama program berjalan, dan mengulang selama hitungan masih cukup kecil.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: A Counter', 'Ayo Amati: Penghitung'),
          L(
            'The **change** block adds a number to a variable: “change count by 1” turns 0 into 1, then 2, and so on. A variable used this way is a **counter**.\n\nA counter is useful when the robot has to find out something while it runs. For example, to count how many stars lie along a road, when the road is not the same every time:\n\n1. Step 1: set total to 0.\n2. Step 2: walk along the road; **if** the robot stands on a star, pick it up and change total by 1.\n3. Step 3: say total.',
            'Blok **ubah** menambahkan suatu bilangan ke variabel: “ubah count sebesar 1” mengubah 0 menjadi 1, lalu 2, dan seterusnya. Variabel yang dipakai seperti ini disebut **penghitung**.\n\nPenghitung berguna bila robot harus mencari tahu sesuatu selagi berjalan. Misalnya menghitung berapa bintang di sepanjang jalan, ketika jalannya tidak selalu sama:\n\n1. Langkah 1: atur total menjadi 0.\n2. Langkah 2: berjalan menyusuri jalan; **jika** robot berdiri di atas bintang, ambil dan ubah total sebesar 1.\n3. Langkah 3: ucapkan total.',
          ),
          L('set total to 0\nrepeat 5 times\n  move 1\n  if standing on a star\n    pick up the star\n    change total by 1\nsay total', 'atur total menjadi 0\nulangi 5 kali\n  maju 1\n  jika berdiri di atas bintang\n    ambil bintang\n    ubah total sebesar 1\nucapkan total'),
        ),
        concept(
          'c2',
          L('Step by Step: A While Loop With a Counter', 'Contoh Bertahap: Perulangan Selama dengan Penghitung'),
          L(
            'A counter can also decide **when to stop**. The while block can compare a variable with a number: “while count < 4”.\n\n1. Step 1: set count to 0.\n2. Step 2: while count < 4: move 1, and change count by 1.\n3. Step 3: after 4 rounds count is 4, the condition is false, and the loop ends.\n\nIt does the same as “repeat 4 times”. But the counter can also be used inside the loop, and it is the first step to loops that stop for other reasons.',
            'Penghitung juga dapat menentukan **kapan berhenti**. Blok selama dapat membandingkan variabel dengan sebuah bilangan: “selama count < 4”.\n\n1. Langkah 1: atur count menjadi 0.\n2. Langkah 2: selama count < 4: maju 1, dan ubah count sebesar 1.\n3. Langkah 3: setelah 4 putaran count bernilai 4, syaratnya salah, dan perulangan berakhir.\n\nIni melakukan hal yang sama dengan “ulangi 4 kali”. Tetapi penghitung juga dapat dipakai di dalam perulangan, dan ini langkah pertama menuju perulangan yang berhenti karena alasan lain.',
          ),
          L('set count to 0\nwhile count < 4\n  move 1\n  change count by 1', 'atur count menjadi 0\nselama count < 4\n  maju 1\n  ubah count sebesar 1'),
        ),
        quiz(
          'q1',
          L('What is the value of `n` when the loop ends?', 'Berapa nilai `n` ketika perulangan berakhir?'),
          [L('2', '2'), L('3', '3'), L('4', '4'), L('0', '0')],
          1,
          L('n goes 0 → 1 → 2 → 3. At 3 the condition n < 3 is false, so the loop ends with n = 3.', 'n berjalan 0 → 1 → 2 → 3. Pada 3 syarat n < 3 salah, jadi perulangan berakhir dengan n = 3.'),
          L('Write down n after each round.', 'Tulis n setelah tiap putaran.'),
          L('set n to 0\nwhile n < 3\n  change n by 1', 'atur n menjadi 0\nselama n < 3\n  ubah n sebesar 1'),
        ),
        robot(
          'b1',
          L('Walk along the road, pick up the stars and say how many there were. The road has 3 stars but they are not in the same places on the two maps.', 'Berjalanlah di sepanjang jalan, ambil bintang-bintangnya, dan ucapkan berapa banyaknya. Jalan itu punya 3 bintang tetapi tempatnya tidak sama pada kedua peta.'),
          level({ worlds: [['>*.*.*'], ['>.**.*']], allowed: ['move', 'collect', 'repeat', 'if', 'set', 'change', 'say'], conds: ['on-star'], vars: ['total'], stars: true, say: ['3'], must: ['change'] }),
          prog([set('total', 0), repeat(5, [move(1), when(onStar, [collect(), change('total', 1)])]), sayVar('total')]),
          [L('Inside the repeat: move 1, then an if (standing on a star) with pick up and change total by 1.', 'Di dalam ulangi: maju 1, lalu sebuah jika (berdiri di atas bintang) berisi ambil dan ubah total sebesar 1.'), L('After the loop, say the value of total.', 'Sesudah perulangan, ucapkan nilai total.')],
        ),
        multi(
          'm1',
          L('A program sets **a** to 1 and **b** to 0, and then runs: change a by 1, change b by 1, change a by 1, change b by 1. Which statements are true afterwards? Choose ALL.', 'Sebuah program mengatur **a** menjadi 1 dan **b** menjadi 0, lalu menjalankan: ubah a sebesar 1, ubah b sebesar 1, ubah a sebesar 1, ubah b sebesar 1. Pernyataan mana yang benar sesudahnya? Pilih SEMUA.'),
          [L('a is 5', 'a bernilai 5'), L('a is 3', 'a bernilai 3'), L('b is 5', 'b bernilai 5'), L('b is 2', 'b bernilai 2')],
          [1, 3],
          L('a starts at 1 and gets +1 twice: 3. b starts at 0 and gets +1 twice: 2. The two variables are separate boxes.', 'a mulai dari 1 dan ditambah +1 dua kali: 3. b mulai dari 0 dan ditambah +1 dua kali: 2. Kedua variabel adalah kotak yang terpisah.'),
          L('Follow each variable on its own.', 'Ikuti tiap variabel satu per satu.'),
        ),
        robot(
          'b2',
          L('Use a while block with a counter to walk 4 steps to the goal. Make the loop depend on the counter.', 'Pakai blok selama dengan penghitung untuk berjalan 4 langkah ke garis finis. Buat perulangan bergantung pada penghitung.'),
          level({ worlds: ['>...G'], allowed: ['move', 'while', 'set', 'change'], conds: ['cmp'], vars: ['n'], reach: true, must: ['while', 'change'] }),
          prog([set('n', 0), whileDo(cmp('n', '<', 4), [move(1), change('n', 1)])]),
          [L('Set n to 0 first. The while condition is “n < 4”.', 'Atur n menjadi 0 dulu. Syarat selama adalah “n < 4”.'), L('Inside the loop, move 1 and change n by 1, otherwise the loop never ends.', 'Di dalam perulangan, maju 1 dan ubah n sebesar 1, kalau tidak perulangan tidak pernah berakhir.')],
        ),
        robot(
          'b3',
          L('Walk to the goal and say how many steps you took. Count with a variable called **steps**.', 'Berjalanlah ke garis finis dan ucapkan berapa langkah yang kamu ambil. Hitung dengan variabel bernama **steps**.'),
          level({ worlds: ['>...G'], allowed: ['move', 'repeat', 'set', 'change', 'say'], vars: ['steps'], reach: true, say: ['4'], must: ['change'] }),
          prog([set('steps', 0), repeat(4, [move(1), change('steps', 1)]), sayVar('steps')]),
          [L('Every time the robot moves 1, add 1 to steps.', 'Setiap kali robot maju 1, tambahkan 1 pada steps.')],
        ),
      ],
    },
  ],
  project: {
    id: 'cb-m4-s1-p',
    runtime: 'blocks',
    title: L('The Counting Robot', 'Robot Penghitung'),
    brief: L(
      'Four levels where the robot keeps a count in a variable.',
      'Empat level tempat robot menyimpan hitungan dalam sebuah variabel.',
    ),
    requirements: [L('Set a variable before it is used.', 'Mengatur variabel sebelum dipakai.'), L('Change a variable inside a loop.', 'Mengubah variabel di dalam perulangan.')],
    hints: [
      L('A variable has to be set before it is used.', 'Variabel harus diatur sebelum dipakai.'),
      L('Say the count after the loop, unless the level asks for the running count.', 'Ucapkan hitungan sesudah perulangan, kecuali soal meminta hitungan berjalan.'),
      L('If a while loop never ends, check that something inside changes the variable.', 'Bila perulangan selama tidak pernah berakhir, periksa apakah ada yang mengubah variabel di dalamnya.'),
    ],
    xp: 40,
    tasks: [
      task(
        L('**Level 1.** Two legs of the same length. Use a variable called **steps**.', '**Level 1.** Dua ruas yang sama panjang. Pakai variabel bernama **steps**.'),
        level({ worlds: ['>....', '####.', '####.', '####.', '####G'], allowed: ['move', 'turn', 'set'], vars: ['steps'], reach: true, must: ['set'] }),
        prog([set('steps', 4), move(steps), right(), move(steps)]),
      ),
      task(
        L('**Level 2.** Count the stars and say how many there were. There are 4 on both maps, in different places.', '**Level 2.** Hitung bintangnya dan ucapkan berapa banyaknya. Ada 4 pada kedua peta, di tempat yang berbeda.'),
        level({ worlds: [['>*.*.**'], ['>.**.**']], allowed: ['move', 'collect', 'repeat', 'if', 'set', 'change', 'say'], conds: ['on-star'], vars: ['total'], stars: true, say: ['4'], must: ['change'] }),
        prog([set('total', 0), repeat(6, [move(1), when(onStar, [collect(), change('total', 1)])]), sayVar('total')]),
      ),
      task(
        L('**Level 3.** Walk 6 steps to the goal with a while block that depends on a counter **n**.', '**Level 3.** Berjalan 6 langkah ke garis finis dengan blok selama yang bergantung pada penghitung **n**.'),
        level({ worlds: ['>.....G'], allowed: ['move', 'while', 'set', 'change'], conds: ['cmp'], vars: ['n'], reach: true, must: ['while', 'change'] }),
        prog([set('n', 0), whileDo(cmp('n', '<', 6), [move(1), change('n', 1)])]),
      ),
      task(
        L('**Level 4.** Pick up the three stars and say the running count after each one: 1, 2, 3.', '**Level 4.** Ambil ketiga bintang dan ucapkan hitungan berjalan setelah tiap bintang: 1, 2, 3.'),
        level({ worlds: ['>***'], allowed: ['move', 'collect', 'repeat', 'set', 'change', 'say'], vars: ['count'], stars: true, say: ['1', '2', '3'], must: ['change'] }),
        prog([set('count', 0), repeat(3, [move(1), collect(), change('count', 1), sayVar('count')])]),
      ),
    ],
  },
}
