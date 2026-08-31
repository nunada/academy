import type { Module } from '../types'

/** Module 3 — the game-dev course's own runtime (start/update/draw,
 *  returning box/circle/line/text commands), reused for still pictures
 *  worth showing a class rather than something to play. update() simply
 *  returns the state unchanged in every exercise here — nothing moves yet;
 *  that is module 4. Every check calls start()/update()/draw() directly
 *  with a made-up state, exactly like the game-dev course's own tests — no
 *  canvas involved in grading, only in the preview underneath it. */
export const module3: Module = {
  id: 'pymed-m3',
  title: { en: 'Labeled Static Figures', id: 'Peraga Statis Berlabel' },
  summary: {
    en: 'A picture is data, the same way a game is — reuse that to build a labeled shape and a number line worth putting in front of a class.',
    id: 'Gambar adalah data, sama seperti game — pakai itu untuk membangun bentuk berlabel dan garis bilangan yang layak ditunjukkan ke kelas.',
  },
  submodules: [
    /* ------------------------------------------------------- 3.1 labeled shapes */
    {
      id: 'pymed-m3-s1',
      title: { en: 'Shapes With a Label', id: 'Bentuk dengan Label' },
      summary: {
        en: 'A box and a line of text, drawn together — and a triangle built from three line segments.',
        id: 'Sebuah kotak dan sebaris teks, digambar bersamaan — dan segitiga yang dibangun dari tiga ruas garis.',
      },
      lessons: [
        {
          id: 'pymed-m3-s1-l1',
          title: { en: 'Three Functions for a Still Picture', id: 'Tiga Fungsi untuk Peraga Diam' },
          goal: { en: 'Draw a labeled box using the same three functions as a game.', id: 'Menggambar kotak berlabel memakai tiga fungsi yang sama seperti sebuah game.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A still picture is a game where nothing moves', id: 'Peraga diam adalah game yang tak ada yang bergerak' },
              body: {
                en: 'The same three functions still apply: `start()` gives the starting state, `update(state, keys, dt)` gives the next one, `draw(state)` says what to draw. For a still picture, `update` simply returns `state` unchanged — there is nothing to update, but the shape of the contract does not change.',
                id: 'Ketiga fungsi yang sama tetap berlaku: `start()` memberi keadaan awal, `update(state, keys, dt)` memberi keadaan berikutnya, `draw(state)` menyatakan apa yang digambar. Untuk peraga diam, `update` sekadar mengembalikan `state` tanpa perubahan — tak ada yang perlu diperbarui, tapi bentuk kontraknya tak berubah.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A box, and a label under it', id: 'Kotak, dan label di bawahnya' },
              body: {
                en: 'draw() can return more than one command — a `box` and a `text` together make a labeled shape. The label reads its numbers straight from the state, the same way the box does.',
                id: 'draw() bisa mengembalikan lebih dari satu perintah — `box` dan `text` bersamaan membuat bentuk berlabel. Labelnya membaca angkanya langsung dari keadaan, sama seperti kotaknya.',
              },
              code:
                'def start():\n    return {"width": 60, "height": 30}\n\ndef draw(state):\n    return [\n        {"shape": "box", "x": 100, "y": 80, "w": state["width"], "h": state["height"], "color": "#437649"},\n        {"shape": "text", "x": 100, "y": 115, "text": f"{state[\'width\']} x {state[\'height\']}", "size": 12, "color": "#24463d"},\n    ]\n\nprint(draw(start()))',
              output:
                "[{'shape': 'box', 'x': 100, 'y': 80, 'w': 60, 'h': 30, 'color': '#437649'}, {'shape': 'text', 'x': 100, 'y': 115, 'text': '60 x 30', 'size': 12, 'color': '#24463d'}]",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'A label sits 35 pixels below the top of its box. Should the label\'s y be 35 more, or 35 less, than the box\'s y?',
                id: 'Sebuah label berada 35 piksel di bawah puncak kotaknya. Apakah y label harus 35 lebih besar, atau 35 lebih kecil, daripada y kotaknya?',
              },
              options: [
                { en: '35 more', id: '35 lebih besar' },
                { en: '35 less', id: '35 lebih kecil' },
                { en: 'It makes no difference', id: 'Tak ada bedanya' },
                { en: 'y is not involved in up/down at all', id: 'y sama sekali tak terlibat dalam atas/bawah' },
              ],
              answer: 0,
              explain: {
                en: 'y grows downward on this canvas — "below" always means a larger y, never a smaller one.',
                id: 'y bertambah ke bawah pada kanvas ini — "di bawah" selalu berarti y yang lebih besar, tak pernah lebih kecil.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the label so its text comes from the state, not a fixed string.',
                id: 'Lengkapi labelnya agar teksnya berasal dari keadaan, bukan string tetap.',
              },
              template:
                'def draw(state):\n    return [\n        {"shape": "text", "x": 10, "y": 10, "text": ___, "size": 12},\n    ]',
              blanks: ['state["name"]'],
              explain: {
                en: 'A label that reads from state updates itself if the state ever changes — a fixed string never would.',
                id: 'Label yang membaca dari keadaan memperbarui dirinya sendiri kalau keadaannya pernah berubah — string tetap tak akan pernah begitu.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a still-picture update() — the shortest one possible.',
                id: 'Susun update() untuk peraga diam — yang paling singkat mungkin.',
              },
              lines: ['def update(state, keys, dt):', '    return state'],
              explain: {
                en: 'Nothing moves, so the next state is exactly the current one.',
                id: 'Tak ada yang bergerak, jadi keadaan berikutnya persis keadaan saat ini.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `width` and `height`. Write `start()` returning `{"width": 80, "height": 40}`. Write `draw(state)` returning a `box` at x=100, y=90, sized `width` by `height`, colour "#437649", followed by a `text` at x=100, y=135 whose `text` is `f"{width} x {height}"`, size 12. Write `update` returning the state unchanged.',
                id: 'Keadaannya menyimpan `width` dan `height`. Tulis `start()` yang mengembalikan `{"width": 80, "height": 40}`. Tulis `draw(state)` yang mengembalikan `box` di x=100, y=90, berukuran `width` kali `height`, warna "#437649", diikuti `text` di x=100, y=135 yang isinya `f"{width} x {height}"`, ukuran 12. Tulis `update` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
              tests: [
                {
                  name: { en: 'start() starts at 80 by 40', id: 'start() mulai di 80 kali 40' },
                  assert:
                    'k = start()\nassert k.get("width") == 80, f\'start()["width"] must be 80, now: {k.get("width")}\'\nassert k.get("height") == 40, f\'start()["height"] must be 40, now: {k.get("height")}\'',
                },
                {
                  name: { en: 'draw draws exactly two commands', id: 'draw menggambar tepat dua perintah' },
                  assert: 'a = draw({"width": 80, "height": 40})\nassert len(a) == 2, f"must be exactly two commands, now: {len(a)}"',
                },
                {
                  name: { en: 'the box follows the state', id: 'kotaknya mengikuti keadaannya' },
                  assert:
                    'a = draw({"width": 50, "height": 20})\nassert a[0].get("shape") == "box", f\'the first command must be "box", now: {a[0].get("shape")}\'\nassert a[0].get("x") == 100 and a[0].get("y") == 90, "the box must be at (100, 90)"\nassert a[0].get("w") == 50 and a[0].get("h") == 20, "the box must follow width and height from the state"',
                },
                {
                  name: { en: 'the label shows the right text', id: 'labelnya menampilkan teks yang tepat' },
                  assert:
                    'a = draw({"width": 50, "height": 20})\nassert a[1].get("shape") == "text", f\'the second command must be "text", now: {a[1].get("shape")}\'\nassert a[1].get("text") == "50 x 20", f\'the label text must be "50 x 20", now: {a[1].get("text")}\'',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert:
                    'k = update({"width": 80, "height": 40}, set(), 0.5)\nassert k.get("width") == 80 and k.get("height") == 40, "the state must stay the same — nothing moves yet in this lesson"',
                },
              ],
              hints: [
                { en: 'Read the box\'s size straight out of state: "w": state["width"].', id: 'Baca ukuran kotaknya langsung dari keadaan: "w": state["width"].' },
                { en: 'The label\'s text is an f-string built from the same two values.', id: 'Teks labelnya adalah f-string yang dibangun dari kedua nilai yang sama.' },
              ],
              solution:
                'def start():\n    return {"width": 80, "height": 40}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return [\n        {"shape": "box", "x": 100, "y": 90, "w": state["width"], "h": state["height"], "color": "#437649"},\n        {"shape": "text", "x": 100, "y": 135, "text": f"{state[\'width\']} x {state[\'height\']}", "size": 12, "color": "#24463d"},\n    ]',
            },
          ],
        },
        {
          id: 'pymed-m3-s1-l2',
          title: { en: 'A Labeled Triangle', id: 'Segitiga Berlabel' },
          goal: { en: 'Build a right triangle out of three line segments.', id: 'Membangun segitiga siku-siku dari tiga ruas garis.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'No triangle shape — three lines instead', id: 'Tak ada bentuk segitiga — tiga garis sebagai gantinya' },
              body: {
                en: 'There is no `shape: "triangle"`. A right triangle is three `line` commands: one along the bottom, one straight up the side, and one connecting their far ends — the hypotenuse. Keeping the legs flat and vertical means no angle ever has to be computed, only the three corner points.',
                id: 'Tak ada `shape: "triangle"`. Segitiga siku-siku adalah tiga perintah `line`: satu di alas, satu tegak lurus di sisinya, dan satu menghubungkan ujung terjauh keduanya — sisi miringnya. Menjaga kedua sisi siku tetap datar dan tegak berarti tak ada sudut yang perlu dihitung, hanya tiga titik sudutnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Three corners, from one origin', id: 'Tiga sudut, dari satu titik asal' },
              body: {
                en: 'Pick one corner as the origin `(x, y)`, then the other two follow from the leg lengths: `(x + base, y)` along the bottom, `(x, y - height)` straight up — up, so its y is smaller, not larger.',
                id: 'Pilih satu sudut sebagai titik asal `(x, y)`, lalu kedua sudut lain mengikuti dari panjang kedua sisi siku: `(x + base, y)` di sepanjang alas, `(x, y - height)` tegak ke atas — ke atas, jadi y-nya lebih kecil, bukan lebih besar.',
              },
              code:
                'def draw(state):\n    x, y = 60, 180\n    base, height = state["base"], state["height"]\n    return [\n        {"shape": "line", "x1": x, "y1": y, "x2": x + base, "y2": y, "thickness": 2},\n        {"shape": "line", "x1": x, "y1": y, "x2": x, "y2": y - height, "thickness": 2},\n        {"shape": "line", "x1": x + base, "y1": y, "x2": x, "y2": y - height, "thickness": 2},\n    ]\n\nprint(draw({"base": 90, "height": 60}))',
              output:
                "[{'shape': 'line', 'x1': 60, 'y1': 180, 'x2': 150, 'y2': 180, 'thickness': 2}, {'shape': 'line', 'x1': 60, 'y1': 180, 'x2': 60, 'y2': 120, 'thickness': 2}, {'shape': 'line', 'x1': 150, 'y1': 180, 'x2': 60, 'y2': 120, 'thickness': 2}]",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With the origin at (60, 180) and base = 90, where does the bottom leg end?',
                id: 'Dengan titik asal di (60, 180) dan base = 90, di mana ujung sisi alasnya berakhir?',
              },
              options: [
                { en: '(150, 180)', id: '(150, 180)' },
                { en: '(60, 270)', id: '(60, 270)' },
                { en: '(150, 90)', id: '(150, 90)' },
                { en: '(60, 90)', id: '(60, 90)' },
              ],
              answer: 0,
              explain: {
                en: 'The bottom leg runs sideways only: x grows by base, y stays 180.',
                id: 'Sisi alasnya hanya berjalan mendatar: x bertambah sebesar base, y tetap 180.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Complete the vertical leg so it goes up, not down.',
                id: 'Lengkapi sisi tegaknya agar naik ke atas, bukan turun.',
              },
              template:
                'x, y, height = 60, 180, 60\nvertical_line = {"shape": "line", "x1": x, "y1": y, "x2": x, "y2": y ___ height}',
              blanks: ['-'],
              explain: {
                en: 'Up means a smaller y, so the leg\'s far end subtracts height rather than adding it.',
                id: 'Naik berarti y yang lebih kecil, jadi ujung sisinya mengurangi height, bukan menambahkannya.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble the hypotenuse — the line connecting the two far corners.',
                id: 'Susun sisi miringnya — garis yang menghubungkan kedua sudut terjauh.',
              },
              lines: [
                'x, y, base, height = 60, 180, 90, 60',
                'bottom_right = (x + base, y)',
                'top = (x, y - height)',
                'hypotenuse = {"shape": "line", "x1": bottom_right[0], "y1": bottom_right[1], "x2": top[0], "y2": top[1]}',
              ],
              explain: {
                en: 'The two corners have to be worked out before a line can connect them.',
                id: 'Kedua sudutnya harus dihitung dulu sebelum sebuah garis bisa menghubungkannya.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `base` and `height`. Write `start()` returning `{"base": 90, "height": 60}`. Write `draw` drawing the right triangle from the concept above, origin fixed at (60, 180). Write `update` returning the state unchanged.',
                id: 'Keadaannya menyimpan `base` dan `height`. Tulis `start()` yang mengembalikan `{"base": 90, "height": 60}`. Tulis `draw` yang menggambar segitiga siku-siku dari konsep di atas, titik asal tetap di (60, 180). Tulis `update` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
              tests: [
                {
                  name: { en: 'start() starts at 90 by 60', id: 'start() mulai di 90 kali 60' },
                  assert: 'k = start()\nassert k.get("base") == 90 and k.get("height") == 60, f"start() is wrong: {k}"',
                },
                {
                  name: { en: 'draw draws exactly three lines', id: 'draw menggambar tepat tiga garis' },
                  assert:
                    'a = draw({"base": 90, "height": 60})\nassert len(a) == 3, f"must be exactly three commands, now: {len(a)}"\nassert all(p.get("shape") == "line" for p in a), "all three must be lines"',
                },
                {
                  name: { en: 'the bottom leg is flat', id: 'sisi alasnya datar' },
                  assert:
                    'a = draw({"base": 90, "height": 60})\nbottom = next(p for p in a if p.get("y1") == 180 and p.get("y2") == 180)\nassert bottom.get("x2") - bottom.get("x1") == 90 or bottom.get("x1") - bottom.get("x2") == 90, f"the bottom leg must be length 90: {bottom}"',
                },
                {
                  name: { en: 'it follows the state, not fixed numbers', id: 'mengikuti keadaan, bukan angka tetap' },
                  assert:
                    'a = draw({"base": 40, "height": 30})\nbottom = next(p for p in a if p.get("y1") == 180 and p.get("y2") == 180)\nassert bottom.get("x2") - bottom.get("x1") == 40 or bottom.get("x1") - bottom.get("x2") == 40, "the bottom leg must follow base from the state, not stay fixed at 90"',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert: 'k = update({"base": 90, "height": 60}, set(), 0.2)\nassert k.get("base") == 90 and k.get("height") == 60, "nothing moves yet in this lesson"',
                },
              ],
              hints: [
                { en: 'Fix x, y = 60, 180 as the origin, then build the other two corners from base and height.', id: 'Tetapkan x, y = 60, 180 sebagai titik asal, lalu bangun kedua sudut lainnya dari base dan height.' },
                { en: 'Three line commands, sharing the same origin corner in different pairs.', id: 'Tiga perintah line, berbagi sudut titik asal yang sama dalam pasangan berbeda.' },
              ],
              solution:
                'def start():\n    return {"base": 90, "height": 60}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    x, y = 60, 180\n    base, height = state["base"], state["height"]\n    return [\n        {"shape": "line", "x1": x, "y1": y, "x2": x + base, "y2": y, "thickness": 2},\n        {"shape": "line", "x1": x, "y1": y, "x2": x, "y2": y - height, "thickness": 2},\n        {"shape": "line", "x1": x + base, "y1": y, "x2": x, "y2": y - height, "thickness": 2},\n    ]',
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m3-s1-p',
        title: { en: 'Labeled Right Triangle', id: 'Segitiga Siku-siku Berlabel' },
        brief: {
          en: 'The triangle from this submodule\'s lessons, with its two known legs labeled in text.',
          id: 'Segitiga dari pelajaran submodul ini, dengan kedua sisi siku-sikunya diberi label teks.',
        },
        requirements: [
          { en: 'The state holds `base` and `height`. `start()` returns `{"base": 90, "height": 60}`.', id: 'Keadaannya menyimpan `base` dan `height`. `start()` mengembalikan `{"base": 90, "height": 60}`.' },
          { en: 'draw draws the same three-line triangle as the lessons, origin at (60, 180).', id: 'draw menggambar segitiga tiga-garis yang sama seperti di pelajaran, titik asal di (60, 180).' },
          { en: 'Add a `text` label near the bottom leg showing `base`, and another near the vertical leg showing `height` — as plain numbers, e.g. `"90"`.', id: 'Tambahkan label `text` di dekat sisi alas menunjukkan `base`, dan satu lagi di dekat sisi tegak menunjukkan `height` — sebagai angka polos, mis. `"90"`.' },
          { en: 'update returns the state unchanged.', id: 'update mengembalikan keadaannya tanpa perubahan.' },
        ],
        starter: 'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
        tests: [
          {
            name: { en: 'start() starts at 90 by 60', id: 'start() mulai di 90 kali 60' },
            assert: 'k = start()\nassert k.get("base") == 90 and k.get("height") == 60, f"start() is wrong: {k}"',
          },
          {
            name: { en: 'five commands: three lines, two labels', id: 'lima perintah: tiga garis, dua label' },
            assert:
              'a = draw({"base": 90, "height": 60})\nshapes = [p.get("shape") for p in a]\nassert shapes.count("line") == 3, f"must be three lines, now: {shapes.count(\'line\')}"\nassert shapes.count("text") == 2, f"must be two text labels, now: {shapes.count(\'text\')}"',
          },
          {
            name: { en: 'the labels show the leg lengths', id: 'labelnya menunjukkan panjang kedua sisi' },
            assert:
              'a = draw({"base": 90, "height": 60})\ntexts = [p.get("text") for p in a if p.get("shape") == "text"]\nassert "90" in texts, f"one label must show 90 (base), texts present: {texts}"\nassert "60" in texts, f"one label must show 60 (height), texts present: {texts}"',
          },
          {
            name: { en: 'labels follow the state, not fixed text', id: 'label mengikuti keadaan, bukan teks tetap' },
            assert:
              'a = draw({"base": 40, "height": 25})\ntexts = [p.get("text") for p in a if p.get("shape") == "text"]\nassert "40" in texts and "25" in texts, f"the labels must follow base and height from the state, texts present: {texts}"',
          },
          {
            name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
            assert: 'k = update({"base": 90, "height": 60}, set(), 0.3)\nassert k.get("base") == 90 and k.get("height") == 60, "nothing moves yet in this project"',
          },
        ],
        hints: [
          { en: 'Reuse the triangle from the lessons, then add two more items to the returned list.', id: 'Pakai ulang segitiga dari pelajarannya, lalu tambahkan dua unsur lagi ke list yang dikembalikan.' },
          { en: 'A label\'s text has to be a string: str(base), not base by itself.', id: 'Teks label harus berupa string: str(base), bukan base begitu saja.' },
        ],
        solution:
          'def start():\n    return {"base": 90, "height": 60}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    x, y = 60, 180\n    base, height = state["base"], state["height"]\n    return [\n        {"shape": "line", "x1": x, "y1": y, "x2": x + base, "y2": y, "thickness": 2},\n        {"shape": "line", "x1": x, "y1": y, "x2": x, "y2": y - height, "thickness": 2},\n        {"shape": "line", "x1": x + base, "y1": y, "x2": x, "y2": y - height, "thickness": 2},\n        {"shape": "text", "x": x + base // 2 - 10, "y": y + 8, "text": str(base), "size": 12, "color": "#24463d"},\n        {"shape": "text", "x": x - 25, "y": y - height // 2, "text": str(height), "size": 12, "color": "#24463d"},\n    ]',
        xp: 50,
      },
    },

    /* ------------------------------------------------------- 3.2 number line */
    {
      id: 'pymed-m3-s2',
      title: { en: 'Number Line', id: 'Garis Bilangan' },
      summary: {
        en: 'An axis, tick marks, and points marked on top of it — one of the most reusable pictures in a math classroom.',
        id: 'Sebuah sumbu, goresan skala, dan titik-titik yang ditandai di atasnya — salah satu gambar paling sering dipakai ulang di kelas matematika.',
      },
      lessons: [
        {
          id: 'pymed-m3-s2-l1',
          title: { en: 'The Axis and Its Ticks', id: 'Sumbu dan Goresan Skalanya' },
          goal: { en: 'Draw a horizontal line with evenly spaced tick marks.', id: 'Menggambar garis mendatar dengan goresan skala berjarak sama.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'One long line, several short ones', id: 'Satu garis panjang, beberapa garis pendek' },
              body: {
                en: 'The axis itself is a single horizontal `line`. Each tick is a short vertical `line` crossing it — built in a loop, one per mark, spaced evenly along the axis.',
                id: 'Sumbunya sendiri adalah satu `line` mendatar. Tiap goresan skala adalah `line` tegak pendek yang memotongnya — dibangun dalam perulangan, satu per tanda, berjarak sama di sepanjang sumbunya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Spacing the ticks with a loop', id: 'Memberi jarak goresan dengan perulangan' },
              body: {
                en: 'With the axis at `y = 120` running from `x = 20` to `x = 300`, seven evenly spaced ticks — one every 40 pixels — come from a single `for` loop over `range(7)`, each tick\'s `x` computed from its index.',
                id: 'Dengan sumbu di `y = 120` membentang dari `x = 20` sampai `x = 300`, tujuh goresan berjarak sama — satu tiap 40 piksel — datang dari satu perulangan `for` atas `range(7)`, `x` tiap goresan dihitung dari indeksnya.',
              },
              code:
                'def draw(state):\n    commands = [{"shape": "line", "x1": 20, "y1": 120, "x2": 300, "y2": 120, "thickness": 2}]\n    for i in range(7):\n        x = 20 + i * 40\n        commands.append({"shape": "line", "x1": x, "y1": 115, "x2": x, "y2": 125, "thickness": 1})\n    return commands\n\nprint(len(draw({})))',
              output: '8',
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'Ticks start at x = 20 and are spaced 40 apart. Where is the 4th tick (index 3)?',
                id: 'Goresan dimulai dari x = 20 dan berjarak 40. Di mana goresan ke-4 (indeks 3)?',
              },
              options: [
                { en: 'x = 140', id: 'x = 140' },
                { en: 'x = 120', id: 'x = 120' },
                { en: 'x = 160', id: 'x = 160' },
                { en: 'x = 40', id: 'x = 40' },
              ],
              answer: 0,
              explain: {
                en: '20 + 3 * 40 is 140 — index 3 is the fourth tick, since counting starts at 0.',
                id: '20 + 3 * 40 adalah 140 — indeks 3 adalah goresan keempat, karena hitungannya dimulai dari 0.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Space five ticks 30 pixels apart, starting at x = 10.',
                id: 'Beri jarak lima goresan 30 piksel, dimulai dari x = 10.',
              },
              template: 'for i in range(5):\n    x = 10 + i ___ 30\n    print(x)',
              blanks: ['*'],
              explain: {
                en: 'Each step away from the start multiplies the tick spacing by how many steps have passed.',
                id: 'Tiap langkah menjauh dari awal mengalikan jarak goresannya dengan berapa langkah yang sudah berlalu.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a loop building 4 tick marks, appended to a list that already holds the axis.',
                id: 'Susun perulangan yang membangun 4 goresan skala, ditambahkan ke list yang sudah berisi sumbunya.',
              },
              lines: [
                'commands = [{"shape": "line", "x1": 0, "y1": 100, "x2": 200, "y2": 100}]',
                'for i in range(4):',
                '    x = i * 50',
                '    commands.append({"shape": "line", "x1": x, "y1": 95, "x2": x, "y2": 105})',
              ],
              explain: {
                en: 'The axis has to already be in the list before the loop starts appending ticks to the same list.',
                id: 'Sumbunya harus sudah ada di list sebelum perulangannya mulai menambahkan goresan ke list yang sama.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `count`, how many ticks to draw. Write `start()` returning `{"count": 6}`. Write `draw` drawing the axis (x1=20, y1=120, x2=300, y2=120) followed by `count` ticks, 40 pixels apart starting at x=20, each a vertical line from y=115 to y=125. Write `update` returning the state unchanged.',
                id: 'Keadaannya menyimpan `count`, berapa goresan yang digambar. Tulis `start()` yang mengembalikan `{"count": 6}`. Tulis `draw` yang menggambar sumbunya (x1=20, y1=120, x2=300, y2=120) diikuti `count` goresan, berjarak 40 piksel dimulai dari x=20, masing-masing garis tegak dari y=115 sampai y=125. Tulis `update` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
              tests: [
                {
                  name: { en: 'start() starts with 6 ticks', id: 'start() mulai dengan 6 goresan' },
                  assert: 'k = start()\nassert k.get("count") == 6, f\'start()["count"] must be 6, now: {k.get("count")}\'',
                },
                {
                  name: { en: 'axis plus 6 ticks is 7 commands', id: 'sumbu ditambah 6 goresan adalah 7 perintah' },
                  assert: 'a = draw({"count": 6})\nassert len(a) == 7, f"must be 7 commands (1 axis + 6 ticks), now: {len(a)}"',
                },
                {
                  name: { en: 'the axis runs the full width', id: 'sumbunya membentang penuh' },
                  assert:
                    'a = draw({"count": 6})\naxis = a[0]\nassert axis.get("x1") == 20 and axis.get("x2") == 300 and axis.get("y1") == 120 and axis.get("y2") == 120, f"the axis is wrong: {axis}"',
                },
                {
                  name: { en: 'ticks are 40 apart, starting at 20', id: 'goresan berjarak 40, dimulai dari 20' },
                  assert:
                    'a = draw({"count": 6})\nticks = [p for p in a if p is not a[0]]\nxs = sorted(p.get("x1") for p in ticks)\nassert xs == [20, 60, 100, 140, 180, 220], f"the tick positions are wrong: {xs}"',
                },
                {
                  name: { en: 'the count follows the state', id: 'jumlahnya mengikuti keadaan' },
                  assert: 'a = draw({"count": 3})\nassert len(a) == 4, f"with count=3 it must be 4 commands (1 axis + 3 ticks), now: {len(a)}"',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert: 'k = update({"count": 6}, set(), 0.4)\nassert k.get("count") == 6, "nothing moves yet in this lesson"',
                },
              ],
              hints: [
                { en: 'Start the list with the axis, then append ticks in a loop over range(count).', id: 'Mulai list-nya dengan sumbu, lalu tambahkan goresan dalam perulangan atas range(count).' },
                { en: 'x = 20 + i * 40 for the i-th tick.', id: 'x = 20 + i * 40 untuk goresan ke-i.' },
              ],
              solution:
                'def start():\n    return {"count": 6}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    commands = [{"shape": "line", "x1": 20, "y1": 120, "x2": 300, "y2": 120, "thickness": 2}]\n    for i in range(state["count"]):\n        x = 20 + i * 40\n        commands.append({"shape": "line", "x1": x, "y1": 115, "x2": x, "y2": 125, "thickness": 1})\n    return commands',
            },
          ],
        },
        {
          id: 'pymed-m3-s2-l2',
          title: { en: 'Marking a Point', id: 'Menandai Titik' },
          goal: { en: 'Place a circle and a label at a specific value on the line.', id: 'Menaruh lingkaran dan label pada nilai tertentu di garisnya.' },
          xp: 20,
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: { en: 'A value becomes a position', id: 'Nilai menjadi posisi' },
              body: {
                en: 'Marking the value 3 means converting 3 into an x coordinate first — the same spacing formula as a tick: `x = 20 + value * 40`. A `circle` at that x, sitting right on the axis, is the mark.',
                id: 'Menandai nilai 3 berarti mengubah 3 jadi koordinat x lebih dulu — formula spasi yang sama seperti goresan skala: `x = 20 + value * 40`. `circle` pada x itu, tepat di atas sumbunya, adalah tandanya.',
              },
              code:
                'def draw(state):\n    value = state["value"]\n    x = 20 + value * 40\n    return [{"shape": "circle", "x": x, "y": 120, "r": 6, "color": "#ef8f70"}]\n\nprint(draw({"value": 3}))',
              output: "[{'shape': 'circle', 'x': 140, 'y': 120, 'r': 6, 'color': '#ef8f70'}]",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A number under the mark', id: 'Angka di bawah tandanya' },
              body: {
                en: 'A `text` label just below the circle, showing the value as a string, turns a bare dot into something a class can actually read.',
                id: 'Label `text` tepat di bawah lingkarannya, menampilkan nilainya sebagai string, mengubah titik polos menjadi sesuatu yang benar-benar bisa dibaca satu kelas.',
              },
              code:
                'def draw(state):\n    value = state["value"]\n    x = 20 + value * 40\n    return [\n        {"shape": "circle", "x": x, "y": 120, "r": 6, "color": "#ef8f70"},\n        {"shape": "text", "x": x - 4, "y": 135, "text": str(value), "size": 12},\n    ]\n\nprint(draw({"value": 2})[1])',
              output: "{'shape': 'text', 'x': 96, 'y': 135, 'text': '2', 'size': 12}",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'With x = 20 + value * 40, where does the value 0 land?', id: 'Dengan x = 20 + value * 40, di mana nilai 0 mendarat?' },
              options: [
                { en: 'x = 20', id: 'x = 20' },
                { en: 'x = 0', id: 'x = 0' },
                { en: 'x = 40', id: 'x = 40' },
                { en: 'It is undefined', id: 'Tak terdefinisi' },
              ],
              answer: 0,
              explain: {
                en: '20 + 0 * 40 is just 20 — the same x the axis itself starts from.',
                id: '20 + 0 * 40 sekadar 20 — x yang sama tempat sumbunya sendiri dimulai.',
              },
            },
            {
              kind: 'fill',
              id: 'f1',
              prompt: {
                en: 'Convert a value into an x position on the same scale as the axis.',
                id: 'Ubah sebuah nilai menjadi posisi x pada skala yang sama seperti sumbunya.',
              },
              template: 'value = 5\nx = 20 + value ___ 40',
              blanks: ['*'],
              explain: {
                en: 'Each unit of value is 40 pixels of x — the same spacing the ticks use.',
                id: 'Tiap satu satuan nilai adalah 40 piksel x — spasi yang sama seperti yang dipakai goresan skala.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a program marking the value 4 with a circle.',
                id: 'Susun program yang menandai nilai 4 dengan lingkaran.',
              },
              lines: ['value = 4', 'x = 20 + value * 40', 'mark = {"shape": "circle", "x": x, "y": 120, "r": 6}'],
              explain: {
                en: 'x has to be computed from value before it can be used to place the circle.',
                id: 'x harus dihitung dari value dulu sebelum bisa dipakai untuk menempatkan lingkarannya.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `value`. Write `start()` returning `{"value": 3}`. Write `draw` returning a `circle` at `x = 20 + value * 40`, `y = 120`, `r = 6`, followed by a `text` showing `str(value)`. Write `update` returning the state unchanged.',
                id: 'Keadaannya menyimpan `value`. Tulis `start()` yang mengembalikan `{"value": 3}`. Tulis `draw` yang mengembalikan `circle` di `x = 20 + value * 40`, `y = 120`, `r = 6`, diikuti `text` yang menampilkan `str(value)`. Tulis `update` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
              tests: [
                {
                  name: { en: 'start() starts at value=3', id: 'start() mulai di value=3' },
                  assert: 'k = start()\nassert k.get("value") == 3, f\'start()["value"] must be 3, now: {k.get("value")}\'',
                },
                {
                  name: { en: 'exactly a circle and a label', id: 'tepat satu lingkaran dan satu label' },
                  assert:
                    'a = draw({"value": 3})\nshapes = [p.get("shape") for p in a]\nassert shapes == ["circle", "text"], f"must be [circle, text] in order, now: {shapes}"',
                },
                {
                  name: { en: 'the circle lands at the right x', id: 'lingkarannya mendarat di x yang tepat' },
                  assert: 'a = draw({"value": 3})\nassert a[0].get("x") == 140, f\'the circle x must be 140, now: {a[0].get("x")}\'\nassert a[0].get("y") == 120, "the circle y must be 120, right on the axis"',
                },
                {
                  name: { en: 'the label shows the value', id: 'labelnya menampilkan nilainya' },
                  assert: 'a = draw({"value": 3})\nassert a[1].get("text") == "3", f\'the label text must be "3", now: {a[1].get("text")}\'',
                },
                {
                  name: { en: 'a different value moves the mark', id: 'nilai berbeda memindah tandanya' },
                  assert:
                    'a = draw({"value": 5})\nassert a[0].get("x") == 220, f\'with value=5, the circle x must be 220, now: {a[0].get("x")}\'\nassert a[1].get("text") == "5", f\'the label must be "5", now: {a[1].get("text")}\'',
                },
                {
                  name: { en: 'nothing moves on its own', id: 'tak ada yang bergerak sendiri' },
                  assert: 'k = update({"value": 3}, set(), 0.1)\nassert k.get("value") == 3, "nothing moves yet in this lesson"',
                },
              ],
              hints: [
                { en: 'x = 20 + state["value"] * 40, exactly the concept\'s formula.', id: 'x = 20 + state["value"] * 40, persis formula pada konsepnya.' },
                { en: 'The label\'s text must be a string: str(state["value"]).', id: 'Teks labelnya harus string: str(state["value"]).' },
              ],
              solution:
                'def start():\n    return {"value": 3}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    value = state["value"]\n    x = 20 + value * 40\n    return [\n        {"shape": "circle", "x": x, "y": 120, "r": 6, "color": "#ef8f70"},\n        {"shape": "text", "x": x - 4, "y": 135, "text": str(value), "size": 12},\n    ]',
            },
          ],
        },
      ],
      project: {
        id: 'pymed-m3-s2-p',
        title: { en: 'Number Line With Several Marks', id: 'Garis Bilangan dengan Beberapa Penanda' },
        brief: {
          en: 'Draw the axis and its ticks, then mark every value in a list at once — a number line ready to show a whole set.',
          id: 'Gambar sumbu dan goresannya, lalu tandai setiap nilai dalam sebuah list sekaligus — garis bilangan yang siap menunjukkan satu himpunan penuh.',
        },
        requirements: [
          { en: 'The state holds `values`, a list of numbers. `start()` returns `{"values": [1, 4, 6]}`.', id: 'Keadaannya menyimpan `values`, list berisi angka. `start()` mengembalikan `{"values": [1, 4, 6]}`.' },
          { en: 'draw draws the axis (x1=20, y1=120, x2=300, y2=120), then one circle for every value in values, at x = 20 + value * 40, y = 120, r = 6.', id: 'draw menggambar sumbunya (x1=20, y1=120, x2=300, y2=120), lalu satu lingkaran untuk tiap nilai di values, pada x = 20 + value * 40, y = 120, r = 6.' },
          { en: 'update returns the state unchanged.', id: 'update mengembalikan keadaannya tanpa perubahan.' },
        ],
        starter: 'def start():\n    return {}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    return []\n',
        tests: [
          {
            name: { en: 'start() starts with [1, 4, 6]', id: 'start() mulai dengan [1, 4, 6]' },
            assert: 'k = start()\nassert k.get("values") == [1, 4, 6], f"start() is wrong: {k}"',
          },
          {
            name: { en: 'axis plus one mark per value', id: 'sumbu ditambah satu tanda per nilai' },
            assert: 'a = draw({"values": [1, 4, 6]})\nassert len(a) == 4, f"must be 4 commands (1 axis + 3 marks), now: {len(a)}"',
          },
          {
            name: { en: 'the axis comes first, spanning the full width', id: 'sumbunya di urutan pertama, membentang penuh' },
            assert: 'a = draw({"values": [1, 4, 6]})\nassert a[0].get("shape") == "line" and a[0].get("x1") == 20 and a[0].get("x2") == 300, f"the axis is wrong: {a[0]}"',
          },
          {
            name: { en: 'each mark lands at the right x', id: 'tiap tanda mendarat di x yang tepat' },
            assert:
              'a = draw({"values": [1, 4, 6]})\npoints = [p for p in a if p.get("shape") == "circle"]\nxs = sorted(p.get("x") for p in points)\nassert xs == [60, 180, 260], f"the mark positions are wrong, expected [60, 180, 260]: {xs}"',
          },
          {
            name: { en: 'a different list changes the count and positions', id: 'list berbeda mengubah jumlah dan posisinya' },
            assert:
              'a = draw({"values": [0, 2]})\nassert len(a) == 3, f"with 2 values it must be 3 commands, now: {len(a)}"\npoints = sorted(p.get("x") for p in a if p.get("shape") == "circle")\nassert points == [20, 100], f"the mark positions are wrong, expected [20, 100]: {points}"',
          },
          {
            name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
            assert: 'k = update({"values": [1, 4, 6]}, set(), 0.5)\nassert k.get("values") == [1, 4, 6], "nothing moves yet in this project"',
          },
        ],
        hints: [
          { en: 'Start the list with the axis, then loop over values appending one circle per value.', id: 'Mulai list-nya dengan sumbu, lalu ulangi atas values menambahkan satu lingkaran per nilai.' },
          { en: 'The same x formula as the lesson: 20 + value * 40.', id: 'Formula x yang sama seperti di pelajaran: 20 + value * 40.' },
        ],
        solution:
          'def start():\n    return {"values": [1, 4, 6]}\n\ndef update(state, keys, dt):\n    return state\n\ndef draw(state):\n    commands = [{"shape": "line", "x1": 20, "y1": 120, "x2": 300, "y2": 120, "thickness": 2}]\n    for value in state["values"]:\n        x = 20 + value * 40\n        commands.append({"shape": "circle", "x": x, "y": 120, "r": 6, "color": "#ef8f70"})\n    return commands',
        xp: 50,
      },
    },
  ],
}
