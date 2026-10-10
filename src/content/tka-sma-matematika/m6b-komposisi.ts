import type { Submodule } from '../types'
import { L, dot, line, plane } from './figs'
import type { Pt } from './figs'

/** Module 6, submodule 2 — compositions of transformations of points. */

const arrow = (from: Pt, to: Pt, color: 'a' | 'b' | 'c' | 'result' | 'muted' = 'muted') => ({ t: 'vec' as const, from, to, color })

export const m6s2: Submodule = {
  id: 'tka-sma-m6-s2',
  title: L('Compositions of Transformations', 'Komposisi Transformasi'),
  summary: L(
    'Combine two or more transformations of a point in the right order, name the result of two reflections or two rotations, and undo a composition.',
    'Menggabungkan dua transformasi atau lebih pada sebuah titik dengan urutan yang benar, menyebut hasil dua refleksi atau dua rotasi, dan membatalkan suatu komposisi.',
  ),
  lessons: [
    /* ------------------------------------------------------------- L1 order */
    {
      id: 'tka-sma-m6-s2-l1',
      title: L('Combining Two Transformations', 'Menggabungkan Dua Transformasi'),
      goal: L(
        'You can apply two transformations one after the other, see that the order matters, and name the result of two reflections.',
        'Kamu bisa menerapkan dua transformasi satu demi satu, melihat bahwa urutan berpengaruh, dan menyebut hasil dua refleksi.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Does the Order Matter?', 'Ayo Amati: Apakah Urutan Berpengaruh?'),
          body: L(
            'Take $P(1,3)$. Do two moves: **T**, a translation by $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, and **R**, a reflection in the $y$-axis.\n\n- First T then R: $(1,3)\\to(3,3)\\to(-3,3)$.\n- First R then T: $(1,3)\\to(-1,3)\\to(1,3)$.\n\nThe results differ, $(-3,3)$ against $(1,3)$. So the **order matters**: the first move is done first, and the second move acts on its image.\n\nA **composition** of transformations is "do one, then the other". Written with function notation, $R\\circ T$ means T first and then R (the move written on the right is done first), just like composite functions.',
            'Ambil $P(1,3)$. Lakukan dua gerakan: **T**, translasi $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, dan **R**, refleksi pada sumbu $y$.\n\n- T dulu lalu R: $(1,3)\\to(3,3)\\to(-3,3)$.\n- R dulu lalu T: $(1,3)\\to(-1,3)\\to(1,3)$.\n\nHasilnya berbeda, $(-3,3)$ dan $(1,3)$. Jadi **urutan berpengaruh**: gerakan pertama dilakukan lebih dulu, dan gerakan kedua bekerja pada bayangannya.\n\n**Komposisi** transformasi berarti "lakukan yang satu, lalu yang lain". Dengan notasi fungsi, $R\\circ T$ berarti T dulu lalu R (gerakan yang ditulis di kanan dilakukan lebih dulu), sama seperti fungsi komposisi.',
          ),
          figure: {
            ...plane(
              [
                dot([1, 3], 'P', 'a'),
                dot([3, 3], undefined, 'b'),
                dot([-3, 3], undefined, 'result'),
                arrow([1.1, 3], [2.8, 3], 'b'),
                arrow([2.8, 3.4], [-2.8, 3.4], 'result'),
                { t: 'vline', x: 0, color: 'muted', dashed: true },
              ],
              { x: [-5, 5], y: [-1, 6] },
            ),
            caption: L('P, then the translation to (3, 3), then the reflection in the y-axis to (-3, 3).', 'P, lalu translasi ke (3, 3), lalu refleksi pada sumbu y ke (-3, 3).'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Two Reflections Make Something New', 'Contoh Bertahap: Dua Refleksi Menghasilkan Sesuatu yang Baru'),
          body: L(
            'Reflect $P(2,3)$ in the $x$-axis and then in the $y$-axis.\n\n1. Step 1: Reflection in the $x$-axis: $(2,3)\\to(2,-3)$.\n2. Step 2: Reflection in the $y$-axis: $(2,-3)\\to(-2,-3)$.\n3. Step 3: The end point $(-2,-3)$ is $(-x,-y)$, a **half-turn** ($180^{\\circ}$ rotation) about the origin.\n\nIn general:\n\n- Two reflections in **parallel** mirrors make a **translation** (twice the distance between the mirrors, perpendicular to them).\n- Two reflections in mirrors that **cross** make a **rotation** about the crossing point (twice the angle between the mirrors).',
            'Cerminkan $P(2,3)$ pada sumbu $x$ lalu pada sumbu $y$.\n\n1. Langkah 1: Refleksi pada sumbu $x$: $(2,3)\\to(2,-3)$.\n2. Langkah 2: Refleksi pada sumbu $y$: $(2,-3)\\to(-2,-3)$.\n3. Langkah 3: Titik akhir $(-2,-3)$ adalah $(-x,-y)$, yaitu **setengah putaran** (rotasi $180^{\\circ}$) terhadap titik asal.\n\nSecara umum:\n\n- Dua refleksi pada cermin **sejajar** menghasilkan **translasi** (dua kali jarak antara cermin, tegak lurus terhadap cermin).\n- Dua refleksi pada cermin yang **berpotongan** menghasilkan **rotasi** terhadap titik potong (dua kali sudut antara cermin).',
          ),
          figure: {
            ...plane(
              [
                dot([2, 3], 'P', 'a'),
                dot([2, -3], undefined, 'b'),
                dot([-2, -3], undefined, 'result'),
                line([2, 3], [2, -3], 'muted', { dashed: true }),
                line([2, -3], [-2, -3], 'muted', { dashed: true }),
              ],
              { span: 5 },
            ),
            caption: L('P, then its image in the x-axis, then in the y-axis.', 'P, lalu bayangannya pada sumbu x, lalu pada sumbu y.'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Three Moves in a Row', 'Contoh Bertahap: Tiga Gerakan Berurutan'),
          body: L(
            'A composition can have any number of moves. Do them **one at a time** and write each image.\n\nTake $P(2,1)$ and do: a dilation with center $O$ and scale factor 2, then a reflection in the $y$-axis, then a translation by $\\begin{pmatrix}1\\\\3\\end{pmatrix}$.\n\n1. Step 1: Dilation: $(2,1)\\to(4,2)$.\n2. Step 2: Reflection in the $y$-axis: $(4,2)\\to(-4,2)$.\n3. Step 3: Translation: $(-4,2)+(1,3)=(-3,5)$.\n\nThe final point is $(-3,5)$.\n\n**Tips:**\n\n- Never try to do two moves in your head at once. Write every image.\n- If the question says "$S$ followed by $T$", do $S$ first. If it says "$T\\circ S$", it is the same: $S$ first.\n- Check each step with a quick sketch: does the image land where you expect (left or right of the mirror, bigger or smaller)?',
            'Komposisi dapat memuat sebanyak apa pun gerakan. Lakukan **satu per satu** dan tulis setiap bayangan.\n\nAmbil $P(2,1)$ dan lakukan: dilatasi berpusat $O$ dengan faktor skala 2, lalu refleksi pada sumbu $y$, lalu translasi $\\begin{pmatrix}1\\\\3\\end{pmatrix}$.\n\n1. Langkah 1: Dilatasi: $(2,1)\\to(4,2)$.\n2. Langkah 2: Refleksi pada sumbu $y$: $(4,2)\\to(-4,2)$.\n3. Langkah 3: Translasi: $(-4,2)+(1,3)=(-3,5)$.\n\nTitik akhirnya $(-3,5)$.\n\n**Tips:**\n\n- Jangan mencoba melakukan dua gerakan sekaligus di kepala. Tulis setiap bayangan.\n- Jika soal berbunyi "$S$ dilanjutkan $T$", lakukan $S$ dulu. Jika berbunyi "$T\\circ S$", sama saja: $S$ dulu.\n- Periksa tiap langkah dengan sketsa cepat: apakah bayangan jatuh di tempat yang kamu duga (kiri atau kanan cermin, lebih besar atau lebih kecil)?',
          ),
          figure: {
            ...plane(
              [
                dot([2, 1], 'P', 'a'),
                dot([4, 2], undefined, 'b'),
                dot([-4, 2], undefined, 'c'),
                dot([-3, 5], undefined, 'result'),
                arrow([2.1, 1.05], [3.9, 1.95], 'b'),
                arrow([3.8, 2.3], [-3.8, 2.3], 'c'),
                arrow([-3.95, 2.1], [-3.1, 4.85], 'result'),
              ],
              { x: [-6, 6], y: [-1, 7] },
            ),
            caption: L('P(2, 1), then (4, 2), then (-4, 2), then (-3, 5).', 'P(2, 1), lalu (4, 2), lalu (-4, 2), lalu (-3, 5).'),
          },
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The point $P(1,3)$ is mapped to $P_2(-3,3)$ through the point $P_1(3,3)$. Which order of moves does this?',
            'Titik $P(1,3)$ dipetakan ke $P_2(-3,3)$ melalui titik $P_1(3,3)$. Urutan gerakan manakah yang melakukannya?',
          ),
          figure: {
            ...plane(
              [
                dot([1, 3], 'P', 'a'),
                dot([3, 3], 'P1', 'b'),
                dot([-3, 3], 'P2', 'result'),
                { t: 'vline', x: 0, color: 'muted', dashed: true },
              ],
              { x: [-5, 5], y: [-1, 6] },
            ),
            caption: L('Three points on the line y = 3.', 'Tiga titik pada garis y = 3.'),
          },
          options: [
            L('Translate by $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, then reflect in the $y$-axis', 'Translasi $\\begin{pmatrix}2\\\\0\\end{pmatrix}$, lalu refleksi pada sumbu $y$'),
            L('Reflect in the $y$-axis, then translate by $\\begin{pmatrix}2\\\\0\\end{pmatrix}$', 'Refleksi pada sumbu $y$, lalu translasi $\\begin{pmatrix}2\\\\0\\end{pmatrix}$'),
            L('Translate by $\\begin{pmatrix}-2\\\\0\\end{pmatrix}$, then reflect in the $x$-axis', 'Translasi $\\begin{pmatrix}-2\\\\0\\end{pmatrix}$, lalu refleksi pada sumbu $x$'),
            L('Reflect in the $x$-axis, then translate by $\\begin{pmatrix}2\\\\0\\end{pmatrix}$', 'Refleksi pada sumbu $x$, lalu translasi $\\begin{pmatrix}2\\\\0\\end{pmatrix}$'),
          ],
          answer: 0,
          explain: L(
            'From $P(1,3)$ to $P_1(3,3)$ is a translation by $(2,0)$; then the reflection in the $y$-axis sends $(3,3)$ to $(-3,3)$. The other order gives $(1,3)$ again, and the options with the $x$-axis move the point off the line $y=3$.',
            'Dari $P(1,3)$ ke $P_1(3,3)$ adalah translasi $(2,0)$; lalu refleksi pada sumbu $y$ memetakan $(3,3)$ ke $(-3,3)$. Urutan sebaliknya memberi $(1,3)$ lagi, dan pilihan dengan sumbu $x$ memindahkan titik dari garis $y=3$.',
          ),
          hint: L(
            'Check the middle point first: which single move takes $P$ to $P_1$?',
            'Periksa titik tengah dulu: gerakan tunggal mana yang membawa $P$ ke $P_1$?',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: translate $(1,3)$ by $(2,0)$ and then reflect in the $y$-axis.',
            'Coba bersama: geser $(1,3)$ dengan $(2,0)$ lalu cerminkan pada sumbu $y$.',
          ),
          template: '(1,3)\\to(3,3)\\to(___,\\ 3)',
          blanks: ['-3'],
          explain: L(
            'The $y$-axis reflection changes the sign of $x$: $3\\to-3$.',
            'Refleksi sumbu $y$ mengubah tanda $x$: $3\\to-3$.',
          ),
          hint: L(
            'Which coordinate changes sign in a reflection in the $y$-axis?',
            'Koordinat mana yang berubah tanda pada refleksi sumbu $y$?',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('Two reflections in parallel mirrors make a translation.', 'Dua refleksi pada cermin sejajar menghasilkan translasi.'),
            L('A reflection in the $x$-axis followed by one in the $y$-axis equals a rotation of $180^{\\circ}$ about $O$.', 'Refleksi pada sumbu $x$ dilanjutkan pada sumbu $y$ sama dengan rotasi $180^{\\circ}$ terhadap $O$.'),
            L('The order of two transformations never matters.', 'Urutan dua transformasi tidak pernah berpengaruh.'),
            L('Two reflections in perpendicular mirrors make a translation.', 'Dua refleksi pada cermin yang saling tegak lurus menghasilkan translasi.'),
          ],
          answer: [0, 1],
          explain: L(
            'The order did matter for $P(1,3)$. And two reflections in mirrors that cross, such as the two axes, make a rotation, not a translation.',
            'Urutan terbukti berpengaruh untuk $P(1,3)$. Dan dua refleksi pada cermin yang berpotongan, seperti kedua sumbu, menghasilkan rotasi, bukan translasi.',
          ),
          hint: L(
            'Parallel mirrors never cross; crossing mirrors have a center to turn about.',
            'Cermin sejajar tidak berpotongan; cermin yang berpotongan punya pusat untuk berputar.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('A translation followed by a reflection can give a different result from the reflection followed by the translation.', 'Translasi dilanjutkan refleksi dapat memberi hasil yang berbeda dari refleksi dilanjutkan translasi.'),
            L('Two translations in a row make a translation.', 'Dua translasi berurutan menghasilkan translasi.'),
            L('Two reflections in the same mirror, one after the other, give a rotation.', 'Dua refleksi pada cermin yang sama, satu demi satu, menghasilkan rotasi.'),
            L('In $R\\circ T$, the transformation $R$ is done first.', 'Pada $R\\circ T$, transformasi $R$ dilakukan lebih dulu.'),
          ],
          answer: [true, true, false, false],
          explain: L(
            'Adding vectors gives another translation. Reflecting twice in the same mirror brings every point back where it started. In $R\\circ T$ the move on the right, $T$, is done first.',
            'Menjumlahkan vektor memberi translasi lain. Mencerminkan dua kali pada cermin yang sama mengembalikan setiap titik ke tempat semula. Pada $R\\circ T$ gerakan di kanan, $T$, dilakukan lebih dulu.',
          ),
          hint: L(
            'For the third statement, reflect a point twice in the same mirror and see where it ends.',
            'Untuk pernyataan ketiga, cerminkan sebuah titik dua kali pada cermin yang sama dan lihat di mana ia berakhir.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The point $P(2,1)$ is dilated with center $O$ and scale factor 2, then reflected in the $y$-axis, then translated by $\\begin{pmatrix}1\\\\3\\end{pmatrix}$. Find the final point.',
            'Titik $P(2,1)$ didilatasi berpusat $O$ dengan faktor skala 2, lalu dicerminkan pada sumbu $y$, lalu digeser dengan $\\begin{pmatrix}1\\\\3\\end{pmatrix}$. Tentukan titik akhirnya.',
          ),
          inline: true,
          blanks: [
            { label: 'x =', answer: -3 },
            { label: 'y =', answer: 5 },
          ],
          hints: [
            L('Do the moves one at a time and write each image.', 'Lakukan gerakan satu per satu dan tulis setiap bayangan.'),
            L('Dilation: $(4,2)$. Reflection in the $y$-axis: $(-4,2)$.', 'Dilatasi: $(4,2)$. Refleksi pada sumbu $y$: $(-4,2)$.'),
            L('Add the vector: $(-4+1,\\ 2+3)$.', 'Tambahkan vektornya: $(-4+1,\\ 2+3)$.'),
          ],
          explain: L(
            '$(2,1)\\to(4,2)\\to(-4,2)\\to(-3,5)$.',
            '$(2,1)\\to(4,2)\\to(-4,2)\\to(-3,5)$.',
          ),
          solution: ['(2,1)\\to(4,2)\\to(-4,2)', '(-4,2)+(1,3)=(-3,5)'],
        },
      ],
    },
    /* ------------------------------------------- L2 rotations, dilations, undoing */
    {
      id: 'tka-sma-m6-s2-l2',
      title: L('Rotations, Dilations and Undoing a Composition', 'Rotasi, Dilatasi, dan Membatalkan Komposisi'),
      goal: L(
        'You can combine rotations and dilations, dilate about a center that is not the origin, and work backward to find the starting point.',
        'Kamu bisa menggabungkan rotasi dan dilatasi, mendilatasi terhadap pusat yang bukan titik asal, dan bekerja mundur untuk mencari titik awal.',
      ),
      xp: 20,
      steps: [
        {
          kind: 'concept',
          id: 'c1',
          title: L('Look Closely: Turns Add Up', 'Ayo Amati: Putaran Saling Menjumlah'),
          body: L(
            'Rotations about the **same center** add their angles. Rotating $90^{\\circ}$ counterclockwise twice is one rotation of $180^{\\circ}$.\n\nTake $P(3,1)$ and the rule $(x,y)\\to(-y,x)$ for $90^{\\circ}$ counterclockwise:\n\n1. Step 1: $P(3,1)\\to P_1(-1,3)$.\n2. Step 2: $P_1(-1,3)\\to P_2(-3,-1)$.\n3. Step 3: One rotation of $180^{\\circ}$ gives $(-x,-y)=(-3,-1)$ ✓.\n\nSo $90^{\\circ}$ then $90^{\\circ}$ is $180^{\\circ}$, $90^{\\circ}$ then $270^{\\circ}$ is $360^{\\circ}$ (back where you started), and a turn of $-90^{\\circ}$ undoes a turn of $90^{\\circ}$.',
            'Rotasi terhadap **pusat yang sama** menjumlahkan sudutnya. Memutar $90^{\\circ}$ berlawanan arah jarum jam dua kali sama dengan satu rotasi $180^{\\circ}$.\n\nAmbil $P(3,1)$ dan aturan $(x,y)\\to(-y,x)$ untuk $90^{\\circ}$ berlawanan arah jarum jam:\n\n1. Langkah 1: $P(3,1)\\to P_1(-1,3)$.\n2. Langkah 2: $P_1(-1,3)\\to P_2(-3,-1)$.\n3. Langkah 3: Satu rotasi $180^{\\circ}$ memberi $(-x,-y)=(-3,-1)$ ✓.\n\nJadi $90^{\\circ}$ lalu $90^{\\circ}$ adalah $180^{\\circ}$, $90^{\\circ}$ lalu $270^{\\circ}$ adalah $360^{\\circ}$ (kembali ke awal), dan putaran $-90^{\\circ}$ membatalkan putaran $90^{\\circ}$.',
          ),
          figure: {
            ...plane(
              [
                dot([3, 1], 'P', 'a'),
                dot([-1, 3], 'P1', 'b'),
                dot([-3, -1], 'P2', 'result'),
                line([0, 0], [3, 1], 'a', { width: 2 }),
                line([0, 0], [-1, 3], 'b', { width: 2 }),
                line([0, 0], [-3, -1], 'result', { width: 2 }),
              ],
              { span: 5 },
            ),
            caption: L('Two turns of 90° about the origin make a turn of 180°.', 'Dua putaran 90° terhadap titik asal menjadi putaran 180°.'),
          },
        },
        {
          kind: 'concept',
          id: 'c2',
          title: L('Step by Step: Dilations in Combination', 'Contoh Bertahap: Dilatasi dalam Komposisi'),
          body: L(
            '- Two dilations about the **same center** multiply their factors: factor 2 then factor 3 is factor $6$.\n- A dilation followed by a translation: $(x,y)\\to(kx,ky)\\to(kx+a,\\ ky+b)$.\n- Areas multiply by $k^2$ each time: factor 2 then factor 3 gives $6^2=36$ times the area.\n\n**A center that is not the origin.** Dilate $P(3,2)$ about $C(1,1)$ with factor 2.\n\n1. Step 1: Vector from the center to $P$: $P-C=(2,1)$.\n2. Step 2: Multiply by the factor: $2\\times(2,1)=(4,2)$.\n3. Step 3: Add the center back: $C+(4,2)=(5,3)$.\n\nThe image $P\'(5,3)$ is on the line from $C$ through $P$, twice as far from $C$.',
            '- Dua dilatasi terhadap **pusat yang sama** mengalikan faktornya: faktor 2 lalu faktor 3 adalah faktor $6$.\n- Dilatasi dilanjutkan translasi: $(x,y)\\to(kx,ky)\\to(kx+a,\\ ky+b)$.\n- Luas dikalikan $k^2$ setiap kali: faktor 2 lalu faktor 3 memberi $6^2=36$ kali luas.\n\n**Pusat yang bukan titik asal.** Dilatasi $P(3,2)$ terhadap $C(1,1)$ dengan faktor 2.\n\n1. Langkah 1: Vektor dari pusat ke $P$: $P-C=(2,1)$.\n2. Langkah 2: Kalikan dengan faktor: $2\\times(2,1)=(4,2)$.\n3. Langkah 3: Tambahkan pusat kembali: $C+(4,2)=(5,3)$.\n\nBayangan $P\'(5,3)$ berada pada garis dari $C$ melalui $P$, dua kali lebih jauh dari $C$.',
          ),
          figure: {
            ...plane(
              [
                dot([1, 1], 'C', 'muted'),
                dot([3, 2], 'P', 'a'),
                dot([5, 3], undefined, 'result'),
                line([1, 1], [5, 3], 'muted', { dashed: true }),
              ],
              { x: [-1, 8], y: [-1, 6] },
            ),
            caption: L('A dilation about C(1, 1) with factor 2 sends P(3, 2) to (5, 3).', 'Dilatasi terhadap C(1, 1) dengan faktor 2 memetakan P(3, 2) ke (5, 3).'),
          },
        },
        {
          kind: 'concept',
          id: 'c3',
          title: L('Step by Step: Undoing a Composition', 'Contoh Bertahap: Membatalkan Komposisi'),
          body: L(
            'To find the **starting point** from the final point, undo the moves **in the reverse order**, each by its inverse.\n\n| Move | Its inverse |\n|---|---|\n| translation by $(a,b)$ | translation by $(-a,-b)$ |\n| reflection in a line | the same reflection |\n| rotation by $\\theta$ | rotation by $-\\theta$ |\n| dilation with factor $k$ | dilation with factor $\\frac{1}{k}$ |\n\nA point is dilated with factor 3 (center $O$) and then translated by $\\begin{pmatrix}2\\\\-1\\end{pmatrix}$. The result is $(11,5)$. Find the start.\n\n1. Step 1: Undo the translation (last move first): $(11-2,\\ 5+1)=(9,6)$.\n2. Step 2: Undo the dilation: $\\left(\\frac{9}{3},\\frac{6}{3}\\right)=(3,2)$.\n3. Step 3: Check forward: $(3,2)\\to(9,6)\\to(11,5)$ ✓.',
            'Untuk mencari **titik awal** dari titik akhir, batalkan gerakan **dengan urutan terbalik**, masing-masing dengan inversnya.\n\n| Gerakan | Inversnya |\n|---|---|\n| translasi $(a,b)$ | translasi $(-a,-b)$ |\n| refleksi pada suatu garis | refleksi yang sama |\n| rotasi sebesar $\\theta$ | rotasi sebesar $-\\theta$ |\n| dilatasi dengan faktor $k$ | dilatasi dengan faktor $\\frac{1}{k}$ |\n\nSebuah titik didilatasi dengan faktor 3 (pusat $O$) lalu digeser dengan $\\begin{pmatrix}2\\\\-1\\end{pmatrix}$. Hasilnya $(11,5)$. Cari titik awalnya.\n\n1. Langkah 1: Batalkan translasi (gerakan terakhir lebih dulu): $(11-2,\\ 5+1)=(9,6)$.\n2. Langkah 2: Batalkan dilatasi: $\\left(\\frac{9}{3},\\frac{6}{3}\\right)=(3,2)$.\n3. Langkah 3: Periksa maju: $(3,2)\\to(9,6)\\to(11,5)$ ✓.',
          ),
        },
        {
          kind: 'quiz',
          id: 'q1',
          prompt: L(
            'The point $P(3,2)$ is dilated about the center $C(1,1)$ with scale factor 2. What is the image?',
            'Titik $P(3,2)$ didilatasi terhadap pusat $C(1,1)$ dengan faktor skala 2. Apa bayangannya?',
          ),
          figure: {
            ...plane(
              [
                dot([1, 1], 'C', 'muted'),
                dot([3, 2], 'P', 'a'),
                line([1, 1], [3, 2], 'a', { width: 2 }),
              ],
              { x: [-1, 8], y: [-1, 6] },
            ),
            caption: L('The center C and the point P.', 'Pusat C dan titik P.'),
          },
          options: [L('$(5,3)$', '$(5,3)$'), L('$(6,4)$', '$(6,4)$'), L('$(4,\\frac{3}{2})$', '$(4,\\frac{3}{2})$'), L('$(7,5)$', '$(7,5)$')],
          answer: 0,
          explain: L(
            'The vector from $C$ to $P$ is $(2,1)$. Doubling it gives $(4,2)$, and adding it to $C$ gives $(5,3)$. The point $(6,4)$ is a dilation about the origin, and $(4,\\frac{3}{2})$ uses factor $\\frac{1}{2}$.',
            'Vektor dari $C$ ke $P$ adalah $(2,1)$. Digandakan menjadi $(4,2)$, dan ditambahkan ke $C$ menjadi $(5,3)$. Titik $(6,4)$ adalah dilatasi terhadap titik asal, dan $(4,\\frac{3}{2})$ memakai faktor $\\frac{1}{2}$.',
          ),
          hint: L(
            'Find the vector from the center to $P$, scale it, and add it back to the center.',
            'Cari vektor dari pusat ke $P$, skalakan, lalu tambahkan kembali ke pusat.',
          ),
        },
        {
          kind: 'fill',
          id: 'f1',
          math: true,
          prompt: L(
            'Try it together: undo the translation by $(2,-1)$ and then the dilation with factor 3 from the final point $(11,5)$.',
            'Coba bersama: batalkan translasi $(2,-1)$ lalu dilatasi faktor 3 dari titik akhir $(11,5)$.',
          ),
          template: '(11-2,\\ 5+1)=(9,6) \\Rightarrow \\left(\\frac{9}{3},\\frac{6}{3}\\right)=(___,\\ ___)',
          blanks: ['3', '2'],
          explain: L(
            'Undo the last move first: the translation. Then divide by the dilation factor.',
            'Batalkan gerakan terakhir lebih dulu: translasi. Lalu bagi dengan faktor dilatasi.',
          ),
          hint: L(
            'Divide each coordinate of $(9,6)$ by 3.',
            'Bagi tiap koordinat $(9,6)$ dengan 3.',
          ),
        },
        {
          kind: 'multi',
          id: 'mc1',
          prompt: L('Choose the TWO true statements.', 'Pilih DUA pernyataan yang benar.'),
          options: [
            L('Two rotations of $90^{\\circ}$ about the same center make a rotation of $180^{\\circ}$.', 'Dua rotasi $90^{\\circ}$ terhadap pusat yang sama menghasilkan rotasi $180^{\\circ}$.'),
            L('A dilation with factor 2 followed by one with factor 3 (same center) is a dilation with factor 6.', 'Dilatasi faktor 2 dilanjutkan faktor 3 (pusat sama) adalah dilatasi faktor 6.'),
            L('The inverse of the translation by $(a,b)$ is the translation by $(a,b)$.', 'Invers translasi $(a,b)$ adalah translasi $(a,b)$.'),
            L('The inverse of a dilation with factor $k$ is a dilation with factor $-k$.', 'Invers dilatasi faktor $k$ adalah dilatasi faktor $-k$.'),
          ],
          answer: [0, 1],
          explain: L(
            'The inverse of a translation reverses the vector, $(-a,-b)$, and the inverse of a dilation with factor $k$ has factor $\\frac{1}{k}$.',
            'Invers translasi membalik vektor, $(-a,-b)$, dan invers dilatasi faktor $k$ berfaktor $\\frac{1}{k}$.',
          ),
          hint: L(
            'To undo a move, think about what brings the point back.',
            'Untuk membatalkan suatu gerakan, pikirkan apa yang mengembalikan titik itu.',
          ),
        },
        {
          kind: 'judge',
          id: 'j1',
          prompt: L('Decide whether each statement is True or False.', 'Tentukan tiap pernyataan Benar atau Salah.'),
          statements: [
            L('To undo a composition, undo the moves in the same order as they were done.', 'Untuk membatalkan komposisi, batalkan gerakan dengan urutan yang sama seperti saat dilakukan.'),
            L('A reflection is undone by the same reflection.', 'Refleksi dibatalkan oleh refleksi yang sama.'),
            L('A dilation with factor $\\frac{1}{2}$ is undone by a dilation with factor 2.', 'Dilatasi faktor $\\frac{1}{2}$ dibatalkan oleh dilatasi faktor 2.'),
            L('A rotation of $90^{\\circ}$ counterclockwise is undone by another rotation of $90^{\\circ}$ counterclockwise.', 'Rotasi $90^{\\circ}$ berlawanan arah jarum jam dibatalkan oleh rotasi $90^{\\circ}$ berlawanan arah jarum jam lagi.'),
          ],
          answer: [false, true, true, false],
          explain: L(
            'Undo in the **reverse** order. A second $90^{\\circ}$ counterclockwise turn would make $180^{\\circ}$; undoing needs a turn of $-90^{\\circ}$ (clockwise).',
            'Batalkan dengan urutan **terbalik**. Putaran $90^{\\circ}$ berlawanan arah jarum jam kedua akan menjadi $180^{\\circ}$; pembatalan memerlukan putaran $-90^{\\circ}$ (searah jarum jam).',
          ),
          hint: L(
            'Think of taking off shoes and socks: the order is reversed.',
            'Bayangkan melepas sepatu dan kaus kaki: urutannya terbalik.',
          ),
        },
        {
          kind: 'math',
          id: 'm1',
          prompt: L(
            'The point $P(2,1)$ is dilated with center $O$ and factor 2, and then rotated $90^{\\circ}$ counterclockwise about $O$. Find the final point.',
            'Titik $P(2,1)$ didilatasi berpusat $O$ dan faktor 2, lalu diputar $90^{\\circ}$ berlawanan arah jarum jam terhadap $O$. Tentukan titik akhirnya.',
          ),
          inline: true,
          blanks: [
            { label: 'x =', answer: -2 },
            { label: 'y =', answer: 4 },
          ],
          hints: [
            L('Dilate first: multiply both coordinates by 2.', 'Dilatasi dulu: kalikan kedua koordinat dengan 2.'),
            L('$(2,1)\\to(4,2)$. Now use the rule $(x,y)\\to(-y,x)$.', '$(2,1)\\to(4,2)$. Sekarang pakai aturan $(x,y)\\to(-y,x)$.'),
            L('Apply it to $(4,2)$.', 'Terapkan pada $(4,2)$.'),
          ],
          explain: L(
            '$(2,1)\\to(4,2)\\to(-2,4)$.',
            '$(2,1)\\to(4,2)\\to(-2,4)$.',
          ),
          solution: ['(2,1)\\to(4,2)', '(4,2)\\to(-2,\\ 4)'],
        },
      ],
    },
  ],
  project: {
    id: 'tka-sma-m6-s2-p',
    runtime: 'math',
    title: L('Compositions at Work', 'Komposisi dalam Pemakaian'),
    brief: L(
      'Apply compositions of transformations to points, name the single transformation they make, and undo them.',
      'Terapkan komposisi transformasi pada titik, sebutkan transformasi tunggal yang dihasilkannya, dan batalkan.',
    ),
    requirements: [
      L('Do the moves in order and write every image.', 'Melakukan gerakan secara berurutan dan menulis setiap bayangan.'),
      L('Undo a composition in the reverse order.', 'Membatalkan komposisi dengan urutan terbalik.'),
    ],
    hints: [
      L('Write the image after every single move.', 'Tulis bayangan setelah setiap gerakan.'),
      L('Two reflections in parallel mirrors make a translation of twice the distance between them.', 'Dua refleksi pada cermin sejajar menghasilkan translasi sejauh dua kali jarak antara keduanya.'),
      L('To undo, reverse the order and use the inverse of each move.', 'Untuk membatalkan, balik urutan dan pakai invers tiap gerakan.'),
    ],
    xp: 50,
    tasks: [
      {
        prompt: L(
          'The point $(2,5)$ is translated by $\\begin{pmatrix}-3\\\\4\\end{pmatrix}$ and then reflected in the $x$-axis. Find the final point.',
          'Titik $(2,5)$ digeser dengan $\\begin{pmatrix}-3\\\\4\\end{pmatrix}$ lalu dicerminkan pada sumbu $x$. Tentukan titik akhirnya.',
        ),
        inline: true,
        blanks: [
          { label: 'x =', answer: -1 },
          { label: 'y =', answer: -9 },
        ],
        solution: ['(2,5)+(-3,4)=(-1,9)', '(-1,9)\\to(-1,-9)'],
      },
      {
        prompt: L(
          'The point $(0,0)$ is reflected in the line $x=1$ and then in the line $x=4$. How far to the right has it moved in all?',
          'Titik $(0,0)$ dicerminkan pada garis $x=1$ lalu pada garis $x=4$. Berapa jauh titik itu telah bergeser ke kanan seluruhnya?',
        ),
        figure: {
          ...plane(
            [
              { t: 'vline', x: 1, color: 'muted', dashed: true },
              { t: 'vline', x: 4, color: 'muted', dashed: true },
              dot([0, 0], 'P', 'a'),
            ],
            { x: [-2, 8], y: [-3, 3] },
          ),
          caption: L('The point P and the two mirror lines x = 1 and x = 4.', 'Titik P dan kedua garis cermin x = 1 dan x = 4.'),
        },
        blanks: [{ answer: 6 }],
        solution: ['(0,0)\\to(2,0)\\to(6,0)', '2\\times(4-1)=6'],
      },
      {
        prompt: L(
          'The point $(4,-1)$ is rotated $90^{\\circ}$ counterclockwise about $O$ and then another $180^{\\circ}$ counterclockwise. Find the final point.',
          'Titik $(4,-1)$ diputar $90^{\\circ}$ berlawanan arah jarum jam terhadap $O$ lalu $180^{\\circ}$ berlawanan arah jarum jam lagi. Tentukan titik akhirnya.',
        ),
        inline: true,
        blanks: [
          { label: 'x =', answer: -1 },
          { label: 'y =', answer: -4 },
        ],
        solution: ['(4,-1)\\to(1,4) \\quad (-y,x)', '(1,4)\\to(-1,-4) \\quad (-x,-y)'],
      },
      {
        prompt: L(
          'A point is dilated with factor 4 (center $O$) and then translated by $\\begin{pmatrix}-2\\\\6\\end{pmatrix}$. The result is $(14,2)$. Find the starting point.',
          'Sebuah titik didilatasi dengan faktor 4 (pusat $O$) lalu digeser dengan $\\begin{pmatrix}-2\\\\6\\end{pmatrix}$. Hasilnya $(14,2)$. Tentukan titik awalnya.',
        ),
        inline: true,
        blanks: [
          { label: 'x =', answer: 4 },
          { label: 'y =', answer: -1 },
        ],
        solution: ['(14+2,\\ 2-6)=(16,-4)', '\\left(\\frac{16}{4},\\frac{-4}{4}\\right)=(4,-1)'],
      },
      {
        prompt: L(
          'A triangle of area 5 is dilated with factor 2 and then again with factor 3 (same center). What is the area of the final triangle?',
          'Sebuah segitiga berluas 5 didilatasi dengan faktor 2 lalu lagi dengan faktor 3 (pusat sama). Berapa luas segitiga akhirnya?',
        ),
        blanks: [{ answer: 180 }],
        solution: ['k=2\\times3=6', '5\\times6^2=180'],
      },
    ],
  },
}
