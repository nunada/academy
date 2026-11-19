import type { Loc } from './types'

/** The chapters and levels of Number Maze. The grids are text (see `lib/numbermaze.ts` for the tokens); `par` is the length of the shortest way, which the checker
 *  (`tools/check-numbermaze.mjs`) finds again with a solver of its own and compares. The levels are the ones of the Numaze project, original and not copies of any
 *  other game's; the order inside a chapter is the order of difficulty (how easily a step spoils the game), not of length.
 *
 *  Inside a chapter a level opens when the one before it is solved; all chapters are open from the start, so a player can choose the topic they are learning. */

const L = (en: string, id: string): Loc => ({ en, id })

export interface MazeLevel {
  id: string
  name: Loc
  hint: Loc
  startValue: number
  minValue?: number
  maxValue?: number
  grid: string[]
  /** the fewest steps to the exit */
  par: number
}
export interface MazeChapter {
  id: string
  name: Loc
  subtitle: Loc
  /** a chapter that is not finished: more levels will come */
  draft?: boolean
  levels: MazeLevel[]
}

const ARITHMETIC: MazeLevel[] = [
  {
    id: 'a01',
    name: L('First Step', 'Langkah Pertama'),
    hint: L('Swipe, or use the arrow keys or the buttons, to move your number to the exit.', 'Geser layar, atau pakai tombol panah atau tombol di layar, untuk menggerakkan angkamu ke pintu keluar.'),
    startValue: 0,
    grid: ['#  #  #  #  #  #  #', '#  S  .  .  .  G  #', '#  #  #  #  #  #  #'],
    par: 4,
  },
  {
    id: 'a02',
    name: L('Just Once', 'Sekali Saja'),
    hint: L('A gold dashed tile disappears after you step on it. Going back there adds nothing.', 'Petak emas bergaris putus-putus lenyap setelah dilewati. Kembali ke sana tidak akan menambah apa-apa lagi.'),
    startValue: 0,
    grid: ['#  #     #  #   #', '#  G?=2  S  +2! #', '#  #     #  #   #'],
    par: 3,
  },
  {
    id: 'a03',
    name: L('Grab It, Then Come Back', 'Ambil Lalu Kembali'),
    hint: L('The operator is in a dead end. Take it first, then go on to the right.', 'Operatornya ada di ujung buntu. Ambil dulu, baru lanjut ke kanan.'),
    startValue: 3,
    grid: ['#  #  #    #     #      #', '#  #  *3!  #     #      #', '#  S  .    ?>=9  G?=9   #', '#  #  #    #     #      #'],
    par: 5,
  },
  {
    id: 'a04',
    name: L('Upper Limit', 'Batas Atas'),
    hint: L('The gate in the middle refuses 10 or more. Luckily the addition stops just below it.', 'Gerbang di tengah menolak nilai 10 atau lebih. Untung tambahannya berhenti tepat di bawahnya.'),
    startValue: 4,
    grid: ['#  #  #    #  #     #    #  #     #', '#  S  +4!  .  ?<10  -3!  .  G?=5  #', '#  #  #    #  #     #    #  #     #'],
    par: 6,
  },
  {
    id: 'a05',
    name: L('Choose a Path', 'Pilih Jalan'),
    hint: L('Three is odd, so the lower gate is still closed. There is one more tile at the far right.', 'Tiga itu ganjil, jadi gerbang bawah masih tertutup. Ada satu petak lagi di ujung kanan.'),
    startValue: 0,
    grid: ['#  #  #    #      #    #', '#  S  +3!  .      *2!  #', '#  #  #    ?even  #    #', '#  #  #    G?=6   #    #', '#  #  #    #      #    #'],
    par: 6,
  },
  {
    id: 'a06',
    name: L('Around the Ring', 'Keliling Cincin'),
    hint: L('The map is a ring, but each operator works only once. The direction you go round decides the order.', 'Denah melingkar, tapi tiap operator hanya sekali. Arah putaranmu menentukan urutannya.'),
    startValue: 3,
    grid: ['#  #    #  #      #  #', '#  S    .  +2!    .  #', '#  *3!  #  #      .  #', '#  .    .  .      .  #', '#  #    #  ?>=12  #  #', '#  #    #  G?=15  #  #', '#  #    #  #      #  #'],
    par: 10,
  },
  {
    id: 'a07',
    name: L('Shrinking Step by Step', 'Susut Bertahap'),
    hint: L('Divide first and then subtract, or subtract first and then divide? The results differ.', 'Bagi dulu lalu kurangi, atau kurangi dulu lalu bagi? Hasilnya tidak sama.'),
    startValue: 24,
    grid: ['#  #    #  #      #  #', '#  S    .  /2!    .  #', '#  -4!  #  #      .  #', '#  .    .  .      .  #', '#  #    #  ?<=12  #  #', '#  #    #  G?=8   #  #', '#  #    #  #      #  #'],
    par: 10,
  },
  {
    id: 'a08',
    name: L('Order Matters', 'Urutan Itu Penting'),
    hint: L('Two paths, two orders of operations. Only one lands exactly on 10.', 'Dua jalur, dua urutan operasi. Hanya satu yang mendarat tepat di 10.'),
    startValue: 2,
    grid: ['#  #  #    #  #    #      #', '#  .  +3!  .  *2!  .      #', '#  S  #    #  #    G?=10  #', '#  .  *2!  .  +3!  .      #', '#  #  #    #  #    #      #'],
    par: 6,
  },
  {
    id: 'a09',
    name: L('Three Purchases', 'Tiga Belanja'),
    hint: L('Three operators are spread around the ring. You need all of them, and the order is not free.', 'Tiga operator tersebar di cincin. Kamu perlu ketiganya, dan urutannya tidak bebas.'),
    startValue: 2,
    grid: ['#  #    #     #      #  #', '#  S    .     +5!    .  #', '#  *2!  #     #      .  #', '#  .    -3!   .      .  #', '#  #    #     ?>=8   #  #', '#  #    #     G?=8   #  #', '#  #    #     #      #  #'],
    par: 14,
  },
  {
    id: 'a10',
    name: L('Divide First or Add First', 'Bagi Dulu atau Tambah Dulu'),
    hint: L('Division only works when the result is whole, and that depends on when you divide.', 'Pembagian hanya jalan kalau hasilnya bulat, dan itu tergantung kamu membaginya kapan.'),
    startValue: 3,
    grid: ['#  #  #    #  #    #     #', '#  .  +5!  .  /2!  .     #', '#  S  #    #  #    G?=4  #', '#  .  /3!  .  +5!  .     #', '#  #  #    #  #    #     #'],
    par: 6,
  },
  {
    id: 'a11',
    name: L('Two Long Paths', 'Dua Jalur Panjang'),
    hint: L('Four tiles, two orders. Multiply when your number is just right, not before.', 'Empat petak, dua urutan. Kalikan saat angkamu sudah pas, bukan sebelumnya.'),
    startValue: 3,
    grid: ['#  #  #    #  #    #  #      #', '#  .  +1!  .  *3!  .  .      #', '#  S  #    #  #    #  G?=12  #', '#  .  *3!  .  +1!  .  .      #', '#  #  #    #  #    #  #      #'],
    par: 7,
  },
  {
    id: 'a12',
    name: L('Blue Tiles', 'Petak Biru'),
    hint: L('Blue tiles never run out: step on them as often as you like, back and forth. Nothing can be spoiled here.', 'Petak biru tidak pernah habis: injak sesukamu, maju dan mundur. Tidak ada yang bisa dirusak di sini.'),
    startValue: 1,
    grid: ['#  #   #    #   #', '#  .   S    .   #', '#  +1  .    -1  #', '#  .   .    .   #', '#  #   ?=7  #   #', '#  #   G    #   #', '#  #   #    #   #'],
    par: 16,
  },
  {
    id: 'a13',
    name: L('One Precious Tile', 'Satu Yang Berharga'),
    hint: L('The blue +1 tile can be used again and again. The gold ×7 tile only once: come to it with the right number already.', 'Petak +1 biru boleh dipakai berulang-ulang. Petak ×7 emas hanya sekali: datangi ia dengan angka yang sudah tepat.'),
    startValue: 1,
    grid: ['#  #   #  #      #  #', '#  S   .  *7!    .  #', '#  +1  #  #      .  #', '#  .   .  .      .  #', '#  #   #  ?>=20  #  #', '#  #   #  G?=21  #  #', '#  #   #  #      #  #'],
    par: 12,
  },
  {
    id: 'a14',
    name: L('Arithmetic Exam', 'Ujian Aritmetika'),
    hint: L('Make it big first with the two gold tiles, then tune it down with the blue tile until the last division fits.', 'Besarkan dulu dengan dua petak emas, lalu setel turun dengan petak biru sampai pembagian terakhir pas.'),
    startValue: 2,
    grid: ['#  #   #  #      #    #', '#  S   .  +3!    .    #', '#  -1  #  #      *2!  #', '#  .   .  .      .    #', '#  #   #  ?even  #    #', '#  #   #  /2!    #    #', '#  #   #  G?=4   #    #', '#  #   #  #      #    #'],
    par: 11,
  },
]

const INEQUALITIES: MazeLevel[] = [
  {
    id: 'i01',
    name: L('Fold', 'Lipat'),
    hint: L('The |x| tile throws away the minus sign.', 'Petak |x| membuang tanda minus.'),
    startValue: -7,
    grid: ['#  #  #    #     #', '#  S  abs  G?=7  #', '#  #  #    #     #'],
    par: 2,
  },
  {
    id: 'i02',
    name: L('Big Enough', 'Cukup Besar'),
    hint: L('This gate needs at least 10. Step on +3 again and again until it is enough.', 'Gerbang ini butuh minimal 10. Injak +3 berulang kali sampai cukup.'),
    startValue: 0,
    grid: ['#  #  #  #  #      #  #', '#  S  +3 .  ?>=10  G  #', '#  #  #  #  #      #  #'],
    par: 10,
  },
  {
    id: 'i03',
    name: L('Two Limits', 'Dua Batas'),
    hint: L('A range gate accepts only values between the two numbers.', 'Gerbang rentang hanya menerima nilai di antara kedua angka itu.'),
    startValue: 0,
    grid: ['#  #  #  #  #        #      #', '#  S  +7 .  ?10..20  G?=14  #', '#  #  #  #  #        #      #'],
    par: 6,
  },
  {
    id: 'i04',
    name: L('Below Zero', 'Ke Bawah Nol'),
    hint: L('Values may be negative. Note that −12 is smaller than −10.', 'Nilai boleh negatif. Perhatikan bahwa −12 lebih kecil daripada −10.'),
    startValue: 0,
    grid: ['#  #  #  #  #       #        #', '#  S  -4 .  ?<=-10  G?=-12   #', '#  #  #  #  #       #        #'],
    par: 8,
  },
  {
    id: 'i05',
    name: L('Down First', 'Turun Dulu'),
    hint: L('To get 8, first go down to −8.', 'Untuk mendapat 8, turunlah sampai −8 lebih dulu.'),
    startValue: 2,
    grid: ['#  #  #  #  #    #     #', '#  S  -5 .  abs  G?=8  #', '#  #  #  #  #    #     #'],
    par: 6,
  },
  {
    id: 'i06',
    name: L('A Little Further', 'Lewat Sedikit'),
    hint: L('Stopping at 3 will never give 4. Go past zero.', 'Berhenti di 3 tidak akan pernah menghasilkan 4. Lewati nol.'),
    startValue: 10,
    grid: ['#  #  #  #  #     #    #     #', '#  S  -7 .  ?<=5  abs  G?=4  #', '#  #  #  #  #     #    #     #'],
    par: 7,
  },
  {
    id: 'i07',
    name: L('Flip the Sign', 'Balik Tanda'),
    hint: L('The ± tile flips the sign. Go down far enough first, then flip.', 'Petak ± membalik tanda. Turun dulu sampai cukup jauh, baru dibalik.'),
    startValue: 1,
    grid: ['#  #  #  #  #    #     #     #', '#  S  -3 .  neg  ?>0  G?=5   #', '#  #  #  #  #    #     #     #'],
    par: 7,
  },
  {
    id: 'i08',
    name: L('Mirror Junction', 'Simpang Cermin'),
    hint: L('The |x| tile is in the dead end on the right. Take it first, then go down.', 'Petak |x| ada di ujung buntu sebelah kanan. Ambil dulu, baru turun.'),
    startValue: -3,
    grid: ['#  #  #      #  #   #', '#  S  -4     .  abs #', '#  #  #      ?>=7   #  #', '#  #  #      G?=7   #  #', '#  #  #      #  #   #'],
    par: 6,
  },
  {
    id: 'i09',
    name: L('Which Door', 'Pintu Mana'),
    hint: L('Your own starting value decides which path is open.', 'Nilai awalmu sendiri yang menentukan jalur mana yang terbuka.'),
    startValue: 4,
    grid: ['#  #      #  #  #  #     #', '#  ?<5    *3 .  -4 .     #', '#  S      #  #  #  G?=8  #', '#  ?>=5   -4 .  *3 .     #', '#  #      #  #  #  #     #'],
    par: 6,
  },
  {
    id: 'i10',
    name: L('How Many Laps', 'Berapa Putaran'),
    hint: L('Every lap adds 4. The gate limits how many laps are allowed.', 'Tiap putaran menambah 4. Gerbangnya membatasi berapa putaran yang boleh.'),
    startValue: 0,
    grid: ['#  #  #  #         #  #', '#  S  .  +4        .  #', '#  .  #  #         .  #', '#  .  .  .         .  #', '#  #  #  ?12..16   #  #', '#  #  #  G?=16     #  #', '#  #  #  #         #  #'],
    par: 14,
  },
  {
    id: 'i11',
    name: L('Must Go Below', 'Harus Lewat Bawah'),
    hint: L('The ?<0 gate forces you negative first. Go down exactly as far as needed.', 'Gerbang ?<0 memaksamu negatif dulu. Turun tepat sejauh yang dibutuhkan.'),
    startValue: 0,
    grid: ['#  #  #   #    #    #      #', '#  S  -3  ?<0  abs  ?<10   #', '#  -1 #   .    #    .      #', '#  .  +2  .    .    G?=6   #', '#  #  #   #    #    #      #'],
    par: 8,
  },
  {
    id: 'i12',
    name: L('A Long Fall', 'Jatuh Jauh'),
    hint: L('Make it bigger first in the left branch, drop it in the ring, fold before leaving.', 'Besarkan dulu di cabang kiri, jatuhkan di cincin, lipat sebelum keluar.'),
    startValue: 8,
    grid: ['#  #    #  #      #    #', '#  .    .  -20    .    #', '#  .    #  #      abs  #', '#  .    .  .      .    #', '#  *2   #  ?<10   #    #', '#  S    #  G?=4   #    #', '#  #    #  #      #    #'],
    par: 12,
  },
  {
    id: 'i13',
    name: L('Climbing One by One', 'Naik Satu-satu'),
    hint: L('Go far down, then crawl up one at a time until the fold fits exactly.', 'Turun jauh sekali, lalu merangkak naik satu per satu sampai lipatannya pas.'),
    startValue: 0,
    grid: ['#  #  #   #    #   #      #', '#  S  -9  ?<0  +1  .      #', '#  .  #   .    #   .      #', '#  .  .   .    .   .      #', '#  #  #   #    #   abs    #', '#  #  #   #    #   G?=5   #', '#  #  #   #    #   #      #'],
    par: 14,
  },
  {
    id: 'i14',
    name: L('Open Room Exam', 'Ujian Ruang Terbuka'),
    hint: L('An open room: every tile has many neighbours. Build 23 before folding.', 'Ruang terbuka: tiap petak bertetangga dengan banyak petak. Bangun 23 sebelum melipat.'),
    startValue: 1,
    grid: ['#  #     #    #        #', '#  S     +3   *2       #', '#  -3    abs  ?prime   #', '#  ?<0   /2   G?=23    #', '#  #     #    #        #'],
    par: 10,
  },
]

const NUMBERS: MazeLevel[] = [
  {
    id: 'n01',
    name: L('Once Only', 'Sekali Pakai'),
    hint: L('The dashed tiles disappear after you pass them. No second chances.', 'Petak bergaris putus-putus lenyap setelah kamu lewati. Tidak ada kesempatan kedua.'),
    startValue: 0,
    grid: ['#  #  #   #   #   #     #', '#  S  +2! +2! +2! G?=6  #', '#  #  #   #   #   #     #'],
    par: 4,
  },
  {
    id: 'n02',
    name: L('The First Key', 'Kunci Pertama'),
    hint: L('Pick up the key in the top branch, then the lock on the right opens by itself.', 'Pungut kunci di cabang atas, lalu gembok di kanan akan terbuka sendiri.'),
    startValue: 0,
    grid: ['#  #  #     #      #  #', '#  #  key1  #      #  #', '#  S  .     lock1  G  #', '#  #  #     #      #  #'],
    par: 5,
  },
  {
    id: 'n03',
    name: L('Sieve the Primes', 'Saring Prima'),
    hint: L('The prime gate rejects 1 and every composite number. Climb by twos until you find one.', 'Gerbang prima menolak 1 dan semua bilangan majemuk. Naik dua-dua sampai ketemu.'),
    startValue: 1,
    grid: ['#  #  #   #  #       #     #', '#  S  +2  .  ?prime  G?=7  #', '#  #  #   #  #       #     #'],
    par: 8,
  },
  {
    id: 'n04',
    name: L('A Valuable Reserve', 'Simpanan Berharga'),
    hint: L('There is only one ×3 tile and it is used up once. Come to it with the right number already.', 'Hanya ada satu petak ×3, dan ia habis sekali pakai. Datangi ia dengan angka yang sudah tepat.'),
    startValue: 1,
    grid: ['#  #  #  #      #  #', '#  S  .  .      .  #', '#  +2 #  #      .  #', '#  .  *3! .     .  #', '#  #  #  ?>=20  #  #', '#  #  #  G?=21  #  #', '#  #  #  #      #  #'],
    par: 10,
  },
  {
    id: 'n05',
    name: L('Two Keys', 'Dua Kunci'),
    hint: L('The left key can only be reached with value 2, the right key with value 5. Both operators are used up once: think about the order.', 'Kunci kiri hanya bisa diraih dengan nilai 2, kunci kanan dengan nilai 5. Kedua operator habis sekali pakai: pikirkan urutannya.'),
    startValue: 1,
    grid: ['#  #     #    #      #     #     #     #', '#  #     #    S      #     #     #     #', '#  #     #    +1!    #     #     #     #', '#  key1  ?=2  .      +3!   ?=5   key2  #', '#  #     #    lock1  #     #     #     #', '#  #     #    lock2  #     #     #     #', '#  #     #    G      #     #     #     #', '#  #     #    #      #     #     #     #'],
    par: 15,
  },
  {
    id: 'n06',
    name: L('Factor Laps', 'Putaran Faktor'),
    hint: L('This ring adds three every lap. Stop exactly at the prime that is asked for.', 'Cincin ini menambah tiga tiap putaran. Berhenti tepat di bilangan prima yang diminta.'),
    startValue: 1,
    grid: ['#  #  #  #       #  #', '#  S  .  *2      .  #', '#  +3 #  #       .  #', '#  .  .  .       .  #', '#  #  #  ?prime  #  #', '#  #  #  G?=13   #  #', '#  #  #  #       #  #'],
    par: 12,
  },
  {
    id: 'n07',
    name: L('Even Staircase', 'Tangga Genap'),
    hint: L('Starting from 1, the top row can only make odd numbers: +2 and ×3 never change that. The exit is even, so you must go down. The right-most rung can only be climbed.', 'Mulai dari 1, baris atas hanya bisa menghasilkan bilangan ganjil: +2 dan ×3 tidak pernah mengubah itu. Pintu keluarnya genap, jadi kamu wajib turun. Anak tangga paling kanan hanya bisa dinaiki.'),
    startValue: 1,
    grid: ['#  #     #   #     #   #     #   #       #', '#  S     +2  .     *3  .     .   .       #', '#  ?odd  #   ?>=9  #   ?x3   #   w^      #', '#  .     -4  .     *2  .     .   G?=30   #', '#  #     #   #     #   #     #   #       #'],
    par: 12,
  },
]

export const CHAPTERS: MazeChapter[] = [
  { id: 'arithmetic', name: L('Arithmetic', 'Aritmetika'), subtitle: L('Add, subtract, multiply, divide: some tiles only once', 'Tambah, kurang, kali, bagi: sebagian petak hanya sekali'), levels: ARITHMETIC },
  { id: 'inequalities', name: L('Inequalities and Absolute Value', 'Pertidaksamaan dan Nilai Mutlak'), subtitle: L('Limits, ranges, folding the sign and flipping it', 'Batas, rentang, melipat tanda dan membaliknya'), levels: INEQUALITIES },
  { id: 'numbers', name: L('Numbers', 'Bilangan'), subtitle: L('Primes, keys and locks', 'Prima, kunci, dan gembok'), draft: true, levels: NUMBERS },
]

export const ALL_LEVELS: MazeLevel[] = CHAPTERS.flatMap((c) => c.levels)
export const LEVEL_IDS: string[] = ALL_LEVELS.map((l) => l.id)
