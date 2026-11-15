import type { Scene3D, SceneItem } from '../../lib/scene3d'
import type { Loc } from '../types'

/** The scenes of the course, each a thing in space whose numbers follow a slider. They live here, apart from the lessons, so that the lessons stay
 *  readable and the checker (tools/check-sipil.mjs) can take each one by name and test what it says: that the slope printed under the beam really is the
 *  derivative of the deflection printed beside it, that the water drawn in the pond has the volume the formula gives.
 *
 *  Slider names are lowercase and never `x`, `t` or `e`: `x` runs along a swept section, `t` along a curve, and `e` is Euler's number. */

const L = (en: string, id: string): Loc => ({ en, id })

/** A wedge under a beam at station x0, its tip at height z0. */
const support = (x0: number, z0: number): SceneItem => ({
  t: 'extrude',
  plane: 'xz',
  pts: [[x0 - 0.3, z0 - 0.55], [x0 + 0.3, z0 - 0.55], [x0, z0]],
  from: -0.3,
  to: 0.3,
  color: 'concrete',
})

/* --------------------------------------------------------------------------------- beams */

/** A simply supported beam of span 6 m under a uniform load w, with EI = 20 000 kN·m². The deflection is drawn 100 times too large. */
const BEAM_Z = '-w*x*(216-12*x^2+x^3)/4800'
export const beamScene: Scene3D = {
  params: [
    { name: 'w', min: 2, max: 20, step: 1, value: 10, label: 'w (kN/m)' },
    { name: 'p', min: 0, max: 6, step: 0.1, value: 3, label: 'x (m)' },
  ],
  items: [
    support(0, -0.3),
    support(6, -0.3),
    { t: 'sweep', x: [0, 6], z: BEAM_Z, width: 0.5, depth: 0.3, color: 'steel' },
    { t: 'line', pts: [[0, 0, 0], [6, 0, 0]], dashed: true, color: 'muted' },
    { t: 'arrows', x: [0.3, 5.7], n: 9, from: `${BEAM_Z}+0.3+w/25`, to: `${BEAM_Z}+0.04`, color: 'b' },
    { t: 'line', pts: [['p', 0, 0], ['p', 0, '-w*p*(216-12*p^2+p^3)/4800']], color: 'result' },
    { t: 'dot', at: ['p', 0, '-w*p*(216-12*p^2+p^3)/4800'], color: 'result' },
    { t: 'label', at: [0, 0, -1.1], text: 'A' },
    { t: 'label', at: [6, 0, -1.1], text: 'B' },
  ],
  readouts: [
    { label: L('deflection y', 'lendutan y'), value: '-w*p*(216-12*p^2+p^3)/480', dp: 2, unit: 'mm' },
    { label: L("slope y'", "kemiringan y'"), value: '-w*(216-36*p^2+4*p^3)/480', dp: 2, unit: 'mrad' },
    { label: L('moment M', 'momen M'), value: 'w*p*(6-p)/2', dp: 1, unit: 'kN·m' },
  ],
  caption: L(
    'A beam of span $6$ m on two supports, under a load $w$ spread along it. Move $x$ along the beam and change $w$: the dashed line is the beam before loading, and the sag is drawn $100$ times too large so that it can be seen.',
    'Balok berbentang $6$ m di atas dua tumpuan, memikul beban $w$ yang tersebar sepanjangnya. Geser $x$ sepanjang balok dan ubah $w$: garis putus-putus adalah balok sebelum dibebani, dan lendutannya digambar $100$ kali lebih besar agar terlihat.',
  ),
  view: [20, 14],
}

/** The same span under a load that grows from 0 at A to 12 kN/m at B, with its moment and shear diagrams drawn underneath. */
export const loadScene: Scene3D = {
  params: [{ name: 'p', min: 0, max: 6, step: 0.1, value: 2, label: 'x (m)' }],
  items: [
    support(0, -0.3),
    support(6, -0.3),
    { t: 'box', from: [0, -0.25, -0.3], to: [6, 0.25, 0], color: 'steel' },
    { t: 'arrows', x: [0.5, 6], n: 8, from: '0.12+0.2*x', to: '0.04', color: 'b' },
    { t: 'line', pts: [[0, 0, 0.12], [6, 0, 1.32]], color: 'b' },
    // the moment diagram, hung below its baseline as engineers draw it
    { t: 'line', pts: [[0, 0, -1.6], [6, 0, -1.6]], color: 'muted' },
    { t: 'curve', x: 't', y: '0', z: '-1.6-(12*t-t^3/3)/28', from: 0, to: 6, color: 'result' },
    { t: 'label', at: [-0.45, 0, -2.0], text: 'M' },
    // the shear diagram
    { t: 'line', pts: [[0, 0, -3.6], [6, 0, -3.6]], color: 'muted' },
    { t: 'curve', x: 't', y: '0', z: '-3.6+(12-t^2)/24', from: 0, to: 6, color: 'c' },
    { t: 'label', at: [-0.45, 0, -3.4], text: 'V' },
    // the section being read
    { t: 'line', pts: [['p', 0, 0.2], ['p', 0, -4.7]], dashed: true, color: 'a' },
    { t: 'dot', at: ['p', 0, '-1.6-(12*p-p^3/3)/28'], color: 'result' },
    { t: 'dot', at: ['p', 0, '-3.6+(12-p^2)/24'], color: 'c' },
  ],
  readouts: [
    { label: L('load q', 'beban q'), value: '2*p', dp: 1, unit: 'kN/m' },
    { label: L('shear V', 'gaya geser V'), value: '12-p^2', dp: 2, unit: 'kN' },
    { label: L('moment M', 'momen M'), value: '12*p-p^3/3', dp: 2, unit: 'kN·m' },
  ],
  caption: L(
    'A load that grows from $0$ at A to $12$ kN/m at B. Under the beam hang its moment diagram $M$ and its shear diagram $V$. Slide $x$: the moment is largest exactly where the shear crosses zero.',
    'Beban yang membesar dari $0$ di A sampai $12$ kN/m di B. Di bawah balok tergantung diagram momen $M$ dan diagram gaya geser $V$. Geser $x$: momen terbesar tepat di tempat gaya geser memotong nol.',
  ),
  view: [8, 8],
  height: 400,
}

/* ------------------------------------------------------------------------- the beam in a log */

const logItems: SceneItem[] = [
  { t: 'cyl', from: [0, 0, 0], to: [60, 0, 0], r: 15, color: 'wood', opacity: 0.42 },
  { t: 'box', from: [-3, '-b/2', '-sqrt(900-b^2)/2'], to: [63, 'b/2', 'sqrt(900-b^2)/2'], color: 'wood' },
  { t: 'label', at: [66, 0, '-sqrt(900-b^2)/2-3'], text: 'b' },
  { t: 'label', at: [66, 'b/2+3', 0], text: 'h' },
]

/** A beam of width b cut from a log 30 cm across: how strong it is. */
export const logStrengthScene: Scene3D = {
  params: [{ name: 'b', min: 4, max: 28, step: 0.5, value: 10, label: 'b (cm)' }],
  items: logItems,
  readouts: [
    { label: L('depth h', 'tinggi h'), value: 'sqrt(900-b^2)', dp: 2, unit: 'cm' },
    { label: L('section modulus S', 'modulus penampang S'), value: 'b*(900-b^2)/6', dp: 0, unit: 'cm³' },
    { label: L('of the largest S', 'dari S terbesar'), value: '100*b*(900-b^2)/6/1732.0508', dp: 1, unit: '%' },
  ],
  caption: L(
    'A log $30$ cm across and the rectangular beam cut from it. Change the width $b$: the depth $h$ follows, because the corners stay on the circle, and the strength $S=\\frac{bh^2}{6}$ rises and falls.',
    'Gelondong berdiameter $30$ cm dan balok persegi panjang yang dipotong darinya. Ubah lebar $b$: tinggi $h$ mengikuti, sebab sudut-sudutnya tetap pada lingkaran, dan kekuatan $S=\\frac{bh^2}{6}$ naik lalu turun.',
  ),
  view: [55, 18],
}

/** The same log: how stiff the beam is. */
export const logStiffnessScene: Scene3D = {
  params: [{ name: 'b', min: 4, max: 28, step: 0.5, value: 20, label: 'b (cm)' }],
  items: logItems,
  readouts: [
    { label: L('depth h', 'tinggi h'), value: 'sqrt(900-b^2)', dp: 2, unit: 'cm' },
    { label: L('second moment I', 'momen inersia I'), value: 'b*(900-b^2)^1.5/12', dp: 0, unit: 'cm⁴' },
    { label: L('section modulus S', 'modulus penampang S'), value: 'b*(900-b^2)/6', dp: 0, unit: 'cm³' },
  ],
  caption: L(
    'The same log. This time read the stiffness $I=\\frac{bh^3}{12}$ as well: it peaks at a narrower, deeper beam than the strength $S$ does.',
    'Gelondong yang sama. Kali ini baca juga kekakuan $I=\\frac{bh^3}{12}$: puncaknya pada balok yang lebih sempit dan lebih tinggi daripada puncak kekuatan $S$.',
  ),
  view: [55, 18],
}

/** An open concrete tank with a square base that holds 32 m³. */
export const tankScene: Scene3D = {
  params: [{ name: 's', min: 2.5, max: 8, step: 0.1, value: 3, label: 's (m)' }],
  items: [
    { t: 'box', from: ['-s/2-0.15', '-s/2-0.15', -0.15], to: ['s/2+0.15', 's/2+0.15', 0], color: 'concrete' },
    { t: 'box', from: ['-s/2-0.15', '-s/2-0.15', 0], to: ['-s/2', 's/2+0.15', '32/s^2'], color: 'concrete', opacity: 0.55 },
    { t: 'box', from: ['s/2', '-s/2-0.15', 0], to: ['s/2+0.15', 's/2+0.15', '32/s^2'], color: 'concrete', opacity: 0.55 },
    { t: 'box', from: ['-s/2', '-s/2-0.15', 0], to: ['s/2', '-s/2', '32/s^2'], color: 'concrete', opacity: 0.55 },
    { t: 'box', from: ['-s/2', 's/2', 0], to: ['s/2', 's/2+0.15', '32/s^2'], color: 'concrete', opacity: 0.55 },
    { t: 'box', from: ['-s/2', '-s/2', 0], to: ['s/2', 's/2', '0.97*32/s^2'], color: 'water', opacity: 0.5 },
  ],
  readouts: [
    { label: L('height h', 'tinggi h'), value: '32/s^2', dp: 2, unit: 'm' },
    { label: L('concrete area A', 'luas beton A'), value: 's^2+128/s', dp: 2, unit: 'm²' },
  ],
  caption: L(
    'An open tank with a square base of side $s$ that must hold $32\\text{ m}^3$. A wide tank is all floor, a narrow one is all wall: somewhere between, the concrete is least.',
    'Tangki terbuka beralas persegi bersisi $s$ yang harus memuat $32\\text{ m}^3$. Tangki yang lebar hampir seluruhnya lantai, yang sempit hampir seluruhnya dinding: di antaranya, betonnya paling sedikit.',
  ),
  view: [32, 30],
}

/* ------------------------------------------------------------------------------ water */

/** A rectangular channel that carries a cross-section of 8 m² of water. */
export const channelScene: Scene3D = {
  params: [{ name: 'd', min: 0.8, max: 5, step: 0.1, value: 1, label: 'y (m)' }],
  items: [
    { t: 'box', from: [0, '-4/d-0.2', -0.2], to: [12, '4/d+0.2', 0], color: 'concrete' },
    { t: 'box', from: [0, '-4/d-0.2', 0], to: [12, '-4/d', 'd+0.4'], color: 'concrete' },
    { t: 'box', from: [0, '4/d', 0], to: [12, '4/d+0.2', 'd+0.4'], color: 'concrete' },
    { t: 'box', from: [0, '-4/d', 0], to: [12, '4/d', 'd'], color: 'water', opacity: 0.55 },
  ],
  readouts: [
    { label: L('width b', 'lebar b'), value: '8/d', dp: 2, unit: 'm' },
    { label: L('wetted perimeter P', 'keliling basah P'), value: '8/d+2*d', dp: 2, unit: 'm' },
    { label: L('discharge Q', 'debit Q'), value: '(1/0.015)*8*(8/(8/d+2*d))^(2/3)*sqrt(0.001)', dp: 2, unit: 'm³/s' },
  ],
  caption: L(
    'A concrete channel whose water always has a cross-section of $8\\text{ m}^2$. Change the depth $y$ and the width follows. The wetted perimeter $P$ is the concrete the water touches: where it is least, the discharge $Q$ is greatest.',
    'Saluran beton yang airnya selalu berpenampang $8\\text{ m}^2$. Ubah kedalaman $y$ dan lebarnya mengikuti. Keliling basah $P$ adalah beton yang disentuh air: di tempat ia terkecil, debit $Q$ terbesar.',
  ),
  view: [62, 24],
}

/** A trapezoidal channel that carries 12 m² of water, with side slope m (m across for 1 up). */
const TB = '(12/d-m*d)'
export const trapezoidScene: Scene3D = {
  params: [
    { name: 'd', min: 1, max: 2.7, step: 0.05, value: 1.5, label: 'y (m)' },
    { name: 'm', min: 0, max: 1.5, step: 0.05, value: 1, label: 'm' },
  ],
  items: [
    { t: 'extrude', plane: 'yz', pts: [[`-${TB}/2`, -0.2], [`${TB}/2`, -0.2], [`${TB}/2`, 0], [`-${TB}/2`, 0]], from: 0, to: 12, color: 'concrete' },
    { t: 'extrude', plane: 'yz', pts: [[`${TB}/2`, 0], [`${TB}/2+0.2`, 0], [`${TB}/2+0.2+m*(d+0.4)`, 'd+0.4'], [`${TB}/2+m*(d+0.4)`, 'd+0.4']], from: 0, to: 12, color: 'concrete' },
    { t: 'extrude', plane: 'yz', pts: [[`-${TB}/2`, 0], [`-${TB}/2-m*(d+0.4)`, 'd+0.4'], [`-${TB}/2-0.2-m*(d+0.4)`, 'd+0.4'], [`-${TB}/2-0.2`, 0]], from: 0, to: 12, color: 'concrete' },
    { t: 'extrude', plane: 'yz', pts: [[`-${TB}/2`, 0], [`${TB}/2`, 0], [`${TB}/2+m*d`, 'd'], [`-${TB}/2-m*d`, 'd']], from: 0, to: 12, color: 'water', opacity: 0.55 },
  ],
  readouts: [
    { label: L('bottom width b', 'lebar dasar b'), value: '12/d-m*d', dp: 2, unit: 'm' },
    { label: L('wetted perimeter P', 'keliling basah P'), value: '12/d-m*d+2*d*sqrt(1+m^2)', dp: 3, unit: 'm' },
    { label: L('discharge Q', 'debit Q'), value: '(1/0.015)*12*(12/(12/d-m*d+2*d*sqrt(1+m^2)))^(2/3)*sqrt(0.001)', dp: 2, unit: 'm³/s' },
  ],
  caption: L(
    'A channel with sloping sides that always carries $12\\text{ m}^2$ of water. The side slope $m$ is how far a bank goes across for each meter it rises. Search with both sliders for the smallest wetted perimeter.',
    'Saluran bersisi miring yang selalu membawa $12\\text{ m}^2$ air. Kemiringan sisi $m$ adalah seberapa jauh tebing bergeser mendatar untuk tiap meter kenaikannya. Cari dengan kedua penggeser keliling basah terkecil.',
  ),
  view: [62, 24],
}

/** A retention pond: floor 20 m by 10 m, banks at 2 across for 1 up, 3 m deep, filled at q m³ a minute. */
export const pondScene: Scene3D = {
  params: [
    { name: 'h', min: 0.1, max: 3, step: 0.05, value: 1, label: 'h (m)' },
    { name: 'q', min: 2, max: 12, step: 1, value: 6, label: 'Q (m³/min)' },
  ],
  items: [
    { t: 'box', from: [-10, -5, -0.25], to: [10, 5, 0], color: 'earth' },
    { t: 'line', pts: [[-16, -11, 3], [16, -11, 3], [16, 11, 3], [-16, 11, 3], [-16, -11, 3]], color: 'grass' },
    { t: 'line', pts: [[-10, -5, 0], [-16, -11, 3]], color: 'muted' },
    { t: 'line', pts: [[10, -5, 0], [16, -11, 3]], color: 'muted' },
    { t: 'line', pts: [[10, 5, 0], [16, 11, 3]], color: 'muted' },
    { t: 'line', pts: [[-10, 5, 0], [-16, 11, 3]], color: 'muted' },
    { t: 'frustum', z: [0, 'h'], a: [20, '20+4*h'], b: [10, '10+4*h'], color: 'water', opacity: 0.6 },
  ],
  readouts: [
    { label: L('water surface A', 'luas permukaan air A'), value: '(20+4*h)*(10+4*h)', dp: 0, unit: 'm²' },
    { label: L('volume V', 'volume V'), value: '200*h+60*h^2+16*h^3/3', dp: 0, unit: 'm³' },
    { label: L('rise dh/dt', 'kenaikan dh/dt'), value: '100*q/((20+4*h)*(10+4*h))', dp: 2, unit: L('cm/min', 'cm/menit') },
  ],
  caption: L(
    'A pond with sloping banks, filled at $Q$ cubic meters a minute. Raise the water level $h$: the surface widens, so the same inflow lifts the level more and more slowly.',
    'Kolam bertebing miring, diisi $Q$ meter kubik per menit. Naikkan muka air $h$: permukaannya melebar, sehingga aliran masuk yang sama menaikkan muka air makin lambat.',
  ),
  view: [28, 30],
}

/* ------------------------------------------------------------------------------- roads */

/** A crest curve 300 m long from a +4% grade to a −2% grade. Heights are drawn 10 times too large. */
const ROAD_Z = '0.4*x-0.001*x^2'
export const roadScene: Scene3D = {
  params: [{ name: 's', min: 0, max: 300, step: 5, value: 60, label: 'x (m)' }],
  items: [
    { t: 'sweep', x: [-60, 0], z: '0.4*x', width: 70, depth: 3, color: 'road' },
    { t: 'sweep', x: [0, 300], z: ROAD_Z, width: 70, depth: 3, color: 'road' },
    { t: 'sweep', x: [300, 360], z: '30-0.2*(x-300)', width: 70, depth: 3, color: 'road' },
    { t: 'curve', x: 't', y: '0', z: '0.4*t-0.001*t^2+0.3', from: 0, to: 300, color: 'c' },
    { t: 'box', from: ['s-11', -7, '0.4*s-0.001*s^2'], to: ['s+11', 7, '0.4*s-0.001*s^2+9'], color: 'b' },
    { t: 'dot', at: [200, 0, 44], r: 4, color: 'result' },
    { t: 'cyl', from: [0, -38, 0], to: [0, -38, 24], r: 1.4, color: 'c' },
    { t: 'cyl', from: [300, -38, 30], to: [300, -38, 54], r: 1.4, color: 'c' },
  ],
  readouts: [
    { label: L('elevation y', 'elevasi y'), value: '100+0.04*s-0.0001*s^2', dp: 2, unit: 'm' },
    { label: L("grade y'", "kelandaian y'"), value: '(0.04-0.0002*s)*100', dp: 2, unit: '%' },
  ],
  caption: L(
    'A road climbing at $4\\%$ and leaving at $-2\\%$, joined by a parabola $300$ m long between the two posts. Drive the car along it: the grade falls steadily, and the dot marks where it is zero. Heights are drawn $10$ times too large.',
    'Jalan yang menanjak $4\\%$ dan pergi dengan $-2\\%$, disambung parabola sepanjang $300$ m di antara kedua patok. Jalankan mobilnya: kelandaian turun dengan tetap, dan titik menandai tempat ia nol. Ketinggian digambar $10$ kali lebih besar.',
  ),
  view: [24, 26],
}

/** A road whose centerline is y = x²/400 on flat ground, with the circle that fits it best at the car. */
const RAD = '200*(1+(s/200)^2)^1.5'
export const planScene: Scene3D = {
  params: [{ name: 's', min: -150, max: 150, step: 5, value: 0, label: 'x (m)' }],
  items: [
    { t: 'sweep', x: [-160, 160], y: 'x^2/400', z: '0', width: 12, depth: 1, color: 'road', n: 64 },
    { t: 'curve', x: `-s^3/40000+${RAD}*cos(t)`, y: `200+3*s^2/400+${RAD}*sin(t)`, z: '0.6', from: 'atan(s/200)-pi/2-0.55', to: 'atan(s/200)-pi/2+0.55', color: 'result' },
    { t: 'line', pts: [['-s^3/40000', '200+3*s^2/400', 0.6], ['s', 's^2/400', 0.6]], dashed: true, color: 'result' },
    { t: 'dot', at: ['-s^3/40000', '200+3*s^2/400', 0.6], color: 'result' },
    { t: 'box', from: ['s-5', 's^2/400-3', 0], to: ['s+5', 's^2/400+3', 4], color: 'b' },
  ],
  readouts: [
    { label: L("slope y'", "kemiringan y'"), value: 's/200', dp: 3 },
    { label: L('curvature κ', 'kelengkungan κ'), value: '1000/(200*(1+(s/200)^2)^1.5)', dp: 3, unit: '1/km' },
    { label: L('radius R', 'jari-jari R'), value: RAD, dp: 1, unit: 'm' },
  ],
  caption: L(
    'A road seen from above, with centerline $y=\\frac{x^2}{400}$. At the car the dashed line is the radius of the circle that hugs the road best there. The bend is tightest at the middle and opens up towards the ends.',
    'Jalan dilihat dari atas, dengan garis tengah $y=\\frac{x^2}{400}$. Di mobil, garis putus-putus adalah jari-jari lingkaran yang paling pas memeluk jalan di sana. Tikungan paling tajam di tengah dan makin landai ke ujung.',
  ),
  view: [0, 62],
  height: 400,
}

/** Measuring a tower from 50 m away by the angle to its top. */
export const towerScene: Scene3D = {
  params: [{ name: 'a', min: 30, max: 68, step: 1, value: 60, label: 'θ (°)' }],
  items: [
    { t: 'box', from: [-6, -14, -0.4], to: [62, 14, 0], color: 'grass' },
    { t: 'box', from: [50, -4, 0], to: [58, 4, '50*tan(a*pi/180)'], color: 'concrete' },
    { t: 'line', pts: [[0, 0, 0], [50, 0, '50*tan(a*pi/180)']], color: 'result' },
    { t: 'line', pts: [[0, 0, 0.2], [50, 0, 0.2]], color: 'b' },
    { t: 'dot', at: [0, 0, 0.6], color: 'b' },
    { t: 'label', at: [25, 0, -4], text: '50 m' },
  ],
  readouts: [
    { label: L('height h', 'tinggi h'), value: '50*tan(a*pi/180)', dp: 2, unit: 'm' },
    { label: L('error for 0.5°', 'galat untuk 0,5°'), value: '50/cos(a*pi/180)^2*(0.5*pi/180)', dp: 2, unit: 'm' },
  ],
  caption: L(
    'A surveyor stands $50$ m from a tower and measures the angle $\\theta$ to its top. The height is $50\\tan\\theta$, and the same half-degree of doubt in the angle costs more and more height as the angle grows.',
    'Seorang juru ukur berdiri $50$ m dari menara dan mengukur sudut $\\theta$ ke puncaknya. Tingginya $50\\tan\\theta$, dan keraguan setengah derajat yang sama pada sudut berarti galat tinggi yang makin besar seiring sudut membesar.',
  ),
  view: [12, 12],
}

export const SCENES = { beamScene, loadScene, logStrengthScene, logStiffnessScene, tankScene, channelScene, trapezoidScene, pondScene, roadScene, planScene, towerScene }
