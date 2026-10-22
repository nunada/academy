/** The textbook problems of the "Applied Optimization" article, each with its objective as a function of one variable.
 *
 *  `f` is the objective written in the notation of the widgets; `exact` is the answer worked out by hand (checked against
 *  SymPy in tools/check-optimize.mjs, and against the engine in src/lib/optimize.ts). */

import type { Loc } from '../content/types'

export interface Ask {
  label: Loc
  value: number
  unit?: Loc
}

export interface Problem {
  id: string
  name: Loc
  statement: Loc
  /** what x stands for */
  variable: Loc
  /** the relations of steps 2 and 3, as TeX: the constraint and the objective as a function of x */
  lines: string[]
  /** the domain of x as TeX */
  domainTex: string
  f: string
  want: 'max' | 'min'
  /** the domain, with the ends that are not part of it marked open (an open end may be ±Infinity) */
  a: number
  b: number
  openA: boolean
  openB: boolean
  /** the window searched when an end is open (the picture shows it too) */
  win: [number, number]
  /** everything the problem asks for, from the best x and the best value */
  ask: (x: number, fx: number) => Ask[]
  exact: { x: number; value: number }
}

const u = (s: string): Loc => ({ en: s, id: s })
const CM = u('cm')
const CM2 = u('cm²')
const CM3 = u('cm³')
const M = u('m')
const M2 = u('m²')
const L = (en: string, id: string): Loc => ({ en, id })

const closed = { openA: false, openB: false, win: [0, 1] as [number, number] }

export const PROBLEMS: Problem[] = [
  {
    id: 'box',
    name: L('open box', 'kotak terbuka'),
    statement: L(
      'An open-top box is made from a 12 cm by 12 cm sheet of tin by cutting a square of side x from each corner and folding up the sides. How large should x be to make the box hold as much as possible?',
      'Kotak tanpa tutup dibuat dari lembaran timah 12 cm kali 12 cm dengan memotong persegi bersisi x dari setiap sudut lalu melipat sisinya. Berapa x agar kotak memuat sebanyak mungkin?',
    ),
    variable: L('side of each cut square', 'sisi persegi yang dipotong'),
    lines: ['l=w=12-2x,\\ h=x', 'V(x)=x(12-2x)^2'],
    domainTex: '0\\le x\\le 6',
    f: 'x*(12-2*x)^2',
    want: 'max',
    a: 0,
    b: 6,
    ...closed,
    ask: (x, fx) => [
      { label: L('side of each cut square', 'sisi persegi yang dipotong'), value: x, unit: CM },
      { label: L('largest volume', 'volume terbesar'), value: fx, unit: CM3 },
    ],
    exact: { x: 2, value: 128 },
  },
  {
    id: 'can',
    name: L('one-liter can', 'kaleng satu liter'),
    statement: L(
      'A can shaped like a closed cylinder must hold one liter, 1000 cm³. Which radius r and height h use the least metal?',
      'Kaleng berbentuk tabung tertutup harus memuat satu liter, 1000 cm³. Berapa jari-jari r dan tinggi h yang memakai logam paling sedikit?',
    ),
    variable: L('radius of the can', 'jari-jari kaleng'),
    lines: ['\\pi r^2h=1000\\ \\Rightarrow\\ h=\\dfrac{1000}{\\pi r^2}', 'A(r)=2\\pi r^2+2\\pi rh=2\\pi r^2+\\dfrac{2000}{r}'],
    domainTex: 'r>0',
    f: '2*pi*x^2+2000/x',
    want: 'min',
    a: 0,
    b: Infinity,
    openA: true,
    openB: true,
    win: [0.8, 14],
    ask: (x, fx) => [
      { label: L('radius r', 'jari-jari r'), value: x, unit: CM },
      { label: L('height h', 'tinggi h'), value: 1000 / (Math.PI * x * x), unit: CM },
      { label: L('metal used A', 'logam yang terpakai A'), value: fx, unit: CM2 },
    ],
    exact: { x: Math.cbrt(500 / Math.PI), value: 300 * Math.cbrt(2 * Math.PI) },
  },
  {
    id: 'semicircle',
    name: L('rectangle in a semicircle', 'persegi panjang dalam setengah lingkaran'),
    statement: L(
      'A rectangle is inscribed in a semicircle of radius 2, with one side on the diameter. What is the largest area it can have, and what are its dimensions?',
      'Sebuah persegi panjang dibuat di dalam setengah lingkaran berjari-jari 2, dengan satu sisinya pada diameter. Berapa luas terbesarnya, dan berapa ukurannya?',
    ),
    variable: L('distance from the center to the right side', 'jarak dari pusat ke sisi kanan'),
    lines: ['P=(x,\\sqrt{4-x^2}),\\ \\ell=2x,\\ h=\\sqrt{4-x^2}', 'A(x)=2x\\sqrt{4-x^2}'],
    domainTex: '0\\le x\\le 2',
    f: '2*x*sqrt(4-x^2)',
    want: 'max',
    a: 0,
    b: 2,
    ...closed,
    ask: (x, fx) => [
      { label: L('length 2x', 'panjang 2x'), value: 2 * x },
      { label: L('height', 'tinggi'), value: Math.sqrt(Math.max(0, 4 - x * x)) },
      { label: L('largest area', 'luas terbesar'), value: fx },
    ],
    exact: { x: Math.SQRT2, value: 4 },
  },
  {
    id: 'river',
    name: L('fence by a river', 'pagar di tepi sungai'),
    statement: L(
      'A rectangular field is bounded by a river on one side and by one strand of fence on the other three sides. With 800 m of wire, what is the largest area you can enclose?',
      'Sebidang tanah persegi panjang dibatasi sungai di satu sisi dan satu lilitan pagar di tiga sisi lainnya. Dengan kawat sepanjang 800 m, berapa luas terbesar yang dapat dipagari?',
    ),
    variable: L('each of the two sides that meet the river', 'masing-masing dari dua sisi yang tegak lurus sungai'),
    lines: ['2x+y=800\\ \\Rightarrow\\ y=800-2x', 'A(x)=x(800-2x)'],
    domainTex: '0\\le x\\le 400',
    f: 'x*(800-2*x)',
    want: 'max',
    a: 0,
    b: 400,
    ...closed,
    ask: (x, fx) => [
      { label: L('each side that meets the river', 'sisi yang tegak lurus sungai'), value: x, unit: M },
      { label: L('the side along the river', 'sisi sepanjang sungai'), value: 800 - 2 * x, unit: M },
      { label: L('largest area', 'luas terbesar'), value: fx, unit: M2 },
    ],
    exact: { x: 200, value: 80000 },
  },
  {
    id: 'pea',
    name: L('divided patch', 'petak berbagi dua'),
    statement: L(
      'A pea patch of 216 m² is fenced and divided into two equal parts by another fence parallel to one side. What outer dimensions need the least fence, and how much is it?',
      'Petak kacang seluas 216 m² dipagari dan dibagi dua sama besar oleh pagar lain yang sejajar salah satu sisinya. Berapa ukuran luar yang memerlukan pagar paling pendek, dan berapa panjangnya?',
    ),
    variable: L('length of the three parallel fences', 'panjang tiga pagar yang sejajar'),
    lines: ['xy=216\\ \\Rightarrow\\ y=\\dfrac{216}{x}', 'F(x)=3x+2y=3x+\\dfrac{432}{x}'],
    domainTex: 'x>0',
    f: '3*x+432/x',
    want: 'min',
    a: 0,
    b: Infinity,
    openA: true,
    openB: true,
    win: [2, 40],
    ask: (x, fx) => [
      { label: L('the three parallel fences, each', 'tiga pagar sejajar, masing-masing'), value: x, unit: M },
      { label: L('the other side y', 'sisi lainnya y'), value: 216 / x, unit: M },
      { label: L('least fence', 'pagar terpendek'), value: fx, unit: M },
    ],
    exact: { x: 12, value: 72 },
  },
  {
    id: 'poster',
    name: L('poster', 'poster'),
    statement: L(
      'A poster must show 312.5 cm² of print, with a 10 cm margin at the top and bottom and 5 cm at each side. What overall size uses the least paper?',
      'Sebuah poster harus memuat cetakan seluas 312,5 cm², dengan margin 10 cm di atas dan bawah serta 5 cm di tiap sisi. Berapa ukuran keseluruhan yang memakai kertas paling sedikit?',
    ),
    variable: L('width of the printed part', 'lebar bagian yang tercetak'),
    lines: ['h=\\dfrac{312.5}{x}', 'P(x)=(x+10)\\left(\\dfrac{312.5}{x}+20\\right)', 'P(x)=20x+\\dfrac{3125}{x}+512.5'],
    domainTex: 'x>0',
    f: '20*x+3125/x+512.5',
    want: 'min',
    a: 0,
    b: Infinity,
    openA: true,
    openB: true,
    win: [2, 40],
    ask: (x, fx) => [
      { label: L('printed width', 'lebar cetakan'), value: x, unit: CM },
      { label: L('printed height', 'tinggi cetakan'), value: 312.5 / x, unit: CM },
      { label: L('paper width', 'lebar kertas'), value: x + 10, unit: CM },
      { label: L('paper height', 'tinggi kertas'), value: 312.5 / x + 20, unit: CM },
      { label: L('least paper', 'kertas paling sedikit'), value: fx, unit: CM2 },
    ],
    exact: { x: 12.5, value: 1012.5 },
  },
  {
    id: 'conesphere',
    name: L('cone in a sphere', 'kerucut dalam bola'),
    statement: L(
      'A right circular cone is inscribed in a sphere of radius 3. What is the volume of the largest such cone?',
      'Sebuah kerucut lingkaran tegak dibuat di dalam bola berjari-jari 3. Berapa volume kerucut terbesar yang mungkin?',
    ),
    variable: L('height of the cone', 'tinggi kerucut'),
    lines: ['r^2=x(6-x)', 'V(x)=\\dfrac13\\pi r^2x=\\dfrac{\\pi}{3}\\,x^2(6-x)'],
    domainTex: '0\\le x\\le 6',
    f: 'pi*x^2*(6-x)/3',
    want: 'max',
    a: 0,
    b: 6,
    ...closed,
    ask: (x, fx) => [
      { label: L('height h', 'tinggi h'), value: x },
      { label: L('radius r', 'jari-jari r'), value: Math.sqrt(Math.max(0, x * (6 - x))) },
      { label: L('largest volume', 'volume terbesar'), value: fx },
    ],
    exact: { x: 4, value: (32 * Math.PI) / 3 },
  },
  {
    id: 'cylsphere',
    name: L('cylinder in a sphere', 'tabung dalam bola'),
    statement: L(
      'Find the dimensions of the right circular cylinder of greatest volume that fits inside a sphere of radius 10 cm.',
      'Tentukan ukuran tabung lingkaran tegak dengan volume terbesar yang muat di dalam bola berjari-jari 10 cm.',
    ),
    variable: L('height of the cylinder', 'tinggi tabung'),
    lines: ['r^2+\\left(\\dfrac{x}{2}\\right)^2=100', 'V(x)=\\pi r^2x=\\pi x\\left(100-\\dfrac{x^2}{4}\\right)'],
    domainTex: '0\\le x\\le 20',
    f: 'pi*x*(100-x^2/4)',
    want: 'max',
    a: 0,
    b: 20,
    ...closed,
    ask: (x, fx) => [
      { label: L('height h', 'tinggi h'), value: x, unit: CM },
      { label: L('radius r', 'jari-jari r'), value: Math.sqrt(Math.max(0, 100 - (x * x) / 4)), unit: CM },
      { label: L('largest volume', 'volume terbesar'), value: fx, unit: CM3 },
    ],
    exact: { x: (20 * Math.sqrt(3)) / 3, value: (4000 * Math.sqrt(3) * Math.PI) / 9 },
  },
  {
    id: 'beam',
    name: L('strongest beam', 'balok terkuat'),
    statement: L(
      'The strength of a rectangular beam is proportional to its width times the square of its depth. Which beam is strongest among those cut from a log of diameter 30 cm?',
      'Kekuatan balok persegi panjang sebanding dengan lebarnya dikali kuadrat tingginya. Balok mana yang paling kuat di antara yang dapat dipotong dari kayu gelondongan berdiameter 30 cm?',
    ),
    variable: L('width of the beam', 'lebar balok'),
    lines: ['w^2+d^2=30^2\\ \\Rightarrow\\ d^2=900-w^2', 'S(w)=w\\,d^2=w\\,(900-w^2)\\quad(k=1)'],
    domainTex: '0\\le x\\le 30',
    f: 'x*(900-x^2)',
    want: 'max',
    a: 0,
    b: 30,
    ...closed,
    ask: (x, fx) => [
      { label: L('width w', 'lebar w'), value: x, unit: CM },
      { label: L('depth d', 'tinggi d'), value: Math.sqrt(Math.max(0, 900 - x * x)), unit: CM },
      { label: L('strength S (with k = 1)', 'kekuatan S (dengan k = 1)'), value: fx },
    ],
    exact: { x: 10 * Math.sqrt(3), value: 6000 * Math.sqrt(3) },
  },
  {
    id: 'wallbeam',
    name: L('beam over a wall', 'balok melewati tembok'),
    statement: L(
      'A 2 m wall stands 5 m from a building. What is the length of the shortest straight beam that reaches from the ground outside the wall, over it, to the building?',
      'Sebuah tembok setinggi 2 m berdiri 5 m dari sebuah gedung. Berapa panjang balok lurus terpendek yang menjangkau dari tanah di luar tembok, melewati tembok, hingga ke gedung?',
    ),
    variable: L('distance from the wall to the foot of the beam', 'jarak dari tembok ke kaki balok'),
    lines: ['y=\\dfrac{2(x+5)}{x}', 'L(x)=\\sqrt{(x+5)^2+\\left(\\dfrac{2(x+5)}{x}\\right)^2}', 'L(x)=(x+5)\\sqrt{1+\\dfrac{4}{x^2}}'],
    domainTex: 'x>0',
    f: '(x+5)*sqrt(1+4/x^2)',
    want: 'min',
    a: 0,
    b: Infinity,
    openA: true,
    openB: true,
    win: [0.6, 30],
    ask: (x, fx) => [
      { label: L('foot of the beam, from the wall', 'kaki balok, dari tembok'), value: x, unit: M },
      { label: L('height reached at the building', 'tinggi di gedung'), value: (2 * (x + 5)) / x, unit: M },
      { label: L('shortest beam', 'balok terpendek'), value: fx, unit: M },
    ],
    exact: { x: Math.cbrt(4 * 5), value: (Math.sqrt(5) * (Math.cbrt(20) + 5) ** 1.5) / 5 },
  },
  {
    id: 'lights',
    name: L('two lamps', 'dua lampu'),
    statement: L(
      'Illumination is proportional to the reciprocal of the squared distance to the lamp. Two lamps 6 m apart, one eight times as strong as the other, shine on a point between them. Where is the total illumination least?',
      'Penerangan sebanding dengan kebalikan kuadrat jarak ke lampu. Dua lampu berjarak 6 m, yang satu delapan kali lebih terang daripada yang lain, menyinari sebuah titik di antaranya. Di mana penerangan totalnya paling kecil?',
    ),
    variable: L('distance from the stronger lamp', 'jarak dari lampu yang lebih terang'),
    lines: ['I(x)=\\dfrac{8k}{x^2}+\\dfrac{k}{(6-x)^2}\\quad(k=1)'],
    domainTex: '0<x<6',
    f: '8/x^2+1/(6-x)^2',
    want: 'min',
    a: 0,
    b: 6,
    openA: true,
    openB: true,
    win: [0.9, 5.1],
    ask: (x, fx) => [
      { label: L('from the stronger lamp', 'dari lampu yang lebih terang'), value: x, unit: M },
      { label: L('from the weaker lamp', 'dari lampu yang lebih lemah'), value: 6 - x, unit: M },
      { label: L('least illumination (units of k)', 'penerangan terkecil (satuan k)'), value: fx },
    ],
    exact: { x: 4, value: 0.75 },
  },
  {
    id: 'recip',
    name: L('number plus reciprocal', 'bilangan ditambah kebalikannya'),
    statement: L(
      'Find the positive number for which the sum of the number and its reciprocal is as small as possible.',
      'Tentukan bilangan positif yang jumlah bilangan itu dan kebalikannya paling kecil.',
    ),
    variable: L('the number', 'bilangan itu'),
    lines: ['S(x)=x+\\dfrac1x'],
    domainTex: 'x>0',
    f: 'x+1/x',
    want: 'min',
    a: 0,
    b: Infinity,
    openA: true,
    openB: true,
    win: [0.12, 6],
    ask: (x, fx) => [
      { label: L('the number', 'bilangan itu'), value: x },
      { label: L('smallest sum', 'jumlah terkecil'), value: fx },
    ],
    exact: { x: 1, value: 2 },
  },
  {
    id: 'jane',
    name: L('rowing and walking', 'mendayung dan berjalan'),
    statement: L(
      'Jane is in a boat 2 km offshore and wants to reach a village 6 km down a straight shore from the point nearest the boat. She rows at 2 km/h and walks at 5 km/h. Where should she land to arrive soonest?',
      'Jane berada di perahu 2 km dari pantai dan ingin mencapai desa yang 6 km menyusuri pantai lurus dari titik terdekat perahu. Ia mendayung 2 km/jam dan berjalan 5 km/jam. Di mana ia harus mendarat agar tiba paling cepat?',
    ),
    variable: L('landing point, measured from the point nearest the boat', 'titik mendarat, diukur dari titik terdekat perahu'),
    lines: ['T(x)=\\dfrac{\\sqrt{4+x^2}}{2}+\\dfrac{6-x}{5}'],
    domainTex: '0\\le x\\le 6',
    f: 'sqrt(4+x^2)/2+(6-x)/5',
    want: 'min',
    a: 0,
    b: 6,
    ...closed,
    ask: (x, fx) => [
      { label: L('landing point along the shore', 'titik mendarat di sepanjang pantai'), value: x, unit: u('km') },
      { label: L('walk from there', 'jalan kaki dari sana'), value: 6 - x, unit: u('km') },
      { label: L('shortest time', 'waktu tersingkat'), value: fx, unit: L('hours', 'jam') },
    ],
    exact: { x: (4 * Math.sqrt(21)) / 21, value: Math.sqrt(21) / 5 + 6 / 5 },
  },
  {
    id: 'tour',
    name: L('tour price', 'harga tur'),
    statement: L(
      'A tour costs 200 dollars per person if 50 people book (the minimum), and the fare drops by 2 dollars for each person beyond 50, up to 80. Running it costs 6000 dollars plus 32 dollars per person. How many people maximize the profit?',
      'Sebuah tur berharga Rp200 ribu per orang jika 50 orang mendaftar (minimum), dan tarifnya turun Rp2 ribu untuk setiap orang di atas 50, sampai 80. Biayanya Rp6.000 ribu ditambah Rp32 ribu per orang. Berapa peserta yang memaksimalkan laba?',
    ),
    variable: L('number of people', 'banyaknya peserta'),
    lines: ['f=200-2(x-50)=300-2x', 'p(x)=x(300-2x)-6000-32x', 'p(x)=268x-2x^2-6000'],
    domainTex: '50\\le x\\le 80',
    f: '268*x-2*x^2-6000',
    want: 'max',
    a: 50,
    b: 80,
    ...closed,
    ask: (x, fx) => [
      { label: L('people', 'peserta'), value: x },
      { label: L('fare per person', 'tarif per orang'), value: 300 - 2 * x, unit: L('dollars', 'ribu rupiah') },
      { label: L('largest profit', 'laba terbesar'), value: fx, unit: L('dollars', 'ribu rupiah') },
    ],
    exact: { x: 67, value: 2978 },
  },
  {
    id: 'conesheet',
    name: L('cone from a disk', 'kerucut dari lingkaran'),
    statement: L(
      'A cone is made from a circular piece of material of radius 1 m by cutting out a sector and joining the two straight edges. What is the largest volume the cone can have?',
      'Sebuah kerucut dibuat dari bahan berbentuk lingkaran berjari-jari 1 m dengan memotong sebuah juring lalu menyambung kedua sisi lurusnya. Berapa volume terbesar kerucut itu?',
    ),
    variable: L('radius of the cone’s base', 'jari-jari alas kerucut'),
    lines: ['s=1,\\ h=\\sqrt{1-x^2}', 'V(x)=\\dfrac13\\pi x^2\\sqrt{1-x^2}'],
    domainTex: '0\\le x\\le 1',
    f: 'pi*x^2*sqrt(1-x^2)/3',
    want: 'max',
    a: 0,
    b: 1,
    ...closed,
    ask: (x, fx) => [
      { label: L('radius of the base', 'jari-jari alas'), value: x, unit: M },
      { label: L('height', 'tinggi'), value: Math.sqrt(Math.max(0, 1 - x * x)), unit: M },
      { label: L('angle of the sector removed', 'sudut juring yang dibuang'), value: 360 * (1 - x), unit: u('°') },
      { label: L('largest volume', 'volume terbesar'), value: fx, unit: u('m³') },
    ],
    exact: { x: Math.sqrt(6) / 3, value: (2 * Math.sqrt(3) * Math.PI) / 27 },
  },
]
