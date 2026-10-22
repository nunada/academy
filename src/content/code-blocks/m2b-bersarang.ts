import type { Submodule } from '../types'
import { L, collect, concept, fill, judge, left, level, move, multi, prog, quiz, repeat, right, robot, sayStars, task } from './b'

/** Module 2, submodule 2 — loops inside loops, and finding the repeating piece. */

export const m2s2: Submodule = {
  id: 'cb-m2-s2',
  title: L('Loops Inside Loops', 'Perulangan di dalam Perulangan'),
  summary: L(
    'Put one repeat inside another to walk the edge of a shape, and learn to find the piece that repeats in a long path.',
    'Menaruh satu blok ulangi di dalam yang lain untuk menyusuri tepi sebuah bangun, dan belajar menemukan potongan yang berulang pada jalur panjang.',
  ),
  lessons: [
    /* --------------------------------------------------------- L7 nested */
    {
      id: 'cb-m2-s2-l1',
      title: L('A Loop in a Loop', 'Perulangan dalam Perulangan'),
      goal: L('You can nest a repeat inside a repeat and work out how many steps it makes in all.', 'Kamu bisa menyarangkan ulangi di dalam ulangi dan menghitung berapa langkah seluruhnya.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: The Inner Loop Runs in Full Every Time', 'Ayo Amati: Perulangan Dalam Berjalan Penuh Tiap Kali'),
          L(
            'A repeat block can hold **another repeat block**. The inner one runs **completely** each time the outer one goes round.\n\nTo walk along the edges of a rectangle: “a side, then a turn”, repeated; and each side is itself “a step, repeated”.\n\nThe outer loop counts the **sides**. The inner loop counts the **steps along one side**.',
            'Blok ulangi dapat memuat **blok ulangi lain**. Yang di dalam berjalan **sampai tuntas** setiap kali yang di luar berputar.\n\nUntuk menyusuri tepi persegi panjang: “satu sisi, lalu belok”, diulang; dan tiap sisi sendiri adalah “satu langkah, diulang”.\n\nPerulangan luar menghitung **sisi**. Perulangan dalam menghitung **langkah sepanjang satu sisi**.',
          ),
          L('repeat 2 times\n  repeat 3 times\n    move 1\n    pick up the star\n  turn right', 'ulangi 2 kali\n  ulangi 3 kali\n    maju 1\n    ambil bintang\n  belok kanan'),
        ),
        concept(
          'c2',
          L('Step by Step: Counting What a Nested Loop Does', 'Contoh Bertahap: Menghitung yang Dikerjakan Perulangan Bersarang'),
          L(
            'For “repeat 2 times: repeat 3 times: move 1; turn right”:\n\n1. Step 1: The inner loop makes $3$ steps.\n2. Step 2: It runs once per outer round, and there are $2$ rounds.\n3. Step 3: In all the robot walks $2\\times3=6$ steps and turns right twice.\n\nCounts in nested loops **multiply**.',
            'Untuk “ulangi 2 kali: ulangi 3 kali: maju 1; belok kanan”:\n\n1. Langkah 1: Perulangan dalam menempuh $3$ langkah.\n2. Langkah 2: Ia berjalan sekali tiap putaran luar, dan ada $2$ putaran.\n3. Langkah 3: Seluruhnya robot menempuh $2\\times3=6$ langkah dan belok kanan dua kali.\n\nBanyaknya pada perulangan bersarang **dikalikan**.',
          ),
        ),
        quiz(
          'q1',
          L('How many steps does the robot walk in all?', 'Berapa langkah yang ditempuh robot seluruhnya?'),
          [L('5', '5'), L('6', '6'), L('12', '12'), L('9', '9')],
          2,
          L('The inner loop makes $4$ steps and runs $3$ times: $3\\times4=12$.', 'Perulangan dalam menempuh $4$ langkah dan berjalan $3$ kali: $3\\times4=12$.'),
          L('Multiply the two counts.', 'Kalikan kedua banyaknya.'),
          L('repeat 3 times\n  repeat 4 times\n    move 1\n  turn right', 'ulangi 3 kali\n  ulangi 4 kali\n    maju 1\n  belok kanan'),
        ),
        robot(
          'b1',
          L('Pick up all the stars along the top and down the right side. At most 5 blocks.', 'Ambil semua bintang di sepanjang atas dan di sisi kanan. Paling banyak 5 blok.'),
          level({ worlds: ['>***', '...*', '...*', '...*'], allowed: ['move', 'turn', 'collect', 'repeat'], stars: true, max: 5, must: ['repeat'] }),
          prog([repeat(2, [repeat(3, [move(1), collect()]), right()])]),
          [L('One side is: 3 times (move 1, pick up). Then turn right.', 'Satu sisi adalah: 3 kali (maju 1, ambil). Lalu belok kanan.'), L('Put a second repeat inside the first one: press the cursor line inside it first.', 'Taruh blok ulangi kedua di dalam yang pertama: tekan dulu baris tambah blok di dalamnya.')],
        ),
        fill(
          'f1',
          L('Complete the numbers so that the robot walks 2 sides of 5 steps each.', 'Lengkapi angkanya agar robot menempuh 2 sisi dengan 5 langkah tiap sisi.'),
          { en: 'repeat ___ times\n  repeat ___ times\n    move 1\n  turn right', id: 'ulangi ___ kali\n  ulangi ___ kali\n    maju 1\n  belok kanan' },
          ['2', '5'],
          L('The outer loop counts the sides, 2, and the inner loop counts the steps on a side, 5.', 'Perulangan luar menghitung sisi, 2, dan perulangan dalam menghitung langkah di satu sisi, 5.'),
          L('Outer: how many sides. Inner: how many steps on one side.', 'Luar: berapa sisi. Dalam: berapa langkah pada satu sisi.'),
        ),
        robot(
          'b2',
          L('Walk once round the edge of the rectangle and pick up every star. At most 9 blocks.', 'Berjalanlah sekali mengelilingi tepi persegi panjang dan ambil semua bintang. Paling banyak 9 blok.'),
          level({ worlds: ['>****', '*###*', '*###*', '*****'], allowed: ['move', 'turn', 'collect', 'repeat'], stars: true, max: 9, must: ['repeat'] }),
          prog([repeat(2, [repeat(4, [move(1), collect()]), right(), repeat(3, [move(1), collect()]), right()])]),
          [L('The rectangle has a long side of 4 and a short side of 3. Together they come twice.', 'Persegi panjang itu punya sisi panjang 4 dan sisi pendek 3. Keduanya muncul dua kali.'), L('Outer loop: 2. Inside it: a long side, a turn, a short side, a turn.', 'Perulangan luar: 2. Di dalamnya: sisi panjang, belok, sisi pendek, belok.')],
        ),
        judge(
          'j1',
          L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          [
            L('An inner repeat runs completely each time the outer repeat goes round.', 'Ulangi yang di dalam berjalan tuntas setiap kali ulangi yang di luar berputar.'),
            L('“repeat 3 times: repeat 2 times: move 1” walks 5 steps.', '“ulangi 3 kali: ulangi 2 kali: maju 1” menempuh 5 langkah.'),
            L('“repeat 3 times: repeat 2 times: move 1” walks 6 steps.', '“ulangi 3 kali: ulangi 2 kali: maju 1” menempuh 6 langkah.'),
          ],
          [true, false, true],
          L('The counts multiply: $3\\times2=6$, not $3+2=5$.', 'Banyaknya dikalikan: $3\\times2=6$, bukan $3+2=5$.'),
          L('Do the counts add or multiply?', 'Apakah banyaknya dijumlah atau dikalikan?'),
        ),
      ],
    },
    /* ------------------------------------------------------- L8 patterns */
    {
      id: 'cb-m2-s2-l2',
      title: L('Spot the Repeating Piece', 'Temukan Potongan yang Berulang'),
      goal: L('You can find the piece that repeats in a long path, even when it has several turns.', 'Kamu bisa menemukan potongan yang berulang pada jalur panjang, walau berisi beberapa belokan.'),
      xp: 20,
      steps: [
        concept(
          'c1',
          L('Look Closely: Where Does the Pattern Start Over?', 'Ayo Amati: Di Mana Pola Mulai Lagi?'),
          L(
            'A long winding road looks hard, until you see it is **one shape** repeated. The trick is to find the point where the robot is in the **same place relative to the road, facing the same way**, as at the start of the piece.\n\nThat means the piece must end with the robot **facing the way it started** and **on the same kind of square**.\n\nIf a piece does not end that way, the second copy will go somewhere else.',
            'Jalan berliku yang panjang tampak sulit, sampai kamu melihat bahwa itu **satu bentuk** yang diulang. Triknya adalah mencari titik tempat robot berada di **posisi yang sama terhadap jalan, menghadap arah yang sama**, seperti pada awal potongan.\n\nArtinya potongan harus berakhir dengan robot **menghadap arah semula** dan **di jenis kotak yang sama**.\n\nBila potongan tidak berakhir demikian, salinan kedua akan menuju tempat lain.',
          ),
        ),
        concept(
          'c2',
          L('Step by Step: A Stair That Gives Stars', 'Contoh Bertahap: Tangga yang Memberi Bintang'),
          L(
            'On a staircase where each lower landing holds a star, one piece is:\n\n1. Step 1: move 1; 2. turn right; 3. move 1 (now on the star); 4. pick up; 5. turn left.\n\nThe robot ends facing the way it started, one stair lower. So the piece can simply be repeated.\n\nThe piece has **5 blocks**, so the whole staircase needs only the repeat block and these 5: **6 blocks**.',
            'Pada tangga yang tiap pijakan bawahnya berisi bintang, satu potongan adalah:\n\n1. Langkah 1: maju 1; 2. belok kanan; 3. maju 1 (kini di atas bintang); 4. ambil; 5. belok kiri.\n\nRobot berakhir menghadap arah semula, satu anak tangga lebih rendah. Jadi potongan itu tinggal diulang.\n\nPotongannya **5 blok**, jadi seluruh tangga hanya memerlukan blok ulangi dan 5 blok ini: **6 blok**.',
          ),
        ),
        quiz(
          'q1',
          L('This piece is repeated: `move 2`, `turn right`. After the first copy the robot faces down. Where is it after the second copy?', 'Potongan ini diulang: `maju 2`, `belok kanan`. Setelah salinan pertama robot menghadap ke bawah. Di mana ia setelah salinan kedua?'),
          [L('It has walked down 2, and now faces left', 'Ia sudah turun 2, dan sekarang menghadap kiri'), L('It has walked 2 to the right again', 'Ia berjalan 2 ke kanan lagi'), L('It is back where it started', 'Ia kembali ke tempat mulai'), L('It has not moved', 'Ia belum bergerak')],
          0,
          L('The second copy starts facing down, so its `move 2` goes down. Then the turn makes the robot face left. A turn inside the piece changes where later copies go.', 'Salinan kedua dimulai menghadap ke bawah, jadi `maju 2`-nya turun. Lalu belokan membuat robot menghadap kiri. Belokan di dalam potongan mengubah ke mana salinan berikutnya pergi.'),
          L('Follow the robot’s facing after each block.', 'Ikuti arah hadap robot setelah tiap blok.'),
        ),
        robot(
          'b1',
          L('Pick up the three stars on the stairs. At most 6 blocks.', 'Ambil tiga bintang di tangga. Paling banyak 6 blok.'),
          level({ worlds: ['>...', '.*..', '..*.', '...*'], allowed: ['move', 'turn', 'collect', 'repeat'], stars: true, max: 6, must: ['repeat'] }),
          prog([repeat(3, [move(1), right(), move(1), collect(), left()])]),
          [L('One stair: move 1, turn right, move 1, pick up, turn left.', 'Satu anak tangga: maju 1, belok kanan, maju 1, ambil, belok kiri.')],
        ),
        multi(
          'm1',
          L('A piece is repeated to walk a long road. Choose ALL the pieces that end with the robot facing the way it started.', 'Sebuah potongan diulang untuk menyusuri jalan panjang. Pilih SEMUA potongan yang berakhir dengan robot menghadap arah semula.'),
          [
            L('move 2, turn right, move 1, turn left', 'maju 2, belok kanan, maju 1, belok kiri'),
            L('move 2, turn right', 'maju 2, belok kanan'),
            L('turn right, move 1, turn left, move 1', 'belok kanan, maju 1, belok kiri, maju 1'),
            L('move 1, turn right, move 1, turn right', 'maju 1, belok kanan, maju 1, belok kanan'),
          ],
          [0, 2],
          L('A right turn and a left turn cancel each other. In the first and third pieces one right and one left turn balance out, so the facing is the same. The second piece has one right turn left over, and the fourth has two.', 'Belok kanan dan belok kiri saling meniadakan. Pada potongan pertama dan ketiga satu belok kanan dan satu belok kiri seimbang, jadi arah hadapnya sama. Potongan kedua menyisakan satu belok kanan, dan keempat menyisakan dua.'),
          L('Count the right turns minus the left turns in each piece.', 'Hitung belok kanan dikurangi belok kiri pada tiap potongan.'),
        ),
        robot(
          'b2',
          L('Follow the wavy road to the goal. At most 9 blocks.', 'Ikuti jalan bergelombang sampai garis finis. Paling banyak 9 blok.'),
          level({ worlds: ['#########', '>..#...#G', '##...#...'], allowed: ['move', 'turn', 'repeat'], reach: true, max: 9, must: ['repeat'] }),
          prog([repeat(2, [move(2), right(), move(1), left(), move(2), left(), move(1), right()])]),
          [L('One wave is: 2 steps, right, 1 step, left, 2 steps, left, 1 step, right.', 'Satu gelombang adalah: 2 langkah, kanan, 1 langkah, kiri, 2 langkah, kiri, 1 langkah, kanan.'), L('There are 2 waves.', 'Ada 2 gelombang.')],
        ),
      ],
    },
  ],
  project: {
    id: 'cb-m2-s2-p',
    runtime: 'blocks',
    title: L('Edges and Waves', 'Tepian dan Gelombang'),
    brief: L(
      'Four levels with loops inside loops and long winding roads.',
      'Empat level dengan perulangan di dalam perulangan dan jalan panjang yang berliku.',
    ),
    requirements: [L('Nest one repeat inside another.', 'Menyarangkan satu ulangi di dalam ulangi lain.'), L('Find the piece that repeats in a long road.', 'Menemukan potongan yang berulang pada jalan panjang.')],
    hints: [
      L('Find the piece that ends facing the way it started.', 'Cari potongan yang berakhir menghadap arah semula.'),
      L('In nested loops the outer count is for the sides, the inner count for the steps on a side.', 'Pada perulangan bersarang, angka luar untuk sisi, angka dalam untuk langkah pada satu sisi.'),
      L('Run the program and watch where the robot leaves the road.', 'Jalankan programnya dan lihat di mana robot keluar dari jalan.'),
    ],
    xp: 40,
    tasks: [
      task(
        L('**Level 1.** Walk round the edge and pick up every star. At most 9 blocks.', '**Level 1.** Susuri tepi dan ambil setiap bintang. Paling banyak 9 blok.'),
        level({ worlds: ['>***', '*##*', '****'], allowed: ['move', 'turn', 'collect', 'repeat'], stars: true, max: 9, must: ['repeat'] }),
        prog([repeat(2, [repeat(3, [move(1), collect()]), right(), repeat(2, [move(1), collect()]), right()])]),
      ),
      task(
        L('**Level 2.** A long stair of stars. At most 6 blocks.', '**Level 2.** Tangga panjang berbintang. Paling banyak 6 blok.'),
        level({ worlds: ['>....', '.*...', '..*..', '...*.', '....*'], allowed: ['move', 'turn', 'collect', 'repeat'], stars: true, max: 6, must: ['repeat'] }),
        prog([repeat(4, [move(1), right(), move(1), collect(), left()])]),
      ),
      task(
        L('**Level 3.** A very long wavy road. At most 9 blocks.', '**Level 3.** Jalan bergelombang yang sangat panjang. Paling banyak 9 blok.'),
        level({ worlds: ['#############', '>..#...#...#G', '##...#...#...'], allowed: ['move', 'turn', 'repeat'], reach: true, max: 9, must: ['repeat'] }),
        prog([repeat(3, [move(2), right(), move(1), left(), move(2), left(), move(1), right()])]),
      ),
      task(
        L('**Level 4.** Round the edge again, then say how many stars you picked up. At most 10 blocks.', '**Level 4.** Susuri tepi lagi, lalu ucapkan berapa bintang yang kamu ambil. Paling banyak 10 blok.'),
        level({ worlds: ['>***', '*##*', '*##*', '****'], allowed: ['move', 'turn', 'collect', 'repeat', 'say'], stars: true, say: ['11'], max: 10, must: ['repeat'] }),
        prog([repeat(2, [repeat(3, [move(1), collect()]), right(), repeat(3, [move(1), collect()]), right()]), sayStars()]),
      ),
    ],
  },
}

