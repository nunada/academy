import type { Loc } from './types'
import { GENERATED } from './numbermaze-levels'

/** The chapters and levels of Number Maze. The grids are text (see `lib/numbermaze.ts` for the tokens); `par` is the length of the shortest way, which the checker
 *  (`tools/check-numbermaze.mjs`) finds again with a solver of its own and compares.
 *
 *  Three tutorial levels open the first chapter (a corridor, a tile that is used up, a tile that never runs out), by hand. All the others were *made by a program*
 *  (`tools/maze-generator.mjs`: a solution is planted in a random open maze, decoys are added, and the level is kept only if the solver says it is a hard puzzle: a long
 *  shortest way, few shortest ways, many dead positions, tiles that are needed) and chosen by `tools/maze-build-levels.mjs` into `numbermaze-levels.ts`. They are
 *  original: none is a copy of a level of any other game.
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


const TUTORIAL: MazeLevel[] = [
  {
    id: 'ar01',
    name: L('First Step', 'Langkah Pertama'),
    hint: L('Swipe, or use the arrow keys or the buttons, to move your number to the exit.', 'Geser layar, atau pakai tombol panah atau tombol di layar, untuk menggerakkan angkamu ke pintu keluar.'),
    startValue: 0,
    grid: ['#  #  #  #  #  #  #', '#  S  .  .  .  G  #', '#  #  #  #  #  #  #'],
    par: 4,
  },
  {
    id: 'ar02',
    name: L('Just Once', 'Sekali Saja'),
    hint: L('A gold dashed tile disappears after you step on it. Going back there adds nothing.', 'Petak emas bergaris putus-putus lenyap setelah dilewati. Kembali ke sana tidak akan menambah apa-apa lagi.'),
    startValue: 0,
    grid: ['#  #     #  #   #', '#  G?=2  S  +2! #', '#  #     #  #   #'],
    par: 3,
  },
  {
    id: 'ar03',
    name: L('Blue Tiles', 'Petak Biru'),
    hint: L('Blue tiles never run out: step on them as often as you like, back and forth. Nothing can be spoiled here.', 'Petak biru tidak pernah habis: injak sesukamu, maju dan mundur. Tidak ada yang bisa dirusak di sini.'),
    startValue: 1,
    grid: ['#  #   #    #   #', '#  .   S    .   #', '#  +1  .    -1  #', '#  .   .    .   #', '#  #   ?=7  #   #', '#  #   G    #   #', '#  #   #    #   #'],
    par: 16,
  },

]

/** The ideas that the hint of a generated level gives: there is no hint for the particular level, but a way of looking at this kind of puzzle. */
const IDEAS: Record<string, Loc[]> = {
  arithmetic: [
    L('Work backwards from the exit: which tiles could give that exact number? A tile that is used up once can be spent only once, so the order matters.', 'Bekerjalah mundur dari pintu keluar: petak mana yang bisa menghasilkan angka yang tepat itu? Petak yang habis sekali pakai hanya bisa dibelanjakan sekali, jadi urutannya penting.'),
    L('Not every tile is needed. A gate that no number you can make will pass is only there to mislead you.', 'Tidak semua petak diperlukan. Gerbang yang tidak bisa dilewati angka apa pun yang bisa kamu buat hanyalah pengecoh.'),
    L('Look at even and odd. Some tiles never change it, and the exit may need the other kind.', 'Perhatikan genap dan ganjil. Sebagian petak tidak pernah mengubahnya, dan pintu keluar mungkin butuh yang lain.'),
  ],
  negatives: [
    L('Going down is easy and coming back up costs steps. Plan how far down you really need to go.', 'Turun itu mudah, dan naik kembali memakan langkah. Rencanakan seberapa jauh kamu benar-benar harus turun.'),
    L('A minus sign can be flipped or folded away: ask which sign the exit wants, and which tile can give it.', 'Tanda minus bisa dibalik atau dilipat: tanyakan tanda apa yang diminta pintu keluar, dan petak mana yang bisa memberikannya.'),
    L('A gate with a limit can be passed from either side of the limit: check both ways before you spend a tile.', 'Gerbang dengan batas bisa dilewati dari kedua sisi batas itu: periksa kedua arah sebelum membelanjakan petak.'),
  ],
  powers: [
    L('Powers grow fast. Try the small numbers first, and see which exact values the gates and the exit can ever get.', 'Pangkat tumbuh cepat. Coba angka kecil dulu, dan lihat nilai tepat mana yang bisa diraih gerbang dan pintu keluar.'),
    L('Squaring before adding gives a different number from adding before squaring. Which order does the exit want?', 'Memangkatkan sebelum menambah memberi angka berbeda dari menambah sebelum memangkatkan. Urutan mana yang diminta pintu keluar?'),
    L('A power of two or three ends in few digits. Look at what the last tiles must give, then go back.', 'Pangkat dua atau tiga berakhir dengan sedikit angka. Lihat apa yang harus diberikan petak terakhir, lalu mundur.'),
  ],
  inequalities: [
    L('A remainder tile throws away the size of your number and keeps only what is left over. Which remainders can reach the exit?', 'Petak sisa bagi membuang besar angkamu dan hanya menyimpan sisanya. Sisa mana yang bisa mencapai pintu keluar?'),
    L('A range gate has two sides. Check that you can arrive from the side you are on.', 'Gerbang rentang punya dua sisi. Periksa bahwa kamu bisa tiba dari sisi tempatmu berada.'),
    L('Count how many tiles you have of each kind: the supply may leave you no room for a mistake.', 'Hitung berapa petak yang kamu punya dari tiap jenis: perbekalannya mungkin tidak menyisakan ruang untuk salah.'),
  ],
  logarithms: [
    L('A logarithm undoes a power: it only works on a number that is exactly a power of its base. Which numbers can you make that way?', 'Logaritma membatalkan pangkat: ia hanya jalan pada angka yang tepat berupa pangkat dari basisnya. Angka mana yang bisa kamu buat begitu?'),
    L('Build a power first, then take its logarithm: the exponent comes out. Plan the exponent you want.', 'Bangun sebuah pangkat dulu, lalu ambil logaritmanya: eksponennya keluar. Rencanakan eksponen yang kamu mau.'),
    L('If a logarithm is refused, your number is not a power of its base yet: change it first.', 'Jika logaritma ditolak, angkamu belum berupa pangkat dari basisnya: ubah dulu.'),
  ],
  numbers: [
    L('Primes, squares and multiples are rare among big numbers. List the ones near where you are, and see which tile reaches them.', 'Bilangan prima, kuadrat, dan kelipatan jarang di antara bilangan besar. Daftar yang dekat denganmu, dan lihat petak mana yang mencapainya.'),
    L('A key you pick up opens one lock only. Decide which lock it is for before you take the next key.', 'Satu kunci yang kamu pungut hanya membuka satu gembok. Tentukan untuk gembok mana sebelum mengambil kunci berikutnya.'),
    L('"Not prime" is also a condition: 1 is not prime, and neither is any number that divides evenly.', '"Bukan prima" juga syarat: 1 bukan prima, dan begitu pula bilangan apa pun yang habis dibagi.'),
    L('Look at what the exit wants and work back: which tile could give exactly that, and what must you bring to it?', 'Lihat apa yang diminta pintu keluar dan bekerjalah mundur: petak mana yang bisa memberikan tepat itu, dan apa yang harus kamu bawa ke sana?'),
  ],
  fermat: [
    L('These rooms use everything at once. Find the exit condition first, then the gate before it, and work back one tile at a time.', 'Ruangan ini memakai semuanya sekaligus. Cari syarat pintu keluar dulu, lalu gerbang sebelumnya, dan bekerja mundur satu petak demi satu.'),
    L('There are decoys, and some of them are impossible on purpose. Prove a tile cannot work (parity, remainder, size) before you spend a step on it.', 'Ada pengecoh, dan sebagian sengaja mustahil. Buktikan bahwa sebuah petak tidak mungkin berhasil (genap-ganjil, sisa, ukuran) sebelum memakai langkah untuknya.'),
    L('A tile that is used up is gone for good. Before you spend one, ask what you could no longer do.', 'Petak yang sudah habis hilang selamanya. Sebelum membelanjakannya, tanyakan apa yang tidak bisa lagi kamu lakukan.'),
  ],
}

const NAMES: Record<string, [string, string]> = {
  arithmetic: ['Arithmetic', 'Aritmetika'],
  negatives: ['Negatives', 'Negatif'],
  powers: ['Powers', 'Pangkat'],
  inequalities: ['Inequalities', 'Pertidaksamaan'],
  logarithms: ['Logarithms', 'Logaritma'],
  numbers: ['Numbers', 'Bilangan'],
  fermat: ['Final Rooms', 'Ruang Pamungkas'],
}

function generated(chapter: string, prefix: string, tutorial: MazeLevel[]): MazeLevel[] {
  const [en, id] = NAMES[chapter]
  const ideas = IDEAS[chapter]
  return [
    ...tutorial,
    ...GENERATED[chapter].map((g, k): MazeLevel => {
      const n = tutorial.length + k + 1
      const text = g.grid.join(' ')
      // an idea that talks of keys, locks or primes is given only to a level that has them
      const usable = ideas.filter((h) => (!/\bkey\b|\block\b|\bkunci\b|\bgembok\b/i.test(h.en + ' ' + h.id) || (/key[1-4]/.test(text) && /lock[1-4]/.test(text))) && (!/\bprime\b|\bprima\b/i.test(h.en + ' ' + h.id) || /prime/.test(text)))
      return {
        id: `${prefix}${String(n).padStart(2, '0')}`,
        name: L(`${en} ${n}`, `${id} ${n}`),
        hint: usable.length ? usable[k % usable.length] : ideas[ideas.length - 1],
        startValue: g.startValue,
        minValue: g.minValue,
        maxValue: g.maxValue,
        grid: g.grid,
        par: g.par,
      }
    }),
  ]
}

export const CHAPTERS: MazeChapter[] = [
  { id: 'arithmetic', name: L('Arithmetic', 'Aritmetika'), subtitle: L('Add, subtract, multiply and divide: most tiles only once', 'Tambah, kurang, kali, dan bagi: kebanyakan petak hanya sekali'), levels: generated('arithmetic', 'ar', TUTORIAL.map((l, i) => ({ ...l, id: `ar${String(i + 1).padStart(2, '0')}` }))) },
  { id: 'negatives', name: L('Negatives', 'Negatif'), subtitle: L('Below zero: signs, flipping them and the cost of climbing back', 'Di bawah nol: tanda, membaliknya, dan ongkos naik kembali'), levels: generated('negatives', 'ng', []) },
  { id: 'powers', name: L('Powers', 'Pangkat'), subtitle: L('Squares, cubes and the powers of two and three', 'Kuadrat, pangkat tiga, dan pangkat dari dua dan tiga'), levels: generated('powers', 'pw', []) },
  { id: 'inequalities', name: L('Inequalities and Remainders', 'Pertidaksamaan dan Sisa Bagi'), subtitle: L('Limits, ranges, remainders and the absolute value', 'Batas, rentang, sisa bagi, dan nilai mutlak'), levels: generated('inequalities', 'in', []) },
  { id: 'logarithms', name: L('Logarithms', 'Logaritma'), subtitle: L('Logarithms and the powers they undo', 'Logaritma dan pangkat yang mereka batalkan'), levels: generated('logarithms', 'lg', []) },
  { id: 'numbers', name: L('Numbers', 'Bilangan'), subtitle: L('Primes, squares, multiples, keys and locks', 'Bilangan prima, kuadrat, kelipatan, kunci, dan gembok'), levels: generated('numbers', 'nb', []) },
  { id: 'fermat', name: L('Final Rooms', 'Ruang Pamungkas'), subtitle: L('Everything at once: the biggest rooms', 'Semuanya sekaligus: ruangan terbesar'), levels: generated('fermat', 'fr', []) },
]

export const ALL_LEVELS: MazeLevel[] = CHAPTERS.flatMap((c) => c.levels)
export const LEVEL_IDS: string[] = ALL_LEVELS.map((l) => l.id)
