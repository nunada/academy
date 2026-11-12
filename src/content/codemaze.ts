import type { Block, BlocksLevel, Cond, Program } from '../lib/blocks'
import { corridorRows, mazeRows, scatterStars, type CorridorSpec } from '../lib/codemaze'
import { runProgram } from '../lib/blocks'
import type { Loc } from './types'
import { clear as clearAhead, collect, left, level, move, notGoal, onStar, prog, repeat, right, when, whileDo } from './code-blocks/b'

/** Code Maze: the levels. Five tiers of four, each tier built on the blocks the one before it taught.
 *  Every level carries a model solution; `tools/check-codemaze.mjs` runs it, so a level that cannot be solved cannot ship. */

const L = (en: string, id: string): Loc => ({ en, id })

export interface MazeLevel {
  id: string
  tier: number
  title: Loc
  /** what to do, in a sentence or two */
  brief: Loc
  /** shown one at a time, from a nudge to nearly the answer */
  hints: Loc[]
  level: BlocksLevel
  solution: Program
}

export interface MazeTier {
  n: number
  title: Loc
  /** what the tier teaches */
  about: Loc
  levels: string[]
}

/* ----------------------------------------------------------------- shorthand */

const rightClear: Cond = { t: 'right-clear' }

const corridors = (specs: CorridorSpec[]): string[][] => specs.map(corridorRows)

/** The right-hand rule: keep a hand on the right wall. Step into any opening on the right, else go straight, else turn left. Works in every maze that has no loops. */
const followRight = (): Block[] => [when(rightClear, [right(), move(1)], [when(clearAhead, [move(1)], [left()])])]

const FOLLOW: Program = prog([whileDo(notGoal, followRight())])

/** A maze with stars on squares the right-hand rule really walks over, so that a program that follows the wall and picks up what it stands on gets them all. */
function starredMaze(spec: { seed: number; cols: number; rows: number }, stars: number): string[] {
  const plain = mazeRows(spec)
  const seen = new Set<string>()
  for (const f of runProgram(plain, FOLLOW).frames) seen.add(`${f.x},${f.y}`)
  const w = plain[0].length
  const h = plain.length
  const cells: [number, number][] = []
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (plain[y][x] === '.' && seen.has(`${x},${y}`)) cells.push([x, y])
  return scatterStars(plain, cells, stars, spec.seed + 1000)
}

/* -------------------------------------------------------------------- levels */

const LEVELS_LIST: MazeLevel[] = [
  /* ------------------------------------------------ tier 1: sequence */
  {
    id: 'm1-1',
    tier: 1,
    title: L('Straight Ahead', 'Lurus Saja'),
    brief: L('Take the robot to the finish square.', 'Bawa robot ke kotak finis.'),
    hints: [
      L('Count the squares between the robot and the finish.', 'Hitung kotak antara robot dan finis.'),
      L('The **move forward** block has a number in it. Put the number of squares there.', 'Blok **maju** punya angka. Isi dengan banyaknya kotak.'),
    ],
    level: level({ worlds: ['#######', '#>...G#', '#######'], allowed: ['move', 'turn'], reach: true }),
    solution: prog([move(4)]),
  },
  {
    id: 'm1-2',
    tier: 1,
    title: L('One Turn', 'Satu Belokan'),
    brief: L('The way bends. Turn the robot at the corner.', 'Jalannya membelok. Putar robot di tikungan.'),
    hints: [
      L('Walk to the corner first, then turn, then walk again.', 'Jalan dulu sampai tikungan, lalu belok, lalu jalan lagi.'),
      L('The robot faces right. Turning right makes it face down.', 'Robot menghadap kanan. Belok kanan membuatnya menghadap ke bawah.'),
    ],
    level: level({ worlds: ['#######', '#>..###', '###.###', '###.###', '###G###', '#######'], allowed: ['move', 'turn'], reach: true }),
    solution: prog([move(2), right(), move(3)]),
  },
  {
    id: 'm1-3',
    tier: 1,
    title: L('Zig-zag', 'Zig-zag'),
    brief: L('Four corners in a row. Break the road into straight pieces.', 'Empat tikungan berturut-turut. Pecah jalan menjadi bagian-bagian lurus.'),
    hints: [
      L('Every straight piece is a **move forward**, and every corner is a **turn**.', 'Setiap bagian lurus adalah **maju**, dan setiap tikungan adalah **belok**.'),
      L('Look at the turns one by one: right, right, left, left.', 'Perhatikan belokannya satu per satu: kanan, kanan, kiri, kiri.'),
    ],
    level: level({
      worlds: ['########', '#>....##', '#####.##', '###...##', '###.####', '###...G#', '########'],
      allowed: ['move', 'turn'],
      reach: true,
    }),
    solution: prog([move(4), right(), move(2), right(), move(2), left(), move(2), left(), move(3)]),
  },
  {
    id: 'm1-4',
    tier: 1,
    title: L('Pick Up the Stars', 'Ambil Bintangnya'),
    brief: L('Pick up both stars, then stop on the finish.', 'Ambil kedua bintang, lalu berhenti di finis.'),
    hints: [
      L('The robot can only pick up a star it is standing on.', 'Robot hanya bisa mengambil bintang yang sedang dipijaknya.'),
      L('Walk until you stand on a star, add **pick up the star**, then go on.', 'Jalan sampai berdiri di atas bintang, tambahkan **ambil bintang**, lalu lanjutkan.'),
    ],
    level: level({
      worlds: ['#########', '#>.*....#', '#######.#', '#G.*....#', '#########'],
      allowed: ['move', 'turn', 'collect'],
      reach: true,
      stars: true,
    }),
    solution: prog([move(2), collect(), move(4), right(), move(2), right(), move(4), collect(), move(2)]),
  },

  /* ------------------------------------------------- tier 2: repeat */
  {
    id: 'm2-1',
    tier: 2,
    title: L('Staircase', 'Tangga'),
    brief: L('Climb down the stairs with at most 6 blocks. The same steps keep coming back: use **repeat**.', 'Turuni tangga dengan paling banyak 6 blok. Langkah yang sama terus muncul: pakai **ulangi**.'),
    hints: [
      L('One step is: forward 1, turn right, forward 1, turn left.', 'Satu anak tangga: maju 1, belok kanan, maju 1, belok kiri.'),
      L('Count the steps, and put that number in the **repeat** block.', 'Hitung anak tangganya, lalu isi angkanya di blok **ulangi**.'),
    ],
    level: level({
      worlds: ['#######', '#>.####', '##..###', '###..##', '####..#', '#####G#', '#######'],
      allowed: ['move', 'turn', 'repeat'],
      reach: true,
      max: 6,
      must: ['repeat'],
    }),
    solution: prog([repeat(4, [move(1), right(), move(1), left()])]),
  },
  {
    id: 'm2-2',
    tier: 2,
    title: L('Around the Wall', 'Mengelilingi Tembok'),
    brief: L('The finish is behind a wall. Go around it with at most 6 blocks.', 'Finisnya ada di balik tembok. Kelilingi dengan paling banyak 6 blok.'),
    hints: [
      L('Three sides look exactly alike: forward 3, then turn.', 'Tiga sisinya persis sama: maju 3, lalu belok.'),
      L('Repeat that three times. Then one more short move reaches the finish.', 'Ulangi itu tiga kali. Lalu satu langkah pendek lagi sampai ke finis.'),
    ],
    level: level({
      worlds: ['######', '#>...#', '####.#', '#G##.#', '#....#', '######'],
      allowed: ['move', 'turn', 'repeat'],
      reach: true,
      max: 6,
      must: ['repeat'],
    }),
    solution: prog([repeat(3, [move(3), right()]), move(1)]),
  },
  {
    id: 'm2-3',
    tier: 2,
    title: L('Stars on the Stairs', 'Bintang di Tangga'),
    brief: L('Collect every star on the way down, using at most 7 blocks.', 'Kumpulkan semua bintang sepanjang tangga, dengan paling banyak 7 blok.'),
    hints: [
      L('Add one more order to the step of the staircase: **pick up the star**.', 'Tambahkan satu perintah lagi pada anak tangga: **ambil bintang**.'),
      L('The stars sit where each step ends. Pick up after the last turn of the step.', 'Bintangnya ada di ujung setiap anak tangga. Ambil setelah belokan terakhir anak tangga.'),
    ],
    level: level({
      worlds: ['########', '#>.#####', '##*.####', '###*.###', '####*.##', '#####*.#', '######G#', '########'],
      allowed: ['move', 'turn', 'collect', 'repeat'],
      reach: true,
      stars: true,
      max: 7,
      must: ['repeat'],
    }),
    solution: prog([repeat(5, [move(1), right(), move(1), left(), collect()])]),
  },
  {
    id: 'm2-4',
    tier: 2,
    title: L('The Snake', 'Si Ular'),
    brief: L('The path winds back and forth. Cross it with at most 12 blocks.', 'Jalannya berkelok bolak-balik. Lewati dengan paling banyak 12 blok.'),
    hints: [
      L('Look for the part that repeats: two rows, and the corners between them.', 'Cari bagian yang berulang: dua baris, dan tikungan di antaranya.'),
      L('One round is: forward 2, right, forward 2, right, forward 2, left, forward 2, left. Do it twice, then finish the last row.', 'Satu putaran: maju 2, kanan, maju 2, kanan, maju 2, kiri, maju 2, kiri. Lakukan dua kali, lalu selesaikan baris terakhir.'),
    ],
    level: level({
      worlds: ['#####', '#>..#', '###.#', '#...#', '#.###', '#...#', '###.#', '#...#', '#.###', '#..G#', '#####'],
      allowed: ['move', 'turn', 'repeat'],
      reach: true,
      max: 12,
      must: ['repeat'],
    }),
    solution: prog([repeat(2, [move(2), right(), move(2), right(), move(2), left(), move(2), left()]), move(2)]),
  },

  /* ----------------------------------------------------- tier 3: if */
  {
    id: 'm3-1',
    tier: 3,
    title: L('Turn at the Wall', 'Belok di Tembok'),
    brief: L(
      'One program has to work on all three maps, and none of them is a straight road. Use **while** and **if**, in at most 6 blocks.',
      'Satu program harus berhasil di ketiga peta, dan tidak satu pun jalannya lurus. Pakai **selama** dan **jika**, dengan paling banyak 6 blok.',
    ),
    hints: [
      L('You cannot count squares: the maps are different. Let the robot look instead.', 'Kamu tidak bisa menghitung kotak: petanya berbeda-beda. Biarkan robot melihat sendiri.'),
      L('While the robot is not on the goal: if the way ahead is clear, move 1; otherwise turn right.', 'Selama robot belum di finis: jika jalan di depan terbuka, maju 1; kalau tidak, belok kanan.'),
    ],
    level: level({
      worlds: corridors([
        { seed: 101, w: 9, h: 9, segments: 4, bends: 'right' },
        { seed: 102, w: 9, h: 7, segments: 3, bends: 'right' },
        { seed: 103, w: 11, h: 9, segments: 5, bends: 'right' },
      ]),
      allowed: ['move', 'turn', 'if', 'while'],
      conds: ['front-clear', 'front-blocked', 'not-on-goal'],
      reach: true,
      max: 6,
      must: ['while', 'if'],
    }),
    solution: prog([whileDo(notGoal, [when(clearAhead, [move(1)], [right()])])]),
  },
  {
    id: 'm3-2',
    tier: 3,
    title: L('The Other Way', 'Ke Arah Lain'),
    brief: L('Now every corner turns left. The same idea, the other turn.', 'Sekarang setiap tikungan menuju kiri. Gagasannya sama, belokannya lain.'),
    hints: [
      L('Start from the program that worked before.', 'Mulailah dari program yang tadi berhasil.'),
      L('Only one block has to change: which way the robot turns.', 'Hanya satu blok yang perlu diubah: ke arah mana robot belok.'),
    ],
    level: level({
      worlds: corridors([
        { seed: 111, w: 9, h: 9, segments: 4, bends: 'left' },
        { seed: 112, w: 9, h: 9, segments: 4, bends: 'left' },
        { seed: 113, w: 11, h: 9, segments: 5, bends: 'left' },
      ]),
      allowed: ['move', 'turn', 'if', 'while'],
      conds: ['front-clear', 'front-blocked', 'not-on-goal'],
      reach: true,
      max: 6,
      must: ['while', 'if'],
    }),
    solution: prog([whileDo(notGoal, [when(clearAhead, [move(1)], [left()])])]),
  },
  {
    id: 'm3-3',
    tier: 3,
    title: L('Stars on the Bends', 'Bintang di Tikungan'),
    brief: L('Pick up every star along the road and stop on the finish.', 'Ambil semua bintang di sepanjang jalan dan berhenti di finis.'),
    hints: [
      L('Add a second **if** that asks: am I standing on a star?', 'Tambahkan **jika** kedua yang bertanya: apakah aku berdiri di atas bintang?'),
      L('Ask about the star before you move on, inside the same loop.', 'Tanyakan soal bintang sebelum melangkah, di dalam perulangan yang sama.'),
    ],
    level: level({
      worlds: corridors([
        { seed: 121, w: 9, h: 9, segments: 4, bends: 'right', stars: 3 },
        { seed: 122, w: 11, h: 9, segments: 5, bends: 'right', stars: 4 },
      ]),
      allowed: ['move', 'turn', 'collect', 'if', 'while'],
      conds: ['front-clear', 'on-star', 'not-on-goal'],
      reach: true,
      stars: true,
      max: 8,
      must: ['while', 'if', 'collect'],
    }),
    solution: prog([whileDo(notGoal, [when(onStar, [collect()]), when(clearAhead, [move(1)], [right()])])]),
  },
  {
    id: 'm3-4',
    tier: 3,
    title: L('Facing the Wrong Way', 'Menghadap ke Arah yang Salah'),
    brief: L('Here the robot starts facing a wall, and each map points a different way. Your program must not care.', 'Di sini robot mulai dengan menghadap tembok, dan tiap peta menghadap arah yang berbeda. Programmu tidak boleh peduli.'),
    hints: [
      L('A robot that faces a wall is in the “otherwise” case of your **if**.', 'Robot yang menghadap tembok berada di kasus “kalau tidak” pada **jika**-mu.'),
      L('It turns until the way ahead is clear. The program you already have does that.', 'Ia berputar sampai jalan di depan terbuka. Program yang sudah kamu punya melakukannya.'),
    ],
    level: level({
      worlds: corridors([
        { seed: 131, w: 9, h: 9, segments: 4, bends: 'right', face: 'behind' },
        { seed: 132, w: 9, h: 9, segments: 4, bends: 'right', face: 'side' },
        { seed: 133, w: 11, h: 9, segments: 5, bends: 'right', face: 'behind' },
      ]),
      allowed: ['move', 'turn', 'if', 'while'],
      conds: ['front-clear', 'front-blocked', 'not-on-goal'],
      reach: true,
      max: 6,
      must: ['while', 'if'],
    }),
    solution: prog([whileDo(notGoal, [when(clearAhead, [move(1)], [right()])])]),
  },

  /* ------------------------------------------------- tier 4: sensors */
  {
    id: 'm4-1',
    tier: 4,
    title: L('Left or Right?', 'Kiri atau Kanan?'),
    brief: L(
      'The corners now go both ways. The robot can look to its right: **the way on the right is clear**. Use at most 7 blocks.',
      'Tikungannya kini ke dua arah. Robot bisa melihat ke kanannya: **jalan di kanan terbuka**. Pakai paling banyak 7 blok.',
    ),
    hints: [
      L('At a corner, the robot has to choose: right or left.', 'Di tikungan, robot harus memilih: kanan atau kiri.'),
      L('Put an **if** inside the “otherwise” of the first one: if the right is clear, turn right; otherwise turn left.', 'Taruh **jika** di dalam “kalau tidak” pada **jika** pertama: jika kanan terbuka, belok kanan; kalau tidak, belok kiri.'),
    ],
    level: level({
      worlds: corridors([
        { seed: 141, w: 9, h: 9, segments: 4, bends: 'mixed' },
        { seed: 142, w: 11, h: 9, segments: 5, bends: 'mixed' },
        { seed: 143, w: 11, h: 11, segments: 6, bends: 'mixed' },
      ]),
      allowed: ['move', 'turn', 'if', 'while'],
      conds: ['front-clear', 'right-clear', 'left-clear', 'not-on-goal'],
      reach: true,
      max: 7,
      must: ['while', 'if'],
    }),
    solution: prog([whileDo(notGoal, [when(clearAhead, [move(1)], [when(rightClear, [right()], [left()])])])]),
  },
  {
    id: 'm4-2',
    tier: 4,
    title: L('Stars in the Corridor', 'Bintang di Lorong'),
    brief: L('Both kinds of corner, and stars on the way. Pick them all up.', 'Dua jenis tikungan, dan bintang di sepanjang jalan. Ambil semuanya.'),
    hints: [
      L('Combine the two programs you have: the one that picks up stars and the one that chooses a side.', 'Gabungkan dua programmu: yang mengambil bintang dan yang memilih sisi.'),
      L('The star check goes first in the loop, the moving after it.', 'Pemeriksaan bintang di awal perulangan, geraknya sesudahnya.'),
    ],
    level: level({
      worlds: corridors([
        { seed: 151, w: 11, h: 9, segments: 5, bends: 'mixed', stars: 3 },
        { seed: 152, w: 11, h: 11, segments: 6, bends: 'mixed', stars: 4 },
      ]),
      allowed: ['move', 'turn', 'collect', 'if', 'while'],
      conds: ['front-clear', 'right-clear', 'left-clear', 'on-star', 'not-on-goal'],
      reach: true,
      stars: true,
      max: 10,
      must: ['while', 'if', 'collect'],
    }),
    solution: prog([whileDo(notGoal, [when(onStar, [collect()]), when(clearAhead, [move(1)], [when(rightClear, [right()], [left()])])])]),
  },
  {
    id: 'm4-3',
    tier: 4,
    title: L('A Fork in the Road', 'Jalan Bercabang'),
    brief: L(
      'These are small mazes, and the road forks. Keep a hand on the right wall: **go into any opening on the right**, else go straight, else turn left.',
      'Ini labirin kecil, dan jalannya bercabang. Pegang tembok di sisi kanan: **masuk ke setiap bukaan di kanan**, kalau tidak lurus, kalau tidak belok kiri.',
    ),
    hints: [
      L('Ask about the right first this time, before the way ahead.', 'Kali ini tanyakan sisi kanan lebih dulu, sebelum jalan di depan.'),
      L('If the right is clear: turn right and move 1. Otherwise: if the way ahead is clear, move 1; otherwise turn left.', 'Jika kanan terbuka: belok kanan dan maju 1. Kalau tidak: jika jalan di depan terbuka, maju 1; kalau tidak, belok kiri.'),
    ],
    level: level({
      worlds: [mazeRows({ seed: 24, cols: 4, rows: 4 }), mazeRows({ seed: 40, cols: 4, rows: 4 })],
      allowed: ['move', 'turn', 'if', 'while'],
      conds: ['front-clear', 'right-clear', 'left-clear', 'not-on-goal'],
      reach: true,
      max: 8,
      must: ['while', 'if'],
    }),
    solution: FOLLOW,
  },
  {
    id: 'm4-4',
    tier: 4,
    title: L('A Long Way Round', 'Jalan yang Panjang'),
    brief: L('Long corridors, many corners, stars on the way, and a robot that starts facing the wrong way.', 'Lorong panjang, banyak tikungan, bintang di jalan, dan robot yang mulai menghadap arah yang salah.'),
    hints: [
      L('Nothing new is needed. Check that your program does not assume the robot starts facing the road.', 'Tidak ada yang baru. Pastikan programmu tidak mengira robot mulai menghadap jalan.'),
      L('Take the star program and trust the “otherwise” cases: they turn the robot until the road is ahead.', 'Pakai program bintang tadi dan percayakan pada kasus “kalau tidak”: kasus itu memutar robot sampai jalan ada di depan.'),
    ],
    level: level({
      worlds: corridors([
        { seed: 161, w: 13, h: 11, segments: 7, bends: 'mixed', stars: 4, face: 'behind', minLen: 2, maxLen: 5 },
        { seed: 162, w: 13, h: 13, segments: 8, bends: 'mixed', stars: 5, face: 'side', minLen: 2, maxLen: 5 },
      ]),
      allowed: ['move', 'turn', 'collect', 'if', 'while'],
      conds: ['front-clear', 'right-clear', 'left-clear', 'on-star', 'not-on-goal'],
      reach: true,
      stars: true,
      max: 10,
      must: ['while', 'if', 'collect'],
    }),
    solution: prog([whileDo(notGoal, [when(onStar, [collect()]), when(clearAhead, [move(1)], [when(rightClear, [right()], [left()])])])]),
  },

  /* ------------------------------------------------- tier 5: mazes */
  {
    id: 'm5-1',
    tier: 5,
    title: L('Your First Maze', 'Labirin Pertamamu'),
    brief: L('Real mazes, with dead ends. One program must find the way out of both, in at most 8 blocks.', 'Labirin sungguhan, dengan jalan buntu. Satu program harus menemukan jalan keluar dari keduanya, dengan paling banyak 8 blok.'),
    hints: [
      L('You already know the right-hand rule from the fork in the road.', 'Kamu sudah mengenal aturan tangan kanan dari jalan bercabang.'),
      L('It does not need a map: it only looks at the squares next to the robot.', 'Aturan itu tidak memerlukan peta: ia hanya melihat kotak di sebelah robot.'),
    ],
    level: level({
      worlds: [mazeRows({ seed: 32, cols: 5, rows: 4 }), mazeRows({ seed: 33, cols: 5, rows: 5 })],
      allowed: ['move', 'turn', 'if', 'while'],
      conds: ['front-clear', 'right-clear', 'left-clear', 'not-on-goal'],
      reach: true,
      max: 8,
      must: ['while', 'if'],
    }),
    solution: FOLLOW,
  },
  {
    id: 'm5-2',
    tier: 5,
    title: L('Three Mazes', 'Tiga Labirin'),
    brief: L('Bigger mazes, and three of them. The same short program has to solve them all.', 'Labirin yang lebih besar, dan ada tiga. Program singkat yang sama harus menyelesaikan semuanya.'),
    hints: [
      L('If one maze works and another does not, the program is relying on something that is only true in the first.', 'Bila satu labirin berhasil dan yang lain tidak, programmu bergantung pada sesuatu yang hanya benar di labirin pertama.'),
      L('The right-hand rule has no such assumption, so it needs no change for a larger maze.', 'Aturan tangan kanan tidak punya asumsi seperti itu, jadi tidak perlu diubah untuk labirin yang lebih besar.'),
    ],
    level: level({
      worlds: [mazeRows({ seed: 29, cols: 5, rows: 5 }), mazeRows({ seed: 3, cols: 6, rows: 5 }), mazeRows({ seed: 25, cols: 6, rows: 6 })],
      allowed: ['move', 'turn', 'if', 'while'],
      conds: ['front-clear', 'right-clear', 'left-clear', 'not-on-goal'],
      reach: true,
      max: 8,
      must: ['while', 'if'],
    }),
    solution: FOLLOW,
  },
  {
    id: 'm5-3',
    tier: 5,
    title: L('Stars in the Maze', 'Bintang di Labirin'),
    brief: L('Find the way out and pick up every star on the way.', 'Temukan jalan keluar dan ambil semua bintang di sepanjang jalan.'),
    hints: [
      L('Add the star check to the front of the loop, as you did in the corridors.', 'Tambahkan pemeriksaan bintang di awal perulangan, seperti di lorong tadi.'),
      L('Every star lies on the route the right-hand rule walks, so no extra searching is needed.', 'Setiap bintang terletak pada rute yang dilalui aturan tangan kanan, jadi tidak perlu mencari lagi.'),
    ],
    level: level({
      worlds: [starredMaze({ seed: 16, cols: 5, rows: 5 }, 4), starredMaze({ seed: 24, cols: 6, rows: 6 }, 5)],
      allowed: ['move', 'turn', 'collect', 'if', 'while'],
      conds: ['front-clear', 'right-clear', 'left-clear', 'on-star', 'not-on-goal'],
      reach: true,
      stars: true,
      max: 11,
      must: ['while', 'if', 'collect'],
    }),
    solution: prog([whileDo(notGoal, [when(onStar, [collect()]), ...followRight()])]),
  },
  {
    id: 'm5-4',
    tier: 5,
    title: L('The Great Maze', 'Labirin Raksasa'),
    brief: L('Three large mazes with stars, and as few blocks as you can. This is the last one.', 'Tiga labirin besar dengan bintang, dan sesedikit mungkin blok. Ini yang terakhir.'),
    hints: [
      L('Fewer blocks means a smaller program, not a faster robot. Look for a block you can do without.', 'Blok yang lebih sedikit berarti program yang lebih kecil, bukan robot yang lebih cepat. Cari blok yang bisa dibuang.'),
      L('Use the speed buttons under the map, so you do not have to watch every step.', 'Pakai tombol kecepatan di bawah peta, supaya tidak perlu menonton setiap langkah.'),
    ],
    level: level({
      worlds: [starredMaze({ seed: 61, cols: 7, rows: 7 }, 6), starredMaze({ seed: 62, cols: 6, rows: 7 }, 5), starredMaze({ seed: 63, cols: 8, rows: 6 }, 6)],
      allowed: ['move', 'turn', 'collect', 'if', 'while'],
      conds: ['front-clear', 'right-clear', 'left-clear', 'on-star', 'not-on-goal'],
      reach: true,
      stars: true,
      max: 10,
      must: ['while', 'if', 'collect'],
    }),
    solution: prog([whileDo(notGoal, [when(onStar, [collect()]), ...followRight()])]),
  },
]

export const LEVELS: MazeLevel[] = LEVELS_LIST

export const levelById = (id: string): MazeLevel | undefined => LEVELS.find((l) => l.id === id)

export const TIERS: MazeTier[] = [
  {
    n: 1,
    title: L('Sequence', 'Urutan'),
    about: L('Blocks run from top to bottom. Give the robot its orders one after the other.', 'Blok dijalankan dari atas ke bawah. Beri robot perintah satu demi satu.'),
  },
  {
    n: 2,
    title: L('Repeat', 'Ulangi'),
    about: L('A pattern that comes back can be written once and repeated.', 'Pola yang muncul lagi cukup ditulis sekali lalu diulang.'),
  },
  {
    n: 3,
    title: L('If', 'Jika'),
    about: L('The robot looks before it acts, so one program works on maps it has never seen.', 'Robot melihat dulu sebelum bertindak, sehingga satu program berhasil di peta yang belum pernah ia lihat.'),
  },
  {
    n: 4,
    title: L('Sensors', 'Sensor'),
    about: L('With a sensor on each side, the robot can choose its way at a corner and at a fork.', 'Dengan sensor di tiap sisi, robot bisa memilih jalan di tikungan dan di percabangan.'),
  },
  {
    n: 5,
    title: L('Mazes', 'Labirin'),
    about: L('The right-hand rule finds the way out of any maze without loops.', 'Aturan tangan kanan menemukan jalan keluar dari labirin mana pun yang tidak berputar.'),
  },
].map((t) => ({ ...t, levels: LEVELS.filter((l) => l.tier === t.n).map((l) => l.id) }))
