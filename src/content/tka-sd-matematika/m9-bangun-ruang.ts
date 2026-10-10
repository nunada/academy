import type { Loc, Module } from '../types'
import type { FigColor, FigItem } from '../../lib/figure'
import type { Piece, Piece3, Pt, Pt3 } from './figs'
import { cubeStack3d, cuboid3d, fit, frame3, outline, rectPts, solid, txt, viewsOf } from './figs'

/** Module 9 — solid shapes: the parts of a cube and a box, nets, building with unit
 *  cubes, volume (also of combined solids and water in a tank), and spatial
 *  visualization (front, top and side views, and rebuilding a stack from its views).
 *  Only cubes, boxes and their combinations; no prisms, cylinders, cones, spheres
 *  and no surface area. */

const L = (en: string, id: string): Loc => ({ en, id })

/* ------------------------------------------------------------- helpers */

type Cell = [number, number]
type Frag = { items: FigItem[] }

/** Move one figure item (poly, seg, text, dot, vec) by (dx, dy). */
function moveItem(it: FigItem, dx: number, dy: number): FigItem {
  const mv = (p: unknown): Pt => [(p as Pt)[0] + dx, (p as Pt)[1] + dy]
  if (it.t === 'poly') return { ...it, pts: it.pts.map(mv) }
  if (it.t === 'seg' || it.t === 'vec') return { ...it, from: it.from ? mv(it.from) : undefined, to: mv(it.to) } as FigItem
  if (it.t === 'text') return { ...it, at: mv(it.at) }
  if (it.t === 'dot') return { ...it, x: (it.x as number) + dx, y: (it.y as number) + dy }
  return it
}

/** The corners of everything drawn in `items`, for laying pieces out. */
function extent(items: FigItem[]): { x0: number; y0: number; x1: number; y1: number } {
  const pts: Pt[] = []
  for (const it of items) {
    if (it.t === 'poly') pts.push(...(it.pts as Pt[]))
    else if (it.t === 'seg' || it.t === 'vec') pts.push((it.from ?? [0, 0]) as Pt, it.to as Pt)
    else if (it.t === 'text') pts.push(it.at as Pt)
    else if (it.t === 'dot') pts.push([it.x as number, it.y as number])
  }
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }
}

/** Several small pictures in a grid, each with an optional one-letter tag
 *  underneath (P, Q, R ...), as ONE plane figure. */
function gallery(frags: (Frag & { tag?: string })[], cols = frags.length, gap = 1.6): Piece {
  const boxes = frags.map((f) => {
    const e = extent(f.items)
    return { f, e, w: e.x1 - e.x0, h: e.y1 - e.y0 }
  })
  const cw = Math.max(...boxes.map((b) => b.w))
  const ch = Math.max(...boxes.map((b) => b.h))
  const rows = Math.ceil(boxes.length / cols)
  const rowH = ch + gap + 0.9
  const items: FigItem[] = []
  const all: Pt[] = []
  boxes.forEach((b, i) => {
    const c = i % cols
    const r = Math.floor(i / cols)
    const ox = c * (cw + gap) + (cw - b.w) / 2 - b.e.x0
    const oy = (rows - 1 - r) * rowH + (ch - b.h) / 2 - b.e.y0
    for (const it of b.f.items) items.push(moveItem(it, ox, oy))
    if (b.f.tag) items.push(txt(c * (cw + gap) + cw / 2, (rows - 1 - r) * rowH - 0.8, b.f.tag, 'lg', 'result'))
    all.push([c * (cw + gap), (rows - 1 - r) * rowH - (b.f.tag ? 1.4 : 0.2)], [c * (cw + gap) + cw, (rows - 1 - r) * rowH + ch + 0.2])
  })
  return { dim: 2, axes: false, ...fit(all, 0.5), items }
}

/** A net made of unit squares. `cells` are [column, row] of each square; `tags`
 *  writes a letter or number inside each square, in the same order. */
function netFrag(cells: Cell[], o: { color?: FigColor; tags?: string[] } = {}): Frag {
  const items: FigItem[] = []
  cells.forEach(([x, y], i) => {
    items.push(solid(rectPts(x, y, 1, 1), o.color ?? 'c'))
    items.push(outline(rectPts(x, y, 1, 1), 'muted'))
    if (o.tags?.[i]) items.push(txt(x + 0.5, y + 0.5, o.tags[i], 'lg', 'muted'))
  })
  return { items }
}

const netPiece = (cells: Cell[], o: { color?: FigColor; tags?: string[] } = {}): Piece => gallery([netFrag(cells, o)])

/** A box `l` by `w` by `h` laid flat in the usual cross: the base, the front on top of it,
 *  then the top and the back, with the left and right faces beside the front.
 *  Opposite faces share a color; `dims` writes the three lengths beside the net. */
function boxNet(o: { l: number; w: number; h: number; dims?: boolean }): Piece {
  const { l, w, h } = o
  const items: FigItem[] = []
  const face = (x: number, y: number, fw: number, fh: number, c: FigColor) => {
    items.push(solid(rectPts(x, y, fw, fh), c))
    items.push(outline(rectPts(x, y, fw, fh), 'muted'))
  }
  face(w, 0, l, w, 'a') // base
  face(w, w, l, h, 'b') // front
  face(w, w + h, l, w, 'a') // top
  face(w, 2 * w + h, l, h, 'b') // back
  face(0, w, w, h, 'c') // left
  face(w + l, w, w, h, 'c') // right
  const pts: Pt[] = [[0, 0], [l + 2 * w, 2 * w + 2 * h]]
  if (o.dims) {
    items.push(txt(w + l / 2, -0.7, `${l} cm`, 'md', 'result'))
    items.push(txt(w + l + 0.4, w / 2, `${w} cm`, 'md', 'result', 'start'))
    items.push(txt(w / 2, w + h + 0.6, `${h} cm`, 'md', 'result'))
    pts.push([-0.2, -1.2], [l + 2 * w + 2.4, 2 * w + 2 * h], [0, w + h + 1.2])
  }
  return { dim: 2, axes: false, ...fit(pts, 0.5), items }
}

/** Fill a rectangular grid of heights (rows may be ragged). */
function grid(H: number[][]): number[][] {
  const C = Math.max(...H.map((r) => r.length))
  return H.map((r) => Array.from({ length: C }, (_, j) => r[j] ?? 0))
}

/* How the stacks are read in this module.
 *
 * A stack is written as H[i][j]: row i = 0 is the row nearest the person who looks at the
 * FRONT, column j runs left to right as that person sees it. On the printed top view the
 * front is at the bottom edge, and row i = 0 is the bottom row of squares.
 *   - front view: you stand at the bottom edge. Column j shows max over i of H[i][j].
 *   - side view:  you stand at the right edge. Its left column is the front row, so it shows
 *     max over j of H[i][j] for i = 0, 1, ...
 * `cubeStack3d` draws the stack with its left face being the front and its right face being
 * the right side, which takes the array turned a quarter turn. */

/** The stack as a corner picture: front face on the left, right-hand face on the right. */
function stack(H0: number[][]): Piece & { dim: 3 } {
  const H = grid(H0)
  const R = H.length
  const C = H[0].length
  const D = Array.from({ length: C }, (_, a) => Array.from({ length: R }, (_, b) => H[R - 1 - b][a]))
  return cubeStack3d(D) as never
}

/** The three plane views of the stack, in this module's reading (see above). */
function views(H0: number[][], o: { numbers?: boolean } = {}): { front: Piece; side: Piece; top: Piece } {
  const H = grid(H0)
  const R = H.length
  const C = H[0].length
  const D = Array.from({ length: C }, (_, a) => Array.from({ length: R }, (_, b) => H[R - 1 - b][a]))
  const v = viewsOf(D)
  return { front: v.front, side: v.side, top: viewsOf(H, o).top }
}

/** A picture of a view with `h[c]` squares in column c, drawn `maxH` squares high. */
function profileFrag(h: number[], maxH = Math.max(...h)): Frag {
  const items: FigItem[] = []
  h.forEach((n, c) => {
    for (let k = 0; k < maxH; k++) items.push(k < n ? solid(rectPts(c, k, 1, 1), 'a') : outline(rectPts(c, k, 1, 1), 'muted'))
  })
  return { items }
}

/** The top view of the stack with the number of cubes written on each square, and an arrow
 *  showing where the person stands: below the plan ('front') or to the right of it ('side'). */
function planFrag(H0: number[][], from: 'front' | 'side' | 'none' = 'none', numbers = true): Frag {
  const H = grid(H0)
  const R = H.length
  const C = H[0].length
  const items: FigItem[] = []
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      const cell = rectPts(j, i, 1, 1)
      items.push(H[i][j] > 0 ? solid(cell, 'c') : outline(cell, 'muted'))
      if (numbers && H[i][j] > 0) items.push(txt(j + 0.5, i + 0.5, String(H[i][j]), 'lg', 'muted'))
    }
  }
  if (from === 'front') items.push({ t: 'vec', from: [C / 2, -1.5], to: [C / 2, -0.3], color: 'result' })
  if (from === 'side') items.push({ t: 'vec', from: [C + 1.5, R / 2], to: [C + 0.3, R / 2], color: 'result' })
  return { items }
}

type Box3 = [number, number, number, number, number, number]

/** Boxes joined into one solid, drawn from the corner view. A box is [x0, y0, z0, x1, y1, z1]:
 *  x is the length and runs toward the left of the picture, y is the width and runs toward the
 *  right, z is the height. Put the tall parts at small x and y (the back) so nothing is hidden.
 *  `labels` writes text at points given in the same coordinates. */
function boxes3d(boxes: Box3[], labels: { at: Pt3; text: string }[] = []): Piece3 {
  const corners: Pt3[] = boxes.flatMap(([x0, y0, z0, x1, y1, z1]) =>
    [x0, x1].flatMap((x) => [y0, y1].flatMap((y) => [z0, z1].map((z) => [x, y, z] as Pt3))),
  )
  const { shift, range } = frame3([...corners, ...labels.map((l) => l.at)])
  const r4 = (n: number) => Math.round(n * 1e4) / 1e4
  const S = (x: number, y: number, z: number): Pt3 => [r4(x + shift[0]), r4(y + shift[1]), r4(z + shift[2])]
  const items: FigItem[] = []
  for (const [x0, y0, z0, x1, y1, z1] of boxes) {
    items.push({ t: 'poly', pts: [S(x1, y0, z0), S(x1, y1, z0), S(x1, y1, z1), S(x1, y0, z1)], color: 'a', look: 'solid' })
    items.push({ t: 'poly', pts: [S(x0, y1, z0), S(x1, y1, z0), S(x1, y1, z1), S(x0, y1, z1)], color: 'b', look: 'solid' })
    items.push({ t: 'poly', pts: [S(x0, y0, z1), S(x1, y0, z1), S(x1, y1, z1), S(x0, y1, z1)], color: 'c', look: 'solid' })
    const edge = (a: Pt3, b: Pt3) => items.push({ t: 'seg', from: S(...a), to: S(...b), color: 'muted', width: 2 })
    edge([x0, y0, z1], [x1, y0, z1]) // top, back
    edge([x0, y0, z1], [x0, y1, z1]) // top, right end
    edge([x0, y1, z1], [x1, y1, z1]) // top, front-right
    edge([x1, y0, z1], [x1, y1, z1]) // top, front-left
    edge([x1, y0, z0], [x1, y1, z0]) // bottom, front-left
    edge([x0, y1, z0], [x1, y1, z0]) // bottom, front-right
    edge([x1, y0, z0], [x1, y0, z1]) // upright, left
    edge([x1, y1, z0], [x1, y1, z1]) // upright, middle
    edge([x0, y1, z0], [x0, y1, z1]) // upright, right
  }
  for (const l of labels) items.push({ t: 'text', at: S(...l.at), text: l.text, color: 'result', size: 'lg' })
  return { dim: 3, axes: false, range, view: [38, 22], items }
}

/** The top view with the number of cubes on each square, as one picture. `from` draws the arrow
 *  that shows where the person who looks stands. */
const planPiece = (H: number[][], from: 'front' | 'side' | 'none' = 'front'): Piece => gallery([planFrag(H, from)])

/** The front view, the side view and the top view of a stack side by side, in that order. */
function threeViews(H: number[][]): Piece {
  const v = views(H)
  return gallery([{ items: v.front.items }, { items: v.side.items }, planFrag(H, 'front')], 3)
}

/** Only two views are known: the front view (columns left to right) and the side view (seen from
 *  the right, so its first column is the front row). With `plan`, the empty top view is drawn too:
 *  one row for each column of the side view and one column for each column of the front view. */
function twoViews(front: number[], side: number[], plan = false): Piece {
  const maxH = Math.max(...front, ...side)
  const frags: Frag[] = [profileFrag(front, maxH), profileFrag(side, maxH)]
  if (plan) frags.push(planFrag(side.map(() => front.map(() => 0)), 'front', false))
  return gallery(frags, frags.length)
}

/* ---------------------------------------------------------------------------- the module */

export const module9: Module = {
  id: 'tka-m9',
  title: L('Solid Shapes', 'Bangun Ruang'),
  summary: L(
    'Cubes and boxes are everywhere: dice, shoe boxes, fish tanks and stacks of blocks. You will name their parts, fold their nets, build them from unit cubes, find their volume, and work out what a stack looks like from the front, the top and the side.',
    'Kubus dan balok ada di mana-mana: dadu, kotak sepatu, akuarium, dan tumpukan balok mainan. Kamu akan menyebutkan unsurnya, melipat jaring-jaringnya, menyusunnya dari kubus satuan, mencari volumenya, dan menentukan bagaimana sebuah tumpukan terlihat dari depan, atas, dan samping.',
  ),
  submodules: [
    /* ================================================================== S1 — cubes and boxes */
    {
      id: 'tka-m9-s1',
      title: L('Cubes and Boxes', 'Kubus dan Balok'),
      summary: L(
        'The faces, edges and corners of a cube and a box, nets that fold (and nets that do not), and building a solid layer by layer from unit cubes.',
        'Sisi, rusuk, dan titik sudut kubus dan balok, jaring-jaring yang bisa dilipat (dan yang tidak), serta menyusun bangun ruang lapis demi lapis dari kubus satuan.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m9-s1-l1',
          title: L('Parts and Nets of Cubes and Boxes', 'Unsur dan Jaring-jaring Kubus dan Balok'),
          goal: L(
            'You can name the faces, edges and corners of a cube and a box, tell which edges are equal, and decide whether a net folds into a cube.',
            'Kamu bisa menyebutkan sisi, rusuk, dan titik sudut kubus dan balok, menentukan rusuk yang sama panjang, dan memutuskan apakah suatu jaring-jaring bisa dilipat menjadi kubus.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: A Die and a Shoe Box', 'Ayo Amati: Dadu dan Kotak Sepatu'),
              body: L(
                'Budi has a die and a shoe box. The die is a **cube**: all its sides are the same size. The shoe box is a **box**: it has a length, a width and a height, and the three can be different.\n\nLook at the picture of the box. Every part has a name.\n\n- A **face** is a flat side. The box has a top, a bottom, a front, a back and two sides.\n- An **edge** is the line where two faces meet.\n- A **corner** is the point where three edges meet.\n\nThree faces are hidden behind the box, so in the picture you only see the top and two sides.',
                'Budi punya sebuah dadu dan sebuah kotak sepatu. Dadu itu berbentuk **kubus**: semua sisinya sama besar. Kotak sepatu berbentuk **balok**: ia punya panjang, lebar, dan tinggi, dan ketiganya bisa berbeda.\n\nLihat gambar balok itu. Setiap bagiannya punya nama.\n\n- **Sisi** adalah bidang datar pada bangun itu. Balok punya sisi atas, bawah, depan, belakang, dan dua sisi samping.\n- **Rusuk** adalah garis tempat dua sisi bertemu.\n- **Titik sudut** adalah titik tempat tiga rusuk bertemu.\n\nTiga sisi tersembunyi di belakang balok, jadi pada gambar kamu hanya melihat sisi atas dan dua sisi samping.',
              ),
              figure: {
                ...cuboid3d({ l: 4, w: 3, h: 2 }),
                caption: L(
                  'A box seen from a corner. The top and two sides are colored; the other three faces are behind.',
                  'Sebuah balok dilihat dari sudut. Sisi atas dan dua sisi samping diberi warna; tiga sisi lainnya ada di belakang.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Counting the Parts of a Box', 'Contoh Bertahap: Menghitung Unsur Balok'),
              body: L(
                'Ani makes a model of a box from straws and clay. The box is 6 cm long, 4 cm wide and 3 cm high. How many straws does she need, and how many centimeters of straw in all?\n\n1. Step 1: Faces. Top and bottom, front and back, left and right: that is 6 faces.\n2. Step 2: Edges. There are 4 edges around the top, 4 around the bottom and 4 standing up between them: $4 + 4 + 4 = 12$ edges, so she needs 12 straws.\n3. Step 3: Corners. There are 4 corners on the top and 4 on the bottom: 8 corners.\n4. Step 4: Equal edges. Four edges are 6 cm long, four are 4 cm long and four are 3 cm long.\n5. Step 5: Add the lengths: $4 \\times 6 + 4 \\times 4 + 4 \\times 3 = 24 + 16 + 12 = 52$ cm of straw.\n\n**Remember:** a cube and a box both have 6 faces, 12 edges and 8 corners.\n\n| Part | Cube | Box |\n| --- | --- | --- |\n| Faces | 6, all the same square | 6, opposite faces are the same |\n| Edges | 12, all the same length | 12, in 3 groups of 4 equal edges |\n| Corners | 8 | 8 |',
                'Ani membuat model balok dari sedotan dan plastisin. Balok itu panjangnya 6 cm, lebarnya 4 cm, dan tingginya 3 cm. Berapa sedotan yang ia butuhkan, dan berapa sentimeter sedotan seluruhnya?\n\n1. Langkah 1: Sisi. Atas dan bawah, depan dan belakang, kiri dan kanan: ada 6 sisi.\n2. Langkah 2: Rusuk. Ada 4 rusuk di sekeliling bagian atas, 4 di sekeliling bagian bawah, dan 4 yang berdiri di antaranya: $4 + 4 + 4 = 12$ rusuk, jadi ia butuh 12 sedotan.\n3. Langkah 3: Titik sudut. Ada 4 titik sudut di atas dan 4 di bawah: 8 titik sudut.\n4. Langkah 4: Rusuk yang sama. Empat rusuk panjangnya 6 cm, empat rusuk 4 cm, dan empat rusuk 3 cm.\n5. Langkah 5: Jumlahkan panjangnya: $4 \\times 6 + 4 \\times 4 + 4 \\times 3 = 24 + 16 + 12 = 52$ cm sedotan.\n\n**Ingat:** kubus dan balok sama-sama punya 6 sisi, 12 rusuk, dan 8 titik sudut.\n\n| Unsur | Kubus | Balok |\n| --- | --- | --- |\n| Sisi | 6, semuanya persegi yang sama | 6, sisi yang berhadapan sama |\n| Rusuk | 12, semuanya sama panjang | 12, dalam 3 kelompok yang masing-masing 4 rusuk sama panjang |\n| Titik sudut | 8 | 8 |',
              ),
              figure: {
                ...cuboid3d({ l: 6, w: 4, h: 3, labels: { l: '6 cm', w: '4 cm', h: '3 cm' } }),
                caption: L(
                  'The box of the model: 6 cm long, 4 cm wide and 3 cm high.',
                  'Balok model itu: panjang 6 cm, lebar 4 cm, tinggi 3 cm.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Nets', 'Contoh Bertahap: Jaring-jaring'),
              body: L(
                'Cut open a cardboard box along some edges and lay it flat. The flat shape is a **net**: fold it back and you get the box again.\n\nThe picture shows a net of a box 4 cm long, 3 cm wide and 2 cm high.\n\n1. Step 1: Count the pieces. The net has 6 rectangles, one for each face.\n2. Step 2: Find the pairs. Faces that sit opposite each other are the same size, and they have the same color in the picture: top and bottom, front and back, left and right.\n3. Step 3: For a cube, all 6 pieces are the same square. Many ways of joining 6 squares fold into a cube (there are 11 of them), but not all ways do.\n4. Step 4: To test a net, pick one square as the bottom and fold the others up in your head. If two squares land on the same place, the net does not fold into a cube.\n\n**Remember:** a net of a cube has 6 equal squares, and faces that are opposite each other never touch in the net.',
                'Gunting sebuah kardus pada beberapa rusuknya, lalu bentangkan sampai datar. Bentuk datar itu adalah **jaring-jaring**: lipat kembali dan kamu mendapat baloknya lagi.\n\nGambar menunjukkan jaring-jaring balok yang panjangnya 4 cm, lebarnya 3 cm, dan tingginya 2 cm.\n\n1. Langkah 1: Hitung bagiannya. Jaring-jaring itu punya 6 persegi panjang, satu untuk tiap sisi.\n2. Langkah 2: Cari pasangannya. Sisi yang berhadapan ukurannya sama, dan warnanya sama pada gambar: atas dan bawah, depan dan belakang, kiri dan kanan.\n3. Langkah 3: Pada kubus, keenam bagiannya adalah persegi yang sama. Ada banyak cara menyambung 6 persegi yang bisa dilipat menjadi kubus (ada 11 cara), tetapi tidak semua cara bisa.\n4. Langkah 4: Untuk menguji jaring-jaring, pilih satu persegi sebagai alas lalu lipat persegi yang lain ke atas di dalam kepalamu. Jika dua persegi jatuh di tempat yang sama, jaring-jaring itu tidak bisa dilipat menjadi kubus.\n\n**Ingat:** jaring-jaring kubus terdiri dari 6 persegi yang sama, dan sisi yang saling berhadapan tidak pernah bersentuhan pada jaring-jaringnya.',
              ),
              figure: {
                ...boxNet({ l: 4, w: 3, h: 2, dims: true }),
                caption: L(
                  'A net of a box 4 cm by 3 cm by 2 cm. Opposite faces have the same color.',
                  'Jaring-jaring balok 4 cm kali 3 cm kali 2 cm. Sisi yang berhadapan berwarna sama.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Parts and Nets', 'Awas, Jebakan!: Unsur dan Jaring-jaring'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| ❌ Six squares joined edge to edge always fold into a cube. | No. Five squares in a row, or four squares in a block of 2 by 2, would put two faces on the same place. |\n| ❌ A box has 6 edges, because it has 6 faces. | A box has 6 faces, 12 edges and 8 corners. Do not mix up the three words. |\n| ❌ All 12 edges of a box are the same length. | Only a cube has 12 equal edges. A box has 3 groups of 4 equal edges. |',
                '| Salah | Benar |\n| --- | --- |\n| ❌ Enam persegi yang disambung sisi dengan sisi selalu bisa dilipat menjadi kubus. | Tidak. Lima persegi berderet, atau empat persegi membentuk blok 2 kali 2, akan menumpuk dua sisi di tempat yang sama. |\n| ❌ Balok punya 6 rusuk, karena punya 6 sisi. | Balok punya 6 sisi, 12 rusuk, dan 8 titik sudut. Jangan tertukar ketiga kata itu. |\n| ❌ Semua 12 rusuk balok sama panjang. | Hanya kubus yang punya 12 rusuk sama panjang. Balok punya 3 kelompok yang masing-masing 4 rusuk sama panjang. |',
              ),
              figure: {
                ...gallery(
                  [
                    netFrag([[0, 1], [1, 1], [2, 1], [3, 1], [2, 2], [0, 0]], { color: 'a' }),
                    netFrag([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1]], { color: 'b' }),
                  ],
                  2,
                ),
                caption: L(
                  'Left: a net that folds into a cube. Right: five squares in a row never fold, because the first and the last square land on the same place.',
                  'Kiri: jaring-jaring yang bisa dilipat menjadi kubus. Kanan: lima persegi berderet tidak bisa dilipat, karena persegi pertama dan terakhir jatuh di tempat yang sama.',
                ),
              },
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'A box is 5 cm long, 3 cm wide and 2 cm high. How many of its edges are 3 cm long?',
                'Sebuah balok panjangnya 5 cm, lebarnya 3 cm, dan tingginya 2 cm. Berapa rusuknya yang panjangnya 3 cm?',
              ),
              figure: {
                ...cuboid3d({ l: 5, w: 3, h: 2, labels: { l: '5 cm', w: '3 cm', h: '2 cm' } }),
                caption: L('A box 5 cm long, 3 cm wide and 2 cm high.', 'Balok dengan panjang 5 cm, lebar 3 cm, dan tinggi 2 cm.'),
              },
              options: [L('4 edges', '4 rusuk'), L('3 edges', '3 rusuk'), L('1 edge', '1 rusuk'), L('12 edges', '12 rusuk')],
              answer: 0,
              explain: L(
                'Edges come in 3 groups of 4 equal ones: four are 5 cm, four are 3 cm and four are 2 cm. 3 edges counts only the ones you can see, 1 edge counts only the one with a label, and 12 edges is all of them.',
                'Rusuk terbagi dalam 3 kelompok yang masing-masing 4 rusuk sama panjang: empat rusuk 5 cm, empat rusuk 3 cm, dan empat rusuk 2 cm. 3 rusuk hanya menghitung yang terlihat, 1 rusuk hanya menghitung yang diberi label, dan 12 rusuk adalah semuanya.',
              ),
              hint: L(
                'Some edges are hidden behind the box. How many edges are as long as one that you can see?',
                'Ada rusuk yang tersembunyi di belakang balok. Berapa rusuk yang sama panjang dengan satu rusuk yang terlihat?',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: a box is 5 cm long, 4 cm wide and 2 cm high. How many centimeters of wire are needed to make all its edges?',
                'Coba bersama: sebuah balok panjangnya 5 cm, lebarnya 4 cm, dan tingginya 2 cm. Berapa sentimeter kawat yang dibutuhkan untuk membuat semua rusuknya?',
              ),
              template: '4 \\times 5 + 4 \\times 4 + 4 \\times 2 = 20 + ___ + 8 = ___ \\text{ cm}',
              blanks: ['16', '44'],
              explain: L(
                'Four edges are 5 cm (20 cm), four are 4 cm (16 cm) and four are 2 cm (8 cm). 20 + 16 + 8 = 44 cm.',
                'Empat rusuk 5 cm (20 cm), empat rusuk 4 cm (16 cm), dan empat rusuk 2 cm (8 cm). 20 + 16 + 8 = 44 cm.',
              ),
              hint: L(
                'Each length appears on 4 edges. Multiply the width by 4 first, then add the three parts.',
                'Setiap ukuran ada pada 4 rusuk. Kalikan dulu lebarnya dengan 4, lalu jumlahkan ketiga bagian.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'This net is folded into a cube. Which face is opposite face B?',
                'Jaring-jaring ini dilipat menjadi kubus. Sisi manakah yang berhadapan dengan sisi B?',
              ),
              figure: {
                ...netPiece([[0, 2], [1, 2], [1, 1], [2, 1], [2, 0], [3, 0]], { tags: ['A', 'B', 'C', 'D', 'E', 'F'] }),
                caption: L('A net of a cube with its six faces named.', 'Jaring-jaring kubus dengan keenam sisinya diberi nama.'),
              },
              options: [L('Face E', 'Sisi E'), L('Face A', 'Sisi A'), L('Face C', 'Sisi C'), L('Face D', 'Sisi D')],
              answer: 0,
              explain: L(
                'When the net is folded, four faces touch face B: A, C, D and F. Only E is left on the far side, opposite B. A and C touch B in the net, and D and F still end up next to it, so none of them can be opposite.',
                'Setelah jaring-jaring dilipat, ada empat sisi yang bersentuhan dengan sisi B: A, C, D, dan F. Hanya E yang tersisa di sisi seberang, berhadapan dengan B. A dan C menyentuh B pada jaring-jaring, dan D serta F tetap berada di sebelahnya, jadi tidak ada yang bisa berhadapan.',
              ),
              hint: L(
                'Opposite faces never touch. Fold the net in your head: which faces end up next to B, and which one is left over?',
                'Sisi yang berhadapan tidak pernah bersentuhan. Lipat jaring-jaring di kepalamu: sisi mana yang berada di sebelah B, dan mana yang tersisa?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              figure: {
                ...gallery(
                  [
                    { ...netFrag([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]]), tag: 'P' },
                    { ...netFrag([[0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [1, 0]]), tag: 'Q' },
                    { ...netFrag([[0, 1], [1, 1], [2, 1], [2, 0], [3, 0], [4, 0]]), tag: 'R' },
                    { ...netFrag([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1]]), tag: 'S' },
                  ],
                  2,
                ),
                caption: L('Four nets made of 6 equal squares.', 'Empat jaring-jaring yang terdiri dari 6 persegi yang sama.'),
              },
              statements: [
                L('Net P folds into a cube.', 'Jaring-jaring P bisa dilipat menjadi kubus.'),
                L('Net Q folds into a cube.', 'Jaring-jaring Q bisa dilipat menjadi kubus.'),
                L('Net R folds into a cube.', 'Jaring-jaring R bisa dilipat menjadi kubus.'),
                L('Net S folds into a cube.', 'Jaring-jaring S bisa dilipat menjadi kubus.'),
              ],
              answer: [false, true, true, false],
              explain: L(
                'Nets Q and R fold. In net P four squares make a block, and in net S five squares stand in a row. In both, two faces would land on the same place and one face would be missing.',
                'Jaring-jaring Q dan R bisa dilipat. Pada jaring-jaring P ada empat persegi yang membentuk blok, dan pada jaring-jaring S ada lima persegi berderet. Pada keduanya, dua sisi akan jatuh di tempat yang sama dan satu sisi akan kurang.',
              ),
              hint: L(
                'Pick one square as the bottom and fold the others up. Does any square land on top of another one?',
                'Pilih satu persegi sebagai alas lalu lipat persegi lain ke atas. Apakah ada persegi yang jatuh di atas persegi lain?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Dewi makes the frame of a box from wire, with one piece of wire for every edge and none left over. The box is 12 cm long, 8 cm wide and 5 cm high. How many centimeters of wire does she need?',
                'Dewi membuat kerangka sebuah balok dari kawat, satu potong kawat untuk setiap rusuk dan tidak ada yang tersisa. Balok itu panjangnya 12 cm, lebarnya 8 cm, dan tingginya 5 cm. Berapa sentimeter kawat yang ia butuhkan?',
              ),
              figure: {
                ...cuboid3d({ l: 12, w: 8, h: 5, labels: { l: '12 cm', w: '8 cm', h: '5 cm' } }),
                caption: L('The box for the wire frame.', 'Balok untuk kerangka kawat.'),
              },
              blanks: [{ answer: 100, after: '\\text{ cm}' }],
              hints: [
                L(
                  'How many edges does a box have, and how many of them are the same length?',
                  'Berapa rusuk yang dimiliki balok, dan berapa di antaranya yang sama panjang?',
                ),
                L(
                  'There are 4 edges for the length, 4 for the width and 4 for the height. Find the length of wire for each group.',
                  'Ada 4 rusuk untuk panjang, 4 untuk lebar, dan 4 untuk tinggi. Cari panjang kawat untuk tiap kelompok.',
                ),
                L(
                  'Length group: 4 × 12. Width group: 4 × 8. Height group: 4 × 5. Add the three results (or add 12, 8 and 5 first and multiply by 4).',
                  'Kelompok panjang: 4 × 12. Kelompok lebar: 4 × 8. Kelompok tinggi: 4 × 5. Jumlahkan ketiga hasilnya (atau jumlahkan 12, 8, dan 5 dulu lalu kalikan 4).',
                ),
              ],
              explain: L(
                'The box has 4 edges of each length: $4 \\times 12 + 4 \\times 8 + 4 \\times 5 = 48 + 32 + 20 = 100$ cm.',
                'Balok punya 4 rusuk untuk tiap ukuran: $4 \\times 12 + 4 \\times 8 + 4 \\times 5 = 48 + 32 + 20 = 100$ cm.',
              ),
              solution: {
                en: ['4 \\times 12 = 48', '4 \\times 8 = 32', '4 \\times 5 = 20', '48 + 32 + 20 = 100\\text{ cm}'],
                id: ['4 \\times 12 = 48', '4 \\times 8 = 32', '4 \\times 5 = 20', '48 + 32 + 20 = 100\\text{ cm}'],
              },
            },
          ],
        },
        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m9-s1-l2',
          title: L('Building Solids from Unit Cubes', 'Membangun Bangun Ruang dari Kubus Satuan'),
          goal: L(
            'You can count the unit cubes in a box and in a stack of cubes, layer by layer, and work out how many more cubes are needed to fill a box.',
            'Kamu bisa menghitung kubus satuan pada sebuah balok dan pada tumpukan kubus, lapis demi lapis, dan menentukan berapa kubus lagi yang dibutuhkan untuk memenuhi sebuah balok.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: One Layer of Cubes', 'Ayo Amati: Satu Lapis Kubus'),
              body: L(
                'Ani has many small blocks. Each block is a **unit cube**: a cube whose sides are 1 cm long. She lines them up to make a flat layer 4 blocks long and 3 blocks wide.\n\nCount the cubes in one layer: there are 3 rows with 4 cubes in each row, so $4 \\times 3 = 12$ cubes.\n\nIf she puts a second layer on top, she needs 12 more cubes. A solid made of equal layers is easy to count: **cubes in one layer × number of layers**.',
                'Ani punya banyak balok kecil. Setiap balok adalah **kubus satuan**: kubus yang panjang sisinya 1 cm. Ia menyusunnya menjadi satu lapis datar yang panjangnya 4 balok dan lebarnya 3 balok.\n\nHitung kubus dalam satu lapis: ada 3 baris dengan 4 kubus di tiap baris, jadi $4 \\times 3 = 12$ kubus.\n\nJika ia menaruh lapis kedua di atasnya, ia butuh 12 kubus lagi. Bangun yang terdiri dari lapisan yang sama mudah dihitung: **kubus dalam satu lapis × banyak lapis**.',
              ),
              figure: {
                ...cuboid3d({ l: 4, w: 3, h: 1, grid: true }),
                caption: L(
                  'One layer of unit cubes: 4 along the length and 3 along the width.',
                  'Satu lapis kubus satuan: 4 sepanjang panjang dan 3 sepanjang lebar.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: A Box Made Layer by Layer', 'Contoh Bertahap: Balok yang Disusun Lapis demi Lapis'),
              body: L(
                'Eko builds a box from unit cubes. It is 5 cubes long, 3 cubes wide and 2 cubes high. How many unit cubes does he use?\n\n1. Step 1: Look at the bottom layer. There are 5 cubes in each row and 3 rows: $5 \\times 3 = 15$ cubes.\n2. Step 2: Count the layers. The box is 2 cubes high, so there are 2 layers.\n3. Step 3: Every layer is the same, so multiply: $15 \\times 2 = 30$ cubes.\n4. Step 4: Check by adding the layers: $15 + 15 = 30$.\n\n**Remember:**\n\n- Cubes in one layer = cubes along the length × cubes along the width.\n- Cubes in the box = cubes in one layer × number of layers.',
                'Eko menyusun sebuah balok dari kubus satuan. Balok itu panjangnya 5 kubus, lebarnya 3 kubus, dan tingginya 2 kubus. Berapa kubus satuan yang ia pakai?\n\n1. Langkah 1: Lihat lapisan paling bawah. Ada 5 kubus di tiap baris dan 3 baris: $5 \\times 3 = 15$ kubus.\n2. Langkah 2: Hitung lapisannya. Balok itu tingginya 2 kubus, jadi ada 2 lapis.\n3. Langkah 3: Setiap lapis sama, jadi kalikan: $15 \\times 2 = 30$ kubus.\n4. Langkah 4: Cek dengan menjumlahkan lapisannya: $15 + 15 = 30$.\n\n**Ingat:**\n\n- Kubus dalam satu lapis = kubus sepanjang panjang × kubus sepanjang lebar.\n- Kubus dalam balok = kubus dalam satu lapis × banyak lapis.',
              ),
              figure: {
                ...cuboid3d({ l: 5, w: 3, h: 2, grid: true }),
                caption: L(
                  'A box 5 cubes long, 3 cubes wide and 2 cubes high.',
                  'Balok dengan panjang 5 kubus, lebar 3 kubus, dan tinggi 2 kubus.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Stacks of Cubes', 'Contoh Bertahap: Tumpukan Kubus'),
              body: L(
                'Gita stacks cubes like a staircase: the first column is 3 cubes high, the second is 2 and the third is 1. The staircase is 2 cubes deep. How many cubes are in it?\n\n1. Step 1: Count one row of the staircase, column by column: $3 + 2 + 1 = 6$ cubes.\n2. Step 2: The staircase is 2 rows deep and both rows are the same: $6 \\times 2 = 12$ cubes.\n3. Step 3: Check layer by layer. The bottom layer has $3 \\times 2 = 6$ cubes, the middle layer has $2 \\times 2 = 4$, and the top layer has $1 \\times 2 = 2$.\n4. Step 4: Add the layers: $6 + 4 + 2 = 12$ cubes. Both ways agree.\n\n**Remember:** count column by column or layer by layer. Do not count only the cubes you can see.',
                'Gita menumpuk kubus seperti tangga: kolom pertama setinggi 3 kubus, kolom kedua 2 kubus, dan kolom ketiga 1 kubus. Tangga itu dalamnya 2 kubus. Berapa kubus yang ada di dalamnya?\n\n1. Langkah 1: Hitung satu baris tangga, kolom demi kolom: $3 + 2 + 1 = 6$ kubus.\n2. Langkah 2: Tangga itu dalamnya 2 baris dan kedua baris sama: $6 \\times 2 = 12$ kubus.\n3. Langkah 3: Cek lapis demi lapis. Lapis bawah punya $3 \\times 2 = 6$ kubus, lapis tengah punya $2 \\times 2 = 4$, dan lapis atas punya $1 \\times 2 = 2$.\n4. Langkah 4: Jumlahkan lapisannya: $6 + 4 + 2 = 12$ kubus. Kedua cara menghasilkan hasil yang sama.\n\n**Ingat:** hitung kolom demi kolom atau lapis demi lapis. Jangan hanya menghitung kubus yang terlihat.',
              ),
              figure: {
                ...stack([[3, 2, 1], [3, 2, 1]]),
                caption: L(
                  'A staircase of cubes: 3 steps high, 2 cubes deep.',
                  'Tangga dari kubus: tingginya 3 anak tangga, dalamnya 2 kubus.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Counting Cubes', 'Awas, Jebakan!: Menghitung Kubus'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| ❌ Count only the cubes you can see in the picture. | Some cubes are hidden behind or under others. Count column by column or layer by layer. |\n| ❌ A box 4 long, 3 wide and 2 high has $4 + 3 + 2 = 9$ cubes. | Multiply. One layer has $4 \\times 3 = 12$ cubes, and 2 layers make 24 cubes. |\n| ❌ A box holds 24 cubes and 15 are already in. We need $24 + 15$ more. | Subtract: $24 - 15 = 9$ more cubes. |',
                '| Salah | Benar |\n| --- | --- |\n| ❌ Hanya menghitung kubus yang terlihat pada gambar. | Ada kubus yang tersembunyi di belakang atau di bawah kubus lain. Hitung kolom demi kolom atau lapis demi lapis. |\n| ❌ Balok dengan panjang 4, lebar 3, dan tinggi 2 punya $4 + 3 + 2 = 9$ kubus. | Kalikan. Satu lapis punya $4 \\times 3 = 12$ kubus, dan 2 lapis menjadi 24 kubus. |\n| ❌ Sebuah kotak muat 24 kubus dan 15 sudah masuk. Kita butuh $24 + 15$ lagi. | Kurangkan: $24 - 15 = 9$ kubus lagi. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('How many unit cubes make this box?', 'Berapa kubus satuan yang menyusun balok ini?'),
              figure: {
                ...cuboid3d({ l: 4, w: 2, h: 3, grid: true }),
                caption: L(
                  'A box 4 cubes long, 2 cubes wide and 3 cubes high.',
                  'Balok dengan panjang 4 kubus, lebar 2 kubus, dan tinggi 3 kubus.',
                ),
              },
              options: [L('24 cubes', '24 kubus'), L('9 cubes', '9 kubus'), L('8 cubes', '8 kubus'), L('12 cubes', '12 kubus')],
              answer: 0,
              explain: L(
                'One layer has $4 \\times 2 = 8$ cubes and there are 3 layers: $8 \\times 3 = 24$. 9 adds the three lengths, 8 is only one layer, and 12 counts only the front face ($4 \\times 3$).',
                'Satu lapis punya $4 \\times 2 = 8$ kubus dan ada 3 lapis: $8 \\times 3 = 24$. 9 menjumlahkan ketiga ukuran, 8 hanya satu lapis, dan 12 hanya menghitung sisi depan ($4 \\times 3$).',
              ),
              hint: L(
                'First count the cubes in one layer (look at the bottom), then count how many layers there are.',
                'Hitung dulu kubus dalam satu lapis (lihat bagian bawah), lalu hitung ada berapa lapis.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: how many unit cubes make this box?',
                'Coba bersama: berapa kubus satuan yang menyusun balok ini?',
              ),
              figure: {
                ...cuboid3d({ l: 4, w: 3, h: 3, grid: true }),
                caption: L(
                  'A box 4 cubes long, 3 cubes wide and 3 cubes high.',
                  'Balok dengan panjang 4 kubus, lebar 3 kubus, dan tinggi 3 kubus.',
                ),
              },
              template: {
                en: '4 \\times 3 = ___ \\text{ cubes in one layer},\\quad 12 \\times 3 = ___ \\text{ cubes}',
                id: '4 \\times 3 = ___ \\text{ kubus dalam satu lapis},\\quad 12 \\times 3 = ___ \\text{ kubus}',
              },
              blanks: ['12', '36'],
              explain: L(
                'One layer has $4 \\times 3 = 12$ cubes. There are 3 layers, so $12 \\times 3 = 36$ cubes.',
                'Satu lapis punya $4 \\times 3 = 12$ kubus. Ada 3 lapis, jadi $12 \\times 3 = 36$ kubus.',
              ),
              hint: L(
                'Find one layer first: length times width. Then multiply by the number of layers.',
                'Cari satu lapis dulu: panjang kali lebar. Lalu kalikan dengan banyak lapis.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Citra wants to fill a box that holds 18 unit cubes (3 long, 3 wide, 2 high). The picture shows the cubes she has already put in: a full bottom layer and some cubes on top. How many more cubes does she need?',
                'Citra ingin memenuhi sebuah kotak yang muat 18 kubus satuan (panjang 3, lebar 3, tinggi 2). Gambar menunjukkan kubus yang sudah ia masukkan: satu lapis bawah penuh dan beberapa kubus di atasnya. Berapa kubus lagi yang ia butuhkan?',
              ),
              figure: {
                ...stack([[2, 2, 1], [2, 1, 1], [1, 1, 1]]),
                caption: L(
                  'The cubes already in the box: a full bottom layer and 3 cubes on top of it.',
                  'Kubus yang sudah ada di dalam kotak: satu lapis bawah penuh dan 3 kubus di atasnya.',
                ),
              },
              options: [L('6 cubes', '6 kubus'), L('12 cubes', '12 kubus'), L('18 cubes', '18 kubus'), L('9 cubes', '9 kubus')],
              answer: 0,
              explain: L(
                'She has $9 + 3 = 12$ cubes, and the box holds 18, so she needs $18 - 12 = 6$ more. 12 is the number she already has, 18 is the whole box, and 9 is only the bottom layer.',
                'Ia sudah punya $9 + 3 = 12$ kubus, dan kotak itu muat 18, jadi ia butuh $18 - 12 = 6$ lagi. 12 adalah jumlah yang sudah ia punya, 18 adalah seluruh kotak, dan 9 hanya lapis bawah.',
              ),
              hint: L(
                'Count the cubes she has (do not forget the full bottom layer under the top ones), then see how far that is from 18.',
                'Hitung kubus yang sudah ia punya (jangan lupa lapis bawah yang penuh di bawah kubus di atas), lalu lihat selisihnya dengan 18.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              figure: {
                ...stack([[3, 2, 1], [2, 2, 1]]),
                caption: L(
                  'A stack of cubes with no gaps inside.',
                  'Sebuah tumpukan kubus tanpa celah di dalamnya.',
                ),
              },
              statements: [
                L('The stack has 11 cubes.', 'Tumpukan itu terdiri dari 11 kubus.'),
                L('The bottom layer has 6 cubes.', 'Lapis paling bawah terdiri dari 6 kubus.'),
                L('The top layer has 2 cubes.', 'Lapis paling atas terdiri dari 2 kubus.'),
                L(
                  'It needs 6 more cubes to make a full block 3 long, 2 wide and 3 high.',
                  'Dibutuhkan 6 kubus lagi untuk membuat blok penuh dengan panjang 3, lebar 2, dan tinggi 3.',
                ),
              ],
              answer: [true, true, false, false],
              explain: L(
                'The columns hold $3 + 2 + 1 + 2 + 2 + 1 = 11$ cubes, and all 6 squares have a cube on the bottom. The top layer is only 1 cube. A full block holds $3 \\times 2 \\times 3 = 18$, and $18 - 11 = 7$, not 6.',
                'Kolom-kolomnya berisi $3 + 2 + 1 + 2 + 2 + 1 = 11$ kubus, dan keenam petak punya kubus di lapis bawah. Lapis atas hanya 1 kubus. Blok penuh berisi $3 \\times 2 \\times 3 = 18$, dan $18 - 11 = 7$, bukan 6.',
              ),
              hint: L(
                'Count column by column. For a layer, ask how many columns are at least that tall.',
                'Hitung kolom demi kolom. Untuk satu lapis, tanyakan ada berapa kolom yang setidaknya setinggi itu.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Budi builds a block from unit cubes, 6 cubes long, 4 cubes wide and 3 cubes high, as in the picture. He has already used 50 cubes. How many more cubes does he need to finish the block?',
                'Budi menyusun sebuah blok dari kubus satuan dengan panjang 6 kubus, lebar 4 kubus, dan tinggi 3 kubus, seperti pada gambar. Ia sudah memakai 50 kubus. Berapa kubus lagi yang ia butuhkan untuk menyelesaikan blok itu?',
              ),
              figure: {
                ...cuboid3d({ l: 6, w: 4, h: 3, grid: true }),
                caption: L('The finished block: 6 by 4 by 3 cubes.', 'Blok yang sudah jadi: 6 kali 4 kali 3 kubus.'),
              },
              blanks: [{ answer: 22, after: { en: '\\text{ cubes}', id: '\\text{ kubus}' } }],
              hints: [
                L(
                  'You need two numbers: how many cubes the whole block has, and how many Budi already has.',
                  'Kamu butuh dua bilangan: berapa kubus seluruh blok, dan berapa yang sudah dimiliki Budi.',
                ),
                L(
                  'Find the cubes in one layer first (length times width), then multiply by the number of layers.',
                  'Cari dulu kubus dalam satu lapis (panjang kali lebar), lalu kalikan dengan banyak lapis.',
                ),
                L(
                  'One layer: 6 × 4. Whole block: that number × 3. Then subtract the 50 cubes he has already used.',
                  'Satu lapis: 6 × 4. Seluruh blok: bilangan itu × 3. Lalu kurangkan 50 kubus yang sudah ia pakai.',
                ),
              ],
              explain: L(
                'One layer has $6 \\times 4 = 24$ cubes and there are 3 layers: $24 \\times 3 = 72$. He still needs $72 - 50 = 22$ cubes.',
                'Satu lapis punya $6 \\times 4 = 24$ kubus dan ada 3 lapis: $24 \\times 3 = 72$. Ia masih butuh $72 - 50 = 22$ kubus.',
              ),
              solution: {
                en: ['6 \\times 4 = 24\\text{ cubes in one layer}', '24 \\times 3 = 72\\text{ cubes in all}', '72 - 50 = 22\\text{ cubes}'],
                id: ['6 \\times 4 = 24\\text{ kubus dalam satu lapis}', '24 \\times 3 = 72\\text{ kubus seluruhnya}', '72 - 50 = 22\\text{ kubus}'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m9-s1-p',
        runtime: 'math',
        title: L('Project: Cubes, Boxes and Nets', 'Proyek: Kubus, Balok, dan Jaring-jaring'),
        brief: L(
          'Four problems about the parts of a cube, a die net and a big cube made of small ones.',
          'Empat soal tentang unsur kubus, jaring-jaring dadu, dan sebuah kubus besar yang disusun dari kubus-kubus kecil.',
        ),
        requirements: [
          L('Know the faces, edges and corners of cubes and boxes.', 'Mengenal sisi, rusuk, dan titik sudut kubus dan balok.'),
          L('Fold nets in your head and count unit cubes.', 'Melipat jaring-jaring di dalam kepala dan menghitung kubus satuan.'),
        ],
        tasks: [
          {
            prompt: L(
              'How many edges and how many corners does a cube have?',
              'Berapa banyak rusuk dan berapa banyak titik sudut yang dimiliki sebuah kubus?',
            ),
            blanks: [
              { answer: 12, label: { en: '\\text{edges} =', id: '\\text{rusuk} =' } },
              { answer: 8, label: { en: '\\text{corners} =', id: '\\text{titik sudut} =' } },
            ],
            inline: true,
            solution: {
              en: ['\\text{edges}: 4 + 4 + 4 = 12', '\\text{corners}: 4 + 4 = 8'],
              id: ['\\text{rusuk}: 4 + 4 + 4 = 12', '\\text{titik sudut}: 4 + 4 = 8'],
            },
          },
          {
            prompt: L(
              'The net of a die is folded into a cube. The numbers 1 to 6 are on its squares. Which number is on the face opposite the face with 5?',
              'Jaring-jaring sebuah dadu dilipat menjadi kubus. Bilangan 1 sampai 6 tertulis pada persegi-persegi. Angka berapa yang ada di sisi yang berhadapan dengan sisi bertanda 5?',
            ),
            figure: {
              ...netPiece([[0, 1], [1, 1], [2, 1], [3, 1], [2, 2], [0, 0]], { tags: ['2', '1', '5', '6', '3', '4'] }),
              caption: L('A net of a die.', 'Jaring-jaring sebuah dadu.'),
            },
            blanks: [{ answer: 2 }],
            solution: {
              en: ['\\text{In the row of four squares, the 1st and 3rd are opposite and the 2nd and 4th are opposite.}', '5 \\text{ is the 3rd square, so the 1st square is opposite: } 2'],
              id: ['\\text{Pada deret empat persegi, persegi ke-1 dan ke-3 berhadapan, dan persegi ke-2 dan ke-4 berhadapan.}', '5 \\text{ adalah persegi ke-3, jadi persegi ke-1 berhadapan dengannya: } 2'],
            },
          },
          {
            prompt: L(
              'Fitri makes the frame of a cube from straws. Every edge is one straw of 9 cm. How many centimeters of straw does she use in all?',
              'Fitri membuat kerangka sebuah kubus dari sedotan. Setiap rusuk adalah satu sedotan sepanjang 9 cm. Berapa sentimeter sedotan yang ia pakai seluruhnya?',
            ),
            blanks: [{ answer: 108, after: '\\text{ cm}' }],
            solution: {
              en: ['\\text{a cube has 12 edges}', '12 \\times 9 = 108\\text{ cm}'],
              id: ['\\text{sebuah kubus punya 12 rusuk}', '12 \\times 9 = 108\\text{ cm}'],
            },
          },
          {
            prompt: L(
              'A big cube is built from 5 by 5 by 5 small unit cubes (125 in all). Pak Joko takes away every small cube that touches the outside, so only the cubes hidden in the middle are left. How many small cubes are left?',
              'Sebuah kubus besar disusun dari 5 kali 5 kali 5 kubus satuan kecil (seluruhnya 125). Pak Joko mengambil setiap kubus kecil yang menyentuh bagian luar, sehingga hanya kubus yang tersembunyi di tengah yang tersisa. Berapa kubus kecil yang tersisa?',
            ),
            figure: {
              ...cuboid3d({ l: 5, w: 5, h: 5, grid: true }),
              caption: L('A big cube made of 5 by 5 by 5 small cubes.', 'Kubus besar dari 5 kali 5 kali 5 kubus kecil.'),
            },
            blanks: [{ answer: 27, after: { en: '\\text{ cubes}', id: '\\text{ kubus}' } }],
            solution: {
              en: ['\\text{removing the outside layer takes 1 cube off each end of every edge: } 5 - 2 = 3', '3 \\times 3 \\times 3 = 27\\text{ cubes}'],
              id: ['\\text{mengambil lapisan luar berarti mengurangi 1 kubus di tiap ujung setiap rusuk: } 5 - 2 = 3', '3 \\times 3 \\times 3 = 27\\text{ kubus}'],
            },
          },
        ],
        hints: [
          L(
            'A cube has 6 faces, 12 edges and 8 corners. All its edges are the same length.',
            'Kubus punya 6 sisi, 12 rusuk, dan 8 titik sudut. Semua rusuknya sama panjang.',
          ),
          L(
            'For a net, pick one square as the bottom and fold the others up. Faces that are opposite never touch.',
            'Untuk jaring-jaring, pilih satu persegi sebagai alas lalu lipat persegi lain ke atas. Sisi yang berhadapan tidak pernah bersentuhan.',
          ),
          L(
            'For the big cube, think about one row of 5 cubes: how many of them are NOT at an end? Then think about the same in all three directions.',
            'Untuk kubus besar, bayangkan satu baris berisi 5 kubus: ada berapa yang BUKAN di ujung? Lalu pikirkan hal yang sama pada ketiga arah.',
          ),
        ],
        xp: 50,
      },
    },
    /* ================================================================== S2 — volume */
    {
      id: 'tka-m9-s2',
      title: L('Volume', 'Volume'),
      summary: L(
        'Volume is the number of unit cubes that fill a solid. You will find the volume of cubes, boxes and combined solids, link liters to cubic centimeters, and solve water-level problems.',
        'Volume adalah banyaknya kubus satuan yang memenuhi sebuah bangun ruang. Kamu akan mencari volume kubus, balok, dan bangun ruang gabungan, menghubungkan liter dengan sentimeter kubik, dan menyelesaikan soal tinggi air.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m9-s2-l1',
          title: L('Volume of Cubes and Boxes', 'Volume Kubus dan Balok'),
          goal: L(
            'You can find the volume of a cube and a box, find a missing edge, and change between cubic centimeters and liters.',
            'Kamu bisa mencari volume kubus dan balok, mencari rusuk yang belum diketahui, dan mengubah antara sentimeter kubik dan liter.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: How Much Space Does It Take?', 'Ayo Amati: Seberapa Besar Ruang yang Ditempati?'),
              body: L(
                'Dewi fills a small box with sugar cubes. Her box is 4 cubes long, 3 cubes wide and 2 cubes high, and exactly 24 sugar cubes fit inside.\n\nThe amount of space that a solid takes up is its **volume**. We measure volume by counting how many unit cubes fit inside. A unit cube with edges of 1 cm has a volume of **1 cubic centimeter**, written $1\\text{ cm}^3$.\n\nSo the box has a volume of $24\\text{ cm}^3$. This is the layer idea from the last lesson: **volume = cubes in one layer × number of layers**.',
                'Dewi mengisi sebuah kotak kecil dengan gula batu. Kotaknya panjangnya 4 kubus, lebarnya 3 kubus, dan tingginya 2 kubus, dan tepat 24 gula batu muat di dalamnya.\n\nBesar ruang yang ditempati sebuah bangun ruang disebut **volume**. Kita mengukur volume dengan menghitung berapa kubus satuan yang muat di dalamnya. Kubus satuan dengan rusuk 1 cm punya volume **1 sentimeter kubik**, ditulis $1\\text{ cm}^3$.\n\nJadi kotak itu bervolume $24\\text{ cm}^3$. Ini adalah gagasan lapisan dari pelajaran sebelumnya: **volume = kubus dalam satu lapis × banyak lapis**.',
              ),
              figure: {
                ...cuboid3d({ l: 4, w: 3, h: 2, grid: true, labels: { l: '4 cm', w: '3 cm', h: '2 cm' } }),
                caption: L(
                  'A box filled with cubes of 1 cm: 4 by 3 by 2, which is 24 cubes.',
                  'Sebuah kotak yang diisi kubus 1 cm: 4 kali 3 kali 2, yaitu 24 kubus.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Volume of a Box and a Cube', 'Contoh Bertahap: Volume Balok dan Kubus'),
              body: L(
                'A box is 6 cm long, 4 cm wide and 3 cm high. What is its volume?\n\n1. Step 1: Find the bottom layer. A layer 1 cm high has $6 \\times 4 = 24$ cubes, so its volume is $24\\text{ cm}^3$.\n2. Step 2: Count the layers. The box is 3 cm high, so there are 3 layers.\n3. Step 3: Multiply: $24 \\times 3 = 72$. The volume is $72\\text{ cm}^3$.\n4. Step 4: Write it as one rule: volume = length × width × height.\n\nA cube has three equal edges, so for a cube with an edge of 4 cm the volume is $4 \\times 4 \\times 4 = 64\\text{ cm}^3$.\n\n**Remember:**\n\n| Solid | Volume | Unit |\n| --- | --- | --- |\n| Box | length × width × height | cm³ or m³ |\n| Cube | edge × edge × edge | cm³ or m³ |',
                'Sebuah balok panjangnya 6 cm, lebarnya 4 cm, dan tingginya 3 cm. Berapa volumenya?\n\n1. Langkah 1: Cari lapisan paling bawah. Satu lapis setinggi 1 cm berisi $6 \\times 4 = 24$ kubus, jadi volumenya $24\\text{ cm}^3$.\n2. Langkah 2: Hitung lapisannya. Balok itu tingginya 3 cm, jadi ada 3 lapis.\n3. Langkah 3: Kalikan: $24 \\times 3 = 72$. Volumenya $72\\text{ cm}^3$.\n4. Langkah 4: Tulis sebagai satu aturan: volume = panjang × lebar × tinggi.\n\nKubus punya tiga rusuk yang sama panjang, jadi untuk kubus dengan rusuk 4 cm volumenya $4 \\times 4 \\times 4 = 64\\text{ cm}^3$.\n\n**Ingat:**\n\n| Bangun | Volume | Satuan |\n| --- | --- | --- |\n| Balok | panjang × lebar × tinggi | cm³ atau m³ |\n| Kubus | rusuk × rusuk × rusuk | cm³ atau m³ |',
              ),
              figure: {
                ...cuboid3d({ l: 6, w: 4, h: 3, labels: { l: '6 cm', w: '4 cm', h: '3 cm' } }),
                caption: L('A box 6 cm long, 4 cm wide and 3 cm high.', 'Balok dengan panjang 6 cm, lebar 4 cm, dan tinggi 3 cm.'),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Liters and Cubic Centimeters', 'Contoh Bertahap: Liter dan Sentimeter Kubik'),
              body: L(
                'A glass tank is 50 cm long, 30 cm wide and 20 cm high. How many liters of water does it hold when it is full?\n\n1. Step 1: Find the volume in cubic centimeters: $50 \\times 30 \\times 20 = 30\\,000\\text{ cm}^3$.\n2. Step 2: Use the link between the units. A box 10 cm long, 10 cm wide and 10 cm high has a volume of $10 \\times 10 \\times 10 = 1\\,000\\text{ cm}^3$, and it holds exactly **1 liter**.\n3. Step 3: Divide: $30\\,000 \\div 1\\,000 = 30$.\n4. Step 4: The tank holds 30 liters.\n\n**Remember:**\n\n- 1 liter = $1\\,000\\text{ cm}^3$, so 1 ml = $1\\text{ cm}^3$.\n- A cube with edges of 1 m has a volume of $1\\text{ m}^3$, and it holds 1,000 liters.',
                'Sebuah bak kaca panjangnya 50 cm, lebarnya 30 cm, dan tingginya 20 cm. Berapa liter air yang muat saat bak itu penuh?\n\n1. Langkah 1: Cari volumenya dalam sentimeter kubik: $50 \\times 30 \\times 20 = 30\\,000\\text{ cm}^3$.\n2. Langkah 2: Pakai hubungan antarsatuan. Sebuah kotak dengan panjang 10 cm, lebar 10 cm, dan tinggi 10 cm punya volume $10 \\times 10 \\times 10 = 1\\,000\\text{ cm}^3$, dan tepat memuat **1 liter**.\n3. Langkah 3: Bagi: $30\\,000 \\div 1\\,000 = 30$.\n4. Langkah 4: Bak itu memuat 30 liter.\n\n**Ingat:**\n\n- 1 liter = $1\\,000\\text{ cm}^3$, jadi 1 ml = $1\\text{ cm}^3$.\n- Kubus dengan rusuk 1 m punya volume $1\\text{ m}^3$, dan memuat 1.000 liter.',
              ),
              figure: {
                ...cuboid3d({ l: 50, w: 30, h: 20, labels: { l: '50 cm', w: '30 cm', h: '20 cm' } }),
                caption: L('A glass tank 50 cm by 30 cm by 20 cm.', 'Bak kaca 50 cm kali 30 cm kali 20 cm.'),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Volume Mistakes', 'Awas, Jebakan!: Kesalahan pada Volume'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| ❌ A box 6 by 4 by 3 has volume $6 + 4 + 3 = 13\\text{ cm}^3$. | Multiply the three edges: $6 \\times 4 \\times 3 = 72\\text{ cm}^3$. |\n| ❌ A cube with an edge of 5 cm has volume $5 \\times 3 = 15\\text{ cm}^3$. | A cube has three equal edges: $5 \\times 5 \\times 5 = 125\\text{ cm}^3$. |\n| ❌ 1 liter = $100\\text{ cm}^3$. | 1 liter = $1\\,000\\text{ cm}^3$, the volume of a box 10 by 10 by 10. |',
                '| Salah | Benar |\n| --- | --- |\n| ❌ Balok 6 kali 4 kali 3 bervolume $6 + 4 + 3 = 13\\text{ cm}^3$. | Kalikan ketiga rusuknya: $6 \\times 4 \\times 3 = 72\\text{ cm}^3$. |\n| ❌ Kubus dengan rusuk 5 cm bervolume $5 \\times 3 = 15\\text{ cm}^3$. | Kubus punya tiga rusuk yang sama: $5 \\times 5 \\times 5 = 125\\text{ cm}^3$. |\n| ❌ 1 liter = $100\\text{ cm}^3$. | 1 liter = $1\\,000\\text{ cm}^3$, volume sebuah kotak 10 kali 10 kali 10. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L('What is the volume of this box?', 'Berapa volume balok ini?'),
              figure: {
                ...cuboid3d({ l: 5, w: 2, h: 3, labels: { l: '5 cm', w: '2 cm', h: '3 cm' } }),
                caption: L('A box 5 cm long, 2 cm wide and 3 cm high.', 'Balok dengan panjang 5 cm, lebar 2 cm, dan tinggi 3 cm.'),
              },
              options: [L('30 cm³', '30 cm³'), L('10 cm³', '10 cm³'), L('15 cm³', '15 cm³'), L('6 cm³', '6 cm³')],
              answer: 0,
              explain: L(
                '$5 \\times 2 \\times 3 = 30$. 10 adds the three edges, 15 leaves out the width, and 6 leaves out the length.',
                '$5 \\times 2 \\times 3 = 30$. 10 menjumlahkan ketiga rusuk, 15 melupakan lebar, dan 6 melupakan panjang.',
              ),
              hint: L(
                'Volume needs all three edges, and they are multiplied, not added.',
                'Volume memakai ketiga rusuk, dan ketiganya dikalikan, bukan dijumlahkan.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: find the volume of this box.',
                'Coba bersama: carilah volume balok ini.',
              ),
              figure: {
                ...cuboid3d({ l: 8, w: 5, h: 4, labels: { l: '8 cm', w: '5 cm', h: '4 cm' } }),
                caption: L('A box 8 cm long, 5 cm wide and 4 cm high.', 'Balok dengan panjang 8 cm, lebar 5 cm, dan tinggi 4 cm.'),
              },
              template: '8 \\times 5 \\times 4 = ___ \\times 4 = ___ \\text{ cm}^3',
              blanks: ['40', '160'],
              explain: L(
                'The bottom layer is $8 \\times 5 = 40$, and with 4 layers the volume is $40 \\times 4 = 160\\text{ cm}^3$.',
                'Lapis bawah adalah $8 \\times 5 = 40$, dan dengan 4 lapis volumenya $40 \\times 4 = 160\\text{ cm}^3$.',
              ),
              hint: L(
                'Multiply the length and the width first, then multiply by the height.',
                'Kalikan dulu panjang dan lebar, lalu kalikan dengan tinggi.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'A box has a volume of 60 cm³. Its base is 5 cm long and 4 cm wide. How high is the box?',
                'Sebuah balok bervolume 60 cm³. Alasnya panjang 5 cm dan lebar 4 cm. Berapa tinggi balok itu?',
              ),
              figure: {
                ...cuboid3d({ l: 5, w: 4, h: 3, labels: { l: '5 cm', w: '4 cm', h: '?' } }),
                caption: L('A box with a base of 5 cm by 4 cm. The height is not known.', 'Balok dengan alas 5 cm kali 4 cm. Tingginya belum diketahui.'),
              },
              options: [L('3 cm', '3 cm'), L('12 cm', '12 cm'), L('15 cm', '15 cm'), L('51 cm', '51 cm')],
              answer: 0,
              explain: L(
                'The bottom layer is $5 \\times 4 = 20\\text{ cm}^3$, so the height is $60 \\div 20 = 3$ cm. 12 and 15 divide by only one edge, and 51 takes the edges away from the volume.',
                'Lapis bawah adalah $5 \\times 4 = 20\\text{ cm}^3$, jadi tingginya $60 \\div 20 = 3$ cm. 12 dan 15 hanya membagi dengan satu rusuk, dan 51 mengurangkan rusuk-rusuk dari volumenya.',
              ),
              hint: L(
                'Volume = length × width × height, so the height is what is left when you divide the volume by the base layer.',
                'Volume = panjang × lebar × tinggi, jadi tingginya adalah hasil bagi volume dengan lapisan alas.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L('Choose the two true statements.', 'Pilih dua pernyataan yang benar.'),
              options: [
                L(
                  'A box 10 cm long, 10 cm wide and 10 cm high has a volume of 1,000 cm³.',
                  'Balok dengan panjang 10 cm, lebar 10 cm, dan tinggi 10 cm bervolume 1.000 cm³.',
                ),
                L(
                  'A tank with a volume of 1,000 cm³ holds 1 liter of water.',
                  'Bak bervolume 1.000 cm³ memuat 1 liter air.',
                ),
                L(
                  'A cube with an edge of 3 cm has a volume of 9 cm³.',
                  'Kubus dengan rusuk 3 cm bervolume 9 cm³.',
                ),
                L(
                  'A box 4 cm long, 3 cm wide and 2 cm high has a volume of 9 cm³.',
                  'Balok dengan panjang 4 cm, lebar 3 cm, dan tinggi 2 cm bervolume 9 cm³.',
                ),
                L(
                  'A tank with a volume of 5,000 cm³ holds 50 liters of water.',
                  'Bak bervolume 5.000 cm³ memuat 50 liter air.',
                ),
              ],
              answer: [0, 1],
              explain: L(
                '$10 \\times 10 \\times 10 = 1\\,000\\text{ cm}^3$, which is exactly 1 liter. The others are wrong: the cube has $3 \\times 3 \\times 3 = 27\\text{ cm}^3$, the box has $4 \\times 3 \\times 2 = 24\\text{ cm}^3$, and $5\\,000\\text{ cm}^3$ is 5 liters.',
                '$10 \\times 10 \\times 10 = 1\\,000\\text{ cm}^3$, yaitu tepat 1 liter. Yang lain salah: kubus itu bervolume $3 \\times 3 \\times 3 = 27\\text{ cm}^3$, balok itu $4 \\times 3 \\times 2 = 24\\text{ cm}^3$, dan $5\\,000\\text{ cm}^3$ adalah 5 liter.',
              ),
              hint: L(
                'Work each one out: multiply three equal edges for a cube, three edges for a box, and remember how many cm³ make a liter.',
                'Hitung satu per satu: kalikan tiga rusuk yang sama untuk kubus, tiga rusuk untuk balok, dan ingat berapa cm³ yang membentuk satu liter.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'An aquarium is 60 cm long, 40 cm wide and 30 cm high. How many liters of water does it hold when it is full?',
                'Sebuah akuarium panjangnya 60 cm, lebarnya 40 cm, dan tingginya 30 cm. Berapa liter air yang muat saat akuarium itu penuh?',
              ),
              figure: {
                ...cuboid3d({ l: 60, w: 40, h: 30, labels: { l: '60 cm', w: '40 cm', h: '30 cm' } }),
                caption: L('An aquarium 60 cm by 40 cm by 30 cm.', 'Akuarium 60 cm kali 40 cm kali 30 cm.'),
              },
              blanks: [{ answer: 72, after: { en: '\\text{ liters}', id: '\\text{ liter}' } }],
              hints: [
                L(
                  'First find the volume of the aquarium in cubic centimeters.',
                  'Cari dulu volume akuarium dalam sentimeter kubik.',
                ),
                L(
                  'Multiply length × width × height. Then change cm³ into liters: 1 liter is $1\\,000\\text{ cm}^3$.',
                  'Kalikan panjang × lebar × tinggi. Lalu ubah cm³ menjadi liter: 1 liter adalah $1\\,000\\text{ cm}^3$.',
                ),
                L(
                  'Volume: 60 × 40 × 30. Then divide that number by 1,000.',
                  'Volume: 60 × 40 × 30. Lalu bagi bilangan itu dengan 1.000.',
                ),
              ],
              explain: L(
                '$60 \\times 40 \\times 30 = 72\\,000\\text{ cm}^3$, and $72\\,000 \\div 1\\,000 = 72$ liters.',
                '$60 \\times 40 \\times 30 = 72\\,000\\text{ cm}^3$, dan $72\\,000 \\div 1\\,000 = 72$ liter.',
              ),
              solution: {
                en: ['60 \\times 40 \\times 30 = 72\\,000\\text{ cm}^3', '72\\,000 \\div 1\\,000 = 72\\text{ liters}'],
                id: ['60 \\times 40 \\times 30 = 72\\,000\\text{ cm}^3', '72\\,000 \\div 1\\,000 = 72\\text{ liter}'],
              },
            },
          ],
        },
        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m9-s2-l2',
          title: L('Volume of Combined Solids', 'Volume Bangun Ruang Gabungan'),
          goal: L(
            'You can find the volume of a solid made of several boxes by adding the parts or taking away a missing corner, count the volume of a stack of cubes, and work out how deep water is in a tank.',
            'Kamu bisa mencari volume bangun ruang yang tersusun dari beberapa balok dengan menjumlahkan bagian-bagiannya atau mengurangi sudut yang hilang, menghitung volume tumpukan kubus, dan menentukan kedalaman air dalam sebuah bak.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: A Toy Made of Two Boxes', 'Ayo Amati: Mainan dari Dua Balok'),
              body: L(
                'Dewi has a toy that looks like two steps. It is built from small cubes, each 1 cm on every side. The tall part is 3 cubes long, 3 cubes wide and 4 cubes high, and the low part is 3 long, 3 wide and 2 high.\n\nA solid made of two or more boxes joined together is a **combined solid**. To find its volume, **cut it into boxes**, find the volume of each box, and **add**.\n\n- Tall part: $3 \\times 3 \\times 4 = 36$ cubes.\n- Low part: $3 \\times 3 \\times 2 = 18$ cubes.\n- Together: $36 + 18 = 54$ cubes, so the toy has a volume of $54\\text{ cm}^3$.',
                'Dewi punya mainan yang bentuknya seperti dua anak tangga. Mainan itu disusun dari kubus-kubus kecil, masing-masing 1 cm pada setiap sisinya. Bagian yang tinggi panjangnya 3 kubus, lebarnya 3 kubus, dan tingginya 4 kubus, sedangkan bagian yang rendah panjangnya 3, lebarnya 3, dan tingginya 2.\n\nBangun ruang yang terdiri dari dua balok atau lebih yang disambung disebut **bangun ruang gabungan**. Untuk mencari volumenya, **potong menjadi balok-balok**, cari volume tiap balok, lalu **jumlahkan**.\n\n- Bagian tinggi: $3 \\times 3 \\times 4 = 36$ kubus.\n- Bagian rendah: $3 \\times 3 \\times 2 = 18$ kubus.\n- Jumlahnya: $36 + 18 = 54$ kubus, jadi mainan itu bervolume $54\\text{ cm}^3$.',
              ),
              figure: {
                ...cubeStack3d([[4, 4, 4, 2, 2, 2], [4, 4, 4, 2, 2, 2], [4, 4, 4, 2, 2, 2]]),
                caption: L(
                  'The toy: a tall part 4 cubes high and a low part 2 cubes high.',
                  'Mainan itu: bagian tinggi setinggi 4 kubus dan bagian rendah setinggi 2 kubus.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Cutting a Solid into Boxes', 'Contoh Bertahap: Memotong Bangun Ruang menjadi Balok'),
              body: L(
                'Citra has a wooden block with a step. It is 8 cm long and 4 cm wide. The tall part is 3 cm long and 5 cm high, and the low part is 2 cm high. What is the volume of the whole block?\n\n1. Step 1: Cut the block between the tall part and the low part. Now there are two boxes.\n2. Step 2: The tall box is 3 cm long, 4 cm wide and 5 cm high: $3 \\times 4 \\times 5 = 60\\text{ cm}^3$.\n3. Step 3: The low box is what is left of the length: $8 - 3 = 5$ cm long. So $5 \\times 4 \\times 2 = 40\\text{ cm}^3$.\n4. Step 4: Add the two boxes: $60 + 40 = 100\\text{ cm}^3$.\n5. Step 5: Check another way. Fill the missing corner to get one big box: $8 \\times 4 \\times 5 = 160\\text{ cm}^3$. The missing corner is $5 \\times 4 \\times 3 = 60\\text{ cm}^3$, because its height is $5 - 2 = 3$ cm. Take it away: $160 - 60 = 100\\text{ cm}^3$.\n\n**Remember:**\n\n- **Add**: cut the solid into boxes that do not overlap, then add their volumes.\n- **Subtract**: fill the missing corner to make one big box, then take the corner away.\n- Both ways give the same volume, so use one to check the other.',
                'Citra punya balok kayu yang berundak. Panjangnya 8 cm dan lebarnya 4 cm. Bagian yang tinggi panjangnya 3 cm dan tingginya 5 cm, sedangkan bagian yang rendah tingginya 2 cm. Berapa volume seluruh balok kayu itu?\n\n1. Langkah 1: Potong balok kayu itu di antara bagian yang tinggi dan bagian yang rendah. Sekarang ada dua balok.\n2. Langkah 2: Balok yang tinggi panjangnya 3 cm, lebarnya 4 cm, dan tingginya 5 cm: $3 \\times 4 \\times 5 = 60\\text{ cm}^3$.\n3. Langkah 3: Balok yang rendah panjangnya sisa dari panjang seluruhnya: $8 - 3 = 5$ cm. Jadi $5 \\times 4 \\times 2 = 40\\text{ cm}^3$.\n4. Langkah 4: Jumlahkan kedua balok: $60 + 40 = 100\\text{ cm}^3$.\n5. Langkah 5: Periksa dengan cara lain. Isi sudut yang hilang sehingga menjadi satu balok besar: $8 \\times 4 \\times 5 = 160\\text{ cm}^3$. Sudut yang hilang itu bervolume $5 \\times 4 \\times 3 = 60\\text{ cm}^3$, karena tingginya $5 - 2 = 3$ cm. Kurangkan: $160 - 60 = 100\\text{ cm}^3$.\n\n**Ingat:**\n\n- **Jumlahkan**: potong bangun ruang menjadi balok-balok yang tidak saling menumpuk, lalu jumlahkan volumenya.\n- **Kurangkan**: isi sudut yang hilang sehingga menjadi satu balok besar, lalu kurangkan sudut itu.\n- Kedua cara menghasilkan volume yang sama, jadi pakai salah satu untuk memeriksa yang lain.',
              ),
              figure: {
                ...boxes3d(
                  [[0, 0, 0, 3, 4, 5], [3, 0, 0, 8, 4, 2]],
                  [
                    { at: [4, 5, -1], text: '8 cm' },
                    { at: [9, 2, -1], text: '4 cm' },
                    { at: [0, 5, 2.5], text: '5 cm' },
                    { at: [9, 5, 1], text: '2 cm' },
                    { at: [1.5, 4, 5.8], text: '3 cm' },
                  ],
                ),
                caption: L(
                  'The wooden block: 8 cm long, 4 cm wide, with a tall part 5 cm high and a low part 2 cm high.',
                  'Balok kayu itu: panjang 8 cm, lebar 4 cm, dengan bagian tinggi setinggi 5 cm dan bagian rendah setinggi 2 cm.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Water in a Tank', 'Contoh Bertahap: Air di dalam Bak'),
              body: L(
                'Ani pours 18 liters of water into an empty tank. The tank is 40 cm long, 30 cm wide and 25 cm high. How deep is the water?\n\n1. Step 1: Change liters to cubic centimeters: $18 \\times 1\\,000 = 18\\,000\\text{ cm}^3$.\n2. Step 2: The water forms a box with the same base as the tank: $40 \\times 30 = 1\\,200\\text{ cm}^2$.\n3. Step 3: Volume = base × depth, so depth = volume ÷ base: $18\\,000 \\div 1\\,200 = 15$ cm.\n4. Step 4: Check: $40 \\times 30 \\times 15 = 18\\,000$. The tank is 25 cm high, so 15 cm of water fits.\n\n**Remember:**\n\n- Water takes the shape of a box with the same base as the tank.\n- Depth of the water = volume of the water ÷ area of the base, with the volume in cm³.\n- 1 liter = $1\\,000\\text{ cm}^3$.',
                'Ani menuangkan 18 liter air ke dalam bak yang kosong. Bak itu panjangnya 40 cm, lebarnya 30 cm, dan tingginya 25 cm. Berapa dalam air di dalam bak?\n\n1. Langkah 1: Ubah liter menjadi sentimeter kubik: $18 \\times 1\\,000 = 18\\,000\\text{ cm}^3$.\n2. Langkah 2: Air membentuk balok dengan alas yang sama dengan alas bak: $40 \\times 30 = 1\\,200\\text{ cm}^2$.\n3. Langkah 3: Volume = alas × dalam air, jadi dalam air = volume ÷ alas: $18\\,000 \\div 1\\,200 = 15$ cm.\n4. Langkah 4: Periksa: $40 \\times 30 \\times 15 = 18\\,000$. Bak itu tingginya 25 cm, jadi air setinggi 15 cm muat.\n\n**Ingat:**\n\n- Air berbentuk balok dengan alas yang sama dengan alas bak.\n- Kedalaman air = volume air ÷ luas alas, dengan volume dalam cm³.\n- 1 liter = $1\\,000\\text{ cm}^3$.',
              ),
              figure: {
                ...cuboid3d({ l: 40, w: 30, h: 25, labels: { l: '40 cm', w: '30 cm', h: '25 cm' } }),
                caption: L('The tank: 40 cm long, 30 cm wide and 25 cm high.', 'Bak itu: panjang 40 cm, lebar 30 cm, dan tinggi 25 cm.'),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Combined Solids and Water', 'Awas, Jebakan!: Bangun Gabungan dan Air'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| ❌ Use the whole length for both parts of the block: $8 \\times 4 \\times 5 + 8 \\times 4 \\times 2$. | The parts must not overlap. The low part is only $8 - 3 = 5$ cm long. |\n| ❌ Fill the missing corner and then add it: $160 + 60$. | The corner is not part of the block. Take it away: $160 - 60 = 100$. |\n| ❌ 18 liters of water is $18\\text{ cm}^3$, so the depth is $18 \\div 1\\,200$. | 18 liters is $18\\,000\\text{ cm}^3$. Change the unit first, then divide by the base. |',
                '| Salah | Benar |\n| --- | --- |\n| ❌ Memakai seluruh panjang untuk kedua bagian balok kayu: $8 \\times 4 \\times 5 + 8 \\times 4 \\times 2$. | Bagian-bagiannya tidak boleh saling menumpuk. Bagian yang rendah panjangnya hanya $8 - 3 = 5$ cm. |\n| ❌ Mengisi sudut yang hilang lalu menjumlahkannya: $160 + 60$. | Sudut itu bukan bagian dari balok kayu. Kurangkan: $160 - 60 = 100$. |\n| ❌ 18 liter air sama dengan $18\\text{ cm}^3$, jadi dalam air $18 \\div 1\\,200$. | 18 liter sama dengan $18\\,000\\text{ cm}^3$. Ubah dulu satuannya, baru bagi dengan luas alas. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Each small cube has a volume of $1\\text{ cm}^3$. There are no gaps under the top cubes. What is the volume of this stack?',
                'Setiap kubus kecil bervolume $1\\text{ cm}^3$. Tidak ada rongga di bawah kubus-kubus teratas. Berapa volume tumpukan ini?',
              ),
              figure: {
                ...cubeStack3d([[4, 3, 2], [3, 3, 1], [2, 1, 1]]),
                caption: L('A stack of unit cubes.', 'Sebuah tumpukan kubus satuan.'),
              },
              options: [L('$20\\text{ cm}^3$', '$20\\text{ cm}^3$'), L('$36\\text{ cm}^3$', '$36\\text{ cm}^3$'), L('$9\\text{ cm}^3$', '$9\\text{ cm}^3$'), L('$29\\text{ cm}^3$', '$29\\text{ cm}^3$')],
              answer: 0,
              explain: L(
                'The volume is the number of cubes. The three rows hold $4 + 3 + 2 = 9$, $3 + 3 + 1 = 7$ and $2 + 1 + 1 = 4$ cubes, and $9 + 7 + 4 = 20$. 36 would fill all the gaps to make a full block, 9 counts only the squares on top, and 29 counts the top squares twice.',
                'Volume adalah banyaknya kubus. Ketiga baris berisi $4 + 3 + 2 = 9$, $3 + 3 + 1 = 7$, dan $2 + 1 + 1 = 4$ kubus, dan $9 + 7 + 4 = 20$. 36 mengisi semua celah sehingga menjadi blok penuh, 9 hanya menghitung petak di atas, dan 29 menghitung petak di atas dua kali.',
              ),
              hint: L(
                'Volume is just the number of unit cubes. Count column by column, and remember the cubes under the top ones.',
                'Volume adalah banyaknya kubus satuan. Hitung kolom demi kolom, dan ingat kubus yang ada di bawah kubus teratas.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: Eko has a block with a step. It is 6 cm long and 4 cm wide. The tall part is 2 cm long and 5 cm high, and the low part is 2 cm high. Find the volume.',
                'Coba bersama: Eko punya balok berundak. Panjangnya 6 cm dan lebarnya 4 cm. Bagian yang tinggi panjangnya 2 cm dan tingginya 5 cm, sedangkan bagian yang rendah tingginya 2 cm. Carilah volumenya.',
              ),
              figure: {
                ...boxes3d(
                  [[0, 0, 0, 2, 4, 5], [2, 0, 0, 6, 4, 2]],
                  [
                    { at: [3, 5, -1], text: '6 cm' },
                    { at: [7, 2, -1], text: '4 cm' },
                    { at: [0, 5, 2.5], text: '5 cm' },
                    { at: [7, 5, 1], text: '2 cm' },
                    { at: [1, 4, 5.8], text: '2 cm' },
                  ],
                ),
                caption: L('The block with a step: 6 cm long, 4 cm wide.', 'Balok berundak: panjang 6 cm, lebar 4 cm.'),
              },
              template: {
                en: '\\text{tall part: } 2 \\times 4 \\times 5 = 40 \\text{ cm}^3,\\quad \\text{low part: } 4 \\times 4 \\times 2 = ___ \\text{ cm}^3,\\quad \\text{whole block: } 40 + ___ = ___ \\text{ cm}^3',
                id: '\\text{bagian tinggi: } 2 \\times 4 \\times 5 = 40 \\text{ cm}^3,\\quad \\text{bagian rendah: } 4 \\times 4 \\times 2 = ___ \\text{ cm}^3,\\quad \\text{seluruh balok: } 40 + ___ = ___ \\text{ cm}^3',
              },
              blanks: ['32', '32', '72'],
              explain: L(
                'The low part is $6 - 2 = 4$ cm long, so its volume is $4 \\times 4 \\times 2 = 32\\text{ cm}^3$. Together with the tall part: $40 + 32 = 72\\text{ cm}^3$.',
                'Bagian yang rendah panjangnya $6 - 2 = 4$ cm, jadi volumenya $4 \\times 4 \\times 2 = 32\\text{ cm}^3$. Bersama bagian yang tinggi: $40 + 32 = 72\\text{ cm}^3$.',
              ),
              hint: L(
                'The low part is not 6 cm long: the tall part takes 2 cm of the length. Find the volume of the low part, then add.',
                'Bagian yang rendah panjangnya bukan 6 cm: bagian yang tinggi memakai 2 cm dari panjangnya. Cari volume bagian yang rendah, lalu jumlahkan.',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              figure: {
                ...boxes3d(
                  [[0, 0, 0, 2, 3, 4], [2, 0, 0, 6, 3, 2]],
                  [
                    { at: [3, 4, -1], text: '6 cm' },
                    { at: [7, 1.5, -1], text: '3 cm' },
                    { at: [0, 4, 2], text: '4 cm' },
                    { at: [7, 4, 1], text: '2 cm' },
                    { at: [1, 3, 4.8], text: '2 cm' },
                  ],
                ),
                caption: L('A solid made of a tall box and a low box.', 'Sebuah bangun ruang yang terdiri dari balok tinggi dan balok rendah.'),
              },
              statements: [
                L('The volume of the solid is $48\\text{ cm}^3$.', 'Volume bangun ruang itu adalah $48\\text{ cm}^3$.'),
                L(
                  'The volume is $6 \\times 3 \\times 4 = 72\\text{ cm}^3$.',
                  'Volumenya adalah $6 \\times 3 \\times 4 = 72\\text{ cm}^3$.',
                ),
                L(
                  'The missing corner is a box 4 cm long, 3 cm wide and 2 cm high.',
                  'Sudut yang hilang adalah balok yang panjangnya 4 cm, lebarnya 3 cm, dan tingginya 2 cm.',
                ),
                L(
                  'The low part is 6 cm long, so its volume is $6 \\times 3 \\times 2 = 36\\text{ cm}^3$.',
                  'Bagian yang rendah panjangnya 6 cm, jadi volumenya $6 \\times 3 \\times 2 = 36\\text{ cm}^3$.',
                ),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The tall part is $2 \\times 3 \\times 4 = 24$ and the low part is $4 \\times 3 \\times 2 = 24$, so the volume is $48\\text{ cm}^3$. The number 72 is the volume of the big box around the solid, with the missing corner still filled in. That corner is $4 \\times 3 \\times 2 = 24$, and $72 - 24 = 48$. The low part is only $6 - 2 = 4$ cm long.',
                'Bagian yang tinggi adalah $2 \\times 3 \\times 4 = 24$ dan bagian yang rendah adalah $4 \\times 3 \\times 2 = 24$, jadi volumenya $48\\text{ cm}^3$. Bilangan 72 adalah volume balok besar yang mengelilingi bangun itu, dengan sudut yang hilang masih terisi. Sudut itu $4 \\times 3 \\times 2 = 24$, dan $72 - 24 = 48$. Bagian yang rendah panjangnya hanya $6 - 2 = 4$ cm.',
              ),
              hint: L(
                'Work out the volume in two ways, by adding two boxes and by taking the corner away from the big box. Then check each statement.',
                'Hitung volumenya dengan dua cara, yaitu menjumlahkan dua balok dan mengurangi sudut dari balok besar. Lalu periksa tiap pernyataan.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'A tank is 40 cm long, 25 cm wide and 20 cm high. Choose the two true statements.',
                'Sebuah bak panjangnya 40 cm, lebarnya 25 cm, dan tingginya 20 cm. Pilih dua pernyataan yang benar.',
              ),
              figure: {
                ...cuboid3d({ l: 40, w: 25, h: 20, labels: { l: '40 cm', w: '25 cm', h: '20 cm' } }),
                caption: L('The tank: 40 cm by 25 cm by 20 cm.', 'Bak itu: 40 cm kali 25 cm kali 20 cm.'),
              },
              options: [
                L('The tank holds 20 liters when it is full.', 'Bak itu memuat 20 liter saat penuh.'),
                L('10 liters of water make the water 10 cm deep.', '10 liter air membuat air setinggi 10 cm.'),
                L('10 liters of water make the water 5 cm deep.', '10 liter air membuat air setinggi 5 cm.'),
                L('The tank holds 20,000 liters when it is full.', 'Bak itu memuat 20.000 liter saat penuh.'),
              ],
              answer: [0, 1],
              explain: L(
                'The volume is $40 \\times 25 \\times 20 = 20\\,000\\text{ cm}^3$, which is 20 liters. The base is $40 \\times 25 = 1\\,000\\text{ cm}^2$, and 10 liters is $10\\,000\\text{ cm}^3$, so the depth is $10\\,000 \\div 1\\,000 = 10$ cm. 5 cm would need only 5 liters, and 20,000 is the number of cm³, not liters.',
                'Volumenya $40 \\times 25 \\times 20 = 20\\,000\\text{ cm}^3$, yaitu 20 liter. Luas alasnya $40 \\times 25 = 1\\,000\\text{ cm}^2$, dan 10 liter adalah $10\\,000\\text{ cm}^3$, jadi kedalamannya $10\\,000 \\div 1\\,000 = 10$ cm. Setinggi 5 cm hanya butuh 5 liter, dan 20.000 adalah banyaknya cm³, bukan liter.',
              ),
              hint: L(
                'Find the volume in cm³ and change it to liters. For the depth, divide the water volume (in cm³) by the area of the base.',
                'Cari volume dalam cm³ lalu ubah ke liter. Untuk kedalaman, bagi volume air (dalam cm³) dengan luas alas.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'A water container is made of a tall part and a low part, as in the picture. It is 50 cm long and 20 cm wide. The tall part is 20 cm long and 30 cm high, and the low part is 10 cm high. How many liters of water does it hold when it is full?',
                'Sebuah wadah air terdiri dari bagian tinggi dan bagian rendah, seperti pada gambar. Panjangnya 50 cm dan lebarnya 20 cm. Bagian yang tinggi panjangnya 20 cm dan tingginya 30 cm, sedangkan bagian yang rendah tingginya 10 cm. Berapa liter air yang muat saat wadah itu penuh?',
              ),
              figure: {
                ...boxes3d(
                  [[0, 0, 0, 20, 20, 30], [20, 0, 0, 50, 20, 10]],
                  [
                    { at: [25, 26, -5], text: '50 cm' },
                    { at: [56, 10, -5], text: '20 cm' },
                    { at: [0, 26, 15], text: '30 cm' },
                    { at: [56, 26, 5], text: '10 cm' },
                    { at: [10, 20, 36], text: '20 cm' },
                  ],
                ),
                caption: L('The water container, made of two boxes.', 'Wadah air itu, terdiri dari dua balok.'),
              },
              blanks: [{ answer: 18, after: { en: '\\text{ liters}', id: '\\text{ liter}' } }],
              hints: [
                L(
                  'The container is two boxes joined together. Where would you cut it?',
                  'Wadah itu adalah dua balok yang disambung. Di mana kamu akan memotongnya?',
                ),
                L(
                  'Find the volume of each box in cm³ (the low part is shorter than the whole container), add them, and then change cm³ to liters.',
                  'Cari volume tiap balok dalam cm³ (bagian yang rendah lebih pendek daripada seluruh wadah), jumlahkan, lalu ubah cm³ menjadi liter.',
                ),
                L(
                  'Tall part: 20 × 20 × 30. Low part: (50 − 20) × 20 × 10. Add the two volumes and divide by 1,000.',
                  'Bagian tinggi: 20 × 20 × 30. Bagian rendah: (50 − 20) × 20 × 10. Jumlahkan kedua volume lalu bagi dengan 1.000.',
                ),
              ],
              explain: L(
                'The tall part is $20 \\times 20 \\times 30 = 12\\,000\\text{ cm}^3$. The low part is $30 \\times 20 \\times 10 = 6\\,000\\text{ cm}^3$. Together that is $18\\,000\\text{ cm}^3$, which is 18 liters.',
                'Bagian yang tinggi bervolume $20 \\times 20 \\times 30 = 12\\,000\\text{ cm}^3$. Bagian yang rendah bervolume $30 \\times 20 \\times 10 = 6\\,000\\text{ cm}^3$. Jumlahnya $18\\,000\\text{ cm}^3$, yaitu 18 liter.',
              ),
              solution: {
                en: ['20 \\times 20 \\times 30 = 12\\,000\\text{ cm}^3', '50 - 20 = 30\\text{ cm},\\quad 30 \\times 20 \\times 10 = 6\\,000\\text{ cm}^3', '12\\,000 + 6\\,000 = 18\\,000\\text{ cm}^3', '18\\,000 \\div 1\\,000 = 18\\text{ liters}'],
                id: ['20 \\times 20 \\times 30 = 12\\,000\\text{ cm}^3', '50 - 20 = 30\\text{ cm},\\quad 30 \\times 20 \\times 10 = 6\\,000\\text{ cm}^3', '12\\,000 + 6\\,000 = 18\\,000\\text{ cm}^3', '18\\,000 \\div 1\\,000 = 18\\text{ liter}'],
              },
            },
            {
              kind: 'math',
              id: 'm2',
              prompt: L(
                'A fish tank is 60 cm long, 30 cm wide and 40 cm high. It already holds water 20 cm deep. Budi pours in 18 more liters of water. How deep is the water now?',
                'Sebuah akuarium panjangnya 60 cm, lebarnya 30 cm, dan tingginya 40 cm. Akuarium itu sudah berisi air setinggi 20 cm. Budi menuangkan 18 liter air lagi. Berapa dalam air sekarang?',
              ),
              figure: {
                ...cuboid3d({ l: 60, w: 30, h: 40, labels: { l: '60 cm', w: '30 cm', h: '40 cm' } }),
                caption: L('The fish tank: 60 cm by 30 cm by 40 cm.', 'Akuarium itu: 60 cm kali 30 cm kali 40 cm.'),
              },
              blanks: [{ answer: 30, after: '\\text{ cm}' }],
              hints: [
                L(
                  'The base of the tank stays the same. Find its area, and think about how much the water level goes UP.',
                  'Alas akuarium tetap sama. Cari luasnya, dan pikirkan berapa tinggi air NAIK.',
                ),
                L(
                  'Change the 18 liters to cm³. Divide by the area of the base to see how many centimeters the water rises.',
                  'Ubah 18 liter menjadi cm³. Bagi dengan luas alas untuk mengetahui berapa sentimeter air naik.',
                ),
                L(
                  'Base: 60 × 30. Rise: 18 × 1,000 divided by the base. Then add the rise to the 20 cm that was already there.',
                  'Alas: 60 × 30. Kenaikan: 18 × 1.000 dibagi luas alas. Lalu tambahkan kenaikan itu ke 20 cm yang sudah ada.',
                ),
              ],
              explain: L(
                'The base is $60 \\times 30 = 1\\,800\\text{ cm}^2$. The 18 liters are $18\\,000\\text{ cm}^3$, so the water rises $18\\,000 \\div 1\\,800 = 10$ cm. The depth is now $20 + 10 = 30$ cm, which is less than 40 cm, so nothing spills.',
                'Luas alasnya $60 \\times 30 = 1\\,800\\text{ cm}^2$. Ke-18 liter itu adalah $18\\,000\\text{ cm}^3$, jadi air naik $18\\,000 \\div 1\\,800 = 10$ cm. Sekarang dalam air $20 + 10 = 30$ cm, kurang dari 40 cm, jadi tidak ada yang tumpah.',
              ),
              solution: {
                en: ['60 \\times 30 = 1\\,800\\text{ cm}^2', '18\\text{ liters} = 18\\,000\\text{ cm}^3', '18\\,000 \\div 1\\,800 = 10\\text{ cm}', '20 + 10 = 30\\text{ cm}'],
                id: ['60 \\times 30 = 1\\,800\\text{ cm}^2', '18\\text{ liter} = 18\\,000\\text{ cm}^3', '18\\,000 \\div 1\\,800 = 10\\text{ cm}', '20 + 10 = 30\\text{ cm}'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m9-s2-p',
        runtime: 'math',
        title: L('Project: Volume of Boxes', 'Proyek: Volume Balok'),
        brief: L(
          'Four problems about the volume of boxes, from a quick multiplication to filling a box with small cubes.',
          'Empat soal tentang volume balok, dari perkalian cepat sampai mengisi balok dengan kubus-kubus kecil.',
        ),
        requirements: [
          L('Find the volume of a box and a missing edge.', 'Mencari volume balok dan rusuk yang belum diketahui.'),
          L('Change between cm³ and liters.', 'Mengubah antara cm³ dan liter.'),
        ],
        tasks: [
          {
            prompt: L('What is the volume of this box?', 'Berapa volume balok ini?'),
            figure: {
              ...cuboid3d({ l: 7, w: 3, h: 2, labels: { l: '7 cm', w: '3 cm', h: '2 cm' } }),
              caption: L('A box 7 cm long, 3 cm wide and 2 cm high.', 'Balok dengan panjang 7 cm, lebar 3 cm, dan tinggi 2 cm.'),
            },
            blanks: [{ answer: 42, after: '\\text{ cm}^3' }],
            solution: ['7 \\times 3 \\times 2 = 42\\text{ cm}^3'],
          },
          {
            prompt: L(
              'A box has a volume of 120 cm³. It is 6 cm long and 5 cm wide. How high is it?',
              'Sebuah balok bervolume 120 cm³. Panjangnya 6 cm dan lebarnya 5 cm. Berapa tingginya?',
            ),
            blanks: [{ answer: 4, after: '\\text{ cm}' }],
            solution: ['6 \\times 5 = 30\\text{ cm}^2', '120 \\div 30 = 4\\text{ cm}'],
          },
          {
            prompt: L(
              'A bathroom tank is 80 cm long, 50 cm wide and 40 cm high. How many liters of water does it hold when it is full?',
              'Sebuah bak mandi panjangnya 80 cm, lebarnya 50 cm, dan tingginya 40 cm. Berapa liter air yang muat saat bak itu penuh?',
            ),
            blanks: [{ answer: 160, after: { en: '\\text{ liters}', id: '\\text{ liter}' } }],
            solution: {
              en: ['80 \\times 50 \\times 40 = 160\\,000\\text{ cm}^3', '160\\,000 \\div 1\\,000 = 160\\text{ liters}'],
              id: ['80 \\times 50 \\times 40 = 160\\,000\\text{ cm}^3', '160\\,000 \\div 1\\,000 = 160\\text{ liter}'],
            },
          },
          {
            prompt: L(
              'A box is 12 cm long, 8 cm wide and 6 cm high. Ani fills it completely with small cubes. Each small cube has an edge of 2 cm. How many small cubes fit in the box?',
              'Sebuah kotak panjangnya 12 cm, lebarnya 8 cm, dan tingginya 6 cm. Ani mengisinya penuh dengan kubus kecil. Setiap kubus kecil punya rusuk 2 cm. Berapa kubus kecil yang muat di dalam kotak itu?',
            ),
            figure: {
              ...cuboid3d({ l: 12, w: 8, h: 6, labels: { l: '12 cm', w: '8 cm', h: '6 cm' } }),
              caption: L('The box to be filled with cubes of 2 cm.', 'Kotak yang akan diisi kubus 2 cm.'),
            },
            blanks: [{ answer: 72, after: { en: '\\text{ cubes}', id: '\\text{ kubus}' } }],
            solution: {
              en: ['\\text{along the length: } 12 \\div 2 = 6\\text{ cubes}', '\\text{along the width: } 8 \\div 2 = 4\\text{ cubes}', '\\text{along the height: } 6 \\div 2 = 3\\text{ cubes}', '6 \\times 4 \\times 3 = 72\\text{ cubes}'],
              id: ['\\text{sepanjang panjang: } 12 \\div 2 = 6\\text{ kubus}', '\\text{sepanjang lebar: } 8 \\div 2 = 4\\text{ kubus}', '\\text{sepanjang tinggi: } 6 \\div 2 = 3\\text{ kubus}', '6 \\times 4 \\times 3 = 72\\text{ kubus}'],
            },
          },
        ],
        hints: [
          L(
            'Volume of a box = length × width × height. Never add the edges.',
            'Volume balok = panjang × lebar × tinggi. Jangan pernah menjumlahkan rusuknya.',
          ),
          L(
            'For a missing edge, divide the volume by the other two edges multiplied together.',
            'Untuk rusuk yang belum diketahui, bagi volume dengan hasil kali kedua rusuk yang lain.',
          ),
          L(
            'For the small cubes, ask how many fit along each edge of the box, then multiply the three numbers.',
            'Untuk kubus kecil, tanyakan berapa yang muat sepanjang tiap rusuk kotak, lalu kalikan ketiga bilangan itu.',
          ),
        ],
        xp: 50,
      },
    },
    /* ================================================================== S3 — spatial visualization */
    {
      id: 'tka-m9-s3',
      title: L('Spatial Visualization', 'Visualisasi Ruang'),
      summary: L(
        'A stack of cubes looks different from the front, from the side and from above. You will read and draw those views, see how a tall column hides what is behind it, and rebuild a stack from its views.',
        'Sebuah tumpukan kubus terlihat berbeda dari depan, dari samping, dan dari atas. Kamu akan membaca dan menggambar ketiga tampak itu, melihat bagaimana kolom yang tinggi menyembunyikan apa yang ada di belakangnya, dan menyusun kembali tumpukan dari tampaknya.',
      ),
      lessons: [
        /* ---------------------------------------------------------------- l1 */
        {
          id: 'tka-m9-s3-l1',
          title: L('Front, Top and Side Views', 'Tampak Depan, Atas, dan Samping'),
          goal: L(
            'You can find the front view, the side view and the top view of a stack of cubes, explain how a tall column hides cubes, and read the number of cubes from a top view with numbers.',
            'Kamu bisa menentukan tampak depan, tampak samping, dan tampak atas sebuah tumpukan kubus, menjelaskan bagaimana kolom yang tinggi menyembunyikan kubus, dan membaca banyaknya kubus dari tampak atas yang diberi angka.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: One Tower, Three Pictures', 'Ayo Amati: Satu Menara, Tiga Gambar'),
              body: L(
                'Citra builds a tower from toy blocks. In the picture, the green faces look to the front, the orange faces look to the right-hand side, and the gold faces are on top. The row of cubes closest to the green side is the **front row**.\n\nHer friends look at the tower from three places. Each friend sees a different flat picture, called a **view**.\n\n- The **front view**: you stand in front of the tower and look at it.\n- The **side view**: you stand at the right-hand side of the tower.\n- The **top view**: you look straight down from above.\n\nA view is made of squares. A tall column can hide the cubes that stand behind it.',
                'Citra menyusun menara dari balok mainan. Pada gambar, sisi hijau menghadap ke depan, sisi oranye menghadap ke sebelah kanan, dan sisi emas ada di atas. Baris kubus yang paling dekat dengan sisi hijau adalah **baris depan**.\n\nTeman-temannya melihat menara itu dari tiga tempat. Setiap teman melihat gambar datar yang berbeda, disebut **tampak**.\n\n- **Tampak depan**: kamu berdiri di depan menara dan melihatnya.\n- **Tampak samping**: kamu berdiri di sebelah kanan menara.\n- **Tampak atas**: kamu melihat lurus ke bawah dari atas.\n\nSebuah tampak terdiri dari persegi-persegi. Kolom yang tinggi bisa menyembunyikan kubus yang ada di belakangnya.',
              ),
              figure: {
                ...stack([[1, 3, 2], [2, 1, 1]]),
                caption: L(
                  'Citra\'s tower. Green faces look to the front, orange faces to the right, gold faces are the top.',
                  'Menara Citra. Sisi hijau menghadap ke depan, sisi oranye ke kanan, sisi emas adalah bagian atas.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: Drawing the Three Views', 'Contoh Bertahap: Menggambar Ketiga Tampak'),
              body: L(
                'Draw the three views of Citra\'s tower. Its front row has stacks of 1, 3 and 2 cubes from left to right, and the row behind it has stacks of 2, 1 and 1 cubes.\n\n1. Step 1: Front view. Look at the tower from the front. In each column only the tallest stack counts, because cubes behind a taller stack are hidden. The three columns are $2$, $3$ and $2$ squares high.\n2. Step 2: Side view. Stand on the right. The front row is on your left and the back row is on your right. The tallest stack in the front row is $3$ and in the back row it is $2$.\n3. Step 3: Top view. Look straight down. Every square that has a cube is shaded. All 6 squares have cubes, so all 6 are shaded.\n4. Step 4: Write on each square how many cubes stand on it: 1, 3, 2 in the front row and 2, 1, 1 in the back row.\n5. Step 5: Check: $1 + 3 + 2 + 2 + 1 + 1 = 10$ cubes in all.\n\n**Remember:**\n\n- The front view and the side view show only the **tallest** stack in each column or row.\n- The top view shows which squares have cubes. The numbers tell how many cubes are on each square.\n- The numbers of the top view add up to all the cubes.',
                'Gambarlah ketiga tampak menara Citra. Baris depannya punya tumpukan 1, 3, dan 2 kubus dari kiri ke kanan, dan baris di belakangnya punya tumpukan 2, 1, dan 1 kubus.\n\n1. Langkah 1: Tampak depan. Lihat menara dari depan. Pada tiap kolom hanya tumpukan yang paling tinggi yang dihitung, karena kubus di belakang tumpukan yang lebih tinggi tertutup. Ketiga kolomnya setinggi $2$, $3$, dan $2$ persegi.\n2. Langkah 2: Tampak samping. Berdirilah di sebelah kanan. Baris depan ada di sebelah kirimu dan baris belakang di sebelah kananmu. Tumpukan tertinggi di baris depan adalah $3$ dan di baris belakang adalah $2$.\n3. Langkah 3: Tampak atas. Lihat lurus ke bawah. Setiap persegi yang ada kubusnya diberi warna. Keenam persegi ada kubusnya, jadi keenamnya diberi warna.\n4. Langkah 4: Tulis pada tiap persegi berapa kubus yang menumpuk di sana: 1, 3, 2 di baris depan dan 2, 1, 1 di baris belakang.\n5. Langkah 5: Periksa: $1 + 3 + 2 + 2 + 1 + 1 = 10$ kubus seluruhnya.\n\n**Ingat:**\n\n- Tampak depan dan tampak samping hanya menunjukkan tumpukan yang **paling tinggi** pada tiap kolom atau baris.\n- Tampak atas menunjukkan persegi mana yang ada kubusnya. Angkanya menyatakan banyaknya kubus pada tiap persegi.\n- Angka-angka pada tampak atas jika dijumlahkan menjadi seluruh kubus.',
              ),
              figure: {
                ...threeViews([[1, 3, 2], [2, 1, 1]]),
                caption: L(
                  'From left to right: the front view, the side view and the top view with numbers. The arrow shows where you stand for the front view.',
                  'Dari kiri ke kanan: tampak depan, tampak samping, dan tampak atas dengan angka. Panah menunjukkan tempat kamu berdiri untuk tampak depan.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Watch Out!: Reading Views', 'Awas, Jebakan!: Membaca Tampak'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| ❌ In the front view, add up the cubes in each column: $1 + 2 = 3$, $3 + 1 = 4$, $2 + 1 = 3$. | The front view shows only the tallest stack of each column, because the others are hidden: $2$, $3$, $2$. |\n| ❌ The top view shows how tall the stacks are. | The top view only shows which squares have cubes. The numbers written on the squares tell the heights. |\n| ❌ The side view looks the same as the front view. | You look from the right, so the picture is different. Its columns are the rows of the tower, with the front row on the left. |',
                '| Salah | Benar |\n| --- | --- |\n| ❌ Pada tampak depan, jumlahkan kubus pada tiap kolom: $1 + 2 = 3$, $3 + 1 = 4$, $2 + 1 = 3$. | Tampak depan hanya menunjukkan tumpukan paling tinggi pada tiap kolom, karena yang lain tertutup: $2$, $3$, $2$. |\n| ❌ Tampak atas menunjukkan seberapa tinggi tumpukannya. | Tampak atas hanya menunjukkan persegi mana yang ada kubusnya. Angka yang tertulis pada persegi menyatakan tingginya. |\n| ❌ Tampak samping sama dengan tampak depan. | Kamu melihat dari kanan, jadi gambarnya berbeda. Kolom-kolomnya adalah baris-baris menara, dengan baris depan di sebelah kiri. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Look at the tower. The green faces look to the front. What does the front view look like?',
                'Perhatikan menara ini. Sisi hijau menghadap ke depan. Seperti apa tampak depannya?',
              ),
              figure: {
                ...stack([[1, 2, 1], [3, 1, 2]]),
                caption: L('A tower of cubes. The green faces look to the front.', 'Sebuah menara kubus. Sisi hijau menghadap ke depan.'),
              },
              options: [
                L('Three columns, 3, 2 and 2 squares high from left to right.', 'Tiga kolom, setinggi 3, 2, dan 2 persegi dari kiri ke kanan.'),
                L('Three columns, 1, 2 and 1 squares high from left to right.', 'Tiga kolom, setinggi 1, 2, dan 1 persegi dari kiri ke kanan.'),
                L('Three columns, 4, 3 and 3 squares high from left to right.', 'Tiga kolom, setinggi 4, 3, dan 3 persegi dari kiri ke kanan.'),
                L('Two columns, 2 and 3 squares high from left to right.', 'Dua kolom, setinggi 2 dan 3 persegi dari kiri ke kanan.'),
              ],
              answer: 0,
              explain: L(
                'In each column the tallest stack counts, behind or in front: $3$, $2$ and $2$. The picture with 1, 2, 1 looks only at the front row. The one with 4, 3, 3 adds up the cubes of each column. The one with two columns is the side view.',
                'Pada tiap kolom, tumpukan paling tinggi yang dihitung, entah di belakang atau di depan: $3$, $2$, dan $2$. Gambar dengan 1, 2, 1 hanya melihat baris depan. Yang dengan 4, 3, 3 menjumlahkan kubus pada tiap kolom. Yang dengan dua kolom adalah tampak samping.',
              ),
              hint: L(
                'In each column, look for the tallest stack, also the one behind. Do not add the stacks together.',
                'Pada tiap kolom, cari tumpukan yang paling tinggi, termasuk yang ada di belakang. Jangan menjumlahkan tumpukannya.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: Gita stands at the right-hand side of this tower and looks at the orange faces. In her side view, how many squares high is the first column (the front row) and the second column (the back row)?',
                'Coba bersama: Gita berdiri di sebelah kanan menara ini dan melihat sisi oranye. Pada tampak sampingnya, setinggi berapa persegi kolom pertama (baris depan) dan kolom kedua (baris belakang)?',
              ),
              figure: {
                ...stack([[2, 1, 3], [1, 2, 1]]),
                caption: L('A tower of cubes seen from a corner.', 'Sebuah menara kubus dilihat dari sudut.'),
              },
              template: {
                en: '\\text{front row} = ___ \\text{ squares},\\quad \\text{back row} = ___ \\text{ squares}',
                id: '\\text{baris depan} = ___ \\text{ persegi},\\quad \\text{baris belakang} = ___ \\text{ persegi}',
              },
              blanks: ['3', '2'],
              explain: L(
                'The front row has stacks of 2, 1 and 3 cubes, so its tallest stack is 3. The back row has stacks of 1, 2 and 1 cubes, so its tallest stack is 2.',
                'Baris depan punya tumpukan 2, 1, dan 3 kubus, jadi tumpukan tertingginya 3. Baris belakang punya tumpukan 1, 2, dan 1 kubus, jadi tumpukan tertingginya 2.',
              ),
              hint: L(
                'In the side view a whole row becomes one column. Only the tallest stack of the row counts.',
                'Pada tampak samping, satu baris penuh menjadi satu kolom. Hanya tumpukan tertinggi dalam baris itu yang dihitung.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'The picture is the top view of a stack of cubes. The number on a square tells how many cubes stand on it, and the empty square has no cube. How many cubes are in the stack?',
                'Gambar ini adalah tampak atas sebuah tumpukan kubus. Angka pada persegi menyatakan banyaknya kubus yang menumpuk di sana, dan persegi yang kosong tidak ada kubusnya. Berapa kubus dalam tumpukan itu?',
              ),
              figure: {
                ...planPiece([[2, 1, 0], [1, 3, 2]]),
                caption: L(
                  'The top view with numbers. The arrow shows where you stand for the front view.',
                  'Tampak atas dengan angka. Panah menunjukkan tempat kamu berdiri untuk tampak depan.',
                ),
              },
              options: [L('9 cubes', '9 kubus'), L('5 cubes', '5 kubus'), L('3 cubes', '3 kubus'), L('18 cubes', '18 kubus')],
              answer: 0,
              explain: L(
                'Add all the numbers: $2 + 1 + 0 + 1 + 3 + 2 = 9$. 5 only counts the shaded squares, 3 is just the tallest stack, and 18 pretends that all 6 squares are as tall as the tallest stack ($6 \\times 3$).',
                'Jumlahkan semua angka: $2 + 1 + 0 + 1 + 3 + 2 = 9$. 5 hanya menghitung persegi yang berwarna, 3 hanya tumpukan tertinggi, dan 18 menganggap keenam persegi setinggi tumpukan tertinggi ($6 \\times 3$).',
              ),
              hint: L(
                'Each number is one stack of cubes. How many cubes are there when you put all the stacks together?',
                'Setiap angka adalah satu tumpukan kubus. Berapa kubus jika semua tumpukan digabung?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              figure: {
                ...planPiece([[2, 1, 0], [3, 2, 2]]),
                caption: L(
                  'The top view of a tower, with the number of cubes on each square. The arrow shows where you stand for the front view.',
                  'Tampak atas sebuah menara, dengan banyaknya kubus pada tiap persegi. Panah menunjukkan tempat kamu berdiri untuk tampak depan.',
                ),
              },
              statements: [
                L('The tower has 10 cubes.', 'Menara itu terdiri dari 10 kubus.'),
                L('The tower has 5 cubes, because 5 squares are shaded.', 'Menara itu terdiri dari 5 kubus, karena 5 persegi berwarna.'),
                L(
                  'In the front view the columns are 3, 2 and 2 squares high from left to right.',
                  'Pada tampak depan, kolom-kolomnya setinggi 3, 2, dan 2 persegi dari kiri ke kanan.',
                ),
                L(
                  'In the side view, seen from the right, the columns are 3 and 2 squares high from left to right.',
                  'Pada tampak samping, dilihat dari kanan, kolom-kolomnya setinggi 3 dan 2 persegi dari kiri ke kanan.',
                ),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The numbers add up to $2 + 1 + 0 + 3 + 2 + 2 = 10$, while 5 is only the number of shaded squares. In the front view each column shows its biggest number: $3$, $2$ and $2$. For the side view you look from the right, so the front row comes first: $2$, then $3$. The statement has them the wrong way round.',
                'Angka-angkanya berjumlah $2 + 1 + 0 + 3 + 2 + 2 = 10$, sedangkan 5 hanyalah banyaknya persegi yang berwarna. Pada tampak depan, tiap kolom menunjukkan angka terbesarnya: $3$, $2$, dan $2$. Untuk tampak samping kamu melihat dari kanan, jadi baris depan lebih dulu: $2$, lalu $3$. Pernyataan itu membalik urutannya.',
              ),
              hint: L(
                'Add all the numbers for the cubes. For the front view take the biggest number in each column, and for the side view the biggest number in each row, front row first.',
                'Jumlahkan semua angka untuk banyaknya kubus. Untuk tampak depan ambil angka terbesar pada tiap kolom, dan untuk tampak samping angka terbesar pada tiap baris, dimulai dari baris depan.',
              ),
            },
            {
              kind: 'multi',
              id: 'mc1',
              prompt: L(
                'Look at the tower. The green faces look to the front. Choose the TWO statements that are true.',
                'Perhatikan menara ini. Sisi hijau menghadap ke depan. Pilih DUA pernyataan yang benar.',
              ),
              figure: {
                ...stack([[2, 1, 1], [1, 2, 3]]),
                caption: L('A tower of cubes. The green faces look to the front.', 'Sebuah menara kubus. Sisi hijau menghadap ke depan.'),
              },
              options: [
                L(
                  'The front view has three columns, 2, 2 and 3 squares high from left to right.',
                  'Tampak depan punya tiga kolom, setinggi 2, 2, dan 3 persegi dari kiri ke kanan.',
                ),
                L(
                  'The side view has two columns, 2 and 3 squares high from left to right.',
                  'Tampak samping punya dua kolom, setinggi 2 dan 3 persegi dari kiri ke kanan.',
                ),
                L(
                  'The front view has three columns, 2, 1 and 1 squares high from left to right.',
                  'Tampak depan punya tiga kolom, setinggi 2, 1, dan 1 persegi dari kiri ke kanan.',
                ),
                L(
                  'The side view has three columns, 2, 2 and 3 squares high from left to right.',
                  'Tampak samping punya tiga kolom, setinggi 2, 2, dan 3 persegi dari kiri ke kanan.',
                ),
              ],
              answer: [0, 1],
              explain: L(
                'In the front view the tallest stack of each column is $2$, $2$ and $3$. In the side view each row is one column: the front row has a tallest stack of $2$ and the back row of $3$. The picture with 2, 1, 1 looks only at the front row, and the one with three columns for the side view mixes it up with the front view.',
                'Pada tampak depan, tumpukan tertinggi tiap kolom adalah $2$, $2$, dan $3$. Pada tampak samping, tiap baris menjadi satu kolom: baris depan tumpukan tertingginya $2$ dan baris belakang $3$. Gambar dengan 2, 1, 1 hanya melihat baris depan, dan yang punya tiga kolom untuk tampak samping tertukar dengan tampak depan.',
              ),
              hint: L(
                'Front view: the tallest stack in each column. Side view: the tallest stack in each row, front row first. How many columns does each view have?',
                'Tampak depan: tumpukan tertinggi pada tiap kolom. Tampak samping: tumpukan tertinggi pada tiap baris, dimulai dari baris depan. Berapa kolom yang dimiliki tiap tampak?',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'The picture is the top view of a stack of cubes. The numbers tell how many cubes stand on each square. Dewi looks at the stack from the front (the arrow). How many squares does her front view have?',
                'Gambar ini adalah tampak atas sebuah tumpukan kubus. Angka-angkanya menyatakan banyaknya kubus pada tiap persegi. Dewi melihat tumpukan itu dari depan (panah). Berapa persegi yang dimiliki tampak depannya?',
              ),
              figure: {
                ...planPiece([[1, 2, 3], [2, 0, 1], [1, 3, 2]]),
                caption: L(
                  'The top view with numbers. The arrow shows where Dewi stands.',
                  'Tampak atas dengan angka. Panah menunjukkan tempat Dewi berdiri.',
                ),
              },
              blanks: [{ answer: 8, after: { en: '\\text{ squares}', id: '\\text{ persegi}' } }],
              hints: [
                L(
                  'In the front view you look at the columns from the front, from left to right. Each column is as tall as its tallest stack.',
                  'Pada tampak depan kamu melihat kolom-kolom dari depan, dari kiri ke kanan. Setiap kolom setinggi tumpukan tertingginya.',
                ),
                L(
                  'Go through each column of the top view from bottom to top and find the biggest number in it.',
                  'Telusuri tiap kolom pada tampak atas dari bawah ke atas dan cari angka terbesar di dalamnya.',
                ),
                L(
                  'Left column: the biggest of 1, 2, 1. Middle column: the biggest of 2, 0, 3. Right column: the biggest of 3, 1, 2. Then add the three numbers.',
                  'Kolom kiri: yang terbesar dari 1, 2, 1. Kolom tengah: yang terbesar dari 2, 0, 3. Kolom kanan: yang terbesar dari 3, 1, 2. Lalu jumlahkan ketiga bilangan itu.',
                ),
              ],
              explain: L(
                'The tallest stacks of the three columns are 2, 3 and 3, so the front view is $2 + 3 + 3 = 8$ squares.',
                'Tumpukan tertinggi pada ketiga kolom adalah 2, 3, dan 3, jadi tampak depan terdiri dari $2 + 3 + 3 = 8$ persegi.',
              ),
              solution: {
                en: ['\\text{left column: } 2,\\quad \\text{middle column: } 3,\\quad \\text{right column: } 3', '2 + 3 + 3 = 8\\text{ squares}'],
                id: ['\\text{kolom kiri: } 2,\\quad \\text{kolom tengah: } 3,\\quad \\text{kolom kanan: } 3', '2 + 3 + 3 = 8\\text{ persegi}'],
              },
            },
          ],
        },
        /* ---------------------------------------------------------------- l2 */
        {
          id: 'tka-m9-s3-l2',
          title: L('Rebuilding the Stack from Its Views', 'Menyusun Kubus dari Tampaknya'),
          goal: L(
            'You can rebuild a stack from its top view with numbers, and find the fewest and the most cubes a tower can have when only its front view and side view are known.',
            'Kamu bisa menyusun kembali tumpukan dari tampak atas yang diberi angka, dan menentukan paling sedikit dan paling banyak kubus pada sebuah menara jika hanya tampak depan dan tampak sampingnya yang diketahui.',
          ),
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: L('Look Closely: A Top View with Numbers Is a Recipe', 'Ayo Amati: Tampak Atas dengan Angka adalah Resep'),
              body: L(
                'Eko gets the top view of a tower, with a number on each square. The picture has 4 squares, and each number tells how many cubes stand on that square.\n\nThe numbers are like a **recipe**: build a stack of 2 and a stack of 1 in the front row, and a stack of 1 and a stack of 3 in the back row. Now you can count the cubes: $2 + 1 + 1 + 3 = 7$.\n\nThe recipe also tells you what the tower looks like from the front and from the side. The next step shows how.',
                'Eko mendapat tampak atas sebuah menara, dengan angka pada tiap persegi. Gambar itu punya 4 persegi, dan setiap angka menyatakan banyaknya kubus yang menumpuk pada persegi itu.\n\nAngka-angka itu seperti **resep**: susun tumpukan 2 dan tumpukan 1 di baris depan, lalu tumpukan 1 dan tumpukan 3 di baris belakang. Sekarang kamu bisa menghitung kubusnya: $2 + 1 + 1 + 3 = 7$.\n\nResep itu juga memberi tahu bagaimana menara terlihat dari depan dan dari samping. Langkah berikutnya menunjukkan caranya.',
              ),
              figure: {
                ...planPiece([[2, 1], [1, 3]]),
                caption: L(
                  'The top view with numbers. The arrow shows where you stand for the front view.',
                  'Tampak atas dengan angka. Panah menunjukkan tempat kamu berdiri untuk tampak depan.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: L('Step by Step: From the Top View to the Other Views', 'Contoh Bertahap: Dari Tampak Atas ke Tampak Lainnya'),
              body: L(
                'Here is a top view with numbers. The empty square has no cube. Find how many cubes there are, and draw the front view and the side view.\n\n1. Step 1: Read the numbers row by row. The front row (the bottom row) is 2, 1, 3. The back row is 0, 2, 1.\n2. Step 2: Add them to count the cubes: $2 + 1 + 3 + 0 + 2 + 1 = 9$ cubes.\n3. Step 3: Front view. Go column by column and take the biggest number in each. The left column has 2 and 0, so $2$. The middle has 1 and 2, so $2$. The right has 3 and 1, so $3$.\n4. Step 4: Side view, from the right with the front row first. The front row has 2, 1, 3, so its tallest stack is $3$. The back row has 0, 2, 1, so its tallest stack is $2$.\n5. Step 5: Draw the views. The front view has columns of 2, 2 and 3 squares. The side view has columns of 3 and 2 squares.\n\n**Remember:**\n\n- Number of cubes = add all the numbers of the top view.\n- Front view: the biggest number in each column.\n- Side view: the biggest number in each row, starting with the front row.',
                'Ini sebuah tampak atas dengan angka. Persegi yang kosong tidak ada kubusnya. Carilah berapa kubus yang ada, lalu gambarlah tampak depan dan tampak sampingnya.\n\n1. Langkah 1: Baca angkanya baris demi baris. Baris depan (baris paling bawah) adalah 2, 1, 3. Baris belakang adalah 0, 2, 1.\n2. Langkah 2: Jumlahkan untuk menghitung kubus: $2 + 1 + 3 + 0 + 2 + 1 = 9$ kubus.\n3. Langkah 3: Tampak depan. Telusuri kolom demi kolom dan ambil angka terbesar pada tiap kolom. Kolom kiri punya 2 dan 0, jadi $2$. Kolom tengah punya 1 dan 2, jadi $2$. Kolom kanan punya 3 dan 1, jadi $3$.\n4. Langkah 4: Tampak samping, dari kanan dengan baris depan lebih dulu. Baris depan punya 2, 1, 3, jadi tumpukan tertingginya $3$. Baris belakang punya 0, 2, 1, jadi tumpukan tertingginya $2$.\n5. Langkah 5: Gambar tampaknya. Tampak depan punya kolom setinggi 2, 2, dan 3 persegi. Tampak samping punya kolom setinggi 3 dan 2 persegi.\n\n**Ingat:**\n\n- Banyaknya kubus = jumlahkan semua angka pada tampak atas.\n- Tampak depan: angka terbesar pada tiap kolom.\n- Tampak samping: angka terbesar pada tiap baris, dimulai dari baris depan.',
              ),
              figure: {
                ...threeViews([[2, 1, 3], [0, 2, 1]]),
                caption: L(
                  'From left to right: the front view, the side view and the top view with numbers.',
                  'Dari kiri ke kanan: tampak depan, tampak samping, dan tampak atas dengan angka.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c3',
              title: L('Step by Step: Only the Front and the Side Are Known', 'Contoh Bertahap: Hanya Tampak Depan dan Samping yang Diketahui'),
              body: L(
                'Ani knows only two views of a tower: the front view and the side view. How many cubes could the tower have, at the most and at the least?\n\nThe tower stands on 2 rows and 3 columns. The front view is 3, 1 and 2 squares high. The side view is 2 squares high for the front row and 3 for the back row.\n\n1. Step 1: A square of the top view cannot hold more cubes than its column allows (front view) or than its row allows (side view). Take the smaller of the two.\n2. Step 2: Most cubes. The front row has limit 2, and the columns allow 3, 1, 2, so the stacks are 2, 1, 2: that is 5 cubes. The back row has limit 3, so the stacks are 3, 1, 2: that is 6 cubes. Most: $5 + 6 = 11$.\n3. Step 3: Fewest cubes. Each column needs one stack as tall as its front view, so $3 + 1 + 2 = 6$ cubes are needed at least.\n4. Step 4: Check the rows. The back row needs a stack of 3, and the front row allows only 2, so the 3 goes in the back row. The front row needs a stack of 2: use the 2 of the right column. The 1 can stand anywhere.\n5. Step 5: Both views are right with 6 cubes, so the tower has at least 6 and at most 11 cubes.\n\n**Remember:**\n\n- Most cubes: on every square put the smaller of its column limit and its row limit, then add.\n- Fewest cubes: let one tall stack serve a column and a row at the same time, whenever you can.',
                'Ani hanya tahu dua tampak sebuah menara: tampak depan dan tampak samping. Berapa kubus yang mungkin ada pada menara itu, paling banyak dan paling sedikit?\n\nMenara itu berdiri di atas 2 baris dan 3 kolom. Tampak depannya setinggi 3, 1, dan 2 persegi. Tampak sampingnya setinggi 2 persegi untuk baris depan dan 3 untuk baris belakang.\n\n1. Langkah 1: Sebuah persegi pada tampak atas tidak boleh memuat kubus lebih banyak daripada yang diizinkan kolomnya (tampak depan) atau barisnya (tampak samping). Ambil yang lebih kecil dari keduanya.\n2. Langkah 2: Kubus paling banyak. Baris depan punya batas 2, dan kolom-kolomnya mengizinkan 3, 1, 2, jadi tumpukannya 2, 1, 2: itu 5 kubus. Baris belakang punya batas 3, jadi tumpukannya 3, 1, 2: itu 6 kubus. Paling banyak: $5 + 6 = 11$.\n3. Langkah 3: Kubus paling sedikit. Setiap kolom butuh satu tumpukan setinggi tampak depannya, jadi paling sedikit dibutuhkan $3 + 1 + 2 = 6$ kubus.\n4. Langkah 4: Periksa barisnya. Baris belakang butuh tumpukan 3, dan baris depan hanya mengizinkan 2, jadi tumpukan 3 ada di baris belakang. Baris depan butuh tumpukan 2: pakai yang 2 di kolom kanan. Yang 1 boleh di mana saja.\n5. Langkah 5: Kedua tampak sudah benar dengan 6 kubus, jadi menara itu punya paling sedikit 6 dan paling banyak 11 kubus.\n\n**Ingat:**\n\n- Kubus paling banyak: pada setiap persegi taruh yang lebih kecil antara batas kolom dan batas barisnya, lalu jumlahkan.\n- Kubus paling sedikit: biarkan satu tumpukan tinggi melayani sebuah kolom dan sebuah baris sekaligus, kapan pun bisa.',
              ),
              figure: {
                ...twoViews([3, 1, 2], [2, 3], true),
                caption: L(
                  'Left: the front view. Middle: the side view, seen from the right. Right: the empty top view with 2 rows and 3 columns; the arrow shows where you stand for the front view.',
                  'Kiri: tampak depan. Tengah: tampak samping, dilihat dari kanan. Kanan: tampak atas yang masih kosong dengan 2 baris dan 3 kolom; panah menunjukkan tempat kamu berdiri untuk tampak depan.',
                ),
              },
            },
            {
              kind: 'concept',
              id: 'c4',
              title: L('Watch Out!: Fewest and Most', 'Awas, Jebakan!: Paling Sedikit dan Paling Banyak'),
              body: L(
                '| Wrong | Right |\n| --- | --- |\n| ❌ Fill every square with the tallest stack: $2 \\times 3 \\times 3 = 18$ cubes at most. | Every square has its own limit: the smaller of its column and its row. Add those limits ($5 + 6 = 11$). |\n| ❌ The tower must have 6 cubes, because $3 + 1 + 2 = 6$. | 6 is only the fewest. Other towers with the same front and side views have more cubes, up to 11. |\n| ❌ The fewest is always the sum of the front view, so I do not need the side view. | Check the rows too. A row may need a tall stack that the columns alone would not give. |',
                '| Salah | Benar |\n| --- | --- |\n| ❌ Mengisi setiap persegi dengan tumpukan tertinggi: $2 \\times 3 \\times 3 = 18$ kubus paling banyak. | Setiap persegi punya batasnya sendiri: yang lebih kecil antara kolom dan barisnya. Jumlahkan batas-batas itu ($5 + 6 = 11$). |\n| ❌ Menara itu pasti punya 6 kubus, karena $3 + 1 + 2 = 6$. | 6 hanyalah yang paling sedikit. Menara lain dengan tampak depan dan samping yang sama punya kubus lebih banyak, sampai 11. |\n| ❌ Yang paling sedikit selalu jumlah tampak depan, jadi aku tidak perlu tampak samping. | Periksa barisnya juga. Sebuah baris mungkin butuh tumpukan tinggi yang tidak diberikan oleh kolom saja. |',
              ),
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: L(
                'Eko looks at this tower from the right-hand side (the arrow). The numbers tell how many cubes stand on each square. What does he see?',
                'Eko melihat menara ini dari sebelah kanan (panah). Angka-angkanya menyatakan banyaknya kubus pada tiap persegi. Apa yang ia lihat?',
              ),
              figure: {
                ...planPiece([[2, 1], [1, 1], [3, 2]], 'side'),
                caption: L('The top view with numbers. The arrow shows where Eko stands.', 'Tampak atas dengan angka. Panah menunjukkan tempat Eko berdiri.'),
              },
              options: [
                L('Three columns, 2, 1 and 3 squares high from left to right.', 'Tiga kolom, setinggi 2, 1, dan 3 persegi dari kiri ke kanan.'),
                L('Three columns, 3, 1 and 2 squares high from left to right.', 'Tiga kolom, setinggi 3, 1, dan 2 persegi dari kiri ke kanan.'),
                L('Two columns, 3 and 2 squares high from left to right.', 'Dua kolom, setinggi 3 dan 2 persegi dari kiri ke kanan.'),
                L('Three columns, 3, 2 and 5 squares high from left to right.', 'Tiga kolom, setinggi 3, 2, dan 5 persegi dari kiri ke kanan.'),
              ],
              answer: 0,
              explain: L(
                'From the right, the front row (the bottom row of the picture) is on the left. The biggest number in each row is $2$ for the bottom row, $1$ for the middle row and $3$ for the top row. Reading from the wrong end gives 3, 1, 2. The picture with two columns is the front view, and 3, 2, 5 adds the numbers of each row.',
                'Dari kanan, baris depan (baris paling bawah pada gambar) ada di sebelah kiri. Angka terbesar pada tiap baris adalah $2$ untuk baris bawah, $1$ untuk baris tengah, dan $3$ untuk baris atas. Membaca dari ujung yang salah menghasilkan 3, 1, 2. Gambar dengan dua kolom adalah tampak depan, dan 3, 2, 5 menjumlahkan angka pada tiap baris.',
              ),
              hint: L(
                'Eko stands on the right, so each row of the picture becomes one column. Which row is on his left? Take the biggest number in each row.',
                'Eko berdiri di sebelah kanan, jadi tiap baris pada gambar menjadi satu kolom. Baris mana yang ada di sebelah kirinya? Ambil angka terbesar pada tiap baris.',
              ),
            },
            {
              kind: 'fill',
              id: 'f1',
              math: true,
              prompt: L(
                'Try it together: only the front view and the side view of a tower are known. What is the most cubes the tower can have?',
                'Coba bersama: hanya tampak depan dan tampak samping sebuah menara yang diketahui. Berapa kubus paling banyak yang bisa dimiliki menara itu?',
              ),
              figure: {
                ...twoViews([2, 1, 2], [2, 1], true),
                caption: L(
                  'Left: the front view. Middle: the side view. Right: the empty top view.',
                  'Kiri: tampak depan. Tengah: tampak samping. Kanan: tampak atas yang masih kosong.',
                ),
              },
              template: {
                en: '\\text{front row (limit 2): } 2 + 1 + 2 = 5,\\quad \\text{back row (limit 1): } 1 + 1 + 1 = ___,\\quad \\text{most: } 5 + ___ = ___',
                id: '\\text{baris depan (batas 2): } 2 + 1 + 2 = 5,\\quad \\text{baris belakang (batas 1): } 1 + 1 + 1 = ___,\\quad \\text{paling banyak: } 5 + ___ = ___',
              },
              blanks: ['3', '3', '8'],
              explain: L(
                'The back row has limit 1, so each of its squares holds at most 1 cube: $1 + 1 + 1 = 3$. Altogether $5 + 3 = 8$ cubes at most.',
                'Baris belakang punya batas 1, jadi tiap persegi di sana memuat paling banyak 1 kubus: $1 + 1 + 1 = 3$. Seluruhnya paling banyak $5 + 3 = 8$ kubus.',
              ),
              hint: L(
                'A square cannot hold more than its row limit (side view) or its column allows (front view). Take the smaller number for each square.',
                'Sebuah persegi tidak boleh memuat lebih dari batas barisnya (tampak samping) atau yang diizinkan kolomnya (tampak depan). Ambil bilangan yang lebih kecil untuk tiap persegi.',
              ),
            },
            {
              kind: 'quiz',
              id: 'q2',
              prompt: L(
                'Only the front view and the side view of a tower are known. What is the smallest number of cubes the tower can have?',
                'Hanya tampak depan dan tampak samping sebuah menara yang diketahui. Berapa banyak kubus paling sedikit yang bisa dimiliki menara itu?',
              ),
              figure: {
                ...twoViews([3, 2, 1], [3, 3], true),
                caption: L(
                  'Left: the front view. Middle: the side view, seen from the right. Right: the empty top view.',
                  'Kiri: tampak depan. Tengah: tampak samping, dilihat dari kanan. Kanan: tampak atas yang masih kosong.',
                ),
              },
              options: [L('9 cubes', '9 kubus'), L('6 cubes', '6 kubus'), L('12 cubes', '12 kubus'), L('3 cubes', '3 kubus')],
              answer: 0,
              explain: L(
                'Both rows need a stack of 3, and only the left column is that tall, so the left column holds a stack of 3 in each row: $3 + 3 = 6$. The middle column needs 2 and the right column needs 1: $6 + 2 + 1 = 9$. 6 adds only the front view, 12 is the most, and 3 is just the tallest stack.',
                'Kedua baris butuh tumpukan 3, dan hanya kolom kiri yang setinggi itu, jadi kolom kiri berisi tumpukan 3 di setiap baris: $3 + 3 = 6$. Kolom tengah butuh 2 dan kolom kanan butuh 1: $6 + 2 + 1 = 9$. 6 hanya menjumlahkan tampak depan, 12 adalah yang paling banyak, dan 3 hanya tumpukan tertinggi.',
              ),
              hint: L(
                'Look at the side view: how many rows need a stack of 3? Which column of the front view is tall enough for that?',
                'Lihat tampak samping: ada berapa baris yang butuh tumpukan 3? Kolom mana pada tampak depan yang cukup tinggi untuk itu?',
              ),
            },
            {
              kind: 'judge',
              id: 'j1',
              prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
              figure: {
                ...twoViews([2, 3, 2], [3, 2], true),
                caption: L(
                  'The front view (left) and the side view (middle) of a tower. The empty top view has 2 rows and 3 columns.',
                  'Tampak depan (kiri) dan tampak samping (tengah) sebuah menara. Tampak atas yang kosong punya 2 baris dan 3 kolom.',
                ),
              },
              statements: [
                L('The tower has at least 7 cubes.', 'Menara itu punya paling sedikit 7 kubus.'),
                L('The tower can have only 6 cubes.', 'Menara itu bisa hanya punya 6 kubus.'),
                L('The stack of 3 cubes must stand in the front row.', 'Tumpukan 3 kubus pasti ada di baris depan.'),
                L('The tower can have at most 12 cubes.', 'Menara itu bisa punya paling banyak 12 kubus.'),
              ],
              answer: [true, false, true, false],
              explain: L(
                'The three columns need stacks of 2, 3 and 2, so at least $2 + 3 + 2 = 7$ cubes. The side view says the front row is 3 high and the back row only 2, so the stack of 3 must be in the front row. The most is $7 + 6 = 13$: front row $2 + 3 + 2$ and back row $2 + 2 + 2$. So 12 is not the most.',
                'Ketiga kolom butuh tumpukan 2, 3, dan 2, jadi paling sedikit $2 + 3 + 2 = 7$ kubus. Tampak samping menunjukkan baris depan setinggi 3 dan baris belakang hanya 2, jadi tumpukan 3 pasti ada di baris depan. Yang paling banyak adalah $7 + 6 = 13$: baris depan $2 + 3 + 2$ dan baris belakang $2 + 2 + 2$. Jadi 12 bukan yang paling banyak.',
              ),
              hint: L(
                'For the fewest, each column needs a stack as tall as its front view. For the most, take the smaller of the column limit and the row limit on each square.',
                'Untuk yang paling sedikit, setiap kolom butuh tumpukan setinggi tampak depannya. Untuk yang paling banyak, ambil yang lebih kecil antara batas kolom dan batas baris pada tiap persegi.',
              ),
            },
            {
              kind: 'math',
              id: 'm1',
              prompt: L(
                'Hasan builds towers on a base of 2 rows and 3 columns. Only the front view and the side view are known (see the picture). How many more cubes does the biggest possible tower have than the smallest possible tower?',
                'Hasan membuat menara di atas alas berukuran 2 baris dan 3 kolom. Hanya tampak depan dan tampak samping yang diketahui (lihat gambar). Berapa kubus lebih banyak yang dimiliki menara terbesar yang mungkin dibandingkan menara terkecil yang mungkin?',
              ),
              figure: {
                ...twoViews([4, 2, 3], [3, 4], true),
                caption: L(
                  'Left: the front view. Middle: the side view, seen from the right. Right: the empty top view.',
                  'Kiri: tampak depan. Tengah: tampak samping, dilihat dari kanan. Kanan: tampak atas yang masih kosong.',
                ),
              },
              blanks: [{ answer: 8, after: { en: '\\text{ cubes}', id: '\\text{ kubus}' } }],
              hints: [
                L(
                  'You need two numbers: the most cubes and the fewest cubes. Find them one at a time.',
                  'Kamu butuh dua bilangan: kubus paling banyak dan kubus paling sedikit. Cari satu per satu.',
                ),
                L(
                  'For the most, take the smaller of the column limit and the row limit on each square. For the fewest, add the front view and check that each row still gets its tall stack.',
                  'Untuk yang paling banyak, ambil yang lebih kecil antara batas kolom dan batas baris pada tiap persegi. Untuk yang paling sedikit, jumlahkan tampak depan dan periksa apakah tiap baris tetap mendapat tumpukan tingginya.',
                ),
                L(
                  'Most: front row (limit 3) is 3 + 2 + 3, back row (limit 4) is 4 + 2 + 3. Fewest: the columns need 4 + 2 + 3 and the rows can be right with those. Then subtract.',
                  'Paling banyak: baris depan (batas 3) adalah 3 + 2 + 3, baris belakang (batas 4) adalah 4 + 2 + 3. Paling sedikit: kolom-kolom butuh 4 + 2 + 3 dan baris-barisnya bisa benar dengan itu. Lalu kurangkan.',
                ),
              ],
              explain: L(
                'Most: the front row (limit 3) holds $3 + 2 + 3 = 8$ and the back row (limit 4) holds $4 + 2 + 3 = 9$, so 17 cubes. Fewest: the stack of 4 stands in the back row and a stack of 3 in the front row, so $4 + 2 + 3 = 9$. The difference is $17 - 9 = 8$.',
                'Paling banyak: baris depan (batas 3) memuat $3 + 2 + 3 = 8$ dan baris belakang (batas 4) memuat $4 + 2 + 3 = 9$, jadi 17 kubus. Paling sedikit: tumpukan 4 ada di baris belakang dan tumpukan 3 di baris depan, jadi $4 + 2 + 3 = 9$. Selisihnya $17 - 9 = 8$.',
              ),
              solution: {
                en: ['\\text{most: } (3 + 2 + 3) + (4 + 2 + 3) = 8 + 9 = 17', '\\text{fewest: } 4 + 2 + 3 = 9', '17 - 9 = 8\\text{ cubes}'],
                id: ['\\text{paling banyak: } (3 + 2 + 3) + (4 + 2 + 3) = 8 + 9 = 17', '\\text{paling sedikit: } 4 + 2 + 3 = 9', '17 - 9 = 8\\text{ kubus}'],
              },
            },
          ],
        },
      ],
      project: {
        id: 'tka-m9-s3-p',
        runtime: 'math',
        title: L('Project: Views and Stacks of Cubes', 'Proyek: Tampak dan Tumpukan Kubus'),
        brief: L(
          'Four problems about top views with numbers, side views, and towers where only two views are known.',
          'Empat soal tentang tampak atas dengan angka, tampak samping, dan menara yang hanya diketahui dua tampaknya.',
        ),
        requirements: [
          L('Read a top view with numbers and find the other views.', 'Membaca tampak atas dengan angka dan menentukan tampak yang lain.'),
          L('Find the fewest and the most cubes from two views.', 'Menentukan kubus paling sedikit dan paling banyak dari dua tampak.'),
        ],
        tasks: [
          {
            prompt: L(
              'The picture is the top view of a stack of cubes. The numbers tell how many cubes stand on each square. How many cubes are in the stack?',
              'Gambar ini adalah tampak atas sebuah tumpukan kubus. Angka-angkanya menyatakan banyaknya kubus pada tiap persegi. Berapa kubus dalam tumpukan itu?',
            ),
            figure: {
              ...planPiece([[1, 2, 2], [3, 1, 2]]),
              caption: L('The top view with numbers.', 'Tampak atas dengan angka.'),
            },
            blanks: [{ answer: 11, after: { en: '\\text{ cubes}', id: '\\text{ kubus}' } }],
            solution: ['1 + 2 + 2 + 3 + 1 + 2 = 11'],
          },
          {
            prompt: L(
              'The picture is the top view of a tower, with the number of cubes on each square. Fitri looks at the tower from the right-hand side (the arrow). How many squares does the side view have?',
              'Gambar ini adalah tampak atas sebuah menara, dengan banyaknya kubus pada tiap persegi. Fitri melihat menara dari sebelah kanan (panah). Berapa persegi yang dimiliki tampak sampingnya?',
            ),
            figure: {
              ...planPiece([[3, 1, 2], [1, 4, 1]], 'side'),
              caption: L('The top view with numbers. The arrow shows where Fitri stands.', 'Tampak atas dengan angka. Panah menunjukkan tempat Fitri berdiri.'),
            },
            blanks: [{ answer: 7, after: { en: '\\text{ squares}', id: '\\text{ persegi}' } }],
            solution: {
              en: ['\\text{front row: the biggest number is } 3,\\quad \\text{back row: the biggest number is } 4', '3 + 4 = 7\\text{ squares}'],
              id: ['\\text{baris depan: angka terbesar } 3,\\quad \\text{baris belakang: angka terbesar } 4', '3 + 4 = 7\\text{ persegi}'],
            },
          },
          {
            prompt: L(
              'Fitri has 20 small cubes. She builds the tower whose top view is in the picture (the numbers tell how many cubes stand on each square). How many cubes does she have left?',
              'Fitri punya 20 kubus kecil. Ia membangun menara yang tampak atasnya ada pada gambar (angka-angkanya menyatakan banyaknya kubus pada tiap persegi). Berapa kubus yang tersisa padanya?',
            ),
            figure: {
              ...planPiece([[2, 3, 1], [1, 2, 2], [3, 1, 0]]),
              caption: L('The top view of the tower, with numbers.', 'Tampak atas menara itu, dengan angka.'),
            },
            blanks: [{ answer: 5, after: { en: '\\text{ cubes}', id: '\\text{ kubus}' } }],
            solution: {
              en: ['2 + 3 + 1 + 1 + 2 + 2 + 3 + 1 + 0 = 15\\text{ cubes in the tower}', '20 - 15 = 5\\text{ cubes left}'],
              id: ['2 + 3 + 1 + 1 + 2 + 2 + 3 + 1 + 0 = 15\\text{ kubus pada menara}', '20 - 15 = 5\\text{ kubus tersisa}'],
            },
          },
          {
            prompt: L(
              'Only the front view and the side view of a tower are known. The tower stands on 2 rows and 3 columns. What is the fewest and what is the most number of cubes the tower can have?',
              'Hanya tampak depan dan tampak samping sebuah menara yang diketahui. Menara itu berdiri di atas 2 baris dan 3 kolom. Berapa banyak kubus paling sedikit dan paling banyak yang bisa dimiliki menara itu?',
            ),
            figure: {
              ...twoViews([2, 4, 1], [3, 4], true),
              caption: L(
                'Left: the front view. Middle: the side view, seen from the right. Right: the empty top view.',
                'Kiri: tampak depan. Tengah: tampak samping, dilihat dari kanan. Kanan: tampak atas yang masih kosong.',
              ),
            },
            blanks: [
              { answer: 10, label: { en: '\\text{fewest} =', id: '\\text{paling sedikit} =' } },
              { answer: 13, label: { en: '\\text{most} =', id: '\\text{paling banyak} =' } },
            ],
            inline: true,
            solution: {
              en: [
                '\\text{most: front row (limit 3): } 2 + 3 + 1 = 6,\\quad \\text{back row (limit 4): } 2 + 4 + 1 = 7',
                '6 + 7 = 13',
                '\\text{fewest: only the middle column can hold a stack of 3 for the front row, and the back row needs 4 there too: } 3 + 4 = 7',
                '7 + 2 + 1 = 10',
              ],
              id: [
                '\\text{paling banyak: baris depan (batas 3): } 2 + 3 + 1 = 6,\\quad \\text{baris belakang (batas 4): } 2 + 4 + 1 = 7',
                '6 + 7 = 13',
                '\\text{paling sedikit: hanya kolom tengah yang bisa memuat tumpukan 3 untuk baris depan, dan baris belakang juga butuh 4 di sana: } 3 + 4 = 7',
                '7 + 2 + 1 = 10',
              ],
            },
          },
        ],
        hints: [
          L(
            'Front view: the biggest number in each column. Side view: the biggest number in each row, front row first. Cubes in all: add every number.',
            'Tampak depan: angka terbesar pada tiap kolom. Tampak samping: angka terbesar pada tiap baris, dimulai dari baris depan. Seluruh kubus: jumlahkan semua angka.',
          ),
          L(
            'When only two views are known, every square has a limit: the smaller of its column and its row. Adding the limits gives the most cubes.',
            'Jika hanya dua tampak yang diketahui, setiap persegi punya batas: yang lebih kecil antara kolom dan barisnya. Menjumlahkan batas-batas itu menghasilkan kubus paling banyak.',
          ),
          L(
            'For the fewest, ask which squares can hold the tall stacks: a row that needs a stack of 3 can only use a column that is at least 3 high.',
            'Untuk yang paling sedikit, tanyakan persegi mana yang bisa memuat tumpukan tinggi: baris yang butuh tumpukan 3 hanya bisa memakai kolom yang tingginya minimal 3.',
          ),
        ],
        xp: 50,
      },
    },
  ],
}
