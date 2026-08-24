import type { Module } from '../types'

/** Module 3 — the game-dev course's own runtime (awal/perbarui/gambar,
 *  returning kotak/lingkaran/garis/teks commands), reused for still pictures
 *  worth showing a class rather than something to play. perbarui() simply
 *  returns the state unchanged in every exercise here — nothing moves yet;
 *  that is module 4. Every check calls awal()/perbarui()/gambar() directly
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
                en: 'The same three functions still apply: `awal()` gives the starting state, `perbarui(keadaan, tombol, dt)` gives the next one, `gambar(keadaan)` says what to draw. For a still picture, `perbarui` simply returns `keadaan` unchanged — there is nothing to update, but the shape of the contract does not change.',
                id: 'Ketiga fungsi yang sama tetap berlaku: `awal()` memberi keadaan awal, `perbarui(keadaan, tombol, dt)` memberi keadaan berikutnya, `gambar(keadaan)` menyatakan apa yang digambar. Untuk peraga diam, `perbarui` sekadar mengembalikan `keadaan` tanpa perubahan — tak ada yang perlu diperbarui, tapi bentuk kontraknya tak berubah.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A box, and a label under it', id: 'Kotak, dan label di bawahnya' },
              body: {
                en: 'gambar() can return more than one command — a `kotak` and a `teks` together make a labeled shape. The label reads its numbers straight from the state, the same way the box does.',
                id: 'gambar() bisa mengembalikan lebih dari satu perintah — `kotak` dan `teks` bersamaan membuat bentuk berlabel. Labelnya membaca angkanya langsung dari keadaan, sama seperti kotaknya.',
              },
              code:
                'def awal():\n    return {"lebar": 60, "tinggi": 30}\n\ndef gambar(keadaan):\n    return [\n        {"bentuk": "kotak", "x": 100, "y": 80, "l": keadaan["lebar"], "t": keadaan["tinggi"], "warna": "#437649"},\n        {"bentuk": "teks", "x": 100, "y": 115, "isi": f"{keadaan[\'lebar\']} x {keadaan[\'tinggi\']}", "ukuran": 12, "warna": "#24463d"},\n    ]\n\nprint(gambar(awal()))',
              output:
                "[{'bentuk': 'kotak', 'x': 100, 'y': 80, 'l': 60, 't': 30, 'warna': '#437649'}, {'bentuk': 'teks', 'x': 100, 'y': 115, 'isi': '60 x 30', 'ukuran': 12, 'warna': '#24463d'}]",
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
                'def gambar(keadaan):\n    return [\n        {"bentuk": "teks", "x": 10, "y": 10, "isi": ___, "ukuran": 12},\n    ]',
              blanks: ['keadaan["nama"]'],
              explain: {
                en: 'A label that reads from keadaan updates itself if the state ever changes — a fixed string never would.',
                id: 'Label yang membaca dari keadaan memperbarui dirinya sendiri kalau keadaannya pernah berubah — string tetap tak akan pernah begitu.',
              },
            },
            {
              kind: 'order',
              id: 'o1',
              prompt: {
                en: 'Assemble a still-picture perbarui() — the shortest one possible.',
                id: 'Susun perbarui() untuk peraga diam — yang paling singkat mungkin.',
              },
              lines: ['def perbarui(keadaan, tombol, dt):', '    return keadaan'],
              explain: {
                en: 'Nothing moves, so the next state is exactly the current one.',
                id: 'Tak ada yang bergerak, jadi keadaan berikutnya persis keadaan saat ini.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `lebar` and `tinggi`. Write `awal()` returning `{"lebar": 80, "tinggi": 40}`. Write `gambar(keadaan)` returning a `kotak` at x=100, y=90, sized `lebar` by `tinggi`, colour "#437649", followed by a `teks` at x=100, y=135 whose `isi` is `f"{lebar} x {tinggi}"`, size 12. Write `perbarui` returning the state unchanged.',
                id: 'Keadaannya menyimpan `lebar` dan `tinggi`. Tulis `awal()` yang mengembalikan `{"lebar": 80, "tinggi": 40}`. Tulis `gambar(keadaan)` yang mengembalikan `kotak` di x=100, y=90, berukuran `lebar` kali `tinggi`, warna "#437649", diikuti `teks` di x=100, y=135 yang `isi`-nya `f"{lebar} x {tinggi}"`, ukuran 12. Tulis `perbarui` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
              tests: [
                {
                  name: { en: 'awal() starts at 80 by 40', id: 'awal() mulai di 80 kali 40' },
                  assert:
                    'k = awal()\nassert k.get("lebar") == 80, f\'awal()["lebar"] harus 80, sekarang: {k.get("lebar")}\'\nassert k.get("tinggi") == 40, f\'awal()["tinggi"] harus 40, sekarang: {k.get("tinggi")}\'',
                },
                {
                  name: { en: 'gambar draws exactly two commands', id: 'gambar menggambar tepat dua perintah' },
                  assert: 'a = gambar({"lebar": 80, "tinggi": 40})\nassert len(a) == 2, f"harus tepat dua perintah, sekarang: {len(a)}"',
                },
                {
                  name: { en: 'the box follows the state', id: 'kotaknya mengikuti keadaannya' },
                  assert:
                    'a = gambar({"lebar": 50, "tinggi": 20})\nassert a[0].get("bentuk") == "kotak", f\'perintah pertama harus "kotak", sekarang: {a[0].get("bentuk")}\'\nassert a[0].get("x") == 100 and a[0].get("y") == 90, "posisi kotaknya harus (100, 90)"\nassert a[0].get("l") == 50 and a[0].get("t") == 20, "kotaknya harus mengikuti lebar dan tinggi dari keadaan"',
                },
                {
                  name: { en: 'the label shows the right text', id: 'labelnya menampilkan teks yang tepat' },
                  assert:
                    'a = gambar({"lebar": 50, "tinggi": 20})\nassert a[1].get("bentuk") == "teks", f\'perintah kedua harus "teks", sekarang: {a[1].get("bentuk")}\'\nassert a[1].get("isi") == "50 x 20", f\'isi labelnya harus "50 x 20", sekarang: {a[1].get("isi")}\'',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert:
                    'k = perbarui({"lebar": 80, "tinggi": 40}, set(), 0.5)\nassert k.get("lebar") == 80 and k.get("tinggi") == 40, "keadaannya harus tetap sama — belum ada yang bergerak di pelajaran ini"',
                },
              ],
              hints: [
                { en: 'Read the box\'s size straight out of keadaan: "l": keadaan["lebar"].', id: 'Baca ukuran kotaknya langsung dari keadaan: "l": keadaan["lebar"].' },
                { en: 'The label\'s isi is an f-string built from the same two values.', id: 'isi labelnya adalah f-string yang dibangun dari kedua nilai yang sama.' },
              ],
              solution:
                'def awal():\n    return {"lebar": 80, "tinggi": 40}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return [\n        {"bentuk": "kotak", "x": 100, "y": 90, "l": keadaan["lebar"], "t": keadaan["tinggi"], "warna": "#437649"},\n        {"bentuk": "teks", "x": 100, "y": 135, "isi": f"{keadaan[\'lebar\']} x {keadaan[\'tinggi\']}", "ukuran": 12, "warna": "#24463d"},\n    ]',
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
                en: 'There is no `bentuk: "segitiga"`. A right triangle is three `garis` commands: one along the bottom, one straight up the side, and one connecting their far ends — the hypotenuse. Keeping the legs flat and vertical means no angle ever has to be computed, only the three corner points.',
                id: 'Tak ada `bentuk: "segitiga"`. Segitiga siku-siku adalah tiga perintah `garis`: satu di alas, satu tegak lurus di sisinya, dan satu menghubungkan ujung terjauh keduanya — sisi miringnya. Menjaga kedua sisi siku tetap datar dan tegak berarti tak ada sudut yang perlu dihitung, hanya tiga titik sudutnya.',
              },
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'Three corners, from one origin', id: 'Tiga sudut, dari satu titik asal' },
              body: {
                en: 'Pick one corner as the origin `(x, y)`, then the other two follow from the leg lengths: `(x + alas, y)` along the bottom, `(x, y - tinggi)` straight up — up, so its y is smaller, not larger.',
                id: 'Pilih satu sudut sebagai titik asal `(x, y)`, lalu kedua sudut lain mengikuti dari panjang kedua sisi siku: `(x + alas, y)` di sepanjang alas, `(x, y - tinggi)` tegak ke atas — ke atas, jadi y-nya lebih kecil, bukan lebih besar.',
              },
              code:
                'def gambar(keadaan):\n    x, y = 60, 180\n    alas, tinggi = keadaan["alas"], keadaan["tinggi"]\n    return [\n        {"bentuk": "garis", "x1": x, "y1": y, "x2": x + alas, "y2": y, "tebal": 2},\n        {"bentuk": "garis", "x1": x, "y1": y, "x2": x, "y2": y - tinggi, "tebal": 2},\n        {"bentuk": "garis", "x1": x + alas, "y1": y, "x2": x, "y2": y - tinggi, "tebal": 2},\n    ]\n\nprint(gambar({"alas": 90, "tinggi": 60}))',
              output:
                "[{'bentuk': 'garis', 'x1': 60, 'y1': 180, 'x2': 150, 'y2': 180, 'tebal': 2}, {'bentuk': 'garis', 'x1': 60, 'y1': 180, 'x2': 60, 'y2': 120, 'tebal': 2}, {'bentuk': 'garis', 'x1': 150, 'y1': 180, 'x2': 60, 'y2': 120, 'tebal': 2}]",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: {
                en: 'With the origin at (60, 180) and alas = 90, where does the bottom leg end?',
                id: 'Dengan titik asal di (60, 180) dan alas = 90, di mana ujung sisi alasnya berakhir?',
              },
              options: [
                { en: '(150, 180)', id: '(150, 180)' },
                { en: '(60, 270)', id: '(60, 270)' },
                { en: '(150, 90)', id: '(150, 90)' },
                { en: '(60, 90)', id: '(60, 90)' },
              ],
              answer: 0,
              explain: {
                en: 'The bottom leg runs sideways only: x grows by alas, y stays 180.',
                id: 'Sisi alasnya hanya berjalan mendatar: x bertambah sebesar alas, y tetap 180.',
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
                'x, y, tinggi = 60, 180, 60\ngaris_tegak = {"bentuk": "garis", "x1": x, "y1": y, "x2": x, "y2": y ___ tinggi}',
              blanks: ['-'],
              explain: {
                en: 'Up means a smaller y, so the leg\'s far end subtracts tinggi rather than adding it.',
                id: 'Naik berarti y yang lebih kecil, jadi ujung sisinya mengurangi tinggi, bukan menambahkannya.',
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
                'x, y, alas, tinggi = 60, 180, 90, 60',
                'kanan_bawah = (x + alas, y)',
                'atas = (x, y - tinggi)',
                'miring = {"bentuk": "garis", "x1": kanan_bawah[0], "y1": kanan_bawah[1], "x2": atas[0], "y2": atas[1]}',
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
                en: 'The state holds `alas` and `tinggi`. Write `awal()` returning `{"alas": 90, "tinggi": 60}`. Write `gambar` drawing the right triangle from the concept above, origin fixed at (60, 180). Write `perbarui` returning the state unchanged.',
                id: 'Keadaannya menyimpan `alas` dan `tinggi`. Tulis `awal()` yang mengembalikan `{"alas": 90, "tinggi": 60}`. Tulis `gambar` yang menggambar segitiga siku-siku dari konsep di atas, titik asal tetap di (60, 180). Tulis `perbarui` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
              tests: [
                {
                  name: { en: 'awal() starts at 90 by 60', id: 'awal() mulai di 90 kali 60' },
                  assert: 'k = awal()\nassert k.get("alas") == 90 and k.get("tinggi") == 60, f"awal() salah: {k}"',
                },
                {
                  name: { en: 'gambar draws exactly three lines', id: 'gambar menggambar tepat tiga garis' },
                  assert:
                    'a = gambar({"alas": 90, "tinggi": 60})\nassert len(a) == 3, f"harus tepat tiga perintah, sekarang: {len(a)}"\nassert all(p.get("bentuk") == "garis" for p in a), "ketiganya harus berbentuk garis"',
                },
                {
                  name: { en: 'the bottom leg is flat', id: 'sisi alasnya datar' },
                  assert:
                    'a = gambar({"alas": 90, "tinggi": 60})\nalas = next(p for p in a if p.get("y1") == 180 and p.get("y2") == 180)\nassert alas.get("x2") - alas.get("x1") == 90 or alas.get("x1") - alas.get("x2") == 90, f"panjang sisi alas harus 90: {alas}"',
                },
                {
                  name: { en: 'it follows the state, not fixed numbers', id: 'mengikuti keadaan, bukan angka tetap' },
                  assert:
                    'a = gambar({"alas": 40, "tinggi": 30})\nalas = next(p for p in a if p.get("y1") == 180 and p.get("y2") == 180)\nassert alas.get("x2") - alas.get("x1") == 40 or alas.get("x1") - alas.get("x2") == 40, "sisi alasnya harus mengikuti alas dari keadaan, bukan tetap di 90"',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert: 'k = perbarui({"alas": 90, "tinggi": 60}, set(), 0.2)\nassert k.get("alas") == 90 and k.get("tinggi") == 60, "belum ada yang bergerak di pelajaran ini"',
                },
              ],
              hints: [
                { en: 'Fix x, y = 60, 180 as the origin, then build the other two corners from alas and tinggi.', id: 'Tetapkan x, y = 60, 180 sebagai titik asal, lalu bangun kedua sudut lainnya dari alas dan tinggi.' },
                { en: 'Three garis commands, sharing the same origin corner in different pairs.', id: 'Tiga perintah garis, berbagi sudut titik asal yang sama dalam pasangan berbeda.' },
              ],
              solution:
                'def awal():\n    return {"alas": 90, "tinggi": 60}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    x, y = 60, 180\n    alas, tinggi = keadaan["alas"], keadaan["tinggi"]\n    return [\n        {"bentuk": "garis", "x1": x, "y1": y, "x2": x + alas, "y2": y, "tebal": 2},\n        {"bentuk": "garis", "x1": x, "y1": y, "x2": x, "y2": y - tinggi, "tebal": 2},\n        {"bentuk": "garis", "x1": x + alas, "y1": y, "x2": x, "y2": y - tinggi, "tebal": 2},\n    ]',
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
          { en: 'The state holds `alas` and `tinggi`. `awal()` returns `{"alas": 90, "tinggi": 60}`.', id: 'Keadaannya menyimpan `alas` dan `tinggi`. `awal()` mengembalikan `{"alas": 90, "tinggi": 60}`.' },
          { en: 'gambar draws the same three-line triangle as the lessons, origin at (60, 180).', id: 'gambar menggambar segitiga tiga-garis yang sama seperti di pelajaran, titik asal di (60, 180).' },
          { en: 'Add a `teks` label near the bottom leg showing `alas`, and another near the vertical leg showing `tinggi` — as plain numbers, e.g. `"90"`.', id: 'Tambahkan label `teks` di dekat sisi alas menunjukkan `alas`, dan satu lagi di dekat sisi tegak menunjukkan `tinggi` — sebagai angka polos, mis. `"90"`.' },
          { en: 'perbarui returns the state unchanged.', id: 'perbarui mengembalikan keadaannya tanpa perubahan.' },
        ],
        starter: 'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
        tests: [
          {
            name: { en: 'awal() starts at 90 by 60', id: 'awal() mulai di 90 kali 60' },
            assert: 'k = awal()\nassert k.get("alas") == 90 and k.get("tinggi") == 60, f"awal() salah: {k}"',
          },
          {
            name: { en: 'five commands: three lines, two labels', id: 'lima perintah: tiga garis, dua label' },
            assert:
              'a = gambar({"alas": 90, "tinggi": 60})\nbentuk = [p.get("bentuk") for p in a]\nassert bentuk.count("garis") == 3, f"harus tiga garis, sekarang: {bentuk.count(\'garis\')}"\nassert bentuk.count("teks") == 2, f"harus dua label teks, sekarang: {bentuk.count(\'teks\')}"',
          },
          {
            name: { en: 'the labels show the leg lengths', id: 'labelnya menunjukkan panjang kedua sisi' },
            assert:
              'a = gambar({"alas": 90, "tinggi": 60})\nisi = [p.get("isi") for p in a if p.get("bentuk") == "teks"]\nassert "90" in isi, f"salah satu label harus menunjukkan 90 (alas), isi yang ada: {isi}"\nassert "60" in isi, f"salah satu label harus menunjukkan 60 (tinggi), isi yang ada: {isi}"',
          },
          {
            name: { en: 'labels follow the state, not fixed text', id: 'label mengikuti keadaan, bukan teks tetap' },
            assert:
              'a = gambar({"alas": 40, "tinggi": 25})\nisi = [p.get("isi") for p in a if p.get("bentuk") == "teks"]\nassert "40" in isi and "25" in isi, f"labelnya harus mengikuti alas dan tinggi dari keadaan, isi yang ada: {isi}"',
          },
          {
            name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
            assert: 'k = perbarui({"alas": 90, "tinggi": 60}, set(), 0.3)\nassert k.get("alas") == 90 and k.get("tinggi") == 60, "belum ada yang bergerak di proyek ini"',
          },
        ],
        hints: [
          { en: 'Reuse the triangle from the lessons, then add two more items to the returned list.', id: 'Pakai ulang segitiga dari pelajarannya, lalu tambahkan dua unsur lagi ke list yang dikembalikan.' },
          { en: 'A label\'s isi has to be a string: str(alas), not alas by itself.', id: 'isi label harus berupa string: str(alas), bukan alas begitu saja.' },
        ],
        solution:
          'def awal():\n    return {"alas": 90, "tinggi": 60}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    x, y = 60, 180\n    alas, tinggi = keadaan["alas"], keadaan["tinggi"]\n    return [\n        {"bentuk": "garis", "x1": x, "y1": y, "x2": x + alas, "y2": y, "tebal": 2},\n        {"bentuk": "garis", "x1": x, "y1": y, "x2": x, "y2": y - tinggi, "tebal": 2},\n        {"bentuk": "garis", "x1": x + alas, "y1": y, "x2": x, "y2": y - tinggi, "tebal": 2},\n        {"bentuk": "teks", "x": x + alas // 2 - 10, "y": y + 8, "isi": str(alas), "ukuran": 12, "warna": "#24463d"},\n        {"bentuk": "teks", "x": x - 25, "y": y - tinggi // 2, "isi": str(tinggi), "ukuran": 12, "warna": "#24463d"},\n    ]',
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
                en: 'The axis itself is a single horizontal `garis`. Each tick is a short vertical `garis` crossing it — built in a loop, one per mark, spaced evenly along the axis.',
                id: 'Sumbunya sendiri adalah satu `garis` mendatar. Tiap goresan skala adalah `garis` tegak pendek yang memotongnya — dibangun dalam perulangan, satu per tanda, berjarak sama di sepanjang sumbunya.',
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
                'def gambar(keadaan):\n    perintah = [{"bentuk": "garis", "x1": 20, "y1": 120, "x2": 300, "y2": 120, "tebal": 2}]\n    for i in range(7):\n        x = 20 + i * 40\n        perintah.append({"bentuk": "garis", "x1": x, "y1": 115, "x2": x, "y2": 125, "tebal": 1})\n    return perintah\n\nprint(len(gambar({})))',
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
                'perintah = [{"bentuk": "garis", "x1": 0, "y1": 100, "x2": 200, "y2": 100}]',
                'for i in range(4):',
                '    x = i * 50',
                '    perintah.append({"bentuk": "garis", "x1": x, "y1": 95, "x2": x, "y2": 105})',
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
                en: 'The state holds `jumlah`, how many ticks to draw. Write `awal()` returning `{"jumlah": 6}`. Write `gambar` drawing the axis (x1=20, y1=120, x2=300, y2=120) followed by `jumlah` ticks, 40 pixels apart starting at x=20, each a vertical garis from y=115 to y=125. Write `perbarui` returning the state unchanged.',
                id: 'Keadaannya menyimpan `jumlah`, berapa goresan yang digambar. Tulis `awal()` yang mengembalikan `{"jumlah": 6}`. Tulis `gambar` yang menggambar sumbunya (x1=20, y1=120, x2=300, y2=120) diikuti `jumlah` goresan, berjarak 40 piksel dimulai dari x=20, masing-masing garis tegak dari y=115 sampai y=125. Tulis `perbarui` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
              tests: [
                {
                  name: { en: 'awal() starts with 6 ticks', id: 'awal() mulai dengan 6 goresan' },
                  assert: 'k = awal()\nassert k.get("jumlah") == 6, f\'awal()["jumlah"] harus 6, sekarang: {k.get("jumlah")}\'',
                },
                {
                  name: { en: 'axis plus 6 ticks is 7 commands', id: 'sumbu ditambah 6 goresan adalah 7 perintah' },
                  assert: 'a = gambar({"jumlah": 6})\nassert len(a) == 7, f"harus 7 perintah (1 sumbu + 6 goresan), sekarang: {len(a)}"',
                },
                {
                  name: { en: 'the axis runs the full width', id: 'sumbunya membentang penuh' },
                  assert:
                    'a = gambar({"jumlah": 6})\nsumbu = a[0]\nassert sumbu.get("x1") == 20 and sumbu.get("x2") == 300 and sumbu.get("y1") == 120 and sumbu.get("y2") == 120, f"sumbunya salah: {sumbu}"',
                },
                {
                  name: { en: 'ticks are 40 apart, starting at 20', id: 'goresan berjarak 40, dimulai dari 20' },
                  assert:
                    'a = gambar({"jumlah": 6})\ngoresan = [p for p in a if p is not a[0]]\nxs = sorted(p.get("x1") for p in goresan)\nassert xs == [20, 60, 100, 140, 180, 220], f"posisi goresannya salah: {xs}"',
                },
                {
                  name: { en: 'the count follows the state', id: 'jumlahnya mengikuti keadaan' },
                  assert: 'a = gambar({"jumlah": 3})\nassert len(a) == 4, f"dengan jumlah=3 harus 4 perintah (1 sumbu + 3 goresan), sekarang: {len(a)}"',
                },
                {
                  name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
                  assert: 'k = perbarui({"jumlah": 6}, set(), 0.4)\nassert k.get("jumlah") == 6, "belum ada yang bergerak di pelajaran ini"',
                },
              ],
              hints: [
                { en: 'Start the list with the axis, then append ticks in a loop over range(jumlah).', id: 'Mulai list-nya dengan sumbu, lalu tambahkan goresan dalam perulangan atas range(jumlah).' },
                { en: 'x = 20 + i * 40 for the i-th tick.', id: 'x = 20 + i * 40 untuk goresan ke-i.' },
              ],
              solution:
                'def awal():\n    return {"jumlah": 6}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    perintah = [{"bentuk": "garis", "x1": 20, "y1": 120, "x2": 300, "y2": 120, "tebal": 2}]\n    for i in range(keadaan["jumlah"]):\n        x = 20 + i * 40\n        perintah.append({"bentuk": "garis", "x1": x, "y1": 115, "x2": x, "y2": 125, "tebal": 1})\n    return perintah',
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
                en: 'Marking the value 3 means converting 3 into an x coordinate first — the same spacing formula as a tick: `x = 20 + nilai * 40`. A `lingkaran` at that x, sitting right on the axis, is the mark.',
                id: 'Menandai nilai 3 berarti mengubah 3 jadi koordinat x lebih dulu — formula spasi yang sama seperti goresan skala: `x = 20 + nilai * 40`. `lingkaran` pada x itu, tepat di atas sumbunya, adalah tandanya.',
              },
              code:
                'def gambar(keadaan):\n    nilai = keadaan["nilai"]\n    x = 20 + nilai * 40\n    return [{"bentuk": "lingkaran", "x": x, "y": 120, "r": 6, "warna": "#ef8f70"}]\n\nprint(gambar({"nilai": 3}))',
              output: "[{'bentuk': 'lingkaran', 'x': 140, 'y': 120, 'r': 6, 'warna': '#ef8f70'}]",
            },
            {
              kind: 'concept',
              id: 'c2',
              title: { en: 'A number under the mark', id: 'Angka di bawah tandanya' },
              body: {
                en: 'A `teks` label just below the circle, showing the value as a string, turns a bare dot into something a class can actually read.',
                id: 'Label `teks` tepat di bawah lingkarannya, menampilkan nilainya sebagai string, mengubah titik polos menjadi sesuatu yang benar-benar bisa dibaca satu kelas.',
              },
              code:
                'def gambar(keadaan):\n    nilai = keadaan["nilai"]\n    x = 20 + nilai * 40\n    return [\n        {"bentuk": "lingkaran", "x": x, "y": 120, "r": 6, "warna": "#ef8f70"},\n        {"bentuk": "teks", "x": x - 4, "y": 135, "isi": str(nilai), "ukuran": 12},\n    ]\n\nprint(gambar({"nilai": 2})[1])',
              output: "{'bentuk': 'teks', 'x': 96, 'y': 135, 'isi': '2', 'ukuran': 12}",
            },
            {
              kind: 'quiz',
              id: 'q1',
              prompt: { en: 'With x = 20 + nilai * 40, where does the value 0 land?', id: 'Dengan x = 20 + nilai * 40, di mana nilai 0 mendarat?' },
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
              template: 'nilai = 5\nx = 20 + nilai ___ 40',
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
              lines: ['nilai = 4', 'x = 20 + nilai * 40', 'tanda = {"bentuk": "lingkaran", "x": x, "y": 120, "r": 6}'],
              explain: {
                en: 'x has to be computed from nilai before it can be used to place the circle.',
                id: 'x harus dihitung dari nilai dulu sebelum bisa dipakai untuk menempatkan lingkarannya.',
              },
            },
            {
              kind: 'game',
              id: 'k1',
              prompt: {
                en: 'The state holds `nilai`. Write `awal()` returning `{"nilai": 3}`. Write `gambar` returning a `lingkaran` at `x = 20 + nilai * 40`, `y = 120`, `r = 6`, followed by a `teks` showing `str(nilai)`. Write `perbarui` returning the state unchanged.',
                id: 'Keadaannya menyimpan `nilai`. Tulis `awal()` yang mengembalikan `{"nilai": 3}`. Tulis `gambar` yang mengembalikan `lingkaran` di `x = 20 + nilai * 40`, `y = 120`, `r = 6`, diikuti `teks` yang menampilkan `str(nilai)`. Tulis `perbarui` yang mengembalikan keadaannya tanpa perubahan.',
              },
              starter:
                'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
              tests: [
                {
                  name: { en: 'awal() starts at nilai=3', id: 'awal() mulai di nilai=3' },
                  assert: 'k = awal()\nassert k.get("nilai") == 3, f\'awal()["nilai"] harus 3, sekarang: {k.get("nilai")}\'',
                },
                {
                  name: { en: 'exactly a circle and a label', id: 'tepat satu lingkaran dan satu label' },
                  assert:
                    'a = gambar({"nilai": 3})\nbentuk = [p.get("bentuk") for p in a]\nassert bentuk == ["lingkaran", "teks"], f"harus [lingkaran, teks] berurutan, sekarang: {bentuk}"',
                },
                {
                  name: { en: 'the circle lands at the right x', id: 'lingkarannya mendarat di x yang tepat' },
                  assert: 'a = gambar({"nilai": 3})\nassert a[0].get("x") == 140, f\'x lingkarannya harus 140, sekarang: {a[0].get("x")}\'\nassert a[0].get("y") == 120, "y lingkarannya harus 120, di atas sumbunya"',
                },
                {
                  name: { en: 'the label shows the value', id: 'labelnya menampilkan nilainya' },
                  assert: 'a = gambar({"nilai": 3})\nassert a[1].get("isi") == "3", f\'isi labelnya harus "3", sekarang: {a[1].get("isi")}\'',
                },
                {
                  name: { en: 'a different value moves the mark', id: 'nilai berbeda memindah tandanya' },
                  assert:
                    'a = gambar({"nilai": 5})\nassert a[0].get("x") == 220, f\'dengan nilai=5, x lingkarannya harus 220, sekarang: {a[0].get("x")}\'\nassert a[1].get("isi") == "5", f\'labelnya harus "5", sekarang: {a[1].get("isi")}\'',
                },
                {
                  name: { en: 'nothing moves on its own', id: 'tak ada yang bergerak sendiri' },
                  assert: 'k = perbarui({"nilai": 3}, set(), 0.1)\nassert k.get("nilai") == 3, "belum ada yang bergerak di pelajaran ini"',
                },
              ],
              hints: [
                { en: 'x = 20 + keadaan["nilai"] * 40, exactly the concept\'s formula.', id: 'x = 20 + keadaan["nilai"] * 40, persis formula pada konsepnya.' },
                { en: 'The label\'s isi must be a string: str(keadaan["nilai"]).', id: 'isi labelnya harus string: str(keadaan["nilai"]).' },
              ],
              solution:
                'def awal():\n    return {"nilai": 3}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    nilai = keadaan["nilai"]\n    x = 20 + nilai * 40\n    return [\n        {"bentuk": "lingkaran", "x": x, "y": 120, "r": 6, "warna": "#ef8f70"},\n        {"bentuk": "teks", "x": x - 4, "y": 135, "isi": str(nilai), "ukuran": 12},\n    ]',
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
          { en: 'The state holds `nilai_nilai`, a list of numbers. `awal()` returns `{"nilai_nilai": [1, 4, 6]}`.', id: 'Keadaannya menyimpan `nilai_nilai`, list berisi angka. `awal()` mengembalikan `{"nilai_nilai": [1, 4, 6]}`.' },
          { en: 'gambar draws the axis (x1=20, y1=120, x2=300, y2=120), then one lingkaran for every value in nilai_nilai, at x = 20 + nilai * 40, y = 120, r = 6.', id: 'gambar menggambar sumbunya (x1=20, y1=120, x2=300, y2=120), lalu satu lingkaran untuk tiap nilai di nilai_nilai, pada x = 20 + nilai * 40, y = 120, r = 6.' },
          { en: 'perbarui returns the state unchanged.', id: 'perbarui mengembalikan keadaannya tanpa perubahan.' },
        ],
        starter: 'def awal():\n    return {}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    return []\n',
        tests: [
          {
            name: { en: 'awal() starts with [1, 4, 6]', id: 'awal() mulai dengan [1, 4, 6]' },
            assert: 'k = awal()\nassert k.get("nilai_nilai") == [1, 4, 6], f"awal() salah: {k}"',
          },
          {
            name: { en: 'axis plus one mark per value', id: 'sumbu ditambah satu tanda per nilai' },
            assert: 'a = gambar({"nilai_nilai": [1, 4, 6]})\nassert len(a) == 4, f"harus 4 perintah (1 sumbu + 3 tanda), sekarang: {len(a)}"',
          },
          {
            name: { en: 'the axis comes first, spanning the full width', id: 'sumbunya di urutan pertama, membentang penuh' },
            assert: 'a = gambar({"nilai_nilai": [1, 4, 6]})\nassert a[0].get("bentuk") == "garis" and a[0].get("x1") == 20 and a[0].get("x2") == 300, f"sumbunya salah: {a[0]}"',
          },
          {
            name: { en: 'each mark lands at the right x', id: 'tiap tanda mendarat di x yang tepat' },
            assert:
              'a = gambar({"nilai_nilai": [1, 4, 6]})\ntitik = [p for p in a if p.get("bentuk") == "lingkaran"]\nxs = sorted(p.get("x") for p in titik)\nassert xs == [60, 180, 260], f"posisi tandanya salah, diharap [60, 180, 260]: {xs}"',
          },
          {
            name: { en: 'a different list changes the count and positions', id: 'list berbeda mengubah jumlah dan posisinya' },
            assert:
              'a = gambar({"nilai_nilai": [0, 2]})\nassert len(a) == 3, f"dengan 2 nilai harus 3 perintah, sekarang: {len(a)}"\ntitik = sorted(p.get("x") for p in a if p.get("bentuk") == "lingkaran")\nassert titik == [20, 100], f"posisi tandanya salah, diharap [20, 100]: {titik}"',
          },
          {
            name: { en: 'nothing moves', id: 'tak ada yang bergerak' },
            assert: 'k = perbarui({"nilai_nilai": [1, 4, 6]}, set(), 0.5)\nassert k.get("nilai_nilai") == [1, 4, 6], "belum ada yang bergerak di proyek ini"',
          },
        ],
        hints: [
          { en: 'Start the list with the axis, then loop over nilai_nilai appending one lingkaran per value.', id: 'Mulai list-nya dengan sumbu, lalu ulangi atas nilai_nilai menambahkan satu lingkaran per nilai.' },
          { en: 'The same x formula as the lesson: 20 + nilai * 40.', id: 'Formula x yang sama seperti di pelajaran: 20 + nilai * 40.' },
        ],
        solution:
          'def awal():\n    return {"nilai_nilai": [1, 4, 6]}\n\ndef perbarui(keadaan, tombol, dt):\n    return keadaan\n\ndef gambar(keadaan):\n    perintah = [{"bentuk": "garis", "x1": 20, "y1": 120, "x2": 300, "y2": 120, "tebal": 2}]\n    for nilai in keadaan["nilai_nilai"]:\n        x = 20 + nilai * 40\n        perintah.append({"bentuk": "lingkaran", "x": x, "y": 120, "r": 6, "warna": "#ef8f70"})\n    return perintah',
        xp: 50,
      },
    },
  ],
}
